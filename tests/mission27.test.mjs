// v0.10.2 — M27 The Royal Gate: two fronts and a sortie of eight. The escorted ram rolls up the road (two tiles a player phase
// with a hero beside it, one with an enemy beside it, never without escort) and breaks the gate in three blows; a hero who
// ends the player phase on the rampart above a ladder takes that section. The gate broken with two sections taken wins; the
// ram destroyed or TURN 14 ending loses. Banners at trust 2 or more send squads; Baldrick rides along after an M26 「협력」.
import test from 'node:test';import assert from 'node:assert/strict';
import {MISSIONS} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {newGame,startBattle,beginEnemyPhase,advanceEnemy,deployLimit,canOrderAlly} from '../src/core/game.js';
import {findUnit,alive,supportable} from '../src/core/rules.js';
import {M27,squads27,lion27,sectionsTaken27} from '../src/core/mission-rules-v0102.js';
import {supplementalRewards} from '../src/core/battle-rewards.js';
import {rewardFor} from '../src/core/economy.js';
import {FEATS} from '../src/data/arms-v081.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';
const camp=(extra={},flags={})=>({heroes:null,results:[],clears:26,completed:[...Array(26).keys()].map(i=>i+1),flags:{act1_completed:true,act2_completed:true,act3_completed:true,mission_14_betrayer:'iron',mission_13_baldrick:'held',mission_26_baldrick:'cooperate',...flags},
 choices:{act3_choice:'council',m23_lead:'legion',m25_banner:'forgive'},factionTrust:{iron:2,free:3,flame:1},factionsMet:['iron','free','flame'],roster:['thea','dario','ines'],...extra});
const battle=(extra,flags)=>{const s=newGame(100,camp(extra,flags),27);s.screen='deployment';startBattle(s);drain(s);return s;};
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
const quiet=s=>{for(const u of s.units.filter(u=>u.team==='enemy'))u.hp=0;};
const escort=s=>{const r=findUnit(s,'ram'),e=findUnit(s,'eric');for(const [dx,dy] of [[-1,0],[1,0],[0,1]]){const x=r.x+dx,y=r.y+dy;if(!s.units.some(o=>alive(o)&&o.x===x&&o.y===y&&o.id!=='eric')&&MISSIONS[27].map[y]?.[x]!=='x'){e.x=x;e.y=y;return;}}};

