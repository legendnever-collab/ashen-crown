// v0.9.0 in the browser: a real v0.8.1 save (the summit camp after M14) → ACT III card → Mission 15 in the capital's lower
// city (Aren's 「지켜라」 on the deployment bar, seven heroes, the clerks and the neutral watch) → the records choice in the
// camp → Mission 16 in fog (hidden enemy sheet, the duel modal on TURN 3) → a returning recruit rejoins and the ward-stone
// choice. 1440×900 and 390×844 touch. Screenshots: docs/v0.9.0/screenshots/act3.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory,enterWarCouncil} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {newGame,startBattle,beginEnemyPhase,advanceEnemy,nextMission} from '../src/core/game.js';import {findUnit,fogHidden} from '../src/core/rules.js';
import {departRoster} from '../src/core/mission-rules-v071.js';import {enterHub} from '../src/core/frontier.js';import {drain} from './campaign-policy.mjs';
const url=pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.9.1.html').href,shots='docs/v0.9.0/screenshots/act3';fs.mkdirSync(shots,{recursive:true});fs.mkdirSync('test-output',{recursive:true});
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});let n=0;const results=[];const check=(name,ok)=>{assert.ok(ok,name);n++;results.push(name);console.log('PASS',name);};
const camp14=JSON.parse(fs.readFileSync('tests/fixtures/v081/v081-m14-camp.json','utf8')).save;
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
// M15 won with all three boxes, back in the camp (aftermath, before the records choice).
function m15Won(){const s=nextMission(deserialize(camp14));s.screen='deployment';startBattle(s);drain(s);s.missionState.secured.push('c1','c2','c3');for(const id of ['c1','c2','c3'])findUnit(s,id).hp=0;enemyPhase(s);enterHub(s,{aftermath:true});drain(s);return s;}
// M16 with Thea who left after the summit (kept aside), at the start of TURN 3 with the duel open.
function m16Duel(){const c=deserialize(camp14);departRoster(c,'thea');const a=m15From(c);const s=nextMission(a);s.screen='deployment';startBattle(s);drain(s);for(let i=0;i<2;i++)enemyPhase(s);return s;}
function m15From(c){const s=nextMission(c);s.screen='deployment';startBattle(s);drain(s);s.missionState.secured.push('c1','c2','c3');for(const id of ['c1','c2','c3'])findUnit(s,id).hp=0;enemyPhase(s);s.campaign.choices.m15_records='keep';return s;}
function m16Won(){const s=m16Duel();s.duel.result='skipped';for(const h of s.units.filter(u=>u.kind==='harvester'))h.hp=0;enemyPhase(s);enterHub(s,{aftermath:true});drain(s);return s;}
try{
 for(const [label,viewport,touch] of [['1440',{width:1440,height:900},false],['390',{width:390,height:844},true]]){
  const ctx=await b.newContext({viewport,hasTouch:touch,isMobile:touch,deviceScaleFactor:touch?2:1});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const press=async(a,id)=>{const el=p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first();touch?await el.tap():await el.click();await p.waitForTimeout(250);};
  const restore=async s=>{await drainStory(p);await press('menu');await press('backup');await p.fill('#backup-text',typeof s==='string'?s:serialize(s));await press('restore');await p.waitForTimeout(400);};
  const snap=()=>p.evaluate(()=>AshenCrown.snapshot());const body=async()=>(await p.locator('body').textContent())||'';
  const closeModals=async()=>{for(let i=0;i<4&&await p.locator('#modal-root .modal').count();i++){await press('close-modal');await drainStory(p);}};
  await p.goto(url);await press('new');await drainStory(p);
  // 1. a real v0.8.1 save → ACT III
  await restore(camp14);await drainStory(p);await closeModals();
  check(`${label} the v0.8.1 summit camp offers Mission 15`,(await p.locator('[data-do="next-mission"]').first().textContent()).includes('Mission 15'));
  await press('next-mission');let s=await snap();
  check(`${label} the ACT III card plays on the world map before the capital`,s.narrative.active?.key==='world:capital'||s.narrative.seen.includes('world:capital'));
  await drainStory(p);s=await snap();check(`${label} M15 preparation in the capital's lower city (temporary Velmar painting, dusk)`,s.missionId===15&&s.frontier.hub==='capital'&&s.narrative.seen.includes('pre:15'));
  await p.screenshot({path:`${shots}/capital-m15-${label}.png`});
  await enterWarCouncil(p,touch);await press('deploy');await p.waitForTimeout(300);
  check(`${label} the deployment bar carries Aren's command 「지켜라」 (on by default)`,(await p.locator('[data-do="aren-command"]').first().textContent()).includes('지켜라'));
  await press('aren-command');s=await snap();check(`${label} the command can be dropped`,s.command===null&&(await p.locator('[data-do="aren-command"]').first().textContent()).includes('군령 없음'));
  await press('aren-command');s=await snap();check(`${label} and given again`,s.command==='hold');
  await p.screenshot({path:`${shots}/deploy-command-${label}.png`});
  await press('start-battle');await drainStory(p);s=await snap();
  check(`${label} M15 battle: seven heroes, three clerks, the watch as civilians, the archivist`,s.screen==='battle'&&s.units.filter(u=>u.team==='ally'&&!u.benched).length===7&&s.units.filter(u=>u.clerk).length===3&&s.units.filter(u=>u.watch&&u.team==='civilian').length===3&&s.units.some(u=>u.id==='archivist'));
  check(`${label} the objective panel shows boxes, the watch and the archivist`,(await body()).includes('상자 확보 0/3')&&(await body()).includes('경비대 중립'));
  await p.screenshot({path:`${shots}/m15-battle-${label}.png`});
  // 2. the records choice after M15
  await restore(m15Won());await drainStory(p);for(let i=0;i<3&&!(await p.locator('[data-do="records15-pick"]').count());i++){await closeModals();await press('next-mission');await p.waitForTimeout(300);}
  check(`${label} after M15 the camp asks what to do with the records (three ways)`,await p.locator('[data-do="records15-pick"]').count()===3);
  await p.screenshot({path:`${shots}/records15-choice-${label}.png`});
  await press('records15-pick','post');await drainStory(p);s=await snap();check(`${label} the records are posted in the lower city and the scene follows`,s.campaign.choices.m15_records==='post'&&s.narrative.seen.includes('after:15:post'));
  // 3. M16 in fog with the duel open
  await restore(m16Duel());await drainStory(p);s=await snap();
  check(`${label} M16 TURN 3: the duel is open and Thea, who left, fights beside the legion`,s.missionId===16&&s.turn===3&&!!s.duel&&!s.duel.result&&s.units.some(u=>u.id==='rthea'&&!u.benched&&u.team==='allied'));
  check(`${label} the duel modal offers strike, guard and finisher (and refusing)`,await p.locator('[data-do="duel-pick"]').count()===4);
  await p.screenshot({path:`${shots}/duel-${label}.png`});
  for(let i=0;i<3&&await p.locator('[data-do="duel-pick"][data-id="strike"]').count();i++){await press('duel-pick','strike');await p.waitForTimeout(200);}
  await drainStory(p);s=await snap();check(`${label} the duel is decided and the battle goes on`,['hero','foe'].includes(s.duel.result)&&!(await p.locator('[data-do="duel-pick"]').count()));
  const hidden=s.units.find(u=>u.team==='enemy'&&u.hp>0&&!u.benched&&fogHidden(s,u));
  if(hidden){await p.evaluate(id=>document.querySelector('[data-do="unit-info"]')?null:null,hidden.id);}
  check(`${label} the fog: the map is hazed and a far enemy is hidden`,!!hidden);
  await p.screenshot({path:`${shots}/m16-fog-${label}.png`});
  // 4. M16 won: Thea rejoins, the ward-stone choice
  await restore(m16Won());await drainStory(p);s=await snap();
  check(`${label} after M16 Thea is back in the legion and her scene plays in the field camp`,s.frontier.hub==='fieldcamp'&&s.campaign.roster.includes('thea')&&s.narrative.seen.includes('after:16:return:thea'));
  for(let i=0;i<3&&!(await p.locator('[data-do="stones16-pick"]').count());i++){await closeModals();await press('next-mission');await p.waitForTimeout(300);}
  check(`${label} the camp asks what to do with the ward stones`,await p.locator('[data-do="stones16-pick"]').count()===2);
  await p.screenshot({path:`${shots}/stones16-choice-${label}.png`});
  await press('stones16-pick','break');await drainStory(p);s=await snap();check(`${label} the stones are broken; the next step is the guardians' keep (M17, a later update)`,s.campaign.choices.m16_stones==='break'&&s.narrative.seen.includes('after:16:next'));
  await p.screenshot({path:`${shots}/fieldcamp-${label}.png`});
  check(`${label} no horizontal overflow`,await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  check(`${label} no runtime errors`,errors.length===0);await ctx.close();
 }
}finally{await b.close();}
fs.writeFileSync('test-output/act3-e2e.json',JSON.stringify({checks:n,results},null,1));console.log(`act3-e2e: ${n} checks passed`);
