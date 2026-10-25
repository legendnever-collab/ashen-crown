import test from 'node:test';import assert from 'node:assert/strict';
import {newGame,startBattle,performAction,beginEnemyPhase,advanceEnemy,checkOutcome,nextMission,planEnemy,moveUnit} from '../src/core/game.js';
import {findUnit,alive,validTarget,distance,movement} from '../src/core/rules.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {MISSIONS,LAST_MISSION} from '../src/data/missions.js';import {ACT1_FINALE} from '../src/core/progression.js';
import {STORY} from '../src/data/story.js';
import {rulesOf} from '../src/core/mission-rules.js';
import {supplementalRewards,knownRewards} from '../src/core/battle-rewards.js';
import {effectiveStats} from '../src/core/economy.js';
import {enterHub} from '../src/core/frontier.js';
import {drain} from './campaign-policy.mjs';
import {introStory} from '../src/core/narrative.js';

const campaign=(choices={})=>({heroes:null,results:[],clears:5,completed:[1,2,3,4,5],flags:{},choices});
const battle=(choices={m04_records_choice:'kept'})=>{const s=newGame(6006,campaign(choices),6);s.screen='deployment';startBattle(s);introStory(s);drain(s);return s;};
const place=(s,id,x,y)=>{const u=findUnit(s,id);u.x=x;u.y=y;return u;};
const park=(s,ids,y=15)=>ids.forEach((id,i)=>place(s,id,1+i*3,y));
const endTurn=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
const quiet=s=>{for(const u of s.units)if(u.team==='enemy'&&u.id!=='boss')u.hp=0;};

