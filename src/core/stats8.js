// v2.0.0 능력치 엔진 (D-114/D-115, REFORM_DESIGN §3.4, IMPLEMENTATION_PLAN): six stats → derived combat numbers,
// growth by class, promotion bonuses, enemy level by the sortie (§6.1) and the matchup triangle (§3.3).
// Derived numbers stay on the unit (maxHP, atk, mag, def, res, spd, mov) so every rule that reads them keeps working;
// permanent changes go into u.stats and are re-derived here.
import {CLASSES8,STAT_KEYS,TIER_STAT_BONUS,HERO_CLASS8,UNIT_CLASS8,OFFICER_CLASS8,HERO_STATS,HERO_GROWTH_BONUS,KIND_CLASS8,LOOK_CLASS8,MATCHUP8,MATCHUP_UP,MATCHUP_DOWN,CLASS_SKILL8,HERO_SKILL} from '../data/classes8.js';
export const OFFICER_IDS=Object.keys(OFFICER_CLASS8);
const HERO_IDS=Object.keys(HERO_CLASS8);
const round1=n=>Math.round(n*10)/10;
// The unit's class (key of CLASSES8) or null for specials.
export function classKeyOf(u){if(!u)return null;if(u.cls!==undefined)return u.cls;if(UNIT_CLASS8[u.id]&&(u.team==='ally'||!u.team))return UNIT_CLASS8[u.id];
 if(u.look&&Object.hasOwn(LOOK_CLASS8,u.look))return LOOK_CLASS8[u.look];return KIND_CLASS8[u.kind]||null;}
export const classDef=u=>CLASSES8[classKeyOf(u)]||null;
export const tierOf=u=>Math.max(1,Math.min(3,u?.classTier||1));
export const tierName=u=>{const c=classDef(u);return c?c.tiers[tierOf(u)-1].ko:null;};
export const classLabel=u=>{const c=classDef(u);return c?`${c.ko} · ${c.tiers[tierOf(u)-1].ko}`:'';};
// The ① skill: heroes keep their own; officers use their class's.
export function skillOf(u){if(!u||u.team!=='ally'&&u.team)return null;if(HERO_SKILL[u.id])return HERO_SKILL[u.id];if(OFFICER_IDS.includes(u.id))return CLASS_SKILL8[classKeyOf(u)]||null;return null;}
export const isOfficer=u=>OFFICER_IDS.includes(u?.id);
// Expected growth of one level for this unit (class growth, heroes a little more).
export function growthOf(u){const c=classDef(u)||CLASSES8.infantry,bonus=HERO_IDS.includes(u?.id)?1+HERO_GROWTH_BONUS:1;return Object.fromEntries(STAT_KEYS.map(k=>[k,(c.growth[k]||0)*bonus]));}
// Derived numbers from the stats (no equipment, no battle effects).
export function derivedFrom(cls,stats,level=1){const b=(CLASSES8[cls]||CLASSES8.infantry).base,s=stats;
 return {maxHP:Math.round(b.hp+2.5*s.con+b.hpLv*(Math.max(1,level)-1)),atk:Math.round(b.wpn+1.5*s.str),mag:Math.round(b.foc+1.5*s.int),def:Math.round(b.arm+.7*s.con),res:Math.round(b.ward+.8*s.wil),spd:Math.round(s.agi),healPow:Math.round(b.staff+1.5*s.wil),critBase:Math.floor(s.luk/2)};}
// Writes the derived numbers onto u (keeps the damage already taken).
export function deriveUnit(u){if(!u?.stats)return u;const cls=classKeyOf(u)||'infantry',d=derivedFrom(cls,u.stats,u.level||1),oldMax=u.maxHP;
 Object.assign(u,{atk:d.atk,mag:d.mag,def:d.def,res:d.res,spd:d.spd,healPow:d.healPow,critBase:d.critBase});
 u.maxHP=d.maxHP;if(u.hp==null||oldMax==null)u.hp=d.maxHP;else u.hp=Math.max(u.hp>0?1:0,Math.min(d.maxHP,u.hp+Math.max(0,d.maxHP-oldMax)));
 const base=CLASSES8[cls].base;u.mov=base.mov;if(!u.rangeFixed&&(u.team==='ally'||!u.team))u.range=[...base.range];if(!u.movementProfile||u.movementProfile==='infantry'||u.movementProfile==='cavalry'||u.movementProfile==='rogue')u.movementProfile=u.movementProfile==='ranger'?'ranger':base.profile;return u;}
