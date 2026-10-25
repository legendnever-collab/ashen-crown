// v0.6 painted interiors (D-056, art pack A): every ACT I building opens a painted room whose authored walk mask
// keeps the doorway, every floor tile, every chest and the shopkeeper reachable; chest ids, interior kinds and
// rewards are those of the v0.4 templates; the shipped WebPs equal the hash-verified import log.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import {HUBS,INTERIORS} from '../src/data/frontier-data.js';
import {ROOM_LAYOUTS,paintedRoom,roomId,chestStyle,CHEST_STYLES} from '../src/data/rooms-v06.js';
import {newGame} from '../src/core/game.js';
import {enterHub,enterInterior,exitInterior,currentHub,walkable,interactions,stepAren,frontierPath,openChest} from '../src/core/frontier.js';
import {transact} from '../src/core/economy.js';
import {serialize,deserialize,migrate} from '../src/persistence/save-manager.js';
import {drain} from './campaign-policy.mjs';

const ACT1_HUBS=['village','village_raid','camp','bivouac','fortress','oathcamp'];
const rooms=()=>ACT1_HUBS.flatMap(hub=>[...HUBS[hub].places.filter(p=>p.action==='enter').map(p=>[hub,p.interior,p.buildingId]),...(hub.startsWith('village')?[[hub,'weapon',undefined],[hub,'item',undefined]]:[])]);

test('all 15 painted rooms are used by the ACT I hubs, each with a 12×8 mask',()=>{
 const used=new Set(rooms().map(r=>roomId(...r)));assert.deepEqual([...used].sort(),Object.keys(ROOM_LAYOUTS).sort());assert.equal(used.size,15);
 for(const r of rooms()){const h=paintedRoom(...r);assert.ok(h,r.join(':'));assert.equal(h.mask.length,8);assert.ok(h.mask.every(row=>row.length===12));}
});

test('masks: doorway and spawn walkable, every floor tile reachable, chests solid and reachable, shopkeeper within reach',()=>{
 for(const r of rooms()){const h=paintedRoom(...r),id=r.join(':'),open=(x,y)=>h.mask[y]?.[x]==='.'&&!h.npcs.some(n=>n.x===x&&n.y===y);
  for(const [x,y] of h.doors)assert.ok(open(x,y),`${id} door ${x},${y}`);assert.ok(open(...h.spawn),`${id} spawn`);
  const seen=new Set([h.spawn.join(',')]),q=[h.spawn];while(q.length){const [x,y]=q.shift();for(const [dx,dy] of [[0,1],[1,0],[-1,0],[0,-1]]){const k=`${x+dx},${y+dy}`;if(!seen.has(k)&&open(x+dx,y+dy)){seen.add(k);q.push([x+dx,y+dy]);}}}
  for(let y=0;y<8;y++)for(let x=0;x<12;x++)if(open(x,y))assert.ok(seen.has(`${x},${y}`),`${id} floor ${x},${y} reachable`);
  const base=INTERIORS[r[1]].buildings.filter(b=>b.type==='chest').map(b=>b.chestId).sort();assert.deepEqual(h.buildings.map(b=>b.chestId).sort(),base,`${id} same chest ids`);
  for(const b of h.buildings){assert.equal(h.mask[b.y][b.x],'#',`${id} chest ${b.chestId} solid`);assert.ok([[0,1],[1,0],[-1,0],[0,-1]].some(([dx,dy])=>seen.has(`${b.x+dx},${b.y+dy}`)),`${id} chest ${b.chestId} reachable`);
   const st=chestStyle(roomId(...r),b.chestId);assert.ok(CHEST_STYLES.includes(st)&&st!=='old_chest');}
  for(const n of h.npcs)assert.ok([...seen].some(k=>{const [x,y]=k.split(',').map(Number);return Math.abs(x-n.x)+Math.abs(y-n.y)<=(n.reach||1);}),`${id} ${n.id} reachable`);
  assert.equal(h.generic,INTERIORS[r[1]].generic);assert.equal(h.service,INTERIORS[r[1]].service);
 }
});

