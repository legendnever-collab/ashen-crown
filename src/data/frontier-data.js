// Original local scenes/NPC details are PROPOSED content within approved chronology.
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
export const TOOLS={
 medium:{name:'Medium Potion',icon:'✚',price:30,sell:12,description:'자신 HP +30 · 행동 1회',stat:'hp',amount:30},
 ether:{name:'Ether',icon:'✦',price:40,sell:16,description:'자신 MP +8 · 행동 1회',stat:'mp',amount:8},
 ward:{name:'Ward Tonic',icon:'◇',price:35,sell:14,description:'다음 Player Phase까지 자신 DEF/RES +2 · 행동 1회',stat:'ward',amount:2}
};
export const RECRUITS={lia:{characterId:'lia',availability:1,requiredFlag:null,personalEvent:'동료가 될 이유',relationshipRequirement:null,initialEquipment:'starter',initialGrowth:'existing',startingLevel:1,campPlacement:[10,5]},sain:{characterId:'sain',availability:1,requiredFlag:null,personalEvent:'구호대의 약속',relationshipRequirement:null,initialEquipment:'starter',initialGrowth:'existing',startingLevel:1,campPlacement:[3,6]},kai:{characterId:'kai',availability:1,requiredFlag:null,personalEvent:'돌아올 곳',relationshipRequirement:null,initialEquipment:'starter',initialGrowth:'existing',startingLevel:1,campPlacement:[12,8]}};
export const HUBS={
 village:{name:'Ashen Village · 잿빛 마을',tone:'village',width:16,height:16,spawn:[7,7],
 buildings:[{x:1,y:1,w:4,h:3,label:'BLACKSMITH',type:'forge'},{x:10,y:1,w:4,h:3,label:'ITEM SHOP',type:'shop'},{x:1,y:8,w:3,h:3,label:'BARRACKS',type:'inn'},{x:11,y:8,w:4,h:3,label:'WAR ROOM',type:'warroom'}],
 places:[{id:'square',name:'Village Square',x:7,y:7},{id:'forge',name:'Blacksmith',x:3,y:4,action:'weapon'},{id:'shop',name:'Item Shop',x:12,y:4,action:'item'},{id:'inn',name:'Inn / Barracks',x:3,y:7},{id:'depot',name:'Supply Depot',x:8,y:3},{id:'council',name:'War Room',x:12,y:7,action:'council'},{id:'exit',name:'Village Exit',x:7,y:10,action:'council'}],
 npcs:[{id:'eric',name:'Erik · 장비 점검',x:5,y:5,kind:'hero'},{id:'elina',name:'Elina · 경계',x:10,y:7,kind:'hero'},{id:'lia',name:'Lia · 기록 조사',x:9,y:4,kind:'hero'},{id:'sain',name:'Sain · 구호',x:5,y:8,kind:'hero'},{id:'kai',name:'Kai · 길목 관찰',x:13,y:6,kind:'hero'},{id:'elder',name:'Village Elder',x:6,y:3},{id:'smith',name:'Blacksmith',x:2,y:4,service:'weapon'},{id:'merchant',name:'Item Merchant',x:13,y:4,service:'item'},{id:'refugee',name:'Refugee',x:7,y:8},{id:'guard',name:'Guard',x:11,y:6} ]},
 camp:{name:'Border Camp · 변경 야영지',tone:'camp',width:20,height:24,spawn:[7,7],
 buildings:[{x:1,y:1,w:4,h:3,label:'FIELD FORGE',type:'forge'},{x:10,y:1,w:4,h:3,label:'QUARTERMASTER',type:'shop'},{x:1,y:8,w:3,h:3,label:'TRIAGE',type:'inn'},{x:11,y:8,w:4,h:3,label:'COMMAND',type:'warroom'}],
 places:[{id:'square',name:'Campfire',x:7,y:7},{id:'forge',name:'Field Forge',x:3,y:4,action:'weapon'},{id:'shop',name:'Quartermaster',x:12,y:4,action:'item'},{id:'inn',name:'Triage Tent',x:3,y:7},{id:'depot',name:'Records Tent',x:8,y:3},{id:'council',name:'Command Tent',x:12,y:7,action:'council'},{id:'exit',name:'Departure',x:7,y:10,action:'council'}],
 npcs:[{id:'eric',name:'Erik · 방패 점검',x:5,y:5,kind:'hero'},{id:'elina',name:'Elina · 정찰',x:11,y:6,kind:'hero'},{id:'lia',name:'Lia · 기록',x:10,y:5,kind:'hero'},{id:'sain',name:'Sain · 부상자',x:3,y:6,kind:'hero'},{id:'kai',name:'Kai · 우회로',x:12,y:8,kind:'hero'},{id:'elder',name:'Camp Steward',x:6,y:3},{id:'smith',name:'Field Blacksmith',x:2,y:4,service:'weapon'},{id:'merchant',name:'Quartermaster',x:13,y:4,service:'item'},{id:'refugee',name:'Displaced Villager',x:4,y:6},{id:'guard',name:'Sentry',x:13,y:7}]}
};
export const FRONTIER_SCENES={
 'pre:1':[['aren','에릭, 아침 종이 울리기 전에 돌아보자. 병사들은 어떤가?'],['eric','방패를 고치고 있다. 오늘은 좀 조용했으면 좋겠군.'],['aren','네가 본 것도 듣고 싶다.'],['elina','북쪽 숲에 낯선 발자국이 있어요. 아직 습격이라고 단정할 수는 없지만요.'],['aren','주민들이 불안해하지 않게 확인해 줘. 나도 마을을 돌아보겠다.'],['lia','기록을 보고 있었어요. 떠나기 전에 이야기할 시간이 있나요?'],['sain','피난민이 쉬고 있어요. 약이 없어도 제 손이 닿는 곳은 돕겠습니다.'],['kai','사람은 준비가 되어야 같은 길로 갈 수 있지. 말 걸고 싶으면 동쪽 길목으로 와.'],['eric','나는 광장에 있겠다. 볼일이 끝나면 회의실에서 만나자.'],['aren','서두르지는 마라. 빠뜨린 일이 없는지 살펴보자.']],
 'pre:2':[['aren','불길은 꺼졌지만 군용 인장이 찍힌 상자는 남았다. 누가 보냈는지는 아직 모른다.'],['elina','습격자들이 숲으로 달아났어요. 뒤를 잡을 수 있어요.'],['sain','죽은 사람에게서는 답을 들을 수 없어요. 살아 있는 증언을 구할 기회를 주세요.'],['elina','마을을 불태운 사람에게 자비부터 말하나요?'],['aren','용서하자는 말이 아니다. 명령을 내린 사람을 찾아야 한다.'],['kai','북쪽 출구로 곧장 갈 거야. 나는 옆길로 먼저 움직이지.'],['eric','우리 장수들이 서로 떨어지면 위험하다. 방패와 활의 위치를 먼저 정하자.'],['lia','기록과 현장의 흔적을 비교할게요. 진술과 사실은 따로 적겠습니다.'],['aren','야영지에서 정비한다. 필요한 장비가 있으면 지금 챙겨라.'],['kai','도주 대장을 절반 HP 이하로 낮추고 인접하면 생포할 수 있어. 필수는 아니지만 정보가 달라지겠지.'],['aren','살아 돌아오는 것까지 작전이다. 준비가 되면 Command Tent로 모여라.']],
 'pre:3':[['sain','다리 앞에 피난민이 모였어요. 부상자들은 혼자 건너기 어려워요.'],['eric','좁은 교량에 병력을 쌓으면 퇴로까지 막힌다. 먼저 길을 나누자.'],['kai','옆으로 돌아가면 북쪽에서 도울 수 있어. 방패로 혼자 다 받으려 하지는 마.'],['eric','그동안 세인을 지키겠다. 네가 돌아올 길도 남겨 두지.'],['elina','추격병은 후방에서 접근해요. 구조가 끝나도 마지막 장수가 남으면 위험해요.'],['lia','불길을 좁은 길목에 모으면 주민이 움직일 공간을 만들 수 있어요.'],['aren','주민 곁을 지키면 스스로 북쪽으로 이동한다. 인접해서 직접 구조해도 된다.'],['sain','회복과 구조 중 무엇이 급한지 현장에서 판단할게요.'],['aren','10턴 안에 주민 한 명 이상을 구하고, 생존 장수 전원이 북쪽 세 줄의 안전 구역으로 철수한다.'],['eric','기본 장비로도 할 수 있다. 여유가 있다면 이동 장비나 회복 도구를 비교해 보자.'],['aren','명령서보다 사람의 얼굴을 먼저 보겠다. 함께 준비하자.']],
 raid:[['elina','북쪽에서 연기가 올라요. Garr의 무리가 마을 안으로 들어왔어요!'],['eric','준비된 다섯 명을 부르겠다. 더 지체하지 말자.'],['aren','주민 둘을 구하고 Garr를 막는다. 먼저 배치를 확인한다.'],['sain','사람을 구할 길을 남겨 주세요.'],['aren','회의실로 모여라. 길을 정하고 바로 출발한다.']],
 'after:1':[['elder','두 분 모두 무사히 돌아왔군요. 불탄 집보다 돌아온 얼굴부터 세겠습니다.'],['sain','다친 사람들은 여기서 쉬게 해 주세요.'],['lia','상자에 왕실 군용 인장이 있어요. 하지만 누가 전달했는지 기록은 비어 있어요.'],['aren','인장은 기록해 둬라. 상자를 보낸 사람은 아직 모른다.'],['eric','장수들의 장비를 다시 보자. 돌아올 곳이 있으면 다음 출전도 버틸 수 있다.']],
 'after:2':[['elina','숲의 흔적을 정리했어요. 결론을 서두르지는 않겠어요.'],['sain','책임을 묻는 것과 생명을 지키는 일은 같이 할 수 있어요.'],['kai','이제 다리가 문제야. 피난민이 몰리기 전에 길을 열어야 해.'],['aren','같은 야영지에서 다음 구조 작전을 준비한다.']],
 'after:3':[['sain','오늘 돌아온 사람들의 이름을 적어 두겠어요. 돌아오지 못한 이름도요.'],['eric','카이, 네가 고른 길 덕분에 우리가 돌아왔다.'],['kai','방패 뒤에 누군가 남아 있을 거라 믿었지. 이제는 조금 알겠어.'],['aren','잿빛 밤에는 명령서를 들고 있었다. 이번에는 너희와 함께 사람을 보고 판단했다.'],['lia','군용 물자의 흔적은 남아 있어요. 버려진 성채에서 기록을 찾을 수 있을지 몰라요.'],['aren','지금은 쉬자. 다음 길은 모두의 의견을 듣고 정한다.'],['eric','함께 돌아온 사람부터 살피자. 성채로 향하는 길은 그 다음이다.']]
};
// Authored Korean copy; do not introduce facts about the crown or faction responsibility.
export const NPC_LINES={
 eric:['방패는 혼자 버티라는 뜻이 아니다. 함께 돌아오기 위한 약속이지.','숲에서는 길목을 막고, 다리에서는 세인과 주민이 지나갈 자리를 남겨 두자.'],
 elina:['숲에서 낯선 발자국을 찾았어요. 준비가 끝나면 경계 보고를 모을게요.','생포하려면 도주로를 먼저 막아요. 활은 인접한 적에게 쏠 수 없으니 거리를 남겨요.'],
 lia:['봉인 흔적을 조사하다 이 마을에 머물렀어요. 기록보다 먼저 사람을 지켜야겠죠.','아렌, 조사에 협력할게요. 다만 위험을 발견하면 서로 숨기지 말아요.'],
 sain:['피난길에 만난 이들을 치료하고 있어요. 명령보다 먼저 다친 사람의 손을 잡겠습니다.','당신들의 곁에서 사람을 돕고 싶어요. 적이라도 칼을 놓으면 치료할게요.'],
 kai:['그냥 지나가던 길이야. 하지만 이 길에서 사라지는 사람이 더 늘면 곤란하지.','앞서 갈 길은 알아. 오늘은 혼자 떠나지 않고 너희와 함께 가겠어.'],
 elder:['집은 다시 지으면 됩니다. 돌아올 사람들이 먼저지요.'],smith:['무거운 건 잘 막고, 가벼운 건 빨리 움직이지. 하나 들어 보겠나?'],merchant:['많이 산다고 모두 지킬 수는 없어요. 들고 갈 도구는 여섯 개까지입니다.'],refugee:['다리 너머에도 기다리는 사람이 있어요. 길이 열리면 알려 주세요.'],guard:['경계 보고가 들어왔습니다. 회의실에서 기다리고 계십니다.']
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
for(const hub of Object.values(HUBS))for(const n of hub.npcs)if(n.id==='eric')Object.assign(n,{id:'aren',name:'Aren · 군단장',kind:'commander'});
NPC_LINES.aren=['에릭, 병사들의 상태를 살펴 줘. 이번 판단도 함께 책임지겠다.','명령서는 내가 확인하겠다. 동료들이 돌아올 길을 부탁한다.'];
