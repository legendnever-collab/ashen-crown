// QA: tier-2 painted art in the War Council head crops, M06 dialogue busts and battle sprites (all five promoted).
import {launchTestBrowser} from '../../tests/browser-helper.mjs';import {drainStory} from '../../tests/story-helper.mjs';import {pathToFileURL} from 'node:url';
import {newGame} from '../../src/core/game.js';import {enterHub} from '../../src/core/frontier.js';import {serialize} from '../../src/persistence/save-manager.js';import {drain} from '../../tests/campaign-policy.mjs';
import {applyClass} from '../../src/core/progression.js';import {CLASS_TREE} from '../../src/data/classes.js';
const out=process.argv[2]||'samples/v05',[W,H]=(process.argv[3]||'1440x900').split('x').map(Number);
const s=newGame(6006,{heroes:null,results:[],clears:5,completed:[1,2,3,4,5],flags:{},choices:{m04_records_choice:'kept'}},6);enterHub(s);drain(s);
for(const u of s.units.filter(u=>u.team==='ally'))applyClass(u,CLASS_TREE[u.id][1]);
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});const touch=W<600;const ctx=await b.newContext({viewport:{width:W,height:H},hasTouch:touch,isMobile:touch,deviceScaleFactor:touch?2:1});const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
const cmd=async a=>{await p.locator(`[data-do="${a}"]`).first().click();await p.waitForTimeout(350);};
await p.goto(pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.5.0.html').href);await cmd('new');await drainStory(p);await cmd('menu');await cmd('backup');await p.fill('#backup-text',serialize(s));await cmd('restore');await drainStory(p);await p.waitForTimeout(600);
for(const npc of ['advisor']){if(!await p.locator(`[data-do="npc"][data-id="${npc}"]`).count())continue;await p.locator(`[data-do="npc"][data-id="${npc}"]`).first().click();await p.waitForTimeout(900);await p.screenshot({path:`${out}/t2-dialogue-${npc}-${W}.png`});await drainStory(p);if(await p.locator('[data-do="close-modal"]').count())await cmd('close-modal');}
if((await p.evaluate(()=>AshenCrown.snapshot().screen))!=='warroom'){await cmd('warroom');await drainStory(p);}await p.waitForTimeout(600);await p.screenshot({path:`${out}/t2-council-${W}.png`});
await cmd('deploy');await p.waitForTimeout(400);await cmd('start-battle');if(await p.locator('[data-do="confirm-battle"]').count())await cmd('confirm-battle');let shots=0;
for(let i=0;i<40&&shots<6;i++){await p.waitForTimeout(450);if(!await p.locator('.dialogue-backdrop,.story-window,[data-do="story-next"]').count())break;const sp=await p.evaluate(()=>{const n=document.querySelector('.dialogue-name,.story-name');return n?.textContent||'';});if(/Erik|Elina|Lia|Sain|Kai|에릭|엘리나|리아|세인|카이/.test(sp)){await p.screenshot({path:`${out}/t2-dialogue-${shots}-${W}.png`});shots++;}
 if(await p.locator('[data-do="story-next"]').count())await p.locator('[data-do="story-next"]').first().click();else await p.mouse.click(W/2,H/2);}
await drainStory(p);await p.waitForTimeout(900);await p.screenshot({path:`${out}/t2-battle-${W}.png`});console.log(W,'dialogue shots',shots,'errors',errors);await b.close();
