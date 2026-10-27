// v0.8 item, skill and status catalog (D-073, APPROVED_DIRECTION 2026-10-28; names, numbers and prices PROPOSED).
// One list for the game data, docs/v0.8.0/ITEM_CATALOG.md and art work pack E (scripts/make-item-art-pack.py).
// v0.8.0 implements the tools, skills, statuses and commands; gear tiers II–III and the treasures are v0.8.1 and are
// listed here so their icons can be painted now. Gear I keeps the v0.3 ids (frontier-data.js GEAR).
const T=(id,ko,en,cat,effect,price,where)=>({id,kind:'tool',ko,en,cat,effect,price,where});
export const CATALOG_TOOLS=[
 T('herb','약초','Healing Herb','heal','자신 또는 인접 아군 HP +15',15,'모든 거점'),
 T('medium','중급 회복약','Medium Potion','heal','자신 또는 인접 아군 HP +30',30,'모든 거점'),
 T('ether','에테르','Ether','heal','자신 또는 인접 아군 MP +8',40,'모든 거점'),
 T('elixir','엘릭서','Elixir','heal','자신 또는 인접 아군 HP 전부 + 상태이상 해제',0,'판매 안 함 · 상자와 숨은 전과'),
 T('antidote','해독초','Antidote Herb','cure','자신 또는 인접 아군 독 해제',20,'모든 거점'),
 T('clarity','청심향','Clarity Incense','cure','자신 또는 인접 아군 혼란·속박·침묵 해제',35,'순례자 마을 · 벨마르'),
 T('ward','수호 강장제','Ward Tonic','buff','자신 또는 인접 아군 다음 아군 턴까지 DEF/RES +2',35,'모든 거점'),
 T('drum','전고','War Drum','buff','자신 주위 1칸 아군 다음 아군 턴까지 ATK +3',70,'철관성 성하 마을'),
 T('bomb','화약 폭탄','Powder Bomb','throw','사거리 2–3 · 십자 5칸 · 고정 피해 16(DEF 절반 적용) · 풀·숲에 불',110,'철관성 성하 마을 (M08 이후)'),
 T('smoke','연막탄','Smoke Bomb','throw','사거리 2–3 · 십자 5칸 · 다음 적 턴까지 그 안의 아군을 노리는 명중 −30',60,'벨마르'),
 T('bewilder','혼란 가루','Bewildering Powder','throw','사거리 2–3 · 적 1명 · [혼란] 75%',90,'벨마르 (M09 이후)'),
 T('net','그물','Weighted Net','throw','사거리 2–3 · 적 1명 · [속박] 100% (보스 1턴)',50,'국경 진영 이후'),
 T('caltrops','마름쇠','Caltrops','throw','사거리 2–3 · 빈칸 1곳과 그 옆 1곳 · 밟은 적은 멈추고 피해 6',45,'철관성 성하 마을')
];
export const CATALOG_MISC=[
 {id:'gold',kind:'misc',ko:'골드',en:'Gold',effect:'화폐'},
 {id:'supplyCrate',kind:'misc',ko:'보급 상자',en:'Supply Crate',effect:'적 짐마차·보급병이 떨어뜨리는 도구 (v0.8.1)'}
];
const G=(id,ko,en,tier,slot,heroes,effect,price,where)=>({id,kind:'gear',ko,en,tier,slot,heroes,effect,price,where});
const ALL5=['eric','elina','lia','sain','kai'],LIGHT=['elina','lia','sain','kai','dario'],MELEE=['eric','kai','thea','dario','ines'];
export const CATALOG_GEAR=[
 // tier I (v0.3, unchanged; new paintings only)
 G('ironBlade','단련된 검','Tempered Sword',1,'weapon',['eric'],'ATK +2',65,'ACT I'),
 G('huntingBow','사냥 활','Hunting Bow',1,'weapon',['elina'],'HIT +8',65,'ACT I'),
 G('longbow','장궁','Longbow',1,'weapon',['elina'],'ATK +2',80,'ACT I'),
 G('crystalStaff','수정 지팡이','Crystal Staff',1,'weapon',['lia'],'MAG +2',70,'ACT I'),
 G('mercyStaff','자비의 지팡이','Mercy Staff',1,'weapon',['sain'],'MAG +2',65,'ACT I'),
 G('daggers','균형 단검','Balanced Daggers',1,'weapon',['kai'],'ATK/SPD +1',65,'ACT I'),
 G('heavyShield','중방패','Heavy Shield',1,'armor',['eric'],'DEF +2',70,'ACT I'),
 G('lightShield','경방패','Light Shield',1,'armor',['eric'],'MOV +1',75,'ACT I'),
 G('travelCloak','여행 망토','Travel Cloak',1,'armor',['elina','lia','sain','kai'],'RES +2',55,'ACT I'),
 G('trailBoots','행군 장화','Trail Boots',1,'accessory',ALL5,'MOV +1',85,'ACT I'),
 G('focusCharm','집중의 부적','Focus Charm',1,'accessory',ALL5,'RES +1',45,'ACT I'),
 // tier II — castle town below Ironhold (Iron Crown)
 G('steelGreatsword','강철 대검','Steel Greatsword',2,'weapon',['eric'],'ATK +4',180,'철관성 성하 마을 · M07'),
 G('knightLance','기사 창','Knight Lance',2,'weapon',['thea'],'ATK +3 · 돌격 피해 +2',160,'철관성 성하 마을 · M07'),
 G('ironwoodBow','철목 활','Ironwood Bow',2,'weapon',['elina'],'ATK +3',170,'철관성 성하 마을 · M07'),
 G('plateCuirass','판금 흉갑','Plate Cuirass',2,'armor',['eric','thea','ines'],'DEF +4 · SPD −1',220,'철관성 성하 마을 · M08'),
 G('towerShield','철관 방패','Iron Tower Shield',2,'armor',['eric'],'DEF +2 · 원거리 피해 −2',200,'철관성 성하 마을 · M08'),
 G('lancerMail','기병 사슬갑옷','Lancer Mail',2,'armor',['thea'],'DEF +2 · HP +6',180,'철관성 성하 마을 · M08'),
 G('steelGauntlets','강철 건틀릿','Steel Gauntlets',2,'accessory',MELEE,'ATK +2',160,'철관성 성하 마을 · M08'),
 G('runeforgedBlade','룬 단조검','Runeforged Blade',2,'weapon',['eric','dario'],'ATK +6',420,'철관성 성하 마을 · 고급품'),
 // tier II — Velmar market (Free Lords)
 G('twinSabers','쌍검','Twin Sabers',2,'weapon',['dario'],'ATK +3 · SPD +1',170,'벨마르 · M09'),
 G('repeatingCrossbow','연사 석궁','Repeating Crossbow',2,'weapon',['elina'],'ATK +2 · HIT +10',190,'벨마르 · M09'),
 G('emberRod','불씨 지팡이','Ember Rod',2,'weapon',['lia'],'MAG +4',190,'벨마르 · M09'),
 G('shadowStiletto','그림자 단검','Shadow Stiletto',2,'weapon',['kai'],'ATK +3 · SPD +1',170,'벨마르 · M10'),
 G('merchantCoat','상인의 외투','Merchant Coat',2,'armor',LIGHT,'DEF +1 · RES +2 · SPD +1',160,'벨마르 · M10'),
 G('luckyCoin','행운 동전','Lucky Coin',2,'accessory',[...ALL5,'thea','dario','ines'],'치명 +5',150,'벨마르 · M10'),
 G('windCharm','바람결 부적','Windstep Charm',2,'accessory',[...ALL5,'thea','dario','ines'],'회피 +10',180,'벨마르 · M10'),
 G('duelistRapier','결투가의 레이피어','Duelist Rapier',2,'weapon',['dario'],'ATK +5 · 치명 +5',400,'벨마르 · 고급품'),
 // tier II — pilgrim village (Order of the Sacred Flame)
 G('flameStaff','성화 지팡이','Sacred Flame Staff',2,'weapon',['sain'],'MAG +2 · 치유 +3',180,'순례자 마을 · M11'),
 G('pilgrimMace','순례자의 철퇴','Pilgrim Mace',2,'weapon',['ines'],'ATK +3',160,'순례자 마을 · M11'),
 G('pilgrimMantle','순례 망토','Pilgrim Mantle',2,'armor',[...LIGHT,'ines'],'RES +3 · 상태이상 확률 −25%',170,'순례자 마을 · M11'),
 G('sanctumTome','성소의 마도서','Sanctum Tome',2,'weapon',['lia'],'MAG +3 · RES +2',230,'순례자 마을 · M12'),
 G('wardenShield','수호자의 방패','Warden Shield',2,'armor',['ines','eric'],'DEF +3',190,'순례자 마을 · M12'),
 G('chrismCharm','성유 부적','Chrism Charm',2,'accessory',[...ALL5,'thea','dario','ines'],'독 면역',140,'순례자 마을 · M12'),
 G('votiveBand','서약의 팔찌','Votive Band',2,'accessory',[...ALL5,'thea','dario','ines'],'MP +6',200,'순례자 마을 · M12'),
 G('cathedralStaff','대성당 지팡이','Cathedral Staff',2,'weapon',['sain'],'MAG +4 · 치유 +5',450,'순례자 마을 · 고급품'),
 // tier III — faction elite (trust ≥ 2)
 G('crownGuardLance','왕관 근위 창','Crown Guard Lance',3,'weapon',['thea'],'ATK +5 · DEF +1',520,'철관성 성하 마을 · 철왕관 신뢰 2'),
 G('crownGuardShield','근위 대방패','Crown Guard Shield',3,'armor',['eric'],'DEF +5 · RES +2',560,'철관성 성하 마을 · 철왕관 신뢰 2'),
 G('leagueSaber','연맹 기사의 사브르','League Saber',3,'weapon',['dario','kai'],'ATK +5 · SPD +2',540,'벨마르 · 자유 영주 신뢰 2'),
 G('leagueLongbow','연맹 장궁','League Longbow',3,'weapon',['elina'],'ATK +4 · HIT +10',520,'벨마르 · 자유 영주 신뢰 2'),
 G('paladinMace','성기사의 전투 철퇴','Paladin Mace',3,'weapon',['ines'],'ATK +5 · RES +2',540,'순례자 마을 · 성화 교단 신뢰 2'),
 G('flameVestment','성화 법의','Sacred Flame Vestment',3,'armor',['sain','lia'],'RES +5 · MP +6',560,'순례자 마을 · 성화 교단 신뢰 2')
];
const R=(id,ko,en,effect,where)=>({id,kind:'treasure',ko,en,effect,where});
export const CATALOG_TREASURES=[
 R('herbPouch','약초 주머니','Herb Pouch','피격으로 HP가 절반 아래가 되면 약초를 자동으로 1회 쓴다','M01 숨은 전과'),
 R('hawkFeather','매의 깃','Hawk Feather','활 사거리 +1','M03 숨은 전과'),
 R('sageNotebook','현자의 수첩','Sage Notebook','얻는 경험치 +20%','M04 숨은 전과'),
 R('windHorseshoe','바람의 편자','Wind Horseshoe','MOV +2','M05 숨은 전과'),
 R('twinDaggers','쌍둥이 단검','Twin Daggers','반격을 받으면 한 번 더 반격','M06 숨은 전과'),
 R('silenceShield','침묵의 방패','Shield of Silence','이 장수가 공격한 적은 반격하지 못한다','M07 숨은 전과'),
 R('mirrorCuirass','거울 흉갑','Mirror Cuirass','원거리 피해 절반','M08 숨은 전과'),
 R('clearCharm','청명 부적','Charm of Clarity','상태이상 면역','M10 숨은 전과'),
 R('flameReliquary','성화의 성구','Flame Reliquary','턴마다 HP +5','M11 숨은 전과'),
 R('manaRing','마나의 반지','Mana Ring','턴마다 MP +2','M12 숨은 전과'),
 R('lionEpaulette','사자의 견장','Lion Epaulette','인접 아군 DEF +1','M13 숨은 전과'),
 R('allianceSeal','동맹의 인장','Alliance Seal','전투 첫 턴 전군 MOV +1','M14 숨은 전과')
];
const S=(id,hero,slot,ko,en,cost,effect)=>({id,kind:'skill',hero,slot,ko,en,cost,effect});
export const CATALOG_SKILLS=[
 S('guard','eric',1,'수호','Guard',3,'다음 아군 턴까지 DEF +3, 인접 동료가 받는 첫 근접 공격을 대신 받는다'),
 S('provoke','eric',2,'도발','Provoke',3,'3칸 안의 적 1명 · 다음 적 턴에 그 적은 에릭만 노린다(보스 50%) · 에릭 DEF +2'),
 S('bulwark','eric',3,'방벽','Bulwark',4,'다음 아군 턴까지 인접 칸의 적은 움직일 수 없다'),
 S('aimedShot','elina',1,'조준 사격','Aimed Shot',3,'명중 +18, 피해 +2'),
 S('pinningShot','elina',2,'속박 사격','Pinning Shot',4,'사거리 2–3 · 피해 70% · 맞으면 [속박] 1턴'),
 S('overwatch','elina',3,'경계 사격','Overwatch',4,'적 턴에 사거리에 처음 들어온 적에게 사격'),
 S('fireBolt','lia',1,'화염탄','Fire Bolt',5,'사거리 1–3 마법 공격'),
 S('flameBurst','lia',2,'화염진','Flame Burst',7,'사거리 2–3 · 십자 5칸 · 마법 피해 70% · 적에게만'),
 S('arcane','lia',3,'마력 지형','Arcane Territory',6,'십자 5칸 3턴 · 아군 MAG +3, 적 RES −2'),
 S('heal','sain',1,'치유','Heal',4,'사거리 1–2 회복'),
 S('purify','sain',2,'정화','Purify',3,'사거리 1–2 · 상태이상 해제 + HP 8 · 다음 적 턴까지 면역'),
 S('recall','sain',3,'귀환의 기도','Divine Recall',6,'4칸 안의 아군을 옆으로 데려오고 HP 10'),
 S('quickStrike','kai',1,'빠른 일격','Quick Strike',3,'협공하면 피해 +6'),
 S('venomEdge','kai',2,'독날','Venom Edge',3,'근접 공격 + [독] 3턴'),
 S('exchange','kai',3,'그림자 교환','Shadow Exchange',3,'아군 또는 인접한 적과 위치를 바꾼다'),
 S('charge','thea',1,'돌격','Charge',3,'근접 피해 +4, 3칸 이상 달리면 +7, 반격 없음'),
 S('breakthrough','thea',2,'돌파','Breakthrough',3,'근접 공격 후 1칸 밀어낸다 · 막히면 피해 +3'),
 S('rallyCry','thea',3,'기병의 함성','Rally Cry',5,'주위 2칸 아군 MOV +1, 명중 +10'),
 S('riposte','dario',1,'받아치기','Riposte',3,'근접 피해 +2, 다음 아군 턴까지 반격 피해 +8'),
 S('whirlwind','dario',2,'회전 베기','Whirlwind',4,'인접한 모든 적 · 피해 70% · 반격 없음'),
 S('feint','dario',3,'허점 찌르기','Feint',4,'근접 공격 + 대상 ATK −4 · 다음 적 턴에 반격 불가'),
 S('sanctuaryOath','ines',1,'성역의 맹세','Sanctuary Oath',3,'근접 공격 후 성역 −4'),
 S('flameBrand','ines',2,'성화 낙인','Flame Brand',3,'근접 공격 + 대상 DEF −3 2턴'),
 S('pilgrimLantern','ines',3,'순례자의 등불','Pilgrim Lantern',5,'주위 1칸 아군 상태이상 해제 · 다음 적 턴까지 면역')
];
export const CATALOG_STATUS=[
 {id:'poison',kind:'status',ko:'독',en:'Poison',effect:'턴 시작마다 최대 HP 10%(3–8) · 3턴'},
 {id:'confuse',kind:'status',ko:'혼란',en:'Confusion',effect:'조작 불가 · 가장 가까운 유닛을 공격 · 1턴'},
 {id:'bind',kind:'status',ko:'속박',en:'Bind',effect:'이동 불가 · 1턴'},
 {id:'silence',kind:'status',ko:'침묵',en:'Silence',effect:'스킬 불가 · 2턴'},
 {id:'buff',kind:'status',ko:'강화',en:'Strengthened',effect:'능력치 상승 중'},
 {id:'debuff',kind:'status',ko:'약화',en:'Weakened',effect:'능력치 하락 중'},
 {id:'attack',kind:'command',ko:'공격',en:'Attack',effect:'전투 명령'},
 {id:'wait',kind:'command',ko:'대기',en:'Wait',effect:'전투 명령'},
 {id:'persuade',kind:'command',ko:'설득',en:'Persuade',effect:'전투 명령'},
 {id:'capture',kind:'command',ko:'생포',en:'Capture',effect:'전투 명령'}
];
export const CATALOG=[...CATALOG_TOOLS,...CATALOG_MISC,...CATALOG_GEAR,...CATALOG_TREASURES,...CATALOG_SKILLS,...CATALOG_STATUS];
