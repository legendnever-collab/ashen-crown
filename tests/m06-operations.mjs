// Supply a serialized pre-sortie campaign. Both routes use the same initial RNG and recommended deployment.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {startBattle} from '../src/core/game.js';
import {findUnit,alive} from '../src/core/rules.js';
import {deserialize} from '../src/persistence/save-manager.js';
import {campaignAction,playCampaignBattle} from './campaign-policy.mjs';
const results=[];
for(const route of ['front','flank']){
 const s=deserialize(fs.readFileSync(process.argv[2]||new URL('./fixtures/v280/m06-camp.json',import.meta.url),'utf8'));
 assert.equal(s.missionId,6);
 s.initialSeed=s.rng;s.screen='deployment';assert.ok(startBattle(s));
 const deployment=s.units.filter(u=>u.team==='ally'&&!u.benched).map(({id,x,y})=>({id,x,y}));
 const actions=[];
 const result=playCampaignBattle(s,true,(s,u,capture)=>{
  const target=route==='flank'?{kai:'lever',elina:'beacon'}[u.id]:null;
  const focus=target&&findUnit(s,target);
  const orders=focus&&alive(focus)?{focus}:{avoid:['lever','beacon']};
  const action=campaignAction(s,u,capture,orders);
  actions.push({turn:s.turn,id:u.id,x:action.x,y:action.y,mode:action.mode,target:action.target});return action;
 });
 const passed=s.units.filter(u=>u.team==='civilian'&&u.rescued).map(u=>u.id);
 results.push({route,seed:s.initialSeed,deployment,outcome:result.outcome,turn:s.turn,passed,garrison:s.units.filter(u=>['g1','g2'].includes(u.id)).map(u=>u.id),lever:s.missionState.lever,beacon:s.missionState.beacon,actions});
}
if(!process.argv[2]){
 for(const r of results)assert.equal(r.outcome,'victory');
 assert.deepEqual(results[0].deployment,results[1].deployment);
 assert.ok(!results[0].lever&&!results[0].beacon&&results[1].lever&&results[1].beacon);
}
console.log(JSON.stringify(results));
