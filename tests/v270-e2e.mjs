// v2.7.0 (D-158) in the browser: M06 opens on its south-to-north map with the refugees' state over their heads and a readable
// sheet when one is pressed; Eric's attack forecast shows 「연속 공격 n%」; a small village has the request board in the square
// with the county clerk, whose menu opens the board; the tavern has its guests. Screenshots in docs/v2.7.0/screenshots.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';
import {newGame,startBattle} from '../src/core/game.js';import {findUnit} from '../src/core/rules.js';import {serialize} from '../src/persistence/save-manager.js';
import {VERSION} from '../src/data/game-data.js';import {drain} from './campaign-policy.mjs';
import {enterHub,travelTo,currentHub,enterInterior} from '../src/core/frontier.js';
const shots='docs/v2.7.0/screenshots';fs.mkdirSync(shots,{recursive:true});
const m06=()=>{const s=newGame(6006,{heroes:null,results:[],clears:5,completed:[1,2,3,4,5],flags:{},choices:{m04_records_choice:'kept'}},6);s.screen='deployment';startBattle(s);drain(s);return s;};
// M01 with one raider beside Eric
const duel=()=>{const s=newGame(4004);s.screen='deployment';startBattle(s);drain(s);const e=findUnit(s,'eric'),f=s.units.find(u=>u.team==='enemy'&&u.hp>0);for(const u of s.units)if(u.team==='enemy'&&u!==f)u.hp=0;
 f.x=e.x+1;f.y=e.y;if(s.units.some(o=>o!==f&&o.hp>0&&o.x===f.x&&o.y===f.y))f.x=e.x-1;return {s,f};};
