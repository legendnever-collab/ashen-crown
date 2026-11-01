// v0.8.0 「전술」 (D-073): three skills per hero, the four status effects, targeted and thrown tools, class matchups,
// tool stock by progress, and schema 10 saves.
import test from 'node:test';import assert from 'node:assert/strict';
import {newGame,startBattle,performAction,beginEnemyPhase,advanceEnemy,moveUnit} from '../src/core/game.js';
import {findUnit,alive,movement,strikeStats,matchup,armOf,distance} from '../src/core/rules.js';
import {skillsOf,knowsMode} from '../src/data/skills.js';
import {validClassTarget,classTargetCells,forecastClass,isClassMode,tileTarget} from '../src/core/class-actions.js';
import {throwsLeft,THROW_LIMIT,TOOL_USE} from '../src/core/tactics.js';
import {TOOLS,toolStock} from '../src/data/frontier-data.js';
import {CATALOG_TOOLS,CATALOG_SKILLS} from '../src/data/catalog-v08.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {SCHEMA} from '../src/data/game-data.js';
import {drain} from './campaign-policy.mjs';
const camp=(extra={})=>({heroes:null,results:[],clears:0,completed:[],flags:{},choices:{},roster:[],...extra});
// A quiet board: M01 with every enemy but the ones a test places, heroes at a chosen level.
function board(level=4,mission=1,extra={}){const s=newGame(11,camp(extra),mission);s.screen='deployment';startBattle(s);drain(s);for(const u of s.units.filter(u=>u.team==='ally'))u.level=level;
 for(const e of s.units.filter(u=>u.team==='enemy'))e.hp=0;return s;}
const foe=(s,id,x,y,more={})=>{const e=s.units.find(u=>u.team==='enemy'&&u.id===id)||s.units.find(u=>u.team==='enemy');Object.assign(e,{hp:e.maxHP,x,y,...more});return e;};
const place=(u,x,y)=>{u.x=x;u.y=y;u.moved=false;u.acted=false;};
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};

test('catalog: 13 tools match the game tools, 24 skills (three per hero), unique ids',()=>{
 assert.deepEqual(CATALOG_TOOLS.map(t=>t.id).sort(),Object.keys(TOOLS).sort());for(const t of CATALOG_TOOLS)assert.equal(TOOLS[t.id].name,t.ko,t.id);
 assert.equal(CATALOG_SKILLS.length,24);for(const h of ['eric','elina','lia','sain','kai','thea','dario','ines'])assert.deepEqual(CATALOG_SKILLS.filter(k=>k.hero===h).map(k=>k.slot),[1,2,3],h);
});

test('skills open by level: ① always, ② at Lv 4 (recruits on joining), ③ on promotion (recruits at join level + 3)',()=>{
 const s=board(1),eric=findUnit(s,'eric');let k=skillsOf(eric);assert.deepEqual(k.map(x=>x.open),[true,false,false]);assert.match(k[1].lock,/Lv 4/);
 eric.level=4;assert.deepEqual(skillsOf(eric).map(x=>[x.mode,x.open]),[['skill',true],['provoke',true],['bulwark',false]]);eric.classTier=2;assert.ok(skillsOf(eric)[2].open);
 const thea={id:'thea',team:'ally',level:8};assert.deepEqual(skillsOf(thea).map(x=>x.open),[true,true,false]);thea.level=11;assert.ok(skillsOf(thea)[2].open);
 assert.ok(isClassMode('provoke')&&isClassMode('tool:bomb')&&tileTarget('flameBurst')&&tileTarget('tool:bomb')&&!tileTarget('tool:net'));
 eric.level=3;const e=foe(s,'b1',eric.x,eric.y-2);assert.ok(!validClassTarget(s,eric,e,'provoke'),'locked below Lv 4');
});

