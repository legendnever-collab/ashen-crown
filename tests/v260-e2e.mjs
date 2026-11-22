// v2.6.0 「지형과 성장」 (D-152) in the browser: Eric's move range stops at the first forest tile, the tile readout says the
// forest rule, Lia's fire on a foe in the forest forecasts 「🔥 숲 +50%」, and the EXP of the hit shows the level gap.
// Screenshots in docs/v2.6.0/screenshots.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';
import {newGame,startBattle} from '../src/core/game.js';import {findUnit} from '../src/core/rules.js';import {missionOf} from '../src/data/missions.js';import {serialize} from '../src/persistence/save-manager.js';
import {VERSION} from '../src/data/game-data.js';import {drain} from './campaign-policy.mjs';
const shots='docs/v2.6.0/screenshots';fs.mkdirSync(shots,{recursive:true});
// M01: a quiet forest edge — Eric on open ground, two forest tiles east; a raider in the forest, Lia two tiles off on open ground
function setup(){const s=newGame(4004);s.screen='deployment';startBattle(s);drain(s);const m=missionOf(s);
 const open=(x,y)=>'grv'.includes(m.map[y]?.[x]??'x');let spot=null,liaAt=null;
 for(let y=1;y<m.height-1&&!spot;y++)for(let x=1;x<m.width-3;x++)if(open(x,y)&&m.map[y][x+1]==='f'&&m.map[y][x+2]==='f'){const l=[[x+2,y+2],[x+2,y-2],[x+4,y],[x+3,y+1],[x+3,y-1],[x+1,y+2],[x+1,y-2]].find(([a,b])=>open(a,b)&&!(a===x&&b===y));if(l){spot=[x,y];liaAt=l;break;}}
 if(!spot)throw Error('no forest edge');const [x,y]=spot;
 for(const u of s.units)if(u.team==='enemy'&&u.id!=='b1')u.hp=0;
 const b1=findUnit(s,'b1');b1.x=x+2;b1.y=y;for(const u of s.units.filter(u=>u.team==='ally'))[u.x,u.y]=[0,0];
 const eric=findUnit(s,'eric');eric.x=x;eric.y=y;const lia=findUnit(s,'lia');[lia.x,lia.y]=liaAt;lia.mp=lia.maxMP;
 let i=0;for(const u of s.units.filter(u=>u.team==='ally'&&!['eric','lia'].includes(u.id)))[u.x,u.y]=[1+i++,m.height-2];
 return {s,x,y};}
const b=await launchTestBrowser({headless:true,args:['--no-sandbox','--disable-gpu']});let n=0;const check=(name,ok)=>{assert.ok(ok,name);n++;console.log('PASS',name);};
try{for(const [label,viewport,touch] of [['1440',{width:1440,height:900},false],['390',{width:390,height:844},true]]){
 const ctx=await b.newContext({viewport,hasTouch:touch,isMobile:touch});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 const press=async(a,id)=>{const l=p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first();touch?await l.tap():await l.click();await p.waitForTimeout(300);};
 const at=async(x,y)=>p.evaluate(([x,y])=>{const c=AshenCrown.tileCenter(x,y),r=document.querySelector('#battle-map').getBoundingClientRect();return {x:c.x+r.x,y:c.y+r.y};},[x,y]);
 const tile=async(x,y)=>{const pt=await at(x,y);touch?await p.touchscreen.tap(pt.x,pt.y):await p.mouse.click(pt.x,pt.y);await p.waitForTimeout(400);};
 const v=()=>p.evaluate(()=>AshenCrown.view()),snap=()=>p.evaluate(()=>AshenCrown.snapshot());
 const pick=async id=>{if(await p.locator('[data-do="close-unit-menu"]').count())await press('close-unit-menu');const u=(await snap()).units.find(u=>u.id===id);await tile(u.x,u.y);if((await v()).selected!==id){await press('reset-camera');await tile(u.x,u.y);}};
 await p.goto(pathToFileURL(process.cwd()+'/build/Ashen_Crown.html').href);await p.waitForFunction(()=>!!window.AshenCrown);check(`${label} the page is v${VERSION}`,await p.evaluate(()=>AshenCrown.version)===VERSION);
 const {s,x,y}=setup();await press('new');await drainStory(p);await press('menu');await press('backup');await p.fill('#backup-text',serialize(s));await press('restore');await drainStory(p);await p.waitForTimeout(500);
 // 1. the move range ends at the first forest tile
 await pick('eric');if((await v()).mode!=='move'&&await p.locator('[data-do="mode"][data-id="move"]').count())await press('mode','move');
 const ranges=(await v()).ranges.map(r=>`${r.x},${r.y}`);check(`${label} Eric's range reaches the first forest tile (${x+1},${y}) and stops there (the raider's tile ${x+2},${y} and beyond are out)`,ranges.includes(`${x+1},${y}`)&&!ranges.includes(`${x+2},${y}`)&&!ranges.includes(`${x+3},${y}`));
 if(label==='1440')await p.screenshot({path:`${shots}/forest-range-${label}.png`});
 // 2. the tile readout (desktop hover) says the forest rule
 if(!touch){const pt=await at(x+1,y);await p.mouse.move(pt.x,pt.y);await p.waitForTimeout(200);const r=await p.locator('#terrain-readout').textContent();check(`${label} the readout: 「${r}」`,r.includes('보병 들어서면 멈춤')&&r.includes('기병 불가')&&r.includes('에릭: 들어서면 이동 끝')&&r.includes('🔥 50%↑'));}
 await press('cancel').catch(()=>{});if(await p.locator('[data-do="close-unit-menu"]').count())await press('close-unit-menu');
 // 3. Lia's fire on the raider in the forest
 await pick('lia');check(`${label} Lia selected`,(await v()).selected==='lia');
 if(await p.locator('[data-do="submenu"][data-id="skills"]').count())await press('submenu','skills');await press('mode','skill');await tile(x+2,y);
 const fc=await p.locator('.forecast, .dock-hint').first().textContent().catch(()=>'');check(`${label} the forecast says 🔥 숲 +50% (「${fc.replace(/\s+/g,' ').slice(0,120)}」)`,fc.includes('🔥 숲 +50%'));
 if(label==='1440')await p.screenshot({path:`${shots}/fire-forecast-${label}.png`});
 // 4. the hit's EXP shows the gap when it changed the EXP
 const lia0=(await snap()).units.find(u=>u.id==='lia');await tile(x+2,y);await p.waitForFunction(()=>!AshenCrown.view().busy,{},{timeout:30000});await p.waitForTimeout(400);
 const lia1=(await snap()).units.find(u=>u.id==='lia');check(`${label} Lia earned EXP for the hit (${lia0.earnedXP} → ${lia1.earnedXP})`,lia1.earnedXP>lia0.earnedXP);
 check(`${label} no runtime errors`,errors.length===0);if(errors.length)console.log(errors);await ctx.close();
 }
 fs.mkdirSync('test-output',{recursive:true});fs.writeFileSync('test-output/v260-e2e.json',JSON.stringify({checks:n},null,1));console.log(`v260 e2e: ${n} checks passed`);
}finally{await b.close();}
