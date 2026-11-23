// v2.7.1 (D-161) in the browser: 갈대 나루's square shows art pack M's painted request board (the image is in the page and loads),
// the clerk's menu still opens the board, and the town map lists the places in Korean. Screenshots in docs/v2.7.1/screenshots.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';
import {newGame} from '../src/core/game.js';import {serialize} from '../src/persistence/save-manager.js';import {VERSION} from '../src/data/game-data.js';import {drain} from './campaign-policy.mjs';
import {enterHub,travelTo} from '../src/core/frontier.js';
const shots='docs/v2.7.1/screenshots';fs.mkdirSync(shots,{recursive:true});
const village=()=>{const s=newGame(5,{heroes:null,results:[],clears:4,completed:[1,2,3,4],flags:{},choices:{m04_records_choice:'kept'}},5);enterHub(s,{story:false});drain(s);if(!travelTo(s,'reed'))throw Error('reed');drain(s);Object.assign(s.frontier,{x:16,y:8,facing:'left'});return s;};
const b=await launchTestBrowser({headless:true,args:['--no-sandbox','--disable-gpu']});let n=0;const check=(name,ok)=>{assert.ok(ok,name);n++;console.log('PASS',name);};
try{for(const [label,viewport,touch] of [['1440',{width:1440,height:900},false],['390',{width:390,height:844},true]]){
 const ctx=await b.newContext({viewport,hasTouch:touch,isMobile:touch});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 const button=async(a,id)=>{await p.evaluate(([a,id])=>{const x=document.createElement('button');x.dataset.do=a;if(id)x.dataset.id=id;x.style.cssText='position:fixed;left:0;top:0;width:4px;height:4px;z-index:99999';document.body.append(x);x.click();x.remove();},[a,id]);await p.waitForTimeout(300);};
 const restore=async s=>{await button('menu');await button('backup');await p.fill('#backup-text',serialize(s));await button('restore');await drainStory(p);await p.waitForTimeout(900);};
 await p.goto(pathToFileURL(process.cwd()+'/build/Ashen_Crown.html').href);await p.waitForFunction(()=>!!window.AshenCrown);check(`${label} the page is v${VERSION}`,await p.evaluate(()=>AshenCrown.version)===VERSION);
 await button('new');await drainStory(p);await restore(village());
 if(label==='1440')check('the build carries the painted board (props · requestBoard as WebP)',fs.readFileSync('build/Ashen_Crown.html','utf8').includes('"requestBoard":"data:image/webp'));
 if(label==='1440')await p.screenshot({path:`${shots}/reed-board-painted-${label}.png`});
 {const cam=await p.evaluate(()=>AshenCrown.view().hubCamera),box=await p.locator('#frontier-map').boundingBox(),cx=box.x+cam.x+(15+.5)*64*cam.scale,cy=box.y+cam.y+(7+.5)*64*cam.scale;touch?await p.touchscreen.tap(cx,cy):await p.mouse.click(cx,cy);
  for(let i=0;i<80&&!(await p.locator('#npc-menu').count());i++)await p.waitForTimeout(150);
  const menu=await p.evaluate(()=>[...document.querySelectorAll('#npc-menu button')].map(b=>b.textContent));check(`${label} the clerk still opens 의뢰 게시판 (${menu.join(' | ')})`,menu.some(t=>t.includes('의뢰 게시판')));
  await p.keyboard.press('Escape');await p.waitForTimeout(300);}
 await button('fast-map');const list=await p.evaluate(()=>[...document.querySelectorAll('.travel-list button')].map(b=>b.textContent.trim()));
 check(`${label} the town map lists the places in Korean (${list.slice(0,4).join(' / ')})`,list.length>=3&&list.every(t=>!/[A-Za-z]/.test(t.replace('✓',''))));
 check(`${label} no runtime errors`,errors.length===0);if(errors.length)console.log(errors);await ctx.close();
 }
 fs.mkdirSync('test-output',{recursive:true});fs.writeFileSync('test-output/v271-e2e.json',JSON.stringify({checks:n},null,1));console.log(`v271 e2e: ${n} checks passed`);
}finally{await b.close();}
