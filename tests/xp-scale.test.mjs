// D-045 level-relative EXP. v2.0.0 (D-115, REFORM_DESIGN §6.1): the yardstick is the sortie's average level (s.levelPlan.avg,
// the same number the enemies are scaled to), not a fixed mission level — so a hero far ahead of the party learns less and
// a hero far behind catches up, in every mission including M01–M03.
import test from 'node:test';import assert from 'node:assert/strict';
import {newGame,startBattle} from '../src/core/game.js';import {awardXP,xpScale,findUnit} from '../src/core/rules.js';import {MISSIONS} from '../src/data/missions.js';
const battle=(id,c=null)=>{const s=newGame(1,c,id);s.screen='deployment';startBattle(s);return s;};
test('the yardstick is the sortie average: within ±2 of it every hero gets the full EXP',()=>{
 for(const id of [1,2,3]){const s=battle(id),lia=findUnit(s,'lia'),avg=Math.round(s.levelPlan.avg);assert.ok(Number.isFinite(s.levelPlan.avg));
  for(const d of [-2,0,2]){lia.level=Math.max(1,avg+d);assert.equal(xpScale(s,lia),1,`M${id} ${d}`);}const xp=lia.xp;lia.level=avg;awardXP(s,lia,28,'t');assert.equal(lia.xp-xp,28);}
});
test('far above the sortie learns less, far below learns faster, with floor and cap',()=>{
 const s=battle(4,{heroes:null,results:[],clears:3,completed:[1,2,3],flags:{}}),u=findUnit(s,'lia'),lv=Math.round(s.levelPlan.avg);
 for(const [level,scale] of [[lv,1],[lv+2,1],[lv+3,0.8],[lv+5,0.4],[lv+12,0.2],[lv+3+8,0.2]]){u.level=level;assert.equal(+xpScale(s,u).toFixed(2),scale,`level ${level}`);}
 s.levelPlan.avg=20;for(const [level,scale] of [[18,1],[17,1.2],[10,1.6]]){u.level=level;assert.equal(+xpScale(s,u).toFixed(2),scale,`below: level ${level}`);}
 s.levelPlan.avg=lv;u.level=lv+5;u.xp=0;awardXP(s,u,28,'t');assert.equal(u.xp,11);u.level=lv+12;u.xp=0;awardXP(s,u,2,'t');assert.equal(u.xp,1,'never zero');
});
test('without a plan (old saves mid-camp) the mission level is still the fallback',()=>{const s=newGame(1,{heroes:null,results:[],clears:3,completed:[1,2,3],flags:{}},4),u=findUnit(s,'lia');delete s.levelPlan;
 const lv=MISSIONS[4].level;if(!lv)return;u.level=lv+5;assert.equal(+xpScale(s,u).toFixed(2),0.4);});
