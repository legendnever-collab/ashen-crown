// v0.9.3 — M21 The Last King: the king on the throne dais (cannot move, cannot be rescued), four anchor stones (Erik, Thea,
// Dario and Ines at one blow, the others in two; each broken stone gives the king 10 HP), the ward pulse (outer ring on odd
// turns, inner ring on even turns; MP −3 for a hero ending the player phase there), Erik's duel at TURN 2, victory by
// stones or by holding to the end of TURN 12, defeat when the king falls, the king's request, Aren's awakening, the feat.
import test from 'node:test';import assert from 'node:assert/strict';
import {MISSIONS} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {newGame,startBattle,beginEnemyPhase,advanceEnemy,performAction,canTogether,useTogether,moveUnit} from '../src/core/game.js';
import {findUnit,alive,validTarget,distance} from '../src/core/rules.js';
import {chooseKing21,KING21,pulseCells21,pulseRing21,HEAVY21} from '../src/core/mission-rules-v093.js';
import {togetherOpen} from '../src/core/command.js';
import {supplementalRewards} from '../src/core/battle-rewards.js';
import {FEATS} from '../src/data/arms-v081.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';
const camp21=(extra={})=>({heroes:null,results:[],clears:20,completed:[...Array(20).keys()].map(i=>i+1),flags:{act1_completed:true,act2_completed:true,mission_14_betrayer:'iron',mission_13_baldrick:'halted'},choices:{m15_records:'keep',m16_stones:'leave',m17_oath:'take',m18_truth:'tell',m19_teacher:'take',m20_superior:'trial',m20_plan:'keep'},factionTrust:{iron:-1,free:3,flame:3},roster:['thea','dario','ines'],...extra});
const battle=(extra)=>{const s=newGame(91,camp21(extra),21);s.screen='deployment';startBattle(s);drain(s);if(s.duel&&!s.duel.result)s.duel.result='skipped';return s;};
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);if(s.duel&&!s.duel.result)s.duel.result='skipped';};
const quiet=(s,...keep)=>{for(const u of s.units.filter(u=>u.team==='enemy'&&!keep.includes(u.id)))u.hp=0;s.units.filter(u=>u.team==='ally').forEach((u,i)=>{u.x=3+i;u.y=12;u.maxHP=u.hp=999;u.def=u.res=99;});};
const place=(u,x,y)=>{u.x=x;u.y=y;u.moved=false;u.acted=false;};

