// Mobile regression (user report 2026-10-18): after moving, Attack/Skill must work by touch even
// when the command menu re-renders between touchstart and the synthesized click.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';
import {newGame,startBattle} from '../src/core/game.js';import {findUnit} from '../src/core/rules.js';import {serialize} from '../src/persistence/save-manager.js';import {drain} from './campaign-policy.mjs';
const setup=()=>{const s=newGame(4004);s.screen='deployment';startBattle(s);drain(s);const e=findUnit(s,'eric');e.x=5;e.y=7;const b1=findUnit(s,'b1');b1.x=5;b1.y=5;const l=findUnit(s,'lia');l.x=7;l.y=4;return s;};
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});let n=0;const check=(name,ok)=>{assert.ok(ok,name);n++;console.log('PASS',name);};
try{for(const [w,h] of [[390,844],[844,390]]){
 const ctx=await b.newContext({viewport:{width:w,height:h},hasTouch:true,isMobile:true,deviceScaleFactor:3});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 const tap=async(a,id)=>{await p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first().tap();await p.waitForTimeout(300);};
 // touchstart on one element, re-render, click on its replacement (what slow devices produce)
 const lateTap=async(a,id)=>{await p.evaluate(([a,id])=>{const q=`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`,b=document.querySelector(q);b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerType:'touch'}));const n=b.cloneNode(true);b.replaceWith(n);n.dispatchEvent(new MouseEvent('click',{bubbles:true,detail:1}));},[a,id]);await p.waitForTimeout(300);};
 const tile=async(x,y)=>{const pt=await p.evaluate(([x,y])=>{const c=AshenCrown.tileCenter(x,y),b=document.querySelector('#battle-map').getBoundingClientRect();return {x:c.x+b.x,y:c.y+b.y};},[x,y]);if(process.env.DEBUG_TAP)console.log('tap',x,y,pt,await p.evaluate(({x,y})=>{const e=document.elementFromPoint(x,y);return e?.id||e?.className||e?.tagName;},pt));await p.touchscreen.tap(pt.x,pt.y);await p.waitForTimeout(400);};
 const v=()=>p.evaluate(()=>AshenCrown.view()),snap=()=>p.evaluate(()=>AshenCrown.snapshot());
 await p.goto(pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.4.0.html').href);await tap('new');await drainStory(p);await tap('menu');await tap('backup');await p.fill('#backup-text',serialize(setup()));await tap('restore');await drainStory(p);await p.waitForTimeout(600);
 await tile(5,7);check(`${w}x${h} tapping a hero opens 이동/공격/스킬/도구/상태 and shows no range yet`,(await v()).menu==='root'&&(await v()).ranges.length===0&&(await p.waitForTimeout(120),(await v()).drawnRanges===0)&&await p.locator('[data-do="mode"][data-id="move"]').count()===1&&await p.locator('[data-do="unit-info"]').count()===1);
 await tap('mode','move');check(`${w}x${h} 이동 shows the reachable tiles`,(await v()).mode==='move'&&(await v()).ranges.length>0&&(await p.waitForTimeout(120),(await v()).drawnRanges===(await v()).ranges.length));
 await tile(5,6);check(`${w}x${h} touch move preview`,(await v()).pendingMove?.y===6);await lateTap('confirm-move');check(`${w}x${h} move confirmed by a late click`,(await snap()).units.find(u=>u.id==='eric').y===6);
 await lateTap('mode','attack');check(`${w}x${h} Attack command survives a re-render`,(await v()).mode==='attack');
 await tile(5,5);check(`${w}x${h} tapping the enemy opens the forecast`,(await v()).menu==='forecast');
 await lateTap('confirm');const s=await snap();check(`${w}x${h} attack resolves`,s.units.find(u=>u.id==='eric').acted&&s.units.find(u=>u.id==='b1').hp<24);
 await p.waitForFunction(()=>!AshenCrown.view().busy);await drainStory(p);if(await p.locator('#unit-popover:not([hidden]) [data-do="close-unit-menu"]').count())await tap('close-unit-menu');await tap('reset-camera');await tile(7,4);if((await v()).menu!=='root')await tile(7,4);await lateTap('submenu','skills');check(`${w}x${h} Skill submenu opens by touch`,(await v()).menu==='skills');
 await lateTap('mode','skill');check(`${w}x${h} skill mode selected`,(await v()).mode==='skill');
 const hp0=(await snap()).units.find(u=>u.id==='b1').hp;await tile(5,5);check(`${w}x${h} tapping the enemy in skill mode opens the skill forecast`,(await v()).menu==='forecast'&&(await v()).selected==='lia');
 await tile(5,5);await p.waitForFunction(()=>!AshenCrown.view().busy);const s2=await snap();check(`${w}x${h} tapping the same target again casts the skill`,s2.units.find(u=>u.id==='lia').acted&&s2.units.find(u=>u.id==='b1').hp<hp0);
 check(`${w}x${h} no runtime errors`,errors.length===0);await ctx.close();}
}finally{await b.close();}console.log(`${n} mobile command checks PASS`);
