import {NEW_CLASS,NEW_STATS} from './mercs-v210.js';
// v2.0.0 전장 개편 (D-114/D-115, docs/v2.0.0/REFORM_DESIGN.md §3; numbers PROPOSED, tuned by the balance runs).
// Eight classes × three tiers. Tier names are our own (서약·재·결계·새벽 motifs, §13: no 조조전 class or promotion names).
// Derived numbers come from the six stats (core/stats8.js): HP = hp + 2.5·강인 + hpLv·(level−1); 물리 공격 = wpn + 1.5·무력;
// 마법 공격 = foc + 1.5·지혜; 물리 방어 = arm + 0.7·강인; 마법 방어 = ward + 0.8·의지; 치유력 = staff + 1.5·의지; 속도 = 민첩.
// The bases are fitted so today's heroes keep their Lv 1 numbers (Erik HP 42 / ATK 15 / DEF 8 …).
export const STAT_KEYS=['str','int','wil','con','agi','luk'];
export const STAT_KO={str:'무력',int:'지혜',wil:'의지',con:'강인',agi:'민첩',luk:'운'};
export const STAT_NOTE={str:'물리 공격력, 일기토',int:'마법 공격력, 전술 명중, 설득',wil:'치유량, 저주 성공·저항, 마법 방어',con:'최대 HP, 물리 방어',agi:'명중, 회피, 행동 순서',luk:'치명타, 상태이상, 보물이 떨어질 확률'};
const T=(ko,en)=>({ko,en});
export const CLASSES8={
 infantry:{ko:'보병',en:'Infantry',tiers:[T('검사','Swordhand'),T('기사','Knight'),T('서약기사','Oathknight')],
  base:{hp:19,hpLv:2.5,wpn:3,foc:0,arm:2,ward:2,staff:0,mov:4,range:[1,1],profile:'infantry'},
  growth:{str:1.2,int:.2,wil:.4,con:1.0,agi:.6,luk:.4},main:['str','con'],weapons:['sword','greatsword'],armor:'light'},
 spear:{ko:'창병',en:'Spear',tiers:[T('창병','Spearhand'),T('방진창병','Phalanx'),T('수문장','Gatewarden')],
  base:{hp:19,hpLv:2.5,wpn:3,foc:0,arm:2,ward:1,staff:0,mov:4,range:[1,1],profile:'infantry'},
  growth:{str:1.2,int:.2,wil:.4,con:1.1,agi:.5,luk:.3},main:['str','con'],weapons:['spear'],armor:'heavy'},
 archer:{ko:'궁병',en:'Archer',tiers:[T('궁수','Bowhand'),T('명사수','Marksman'),T('잿불궁수','Emberbow')],
  base:{hp:17,hpLv:2,wpn:4,foc:0,arm:.5,ward:1,staff:0,mov:4,range:[2,3],profile:'infantry'},
  growth:{str:1.2,int:.3,wil:.4,con:.6,agi:1.0,luk:.5},main:['str','agi'],weapons:['bow'],armor:'light'},
 cavalry:{ko:'기병',en:'Cavalry',tiers:[T('기수','Rider'),T('돌격기사','Lancer Knight'),T('사자기사','Lionknight')],
  base:{hp:18,hpLv:2.5,wpn:3.5,foc:0,arm:2,ward:.6,staff:0,mov:6,range:[1,1],profile:'cavalry'},
  growth:{str:1.3,int:.2,wil:.3,con:.9,agi:.7,luk:.4},main:['str','agi'],weapons:['sword','spear'],armor:'heavy'},
 mage:{ko:'마도사',en:'Mage',tiers:[T('견습 마도사','Apprentice'),T('마도사','Mage'),T('재의 현자','Ash Sage')],
  base:{hp:17,hpLv:1.5,wpn:1.5,foc:4.5,arm:0,ward:2.4,staff:0,mov:4,range:[1,1],profile:'infantry'},
  growth:{str:.2,int:1.6,wil:.9,con:.5,agi:.6,luk:.4},main:['int','wil'],weapons:['staff','tome'],armor:'robe'},
 healer:{ko:'치유사',en:'Healer',tiers:[T('치유사','Mender'),T('사제','Priest'),T('새벽사제','Dawn Priest')],
  base:{hp:18,hpLv:1.5,wpn:2,foc:6,arm:.5,ward:2,staff:12,mov:4,range:[1,1],profile:'infantry'},
  growth:{str:.4,int:.9,wil:1.4,con:.6,agi:.6,luk:.5},main:['wil','int'],weapons:['staff','tome'],armor:'robe'},
 rogue:{ko:'도적',en:'Rogue',tiers:[T('도적','Cutpurse'),T('그림자','Shade'),T('밤까마귀','Nightcrow')],
  base:{hp:19,hpLv:2,wpn:3,foc:0,arm:.5,ward:1.6,staff:0,mov:4,range:[1,1],profile:'rogue'}, /* v2.2.1 play-test (D-126): MOV 5 → 4 — rogues still cross every terrain at cost 1 and ignore zones of control, and boots add one */
  growth:{str:1.1,int:.3,wil:.3,con:.6,agi:1.3,luk:.8},main:['agi','luk'],weapons:['dagger'],armor:'light'},
 shield:{ko:'방패병',en:'Shield',tiers:[T('방패병','Shieldhand'),T('철벽병','Ironwall'),T('결계수호자','Wardkeeper')],
  base:{hp:14,hpLv:3,wpn:4,foc:0,arm:2,ward:.4,staff:0,mov:3,range:[1,1],profile:'infantry'},
  growth:{str:1.0,int:.2,wil:.8,con:1.3,agi:.3,luk:.3},main:['con','wil'],weapons:['hammer'],armor:'heavy'}
};
export const CLASS8_KEYS=Object.keys(CLASSES8);
// Promotion: the class's two main stats +2 (tier 2) and +3 (tier 3), the rest +1.
export const TIER_STAT_BONUS={2:{main:2,rest:1},3:{main:3,rest:1}};
// The heroes' classes (§3.2, Q3 approved) and their Lv 1 stats (§3.4, Q8 approved).
export const HERO_CLASS8={eric:'infantry',elina:'archer',lia:'mage',sain:'healer',kai:'rogue',thea:'cavalry',dario:'infantry',ines:'shield',baldrick:'cavalry'};
// v2.1 (D-118): the officers are tavern hires; the later hires and the rescued hero share their shape (data/mercs-v210.js).
export const OFFICER_CLASS8={bram:'spear',noa:'archer',marta:'shield',rowell:'cavalry',...NEW_CLASS};
export const UNIT_CLASS8={...HERO_CLASS8,...OFFICER_CLASS8};
export const HERO_STATS={
 eric:{str:8,int:2,wil:4,con:9,agi:5,luk:6},elina:{str:8,int:3,wil:4,con:5,agi:9,luk:7},lia:{str:3,int:9,wil:7,con:4,agi:6,luk:5},
 sain:{str:4,int:6,wil:10,con:5,agi:6,luk:6},kai:{str:7,int:3,wil:3,con:5,agi:12,luk:9},thea:{str:8,int:2,wil:3,con:7,agi:8,luk:5},
 dario:{str:8,int:2,wil:3,con:6,agi:10,luk:7},ines:{str:7,int:3,wil:7,con:9,agi:6,luk:5},baldrick:{str:9,int:2,wil:5,con:10,agi:7,luk:5},
 // the officers (§5.2, Q1 approved)
 bram:{str:8,int:3,wil:5,con:8,agi:5,luk:5},noa:{str:7,int:3,wil:4,con:5,agi:9,luk:8},marta:{str:7,int:2,wil:6,con:9,agi:4,luk:5},rowell:{str:10,int:2,wil:4,con:7,agi:10,luk:5}, // v2.1: Rowell is an elite hire (+2 main)
 ...NEW_STATS
};
// A hero grows a little faster than an officer of the same class (§3.2: one growth grade).
export const HERO_GROWTH_BONUS=.15;
// Enemy and allied troops by kind (and look): their class. Specials (beasts, harvesters, statues, ward trees, rites,
// Bellard) have none and stand outside the matchups (§3.3).
export const KIND_CLASS8={bandit:'infantry',captain:'infantry',soldier:'infantry',swordsman:'infantry',leader:'infantry',commander:'infantry',
 spear:'spear',archer:'archer',cavalry:'cavalry',lion:'cavalry',bearer:'shield',warden:'shield',assassin:'rogue',ritualist:'mage',abbot:'healer'};
