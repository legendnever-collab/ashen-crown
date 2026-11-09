// v0.10.0 — M24 The Last Border: the ash tide covers a northern row a turn from TURN 2 (10% of max HP for whoever ends the
// player phase on it; the ash beasts are at home there; a hero is never felled by it); eight refugees walk two tiles a turn
// to the gate, around whoever stands in the way; the gate winch opens once six are inside and closing it wins (whoever is
// outside stays outside); it closes by itself at the end of TURN 10; three refugees down is a defeat.
import test from 'node:test';import assert from 'node:assert/strict';
import {MISSIONS} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {newGame,startBattle,beginEnemyPhase,advanceEnemy,performAction} from '../src/core/game.js';
import {findUnit,alive,validTarget} from '../src/core/rules.js';
import {M24,refugees24,ashRows24,gateOpen24,walkRefugees24} from '../src/core/mission-rules-v0100.js';
import {supplementalRewards} from '../src/core/battle-rewards.js';
import {FEATS} from '../src/data/arms-v081.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';
const camp23=(extra={})=>({heroes:null,results:[],clears:23,completed:[...Array(23).keys()].map(i=>i+1),flags:{act1_completed:true,act2_completed:true,act3_completed:true,mission_14_betrayer:'iron',aren_awakened:true},
 choices:{act3_choice:'council',m23_lead:'legion'},factionTrust:{iron:1,free:3,flame:2},factionsMet:['iron','free','flame'],roster:['thea','dario','ines'],...extra});
const battle=(extra={})=>{const s=newGame(100,camp23(extra),24);s.screen='deployment';startBattle(s);drain(s);return s;};
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
// Every enemy down, the heroes inside the wall out of the refugees' way.
const quiet=s=>{for(const u of s.units.filter(u=>u.team==='enemy'))u.hp=0;s.units.filter(u=>u.team==='ally').forEach((u,i)=>{u.x=2+i;u.y=12;u.maxHP=u.hp=999;u.def=u.res=99;});};
const turn=s=>{quiet(s);enemyPhase(s);};

