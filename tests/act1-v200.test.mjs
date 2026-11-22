// v2.0.0 (D-115, REFORM_DESIGN §2.4/§3.4): the ACT I rules that tests/rules.test.mjs pinned on the old 12×10 M01 map,
// re-pinned on the big 22×16 map and the ratio formula. The mechanics are the same (terrain costs, ruins, deployment,
// undo, Hawk Eye, low-HP fire, flank, counters, healing, growth, rescue, waves, the civilians' safe window, fire);
// the numbers are computed from the formula instead of being typed in.
import test from 'node:test';import assert from 'node:assert/strict';
import {newGame,setDeployment,presetDeployment,startBattle,moveUnit,undoMove,performAction,beginEnemyPhase,advanceEnemy,planEnemy,checkOutcome} from '../src/core/game.js';
import {movement,pathTo,findUnit,at,alive,forecast,strikeStats,awardXP,terrainAt,skillCost,terrainCost} from '../src/core/rules.js';
import {missionOf,MISSIONS} from '../src/data/missions.js';
import {effectiveStats} from '../src/core/economy.js';
import {ratioDamage,derivedFrom,classKeyOf} from '../src/core/stats8.js';
import {SKILL_MUL} from '../src/data/classes8.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
const battle=(seed=1)=>{const s=newGame(seed);s.screen='deployment';startBattle(s);return s;};
const position=(s,id,x,y)=>{const u=findUnit(s,id);u.x=x;u.y=y;return u;};
// keeps only the named enemies on the field so a test sees one exchange
const only=(s,...ids)=>{s.units=s.units.filter(u=>u.team!=='enemy'||ids.includes(u.id));return s;};
const expected=(s,u,t,mode)=>{const a=effectiveStats(s,u),d=effectiveStats(s,t),f=strikeStats(s,u,t,mode),g=terrainAt(t.x,t.y,s);return {f,a,d,g};};

test('M01 is 22×16 with the five heroes (v2.1: no officers at the start — tavern hires), the raiders and two villagers',()=>{const s=newGame(),m=missionOf(s);
 assert.equal(m.map.length,16);assert.ok(m.map.every(r=>r.length===22));
 assert.deepEqual(s.units.filter(u=>u.team==='ally').map(u=>u.id).sort(),['elina','eric','kai','lia','sain']);
 assert.equal(s.units.filter(u=>u.team==='civilian').length,2);assert.ok(s.units.filter(u=>u.team==='enemy').length>=10);
 assert.ok(s.units.some(u=>u.team==='enemy'&&u.y<=4)&&s.units.some(u=>u.team==='enemy'&&u.x>=18),'raiders come from the north road and the east road');});

// v2.6.0 (D-152): a forest takes the rest of a foot soldier's move; riders cannot enter it (tests/terrain-v260.test.mjs)
test('Dijkstra: a forest stops infantry (the whole move), 1 for the rogue, closed to riders',()=>{const s=battle(),e=position(s,'eric',4,6),k=findUnit(s,'kai');
 assert.equal(terrainAt(5,6,s).name,'Forest');assert.equal(movement(s,e).costs.get('5,6'),effectiveStats(s,e).mov);
 assert.equal(terrainCost(s,e,5,6),2);assert.equal(terrainCost(s,k,5,6),1);assert.equal(terrainCost(s,{...e,movementProfile:'cavalry'},5,6),Infinity);});

test('ruins, occupied tiles and the map edge cannot be entered',()=>{const s=battle(),e=position(s,'eric',9,4);
 assert.equal(terrainAt(10,4,s).name,'Ruin');assert.equal(pathTo(s,e,10,4),null);assert.equal(pathTo(s,e,-1,4),null);
 const l=findUnit(s,'lia');assert.equal(pathTo(s,findUnit(s,'kai'),l.x,l.y),null);assert.ok(pathTo(s,e,9,5));});

test('free deployment swaps inside the zone; presets give each hero a unique tile',()=>{const s=newGame();s.screen='deployment';const e=findUnit(s,'eric'),l=findUnit(s,'lia'),o={x:e.x,y:e.y};
 assert.ok(setDeployment(s,'eric',l.x,l.y));assert.deepEqual({x:l.x,y:l.y},o);assert.equal(setDeployment(s,'eric',0,0),false);
 for(const name of ['recommended','assault','defense']){const t=newGame();t.screen='deployment';presetDeployment(t,name);const al=t.units.filter(u=>u.team==='ally');assert.equal(new Set(al.map(u=>`${u.x},${u.y}`)).size,al.length);assert.ok(startBattle(t));}});

