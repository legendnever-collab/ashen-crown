// v0.7.0 → v0.7.1 save compatibility with real schema-9 saves made by the released v0.7.0 source
// (tests/fixtures/v070/make-v070-fixtures.mjs, worktree of the v0.7.0 merge 81f11d3). Schema 9 is unchanged; a save of an
// earlier build loads as the current version and continues to M13 at the refugee camp.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {SCHEMA,VERSION} from '../src/data/game-data.js';
import {findUnit} from '../src/core/rules.js';
import {nextMission,startBattle,deployLimit} from '../src/core/game.js';
import {enterHub,currentHub} from '../src/core/frontier.js';
import {playCampaignBattle,drain} from './campaign-policy.mjs';
const fixture=name=>JSON.parse(fs.readFileSync(new URL(`./fixtures/v070/v070-${name}.json`,import.meta.url),'utf8'));
const raw=name=>JSON.parse(JSON.parse(fixture(name).save).data);
const load=name=>deserialize(fixture(name).save);

test('fixtures are genuine v0.7.0 schema-9 saves',()=>{for(const n of ['m12-camp','m12-battle']){const f=fixture(n);assert.equal(f.version,'0.7.0');assert.equal(f.schema,9);assert.equal(raw(n).version,'0.7.0');}});

test('the v0.7.0 end-of-content camp (refugee camp after M12, Ines joined) loads as the current version with every asset kept',()=>{
 const before=raw('m12-camp'),s=load('m12-camp');assert.equal(s.schema,SCHEMA);assert.equal(s.version,VERSION);
 assert.equal(s.frontier.hub,'refuge');assert.equal(s.frontier.phase,'aftermath');assert.deepEqual(s.campaign.roster,['thea','dario','ines']);
 for(const k of ['completed','economy','flags','choices','promotions','factionTrust','trustLog'])assert.deepEqual(s.campaign[k],before.campaign[k],k);
 assert.equal(deserialize(serialize(s)).version,VERSION);
});

test('that camp continues to M13 at the refugee camp; Baldrick\'s resolve starts from the saved choices; the battle is won',()=>{
 const s=load('m12-camp');s.outcome='victory';const n=nextMission(s);assert.equal(n.missionId,13);enterHub(n);assert.equal(n.frontier.hub,'refuge');
 const ids=currentHub(n).npcs.map(x=>x.id);assert.ok(['thea','dario','ines'].every(id=>ids.includes(id)),ids.join());
 n.screen='deployment';assert.equal(n.units.filter(u=>u.team==='ally'&&!u.benched).length,deployLimit(n));assert.ok(startBattle(n));drain(n);
 assert.deepEqual(n.missionState.sources,['m05','m08','iron']);playCampaignBattle(n);assert.equal(n.outcome,'victory');
});

test('the v0.7.0 mid-M12 battle resumes unchanged and is won under v0.7.1 rules',()=>{
 const before=raw('m12-battle'),s=load('m12-battle');assert.equal(s.screen,'battle');assert.equal(s.missionId,12);assert.equal(s.version,VERSION);
 for(const u of before.units){const now=findUnit(s,u.id);assert.deepEqual([now.x,now.y,now.hp,now.team],[u.x,u.y,u.hp,u.team],u.id);}
 drain(s);playCampaignBattle(s);assert.equal(s.outcome,'victory');
});
