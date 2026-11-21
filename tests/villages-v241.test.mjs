// v2.4.1 (D-135, docs/v2.4.0/ACT3_MAPS_DESIGN.md §3): the ACT III small villages. The forgotten battlefield (M16) opens 등불골,
// the unburning forest (M18) opens 이끼다리, each with a request board, a tavern and a shop; 「잿빛 안개 속 약초꾼」 brings 마렌
// (rogue, a rescued hero who grows like a hero; swamp costs her 1); 「이끼다리 보수」 takes 10% off the shops round the capital;
// each village has a bounty.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {deserialize,serialize} from '../src/persistence/save-manager.js';
import {travelTo,currentHub,revisitTowns,exitInterior} from '../src/core/frontier.js';
import {requestsAt,startRequest,payRequest} from '../src/core/villages.js';
import {returnToCamp} from '../src/core/skirmish.js';
import {wanderersAt} from '../src/core/tavern.js';
import {transact,ensureEconomy,discountAt,shopPrice} from '../src/core/economy.js';
import {terrainCost} from '../src/core/rules.js';
import {growthOf} from '../src/core/stats8.js';
import {heroDef} from '../src/data/game-data.js';
import {HERO_LORE} from '../src/data/hero-lore.js';
import {MISSIONS} from '../src/data/missions.js';
import {VILLAGES,REQUESTS} from '../src/data/villages-v210.js';
import {SITES} from '../src/data/world.js';
import {TOOLS} from '../src/data/frontier-data.js';
import {MERC_EPILOGUE,MERC_TALK} from '../src/data/mercs-v210.js';
import {drain,playCampaignBattle} from './campaign-policy.mjs';
const fixture=JSON.parse(fs.readFileSync(new URL('./fixtures/v092/v092-m20-camp.json',import.meta.url),'utf8'));
// the v0.9.2 camp before M20: M16 and M18 are won, so both ACT III villages are open
const camp=()=>{const s=deserialize(fixture.save||fixture);s.economy.gold=s.campaign.economy.gold=3000;return s;};
const tx=(s,op,id)=>transact(s,{op,id,token:`tx:${ensureEconomy(s).nonce}`});
const sortie=s=>['eric','elina','lia','sain','kai','thea','dario','ines'].filter(id=>s.campaign.roster?.includes(id)||['eric','elina','lia','sain','kai'].includes(id)).slice(0,8);

test('M16 opens 등불골 and M18 opens 이끼다리 on the world map and in the revisit list',()=>{
 assert.deepEqual([VILLAGES.lamp.opens,VILLAGES.moss.opens],[16,18]);assert.deepEqual(['lamp','moss'].map(id=>SITES.find(x=>x.id===id).opens),[16,18]);
 const s=camp();const towns=revisitTowns(s).map(t=>t.hub);assert.ok(towns.includes('lamp')&&towns.includes('moss'),towns.join());
 assert.ok(travelTo(s,'lamp'));assert.equal(s.frontier.hub,'lamp');assert.ok(currentHub(s).npcs.some(n=>n.service==='requests'),'the request board');
 assert.deepEqual(requestsAt(s,'lamp').map(r=>r.id),['robbers','lanterns','lampoil','bountyCapital']);
 assert.ok(travelTo(s,'moss'));assert.deepEqual(requestsAt(s,'moss').map(r=>r.id),['herbalist','mossbridge','loggers','bountyForest']);
 assert.ok(deserialize(serialize(s)).frontier.hub==='moss','the visit survives a save');
});

