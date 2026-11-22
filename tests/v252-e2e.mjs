// v2.5.2 (the user's requests 2026-11-22) in the browser:
// 1. a click on a person walks next to them and talks; a person with a service opens a small menu beside them
//    (대화 · 인재 확보) — the tavern keeper behind the counter is reached from the room's door;
// 2. a click on a chest walks next to it and opens it;
// 3. the gear purchase fits the screen: the buy button is on screen without scrolling (1440×900, 1280×720, 390×844).
// Screenshots in docs/v2.5.2/screenshots.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';
import {serialize} from '../src/persistence/save-manager.js';import {newGame,startBattle} from '../src/core/game.js';import {VERSION} from '../src/data/game-data.js';
import {enterHub,enterInterior,currentHub,chestKey} from '../src/core/frontier.js';import {HUBS,INTERIORS} from '../src/data/frontier-data.js';import {SERVICE_TALK} from '../src/data/npc-talk-v252.js';
import {drain,playCampaignBattle} from './campaign-policy.mjs';import {playBattle} from './player-policy.mjs';
const url=pathToFileURL(path.resolve('build/Ashen_Crown.html')).href,shots='docs/v2.5.2/screenshots';fs.mkdirSync(shots,{recursive:true});fs.mkdirSync('test-output',{recursive:true});
const b=await launchTestBrowser({headless:true,args:['--no-sandbox','--disable-gpu']});let n=0;const check=(name,ok)=>{assert.ok(ok,name);n++;console.log('PASS',name);};
// the camp after M01 (made with the game's own rules), Eric at the tavern door inside, in a house with a chest, in the village
function afterOne(){const s=newGame(20261014);s.campaign.difficulty='normal';s.screen='deployment';startBattle(s);playBattle(s);enterHub(s,{aftermath:true,story:false});drain(s);s.economy.gold=s.campaign.economy.gold=2000;return s;}
const camp=afterOne();
const tavern=()=>{const s=structuredClone(camp),d=currentHub(s).places.find(p=>p.interior==='tavern');Object.assign(s.frontier,{x:d.x,y:d.y,facing:'up'});if(!enterInterior(s,d.buildingId))throw Error('tavern');return s;};
const house=()=>{const s=structuredClone(camp),f=s.frontier,door=HUBS[f.hub].places.find(p=>p.buildingId==='residence-3');f.returnPosition={hub:f.hub,x:door.x,y:door.y,facing:'up'};f.interior=door.interior;f.interiorBuilding='residence-3';[f.x,f.y]=INTERIORS[door.interior].spawn;f.facing='up';s.campaign.frontier=structuredClone(f);return s;};
try{
 for(const [label,viewport,touch] of [['1440',{width:1440,height:900},false],['1280',{width:1280,height:720},false],['390',{width:390,height:844},true]]){
  const ctx=await b.newContext({viewport,hasTouch:touch,isMobile:touch});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const tap=async loc=>{touch?await loc.tap():await loc.click();await p.waitForTimeout(250);};
  const press=async(a,id)=>{await p.evaluate(([a,id])=>{const x=document.createElement('button');x.dataset.do=a;if(id)x.dataset.id=id;x.style.cssText='position:fixed;left:0;top:0;width:4px;height:4px;z-index:99999';document.body.append(x);x.click();x.remove();},[a,id]);await p.waitForTimeout(250);};
  const snap=()=>p.evaluate(()=>AshenCrown.snapshot());
  const restore=async s=>{await press('menu');await press('backup');await p.fill('#backup-text',serialize(s));await press('restore');await p.waitForFunction(()=>!AshenCrown.view().busy);await p.waitForTimeout(400);await drainStory(p);
   for(let i=0;i<3&&await p.locator('.modal [data-do="close-modal"]:visible').count();i++){await p.locator('.modal [data-do="close-modal"]:visible').first().click();await p.waitForTimeout(200);}};
  // a click on a town tile, through the same camera the game uses; waits for the walk to end
  const clickTile=async(x,y)=>{const v=await p.evaluate(()=>AshenCrown.view().hubCamera),box=await p.locator('#frontier-map').boundingBox(),px=box.x+v.x+(x+.5)*64*v.scale,py=box.y+v.y+(y+.5)*64*v.scale;
   touch?await p.touchscreen.tap(px,py):await p.mouse.click(px,py);await p.waitForTimeout(300);for(let i=0;i<60&&(await p.evaluate(()=>AshenCrown.view().busy||false));i++)await p.waitForTimeout(150);await p.waitForTimeout(1800);};
  await p.goto(url);await p.waitForFunction(()=>!!window.AshenCrown);check(`${label} the page is v${VERSION}`,await p.evaluate(()=>AshenCrown.version)===VERSION);
  await press('new');if(await p.locator('[data-do="difficulty-pick"]').count())await p.locator('[data-do="difficulty-pick"][data-id="normal"]').click();await drainStory(p);
  // 1. the tavern keeper: from the door, a click on him walks within his reach and opens the menu beside him
  const tv=tavern();await restore(tv);let s=await snap();const keeper=currentHub(tv).npcs.find(q=>q.id==='tavernkeeper');check(`${label} inside the tavern, at the door`,s.frontier.interior==='tavern'&&Math.abs(s.frontier.x-keeper.x)+Math.abs(s.frontier.y-keeper.y)>(keeper.reach||1));
  {const v=await p.evaluate(()=>AshenCrown.view().hubCamera),headY=v.y+(keeper.y-.5)*64*v.scale; // his head (the tile above his feet) when it is on screen, else his feet
   await clickTile(keeper.x,headY>8?keeper.y-1:keeper.y);}
  s=await snap();const menu=p.locator('#npc-menu');if(process.env.DBG)console.log('DBG',label,s.frontier.x,s.frontier.y,await menu.count(),JSON.stringify(await p.evaluate(()=>AshenCrown.view().hubCamera)),await p.evaluate(()=>{const b=document.querySelector('#frontier-map').getBoundingClientRect();return [b.x,b.y,b.width,b.height].map(Math.round).join();}));if(process.env.DBG)await p.screenshot({path:`test-output/dbg-${label}.png`});
  check(`${label} a click on the keeper walks within his reach and opens his menu (대화 · 인재 확보)`,Math.abs(s.frontier.x-keeper.x)+Math.abs(s.frontier.y-keeper.y)<=(keeper.reach||1)&&await menu.isVisible()&&(await menu.innerText()).includes('대화')&&(await menu.innerText()).includes('인재 확보'));
  if(label==='1440')await p.screenshot({path:`${shots}/tavern-menu-${label}.png`});
  await tap(menu.locator('[data-do="npc-talk"]'));let text=await p.locator('.modal').innerText();check(`${label} 대화: the keeper says a word`,SERVICE_TALK.tavern.some(l=>text.includes(l.slice(0,12))));
  await tap(p.locator('.modal [data-do="npc"]'));text=await p.locator('.modal').innerText();check(`${label} 인재 확보 from the talk opens the hires`,text.includes('브람')&&text.includes('G'));await press('close-modal');
  await clickTile(keeper.x,keeper.y);check(`${label} a second click (already beside him) opens the menu at once`,await menu.isVisible());await tap(menu.locator('[data-do="npc"]'));check(`${label} 인재 확보 from the menu opens the hires`,(await p.locator('.modal').innerText()).includes('브람'));await press('close-modal');
  // 2. a chest: a click on it walks beside it and opens it
  const h=house();await restore(h);const target=currentHub(h).places.find(q=>q.action==='chest');
  check(`${label} the house has a chest`,!!target);
  await clickTile(target.x,target.y);text=await p.locator('.modal').innerText().catch(()=>'');
  check(`${label} a click on the chest walks beside it and opens it`,text.includes('보물상자')||text.includes('찾았다')||text.includes('먼지'));
  if(label==='1440')await p.screenshot({path:`${shots}/chest-open-${label}.png`});await press('close-modal');
  // 1b. a person without a service: a click walks there and the talk starts (no menu)
  await restore(structuredClone(camp));{const elder=currentHub(camp).npcs.find(q=>q.id==='elder');await clickTile(elder.x,elder.y);s=await snap();
   check(`${label} a click on the village elder walks beside him and he talks`,Math.abs(s.frontier.x-elder.x)+Math.abs(s.frontier.y-elder.y)<=1&&(!!s.narrative.active||s.narrative.seen.some(k=>k.endsWith(':elder')))&&!(await p.locator('#npc-menu').count()));await drainStory(p);}
  // 3. the gear purchase fits the screen
  await restore(structuredClone(camp));await press('purchase-hero','lightShield|kai');const buy=p.locator('.modal [data-do="transaction"]');
  const bb=await buy.boundingBox(),vh=viewport.height;check(`${label} the purchase's buy button is on screen without scrolling (bottom ${Math.round(bb?.y+bb?.height)} ≤ ${vh})`,!!bb&&bb.y>=0&&bb.y+bb.height<=vh);
  await p.screenshot({path:`${shots}/purchase-${label}.png`});await press('close-modal');
  check(`${label} no runtime errors`,errors.length===0);if(errors.length)console.log(errors);await ctx.close();
 }
 fs.writeFileSync('test-output/v252-e2e.json',JSON.stringify({checks:n},null,1));console.log(`v252 e2e: ${n} checks passed`);
}finally{await b.close();}
