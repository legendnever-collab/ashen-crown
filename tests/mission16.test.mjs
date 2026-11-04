// v0.9.0 — M16 The Forgotten Battlefield: fog (reach −1, far enemies hidden), ward stones (search clears the fog around them
// and stops the harvest), memory harvesters drain MP, the betraying banner's captain duels Erik on TURN 3, recruits who left
// (or Ines who never joined) come back as allies and rejoin if they stand to the end; the camp choice on the stones.
import test from 'node:test';import assert from 'node:assert/strict';
import {MISSIONS} from '../src/data/missions.js';
import {STORY} from '../src/data/story.js';
import {newGame,startBattle,beginEnemyPhase,advanceEnemy,performAction} from '../src/core/game.js';
import {findUnit,alive,rangeFor,fogHidden} from '../src/core/rules.js';
import {recruitRecord} from '../src/core/roster.js';
import {returningRecruits,chooseStones16} from '../src/core/mission-rules-v090.js';
import {duelOpen,duelPick} from '../src/core/duel.js';
import {enterHub} from '../src/core/frontier.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';
const thea=()=>({...recruitRecord('thea',14),id:'thea'});
const camp=(extra={})=>({heroes:null,results:[],clears:15,completed:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],flags:{act1_completed:true,act2_free_met:true,act2_flame_met:true,act2_completed:true,mission_14_betrayer:'iron',mission_14_recruit:'left'},choices:{m11_oath:'oath',m12_records:'take',m15_records:'keep'},factionTrust:{iron:-1,free:3,flame:1},roster:['dario'],departed:{thea:thea()},...extra});
const battle=(extra)=>{const s=newGame(62,camp(extra),16);s.screen='deployment';startBattle(s);drain(s);return s;};
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);if(duelOpen(s))duelPick(s,'skip');drain(s);};

test('M16 data: 18×14 field in fog, level 14, sortie of seven, two harvesters by their stones, three stones, three possible returners',()=>{
 const m=MISSIONS[16];assert.equal(m.weather,'fog');assert.equal(m.level,14);assert.equal(m.deployLimit,7);
 for(const h of m.enemies.filter(e=>e.kind==='harvester')){const st=m.objects.find(o=>o.id===h.stone);assert.ok(Math.abs(st.x-h.x)+Math.abs(st.y-h.y)<=1);}
 assert.equal(m.objects.filter(o=>o.kind==='wardStone').length,3);assert.deepEqual(m.allies.map(a=>a.id),['rthea','rdario','rines']);
 for(const k of ['16:intro','16:duel','16:duel:hero','16:duel:foe','16:harvest','16:echo:st1','16:echo:st3:elina','16:end','pre:16','after:16','after:16:break','after:16:leave','after:16:return:thea','after:16:next'])assert.ok(STORY[k]?.length,k);
});

test('who returns: a recruit kept aside after M14, and Ines when she never joined; nobody already in the legion',()=>{
 assert.deepEqual(returningRecruits(camp()),['thea','ines']);assert.deepEqual(returningRecruits(camp({roster:['dario','ines']})),['thea']);
 assert.deepEqual(returningRecruits(camp({roster:['thea','dario','ines'],departed:undefined})),[]);
 const s=battle();const r=findUnit(s,'rthea');assert.ok(r.benched&&!r.withdrawn,'waiting for TURN 2');assert.equal(r.level,14);assert.ok(findUnit(s,'rdario').withdrawn);
});

test('fog: bows and spells reach one tile less (not on cleared tiles, not with the Mist Lantern); far enemies are hidden',()=>{
 const s=battle();const e=findUnit(s,'elina'),lia=findUnit(s,'lia');assert.deepEqual(rangeFor(e,'attack',s),[2,2]);assert.deepEqual(rangeFor(lia,'skill',s),[1,2]);
 s.missionState.clear.push([e.x,e.y,0]);s.missionState.searched.push('st1');assert.deepEqual(rangeFor(e,'attack',s),[2,3]);
 const far=findUnit(s,'a1');assert.ok(fogHidden(s,far));const near=findUnit(s,'s4');const h=findUnit(s,'eric');h.x=near.x;h.y=near.y+1;assert.ok(!fogHidden(s,near));
 assert.deepEqual(rangeFor(findUnit(s,'eric'),'attack',s),[1,1],'melee is untouched');
});

test('harvest: a harvester beside an unsearched stone drains MP near it; searching the stone clears the fog and stops it',()=>{
 const s=battle();const st=findUnit(s,'st1'),k=findUnit(s,'kai');k.x=st.x+1;k.y=st.y+1;k.mp=10;k.maxHP=k.hp=999;k.def=99;enemyPhase(s);assert.equal(k.mp,7,'MP −3 at the turn start');
 k.x=st.x;k.y=st.y+1;k.acted=false;const r=performAction(s,'kai','search','st1');assert.ok(r.ok,r.error);drain(s);assert.ok(st.inert);assert.deepEqual(s.missionState.clear[0],[st.x,st.y,2]);
 k.mp=10;enemyPhase(s);assert.equal(k.mp,10,'no drain once searched');
});

test('the duel opens on TURN 3, pauses the battle, and the loser starts 30% down; it survives a save',()=>{
 const s=battle();beginEnemyPhase(s);while(s.phase==='enemy')advanceEnemy(s);drain(s);beginEnemyPhase(s);while(s.phase==='enemy')advanceEnemy(s);
 assert.equal(s.turn,3);assert.ok(duelOpen(s),'duel open');assert.ok(!performAction(s,'eric','wait').ok,'battle waits');
 const back=deserialize(serialize(s));assert.ok(duelOpen(back));
 const cap=findUnit(s,'cap'),eric=findUnit(s,'eric'),hp=[cap.hp,eric.hp];let n=0;while(duelOpen(s)&&n++<3)duelPick(s,'strike');
 assert.ok(['hero','foe'].includes(s.duel.result));const loser=s.duel.result==='hero'?cap:eric;assert.equal(loser.hp,Math.max(1,(loser===cap?hp[0]:hp[1])-Math.ceil(loser.maxHP*.3)));
});

test('returners appear on TURN 2; alive at the victory they rejoin with their own record and their banner trusts the legion more',()=>{
 const s=battle();enemyPhase(s);const r=findUnit(s,'rthea');assert.ok(!r.benched,'Thea is on the field');assert.equal(r.team,'allied');
 for(const h of s.units.filter(u=>u.kind==='harvester'))h.hp=0;enemyPhase(s);assert.equal(s.outcome,'victory',s.reason);
 assert.equal(s.campaign.flags.mission_16_return_thea,'joined');assert.ok(s.campaign.roster.includes('thea'));assert.ok(!s.campaign.departed?.thea);assert.equal(s.campaign.factionTrust.iron,0);
 assert.ok(s.campaign.roster.includes('ines'),'Ines, who never joined, joins too');
 enterHub(s,{aftermath:true});assert.equal(s.frontier.hub,'fieldcamp');assert.ok(chooseStones16(s,'break'));assert.ok(!chooseStones16(s,'leave'));
 const back=deserialize(serialize(s));assert.ok(back.campaign.roster.includes('thea'));
});

test('a returner who falls does not come back this time',()=>{
 const s=battle();enemyPhase(s);findUnit(s,'rthea').hp=0;for(const h of s.units.filter(u=>u.kind==='harvester'))h.hp=0;enemyPhase(s);assert.equal(s.outcome,'victory');
 assert.equal(s.campaign.flags.mission_16_return_thea,'lost');assert.ok(!s.campaign.roster.includes('thea'));assert.ok(s.campaign.departed.thea);
});
