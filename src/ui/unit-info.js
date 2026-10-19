// Tabbed unit sheet in the spirit of classic tactical SRPG info windows: ability grades,
// equipment, tactics, a short biography and class/terrain aptitude with an attack-range grid.
import {HEROES,TERRAIN,TERRAIN_COSTS,CLASS_MOVEMENT,HERO_CLASS,PROFILE_KO} from '../data/game-data.js';
import {GEAR} from '../data/frontier-data.js';
import {effectiveStats} from '../core/economy.js';
import {rangeFor,skillCost} from '../core/rules.js';
import {itemIcon} from './item-art.js';
import {classOf,nextClassOf,potentialOf,proficiencyOf,promotionStatus,heroRecord} from '../core/progression.js';
import {CLASS_ACTIONS,PROFICIENCY_EFFECT} from '../data/classes.js';

const CLASS_KO={'Apprentice Knight':'견습 기사',Archer:'궁수','Apprentice Mage':'견습 마도사',Healer:'치유사',Rogue:'도적'};
const KIND_KO={bandit:'보병',archer:'궁병',captain:'지휘관',civilian:'주민',lion:'철왕관 총사령관',bearer:'사자 기수',spear:'창병',cavalry:'기병',wagon:'보급 마차',beacon:'감시탑 봉화'};
const ENEMY_BIO={beacon:'관문 동쪽 감시탑의 봉화. 반격하지 않지만, 살아 있으면 3단계에 관문 수비대 증원을 부른다.',lion:'철왕관 총사령관, "검은 사자". 무법지대가 된 국경에 질서를 되찾겠다며 정규군을 이끌고 왔다. 맡은 명령을 완수하면 미련 없이 물러나는 지휘관이다.',bearer:'검은 사자 깃발을 든 기수. 곁에 선 병사들을 단단히 묶어 대형을 지탱한다.',spear:'철왕관 정규 창병. 기수 곁에서 대열을 지킨다.',cavalry:'철왕관 기병. 빠르지만 숲과 산길로는 들어오지 못한다.',wagon:'피난민의 식량과 약을 실은 마차. 한 대라도 지켜 내면 이동로를 지킨 것이다.'};
const BIO={
 eric:'변경 수비대의 기사. 아렌의 오랜 전우로, 언제나 맨 앞에 서서 동료를 지키는 것을 자기 몫으로 여긴다. 지난 일은 좀처럼 입에 올리지 않는다.',
 elina:'수비대 정찰병. 고향을 잃은 뒤로 높은 사람들의 말을 쉽게 믿지 않는다. 숲과 마을에서 쏘는 화살은 빗나가는 법이 드물다.',
 lia:'봉인술을 연구하는 마도사. 사라진 스승의 흔적을 좇아 국경 마을에 머물다 군단과 길을 함께하게 되었다. 군단의 작전 회의를 이끄는 군사이기도 하다.',
 sain:'피난민을 돌보는 치유사. 금빛 성화 문양을 지니고 다닌다. 칼을 내려놓은 사람이라면 적이라도 상처를 감아 준다.',
 kai:'어디서 왔는지 말하지 않는 여행자. 샛길과 지름길에 밝고, 위험한 냄새를 누구보다 먼저 맡는다.'
};
export const SKILL_NOTE={
 eric:'자신에게 사용. 다음 아군 턴까지 DEF +3, 인접 동료가 받는 첫 근접 공격을 대신 받는다. 주변에 아무도 없어도 쓸 수 있다.',
 elina:'사거리 2–3 정밀 사격. 명중 +18, 피해 +2. 숲·마을에 서서 쏘면 명중이 더 오른다.',
 lia:'화공 기술. 사거리 1–3, 대상의 RES로 계산한다. 평지 ×1.25 · 숲 ×1.5 · 늪 ×0.5. 맞은 자리가 평지·숲·마을이면 2턴 동안 불이 붙는다.',
 sain:'사거리 0–2 치유. 대상 옆의 다친 동료 1명도 4 회복. 치유할 때마다 EXP를 얻는다.',
 kai:'빠른 일격. 대상 반대편에 아군이 있으면(협공) 피해 +6.'
};
const grade=v=>v>=24?'S':v>=19?'A':v>=14?'B':v>=10?'C':v>=6?'D':'E';
function rangeGrid(min,max){let cells='';for(let y=-3;y<=3;y++)for(let x=-3;x<=3;x++){const d=Math.abs(x)+Math.abs(y),cls=d===0?'self':d>=min&&d<=max?'hit':'';cells+=`<i class="${cls}"></i>`;}return `<div class="range-grid" aria-label="공격 범위 ${min}–${max}">${cells}</div>`;}

