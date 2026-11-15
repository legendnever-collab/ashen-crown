// v0.9.0 — art work pack E in the browser (D-081): the painted icons in Ironhold's forge shelf, the four-slot equipment
// sheet (treasure included), the battle's command menu (attack, wait), the skills submenu (three skill disks), the unit
// sheet's tactics tab and the status chips over a poisoned and bound enemy on the canvas. The capital's tier III pieces,
// made after the pack, keep their game-drawn icons. 1440×900 and 390×844 touch. Screenshots: docs/v0.9.0/screenshots/icons.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize} from '../src/persistence/save-manager.js';
import {newGame,startBattle} from '../src/core/game.js';import {findUnit} from '../src/core/rules.js';import {enterHub,enterInterior,currentHub,walkable,syncFrontier} from '../src/core/frontier.js';import {drain} from './campaign-policy.mjs';
const url=pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.10.1.html').href,shots='docs/v0.9.0/screenshots/icons';fs.mkdirSync(shots,{recursive:true});fs.mkdirSync('test-output',{recursive:true});
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});let n=0;const results=[];const check=(name,ok)=>{assert.ok(ok,name);n++;results.push(name);console.log('PASS',name);};
const camp=(extra={})=>({heroes:null,results:[],clears:0,completed:[],flags:{},choices:{},roster:[],...extra});
const upTo=k=>Array.from({length:k},(_,i)=>i+1);
function forge(at,done,gold=900){const s=newGame(5,camp({completed:upTo(done)}),at);enterHub(s,{aftermath:done>=at,story:false});drain(s);s.economy.gold=gold;const door=currentHub(s).places.find(p=>p.id==='forge');s.frontier.x=door.x;s.frontier.y=door.y;assert.ok(enterInterior(s,'weapon'));
 const smith=currentHub(s).npcs.find(x=>x.id==='smith');const spot=[[0,1],[1,0],[-1,0],[0,-1]].map(([dx,dy])=>[smith.x+dx,smith.y+dy]).find(([x,y])=>walkable(s,x,y));[s.frontier.x,s.frontier.y]=spot;s.frontier.facing='up';syncFrontier(s);return s;}
// Mission 8 on TURN 1 with Erik (Lv 6, all three skills open) and a poisoned, bound enemy beside him.
function battle(){const s=newGame(9,camp({completed:upTo(7)}),8);s.screen='deployment';startBattle(s);drain(s);const e=findUnit(s,'eric');e.level=Math.max(e.level,6);e.classTier=2;
 const foe=s.units.find(u=>u.team==='enemy'&&u.hp>0&&!u.boss);foe.status={poison:2,bind:1};foe.x=e.x+1;foe.y=e.y;for(const u of s.units.filter(u=>u!==foe&&u.x===foe.x&&u.y===foe.y))u.x=0;return s;}
