// v0.6.0 → v0.6.1 save compatibility with real schema-9 saves made by the released v0.6.0 source
// (tests/fixtures/v060/make-v060-fixtures.mjs, worktree of the v0.6.0 merge 28bce95). Schema 9 is unchanged;
// a save of an earlier build of it now loads as the current version.
import test from 'node:test';import {econV200} from './v200-compat.mjs';import {OFFICER_IDS} from '../src/core/stats8.js';import {reopensInCamp} from './v200-compat.mjs';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize,arms081View} from '../src/persistence/save-manager.js';
import {SCHEMA,VERSION} from '../src/data/game-data.js';
import {findUnit} from '../src/core/rules.js';
import {nextMission,startBattle,deployLimit} from '../src/core/game.js';
import {enterHub,currentHub} from '../src/core/frontier.js';
import {playCampaignBattle,drain} from './campaign-policy.mjs';
const fixture=name=>JSON.parse(fs.readFileSync(new URL(`./fixtures/v060/v060-${name}.json`,import.meta.url),'utf8'));
const raw=name=>JSON.parse(JSON.parse(fixture(name).save).data);
const load=name=>deserialize(fixture(name).save);

test('fixtures are genuine v0.6.0 schema-9 saves',()=>{for(const n of ['m08-camp','m08-battle']){const f=fixture(n);assert.equal(f.version,'0.6.0');assert.equal(f.schema,9);assert.equal(raw(n).version,'0.6.0');}});

test('the v0.6.0 end-of-content camp (canyon bivouac, Thea joined) loads as the current version with every asset kept',()=>{
 const before=raw('m08-camp'),s=load('m08-camp');assert.equal(s.schema,SCHEMA);assert.equal(s.version,VERSION);
 assert.equal(s.frontier.hub,'march');assert.equal(s.frontier.phase,'aftermath');assert.deepEqual(s.campaign.roster.filter(id=>!OFFICER_IDS.includes(id)),['thea']);assert.deepEqual(s.campaign.roster.filter(id=>OFFICER_IDS.includes(id)),[],'v2.1: no officer joins by itself (tavern hires)');
 for(const k of ['completed','economy','flags','choices','promotions','factionTrust','trustLog'])k==='economy'?assert.deepEqual(econV200(s.campaign[k]),econV200(arms081View(before.campaign[k])),k):assert.deepEqual(s.campaign[k],before.campaign[k],k);
 assert.equal(deserialize(serialize(s)).version,VERSION);
});

test('that camp continues to M09 in Velmar with Thea in the town and in the sortie of six',()=>{
 const s=load('m08-camp');s.outcome='victory';const n=nextMission(s);assert.equal(n.missionId,9);assert.equal(n.practice,false);
 enterHub(n);assert.equal(n.frontier.hub,'velmar');assert.ok(n.narrative.events.includes('world:velmar'));assert.ok(currentHub(n).npcs.some(x=>x.id==='thea'));
 n.screen='deployment';const out=n.units.filter(u=>u.team==='ally'&&!u.benched);assert.equal(out.length,deployLimit(n));assert.ok(out.some(u=>u.id==='thea'));assert.ok(startBattle(n));
});

test('the v0.6.0 mid-M08 battle reopens in camp (v2.0.0) and is won again',()=>{
 const before=raw('m08-battle'),s=reopensInCamp(load('m08-battle'),raw('m08-battle'),8);
});