test('walking: enter the triage tent, open both chests by walking, leave through the doorway; save round trip in the room',()=>{
 const s=newGame(31,{heroes:null,results:[],clears:1,completed:[1],flags:{}},2);enterHub(s,{story:false});drain(s);assert.equal(s.frontier.hub,'camp');
 const door=HUBS.camp.places.find(p=>p.buildingId==='inn-1');const walk=(x,y)=>{const p=frontierPath(s,x,y);assert.ok(p,`path to ${x},${y}`);for(const [a,b] of p.slice(1))assert.ok(stepAren(s,a-s.frontier.x,b-s.frontier.y));};
 walk(door.x,door.y);assert.ok(enterInterior(s,'inn-1'));const h=currentHub(s);assert.equal(h.art,'int_tent_triage');assert.deepEqual([s.frontier.x,s.frontier.y],h.spawn);
 for(const id of ['a','b']){const c=h.places.find(p=>p.chestId===id),spot=[[0,1],[1,0],[-1,0],[0,-1]].map(([dx,dy])=>[c.x+dx,c.y+dy]).find(([x,y])=>walkable(s,x,y));walk(...spot);assert.ok(openChest(s,id,transact).ok,id);}
 const back=deserialize(serialize(s));assert.equal(currentHub(back).art,'int_tent_triage');assert.ok(walkable(back,back.frontier.x,back.frontier.y));
 walk(6,6);assert.ok(stepAren(s,0,1));assert.equal(s.frontier.interior,undefined,'the doorway leads out');assert.deepEqual([s.frontier.x,s.frontier.y],[door.x,door.y]);
});

test('night hubs dim the same room; a v0.5 save standing on an old template tile is moved to the room entrance',()=>{
 assert.equal(paintedRoom('bivouac','barracks','inn-1').night,true);assert.equal(paintedRoom('camp','barracks','inn-3').night,false);assert.equal(paintedRoom('bivouac','barracks','inn-1').art,'int_tent_soldier');
 const s=newGame(5);enterHub(s,{story:false});drain(s);const door=HUBS.village.places.find(p=>p.buildingId==='inn-1');Object.assign(s.frontier,{x:door.x,y:door.y});assert.ok(enterInterior(s,'inn-1'));
 const raw=JSON.parse(JSON.stringify({...s,feedback:[]}));raw.schema=8;raw.version='0.5.0';delete raw.campaign.roster;raw.frontier.x=5;raw.frontier.y=2;raw.campaign.frontier=structuredClone(raw.frontier); // a bunk in the painting
 const m=migrate(raw);assert.equal(m.frontier.interior,'barracks');assert.ok(walkable(m,m.frontier.x,m.frontier.y));assert.deepEqual([m.frontier.x,m.frontier.y],currentHub(m).spawn);
});

test('shipped room and chest WebPs equal the hash-verified import log',()=>{
 const root=new URL('../src/assets/',import.meta.url),sha=p=>crypto.createHash('sha256').update(fs.readFileSync(new URL(p,root))).digest('hex');
 const [head,...rows]=fs.readFileSync(new URL('room-art-import-log.csv',root),'utf8').trim().split('\n'),cols=head.split(','),last=new Map();for(const r of rows){const o=Object.fromEntries(cols.map((c,i)=>[c,r.split(',')[i]]));last.set(o.webp,o);}
 const all=[...last.values()];assert.equal(all.filter(r=>r.kind==='room').length,15);assert.equal(all.filter(r=>r.kind==='chest').length,24);
 for(const r of all)assert.equal(sha(`${r.kind==='room'?'rooms':'chests'}/${r.webp}`),r.webp_sha256,r.webp);
 for(const id of Object.keys(ROOM_LAYOUTS))assert.ok(last.has(`${id}.webp`),id);
});