test('move once and undo before an irreversible action',()=>{const s=battle(),e=findUnit(s,'eric'),o=[e.x,e.y];
 assert.ok(moveUnit(s,'eric',6,10));assert.equal(moveUnit(s,'eric',7,10),null);assert.ok(undoMove(s,'eric'));assert.deepEqual([e.x,e.y],o);
 moveUnit(s,'eric',6,10);performAction(s,'eric','wait');assert.equal(undoMove(s,'eric'),false);});

test('the ratio formula: magic against 마법 방어, steel against 방어, terrain apart; doubling both doubles the blow',()=>{const s=battle(),l=position(s,'lia',3,4),t=position(s,'b1',3,5);
 const {f,a,d,g}=expected(s,l,t,'skill');let want=Math.max(1,Math.round(ratioDamage(a.mag,d.res+(g.defense||0))*(g.fire??1)));if(f.arms!==1)want=Math.max(1,Math.round(want*f.arms));assert.equal(f.damage,want);
 const p=strikeStats(s,l,t);let pw=Math.max(1,Math.round(ratioDamage(a.atk,d.def)*(1-(g.phys||0))));if(p.arms!==1)pw=Math.max(1,Math.round(pw*p.arms));assert.equal(p.damage,pw);
 assert.equal(ratioDamage(40,20)*2,ratioDamage(80,40));
 const e=position(s,'eric',4,6),plain=strikeStats(s,e,{...t,x:4,y:5}),forest=strikeStats(s,e,{...t,x:5,y:6});assert.ok(forest.damage<=plain.damage);assert.ok(forest.hit<=plain.hit);});

test('Hawk Eye: Elina shooting from a forest or a roof aims 12 better',()=>{const s=battle(),e=position(s,'elina',5,6),t=position(s,'b1',5,8);t.spd=e.spd+15;
 assert.equal(terrainAt(5,6,s).name,'Forest');const forest=strikeStats(s,e,t).hit;e.x=4;assert.equal(terrainAt(4,6,s).name,'Grass');assert.equal(forest-strikeStats(s,e,t).hit,12);});

test('Unstable Mana: at half HP or less fire hits ×1.25 and costs 1 more',()=>{const s=battle(),l=position(s,'lia',3,4),t=position(s,'b1',3,5),cost=skillCost(l);
 const full=strikeStats(s,l,t,'skill').damage;l.hp=Math.floor(l.maxHP/2);const {f,a,d,g}=expected(s,l,t,'skill');
 let want=Math.max(1,Math.round(ratioDamage(a.mag,d.res)*SKILL_MUL.lowHPFire*(g.fire??1)));if(f.arms!==1)want=Math.max(1,Math.round(want*f.arms));
 assert.equal(f.damage,want);assert.ok(f.damage>full);assert.equal(skillCost(l),cost+1);});

test('Quick Strike flank needs a teammate on the opposite side',()=>{const s=battle(),k=position(s,'kai',14,7),t=position(s,'b1',15,7);position(s,'r2',15,9);
 const base=strikeStats(s,k,t,'skill');assert.equal(base.flank,false);position(s,'eric',16,7);const fl=strikeStats(s,k,t,'skill');assert.equal(fl.flank,true);
 assert.ok(Math.abs(fl.damage-base.damage*SKILL_MUL.quickFlank)<=1.5,`${fl.damage} ≈ ${base.damage}×${SKILL_MUL.quickFlank}`);position(s,'eric',15,6);assert.equal(strikeStats(s,k,t,'skill').flank,false);});

test('the counter in the forecast is the defender\'s own blow, and counters never chain',()=>{const s=only(battle(42),'b1'),e=position(s,'eric',14,10),t=position(s,'b1',15,10);
 const f=forecast(s,e,t);assert.ok(f.counter>0);assert.equal(f.counter,strikeStats(s,t,e).damage);
 assert.ok(performAction(s,'eric','attack','b1').ok);assert.ok(s.feedback.filter(x=>['hit','critical','miss'].includes(x.type)).length<=3,'blow, counter and at most one follow-up');assert.ok(e.acted);});

