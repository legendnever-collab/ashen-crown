import fs from 'node:fs';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {launchTestBrowser} from './browser-helper.mjs';
import {terrainPixels} from './m01-terrain-pixels.mjs';
import {fitMap,restoreText} from './arena-helper.mjs';
import {drainStory} from './story-helper.mjs';
import {deserialize,serialize} from '../src/persistence/save-manager.js';
import {startBattle} from '../src/core/game.js';
import {drain} from './campaign-policy.mjs';
import {m06ThreatTiles} from '../src/core/mission-rules.js';

const browser=await launchTestBrowser({headless:true,args:['--no-sandbox','--disable-gpu']});
fs.mkdirSync('test-output',{recursive:true});
try {
 for(const width of [1440,390]){
  const touch=width===390;
  const ctx=await browser.newContext({viewport:{width,height:touch?844:900},hasTouch:touch,isMobile:touch,deviceScaleFactor:touch?3:1});
  await ctx.setOffline(true);
  const page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  if(touch)await page.addInitScript(()=>{
   const put=CanvasRenderingContext2D.prototype.putImageData;
   CanvasRenderingContext2D.prototype.putImageData=function(...args){
    if(window.dropTerrainUploads!==false)return;
    return put.apply(this,args);
   };
  });
  await page.goto(pathToFileURL(path.resolve(process.env.MAP_TEST_HTML||'build/Ashen_Crown.html')).href);
  const press=async action=>{
   const el=page.locator('[data-do="'+action+'"]').first();
   if(touch)await el.tap();else await el.click();
   await drainStory(page);
  };
  for(const action of ['new','warroom','deploy'])await press(action);
  for(const screen of ['deployment','battle']){
   if(screen==='battle')await press('start-battle');
   await press('reset-camera');await fitMap(page,touch);
   await page.waitForTimeout(350);
   const colors=await terrainPixels(page);
   console.log(width,screen,JSON.stringify(colors));
   await page.screenshot({path:'test-output/m01-'+width+'-'+screen+'.png'});
   assert.ok(colors.grass.green>.4&&colors.road.brown>.4&&colors.forest.green>.3&&colors.house.brown>.15,'recognizable M01 terrain and village');
   if(screen==='deployment'){
    const select=page.locator('[data-do="select"][data-id="eric"]').first();
    if(touch)await select.tap();else await select.click();
    assert.ok(await page.evaluate(()=>AshenCrown.view().mode==='deploy'&&AshenCrown.view().ranges.length>0));
   }
  }
  await page.evaluate(()=>{window.dropTerrainUploads=false;});
  const opening=await page.evaluate(()=>AshenCrown.snapshot());
  assert.equal(opening.turn,1);assert.equal(opening.screen,'battle');
  assert.deepEqual(opening.units.filter(u=>u.id==='kai').map(u=>[u.x,u.y]),[[10,8]]);
  const camp=deserialize(fs.readFileSync(new URL('./fixtures/v280/m06-camp.json',import.meta.url),'utf8'));
  camp.screen='deployment';startBattle(camp);drain(camp);
  await restoreText(page,serialize(camp),touch);
  const guard=camp.units.find(u=>u.id==='k1'),expected=m06ThreatTiles(camp,guard).size;
  assert.ok(expected>0);
  const toggle=page.locator('#threat-button');
  await press('threat-view');
  assert.equal(await toggle.getAttribute('aria-pressed'),'true');
  await page.evaluate(([x,y])=>AshenCrown.lookAt(x,y),[guard.x,guard.y]);
  await page.waitForTimeout(350);
  const pt=await page.evaluate(([x,y])=>{
   const map=document.querySelector('#battle-map'),rect=map.getBoundingClientRect(),p=AshenCrown.tileCenter(x,y);
   x=rect.x+p.x;y=rect.y+p.y;
   return {x,y,hit:document.elementFromPoint(x,y)?.id};
  },[guard.x,guard.y]);
  assert.equal(pt.hit,'battle-map','guard tile is clear of dock and minimap');
  if(touch)await page.touchscreen.tap(pt.x,pt.y);else await page.mouse.click(pt.x,pt.y);
  await page.getByText(guard.name+' · 공격 가능 '+expected+'칸',{exact:false}).first().waitFor();
  await page.screenshot({path:'test-output/m06-threat-'+width+'.png'});
  await press('threat-view');assert.equal(await toggle.getAttribute('aria-pressed'),'false');
  assert.deepEqual(errors,[]);
  console.log(width+'px · offline new game → council → deployment → M01; M06 guard and toggle PASS');
  await ctx.close();
 }
}finally{await browser.close();}
