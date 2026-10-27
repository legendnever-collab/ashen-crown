// v0.6 Phase D — M07 Northern Orders: the convoy on the snowy road, Thea's escort, the deserter captain, the camp choice.
import test from 'node:test';import assert from 'node:assert/strict';
import {MISSIONS,LAST_MISSION} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {newGame,startBattle,nextMission,beginEnemyPhase,advanceEnemy,performAction,moveUnit,planAllied,checkOutcome} from '../src/core/game.js';
import {findUnit,alive,distance,validTarget,forecast,strikeStats} from '../src/core/rules.js';
import {rulesOf} from '../src/core/mission-rules.js';
import {chooseDeserters} from '../src/core/mission-rules-v06.js';
import {enterHub} from '../src/core/frontier.js';
import {hubFor} from '../src/data/hubs-v05.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';
const camp=()=>({heroes:null,results:[],clears:6,completed:[1,2,3,4,5,6],flags:{act1_completed:true},choices:{m06_oath:'comrades',m04_records_choice:'kept'}});
const battle=(seed=11)=>{const s=newGame(seed,camp(),7);s.screen='deployment';startBattle(s);drain(s);return s;};
const turn=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
const clearEnemies=s=>{for(const u of s.units.filter(u=>u.team==='enemy'))u.hp=0;};

test('M07 data: 18×14 snowy road, six-hero sortie, level 8, three wagons, Thea and two Iron Crown soldiers as allies',()=>{
 const m=MISSIONS[7];assert.deepEqual([m.width,m.height],[18,14]);assert.ok(m.map.every(r=>r.length===18));assert.equal(m.deployLimit,6);assert.equal(m.level,8);assert.equal(LAST_MISSION,14);
 assert.equal(m.civilians.filter(c=>c.kind==='wagon').length,3);assert.deepEqual(m.allies.map(a=>a.look),['thea','ironInfantry','ironInfantry']);
 const zone=m.deployZone();for(const p of m.deployments.recommended)assert.ok(zone.has(p.join(',')),`preset ${p}`);
 assert.ok(m.map[6].includes('i')&&m.map[6].includes('w'),'frozen river with an ice bridge');
 for(const k of ['7:intro','7:turn2','7:ambush','7:gatewave','7:through','7:capture','7:boss','7:end','pre:7','after:7','after:7:captured','after:7:none','after:7:handover','after:7:legion','npc:7:preparation:advisor','npc:7:aftermath:thea','world:castletown'])assert.ok(STORY[k]?.length,k);
});

test('M06 → M07: the legion marches to the castle town below Ironhold with the ACT II card; trust starts from ACT I',()=>{
 const six=newGame(3,{...camp(),completed:[1,2,3,4,5]},6);enterHub(six,{aftermath:true,story:false});six.campaign.completed.push(6);assert.equal(six.frontier.hub,'oathcamp');six.outcome='victory';const s=nextMission(six);assert.equal(s.missionId,7);
 assert.equal(hubFor(7,'preparation'),'castletown');enterHub(s);assert.equal(s.frontier.hub,'castletown');assert.ok(s.narrative.events.includes('world:castletown'));assert.ok(s.narrative.events.includes('pre:7'));
 assert.equal(STORY['world:castletown'].at(-1).world.card.act,'ACT II · 세 개의 깃발');
 assert.deepEqual(s.campaign.factionTrust,{iron:0,free:0,flame:0});
 const r=newGame(3,{...camp(),choices:{m06_oath:'truth',m04_records_choice:'reported'}},7);assert.equal(r.campaign.factionTrust.iron,-1,'a reported ledger makes the Iron Crown wary');
});

test('convoy: two tiles a turn on the road, one with an enemy beside a wagon, blocked by a unit in the way, through at the gate',()=>{
 const s=battle();clearEnemies(s);s.missionState.waves=[3,5];const w1=findUnit(s,'w1'),rules=rulesOf(s);assert.deepEqual([w1.x,w1.y],[8,12]);
 for(const id of ['eric','elina','lia','sain','kai'])findUnit(s,id).benched=true;
 s.turn=2;rules.onTurnStart(s);assert.equal(w1.y,10,'two tiles a turn');
 const e=s.units.find(u=>u.id==='d1');e.hp=e.maxHP;e.x=7;e.y=10;rules.onTurnStart(s);assert.equal(w1.y,9,'one tile while pressed');e.hp=0;
 const ally=findUnit(s,'ic1');ally.x=8;ally.y=8;rules.onTurnStart(s);assert.ok(w1.x!==8||w1.y===9,'a blocked wagon steps across to the other lane or waits');
 for(const w of ['w1','w2'].map(id=>findUnit(s,id))){w.x=w.id==='w1'?8:9;w.y=3;}rules.onTurnStart(s);assert.ok(findUnit(s,'w1').rescued&&findUnit(s,'w2').rescued);assert.ok(s.narrative.events.includes('7:through'));
 for(const id of ['eric','elina','lia','sain','kai'])delete findUnit(s,id).benched;checkOutcome(s);assert.equal(s.outcome,'victory',s.reason);assert.match(s.reason,/수송 완료/);
});

