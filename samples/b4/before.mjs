import {launchTestBrowser} from '../../tests/browser-helper.mjs';import {drainStory} from '../../tests/story-helper.mjs';import {pathToFileURL} from 'node:url';
import {newGame,startBattle} from '../../src/core/game.js';import {findUnit} from '../../src/core/rules.js';import {serialize} from '../../src/persistence/save-manager.js';import {drain} from '../../tests/campaign-policy.mjs';
const out=process.argv[2];
const s=newGame(4004);s.screen='deployment';startBattle(s);drain(s);
for(const [id,x,y]of [['eric',6,8],['elina',4,8],['lia',8,8],['sain',5,9],['kai',9,7],['c1',2,4],['c2',10,3]]){const u=findUnit(s,id);u.x=x;u.y=y;}
findUnit(s,'b2').hp=18;
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});
const ctx=await b.newContext({viewport:{width:1536,height:1240}});await ctx.setOffline(true);const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
const cmd=async(a,id)=>{await p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first().click();await p.waitForTimeout(250);};
await p.goto(pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.4.0.html').href);await cmd('new');await drainStory(p);await cmd('menu');await cmd('backup');await p.fill('#backup-text',serialize(s));await cmd('restore');await drainStory(p);await p.waitForTimeout(600);
const c=await p.evaluate(()=>window.AshenCrown.tileCenter(6,8));await p.mouse.click(c.x,c.y);await p.waitForTimeout(300);await p.keyboard.press('1');await p.waitForTimeout(500);
await p.screenshot({path:`${out}/before-m01.png`});await b.close();
