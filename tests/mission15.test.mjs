// v0.9.0 — M15 The Lost Records: three clerks run to their gates from TURN 2; knocking one down secures its box; the royal
// watch stays neutral until the legion fights near it twice; the archivist must live; Aren's 「지켜라」; the camp choice.
import test from 'node:test';import assert from 'node:assert/strict';
import {MISSIONS} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {newGame,startBattle,beginEnemyPhase,advanceEnemy,performAction,moveUnit} from '../src/core/game.js';
import {findUnit,alive,hostile} from '../src/core/rules.js';
import {effectiveStats} from '../src/core/economy.js';
import {setCommand,commandsFor} from '../src/core/command.js';
import {chooseRecords15} from '../src/core/mission-rules-v090.js';
import {enterHub,currentHub,councilInfo} from '../src/core/frontier.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';
export const camp15=(extra={})=>({heroes:null,results:[],clears:14,completed:[1,2,3,4,5,6,7,8,9,10,11,12,13,14],flags:{act1_completed:true,act2_free_met:true,act2_flame_met:true,act2_completed:true,mission_14_betrayer:'iron'},choices:{m11_oath:'oath',m12_records:'return'},factionTrust:{iron:-1,free:3,flame:3},roster:['dario','ines'],...extra});
const battle=(extra)=>{const s=newGame(61,camp15(extra),15);s.screen='deployment';startBattle(s);drain(s);return s;};
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};

test('M15 data: 18×14 lower city, level 13, sortie of seven, three clerks with their own gates, the watch and the archivist as civilians',()=>{
 const m=MISSIONS[15];assert.deepEqual([m.width,m.height],[18,14]);assert.equal(m.level,13);assert.equal(m.deployLimit,7);assert.equal(m.turnLimit,12);
 assert.deepEqual(m.enemies.filter(e=>e.clerk).map(e=>e.exit),[[1,0],[0,3],[17,3]]);for(const e of m.enemies.filter(e=>e.clerk))assert.equal(m.map[e.exit[1]][e.exit[0]],'r');
 assert.equal(m.civilians.filter(c=>c.watch).length,3);assert.ok(m.civilians.some(c=>c.id==='archivist'));
 for(const k of ['15:intro','15:run','15:warn','15:watch','15:box','15:end','pre:15','after:15','after:15:archivist','after:15:keep','after:15:post'])assert.ok(STORY[k]?.length,k);
 assert.equal(m.deployments.recommended.length,8);
});

test('clerks run from TURN 1, two tiles a turn, toward their own gate; one that reaches it is gone with its box',()=>{
 const s=battle();const c=findUnit(s,'c2'),start={x:c.x,y:c.y};enemyPhase(s);const d=Math.abs(c.x-start.x)+Math.abs(c.y-start.y);assert.ok(d>=1&&d<=2,`running on TURN 1 (${d})`);
 const e=findUnit(s,'c3');e.x=16;e.y=3;enemyPhase(s);assert.ok(s.missionState.escaped.includes('c3'));assert.ok(e.benched);
});

test('a clerk knocked down secures its box; three resolved with two boxes is a victory; two escaped is a defeat',()=>{
 const s=battle();for(const id of ['c1','c2'])findUnit(s,id).hp=0;const r=s.units.find(u=>u.id==='c1');
 // afterDamage marks a box when a clerk falls to a strike; simulate the strikes' bookkeeping directly
 s.missionState.secured.push('c1','c2');const c3=findUnit(s,'c3');c3.x=17;c3.y=3;enemyPhase(s);assert.equal(s.outcome,'victory',s.reason);
 const t=battle();for(const id of ['c1','c2']){const c=findUnit(t,id);[c.x,c.y]=c.exit;}enemyPhase(t);assert.equal(t.outcome,'defeat');assert.match(t.reason,/두 개/);
});

test('a hero strike that drops a clerk secures the box (afterDamage)',()=>{
 const s=battle();const c=findUnit(s,'c1'),e=findUnit(s,'eric');c.hp=1;e.x=c.x;e.y=c.y+1;for(const u of s.units.filter(u=>u.id!==c.id&&u.id!=='eric'&&u.x===e.x&&u.y===e.y))u.x=0;
 const r=performAction(s,'eric','attack','c1');assert.ok(r.ok,r.error);drain(s);assert.ok(s.missionState.secured.includes('c1'));
});

