// v0.9.2 — Lia's and Kai's awakening (Lv 14, tier 2, M19 / M20, trials 109 / 114) with their ④ skills (Little Ward, Shadow
// Dance), Aren's 「한 사람도 두고 가지 않는다」 and the grey cloaks' shadow (D-089).
import test from 'node:test';import assert from 'node:assert/strict';
import {newGame,startBattle,beginEnemyPhase,advanceEnemy,performAction} from '../src/core/game.js';
import {findUnit,alive,movement,strikeStats} from '../src/core/rules.js';
import {effectiveStats} from '../src/core/economy.js';
import {promotionStatus,commitSkirmish} from '../src/core/progression.js';
import {startSkirmish,trialMissionOf} from '../src/core/skirmish.js';
import {validClassTarget,classTargetCells,forecastClass} from '../src/core/class-actions.js';
import {skillsOf,ULTIMATE_MODES} from '../src/data/skills.js';
import {CLASS_TREE,AWAKEN_TRIGGER} from '../src/data/classes.js';
import {commandsFor,defaultCommand,COMMANDS,setCommand} from '../src/core/command.js';
import {inSmallWard} from '../src/core/wards.js';
import {MISSIONS} from '../src/data/missions.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';
const all=n=>[...Array(n).keys()].map(i=>i+1);
function camp(done,level=14){const s=newGame(92,{heroes:null,results:[],clears:done,completed:all(done),flags:{act1_completed:true,act2_completed:true,mission_14_betrayer:'iron'},choices:{m06_oath:'comrades'},roster:['thea','dario','ines'],factionTrust:{iron:-1,free:2,flame:2}},Math.min(20,done));
 s.campaign.heroes??=s.units.filter(u=>u.team==='ally').map(u=>{const {x,y,moved,acted,benched,...r}=structuredClone(u);return r;});
 for(const h of s.campaign.heroes){h.level=level;h.classTier=['thea','dario','ines'].includes(h.id)?1:2;}return s;}
const enemyPhase=s=>{beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome){advanceEnemy(s);drain(s);}drain(s);};
// An open drill field (trial 109) with Lia and Kai awakened and the enemies placed by hand.
function field(){const c=camp(20);const s=startSkirmish(c,'trial','lia',{force:true});for(const u of s.units.filter(u=>u.team==='ally')){u.classTier=3;u.mp=u.maxMP;delete u.benched;}
 s.units.filter(u=>u.team==='ally').forEach((u,i)=>{u.x=i;u.y=9;});for(const e of s.units.filter(u=>u.team==='enemy'))e.hp=0;drain(s);return s;}

test('Lia and Kai awaken after their own mission: 결계술사 (Little Ward) after M19, 그림자 군주 (Shadow Dance) after M20; trials 109 and 114',()=>{
 assert.deepEqual(AWAKEN_TRIGGER,{elina:16,eric:17,sain:18,lia:19,kai:20,ines:23,thea:24});
 assert.deepEqual(CLASS_TREE.lia.map(c=>c.key),['mage','arcanist','barrierMage']);assert.deepEqual(CLASS_TREE.kai.map(c=>c.key),['rogue','shadowblade','shadowLord']);
 assert.equal(CLASS_TREE.lia[2].ultimate,'smallWard');assert.equal(CLASS_TREE.kai[2].ultimate,'shadowDance');assert.ok(ULTIMATE_MODES.includes('smallWard')&&ULTIMATE_MODES.includes('shadowDance'));
 assert.ok(!promotionStatus(camp(18),'lia').eligible);assert.ok(promotionStatus(camp(19),'lia').eligible);assert.equal(trialMissionOf(camp(19),'lia'),109);
 assert.ok(!promotionStatus(camp(19),'kai').eligible);assert.ok(promotionStatus(camp(20),'kai').eligible);assert.equal(trialMissionOf(camp(20),'kai'),114);
 for(const id of [109,114])assert.equal(MISSIONS[id].skirmish.tier,3);
 const s=startSkirmish(camp(20),'trial','kai',{force:true});assert.equal(s.missionId,114);const k=findUnit(s,'kai');assert.equal(k.classTier,3);assert.ok(skillsOf(k).find(x=>x.slot===4&&x.mode==='shadowDance').open);
 s.outcome='victory';assert.ok(commitSkirmish(s));assert.equal(s.campaign.promotions.kai.tier,3);assert.ok(s.campaign.flags.awakened_kai);
});

