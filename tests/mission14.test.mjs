// v0.7.1 — M14 The Broken Alliance: escort Cassian, Leonora and Lucien to the southern exit; masked raiders hunt the
// leaders; on TURN 4 the banner with the lowest trust (ties: Iron Crown → Free Lords → Sacred Flame) turns on the legion;
// trust after the summit; a recruit of the betraying banner stays or leaves; the ACT II completion.
import test from 'node:test';import assert from 'node:assert/strict';
import {MISSIONS,LAST_MISSION} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {newGame,startBattle,beginEnemyPhase,advanceEnemy,nextMission} from '../src/core/game.js';
import {findUnit,alive,hostile} from '../src/core/rules.js';
import {rulesOf} from '../src/core/mission-rules.js';
import {betrayer} from '../src/core/mission-rules-v071.js';
import {enterHub,currentHub} from '../src/core/frontier.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';
const camp=(extra={})=>({heroes:null,results:[],clears:13,completed:[1,2,3,4,5,6,7,8,9,10,11,12,13],flags:{act1_completed:true,act2_free_met:true,act2_flame_met:true},choices:{m11_oath:'oath',m12_records:'return'},factionTrust:{iron:0,free:2,flame:2},roster:[],...extra});
const battle=(extra)=>{const s=newGame(59,camp(extra),14);s.screen='deployment';startBattle(s);drain(s);return s;};
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
const finish=(st,o,r)=>{st.outcome=o;st.reason=r;};
const quiet=s=>{for(const e of s.units.filter(u=>u.team==='enemy'))e.hp=0;};

test('M14 data: 18×14 waystation, level 12, three leaders and six guards as allies, masked raiders, exit row 13, betrayal on TURN 4; ACT II ends here',()=>{
 const m=MISSIONS[14];assert.deepEqual([m.width,m.height],[18,14]);assert.equal(m.level,12);assert.equal(m.exitRow,13);assert.equal(m.betrayTurn,4);assert.equal(LAST_MISSION,14);
 assert.deepEqual(m.allies.filter(a=>a.leader).map(a=>[a.id,a.faction]),[['cassian','iron'],['leonora','free'],['lucien','flame']]);assert.equal(m.allies.filter(a=>!a.leader).length,6);assert.ok(m.enemies.every(e=>e.masked));
 const zone=m.deployZone();for(const p of Object.values(m.deployments).flat())assert.ok(zone.has(p.join(',')),`preset ${p}`);
 for(const k of ['14:intro','14:turn2','14:raid','14:exit','14:betray:iron','14:betray:free','14:betray:flame','14:arrive','14:fallen:cassian','14:end','pre:14','after:14','world:summit','after:14:recruit:stayed:thea','after:14:recruit:left:ines','npc:14:preparation:advisor','npc:14:aftermath:advisor'])assert.ok(STORY[k]?.length,k);
});

test('the betrayer is the banner with the lowest trust; ties go Iron Crown → Free Lords → Sacred Flame',()=>{
 assert.equal(betrayer({factionTrust:{iron:0,free:2,flame:2}}),'iron');assert.equal(betrayer({factionTrust:{iron:2,free:1,flame:1}}),'free');assert.equal(betrayer({factionTrust:{iron:3,free:2,flame:-1}}),'flame');assert.equal(betrayer({factionTrust:{iron:1,free:1,flame:1}}),'iron');
});

test('TURN 4: the betraying leader leaves, its guards turn on the legion; masked raiders and the turncoats do not fight each other',()=>{
 const s=battle({factionTrust:{iron:2,free:2,flame:0}});quiet(s);for(let i=0;i<3;i++)enemyPhase(s);assert.equal(s.turn,4);assert.equal(s.missionState.betrayer,'flame');
 const lucien=findUnit(s,'lucien');assert.ok(lucien.withdrawn&&!alive(lucien));for(const id of ['lg1','lg2']){const g=findUnit(s,id);if(alive(g)){assert.equal(g.team,'enemy');assert.ok(hostile(s,g,findUnit(s,'eric')));}}
 assert.equal(findUnit(s,'cassian').team,'allied');const k=findUnit(s,'k5');if(k){k.hp=10;const g=findUnit(s,'lg1');assert.ok(!hostile(s,k,g));}
 const back=deserialize(serialize(s));assert.equal(findUnit(back,'lg1').team,findUnit(s,'lg1').team,'a turned guard saves as an enemy');
});

test('leaders walk south and leave by the exit row; two loyal leaders out win; a loyal leader down after the betrayal loses',()=>{
 let s=battle();quiet(s);for(let i=0;i<12&&!s.outcome;i++)enemyPhase(s);assert.equal(s.outcome,'victory');assert.match(s.reason,/출구 도착/);assert.ok(s.missionState.arrived.length>=2);
 s=battle();quiet(s);for(let i=0;i<3;i++)enemyPhase(s);findUnit(s,'leonora').hp=0;rulesOf(s).checkOutcome(s,finish);assert.equal(s.outcome,'defeat');
});

test('after the summit: the betrayer −1, the others +1; its recruit stays when they fought there, otherwise leaves (kept aside)',()=>{
 let s=battle({roster:['thea']});quiet(s);for(let i=0;i<12&&!s.outcome;i++)enemyPhase(s);assert.equal(s.outcome,'victory');
 assert.deepEqual(s.campaign.factionTrust,{iron:-1,free:3,flame:3});assert.ok(s.campaign.flags.act2_completed);
 const thea=findUnit(s,'thea');assert.equal(s.campaign.flags.mission_14_recruit,thea&&!thea.benched?'stayed':'left');
 const t=newGame(61,camp({roster:['thea']}),14);t.screen='deployment';const th=findUnit(t,'thea');th.benched=true;startBattle(t);drain(t);quiet(t);for(let i=0;i<12&&!t.outcome;i++)enemyPhase(t);
 assert.equal(t.campaign.flags.mission_14_recruit,'left');assert.ok(!t.campaign.roster.includes('thea'));assert.equal(t.campaign.departed.thea.id,'thea');assert.ok(!t.campaign.heroes||!t.campaign.heroes.some(h=>h.id==='thea'));
 const back=deserialize(serialize(t));assert.ok(back.campaign.departed.thea);enterHub(back,{aftermath:true,story:false});assert.equal(back.frontier.hub,'summit');assert.ok(!currentHub(back).npcs.some(n=>n.id==='thea'));
});
