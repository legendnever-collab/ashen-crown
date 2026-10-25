// v0.6.0 Phase C engine (D-055/D-056): schema 9, ACT II roster and sortie limit, allied troops and rival
// enemy factions, new terrain, faction trust, ACT II hub plan and west reveal, room-fitting chest styles.
// ACT I behaviour must be untouched (five heroes, no allied units, same targets).
import test from 'node:test';import assert from 'node:assert/strict';
import {newGame,startBattle,setSortie,beginEnemyPhase,advanceEnemy,planEnemy,planAllied,alliedUnit,deployLimit} from '../src/core/game.js';
import {findUnit,hostile,validTarget,terrainCost,rangeFor,strikeStats,alive} from '../src/core/rules.js';
import {HEROES,SCHEMA,TERRAIN,partyIds,RECRUIT_HEROES,heroDef} from '../src/data/game-data.js';
import {MISSIONS} from '../src/data/missions.js';
import {serialize,deserialize,migrate,validate} from '../src/persistence/save-manager.js';
import {joinRoster,recruitRecord} from '../src/core/roster.js';
import {initialTrust,adjustTrust,ensureTrust,trustStage,validTrust,factionRows} from '../src/core/factions.js';
import {HUBS,INTERIORS} from '../src/data/frontier-data.js';
import {roomId,chestStyle,CHEST_STYLES,ROOM_CHESTS} from '../src/data/rooms-v06.js';
import {act2HubFor,hubFor} from '../src/data/hubs-v05.js';
import {frontierState,validateFrontier} from '../src/core/frontier.js';
import {REGIONS} from '../src/data/world.js';

const battle=(seed=11,campaign=null,id=1)=>{const s=newGame(seed,campaign,id);s.screen='deployment';startBattle(s);return s;};
// A 12×10 board copy of mission 1 we can repaint for terrain checks (restored after each use).
function withTile(s,x,y,type,fn){const m=MISSIONS[s.missionId].map,old=m[y][x];m[y][x]=type;try{return fn();}finally{m[y][x]=old;}}

test('schema 9: ACT I parties are exactly the five heroes, sortie limit 5, and an empty roster',()=>{
 assert.equal(SCHEMA,9);
 for(const id of [1,2,3,4,5,6]){const s=newGame(7,null,id);assert.deepEqual(s.units.filter(u=>u.team==='ally').map(u=>u.id),HEROES.map(h=>h.id));assert.equal(deployLimit(s),5);assert.ok(s.units.every(u=>u.team!=='allied'));assert.deepEqual(s.campaign.roster,[]);assert.ok(!s.units.some(u=>u.benched));}
});

test('schema 8 saves migrate to 9 with an empty roster and no trust yet; round trip holds',()=>{
 const s=battle(5);const old=JSON.parse(JSON.stringify(s));old.schema=8;old.version='0.5.0';delete old.campaign.roster;old.stageStart.schema=8;delete old.stageStart.campaign.roster;
 const m=migrate(old);assert.equal(m.schema,9);assert.deepEqual(m.campaign.roster,[]);assert.equal(m.campaign.factionTrust,undefined);assert.equal(m.stageStart.schema,9);
 assert.deepEqual(m.units.map(u=>[u.id,u.hp,u.x,u.y]),s.units.map(u=>[u.id,u.hp,u.x,u.y]));
 assert.equal(deserialize(serialize(m)).schema,9);
});

