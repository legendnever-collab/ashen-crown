// v0.6 (D-062): conversations answer each other. Every hub talk with a companion or townsperson is an exchange
// with Erik, differs from one story moment to the next, and townsfolk speak under their name in that hub.
import test from 'node:test';import assert from 'node:assert/strict';
import {STORY} from '../src/data/story.js';import {HUBS} from '../src/data/frontier-data.js';import {hubFor} from '../src/data/hubs-v05.js';
import {LAST_MISSION} from '../src/data/missions.js';import {newGame} from '../src/core/game.js';import {serialize,deserialize,checksum} from '../src/persistence/save-manager.js';
const TALKERS=['aren','elina','lia','sain','kai','elder','refugee','guard','advisor'];
const moments=[];for(let m=1;m<=LAST_MISSION;m++)for(const phase of ['preparation','aftermath'])moments.push([m,phase]);
test('every hub talk is an exchange: Erik answers, speakers alternate, no line is said twice in a row',()=>{
 for(const [m,phase]of moments){const hub=HUBS[hubFor(m,phase)];
  for(const id of TALKERS){if(!hub.npcs.some(n=>n.id===id))continue;const key=`npc:${m}:${phase}:${id}`,lines=STORY[key];assert.ok(lines?.length>=3,key);
   assert.ok(lines.some(l=>l.speaker==='eric'),`${key}: Erik takes part`);assert.ok(new Set(lines.map(l=>l.speaker)).size>=2,`${key}: two speakers`);
   for(let i=1;i<lines.length;i++)assert.notEqual(lines[i].text,lines[i-1].text,key);
   const runs=lines.reduce((r,l,i)=>i&&l.speaker===lines[i-1].speaker?r+1:r,0);assert.ok(runs<=1,`${key}: at most one back-to-back line by the same speaker`);}}
});
test('hub talks change with the story moment (no companion repeats the same talk in two moments)',()=>{
 for(const id of ['aren','elina','lia','sain','kai','elder','refugee','guard','advisor']){const seen=new Map();
  for(const [m,phase]of moments){const key=`npc:${m}:${phase}:${id}`;if(!STORY[key]||!HUBS[hubFor(m,phase)].npcs.some(n=>n.id===id))continue;const text=STORY[key].map(l=>l.text).join('|');
   assert.ok(!seen.has(text),`${key} repeats ${seen.get(text)}`);seen.set(text,key);}}
});
test('townsfolk speak under the name they have in that hub',()=>{
 assert.equal(STORY['npc:1:preparation:elder'][0].name,'마을 촌장');assert.equal(STORY['npc:2:preparation:elder'][0].name,'진영 관리인');
 assert.equal(STORY['npc:4:aftermath:elder'][0].name,'성채 관리인');assert.equal(STORY['npc:3:preparation:guard'][0].name,'보초');
 for(const [m,phase]of moments)for(const id of ['elder','refugee','guard'])for(const l of STORY[`npc:${m}:${phase}:${id}`]){if(l.speaker!==id)continue;
  assert.equal(l.name,HUBS[hubFor(m,phase)].npcs.find(n=>n.id===id).name.split(' · ')[0],`npc:${m}:${phase}:${id}`);}
});
test('staged scenes keep their cast and story keys; hub scenes name the place they are in',()=>{
 assert.ok(STORY['4:end'].every(l=>!l.text.includes('야영지')),'after M04 the legion stays in the fortress');
 assert.ok(STORY['5:end'].every(l=>!l.text.includes('야영지')),'after M05 the legion returns to the fortress');
 assert.ok(STORY['after:3:quiet'].length===STORY['after:3'].length&&STORY['after:3:quiet'][1].text!==STORY['after:3'][1].text);
});
test('a save paused inside a scene that is now shorter resumes on its last line',()=>{
 const s=newGame(20261025);s.narrative.active={key:'npc:1:aftermath:eric',index:0};const text=serialize(s);
 const data=JSON.parse(JSON.parse(text).data);data.narrative.active.index=STORY['npc:1:aftermath:eric'].length+1;
 const raw=JSON.stringify(data);const restored=deserialize(JSON.stringify({format:'AshenCrown',schema:data.schema,checksum:checksum(raw),data:raw}));
 assert.equal(restored.narrative.active.index,STORY['npc:1:aftermath:eric'].length-1);
});
