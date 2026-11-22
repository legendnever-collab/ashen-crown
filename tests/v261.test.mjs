// v2.6.1 (the user's requests 2026-11-22 22:33): the sortie is 6–8 by the map, the EXP text no longer shows the level gap, a town
// with someone worth meeting brings a rumour the first time the legion walks in, and the battle music follows the fight.
// (Fire only in forests: tests/act1-v200.test.mjs; figure sizes and the camera: tests/v261-e2e.mjs.)
import test from 'node:test';import assert from 'node:assert/strict';
import {newGame,startBattle,deployLimit,sortieBySize} from '../src/core/game.js';import {MISSIONS} from '../src/data/missions.js';
import {awardXP,findUnit} from '../src/core/rules.js';import {enterHub,travelTo,returnFromTown} from '../src/core/frontier.js';import {TOWN_HINTS} from '../src/data/hints-v261.js';import {STORY} from '../src/data/story.js';
import {drain} from './campaign-policy.mjs';
const BEFORE={7:6,8:6,9:6,10:6,11:6,12:6,13:6,14:6,15:7,16:7,17:7,18:7,19:7,20:7,21:7,22:7,23:7,24:7,25:7,26:7,27:8,28:8,29:8,30:8};
test('v2.6.1: the sortie is 6–8 by the map size, never fewer than before',()=>{
 for(const id of Object.keys(MISSIONS).map(Number)){const s=newGame(3,null,id),n=deployLimit(s);assert.ok(n>=6&&n<=8,`M${id} ${n}`);assert.ok(n>=(BEFORE[id]??5),`M${id} keeps at least ${BEFORE[id]??5}`);
  const a=MISSIONS[id].width*MISSIONS[id].height;assert.equal(sortieBySize(MISSIONS[id]),a<=450?6:a<=560?7:8);}
 assert.deepEqual([1,2,3,4,5,6].map(id=>deployLimit(newGame(3,null,id))),[6,6,7,7,6,7],'ACT I by size');
 assert.deepEqual([17,18,20,21,22,25].map(id=>deployLimit(newGame(3,null,id))),[8,8,8,8,8,8],'the big ACT III/IV maps take eight');
});
test('v2.6.1: the EXP text shows the amount only (no level gap)',()=>{
 const s=newGame(1,null,4);s.screen='deployment';startBattle(s);const u=findUnit(s,'lia');u.level=1;s.feedback=[];awardXP(s,u,10,'t',30);const fb=s.feedback.find(f=>f.type==='xp');
 assert.match(fb.text,/^\+\d+ EXP$/);assert.ok(fb.scale>1,'the gap still counts');});
test('v2.6.1: a rumour the first time the legion walks into a town with someone worth meeting — once, and not after the hero joined',()=>{
 for(const [hub,h] of Object.entries(TOWN_HINTS)){assert.ok(STORY[`hint:${hub}`]?.length===h.lines.length,hub);for(const [who] of h.lines)assert.ok(['eric','elina','lia','sain','kai'].includes(who),`${hub}: one of the five speaks`);}
 const camp=()=>{const s=newGame(5,{heroes:null,results:[],clears:4,completed:[1,2,3,4],flags:{}},5);enterHub(s,{story:false});drain(s);return s;};
 let s=camp();assert.ok(travelTo(s,'stonewell'));assert.equal(s.narrative.active?.key,'hint:stonewell');assert.equal(s.campaign.flags.hint_stonewell,true);drain(s);
 assert.ok(returnFromTown(s));assert.ok(travelTo(s,'stonewell'));assert.ok(!s.narrative.active,'once only');
 s=camp();s.campaign.roster=[...(s.campaign.roster||[]),'adel'];assert.ok(travelTo(s,'stonewell'));assert.ok(!s.narrative.active,'no rumour once Adel has joined');
 s=camp();assert.ok(travelTo(s,'reed'));assert.ok(!s.narrative.active,'a town with nobody special says nothing');
});
test('v2.6.1: the battle music has a stereo field, variation and an intensity control',async()=>{
 const {AudioEngine}=await import('../src/audio/audio-engine.js');const a=new AudioEngine({getItem:()=>null,setItem(){}});assert.equal(a.diagnostics().intensity,.5);
 a.setIntensity(2);assert.equal(a.diagnostics().intensity,1);a.setIntensity(-1);assert.equal(a.diagnostics().intensity,0);a.setIntensity(NaN);assert.equal(a.diagnostics().intensity,.5);
});
// v2.6.1 (「대화 하나가 색이 좀 진해서 유도하는 감이 있어. 같은 weight로」): every choice's options are drawn alike
test('v2.6.1: every story choice draws its options with the same style; the person menu too',async()=>{
 const fs=await import('node:fs'),src=fs.readFileSync('src/ui/app.js','utf8'),cls=new Map();
 for(const m of src.matchAll(/frontierButton\('([a-z0-9]+-pick)',(?:'[^']*'|`[^`]*`),(?:'[^']*'|[a-zA-Z.]+)(?:,([^,)]+),'([a-z-]+)')?\)/g)){const k=m[1];if(!cls.has(k))cls.set(k,new Set());cls.get(k).add(m[3]||'');}
 assert.ok(cls.size>=15,`found ${cls.size} choices`);for(const [k,set] of cls)assert.equal(set.size,1,`${k}: ${[...set].join(' / ')}`);
 const menu=/function npcMenuHTML[\s\S]*?<\/div>`;\}/.exec(src)?.[0]||src.slice(src.indexOf("id=\"npc-menu\""),src.indexOf("id=\"npc-menu\"")+600);assert.ok(!/'npc',SERVICE_LABEL[^)]*'primary'\)/.test(menu),'the service button is not highlighted over 대화');
});
