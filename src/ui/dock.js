import {effectiveStats} from '../core/economy.js';
import {HEROES,partyHeroes} from '../data/game-data.js';
import {findUnit,alive,forecast,skillCost,validTarget} from '../core/rules.js';
import {canAct,canMove} from '../core/game.js';
import {isClassMode,forecastClass,tileTarget} from '../core/class-actions.js';
import {CLASS_ACTIONS} from '../data/classes.js';
export function initialMode(){return 'choose';}
export function contextMessage(s,u,ui){
 if(ui.busy)return ui.pendingMove?'경로를 따라 이동 중 · 도착 후 확정하거나 취소하세요.':'전투 연출 진행 중 · 이동과 공격을 지켜보세요.';
 if(ui.pendingMove)return '이동 미확정 · 도착 위치의 확인 메뉴에서 확정 또는 취소하세요.';
 if(ui.notice)return ui.notice;
 if(s.screen==='deployment')return ui.mode==='deploy'?'파란 칸을 눌러 배치 · 다른 장수 자리면 교체':'오른쪽 초상화나 맵의 장수를 선택하세요';
 if(u.hp<=0)return '전투불능 · 다른 동료를 선택하세요.';
 if(u.acted&&canMove(s,u))return '그림자 추적자 · 공격 후에도 이동할 수 있습니다. 이동을 누르세요.';
 if(u.acted)return '행동 완료 · 다른 장수를 누르거나 턴을 종료하세요.';
 if(ui.mode==='move')return `MOV ${effectiveStats(s,u).mov+(u.shadowBonus||0)} · 푸른 칸으로 이동. 같은 위치를 다시 누르면 제자리에서 행동합니다.`;
 if(isClassMode(ui.mode)){const a=CLASS_ACTIONS[ui.mode];return `${a.ko} · ${a.cost} MP · ${tileTarget(ui.mode)?'룬을 깔 칸을 누르세요.':'대상을 누르세요.'} ${a.note}`;}
 if(ui.mode==='skill')return `${u.skill} · ${skillCost(u)} MP · ${u.description}`;
 if(ui.mode==='attack')return `공격 사거리 ${u.range.join('–')} · 붉은 범위의 적을 눌러 피해와 반격을 확인하세요.`;
 if(ui.mode==='capture')return '생포 · 도주 대장 HP 절반 이하에서 인접한 장수로 선택하세요.';
 if(ui.mode==='rescue')return '주민 구출 · 인접한 주민을 누르세요. 구출은 행동 1회를 사용합니다.';
 return `${u.moved?'이동 완료':'이동 미사용'} · ${effectiveStats(s,u).mov+(u.shadowBonus||0)} MOV · ${u.range.join('–')}칸 공격 · 장수를 누르거나 장수 명령을 열어 행동을 선택하세요.`;
}
export function renderDock(s,ui,esc,portrait,bar){
 const u=findUnit(s,ui.selected)||findUnit(s,'eric'),deploy=s.screen==='deployment',active=canAct(s,u)&&!ui.busy;
 const command=(action,label,extra='',disabled=false,id='',klass='')=>`<button data-do="${action}" ${id?`data-id="${id}"`:''} class="${klass} ${action==='mode'&&ui.mode===id?'active':''}" ${disabled?'disabled':''}>${label}${extra?`<small>${extra}</small>`:''}</button>`;
 let commands=deploy?command('warroom','← 회의','',false)+command('preset','✦ 추천','',false,'recommended')+command('start-battle','⚔ 전투 시작','',false,'','primary'):
 command('mode','이동',`${effectiveStats(s,u).mov+(u.shadowBonus||0)} MOV`,!active||u.moved,'move')+command('mode','공격',`${u.range.join('–')}칸`,!active,'attack')+command('mode',u.skill,`${skillCost(u)} MP`,!active||u.mp<skillCost(u),'skill')+command('wait','대기','행동 종료',!active)+command('mode','주민 구출','인접 1칸',!active,'rescue')+command('undo','이동 취소','',!active||!s.undo[u.id])+command('item','회복약',`${s.potions}개 · +20 HP`,!active||!s.potions||u.hp===u.maxHP)+command('next','다음 장수','',ui.busy);
 let context=`<div class="dock-hint" role="status">${esc(contextMessage(s,u,ui))}</div>`;
 if(ui.inspected){const t=findUnit(s,ui.inspected);if(t)context=`<div class="dock-hint">${esc(t.name)} · HP ${t.hp}/${t.maxHP} · ${ui.notice||'현재 공격 사거리 밖입니다. 이동 또는 다른 장수의 공격을 선택하세요.'} <button class="small" data-do="unit-info" data-id="${t.id}|ability">정보</button></div>`;}
 if(ui.preview&&isClassMode(ui.mode)){const f=forecastClass(s,u,ui.preview,ui.mode);context=`<div class="dock-hint">${esc(f.name)} · ${f.rows.map(r=>esc(r[0]+' '+r[1])).join(' · ')} · 한 번 더 누르면 실행</div>`;}
 else if(ui.preview){const t=findUnit(s,ui.preview),f=forecast(s,u,t,ui.mode);context=`<div class="dock-hint">${esc(t.name)} · ${f.heal!==undefined?`회복 +${f.heal} HP`:f.guard===true?'Guard · 첫 근접 공격 보호':f.rescue?'주민 안전 대피':`예상 피해 ${f.damage} / 명중 ${f.hit}% / 반격 ${f.counter}`} · 한 번 더 누르면 실행</div>`;}
 if(ui.phaseConfirm)context=`<div class="phase-confirm"><strong>아직 행동 가능한 장수가 ${s.units.filter(u=>canAct(s,u)).length}명 있습니다.</strong><span>남은 행동을 포기하고 적 Phase로 넘어갈까요?</span>${command('confirm-phase','적 Phase 진행','',false,'','primary')}${command('cancel','계속 행동')}</div>`;
 if(!deploy)commands=command('open-unit-menu','장수 명령','이동 · 공격 · 스킬',ui.busy)+command('next','다음 장수','',ui.busy||!!ui.pendingMove);
 const roster=deploy?`<div class="deploy-side" aria-label="출전 장수">${partyHeroes(s.campaign).map(h=>findUnit(s,h.id)).filter(a=>a&&!a.benched).map(a=>`<button data-do="select" data-id="${a.id}" class="deploy-face-btn ${ui.selected===a.id?'active':''}" title="${esc(a.name)}">${portrait(a,'deploy-face')}<span>${esc(a.name)}</span></button>`).join('')}</div>`:'';
 return `<div class="dock-identity">${portrait(u,'dock-portrait')}<div class="dock-vitals"><div class="dock-name"><strong>${u.name}</strong><span>LV ${u.level||'—'} · ${u.role||u.kind}</span></div>${bar('HP',u.hp,u.maxHP)}${bar('MP',u.mp,u.maxMP,'mp')}<div class="dock-talent">${esc(u.talent||'')} ${u.clues?.length?'· Potential 1/3':''}</div></div></div><div class="dock-workspace">${roster}<div class="dock-context">${context}</div><div class="dock-commands ${deploy?'':'compact-commands'}">${commands}</div></div><div class="dock-utilities"><label class="walk-setting">이동 <select class="speed" id="movement-animation" aria-label="이동 모션"><option value="step" ${ui.movement==='step'?'selected':''}>칸별 걷기</option><option value="smooth" ${ui.movement==='smooth'?'selected':''}>연속 걷기</option><option value="instant" ${ui.movement==='instant'?'selected':''}>즉시 이동</option></select></label><span class="dock-state">${deploy?'FREE DEPLOYMENT':ui.busy?'ANIMATION':u.acted?'ACTION COMPLETE':u.moved?'MOVED · ACTION READY':'READY'}</span><div class="utility-buttons"><label class="reduced-setting"><input type="checkbox" id="reduced-effects" ${ui.reduced?'checked':''}>효과 약하게</label><select class="speed" id="animation-speed" aria-label="애니메이션 속도">${[1,2,4].map(v=>`<option value="${v}" ${ui.speed===v?'selected':''}>${v}×</option>`).join('')}</select><button data-do="journal" class="small">기록</button><button data-do="help" class="small">?</button>${deploy?'':command('end-phase','턴 종료 →','',ui.busy||s.phase!=='player','','primary')}</div></div>`;
}
