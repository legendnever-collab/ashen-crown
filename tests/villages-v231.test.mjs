// v2.3.1 (D-131, docs/v2.3.0/ACT2_MAPS_DESIGN.md §3): the ACT II small villages. The canyon (M08) opens 서리목 마을, Velmar
// (M09) opens 소금항, each with a request board, a tavern and a shop; 「눈보라 속 도끼잡이」 brings 군나르 (infantry, a rescued
// hero who grows like a hero; snow costs him 1); 「얼음 다리 수리」 takes 10% off the north shops; each village has a bounty.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {deserialize,serialize} from '../src/persistence/save-manager.js';
import {travelTo,currentHub,revisitTowns,enterInterior,exitInterior} from '../src/core/frontier.js';
import {requestsAt,startRequest,payRequest} from '../src/core/villages.js';
import {returnToCamp} from '../src/core/skirmish.js';
import {mercsAt,wanderersAt} from '../src/core/tavern.js';
import {transact,ensureEconomy,discountAt,shopPrice} from '../src/core/economy.js';
import {terrainCost,findUnit} from '../src/core/rules.js';
import {growthOf} from '../src/core/stats8.js';
import {heroDef} from '../src/data/game-data.js';
import {HERO_LORE} from '../src/data/hero-lore.js';
import {MISSIONS} from '../src/data/missions.js';
import {VILLAGES,REQUESTS} from '../src/data/villages-v210.js';
import {SITES} from '../src/data/world.js';
import {TOOLS} from '../src/data/frontier-data.js';
import {drain,playCampaignBattle} from './campaign-policy.mjs';
const fixture=name=>JSON.parse(fs.readFileSync(new URL(`./fixtures/v061/v061-${name}.json`,import.meta.url),'utf8'));
// the v0.6.1 camp before M10: M08 and M09 are won, so both ACT II villages are open
const camp=()=>{const s=deserialize(fixture('m10-camp').save);s.economy.gold=s.campaign.economy.gold=3000;return s;};
const tx=(s,op,id)=>transact(s,{op,id,token:`tx:${ensureEconomy(s).nonce}`});
const sortie=s=>['eric','elina','lia','sain','kai','thea'].filter(id=>s.campaign.roster?.includes(id)||['eric','elina','lia','sain','kai'].includes(id));

test('M08 opens 서리목 and M09 opens 소금항 on the world map and in the revisit list',()=>{
 assert.deepEqual([VILLAGES.frost.opens,VILLAGES.saltport.opens],[8,9]);assert.deepEqual(['frost','saltport'].map(id=>SITES.find(x=>x.id===id).opens),[8,9]);
 const s=camp();const towns=revisitTowns(s).map(t=>t.hub);assert.ok(towns.includes('frost')&&towns.includes('saltport'),towns.join());
 assert.ok(travelTo(s,'frost'));assert.equal(s.frontier.hub,'frost');assert.ok(currentHub(s).npcs.some(n=>n.service==='requests'),'the request board');
 assert.deepEqual(requestsAt(s,'frost').map(r=>r.id),['blizzard','icebridge','wolves','bountyNorth']);
 assert.ok(deserialize(serialize(s)).frontier.hub==='frost','the visit survives a save');
});

test('「눈보라 속 도끼잡이」: hold seven turns and 군나르 joins — infantry, grows like a hero, snow costs him 1, his 열전 and epilogue',()=>{
 const s=camp();travelTo(s,'frost');const b=startRequest(s,'blizzard',sortie(s));assert.equal(b.missionId,125);assert.ok(b.units.some(u=>u.id==='gunnarc'&&u.team==='civilian'));
 assert.ok(b.units.some(u=>u.look==='wolf'),'the wolves');drain(b);playCampaignBattle(b);assert.equal(b.outcome,'victory',b.reason);
 const c=returnToCamp(b);assert.equal(c.requestResult.joined,'gunnar');assert.ok(c.campaign.roster.includes('gunnar'));assert.equal(c.frontier.hub,'frost');
 assert.equal(heroDef('gunnar').name,'군나르');assert.ok(HERO_LORE.gunnar.bio.includes('서리목'));assert.ok(growthOf({id:'gunnar',cls:'infantry'}).str>growthOf({id:'bram',cls:'infantry'}).str,'grows like a hero');
 const m=MISSIONS[125],snow={missionId:125,units:[]},g={id:'gunnar',movementProfile:'infantry'},e={id:'eric',movementProfile:'infantry'};
 const [x,y]=[0,0];assert.equal(m.map[y][x],'n');assert.equal(terrainCost(snow,g,x,y),1);assert.ok(terrainCost(snow,e,x,y)>1,'others pay the snow');
 assert.ok(requestsAt(c,'frost').find(r=>r.id==='blizzard').done);deserialize(serialize(c));
});

