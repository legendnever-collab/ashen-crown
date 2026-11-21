// v2.1 「주점과 세계지도」 in the browser (D-118): the five start alone; the tavern's 인재 확보 hires Bram; leaving the camp opens
// the world map with the small villages M04 opened; the reed request board, the request sortie and its battle; a duel
// event when Erik stands beside Garr (no challenge command); the sortie board on the deployment screen. 1440 and 390.
import {waitDuelScene} from './duel-helper.mjs';import {launchTestBrowser} from './browser-helper.mjs';import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';import {drainStory} from './story-helper.mjs';
import {newGame,startBattle,nextMission} from '../src/core/game.js';import {enterHub,currentHub,enterInterior} from '../src/core/frontier.js';import {hire} from '../src/core/tavern.js';import {serialize} from '../src/persistence/save-manager.js';import {findUnit} from '../src/core/rules.js';
import {playBattle} from './player-policy.mjs';import {playCampaignBattle,drain} from './campaign-policy.mjs';
// Saves made with the game's own rules (no field edited except where the player stands, which walking would reach).
function afterMission(n){let s=newGame(20261014);s.campaign.difficulty='normal';s.screen='deployment';startBattle(s);playBattle(s);
 for(let id=2;id<=n;id++){const camp=nextMission(s);let won=null;for(let t=0;t<6&&!won;t++){const b=structuredClone(camp);b.rng=b.initialSeed=(b.rng+t*7919)>>>0;b.screen='deployment';startBattle(b);drain(b);playCampaignBattle(b,true);if(b.outcome==='victory')won=b;}if(!won)throw Error(`M0${id}`);s=won;if(id===4)s.campaign.choices.m04_records_choice='kept';}
 enterHub(s,{aftermath:true,story:false});drain(s);return s;}
const inTavern=s=>{const d=currentHub(s).places.find(p=>p.interior==='tavern');Object.assign(s.frontier,{x:d.x,y:d.y,facing:'up'});if(!enterInterior(s,d.buildingId))throw Error('tavern');Object.assign(s.frontier,{x:3,y:4,facing:'up'}); /* v2.2: at the bar, where the keeper stands behind it */return s;};
const atGate=s=>{const g=currentHub(s).places.find(p=>p.id==='gate'||p.id==='exit');Object.assign(s.frontier,{x:g.x,y:g.y,facing:'down'});return s;};
const camp1=afterMission(1),tavernSave=serialize(inTavern(structuredClone(camp1)));camp1.campaign.economy.gold=Math.max(camp1.campaign.economy.gold,200);camp1.economy.gold=camp1.campaign.economy.gold;
const sortieSave=(()=>{const t=inTavern(structuredClone(camp1));const r=hire(t,'bram');if(!r.ok)throw Error(r.error);const n=nextMission(t);n.screen='deployment';return serialize(n);})();
const camp4=afterMission(4),gateSave=serialize(atGate(structuredClone(camp4)));
const duel=(()=>{const s=newGame(20261014);s.campaign.difficulty='normal';s.screen='deployment';startBattle(s);drain(s);const g=findUnit(s,'boss'),e=findUnit(s,'eric');
 for(const t of [s,s.stageStart]){const gg=findUnit(t,'boss'),ee=findUnit(t,'eric');ee.x=gg.x;ee.y=gg.y+1;}for(const u of s.units.filter(u=>u.team==='enemy'&&u.id!=='boss'))for(const t of [s,s.stageStart]){const v=findUnit(t,u.id);v.x=Math.min(21,v.x+8);}return serialize(s);})();

