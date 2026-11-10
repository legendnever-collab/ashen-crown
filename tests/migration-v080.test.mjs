// v0.8.0 → v0.8.1 save compatibility with real schema-10 saves made by the released v0.8.0 source
// (tests/fixtures/v080/make-v080-fixtures.mjs, worktree of the v0.8.0 merge 7b8b2e8). Schema 10 imports into schema 11: a +1
// sword becomes ★2 with the same numbers, plain gear ★1, every hero gains an empty treasure slot, nothing else changes;
// the summit camp can revisit the towns, and the mid-M14 battle resumes and is won under v0.8.1 rules.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize,arms081View} from '../src/persistence/save-manager.js';
import {SCHEMA,VERSION} from '../src/data/game-data.js';
import {findUnit} from '../src/core/rules.js';
import {effectiveStats} from '../src/core/economy.js';
import {revisitTowns,travelTo} from '../src/core/frontier.js';
import {playCampaignBattle,drain} from './campaign-policy.mjs';
const fixture=name=>JSON.parse(fs.readFileSync(new URL(`./fixtures/v080/v080-${name}.json`,import.meta.url),'utf8'));
const raw=name=>JSON.parse(JSON.parse(fixture(name).save).data);
const load=name=>deserialize(fixture(name).save);

test('fixtures are genuine v0.8.0 schema-10 saves with a +1 sword',()=>{for(const n of ['m14-camp','m14-battle']){const f=fixture(n);assert.equal(f.version,'0.8.0');assert.equal(f.schema,10);assert.ok(raw(n).campaign.economy.gear.some(g=>g.type==='ironBlade'&&g.level===1));}});

test('the v0.8.0 summit camp loads as schema 11: +1 → ★2 with the same stats, a treasure slot for all, every other asset kept',()=>{
 const before=raw('m14-camp'),s=load('m14-camp');assert.equal(s.schema,SCHEMA);assert.equal(SCHEMA,16);assert.equal(s.version,VERSION);assert.equal(s.frontier.hub,'summit');
 for(const k of ['completed','flags','choices','promotions','factionTrust','trustLog','roster'])assert.deepEqual(s.campaign[k],before.campaign[k],k);
 assert.deepEqual(s.campaign.economy,arms081View(before.campaign.economy));assert.deepEqual(s.campaign.feats,[]);
 const sword=s.campaign.economy.gear.find(g=>g.type==='ironBlade');assert.deepEqual([sword.star,sword.exp],[2,30]);assert.ok(s.campaign.economy.gear.filter(g=>g.type!=='ironBlade').every(g=>g.star===1&&g.exp===0));
 for(const slots of Object.values(s.campaign.economy.equipped))assert.equal(slots.treasure,null);
 assert.equal(deserialize(serialize(s)).schema,16);
});

test('the same Erik hits as hard as in v0.8.0: ★2 = the old +1',()=>{const s=load('m14-camp'),eric=findUnit(s,'eric'),e=s.campaign.economy;const own=e.equipped.eric.weapon&&e.gear.find(g=>g.id===e.equipped.eric.weapon);if(own?.type==='ironBlade')assert.equal(effectiveStats(s,eric).atk,eric.atk+3);});

test('from the summit camp the legion can revisit the four towns and buy what they now sell',()=>{
 const s=load('m14-camp');assert.deepEqual(revisitTowns(s).map(t=>t.hub),['village_raid','castletown','velmar','pilgrim']);assert.ok(travelTo(s,'pilgrim'));assert.equal(s.frontier.revisit,'summit');assert.equal(deserialize(serialize(s)).frontier.hub,'pilgrim');
});

test('the v0.8.0 mid-M14 battle resumes unchanged and is won under v0.8.1 rules',()=>{
 const before=raw('m14-battle'),s=load('m14-battle');assert.equal(s.screen,'battle');assert.equal(s.missionId,14);assert.equal(s.stageStart.schema,16);assert.deepEqual(s.battleFlags,{});
 for(const u of before.units){const now=findUnit(s,u.id);assert.deepEqual([now.x,now.y,now.hp,now.team],[u.x,u.y,u.hp,u.team],u.id);}
 assert.deepEqual(s.economy.items,before.economy.items);drain(s);playCampaignBattle(s);assert.equal(s.outcome,'victory');
});
