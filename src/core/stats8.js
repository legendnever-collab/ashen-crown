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
export function growthOf(u){const c=classDef(u)||CLASSES8.infantry,bonus=HERO_IDS.includes(u?.id)||['adel','gunnar','maren','luka'].includes(u?.id)?1+HERO_GROWTH_BONUS:1; /* v2.1: the rescued heroes grow like heroes (v2.3.1: 군나르) */return Object.fromEntries(STAT_KEYS.map(k=>[k,(c.growth[k]||0)*bonus]));}
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
// v2.2.0 play-test (D-124): "난이도는 너무 쉬워지니 조금 더 올려줘" — from M02 on, every enemy's stats carry a base ×BASE_MUL on
// both difficulties (the first battle stays as it is: M01 ≥ 95% on 보통, D-120; the village requests 120+ stay as they are);
// 어려움 adds its level ramp on top.
export const BASE_MUL=1.08,BASE_FROM=2,BASE_MUL_AT={3:.95,4:.97,6:1.02,15:.88,16:.92,17:.85,18:.92,20:.82,21:.97,22:1}; // M03's timed retreat and M04's long assault are the sharpest; they get less. v2.2.1 play-test (D-126): with heals halved and rogues at MOV 4 the strengths were retuned by act1/act2-balance — M03 ×0.95, M04 ×0.97, M06 ×1.02 (its seal guards now hold still), M15 ×0.95, M17 ×0.97. M15 too: its record-box carriers race for the gate (first try fell 78% → 47% at ×1.08). M16 keeps its strength: the returning Thea (TURN 2) must be able to survive (she was at 8/112 HP after the enemy phase before; ×1.08 kills her and she never comes back). M22 likewise: its heralds must stay standing (first try 88% → 53% at ×1.08) v2.3.1 (D-131): M15 ×0.88 — after the ACT II big maps the chain reached it with other parties and first-tried it 12 of 29. v2.4.0 (D-135): on the big maps M15 goes back up to ×0.94 (×0.88: 38 of 38 replays won, ×1: 26 of 38); M18 ×0.92 on its big map; v2.4.1: M20 ×0.82 — two fronts a canal apart (×1.08: 0 of 14 replays, ×0.9 6/14, ×0.85 16/28); M21 ×0.97 (×1.08: 17/26, ×0.95: 22/26) — the loggers come from all four edges (×1.08: 12 of 21 replays).
export const DIFFICULTY={normal:{ko:'보통',levels:0,mul:1,potions:2,waves:1},hard:{ko:'어려움',levels:1,mul:1.1,potions:1,waves:1.25}};
export const difficultyOf=s=>DIFFICULTY[s?.campaign?.difficulty]?s.campaign.difficulty:'normal';
// 어려움 grows in with the legion (D-116): through ACT I it is 보통's numbers with the sharper AI, bigger waves and one potion
// (the stat push walled M03–M05 for the test player); its extra level and ×1.1 stats start from a Lv 11 sortie (ACT II) and
// are full from Lv 19 (the designed +2 / ×1.15 left the M15 chase at 2 of 20).
export const HARD_FROM=11,HARD_FULL_AT=19;
// v2.3.0 (D-129), the 어려움 re-measure: ACT II (M07–M14) was as easy as 보통 for the test player (the push grows in from Lv 11),
// so there the full +1 level and ×1.1 apply; the M15 chase fell to 1 of 23 (the clerks outran a legion facing guards a level
// up), and the guardians' trials M17 and M18 to 5 of 19 and 0 of 9 — there 어려움 keeps 보통's numbers and is harder only by
// the sharper AI, the bigger waves and the single potion.
// v2.3.1 (D-131): the M11 switchback is the exception in ACT II — with the full push the pilgrims fell in 23 of 23.
export const HARD_SHARE={7:1,8:1,9:1,10:1,11:0,12:1,13:1,14:0,15:0,16:0,17:0,18:0,19:0,20:0,21:0,22:0,23:0,24:.5,26:0,27:.5,30:.5}; // v2.5.1: M27–M30 from the camps before M27 on 어려움 — full M27 29/51, M30 14/42 → half 35/51, 33/47 (M28 41/45, M29 39/44 at full). v2.5.0 (D-141): replaying the camps before M21 (보통 and 어려움 chains) on 어려움 — full 26/66, half 31/66, 보통 numbers 42/66; M19 half 16/30 → 보통's numbers 22/30; M23 full 3/36 → 19/36; M24 full 14/36 → half 25/36; M26 full 16/34 → half 28/34. // v2.4.0 (D-135): M16's big map at full push first-tried 1 of 13 on 어려움 (보통's numbers: 10 of 16). v2.4.1: M19 half (5/15 → 8/15), M20 and M22 보통's numbers (2/14 → 7/14, 3/12 → 9/12); M21 grows in by level (9/13)
export function difficultyPush(s){const d=DIFFICULTY[difficultyOf(s)],mid=s?.missionId??1,base=mid>=BASE_FROM&&mid<100?(BASE_MUL_AT[mid]??BASE_MUL):1;if(!d.levels&&d.mul===1)return {levels:0,mul:base};const avg=s?.levelPlan?.avg??sortieAverage(s)??1,h=HARD_SHARE[mid]??Math.max(0,Math.min(1,(avg-HARD_FROM)/(HARD_FULL_AT-HARD_FROM)));return {levels:Math.round(d.levels*h),mul:base*(1+(d.mul-1)*h)};}
// The sortie's average level (deployed heroes and officers).
export function sortieAverage(s){const out=(s.units||[]).filter(u=>u.team==='ally'&&!u.benched&&u.hp>0);if(!out.length)return null;return out.reduce((a,u)=>a+(u.level||1),0)/out.length;}
const authoredLevel=(s,m)=>m?.level||Math.max(1,s?.missionId||1);
// The level an enemy fights at: sortie average + rank offset + mission offset + difficulty, never below the authored level − 2.
export function enemyLevel(s,u,m){const auth=u.base?.level??authoredLevel(s,m),avg=s.levelPlan?.avg??sortieAverage(s)??auth;
 const rank=u.team==='allied'?0:isBossRank(u)?3:u.elite?2:0,off=u.team==='allied'?0:(m?.levelOffset??0),pct=u.team==='allied'?0:(m?.levelPct??0),diff=u.team==='allied'?0:difficultyPush(s).levels;
 // the mission's offset is a share of the average (levelPct), so it weighs the same on a young legion and a seasoned one
 return Math.max(auth-2+diff,Math.round(avg*(1+pct))+rank+off+diff);}