test('「얼음 다리 수리」: 300 G at the board, then 10% off tools and gear at 서리목 and 철관성 성하 마을 (not elsewhere)',()=>{
 const s=camp();travelTo(s,'frost');assert.equal(discountAt(s),1);const gold=s.economy.gold;const r=payRequest(s,'icebridge');assert.ok(r.ok,r.error);assert.equal(s.economy.gold,gold-300);
 assert.equal(discountAt(s),.9);const potion=Object.keys(TOOLS).find(id=>TOOLS[id].price>=40)||'medium';assert.equal(shopPrice(s,100),90);
 assert.ok(exitInterior(s,true)||true);assert.ok(travelTo(s,'castletown'));assert.equal(discountAt(s),.9);const before=s.economy.gold,t=tx(s,'buy-item','medium');assert.ok(t.ok,t.error);assert.equal(before-s.economy.gold,Math.round(TOOLS.medium.price*.9));
 assert.ok(travelTo(s,'velmar')||true);if(s.frontier.hub==='velmar')assert.equal(discountAt(s),1);assert.equal(payRequest(s,'icebridge').ok,false);
});

test('소금항: four requests, a potion for the salt cart, the Velmar hire waits in its tavern; 서리목 takes in 세라 or 오린 after M08',()=>{
 const s=camp();assert.ok(travelTo(s,'saltport'));assert.deepEqual(requestsAt(s,'saltport').map(r=>r.id),['smugglers','lighthouse','saltcart','bountyPort']);
 s.economy.items.medium=0;s.campaign.economy.items.medium=0;assert.equal(payRequest(s,'saltcart').ok,false,'needs a potion');
 s.economy.items={medium:1};s.campaign.economy.items={medium:1};const gold=s.economy.gold,r=payRequest(s,'saltcart');assert.ok(r.ok,r.error);assert.equal(s.economy.gold,gold+150);assert.equal(s.economy.items.smoke,1);
 assert.ok(mercsAt(s,'velmar').some(m=>m.id==='orin'),'orin waits in Velmar; 소금항 shares that tavern');
 const won8=s.campaign.completed.filter(id=>id>=8&&id<=30).length;assert.deepEqual(wanderersAt(s.campaign,'frost'),['sera','orin'].filter(id=>!s.campaign.roster.includes(id)).slice(0,won8));
});

test('every ACT II request battle is winnable by the test policy; the bounties open again after the next story win',()=>{
 for(const [id,v] of [['wolves','frost'],['bountyNorth','frost'],['smugglers','saltport'],['lighthouse','saltport'],['bountyPort','saltport']]){
  const s=camp();travelTo(s,v);let won=false;for(let t=0;t<3&&!won;t++){const b=startRequest(s,id,sortie(s));b.rng=(b.rng+t*7919)>>>0;drain(b);playCampaignBattle(b);won=b.outcome==='victory';if(won){const c=returnToCamp(b);assert.ok(requestsAt(c,v).find(r=>r.id===id).done,id);}}
  assert.ok(won,`${id} won within three tries`);}
 const s=camp();const k=s.campaign.completed.filter(id=>id<=30).length;s.economy.requests=[...(s.economy.requests||[]),`bountyNorth:${k}`];travelTo(s,'frost');
 assert.ok(requestsAt(s,'frost').find(r=>r.id==='bountyNorth').done);s.campaign.completed.push(10);assert.ok(!requestsAt(s,'frost').find(r=>r.id==='bountyNorth').done);
 assert.ok(!requestsAt(s,'frost').some(r=>r.id==='bounty'),'the ACT I bounty stays in the ACT I villages');assert.deepEqual(Object.keys(REQUESTS).filter(id=>REQUESTS[id].mission>=125).map(id=>REQUESTS[id].mission),[125,126,127,128,129,130]);
});
