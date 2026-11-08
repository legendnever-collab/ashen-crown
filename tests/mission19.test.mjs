// v0.9.2 — M19 The Forbidden Rite: four ritual circles draw their captives' memories from TURN 3 (a ritualist within 3);
// Lia within 2 or her runes stall a circle; a ritualist beside its circle keeps the seal shut; breaking all four seals wins;
// two captives forgotten loses; captives cannot be "rescued" off the map; the teacher choice and Lia's word; the feat.
import test from 'node:test';import assert from 'node:assert/strict';
import {MISSIONS} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {newGame,startBattle,beginEnemyPhase,advanceEnemy,performAction} from '../src/core/game.js';
import {findUnit,alive,validTarget} from '../src/core/rules.js';
import {circleState,chooseTeacher19,TEACHER19} from '../src/core/mission-rules-v092.js';
import {supplementalRewards} from '../src/core/battle-rewards.js';
import {FEATS} from '../src/data/arms-v081.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';
export const camp19=(extra={})=>({heroes:null,results:[],clears:18,completed:[...Array(18).keys()].map(i=>i+1),flags:{act1_completed:true,act2_completed:true,mission_14_betrayer:'iron',mission_13_baldrick:'halted'},choices:{m15_records:'keep',m16_stones:'leave',m17_oath:'take',m18_truth:'tell'},factionTrust:{iron:-1,free:3,flame:3},roster:['dario','ines'],...extra});
const battle=(extra)=>{const s=newGame(81,camp19(extra),19);s.screen='deployment';startBattle(s);drain(s);return s;};
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
// every enemy gone except `keep`; the heroes parked on the bottom row (made unbreakable: the board starts at Lv 1)
const only=(s,...keep)=>{for(const u of s.units.filter(u=>u.team==='enemy'&&!keep.includes(u.id)))u.hp=0;s.units.filter(u=>u.team==='ally').forEach((u,i)=>{u.x=1+i;u.y=12;u.maxHP=u.hp=999;u.def=u.res=99;});};

test('M19 data: 18×14 rite hall, level 16, sortie of seven, four circles each with a captive, the teacher on the dais, TURN 14',()=>{
 const m=MISSIONS[19];assert.deepEqual([m.width,m.height],[18,14]);assert.equal(m.level,16);assert.equal(m.deployLimit,7);assert.equal(m.turnLimit,14);
 assert.equal(m.objects.filter(o=>o.kind==='ritualCircle').length,4);assert.equal(m.civilians.filter(c=>c.kind==='captive').length,4);assert.ok(m.civilians.some(c=>c.id==='teacher'));
 for(const o of m.objects){const p=m.civilians.find(c=>c.id===o.captive);assert.ok(p,o.id);assert.equal(Math.abs(p.x-o.x)+Math.abs(p.y-o.y),1);assert.ok(m.enemies.some(r=>r.kind==='ritualist'&&r.circle===o.id),o.id);}
 for(const k of ['19:intro','19:drain','19:stall','19:forgot','19:forgot2','19:unseal','19:unseal:lia','19:unseal3','19:reinforce','19:end','pre:19','after:19','after:19:take','after:19:leave','after:19:lia','world:capital:return','npc:19:preparation:elder','npc:19:aftermath:lia','npc:19:aftermath:advisor'])assert.ok(STORY[k]?.length,k);
 assert.equal(m.deployments.recommended.length,8);
});