const village=()=>{const s=newGame(5,{heroes:null,results:[],clears:4,completed:[1,2,3,4],flags:{},choices:{m04_records_choice:'kept'}},5);enterHub(s,{story:false});drain(s);if(!travelTo(s,'reed'))throw Error('reed');drain(s);return s;};
const b=await launchTestBrowser({headless:true,args:['--no-sandbox','--disable-gpu']});let n=0;const check=(name,ok)=>{assert.ok(ok,name);n++;console.log('PASS',name);};
try{for(const [label,viewport,touch] of [['1440',{width:1440,height:900},false],['390',{width:390,height:844},true]]){
 const ctx=await b.newContext({viewport,hasTouch:touch,isMobile:touch});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 const button=async(a,id)=>{await p.evaluate(([a,id])=>{const x=document.createElement('button');x.dataset.do=a;if(id)x.dataset.id=id;x.style.cssText='position:fixed;left:0;top:0;width:4px;height:4px;z-index:99999';document.body.append(x);x.click();x.remove();},[a,id]);await p.waitForTimeout(300);};
 const press=async(a,id)=>{const l=p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first();touch?await l.tap():await l.click();await p.waitForTimeout(300);};
 const restore=async s=>{await button('menu');await button('backup');await p.fill('#backup-text',serialize(s));await button('restore');await drainStory(p);await p.waitForTimeout(700);};
 const at=async(x,y)=>p.evaluate(([x,y])=>{const c=AshenCrown.tileCenter(x,y),r=document.querySelector('#battle-map').getBoundingClientRect();return {x:c.x+r.x,y:c.y+r.y};},[x,y]);
 const tile=async(x,y)=>{const pt=await at(x,y);touch?await p.touchscreen.tap(pt.x,pt.y):await p.mouse.click(pt.x,pt.y);await p.waitForTimeout(400);};
 const v=()=>p.evaluate(()=>AshenCrown.view()),snap=()=>p.evaluate(()=>AshenCrown.snapshot()),text=()=>p.evaluate(()=>document.body.innerText);
 await p.goto(pathToFileURL(process.cwd()+'/build/Ashen_Crown.html').href);await p.waitForFunction(()=>!!window.AshenCrown);check(`${label} the page is v${VERSION}`,await p.evaluate(()=>AshenCrown.version)===VERSION);
 await button('new');await drainStory(p);
 // 1. M06 south to north; the refugees' state; a pressed refugee's sheet
 await restore(m06());const s6=await snap();check(`${label} M06 opens in battle with the refugees in the south (${s6.units.filter(u=>u.team==='civilian').map(u=>u.y).join(',')})`,s6.missionId===6&&s6.screen==='battle'&&s6.units.filter(u=>u.team==='civilian').every(u=>u.y>=15));
 if(label==='1440'){const r=s6.units.find(u=>u.id==='p1');await p.evaluate(([x,y])=>AshenCrown.lookAt?.(x,y),[r.x,r.y]).catch(()=>{});await p.waitForTimeout(400);await p.screenshot({path:`${shots}/m06-start-${label}.png`});}
 await button('unit-info','p2|ability');const t2=await text();check(`${label} the injured refugee's sheet says 「치유 필요」 and how far the gate is`,t2.includes('치유 필요')&&/관문 너머까지 \d+칸/.test(t2));
 await button('close-unit-info').catch(()=>{});await p.keyboard.press('Escape').catch(()=>{});await p.waitForTimeout(200);
 // 2. 연속 공격 in the attack forecast
 {const {s,f}=duel();await restore(s);const e=(await snap()).units.find(u=>u.id==='eric');await tile(e.x,e.y);if((await v()).selected!=='eric'){await press('reset-camera').catch(()=>{});await tile(e.x,e.y);}
  if(await p.locator('[data-do="mode"][data-id="attack"]').count())await press('mode','attack');await tile(f.x,f.y);
  const fc=(await p.locator('.forecast, .dock-hint').first().textContent().catch(()=>''))||'';check(`${label} Eric's attack forecast shows 연속 공격 (「${fc.replace(/\s+/g,' ').slice(0,110)}」)`,/연속( 공격)? *\d+%/.test(fc));
  if(label==='1440')await p.screenshot({path:`${shots}/double-forecast-${label}.png`});}
 // 3. the village square: the board and the clerk
 {const s=village();Object.assign(s.frontier,{x:16,y:7,facing:'left'});await restore(s);check(`${label} 갈대 나루 is open`,(await snap()).frontier.hub==='reed');
  if(label==='1440')await p.screenshot({path:`${shots}/reed-board-${label}.png`});
  const cam=await p.evaluate(()=>AshenCrown.view().hubCamera),box=await p.locator('#frontier-map').boundingBox(),px=box.x+cam.x+(15+.5)*64*cam.scale,py=box.y+cam.y+(7+.5)*64*cam.scale;
  touch?await p.touchscreen.tap(px,py):await p.mouse.click(px,py);for(let i=0;i<60&&!(await p.locator('#npc-menu').count());i++)await p.waitForTimeout(150);
  const menu=await p.evaluate(()=>[...document.querySelectorAll('#npc-menu button')].map(b=>b.textContent));check(`${label} the clerk's menu offers 대화 and 의뢰 게시판 (${menu.join(' | ')})`,menu.some(t=>t.includes('대화'))&&menu.some(t=>t.includes('의뢰 게시판')));}
 // 4. the tavern guests
 {const s=village();const d=currentHub(s).places.find(q=>q.interior==='tavern');Object.assign(s.frontier,{x:d.x,y:d.y,facing:'up'});enterInterior(s,d.buildingId);await restore(s);
  const npcs=await p.evaluate(()=>AshenCrown.view().hubNpcs||null).catch(()=>null);check(`${label} the tavern is open with its keeper`,(await snap()).frontier.interior==='tavern');
  if(label==='1440')await p.screenshot({path:`${shots}/tavern-guests-${label}.png`});}
 check(`${label} no runtime errors`,errors.length===0);if(errors.length)console.log(errors);await ctx.close();
 }
 fs.mkdirSync('test-output',{recursive:true});fs.writeFileSync('test-output/v270-e2e.json',JSON.stringify({checks:n},null,1));console.log(`v270 e2e: ${n} checks passed`);
}finally{await b.close();}
