// v0.6 Phase D in the browser: M06 camp → ACT II card → castle town (Thea) → M07 battle with the convoy and escort;
// M07 camp deserter choice; M08 command order on the deployment screen → battle; M08 camp with Thea joining (card).
// 1440×900 and 390×844 touch. Screenshots: docs/v0.6.0/screenshots/act2-campaign.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory,enterWarCouncil} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize} from '../src/persistence/save-manager.js';import {actOneCamp} from './skirmish-policy.mjs';
import {newGame,startBattle,checkOutcome} from '../src/core/game.js';import {enterHub} from '../src/core/frontier.js';import {findUnit} from '../src/core/rules.js';import {chooseOrder} from '../src/core/mission-rules-v06.js';import {drain} from './campaign-policy.mjs';
const url=pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.6.1.html').href,shots='docs/v0.6.0/screenshots/act2-campaign';fs.mkdirSync(shots,{recursive:true});fs.mkdirSync('test-output',{recursive:true});
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});let n=0;const check=(name,ok)=>{assert.ok(ok,name);n++;console.log('PASS',name);};
const actTwo=(missionId,extra={})=>{const camp=actOneCamp(20261021,8);const c=structuredClone(camp.campaign);c.completed=[1,2,3,4,5,6,...(missionId>7?[7]:[])];Object.assign(c.choices,{m04_records_choice:'kept'},extra.choices||{});c.factionTrust={iron:1,free:0,flame:0};c.trustLog=[];Object.assign(c.flags,extra.flags||{});
 const s=newGame(20261025,c,missionId);s.economy=structuredClone(camp.economy);return s;};
function m7Won(){const s=actTwo(7);s.screen='deployment';startBattle(s);drain(s);const boss=findUnit(s,'boss');boss.rescued=true;boss.captured=true;s.missionState.captured=true;s.campaign.flags.mission_07_deserter_captured=true;for(const id of ['w1','w2'])findUnit(s,id).rescued=true;checkOutcome(s);drain(s);return s;}
function m8Won(){const s=actTwo(8,{choices:{m07_deserters:'legion'}});s.screen='deployment';chooseOrder(s,'hold');startBattle(s);drain(s);s.turn=11;checkOutcome(s);drain(s);return s;}
try{
 for(const [label,viewport,touch] of [['1440',{width:1440,height:900},false],['390',{width:390,height:844},true]]){
  const ctx=await b.newContext({viewport,hasTouch:touch,isMobile:touch,deviceScaleFactor:touch?2:1});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const press=async(a,id)=>{const el=p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first();touch?await el.tap():await el.click();await p.waitForTimeout(250);};
  const restore=async s=>{await drainStory(p);await press('menu');await press('backup');await p.fill('#backup-text',serialize(s));await press('restore');await p.waitForTimeout(300);};
  const snap=()=>p.evaluate(()=>AshenCrown.snapshot());
  await p.goto(url);await press('new');await drainStory(p);
  // M06 camp → next mission → the ACT II world card → castle town
  await restore(actOneCamp(20261021,8));await drainStory(p);
  check(`${label} M06 camp offers the next story (Mission 7)`,(await p.locator('[data-do="next-mission"]').textContent()).includes('Mission 7'));
  await press('next-mission');let card='';for(let i=0;i<6&&!card.includes('ACT II');i++){card=await p.locator('.world-card').textContent().catch(()=>'');if(!card.includes('ACT II')&&await p.locator('[data-do="story-next"]').count())await press('story-next');}
  check(`${label} the ACT II card names the first banner`,card.includes('ACT II')&&card.includes('철관성'));await p.waitForTimeout(1700);await p.screenshot({path:`${shots}/world-act2-${label}.png`});
  await drainStory(p);let s=await snap();
  check(`${label} castle town hub for M07 with Thea at the plaza`,s.missionId===7&&s.frontier.hub==='castletown'&&s.screen==='exploration');await p.screenshot({path:`${shots}/castletown-m07-${label}.png`});
  await enterWarCouncil(p,touch);check(`${label} M07 council shows the six-seat sortie`,(await p.locator('.modal, .screen-inner').first().textContent()).includes('출전'));
  await press('deploy');await press('start-battle');await drainStory(p);s=await snap();
  check(`${label} M07 battle: convoy of three, Thea and two soldiers as allies`,s.screen==='battle'&&s.units.filter(u=>u.kind==='wagon').length===3&&s.units.filter(u=>u.team==='allied').length===3);
  await p.waitForTimeout(600);await p.screenshot({path:`${shots}/m07-battle-${label}.png`});
  // M07 camp: deserter choice
  await restore(m7Won());await drainStory(p);if(await p.locator('[data-do="aftermath"]').count()){await press('aftermath');await drainStory(p);}
  s=await snap();check(`${label} M07 camp after the battle asks what to do with the deserters`,s.frontier.phase==='aftermath'&&await p.locator('[data-do="deserters-choice"]').count()===1);
  await press('deserters-choice');await p.screenshot({path:`${shots}/m07-deserters-choice-${label}.png`});await press('deserters-pick','legion');await drainStory(p);s=await snap();
  check(`${label} taking the deserters along is recorded (no trust change)`,s.campaign.choices.m07_deserters==='legion'&&s.campaign.factionTrust.iron===2);
  // M08 deployment: the command order
  const m8=actTwo(8,{choices:{m07_deserters:'legion'}});enterHub(m8,{story:false});await restore(m8);await drainStory(p);
  await enterWarCouncil(p,touch);await press('deploy');await drainStory(p);if(!await p.locator('[data-do="order-pick"]').count()){await press('start-battle');await drainStory(p);}
  check(`${label} M08: Baldrick's order is shown before battle`,await p.locator('[data-do="order-pick"]').count()===2);await p.screenshot({path:`${shots}/m08-order-${label}.png`});
  await press('order-pick','rescue');await drainStory(p);await press('start-battle');await drainStory(p);s=await snap();
  check(`${label} M08 battle with the rescue squad, Baldrick on the line, rockfall devices`,s.screen==='battle'&&s.campaign.choices.m08_order==='rescue'&&s.units.some(u=>u.id==='baldrick'&&u.team==='allied')&&s.units.filter(u=>u.kind==='rockfall').length===2);
  await p.waitForTimeout(600);await p.screenshot({path:`${shots}/m08-battle-${label}.png`});
  // M08 camp: Thea joins
  await restore(m8Won());await drainStory(p);if(await p.locator('[data-do="aftermath"]').count()){await press('aftermath');await drainStory(p);}
  s=await snap();check(`${label} canyon bivouac after M08 with Thea in the legion`,s.frontier.hub==='march'&&s.campaign.roster.includes('thea')&&s.frontier.members.includes('thea'));
  check(`${label} Thea's joining card`,(await p.locator('.promo-card').textContent().catch(()=>'')).includes('테아'));await p.screenshot({path:`${shots}/thea-joins-${label}.png`});await press('close-modal');
  check(`${label} no runtime errors`,errors.length===0);if(errors.length)console.log(errors);await ctx.close();
 }
 fs.writeFileSync('test-output/act2-campaign-e2e.json',JSON.stringify({checks:n},null,1));console.log(`act2-campaign-e2e: ${n} checks passed`);
}finally{await b.close();}
