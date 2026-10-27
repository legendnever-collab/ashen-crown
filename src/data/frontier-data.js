// Original local scenes/NPC details are PROPOSED content within approved chronology.
import {ART_HUBS} from './hubs-v05.js';
export const GEAR={
 ironBlade:{name:'Tempered Sword',icon:'⚔',slot:'weapon',heroes:['eric'],price:65,bonus:{atk:2},upgrade:{atk:1},description:'에릭의 전열 유지 · ATK +2'},
 huntingBow:{name:'Hunting Bow',icon:'➶',slot:'weapon',heroes:['elina'],price:65,bonus:{hit:8},upgrade:{atk:1},description:'엘리나의 안정적인 사격 · HIT +8'},
 longbow:{name:'Longbow',icon:'➶',slot:'weapon',heroes:['elina'],price:80,bonus:{atk:2},upgrade:{hit:4},description:'사거리는 유지하고 위력을 높임 · ATK +2'},
 crystalStaff:{name:'Crystal Staff',icon:'✦',slot:'weapon',heroes:['lia'],price:70,bonus:{mag:2},upgrade:{mag:1},description:'리아의 Fire Bolt · MAG +2'},
 mercyStaff:{name:'Mercy Staff',icon:'✧',slot:'weapon',heroes:['sain'],price:65,bonus:{mag:2},upgrade:{res:1},description:'세인의 치유 · MAG +2'},
 daggers:{name:'Balanced Daggers',icon:'⚔',slot:'weapon',heroes:['kai'],price:65,bonus:{atk:1,spd:1},upgrade:{atk:1},description:'카이의 우회 공격 · ATK/SPD +1'},
 heavyShield:{name:'Heavy Shield',icon:'▣',slot:'armor',heroes:['eric'],price:70,bonus:{def:2},upgrade:{res:1},description:'전열과 Guard의 생존력 · DEF +2'},
 lightShield:{name:'Light Shield',icon:'◇',slot:'armor',heroes:['eric'],price:75,bonus:{mov:1},upgrade:{def:1},description:'에릭의 기동성 · MOV +1'},
 travelCloak:{name:'Travel Cloak',icon:'♜',slot:'armor',heroes:['elina','lia','sain','kai'],price:55,bonus:{res:2},upgrade:{def:1},description:'가벼운 보호 · RES +2'},
 trailBoots:{name:'Trail Boots',icon:'⌁',slot:'accessory',heroes:['eric','elina','lia','sain','kai'],price:85,bonus:{mov:1},upgrade:{res:1},description:'구조와 우회에 유용 · MOV +1'},
 focusCharm:{name:'Focus Charm',icon:'✦',slot:'accessory',heroes:['eric','elina','lia','sain','kai'],price:45,bonus:{res:1},upgrade:{def:1},description:'신중한 대비 · RES +1'}
};
// v0.8.0 (D-073 Q4; PROPOSED): 13 tools. Recovery, cure and buff tools work on the user or an adjacent ally; throwables
// fly 2–3 tiles (three per battle). `unlock` = the mission whose clear first puts the tool on sale (0: from the start;
// null: never sold). Specialty tools are first sold in their home town and from then on by every quartermaster.
export const TOOLS={
 medium:{name:'중급 회복약',icon:'✚',price:30,sell:12,description:'자신 또는 인접 아군 HP +30 · 행동 1회',stat:'hp',amount:30,unlock:0},
 ether:{name:'에테르',icon:'✦',price:40,sell:16,description:'자신 또는 인접 아군 MP +8 · 행동 1회',stat:'mp',amount:8,unlock:0},
 ward:{name:'수호 강장제',icon:'◇',price:35,sell:14,description:'자신 또는 인접 아군 다음 Player Phase까지 DEF/RES +2 · 행동 1회',stat:'ward',amount:2,unlock:0},
 herb:{name:'약초',icon:'❦',price:15,sell:6,description:'자신 또는 인접 아군 HP +15 · 행동 1회',stat:'hp',amount:15,unlock:0},
 antidote:{name:'해독초',icon:'❧',price:20,sell:8,description:'자신 또는 인접 아군 독 해제 · 행동 1회',stat:'cure',unlock:0},
 net:{name:'그물',icon:'⌗',price:50,sell:20,description:'투척 2–3칸 · 적 1명 [속박] 100% (지휘관 50%, 1턴)',stat:'throw',unlock:1,home:'국경 진영'},
 drum:{name:'전고',icon:'◍',price:70,sell:28,description:'자신과 인접 아군 다음 아군 턴까지 ATK +3 · 행동 1회',stat:'buff',unlock:6,home:'철관성 성하 마을'},
 caltrops:{name:'마름쇠',icon:'✣',price:45,sell:18,description:'투척 2–3칸 · 빈칸과 그 옆 1칸에 설치 · 밟은 적은 멈추고 6 피해',stat:'throw',unlock:6,home:'철관성 성하 마을'},
 clarity:{name:'청심향',icon:'❂',price:35,sell:14,description:'자신 또는 인접 아군 혼란·속박·침묵 해제 · 행동 1회',stat:'cure',unlock:8,home:'벨마르'},
 smoke:{name:'연막탄',icon:'☁',price:60,sell:24,description:'투척 2–3칸 · 십자 5칸 · 다음 적 턴까지 그 안의 아군을 노리는 명중 −30',stat:'throw',unlock:8,home:'벨마르'},
 bomb:{name:'화약 폭탄',icon:'✸',price:110,sell:44,description:'투척 2–3칸 · 십자 5칸의 적에게 16 피해(DEF 절반 적용) · 풀·숲에 불',stat:'throw',unlock:8,home:'철관성 성하 마을'},
 bewilder:{name:'혼란 가루',icon:'✺',price:90,sell:36,description:'투척 2–3칸 · 적 1명 [혼란] 75% (지휘관 37%, 1턴)',stat:'throw',unlock:9,home:'벨마르'},
 elixir:{name:'엘릭서',icon:'✧',price:0,sell:60,description:'자신 또는 인접 아군 HP 전부 회복 · 상태이상 해제 · 판매하지 않음',stat:'hp',unlock:null}
};
// Tools on sale for this campaign (by missions cleared).
export const toolStock=campaign=>Object.keys(TOOLS).filter(id=>{const u=TOOLS[id].unlock;return u===0||u!=null&&(campaign?.completed||[]).includes(u);});
export const RECRUITS={lia:{characterId:'lia',availability:1,requiredFlag:null,personalEvent:'동료가 될 이유',relationshipRequirement:null,initialEquipment:'starter',initialGrowth:'existing',startingLevel:1,campPlacement:[10,5]},sain:{characterId:'sain',availability:1,requiredFlag:null,personalEvent:'구호대의 약속',relationshipRequirement:null,initialEquipment:'starter',initialGrowth:'existing',startingLevel:1,campPlacement:[3,6]},kai:{characterId:'kai',availability:1,requiredFlag:null,personalEvent:'돌아올 곳',relationshipRequirement:null,initialEquipment:'starter',initialGrowth:'existing',startingLevel:1,campPlacement:[12,8]}};
export const HUBS={
 village:{name:'Ashen Village · 잿빛 마을',tone:'village',width:16,height:16,spawn:[7,7],
 buildings:[{x:1,y:1,w:4,h:3,label:'BLACKSMITH',type:'forge'},{x:10,y:1,w:4,h:3,label:'ITEM SHOP',type:'shop'},{x:1,y:8,w:3,h:3,label:'BARRACKS',type:'inn'},{x:11,y:8,w:4,h:3,label:'WAR ROOM',type:'warroom'}],
 places:[{id:'square',name:'Village Square',x:7,y:7},{id:'forge',name:'Blacksmith',x:3,y:4,action:'weapon'},{id:'shop',name:'Item Shop',x:12,y:4,action:'item'},{id:'inn',name:'Inn / Barracks',x:3,y:7},{id:'depot',name:'Supply Depot',x:8,y:3},{id:'council',name:'War Room',x:12,y:7,action:'council'},{id:'exit',name:'Village Exit',x:7,y:10,action:'council'}],
 npcs:[{id:'eric',name:'에릭 · 장비 점검',x:5,y:5,kind:'hero'},{id:'elina',name:'엘리나 · 경계',x:10,y:7,kind:'hero'},{id:'lia',name:'리아 · 기록 조사',x:9,y:4,kind:'hero'},{id:'sain',name:'세인 · 구호',x:5,y:8,kind:'hero'},{id:'kai',name:'카이 · 길목 관찰',x:13,y:6,kind:'hero'},{id:'elder',name:'마을 촌장',x:6,y:3},{id:'smith',name:'대장장이',x:2,y:4,service:'weapon'},{id:'merchant',name:'도구 상인',x:13,y:4,service:'item'},{id:'refugee',name:'피난민',x:7,y:8},{id:'guard',name:'경비병',x:11,y:6} ]},
 camp:{name:'Border Camp · 변경 야영지',tone:'camp',width:20,height:24,spawn:[7,7],
 buildings:[{x:1,y:1,w:4,h:3,label:'FIELD FORGE',type:'forge'},{x:10,y:1,w:4,h:3,label:'QUARTERMASTER',type:'shop'},{x:1,y:8,w:3,h:3,label:'TRIAGE',type:'inn'},{x:11,y:8,w:4,h:3,label:'COMMAND',type:'warroom'}],
 places:[{id:'square',name:'Campfire',x:7,y:7},{id:'forge',name:'Field Forge',x:3,y:4,action:'weapon'},{id:'shop',name:'Quartermaster',x:12,y:4,action:'item'},{id:'inn',name:'Triage Tent',x:3,y:7},{id:'depot',name:'Records Tent',x:8,y:3},{id:'council',name:'Command Tent',x:12,y:7,action:'council'},{id:'exit',name:'Departure',x:7,y:10,action:'council'}],
 npcs:[{id:'eric',name:'에릭 · 방패 점검',x:5,y:5,kind:'hero'},{id:'elina',name:'엘리나 · 정찰',x:11,y:6,kind:'hero'},{id:'lia',name:'리아 · 기록',x:10,y:5,kind:'hero'},{id:'sain',name:'세인 · 부상자',x:3,y:6,kind:'hero'},{id:'kai',name:'카이 · 우회로',x:12,y:8,kind:'hero'},{id:'elder',name:'진영 관리인',x:6,y:3},{id:'smith',name:'야전 대장장이',x:2,y:4,service:'weapon'},{id:'merchant',name:'보급관',x:13,y:4,service:'item'},{id:'refugee',name:'피난 주민',x:4,y:6},{id:'guard',name:'보초',x:13,y:7}]}
};
export const FRONTIER_SCENES={
 'pre:1':[['aren','에릭, 아침 종 울리기 전에 한 바퀴 돌자. 병사들은 좀 어때?'],['eric','다들 무사하다. 난 방패 고치는 중이었고. …오늘은 좀 조용했으면 좋겠군.'],['aren','조용할지는 정찰 얘기를 들어 봐야 알겠지. 엘리나?'],['elina','북쪽 숲에 낯선 발자국이 있어요. 습격이라고 하기엔… 아직 일러요.','concerned'],['aren','이르다고 넘길 일은 아니다. 주민들이 겁먹지 않게 조용히 확인해 줘. …에릭, 마을을 부탁한다.','determined'],['eric','맡겨. 동료들한테도 한마디씩 해 두지.'],['lia','에릭! 마침 잘 왔어요. 기록 보던 중이었는데, 떠나기 전에 잠깐 얘기할 수 있어요?'],['sain','리아 얘기 끝나면 저도요. 피난민분들이 쉬고 계신데 약이 모자라서요.','concerned'],['kai','다들 할 말이 많네. 난 동쪽 길목에 있을 테니까, 볼일 있으면 그리로 와.'],['eric','알았다. 차례로 둘러보지. 정찰 보고는 리아한테 듣고.'],['aren','서두르지 마라. 빠뜨린 게 없는지… 천천히 보자.']],
 'pre:2':[['aren','불은 껐다. 그런데 군용 인장 찍힌 상자가 남았어. …누가 보냈는지는 아직 모른다.'],['elina','그걸 아는 놈들이 숲으로 달아났어요. 지금이면 꼬리를 잡을 수 있어요.','determined'],['sain','잡는다면… 살려서 데려와 주세요. 죽은 사람은 아무 말도 해 주지 않아요. 살아 있는 증언을 얻을 기회를 주세요.'],['elina','마을에 불 지른 사람들한테 자비부터 얘기하는 거예요?','concerned'],['sain','자비가 아니라 증언이에요. 그리고… 그 사람들도 굶주렸다고 했잖아요.'],['aren','둘 다 맞다. 용서하자는 게 아니다. 명령을 내린 자를 찾자는 거지.'],['kai','생포할 거면 방법은 있어. 도주 대장 HP를 반 아래로 깎고 옆에 붙으면 돼. 꼭 할 필요는 없지만, 듣는 얘기가 달라질걸.'],['kai','놈들은 북쪽 출구로 곧장 갈 거야. 난 옆길로 먼저 갈게.'],['eric','혼자 앞서가진 마, 카이. 숲에서 서로 떨어지면 위험하다. 방패랑 활 자리부터 정하자.','determined'],['lia','자리 정하는 건 제가 도울게요! 진술이랑 현장 흔적은 따로 적어서 맞춰 보고요.'],['aren','좋다. 필요한 장비가 있으면 지금 챙겨라. 살아서 돌아오는 것까지가 작전이다. 에릭, 준비되면 리아와 작전을 맞춰 봐라.']],
 'pre:3':[['sain','다리 앞에 피난민분들이 모였어요. 부상자분들은 혼자서는 못 건너요.'],['eric','그렇다고 좁은 다리에 병력을 몰면 퇴로까지 막힌다. 길부터 나누자.','concerned'],['kai','그럼 난 옆으로 돌아서 북쪽에서 거들게. 대신 에릭, 방패 하나로 다 받으려고 하진 마.'],['eric','알았다. 그동안 세인은 내가 지킨다. 네가 돌아올 길도 남겨 두지.'],['elina','돌아올 길이라면 뒤를 봐야 해요. 추격병은 뒤에서 와요. 구조가 끝나도 마지막 한 명이 남아 있으면 위험해요.','concerned'],['lia','그 추격병은 제가 맡을게요! 불길을 좁은 길목에 몰아 두면 주민들이 움직일 틈이 생겨요. 화공은 이럴 때 쓰는 거죠!','determined'],['aren','좋은 생각이다. 주민은 곁에 서 있으면 스스로 북쪽으로 걷는다. 옆에 붙어서 직접 구해도 된다.'],['sain','치료가 급한지 구조가 급한지는… 현장에서 제가 판단할게요.'],['aren','맡기지. 정리하면, 열 턴 안에 주민을 한 명 이상 구하고, 살아 있는 전원이 북쪽 세 줄 안전 구역으로 빠진다.'],['eric','기본 장비로도 해낼 수 있다. 여유 있으면 이동 장비나 회복 도구도 보자.'],['aren','그래. 이번엔… 명령서보다 사람 얼굴을 먼저 보겠다. 같이 준비하자.','determined']],
 raid:[['elina','북쪽에서 연기가 올라요! 가르 패거리가 마을 안까지 들어왔어요!','concerned'],['eric','엘리나가 본 발자국이 그거였군. 준비된 다섯을 부른다. 더 지체할 시간 없다.','determined'],['aren','좋다. 주민 둘을 구하고 가르를 막는다. 배치부터 확인해.'],['sain','배치하실 때, 사람을 구할 길만은 남겨 주세요.'],['aren','그 길도 작전에 넣는다. 리아와 보고를 맞춰라. 길이 정해지면 바로 출발한다.']],
 'after:1':[['elder','둘 다 무사히 돌아왔구먼. 불탄 집보다 돌아온 얼굴부터 세겠네.'],['sain','어르신, 다치신 분들은 여기서 쉬게 해 주세요. 제가 돌볼게요.'],['lia','그 상자 말인데요, 왕실 군용 인장이 확실해요. 근데 누가 전달했는지는 기록이 텅 비어 있어요.','determined'],['aren','인장은 적어 둬라. 상자를 보낸 자는… 아직 모른다.'],['eric','모르는 건 쫓아가서 확인하면 된다. 그 전에 장비부터 다시 보자. 돌아올 곳이 있으면 다음 출전도 버틸 수 있어.']],
 'after:2':[['elina','숲 흔적은 정리했어요. 결론은 서두르지 않을 거예요.'],['sain','고마워요, 엘리나. 책임을 묻는 일과 생명을 지키는 일, 둘 다 할 수 있어요.'],['kai','좋은 얘기 중에 미안한데, 이제 다리가 문제야. 피난민이 몰리기 전에 길을 터야 해.','determined'],['aren','카이 말대로다. 이 진영에서 다음 구조 작전을 준비한다.']],
 'after:3':[['sain','오늘 돌아온 분들 이름을 적어 둘게요. 돌아오지 못한 이름도요.'],['eric','카이, 네가 고른 길 덕에 다 돌아왔다.','concerned'],['kai','방패 뒤에 누가 버티고 있을 거라고 믿었으니까 고른 길이지. …이제 좀 알 것 같아.','determined'],['aren','믿고 맡긴다라… 잿빛 밤엔 명령서만 쥐고 있었다. 이번엔 너희와 함께 사람을 보고 판단했다.'],['lia','그 판단, 다음에도 필요할 거예요. 군용 물자 흔적이 아직 남아 있거든요. 버려진 성채에 가면 기록을 찾을 수 있을지도 몰라요!'],['aren','성채 얘기는 내일 하자. 지금은 쉬자. 다음 길은 모두의 얘기를 듣고 정한다.','concerned'],['eric','그래. 같이 돌아온 사람부터 챙기자. 성채 얘기는 그다음이다.','determined']],
 'after:3:quiet':[['sain','오늘 돌아온 분들 이름을 적어 둘게요. 돌아오지 못한 이름도요.'],['eric','방식은 달랐지만 같이 길을 지켰다. 아직 맞춰 갈 게 있겠지.','concerned'],['kai','맞춰 가야지. 그래도 돌아온 사람이 있잖아. 다음에도 길은 찾아보지 뭐.','determined'],['aren','돌아온 사람이라… 잿빛 밤엔 명령서만 쥐고 있었다. 이번엔 너희와 함께 사람을 보고 판단했다.'],['lia','그 판단, 다음에도 필요할 거예요. 군용 물자 흔적이 아직 남아 있거든요. 버려진 성채에 가면 기록을 찾을 수 있을지도 몰라요!'],['aren','성채 얘기는 내일 하자. 지금은 쉬자. 다음 길은 모두의 얘기를 듣고 정한다.','concerned'],['eric','그래. 같이 돌아온 사람부터 챙기자. 성채 얘기는 그다음이다.','determined']]
};
// Authored Korean copy; do not introduce facts about the crown or faction responsibility.
export const NPC_LINES={
 eric:['방패는 혼자 버티라고 드는 게 아니야. 같이 돌아오자는 약속이지.','숲에선 길목을 막고, 다리에선 세인과 주민이 지나갈 자리를 남긴다.'],
 elina:['숲에서 낯선 발자국을 찾았어요. 준비 끝나면 경계 보고 모아 둘게요.','생포하려면 도주로부터 막아요. 아, 활은 바로 옆 적한텐 못 쏴요. 거리 두세요.'],
 lia:['봉인 흔적을 쫓다가 이 마을에 머물게 됐어요. 그래도 기록보다는 사람이 먼저겠죠?','에릭, 작전은 제가 짜 볼게요! 대신 위험한 걸 보면 서로 숨기지 말아요.'],
 sain:['피난길에 만난 분들을 돌보고 있어요. 명령보다 먼저, 다친 손부터 잡겠습니다.','곁에서 함께 돕고 싶어요. 칼을 내려놓는다면, 적이라도 치료하겠습니다.'],
 kai:['그냥 지나가던 길이야. 근데 이 길에서 사라지는 사람이 더 늘면 곤란하거든.','앞길은 내가 알아. 오늘은… 혼자 안 가고 너희랑 같이 가지.'],
 elder:['집이야 다시 지으면 되네. 돌아올 사람들이 먼저지.'],smith:['무거운 건 잘 막고, 가벼운 건 잘 뛰지. 한번 들어 볼 텐가?'],merchant:['많이 산다고 다 지킬 수 있는 건 아니에요. 도구는 여섯 개까지만 들고 가세요.'],refugee:['다리 건너에도 기다리는 사람이 있어요. 길이 열리면 꼭 알려 주세요.'],guard:['에릭 경, 경계 보고 들어왔습니다. 리아 님은 광장 동쪽 작전 탁자에 계십니다.']
};

