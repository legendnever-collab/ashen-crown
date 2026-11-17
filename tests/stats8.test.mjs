// v2.0.0 능력치 엔진 (D-115, REFORM_DESIGN §3.4/§6, core/stats8.js): six stats → derived numbers, growth and promotion,
// enemies at the sortie's level (with the mission's share), proportional troop scaling, the troop tier cap, the ratio
// formula, curses and the matchup triangle.
import test from 'node:test';import assert from 'node:assert/strict';
import {derivedFrom,deriveUnit,statsAt,levelUpStats,promoteStats,growthOf,enemyLevel,scaleTroop,planLevels,ratioDamage,curseChance,matchup8,DIFFICULTY,sortieAverage,difficultyPush,HARD_FROM,HARD_FULL_AT} from '../src/core/stats8.js';
import {CLASSES8,STAT_KEYS,TIER_STAT_BONUS,HERO_STATS} from '../src/data/classes8.js';

test('the bases are fitted: today\'s heroes keep their Lv 1 numbers (Erik HP 42 / ATK 15 / DEF 8, Lia MAG 18)',()=>{
 assert.deepEqual(['maxHP','atk','def'].map(k=>derivedFrom('infantry',statsAt('eric',1),1)[k]),[42,15,8]);
 const lia=derivedFrom('mage',statsAt('lia',1),1);assert.equal(lia.mag,18);assert.equal(lia.maxHP,27);
 assert.equal(Object.keys(HERO_STATS).length,13,'nine heroes and four officers');for(const st of Object.values(HERO_STATS))assert.deepEqual(Object.keys(st).sort(),[...STAT_KEYS].sort());});

test('growth: one level adds the class growth (heroes ×1.15) and re-derives; promotion adds +2/+3 to the main stats, +1 to the rest',()=>{
 const u={id:'eric',team:'ally',cls:'infantry',level:1,stats:statsAt('eric',1)};deriveUnit(u);const g=growthOf(u),before={...u.stats};u.level=2;const ch=levelUpStats(u);
 for(const k of STAT_KEYS)assert.ok(Math.abs(u.stats[k]-before[k]-g[k])<.051,k);assert.ok(Math.abs(g.str-CLASSES8.infantry.growth.str*1.15)<1e-9);assert.ok(ch.atk>=1);
 const s0={...u.stats};promoteStats(u,2);for(const k of STAT_KEYS)assert.ok(Math.abs(u.stats[k]-s0[k]-(CLASSES8.infantry.main.includes(k)?TIER_STAT_BONUS[2].main:TIER_STAT_BONUS[2].rest))<.051,k);
 assert.equal(u.atk,derivedFrom('infantry',u.stats,u.level).atk);
 const off={id:'bram'},hero={id:'eric'};assert.ok(growthOf({...off,cls:'infantry'}).str<growthOf({...hero,cls:'infantry'}).str,'an officer grows one grade slower');});

test('enemy level: sortie average + rank (+3 boss, +2 elite) + the mission\'s share; never below the authored level − 2; hard adds 1 (from a Lv 19 sortie)',()=>{
 const s={levelPlan:{avg:10},campaign:{}},m={level:8};
 assert.equal(enemyLevel(s,{team:'enemy',base:{level:8}},m),10);assert.equal(enemyLevel(s,{team:'enemy',id:'boss',base:{level:8}},m),13);assert.equal(enemyLevel(s,{team:'enemy',elite:true,base:{level:8}},m),12);
 assert.equal(enemyLevel(s,{team:'enemy',base:{level:8}},{...m,levelPct:.5}),15);assert.equal(enemyLevel({...s,levelPlan:{avg:2}},{team:'enemy',base:{level:8}},m),6,'floor: authored − 2');
 assert.equal(enemyLevel({levelPlan:{avg:20},campaign:{difficulty:'hard'}},{team:'enemy',base:{level:8}},m),21);assert.equal(enemyLevel(s,{team:'allied',base:{level:8}},{...m,levelPct:.5}),10,'allied troops: no share');
 assert.deepEqual([DIFFICULTY.normal.potions,DIFFICULTY.hard.potions,DIFFICULTY.hard.mul,DIFFICULTY.hard.levels],[2,1,1.1,1]);});

