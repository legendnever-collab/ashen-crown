// v2.2.0 — art pack I parts B–G (D-124): the duel window's sheets, finisher key art, five backdrops and the effect sheet are
// imported from hash-verified masters (scripts/import-duel-art-v220.py). Every duellist of every duel event has a sheet,
// every hero that can duel has a finisher, and every stage a backdrop.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import {artFile,artNames,imageSize} from './art-file.mjs';
import {DUEL_EVENTS} from '../src/data/duel-events-v210.js';import {DUEL_STAGE} from '../src/ui/duel-scene.js';

const log=fs.readFileSync('src/assets/duel-art-import-log.csv','utf8').trim().split(/\r?\n/).slice(1).map(l=>l.split(','));
const names=artNames('duel'); /* v2.2.1: AVIF now, checked through the conversion log (tests/art-file.mjs) */
test('pack I B–G: 36 duel images, each logged with its master hash, sizes as specified',()=>{
 assert.equal(names.length,36);for(const n of names)assert.ok(log.some(r=>r[4]===`${n}.webp`),n);
 for(const [id,,,psha,webp,bytes,wsha]of log){if(!names.includes(webp.replace(/\.webp$/,'')))continue;const art=artFile('duel',webp),b=art.bytes;if(art.format==='webp')assert.equal(b.length,+bytes,id);assert.equal(art.webpSha,wsha,id);assert.match(psha,/^[0-9a-f]{64}$/);
  const [w,h]=imageSize(b);
  assert.deepEqual([w,h],id.startsWith('duel_vfx')?[1024,1024]:id.startsWith('duel_')?[1536,768]:[1600,900],id);}
});
test('every duel event has both sheets, a finisher for each hero and a backdrop for its stage',()=>{
 const has=n=>names.includes(n);const foes={'duel:1:garr':'garr','duel:5:baldrick':'baldrick','duel:13:baldrick':'baldrick','duel:9:chief':'chief','duel:10:oswin':'oswin','duel:10:brennan':'brennan','duel:12:abbot':'abbot','duel:18:logger':'logger','duel:19:overseer':'overseer','duel:25:hardliner':'hardliner'};
 for(const [mid,list] of Object.entries(DUEL_EVENTS))for(const ev of list){assert.ok(has(`duelbg_${DUEL_STAGE[mid]}`),`stage of M${mid}`);if(foes[ev.key])assert.ok(has(`duel_${foes[ev.key]}`),ev.key);
  for(const h of ev.heroes){assert.ok(has(`duel_${h}`),`${ev.key} ${h}`);assert.ok(has(`finisher_${h}`)||!['eric','elina','lia','sain','kai','thea'].includes(h),`finisher ${h}`);}}
 for(const n of ['captain16','greyMaster','riteCommander','bellard','eric_t3','elina_t3','lia_t3','kai_t3','thea_t3','vfx'])assert.ok(has(`duel_${n}`),n);
 for(const st of new Set(Object.values(DUEL_STAGE)))assert.ok(has(`duelbg_${st}`),st);
});