// Snapshot the authored numbers once, then (re)scale from them. Idempotent: always computed from u.base.
export function scaleTroop(s,u,m){if(!u||!['enemy','allied'].includes(u.team)||u.noScale)return u;
 // a promotion or awakening trial is a set piece: its troops keep the authored numbers (only the attack tier is capped)
 if(m?.skirmish?.kind==='trial'){const L=u.level??authoredLevel(s,m),lv=L>=16?3:L>=8?2:1;u.troopTier=Math.min(lv,Math.min(3,(s.levelPlan?.tier||3)+(isBossRank(u)||u.elite?1:0)));return u;}
 if(!u.base)u.base={level:u.level??authoredLevel(s,m),maxHP:u.maxHP??u.hp,atk:u.atk||0,mag:u.mag||0,def:u.def||0,res:u.res||0,spd:u.spd||0};
 const b=u.base,L=enemyLevel(s,u,m),dl=L-b.level,g=derivedGrowth(classKeyOf(u)),mul=u.team==='allied'?1:difficultyPush(s).mul,r0=refAt(classKeyOf(u),b.level),r1=refAt(classKeyOf(u),L),f=(v,k)=>v>0?Math.max(1,Math.round(v*(r1[k]/Math.max(1,r0[k]))*mul)):v;
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