test('provoke: the enemy goes for Erik next phase; Erik DEF +2 until then',()=>{
 const s=board(),eric=findUnit(s,'eric'),lia=findUnit(s,'lia');place(eric,5,6);place(lia,8,6);const e=foe(s,'b1',7,5,{mov:3});
 const def=strikeStats(s,e,eric).damage;assert.ok(performAction(s,'eric','provoke','b1').ok);assert.equal(e.provokedBy.id,'eric');assert.ok(strikeStats(s,e,eric).damage<def,'DEF +2');
 const hpLia=lia.hp,hpEric=eric.hp;enemyPhase(s);assert.equal(lia.hp,hpLia,'Lia untouched');assert.ok(eric.hp<hpEric||distance(e,eric)===1,'went for Erik');assert.ok(!e.provokedBy,'expires');
});

test('pinning shot binds (no movement next enemy phase); bound heroes cannot move either',()=>{
 const s=board(),el=findUnit(s,'elina');place(el,5,8);const e=foe(s,'b1',5,6,{mov:3});s.rng=1;let tries=0;
 while(!e.status?.bind&&tries++<20){el.acted=false;el.mp=el.maxMP;e.hp=e.maxHP;performAction(s,'elina','pinningShot','b1');}
 assert.ok(e.status.bind,'bound after a hit');assert.equal(movement(s,e).costs.size,1,'cannot move');
 const kai=findUnit(s,'kai');kai.status={bind:1};assert.equal(movement(s,kai).costs.size,1);
});

test('flame burst: cross of five around a tile 2–3 away, enemies only, 50% magic, no counter, grass burns',()=>{
 const s=board(),lia=findUnit(s,'lia'),eric=findUnit(s,'eric');place(lia,5,8);place(eric,5,5);const a=foe(s,'b1',5,6),b=s.units.find(u=>u.team==='enemy'&&u!==a);Object.assign(b,{hp:b.maxHP,x:4,y:6});
 const f=forecastClass(s,lia,'5,6','flameBurst');assert.match(f.rows[0][1],/적 2명/);const ehp=eric.hp,lhp=lia.hp;
 assert.ok(performAction(s,'lia','flameBurst','5,6').ok);assert.equal(eric.hp,ehp,'allies untouched');assert.equal(lia.hp,lhp,'no counter');assert.equal(lia.mp,lia.maxMP-8);
 assert.ok(!validClassTarget(s,lia,'5,7','flameBurst'),'too close (distance 1)');
});

test('purify and the pilgrim lantern clear statuses and give immunity until the enemy phase ends',()=>{
 const s=board(),sain=findUnit(s,'sain'),kai=findUnit(s,'kai');place(sain,5,8);place(kai,5,6);kai.status={poison:3,silence:2};kai.hp-=10;
 assert.ok(performAction(s,'sain','purify','kai').ok);assert.ok(!kai.status);assert.equal(kai.immuneUntil,s.turn);
 const st=board(13,1,{roster:['ines']}),ines=findUnit(st,'ines');ines.benched=false;place(ines,5,8);const el=findUnit(st,'elina');place(el,6,8);el.status={bind:1};
 assert.ok(performAction(st,'ines','pilgrimLantern','ines').ok);assert.ok(!el.status);
});

test('poison: venom edge poisons; 10% of max HP (3–8) at the start of each own phase for three, never below 1',()=>{
 const s=board(),kai=findUnit(s,'kai');place(kai,5,7);const e=foe(s,'b1',5,6,{mov:0,atk:0});s.rng=5;let tries=0;
 while(!e.status?.poison&&tries++<20){kai.acted=false;kai.mp=kai.maxMP;e.hp=e.maxHP;performAction(s,'kai','venomEdge','b1');}
 assert.equal(e.status.poison,3);const hp=e.hp;beginEnemyPhase(s);assert.equal(e.hp,hp-Math.max(3,Math.min(8,Math.floor(e.maxHP*.1))));
 e.hp=2;e.status.poison=3;s.phase='player';beginEnemyPhase(s);assert.equal(e.hp,1,'never lethal');
});

