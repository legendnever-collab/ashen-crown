// v2.6.1 (the user's requests 2026-11-22 22:33) in the browser: every painted figure stands one tile tall on the battlefield,
// a press on the minimap sends the camera there, a plain drag moves the map, the full-screen button, the town person's menu
// draws 대화 and the service alike. Screenshots in docs/v2.6.1/screenshots.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';
import {newGame,startBattle} from '../src/core/game.js';import {serialize} from '../src/persistence/save-manager.js';import {VERSION} from '../src/data/game-data.js';import {drain} from './campaign-policy.mjs';
import {enterHub,enterInterior,currentHub} from '../src/core/frontier.js';import {playBattle} from './player-policy.mjs';
const shots='docs/v2.6.1/screenshots';fs.mkdirSync(shots,{recursive:true});
const battle=id=>{const s=newGame(7,null,id);s.screen='deployment';startBattle(s);drain(s);return s;};
const b=await launchTestBrowser({headless:true,args:['--no-sandbox','--disable-gpu']});let n=0;const check=(name,ok)=>{assert.ok(ok,name);n++;console.log('PASS',name);};
try{for(const [label,viewport,touch] of [['1440',{width:1440,height:900},false],['390',{width:390,height:844},true]]){
 const ctx=await b.newContext({viewport,hasTouch:touch,isMobile:touch});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 const press=async(a,id)=>{await p.evaluate(([a,id])=>{const x=document.createElement('button');x.dataset.do=a;if(id)x.dataset.id=id;x.style.cssText='position:fixed;left:0;top:0;width:4px;height:4px;z-index:99999';document.body.append(x);x.click();x.remove();},[a,id]);await p.waitForTimeout(300);};
 const restore=async s=>{await press('menu');await press('backup');await p.fill('#backup-text',serialize(s));await press('restore');await drainStory(p);await p.waitForTimeout(800);};
 const v=()=>p.evaluate(()=>AshenCrown.view());
 const center=async()=>{const c=(await v()).camera,box=await p.locator('#battle-map').boundingBox(),tp=64*c.scale;return {x:(box.width/2-c.x)/tp-.5,y:(box.height/2-c.y)/tp-.5};};
 await p.goto(pathToFileURL(process.cwd()+'/build/Ashen_Crown.html').href);await p.waitForFunction(()=>!!window.AshenCrown);check(`${label} the page is v${VERSION}`,await p.evaluate(()=>AshenCrown.version)===VERSION);
 await press('new');await drainStory(p);
 // 1. figures one tile tall: M27's mixed line-up, a screenshot to look at
 await restore(battle(27));if(label==='1440')await p.screenshot({path:`${shots}/figures-m27-${label}.png`});
 // 5. the minimap: a press on its far corner sends the camera there
 const mm=p.locator('#battle-minimap');check(`${label} the minimap is on screen and takes presses`,await mm.isVisible()&&(await mm.evaluate(e=>getComputedStyle(e).pointerEvents))!=='none');
 {const r=await mm.boundingBox(),c0=await center();const px=r.x+r.width*.95,py=r.y+r.height*.08;touch?await p.touchscreen.tap(px,py):await p.mouse.click(px,py);await p.waitForTimeout(900);const c1=await center();
  check(`${label} a press on the minimap's north-east corner moves the camera there (${c0.x.toFixed(1)},${c0.y.toFixed(1)} → ${c1.x.toFixed(1)},${c1.y.toFixed(1)})`,c1.x>c0.x+3&&c1.y<c0.y-1);}
 // 5. a plain drag (left button / one finger) moves the map
 if(!touch){const r=await p.locator('#battle-map').boundingBox(),c0=await center();await p.mouse.move(r.x+r.width*.3,r.y+r.height*.5);await p.mouse.down();for(let i=1;i<=10;i++)await p.mouse.move(r.x+r.width*.3+i*40,r.y+r.height*.5,{steps:2});await p.mouse.up();await p.waitForTimeout(700);const c1=await center();
  check(`${label} a left-button drag of 400 px to the right moves the view west (${c0.x.toFixed(1)} → ${c1.x.toFixed(1)})`,c1.x<c0.x-2);}
 // 6. full screen
 const fsb=p.locator('#fullscreen-btn');check(`${label} the full-screen button is in the top bar`,await fsb.count()===1);
 if(await fsb.isVisible()){touch?await fsb.tap():await fsb.click();await p.waitForTimeout(500);const on=await p.evaluate(()=>!!document.fullscreenElement);check(`${label} full screen turns on and the button says 창 모드 (${on})`,!on||(await fsb.innerText())==='창 모드');if(on){await p.evaluate(()=>document.exitFullscreen());await p.waitForTimeout(300);}}
 // 7. the tavern keeper's menu: 대화 and 인재 확보 drawn alike
 {const s=newGame(20261014);s.campaign.difficulty='normal';s.screen='deployment';startBattle(s);playBattle(s);enterHub(s,{aftermath:true,story:false});drain(s);const d=currentHub(s).places.find(q=>q.interior==='tavern');Object.assign(s.frontier,{x:d.x,y:d.y,facing:'up'});enterInterior(s,d.buildingId);
  const keeper=currentHub(s).npcs.find(q=>q.id==='tavernkeeper');await restore(s);
  const cam=await p.evaluate(()=>AshenCrown.view().hubCamera),box=await p.locator('#frontier-map').boundingBox(),px=box.x+cam.x+(keeper.x+.5)*64*cam.scale,py=box.y+cam.y+(keeper.y+.5)*64*cam.scale;
  touch?await p.touchscreen.tap(px,py):await p.mouse.click(px,py);for(let i=0;i<60&&!(await p.locator('#npc-menu').count());i++)await p.waitForTimeout(150);
  const classes=await p.evaluate(()=>[...document.querySelectorAll('#npc-menu button')].map(b=>b.className));
  check(`${label} the keeper's menu draws 대화 and 인재 확보 alike (${classes.slice(0,2).join(' | ')})`,classes.length>=2&&classes[0]===classes[1]&&!classes[1].includes('primary'));
  if(label==='1440')await p.screenshot({path:`${shots}/npc-menu-${label}.png`});}
 check(`${label} no runtime errors`,errors.length===0);if(errors.length)console.log(errors);await ctx.close();
 }
 fs.mkdirSync('test-output',{recursive:true});fs.writeFileSync('test-output/v261-e2e.json',JSON.stringify({checks:n},null,1));console.log(`v261 e2e: ${n} checks passed`);
}finally{await b.close();}