// Stats of a hero or officer at a level and tier (Lv 1 table + expected growth + promotion bonuses).
export function statsAt(id,level=1,tier=1){const base=HERO_STATS[id];if(!base)return null;const g=growthOf({id}),out={};for(const k of STAT_KEYS)out[k]=round1(base[k]+g[k]*(Math.max(1,level)-1));
 for(let t=2;t<=tier;t++)addTierBonus({id,cls:UNIT_CLASS8[id],stats:out},t);return out;}
function addTierBonus(u,tier){const b=TIER_STAT_BONUS[tier],c=classDef(u);if(!b||!c)return;for(const k of STAT_KEYS)u.stats[k]=round1(u.stats[k]+(c.main.includes(k)?b.main:b.rest));}
// One level up: stats grow by the class's expected growth. Returns the change of the derived numbers.
export function levelUpStats(u){if(!u?.stats)return null;const before=derivedFrom(classKeyOf(u)||'infantry',u.stats,(u.level||2)-1),g=growthOf(u);for(const k of STAT_KEYS)u.stats[k]=round1(u.stats[k]+g[k]);
 const hpBefore=u.hp,maxBefore=u.maxHP;deriveUnit(u);const after=derivedFrom(classKeyOf(u)||'infantry',u.stats,u.level||1);u.hp=Math.min(u.maxHP,(hpBefore??u.maxHP)+(u.maxHP-(maxBefore??u.maxHP)));
 const ch={};for(const [k,v] of Object.entries({hp:after.maxHP-before.maxHP,atk:after.atk-before.atk,mag:after.mag-before.mag,def:after.def-before.def,res:after.res-before.res,spd:after.spd-before.spd}))if(v)ch[k]=v;return ch;}
// Promotion (§3.5): the class's main stats +2/+3, the rest +1.
export function promoteStats(u,tier){if(!u?.stats)return false;addTierBonus(u,tier);deriveUnit(u);return true;}
// Makes sure a hero/officer object has stats and a class (new games, joins, old saves). Idempotent.
export function ensureStats(u){if(!u||u.stats||!HERO_STATS[u.id])return u;u.cls=UNIT_CLASS8[u.id];u.stats=statsAt(u.id,u.level||1,tierOf(u));return deriveUnit(u);}
// ---------- enemies and allied troops (§6.1) ----------
// Per-level growth of the derived numbers for a class.
function derivedGrowth(cls){const c=CLASSES8[cls]||CLASSES8.infantry,g=c.growth;return {maxHP:2.5*g.con+c.base.hpLv,atk:1.5*g.str,mag:1.5*g.int,def:.7*g.con,res:.8*g.wil,spd:g.agi};}
// A reference trooper of the class at a level (main stats 8, the rest 5 at Lv 1, class growth after). Troops scale by the
// ratio of this reference between their authored level and the level they fight at, so a weak unit (a clerk, a lookout)
// stays as weak next to the line troops as it was authored, at any level.
function refAt(cls,L){const c=CLASSES8[cls]||CLASSES8.infantry,st={};for(const k of STAT_KEYS)st[k]=(c.main.includes(k)?8:5)+c.growth[k]*(Math.max(1,L)-1);return derivedFrom(CLASSES8[cls]?cls:'infantry',st,L);}
export const isBossRank=u=>!!u&&(u.id==='boss'||u.id==='boss2'||['captain','lion'].includes(u.kind)||!!u.leader||!!u.commander||!!u.boss);
export const DIFFICULTY={normal:{ko:'보통',levels:0,mul:1,potions:2,waves:1},hard:{ko:'어려움',levels:2,mul:1.15,potions:1,waves:1.25}};
export const difficultyOf=s=>DIFFICULTY[s?.campaign?.difficulty]?s.campaign.difficulty:'normal';
// The sortie's average level (deployed heroes and officers).
export function sortieAverage(s){const out=(s.units||[]).filter(u=>u.team==='ally'&&!u.benched&&u.hp>0);if(!out.length)return null;return out.reduce((a,u)=>a+(u.level||1),0)/out.length;}
const authoredLevel=(s,m)=>m?.level||Math.max(1,s?.missionId||1);
// The level an enemy fights at: sortie average + rank offset + mission offset + difficulty, never below the authored level − 2.
export function enemyLevel(s,u,m){const auth=u.base?.level??authoredLevel(s,m),avg=s.levelPlan?.avg??sortieAverage(s)??auth;
 const rank=u.team==='allied'?0:isBossRank(u)?3:u.elite?2:0,off=u.team==='allied'?0:(m?.levelOffset??0),pct=u.team==='allied'?0:(m?.levelPct??0),diff=u.team==='allied'?0:DIFFICULTY[difficultyOf(s)].levels;
 // the mission's offset is a share of the average (levelPct), so it weighs the same on a young legion and a seasoned one
 return Math.max(auth-2+diff,Math.round(avg*(1+pct))+rank+off+diff);}