test('healing caps HP, scales with 의지 and gives more EXP for more healing',()=>{const s=battle(),sain=position(s,'sain',5,9),e=position(s,'eric',5,10);e.hp-=15;
 assert.ok(performAction(s,'sain','skill','eric').ok);assert.ok(e.hp<=e.maxHP);assert.ok(e.hp>e.maxHP-15);const xp1=sain.earnedXP;assert.ok(xp1>0);
 sain.acted=false;e.hp=e.maxHP-1;performAction(s,'sain','skill','eric');assert.ok(sain.earnedXP-xp1<xp1,'a 1-HP heal earns less');
 const v=effectiveStats(s,sain);assert.equal(v.healPow,Math.round(derivedFrom('healer',sain.stats,sain.level).healPow));});

test('growth: two levels add the class growth to the six stats and re-derive the numbers',()=>{const s=battle(),e=findUnit(s,'eric'),before={...e.stats};
 awardXP(s,e,215,'test');assert.equal(e.level,3);assert.equal(e.xp,15);assert.equal(e.growthHistory.length,2);
 for(const k of Object.keys(before))assert.ok(e.stats[k]>=before[k],k);assert.ok(e.stats.str>before.str);
 const d=derivedFrom(classKeyOf(e),e.stats,e.level);assert.equal(e.maxHP,d.maxHP);assert.equal(e.atk,d.atk);assert.equal(e.def,d.def);});

test('rescue requires adjacency and frees the villager\'s tile',()=>{const s=battle(),k=position(s,'kai',8,6),c=findUnit(s,'c2');
 assert.ok(performAction(s,'kai','rescue','c2').ok);assert.ok(c.rescued);assert.equal(at(s,c.x,c.y),undefined);assert.ok(k.earnedXP>0);k.acted=false;assert.equal(performAction(s,'kai','rescue','c2').ok,false);
 const far=battle();assert.equal(performAction(far,'kai','rescue','c1').ok,false);});

test('the northern wave arrives on turn 3 at the sortie\'s level',()=>{const s=battle();for(let turn=1;turn<=2;turn++){beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome)advanceEnemy(s);}
 assert.equal(s.turn,3);assert.equal(s.phase,'player');const n1=findUnit(s,'n1'),n2=findUnit(s,'n2');assert.ok(n1&&n2,'two raiders from the north');assert.ok(n1.y<=3&&n2.y<=3);assert.equal(n1.level,Math.max(n1.base.level-2,Math.round(s.levelPlan.avg)));});

test('the villagers are safe from attack until turn 6 (v2.0.0: one turn more on the big map)',()=>{const s=only(battle(),'b3'),b=position(s,'b3',16,6);s.turn=5;assert.notEqual(planEnemy(s,b).target,'c1');s.turn=6;assert.equal(planEnemy(s,b).target,'c1');});

// v2.6.1 (the user's request 2026-11-22 22:33): fire stays only in a forest — always there — and burns for 20% of the hit that lit it
test('Fire Bolt leaves no fire on grass; in a forest it always does, burning 20% of the hit at the start of a turn, never killing',()=>{
 const fire=(tx,ty)=>{const s=battle(31),l=position(s,'lia',tx+2,ty),t=position(s,'b1',tx,ty);t.hp=t.maxHP;for(const u of s.units)if(u.team==='enemy'&&u.id!=='b1'){u.hold=1;u.atk=1;}
  let dealt=0;for(let i=0;i<20&&!dealt;i++){l.acted=false;l.mp=l.maxMP;s.rng=1000+i;const before=t.hp;performAction(s,'lia','skill','b1');dealt=before-t.hp;if(!alive(t))break;}return {s,t,dealt};};
 {const {s,dealt}=fire(3,5);assert.equal(terrainAt(3,5,s).name,'Grass');assert.ok(dealt>0);assert.equal(s.burning?.['3,5'],undefined,'no fire on grass');}
 const {s,t,dealt}=fire(2,4);assert.equal(terrainAt(2,4,s).name,'Forest');assert.ok(dealt>0);assert.equal(s.burning['2,4'],2,'a forest always catches');assert.ok(Math.abs(s.burnHeat['2,4']-dealt*.2)<=1.5,`20% of the hit (${s.burnHeat['2,4']} for ${dealt})`);
 t.hp=t.maxHP;const hp=t.hp;beginEnemyPhase(s);assert.equal(hp-t.hp,s.burnHeat['2,4'],'the foe standing in it burns at the start of its turn');while(s.phase==='enemy')advanceEnemy(s);assert.equal(s.burning['2,4'],1);
 const e=position(s,'eric',2,4);t.hold=1;t.x=3;t.y=13;e.hp=1;beginEnemyPhase(s);while(s.phase==='enemy')advanceEnemy(s);assert.equal(s.burning?.['2,4'],undefined);assert.equal(s.burnHeat?.['2,4'],undefined);assert.ok(e.hp>=1,'fire never kills');assert.ok(deserialize(serialize(s)));});

