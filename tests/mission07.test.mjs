// v0.6 Phase D — M07 Northern Orders: the convoy on the snowy road, Thea's escort, the deserter captain, the camp choice.
import test from 'node:test';import {SKILL_MUL} from '../src/data/classes8.js';import assert from 'node:assert/strict';
import {MISSIONS,LAST_MISSION} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {newGame,startBattle,nextMission,beginEnemyPhase,advanceEnemy,performAction,moveUnit,planAllied,checkOutcome} from '../src/core/game.js';
import {findUnit,alive,distance,validTarget,forecast,strikeStats} from '../src/core/rules.js';
import {rulesOf} from '../src/core/mission-rules.js';
import {chooseDeserters,convoyDistance} from '../src/core/mission-rules-v06.js';
import {enterHub} from '../src/core/frontier.js';
import {hubFor} from '../src/data/hubs-v05.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';
const camp=()=>({heroes:null,results:[],clears:6,completed:[1,2,3,4,5,6],flags:{act1_completed:true},choices:{m06_oath:'comrades',m04_records_choice:'kept'}});
const battle=(seed=11)=>{const s=newGame(seed,camp(),7);s.screen='deployment';startBattle(s);drain(s);return s;};
const turn=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
const clearEnemies=s=>{for(const u of s.units.filter(u=>u.team==='enemy'))u.hp=0;};

test('M07 data (v2.3.0 big map): 30×14 snowy valley, six-hero sortie, level 8, three wagons, Thea and two Iron Crown soldiers as allies, 16 deserters + 6',()=>{
 const m=MISSIONS[7];assert.deepEqual([m.width,m.height],[30,14]);assert.ok(m.map.every(r=>r.length===30));assert.equal(m.enemies.length,16);assert.equal(m.waves.reduce((n,w)=>n+w.units.length,0),6);assert.equal(m.turnLimit,20);assert.equal(m.deployLimit,6);assert.equal(m.level,8);assert.ok(LAST_MISSION>=14);
 assert.equal(m.civilians.filter(c=>c.kind==='wagon').length,3);assert.deepEqual(m.allies.map(a=>a.look),['thea','ironInfantry','ironInfantry']);
 const zone=m.deployZone();for(const p of m.deployments.recommended)assert.ok(zone.has(p.join(',')),`preset ${p}`);
 assert.ok(m.map[7].includes('i')&&m.map[5].includes('w'),'frozen river with an ice bridge on the road');assert.deepEqual(m.convoyGate,[[26,0],[27,0],[26,1],[27,1]]);for(const [x,y] of m.convoyGate)assert.equal(m.map[y][x],'t','the gate is the fort tiles at the top of the road');
 for(const k of ['7:intro','7:turn2','7:ambush','7:gatewave','7:through','7:capture','7:boss','7:end','pre:7','after:7','after:7:captured','after:7:none','after:7:handover','after:7:legion','npc:7:preparation:advisor','npc:7:aftermath:thea','world:castletown'])assert.ok(STORY[k]?.length,k);
});

test('M06 → M07: the legion marches to the castle town below Ironhold with the ACT II card; trust starts from ACT I',()=>{
 const six=newGame(3,{...camp(),completed:[1,2,3,4,5]},6);enterHub(six,{aftermath:true,story:false});six.campaign.completed.push(6);assert.equal(six.frontier.hub,'oathcamp');six.outcome='victory';const s=nextMission(six);assert.equal(s.missionId,7);
 assert.equal(hubFor(7,'preparation'),'castletown');enterHub(s);assert.equal(s.frontier.hub,'castletown');assert.ok(s.narrative.events.includes('world:castletown'));assert.ok(s.narrative.events.includes('pre:7'));
 assert.equal(STORY['world:castletown'].at(-1).world.card.act,'ACT II · 세 개의 깃발');
 assert.deepEqual(s.campaign.factionTrust,{iron:0,free:0,flame:0});
 const r=newGame(3,{...camp(),choices:{m06_oath:'truth',m04_records_choice:'reported'}},7);assert.equal(r.campaign.factionTrust.iron,-1,'a reported ledger makes the Iron Crown wary');
});

