// Growth tab screenshots from a real v0.4.0 ACT I-complete save (tests/fixtures/v040).
import {launchTestBrowser} from '../../tests/browser-helper.mjs';import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
const save=JSON.parse(fs.readFileSync('tests/fixtures/v040/v040-act1-complete.json','utf8')).save,b=await launchTestBrowser({headless:true,args:['--no-sandbox']}),out=process.argv[2]||'samples/v05';
for(const [w,h,mobile] of [[1440,900,false],[390,844,true]]){const ctx=await b.newContext({viewport:{width:w,height:h},hasTouch:mobile,isMobile:mobile,deviceScaleFactor:mobile?2:1});const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(pathToFileURL(path.resolve('releases/Ashen_Crown_v0.5.0.html')).href);const cmd=s=>p.locator(s).first().click();
 await cmd('[data-do="menu"]');await cmd('[data-do="backup"]');await p.locator('#backup-text').fill(save);await cmd('[data-do="restore"]');await p.waitForFunction(()=>!AshenCrown.view().busy);
 for(const id of ['lia','eric']){await p.evaluate(id=>{const b=document.createElement('button');b.dataset.do='unit-info';b.dataset.id=id+'|growth';b.id='tmp-open';document.body.append(b);},id);await p.keyboard.press('Escape');await p.locator('#tmp-open').dispatchEvent('click');await p.evaluate(()=>document.querySelector('#tmp-open')?.remove());await p.waitForTimeout(300);
  await p.screenshot({path:`${out}/growth-${id}-${w}.png`});await cmd('[data-do="close-modal"]');}
 console.log(w,'errors',errors.length,errors.slice(0,2));await ctx.close();}
await b.close();
