// v0.9.1 — M17 The Guardians' Oath: four sleeping statues (an oath wakes one for the legion; an enemy left beside one wakes
// it for the chancellery), the archive at the keep's back (two enemy phases on it lose the Book of Oaths), hold to TURN 10
// or bring down the captain; Aren's 「나아가라」; the camp choice and Erik's word; the hidden objective.
import test from 'node:test';import assert from 'node:assert/strict';
import {MISSIONS} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {newGame,startBattle,beginEnemyPhase,advanceEnemy,performAction} from '../src/core/game.js';
import {findUnit,alive,hostile} from '../src/core/rules.js';
import {effectiveStats} from '../src/core/economy.js';
import {setCommand,commandsFor,defaultCommand} from '../src/core/command.js';
import {chooseOath17,statues17} from '../src/core/mission-rules-v091.js';
import {enterHub} from '../src/core/frontier.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';
export const camp17=(extra={})=>({heroes:null,results:[],clears:16,completed:[...Array(16).keys()].map(i=>i+1),flags:{act1_completed:true,act2_completed:true,mission_14_betrayer:'iron'},choices:{m11_oath:'oath',m12_records:'return',m15_records:'keep',m16_stones:'leave'},factionTrust:{iron:-1,free:3,flame:3},roster:['dario','ines'],...extra});
const battle=(extra)=>{const s=newGame(71,camp17(extra),17);s.screen='deployment';startBattle(s);drain(s);return s;};
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
const clearFoes=s=>{for(const u of s.units.filter(u=>u.team==='enemy'))if(u.id!=='gcap')u.hp=0;};
// the captain stays put far away (so the battle does not end) and every other enemy is gone but `keep`
const only=(s,...keep)=>{for(const u of s.units.filter(u=>u.team==='enemy'&&!keep.includes(u)))if(u.id==='gcap'){u.x=17;u.y=13;u.mov=0;u.range=[9,9];}else u.hp=0;};

test('M17 data: 18×14 keep, level 14, sortie of seven, four sleeping statues, two archive tiles, TURN 10',()=>{
 const m=MISSIONS[17];assert.deepEqual([m.width,m.height],[18,14]);assert.equal(m.level,14);assert.equal(m.deployLimit,7);assert.equal(m.holdTurn,10);
 assert.equal(m.objects.filter(o=>o.kind==='statue').length,4);assert.deepEqual(m.archive,[[8,1],[9,1]]);for(const [x,y] of m.archive)assert.equal(m.map[y][x],'k');
 for(const k of ['17:intro','17:oath','17:oath:ines','17:claimed','17:archive','17:end','pre:17','after:17','after:17:leave','after:17:take','after:17:eric','npc:17:preparation:elder','npc:17:aftermath:advisor'])assert.ok(STORY[k]?.length,k);
 assert.equal(m.deployments.recommended.length,8);
});

test('an oath beside a statue wakes it for the legion; it fights as an ally with the guardian numbers',()=>{
 const s=battle();const st=findUnit(s,'st1'),e=findUnit(s,'eric');assert.equal(st.team,'object');e.x=st.x+1;e.y=st.y;
 const r=performAction(s,'eric','search','st1');assert.ok(r.ok,r.error);drain(s);
 assert.equal(st.team,'allied');assert.equal(st.woke,'ally');assert.equal(st.hp,MISSIONS[17].statue.hp);assert.deepEqual(s.missionState.sworn,['st1']);
 const back=deserialize(serialize(s));assert.equal(findUnit(back,'st1').team,'allied');
});

test('an enemy left beside a sleeping statue at the start of a turn wakes it for the chancellery (a hero beside it prevents that)',()=>{
 const s=battle();const st2=findUnit(s,'st2'),st3=findUnit(s,'st3'),g=findUnit(s,'g1'),h=findUnit(s,'g2'),k=findUnit(s,'kai');
 g.x=st2.x;g.y=st2.y+1;h.x=st3.x+1;h.y=st3.y;k.x=st3.x;k.y=st3.y+1;only(s,g,h);
 g.mov=0;h.mov=0;g.range=[9,9];h.range=[9,9];enemyPhase(s);
 assert.equal(st2.team,'enemy');assert.equal(st2.woke,'enemy');assert.ok(hostile(s,findUnit(s,'eric'),st2));assert.equal(st3.team,'object','Kai stood beside st3');
 assert.deepEqual(s.missionState.claimed,['st2']);const back=deserialize(serialize(s));assert.equal(findUnit(back,'st2').team,'enemy');
});

test('the archive: an enemy on it after two enemy phases in a row is a defeat; driven off in between, the count resets',()=>{
 const s=battle();const g=findUnit(s,'g3');only(s,g);
 for(const u of s.units.filter(u=>u.team==='ally'))u.x=Math.min(u.x,17),u.y=Math.max(u.y,9);
 g.x=8;g.y=1;g.mov=0;g.range=[9,9];enemyPhase(s);assert.equal(s.missionState.held,1);assert.ok(!s.outcome);
 g.x=10;g.y=2;enemyPhase(s);assert.equal(s.missionState.held,0,'off the archive');
 g.x=9;g.y=1;enemyPhase(s);enemyPhase(s);assert.equal(s.outcome,'defeat');assert.match(s.reason,/서고/);
});

test('victory: hold to the end of TURN 10, or bring down the captain; flags, the camp choice (once) and Erik\'s word',()=>{
 const s=battle();clearFoes(s);for(const st of statues17(s)){const e=findUnit(s,'eric');e.acted=false;e.x=st.x+1;e.y=st.y;if(st.x+1>17)e.x=st.x-1;performAction(s,'eric','search',st.id);drain(s);}
 assert.equal(s.missionState.sworn.length,4);findUnit(s,'gcap').hp=0;enemyPhase(s);assert.equal(s.outcome,'victory',s.reason);
 assert.equal(s.campaign.flags.mission_17_sworn,4);assert.equal(s.campaign.flags.mission_17_archive,'clean');assert.ok(s.campaign.completed.includes(17));assert.ok(s.campaign.feats.includes(17),'hidden objective');
 enterHub(s,{aftermath:true});assert.equal(s.frontier.hub,'keep');assert.ok(chooseOath17(s,'take'));assert.ok(!chooseOath17(s,'leave'));assert.equal(s.campaign.choices.m17_oath,'take');
 const t=battle();clearFoes(t);findUnit(t,'gcap').x=17;findUnit(t,'gcap').y=13;findUnit(t,'gcap').mov=0;findUnit(t,'gcap').range=[9,9];t.turn=10;enemyPhase(t);assert.equal(t.outcome,'victory',t.reason);
});

test('Aren\'s 「나아가라」 opens in M17: MOV +1 on turn 1 only, the newest command is the default; never before M17',()=>{
 const s=newGame(71,camp17(),17);assert.deepEqual(commandsFor(s),['hold','advance']);assert.equal(defaultCommand(s),'advance');assert.equal(s.command,'advance');
 s.screen='deployment';const e=findUnit(s,'eric'),base=effectiveStats({...s,command:null},e).mov;assert.equal(effectiveStats(s,e).mov,base+1);startBattle(s);s.turn=2;assert.equal(effectiveStats(s,findUnit(s,'eric')).mov,base);
 assert.deepEqual(commandsFor(newGame(71,camp17({completed:[...Array(15).keys()].map(i=>i+1)}),16)),['hold']);
});