export function unitInfoHTML(s,u,tab,esc,portrait){
 const hero=HEROES.find(h=>h.id===u.id),v=u.team==='ally'?effectiveStats(s,u):u,profile=u.movementProfile||CLASS_MOVEMENT[HERO_CLASS[u.id]]?.profile||'infantry';
 const tabs=[['ability','능력'],['equipment','장비'],['tactics','기술'],['growth','성장'],['bio','열전'],['class','병종']].filter(([id])=>id!=='growth'||hero).map(([id,label])=>`<button data-do="unit-info" data-id="${u.id}|${id}" class="${tab===id?'active':''}">${label}</button>`).join('');
 const bar=(label,a,b,cls)=>`<div class="info-bar ${cls}"><span>${label}</span><div><i style="width:${Math.round(100*a/Math.max(1,b))}%"></i></div><b>${a}/${b}</b></div>`;
 const head=`<div class="info-head">${portrait(u)}<div><h3>${esc(u.name)} <small>${u.team==='ally'?'아군':u.team==='enemy'?'적군':'주민'}</small></h3><p>${esc((hero&&classOf(u)?.ko)||CLASS_KO[u.className]||KIND_KO[u.kind]||u.className||'')} · LV ${u.level??'—'}</p>${bar('HP',u.hp,u.maxHP,'hp')}${u.maxMP?bar('MP',u.mp,u.maxMP,'mp'):''}${u.team==='ally'?bar('EXP',u.xp,100,'xp'):''}</div></div>`;
 let body='';
 if(tab==='ability')body=`<table class="grade-table">${[['ATK','공격력','atk'],['DEF','방어력','def'],['MAG','정신력','mag'],['RES','저항력','res'],['SPD','순발력','spd']].map(([k,ko,f])=>`<tr><th>${ko}</th><td class="grade g-${grade(v[f]||0)}">${grade(v[f]||0)}</td><td>${v[f]||0}${u.team==='ally'&&v[f]!==u[f]?` <small>(기본 ${u[f]})</small>`:''}</td></tr>`).join('')}<tr><th>이동력</th><td class="grade">${v.mov}</td><td>${PROFILE_KO[profile]||'보병'}</td></tr></table>${hero?`<p class="info-note">특성 · <b>${esc(u.talent)}</b> — ${esc(hero.description)}</p><p class="info-note">잠재력 단서 · ${esc(u.clues?.join(', ')||'아직 발견하지 못했다')}</p>`:''}`;
 if(tab==='equipment')body=u.team!=='ally'?'<p class="info-note">장비 정보를 알 수 없다.</p>':`<div class="info-slots">${['weapon','armor','accessory'].map(slot=>{const g=s.economy.gear.find(a=>a.id===s.economy.equipped[u.id][slot]);return `<div class="doll-slot ${g?'filled':''}"><span class="doll-name">${{weapon:'무기',armor:'방어구',accessory:'장신구'}[slot]}</span>${g?itemIcon(g.type,40):'<span class="doll-empty">기본</span>'}<b>${g?esc(GEAR[g.type].name)+(g.level?' +1':''):'기본 장비'}</b></div>`;}).join('')}</div>`;
 if(tab==='tactics')body=hero?`<div class="tactic-card"><h4>${esc(u.skill)} <small>MP ${skillCost(u)}</small></h4><p>${esc(SKILL_NOTE[u.id]||hero.description)}</p>${rangeGrid(...rangeFor(u,'skill'))}</div>`:'<p class="info-note">기술을 쓰지 않는다.</p>';
 if(tab==='growth'&&hero)body=growthHTML(s,u,esc);
 if(tab==='bio')body=`<p class="info-bio">${esc(BIO[u.id]||ENEMY_BIO[u.kind]||(u.team==='enemy'?'국경을 어지럽히는 무리의 일원. 자세한 내력은 알려지지 않았다.':'피난길에 오른 국경 마을 주민.'))}</p>`;
 if(tab==='class'){const types=['g','r','f','m','d','s','b','v'];body=`<div class="class-grid"><div><h4>${esc(PROFILE_KO[profile]||'보병')} · 지형 적성</h4><table class="apt-table">${types.map(t=>{const c=TERRAIN_COSTS[profile]?.[t]??TERRAIN[t].cost,T=TERRAIN[t];return `<tr><th>${T.ko}</th><td>${Number.isFinite(c)?`이동 ${c}`:'불가'}</td><td>${T.phys?`피해 ${Math.round(T.phys*100)}%↓ `:''}${T.evade?`회피 ${T.evade>0?'+':''}${T.evade}% `:''}${T.fire&&T.fire!==1?`화공 ×${T.fire}`:''}</td></tr>`;}).join('')}</table></div><div><h4>공격 범위</h4>${rangeGrid(...u.range)}<p class="info-note">${u.range[0]===u.range[1]?`사거리 ${u.range[0]}`:`사거리 ${u.range[0]}–${u.range[1]}`}${u.range[0]>1?' · 인접한 적은 공격할 수 없다':''}</p></div></div>`;}
 return `<div class="info-tabs">${tabs}</div>${head}<div class="info-body">${body}</div>`;
}

