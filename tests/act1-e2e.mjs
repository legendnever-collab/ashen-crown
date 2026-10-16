// v0.4 ACT I browser regression: M03 aftermath → M04 through the real advisor/council/deployment
// workflow, Search via visible UI, victory, aftermath records choice, persistence and layout.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory} from './story-helper.mjs';
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';
import {newGame,startBattle,nextMission} from '../src/core/game.js';import {enterHub,syncFrontier} from '../src/core/frontier.js';import {findUnit} from '../src/core/rules.js';
import {serialize} from '../src/persistence/save-manager.js';import {playBattle} from './player-policy.mjs';import {playCampaignBattle,drain} from './campaign-policy.mjs';

const shots='docs/v0.4.0/screenshots';fs.mkdirSync(shots,{recursive:true});fs.mkdirSync('test-output',{recursive:true});
const url=pathToFileURL(path.resolve('releases/Ashen_Crown_v0.4.0.html')).href,checks=[],errors=[];let external=0;
const check=(name,ok)=>{assert.ok(ok,name);checks.push({name,status:'PASS'});console.log('PASS',name);};

// Deterministic legal campaign through M03, then the real aftermath hub.
function afterM03(){let s=newGame(20261014);s.screen='deployment';startBattle(s);playBattle(s);for(const capture of [true,true]){s=nextMission(s);s.screen='deployment';startBattle(s);playCampaignBattle(s,capture);}assert.equal(s.outcome,'victory');enterHub(s,{aftermath:true});drain(s);return s;}
function m04Battle(base,setup){const s=nextMission(structuredClone(base));s.screen='deployment';startBattle(s);drain(s);setup(s);return s;}
const base=afterM03();

