// v2.1 (D-118, TAVERN_WORLD_DESIGN §4, §6, §7): the tavern's 「인재 확보」, the village request board, the request sortie
// and the world map that opens at a town's exit. HTML builders only; app.js wires the actions.
import {frontierButton} from './frontier-ui.js';
import {mercsAt,tavernTown,hireLevel} from '../core/tavern.js';
import {requestsAt,atVillage,villageOpen} from '../core/villages.js';
import {TOWN_NAME,MERCS} from '../data/mercs-v210.js';
import {HERO_LORE} from '../data/hero-lore.js';
import {heroDef,partyHeroes} from '../data/game-data.js';
import {HERO_STATS,CLASSES8,STAT_KO,UNIT_CLASS8} from '../data/classes8.js';
import {MISSIONS} from '../data/missions.js';
import {VILLAGES} from '../data/villages-v210.js';
import {TOOLS} from '../data/frontier-data.js';
import {SITES,WORLD_SIZE,HUB_SITE} from '../data/world.js';
import {revisitTowns,canTravel} from '../core/frontier.js';
import {hubFor} from '../data/hubs-v05.js';
import {itemIcon} from './item-art.js';

const SKILL_KO={'Brace':'방진','Aimed Shot':'조준 사격','Shield Oath':'방패의 맹세','Charge':'돌격','Fire Bolt':'화염탄','Heal':'치유','Quick Strike':'기습','Last Post':'마지막 초소'};
const statLine=id=>{const st=HERO_STATS[id]||{};return Object.entries(STAT_KO).map(([k,ko])=>`${ko} ${st[k]??'—'}`).join(' · ');};
export function tavernHTML(s,esc,portrait){const town=tavernTown(s);if(!town)return '<p>주점 안에서 이용할 수 있습니다.</p>';const list=mercsAt(s,town),gold=s.economy?.gold??0,lv=hireLevel(s.campaign),first=!Array.isArray(s.campaign.heroes);
 const card=m=>{const h=heroDef(m.id),cls=CLASSES8[UNIT_CLASS8[m.id]],lore=HERO_LORE[m.id];return `<article class="merc-card ${m.elite?'elite':''}"><div class="merc-head">${portrait({...h,team:'ally',classTier:1},'card-sprite')}<div><h3>${esc(h.name)} ${m.elite?'<span class="merc-elite">엘리트</span>':''}${m.wandering?'<span class="merc-wander">떠돌이</span>':''}</h3><p class="muted">${esc(cls?.ko||'')} · 고용하면 LV ${lv}</p></div></div>
  <p>${esc(lore?.bio||h.description||'')}</p><p class="merc-stats">${statLine(m.id)}</p><p class="muted">기술 · ${esc(SKILL_KO[h.skill]||h.skill||'')}</p>
  ${frontierButton('hire',`고용 · ${m.price} G`,m.id,first||gold<m.price,'primary')}</article>`;};
 return `<p>「인재 확보」 · ${esc(TOWN_NAME[town]||town)} 주점. 고용비는 한 번만 내고, 고용한 인재는 엔딩까지 군단과 함께합니다. 고용하면 지금 군단 평균보다 한 레벨 낮게 들어옵니다.</p>
 <p class="supply-gold">◆ ${gold} G</p>${first?'<p class="muted">첫 전투(잿빛 마을)를 마친 뒤부터 고용할 수 있습니다.</p>':''}
 <div class="merc-list">${list.length?list.map(card).join(''):'<p class="muted">지금 이 주점에서 기다리는 인재가 없습니다. 이야기가 진행되면 다른 마을 주점에 새 인재가 나타납니다.</p>'}</div>`;}
const rewardText=r=>[r.gold?`${r.gold} G`:'',...Object.entries(r.items||{}).map(([id,n])=>`${TOOLS[id]?.name||id} ×${n}`)].filter(Boolean).join(' · ');
export function requestsHTML(s,esc){const v=atVillage(s);if(!v)return '<p>작은 마을의 의뢰 게시판에서 볼 수 있습니다.</p>';const list=requestsAt(s,v),first=!Array.isArray(s.campaign.heroes);
 const row=r=>{const m=r.mission?MISSIONS[r.mission]:null,pay=r.pay?[r.pay.gold?`${r.pay.gold} G`:'',...Object.entries(r.pay.items||{}).map(([id,n])=>`${TOOLS[id]?.name||id} ×${n}`)].filter(Boolean).join(' · '):'';
  return `<article class="request-card ${r.done?'done':''}"><h3>${esc(r.title)} ${r.done?'<span class="request-done">완료</span>':r.again?'<span class="request-new">새 무리</span>':''}</h3><p>${esc(r.text)}</p>
  ${m?`<p class="muted">전투 · ${esc(m.objective)} · 최대 출전 ${m.deployLimit}명</p>`:`<p class="muted">전투 없음 · 내는 것: ${esc(pay)}</p>`}<p>보상 · ${esc(rewardText(r.reward||{}))}${r.rescue?` · <b>${esc(heroDef(r.rescue)?.name||'')} 합류</b>`:''}</p>
  ${r.done?'':r.kind==='battle'?frontierButton('request-sortie','출전 장수 고르기 →',r.id,first,'primary'):frontierButton('request-pay',`의뢰 해결 · ${esc(pay)}`,r.id,false,'primary')}</article>`;};
 return `<p>${esc(VILLAGES[v].name)} · 촌장 회관 의뢰 게시판. 의뢰 전투는 이야기 진행과 따로 치르며, 지면 마을로 돌아와 다시 할 수 있습니다.${r0(s)}</p><div class="request-list">${list.map(row).join('')}</div>`;}
