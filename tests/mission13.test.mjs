// v0.7.1 — M13 The Black Lion's Decision: resolve from ACT I–II choices, Erik's persuasion (once a turn), Thea's word
// (once), turns the camp is kept unharmed (from TURN 4, at most 2); 6 halts Baldrick (Iron Crown trust −1). Or break the
// lion formation from TURN 5, or hold the camp to TURN 12.
import test from 'node:test';import assert from 'node:assert/strict';
import {MISSIONS} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {hubFor} from '../src/data/hubs-v05.js';
import {newGame,startBattle,beginEnemyPhase,advanceEnemy,performAction} from '../src/core/game.js';
import {findUnit,alive,validTarget,forecast} from '../src/core/rules.js';
import {rulesOf} from '../src/core/mission-rules.js';
import {resolveSources} from '../src/core/mission-rules-v071.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';
const camp=(extra={})=>({heroes:null,results:[],clears:12,completed:[1,2,3,4,5,6,7,8,9,10,11,12],flags:{act1_completed:true,act2_free_met:true,act2_flame_met:true},choices:{m05_erik_answer:'acknowledged',m08_order:'hold',m11_oath:'oath',m12_records:'return'},factionTrust:{iron:1,free:2,flame:2},roster:[],...extra});
const battle=(extra)=>{const s=newGame(53,camp(extra),13);s.screen='deployment';startBattle(s);drain(s);return s;};
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
const finish=(st,o,r)=>{st.outcome=o;st.reason=r;};
const beside=(s,u,t)=>{u.x=t.x;u.y=t.y+1;};

test('M13 data: 18×14 refugee camp, level 11, Baldrick with three lion bearers, four refugees, resolve threshold 6; story keys',()=>{
 const m=MISSIONS[13];assert.deepEqual([m.width,m.height],[18,14]);assert.equal(m.level,11);assert.equal(m.deployLimit,6);assert.deepEqual(m.formation.bearers,['f1','f2','f3']);assert.deepEqual(m.persuade,{target:'boss',threshold:6});assert.equal(m.civilians.length,4);
 const zone=m.deployZone();for(const p of Object.values(m.deployments).flat())assert.ok(zone.has(p.join(',')),`preset ${p}`);
 for(const k of ['13:intro','13:turn2','13:cavalry','13:reinforce','13:persuade','13:thea','13:waver','13:halt','13:lost','13:encounter','13:end','pre:13','after:13','after:13:halted','after:13:broken','after:13:held','npc:13:preparation:advisor','npc:13:aftermath:advisor','npc:13:preparation:thea'])assert.ok(STORY[k]?.length,k);
 assert.equal(hubFor(13,'preparation'),'refuge');assert.equal(hubFor(13,'aftermath'),'summit');assert.equal(hubFor(14,'preparation'),'summit');
});

test('resolve carried in: M05 "구해 주신 목숨입니다" +1, M08 hold +1, Iron Crown trust ≥ 2 +1',()=>{
 assert.deepEqual(resolveSources(camp().valueOf()),['m05','m08']);assert.deepEqual(resolveSources({choices:{m05_erik_answer:'present',m08_order:'rescue'},factionTrust:{iron:2}}),['iron']);
 assert.equal(battle().missionState.resolve,2);assert.equal(battle({factionTrust:{iron:2,free:0,flame:0}}).missionState.resolve,3);
});

