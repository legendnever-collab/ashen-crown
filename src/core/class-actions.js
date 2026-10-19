// v0.5.0 Phase D: the five promotion actions (D-048). Only tier-2 heroes can use them, so every M01–M06
// path with tier-1 heroes is unchanged. State they leave behind: ally.bulwark / ally.overwatch (until the
// next Player Phase), enemy.noCounter (this Player Phase), s.runes [{x,y,until}] (two turns).
import {CLASS_TREE,CLASS_ACTIONS} from '../data/classes.js';
import {distance,key,alive,at,findUnit,terrainAt,terrainCost} from './rules.js';
import {remember} from './narrative.js';
import {missionOf} from '../data/missions.js';

export const CLASS_MODES=['bulwark','overwatch','arcane','recall','exchange'];
const SELF_MODES=['bulwark','overwatch'];
export const isClassMode=mode=>CLASS_MODES.includes(mode);
export function classActionOf(u){if(!u||(u.classTier||1)<2)return null;return CLASS_TREE[u.id]?.find(c=>c.tier===2)?.action||null;}
export const classCost=mode=>CLASS_ACTIONS[mode]?.cost||0;
export const tileTarget=mode=>mode==='arcane';
const parseTile=t=>{const m=/^(\d+),(\d+)$/.exec(String(t??''));return m?{x:+m[1],y:+m[2]}:null;};
const standable=(s,u,x,y)=>Number.isFinite(terrainCost(s,u,x,y));
const ADJ=[[0,-1],[-1,0],[1,0],[0,1]];
// Free tile next to Sain closest to where the recalled ally stands now.
function recallSpot(s,sain,t){return ADJ.map(([dx,dy])=>({x:sain.x+dx,y:sain.y+dy})).filter(p=>terrainAt(p.x,p.y,s)&&!at(s,p.x,p.y)&&standable(s,t,p.x,p.y)).sort((a,b)=>distance(a,t)-distance(b,t)||a.y-b.y||a.x-b.x)[0]||null;}
function runeCells(s,c){const {width,height}=missionOf(s);return [[0,0],...ADJ].map(([dx,dy])=>({x:c.x+dx,y:c.y+dy})).filter(p=>p.x>=0&&p.y>=0&&p.x<width&&p.y<height&&terrainAt(p.x,p.y,s)&&Number.isFinite(terrainAt(p.x,p.y,s).cost));}

export function validClassTarget(s,u,target,mode){
 if(classActionOf(u)!==mode||!alive(u))return false;
 if(SELF_MODES.includes(mode))return target===u.id||target?.id===u.id;
 if(mode==='arcane'){const p=typeof target==='object'&&target?.x!=null?target:parseTile(target);if(!p||!terrainAt(p.x,p.y,s)||!Number.isFinite(terrainAt(p.x,p.y,s).cost))return false;return distance(u,p)<=3;}
 const t=typeof target==='object'?target:findUnit(s,target);if(!t||!alive(t)||t.id===u.id)return false;const d=distance(u,t);
 if(mode==='recall')return t.team==='ally'&&d>=2&&d<=4&&!!recallSpot(s,u,t);
 if(mode==='exchange'){if(t.team==='ally')return d<=3&&standable(s,u,t.x,t.y)&&standable(s,t,u.x,u.y);
  return t.team==='enemy'&&d===1&&(t.mov||0)>0&&!t.withdrawing&&!['beacon','wagon'].includes(t.kind)&&standable(s,u,t.x,t.y)&&standable(s,t,u.x,u.y);}
 return false;
}
// Cells the renderer highlights while a class mode is chosen.
export function classTargetCells(s,u,mode){const out=[];if(!classActionOf(u))return out;
 if(SELF_MODES.includes(mode))return [{x:u.x,y:u.y}];
 if(mode==='arcane'){for(let y=u.y-3;y<=u.y+3;y++)for(let x=u.x-3;x<=u.x+3;x++)if(validClassTarget(s,u,{x,y},mode))out.push({x,y});return out;}
 for(const t of s.units)if(validClassTarget(s,u,t,mode))out.push({x:t.x,y:t.y});return out;}

export function forecastClass(s,u,target,mode){
 const a=CLASS_ACTIONS[mode],base={classAction:mode,name:a.ko,cost:a.cost,hit:100,damage:0,counter:0};
 if(mode==='bulwark')return {...base,rows:[['효과','인접 칸에 들어온 적 정지'],['지속','다음 아군 턴까지']]};
 if(mode==='overwatch')return {...base,rows:[['효과',`사거리 ${u.range[0]}–${u.range[1]} 첫 진입 적 사격`],['명중 시','그 적의 이동 종료']]};
 if(mode==='arcane'){const p=typeof target==='object'?target:parseTile(target);return {...base,rows:[['룬',`${runeCells(s,p).length}칸 · 2턴`],['효과','아군 MAG +3 · 적 RES −2']]};}
 const t=typeof target==='object'?target:findUnit(s,target);
 if(mode==='recall'){const spot=recallSpot(s,u,t);return {...base,target:t.id,rows:[['이동',spot?`세인 옆 (${spot.x+1}, ${spot.y+1})`:'불가'],['회복',`+${Math.min(10,t.maxHP-t.hp)} HP`]]};}
 return {...base,target:t.id,rows:[['교환',`${t.name} ↔ 카이`],['반격',t.team==='enemy'?'이번 아군 턴 동안 반격 불가':'—']]};
}

