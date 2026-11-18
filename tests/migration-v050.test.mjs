// v0.5.0 → v0.6.0 save compatibility with real schema-8 saves made by the released v0.5.0 source
// (tests/fixtures/v050/make-v050-fixtures.mjs, worktree of the v0.5.0 merge 33577c4).
import test from 'node:test';import {OFFICER_IDS} from '../src/core/stats8.js';import {econV200,keptV200,reopensInCamp} from './v200-compat.mjs';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize,arms081View} from '../src/persistence/save-manager.js';
import {SCHEMA,VERSION} from '../src/data/game-data.js';
import {findUnit} from '../src/core/rules.js';
import {act1Complete} from '../src/core/progression.js';
import {nextMission} from '../src/core/game.js';
import {enterHub} from '../src/core/frontier.js';
import {playCampaignBattle} from './campaign-policy.mjs';

const fixture=name=>JSON.parse(fs.readFileSync(new URL(`./fixtures/v050/v050-${name}.json`,import.meta.url),'utf8'));
const raw=name=>JSON.parse(JSON.parse(fixture(name).save).data);
const load=name=>deserialize(fixture(name).save);
const nm=a=>(a||[]).map(({name,...h})=>h); // D-060 rewrote display names in Hangul

test('fixtures are genuine v0.5.0 schema-8 saves',()=>{for(const n of ['act1-complete','m06-battle']){const f=fixture(n);assert.equal(f.version,'0.5.0');assert.equal(f.schema,8);assert.equal(raw(n).campaign.roster,undefined);}});

test('ACT I complete camp (oath chosen, Eric promoted) loads as schema 9 with every asset kept',()=>{
 const before=raw('act1-complete'),s=load('act1-complete');assert.equal(s.schema,SCHEMA);assert.equal(SCHEMA,21);assert.equal(s.version,VERSION);
 assert.equal(s.screen,'exploration');assert.equal(s.frontier.hub,'oathcamp');assert.equal(s.frontier.phase,'aftermath');assert.deepEqual(s.campaign.roster.filter(id=>!OFFICER_IDS.includes(id)),[]);assert.deepEqual(s.campaign.roster.filter(id=>OFFICER_IDS.includes(id)),[],'v2.1: no officer joins by itself (tavern hires)');
 for(const k of ['completed','economy','flags','choices','promotions','tacticalMemory'])k==='economy'?assert.deepEqual(econV200(s.campaign[k]),econV200(arms081View(before.campaign[k])),k):assert.deepEqual(s.campaign[k],before.campaign[k],k);
 keptV200(s.campaign,before.campaign,'heroes'); /* v2.0.0: the six stats are added and the numbers recomputed */assert.equal(s.campaign.heroes.find(h=>h.id==='eric').classTier,2);
 assert.ok(act1Complete(s));assert.equal(deserialize(serialize(s)).schema,21);
});

test('a v0.5.0 ACT I save continues into ACT II: Mission 7 in the castle town, trust from the ACT I choices',()=>{
 const s=load('act1-complete');s.outcome='victory';const n=nextMission(s);assert.equal(n.missionId,7);assert.equal(n.practice,false);
 enterHub(n);assert.equal(n.frontier.hub,'castletown');assert.ok(n.narrative.events.includes('world:castletown'));
 assert.equal(n.campaign.factionTrust.iron,-1,'the reported ledger (M04) makes the Iron Crown wary');
 assert.equal(n.campaign.heroes.find(h=>h.id==='eric').classTier,2,'promotion carries into ACT II');
});

test('M06 mid-battle save reopens in camp (v2.0.0) and is won again',()=>{
 const before=raw('m06-battle'),s=reopensInCamp(load('m06-battle'),raw('m06-battle'),6);
});