try{
 for(const [label,viewport,touch] of [['1440',{width:1440,height:900},false],['390',{width:390,height:844},true]]){
  const ctx=await b.newContext({viewport,hasTouch:touch,isMobile:touch,deviceScaleFactor:touch?2:1});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const press=async(a,id)=>{const el=p.locator(`[data-do="${a}"]${id!=null?`[data-id="${id}"]`:''}`).first();touch?await el.tap():await el.click();await p.waitForTimeout(250);};
  const restore=async s=>{await drainStory(p);if(await p.locator('#modal-root .modal').count())await press('close-modal');await press('menu');await press('backup');await p.fill('#backup-text',serialize(s));await press('restore');await p.waitForTimeout(400);await drainStory(p);};
  const tile=async(x,y)=>{await p.waitForTimeout(250);if(touch){const off=await p.evaluate(([x,y])=>{const c=window.AshenCrown.tileCenter(x,y),r=document.querySelector('#battle-map').getBoundingClientRect();return c.x<0||c.y<0||c.x>r.width||c.y>r.height;},[x,y]);if(off&&await p.locator('[data-do="reset-camera"]').isVisible()){await p.locator('[data-do="reset-camera"]').first().tap();await p.waitForTimeout(300);}}const pt=await p.evaluate(([x,y])=>{const c=window.AshenCrown.tileCenter(x,y),r=document.querySelector('#battle-map').getBoundingClientRect();return {x:c.x+r.x,y:c.y+r.y};},[x,y]);touch?await p.touchscreen.tap(pt.x,pt.y):await p.mouse.click(pt.x,pt.y);await p.waitForTimeout(250);};
  const idle=()=>p.waitForFunction(()=>!AshenCrown.view().busy,{},{timeout:30000});
  const select=async u=>{await idle();if(await p.locator('[data-do="close-unit-menu"]').count())await press('close-unit-menu');await tile(u.x,u.y);if((await p.evaluate(()=>AshenCrown.view().selected))!==u.id)await tile(u.x,u.y);if(!await p.locator('[data-do="submenu"][data-id="skills"]').count())await press('open-unit-menu');};
  // every painted icon on screen has decoded (a broken data URI would have naturalWidth 0)
  const painted=async sel=>{await p.waitForFunction(sel=>[...document.querySelectorAll(`${sel} img.item-icon.painted`)].every(i=>i.complete),sel,{timeout:5000}).catch(()=>{});return p.evaluate(sel=>[...document.querySelectorAll(`${sel} img.item-icon.painted`)].map(i=>i.complete&&i.naturalWidth===128),sel);};
  await p.goto(url);await press('new');await drainStory(p);
  // 1. Ironhold's forge shelf after M07: every card shows a painted icon.
  await restore(forge(8,7));await press('npc','smith');await press('shop-service','buy');await p.waitForTimeout(300);let ok=await painted('#modal-root');
  check(`${label} the forge shelf draws pack E icons, all decoded (${ok.length})`,ok.length>=8&&ok.every(Boolean));
  check(`${label} 강철 대검's card uses its painted icon`,await p.locator('#modal-root article:has([data-id="steelGreatsword"]) img.painted, #modal-root article:has-text("강철 대검") img.painted').count()>=1);
  await p.screenshot({path:`${shots}/forge-shelf-${label}.png`});await press('close-modal');
  // 2. Equipment sheet with a treasure: four slots, the treasure painted.
  const tr=forge(8,7);tr.economy.gear.push({id:`g${tr.economy.next++}`,type:'twinDaggers',star:1,exp:0});tr.economy.equipped.eric.treasure=tr.economy.gear.at(-1).id;await restore(tr);
  await press('inventory');await p.waitForTimeout(300);ok=await painted('#modal-root .doll-slot');check(`${label} the equipment sheet paints the Twin Daggers in the treasure slot`,ok.length>=1&&ok.every(Boolean)&&(await p.locator('#modal-root .doll-slot.filled').innerText()).includes('쌍둥이 단검'));
  await p.screenshot({path:`${shots}/equipment-sheet-${label}.png`});await press('close-modal');
  // 3. The capital forge (after M15): its tier III pieces are painted since ACT III pack F1 (v0.9.1, sheet H).
  const cap=forge(16,15);await restore(cap);await press('npc','smith');await press('shop-service','buy');await p.waitForTimeout(300);
  const saberIcon=await p.evaluate(()=>{const leaf=[...document.querySelectorAll('#modal-root *')].filter(e=>e.textContent.includes('왕도 근위검')).pop();let e=leaf;while(e&&!e.querySelector('.item-icon'))e=e.parentElement;return e?.querySelector('.item-icon')?.tagName||null;});
  check(`${label} the capital shelf shows 왕도 근위검 with its painted icon (pack F1)`,(await p.locator('#modal-root').innerText()).includes('왕도 근위검')&&saberIcon==='IMG');
  await p.screenshot({path:`${shots}/capital-shelf-${label}.png`});await press('close-modal');
  // 4. Battle: the command menu and the skills submenu.
  const s=battle();await restore(s);const eric=findUnit(s,'eric');await select(eric);
  check(`${label} the command menu paints 공격 and 대기`,await p.locator('.menu-list .cmd[data-id="attack"] .cmd-icon img.painted').count()===1&&await p.locator('.menu-list [data-do="wait"] .cmd-icon img.painted').count()===1);
  await p.screenshot({path:`${shots}/command-menu-${label}.png`});
  await press('submenu','skills');ok=await painted('.unit-popover');check(`${label} the skills submenu shows Erik's skill disks (수호·도발·방벽 and the locked ④ 맹세의 성벽, painted since pack F2)`,ok.length===4&&ok.every(Boolean));
  await p.screenshot({path:`${shots}/skills-menu-${label}.png`});
  // 5. The status chips on the canvas: painted poison and bind over the enemy (sample the chip area for colour, not letters).
  await press('submenu','root');await press('close-unit-menu');await p.waitForTimeout(500);
  const foe=s.units.find(u=>u.status?.poison);const chip=await p.evaluate(([x,y])=>{const c=document.querySelector('#battle-map');const t=AshenCrown.tileCenter(x,y),k=c.width/c.getBoundingClientRect().width;const g=c.getContext('2d');
   // the old letter chips are flat squares of #3f8f3a (독) and #8a5a32 (속); the painted chips have none of those pixels
   const x0=Math.round((t.x-40)*k),y0=Math.round((t.y-70)*k),w=Math.round(60*k),h=Math.round(40*k),d=g.getImageData(x0,y0,w,h).data;let flat=0,colour=new Set();
   for(let i=0;i<d.length;i+=4){if(d[i]===63&&d[i+1]===143&&d[i+2]===58||d[i]===138&&d[i+1]===90&&d[i+2]===50)flat++;colour.add(d[i]>>3<<10|d[i+1]>>3<<5|d[i+2]>>3);}return {flat,colours:colour.size};},[foe.x,foe.y]);
  check(`${label} the poisoned, bound enemy carries painted status chips, not the flat letter squares (${chip.flat} flat pixels, ${chip.colours} colours)`,chip.flat<4&&chip.colours>60);
  await p.screenshot({path:`${shots}/status-chips-${label}.png`});
  // 6. The unit sheet's tactics tab: skill icons beside the skill names.
  await select(eric);await press('unit-info',`${eric.id}|ability`);await press('unit-info',`${eric.id}|tactics`);await p.waitForTimeout(300);ok=await painted('#modal-root .tactic-card');
  check(`${label} the tactics tab paints Erik's skill and his class action`,ok.length>=1&&ok.every(Boolean));
  await p.screenshot({path:`${shots}/tactics-tab-${label}.png`});
  check(`${label} no page errors`,errors.length===0);
  await ctx.close();}
 fs.writeFileSync('test-output/item-art-e2e.json',JSON.stringify({suite:'item-art-e2e',passed:n,results},null,1));console.log(`item-art-e2e: ${n} checks passed`);
}finally{await b.close();}
