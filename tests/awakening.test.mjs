// v0.9.1 — awakening (Tier 3) of Elina, Erik and Sain (Lv 14, tier 2, their mission, a won trial) with their ④ skills
// once a battle, and the recruits' tier 2 (Thea, Dario, Ines at join level + 5 after ACT II) with their ① traits.
import test from 'node:test';import assert from 'node:assert/strict';
import {newGame,startBattle,beginEnemyPhase,advanceEnemy,performAction,moveUnit,canMove} from '../src/core/game.js';
import {findUnit,alive,strikeStats,sanctuaryCut} from '../src/core/rules.js';
import {promotionStatus,commitSkirmish} from '../src/core/progression.js';
import {startSkirmish,trialMissionOf,AWAKEN_MISSION,TRIAL_MISSION} from '../src/core/skirmish.js';
import {skillsOf} from '../src/data/skills.js';
import {MISSIONS} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {recruitRecord} from '../src/core/roster.js';
import {drain} from './campaign-policy.mjs';
const all=n=>[...Array(n).keys()].map(i=>i+1);
// A camp in ACT III with heroes at `level`, the five promoted to tier 2.
function camp(done,level=14,extra={}){const s=newGame(91,{heroes:null,results:[],clears:done,completed:all(done),flags:{act1_completed:true,act2_completed:true,mission_14_betrayer:'iron'},choices:{m06_oath:'comrades'},roster:['thea','dario','ines'],factionTrust:{iron:-1,free:2,flame:2}},Math.min(18,done+1));
 s.campaign.heroes??=s.units.filter(u=>u.team==='ally').map(u=>{const {x,y,moved,acted,benched,...r}=structuredClone(u);return r;});
 for(const h of s.campaign.heroes){h.level=level;h.classTier=['thea','dario','ines'].includes(h.id)?1:2;}Object.assign(s.campaign,extra);return s;}
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
const board=(id=18,done=17)=>{const c=camp(done);const s=newGame(5,c.campaign,id);for(const u of s.units.filter(u=>u.team==='ally')){u.classTier=['thea','dario','ines'].includes(u.id)?2:3;}s.screen='deployment';startBattle(s);drain(s);for(const u of s.units.filter(u=>u.team==='enemy'))if(!['lcap','gcap'].includes(u.id))u.hp=0;
 // park the heroes on the bottom row so the tests can place them freely
 s.units.filter(u=>u.team==='ally').forEach((u,i)=>{u.x=i;u.y=13;});return s;};

test('awakening conditions: Lv 14, tier 2 and the hero\'s own mission (Elina M16, Erik M17, Sain M18; v0.9.2 Lia M19, Kai M20); trials 106–109, 114',()=>{
 const c=camp(16);let st=promotionStatus(c,'elina');assert.equal(st.next.tier,3);assert.ok(st.eligible,JSON.stringify(st.checks));assert.equal(trialMissionOf(c,'elina'),106);
 assert.ok(!promotionStatus(c,'eric').eligible,'Erik waits for M17');assert.ok(promotionStatus(camp(17),'eric').eligible);assert.ok(!promotionStatus(camp(17),'sain').eligible);
 assert.ok(!promotionStatus(camp(16,13),'elina').eligible,'below Lv 14');assert.ok(!promotionStatus(c,'lia').eligible,'Lia waits for M19');assert.ok(promotionStatus(camp(19),'lia').eligible);assert.ok(!promotionStatus(camp(19),'kai').eligible,'Kai waits for M20');assert.ok(promotionStatus(camp(20),'kai').eligible);
 assert.deepEqual(AWAKEN_MISSION,{elina:106,eric:107,sain:108,lia:109,kai:114});for(const id of [106,107,108,109,114])assert.equal(MISSIONS[id].skirmish.tier,3);
 for(const k of ['awaken:elina','awaken:eric','awaken:sain','awaken:lia','awaken:kai','skirmish:106:intro','skirmish:107:intro','skirmish:108:intro','skirmish:109:intro','skirmish:114:intro'])assert.ok(STORY[k]?.length,k);
});

test('a won awakening trial makes tier 3 permanent with its bonus; the ④ skill opens',()=>{
 const c=camp(16);const s=startSkirmish(c,'trial','elina',{force:true});assert.equal(s.missionId,106);const el=findUnit(s,'elina');assert.equal(el.classTier,3);
 assert.ok(skillsOf(el).find(k=>k.slot===4).open);for(const u of s.units.filter(u=>u.team==='enemy'))u.hp=0;enemyPhase(s);assert.equal(s.outcome,'victory',s.reason);
 assert.equal(s.campaign.promotions.elina.tier,3);assert.ok(s.campaign.flags.awakened_elina);assert.equal(s.campaign.heroes.find(h=>h.id==='elina').classTier,3);
});

