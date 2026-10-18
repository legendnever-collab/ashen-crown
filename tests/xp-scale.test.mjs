// D-045: level-relative EXP from M04; M01–M03 keep the approved flat v0.3.x EXP.
import test from 'node:test';import assert from 'node:assert/strict';
import {newGame} from '../src/core/game.js';import {awardXP,xpScale,findUnit} from '../src/core/rules.js';import {MISSIONS} from '../src/data/missions.js';

test('M01–M03 carry no mission level: every hero gets the exact v0.3.x EXP',()=>{
 for(const id of [1,2,3]){assert.equal(MISSIONS[id].level,undefined);const s=newGame(1,null,id),lia=findUnit(s,'lia');lia.level=20;assert.equal(xpScale(s,lia),1);const xp=lia.xp;awardXP(s,lia,28,'t');assert.equal(lia.xp-xp,28);}
});
test('M04–M06: heroes far above the mission level learn less, far below learn faster, with floor and cap',()=>{
 const s=newGame(1,{heroes:null,results:[],clears:3,completed:[1,2,3],flags:{}},4),u=findUnit(s,'lia'),lv=MISSIONS[4].level;
 for(const [level,scale] of [[lv,1],[lv+2,1],[lv+3,0.8],[lv+5,0.4],[lv+12,0.2],[lv-2,1],[lv-3,1.2],[lv-10,1.6]]){u.level=Math.max(1,level);if(level>=1)assert.equal(+xpScale(s,u).toFixed(2),scale,`level ${level}`);}
 u.level=lv+5;u.xp=0;awardXP(s,u,28,'t');assert.equal(u.xp,11);u.level=lv+12;u.xp=0;awardXP(s,u,2,'t');assert.equal(u.xp,1,'never zero');
 assert.ok(MISSIONS[4].level<MISSIONS[5].level&&MISSIONS[5].level<MISSIONS[6].level);
});