test('persuade: Erik beside Baldrick once a turn, Thea once in the battle; no one else; it is an action',()=>{
 const s=battle({roster:['thea'],choices:{m05_erik_answer:'present'}}),boss=findUnit(s,'boss'),eric=findUnit(s,'eric'),kai=findUnit(s,'kai');beside(s,eric,boss);kai.x=boss.x+1;kai.y=boss.y;
 assert.ok(validTarget(s,eric,boss,'persuade'));assert.ok(!validTarget(s,kai,boss,'persuade'));assert.ok(forecast(s,eric,boss,'persuade').persuade);
 const before=s.missionState.resolve;assert.ok(performAction(s,'eric','persuade','boss').ok);drain(s);assert.equal(s.missionState.resolve,before+1);assert.ok(eric.acted);assert.ok(!validTarget(s,{...eric,acted:false},boss,'persuade'),'once a turn');
 const thea=findUnit(s,'thea');thea.benched=false;thea.x=boss.x-1;thea.y=boss.y;assert.ok(validTarget(s,thea,boss,'persuade'));performAction(s,'thea','persuade','boss');drain(s);assert.equal(s.missionState.resolve,before+2);assert.ok(!validTarget(s,{...thea,acted:false},boss,'persuade'),'Thea only once');
});

test('calm turns: from TURN 4 an enemy phase with no refugee hurt adds 1, at most 2',()=>{
 const s=battle({choices:{}});for(const e of s.units.filter(u=>u.team==='enemy'&&u.id!=='boss'))e.hp=0;const boss=findUnit(s,'boss');boss.mov=0;boss.atk=0;
 const calmPhase=()=>{for(const e of s.units.filter(u=>u.team==='enemy'&&u.id!=='boss'))e.hp=0;enemyPhase(s);};
 const r0=s.missionState.resolve;for(let i=0;i<3;i++)calmPhase();assert.equal(s.turn,4);assert.equal(s.missionState.resolve,r0,'before TURN 4 nothing');
 calmPhase();assert.equal(s.missionState.resolve,r0+1);calmPhase();calmPhase();assert.equal(s.missionState.resolve,r0+2,'capped at 2');
});

test('resolve 6 halts the army (victory, Iron Crown trust −1); Baldrick never falls below half',()=>{
 const s=battle({factionTrust:{iron:2,free:0,flame:0}}),boss=findUnit(s,'boss'),eric=findUnit(s,'eric');s.missionState.resolve=5;beside(s,eric,boss);
 performAction(s,'eric','persuade','boss');drain(s);assert.ok(s.missionState.halted);assert.equal(s.outcome,'victory');assert.match(s.reason,/군을 멈췄습니다/);assert.ok(s.units.filter(u=>u.team==='enemy').every(u=>!alive(u)));
 assert.equal(s.campaign.flags.mission_13_baldrick,'halted');assert.equal(s.campaign.factionTrust.iron,1);
 const t=battle(),b=findUnit(t,'boss');b.hp=3;rulesOf(t).afterDamage(t,b);assert.equal(b.hp,b.maxHP/2);
});

test('formation broken + Baldrick at half wins only from TURN 5; holding to TURN 12 wins; two refugees lost lose',()=>{
 let s=battle();for(const id of ['f1','f2','f3'])findUnit(s,id).hp=0;const b=findUnit(s,'boss');b.hp=b.maxHP/2;rulesOf(s).checkOutcome(s,finish);assert.ok(!s.outcome,'TURN 1: he holds');
 s.turn=5;rulesOf(s).checkOutcome(s,finish);assert.equal(s.outcome,'victory');assert.equal(s.missionState.withdrew,'broken');
 s=battle();s.turn=13;rulesOf(s).checkOutcome(s,finish);assert.equal(s.outcome,'victory');assert.equal(s.missionState.withdrew,'held');
 s=battle();findUnit(s,'v1').hp=0;findUnit(s,'v2').hp=0;rulesOf(s).checkOutcome(s,finish);assert.equal(s.outcome,'defeat');
});

test('M13 saves round-trip mid battle',()=>{const s=battle();s.missionState.resolve=4;s.missionState.sources.push('eric','eric');const back=deserialize(serialize(s));assert.deepEqual(back.missionState,s.missionState);
 const bad=structuredClone(s);bad.missionState.sources.push('bribe');assert.throws(()=>deserialize(serialize(bad)));});
