// Browser migration (v0.10.0): saves made by the shipped v0.9.3 HTML and by the v0.9.3 source (tests/fixtures/v093) open in
// v0.10.0 through the visible backup dialog: schema 15 → 16 with nothing changed, the lower city after M22 (ACT III complete)
// keeps every asset and goes on to Mission 23 (the alliance camp), and the mid-M22 battle resumes in the square.
import {launchTestBrowser} from './browser-helper.mjs';import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';import {drainStory} from './story-helper.mjs';
// v0.6 (D-060): names were rewritten in Hangul; compare saves without the display name.
const nmStrip=a=>(a||[]).map(({name,...u})=>u);
const browser=await launchTestBrowser({headless:true,args:['--no-sandbox','--disable-gpu']}),checks=[],errors=[];const check=(name,ok)=>{assert.ok(ok,name);checks.push({name,status:'PASS'});console.log('PASS',name);};
const fixture=n=>JSON.parse(fs.readFileSync(`tests/fixtures/v093/v093-${n}.json`,'utf8'));
try{const ctx=await browser.newContext({viewport:{width:1440,height:900}});await ctx.setOffline(true);
 const cmd=async(p,a,id)=>{await p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first().click();await p.waitForTimeout(150);};const snapshot=p=>p.evaluate(()=>AshenCrown.snapshot());
 const backup=async p=>{await cmd(p,'menu');await cmd(p,'backup');const text=await p.locator('#backup-text').inputValue();await cmd(p,'close-modal');return text;};
 // 1. Saves produced by the shipped v0.9.1 page: the village, then a Mission 01 battle checkpoint.
 const old=await ctx.newPage();old.on('pageerror',e=>errors.push(`v0100: ${e.message}`));await old.goto(pathToFileURL(path.resolve('releases/Ashen_Crown_v0.9.3.html')).href);
 await cmd(old,'new');await drainStory(old);const village=await snapshot(old),villageText=await backup(old);check('Shipped v0.9.3 village save is schema 15',village.schema===15&&village.screen==='exploration'&&village.frontier.hub==='village');
 await cmd(old,'npc','advisor');await drainStory(old);if(await old.locator('[data-do="advisor-operation"]').count())await cmd(old,'advisor-operation');await drainStory(old);await cmd(old,'deploy');await cmd(old,'start-battle');await drainStory(old);
 const battle=await snapshot(old),battleText=await backup(old);check('Shipped v0.9.3 battle checkpoint generated',battle.screen==='battle'&&battle.stageStart.schema===15);
 // 2. Restore each into v0.10.0.
 const p=await ctx.newPage();p.on('pageerror',e=>errors.push(`v0100: ${e.message}`));await p.goto(pathToFileURL(path.resolve('releases/Ashen_Crown_v0.10.0.html')).href);await p.waitForFunction(()=>!!window.AshenCrown);if(await p.locator('[data-do="new"]').count()){await cmd(p,'new');}await drainStory(p);
 const restore=async text=>{await drainStory(p);await cmd(p,'menu');await cmd(p,'backup');await p.locator('#backup-text').fill(text);await cmd(p,'restore');await p.waitForFunction(()=>!AshenCrown.view().busy);await p.waitForTimeout(300);};
 await restore(villageText);let s=await snapshot(p);
 check('v0.9.3 village save opens in the painted village (schema 16, gold kept, legal position)',s.schema===16&&s.screen==='exploration'&&s.frontier.hub==='village'&&s.economy.gold===village.economy.gold&&JSON.stringify(nmStrip(s.campaign.heroes))===JSON.stringify(nmStrip(village.campaign.heroes)));
 check('Imported village save does not replay the world-map intro',!s.narrative.active?.key?.startsWith('world:'));
 await restore(battleText);s=await snapshot(p);check('v0.9.3 battle and its checkpoint migrate unchanged',s.screen==='battle'&&s.stageStart.schema===16&&JSON.stringify(nmStrip(s.units))===JSON.stringify(nmStrip(battle.units))&&JSON.stringify(s.economy)===JSON.stringify(battle.economy));
 await cmd(p,'menu');await cmd(p,'restart-stage');await cmd(p,'confirm-restart-stage');await p.waitForFunction(()=>!AshenCrown.view().busy);s=await snapshot(p);check('Restart of a migrated v0.9.3 battle works',s.screen==='battle'&&s.turn===1);
 // 3. Source-built fixtures: the v0.9.3 end-of-content camp (the lower city after M22, ACT III complete) and a mid-M22 battle.
 const done=fixture('m22-camp'),before=JSON.parse(JSON.parse(done.save).data);await restore(done.save);s=await snapshot(p);
 check('v0.9.3 lower-city save (ACT III complete) opens with every asset kept and the roster intact',s.schema===16&&s.frontier.hub==='capital'&&JSON.stringify(s.campaign.economy)===JSON.stringify(before.campaign.economy)&&JSON.stringify(s.campaign.roster)===JSON.stringify(before.campaign.roster)&&JSON.stringify(s.campaign.factionTrust)===JSON.stringify(before.campaign.factionTrust)&&s.campaign.choices.m18_truth==='tell');
 for(let i=0;i<3&&await p.locator('#modal-root .modal').count();i++){await cmd(p,'close-modal');await drainStory(p);}
 await p.screenshot({path:'test-output/migration-v093-camp.png'});check('The migrated camp now goes on to Mission 23',(await p.locator('[data-do="next-mission"]').first().textContent()).includes('Mission 23'));
 await cmd(p,'legion');const legion=await p.locator('#modal-root').textContent();check('The legion panel opens with every hero of the v0.9.3 roster',['에릭','엘리나','리아','세인','카이'].every(n=>legion.includes(n)));await cmd(p,'close-modal');
 await restore(fixture('m22-battle').save);s=await snapshot(p);check('v0.9.3 Mission 22 battle resumes in the square',s.screen==='battle'&&s.missionId===22&&s.stageStart.schema===16&&s.units.some(u=>u.kind==='herald'));
 await cmd(p,'open-unit-menu');await cmd(p,'submenu','skills');const menu=await p.locator('#unit-popover').textContent();
 check('Erik of a v0.9.3 save keeps ② and ③ and shows ④',menu.includes('②')&&menu.includes('③')&&menu.includes('④'));await cmd(p,'close-unit-menu');
 await p.reload();await p.waitForFunction(()=>!!window.AshenCrown&&!AshenCrown.view().busy);s=await snapshot(p);check('Migrated save reloads as the current version',s.schema===16&&s.version==='0.10.0'&&s.missionId===22);
 check('No runtime errors in either build',errors.length===0);await ctx.close();
}finally{fs.mkdirSync('test-output',{recursive:true});fs.writeFileSync('test-output/migration-v093-browser.json',JSON.stringify({checks,errors},null,2));await browser.close();}
console.log(`${checks.length} v0.9.3 browser migration checks PASS`);
