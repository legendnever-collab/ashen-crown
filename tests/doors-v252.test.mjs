// v2.5.2 (the user's request 2026-11-22 17:14: "마을에서 건물들어가는 입구가 실제 그림에서 한 칸 떨어진 곳들이 있어"):
// every painted door was laid over its painting (scratch overlays, then each door checked tile by tile) and the doors that
// stood on a wall, a pillar, a chest, a brazier or a lamp were moved to the painted doorway. This pins the moved doors and
// checks, for every painted hub, that each door is a solid threshold with a walkable tile in front that leads inside.
import test from 'node:test';import assert from 'node:assert/strict';
import {HUBS} from '../src/data/frontier-data.js';import {newGame} from '../src/core/game.js';
import {enterHub,interactions,walkable,enterInterior,exitInterior} from '../src/core/frontier.js';import {drain} from './campaign-policy.mjs';
const MOVED={ // hub → building → [old, new] entrance tile
 village:{'warroom-2':[[21,8],[20,8]]},forest:{forge:[[5,3],[3,3]],'warroom-2':[[21,8],[20,8]]},saltport:{forge:[[5,3],[4,3]]},
 camp:{'warroom-2':[[17,8],[19,8]]},bivouac:{'inn-1':[[3,3],[4,3]],'warroom-2':[[17,3],[18,3]]},march:{'inn-1':[[3,3],[4,3]]},refuge:{'warroom-2':[[17,3],[18,3]]},
 oathcamp:{'warroom-2':[[17,4],[18,4]]},summit:{'warroom-2':[[17,4],[18,4]]},pilgrim:{'depot-4':[[20,12],[21,12]]},keep:{'warroom-2':[[11,1],[11,2]],'warroom-4':[[12,1],[12,2]]}};
test('v2.5.2: the moved doors stand on their painted doorways',()=>{
 for(const [hub,doors] of Object.entries(MOVED))for(const [bid,[,to]] of Object.entries(doors)){const b=HUBS[hub].buildings.find(q=>q.buildingId===bid);
  assert.deepEqual([b.entrance.tileX,b.entrance.tileY],to,`${hub} ${bid}`);assert.ok(to[0]>=b.x&&to[0]<b.x+b.w&&to[1]>=b.y&&to[1]<b.y+b.h,`${hub} ${bid} inside its building`);}
 assert.deepEqual(HUBS.fortress.buildings.filter(b=>b.buildingId.startsWith('warroom')).map(b=>[b.entrance.tileX,b.entrance.tileY]),[[11,1],[12,1]],'the fortress keeps its own gate');
 for(const h of ['reed','stonewell','frost','lamp','moss','beacon','lionspring','village_raid'])assert.equal(HUBS[h].buildings.find(b=>b.buildingId==='forge').entrance.tileX,5,`${h} forge as the village`);
});
test('v2.5.2: every painted door — solid threshold, free tile in front, entering and leaving from it',()=>{
 for(const [id,h] of Object.entries(HUBS)){if(!h.mask)continue;const s=newGame(17);enterHub(s,{story:false});drain(s);s.frontier.hub=id;delete s.frontier.interior;
  for(const b of h.buildings.filter(b=>b.entrance)){const p=h.places.find(p=>p.buildingId===b.buildingId),e=b.entrance;
   assert.equal(walkable(s,e.tileX,e.tileY),false,`${id} ${b.buildingId} threshold solid`);assert.deepEqual([p.x,p.y],[e.tileX,e.tileY+1],`${id} ${b.buildingId} front`);
   assert.ok(walkable(s,p.x,p.y),`${id} ${b.buildingId} front walkable`);assert.ok(!h.npcs.some(n=>n.x===p.x&&n.y===p.y),`${id} ${b.buildingId} nobody on the front tile`);
   s.frontier.x=p.x;s.frontier.y=p.y;s.frontier.facing='up';assert.ok(interactions(s).some(n=>n.id===p.id),`${id} ${b.buildingId} usable from the front`);
   if(p.interior||p.action==='weapon'||p.action==='item'){assert.ok(enterInterior(s,p.interior?b.buildingId:p.action),`${id} ${b.buildingId} enters`);assert.ok(exitInterior(s),`${id} ${b.buildingId} leaves`);assert.deepEqual([s.frontier.x,s.frontier.y],[p.x,p.y],`${id} ${b.buildingId} back at the door`);}
  }}
});
// v2.5.2 (the user's request 2026-11-22 17:14: "아이템들 구입할 때 설명에 누가 차야 하는지가 다 써 있을 필요가 없어 …
// 할 수 있는 병종만"): the weapon shop names classes, never heroes — not even the ones already in the legion.
import {shopHTML} from '../src/ui/frontier-ui.js';import {HEROES} from '../src/data/game-data.js';import {GEAR} from '../src/data/frontier-data.js';
test('v2.5.2: the weapon shop names the classes, never the heroes',()=>{
 const s=newGame(17);enterHub(s,{story:false});drain(s);const esc=t=>String(t);
 for(const hub of ['village','velmar','capital']){s.frontier.hub=hub;const html=shopHTML(s,'weapon',esc,'eric'),shelf=html.slice(html.indexOf('bag-label'));
  for(const h of HEROES)if(h.id!=='eric')assert.ok(!shelf.includes(h.name),`${hub}: no hero name on the shelf (${h.name})`);
  assert.ok(/보병|기병|창병|궁병|모든 병종/.test(shelf),`${hub}: the classes are named`);}
 assert.ok(Object.values(GEAR).filter(g=>!g.treasure).every(g=>/보병|기병|창병|궁병|마도사|치유사|도적|방패병|모든 병종/.test(g.description)),'every shop description names its classes');
});
