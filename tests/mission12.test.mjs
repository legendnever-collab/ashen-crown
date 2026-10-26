// v0.7.0 — M12 The Silent Monastery: quiet guards watch ahead and turn in order; being seen raises suspicion, a second
// sighting or noise rings the bell (guards wake, three come from the dormitory, the abbot burns unsecured records three
// turns later); sneak attacks; the records choice in the camp and Ines joining.
import test from 'node:test';import assert from 'node:assert/strict';
import {MISSIONS} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {newGame,startBattle,beginEnemyPhase,advanceEnemy,performAction,nextMission} from '../src/core/game.js';
import {findUnit,alive,validTarget,watchCells,watchedTiles,strikeStats,surprised} from '../src/core/rules.js';
import {rulesOf} from '../src/core/mission-rules.js';
import {chooseRecords,inesEligible} from '../src/core/mission-rules-v070.js';
import {enterHub,currentHub} from '../src/core/frontier.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';
const camp=(extra={})=>({heroes:null,results:[],clears:11,completed:[1,2,3,4,5,6,7,8,9,10,11],flags:{act1_completed:true,act2_free_met:true,act2_flame_met:true},choices:{m06_oath:'people',m04_records_choice:'kept',m11_oath:'legion'},factionTrust:{iron:1,free:2,flame:0},roster:[],...extra});
const battle=(extra)=>{const s=newGame(43,camp(extra),12);s.screen='deployment';startBattle(s);drain(s);return s;};
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
const finish=(st,o,r)=>{st.outcome=o;st.reason=r;};
const park=s=>{for(const u of s.units.filter(u=>u.team==='ally'&&!u.benched)){u.x=0;u.y=11+(u.id.length%3);}let x=0;for(const u of s.units.filter(u=>u.team==='ally'&&!u.benched)){u.x=x++;u.y=13;}};
const won=s=>{const st={...s};return st;};

test('M12 data: 18×14 monastery, level 11, seven quiet guards with a turning order, the abbot, three records, a dormitory wave on the bell',()=>{
 const m=MISSIONS[12];assert.deepEqual([m.width,m.height],[18,14]);assert.ok(m.map.every(r=>r.length===18));assert.equal(m.level,11);assert.equal(m.deployLimit,6);assert.ok(m.stealth);assert.equal(m.burnDelay,3);
 const guards=m.enemies.filter(e=>e.watch);assert.equal(guards.length,7);assert.ok(guards.every(g=>g.mov===0&&g.alertMov===3&&g.turns.length>=2&&g.turns[0]===g.facing));
 assert.deepEqual(m.objects.map(o=>o.evidence),['ledger','seal','roster']);assert.equal(m.capture,'boss');assert.ok(m.waves.every(w=>w.alarm&&w.units.length===3));
 const zone=m.deployZone();for(const p of [...m.deployments.recommended,...m.deployments.assault,...m.deployments.defense])assert.ok(zone.has(p.join(',')),`preset ${p}`);
 for(const k of ['12:intro','12:turn2','12:suspicion','12:alarm','12:dorm','12:silent','12:burn-warn','12:burn','12:search:ledger','12:search:seal','12:search:seal:lia','12:search:roster','12:encounter','12:capture','12:boss','12:end','pre:12','after:12','after:12:sain','after:12:return','after:12:take','after:12:copy','after:12:ines:joined','after:12:ines:parted','world:refuge','npc:12:preparation:ines','npc:12:aftermath:ines','npc:12:aftermath:advisor'])assert.ok(STORY[k]?.length,k);
});

test('watch: two tiles ahead and the two diagonals ahead, walls block; three ahead once suspicious; awake guards watch nothing',()=>{
 const s=battle(),g1=findUnit(s,'g1');assert.deepEqual([...watchCells(s,g1)].sort(),['8,10','8,11','9,10'],'facing down from (8,9): (7,10) is wall');
 g1.facing='up';assert.deepEqual([...watchCells(s,g1)].sort(),['7,8','8,7','8,8','9,8']);s.missionState.alert=1;assert.ok(watchCells(s,g1).has('8,6'));
 g1.awake=true;assert.equal(watchCells(s,g1).size,0);assert.ok(!watchedTiles(s).has('8,6'));
});

