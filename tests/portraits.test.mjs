import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
// Painted portrait pack r2: 7 ids × 4 expressions, hashes match the delivered manifest, WebP with alpha.
test('painted portraits: 28 WebP files match the pack manifest and cover every id/expression',()=>{
 const rows=fs.readFileSync('src/assets/portraits/manifest.csv','utf8').trim().split('\n').slice(1).map(l=>l.split(','));assert.equal(rows.length,28);
 for(const r of rows){const [id,expr,,,,webp,,sha]=r,file=`src/assets/portraits/${webp.split('/').pop()}`,b=fs.readFileSync(file);
  assert.equal(crypto.createHash('sha256').update(b).digest('hex'),sha,file);assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.toString('ascii',8,12),'WEBP');assert.match(file,new RegExp(`bust_${id}_${expr}\\.webp$`));}
 assert.deepEqual([...new Set(rows.map(r=>r[0]))].sort(),['aren','elina','eric','eric_adv','kai','lia','sain']);assert.deepEqual([...new Set(rows.map(r=>r[1]))].sort(),['concerned','determined','neutral','sad']);
});
