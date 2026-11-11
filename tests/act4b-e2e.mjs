// v0.10.1 in the browser: a real v0.10.0 save (the Ashen Village after M24) → the world card and the summit field → M25 (the
// north camp of the M14 betrayer's hardliners, the west and east camps by trust — allied takes orders, neutral does not) →
// after the win the betrayed banner (two ways) → Mission 26 → M26 (the duel modal on TURN 2, Erik's 설득 beside Baldrick at
// resolve 3 → he yields and joins) → Baldrick in the legion with ①–④, the camp below the pass → Dario's ④ in the menu.
// 1440×900 and 390×844 touch. Screenshots: docs/v0.10.1/screenshots/act4b.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory,enterWarCouncil} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {startBattle,beginEnemyPhase,advanceEnemy,nextMission,newGame} from '../src/core/game.js';
import {enterHub} from '../src/core/frontier.js';import {chooseBanner25} from '../src/core/mission-rules-v0101.js';import {drain} from './campaign-policy.mjs';
const url=pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.10.1.html').href,shots='docs/v0.10.1/screenshots/act4b';fs.mkdirSync(shots,{recursive:true});fs.mkdirSync('test-output',{recursive:true});
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});let n=0;const results=[];const check=(name,ok)=>{assert.ok(ok,name);n++;results.push(name);console.log('PASS',name);};
const camp24=JSON.parse(fs.readFileSync('tests/fixtures/v0100/v0100-m24-camp.json','utf8')).save;
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
function ready(){const s=deserialize(camp24);for(const h of s.campaign.heroes){h.hp=h.maxHP;h.mp=h.maxMP;h.xp=0;}s.campaign.flags.mission_13_baldrick='halted';return deserialize(serialize(s));}
function m25Won(){const s=nextMission(ready());s.screen='deployment';startBattle(s);drain(s);for(const u of s.units.filter(u=>u.camp==='north'))u.hp=0;s.missionState.captain=true;enemyPhase(s);enterHub(s,{aftermath:true});drain(s);return s;}
function m26(){const s=m25Won();chooseBanner25(s,'lower');const t=nextMission(s);t.screen='deployment';startBattle(t);drain(t);return t;}
// M26 on TURN 2 with the duel open (every rider down, Baldrick still).
function m26Duel(){const s=m26();for(const u of s.units.filter(u=>u.team==='enemy'&&u.id!=='boss'))u.hp=0;const bo=s.units.find(u=>u.id==='boss');bo.mov=0;bo.atk=0;enemyPhase(s);return deserialize(serialize(s));}
// Erik beside Baldrick at resolve 3 (the duel settled).
function m26Persuade(){const s=m26Duel();if(s.duel&&!s.duel.result)s.duel.result='skipped';s.missionState.duelCounted=true;s.missionState.resolve=3;const bo=s.units.find(u=>u.id==='boss'),e=s.units.find(u=>u.id==='eric');
 for(const [dx,dy] of [[0,1],[1,0],[-1,0]]){if(!s.units.some(o=>o.hp>0&&!o.benched&&o.x===bo.x+dx&&o.y===bo.y+dy)){e.x=bo.x+dx;e.y=bo.y+dy;break;}}e.moved=e.acted=false;return deserialize(serialize(s));}