test('seen: a hero in a watched tile when the enemy phase starts raises suspicion; a second sighting rings the bell',()=>{
 const s=battle();park(s);const eric=findUnit(s,'eric'),g1=findUnit(s,'g1');eric.x=8;eric.y=11;assert.ok(watchCells(s,g1).has('8,11'));
 enemyPhase(s);assert.equal(s.missionState.alert,1);assert.ok(s.narrative.seen.includes('12:suspicion')||s.narrative.events.includes('12:suspicion'));assert.ok(!g1.awake);
 eric.x=8;eric.y=8;g1.facing='up';g1.turnIndex=2;enemyPhase(s);assert.equal(s.missionState.alert,2);assert.equal(s.missionState.alarmTurn,2);assert.equal(s.missionState.burnTurn,5);
 assert.ok(findUnit(s,'g2').awake&&findUnit(s,'g2').mov===3&&findUnit(s,'boss').awake);assert.ok(['w1','w2','w3'].every(id=>findUnit(s,id)),'the dormitory wakes');
});

test('guards turn in their order each enemy phase while quiet and hold their place',()=>{
 const s=battle();park(s);const g1=findUnit(s,'g1');enemyPhase(s);assert.equal(g1.facing,'left');assert.deepEqual([g1.x,g1.y],[8,9]);enemyPhase(s);assert.equal(g1.facing,'up');enemyPhase(s);assert.equal(g1.facing,'right');enemyPhase(s);assert.equal(g1.facing,'down');
 assert.equal(s.missionState.alert,0);
});

test('sneak: a quiet guard struck from outside its watch takes +5 and is hit +30; one blow is silent, a surviving guard rings the bell',()=>{
 let s=battle();park(s);const g=findUnit(s,'g1'),kai=findUnit(s,'kai');kai.x=9;kai.y=9;g.facing='left';assert.ok(surprised(s,kai,g));
 const quiet=strikeStats(s,kai,g);g.facing='right';assert.ok(!surprised(s,kai,g));const seen=strikeStats(s,kai,g);assert.equal(quiet.damage-seen.damage,5);assert.ok(quiet.hit>=Math.min(100,seen.hit+30)||quiet.hit===100);
 g.facing='left';g.hp=1;assert.ok(performAction(s,'kai','attack','g1').ok);drain(s);assert.ok(!alive(g));assert.equal(s.missionState.alert,0,'silent');
 s=battle();park(s);const h=findUnit(s,'g1'),k2=findUnit(s,'kai');k2.x=9;k2.y=9;h.facing='left';h.hp=h.maxHP;k2.atk=10;assert.ok(performAction(s,'kai','attack','g1').ok);drain(s);assert.ok(alive(h));assert.equal(s.missionState.alert,2,'noise rings the bell');
});

test('the bell: three turns later the abbot burns every record not yet secured; a burned ledger is a defeat; securing it first is quiet',()=>{
 let s=battle();park(s);const st=s.missionState;st.alert=0;rulesOf(s).onAction(s,findUnit(s,'kai'),'attack',Object.assign(findUnit(s,'g1'),{hp:5}));assert.equal(st.alert,2);assert.equal(st.burnTurn,4);
 const lia=findUnit(s,'lia'),seal=findUnit(s,'rec_seal');lia.x=15;lia.y=1;assert.ok(validTarget(s,lia,seal,'search'));
 for(const g of s.units.filter(u=>u.team==='enemy'))if(g.id!=='boss'){g.hp=0;}findUnit(s,'boss').mov=0;
 assert.ok(performAction(s,'lia','search','rec_seal').ok);drain(s);enemyPhase(s);enemyPhase(s);enemyPhase(s);assert.equal(s.turn,4);
 assert.deepEqual(st.burned.sort(),['ledger','roster']);assert.ok(findUnit(s,'rec_ledger').burned);assert.equal(s.outcome,'defeat');
 s=battle();park(s);const kai=findUnit(s,'kai'),led=findUnit(s,'rec_ledger');kai.x=2;kai.y=1;const boss=findUnit(s,'boss');boss.x=4;boss.y=2;
 assert.ok(performAction(s,'kai','search','rec_ledger').ok);drain(s);assert.ok(s.missionState.quiet);assert.equal(s.missionState.alert,0);
 boss.hp=0;rulesOf(s).checkOutcome(s,finish);assert.equal(s.outcome,'victory');assert.match(s.reason,/경보 전에 장부 확보/);
});

