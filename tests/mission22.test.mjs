// v0.9.3 — M22 The Ashen Choice: three heralds read on three daises (from TURN 2, once a turn, four times each); a herald
// hurt since the last turn's start loses that turn; a hero on a fallen herald's dais reads instead; banners at the 「동맹」
// stage send knights on TURN 2; recruits still away come back on TURN 3 (the last chance); victory by the three readings,
// defeat by two heralds down or TURN 12; the ACT III choice and its trust; the feat; the hero records.
import test from 'node:test';import assert from 'node:assert/strict';
import {MISSIONS} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {newGame,startBattle,beginEnemyPhase,advanceEnemy,performAction} from '../src/core/game.js';
import {findUnit,alive} from '../src/core/rules.js';
import {chooseAct3,ACT3_CHOICE,ACT3_TRUST,supportBanners22,reader22,HERALDS} from '../src/core/mission-rules-v093.js';
import {ensureTrust} from '../src/core/factions.js';
import {supplementalRewards} from '../src/core/battle-rewards.js';
import {FEATS} from '../src/data/arms-v081.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {signatureDeed,validTally} from '../src/core/records.js';
import {drain} from './campaign-policy.mjs';
const camp22=(extra={})=>({heroes:null,results:[],clears:21,completed:[...Array(21).keys()].map(i=>i+1),flags:{act1_completed:true,act2_completed:true,mission_14_betrayer:'iron',mission_13_baldrick:'halted',aren_awakened:true},choices:{m15_records:'keep',m16_stones:'leave',m17_oath:'take',m18_truth:'tell',m19_teacher:'take',m20_superior:'trial',m20_plan:'keep',m21_king:'notyet'},factionTrust:{iron:-1,free:3,flame:1},factionsMet:['iron','free','flame'],roster:['thea','dario','ines'],...extra});
const battle=(extra)=>{const s=newGame(92,camp22(extra),22);s.screen='deployment';startBattle(s);drain(s);return s;};
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
const quiet=s=>{for(const u of s.units.filter(u=>u.team==='enemy'))u.hp=0;s.units.filter(u=>u.team==='ally').forEach((u,i)=>{u.x=3+i;u.y=10;u.maxHP=u.hp=999;u.def=u.res=99;});};
const turn=s=>{quiet(s);enemyPhase(s);};

