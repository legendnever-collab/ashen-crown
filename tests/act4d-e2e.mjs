// v1.0.0 in the browser: a real v0.10.2 save (the lower city after M28, the confession told to all, Baldrick in the legion) →
// Mission 29 (eight of nine; the rite points on the council path; the objective panel) → TURN 2 the duel with Bellard, left to
// Aren's last words → Bellard rises with the crown's power (the second phase) → his second fall wins → Bellard's fate (his own
// offer, open after Aren's words) → Mission 30 (the heart stone, all three banners) → the dawn after TURN 8 → the ending
// choice among the open endings → its scene → the epilogue (every hero, Aren, the king, Bellard, the leaders) → the ending
// card → the camp stays open with the epilogue to see again. 1440×900 and 390×844 touch. Screenshots: docs/v1.0.0/screenshots/act4d.
import {standBeside} from './duel-helper.mjs';import {launchTestBrowser} from './browser-helper.mjs';import {drainStory,enterWarCouncil} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {startBattle,beginEnemyPhase,advanceEnemy,nextMission} from '../src/core/game.js';
import {enterHub} from '../src/core/frontier.js';import {drain} from './campaign-policy.mjs';
import {M29} from '../src/core/mission-rules-v100.js';import {duelPick,duelOpen} from '../src/core/duel.js';import {MISSIONS} from '../src/data/missions.js';
const url=pathToFileURL(process.cwd()+'/build/Ashen_Crown.html').href,shots='docs/v1.0.0/screenshots/act4d';fs.mkdirSync(shots,{recursive:true});fs.mkdirSync('test-output',{recursive:true});
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});let n=0;const results=[];const check=(name,ok)=>{assert.ok(ok,name);n++;results.push(name);console.log('PASS',name);};
const camp28=JSON.parse(fs.readFileSync('tests/fixtures/v0102/v0102-m28-camp.json','utf8')).save;
const enemyPhase=s=>{for(let i=0;duelOpen(s)&&i<3;i++)duelPick(s,'skip');beginEnemyPhase(s);for(let i=0;s.phase==='enemy'&&!s.outcome&&i<200;i++){advanceEnemy(s);drain(s);}drain(s);};
function ready(){const s=deserialize(camp28);for(const h of s.campaign.heroes){h.hp=h.maxHP;h.mp=h.maxMP;h.xp=0;}return deserialize(serialize(s));}
function m29(){const s=nextMission(ready());s.screen='deployment';startBattle(s);drain(s);return s;}
const quiet=s=>{for(const u of s.units.filter(u=>u.team==='enemy'&&u.id!=='boss'))u.hp=0;};
// TURN 2 with the duel open (the hall quiet but for Bellard).
function m29Duel(){const s=m29();quiet(s);beginEnemyPhase(s);for(let i=0;s.phase==='enemy'&&i<200;i++){advanceEnemy(s);drain(s);}drain(s);standBeside(s,'eric','boss');return deserialize(serialize(s));} /* v2.1: Erik beside Bellard opens it */
// Bellard risen with the crown's power after Aren's words.
function m29Crowned(){const s=m29();quiet(s);s.missionState.words=true;s.missionState.duelDone=s.missionState.duelCounted=true;const bl=s.units.find(u=>u.id==='boss');bl.hp=0;M29.afterDamage(s,bl);drain(s);return deserialize(serialize(s));}
// His second fall: the outcome comes at the end of the player phase.
function m29Fallen(){const s=deserialize(serialize(m29Crowned()));const bl=s.units.find(u=>u.id==='boss');bl.hp=0;M29.afterDamage(s,bl);drain(s);return deserialize(serialize(s));}
function m29Won(){const s=m29Fallen();enemyPhase(s);enterHub(s,{aftermath:true});drain(s);return s;}
function m30(){const w=m29Won();w.campaign.choices.m29_bellard='offer';w.campaign.flags.mission_29_bellard='offer';const s=nextMission(w);s.screen='deployment';startBattle(s);drain(s);return s;}
function m30Last(){const s=m30();for(const u of s.units.filter(u=>u.team==='enemy'))u.hp=0;s.turn=8;for(const t of [2,4,6])if(!s.missionState.waves.includes(t))s.missionState.waves.push(t);return deserialize(serialize(s));}
try{
 for(const [label,viewport,touch] of [['1440',{width:1440,height:900},false],['390',{width:390,height:844},true]]){
  const ctx=await b.newContext({viewport,hasTouch:touch,isMobile:touch,deviceScaleFactor:touch?2:1});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const press=async(a,id)=>{const el=p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first();touch?await el.tap():await el.click();await p.waitForTimeout(250);};
  const restore=async s=>{await drainStory(p);if(await p.locator('#modal-root .modal').count()&&await p.locator('#modal-root [data-do="close-modal"]').count())await press('close-modal');await press('menu');{const bk=p.locator('#modal-root [data-do="backup"]').first();touch?await bk.tap():await bk.click();await p.waitForTimeout(250);}await p.fill('#backup-text',typeof s==='string'?s:serialize(s));await press('restore');await p.waitForTimeout(400);};
  const snap=()=>p.evaluate(()=>AshenCrown.snapshot());const body=async()=>(await p.locator('body').textContent())||'';const modal=async()=>(await p.locator('#modal-root').textContent())||'';
  const closeModals=async()=>{for(let i=0;i<4&&await p.locator('#modal-root [data-do="close-modal"]').count();i++){await press('close-modal');await drainStory(p);}};
  const endPhase=async()=>{await press('end-phase');if(await p.locator('[data-do="confirm-phase"]').count())await press('confirm-phase');for(let i=0;i<100&&!(await snap()).outcome;i++)await p.waitForTimeout(200);await drainStory(p);};
  await p.goto(url);await press('new');await drainStory(p);
  // 1. the real v0.10.2 lower city offers Mission 29
  await restore(camp28);await drainStory(p);await closeModals();let s=await snap();
  check(`${label} the v0.10.2 lower city (after M28, nine heroes) offers Mission 29`,s.schema===28&&s.version==='2.7.1'&&s.frontier.hub==='capital'&&s.campaign.roster.includes('baldrick')&&(await p.locator('[data-do="next-mission"]').first().textContent()).includes('Mission 29'));
  await press('next-mission');await p.waitForTimeout(400);await drainStory(p);await closeModals();s=await snap();check(`${label} the lower city before M29`,s.frontier.hub==='capital'&&s.missionId===29);
  await enterWarCouncil(p,touch);await press('deploy');await p.waitForTimeout(300);s=await snap();check(`${label} the sortie is eight of nine heroes`,s.units.filter(u=>u.team==='ally'&&!['bram','noa','marta','rowell'].includes(u.id)).length===9&&s.units.filter(u=>u.team==='ally'&&!u.benched).length===8&&s.units.filter(u=>['bram','noa','marta','rowell'].includes(u.id)).every(u=>u.benched)); /* v2.0.0: the four officers wait on the bench */
  await press('start-battle');await drainStory(p);s=await snap();
  // 2. M29: the crown's heart
  check(`${label} M29: Bellard on the dais, the rite points where the council path puts them`,s.screen==='battle'&&s.missionState.path==='council'&&JSON.stringify(['rp1','rp2','rp3'].map(id=>{const r=s.units.find(u=>u.id===id);return [r.x,r.y];}))===JSON.stringify(MISSIONS[29].rites29.council)&&s.units.find(u=>u.id==='boss')?.look==='bellard');
  check(`${label} the objective panel counts the rite points and Bellard's phase`,(await body()).includes('의식 지점 3/3')&&(await body()).includes('1단계'));
  await press('reset-camera');await p.waitForTimeout(300);await p.screenshot({path:`${shots}/m29-field-${label}.png`});
  // 3. TURN 2: the duel, left to Aren's last words
  await restore(m29Duel());await drainStory(p);for(let i=0;i<10&&!(await p.locator('[data-do="duel-pick"][data-id="skip"]').count());i++)await p.waitForTimeout(200);
  check(`${label} TURN 2: Bellard calls Erik out — the duel can be left to Aren's last words`,(await modal()).includes('일기토')&&(await p.locator('[data-do="duel-pick"][data-id="skip"]').textContent()).includes('아렌의 마지막 말'));
  await p.screenshot({path:`${shots}/m29-duel-${label}.png`});await press('duel-pick','skip');await drainStory(p);await p.waitForTimeout(300);
  await press('end-phase');if(await p.locator('[data-do="confirm-phase"]').count())await press('confirm-phase');for(let i=0;i<60&&(await snap()).phase==='enemy';i++)await p.waitForTimeout(200);await drainStory(p);s=await snap();
  check(`${label} Aren speaks to Bellard (the words are kept for his fate)`,s.missionState.words===true&&s.narrative.seen.includes('29:words'));
  // 4. the crown's power, then his second fall
  await restore(m29Crowned());await drainStory(p);s=await snap();
  check(`${label} Bellard rises with the crown's power — second phase, answered less after Aren's words`,s.missionState.phase===2&&s.units.find(u=>u.id==='boss').crowned&&s.units.find(u=>u.id==='boss').maxHP===MISSIONS[29].crown29.words.hp&&(await body()).includes('2단계'));
  await press('reset-camera');await p.waitForTimeout(300);await p.screenshot({path:`${shots}/m29-crowned-${label}.png`});
  await restore(m29Fallen());await drainStory(p);await endPhase();s=await snap();
  check(`${label} his second fall with the rite points standing wins M29; the king rests`,s.outcome==='victory'&&s.campaign.flags.mission_29_rites===3&&s.campaign.flags.king_rests===true);await p.screenshot({path:`${shots}/m29-won-${label}.png`});
  // 5. Bellard's fate
  await restore(m29Won());await drainStory(p);for(let i=0;i<3&&!(await p.locator('[data-do="fate29-pick"]').count());i++){await closeModals();await p.waitForTimeout(300);}
  check(`${label} Bellard's fate: a trial, exile — and his own offer after Aren's words`,await p.locator('[data-do="fate29-pick"]').count()===3);
  await p.screenshot({path:`${shots}/fate29-${label}.png`});await press('fate29-pick','offer');await drainStory(p);await p.waitForTimeout(300);s=await snap();
  check(`${label} his offer is kept and its scene plays`,s.campaign.choices.m29_bellard==='offer'&&s.narrative.seen.includes('after:29:offer'));
  // 6. M30: the crownless dawn
  const m=m30();await restore(m);await drainStory(p);s=await snap();
  check(`${label} M30: the heart stone, all three banners beside the legion`,s.screen==='battle'&&s.missionId===30&&s.units.some(u=>u.id==='heart'&&u.hp>0)&&['ib1','fb1','lb1'].every(id=>s.units.some(u=>u.id===id&&!u.absent&&u.hp>0))&&(await body()).includes('결계의 심장'));
  await press('reset-camera');await p.waitForTimeout(300);await p.screenshot({path:`${shots}/m30-field-${label}.png`});
  await restore(m30Last());await drainStory(p);await endPhase();s=await snap();
  check(`${label} the dawn after TURN 8 wins M30 (ACT IV complete)`,s.outcome==='victory'&&s.campaign.flags.act4_completed===true);
  // 7. the ending
  await press('aftermath');await drainStory(p);await p.waitForTimeout(300);
  for(let i=0;i<6&&!(await p.locator('[data-do="ending-pick"]').count());i++){await drainStory(p);if(await p.locator('[data-do="ending-choose"]').count())await press('ending-choose');await p.waitForTimeout(300);}
  const picks=await p.locator('[data-do="ending-pick"]').count();
  check(`${label} the ending choice: the open endings with what each holds, gains and costs (${picks} open)`,picks>=1&&(await modal()).includes('얻는 것')&&(await modal()).includes('치르는 값')&&(await modal()).includes('하나의 왕국')&&(await modal()).includes('새로운 서약'));
  await p.screenshot({path:`${shots}/ending-choice-${label}.png`});
  const pick=await p.locator('[data-do="ending-pick"]').first().getAttribute('data-id');await press('ending-pick',pick);
  let scene=false;for(let i=0;i<60;i++){const t=await body();if(t.includes('결계 너머의 재')){scene=true;break;}if(!(await snap()).narrative.active)break;await p.keyboard.press('Enter').catch(()=>{});await p.waitForTimeout(150);}
  await drainStory(p);for(let i=0;i<10&&!(await modal()).includes('에필로그');i++)await p.waitForTimeout(200);s=await snap();
  check(`${label} the ending (${pick}) is kept and its scene plays`,s.campaign.ending?.id===pick&&s.narrative.seen.includes(`ending:${pick}`));
  const epi=await modal();check(`${label} the epilogue: every hero, Aren, the king, Bellard and the three leaders`,['에릭','엘리나','리아','세인','카이','테아','다리오','이네스','발드릭','아렌','마지막 국왕','벨라드','카시안','레오노라','루시안'].every(k=>epi.includes(k))&&(await p.locator('.epi-card').count())>=14);
  await p.screenshot({path:`${shots}/epilogue-${label}.png`});{const bt=p.locator('#modal-root [data-do="ending-card"]').first();touch?await bt.tap():await bt.click();}await p.waitForTimeout(300);
  check(`${label} the ending card sums up ACT IV, the heroes and the banners`,(await modal()).includes('ACT IV의 선택')&&(await modal()).includes('장수 열전')&&(await modal()).includes('스스로 기억을 바침'));
  await p.screenshot({path:`${shots}/ending-card-${label}.png`});await closeModals();
  // 8. the camp goes on
  await press('hub-menu');await p.waitForTimeout(200);check(`${label} the camp stays open with the epilogue to see again`,await p.locator('[data-do="ending-epilogue"]').count()>=1&&!(await p.locator('[data-do="next-mission"]').count()));
  await p.screenshot({path:`${shots}/camp-after-${label}.png`});
  check(`${label} no page errors`,errors.length===0);
  await ctx.close();}
 fs.writeFileSync('test-output/act4d-e2e.json',JSON.stringify({suite:'act4d-e2e',passed:n,results},null,1));console.log(`act4d-e2e: ${n} checks passed`);
}finally{await b.close();}