// Snapshot the authored numbers once, then (re)scale from them. Idempotent: always computed from u.base.
export function scaleTroop(s,u,m){if(!u||!['enemy','allied'].includes(u.team)||u.noScale)return u;
 if(!u.base)u.base={level:u.level??authoredLevel(s,m),maxHP:u.maxHP??u.hp,atk:u.atk||0,mag:u.mag||0,def:u.def||0,res:u.res||0,spd:u.spd||0};
 const b=u.base,L=enemyLevel(s,u,m),dl=L-b.level,g=derivedGrowth(classKeyOf(u)),mul=u.team==='allied'?1:DIFFICULTY[difficultyOf(s)].mul,r0=refAt(classKeyOf(u),b.level),r1=refAt(classKeyOf(u),L),f=(v,k)=>v>0?Math.max(1,Math.round(v*(r1[k]/Math.max(1,r0[k]))*mul)):v;
 const lost=(u.maxHP??b.maxHP)-(u.hp??b.maxHP);u.level=L;u.maxHP=f(b.maxHP,'maxHP');u.hp=Math.max(1,u.maxHP-Math.max(0,lost));u.atk=f(b.atk,'atk');u.mag=f(b.mag,'mag');u.def=f(b.def,'def');u.res=f(b.res,'res');u.spd=Math.max(1,Math.round(b.spd+g.spd*dl));
 // stats for curses, luck and duels, read back from the derived numbers
 const c=CLASSES8[classKeyOf(u)]||CLASSES8.infantry;u.stats={str:round1(Math.max(1,(u.atk-c.base.wpn)/1.5)),int:round1(Math.max(1,(u.mag-c.base.foc)/1.5)),wil:round1(Math.max(1,(u.res-c.base.ward)/.8)),con:round1(Math.max(1,(u.def-c.base.arm)/.7)),agi:u.spd,luk:round1(3+.4*L)};
 u.critBase=Math.floor(u.stats.luk/2);
 // the basic attack's tier (§3.5): the level's tier, but never above the sortie's own (bosses and their kind one above),
 // so a legion that has not promoted yet does not meet double strikes it cannot answer
 const lvTier=L>=16?3:L>=8?2:1,cap=Math.min(3,(s.levelPlan?.tier||3)+(isBossRank(u)||u.elite?1:0));u.troopTier=Math.min(lvTier,cap);return u;}
// Called when the sortie is fixed (startBattle) and when units arrive later: every troop at the planned level.
export function planLevels(s,m){const avg=sortieAverage(s),out=(s.units||[]).filter(u=>u.team==='ally'&&!u.benched&&u.hp>0);s.levelPlan={avg:avg??authoredLevel(s,m),difficulty:difficultyOf(s),tier:out.length?Math.round(out.reduce((a,u)=>a+tierOf(u),0)/out.length):1};for(const u of s.units||[])if(u.team==='enemy'||u.team==='allied')scaleTroop(s,u,m);return s.levelPlan;}
// ---------- matchups (§3.3) ----------
export function matchup8(u,t){const a=classKeyOf(u),b=classKeyOf(t);if(!a||!b)return 1;const m=MATCHUP8[a];if(!m)return 1;return m.up.includes(b)?MATCHUP_UP:m.down.includes(b)?MATCHUP_DOWN:1;}
// The ratio formula (§3.4, IMPLEMENTATION_PLAN): P·P/(P+D). Doubling both doubles the damage.
export const ratioDamage=(p,d)=>p<=0?0:p*p/(p+Math.max(0,d));
// Curses (§3.4): 50% + (caster 의지 − target 의지)·2 around the tool's or skill's base, 10–90%.
export function curseChance(base,caster,target){if(base>=100||!caster?.stats||!target?.stats)return base;return Math.max(10,Math.min(90,Math.round(base+2*((caster.stats.wil||0)-(target.stats.wil||0)))));}
