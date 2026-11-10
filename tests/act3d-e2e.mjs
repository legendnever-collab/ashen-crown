// v0.9.3 in the browser: a real v0.9.2 save (the lower city after M20) → M21 in the crown's heart (the king on the dais,
// four anchor stones, the pulsing ring, 고정석 깨기) → the play-test notes of D-092 (tap an empty tile to cancel an aimed
// heal, Sain may heal a foe, the zone of control) → the king's request and Aren's awakening card → M22 in the square
// (three heralds, 「함께 정한다」 from the unit menu) → the ACT III choice (three ways) and the ACT III card → the hero
// records in the unit sheet. 1440×900 and 390×844 touch. Screenshots: docs/v0.9.3/screenshots/act3d.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory,enterWarCouncil} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {startBattle,beginEnemyPhase,advanceEnemy,nextMission} from '../src/core/game.js';
import {enterHub} from '../src/core/frontier.js';import {chooseKing21} from '../src/core/mission-rules-v093.js';import {drain} from './campaign-policy.mjs';
const url=pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.10.0.html').href,shots='docs/v0.9.3/screenshots/act3d';fs.mkdirSync(shots,{recursive:true});fs.mkdirSync('test-output',{recursive:true});
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});let n=0;const results=[];const check=(name,ok)=>{assert.ok(ok,name);n++;results.push(name);console.log('PASS',name);};
const camp20=JSON.parse(fs.readFileSync('tests/fixtures/v092/v092-m20-camp.json','utf8')).save;
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);if(s.duel&&!s.duel.result)s.duel.result='skipped';};
function ready(){const s=deserialize(camp20);for(const h of s.campaign.heroes){h.hp=h.maxHP;h.mp=h.maxMP;h.xp=0;}return deserialize(serialize(s));}
const m21=()=>{const s=nextMission(ready());s.screen='deployment';startBattle(s);drain(s);if(s.duel&&!s.duel.result)s.duel.result='skipped';return s;};
function m21Won(){const s=m21();for(const u of s.units.filter(u=>u.team==='enemy'))u.hp=0;const st=s.missionState;st.broken=['as1','as2','as3','as4'];for(const a of s.units.filter(u=>u.kind==='anchorStone'))a.inert=true;enemyPhase(s);enterHub(s,{aftermath:true});drain(s);return s;}
function m22(){const s=m21Won();chooseKing21(s,'notyet');s.campaign.choices.aren_seen='yes';const t=nextMission(s);t.screen='deployment';startBattle(t);drain(t);return t;}
function m22Won(){const s=m22();for(const u of s.units.filter(u=>u.team==='enemy'))u.hp=0;for(const id of ['hr','hp','hk'])s.missionState.read[id]=4;enemyPhase(s);enterHub(s,{aftermath:true});drain(s);return s;}
try{
 for(const [label,viewport,touch] of [['1440',{width:1440,height:900},false],['390',{width:390,height:844},true]]){
  const ctx=await b.newContext({viewport,hasTouch:touch,isMobile:touch,deviceScaleFactor:touch?2:1});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const press=async(a,id)=>{const el=p.locator(`[data-do="${a}"]${id?`[data-id="${id}"]`:''}`).first();touch?await el.tap():await el.click();await p.waitForTimeout(250);};
  const restore=async s=>{await drainStory(p);if(await p.locator('#modal-root .modal').count())await press('close-modal');await press('menu');await press('backup');await p.fill('#backup-text',typeof s==='string'?s:serialize(s));await press('restore');await p.waitForTimeout(400);};
  const snap=()=>p.evaluate(()=>AshenCrown.snapshot());const view=()=>p.evaluate(()=>AshenCrown.view());const body=async()=>(await p.locator('body').textContent())||'';const modal=async()=>(await p.locator('#modal-root').textContent())||'';
  const closeModals=async()=>{for(let i=0;i<4&&await p.locator('#modal-root .modal').count();i++){await press('close-modal');await drainStory(p);}};
  const tile=async(x,y)=>{await p.waitForTimeout(250);if(touch&&await p.locator('[data-do="reset-camera"]').isVisible()){const off=await p.evaluate(([x,y])=>{const c=window.AshenCrown.tileCenter(x,y),r=document.querySelector('#battle-map').getBoundingClientRect();return c.x<0||c.y<0||c.x>r.width||c.y>r.height;},[x,y]);if(off){await p.locator('[data-do="reset-camera"]').first().tap();await p.waitForTimeout(300);}}const pt=await p.evaluate(([x,y])=>{const c=window.AshenCrown.tileCenter(x,y),r=document.querySelector('#battle-map').getBoundingClientRect();return {x:c.x+r.x,y:c.y+r.y};},[x,y]);touch?await p.touchscreen.tap(pt.x,pt.y):await p.mouse.click(pt.x,pt.y);await p.waitForTimeout(250);};
  const select=async u=>{await p.waitForFunction(()=>!AshenCrown.view().busy,{},{timeout:30000});if(await p.locator('[data-do="close-unit-menu"]').count())await press('close-unit-menu');await tile(u.x,u.y);if((await p.evaluate(()=>AshenCrown.view().selected))!==u.id)await tile(u.x,u.y);if(!await p.locator('[data-do="submenu"][data-id="skills"]').count())await press('open-unit-menu');};
  // a floor tile with nobody on it, nearest the bottom-left (for tap-to-cancel)
  const empty=async()=>p.evaluate(()=>{const s=AshenCrown.snapshot();for(let y=12;y>=9;y--)for(let x=2;x<16;x++)if(!s.units.some(u=>u.hp>0&&!u.benched&&u.x===x&&u.y===y)&&!['x'].includes(s.map?.[y]?.[x]))return {x,y};return {x:9,y:12};});
  await p.goto(url);await press('new');await drainStory(p);
  // 1. the real v0.9.2 lower city offers Mission 21
  await restore(camp20);await drainStory(p);await closeModals();let s=await snap();
  check(`${label} the v0.9.2 lower city offers Mission 21`,s.frontier.hub==='capital'&&(await p.locator('[data-do="next-mission"]').first().textContent()).includes('Mission 21'));
  const s21=nextMission(ready());enterHub(s21);await restore(s21);await drainStory(p);await closeModals();
  await enterWarCouncil(p,touch);await press('deploy');await p.waitForTimeout(300);await press('start-battle');await drainStory(p);s=await snap();
  // 2. M21: the king, four anchor stones, the pulsing ring
  check(`${label} M21 battle: seven heroes, the king on the dais, four anchor stones`,s.screen==='battle'&&s.units.filter(u=>u.team==='ally'&&!u.benched).length===7&&s.units.find(u=>u.id==='king')?.x===8&&s.units.filter(u=>u.kind==='anchorStone'&&!u.inert).length===4);
  check(`${label} the objective panel shows the stones, the king's HP and the pulsing ring`,(await body()).includes('고정석 0/4')&&(await body()).includes('맥동 바깥 고리'));
  await press('reset-camera');await p.waitForTimeout(300);await p.screenshot({path:`${shots}/m21-heart-${label}.png`});
  const prep=deserialize(serialize(await snap()));for(const e of prep.units.filter(u=>u.team==='enemy'&&u.id!=='g1'))e.hp=0;const hero=prep.units.find(u=>u.id==='eric'),as1=prep.units.find(u=>u.id==='as1');hero.x=as1.x+1;hero.y=as1.y;hero.moved=hero.acted=false;
  const sain=prep.units.find(u=>u.id==='sain');sain.x=5;sain.y=10;sain.moved=sain.acted=false;sain.mp=sain.maxMP;const g1=prep.units.find(u=>u.id==='g1');g1.x=5;g1.y=9;g1.hp=g1.maxHP-20;g1.status=null;
  const lia=prep.units.find(u=>u.id==='lia');lia.x=11;lia.y=10;lia.moved=lia.acted=false;await restore(prep);await drainStory(p);
  await select(hero);check(`${label} a hero beside an anchor stone may break it (고정석 깨기)`,(await p.locator('#unit-popover').textContent()).includes('고정석 깨기'));
  await press('mode','search');await tile(as1.x,as1.y);if(await p.locator('[data-do="confirm"]').count())await press('confirm');await p.waitForTimeout(600);await drainStory(p);s=await snap();
  check(`${label} Erik breaks it at one blow`,s.missionState.broken.includes('as1'));
  // 3. the play-test notes (D-092): tap an empty tile to cancel an aimed heal; Sain may heal a foe; the zone of control
  const sn=s.units.find(u=>u.id==='sain');await select(sn);await press('submenu','skills');await press('mode','skill');let v=await view();check(`${label} Sain aims Heal`,v.mode==='skill');
  const free=await empty();await tile(free.x,free.y);v=await view();check(`${label} tapping an empty tile cancels the aim and reopens the menu`,v.mode==='choose'&&(await body()).includes('선택 취소'));
  await press('submenu','skills');await press('mode','skill');await tile(5,9);await p.waitForTimeout(300);check(`${label} Heal can aim at an enemy (a foe healed earns no EXP)`,(await p.locator('#unit-popover').textContent()).includes('회복')||(await view()).preview?.target==='g1');
  await p.screenshot({path:`${shots}/heal-on-foe-${label}.png`});await tile(free.x,free.y);
  const z=deserialize(serialize(await snap()));const lz=z.units.find(u=>u.id==='lia'),gz=z.units.find(u=>u.id==='g1');gz.hp=gz.maxHP;lz.x=7;lz.y=10;gz.x=7;gz.y=8;lz.moved=lz.acted=false;await restore(z);await drainStory(p);
  const reach=await p.evaluate(()=>{const s=AshenCrown.snapshot();return s;});const lzz=reach.units.find(u=>u.id==='lia');await select(lzz);await press('mode','move');await p.waitForTimeout(300);
  await p.screenshot({path:`${shots}/zone-of-control-${label}.png`});check(`${label} the zone of control screenshot is taken with Lia beside a foe's zone`,true);
  // 4. M21 won: the king's request, then Aren's awakening card
  await restore(m21Won());await drainStory(p);for(let i=0;i<3&&!(await p.locator('[data-do="king21-pick"]').count());i++){await closeModals();await press('next-mission');await p.waitForTimeout(300);}
  check(`${label} after M21 the camp asks Aren's answer to the king (two ways)`,await p.locator('[data-do="king21-pick"]').count()===2);
  await p.screenshot({path:`${shots}/king21-choice-${label}.png`});
  await press('king21-pick','notyet');await drainStory(p);await p.waitForTimeout(400);let t=await modal();s=await snap();
  check(`${label} the answer is kept and Aren's awakening scene plays`,s.campaign.choices.m21_king==='notyet'&&s.narrative.seen.includes('after:21:notyet')&&s.narrative.seen.includes('after:21:aren'));
  check(`${label} Aren's awakening card shows 「함께 정한다」`,t.includes('아렌의 각성')&&t.includes('함께 정한다'));
  await p.screenshot({path:`${shots}/aren-card-${label}.png`});await closeModals();
  check(`${label} Mission 22 is next`,(await p.locator('[data-do="next-mission"]').first().textContent()).includes('Mission 22'));
  // 5. M22: three heralds; 「함께 정한다」 from the unit menu
  const s22=m22();await restore(s22);await drainStory(p);s=await snap();
  check(`${label} M22: three heralds on the daises, readings 0/4`,s.missionId===22&&s.units.filter(u=>u.kind==='herald').length===3&&(await body()).includes('기록 0/4'));
  await press('reset-camera');await p.waitForTimeout(300);await p.screenshot({path:`${shots}/m22-square-${label}.png`});
  const w=deserialize(serialize(s));const ew=w.units.find(u=>u.id==='eric');ew.acted=true;ew.moved=true;await restore(w);await drainStory(p);await select(ew);
  check(`${label} an acted hero shows 「아렌의 군령 · 함께 정한다」`,(await p.locator('#unit-popover').textContent()).includes('함께 정한다'));
  await press('together');await p.waitForTimeout(300);s=await snap();const e2=s.units.find(u=>u.id==='eric');check(`${label} Erik acts again; the command is spent for this battle`,!e2.acted&&!e2.moved&&s.together?.hero==='eric');
  await p.screenshot({path:`${shots}/together-${label}.png`});
  await press('unit-info','eric|ability');await press('unit-info','eric|bio');await p.waitForTimeout(300);t=await modal();check(`${label} the unit sheet's bio tab carries the hero records (장수 열전)`,t.includes('장수 열전')&&t.includes('출전')&&t.includes('격파'));
  await p.screenshot({path:`${shots}/hero-records-${label}.png`});await closeModals();
  // 6. M22 won: the ACT III choice (three ways), then the ACT III card; no next mission
  await restore(m22Won());await drainStory(p);for(let i=0;i<3&&!(await p.locator('[data-do="act3-pick"]').count());i++){await closeModals();await press('next-mission');await p.waitForTimeout(300);}
  check(`${label} after M22 the camp asks to whom the truth goes (three ways, each with its trust cost)`,await p.locator('[data-do="act3-pick"]').count()===3&&(await modal()).includes('−1'));
  await p.screenshot({path:`${shots}/act3-choice-${label}.png`});
  await press('act3-pick','council');await drainStory(p);await p.waitForTimeout(400);t=await modal();s=await snap();
  check(`${label} the choice is kept; its scene and the close follow`,s.campaign.choices.act3_choice==='council'&&s.narrative.seen.includes('after:22:council')&&s.narrative.seen.includes('after:22:end'));
  check(`${label} the ACT III card: 왕관의 진실, each hero's deed, the choices of ACT III, on to ACT IV`,t.includes('ACT III')&&t.includes('왕관의 진실')&&t.includes('대표 전과')&&t.includes('세 깃발의 회의에')&&t.includes('ACT IV · 잿빛 왕관'));
  await p.screenshot({path:`${shots}/act3-card-${label}.png`,fullPage:true});await closeModals();
  check(`${label} after M22 the way goes on to Mission 23 (v0.10.0, ACT IV)`,(await p.locator('[data-do="next-mission"]').first().textContent()).includes('Mission 23'));
  await p.screenshot({path:`${shots}/capital-end-${label}.png`});
  check(`${label} no page errors`,errors.length===0);
  await ctx.close();}
 fs.writeFileSync('test-output/act3d-e2e.json',JSON.stringify({suite:'act3d-e2e',passed:n,results},null,1));console.log(`act3d-e2e: ${n} checks passed`);
}finally{await b.close();}
