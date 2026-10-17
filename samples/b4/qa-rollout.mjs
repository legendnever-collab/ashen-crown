// QA screenshots of the B4 rollout in the real standalone build.
import {launchTestBrowser} from '../../tests/browser-helper.mjs';import {drainStory} from '../../tests/story-helper.mjs';import {pathToFileURL} from 'node:url';
import {newGame,startBattle} from '../../src/core/game.js';import {findUnit} from '../../src/core/rules.js';import {serialize} from '../../src/persistence/save-manager.js';import {drain} from '../../tests/campaign-policy.mjs';
const out=process.argv[2],only=process.argv[3];
const battle=(m,setup,deployOnly=false)=>{const s=newGame(4004,m>1?{heroes:null,results:[],clears:m-1,completed:[...Array(m-1)].map((_,i)=>i+1),flags:{},choices:m===5&&!deployOnly?{m05_erik_answer:'present'}:{}}:undefined,m);s.screen='deployment';if(deployOnly)return s;startBattle(s);drain(s);setup?.(s);return s;};
const shots=[
 ['m01',battle(1,s=>{for(const [id,x,y]of [['eric',6,8],['elina',4,8],['lia',8,8],['sain',5,9],['kai',9,7]]){const u=findUnit(s,id);u.x=x;u.y=y;}}),{select:[6,8]}],
 ['m02',battle(2)],['m03',battle(3)],['m04',battle(4)],
 ['m05',battle(5,s=>{for(const [id,x,y]of [['eric',8,8],['lia',10,9],['kai',13,8]]){const u=findUnit(s,id);u.x=x;u.y=y;}const b=findUnit(s,'boss');b.x=9;b.y=5;findUnit(s,'s3').x=7;}),{select:[8,8]}],['m05deploy',battle(5,null,true)],
 ['village',null],['camp',(()=>{const s=newGame(4004,{heroes:null,results:[],clears:1,completed:[1],flags:{}},2);return s;})()]];
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});
for(const [name,s,opt]of shots){if(only&&!only.split(',').includes(name))continue;for(const [w,h,touch] of [[1440,900,false],[390,844,true]]){
 const ctx=await b.newContext({viewport:{width:w,height:h},hasTouch:touch,isMobile:touch});await ctx.setOffline(true);const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',name,e.message));
 const cmd=async(a,id)=>{const l=p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first();touch?await l.tap():await l.click();await p.waitForTimeout(250);};
 await p.goto(pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.4.0.html').href);await cmd('new');await drainStory(p);
 if(s){await cmd('menu');await cmd('backup');await p.fill('#backup-text',serialize(s));await cmd('restore');await drainStory(p);}
 await p.waitForTimeout(700);
 if(opt?.select){const c=await p.evaluate(([x,y])=>window.AshenCrown.tileCenter(x,y),opt.select);await p.mouse.click(c.x,c.y);await p.waitForTimeout(300);await p.keyboard.press('1');await p.waitForTimeout(400);}
 await p.screenshot({path:`${out}/roll-${name}-${w}.png`});await ctx.close();}}
await b.close();
