// v0.6.1 — M09 The Free City: Velmar's market square, three delegates to bring into the council hall, assassins
// on the rooftops, the assassin leader's capture, the Free Lords' trust.
import test from 'node:test';import assert from 'node:assert/strict';
import {MISSIONS} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {HUBS} from '../src/data/frontier-data.js';
import {hubFor} from '../src/data/hubs-v05.js';
import {newGame,startBattle,nextMission,beginEnemyPhase,advanceEnemy,performAction,planEnemy,checkOutcome} from '../src/core/game.js';
import {findUnit,alive,distance,validTarget} from '../src/core/rules.js';
import {rulesOf} from '../src/core/mission-rules.js';
import {enterHub,currentHub} from '../src/core/frontier.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';
const camp=(extra={})=>({heroes:null,results:[],clears:8,completed:[1,2,3,4,5,6,7,8],flags:{act1_completed:true},choices:{m06_oath:'people',m04_records_choice:'kept',m07_deserters:'legion',m08_order:'hold'},factionTrust:{iron:2,free:0,flame:0},...extra});
const battle=(extra)=>{const s=newGame(31,camp(extra),9);s.screen='deployment';startBattle(s);drain(s);return s;};
const turn=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
const finish=s=>(st,o,r)=>{st.outcome=o;st.reason=r;};
const next=(s,u,t)=>{u.x=t.x;u.y=t.y+1;if(s.units.some(o=>o!==u&&o.x===u.x&&o.y===u.y))u.y=t.y-1;};

test('M09 data: 18×14 Velmar market, six-hero sortie, level 9, three delegates, Dario and two harbour guards as allies, rooftops',()=>{
 const m=MISSIONS[9];assert.deepEqual([m.width,m.height],[18,14]);assert.ok(m.map.every(r=>r.length===18));assert.equal(m.deployLimit,6);assert.equal(m.level,9);
 assert.equal(m.civilians.length,3);assert.ok(m.civilians.every(c=>c.look==='councillor'));assert.deepEqual(m.allies.map(a=>a.look),['dario','guard','guard']);
 assert.ok(m.map.some(r=>r.includes('o'))&&m.map.some(r=>r.includes('l')),'rooftops and alleys');assert.equal(m.capture,'boss');
 const zone=m.deployZone();for(const p of m.deployments.recommended)assert.ok(zone.has(p.join(',')),`preset ${p}`);
 for(const k of ['9:intro','9:turn2','9:threat','9:harbor','9:alley','9:hall','9:lost','9:encounter','9:capture','9:boss','9:end','pre:9','after:9','after:9:captured','after:9:none','world:velmar','npc:9:preparation:advisor','npc:9:aftermath:advisor','npc:9:preparation:dario','npc:9:preparation:thea'])assert.ok(STORY[k]?.length,k);
 assert.equal(STORY['world:velmar'].at(-1).world.card.region,'자유도시 연맹');
});

test('M08 → M09: the legion reaches Velmar; Thea stands in the town only when she joined the legion',()=>{
 assert.equal(hubFor(9,'preparation'),'velmar');assert.equal(hubFor(10,'aftermath'),'velmar');
 const eight=newGame(3,camp({completed:[1,2,3,4,5,6,7]}),8);enterHub(eight,{aftermath:true,story:false});assert.equal(eight.frontier.hub,'march');eight.outcome='victory';eight.campaign.completed.push(8);const s=nextMission(eight);assert.equal(s.missionId,9);
 enterHub(s);assert.equal(s.frontier.hub,'velmar');assert.ok(s.narrative.events.includes('world:velmar'));assert.ok(s.narrative.events.includes('pre:9'));
 assert.ok(HUBS.velmar.npcs.some(n=>n.id==='thea'),'listed in the hub data');assert.ok(!currentHub(s).npcs.some(n=>n.id==='thea'),'absent without her');
 s.campaign.roster=['thea'];assert.ok(currentHub(s).npcs.some(n=>n.id==='thea'),'present once she joined');assert.ok(currentHub(s).npcs.some(n=>n.id==='dario'));
});

