import test from 'node:test';import assert from 'node:assert/strict';
import {newGame,startBattle,setDeployment,presetDeployment,performAction,beginEnemyPhase,advanceEnemy,checkOutcome,restartStage,replay,nextMission,planEnemy} from '../src/core/game.js';
import {findUnit,alive,validTarget,movement} from '../src/core/rules.js';
import {serialize,deserialize,migrate} from '../src/persistence/save-manager.js';
import {MISSIONS,LAST_MISSION} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {knownRewards,supplementalRewards} from '../src/core/battle-rewards.js';
import {drain} from './campaign-policy.mjs';

const battle=(flags={})=>{const s=newGame(4004,{heroes:null,results:[],clears:3,completed:[1,2,3],flags:{...flags}},4);s.screen='deployment';startBattle(s);drain(s);return s;};
const place=(s,id,x,y)=>{const u=findUnit(s,id);u.x=x;u.y=y;return u;};
const endTurn=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
const clearEnemies=(s,keep=[])=>{for(const u of s.units)if(u.team==='enemy'&&!keep.includes(u.id))u.hp=0;};

test('M04 data: authored fortress, objects, presets inside deployment zone, campaign continues past M03',()=>{
 const m=MISSIONS[4];assert.equal(LAST_MISSION,4);assert.deepEqual([m.width,m.height],[16,14]);
 const s=newGame(1,null,4);assert.equal(s.units.filter(u=>u.team==='object').length,3);assert.equal(findUnit(s,'boss').mov,0);
 for(const preset of Object.values(m.deployments))for(const [x,y]of preset)assert.ok(m.deployZone(s).has(`${x},${y}`),`${x},${y}`);
 for(const k of ['4:intro','4:end','4:boss','4:bond','4:search:ledger','pre:4','after:4','after:4:kept','after:4:reported','npc:4:preparation:advisor'])assert.ok(STORY[k]?.length,k);
});

test('M04 deployment zone: south rows by default; west drain only after the M02 capture statement',()=>{
 const plain=newGame(1,{heroes:null,results:[],clears:3,completed:[1,2,3],flags:{}},4);plain.screen='deployment';
 assert.equal(setDeployment(plain,'kai',2,9),false);assert.equal(setDeployment(plain,'kai',1,12),true);assert.equal(setDeployment(plain,'kai',7,8),false);
 const scouted=newGame(1,{heroes:null,results:[],clears:3,completed:[1,2,3],flags:{mission_02_supply_route_discovered:true}},4);scouted.screen='deployment';
 assert.equal(setDeployment(scouted,'kai',2,9),true);presetDeployment(scouted,'assault');assert.deepEqual([findUnit(scouted,'eric').x,findUnit(scouted,'eric').y],[6,11]);
});

test('Search: adjacent only, one action, evidence cannot be attacked or targeted by enemies, searched tile opens',()=>{
 const s=battle();const e1=findUnit(s,'e1');const lia=place(s,'lia',8,3);findUnit(s,'g4').hp=0;
 assert.equal(validTarget(s,lia,e1,'search'),false);assert.equal(validTarget(s,lia,e1,'attack'),false);
 place(s,'lia',9,1);assert.equal(validTarget(s,lia,e1,'search'),true);assert.equal(validTarget(s,lia,findUnit(s,'boss'),'search'),false);
 assert.equal(performAction(s,'lia','search','e1').ok,true);assert.ok(e1.rescued);assert.equal(e1.searchedBy,'lia');assert.ok(lia.acted);
 assert.equal(performAction(s,'lia','search','e1').ok,false);
 for(const e of s.units.filter(u=>u.team==='enemy'&&alive(u))){const p=planEnemy(s,e);assert.ok(!p.target||findUnit(s,p.target).team!=='object',e.id);}
 const k=place(s,'kai',9,2);k.moved=false;assert.ok(movement(s,k).costs.has('8,1'));
});

test('Torch-bearers burn their unsearched record at turn 8; defeating one protects its record; the ledger never burns',()=>{
 const s=battle();clearEnemies(s,['t1','t2']);findUnit(s,'t2').hp=0;for(const u of s.units.filter(u=>u.team==='ally'))place(s,u.id,u.x,12);
 while(s.turn<8&&!s.outcome)endTurn(s);
 assert.equal(findUnit(s,'e2').burned,true);assert.equal(alive(findUnit(s,'e2')),false);assert.equal(alive(findUnit(s,'e3')),true);assert.equal(alive(findUnit(s,'e1')),true);
 assert.deepEqual(s.missionState.burned,['seal']);assert.ok(s.narrative.events.includes('4:burn-warn')&&s.narrative.events.includes('4:burn'));
});

