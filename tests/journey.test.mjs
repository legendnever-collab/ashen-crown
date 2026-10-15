import test from 'node:test';import assert from 'node:assert/strict';
import {HUBS} from '../src/data/frontier-data.js';
import {newGame} from '../src/core/game.js';import {enterHub,interactions,walkable,enterInterior,exitInterior,openCouncil} from '../src/core/frontier.js';import {drain} from './campaign-policy.mjs';
const hub=id=>{const s=newGame(17,null,id);enterHub(s);drain(s);return s;};
test('All doors share visual tile anchor / front-only approach / solid threshold / exact return',()=>{for(const id of [1,2]){const s=hub(id);for(const b of HUBS[s.frontier.hub].buildings.filter(b=>b.entrance)){
 const p=HUBS[s.frontier.hub].places.find(p=>p.buildingId===b.buildingId),e=b.entrance;
 assert.equal(p.entrance,e);assert.equal(p.x,e.tileX);assert.equal(p.y,e.tileY+1);assert.equal(walkable(s,e.tileX,e.tileY),false);
 for(const [x,y]of [[e.tileX,b.y-1],[b.x-1,e.tileY],[b.x+b.w,e.tileY],[e.tileX-1,p.y]]){s.frontier.x=x;s.frontier.y=y;assert.equal(interactions(s).some(n=>n.id===p.id),false);}
 s.frontier.x=p.x;s.frontier.y=p.y;assert.ok(walkable(s,p.x,p.y));assert.ok(interactions(s).some(n=>n.id===p.id));if(['weapon','item'].includes(p.action)){assert.ok(enterInterior(s,p.action));assert.ok(exitInterior(s));assert.deepEqual([s.frontier.x,s.frontier.y],[p.x,p.y]);}
 }}});
test('Existing council API opens briefing and preserves return coordinates; aftermath cannot depart',()=>{const s=hub(1),f=structuredClone(s.frontier);assert.ok(openCouncil(s));assert.equal(s.screen,'warroom');assert.equal(s.narrative.active.key,'raid');assert.deepEqual(s.frontier,f);drain(s);enterHub(s,{story:false});assert.deepEqual([s.frontier.x,s.frontier.y],[f.x,f.y]);s.frontier.phase='aftermath';assert.equal(openCouncil(s),false);});
