// Phone battle screenshots: tap hero → command sheet (no ranges); 이동 → blue cells; skill → forecast.
import {launchTestBrowser} from '../../tests/browser-helper.mjs';import {pathToFileURL} from 'node:url';import path from 'node:path';
import {enterWarCouncil,drainStory} from '../../tests/story-helper.mjs';
const out=process.argv[2]||'samples/bust',b=await launchTestBrowser({headless:true,args:['--no-sandbox']});
const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,deviceScaleFactor:2});const p=await ctx.newPage();
await p.goto(pathToFileURL(path.resolve('releases/Ashen_Crown_v0.4.0.html')).href);await p.locator('[data-do="new"]').click();await drainStory(p);await enterWarCouncil(p,true);await p.locator('[data-do="deploy"]').first().click();await p.locator('[data-do="start-battle"]').first().click();await drainStory(p);
const tapUnit=async id=>{const s=await p.evaluate(()=>AshenCrown.snapshot());const u=s.units.find(u=>u.id===id);const c=await p.evaluate(([x,y])=>AshenCrown.tileCenter(x,y),[u.x,u.y]);const r=await p.locator('#battle-map').boundingBox();await p.touchscreen.tap(r.x+c.x,r.y+c.y);await p.waitForTimeout(250);};
await tapUnit('eric');const v1=await p.evaluate(()=>AshenCrown.view());const end=await p.locator('[data-do="end-phase"]').first().boundingBox(),pop=await p.locator('#unit-popover').boundingBox();await p.screenshot({path:`${out}/mobile-1-menu.png`});
await p.locator('#unit-popover [data-do="mode"][data-id="move"]').click();await p.waitForTimeout(250);const v2=await p.evaluate(()=>AshenCrown.view());await p.screenshot({path:`${out}/mobile-2-move.png`});
console.log(JSON.stringify({menuRanges:v1.ranges.length,menu:v1.menu,moveRanges:v2.ranges.length,endPhaseTop:Math.round(end.y),sheetBottom:Math.round(pop.y+pop.height)}));await b.close();
