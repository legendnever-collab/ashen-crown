// v0.10.0 — Ines's and Thea's awakening (D-099 Q4): Tier 3 after M23 / M24 at Lv 14, tier 2 and a won trial (115 / 116),
// and their ④ skills once a battle: 성역의 문 (allies, people and allied units within 3 take half until the next player turn;
// statuses cleared) and 철의 돌파 (a straight run of 2–4 tiles through foes, no counter, then 3 more tiles of movement).
import test from 'node:test';import assert from 'node:assert/strict';
import {newGame,startBattle,beginEnemyPhase,advanceEnemy,performAction,moveUnit,canMove} from '../src/core/game.js';
import {findUnit,strikeStats} from '../src/core/rules.js';
import {promotionStatus} from '../src/core/progression.js';
import {startSkirmish,trialMissionOf} from '../src/core/skirmish.js';
import {MISSION_RULES} from '../src/core/mission-rules.js';
import {CLASS_TREE} from '../src/data/classes.js';
import {skillsOf} from '../src/data/skills.js';
import {validTacticTarget,ironPath,ironFoes} from '../src/core/tactics.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';
const all=n=>[...Array(n).keys()].map(i=>i+1);
function camp(done,level=14){const s=newGame(91,{heroes:null,results:[],clears:done,completed:all(done),flags:{act1_completed:true,act2_completed:true,act3_completed:true,mission_14_betrayer:'iron'},choices:{m06_oath:'comrades'},roster:['thea','dario','ines'],factionTrust:{iron:1,free:2,flame:2}},Math.min(24,done+1));
 s.campaign.heroes??=s.units.filter(u=>u.team==='ally').map(u=>{const {x,y,moved,acted,benched,...r}=structuredClone(u);return r;});for(const h of s.campaign.heroes){h.level=level;h.classTier=2;}return s;}
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
// M23's open camp, every foe down but k1 and k2, the heroes parked on the bottom row; Ines and Thea awakened.
const board=()=>{const c=camp(22);const s=newGame(5,c.campaign,23);s.screen='deployment';startBattle(s);drain(s);for(const u of s.units.filter(u=>u.team==='enemy'))if(!['k1','k2'].includes(u.id))u.hp=0;
 s.units.filter(u=>u.team==='ally').forEach((u,i)=>{u.x=2+i;u.y=13;u.classTier=['ines','thea'].includes(u.id)?3:u.classTier;u.maxMP=u.mp=50;});
 for(const id of ['ines','thea'])if(findUnit(s,id).benched){const out=s.units.find(u=>u.team==='ally'&&!u.benched&&!['ines','thea','eric'].includes(u.id));findUnit(s,id).benched=false;out.benched=true;}return s;};

test('Ines awakens after M23, Thea after M24 (Lv 14, tier 2); trials 115 and 116 run under the skirmish rules; Tier 3 keys',()=>{
 assert.ok(!promotionStatus(camp(22),'ines').eligible,'Ines waits for M23');assert.ok(promotionStatus(camp(23),'ines').eligible);assert.equal(trialMissionOf(camp(23),'ines'),115);
 assert.ok(!promotionStatus(camp(23),'thea').eligible,'Thea waits for M24');assert.ok(promotionStatus(camp(24),'thea').eligible);assert.equal(trialMissionOf(camp(24),'thea'),116);
 assert.ok(!promotionStatus(camp(23,13),'ines').eligible,'below Lv 14');assert.ok(MISSION_RULES[115]&&MISSION_RULES[116],'the trials have their rules');
 assert.deepEqual(CLASS_TREE.ines.find(k=>k.tier===3).ultimate,'sanctumGate');assert.deepEqual(CLASS_TREE.thea.find(k=>k.tier===3).ultimate,'ironBreak');
 for(const [id,done,m] of [['ines',23,115],['thea',24,116]]){const s=startSkirmish(camp(done),'trial',id,{force:true});assert.equal(s.missionId,m);const h=findUnit(s,id);assert.equal(h.classTier,3);assert.ok(skillsOf(h).find(k=>k.slot===4)?.open,id);
  for(const u of s.units.filter(u=>u.team==='enemy'))u.hp=0;enemyPhase(s);assert.equal(s.outcome,'victory',s.reason);assert.equal(s.campaign.promotions[id].tier,3);}
});
test('④ 성역의 문: everyone of the legion\'s side within 3 takes half until the next player turn and is cured; once a battle',()=>{
 const s=board(),ines=findUnit(s,'ines'),lia=findUnit(s,'lia'),k=findUnit(s,'k1'),far=findUnit(s,'kai');ines.x=8;ines.y=7;lia.x=8;lia.y=8;k.x=8;k.y=9;k.mov=0;k.atk=lia.def+60;far.x=15;far.y=12;
 lia.status={poison:2};far.status={poison:2};lia.hp=lia.maxHP=999;const plain=strikeStats(s,k,lia).damage;
 const r=performAction(s,'ines','sanctumGate','ines');assert.ok(r.ok,r.error);assert.deepEqual(s.ultimates,['ines']);assert.equal(lia.gateGuard,s.turn);assert.ok(!lia.status?.poison,'cured');assert.ok(far.status?.poison,'out of reach');
 const back=deserialize(serialize(s));assert.equal(findUnit(back,'lia').gateGuard,lia.gateGuard);
 const before=lia.hp;enemyPhase(s);const took=before-lia.hp;assert.ok(took>0&&took<=Math.ceil(plain*1.5/2)+1&&took<plain,`Lia took ${took} of ${plain}`);
 ines.acted=false;ines.moved=false;assert.ok(!performAction(s,'ines','sanctumGate','ines').ok,'once a battle');
});
test('④ 철의 돌파: a straight run through foes (no counter), standing on the far tile with three more tiles to move; walls and taken tiles refuse it; once a battle',()=>{
 const s=board(),t=findUnit(s,'thea'),a=findUnit(s,'k1'),b=findUnit(s,'k2');t.x=2;t.y=8;a.x=3;a.y=8;b.x=4;b.y=8;a.mov=b.mov=0;
 assert.ok(validTacticTarget(s,t,{x:6,y:8},'ironBreak'));assert.deepEqual(ironFoes(s,t,{x:6,y:8}).map(u=>u.id).sort(),['k1','k2']);assert.ok(!validTacticTarget(s,t,{x:3,y:9},'ironBreak'),'not straight');assert.ok(!validTacticTarget(s,t,{x:3,y:8},'ironBreak'),'the end tile must be open');
 assert.ok(!ironPath(s,t,{x:7,y:8}),'more than four tiles');
 const hp=t.hp,ha=a.hp,hb=b.hp;const r=performAction(s,'thea','ironBreak',{x:6,y:8});assert.ok(r.ok,r.error);assert.deepEqual([t.x,t.y],[6,8]);assert.ok(a.hp<ha&&b.hp<hb,'both struck');assert.equal(t.hp,hp,'no counter');
 assert.ok(canMove(s,t),'three more tiles');assert.equal(t.moveLeft,3);assert.ok(moveUnit(s,'thea',6,11));assert.ok(!canMove(s,t));
 const back=deserialize(serialize(s));assert.deepEqual(back.ultimates,['thea']);
 t.acted=false;t.moved=false;b.x=7;b.y=11;assert.ok(!performAction(s,'thea','ironBreak',{x:8,y:11}).ok,'once a battle');
});
