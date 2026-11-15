// v0.10.2 — M28 The Truth of the Ashen Night: inside the king's last memory. Three fragments, read in any order, tell the night
// (the forced oaths, the king alone, the order he signed and Bellard wrote, Aren carrying it); reading one releases the
// remnants beside it; struck-down remnants stand again at their post three turns later; young Aren fights in the memory as
// an orderable ally; after the third fragment two enemy phases end the night. Erik falling loses; the memory closes after
// TURN 14. Then Aren's confession (to all / to Erik alone) and Aren's last order 「끝까지 함께」 (once a battle from M28).
import test from 'node:test';import assert from 'node:assert/strict';
import {MISSIONS} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {newGame,startBattle,beginEnemyPhase,advanceEnemy,performAction,canOrderAlly,canLastOrder,useLastOrder,lastOrderTarget} from '../src/core/game.js';
import {findUnit,alive,distance} from '../src/core/rules.js';
import {M28,chooseConfession28,CONFESSION28} from '../src/core/mission-rules-v0102.js';
import {lastOrderOpen} from '../src/core/command.js';
import {supplementalRewards} from '../src/core/battle-rewards.js';
import {rewardFor} from '../src/core/economy.js';
import {FEATS} from '../src/data/arms-v081.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';
const camp=(extra={})=>({heroes:null,results:[],clears:27,completed:[...Array(27).keys()].map(i=>i+1),flags:{act1_completed:true,act2_completed:true,act3_completed:true,mission_14_betrayer:'iron',mission_13_baldrick:'held',mission_26_baldrick:'withdraw'},
 choices:{act3_choice:'council'},factionTrust:{iron:2,free:3,flame:1},factionsMet:['iron','free','flame'],roster:['thea','dario','ines'],...extra});
const battle=extra=>{const s=newGame(100,camp(extra),28);s.screen='deployment';startBattle(s);drain(s);return s;};
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
const sturdy=s=>{for(const u of s.units.filter(u=>u.team==='ally'))u.hp=u.maxHP=999;};
const read=(s,id,hero='lia')=>{const m=findUnit(s,id),h=findUnit(s,hero);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=m.x+dx,y=m.y+dy;if(MISSIONS[28].map[y]?.[x]==='k'&&!s.units.some(o=>alive(o)&&o.x===x&&o.y===y)){h.x=x;h.y=y;h.moved=h.acted=false;break;}}return performAction(s,hero,'search',id);};

