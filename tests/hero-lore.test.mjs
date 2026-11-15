// 2026-11-11 play-test (D-108): the hero sheet tells each hero's story and how to grow — chapters open mission by mission
// (no spoilers), the awakening is told only after it happens, bonds show only people already met, and the growth tab leads
// with the next goal and live progress.
import test from 'node:test';import assert from 'node:assert/strict';
import {HERO_LORE,GROWTH_TIPS,loreChapters} from '../src/data/hero-lore.js';
import {HEROES,RECRUIT_HEROES} from '../src/data/game-data.js';
import {POTENTIAL} from '../src/data/classes.js';
import {newGame} from '../src/core/game.js';
import {enterHub} from '../src/core/frontier.js';
import {findUnit} from '../src/core/rules.js';
import {unitInfoHTML} from '../src/ui/unit-info.js';
import {renderFrontier} from '../src/ui/frontier-ui.js';
const esc=x=>String(x);
test('every hero of the legion has a title, three traits, a line, a past, chapters in order and bonds',()=>{
 const ids=[...HEROES,...RECRUIT_HEROES].map(h=>h.id);assert.deepEqual(Object.keys(HERO_LORE).sort(),ids.sort());
 for(const [id,L] of Object.entries(HERO_LORE)){assert.ok(L.title&&L.quote&&L.bio.length>40&&L.likes&&L.dislikes,id);assert.equal(L.traits.length,3,id);
  const after=L.chapters.map(c=>c.after);assert.deepEqual(after,[...after].sort((a,b)=>a-b),id);assert.ok(L.bonds.length>=2,id);}
 for(const [id,steps] of Object.entries(POTENTIAL))assert.equal(GROWTH_TIPS[id].steps.length,steps.length,id);
});
test('chapters open only after their mission, follow the choices, and tell an awakening only once it happened',()=>{
 assert.deepEqual(loreChapters('eric',{completed:[1,2]}).open.map(c=>c.after),[1]);assert.equal(loreChapters('eric',{completed:[1,2]}).next,3);
 const c13=f=>loreChapters('eric',{completed:[13],flags:{mission_13_baldrick:f}}).open[0].text;assert.match(c13('halted'),/멈췄다/);assert.match(c13('held'),/해가 질 때까지/);assert.match(c13('broken'),/무너뜨렸다/);
 assert.match(loreChapters('baldrick',{completed:[26]}).open[0].text,/아홉 번째 장수/);
 assert.doesNotMatch(loreChapters('dario',{completed:[25]},2).open[0].text,/각성/);assert.match(loreChapters('dario',{completed:[25]},3).open[0].text,/각성 「칼의 주인」/);
 assert.deepEqual(GROWTH_TIPS.eric.steps[2].progress({guard_eric_lia:2,guard_eric_kai:1}),[3,5]);assert.deepEqual(GROWTH_TIPS.eric.steps[1].progress({guard_eric_lia:2,guard_eric_kai:1}),[2,2]);
});
test('the town ☰ opens 장수 정보; the sheet walks ◀ ▶ through the heroes; 열전 tells the story; 성장 leads with the next goal',()=>{
 const s=newGame(4004);enterHub(s,{story:false});assert.match(renderFrontier(s,esc),/data-do="hero-roster"/);
 const e=findUnit(s,'eric'),bio=unitInfoHTML(s,e,'bio',esc,()=>'');assert.match(bio,/「군단의 방패」/);assert.match(bio,/이번엔 끝까지 지킨다/);assert.match(bio,/장수 열전 · 전공 기록/);
 assert.match(bio,/다음 이야기는 Mission 01을 마치면 열린다/,'nothing ahead is told');assert.doesNotMatch(bio,/<b>발드릭<\/b>/,'Baldrick is not met before M05');
 assert.match(bio,/class="hero-nav"/);assert.match(bio,/data-id="elina\|bio"/);
 const g=unitInfoHTML(s,e,'growth',esc,()=>'');assert.match(g,/다음 목표/);assert.match(g,/잠재력 0\/3/);assert.match(g,/수호\(Guard\)를 켠 채/);assert.match(g,/대표 행동 — 수호로 동료를 지키거나/);
 const a=unitInfoHTML(s,e,'ability',esc,()=>'');assert.match(a,/올리는 법 →/);
});
