// v0.8.1 「무기」 in the browser (D-073 §6): Ironhold's forge shelf (specialty on sale, armor locked until M08, the premium
// blade), buying and 단련 to ★2, the four-slot equipment sheet with a treasure, revisiting Ironhold from the Velmar camp on
// the world map, Velmar's rare-goods shelf, Lia's hidden-objective line, a ③ cut-in, the supply carrier and a hidden
// objective won on the result screen. 1440×900 and 390×844 touch. Screenshots: docs/v0.8.1/screenshots/arms.
import {launchTestBrowser} from './browser-helper.mjs';import {drainStory} from './story-helper.mjs';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';import fs from 'node:fs';
import {serialize} from '../src/persistence/save-manager.js';
import {newGame,startBattle} from '../src/core/game.js';import {findUnit} from '../src/core/rules.js';import {enterHub,enterInterior,currentHub,walkable,syncFrontier} from '../src/core/frontier.js';import {drain} from './campaign-policy.mjs';
const url=pathToFileURL(process.cwd()+'/releases/Ashen_Crown_v0.8.1.html').href,shots='docs/v0.8.1/screenshots/arms';fs.mkdirSync(shots,{recursive:true});fs.mkdirSync('test-output',{recursive:true});
const b=await launchTestBrowser({headless:true,args:['--no-sandbox']});let n=0;const results=[];const check=(name,ok)=>{assert.ok(ok,name);n++;results.push(name);console.log('PASS',name);};
const camp=(extra={})=>({heroes:null,results:[],clears:0,completed:[],flags:{},choices:{},roster:[],...extra});
const upTo=k=>Array.from({length:k},(_,i)=>i+1);
// Erik inside a town's forge, beside the smith (missions 1…done cleared, the camp of mission `at`).
function forge(at,done,gold=900){const s=newGame(5,camp({completed:upTo(done)}),at);enterHub(s,{aftermath:done>=at,story:false});drain(s);s.economy.gold=gold;const door=currentHub(s).places.find(p=>p.id==='forge');s.frontier.x=door.x;s.frontier.y=door.y;assert.ok(enterInterior(s,'weapon'));
 const smith=currentHub(s).npcs.find(x=>x.id==='smith');const spot=[[0,1],[1,0],[-1,0],[0,-1]].map(([dx,dy])=>[smith.x+dx,smith.y+dy]).find(([x,y])=>walkable(s,x,y));[s.frontier.x,s.frontier.y]=spot;s.frontier.facing='up';syncFrontier(s);return s;}