test('M06 data: 18×16 border gate, presets in the deployment zone, four refugees (two injured), locked seal stones, M05 → M06, last mission',()=>{
 const m=MISSIONS[6];assert.deepEqual([m.width,m.height],[18,16]);assert.ok(m.map.every(r=>r.length===18));assert.equal(ACT1_FINALE,6);assert.ok(LAST_MISSION>=6);
 const s=newGame(6006,campaign(),6),zone=m.deployZone(s);for(const preset of Object.values(m.deployments))for(const [x,y]of preset)assert.ok(zone.has(`${x},${y}`),`${x},${y}`);
 const refugees=s.units.filter(u=>u.team==='civilian');assert.equal(refugees.length,4);assert.equal(refugees.filter(r=>r.hp<=r.maxHP/2).length,2);
 assert.ok(s.units.filter(u=>u.kind==='sealstone').every(o=>o.locked&&o.progress===0));
 const m5=newGame(5005,{...campaign(),completed:[1,2,3,4],clears:4},5);m5.outcome='victory';m5.campaign.completed.push(5);assert.equal(nextMission(m5).missionId,6);
 for(const k of ['pre:6','pre:6:order:kept','pre:6:order:reported','6:intro','6:phase2','6:phase3','6:banner','6:beacon','6:unseal','6:encounter','6:end','6:oath','6:oath:people','6:oath:comrades','6:oath:truth','6:oath:bond:erik_kai','act1:complete','after:6','npc:6:preparation:aren','npc:6:preparation:kai'])assert.ok(STORY[k]?.length,k);
});
test('M06 escort: an escorted refugee walks two tiles toward the gate; an injured one waits for Sain, who can heal refugees here; no instant rescue',()=>{
 const s=battle();quiet(s);park(s,['eric','elina','lia','sain','kai']);
 const p1=findUnit(s,'p1'),p2=findUnit(s,'p2'),y1=p1.y,y2=p2.y;place(s,'eric',p1.x+1,p1.y);place(s,'kai',p2.x+1,p2.y);
 assert.equal(validTarget(s,findUnit(s,'eric'),p1,'rescue'),false);
 endTurn(s);assert.equal(p1.y,y1-2);assert.equal(p2.y,y2,'injured refugee stays');
 const sain=place(s,'sain',p2.x-1,p2.y);assert.ok(validTarget(s,sain,p2,'skill'));assert.ok(performAction(s,'sain','skill','p2').ok);assert.ok(p2.hp>p2.maxHP/2);
 endTurn(s);assert.ok(p2.y<y2,'healed and escorted refugee moves');
});
test('M06 phase 2 opens at TURN 5; Lia unseals a stone in one action, others need two; the lever opens the side gate',()=>{
 const s=battle();quiet(s);park(s,['eric','elina','lia','sain','kai']);
 const stone=findUnit(s,'seal1'),lia=place(s,'lia',8,4);assert.equal(validTarget(s,lia,stone,'search'),false,'locked in phase 1');
 s.turn=4;endTurn(s);assert.equal(s.missionState.phase,2);assert.ok(!stone.locked);assert.ok(s.narrative.events.includes('6:phase2'));
 place(s,'lia',8,4);assert.ok(performAction(s,'lia','search','seal1').ok);assert.ok(stone.rescued);
 const two=findUnit(s,'seal2');place(s,'elina',9,4);place(s,'eric',11,4);assert.ok(performAction(s,'elina','search','seal2').ok);assert.equal(two.progress,1);assert.ok(!two.rescued);
 assert.ok(performAction(s,'eric','search','seal2').ok);assert.ok(two.rescued);assert.equal(s.missionState.phase,3);
 const t=battle();quiet(t);park(t,['eric','elina','lia','sain','kai']);place(t,'kai',2,8);assert.ok(performAction(t,'kai','search','lever').ok);assert.ok(t.missionState.lever&&findUnit(t,'sidegate').rescued);
 const p3=findUnit(t,'p3'),y=p3.y;endTurn(t);assert.equal(p3.y,y-1,'unescorted refugee uses the bypass');
});
test('M06 phase 3: Oath Banner gives MOV +1 near Erik, the executor moves, the garrison arrives only while the beacon burns',()=>{
 const run=beacon=>{const s=battle();for(const u of s.units)if(u.team==='enemy'&&!['boss','beacon'].includes(u.id))u.hp=0;if(!beacon)findUnit(s,'beacon').hp=0,rulesOf(s).afterDamage(s,findUnit(s,'beacon'));
  park(s,['eric','elina','lia','sain','kai']);s.missionState.phase=2;for(const o of s.units.filter(u=>u.kind==='sealstone'))o.locked=false;findUnit(s,'seal1').rescued=true;
  place(s,'lia',11,4);place(s,'eric',12,5);place(s,'kai',13,6);const kai=findUnit(s,'kai'),before=effectiveStats(s,kai).mov;
  assert.ok(performAction(s,'lia','search','seal2').ok);assert.equal(s.missionState.phase,3);assert.equal(effectiveStats(s,kai).mov,before+1);assert.equal(findUnit(s,'boss').mov,3);return s;};
 const lit=run(true);assert.ok(lit.units.some(u=>u.id==='g1'&&alive(u)));const dark=run(false);assert.ok(!dark.units.some(u=>u.id==='g1'));assert.ok(dark.narrative.events.includes('6:beacon'));
});
test('M06 outcomes: victory needs phase 3 and one refugee through; the gate seals after TURN 11; losing every refugee is defeat',()=>{
 const s=battle();quiet(s);park(s,['eric','elina','lia','sain','kai'],1);s.missionState.phase=3;for(const o of s.units.filter(u=>u.kind==='sealstone'))o.rescued=true;
 assert.equal(checkOutcome(s),null,'nobody through yet');const p=findUnit(s,'p1');p.y=1;p.rescued=true;assert.equal(checkOutcome(s),'victory');
 assert.equal(s.campaign.flags.mission_06_refugees_through,1);assert.ok(s.campaign.flags.act1_completed&&s.campaign.flags.legion_independent&&s.campaign.flags.mission_06_completed);
 const r=s.campaign.results.at(-1).rewards;assert.ok(r.extras.some(x=>x.id==='v040:m6:supply-hp'));
 const sealed=battle();quiet(sealed);sealed.turn=11;endTurn(sealed);assert.equal(sealed.outcome,'defeat');assert.match(sealed.reason,/봉인/);
 const lost=battle();for(const c of lost.units.filter(u=>u.team==='civilian'))c.hp=0;assert.equal(checkOutcome(lost),'defeat');
});
test('M06 records choice: a reported ledger brings the inspector and the matching briefing line',()=>{
 const rep=battle({m04_records_choice:'reported'});assert.ok(rep.units.some(u=>u.id==='i1'));assert.ok(rep.narrative.events.includes('6:intro:reported'));
 const kept=battle({m04_records_choice:'kept'});assert.ok(!kept.units.some(u=>u.id==='i1'));assert.ok(kept.narrative.events.includes('6:intro:kept'));
 const camp=newGame(6006,campaign({m04_records_choice:'reported'}),6);enterHub(camp);assert.ok(camp.narrative.events.includes('pre:6:order:reported'));
});
test('M06 AI: seal guards stay by their stone, the beacon never moves, pursuers chase refugees',()=>{
 const s=battle();for(const id of ['k1','k2','k3','k4']){const p=planEnemy(s,findUnit(s,id)),stone=findUnit(s,id<'k3'?'seal1':'seal2');assert.ok(distance(p,stone)<=2,id);}
 const b=findUnit(s,'beacon'),bp=planEnemy(s,b);assert.deepEqual([bp.x,bp.y],[b.x,b.y]);
 s.turn=4;endTurn(s);const r1=findUnit(s,'r1');assert.ok(r1&&alive(r1));assert.match(planEnemy(s,r1).reason,/피난민/);
});
test('M06 rewards and saves: stable ledger ids, optional boots/gold, mid-battle round trip',()=>{
 assert.deepEqual(supplementalRewards(6,{}).map(r=>r.id),['v040:m6:supply-hp','v040:m6:supply-mp']);
 assert.deepEqual(supplementalRewards(6,{refugees:4,beacon:true}).map(r=>r.id).slice(2),['v040:m6:all-refugees','v040:m6:beacon']);assert.ok(knownRewards().some(r=>r.id==='v040:m6:all-refugees'&&r.type==='trailBoots'));
 const s=battle({m04_records_choice:'reported'});endTurn(s);const back=deserialize(serialize(s));assert.equal(back.missionId,6);assert.deepEqual(back.missionState,s.missionState);
});
