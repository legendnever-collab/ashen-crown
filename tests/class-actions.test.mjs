// v0.5.0 Phase D: the five promotion actions, tier-2 skill upgrades and enemy handling (D-048).
import test from 'node:test';import assert from 'node:assert/strict';
import {newGame,startBattle,performAction,moveUnit,canMove,canAct,planEnemy,advanceEnemy,beginEnemyPhase} from '../src/core/game.js';
import {findUnit,movement,forecast,guardFor,skillCost,rangeFor,validTarget,terrainCost,key,alive} from '../src/core/rules.js';
import {effectiveStats} from '../src/core/economy.js';
import {applyClass} from '../src/core/progression.js';
import {CLASS_TREE} from '../src/data/classes.js';
import {classActionOf,validClassTarget,classTargetCells,forecastClass,hazardAt} from '../src/core/class-actions.js';
import {drain} from './campaign-policy.mjs';

// M01 battle with every enemy removed except those listed; heroes placed on open ground.
function arena(keep=['b1'],promote=['eric','elina','lia','sain','kai']){
 const s=newGame(7);s.screen='deployment';startBattle(s);drain(s);
 // the M01 boss stays alive (immobile, far corner) so no action ends the battle by victory
 for(const u of s.units)if(u.team==='enemy'&&!keep.includes(u.id)&&u.id!=='boss')u.hp=0;const boss=findUnit(s,'boss');boss.mov=0;boss.x=15;boss.y=0;
 for(const u of s.units.filter(u=>u.team==='civilian'))u.rescued=true;
 for(const id of promote){const u=findUnit(s,id);applyClass(u,CLASS_TREE[id][1]);u.mp=u.maxMP;}
 return s;}
const open=(s,u,x,y)=>Number.isFinite(terrainCost(s,u,x,y));
function place(s,id,x,y){const u=findUnit(s,id);for(const o of s.units)if(o!==u&&alive(o)&&o.x===x&&o.y===y){o.x=-50-Math.random();o.y=-50;}u.x=x;u.y=y;assert.ok(open(s,u,x,y),`${id} on open ground at ${x},${y}`);return u;}
const park=(s,ids)=>{let i=0;for(const id of ids){const u=findUnit(s,id);u.hp=0;i++;}};

test('only promoted heroes have class actions; tier-1 use is rejected without spending anything',()=>{
 const s=arena(['b1'],[]);const e=findUnit(s,'eric');assert.equal(classActionOf(e),null);
 const before=JSON.stringify(s);const r=performAction(s,'eric','bulwark','eric');assert.equal(r.ok,false);assert.equal(JSON.stringify({...s,feedback:[]}),JSON.stringify({...JSON.parse(before),feedback:[]}));
 const p=arena();assert.deepEqual(['eric','elina','lia','sain','kai'].map(id=>classActionOf(findUnit(p,id))),['bulwark','overwatch','arcane','recall','exchange']);
});

test('Bulwark: enemies entering a tile next to Erik stop there; it lasts until the next Player Phase',()=>{
 const s=arena(['b1']);park(s,['elina','lia','sain','kai']);const e=place(s,'eric',6,8),b=place(s,'b1',6,4);b.mov=6;
 const free=movement(s,b).costs;assert.ok(free.has(key(6,6))&&[...free.keys()].some(k=>k===key(5,8)||k===key(7,8)),'without Bulwark the bandit can pass beside Erik');
 const r=performAction(s,'eric','bulwark','eric');assert.ok(r.ok,r.error);assert.equal(e.mp,e.maxMP-4);assert.ok(e.acted&&e.bulwark);
 const {costs:held,prev}=movement(s,b),zone=new Set([[0,-1],[-1,0],[1,0],[0,1]].map(([dx,dy])=>key(e.x+dx,e.y+dy))),start=key(b.x,b.y);assert.ok(held.has(key(6,7)),'may enter the zone');
 for(const k of held.keys()){let p=prev.get(k);while(p&&p!==start){assert.ok(!zone.has(p),`path to ${k} passes through zone tile ${p}`);p=prev.get(p);}}assert.ok(held.size<free.size,'Bulwark shrinks the reachable area');
 beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}assert.equal(e.bulwark,undefined,'expires at the next Player Phase');
 assert.equal(movement({...s,units:s.units.map(u=>({...u,bulwark:undefined}))},b).costs.size>0,true);
});

