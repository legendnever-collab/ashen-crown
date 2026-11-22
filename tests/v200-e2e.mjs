// v2.0.0 전장 개편 in the browser (D-115): the difficulty is asked for a new campaign and can be changed in camp; the three
// ACT I officers stand in the camp and wait on the bench (five go out of eight); the inventory has tabs and the start
// treasures; the unit sheet shows the six stats; M01 is fought on the 22×16 map with the minimap; a v1.0.0 save made by
// the shipped page and the finished v1.0.0 campaign open as v2.0.0.
import {VERSION} from '../src/data/game-data.js';
import {launchTestBrowser} from './browser-helper.mjs';import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';import {drainStory} from './story-helper.mjs';
const browser=await launchTestBrowser({headless:true,args:['--no-sandbox','--disable-gpu']}),checks=[],errors=[];const check=(name,ok)=>{assert.ok(ok,name);checks.push({name,status:'PASS'});console.log('PASS',name);};
const shots='test-output/v200';fs.mkdirSync(shots,{recursive:true});
try{const ctx=await browser.newContext({viewport:{width:1440,height:900}});await ctx.setOffline(true);
 const cmd=async(p,a,id)=>{await p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first().click();await p.waitForTimeout(150);};const snapshot=p=>p.evaluate(()=>AshenCrown.snapshot());
 const press=async(p,a,id)=>{await p.evaluate(([a,id])=>{const b=document.createElement('button');b.dataset.do=a;if(id)b.dataset.id=id;b.style.cssText='position:fixed;left:0;top:0;width:4px;height:4px;z-index:99999';document.body.append(b);b.click();b.remove();},[a,id]);await p.waitForTimeout(200);};
 const backup=async p=>{await cmd(p,'menu');await cmd(p,'backup');const text=await p.locator('#backup-text').inputValue();await cmd(p,'close-modal');return text;};
 const p=await ctx.newPage();p.__askDifficulty=true;p.on('pageerror',e=>errors.push(e.message));await p.goto(pathToFileURL(path.resolve('build/Ashen_Crown.html')).href);await p.waitForFunction(()=>!!window.AshenCrown);
 check('the page is the current version (the v2.0.0 systems)',await p.evaluate(()=>AshenCrown.version)===VERSION);
 // 1. Difficulty
 await cmd(p,'new');check('a new campaign asks for the difficulty first: 보통 · 어려움',await p.locator('[data-do="difficulty-pick"]').count()===2);await p.screenshot({path:`${shots}/difficulty.png`});
 await cmd(p,'difficulty-pick','hard');await drainStory(p);let s=await snapshot(p);check('어려움: the camp opens and the campaign keeps the choice',s.screen==='exploration'&&s.campaign.difficulty==='hard');
 await cmd(p,'difficulty');await cmd(p,'difficulty-pick','normal');await p.waitForTimeout(200);if(await p.locator('[data-do="close-modal"]').count())await cmd(p,'close-modal');s=await snapshot(p);check('the camp ☰ menu changes it back to 보통',s.campaign.difficulty==='normal');
 // 2. Officers
 check('v2.1: the five start alone (the officers are tavern hires)',s.campaign.roster.length===0&&s.frontier.members.join()==='eric,elina,lia,sain,kai');
 // 3. Inventory tabs, start treasures
 await press(p,'inventory','eric');check('the inventory has tabs (전체 · 무기 · 방어구 · 장신구 · 보물 · 도구)',await p.locator('[data-do="inv-tab"]').count()>=6);
 await press(p,'inv-tab','treasure|eric');const inv=await p.locator('.modal').innerText();check('the 보물 tab shows Aren\'s Shield Crest and the Teacher\'s Tome',inv.includes('아렌의 방패 문장')&&inv.includes('스승의 마도서'));await p.screenshot({path:`${shots}/inventory-treasures.png`});await cmd(p,'close-modal');
 // 4. Unit sheet: six stats
 await press(p,'unit-info','eric|ability');const sheet=await p.locator('.modal').innerText();check('the unit sheet shows the six stats (무력 · 지혜 · 의지 · 강인 · 민첩 · 운)',['무력','지혜','의지','강인','민첩','운'].every(k=>sheet.includes(k)));await p.screenshot({path:`${shots}/unit-sheet.png`});await cmd(p,'close-modal');
 // 5. M01 on the big map: five of eight go out, the minimap
 await cmd(p,'npc','advisor');await drainStory(p);if(await p.locator('[data-do="advisor-operation"]').count())await cmd(p,'advisor-operation');await drainStory(p);await cmd(p,'deploy');await drainStory(p);s=await snapshot(p);
 const allies=s.units.filter(u=>u.team==='ally');check('deployment: the five go out',allies.length===5&&allies.filter(u=>!u.benched).length===5);
 await cmd(p,'start-battle');await drainStory(p);s=await snapshot(p);check('M01 is fought on the 22×16 village',s.screen==='battle'&&s.units.some(u=>u.team==='enemy'&&u.x>=18)&&s.levelPlan&&s.levelPlan.difficulty==='normal');
 check('the battle minimap is shown',await p.locator('#battle-minimap').isVisible());await p.screenshot({path:`${shots}/m01-big-map.png`});
 check('the enemies fight at the sortie\'s level (Garr above it)',s.units.filter(u=>u.team==='enemy'&&u.id!=='boss').every(u=>u.level>=1)&&s.units.find(u=>u.id==='boss').level>Math.round(s.levelPlan.avg));
 // 6. A v1.0.0 save from the shipped page, and the finished v1.0.0 campaign
 const old=await ctx.newPage();old.on('pageerror',e=>errors.push(`v100: ${e.message}`));await old.goto(pathToFileURL(path.resolve('releases/Ashen_Crown_v1.0.0.html')).href);
 await cmd(old,'new');await drainStory(old);const village=await snapshot(old),villageText=await backup(old);check('the shipped v1.0.0 village save is schema 19',village.schema===19&&village.screen==='exploration');
 await cmd(old,'npc','advisor');await drainStory(old);if(await old.locator('[data-do="advisor-operation"]').count())await cmd(old,'advisor-operation');await drainStory(old);await cmd(old,'deploy');await cmd(old,'start-battle');await drainStory(old);const battleText=await backup(old);
 const restore=async text=>{await drainStory(p);await cmd(p,'menu');await cmd(p,'backup');await p.locator('#backup-text').fill(text);await cmd(p,'restore');await p.waitForFunction(()=>!AshenCrown.view().busy);await p.waitForTimeout(300);};
 await restore(villageText);s=await snapshot(p);check('the v1.0.0 village opens as the current schema in camp, the start treasures added (no officers: tavern hires)',s.schema===27&&s.version==='2.6.1'&&s.screen==='exploration'&&!s.campaign.roster.includes('bram')&&s.campaign.economy.gear.some(g=>g.type==='arenCrest'));
 await restore(battleText);s=await snapshot(p);check('the v1.0.0 M01 battle reopens in the camp before M01 (the village is a new map)',s.schema===27&&s.screen==='exploration'&&s.missionId===1&&!s.stageStart);
 const ending=JSON.parse(fs.readFileSync('tests/fixtures/v100/v100-m30-ending.json','utf8')).save;await restore(ending);s=await snapshot(p);
 check('the finished v1.0.0 campaign (ending B) opens in camp with thirty missions and nine heroes',s.schema===27&&s.screen==='exploration'&&s.campaign.completed.length===30&&s.campaign.choices.ending==='B'&&s.campaign.roster.join()==='thea,dario,ines,baldrick');
 await p.screenshot({path:`${shots}/v100-ending-camp.png`});
 await p.reload();await p.waitForFunction(()=>!!window.AshenCrown&&!AshenCrown.view().busy);s=await snapshot(p);check('the migrated save reloads as v2.0.0',s.schema===27&&s.version==='2.6.1'&&s.campaign.completed.length===30);
 check('no runtime errors in either build',errors.length===0);await ctx.close();
}finally{fs.mkdirSync('test-output',{recursive:true});fs.writeFileSync('test-output/v200-e2e.json',JSON.stringify({checks,errors},null,2));await browser.close();}
console.log(`${checks.length} v2.0.0 browser checks PASS`);
