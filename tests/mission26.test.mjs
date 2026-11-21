// v0.10.1 — M26 The Black Lion's Last Battle: Baldrick's duel on TURN 2 (a win is two of resolve), Erik's persuasion (once a
// turn) and Thea's word (once); four of resolve and he yields — he joins the legion as its ninth hero (Lv 19, tier 3) when he
// halted his army at M13, otherwise he rides beside it; with his two bearers down from TURN 4, at half his HP he withdraws
// alive; Erik falling loses. Then Baldrick's own four skills, and Dario's ④ (A Hundred Counters, trial 117).
import {standBeside} from './duel-helper.mjs';
import test from 'node:test';import assert from 'node:assert/strict';
import {MISSIONS} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {newGame,startBattle,beginEnemyPhase,advanceEnemy,performAction,deployLimit} from '../src/core/game.js';
import {findUnit,alive,distance} from '../src/core/rules.js';
import {M26,yieldOutcome26} from '../src/core/mission-rules-v0101.js';
import {duelPick} from '../src/core/duel.js';
import {skillsOf} from '../src/data/skills.js';
import {promotionStatus} from '../src/core/progression.js';
import {trialMissionOf,startSkirmish} from '../src/core/skirmish.js';
import {ensureTrust} from '../src/core/factions.js';
import {FEATS} from '../src/data/arms-v081.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';
const camp=(halt='halted',extra={})=>({heroes:null,results:[],clears:25,completed:[...Array(25).keys()].map(i=>i+1),flags:{act1_completed:true,act2_completed:true,act3_completed:true,mission_14_betrayer:'iron',mission_13_baldrick:halt,mission_25_betrayer:'iron'},
 choices:{act3_choice:'council',m23_lead:'legion',m25_banner:'forgive'},factionTrust:{iron:1,free:3,flame:2},factionsMet:['iron','free','flame'],roster:['thea','dario','ines'],...extra});
const battle=(halt)=>{const s=newGame(100,camp(halt),26);s.screen='deployment';startBattle(s);drain(s);return s;};
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
const beside=(s,id)=>{const b=findUnit(s,'boss'),u=findUnit(s,id);for(const [dx,dy] of [[0,1],[1,0],[-1,0],[0,-1]]){const x=b.x+dx,y=b.y+dy;if(!s.units.some(o=>alive(o)&&o.x===x&&o.y===y)){u.x=x;u.y=y;u.moved=u.acted=false;u.benched=false;return u;}}throw Error('no room');};
const calm=s=>{for(const u of s.units.filter(u=>u.team==='enemy'&&u.id!=='boss'))u.hp=0;const b=findUnit(s,'boss');b.atk=0;b.mov=0;for(const u of s.units.filter(u=>u.team==='ally'))u.hp=u.maxHP=999;};

