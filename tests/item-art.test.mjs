// v0.9.0 — art work pack E (D-073 Q9, D-081): 102 painted icons cut from seven hash-verified sheets. Every cell id of the
// work order has its WebP, the import log's hashes match the shipped files, and the ids cover the catalog's tools, gear,
// treasures, statuses, commands and every hero skill. Gear added after the pack (the capital's tier III) keeps the SVG.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import {SKILLS} from '../src/data/skills.js';
import {GEAR,TOOLS} from '../src/data/frontier-data.js';

// The log has no quoted fields; cells.csv quotes only its last column (description), which is not read here.
const csv=f=>{const [head,...rows]=fs.readFileSync(f,'utf8').trim().split(/\r?\n/);const cols=head.split(',');return rows.map(r=>{const v=r.split(',');return Object.fromEntries(cols.map((c,i)=>[c,v[i]]));});};
const cells=csv('docs/v0.8.0/art/item-work-pack/cells.csv'),cellsF1=csv('docs/v0.9.0/art/act3-f1-work-pack/cells.csv'),cellsF2=csv('docs/v0.9.1/art/act3-f2-work-pack/cells.csv'),cellsF3=csv('docs/v0.9.2/art/act3-f3-work-pack/cells.csv'),all=csv('src/assets/item-art-import-log.csv');
// v0.9.1: ACT III pack F1 adds sheet H (eight capital pieces) to the same log (scripts/import-item-art.py --cells).
const log=all.filter(r=>cells.some(c=>c.id===r.id)),logF1=all.filter(r=>cellsF1.some(c=>c.id===r.id)),logF2=all.filter(r=>cellsF2.some(c=>c.id===r.id)),logF3=all.filter(r=>cellsF3.some(c=>c.id===r.id));

test('pack E: 102 icons, one per work-order cell, hashes match the import log, 128×128 WebP',()=>{
 assert.equal(cells.length,102);assert.equal(log.length,102);assert.equal(all.length,102+8+6+4);
 assert.deepEqual(log.map(r=>r.id).sort(),cells.map(c=>c.id).sort());
 for(const r of log){const b=fs.readFileSync(`src/assets/items/${r.id}.webp`);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),r.webp_sha256,r.id);
  assert.equal(b.length,+r.bytes,r.id);assert.equal(b.toString('ascii',8,12),'WEBP');assert.equal(r.qa,'ok',r.id);
  const c=cells.find(c=>c.id===r.id);assert.equal(`${r.sheet}${r.cell}`,`${c.sheet}${c.cell}`,r.id);}
 assert.equal(new Set(log.map(r=>r.source_sha256)).size,7,'seven source sheets');
 assert.equal(fs.readdirSync('src/assets/items').filter(f=>f.endsWith('.webp')).length,102+8+6+4);
});

test('ACT III pack F1: sheet H gives the capital\'s six tier III pieces and the M15–M16 treasures their painted icons',()=>{
 assert.equal(cellsF1.length,8);assert.deepEqual(logF1.map(r=>r.id).sort(),cellsF1.map(c=>c.id).sort());
 for(const r of logF1){const b=fs.readFileSync(`src/assets/items/${r.id}.webp`);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),r.webp_sha256,r.id);
  assert.equal(r.sheet,'H');assert.equal(r.qa,'ok',r.id);assert.ok(GEAR[r.id],r.id);}
 assert.equal(new Set(logF1.map(r=>r.source_sha256)).size,1,'one source sheet');
});

test('ACT III pack F2: sheet I paints the three ④ ultimates, the two v0.9.1 treasures and the basic potion',()=>{
 assert.equal(cellsF2.length,6);assert.deepEqual(logF2.map(r=>r.id).sort(),cellsF2.map(c=>c.id).sort());
 for(const r of logF2){const b=fs.readFileSync(`src/assets/items/${r.id}.webp`);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),r.webp_sha256,r.id);assert.equal(r.sheet,'I');}
 for(const k of SKILLS.filter(k=>k.slot===4&&['eric','elina','sain'].includes(k.hero)))assert.ok(logF2.some(r=>r.id===k.id),`④ ${k.id}`);
 for(const id of ['oathBadge','groveLeaf'])assert.ok(GEAR[id]&&logF2.some(r=>r.id===id),id);
 assert.ok(logF2.some(r=>r.id==='potion'),'the basic potion');
});

test('ACT III pack F3: sheet J paints Lia\'s and Kai\'s ④ and the two v0.9.2 treasures',()=>{
 assert.equal(cellsF3.length,4);assert.deepEqual(logF3.map(r=>r.id).sort(),cellsF3.map(c=>c.id).sort());
 for(const r of logF3){const b=fs.readFileSync(`src/assets/items/${r.id}.webp`);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),r.webp_sha256,r.id);assert.equal(r.sheet,'J');}
 for(const k of SKILLS.filter(k=>k.slot===4&&['lia','kai'].includes(k.hero)))assert.ok(logF3.some(r=>r.id===k.id),`④ ${k.id}`);
 for(const id of ['teacherQuill','greyLedger'])assert.ok(GEAR[id]&&logF3.some(r=>r.id===id),id);
});

test('pack E covers every hero skill, the four statuses, buffs and the battle commands',()=>{
 const ids=new Set(log.map(r=>r.id));
 for(const k of SKILLS.filter(k=>k.slot<=3))assert.ok(ids.has(k.id),`skill ${k.hero} ${k.id}`);
 // the ④ skills (v0.9.1) came after the pack: they show no painted disk until the ACT III art
 assert.ok(SKILLS.filter(k=>k.slot===4).every(k=>!ids.has(k.id)));
 for(const id of ['poison','confuse','bind','silence','buff','debuff','attack','wait','persuade','capture','supplyCrate','gold'])assert.ok(ids.has(id),id);
 for(const id of cells.filter(c=>c.kind==='tool').map(c=>c.id))assert.ok(TOOLS[id]||['herb','medium','ether','elixir'].includes(id),`tool ${id}`);
 for(const id of cells.filter(c=>['gear','treasure'].includes(c.kind)).map(c=>c.id))assert.ok(GEAR[id],`gear ${id}`);
 const later=Object.keys(GEAR).filter(id=>!ids.has(id));assert.ok(later.includes('royalSaber')&&later.includes('mistLantern')&&later.includes('oathBadge'),'v0.9.0–v0.9.1 pieces are not in pack E');
 const painted=new Set(all.map(r=>r.id));assert.ok(painted.has('royalSaber')&&painted.has('mistLantern')&&painted.has('oathBadge'),'packs F1 and F2 paint the later pieces');
});
