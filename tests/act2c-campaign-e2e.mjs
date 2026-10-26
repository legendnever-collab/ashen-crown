// v0.7.0 in the browser: M10 camp → world card (the Sacred Flame) → the pilgrim village (Ines) → M11 night battle with
// pilgrims, braziers and allies → M11 camp (Lucien's offer) → M12 battle with watching guards → M12 camp (the records,
// Ines joining card, the refugee camp). 1440×900 and 390×844 touch. Screenshots: docs/v0.7.0/screenshots/act2c-campaign.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory,enterWarCouncil} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize} from '../src/persistence/save-manager.js';import {actOneCamp} from './skirmish-policy.mjs';
import {newGame,startBattle,checkOutcome} from '../src/core/game.js';import {enterHub} from '../src/core/frontier.js';import {findUnit} from '../src/core/rules.js';import {drain} from './campaign-policy.mjs';
const url=pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.7.1.html').href,shots='docs/v0.7.0/screenshots/act2c-campaign';fs.mkdirSync(shots,{recursive:true});fs.mkdirSync('test-output',{recursive:true});
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});let n=0;const check=(name,ok)=>{assert.ok(ok,name);n++;console.log('PASS',name);};
const actTwo=(missionId,extra={})=>{const camp=actOneCamp(20261021,9);const c=structuredClone(camp.campaign);c.completed=[1,2,3,4,5,6,7,8,9,...(missionId>10?[10]:[]),...(missionId>11?[11]:[])];
 Object.assign(c.choices,{m04_records_choice:'kept',m07_deserters:'legion',m08_order:'hold',m10_stance:'mediate'},extra.choices||{});c.factionTrust={iron:2,free:2,flame:extra.flame??0};c.trustLog=[];c.roster=extra.roster||['thea','dario'];
 Object.assign(c.flags,{act2_free_met:true,mission_10_mediated:true,act2_flame_met:missionId>11},extra.flags||{});const s=newGame(20261027,c,missionId);s.economy=structuredClone(camp.economy);return s;};
function m10Camp(){const s=actTwo(10);s.outcome='victory';s.campaign.completed.push(10);enterHub(s,{aftermath:true,story:false});drain(s);s.screen='exploration';return s;}
function m11Won(){const s=actTwo(11);s.screen='deployment';startBattle(s);drain(s);for(const id of ['p1','p2','p3','p4'])findUnit(s,id).rescued=true;checkOutcome(s);drain(s);return s;}
function m12Won(){const s=actTwo(12,{flame:1,choices:{m11_oath:'oath'}});s.screen='deployment';startBattle(s);drain(s);const led=findUnit(s,'rec_ledger');led.rescued=true;led.searchedBy='kai';s.missionState.quiet=true;
 const boss=findUnit(s,'boss');boss.rescued=true;boss.captured=true;s.missionState.captured=true;checkOutcome(s);drain(s);return s;}
