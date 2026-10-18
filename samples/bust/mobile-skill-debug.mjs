// Repro: mobile battle — tap hero, choose skill, tap target.
import {launchTestBrowser} from '../../tests/browser-helper.mjs';import {drainStory} from '../../tests/story-helper.mjs';import {pathToFileURL} from 'node:url';
import {newGame,startBattle} from '../../src/core/game.js';import {findUnit} from '../../src/core/rules.js';import {serialize} from '../../src/persistence/save-manager.js';import {drain} from '../../tests/campaign-policy.mjs';
const s=newGame(4004);s.screen='deployment';startBattle(s);drain(s);const lia=findUnit(s,'lia');lia.x=6;lia.y=7;
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const p=await ctx.newPage();p.on('pageerror',x=>console.log('ERR',x.message));
const cmd=async(a,id)=>{const l=p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first();await l.tap();await p.waitForTimeout(350);};
const view=()=>p.evaluate(()=>{const v=AshenCrown.view();return {sel:v.selected,mode:v.mode,menu:v.menu,ranges:v.ranges.length}});
const tap=async(x,y)=>{const pt=await p.evaluate(([x,y])=>{const c=AshenCrown.tileCenter(x,y),b=document.querySelector('#battle-map').getBoundingClientRect();return {x:c.x+b.x,y:c.y+b.y};},[x,y]);const top=await p.evaluate(({x,y})=>{const el=document.elementFromPoint(x,y);return el?.id||el?.className||el?.tagName;},pt);await p.touchscreen.tap(pt.x,pt.y);await p.waitForTimeout(400);return top;};
await p.goto(pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.4.0.html').href);await cmd('new');await drainStory(p);await cmd('menu');await cmd('backup');await p.fill('#backup-text',serialize(s));await cmd('restore');await drainStory(p);await p.waitForTimeout(500);
console.log('start',await view());
console.log('tap lia hits',await tap(6,7),await view());await cmd('mode','move');console.log('move mode',await view());await tap(7,7);console.log('after move tap',await view());if(await p.locator('[data-do="confirm-move"]').count())await cmd('confirm-move');console.log('confirmed',await view());await p.screenshot({path:process.argv[2]+'/m1.png'});
if(await p.locator('[data-do="submenu"][data-id="skills"]').count()){await cmd('submenu','skills');console.log('skills menu',await view());await cmd('mode','skill');console.log('skill mode',await view());}
console.log('tap enemy hits',await tap(6,4),await view());await p.screenshot({path:process.argv[2]+'/m2.png'});
console.log('tap eric hits',await tap(5,8),await view());
await b.close();
