// v0.6 Phase D — M08 Canyon Defense: Baldrick's line, rockfall devices, the command order, the breach rule, Thea joining.
import test from 'node:test';import assert from 'node:assert/strict';
import {MISSIONS} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {newGame,startBattle,nextMission,beginEnemyPhase,advanceEnemy,performAction,checkOutcome} from '../src/core/game.js';
import {findUnit,alive,validTarget} from '../src/core/rules.js';
import {rulesOf} from '../src/core/mission-rules.js';
import {chooseOrder,theaEligible} from '../src/core/mission-rules-v06.js';
import {enterHub} from '../src/core/frontier.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';
const camp=(extra={})=>({heroes:null,results:[],clears:7,completed:[1,2,3,4,5,6,7],flags:{act1_completed:true},choices:{m06_oath:'people',m04_records_choice:'kept',m07_deserters:'legion'},factionTrust:{iron:1,free:0,flame:0},...extra});
function battle(order='hold',extra){const s=newGame(21,camp(extra),8);s.screen='deployment';assert.ok(chooseOrder(s,order));startBattle(s);drain(s);return s;}
const turn=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
const finish=(s)=>(st,o,r)=>{st.outcome=o;st.reason=r;};

test('M08 data: 16×16 canyon, six-hero sortie, level 9, Baldrick and two soldiers on the upper choke, two rockfall devices, three villagers',()=>{
 const m=MISSIONS[8];assert.deepEqual([m.width,m.height],[16,16]);assert.ok(m.map.every(r=>r.length===16));assert.equal(m.deployLimit,6);assert.equal(m.level,9);
 assert.deepEqual(m.allies.map(a=>a.id),['baldrick','ic1','ic2']);assert.equal(m.objects.filter(o=>o.kind==='rockfall').length,2);assert.equal(m.civilians.length,3);
 const zone=m.deployZone();for(const p of m.deployments.recommended)assert.ok(zone.has(p.join(',')),`preset ${p}`);
 assert.ok(m.waves.some(w=>w.turn===7&&w.units.some(u=>u.id==='boss')),'the captain arrives on TURN 7');
 for(const k of ['8:order','8:order:hold','8:order:rescue','8:intro','8:wave','8:captain','8:rockfall','8:village:hold','8:village:rescue','8:boss','8:end','pre:8','after:8','after:8:hold','after:8:rescue','after:8:thea:joined','after:8:thea:parted','world:march','npc:8:aftermath:thea:joined','npc:8:aftermath:thea:parted'])assert.ok(STORY[k]?.length,k);
});

test('command order: chosen once before battle; obeying raises Iron Crown trust; the rescue squad does not',()=>{
 const a=newGame(1,camp(),8);a.screen='deployment';assert.ok(chooseOrder(a,'hold'));assert.equal(a.campaign.factionTrust.iron,2);assert.equal(chooseOrder(a,'rescue'),false);
 const b=newGame(1,camp(),8);b.screen='deployment';assert.ok(chooseOrder(b,'rescue'));assert.equal(b.campaign.factionTrust.iron,1);
});

test('hold: villagers cannot be rescued and leave on TURN 6; rescue: they can be rescued and the raiders come for them',()=>{
 let s=battle('hold');const v=findUnit(s,'v1'),eric=findUnit(s,'eric');eric.x=v.x+1;eric.y=v.y;assert.equal(validTarget(s,eric,v,'rescue'),false);
 for(const u of s.units.filter(u=>u.team==='enemy'))u.hp=0;while(s.turn<6)turn(s);assert.equal(s.missionState.village,'hold');assert.ok(s.units.filter(u=>u.team==='civilian').every(c=>!alive(c)&&c.withdrawn&&!c.rescued));assert.ok(s.narrative.events.includes('8:village:hold'));
 s=battle('rescue');const v2=findUnit(s,'v1'),e2=findUnit(s,'eric');e2.x=v2.x+1;e2.y=v2.y;assert.ok(validTarget(s,e2,v2,'rescue'));assert.ok(performAction(s,'eric','rescue','v1').ok);assert.ok(v2.rescued);
});