test('Little Ward: a 3×3 within 4 of Lia for two turns — enemies inside are pushed out, none can step in, the legion inside has RES +5; once a battle',()=>{
 const s=field(),lia=findUnit(s,'lia'),e=findUnit(s,'eric');lia.x=5;lia.y=6;e.x=6;e.y=3;const foe=s.units.find(u=>u.team==='enemy');foe.hp=foe.maxHP;foe.x=5;foe.y=2;foe.mov=4;
 assert.ok(!validClassTarget(s,lia,'5,1','smallWard'),'beyond 4');assert.ok(validClassTarget(s,lia,'5,3','smallWard'));
 const res=effectiveStats(s,e).res;assert.equal(forecastClass(s,lia,'5,3','smallWard').cells.length,9);assert.equal(forecastClass(s,lia,'5,4','smallWard').cells.length,6,'walls are not warded');
 assert.ok(performAction(s,'lia','smallWard','5,3').ok);assert.deepEqual([s.smallWard.x,s.smallWard.y,s.smallWard.until],[5,3,s.turn+1]);
 assert.ok(!inSmallWard(s,foe),'the enemy inside was pushed out');assert.equal(effectiveStats(s,e).res,res+5);
 assert.ok([...movement(s,foe).costs.keys()].every(k=>{const [x,y]=k.split(',').map(Number);return !inSmallWard(s,{x,y});}),'no step into the ward');
 lia.acted=false;assert.ok(!validClassTarget(s,lia,'3,3','smallWard'),'once a battle');
 enemyPhase(s);assert.ok(inSmallWard(s,e),'still up on the next turn');enemyPhase(s);assert.ok(!inSmallWard(s,e),'gone after two turns');
 deserialize(serialize(s));
});

test('Shadow Dance: two units within 4 of Kai trade places (two taps: "a|b"); a moved enemy cannot act in the next enemy phase',()=>{
 const s=field(),k=findUnit(s,'kai'),el=findUnit(s,'elina');k.x=5;k.y=6;el.x=4;el.y=8;const foe=s.units.find(u=>u.team==='enemy');foe.hp=foe.maxHP;foe.x=7;foe.y=4;
 const far=s.units.filter(u=>u.team==='enemy')[1];far.hp=far.maxHP;far.x=11;far.y=0;
 assert.ok(validClassTarget(s,k,foe,'shadowDance'),'a first pick');assert.ok(!validClassTarget(s,k,far,'shadowDance'),'beyond 4');
 assert.deepEqual(classTargetCells(s,k,'shadowDance',foe.id).map(c=>`${c.x},${c.y}`).sort(),s.units.filter(u=>u.id!==foe.id&&alive(u)&&!u.benched&&Math.abs(u.x-5)+Math.abs(u.y-6)<=4&&u.team!=='civilian').map(u=>`${u.x},${u.y}`).sort());
 assert.ok(!validClassTarget(s,k,`${foe.id}|${far.id}`,'shadowDance'));
 assert.ok(performAction(s,'kai','shadowDance',`${foe.id}|elina`).ok);assert.deepEqual([foe.x,foe.y,el.x,el.y],[4,8,7,4]);assert.equal(foe.dazed,s.turn);
 const before={x:foe.x,y:foe.y},hp=s.units.filter(u=>u.team==='ally').map(u=>u.hp).join();enemyPhase(s);assert.deepEqual({x:foe.x,y:foe.y},before,'held in place');
 assert.ok(s.log.some(l=>l.includes('그림자에 휘말려')));assert.ok(!validClassTarget(s,k,`${far.id}|elina`,'shadowDance'),'once a battle');
 deserialize(serialize(s));
});

test('「한 사람도 두고 가지 않는다」 opens at M19 (the newest order): civilians and allied units take 30% less; heroes do not',()=>{
 assert.equal(COMMANDS.leaveNoOne.opens,19);
 const c=camp(18);const s=newGame(5,c.campaign,19);s.screen='deployment';startBattle(s);drain(s);assert.deepEqual(commandsFor(s),['hold','advance','leaveNoOne']);
 const s2=newGame(5,c.campaign,19);s2.screen='deployment';assert.equal(defaultCommand(s2),'leaveNoOne');
 const foe=s.units.find(u=>u.team==='enemy'),p=findUnit(s,'p1'),e=findUnit(s,'eric');foe.x=p.x+1;foe.y=p.y;
 s.command=null;const plain=strikeStats(s,foe,p).damage,hero=strikeStats(s,foe,e).damage;s.command='leaveNoOne';
 assert.equal(strikeStats(s,foe,p).damage,Math.max(1,Math.round(plain*.7)));assert.equal(strikeStats(s,foe,e).damage,hero);
});

test('grey cloaks in the shadows: the first blow shows 0% and misses, then they stand in the open',()=>{
 const c=camp(19);const s=newGame(5,c.campaign,20);s.screen='deployment';startBattle(s);drain(s);if(s.duel)s.duel.result='skipped';
 const g=findUnit(s,'g5'),e=findUnit(s,'eric');assert.equal(g.shade,true);e.x=g.x;e.y=g.y-1;e.moved=true;
 assert.equal(strikeStats(s,e,g).hit,0);const hp=g.hp;assert.ok(performAction(s,'eric','attack','g5').ok);assert.equal(g.hp,hp);assert.equal(g.shade,undefined);
 assert.ok(strikeStats(s,e,g).hit>0);
});
