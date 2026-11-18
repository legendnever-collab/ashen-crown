import {NEW_HEROES} from './mercs-v210.js';
export const VERSION = '2.2.0';
export const SCHEMA = 21;
export const WIDTH = 12, HEIGHT = 10;
// v0.4 benchmark pass: physical cut (fraction), evade (%), fire multiplier and per-class
// movement live together so the tap readout can describe each tile in one line.
export const TERRAIN = {
  g: {name:'Grass',ko:'평지', cost:1, defense:0, phys:0, evade:0, fire:1.25, color:'#52624a'},
  r: {name:'Road',ko:'길', cost:1, defense:0, phys:0, evade:0, fire:1, color:'#947a54'},
  f: {name:'Forest',ko:'숲', cost:2, defense:0, phys:.2, evade:15, fire:1.5, color:'#294f43'},
  v: {name:'Village',ko:'마을', cost:1, defense:0, phys:.1, evade:0, fire:1.25, hpRecovery:.10,mpRecovery:.05, color:'#756b56'},
  t: {name:'Fort',ko:'요새',cost:1,defense:0,phys:.25,evade:0,fire:1,hpRecovery:.15,mpRecovery:.10,color:'#78817d'},
  h: {name:'Recovery Point',ko:'보급 거점',cost:1,defense:0,phys:0,evade:0,fire:1,hpRecovery:.10,mpRecovery:.10,color:'#71a38b'},
  b: {name:'Bridge',ko:'다리', cost:1, defense:0, phys:0, evade:-10, fire:1, color:'#9b815b'},
  m: {name:'Mountain Path',ko:'산길',cost:3,defense:0,phys:.3,evade:10,fire:1,color:'#797e6a'},
  d: {name:'Desert',ko:'사막',cost:2,defense:0,phys:0,evade:-5,fire:1,color:'#baa472'},
  s: {name:'Swamp',ko:'늪',cost:3,defense:0,phys:0,evade:-10,fire:.5,color:'#465f54'},
  w: {name:'Deep Water',ko:'깊은 물',cost:Infinity,defense:0,phys:0,evade:0,fire:0,color:'#31576b'},
  k: {name:'Keep Floor',ko:'성채 바닥',cost:1,defense:0,phys:0,evade:0,fire:1,color:'#7d7a6e'},
  q: {name:'Rampart',ko:'성벽 위',cost:1,defense:0,phys:.25,evade:5,fire:1,color:'#5f6763'},
  x: {name:'Ruin',ko:'벽·폐허', cost:Infinity, defense:0, phys:0, evade:0, fire:0, color:'#434646'},
  // v0.6 ACT II terrain (PROPOSED, D-055 §3): snow, ice bridge, rooftop high ground, city alley.
  n: {name:'Snow',ko:'눈밭',cost:2,defense:0,phys:0,evade:0,fire:.5,color:'#d9e2e6'},
  i: {name:'Ice Bridge',ko:'얼음 다리',cost:1,defense:0,phys:0,evade:-10,fire:.5,color:'#a9c8d6'},
  o: {name:'Rooftop',ko:'지붕',cost:2,defense:2,phys:0,evade:10,fire:1.25,high:true,color:'#9a5a46'},
  l: {name:'Alley',ko:'골목',cost:1,defense:0,phys:0,evade:5,fire:1,color:'#8d8576'},
  // v0.7 (D-068, PROPOSED): the Sacred Flame sanctuary floor (M11) heals like a village.
  z: {name:'Sanctuary',ko:'성소 바닥',cost:1,defense:0,phys:0,evade:0,fire:1,hpRecovery:.10,mpRecovery:.05,color:'#c8b47e'}
};
export const MAP = [
  'ffggrrrrggff',
  'fgvgrrrrgvgf',
  'ggvgrrrrgvgg',
  'grvrgrrgrvrg',
  'grffgrrgffrg',
  'grfggrrggfrg',
  'grgxxrrxxgrg',
  'grgggrrgggrg',
  'grgggrrgggrg',
  'ggggrrrrgggg'
].map(r=>r.split(''));
export const HEROES = [
 {id:'eric',name:'에릭',ko:'에릭',className:'Apprentice Knight',role:'Tank',level:1,hp:42,mp:10,atk:15,def:8,mag:3,res:5,spd:5,mov:2,range:[1,1],skill:'Guard',cost:3,talent:'Indomitable Will',color:'#72b5da',growth:{hp:5,mp:1,atk:2,def:2,mag:0,res:1,spd:1},description:'Guard: 자신에게 사용하는 방어 태세. 다음 아군 턴까지 DEF +3, 인접 동료가 받는 첫 근접 공격을 대신 받습니다.',clue:"Guardian’s Oath",goal:'Guard로 실제 공격을 대신 받아 잠재력의 첫 단서를 발견하세요.'},
 {id:'elina',name:'엘리나',ko:'엘리나',className:'Archer',role:'Ranged DPS',level:2,hp:30,mp:14,atk:16,def:4,mag:3,res:4,spd:9,mov:3,range:[2,3],skill:'Aimed Shot',cost:3,talent:'Hawk Eye',color:'#a2bd6a',growth:{hp:3,mp:2,atk:2,def:1,mag:0,res:1,spd:2},description:'사거리 2–3. 숲과 Village에서 명중 보너스. 인접 적에게는 사격할 수 없습니다.',clue:'Overwatch',goal:'유리한 지형에서 사격하는 경험을 쌓으세요.'},
 {id:'lia',name:'리아',ko:'리아',className:'Apprentice Mage',role:'Magic DPS',level:1,hp:27,mp:24,atk:6,def:3,mag:18,res:8,spd:6,mov:3,range:[1,1],skill:'Fire Bolt',cost:5,talent:'Unstable Mana',color:'#c79ad9',growth:{hp:3,mp:4,atk:0,def:1,mag:3,res:2,spd:1},description:'Fire Bolt는 사거리 1–3, RES를 적용합니다. HP 절반 이하에서는 마법 피해 +4, MP 비용 +1.',clue:'Arcane Territory',goal:'Fire Bolt로 서로 다른 적을 제압하세요.'},
 {id:'sain',name:'세인',ko:'세인',className:'Healer',role:'Support',level:2,hp:31,mp:24,atk:8,def:4,mag:15,res:10,spd:6,mov:3,range:[1,1],skill:'Heal',cost:4,talent:'Gentle Hands',color:'#ebd591',growth:{hp:3,mp:4,atk:1,def:1,mag:2,res:2,spd:1},description:'Heal 사거리 1–2, 자기 회복 가능. 대상 옆의 부상 동료 한 명에게도 4 HP 회복.',clue:'Divine Recall',goal:'치유로 동료를 살리고 Gentle Hands의 연결 회복을 경험하세요.'},
 {id:'kai',name:'카이',ko:'카이',className:'Rogue',role:'Mobility',level:1,hp:32,mp:12,atk:14,def:4,mag:3,res:4,spd:12,mov:4,range:[1,1],skill:'Quick Strike',cost:3,talent:'Shadow Step',color:'#e49a71',growth:{hp:4,mp:2,atk:2,def:1,mag:0,res:1,spd:2},description:'피격 없이 턴을 마치면 다음 턴 MOV +1. Quick Strike는 적 반대편 아군과 협공하면 피해 +6.',clue:'Shadow Exchange',goal:'빠른 이동으로 주민을 구출하고 협공 위치를 만드세요.'}
];
// v0.6 ACT II recruits (D-055 Q2; names, stats and skills PROPOSED). They exist only after joining
// (campaign.roster); ACT I parties stay exactly the five heroes above.
export const RECRUIT_HEROES = [
 {id:'thea',name:'테아',ko:'테아',className:'Lancer',role:'Cavalry',level:1,hp:34,mp:10,atk:15,def:7,mag:2,res:3,spd:8,mov:5,range:[1,1],skill:'Charge',cost:3,talent:'Escort Captain',color:'#7f9fc0',growth:{hp:4,mp:1,atk:2,def:2,mag:0,res:1,spd:1},description:'철왕관 기병 창기사. 돌격: 근접 피해 +4, 3칸 이상 달린 뒤에는 +7에 반격을 받지 않습니다.',clue:'Iron Vanguard',goal:'호위와 돌파로 기병의 길을 여세요.'},
 {id:'dario',name:'다리오',ko:'다리오',className:'Sellsword',role:'Duelist',level:1,hp:33,mp:10,atk:16,def:5,mag:2,res:3,spd:10,mov:3,range:[1,1],skill:'Riposte',cost:3,talent:'Free Blade',color:'#b5525a',growth:{hp:4,mp:1,atk:2,def:1,mag:0,res:1,spd:2},description:'벨마르 용병 검사. 반격 피해 +4. 받아치기: 근접 피해 +2, 다음 아군 턴까지 반격 피해 +8.',clue:'Paid in Full',goal:'반격으로 전선을 버티세요.'},
 // v0.7 (D-068 Q2; name, stats and skill PROPOSED): the Sacred Flame's pilgrim warden.
 {id:'ines',name:'이네스',ko:'이네스',className:'Pilgrim Warden',role:'Protector',level:1,hp:36,mp:10,atk:15,def:8,mag:3,res:6,spd:6,mov:3,range:[1,1],skill:'Sanctuary Oath',cost:3,talent:'Sanctuary',color:'#d8c27a',growth:{hp:5,mp:1,atk:2,def:2,mag:0,res:1,spd:1},description:'성화 순례 수호자. 성역: 곁의 아군이 받는 피해 −2. 성역의 맹세: 근접 공격 후 다음 아군 턴까지 곁의 아군 피해 −4, 자신도 −2.',clue:'Open Gate',goal:'곁의 동료를 지키며 전열을 세우세요.'},
 // v0.10.1 (D-102; stats and skills PROPOSED): Baldrick Roen, the Black Lion, joins after M26 at Lv 19, already awakened (tier 3).
 {id:'baldrick',name:'발드릭',ko:'발드릭',className:'Black Lion',role:'Heavy Cavalry',level:1,hp:44,mp:12,atk:17,def:9,mag:2,res:4,spd:7,mov:5,range:[1,1],skill:'Lion Strike',cost:4,talent:'The Black Lion',color:'#4a4e57',growth:{hp:5,mp:1,atk:2,def:2,mag:0,res:1,spd:1},description:'철왕관의 검은 사자. 사자의 일격: 근접 피해 +6, 반격을 받지 않습니다.',clue:'Lion Banner',goal:'앞에 서서 길을 막고, 사자의 깃발로 곁의 동료를 지키세요.'},
 // v2.0.0 부장 (REFORM_DESIGN §5, Q1 approved, D-115; names and lines PROPOSED). Officers fight with their class's ① skill,
 // promote at camp by level, speak in camp talk, the 열전 and one line of the epilogue; the heroes' story stays as it was.
 {id:'bram',name:'브람',ko:'브람',officer:true,className:'Spearhand',role:'Spear',level:1,hp:39,mp:10,atk:15,def:8,mag:3,res:5,spd:5,mov:4,range:[1,1],skill:'Brace',cost:3,talent:'Old Watch',color:'#8c7a5a',growth:{mp:1},description:'잿빛 마을 자경단장. 아렌의 옛 부하. 방진: 공격 ×1.1, 다음 아군 턴까지 받은 공격에 반격 ×1.5.',clue:'',goal:''},
 {id:'noa',name:'노아',ko:'노아',officer:true,className:'Bowhand',role:'Ranged',level:1,hp:30,mp:12,atk:15,def:4,mag:3,res:4,spd:9,mov:4,range:[2,3],skill:'Aimed Shot',cost:3,talent:'Village Hunter',color:'#7aa05a',growth:{mp:2},description:'마을의 젊은 사냥꾼. 엘리나와 활 솜씨를 겨룬다. 조준 사격: 명중 +18, 피해 ×1.15.',clue:'',goal:''},
 {id:'marta',name:'마르타',ko:'마르타',officer:true,className:'Shieldhand',role:'Protector',level:1,hp:37,mp:10,atk:15,def:8,mag:3,res:5,spd:4,mov:3,range:[1,1],skill:'Shield Oath',cost:3,talent:'Forge Arm',color:'#a8714a',growth:{mp:1},description:'마을 대장장이. 망치와 문짝 방패. 방패의 맹세: 곁의 동료가 받는 피해 −15%, 맹세 후 −30%.',clue:'',goal:''},
 {id:'rowell',name:'로웰',ko:'로웰',officer:true,className:'Rider',role:'Cavalry',level:1,hp:36,mp:10,atk:16,def:7,mag:3,res:4,spd:8,mov:6,range:[1,1],skill:'Charge',cost:3,talent:'Border Rider',color:'#6a7fa0',growth:{mp:1},description:'버려진 성채에서 만난 탈영 국경 기병. 돌격: 피해 ×1.25, 3칸 이상 달리면 ×1.45에 반격 없음.',clue:'',goal:''},
 ...NEW_HEROES // v2.1 (D-118): later tavern hires and the ACT I rescued hero
];
export const CORE_HERO_IDS = HEROES.map(h=>h.id);
export const ALL_HEROES = [...HEROES,...RECRUIT_HEROES];
export const heroDef = id=>ALL_HEROES.find(h=>h.id===id);
// The heroes a campaign fields: the five, then recruits in joining order.
export const partyIds = campaign=>[...CORE_HERO_IDS,...(campaign?.roster||[]).filter(id=>RECRUIT_HEROES.some(h=>h.id===id))];
export const partyHeroes = campaign=>partyIds(campaign).map(heroDef);
export const DEPLOYMENTS = {recommended:[[5,8],[3,8],[6,8],[6,9],[8,8]],assault:[[5,7],[3,7],[6,7],[5,8],[8,7]],defense:[[5,7],[4,8],[6,8],[5,9],[7,8]]};
export const ENEMIES = [
 {id:'b1',name:'룩',kind:'bandit',x:3,y:5,hp:24,atk:11,def:3,res:2,spd:5,mov:3,range:[1,1]},
 {id:'b2',name:'바르',kind:'bandit',x:8,y:5,hp:26,atk:11,def:4,res:2,spd:4,mov:3,range:[1,1]},
 {id:'a1',name:'애시 보우',kind:'archer',x:6,y:4,hp:22,atk:10,def:2,res:3,spd:7,mov:3,range:[2,3]},
 {id:'b3',name:'신더',kind:'bandit',x:1,y:2,hp:25,atk:10,def:3,res:2,spd:5,mov:3,range:[1,1]},
 {id:'boss',name:'가르 — 산적 두목',kind:'captain',x:6,y:1,hp:62,atk:15,def:7,res:4,spd:6,mov:3,range:[1,1]}
];
export const REINFORCEMENTS = [
 {id:'r1',name:'북쪽 습격대원',kind:'bandit',x:0,y:0,hp:23,atk:10,def:3,res:2,spd:5,mov:3,range:[1,1]},
 {id:'r2',name:'북쪽 궁수',kind:'archer',x:11,y:0,hp:21,atk:10,def:2,res:3,spd:7,mov:3,range:[2,3]}
];
export const CIVILIANS = [{id:'c1',name:'미라',x:2,y:3},{id:'c2',name:'토마스',x:9,y:3}];
export const BALANCE = {xpLevel:100,attackXP:22,killXP:28,healXP:24,rescueXP:45,guardXP:30,clearXP:35,parTurn:8,civilianThreatTurn:5,civilianHP:28};