try{
 for(const [label,viewport,touch] of [['1440',{width:1440,height:900},false],['390',{width:390,height:844},true]]){
  const ctx=await b.newContext({viewport,hasTouch:touch,isMobile:touch,deviceScaleFactor:touch?2:1});await ctx.setOffline(true);const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const press=async(a,id)=>{const el=p.locator(`[data-do="${a}"]${id!=null?`[data-id="${id}"]`:''}`).first();touch?await el.tap():await el.click();await p.waitForTimeout(250);};
  const restore=async s=>{await drainStory(p);if(await p.locator('#modal-root .modal').count())await press('close-modal');await press('menu');await press('backup');await p.fill('#backup-text',serialize(s));await press('restore');await p.waitForTimeout(400);await drainStory(p);};
  const snap=()=>p.evaluate(()=>AshenCrown.snapshot());const modal=()=>p.locator('#modal-root').innerText();
  const tile=async(x,y)=>{await p.waitForTimeout(250);if(touch){const off=await p.evaluate(([x,y])=>{const c=window.AshenCrown.tileCenter(x,y),r=document.querySelector('#battle-map').getBoundingClientRect();return c.x<0||c.y<0||c.x>r.width||c.y>r.height;},[x,y]);if(off&&await p.locator('[data-do="reset-camera"]').isVisible()){await p.locator('[data-do="reset-camera"]').first().tap();await p.waitForTimeout(300);}}const pt=await p.evaluate(([x,y])=>{const c=window.AshenCrown.tileCenter(x,y),r=document.querySelector('#battle-map').getBoundingClientRect();return {x:c.x+r.x,y:c.y+r.y};},[x,y]);touch?await p.touchscreen.tap(pt.x,pt.y):await p.mouse.click(pt.x,pt.y);await p.waitForTimeout(250);};
  const idle=()=>p.waitForFunction(()=>!AshenCrown.view().busy,{},{timeout:30000});
  const select=async u=>{await idle();if(await p.locator('[data-do="close-unit-menu"]').count())await press('close-unit-menu');if(touch&&await p.locator('[data-do="reset-camera"]').isVisible())await press('reset-camera');await tile(u.x,u.y);if((await p.evaluate(()=>AshenCrown.view().selected))!==u.id)await tile(u.x,u.y);if(!await p.locator('[data-do="submenu"][data-id="skills"]').count())await press('open-unit-menu');};
  await p.goto(url);await press('new');await drainStory(p);
  // 1. Ironhold forge before M07 is cleared: the weapons are locked, the premium blade is on the shelf.
  await restore(forge(7,6));await press('npc','smith');await press('shop-service','buy');let t=await modal();
  check(`${label} Ironhold's forge lists its specialty: 강철 대검 locked until M07, 룬 단조검 (premium) on sale, basics below`,t.includes('이 마을 특산')&&t.includes('강철 대검')&&t.includes('M07 클리어 후')&&t.includes('룬 단조검')&&t.includes('고급품')&&t.includes('기본 장비'));
  check(`${label} a locked piece has no buy button`,await p.locator('[data-do="buy-preview"][data-id="steelGreatsword"]').count()===0&&await p.locator('[data-do="buy-preview"][data-id="runeforgedBlade"]').count()===1);
  await p.screenshot({path:`${shots}/forge-shelf-before-m07-${label}.png`});
  // 2. After M07: buy the Steel Greatsword for Erik, then temper it to ★2 (80 Gold).
  await restore(forge(8,7));await press('npc','smith');await press('shop-service','buy');t=await modal();check(`${label} after M07 the weapons are on sale, the armor waits for M08`,await p.locator('[data-do="buy-preview"][data-id="steelGreatsword"]').count()===1&&t.includes('M08 클리어 후'));
  await press('buy-preview','steelGreatsword');await press('purchase-hero','steelGreatsword|eric');check(`${label} the purchase compares Erik's ATK before and after`,(await modal()).includes('ATK')&&(await modal()).includes('강철 대검'));
  await press('transaction','buy-gear|steelGreatsword|eric');await press('confirm-transaction');let st=await snap();const g=st.economy.gear.find(x=>x.type==='steelGreatsword');
  check(`${label} bought and equipped once: 180 Gold, ★1`,!!g&&g.star===1&&st.economy.equipped.eric.weapon===g.id&&st.economy.gold===900-180);
  if(await p.locator('#modal-root .modal').count())await press('close-modal');await press('npc','smith');await press('shop-service','upgrade');check(`${label} the forge offers 단련 ★1 → ★2 for 80 Gold`,(await modal()).includes('단련 ★1 → ★2 · 80 Gold'));
  await press('transaction',`upgrade|${g.id}`);check(`${label} the 단련 preview names the stars and the gain`,(await modal()).includes('★1 → ★2')&&(await modal()).includes('ATK +1'));await press('confirm-transaction');st=await snap();
  check(`${label} tempered: ★2, 80 Gold`,st.economy.gear.find(x=>x.id===g.id).star===2&&st.economy.gold===900-180-80);
  // 3. The equipment sheet: four slots with the treasure slot; a treasure equips there.
  if(await p.locator('#modal-root .modal').count())await press('close-modal');
  const tr=forge(8,7);tr.economy.gear.push({id:`g${tr.economy.next++}`,type:'twinDaggers',star:1,exp:0});tr.economy.gear.push({id:`g${tr.economy.next++}`,type:'steelGreatsword',star:2,exp:30});tr.economy.equipped.eric.weapon=tr.economy.gear.at(-1).id;await restore(tr);
  await press('inventory');check(`${label} the sheet shows four slots (무기·방어구·장신구·보물) and stars`,await p.locator('.modal .doll-slot').count()===4&&(await modal()).includes('보물')&&(await modal()).includes('★★☆'));
  await press('transaction',`equip|${tr.economy.gear.at(-2).id}|eric`);await press('confirm-transaction');st=await snap();check(`${label} the Twin Daggers go into Erik's treasure slot`,st.economy.equipped.eric.treasure===tr.economy.gear.at(-2).id);
  if(await p.locator('#modal-root .modal').count())await press('close-modal');await press('inventory');await p.screenshot({path:`${shots}/equipment-sheet-${label}.png`});await press('close-modal');
  // 4. Revisit: from the Velmar camp (M09 preparation) to Ironhold on the world map, buy armor unlocked by M08, come back.
  const v=newGame(5,camp({completed:upTo(8)}),9);enterHub(v,{story:false});drain(v);v.economy.gold=900;await restore(v);
  check(`${label} the camp shows 「마을 다시 찾기」`,await p.locator('[data-do="world-map"]').count()>=1);await press('world-map');t=await modal();
  check(`${label} the world map lists the towns passed: 잿빛 마을, 철관성 성하 마을 (not Velmar itself)`,t.includes('지나온 마을 다시 찾아가기')&&await p.locator('[data-do="travel"][data-id="castletown"]').count()===1&&await p.locator('[data-do="travel"][data-id="village_raid"]').count()===1&&await p.locator('[data-do="travel"][data-id="velmar"]').count()===0);
  await p.screenshot({path:`${shots}/world-map-towns-${label}.png`});await press('travel','castletown');st=await snap();
  check(`${label} travelled: Ironhold with the camp remembered; no council button there; the way back is shown`,st.frontier.hub==='castletown'&&st.frontier.revisit==='velmar'&&await p.locator('[data-do="warroom"]').count()===0&&await p.locator('[data-do="town-return"]').count()===1);
  await p.screenshot({path:`${shots}/revisit-castletown-${label}.png`});
  await p.reload();await drainStory(p);check(`${label} a reload keeps the visit`,(await snap()).frontier.hub==='castletown');
  await press('town-return');st=await snap();check(`${label} back in the Velmar camp`,st.frontier.hub==='velmar'&&!st.frontier.revisit&&await p.locator('[data-do="warroom"]').count()===1);
  // 5. Velmar's rare-goods shelf.
  await restore(forge(9,8));await press('npc','smith');await press('shop-service','buy');t=await modal();
  check(`${label} Velmar's forge shows the rare-goods shelf with one other town's piece`,t.includes('희귀품 진열장')&&t.includes('희귀품 · 다른 마을 특산')&&await p.locator('[data-do="buy-preview"][data-id$="|rare"]').count()===1);
  await p.screenshot({path:`${shots}/velmar-rare-shelf-${label}.png`});await press('close-modal');
  // 6. Lia's hidden-objective line in the war council (M01).
  const c=newGame(5,camp(),1);enterHub(c,{story:false});drain(c);c.screen='warroom';await restore(c);
  check(`${label} the war council carries Lia's hint: 숨은 전과 · TURN 6 안에 마을을 구한다 (보상 약초 주머니)`,(await p.locator('.feat-line').innerText()).includes('TURN 6')&&(await p.locator('.feat-line').innerText()).includes('약초 주머니'));
  await p.screenshot({path:`${shots}/council-hidden-objective-${label}.png`});
  // 7. Battle: a promoted Erik's ③ (Bulwark) shows the cut-in; the supply carrier is on the board.
  const w=newGame(5,camp({completed:[]}),1);w.screen='deployment';startBattle(w);drain(w);const er=findUnit(w,'eric');er.classTier=2;er.level=6;await restore(w);
  check(`${label} the supply carrier (b3) is marked in the save`,(await snap()).units.find(u=>u.id==='b3').carrier==='herb');
  await select(findUnit(w,'eric'));await press('submenu','skills');const cut=p.waitForSelector('#cutin',{timeout:6000}).then(()=>true).catch(()=>false);await press('mode','bulwark');if(await p.locator('[data-do="confirm"]').count())await press('confirm');
  const seen=await cut;
  check(`${label} Bulwark (Erik's ③) shows the cut-in with his line`,seen&&(await p.locator('#cutin').innerText()).includes('여기서부터는 못 지나간다'));
  await p.screenshot({path:`${shots}/cutin-${label}.png`});
  // 8. A hidden objective won: M01 cleared at TURN 3 → the result shows the Herb Pouch.
  const v1=newGame(5,camp(),1);v1.screen='deployment';startBattle(v1);drain(v1);v1.turn=3;for(const x of v1.units.filter(u=>u.team==='civilian'))x.rescued=true;const boss=findUnit(v1,'boss');for(const e of v1.units.filter(u=>u.team==='enemy'&&u.id!=='boss'))e.hp=0;
  const e1=findUnit(v1,'lia');boss.hp=1;boss.x=e1.x;boss.y=e1.y-2;await restore(v1);
  for(let i=0;i<8&&(await snap()).outcome!=='victory';i++){const now=await snap(),lia=now.units.find(u=>u.id==='lia'),bs=now.units.find(u=>u.id==='boss');await select(lia);await press('submenu','skills');await press('mode','skill');await tile(bs.x,bs.y);if(await p.locator('[data-do="confirm"]').count())await press('confirm');await p.waitForTimeout(1800);await idle();if((await snap()).outcome!=='victory'){const again=structuredClone(v1);again.rng=(v1.rng+i*7919+1)>>>0;await restore(again);}}
  await p.waitForTimeout(800);await drainStory(p);st=await snap();
  check(`${label} M01 won at TURN 3: the Herb Pouch is the campaign's and the result shows 숨은 전과`,st.outcome==='victory'&&st.campaign.feats?.includes(1)&&st.campaign.economy.gear.some(x=>x.type==='herbPouch')&&(await p.locator('.reward-chip.feat').count())===1);
  await p.screenshot({path:`${shots}/result-hidden-objective-${label}.png`});
  check(`${label} no runtime errors`,errors.length===0);if(errors.length)console.log(errors);
  await ctx.close();
 }
}finally{await b.close();}
fs.writeFileSync('test-output/arms-e2e.json',JSON.stringify({checks:n,results},null,1));console.log(`arms-e2e: ${n} checks passed`);
