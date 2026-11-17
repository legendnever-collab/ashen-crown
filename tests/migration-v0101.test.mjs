// v0.10.1 → v0.10.2 save compatibility with real schema-17 saves made by the released v0.10.1 source
// (tests/fixtures/v0101/make-v0101-fixtures.mjs, worktree of 6adba79 — the v0.10.1 merge). Schema 17 imports into schema 18
// with nothing changed; the oath camp after M26 (the end of v0.10.1, Baldrick in the legion) continues to M27 at the
// capital's southern gate from the lower city with a sortie of eight out of nine; the mid-M26 battle resumes and is won.
import test from 'node:test';import {OFFICER_IDS} from '../src/core/stats8.js';import {econV200,keptV200,reopensInCamp} from './v200-compat.mjs';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {SCHEMA,VERSION} from '../src/data/game-data.js';
import {nextMission,deployLimit,startBattle} from '../src/core/game.js';
import {enterHub} from '../src/core/frontier.js';
import {findUnit} from '../src/core/rules.js';
import {playCampaignBattle,drain} from './campaign-policy.mjs';
const fixture=name=>JSON.parse(fs.readFileSync(new URL(`./fixtures/v0101/v0101-${name}.json`,import.meta.url),'utf8'));
const raw=name=>JSON.parse(JSON.parse(fixture(name).save).data);
const load=name=>deserialize(fixture(name).save);

test('fixtures are genuine v0.10.1 schema-17 saves after ACT IV part 2, with Baldrick in the legion',()=>{for(const n of ['m26-camp','m26-battle']){const f=fixture(n);assert.equal(f.version,'0.10.1');assert.equal(f.schema,17);}
 const c=raw('m26-camp').campaign;assert.ok(c.completed.includes(26));assert.equal(c.choices.m25_banner,'forgive');assert.equal(c.flags.mission_26_baldrick,'join');assert.ok(c.roster.includes('baldrick'));assert.equal(raw('m26-camp').frontier.hub,'oathcamp');});

test('the v0.10.1 oath camp loads as schema 19 with every asset kept',()=>{
 const before=raw('m26-camp'),s=load('m26-camp');assert.equal(s.schema,SCHEMA);assert.equal(SCHEMA,21);assert.equal(s.version,VERSION);assert.equal(VERSION,'2.1.0');assert.equal(s.frontier.hub,'oathcamp');
 for(const k of ['completed','flags','choices','promotions','factionTrust','trustLog','roster','feats','departed','economy','heroes','bonds','tacticalMemory','records'])keptV200(s.campaign,before.campaign,k);
 assert.deepEqual(econV200(s.economy),econV200(before.economy));const back=deserialize(serialize(s));assert.deepEqual(econV200(back.campaign.economy),econV200(before.campaign.economy));
});

test('ACT IV goes on from the oath camp: M27 from the lower city, eight of nine heroes, the banner squads',()=>{
 const s=load('m26-camp');const n=nextMission(s);assert.equal(n.missionId,27);assert.equal(n.practice,false);assert.equal(deployLimit(n),8);
 enterHub(n);assert.equal(n.frontier.hub,'capital');assert.ok(n.narrative.queue.includes('world:royalgate')||n.narrative.active?.key==='world:royalgate','the world card');
 n.screen='deployment';const heroes=n.units.filter(u=>u.team==='ally'&&!OFFICER_IDS.includes(u.id));assert.equal(heroes.length,9);assert.equal(heroes.filter(u=>!u.benched).length,8);assert.ok(n.units.filter(u=>OFFICER_IDS.includes(u.id)).every(u=>u.benched),'v2.0.0: the four officers wait on the bench');assert.ok(findUnit(n,'baldrick'));
 startBattle(n);drain(n);assert.ok(findUnit(n,'ram'));assert.equal(n.missionState.lion,false,'Baldrick joined, so he is no ally rider');
 const back=deserialize(serialize(n));assert.equal(back.missionId,27);
});

test('the v0.10.1 mid-M26 battle reopens in camp (v2.0.0) and is won again',()=>{
 const before=raw('m26-battle'),s=reopensInCamp(load('m26-battle'),raw('m26-battle'),26); assert.ok(['join','cooperate','withdraw'].includes(s.missionState.outcome));
});
