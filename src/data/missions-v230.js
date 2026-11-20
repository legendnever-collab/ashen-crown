// v2.3.0 ACT II 큰 맵 (D-128/D-129, docs/v2.3.0/ACT2_MAPS_DESIGN.md §2): M07–M10 on big maps. Objectives, special rules,
// story and duel pairs are unchanged; terrain, entry direction, size and the enemy line-up change (numbers PROPOSED,
// tuned by act2-balance). Maps drawn by scripts/make-act2-maps.py. M07: the convoy follows the valley road east, across
// the ice, then climbs north to Ironhold's gate in the north-east (Thea's line 「북쪽 성문」 still holds). M08: the
// north canyon mouth and the rear village to the south. M09: from the south-west docks to the council hall north-east.
// M10: from the west into the village between Oswin's fort (north) and Brennan's fort (south).
// v2.3.1 (D-131): the war council's terrain and intel lines (`council`) follow the big maps; v2.3.0 kept the small-map counts.
const g2300=rows=>rows.map(r=>r.split(''));
const u2300=(id,name,kind,x,y,stats={})=>({id,name,kind,x,y,hp:32,atk:15,def:6,res:3,spd:6,mov:3,range:kind==='archer'?[2,3]:[1,1],...stats});
const open2300=(rows,x,y)=>!!rows[y]&&!'xw'.includes(rows[y][x]??'x');
const area2300=(rows,x0,y0,x1,y1,skip=[])=>{const out=[];for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(open2300(rows,x,y)&&!skip.some(([a,b])=>a===x&&b===y))out.push([x,y]);return out;};
export const ROWS2300={
 7:["mmmmmmmmmmmmmwwmmmmmmmmmxxttxx","mmmmmmmmmmmmmwwmmmmmmmmmxxttxx","nnnffffnnnnnnwwnfffnnrrrrrrrxx","nnnnnnnnnnnnnwwnnnnnnrrrrrrrxx","nnnnnffnnnnnnwwnnnnnnrrnnnnnxx","nnnnnnnnnnnnnwwnnnnnnrrnfffnxx","nnnnnnnnnnnnnwwnnnnnnrrnfffnxx","rrrrrrrrrrrrriirrrrrrrrnnnnnnn","rrrrrrrrrrrrriirrrrrrrrnnnnnnn","nnnnnnnnnnfnnwwnnnffnnnnnffffn","nnnnnnnnnnfnnwwnnnnnnnnnnffffn","nnnnnnnnffffniinnnnnffffnnnnnn","mmmmmmmmmmmmmwwmmmmmmmmmmmmmmm","mmmmmmmmmmmmmwwmmmmmmmmmmmmmmm"],
 8:["xxxxxxnnnnrrnnnnxxxxxx","xxxxxxnnnnrrnnnnxxxxxx","xxxxxxnnnnrrnnnnxxxxxx","xxxxxxnnnnrrnnnnxxxxxx","xxxxxnnnnnrrnnnnnxxxxx","xxxxxnnnnnrrnnnnnxxxxx","xxxxxmmnnnrrnnnmmxxxxx","xxxxxmmnnnrrnnnmmxxxxx","xxxxxmmnnnrrnnnmmxxxxx","xxxxxnnffnrrnffnnxxxxx","mmmmmnnnnnrrnnnnnmmmmm","mmmmmnnnnnrrnnnnnmmmmm","nnnnnnnnnnrrnnnnnnnnnn","nnnnnnnnnnrrnnnnnnnnnn","ggggggggggrrgggggggggg","ggvvvvggggrrggggvvvvgg","ggvhhvggffrrggggvvvvgg","ggvvvvggffrrffggvvvvgg","ffggggggggrrffgggggggg","ffggggggggrrgggggggggg"],
 9:["wwwxxllllrrllllrrlllxxxxxx","wwwllllllrroooorroolxkkkkx","wwwlloooorroooorroolxkkkkx","wwwlloooorroooorroolxkkkkx","wwwlloooorroooorroolxxkkxx","wwwlloooorrllllrrlllllllll","wwwrrrrrrrrrrrrrrrrrrrrrrr","wwwllllllrroooorroooolllll","wwwlloooorroooorroooolllll","wwwlloooorroooorroooolllll","wwwlloooorroooorroooolllll","wwwrrrrrrrrrrrrrrrrrrrrrrr","wwwllllllrrllllrrooooloool","wwwlloooorroooorrooooloool","wwwllllllrroooorrooooloool","wbbrrrrrrrroooorrooooloool","wbbrrrrrrrrllllrrlllllllll","wwwwwbbwwrrwwwwwwwwwwwwwww","wwwwwbbwwrrwwwwwwwwwwwwwww","wwwwwwwwwrrwwwwwwwwwwwwwww"],
 10:["gggggggmmmgggggxxxxxxxxxxggssw","gggggggmmmgggggxttttttttxggssw","ggffffgggggggggxttttttttxggssw","ggffffgggggggggxxxxrrxxxxggssw","ggffffgggfffgggggggrrggggffssw","gggggggggfffgggggggrrggggffssw","ggggggggggggggvvvvvrrgvvvggssw","ggggggggggggggvvvvvrrgvvvggssw","rhrrrrrrrrrrrrrrrrrrrrrrrrrssw","rhrrrrrrrrrrrrrrrrrrrrrrrrrssw","ggggggggggggggvvvvgrrvvvvvgssw","ggggggggggggggvvvvgrrvvvvvgssw","gggggggggfffgggggggrrggggffssw","ggffffgggfffgggggggrrggggffssw","ggffffgggggggggxxxxrrxxxxggssw","ggffffgggggggggxttttttttxggssw","gggggggmmmgggggxttttttttxggssw","gggggggmmmgggggxxxxxxxxxxggssw"],
};
// deserters know the snow (rogue profile); the old M07–M10 stats, with new soldiers beside them
const dz23=(id,x,y,o={})=>u2300(id,'탈영병','bandit',x,y,{movementProfile:'rogue',...o}),da23=(id,x,y)=>u2300(id,'탈영 궁수','archer',x,y,{hp:26,atk:14,def:3,spd:7,mov:2,movementProfile:'rogue'});
const ms23=(id,x,y,o={})=>u2300(id,'용병 창병','spear',x,y,{def:7,...o}),ma23=(id,x,y)=>u2300(id,'용병 궁수','archer',x,y,{hp:26,atk:14,def:3,spd:7});
const raid23=(id,x,y)=>u2300(id,'용병 습격조','bandit',x,y,{hp:28,def:5,spd:8,mov:4});
const hunt23=(id,x,y)=>u2300(id,'자객','assassin',x,y,{hp:28,atk:17,def:4,res:4,spd:10,mov:5,movementProfile:'rogue',hunter:true});
const bs23=(id,x,y)=>u2300(id,'벨마르 습격대','spear',x,y,{spd:7}),ba23=(id,x,y)=>u2300(id,'습격대 궁수','archer',x,y,{hp:26,atk:14,def:3,spd:7});
const lord23=(side)=>side==='a'?{faction:'a',look:'lordA'}:{faction:'b',look:'lordB'};
const arm23=(side,id,x,y,o={})=>u2300(id,side==='a'?'청백 영주군':'주황 영주군','spear',x,y,{hp:34,atk:16,def:8,...lord23(side),...o});
const guardA2=(side,id,x,y)=>u2300(id,side==='a'?'청백 친위대':'주황 친위대','spear',x,y,{hp:40,atk:16,def:11,...lord23(side)});
const bow23=(side,id,x,y)=>u2300(id,side==='a'?'청백 궁병':'주황 궁병','archer',x,y,{hp:28,atk:15,def:4,spd:7,...lord23(side)});
export const V230_MISSIONS={
 7:{council:{terrain:'Northern Road · 눈길(이동 2, 탈영병 1) / 골짜기 길 / 얼어붙은 강(통과 불가) · 얼음 다리 2곳 / 남북 능선(산) · 북동쪽 철관성 성문',intel:'탈영병 대장 · 탈영병 10 · 탈영 궁수 5(남북 능선과 길목). TURN 3 서쪽 후미 습격 3, TURN 5 성문 앞 3. 동맹: 테아와 철왕관 보병 2(마차 곁을 따라 움직임).',planFix:[['성문(맨 위 두 줄)','북동쪽 철관성 성문']]},
  zoneArea:[0,3,5,11],par:17,turnLimit:20,
  convoyGate:[[26,0],[27,0],[26,1],[27,1]],
  enemies:[u2300('boss','탈영병 대장','captain',17,10,{hp:60,atk:17,def:8,res:4,spd:7,movementProfile:'rogue'}),
   da23('a1',5,1),da23('a2',10,1),da23('a3',17,1),da23('a4',20,1),da23('a5',25,12),
   dz23('d1',8,3),dz23('d2',11,5),dz23('d3',16,4),dz23('d4',19,6),dz23('d5',9,10),dz23('d6',16,10),dz23('d7',20,10),dz23('d8',24,8),dz23('d9',24,4),dz23('d10',27,8)],
  civilians:[{id:'w1',name:'보급 마차',kind:'wagon',x:3,y:7,hp:48,def:7,res:5},{id:'w2',name:'보급 마차',kind:'wagon',x:3,y:8,hp:48,def:7,res:5},{id:'w3',name:'보급 마차',kind:'wagon',x:2,y:7,hp:48,def:7,res:5}],
  allies:{thea_escort:[4,6],ic1:[1,6],ic2:[2,9]}, // off the road, so the wagons are not blocked at the start
  waves:[{turn:3,story:'7:ambush',units:[dz23('r1',0,4,{name:'후미 습격병'}),dz23('r2',0,11,{name:'후미 습격병'}),dz23('r5',0,10,{name:'후미 습격병'})]},
   {turn:5,story:'7:gatewave',units:[dz23('r3',26,4,{name:'성문 습격병'}),dz23('r4',27,4,{name:'성문 습격병'}),dz23('r6',23,2,{name:'성문 습격병'})]}],
  deploy:[[5,6],[5,9],[4,6],[4,9],[5,7],[5,8],[1,6],[1,9],[3,5],[3,10],[0,7],[0,8]],
  objective:'보급 마차 3대 중 2대를 북동쪽 성문까지 호위 (마차 2대를 잃으면 패배)',
  brief:'마차는 TURN 2부터 매 턴 골짜기 길을 따라 2칸 갑니다. 얼음 강을 건너 동쪽으로 간 뒤 북쪽 비탈길로 올라 철관성 성문에 닿습니다. 옆에 적이 붙으면 1칸만 가고, 장수가 길을 막으면 못 지나갑니다. 탈영병은 눈길과 숲, 능선에 익숙합니다. 탈영병 대장은 HP 절반 이하에서 인접해 생포할 수 있습니다. TURN 3 서쪽 후미, TURN 5 성문 앞 증원.'},
 8:{council:{terrain:'Grey Canyon · 북쪽 협곡 목 / 양쪽 벼랑 턱 낙석 장치 / 협곡 아래 들판(12번째 줄) / 남쪽 후위 마을',intel:'용병 창병 8 · 궁수 4. TURN 3 북쪽 2진 5, TURN 6 남쪽 후위 마을에 습격조 5, TURN 7 용병단장 + 호위병 3(TURN 8까지 입구 사수). 동맹: 발드릭과 철왕관 보병 2(위쪽 목 사수).'},
  zoneArea:[6,7,15,11],par:9,turnLimit:10,breachRow:12,
  enemies:[ms23('m1',8,1),ms23('m2',13,1),ms23('m3',9,2),ms23('m4',12,2),ms23('m8',7,3),ms23('m9',14,3),ms23('m10',10,3),ms23('m11',11,3),ma23('a1',7,1),ma23('a2',14,1),ma23('a4',10,0),ma23('a5',11,0)],
  civilians:[{id:'v1',name:'후위 마을 노인',x:2,y:15,hp:24,def:2},{id:'v2',name:'후위 마을 어머니',x:4,y:17,hp:24,def:2},{id:'v3',name:'후위 마을 소년',x:18,y:16,hp:24,def:2}],
  allies:{baldrick:[10,6],ic1:[9,6],ic2:[11,6]},
  objects:[['rf1','낙석 장치','rockfall',5,7,{zone:[6,10,2,6]}],['rf2','낙석 장치','rockfall',16,7,{zone:[11,15,2,6]}]],
  waves:[{turn:3,story:'8:wave',units:[ms23('m5',8,0),ms23('m6',13,0),ms23('m7',9,0),ma23('a3',12,0),ms23('m12',10,1)]},
   {turn:7,story:'8:captain',units:[u2300('boss','용병단장','captain',10,0,{hp:84,atk:19,def:9,res:5,spd:7,holdUntil:8}),u2300('g1','단장 호위병','spear',9,0,{hp:34,atk:16,def:8}),u2300('g2','단장 호위병','spear',11,0,{hp:34,atk:16,def:8}),u2300('g3','단장 호위병','spear',12,1,{hp:34,atk:16,def:8})]},
   {turn:6,raid:true,units:[raid23('s1',0,19),raid23('s2',0,17),raid23('s3',21,19),raid23('s4',21,17),raid23('s5',11,19)]}],
  deploy:[[8,8],[13,8],[9,9],[12,9],[10,10],[11,10],[7,10],[14,10],[8,11],[13,11],[10,11],[11,11]],
  objective:'TURN 10까지 협곡 사수 또는 TURN 7에 오는 용병단장 격파 (북쪽 적이 협곡 아래 들판(12번째 줄)으로 넘어오면 패배)',
  brief:'위쪽 목은 발드릭의 병사가 지킵니다. 양쪽 벼랑 턱의 낙석 장치(한 번씩)를 작동하면 협곡 안의 적에게 큰 피해를 줍니다. 출전 전에 사령부 명령(협곡 사수 / 후위 마을 구출조)을 정합니다. 후위 마을은 협곡 아래 남쪽 들판에 있습니다. TURN 3 북쪽 2진, TURN 6 남쪽 습격조, TURN 7 용병단장과 호위병 도착(TURN 8까지 입구 사수).'},
 9:{council:{terrain:'Velmar Harbor · 남서쪽 부두 / 골목(이동 1, 회피 +5) / 지붕(이동 2, 방어 +2, 활 사거리 +1, 기병 불가) / 북동쪽 의회 회관',intel:'자객 3(지붕) · 습격대 창병 8 · 궁수 4. TURN 3 부두 뒤쪽 3, TURN 5 동쪽 골목에 그림자 자객 우두머리 + 4. 동맹: 다리오(회관 앞)와 항구 경비병 2(부두).',planFix:[['TURN 10까지','TURN 12까지']]},
  zoneArea:[3,12,8,16],par:10,turnLimit:12,
  enemies:[hunt23('h1',12,3),hunt23('h2',22,13),hunt23('h4',19,2),bs23('m1',11,5),bs23('m2',21,9),bs23('m3',19,6),bs23('m4',23,9),bs23('m5',14,16),bs23('m6',4,5),bs23('m7',21,13),bs23('m8',18,0),
   ba23('a1',6,8),ba23('a2',13,2),ba23('a3',19,12),ba23('a4',24,8)],
  civilians:[{id:'v1',name:'청백 깃발 대표',look:'councillor',x:10,y:8,hp:30,def:3,res:3},{id:'v2',name:'주황 깃발 대표',look:'councillor',x:16,y:12,hp:30,def:3,res:3},{id:'v3',name:'항구 의원',look:'councillor',x:7,y:10,hp:30,def:3,res:3}], // along the legion's way up from the docks
  allies:{dario_blade:[23,10,{post:{x:22,y:8},leash:3}],vg1:[3,13,{post:{x:3,y:12},leash:2}],vg2:[4,16,{post:{x:3,y:15},leash:2}]},
  waves:[{turn:3,story:'9:harbor',units:[bs23('s1',1,15),bs23('s2',2,16),bs23('s4',5,17)]},
   {turn:5,story:'9:alley',units:[u2300('boss','그림자 자객 우두머리','captain',25,5,{hp:60,atk:18,def:6,res:5,spd:11,mov:4,movementProfile:'rogue',hunter:true}),hunt23('h3',25,7),bs23('s3',25,12),bs23('s5',24,16),ba23('a5',25,9)]}],
  deploy:[[6,13],[7,14],[5,14],[8,15],[6,15],[4,13],[7,16],[5,16],[3,14],[8,13],[3,12],[8,12]],
  objective:'의회 대표 3명을 의회 회관으로 피신(인접해 구출) · 2명 이상 잃으면 패배 · TURN 5에 나타나는 그림자 자객 우두머리 격파·생포 또는 TURN 12까지 버티면 승리',
  brief:'남서쪽 부두에서 들어가 북동쪽 의회 회관 쪽으로 골목을 뚫습니다. 대표 셋은 골목 곳곳에 있고, 곁에서 구출하면 회관 안으로 피신합니다. 자객은 지붕(이동 2, 방어 +2, 활 사거리 +1)을 타고 대표만 노립니다. 일반 습격대는 TURN 3부터 대표를 노립니다. TURN 3 항구 부두, TURN 5 동쪽 골목에 우두머리와 증원. 우두머리는 HP 절반 이하에서 인접해 생포할 수 있습니다.'},
 10:{council:{terrain:'Mill Village · 들판 / 북쪽 오스윈 요새 · 남쪽 브레넌 요새 / 가운데 물레 마을 / 동쪽 늪과 강',intel:'청백 영주군(오스윈 경 + 친위대 2 + 9) · 주황 영주군(브레넌 경 + 친위대 2 + 9). 두 군대는 서로도 싸웁니다. TURN 4 · TURN 6 양쪽 증원 2씩. TURN 5부터 마을 주민을 노립니다. 동맹: 다리오.',planFix:[['TURN 12 안에','TURN 14 안에']]},
  zoneArea:[0,5,4,12],par:12,turnLimit:14,
  enemies:[u2300('boss','오스윈 경 · 청백 깃발','captain',19,1,{hp:120,atk:20,def:10,res:5,spd:7,holdUntil:5,...lord23('a')}),guardA2('a','lg1',19,2),guardA2('a','lg2',20,2),
   arm23('a','la1',17,2),arm23('a','la2',22,2),bow23('a','la3',21,1),arm23('a','la4',19,4),arm23('a','la7',20,4),arm23('a','la8',16,5),arm23('a','la9',23,5),arm23('a','la10',17,6),arm23('a','la11',22,6),
   u2300('boss2','브레넌 경 · 주황 깃발','captain',20,16,{hp:120,atk:20,def:10,res:5,spd:7,holdUntil:5,...lord23('b')}),guardA2('b','lg3',19,15),guardA2('b','lg4',20,15),
   arm23('b','lb1',17,15),arm23('b','lb2',22,15),bow23('b','lb3',18,16),arm23('b','lb4',19,13),arm23('b','lb7',20,13),arm23('b','lb8',16,12),arm23('b','lb9',23,12),arm23('b','lb10',17,11),arm23('b','lb11',22,11)],
  civilians:[{id:'v1',name:'마을 노인',x:14,y:7,hp:26,def:2},{id:'v2',name:'마을 아이',look:'child',x:24,y:10,hp:22,def:1},{id:'v3',name:'방앗간 주인',x:15,y:10,hp:26,def:2}],
  allies:{dario_blade:[5,8]},
  waves:[{turn:4,story:'10:reinforce',units:[arm23('a','la5',17,1),arm23('a','la6',22,1),arm23('b','lb5',17,16),arm23('b','lb6',22,16)]},
   {turn:6,units:[arm23('a','la12',26,2),arm23('a','la13',26,4),arm23('b','lb12',26,15),arm23('b','lb13',26,13)]}],
  deploy:[[4,8],[4,9],[3,7],[3,10],[2,8],[2,9],[4,6],[4,11],[3,5],[3,12],[1,7],[1,10]],
  objective:'출전 전 선택 — 지원: 상대 영주 지휘관 격파·생포 / 중재: 두 지휘관 모두 생포(생포한 쪽 군은 물러남) · TURN 14 안에',
  brief:'군단은 서쪽에서 들어갑니다. 가운데 마을을 사이에 두고 북쪽에 오스윈 경의 요새, 남쪽에 브레넌 경의 요새가 있고, 두 영주군은 서로도 싸웁니다. 지원을 고르면 그 영주군이 동맹군이 되고, 그 영주는 쓰러지지 않습니다. 중재는 두 지휘관을 HP 절반 이하에서 인접해 생포해야 하며, 한 명이라도 쓰러뜨리면 중재는 실패합니다(전투는 두 지휘관이 모두 쓰러지면 끝납니다). TURN 5부터 병사들이 마을 주민을 노립니다. TURN 4 양쪽 요새, TURN 6 동쪽에서 증원.'}
};
// Applied after applyV200. Same shape as the ACT I big maps: the map and its layers, the units, objects, waves and the
// deployment zone; allies keep their stats and move to the new positions (extra fields such as post/leash override).
export function applyV230(MISSIONS){
 for(const [k,d] of Object.entries(V230_MISSIONS)){const id=+k,m=MISSIONS[id],rows=ROWS2300[id];
  m.map=g2300(rows);m.width=rows[0].length;m.height=rows.length;
  m.layers={terrain:m.map,collision:m.map.map(r=>r.map(t=>['x','w'].includes(t))),buildings:[],objects:[],actors:'units',effects:'feedback',events:'narrative'};
  for(const key of ['par','turnLimit','enemies','civilians','waves','objective','brief','breachRow','convoyGate','council'])if(d[key]!==undefined)m[key]=structuredClone(d[key]);
  m.reinforcements=[];m.v230=true;
  if(d.objects)m.objects=d.objects.map(([oid,name,kind,x,y,extra])=>({id:oid,name,kind,x,y,...(extra||{})}));
  for(const a of m.allies||[]){const p=d.allies?.[a.id];if(!p)continue;a.x=p[0];a.y=p[1];if(a.post&&!p[2])a.post={x:p[0],y:p[1]};Object.assign(a,structuredClone(p[2]||{}));}
  const taken=[...(m.civilians||[]),...(m.allies||[])].map(c=>[c.x,c.y]),spots=d.deploy.filter(([x,y])=>open2300(rows,x,y)&&!taken.some(([a,b])=>a===x&&b===y));
  const [zx0,zy0,zx1,zy1]=d.zoneArea,inZone=area2300(rows,zx0,zy0,zx1,zy1,taken);
  m.deployZone=()=>new Set(inZone.map(([x,y])=>`${x},${y}`));
  m.deployments={recommended:spots.slice(0,8),assault:spots.slice(0,8),defense:spots.slice(-8)};}
 return MISSIONS;}