// v0.5.0 growth tab: class path, three-step potential, proficiency ★ and promotion conditions (D-047/D-048).
function growthHTML(s,u,esc){
 const rec=heroRecord(s,u.id)||u,cur=classOf(u),next=nextClassOf(u),pot=potentialOf(s.campaign,{...rec,clues:[...new Set([...(rec.clues||[]),...(u.clues||[])])]}),prof=proficiencyOf(s.campaign,u.id),st=promotionStatus(s,u.id);
 const action=next&&CLASS_ACTIONS[next.action],eff=PROFICIENCY_EFFECT[u.id]||{},effText=eff.hit?`명중 +${eff.hit}%`:eff.heal?`회복 +${eff.heal}`:'';
 const stars='★'.repeat(prof.stars)+'☆'.repeat(5-prof.stars);
 return `<div class="growth-path"><span class="cls now">${esc(cur?.ko||'')}</span>${next?`<span class="arrow">→</span><span class="cls next${st.promoted?' done':''}">${esc(next.ko)}<small>${esc(next.name)}</small></span>`:''}</div>`+
 (action?`<div class="tactic-card"><h4>${esc(action.ko)} <small>${esc(action.name)} · MP ${action.cost}</small></h4><p>${esc(action.note)}</p></div>`:'')+
 `<h4 class="growth-h">잠재력 ${pot.step}/${pot.max}</h4><ol class="potential-steps">${pot.steps.map(p=>`<li class="${p.done?'done':''}">${p.done?'✓':'·'} ${esc(p.label)}</li>`).join('')}</ol>`+
 `<h4 class="growth-h">숙련 <span class="prof-stars" aria-label="숙련 ${prof.stars}/5">${stars}</span></h4><p class="info-note">대표 행동 ${prof.count}회${prof.next?` · 다음 ★까지 ${prof.next-prof.count}회`:''}. 전직 후 ★마다 ${effText}.</p>`+
 (st.checks.length?`<h4 class="growth-h">전직 조건</h4><ul class="promo-checks">${st.checks.map(c=>`<li class="${c.ok?'ok':''}">${c.ok?'✓':'✗'} ${esc(c.label)}</li>`).join('')}</ul>`:st.promoted?'<p class="info-note">전직 완료.</p>':'');
}
