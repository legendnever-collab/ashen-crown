// Browser migration (v0.6.0 release): saves made by the actually shipped v0.5.0 HTML and by the
// v0.5.0 source (tests/fixtures/v050) open in v0.6.0 through the visible backup dialog and continue into ACT II.
import {launchTestBrowser} from './browser-helper.mjs';import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';import {drainStory} from './story-helper.mjs';
// v0.6 (D-060): names were rewritten in Hangul; compare saves without the display name.
const nmStrip=a=>(a||[]).map(({name,...u})=>u);
const browser=await launchTestBrowser({headless:true,args:['--no-sandbox','--disable-gpu']}),checks=[],errors=[];const check=(name,ok)=>{assert.ok(ok,name);checks.push({name,status:'PASS'});console.log('PASS',name);};
const fixture=n=>JSON.parse(fs.readFileSync(`tests/fixtures/v050/v050-${n}.json`,'utf8'));
try{const ctx=await browser.newContext({viewport:{width:1440,height:900}});await ctx.setOffline(true);
 const cmd=async(p,a,id)=>{await p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first().click();await p.waitForTimeout(150);};const snapshot=p=>p.evaluate(()=>AshenCrown.snapshot());
 const backup=async p=>{await cmd(p,'menu');await cmd(p,'backup');const text=await p.locator('#backup-text').inputValue();await cmd(p,'close-modal');return text;};
 // 1. Saves produced by the shipped v0.5.0 page: the village, then a Mission 01 battle checkpoint.
 const old=await ctx.newPage();old.on('pageerror',e=>errors.push(`v050: ${e.message}`));await old.goto(pathToFileURL(path.resolve('releases/Ashen_Crown_v0.5.0.html')).href);
 await cmd(old,'new');await drainStory(old);const village=await snapshot(old),villageText=await backup(old);check('Shipped v0.5.0 village save is schema 8',village.schema===8&&village.screen==='exploration'&&village.frontier.hub==='village');
 await cmd(old,'npc','advisor');await drainStory(old);if(await old.locator('[data-do="advisor-operation"]').count())await cmd(old,'advisor-operation');await drainStory(old);await cmd(old,'deploy');await cmd(old,'start-battle');await drainStory(old);
 const battle=await snapshot(old),battleText=await backup(old);check('Shipped v0.5.0 battle checkpoint generated',battle.screen==='battle'&&battle.stageStart.schema===8);
 // 2. Restore each into v0.6.0.
 const p=await ctx.newPage();p.on('pageerror',e=>errors.push(`v060: ${e.message}`));await p.goto(pathToFileURL(path.resolve('releases/Ashen_Crown_v0.6.0.html')).href);await p.waitForFunction(()=>!!window.AshenCrown);if(await p.locator('[data-do="new"]').count()){await cmd(p,'new');}await drainStory(p);
 const restore=async text=>{await drainStory(p);await cmd(p,'menu');await cmd(p,'backup');await p.locator('#backup-text').fill(text);await cmd(p,'restore');await p.waitForFunction(()=>!AshenCrown.view().busy);await p.waitForTimeout(300);};
 await restore(villageText);let s=await snapshot(p);
 check('v0.5.0 village save opens in the painted village (schema 9, gold kept, legal position)',s.schema===9&&s.screen==='exploration'&&s.frontier.hub==='village'&&s.economy.gold===village.economy.gold&&JSON.stringify(nmStrip(s.campaign.heroes))===JSON.stringify(nmStrip(village.campaign.heroes)));
 check('Imported village save does not replay the world-map intro',!s.narrative.active?.key?.startsWith('world:'));
 await restore(battleText);s=await snapshot(p);check('v0.5.0 battle and its checkpoint migrate unchanged',s.screen==='battle'&&s.stageStart.schema===9&&JSON.stringify(nmStrip(s.units))===JSON.stringify(nmStrip(battle.units))&&JSON.stringify(s.economy)===JSON.stringify(battle.economy));
 await cmd(p,'menu');await cmd(p,'restart-stage');await cmd(p,'confirm-restart-stage');await p.waitForFunction(()=>!AshenCrown.view().busy);s=await snapshot(p);check('Restart of a migrated v0.5.0 battle works',s.screen==='battle'&&s.turn===1);
 // 3. Source-built fixtures: ACT I complete oath camp (oath chosen, Eric promoted) and a mid-M06 battle.
 const done=fixture('act1-complete'),before=JSON.parse(JSON.parse(done.save).data);await restore(done.save);s=await snapshot(p);
 check('ACT I complete save opens in the oath camp with every asset kept and the promotion intact',s.schema===9&&s.frontier.hub==='oathcamp'&&s.frontier.phase==='aftermath'&&JSON.stringify(s.campaign.economy)===JSON.stringify(before.campaign.economy)&&s.campaign.completed.join()===before.campaign.completed.join()&&s.campaign.heroes.find(h=>h.id==='eric').classTier===2&&Array.isArray(s.campaign.roster));
 for(let i=0;i<3&&await p.locator('#modal-root .modal').count();i++){await cmd(p,'close-modal');await drainStory(p);}
 check('The migrated camp offers the march to Mission 7 (ACT II)',(await p.locator('[data-do="next-mission"]').first().textContent().catch(()=>'')).includes('Mission 7'));
 await cmd(p,'next-mission');for(let i=0;i<8&&await p.locator('[data-do="story-next"]').count();i++)await cmd(p,'story-next');await drainStory(p);s=await snapshot(p);
 check('A v0.5.0 campaign reaches the castle town for Mission 7',s.missionId===7&&s.frontier.hub==='castletown'&&!s.practice&&s.campaign.factionTrust.iron===-1);
 await p.screenshot({path:'test-output/migration-v050-castletown.png'});
 await restore(fixture('m06-battle').save);s=await snapshot(p);check('v0.5.0 Mission 06 battle resumes',s.screen==='battle'&&s.missionId===6&&s.stageStart.schema===9);
 await p.reload();await p.waitForFunction(()=>!!window.AshenCrown&&!AshenCrown.view().busy);s=await snapshot(p);check('Migrated save reloads as the current version',s.schema===9&&s.version==='0.6.0'&&s.missionId===6);
 check('No runtime errors in either build',errors.length===0);await ctx.close();
}finally{fs.mkdirSync('test-output',{recursive:true});fs.writeFileSync('test-output/migration-v050-browser.json',JSON.stringify({checks,errors},null,2));await browser.close();}
console.log(`${checks.length} v0.5.0 browser migration checks PASS`);