try{
 for(const [label,viewport,touch] of [['1440',{width:1440,height:900},false],['390',{width:390,height:844},true]]){
  const ctx=await b.newContext({viewport,hasTouch:touch,isMobile:touch,deviceScaleFactor:touch?2:1});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const press=async(a,id)=>{const el=p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first();touch?await el.tap():await el.click();await p.waitForTimeout(250);};
  const restore=async s=>{await drainStory(p);if(await p.locator('#modal-root .modal').count()&&await p.locator('#modal-root [data-do="close-modal"]').count())await press('close-modal');await press('menu');{const bk=p.locator('#modal-root [data-do="backup"]').first();touch?await bk.tap():await bk.click();await p.waitForTimeout(250);}await p.fill('#backup-text',typeof s==='string'?s:serialize(s));await press('restore');await p.waitForTimeout(400);};
  const snap=()=>p.evaluate(()=>AshenCrown.snapshot());const body=async()=>(await p.locator('body').textContent())||'';const modal=async()=>(await p.locator('#modal-root').textContent())||'';
  const closeModals=async()=>{for(let i=0;i<4&&await p.locator('#modal-root [data-do="close-modal"]').count();i++){await press('close-modal');await drainStory(p);}};
  const tile=async(x,y)=>{await p.waitForTimeout(250);if(touch&&await p.locator('[data-do="reset-camera"]').isVisible()){const off=await p.evaluate(([x,y])=>{const c=window.AshenCrown.tileCenter(x,y),r=document.querySelector('#battle-map').getBoundingClientRect();return c.x<0||c.y<0||c.x>r.width||c.y>r.height;},[x,y]);if(off){await p.locator('[data-do="reset-camera"]').first().tap();await p.waitForTimeout(300);}}const pt=await p.evaluate(([x,y])=>{const c=window.AshenCrown.tileCenter(x,y),r=document.querySelector('#battle-map').getBoundingClientRect();return {x:c.x+r.x,y:c.y+r.y};},[x,y]);touch?await p.touchscreen.tap(pt.x,pt.y):await p.mouse.click(pt.x,pt.y);await p.waitForTimeout(250);};
  const select=async u=>{await p.waitForFunction(()=>!AshenCrown.view().busy,{},{timeout:30000});if(await p.locator('[data-do="close-unit-menu"]').count())await press('close-unit-menu');await tile(u.x,u.y);if((await p.evaluate(()=>AshenCrown.view().selected))!==u.id)await tile(u.x,u.y);if(!await p.locator('[data-do="submenu"][data-id="skills"]').count())await press('open-unit-menu');};
  await p.goto(url);await press('new');await drainStory(p);
  // 1. the real v0.10.0 Ashen Village offers Mission 25; the world card; the summit field
  await restore(camp24);await drainStory(p);await closeModals();let s=await snap();
  check(`${label} the v0.10.0 Ashen Village (after M24) offers Mission 25`,s.schema===17&&s.frontier.hub==='village_raid'&&(await p.locator('[data-do="next-mission"]').first().textContent()).includes('Mission 25'));
  await press('next-mission');await p.waitForTimeout(400);let card=false;for(let i=0;i<40;i++){if((await body()).includes('세 깃발의 땅')){card=true;await p.screenshot({path:`${shots}/banners-card-${label}.png`});break;}if(!(await snap()).narrative.active)break;await p.keyboard.press('Enter').catch(()=>{});await p.waitForTimeout(150);}
  await drainStory(p);await closeModals();s=await snap();check(`${label} the world card of the three banners and the summit camp`,(card||s.narrative.seen.includes('world:banners'))&&s.frontier.hub==='summit'&&s.missionId===25);
  await enterWarCouncil(p,touch);await press('deploy');await p.waitForTimeout(300);await press('start-battle');await drainStory(p);s=await snap();
  // 2. M25: three camps by trust
  const st=s.missionState,allied=['lw','le'].filter(id=>s.units.find(u=>u.id===id).team==='allied'),neutral=['lw','le'].filter(id=>s.units.find(u=>u.id===id).neutral);
  check(`${label} M25: the M14 betrayer holds the north camp; the other two camps stand by trust (allied ${allied.length}, neutral ${neutral.length})`,s.screen==='battle'&&st.camps.north===s.campaign.flags.mission_14_betrayer&&allied.length+neutral.length===2&&s.units.filter(u=>u.team==='ally'&&!u.benched).length===7);
  check(`${label} the objective panel names the camps and counts the leaders`,(await body()).includes('강경파 대장')&&(await body()).includes('지도자 2/2'));
  await press('reset-camera');await p.waitForTimeout(300);await p.screenshot({path:`${shots}/m25-field-${label}.png`});
  if(allied.length){const l=s.units.find(u=>u.id===allied[0]);await tile(l.x,l.y);await p.waitForTimeout(300);check(`${label} an allied leader takes orders`,(await modal()).includes('동맹군 지시'));await closeModals();}
  if(neutral.length){const l=s.units.find(u=>u.id===neutral[0]);await tile(l.x,l.y);await p.waitForTimeout(300);check(`${label} a neutral leader takes no orders`,!(await modal()).includes('동맹군 지시'));await closeModals();if(await p.locator('[data-do="close-unit-menu"]').count())await press('close-unit-menu');}
  // 3. M25 won: the betrayed banner
  await restore(m25Won());await drainStory(p);for(let i=0;i<3&&!(await p.locator('[data-do="banner25-pick"]').count());i++){await closeModals();await press('next-mission');await p.waitForTimeout(300);}
  check(`${label} after M25 the camp asks what becomes of the betrayed banner (two ways)`,await p.locator('[data-do="banner25-pick"]').count()===2);
  await p.screenshot({path:`${shots}/banner25-choice-${label}.png`});await press('banner25-pick','forgive');await drainStory(p);await p.waitForTimeout(300);s=await snap();
  check(`${label} the choice is kept and its scene plays; Mission 26 is next`,s.campaign.choices.m25_banner==='forgive'&&s.narrative.seen.includes('after:25:forgive')&&(await p.locator('[data-do="next-mission"]').first().textContent()).includes('Mission 26'));
  // 4. M26: the duel on TURN 2
  await restore(m26Duel());await p.waitForTimeout(300);
  check(`${label} M26 TURN 2: Baldrick calls Erik to a duel (strike, guard, finisher, refuse)`,await p.locator('[data-do="duel-pick"]').count()===4);
  await p.screenshot({path:`${shots}/m26-duel-${label}.png`});for(let i=0;i<3&&await p.locator('[data-do="duel-pick"][data-id="strike"]').count();i++){await press('duel-pick','strike');await p.waitForTimeout(200);}
  await drainStory(p);s=await snap();check(`${label} the duel is decided (a win is two of resolve)`,['hero','foe'].includes(s.duel.result)&&(s.duel.result==='hero'?s.missionState.resolve>=2:true));
  // 5. Erik persuades at resolve 3: Baldrick yields and joins
  const pr=m26Persuade();await restore(pr);await drainStory(p);const e=pr.units.find(u=>u.id==='eric');await select(e);
  check(`${label} Erik beside Baldrick: the battle menu offers 설득`,await p.locator('[data-do="mode"][data-id="persuade"]').count()===1);
  await press('mode','persuade');const bo=pr.units.find(u=>u.id==='boss');await tile(bo.x,bo.y);await p.waitForTimeout(300);if(await p.locator('[data-do="confirm"]').count())await press('confirm');await p.waitForTimeout(600);await drainStory(p);s=await snap();
  check(`${label} resolve 4: Baldrick yields and joins the legion (the ninth hero, Lv 19, tier 3)`,s.outcome==='victory'&&s.missionState.outcome==='join'&&s.campaign.roster.includes('baldrick')&&s.campaign.heroes.find(h=>h.id==='baldrick')?.classTier===3);
  await p.screenshot({path:`${shots}/m26-yield-${label}.png`});
  // 6. the camp below the pass; Baldrick's four skills
  const won=deserialize(serialize(s));enterHub(won,{aftermath:true});drain(won);won.screen='exploration';drain(won);await restore(deserialize(serialize(won)));await drainStory(p);await closeModals();s=await snap();
  check(`${label} the camp below the lion's pass, Baldrick standing in it`,s.screen==='exploration'&&s.frontier.hub==='oathcamp'&&s.campaign.roster.includes('baldrick'));await p.screenshot({path:`${shots}/lion-camp-${label}.png`});
  const t=newGame(100,structuredClone(s.campaign),26);t.screen='deployment';startBattle(t);drain(t);const bu=t.units.find(u=>u.id==='baldrick');const du=t.units.find(u=>u.id==='dario');
  for(const u of [bu,du]){if(!u)continue;u.benched=false;u.classTier=3;u.mp=u.maxMP;u.moved=u.acted=false;}
  const out=t.units.filter(u=>u.team==='ally'&&!u.benched&&!['eric','baldrick','dario'].includes(u.id));for(const u of out.slice(0,Math.max(0,t.units.filter(u=>u.team==='ally'&&!u.benched).length-7)))u.benched=true;
  await restore(deserialize(serialize(t)));await drainStory(p);await select(bu);await press('submenu','skills');let menu=await p.locator('#unit-popover').textContent();
  check(`${label} Baldrick's skills ①–④: Lion Strike, 사자의 포효, 사자의 깃발, 검은 사자의 결의`,['① Lion Strike','② 사자의 포효','③ 사자의 깃발','④ 검은 사자의 결의'].every(k=>menu.includes(k))); /* D-106: the menu shows names only; ① keeps its English name like every hero's ① */await p.screenshot({path:`${shots}/baldrick-skills-${label}.png`});
  if(du){await press('close-unit-menu');await select(du);await press('submenu','skills');menu=await p.locator('#unit-popover').textContent();check(`${label} Dario awakened shows ④ 백 번의 반격`,menu.includes('④')&&menu.includes('백 번의 반격'));}
  check(`${label} no page errors`,errors.length===0);
  await ctx.close();}
 fs.writeFileSync('test-output/act4b-e2e.json',JSON.stringify({suite:'act4b-e2e',passed:n,results},null,1));console.log(`act4b-e2e: ${n} checks passed`);
}finally{await b.close();}
