// v0.9 ACT III (D-079, docs/v0.9.0/ACT3_DESIGN.md §7; numbers PROPOSED): 일기토 — at a story moment two champions meet.
// Three exchanges; each side picks strike / guard / finisher. Strike beats finisher (it lands first), finisher beats guard
// (it breaks it), guard beats strike (it parries). The same pick is decided by power (ATK + SPD, a small roll on a tie).
// Two exchanges won take the duel: the loser starts the battle 30% of max HP down (never below 1). Skipping keeps the
// battle as it is. While a duel is open the battle waits for it (the UI shows it as a modal).
import {findUnit,alive,roll} from './rules.js';
import {effectiveStats} from './economy.js';
export const DUEL_PICKS={strike:'공격',guard:'수비',finisher:'필살'};
const DUEL_BEATS={strike:'finisher',finisher:'guard',guard:'strike'};
export const DUEL_CUT=.3;
export function startDuel(s,heroId,foeId,key){const h=findUnit(s,heroId),f=findUnit(s,foeId);if(s.screen!=='battle'||s.duel||!h||!f||!alive(h)||!alive(f)||h.benched||f.benched)return false;
 s.duel={hero:heroId,foe:foeId,key,round:0,wins:[0,0],picks:[],result:null};s.log.push(`일기토 · ${h.name} 대 ${f.name}`);return true;}
export const duelOpen=s=>!!s?.duel&&!s.duel.result;
const power=(s,u)=>{const v=effectiveStats(s,u);return v.atk+v.spd;};
// The foe's pick leans on its nature: a strong foe likes the finisher, a careful one the guard (then a roll).
function foePick(s,f){const r=roll(s);const bias=f.kind==='captain'?[.4,.25,.35]:[.4,.35,.25];return r<bias[0]?'strike':r<bias[0]+bias[1]?'guard':'finisher';}
export function duelPick(s,pick){const d=s.duel;if(!duelOpen(s)||!DUEL_PICKS[pick]&&pick!=='skip')return false;const h=findUnit(s,d.hero),f=findUnit(s,d.foe);
 if(pick==='skip'){d.result='skipped';s.log.push('일기토를 거절했습니다. 전투가 그대로 이어집니다.');return true;}
 const fp=foePick(s,f);let win;if(pick===fp){const a=power(s,h),b=power(s,f);win=a===b?roll(s)<.5:a>b;}else win=DUEL_BEATS[pick]===fp;
 d.picks.push([pick,fp,win?1:0]);d.wins[win?0:1]++;d.round++;
 s.log.push(`${d.round}합 · ${h.name} ${DUEL_PICKS[pick]} / ${f.name} ${DUEL_PICKS[fp]} → ${win?h.name:f.name}`);
 if(d.wins[0]>=2||d.wins[1]>=2||d.round>=3){d.result=d.wins[0]>d.wins[1]?'hero':'foe';const loser=d.result==='hero'?f:h;loser.hp=Math.max(1,loser.hp-Math.ceil(loser.maxHP*DUEL_CUT));
  s.feedback.push({type:'guard',id:loser.id,text:'일기토 패배'});s.log.push(`일기토 승자 · ${(d.result==='hero'?h:f).name}. ${loser.name}의 HP가 30% 깎였습니다.`);}
 return true;}
export function validDuel(s,d){return !!d&&typeof d==='object'&&typeof d.hero==='string'&&typeof d.foe==='string'&&!!findUnit(s,d.hero)&&!!findUnit(s,d.foe)&&typeof d.key==='string'&&d.key.length<40&&Number.isInteger(d.round)&&d.round>=0&&d.round<=3&&Array.isArray(d.wins)&&d.wins.length===2&&d.wins.every(n=>Number.isInteger(n)&&n>=0&&n<=3)&&Array.isArray(d.picks)&&d.picks.length===d.round&&d.picks.every(p=>Array.isArray(p)&&p.length===3&&DUEL_PICKS[p[0]]&&DUEL_PICKS[p[1]]&&[0,1].includes(p[2]))&&[null,'hero','foe','skipped'].includes(d.result);}
