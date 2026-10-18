import {chromium} from 'playwright';import path from 'path';import {pathToFileURL} from 'url';
const out=process.argv[2]||'test-output/';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
for(const [w,h,touch] of [[1440,900,false],[390,844,true],[844,390,true]]){
 const p=await b.newPage({viewport:{width:w,height:h},hasTouch:touch,isMobile:touch});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(pathToFileURL(path.resolve('releases/Ashen_Crown_v0.4.0.html')).href);await p.evaluate(()=>localStorage.clear());await p.reload();
 await p.locator('[data-do="new"]').first().click();await p.waitForTimeout(500);
 await p.screenshot({path:`${out}dlg-${w}x${h}-a.png`});
 // tap somewhere on the scene (not a button) to advance
 const before=await p.evaluate(()=>window.AshenCrown.snapshot().narrative.active?.index);
 if(touch)await p.touchscreen.tap(w*0.5,h*0.3);else await p.mouse.click(w*0.5,h*0.3);await p.waitForTimeout(300);
 const after=await p.evaluate(()=>window.AshenCrown.snapshot().narrative.active?.index);
 for(let i=0;i<3;i++){if(touch)await p.touchscreen.tap(w*0.7,h*0.85);else await p.mouse.click(w*0.7,h*0.85);await p.waitForTimeout(250);}
 await p.screenshot({path:`${out}dlg-${w}x${h}-b.png`});
 console.log(w,h,'advance',before,'->',after,'errors',errs.join('|')||'none');await p.close();}
await b.close();
