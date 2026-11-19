// v2.2.1 (D-125): time to decode every embedded painting larger than ~15 KB in a fresh page, the v2.2.0 build (WebP) vs build/Ashen_Crown.html (AVIF).
// Run: BROWSER_EXECUTABLE=<chrome> node tests/decode-time.mjs  (needs releases/Ashen_Crown_v2.2.0.html; result in docs/v2.2.1/evidence/decode-time.json).
import {chromium} from 'playwright';import {pathToFileURL} from 'node:url';import path from 'node:path';
const b=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE,args:['--no-sandbox']});const out={};
for(const [label,file] of [['v2.2.0 WebP','releases/Ashen_Crown_v2.2.0.html'],['v2.2.1 AVIF','build/Ashen_Crown.html']])for(const [vw,vh,mobile] of [[1440,900,false],[390,844,true]]){
 const times=[];for(let run=0;run<3;run++){const ctx=await b.newContext({viewport:{width:vw,height:vh},isMobile:mobile,hasTouch:mobile});const p=await ctx.newPage();await p.goto(pathToFileURL(path.resolve(file)).href);
  times.push(await p.evaluate(async()=>{const text=[...document.scripts].map(s=>s.textContent).join('');const urls=text.match(/data:image\/(webp|avif);base64,[A-Za-z0-9+\/=]{20000,}/g);
   const t=performance.now();await Promise.all(urls.map(u=>{const i=new Image();i.src=u;return i.decode();}));return {ms:Math.round(performance.now()-t),n:urls.length};}));await ctx.close();}
 times.sort((a,b)=>a.ms-b.ms);out[`${label} ${vw}`]=`${times[1].ms} ms for ${times[1].n} images (median of 3)`;}
console.log(JSON.stringify(out,null,1));await b.close();
