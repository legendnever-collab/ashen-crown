// QA: War Council sortie board and picture-first deployment at desktop and phone sizes.
import {launchTestBrowser} from '../../tests/browser-helper.mjs';import {drainStory} from '../../tests/story-helper.mjs';import {pathToFileURL} from 'node:url';
import {newGame,setSortie} from '../../src/core/game.js';import {enterHub} from '../../src/core/frontier.js';import {serialize} from '../../src/persistence/save-manager.js';import {drain} from '../../tests/campaign-policy.mjs';
const out=process.argv[2]||'test-output';const s=newGame(6006,{heroes:null,results:[],clears:1,completed:[1],flags:{}},2);enterHub(s);drain(s);s.screen='warroom';setSortie(s,'sain',false);s.screen='exploration';
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});
for(const [w,h,touch]of [[1440,900,false],[390,844,true]]){const ctx=await b.newContext({viewport:{width:w,height:h},hasTouch:touch,isMobile:touch});const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
 const cmd=async(a,id)=>{const l=p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first();touch?await l.tap():await l.click();await p.waitForTimeout(300);};
 await p.goto(pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.4.0.html').href);await cmd('new');await drainStory(p);await cmd('menu');await cmd('backup');await p.fill('#backup-text',serialize(s));await cmd('restore');await drainStory(p);
 await cmd('warroom');await drainStory(p);await cmd('select','sain');await p.waitForTimeout(500);await p.screenshot({path:`${out}/sortie-council-${w}.png`,fullPage:true});
 await cmd('deploy');await cmd('select','lia');await p.waitForTimeout(600);await p.screenshot({path:`${out}/sortie-deploy-${w}.png`});await ctx.close();}
await b.close();