// Explicit profiles: future advancement data only, no promotion UI.
export const CLASS_MOVEMENT={knight:{base:2,profile:'infantry'},archer:{base:3,profile:'infantry'},mage:{base:3,profile:'infantry'},healer:{base:3,profile:'infantry'},rogue:{base:4,profile:'rogue'},mountedKnight:{base:5,profile:'cavalry'},swordsman:{base:3,profile:'infantry'},warden:{base:3,profile:'infantry'}};
export const HERO_CLASS={eric:'knight',elina:'archer',lia:'mage',sain:'healer',kai:'rogue',thea:'mountedKnight',dario:'swordsman',ines:'warden',baldrick:'mountedKnight'};
export const TERRAIN_COSTS={infantry:{r:1,g:1,v:1,b:1,f:2,m:3,d:2,s:3,n:2,i:1,o:2,l:1},rogue:{r:1,g:1,v:1,b:1,f:1,m:1,d:1,s:2,n:1,i:1,o:1,l:1},ranger:{r:1,g:1,v:1,b:1,f:1,m:3,d:2,s:3,n:2,i:1,o:2,l:1},cavalry:{r:1,g:1,v:1,b:1,f:1,m:Infinity,d:1,s:Infinity,n:2,i:2,o:Infinity,l:2}};
export const PROFILE_KO={infantry:'보병',rogue:'도적',cavalry:'기병',ranger:'레인저'};
