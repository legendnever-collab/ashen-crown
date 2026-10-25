// v0.6.0 Phase C browser checks: the faction relations panel (D-055 Q3) after ACT I, absent before it;
// room-fitting chests (D-056) drawn closed and open in a village house, a garrison triage tent and the oath camp;
// a schema-8 (v0.5.0) save restored through the visible backup UI. 1440×900 and 390×844 touch.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,checksum} from '../src/persistence/save-manager.js';import {actOneCamp} from './skirmish-policy.mjs';
import {newGame} from '../src/core/game.js';import {enterHub,chestKey} from '../src/core/frontier.js';import {HUBS,INTERIORS} from '../src/data/frontier-data.js';import {drain} from './campaign-policy.mjs';import {joinRoster} from '../src/core/roster.js';
const url=pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.6.0.html').href;fs.mkdirSync('test-output',{recursive:true});
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});let n=0;const check=(name,ok)=>{assert.ok(ok,name);n++;console.log('PASS',name);};
// Put Eric inside a building of the current hub (as if he walked in), optionally with chest 'a' already opened.
function inside(s,buildingId,opened=false){const f=s.frontier,door=HUBS[f.hub].places.find(p=>p.buildingId===buildingId);f.returnPosition={hub:f.hub,x:door.x,y:door.y,facing:'up'};f.interior=door.interior;f.interiorBuilding=buildingId;[f.x,f.y]=INTERIORS[door.interior].spawn;f.facing='up';s.campaign.frontier=structuredClone(f);
 if(opened){s.economy.chests=[...(s.economy.chests||[]),chestKey(s,'a')];s.campaign.economy=structuredClone(s.economy);}return s;}
function villageHouse(opened){const s=newGame(20261021);enterHub(s);drain(s);return inside(s,'residence-3',opened);}
function triage(opened){const s=newGame(20261021,null,2);s.campaign.completed=[1];enterHub(s);drain(s);return inside(s,'inn-1',opened);}
try{
 for(const [label,viewport,touch] of [['1440',{width:1440,height:900},false],['390',{width:390,height:844},true]]){
  const ctx=await b.newContext({viewport,hasTouch:touch,isMobile:touch,deviceScaleFactor:touch?2:1});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const press=async(a,id)=>{const el=p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first();touch?await el.tap():await el.click();await p.waitForTimeout(250);};
  const restore=async s=>{await press('menu');await press('backup');await p.fill('#backup-text',serialize(s));await press('restore');await drainStory(p);};
  const snap=()=>p.evaluate(()=>AshenCrown.snapshot());
  await p.goto(url);await press('new');await drainStory(p);
  await press('menu');check(`${label} no faction panel before ACT II`,await p.locator('[data-do="factions"]').count()===0);await press('close-modal');
  await restore(actOneCamp(20261021,6));await press('menu');check(`${label} ACT I complete: faction panel offered`,await p.locator('[data-do="factions"]').count()===1);await press('factions');
  const rows=await p.locator('.faction-row').count(),met=await p.locator('.faction-row:not(.unmet)').count(),stage=await p.locator('.faction-row:not(.unmet) .faction-stage b').first().textContent();
  check(`${label} three banners, only the Iron Crown met, shown as a stage`,rows===3&&met===1&&['경계','중립','신뢰','동맹'].includes(stage.trim()));
  check(`${label} panel fits the screen`,await p.evaluate(()=>{const m=document.querySelector('.modal');return m.scrollWidth<=m.clientWidth+1;}));
  await p.screenshot({path:`test-output/act2-factions-${label}.png`});await press('close-modal');
  // Pack B (D-059): recruits joined in camp show their painted heads in the party sheet.
  {const camp=actOneCamp(20261021,6);joinRoster(camp,'thea',8);joinRoster(camp,'dario',9);await restore(camp);await press('inventory');
   for(const id of ['thea','dario']){await press('inventory',id);await p.waitForTimeout(400);check(`${label} ${id} party sheet uses the painted bust`,await p.locator('.doll-portrait canvas').first().evaluate(c=>c.dataset.painting||'')===`head|${id}|neutral`);}
   await p.screenshot({path:`test-output/act2-party-dario-${label}.png`});await press('close-modal');}
  for(const [name,make,room] of [['village house',villageHouse,'민가'],['triage tent',triage,'병영'],['oath camp tent',o=>inside(actOneCamp(20261021,6),'inn-1',o),'병영']]){
   for(const opened of [false,true]){await restore(make(opened));const s=await snap();
    check(`${label} ${name} ${opened?'opened':'closed'} chest room loads`,s.frontier.interior&&s.frontier.interiorBuilding&&(s.economy.chests||[]).includes(`m${s.missionId}:${s.frontier.hub}:${s.frontier.interiorBuilding}:a`)===opened);
    await p.waitForTimeout(300);await p.screenshot({path:`test-output/act2-chest-${name.replaceAll(' ','-')}-${opened?'open':'closed'}-${label}.png`});}
  }
  check(`${label} no runtime errors`,errors.length===0);if(errors.length)console.log(errors);await ctx.close();
 }
 // v0.5.0 shipped save (schema 8) restored through the UI keeps the camp and gains schema 9.
 {const ctx=await b.newContext({viewport:{width:1440,height:900}});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const press=async(a)=>{await p.locator(`[data-do="${a}"]`).first().click();await p.waitForTimeout(250);};
  const old=actOneCamp(20261021,6);old.schema=8;old.version='0.5.0';delete old.campaign.roster;const data=JSON.stringify({...old,feedback:[]}),text=JSON.stringify({format:'AshenCrown',schema:8,checksum:checksum(data),data});
  await p.goto(url);await press('new');await drainStory(p);await press('menu');await press('backup');await p.fill('#backup-text',text);await press('restore');await drainStory(p);
  const s=await p.evaluate(()=>AshenCrown.snapshot());check('schema 8 camp save restores as schema 9 in the oath camp with the five heroes',s.schema===9&&s.frontier.hub==='oathcamp'&&s.campaign.roster.length===0&&s.units.filter(u=>u.team==='ally').length===5);
  check('schema 8 restore: no runtime errors',errors.length===0);await ctx.close();}
 fs.writeFileSync('test-output/act2-e2e.json',JSON.stringify({checks:n},null,1));console.log(`act2-e2e: ${n} checks passed`);
}finally{await b.close();}