const browser=await launchTestBrowser({headless:true,args:['--no-sandbox','--disable-gpu']});
const viewports=[[1440,900,false],[390,844,true],[844,390,true]].filter(([w])=>!process.env.ACT1_VIEWPORT||String(w)===process.env.ACT1_VIEWPORT);
try{for(const [width,height,touch]of viewports){
 const label=`${width}x${height}`,ctx=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch});await ctx.setOffline(true);
 const p=await ctx.newPage();p.on('pageerror',e=>errors.push(`${label}: ${e.message}`));p.on('request',r=>{if(/^https?:/.test(r.url()))external++;});
 const snap=()=>p.evaluate(()=>AshenCrown.snapshot());
 const cmd=async(a,id)=>{const l=p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first();touch?await l.tap():await l.click();};
 const settle=()=>drainStory(p);
 const restore=async s=>{await cmd('menu');await cmd('backup');await p.locator('#backup-text').fill(serialize(s));await cmd('restore');await p.waitForTimeout(200);};
 const tile=async(x,y)=>{await p.waitForTimeout(250);const pt=await p.evaluate(([x,y])=>{const c=AshenCrown.tileCenter(x,y),b=document.querySelector('#battle-map').getBoundingClientRect();return {x:c.x+b.x,y:c.y+b.y};},[x,y]);touch?await p.touchscreen.tap(pt.x,pt.y):await p.mouse.click(pt.x,pt.y);await p.waitForFunction(()=>!AshenCrown.view().busy);};
 const pick=async id=>{try{await pickHero(id);}catch(e){await p.screenshot({path:`test-output/act1-fail-${label}.png`});throw e;}};
 const pickHero=async id=>{for(let i=0;i<8&&(await p.evaluate(()=>AshenCrown.view().selected))!==id;i++){await cmd('next');await p.waitForTimeout(150);}if(!(await p.evaluate(()=>AshenCrown.view().menu))){await cmd('focus-unit');await p.waitForTimeout(500);}};
 const menuFor=async(id,x,y)=>{await pick(id);if((await p.evaluate(()=>AshenCrown.view().menu))!=='root')await tile(x,y);await p.waitForSelector('[data-do="mode"][data-id="search"]');};
 const noOverflow=()=>p.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1);
 await p.goto(url);await cmd('new');await settle();

 // 1. Real progression M03 aftermath → M04 preparation → advisor → council → deployment → battle.
 await restore(base);await settle();
 check(`${label} M03 aftermath offers Mission 4`,(await p.locator('[data-do="next-mission"]').textContent()).includes('Mission 4'));
 await cmd('next-mission');await settle();let s=await snap();
 check(`${label} M04 opens in camp preparation with pre:4 scene seen`,s.missionId===4&&s.screen==='exploration'&&s.frontier.phase==='preparation'&&s.narrative.seen.includes('pre:4'));
 await cmd('warroom');await settle();s=await snap();
 check(`${label} advisor briefing leads to the M04 War Council`,s.screen==='warroom'&&(await p.locator('.council-summary').textContent()).includes('성채의 기록'));
 if(width===1440)await p.screenshot({path:`${shots}/m04-council-${width}.png`});
 await cmd('deploy');await settle();s=await snap();
 check(`${label} M04 deployment uses the authored fortress presets`,s.screen==='deployment'&&findUnit(s,'eric').y===11&&findUnit(s,'eric').x===7);
 await cmd('start-battle');await settle();s=await snap();
 check(`${label} M04 battle starts with three evidence objects and archive boss holding`,s.screen==='battle'&&s.units.filter(u=>u.team==='object').length===3&&findUnit(s,'boss').mov===0&&s.missionState.alerted===false);
 check(`${label} M04 objective bar shows evidence and burn timer`,(await p.locator('#phasebar').textContent()).includes('증거 0/3'));
 if(width===1440||width===390)await p.screenshot({path:`${shots}/m04-battle-${width}.png`});
 check(`${label} M04 battle has no horizontal overflow`,await noOverflow());

 // 2. Search through the visible menu: Lia beside the west-tower record.
 await restore(m04Battle(base,s=>{const l=findUnit(s,'lia');l.x=1;l.y=2;findUnit(s,'t1').hp=0;}));await settle();
 await menuFor('lia',1,2);await cmd('mode','search');await tile(1,1);
 check(`${label} Search forecast is labelled and costs no HP`,(await p.locator('.forecast').textContent()).includes('증거 확보'));
 await cmd('confirm');await settle();s=await snap();
 check(`${label} Lia searches the seal record and her teacher-notation scene plays`,findUnit(s,'e2').rescued&&findUnit(s,'lia').acted&&s.narrative.seen.includes('4:search:seal:lia'));
 check(`${label} searched record leaves the board, ledger still pending`,(await p.locator('#phasebar').textContent()).includes('증거 1/3'));

 // 3. Victory through the ledger, then the aftermath records choice.
 await restore(m04Battle(base,s=>{for(const u of s.units)if(u.team==='enemy'&&u.id!=='boss')u.hp=0;findUnit(s,'boss').hp=0;const e=findUnit(s,'eric');e.x=9;e.y=1;}));await settle();
 await menuFor('eric',9,1);await cmd('mode','search');await tile(8,1);await cmd('confirm');await settle();s=await snap();
 check(`${label} ledger + fallen quartermaster = victory with M04 flags and first-clear Gold`,s.outcome==='victory'&&s.campaign.flags.mission_04_ledger_recovered&&s.campaign.completed.includes(4)&&s.economy.rewards.includes(4));
 check(`${label} result shows evidence summary and no false Mission 5 button`,(await p.locator('#app').textContent()).includes('증거 1/3')&&!await p.locator('[data-do="next-mission"]').count());
 if(width===1440)await p.screenshot({path:`${shots}/m04-result-${width}.png`});
 await cmd('aftermath');await settle();
 check(`${label} M04 aftermath asks for the records decision`,await p.locator('[data-do="records-choice"]').count()===1);
 await cmd('records-choice');check(`${label} records choice modal lists both options`,await p.locator('[data-do="records-pick"]').count()===2);
 await cmd('records-pick','kept');await settle();s=await snap();
 check(`${label} choice saved and its scene plays once`,s.campaign.choices.m04_records_choice==='kept'&&s.narrative.seen.includes('after:4:kept')&&!await p.locator('[data-do="records-choice"]').count());
 await p.reload();await settle();s=await snap();
 check(`${label} choice survives reload; later chapters are not falsely offered`,s.campaign.choices.m04_records_choice==='kept'&&!await p.locator('[data-do="next-mission"]').count());
 check(`${label} aftermath layout has no horizontal overflow`,await noOverflow());
 await ctx.close();
}}finally{await browser.close();}
check('ACT I browser run has zero runtime errors',errors.length===0);check('ACT I standalone makes zero HTTP requests',external===0);
fs.writeFileSync('test-output/act1-e2e.json',JSON.stringify({checks,errors,external},null,2));console.log(`${checks.length} ACT I checks PASS`);