test('a recruit joins at a level, gets slots and a hub place, and fields only within the sortie limit',()=>{
 const rec=recruitRecord('thea',8);assert.equal(rec.level,8);assert.equal(rec.maxHP,heroDef('thea').hp+7*heroDef('thea').growth.hp);assert.equal(rec.growthHistory.length,7);
 const camp=newGame(3,null,6);camp.screen='exploration';camp.frontier=frontierState(6);camp.campaign.frontier=structuredClone(camp.frontier);camp.campaign.heroes=structuredClone(camp.units.filter(u=>u.team==='ally'));
 assert.ok(joinRoster(camp,'thea',8));assert.ok(!joinRoster(camp,'thea',8),'joins once');assert.ok(!joinRoster(camp,'nobody'));
 assert.deepEqual(camp.campaign.roster,['thea']);assert.ok(camp.economy.equipped.thea&&camp.campaign.economy.equipped.thea);assert.ok(camp.frontier.members.includes('thea'));validateFrontier(camp.frontier);
 assert.deepEqual(partyIds(camp.campaign),['eric','elina','lia','sain','kai','thea']);
 // ACT I mission (limit 5): Thea starts in reserve and cannot be added until someone else stays back.
 const s=newGame(4,camp.campaign,6);s.screen='deployment';const thea=findUnit(s,'thea');
 assert.equal(thea.level,8);assert.ok(thea.benched);assert.equal(s.units.filter(u=>u.team==='ally'&&!u.benched).length,5);
 assert.ok(!setSortie(s,'thea',true));assert.ok(setSortie(s,'kai',false));assert.ok(setSortie(s,'thea',true));assert.ok(!thea.benched);
 assert.ok(startBattle(s));validate(s);assert.equal(deserialize(serialize(s)).units.filter(u=>u.team==='ally').length,6);
 // A mission with a six-hero sortie fields her from the start.
 const m=MISSIONS[6],had=m.deployLimit;m.deployLimit=6;try{const t=newGame(4,camp.campaign,6);assert.equal(deployLimit(t),6);assert.ok(t.units.filter(u=>u.team==='ally').every(u=>!u.benched));const spot=findUnit(t,'thea');assert.ok(spot.x>=0&&spot.y>=0);assert.ok(!t.units.some(o=>o!==spot&&alive(o)&&o.x===spot.x&&o.y===spot.y));}finally{if(had===undefined)delete m.deployLimit;else m.deployLimit=had;}
});

test('sides: heroes and allied troops are one side; rival enemy factions fight each other unless in truce',()=>{
 const s=battle(9),eric=findUnit(s,'eric'),foe=s.units.find(u=>u.team==='enemy'),civ=s.units.find(u=>u.team==='civilian');
 const ally=alliedUnit({id:'ic1',name:'Iron Guard',kind:'soldier',x:0,y:9,hp:30,atk:12,def:6,res:2,spd:5,mov:3,range:[1,1]});
 assert.ok(hostile(s,eric,foe));assert.ok(hostile(s,ally,foe));assert.ok(!hostile(s,eric,ally));assert.ok(!hostile(s,foe,civ));
 const a={team:'enemy',faction:'lordA'},b={team:'enemy',faction:'lordB'};assert.ok(hostile(s,a,b));assert.ok(!hostile(s,a,{...a}));assert.ok(!hostile(s,{team:'enemy'},b),'unaligned enemies never fight');
 s.truce=true;assert.ok(!hostile(s,a,b));delete s.truce;
 ally.x=eric.x+1;ally.y=eric.y;assert.ok(!validTarget(s,eric,ally),'heroes cannot strike allied troops');
});

