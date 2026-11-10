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
