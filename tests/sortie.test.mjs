import test from 'node:test';import assert from 'node:assert/strict';
import {newGame,startBattle,setSortie,setDeployment,performAction,beginEnemyPhase,advanceEnemy,checkOutcome,deployZoneOf} from '../src/core/game.js';
import {findUnit,alive,at} from '../src/core/rules.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
const camp=()=>{const s=newGame(4242,{heroes:null,results:[],clears:1,completed:[1],flags:{}},2);s.screen='warroom';return s;};
test('sortie: Erik is locked in, at least one hero goes, reserve heroes return to a free deployment tile',()=>{
 const s=camp();assert.equal(setSortie(s,'eric',false),false);for(const id of ['elina','lia','sain','kai'])assert.ok(setSortie(s,id,false));
 assert.ok(s.units.filter(u=>u.team==='ally'&&u.benched).length===4);assert.equal(alive(findUnit(s,'kai')),false);
 s.screen='deployment';const e=findUnit(s,'eric');const [x,y]=[...deployZoneOf(s)].map(k=>k.split(',').map(Number)).find(([x,y])=>!at(s,x,y));findUnit(s,'kai').x=x;findUnit(s,'kai').y=y;
 assert.ok(setDeployment(s,'eric',x,y),'benched hero does not block a tile');assert.ok(setSortie(s,'kai',true));const k=findUnit(s,'kai');assert.ok(!k.benched&&deployZoneOf(s).has(`${k.x},${k.y}`)&&at(s,k.x,k.y)===k);
 s.screen='battle';assert.equal(setSortie(s,'lia',true),false,'no changes once the battle starts');
});
test('sortie: reserve heroes take no part in battle, saves keep the choice, the victory flag ignores them',()=>{
 const s=camp();setSortie(s,'sain',false);s.screen='deployment';startBattle(s);
 assert.equal(performAction(s,'sain','wait').ok,false);beginEnemyPhase(s);while(s.phase==='enemy'&&!s.outcome)advanceEnemy(s);
 assert.equal(findUnit(s,'sain').hp,findUnit(s,'sain').maxHP,'enemies never target the reserve');const back=deserialize(serialize(s));assert.ok(findUnit(back,'sain').benched);
 for(const u of s.units)if(u.team==='enemy')u.hp=0;findUnit(s,'boss').hp=0;checkOutcome(s);assert.equal(s.outcome,'victory');assert.equal(s.campaign.results.at(-1).allAlive,true);
});