test('M24 data: 18×14 border, a wall on row 8 with a two-tile gate, eight refugees outside, the winch inside, level 18, TURN 10; scenes',()=>{
 const m=MISSIONS[24];assert.deepEqual([m.width,m.height],[18,14]);assert.equal(m.level,18);assert.equal(m.deployLimit,7);assert.equal(m.turnLimit,10);
 assert.deepEqual(m.gate,[[8,8],[9,8]]);for(let x=0;x<18;x++)assert.equal(m.map[8][x],x===8||x===9?'k':'x',`wall ${x}`);
 assert.equal(m.civilians.filter(c=>c.refugee).length,8);assert.ok(m.civilians.every(c=>c.y<8));assert.equal(m.needInside,6);assert.equal(m.lostLimit,3);
 assert.deepEqual(m.objects.map(o=>o.kind),['gateLever','gateLeaf','gateLeaf']);
 for(const k of ['24:intro','24:ash','24:beasts','24:ash5','24:six','24:lost','24:lost2','24:closed:all','24:closed:left','24:end','pre:24','after:24','after:24:all','after:24:left','npc:24:preparation:elder','npc:24:aftermath:advisor','world:border','awaken:thea','awaken:ines','skirmish:115:intro','skirmish:116:intro'])assert.ok(STORY[k]?.length,k);
});
test('the ash tide: a row a turn from TURN 2; 10% of max HP at the end of the player phase on ash — never felling a hero; the beasts are at home',()=>{
 const s=battle(),st=s.missionState;assert.equal(ashRows24(s),0);turn(s);assert.equal(s.turn,2);assert.equal(st.ash,1);turn(s);turn(s);assert.equal(st.ash,3);
 const e=findUnit(s,'eric'),k=findUnit(s,'kai');quiet(s);e.x=4;e.y=1;e.hp=e.maxHP=100;k.x=5;k.y=0;k.maxHP=50;k.hp=2;
 const b=findUnit(s,'b1');Object.assign(b,{hp:72,x:14,y:0,mov:0,atk:0});const p=refugees24(s).find(r=>alive(r));
 beginEnemyPhase(s);assert.equal(e.hp,90,'10% of 100');assert.equal(k.hp,1,'a hero keeps 1 HP');assert.equal(b.hp,72,'the beast is unharmed');
});
test('the refugees walk two tiles a turn around whoever stands in the way; inside at row 9; the winch opens at six',()=>{
 const s=battle(),st=s.missionState,lever=findUnit(s,'lever');assert.ok(lever.locked);const p1=findUnit(s,'p1'),start={x:p1.x,y:p1.y};
 quiet(s);walkRefugees24(s);assert.equal(Math.abs(p1.x-start.x)+Math.abs(p1.y-start.y),2);
 const t=battle();while(!t.outcome&&t.missionState.inside.length<6&&t.turn<10)turn(t);assert.ok(t.missionState.inside.length>=6);assert.ok(gateOpen24(t));assert.ok(!findUnit(t,'lever').locked);
 assert.ok(refugees24(t).filter(r=>r.rescued).every(r=>t.missionState.inside.includes(r.id)));assert.ok(t.narrative.events.includes('24:six'));
 // a blocked way: heroes standing on both gate tiles hold everyone outside
 const b=battle();quiet(b);findUnit(b,'eric').x=8;findUnit(b,'eric').y=8;findUnit(b,'kai').x=9;findUnit(b,'kai').y=8;for(let i=0;i<6;i++){walkRefugees24(b);}assert.equal(b.missionState.inside.length,0);
});
test('closing the gate at the winch wins at once; whoever is outside stays outside; flags for the epilogue',()=>{
 const s=battle();while(s.missionState.inside.length<6&&s.turn<10)turn(s);quiet(s);const lever=findUnit(s,'lever'),e=findUnit(s,'eric');e.x=11;e.y=10;e.moved=false;e.acted=false;
 assert.ok(validTarget(s,e,lever,'search'));const left=refugees24(s).filter(alive).length;assert.ok(performAction(s,'eric','search','lever').ok);
 assert.equal(s.outcome,'victory');assert.equal(s.missionState.closedTurn,s.turn);assert.match(s.reason,/관문을 닫았습니다/);assert.equal(s.campaign.flags.mission_24_gate_turn,s.turn);
 assert.equal(s.campaign.flags.mission_24_inside,s.missionState.inside.length);assert.equal(s.campaign.flags.mission_24_left,left);assert.ok(s.units.filter(o=>o.kind==='gateLeaf').every(o=>!o.benched),'the leaves shut');
 assert.ok(s.narrative.events.includes(left?'24:closed:left':'24:closed:all'));
 const early=battle();quiet(early);const l2=findUnit(early,'lever'),k=findUnit(early,'kai');k.x=11;k.y=10;assert.ok(!validTarget(early,k,l2,'search'),'locked before six are inside');
});
test('three refugees down is a defeat; at the end of TURN 10 the gate shuts by itself — six inside wins, fewer loses',()=>{
 const s=battle();for(const id of ['p1','p2','p3']){const r=findUnit(s,id);r.hp=0;M24.afterDamage(s,r);}turn(s);assert.equal(s.outcome,'defeat');assert.match(s.reason,/3명이 쓰러졌습니다/);
 const w=battle();while(!w.outcome&&w.turn<20)turn(w);assert.equal(w.outcome,'victory');assert.equal(w.turn,11);assert.equal(w.missionState.closedTurn,10);assert.equal(w.campaign.flags.mission_24_gate_turn,10);
 const l=battle(),hold=()=>{for(const u of l.units.filter(u=>u.team==='enemy'))u.hp=0;for(const r of refugees24(l).filter(alive))r.hp=r.maxHP=999;const e=findUnit(l,'eric'),k=findUnit(l,'kai');e.x=8;e.y=8;k.x=9;k.y=8;};
 for(const id of ['p1','p2','p3','p4','p5']){findUnit(l,id).rescued=true;l.missionState.inside.push(id);}
 while(!l.outcome&&l.turn<20){hold();enemyPhase(l);}
 assert.equal(l.outcome,'defeat');assert.match(l.reason,/5명뿐/);
});
test('rewards, the feat, a mid-battle save with the ash and the walkers',()=>{
 assert.deepEqual(supplementalRewards(24,{inside24:8}).map(r=>r.kind+':'+(r.type||r.amount)),['item:medium','item:ether','gold:140']);assert.equal(supplementalRewards(24,{inside24:7}).length,2);
 assert.equal(FEATS[24].reward,'lastLantern');assert.ok(FEATS[24].test({turn:10},{mission_24_inside:8}));assert.ok(!FEATS[24].test({turn:10},{mission_24_inside:7}));
 const s=battle();turn(s);turn(s);turn(s);const back=deserialize(serialize(s));assert.deepEqual(back.missionState,s.missionState);assert.equal(ashRows24(back),3);
 assert.deepEqual(refugees24(back).map(r=>[r.id,r.x,r.y,!!r.rescued]),refugees24(s).map(r=>[r.id,r.x,r.y,!!r.rescued]));
 const bad=structuredClone(s);bad.missionState.inside.push('p9');assert.throws(()=>serialize(bad));
});
