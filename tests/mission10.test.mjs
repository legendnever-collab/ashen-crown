// v0.6.1 — M10 Two Lords' War: the pre-battle stance (support Oswin / support Brennan / mediate), rival armies
// fighting each other, captures that stand an army down, the truce, Free Lords trust, Dario joining, Riposte.
import test from 'node:test';import assert from 'node:assert/strict';
import {MISSIONS} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {newGame,startBattle,beginEnemyPhase,advanceEnemy,performAction,checkOutcome,restartStage} from '../src/core/game.js';
import {findUnit,alive,hostile,validTarget,forecast,strikeStats} from '../src/core/rules.js';
import {rulesOf} from '../src/core/mission-rules.js';
import {chooseStance,darioEligible} from '../src/core/mission-rules-v061.js';
import {enterHub} from '../src/core/frontier.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';
const camp=(extra={})=>({heroes:null,results:[],clears:9,completed:[1,2,3,4,5,6,7,8,9],flags:{act1_completed:true,act2_free_met:true},choices:{m06_oath:'people',m04_records_choice:'kept',m07_deserters:'legion',m08_order:'hold'},factionTrust:{iron:2,free:0,flame:0},...extra});
function battle(stance='mediate',extra){const s=newGame(41,camp(extra),10);s.screen='deployment';assert.ok(chooseStance(s,stance));startBattle(s);drain(s);return s;}
const turn=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
const beside=(s,u,t)=>{for(const [dx,dy] of [[0,1],[0,-1],[1,0],[-1,0]]){const x=t.x+dx,y=t.y+dy;if(!s.units.some(o=>o!==u&&alive(o)&&o.x===x&&o.y===y)&&MISSIONS[10].map[y]?.[x]&&!['x','w'].includes(MISSIONS[10].map[y][x])){u.x=x;u.y=y;return;}}};
const capture=(s,id)=>{const t=findUnit(s,id),eric=findUnit(s,'eric');eric.acted=false;eric.moved=false;beside(s,eric,t);t.hp=Math.floor(t.maxHP/2);assert.ok(performAction(s,'eric','capture',id).ok,id);};

test('M10 data: 18×16 field between two camps, level 10, two armies of eight with factions, three villagers, Dario as ally',()=>{
 const m=MISSIONS[10];assert.deepEqual([m.width,m.height],[18,16]);assert.ok(m.map.every(r=>r.length===18));assert.equal(m.level,10);assert.equal(m.deployLimit,6);
 assert.deepEqual(m.capture,['boss','boss2']);assert.equal(m.enemies.filter(e=>e.faction==='a').length,8);assert.equal(m.enemies.filter(e=>e.faction==='b').length,8);assert.equal(m.civilians.length,3);
 const zone=m.deployZone();for(const p of m.deployments.recommended)assert.ok(zone.has(p.join(',')),`preset ${p}`);
 for(const k of ['10:stance','10:stance:a','10:stance:b','10:stance:mediate','10:intro','10:turn2','10:reinforce','10:village','10:capture:a','10:capture:b','10:mediate:fail','10:truce','10:encounter','10:boss','10:boss2','10:end','pre:10','after:10','after:10:a','after:10:b','after:10:mediate','after:10:failed','after:10:dario:joined','after:10:dario:parted','npc:10:aftermath:dario:joined','npc:10:aftermath:dario:parted'])assert.ok(STORY[k]?.length,k);
});

test('stance: chosen once before battle; support turns that lord\'s army into allies (waves too) and the save stays valid',()=>{
 const s=newGame(1,camp(),10);s.screen='deployment';assert.ok(chooseStance(s,'a'));assert.equal(chooseStance(s,'b'),false,'once only');
 assert.ok(s.units.filter(u=>u.faction==='a').every(u=>u.team==='allied'));assert.ok(s.units.filter(u=>u.faction==='b').every(u=>u.team==='enemy'));
 startBattle(s);drain(s);const r=deserialize(serialize(s));assert.ok(r.units.filter(u=>u.faction==='a').every(u=>u.team==='allied'));
 for(const u of s.units.filter(u=>u.team==='enemy'||u.team==='allied'&&u.faction))if(u.faction==='b')u.hp=1;while(s.turn<4&&!s.outcome)turn(s);
 assert.ok(['la5','la6'].every(id=>findUnit(s,id)?.team==='allied'),'blue-white reinforcements fight beside the legion');
 const p=newGame(2,camp({completed:[1,2,3,4,5,6,7,8,9,10],choices:{m10_stance:'b'}}),10);assert.ok(p.practice);assert.ok(p.units.filter(u=>u.faction==='b').every(u=>u.team==='allied'),'practice replays keep the stance');
 assert.equal(chooseStance(p,'a'),false);
});

