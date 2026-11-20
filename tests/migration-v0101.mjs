// Browser migration (v0.10.2): saves made by the shipped v0.10.1 HTML and by the v0.10.1 source (tests/fixtures/v0101) open in
// v0.10.2 through the visible backup dialog: schema 17 → 18 with nothing changed, the oath camp after M26 (Baldrick in the
// legion) keeps every asset and goes on to Mission 27 (the capital's southern gate), and the mid-M26 battle resumes at the lion's pass.
import {launchTestBrowser} from './browser-helper.mjs';import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';import {drainStory} from './story-helper.mjs';import {econV200} from './v200-compat.mjs';
// v2.0.0 (D-115, REFORM_DESIGN §8): heroes gain the six stats (numbers recomputed), the officers join, the start treasures
// are added and unfit gear is taken off into the bag; a battle in progress reopens in the camp before it.
const OFFICERS=['bram','noa','marta','rowell'],heroKey=h=>({id:h.id,level:h.level,xp:h.xp,classTier:h.classTier??1,clues:h.clues,growthHistory:h.growthHistory});
const sameHeroes=(a,b)=>JSON.stringify((a||[]).filter(h=>!OFFICERS.includes(h.id)).map(heroKey))===JSON.stringify((b||[]).filter(h=>!OFFICERS.includes(h.id)).map(heroKey));
const sameRoster=(a,b)=>JSON.stringify((a||[]).filter(id=>!OFFICERS.includes(id)))===JSON.stringify((b||[]).filter(id=>!OFFICERS.includes(id)));
const reopened=(s,id)=>s.screen==='exploration'&&s.migrated200==='battle'&&!s.stageStart&&(id==null||s.missionId===id);
// v0.6 (D-060): names were rewritten in Hangul; compare saves without the display name.
const nmStrip=a=>(a||[]).map(({name,...u})=>u);
const browser=await launchTestBrowser({headless:true,args:['--no-sandbox','--disable-gpu']}),checks=[],errors=[];const check=(name,ok)=>{assert.ok(ok,name);checks.push({name,status:'PASS'});console.log('PASS',name);};
const fixture=n=>JSON.parse(fs.readFileSync(`tests/fixtures/v0101/v0101-${n}.json`,'utf8'));
try{const ctx=await browser.newContext({viewport:{width:1440,height:900}});await ctx.setOffline(true);
 const cmd=async(p,a,id)=>{await p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first().click();await p.waitForTimeout(150);};const snapshot=p=>p.evaluate(()=>AshenCrown.snapshot());
 const backup=async p=>{await cmd(p,'menu');await cmd(p,'backup');const text=await p.locator('#backup-text').inputValue();await cmd(p,'close-modal');return text;};
 // 1. Saves produced by the shipped v0.10.1 page: the village, then a Mission 01 battle checkpoint.
 const old=await ctx.newPage();old.on('pageerror',e=>errors.push(`v0102: ${e.message}`));await old.goto(pathToFileURL(path.resolve('releases/Ashen_Crown_v0.10.1.html')).href);
 await cmd(old,'new');await drainStory(old);const village=await snapshot(old),villageText=await backup(old);check('Shipped v0.10.1 village save is schema 17',village.schema===17&&village.screen==='exploration'&&village.frontier.hub==='village');
 await cmd(old,'npc','advisor');await drainStory(old);if(await old.locator('[data-do="advisor-operation"]').count())await cmd(old,'advisor-operation');await drainStory(old);await cmd(old,'deploy');await cmd(old,'start-battle');await drainStory(old);
 const battle=await snapshot(old),battleText=await backup(old);check('Shipped v0.10.1 battle checkpoint generated',battle.screen==='battle'&&battle.stageStart.schema===17);
 // 2. Restore each into v0.10.2.
 const p=await ctx.newPage();p.on('pageerror',e=>errors.push(`v0102: ${e.message}`));await p.goto(pathToFileURL(path.resolve('build/Ashen_Crown.html')).href);await p.waitForFunction(()=>!!window.AshenCrown);if(await p.locator('[data-do="new"]').count()){await cmd(p,'new');}await drainStory(p);
 const restore=async text=>{await drainStory(p);await cmd(p,'menu');await cmd(p,'backup');await p.locator('#backup-text').fill(text);await cmd(p,'restore');await p.waitForFunction(()=>!AshenCrown.view().busy);await p.waitForTimeout(300);};
 await restore(villageText);let s=await snapshot(p);
 check('v0.10.1 village save opens in the painted village (schema 18, gold kept, legal position)',s.schema===23&&s.screen==='exploration'&&s.frontier.hub==='village'&&s.economy.gold===village.economy.gold&&sameHeroes(s.campaign.heroes,village.campaign.heroes));
 check('Imported village save does not replay the world-map intro',!s.narrative.active?.key?.startsWith('world:'));
 await restore(battleText);s=await snapshot(p);check('v0.10.1 battle reopens in the camp before it (v2.0.0)',reopened(s));
 for(const a of ['warroom','deploy','start-battle']){await cmd(p,a);await drainStory(p);}await p.waitForFunction(()=>!AshenCrown.view().busy);s=await snapshot(p);check('The reopened v0.10.1 battle departs again from the camp',s.screen==='battle'&&s.turn===1);
 // 3. Source-built fixtures: the v0.10.1 end-of-content camp (the oath camp after M26) and a mid-M26 battle.
 const done=fixture('m26-camp'),before=JSON.parse(JSON.parse(done.save).data);await restore(done.save);s=await snapshot(p);
 check('v0.10.1 oath camp save (after M26, Baldrick in the legion) opens with every asset kept and the roster intact',s.schema===23&&s.frontier.hub==='oathcamp'&&JSON.stringify(econV200(s.campaign.economy))===JSON.stringify(econV200(before.campaign.economy))&&sameRoster(s.campaign.roster,before.campaign.roster)&&JSON.stringify(s.campaign.factionTrust)===JSON.stringify(before.campaign.factionTrust)&&s.campaign.choices.m18_truth==='tell');
 for(let i=0;i<3&&await p.locator('#modal-root .modal').count();i++){await cmd(p,'close-modal');await drainStory(p);}
 await p.screenshot({path:'test-output/migration-v0101-camp.png'});check('The migrated camp now goes on to Mission 27',(await p.locator('[data-do="next-mission"]').first().textContent()).includes('Mission 27'));
 await cmd(p,'legion');const legion=await p.locator('#modal-root').textContent();check('The legion panel opens with every hero of the v0.10.1 roster, Baldrick included',['에릭','엘리나','리아','세인','카이','발드릭'].every(n=>legion.includes(n)));await cmd(p,'close-modal');
 await restore(fixture('m26-battle').save);s=await snapshot(p);check('v0.10.1 Mission 26 battle reopens in the camp before it (v2.0.0)',reopened(s,26));/* v2.0.0: depart again from the camp */for(const a of ['warroom','deploy','start-battle','confirm-battle']){if(await p.locator(`[data-do="${a}"]`).count()){await cmd(p,a);await drainStory(p);}}
 await cmd(p,'open-unit-menu');await cmd(p,'submenu','skills');const menu=await p.locator('#unit-popover').textContent();
 check('Erik of a v0.10.1 save keeps ② and ③ and shows ④',menu.includes('②')&&menu.includes('③')&&menu.includes('④'));await cmd(p,'close-unit-menu');
 await p.reload();await p.waitForFunction(()=>!!window.AshenCrown&&!AshenCrown.view().busy);s=await snapshot(p);check('Migrated save reloads as the current version',s.schema===23&&s.version==='2.3.1'&&s.missionId===26);
 check('No runtime errors in either build',errors.length===0);await ctx.close();
}finally{fs.mkdirSync('test-output',{recursive:true});fs.writeFileSync('test-output/migration-v0101-browser.json',JSON.stringify({checks,errors},null,2));await browser.close();}
console.log(`${checks.length} v0.10.1 browser migration checks PASS`);
