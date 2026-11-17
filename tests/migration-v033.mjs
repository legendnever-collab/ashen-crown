// Browser migration: saves made by the actually shipped v0.3.3 HTML (and the v0.3.3-source fixtures) open in v0.4.0.
import {launchTestBrowser} from './browser-helper.mjs';import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';import {drainStory} from './story-helper.mjs';import {econV200} from './v200-compat.mjs';import {arms081View} from '../src/persistence/save-manager.js';
// v2.0.0 (D-115, REFORM_DESIGN §8): heroes gain the six stats (numbers recomputed), the officers join, the start treasures
// are added and unfit gear is taken off into the bag; a battle in progress reopens in the camp before it.
const OFFICERS=['bram','noa','marta','rowell'],heroKey=h=>({id:h.id,level:h.level,xp:h.xp,classTier:h.classTier??1,clues:h.clues,growthHistory:h.growthHistory});
const sameHeroes=(a,b)=>JSON.stringify((a||[]).filter(h=>!OFFICERS.includes(h.id)).map(heroKey))===JSON.stringify((b||[]).filter(h=>!OFFICERS.includes(h.id)).map(heroKey));
const sameRoster=(a,b)=>JSON.stringify((a||[]).filter(id=>!OFFICERS.includes(id)))===JSON.stringify((b||[]).filter(id=>!OFFICERS.includes(id)));
const reopened=(s,id)=>s.screen==='exploration'&&s.migrated200==='battle'&&!s.stageStart&&(id==null||s.missionId===id);
// v0.6 (D-060): names were rewritten in Hangul; compare saves without the display name.
const nmStrip=a=>(a||[]).map(({name,...u})=>u);
const browser=await launchTestBrowser({headless:true,args:['--no-sandbox','--disable-gpu']}),checks=[],errors=[];const check=(name,ok)=>{assert.ok(ok,name);checks.push({name,status:'PASS'});console.log('PASS',name);};
const fixture=n=>JSON.parse(fs.readFileSync(`tests/fixtures/v033/v033-${n}.json`,'utf8')).save;
try{const ctx=await browser.newContext();await ctx.setOffline(true);
 const cmd=async(p,a,id)=>{await p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first().click();};const snapshot=p=>p.evaluate(()=>AshenCrown.snapshot());
 const backup=async p=>{await cmd(p,'menu');await cmd(p,'backup');const text=await p.locator('#backup-text').inputValue();await cmd(p,'close-modal');return text;};
 // 1. A save produced by the shipped v0.3.3 page: new campaign → advisor → council → battle checkpoint.
 const old=await ctx.newPage();old.on('pageerror',e=>errors.push(`v033: ${e.message}`));await old.goto(pathToFileURL(path.resolve('releases/Ashen_Crown_v0.3.3.html')).href);
 await cmd(old,'new');await drainStory(old);const village=await snapshot(old),villageText=await backup(old);check('Shipped v0.3.3 village save is schema 6',village.schema===6&&village.screen==='exploration');
 await cmd(old,'npc','advisor');await drainStory(old);if(await old.locator('[data-do="advisor-operation"]').count())await cmd(old,'advisor-operation');await drainStory(old);await cmd(old,'deploy');await cmd(old,'start-battle');await drainStory(old);
 const battle=await snapshot(old),battleText=await backup(old);check('Shipped v0.3.3 battle checkpoint generated',battle.screen==='battle'&&battle.stageStart.schema===6);
 // 2. Restore each into v0.4.0 through the visible backup dialog.
 const p=await ctx.newPage();p.on('pageerror',e=>errors.push(`v040: ${e.message}`));await p.goto(pathToFileURL(path.resolve('releases/Ashen_Crown_v2.0.0.html')).href);
 const restore=async text=>{await cmd(p,'menu');await cmd(p,'backup');await p.locator('#backup-text').fill(text);await cmd(p,'restore');await p.waitForFunction(()=>!AshenCrown.view().busy);};
 await restore(villageText);let s=await snapshot(p);check('v0.3.3 village save imports as schema 10 in the same place',s.schema===20&&s.screen==='exploration'&&s.frontier.x===village.frontier.x&&s.frontier.y===village.frontier.y&&s.economy.gold===village.economy.gold);
 await restore(battleText);s=await snapshot(p);check('v0.3.3 battle reopens in the camp before it (v2.0.0)',reopened(s));
 for(const a of ['warroom','deploy','start-battle']){await cmd(p,a);await drainStory(p);}await p.waitForFunction(()=>!AshenCrown.view().busy);s=await snapshot(p);check('The reopened v0.3.3 battle departs again from the camp',s.screen==='battle'&&s.turn===1);
 // 3. The source-built fixtures: mid-M02 battle and the M03 aftermath camp with purchases.
 await restore(fixture('m02-battle'));s=await snapshot(p);check('v0.3.3 Mission 02 battle reopens in the camp before it (v2.0.0)',reopened(s,2));
 await restore(fixture('m03-aftermath'));s=await snapshot(p);check('v0.3.3 M03 aftermath keeps gear, items and gold',s.missionId===3&&s.frontier.phase==='aftermath'&&s.economy.equipped.eric.weapon==='g2'&&s.economy.items.medium===3&&s.economy.gold===475);
 await cmd(p,'npc','advisor');await drainStory(p);await cmd(p,'close-modal').catch(()=>{});check('v0.3.3 aftermath offers the Mission 4 departure',(await p.locator('[data-do="next-mission"]').first().textContent()).includes('Mission 4'));
 await cmd(p,'next-mission');await drainStory(p);s=await snapshot(p);check('Migrated campaign moves on to Mission 04 with its purse',s.missionId===4&&s.economy.gold>=475&&s.campaign.completed.join()==='1,2,3');
 await p.reload();await p.waitForFunction(()=>!AshenCrown.view().busy);s=await snapshot(p);check('Migrated M04 camp is saved as the current version and reloads',s.schema===20&&s.missionId===4);
 check('No runtime errors in either build',errors.length===0);await ctx.close();
}finally{fs.mkdirSync('test-output',{recursive:true});fs.writeFileSync('test-output/migration-v033.json',JSON.stringify({checks,errors},null,2));await browser.close();}
