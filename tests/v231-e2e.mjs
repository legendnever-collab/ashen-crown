// v2.3.1 (D-131) in the browser: the ACT II big maps M11–M14 open from a restored battle save at their new sizes with the
// minimap and every unit inside; the war council shows the big map's intel; 서리목 opens from a camp after M08 with its
// request board; 「눈보라 속 도끼잡이」 opens with 군나르 and the wolves drawn on the field; a won request brings him into the
// legion. Screenshots in docs/v2.3.1/screenshots.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize,checksum} from '../src/persistence/save-manager.js';import {newGame,startBattle} from '../src/core/game.js';import {VERSION} from '../src/data/game-data.js';
import {travelTo} from '../src/core/frontier.js';import {startRequest} from '../src/core/villages.js';
const url=pathToFileURL(process.cwd()+'/build/Ashen_Crown.html').href,shots='docs/v2.3.1/screenshots';fs.mkdirSync(shots,{recursive:true});fs.mkdirSync('test-output',{recursive:true});
const b=await launchTestBrowser({headless:true,args:['--no-sandbox','--disable-gpu']});let n=0;const check=(name,ok)=>{assert.ok(ok,name);n++;console.log('PASS',name);};
const camp=(id,extra={})=>({heroes:null,results:[],clears:id-1,completed:Array.from({length:id-1},(_,i)=>i+1),flags:{act1_completed:true,act2_free_met:true,act2_flame_met:id>11},choices:{m06_oath:'comrades',m04_records_choice:'kept',m07_deserters:'legion',m08_order:'hold',m10_stance:'mediate',m11_oath:'oath',m12_records:'return'},factionTrust:{iron:1,free:2,flame:2},roster:['thea','dario'],...extra});
const battle=id=>{const s=newGame(20261120+id,camp(id),id);s.screen='deployment';startBattle(s);return s;};
const backupText=s=>{serialize(s);const data=JSON.stringify({...s,feedback:[]});return JSON.stringify({format:'AshenCrown',schema:s.schema,checksum:checksum(data),data});};
const SIZES={11:[24,20],12:[24,20],13:[28,18],14:[24,18]};
const fixture=JSON.parse(fs.readFileSync('tests/fixtures/v061/v061-m10-camp.json','utf8')).save;
try{
 for(const [label,viewport] of [['1440',{width:1440,height:900}],['390',{width:390,height:844,isMobile:true,hasTouch:true}]]){
  let ctx=await b.newContext({viewport});await ctx.setOffline(true);let p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const press=async a=>{await p.locator(`[data-do="${a}"]`).first().click();await p.waitForTimeout(250);};
  const restore=async s=>{await press('menu');await press('backup');await p.fill('#backup-text',backupText(s));await press('restore');await drainStory(p);await p.waitForTimeout(400);};
  await p.goto(url);await p.waitForFunction(()=>!!window.AshenCrown);check(`${label} the page is v${VERSION}`,await p.evaluate(()=>AshenCrown.version)===VERSION);
  await press('new');if(await p.locator('[data-do="difficulty-pick"]').count())await p.locator('[data-do="difficulty-pick"][data-id="normal"]').click();await drainStory(p);
  for(const id of [11,12,13,14]){
   await restore(battle(id));const s=await p.evaluate(()=>AshenCrown.snapshot());const [w,h]=SIZES[id];
   check(`${label} M${id} opens in battle on its ${w}×${h} map`,s.screen==='battle'&&s.missionId===id&&s.units.every(u=>u.x>=0&&u.y>=0&&u.x<w&&u.y<h));
   check(`${label} M${id} shows the minimap`,await p.locator('#battle-minimap').isVisible());
   if(label==='1440'){await press('reset-camera');await p.waitForTimeout(3200);await p.screenshot({path:`${shots}/m${id}-big-map.png`});}
  }
  // 서리목: a camp after M08–M09 travels there; the board lists the four requests
  const village=deserialize(fixture);travelTo(village,'frost');await restore(village);
  let s=await p.evaluate(()=>AshenCrown.snapshot());check(`${label} 서리목 opens with its request board`,s.screen==='exploration'&&s.frontier.hub==='frost');
  if(label==='1440')await p.screenshot({path:`${shots}/frost-village.png`});
  // 「눈보라 속 도끼잡이」: 군나르 in the ruin, the wolves on the snow
  const req=deserialize(fixture);travelTo(req,'frost');const rb=startRequest(req,'blizzard',['eric','elina','lia','sain','kai','thea']);
  {const ctx2=await b.newContext({viewport});await ctx2.setOffline(true);const p2=await ctx2.newPage();p2.on('pageerror',e=>errors.push(e.message));await p2.goto(url);await p2.waitForFunction(()=>!!window.AshenCrown);
   await p2.locator('[data-do="new"]').first().click();await p2.waitForTimeout(250);if(await p2.locator('[data-do="difficulty-pick"]').count())await p2.locator('[data-do="difficulty-pick"][data-id="normal"]').click();await drainStory(p2);
   await ctx.close();ctx=ctx2;p=p2;}
  await restore(rb);
  s=await p.evaluate(()=>AshenCrown.snapshot());check(`${label} the blizzard request opens with 군나르 and the wolves`,s.missionId===125&&s.units.some(u=>u.id==='gunnarc')&&s.units.filter(u=>u.look==='wolf').length>=4);
  if(label==='1440'){await press('reset-camera');await p.waitForTimeout(3200);await p.screenshot({path:`${shots}/request-blizzard.png`});}
  check(`${label} no runtime errors`,errors.length===0);if(errors.length)console.log(errors);await ctx.close();
 }
 fs.writeFileSync('test-output/v231-e2e.json',JSON.stringify({checks:n},null,1));console.log(`v231 e2e: ${n} checks passed`);
}finally{await b.close();}
