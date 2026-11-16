// v2.0.0 전장 개편 — ACT I on big maps (REFORM_DESIGN §2.4, Q2 approved, D-115; maps, units and numbers PROPOSED).
// The story, the objectives and the people stay; the ground, the direction of the march and the size change:
// M01 다방향 방어 · M02 추격 → · M03 유턴 · M04 공성 · M05 행군 ← · M06 포위 탈출 (south-west gate).
// Enemy numbers are authored at the mission level; core/stats8 scales them to the sortie's average (§6.1).
const grid=rows=>rows.map(r=>r.split(''));
const unit=(id,name,kind,x,y,stats={})=>({id,name,kind,x,y,hp:28,atk:12,def:4,res:3,spd:6,mov:3,range:kind==='archer'?[2,3]:[1,1],...stats});
const zone=cells=>new Set(cells.map(([x,y])=>`${x},${y}`));
const open=(rows,x,y)=>!!rows[y]&&!'xw'.includes(rows[y][x]??'x');
const area=(rows,x0,y0,x1,y1,skip=[])=>{const out=[];for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(open(rows,x,y)&&!skip.some(([a,b])=>a===x&&b===y))out.push([x,y]);return out;};
const ROWS={
 1:["fffffffffffrrfffffffff","fffffffffffrrfffffffff","fffggggggggrrffggggfff","fffggggggfgrrggggggfff","fffgggggggxrrgvvvggfff","fffggggvvvgrrgvvvggggg","fffggfgvvvgrrgvvvggggg","fffggggvvvgrrggggggggg","fffggggggggrrrrrrrrrrr","fffgrrrrrrrrrrrrrrrrrr","fffgrrrrrrrrgxgggffggg","fffgrrvvvgggggvvvggggg","fffgrrggggggggvvvfffff","fffgrrgggggggggfffffff","ffffffffffffffffffffff","ffffffffffffffffffffff"],
 2:["ffffffffffffffffffffffffffff","ffffffffffffffffmmmfffffffff","ffffffffggggffffmmmfffffffff","ffffffffggggffffmmmfffffffff","ffffffrrggggrrrfffffffggggff","gggggfrrghggrrrfffffffggggff","gggggfrrggggfrrfffffrrggggrr","gggggrrrfffffrrfffffrrggggrr","gggggrrffffffrrggggfrrggggff","gggggffffffffrrggggrrrggggff","gggggfffffmmmrrggggrrfffsssf","ffffffffffmmmffggggfffffsssf","ffffffffffmmmffggggfffffsssf","ffffffffffffffffffffffffffff"],
 3:["ggggggggfffffffgffffffffff","ggggggggfffffffgffffffffff","ggggggggfffffffgffffffffff","gggrrgggfffffffgffffffffff","gggrrgggggggggfgffffffffff","gggrrgggggffggggggggffffff","gggrrrrrrrrrrrrrrrggffffff","gggrrrrrrrrrrrrrrrggffffff","wwwwwxxwwwwwwwwwbbbwwwwwww","wwwwwxxwwwwwwwwwbbbwwwwwww","ggggggggggggggggggggffffff","gggrrrrrrrrrrrrrrrggffffff","ffgrrrrrrrrrrrrrrrgfffffff","ffgrrggggfffffmmgggfffffff","ffgrrggggfffffmmgggfffffff","ffgrrggggfffffgggggfffffff","ffgrrggggfffffgggggfffffff","ffgggggggfffffgggggfffffff"],
 4:["fffxxxxxxxxxxxxxxxxxxfff","fffxkkkkxkkkkkkxkkkkxfff","fffxkkkkxkkkkkkxkkkkxfff","fffxkkkkxkkkkkkxkkkkxfff","fffxkkkkxkkkkkkxkkkkxfff","fffxxxxkxxxkkxxxkxxxxfff","fffxggggggggggggggggxfff","gggxggggggggggggggggxfff","gggggggggghgggggggggxfff","ggggggggggggggggggggxfff","gggxggggggggggggggggxfff","fffxggggggggggggggggxfff","fffxqqqqqqqkkqqqqqqqxfff","fffxxxxxxxxkkxxxxxxxxfff","gggggggggggrrggggggggggg","fffggggggggrrggggggggfff","fffggggggggrrggggggggfff","fffgfffffggrrgggffffffff","fffgfffffggrrgggffffffff","fffgfffffggrrgggffffffff"],
 5:["mmmmmmmmmmmmmmmmmmmmmmmmmmmm","mmmmmmmmmmmmmmmmmmmmmmmmmmmm","ggffffggggggggmmmmggggggffff","ggffffggggggggmmmmggggggffff","ggffffggggggggmmmmggggggffff","ggffffgggggmmgggggggggggffff","gggggggggggmmggggggggggggggg","gggggggggggggggggggggggggggg","rrrrrrrrrrrrrrrrrrrrrrrrrrrr","rrrrrrrrrrrrrrrrrrrrrrrrrrrr","gggggggggggggggggggggggggggg","ggggggffffgmmgggggfffffggggg","ggggggffffgmmgggggfffffggggg","ggggggffffggggggggfffffggggg","ffffffffffffffffffffffffffff","ffffffffffffffffffffffffffff"],
 6:["fffffffgggggrrgggggggggg","fffffffgggggrrgggggggggg","fffffffgggggrrgggmmmmmmm","fffffffgggggrrgggmmmmmmm","fffffffgggggrrgggmmmmtmm","fffffffgggggrrgggmmmmmmm","fffffffgggggrrgggmmmmmmm","gggggggggggggggggggggggg","ggggggggggvvvvvggggggggg","gkkggxxgggvvvvvggggggggg","gggrrrrrrgvvvvvgrrrrrrrr","gggrrrrrrgvvvvvgrrrrrrrr","gggrrgggggvvvvvggggxxggg","gggrrggggggggggggggxxggg","gggrrgggggggggggffffffff","xxxkkxxxggggggggffffffff","gggggggxfffffgggffffffff","gggggggxfffffgggffffffff","rrrrrrrxfffffgggffffffff","rrrrrrrxfffffgggffffffff"]
};
const deploySpots=cells=>({recommended:cells.slice(0,8),assault:cells.slice(0,8),defense:cells.slice(-8)});
export const V200_MISSIONS={
 1:{zoneArea:[4,10,9,13],level:1,threatTurn:5,par:9,turnLimit:14,
  enemies:[unit('boss','가르 — 산적 두목','captain',13,4,{hp:62,atk:15,def:7,res:4,spd:6,mov:3,carries:'garrRing',hold:6}),
   unit('b1','룩','bandit',11,2,{hp:24,atk:11,def:3}),unit('b2','바르','bandit',12,3,{hp:26,atk:11,def:4}),unit('a1','애시 보우','archer',9,2,{hp:22,atk:10,def:2,spd:7}),
   unit('b3','동쪽 습격대원','bandit',19,8,{hp:24,atk:11,def:3}),unit('b4','동쪽 습격대원','bandit',20,9,{hp:24,atk:11,def:3}),unit('a2','동쪽 사수','archer',18,6,{hp:22,atk:10,def:2,spd:7}),
   unit('r1','약탈자','bandit',9,7,{hp:24,atk:10,def:3}),unit('r2','약탈자','bandit',15,7,{hp:24,atk:10,def:3}),
   unit('b5','남동 습격대원','bandit',16,10,{hp:24,atk:11,def:3}),unit('b6','남동 습격대원','bandit',18,11,{hp:24,atk:11,def:3,hold:4})],
  civilians:[{id:'c1',name:'미라',x:16,y:5},{id:'c2',name:'토마스',x:8,y:5}],
  waves:[{turn:3,units:[unit('n1','북쪽 습격대원','bandit',4,2,{hp:23,atk:10,def:3}),unit('n2','북쪽 궁수','archer',18,2,{hp:21,atk:10,def:2,spd:7})]},
   {turn:5,units:[unit('e1','동쪽 증원','bandit',21,8,{hp:24,atk:11,def:3}),unit('e2','동쪽 증원','bandit',21,9,{hp:24,atk:11,def:3})]}],
  deploy:[[5,11],[4,10],[6,12],[5,13],[7,11],[4,12],[6,13],[8,12],[7,13],[9,12],[8,13],[5,10],[6,10]],
  objective:'주민 2명 구출 + 가르 격파',
  brief:'북쪽 길과 동쪽 길로 산적이 동시에 들이칩니다. 주민은 서쪽 집(토마스)과 동쪽 집(미라)에 있습니다 — 군을 나눠야 합니다. T3 북쪽 증원 · T5 동쪽 증원과 주민 위협. 구조는 인접해서 행동 1회. 가르는 쇠가락지를 지녔습니다.'},
 2:{zoneArea:[0,5,4,10],level:2,threatTurn:99,par:8,turnLimit:8,escapeX:27,
  enemies:[{...unit('boss','도주 대장','captain',17,9,{hp:54,atk:12,def:4,res:3,spd:6,mov:2,carries:'runnerMapCase'})},
   unit('b1','탈영병','bandit',7,6,{hp:28}),unit('a1','숲의 사수','archer',9,3,{hp:25,spd:7}),unit('b2','굶주린 습격자','bandit',12,5,{hp:28}),
   unit('s1','후미 창병','spear',13,8,{hp:28,def:5}),unit('b3','후미 경계병','bandit',14,7,{hp:28}),unit('a2','숲의 사수','archer',16,11,{hp:25,spd:7}),
   unit('b4','탈영병','bandit',20,8,{hp:28}),unit('b5','탈영병','bandit',21,6,{hp:28}),unit('a3','숲의 사수','archer',23,5,{hp:25,spd:7,hold:5}),unit('s2','출구 창병','spear',25,7,{hp:28,def:5,hold:5})],
  civilians:[],waves:[],
  deploy:[[2,7],[1,6],[3,8],[1,8],[3,6],[0,7],[4,9],[0,9],[2,5],[4,5]],
  objective:'도주 대장 생포 또는 추격 종료 (8턴)',
  brief:'숲길이 동쪽으로 굽이칩니다. 도주 대장은 동쪽 끝(출구)으로 달아납니다 — 후미대를 뚫고 따라잡으세요. HP 절반 이하면 인접 장수가 생포(지도통을 얻음). 생포 실패도 진행 가능.'},
 3:{zoneArea:[2,12,8,16],level:3,threatTurn:3,par:13,turnLimit:15,safe:[0,0,7,3],
  enemies:[unit('boss','추격 지휘관','captain',10,16,{hp:55,atk:13,def:5,res:3,spd:6,mov:3,carries:'pursuerGreaves'}),
   unit('b3','남쪽 추격병','bandit',12,12,{hp:26}),unit('b4','남쪽 추격병','bandit',15,13,{hp:26}),
   unit('s1','여울 창병','spear',16,6,{hp:28,def:5,hold:4}),unit('b1','북쪽 매복병','bandit',8,5,{hp:26}),unit('b2','북쪽 매복병','bandit',12,6,{hp:26}),
   unit('a1','강 건너 사수','archer',10,7,{hp:24,spd:7,mov:2}),unit('a2','강 건너 사수','archer',19,7,{hp:24,spd:7,mov:2}),unit('b5','출구 경계병','bandit',4,3,{hp:26,hold:5})],
  civilians:[{id:'c1',name:'부상한 미라',x:4,y:13},{id:'c2',name:'토마스',x:6,y:13}],
  waves:[{turn:3,units:[unit('r1','후방 추격병','bandit',3,17,{hp:24}),unit('r2','후방 사수','archer',7,17,{hp:22,spd:7}),unit('r3','후방 추격병','bandit',15,17,{hp:24})]},
   {turn:5,units:[unit('r6','동쪽 추격병','bandit',18,12,{hp:26}),unit('r7','동쪽 추격 사수','archer',18,13,{hp:22,spd:7}),unit('r8','동쪽 추격병','spear',17,13,{hp:26,def:5})]},
   {turn:6,units:[unit('r4','북쪽 길목병','bandit',1,0,{hp:24}),unit('r5','북쪽 길목병','bandit',6,1,{hp:24})]}],
  deploy:[[3,12],[4,12],[5,12],[3,14],[5,14],[2,13],[4,15],[6,15],[2,15],[7,12]],
  objective:'15턴 안에 1명 이상 구조 + 생존 장수 전원 북서쪽 출구로 철수',
  brief:'다리가 무너졌습니다. 동쪽 여울목의 징검다리로 돌아 건너 북쪽 강변길을 되짚어 북서쪽 출구(왼쪽 위)로 철수합니다. 장수가 인접한 주민은 매 턴 출구 쪽으로 2칸 따라옵니다. 인접 구출은 즉시 안전 이송. 강 건너 사수가 남쪽 길을 노립니다.'},
 4:{zoneArea:[3,14,20,16],par:11,turnLimit:16,
  enemies:[unit('boss','성채 병참관','captain',12,2,{hp:96,atk:20,def:10,res:4,spd:6,mov:0,alertMov:3,carries:'quartermasterSeal'}),
   unit('w1','성벽 사수','archer',6,12,{hp:26,atk:13,def:3,spd:7,mov:0}),unit('w2','성벽 사수','archer',17,12,{hp:26,atk:13,def:3,spd:7,mov:0}),
   unit('g1','관문 경비병','bandit',11,11,{hp:32}),unit('g2','관문 경비병','bandit',12,11,{hp:32}),
   unit('s1','성채 창병','spear',10,7,{hp:30,def:5}),unit('s2','성채 창병','spear',13,7,{hp:30,def:5}),
   unit('g3','성채 경비병','bandit',7,9),unit('g4','성채 경비병','bandit',16,9),unit('g5','서쪽 경비병','bandit',4,9,{hold:3}),
   unit('g6','보관실 경비병','bandit',11,3,{hp:32,def:6}),unit('a3','안뜰 사수','archer',14,6,{hp:24,atk:12,def:3,spd:7}),unit('s3','보관실 창병','spear',13,3,{hp:30,def:5}),unit('s4','보관실 창병','spear',10,3,{hp:30,def:5}),unit('a4','안쪽 사수','archer',11,7,{hp:24,atk:12,def:3,spd:7}),
   unit('t1','횃불 병참병','bandit',6,2,{hp:24,atk:11,def:3,mov:0,burns:'seal'}),unit('t2','횃불 병참병','bandit',17,2,{hp:24,atk:11,def:3,mov:0,burns:'orders'})],
  waves:[{turn:4,story:'4:reinforce',units:[unit('r1','지하 창고병','bandit',9,10,{hp:28}),unit('r2','지하 창고병','bandit',14,10,{hp:28}),unit('r5','지하 창고 사수','archer',12,9,{hp:24,spd:7})]},
   {turn:6,units:[unit('r6','기록실 호위병','spear',5,3,{hp:30,def:5}),unit('r7','기록실 호위병','spear',18,3,{hp:30,def:5})]},
   {turn:7,units:[unit('r3','성채 순찰대','bandit',11,19,{hp:28}),unit('r4','성채 순찰대','spear',12,19,{hp:28,def:5})]}],
  objects:[['e1','보급 장부','ledger',13,1],['e2','봉인술 기록','seal',5,1],['e3','이송 군령','orders',18,1]],
  deploy:[[11,15],[12,15],[10,16],[13,16],[9,15],[14,15],[11,17],[12,17],[8,16],[15,16],[4,15],[19,15],[6,14],[17,14]],
  routeDeploy:[[0,7],[1,7],[0,8],[1,8]],
  objective:'보급 장부 확보 + 성채 병참관 격파',
  brief:'정문(성벽 사수 둘)과 무너진 서쪽 벽 가운데서 고르세요. 안뜰을 지나 세 기록실 문으로 들어갑니다. 증거 지점에 인접해 조사(행동 1회). TURN 7이 끝나면 살아 있는 횃불 병참병이 맡은 기록을 태웁니다. TURN 7에 남쪽에서 순찰대가 뒤를 칩니다. 제한 16턴.'},
 5:{zoneArea:[21,6,27,12],par:9,turnLimit:10,
  enemies:[unit('boss','발드릭 로엔 · 검은 사자','lion',8,8,{hp:84,atk:18,def:9,res:5,spd:7,mov:3}),
   unit('f1','사자 기수','bearer',8,6,{hp:30,atk:9,def:5,res:3,spd:5,mov:2}),unit('f2','사자 기수','bearer',8,11,{hp:30,atk:9,def:5,res:3,spd:5,mov:2}),
   unit('s1','철왕관 창병','spear',10,7,{hp:30,atk:14,def:6,spd:5}),unit('s2','철왕관 창병','spear',10,10,{hp:30,atk:14,def:6,spd:5}),
   unit('s3','철왕관 창병','spear',6,7,{hp:30,atk:14,def:6,spd:5}),unit('s4','철왕관 창병','spear',6,10,{hp:30,atk:14,def:6,spd:5}),
   unit('i1','철왕관 보병','soldier',12,8,{hp:30,atk:13,def:6,spd:5}),unit('i2','철왕관 보병','soldier',12,9,{hp:30,atk:13,def:6,spd:5}),
   unit('a1','철왕관 궁수','archer',5,4,{hp:26,atk:13,def:3,spd:7,mov:2}),unit('a2','철왕관 궁수','archer',5,12,{hp:26,atk:13,def:3,spd:7,mov:2})],
  civilians:[{id:'w1',name:'보급 마차',kind:'wagon',x:24,y:10,hp:56,def:8,res:6},{id:'w2',name:'보급 마차',kind:'wagon',x:26,y:7,hp:56,def:8,res:6}],
  waves:[{turn:4,story:'5:reinforce',units:[unit('c1','철왕관 기병','cavalry',27,13,{hp:30,atk:13,def:5,res:2,spd:9,mov:5,movementProfile:'cavalry'}),unit('c2','철왕관 기병','cavalry',26,13,{hp:30,atk:13,def:5,res:2,spd:9,mov:5,movementProfile:'cavalry'})]},
   {turn:6,units:[unit('c3','철왕관 기병','cavalry',27,2,{hp:30,atk:13,def:5,res:2,spd:9,mov:5,movementProfile:'cavalry'})]}],
  deploy:[[22,8],[22,9],[23,7],[23,10],[21,8],[24,8],[25,9],[21,9],[23,11],[25,11],[22,6],[26,10]],
  objective:'사자 대형 붕괴(기수 2명 격파 + 발드릭 HP 50% 이하) 또는 TURN 10까지 보급 마차 1대 이상 사수',
  brief:'서쪽 길을 막고 선 사자 대형으로 행군합니다. 사자 기수 옆의 적은 단단하고 명중이 높습니다. 발드릭은 아군이 붙어 있지 않은 고립된 장수를 노립니다. TURN 4 남동쪽, TURN 6 북동쪽에서 기병이 마차를 노리고 들이칩니다.'},
 6:{zoneArea:[9,7,15,13],par:11,turnLimit:18,safe:[0,16,6,19],gateGoal:{x:3,y:16},
  enemies:[unit('boss','봉쇄 집행관','captain',3,17,{hp:72,atk:17,def:8,res:5,spd:6,mov:0,breakMov:3}),
   unit('k1','왕실 봉인대','bandit',1,12,{hp:30,atk:14,def:6,spd:5,mov:2}),unit('k2','왕실 봉인대','bandit',2,11,{hp:30,atk:14,def:6,spd:5,mov:2}),
   unit('k3','왕실 봉인대','bandit',6,12,{hp:30,atk:14,def:6,spd:5,mov:2}),unit('k4','왕실 봉인대','bandit',5,11,{hp:30,atk:14,def:6,spd:5,mov:2}),
   unit('n1','북쪽 포위대','bandit',11,4,{hp:30,atk:14,def:6,spd:5}),unit('n2','북쪽 포위대','spear',13,4,{hp:30,atk:14,def:6,spd:5}),unit('a1','봉인대 궁수','archer',12,2,{hp:24,atk:13,def:3,spd:7,mov:2}),
   unit('e1','동쪽 포위대','bandit',18,10,{hp:30,atk:14,def:6,spd:5}),unit('e2','동쪽 포위대','spear',19,11,{hp:30,atk:14,def:6,spd:5}),unit('a2','봉인대 궁수','archer',21,8,{hp:24,atk:13,def:3,spd:7,mov:2}),
   unit('s1','남쪽 포위대','spear',14,15,{hp:30,atk:14,def:6,spd:5}),unit('s2','남쪽 포위대','bandit',15,16,{hp:30,atk:14,def:6,spd:5}),
   unit('beacon','감시탑 봉화','beacon',21,4,{hp:26,atk:0,def:3,res:3,spd:0,mov:0,range:[0,0],noScale:true})],
  civilians:[{id:'p1',name:'피난민 노인',x:11,y:9,hp:30,def:3},{id:'p2',name:'부상한 피난민',x:13,y:9,hp:30,def:3,startHP:13},{id:'p3',name:'피난민 어머니',x:11,y:11,hp:30,def:3},{id:'p4',name:'부상한 소년',x:13,y:11,hp:30,def:3,startHP:14}],
  objects:[['seal1','봉인석','sealstone',2,14,{locked:true,progress:0}],['seal2','봉인석','sealstone',5,14,{locked:true,progress:0}],['lever','측면 관문 레버','lever',8,13],['sidegate','측면 관문','gate',1,9,{inert:true}]],
  waves:[{trigger:'start',when:'reported',story:'6:inspector',units:[unit('i1','군령부 감찰관','bandit',23,10,{hp:32,atk:15,def:6,spd:6})]},
   {trigger:'phase2',story:'6:pursuers',units:[unit('r1','북쪽 추격대','bandit',12,0,{hp:28,atk:14,def:5,spd:6}),unit('r2','동쪽 추격대','bandit',23,11,{hp:28,atk:14,def:5,spd:6})]},
   {trigger:'phase3',unlessBeacon:true,story:'6:garrison',units:[unit('g1','관문 수비대','bandit',1,18,{hp:30,atk:14,def:6,spd:5}),unit('g2','관문 수비대','bandit',5,18,{hp:30,atk:14,def:6,spd:5})]}],
  deploy:[[12,10],[10,10],[14,10],[12,8],[12,12],[10,8],[14,8],[10,12],[14,12],[12,7],[9,10],[15,10]],
  objective:'피난민 호위 → 봉인석 2개 해제(TURN 11 종료 전) → 봉쇄 집행관 격파 또는 생존 장수 전원 남서쪽 관문 너머로 철수',
  brief:'포위된 마을 한가운데서 시작합니다. 남서쪽 관문(왼쪽 아래)이 탈출구입니다. 장수가 인접한 피난민은 매 턴 관문 쪽으로 2칸 이동합니다(HP 절반 이하는 세인의 치유가 필요). 피난민 2명 통과 또는 TURN 5에 2단계: 관문 앞 봉인석에 인접해 해제(리아 1회, 다른 장수 2회 누적). 레버는 측면 관문을 엽니다. 동쪽 산 위 봉화를 부수면 3단계 증원이 오지 않습니다.'}
};
// Rebuilds MISSIONS[1..6] on the big maps. Called at the end of missions.js.
export function applyV200(MISSIONS){
 for(const [k,d] of Object.entries(V200_MISSIONS)){const id=+k,m=MISSIONS[id],rows=ROWS[id];
  m.map=grid(rows);m.width=rows[0].length;m.height=rows.length;
  m.layers={terrain:m.map,collision:m.map.map(r=>r.map(t=>['x','w'].includes(t))),buildings:[],objects:[],actors:'units',effects:'feedback',events:'narrative'};
  for(const key of ['level','threatTurn','par','turnLimit','enemies','civilians','waves','objective','brief','escapeX','safe','gateGoal'])if(d[key]!==undefined)m[key]=structuredClone(d[key]);
  m.reinforcements=[];m.v200=true;
  if(d.objects)m.objects=d.objects.map(([oid,name,kind,x,y,extra])=>id===4?{id:oid,name,kind:'evidence',evidence:kind,x,y}:{id:oid,name,kind,x,y,...(extra||{})});
  const civ=(m.civilians||[]).map(c=>[c.x,c.y]),spots=d.deploy.filter(([x,y])=>open(rows,x,y)&&!civ.some(([a,b])=>a===x&&b===y));
  const [zx0,zy0,zx1,zy1]=d.zoneArea,wagons=(m.civilians||[]).filter(c=>c.kind==='wagon').map(c=>[c.x,c.y]),inZone=area(rows,zx0,zy0,zx1,zy1,[...civ,...wagons]);
  m.deployZone=s=>zone([...inZone,...(id===4&&s?.campaign?.flags?.mission_02_supply_route_discovered?d.routeDeploy:[])]);
  m.deployments=deploySpots(spots);}
 // M04 carriers of the torch keep their records; M06 stone guards keep their stones (core/mission-rules GUARD_STONE)
 return MISSIONS;}
