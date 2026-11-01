// v0.8.0 「전술」 (D-073; numbers PROPOSED): the new skills (② and the recruits' ③) and the tools as targeted actions.
// They share the promotion actions' plumbing (validClassTarget / classTargetCells / forecastClass / tileTarget), so the
// screen code treats them like the v0.5 class actions. Damage goes through game.js (strike callback) so guards, criticals,
// mission hooks and feedback stay the same as a normal attack.
import {distance,key,alive,at,findUnit,terrainAt,hostile,strikeStats,roll} from './rules.js';
import {missionOf} from '../data/missions.js';
import {TOOLS} from '../data/frontier-data.js';
import {skillByMode,knowsMode,NEW_SKILL_MODES} from '../data/skills.js';
import {statusChance,inflict,cure,STATUS,STATUS_KO,hasStatus} from './status.js';
import {ensureEconomy} from './economy.js';
import {remember} from './narrative.js';

export const THROW_LIMIT=3;
const ADJ8=[[0,-1],[-1,0],[1,0],[0,1]];
// How each tool is used: on self or an adjacent ally, around the user, or thrown (range 2–3) at a tile or an enemy.
export const TOOL_USE={herb:{on:'ally',hp:15},medium:{on:'ally',hp:30},ether:{on:'ally',mp:8},elixir:{on:'ally',full:true,cure:STATUS},
 antidote:{on:'ally',cure:['poison']},clarity:{on:'ally',cure:['confuse','bind','silence']},ward:{on:'ally',ward:true},drum:{on:'self'},
 bomb:{on:'tile',throw:true},smoke:{on:'tile',throw:true},caltrops:{on:'tile',throw:true},bewilder:{on:'enemy',throw:true},net:{on:'enemy',throw:true}};
const SKILL_SELF=['rallyCry','whirlwind','pilgrimLantern'];
export const TACTIC_TILE_MODES=['flameBurst','tool:bomb','tool:smoke','tool:caltrops'];
export const isToolMode=mode=>typeof mode==='string'&&mode.startsWith('tool:')&&!!TOOL_USE[mode.slice(5)];
export const isTacticMode=mode=>NEW_SKILL_MODES.includes(mode)||isToolMode(mode);
export const tacticCost=mode=>isToolMode(mode)?0:skillByMode(mode)?.cost||0;
export const throwsLeft=s=>THROW_LIMIT-(s.throws||0);
const tileOf8=t=>{if(t&&typeof t==='object'&&t.x!=null)return {x:t.x,y:t.y};const m=/^(\d+),(\d+)$/.exec(String(t??''));return m?{x:+m[1],y:+m[2]}:null;};
const cross=(s,p)=>{const {width,height}=missionOf(s);return [[0,0],...ADJ8].map(([dx,dy])=>({x:p.x+dx,y:p.y+dy})).filter(c=>c.x>=0&&c.y>=0&&c.x<width&&c.y<height&&terrainAt(c.x,c.y,s));};
const open=(s,x,y)=>Number.isFinite(terrainAt(x,y,s)?.cost);
const foesIn=(s,u,cells)=>s.units.filter(t=>alive(t)&&hostile(s,u,t)&&cells.some(c=>c.x===t.x&&c.y===t.y));
const unitOf=(s,target)=>typeof target==='object'&&target?.id?findUnit(s,target.id):findUnit(s,target);
const silenced=u=>hasStatus(u,'silence');
// Where Thea's Breakthrough pushes the target (null when blocked).
export function pushSpot(s,u,t){const x=t.x+Math.sign(t.x-u.x),y=t.y+Math.sign(t.y-u.y);return open(s,x,y)&&!at(s,x,y)&&!s.units.some(o=>alive(o)&&o.x===x&&o.y===y)?{x,y}:null;}
function caltropSpots(s,p){const out=[p];const nb=ADJ8.map(([dx,dy])=>({x:p.x+dx,y:p.y+dy})).find(c=>open(s,c.x,c.y)&&!at(s,c.x,c.y)&&!(s.traps||[]).some(t=>t.x===c.x&&t.y===c.y));if(nb)out.push(nb);return out;}