test('allied troops act first in the enemy phase, hold their post, strike in reach and are targeted by enemies',()=>{
 const s=battle(12);for(const e of s.units.filter(u=>u.team==='enemy'))e.hp=0;const foe=s.units.find(u=>u.team==='enemy');foe.hp=foe.maxHP;foe.x=5;foe.y=3;
 const ally=alliedUnit({id:'ic1',name:'Iron Guard',kind:'soldier',x:5,y:5,hp:30,atk:14,def:6,res:2,spd:5,mov:3,range:[1,1],post:{x:5,y:5},leash:1});s.units.push(ally);
 for(const h of s.units.filter(u=>u.team==='ally')){h.x=1+HEROES.findIndex(x=>x.id===h.id);h.y=9;}
 const p=planAllied(s,ally);assert.equal(p.target,foe.id);assert.ok(Math.abs(p.x-5)+Math.abs(p.y-5)<=1,'stays within its leash');
 assert.ok(beginEnemyPhase(s));assert.equal(s.enemyQueue[0],'ic1','allied troops move before enemies');
 const hp=foe.hp;advanceEnemy(s);assert.ok(foe.hp<hp,'allied strike landed or was countered fairly');
 const plan=planEnemy(s,foe);if(plan.target)assert.ok(['ic1',...HEROES.map(h=>h.id)].includes(plan.target));
 // Far from its post with no foe in reach, an allied soldier walks back instead of chasing.
 const far=battle(13);for(const e of far.units.filter(u=>u.team==='enemy'))e.hp=0;const g=alliedUnit({id:'ic2',name:'Iron Guard',kind:'soldier',x:2,y:2,hp:30,atk:14,def:6,res:2,spd:5,mov:3,range:[1,1],post:{x:2,y:5},leash:0});far.units.push(g);
 const back=planAllied(far,g);assert.ok(Math.abs(back.x-2)+Math.abs(back.y-5)<3);assert.equal(back.target,null);
});

test('ACT II terrain: snow, ice bridge, rooftop high ground, alley — by movement profile',()=>{
 const s=battle(2),eric=findUnit(s,'eric'),kai=findUnit(s,'kai'),elina=findUnit(s,'elina');
 const cav={...eric,id:'cav',movementProfile:'cavalry'};
 withTile(s,4,5,'n',()=>{assert.equal(terrainCost(s,eric,4,5),2);assert.equal(terrainCost(s,kai,4,5),1);assert.equal(terrainCost(s,cav,4,5),2);});
 withTile(s,4,5,'o',()=>{assert.equal(terrainCost(s,eric,4,5),2);assert.equal(terrainCost(s,cav,4,5),Infinity);});
 withTile(s,4,5,'l',()=>{assert.equal(terrainCost(s,cav,4,5),2);assert.equal(terrainCost(s,eric,4,5),1);});
 withTile(s,4,5,'i',()=>assert.equal(terrainCost(s,eric,4,5),1));
 // Rooftop: +2 defense for the one standing on it, and a bow on a roof reaches one tile further.
 const foe=s.units.find(u=>u.team==='enemy');foe.x=4;foe.y=5;const atk={...eric,x:4,y:6};
 const flat=strikeStats(s,atk,foe).damage,roof=withTile(s,4,5,'o',()=>strikeStats(s,atk,foe).damage);assert.equal(flat-roof,Math.min(2,flat-1));
 elina.x=4;elina.y=5;assert.deepEqual(rangeFor(elina,'attack',s),[2,3]);withTile(s,4,5,'o',()=>assert.deepEqual(rangeFor(elina,'attack',s),[2,4]));
 assert.equal(TERRAIN.o.high,true);
});

test('faction trust: seeded from ACT I, clamped −2…+3, shown as stages, validated',()=>{
 assert.deepEqual(initialTrust({choices:{m04_records_choice:'reported'}}),{iron:-1,free:0,flame:0});assert.deepEqual(initialTrust({choices:{m04_records_choice:'kept'}}),{iron:0,free:0,flame:0});
 const c={choices:{},completed:[1,2,3,4,5,6],flags:{}};ensureTrust(c);assert.equal(adjustTrust(c,'free',5,'test'),3);assert.equal(c.factionTrust.free,3);assert.equal(adjustTrust(c,'iron',-9,'x'),-2);assert.equal(adjustTrust(c,'nobody',1),0);
 assert.deepEqual([-2,-1,0,1,2,3].map(v=>trustStage(v).ko),['경계','경계','중립','신뢰','신뢰','동맹']);
 assert.ok(validTrust(c));assert.ok(!validTrust({factionTrust:{iron:4}}));assert.ok(!validTrust({factionTrust:{iron:0,gold:1}}));assert.ok(validTrust({}));
 const rows=factionRows(c);assert.deepEqual(rows.filter(r=>r.met).map(r=>r.id),['iron'],'only the Iron Crown is met by the end of ACT I');
 const s=battle(3);s.campaign.factionTrust={iron:7,free:0,flame:0};assert.throws(()=>serialize(s));
});

