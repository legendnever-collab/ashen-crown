// The build concatenates every module into one scope (scripts/build.mjs), so two modules must never declare the same
// top-level name (v0.8.0: catalog-v08.js and item-art.js both declared R and broke the bundle at load).
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';
const files=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(d,e.name)):e.name.endsWith('.js')?[path.join(d,e.name)]:[]);
function topNames(src){const out=[];for(const line of src.split('\n')){const m=/^(?:export\s+)?(?:async\s+)?(?:function\*?\s+([A-Za-z_$][\w$]*)|class\s+([A-Za-z_$][\w$]*)|(?:const|let|var)\s+(.*))/.exec(line);if(!m)continue;if(m[1]||m[2]){out.push(m[1]||m[2]);continue;}
 let depth=0,cur='';const parts=[];for(const ch of m[3]){if('([{'.includes(ch))depth++;else if(')]}'.includes(ch))depth--;if(ch===','&&depth===0){parts.push(cur);cur='';}else cur+=ch;}parts.push(cur);for(const p of parts){const n=/^\s*([A-Za-z_$][\w$]*)\s*=/.exec(p);if(n)out.push(n[1]);}}return out;}
test('no two source modules declare the same top-level name',()=>{const seen=new Map(),dup=[];for(const f of files('src'))for(const n of new Set(topNames(fs.readFileSync(f,'utf8')))){if(seen.has(n))dup.push(`${n}: ${seen.get(n)} + ${f}`);else seen.set(n,f);}assert.deepEqual(dup,[]);});
