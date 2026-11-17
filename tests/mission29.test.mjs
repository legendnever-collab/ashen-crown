// v1.0.0 — M29 The Heart of the Crown: Bellard in two phases; three rite points of the new ward, placed by the path chosen at
// M22; a hero beside a rite point mends it; TURN 2 the duel — or Aren's last words (the crown answers Bellard less, and he may
// later ask to give his own memory to the ward). Bellard's second phase struck down with two rite points standing wins; two
// rite points broken or TURN 14 ending loses. Then Bellard's fate (trial / exile / his own offer) and the king rests.
import test from 'node:test';import assert from 'node:assert/strict';
import {MISSIONS} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {newGame,startBattle,beginEnemyPhase,advanceEnemy,deployLimit,canOrderAlly} from '../src/core/game.js';
import {findUnit,alive,supportable} from '../src/core/rules.js';
import {M29,ritePath29,ritesStanding29,squads29,lion29,chooseFate29,fateOpen29,FATE29} from '../src/core/mission-rules-v100.js';
import {duelPick,duelOpen} from '../src/core/duel.js';
import {supplementalRewards} from '../src/core/battle-rewards.js';
import {rewardFor} from '../src/core/economy.js';
import {FEATS} from '../src/data/arms-v081.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';
const camp=(extra={},flags={},choices={})=>({heroes:null,results:[],clears:28,completed:[...Array(28).keys()].map(i=>i+1),flags:{act1_completed:true,act2_completed:true,act3_completed:true,mission_14_betrayer:'iron',mission_13_baldrick:'held',mission_26_baldrick:'cooperate',...flags},
 choices:{act3_choice:'council',m23_lead:'legion',m25_banner:'forgive',m28_confession:'all',...choices},factionTrust:{iron:2,free:3,flame:1},factionsMet:['iron','free','flame'],roster:['thea','dario','ines'],...extra});
const battle=(extra,flags,choices)=>{const s=newGame(100,camp(extra,flags,choices),29);s.screen='deployment';startBattle(s);drain(s);return s;};
const enemyPhase=s=>{for(let i=0;duelOpen(s)&&i<3;i++)duelPick(s,'strike');beginEnemyPhase(s);for(let i=0;s.phase==='enemy'&&!s.outcome&&i<200;i++){advanceEnemy(s);drain(s);}drain(s);};
const quiet=s=>{for(const u of s.units.filter(u=>u.team==='enemy'&&u.id!=='boss'))u.hp=0;};
const strikeBoss=(s,n)=>{const b=findUnit(s,'boss');b.hp=Math.max(0,b.hp-n);M29.afterDamage(s,b);};

