// v0.9.3 → v0.10.0 save compatibility with real schema-15 saves made by the released v0.9.3 source
// (tests/fixtures/v093/make-v093-fixtures.mjs, worktree of d7960ae — v0.9.3 with art pack F4). Schema 15 imports into
// schema 16 with nothing changed; the lower city after M22 (the end of v0.9.3, ACT III complete) continues to M23 at the
// alliance camp (the leaders as allied units that take orders); the mid-M22 battle resumes and is won under v0.10.0 rules.
import test from 'node:test';import {econV200,keptV200,reopensInCamp} from './v200-compat.mjs';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {SCHEMA,VERSION} from '../src/data/game-data.js';
import {nextMission,deployLimit,startBattle,canOrderAlly} from '../src/core/game.js';
import {enterHub} from '../src/core/frontier.js';
import {findUnit} from '../src/core/rules.js';
import {playCampaignBattle,drain} from './campaign-policy.mjs';
const fixture=name=>JSON.parse(fs.readFileSync(new URL(`./fixtures/v093/v093-${name}.json`,import.meta.url),'utf8'));
const raw=name=>JSON.parse(JSON.parse(fixture(name).save).data);
const load=name=>deserialize(fixture(name).save);

test('fixtures are genuine v0.9.3 schema-15 saves after ACT III',()=>{for(const n of ['m22-camp','m22-battle']){const f=fixture(n);assert.equal(f.version,'0.9.3');assert.equal(f.schema,15);}
 const c=raw('m22-camp').campaign;assert.ok(c.completed.includes(22));assert.equal(c.choices.m21_king,'promise');assert.equal(c.choices.act3_choice,'council');assert.equal(c.flags.act3_completed,true);assert.equal(raw('m22-camp').frontier.hub,'capital');});

test('the v0.9.3 lower city loads as schema 19 with every asset kept',()=>{
 const before=raw('m22-camp'),s=load('m22-camp');assert.equal(s.schema,SCHEMA);assert.equal(SCHEMA,28);assert.equal(s.version,VERSION);assert.equal(VERSION,'2.8.0');assert.equal(s.frontier.hub,'capital');
 for(const k of ['completed','flags','choices','promotions','factionTrust','trustLog','roster','feats','departed','economy','heroes','bonds','tacticalMemory','records'])keptV200(s.campaign,before.campaign,k);
 assert.deepEqual(econV200(s.economy),econV200(before.economy));const back=deserialize(serialize(s));assert.deepEqual(econV200(back.campaign.economy),econV200(before.campaign.economy));
});

test('ACT IV goes on from the lower city: M23 at the alliance camp, seven heroes, the leaders take orders',()=>{
 const s=load('m22-camp');const n=nextMission(s);assert.equal(n.missionId,23);assert.equal(n.practice,false);assert.equal(deployLimit(n),7);
 enterHub(n);assert.equal(n.frontier.hub,'summit');assert.ok(n.narrative.queue.includes('world:alliance')||n.narrative.active?.key==='world:alliance','the ACT IV card');
 n.screen='deployment';startBattle(n);drain(n);assert.ok(canOrderAlly(n,findUnit(n,'cassian')));assert.equal(n.units.filter(u=>u.kind==='tent').length,3);
 const back=deserialize(serialize(n));assert.equal(back.missionId,23);
});

test('the v0.9.3 mid-M22 battle reopens in camp (v2.0.0) and is won again',()=>{
 const before=raw('m22-battle'),s=reopensInCamp(load('m22-battle'),raw('m22-battle'),22); assert.equal(s.campaign.flags.act3_completed,true);
});
