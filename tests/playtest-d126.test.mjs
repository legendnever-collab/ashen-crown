// v2.2.1 play-test (D-126, 2026-11-19 18:03): rogues move one tile less, heals restore half, M06's seal guards hold
// their posts and M03/M04 are a little lighter to make up for the harder play. The range tiles drawn above buildings are
// checked in the browser (docs/v2.2.1/screenshots/range-*.png).
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {CLASSES8} from '../src/data/classes8.js';
import {HEAL_SCALE,healAmount} from '../src/core/rules.js';
import {V200_MISSIONS} from '../src/data/missions-v200.js';
import {BASE_MUL,BASE_MUL_AT} from '../src/core/stats8.js';
test('rogues: MOV 4 (was 5); still cost 1 on every terrain and free of zones of control',()=>{
 assert.equal(CLASSES8.rogue.base.mov,4);assert.equal(CLASSES8.rogue.base.profile,'rogue');
 for(const [k,c] of Object.entries(CLASSES8))if(k!=='rogue'&&k!=='cavalry')assert.ok(c.base.mov<=4,k);
 assert.match(fs.readFileSync('src/core/rules.js','utf8'),/ZOC_FREE=new Set\(\['rogue'\]\)/);
});
test('heals restore half of the old amount, at least 1',()=>{
 assert.equal(HEAL_SCALE,.5);const s={};
 assert.equal(healAmount(s,{healPow:30}),15);assert.equal(healAmount(s,{healPow:31}),16);assert.equal(healAmount(s,{healPow:1}),1);assert.equal(healAmount(s,{healPow:0}),1);
 assert.equal(healAmount(s,{healPow:20,heal:6}),13);
});
test('M06: the four royal seal guards hold their posts; enemy strength retuned for M03, M04, M06, M15 and M17',()=>{
 const k=V200_MISSIONS[6].enemies.filter(e=>/^k[1-4]$/.test(e.id));assert.equal(k.length,4);for(const e of k)assert.equal(e.mov,0,e.id);
 assert.equal(BASE_MUL,1.08);assert.deepEqual(BASE_MUL_AT,{3:.95,4:.97,6:1.02,15:.88,16:1,17:.97,22:1}); /* v2.3.1 (D-131): M15 ×0.88 */
});