test('from TURN 3 a lit circle with a ritualist near takes one memory a turn; Lia within 2 or her runes stall it; at 0 the captive forgets',()=>{
 const s=battle();only(s,'r1','r2');const st=s.missionState;
 enemyPhase(s);assert.equal(s.turn,2);assert.deepEqual(Object.values(st.memory),[3,3,3,3],'nothing before TURN 3');
 const lia=findUnit(s,'lia'),rc2=findUnit(s,'rc2');lia.x=rc2.x;lia.y=rc2.y+2;assert.equal(circleState(s,rc2),'lia');
 enemyPhase(s);assert.equal(s.turn,3);assert.equal(st.memory.p1,2,'rc1 draws');assert.equal(st.memory.p2,3,'Lia stalls rc2');assert.equal(st.memory.p3,3,'no ritualist near rc3');
 s.runes=[{x:4,y:3,until:9}];lia.x=1;lia.y=12;assert.equal(circleState(s,findUnit(s,'rc1')),'runes');enemyPhase(s);assert.equal(st.memory.p1,2,'the runes stall rc1');assert.equal(st.memory.p2,2,'rc2 draws again');
 s.runes=[];findUnit(s,'r2').hp=0;enemyPhase(s);enemyPhase(s);assert.equal(st.memory.p1,0);assert.equal(st.memory.p2,2,'its ritualist is down');assert.deepEqual(st.forgotten,['p1']);assert.ok(findUnit(s,'p1').forgotten);assert.ok(alive(findUnit(s,'p1')),'forgotten, not dead');
 assert.ok(s.narrative.seen.includes('19:forgot')||s.narrative.events.includes('19:forgot'));
 assert.ok(!s.outcome);st.memory.p3=1;const r3=findUnit(s,'r3');r3.hp=r3.maxHP;enemyPhase(s);assert.equal(s.outcome,'defeat','two captives forgotten');assert.match(s.reason,/이름을 잊었/);
});

test('a hero beside a circle breaks its seal (봉인 해제) unless a ritualist stands beside it; four seals broken win the battle',()=>{
 const s=battle();only(s,'r1');const e=findUnit(s,'eric'),rc1=findUnit(s,'rc1');e.x=rc1.x;e.y=rc1.y+1;
 assert.ok(!validTarget(s,e,rc1,'search'),'r1 stands beside rc1');findUnit(s,'r1').hp=0;assert.ok(validTarget(s,e,rc1,'search'));
 assert.ok(performAction(s,'eric','search','rc1').ok);assert.deepEqual(s.missionState.unsealed,['rc1']);assert.ok(rc1.inert);assert.equal(circleState(s,rc1),'sealed');
 assert.ok(!validTarget(s,findUnit(s,'sain'),findUnit(s,'p1'),'rescue'),'captives stay');
 for(const [id,hero] of [['rc2','lia'],['rc3','sain'],['rc4','kai']]){const c=findUnit(s,id),h=findUnit(s,hero);h.x=c.x;h.y=c.y+1;h.moved=true;assert.ok(performAction(s,hero,'search',id).ok,id);}
 assert.equal(s.outcome,'victory');assert.equal(s.campaign.flags.mission_19_unsealed,4);assert.equal(s.campaign.flags.mission_19_remembered,4);
 deserialize(serialize(s));
});

test('M19 rewards, feat, supply carrier; the teacher choice is fixed once made; 「한 사람도 두고 가지 않는다」 is the default order',()=>{
 assert.deepEqual(supplementalRewards(19,{remembered19:4}).map(r=>r.id),['v092:m19:supply-hp','v092:m19:supply-mp','v092:m19:all-names']);
 assert.deepEqual(supplementalRewards(19,{remembered19:3}).map(r=>r.id),['v092:m19:supply-hp','v092:m19:supply-mp']);
 assert.equal(FEATS[19].reward,'teacherQuill');assert.ok(FEATS[19].test(null,{mission_19_unsealed:4,mission_19_remembered:4}));assert.ok(!FEATS[19].test(null,{mission_19_unsealed:4,mission_19_remembered:3}));
 const s=battle();assert.equal(s.command,'leaveNoOne');assert.ok(findUnit(s,'g2').carrier,'the supply carrier');
 assert.deepEqual(Object.keys(TEACHER19),['take','leave']);s.campaign.completed.push(19);assert.ok(chooseTeacher19(s,'take'));assert.ok(!chooseTeacher19(s,'leave'));assert.equal(s.campaign.choices.m19_teacher,'take');
});
