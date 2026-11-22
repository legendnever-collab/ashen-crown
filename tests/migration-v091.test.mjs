// v0.9.1 → v0.9.2 save compatibility with real schema-13 saves made by the released v0.9.1 source
// (tests/fixtures/v091/make-v091-fixtures.mjs, worktree of the v0.9.1 merge 184536a). Schema 13 imports into schema 14 with
// nothing changed; the forest village after M18 (the end of v0.9.1) continues to M19 in the capital's lower city with
// 「한 사람도 두고 가지 않는다」, Lia's awakening waits for M19, and the mid-M18 battle resumes and is won under v0.9.2 rules.
import test from 'node:test';import {econV200,keptV200,reopensInCamp} from './v200-compat.mjs';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {SCHEMA,VERSION} from '../src/data/game-data.js';
import {nextMission,deployLimit} from '../src/core/game.js';
import {enterHub} from '../src/core/frontier.js';
import {promotionStatus} from '../src/core/progression.js';
import {commandsFor} from '../src/core/command.js';
import {playCampaignBattle,drain} from './campaign-policy.mjs';
const fixture=name=>JSON.parse(fs.readFileSync(new URL(`./fixtures/v091/v091-${name}.json`,import.meta.url),'utf8'));
const raw=name=>JSON.parse(JSON.parse(fixture(name).save).data);
const load=name=>deserialize(fixture(name).save);

test('fixtures are genuine v0.9.1 schema-13 saves after ACT III part 2',()=>{for(const n of ['m18-camp','m18-battle']){const f=fixture(n);assert.equal(f.version,'0.9.1');assert.equal(f.schema,13);}
 assert.ok(raw('m18-camp').campaign.completed.includes(18));assert.equal(raw('m18-camp').campaign.choices.m18_truth,'tell');assert.equal(raw('m18-camp').frontier.hub,'forest');});

test('the v0.9.1 forest village loads as schema 14 with every asset kept',()=>{
 const before=raw('m18-camp'),s=load('m18-camp');assert.equal(s.schema,SCHEMA);assert.equal(SCHEMA,27);assert.equal(s.version,VERSION);assert.equal(VERSION,'2.5.1');assert.equal(s.frontier.hub,'forest');
 for(const k of ['completed','flags','choices','promotions','factionTrust','trustLog','roster','feats','departed','economy','heroes','bonds','tacticalMemory'])keptV200(s.campaign,before.campaign,k);
 assert.deepEqual(econV200(s.economy),econV200(before.economy));const back=deserialize(serialize(s));assert.deepEqual(econV200(back.campaign.economy),econV200(before.campaign.economy));
});

test('ACT III goes on from the forest: M19 in the lower city, seven heroes, three orders with 「한 사람도 두고 가지 않는다」 first',()=>{
 const s=load('m18-camp');const n=nextMission(s);assert.equal(n.missionId,19);assert.equal(n.practice,false);assert.equal(deployLimit(n),7);assert.deepEqual(commandsFor(n),['hold','advance','leaveNoOne']);assert.equal(n.command,'leaveNoOne');
 enterHub(n);assert.equal(n.frontier.hub,'capital');assert.ok(n.narrative.queue.includes('world:capital:return')||n.narrative.active?.key==='world:capital:return');
 const back=deserialize(serialize(n));assert.equal(back.missionId,19);
 const lia=promotionStatus(s,'lia');if(lia.next?.tier===3)assert.ok(!lia.eligible,'Lia waits for M19');
});

test('the v0.9.1 mid-M18 battle reopens in camp (v2.0.0) and is won again',()=>{
 const before=raw('m18-battle'),s=reopensInCamp(load('m18-battle'),raw('m18-battle'),18);
});
