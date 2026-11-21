// v2.4.1 (D-135) in the browser: the ACT III big maps M19–M22 open from a restored battle save at their new sizes with the
// minimap and every unit inside; 등불골 and 이끼다리 open from a camp after M18; 「잿빛 안개 속 약초꾼」 opens with 마렌 on the
// field. Screenshots in docs/v2.4.1/screenshots.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize,checksum} from '../src/persistence/save-manager.js';import {newGame,startBattle} from '../src/core/game.js';import {VERSION} from '../src/data/game-data.js';
import {travelTo} from '../src/core/frontier.js';import {startRequest} from '../src/core/villages.js';
const url=pathToFileURL(process.cwd()+'/build/Ashen_Crown.html').href,shots='docs/v2.4.1/screenshots';fs.mkdirSync(shots,{recursive:true});fs.mkdirSync('test-output',{recursive:true});
const b=await launchTestBrowser({headless:true,args:['--no-sandbox','--disable-gpu']});let n=0;const check=(name,ok)=>{assert.ok(ok,name);n++;console.log('PASS',name);};
const camp=(id,extra={})=>({heroes:null,results:[],clears:id-1,completed:Array.from({length:id-1},(_,i)=>i+1),flags:{act1_completed:true,act2_free_met:true,act2_flame_met:true,act2_completed:true,mission_14_betrayer:'iron',mission_13_baldrick:'halted'},choices:{m06_oath:'comrades',m04_records_choice:'kept',m07_deserters:'legion',m08_order:'hold',m10_stance:'mediate',m11_oath:'oath',m12_records:'return',m15_records:'keep',m16_stones:'leave',m17_oath:'take',m18_truth:'tell',m19_teacher:'take',m20_superior:'trial',m20_plan:'keep',m21_king:'promise'},factionTrust:{iron:-1,free:3,flame:3},roster:['thea','dario','ines'],...extra});
const battle=id=>{const s=newGame(20261120+id,camp(id),id);s.screen='deployment';startBattle(s);return s;};
const backupText=s=>{serialize(s);const data=JSON.stringify({...s,feedback:[]});return JSON.stringify({format:'AshenCrown',schema:s.schema,checksum:checksum(data),data});};
const SIZES={19:[28,20],20:[28,22],21:[24,24],22:[28,22]};
const fixture=JSON.parse(fs.readFileSync('tests/fixtures/v092/v092-m20-camp.json','utf8')).save;
try{
 for(const [label,viewport] of [['1440',{width:1440,height:900}],['390',{width:390,height:844,isMobile:true,hasTouch:true}]]){
  let ctx=await b.newContext({viewport});await ctx.setOffline(true);let p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const press=async a=>{await p.locator(`[data-do="${a}"]`).first().click();await p.waitForTimeout(250);};
  const restore=async s=>{await press('menu');await press('backup');await p.fill('#backup-text',backupText(s));await press('restore');await drainStory(p);await p.waitForTimeout(400);
   for(let i=0;i<3&&await p.locator('.modal [data-do="close-modal"]:visible').count();i++){await p.locator('.modal [data-do="close-modal"]:visible').first().click();await p.waitForTimeout(250);}}; // the fixture camp still holds Dario's joining card
  await p.goto(url);await p.waitForFunction(()=>!!window.AshenCrown);check(`${label} the page is v${VERSION}`,await p.evaluate(()=>AshenCrown.version)===VERSION);
  await press('new');if(await p.locator('[data-do="difficulty-pick"]').count())await p.locator('[data-do="difficulty-pick"][data-id="normal"]').click();await drainStory(p);
  for(const id of [19,20,21,22]){
   await restore(battle(id));const s=await p.evaluate(()=>AshenCrown.snapshot());const [w,h]=SIZES[id];
   check(`${label} M${id} opens in battle on its ${w}×${h} map`,s.screen==='battle'&&s.missionId===id&&s.units.every(u=>u.x>=0&&u.y>=0&&u.x<w&&u.y<h));
   check(`${label} M${id} shows the minimap`,await p.locator('#battle-minimap').isVisible());
   if(label==='1440'){await press('reset-camera');await p.waitForTimeout(3200);await p.screenshot({path:`${shots}/m${id}-big-map.png`});}
  }
  // 등불골: a camp after M16–M18 travels there (the borrowed 돌우물 painting until art pack K)
  const village=deserialize(fixture);travelTo(village,'lamp');await restore(village);
  let s=await p.evaluate(()=>AshenCrown.snapshot());check(`${label} 등불골 opens`,s.screen==='exploration'&&s.frontier.hub==='lamp');
  if(label==='1440')await p.screenshot({path:`${shots}/lamp-village.png`});
  {const moss=deserialize(fixture);travelTo(moss,'moss');await restore(moss);const t=await p.evaluate(()=>AshenCrown.snapshot());check(`${label} 이끼다리 opens`,t.screen==='exploration'&&t.frontier.hub==='moss');if(label==='1440')await p.screenshot({path:`${shots}/moss-village.png`});}
  // 「잿빛 안개 속 약초꾼」: 마렌 in the ruined watchtower, the loggers round her
  const req=deserialize(fixture);travelTo(req,'moss');const rb=startRequest(req,'herbalist',['eric','elina','lia','sain','kai','thea']);
  {const ctx2=await b.newContext({viewport});await ctx2.setOffline(true);const p2=await ctx2.newPage();p2.on('pageerror',e=>errors.push(e.message));await p2.goto(url);await p2.waitForFunction(()=>!!window.AshenCrown);
   await p2.locator('[data-do="new"]').first().click();await p2.waitForTimeout(250);if(await p2.locator('[data-do="difficulty-pick"]').count())await p2.locator('[data-do="difficulty-pick"][data-id="normal"]').click();await drainStory(p2);
   await ctx.close();ctx=ctx2;p=p2;}
  await restore(rb);
  s=await p.evaluate(()=>AshenCrown.snapshot());check(`${label} the herbalist request opens with 마렌 and the loggers`,s.missionId===133&&s.units.some(u=>u.id==='marenc')&&s.units.filter(u=>u.team==='enemy').length>=8);
  if(label==='1440'){await press('reset-camera');await p.waitForTimeout(3200);await p.screenshot({path:`${shots}/request-herbalist.png`});}
  check(`${label} no runtime errors`,errors.length===0);if(errors.length)console.log(errors);await ctx.close();
 }
 fs.writeFileSync('test-output/v241-e2e.json',JSON.stringify({checks:n},null,1));console.log(`v241 e2e: ${n} checks passed`);
}finally{await b.close();}