export function validTacticTarget(s,u,target,mode){
 if(!u||!alive(u)||u.team!=='ally')return false;
 if(isToolMode(mode)){const id=mode.slice(5),use=TOOL_USE[id],e=s.economy;if(!e?.items?.[id])return false;if(use.throw&&throwsLeft(s)<=0)return false;
  if(use.on==='tile'){const p=tileOf8(target);if(!p||!open(s,p.x,p.y))return false;const d=distance(u,p);if(d<2||d>3)return false;
   if(id==='caltrops')return !at(s,p.x,p.y)&&!(s.traps||[]).some(t=>t.x===p.x&&t.y===p.y);return true;}
  const t=unitOf(s,target);if(!t||!alive(t))return false;
  if(use.on==='self')return t.id===u.id;
  if(use.on==='enemy'){const d=distance(u,t);return hostile(s,u,t)&&d>=2&&d<=3&&!['beacon','wagon','brazier'].includes(t.kind);}
  if(t.team!=='ally'||distance(u,t)>1)return false;
  if(use.hp)return t.hp<t.maxHP;if(use.mp)return t.mp<t.maxMP;if(use.ward)return !t.ward;
  if(use.full)return t.hp<t.maxHP||!!t.status;return use.cure.some(k=>hasStatus(t,k));}
 if(!knowsMode(u,mode)||silenced(u))return false;
 if(mode==='flameBurst'){const p=tileOf8(target);if(!p||!open(s,p.x,p.y))return false;const d=distance(u,p);return d>=2&&d<=3&&foesIn(s,u,cross(s,p)).length>0;}
 const t=unitOf(s,target);if(!t||!alive(t))return false;const d=distance(u,t);
 if(SKILL_SELF.includes(mode)){if(t.id!==u.id)return false;if(mode==='whirlwind')return s.units.some(e=>alive(e)&&hostile(s,u,e)&&distance(u,e)===1);return true;}
 if(mode==='purify')return t.team==='ally'&&d<=2&&(!!t.status||t.hp<t.maxHP);
 if(mode==='provoke')return hostile(s,u,t)&&t.team==='enemy'&&d>=1&&d<=3&&(t.mov||0)>0&&!['beacon','wagon'].includes(t.kind);
 if(mode==='pinningShot')return hostile(s,u,t)&&d>=2&&d<=3;
 return hostile(s,u,t)&&d===1&&!['beacon'].includes(t.kind);
}
export function tacticTargetCells(s,u,mode){const out=[];if(!u)return out;
 if(TACTIC_TILE_MODES.includes(mode)){for(let y=u.y-3;y<=u.y+3;y++)for(let x=u.x-3;x<=u.x+3;x++)if(validTacticTarget(s,u,{x,y},mode))out.push({x,y});return out;}
 for(const t of s.units)if(alive(t)&&validTacticTarget(s,u,t,mode))out.push({x:t.x,y:t.y});return out;}

// Damage of a skill strike (the scale and bonus are applied on top of a normal attack's numbers).
export const STRIKE={pinningShot:{scale:.7},flameBurst:{scale:.5,noCounter:true},venomEdge:{},breakthrough:{},whirlwind:{scale:.7,noCounter:true},feint:{noCounter:true},flameBrand:{}};
export function strikePreview(s,u,t,mode,extra=0){const st=strikeStats(s,u,t,mode),sc=STRIKE[mode]?.scale||1;return {...st,damage:Math.max(1,Math.round(st.damage*sc))+extra};}
const bombDamage=t=>Math.max(1,16-Math.floor((t.def||0)/2));
const row=(k,v)=>[k,v];

