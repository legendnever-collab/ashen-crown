// v0.6.1 → v0.7.0 save compatibility with real schema-9 saves made by the released v0.6.1 source
// (tests/fixtures/v061/make-v061-fixtures.mjs, worktree of the v0.6.1 merge dcafb73). Schema 9 is unchanged;
// a save of an earlier build of it loads as the current version and continues south to the pilgrim village.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
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
 const before=raw('m10-camp'),s=load('m10-camp');assert.equal(s.schema,SCHEMA);assert.equal(s.version,VERSION);assert.equal(VERSION,'0.7.0');
 assert.equal(s.frontier.hub,'velmar');assert.equal(s.frontier.phase,'aftermath');assert.deepEqual(s.campaign.roster,['thea','dario']);
 for(const k of ['completed','economy','flags','choices','promotions','factionTrust','trustLog'])assert.deepEqual(s.campaign[k],before.campaign[k],k);
 assert.equal(deserialize(serialize(s)).version,VERSION);
});

test('that camp continues south to M11 in the pilgrim village: the third banner on the map, Thea and Dario in town, Ines waiting',()=>{
 const s=load('m10-camp');s.outcome='victory';const n=nextMission(s);assert.equal(n.missionId,11);assert.equal(n.practice,false);
 enterHub(n);assert.equal(n.frontier.hub,'pilgrim');assert.ok(n.narrative.events.includes('world:pilgrim'));const ids=currentHub(n).npcs.map(x=>x.id);
 assert.ok(['thea','dario','ines'].every(id=>ids.includes(id)),ids.join());assert.ok(!metFactions(n.campaign).includes('flame'),'met in battle, not yet');
 n.screen='deployment';const out=n.units.filter(u=>u.team==='ally'&&!u.benched);assert.equal(out.length,deployLimit(n));assert.ok(startBattle(n));drain(n);
 assert.ok(findUnit(n,'ines_warden')&&findUnit(n,'br1'));playCampaignBattle(n);assert.equal(n.outcome,'victory');
});

test('the v0.6.1 mid-M10 battle (mediation) resumes unchanged and is won under v0.7.0 rules',()=>{
 const before=raw('m10-battle'),s=load('m10-battle');assert.equal(s.screen,'battle');assert.equal(s.missionId,10);assert.equal(s.version,VERSION);assert.equal(s.campaign.choices.m10_stance,'mediate');
 for(const u of before.units){const now=findUnit(s,u.id);assert.deepEqual([now.x,now.y,now.hp,now.team],[u.x,u.y,u.hp,u.team],u.id);}
 drain(s);playCampaignBattle(s);assert.equal(s.outcome,'victory');
});
