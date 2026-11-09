// v0.9.1 play-test feedback (2026-11-06, D-087): an empty chest shows the room's own painted chest, open and empty (not the
// game-drawn potion placeholder), and narration lines (연대기) in battle show no speaker portrait (not a placeholder face).
// Art pack F2 (D-088): the elder at the keep (M17) and in the forest (M18) speaks under the right name.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import fs from 'node:fs';
import {serialize} from '../src/persistence/save-manager.js';import {actOneCamp} from './skirmish-policy.mjs';import {newGame} from '../src/core/game.js';
import {openStory} from '../src/core/narrative.js';import {startBattle} from '../src/core/game.js';
import {enterHub,currentHub,enterInterior,interactions,chestReward,chestKey,walkable} from '../src/core/frontier.js';
const out=process.argv[2]||'docs/v0.9.1/screenshots/feedback';fs.mkdirSync(out,{recursive:true});
let pick=null;
for(let seed=1;seed<400&&!pick;seed++){const c=structuredClone(actOneCamp(20261021,8).campaign);c.completed=[1,2,3,4,5,6,7,8,9,10];c.factionTrust={iron:1,free:0,flame:0};c.roster=['thea','dario'];Object.assign(c.choices,{m07_deserters:'legion',m08_order:'hold'});
 const s=newGame(seed,c,11);enterHub(s,{story:false});const d=currentHub(s).places.find(q=>q.id==='inn-1');s.frontier.x=d.x;s.frontier.y=d.y;s.frontier.facing='up';if(!enterInterior(s,d.buildingId))continue;
 for(const b of currentHub(s).buildings.filter(b=>b.type==='chest')){if(chestReward(s.initialSeed,chestKey(s,b.chestId)).kind!=='empty')continue;
  for(const [dx,dy] of [[0,1],[1,0],[-1,0],[0,-1]]){const x=b.x+dx,y=b.y+dy;if(walkable(s,x,y)){s.frontier.x=x;s.frontier.y=y;const it=interactions(s).find(n=>n.action==='chest'&&n.chestId===b.chestId);if(it){pick={s,id:it.id,seed};break;}}}if(pick)break;}}
console.log('seed',pick?.seed,'place',pick?.id);
const url=pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.9.3.html').href,b=await launchTestBrowser({headless:true,args:['--no-sandbox']});let ok=0,bad=0;const check=(n,c)=>{console.log((c?'PASS ':'FAIL ')+n);c?ok++:bad++;};
try{const ctx=await b.newContext({viewport:{width:1440,height:900}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e)));await p.goto(url);
 const press=async(a,id)=>{await p.locator(id?`[data-do="${a}"][data-id="${id}"]`:`[data-do="${a}"]`).first().click();await p.waitForTimeout(250);};
 await press('new');await drainStory(p);await press('menu');await press('backup');await p.fill('#backup-text',serialize(pick.s));await press('restore');await drainStory(p);await p.waitForTimeout(800);
 await press('place',pick.id);await p.waitForTimeout(600);
 const m=await p.evaluate(()=>{const r=document.querySelector('#modal-root .chest-find');return r?{img:!!r.querySelector('img.chest-empty.painted'),svg:!!r.querySelector('svg'),text:r.innerText,loaded:r.querySelector('img')?.naturalWidth||0}:null;});
 check(`empty chest modal shows the room's painted open chest (${JSON.stringify(m)})`,m&&m.img&&!m.svg&&m.loaded>0&&/먼지와 거미줄/.test(m.text));
 await p.locator('#modal-root .modal').screenshot({path:`${out}/empty-chest-modal.png`});await press('close-modal');
 // narration line in battle (M16 echo): no portrait canvas
 const c16=structuredClone(pick.s.campaign);c16.completed=[...Array(15).keys()].map(i=>i+1);c16.clears=15;Object.assign(c16.flags,{act1_completed:true,act2_completed:true,mission_14_betrayer:'iron'});
 const b16=newGame(5,c16,16);b16.screen='deployment';startBattle(b16);b16.narrative.active=null;b16.narrative.queue=['16:echo:st1'];openStory(b16);
 await press('menu');await press('backup');await p.fill('#backup-text',serialize(b16));await press('restore');await p.waitForTimeout(900);
 const d=await p.evaluate(()=>({narr:!!document.querySelector('.dialogue-panel.narration'),bust:!!document.querySelector('.dialogue-panel canvas.story-bust'),name:document.querySelector('.dialogue-name')?.innerText}));
 check(`narration line in battle shows no portrait (${JSON.stringify(d)})`,d.narr&&!d.bust&&d.name==='연대기');await p.screenshot({path:`${out}/narration-1440.png`});
 await p.setViewportSize({width:390,height:844});await p.waitForTimeout(400);await p.screenshot({path:`${out}/narration-390.png`});
 await p.setViewportSize({width:1440,height:900});await drainStory(p);
 for(const [id,who] of [[17,'마지막 수호자'],[18,'숲지기 장로']]){const c=structuredClone(c16);c.completed=[...Array(id-1).keys()].map(i=>i+1);c.clears=id-1;const h=newGame(5,c,id);enterHub(h,{story:false});h.narrative.queue=[`pre:${id}`];openStory(h);
  await press('menu');await press('backup');await p.fill('#backup-text',serialize(h));await press('restore');await p.waitForTimeout(900);
  const n=await p.evaluate(()=>({name:document.querySelector('.dialogue-name')?.innerText,bust:!!document.querySelector('.dialogue-panel canvas.story-bust')}));
  check(`M${id} hub: the elder speaks as ${who} with a portrait (${JSON.stringify(n)})`,n.name===who&&n.bust);await p.screenshot({path:`${out}/elder-${id}-1440.png`});await drainStory(p);}
 check('no page errors',!errs.length);
 await ctx.close();}finally{await b.close();}
fs.mkdirSync('test-output',{recursive:true});fs.writeFileSync('test-output/feedback-v091-e2e.json',JSON.stringify({passed:ok,failed:bad},null,2));
console.log(`feedback-v091-e2e: ${ok} checks passed${bad?`, ${bad} failed`:''}`);process.exit(bad?1:0);
