import {TOOLS} from '../data/frontier-data.js';
import {findUnit,skillCost,forecast} from '../core/rules.js';
import {canAct} from '../core/game.js';
export function menuHTML(s,ui,esc){
 const u=findUnit(s,ui.selected);if(!u||!ui.menu||s.screen!=='battle')return '';const active=canAct(s,u)&&!ui.busy;
 const button=(action,label,id='',off=false,cls='')=>`<button role="menuitem" data-do="${action}" ${id?`data-id="${id}"`:''} ${off?'disabled':''} class="${cls}">${label}</button>`;
 const back=button('submenu','← 뒤로','root'),header=`<header><strong>${u.name}</strong><span>LV ${u.level}</span>${button('close-unit-menu','×','','','menu-close')}</header>`;
 let content='';
 if(ui.menu==='root')content=`<div class="menu-grid">${button('mode','이동','move',!active||u.moved)}${button('mode','공격','attack',!active)}${button('submenu','스킬','skills',!active)}${button('submenu','도구','tools',!active)}${button('submenu','특성','traits')}${s.missionId===2?button('mode','생포 · HP½','capture',!active):''}${button('mode','주민 구출','rescue',!active)}${button('wait','대기','',!active)}${button('undo','이동 취소','',!active||!s.undo[u.id])}</div>`;
 if(ui.menu==='skills')content=`<div class="menu-body"><div class="menu-label">직업 스킬 · ${u.mp}/${u.maxMP} MP</div>${button('mode',`${u.skill} <small>${skillCost(u)} MP</small>`,'skill',!active||u.mp<skillCost(u),'skill-choice')}<p>${esc(u.description)}</p>${back}</div>`;
 if(ui.menu==='tools')content=`<div class="menu-body"><div class="menu-label">도구 · 회복약 ${s.potions}개</div>${button('submenu','회복약 <small>자신의 HP +20</small>','item-confirm',!active||!s.potions||u.hp===u.maxHP,'skill-choice')}${Object.entries(TOOLS).map(([id,t])=>button('tool',`${t.name} × ${s.economy?.items[id]||0}`,id,!active||!s.economy?.items[id],'skill-choice')).join('')}<p>도구는 자신에게 사용 · 이동 후 가능 · 행동 1회.</p>${back}</div>`;
 if(ui.menu==='item-confirm')content=`<div class="menu-body"><p>회복약을 사용할까요?<br>HP ${u.hp} → ${Math.min(u.maxHP,u.hp+20)} / ${u.maxHP}</p><div class="menu-confirm">${button('item','사용','','','primary')}${back}</div></div>`;
 if(ui.menu==='traits')content=`<div class="menu-body"><div class="menu-label">${esc(u.talent)}</div><p>${esc(u.description)}</p><p>잠재력 단서 · ${esc(u.clues.join(', ')||'아직 발견하지 못했습니다.')}<br>각성 스킬은 아직 해금되지 않았습니다.</p>${back}</div>`;
 if(ui.menu==='move-confirm'&&ui.pendingMove){const m=ui.pendingMove;content=`<div class="menu-body"><div class="menu-label">이동 확인</div><p>(${m.x+1}, ${m.y+1}) 위치로<br>이동을 확정할까요?</p><div class="menu-confirm">${button('confirm-move','이동 확정','',ui.busy,'primary')}${button('cancel-move','취소','',ui.busy)}</div></div>`;}
 if(ui.menu==='forecast'&&ui.preview){const t=findUnit(s,ui.preview),f=forecast(s,u,t,ui.mode);content=`<div class="menu-body forecast"><div class="menu-label">${esc(t.name)}</div><dl><dt>${f.heal!==undefined?'회복':f.guard===true?'Guard':f.capture?'생포':f.rescue?'구출':'피해'}</dt><dd>${f.heal!==undefined?`+${f.heal} HP`:f.guard===true?'근접 보호':f.capture?'포로 확보':f.rescue?'안전 대피':f.damage}</dd><dt>명중 / 반격</dt><dd>${f.hit}% / ${f.counter} HP</dd><dt>대상 예상 HP</dt><dd>${f.after}/${f.victim?findUnit(s,f.victim).maxHP:t.maxHP}</dd></dl><p class="menu-note">${f.crit?`Critical ${f.crit}%. `:''}Miss와 Critical에 따라 결과가 달라집니다.</p><div class="menu-confirm">${button('confirm','행동 확정','',ui.busy,'primary')}${button('cancel-target','취소')}</div></div>`;}
 return `${header}${content}`;
}