test('rockfall: one use per device, damage to enemies in its zone only, allies untouched',()=>{
 const s=battle();const rf=findUnit(s,'rf1'),m=s.units.find(u=>u.id==='m3'),bal=findUnit(s,'baldrick'),kai=findUnit(s,'kai');m.x=6;m.y=4;const hp=m.hp,bhp=bal.hp;kai.x=4;kai.y=6;
 assert.ok(validTarget(s,kai,rf,'search'));assert.ok(performAction(s,'kai','search','rf1').ok);assert.equal(m.hp,Math.max(0,hp-18));assert.equal(bal.hp,bhp);assert.deepEqual(s.missionState.rockfall,['rf1']);
 assert.equal(validTarget(s,findUnit(s,'eric'),rf,'search'),false,'used devices stay down');assert.ok(s.narrative.events.includes('8:rockfall'));
});

test('Baldrick holds at half HP; a northern mercenary past row 12 is a breach; the captain falling or TURN 10 wins',()=>{
 let s=battle();const b=findUnit(s,'baldrick');b.hp=5;rulesOf(s).afterDamage(s,b);assert.equal(b.hp,Math.ceil(b.maxHP/2));
 const m=s.units.find(u=>u.id==='m1');m.x=7;m.y=12;rulesOf(s).checkOutcome(s,finish(s));assert.equal(s.outcome,'defeat');assert.match(s.reason,/뚫렸습니다/);
 s=battle();s.turn=11;rulesOf(s).checkOutcome(s,finish(s));assert.equal(s.outcome,'victory');
 s=battle();for(const u of s.units.filter(u=>u.team==='enemy'))u.hp=0;while(s.turn<7)turn(s);const boss=findUnit(s,'boss');assert.ok(boss&&alive(boss),'captain arrives');assert.ok(s.narrative.events.includes('8:captain'));
 boss.hp=0;rulesOf(s).checkOutcome(s,finish(s));assert.equal(s.outcome,'victory');
});

test('Thea joins after the canyon when the Iron Crown trusts the legion and the deserters were not handed over',()=>{
 assert.equal(theaEligible({factionTrust:{iron:1,free:0,flame:0},choices:{m07_deserters:'legion'}}),true);
 assert.equal(theaEligible({factionTrust:{iron:2,free:0,flame:0},choices:{m07_deserters:'handover'}}),false);
 assert.equal(theaEligible({factionTrust:{iron:0,free:0,flame:0},choices:{}}),false);
 for(const [extra,order,joined] of [[{},'hold',true],[{factionTrust:{iron:-1,free:0,flame:0}},'rescue',false]]){const s=battle(order,extra);s.turn=11;checkOutcome(s);assert.equal(s.outcome,'victory');
  assert.equal(s.campaign.roster.includes('thea'),joined);assert.equal(s.campaign.flags.thea_joined,joined);if(joined){assert.ok(s.campaign.heroes.some(h=>h.id==='thea'&&h.level===8));assert.ok(findUnit(s,'thea'));}
  const back=deserialize(serialize(s));enterHub(back,{aftermath:true});assert.equal(back.frontier.hub,'march');assert.ok(back.narrative.events.includes(`after:8:${order}`));assert.ok(back.narrative.events.includes(`after:8:thea:${joined?'joined':'parted'}`));
  if(joined)assert.ok(back.frontier.members.includes('thea'));}
});

test('M07 → M08 → camp: nextMission chain, M08 save round trip, practice changes nothing',()=>{
 const seven=newGame(4,camp({completed:[1,2,3,4,5,6]}),7);seven.outcome='victory';seven.campaign.completed.push(7);const s=nextMission(seven);assert.equal(s.missionId,8);enterHub(s);assert.equal(s.frontier.hub,'castletown');
 const b=battle();turn(b);const r=deserialize(serialize(b));assert.deepEqual(r.missionState,b.missionState);
 const nine=nextMission(Object.assign(newGame(2,camp({completed:[1,2,3,4,5,6,7,8]}),8),{outcome:'victory'}));assert.equal(nine.missionId,9,'M08 leads to M09 in Velmar (v0.6.1)');enterHub(nine);assert.equal(nine.frontier.hub,'velmar');
});
