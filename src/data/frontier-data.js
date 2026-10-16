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
 'pre:1':[['aren','에릭, 아침 종 울리기 전에 한 바퀴 돌자. 병사들은 좀 어때?'],['eric','방패 고치는 중이다. 오늘은 좀 조용했으면 좋겠군.'],['aren','네 눈으로 본 것도 듣고 싶다.'],['elina','북쪽 숲에 낯선 발자국이 있어요. 습격이라고 하기엔… 아직 일러요.'],['aren','주민들이 겁먹지 않게 확인해 줘. …에릭, 마을을 부탁한다.'],['lia','아, 기록 보던 중이었어요! 떠나기 전에 잠깐 얘기할 수 있어요?'],['sain','피난민분들이 쉬고 계세요. 약이 없어도 제 손 닿는 데까지는 돕겠습니다.'],['kai','같은 길을 가려면 준비가 돼야지. 할 말 있으면 동쪽 길목으로 와.'],['eric','동료들은 내가 둘러보지. 정찰 보고는 리아한테 듣고.'],['aren','서두르지 마라. 빠뜨린 게 없는지… 천천히 보자.']],
 'pre:2':[['aren','불은 껐다. 그런데 군용 인장 찍힌 상자가 남았어. …누가 보냈는지는 아직 모른다.'],['elina','습격자들은 숲으로 달아났어요. 지금이면 꼬리를 잡을 수 있어요.'],['sain','죽은 사람은 아무 말도 해 주지 않아요. 살아 있는 증언을 얻을 기회를 주세요.'],['elina','마을에 불 지른 사람들한테 자비부터 얘기하는 거예요?'],['aren','용서하자는 게 아니다. 명령을 내린 자를 찾자는 거지.'],['kai','놈들은 북쪽 출구로 곧장 갈 거야. 난 옆길로 먼저 갈게.'],['eric','서로 떨어지면 위험하다. 방패랑 활 자리부터 정하자.'],['lia','기록이랑 현장 흔적을 맞춰 볼게요. 진술이랑 사실은 따로 적어 두고요!'],['aren','야영지에서 정비한다. 필요한 장비가 있으면 지금 챙겨라.'],['kai','도주 대장 HP를 반 아래로 깎고 옆에 붙으면 생포할 수 있어. 꼭 할 필요는 없지만, 듣는 얘기가 달라질걸.'],['aren','살아서 돌아오는 것까지가 작전이다. 에릭, 준비되면 리아와 작전을 맞춰 봐라.']],
 'pre:3':[['sain','다리 앞에 피난민분들이 모였어요. 부상자분들은 혼자서는 못 건너요.'],['eric','좁은 다리에 병력을 몰면 퇴로까지 막힌다. 길부터 나누자.'],['kai','옆으로 돌면 북쪽에서 거들 수 있어. 방패 하나로 다 받으려고 하진 마.'],['eric','그동안 세인은 내가 지킨다. 네가 돌아올 길도 남겨 두지.'],['elina','추격병은 뒤에서 와요. 구조가 끝나도 마지막 한 명이 남아 있으면 위험해요.'],['lia','불길을 좁은 길목에 몰아 두면 주민들이 움직일 틈이 생겨요. 화공은 이럴 때 쓰는 거죠!'],['aren','주민 곁에 서 있으면 스스로 북쪽으로 걷는다. 옆에 붙어서 직접 구해도 된다.'],['sain','치료가 급한지 구조가 급한지는 현장에서 판단할게요.'],['aren','열 턴 안에 주민을 한 명 이상 구하고, 살아 있는 전원이 북쪽 세 줄 안전 구역으로 빠진다.'],['eric','기본 장비로도 해낼 수 있다. 여유 있으면 이동 장비나 회복 도구도 보자.'],['aren','명령서보다… 사람 얼굴을 먼저 보겠다. 같이 준비하자.']],
 raid:[['elina','북쪽에서 연기가 올라요! Garr 패거리가 마을 안까지 들어왔어요!'],['eric','준비된 다섯을 부른다. 더 지체할 시간 없다.'],['aren','주민 둘을 구하고 Garr를 막는다. 배치부터 확인해.'],['sain','사람을 구할 길만은 남겨 주세요.'],['aren','리아와 보고를 맞춰라. 길이 정해지면 바로 출발한다.']],
 'after:1':[['elder','둘 다 무사히 돌아왔구먼. 불탄 집보다 돌아온 얼굴부터 세겠네.'],['sain','다치신 분들은 여기서 쉬게 해 주세요.'],['lia','상자에 왕실 군용 인장이 있어요. 근데 누가 전달했는지는 기록이 텅 비어 있어요.'],['aren','인장은 적어 둬라. 상자를 보낸 자는… 아직 모른다.'],['eric','장비부터 다시 보자. 돌아올 곳이 있으면 다음 출전도 버틸 수 있어.']],
 'after:2':[['elina','숲 흔적은 정리했어요. 결론은 서두르지 않을 거예요.'],['sain','책임을 묻는 일과 생명을 지키는 일, 둘 다 할 수 있어요.'],['kai','이제 다리가 문제야. 피난민이 몰리기 전에 길을 터야 해.'],['aren','같은 야영지에서 다음 구조 작전을 준비한다.']],
 'after:3':[['sain','오늘 돌아온 분들 이름을 적어 둘게요. 돌아오지 못한 이름도요.'],['eric','카이, 네가 고른 길 덕에 다 돌아왔다.'],['kai','방패 뒤에 누가 버티고 있을 거라고 믿었지. 이제 좀 알 것 같아.'],['aren','잿빛 밤엔… 명령서만 쥐고 있었다. 이번엔 너희와 함께 사람을 보고 판단했다.'],['lia','군용 물자 흔적은 아직 남아 있어요. 버려진 성채에 가면 기록을 찾을 수 있을지도 몰라요!'],['aren','지금은 쉬자. 다음 길은 모두의 얘기를 듣고 정한다.'],['eric','같이 돌아온 사람부터 챙기자. 성채 얘기는 그다음이다.']]
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
for(const hub of Object.values(HUBS))for(const n of hub.npcs)if(n.id==='eric')Object.assign(n,{id:'aren',name:'Aren · 군단장',kind:'commander'});
NPC_LINES.aren=['에릭, 병사들 상태 좀 봐 줘. …이번 판단도 같이 책임지겠다.','명령서는 내가 확인하지. 넌 동료들이 돌아올 길을 부탁한다.'];