test('the abbot can be taken alive below half HP; capture stops the burning',()=>{
 const s=battle();park(s);const boss=findUnit(s,'boss'),eric=findUnit(s,'eric');eric.x=boss.x+1;eric.y=boss.y;boss.hp=Math.floor(boss.maxHP/2);assert.ok(validTarget(s,eric,boss,'capture'));
 s.missionState.alert=2;s.missionState.burnTurn=s.turn+1;assert.ok(performAction(s,'eric','capture','boss').ok);drain(s);assert.ok(s.missionState.captured);enemyPhase(s);assert.deepEqual(s.missionState.burned,[],'no fire once captured');
});

test('records choice: return +1 / take −1 / copy only after Lia and Kai each secured a record; Ines joins when the Order trusts the legion or the copy',()=>{
 const after=(flags,trust=0)=>{const s=battle({factionTrust:{iron:1,free:2,flame:trust}});s.campaign.completed.push(12);Object.assign(s.campaign.flags,flags);return s;};
 let s=after({});assert.ok(!chooseRecords(s,'copy'),'copy needs Lia and Kai');assert.ok(chooseRecords(s,'return'));assert.equal(s.campaign.factionTrust.flame,1);assert.ok(s.campaign.roster.includes('ines'));assert.ok(!chooseRecords(s,'take'),'once only');
 s=after({},1);assert.ok(chooseRecords(s,'take'));assert.equal(s.campaign.factionTrust.flame,0);assert.ok(!s.campaign.roster.includes('ines'));assert.equal(s.campaign.flags.ines_joined,false);
 s=after({mission_12_copy_ready:true},-1);assert.ok(chooseRecords(s,'copy'));assert.equal(s.campaign.factionTrust.flame,-1);assert.ok(s.campaign.roster.includes('ines'),'the copy wins her over');
 assert.ok(inesEligible({factionTrust:{iron:0,free:0,flame:1},choices:{}}));assert.ok(!inesEligible({factionTrust:{iron:0,free:0,flame:0},choices:{m12_records:'take'}}));
 const t=battle();assert.ok(!chooseRecords(t,'return'),'not before the victory');
});

test('Ines in the legion: Lv 10, Sanctuary Oath skill sets her oath until the next player phase; she stands at the camp fire',()=>{
 const s=battle();s.campaign.completed.push(12);s.campaign.flags.mission_12_copy_ready=true;chooseRecords(s,'copy');const rec=s.campaign.heroes?.find?.(h=>h.id==='ines')||findUnit(s,'ines');assert.equal(rec.level,10);
 enterHub(s,{aftermath:true,story:false});assert.equal(s.frontier.hub,'refuge');assert.ok(currentHub(s).npcs.some(n=>n.id==='ines'));
 const b=newGame(7,structuredClone({...s.campaign,completed:[...s.campaign.completed]}),12);b.screen='deployment';startBattle(b);drain(b);const ines=findUnit(b,'ines');assert.ok(ines&&ines.team==='ally');
 const g=findUnit(b,'g2');ines.x=g.x-1;ines.y=g.y;g.facing='up';g.hp=200;g.maxHP=200;ines.benched=false;
 assert.ok(performAction(b,'ines','skill','g2').ok);drain(b);assert.ok(ines.sanctuary);enemyPhase(b);assert.ok(!ines.sanctuary,'until the next player phase');
});

test('M12 saves round-trip mid battle after the bell',()=>{
 const s=battle();park(s);rulesOf(s).onAction(s,findUnit(s,'kai'),'attack',Object.assign(findUnit(s,'g1'),{hp:5}));const back=deserialize(serialize(s));
 assert.deepEqual(back.missionState,s.missionState);assert.ok(findUnit(back,'w1')&&findUnit(back,'g2').awake);
 const bad=structuredClone(s);bad.missionState.alert=3;assert.throws(()=>deserialize(serialize(bad)));
});
