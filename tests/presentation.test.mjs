// v0.5.0 Phase F: art hash verification, class-action flourishes, music scenes for hubs, the
// world map, the promotion rite and trials.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import {SCORE,musicScene} from '../src/audio/score.js';
import {presentationPlan} from '../src/render/animation.js';
import {newGame,performAction} from '../src/core/game.js';
import {enterHub} from '../src/core/frontier.js';
import {findUnit} from '../src/core/rules.js';
import {startSkirmish} from '../src/core/skirmish.js';
import {actOneCamp} from './skirmish-policy.mjs';
import {drain} from './campaign-policy.mjs';

const root=new URL('../src/assets/',import.meta.url),sha=p=>crypto.createHash('sha256').update(fs.readFileSync(new URL(p,root))).digest('hex');
function lastRows(file){const [head,...rows]=fs.readFileSync(new URL(file,root),'utf8').trim().split('\n');const cols=head.split(',');const out=new Map();for(const r of rows){const v=r.split(','),o=Object.fromEntries(cols.map((c,i)=>[c,v[i]]));out.set(o.webp,o);}return [...out.values()];}

test('shipped painted art equals the hash-verified imports (busts, sheets, hubs, world map, icons)',()=>{
 const art=lastRows('art-import-log.csv');assert.ok(art.length>=70);
 for(const r of art)assert.equal(sha(`${r.kind==='bust'?'portraits':'sprites'}/${r.webp}`),r.webp_sha256,r.webp);
 const world=lastRows('world-art-import-log.csv');assert.equal(world.length,16,'6 hubs + map + 9 icons');
 for(const r of world)assert.equal(sha(`${r.kind==='hub'?'hubs':'world'}/${r.webp}`),r.webp_sha256,r.webp);
 for(const id of ['eric','elina','lia','sain','kai'])for(const e of ['neutral','concerned','determined','sad'])assert.ok(art.some(r=>r.webp===`bust_${id}_t2_${e}.webp`),`${id} t2 ${e}`);
});

test('every score is original notation with whole bars; Phase F adds five variations',()=>{
 for(const id of ['campfire','banner','rite','trial','chronicle'])assert.ok(SCORE[id],id);
 for(const [id,t] of Object.entries(SCORE))assert.equal(t.melody.reduce((a,[,d])=>a+d,0),t.chords.length*8,id);
});

test('music follows the hub, the world map, the promotion rite and trials',()=>{
 const want={village:'village',village_raid:'village',camp:'camp',bivouac:'campfire',fortress:'camp',oathcamp:'banner'};
 for(const [hub,track] of Object.entries(want)){const s=newGame(3,null,1);s.screen='exploration';s.frontier={hub};assert.equal(musicScene(s),track,hub);}
 const s=newGame(4,null,1);enterHub(s);assert.equal(s.narrative.active.key,'world:intro');assert.equal(musicScene(s),'chronicle');
 s.narrative.active={key:'promo:kai',index:0};assert.equal(musicScene(s),'rite');
 const trial=startSkirmish(actOneCamp(9,6,{kai_rescue:4,kai_bypass:2,m6_kai_lever:1}),'trial','kai');drain(trial);assert.equal(musicScene(trial),'trial');
 const drill=startSkirmish(actOneCamp(9,6),'drill');drain(drill);assert.notEqual(musicScene(drill),'trial');
});

test('promotion actions emit a class flourish that leads the moves it causes',()=>{
 const camp=actOneCamp(11,6,{kai_rescue:4,kai_bypass:2,m6_kai_lever:1}),s=startSkirmish(camp,'trial','kai');drain(s);
 const kai=findUnit(s,'kai'),foe=s.units.find(u=>u.team==='enemy');kai.x=foe.x;kai.y=foe.y+1;s.feedback=[];
 const r=performAction(s,'kai','exchange',foe.id);assert.ok(r.ok,r.error);const cls=s.feedback.find(e=>e.type==='class');
 assert.equal(cls.action,'exchange');assert.deepEqual(cls.to,{x:foe.x,y:foe.y-1});
 const plan=presentationPlan(s.feedback,s.units,{speed:1});assert.ok(plan.motions.every(m=>m.delay>=480),'moves wait for the flourish');
 const reduced=presentationPlan(s.feedback,s.units,{speed:1,reduced:true});assert.ok(reduced.motions[0].delay<=120,'reduced motion keeps the lead short');
});

test('ACT I tier-1 play emits no class flourish',()=>{const s=newGame(5,null,1);s.screen='deployment';enterHub(s,{story:false});drain(s);assert.ok(!(s.feedback||[]).some(e=>e.type==='class'));});
