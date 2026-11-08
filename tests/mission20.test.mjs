// v0.9.2 — M20 The Crown's Shadow: the archive (clerks light a cabinet from TURN 3; a lit cabinet burns at the end of the
// next enemy phase unless searched), the burning lower city (spread through houses, set leaps, residents hurt in the fire),
// evacuation by rescue, grey cloaks in the shadows, Kai's duel at TURN 2, victory / defeat, the camp choices and the feat.
import test from 'node:test';import assert from 'node:assert/strict';
import {MISSIONS} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {newGame,startBattle,beginEnemyPhase,advanceEnemy,performAction} from '../src/core/game.js';
import {findUnit,alive,validTarget} from '../src/core/rules.js';
import {chooseSuperior20,choosePlan20,SUPERIOR20,PLAN20} from '../src/core/mission-rules-v092.js';
import {supplementalRewards} from '../src/core/battle-rewards.js';
import {FEATS} from '../src/data/arms-v081.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';
const camp20=(extra={})=>({heroes:null,results:[],clears:19,completed:[...Array(19).keys()].map(i=>i+1),flags:{act1_completed:true,act2_completed:true,mission_14_betrayer:'iron',mission_13_baldrick:'halted'},choices:{m15_records:'keep',m16_stones:'leave',m17_oath:'take',m18_truth:'tell',m19_teacher:'take'},factionTrust:{iron:-1,free:3,flame:3},roster:['dario','ines'],...extra});
const battle=(extra)=>{const s=newGame(82,camp20(extra),20);s.screen='deployment';startBattle(s);drain(s);if(s.duel&&!s.duel.result){s.duel.result='skipped';}return s;};
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);if(s.duel&&!s.duel.result)s.duel.result='skipped';};
// every enemy gone except `keep`; heroes on the street, unbreakable (the board starts at Lv 1); residents sturdy unless a test says
const quiet=(s,...keep)=>{for(const u of s.units.filter(u=>u.team==='enemy'&&!keep.includes(u.id)))u.hp=0;s.units.filter(u=>u.team==='ally').forEach((u,i)=>{u.x=2+i;u.y=5;u.maxHP=u.hp=999;u.def=u.res=99;});for(const r of s.units.filter(u=>u.kind==='resident'))r.maxHP=r.hp=999;};

test('M20 data: 18×14 archive and lower city, level 16, sortie of seven, three cabinets, six residents in houses, fire plan, TURN 13',()=>{
 const m=MISSIONS[20];assert.deepEqual([m.width,m.height],[18,14]);assert.equal(m.level,16);assert.equal(m.deployLimit,7);assert.equal(m.turnLimit,13);
 assert.equal(m.objects.filter(o=>o.kind==='cabinet').length,3);const folk=m.civilians.filter(c=>c.kind==='resident');assert.equal(folk.length,6);for(const r of folk)assert.equal(m.map[r.y][r.x],'v',r.id);
 for(const w of m.fires)for(const [x,y] of w.cells)assert.equal(m.map[y][x],'v',`${x},${y}`);assert.equal(m.plan,2);assert.equal(m.needed,4);
 assert.ok(m.enemies.filter(e=>e.shade).length>=4,'grey cloaks in the shadows');assert.equal(m.enemies.filter(e=>e.clerk).length,3);
 for(const k of ['20:intro','20:torch','20:burned','20:plan','20:plan2','20:evacuate','20:lost','20:gate','20:duel','20:duel:hero','20:duel:foe','20:yield','20:end','pre:20','after:20','after:20:release','after:20:trial','after:20:send','after:20:keep','after:20:kai','after:20:baldrick:halted','after:20:baldrick:envoy','after:20:next','npc:20:preparation:kai','npc:20:aftermath:advisor'])assert.ok(STORY[k]?.length,k);
});

test('the fire starts in two houses, spreads through the houses it touches each turn and leaps on set turns; residents in it are hurt',()=>{
 const s=battle();quiet(s);const st=s.missionState,m=MISSIONS[20];
 assert.deepEqual(st.fire.sort(),['12,9','7,10']);assert.equal(s.burning['7,10'],2);
 enemyPhase(s);assert.ok(st.fire.includes('7,9')&&st.fire.includes('8,10'),'spread');assert.ok(!st.fire.includes('6,10'),'alleys do not burn');
 const h3=findUnit(s,'h3');enemyPhase(s);assert.ok(st.fire.includes('8,9'));assert.ok(st.fire.includes('4,9')&&st.fire.includes('14,10'),'the TURN 3 leaps');assert.equal(h3.hp,h3.maxHP-m.fireDamage);
 assert.ok(validTarget(s,{...findUnit(s,'sain'),x:9,y:9},h3,'rescue'));
 deserialize(serialize(s));
});