export const INTERIORS={weapon:{name:'Blacksmith · 무기점 내부',tone:'interior',width:12,height:10,spawn:[5,8],service:'weapon',buildings:[{x:3,y:3,w:6,h:1,type:'counter',label:'COUNTER'},{x:1,y:1,w:2,h:3,type:'furnace',label:'FORGE'},{x:9,y:1,w:2,h:4,type:'rack',label:'WEAPONS'}],npcs:[{id:'smith',name:'대장장이 · 장비 거래',x:5,y:4,service:'weapon'}],places:[{id:'exit',name:'마을로 나가기',x:5,y:8,action:'exit'}]},item:{name:'Item Shop · 도구점 내부',tone:'interior',width:10,height:12,spawn:[4,10],service:'item',buildings:[{x:2,y:4,w:6,h:1,type:'counter',label:'COUNTER'},{x:1,y:1,w:1,h:3,type:'shelf',label:'HERBS'},{x:8,y:1,w:1,h:3,type:'shelf',label:'POTIONS'}],npcs:[{id:'merchant',name:'도구 상인 · 보급 거래',x:4,y:5,service:'item'}],places:[{id:'exit',name:'마을로 나가기',x:4,y:10,action:'exit'}]}};
for(const h of Object.values(HUBS)){h.npcs=h.npcs.filter(n=>!n.service);h.buildings.push(...(h.tone==='village'?[{x:1,y:12,w:3,h:2,type:'residence',label:'HOME'},{x:10,y:12,w:4,h:2,type:'depot',label:'SUPPLY'}]:[{x:2,y:13,w:4,h:3,type:'inn',label:'BARRACKS'},{x:12,y:14,w:5,h:3,type:'warroom',label:'OPERATIONS'},{x:8,y:19,w:3,h:3,type:'depot',label:'SUPPLY'}]));}