test('breakthrough pushes the target a tile (blocked: +3 damage); whirlwind hits every adjacent foe without counters',()=>{
 const s=board(11,1,{roster:['thea','dario']}),thea=findUnit(s,'thea'),dario=findUnit(s,'dario');for(const u of [thea,dario])u.benched=false;
 place(thea,5,8);const e=foe(s,'b1',5,7,{def:0,hp:99,maxHP:99});s.rng=3;let n=0;while(e.y===7&&n++<10){thea.acted=false;thea.mp=thea.maxMP;performAction(s,'thea','breakthrough','b1');}assert.equal(e.y,6,'pushed north');
 place(dario,2,8);const a=foe(s,'b1',2,7,{hp:99,maxHP:99}),b=s.units.find(u=>u.team==='enemy'&&u!==a);Object.assign(b,{hp:99,maxHP:99,x:3,y:8});const dhp=dario.hp;
 assert.ok(performAction(s,'dario','whirlwind','dario').ok);assert.equal(dario.hp,dhp,'no counter');
});

test('rally cry: allies within 2 get MOV +1 and hit +10 through the next player phase; feint weakens; flame brand lowers DEF',()=>{
 const s=board(13,1,{roster:['thea','dario','ines']}),thea=findUnit(s,'thea');thea.benched=false;place(thea,5,8);const kai=findUnit(s,'kai');place(kai,6,8);const mov=movement(s,kai).costs.size;
 assert.ok(performAction(s,'thea','rallyCry','thea').ok);assert.ok(movement(s,kai).costs.size>mov);
 const dario=findUnit(s,'dario');dario.benched=false;place(dario,2,8);const e=foe(s,'b1',2,7,{hp:99,maxHP:99});s.rng=9;let n=0;while(!e.atkDown&&n++<10){dario.acted=false;dario.mp=dario.maxMP;performAction(s,'dario','feint','b1');}assert.equal(e.atkDown.n,4);
 const ines=findUnit(s,'ines');ines.benched=false;place(ines,9,8);const f=foe(s,'b2',9,7,{hp:99,maxHP:99});n=0;while(!f.defDown&&n++<10){ines.acted=false;ines.mp=ines.maxMP;performAction(s,'ines','flameBrand',f.id);}assert.equal(f.defDown.n,3);
});

test('silence blocks every skill but not tools; confusion makes an enemy strike the nearest unit, friend or foe',()=>{
 const s=board(),eric=findUnit(s,'eric');place(eric,5,8);eric.status={silence:2};assert.equal(performAction(s,'eric','skill','eric').ok,false);
 s.economy.items.herb=1;eric.hp-=5;assert.ok(performAction(s,'eric','tool:herb','eric').ok,'tools still work');
 const t=board(),a=foe(t,'b1',3,3,{mov:3}),b=t.units.find(u=>u.team==='enemy'&&u!==a);Object.assign(b,{hp:b.maxHP,x:3,y:4,mov:3});a.status={confuse:1};const bhp=b.hp;
 for(const u of t.units.filter(u=>u.team==='ally'))place(u,u.x,9);enemyPhase(t);assert.ok(b.hp<bhp||a.x===3&&a.y===3,'struck its neighbour');assert.ok(!a.status,'one phase');
});

test('tools: on self or an adjacent ally only; three throws a battle; bombs hurt enemies in the cross; smoke and caltrops',()=>{
 const s=board(),eric=findUnit(s,'eric'),kai=findUnit(s,'kai');place(eric,5,8);place(kai,6,8);kai.hp-=20;s.economy.items.herb=2;
 assert.ok(validClassTarget(s,eric,kai,'tool:herb'));place(kai,7,8);assert.ok(!validClassTarget(s,eric,kai,'tool:herb'),'two tiles away');place(kai,6,8);
 assert.ok(performAction(s,'eric','tool:herb','kai').ok);assert.equal(s.economy.items.herb,1);
 s.economy.items.bomb=4;const e=foe(s,'b1',5,5,{def:6});const hp=e.hp;place(eric,5,8);assert.ok(performAction(s,'eric','tool:bomb','5,5').ok);assert.equal(e.hp,hp-(16-3));assert.equal(throwsLeft(s),THROW_LIMIT-1);
 s.throws=THROW_LIMIT;const lia=findUnit(s,'lia');place(lia,2,8);assert.ok(!validClassTarget(s,lia,'2,5','tool:bomb'),'limit reached');
 const t=board(),el=findUnit(t,'elina');place(el,5,8);t.economy.items.smoke=1;t.economy.items.caltrops=1;const e2=foe(t,'b1',5,3,{mov:4,range:[1,1]});
 const before=strikeStats(t,e2,el).hit;assert.ok(performAction(t,'elina','tool:smoke','5,6').ok);place(el,5,7);assert.ok(strikeStats(t,e2,el).hit<before,'smoke');
 const u=findUnit(t,'kai');place(u,2,8);assert.ok(performAction(t,'kai','tool:caltrops','2,5').ok);assert.ok(t.traps.some(p=>p.x===2&&p.y===5));
});

