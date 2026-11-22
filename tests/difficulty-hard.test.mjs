// v2.3.0 (D-129): a battle on 어려움 saves and loads at its first turn on every story mission. Before v2.3.0 the stage-start
// record of M06 (the only mission with a wave at the start: the inspector, when the records were reported) was refused on 어려움: its quarter-more soldiers were not counted.
import test from 'node:test';import assert from 'node:assert/strict';
import {newGame,startBattle} from '../src/core/game.js';import {serialize,deserialize} from '../src/persistence/save-manager.js';import {MISSIONS} from '../src/data/missions.js';
test('every story mission on 어려움 starts, saves and loads (stage start included)',()=>{
 for(const m of Object.values(MISSIONS).filter(m=>!m.skirmish)){const id=m.id;
  const c={heroes:null,results:[],clears:id-1,completed:Array.from({length:id-1},(_,i)=>i+1),flags:{act1_completed:id>6},difficulty:'hard',choices:{m06_oath:'comrades',m04_records_choice:'kept',m07_deserters:'legion',m08_order:'hold',m10_stance:'mediate'},roster:id>8?['thea']:[]};
  const s=newGame(7919,c,id);s.screen='deployment';assert.ok(startBattle(s),`M${id} starts`);assert.equal(s.potions,1);
  const back=deserialize(serialize(s));assert.equal(back.campaign.difficulty,'hard',`M${id}`);assert.equal(back.stageStart.units.length,s.stageStart.units.length,`M${id}`);}
 const m6=newGame(7919,{heroes:null,results:[],clears:5,completed:[1,2,3,4,5],flags:{},difficulty:'hard',choices:{m04_records_choice:'reported'}},6);m6.screen='deployment';startBattle(m6);
 assert.ok(m6.units.some(u=>u.id==='i1h0'),'M06 (records reported) on 어려움: the inspector\'s wave brings its extra soldier');const back6=deserialize(serialize(m6));assert.equal(back6.stageStart.units.length,m6.stageStart.units.length);
});
test('어려움 push by mission (D-129): full in ACT II, none in the M15 chase and the M17/M18 trials, growing in elsewhere',async()=>{
 const {difficultyPush,HARD_SHARE,BASE_MUL,BASE_MUL_AT}=await import('../src/core/stats8.js');const at=(missionId,avg,difficulty='hard')=>difficultyPush({missionId,campaign:{difficulty},levelPlan:{avg}});
 for(const id of [7,8,9,10,12,13]){ /* v2.6.0 (D-153): M14 joins the no-push list */const p=at(id,9);assert.equal(p.levels,1,`M${id}`);assert.ok(Math.abs(p.mul-(BASE_MUL_AT[id]??BASE_MUL)*1.1)<1e-9,`M${id}`);}
 for(const id of [11,14,15,16,17,18,19,20,21,22,23]){ /* v2.4.0: M16 too, on its big map; v2.4.1: M20, M22; v2.5.0: M19, M21, M23 */assert.deepEqual(at(id,18),at(id,18,'normal'),`M${id}`);}
 assert.deepEqual(HARD_SHARE,{7:1,8:1,9:1,10:1,11:0,12:1,13:1,14:0,15:0,16:0,17:0,18:0,19:0,20:0,21:0,22:0,23:0,24:.5,26:0,27:.5,30:.5}); /* v2.4.1: the ACT III big maps; v2.5.0: M19 and ACT IV */
 assert.equal(at(25,19).levels,1);assert.ok(Math.abs(at(25,19).mul-(BASE_MUL_AT[25]??BASE_MUL)*1.1)<1e-9,'M25 full push');
 assert.equal(at(6,9).levels,0);assert.equal(at(21,19).levels,0); /* v2.5.0: M21 at 보통's numbers too */assert.equal(at(5,8).mul,BASE_MUL);
});
