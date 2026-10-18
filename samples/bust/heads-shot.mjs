// QA: painted head crops in the War Council roster (five heroes) and the unit sheet.
import {launchTestBrowser} from '../../tests/browser-helper.mjs';import {drainStory} from '../../tests/story-helper.mjs';import {pathToFileURL} from 'node:url';
import {newGame} from '../../src/core/game.js';import {enterHub} from '../../src/core/frontier.js';import {serialize} from '../../src/persistence/save-manager.js';import {drain} from '../../tests/campaign-policy.mjs';
const out=process.argv[2]||'test-output';const s=newGame(6006,{heroes:null,results:[],clears:5,completed:[1,2,3,4,5],flags:{},choices:{m04_records_choice:'kept'}},6);enterHub(s);drain(s);
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1440,height:900}});p.on('pageerror',e=>console.log('ERR',e.message));
const cmd=async a=>{await p.locator(`[data-do="${a}"]`).first().click();await p.waitForTimeout(300);};
await p.goto(pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.4.0.html').href);await cmd('new');await drainStory(p);await cmd('menu');await cmd('backup');await p.fill('#backup-text',serialize(s));await cmd('restore');await drainStory(p);
await cmd('warroom');await drainStory(p);await p.waitForTimeout(600);await p.screenshot({path:`${out}/heads-council.png`});await b.close();
