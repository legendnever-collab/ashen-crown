// v0.10.0 in the browser: a real v0.9.3 save (the lower city after M22, ACT III complete) → the ACT IV card and the alliance
// camp → M23 (three council tents, the three leaders as allied units; tap a leader for 「따르라 · 지켜라 · 자유」) → who leads the
// final campaign (two ways) → M24 at the last border (the ash tide, eight refugees, the gate winch: 「관문 닫기」 once six are
// inside) → the gate shut, the scene of whoever was left outside → Ines's and Thea's ④ in the unit menu. 1440×900 and 390×844
// touch. Screenshots: docs/v0.10.0/screenshots/act4a.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory,enterWarCouncil} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {startBattle,beginEnemyPhase,advanceEnemy,nextMission} from '../src/core/game.js';
import {enterHub} from '../src/core/frontier.js';import {chooseLead23} from '../src/core/mission-rules-v0100.js';import {drain} from './campaign-policy.mjs';
const url=pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.10.0.html').href,shots='docs/v0.10.0/screenshots/act4a';fs.mkdirSync(shots,{recursive:true});fs.mkdirSync('test-output',{recursive:true});
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});let n=0;const results=[];const check=(name,ok)=>{assert.ok(ok,name);n++;results.push(name);console.log('PASS',name);};
const camp22=JSON.parse(fs.readFileSync('tests/fixtures/v093/v093-m22-camp.json','utf8')).save;
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
function ready(){const s=deserialize(camp22);for(const h of s.campaign.heroes){h.hp=h.maxHP;h.mp=h.maxMP;h.xp=0;}return deserialize(serialize(s));}
function m23Won(){const s=nextMission(ready());s.screen='deployment';startBattle(s);drain(s);for(const u of s.units.filter(u=>u.team==='enemy'))u.hp=0;s.missionState.captain=true;enemyPhase(s);enterHub(s,{aftermath:true});drain(s);return s;}
function m24(){const s=m23Won();chooseLead23(s,'legion');const t=nextMission(s);t.screen='deployment';startBattle(t);drain(t);return t;}
// M24 with six refugees in, two still outside, Erik beside the winch; Ines and Thea awakened for the ④ check.
function m24Six(){const s=m24(),st=s.missionState;for(const u of s.units.filter(u=>u.team==='enemy'))u.hp=0;for(const id of ['p1','p2','p3','p4','p5','p6']){const r=s.units.find(u=>u.id===id);r.rescued=true;st.inside.push(id);}
 s.units.find(u=>u.id==='lever').locked=false;const e=s.units.find(u=>u.id==='eric');e.x=11;e.y=10;e.moved=e.acted=false;
 for(const id of ['ines','thea']){const h=s.units.find(u=>u.id===id);if(h){h.classTier=3;h.mp=h.maxMP;}}
 s.units.filter(u=>u.team==='ally'&&!['eric'].includes(u.id)&&!u.benched).forEach((u,i)=>{u.x=3+i;u.y=12;});return deserialize(serialize(s));}
