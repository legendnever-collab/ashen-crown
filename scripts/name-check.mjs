// v2.0.0 표절 점검 1번 (REFORM_DESIGN §13, D-115): every name the game shows for classes, tiers, stats, skills, treasures,
// tools and gear is compared with a reference list of 조조전 (Koei, 1998) class chains and item names and of the Koei
// 삼국지 stat set. Exact matches and containments are printed for a human to judge; generic military words that any
// game uses (궁병, 도적, 창병 …) are expected and listed as such. Usage: node scripts/name-check.mjs [--json]
import {CLASSES8,STAT_KO,TIER_ATTACK} from '../src/data/classes8.js';
import {CATALOG} from '../src/data/catalog-v08.js';
import {TREASURES} from '../src/data/arms-v081.js';
import {HEROES} from '../src/data/game-data.js';

// Reference names (from public descriptions of the games; ideas and genre words are not protected, the lists are only for comparison).
const REF={
 '조조전 병과·승급':['군웅','영웅','패왕','경보병','보병','근위병','경기병','중기병','호표기','궁병','노병','연노병','궁기병','노기병','연노기병','무도가','무술가','권법가','책사','군사','도사','풍수사','주술사','선인','적병','산적','도적','해적','의적','의병','황건적','기마대','운반대','무관','문관','고적대','악대','서량기병','남만병','등갑병','상병'],
 '조조전 보물·도구':['청룡언월도','의천검','청홍검','방천화극','장팔사모','적토마','적로','절영','조황비전','손자병법','맹덕신서','둔갑천서','태평요술서','옥새','칠성보검','고정도','비도','쌍고검','철척사모','대부','철퇴','오석궁','양유기궁','이광궁','황금갑','백은갑','둔갑서','병법서','콩','보리','술','의약','상처약','정력약'],
 '삼국지 능력치':['무력','지력','통솔','정치','매력','민첩','운']};
const ours=[];const add=(kind,name)=>{if(name)ours.push({kind,name:String(name).trim()});};
for(const [k,c] of Object.entries(CLASSES8)){add('병종',c.ko);for(const t of c.names||[])add('승급',t.ko);}
for(const v of Object.values(STAT_KO||{}))add('능력치',v);
for(const t of Object.values(TIER_ATTACK||{}))for(const x of (Array.isArray(t)?t:Object.values(t)))if(x&&typeof x==='object'&&x.name)add('단계 공격',x.name);
for(const c of CATALOG)add(c.kind==='skill'?'기술':c.kind==='treasure'?'보물':c.kind==='tool'?'도구':c.kind||'목록',c.ko);
for(const t of Object.values(TREASURES))add('보물',t.name);
for(const h of HEROES.filter(h=>h.officer))add('부장',h.name);
add('일기토 화면','잿빛 결투장');
const uniq=[...new Map(ours.map(o=>[o.kind+'|'+o.name,o])).values()];
const GENERIC=new Set(['궁병','도적','창병','기병','보병','무력','민첩','운']);
const hits=[];for(const o of uniq)for(const [list,names] of Object.entries(REF))for(const r of names){const exact=o.name===r,inside=!exact&&r.length>=3&&o.name.includes(r);if(exact||inside)hits.push({...o,ref:r,list,exact,generic:GENERIC.has(o.name)||GENERIC.has(r)});}
if(process.argv.includes('--json')){console.log(JSON.stringify({names:uniq.length,hits},null,1));}
else{console.log(`names checked: ${uniq.length}`);for(const h of hits)console.log(`${h.exact?'exact':'contains'} · ${h.kind} 「${h.name}」 ~ ${h.list} 「${h.ref}」${h.generic?' (generic word)':''}`);
 const stats=Object.values(STAT_KO||{});console.log(`stat set: ${stats.join('·')} vs 삼국지 ${REF['삼국지 능력치'].join('·')} — shared ${stats.filter(s=>REF['삼국지 능력치'].includes(s)).join('·')||'none'}`);
 console.log(`non-generic exact matches: ${hits.filter(h=>h.exact&&!h.generic).length}`);}
