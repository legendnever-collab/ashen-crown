// v0.6 art pack C in the browser: the castle town and Velmar hubs and their 12 rooms drawn from the painted art,
// chests closed and open, Erik walking in a town and leaving a room through its doorway. The story reaches these
// towns only in Phase D, so a test-only page (tests/harness/act2-preview.js, built into test-output/) places Erik.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';import fs from 'node:fs';
import {HUBS} from '../src/data/frontier-data.js';
execFileSync('node',['scripts/build.mjs'],{env:{...process.env,ASHEN_ENTRY:'tests/harness/act2-preview.js',ASHEN_OUT:'test-output/act2-preview.html'},stdio:'inherit'});
const url=pathToFileURL(process.cwd()+'/test-output/act2-preview.html').href,shots='docs/v0.6.0/screenshots/act2-hubs';fs.mkdirSync(shots,{recursive:true});
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});let n=0;const check=(name,ok)=>{assert.ok(ok,name);n++;console.log('PASS',name);};
const ROOMS={castletown:['forge','shop','inn-1','warroom-2','residence-3','depot-4'],velmar:['forge','shop','inn-1','warroom-2','residence-3','depot-4']};
try{
 for(const [label,viewport,touch] of [['1440',{width:1440,height:900},false],['390',{width:390,height:844},true]]){
  const ctx=await b.newContext({viewport,hasTouch:touch,isMobile:touch,deviceScaleFactor:touch?2:1});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const press=async a=>{const el=p.locator(`[data-do="${a}"]`).first();touch?await el.tap():await el.click();await p.waitForTimeout(250);};
  const snap=()=>p.evaluate(()=>AshenCrown.snapshot());
  await p.goto(url);await press('new');await drainStory(p);
  for(const hub of ['castletown','velmar']){
   check(`${label} ${hub} placed`,await p.evaluate(h=>AshenPreview.hub(h),hub));await p.waitForTimeout(700);const s=await snap();
   check(`${label} ${hub} shows the painted town at Lia's table`,s.frontier.hub===hub&&!s.frontier.interior&&s.screen==='exploration'&&s.frontier.x===HUBS[hub].spawn[0]);
   await p.screenshot({path:`${shots}/${hub}-${label}.png`});
   if(!touch){const before=[s.frontier.x,s.frontier.y];await p.keyboard.press('ArrowDown');await p.waitForTimeout(500);const after=await snap();
    check(`${label} ${hub}: Erik walks on the painted street`,after.frontier.x===before[0]&&after.frontier.y===before[1]+1);}
   for(const place of ROOMS[hub])for(const opened of [false,true]){
    check(`${label} ${hub} ${place} room ${opened?'with opened chests':''}`,await p.evaluate(([h,pl,o])=>AshenPreview.room(h,pl,o),[hub,place,opened]));await p.waitForTimeout(500);
    const r=await snap();check(`${label} ${hub} ${place}: inside`,!!r.frontier.interior);
    if(label==='1440'||place==='inn-1')await p.screenshot({path:`${shots}/${hub}-${place}-${opened?'open':'closed'}-${label}.png`});
    if(!touch&&!opened){await p.evaluate(()=>AshenPreview.at(6,6,'down'));await p.keyboard.press('ArrowDown');await p.waitForTimeout(500);const out=await snap();
     check(`${label} ${hub} ${place}: the doorway leads back to the town`,!out.frontier.interior&&out.frontier.hub===hub);}
   }
  }
  check(`${label} no runtime errors`,errors.length===0);if(errors.length)console.log(errors);await ctx.close();
 }
 fs.writeFileSync('test-output/act2-hubs-e2e.json',JSON.stringify({checks:n},null,1));console.log(`act2-hubs-e2e: ${n} checks passed`);
}finally{await b.close();}