test('clerks light a cabinet from TURN 3; it burns at the end of the next enemy phase unless searched first; two burned lose',()=>{
 const s=battle();quiet(s,'ck1','ck2');const st=s.missionState,ck2=findUnit(s,'ck2'),cb2=findUnit(s,'cb2'),ck1=findUnit(s,'ck1'),cb1=findUnit(s,'cb1');
 for(const c of [ck1,ck2]){c.maxHP=c.hp=999;c.def=c.res=99;}ck2.x=cb2.x+1;ck2.y=cb2.y;ck1.x=cb1.x+1;ck1.y=cb1.y;
 enemyPhase(s);enemyPhase(s);assert.equal(s.turn,3);assert.deepEqual(st.lit,{},'nothing before TURN 3 ends');
 enemyPhase(s);assert.equal(s.turn,4);assert.deepEqual(Object.keys(st.lit).sort(),['cb1','cb2']);
 const lia=findUnit(s,'lia');lia.x=cb2.x;lia.y=cb2.y+1;lia.moved=true;assert.ok(performAction(s,'lia','search','cb2').ok);assert.deepEqual(st.searched,['cb2']);assert.ok(!st.lit.cb2,'searched → out');
 enemyPhase(s);assert.deepEqual(st.burned,['cb1']);assert.ok(cb1.inert&&cb1.burned);assert.ok(!validTarget(s,{...lia,x:2,y:1},cb1,'search'));assert.ok(!s.outcome);
 const cb3=findUnit(s,'cb3');ck1.x=cb3.x-1;ck1.y=cb3.y;enemyPhase(s);enemyPhase(s);assert.equal(s.outcome,'defeat');assert.match(s.reason,/서가 두 곳/);
});

test('two cabinets searched and four residents evacuated win; three residents lost lose; rescued residents leave the board',()=>{
 const s=battle();quiet(s);const st=s.missionState;
 for(const [id,hero] of [['cb1','lia'],['cb3','kai']]){const c=findUnit(s,id),h=findUnit(s,hero);h.x=c.x;h.y=c.y+1;h.moved=true;assert.ok(performAction(s,hero,'search',id).ok);}assert.ok(!s.outcome,'the residents still wait');
 const free=[[0,8],[3,8],[9,8],[10,9]];for(const [i,[id,hero]] of [['h1','eric'],['h2','sain'],['h3','elina'],['h4','dario']].entries()){const r=findUnit(s,id),h=findUnit(s,hero);[h.x,h.y]=[r.x,r.y-1];if(id==='h2'){h.x=r.x+1;h.y=r.y;}if(id==='h4'){h.x=r.x-1;h.y=r.y;}h.moved=true;assert.ok(performAction(s,hero,'rescue',id).ok,id);assert.ok(!alive(r),'left the board');}
 assert.equal(s.outcome,'victory');assert.equal(s.campaign.flags.mission_20_cabinets,2);assert.equal(s.campaign.flags.mission_20_residents,4);
 const s2=battle();quiet(s2);for(const id of ['h1','h2','h3']){const r=findUnit(s2,id);r.hp=1;}const g=s2.units.find(u=>u.id==='g5');g.hp=0;s2.missionState.fire.push('2,9','5,10','8,9');enemyPhase(s2);assert.equal(s2.outcome,'defeat');assert.match(s2.reason,/세 명을 잃었/);
});

test('Kai\'s old superior challenges him at TURN 2; M20 rewards, feat, carrier and the two camp choices (superior, then the plan)',()=>{
 const s=newGame(82,camp20(),20);s.screen='deployment';startBattle(s);drain(s);for(const u of s.units.filter(u=>u.team==='enemy'))if(u.id!=='sup')u.hp=0;
 beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);assert.equal(s.turn,2);assert.equal(s.duel?.hero,'kai');assert.equal(s.duel?.foe,'sup');
 assert.deepEqual(supplementalRewards(20,{cabinets20:3,residents20:6}).map(r=>r.id),['v092:m20:supply-hp','v092:m20:supply-mp','v092:m20:all-cabinets','v092:m20:all-residents']);
 assert.equal(FEATS[20].reward,'greyLedger');assert.ok(FEATS[20].test(null,{mission_20_cabinets:3,mission_20_residents:6}));assert.ok(!FEATS[20].test(null,{mission_20_cabinets:2,mission_20_residents:6}));
 const b=battle();assert.ok(findUnit(b,'g6').carrier);
 assert.deepEqual(Object.keys(SUPERIOR20),['release','trial']);assert.deepEqual(Object.keys(PLAN20),['send','keep']);
 b.campaign.completed.push(20);assert.ok(chooseSuperior20(b,'trial'));assert.ok(!chooseSuperior20(b,'release'));assert.ok(choosePlan20(b,'send'));assert.ok(!choosePlan20(b,'keep'));assert.deepEqual([b.campaign.choices.m20_superior,b.campaign.choices.m20_plan],['trial','send']);
});
