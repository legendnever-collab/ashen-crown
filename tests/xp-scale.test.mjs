// D-045 level-relative EXP → v2.0.0 (D-115) the sortie's average → v2.6.0 (D-152, the user's request 2026-11-22 17:21):
// the yardstick is the enemy's level. Hits, kills and counters measure the hero against the foe struck; everything else
// (heals, guards, rescues, objectives, the clear bonus) against the battle's enemy average.
import test from 'node:test';import assert from 'node:assert/strict';
import {newGame,startBattle} from '../src/core/game.js';import {awardXP,xpScale,gapScale,battleFoeLevel,findUnit} from '../src/core/rules.js';
const battle=(id,c=null)=>{const s=newGame(1,c,id);s.screen='deployment';startBattle(s);return s;};
test('v2.6.0: the gap table (enemy − hero)',()=>{
 for(const [gap,mul] of [[12,2],[5,2],[4,1.8],[3,1.6],[2,1.4],[1,1.2],[0,1],[-1,1],[-2,1],[-3,.9],[-4,.8],[-6,.6],[-9,.3],[-10,.05],[-25,.05]])
  assert.equal(+gapScale(gap).toFixed(2),mul,`gap ${gap}`);
});
test('v2.6.0: a kill measured against the foe struck; the rest against the battle average',()=>{
 const s=battle(4,{heroes:null,results:[],clears:3,completed:[1,2,3],flags:{}}),u=findUnit(s,'lia'),avg=battleFoeLevel(s);
 assert.ok(Number.isFinite(avg)&&avg>0,'the battle has an enemy average');
 u.level=Math.round(avg);u.xp=0;awardXP(s,u,10,'t');assert.equal(u.xp,10,'level with the enemies: full EXP');
 u.xp=0;awardXP(s,u,50,'kill',u.level+4);assert.equal(u.xp,90,'a foe four levels up: ×1.8');
 u.xp=0;awardXP(s,u,50,'kill',u.level-5);assert.equal(u.xp,35,'five levels down: ×0.7');
 u.xp=0;awardXP(s,u,50,'kill',u.level-12);assert.equal(u.xp,3,'ten or more down: ×0.05');
 u.xp=0;awardXP(s,u,2,'kill',u.level-12);assert.equal(u.xp,1,'never zero');
 u.level=Math.round(avg)-8;u.xp=0;awardXP(s,u,40,'heal');assert.equal(u.xp,80,'a heal eight levels below the battle: ×2.0');
 assert.equal(xpScale(s,u,u.level),1,'an explicit level wins over the average');
});
test('v2.6.0: with no enemies on the field the sortie plan (then the mission level) is the fallback',()=>{
 const s=battle(1);const u=findUnit(s,'eric');s.units=s.units.filter(x=>x.team!=='enemy');assert.equal(battleFoeLevel(s),s.levelPlan.avg);
 delete s.levelPlan;assert.ok(battleFoeLevel(s)===null||Number.isFinite(battleFoeLevel(s)));assert.ok(Number.isFinite(xpScale(s,u)));
});