test('M29 data: 18×14 crown heart, level 21, sortie of eight, TURN 14; Bellard, three rite points, scenes and talks',()=>{
 const m=MISSIONS[29];assert.deepEqual([m.width,m.height],[18,14]);assert.equal(m.level,21);assert.equal(m.deployLimit,8);assert.equal(m.turnLimit,14);assert.equal(m.needRites,2);assert.equal(m.duelTurn,2);
 for(const path of ['king','council','oath'])for(const [x,y] of m.rites29[path])assert.equal(m.map[y][x],'k',`${path} ${x},${y}`);
 for(const k of ['29:intro','29:path:king','29:path:council','29:path:oath','29:duel','29:duel:hero','29:duel:foe','29:words','29:crown','29:crown:words','29:fall','29:rite:broken','29:end','pre:29','after:29','after:29:trial','after:29:exile','after:29:offer','npc:29:preparation:aren','npc:29:aftermath:elder'])assert.ok(STORY[k]?.length,k);
 const s=battle();assert.equal(deployLimit(s),8);assert.equal(findUnit(s,'boss').look,'bellard');
});
test('the rite points stand where the M22 path puts them; squads at trust 2+, Baldrick after 「협력」; a rite point is not healed but mends beside a hero',()=>{
 for(const path of ['king','council','oath']){const s=battle({},{},{act3_choice:path});assert.equal(ritePath29(s.campaign),path);assert.deepEqual(['rp1','rp2','rp3'].map(id=>{const r=findUnit(s,id);return [r.x,r.y];}),MISSIONS[29].rites29[path]);}
 const s=battle();assert.deepEqual(s.missionState.squads,['iron','free']);assert.ok(s.missionState.lion);for(const id of ['ib1','fb1','bk'])assert.ok(canOrderAlly(s,findUnit(s,id)),id);assert.ok(findUnit(s,'lb1').absent);
 assert.deepEqual(squads29({factionTrust:{iron:0,free:2,flame:3}}),['free','flame']);assert.ok(!lion29({flags:{mission_26_baldrick:'join'}}));
 const r=findUnit(s,'rp1'),e=findUnit(s,'eric');assert.ok(!supportable(r),'a rite point is not a patient');quiet(s);r.hp=60;e.x=r.x;e.y=r.y+1;if(MISSIONS[29].map[e.y][e.x]!=='k')e.y=r.y-1;
 enemyPhase(s);assert.equal(r.hp,70,'mended by 10 at the start of the player phase');
 assert.deepEqual(deserialize(serialize(s)).missionState,s.missionState);
});
test('Bellard rises once with the crown\'s power; his second fall with two rite points standing wins; two broken lose; TURN 14 loses',()=>{
 const s=battle();quiet(s);const b=findUnit(s,'boss');strikeBoss(s,999);assert.equal(s.missionState.phase,2);assert.ok(alive(b));assert.equal(b.maxHP,MISSIONS[29].crown29.full.hp);assert.equal(b.atk,MISSIONS[29].crown29.full.atk);assert.ok(b.crowned);
 deserialize(serialize(s));strikeBoss(s,999);assert.ok(s.missionState.fallen);enemyPhase(s);assert.equal(s.outcome,'victory');assert.equal(s.campaign.flags.mission_29_rites,3);assert.equal(s.campaign.flags.king_rests,true);
 const d=battle();for(const id of ['rp1','rp2']){const r=findUnit(d,id);r.hp=0;M29.afterDamage(d,r);}enemyPhase(d);assert.equal(d.outcome,'defeat');assert.match(d.reason,/의식 지점/);
 const l=battle();while(!l.outcome&&l.turn<20){for(const u of l.units.filter(u=>u.team==='ally'||['rp1','rp2','rp3'].includes(u.id)))u.hp=u.maxHP;enemyPhase(l);}assert.equal(l.outcome,'defeat');assert.match(l.reason,/TURN 14/);
});
test('TURN 2: the duel with Bellard, or Aren\'s last words (skip) — the crown then answers him less and his own offer opens',()=>{
 const s=battle();quiet(s);enemyPhase(s);assert.equal(s.turn,2);assert.equal(s.duel?.key,'29:duel');assert.ok(duelPick(s,'skip'));M29.beforeEnemyPhase(s);assert.equal(s.missionState.words,true);
 strikeBoss(s,999);const b=findUnit(s,'boss');assert.equal(b.maxHP,MISSIONS[29].crown29.words.hp);assert.ok(b.maxHP<MISSIONS[29].crown29.full.hp);
 strikeBoss(s,999);enemyPhase(s);assert.equal(s.outcome,'victory');assert.equal(s.campaign.flags.mission_29_duel,'skipped');assert.equal(s.campaign.flags.mission_29_words,true);
 assert.ok(fateOpen29(s.campaign,'offer'));assert.ok(chooseFate29(s,'offer'));assert.equal(s.campaign.choices.m29_bellard,'offer');assert.ok(!chooseFate29(s,'trial'),'once');assert.equal(s.campaign.factionTrust.flame,2);deserialize(serialize(s));
 const t=battle();quiet(t);enemyPhase(t);for(let i=0;i<3&&!t.duel.result;i++)duelPick(t,'strike');M29.beforeEnemyPhase(t);assert.equal(t.missionState.words,false);strikeBoss(t,999);strikeBoss(t,999);enemyPhase(t);assert.equal(t.outcome,'victory');
 assert.ok(!fateOpen29(t.campaign,'offer'),'without Aren\'s words Bellard does not ask');assert.ok(!chooseFate29(t,'offer'));assert.ok(chooseFate29(t,'exile'));assert.equal(t.campaign.factionTrust.iron,3);
 assert.deepEqual(Object.keys(FATE29),['trial','exile','offer']);
});
test('rewards, the hidden objective (all three rite points) and its treasure',()=>{
 assert.equal(rewardFor(29),660);assert.equal(supplementalRewards(29,{rites29:3}).length,3);assert.equal(supplementalRewards(29,{rites29:2}).length,2);
 assert.equal(FEATS[29].reward,'bellardQuill');assert.ok(FEATS[29].test({turn:9},{mission_29_rites:3}));assert.ok(!FEATS[29].test({turn:9},{mission_29_rites:2}));
});