test('mediation: the two armies are hostile to each other; a captured lord\'s army stands down; both captured = truce and victory',()=>{
 const s=battle('mediate');assert.ok(hostile(s,findUnit(s,'la1'),findUnit(s,'lb1')));
 capture(s,'boss');assert.ok(s.units.filter(u=>u.faction==='a'&&u.id!=='boss').every(u=>!alive(u)),'blue-white army stands down');assert.equal(s.outcome,null);
 capture(s,'boss2');assert.ok(s.truce);assert.equal(s.outcome,'victory');assert.match(s.reason,/중재 성공/);assert.ok(s.narrative.events.includes('10:truce'));
 assert.equal(hostile(s,findUnit(s,'la1'),findUnit(s,'lb1')),false,'the truce stops the rival armies');
});

test('mediation fails when a lord falls; the fight still ends when both are down; turn limit is a defeat',()=>{
 let s=battle('mediate');const a=findUnit(s,'boss');a.hp=1;const eric=findUnit(s,'eric');beside(s,eric,a);eric.atk=99;performAction(s,'eric','attack','boss');
 assert.ok(a.hp<=0&&s.missionState.failed);assert.ok(s.narrative.events.includes('10:mediate:fail'));capture(s,'boss2');assert.equal(s.outcome,'victory');assert.match(s.reason,/중재 실패/);
 s=battle('mediate');s.turn=13;rulesOf(s).checkOutcome(s,(st,o,r)=>{st.outcome=o;st.reason=r;});assert.equal(s.outcome,'defeat');
});

test('support: the supported lord does not fall below half HP; the rival lord down wins',()=>{
 const s=battle('b');const b=findUnit(s,'boss2');assert.equal(b.team,'allied');b.hp=3;rulesOf(s).afterDamage(s,b);assert.equal(b.hp,Math.ceil(b.maxHP/2));
 assert.equal(validTarget(s,findUnit(s,'eric'),b,'capture'),false,'an ally cannot be captured');capture(s,'boss');assert.equal(s.outcome,'victory');assert.match(s.reason,/브레넌 경 지원/);
});

test('Free Lords trust and Dario: a side +1, a truce +2, a failed mediation 0; Dario joins with trust ≥ 1 or a truce',()=>{
 for(const [stance,free,joined,setup] of [['a',1,true,s=>{findUnit(s,'boss2').hp=0;}],['mediate',2,true,s=>{capture(s,'boss');capture(s,'boss2');}],['mediate',0,false,s=>{findUnit(s,'boss').hp=0;s.missionState.failed=true;s.campaign.flags.mission_10_mediation_failed=true;findUnit(s,'boss2').hp=0;}]]){
  const s=battle(stance);setup(s);checkOutcome(s);assert.equal(s.outcome,'victory',stance);assert.equal(s.campaign.factionTrust.free,free,stance);assert.equal(s.campaign.roster.includes('dario'),joined,stance);
  if(joined)assert.ok(s.campaign.heroes.some(h=>h.id==='dario'&&h.level===9));
  const back=deserialize(serialize(s));enterHub(back,{aftermath:true});assert.equal(back.frontier.hub,'velmar');assert.ok(back.narrative.events.includes(`after:10:dario:${joined?'joined':'parted'}`));
  assert.ok(back.narrative.events.includes(stance==='mediate'?(free?'after:10:mediate':'after:10:failed'):`after:10:${stance}`));}
 assert.equal(darioEligible({factionTrust:{iron:0,free:1,flame:0},flags:{}}),true);assert.equal(darioEligible({factionTrust:{iron:0,free:0,flame:0},flags:{}}),false);
});

test('Dario\'s Riposte: counters +4, +8 after the skill until the next player phase; the skill itself +2',()=>{
 const s=newGame(9,camp({completed:[1,2,3,4,5,6,7,8,9,10],roster:['thea','dario']}),10);s.screen='deployment';const d=findUnit(s,'dario');delete d.benched;startBattle(s);drain(s);
 const foe=s.units.find(u=>u.team==='enemy'&&u.id!=='boss');d.x=3;d.y=7;foe.x=4;foe.y=7;const base=strikeStats(s,d,foe,'attack').damage;
 assert.equal(strikeStats(s,d,foe,'skill').damage,base+2);assert.equal(forecast(s,foe,d,'attack').counter,base+4);
 d.riposte=true;assert.equal(forecast(s,foe,d,'attack').counter,base+8);
 const eric=findUnit(s,'eric');assert.equal(forecast(s,foe,eric,'attack').counter,eric.hp>strikeStats(s,foe,eric).damage?strikeStats(s,eric,foe).damage:0,'other heroes unchanged');
});
