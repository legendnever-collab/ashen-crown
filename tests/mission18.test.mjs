// v0.9.1 — M18 The Unburning Forest: rain (fire −50%, nothing catches fire), the ward (fire does nothing inside, heals
// +50%), three ward trees the loggers go for (two felled is a defeat), six forest-keepers led inside by the rescue action,
// hold to TURN 12 or bring down the logging captain; the camp choice; the hidden objective.
import test from 'node:test';import assert from 'node:assert/strict';
import {MISSIONS} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {newGame,startBattle,beginEnemyPhase,advanceEnemy,performAction} from '../src/core/game.js';
import {findUnit,alive,strikeStats,inWard,weatherOf} from '../src/core/rules.js';
import {chooseTruth18,trees18} from '../src/core/mission-rules-v091.js';
import {enterHub} from '../src/core/frontier.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';
const camp=(extra={})=>({heroes:null,results:[],clears:17,completed:[...Array(17).keys()].map(i=>i+1),flags:{act1_completed:true,act2_completed:true,mission_14_betrayer:'free'},choices:{m15_records:'keep',m16_stones:'leave',m17_oath:'take'},factionTrust:{iron:2,free:-1,flame:3},roster:['thea','ines'],...extra});
const battle=(extra)=>{const s=newGame(81,camp(extra),18);s.screen='deployment';startBattle(s);drain(s);return s;};
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
const only=(s,...keep)=>{for(const u of s.units.filter(u=>u.team==='enemy'&&!keep.includes(u)))if(u.id==='lcap'){u.x=17;u.y=13;u.mov=0;u.range=[9,9];}else u.hp=0;};

test('M18 data: 18×14 forest in rain, level 15, sortie of seven, three ward trees, six forest-keepers, the ward at its heart',()=>{
 const m=MISSIONS[18];assert.equal(m.weather,'rain');assert.equal(m.level,15);assert.equal(m.deployLimit,7);assert.equal(m.holdTurn,12);assert.deepEqual(m.ward,[6,4,11,9]);
 assert.equal(m.allies.filter(a=>a.kind==='wardTree').length,3);assert.equal(m.civilians.filter(c=>c.kind==='forester').length,6);
 for(const k of ['18:intro','18:keeper','18:tree','18:end','pre:18','after:18','after:18:tell','after:18:keep','after:18:next','npc:18:preparation:elder','npc:18:aftermath:advisor'])assert.ok(STORY[k]?.length,k);
});

test('the betraying banner\'s loggers wear that banner\'s look; trees are allied props that never move or strike back',()=>{
 const s=battle();assert.equal(findUnit(s,'l1').look,'mercSpear');assert.ok(!findUnit(s,'lcap'),'the captain arrives on TURN 4');
 const t=findUnit(s,'tr1');assert.equal(t.team,'allied');assert.ok(t.prop);only(s);enemyPhase(s);assert.deepEqual([t.x,t.y],[6,5]);
 for(let i=0;i<3;i++){only(s);enemyPhase(s);}const cap=findUnit(s,'lcap');assert.ok(cap,'arrived');assert.match(cap.name,/연맹 벌목대장/);assert.equal(cap.look,'lordA');
});

test('rain halves fire and nothing catches fire; inside the ward fire does nothing and Sain heals 50% more',()=>{
 const s=battle();assert.equal(weatherOf(s),'rain');const lia=findUnit(s,'lia'),foe=findUnit(s,'l1');foe.x=2;foe.y=2;lia.x=2;lia.y=3;
 const wet=strikeStats(s,lia,foe,'skill').damage,dry=strikeStats({...s,missionId:16,missionState:{clear:[]}},lia,foe,'skill').damage;assert.ok(wet<dry,`${wet} < ${dry}`);
 foe.x=8;foe.y=6;lia.x=8;lia.y=7;assert.ok(inWard(s,foe));assert.equal(strikeStats(s,lia,foe,'skill').damage,0,'fire does nothing inside the ward');
 lia.acted=false;lia.mp=99;foe.x=2;foe.y=2;lia.x=2;lia.y=3;performAction(s,'lia','skill','l1');assert.ok(!s.burning||!Object.keys(s.burning).length,'nothing burns in the rain');
 const sain=findUnit(s,'sain'),e=findUnit(s,'eric');e.x=8;e.y=6;sain.x=8;sain.y=7;e.hp=1;const r=performAction(s,'sain','skill','eric');assert.ok(r.ok,r.error);const inside=e.hp-1;
 const t=battle(),e2=findUnit(t,'eric'),s2=findUnit(t,'sain');e2.x=2;e2.y=3;s2.x=2;s2.y=2;e2.hp=1;performAction(t,'sain','skill','eric');const outside=e2.hp-1;
 assert.equal(inside,Math.min(e.maxHP-1,Math.round(outside*1.5)),`${inside} vs ${outside}`);
});

test('loggers go for the ward trees; two trees felled is a defeat',()=>{
 const s=battle();const l=findUnit(s,'l1'),t=findUnit(s,'tr1');only(s,l);for(const u of s.units.filter(u=>u.team==='ally'))u.y=13,u.x=Math.min(17,u.x+6);l.x=t.x;l.y=t.y+2;l.atk=500;enemyPhase(s);assert.ok(!alive(t),'the logger felled the nearest tree');
 findUnit(s,'tr2').hp=0;enemyPhase(s);assert.equal(s.outcome,'defeat');assert.match(s.reason,/고목/);
});

test('forest-keepers led inside count; victory with every tree and keeper is the hidden objective; the camp choice (once)',()=>{
 const s=battle();only(s);const e=findUnit(s,'eric');
 for(const f of s.units.filter(u=>u.kind==='forester')){e.acted=false;e.moved=false;e.x=f.x+(f.x<9?1:-1);e.y=f.y;const r=performAction(s,'eric','rescue',f.id);assert.ok(r.ok,`${f.id}: ${r.error}`);drain(s);}
 assert.equal(s.missionState.sheltered.length,6);const back=deserialize(serialize(s));assert.equal(back.missionState.sheltered.length,6);
 s.turn=12;enemyPhase(s);assert.equal(s.outcome,'victory',s.reason);assert.equal(s.campaign.flags.mission_18_trees,3);assert.equal(s.campaign.flags.mission_18_keepers,6);assert.ok(s.campaign.feats.includes(18));
 enterHub(s,{aftermath:true});assert.equal(s.frontier.hub,'forest');assert.ok(chooseTruth18(s,'tell'));assert.ok(!chooseTruth18(s,'keep'));
 const t=battle();only(t);t.turn=12;enemyPhase(t);assert.equal(t.outcome,'victory');assert.equal(trees18(t).filter(alive).length,3);
});