test('Boss holds the archive until an ally comes within four tiles, then moves; turn-4 wave arrives once',()=>{
 const s=battle();const boss=findUnit(s,'boss');assert.equal(boss.mov,0);place(s,'kai',7,5);beginEnemyPhase(s);assert.equal(s.missionState.alerted,true);assert.equal(boss.mov,3);
 const t=battle();for(const u of t.units.filter(u=>u.team==='ally'))place(t,u.id,u.x,13);clearEnemies(t,['boss']);while(t.turn<4)endTurn(t);
 assert.equal(t.units.filter(u=>u.id==='r1'||u.id==='r2').length,2);while(t.turn<6)endTurn(t);assert.equal(t.units.filter(u=>u.id==='r1').length,1);assert.equal(t.missionState.alerted,true);
});

test('Victory needs ledger + boss; defeat after turn 14; flags, rewards and Lia–Kai bond',()=>{
 const s=battle();clearEnemies(s);checkOutcome(s);assert.equal(s.outcome,null);
 place(s,'lia',1,2);performAction(s,'lia','search','e2');place(s,'kai',13,1);performAction(s,'kai','search','e3');const gold=s.economy.gold;place(s,'eric',9,1);performAction(s,'eric','search','e1');
 assert.equal(s.outcome,'victory');assert.equal(s.economy.gold,gold+160+40);const c=s.campaign;
 assert.ok(c.flags.mission_04_completed&&c.flags.mission_04_ledger_recovered&&c.flags.mission_04_seal_notes&&c.flags.mission_04_transfer_orders);assert.equal(c.flags.mission_04_evidence_burned,0);
 assert.equal(c.bonds.lia_kai,true);assert.ok(s.narrative.events.includes('4:bond'));
 const ids=s.economy.rewardClaims.filter(id=>id.startsWith('v040:m4'));assert.deepEqual(ids.sort(),['v040:m4:all-evidence','v040:m4:orders','v040:m4:seal-notes','v040:m4:supply']);
 const again=replay(s);again.screen='deployment';startBattle(again);assert.equal(again.practice,true);drain(again);clearEnemies(again);const g2=again.economy.gold,claims=again.economy.rewardClaims.length;place(again,'eric',9,1);performAction(again,'eric','search','e1');assert.equal(again.outcome,'victory');assert.equal(again.economy.gold,g2);assert.equal(again.economy.rewardClaims.length,claims);
 const d=battle();d.turn=15;checkOutcome(d);assert.equal(d.outcome,'defeat');
});

test('Bond needs both Lia and Kai searching in this battle; practice never grants it',()=>{
 const s=battle();clearEnemies(s);place(s,'lia',9,1);performAction(s,'lia','search','e1');assert.equal(s.outcome,'victory');assert.equal(s.campaign.bonds.lia_kai,undefined);
});

test('M04 saves: mid-battle round trip, burned state, restart to stage start, schema6 import gains choices',()=>{
 const s=battle();place(s,'lia',1,2);performAction(s,'lia','search','e2');s.missionState.burned.push('orders');findUnit(s,'e3').hp=0;findUnit(s,'e3').burned=true;
 const back=deserialize(serialize(s));assert.deepEqual(back.missionState,s.missionState);assert.equal(back.units.find(u=>u.id==='e2').rescued,true);
 const r=restartStage(back);assert.equal(r.turn,1);assert.ok(r.units.filter(u=>u.team==='object').every(alive));assert.deepEqual(r.missionState.burned,[]);
 const bad=structuredClone(s);bad.missionState.burned=['ledger'];assert.throws(()=>deserialize(serialize(bad)));
 const old=newGame(9);old.schema=6;delete old.campaign.choices;old.screen='title';const m=migrate(old);assert.equal(m.schema,7);assert.deepEqual(m.campaign.choices,{});
});

test('Supplemental reward definitions are stable and unique; M01–03 rewards unchanged',()=>{
 const ids=knownRewards().map(r=>r.id);assert.equal(new Set(ids).size,ids.length);
 assert.deepEqual(supplementalRewards(3,{rescued:2}).map(r=>r.id),['v032:m3:supply-hp','v032:m3:supply-mp','v032:m3:full-rescue']);
 assert.deepEqual(supplementalRewards(4,{}).map(r=>r.id),['v040:m4:supply']);
});

test('M01–03 never expose Search; M03 victory now continues to M04',()=>{
 for(const id of [1,2,3]){const s=newGame(5,null,id);s.screen='deployment';startBattle(s);for(const u of s.units.filter(u=>u.team==='ally'))for(const t of s.units)assert.equal(validTarget(s,u,t,'search'),false);assert.equal(s.missionState,undefined);}
 const s=newGame(5,{heroes:null,results:[],clears:2,completed:[1,2],flags:{}},3);s.outcome='victory';s.campaign.completed.push(3);assert.equal(nextMission(s).missionId,4);
});
