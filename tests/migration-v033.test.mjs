// v0.3.3 → v0.4.0 save compatibility, using real schema-6 saves produced by the tagged v0.3.3 source
// (tests/fixtures/v033/make-v033-fixtures.mjs). Nothing here is hand-written save data.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize,saveGame,loadGame,SAVE_KEY} from '../src/persistence/save-manager.js';
import {nextMission,startBattle} from '../src/core/game.js';
import {enterHub} from '../src/core/frontier.js';
import {SCHEMA,VERSION} from '../src/data/game-data.js';
import {findUnit} from '../src/core/rules.js';
import {playCampaignBattle,drain} from './campaign-policy.mjs';

const fixture=name=>JSON.parse(fs.readFileSync(new URL(`./fixtures/v033/v033-${name}.json`,import.meta.url),'utf8'));
const raw=name=>JSON.parse(JSON.parse(fixture(name).save).data);
const load=name=>deserialize(fixture(name).save);
const memory=()=>{const m=new Map();return {getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)};};

test('fixtures are genuine v0.3.3 schema-6 saves',()=>{
 for(const n of ['camp-m01','m02-battle','m03-aftermath']){const f=fixture(n),s=raw(n);assert.equal(f.version,'0.3.3');assert.equal(f.schema,6);assert.equal(s.schema,6);assert.equal(s.version,'0.3.3');assert.equal(s.campaign.choices,undefined,n);}
});

test('every v0.3.3 save loads in v0.4.0, gains the schema-7 fields and round-trips',()=>{
 for(const n of ['camp-m01','m02-battle','m03-aftermath']){const s=load(n);assert.equal(s.schema,SCHEMA);assert.equal(s.version,VERSION);assert.deepEqual(s.campaign.choices,{});
  const again=deserialize(serialize(s));assert.deepEqual(again,{...s,feedback:[]},n);}
});

test('M01 village save: same screen, mission and starting purse',()=>{
 const before=raw('camp-m01'),s=load('camp-m01');assert.equal(s.screen,'exploration');assert.equal(s.missionId,1);assert.deepEqual(s.campaign.completed,[]);
 assert.equal(s.campaign.economy.gold,before.campaign.economy.gold);assert.equal(s.frontier.hub,before.frontier.hub);assert.deepEqual([s.frontier.x,s.frontier.y],[before.frontier.x,before.frontier.y]);
});

test('M02 mid-battle save: board, HP, turn and stage checkpoint survive; the battle can still be won',()=>{
 const before=raw('m02-battle'),s=load('m02-battle');assert.equal(s.screen,'battle');assert.equal(s.missionId,2);assert.equal(s.turn,before.turn);assert.equal(s.stageStart.schema,SCHEMA);
 for(const u of before.units){const now=findUnit(s,u.id);assert.ok(now,u.id);assert.deepEqual([now.x,now.y,now.hp,now.moved,now.acted],[u.x,u.y,u.hp,u.moved,u.acted],u.id);}
 assert.equal(s.campaign.economy.items.medium,before.campaign.economy.items.medium);
 playCampaignBattle(s,true);assert.equal(s.outcome,'victory');assert.ok(s.campaign.completed.includes(2));
});

test('M03 aftermath save: growth, gear, items, gold and story flags kept; the campaign continues into M04',()=>{
 const before=raw('m03-aftermath'),s=load('m03-aftermath');assert.deepEqual(s.campaign.completed,[1,2,3]);assert.equal(s.frontier.phase,'aftermath');
 assert.equal(s.campaign.economy.gold,before.campaign.economy.gold);assert.deepEqual(s.campaign.economy.items,before.campaign.economy.items);
 assert.deepEqual(s.campaign.economy.equipped,before.campaign.economy.equipped);assert.deepEqual(s.campaign.economy.gear,before.campaign.economy.gear);
 assert.deepEqual(s.campaign.economy.rewards,before.campaign.economy.rewards,'no reward is granted twice by the migration');
 for(const h of before.campaign.heroes){const now=s.campaign.heroes.find(x=>x.id===h.id);for(const k of ['level','xp','maxHP','atk','def','mag','res','spd'])assert.equal(now[k],h[k],`${h.id}.${k}`);}
 for(const [k,v]of Object.entries(before.campaign.flags))assert.equal(s.campaign.flags[k],v,k);
 const m4=nextMission(s);assert.ok(m4,'M04 opens from a v0.3.3 aftermath save');assert.equal(m4.missionId,4);enterHub(m4);drain(m4);assert.equal(m4.screen,'exploration');
 assert.equal(m4.campaign.economy.gold,before.campaign.economy.gold);assert.equal(findUnit(m4,'eric').level,before.campaign.heroes.find(h=>h.id==='eric').level);
 m4.screen='deployment';assert.ok(startBattle(m4));playCampaignBattle(m4,true);assert.equal(m4.outcome,'victory');assert.ok(m4.campaign.completed.includes(4));
 assert.ok(m4.campaign.economy.gold>before.campaign.economy.gold,'M04 victory pays on top of the migrated purse');
});

test('storage path: a v0.3.3 save in localStorage loads, and the first v0.4.0 save keeps it as backup',()=>{
 const st=memory();st.setItem(SAVE_KEY,fixture('m03-aftermath').save);const {state,warning}=loadGame(st);assert.equal(warning,undefined);assert.equal(state.schema,SCHEMA);
 assert.ok(saveGame(state,st).ok);assert.equal(deserialize(st.getItem(SAVE_KEY)).schema,SCHEMA);
});
