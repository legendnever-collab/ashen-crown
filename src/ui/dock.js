import {HEROES} from '../data/game-data.js';
import {findUnit,alive,forecast,skillCost,validTarget} from '../core/rules.js';
import {canAct} from '../core/game.js';
export function initialMode(){return 'choose';}
export function contextMessage(s,u,ui){
 if(ui.busy)return '적 Phase 진행 중 · 전장의 이동과 공격을 지켜보세요.';
 if(ui.notice)return ui.notice;
 if(s.screen==='deployment')return ui.mode==='deploy'?'푸른 배치 칸을 누르세요. 다른 장수의 위치에 놓으면 서로 교체합니다.':'장수를 누르면 즉시 선택됩니다. 하단의 배치 이동으로 위치를 변경하세요.';
 if(u.hp<=0)return '전투불능 · 다른 동료를 선택하세요.';
 if(u.acted)return '행동 완료 · 다른 장수를 누르거나 턴을 종료하세요.';
 if(ui.mode==='move')return `MOV ${u.mov+(u.shadowBonus||0)} · 푸른 칸으로 이동. 같은 위치를 다시 누르면 제자리에서 행동합니다.`;
 if(ui.mode==='skill')return `${u.skill} · ${skillCost(u)} MP · ${u.description}`;
 if(ui.mode==='attack')return `공격 사거리 ${u.range.join('–')} · 붉은 범위의 적을 눌러 피해와 반격을 확인하세요.`;
 if(ui.mode==='rescue')return '주민 구출 · 인접한 주민을 누르세요. 구출은 행동 1회를 사용합니다.';
 return `${u.moved?'이동 완료':'이동 미사용'} · ${u.mov+(u.shadowBonus||0)} MOV · ${u.range.join('–')}칸 공격 · 하단에서 공격, 스킬, 구출 또는 대기를 선택하세요.`;
}
export function renderDock(s,ui,esc,portrait,bar){
 const u=findUnit(s,ui.selected)||findUnit(s,'eric'),deploy=s.screen==='deployment',active=canAct(s,u)&&!ui.busy;
 const command=(action,label,extra='',disabled=false,id='',klass='')=>`<button data-do="${action}" ${id?`data-id="${id}"`:''} class="${klass} ${action==='mode'&&ui.mode===id?'active':''}" ${disabled?'disabled':''}>${label}${extra?`<small>${extra}</small>`:''}</button>`;
 let commands=deploy?command('mode','배치 이동','남쪽 영역',false,'deploy')+command('preset','추천 배치','',false,'recommended')+command('preset','공격 중심','',false,'assault')+command('preset','방어 중심','',false,'defense')+command('start-battle','전투 시작 →','',false,'','primary'):
 command('mode','이동',`${u.mov+(u.shadowBonus||0)} MOV`,!active||u.moved,'move')+command('mode','공격',`${u.range.join('–')}칸`,!active,'attack')+command('mode',u.skill,`${skillCost(u)} MP`,!active||u.mp<skillCost(u),'skill')+command('wait','대기','행동 종료',!active)+command('mode','주민 구출','인접 1칸',!active,'rescue')+command('undo','이동 취소','',!active||!s.undo[u.id])+command('item','회복약',`${s.potions}개 · +20 HP`,!active||!s.potions||u.hp===u.maxHP)+command('next','다음 장수','',ui.busy);
 let context=`<div class="dock-hint" role="status">${esc(contextMessage(s,u,ui))}</div>`;
 if(ui.inspected){const t=findUnit(s,ui.inspected);if(t)context=`<div class="dock-hint">${esc(t.name)} · HP ${t.hp}/${t.maxHP} · ${ui.notice||'현재 공격 사거리 밖입니다. 이동 또는 다른 장수의 공격을 선택하세요.'}</div>`;}
 if(ui.preview){const t=findUnit(s,ui.preview),f=forecast(s,u,t,ui.mode);context=`<div class="forecast dock-forecast"><div class="forecast-values"><strong>${esc(t.name)}</strong><span>${f.heal!==undefined?'회복':f.guard===true?'Guard':f.rescue?'구출':'피해'} <b>${f.heal!==undefined?`+${f.heal}`:f.guard===true?'근접 보호':f.rescue?'안전 대피':f.damage}</b></span><span>명중 <b>${f.hit}%</b></span><span>반격 <b>${f.counter}</b></span><span>예상 HP <b>${f.after}/${f.victim?findUnit(s,f.victim).maxHP:t.maxHP}</b></span>${f.flank?'<span>협공 <b>+6</b></span>':''}</div><div class="forecast-buttons">${command('confirm','행동 확정','',ui.busy,'','primary')}${command('cancel','취소')}</div><span class="forecast-note">${f.crit?`Critical ${f.crit}% · `:''}기본 피해 예측. Miss와 Critical에 따라 달라질 수 있습니다.</span></div>`;}
 if(ui.phaseConfirm)context=`<div class="phase-confirm"><strong>아직 행동 가능한 장수가 ${s.units.filter(u=>canAct(s,u)).length}명 있습니다.</strong><span>남은 행동을 포기하고 적 Phase로 넘어갈까요?</span>${command('confirm-phase','적 Phase 진행','',false,'','primary')}${command('cancel','계속 행동')}</div>`;
 const roster=deploy?`<div class="deploy-roster">${HEROES.map(h=>`<button data-do="select" data-id="${h.id}" class="${ui.selected===h.id?'active':''}">${h.name}</button>`).join('')}</div>`:'';
 return `<div class="dock-identity">${portrait(u,'dock-portrait')}<div class="dock-vitals"><div class="dock-name"><strong>${u.name}</strong><span>LV ${u.level||'—'} · ${u.role||u.kind}</span></div>${bar('HP',u.hp,u.maxHP)}${bar('MP',u.mp,u.maxMP,'mp')}<div class="dock-talent">${esc(u.talent||'')} ${u.clues?.length?'· Potential 1/3':''}</div></div></div><div class="dock-workspace">${roster}<div class="dock-context">${context}</div><div class="dock-commands">${commands}</div></div><div class="dock-utilities"><span class="dock-state">${deploy?'FREE DEPLOYMENT':ui.busy?'ENEMY PHASE':u.acted?'ACTION COMPLETE':u.moved?'MOVED · ACTION READY':'READY'}</span><div class="utility-buttons"><select class="speed" id="animation-speed" aria-label="애니메이션 속도">${[1,2,4].map(v=>`<option value="${v}" ${ui.speed===v?'selected':''}>${v}×</option>`).join('')}</select><button data-do="journal" class="small">기록</button><button data-do="help" class="small">?</button>${deploy?'':command('end-phase','턴 종료 →','',ui.busy||s.phase!=='player','','primary')}</div></div>`;
}
