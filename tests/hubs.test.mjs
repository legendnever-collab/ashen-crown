// v0.5.0 painted interlude hubs (D-052): story-moment → hub table, authored walk masks, services
// in every hub, unchanged chest/door counts, staged scenes, and v0.4.0 saves re-anchored on load.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {HUBS,INTERIORS} from '../src/data/frontier-data.js';
import {ART_HUBS,hubFor,stageHubFor} from '../src/data/hubs-v05.js';
import {STORY} from '../src/data/story.js';
import {newGame} from '../src/core/game.js';
import {enterHub,walkable,interactions,enterInterior,exitInterior,frontierPath} from '../src/core/frontier.js';
import {serialize,deserialize} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';

const at=(hub,x,y)=>({frontier:{hub,x,y}});
function reachable(id){const h=HUBS[id],seen=new Set([h.spawn.join()]),q=[h.spawn];while(q.length){const [x,y]=q.shift();for(const [dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const k=`${x+dx},${y+dy}`;if(!seen.has(k)&&walkable(at(id,x+dx,y+dy),x+dx,y+dy)){seen.add(k);q.push([x+dx,y+dy]);}}}return seen;}

test('W3 table: every ACT I story moment has its hub',()=>{
 const want={'1:preparation':'village','1:aftermath':'village','2:preparation':'camp','2:aftermath':'camp','3:preparation':'camp','3:aftermath':'bivouac','4:preparation':'bivouac','4:aftermath':'fortress','5:preparation':'fortress','5:aftermath':'fortress','6:preparation':'fortress','6:aftermath':'oathcamp'};
 for(const [k,hub] of Object.entries(want)){const [m,phase]=k.split(':');assert.equal(hubFor(+m,phase),hub,k);
  const s=newGame(7,null,+m);enterHub(s,{aftermath:phase==='aftermath',story:false});assert.equal(s.frontier.hub,hub,`enterHub ${k}`);assert.ok(walkable(s,s.frontier.x,s.frontier.y),`spawn ${k}`);}
});

test('painted hubs: 24×16 masks, every walkable tile reachable, NPCs/places/doors usable',()=>{
 for(const [id,h] of Object.entries(ART_HUBS)){
  assert.equal(HUBS[id],h,`${id} registered`);assert.equal(h.mask.length,16);assert.ok(h.mask.every(r=>r.length===24));
  const seen=reachable(id);
  for(let y=0;y<16;y++)for(let x=0;x<24;x++)if(walkable(at(id,x,y),x,y))assert.ok(seen.has(`${x},${y}`),`${id} isolated walkable tile ${x},${y}`);
  for(const n of h.npcs)assert.ok([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>seen.has(`${n.x+dx},${n.y+dy}`)),`${id} ${n.id} cannot be approached`);
  for(const p of h.places)assert.ok(seen.has(`${p.x},${p.y}`),`${id} place ${p.id} unreachable`);
  for(const b of h.buildings){const e=b.entrance;assert.equal(walkable(at(id,e.tileX,e.tileY),e.tileX,e.tileY),false,`${id} ${b.buildingId} threshold solid`);}
  assert.ok(h.places.some(p=>p.id==='square'),`${id} square`);
 }
});

test('every painted hub sells weapons and items and seats Lia at the war table',()=>{
 for(const [id,h] of Object.entries(ART_HUBS)){const kinds=new Set(h.npcs.flatMap(n=>n.services||(n.service?[n.service]:[])));
  assert.ok(kinds.has('weapon')&&kinds.has('item'),`${id} services ${[...kinds]}`);
  assert.ok(h.npcs.some(n=>n.id==='advisor')&&h.npcs.some(n=>n.id==='lia')&&h.npcs.some(n=>n.id==='aren'),`${id} cast`);
  const s=newGame(9,null,id==='camp'?2:id==='bivouac'?4:id==='fortress'?5:6);enterHub(s,{aftermath:id==='oathcamp',story:false});drain(s);assert.equal(s.frontier.hub,id);
  assert.ok(interactions(s).some(n=>n.id==='advisor'&&n.npc),`${id} spawns at Lia's war table`);
 }
 assert.deepEqual(ART_HUBS.bivouac.npcs.find(n=>n.id==='merchant').services,['item','weapon'],'wandering merchant sells both');
 assert.deepEqual(ART_HUBS.oathcamp.npcs.find(n=>n.id==='merchant').services,['item','weapon']);
});

test('chest-bearing doors: same five building ids and interior kinds as the v0.4 Border Camp',()=>{
 const legacy={'inn-1':'barracks','warroom-2':'quarters','inn-3':'barracks','warroom-4':'quarters','depot-5':'store'};
 for(const [id,h] of Object.entries(ART_HUBS)){const doors=Object.fromEntries(h.places.filter(p=>p.action==='enter').map(p=>[p.buildingId,p.interior]));assert.deepEqual(doors,legacy,id);
  for(const p of h.places.filter(p=>p.action==='enter')){const s=newGame(3,null,2);enterHub(s,{story:false});drain(s);s.frontier.hub=id;s.frontier.x=p.x;s.frontier.y=p.y;assert.ok(interactions(s).some(n=>n.id===p.id),`${id} ${p.id} at door`);
   assert.ok(enterInterior(s,p.buildingId),`${id} enter ${p.id}`);assert.ok(INTERIORS[s.frontier.interior].generic);s.frontier.x=INTERIORS[s.frontier.interior].spawn[0];s.frontier.y=INTERIORS[s.frontier.interior].spawn[1];assert.ok(exitInterior(s));assert.deepEqual([s.frontier.hub,s.frontier.x,s.frontier.y],[id,p.x,p.y]);}}
});

test('staged scenes use the hub of their moment',()=>{
 assert.equal(STORY['pre:1'][0].stage,'village');assert.equal(STORY['pre:2'][0].stage,'camp');assert.equal(STORY['after:3'][0].stage,'bivouac');assert.equal(STORY['after:3:loss'][0].stage,'bivouac');
 assert.equal(stageHubFor('pre:4'),'bivouac');assert.equal(stageHubFor('after:5'),'fortress');assert.equal(stageHubFor('6:oath'),'oathcamp');
});

test('v0.4.0 ACT I complete save (Border Camp) loads into the oath camp, valid and walkable',()=>{
 const f=JSON.parse(fs.readFileSync(new URL('./fixtures/v040/v040-act1-complete.json',import.meta.url),'utf8')),before=JSON.parse(JSON.parse(f.save).data);
 assert.equal(before.frontier.hub,'camp');const s=deserialize(f.save);assert.equal(s.frontier.hub,'oathcamp');assert.ok(walkable(s,s.frontier.x,s.frontier.y));
 assert.deepEqual(s.campaign.economy,before.campaign.economy);{const sq=HUBS.oathcamp.places.find(p=>p.id==='square');assert.ok(frontierPath(s,sq.x,sq.y));}
 const again=deserialize(serialize(s));assert.equal(again.frontier.hub,'oathcamp');
});

test('a save inside a Border Camp tent keeps the tent when the legion has moved on',()=>{
 const s=newGame(5,null,4);enterHub(s,{story:false});drain(s);s.frontier.hub='camp';const p=HUBS.camp.places.find(p=>p.buildingId==='inn-1');s.frontier.x=p.x;s.frontier.y=p.y;assert.ok(enterInterior(s,'inn-1'));
 s.campaign.frontier=structuredClone(s.frontier);const back=deserialize(serialize(s));assert.equal(back.frontier.hub,'bivouac');assert.equal(back.frontier.interior,'barracks');assert.equal(back.frontier.interiorBuilding,'inn-1');
 assert.ok(exitInterior(back,true));const door=HUBS.bivouac.places.find(p=>p.buildingId==='inn-1');assert.deepEqual([back.frontier.hub,back.frontier.x,back.frontier.y],['bivouac',door.x,door.y]);
});