// One tile anchor drives painted threshold, solid wall, valid approach and exit return.
for(const hub of Object.values(HUBS)){
 for(const [type,id,tileX,tileY,action] of [['forge','forge',3,3,'weapon'],['shop','shop',12,3,'item'],['warroom','council',12,10,'council']]){
  const b=hub.buildings.find(b=>b.type===type),p=hub.places.find(p=>p.id===id);
  b.buildingId=id;b.entrance={tileX,tileY,approachDirection:'north',triggerType:'interact'};
  b.returnPoint={tileX,tileY:tileY+1};b.interiorScene=action;
  Object.assign(p,{x:b.returnPoint.tileX,y:b.returnPoint.tileY,entrance:b.entrance,buildingId:id});
 }
}

// Stable eric battle entity becomes the sole exploration actor. Aren remains commander.
for(const hub of Object.values(HUBS))for(const n of hub.npcs)if(n.id==='eric')Object.assign(n,{id:'aren',name:'아렌 · 군단장',kind:'commander'});
NPC_LINES.aren=['에릭, 병사들 상태 좀 봐 줘. …이번 판단도 같이 책임지겠다.','명령서는 내가 확인하지. 넌 동료들이 돌아올 길을 부탁한다.'];

// D-038: Lia doubles as the legion's strategist and stands beside her war table. The table keeps the
// 'advisor' id that drives the council (2026-10-18: the separate staff aide was removed — one Lia on the map).
for(const hub of Object.values(HUBS)){
 hub.npcs.push({id:'advisor',name:'리아의 작전 탁자 · 작전 회의',x:8,y:7,kind:'advisor'});
 Object.assign(hub.npcs.find(n=>n.id==='lia'),{name:'리아 · 군사',x:9,y:7});
 const p=hub.places.find(p=>p.id==='council'),b=hub.buildings.find(b=>b.buildingId==='council');
 p.name='Commander Quarters';delete p.action;delete p.entrance;
 b.label='COMMAND QUARTERS';delete b.entrance;delete b.returnPoint;delete b.interiorScene;
 delete hub.places.find(p=>p.id==='exit').action;
 hub.places.push({id:'advisor',name:'작전 탁자 · 광장 동쪽',x:7,y:7});
}
export const ADVISOR_BRIEFINGS={
 1:[['lia','에릭, 북쪽 경계에서 급보예요!'],['eric','주민부터 지킨다. 적은 어디 있지?'],['lia','가르 패거리가 마을로 오고 있어요. 광장에서 병력을 모아 맞서요!']],
 2:[['lia','습격자들이 북쪽 숲길로 달아났어요.'],['eric','숲에서 서로 떨어지지 않게 대열부터 정하자.'],['lia','대장의 퇴로는 북쪽이에요. 생포하면 보급로를 캐물을 수 있어요!']],
 3:[['lia','다리 앞에 피난민분들이 모였어요. 뒤에선 추격병이 다가오고 있고요.'],['eric','세인이 구조할 길을 연다. 철수로부터 확인하지.'],['lia','열 턴 안에 주민을 한 명 이상 구하고, 살아 있는 장수는 전원 북쪽 안전 구역으로 빠져야 해요.']]
};

