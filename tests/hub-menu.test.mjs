// 2026-11-11 play-test (D-107): the town map stays clear — the menu folds behind ☰ with only the next story step beside it,
// no floating place names, no 에릭 찾기, gold alone at the top left, and the D-pad off unless turned on.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {newGame} from '../src/core/game.js';import {enterHub} from '../src/core/frontier.js';
import {renderFrontier} from '../src/ui/frontier-ui.js';
const esc=x=>String(x);
test('the town menu folds behind ☰; the next story step and ☰ stay on the map',()=>{
 const s=newGame(4004);enterHub(s,{story:false});assert.equal(s.screen,'exploration');
 const closed=renderFrontier(s,esc),open=renderFrontier(s,esc,{menu:true});
 const fold=h=>/<div class="hub-fold"([^>]*)>([\s\S]*?)<\/div><div class="hub-keep">([\s\S]*?)<\/div><\/div>/.exec(h);
 const [,attr,items,keep]=fold(closed);assert.match(attr,/hidden/);
 for(const a of ['fast-map','inventory','items','hub-zoom','hub-dpad'])assert.ok(items.includes(`data-do="${a}"`),a);
 assert.match(keep,/data-do="warroom"[^>]*class="primary"/);assert.match(keep,/data-do="hub-menu"/);assert.ok(!keep.includes('data-do="inventory"'));
 assert.doesNotMatch(fold(open)[1],/hidden/);assert.match(open,/frontier-actions open/);
 assert.ok(!closed.includes('hub-focus')&&!closed.includes('에릭 찾기'),'no 에릭 찾기');assert.ok(!closed.includes('location-tag'));assert.match(closed,/hub-title sr-only/);
 assert.ok(!closed.includes('dpad-on'));assert.match(renderFrontier(s,esc,{dpad:true}),/frontier-screen fs dpad-on/);
});
test('the D-pad is hidden unless turned on, and the floating name tags never show',()=>{
 const css=fs.readFileSync(new URL('../src/ui/style.css',import.meta.url),'utf8');
 assert.match(css,/\.frontier-screen\.fs:not\(\.dpad-on\) \.dpad\{display:none\}/);assert.match(css,/\.frontier-screen\.fs \.location-tag,\.frontier-screen\.fs \.hub-map-controls\{display:none!important\}/);
});
