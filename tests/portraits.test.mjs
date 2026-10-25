import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
// Painted portrait pack r2: 7 ids × 4 expressions, hashes match the delivered manifest, WebP with alpha.
test('painted portraits: 28 WebP files match the pack manifest and cover every id/expression',()=>{
 const rows=fs.readFileSync('src/assets/portraits/manifest.csv','utf8').trim().split('\n').slice(1).map(l=>l.split(','));assert.equal(rows.length,28);
 for(const r of rows){const [id,expr,,,,webp,,sha]=r,file=`src/assets/portraits/${webp.split('/').pop()}`,b=fs.readFileSync(file);
  assert.equal(crypto.createHash('sha256').update(b).digest('hex'),sha,file);assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.toString('ascii',8,12),'WEBP');assert.match(file,new RegExp(`bust_${id}_${expr}\\.webp$`));}
 assert.deepEqual([...new Set(rows.map(r=>r[0]))].sort(),['aren','elina','eric','eric_adv','kai','lia','sain']);assert.deepEqual([...new Set(rows.map(r=>r[1]))].sort(),['concerned','determined','neutral','sad']);
});
test('art packs: 21 + 36 (v0.4.0), 25 tier-2 (v0.5.0) and 25 ACT II (v0.6.0 pack B) assets imported from hash-verified PNG masters',()=>{
 const log=fs.readFileSync('src/assets/art-import-log.csv','utf8').trim().split('\n').slice(1).map(l=>l.split(','));assert.equal(log.length,57+25+25);
 for(const id of ['cassian','leonora','thea','dario'])for(const e of ['neutral','concerned','determined','sad'])assert.ok(log.some(r=>r[0]==='bust'&&r[1]===id&&r[2]===e),`${id} ${e}`);
 for(const id of ['thea','dario','ironInfantry','ironDeserter','mercSpear','assassin','lordA','lordB','councillor'])assert.ok(log.some(r=>r[0]==='sprite'&&r[1]===id),id);
 assert.equal(log.filter(r=>/_t2$/.test(r[1])).length,25);for(const id of ['eric','elina','lia','sain','kai']){for(const e of ['neutral','concerned','determined','sad'])assert.ok(log.some(r=>r[0]==='bust'&&r[1]===`${id}_t2`&&r[2]===e),`${id}_t2 ${e}`);assert.ok(log.some(r=>r[0]==='sprite'&&r[1]===`${id}_t2`));}
 for(const [kind,id,expr,webp,bytes,,sha]of log){const file=`src/assets/${kind==='bust'?'portraits':'sprites'}/${webp}`,b=fs.readFileSync(file);assert.equal(b.length,+bytes);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),sha,file);
  const w=b.readUIntLE(24,3)+1,h=b.readUIntLE(27,3)+1;if(b.toString('ascii',12,16)==='VP8X')assert.deepEqual([w,h],kind==='bust'?[720,880]:[512,384],file);}
 assert.equal(fs.readdirSync('src/assets/portraits').filter(f=>f.endsWith('.webp')).length,49+20+16);assert.equal(fs.readdirSync('src/assets/sprites').filter(f=>f.endsWith('.webp')).length,36+5+9);
});
