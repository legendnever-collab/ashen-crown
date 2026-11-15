// v0.8.1 → v0.9.0 save compatibility with real schema-11 saves made by the released v0.8.1 source
// (tests/fixtures/v081/make-v081-fixtures.mjs, worktree of the v0.8.1 merge 534a25d). Schema 11 imports into schema 13 with
// nothing changed; the summit camp after M14 (the end of v0.8.1) continues into ACT III — M15 in the capital's lower city,
// a sortie of seven and Aren's 「지켜라」 — and the mid-M14 battle resumes and is won under v0.9.0 rules.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {SCHEMA,VERSION} from '../src/data/game-data.js';
import {nextMission,deployLimit} from '../src/core/game.js';
import {enterHub} from '../src/core/frontier.js';
import {playCampaignBattle,drain} from './campaign-policy.mjs';
const fixture=name=>JSON.parse(fs.readFileSync(new URL(`./fixtures/v081/v081-${name}.json`,import.meta.url),'utf8'));
const raw=name=>JSON.parse(JSON.parse(fixture(name).save).data);
const load=name=>deserialize(fixture(name).save);

test('fixtures are genuine v0.8.1 schema-11 saves with star gear',()=>{for(const n of ['m14-camp','m14-battle']){const f=fixture(n);assert.equal(f.version,'0.8.1');assert.equal(f.schema,11);assert.ok(raw(n).campaign.economy.gear.some(g=>g.type==='ironBlade'&&g.star===2));}});

test('the v0.8.1 summit camp loads as schema 13 with every asset kept',()=>{
 const before=raw('m14-camp'),s=load('m14-camp');assert.equal(s.schema,SCHEMA);assert.equal(SCHEMA,17);assert.equal(s.version,VERSION);assert.equal(s.frontier.hub,'summit');
 for(const k of ['completed','flags','choices','promotions','factionTrust','trustLog','roster','feats','departed','economy','heroes','bonds','tacticalMemory'])assert.deepEqual(s.campaign[k],before.campaign[k],k);
 assert.deepEqual(s.economy,before.economy);const back=deserialize(serialize(s));assert.deepEqual(back.campaign.economy,before.campaign.economy);
});

test('ACT III continues from the summit camp: M15 in the capital, seven heroes, Aren\'s 「지켜라」, the ACT III card',()=>{
 const s=load('m14-camp');const n=nextMission(s);assert.equal(n.missionId,15);assert.equal(n.practice,false);assert.equal(deployLimit(n),7);assert.equal(n.command,'hold');
 enterHub(n);assert.equal(n.frontier.hub,'capital');assert.ok(n.narrative.queue.includes('world:capital')||n.narrative.active?.key==='world:capital');
 const back=deserialize(serialize(n));assert.equal(back.missionId,15);
});

test('the v0.8.1 mid-M14 battle resumes unchanged and is won under v0.9.0 rules',()=>{
 const before=raw('m14-battle'),s=load('m14-battle');assert.equal(s.missionId,14);assert.equal(s.screen,'battle');assert.deepEqual(s.units.map(u=>[u.id,u.x,u.y,u.hp]),before.units.map(u=>[u.id,u.x,u.y,u.hp]));
 drain(s);playCampaignBattle(s);assert.equal(s.outcome,'victory',s.reason);
});