test('victory needs both villagers and Garr; a fallen villager is a defeat',()=>{const s=battle();findUnit(s,'boss').hp=0;assert.equal(checkOutcome(s),null);findUnit(s,'c1').rescued=true;findUnit(s,'c2').rescued=true;assert.equal(checkOutcome(s),'victory');
 const d=battle();findUnit(d,'c1').hp=0;assert.equal(checkOutcome(d),'defeat');});

test('every ACT I preset tile lies inside its mission\'s deployment zone and on open ground',async()=>{const {MISSIONS}=await import('../src/data/missions.js');
 for(const id of [1,2,3,4,5,6]){const s=newGame(1,{heroes:null,results:[],clears:id-1,completed:[1,2,3,4,5,6].slice(0,id-1),flags:{}},id),m=MISSIONS[id],zone=m.deployZone(s);
  for(const [name,preset] of Object.entries(m.deployments)){assert.ok(preset.length>=8,`M${id} ${name} has room for the whole party`);for(const [x,y] of preset){assert.ok(zone.has(`${x},${y}`),`M${id} ${name} ${x},${y}`);assert.ok(Number.isFinite(terrainAt(x,y,s)?.cost),`M${id} ${x},${y} open`);}}}});

test('difficulty: 어려움 carries one potion and bigger waves (ACT I troops at 보통\'s numbers, D-116); a change in camp applies at the next battle start, and both saves validate',()=>{
 const camp=d=>({heroes:null,results:[],clears:0,completed:[],flags:{},difficulty:d});
 const h=newGame(2,camp('hard'),1);h.screen='deployment';startBattle(h);assert.equal(h.potions,1);assert.equal(h.levelPlan.difficulty,'hard');assert.ok(deserialize(serialize(h)));
 const n=newGame(2,camp('normal'),1);n.screen='deployment';startBattle(n);const lv=u=>findUnit(u,'b1').level;assert.equal(lv(h),lv(n));assert.equal(findUnit(h,'b1').atk,findUnit(n,'b1').atk);
 assert.ok(h.units.filter(u=>u.team==='enemy').length>=n.units.filter(u=>u.team==='enemy').length,'never fewer enemies on 어려움');
 const s=newGame(1,camp('hard'),1);s.campaign.difficulty='normal';s.screen='deployment';startBattle(s);assert.equal(s.potions,2);assert.ok(deserialize(serialize(s)),'the stage start agrees with the difficulty');});

test('어려움: a wave brings a quarter more (copies, never commanders) and the battle still saves and reloads',async()=>{
 const {spawnWave}=await import('../src/core/mission-rules.js');
 for(const id of [1,3,4,5,6]){const s=newGame(5,{heroes:null,results:[],clears:0,completed:[],flags:{},difficulty:'hard'},id);s.screen='deployment';startBattle(s);
  const before=s.units.length;for(const w of MISSIONS[id].waves)spawnWave(s,w.units);const added=s.units.length-before,authored=MISSIONS[id].waves.reduce((a,w)=>a+w.units.length,0);
  assert.ok(added>authored,`M${id} hard waves are bigger`);assert.ok(s.units.filter(u=>/h\d+$/.test(u.id)).every(u=>!['captain','lion'].includes(u.kind)),'no commander copies');
  const back=deserialize(serialize(s));assert.equal(back.units.length,s.units.length,`M${id} saves with the extra soldiers`);}});
