import {effectiveStats} from './economy.js';
import {MAP,TERRAIN,WIDTH,HEIGHT,BALANCE,HEROES,CLASS_MOVEMENT,HERO_CLASS,TERRAIN_COSTS,STOP_TERRAIN,heroDef} from '../data/game-data.js';
import {missionOf} from '../data/missions.js';
import {remember} from './narrative.js';
import {proficiencyBonus,classGrowth} from './progression.js';
import {fx} from './arms.js';
import {inSmallWard} from './wards.js';
import {commandShield} from './command.js';
import {skillOf,classKeyOf,matchup8,ratioDamage,levelUpStats,isBossRank} from './stats8.js';
import {SKILL_MUL} from '../data/classes8.js';
export const distance=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
export const key=(x,y)=>`${x},${y}`;
// benched: a hero left out of the sortie (pre-battle choice) takes no part in the battle
export const alive=u=>u.hp>0&&!u.rescued&&!u.benched;
export const terrainAt=(x,y,s)=>TERRAIN[(s?missionOf(s).map:MAP)[y]?.[x]];
export const findUnit=(s,id)=>s.units.find(u=>u.id===id);
export const at=(s,x,y)=>s.units.find(u=>alive(u)&&u.x===x&&u.y===y);
// v0.6 sides (Phase C): the player's heroes ('ally') and AI-led allied troops ('allied') share the legion side;
// enemies may belong to rival factions that fight each other (M10). With ACT I teams this is exactly 'teams differ'.
export const sideOf=u=>u.team==='ally'||u.team==='allied'?'legion':u.team;
export function hostile(s,a,b){if(!a||!b||a.team==='civilian'||b.team==='civilian'||a.team==='object'||b.team==='object')return false;if(a.neutral&&sideOf(b)==='legion'||b.neutral&&sideOf(a)==='legion')return false; /* v0.10.1 M25: a neutral banner fights only the hardliners */const sa=sideOf(a),sb=sideOf(b);if(sa!==sb)return true;return sa==='enemy'&&!!a.faction&&!!b.faction&&a.faction!==b.faction&&!s?.truce;}
export function nextRandom(state){const next=(Math.imul(state>>>0,1664525)+1013904223)>>>0;return {state:next,value:next/4294967296};}
export function roll(s){const r=nextRandom(s.rng);s.rng=r.state;return r.value;}
export function terrainCost(s,u,x,y){const type=missionOf(s).map[y]?.[x];if(!type||missionOf(s).layers.collision[y]?.[x]||!Number.isFinite(TERRAIN[type]?.cost))return Infinity;const profile=u.movementProfile||CLASS_MOVEMENT[HERO_CLASS[u.id]]?.profile||'infantry';if(type==='n'&&u.id==='gunnar')return 1; /* v2.3.1: 군나르's 「눈보라 돌격」 — snow costs him 1 */if(type==='s'&&u.id==='maren')return 1; /* v2.4.1: 마렌's 「이끼 걸음」 — a rogue already walks forests at 1; swamp costs her 1 too */return TERRAIN_COSTS[profile]?.[type]??TERRAIN[type].cost;}
// v2.6.0 (D-152, the user's request 2026-11-22 17:17): fire by the ground — the water's edge (swamp, bridge, ice bridge, or a tile
// touching deep water) damps fire to ×0.5 and wins over forest; elsewhere the terrain's own fire value (forest ×1.5)
const WET260=new Set(['s','b','i']);
export function waterEdge(s,x,y){const m=missionOf(s).map;if(WET260.has(m[y]?.[x]))return true;return [[0,-1],[-1,0],[1,0],[0,1]].some(([dx,dy])=>m[y+dy]?.[x+dx]==='w');}
// v2.6.1 (the user's request 2026-11-22 22:33): fire stays only in a forest — always there (not in the rain, not at the water's
// edge), never on open ground. Whoever stands in it at the start of their side's turn takes 20% of the hit that lit it (FIRE_HEAT).
export const FIRE_HEAT=.2;
export function catchesFire(s,x,y){return missionOf(s).map[y]?.[x]==='f'&&fireMul(s,x,y)>=1.25&&weatherOf(s)!=='rain';}
export function lightSpellFire(s,x,y,hit){if(!catchesFire(s,x,y))return false;s.burning??={};s.burnHeat??={};const k=key(x,y),fresh=!s.burning[k];s.burning[k]=2;s.burnHeat[k]=Math.max(s.burnHeat[k]||0,Math.max(1,Math.round((hit||0)*FIRE_HEAT)));return fresh;}
// the forecast's fire note: 「🔥 숲 +50%」, 「🔥 물가 −50%」 (empty when fire is not involved or the ground is neutral)
export function fireNote(s,f,t){if(!f?.magic||!t||f.terrainMul===1||f.terrainMul==null)return '';const pct=Math.round(Math.abs(f.terrainMul-1)*100);return `🔥 ${f.waterEdge?'물가':terrainAt(t.x,t.y,s)?.ko||''} ${f.terrainMul>1?'+':'−'}${pct}%`;}
export function fireMul(s,x,y){const t=terrainAt(x,y,s),f=t?.fire??1;return waterEdge(s,x,y)?Math.min(f,.5):f;}
export const moveProfile=u=>u.movementProfile||CLASS_MOVEMENT[HERO_CLASS[u.id]]?.profile||'infantry';
// v2.6.0 (D-152): a tile that ends the move on entering (forest for foot soldiers)
export function stopsAt(s,u,x,y){const type=missionOf(s).map[y]?.[x];return !!type&&!!STOP_TERRAIN[moveProfile(u)]?.has(type);}
// a tile's price for long paths (AI pursuit): a stopping tile costs a whole turn
export function pathCost(s,u,x,y){const c=terrainCost(s,u,x,y);return Number.isFinite(c)&&stopsAt(s,u,x,y)?Math.max(c,u.mov||4):c;}
export function movement(s,u,ignore=false){
 const start=key(u.x,u.y), costs=new Map([[start,0]]),prev=new Map(),queue=[{x:u.x,y:u.y,c:0}];
 const allowance=u.status?.bind?0:u.moveLeft!=null&&u.strikeMove===s.turn?u.moveLeft:effectiveStats(s,u).mov+(u.shadowBonus||0),zoc=u.team==='enemy'?bulwarkZone(s):null,held=blockadeHolds(s,u),hold=controlZone(s,u); // v0.8 bind: cannot move
 while(queue.length){queue.sort((a,b)=>a.c-b.c);const p=queue.shift();if(p.c!==costs.get(key(p.x,p.y)))continue;
  if(zoc&&zoc.has(key(p.x,p.y)))continue; // v0.5 Bulwark: an enemy in Erik's zone cannot move on (entering stops it, starting there pins it)
  if(hold&&p.c>0&&hold.has(key(p.x,p.y)))continue; // v0.9.3 zone of control: stepping beside a foe ends the move
  for(const [dx,dy] of [[0,-1],[-1,0],[1,0],[0,1]]){const x=p.x+dx,y=p.y+dy,t=terrainAt(x,y,s);if(!t||!Number.isFinite(t.cost))continue;
   const occupant=at(s,x,y);if(!ignore&&occupant&&occupant.id!==u.id&&sideOf(occupant)!==sideOf(u))continue;
   if(held&&!s.blockade.cells.some(([bx,by])=>bx===x&&by===y))continue;
   if(u.team==='enemy'&&inSmallWard(s,{x,y}))continue; // v0.9.2 Little Ward: enemies cannot step in
   const step=terrainCost(s,u,x,y),k=key(x,y),c=Number.isFinite(step)&&p.c<allowance&&stopsAt(s,u,x,y)?allowance:p.c+step; // v2.6.0: entering a forest on foot takes the rest of the move
   if(c<=allowance&&c<(costs.get(k)??Infinity)){costs.set(k,c);prev.set(k,key(p.x,p.y));queue.push({x,y,c});}
  }
 }
 if(!ignore)for(const p of [...costs.keys()]){const [x,y]=p.split(',').map(Number),occupant=at(s,x,y);if(occupant&&occupant.id!==u.id)costs.delete(p);}
 return {costs,prev};
}
// v0.9.3 zone of control (D-093, the user's 조조전 feedback): the tiles beside a living foe that can fight. A unit that steps onto
// one stops there (it may still leave a tile it started the turn on). Rogue movement (Kai, the grey cloaks, the assassins)
// slips through, and civilians on the move are not held (they are escorted, not fighting). Props, objects, civilians, benched or withdrawing units, and units without a way to fight hold no ground.
export const ZOC_FREE=new Set(['rogue']);
const holdsGround=t=>alive(t)&&!t.benched&&!t.withdrawing&&!t.prop&&!t.clerk&&(t.team==='ally'||t.team==='allied'||t.team==='enemy')&&Array.isArray(t.range)&&t.range[1]>0&&(t.atk||0)>0;
export const supportable=t=>!!t&&alive(t)&&!t.benched&&t.team!=='object'&&!t.prop&&!['wagon','beacon','brazier','cabinet','ritualCircle','wardStone','statue','wardTree','ram','rite','anchorStone'].includes(t.kind); /* v0.10.2 M27: the battering ram is timber, not a patient; v1.0.0 M29–M30: nor the rite points and the heart stone */
export function controlZone(s,u){if(u.team==='civilian'||u.team==='object'||ZOC_FREE.has(u.movementProfile||CLASS_MOVEMENT[HERO_CLASS[u.id]]?.profile))return null;const side=sideOf(u),z=new Set();
 for(const t of s.units)if(t.id!==u.id&&sideOf(t)!==side&&holdsGround(t)&&(side==='legion'?t.team==='enemy':t.team==='ally'||t.team==='allied'))for(const [dx,dy] of [[0,-1],[-1,0],[1,0],[0,1]])z.add(key(t.x+dx,t.y+dy));return z.size?z:null;}
