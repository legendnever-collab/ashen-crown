// v0.9.0 → v0.9.1 save compatibility with real schema-12 saves made by the released v0.9.0 source
// (tests/fixtures/v090/make-v090-fixtures.mjs, worktree of the v0.9.0 merge 45d5c0a). Schema 12 imports into schema 13 with
// nothing changed; the field camp after M16 (the end of v0.9.0) continues to M17 at the guardians' keep with both of Aren's
// commands, Elina's awakening trial opens there, and the mid-M16 battle resumes and is won under v0.9.1 rules.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {SCHEMA,VERSION} from '../src/data/game-data.js';
import {nextMission,deployLimit} from '../src/core/game.js';
import {enterHub} from '../src/core/frontier.js';
import {promotionStatus} from '../src/core/progression.js';
import {commandsFor} from '../src/core/command.js';
import {playCampaignBattle,drain} from './campaign-policy.mjs';
const fixture=name=>JSON.parse(fs.readFileSync(new URL(`./fixtures/v090/v090-${name}.json`,import.meta.url),'utf8'));
const raw=name=>JSON.parse(JSON.parse(fixture(name).save).data);
const load=name=>deserialize(fixture(name).save);

test('fixtures are genuine v0.9.0 schema-12 saves after ACT III part 1',()=>{for(const n of ['m16-camp','m16-battle']){const f=fixture(n);assert.equal(f.version,'0.9.0');assert.equal(f.schema,12);}
 assert.ok(raw('m16-camp').campaign.completed.includes(16));assert.equal(raw('m16-camp').campaign.choices.m16_stones,'break');assert.equal(raw('m16-camp').frontier.hub,'fieldcamp');});

test('the v0.9.0 field camp loads as schema 13 with every asset kept',()=>{
 const before=raw('m16-camp'),s=load('m16-camp');assert.equal(s.schema,SCHEMA);assert.equal(SCHEMA,16);assert.equal(s.version,VERSION);assert.equal(s.frontier.hub,'fieldcamp');
 for(const k of ['completed','flags','choices','promotions','factionTrust','trustLog','roster','feats','departed','economy','heroes','bonds','tacticalMemory'])assert.deepEqual(s.campaign[k],before.campaign[k],k);
 assert.deepEqual(s.economy,before.economy);const back=deserialize(serialize(s));assert.deepEqual(back.campaign.economy,before.campaign.economy);
});

test('ACT III goes on from the field camp: M17 at the guardians\' keep, seven heroes, 「지켜라」 and 「나아가라」',()=>{
 const s=load('m16-camp');const n=nextMission(s);assert.equal(n.missionId,17);assert.equal(n.practice,false);assert.equal(deployLimit(n),7);assert.deepEqual(commandsFor(n),['hold','advance']);assert.equal(n.command,'advance');
 enterHub(n);assert.equal(n.frontier.hub,'keep');assert.ok(n.narrative.queue.includes('world:keep')||n.narrative.active?.key==='world:keep');
 const back=deserialize(serialize(n));assert.equal(back.missionId,17);
 const el=s.campaign.heroes.find(h=>h.id==='elina');const st=promotionStatus(s,'elina');assert.equal(st.next?.tier??(el.classTier||1)+1,(el.classTier||1)+1,'Elina\'s next step is read from her own tier');
});

test('the v0.9.0 mid-M16 battle resumes unchanged and is won under v0.9.1 rules',()=>{
 const before=raw('m16-battle'),s=load('m16-battle');assert.equal(s.missionId,16);assert.equal(s.screen,'battle');assert.deepEqual(s.units.map(u=>[u.id,u.x,u.y,u.hp]),before.units.map(u=>[u.id,u.x,u.y,u.hp]));
 drain(s);playCampaignBattle(s);assert.equal(s.outcome,'victory',s.reason);
});