export function forecastTactic(s,u,target,mode){
 const tool=isToolMode(mode),id=tool?mode.slice(5):null,k=tool?null:skillByMode(mode),name=tool?TOOLS[id].name:k.ko;
 const base={classAction:mode,name,cost:tacticCost(mode),tool,hit:100,damage:0,counter:0,rows:[]};
 if(tool){const use=TOOL_USE[id];
  if(use.on==='tile'){const p=tileOf8(target),cells=id==='caltrops'?caltropSpots(s,p):cross(s,p),foes=foesIn(s,u,cells);
   if(id==='bomb')return {...base,cells,rows:[row('범위',`십자 ${cells.length}칸 · 적 ${foes.length}명`),row('피해',foes.map(t=>`${t.name} ${bombDamage(t)}`).join(' · ')||'—'),row('투척',`이번 전투 ${throwsLeft(s)}/${THROW_LIMIT}`)]};
   if(id==='smoke')return {...base,cells,rows:[row('범위',`십자 ${cells.length}칸`),row('효과','다음 적 턴까지 그 안의 아군을 노리는 명중 −30'),row('투척',`이번 전투 ${throwsLeft(s)}/${THROW_LIMIT}`)]};
   return {...base,cells,rows:[row('설치',`${cells.length}칸`),row('효과','밟은 적은 멈추고 6 피해'),row('투척',`이번 전투 ${throwsLeft(s)}/${THROW_LIMIT}`)]};}
  const t=unitOf(s,target);
  if(use.on==='enemy'){const kind=id==='net'?'bind':'confuse';return {...base,target:t.id,rows:[row('대상',t.name),row(STATUS_KO[kind],`${statusChance(s,t,kind,id==='net'?100:75)}%`),row('투척',`이번 전투 ${throwsLeft(s)}/${THROW_LIMIT}`)]};}
  if(use.on==='self')return {...base,target:u.id,rows:[row('범위','자신과 인접 아군'),row('효과','다음 아군 턴까지 ATK +3')]};
  const what=use.hp?`HP +${Math.min(use.hp,t.maxHP-t.hp)}`:use.mp?`MP +${Math.min(use.mp,t.maxMP-t.mp)}`:use.ward?'DEF/RES +2':use.full?'HP 전부 · 상태이상 해제':`${use.cure.map(c=>STATUS_KO[c]).join('·')} 해제`;
  return {...base,target:t.id,rows:[row('대상',t.name),row('효과',what)]};}
 if(mode==='flameBurst'){const p=tileOf8(target),cells=cross(s,p),foes=foesIn(s,u,cells);return {...base,cells,rows:[row('범위',`십자 ${cells.length}칸 · 적 ${foes.length}명`),row('피해',foes.map(t=>{const f=strikePreview(s,u,t,mode);return `${t.name} ${f.damage}(${f.hit}%)`;}).join(' · ')),row('반격','없음')]};}
 const t=unitOf(s,target);
 if(mode==='rallyCry'){const n=s.units.filter(a=>a.team==='ally'&&alive(a)&&distance(a,u)<=2).length;return {...base,target:u.id,rows:[row('범위',`주위 2칸 아군 ${n}명`),row('효과','다음 아군 턴까지 MOV +1 · 명중 +10')]};}
 if(mode==='pilgrimLantern'){const n=s.units.filter(a=>a.team==='ally'&&alive(a)&&distance(a,u)<=1).length;return {...base,target:u.id,rows:[row('범위',`자신과 인접 아군 ${n}명`),row('효과','상태이상 해제 · 다음 적 턴까지 면역')]};}
 if(mode==='whirlwind'){const foes=s.units.filter(e=>alive(e)&&hostile(s,u,e)&&distance(u,e)===1);return {...base,target:u.id,rows:[row('대상',`인접한 적 ${foes.length}명`),row('피해',foes.map(e=>{const f=strikePreview(s,u,e,mode);return `${e.name} ${f.damage}(${f.hit}%)`;}).join(' · ')),row('반격','없음')]};}
 if(mode==='purify')return {...base,target:t.id,rows:[row('대상',t.name),row('효과',`상태이상 해제 · HP +${Math.min(8,t.maxHP-t.hp)} · 다음 적 턴까지 면역`)]};
 if(mode==='provoke')return {...base,target:t.id,rows:[row('대상',t.name),row('도발',`${t.id==='boss'||t.kind==='captain'||t.kind==='lion'||t.leader?50:100}% · 다음 적 턴에 에릭만 노림`),row('에릭','DEF +2')]};
 const blocked=mode==='breakthrough'&&!pushSpot(s,u,t),f=strikePreview(s,u,t,mode,blocked?3:0),counter=STRIKE[mode]?.noCounter?0:counterPreview(s,u,t,f);
 const extra=mode==='pinningShot'?row('속박',`${statusChance(s,t,'bind',100)}%`):mode==='venomEdge'?row('독',`${statusChance(s,t,'poison',100)}%`):mode==='breakthrough'?row('밀어내기',blocked?'막힘 · 피해 +3':'1칸'):mode==='feint'?row('약화','ATK −4 · 반격 없음'):row('낙인','DEF −3 · 2턴');
 return {...base,target:t.id,hit:f.hit,damage:f.damage,counter,after:Math.max(0,t.hp-f.damage),rows:[row('피해',`${f.damage} (명중 ${f.hit}%)`),extra,row('반격',counter?`${counter} HP`:'없음'),row('대상 예상 HP',`${Math.max(0,t.hp-f.damage)}/${t.maxHP}`)]};
}
function counterPreview(s,u,t,f){if(t.hp<=f.damage)return 0;const d=distance(u,t);if(d<t.range[0]||d>t.range[1]||t.noCounter===s.turn)return 0;return strikeStats(s,t,u).damage;}

