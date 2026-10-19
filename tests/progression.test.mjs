// v0.5.0 Phase C: potential (3 steps), proficiency ★, promotion state, schema 8 (D-047/D-048).
import test from 'node:test';import assert from 'node:assert/strict';
import {newGame,startBattle,performAction} from '../src/core/game.js';
import {findUnit,strikeStats,awardXP,terrainCost} from '../src/core/rules.js';
import {effectiveStats} from '../src/core/economy.js';
import {potentialOf,proficiencyOf,proficiencyBonus,promotionStatus,promote,classOf,nextClassOf,act1Complete} from '../src/core/progression.js';
import {CLASS_TREE,CLASS_ACTIONS,PROMOTION_LEVEL} from '../src/data/classes.js';
import {serialize,deserialize,migrate} from '../src/persistence/save-manager.js';
import {SCHEMA,HEROES} from '../src/data/game-data.js';
import {drain} from './campaign-policy.mjs';

// The ACT I camp is the won M06 state (not practice): completed 1–5 while M06 is being played, act1 flag set at victory.
const camp=(memory={},levels={},flags={act1_completed:true})=>{const s=newGame(5,{heroes:null,results:[],clears:5,completed:[1,2,3,4,5],flags,tacticalMemory:memory},6);assert.equal(s.practice,false);s.campaign.heroes=structuredClone(s.units.filter(u=>u.team==='ally'));for(const h of s.campaign.heroes)h.level=levels[h.id]??PROMOTION_LEVEL;return s;};

test('every hero has a tier-1 class matching its current class name and one tier-2 promotion with a new action',()=>{
 for(const h of HEROES){const tree=CLASS_TREE[h.id];assert.equal(tree[0].name,h.className);assert.equal(tree.length,2);const t2=tree[1];assert.equal(t2.tier,2);assert.ok(CLASS_ACTIONS[t2.action],h.id);assert.equal(CLASS_ACTIONS[t2.action].hero,h.id);}
 const u={id:'kai',classTier:1};assert.equal(classOf(u).key,'rogue');assert.equal(nextClassOf(u).key,'shadowblade');
});

test('potential steps unlock in order and read existing tactical memory retroactively',()=>{
 const rec={id:'eric',clues:[]};
 assert.equal(potentialOf({tacticalMemory:{}},rec).step,0);
 assert.equal(potentialOf({tacticalMemory:{guard_eric_lia:1}},rec).step,1);
 assert.equal(potentialOf({tacticalMemory:{guard_eric_lia:1,guard_eric_sain:1}},rec).step,2);
 assert.equal(potentialOf({tacticalMemory:{guard_eric_lia:3,guard_eric_sain:2}},rec).step,3);
 // a later step never counts before the earlier one is done
 assert.equal(potentialOf({tacticalMemory:{elina_forest_shot:0,m6_elina_beacon:1}},{id:'elina',clues:[]}).step,0);
 assert.equal(potentialOf({tacticalMemory:{elina_forest_shot:5,m6_elina_beacon:1}},{id:'elina',clues:[]}).step,3);
 assert.equal(potentialOf({tacticalMemory:{}},{id:'sain',clues:['Divine Recall']}).step,1);
 assert.equal(potentialOf({tacticalMemory:{kai_rescue:2,kai_bypass:1,m6_kai_lever:1}},{id:'kai',clues:[]}).step,3);
});

test('proficiency stars follow 1/4/9/16/25 and give no combat bonus before promotion',()=>{
 assert.deepEqual([0,1,3,4,8,9,25,40].map(c=>proficiencyOf({tacticalMemory:{lia_kill:c}},'lia').stars),[0,1,1,2,2,3,5,5]);
 const s=camp({lia_kill:25});s.screen='deployment';startBattle(s);drain(s);const lia=findUnit(s,'lia'),foe=s.units.find(u=>u.team==='enemy');
 assert.deepEqual(proficiencyBonus(s,lia),{});const before=strikeStats(s,lia,foe).hit;
 lia.classTier=2;assert.deepEqual(proficiencyBonus(s,lia),{hit:10});assert.equal(strikeStats(s,lia,foe).hit,Math.min(100,before+10));
 assert.deepEqual(proficiencyBonus(s,{...findUnit(s,'sain'),classTier:2}),{heal:0});
});

