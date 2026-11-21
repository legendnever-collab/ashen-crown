// v1.0.0 — M30 The Crownless Dawn and the endings. Hold the heart stone until the end of TURN 8 against the last wave of ash
// (all three banners fight beside the legion; Baldrick after 「협력」); the heart broken loses. Then the ending: the M22 path's
// ending is always open, the other two by a banner's trust (2+) and one story choice; the player picks one; its scene, the
// epilogue (every hero, Aren, the king, Bellard, Baldrick when he did not join, the three leaders) and the ending card. The save
// stays open after the ending.
import test from 'node:test';import assert from 'node:assert/strict';
import {MISSIONS} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {newGame,startBattle,beginEnemyPhase,advanceEnemy,deployLimit,canOrderAlly} from '../src/core/game.js';
import {findUnit,alive,supportable} from '../src/core/rules.js';
import {M30} from '../src/core/mission-rules-v100.js';
import {ENDINGS,openEndings,endingOpen,endingReady,chooseEnding,epilogue,validEnding,campaignTotals} from '../src/core/ending.js';
import {supplementalRewards} from '../src/core/battle-rewards.js';
import {rewardFor} from '../src/core/economy.js';
import {FEATS} from '../src/data/arms-v081.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';
const camp=(extra={},flags={},choices={})=>({heroes:null,results:[],clears:29,completed:[...Array(29).keys()].map(i=>i+1),flags:{act1_completed:true,act2_completed:true,act3_completed:true,mission_14_betrayer:'iron',mission_13_baldrick:'held',mission_26_baldrick:'withdraw',mission_29_words:true,king_rests:true,...flags},
 choices:{act3_choice:'council',m23_lead:'legion',m25_banner:'forgive',m28_confession:'eric',m29_bellard:'trial',m21_king:'promise',m20_plan:'keep',m17_oath:'leave',m16_stones:'leave',...choices},factionTrust:{iron:2,free:3,flame:1},factionsMet:['iron','free','flame'],roster:['thea','dario','ines'],...extra});
const battle=(extra,flags,choices)=>{const s=newGame(100,camp(extra,flags,choices),30);s.screen='deployment';startBattle(s);drain(s);return s;};
const enemyPhase=s=>{beginEnemyPhase(s);for(let i=0;s.phase==='enemy'&&!s.outcome&&i<200;i++){advanceEnemy(s);drain(s);}drain(s);};
const sturdy=s=>{for(const u of s.units.filter(u=>u.team==='ally'||u.id==='heart')){u.hp=u.maxHP=999;u.def=999;}}; /* v2.5.1: on the big map a level-up mid-phase resets max HP, so the heroes hold by armour */
const won=(extra,flags,choices)=>{const s=battle(extra,flags,choices);for(let i=0;!s.outcome&&i<12;i++){sturdy(s);enemyPhase(s);}assert.equal(s.outcome,'victory');return s;};

