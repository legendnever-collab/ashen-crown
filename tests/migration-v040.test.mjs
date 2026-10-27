// v0.4.0 → v0.5.0 save compatibility with real schema-7 saves made by the released v0.4.0 source
// (tests/fixtures/v040/make-v040-fixtures.mjs, worktree of the v0.4.0 merge f922a18).
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {SCHEMA,VERSION} from '../src/data/game-data.js';
import {findUnit} from '../src/core/rules.js';
import {promotionStatus,potentialOf,proficiencyOf,act1Complete} from '../src/core/progression.js';
import {playCampaignBattle} from './campaign-policy.mjs';

const fixture=name=>JSON.parse(fs.readFileSync(new URL(`./fixtures/v040/v040-${name}.json`,import.meta.url),'utf8'));
const raw=name=>JSON.parse(JSON.parse(fixture(name).save).data);
const load=name=>deserialize(fixture(name).save);

test('fixtures are genuine v0.4.0 schema-7 saves',()=>{for(const n of ['act1-complete','m05-battle']){const f=fixture(n);assert.equal(f.version,'0.4.0');assert.equal(f.schema,7);assert.equal(raw(n).campaign.promotions,undefined);}});

test('ACT I complete camp loads as schema 8 with every asset kept and promotion state readable',()=>{
 const before=raw('act1-complete'),s=load('act1-complete');assert.equal(s.schema,SCHEMA);assert.equal(s.version,VERSION);assert.deepEqual(s.campaign.promotions,{});
 assert.equal(s.screen,'exploration');assert.equal(s.frontier.phase,'aftermath');assert.deepEqual(s.campaign.completed,before.campaign.completed);
 assert.deepEqual(s.campaign.economy,before.campaign.economy);assert.deepEqual(s.campaign.flags,before.campaign.flags);assert.deepEqual(s.campaign.choices,before.campaign.choices);assert.deepEqual(s.campaign.tacticalMemory,before.campaign.tacticalMemory);
 for(const h of before.campaign.heroes){const now=s.campaign.heroes.find(x=>x.id===h.id);assert.equal(now.classTier??1,1);for(const k of ['level','xp','maxHP','atk','def','mag','res','spd'])assert.equal(now[k],h[k],`${h.id}.${k}`);}
 assert.ok(act1Complete(s));for(const id of ['eric','elina','lia','sain','kai']){const st=promotionStatus(s,id);assert.equal(st.checks.length,3);assert.ok(st.checks[0].ok,'ACT I check passes');
  assert.equal(st.potential.step,potentialOf(s.campaign,s.campaign.heroes.find(h=>h.id===id)).step);assert.ok(proficiencyOf(s.campaign,id).stars>=0);}
 assert.equal(deserialize(serialize(s)).schema,10);
});

test('M05 mid-battle save resumes and can be won under v0.5.0 rules',()=>{
 const before=raw('m05-battle'),s=load('m05-battle');assert.equal(s.screen,'battle');assert.equal(s.missionId,5);assert.equal(s.stageStart.schema,10);
 for(const u of before.units){const now=findUnit(s,u.id);assert.deepEqual([now.x,now.y,now.hp],[u.x,u.y,u.hp],u.id);}
 playCampaignBattle(s,true);assert.equal(s.outcome,'victory');
});