// Applies the action. Caller (game.performAction) checks canAct, spends the action and awards EXP.
export function applyClassAction(s,u,target,mode){
 if(!validClassTarget(s,u,target,mode))return {ok:false,error:'대상 또는 사거리가 올바르지 않습니다.'};
 if(u.mp<classCost(mode))return {ok:false,error:'MP가 부족합니다.'};
 u.mp-=classCost(mode);remember(s,`${u.id}_class`);const name=CLASS_ACTIONS[mode].ko;
 if(mode==='bulwark'){u.bulwark=true;s.feedback.push({type:'guard',id:u.id,text:name});s.log.push(`${u.name}: ${name}. 다음 아군 턴까지 인접 칸에 들어온 적은 멈춥니다.`);}
 else if(mode==='overwatch'){u.overwatch=true;s.feedback.push({type:'guard',id:u.id,text:name});s.log.push(`${u.name}: ${name}. 사거리 안으로 처음 들어오는 적을 쏩니다.`);}
 else if(mode==='arcane'){const p=typeof target==='object'?target:parseTile(target),cells=runeCells(s,p);s.runes=(s.runes||[]).filter(r=>!cells.some(c=>c.x===r.x&&c.y===r.y));for(const c of cells){s.runes.push({x:c.x,y:c.y,until:s.turn+2});const k=key(c.x,c.y);if(s.burning?.[k])s.burning[k]++;}
  s.feedback.push({type:'guard',id:u.id,text:name});s.log.push(`${u.name}: ${name} (${cells.length}칸, 2턴). 아군 MAG +3 · 적 RES −2.`);}
 else if(mode==='recall'){const t=findUnit(s,target?.id||target),spot=recallSpot(s,u,t),from={x:t.x,y:t.y};t.x=spot.x;t.y=spot.y;const heal=Math.min(10,t.maxHP-t.hp);t.hp+=heal;
  s.feedback.push({type:'move',id:t.id,path:[from,spot]});if(heal)s.feedback.push({type:'heal',id:t.id,text:`+${heal}`,toHP:t.hp});s.log.push(`${u.name}: ${name} → ${t.name}을(를) 곁으로 불러 ${heal} 회복.`);}
 else if(mode==='exchange'){const t=findUnit(s,target?.id||target),a={x:u.x,y:u.y},b={x:t.x,y:t.y};u.x=b.x;u.y=b.y;t.x=a.x;t.y=a.y;if(t.team==='enemy')t.noCounter=s.turn;
  s.feedback.push({type:'move',id:u.id,path:[a,b]},{type:'move',id:t.id,path:[b,a]});s.log.push(`${u.name}: ${name} → ${t.name}와 위치 교환${t.team==='enemy'?' · 이번 턴 반격 불가':''}.`);}
 return {ok:true};
}

// Enemy Phase: the first enemy step inside an overwatching ally's attack range draws one shot; a hit ends
// that enemy's movement on that step. Returns the index of the step where the enemy stops (or path end).
export function overwatchStop(s,u,path,shoot){
 const watchers=s.units.filter(a=>a.team==='ally'&&a.overwatch&&alive(a));if(!watchers.length||!path||path.length<2)return path?path.length-1:0;
 for(let i=1;i<path.length;i++){const p=path[i];for(const a of watchers){if(!a.overwatch||!alive(a))continue;const d=distance(a,p);if(d<a.range[0]||d>a.range[1])continue;
   a.overwatch=false;const ox=u.x,oy=u.y;u.x=p.x;u.y=p.y;const r=shoot(a,u);if(!alive(u)||r?.hit)return i;u.x=ox;u.y=oy;}}
 return path.length-1;
}
// Small danger term for the generic enemy planner; zero when no overwatch or rune is active.
export function hazardAt(s,u,x,y){let h=0;for(const a of s.units)if(a.team==='ally'&&a.overwatch&&alive(a)){const d=Math.abs(a.x-x)+Math.abs(a.y-y);if(d>=a.range[0]&&d<=a.range[1])h+=8;}if(s.runes?.some(r=>r.x===x&&r.y===y))h+=4;return h;}
// Turn rollover (start of the next Player Phase).
export function expireClassEffects(s){for(const u of s.units){if(u.bulwark)delete u.bulwark;if(u.overwatch)delete u.overwatch;if(u.noCounter!=null)delete u.noCounter;if(u.strikeMove!=null)delete u.strikeMove;}
 if(s.runes){s.runes=s.runes.filter(r=>r.until>s.turn);if(!s.runes.length)delete s.runes;}}
