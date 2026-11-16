// v0.9 ACT III (D-079, docs/v0.9.0/ACT3_DESIGN.md §7; numbers PROPOSED): 일기토 — at a story moment two champions meet.
// Three exchanges; each side picks strike / guard / finisher. Strike beats finisher (it lands first), finisher beats guard
// (it breaks it), guard beats strike (it parries). The same pick is decided by power (ATK + SPD, a small roll on a tie).
// Two exchanges won take the duel: the loser starts the battle 30% of max HP down (never below 1). Skipping keeps the
// battle as it is. While a duel is open the battle waits for it (the UI shows it as a modal).
import {findUnit,alive,roll} from './rules.js';
import {effectiveStats} from './economy.js';
// v2.0.0 「잿빛 결투장」 (REFORM_DESIGN §7, D-115): up to five exchanges, the first to three wins; 베기 · 막기 · 노리기.
// The same pick is decided by 무력 ×1.5 + 민첩 + 운 ×0.5 (a small roll on a tie). A hero who wins takes the treasure the foe carries.
export const DUEL_PICKS={strike:'베기',guard:'막기',finisher:'노리기'};
export const DUEL_ROUNDS=5,DUEL_TO_WIN=3;
const DUEL_BEATS={strike:'finisher',finisher:'guard',guard:'strike'};
export const DUEL_CUT=.3;
// A hook set by core/game.js (treasure claim), kept here to avoid a circular import.
let onDuelWon=null;
export const setDuelWon=fn=>{onDuelWon=fn;};
// A challenge (v2.0.0) may follow a story duel that is already decided: that record waits in d.prev and comes back after.
export function startDuel(s,heroId,foeId,key){const h=findUnit(s,heroId),f=findUnit(s,foeId),prev=key==='challenge'&&s.duel?.result?s.duel:null;if(s.screen!=='battle'||s.duel&&!prev||!h||!f||!alive(h)||!alive(f)||h.benched||f.benched)return false;
 s.duel={hero:heroId,foe:foeId,key,round:0,wins:[0,0],picks:[],result:null,...(prev?{prev}:{})};s.log.push(`일기토 · ${h.name} 대 ${f.name}`);return true;}
export const duelOpen=s=>!!s?.duel&&!s.duel.result;
const power=(s,u)=>{const v=effectiveStats(s,u),st=v.stats;return st?1.5*st.str+st.agi+.5*st.luk:v.atk+v.spd;};
// The foe's nature, shown in the arena: 공격적 (strong arm), 신중함 (quick feet) or 노련함 (luck and years).
export function duelNature(s,f){const st=f?.stats;if(!st)return f?.kind==='captain'?'bold':'careful';return st.str>=st.agi+2?'bold':st.agi>=st.str+2?'careful':'seasoned';}
export const NATURE_KO={bold:'공격적이다 — 노리기를 즐긴다',careful:'신중하다 — 막기를 즐긴다',seasoned:'노련하다 — 수를 읽기 어렵다'};
// The foe's pick leans on its nature: a strong foe likes the finisher, a careful one the guard (then a roll).
function foePick(s,f){const r=roll(s),n=duelNature(s,f);const bias=n==='bold'?[.35,.2,.45]:n==='careful'?[.3,.45,.25]:[.34,.33,.33];return r<bias[0]?'strike':r<bias[0]+bias[1]?'guard':'finisher';}
export function duelPick(s,pick){const d=s.duel;if(!duelOpen(s)||!DUEL_PICKS[pick]&&pick!=='skip')return false;const h=findUnit(s,d.hero),f=findUnit(s,d.foe);
 if(pick==='skip'){d.result='skipped';s.log.push('일기토를 거절했습니다. 전투가 그대로 이어집니다.');return true;}
 const fp=foePick(s,f);let win;if(pick===fp){const a=power(s,h),b=power(s,f);win=a===b?roll(s)<.5:a>b;}else win=DUEL_BEATS[pick]===fp;
 d.picks.push([pick,fp,win?1:0]);d.wins[win?0:1]++;d.round++;
 s.log.push(`${d.round}합 · ${h.name} ${DUEL_PICKS[pick]} / ${f.name} ${DUEL_PICKS[fp]} → ${win?h.name:f.name}`);
 if(d.wins[0]>=DUEL_TO_WIN||d.wins[1]>=DUEL_TO_WIN||d.round>=DUEL_ROUNDS){d.result=d.wins[0]>d.wins[1]?'hero':'foe';if(d.result==='hero'&&f.carries&&onDuelWon)onDuelWon(s,f);const loser=d.result==='hero'?f:h;loser.hp=Math.max(1,loser.hp-Math.ceil(loser.maxHP*DUEL_CUT));
  s.feedback.push({type:'guard',id:loser.id,text:'일기토 패배'});s.log.push(`일기토 승자 · ${(d.result==='hero'?h:f).name}. ${loser.name}의 HP가 30% 깎였습니다.`);
  if(d.key==='challenge'){const {prev,...done}=d;s.lastChallenge=done;s.duel=prev||null;}}
 return true;}
export function validDuel(s,d){return !!d&&typeof d==='object'&&typeof d.hero==='string'&&typeof d.foe==='string'&&!!findUnit(s,d.hero)&&!!findUnit(s,d.foe)&&typeof d.key==='string'&&d.key.length<40&&Number.isInteger(d.round)&&d.round>=0&&d.round<=DUEL_ROUNDS&&Array.isArray(d.wins)&&d.wins.length===2&&d.wins.every(n=>Number.isInteger(n)&&n>=0&&n<=DUEL_TO_WIN)&&Array.isArray(d.picks)&&d.picks.length===d.round&&d.picks.every(p=>Array.isArray(p)&&p.length===3&&DUEL_PICKS[p[0]]&&DUEL_PICKS[p[1]]&&[0,1].includes(p[2]))&&[null,'hero','foe','skipped'].includes(d.result);}