// v0.5 Bulwark zone: tiles next to a living ally whose Bulwark is up (null when none, so ACT I paths are untouched).
export function bulwarkZone(s){const keepers=s.units.filter(a=>a.team==='ally'&&a.bulwark&&alive(a));if(!keepers.length)return null;const z=new Set();for(const a of keepers)for(const [dx,dy]of[[0,-1],[-1,0],[1,0],[0,1]])z.add(key(a.x+dx,a.y+dy));return z;}
export const counterBlocked=(s,v)=>v.noCounter===s.turn&&s.phase==='player';
export function pathTo(s,u,x,y){const {costs,prev}=movement(s,u);let k=key(x,y);if(!costs.has(k))return null;const path=[];while(k){const [px,py]=k.split(',').map(Number);path.unshift({x:px,y:py});k=prev.get(k);}return path;}
export function skillCost(u){const h=heroDef(u.id);return (h?.cost||0)+(skillOf(u)==='fireBolt'&&u.hp<=u.maxHP/2&&(u.classTier||1)<2?1:0);}
export function rangeFor(u,mode='attack',s=null){const t2=(u.classTier||1)>=2,sk=mode==='skill'?skillOf(u):null;if(t2&&sk==='heal')return [0,3];if(t2&&s&&sk==='aimed'&&['f','v'].includes(missionOf(s).map[u.y]?.[u.x]))return [2,4];const base=sk==='fireBolt'?[1,3]:sk==='heal'?[0,2]:sk==='guard'?[0,0]:u.range;
 // v0.6 rooftop high ground: a bow (range 2+) standing on a roof reaches one tile further. No roofs in ACT I.
 const roof=s&&base[1]>=2&&mode!=='skill'&&TERRAIN[missionOf(s).map[u.y]?.[u.x]]?.high?1:0;
 // v0.8.1 Hawk Feather (treasure): a bow reaches one tile further.
 const hawk=s&&base[1]>=2&&(mode==='attack'||sk==='aimed')?fx(s,u,'hawk'):0;
 // v0.9 fog (M16): bows and spells reach one tile less, unless the archer stands where the fog was cleared or carries the Mist Lantern.
 const fog=s&&base[1]>=2&&foggedFor(s,u)?1:0;
 return roof||hawk||fog?[base[0],Math.max(base[0],base[1]+roof+hawk-fog)]:base;}