test('「잿빛 안개 속 약초꾼」: hold seven turns and 마렌 joins — rogue, grows like a hero, swamp costs her 1, her lines, 열전 and epilogue',()=>{
 const s=camp();travelTo(s,'moss');let b,won=false;
 for(let t=0;t<3&&!won;t++){b=startRequest(s,'herbalist',sortie(s));assert.equal(b.missionId,133);assert.ok(b.units.some(u=>u.id==='marenc'&&u.team==='civilian'));b.rng=(b.rng+t*7919)>>>0;drain(b);playCampaignBattle(b);won=b.outcome==='victory';}
 assert.ok(won,b.reason);const c=returnToCamp(b);assert.equal(c.requestResult.joined,'maren');assert.ok(c.campaign.roster.includes('maren'));assert.equal(c.frontier.hub,'moss');
 assert.equal(heroDef('maren').name,'마렌');assert.ok(HERO_LORE.maren.bio.includes('이끼다리'));assert.equal(MERC_TALK.maren.length,3);assert.deepEqual(Object.keys(MERC_EPILOGUE.maren),['A','B','C']);
 assert.ok(growthOf({id:'maren',cls:'rogue'}).agi>growthOf({id:'ren',cls:'rogue'}).agi,'grows like a hero');
 const m=MISSIONS[133],[x,y]=[4,2];assert.equal(m.map[y][x],'s');const field={missionId:133,units:[]};
 assert.equal(terrainCost(field,{id:'maren',movementProfile:'rogue'},x,y),1);assert.ok(terrainCost(field,{id:'kai',movementProfile:'rogue'},x,y)>1,'other rogues pay the swamp');
 assert.ok(requestsAt(c,'moss').find(r=>r.id==='herbalist').done);deserialize(serialize(c));
});

test('「이끼다리 보수」: 300 G at the board, then 10% off at 이끼다리, 왕도 하층가 and 등불골 (not elsewhere); 얼음 다리 still in the north',()=>{
 const s=camp();travelTo(s,'moss');assert.equal(discountAt(s),1);const gold=s.economy.gold;const r=payRequest(s,'mossbridge');assert.ok(r.ok,r.error);assert.equal(s.economy.gold,gold-300);
 assert.equal(discountAt(s),.9);assert.equal(shopPrice(s,100),90);
 exitInterior(s,true);assert.ok(travelTo(s,'lamp'));assert.equal(discountAt(s),.9);s.economy.items={};s.campaign.economy.items={};const before=s.economy.gold,t=tx(s,'buy-item','medium');assert.ok(t.ok,t.error);assert.equal(before-s.economy.gold,Math.round(TOOLS.medium.price*.9));
 s.frontier.hub='castletown';assert.equal(discountAt(s),1,'the north is 얼음 다리\'s');s.economy.requests=[...s.economy.requests,'icebridge'];assert.equal(discountAt(s),.9);
 s.frontier.hub='velmar';assert.equal(discountAt(s),1);
});

test('등불골: 「등유 나르기」 takes an ether; the tavern takes in 세라, 오린 or 셀린 one per story win from M16',()=>{
 const s=camp();assert.ok(travelTo(s,'lamp'));s.economy.items.ether=0;s.campaign.economy.items.ether=0;assert.equal(payRequest(s,'lampoil').ok,false,'needs an ether');
 s.economy.items={ether:1};s.campaign.economy.items={ether:1};const gold=s.economy.gold,r=payRequest(s,'lampoil');assert.ok(r.ok,r.error);assert.equal(s.economy.gold,gold+150);assert.equal(s.economy.items.ward,1);
 const won16=s.campaign.completed.filter(id=>id>=16&&id<=30).length;assert.deepEqual(wanderersAt(s.campaign,'lamp'),['sera','orin','celine'].filter(id=>!s.campaign.roster.includes(id)).slice(0,won16));
});

test('every ACT III request battle is winnable by the test policy; the bounties open again after the next story win',()=>{
 for(const [id,v] of [['robbers','lamp'],['lanterns','lamp'],['bountyCapital','lamp'],['loggers','moss'],['bountyForest','moss']]){
  const s=camp();travelTo(s,v);let won=false;for(let t=0;t<3&&!won;t++){const b=startRequest(s,id,sortie(s));b.rng=(b.rng+t*7919)>>>0;drain(b);playCampaignBattle(b);won=b.outcome==='victory';if(won){const c=returnToCamp(b);assert.ok(requestsAt(c,v).find(r=>r.id===id).done,id);}}
  assert.ok(won,`${id} won within three tries`);}
 const s=camp();const k=s.campaign.completed.filter(id=>id<=30).length;s.economy.requests=[...(s.economy.requests||[]),`bountyCapital:${k}`];travelTo(s,'lamp');
 assert.ok(requestsAt(s,'lamp').find(r=>r.id==='bountyCapital').done);s.campaign.completed.push(20);assert.ok(!requestsAt(s,'lamp').find(r=>r.id==='bountyCapital').done);
 assert.deepEqual(Object.keys(REQUESTS).filter(id=>REQUESTS[id].mission>=131).map(id=>REQUESTS[id].mission),[131,132,133,134,135,136]);
});