test('convoy (v2.3.0): along the road toward the north-east gate, two tiles a turn, one with an enemy beside a wagon, a blocked wagon steps across or waits, through at the gate',()=>{
 const s=battle();clearEnemies(s);s.missionState.waves=[3,5];const w1=findUnit(s,'w1'),rules=rulesOf(s);assert.deepEqual([w1.x,w1.y],[3,7]);
 for(const id of ['eric','elina','lia','sain','kai'])findUnit(s,id).benched=true;for(const a of s.units.filter(u=>u.team==='allied'))a.benched=true;
 const d0=convoyDistance(s,w1);s.turn=2;rules.onTurnStart(s);assert.equal(convoyDistance(s,w1),d0-2,'two tiles a turn toward the gate');assert.deepEqual([w1.x,w1.y],[5,7],'east along the valley road');
 const e=s.units.find(u=>u.id==='d1');e.hp=e.maxHP;e.benched=false;e.x=w1.x;e.y=w1.y-1;rules.onTurnStart(s);assert.equal(convoyDistance(s,w1),d0-3,'one tile while pressed');e.hp=0;
 const ally=findUnit(s,'ic1');delete ally.benched;ally.x=w1.x+1;ally.y=w1.y;const [bx,by]=[w1.x,w1.y],before=convoyDistance(s,w1);rules.onTurnStart(s);assert.ok(convoyDistance(s,w1)<=before,'never backwards');assert.ok(w1.y!==by||w1.x===bx,'blocked: it steps across to the other lane (or waits), never through the unit');
 // the climb: from the top of the valley road the wagons turn north, then east to the gate
 w1.x=22;w1.y=4;ally.benched=true;rules.onTurnStart(s);assert.deepEqual([w1.x,w1.y],[22,2],'up the northern slope');
 for(const w of ['w1','w2'].map(id=>findUnit(s,id))){w.x=w.id==='w1'?26:27;w.y=2;}rules.onTurnStart(s);assert.ok(findUnit(s,'w1').rescued&&findUnit(s,'w2').rescued);assert.ok(s.narrative.events.includes('7:through'));
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
 assert.ok(!(Number.isFinite(convoyDistance(s,p))&&wagons.some(w=>convoyDistance(s,w)>convoyDistance(s,p)&&distance(w,p)<=3)),'not on the road just ahead (nearer the gate)');
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

test('Thea\'s Charge: ×1.25, and after a 3-tile run ×1.45 with no counterattack (v2.0.0 multipliers; ACT I heroes unchanged)',()=>{
 const s=newGame(9,{...camp(),completed:[1,2,3,4,5,6,7,8],roster:['thea']},8);s.screen='deployment';const thea=findUnit(s,'thea');delete thea.benched;startBattle(s);drain(s);
 const foe=s.units.find(u=>u.team==='enemy');foe.x=7;foe.y=8;foe.kind='neutral'; // v0.8 matchups scale by troop type; a neutral target keeps the Charge numbers plain
 thea.x=7;thea.y=9;const base=strikeStats(s,thea,foe,'attack').damage,charge=strikeStats(s,thea,foe,'skill').damage;assert.ok(Math.abs(charge-base*SKILL_MUL.charge)<=1,`${charge} ≈ ${base}×${SKILL_MUL.charge}`);assert.ok(charge>base);
 thea.chargeRun=3;{const run=strikeStats(s,thea,foe,'skill').damage;assert.ok(Math.abs(run-base*SKILL_MUL.chargeRun)<=1+(thea.chargeDmg||0),`${run} ≈ ${base}×${SKILL_MUL.chargeRun}`);assert.ok(run>charge);}assert.equal(forecast(s,thea,foe,'skill').counter,0,'no counter after a run');
 const eric=findUnit(s,'eric');assert.equal(strikeStats(s,eric,foe,'skill').damage,strikeStats(s,eric,foe,'skill').damage);
});
