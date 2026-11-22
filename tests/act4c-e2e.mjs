// v0.10.2 in the browser: a real v0.10.1 save (the oath camp after M26, Baldrick in the legion) → the world card and the
// lower city → M27 (eight of nine heroes, the ram, the gate, three ladders, the banner squads) → the gate's last blow with two
// sections held wins → Mission 28 → M28 (young Aren takes orders; 기억 보기 beside a fragment opens the night; Aren's last
// order 「끝까지 함께」 raises a fallen hero) → after the win Aren's confession (two ways) → the hero sheet tells M27–M28.
// 1440×900 and 390×844 touch. Screenshots: docs/v0.10.2/screenshots/act4c.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory,enterWarCouncil} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {startBattle,beginEnemyPhase,advanceEnemy,nextMission} from '../src/core/game.js';
import {enterHub} from '../src/core/frontier.js';import {drain} from './campaign-policy.mjs';
const url=pathToFileURL(process.cwd()+'/build/Ashen_Crown.html').href,shots='docs/v0.10.2/screenshots/act4c';fs.mkdirSync(shots,{recursive:true});fs.mkdirSync('test-output',{recursive:true});
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});let n=0;const results=[];const check=(name,ok)=>{assert.ok(ok,name);n++;results.push(name);console.log('PASS',name);};
const camp26=JSON.parse(fs.readFileSync('tests/fixtures/v0101/v0101-m26-camp.json','utf8')).save;
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
function ready(){const s=deserialize(camp26);for(const h of s.campaign.heroes){h.hp=h.maxHP;h.mp=h.maxMP;h.xp=0;}return deserialize(serialize(s));}
function m27(){const s=nextMission(ready());s.screen='deployment';startBattle(s);drain(s);return s;}
// The gate at its third blow next turn: two sections held, the ram at the gate with Erik beside it, the field quiet.
function m27Last(){const s=m27();for(const u of s.units.filter(u=>u.team==='enemy'))u.hp=0;s.missionState.sections=[true,false,true];s.missionState.gate=2;const r=s.units.find(u=>u.id==='ram'),e=s.units.find(u=>u.id==='eric');r.x=8;r.y=6;e.x=7;e.y=6;return deserialize(serialize(s));} /* v2.5.1: the big M27 gate (ramRow 6) */
function m27Won(){const s=m27Last();enemyPhase(s);enterHub(s,{aftermath:true});drain(s);return s;}
function m28(){const s=nextMission(m27Won());s.screen='deployment';startBattle(s);drain(s);return s;}
// Lia beside the oath fragment; Kai fallen (for the last order).
function m28Ready(){const s=m28(),l=s.units.find(u=>u.id==='lia');l.x=5;l.y=10;l.moved=l.acted=false; /* v2.5.1: beside the oath fragment in the big palace's west wing */const k=s.units.find(u=>u.id==='kai');if(k)k.hp=0;return deserialize(serialize(s));}
function m28Won(){const s=m28();for(const u of s.units.filter(u=>u.team==='ally'))u.hp=u.maxHP=999;for(const o of s.units.filter(o=>o.kind==='memory')){o.inert=true;s.missionState.found.push(o.memory);}s.missionState.dawnFrom=s.turn;enemyPhase(s);enemyPhase(s);enterHub(s,{aftermath:true});drain(s);return s;}
try{
 for(const [label,viewport,touch] of [['1440',{width:1440,height:900},false],['390',{width:390,height:844},true]]){
  const ctx=await b.newContext({viewport,hasTouch:touch,isMobile:touch,deviceScaleFactor:touch?2:1});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const press=async(a,id)=>{const el=p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first();touch?await el.tap():await el.click();await p.waitForTimeout(250);};
  const restore=async s=>{await drainStory(p);if(await p.locator('#modal-root .modal').count()&&await p.locator('#modal-root [data-do="close-modal"]').count())await press('close-modal');await press('menu');{const bk=p.locator('#modal-root [data-do="backup"]').first();touch?await bk.tap():await bk.click();await p.waitForTimeout(250);}await p.fill('#backup-text',typeof s==='string'?s:serialize(s));await press('restore');await p.waitForTimeout(400);};
  const snap=()=>p.evaluate(()=>AshenCrown.snapshot());const body=async()=>(await p.locator('body').textContent())||'';const modal=async()=>(await p.locator('#modal-root').textContent())||'';
  const closeModals=async()=>{for(let i=0;i<4&&await p.locator('#modal-root [data-do="close-modal"]').count();i++){await press('close-modal');await drainStory(p);}};
  const tile=async(x,y)=>{await p.waitForTimeout(250);if(await p.locator('[data-do="reset-camera"]').isVisible()){ /* v2.5.1: the big maps can sit off screen at 1440 too */const off=await p.evaluate(([x,y])=>{const c=window.AshenCrown.tileCenter(x,y),r=document.querySelector('#battle-map').getBoundingClientRect();return c.x<0||c.y<0||c.x>r.width||c.y>r.height;},[x,y]);if(off){touch?await p.locator('[data-do="reset-camera"]').first().tap():await p.locator('[data-do="reset-camera"]').first().click();await p.waitForTimeout(300);}}const pt=await p.evaluate(([x,y])=>{const c=window.AshenCrown.tileCenter(x,y),r=document.querySelector('#battle-map').getBoundingClientRect();return {x:c.x+r.x,y:c.y+r.y};},[x,y]);touch?await p.touchscreen.tap(pt.x,pt.y):await p.mouse.click(pt.x,pt.y);await p.waitForTimeout(250);};
  const select=async u=>{await p.waitForFunction(()=>!AshenCrown.view().busy,{},{timeout:30000});if(await p.locator('[data-do="close-unit-menu"]').count())await press('close-unit-menu');await tile(u.x,u.y);if((await p.evaluate(()=>AshenCrown.view().selected))!==u.id)await tile(u.x,u.y);if(!await p.locator('[data-do="submenu"][data-id="skills"]').count())await press('open-unit-menu');};
  await p.goto(url);await press('new');await drainStory(p);
  // 1. the real v0.10.1 oath camp offers Mission 27; the world card; the lower city with Baldrick
  await restore(camp26);await drainStory(p);await closeModals();let s=await snap();
  check(`${label} the v0.10.1 oath camp (after M26, nine heroes) offers Mission 27`,s.schema===27&&s.frontier.hub==='oathcamp'&&s.campaign.roster.includes('baldrick')&&(await p.locator('[data-do="next-mission"]').first().textContent()).includes('Mission 27'));
  await press('next-mission');await p.waitForTimeout(400);let card=false;for(let i=0;i<40;i++){if((await body()).includes('왕도의 성문')){card=true;await p.screenshot({path:`${shots}/royalgate-card-${label}.png`});break;}if(!(await snap()).narrative.active)break;await p.keyboard.press('Enter').catch(()=>{});await p.waitForTimeout(150);}
  await drainStory(p);await closeModals();s=await snap();check(`${label} the world card of the royal gate and the lower city`,(card||s.narrative.seen.includes('world:royalgate'))&&s.frontier.hub==='capital'&&s.missionId===27);
  await p.screenshot({path:`${shots}/lowercity-${label}.png`});
  await enterWarCouncil(p,touch);await press('deploy');await p.waitForTimeout(300);s=await snap();check(`${label} the sortie is eight of nine heroes`,s.units.filter(u=>u.team==='ally'&&!['bram','noa','marta','rowell'].includes(u.id)).length===9&&s.units.filter(u=>u.team==='ally'&&!u.benched).length===8&&s.units.filter(u=>['bram','noa','marta','rowell'].includes(u.id)).every(u=>u.benched)); /* v2.0.0: the four officers wait on the bench */
  await press('start-battle');await drainStory(p);s=await snap();
  // 2. M27: two fronts
  check(`${label} M27: the ram on the road, the gate's two leaves, three ladders; squads by trust (${s.missionState.squads.join('/')||'none'})`,s.screen==='battle'&&s.units.some(u=>u.id==='ram'&&u.hp>0)&&s.units.filter(u=>u.kind==='gateLeaf'&&!u.benched).length===2&&s.missionState.sections.length===3&&s.units.filter(u=>u.banner27&&!u.absent).length===2*s.missionState.squads.length);
  check(`${label} the objective panel counts the gate's blows and the wall's sections`,(await body()).includes('성문 0/3')&&(await body()).includes('성벽 0/2'));
  await press('reset-camera');await p.waitForTimeout(300);await p.screenshot({path:`${shots}/m27-field-${label}.png`});
  await restore(m27Last());await drainStory(p);await press('end-phase');if(await p.locator('[data-do="confirm-phase"]').count())await press('confirm-phase');for(let i=0;i<80&&!(await snap()).outcome;i++)await p.waitForTimeout(200);await drainStory(p);s=await snap();
  check(`${label} the gate's third blow with two sections held wins M27`,s.outcome==='victory'&&s.missionState.broken&&s.campaign.flags.mission_27_sections===2);await p.screenshot({path:`${shots}/m27-won-${label}.png`});
  // 3. M28: inside the memory
  const m=m28Ready();await restore(m);await drainStory(p);s=await snap();
  check(`${label} M28: the Ashen Night's palace — thirteen remnants (v2.5.1), three fragments, young Aren as an ally`,s.screen==='battle'&&s.missionId===28&&s.units.filter(u=>u.remnant).length===13&&s.units.filter(u=>u.kind==='memory').length===3&&s.units.find(u=>u.id==='aren')?.team==='allied');
  check(`${label} the objective panel counts the fragments`,(await body()).includes('기억 조각 0/3'));
  await press('reset-camera');await p.waitForTimeout(300);await p.screenshot({path:`${shots}/m28-field-${label}.png`});
  const ar=m.units.find(u=>u.id==='aren');await tile(ar.x,ar.y);await p.waitForTimeout(300);check(`${label} young Aren takes orders`,(await modal()).includes('동맹군 지시'));await closeModals();if(await p.locator('[data-do="close-unit-menu"]').count())await press('close-unit-menu');
  const lia=m.units.find(u=>u.id==='lia');await select(lia);
  check(`${label} beside a fragment the menu offers 기억 보기, and Aren's last order is offered for the fallen Kai`,await p.locator('[data-do="mode"][data-id="search"]').count()===1&&(await p.locator('#unit-popover').textContent()).includes('기억 보기')&&(await p.locator('[data-do="last-order"]').count())===1);
  check(`${label} the order's button carries its painted icon (pack G3)`,(await p.locator('[data-do="last-order"] .cmd-icon img.painted').count())===1);await p.screenshot({path:`${shots}/m28-lastorder-${label}.png`});
  await press('last-order');await p.waitForTimeout(300);s=await snap();check(`${label} 「끝까지 함께」 is given (once a battle)`,s.lastOrder?.hero==='kai'&&s.lastOrder.risen===false);
  await select(lia);await press('mode','search');const frag=m.units.find(u=>u.id==='mem1');await tile(frag.x,frag.y);await p.waitForTimeout(300);if(await p.locator('[data-do="confirm"]').count())await press('confirm');await p.waitForTimeout(500);
  let scene=false;for(let i=0;i<60;i++){const t=await body();if(t.includes('강요된 맹세')||t.includes('징집')){scene=true;await p.screenshot({path:`${shots}/m28-memory-${label}.png`});break;}if(!(await snap()).narrative.active)break;await p.keyboard.press('Enter').catch(()=>{});await p.waitForTimeout(150);}
  await drainStory(p);s=await snap();check(`${label} the oath fragment opens its scene (the forced oaths) and counts 1/3`,(scene||s.narrative.seen.includes('28:memory:oath'))&&s.missionState.found.includes('oath')&&(await body()).includes('기억 조각 1/3'));
  // 4. after the night: Aren's confession
  await restore(m28Won());await drainStory(p);for(let i=0;i<3&&!(await p.locator('[data-do="confession28-pick"]').count());i++){await closeModals();await p.waitForTimeout(300);}
  check(`${label} after M28 Aren asks to whom he should confess (two ways)`,await p.locator('[data-do="confession28-pick"]').count()===2);
  await p.screenshot({path:`${shots}/confession28-${label}.png`});await press('confession28-pick','all');await drainStory(p);await p.waitForTimeout(300);s=await snap();
  check(`${label} the confession is kept and its scene plays`,s.campaign.choices.m28_confession==='all'&&s.narrative.seen.includes('after:28:all'));
  // 5. the hero sheet tells the new chapters
  await closeModals();await press('hero-roster');await p.waitForTimeout(250);await press('unit-info','eric|bio');await p.waitForTimeout(250);const sheet=await modal();
  check(`${label} Erik's 열전 tells M27 and M28`,sheet.includes('M27')&&sheet.includes('M28')&&sheet.includes('잿빛 밤의 궁'));await p.screenshot({path:`${shots}/eric-lore-${label}.png`});await closeModals();
  check(`${label} no page errors`,errors.length===0);
  await ctx.close();}
 fs.writeFileSync('test-output/act4c-e2e.json',JSON.stringify({suite:'act4c-e2e',passed:n,results},null,1));console.log(`act4c-e2e: ${n} checks passed`);
}finally{await b.close();}
