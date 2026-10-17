import test from 'node:test';import assert from 'node:assert/strict';
import {newGame,startBattle,performAction,beginEnemyPhase,advanceEnemy,checkOutcome,nextMission,planEnemy} from '../src/core/game.js';
import {findUnit,alive,validTarget,strikeStats,distance} from '../src/core/rules.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {MISSIONS} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {rulesOf} from '../src/core/mission-rules.js';
import {supplementalRewards,knownRewards} from '../src/core/battle-rewards.js';
import {drain} from './campaign-policy.mjs';

const campaign=(choices={})=>({heroes:null,results:[],clears:4,completed:[1,2,3,4],flags:{},choices});
const battle=(choices={m05_erik_answer:'present'})=>{const s=newGame(5005,campaign(choices),5);s.screen='deployment';startBattle(s);drain(s);return s;};
const place=(s,id,x,y)=>{const u=findUnit(s,id);u.x=x;u.y=y;return u;};
const endTurn=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};

test('M05 data: 18×14 ridge map, presets inside the deployment zone, two wagons, M04 continues to M05',()=>{
 const m=MISSIONS[5];assert.deepEqual([m.width,m.height],[18,14]);assert.ok(m.map.every(r=>r.length===18));
 const s=newGame(5005,campaign(),5),zone=m.deployZone(s);for(const preset of Object.values(m.deployments))for(const [x,y]of preset)assert.ok(zone.has(`${x},${y}`),`${x},${y}`);
 const wagons=s.units.filter(u=>u.kind==='wagon');assert.equal(wagons.length,2);assert.ok(wagons.every(w=>w.team==='civilian'&&w.hp===34&&w.def===4));
 const m4=newGame(4004,{...campaign(),completed:[1,2,3],clears:3},4);m4.outcome='victory';m4.campaign.completed.push(4);assert.equal(nextMission(m4).missionId,5);
 for(const k of ['pre:5','5:parley','5:parley:acknowledged','5:parley:present','5:intro','5:turn2','5:reinforce','5:formation-broken','5:encounter','5:withdraw:broken','5:withdraw:held','5:farewell:acknowledged','5:farewell:present','5:bond','5:end','after:5','after:5:acknowledged','after:5:present'])assert.ok(STORY[k]?.length,k);
});
test('M05 wagons cannot be rescued and are never attackable by heroes',()=>{const s=battle(),w=findUnit(s,'w1');const e=place(s,'eric',w.x+1,w.y);assert.equal(validTarget(s,e,w,'rescue'),false);assert.equal(validTarget(s,e,w,'attack'),false);});
test('M05 lion formation: bearer-adjacent soldiers get DEF +2 and HIT +10; aura ends with the bearers',()=>{
 const s=battle();for(const u of s.units)if(u.team==='enemy'&&!['f1','s1'].includes(u.id))u.hp=0;
 const f1=place(s,'f1',7,3),sp=place(s,'s1',8,3),e=place(s,'eric',8,4);
 const near=strikeStats(s,e,sp),hitNear=strikeStats(s,sp,e).hit;f1.hp=0;const far=strikeStats(s,e,sp),hitFar=strikeStats(s,sp,e).hit;
 assert.equal(far.damage-near.damage,2);assert.ok(hitNear-hitFar===10||hitNear===100);
});
test('M05 lion charge: +4 against an isolated hero, none when a comrade is adjacent or Erik guards',()=>{
 const s=battle();for(const u of s.units)if(u.team==='enemy'&&u.id!=='boss')u.hp=0;const boss=place(s,'boss',9,6);
 const lia=place(s,'lia',9,7);for(const id of ['eric','elina','sain','kai'])place(s,id,1+['eric','elina','sain','kai'].indexOf(id),13);
 const alone=strikeStats(s,boss,lia).damage;place(s,'kai',10,7);const covered=strikeStats(s,boss,lia).damage;assert.equal(alone-covered,4);
 const e=place(s,'eric',9,7);place(s,'lia',1,12);place(s,'kai',4,13);const before=strikeStats(s,boss,e).damage;e.guarding=true;e.guardUsed=false;assert.equal(before-strikeStats(s,boss,e).damage>=4,true);
});
test('M05 Baldrick never falls below half HP and withdraws once both bearers are down (victory A)',()=>{
 const s=battle({m05_erik_answer:'acknowledged'}),boss=findUnit(s,'boss');boss.hp=boss.maxHP/2+1;rulesOf(s).afterDamage(s,Object.assign(boss,{hp:3}));assert.equal(boss.hp,Math.ceil(boss.maxHP/2));
 assert.equal(checkOutcome(s),null);findUnit(s,'f1').hp=0;findUnit(s,'f2').hp=0;rulesOf(s).afterDamage(s,findUnit(s,'f2'));assert.ok(s.missionState.broken);assert.ok(s.narrative.events.includes('5:formation-broken'));
 assert.equal(checkOutcome(s),'victory');assert.equal(s.campaign.flags.mission_05_baldrick_withdrew,'broken');assert.equal(s.campaign.flags.mission_05_wagons_saved,2);
 assert.ok(s.narrative.events.includes('5:withdraw:broken')&&s.narrative.events.includes('5:farewell:acknowledged'));assert.ok(alive(boss)||boss.withdrawn);
 const r=s.campaign.results.at(-1).rewards;assert.ok(r.extras.some(x=>x.type==='heavyShield')&&r.extras.some(x=>x.kind==='gold'&&x.amount===50));
});
test('M05 holding the road through TURN 10 wins (victory B); losing both wagons is defeat',()=>{
 const s=battle();for(const u of s.units)if(u.team==='enemy'&&u.id!=='boss')u.hp=0;place(s,'boss',9,0);s.turn=10;endTurn(s);assert.equal(s.outcome,'victory');assert.equal(s.campaign.flags.mission_05_baldrick_withdrew,'held');assert.ok(s.narrative.events.includes('5:withdraw:held'));
 const d=battle();for(const w of d.units.filter(u=>u.kind==='wagon'))w.hp=0;assert.equal(checkOutcome(d),'defeat');
});
test('M05 AI: Baldrick stays within two tiles of a living bearer; cavalry rides for the wagons',()=>{
 const s=battle();const boss=findUnit(s,'boss');const p=planEnemy(s,boss);assert.ok(['f1','f2'].some(id=>distance(p,findUnit(s,id))<=2));
 s.turn=4;endTurn(s);drain(s);const s2=battle();for(const u of s2.units)if(u.team==='enemy')u.hp=0;s2.turn=3;endTurn(s2);const c1=findUnit(s2,'c1');assert.ok(c1&&alive(c1));const plan=planEnemy(s2,c1);assert.ok(/마차/.test(plan.reason));
});
test('M05 threats mark isolated heroes in Baldrick reach; aura cells surround living bearers',()=>{const s=battle(),r=rulesOf(s);assert.equal(r.auraCells(s).length,8);for(const u of s.units)if(u.team==='enemy'&&u.id!=='boss')u.hp=0;place(s,'boss',9,6);place(s,'lia',9,8);assert.ok(r.threats(s).includes('lia'));assert.equal(r.auraCells(s).length,0);});
test('M05 Elina–Sain bond: Sain heals Elina and Elina fells a foe next to Sain',()=>{
 const s=battle();for(const u of s.units)if(u.team==='enemy'&&!['s1','boss'].includes(u.id))u.hp=0;place(s,'boss',9,0);
 const el=place(s,'elina',5,9);el.hp-=10;place(s,'sain',5,8);assert.ok(performAction(s,'sain','skill','elina').ok);
 const sp=place(s,'s1',6,8);sp.hp=1;place(s,'elina',8,8);assert.ok(performAction(s,'elina','attack','s1').ok);assert.ok(s.campaign.tacticalMemory.m5_elina_guards_sain);
 s.turn=11;checkOutcome(s);assert.equal(s.campaign.bonds.elina_sain,true);assert.ok(s.narrative.events.includes('5:bond'));
});
test('M05 rewards are stable ledger entries and saves round-trip mid-battle',()=>{
 assert.deepEqual(supplementalRewards(5,{}).map(r=>r.id),['v040:m5:supply-mp','v040:m5:supply-hp']);assert.ok(knownRewards().some(r=>r.id==='v040:m5:formation-broken'));
 const s=battle();endTurn(s);const back=deserialize(serialize(s));assert.equal(back.missionId,5);assert.deepEqual(back.missionState,s.missionState);
});
