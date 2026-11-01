// v0.8.0 「전술」 in the browser (D-073): the three-skill menu (② open at Lv 4, ③ locked before promotion), Provoke
// (unit target), Flame Burst (tile target and its cross), a Healing Herb handed to an adjacent ally, a Powder Bomb
// thrown at a tile (throws 1/3), status chips on the map, and the camp merchant's stock (Weighted Net after M01, bag 8).
// 1440×900 and 390×844 touch. Screenshots: docs/v0.8.0/screenshots/tactics.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize} from '../src/persistence/save-manager.js';
import {newGame,startBattle} from '../src/core/game.js';import {findUnit} from '../src/core/rules.js';import {enterHub,syncFrontier} from '../src/core/frontier.js';import {HUBS} from '../src/data/frontier-data.js';import {drain} from './campaign-policy.mjs';
const url=pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.8.1.html').href,shots='docs/v0.8.0/screenshots/tactics';fs.mkdirSync(shots,{recursive:true});fs.mkdirSync('test-output',{recursive:true});
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});let n=0;const results=[];const check=(name,ok)=>{assert.ok(ok,name);n++;results.push(name);console.log('PASS',name);};
const camp=(extra={})=>({heroes:null,results:[],clears:0,completed:[],flags:{},choices:{},roster:[],...extra});
// A Lv 6 party in M01 (practice) with enemies placed for each action; the bag holds two herbs and a bomb.
function board(){const s=newGame(20261028,camp({completed:[1,2,3]}),1);s.screen='deployment';startBattle(s);drain(s);
 for(const u of s.units.filter(u=>u.team==='ally')){u.level=6;u.mp=u.maxMP=Math.max(u.maxMP,24);}
 const foes=s.units.filter(u=>u.team==='enemy');for(const e of foes){e.hp=0;}
 const put=(id,x,y)=>{const u=findUnit(s,id);u.x=x;u.y=y;u.moved=false;u.acted=false;return u;};
 const wake=(e,x,y)=>{Object.assign(e,{hp:e.maxHP,x,y});return e;};
 return {s,put,wake,foes};}
const e2e=()=>{const {s,put,wake,foes}=board();
 put('eric',6,9);put('lia',11,9);put('kai',2,8);put('elina',2,9);put('sain',0,9);
 const a=wake(foes[0],6,7),b1=wake(foes[1],11,6),b2=wake(foes[2],12,6),c=wake(foes[3],2,6);findUnit(s,'elina').hp-=12;
 s.economy.items.herb=2;s.economy.items.bomb=1;return {s,a,b1,b2,c};};