try{
 for(const [label,viewport,touch] of [['1440',{width:1440,height:900},false],['390',{width:390,height:844},true]]){
  const ctx=await b.newContext({viewport,hasTouch:touch,isMobile:touch,deviceScaleFactor:touch?2:1});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const press=async(a,id)=>{const el=p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first();touch?await el.tap():await el.click();await p.waitForTimeout(250);};
  const restore=async s=>{await drainStory(p);if(await p.locator('#modal-root .modal').count())await press('close-modal');await press('menu');{const bk=p.locator('#modal-root [data-do="backup"]').first();touch?await bk.tap():await bk.click();await p.waitForTimeout(250);}await p.fill('#backup-text',typeof s==='string'?s:serialize(s));await press('restore');await p.waitForTimeout(400);};
  const snap=()=>p.evaluate(()=>AshenCrown.snapshot());const body=async()=>(await p.locator('body').textContent())||'';const modal=async()=>(await p.locator('#modal-root').textContent())||'';
  const closeModals=async()=>{for(let i=0;i<4&&await p.locator('#modal-root .modal').count();i++){await press('close-modal');await drainStory(p);}};
  const tile=async(x,y)=>{await p.waitForTimeout(250);if(touch&&await p.locator('[data-do="reset-camera"]').isVisible()){const off=await p.evaluate(([x,y])=>{const c=window.AshenCrown.tileCenter(x,y),r=document.querySelector('#battle-map').getBoundingClientRect();return c.x<0||c.y<0||c.x>r.width||c.y>r.height;},[x,y]);if(off){await p.locator('[data-do="reset-camera"]').first().tap();await p.waitForTimeout(300);}}const pt=await p.evaluate(([x,y])=>{const c=window.AshenCrown.tileCenter(x,y),r=document.querySelector('#battle-map').getBoundingClientRect();return {x:c.x+r.x,y:c.y+r.y};},[x,y]);touch?await p.touchscreen.tap(pt.x,pt.y):await p.mouse.click(pt.x,pt.y);await p.waitForTimeout(250);};
  const select=async u=>{await p.waitForFunction(()=>!AshenCrown.view().busy,{},{timeout:30000});if(await p.locator('[data-do="close-unit-menu"]').count())await press('close-unit-menu');await tile(u.x,u.y);if((await p.evaluate(()=>AshenCrown.view().selected))!==u.id)await tile(u.x,u.y);if(!await p.locator('[data-do="submenu"][data-id="skills"]').count())await press('open-unit-menu');};
  await p.goto(url);await press('new');await drainStory(p);
  // 1. the real v0.9.3 lower city offers Mission 23; the ACT IV card; the alliance camp
  await restore(camp22);await drainStory(p);await closeModals();let s=await snap();
  check(`${label} the v0.9.3 lower city (ACT III complete) offers Mission 23`,s.schema===16&&s.frontier.hub==='capital'&&(await p.locator('[data-do="next-mission"]').first().textContent()).includes('Mission 23'));
  await press('next-mission');await p.waitForTimeout(400);let cardSeen=false;for(let i=0;i<40;i++){const t=await body();if(t.includes('ACT IV · 잿빛 왕관')){cardSeen=true;await p.screenshot({path:`${shots}/act4-card-${label}.png`});break;}if(!(await snap()).narrative.active)break;await p.keyboard.press('Enter').catch(()=>{});await p.waitForTimeout(150);}
  await drainStory(p);await closeModals();s=await snap();
  check(`${label} ACT IV opens with its world card and the alliance camp`,(cardSeen||s.narrative.seen.includes('world:alliance'))&&s.frontier.hub==='summit'&&s.missionId===23);
  await p.screenshot({path:`${shots}/alliance-camp-${label}.png`});
  await enterWarCouncil(p,touch);await press('deploy');await p.waitForTimeout(300);await press('start-battle');await drainStory(p);s=await snap();
  // 2. M23: three tents, three leaders as allied units; allied orders
  check(`${label} M23 battle: seven heroes, three council tents, the three leaders beside the legion`,s.screen==='battle'&&s.units.filter(u=>u.team==='ally'&&!u.benched).length===7&&s.units.filter(u=>u.kind==='tent').length===3&&['cassian','leonora','lucien'].every(id=>s.units.find(u=>u.id===id)?.team==='allied'));
  check(`${label} the objective panel counts the tents and the leaders`,(await body()).includes('천막 3/3')&&(await body()).includes('지도자 3/3'));
  await press('reset-camera');await p.waitForTimeout(300);await p.screenshot({path:`${shots}/m23-camp-${label}.png`});
  const cas=s.units.find(u=>u.id==='cassian');await tile(cas.x,cas.y);await p.waitForTimeout(300);let t=await modal();
  check(`${label} tapping a leader opens the allied orders (따르라 · 지켜라 · 자유)`,t.includes('동맹군 지시')&&t.includes('따르라')&&t.includes('지켜라')&&t.includes('자유')&&await p.locator('[data-do="ally-order"]').count()===3);
  await p.screenshot({path:`${shots}/ally-orders-${label}.png`});await press('ally-order','cassian|follow');await p.waitForTimeout(300);s=await snap();
  check(`${label} the order is kept on the unit (따르라)`,s.units.find(u=>u.id==='cassian').order==='follow'&&!(await p.locator('#modal-root .modal').count()));
  // 3. M23 won: who leads the final campaign
  await restore(m23Won());await drainStory(p);for(let i=0;i<3&&!(await p.locator('[data-do="lead23-pick"]').count());i++){await closeModals();await press('next-mission');await p.waitForTimeout(300);}
  check(`${label} after M23 the camp asks who leads the final campaign (two ways)`,await p.locator('[data-do="lead23-pick"]').count()===2);
  await p.screenshot({path:`${shots}/lead23-choice-${label}.png`});await press('lead23-pick','banners');await drainStory(p);await p.waitForTimeout(300);s=await snap();
  check(`${label} the choice is kept and its scene plays; Mission 24 is next`,s.campaign.choices.m23_lead==='banners'&&s.narrative.seen.includes('after:23:banners')&&(await p.locator('[data-do="next-mission"]').first().textContent()).includes('Mission 24'));
  // 4. M24: the ash tide, the refugees, the gate
  const s24=m24();await restore(s24);await drainStory(p);s=await snap();
  check(`${label} M24: eight refugees outside, the wall with its two-tile gate, the winch locked`,s.missionId===24&&s.units.filter(u=>u.refugee).length===8&&s.units.find(u=>u.id==='lever').locked&&(await body()).includes('관문 안 0/8'));
  await press('reset-camera');await p.waitForTimeout(300);await p.screenshot({path:`${shots}/m24-border-${label}.png`});
  const ash=deserialize(serialize(s));ash.missionState.ash=4;ash.turn=5;for(const id of ['p1','p2']){const r=ash.units.find(u=>u.id===id);r.y=Math.max(r.y,5);}await restore(ash);await drainStory(p);await press('reset-camera');await p.waitForTimeout(300);
  await p.screenshot({path:`${shots}/m24-ash-${label}.png`});check(`${label} the ash tide is drawn over the northern rows (status: 재 4줄)`,(await body()).includes('재 4줄'));
  const six=m24Six();await restore(six);await drainStory(p);const e=six.units.find(u=>u.id==='eric');await select(e);
  check(`${label} beside the winch, with six inside, Erik may close the gate (관문 닫기)`,(await p.locator('#unit-popover').textContent()).includes('관문 닫기'));
  await press('mode','search');await tile(11,9);if(await p.locator('[data-do="confirm"]').count())await press('confirm');await p.waitForTimeout(800);await drainStory(p);s=await snap();
  check(`${label} the gate shuts: victory, the turn and those left outside are kept`,s.outcome==='victory'&&s.missionState.closedTurn===s.turn&&s.campaign.flags.mission_24_left===2);
  await p.screenshot({path:`${shots}/m24-closed-${label}.png`});
  check(`${label} closing with people outside plays its scene`,s.narrative.seen.includes('24:closed:left')||s.narrative.events.includes('24:closed:left'));
  // 5. Ines's and Thea's ④ in the unit menu (from a fresh page: the result screen is up)
  await p.reload();await p.waitForFunction(()=>!!window.AshenCrown);if(await p.locator('[data-do="new"]').count())await press('new');await drainStory(p);
  const u4=m24Six();u4.units.find(u=>u.id==='lever').locked=true;const ines=u4.units.find(u=>u.id==='ines'&&!u.benched)||u4.units.find(u=>u.id==='thea'&&!u.benched);if(ines){ines.moved=ines.acted=false;await restore(u4);await drainStory(p);await select(ines);await press('submenu','skills');const menu=await p.locator('#unit-popover').textContent();
   check(`${label} an awakened recruit shows ④ (${ines.id==='ines'?'성역의 문':'철의 돌파'})`,menu.includes('④')&&menu.includes(ines.id==='ines'?'성역의 문':'철의 돌파'));await p.screenshot({path:`${shots}/ultimate-${ines.id}-${label}.png`});}
  check(`${label} no page errors`,errors.length===0);
  await ctx.close();}
 fs.writeFileSync('test-output/act4a-e2e.json',JSON.stringify({suite:'act4a-e2e',passed:n,results},null,1));console.log(`act4a-e2e: ${n} checks passed`);
}finally{await b.close();}