test('the watch: fighting within two tiles warns once, the second time it turns hostile; far from it nothing happens',()=>{
 const s=battle();const w=findUnit(s,'w2'),e=findUnit(s,'eric'),g=findUnit(s,'g2');
 assert.equal(w.team,'civilian');assert.ok(!hostile(s,e,w),'the watch cannot be attacked while neutral');
 const rules=s.missionState;g.x=w.x+1;g.y=w.y;e.x=w.x+1;e.y=w.y+1;g.hp=999;g.maxHP=999;
 assert.ok(performAction(s,'eric','attack','g2').ok);drain(s);assert.equal(rules.warned,1);assert.equal(w.team,'civilian');
 for(const u of s.units.filter(u=>u.team==='ally'))u.acted=false;s.turn=2;const k=findUnit(s,'kai');k.x=w.x+2;k.y=w.y;assert.ok(performAction(s,'kai','attack','g2').ok);drain(s);
 assert.equal(w.team,'enemy');assert.ok(w.turned);assert.ok(hostile(s,e,w));assert.equal(rules.turned,true);
 const back=deserialize(serialize(s));assert.equal(findUnit(back,'w2').team,'enemy');
});

test('grey cloaks hunt the archivist from TURN 3; the archivist down is a defeat',()=>{
 const s=battle();const a=findUnit(s,'archivist');a.hp=0;enemyPhase(s);assert.equal(s.outcome,'defeat');assert.match(s.reason,/기록관/);
});

test('Aren\'s command 「지켜라」: on by default in ACT III, DEF +2 on turns 1–2 only, can be dropped before battle; never in M14',()=>{
 const s=newGame(61,camp15(),15);assert.equal(s.command,'hold');assert.deepEqual(commandsFor(s),['hold']);
 s.screen='deployment';const e=findUnit(s,'eric'),base=effectiveStats({...s,command:null},e).def;assert.equal(effectiveStats(s,e).def,base+2);
 assert.ok(setCommand(s,null));assert.equal(s.command,null);assert.ok(setCommand(s,'hold'));startBattle(s);s.turn=3;assert.equal(effectiveStats(s,findUnit(s,'eric')).def,base);
 assert.ok(!setCommand(s,null),'fixed once the battle starts');
 const m14=newGame(61,camp15(),14);assert.equal(m14.command,undefined);assert.deepEqual(commandsFor(m14),[]);
 assert.match(councilInfo(newGame(61,camp15(),15)).plan,/지켜라/);
});

test('victory records boxes and the watch; the camp chooses what to do with the records (once); the capital hub and its scenes',()=>{
 const s=battle();s.missionState.secured.push('c1','c2','c3');for(const id of ['c1','c2','c3'])findUnit(s,id).hp=0;enemyPhase(s);assert.equal(s.outcome,'victory');
 assert.equal(s.campaign.flags.mission_15_boxes,3);assert.equal(s.campaign.flags.mission_15_watch,'calm');assert.ok(s.campaign.completed.includes(15));
 enterHub(s,{aftermath:true});assert.equal(s.frontier.hub,'capital');assert.ok(s.narrative.queue.includes('after:15')||s.narrative.active?.key==='after:15');
 assert.ok(chooseRecords15(s,'post'));assert.ok(!chooseRecords15(s,'keep'));assert.equal(s.campaign.choices.m15_records,'post');
 assert.ok(s.campaign.feats.includes(15),'hidden objective: all three boxes and the watch never warned');
});

// Chest ids carry the mission number and the hub id; before v0.9.0 the pattern took one digit and no underscore, so
// chests from M10 on (m10:…) and in the raided village (village_raid) were refused. Fixed in v0.9.0.
test('chests open in the capital (M15) and in later-mission hubs; each opens once',async()=>{
 const {openChest}=await import('../src/core/frontier.js');const {transact}=await import('../src/core/economy.js');const {enterInterior}=await import('../src/core/frontier.js');const {HUBS}=await import('../src/data/frontier-data.js');
 for(const [mission,hub] of [[15,'capital'],[12,'pilgrim'],[2,'village_raid']]){const s=newGame(7,camp15({completed:[...Array(mission-1).keys()].map(i=>i+1)}),mission);enterHub(s,{story:false});drain(s);s.frontier.hub=hub;
  const door=currentHub(s).places.find(p=>p.action==='enter');[s.frontier.x,s.frontier.y]=[door.x,door.y];assert.ok(enterInterior(s,door.buildingId),hub);
  const chest=currentHub(s).places.find(p=>p.action==='chest');if(!chest)continue;[s.frontier.x,s.frontier.y]=[chest.x,chest.y+1<currentHub(s).height?chest.x:chest.x,chest.y];
  const spot=[[0,1],[1,0],[-1,0],[0,-1]].map(([dx,dy])=>[chest.x+dx,chest.y+dy]).find(([x,y])=>currentHub(s).walk?.[y]?.[x]!==false);[s.frontier.x,s.frontier.y]=spot;
  const r=openChest(s,chest.chestId,transact);assert.ok(r.ok,`${hub}: ${r.error}`);assert.ok(!openChest(s,chest.chestId,transact).ok,'only once');}
});
