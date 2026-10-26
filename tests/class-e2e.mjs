// v0.5.0 Phase D browser check: the five promotion actions through the real battle UI (desktop mouse + phone touch).
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';
import {newGame,startBattle} from '../src/core/game.js';import {findUnit} from '../src/core/rules.js';import {serialize} from '../src/persistence/save-manager.js';import {applyClass} from '../src/core/progression.js';import {CLASS_TREE} from '../src/data/classes.js';import {drain} from './campaign-policy.mjs';
function setup(){const s=newGame(4004);s.screen='deployment';startBattle(s);drain(s);
 for(const u of s.units)if(u.team==='enemy'&&!['b1','boss'].includes(u.id))u.hp=0;
 const pos={eric:[5,7],elina:[2,8],lia:[7,8],sain:[4,9],kai:[8,9],b1:[8,8]};for(const [id,[x,y]]of Object.entries(pos)){const u=findUnit(s,id);u.x=x;u.y=y;}
 for(const id of ['eric','elina','lia','sain','kai']){const u=findUnit(s,id);applyClass(u,CLASS_TREE[id][1]);u.mp=u.maxMP;}return s;}
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});let n=0;const results=[];const check=(name,ok)=>{assert.ok(ok,name);n++;results.push(name);console.log('PASS',name);};
try{for(const [w,h,touch] of [[1440,900,false],[390,844,true]]){const L=`${w}x${h}`;
 const ctx=await b.newContext({viewport:{width:w,height:h},hasTouch:touch,isMobile:touch,deviceScaleFactor:touch?3:1});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 const press=async(a,id)=>{const l=p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first();touch?await l.tap():await l.click();await p.waitForTimeout(300);};
 const tile=async(x,y)=>{const pt=await p.evaluate(([x,y])=>{const c=AshenCrown.tileCenter(x,y),b=document.querySelector('#battle-map').getBoundingClientRect();return {x:c.x+b.x,y:c.y+b.y};},[x,y]);touch?await p.touchscreen.tap(pt.x,pt.y):await p.mouse.click(pt.x,pt.y);await p.waitForTimeout(400);};
 const v=()=>p.evaluate(()=>AshenCrown.view()),snap=()=>p.evaluate(()=>AshenCrown.snapshot()),unit=async id=>(await snap()).units.find(u=>u.id===id);
 const idle=()=>p.waitForFunction(()=>!AshenCrown.view().busy,{},{timeout:30000});
 const pick=async id=>{if(await p.locator('[data-do="close-unit-menu"]').count())await press('close-unit-menu');const u=await unit(id);await tile(u.x,u.y);if((await v()).selected!==id){await press('reset-camera');await tile(u.x,u.y);}};
 await p.goto(pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.6.1.html').href);await press('new');await drainStory(p);await press('menu');await press('backup');await p.fill('#backup-text',serialize(setup()));await press('restore');await drainStory(p);await p.waitForTimeout(500);
 // Bulwark
 await pick('eric');check(`${L} Erik selected`,(await v()).selected==='eric');await press('submenu','skills');check(`${L} skill tab lists the class action`,await p.locator('[data-do="mode"][data-id="bulwark"]').count()===1);
 await press('mode','bulwark');check(`${L} Bulwark shows its forecast`,(await v()).menu==='forecast'&&(await p.locator('#unit-popover .forecast').textContent()).includes('방벽'));
 await press('confirm');await idle();let e=await unit('eric');check(`${L} Bulwark applied (MP −4, acted)`,e.bulwark===true&&e.acted&&e.mp===e.maxMP-4);check(`${L} Bulwark plays its golden shield flourish (Phase F)`,(await v()).animation.lastFlourish.some(f=>f.id==='eric'&&f.action==='bulwark'));
 // Overwatch
 await pick('elina');await press('submenu','skills');await press('mode','overwatch');await press('confirm');await idle();check(`${L} Overwatch applied`,(await unit('elina')).overwatch===true);
 // Arcane Territory (tile target, second tap executes)
 await pick('lia');await press('submenu','skills');await press('mode','arcane');await p.waitForTimeout(150);check(`${L} Arcane shows target tiles`,(await v()).mode==='arcane'&&(await v()).ranges.length>5&&(await v()).drawnRanges===(await v()).ranges.length);
 const li=await unit('lia'),occupied=new Set((await snap()).units.filter(u=>u.hp>0&&!u.rescued).map(u=>`${u.x},${u.y}`)),cell=(await v()).ranges.find(c=>Math.abs(c.x-li.x)+Math.abs(c.y-li.y)===2&&!occupied.has(`${c.x},${c.y}`));
 await tile(cell.x,cell.y);check(`${L} first tap previews the rune`,(await v()).menu==='forecast'&&(await v()).preview===`${cell.x},${cell.y}`);await tile(cell.x,cell.y);await idle();check(`${L} second tap lays the rune`,((await snap()).runes||[]).length>=4&&(await unit('lia')).acted);
 // Divine Recall (unit target)
 await pick('sain');await press('submenu','skills');await press('mode','recall');const er=await unit('eric');await tile(er.x,er.y);check(`${L} Recall forecast`,(await v()).menu==='forecast'&&(await v()).preview==='eric');await press('confirm');await idle();
 e=await unit('eric');const sa=await unit('sain');check(`${L} Recall brings Erik next to Sain`,Math.abs(e.x-sa.x)+Math.abs(e.y-sa.y)===1);
 // Shadow Exchange with the adjacent bandit
 await pick('kai');await press('submenu','skills');await press('mode','exchange');const b1=await unit('b1');await tile(b1.x,b1.y);check(`${L} Exchange forecast`,(await v()).preview==='b1');await tile(b1.x,b1.y);await idle();
 const k=await unit('kai'),b2=await unit('b1');check(`${L} Exchange swapped Kai and the bandit`,k.x===8&&k.y===8&&b2.x===8&&b2.y===9&&b2.noCounter>=1);
 await p.screenshot({path:`test-output/class-actions-${w}.png`});
 // Enemy Phase runs with the effects in place and clears them for the next Player Phase.
 await press('end-phase');if(await p.locator('[data-do="confirm-end-phase"]').count())await press('confirm-end-phase');await p.waitForFunction(()=>AshenCrown.snapshot().phase==='player'&&!AshenCrown.view().busy,{},{timeout:60000});
 const after=await snap();check(`${L} Bulwark/Overwatch expire, runes last into the next turn`,!after.units.some(u=>u.bulwark||u.overwatch)&&(after.runes||[]).length>=4);
 check(`${L} no runtime errors`,errors.length===0);await ctx.close();}
 console.log(`${n} class action checks PASS`);
}finally{fs.mkdirSync('test-output',{recursive:true});fs.writeFileSync('test-output/class-e2e.json',JSON.stringify({checks:results},null,1));await b.close();}