try{
 for(const [label,viewport,touch] of [['1440',{width:1440,height:900},false],['390',{width:390,height:844},true]]){
  const ctx=await b.newContext({viewport,hasTouch:touch,isMobile:touch,deviceScaleFactor:touch?2:1});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const press=async(a,id)=>{const el=p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first();touch?await el.tap():await el.click();await p.waitForTimeout(250);};
  const restore=async s=>{await drainStory(p);await press('menu');await press('backup');await p.fill('#backup-text',serialize(s));await press('restore');await p.waitForTimeout(300);};
  const snap=()=>p.evaluate(()=>AshenCrown.snapshot());
  await p.goto(url);await press('new');await drainStory(p);
  // M10 camp → Mission 11 → the third banner's card → the pilgrim village
  await restore(m10Camp());await drainStory(p);for(let i=0;i<3&&await p.locator('#modal-root .modal').count();i++){await press('close-modal');await drainStory(p);}
  check(`${label} M10 camp offers Mission 11 toward the pilgrim village`,(await p.locator('[data-do="next-mission"]').first().textContent()).includes('Mission 11'));
  await press('next-mission');let card='';for(let i=0;i<6&&!card.includes('순례자');i++){card=await p.locator('.world-card').textContent().catch(()=>'');if(!card.includes('순례자')&&await p.locator('[data-do="story-next"]').count())await press('story-next');}
  check(`${label} the world card names the Sacred Flame's land and the pilgrim village`,card.includes('성화령')&&card.includes('순례자 마을'));await p.waitForTimeout(1700);await p.screenshot({path:`${shots}/world-pilgrim-${label}.png`});
  await drainStory(p);let s=await snap();
  check(`${label} pilgrim village hub for M11 with Ines, Thea and Dario`,s.missionId===11&&s.frontier.hub==='pilgrim'&&s.screen==='exploration'&&s.narrative.seen.includes('pre:11'));await p.screenshot({path:`${shots}/pilgrim-m11-${label}.png`});
  await enterWarCouncil(p,touch);await press('deploy');await press('start-battle');await drainStory(p);s=await snap();
  check(`${label} M11 battle: four pilgrims on the road, three dark braziers, Ines and two flame knights`,s.screen==='battle'&&s.units.filter(u=>u.team==='civilian').length===4&&s.units.filter(u=>u.kind==='brazier'&&!u.lit).length===3&&s.units.filter(u=>u.team==='allied').length===3);
  check(`${label} M11 status shows the sanctuary goal and braziers`,(await p.locator('body').textContent()).includes('화로 0/3'));
  await p.waitForTimeout(600);await p.screenshot({path:`${shots}/m11-battle-${label}.png`});
  // M11 camp: Lucien's offer
  await restore(m11Won());await drainStory(p);if(await p.locator('[data-do="aftermath"]').count()){await press('aftermath');await drainStory(p);}
  for(let i=0;i<4&&!await p.locator('[data-do="oath11-pick"]').count();i++){if(await p.locator('[data-do="oath11-choice"]').count())await press('oath11-choice');await drainStory(p);}
  check(`${label} M11 camp offers Lucien's choice (two options)`,await p.locator('[data-do="oath11-pick"]').count()===2);await p.screenshot({path:`${shots}/m11-oath-${label}.png`});
  await press('oath11-pick','oath');await drainStory(p);s=await snap();check(`${label} the oath raises the Order's trust and plays its scene`,s.campaign.choices.m11_oath==='oath'&&s.campaign.factionTrust.flame>=1&&s.narrative.seen.includes('after:11:oath')&&s.narrative.seen.includes('after:11:sain'));
  // M12 battle
  const m12=actTwo(12,{flame:1,choices:{m11_oath:'oath'}});enterHub(m12,{story:false});await restore(m12);await drainStory(p);
  await enterWarCouncil(p,touch);await press('deploy');await press('start-battle');await drainStory(p);s=await snap();
  check(`${label} M12 battle: seven quiet guards, the abbot, three records; the monastery is quiet`,s.screen==='battle'&&s.units.filter(u=>u.watch).length===7&&s.units.filter(u=>u.kind==='evidence').length===3&&s.missionState.alert===0&&(await p.locator('body').textContent()).includes('조용'));
  await p.waitForTimeout(600);await p.screenshot({path:`${shots}/m12-battle-${label}.png`});
  // M12 camp: the records, Ines joins, the refugee camp
  await restore(m12Won());await drainStory(p);if(await p.locator('[data-do="aftermath"]').count()){await press('aftermath');await drainStory(p);}
  for(let i=0;i<4&&!await p.locator('[data-do="records12-pick"]').count();i++){if(await p.locator('[data-do="records12-choice"]').count())await press('records12-choice');await drainStory(p);}
  check(`${label} M12 camp offers the records choice; copying is closed without Lia and Kai`,await p.locator('[data-do="records12-pick"]').count()===3&&await p.locator('[data-do="records12-pick"][data-id="copy"][disabled]').count()===1);await p.screenshot({path:`${shots}/m12-records-${label}.png`});
  await press('records12-pick','return');await drainStory(p);s=await snap();
  check(`${label} returning the records: the Order trusts the legion, Ines joins`,s.frontier.hub==='refuge'&&s.campaign.choices.m12_records==='return'&&s.campaign.roster.includes('ines')&&s.frontier.members.includes('ines'));
  for(let i=0;i<3&&!await p.locator('.promo-card').count();i++){await drainStory(p);await p.waitForTimeout(300);}
  check(`${label} Ines's joining card`,(await p.locator('.promo-card').textContent().catch(()=>'')).includes('이네스'));await p.screenshot({path:`${shots}/ines-joins-${label}.png`});await press('close-modal');
  check(`${label} the camp says M13 comes in the next update`,(await p.locator('#screen').textContent()).includes('M13'));
  check(`${label} no runtime errors`,errors.length===0);if(errors.length)console.log(errors);await ctx.close();
 }
 fs.writeFileSync('test-output/act2c-campaign-e2e.json',JSON.stringify({checks:n},null,1));console.log(`act2c-campaign-e2e: ${n} checks passed`);
}finally{await b.close();}