export function validTarget(s,u,t,mode='attack'){
 if(!u||!t||!alive(u)||!alive(t))return false;
 const d=distance(u,t);if(t.team==='object')return mode==='search'&&u.team==='ally'&&d===1&&!t.locked&&!t.inert&&!(t.kind==='ritualCircle'&&s.units.some(r=>r.kind==='ritualist'&&r.team==='enemy'&&alive(r)&&distance(r,t)<=1)); /* v0.9.2 M19: a ritualist beside its circle keeps the seal shut */if(mode==='search')return false;if(mode==='capture')return (s.missionId===2&&t.id==='boss'||[].concat(missionOf(s).capture||[]).includes(t.id))&&t.team==='enemy'&&t.hp<=t.maxHP/2&&d===1;
 // v0.7.1 (D-071): Erik persuades Baldrick from beside him (once a turn); Thea may speak to him once in the battle.
 if(mode==='persuade')return canPersuade(s,u,t)&&d===1;
 // v2.0.0 일기토 신청 (Q9): a named enemy beside the hero, twice a battle, not in trials or drills.
 if(mode==='rescue')return t.team==='civilian'&&t.kind!=='wagon'&&!t.noRescue&&!missionOf(s).escortOnly&&(!missionOf(s).orderTurn||s.campaign?.choices?.m08_order==='rescue')&&d===1;
 if(mode==='skill'&&skillOf(u)==='guard')return t.id===u.id;
 // v0.9.3 (D-093, the user's feedback): Heal reaches anyone in range — heroes, allied units, civilians, even enemies; not wagons, props or objects.
 if(mode==='skill'&&skillOf(u)==='heal')return supportable(t)&&d>=rangeFor(u,mode,s)[0]&&d<=rangeFor(u,mode,s)[1];
 const [min,max]=rangeFor(u,mode,s);return hostile(s,u,t)&&d>=min&&d<=max;
}
export function flank(s,u,t){return s.units.some(a=>a.team===u.team&&alive(a)&&a.id!==u.id&&distance(a,t)===1&&((u.x<t.x&&a.x>t.x)||(u.x>t.x&&a.x<t.x)||(u.y<t.y&&a.y>t.y)||(u.y>t.y&&a.y<t.y)));}
export function strikeStats(s,u,t,mode='attack'){
 u=effectiveStats(s,u);t=effectiveStats(s,t);
 // v2.0.0 (D-115, IMPLEMENTATION_PLAN): damage = P·P/(P+D) × skill × matchup × terrain; the ① skills are multipliers by skill, not by hero.
 const sk=mode==='skill'?skillOf(u):null,magic=sk==='fireBolt'||mode==='flameBurst',aim=sk==='aimed',quick=sk==='quick';
 const ground=terrainAt(t.x,t.y,s),defense=(magic?t.res:t.def)+(ground.defense||0),burning=!!s.burning?.[key(t.x,t.y)];
 let mul=1;if(aim)mul*=SKILL_MUL.aimed;if(magic&&u.hp<=u.maxHP/2)mul*=SKILL_MUL.lowHPFire;if(quick&&flank(s,u,t))mul*=SKILL_MUL.quickFlank;
 if(sk==='charge')mul*=(u.chargeRun||0)>=3?SKILL_MUL.chargeRun:SKILL_MUL.charge;if(sk==='riposte')mul*=SKILL_MUL.riposte;if(sk==='lion')mul*=SKILL_MUL.lion;if(sk==='brace')mul*=SKILL_MUL.brace;
 let raw=Math.max(1,ratioDamage(magic?u.mag:u.atk,defense)*mul+(sk==='charge'?(u.chargeDmg||0):0));
 const fireM=magic?fireMul(s,t.x,t.y):1;let dmg=Math.max(1,Math.round(magic?raw*fireM:raw*(1-(ground.phys||0))));
 if(magic&&weatherOf(s)==='rain')dmg=Math.max(1,Math.round(dmg*.5));if(magic&&inWard(s,t))dmg=0;
 const arms=matchup(u,t);if(arms!==1&&dmg>0)dmg=Math.max(1,Math.round(dmg*arms));
 {const sh=commandShield(s,t);if(sh!==1)dmg=Math.max(1,Math.round(dmg*sh));} // v0.9.2 「한 사람도 두고 가지 않는다」
 if(t.id==='eric'&&t.hp<=t.maxHP*.3)dmg=Math.max(1,Math.floor(dmg*.85));
 // M05 lion formation: living bearers give adjacent allies of theirs a guard (×0.85) and accuracy; Baldrick's charge punishes isolated targets unless Erik guards (×1.3).
 const form=missionOf(s).formation;let formHit=0;
 if(form){const near=v=>v.team==='enemy'&&!form.bearers.includes(v.id)&&s.units.some(b=>form.bearers.includes(b.id)&&alive(b)&&distance(b,v)===1);
  if(near(t))dmg=Math.max(1,Math.round(dmg*.85));
  if(near(u))formHit=form.hit;
  if(u.id==='boss'&&isolated(s,t)&&!(t.guarding&&!t.guardUsed))dmg=Math.round(dmg*1.3);}
 // v0.7 (D-068): a quiet monastery guard struck from outside its watch is caught unaware (×1.3, +30 hit); the Sanctuary skill guards those beside its holder.
 const sneak=surprised(s,u,t);if(sneak)dmg=Math.round(dmg*1.3);
 const cut=sanctuaryCut(s,t);if(cut)dmg=Math.max(1,Math.round(dmg*(cut>=4?.7:cut>=2?.85:.92)));
 // v0.8.1 gear: the Iron Tower Shield cuts blows from 2+ tiles; the Mirror Cuirass halves them.
 const far=distance(u,t)>=2;if(far&&t.rangedCut)dmg=Math.max(1,Math.round(dmg*(1-.08*t.rangedCut)));if(far&&t.mirror)dmg=Math.max(1,Math.round(dmg/2));
 // v2.0.0 §3.5: a Wardkeeper's ward wall halves blows from 2+ tiles on itself and those beside it; a Gatewarden's phalanx turns riders (×0.8).
 if(far&&s.units?.some(w=>w.wardWall===s.turn&&alive(w)&&sideOf(w)===sideOf(t)&&distance(w,t)<=1))dmg=Math.max(1,Math.round(dmg/2));
 if(classKeyOf(u)==='cavalry'&&s.units?.some(w=>w.phalanx===s.turn&&alive(w)&&sideOf(w)===sideOf(t)&&distance(w,t)<=1))dmg=Math.max(1,Math.round(dmg*.8));
 const standing=missionOf(s).map[u.y][u.x];const hawk=u.id==='elina'&&(standing==='f'||standing==='v')?12:0;
 let hit=Math.max(70,Math.min(100,(magic?100:97)+Math.round((u.spd-t.spd)*1.5)-(ground.evade||0)+hawk+(aim?18:0)+(u.hit||0)+(proficiencyBonus(s,u).hit||0)+formHit-(t.dodge||0)));
 // v0.7 night (M11): a legion attacker standing in light aims better; any target outside the light is harder to hit.
 if(missionOf(s).night)hit=Math.max(40,Math.min(100,hit+(sideOf(u)==='legion'&&litAt(s,u.x,u.y)?10:0)-(litAt(s,t.x,t.y)?0:15)));
 if(sneak)hit=Math.min(100,hit+30);
 // v0.8 smoke: a legion unit inside the smoke is harder to hit until the end of that enemy phase.
 if(sideOf(t)==='legion'&&s.smoke?.some(c=>c.x===t.x&&c.y===t.y&&c.until>=s.turn))hit=Math.max(10,hit-30);
 // v0.9.2 M20 grey cloaks hide in the shadows: the first blow against one always misses (game.damage clears it).
 if(t.shade)hit=0;
 // v2.0.0: critical from 운 (luck); the target's luck turns some away. Gear crit (Lucky Coin etc.) adds.
 const crit=magic?0:Math.min(30,Math.max(2,3+(u.critBase??Math.floor((u.stats?.luk||6)/2))-Math.floor((t.stats?.luk||0)/5)))+(u.crit||0);
 return {damage:dmg,hit,crit,magic,fire:magic,terrainMul:magic?fireM:1-(ground.phys||0),waterEdge:magic&&waterEdge(s,t.x,t.y),flank:quick&&flank(s,u,t),burning,sneak,sanctuary:cut,arms};
}
// v2.0.0 the matchup triangle (REFORM_DESIGN §3.3, D-115): ±25% by class; specials stand outside it.
export const armOf=u=>classKeyOf(u);
export function matchup(u,t){return matchup8(u,t);}
// ---------- v0.9 ACT III weather (D-079, ACT3_DESIGN §7; numbers PROPOSED). M01–M14 have no weather. ----------
// Fog: bows and spells reach one tile less; an enemy more than three tiles from every deployed hero is hidden (its numbers
// are not shown). Tiles near a ward stone searched in M16 are clear (missionState.clear: [x, y, radius]).
export const weatherOf=s=>missionOf(s)?.weather||null;
export const fogClear=(s,x,y)=>(s?.missionState?.clear||[]).some(([cx,cy,r])=>Math.abs(cx-x)+Math.abs(cy-y)<=r);
export const foggedFor=(s,u)=>weatherOf(s)==='fog'&&!fogClear(s,u.x,u.y)&&!fx(s,u,'mist');
export const fogHidden=(s,u)=>weatherOf(s)==='fog'&&u?.team==='enemy'&&!fogClear(s,u.x,u.y)&&!s.units.some(h=>h.team==='ally'&&!h.benched&&alive(h)&&distance(h,u)<=3);
// v0.9.1 rain (M18): fire (Lia's spells, Flame Burst) deals half damage and nothing catches fire. The ward of the
// unburning forest (mission.ward: [x0, y0, x1, y1]) makes fire harmless to those inside and heals them 50% more.
export const inWard=(s,p)=>{const w=missionOf(s)?.ward;return !!w&&!!p&&p.x>=w[0]&&p.x<=w[2]&&p.y>=w[1]&&p.y<=w[3];};
// v0.9.1 Elina's Blockade (④): during that enemy phase an enemy that starts inside the cross cannot leave it.
export const blockadeHolds=(s,u)=>u?.team==='enemy'&&s.blockade?.turn===s.turn&&s.phase==='enemy'&&s.blockade.cells.some(([x,y])=>x===u.x&&y===u.y);
export const ARM_KO={cavalry:'기병',infantry:'보병',archer:'궁병',spear:'창병',mage:'마도사',healer:'치유사',rogue:'도적',shield:'방패병'};
// ---------- v0.7 ACT II part 2 (D-068; rules and numbers PROPOSED). ACT I and M07–M10 never meet these. ----------
// Night (M11): lit braziers and the sanctuary tiles each light the tiles within `night.radius` (Manhattan).
export function lightSources(s){const m=missionOf(s);if(!m?.night)return null;const r=m.night.radius,out=(m.night.fixed||[]).map(([x,y])=>({x,y,r}));
 for(const u of s.units||[])if(u.kind==='brazier'&&u.lit)out.push({x:u.x,y:u.y,r});return out;}