// Applies the action. game.performAction checks canAct, spends the action, awards EXP and runs counters.
// strike(u,t,mode,opts) → {hit,damage,victim}. Returns {ok, struck:[targets hit], kills, counter:target|null}.
export function applyTactic(s,u,target,mode,strike){
 if(!validTacticTarget(s,u,target,mode))return {ok:false,error:'대상 또는 사거리가 올바르지 않습니다.'};
 if(u.mp<tacticCost(mode))return {ok:false,error:'MP가 부족합니다.'};
 const out={ok:true,struck:[],tried:[],kills:0,counter:null};const hitOn=(t,opts={})=>{out.tried.push(t);const r=strike(u,t,mode,{scale:STRIKE[mode]?.scale||1,...opts});if(r.hit){out.struck.push(r.victim);if(!alive(r.victim))out.kills++;}return r;};
 if(isToolMode(mode)){const id=mode.slice(5),use=TOOL_USE[id],e=ensureEconomy(s);e.items[id]--;if(use.throw)s.throws=(s.throws||0)+1;
  if(use.on==='tile'){const p=tileOf8(target);
   if(id==='bomb'){const cells=cross(s,p);s.feedback.push({type:'class',action:'bomb',id:u.id,text:TOOLS[id].name,cells});for(const t of foesIn(s,u,cells)){out.tried.push(t);const n=bombDamage(t),fromHP=t.hp;t.hp=Math.max(0,t.hp-n);s.feedback.push({type:'hit',id:t.id,text:`−${n}`,fromHP,toHP:t.hp,damage:n});out.struck.push(t);if(!alive(t)){out.kills++;s.feedback.push({type:'death',id:t.id,text:'FALLEN'});s.log.push(`${t.name} 전투불능.`);}}for(const c of cells)igniteCell(s,c);s.log.push(`${u.name}: 화약 폭탄 투척.`);}
   else if(id==='smoke'){const cells=cross(s,p);s.smoke=(s.smoke||[]).filter(c=>!cells.some(n=>n.x===c.x&&n.y===c.y));for(const c of cells)s.smoke.push({x:c.x,y:c.y,until:s.turn});s.feedback.push({type:'class',action:'smoke',id:u.id,text:TOOLS[id].name,cells});s.log.push(`${u.name}: 연막탄. 다음 적 턴까지 연기 속 아군은 맞히기 어렵습니다.`);}
   else{const cells=caltropSpots(s,p);s.traps=[...(s.traps||[]),...cells.map(c=>({x:c.x,y:c.y}))];s.feedback.push({type:'class',action:'caltrops',id:u.id,text:TOOLS[id].name,cells});s.log.push(`${u.name}: 마름쇠 ${cells.length}칸 설치.`);}
   return out;}
  const t=unitOf(s,target);
  if(use.on==='enemy'){s.feedback.push({type:'class',action:id,id:u.id,target:t.id,text:TOOLS[id].name});if(inflict(s,t,id==='net'?'bind':'confuse',id==='net'?100:75))out.struck.push(t);return out;}
  if(use.on==='self'){for(const a of s.units.filter(a=>a.team==='ally'&&alive(a)&&distance(a,u)<=1)){a.drum=s.turn+1;s.feedback.push({type:'guard',id:a.id,text:'ATK +3'});}s.log.push(`${u.name}: 전고. 곁의 아군 ATK +3.`);return out;}
  if(use.hp||use.full){const n=Math.min(use.full?t.maxHP:use.hp,t.maxHP-t.hp);t.hp+=n;if(n)s.feedback.push({type:'heal',id:t.id,text:`+${n}`,toHP:t.hp});}
  if(use.mp){const n=Math.min(use.mp,t.maxMP-t.mp);t.mp+=n;s.feedback.push({type:'heal',id:t.id,text:`+${n} MP`});}
  if(use.ward){t.ward=true;s.feedback.push({type:'guard',id:t.id,text:'WARD'});}
  if(use.cure)cure(s,t,use.cure);
  s.log.push(`${u.name}: ${TOOLS[id].name} → ${t.name}.`);return out;}
 u.mp-=tacticCost(mode);remember(s,`${u.id}_tactic`);const k=skillByMode(mode);if(mode!=='flameBurst')s.feedback.push({type:'class',action:mode,id:u.id,text:k.ko});
 if(mode==='flameBurst'){const p=tileOf8(target),cells=cross(s,p);s.feedback.push({type:'class',action:mode,id:u.id,text:k.ko,cells});for(const t of foesIn(s,u,cells))hitOn(t,{noCounter:true});for(const c of cells)igniteCell(s,c);s.log.push(`${u.name}: 화염진.`);return out;}
 if(mode==='whirlwind'){for(const e of s.units.filter(e=>alive(e)&&hostile(s,u,e)&&distance(u,e)===1))hitOn(e,{noCounter:true});s.log.push(`${u.name}: 회전 베기.`);return out;}
 if(mode==='rallyCry'){for(const a of s.units.filter(a=>a.team==='ally'&&alive(a)&&distance(a,u)<=2)){a.rally=s.turn+1;s.feedback.push({type:'guard',id:a.id,text:'MOV +1'});}s.log.push(`${u.name}: 기병의 함성. 곁의 아군 MOV +1 · 명중 +10.`);return out;}
 if(mode==='pilgrimLantern'){for(const a of s.units.filter(a=>a.team==='ally'&&alive(a)&&distance(a,u)<=1)){cure(s,a);a.immuneUntil=s.turn;}s.log.push(`${u.name}: 순례자의 등불. 곁의 아군 상태이상 해제.`);return out;}
 const t=unitOf(s,target);
 if(mode==='purify'){cure(s,t);const n=Math.min(8,t.maxHP-t.hp);t.hp+=n;if(n)s.feedback.push({type:'heal',id:t.id,text:`+${n}`,toHP:t.hp});t.immuneUntil=s.turn;s.log.push(`${u.name}: 정화 → ${t.name}.`);return out;}
 if(mode==='provoke'){const lands=(t.id==='boss'||t.kind==='captain'||t.kind==='lion'||t.leader)?rollChance(s,50):true;u.provokeGuard=s.turn;if(lands){t.provokedBy={id:u.id,turn:s.turn};s.feedback.push({type:'status',id:t.id,status:'provoke',text:'도발'});s.log.push(`${u.name}: 도발 → ${t.name}은(는) 다음 적 턴에 ${u.name}만 노립니다.`);}else{s.feedback.push({type:'miss',id:t.id,text:'도발 저항'});s.log.push(`${t.name}이(가) 도발에 넘어가지 않았습니다.`);}return out;}
 const blocked=mode==='breakthrough'&&!pushSpot(s,u,t);
 const r=hitOn(t,{bonus:blocked?3:0,noCounter:!!STRIKE[mode]?.noCounter});
 if(r.hit&&alive(r.victim)){const v=r.victim;
  if(mode==='pinningShot')inflict(s,v,'bind',100);
  else if(mode==='venomEdge')inflict(s,v,'poison',100);
  else if(mode==='feint'){v.atkDown={n:4,until:s.turn};s.feedback.push({type:'status',id:v.id,status:'debuff',text:'ATK −4'});}
  else if(mode==='flameBrand'){v.defDown={n:3,until:s.turn+1};s.feedback.push({type:'status',id:v.id,status:'debuff',text:'DEF −3'});}
  else if(mode==='breakthrough'&&!blocked){const p=pushSpot(s,u,v);if(p){const from={x:v.x,y:v.y};v.x=p.x;v.y=p.y;s.feedback.push({type:'move',id:v.id,path:[from,p]});s.log.push(`${u.name}: 돌파 · ${v.name}을(를) 밀어냈습니다.`);}}}
 if(!STRIKE[mode]?.noCounter)out.counter=t;return out;
}
const rollChance=(s,c)=>roll(s)*100<c;
function igniteCell(s,c){const t=terrainAt(c.x,c.y,s);if(!t||(t.fire??1)<1.25)return;s.burning??={};const k=key(c.x,c.y);if(!s.burning[k]){s.burning[k]=2;s.feedback.push({type:'ignite',at:{x:c.x,y:c.y},text:'FIRE'});}}

