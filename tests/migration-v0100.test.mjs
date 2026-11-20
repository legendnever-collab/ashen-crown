// v0.10.0 → v0.10.1 save compatibility with real schema-16 saves made by the released v0.10.0 source
// (tests/fixtures/v0100/make-v0100-fixtures.mjs, worktree of dd81b3e — the v0.10.0 merge). Schema 16 imports into schema 18
// with nothing changed; the Ashen Village after M24 (the end of v0.10.0) continues to M25 at the summit field of the three
// banners; the mid-M24 battle resumes and is won under v0.10.1 rules.
import test from 'node:test';import {econV200,keptV200,reopensInCamp} from './v200-compat.mjs';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {SCHEMA,VERSION} from '../src/data/game-data.js';
import {nextMission,deployLimit,startBattle,canOrderAlly} from '../src/core/game.js';
import {enterHub} from '../src/core/frontier.js';
import {findUnit} from '../src/core/rules.js';
import {playCampaignBattle,drain} from './campaign-policy.mjs';
const fixture=name=>JSON.parse(fs.readFileSync(new URL(`./fixtures/v0100/v0100-${name}.json`,import.meta.url),'utf8'));
const raw=name=>JSON.parse(JSON.parse(fixture(name).save).data);
const load=name=>deserialize(fixture(name).save);

test('fixtures are genuine v0.10.0 schema-16 saves after ACT IV part 1',()=>{for(const n of ['m24-camp','m24-battle']){const f=fixture(n);assert.equal(f.version,'0.10.0');assert.equal(f.schema,16);}
 const c=raw('m24-camp').campaign;assert.ok(c.completed.includes(24));assert.equal(c.choices.m23_lead,'banners');assert.ok(Number.isInteger(c.flags.mission_24_gate_turn));assert.equal(raw('m24-camp').frontier.hub,'village_raid');});

test('the v0.10.0 Ashen Village loads as schema 19 with every asset kept',()=>{
 const before=raw('m24-camp'),s=load('m24-camp');assert.equal(s.schema,SCHEMA);assert.equal(SCHEMA,23);assert.equal(s.version,VERSION);assert.equal(VERSION,'2.3.1');assert.equal(s.frontier.hub,'village_raid');
 for(const k of ['completed','flags','choices','promotions','factionTrust','trustLog','roster','feats','departed','economy','heroes','bonds','tacticalMemory','records','choices'])keptV200(s.campaign,before.campaign,k);
 assert.deepEqual(econV200(s.economy),econV200(before.economy));const back=deserialize(serialize(s));assert.deepEqual(econV200(back.campaign.economy),econV200(before.campaign.economy));
});

test('ACT IV goes on from the Ashen Village: M25 at the summit field, seven heroes, the three camps',()=>{
 const s=load('m24-camp');const n=nextMission(s);assert.equal(n.missionId,25);assert.equal(n.practice,false);assert.equal(deployLimit(n),7);
 enterHub(n);assert.equal(n.frontier.hub,'summit');assert.ok(n.narrative.queue.includes('world:banners')||n.narrative.active?.key==='world:banners','the world card');
 n.screen='deployment';startBattle(n);drain(n);assert.equal(n.missionState.camps.north,s.campaign.flags.mission_14_betrayer);assert.ok(findUnit(n,'hc')&&findUnit(n,'lw')&&findUnit(n,'le'));
 const back=deserialize(serialize(n));assert.equal(back.missionId,25);
});

test('the v0.10.0 mid-M24 battle reopens in camp (v2.0.0) and is won again',()=>{
 const before=raw('m24-battle'),s=reopensInCamp(load('m24-battle'),raw('m24-battle'),24); assert.ok(Number.isInteger(s.campaign.flags.mission_24_gate_turn));
});