export const LOOK_CLASS8={grayCloak:'rogue',maskedRaider:'rogue',greyMaster:'rogue',greyCaptain:'rogue',abbot:'healer',ritualKnight:'infantry',bellard:null,harvester:null};
// The matchup triangle (§3.3): +25% when favoured, −25% when not. Healers neither gain nor lose.
export const MATCHUP8={
 cavalry:{up:['infantry','mage','healer'],down:['spear','shield']},
 spear:{up:['cavalry'],down:['archer']},
 archer:{up:['spear','cavalry'],down:['shield']},
 shield:{up:['archer','infantry'],down:['mage']},
 infantry:{up:['shield','rogue'],down:['cavalry']},
 mage:{up:['shield','spear'],down:['rogue']},
 rogue:{up:['mage','healer','archer'],down:['infantry']},
 healer:{up:[],down:[]}
};
export const MATCHUP_UP=1.25,MATCHUP_DOWN=.75;
// The ① skill of each class for the officers (heroes keep their own ①). Multipliers replace the old flat bonuses.
export const CLASS_SKILL8={infantry:'riposte',spear:'brace',archer:'aimed',cavalry:'charge',mage:'fireBolt',healer:'heal',rogue:'quick',shield:'sanctuary'};
export const HERO_SKILL={eric:'guard',elina:'aimed',lia:'fireBolt',sain:'heal',kai:'quick',thea:'charge',dario:'riposte',ines:'sanctuary',baldrick:'lion'};
export const SKILL_MUL={aimed:1.15,fireBolt:1,quick:1,quickFlank:1.4,charge:1.25,chargeRun:1.45,riposte:1.15,lion:1.4,brace:1.1,lowHPFire:1.25};
// §3.5 the basic attack by tier: hits and their multiplier; splash = multiplier on the tiles named.
export const TIER_ATTACK={
 infantry:[{hits:1,mul:1},{hits:2,mul:.7,name:'2연 베기'},{hits:1,mul:1,splash:.5,area:'adjacent',name:'회전 베기'}],
 spear:[{hits:1,mul:1},{hits:1,mul:1,pierce:1,name:'관통 찌르기'},{hits:1,mul:1,pierce:1,phalanx:true,name:'방진'}],
 archer:[{hits:1,mul:1},{hits:2,mul:.65,name:'2연사'},{hits:1,mul:1,splash:.4,area:'sides',ember:true,name:'잿불 화살 3발'}],
 cavalry:[{hits:1,mul:1},{hits:1,mul:1,name:'돌격'},{hits:1,mul:1,passThrough:.5,name:'돌파'}],
 mage:[{hits:1,mul:1},{hits:1,mul:1},{hits:1,mul:1}],
 healer:[{hits:1,mul:1},{hits:1,mul:1},{hits:1,mul:1}],
 rogue:[{hits:1,mul:1},{hits:2,mul:.6,name:'쌍단검'},{hits:2,mul:.6,afterimage:true,name:'잔상'}],
 shield:[{hits:1,mul:1},{hits:1,mul:1,push:1,name:'밀치기'},{hits:1,mul:1,wardWall:true,name:'결계 벽'}]
};