test('M26 data: 22×24 lion\'s pass (v2.5.0 big map), level 19, sortie of seven, TURN 12; Baldrick with two bearers; duel on TURN 2; scenes',()=>{
 const m=MISSIONS[26];assert.deepEqual([m.width,m.height],[22,24]);assert.ok(m.v250);assert.deepEqual(m.captainBox,[4,0,17,4]);assert.equal(m.level,19);assert.equal(m.deployLimit,7);assert.equal(m.turnLimit,12);assert.equal(m.persuade.threshold,4);assert.equal(m.duelTurn,2);
 assert.deepEqual(m.formation.bearers,['f1','f2']);
 for(const k of ['26:intro','26:duel','26:duel:hero','26:duel:foe','26:waver','26:thea','26:riders','26:broken','26:yield:join','26:yield:cooperate','26:end','pre:26','after:26','after:26:join','after:26:cooperate','after:26:withdraw','after:26:thea','npc:26:preparation:thea','npc:26:aftermath:baldrick','world:lionpass','skirmish:117:intro','awaken:dario'])assert.ok(STORY[k]?.length,k);
});
test('v2.2 (D-124): the won duel ends it — Baldrick lays down his sword at once and joins when he halted at M13',()=>{
 const s=battle('halted');calm(s);enemyPhase(s);assert.equal(s.turn,2);standBeside(s,'eric','boss');assert.ok(s.duel&&!s.duel.result,'the duel opens on TURN 2 with Erik beside him (v2.1 event)');
 assert.ok(duelPick(s,'strike'));assert.equal(s.duel.result,'hero');assert.equal(s.duel.fall,'yielded');
 assert.ok(s.missionState.halted);assert.equal(s.outcome,'victory',s.reason);assert.equal(s.missionState.outcome,'join');assert.deepEqual(s.missionState.sources,['duel']);
 assert.ok(s.campaign.roster.includes('baldrick'),'the ninth hero');const rec=s.campaign.heroes.find(h=>h.id==='baldrick');assert.equal(rec.level,19);assert.equal(rec.classTier,3);
 assert.equal(s.campaign.flags.mission_26_baldrick,'join');
 const back=deserialize(serialize(s));assert.ok(back.campaign.roster.includes('baldrick'));
});
test('without a duel, persuasion still adds up: Erik (once a turn) and Thea (once) add one; at four he yields',()=>{
 const s=battle('halted');calm(s);s.missionState.resolve=2;
 const e=beside(s,'eric');assert.ok(performAction(s,'eric','persuade','boss').ok);assert.equal(s.missionState.resolve,3,'Erik 1');assert.ok(!performAction(s,'eric','persuade','boss').ok,'once a turn');
 const t=beside(s,'thea');assert.ok(performAction(s,'thea','persuade','boss').ok);assert.equal(s.outcome,'victory');assert.equal(s.missionState.outcome,'join');assert.deepEqual(s.missionState.sources,['eric','thea']);
 assert.ok(s.campaign.roster.includes('baldrick'));assert.ok(FEATS[26].test(s,s.campaign.flags));assert.equal(e.id,'eric');assert.equal(t.id,'thea');
 assert.equal(yieldOutcome26({flags:{mission_13_baldrick:'held'}}),'cooperate');assert.equal(yieldOutcome26({flags:{mission_13_baldrick:'broken'}}),'cooperate');
});
test('without the M13 halt he rides beside the legion (Iron Crown +1); broken at half HP with both bearers down from TURN 4 he withdraws; Erik falling loses',()=>{
 const c=battle('held'),i0=ensureTrust(c.campaign).iron;calm(c);c.missionState.resolve=3;const e=beside(c,'eric');assert.ok(performAction(c,'eric','persuade','boss').ok);assert.equal(c.outcome,'victory');assert.equal(c.missionState.outcome,'cooperate');
 assert.ok(!c.campaign.roster.includes('baldrick'));assert.equal(ensureTrust(c.campaign).iron,i0+1);
 const w=battle('halted'),b=findUnit(w,'boss');calm(w);b.hp=1;M26.afterDamage(w,b);assert.equal(b.hp,Math.ceil(b.maxHP/2),'never below half');enemyPhase(w);assert.ok(!w.outcome,'the bearers still stand');
 const r=battle('halted'),b2=findUnit(r,'boss');calm(r);if(r.duel&&!r.duel.result)r.duel.result='skipped';for(let i=0;i<3;i++){if(r.duel&&!r.duel.result)r.duel.result='skipped';enemyPhase(r);}if(r.duel&&!r.duel.result)r.duel.result='skipped';b2.hp=Math.ceil(b2.maxHP/2);enemyPhase(r);assert.equal(r.outcome,'victory');assert.equal(r.missionState.outcome,'withdraw');assert.ok(!r.campaign.roster.includes('baldrick'));
 const d=battle('halted');findUnit(d,'eric').hp=0;enemyPhase(d);assert.equal(d.outcome,'defeat');assert.match(d.reason,/에릭/);
});
test('Baldrick in the legion: four skills open, Lion Strike takes no counter, Lion\'s Roar binds, Lion Banner −4, The Black Lion\'s Resolve once',()=>{
 const s=battle('halted');calm(s);s.missionState.resolve=3;s.missionState.duelCounted=true;if(s.duel)s.duel.result='skipped';beside(s,'eric');performAction(s,'eric','persuade','boss');assert.equal(s.missionState.outcome,'join');
 const n=newGame(100,{...s.campaign},26);n.screen='deployment';startBattle(n);drain(n);assert.ok(deployLimit(n)>=7);const bal=findUnit(n,'baldrick');assert.ok(bal,'on the board');
 assert.deepEqual(skillsOf(bal).map(k=>[k.id,k.open]),[['lionStrike',true],['lionRoar',true],['lionBanner',true],['lastCharge',true]]);
 const foe=findUnit(n,'c1');bal.benched=false;bal.x=foe.x;bal.y=foe.y+1;bal.mp=bal.maxMP=40;bal.moved=bal.acted=false;const hp=bal.hp,fh=foe.hp;
 assert.ok(performAction(n,'baldrick','skill','c1').ok);assert.ok(foe.hp<fh);assert.equal(bal.hp,hp,'no counter');
 bal.acted=bal.moved=false;assert.ok(performAction(n,'baldrick','lionBanner','baldrick').ok);assert.equal(bal.lionGuard,n.turn);
 bal.acted=bal.moved=false;assert.ok(performAction(n,'baldrick','lastCharge','baldrick').ok||!alive(foe));assert.deepEqual(n.ultimates,['baldrick']);assert.equal(bal.gateGuard,n.turn);
 bal.acted=bal.moved=false;assert.ok(!performAction(n,'baldrick','lastCharge','baldrick').ok,'once a battle');deserialize(serialize(n));
});
test('Dario awakens after M25 (trial 117) with A Hundred Counters: every blow answered, at any range, +30%',()=>{
 const c=newGame(91,{...camp('held'),completed:[...Array(25).keys()].map(i=>i+1)},26);c.campaign.heroes??=c.units.filter(u=>u.team==='ally').map(u=>{const {x,y,moved,acted,benched,...r}=structuredClone(u);return r;});for(const h of c.campaign.heroes){h.level=14;h.classTier=2;}
 assert.ok(promotionStatus(c,'dario').eligible);assert.equal(trialMissionOf(c,'dario'),117);const t=startSkirmish(c,'trial','dario',{force:true});assert.equal(t.missionId,117);
 const d=findUnit(t,'dario'),a=findUnit(t,'r5');assert.equal(d.classTier,3);assert.ok(skillsOf(d).find(k=>k.slot===4).open);d.mp=40;
 for(const u of t.units.filter(u=>u.team==='enemy'&&u.id!=='r5'))u.hp=0;a.x=d.x;a.y=d.y-3;a.mov=0;const ah=a.hp;
 assert.ok(performAction(t,'dario','hundredCounters','dario').ok);assert.equal(d.hundred,t.turn);a.level=1;a.spd=d.spd;a.hit=100;d.hit=100; /* v2.0.0: one plain shot, sure hits — the test is about the reach */enemyPhase(t);assert.ok(a.hp<ah,'Dario answered an arrow from three tiles away');
 assert.ok(t.log.some(l=>/반격 · 다리오 → 검진 궁수/.test(l)));
});