test('M30 data: 30×18 courtyard at dawn (v2.5.1 big map, five breaches), level 21, sortie of eight, hold to TURN 8; the heart stone, all three banners; scenes',()=>{
 const m=MISSIONS[30];assert.deepEqual([m.width,m.height],[30,18]);assert.ok(m.v251);assert.equal(m.level,21);assert.equal(m.deployLimit,8);assert.equal(m.holdTurn,8);
 for(const k of ['30:intro','30:tide','30:last','30:heart:lost','30:end','pre:30','after:30','ending:A','ending:B','ending:C','npc:30:preparation:lia','npc:30:aftermath:refugee'])assert.ok(STORY[k]?.length,k);
 const s=battle();assert.equal(deployLimit(s),8);for(const id of ['ib1','fb1','lb1'])assert.ok(canOrderAlly(s,findUnit(s,id)),id);assert.ok(findUnit(s,'bk').absent,'Baldrick withdrew at M26');assert.ok(!supportable(findUnit(s,'heart')));
 const c=battle({},{mission_26_baldrick:'cooperate'});assert.ok(alive(findUnit(c,'bk')));
});
test('hold until the end of TURN 8 (victory, ACT IV complete); the heart broken loses',()=>{
 const s=won();assert.equal(s.turn,9);assert.equal(s.campaign.flags.act4_completed,true);assert.equal(s.campaign.flags.mission_30_turn,8);assert.equal(s.campaign.flags.mission_30_unbroken,true);
 const d=battle(),h=findUnit(d,'heart');h.hp=0;M30.afterDamage(d,h);enemyPhase(d);assert.equal(d.outcome,'defeat');assert.match(d.reason,/결계의 심장/);
 assert.equal(rewardFor(30),700);assert.equal(supplementalRewards(30,{heartHalf30:true}).length,3);assert.equal(FEATS[30].reward,'dawnRing');assert.ok(!FEATS[30].test({},{mission_30_unbroken:false}));
});
test('which endings open: the M22 path always; the others by trust 2+ and one choice; at least one',()=>{
 const base={choices:{act3_choice:'king'},factionTrust:{iron:0,free:0,flame:0}};assert.deepEqual(openEndings(base),['A']);
 assert.deepEqual(openEndings({choices:{act3_choice:'king',m20_plan:'send',m17_oath:'leave'},factionTrust:{iron:0,free:2,flame:2}}),['A','B','C']);
 assert.ok(!endingOpen({choices:{act3_choice:'oath',m21_king:'notyet'},factionTrust:{iron:3}},'A'),'A needs the promise');assert.ok(endingOpen({choices:{act3_choice:'oath',m21_king:'promise'},factionTrust:{iron:2}},'A'));
 assert.ok(!endingOpen({choices:{act3_choice:'king',m17_oath:'leave'},factionTrust:{flame:1}},'C'),'C needs flame trust 2');
 assert.deepEqual(openEndings({choices:{},factionTrust:{}}),['B'],'never none');
 for(const e of Object.values(ENDINGS))for(const k of ['holds','gain','cost','opens'])assert.ok(e[k].length>10,`${e.id} ${k}`);
});
test('the ending is chosen once, after M30, among the open ones; it is kept in the save; the camp stays open',()=>{
 const s=won();assert.ok(endingReady(s));const open=openEndings(s.campaign);assert.deepEqual(open,['A','B','C'].filter(id=>open.includes(id)));assert.ok(open.includes('B'),'the council path');
 const closed=['A','B','C'].find(id=>!open.includes(id));if(closed)assert.ok(!chooseEnding(s,closed),'a closed ending cannot be chosen');
 assert.ok(chooseEnding(s,'B',new Date('2026-11-17T09:00:00Z')));assert.deepEqual(s.campaign.ending,{id:'B',at:'2026-11-17',path:'council',bellard:'trial',confession:'eric'});assert.ok(!chooseEnding(s,'A'),'once');assert.ok(!endingReady(s));
 const back=deserialize(serialize(s));assert.deepEqual(back.campaign.ending,s.campaign.ending);
 const bad=structuredClone(s);bad.campaign.ending.id='D';assert.throws(()=>serialize(bad));const early=structuredClone(s);early.campaign.completed=early.campaign.completed.filter(id=>id!==30);assert.ok(!validEnding(early.campaign));
 const p=battle();p.practice=true;assert.ok(!endingReady(p),'never in practice');
});
test('the epilogue: every hero in the legion (3–5 lines), Aren, the king, Bellard by his fate, Baldrick when he did not join, the three leaders',()=>{
 const s=won();chooseEnding(s,'B');const cards=epilogue(s.campaign);const ids=cards.map(k=>k.id);
 for(const id of ['eric','elina','lia','sain','kai','thea','dario','ines','aren','king','bellard','baldrick','cassian','leonora','lucien'])assert.ok(ids.includes(id),id);
 for(const k of cards.filter(k=>k.kind==='hero'))assert.ok(k.lines.length>=2&&k.lines.length<=5,`${k.id} ${k.lines.length}`);
 assert.match(cards.find(k=>k.id==='bellard').lines.join(' '),/재판/);assert.match(cards.find(k=>k.id==='baldrick').lines.join(' '),/고개/);
 const all=['A','B','C'].map(id=>epilogue(s.campaign,id).find(k=>k.id==='eric').lines[0]);assert.equal(new Set(all).size,3,'each ending its own line');
 const j=won({roster:['thea','dario','ines','baldrick']},{mission_26_baldrick:'join',mission_13_baldrick:'halted'});chooseEnding(j,'B');const jc=epilogue(j.campaign);assert.equal(jc.filter(k=>k.id==='baldrick').length,1);assert.equal(jc.find(k=>k.id==='baldrick').kind,'hero');
 const t=campaignTotals(s.campaign);assert.equal(t.missions,30);assert.ok(t.battles>=1&&t.turns>=8);
});
