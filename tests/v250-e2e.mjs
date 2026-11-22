// v2.5.0 (D-141) in the browser: the ACT IV big maps M23–M26 open from a restored battle save at their new sizes with the
// minimap and every unit inside; the war council shows the big map's intel; a v2.4.1 (schema 25) save made during an M24
// battle reopens in its camp. Screenshots in docs/v2.5.0/screenshots.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,checksum} from '../src/persistence/save-manager.js';import {newGame,startBattle} from '../src/core/game.js';import {VERSION,SCHEMA} from '../src/data/game-data.js';
const url=pathToFileURL(process.cwd()+'/build/Ashen_Crown.html').href,shots='docs/v2.5.0/screenshots';fs.mkdirSync(shots,{recursive:true});fs.mkdirSync('test-output',{recursive:true});
const b=await launchTestBrowser({headless:true,args:['--no-sandbox','--disable-gpu']});let n=0;const check=(name,ok)=>{assert.ok(ok,name);n++;console.log('PASS',name);};
const camp=(id,extra={})=>({heroes:null,results:[],clears:id-1,completed:Array.from({length:id-1},(_,i)=>i+1),flags:{act1_completed:true,act2_free_met:true,act2_flame_met:true,act2_completed:true,act3_completed:true,aren_awakened:true,mission_14_betrayer:'iron',mission_13_baldrick:'halted',mission_25_betrayer:'iron'},choices:{m06_oath:'comrades',m04_records_choice:'kept',m07_deserters:'legion',m08_order:'hold',m10_stance:'mediate',m11_oath:'oath',m12_records:'return',m15_records:'keep',m16_stones:'leave',m17_oath:'leave',m18_truth:'tell',m19_teacher:'take',m20_superior:'trial',m20_plan:'keep',m21_king:'notyet',act3_choice:'council',m23_lead:'legion',m25_banner:'forgive'},factionsMet:['iron','free','flame'],factionTrust:{iron:1,free:3,flame:2},roster:['thea','dario','ines'],...extra});
const battle=id=>{const s=newGame(20261121+id,camp(id),id);s.screen='deployment';startBattle(s);return s;};
const backupText=(s,schema)=>{serialize(s);const o={...s,feedback:[]};if(schema){o.schema=schema;o.version='2.4.1';}const data=JSON.stringify(o);return JSON.stringify({format:'AshenCrown',schema:o.schema,checksum:checksum(data),data});};
const SIZES={23:[26,20],24:[20,24],25:[30,20],26:[22,24]};
try{
 for(const [label,viewport] of [['1440',{width:1440,height:900}],['390',{width:390,height:844,isMobile:true,hasTouch:true}]]){
  const ctx=await b.newContext({viewport});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const press=async a=>{await p.locator(`[data-do="${a}"]`).first().click();await p.waitForTimeout(250);};
  const restore=async text=>{await press('menu');await press('backup');await p.fill('#backup-text',text);await press('restore');await drainStory(p);await p.waitForTimeout(400);
   for(let i=0;i<3&&await p.locator('.modal [data-do="close-modal"]:visible').count();i++){await p.locator('.modal [data-do="close-modal"]:visible').first().click();await p.waitForTimeout(250);}};
  await p.goto(url);await p.waitForFunction(()=>!!window.AshenCrown);check(`${label} the page is v${VERSION}`,await p.evaluate(()=>AshenCrown.version)===VERSION);
  await press('new');if(await p.locator('[data-do="difficulty-pick"]').count())await p.locator('[data-do="difficulty-pick"][data-id="normal"]').click();await drainStory(p);
  for(const id of [23,24,25,26]){
   await restore(backupText(battle(id)));const s=await p.evaluate(()=>AshenCrown.snapshot());const [w,h]=SIZES[id];
   check(`${label} M${id} opens in battle on its ${w}×${h} map`,s.screen==='battle'&&s.missionId===id&&s.units.every(u=>u.x>=0&&u.y>=0&&u.x<w&&u.y<h));
   check(`${label} M${id} shows the minimap`,await p.locator('#battle-minimap').isVisible());
   if(label==='1440'){await press('reset-camera');await p.waitForTimeout(3200);await p.screenshot({path:`${shots}/m${id}-big-map.png`});}
  }
  // a v2.4.1 save in the middle of an M24 battle (the small map) reopens in its camp
  {const old=battle(24);old.turn=3;await restore(backupText(old,25));const s=await p.evaluate(()=>AshenCrown.snapshot());
   check(`${label} a v2.4.1 save of an M24 battle reopens in its camp (the map changed)`,s.screen==="exploration"&&s.missionId===24&&s.schema===SCHEMA);}
  check(`${label} no runtime errors`,errors.length===0);if(errors.length)console.log(errors);await ctx.close();
 }
 fs.writeFileSync('test-output/v250-e2e.json',JSON.stringify({checks:n},null,1));console.log(`v250 e2e: ${n} checks passed`);
}finally{await b.close();}
