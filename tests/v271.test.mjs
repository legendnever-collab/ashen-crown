// v2.7.1 (D-161, the user's word 2026-11-24 02:47 「나머지만 진행해줘」 after art pack M and the archive run): the painted request
// board, 어려움 M06 from its own strength, the town names after the story–town review, the archive bookkeeping.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {newGame,startBattle} from '../src/core/game.js';import {difficultyPush,BASE_MUL_AT,HARD_BASE_AT} from '../src/core/stats8.js';
import {HUBS} from '../src/data/frontier-data.js';import {STORY} from '../src/data/story.js';import {VERSION} from '../src/data/game-data.js';
test('v2.7.1: art pack M — the request board ships as a logged prop',()=>{
 assert.ok(fs.existsSync('src/assets/props/requestBoard.webp'));const row=fs.readFileSync('src/assets/room-art-import-log.csv','utf8').trim().split('\n').find(l=>l.startsWith('prop,requestBoard,'));
 assert.ok(row?.endsWith(',cbb71d34e4f9f6ef0883583dd276d2306b15bab0b6e16459acfebead2b45b91a'),'logged with the pack master hash');
});
test('v2.7.1: 어려움 M06 starts from ×1.7 (보통 keeps ×1.8); no other mission has its own 어려움 strength',()=>{
 assert.deepEqual(HARD_BASE_AT,{6:1.7});assert.equal(BASE_MUL_AT[6],1.8);
 const at=(id,d)=>{const s=newGame(3,{heroes:null,results:[],clears:id-1,completed:[...Array(id-1).keys()].map(i=>i+1),flags:{},choices:{m04_records_choice:'kept'},difficulty:d},id);s.campaign.difficulty=d;return difficultyPush(s);};
 assert.equal(at(6,'normal').mul,1.8);const h=at(6,'hard');assert.ok(h.mul>=1.7&&h.mul<1.8,`hard ${h.mul}`);
});
test('v2.7.1: every town names its places in Korean; the summit and the lower city no longer borrow the border gate and Velmar\'s harbour',()=>{
 for(const [id,h] of Object.entries(HUBS))for(const p of h.places)assert.ok(!/[A-Za-z]/.test(p.name),`${id}: ${p.name}`);
 const names=id=>HUBS[id].places.map(p=>p.name);
 assert.ok(names('summit').includes('무너진 역참 문')&&!names('summit').includes('국경 관문'));assert.ok(names('summit').includes('세 깃발의 광장'));
 assert.ok(names('capital').includes('하층가 관청')&&names('capital').includes('운하 창고')&&!names('capital').some(n=>/항구|의회/.test(n)));
 assert.ok(names('velmar').includes('의회 회관')&&names('oathcamp').includes('국경 관문'),'Velmar and the oath camp keep theirs');
 assert.match(STORY['after:20:keep'].map(l=>l.text).join(' '),/안뜰에서/);
});
test('v2.7.1: the archive lists every earlier build; only the version just before stays in the tree with its builds',()=>{
 const a=JSON.parse(fs.readFileSync('releases/ARCHIVE.json','utf8')),v=a.versions.map(x=>x.version);
 for(const x of ['2.5.1','2.5.2','2.6.0','2.6.1','2.7.0'])assert.ok(v.includes(x),x);assert.ok(!v.includes(VERSION));
 assert.ok(!fs.existsSync('releases/Ashen_Crown_v2.5.1.html'),'v2.5.1 has its Release and left the tree');
 const ign=fs.readFileSync('.gitignore','utf8');for(const x of ['2.5.2','2.6.0','2.6.1','2.7.0'])assert.ok(ign.includes(`releases/Ashen_Crown_v${x}.html`),x);
});