export function litAt(s,x,y){const src=lightSources(s);return !src||src.some(p=>Math.abs(p.x-x)+Math.abs(p.y-y)<=p.r);}
// Stealth (M12): a quiet guard watches the two tiles ahead (three once the monastery is suspicious) and the two tiles
// diagonally ahead; walls block the view. Awake guards (after the alarm) have no watch, they fight.
export const FACING={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
export function watchCells(s,g){const out=new Set();if(!g?.watch||!alive(g)||g.awake)return out;
 const [dx,dy]=FACING[g.facing]||FACING.down,reach=(s.missionState?.alert||0)>=1?3:2,open=(x,y)=>Number.isFinite(terrainAt(x,y,s)?.cost);
 for(let i=1;i<=reach;i++){const x=g.x+dx*i,y=g.y+dy*i;if(!open(x,y))break;out.add(key(x,y));}
 if(open(g.x+dx,g.y+dy))for(const [sx,sy] of dx?[[0,1],[0,-1]]:[[1,0],[-1,0]]){const x=g.x+dx+sx,y=g.y+dy+sy;if(open(x,y))out.add(key(x,y));}
 return out;}
export function watchedTiles(s){const out=new Set();if(!missionOf(s)?.stealth)return out;for(const g of s.units||[])for(const k of watchCells(s,g))out.add(k);return out;}
export const surprised=(s,u,t)=>!!missionOf(s)?.stealth&&!!t?.watch&&!t.awake&&sideOf(u)==='legion'&&!watchCells(s,t).has(key(u.x,u.y));
export function canPersuade(s,u,t){const p=missionOf(s)?.persuade,st=s?.missionState;if(!p||!u||!t||t.id!==p.target||u.team!=='ally'||!alive(t)||!st||st.halted)return false;
 if(u.id==='eric')return st.persuadedTurn!==s.turn;if(u.id==='thea')return !st.thea;return false;}
// Ines (Sanctuary): legion units beside her take 2 less damage (4 after her oath this turn, which also covers her).
export function sanctuaryCut(s,t){if(!t||sideOf(t)!=='legion')return 0;let cut=skillOf(t)==='sanctuary'&&t.sanctuary?2:0;
 for(const a of s.units||[])if((skillOf(a)==='sanctuary'||a.sanctuaryAura)&&a.id!==t.id&&alive(a)&&sideOf(a)==='legion'&&distance(a,t)===1)cut=Math.max(cut,a.sanctuary?4:2);
 // v0.9.1 Sanctum Warden (Ines, tier 2): her sanctuary also reaches two tiles, for 1.
 for(const a of s.units||[])if(skillOf(a)==='sanctuary'&&(a.classTier||1)>=2&&a.id!==t.id&&alive(a)&&sideOf(a)==='legion'&&distance(a,t)===2)cut=Math.max(cut,1);
 return cut;}
// v0.6 Thea's Charge (PROPOSED): +4 damage; after running 3+ tiles this turn, +3 more and the target cannot strike back.
export const charge=u=>4+((u.chargeRun||0)>=3?3:0);
export const chargeBreaks=(u,mode)=>mode==='skill'&&(skillOf(u)==='charge'&&(u.chargeRun||0)>=3||skillOf(u)==='lion'); /* v0.10.1 Lion Strike: no counter */
// v0.6.1 Dario (PROPOSED): his counterattacks deal +4; after Riposte (skill: +2 damage) +8 until the next player phase.
// v2.0.0: counters as multipliers — the Riposte holder ×1.25 (×1.5 after Riposte), a braced spear ×1.5.
export const riposteBonus=u=>skillOf(u)==='riposte'?(u.riposte?1.5:1.25):u?.brace?1.5:1;
// v2.2.1 play-test (D-126): heals restore half of what they did (「기본 힐 양이 너무 많이 차. 반정도로 줄여줘」), at least 1.
export const HEAL_SCALE=.5;
export const healAmount=(s,v)=>Math.max(1,Math.round(HEAL_SCALE*((v.healPow??(12+(v.mag||0)))+(v.heal||0)+(proficiencyBonus(s,v).heal||0))));
export const isolated=(s,t)=>t.team==='ally'&&!s.units.some(a=>a.team==='ally'&&alive(a)&&a.id!==t.id&&distance(a,t)===1);
// Tier-1 Guard covers melee only; the Guardian Knight (tier 2) also takes the first ranged or magic hit.
export function guardFor(s,u,t,mode){const melee=!(mode==='skill'&&skillOf(u)==='fireBolt')&&distance(u,t)===1;return s.units.find(g=>alive(g)&&g.team===t.team&&g.id!==t.id&&(g.guarding&&!g.guardUsed||g.guardTarget===t.id)&&distance(g,t)===1&&(melee||(g.classTier||1)>=2))||null;}
export function forecast(s,u,t,mode='attack'){
 if(mode==='skill'&&skillOf(u)==='heal'){const v=effectiveStats(s,u),amount=healAmount(s,v);return {heal:Math.min(t.maxHP-t.hp,amount),hit:100,damage:0,counter:0,after:Math.min(t.maxHP,t.hp+amount)};}
 if(mode==='skill'&&skillOf(u)==='guard')return {guard:true,damage:0,hit:100,counter:0,after:t.hp};
 if(mode==='capture')return {capture:true,damage:0,hit:100,counter:0,after:t.hp};
 if(mode==='rescue')return {rescue:true,damage:0,hit:100,counter:0,after:t.hp};
 if(mode==='search')return {search:true,damage:0,hit:100,counter:0,after:t.hp};
 if(mode==='persuade')return {persuade:true,damage:0,hit:100,counter:0,after:t.hp};
 const guard=guardFor(s,u,t,mode),victim=guard||t,stats=strikeStats(s,u,victim,mode),canCounter=validTarget(s,victim,u,'attack')&&!counterBlocked(s,victim)&&!chargeBreaks(u,mode)&&!fx(s,u,'silence')&&victim.hp>stats.damage;
 const counter=canCounter?Math.max(1,Math.round(strikeStats(s,victim,u).damage*riposteBonus(victim))):0;
 return {...stats,counter,counterHit:canCounter?strikeStats(s,victim,u).hit:0,after:Math.max(0,victim.hp-stats.damage),guard:guard?.id,victim:victim.id};
}
// Phase F (D-045): from M04 a mission carries a level. A hero more than two levels above it learns less
// (−20% per level, floor 20%); one more than two below learns faster (+20% per level, cap 160%). M01–M03 have
// no level and keep the v0.3.x flat EXP exactly.
// v2.6.0 (D-152, the user's request 2026-11-22 17:21): experience by the level gap to the enemy (enemy − hero).
// ≥ +5 ×2.0 · +1…+4 ×1.2–1.8 · 0…−2 ×1 · −3…−9 ×0.9–0.3 · ≤ −10 ×0.05. Hits, kills, counters and skill hits use the foe struck;
// heals, guards, rescues, objectives and the clear bonus use the battle's enemy average (battleFoeLevel).
export function gapScale(gap){gap=Math.round(gap);return gap>=5?2:gap>=1?1+.2*gap:gap>=-2?1:gap>=-9?Math.round((1+.1*(gap+2))*100)/100:.05;}
export function battleFoeLevel(s){const foes=(s?.units||[]).filter(u=>u.team==='enemy'&&!u.prop&&Number.isFinite(u.level));if(foes.length)return foes.reduce((a,u)=>a+u.level,0)/foes.length;return s?.levelPlan?.avg??missionOf(s)?.level??null;}
export function xpScale(s,u,foeLevel=null){const lv=foeLevel??battleFoeLevel(s);if(!Number.isFinite(lv))return 1;return gapScale(lv-u.level);}
export function awardXP(s,u,amount,reason,foeLevel=null){
 if(u.team!=='ally'||!amount)return;const scale=xpScale(s,u,foeLevel);amount=Math.max(1,Math.round(amount*scale*(1+fx(s,u,'sage')/100))); // v0.8.1 Sage Notebook
 u.xp+=amount;u.earnedXP+=amount;u.highlights.push(reason);const foe=foeLevel??battleFoeLevel(s),gap=Number.isFinite(foe)?Math.round(foe-u.level):0;s.feedback.push({type:'xp',id:u.id,text:`+${amount} EXP`,scale,gap}); // v2.6.1 (the user's request 2026-11-22 22:33): the gap is not shown — too much information
 let leveled=false;while(u.xp>=BALANCE.xpLevel){leveled=true;u.xp-=BALANCE.xpLevel;u.level++;let changes;if(u.stats){changes=levelUpStats(u)||{};const mp=(heroDef(u.id)?.growth?.mp||0)+(classGrowth(u).mp||0);if(mp){u.maxMP+=mp;u.mp=Math.min(u.maxMP,u.mp+mp);changes.mp=mp;}}else{const g={...heroDef(u.id).growth};for(const [k,v]of Object.entries(classGrowth(u)))g[k]=(g[k]||0)+v;changes={...g};for(const [stat,n] of Object.entries(g)){if(stat==='hp'){u.maxHP+=n;u.hp=Math.min(u.maxHP,u.hp+n);}else if(stat==='mp'){u.maxMP+=n;u.mp=Math.min(u.maxMP,u.mp+n);}else u[stat]+=n;}}if(u.id==='eric'&&u.level>=5)u.appearanceTier=2;u.growthHistory.push({level:u.level,changes});s.feedback.push({type:'level',id:u.id,text:`LEVEL ${u.level}`,toHP:u.hp});s.log.push(`${u.name} → LV ${u.level}. 성장이 새로운 힘으로 이어집니다.`);}
 if(leveled){u.hp=u.maxHP;u.mp=u.maxMP;s.log.push(`${u.name}: 레벨업으로 HP/MP 전부 회복.`);}
}
export function discover(s,u,clue){if(!u.clues.includes(clue)){u.clues.push(clue);s.feedback.push({type:'potential',id:u.id,text:'POTENTIAL DISCOVERED'});s.log.push(`Potential Clue Discovered — ${clue} (1/3). 각성은 아직 해금되지 않았습니다.`);}}
// One-line tactical summary of a tile, shown when the player taps terrain.
export function terrainSummary(s,x,y,u=null){const type=missionOf(s).map[y]?.[x],t=TERRAIN[type];if(!t)return '전장 밖';
 if(!Number.isFinite(t.cost))return `${t.ko} · 통행 불가`;
 const costs=['infantry','rogue','cavalry'].map(p=>STOP_TERRAIN[p]?.has(type)?'들어서면 멈춤':TERRAIN_COSTS[p]?.[type]??t.cost),cost=c=>typeof c==='string'||Number.isFinite(c)?c:'불가'; // v2.6.0: a forest stops foot soldiers
 const move=costs.every(c=>c===costs[0])?`이동 ${cost(costs[0])}`:`이동 보병 ${cost(costs[0])} · 도적 ${cost(costs[1])} · 기병 ${cost(costs[2])}`;
 const parts=[t.ko,move];if(t.phys)parts.push(`일반공격 ${Math.round(t.phys*100)}%↓`);if(t.evade)parts.push(`회피 ${Math.abs(t.evade)}%${t.evade>0?'↑':'↓'}`);
 {const f=fireMul(s,x,y);if(f!==1)parts.push(`${waterEdge(s,x,y)?'물가 · ':''}🔥 ${Math.round(Math.abs(f-1)*100)}%${f>1?'↑':'↓'}`);}if(t.hpRecovery)parts.push(`턴 시작 HP ${t.hpRecovery*100}% 회복`);
 if(s.burning?.[key(x,y)])parts.push('🔥 불타는 중');if(u&&u.team==='ally'){const c=terrainCost(s,u,x,y);parts.push(`${u.name}: ${!Number.isFinite(c)?'진입 불가':stopsAt(s,u,x,y)?'들어서면 이동 끝':`비용 ${c}`}`);}
 return parts.join(' · ');}
