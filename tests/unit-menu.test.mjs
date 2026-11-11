// 2026-11-10 play-test (v0.10.1): the unit menu's title is one compact line (no wrapping, smaller), and the move
// confirmation is just two buttons — 이동 확정 / 취소 — with no tile coordinates.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {newGame,startBattle} from '../src/core/game.js';
import {menuHTML} from '../src/ui/action-menu.js';
import {drain} from './campaign-policy.mjs';
const esc=x=>String(x);
test('the move confirmation is two buttons and no coordinates',()=>{
 const s=newGame(4004);s.screen='deployment';startBattle(s);drain(s);
 const html=menuHTML(s,{selected:'lia',menu:'move-confirm',pendingMove:{id:'lia',x:6,y:4,path:[]}},esc);
 assert.match(html,/data-do="confirm-move"[^>]*>이동 확정</);assert.match(html,/data-do="cancel-move"[^>]*>취소</);
 assert.doesNotMatch(html,/\(\d+, \d+\)|위치로|이동 확인/);
});
test('the menu title stays on one line at a smaller size',()=>{
 const css=fs.readFileSync(new URL('../src/ui/style.css',import.meta.url),'utf8'),rules=[...css.matchAll(/\.unit-popover header strong\{([^}]*)\}/g)].map(m=>m[1]),last=rules.at(-1);
 assert.match(last,/white-space:nowrap/);assert.match(last,/text-overflow:ellipsis/);assert.ok(Number(last.match(/(\d+)px/)[1])<=15);
});
// 2026-11-11 play-test (D-106): the skills menu is one line per skill with no notes; 설명 opens 상태 → 기술, which explains
// every skill (locked ones with their condition); the forecast drops its long note.
import {unitInfoHTML} from '../src/ui/unit-info.js';
import {skillsOf} from '../src/data/skills.js';
import {findUnit} from '../src/core/rules.js';
test('the skills menu lists names and MP only, and 설명 opens the 기술 tab with every skill explained',()=>{
 const s=newGame(4004);s.screen='deployment';startBattle(s);drain(s);const lia=findUnit(s,'lia');
 const html=menuHTML(s,{selected:'lia',menu:'skills'},esc);
 assert.doesNotMatch(html,/<p>/,'no notes in the battle menu');assert.match(html,/data-do="unit-info" data-id="lia\|tactics"[^>]*>설명</);
 for(const k of skillsOf(lia))assert.ok(html.includes(k.slot===1?lia.skill:k.ko),k.id);
 const info=unitInfoHTML(s,lia,'tactics',esc,()=>'');for(const k of skillsOf(lia))assert.ok(info.includes(k.slot===1?lia.skill:k.ko),`기술 tab ${k.id}`);
 assert.equal((info.match(/class="tactic-card/g)||[]).length,skillsOf(lia).length);
 const b1=findUnit(s,'b1');lia.x=b1.x;lia.y=b1.y+1;const f=menuHTML(s,{selected:'lia',menu:'forecast',preview:'b1',mode:'attack'},esc);assert.doesNotMatch(f,/Miss와 Critical/);assert.match(f,/행동 확정/);
});
