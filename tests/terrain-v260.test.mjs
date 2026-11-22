// v2.6.0 「지형과 성장」 (D-152, docs/v2.6.0/TERRAIN_XP_DESIGN.md): movement by class on every terrain, the forest that stops
// foot soldiers and shuts out riders, the map check for riders, and fire by the ground (the water's edge damps it).
import test from 'node:test';import assert from 'node:assert/strict';
import {newGame,startBattle,deployZoneOf} from '../src/core/game.js';import {MISSIONS,missionOf} from '../src/data/missions.js';
import {TERRAIN,TERRAIN_COSTS,STOP_TERRAIN} from '../src/data/game-data.js';
import {movement,terrainCost,stopsAt,moveProfile,fireMul,waterEdge,terrainSummary,findUnit} from '../src/core/rules.js';import {effectiveStats} from '../src/core/economy.js';
const battle=id=>{const s=newGame(7,null,id);s.screen='deployment';startBattle(s);return s;};
test('v2.6.0: the movement table (foot · rogue · rider)',()=>{
 const want={infantry:{r:1,g:1,v:1,b:1,d:2,n:2,i:1,l:1,o:2,m:3,s:3},rogue:{r:1,g:1,v:1,b:1,f:1,d:1,n:1,i:1,l:1,o:1,m:1,s:2},cavalry:{r:1,g:1,v:1,b:1,f:Infinity,d:2,n:2,i:2,l:2,o:Infinity,m:Infinity,s:Infinity}};
 for(const [p,row] of Object.entries(want))for(const [t,c] of Object.entries(row))assert.equal(TERRAIN_COSTS[p][t],c,`${p} ${TERRAIN[t].ko}`);
 assert.ok(STOP_TERRAIN.infantry.has('f')&&!STOP_TERRAIN.rogue&&!STOP_TERRAIN.cavalry,'only foot soldiers stop in a forest');
});
// the M01 field: a foot soldier, a rogue and a rider set beside a forest
function besideForest(s){const m=missionOf(s);for(let y=1;y<m.height-1;y++)for(let x=1;x<m.width-1;x++)if('grv'.includes(m.map[y][x])&&m.map[y][x+1]==='f'&&m.map[y][x+2]==='f'&&!s.units.some(u=>u.hp>0&&u.id!=='eric'&&Math.abs(u.x-x)+Math.abs(u.y-y)<=3))return [x,y];return null;}
test('v2.6.0: a foot soldier stops on the first forest tile; a rogue walks through; a rider stays out',()=>{
 const s=battle(1),m=missionOf(s),spot=besideForest(s);assert.ok(spot,'a quiet forest edge on M01');const [x,y]=spot,foot=findUnit(s,'eric');foot.x=x;foot.y=y;
 const mov=effectiveStats(s,foot).mov,{costs,prev}=movement(s,foot);
 assert.equal(costs.get(`${x+1},${y}`),mov,'the first forest tile takes the whole move');assert.ok(!costs.has(`${x+2},${y}`),'no second forest tile in one turn');
 for(const k of costs.keys()){let p=prev.get(k);while(p&&p!==`${x},${y}`){const [px,py]=p.split(',').map(Number);assert.notEqual(m.map[py][px],'f',`${k} reached through a forest`);p=prev.get(p);}}
 assert.ok(stopsAt(s,foot,x+1,y)&&/들어서면 이동 끝/.test(terrainSummary(s,x+1,y,foot)),'the tile summary says so');
 foot.x=x+1;const inside=movement(s,foot).costs;assert.ok(inside.has(`${x+2},${y}`)&&inside.get(`${x+2},${y}`)===mov,'inside the forest: one tile a turn');
 const rogue={...foot,id:'r',movementProfile:'rogue',x,y};s.units.push(rogue);assert.equal(movement(s,rogue).costs.get(`${x+2},${y}`),2,'a rogue walks a forest at 1');
 const rider={...foot,id:'c',movementProfile:'cavalry',x,y};s.units.push(rider);const rc=movement(s,rider).costs;assert.ok(![...rc.keys()].some(k=>{const [a,b]=k.split(',').map(Number);return m.map[b][a]==='f';}),'a rider never enters a forest');
 assert.equal(terrainCost(s,rider,x+1,y),Infinity);assert.match(terrainSummary(s,x+1,y),/보병 들어서면 멈춤 · 도적 1 · 기병 불가/);
});
// the map check (§2): no rider starts, is deployed or arrives in a forest, and every rider wave can reach the legion
const reach=(m,from,prof)=>{const seen=new Set(from.map(p=>p.join(','))),q=[...from];while(q.length){const [x,y]=q.shift();for(const [dx,dy] of [[0,1],[1,0],[0,-1],[-1,0]]){const nx=x+dx,ny=y+dy,k=nx+','+ny,t=m.map[ny]?.[nx];if(seen.has(k)||!t||m.layers?.collision?.[ny]?.[nx]||!Number.isFinite(TERRAIN_COSTS[prof]?.[t]??TERRAIN[t].cost))continue;seen.add(k);q.push([nx,ny]);}}return seen;};
test('v2.6.0: every map — riders never stand in a forest and their waves can reach the legion',()=>{
 for(const id of Object.keys(MISSIONS).map(Number)){const s=battle(id),m=missionOf(s),zone=[...deployZoneOf(s)].map(k=>k.split(',').map(Number)),near=r=>zone.some(([x,y])=>[[x,y],[x+1,y],[x-1,y],[x,y+1],[x,y-1]].some(p=>r.has(p.join(','))));
  for(const u of s.units.filter(u=>u.hp>0&&moveProfile(u)==='cavalry'))assert.notEqual(m.map[u.y][u.x],'f',`M${id} ${u.id} starts in a forest`);
  for(const w of m.waves||[])for(const u of (w.units||[]).filter(u=>u.movementProfile==='cavalry'||u.kind==='cavalry')){assert.notEqual(m.map[u.y][u.x],'f',`M${id} wave rider ${u.id} arrives in a forest`);assert.ok(near(reach(m,[[u.x,u.y]],'cavalry')),`M${id} wave rider ${u.id} can reach the legion`);}
  for(const u of s.units.filter(u=>u.hp>0&&moveProfile(u)==='cavalry'&&u.team==='enemy'))assert.ok(near(reach(m,[[u.x,u.y]],'cavalry')),`M${id} rider ${u.id} can reach the legion`);}
});
test('v2.6.0: a rider is never set down in a forest — deployment, the bench and a hero joining',async()=>{
 const s=battle(11),m=missionOf(s),zone=[...deployZoneOf(s)].map(k=>k.split(',').map(Number)),forest=zone.find(([x,y])=>m.map[y][x]==='f');assert.ok(forest,'M11 has forest in its deployment zone');
 const {setDeployment}=await import('../src/core/game.js');s.screen='deployment';const foot=s.units.find(u=>u.team==='ally'&&!u.benched&&moveProfile(u)==='infantry');
 assert.ok(setDeployment(s,foot.id,...forest),'a foot soldier may deploy in the forest');foot.movementProfile='cavalry';
 const open=zone.find(([x,y])=>m.map[y][x]!=='f'&&!s.units.some(u=>u.x===x&&u.y===y));foot.x=open[0];foot.y=open[1];assert.equal(setDeployment(s,foot.id,...forest),false,'a rider may not');
});
test('v2.6.0: fire by the ground — forest ×1.5, the water\'s edge ×0.5 (and it wins over forest)',()=>{
 for(const id of Object.keys(MISSIONS).map(Number)){const s=battle(id),m=missionOf(s);
  for(let y=0;y<m.height;y++)for(let x=0;x<m.width;x++){const t=m.map[y][x],edge=['s','b','i'].includes(t)||[[0,-1],[-1,0],[1,0],[0,1]].some(([dx,dy])=>m.map[y+dy]?.[x+dx]==='w');
   assert.equal(waterEdge(s,x,y),edge,`M${id} ${x},${y}`);assert.equal(fireMul(s,x,y),edge?Math.min(TERRAIN[t].fire??1,.5):TERRAIN[t].fire??1,`M${id} ${x},${y} ${t}`);}}
 const s=battle(18),m=missionOf(s);let wetForest=null;for(let y=0;y<m.height&&!wetForest;y++)for(let x=0;x<m.width;x++)if(m.map[y][x]==='f'&&waterEdge(s,x,y)){wetForest=[x,y];break;}
 if(wetForest){assert.equal(fireMul(s,...wetForest),.5);assert.match(terrainSummary(s,...wetForest),/물가 · 🔥 50%↓/);}
 let dry=null;for(let y=0;y<m.height&&!dry;y++)for(let x=0;x<m.width;x++)if(m.map[y][x]==='f'&&!waterEdge(s,x,y)){dry=[x,y];break;}assert.equal(fireMul(s,...dry),1.5);assert.match(terrainSummary(s,...dry),/🔥 50%↑/);
});
