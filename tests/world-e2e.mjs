// v0.5.0 world map and painted hubs (D-052) in the browser: the new-game Erdia intro (W4), the
// travel map when the legion moves (M03 aftermath → bivouac), the wandering merchant's open-air stall
// selling items and weapons, the menu world map, and reload safety. 1440 desktop and 390 phone.
import {launchTestBrowser} from './browser-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize} from '../src/persistence/save-manager.js';import {newGame,startBattle} from '../src/core/game.js';import {enterHub} from '../src/core/frontier.js';import {HUBS} from '../src/data/frontier-data.js';
import {drain,playCampaignBattle} from './campaign-policy.mjs';import {drainStory} from './story-helper.mjs';
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});let n=0;const results=[];const check=(name,ok)=>{assert.ok(ok,name);n++;results.push(name);console.log('PASS',name);};
const url=pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.5.0.html').href;fs.mkdirSync('test-output',{recursive:true});
// M03 won, still on the result screen, legion last stood in the Border Camp.
function m3Won(){const s=newGame(20261020,{heroes:null,results:[],clears:2,completed:[1,2],flags:{mission_01_completed:true},tacticalMemory:{}},3);enterHub(s,{story:false});drain(s);s.screen='deployment';startBattle(s);playCampaignBattle(s,true);return s;}
function bivouac(near=false){const s=newGame(20261021,{heroes:null,results:[],clears:3,completed:[1,2,3],flags:{mission_01_completed:true},tacticalMemory:{}},4);enterHub(s,{story:false});drain(s);if(near){s.frontier.x=9;s.frontier.y=8;s.campaign.frontier=structuredClone(s.frontier);}return s;}
try{for(const [w,h,touch] of [[1440,900,false],[390,844,true]]){
 const label=`${w}`,ctx=await b.newContext({viewport:{width:w,height:h},hasTouch:touch,isMobile:touch,deviceScaleFactor:touch?2:1});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 const press=async(a,id)=>{const l=p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first();touch?await l.tap():await l.click();await p.waitForTimeout(250);};
 const snap=()=>p.evaluate(()=>AshenCrown.snapshot()),next=async()=>{await press('story-next');await p.waitForTimeout(200);};
 const restore=async s=>{await drainStory(p);await press('menu');await press('backup');await p.fill('#backup-text',serialize(s));await press('restore');};
 const tile=async(x,y)=>{const t=await p.evaluate(([x,y])=>{const b=document.querySelector('#frontier-map').getBoundingClientRect(),c=AshenCrown.view().hubCamera;return{x:b.x+c.x+(x+.5)*64*c.scale,y:b.y+c.y+(y+.5)*64*c.scale};},[x,y]);touch?await p.touchscreen.tap(t.x,t.y):await p.mouse.click(t.x,t.y);await p.waitForFunction(()=>!AshenCrown.view().busy);await p.waitForTimeout(200);};
 // 1. New game opens on the continent, then the region card for the Eastern March.
 await p.goto(url);await press('new');await p.waitForTimeout(400);let s=await snap();
 check(`${label} new game opens the Erdia world map first`,s.narrative.active?.key==='world:intro'&&await p.locator('#world-stage').count()===1&&(await p.locator('.dialogue-name').textContent())==='연대기');
 await p.waitForTimeout(1700);check(`${label} world canvas is painted`,await p.evaluate(()=>{const c=document.querySelector('#world-stage');return c.width>0&&!!c.dataset.worldFocus;}));
 await next();await next();check(`${label} third line zooms to the Eastern March with the ACT I card`,(await p.locator('.world-card').textContent()).includes('동부 변경')&&(await p.locator('.world-card').textContent()).includes('잿빛 마을'));
 await p.waitForTimeout(1700);await p.screenshot({path:`test-output/world-intro-${w}.png`});
 await p.reload();await p.waitForFunction(()=>!!window.AshenCrown);await p.waitForTimeout(300);check(`${label} world map survives reload mid-intro`,(await snap()).narrative.active?.key==='world:intro'&&await p.locator('#world-stage').count()===1);
 await next();s=await snap();check(`${label} the intro hands over to the village morning (pre:1)`,s.narrative.active?.key==='pre:1'&&!await p.locator('#world-stage').count());
 // 2. Moving on: M03 aftermath travels from the Border Camp to the night bivouac.
 await restore(m3Won());await p.waitForTimeout(300);s=await snap();check(`${label} M03 won on the result screen`,s.screen==='result'&&s.outcome==='victory'&&s.frontier.hub==='camp');
 await press('aftermath');await p.waitForTimeout(400);s=await snap();
 check(`${label} aftermath shows the travel map to the bivouac first`,s.narrative.active?.key==='world:bivouac'&&s.frontier.hub==='bivouac'&&(await p.locator('.world-card').textContent()).includes('강가 야영'));
 await p.waitForTimeout(1700);await p.screenshot({path:`test-output/world-travel-${w}.png`});await next();s=await snap();
 check(`${label} then the staged campfire scene plays in the bivouac`,s.narrative.active?.key.startsWith('after:3')&&await p.locator('#scene-stage').count()===1);
 // 3. Wandering merchant: one stall, items and weapons.
 await restore(bivouac());await p.waitForTimeout(400);s=await snap();check(`${label} M04 preparation in the painted bivouac at Lia's table`,s.frontier.hub==='bivouac'&&s.screen==='exploration'&&s.frontier.x===HUBS.bivouac.spawn[0]);
 await p.waitForTimeout(500);await p.screenshot({path:`test-output/hub-bivouac-${w}.png`});
 await restore(bivouac(true));await p.waitForTimeout(400);const m=HUBS.bivouac.npcs.find(n=>n.id==='merchant');await tile(m.x,m.y);await p.waitForTimeout(300);
 if(!await p.locator('[data-do="stall-service"]').count())await press('npc','merchant');
 check(`${label} the merchant's stall offers items and weapons together`,await p.locator('[data-do="stall-service"][data-id="item|buy"]').count()===1&&await p.locator('[data-do="stall-service"][data-id="weapon|buy"]').count()===1);
 const gold=(await snap()).economy.gold;await press('stall-service','item|buy');await press('transaction','buy-item|medium');await press('confirm-transaction');s=await snap();
 check(`${label} buying a potion at the stall spends Gold once and reopens the stall shop`,s.economy.gold===gold-30&&s.economy.items.medium===1&&await p.locator('.shop-list').count()===1);
 await press('shop-owner');await press('stall-service','weapon|buy');check(`${label} the same merchant sells weapons`,(await p.locator('#modal-root').textContent()).includes('BLACKSMITH'));
 await press('close-modal');check(`${label} no shop interior was entered`,!(await snap()).frontier.interior);
 // 4. Menu world map (read-only).
 await press('menu');await press('world-map');await p.waitForTimeout(600);check(`${label} menu opens the world map`,await p.locator('#world-view').count()===1);await press('close-modal');
 check(`${label} no horizontal overflow`,await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 check(`${label} no runtime errors`,errors.length===0);await ctx.close();
}console.log(`${n} world checks PASS`);
}finally{fs.writeFileSync('test-output/world-e2e.json',JSON.stringify({checks:results},null,1));await b.close();}
