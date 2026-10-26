// v0.6 fix (2026-10-26, user report: bottom-row houses could not be entered). Two checks in the real build:
// 1) with Erik standing at each door of every story hub, the door and its approach tile are not under the HUD
//    (1440×900, 1280×720, 390×844 touch) — the hub camera may now scroll past the map edge by the HUD's size;
// 2) at 1440×900, clicking any visible part of a house walks Erik to its door (castle town + village), which used
//    to hit the 소지품 button for the castle town's bottom-right warehouse.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import fs from 'node:fs';
import {serialize} from '../src/persistence/save-manager.js';import {actOneCamp} from './skirmish-policy.mjs';import {newGame} from '../src/core/game.js';import {enterHub,currentHub,syncFrontier} from '../src/core/frontier.js';
const url=pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.6.1.html').href,b=await launchTestBrowser({headless:true,args:['--no-sandbox']});
const mk=(m,after)=>{const c=structuredClone(actOneCamp(20261021,8).campaign);const done=Array.from({length:after?m:m-1},(_,i)=>i+1);c.completed=done;c.factionTrust={iron:1,free:0,flame:0};Object.assign(c.choices,{m07_deserters:'legion',m08_order:'hold'});const s=newGame(5,c,m);enterHub(s,{aftermath:after,story:false});return s;};
const CASES=[[1,false],[2,false],[3,true],[4,true],[6,true],[7,false],[8,true]];let bad=0,n=0;
try{for(const [label,viewport,touch] of [['1440',{width:1440,height:900},false],['1280',{width:1280,height:720},false],['390',{width:390,height:844},true]]){
 const ctx=await b.newContext({viewport,hasTouch:touch,isMobile:touch});const p=await ctx.newPage();await p.goto(url);const press=async a=>{const el=p.locator(`[data-do="${a}"]`).first();touch?await el.tap():await el.click();await p.waitForTimeout(200);};
 await press('new');await drainStory(p);
 for(const [m,after] of CASES){const base=mk(m,after),h=currentHub(base);
  for(const d of h.places.filter(q=>q.entrance)){const s=structuredClone(base);s.frontier.x=d.x;s.frontier.y=d.y;s.frontier.facing='up';
   await press('menu');await press('backup');await p.fill('#backup-text',serialize(s));await press('restore');await drainStory(p);await p.waitForTimeout(900);
   const v=await p.evaluate(()=>AshenCrown.view().hubCamera),box=await p.locator('#frontier-map').boundingBox();
   const pt=(tx,ty)=>[box.x+v.x+(tx+.5)*64*v.scale,box.y+v.y+(ty+.5)*64*v.scale];
   const clear=async([x,y])=>x>box.x&&x<box.x+box.width&&y>box.y&&y<box.y+box.height&&await p.evaluate(([x,y])=>document.elementFromPoint(x,y)?.id==='frontier-map',[x,y]);
   const ok=await clear(pt(d.entrance.tileX,d.entrance.tileY))&&await clear(pt(d.x,d.y));n++;if(!ok){bad++;console.log('COVERED',label,h.name,d.id);}}}
 await ctx.close();}}finally{await b.close();}
fs.mkdirSync('test-output',{recursive:true});fs.writeFileSync('test-output/hub-doors-e2e.json',JSON.stringify({covered:bad,checked:n},null,1));
console.log(`door-cover: ${n-bad}/${n} doors and approach tiles in the clear with Erik at the door`);if(bad)process.exit(1);
const b2=await launchTestBrowser({headless:true,args:['--no-sandbox']});

let clicks=0,clickBad=0;
const saves2={castletown:()=>{const c=structuredClone(actOneCamp(20261021,8).campaign);c.completed=[1,2,3,4,5,6];c.factionTrust={iron:1,free:0,flame:0};const s=newGame(5,c,7);enterHub(s,{story:false});return s;},
 village:()=>{const s=newGame(5);enterHub(s,{story:false});return s;}};
try{for(const [label,viewport,touch] of [['1440',{width:1440,height:900},false]])for(const [hub,mk] of Object.entries(saves2)){
 const ctx=await b2.newContext({viewport,hasTouch:touch,isMobile:touch,deviceScaleFactor:1});const p=await ctx.newPage();await p.goto(url);
 const press=async a=>{const el=p.locator(`[data-do="${a}"]`).first();touch?await el.tap():await el.click();await p.waitForTimeout(250);};
 await press('new');await drainStory(p);const s0=mk();await press('menu');await press('backup');await p.fill('#backup-text',serialize(s0));await press('restore');await p.waitForTimeout(400);await drainStory(p);
 const h=currentHub(s0);for(const d of h.places.filter(q=>q.entrance)){
  const st=await p.evaluate(()=>AshenCrown.snapshot());if(st.frontier.interior){await p.locator('[data-do="exit-interior"],[data-do="shop-exit"]').first().click().catch(()=>{});}
  const v=await p.evaluate(()=>AshenCrown.view().hubCamera),box=await p.locator('#frontier-map').boundingBox();
  const bd=h.buildings.find(q=>q.buildingId===d.buildingId);let px=0,py=0,visible=false;
  for(let ty=bd.y+bd.h-1;ty>=bd.y&&!visible;ty--)for(let tx=bd.x;tx<bd.x+bd.w&&!visible;tx++){px=box.x+v.x+(tx+.5)*64*v.scale;py=box.y+v.y+(ty+.5)*64*v.scale;
   if(px>box.x+4&&px<box.x+box.width-4&&py>box.y+4&&py<box.y+box.height-4){const hit=await p.evaluate(([x,y])=>document.elementFromPoint(x,y)?.id,[px,py]);visible=hit==='frontier-map';}}
  if(visible){touch?await p.touchscreen.tap(px,py):await p.mouse.click(px,py);}
  for(let i=0;i<40;i++){await p.waitForTimeout(150);if(!(await p.evaluate(()=>AshenCrown.view().busy)))break;}
  const s=await p.evaluate(()=>AshenCrown.snapshot());const toast=await p.locator('#toast').textContent().catch(()=>'');
  if(!(visible&&s.frontier.x===d.x&&s.frontier.y===d.y)){clickBad++;console.log('NOT ENTERED',label,hub,d.id);}clicks++;
  for(let i=0;i<4&&await p.locator('#modal-root .modal-backdrop').count();i++){await p.keyboard.press('Escape');await p.waitForTimeout(200);if(await p.locator('#modal-root [data-do="close-modal"]').count())await p.locator('#modal-root [data-do="close-modal"]').first().click().catch(()=>{});}
  // reset to spawn
  await press('menu');await press('backup');await p.fill('#backup-text',serialize(s0));await press('restore');await p.waitForTimeout(300);await drainStory(p);}
 await ctx.close();}}finally{await b2.close();}
console.log(`house-click: ${clicks-clickBad}/${clicks} houses entered by clicking the house at 1440`);if(clickBad)process.exit(1);
