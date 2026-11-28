import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {newGame,startBattle,moveUnit,performAction,planEnemy} from '../src/core/game.js';
import {findUnit} from '../src/core/rules.js';
import {deserialize} from '../src/persistence/save-manager.js';
import {m06ThreatTiles,m06PursuitWave} from '../src/core/mission-rules.js';
import {drain} from './campaign-policy.mjs';

test('M01 recommended opening offers Thomas or a looter, with one action to spend',()=>{
 for(const [x,y,mode,target] of [[9,5,'rescue','c2'],[10,7,'attack','r1']]){
  const s=newGame(20261014);s.screen='deployment';assert.ok(startBattle(s));drain(s);
  assert.ok(moveUnit(s,'kai',x,y));assert.ok(performAction(s,'kai',mode,target).ok);
  assert.equal(findUnit(s,'kai').acted,true);
  assert.equal(findUnit(s,'c2').rescued===true,mode==='rescue');
 }
});
test('M06 guard and phase markers match the battle rules without consuming RNG',()=>{
 const s=deserialize(fs.readFileSync(new URL('./fixtures/v280/m06-camp.json',import.meta.url),'utf8'));
 s.screen='deployment';startBattle(s);drain(s);
 const before=s.rng,guard=findUnit(s,'k1');
 assert.deepEqual([...m06ThreatTiles(s,guard)].sort(),[[0,-1],[0,1],[-1,0],[1,0]].map(([dx,dy])=>[guard.x+dx,guard.y+dy].join(',')).sort());
 assert.equal(m06ThreatTiles(s,findUnit(s,'beacon')).size,0);
 for(const u of s.units.filter(u=>u.team==='enemy')){
  const p=planEnemy(s,u);if(p.target){const target=findUnit(s,p.target);assert.ok(m06ThreatTiles(s,u).has(target.x+','+target.y));}
 }
 assert.equal(s.rng,before);assert.deepEqual(m06PursuitWave(s).map(u=>u.id),['r1','r2']);
 s.missionState.phase=2;assert.deepEqual(m06PursuitWave(s),[]);
});