test('M27 data: 18×14 royal gate, level 20, sortie of eight, TURN 14; ram, two gate leaves, three ladders; scenes',()=>{
 const m=MISSIONS[27];assert.deepEqual([m.width,m.height],[18,14]);assert.equal(m.level,20);assert.equal(m.deployLimit,8);assert.equal(m.turnLimit,14);assert.equal(m.gateBlows,3);assert.equal(m.needSections,2);
 assert.deepEqual(m.sections,[[2,2],[5,2],[14,2]]);for(const [x,y] of m.ladders)assert.equal(m.map[y][x],'q','a ladder climbs the wall');for(const [x,y] of m.sections)assert.equal(m.map[y][x],'q');
 for(const k of ['27:intro','27:squads','27:lion','27:sally','27:flank','27:blow','27:gate','27:section:1','27:section:2','27:section:3','27:ram:lost','27:end','pre:27','after:27','npc:27:preparation:aren','npc:27:aftermath:guard','world:royalgate'])assert.ok(STORY[k]?.length,k);
 const s=battle();assert.equal(deployLimit(s),8);assert.equal(s.units.filter(u=>u.team==='ally'&&!u.benched).length,8);
 for(const p of Object.values(m.deployments))assert.ok(p.every(([x,y])=>!(x>=8&&x<=9&&y<11)),'no preset blocks the road ahead of the ram');
});
test('banners at trust 2 or more send squads (orderable); Baldrick rides along only after an M26 「협력」; the others stay off the field',()=>{
 assert.deepEqual(squads27({factionTrust:{iron:2,free:3,flame:1}}),['iron','free']);assert.ok(lion27({flags:{mission_26_baldrick:'cooperate'}}));assert.ok(!lion27({flags:{mission_26_baldrick:'join'}}));
 const s=battle();assert.deepEqual(s.missionState.squads,['iron','free']);assert.equal(s.missionState.lion,true);
 for(const id of ['ib1','ib2','fb1','fb2','bk','bc1','bc2']){const u=findUnit(s,id);assert.ok(alive(u),id);assert.ok(canOrderAlly(s,u),id);}
 for(const id of ['lb1','lb2'])assert.ok(!alive(findUnit(s,id))&&findUnit(s,id).absent,id);
 const j=battle({},{mission_26_baldrick:'join'});assert.equal(j.missionState.lion,false);assert.ok(!alive(findUnit(j,'bk')));
 const back=deserialize(serialize(s));assert.deepEqual(back.missionState,s.missionState);
});
test('the ram rolls only with an escort, two tiles (one when pressed), never through a unit; three blows break the gate; the ram is not healed',()=>{
 const s=battle();quiet(s);const r=findUnit(s,'ram'),e=findUnit(s,'eric');e.x=15;e.y=12;const y0=r.y;enemyPhase(s);assert.equal(r.y,y0,'no escort, no roll');
 escort(s);enemyPhase(s);assert.equal(r.y,y0-2,'two tiles with an escort');
 while(r.y>4&&s.turn<12){escort(s);enemyPhase(s);}assert.equal(r.y,4,'at the gate');assert.equal(s.missionState.gate,0);
 for(let i=0;i<3;i++){escort(s);enemyPhase(s);}assert.equal(s.missionState.gate,3);assert.ok(s.missionState.broken);assert.ok(!alive(findUnit(s,'gl1'))&&!alive(findUnit(s,'gl2')),'the gate leaves are gone');
 assert.ok(!supportable(r),'the ram is timber, not a patient');
});
test('a hero ending the player phase on a section takes it; the gate broken with two sections wins; the ram destroyed or TURN 14 loses',()=>{
 const s=battle();quiet(s);const k=findUnit(s,'kai'),t=findUnit(s,'thea');k.x=2;k.y=2;t.x=14;t.y=2;M27.beforeEnemyPhase(s);assert.equal(sectionsTaken27(s),2);assert.deepEqual(s.missionState.sections,[true,false,true]);
 k.x=3;k.y=2;M27.beforeEnemyPhase(s);assert.equal(sectionsTaken27(s),2,'a taken section stays taken');assert.ok(!s.outcome,'the gate still stands');
 s.missionState.gate=2;const r=findUnit(s,'ram');r.x=8;r.y=4;escort(s);enemyPhase(s);assert.equal(s.outcome,'victory');assert.equal(s.campaign.flags.mission_27_sections,2);
 const d=battle(),rd=findUnit(d,'ram');rd.hp=0;M27.afterDamage(d,rd);enemyPhase(d);assert.equal(d.outcome,'defeat');assert.match(d.reason,/공성추/);
 const l=battle();while(!l.outcome&&l.turn<20){quiet(l);for(const u of l.units.filter(u=>u.team==='ally'))u.hp=u.maxHP;enemyPhase(l);}assert.equal(l.outcome,'defeat');assert.match(l.reason,/TURN 14/);
});
test('rewards, the hidden objective (all three sections) and its treasure',()=>{
 assert.equal(rewardFor(27),620);assert.equal(supplementalRewards(27,{ramHalf27:true}).length,3);assert.equal(supplementalRewards(27,{ramHalf27:false}).length,2);
 assert.equal(FEATS[27].reward,'ramHead');assert.ok(FEATS[27].test({turn:9},{mission_27_sections:3}));assert.ok(!FEATS[27].test({turn:9},{mission_27_sections:2}));
});