// D-038: Lia doubles as the legion's strategist and stands at the war table beside her
// staff aide (functional role; the aide keeps the 'advisor' id that drives the council).
for(const hub of Object.values(HUBS)){
 hub.npcs.push({id:'advisor',name:'작전 보좌관 · 리아의 작전 탁자',x:8,y:7,kind:'advisor'});
 Object.assign(hub.npcs.find(n=>n.id==='lia'),{name:'Lia · 군사',x:9,y:7});
 const p=hub.places.find(p=>p.id==='council'),b=hub.buildings.find(b=>b.buildingId==='council');
 p.name='Commander Quarters';delete p.action;delete p.entrance;
 b.label='COMMAND QUARTERS';delete b.entrance;delete b.returnPoint;delete b.interiorScene;
 delete hub.places.find(p=>p.id==='exit').action;
 hub.places.push({id:'advisor',name:'작전 탁자 · 광장 동쪽',x:7,y:7});
}
export const ADVISOR_BRIEFINGS={
 1:[['advisor','에릭 경, 북쪽 경계에서 급보입니다!'],['eric','주민부터 지킨다. 적은 어디 있지?'],['lia','Garr 패거리가 마을로 오고 있어요. 광장에서 병력을 모아 맞서요!']],
 2:[['advisor','습격자들이 북쪽 숲길로 달아났습니다.'],['eric','숲에서 서로 떨어지지 않게 대열부터 정하자.'],['lia','대장의 퇴로는 북쪽이에요. 생포하면 보급로를 캐물을 수 있어요!']],
 3:[['advisor','다리 앞에 피난민이 모였습니다. 후방에선 추격병이 접근 중입니다.'],['eric','세인이 구조할 길을 연다. 철수로부터 확인하지.'],['lia','열 턴 안에 주민을 한 명 이상 구하고, 살아 있는 장수는 전원 북쪽 안전 구역으로 빠져야 해요.']]
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
