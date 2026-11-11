// v0.9.2 in the browser: a real v0.9.1 save (the forest village after M18) → M19 from the capital's lower city
// (「한 사람도 두고 가지 않는다」 on the deployment bar, four ritual circles and their captives' memory, a seal broken with
// 봉인 해제) → the teacher choice and Lia's word → the legion panel and Lia's awakening trial (her ④ 작은 결계 cast from the
// skills menu) → M20 (the archive and the burning lower city, grey cloaks, Kai's ④ 그림자 군무 with two taps) → the superior
// and plan choices and the end-of-content texts → Kai's awakening card. 1440×900 and 390×844 touch.
// Screenshots: docs/v0.9.2/screenshots/act3c.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory,enterWarCouncil} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {startBattle,beginEnemyPhase,advanceEnemy,nextMission} from '../src/core/game.js';
import {enterHub} from '../src/core/frontier.js';import {startSkirmish,returnToCamp} from '../src/core/skirmish.js';import {applyClass} from '../src/core/progression.js';import {CLASS_TREE} from '../src/data/classes.js';
import {chooseTeacher19} from '../src/core/mission-rules-v092.js';import {drain} from './campaign-policy.mjs';
const url=pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.10.1.html').href,shots='docs/v0.9.2/screenshots/act3c';fs.mkdirSync(shots,{recursive:true});fs.mkdirSync('test-output',{recursive:true});
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});let n=0;const results=[];const check=(name,ok)=>{assert.ok(ok,name);n++;results.push(name);console.log('PASS',name);};
const camp18=JSON.parse(fs.readFileSync('tests/fixtures/v091/v091-m18-camp.json','utf8')).save;
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);if(s.duel&&!s.duel.result)s.duel.result='skipped';};
// the v0.9.1 camp with the legion raised for ACT III part 3: Lv 14, the five promoted, the recruits at Lv 15
function ready(){const s=deserialize(camp18);for(const h of s.campaign.heroes){h.level=Math.max(h.level,['thea','dario','ines'].includes(h.id)?15:14);if(!['thea','dario','ines'].includes(h.id)&&(h.classTier||1)<2){applyClass(h,CLASS_TREE[h.id][1]);s.campaign.promotions[h.id]={tier:2,key:CLASS_TREE[h.id][1].key,mission:6,turn:1};}h.hp=h.maxHP;h.mp=h.maxMP;h.xp=0;}return deserialize(serialize(s));}
const m19=()=>{const s=nextMission(ready());s.screen='deployment';startBattle(s);drain(s);return s;};
function m19Won(){const s=m19();for(const u of s.units.filter(u=>u.team==='enemy'))u.hp=0;s.missionState.unsealed=['rc1','rc2','rc3','rc4'];for(const c of s.units.filter(u=>u.kind==='ritualCircle'))c.inert=true;enemyPhase(s);enterHub(s,{aftermath:true});drain(s);return s;}
function m20(){const s=m19Won();chooseTeacher19(s,'take');const t=nextMission(s);t.screen='deployment';startBattle(t);drain(t);return t;}
function m20Won(){const s=m20();for(const u of s.units.filter(u=>u.team==='enemy'))u.hp=0;const st=s.missionState;st.searched=['cb1','cb2'];st.evacuated=['h1','h2','h3','h4'];for(const id of st.evacuated){const r=s.units.find(u=>u.id===id);r.rescued=true;}enemyPhase(s);enterHub(s,{aftermath:true});drain(s);return s;}
// Kai's awakening trial won, back in the camp after M20 with the awakening scene queued
function kaiAwakened(){const s=m20Won();s.campaign.choices.m20_superior='release';s.campaign.choices.m20_plan='keep';const t=startSkirmish(deserialize(serialize(s)),'trial','kai',{force:true});for(const u of t.units.filter(u=>u.team==='enemy'))u.hp=0;enemyPhase(t);return returnToCamp(t);}
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
  // 1. the real v0.9.1 forest camp offers Mission 19; going on brings the legion back to the capital's lower city
  await restore(camp18);await drainStory(p);await closeModals();let s=await snap();
  check(`${label} the v0.9.1 forest village offers Mission 19`,s.frontier.hub==='forest'&&(await p.locator('[data-do="next-mission"]').first().textContent()).includes('Mission 19'));
  const s19=nextMission(ready());enterHub(s19);await restore(s19);await drainStory(p);s=await snap();
  check(`${label} M19 preparation in the capital's lower city (the return scene seen)`,s.missionId===19&&s.frontier.hub==='capital'&&s.narrative.seen.includes('world:capital:return'));
  await p.screenshot({path:`${shots}/capital-m19-${label}.png`});
  await enterWarCouncil(p,touch);await press('deploy');await p.waitForTimeout(300);
  check(`${label} the deployment bar carries 「한 사람도 두고 가지 않는다」 (the newest order)`,(await p.locator('[data-do="aren-command"]').first().textContent()).includes('한 사람도'));
  await press('start-battle');await drainStory(p);s=await snap();
  check(`${label} M19 battle: seven heroes, four lit circles, four captives with full memory`,s.screen==='battle'&&s.units.filter(u=>u.team==='ally'&&!u.benched).length===7&&s.units.filter(u=>u.kind==='ritualCircle'&&!u.inert).length===4&&Object.values(s.missionState.memory).join('')==='3333');
  check(`${label} the objective panel shows the circles and the captives' memory`,(await body()).includes('의식진 0/4')&&(await body()).includes('포로 기억'));
  await p.screenshot({path:`${shots}/m19-rite-${label}.png`});
  const prep=deserialize(serialize(await snap()));for(const r of prep.units.filter(u=>u.id==='r1'))r.hp=0;const hero=prep.units.find(u=>u.id==='eric'),rc=prep.units.find(u=>u.id==='rc1');hero.x=rc.x;hero.y=rc.y+1;await restore(prep);await drainStory(p);
  await select(hero);check(`${label} a hero beside a circle may break its seal (봉인 해제)`,(await p.locator('#unit-popover').textContent()).includes('봉인 해제'));
  await press('mode','search');await tile(rc.x,rc.y);if(await p.locator('[data-do="confirm"]').count())await press('confirm');await p.waitForTimeout(600);await drainStory(p);s=await snap();
  check(`${label} the circle goes out`,s.missionState.unsealed.includes('rc1'));
  // 2. M19 won: the teacher choice and Lia's word
  await restore(m19Won());await drainStory(p);for(let i=0;i<3&&!(await p.locator('[data-do="teacher19-pick"]').count());i++){await closeModals();await press('next-mission');await p.waitForTimeout(300);}
  check(`${label} after M19 the camp asks about Lia's teacher (two ways)`,await p.locator('[data-do="teacher19-pick"]').count()===2);
  await p.screenshot({path:`${shots}/teacher19-choice-${label}.png`});
  await press('teacher19-pick','take');await drainStory(p);s=await snap();check(`${label} the teacher goes with the legion as a witness; Lia's word follows`,s.campaign.choices.m19_teacher==='take'&&s.narrative.seen.includes('after:19:take')&&s.narrative.seen.includes('after:19:lia'));
  // 3. the legion panel: Lia → 결계술사; her trial with ④ 작은 결계 from the skills menu
  await closeModals();await press('legion');let t=await modal();
  check(`${label} the legion panel: Lia → 결계술사 with ④ 작은 결계, Kai waiting for M20`,t.includes('결계술사')&&t.includes('작은 결계')&&t.includes('Mission 20 클리어'));
  check(`${label} Lia's awakening trial can start; Kai's cannot yet`,await p.locator('[data-do="trial-start"][data-id="lia"]:not([disabled])').count()===1&&await p.locator('[data-do="trial-start"][data-id="kai"][disabled]').count()===1);
  await p.screenshot({path:`${shots}/legion-panel-${label}.png`});
  await press('trial-start','lia');await drainStory(p);s=await snap();check(`${label} the trial opens as 결계의 시련 with Lia awakened for it`,s.missionId===109&&s.units.find(u=>u.id==='lia').classTier===3);
  const lia=s.units.find(u=>u.id==='lia');await select(lia);await press('submenu','skills');t=await p.locator('#unit-popover').textContent();
  check(`${label} Lia's skills menu shows ④ 작은 결계 · once a battle`,t.includes('④')&&t.includes('작은 결계')&&t.includes('1회'));
  await p.screenshot({path:`${shots}/ultimate-menu-${label}.png`});
  await press('mode','smallWard');await tile(9,5);await p.waitForTimeout(300);check(`${label} the ward's forecast shows the 3×3 for two turns`,(await p.locator('#unit-popover').textContent()).includes('3×3'));
  await tile(9,5);await p.waitForTimeout(700);await drainStory(p);s=await snap();check(`${label} the ward stands over the east gap`,s.smallWard?.x===9&&s.smallWard?.y===5&&s.ultimates?.includes('lia'));
  await p.screenshot({path:`${shots}/little-ward-${label}.png`});
  // 4. M20: the archive and the burning lower city; Kai's ④ with two taps
  await restore(m20());await drainStory(p);s=await snap();
  check(`${label} M20: three cabinets, six residents, the lower city on fire, grey cloaks in the shadows`,s.missionId===20&&s.units.filter(u=>u.kind==='cabinet').length===3&&s.units.filter(u=>u.kind==='resident').length===6&&Object.keys(s.burning||{}).length>=2&&s.units.filter(u=>u.shade).length>=4);
  check(`${label} the objective panel shows the plan and the evacuation`,(await body()).includes('계획서 0/2')&&(await body()).includes('대피 0/4'));
  await p.screenshot({path:`${shots}/m20-night-${label}.png`});
  const d=deserialize(serialize(s)),kai=d.units.find(u=>u.id==='kai');kai.classTier=3;kai.mp=kai.maxMP;const foe=d.units.find(u=>u.id==='g5'),mate=d.units.find(u=>u.team==='ally'&&!u.benched&&u.id!=='kai');kai.x=4;kai.y=6;foe.x=4;foe.y=8;mate.x=6;mate.y=6;await restore(d);await drainStory(p);
  await select(kai);await press('submenu','skills');await press('mode','shadowDance');await tile(4,8);await tile(6,6);await p.waitForTimeout(300);
  check(`${label} Shadow Dance: two taps pick the pair and show the forecast`,(await p.locator('#unit-popover').textContent()).includes('행동 불가'));
  await tile(6,6);await p.waitForTimeout(700);await drainStory(p);s=await snap();const g5=s.units.find(u=>u.id==='g5');
  check(`${label} the two trade places and the cloak is held for the next enemy phase`,g5.x===6&&g5.y===6&&g5.dazed===s.turn&&s.ultimates?.includes('kai'));
  await p.screenshot({path:`${shots}/shadow-dance-${label}.png`});
  // 5. M20 won: the superior, then the plan; the end of v0.9.2
  await restore(m20Won());await drainStory(p);for(let i=0;i<3&&!(await p.locator('[data-do="superior20-pick"]').count());i++){await closeModals();await press('next-mission');await p.waitForTimeout(300);}
  check(`${label} after M20 the camp asks what Kai does with his old superior (two ways)`,await p.locator('[data-do="superior20-pick"]').count()===2);
  await p.screenshot({path:`${shots}/superior20-choice-${label}.png`});
  await press('superior20-pick','trial');await drainStory(p);for(let i=0;i<3&&!(await p.locator('[data-do="plan20-pick"]').count());i++){await closeModals();await press('next-mission');await p.waitForTimeout(300);}
  check(`${label} then the plan: send copies to the three banners or keep it (two ways)`,await p.locator('[data-do="plan20-pick"]').count()===2);
  await press('plan20-pick','keep');await drainStory(p);s=await snap();
  check(`${label} Kai's word, Baldrick at the gate and the way to the crown's heart follow`,s.campaign.choices.m20_superior==='trial'&&s.campaign.choices.m20_plan==='keep'&&['after:20:trial','after:20:keep','after:20:kai','after:20:next'].every(k=>s.narrative.seen.includes(k))&&s.narrative.seen.some(k=>k.startsWith('after:20:baldrick:')));
  check(`${label} after M20 the way goes on to Mission 21 (v0.9.3)`,(await p.locator('[data-do="next-mission"]').first().textContent()).includes('Mission 21'));
  await p.screenshot({path:`${shots}/capital-end-${label}.png`});
  // 6. Kai's awakening card
  await restore(kaiAwakened());await drainStory(p);await p.waitForTimeout(400);t=await modal();
  check(`${label} Kai's awakening card shows 그림자 군주 and the ④`,t.includes('각성')&&t.includes('그림자 군주')&&t.includes('그림자 군무'));
  await p.screenshot({path:`${shots}/awakening-card-${label}.png`});await closeModals();
  check(`${label} no page errors`,errors.length===0);
  await ctx.close();}
 fs.writeFileSync('test-output/act3c-e2e.json',JSON.stringify({suite:'act3c-e2e',passed:n,results},null,1));console.log(`act3c-e2e: ${n} checks passed`);
}finally{await b.close();}