test('Overwatch: the first enemy step inside Elina\'s range draws one shot; a hit ends that enemy\'s move',()=>{
 let shots=0,stops=0;
 for(let seed=1;seed<=12;seed++){const s=arena(['b1']);park(s,['lia','sain','kai']);s.rng=seed*7919;const el=place(s,'elina',6,9),er=place(s,'eric',6,8),b=place(s,'b1',6,4);b.mov=5; // reaching Erik means crossing Elina's range
  assert.ok(performAction(s,'elina','overwatch','elina').ok);assert.ok(el.overwatch);
  const plan=planEnemy(structuredClone(s),structuredClone(b)),erHP=er.hp;beginEnemyPhase(s);const hp=b.hp;advanceEnemy(s);
  const shot=s.feedback.some(f=>f.type==='attack'&&f.id==='elina');if(shot){shots++;assert.equal(el.overwatch,false,'one shot only');}
  if(b.hp<hp&&alive(b)){stops++;const d=Math.abs(b.x-el.x)+Math.abs(b.y-el.y);assert.ok(d>=el.range[0]&&d<=el.range[1],'stopped inside the range it entered');assert.equal(d,el.range[1],'stopped on the first in-range step');assert.equal(er.hp,erHP,'stopped short of Erik, no attack');}
  if(!shot)assert.ok(Math.abs(plan.x-el.x)+Math.abs(plan.y-el.y)>el.range[1],'no shot only if the plan never entered range');}
 assert.ok(shots>=10,`overwatch fired in ${shots}/12 runs`);assert.ok(stops>=1,'some hits stopped the enemy');
});

test('Arcane Territory: five-tile cross for two turns, ally MAG +3 / enemy RES −2, extends fire by one turn',()=>{
 const s=arena(['b1']);park(s,['elina','sain','kai']);const l=place(s,'lia',5,8),er=place(s,'eric',6,8),b=place(s,'b1',7,8);
 s.burning={[key(6,8)]:1};const magBefore=effectiveStats(s,er).mag,resBefore=effectiveStats(s,b).res;
 assert.ok(validClassTarget(s,l,{x:6,y:8},'arcane'));assert.ok(!validClassTarget(s,l,{x:9,y:8},'arcane'),'range 0–3');
 assert.ok(classTargetCells(s,l,'arcane').length>5);assert.match(forecastClass(s,l,'6,8','arcane').rows[0][1],/5칸/);
 assert.ok(performAction(s,'lia','arcane','6,8').ok);assert.equal(l.mp,l.maxMP-6);assert.equal(s.runes.length,5);assert.equal(s.burning[key(6,8)],2);
 assert.equal(effectiveStats(s,er).mag,magBefore+3);assert.equal(effectiveStats(s,b).res,Math.max(0,resBefore-2));
 const turn=s.turn;for(let i=0;i<2;i++){beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}if(i===0)assert.ok(s.runes?.length,'still active on the next turn');}
 assert.equal(s.turn,turn+2);assert.equal(s.runes,undefined,'gone after two turns');
});

test('Divine Recall: pulls an ally at distance 2–4 to a free tile next to Sain and heals up to 10',()=>{
 const s=arena(['b1']);park(s,['elina','kai']);const sa=place(s,'sain',4,8),er=place(s,'eric',7,8),li=place(s,'lia',4,9);place(s,'b1',12,2);er.hp=er.maxHP-15;
 assert.ok(!validClassTarget(s,sa,'lia','recall'),'adjacent ally is not a recall target');assert.ok(validClassTarget(s,sa,'eric','recall'));
 const f=forecastClass(s,sa,'eric','recall');assert.match(f.rows[1][1],/\+10/);
 assert.ok(performAction(s,'sain','recall','eric').ok);assert.equal(Math.abs(er.x-sa.x)+Math.abs(er.y-sa.y),1);assert.equal(er.hp,er.maxHP-5);assert.equal(sa.mp,sa.maxMP-6);
});