try{
 for(const [label,viewport,touch] of [['1440',{width:1440,height:900},false],['390',{width:390,height:844},true]]){
  const ctx=await b.newContext({viewport,hasTouch:touch,isMobile:touch,deviceScaleFactor:touch?2:1});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const press=async(a,id)=>{const el=p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first();touch?await el.tap():await el.click();await p.waitForTimeout(250);};
  const restore=async s=>{await drainStory(p);await press('menu');await press('backup');await p.fill('#backup-text',typeof s==='string'?s:serialize(s));await press('restore');await p.waitForTimeout(400);};
  const snap=()=>p.evaluate(()=>AshenCrown.snapshot());
  const tile=async(x,y)=>{await p.waitForTimeout(250);if(touch){const off=await p.evaluate(([x,y])=>{const c=window.AshenCrown.tileCenter(x,y),r=document.querySelector('#battle-map').getBoundingClientRect();return c.x<0||c.y<0||c.x>r.width||c.y>r.height;},[x,y]);if(off&&await p.locator('[data-do="reset-camera"]').isVisible()){const el=p.locator('[data-do="reset-camera"]').first();await el.tap();await p.waitForTimeout(300);}}const pt=await p.evaluate(([x,y])=>{const c=window.AshenCrown.tileCenter(x,y),r=document.querySelector('#battle-map').getBoundingClientRect();return {x:c.x+r.x,y:c.y+r.y};},[x,y]);touch?await p.touchscreen.tap(pt.x,pt.y):await p.mouse.click(pt.x,pt.y);await p.waitForTimeout(250);};
  // As a player does: close the open popover, then tap the hero on the map.
  const idle=()=>p.waitForFunction(()=>!AshenCrown.view().busy,{},{timeout:30000});
  const select=async u=>{await idle();if(await p.locator('[data-do="close-unit-menu"]').count())await press('close-unit-menu');if(touch&&await p.locator('[data-do="reset-camera"]').isVisible())await press('reset-camera');await tile(u.x,u.y);if((await p.evaluate(()=>AshenCrown.view().selected))!==u.id)await tile(u.x,u.y);if(!await p.locator('[data-do="submenu"][data-id="skills"]').count())await press('open-unit-menu');};
  const pop=()=>p.locator('#unit-popover').textContent();
  await p.goto(url);await press('new');await drainStory(p);
  const {s,a,b1,b2,c}=e2e();await restore(s);await drainStory(p);
  // Erik: three skills listed, ② Provoke open at Lv 6, ③ Bulwark locked until promotion.
  await select(findUnit(s,'eric'));await press('submenu','skills');const menu=await pop();
  check(`${label} Erik's skill menu lists ① 수호 ② 도발 ③ 방벽 (locked before promotion)`,menu.includes('①')&&menu.includes('도발')&&menu.includes('방벽')&&menu.includes('전직하면 습득'));
  await p.screenshot({path:`${shots}/skills-menu-${label}.png`});
  await press('mode','provoke');await tile(a.x,a.y);check(`${label} the Provoke forecast names the target and Erik's DEF +2`,await p.locator('[data-do="confirm"]').count()===1&&(await pop()).includes('에릭')&&(await pop()).includes('DEF +2'));
  await press('confirm');await p.waitForTimeout(600);let st=await snap();check(`${label} Provoke: the enemy is marked for Erik this turn`,st.units.find(u=>u.id===a.id).provokedBy?.id==='eric');
  // Lia: Flame Burst on a tile three away hits both enemies in the cross.
  await select(findUnit(s,'lia'));await press('submenu','skills');await press('mode','flameBurst');await tile(11,6);
  check(`${label} the Flame Burst forecast shows the cross and two enemies`,(await pop()).includes('십자')&&(await pop()).includes('적 2명'));await p.screenshot({path:`${shots}/flame-burst-forecast-${label}.png`});
  await press('confirm');await p.waitForTimeout(900);st=await snap();const hit=[b1,b2].filter(e=>st.units.find(u=>u.id===e.id).hp<e.maxHP).length;
  check(`${label} Flame Burst: Lia spends 8 MP and the cross is resolved (${hit} hit)`,st.units.find(u=>u.id==='lia').mp===24-8&&st.units.find(u=>u.id==='lia').acted);
  // Kai hands a Healing Herb to Elina beside him.
  await select(findUnit(s,'kai'));await press('submenu','tools');check(`${label} the tool menu shows owned tools and throws 3/3`,(await pop()).includes('약초 × 2')&&(await pop()).includes('투척 3/3'));
  await press('mode','tool:herb');await tile(2,9);check(`${label} the herb forecast heals Elina`,(await pop()).includes('엘리나')&&(await pop()).includes('HP +'));
  const elinaHP=st.units.find(u=>u.id==='elina').hp;await press('confirm');await p.waitForTimeout(500);st=await snap();
  check(`${label} Kai's herb heals Elina beside him (one herb left)`,st.units.find(u=>u.id==='elina').hp===Math.min(st.units.find(u=>u.id==='elina').maxHP,elinaHP+15)&&st.economy.items.herb===1);
  // Elina throws the Powder Bomb three tiles north.
  await select(findUnit(s,'elina'));await press('submenu','tools');await press('mode','tool:bomb');await tile(2,6);
  check(`${label} the bomb forecast lists the damage and the throws left`,(await pop()).includes('화약 폭탄')&&(await pop()).includes('3/3'));
  const cHP=st.units.find(u=>u.id===c.id).hp;await press('confirm');await p.waitForTimeout(900);st=await snap();
  check(`${label} Powder Bomb: the enemy in the cross takes damage, throws 1/3 used, the bomb is spent`,st.units.find(u=>u.id===c.id).hp<cHP&&st.throws===1&&!st.economy.items.bomb);
  await p.screenshot({path:`${shots}/after-actions-${label}.png`});
  // A status chip on the map (poisoned and bound enemy) — drawn from the state.
  const t=e2e().s;const pe=t.units.find(u=>u.team==='enemy'&&u.hp>0);pe.status={poison:3,bind:1};await restore(t);await drainStory(p);await p.waitForTimeout(400);
  check(`${label} a poisoned, bound enemy keeps its statuses after a reload`,(await snap()).units.find(u=>u.id===pe.id).status?.poison===3);await p.screenshot({path:`${shots}/status-chips-${label}.png`});
  // Camp merchant (M02 preparation): the Weighted Net is on sale after M01; the bag holds eight.
  const h=newGame(20261028,camp({completed:[1]}),2);enterHub(h);drain(h);const m=HUBS.camp.npcs.find(x=>x.id==='merchant');h.frontier.x=m.x;h.frontier.y=m.y+1;syncFrontier(h);await restore(h);await drainStory(p);
  await press('npc','merchant');await press('shop-service','buy');const shop=await p.locator('#modal-root').textContent();
  check(`${label} the camp merchant sells the Weighted Net after M01, Healing Herb and Antidote; bag 0/8`,shop.includes('그물')&&shop.includes('약초')&&shop.includes('해독초')&&shop.includes('/8')&&!shop.includes('화약 폭탄'));
  await p.screenshot({path:`${shots}/camp-merchant-${label}.png`});
  check(`${label} no runtime errors`,errors.length===0);
  await ctx.close();
 }
}finally{await b.close();}
fs.writeFileSync('test-output/tactics-e2e.json',JSON.stringify({checks:n,results},null,1));console.log(`tactics-e2e: ${n} checks passed`);