test('M22 data: 18×14 square, level 17, sortie of seven, three heralds on three daises, four readings from TURN 2, TURN 12; scenes',()=>{
 const m=MISSIONS[22];assert.deepEqual([m.width,m.height],[18,14]);assert.equal(m.level,17);assert.equal(m.deployLimit,7);assert.equal(m.turnLimit,12);
 const h=m.civilians.filter(c=>c.kind==='herald');assert.equal(h.length,3);for(const c of h)assert.equal(m.map[c.y][c.x],'z',c.id);assert.equal(m.readTurn,2);assert.equal(m.reads,4);
 for(const k of ['22:intro','22:reading','22:betrayer','22:support:iron','22:support:free','22:support:flame','22:return:thea','22:return:dario','22:return:ines','22:read:hr','22:read:hp','22:read:hk','22:fallen','22:fallen2','22:end','pre:22','after:22','after:22:king','after:22:council','after:22:oath','after:22:end','npc:22:preparation:aren','npc:22:aftermath:advisor'])assert.ok(STORY[k]?.length,k);
});
test('readings: once a turn from TURN 2; quiet turns finish all three on TURN 5 — victory',()=>{
 const s=battle(),st=s.missionState;assert.deepEqual(st.read,{hr:0,hp:0,hk:0});turn(s);assert.equal(s.turn,2);assert.deepEqual(st.read,{hr:1,hp:1,hk:1});
 turn(s);turn(s);assert.deepEqual(st.read,{hr:3,hp:3,hk:3});assert.ok(!s.outcome);turn(s);assert.equal(s.outcome,'victory');assert.equal(s.turn,5);
});
test('a herald hurt since the last turn start loses that turn; a hero on a fallen herald\'s dais reads instead',()=>{
 const s=battle(),st=s.missionState;quiet(s);const hr=findUnit(s,'hr'),hp=findUnit(s,'hp');hr.hp-=5;st.hurt.push('hr');enemyPhase(s);assert.equal(st.read.hr,0,'hurt');assert.equal(st.read.hp,1);
 hp.hp=0;st.fallen.push('hp');assert.equal(reader22(s,hp),null);const lia=findUnit(s,'lia');lia.x=hp.x;lia.y=hp.y;assert.equal(reader22(s,hp),lia);
 turn(s);lia.x=hp.x;lia.y=hp.y;assert.equal(st.read.hp,1);
 const t=battle(),tt=t.missionState;quiet(t);const h2=findUnit(t,'hp'),l2=findUnit(t,'lia');h2.hp=0;tt.fallen.push('hp');enemyPhase(t);assert.equal(tt.read.hp,0,'nobody on the dais');
 quiet(t);l2.x=h2.x;l2.y=h2.y;enemyPhase(t);assert.equal(tt.read.hp,1,'Lia reads for the fallen herald');
});
test('two heralds down is a defeat; TURN 12 without the readings is a defeat',()=>{
 const s=battle();turn(s);assert.equal(s.turn,2,'TURN 1 the crowd shields the heralds');quiet(s);for(const id of ['hr','hp']){const h=findUnit(s,id);h.hp=1;}const g=s.units.find(u=>u.id==='g1');g.hp=g.maxHP;g.x=5;g.y=3;const g2=s.units.find(u=>u.id==='g2');g2.hp=g2.maxHP;g2.x=12;g2.y=3;enemyPhase(s);
 assert.equal(s.outcome,'defeat');assert.match(s.reason,/전령 두 명/);
 const t=battle();t.missionState.fallen.push('hk');findUnit(t,'hk').hp=0;quiet(t);for(const id of HERALDS)t.missionState.read[id]=0;while(!t.outcome&&t.turn<20){quiet(t);t.missionState.hurt=['hr'];enemyPhase(t);}assert.equal(t.outcome,'defeat');assert.match(t.reason,/12턴/);
});
test('banners at the 「동맹」 stage (not the betrayer) send two knights on TURN 2; recruits still away come back on TURN 3 and rejoin',()=>{
 const c=camp22({factionTrust:{iron:3,free:3,flame:1}});assert.deepEqual(supportBanners22(c),['free'],'the betrayer (iron) never comes, flame is not allied');
 const s=battle({departed:{}});assert.deepEqual(s.missionState.support,['free']);const bf=findUnit(s,'bf1'),bi=findUnit(s,'bi1');assert.ok(bf.benched&&!bf.withdrawn);assert.ok(bi.withdrawn);
 turn(s);assert.equal(s.turn,2);assert.ok(!bf.benched);assert.ok(alive(bf));assert.ok(findUnit(s,'bl1').benched);
 const r=battle({roster:['thea','dario'],departed:{}});assert.deepEqual(r.missionState.returning,['ines']);const ri=findUnit(r,'rines');assert.ok(ri.benched&&!ri.withdrawn);assert.ok(findUnit(r,'rthea').withdrawn);
 turn(r);turn(r);assert.equal(r.turn,3);assert.ok(!ri.benched);turn(r);turn(r);assert.equal(r.outcome,'victory');assert.equal(r.campaign.flags.mission_22_return_ines,'joined');assert.ok(r.campaign.roster.includes('ines'));
});
test('after M22: the ACT III choice moves two banners, fixed once chosen, never in practice; reward, feat, records, save',()=>{
 const s=battle();turn(s);turn(s);turn(s);turn(s);assert.equal(s.outcome,'victory');assert.equal(s.campaign.flags.act3_completed,true);assert.equal(s.campaign.flags.mission_22_heralds,3);
 assert.deepEqual(Object.keys(ACT3_CHOICE),['king','council','oath']);for(const id of Object.keys(ACT3_CHOICE)){const ups=ACT3_TRUST[id].filter(([,d])=>d>0).length,downs=ACT3_TRUST[id].filter(([,d])=>d<0).length;assert.equal(ups,1,id);assert.equal(downs,1,`${id} has a cost too`);}
 const before={...ensureTrust(s.campaign)};assert.ok(chooseAct3(s,'oath'));assert.ok(!chooseAct3(s,'king'));const after=ensureTrust(s.campaign);assert.equal(after.flame,Math.min(3,before.flame+1));assert.equal(after.free,before.free-1);
 assert.equal(s.campaign.flags.act3_choice,'oath');const p=battle();p.practice=true;p.campaign.completed.push(22);assert.ok(!chooseAct3(p,'king'));
 assert.deepEqual(supplementalRewards(22,{heralds22:3}).map(r=>r.kind+':'+(r.type||r.amount)),['item:medium','item:ether','gold:120']);assert.equal(FEATS[22].reward,'heraldHorn');assert.ok(FEATS[22].test({turn:5},{mission_22_heralds:3}));assert.ok(!FEATS[22].test({turn:9},{mission_22_heralds:3}));
 const recs=s.campaign.records;assert.ok(recs.eric.sorties>=1,'the victory counted a sortie');assert.ok(validTally(recs,null,true));
 const b=battle();assert.deepEqual(deserialize(serialize(b)).missionState,b.missionState);
});
test('hero records: kills, rescues and heals are tallied in battle and kept on a win; the signature deed',()=>{
 assert.equal(signatureDeed({sorties:5,kills:12,rescues:2,heals:40}),'격파 12');assert.equal(signatureDeed({sorties:5,kills:2,rescues:1,heals:300}),'치유 300 HP');assert.equal(signatureDeed({sorties:3,kills:0,rescues:0,heals:0}),'출전 3');assert.equal(signatureDeed(null),null);
 const s=battle();const e=findUnit(s,'eric'),g=findUnit(s,'g1');for(const u of s.units.filter(u=>u.team==='enemy'&&u.id!=='g1'))u.hp=0;g.hp=1;g.def=0;g.x=8;g.y=4;e.x=8;e.y=5;e.atk=99;e.moved=false;e.acted=false;
 assert.ok(performAction(s,'eric','attack','g1').ok);assert.equal(s.tally.eric.kills,1);assert.ok(validTally(s.tally,s.units.filter(u=>u.team==='ally').map(u=>u.id),false));
 const sain=findUnit(s,'sain');sain.x=8;sain.y=6;sain.moved=false;sain.acted=false;e.hp=e.maxHP-30;assert.ok(performAction(s,'sain','skill','eric').ok);assert.ok(s.tally.sain.heals>0);
 assert.deepEqual(deserialize(serialize(s)).tally,s.tally);
});
