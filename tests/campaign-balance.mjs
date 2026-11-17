// M01→M03 legal-policy campaign (30 seeds). v2.0.0 (D-115): the big maps at the sortie's level are no longer won every time;
// each mission must stay inside the ACT I band on 보통 (≥ 60% of the runs that reach it; M02 cannot be lost by design).
import fs from 'node:fs';import assert from 'node:assert/strict';import {newGame,startBattle,nextMission} from '../src/core/game.js';import {playBattle} from './player-policy.mjs';import {playCampaignBattle} from './campaign-policy.mjs';import {serialize,deserialize} from '../src/persistence/save-manager.js';
const runs=[];for(let seed=20261014;seed<20261044;seed++){const r={seed};let s=newGame(seed);s.screen='deployment';startBattle(s);const first=playBattle(s);r.m1=first.outcome;r.t1=first.turn;
 if(first.outcome==='victory'){s=nextMission(s);s.screen='deployment';startBattle(s);const forest=playCampaignBattle(s,seed%2===0);r.m2=forest.outcome;r.t2=forest.turn;r.capture=forest.captured;deserialize(serialize(s));
  if(forest.outcome==='victory'){s=nextMission(s);s.screen='deployment';startBattle(s);const bridge=playCampaignBattle(s);r.m3=bridge.outcome;r.t3=bridge.turn;r.saved=bridge.saved;deserialize(serialize(s));r.alive=s.units.filter(u=>u.team==='ally'&&!u.benched&&u.hp>0).length;}}
 runs.push(r);}
const rate=k=>{const played=runs.filter(r=>r[k]),won=played.filter(r=>r[k]==='victory');return [won.length,played.length];};
for(const k of ['m1','m2','m3']){const [w,n]=rate(k);assert.ok(n&&w/n>=.6,`${k} ${w}/${n}`);}
assert.equal(rate('m2')[0],rate('m2')[1],'M02 is never lost');
fs.mkdirSync('test-output',{recursive:true});fs.writeFileSync('test-output/campaign-balance.json',JSON.stringify({runs},null,2));
console.log(`M01 ${rate('m1').join('/')} · M02 ${rate('m2').join('/')} (capture ${runs.filter(r=>r.capture).length}) · M03 ${rate('m3').join('/')} (both villagers ${runs.filter(r=>r.saved===2).length}); complete ${runs.filter(r=>r.m3==='victory').length}/30`);
