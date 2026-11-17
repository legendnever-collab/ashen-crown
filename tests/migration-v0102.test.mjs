// v0.10.2 → v1.0.0 save compatibility with real schema-18 saves made by the released v0.10.2 source
// (tests/fixtures/v0102/make-v0102-fixtures.mjs, worktree of 3984064 — the v0.10.2 merge). Schema 18 imports into schema 19
// with nothing changed; the lower city after M28 (the end of v0.10.2, Aren's confession told to all, Baldrick in the legion)
// continues to M29 at the crown's heart with a sortie of eight out of nine; the mid-M28 battle resumes and is won.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {SCHEMA,VERSION} from '../src/data/game-data.js';
import {nextMission,deployLimit,startBattle} from '../src/core/game.js';
import {enterHub} from '../src/core/frontier.js';
import {findUnit} from '../src/core/rules.js';
import {MISSIONS} from '../src/data/missions.js';
import {playCampaignBattle,drain} from './campaign-policy.mjs';
const fixture=name=>JSON.parse(fs.readFileSync(new URL(`./fixtures/v0102/v0102-${name}.json`,import.meta.url),'utf8'));
const raw=name=>JSON.parse(JSON.parse(fixture(name).save).data);
const load=name=>deserialize(fixture(name).save);

test('fixtures are genuine v0.10.2 schema-18 saves after ACT IV part 3, with the confession told and Baldrick in the legion',()=>{for(const n of ['m28-camp','m28-battle']){const f=fixture(n);assert.equal(f.version,'0.10.2');assert.equal(f.schema,18);}
 const c=raw('m28-camp').campaign;assert.ok(c.completed.includes(28));assert.equal(c.choices.m28_confession,'all');assert.equal(c.choices.act3_choice,'council');assert.ok(c.roster.includes('baldrick'));assert.equal(raw('m28-camp').frontier.hub,'capital');assert.equal(c.ending,undefined);});

test('the v0.10.2 lower city loads as schema 19 with every asset kept',()=>{
 const before=raw('m28-camp'),s=load('m28-camp');assert.equal(s.schema,SCHEMA);assert.equal(SCHEMA,19);assert.equal(s.version,VERSION);assert.equal(VERSION,'1.0.0');assert.equal(s.frontier.hub,'capital');
 for(const k of ['completed','flags','choices','promotions','factionTrust','trustLog','roster','feats','departed','economy','heroes','bonds','tacticalMemory','records'])assert.deepEqual(s.campaign[k],before.campaign[k],k);
 assert.deepEqual(s.economy,before.economy);const back=deserialize(serialize(s));assert.deepEqual(back.campaign.economy,before.campaign.economy);
});

test('ACT IV goes on from the lower city: M29 at the crown\'s heart, eight of nine heroes, the rite points on the council path',()=>{
 const s=load('m28-camp');const n=nextMission(s);assert.equal(n.missionId,29);assert.equal(n.practice,false);assert.equal(deployLimit(n),8);
 enterHub(n);assert.equal(n.frontier.hub,'capital');n.screen='deployment';const heroes=n.units.filter(u=>u.team==='ally');assert.equal(heroes.length,9);assert.equal(heroes.filter(u=>!u.benched).length,8);assert.ok(findUnit(n,'baldrick'));
 startBattle(n);drain(n);assert.equal(n.missionState.path,'council');assert.deepEqual(['rp1','rp2','rp3'].map(id=>{const r=findUnit(n,id);return [r.x,r.y];}),MISSIONS[29].rites29.council);assert.equal(n.missionState.lion,false,'Baldrick joined, so he is no ally rider');
 const back=deserialize(serialize(n));assert.equal(back.missionId,29);
});

test('the v0.10.2 mid-M28 battle resumes unchanged and is won under v1.0.0 rules',()=>{
 const before=raw('m28-battle'),s=load('m28-battle');assert.equal(s.missionId,28);assert.equal(s.screen,'battle');assert.deepEqual(s.units.map(u=>[u.id,u.x,u.y,u.hp]),before.units.map(u=>[u.id,u.x,u.y,u.hp]));
 drain(s);playCampaignBattle(s);assert.equal(s.outcome,'victory',s.reason);assert.equal(s.missionState.found.length,3);
});