test('recruits promote at join level + 5 once ACT II is over: trials 111–113, ① traits',()=>{
 const c=camp(15,13);assert.ok(promotionStatus(c,'thea').eligible);assert.equal(trialMissionOf(c,'thea'),111);assert.ok(!promotionStatus(c,'dario').eligible,'Dario joins at 9: Lv 14');
 assert.ok(!promotionStatus(camp(13,15,{flags:{act1_completed:true}}),'ines').eligible,'not before ACT II is over');assert.deepEqual([TRIAL_MISSION.thea,TRIAL_MISSION.dario,TRIAL_MISSION.ines],[111,112,113]);
 const s=startSkirmish(camp(15,15),'trial','ines',{force:true});assert.equal(s.missionId,113);assert.equal(findUnit(s,'ines').classTier,2);
 for(const k of ['promo:thea','promo:dario','promo:ines','skirmish:111:intro'])assert.ok(STORY[k]?.length,k);
});

test('④ Blockade: enemies starting inside the cross cannot leave it that enemy phase and are shot when they move; once a battle',()=>{
 const s=board(17,16);const el=findUnit(s,'elina'),g=findUnit(s,'gcap');g.x=8;g.y=11;el.x=8;el.y=7;g.mov=4;el.maxMP=el.mp=50;
 const r=performAction(s,'elina','blockade',{x:8,y:11});assert.ok(r.ok,r.error);assert.equal(s.blockade.cells.length,5);assert.deepEqual(s.ultimates,['elina']);
 const hp=g.hp;enemyPhase(s);assert.ok(s.blockade.cells.some(([x,y])=>x===g.x&&y===g.y),'stayed inside the cross');assert.ok(g.hp<=hp);
 el.acted=false;assert.ok(!performAction(s,'elina','blockade',{x:8,y:10}).ok,'once a battle');
 const back=deserialize(serialize(s));assert.deepEqual(back.ultimates,['elina']);
});

test('④ Wall of the Oath: allies within 2 take half (Erik the rest); Erik does not fall below 1 that enemy phase',()=>{
 const s=board(17,16);const e=findUnit(s,'eric'),lia=findUnit(s,'lia'),g=findUnit(s,'gcap');e.maxMP=e.mp=50;e.x=8;e.y=3;lia.x=8;lia.y=4;g.x=8;g.y=5;g.atk=lia.def+40;
 const plain=strikeStats(s,g,lia).damage;const r=performAction(s,'eric','oathWall','eric');assert.ok(r.ok,r.error);assert.equal(e.oathWall,s.turn);
 const ehp=e.hp,lhp=lia.hp;e.hp=2;enemyPhase(s);const took=lhp-lia.hp;assert.ok(took<plain,`Lia took ${took} of ${plain}`);assert.ok(e.hp>=1,'Erik stands');
 const back=deserialize(serialize(s));assert.equal(findUnit(back,'eric').oathWall,e.oathWall);
});

test('④ Dawn Prayer: the fallen hero of the battle stands up beside Sain at a third of HP',()=>{
 const s=board(18,17);const sain=findUnit(s,'sain'),kai=findUnit(s,'kai');sain.maxMP=sain.mp=50;kai.hp=0;sain.x=8;sain.y=7;
 const r=performAction(s,'sain','dawnPrayer','sain');assert.ok(r.ok,r.error);assert.equal(kai.hp,Math.ceil(kai.maxHP/3));assert.equal(Math.abs(kai.x-sain.x)+Math.abs(kai.y-sain.y)<=2,true);assert.ok(kai.raised);
 sain.acted=false;assert.ok(!performAction(s,'sain','dawnPrayer','sain').ok);deserialize(serialize(s));
});

test('Black Iron Lancer: a killing Charge leaves Thea the rest of her move; Sword Saint strikes back twice in Riposte; Sanctum Warden reaches 2',()=>{
 const s=board();const t=findUnit(s,'thea'),g=findUnit(s,'l1');t.x=8;t.y=7;g.x=8;g.y=8;g.hp=1;t.spd=99;const r=performAction(s,'thea','skill','l1');assert.ok(r.ok,r.error);
 assert.ok(canMove(s,t),'may move again');assert.ok(moveUnit(s,'thea',8,6),'moves after the kill');
 const d=board(17,16),dar=findUnit(d,'dario'),cap=findUnit(d,'g1');findUnit(d,'gcap').mov=0;dar.x=8;dar.y=3;cap.x=8;cap.y=4;cap.hp=999;cap.maxHP=999;dar.maxHP=dar.hp=999;dar.riposte=true;for(const u of d.units.filter(u=>u.team==='ally'&&u!==dar))u.x=17,u.y=0;
 d.log=[];enemyPhase(d);assert.ok(d.log.filter(l=>/반격 · 다리오/.test(l)).length>=2,d.log.join('\n'));
 const n=board(),ines=findUnit(n,'ines'),eric=findUnit(n,'eric');delete ines.benched;ines.x=8;ines.y=7;eric.x=8;eric.y=9;assert.equal(sanctuaryCut(n,eric),1);ines.classTier=1;assert.equal(sanctuaryCut(n,eric),0);
});
