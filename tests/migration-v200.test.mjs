// v1.0.0 → v2.0.0 save compatibility (D-115, REFORM_DESIGN §8) with real schema-19 saves made by the v1.0.0 release
// candidate (tests/fixtures/v100/make-v100-fixtures.mjs, worktree of feature/v1.0.0-crown 306f3e3). Schema 20 keeps the
// campaign and recomputes the heroes from the six stats; ACT I camps move onto the big maps; a battle reopens in camp.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {econV200,keptV200,reopensInCamp,winsWithinRetries} from './v200-compat.mjs';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {SCHEMA,VERSION} from '../src/data/game-data.js';
import {MISSIONS} from '../src/data/missions.js';
import {findUnit,terrainAt} from '../src/core/rules.js';
import {OFFICER_IDS,derivedFrom,classKeyOf} from '../src/core/stats8.js';
import {START_TREASURES} from '../src/core/economy.js';
import {GEAR} from '../src/data/frontier-data.js';
import {drain} from './campaign-policy.mjs';

const fixture=name=>JSON.parse(fs.readFileSync(new URL(`./fixtures/v100/v100-${name}.json`,import.meta.url),'utf8'));
const raw=name=>JSON.parse(JSON.parse(fixture(name).save).data);
const load=name=>deserialize(fixture(name).save);

test('fixtures are genuine v1.0.0 schema-19 saves',()=>{for(const n of ['m02-camp','m05-battle','m30-ending']){const f=fixture(n);assert.equal(f.version,'1.0.0');assert.equal(f.schema,19);assert.equal(raw(n).schema,19);}});

test('the camp before M02 loads as the current schema on the new 28×14 forest road, every asset kept, the start treasures added',()=>{
 const before=raw('m02-camp'),s=load('m02-camp');assert.equal(s.schema,SCHEMA);assert.equal(SCHEMA,25);assert.equal(s.version,VERSION);assert.equal(VERSION,'2.4.1');
 assert.equal(s.screen,'exploration');assert.equal(s.missionId,2);assert.equal(s.campaign.difficulty,'normal');
 for(const k of ['completed','flags','choices','heroes','roster'])keptV200(s.campaign,before.campaign,k);keptV200(s.campaign,before.campaign,'economy');
 assert.deepEqual(OFFICER_IDS.filter(id=>s.campaign.roster.includes(id)),[],'v2.1: no officer joins by itself — they are tavern hires');
 const e=s.campaign.economy,crest=e.gear.find(g=>g.type===START_TREASURES.eric),tome=e.gear.find(g=>g.type===START_TREASURES.lia);assert.ok(crest&&tome);assert.equal(e.equipped.eric.treasure,crest.id);assert.equal(e.equipped.lia.treasure,tome.id);
 for(const h of s.campaign.heroes){assert.ok(h.stats&&h.cls,h.id);const d=derivedFrom(classKeyOf(h),h.stats,h.level);assert.equal(h.maxHP,d.maxHP,h.id);assert.equal(h.atk,d.atk,h.id);}
 const m=MISSIONS[2];assert.equal(m.width,28);for(const u of s.units.filter(u=>u.team==='ally'&&!u.benched))assert.ok(Number.isFinite(terrainAt(u.x,u.y,s)?.cost),`${u.id} stands on open ground`);
 assert.deepEqual(deserialize(serialize(s)).campaign,s.campaign,'round trip');
 const won=winsWithinRetries(s);assert.ok(won.campaign.completed.includes(2),'M02 is fought on the new map and won');
});

test('the M05 battle in progress reopens in the camp before M05; the campaign is intact and M05 is won again',()=>{
 const before=raw('m05-battle'),s=reopensInCamp(load('m05-battle'),before,5);assert.ok(s.campaign.completed.includes(5));
});

test('the finished campaign (dawn after M30, ending B) carries over whole: thirty missions, the ending, nine heroes (v2.1: officers are hired in taverns)',()=>{
 const before=raw('m30-ending'),s=load('m30-ending');assert.equal(s.schema,SCHEMA);assert.equal(s.screen,'exploration');assert.equal(s.missionId,30);
 assert.equal(s.campaign.completed.length,30);assert.equal(s.campaign.choices.ending,'B');assert.equal(s.campaign.flags.act4_completed,true);
 for(const k of ['completed','flags','choices','promotions','factionTrust','heroes','roster'])keptV200(s.campaign,before.campaign,k);keptV200(s.campaign,before.campaign,'economy');
 assert.deepEqual(s.campaign.roster,['thea','dario','ines','baldrick'],'v2.1: the heroes only — officers are tavern hires');
 for(const h of before.campaign.heroes){const now=s.campaign.heroes.find(x=>x.id===h.id);assert.equal(now.level,h.level,h.id);assert.equal(now.classTier??1,h.classTier??1,h.id);assert.ok(now.stats,h.id);}
 // a piece a hero's class can no longer hold is taken off and kept in the bag (§4.2), never lost
 const e=s.campaign.economy;for(const [hero,slots] of Object.entries(e.equipped))for(const gid of Object.values(slots).filter(Boolean)){const g=e.gear.find(x=>x.id===gid);assert.ok(g,`${hero} ${gid}`);assert.ok(GEAR[g.type].heroes.includes(hero),`${hero} may hold ${g.type}`);}
 assert.equal(e.gear.length,before.campaign.economy.gear.length+2,'every piece kept, plus the two start treasures');
 drain(s);assert.deepEqual(deserialize(serialize(s)).campaign,s.campaign,'round trip');
});
