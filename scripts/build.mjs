import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),version=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8')).version,seen=new Set();let modules=[];
function bundle(file){file=path.resolve(file);if(seen.has(file))return;seen.add(file);let text=fs.readFileSync(file,'utf8');for(const match of text.matchAll(/^import .*? from ['"](.+?)['"];$/gm))bundle(path.resolve(path.dirname(file),match[1]));text=text.replace(/^import .*? from ['"].+?['"];\n/gm,'').replace(/^export /gm,'');modules.push(`// ${path.relative(root,file)}\n${text}`);}
// ASHEN_ENTRY/ASHEN_OUT build a test-only page (e.g. tests/harness/act2-preview.js) into test-output; the release is untouched.
const entry=process.env.ASHEN_ENTRY||'src/ui/app.js',testOut=process.env.ASHEN_OUT||null;
bundle(path.join(root,entry));
// Painted dialogue portraits: src/assets/portraits/bust_<id>_<expression>.webp → one data-URL registry, built once.
// The staff aide was folded into Lia (one strategist on the map), so the 'advisor' art is kept in source but not shipped.
const UNUSED_ART=new Set(['advisor']);
// v2.2.1 (D-125): the large paintings are AVIF (scripts/convert-art-avif.py); icons, chests and props stay WebP.
const MIME={webp:'image/webp',avif:'image/avif'},dataUrl=file=>`data:${MIME[path.extname(file).slice(1)]};base64,`+fs.readFileSync(file).toString('base64');
const portraitDir=path.join(root,'src/assets/portraits'),portraits={};if(fs.existsSync(portraitDir))for(const f of fs.readdirSync(portraitDir).sort()){const m=/^bust_(.+)_(neutral|concerned|determined|sad)\.(webp|avif)$/.exec(f);if(m&&!UNUSED_ART.has(m[1]))(portraits[m[1]]??={})[m[2]]=dataUrl(path.join(portraitDir,f));}
modules.unshift(`const ASHEN_PORTRAITS=${JSON.stringify(portraits)};`);
// Painted map sprite sheets: src/assets/sprites/sprite_<id>.webp (512×384, 4×3 cells of 128, anchor 64,120).
const spriteDir=path.join(root,'src/assets/sprites'),sprites={};if(fs.existsSync(spriteDir))for(const f of fs.readdirSync(spriteDir).sort()){const m=/^sprite_(.+)\.(webp|avif)$/.exec(f);if(m&&!UNUSED_ART.has(m[1]))sprites[m[1]]=dataUrl(path.join(spriteDir,f));}
modules.unshift(`const ASHEN_SPRITES=${JSON.stringify(sprites)};`);
// Painted hubs and world map (D-052): src/assets/hubs/<id>.webp, src/assets/world/<id>.webp → data-URL registries.
const artDir=(dir)=>{const out={},d=path.join(root,dir);if(fs.existsSync(d))for(const f of fs.readdirSync(d).sort()){const m=/^(.+)\.(webp|avif)$/.exec(f);if(m)out[m[1]]=dataUrl(path.join(d,f));}return out;};
modules.unshift(`const ASHEN_HUBS=${JSON.stringify(artDir('src/assets/hubs'))};`);
modules.unshift(`const ASHEN_WORLD=${JSON.stringify(artDir('src/assets/world'))};`);
// Painted chest sheet cells (D-056): src/assets/chests/<style>_<closed|open>.webp.
modules.unshift(`const ASHEN_CHESTS=${JSON.stringify(artDir('src/assets/chests'))};`);
// Painted item, skill and status icons (art work pack E, D-073 Q9): src/assets/items/<id>.webp, 128×128 (scripts/import-item-art.py).
modules.unshift(`const ASHEN_ITEMS=${JSON.stringify(artDir('src/assets/items'))};`);
// Painted building interiors (D-056): src/assets/rooms/<room id>.webp, 12×8 tiles.
modules.unshift(`const ASHEN_ROOMS=${JSON.stringify(artDir('src/assets/rooms'))};`);
// Painted battle-map props (ACT III pack F2, D-088): src/assets/props/<id>.webp, 128×128 cells like the map sprites.
modules.unshift(`const ASHEN_PROPS=${JSON.stringify(artDir('src/assets/props'))};`);
// Painted ending illustrations and the epilogue background (ACT IV pack G4, D-113): src/assets/endings/<id>.webp.
modules.unshift(`const ASHEN_ENDINGS=${JSON.stringify(artDir('src/assets/endings'))};`);
// v2.0.0 「잿빛 결투장」 background (pack H1 part E, D-115): src/assets/duel/arena.webp, or null until it returns.
modules.unshift(`const ASHEN_DUEL_BG=${JSON.stringify(artDir('src/assets/duel').arena||null)};`);
// v2.2.0 (D-123): art pack I for the duel scene — duel_<id> action sheets, finisher_<hero> key art, duelbg_<stage> backdrops.
{const {arena,...duel}=artDir('src/assets/duel');modules.unshift(`const ASHEN_DUEL=${JSON.stringify(duel)};`);} /* v2.2.1: the arena is ASHEN_DUEL_BG only */
const script=modules.join('\n').replace(/<\/script/gi,'<\\/script');const font=fs.readFileSync(path.join(root,'src/assets/AshenUI.woff')).toString('base64');const css=`@font-face{font-family:'Ashen UI';src:url(data:font/woff;base64,${font}) format('woff');font-weight:100 900;font-display:swap;}\n`+fs.readFileSync(path.join(root,'src/ui/style.css'),'utf8').replaceAll('Arial,sans-serif',"Arial,'Ashen UI',sans-serif").replace("'Noto Serif KR',serif","'Ashen UI',serif");
const fallbackFont=fs.readFileSync(path.join(root,'src/assets/AshenFallback.woff')).toString('base64'),fallbackRange=JSON.parse(fs.readFileSync(path.join(root,'src/assets/fallback-glyphs.json'),'utf8')).map(c=>'U+'+c.toString(16)).join(',');
const html=`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#142c30"><meta name="description" content="Ashen Crown: original fantasy tactical SRPG — ACT I (Missions 01–06), ACT II Missions 07–12, promotions and the world of Erdia"><title>Ashen Crown — The Three Banners · v${version}</title><style>${css}\n@font-face{font-family:'Ashen UI';src:url(data:font/woff;base64,${fallbackFont}) format('woff');unicode-range:${fallbackRange};font-weight:100 900;}</style></head><body><div id="app"></div><noscript>이 게임은 JavaScript가 활성화된 브라우저에서 실행됩니다.</noscript><script>(()=>{'use strict';\n${script}\n})();</script></body></html>`;
if(testOut){fs.mkdirSync(path.dirname(path.resolve(root,testOut)),{recursive:true});fs.writeFileSync(path.resolve(root,testOut),html);console.log(`Test page ${testOut}: ${Buffer.byteLength(html)} bytes`);process.exit(0);}
// v2.2.1 (D-125): a build goes to build/Ashen_Crown.html, which git ignores. scripts/package.py copies it to index.html and
// releases/Ashen_Crown_v<version>.html only when a release candidate is packaged, so the 60 MB file is not committed on every change.
const out=path.join(root,'build/Ashen_Crown.html');fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,html);
// Size budget (D-125): GitHub refuses files over 100 MiB. Warn at 80 MiB, fail at 90 MiB; build/size-report.json lists the parts.
const {sizeReport,BUDGET}=await import('./size-budget.mjs');const report=sizeReport(html,modules);fs.writeFileSync(path.join(root,'build/size-report.json'),JSON.stringify(report,null,2)+'\n');
console.log(`Standalone build/Ashen_Crown.html: ${Buffer.byteLength(html)} bytes (${report.MiB} MiB of the ${BUDGET.failMiB} MiB budget), ${seen.size} modules, zero external requests.`);
for(const [k,v] of Object.entries(report.parts))console.log(`  ${k.padEnd(18)} ${(v/1048576).toFixed(2).padStart(6)} MiB`);
if(report.status!=='ok')console.log(`SIZE ${report.status.toUpperCase()}: ${report.MiB} MiB (warn ${BUDGET.warnMiB}, fail ${BUDGET.failMiB})`);
if(report.status==='fail')process.exit(1);
