// v0.7.1 in the browser: a real v0.7.0 save (refugee camp after M12) → Mission 13 (Baldrick's resolve, the 설득 action
// chosen from the battle menu and the map) → the summit camp (world card) → M14 with three leaders → the summit won →
// a recruit's scene and the ACT II completion card; the 생포 button now appears outside M02 (M10 mediation).
// 1440×900 and 390×844 touch. Screenshots: docs/v0.7.1/screenshots/act2d-campaign.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory,enterWarCouncil} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {newGame,startBattle,beginEnemyPhase,advanceEnemy} from '../src/core/game.js';import {findUnit} from '../src/core/rules.js';import {chooseStance} from '../src/core/mission-rules-v061.js';import {drain} from './campaign-policy.mjs';
const url=pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.7.1.html').href,shots='docs/v0.7.1/screenshots/act2d-campaign';fs.mkdirSync(shots,{recursive:true});fs.mkdirSync('test-output',{recursive:true});
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});let n=0;const check=(name,ok)=>{assert.ok(ok,name);n++;console.log('PASS',name);};
const camp12=JSON.parse(fs.readFileSync('tests/fixtures/v070/v070-m12-camp.json','utf8')).save,base=deserialize(camp12);
const at=(m,extra={})=>{const c=structuredClone(base.campaign);for(let i=13;i<m;i++)c.completed.push(i);Object.assign(c.flags,extra.flags||{});if(extra.trust)c.factionTrust=extra.trust;const s=newGame(20261027,c,m);s.economy=structuredClone(base.economy);return s;};
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
function m13Persuade(){const s=at(13);s.screen='deployment';startBattle(s);drain(s);const boss=findUnit(s,'boss'),eric=findUnit(s,'eric');eric.x=boss.x;eric.y=boss.y+1;s.missionState.resolve=5;return s;}
function m14Won(){const s=at(14,{flags:{mission_13_baldrick:'halted'},trust:{iron:1,free:2,flame:2}});s.screen='deployment';startBattle(s);drain(s);for(let i=0;i<14&&!s.outcome;i++){for(const e of s.units.filter(u=>u.team==='enemy'))e.hp=0;enemyPhase(s);}return s;}
function m10Capture(){const c=structuredClone(base.campaign);c.completed=c.completed.filter(i=>i<10);delete c.choices.m10_stance;const s=newGame(20261027,c,10);s.economy=structuredClone(base.economy);s.screen='deployment';chooseStance(s,'mediate');startBattle(s);drain(s);const lord=findUnit(s,'boss'),eric=findUnit(s,'eric');lord.hp=Math.floor(lord.maxHP/2);eric.x=lord.x;eric.y=lord.y+1;if(s.units.some(u=>u!==eric&&u.hp>0&&u.x===eric.x&&u.y===eric.y))eric.y=lord.y-1;return s;}
try{
 for(const [label,viewport,touch] of [['1440',{width:1440,height:900},false],['390',{width:390,height:844},true]]){
  const ctx=await b.newContext({viewport,hasTouch:touch,isMobile:touch,deviceScaleFactor:touch?2:1});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const press=async(a,id)=>{const el=p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first();touch?await el.tap():await el.click();await p.waitForTimeout(250);};
  const restore=async s=>{await drainStory(p);await press('menu');await press('backup');await p.fill('#backup-text',typeof s==='string'?s:serialize(s));await press('restore');await p.waitForTimeout(400);};
  const snap=()=>p.evaluate(()=>AshenCrown.snapshot());
  const tile=async(x,y)=>{await p.waitForTimeout(250);const pt=await p.evaluate(([x,y])=>{const c=window.AshenCrown.tileCenter(x,y),r=document.querySelector('#battle-map').getBoundingClientRect();return {x:c.x+r.x,y:c.y+r.y};},[x,y]);touch?await p.touchscreen.tap(pt.x,pt.y):await p.mouse.click(pt.x,pt.y);};
  await p.goto(url);await press('new');await drainStory(p);
  // a real v0.7.0 save → Mission 13
  await restore(camp12);await drainStory(p);for(let i=0;i<3&&await p.locator('#modal-root .modal').count();i++){await press('close-modal');await drainStory(p);}
  check(`${label} the v0.7.0 refugee camp offers Mission 13`,(await p.locator('[data-do="next-mission"]').first().textContent()).includes('Mission 13'));
  await press('next-mission');await drainStory(p);let s=await snap();
  check(`${label} M13 preparation at the refugee camp with Cassian's order read out`,s.missionId===13&&s.frontier.hub==='refuge'&&s.narrative.seen.includes('pre:13'));await p.screenshot({path:`${shots}/refuge-m13-${label}.png`});
  await enterWarCouncil(p,touch);await press('deploy');await press('start-battle');await drainStory(p);s=await snap();
  check(`${label} M13 battle: Baldrick, three lion bearers, four refugees; resolve shown from the saved choices`,s.screen==='battle'&&['f1','f2','f3','boss'].every(id=>s.units.some(u=>u.id===id))&&s.units.filter(u=>u.team==='civilian').length===4&&(await p.locator('body').textContent()).includes(`결단 ${s.missionState.resolve}/6`));
  await p.waitForTimeout(500);await p.screenshot({path:`${shots}/m13-battle-${label}.png`});
  // persuade from the battle menu
  const m13=m13Persuade();await restore(m13);await drainStory(p);await press('open-unit-menu');
  check(`${label} Erik beside Baldrick: the battle menu offers 설득`,await p.locator('[data-do="mode"][data-id="persuade"]').count()===1);await p.screenshot({path:`${shots}/m13-persuade-menu-${label}.png`});
  await press('mode','persuade');const boss=m13.units.find(u=>u.id==='boss');await tile(boss.x,boss.y);await p.waitForTimeout(300);
  check(`${label} the forecast shows resolve +1`,(await p.locator('#unit-popover').textContent()).includes('결단 +1'));await press('confirm');await drainStory(p);s=await snap();
  check(`${label} resolve reaches 6: Baldrick halts his army and the battle is won`,s.missionState.halted&&s.outcome==='victory');
  if(await p.locator('[data-do="aftermath"]').count()){await press('aftermath');}let card='';for(let i=0;i<8&&!card.includes('폐허 역참');i++){card=await p.locator('.world-card').textContent().catch(()=>'');if(!card.includes('폐허 역참')&&await p.locator('[data-do="story-next"]').count())await press('story-next');}
  check(`${label} the world card leads to the ruined waystation`,card.includes('폐허 역참'));await drainStory(p);s=await snap();
  check(`${label} the summit camp after M13 with Baldrick's parting scene (halted)`,s.frontier.hub==='summit'&&s.narrative.seen.includes('after:13:halted')&&s.campaign.factionTrust.iron===base.campaign.factionTrust.iron-1);await p.screenshot({path:`${shots}/summit-${label}.png`});
  // M14
  await press('next-mission');await drainStory(p);await enterWarCouncil(p,touch);await press('deploy');await press('start-battle');await drainStory(p);s=await snap();
  check(`${label} M14 battle: Cassian, Leonora and Lucien with six guards as allies; masked raiders`,s.screen==='battle'&&['cassian','leonora','lucien'].every(id=>s.units.find(u=>u.id===id)?.team==='allied')&&s.units.filter(u=>u.masked).length>=4);
  await p.waitForTimeout(500);await p.screenshot({path:`${shots}/m14-battle-${label}.png`});
  // the summit won (Iron Crown betrays: lowest trust) → camp → recruit scene → ACT II card
  const won=m14Won();check(`${label} (setup) the summit is won with the Iron Crown turning`,won.outcome==='victory'&&won.missionState.betrayer==='iron');
  await restore(won);await drainStory(p);if(await p.locator('[data-do="aftermath"]').count()){await press('aftermath');}await drainStory(p);s=await snap();
  check(`${label} camp after the summit: Thea's scene follows whether she stayed or left`,s.frontier.phase==='aftermath'&&s.narrative.seen.some(k=>k.startsWith('after:14:recruit:')));
  for(let i=0;i<4&&!await p.locator('.act2-card').count();i++){await drainStory(p);await p.waitForTimeout(300);}
  check(`${label} the ACT II completion card lists the three banners and points to ACT III`,(await p.locator('.act2-card').textContent().catch(()=>'')).includes('세 개의 깃발')&&await p.locator('.act2-relations tr').count()===3&&(await p.locator('.act2-card').textContent()).includes('ACT III'));
  await p.screenshot({path:`${shots}/act2-complete-${label}.png`});await press('close-modal');
  check(`${label} the camp says ACT III comes in the next update`,(await p.locator('body').textContent()).includes('ACT III'));
  // capture button outside M02 (M10 mediation)
  await restore(m10Capture());await drainStory(p);await press('open-unit-menu');
  check(`${label} M10 mediation: a lord at half HP beside Erik can be captured from the menu`,await p.locator('[data-do="mode"][data-id="capture"]').count()===1);await press('close-unit-menu');
  check(`${label} no runtime errors`,errors.length===0);if(errors.length)console.log(errors);await ctx.close();
 }
 fs.writeFileSync('test-output/act2d-campaign-e2e.json',JSON.stringify({checks:n},null,1));console.log(`act2d-campaign-e2e: ${n} checks passed`);
}finally{await b.close();}
