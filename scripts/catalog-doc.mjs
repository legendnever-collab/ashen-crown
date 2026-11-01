// Writes docs/v0.8.0/ITEM_CATALOG.md from src/data/catalog-v08.js (D-073). Usage: node scripts/catalog-doc.mjs
import fs from 'node:fs';
import {CATALOG_TOOLS,CATALOG_MISC,CATALOG_GEAR,CATALOG_TREASURES,CATALOG_SKILLS,CATALOG_STATUS} from '../src/data/catalog-v08.js';
import {ALL_HEROES} from '../src/data/game-data.js';
const name=id=>ALL_HEROES.find(h=>h.id===id)?.name||id,slot={weapon:'무기',armor:'방어구',accessory:'장신구'},tier={1:'I 기본',2:'II 지방 특산',3:'III 정예'};
const L=['# v0.8 아이템·스킬·상태 목록 (D-073)','','상태: APPROVED_DIRECTION(2026-10-28 06:24 KST, 사용자 "권장안대로 진행해"). 이름, 수치, 가격은 PROPOSED이며 전투 시뮬레이션으로 조정한다.','원본: `src/data/catalog-v08.js`. 이 문서는 `node scripts/catalog-doc.mjs`로 만든다. 그림팩 E(`scripts/make-item-art-pack.py`)도 같은 목록을 쓴다.','',
`합계 ${CATALOG_TOOLS.length+CATALOG_MISC.length+CATALOG_GEAR.length+CATALOG_TREASURES.length+CATALOG_SKILLS.length+CATALOG_STATUS.length}개 (그림팩 E 아이콘 수와 같다).`,'',
'| 묶음 | 개수 | 들어가는 버전 |','|---|---:|---|',`| 도구 | ${CATALOG_TOOLS.length} | v0.8.0 |`,`| 골드·보급 상자 | ${CATALOG_MISC.length} | 아이콘만 (보급 상자 드롭은 v0.8.1) |`,
`| 장비 I | ${CATALOG_GEAR.filter(g=>g.tier===1).length} | 기존 (그림만 교체) |`,`| 장비 II | ${CATALOG_GEAR.filter(g=>g.tier===2).length} | v0.8.1 |`,`| 장비 III | ${CATALOG_GEAR.filter(g=>g.tier===3).length} | v0.8.1 |`,`| 보물 | ${CATALOG_TREASURES.length} | v0.8.1 |`,`| 스킬 | ${CATALOG_SKILLS.length} | v0.8.0 |`,`| 상태·명령 | ${CATALOG_STATUS.length} | v0.8.0 |`,'',
'## 도구','','| id | 이름 | 갈래 | 효과 | 가격 | 파는 곳 |','|---|---|---|---|---:|---|',...CATALOG_TOOLS.map(t=>`| \`${t.id}\` | ${t.ko} | ${{heal:'회복',cure:'해제',buff:'버프',throw:'투척'}[t.cat]} | ${t.effect} | ${t.price||'—'} | ${t.where} |`),'',
'## 장비','','| id | 이름 | 등급 | 칸 | 장착 | 효과 | 가격 | 파는 곳·해금 |','|---|---|---|---|---|---|---:|---|',...CATALOG_GEAR.map(g=>`| \`${g.id}\` | ${g.ko} | ${tier[g.tier]} | ${slot[g.slot]} | ${g.heroes.map(name).join(', ')} | ${g.effect} | ${g.price} | ${g.where} |`),'',
'## 보물','','| id | 이름 | 효과 | 얻는 곳 |','|---|---|---|---|',...CATALOG_TREASURES.map(t=>`| \`${t.id}\` | ${t.ko} | ${t.effect} | ${t.where} |`),'',
'## 스킬','','| 장수 | ① | ② | ③ |','|---|---|---|---|',...[...new Set(CATALOG_SKILLS.map(s=>s.hero))].map(h=>`| ${name(h)} | ${[1,2,3].map(n=>{const s=CATALOG_SKILLS.find(x=>x.hero===h&&x.slot===n);return `${s.ko} (MP ${s.cost}) — ${s.effect}`;}).join(' | ')} |`),'',
'## 상태이상과 명령','','| id | 이름 | 효과 |','|---|---|---|',...CATALOG_STATUS.map(s=>`| \`${s.id}\` | ${s.ko} | ${s.effect} |`),''];
fs.writeFileSync('docs/v0.8.0/ITEM_CATALOG.md',L.join('\n'));console.log('ITEM_CATALOG.md',L.length,'lines');