test('M28 data: 18×14 palace, level 20, sortie of eight, TURN 14; ten remnants, three fragments, young Aren; scenes tell the night',()=>{
 const m=MISSIONS[28];assert.deepEqual([m.width,m.height],[18,14]);assert.equal(m.level,20);assert.equal(m.deployLimit,8);assert.equal(m.turnLimit,14);assert.equal(m.reformTurns,3);assert.equal(m.dawnHold,2);
 assert.equal(m.enemies.filter(e=>e.remnant).length,10);assert.deepEqual(m.objects.map(o=>o.memory),['oath','king','order']);
 for(const k of ['28:intro','28:echo','28:memory:oath','28:memory:king','28:memory:order','28:dawn','28:end','pre:28','after:28','after:28:all','after:28:eric','npc:28:preparation:aren','npc:28:aftermath:elder'])assert.ok(STORY[k]?.length,k);
 const night=['28:memory:oath','28:memory:king','28:memory:order'].flatMap(k=>STORY[k].map(l=>l.text)).join(' ');
 for(const fact of ['강요된 맹세','내 기억으로 붙든다','서명하마','알고 있다. 그래도 전하라'])assert.ok(night.includes(fact),fact);
 const s=battle(),a=findUnit(s,'aren');assert.equal(a.team,'allied');assert.ok(canOrderAlly(s,a),'young Aren takes orders');assert.ok(a.memory28);
});
test('a struck-down remnant stands again at its post three turns later; reading a fragment releases the remnants beside it for good',()=>{
 const s=battle();sturdy(s);const r9=findUnit(s,'r9');r9.hp=0;M28.afterDamage(s,r9);assert.equal(r9.reformAt,s.turn+3);deserialize(serialize(s));
 enemyPhase(s);enemyPhase(s);assert.ok(!alive(r9));enemyPhase(s);assert.ok(alive(r9),'it stands again');assert.equal(r9.hp,r9.maxHP);assert.deepEqual([r9.x,r9.y],[6,6]);
 const near=s.units.filter(u=>u.remnant&&alive(u)&&distance(u,findUnit(s,'mem1'))<=3).map(u=>u.id);assert.ok(near.length>=1);
 assert.ok(read(s,'mem1').ok);assert.deepEqual(s.missionState.found,['oath']);for(const id of near){const u=findUnit(s,id);assert.ok(!alive(u)&&u.released,id);}
 enemyPhase(s);enemyPhase(s);enemyPhase(s);enemyPhase(s);for(const id of near)assert.ok(!alive(findUnit(s,id)),'released remnants do not return');
});
test('three fragments in any order, then two enemy phases end the night (victory); Erik falling loses; the memory closes after TURN 14',()=>{
 const s=battle();sturdy(s);assert.ok(read(s,'mem3').ok);assert.ok(read(s,'mem2','kai').ok);enemyPhase(s);assert.ok(read(s,'mem1').ok);const t=s.turn;assert.equal(s.missionState.dawnFrom,t);
 enemyPhase(s);assert.ok(!s.outcome);enemyPhase(s);assert.equal(s.outcome,'victory');assert.equal(s.turn,t+2);assert.equal(s.campaign.flags.mission_28_found,'order,king,oath');assert.equal(s.campaign.flags.mission_28_aren_stood,true);
 const d=battle();findUnit(d,'eric').hp=0;enemyPhase(d);assert.equal(d.outcome,'defeat');assert.match(d.reason,/에릭/);
 const c=battle();while(!c.outcome&&c.turn<20){sturdy(c);enemyPhase(c);}assert.equal(c.outcome,'defeat');assert.match(c.reason,/TURN 14/);
});
test('Aren\'s confession after the win (to all / to Erik alone), once; rewards and the hidden objective',()=>{
 assert.deepEqual(Object.keys(CONFESSION28),['all','eric']);
 const s=battle();sturdy(s);assert.ok(!chooseConfession28(s,'all'),'not before the win');for(const id of ['mem1','mem2','mem3']){read(s,id);enemyPhase(s);}while(!s.outcome)enemyPhase(s);assert.equal(s.outcome,'victory');
 assert.ok(chooseConfession28(s,'eric'));assert.ok(!chooseConfession28(s,'all'),'once');assert.equal(s.campaign.choices.m28_confession,'eric');assert.equal(s.campaign.flags.mission_28_confession,'eric');deserialize(serialize(s));
 assert.equal(rewardFor(28),640);assert.equal(supplementalRewards(28,{arenStood28:true}).length,3);assert.equal(supplementalRewards(28,{arenStood28:false}).length,2);
 assert.equal(FEATS[28].reward,'nightLocket');assert.ok(FEATS[28].test({turn:8},{mission_28_aren_stood:true}));assert.ok(!FEATS[28].test({turn:9},{mission_28_aren_stood:true}));assert.ok(!FEATS[28].test({turn:7},{mission_28_aren_stood:false}));
});
test('「끝까지 함께」: from M28, once a battle, a fallen hero stands with 1 HP at the next player phase; never in practice or before M28',()=>{
 const s=battle(),k=findUnit(s,'kai'),e=findUnit(s,'eric');assert.ok(lastOrderOpen(s));assert.ok(!canLastOrder(s,e),'nobody has fallen');
 k.hp=0;assert.equal(lastOrderTarget(s).id,'kai');assert.ok(canLastOrder(s,e));assert.ok(useLastOrder(s,'eric'));assert.deepEqual(s.lastOrder,{hero:'kai',turn:1,risen:false});assert.ok(!canLastOrder(s,e),'once a battle');deserialize(serialize(s));
 enemyPhase(s);assert.equal(k.hp,1);assert.equal(s.lastOrder.risen,true);deserialize(serialize(s));
 const bad=structuredClone(s);bad.lastOrder={hero:'nobody',turn:1,risen:true};assert.throws(()=>serialize(bad));
 assert.ok(!lastOrderOpen({missionId:27,campaign:{}}),'not before M28');assert.ok(!lastOrderOpen({missionId:28,practice:true}),'never in practice');assert.ok(!lastOrderOpen({missionId:110}),'never in skirmishes');
});