const r0=s=>Array.isArray(s.campaign.heroes)?'':' (첫 전투를 마친 뒤부터)';
export function requestSortieHTML(s,esc,portrait,id,picked){const r=requestsAt(s,atVillage(s)).find(x=>x.id===id);const m=MISSIONS[r?.mission];if(!r||!m)return '';const heroes=partyHeroes(s.campaign).map(h=>s.campaign.heroes?.find(x=>x.id===h.id)||h);
 const tile=h=>`<button class="hero-card sortie-tile ${picked.includes(h.id)?'active':''}" data-do="req-sortie" data-id="${h.id}" aria-pressed="${picked.includes(h.id)}">${portrait({...h,team:'ally'},'card-sprite')}<span><b>${esc(h.name)}</b><small>LV ${h.level||1}${picked.includes(h.id)?' · 출전':''}</small></span></button>`;
 return `<p><b>${esc(r.title)}</b> · ${esc(m.objective)}</p><p class="muted">${esc(m.brief)}</p><p>출전 ${picked.length} / 최대 ${m.deployLimit}명 · 눌러서 출전과 대기를 바꿉니다.</p><div class="sortie-list request-sortie">${heroes.map(tile).join('')}</div>
 ${frontierButton('request-start','이 장수들로 출전',id,!picked.length,'primary')}`;}
// The world map at a town's exit: where the legion may go (§6) — the camp the story is in, the towns already reached and
// the small villages a cleared castle opened. The painting is cropped to the places in reach (3:2), so markers stay apart
// on a phone; the list below repeats them.
const WORLD_IMG=typeof ASHEN_WORLD!=='undefined'?ASHEN_WORLD.world_map:null;
function cropFor(sites){const xs=sites.map(t=>t.x),ys=sites.map(t=>t.y),pad=110;let x0=Math.min(...xs)-pad,x1=Math.max(...xs)+pad,y0=Math.min(...ys)-pad,y1=Math.max(...ys)+pad;
 let w=Math.max(x1-x0,360),h=Math.max(y1-y0,240);if(w/h<1.5)w=h*1.5;else h=w/1.5;w=Math.min(w,WORLD_SIZE.w);h=Math.min(h,WORLD_SIZE.h);
 const cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2;x0=Math.max(0,Math.min(WORLD_SIZE.w-w,cx-w/2));y0=Math.max(0,Math.min(WORLD_SIZE.h-h,cy-h/2));return {x0,y0,w,h};}
export function worldTravelHTML(s,esc){const f=s.frontier,go=canTravel(s),home=f?.revisit||hubFor(s.missionId,f?.phase),here=f?.hub,towns=revisitTowns(s);
 const homeSite=SITES.find(t=>t.id===HUB_SITE[home]);
 const dest=[{hub:home,name:'야영지 · 이야기가 이어지는 곳',home:true,site:homeSite},...towns.map(t=>({...t,site:SITES.find(x=>x.id===t.site)}))];
 const c=cropFor(dest.map(d=>d.site).filter(Boolean)),pct=(v,o,n)=>`${(100*(v-o)/n).toFixed(2)}%`;
 // Labels that would sit on one another (two places close on the map) move one up and one down.
 const pos=d=>({x:(d.site.x-c.x0)/c.w,y:(d.site.y-c.y0)/c.h}),OFF={'':0,lift:-.12,drop:.12},placed=[],nudge=new Map();
 for(const d of dest.filter(d=>d.site)){const p=pos(d),slot=['','lift','drop'].find(k=>placed.every(o=>Math.abs(p.y+OFF[k]-o.y)>=.1||Math.abs(p.x-o.x)>=.32))??'';nudge.set(d,slot);placed.push({x:p.x,y:p.y+OFF[slot]});}
 const marker=d=>d.site?`<button class="world-marker ${d.home?'home':d.small?'small':'town'} ${d.hub===here?'here':''} ${(d.site.x-c.x0)/c.w>.62?'flip':''} ${nudge.get(d)||''}" style="left:${pct(d.site.x,c.x0,c.w)};top:${pct(d.site.y,c.y0,c.h)}" data-do="${d.home?'town-return':'travel'}" data-id="${d.home?'':d.hub}" ${!go||d.hub===here?'disabled':''} title="${esc(d.name)}"><i aria-hidden="true"></i><span>${esc(d.home?'야영지':d.name)}</span></button>`:'';
 const img=WORLD_IMG?`<img class="world-crop" alt="" src="${WORLD_IMG}" style="width:${(100*WORLD_SIZE.w/c.w).toFixed(2)}%;left:${(-100*c.x0/c.w).toFixed(2)}%;top:${(-100*c.y0/c.h).toFixed(2)}%">`:'<canvas id="world-view" class="world-view" aria-label="에르디아 세계 지도"></canvas>';
 const btn=d=>frontierButton(d.home?'town-return':'travel',`${d.home?'⛺':'⌂'} ${esc(d.name)}${d.hub===here?' · 지금 여기':''}`,d.home?'':d.hub,!go||d.hub===here,d.home?'primary':'');
 return `<div class="world-travel" aria-label="에르디아 세계 지도">${img}<div class="world-markers">${dest.map(marker).join('')}</div></div>
 <div class="town-list"><p class="muted">지점을 누르면 군단이 길을 따라 그곳으로 갑니다. 시간과 비용은 들지 않습니다. 성이나 거점을 클리어하면 주변의 작은 마을이 지도에 나타납니다.</p>${dest.map(btn).join('')}${go?'':'<p class="muted">탐색 중(건물 밖)에서만 오갈 수 있습니다.</p>'}</div>`;}
