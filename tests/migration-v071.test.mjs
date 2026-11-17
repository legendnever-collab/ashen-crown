// v0.7.1 → v0.8.0 save compatibility with real schema-9 saves made by the released v0.7.1 source
// (tests/fixtures/v071/make-v071-fixtures.mjs, worktree of the v0.7.1 merge 762bc75). Schema 9 imports into schema 10
// unchanged; the end-of-content camp keeps every asset, the heroes now know their new skills, the bag takes new tools,
// and the mid-M14 battle resumes and is won under v0.8.0 rules.
import test from 'node:test';import {OFFICER_IDS} from '../src/core/stats8.js';import {econV200,keptV200,reopensInCamp} from './v200-compat.mjs';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize,arms081View} from '../src/persistence/save-manager.js';
import {SCHEMA,VERSION} from '../src/data/game-data.js';
import {findUnit} from '../src/core/rules.js';
import {transact,itemCount} from '../src/core/economy.js';
import {skillsOf} from '../src/data/skills.js';
import {toolStock} from '../src/data/frontier-data.js';
import {playCampaignBattle,drain} from './campaign-policy.mjs';
const fixture=name=>JSON.parse(fs.readFileSync(new URL(`./fixtures/v071/v071-${name}.json`,import.meta.url),'utf8'));
const raw=name=>JSON.parse(JSON.parse(fixture(name).save).data);
const load=name=>deserialize(fixture(name).save);

test('fixtures are genuine v0.7.1 schema-9 saves',()=>{for(const n of ['m14-camp','m14-battle']){const f=fixture(n);assert.equal(f.version,'0.7.1');assert.equal(f.schema,9);assert.equal(raw(n).version,'0.7.1');}});

test('the v0.7.1 end-of-content camp (summit after M14, ACT II complete) loads as schema 10 with every asset kept',()=>{
 const before=raw('m14-camp'),s=load('m14-camp');assert.equal(s.schema,SCHEMA);assert.equal(SCHEMA,20);assert.equal(s.version,VERSION);assert.equal(s.frontier.hub,'summit');
 for(const k of ['completed','flags','choices','promotions','factionTrust','trustLog','roster'])keptV200(s.campaign,before.campaign,k);assert.deepEqual(econV200(s.campaign.economy),econV200(arms081View(before.campaign.economy)),'economy');
 assert.ok(s.campaign.flags.act2_completed);assert.equal(deserialize(serialize(s)).schema,20);
});

test('the heroes of that save know their new skills; every tool is on sale; the bag holds eight',()=>{
 const s=load('m14-camp');for(const h of s.campaign.heroes.filter(h=>!OFFICER_IDS.includes(h.id))){const k=skillsOf({...h,team:'ally'});assert.ok(k[1].open,`${h.id} ② open at Lv ${h.level}`);}
 assert.deepEqual(toolStock(s.campaign).sort(),['antidote','bewilder','bomb','caltrops','clarity','drum','ether','herb','medium','net','smoke','ward']);
 s.economy.gold=1000;let tok=s.economy.nonce;const free=8-itemCount(s.economy);assert.ok(free>=2,`the save holds ${itemCount(s.economy)} tools`);for(const id of ['bomb','net','clarity','smoke','herb','antidote','ward','drum'].slice(0,free)){const r=transact(s,{op:'buy-item',id,token:`tx:${tok++}`});assert.ok(r.ok,`${id}: ${r.error}`);}assert.equal(itemCount(s.economy),8);
 assert.equal(transact(s,{op:'buy-item',id:'herb',token:`tx:${tok}`}).ok,false,'bag full at 8');assert.equal(deserialize(serialize(s)).economy.items.bomb,1);
});

test('the v0.7.1 mid-M14 battle reopens in camp (v2.0.0) and is won again',()=>{
 const before=raw('m14-battle'),s=reopensInCamp(load('m14-battle'),raw('m14-battle'),14);
});
