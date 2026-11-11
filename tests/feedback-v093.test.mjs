// v0.9.3 (D-092): the user's four play-test notes — zone of control (rogues exempt), heals and Purify on anyone,
// Thea's (and Ines') capital weapon. Tap-to-cancel is a UI rule and is checked in tests/feedback-v093-e2e.mjs.
import test from 'node:test';import assert from 'node:assert/strict';
import {newGame,startBattle,performAction} from '../src/core/game.js';
import {findUnit,alive,movement,validTarget,key,controlZone,supportable,ZOC_FREE} from '../src/core/rules.js';
import {GEAR} from '../src/data/frontier-data.js';
import {drain} from './campaign-policy.mjs';
const camp=(extra={})=>({heroes:null,results:[],clears:0,completed:[],flags:{},choices:{},roster:[],...extra});
function board(level=6){const s=newGame(11,camp(),1);s.screen='deployment';startBattle(s);drain(s);for(const u of s.units.filter(u=>u.team==='ally'))u.level=level;
 for(const e of s.units.filter(u=>u.team==='enemy'))e.hp=0;for(const c of s.units.filter(u=>u.team==='civilian'))c.x=-40-c.x;return s;}
const foe=(s,x,y,more={})=>{const e=s.units.find(u=>u.team==='enemy'&&u.id!=='boss');Object.assign(e,{hp:e.maxHP,x,y,status:null,...more});return e;};
const place=(u,x,y)=>{u.x=x;u.y=y;u.moved=false;u.acted=false;};
const park=(s,ids)=>{for(const id of ids){const u=findUnit(s,id);u.x=-20-ids.indexOf(id);u.y=-20;}};
const adjacent=(a)=>new Set([[0,-1],[-1,0],[1,0],[0,1]].map(([dx,dy])=>key(a.x+dx,a.y+dy)));
// No reachable tile may be reached through a tile beside the foe; the tile beside the foe may only be an end point.
function assertHeld(m,start,zone){for(const k of m.costs.keys()){let p=m.prev.get(k);while(p&&p!==start){assert.ok(!zone.has(p),`path to ${k} passes ${p} beside a foe`);p=m.prev.get(p);}}}

test('zone of control: an enemy that steps beside a hero stops there; without the hero it walks on',()=>{
 const s=board();park(s,['elina','lia','sain','kai']);const e=findUnit(s,'eric');place(e,6,8);const b=foe(s,6,4,{mov:6});
 const held=movement(s,b),start=key(b.x,b.y);assertHeld(held,start,adjacent(e));assert.ok(held.costs.has(key(6,7)),'may step beside Eric');
 e.x=-30;const free=movement(s,b);assert.ok(free.costs.size>held.costs.size,'the zone shrinks the reach');assert.ok(free.costs.has(key(6,9)));
});
test('zone of control works both ways: a hero beside an enemy stops; the rogue Kai and civilians pass',()=>{
 const s=board();park(s,['elina','lia','sain']);const b=foe(s,6,6,{mov:0});const e=findUnit(s,'eric'),k=findUnit(s,'kai');place(e,6,8);place(k,5,8);
 assert.ok(controlZone(s,e)?.has(key(6,7)),'Eric is held beside the bandit');assertHeld(movement(s,e),key(e.x,e.y),adjacent(b));
 assert.ok(ZOC_FREE.has('rogue'));assert.equal(controlZone(s,k),null,'Kai (rogue) ignores the zone');
 const km=movement(s,k);assert.ok([...km.costs.keys()].some(t=>{let p=km.prev.get(t);while(p&&p!==key(k.x,k.y)){if(adjacent(b).has(p))return true;p=km.prev.get(p);}return false;}),'Kai may slip past the bandit');
 const civ=s.units.find(u=>u.team==='civilian');assert.equal(controlZone(s,civ),null,'civilians are never held');
});
test('zone of control: units that cannot strike (props, clerks, benched, range 0) hold no ground',()=>{
 const s=board();park(s,['elina','lia','sain','kai']);const e=findUnit(s,'eric');place(e,6,8);const b=foe(s,6,6,{mov:0});
 b.atk=0;assert.equal(controlZone(s,e),null,'a foe with no attack does not hold');b.atk=10;b.prop=true;assert.equal(controlZone(s,e),null);delete b.prop;
 assert.ok(controlZone(s,e));b.hp=0;assert.equal(controlZone(s,e),null,'the fallen hold nothing');
});
test('Sain heals anyone: a hero, a civilian, even an enemy — healing a foe earns no EXP or gear EXP',()=>{
 const s=board();const sain=findUnit(s,'sain');place(sain,5,8);
 const civ=s.units.find(u=>u.team==='civilian');civ.x=5;civ.y=7;civ.hp=Math.max(1,civ.maxHP-12);assert.ok(supportable(civ));assert.ok(validTarget(s,sain,civ,'skill'),'a civilian can be healed');
 const b=foe(s,6,8);b.hp=b.maxHP-15;assert.ok(validTarget(s,sain,b,'skill'),'an enemy can be healed');
 const xp=sain.xp,earned=sain.earnedXP,hp=b.hp;const r=performAction(s,'sain','skill',b.id);assert.ok(r.ok,r.error);
 assert.ok(b.hp>hp,'the enemy is healed');assert.equal(sain.xp,xp);assert.equal(sain.earnedXP,earned,'no EXP for healing a foe');
});
test('Purify reaches anyone too; purifying a foe clears it but earns nothing',()=>{
 const s=board(13);const sain=findUnit(s,'sain');place(sain,5,8);const b=foe(s,5,7,{status:{poison:3}});
 const earned=sain.earnedXP;const r=performAction(s,'sain','purify',b.id);assert.ok(r.ok,r.error);assert.ok(!b.status,'the foe is purified');assert.equal(sain.earnedXP,earned);
 const s2=board(13),sn=findUnit(s2,'sain'),kai=findUnit(s2,'kai');place(sn,5,8);place(kai,5,7);kai.status={poison:3};const e2=sn.earnedXP;
 assert.ok(performAction(s2,'sain','purify','kai').ok);assert.ok(sn.earnedXP>e2,'purifying a hero still teaches');
});
test('Thea has a capital lance (and Ines a capital mace) on the lower-city shelf',()=>{
 const l=GEAR.royalLance,m=GEAR.royalMace;assert.deepEqual(l.heroes,['thea','baldrick']); /* v0.10.1: and Baldrick */assert.equal(l.home,'capital');assert.equal(l.after,15);assert.equal(l.bonus.atk,6);assert.equal(l.bonus.chargeDmg,2);
 assert.ok(l.bonus.atk>GEAR.crownGuardLance.bonus.atk,'better than the guard lance');assert.deepEqual(m.heroes,['ines']);assert.equal(m.after,16);
});
