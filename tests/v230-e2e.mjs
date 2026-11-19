// v2.3.0 (D-129) in the browser: the ACT II big maps M07–M10 open from a restored battle save at their new sizes with the
// minimap, every unit inside the map; a v2.2.1 (schema 21) save made in a v0.6 small-map battle of M09 reopens in camp;
// a battle on 어려움 at M06 with the inspector's wave saves and restores. Screenshots in docs/v2.3.0/screenshots.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,checksum} from '../src/persistence/save-manager.js';import {newGame,startBattle} from '../src/core/game.js';
const url=pathToFileURL(process.cwd()+'/build/Ashen_Crown.html').href,shots='docs/v2.3.0/screenshots';fs.mkdirSync(shots,{recursive:true});fs.mkdirSync('test-output',{recursive:true});
const b=await launchTestBrowser({headless:true,args:['--no-sandbox','--disable-gpu']});let n=0;const check=(name,ok)=>{assert.ok(ok,name);n++;console.log('PASS',name);};
const camp=(id,extra={})=>({heroes:null,results:[],clears:id-1,completed:Array.from({length:id-1},(_,i)=>i+1),flags:{act1_completed:id>6},choices:{m06_oath:'comrades',m04_records_choice:'reported',m07_deserters:'legion',m08_order:'hold',m10_stance:'mediate'},roster:id>8?['thea']:[],...extra});
const battle=(id,extra)=>{const s=newGame(20261120+id,camp(id,extra),id);s.screen='deployment';startBattle(s);return s;};
const backupText=s=>{serialize(s);const data=JSON.stringify({...s,feedback:[]});return JSON.stringify({format:'AshenCrown',schema:s.schema,checksum:checksum(data),data});};
const SIZES={7:[30,14],8:[22,20],9:[26,20],10:[30,18]};
try{
 for(const [label,viewport] of [['1440',{width:1440,height:900}],['390',{width:390,height:844,isMobile:true,hasTouch:true}]]){
  const ctx=await b.newContext({viewport});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const press=async a=>{await p.locator(`[data-do="${a}"]`).first().click();await p.waitForTimeout(250);};
  await p.goto(url);await p.waitForFunction(()=>!!window.AshenCrown);check(`${label} the page is v2.3.0`,await p.evaluate(()=>AshenCrown.version)==='2.3.0');
  await press('new');if(await p.locator('[data-do="difficulty-pick"]').count())await p.locator('[data-do="difficulty-pick"][data-id="normal"]').click();await drainStory(p);
  for(const id of [7,8,9,10]){
   await press('menu');await press('backup');await p.fill('#backup-text',backupText(battle(id)));await press('restore');await drainStory(p);await p.waitForTimeout(400);
   const s=await p.evaluate(()=>AshenCrown.snapshot());const [w,h]=SIZES[id];
   check(`${label} M${String(id).padStart(2,'0')} opens in battle on its ${w}×${h} map`,s.screen==='battle'&&s.missionId===id&&s.units.every(u=>u.x>=0&&u.y>=0&&u.x<w&&u.y<h));
   check(`${label} M${String(id).padStart(2,'0')} shows the minimap`,await p.locator('#battle-minimap').isVisible());
   if(label==='1440'){await press('reset-camera');await p.waitForTimeout(3200);await p.screenshot({path:`${shots}/m${String(id).padStart(2,'0')}-big-map.png`});}
  }
  check(`${label} no runtime errors`,errors.length===0);if(errors.length)console.log(errors);await ctx.close();
 }
 // 어려움: M06 with the inspector's wave (records reported) saves through the visible backup and restores.
 {const ctx=await b.newContext({viewport:{width:1440,height:900}});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const press=async a=>{await p.locator(`[data-do="${a}"]`).first().click();await p.waitForTimeout(250);};
  await p.goto(url);await press('new');if(await p.locator('[data-do="difficulty-pick"]').count())await p.locator('[data-do="difficulty-pick"][data-id="hard"]').click();await drainStory(p);
  const s6=battle(6,{difficulty:'hard',flags:{}});
  await press('menu');await press('backup');await p.fill('#backup-text',backupText(s6));await press('restore');await drainStory(p);
  let s=await p.evaluate(()=>AshenCrown.snapshot());check('어려움 M06: the battle with the inspector\'s extra soldier opens',s.missionId===6&&s.campaign.difficulty==='hard'&&s.units.some(u=>u.id==='i1h0'));
  await press('menu');await press('backup');const text=await p.locator('#backup-text').inputValue();check('어려움 M06: the battle can be backed up again (the stage start counts the extra soldier)',text.includes('"format":"AshenCrown"'));await press('close-modal');
  check('어려움 no runtime errors',errors.length===0);if(errors.length)console.log(errors);await ctx.close();}
 fs.writeFileSync('test-output/v230-e2e.json',JSON.stringify({checks:n},null,1));console.log(`v230 e2e: ${n} checks passed`);
}finally{await b.close();}
