// v0.6 (D-060, user request 2026-10-25): every character name is written in Hangul (English pronunciation),
// e.g. Dario → 다리오. Covers heroes, recruits, speakers, hub NPCs and every mission/skirmish unit; old saves are renamed.
import test from 'node:test';import assert from 'node:assert/strict';
import {HEROES,RECRUIT_HEROES,ENEMIES,REINFORCEMENTS,CIVILIANS} from '../src/data/game-data.js';
import {SPEAKERS} from '../src/data/story.js';
import {HUBS,INTERIORS} from '../src/data/frontier-data.js';
import {MISSIONS} from '../src/data/missions.js';
import {CAST} from '../src/render/hd-art.js';
import {newGame,startBattle} from '../src/core/game.js';
import {migrate} from '../src/persistence/save-manager.js';
const latin=/[A-Za-z]/;
test('character names contain no Latin letters',()=>{
 const names=[...HEROES,...RECRUIT_HEROES,...ENEMIES,...REINFORCEMENTS,...CIVILIANS].map(u=>[u.id,u.name]);
 for(const sp of Object.values(SPEAKERS))names.push([`speaker:${sp.id}`,sp.name],[`speaker-ko:${sp.id}`,sp.ko]);
 for(const [id,h] of [...Object.entries(HUBS),...Object.entries(INTERIORS)])for(const n of h.npcs||[])names.push([`${id}:${n.id}`,n.name]);
 for(const m of Object.values(MISSIONS))for(const u of [...m.enemies,...(m.reinforcements||[]),...m.civilians,...(m.allies||[]),...(m.waves||[]).flatMap(w=>w.units)])names.push([`M${m.id}:${u.id}`,u.name]);
 for(const [id,c] of Object.entries(CAST))names.push([`cast:${id}`,c.name]);
 for(const [id,name] of names)assert.ok(typeof name==='string'&&name&&!latin.test(name),`${id}: ${name}`);
 assert.deepEqual(HEROES.map(h=>h.name),['에릭','엘리나','리아','세인','카이']);assert.deepEqual(RECRUIT_HEROES.map(h=>h.name),['테아','다리오']);
 assert.equal(SPEAKERS.aren.name,'아렌 발터');assert.equal(SPEAKERS.baldrick.name,'발드릭 로엔');
});
test('a save made with English names is renamed on load',()=>{
 const s=newGame(4);s.screen='deployment';startBattle(s);const raw=JSON.parse(JSON.stringify(s));
 for(const u of [...raw.units,...raw.stageStart.units])u.name={eric:'Erik',boss:'Garr — Bandit Captain',c1:'Mira',b1:'Rook'}[u.id]||u.name;
 const m=migrate(raw);const by=id=>m.units.find(u=>u.id===id).name;
 assert.deepEqual([by('eric'),by('boss'),by('c1'),by('b1')],['에릭','가르 — 산적 두목','미라','룩']);assert.equal(m.stageStart.units.find(u=>u.id==='eric').name,'에릭');
});
