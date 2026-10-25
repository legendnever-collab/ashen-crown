import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),version=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8')).version,seen=new Set();let modules=[];
function bundle(file){file=path.resolve(file);if(seen.has(file))return;seen.add(file);let text=fs.readFileSync(file,'utf8');for(const match of text.matchAll(/^import .*? from ['"](.+?)['"];$/gm))bundle(path.resolve(path.dirname(file),match[1]));text=text.replace(/^import .*? from ['"].+?['"];\n/gm,'').replace(/^export /gm,'');modules.push(`// ${path.relative(root,file)}\n${text}`);}
bundle(path.join(root,'src/ui/app.js'));
// Painted dialogue portraits: src/assets/portraits/bust_<id>_<expression>.webp → one data-URL registry, built once.
// The staff aide was folded into Lia (one strategist on the map), so the 'advisor' art is kept in source but not shipped.
const UNUSED_ART=new Set(['advisor']);
const portraitDir=path.join(root,'src/assets/portraits'),portraits={};if(fs.existsSync(portraitDir))for(const f of fs.readdirSync(portraitDir).sort()){const m=/^bust_(.+)_(neutral|concerned|determined|sad)\.webp$/.exec(f);if(m&&!UNUSED_ART.has(m[1]))(portraits[m[1]]??={})[m[2]]='data:image/webp;base64,'+fs.readFileSync(path.join(portraitDir,f)).toString('base64');}
modules.unshift(`const ASHEN_PORTRAITS=${JSON.stringify(portraits)};`);
// Painted map sprite sheets: src/assets/sprites/sprite_<id>.webp (512×384, 4×3 cells of 128, anchor 64,120).
const spriteDir=path.join(root,'src/assets/sprites'),sprites={};if(fs.existsSync(spriteDir))for(const f of fs.readdirSync(spriteDir).sort()){const m=/^sprite_(.+)\.webp$/.exec(f);if(m&&!UNUSED_ART.has(m[1]))sprites[m[1]]='data:image/webp;base64,'+fs.readFileSync(path.join(spriteDir,f)).toString('base64');}
modules.unshift(`const ASHEN_SPRITES=${JSON.stringify(sprites)};`);
// Painted hubs and world map (D-052): src/assets/hubs/<id>.webp, src/assets/world/<id>.webp → data-URL registries.
const artDir=(dir)=>{const out={},d=path.join(root,dir);if(fs.existsSync(d))for(const f of fs.readdirSync(d).sort()){const m=/^(.+)\.webp$/.exec(f);if(m)out[m[1]]='data:image/webp;base64,'+fs.readFileSync(path.join(d,f)).toString('base64');}return out;};
modules.unshift(`const ASHEN_HUBS=${JSON.stringify(artDir('src/assets/hubs'))};`);
modules.unshift(`const ASHEN_WORLD=${JSON.stringify(artDir('src/assets/world'))};`);
// Painted chest sheet cells (D-056): src/assets/chests/<style>_<closed|open>.webp.
modules.unshift(`const ASHEN_CHESTS=${JSON.stringify(artDir('src/assets/chests'))};`);
// Painted building interiors (D-056): src/assets/rooms/<room id>.webp, 12×8 tiles.
modules.unshift(`const ASHEN_ROOMS=${JSON.stringify(artDir('src/assets/rooms'))};`);
const script=modules.join('\n').replace(/<\/script/gi,'<\\/script');const font=fs.readFileSync(path.join(root,'src/assets/AshenUI.woff')).toString('base64');const css=`@font-face{font-family:'Ashen UI';src:url(data:font/woff;base64,${font}) format('woff');font-weight:100 900;font-display:swap;}\n`+fs.readFileSync(path.join(root,'src/ui/style.css'),'utf8').replaceAll('Arial,sans-serif',"Arial,'Ashen UI',sans-serif").replace("'Noto Serif KR',serif","'Ashen UI',serif");
const fallbackFont=fs.readFileSync(path.join(root,'src/assets/AshenFallback.woff')).toString('base64'),fallbackRange=JSON.parse(fs.readFileSync(path.join(root,'src/assets/fallback-glyphs.json'),'utf8')).map(c=>'U+'+c.toString(16)).join(',');
const html=`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#142c30"><meta name="description" content="Ashen Crown: original fantasy tactical SRPG — ACT I, Missions 01–06, promotions and the world of Erdia"><title>Ashen Crown — Ranks of the Ashen Legion · v${version}</title><style>${css}\n@font-face{font-family:'Ashen UI';src:url(data:font/woff;base64,${fallbackFont}) format('woff');unicode-range:${fallbackRange};font-weight:100 900;}</style></head><body><div id="app"></div><noscript>이 게임은 JavaScript가 활성화된 브라우저에서 실행됩니다.</noscript><script>(()=>{'use strict';\n${script}\n})();</script></body></html>`;
fs.mkdirSync(path.join(root,'releases'),{recursive:true});fs.writeFileSync(path.join(root,`releases/Ashen_Crown_v${version}.html`),html);fs.writeFileSync(path.join(root,'index.html'),html);console.log(`Standalone: ${Buffer.byteLength(html)} bytes, ${seen.size} modules, zero external requests.`);
