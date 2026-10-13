export const VERSION = '0.1.1';
export const SCHEMA = 1;
export const WIDTH = 12, HEIGHT = 10;
export const TERRAIN = {
  g: {name:'Grass', cost:1, defense:0, evade:0, color:'#52624a'},
  r: {name:'Road', cost:1, defense:0, evade:0, color:'#947a54'},
  f: {name:'Forest', cost:2, defense:1, evade:12, color:'#294f43'},
  v: {name:'Village', cost:1, defense:2, evade:0, color:'#756b56'},
  x: {name:'Ruin', cost:Infinity, defense:0, evade:0, color:'#434646'}
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
 {id:'eric',name:'Eric',ko:'에릭',className:'Apprentice Knight',role:'Tank',level:1,hp:42,mp:10,atk:15,def:8,mag:3,res:5,spd:5,mov:4,range:[1,1],skill:'Guard',cost:3,talent:'Indomitable Will',color:'#72b5da',growth:{hp:5,mp:1,atk:2,def:2,mag:0,res:1,spd:1},description:'최전선에서 버티며 Guard로 인접 동료의 첫 근접 피해를 대신 받습니다.',clue:"Guardian’s Oath",goal:'Guard로 실제 공격을 대신 받아 잠재력의 첫 단서를 발견하세요.'},
 {id:'elina',name:'Elina',ko:'엘리나',className:'Archer',role:'Ranged DPS',level:2,hp:30,mp:14,atk:16,def:4,mag:3,res:4,spd:9,mov:4,range:[2,3],skill:'Aimed Shot',cost:3,talent:'Hawk Eye',color:'#a2bd6a',growth:{hp:3,mp:2,atk:2,def:1,mag:0,res:1,spd:2},description:'사거리 2–3. 숲과 Village에서 명중 보너스. 인접 적에게는 사격할 수 없습니다.',clue:'Overwatch',goal:'유리한 지형에서 사격하는 경험을 쌓으세요.'},
 {id:'lia',name:'Lia',ko:'리아',className:'Apprentice Mage',role:'Magic DPS',level:1,hp:27,mp:24,atk:6,def:3,mag:18,res:8,spd:6,mov:3,range:[1,1],skill:'Fire Bolt',cost:5,talent:'Unstable Mana',color:'#c79ad9',growth:{hp:3,mp:4,atk:0,def:1,mag:3,res:2,spd:1},description:'Fire Bolt는 사거리 1–3, RES를 적용합니다. HP 절반 이하에서는 마법 피해 +4, MP 비용 +1.',clue:'Arcane Territory',goal:'Fire Bolt로 서로 다른 적을 제압하세요.'},
 {id:'sain',name:'Sain',ko:'사인',className:'Healer',role:'Support',level:2,hp:31,mp:24,atk:8,def:4,mag:15,res:10,spd:6,mov:4,range:[1,1],skill:'Heal',cost:4,talent:'Gentle Hands',color:'#ebd591',growth:{hp:3,mp:4,atk:1,def:1,mag:2,res:2,spd:1},description:'Heal 사거리 1–2, 자기 회복 가능. 대상 옆의 부상 동료 한 명에게도 4 HP 회복.',clue:'Divine Recall',goal:'치유로 동료를 살리고 Gentle Hands의 연결 회복을 경험하세요.'},
 {id:'kai',name:'Kai',ko:'카이',className:'Rogue',role:'Mobility',level:1,hp:32,mp:12,atk:14,def:4,mag:3,res:4,spd:12,mov:5,range:[1,1],skill:'Quick Strike',cost:3,talent:'Shadow Step',color:'#e49a71',growth:{hp:4,mp:2,atk:2,def:1,mag:0,res:1,spd:2},description:'피격 없이 턴을 마치면 다음 턴 MOV +1. Quick Strike는 적 반대편 아군과 협공하면 피해 +6.',clue:'Shadow Exchange',goal:'빠른 이동으로 주민을 구출하고 협공 위치를 만드세요.'}
];
export const DEPLOYMENTS = {recommended:[[5,8],[3,8],[6,8],[6,9],[8,8]],assault:[[5,7],[3,7],[6,7],[5,8],[8,7]],defense:[[5,7],[4,8],[6,8],[5,9],[7,8]]};
export const ENEMIES = [
 {id:'b1',name:'Rook',kind:'bandit',x:3,y:5,hp:24,atk:11,def:3,res:2,spd:5,mov:3,range:[1,1]},
 {id:'b2',name:'Varr',kind:'bandit',x:8,y:5,hp:26,atk:11,def:4,res:2,spd:4,mov:3,range:[1,1]},
 {id:'a1',name:'Ash Bow',kind:'archer',x:6,y:4,hp:22,atk:10,def:2,res:3,spd:7,mov:3,range:[2,3]},
 {id:'b3',name:'Cinder',kind:'bandit',x:1,y:2,hp:25,atk:10,def:3,res:2,spd:5,mov:3,range:[1,1]},
 {id:'boss',name:'Garr — Bandit Captain',kind:'captain',x:6,y:1,hp:62,atk:15,def:7,res:4,spd:6,mov:3,range:[1,1]}
];
export const REINFORCEMENTS = [
 {id:'r1',name:'North Raider',kind:'bandit',x:0,y:0,hp:23,atk:10,def:3,res:2,spd:5,mov:3,range:[1,1]},
 {id:'r2',name:'North Bow',kind:'archer',x:11,y:0,hp:21,atk:10,def:2,res:3,spd:7,mov:3,range:[2,3]}
];
export const CIVILIANS = [{id:'c1',name:'Mira',x:2,y:3},{id:'c2',name:'Tomas',x:9,y:3}];
export const BALANCE = {xpLevel:100,attackXP:22,killXP:28,healXP:24,rescueXP:45,guardXP:30,clearXP:35,parTurn:8,civilianThreatTurn:5,civilianHP:28};
