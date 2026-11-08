// v0.9.1 in the browser: a real v0.9.0 save (the field camp after M16) → the legion panel (recruits' promotion and Elina's
// awakening) → an awakening won, the awakening card → M17 at the guardians' keep (「나아가라」 on the deployment bar, the
// statues and the archive, the oath sworn by a hero) → the Book of Oaths choice → M18 in the rain (the ward, a forest-keeper
// led inside, Sain's ④ in the skills menu) → the truth choice and the end-of-content texts. 1440×900 and 390×844 touch.
// Screenshots: docs/v0.9.1/screenshots/act3b.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory,enterWarCouncil} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {startBattle,beginEnemyPhase,advanceEnemy,nextMission} from '../src/core/game.js';import {findUnit} from '../src/core/rules.js';
import {enterHub} from '../src/core/frontier.js';import {startSkirmish,returnToCamp} from '../src/core/skirmish.js';import {applyClass} from '../src/core/progression.js';import {CLASS_TREE} from '../src/data/classes.js';
import {chooseOath17} from '../src/core/mission-rules-v091.js';import {drain} from './campaign-policy.mjs';
const url=pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.9.2.html').href,shots='docs/v0.9.1/screenshots/act3b';fs.mkdirSync(shots,{recursive:true});fs.mkdirSync('test-output',{recursive:true});
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});let n=0;const results=[];const check=(name,ok)=>{assert.ok(ok,name);n++;results.push(name);console.log('PASS',name);};
const camp16=JSON.parse(fs.readFileSync('tests/fixtures/v090/v090-m16-camp.json','utf8')).save;
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
// the v0.9.0 camp with the legion raised for ACT III part 2: Lv 14, the five promoted, the recruits at Lv 15
function ready(){const s=deserialize(camp16);for(const h of s.campaign.heroes){h.level=Math.max(h.level,['thea','dario','ines'].includes(h.id)?15:14);if(!['thea','dario','ines'].includes(h.id)&&(h.classTier||1)<2){applyClass(h,CLASS_TREE[h.id][1]);s.campaign.promotions[h.id]={tier:2,key:CLASS_TREE[h.id][1].key,mission:6,turn:1};}h.hp=h.maxHP;h.mp=h.maxMP;h.xp=0;}return deserialize(serialize(s));}
// Elina's awakening trial won, back in the field camp with the awakening scene queued
function awakened(){const s=ready(),t=startSkirmish(s,'trial','elina',{force:true});for(const u of t.units.filter(u=>u.team==='enemy'))u.hp=0;enemyPhase(t);const c=returnToCamp(t);return c;}
const m17=()=>{const s=nextMission(ready());s.screen='deployment';startBattle(s);drain(s);return s;};
function m17Won(){const s=m17();for(const u of s.units.filter(u=>u.team==='enemy'))u.hp=0;enemyPhase(s);enterHub(s,{aftermath:true});drain(s);return s;}
function m18(){const s=m17Won();chooseOath17(s,'leave');const t=nextMission(s);t.screen='deployment';startBattle(t);drain(t);return t;}
function m18Won(){const s=m18();for(const u of s.units.filter(u=>u.team==='enemy'))u.hp=0;s.turn=12;enemyPhase(s);enterHub(s,{aftermath:true});drain(s);return s;}
try{
 for(const [label,viewport,touch] of [['1440',{width:1440,height:900},false],['390',{width:390,height:844},true]]){
  const ctx=await b.newContext({viewport,hasTouch:touch,isMobile:touch,deviceScaleFactor:touch?2:1});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const press=async(a,id)=>{const el=p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first();touch?await el.tap():await el.click();await p.waitForTimeout(250);};
  const restore=async s=>{await drainStory(p);if(await p.locator('#modal-root .modal').count())await press('close-modal');await press('menu');await press('backup');await p.fill('#backup-text',typeof s==='string'?s:serialize(s));await press('restore');await p.waitForTimeout(400);};
  const snap=()=>p.evaluate(()=>AshenCrown.snapshot());const body=async()=>(await p.locator('body').textContent())||'';const modal=async()=>(await p.locator('#modal-root').textContent())||'';
  const closeModals=async()=>{for(let i=0;i<4&&await p.locator('#modal-root .modal').count();i++){await press('close-modal');await drainStory(p);}};
  const tile=async(x,y)=>{await p.waitForTimeout(250);if(touch&&await p.locator('[data-do="reset-camera"]').isVisible()){const off=await p.evaluate(([x,y])=>{const c=window.AshenCrown.tileCenter(x,y),r=document.querySelector('#battle-map').getBoundingClientRect();return c.x<0||c.y<0||c.x>r.width||c.y>r.height;},[x,y]);if(off){await p.locator('[data-do="reset-camera"]').first().tap();await p.waitForTimeout(300);}}const pt=await p.evaluate(([x,y])=>{const c=window.AshenCrown.tileCenter(x,y),r=document.querySelector('#battle-map').getBoundingClientRect();return {x:c.x+r.x,y:c.y+r.y};},[x,y]);touch?await p.touchscreen.tap(pt.x,pt.y):await p.mouse.click(pt.x,pt.y);await p.waitForTimeout(250);};
  const select=async u=>{await p.waitForFunction(()=>!AshenCrown.view().busy,{},{timeout:30000});if(await p.locator('[data-do="close-unit-menu"]').count())await press('close-unit-menu');await tile(u.x,u.y);if((await p.evaluate(()=>AshenCrown.view().selected))!==u.id)await tile(u.x,u.y);if(!await p.locator('[data-do="submenu"][data-id="skills"]').count())await press('open-unit-menu');};
  await p.goto(url);await press('new');await drainStory(p);
  // 1. the real v0.9.0 field camp: the legion panel lists the recruits; with the legion raised, Elina's awakening opens
  await restore(camp16);await drainStory(p);await closeModals();let s=await snap();
  check(`${label} the v0.9.0 field camp offers Mission 17`,s.frontier.hub==='fieldcamp'&&(await p.locator('[data-do="next-mission"]').first().textContent()).includes('Mission 17'));
  await restore(ready());await drainStory(p);await closeModals();await press('legion');let t=await modal();
  check(`${label} the legion panel: Elina → 매의 사수 with ④ 퇴로 봉쇄, the recruits → their tier 2, Erik waiting for M17`,t.includes('매의 사수')&&t.includes('퇴로 봉쇄')&&t.includes('흑철 창기사')&&t.includes('성소 수호자')&&t.includes('Mission 17 클리어'));
  check(`${label} Elina's awakening trial and Thea's trial can start; Erik's cannot yet`,await p.locator('[data-do="trial-start"][data-id="elina"]:not([disabled])').count()===1&&await p.locator('[data-do="trial-start"][data-id="thea"]:not([disabled])').count()===1&&await p.locator('[data-do="trial-start"][data-id="eric"][disabled]').count()===1);
  await p.screenshot({path:`${shots}/legion-panel-${label}.png`});
  await press('trial-start','elina');await drainStory(p);s=await snap();check(`${label} the awakening trial opens as 매의 시련 with Elina awakened for it`,s.missionId===106&&s.units.find(u=>u.id==='elina').classTier===3);
  const el=s.units.find(u=>u.id==='elina');await select(el);await press('submenu','skills');t=await p.locator('#unit-popover').textContent();
  check(`${label} Elina's skills menu shows ④ 퇴로 봉쇄 · once a battle`,t.includes('④')&&t.includes('퇴로 봉쇄')&&t.includes('전투당 1회'));
  await p.screenshot({path:`${shots}/ultimate-menu-${label}.png`});await press('close-unit-menu');
  // 2. the trial won: the awakening card
  await restore(awakened());await drainStory(p);await p.waitForTimeout(400);t=await modal();
  check(`${label} back in camp the awakening card shows 매의 사수 and the ④`,t.includes('각성')&&t.includes('매의 사수')&&t.includes('퇴로 봉쇄'));
  await p.screenshot({path:`${shots}/awakening-card-${label}.png`});await closeModals();
  // 3. M17: the keep, 「나아가라」 on the deployment bar, statues and the archive, an oath
  const s17=nextMission(ready());enterHub(s17);drain(s17);await restore(s17);await drainStory(p);s=await snap();check(`${label} M17 preparation at the guardians' keep (temporary fortress painting)`,s.missionId===17&&s.frontier.hub==='keep');
  await p.screenshot({path:`${shots}/keep-m17-${label}.png`});
  await enterWarCouncil(p,touch);await press('deploy');await p.waitForTimeout(300);
  check(`${label} the deployment bar carries 「나아가라」 (the newest command)`,(await p.locator('[data-do="aren-command"]').first().textContent()).includes('나아가라'));
  await press('aren-command');s=await snap();check(`${label} the command button moves on to none, then 「지켜라」`,s.command===null);await press('aren-command');s=await snap();check(`${label} … and 「지켜라」`,s.command==='hold');
  await press('aren-command');s=await snap();check(`${label} … and back to 「나아가라」`,s.command==='advance');
  await press('start-battle');await drainStory(p);s=await snap();
  check(`${label} M17 battle: seven heroes, four sleeping statues, the archive`,s.screen==='battle'&&s.units.filter(u=>u.team==='ally'&&!u.benched).length===7&&s.units.filter(u=>u.kind==='statue'&&u.team==='object').length===4);
  check(`${label} the objective panel shows the statues and the turns left`,(await body()).includes('맹세한 석상 0/4'));
  const prep=deserialize(serialize(await snap()));const hero=prep.units.find(u=>u.id==='eric'),st=prep.units.find(u=>u.id==='st1');hero.x=st.x+1;hero.y=st.y;await restore(prep);await drainStory(p);
  await select(hero);check(`${label} a hero beside a statue may swear (맹세)`,(await p.locator('#unit-popover').textContent()).includes('맹세'));
  await press('mode','search');await tile(st.x,st.y);if(await p.locator('[data-do="confirm"]').count())await press('confirm');await p.waitForTimeout(600);await drainStory(p);s=await snap();
  check(`${label} the statue wakes for the legion`,s.units.find(u=>u.id==='st1').team==='allied'&&s.missionState.sworn.includes('st1'));
  await p.screenshot({path:`${shots}/m17-oath-${label}.png`});
  // 4. M17 won: the Book of Oaths choice
  await restore(m17Won());await drainStory(p);for(let i=0;i<3&&!(await p.locator('[data-do="oath17-pick"]').count());i++){await closeModals();await press('next-mission');await p.waitForTimeout(300);}
  check(`${label} after M17 the camp asks about the Book of Oaths (two ways)`,await p.locator('[data-do="oath17-pick"]').count()===2);
  await p.screenshot({path:`${shots}/oath17-choice-${label}.png`});
  await press('oath17-pick','take');await drainStory(p);s=await snap();check(`${label} the book goes with the legion; Erik's word follows`,s.campaign.choices.m17_oath==='take'&&s.narrative.seen.includes('after:17:take')&&s.narrative.seen.includes('after:17:eric'));
  // 5. M18 in the rain
  await restore(m18());await drainStory(p);s=await snap();check(`${label} M18: rain, three ward trees, six forest-keepers`,s.missionId===18&&s.units.filter(u=>u.kind==='wardTree'&&u.hp>0).length===3&&s.units.filter(u=>u.kind==='forester').length===6);
  check(`${label} the objective panel shows the trees, the keepers and the rain`,(await body()).includes('결계 고목 3/3')&&(await body()).includes('비'));
  const f=deserialize(serialize(s)),kai=f.units.find(u=>u.id==='kai'&&!u.benched)||f.units.find(u=>u.team==='ally'&&!u.benched),fo=f.units.find(u=>u.id==='f3');kai.x=fo.x+1;kai.y=fo.y;await restore(f);await drainStory(p);
  await select(kai);await press('mode','rescue');await tile(fo.x,fo.y);if(await p.locator('[data-do="confirm"]').count())await press('confirm');await p.waitForTimeout(600);await drainStory(p);s=await snap();
  check(`${label} a forest-keeper is led inside the ward`,s.missionState.sheltered.includes('f3'));
  await p.screenshot({path:`${shots}/m18-rain-${label}.png`});
  // 6. M18 won: the truth choice, the end of v0.9.1
  await restore(m18Won());await drainStory(p);for(let i=0;i<3&&!(await p.locator('[data-do="truth18-pick"]').count());i++){await closeModals();await press('next-mission');await p.waitForTimeout(300);}
  check(`${label} after M18 the camp asks whether Sain tells the elder (two ways)`,await p.locator('[data-do="truth18-pick"]').count()===2);
  await p.screenshot({path:`${shots}/truth18-choice-${label}.png`});
  await press('truth18-pick','tell');await drainStory(p);s=await snap();check(`${label} Sain tells the truth; the next-step scene points to M19`,s.campaign.choices.m18_truth==='tell'&&s.narrative.seen.includes('after:18:tell')&&s.narrative.seen.includes('after:18:next')&&s.frontier.hub==='forest');
  check(`${label} after M18 the camp now goes on to Mission 19 (v0.9.2)`,(await p.locator('[data-do="next-mission"]').first().textContent()).includes('Mission 19'));
  await p.screenshot({path:`${shots}/forest-end-${label}.png`});
  check(`${label} no page errors`,errors.length===0);
  await ctx.close();}
 fs.writeFileSync('test-output/act3b-e2e.json',JSON.stringify({suite:'act3b-e2e',passed:n,results},null,1));console.log(`act3b-e2e: ${n} checks passed`);
}finally{await b.close();}