test('ACT II hub plan and the west reveal; ACT I hub table unchanged',()=>{
 assert.deepEqual([[7,'preparation'],[7,'aftermath'],[8,'preparation'],[8,'aftermath'],[9,'preparation'],[9,'aftermath'],[10,'preparation'],[10,'aftermath']].map(([m,p])=>act2HubFor(m,p)),['castletown','castletown','castletown','bivouac','velmar','velmar','velmar','velmar']);
 assert.deepEqual([1,2,3,4,5,6].flatMap(m=>['preparation','aftermath'].map(p=>hubFor(m,p))),['village','village_raid','camp','camp','camp','bivouac','bivouac','fortress','fortress','fortress','fortress','oathcamp']);
 const west=REGIONS.find(r=>r.id==='west');assert.ok(!west.shown({completed:[1,2,3,4,5,6,7]}));assert.ok(west.shown({completed:[1,2,3,4,5,6,7,8]}));
});

test('every chest in every hub building has a style that fits its room',()=>{
 const expect={'village:inn-1':'int_village_barracks','village:warroom-2':'int_village_hall','village:residence-3':'int_village_house','village:depot-4':'int_village_store',
  'camp:inn-1':'int_tent_triage','camp:inn-3':'int_tent_soldier','camp:warroom-2':'int_tent_command','camp:warroom-4':'int_tent_operations','camp:depot-5':'int_tent_supply',
  'bivouac:inn-1':'int_tent_soldier','oathcamp:warroom-4':'int_tent_operations','fortress:depot-5':'int_fort_armory','fortress:inn-3':'int_fort_barracks','fortress:warroom-2':'int_fort_records','fortress:warroom-4':'int_fort_command'};
 for(const [k,room] of Object.entries(expect)){const [hub,b]=k.split(':'),p=HUBS[hub].places.find(p=>p.buildingId===b);assert.equal(roomId(hub,p.interior,b),room,k);}
 assert.equal(roomId('village','weapon'),'int_village_forge');assert.equal(roomId('village_raid','item'),'int_village_shop');
 let n=0;for(const [hub,h] of Object.entries(HUBS))for(const p of h.places.filter(p=>p.action==='enter')){const room=roomId(hub,p.interior,p.buildingId);assert.ok(room,`${hub}:${p.buildingId}`);
  for(const b of INTERIORS[p.interior].buildings.filter(b=>b.type==='chest')){const st=chestStyle(room,b.chestId);assert.notEqual(st,'old_chest',`${hub}:${p.buildingId}:${b.chestId}`);assert.ok(CHEST_STYLES.includes(st));n++;}}
 assert.ok(n>=30,`${n} chests checked`);
 for(const styles of Object.values(ROOM_CHESTS))for(const st of Object.values(styles))assert.ok(CHEST_STYLES.includes(st));
 assert.equal(new Set(Object.values(ROOM_CHESTS).flatMap(Object.values)).size,19,'19 room styles + the old_chest fallback');
});

test('recruit definitions are complete and never part of ACT I',()=>{
 for(const h of RECRUIT_HEROES){for(const k of ['hp','mp','atk','def','mag','res','spd','mov','cost'])assert.ok(Number.isInteger(h[k]),`${h.id}.${k}`);assert.ok(h.growth&&h.range&&h.name&&h.ko);}
 assert.equal(HEROES.length,5);assert.ok(!HEROES.some(h=>RECRUIT_HEROES.some(r=>r.id===h.id)));
});
