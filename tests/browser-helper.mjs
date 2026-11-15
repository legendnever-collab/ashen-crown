import {chromium} from 'playwright';
// D-107 (2026-11-11 play-test): the town menu folds behind ☰ and the D-pad is off by default on phones. Pages opened
// through this helper press a folded town button the way a player does — tap ☰ first, then the button — and a hidden
// D-pad button is activated like a keyboard press (the fallback tests/frontier-press.mjs already used for 'walk').
const CHAIN=['first','last','nth','filter','locator'];
function patchPage(page){if(page.__rawLocator)return page;const orig=page.locator.bind(page);page.__rawLocator=orig;
 async function reveal(sel,loc){if(!/data-do="/.test(sel))return false;
  const where=await loc.evaluate(b=>({fold:!!b.closest('.hub-fold[hidden]'),dpad:!!b.closest('.frontier-screen .dpad')&&!b.checkVisibility()})).catch(()=>({}));
  if(where.dpad){await loc.evaluate(b=>b.click());return true;}
  if(where.fold){await orig('[data-do="hub-menu"]').first().click();await page.waitForTimeout(80);}
  return false;}
 const wrap=(sel,inner)=>new Proxy(inner,{get(t,k){const v=t[k];if(typeof v!=='function')return v;
  if(CHAIN.includes(k))return (...a)=>wrap(sel,v.apply(t,a));
  if(k==='click'||k==='tap')return async(...a)=>{if(await reveal(sel,t))return;return v.apply(t,a);};
  return v.bind(t);}});
 page.locator=(sel,...rest)=>{const l=orig(sel,...rest);return typeof sel==='string'&&sel.includes('data-do=')?wrap(sel,l):l;};
 return page;}
function patchContext(ctx){const np=ctx.newPage.bind(ctx);ctx.newPage=async(...a)=>patchPage(await np(...a));return ctx;}
function patchBrowser(b){const nc=b.newContext.bind(b),np=b.newPage.bind(b);b.newContext=async(...a)=>patchContext(await nc(...a));b.newPage=async(...a)=>patchPage(await np(...a));return b;}
// Independent browser processes also support restricted pipe-only local runners.
export async function launchTestBrowser(options){options={...options,...process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{},args:[...(options.args||[]),...(process.env.BROWSER_SINGLE_PROCESS?['--single-process','--no-zygote','--in-process-gpu']:[])]};if(!process.env.BROWSER_SINGLE_PROCESS)return patchBrowser(await chromium.launch(options));const pool=[];return {async newContext(opts){const b=await chromium.launch(options);pool.push(b);const ctx=patchContext(await b.newContext(opts)),close=ctx.close.bind(ctx);ctx.close=async()=>{await close();await b.close();};return ctx;},async newPage(opts){const b=await chromium.launch(options);pool.push(b);return patchPage(await b.newPage(opts));},async close(){await Promise.allSettled(pool.map(b=>b.close()));}};}
