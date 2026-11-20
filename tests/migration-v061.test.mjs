// v0.6.1 → v0.7.0 save compatibility with real schema-9 saves made by the released v0.6.1 source
// (tests/fixtures/v061/make-v061-fixtures.mjs, worktree of the v0.6.1 merge dcafb73). Schema 9 is unchanged;
// a save of an earlier build of it loads as the current version and continues south to the pilgrim village.
import test from 'node:test';import {winsWithinRetries} from './v200-compat.mjs';import {econV200} from './v200-compat.mjs';import {OFFICER_IDS} from '../src/core/stats8.js';import {reopensInCamp} from './v200-compat.mjs';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize,arms081View} from '../src/persistence/save-manager.js';
import {SCHEMA,VERSION} from '../src/data/game-data.js';
import {findUnit} from '../src/core/rules.js';
import {nextMission,startBattle,deployLimit} from '../src/core/game.js';
import {enterHub,currentHub} from '../src/core/frontier.js';
import {metFactions} from '../src/core/factions.js';
import {playCampaignBattle,drain} from './campaign-policy.mjs';
const fixture=name=>JSON.parse(fs.readFileSync(new URL(`./fixtures/v061/v061-${name}.json`,import.meta.url),'utf8'));
const raw=name=>JSON.parse(JSON.parse(fixture(name).save).data);
const load=name=>deserialize(fixture(name).save);

test('fixtures are genuine v0.6.1 schema-9 saves',()=>{for(const n of ['m10-camp','m10-battle']){const f=fixture(n);assert.equal(f.version,'0.6.1');assert.equal(f.schema,9);assert.equal(raw(n).version,'0.6.1');}});

test('the v0.6.1 end-of-content camp (Velmar after M10, Thea and Dario joined) loads as the current version with every asset kept',()=>{
 const before=raw('m10-camp'),s=load('m10-camp');assert.equal(s.schema,SCHEMA);assert.equal(s.version,VERSION);
 assert.equal(s.frontier.hub,'velmar');assert.equal(s.frontier.phase,'aftermath');assert.deepEqual(s.campaign.roster.filter(id=>!OFFICER_IDS.includes(id)),['thea','dario']);assert.deepEqual(s.campaign.roster.filter(id=>OFFICER_IDS.includes(id)),[],'v2.1: no officer joins by itself (tavern hires)');
 for(const k of ['completed','economy','flags','choices','promotions','factionTrust','trustLog'])k==='economy'?assert.deepEqual(econV200(s.campaign[k]),econV200(arms081View(before.campaign[k])),k):assert.deepEqual(s.campaign[k],before.campaign[k],k);
 assert.equal(deserialize(serialize(s)).version,VERSION);
});

test('that camp continues south to M11 in the pilgrim village: the third banner on the map, Thea and Dario in town, Ines waiting',()=>{
 const s=load('m10-camp');s.outcome='victory';const n=nextMission(s);assert.equal(n.missionId,11);assert.equal(n.practice,false);
 enterHub(n);assert.equal(n.frontier.hub,'pilgrim');assert.ok(n.narrative.events.includes('world:pilgrim'));const ids=currentHub(n).npcs.map(x=>x.id);
 assert.ok(['thea','dario','ines'].every(id=>ids.includes(id)),ids.join());assert.ok(!metFactions(n.campaign).includes('flame'),'met in battle, not yet');
 n.screen='deployment';const out=n.units.filter(u=>u.team==='ally'&&!u.benched);assert.equal(out.length,deployLimit(n));const b=structuredClone(n);assert.ok(startBattle(b));drain(b);
 assert.ok(findUnit(b,'ines_warden')&&findUnit(b,'br1'));winsWithinRetries(n); // v2.3.1: the big switchback, won like a player within three tries
});

test('the v0.6.1 mid-M10 battle (mediation) reopens in camp (v2.0.0) and is won again',()=>{
 const before=raw('m10-battle'),s=reopensInCamp(load('m10-battle'),raw('m10-battle'),10);
});
