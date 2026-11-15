// v0.9.2 → v0.9.3 save compatibility with real schema-14 saves made by the released v0.9.2 source
// (tests/fixtures/v092/make-v092-fixtures.mjs, worktree of 78f30f0 — v0.9.2 with art pack F3). Schema 14 imports into
// schema 15 with nothing changed; the lower city after M20 (the end of v0.9.2) continues to M21 (the crown's heart) with
// three orders, 「함께 정한다」 waits for Aren's awakening, the hero records start at zero, and the mid-M20 battle resumes and is
// won under v0.9.3 rules (zone of control included).
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {SCHEMA,VERSION} from '../src/data/game-data.js';
import {nextMission,deployLimit,startBattle} from '../src/core/game.js';
import {enterHub} from '../src/core/frontier.js';
import {commandsFor,togetherOpen} from '../src/core/command.js';
import {playCampaignBattle,drain} from './campaign-policy.mjs';
const fixture=name=>JSON.parse(fs.readFileSync(new URL(`./fixtures/v092/v092-${name}.json`,import.meta.url),'utf8'));
const raw=name=>JSON.parse(JSON.parse(fixture(name).save).data);
const load=name=>deserialize(fixture(name).save);

test('fixtures are genuine v0.9.2 schema-14 saves after ACT III part 3',()=>{for(const n of ['m20-camp','m20-battle']){const f=fixture(n);assert.equal(f.version,'0.9.2');assert.equal(f.schema,14);}
 const c=raw('m20-camp').campaign;assert.ok(c.completed.includes(20));assert.equal(c.choices.m20_superior,'trial');assert.equal(c.choices.m20_plan,'send');assert.equal(raw('m20-camp').frontier.hub,'capital');assert.equal(c.records,undefined);});

test('the v0.9.2 lower city loads as schema 17 with every asset kept',()=>{
 const before=raw('m20-camp'),s=load('m20-camp');assert.equal(s.schema,SCHEMA);assert.equal(SCHEMA,17);assert.equal(s.version,VERSION);assert.equal(VERSION,'0.10.1');assert.equal(s.frontier.hub,'capital');
 for(const k of ['completed','flags','choices','promotions','factionTrust','trustLog','roster','feats','departed','economy','heroes','bonds','tacticalMemory'])assert.deepEqual(s.campaign[k],before.campaign[k],k);
 assert.deepEqual(s.economy,before.economy);const back=deserialize(serialize(s));assert.deepEqual(back.campaign.economy,before.campaign.economy);
});

test('ACT III goes on from the lower city: M21 in the crown\'s heart, seven heroes, three orders; 「함께 정한다」 waits for M21',()=>{
 const s=load('m20-camp');const n=nextMission(s);assert.equal(n.missionId,21);assert.equal(n.practice,false);assert.equal(deployLimit(n),7);assert.deepEqual(commandsFor(n),['hold','advance','leaveNoOne']);
 enterHub(n);assert.equal(n.frontier.hub,'capital');n.screen='deployment';startBattle(n);drain(n);assert.ok(!togetherOpen(n),'Aren has not awakened yet');
 assert.ok(n.units.some(u=>u.id==='king'));assert.equal(n.units.filter(u=>u.kind==='anchorStone').length,4);const back=deserialize(serialize(n));assert.equal(back.missionId,21);
});

test('the v0.9.2 mid-M20 battle resumes unchanged and is won under v0.9.3 rules; the win starts the hero records',()=>{
 const before=raw('m20-battle'),s=load('m20-battle');assert.equal(s.missionId,20);assert.equal(s.screen,'battle');assert.deepEqual(s.units.map(u=>[u.id,u.x,u.y,u.hp]),before.units.map(u=>[u.id,u.x,u.y,u.hp]));
 drain(s);playCampaignBattle(s);assert.equal(s.outcome,'victory',s.reason);assert.ok(s.campaign.records?.eric?.sorties===1,'the first counted sortie');
});