test('promotion needs ACT I, the level and full potential; it applies once and is recorded',()=>{
 const full={guard_eric_lia:3,guard_eric_sain:2};
 let s=camp(full,{eric:PROMOTION_LEVEL},{});assert.equal(act1Complete({campaign:{flags:{},completed:[1,2,3]}}),false);
 s.campaign.completed=[1,2,3];assert.equal(promotionStatus(s,'eric').eligible,false);assert.equal(promote(s,'eric'),false);
 s=camp(full,{eric:PROMOTION_LEVEL-1});assert.deepEqual(promotionStatus(s,'eric').checks.map(c=>c.ok),[true,false,true]);
 s=camp({},{eric:PROMOTION_LEVEL});assert.deepEqual(promotionStatus(s,'eric').checks.map(c=>c.ok),[true,true,false]);
 s=camp(full);const rec=s.campaign.heroes.find(h=>h.id==='eric'),def=rec.def,hp=rec.maxHP;assert.ok(promotionStatus(s,'eric').eligible);
 assert.ok(promote(s,'eric'));assert.equal(rec.classTier,2);assert.equal(rec.def,def+2);assert.equal(rec.maxHP,hp+4);assert.equal(findUnit(s,'eric').classTier,2);
 assert.equal(s.campaign.promotions.eric.key,'guardianKnight');assert.equal(promote(s,'eric'),false,'never twice');assert.equal(rec.def,def+2);
 assert.equal(promotionStatus(s,'eric').promoted,true);
 const p=camp(full);p.practice=true;assert.equal(promote(p,'eric'),false,'practice never promotes');
});

test('tier-2 class traits: Kai MOV +1, Elina ranger crosses forest at cost 1, Erik grows DEF +3',()=>{
 const s=camp({kai_rescue:6,elina_forest_shot:10},{});s.screen='deployment';startBattle(s);drain(s);
 const kai=findUnit(s,'kai'),mov=effectiveStats(s,kai).mov;promote(s,'kai',{force:true});assert.equal(effectiveStats(s,kai).mov,mov+1);
 const elina=findUnit(s,'elina'),m=s.missionId,map=(()=>{for(let y=0;y<14;y++)for(let x=0;x<18;x++)if(terrainCost(s,{...elina,movementProfile:'infantry'},x,y)===2)return [x,y];})();
 if(map){assert.equal(terrainCost(s,elina,...map),2);promote(s,'elina',{force:true});assert.equal(terrainCost(s,elina,...map),1);}
 const eric=findUnit(s,'eric');promote(s,'eric',{force:true});const d=eric.def;eric.xp=99;awardXP(s,eric,1,'t');assert.equal(eric.def,d+3);
 assert.equal(m,6);
});

test('skill use and Lia kills are remembered (memory only, outside practice)',()=>{
 const s=newGame(2);s.screen='deployment';startBattle(s);drain(s);const lia=findUnit(s,'lia'),foe=s.units.find(u=>u.team==='enemy');
 lia.x=foe.x;lia.y=foe.y+1;if(s.units.some(u=>u!==lia&&u.hp>0&&u.x===lia.x&&u.y===lia.y))lia.y=foe.y-1;foe.hp=1;
 const r=performAction(s,'lia','skill',foe.id);assert.ok(r.ok,r.error);assert.equal(s.campaign.tacticalMemory.lia_skill,1);
 if(foe.hp<=0)assert.equal(s.campaign.tacticalMemory.lia_kill,1);
});

test('schema 7 saves migrate to 8: heroes read as tier 1 and an empty promotion ledger; current saves round-trip',()=>{
 const s=newGame(3);const old=JSON.parse(JSON.stringify(s));old.schema=7;old.version='0.4.0';delete old.campaign.promotions;for(const u of old.units)delete u.classTier;
 const m=migrate(old);assert.equal(m.schema,SCHEMA);assert.equal(SCHEMA,8);assert.deepEqual(m.campaign.promotions,{});assert.ok(m.units.filter(u=>u.team==='ally').every(u=>classOf(u).tier===1),'unset classTier reads as tier 1');
 const again=deserialize(serialize(m));assert.equal(again.schema,8);
});