// v0.4 benchmark pass: every ordinary building can be entered. Interiors are original
// templates; chests are once-per-mission finds (see economy op 'chest').
const prop=(type,x,y,w=1,h=1,label='')=>({type,x,y,w,h,label});
const roomExit=(x,y)=>({id:'exit',name:'밖으로 나가기',x,y,action:'exit'});
function room(name,width,height,props,chests){const exitX=Math.floor(width/2);return {name,tone:'interior',width,height,spawn:[exitX,height-2],generic:true,buildings:[...props,...chests.map(([id,x,y])=>({...prop('chest',x,y),chestId:id}))],npcs:[],places:[roomExit(exitX,height-2),...chests.map(([id,x,y])=>({id:`chest:${id}`,name:'보물상자',x,y,action:'chest',chestId:id}))]};}
Object.assign(INTERIORS,{
 house:room('민가 · 내부',9,8,[prop('bed',1,1,2,1),prop('table',4,2,2,1),prop('hearth',6,1,2,1),prop('barrel',1,4)],[['a',7,4]]),
 barracks:room('병영 · 내부',11,8,[prop('bunk',1,1,2,1),prop('bunk',4,1,2,1),prop('bunk',7,1,2,1),prop('table',4,4,3,1),prop('barrel',9,4)],[['a',1,4],['b',9,1]]),
 store:room('창고 · 내부',10,9,[prop('crate',1,1,2,2),prop('barrel',4,1),prop('barrel',5,1),prop('crate',7,1,2,1),prop('crate',1,5),prop('barrel',8,5)],[['a',8,3],['b',3,4]]),
 quarters:room('지휘 막사 · 내부',10,8,[prop('maptable',3,2,4,2),prop('shelf',1,1,1,3),prop('barrel',8,1)],[['a',8,4]])
});
export const BUILDING_INTERIOR={residence:'house',inn:'barracks',depot:'store',warroom:'quarters'};
for(const [hubId,hub] of Object.entries(HUBS)){let n=0;
 for(const b of hub.buildings){const interior=BUILDING_INTERIOR[b.type];if(!interior||b.entrance)continue;
  b.buildingId=b.buildingId&&b.buildingId!=='council'?b.buildingId:`${b.type}-${++n}`;const tileX=b.x+Math.floor(b.w/2),tileY=b.y+b.h-1;
  b.entrance={tileX,tileY,approachDirection:'north',triggerType:'interact'};b.returnPoint={tileX,tileY:tileY+1};b.interiorScene=interior;
  hub.places.push({id:b.buildingId,name:({HOME:'민가',SUPPLY:'보급 창고',BARRACKS:'병영',TRIAGE:'구호 천막','COMMAND QUARTERS':'지휘관 숙소',OPERATIONS:'작전 막사'})[b.label]||b.label||interior,x:tileX,y:tileY+1,action:'enter',entrance:b.entrance,buildingId:b.buildingId,interior,hub:hubId});}
}
// v0.5.0 (D-052): painted camp-type hubs replace the procedural Border Camp and add the bivouac,
// reclaimed fortress and oath camp. The legacy loops above shaped only the procedural hubs.
Object.assign(HUBS,ART_HUBS);