test('M21 data: 18×14 crown\'s heart, level 17, sortie of seven, the king on the dais, four anchor stones, TURN 12; scenes',()=>{
 const m=MISSIONS[21];assert.deepEqual([m.width,m.height],[18,14]);assert.equal(m.level,17);assert.equal(m.deployLimit,7);assert.equal(m.turnLimit,12);
 const king=m.civilians.find(c=>c.id==='king');assert.equal(m.map[king.y][king.x],'z');assert.equal(m.objects.filter(o=>o.kind==='anchorStone').length,4);
 assert.deepEqual(m.pulseOuter,[5,6]);assert.deepEqual(m.pulseInner,[2,3]);assert.equal(m.pulseMP,3);assert.equal(m.duelTurn,2);
 for(const k of ['21:intro','21:duel','21:duel:hero','21:duel:foe','21:pulse','21:pulse:inner','21:crack','21:anchor','21:anchor2','21:anchor3','21:anchor4','21:king:low','21:commander','21:reinforce','21:end','pre:21','after:21','after:21:notyet','after:21:promise','after:21:aren','npc:21:preparation:aren','npc:21:aftermath:advisor'])assert.ok(STORY[k]?.length,k);
});
test('the king cannot be rescued or moved; Erik is challenged on TURN 2',()=>{
 const s=battle(),king=findUnit(s,'king'),e=findUnit(s,'eric');assert.ok(king.noRescue);place(e,8,6);assert.ok(!validTarget(s,e,king,'rescue'));
 quiet(s,'rc');s.duel=null;s.missionState.duelDone=false;enemyPhase(s);assert.equal(s.turn,2);assert.equal(s.duel?.foe,'rc');assert.equal(s.duel.hero,'eric');
 assert.equal(king.x,8);assert.equal(king.y,5);
});
test('anchor stones: Erik breaks one at one blow and the king gets 10 HP; Elina needs two',()=>{
 const s=battle();quiet(s);const st=s.missionState,king=findUnit(s,'king'),e=findUnit(s,'eric'),el=findUnit(s,'elina');king.hp=100;
 assert.ok(HEAVY21.includes('eric')&&!HEAVY21.includes('elina'));place(e,3,2);const r=performAction(s,'eric','search','as1');assert.ok(r.ok,r.error);
 assert.deepEqual(st.broken,['as1']);assert.equal(king.hp,110);assert.ok(findUnit(s,'as1').inert);
 place(el,14,2);assert.ok(performAction(s,'elina','search','as2').ok);assert.deepEqual(st.broken,['as1']);assert.equal(st.progress.as2,1);assert.ok(findUnit(s,'as2').cracked);
 el.acted=false;assert.ok(performAction(s,'elina','search','as2').ok);assert.deepEqual(st.broken,['as1','as2']);assert.equal(king.hp,120);
 assert.ok(!validTarget(s,el,findUnit(s,'as2'),'search'),'a broken stone cannot be searched again');
});
test('the ward pulse: the outer ring on odd turns, the inner on even turns; ending the player phase there costs 3 MP',()=>{
 const s=battle();quiet(s);const king=findUnit(s,'king'),lia=findUnit(s,'lia'),sain=findUnit(s,'sain');assert.equal(pulseRing21(s),'outer');
 const outer=pulseCells21(s);assert.ok(outer.length>20);assert.ok(outer.every(c=>{const d=distance(c,king);return d>=5&&d<=6;}));
 const c=outer[0];place(lia,c.x,c.y);lia.mp=10;place(sain,8,8);sain.mp=10;enemyPhase(s);assert.equal(lia.mp,7,'on the ring');assert.equal(sain.mp,10,'off the ring (distance 3, the inner ring pulses on even turns)');
 assert.equal(pulseRing21(s),'inner');assert.ok(pulseCells21(s).every(c=>{const d=distance(c,king);return d>=2&&d<=3;}));
 sain.mp=10;enemyPhase(s);assert.equal(sain.mp,7,'the inner ring pulses on TURN 2');
});
test('rite knights go for the king; the king falling is a defeat',()=>{
 const s=battle();quiet(s,'k1');const king=findUnit(s,'king'),k=findUnit(s,'k1');k.hp=k.maxHP;place(k,8,3);king.hp=1;enemyPhase(s);
 assert.equal(s.outcome,'defeat');assert.match(s.reason,/국왕/);
});
test('victory by the four stones, or by holding the king to the end of TURN 12',()=>{
 const s=battle();quiet(s);const st=s.missionState,e=findUnit(s,'eric');for(const [id,x,y] of [['as1',3,2],['as2',14,2],['as3',3,9],['as4',14,9]]){place(e,x,y);assert.ok(performAction(s,'eric','search',id).ok,id);if(s.outcome)break;}
 assert.equal(s.outcome,'victory');assert.deepEqual(st.broken.length,4);
 const t=battle();quiet(t);while(!t.outcome&&t.turn<20){for(const u of t.units.filter(u=>u.team==='enemy'))u.hp=0;enemyPhase(t);}assert.equal(t.outcome,'victory');assert.match(t.reason,/TURN 12까지/);assert.equal(t.turn,13);
});
test('after M21: Aren awakens (「함께 정한다」 from then on), the king\'s request is fixed once chosen; reward, feat, save',()=>{
 const s=battle();quiet(s);const e=findUnit(s,'eric');for(const [id,x,y] of [['as1',3,2],['as2',14,2],['as3',3,9],['as4',14,9]]){place(e,x,y);performAction(s,'eric','search',id);}
 assert.equal(s.outcome,'victory');assert.equal(s.campaign.flags.aren_awakened,true);assert.equal(s.campaign.flags.mission_21_anchors,4);
 assert.ok(chooseKing21(s,'promise'));assert.ok(!chooseKing21(s,'notyet'));assert.equal(s.campaign.choices.m21_king,'promise');assert.deepEqual(Object.keys(KING21),['notyet','promise']);
 const p=newGame(91,{...camp21(),completed:[...camp21().completed]},21);p.practice=true;assert.ok(!chooseKing21(p,'notyet'));
 assert.deepEqual(supplementalRewards(21,{anchors21:4}).map(r=>r.type),['medium','ether','elixir']);assert.equal(FEATS[21].reward,'kingsSignet');
 assert.ok(FEATS[21].test(null,{mission_21_anchors:4,mission_21_king_half:true}));assert.ok(!FEATS[21].test(null,{mission_21_anchors:4,mission_21_king_half:false}));
 const b=battle();assert.deepEqual(deserialize(serialize(b)).missionState,b.missionState);
});
test('「함께 정한다」: only after Aren\'s awakening, once a battle, a hero who has acted moves and acts again',()=>{
 const before=battle();assert.ok(!togetherOpen(before),'not before M21 is won');
 const s=battle({flags:{...camp21().flags,aren_awakened:true}});quiet(s);assert.ok(togetherOpen(s));const e=findUnit(s,'eric');place(e,8,9);
 assert.ok(!canTogether(s,e),'not before acting');assert.ok(performAction(s,'eric','wait').ok);assert.ok(e.acted);assert.ok(canTogether(s,e));
 assert.ok(useTogether(s,'eric'));assert.ok(!e.acted&&!e.moved);assert.deepEqual(s.together,{hero:'eric',turn:s.turn});assert.ok(moveUnit(s,'eric',8,10));
 assert.ok(performAction(s,'eric','wait').ok);assert.ok(!canTogether(s,e),'once a battle');assert.ok(!useTogether(s,'eric'));
 assert.deepEqual(deserialize(serialize(s)).together,s.together);
 const p=battle({flags:{...camp21().flags,aren_awakened:true}});p.practice=true;assert.ok(!togetherOpen(p),'never in practice');
});
