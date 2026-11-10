// v0.10.1 — M25 The Banners of the Three Houses: the M14 betrayer's hardliners hold the north camp; the other two banners
// hold the west and east camps — allied (orderable) at trust 3, otherwise neutral (they fight only the hardliners and the
// legion cannot strike them); the hardline captain falling with both leaders standing wins; a leader falling or TURN 12
// ending loses; then the betrayed banner is forgiven (+2) or made to lower its banner (−1, the others +1).
import test from 'node:test';import assert from 'node:assert/strict';
import {MISSIONS} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {newGame,startBattle,beginEnemyPhase,advanceEnemy,canOrderAlly} from '../src/core/game.js';
import {findUnit,alive,hostile,validTarget} from '../src/core/rules.js';
import {M25,camps25,chooseBanner25,BANNER25} from '../src/core/mission-rules-v0101.js';
import {ensureTrust} from '../src/core/factions.js';
import {supplementalRewards} from '../src/core/battle-rewards.js';
import {FEATS} from '../src/data/arms-v081.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';
const camp=(extra={})=>({heroes:null,results:[],clears:24,completed:[...Array(24).keys()].map(i=>i+1),flags:{act1_completed:true,act2_completed:true,act3_completed:true,mission_14_betrayer:'iron',mission_13_baldrick:'halted'},
 choices:{act3_choice:'council',m23_lead:'legion'},factionTrust:{iron:-1,free:3,flame:2},factionsMet:['iron','free','flame'],roster:['thea','dario','ines'],...extra});
const battle=extra=>{const s=newGame(100,camp(extra),25);s.screen='deployment';startBattle(s);drain(s);return s;};
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
const quiet=s=>{for(const u of s.units.filter(u=>u.camp==='north'))u.hp=0;s.units.filter(u=>u.team==='ally').forEach((u,i)=>{u.x=4+i;u.y=12;});};

test('M25 data: 18×14 summit field, level 19, sortie of seven, TURN 12; a north camp of hardliners, west and east camps with a leader each; scenes',()=>{
 const m=MISSIONS[25];assert.deepEqual([m.width,m.height],[18,14]);assert.equal(m.level,19);assert.equal(m.deployLimit,7);assert.equal(m.turnLimit,12);
 assert.ok(m.enemies.every(u=>u.camp==='north'));assert.deepEqual(m.allies.filter(a=>a.leader).map(a=>[a.id,a.camp]),[['lw','west'],['le','east']]);
 for(const k of ['25:intro','25:reason:iron','25:reason:free','25:reason:flame','25:allied','25:neutral','25:flank','25:riders','25:captain:down','25:leader:down','25:end','pre:25','after:25','after:25:forgive','after:25:lower','npc:25:preparation:aren','npc:25:aftermath:guard','world:banners'])assert.ok(STORY[k]?.length,k);
});
test('the camps follow the M14 betrayer; a banner at trust 3 fights beside the legion (orders), the other stands neutral',()=>{
 assert.deepEqual(camps25({flags:{mission_14_betrayer:'free'},factionTrust:{iron:1,free:0,flame:1}}),{north:'free',west:'iron',east:'flame'});
 const s=battle(),st=s.missionState;assert.deepEqual(st.camps,{north:'iron',west:'free',east:'flame'});
 const lw=findUnit(s,'lw'),le=findUnit(s,'le'),hc=findUnit(s,'hc');assert.equal(lw.team,'allied');assert.equal(lw.name,'레오노라 · 연맹 의장');assert.ok(canOrderAlly(s,lw));
 assert.equal(le.team,'enemy');assert.ok(le.neutral);assert.equal(le.name,'루시안 · 성화 대사제');assert.deepEqual(st.neutral.sort(),['e1','e2','e3','le']);
 assert.equal(hc.faction,'iron');assert.match(hc.name,/철왕관 강경파 대장/);
 const e=findUnit(s,'eric');assert.ok(!hostile(s,e,le),'the legion cannot strike a neutral camp');e.x=15;e.y=7;assert.ok(!validTarget(s,e,le,'attack'));assert.ok(hostile(s,le,hc),'the neutral camp fights the hardliners');assert.ok(!hostile(s,lw,le),'allied and neutral are not at war');
 const back=deserialize(serialize(s));assert.equal(findUnit(back,'le').team,'enemy');assert.deepEqual(back.missionState,s.missionState);
 const bad=structuredClone(s);bad.missionState.neutral=[];assert.throws(()=>serialize(bad),'a neutral unit outside the list is rejected');
});
test('the captain falling with both leaders standing wins; a leader falling or TURN 12 ending loses',()=>{
 const s=battle(),hc=findUnit(s,'hc');hc.hp=0;M25.afterDamage(s,hc);enemyPhase(s);assert.equal(s.outcome,'victory');assert.equal(s.campaign.flags.mission_25_betrayer,'iron');
 const d=battle(),l=findUnit(d,'le');l.hp=0;M25.afterDamage(d,l);enemyPhase(d);assert.equal(d.outcome,'defeat');assert.match(d.reason,/루시안/);
 const t=battle();while(!t.outcome&&t.turn<20){quiet(t);for(const u of t.units.filter(u=>u.camp!=='north'&&u.team!=='ally'))u.hp=u.maxHP=999;enemyPhase(t);}assert.equal(t.outcome,'defeat');assert.match(t.reason,/TURN 12/);
});
test('forgive or lower the betrayed banner: once, after the win; trust moves; rewards and the feat',()=>{
 assert.deepEqual(Object.keys(BANNER25),['forgive','lower']);
 const s=battle();assert.ok(!chooseBanner25(s,'forgive'),'not before the win');const hc=findUnit(s,'hc');hc.hp=0;M25.afterDamage(s,hc);enemyPhase(s);const t0={...ensureTrust(s.campaign)};
 assert.ok(chooseBanner25(s,'forgive'));assert.ok(!chooseBanner25(s,'lower'));assert.equal(ensureTrust(s.campaign).iron,t0.iron+2);
 const l=battle(),h2=findUnit(l,'hc');h2.hp=0;M25.afterDamage(l,h2);enemyPhase(l);const t1={...ensureTrust(l.campaign)};assert.ok(chooseBanner25(l,'lower'));const t2=ensureTrust(l.campaign);
 assert.equal(t2.iron,t1.iron-1);assert.equal(t2.free,Math.min(3,t1.free+1));assert.equal(t2.flame,t1.flame+1);assert.equal(l.campaign.flags.mission_25_banner,'lower');
 assert.equal(supplementalRewards(25,{leadersHalf25:true}).length,3);assert.equal(supplementalRewards(25,{leadersHalf25:false}).length,2);
 assert.equal(FEATS[25].reward,'threeSeals');assert.ok(FEATS[25].test({turn:8},{mission_25_leaders_half:true}));assert.ok(!FEATS[25].test({turn:9},{mission_25_leaders_half:true}));
});