test('delegates: a hero beside one brings them into the hall; assassins hunt delegates over the rooftops',()=>{
 const s=battle(),v=findUnit(s,'v1'),eric=findUnit(s,'eric');next(s,eric,v);assert.ok(validTarget(s,eric,v,'rescue'));assert.ok(performAction(s,'eric','rescue','v1').ok);assert.ok(v.rescued);assert.ok(s.narrative.events.includes('9:hall'));
 const h=findUnit(s,'h1'),mark=findUnit(s,'v3');h.x=mark.x-1;h.y=mark.y;beginEnemyPhase(s);const p=planEnemy(s,h);assert.equal(p.target,'v3','an assassin strikes the delegate in reach');
 assert.equal(findUnit(s,'boss'),undefined,'the leader is not on the board before TURN 5');s.turn=5;rulesOf(s).onTurnStart(s);assert.ok(findUnit(s,'boss')?.hunter,'he arrives with the TURN 5 wave');assert.ok(s.narrative.events.includes('9:alley'));
});

test('outcome: two delegates lost is a defeat; the leader captured below half HP wins; holding to TURN 10 wins',()=>{
 let s=battle();for(const id of ['v1','v2'])findUnit(s,id).hp=0;rulesOf(s).checkOutcome(s,finish(s));assert.equal(s.outcome,'defeat');
 s=battle();s.turn=5;rulesOf(s).onTurnStart(s);const boss=findUnit(s,'boss'),eric=findUnit(s,'eric');next(s,eric,boss);assert.equal(validTarget(s,eric,boss,'capture'),false,'full HP');boss.hp=Math.floor(boss.maxHP/2);
 assert.ok(validTarget(s,eric,boss,'capture'));assert.ok(performAction(s,'eric','capture','boss').ok);assert.ok(boss.captured&&s.missionState.captured&&s.campaign.flags.mission_09_assassin_captured);checkOutcome(s);assert.equal(s.outcome,'victory');assert.match(s.reason,/생포/);
 s=battle();rulesOf(s).checkOutcome(s,finish(s));assert.equal(s.outcome,null,'no early victory before the leader arrives');s.turn=11;rulesOf(s).checkOutcome(s,finish(s));assert.equal(s.outcome,'victory');
});

test('Free Lords trust: every delegate safe +1; a lost delegate leaves it; the captured leader opens the ledger scene; practice changes nothing',()=>{
 for(const [lost,free] of [[0,1],[1,0]]){const s=battle();s.turn=5;rulesOf(s).onTurnStart(s);findUnit(s,'boss').hp=0;if(lost)findUnit(s,'v2').hp=0;checkOutcome(s);assert.equal(s.outcome,'victory');assert.equal(s.campaign.factionTrust.free,free);assert.ok(s.campaign.flags.act2_free_met);
  enterHub(s,{aftermath:true});assert.equal(s.frontier.hub,'velmar');assert.ok(s.narrative.events.includes('after:9:none'));}
 const s=battle();s.turn=5;rulesOf(s).onTurnStart(s);const boss=findUnit(s,'boss');boss.rescued=true;boss.captured=true;s.missionState.captured=true;s.campaign.flags.mission_09_assassin_captured=true;checkOutcome(s);enterHub(s,{aftermath:true});assert.ok(s.narrative.events.includes('after:9:captured'));
 const p=newGame(5,camp({completed:[1,2,3,4,5,6,7,8,9]}),9);assert.ok(p.practice);p.screen='battle';p.turn=5;rulesOf(p).onTurnStart(p);findUnit(p,'boss').hp=0;checkOutcome(p);assert.equal(p.outcome,'victory');assert.equal(p.campaign.factionTrust.free,0);
});

test('M09 save round trip mid-battle keeps the allies and the mission state',()=>{
 const s=battle();turn(s);const r=deserialize(serialize(s));assert.deepEqual(r.missionState,s.missionState);assert.equal(r.units.filter(u=>u.team==='allied').length,3);
 assert.ok(s.units.filter(u=>u.team==='civilian').every(v=>v.hp>0||!alive(v)));
});
