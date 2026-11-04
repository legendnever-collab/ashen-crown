// Browser migration (v0.8.0): saves made by the actually shipped v0.7.1 HTML and by the v0.7.1 source
// (tests/fixtures/v071) open in v0.8.0 through the visible backup dialog: schema 9 → 10, the summit camp after ACT II keeps
// every asset, the heroes' new skills show in battle, and the mid-M14 battle resumes.
import {launchTestBrowser} from './browser-helper.mjs';import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';import {drainStory} from './story-helper.mjs';import {arms081View} from '../src/persistence/save-manager.js';
// v0.6 (D-060): names were rewritten in Hangul; compare saves without the display name.
const nmStrip=a=>(a||[]).map(({name,...u})=>u);
const browser=await launchTestBrowser({headless:true,args:['--no-sandbox','--disable-gpu']}),checks=[],errors=[];const check=(name,ok)=>{assert.ok(ok,name);checks.push({name,status:'PASS'});console.log('PASS',name);};
const fixture=n=>JSON.parse(fs.readFileSync(`tests/fixtures/v071/v071-${n}.json`,'utf8'));
try{const ctx=await browser.newContext({viewport:{width:1440,height:900}});await ctx.setOffline(true);
 const cmd=async(p,a,id)=>{await p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first().click();await p.waitForTimeout(150);};const snapshot=p=>p.evaluate(()=>AshenCrown.snapshot());
 const backup=async p=>{await cmd(p,'menu');await cmd(p,'backup');const text=await p.locator('#backup-text').inputValue();await cmd(p,'close-modal');return text;};
 // 1. Saves produced by the shipped v0.7.1 page: the village, then a Mission 01 battle checkpoint.
 const old=await ctx.newPage();old.on('pageerror',e=>errors.push(`v071: ${e.message}`));await old.goto(pathToFileURL(path.resolve('releases/Ashen_Crown_v0.7.1.html')).href);
 await cmd(old,'new');await drainStory(old);const village=await snapshot(old),villageText=await backup(old);check('Shipped v0.7.1 village save is schema 9',village.schema===9&&village.screen==='exploration'&&village.frontier.hub==='village');
 await cmd(old,'npc','advisor');await drainStory(old);if(await old.locator('[data-do="advisor-operation"]').count())await cmd(old,'advisor-operation');await drainStory(old);await cmd(old,'deploy');await cmd(old,'start-battle');await drainStory(old);
 const battle=await snapshot(old),battleText=await backup(old);check('Shipped v0.7.1 battle checkpoint generated',battle.screen==='battle'&&battle.stageStart.schema===9);
 // 2. Restore each into v0.8.0.
 const p=await ctx.newPage();p.on('pageerror',e=>errors.push(`v080: ${e.message}`));await p.goto(pathToFileURL(path.resolve('releases/Ashen_Crown_v0.9.0.html')).href);await p.waitForFunction(()=>!!window.AshenCrown);if(await p.locator('[data-do="new"]').count()){await cmd(p,'new');}await drainStory(p);
 const restore=async text=>{await drainStory(p);await cmd(p,'menu');await cmd(p,'backup');await p.locator('#backup-text').fill(text);await cmd(p,'restore');await p.waitForFunction(()=>!AshenCrown.view().busy);await p.waitForTimeout(300);};
 await restore(villageText);let s=await snapshot(p);
 check('v0.7.1 village save opens in the painted village (schema 10, gold kept, legal position)',s.schema===12&&s.screen==='exploration'&&s.frontier.hub==='village'&&s.economy.gold===village.economy.gold&&JSON.stringify(nmStrip(s.campaign.heroes))===JSON.stringify(nmStrip(village.campaign.heroes)));
 check('Imported village save does not replay the world-map intro',!s.narrative.active?.key?.startsWith('world:'));
 await restore(battleText);s=await snapshot(p);check('v0.7.1 battle and its checkpoint migrate unchanged',s.screen==='battle'&&s.stageStart.schema===12&&JSON.stringify(nmStrip(s.units))===JSON.stringify(nmStrip(battle.units))&&JSON.stringify(s.economy)===JSON.stringify(arms081View(battle.economy)));
 await cmd(p,'menu');await cmd(p,'restart-stage');await cmd(p,'confirm-restart-stage');await p.waitForFunction(()=>!AshenCrown.view().busy);s=await snapshot(p);check('Restart of a migrated v0.7.1 battle works',s.screen==='battle'&&s.turn===1);
 // 3. Source-built fixtures: the v0.7.1 end-of-content camp (summit after M14) and a mid-M14 battle.
 const done=fixture('m14-camp'),before=JSON.parse(JSON.parse(done.save).data);await restore(done.save);s=await snapshot(p);
 check('v0.7.1 summit-camp save (ACT II complete) opens with every asset kept and the roster intact',s.schema===12&&s.frontier.hub==='summit'&&JSON.stringify(s.campaign.economy)===JSON.stringify(arms081View(before.campaign.economy))&&JSON.stringify(s.campaign.roster)===JSON.stringify(before.campaign.roster)&&JSON.stringify(s.campaign.factionTrust)===JSON.stringify(before.campaign.factionTrust)&&!!s.campaign.flags.act2_completed);
 for(let i=0;i<3&&await p.locator('#modal-root .modal').count();i++){await cmd(p,'close-modal');await drainStory(p);}
 check('The migrated camp still says ACT III comes in a later update',(await p.locator('body').textContent()).includes('ACT III'));
 await p.screenshot({path:'test-output/migration-v071-summit.png'});
 await restore(fixture('m14-battle').save);s=await snapshot(p);check('v0.7.1 Mission 14 battle resumes',s.screen==='battle'&&s.missionId===14&&s.stageStart.schema===12&&s.units.some(u=>u.id==='cassian'));
 await cmd(p,'open-unit-menu');await cmd(p,'submenu','skills');const menu=await p.locator('#unit-popover').textContent();
 check('Erik of a v0.7.1 save now has ② 도발 in battle and his promotion action as ③',menu.includes('도발')&&menu.includes('②')&&menu.includes('③'));await cmd(p,'close-unit-menu');
 await p.reload();await p.waitForFunction(()=>!!window.AshenCrown&&!AshenCrown.view().busy);s=await snapshot(p);check('Migrated save reloads as the current version',s.schema===12&&s.version==='0.9.0'&&s.missionId===14);
 check('No runtime errors in either build',errors.length===0);await ctx.close();
}finally{fs.mkdirSync('test-output',{recursive:true});fs.writeFileSync('test-output/migration-v071-browser.json',JSON.stringify({checks,errors},null,2));await browser.close();}
console.log(`${checks.length} v0.7.1 browser migration checks PASS`);