// Enemy weapons that leave a status on a hit (ACT II; numbers PROPOSED).
export function enemyStatusOnHit(u){if(u?.team!=='enemy')return null;const look=u.look||u.kind;
 if(u.kind==='assassin')return ['poison',40];if(look==='ashRaider')return ['poison',30];if(look==='monasteryGuard')return ['bind',25];if(look==='abbot')return ['silence',50];if(look==='maskedRaider')return ['confuse',25];return null;}
// Turn rollover (start of the next Player Phase): one-turn marks expire.
export function expireTactics(s){for(const u of s.units){
  if(u.provokedBy&&u.provokedBy.turn<s.turn)delete u.provokedBy;if(u.provokeGuard!=null&&u.provokeGuard<s.turn)delete u.provokeGuard;
  if(u.rally!=null&&u.rally<s.turn)delete u.rally;if(u.drum!=null&&u.drum<s.turn)delete u.drum;if(u.immuneUntil!=null&&u.immuneUntil<s.turn)delete u.immuneUntil;
  if(u.atkDown&&u.atkDown.until<s.turn)delete u.atkDown;if(u.defDown&&u.defDown.until<s.turn)delete u.defDown;}
 if(s.smoke){s.smoke=s.smoke.filter(c=>c.until>=s.turn);if(!s.smoke.length)delete s.smoke;}}
// A legion unit standing in smoke is harder to hit (enemy phase of the turn it was thrown).
export const inSmoke=(s,t)=>!!s.smoke?.some(c=>c.x===t.x&&c.y===t.y&&c.until>=s.turn);
// Enemy movement: the first caltrop on the path stops the enemy there (6 damage). Returns the stop index.
export function caltropStop(s,u,path){if(!s.traps?.length||!path||path.length<2)return path?path.length-1:0;for(let i=1;i<path.length;i++){const p=path[i],trap=s.traps.findIndex(t=>t.x===p.x&&t.y===p.y);if(trap>=0){s.traps.splice(trap,1);if(!s.traps.length)delete s.traps;return i;}}return path.length-1;}
