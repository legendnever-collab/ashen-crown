// v0.5.0 Phase E browser flow: ACT I camp → Aren's rite panel → Kai's trial played by touch → promotion
// scene → promoted in camp; Legion Drill launch and reload. Desktop panel layout is checked too.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize} from '../src/persistence/save-manager.js';import {actOneCamp} from './skirmish-policy.mjs';
const camp=actOneCamp(20261021,6,{kai_rescue:4,kai_bypass:2,m6_kai_lever:1});
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});let n=0;const results=[];const check=(name,ok)=>{assert.ok(ok,name);n++;results.push(name);console.log('PASS',name);};
const url=pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.5.0.html').href;
try{
 // Desktop: panel layout and conditions
 {const ctx=await b.newContext({viewport:{width:1440,height:900}});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const press=async(a,id)=>{await p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first().click();await p.waitForTimeout(300);};
  await p.goto(url);await press('new');await drainStory(p);await press('menu');await press('backup');await p.fill('#backup-text',serialize(camp));await press('restore');await drainStory(p);
  check('1440 ACT I camp offers the rite panel',await p.locator('[data-do="legion"]').count()===1);await press('legion');
  check('1440 panel lists five heroes with conditions',await p.locator('.legion-row').count()===5&&await p.locator('.legion-checks').count()===5);
  check('1440 only Kai (Lv 6, potential 3/3) may start a trial',await p.locator('[data-do="trial-start"][data-id="kai"]:not([disabled])').count()===1&&await p.locator('[data-do="trial-start"]:not([disabled])').count()===1);
  await p.screenshot({path:'test-output/legion-panel-1440.png'});check('1440 no runtime errors',errors.length===0);await ctx.close();}
 // Phone: full trial
 const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,deviceScaleFactor:2});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 const press=async(a,id)=>{await p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first().tap();await p.waitForTimeout(300);};
 const tile=async(x,y)=>{const pt=await p.evaluate(([x,y])=>{const c=AshenCrown.tileCenter(x,y),b=document.querySelector('#battle-map').getBoundingClientRect();return {x:c.x+b.x,y:c.y+b.y};},[x,y]);await p.touchscreen.tap(pt.x,pt.y);await p.waitForTimeout(400);};
 const v=()=>p.evaluate(()=>AshenCrown.view()),snap=()=>p.evaluate(()=>AshenCrown.snapshot()),unit=async id=>(await snap()).units.find(u=>u.id===id);
 const idle=()=>p.waitForFunction(()=>!AshenCrown.view().busy,{},{timeout:30000});
 const pick=async id=>{if(await p.locator('[data-do="close-unit-menu"]').count())await press('close-unit-menu');const u=await unit(id);await tile(u.x,u.y);if((await v()).selected!==id){await press('reset-camera');await tile(u.x,u.y);}};
 const moveTo=async(id,pickCell)=>{await pick(id);await press('mode','move');await p.waitForTimeout(150);const cell=pickCell((await v()).ranges);await tile(cell.x,cell.y);await idle();await press('confirm-move');await idle();return cell;};
 await p.goto(url);await press('new');await drainStory(p);await press('menu');await press('backup');await p.fill('#backup-text',serialize(camp));await press('restore');await drainStory(p);
 await press('legion');await press('trial-start','kai');await drainStory(p);await p.waitForTimeout(400);
 let s=await snap();check('390 Kai trial starts (PROMOTION TRIAL, Kai provisionally Shadowblade, others in reserve)',s.screen==='battle'&&s.missionId===105&&s.units.find(u=>u.id==='kai').classTier===2&&s.units.filter(u=>u.team==='ally'&&u.benched).length===4&&(await p.locator('#phasebar').textContent()).includes('PROMOTION TRIAL'));
 await moveTo('kai',r=>r.find(c=>c.x===6&&c.y===4));check('390 Kai reaches the sentinel',(await unit('kai')).y===4);
 await press('submenu','skills');await press('mode','exchange');await tile(6,3);check('390 exchange forecast on the sentinel',(await v()).preview==='s1');await tile(6,3);await idle();
 check('390 Shadow Exchange puts Kai in the gate',(await unit('kai')).y===3&&(await unit('s1')).y===4);
 await press('end-phase');if(await p.locator('[data-do="confirm-end-phase"]').count())await press('confirm-end-phase');await p.waitForFunction(()=>AshenCrown.snapshot().phase==='player'&&!AshenCrown.view().busy,{},{timeout:60000});await drainStory(p);
 await moveTo('kai',r=>r.filter(c=>c.y===0).sort((a,b)=>Math.abs(a.x-6)-Math.abs(b.x-6))[0]);await press('wait');await idle();await drainStory(p);
 s=await snap();check('390 trial won when Kai reaches the top row',s.outcome==='victory'&&s.screen==='result');check('390 result shows the promotion',(await p.locator('.reward-chip.promo').textContent()).includes('그림자 추적자'));
 await p.screenshot({path:'test-output/legion-result-390.png'});
 await press('aftermath');await p.waitForTimeout(500);check('390 promotion scene plays on return',(await p.locator('.dialogue-name').first().textContent()).length>0);await p.screenshot({path:'test-output/legion-promo-390.png'});await drainStory(p);
 check('390 rank-up card follows the scene (Shadowblade, Shadow Exchange)',await p.locator('.promo-card').count()===1&&(await p.locator('.promo-card').textContent()).includes('그림자 추적자')&&(await p.locator('.promo-card').textContent()).includes('그림자 교환')&&await p.locator('.promo-card canvas[data-promo]').count()===2);
 check('390 the rite theme plays under the card',(await p.evaluate(()=>AshenCrown.audio().scene))==='rite');await p.waitForTimeout(900);await p.screenshot({path:'test-output/legion-promo-card-390.png'});await press('close-modal');
 await p.reload();await p.waitForFunction(()=>!!window.AshenCrown);await p.waitForTimeout(400);check('390 the card is shown once',!await p.locator('.promo-card').count());
 s=await snap();const kai=s.campaign.heroes.find(h=>h.id==='kai');check('390 back in the ACT I camp with Kai promoted for good',s.screen==='exploration'&&s.missionId===6&&!s.practice&&kai.classTier===2&&s.campaign.promotions.kai?.key==='shadowblade');
 await press('legion');check('390 panel marks Kai as promoted',await p.locator('.legion-row.done').count()===1);
 // Legion Drill: all five deploy; survives a reload mid-battle
 await press('drill-start');await drainStory(p);s=await snap();check('390 Legion Drill starts with all five heroes',s.missionId===110&&s.units.filter(u=>u.team==='ally'&&!u.benched).length===5&&s.units.find(u=>u.id==='kai').classTier===2);
 await p.reload();await p.waitForFunction(()=>!!window.AshenCrown);await p.waitForTimeout(500);s=await snap();check('390 drill survives reload (skirmish return point kept)',s.missionId===110&&s.screen==='battle'&&!!s.skirmish?.frontier);
 check('390 no runtime errors',errors.length===0);await ctx.close();
 console.log(`${n} legion checks PASS`);
}finally{fs.mkdirSync('test-output',{recursive:true});fs.writeFileSync('test-output/legion-e2e.json',JSON.stringify({checks:results},null,1));await b.close();}