test('Shadow Exchange: ally within 3 or adjacent enemy; a swapped enemy cannot counter this Player Phase',()=>{
 const s=arena(['b1']);park(s,['elina','lia','sain']);const k=place(s,'kai',5,8),er=place(s,'eric',5,6),b=place(s,'b1',6,8);
 assert.ok(validClassTarget(s,k,'eric','exchange'));assert.ok(validClassTarget(s,k,'b1','exchange'));
 b.x=7;assert.ok(!validClassTarget(s,k,'b1','exchange'),'enemy must be adjacent');b.x=6;
 assert.ok(performAction(s,'kai','exchange','b1').ok);assert.deepEqual([k.x,k.y,b.x,b.y],[6,8,5,8]);assert.equal(b.noCounter,s.turn);
 place(s,'eric',5,7);assert.equal(forecast(s,er,b,'attack').counter,0,'no counter from the swapped enemy');
 const hp=er.hp;performAction(s,'eric','attack','b1');assert.equal(er.hp,hp,'Erik takes no counter');
});

test('tier-2 skill upgrades: ranged Guard, Lia cost, Sain range 0–3, Elina 2–4 from forest/village, Kai moves after Quick Strike',()=>{
 const s=arena(['b1','a1']);park(s,['lia']);const er=place(s,'eric',5,8),sa=place(s,'sain',6,8),archer=findUnit(s,'a1');place(s,'a1',6,5);
 er.guarding=true;er.guardUsed=false;assert.equal(guardFor(s,archer,sa,'attack')?.id,'eric','Guardian Knight covers a ranged hit');
 const t1=arena(['b1','a1'],[]);const er1=place(t1,'eric',5,8),sa1=place(t1,'sain',6,8);place(t1,'a1',6,5);er1.guarding=true;assert.equal(guardFor(t1,findUnit(t1,'a1'),sa1,'attack'),null,'tier 1 still melee only');
 const lia=findUnit(s,'lia');lia.hp=1;assert.equal(skillCost(lia),5);const lia1=findUnit(t1,'lia');lia1.hp=1;assert.equal(skillCost(lia1),6);
 assert.deepEqual(rangeFor(sa,'skill',s),[0,3]);assert.deepEqual(rangeFor(findUnit(t1,'sain'),'skill',t1),[0,2]);
 const k=place(s,'kai',8,8),b=place(s,'b1',8,7);b.hp=99;b.maxHP=99;assert.ok(performAction(s,'kai','skill','b1').ok);assert.ok(k.acted&&!canAct(s,k));assert.ok(canMove(s,k),'promoted Kai may still move');
 const dest=[...movement(s,k).costs.keys()].map(p=>p.split(',').map(Number)).find(([x,y])=>!(x===k.x&&y===k.y));assert.ok(moveUnit(s,'kai',...dest));assert.ok(!canMove(s,k));assert.equal(s.undo.kai,undefined,'no undo after acting');
 const k1=findUnit(t1,'kai');place(t1,'kai',8,8);const b1=place(t1,'b1',8,7);b1.hp=99;b1.maxHP=99;performAction(t1,'kai','skill','b1');assert.ok(!canMove(t1,k1),'tier-1 Kai cannot');
});

test('enemy planner treats overwatch ranges and runes as danger only when they exist',()=>{
 const s=arena(['b1']);const b=findUnit(s,'b1');assert.equal(hazardAt(s,b,b.x,b.y),0);
 const el=findUnit(s,'elina');el.overwatch=true;let any=false;for(let y=0;y<12;y++)for(let x=0;x<16;x++)if(hazardAt(s,b,x,y)>0)any=true;assert.ok(any);
});