test('어려움 grows in with the legion: no stat push through ACT I (below a Lv 11 sortie), full +1 level and ×1.1 from Lv 19; 보통 never pushes',()=>{
 const at=(avg,difficulty='hard')=>difficultyPush({levelPlan:{avg},campaign:{difficulty}});
 assert.deepEqual(at(1),{levels:0,mul:1});assert.deepEqual(at(HARD_FROM),{levels:0,mul:1});assert.deepEqual(at(HARD_FULL_AT),{levels:1,mul:1.1});assert.deepEqual(at(20),{levels:1,mul:1.1});
 const mid=at(15);assert.equal(mid.levels,1);assert.ok(Math.abs(mid.mul-1.05)<1e-9);assert.deepEqual(at(12,'normal'),{levels:0,mul:1});
 const s={levelPlan:{avg:1.4},campaign:{difficulty:'hard'}};assert.equal(enemyLevel(s,{team:'enemy',base:{level:1}},{level:1}),1,'the first village: no extra levels');});

test('troops scale by their class\'s reference curve: a weak unit stays as weak beside the line, and scaling twice changes nothing',()=>{
 const s={levelPlan:{avg:15,tier:3},campaign:{}},m={level:5},mk=(hp,atk)=>({team:'enemy',kind:'soldier',level:5,hp,maxHP:hp,atk,def:6,res:3,spd:6});
 const weak=scaleTroop(s,mk(30,10),m),line=scaleTroop(s,mk(60,20),m);assert.equal(weak.level,15);assert.ok(Math.abs(line.maxHP/weak.maxHP-2)<.05);assert.ok(Math.abs(line.atk/weak.atk-2)<.1);
 const again=structuredClone(line);scaleTroop(s,again,m);assert.deepEqual(again,line);
 assert.ok(weak.maxHP>30&&weak.maxHP<30*3,'grows with the level, not by a flat amount');});

test('the troops\' basic attack tier follows their level, capped by the sortie\'s own tier (bosses one above)',()=>{
 const s={units:[{team:'ally',level:20,classTier:1,hp:10},{team:'ally',level:20,classTier:1,hp:10}],campaign:{}};planLevels(s,{level:5});assert.equal(s.levelPlan.tier,1);assert.equal(sortieAverage(s),20);
 const grunt=scaleTroop(s,{team:'enemy',kind:'soldier',level:5,hp:30,maxHP:30,atk:10,def:5,res:2,spd:5},{level:5}),boss=scaleTroop(s,{team:'enemy',id:'boss',kind:'captain',level:5,hp:60,maxHP:60,atk:14,def:6,res:3,spd:5},{level:5});
 assert.equal(grunt.troopTier,1);assert.equal(boss.troopTier,2);
 const t={units:[{team:'ally',level:20,classTier:3,hp:10}],campaign:{}};planLevels(t,{level:5});assert.equal(scaleTroop(t,{team:'enemy',kind:'soldier',level:5,hp:30,maxHP:30,atk:10,def:5,res:2,spd:5},{level:5}).troopTier,3);});

test('the ratio formula, curses and the triangle',()=>{
 assert.equal(ratioDamage(40,20)*2,ratioDamage(80,40));assert.equal(ratioDamage(0,10),0);assert.ok(ratioDamage(30,0)===30);
 const a={stats:{wil:20}},b={stats:{wil:5}};assert.equal(curseChance(50,a,b),80);assert.equal(curseChance(50,b,a),20);assert.equal(curseChance(50,{stats:{wil:60}},b),90);assert.equal(curseChance(100,a,b),100);
 assert.equal(matchup8({cls:'cavalry'},{cls:'infantry'}),1.25);assert.equal(matchup8({cls:'cavalry'},{cls:'spear'}),.75);assert.equal(matchup8({cls:'healer'},{cls:'mage'}),1);assert.equal(matchup8({cls:'rogue'},{look:'bellard',team:'enemy'}),1,'specials stand outside');});