const browser=await launchTestBrowser({headless:true,args:['--no-sandbox','--disable-gpu']}),checks=[],errors=[];const check=(name,ok)=>{assert.ok(ok,name);checks.push({name,status:'PASS'});console.log('PASS',name);};
const shots='docs/v2.2.0/screenshots';fs.mkdirSync(shots,{recursive:true});
try{for(const [width,height,touch] of [[1440,900,false],[390,844,true]]){const label=`${width}`;
 const ctx=await browser.newContext({viewport:{width,height},hasTouch:touch,isMobile:touch});await ctx.setOffline(true);const p=await ctx.newPage();p.on('pageerror',e=>errors.push(`${label}: ${e.message}`));
 const press=async(a,id)=>{await p.evaluate(([a,id])=>{const b=document.createElement('button');b.dataset.do=a;if(id)b.dataset.id=id;b.style.cssText='position:fixed;left:0;top:0;width:4px;height:4px;z-index:99999';document.body.append(b);b.click();b.remove();},[a,id]);await p.waitForTimeout(220);};
 const click=async(sel)=>{const l=p.locator(sel).first();touch?await l.tap():await l.click();await p.waitForTimeout(220);};
 const snap=()=>p.evaluate(()=>AshenCrown.snapshot());
 const restore=async text=>{await drainStory(p);await click('[data-do="menu"]');await click('[data-do="backup"]');await p.locator('#backup-text').fill(text);await click('[data-do="restore"]');await p.waitForFunction(()=>!AshenCrown.view().busy);await p.waitForTimeout(300);await drainStory(p);};
 await p.goto(pathToFileURL(path.resolve('build/Ashen_Crown.html')).href);await p.waitForFunction(()=>!!window.AshenCrown);
 check(`${label} the page is the current version`,await p.evaluate(()=>AshenCrown.version)==='2.4.1');
 await click('[data-do="new"]');await drainStory(p);let s=await snap();
 check(`${label} a new campaign is the five alone (no officers in the legion or the camp)`,s.campaign.roster.length===0&&s.units.filter(u=>u.team==='ally').map(u=>u.id).join()==='eric,elina,lia,sain,kai'&&!(await p.evaluate(()=>AshenCrown.view().hubNpcs||[])).some?.(id=>['bram','noa','marta'].includes(id)));
 // Play-test (D-120): the town pace — holding a direction for ~1 s walks at most five tiles (one per 210 ms; it was ten).
 if(!touch&&s.screen==='exploration'){let best=0;for(const key of ['ArrowRight','ArrowLeft','ArrowDown','ArrowUp']){const a=(await snap()).frontier;await p.keyboard.down(key);await p.waitForTimeout(1050);await p.keyboard.up(key);await p.waitForTimeout(300);const b=(await snap()).frontier;best=Math.max(best,Math.abs(b.x-a.x)+Math.abs(b.y-a.y));}
  check(`${label} walking in town: at most five tiles in a one-second hold (moved ${best})`,best>=2&&best<=5);}
 // 1. Tavern: 인재 확보 → hire Bram
 await restore(tavernSave);s=await snap();check(`${label} the restored save stands in the ash village tavern`,s.frontier.interior==='tavern');
 await press('npc','tavernkeeper');let text=await p.locator('.modal').innerText();check(`${label} 인재 확보 lists Bram, Noa and Marta with their fee`,['브람','노아','마르타','200 G'].every(k=>text.includes(k)));
 await p.screenshot({path:`${shots}/tavern-${label}.png`});
 await press('hire','bram');s=await snap();check(`${label} hiring Bram: in the legion, the fee paid`,s.campaign.roster.includes('bram')&&(s.economy.hired||[]).includes('bram'));
 text=await p.locator('.modal').innerText();check(`${label} the keeper says a word about the new hire`,text.includes('합류'));await press('close-modal');
 // 2. World map at the gate → the small villages → the request board → the request sortie → its battle
 await restore(gateSave);await press('place',(await snap()).frontier.hub==='fortress'?'gate':'exit');await p.waitForTimeout(400);
 await p.screenshot({path:`${shots}/world-map-${label}.png`});const markers=await p.locator('.world-marker').allInnerTexts();console.log('markers',markers);check(`${label} leaving the camp opens the world map: the camp, the ash village and the two small villages`,['야영지','갈대 나루','돌우물 마을','잿빛 마을'].every(k=>markers.some(m=>m.includes(k))));
 await p.screenshot({path:`${shots}/world-map-${label}.png`});
 await click('.town-list [data-do="travel"][data-id="reed"]');s=await snap();check(`${label} tapping 갈대 나루 travels there`,s.frontier.hub==='reed');await drainStory(p);await p.screenshot({path:`${shots}/reed-village-${label}.png`});
 await press('npc','requests');text=await p.locator('.modal').innerText();check(`${label} the request board: ferry bandits, barge escort, herbs and the bounty`,['나루터의 산적','짐배 호위','약초 모으기','현상금'].every(k=>text.includes(k)));
 await p.screenshot({path:`${shots}/request-board-${label}.png`});
 await press('request-sortie','ferry');check(`${label} the request asks who goes (five picked)`,await p.locator('[data-do="req-sortie"][aria-pressed="true"]').count()===5);
 await press('req-sortie','sain');check(`${label} a tap leaves Sain behind`,await p.locator('[data-do="req-sortie"][aria-pressed="true"]').count()===4);await p.screenshot({path:`${shots}/request-sortie-${label}.png`});
 await press('request-start','ferry');await drainStory(p);s=await snap();check(`${label} the request battle starts with the chosen four (mission 120)`,s.screen==='battle'&&s.missionId===120&&s.units.filter(u=>u.team==='ally'&&!u.benched).length===4&&findUnit(s,'sain').benched);
 await p.screenshot({path:`${shots}/request-battle-${label}.png`});
 // 3. Duel event: Erik beside Garr when the player's phase opens; no challenge command in the unit menu
 await restore(duel);await press('select','eric');const menu=await p.evaluate(()=>document.body.innerText);check(`${label} no 일기토 신청 anywhere on the battle screen`,!menu.includes('일기토 신청'));
 await press('end-phase');await press('confirm-phase');for(let i=0;i<80&&(await snap()).phase!=='player';i++)await p.waitForTimeout(150);await p.waitForTimeout(400);
 const lv0=(await snap()).units.find(u=>u.id==='eric').level;const sc=await waitDuelScene(p);s=await snap();
 check(`${label} the next player phase opens the Erik–Garr duel event and its window (v2.2)`,sc&&s.duel?.key==='duel:1:garr');
 check(`${label} v2.2: the duel is won by Erik at once — a level up, Garr falls and leaves the field (D-124), no choice offered`,s.duel.result==='hero'&&s.units.find(u=>u.id==='eric').level===lv0+1&&s.units.find(u=>u.id==='boss').hp<=0&&s.duel.fall==='down'&&!(await p.locator('[data-do="duel-pick"]').count()));
 text=await p.locator('#duel-scene').innerText();check(`${label} the window names both fighters (VS) and the stage`,['에릭','가르','일기토','불타는 잿빛 마을'].every(k=>text.includes(k)));
 await p.screenshot({path:`${shots}/duel-scene-vs-${label}.png`});await p.waitForTimeout(3000);await p.screenshot({path:`${shots}/duel-scene-clash-${label}.png`});
 await p.locator('#duel-scene .ds-level').waitFor({state:'visible',timeout:9000}).catch(()=>{});check(`${label} the window ends on LEVEL UP (LV ${lv0} → ${lv0+1})`,(await p.locator('#duel-scene .ds-level').isVisible().catch(()=>false))&&(await p.locator('#duel-scene .ds-level').innerText()).includes(`LV ${lv0} → ${lv0+1}`));
 await p.screenshot({path:`${shots}/duel-scene-level-${label}.png`});await drainStory(p);s=await snap();check(`${label} the window closes and the battle goes on; the pair's event is spent`,!(await p.locator('#duel-scene').count())&&s.screen==='battle'&&(s.duelEvents||[]).includes('duel:1:garr'));
 // 4. Sortie board on the deployment screen: six in the legion (Bram hired), five may go
 await restore(sortieSave);s=await snap();check(`${label} the M02 deployment holds six (Bram hired), five sent`,s.screen==='deployment'&&s.units.filter(u=>u.team==='ally').length===6&&s.units.filter(u=>u.team==='ally'&&!u.benched).length===5);
 await press('sortie-board');check(`${label} 출전 장수 lists all six`,await p.locator('[data-do="sortie-toggle"]').count()===6);await p.screenshot({path:`${shots}/sortie-board-${label}.png`});
 const benched=s.units.find(u=>u.team==='ally'&&u.benched).id,out=s.units.find(u=>u.team==='ally'&&!u.benched&&u.id!=='eric').id;
 await press('sortie-toggle',out);await press('sortie-toggle',benched);s=await snap();check(`${label} swapping who goes keeps five out`,s.units.filter(u=>u.team==='ally'&&!u.benched).length===5&&!s.units.find(u=>u.id===benched).benched&&s.units.find(u=>u.id===out).benched);
 await press('sortie-toggle','eric');s=await snap();check(`${label} Erik always goes`,!s.units.find(u=>u.id==='eric').benched);
 await ctx.close();}
 check('no runtime errors',errors.length===0);
}finally{fs.mkdirSync('test-output',{recursive:true});fs.writeFileSync('test-output/v210-e2e.json',JSON.stringify({checks,errors},null,2));await browser.close();}
console.log(`${checks.length} v2.1.0 browser checks PASS`);