test('class matchups: cavalry > infantry > archers > cavalry (±20%), spears beat cavalry; mages and irregulars are neutral',()=>{
 assert.equal(armOf({team:'ally',id:'thea'}),'cavalry');assert.equal(armOf({team:'enemy',kind:'spear'}),'spear');assert.equal(armOf({team:'ally',id:'lia'}),null);
 assert.equal(matchup({team:'ally',id:'thea'},{team:'enemy',kind:'soldier'}),1.2);assert.equal(matchup({team:'ally',id:'thea'},{team:'enemy',kind:'bandit'}),1,'bandits are irregulars');assert.equal(matchup({team:'enemy',kind:'spear'},{team:'ally',id:'thea'}),1.2);
 assert.equal(matchup({team:'ally',id:'elina'},{team:'enemy',kind:'cavalry'}),1.2);assert.equal(matchup({team:'enemy',kind:'archer'},{team:'ally',id:'eric'}),.8);assert.equal(matchup({team:'ally',id:'lia'},{team:'enemy',kind:'soldier'}),1);
});

test('tool stock opens with progress (net after M01, drum/caltrops after M06, bomb/smoke/clarity after M08, powder after M09); never the elixir',()=>{
 assert.deepEqual(toolStock({completed:[]}).sort(),['antidote','ether','herb','medium','ward']);assert.ok(toolStock({completed:[1]}).includes('net'));
 const late=toolStock({completed:[1,2,3,4,5,6,7,8,9]});for(const id of ['drum','caltrops','bomb','smoke','clarity','bewilder'])assert.ok(late.includes(id),id);assert.ok(!late.includes('elixir'));
 for(const [id,u] of Object.entries(TOOL_USE))assert.ok(TOOLS[id],id);
});

test('schema 10 saves keep statuses, marks and throws; damaged status records are rejected',()=>{
 const s=board(),eric=findUnit(s,'eric');eric.status={poison:2};eric.rally=s.turn+1;s.throws=2;s.smoke=[{x:1,y:1,until:1}];s.traps=[{x:2,y:2}];
 const back=deserialize(serialize(s));assert.equal(back.schema,SCHEMA);assert.equal(SCHEMA,10);assert.deepEqual(findUnit(back,'eric').status,{poison:2});assert.equal(back.throws,2);assert.deepEqual(back.traps,[{x:2,y:2}]);
 for(const bad of [x=>{findUnit(x,'eric').status={sleep:1};},x=>{findUnit(x,'eric').status={poison:9};},x=>{x.throws=7;},x=>{x.traps=[{x:'a'}];}]){const b=structuredClone(s);bad(b);assert.throws(()=>deserialize(serialize(b)));}
});

test('ACT II enemy weapons leave statuses: ash raiders poison, monastery guards bind, the abbot silences, masked raiders confuse',async()=>{
 const {enemyStatusOnHit}=await import('../src/core/tactics.js');
 assert.deepEqual(enemyStatusOnHit({team:'enemy',look:'ashRaider',kind:'bandit'}),['poison',30]);assert.deepEqual(enemyStatusOnHit({team:'enemy',look:'monasteryGuard',kind:'spear'}),['bind',25]);
 assert.deepEqual(enemyStatusOnHit({team:'enemy',look:'abbot',kind:'captain'}),['silence',50]);assert.deepEqual(enemyStatusOnHit({team:'enemy',look:'maskedRaider'}),['confuse',25]);assert.equal(enemyStatusOnHit({team:'enemy',kind:'bandit'}),null);
});
