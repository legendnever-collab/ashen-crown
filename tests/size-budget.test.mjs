// v2.2.1 (D-125): keep the standalone HTML far under GitHub's 100 MiB limit until the game is finished.
// The budget (warn 80, fail 90 MiB) is enforced by scripts/build.mjs; the large paintings are AVIF, each conversion logged
// with the WebP it replaced and its SSIM; earlier builds are listed with hashes in releases/ARCHIVE.json.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import {BUDGET,sizeStatus,sizeReport} from '../scripts/size-budget.mjs';
import {CONVERSIONS,isAvif,imageSize} from './art-file.mjs';
const MiB=1048576,AVIF_FOLDERS={portraits:.975,duel:.975,sprites:.975,rooms:.97,hubs:.97,world:.97};
test('the size budget: ok up to 80 MiB, warn above, fail above 90 MiB',()=>{
 assert.deepEqual(BUDGET,{warnMiB:80,failMiB:90});
 assert.equal(sizeStatus(80*MiB),'ok');assert.equal(sizeStatus(80*MiB+1),'warn');assert.equal(sizeStatus(90*MiB),'warn');assert.equal(sizeStatus(90*MiB+1),'fail');
 const r=sizeReport('<html>'+'x'.repeat(100)+'</html>',['const ASHEN_A={"a":"1"};','function f(){}']);
 assert.equal(r.status,'ok');assert.equal(r.parts.ASHEN_A,Buffer.byteLength('const ASHEN_A={"a":"1"};'));assert.equal(r.parts.fonts,0);
});
test('the six painting folders are AVIF (the 24 magenta-marked class sheets and the wolf sheet stay WebP); every file matches its conversion record, at least the SSIM floor',()=>{
 for(const [folder,floor] of Object.entries(AVIF_FOLDERS)){
  const files=fs.readdirSync(`src/assets/${folder}`).filter(f=>/\.(webp|avif)$/.test(f));
  // the class sheets stay WebP: their magenta sash is recoloured by threshold and needs exact colour edges
  assert.deepEqual(files.filter(f=>f.endsWith('.webp')&&!f.startsWith('sprite_class_')&&f!=='sprite_wolf.webp'),[],`${folder}: WebP left (run scripts/convert-art-avif.py)`); // v2.3.1: the wolf's collar is magenta too
  if(folder==='sprites')assert.equal(files.filter(f=>f.startsWith('sprite_class_')&&f.endsWith('.webp')).length,24);
  for(const f of files.filter(f=>f.endsWith('.avif'))){const c=CONVERSIONS.find(r=>r.folder===folder&&r.avif===f);assert.ok(c,`${folder}/${f} has no conversion record`);
   const b=fs.readFileSync(`src/assets/${folder}/${f}`);assert.ok(isAvif(b),f);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),c.avif_sha256,f);
   assert.ok(+c.ssim>=floor,`${f}: SSIM ${c.ssim} under ${floor}`);assert.ok(+c.quality>=60&&+c.quality<=80,f);assert.ok(imageSize(b)[0]>0,f);}
 }
 assert.equal(CONVERSIONS.length,393); // v2.3.1 pack J: 군나르 ×3, the wolf's bust, 서리목, 소금항; v2.4.1 pack K: 마렌 ×3, 등불골, 이끼다리
});
test('the AVIF notice: browsers that cannot open AVIF are told why the paintings are missing',()=>{
 const app=fs.readFileSync('src/ui/app.js','utf8');assert.match(app,/AVIF_NOTICE='[^']*iOS 16\.4[^']*'/);assert.match(app,/avifProbe\.src='data:image\/avif;base64,/);
 assert.match(fs.readFileSync('src/ui/style.css','utf8'),/#avif-notice\{/);
});
test('releases/ARCHIVE.json lists every earlier build with hashes; the files still here have the recorded sizes',()=>{
 const {versions}=JSON.parse(fs.readFileSync('releases/ARCHIVE.json','utf8'));const current=JSON.parse(fs.readFileSync('package.json','utf8')).version;
 assert.ok(versions.length>=28);assert.ok(!versions.some(v=>v.version===current),'the version in development is not archived');
 for(const v of versions){assert.equal(v.tag,`v${v.version}`);assert.match(v.commit,/^[0-9a-f]{40}$/);assert.ok(v.files[`Ashen_Crown_v${v.version}.html`],v.version);
  for(const [name,meta] of Object.entries(v.files)){const p=`releases/${name}`;if(!fs.existsSync(p))continue;
   assert.equal(fs.statSync(p).size,meta.bytes,name);assert.match(meta.sha256,/^[0-9a-f]{64}$/);}} /* the SHA256 is checked when archiving and when fetching (scripts/fetch-releases.mjs) */
});
test('D-134 (v2.4.0): the builds released on GitHub are out of the tree and their fetched copies are ignored',async()=>{
 const {versions}=JSON.parse(fs.readFileSync('releases/ARCHIVE.json','utf8'));const ignore=fs.readFileSync('.gitignore','utf8').split(/\r?\n/);
 for(const v of versions)for(const n of [`Ashen_Crown_v${v.version}.html`,`Ashen_Crown_v${v.version}_Source.zip`])assert.ok(ignore.includes(`releases/${n}`),`.gitignore lists ${n}`);
 // the 28 versions whose Releases were checked on 2026-11-21 (D-133) and v2.2.1–v2.3.1 (checked again for v2.5.0, D-142); their test reports and checksums stay
 const released=versions.slice(0,31).map(v=>v.version);assert.equal(released.at(-1),'2.3.1');
 const {execFileSync}=await import('node:child_process');let tracked;try{tracked=execFileSync('git',['ls-files','releases'],{encoding:'utf8'}).split('\n');}catch{return;} // a Source ZIP has no git
 if(!tracked.some(Boolean))return;
 for(const ver of released){assert.ok(!tracked.includes(`releases/Ashen_Crown_v${ver}.html`)&&!tracked.includes(`releases/Ashen_Crown_v${ver}_Source.zip`),ver);assert.ok(tracked.includes(`releases/Ashen_Crown_v${ver}_Test_Report.md`),`${ver} keeps its test report`);}
});
