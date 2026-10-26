// v0.6.1 in the browser: M08 camp → world card (Free Lords) → Velmar (Dario at the tavern) → M09 battle with three
// delegates and allies; M09 camp ledger scene; M10 deployment stance → battle with two armies; M10 camp with Dario
// joining (card). 1440×900 and 390×844 touch. Screenshots: docs/v0.6.1/screenshots/act2b-campaign.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory,enterWarCouncil} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize} from '../src/persistence/save-manager.js';import {actOneCamp} from './skirmish-policy.mjs';
import {newGame,startBattle,checkOutcome} from '../src/core/game.js';import {enterHub} from '../src/core/frontier.js';import {findUnit} from '../src/core/rules.js';import {rulesOf} from '../src/core/mission-rules.js';import {chooseStance} from '../src/core/mission-rules-v061.js';import {drain} from './campaign-policy.mjs';
const url=pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.7.0.html').href,shots='docs/v0.6.1/screenshots/act2b-campaign';fs.mkdirSync(shots,{recursive:true});fs.mkdirSync('test-output',{recursive:true});
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});let n=0;const check=(name,ok)=>{assert.ok(ok,name);n++;console.log('PASS',name);};
const actTwo=(missionId,extra={})=>{const camp=actOneCamp(20261021,9);const c=structuredClone(camp.campaign);c.completed=[1,2,3,4,5,6,7,8,...(missionId>9?[9]:[])];Object.assign(c.choices,{m04_records_choice:'kept',m07_deserters:'legion',m08_order:'hold'},extra.choices||{});
 c.factionTrust={iron:2,free:0,flame:0};c.trustLog=[];c.roster=extra.roster||[];Object.assign(c.flags,{act2_free_met:missionId>9},extra.flags||{});const s=newGame(20261026,c,missionId);s.economy=structuredClone(camp.economy);return s;};
function m8Camp(){const s=actTwo(8);s.campaign.completed=[1,2,3,4,5,6,7];s.outcome='victory';s.campaign.completed.push(8);enterHub(s,{aftermath:true,story:false});drain(s);s.screen='exploration';return s;}
function m9Won(){const s=actTwo(9);s.screen='deployment';startBattle(s);drain(s);s.turn=5;rulesOf(s).onTurnStart(s);drain(s);const boss=findUnit(s,'boss');boss.rescued=true;boss.captured=true;s.missionState.captured=true;s.campaign.flags.mission_09_assassin_captured=true;checkOutcome(s);drain(s);return s;}
function m10Won(){const s=actTwo(10);s.screen='deployment';chooseStance(s,'mediate');startBattle(s);drain(s);for(const id of ['boss','boss2']){const t=findUnit(s,id);t.rescued=true;t.captured=true;s.missionState.captured.push(id);}s.truce=true;checkOutcome(s);drain(s);return s;}
try{
 for(const [label,viewport,touch] of [['1440',{width:1440,height:900},false],['390',{width:390,height:844},true]]){
  const ctx=await b.newContext({viewport,hasTouch:touch,isMobile:touch,deviceScaleFactor:touch?2:1});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const press=async(a,id)=>{const el=p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first();touch?await el.tap():await el.click();await p.waitForTimeout(250);};
  const restore=async s=>{await drainStory(p);await press('menu');await press('backup');await p.fill('#backup-text',serialize(s));await press('restore');await p.waitForTimeout(300);};
  const snap=()=>p.evaluate(()=>AshenCrown.snapshot());
  await p.goto(url);await press('new');await drainStory(p);
  // M08 camp → next mission → Free Lords card → Velmar
  await restore(m8Camp());await drainStory(p);
  check(`${label} M08 camp offers Mission 9 toward Velmar`,(await p.locator('[data-do="next-mission"]').textContent()).includes('Mission 9'));
  await press('next-mission');let card='';for(let i=0;i<6&&!card.includes('자유도시');i++){card=await p.locator('.world-card').textContent().catch(()=>'');if(!card.includes('자유도시')&&await p.locator('[data-do="story-next"]').count())await press('story-next');}
  check(`${label} the world card names the Free Lords and Velmar`,card.includes('자유도시 연맹')&&card.includes('벨마르'));await p.waitForTimeout(1700);await p.screenshot({path:`${shots}/world-velmar-${label}.png`});
  await drainStory(p);let s=await snap();
  check(`${label} Velmar hub for M09 with Dario at the tavern side`,s.missionId===9&&s.frontier.hub==='velmar'&&s.screen==='exploration');await p.screenshot({path:`${shots}/velmar-m09-${label}.png`});
  await enterWarCouncil(p,touch);await press('deploy');await press('start-battle');await drainStory(p);s=await snap();
  check(`${label} M09 battle: three delegates, Dario and two harbour guards as allies`,s.screen==='battle'&&s.units.filter(u=>u.team==='civilian').length===3&&s.units.filter(u=>u.team==='allied').length===3);
  await p.waitForTimeout(600);await p.screenshot({path:`${shots}/m09-battle-${label}.png`});
  // M09 camp: the ledger cord
  await restore(m9Won());await drainStory(p);if(await p.locator('[data-do="aftermath"]').count()){await press('aftermath');await drainStory(p);}
  s=await snap();check(`${label} M09 camp after the capture plays the ledger-cord scene`,s.frontier.phase==='aftermath'&&s.narrative.seen.includes('after:9:captured'));
  // M10 deployment: the stance
  const m10=actTwo(10);enterHub(m10,{story:false});await restore(m10);await drainStory(p);
  await enterWarCouncil(p,touch);await press('deploy');await drainStory(p);if(!await p.locator('[data-do="stance-pick"]').count()){await press('start-battle');await drainStory(p);}
  check(`${label} M10: the two lords' choice is shown before battle`,await p.locator('[data-do="stance-pick"]').count()===3);await p.screenshot({path:`${shots}/m10-stance-${label}.png`});
  await press('stance-pick','a');await drainStory(p);await press('start-battle');await drainStory(p);s=await snap();
  check(`${label} M10 battle supporting Oswin: the blue-white army fights beside the legion`,s.screen==='battle'&&s.campaign.choices.m10_stance==='a'&&s.units.filter(u=>u.faction==='a').every(u=>u.team==='allied')&&s.units.some(u=>u.faction==='b'&&u.team==='enemy'));
  await p.waitForTimeout(600);await p.screenshot({path:`${shots}/m10-battle-${label}.png`});
  // M10 camp: Dario joins
  await restore(m10Won());await drainStory(p);if(await p.locator('[data-do="aftermath"]').count()){await press('aftermath');await drainStory(p);}
  s=await snap();check(`${label} Velmar after M10 with Dario in the legion`,s.frontier.hub==='velmar'&&s.campaign.roster.includes('dario')&&s.frontier.members.includes('dario'));
  check(`${label} Dario's joining card`,(await p.locator('.promo-card').textContent().catch(()=>'')).includes('다리오'));await p.screenshot({path:`${shots}/dario-joins-${label}.png`});await press('close-modal');
  check(`${label} the camp says ACT II's first half is complete`,(await p.locator('#screen').textContent()).includes('M11'));
  check(`${label} no runtime errors`,errors.length===0);if(errors.length)console.log(errors);await ctx.close();
 }
 fs.writeFileSync('test-output/act2b-campaign-e2e.json',JSON.stringify({checks:n},null,1));console.log(`act2b-campaign-e2e: ${n} checks passed`);
}finally{await b.close();}
