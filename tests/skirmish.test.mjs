// v0.5.0 Phase E: promotion trials and Legion Drill (D-047) — start conditions, commit, return to camp.
import test from 'node:test';import assert from 'node:assert/strict';
import {MISSIONS,LAST_MISSION} from '../src/data/missions.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {findUnit} from '../src/core/rules.js';
import {canStartSkirmish,startSkirmish,returnToCamp,trialState,TRIAL_MISSION,DRILL_MISSION} from '../src/core/skirmish.js';
import {classTierOf} from '../src/core/progression.js';
import {actOneCamp,playSkirmish} from './skirmish-policy.mjs';
import {newGame,checkOutcome} from '../src/core/game.js';

const ready={kai_rescue:4,kai_bypass:2,m6_kai_lever:1};

test('skirmishes are outside the campaign: LAST_MISSION is the last story mission (8 in v0.6 Phase D), ids 101–105 and 110 are flagged',()=>{
 assert.equal(LAST_MISSION,8);for(const id of [101,102,103,104,105,110])assert.ok(MISSIONS[id].skirmish,id);
 assert.deepEqual(Object.values(TRIAL_MISSION),[101,102,103,104,105]);assert.equal(DRILL_MISSION,110);
});

test('the rite opens only in the ACT I camp after the Ashen Oath; trials need the promotion conditions',()=>{
 const m1=newGame(1);assert.equal(canStartSkirmish(m1),false);
 const camp=actOneCamp(1,6,ready);assert.ok(canStartSkirmish(camp));
 const noOath=actOneCamp(1,6,ready);delete noOath.campaign.choices.m06_oath;assert.equal(canStartSkirmish(noOath),false);
 assert.equal(trialState(camp,'kai').available,true);assert.equal(trialState(camp,'eric').available,false,'potential 0/3');
 assert.equal(startSkirmish(camp,'trial','eric'),null);const low=actOneCamp(1,5,ready);assert.equal(startSkirmish(low,'trial','kai'),null,'Lv 5');
});

test('a trial battle: hero provisionally promoted, others in reserve, not practice, saves round-trip',()=>{
 const camp=actOneCamp(2,6,ready),s=startSkirmish(camp,'trial','kai');assert.ok(s);
 assert.equal(s.missionId,105);assert.equal(s.practice,false);assert.equal(s.screen,'battle');assert.equal(findUnit(s,'kai').classTier,2);
 assert.deepEqual(s.units.filter(u=>u.team==='ally'&&u.benched).map(u=>u.id).sort(),['elina','eric','lia','sain']);
 const again=deserialize(serialize(s));assert.equal(again.skirmish.kind,'trial');assert.equal(again.skirmish.returnMission,6);
});

test('winning a trial promotes for good without touching completed missions or gold',()=>{
 const camp=actOneCamp(3,6,ready),gold=camp.campaign.economy.gold,s=startSkirmish(camp,'trial','kai');assert.equal(playSkirmish(s).outcome,'victory');
 const back=returnToCamp(s);assert.equal(back.missionId,6);assert.equal(back.screen,'exploration');assert.equal(back.practice,false);assert.equal(back.frontier.phase,'aftermath');
 const kai=back.campaign.heroes.find(h=>h.id==='kai');assert.equal(classTierOf(kai),2);assert.equal(back.campaign.promotions.kai.key,'shadowblade');assert.equal(findUnit(back,'kai').classTier,2);
 assert.deepEqual(back.campaign.completed,[1,2,3,4,5]);assert.equal(back.campaign.economy.gold,gold);assert.ok(JSON.stringify(back.narrative).includes('promo:kai'),'promotion scene queued');
 assert.equal(trialState(back,'kai').promoted,true);assert.equal(deserialize(serialize(back)).campaign.promotions.kai.tier,2);
});

test('losing a trial changes nothing: the pre-battle campaign comes back',()=>{
 const camp=actOneCamp(4,6,ready),before=JSON.stringify(camp.campaign.heroes),s=startSkirmish(camp,'trial','kai');findUnit(s,'kai').hp=0;s.campaign.tacticalMemory.kai_skill=9;
 checkOutcome(s);assert.equal(s.outcome,'defeat');
 const back=returnToCamp(s);assert.equal(JSON.stringify(back.campaign.heroes),before);assert.equal(back.campaign.tacticalMemory.kai_skill,undefined);assert.equal(classTierOf(back.campaign.heroes.find(h=>h.id==='kai')),1);
});

test('Legion Drill: five heroes, permanent EXP and memory, counted; repeatable',()=>{
 let camp=actOneCamp(5,4);const lv=camp.campaign.heroes.map(h=>h.level);
 for(let i=0;i<2;i++){const s=startSkirmish(camp,'drill');assert.equal(s.missionId,110);assert.equal(s.units.filter(u=>u.team==='ally'&&!u.benched).length,5);assert.equal(playSkirmish(s).outcome,'victory');camp=returnToCamp(s);}
 assert.equal(camp.campaign.skirmishes.drills,2);assert.ok(camp.campaign.heroes.some((h,i)=>h.level>lv[i]),'growth kept');assert.ok(Object.keys(camp.campaign.tacticalMemory).length>0,'memory kept');
});
