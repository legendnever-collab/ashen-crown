// QA: in-battle dialogue window with painted busts (M06 intro: Erik, then the blockade executor).
import {launchTestBrowser} from '../../tests/browser-helper.mjs';import {pathToFileURL} from 'node:url';
import {newGame,startBattle} from '../../src/core/game.js';import {introStory,advanceStory} from '../../src/core/narrative.js';import {serialize} from '../../src/persistence/save-manager.js';
const out=process.argv[2]||'test-output';
const s=newGame(6006,{heroes:null,results:[],clears:5,completed:[1,2,3,4,5],flags:{},choices:{m04_records_choice:'reported'}},6);s.screen='deployment';startBattle(s);introStory(s);
const boss=structuredClone(s);for(let i=0;i<4;i++)advanceStory(boss);
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});
for(const [name,state]of [['erik',s],['boss',boss]])for(const [w,h,touch]of [[1440,900,false],[390,844,true],[844,390,true]]){
 const ctx=await b.newContext({viewport:{width:w,height:h},hasTouch:touch,isMobile:touch});const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
 await p.goto(pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.4.0.html').href);await p.evaluate(()=>localStorage.clear());await p.reload();
 await p.evaluate(t=>{localStorage.setItem('ashen-crown:v1',t);},serialize(state));await p.reload();await p.waitForTimeout(900);
 await p.screenshot({path:`${out}/dialogue-battle-${name}-${w}.png`});await ctx.close();}
await b.close();