test('victory, defeat, capture: two wagons through wins; two lost loses; the captain can be taken alive below half HP',()=>{
 let s=battle();for(const id of ['w1','w2'])findUnit(s,id).rescued=true;rulesOf(s).checkOutcome(s,(st,o,r)=>{st.outcome=o;st.reason=r;});assert.equal(s.outcome,'victory');
 s=battle();for(const id of ['w1','w3'])findUnit(s,id).hp=0;rulesOf(s).checkOutcome(s,(st,o,r)=>{st.outcome=o;st.reason=r;});assert.equal(s.outcome,'defeat');
 s=battle();const boss=findUnit(s,'boss'),eric=findUnit(s,'eric');boss.x=eric.x;boss.y=eric.y-1;assert.equal(validTarget(s,eric,boss,'capture'),false,'full HP: no capture');
 boss.hp=Math.floor(boss.maxHP/2);assert.ok(validTarget(s,eric,boss,'capture'));assert.ok(performAction(s,'eric','capture','boss').ok);
 assert.ok(boss.rescued&&s.missionState.captured&&s.campaign.flags.mission_07_deserter_captured);assert.ok(s.narrative.events.includes('7:capture'));
 assert.equal(s.campaign.flags.mission_02_prisoner_captured,undefined,'M02 flags untouched');
});

test('Thea\'s escort keeps beside the nearest wagon and never parks on the road ahead of it',()=>{
 const s=battle();clearEnemies(s);const thea=findUnit(s,'thea_escort');beginEnemyPhase(s);const p=planAllied(s,thea);
 const wagons=s.units.filter(w=>w.kind==='wagon');assert.ok(wagons.some(w=>distance(p,w)<=2),'within two tiles of a wagon');
 assert.ok(!(['r','i'].includes(MISSIONS[7].map[p.y][p.x])&&wagons.some(w=>w.y>p.y&&Math.abs(w.x-p.x)<=1)),'not on the road ahead');
});

test('camp choice after a capture: handing over raises Iron Crown trust; taking them along does not; the victory with the escort alive raises it once',()=>{
 for(const [pick,iron] of [['handover',2],['legion',1]]){const s=battle();findUnit(s,'boss').hp=0;s.missionState.captured=true;s.campaign.flags.mission_07_deserter_captured=true;
  for(const id of ['w1','w2'])findUnit(s,id).rescued=true;checkOutcome(s);assert.equal(s.outcome,'victory');assert.equal(s.campaign.factionTrust.iron,1,'escort alive: +1');
  enterHub(s,{aftermath:true});assert.equal(s.frontier.hub,'castletown');assert.ok(s.narrative.events.includes('after:7:captured'));drain(s);
  assert.ok(chooseDeserters(s,pick));assert.equal(s.campaign.choices.m07_deserters,pick);assert.equal(s.campaign.factionTrust.iron,iron);assert.equal(chooseDeserters(s,'legion'),false,'once only');}
});

test('M07 save round trip mid-battle and practice replays leave trust alone',()=>{
 const s=battle();turn(s);const r=deserialize(serialize(s));assert.deepEqual(r.missionState,s.missionState);assert.equal(r.units.filter(u=>u.team==='allied').length,3);
 const p=newGame(5,{...camp(),completed:[1,2,3,4,5,6,7],factionTrust:{iron:1,free:0,flame:0}},7);assert.ok(p.practice);for(const id of ['w1','w2'])findUnit(p,id).rescued=true;p.screen='battle';checkOutcome(p);assert.equal(p.outcome,'victory');assert.equal(p.campaign.factionTrust.iron,1);
});

test('Thea\'s Charge: +4, and after a 3-tile run +7 with no counterattack (ACT I heroes unchanged)',()=>{
 const s=newGame(9,{...camp(),completed:[1,2,3,4,5,6,7,8],roster:['thea']},8);s.screen='deployment';const thea=findUnit(s,'thea');delete thea.benched;startBattle(s);drain(s);
 const foe=s.units.find(u=>u.team==='enemy');foe.x=7;foe.y=8;thea.x=7;thea.y=9;const base=strikeStats(s,thea,foe,'attack').damage,charge=strikeStats(s,thea,foe,'skill').damage;assert.equal(charge,base+4);
 thea.chargeRun=3;assert.equal(strikeStats(s,thea,foe,'skill').damage,base+7);assert.equal(forecast(s,thea,foe,'skill').counter,0,'no counter after a run');
 const eric=findUnit(s,'eric');assert.equal(strikeStats(s,eric,foe,'skill').damage,strikeStats(s,eric,foe,'skill').damage);
});
