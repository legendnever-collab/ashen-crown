import {MAP,ENEMIES,CIVILIANS,REINFORCEMENTS,TERRAIN} from './game-data.js';
const grid=rows=>rows.map(r=>r.split(''));
const patrol=(id,name,x,y,kind='bandit',hp=28)=>({id,name,x,y,kind,hp,atk:12,def:4,res:3,spd:6,mov:3,range:kind==='archer'?[2,3]:[1,1]});
export const MISSIONS={
 1:{id:1,title:'잿빛 마을의 습격',en:'The Ashen Village',map:MAP,enemies:ENEMIES,civilians:CIVILIANS,reinforcements:REINFORCEMENTS,threatTurn:5,par:8,objective:'주민 2명 구출 + 가르 격파',brief:'T3 북쪽 증원 · T5 주민 위협. 구조는 인접해서 행동 1회.'},
 2:{id:2,title:'숲길의 추격',en:'Forest Pursuit',map:grid(['fgrrrgrrrgff','fgrgrfrgrgff','fggffrffggff','ffgffrffgfff','fggrrrrggfff','fgrffrffrgff','fgfffrrffgff','grgggrrgggrg','grgggrrgggrg','ggggrrrrgggg']),enemies:[patrol('b1','탈영병',3,5),patrol('b2','굶주린 습격자',8,5),patrol('a1','숲의 사수',6,4,'archer',25),patrol('b3','후미 경계병',2,3),{...patrol('boss','도주 대장',5,3,'captain',54),mov:1}],civilians:[],reinforcements:[],threatTurn:99,par:8,turnLimit:8,objective:'도주 대장 생포 또는 추격 종료 (8턴)',brief:'도주 대장 HP 절반 이하 → 인접 장수의 생포. 북쪽 출구로 도망치기 전에 퇴로를 막으세요. 생포 실패도 진행 가능.'},
 3:{id:3,title:'무너진 다리',en:'The Broken Bridge',map:grid(['ggggrrrrgggg','ggggrrrrgggg','ggggrrrrgggg','xxxxxbbxxxxx','xxxxxbbxxxxx','ggggrrrrgggg','ggggrrrrgggg','grgggrrgggrg','grgggrrgggrg','ggggrrrrgggg']),enemies:[patrol('b1','추격 선봉',3,5),patrol('b2','추격병',8,5),patrol('a1','교량 사수',7,2,'archer',25),patrol('b3','북부 경계병',3,2),{...patrol('boss','추격 지휘관',6,1,'captain',55),mov:2}],civilians:[{id:'c1',name:'부상한 미라',x:4,y:6},{id:'c2',name:'토마스',x:7,y:6}],reinforcements:[patrol('r1','후방 추격병',0,9),patrol('r2','후방 사수',11,9,'archer',24)],threatTurn:3,par:10,turnLimit:10,objective:'10턴 안에 1명 이상 구조 + 생존 장수 전원 북쪽 철수',brief:'장수가 인접한 주민은 매 턴 다리를 건너 이동합니다. 인접 구출은 즉시 안전 이송. y≤2에 생존 장수 전원이 모이면 철수. 전원 구조에 도전하세요.'}
};
export const missionOf=s=>MISSIONS[s?.missionId||1];

// Preserve all old core coordinates for migration, add authored flanking regions.
for(const m of Object.values(MISSIONS)){const original=m.map.map(row=>[...row]);const width={1:16,2:18,3:14}[m.id],height={1:12,2:14,3:12}[m.id];m.map=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>{if(y<10&&x<12)return original[y][x];if(m.id===1)return x===13?'r':(y===2||y===6)&&x>13?'v':y===11?'f':'g';if(m.id===2)return x===13||y===11?'r':x===14&&y<8?'m':x>=16?'f':(x+y)%4===0?'f':'g';return y===3||y===4?'w':x===12?'r':'g';}));m.width=width;m.height=height;m.layers={terrain:m.map,collision:m.map.map(row=>row.map(t=>['x','w'].includes(t))),buildings:[],objects:[],actors:'units',effects:'feedback',events:'narrative'};if(m.id===1)m.layers.buildings=[{x:2,y:1,w:1,h:2,type:'residence',state:'burning'},{x:9,y:1,w:1,h:2,type:'residence',state:'burning'},{x:14,y:2,w:2,h:2,type:'depot',state:'burning'},{x:14,y:6,w:2,h:2,type:'residence',state:'intact'}];}
export const mapDimensions=s=>({width:missionOf(s).map[0].length,height:missionOf(s).map.length});

// Limited tactical supply sites; old core routes and victory deadlines stay intact.
MISSIONS[2].map[6][9]='h';
MISSIONS[3].map[5][5]='t';

// v0.4 ACT I missions are authored at full size; M01–03 data above stays unchanged.
const unit=(id,name,kind,x,y,stats={})=>({id,name,kind,x,y,hp:30,atk:13,def:5,res:3,spd:6,mov:3,range:kind==='archer'?[2,3]:[1,1],...stats});
const evidence=(id,name,type,x,y)=>({id,name,kind:'evidence',evidence:type,x,y});
function authored(m){m.map=grid(m.rows);delete m.rows;m.width=m.map[0].length;m.height=m.map.length;m.layers={terrain:m.map,collision:m.map.map(row=>row.map(t=>['x','w'].includes(t))),buildings:[],objects:[],actors:'units',effects:'feedback',events:'narrative'};m.objects=m.objects||[];m.waves=m.waves||[];m.reinforcements=m.reinforcements||[];m.civilians=m.civilians||[];return m;}
const zone=(cells)=>new Set(cells.map(([x,y])=>`${x},${y}`));
MISSIONS[4]=authored({id:4,title:'버려진 성채',en:'The Abandoned Fortress',
 rows:['xxxxxxxxxxxxxxxx','xkkkxkkkkkkxkkkx','xkkkxkkkkkkxkkkx','xkkkxxxkkxxxkkkx','xqkkkkkkkkkkkkqx','xxxkxxggggxxkxxx','xkkkxggggggxkkkx','xkkkkggghgggkkkx','xkkkxggggggxkkkx','xxkxxxggggxxxkxx','xxkxxqkkkkqxxkxx','grrrrrrrrrrrrrrg','ggggggggggmggggg','gggfffgggggfffgg'],
 enemies:[
  unit('boss','성채 병참관','captain',7,2,{hp:66,atk:16,def:7,res:4,spd:6,mov:0,alertMov:3}),
  unit('w1','성벽 사수','archer',1,4,{hp:26,atk:13,def:3,spd:7,mov:0}),
  unit('w2','성벽 사수','archer',14,4,{hp:26,atk:13,def:3,spd:7,mov:0}),
  unit('g1','성채 경비병','bandit',3,5),unit('g2','성채 경비병','bandit',12,5),
  unit('g3','관문 경비병','bandit',7,9,{hp:32}),unit('g4','보관실 경비병','bandit',8,3,{hp:32,def:6}),
  unit('t1','횃불 병참병','bandit',2,2,{hp:24,atk:11,def:3,mov:0,burns:'seal'}),
  unit('t2','횃불 병참병','bandit',13,2,{hp:24,atk:11,def:3,mov:0,burns:'orders'})],
 waves:[{turn:4,story:'4:reinforce',units:[unit('r1','지하 창고병','bandit',6,6,{hp:28}),unit('r2','지하 창고병','bandit',9,8,{hp:28})]}],
 objects:[evidence('e1','보급 장부','ledger',8,1),evidence('e2','봉인술 기록','seal',1,1),evidence('e3','이송 군령','orders',14,1)],
 deployZone:s=>{const base=[];for(let y=11;y<=13;y++)for(let x=0;x<16;x++)base.push([x,y]);if(s?.campaign?.flags?.mission_02_supply_route_discovered)base.push([2,8],[2,9],[2,10]);return zone(base);},
 deployments:{recommended:[[7,11],[5,12],[8,12],[7,13],[10,12]],assault:[[6,11],[4,11],[9,11],[7,12],[11,11]],defense:[[7,12],[5,13],[9,13],[7,13],[11,12]]},
 threatTurn:99,par:9,turnLimit:14,burnTurn:8,level:5,
 objective:'보급 장부 확보 + 성채 병참관 격파',
 brief:'증거 지점에 인접해 조사(행동 1회). TURN 7이 끝나면 살아 있는 횃불 병참병이 맡은 기록을 태웁니다. 보급 장부는 소각되지 않습니다. 제한 14턴.'});
// M05 The Lion of the Frontier: Baldrick's formation on the northern ridge, refugee wagons on the
// southern road. Victory A (formation broken) or B (road held through TURN 10).
MISSIONS[5]=authored({id:5,title:'국경의 사자',en:'The Lion of the Frontier',
 rows:['mmmmmmmrrrrmmmmmmm','mmmmmmgrrrrgmmmmmm','ffmmgggrrrrgggmmgg','fffgggggrrgggggmgg','ffffggggrrgggggggg','ffffggggrrgmmggggg','fffgggggrrgmmggggg','fffggggggrrggggggg','ffgggggggrrggggggg','ffggggggrrrggggggg','fgggggggrrgggggggg','rrrrrrrrrrrrrrrrrr','ggggggggggggggggff','fgggggggggggggggff'],
 enemies:[
  unit('boss','발드릭 로엔 · 검은 사자','lion',9,2,{hp:84,atk:18,def:9,res:5,spd:7,mov:3}),
  unit('f1','사자 기수','bearer',7,3,{hp:30,atk:9,def:5,res:3,spd:5,mov:2}),
  unit('f2','사자 기수','bearer',11,3,{hp:30,atk:9,def:5,res:3,spd:5,mov:2}),
  unit('s1','철왕관 창병','spear',6,4,{hp:30,atk:14,def:6,spd:5}),unit('s2','철왕관 창병','spear',12,4,{hp:30,atk:14,def:6,spd:5}),
  unit('s3','철왕관 창병','spear',8,5,{hp:30,atk:14,def:6,spd:5}),unit('s4','철왕관 창병','spear',10,6,{hp:30,atk:14,def:6,spd:5}),
  unit('a1','철왕관 궁수','archer',14,2,{hp:26,atk:13,def:3,spd:7,mov:2})],
 civilians:[{id:'w1',name:'보급 마차',kind:'wagon',x:5,y:11,hp:34,def:4,res:4},{id:'w2',name:'보급 마차',kind:'wagon',x:12,y:11,hp:34,def:4,res:4}],
 waves:[{turn:4,story:'5:reinforce',units:[unit('c1','철왕관 기병','cavalry',17,7,{hp:30,atk:15,def:5,res:2,spd:9,mov:5,movementProfile:'cavalry'}),unit('c2','철왕관 기병','cavalry',17,8,{hp:30,atk:15,def:5,res:2,spd:9,mov:5,movementProfile:'cavalry'})]}],
 formation:{bearers:['f1','f2'],def:2,hit:10,charge:4,leash:2},
 deployZone:s=>{const base=[];for(let y=10;y<=13;y++)for(let x=1;x<17;x++)if(!(y===11&&(x===5||x===12)))base.push([x,y]);return zone(base);},
 deployments:{recommended:[[8,10],[6,12],[10,12],[8,12],[11,10]],assault:[[9,10],[7,10],[10,11],[8,11],[12,10]],defense:[[5,10],[7,12],[11,12],[6,12],[12,10]]},
 threatTurn:99,par:8,turnLimit:10,level:6,
 objective:'사자 대형 붕괴(기수 2명 격파 + 발드릭 HP 50% 이하) 또는 TURN 10까지 보급 마차 1대 이상 사수',
 brief:'사자 기수 옆의 적은 DEF+2·명중+10. 발드릭은 아군이 붙어 있지 않은 고립된 장수를 노립니다(피해+4). TURN 4에 동쪽에서 기병 2기가 마차를 노리고 진입합니다.'});
// M06 The Ashen Oath (ACT I finale): escort four refugees through the border gate, unseal the two
// seal stones before TURN 11 ends, then break out north. Phase rules live in core/mission-rules.js.
const sealObject=(id,name,kind,x,y,extra={})=>({id,name,kind,x,y,...extra});
MISSIONS[6]=authored({id:6,title:'재의 맹세',en:'The Ashen Oath',
 rows:['ffgggggrrrrgggggff','fggggggrrrrggggggf','ggggxgggrrgggxgggg','xrxxqxxxrrxxxqxxxx','ggggxggkrrkggxggmm','ggggggggrrgggggmmm','fgggggggrrgggggmkm','ffggggggrrgggggmmg','ffggfgggrrggfgggfg','fgggffggrrggffgggf','ggggggggrrgggggggg','ggvgggggrrggggvggg','gggggggrrrrggggggg','ggggggrrrrrrgggggg','fgggggggrrggggggff','ffggggggrrgggggfff'],
 enemies:[
  unit('boss','봉쇄 집행관','captain',9,1,{hp:72,atk:17,def:8,res:5,spd:6,mov:0,breakMov:3}),
  unit('k1','왕실 봉인대','bandit',6,4,{hp:30,atk:14,def:6,spd:5,mov:2}),unit('k2','왕실 봉인대','bandit',7,5,{hp:30,atk:14,def:6,spd:5,mov:2}),
  unit('k3','왕실 봉인대','bandit',10,5,{hp:30,atk:14,def:6,spd:5,mov:2}),unit('k4','왕실 봉인대','bandit',11,4,{hp:30,atk:14,def:6,spd:5,mov:2}),
  unit('a1','봉인대 궁수','archer',4,3,{hp:24,atk:13,def:3,spd:7,mov:0}),unit('a2','봉인대 궁수','archer',13,3,{hp:24,atk:13,def:3,spd:7,mov:0}),
  unit('beacon','감시탑 봉화','beacon',16,6,{hp:26,atk:0,def:3,res:3,spd:0,mov:0,range:[0,0]})],
 civilians:[{id:'p1',name:'피난민 노인',x:6,y:12,hp:30,def:3},{id:'p2',name:'부상한 피난민',x:8,y:13,hp:30,def:3,startHP:13},{id:'p3',name:'피난민 어머니',x:11,y:12,hp:30,def:3},{id:'p4',name:'부상한 소년',x:13,y:13,hp:30,def:3,startHP:14}],
 objects:[sealObject('seal1','봉인석','sealstone',7,4,{locked:true,progress:0}),sealObject('seal2','봉인석','sealstone',10,4,{locked:true,progress:0}),sealObject('lever','측면 관문 레버','lever',2,7),sealObject('sidegate','측면 관문','gate',1,3,{inert:true})],
 waves:[{trigger:'start',when:'reported',story:'6:inspector',units:[unit('i1','군령부 감찰관','bandit',14,5,{hp:32,atk:15,def:6,spd:6})]},
  {trigger:'phase2',story:'6:pursuers',units:[unit('r1','남쪽 추격대','bandit',0,15,{hp:28,atk:14,def:5,spd:6}),unit('r2','남쪽 추격대','bandit',17,15,{hp:28,atk:14,def:5,spd:6})]},
  {trigger:'phase3',unlessBeacon:true,story:'6:garrison',units:[unit('g1','관문 수비대','bandit',7,1,{hp:30,atk:14,def:6,spd:5}),unit('g2','관문 수비대','bandit',10,1,{hp:30,atk:14,def:6,spd:5})]}],
 deployZone:s=>{const base=[];for(let y=11;y<=15;y++)for(let x=1;x<17;x++)base.push([x,y]);return zone(base.filter(([x,y])=>!MISSIONS[6].civilians.some(c=>c.x===x&&c.y===y)));},
 deployments:{recommended:[[8,11],[5,13],[9,12],[10,13],[12,12]],assault:[[8,11],[7,11],[9,11],[10,11],[6,11]],defense:[[7,12],[5,12],[9,14],[10,12],[12,14]]},
 threatTurn:3,par:10,sealTurn:11,level:7,turnLimit:18,escortOnly:true,healCivilians:true,
 objective:'피난민 호위 → 봉인석 2개 해제(TURN 11 종료 전) → 봉쇄 집행관 격파 또는 생존 장수 전원 관문 북쪽 철수',
 brief:'장수가 인접한 피난민은 매 턴 관문 쪽으로 2칸 이동합니다(HP 절반 이하는 세인의 치유가 필요). 피난민 2명 통과 또는 TURN 5에 2단계: 봉인석에 인접해 해제(리아 1회, 다른 장수 2회 누적). 서쪽 레버는 측면 관문을 엽니다. 동쪽 봉화를 부수면 3단계 증원이 오지 않습니다.'});
// v0.6 ACT II (D-055 §3, Phase D; maps, numbers and names PROPOSED). M07 Northern Orders: an Iron Crown supply
// convoy of three wagons drives up the snowy road to Ironhold's gate while deserters ambush it; Thea's escort (AI
// allies) rides with it. Two wagons through the gate wins. M08 Canyon Defense: hold the grey canyon beside Baldrick's
// troops; the command order (hold the canyon / send a rescue squad to the rear village) is chosen before battle.
const ally=(id,name,look,x,y,stats={})=>({id,name,look,kind:'soldier',x,y,hp:34,atk:14,def:8,res:3,spd:5,mov:3,range:[1,1],...stats});
const deserter=(id,name,x,y,stats={})=>unit(id,name,'bandit',x,y,{hp:32,atk:15,def:6,res:3,spd:6,mov:3,movementProfile:'rogue',...stats});
MISSIONS[7]=authored({id:7,title:'북부의 군령',en:'Northern Orders',
 rows:['mmmmmmmnrrnmmmmmmm','mmmmmnnrrrrnnmmmmm','mffnnnnrrrrnnnnmmm','fffnnnnrrrrnnnnnmm','ffnnnnnrrrrnnnnnnm','fnnnnnnrrrrnnnnnnn','wwwwwwwiiiiwwwwiww','wwwwwwwiiiiwwwwiww','nnnnnnnrrrrnnnnnnf','nfnnnnnrrrrhnnnnff','ffnnnnnrrrrnnnnnnf','fnnnnnnrrrrnnnnnnn','nnnnnnnrrrrnnnnnnn','nnnnnnnrrrrnnnnnnn'],
 enemies:[
  deserter('boss','탈영병 대장',2,3,{kind:'captain',hp:60,atk:17,def:8,res:4,spd:7}),
  deserter('d1','탈영병',1,4),deserter('d2','탈영병',4,2),deserter('d3','탈영병',16,8),deserter('d4','탈영병',17,10),
  unit('a1','탈영 궁수','archer',16,2,{hp:26,atk:14,def:3,res:3,spd:7,mov:2,movementProfile:'rogue'}),unit('a2','탈영 궁수','archer',15,1,{hp:26,atk:14,def:3,res:3,spd:7,mov:2,movementProfile:'rogue'})],
 civilians:[{id:'w1',name:'보급 마차',kind:'wagon',x:8,y:12,hp:48,def:7,res:5},{id:'w2',name:'보급 마차',kind:'wagon',x:9,y:12,hp:48,def:7,res:5},{id:'w3',name:'보급 마차',kind:'wagon',x:8,y:13,hp:48,def:7,res:5}],
 allies:[ally('thea_escort','테아 · 수송 호위대장','thea',10,12,{kind:'cavalry',hp:40,atk:16,def:7,spd:9,mov:5,movementProfile:'cavalry'}),ally('ic1','철왕관 보병','ironInfantry',7,12),ally('ic2','철왕관 보병','ironInfantry',9,13)],
 waves:[{turn:3,story:'7:ambush',units:[deserter('r1','후미 습격병',0,13),deserter('r2','후미 습격병',17,13)]},{turn:5,story:'7:gatewave',units:[deserter('r3','성문 습격병',7,1),deserter('r4','성문 습격병',11,1)]}],
 capture:'boss',
 deployZone:s=>{const base=[];for(let y=10;y<=13;y++)for(let x=3;x<=14;x++)if(!MISSIONS[7].civilians.some(c=>c.x===x&&c.y===y)&&!MISSIONS[7].allies.some(a=>a.x===x&&a.y===y))base.push([x,y]);return zone(base);},
 deployments:{recommended:[[7,11],[10,11],[6,12],[11,12],[6,13],[11,13]],assault:[[7,10],[10,10],[6,11],[11,11],[7,11],[10,11]],defense:[[7,11],[10,11],[7,13],[10,13],[6,12],[11,12]]},
 threatTurn:2,par:9,turnLimit:14,level:8,deployLimit:6,convoyGoal:2,
 objective:'보급 마차 3대 중 2대를 북쪽 성문까지 호위 (마차 2대를 잃으면 패배)',
 brief:'마차는 TURN 2부터 매 턴 길을 따라 북쪽으로 2칸 갑니다. 옆에 적이 붙으면 1칸만 가고, 장수가 길을 막으면 못 지나갑니다. 탈영병은 눈길(이동 1)과 숲에 익숙합니다. 탈영병 대장은 HP 절반 이하에서 인접해 생포할 수 있습니다. TURN 3 후미, TURN 5 성문 앞 증원.'});
MISSIONS[8]=authored({id:8,title:'협곡 방어전',en:'Canyon Defense',
 rows:['xxxxxnnrrnnxxxxx','xxxxnnnrrnnnxxxx','xxxnnnnrrnnnnxxx','xxmmnnnrrnnnmmxx','xxmmxnnrrnnxmmxx','xxxxmnnrrnnmxxxx','xxxxnnnrrnnnxxxx','xxxnnnnrrnnnnxxx','xxnnnfnrrnfnnnxx','xxnnnnnrrnnnnnxx','xxmmxnnrrnnxmmxx','xxmmxxnrrnxxmmxx','xnnnnnnrrnnnnnnx','nnvvnnnrrnnnvvnn','nnvvnnnrrnnnvvnn','nnnnnnnrrnnnnnnn'],
 enemies:[
  unit('m1','용병 창병','spear',5,1,{hp:32,atk:15,def:7,res:3,spd:6}),unit('m2','용병 창병','spear',10,1,{hp:32,atk:15,def:7,res:3,spd:6}),
  unit('m3','용병 창병','spear',6,2,{hp:32,atk:15,def:7,res:3,spd:6}),unit('m4','용병 창병','spear',9,2,{hp:32,atk:15,def:7,res:3,spd:6}),
  unit('a1','용병 궁수','archer',4,2,{hp:26,atk:14,def:3,res:3,spd:7}),unit('a2','용병 궁수','archer',11,2,{hp:26,atk:14,def:3,res:3,spd:7})],
 civilians:[{id:'v1',name:'후위 마을 노인',x:2,y:13,hp:24,def:2},{id:'v2',name:'후위 마을 어머니',x:3,y:14,hp:24,def:2},{id:'v3',name:'후위 마을 소년',x:13,y:13,hp:24,def:2}],
 allies:[ally('baldrick','발드릭 로엔 · 검은 사자','lion',7,5,{kind:'lion',hp:84,atk:18,def:9,res:5,spd:7,post:{x:7,y:5},leash:1}),ally('ic1','철왕관 보병','ironInfantry',6,5,{post:{x:6,y:5},leash:1}),ally('ic2','철왕관 보병','ironInfantry',9,5,{post:{x:9,y:5},leash:1})],
 objects:[sealObject('rf1','낙석 장치','rockfall',4,5,{zone:[5,7,3,6]}),sealObject('rf2','낙석 장치','rockfall',11,5,{zone:[8,10,3,6]})],
 waves:[{turn:3,story:'8:wave',units:[unit('m5','용병 창병','spear',6,0,{hp:32,atk:15,def:7,res:3,spd:6}),unit('m6','용병 창병','spear',9,0,{hp:32,atk:15,def:7,res:3,spd:6}),unit('m7','용병 창병','spear',5,1,{hp:32,atk:15,def:7,res:3,spd:6}),unit('a3','용병 궁수','archer',8,0,{hp:26,atk:14,def:3,res:3,spd:7})]},
  {turn:7,story:'8:captain',units:[unit('boss','용병단장','captain',7,0,{hp:84,atk:19,def:9,res:5,spd:7,mov:3,holdUntil:8}),unit('g1','단장 호위병','spear',6,0,{hp:34,atk:16,def:8,res:3,spd:6}),unit('g2','단장 호위병','spear',9,0,{hp:34,atk:16,def:8,res:3,spd:6})]},
  {turn:6,raid:true,units:[unit('s1','용병 습격조','bandit',0,13,{hp:28,atk:15,def:5,res:3,spd:8,mov:4}),unit('s2','용병 습격조','bandit',0,15,{hp:28,atk:15,def:5,res:3,spd:8,mov:4}),unit('s3','용병 습격조','bandit',15,15,{hp:28,atk:15,def:5,res:3,spd:8,mov:4})]}],
 deployZone:s=>{const base=[];for(let y=6;y<=9;y++)for(let x=3;x<=12;x++)base.push([x,y]);for(let y=12;y<=13;y++)for(let x=4;x<=11;x++)base.push([x,y]);return zone(base.filter(([x,y])=>Number.isFinite(TERRAIN[MISSIONS[8].map[y][x]].cost)&&!MISSIONS[8].allies.some(a=>a.x===x&&a.y===y)));},
 deployments:{recommended:[[6,7],[9,7],[5,8],[10,8],[7,9],[8,9]],assault:[[5,6],[10,6],[6,7],[9,7],[7,7],[8,7]],defense:[[6,9],[9,9],[5,8],[10,8],[7,12],[8,12]]},
 threatTurn:6,par:9,turnLimit:10,level:9,deployLimit:6,breachRow:12,orderTurn:6,
 objective:'TURN 10까지 협곡 사수 또는 TURN 7에 오는 용병단장 격파 (북쪽 적이 12번째 줄 아래로 넘어오면 패배)',
 brief:'위쪽 목은 발드릭의 병사가 지킵니다. 양쪽 벼랑의 낙석 장치(한 번씩)를 작동하면 위쪽 목 앞의 적에게 큰 피해를 줍니다. 출전 전에 사령부 명령(협곡 사수 / 후위 마을 구출조)을 정합니다. TURN 3 북쪽 2진, TURN 6 남쪽 습격조, TURN 7 용병단장과 호위병 도착(TURN 8까지 입구 사수).'});
// v0.6.1 ACT II (D-055 §3, D-067; maps, numbers and names PROPOSED). M09 The Free City: raiders strike Velmar's market
// square on the day the lords' delegates meet; escort the three delegates into the council hall (rescue) while assassins
// on the rooftops hunt them; the assassin leader can be taken alive. M10 Two Lords' War: Lord Oswin (blue-white) and
// Lord Brennan (orange) fight over the village between their camps; before battle the legion supports one of them or
// tries to mediate (capture both commanders).
const raider9=(id,x,y,stats={})=>unit(id,'벨마르 습격대','spear',x,y,{hp:32,atk:15,def:6,res:3,spd:7,mov:3,...stats});
const assassin9=(id,name,x,y,stats={})=>unit(id,name,'assassin',x,y,{hp:28,atk:17,def:4,res:4,spd:10,mov:5,movementProfile:'rogue',hunter:true,...stats});
MISSIONS[9]=authored({id:9,title:'자유의 도시',en:'The Free City',
 rows:['wwrxxxxkkkkxxxxxxx','wwrooolkkkkloooolx','wwrooolkkkkloooolx','wwrooolrrrrloooolx','bbrooorrrrrroooolx','bbrlxxrrrrrrxxxllx','wwrxxxrxrrxrxxxxlx','wwrxxxrrxxrrxxxxlx','wwrooorrrrrroooolx','wwrooorrrrrroooolx','wwrooolrrrrloooolx','wwrlllrrrrrrlllllx','wwrrhrrrrrrrrrrrlx','wwrrrrrrrrrrrrrrrx'],
 enemies:[
  assassin9('h1','자객',4,2),assassin9('h2','자객',13,9),
  raider9('m1',7,3),raider9('m2',10,3),raider9('m3',13,4),
  unit('a1','습격대 궁수','archer',3,9,{hp:26,atk:14,def:3,res:3,spd:7,mov:3}),unit('a2','습격대 궁수','archer',14,1,{hp:26,atk:14,def:3,res:3,spd:7,mov:3})],
 civilians:[{id:'v1',name:'청백 깃발 대표',look:'councillor',x:6,y:5,hp:30,def:3,res:3},{id:'v2',name:'주황 깃발 대표',look:'councillor',x:11,y:5,hp:30,def:3,res:3},{id:'v3',name:'항구 의원',look:'councillor',x:8,y:4,hp:30,def:3,res:3}],
 allies:[ally('dario_blade','다리오 · 용병 검사','dario',16,8,{kind:'swordsman',hp:40,atk:17,def:6,spd:10,mov:4,post:{x:13,y:7},leash:3}),ally('vg1','항구 경비병','guard',2,8,{post:{x:2,y:6},leash:2}),ally('vg2','항구 경비병','guard',2,10,{post:{x:2,y:9},leash:2})],
 waves:[{turn:3,story:'9:harbor',units:[raider9('s1',0,4),raider9('s2',1,5)]},{turn:5,story:'9:alley',units:[assassin9('boss','그림자 자객 우두머리',16,1,{kind:'captain',hp:60,atk:18,def:6,res:5,spd:11,mov:4}),assassin9('h3','자객',15,1),raider9('s3',16,2)]}],
 capture:'boss',
 deployZone:s=>{const base=[];for(let y=11;y<=13;y++)for(let x=3;x<=15;x++)base.push([x,y]);return zone(base.filter(([x,y])=>Number.isFinite(TERRAIN[MISSIONS[9].map[y][x]].cost)));},
 deployments:{recommended:[[7,11],[10,11],[6,12],[11,12],[8,12],[9,12]],assault:[[7,11],[10,11],[8,11],[9,11],[6,11],[11,11]],defense:[[7,12],[10,12],[5,12],[12,12],[8,13],[9,13]]},
 threatTurn:3,par:8,turnLimit:10,level:9,deployLimit:6,
 objective:'의회 대표 3명을 의회 회관으로 피신(인접해 구출) · 2명 이상 잃으면 패배 · TURN 5에 나타나는 그림자 자객 우두머리 격파·생포 또는 TURN 10까지 버티면 승리',
 brief:'대표 곁에서 구출하면 회관 안으로 피신합니다. 자객은 지붕(이동 2, 방어 +2, 활 사거리 +1)을 타고 대표만 노립니다. 일반 습격대는 TURN 3부터 대표를 노립니다. TURN 3 항구 부두, TURN 5 동쪽 골목에 우두머리와 증원. 우두머리는 HP 절반 이하에서 인접해 생포할 수 있습니다.'});
const lord10=(id,side,x,y,stats={})=>unit(id,side==='a'?'청백 영주군':'주황 영주군','spear',x,y,{hp:34,atk:16,def:8,res:3,spd:6,mov:3,faction:side,look:side==='a'?'lordA':'lordB',...stats});
const lordBow10=(id,side,x,y)=>unit(id,side==='a'?'청백 궁병':'주황 궁병','archer',x,y,{hp:28,atk:15,def:4,res:3,spd:7,mov:3,faction:side,look:side==='a'?'lordA':'lordB'});
MISSIONS[10]=authored({id:10,title:'두 영주의 전쟁',en:"Two Lords' War",
 rows:['ggggxxxxrrxxxxggsw','ggggxttttttttxggsw','gffgxttttttttxggsw','gffgxxxxrrxxxxggsw','ggggggggrrggggffsw','gggggggxrrxgggffsw','ggggggvvrrvvggffsw','rrhrrrrrrrggggggsw','rrrrrrrrrrggggggsw','ggggggvvrrvvggffsw','gggggggxrrxgggffsw','ggggggggrrggggffsw','gffgxxxxrrxxxxggsw','gffgxttttttttxggsw','ggggxttttttttxggsw','ggggxxxxrrxxxxggsw'],
 enemies:[
  lord10('boss','a',8,1,{name:'오스윈 경 · 청백 깃발',kind:'captain',hp:120,atk:20,def:10,res:5,spd:7,holdUntil:5}),
  lord10('lg1','a',8,2,{name:'청백 친위대',hp:40,def:11}),lord10('lg2','a',9,2,{name:'청백 친위대',hp:40,def:11}),
  lord10('la1','a',6,2),lord10('la2','a',11,2),lordBow10('la3','a',9,3),lord10('la4','a',12,4),lord10('la7','a',7,1),
  lord10('boss2','b',9,14,{name:'브레넌 경 · 주황 깃발',kind:'captain',hp:120,atk:20,def:10,res:5,spd:7,holdUntil:5}),
  lord10('lg3','b',8,13,{name:'주황 친위대',hp:40,def:11}),lord10('lg4','b',9,13,{name:'주황 친위대',hp:40,def:11}),
  lord10('lb1','b',6,13),lord10('lb2','b',11,13),lordBow10('lb3','b',8,12),lord10('lb4','b',5,11),lord10('lb7','b',10,14)],
 civilians:[{id:'v1',name:'마을 노인',x:6,y:7,hp:26,def:2},{id:'v2',name:'마을 아이',look:'child',x:11,y:8,hp:22,def:1},{id:'v3',name:'방앗간 주인',x:7,y:9,hp:26,def:2}],
 allies:[ally('dario_blade','다리오 · 용병 검사','dario',2,5,{kind:'swordsman',hp:42,atk:18,def:6,spd:10,mov:4})],
 waves:[{turn:4,story:'10:reinforce',units:[lord10('la5','a',8,0),lord10('la6','a',9,0),lord10('lb5','b',8,15),lord10('lb6','b',9,15)]}],
 capture:['boss','boss2'],
 deployZone:s=>{const base=[];for(let y=4;y<=11;y++)for(let x=0;x<=3;x++)base.push([x,y]);return zone(base.filter(([x,y])=>Number.isFinite(TERRAIN[MISSIONS[10].map[y][x]].cost)&&!(x===2&&y===5)));},
 deployments:{recommended:[[3,7],[3,8],[2,6],[2,9],[1,7],[1,8]],assault:[[3,7],[3,8],[3,6],[3,9],[2,7],[2,8]],defense:[[2,7],[2,8],[1,6],[1,9],[0,7],[0,8]]},
 threatTurn:5,par:10,turnLimit:12,level:10,deployLimit:6,stanceChoice:true,
 objective:'출전 전 선택 — 지원: 상대 영주 지휘관 격파·생포 / 중재: 두 지휘관 모두 생포(생포한 쪽 군은 물러남) · TURN 12 안에',
 brief:'두 영주군은 서로도 싸웁니다. 지원을 고르면 그 영주군이 동맹군이 되고, 그 영주는 쓰러지지 않습니다. 중재는 두 지휘관을 HP 절반 이하에서 인접해 생포해야 하며, 한 명이라도 쓰러뜨리면 중재는 실패합니다(전투는 두 지휘관이 모두 쓰러지면 끝납니다). TURN 5부터 병사들이 마을 주민을 노립니다. TURN 4 양쪽 증원.'});
// v0.7.0 ACT II part 2 (D-068; maps, numbers and names PROPOSED). M11 The Flame Procession: Lucien's pilgrims walk the
// night valley road to the southern sanctuary (two tiles a turn in light, one in the dark); lighting the three braziers
// (search) lights the road; ash raiders hunt them from the dark. Ines and two Sacred Flame knights escort as allies.
const ashRaider=(id,x,y,stats={})=>unit(id,'재 약탈단','bandit',x,y,{hp:30,atk:16,def:5,res:3,spd:8,mov:4,movementProfile:'rogue',look:'ashRaider',...stats});
const ashBow=(id,x,y)=>unit(id,'재 약탈단 궁수','archer',x,y,{hp:26,atk:15,def:3,res:3,spd:8,mov:3,look:'ashRaider'});
MISSIONS[11]=authored({id:11,title:'성화의 행렬',en:'The Flame Procession',
 rows:['xxxxxxzzzzzxxxxxxx','mmffggzzzzzggffmmm','mfffggggrggggfffmm','ffffgggfrfgggfffff','fffgggggrgggggffff','ffggggfgrgfggggfff','fggggffgrgffggggff','ggggggggrggggggggg','fgggfgggrgggfggggf','ffggggggrgggggggff','mffgggggrggggggffm','mmfgggggrgggggfmmm','mmffggggrggggffmmm','mmmfggggrggggfmmmm'],
 enemies:[ashRaider('r1',2,6),ashRaider('r2',15,5),ashRaider('r3',3,3),ashRaider('r4',14,8),ashBow('a1',13,3),ashBow('a2',4,8)],
 civilians:[{id:'p1',name:'순례자 노사제',look:'pilgrim',kind:'pilgrim',x:8,y:10,hp:26,def:3,res:4},{id:'p2',name:'순례자',look:'pilgrim',kind:'pilgrim',x:8,y:11,hp:26,def:3,res:3},{id:'p3',name:'순례자 어머니',look:'pilgrim',kind:'pilgrim',x:8,y:12,hp:26,def:3,res:3},{id:'p4',name:'순례자 소년',look:'pilgrim',kind:'pilgrim',x:8,y:13,hp:24,def:2,res:3}],
 allies:[ally('ines_warden','이네스 · 순례 수호자','ines',9,11,{kind:'warden',hp:44,atk:17,def:10,res:7,spd:6,mov:3,sanctuaryAura:true}),ally('fk1','성화 기사','flameKnight',7,11,{hp:38,atk:16,def:9,res:5}),ally('fk2','성화 기사','flameKnight',9,13,{hp:38,atk:16,def:9,res:5})],
 objects:[sealObject('br1','길가 화로','brazier',7,10),sealObject('br2','길가 화로','brazier',9,7),sealObject('br3','길가 화로','brazier',7,4)],
 waves:[{turn:3,story:'11:wave',units:[ashRaider('r5',4,13),ashRaider('r6',13,12)]},{turn:5,story:'11:flank',units:[ashRaider('r7',0,7),ashRaider('r8',17,7),ashBow('a3',0,9)]},
  {turn:7,story:'11:captain',units:[ashRaider('boss',15,2,{name:'재 약탈단 두목',kind:'captain',hp:72,atk:19,def:8,res:5,spd:9,mov:4}),ashRaider('r9',14,1),ashRaider('r10',1,2)]}],
 night:{radius:2,fixed:[[6,1],[7,1],[8,1],[9,1],[10,1]]},sanctuaryRow:1,road:['r','z'],
 deployZone:s=>{const base=[];for(let y=10;y<=13;y++)for(let x=4;x<=12;x++)base.push([x,y]);const m=MISSIONS[11],taken=[...m.civilians,...m.allies,...m.objects];return zone(base.filter(([x,y])=>Number.isFinite(TERRAIN[m.map[y][x]].cost)&&!taken.some(u=>u.x===x&&u.y===y)));},
 deployments:{recommended:[[7,12],[9,12],[6,11],[10,11],[7,13],[10,13]],assault:[[7,12],[9,12],[6,10],[10,10],[6,11],[10,11]],defense:[[7,12],[9,12],[7,13],[10,12],[6,12],[10,13]]},
 threatTurn:2,par:9,turnLimit:12,level:10,deployLimit:6,arriveGoal:3,escortOnly:true,
 objective:'순례자 4명 중 3명을 성소(맨 위)까지 호위 또는 TURN 12 새벽까지 버팀 · 순례자 2명 이상 잃으면 패배',
 brief:'순례자는 TURN 2부터 길을 따라 성소로 걷습니다. 빛 안에서는 2칸, 어둠에서는 1칸. 적이 곁에 붙거나 장수가 길을 막으면 멈춥니다. 길가 화로 3개에 인접해 조사하면 불이 켜져 반경 2칸이 밝아집니다. 빛 안의 아군은 명중 +10, 빛 밖의 대상을 노리면 명중 −15. 빛 안의 순례자는 아군 턴마다 HP +5. TURN 3 아래쪽, TURN 5 양옆 숲, TURN 7 북동쪽 숲에 두목.'});
// M12 The Silent Monastery: sneak into the Order's monastery archive. Quiet guards watch ahead of them and turn in a
// fixed order; a hero seen raises suspicion, a second sighting or noise rings the bell (alarm: guards wake, three come
// from the dormitory, and the abbot burns every record not yet secured three turns later).
const monk=(id,x,y,facing,turns,stats={})=>unit(id,'수도원 경비','spear',x,y,{hp:40,atk:16,def:8,res:4,spd:7,mov:0,alertMov:3,look:'monasteryGuard',watch:true,facing,turns,...stats});
MISSIONS[12]=authored({id:12,title:'침묵의 수도원',en:'The Silent Monastery',
 rows:['xxxxxxxxxxxxxxxxxx','xkkkkkxkkkkxkkkkkx','xkkkkkxkkkkxkkkkkx','xkkkkkxkkkkxkkkkkx','xxxkxxxxkkxxxxkxxx','xkkkkkkkkkkkkkkkkx','xkkxkggggggggkxkkx','xkkkkggggggggkkkkx','xkkxkggggggggkxkkx','xkkxkkkkkkkkkkxkkx','xxxxxxxxkkxxxxxxxx','gggfggggrrggggfggg','ggffgggrrrrgggffgg','gfffgggrrrrgggfffg'],
 enemies:[
  monk('g1',8,9,'down',['down','left','up','right']),monk('g2',5,7,'right',['right','down','left','up']),monk('g3',12,7,'left',['left','up','right','down']),
  monk('g4',3,5,'right',['right','down']),monk('g5',14,5,'left',['left','down']),monk('g6',3,3,'down',['down','right']),monk('g7',14,2,'down',['down','left']),
  unit('boss','침묵의 원장','captain',2,2,{hp:84,atk:19,def:8,res:7,spd:6,mov:0,alertMov:3,look:'abbot'})],
 objects:[evidence('rec_ledger','장부 기록','ledger',1,1),evidence('rec_seal','봉인술 연구','seal',16,1),evidence('rec_roster','교단 명부','roster',8,1)],
 waves:[{turn:99,alarm:true,story:'12:dorm',units:[monk('w1',1,7,'right',[],{awake:true,mov:3}),monk('w2',2,8,'right',[],{awake:true,mov:3}),monk('w3',1,9,'up',[],{awake:true,mov:3})]}],
 capture:'boss',stealth:true,burnDelay:3,
 deployZone:s=>{const base=[];for(let y=11;y<=13;y++)for(let x=0;x<18;x++)base.push([x,y]);return zone(base.filter(([x,y])=>Number.isFinite(TERRAIN[MISSIONS[12].map[y][x]].cost)));},
 deployments:{recommended:[[8,11],[9,11],[7,12],[10,12],[8,12],[9,12]],assault:[[8,11],[9,11],[7,11],[10,11],[8,12],[9,12]],defense:[[7,12],[10,12],[8,13],[9,13],[6,12],[11,12]]},
 threatTurn:99,par:10,turnLimit:14,level:11,deployLimit:6,
 objective:'장부 기록 확보(인접해 조사) + 침묵의 원장 격파·생포 · 장부 기록이 불타거나 TURN 14를 넘기면 패배',
 brief:'경비는 바라보는 방향 앞 2칸과 앞 대각선 2칸을 감시하고, 적 턴마다 정해진 순서로 돌아섭니다(붉은 칸). 적 턴이 시작될 때 감시 칸에 장수가 있으면 의심(감시 3칸), 한 번 더 들키거나 경비를 한 번에 쓰러뜨리지 못하면 종이 울립니다(경보). 경보가 울리면 경비가 모두 움직이고 숙소에서 셋이 나오며, 3턴 뒤 원장이 확보하지 못한 기록을 태웁니다. 감시 밖에서 조용한 경비를 치면 기습(명중 +30, 피해 +5). 원장은 HP 절반 이하에서 인접해 생포할 수 있습니다.'});
// v0.7.1 ACT II part 2 (D-068 §3/§6, D-071; maps, numbers and names PROPOSED). M13 The Black Lion's Decision: Cassian
// orders Baldrick to break up the legion's refugee camp; his lion formation marches on the tents. Erik (and Thea, once)
// can persuade him instead of attacking; resolve from ACT I–II choices and the battle decides whether he halts his army.
const lion13=(id,name,kind,x,y,look,stats={})=>unit(id,name,kind,x,y,{look,...stats});
MISSIONS[13]=authored({id:13,title:'검은 사자의 결단',en:"The Black Lion's Decision",
 rows:['mmmmffgggrrgggffmm','mmffggggrrrrggggfm','mfgggggrrrrrrgggff','ffgggfggrrrrgfgggf','fggggggggrrggggggg','gggxxgggrrrggxxggg','gggxxggrrrrgggxggg','ggggggrrggrrgggggg','gfgggrrggggrrggfgg','ffggrrggvvggrrggff','fggrrgvvvvvvggrrgf','ggrrgvvvhhvvvggrrg','grrggvvvvvvvvgggrr','rrggggvvvvvvggggrr'],
 enemies:[
  lion13('boss','발드릭 로엔 · 검은 사자','lion',9,2,'lion',{hp:120,atk:21,def:12,res:7,spd:7,mov:3}),
  lion13('f1','사자 기수','bearer',7,3,'bearer',{hp:44,atk:12,def:9,res:6,spd:5,mov:2}),lion13('f2','사자 기수','bearer',11,3,'bearer',{hp:44,atk:12,def:9,res:6,spd:5,mov:2}),lion13('f3','사자 기수','bearer',9,4,'bearer',{hp:44,atk:12,def:9,res:6,spd:5,mov:2}),
  lion13('s1','철왕관 창병','spear',6,4,'ironSpear',{hp:36,atk:17,def:8,res:3,spd:6}),lion13('s2','철왕관 창병','spear',12,4,'ironSpear',{hp:36,atk:17,def:8,res:3,spd:6}),
  lion13('s3','철왕관 창병','spear',8,5,'ironSpear',{hp:36,atk:17,def:8,res:3,spd:6}),lion13('s4','철왕관 창병','spear',10,5,'ironSpear',{hp:36,atk:17,def:8,res:3,spd:6}),
  lion13('a1','철왕관 궁수','archer',4,2,'ironArcher',{hp:28,atk:16,def:4,res:3,spd:7}),lion13('a2','철왕관 궁수','archer',14,2,'ironArcher',{hp:28,atk:16,def:4,res:3,spd:7})],
 civilians:[{id:'v1',name:'피난민 노인',x:6,y:11,hp:26,def:2},{id:'v2',name:'피난민 어머니',x:11,y:11,hp:26,def:2},{id:'v3',name:'피난민 아이',look:'child',x:7,y:12,hp:22,def:1},{id:'v4',name:'맹세하지 않은 순례자',look:'pilgrim',x:10,y:12,hp:26,def:2}],
 waves:[{turn:3,story:'13:cavalry',units:[lion13('c1','철왕관 기병','cavalry',0,6,'cavalry',{hp:34,atk:17,def:6,res:2,spd:9,mov:5,movementProfile:'cavalry'}),lion13('c2','철왕관 기병','cavalry',17,6,'cavalry',{hp:34,atk:17,def:6,res:2,spd:9,mov:5,movementProfile:'cavalry'})]},
  {turn:5,story:'13:reinforce',units:[lion13('s5','철왕관 창병','spear',8,0,'ironSpear',{hp:36,atk:17,def:8,res:3,spd:6}),lion13('s6','철왕관 창병','spear',11,0,'ironSpear',{hp:36,atk:17,def:8,res:3,spd:6})]}],
 formation:{bearers:['f1','f2','f3'],def:2,hit:10,charge:4,leash:2},persuade:{target:'boss',threshold:6},
 deployZone:s=>{const base=[];for(let y=7;y<=12;y++)for(let x=2;x<=15;x++)base.push([x,y]);const m=MISSIONS[13];return zone(base.filter(([x,y])=>Number.isFinite(TERRAIN[m.map[y][x]].cost)&&!m.civilians.some(c=>c.x===x&&c.y===y)));},
 deployments:{recommended:[[8,9],[9,9],[6,10],[11,10],[7,8],[10,8]],assault:[[8,8],[9,8],[7,8],[10,8],[6,9],[11,9]],defense:[[8,10],[9,10],[5,10],[12,10],[7,9],[10,9]]},
 threatTurn:4,par:10,turnLimit:12,level:11,deployLimit:6,lionHold:5,
 objective:'발드릭의 결단 6 (설득·선택·피난민 보호) 또는 TURN 5부터 사자 기수 3명 격파 + 발드릭 HP 50% 이하 또는 TURN 12까지 야영지 사수 · 피난민 2명 이상 잃으면 패배',
 brief:'에릭이 발드릭 곁에서 "설득"하면 결단이 1 오릅니다(턴마다 1번). 테아가 출전했다면 한 번 말을 건넬 수 있습니다. ACT I–II의 선택과, TURN 4부터 적 턴 동안 피난민이 다치지 않을 때마다(최대 2)도 결단이 오릅니다. 6이면 발드릭이 군을 멈춥니다. 발드릭은 TURN 5 전에는 대형이 무너져도 물러서지 않습니다. 사자 기수 곁의 적은 DEF+2·명중+10, 발드릭은 고립된 장수를 노립니다(피해+4). TURN 3 양쪽에서 기병, TURN 5 북쪽 증원.'});
// M14 The Broken Alliance: the three leaders meet at a ruined waystation outside the capital; masked raiders (the ledger
// cord) break in. Escort the leaders (allies) to the southern exit. On TURN 4 the banner that trusts the legion least
// turns on it: its leader leaves the field and its guards attack.
const guard14=(id,name,look,x,y,faction,stats={})=>ally(id,name,look,x,y,{faction,hp:40,atk:16,def:9,res:4,spd:6,mov:3,...stats});
const leader14=(id,name,look,x,y,faction)=>ally(id,name,look,x,y,{faction,kind:'leader',leader:true,hp:64,atk:17,def:8,res:6,spd:7,mov:3});
const masked=(id,x,y,stats={})=>unit(id,'가면 습격대','bandit',x,y,{hp:34,atk:18,def:7,res:4,spd:9,mov:4,movementProfile:'rogue',look:'maskedRaider',masked:true,...stats});
MISSIONS[14]=authored({id:14,title:'부서진 동맹',en:'The Broken Alliance',
 rows:['xxxxxxxkkkkxxxxxxx','xkkkkkkkkkkkkkkkkx','xkkkkkkkkkkkkkkkkx','xxxxxxkkkkkkxxxxxx','ggfgggrrrrrrgggfgg','gffggrrggggrrggffg','ggggrrgxxggrrggggg','gggrrggxxgggrrgggf','ffgrrggggggggrrggf','fggrrgggffgggrrggg','gggrrggggggggrrggg','ggggrrggggggrrgggg','gfgggrrrrrrrrgggfg','gggggggrrrrggggggg'],
 enemies:[masked('k1',0,5),masked('k2',17,5),masked('k3',1,9),masked('k4',16,9)],
 allies:[leader14('cassian','카시안 · 철왕관 통령','cassian',6,2,'iron'),leader14('leonora','레오노라 · 연맹 의장','leonora',9,2,'free'),leader14('lucien','루시안 · 성화 대사제','lucien',12,2,'flame'),
  guard14('ig1','철왕관 근위병','ironInfantry',5,1,'iron'),guard14('ig2','철왕관 근위병','ironInfantry',7,1,'iron'),guard14('fg1','연맹 경비병','guard',8,1,'free'),guard14('fg2','연맹 경비병','guard',10,1,'free'),
  guard14('lg1','성화 기사','flameKnight',11,1,'flame'),guard14('lg2','성화 기사','flameKnight',13,1,'flame')],
 waves:[{turn:2,story:'14:raid',units:[masked('k5',0,7),masked('k6',17,7),masked('k7',0,11,{look:'maskedRaider',kind:'archer',range:[2,3],hp:28,atk:16,def:4})]},
  {turn:4,units:[masked('k8',17,11),masked('k9',0,12)]},{turn:6,story:'14:exit',units:[masked('k10',3,13),masked('k11',14,13),masked('k12',17,8)]}],
 deployZone:s=>{const base=[];for(let y=4;y<=8;y++)for(let x=3;x<=14;x++)base.push([x,y]);return zone(base.filter(([x,y])=>Number.isFinite(TERRAIN[MISSIONS[14].map[y][x]].cost)));},
 deployments:{recommended:[[8,4],[9,4],[6,5],[11,5],[6,6],[10,6]],assault:[[7,4],[10,4],[5,5],[12,5],[8,5],[9,5]],defense:[[8,4],[9,4],[7,4],[10,4],[6,4],[11,4]]},
 threatTurn:99,par:9,turnLimit:12,level:12,deployLimit:6,exitRow:13,betrayTurn:4,
 objective:'세 지도자 중 둘 이상을 남쪽 출구(맨 아랫줄)까지 호위 · 지도자를 지킬 수 없게 되면(남은 지도자 둘 중 하나라도 쓰러짐) 패배 · TURN 12 안에',
 brief:'카시안·레오노라·루시안과 호위병이 동맹군으로 남쪽 출구로 물러납니다. 가면 습격대는 지도자를 노리고 양옆과 남쪽에서 계속 들어옵니다. TURN 4에 군단을 가장 믿지 않는 깃발(신뢰가 가장 낮은 세력)이 군단에 칼을 돌립니다: 그 지도자는 전장을 떠나고 호위병은 적이 됩니다.'});
// ---------- v0.9.0 ACT III 「왕관의 진실」 part 1 (D-079, docs/v0.9.0/ACT3_DESIGN.md §4; maps and numbers PROPOSED) ----------
// M15 The Lost Records: the capital's lower city at night. Three chancellery clerks carry the Ashen Night's record boxes out
// of the royal archive, each to its own gate (TURN 2 on, two tiles a turn); grey cloaks screen them. Knocking a clerk down
// secures its box. The royal watch stands neutral at three posts: fighting within two tiles of a watchman earns one warning,
// the second time the watch turns on the legion. The old archivist who guided the legion must live.
const cloak15=(id,x,y,stats={})=>unit(id,'회색 망토','bandit',x,y,{hp:64,atk:40,def:19,res:14,spd:26,mov:4,movementProfile:'rogue',look:'grayCloak',...stats});
const clerk15=(id,x,y,exit)=>unit(id,'재상부 서기','clerk',x,y,{hp:46,atk:0,def:14,res:12,spd:20,mov:2,look:'clerk',clerk:true,exit});
MISSIONS[15]=authored({id:15,title:'사라진 기록',en:'The Lost Records',
 rows:['xrxxxxxxxxxxxxxxxx','xrllllloxxolllllox','xrrrrrrrrrrrrrrrlx','rrrlxxxkkkkxxxrrrr','xolrxkkkkkkkkxrlox','xolrxkkkkkkkkxrlox','xllrxxxkkkkxxxrllx','xllrrrrrkkrrrrrllx','wwwbwwwwwbbwwwwbww','llvrllloollllrlvll','lollrlllllllrlllol','llllrrrrrrrrrrllll','lvllrllvvllllrllvl','llllrlllrrlllrllll'],
 enemies:[clerk15('c1',7,4,[1,0]),clerk15('c2',9,5,[0,3]),clerk15('c3',11,4,[17,3]),
  unit('cap','회색 망토 대장','captain',8,3,{hp:88,atk:44,def:22,res:18,spd:24,mov:4,movementProfile:'rogue',look:'grayCloak'}),
  cloak15('g1',3,7),cloak15('g2',10,7),cloak15('g3',15,7),cloak15('g4',5,2),cloak15('g5',12,2),
  cloak15('a1',1,4,{kind:'archer',range:[2,3],hp:52,atk:38,def:14,res:12,spd:24,movementProfile:'infantry'}),cloak15('a2',16,4,{kind:'archer',range:[2,3],hp:52,atk:38,def:14,res:12,spd:24,movementProfile:'infantry'})],
 civilians:[{id:'archivist',name:'늙은 기록관',look:'archivist',x:8,y:12,hp:30,def:3,res:4},
  {id:'w1',name:'왕도 경비대',look:'watchman',watch:true,x:2,y:10,hp:34,def:7,res:4},{id:'w2',name:'왕도 경비대',look:'watchman',watch:true,x:9,y:9,hp:34,def:7,res:4},{id:'w3',name:'왕도 경비대',look:'watchman',watch:true,x:15,y:10,hp:34,def:7,res:4}],
 waves:[{turn:3,story:'15:cloaks',units:[cloak15('g6',0,11),cloak15('g7',17,11)]},{turn:5,units:[cloak15('g8',0,9),cloak15('g9',17,9)]}],
 deployZone:s=>{const base=[];for(let y=11;y<=13;y++)for(let x=1;x<=16;x++)base.push([x,y]);return zone(base.filter(([x,y])=>Number.isFinite(TERRAIN[MISSIONS[15].map[y][x]].cost)&&!MISSIONS[15].civilians.some(c=>c.x===x&&c.y===y)));},
 deployments:{recommended:[[8,11],[9,11],[6,11],[11,11],[7,12],[10,12],[5,12],[12,12]],assault:[[8,11],[9,11],[3,11],[14,11],[7,11],[10,11],[4,12],[13,12]],defense:[[7,12],[9,12],[6,12],[10,11],[8,11],[7,11],[5,12],[11,12]]},
 threatTurn:3,par:9,turnLimit:12,level:13,deployLimit:7,watchRadius:2,clerkStart:1,
 objective:'서기 세 명의 행방을 모두 정하고 상자 2개 이상 확보 · 기록관 생존 · 상자 2개가 성문 밖으로 나가면 패배 · TURN 12 안에',
 brief:'재상부 서기 셋이 곧바로 각자 성문(북서·서·동)으로 달아납니다(턴마다 2칸). 서기를 쓰러뜨리면 상자를 확보합니다. 회색 망토가 길을 막고, TURN 3부터 기록관을 노립니다. 왕도 경비대(중립) 곁 2칸 안에서 싸우면 한 번 경고하고, 두 번째에는 경비대가 적이 됩니다.'});
// M16 The Forgotten Battlefield: a battlefield of the civil war that no one nearby remembers, under fog. Two chancellery
// memory harvesters draw on the ward stones; while one stands beside an unsearched stone, heroes near it lose MP each turn.
// Searching a stone shows an echo and clears the fog around it. Scavengers of the banner that betrayed the legion at the
// summit pick over the field; their captain challenges Erik to a duel on TURN 3. Recruits who left the legion (and Ines, if
// she never joined) wander in on TURN 2 as allies; alive at the end, they come back.
const SCAV16={iron:{name:'철왕관',soldier:'ironSpear',kind:'spear',archer:'ironArcher',captain:'ironInfantry'},free:{name:'연맹',soldier:'mercSpear',kind:'spear',archer:'pursuerArcher',captain:'lordA'},flame:{name:'성화',soldier:'flameKnight',kind:'bandit',archer:'fortArcher',captain:'flameKnight'}};
export const scavengerLook16=(f,role)=>SCAV16[f]?.[role]||SCAV16.iron[role];
const scav16=(id,x,y,role='soldier',stats={})=>unit(id,'배신한 깃발의 약탈대',role==='archer'?'archer':'spear',x,y,{hp:70,atk:42,def:21,res:12,spd:22,mov:3,scav:role,...(role==='archer'?{range:[2,3],hp:56,atk:40,def:15,spd:24}:{}),...stats});
const harvester16=(id,x,y,stone)=>unit(id,'기억 수확자','harvester',x,y,{hp:84,atk:40,def:16,res:40,spd:20,mov:2,range:[1,2],look:'harvester',stone});
const echo16=(id,name,x,y)=>({id,name,kind:'wardStone',x,y});
const return16=(id,look,x,y)=>ally(id,look==='thea'?'테아':look==='dario'?'다리오':'이네스',look,x,y,{returning:look,benched:true});
MISSIONS[16]=authored({id:16,title:'잊힌 전장',en:'The Forgotten Battlefield',weather:'fog',
 rows:['mmffgggggggggggffm','mfgggxggrrggxggggf','fggggxgrrggggxgggf','ggggggrrggfgggggfg','gggfggrggggggfgggg','ggxxgrrgggxxggggxg','gggggrggfggrrggggg','wwwwbwwwwwwbwwwwww','ggggrggfgggrgggfgg','gfggrgggggggrggggg','ggggrrggxxggrrgggf','fggggrrrrrrrrggggf','ggfggggrrrrggggfgg','gggggggrrrrggggggg'],
 enemies:[harvester16('h1',2,3,'st1'),harvester16('h2',14,3,'st2'),
  scav16('cap',9,4,'captain',{name:'배신한 깃발의 기사대장',kind:'captain',hp:110,atk:46,def:24,res:16,spd:24}),
  scav16('s1',6,5),scav16('s2',11,6),scav16('s3',8,2),scav16('s4',4,9),scav16('s5',13,9),scav16('a1',11,1,'archer'),scav16('a2',4,1,'archer')],
 objects:[echo16('st1','결계석',2,4),echo16('st2','결계석',14,4),echo16('st3','결계석',9,9)],
 allies:[return16('rthea','thea',0,11),return16('rdario','dario',0,12),return16('rines','ines',1,13)],
 waves:[{turn:4,story:'16:reinforce',units:[scav16('s6',8,0),scav16('s7',12,0)]},{turn:6,units:[scav16('s8',0,5),scav16('a3',17,5,'archer')]}],
 deployZone:s=>{const base=[];for(let y=10;y<=13;y++)for(let x=2;x<=15;x++)base.push([x,y]);return zone(base.filter(([x,y])=>Number.isFinite(TERRAIN[MISSIONS[16].map[y][x]].cost)&&!(MISSIONS[16].objects||[]).some(o=>o.x===x&&o.y===y)));},
 deployments:{recommended:[[8,11],[9,11],[5,11],[12,11],[7,12],[10,12],[4,12],[13,12]],assault:[[7,10],[10,10],[4,10],[12,10],[7,11],[10,11],[5,11],[11,11]],defense:[[8,12],[9,12],[6,12],[11,12],[7,13],[10,13],[5,13],[12,13]]},
 threatTurn:99,par:10,turnLimit:14,level:14,deployLimit:7,harvestMP:3,harvestRadius:3,clearRadius:2,duelTurn:3,returnTurn:2,
 objective:'기억 수확자 2명 격파 · TURN 14 안에 (돌아온 동료가 쓰러져도 패배는 아님)',
 brief:'안개: 활과 마법의 사거리 −1, 3칸 밖의 적은 정체가 보이지 않습니다. 결계석(3)을 조사하면 그 주위 2칸의 안개가 걷힙니다. 수확자가 조사하지 않은 결계석 곁에 있으면 턴마다 그 돌 3칸 안 장수의 MP가 3 줄어듭니다. TURN 3 기사대장이 에릭에게 일기토를 청합니다.'});
// ---------- v0.9.1 ACT III part 2 (D-084, ACT3_DESIGN §4.1; maps, units and numbers PROPOSED) ----------
// M17 The Guardians' Oath: the guardians' keep on the northern plateau. The chancellery comes for the Book of Oaths kept in
// the keep's archive (two tiles at its back). Four guardian statues sleep around the keep: a hero beside one swears the
// oath (the search action) and it fights for the legion; an enemy left beside a sleeping statue at the start of a turn
// wakes it for the chancellery. Hold the archive until the end of TURN 10 or bring down the chancellery captain; an enemy
// on the archive at the end of two enemy phases in a row loses it.
const cloak17=(id,x,y,stats={})=>unit(id,'재상부 회색 망토','bandit',x,y,{hp:66,atk:42,def:19,res:14,spd:24,mov:4,look:'grayCloak',...stats});
const bolt17=(id,x,y)=>unit(id,'재상부 석궁수','archer',x,y,{hp:54,atk:40,def:14,res:12,spd:24,mov:3,range:[2,3],look:'grayCloak'});
const statue17=(id,x,y)=>({id,name:'잠든 수호 석상',kind:'statue',x,y,prop:true});
MISSIONS[17]=authored({id:17,title:'수호자의 맹세',en:"The Guardians' Oath",
 rows:['mmxxxxxkkkkxxxxxmm','mmxkkkkkkkkkkkkxmm','mmxkkkkkkkkkkkkxmm','mmxkkqkkkkkkqkkxmm','gmxxxxkkkkkkxxxxmg','ggggrrrrrrrrrrgggg','ggnggrggggggrggngg','gggggrggffggrggggg','ffggrrggggggrrgggf','fgggrggnngggggrggf','gggrrggggggggrrggg','ggrrgffggggffggrrg','grrggfggrrggfgggrr','rrgggggrrrrggggggr'],
 enemies:[cloak17('gcap',9,13,{name:'재상부 대장',kind:'captain',look:'greyCaptain',hp:150,atk:48,def:27,res:20,spd:24,mov:3}),
  cloak17('g1',5,12),cloak17('g2',12,12),cloak17('g3',8,11),cloak17('g4',3,13),cloak17('g5',14,13),bolt17('c1',7,13),bolt17('c2',11,13)],
 objects:[statue17('st1',4,6),statue17('st2',13,6),statue17('st3',2,9),statue17('st4',15,9)],
 waves:[{turn:3,story:'17:reinforce',units:[cloak17('g6',0,8),cloak17('g7',17,8)]},{turn:5,units:[cloak17('g8',0,12),bolt17('c3',17,12)]},{turn:7,units:[cloak17('g9',8,13),cloak17('g10',10,13)]}],
 archive:[[8,1],[9,1]],statue:{hp:96,atk:40,def:26,res:20,spd:12,mov:2},holdTurn:10,
 deployZone:s=>{const base=[];for(let y=1;y<=5;y++)for(let x=3;x<=14;x++)base.push([x,y]);return zone(base.filter(([x,y])=>Number.isFinite(TERRAIN[MISSIONS[17].map[y][x]].cost)&&!MISSIONS[17].archive.some(([ax,ay])=>ax===x&&ay===y)));},
 deployments:{recommended:[[8,5],[9,5],[7,4],[10,4],[6,5],[11,5],[8,3],[9,3]],assault:[[8,5],[9,5],[5,5],[12,5],[7,5],[10,5],[6,5],[11,5]],defense:[[8,3],[9,3],[7,4],[10,4],[8,2],[9,2],[7,2],[10,2]]},
 threatTurn:99,par:10,turnLimit:10,level:14,deployLimit:7,
 objective:'TURN 10이 끝날 때까지 서고를 지키거나 재상부 대장 격파 (적이 서고 칸을 두 턴 연속 점거하면 패배)',
 brief:'잠든 수호 석상(4) 곁에서 「맹세」하면 그 석상이 군단 편에서 싸웁니다. 적이 먼저 석상 곁에 남아 있으면 턴이 시작될 때 석상이 재상부 편으로 깨어납니다. 성채 맨 안쪽 서고 칸(2)에 적이 두 적 턴 연속 서 있으면 「맹세의 서」를 빼앗깁니다.'});
// M18 The Unburning Forest: an old forest under the ward, in the rain. Rain halves fire damage and nothing catches fire;
// inside the ward (the forest's heart) fire does nothing and heals are 50% stronger. The betraying banner's loggers come to
// fell the three ward trees; six forest-keepers out in the woods can be led inside (the rescue action). Keep two trees
// standing until the end of TURN 12 or bring down the logging captain; two trees felled is a defeat.
const logger18=(id,x,y,role='soldier',stats={})=>unit(id,'벌목대','spear',x,y,{hp:72,atk:44,def:20,res:12,spd:22,mov:3,scav:role,logger:true,...(role==='archer'?{range:[2,3],hp:56,atk:40,def:14,spd:24,logger:false}:{}),...stats});
const tree18=(id,x,y)=>ally(id,'결계 고목','wardTree',x,y,{kind:'wardTree',hp:90,atk:0,def:14,res:30,spd:0,mov:0,range:[0,0],prop:true});
const keeper18=(id,x,y)=>({id,name:'숲지기',kind:'forester',look:'forester',x,y,hp:36,def:8,res:8});
MISSIONS[18]=authored({id:18,title:'불타지 않는 숲',en:'The Unburning Forest',weather:'rain',
 rows:['ffgggfffggfffgggff','fvgggffggggffgggvf','fgggfggggggggfgggf','gggffggfffffggffgg','ggfgggggggggggffgg','gfggggffggffggggfg','ggggggfggggfgggggg','gfgggggggggggggfgg','gvggggfggggfggggvg','ggfgggggggggggfggg','gggffggrrrrggffggg','fvgggggrrrrgggggvf','ffgggrrrggrrrgggff','fffgrrggggggrrgfff'],
 enemies:[logger18('l1',5,12),logger18('l2',12,12),logger18('l3',7,11),logger18('l4',10,11),logger18('a1',3,13,'archer'),logger18('a2',14,13,'archer')],
 allies:[tree18('tr1',6,5),tree18('tr2',11,5),tree18('tr3',9,9)],
 civilians:[keeper18('f1',1,1),keeper18('f2',16,1),keeper18('f3',1,8),keeper18('f4',16,8),keeper18('f5',1,11),keeper18('f6',16,11)],
 waves:[{turn:3,story:'18:reinforce',units:[logger18('l5',0,5),logger18('l6',17,5)]},{turn:4,story:'18:captain',units:[logger18('lcap',9,13,'captain',{name:'벌목대장',kind:'captain',hp:160,atk:48,def:28,res:18,spd:24})]},{turn:5,units:[logger18('l7',0,10),logger18('a3',17,10,'archer')]},{turn:7,units:[logger18('l8',8,13),logger18('l9',10,13)]}],
 ward:[6,4,11,9],holdTurn:12,
 deployZone:s=>{const base=[];for(let y=4;y<=9;y++)for(let x=5;x<=12;x++)base.push([x,y]);return zone(base.filter(([x,y])=>Number.isFinite(TERRAIN[MISSIONS[18].map[y][x]].cost)&&!MISSIONS[18].allies.some(a=>a.x===x&&a.y===y)));},
 deployments:{recommended:[[8,7],[9,7],[7,6],[10,6],[6,8],[11,8],[8,8],[9,8]],assault:[[8,8],[9,8],[7,9],[10,9],[6,8],[11,8],[5,9],[12,9]],defense:[[8,6],[9,6],[7,5],[10,5],[7,7],[10,7],[8,5],[9,5]]},
 threatTurn:3,par:12,turnLimit:12,level:15,deployLimit:7,
 objective:'결계 고목 2그루 이상 지키며 TURN 12까지 버티거나 벌목대장 격파 (고목 2그루가 쓰러지면 패배)',
 brief:'비: 화염 피해 −50%, 불이 번지지 않습니다. 결계 안(숲 한가운데)에서는 화염이 통하지 않고 회복이 50% 강해집니다. 벌목대가 결계 고목(3)을 노립니다. 숲 가장자리의 숲지기(6) 곁에서 「구출」하면 결계 안으로 이끕니다.'});
// ---------- v0.9.2 ACT III part 3 「그림자」 (D-089, ACT3_DESIGN §4.2; maps, units and numbers PROPOSED) ----------
// M19 The Forbidden Rite: the chancellery's rite hall under the capital. Four ritual circles each hold a captive refugee
// (memory 3). From TURN 3, at the start of each turn, every lit circle with a ritualist within 3 tiles takes one memory from
// its captive, unless Lia stands within 2 of the circle or her Arcane Territory runes lie on it. A captive at 0 forgets
// their name (alive, but lost to themselves). A hero beside a circle breaks its seal (the search action, 「봉인 해제」).
// All four circles out is the victory; two captives forgotten or TURN 14 is a defeat. Lia's teacher stands on the dais.
const ritualist19=(id,x,y,circle)=>unit(id,'재상부 의식사','ritualist',x,y,{hp:56,atk:40,def:14,res:24,spd:22,mov:2,range:[1,2],look:'ritualist',circle});
const knight19=(id,x,y,stats={})=>unit(id,'의식 기사','spear',x,y,{hp:84,atk:46,def:26,res:14,spd:20,mov:3,look:'ritualKnight',...stats});
const cloak19=(id,x,y)=>unit(id,'재상부 회색 망토','bandit',x,y,{hp:66,atk:42,def:19,res:14,spd:24,mov:4,movementProfile:'rogue',look:'grayCloak'});
const circle19=(id,x,y,captive)=>({id,name:'의식진',kind:'ritualCircle',x,y,prop:true,captive});
const captive19=(id,x,y,look='refugee')=>({id,name:'붙잡힌 피난민',kind:'captive',look,x,y,hp:40,def:8,res:8});
MISSIONS[19]=authored({id:19,title:'금지된 의식',en:'The Forbidden Rite',
 rows:['xxxxxxxkkkkxxxxxxx','xkkkkkxkzzkxkkkkkx','xkkkkkkkzzkkkkkkkx','xkkkkkkkkkkkkkkkkx','xkkxkkkkxxkkkkxkkx','xkkkkkkkwwkkkkkkkx','kkkkkxkkwwkkxkkkkk','xkkkkkkkkkkkkkkkkx','xkkkkkkkkkkkkkkkkx','xkkxkkkkxxkkkkxkkx','xkkkkkkkkkkkkkkkkx','xkkkkkkkkkkkkkkkkx','xkkkkkkkkkkkkkkkkx','xxxxxxxkkkkxxxxxxx'],
 enemies:[ritualist19('r1',5,3,'rc1'),ritualist19('r2',12,3,'rc2'),ritualist19('r3',4,7,'rc3'),ritualist19('r4',13,7,'rc4'),
  knight19('ov',8,2,{name:'의식 감독관',kind:'captain',hp:140,atk:48,def:26,res:22,spd:24}),
  knight19('k1',7,5),knight19('k2',10,5),cloak19('g1',6,9),cloak19('g2',11,9),cloak19('g3',9,3)],
 objects:[circle19('rc1',4,3,'p1'),circle19('rc2',13,3,'p2'),circle19('rc3',3,7,'p3'),circle19('rc4',14,7,'p4')],
 civilians:[captive19('p1',4,2),captive19('p2',13,2,'farmer'),captive19('p3',3,6,'farmer'),captive19('p4',14,6),
  {id:'teacher',name:'리아의 스승',kind:'teacher',look:'liaTeacher',x:9,y:1,hp:44,def:6,res:14}],
 waves:[{turn:3,story:'19:reinforce',units:[knight19('k3',7,0),knight19('k4',10,0)]},{turn:5,units:[cloak19('g4',0,6),cloak19('g5',17,6)]}],
 drainTurn:3,drainRadius:3,liaRadius:2,memory:3,
 deployZone:s=>{const base=[];for(let y=11;y<=12;y++)for(let x=1;x<=16;x++)base.push([x,y]);return zone(base);},
 deployments:{recommended:[[8,11],[9,11],[5,11],[12,11],[7,12],[10,12],[4,12],[13,12]],assault:[[8,11],[9,11],[3,11],[14,11],[6,11],[11,11],[2,12],[15,12]],defense:[[8,12],[9,12],[6,12],[11,12],[7,11],[10,11],[5,12],[12,12]]},
 threatTurn:99,par:11,turnLimit:14,level:16,deployLimit:7,
 objective:'의식진 4곳을 모두 끄기 · TURN 14 안에 (포로 2명이 이름을 잊으면 패배)',
 brief:'TURN 3부터 턴이 시작될 때마다, 의식사가 3칸 안에 있는 의식진은 포로의 기억(3)을 하나씩 거둡니다. 리아가 진 2칸 안에 있거나 마력 지형의 룬이 진을 덮으면 그 진은 멈춥니다. 진 곁에서 「봉인 해제」하면 그 진이 꺼집니다.'});
// M20 The Crown's Shadow: the night the betraying banner strikes the capital's gate. Two ways at once: the chancellery archive
// to the north (three cabinets hold the pages of the controlled-war plan; searching one secures its pages) and the burning
// lower city to the south (six residents in their houses; the fire spreads through the houses and leaps on set turns).
// Clerks set a cabinet alight from TURN 3 when they end the enemy phase beside it; a lit cabinet burns to ash at the end of
// the next enemy phase unless it is searched first. Grey cloaks hide in the shadows (the first blow misses). TURN 2: Kai's
// old superior challenges him to a duel. Victory: two cabinets searched and four residents evacuated. Defeat: two cabinets
// burned, three residents lost, or TURN 13.
const cloak20=(id,x,y)=>unit(id,'재상부 회색 망토','bandit',x,y,{hp:66,atk:42,def:19,res:14,spd:24,mov:4,movementProfile:'rogue',look:'grayCloak',shade:true});
const clerk20=(id,x,y,cabinet)=>unit(id,'재상부 서기','clerk',x,y,{hp:46,atk:24,def:14,res:12,spd:20,mov:2,look:'clerk',clerk:true,cabinet});
const soldier20=(id,x,y,role='soldier')=>unit(id,'배신한 깃발의 병사',role==='archer'?'archer':'spear',x,y,{hp:72,atk:44,def:20,res:12,spd:22,mov:3,scav:role,...(role==='archer'?{range:[2,3],hp:56,atk:40,def:14,spd:24}:{})});
const cabinet20=(id,x,y)=>({id,name:'문서고 서가',kind:'cabinet',x,y,prop:true});
const resident20=(id,x,y,look='refugee')=>({id,name:'하층가 주민',kind:'resident',look,x,y,hp:40,def:10,res:8});
MISSIONS[20]=authored({id:20,title:'왕관의 그림자',en:"The Crown's Shadow",
 rows:['xxxxxxxxxxxxxxxxxx','xkkkxkkkkkkkkxkkkx','xkkkxkkkkkkkkxkkkx','xkkkkkkkkkkkkkkkkx','xxkxxxxkkkkxxxxkxx','rrrrrrrrrrrrrrrrrr','rrggrrrrggrrrrggrr','wwwbwwwwwbbwwwwbww','lllllllllrllllllll','lvvlvvlvvrlvvlvvll','lvvlvvlvvrlvvlvvll','lllllllllrllllllll','lvvllvvllrlvvllvvl','lvvllvvllrlvvllvvl'],
 enemies:[unit('sup','회색 장부의 우두머리','captain',9,2,{hp:150,atk:48,def:26,res:20,spd:28,mov:4,movementProfile:'rogue',look:'greyMaster'}),
  clerk20('ck1',6,2,'cb1'),clerk20('ck2',11,2,'cb2'),clerk20('ck3',11,3,'cb3'),
  cloak20('g1',7,3),cloak20('g2',10,3),cloak20('g3',3,3),cloak20('g4',14,3),cloak20('g5',4,8),cloak20('g6',13,8)],
 objects:[cabinet20('cb1',1,1),cabinet20('cb2',8,1),cabinet20('cb3',16,1)],
 civilians:[resident20('h1',2,9),resident20('h2',5,10,'farmer'),resident20('h3',8,9,'child'),resident20('h4',11,10),resident20('h5',15,9,'farmer'),resident20('h6',6,12)],
 waves:[{turn:3,story:'20:gate',units:[soldier20('b1',8,13),soldier20('b2',10,13)]},{turn:5,units:[soldier20('b3',8,13),soldier20('a1',10,13,'archer')]},{turn:7,units:[soldier20('b4',8,13),soldier20('b5',10,13)]}],
 // the fire: where it starts (TURN 1) and where it leaps on later turns; every turn it also spreads to the houses beside it
 fires:[{turn:1,cells:[[7,10],[12,9]]},{turn:3,cells:[[4,9],[14,10]]},{turn:5,cells:[[1,10],[5,13]]},{turn:7,cells:[[2,12],[11,13],[16,12]]}],
 fireDamage:10,burnTurn:3,duelTurn:2,plan:2,needed:4,
 deployZone:s=>{const base=[];for(let y=5;y<=6;y++)for(let x=2;x<=15;x++)base.push([x,y]);return zone(base);},
 deployments:{recommended:[[8,5],[9,6],[6,5],[11,5],[8,6],[10,6],[5,6],[12,6]],assault:[[7,5],[10,5],[4,5],[13,5],[8,5],[9,5],[3,6],[14,6]],defense:[[8,6],[9,6],[4,6],[13,6],[7,6],[10,6],[3,6],[15,6]]},
 threatTurn:4,par:10,turnLimit:13,level:16,deployLimit:7,
 objective:'문서고 서가 2곳 조사(계획서 확보) + 주민 4명 이상 대피 · TURN 13 안에 (서가 2곳이 타거나 주민 3명을 잃으면 패배)',
 brief:'북쪽 문서고: 재상부 서기가 TURN 3부터 서가 곁에서 불을 붙입니다. 불붙은 서가는 다음 적 턴이 끝나면 재가 되니 그 전에 조사하세요. 남쪽 하층가: 불길이 집에서 집으로 번지고 정해진 턴마다 다른 집으로 옮겨 붙습니다. 주민 곁에서 「구출」하면 대피합니다. 회색 망토는 그림자에 숨어 첫 공격을 피합니다. TURN 2 카이의 옛 상관이 일기토를 청합니다.'});
// ---------- v0.9.3 ACT III part 4 「잿빛 선택」 (D-093, ACT3_DESIGN §4.2; maps, units and numbers PROPOSED) ----------
// M21 The Last King: the crown's heart under the palace. Bellard's rite knights try to finish the succession rite with the
// king's last memories. The king cannot move from the throne dais. Four anchor stones hold the rite to the hall: a hero
// beside one breaks it (the search action, 「고정석 깨기」) — Erik, Thea, Dario and Ines at one blow, the others in two.
// The ward pulses every turn, the outer ring (5–6 tiles from the king) on odd turns, the inner ring (2–3) on even turns:
// a hero who ends the player phase on a pulsing tile loses 3 MP. Each broken stone gives the king back 10 HP.
// TURN 2: the rite knight commander challenges Erik. Victory: four stones broken, or the king alive at the end of TURN 12.
// Defeat: the king falls.
const knight21=(id,x,y,stats={})=>unit(id,'의식 기사','spear',x,y,{hp:88,atk:48,def:27,res:15,spd:21,mov:3,look:'ritualKnight',...stats});
const ritualist21=(id,x,y)=>unit(id,'재상부 의식사','ritualist',x,y,{hp:58,atk:42,def:15,res:26,spd:22,mov:2,range:[1,2],look:'ritualist'});
const cloak21=(id,x,y)=>unit(id,'재상부 회색 망토','bandit',x,y,{hp:68,atk:44,def:20,res:15,spd:25,mov:4,movementProfile:'rogue',look:'grayCloak'});
const anchor21=(id,x,y)=>({id,name:'의식 고정석',kind:'anchorStone',x,y,prop:true});
MISSIONS[21]=authored({id:21,title:'마지막 국왕',en:'The Last King',
 rows:['xxxxxxxxkkxxxxxxxx','xkkkkkxkkkkxkkkkkx','xkkkkkkkkkkkkkkkkx','xkkxkkkkzzkkkkxkkx','xkkkkkkzzzzkkkkkkx','xkkkkkkzzzzkkkkkkx','xkkxkkkkzzkkkkxkkx','xkkkkkkkkkkkkkkkkx','xkkkkxkkkkkkxkkkkx','xkkkkkkkkkkkkkkkkx','xkkkkkkkkkkkkkkkkx','xxkkkkkkkkkkkkkkxx','xkkkkkkkkkkkkkkkkx','xxxxxxkkkkkkxxxxxx'],
 enemies:[knight21('rc',8,2,{name:'의식 기사단장',kind:'captain',hp:150,atk:47,def:27,res:22,spd:25,look:'ritualKnight'}),
  knight21('k1',3,1),knight21('k2',14,1),knight21('k3',2,6),knight21('k4',15,6),
  ritualist21('r1',6,5),ritualist21('r2',11,5),cloak21('g1',3,5),cloak21('g2',14,5)],
 objects:[anchor21('as1',2,2),anchor21('as2',15,2),anchor21('as3',2,9),anchor21('as4',15,9)],
 civilians:[{id:'king',name:'마지막 국왕',kind:'king',look:'king',x:8,y:5,hp:160,def:26,res:30}],
 waves:[{turn:3,story:'21:reinforce',units:[knight21('k5',8,0),knight21('k6',9,0)]},{turn:5,units:[cloak21('g3',1,7),cloak21('g4',16,7)]},{turn:7,units:[knight21('k7',8,0),ritualist21('r3',9,0)]}],
 pulseOuter:[5,6],pulseInner:[2,3],pulseMP:3,kingHeal:10,duelTurn:2,
 deployZone:s=>{const base=[];for(let y=11;y<=12;y++)for(let x=2;x<=15;x++)base.push([x,y]);return zone(base);},
 deployments:{recommended:[[8,11],[9,11],[5,11],[12,11],[7,12],[10,12],[3,12],[14,12]],assault:[[7,11],[10,11],[3,11],[14,11],[8,11],[9,11],[2,12],[15,12]],defense:[[8,12],[9,12],[6,11],[11,11],[7,11],[10,11],[5,12],[12,12]]},
 threatTurn:99,par:10,turnLimit:12,level:17,deployLimit:7,
 objective:'의식 고정석 4개를 모두 깨거나 TURN 12가 끝날 때까지 국왕을 지키기 (국왕이 쓰러지면 패배)',
 brief:'국왕은 옥좌 단에서 움직이지 못합니다. 의식 기사들이 국왕을 노립니다. 고정석 곁에서 「고정석 깨기」 — 에릭·테아·다리오·이네스는 한 번에, 다른 장수는 두 번. 고정석을 하나 깰 때마다 국왕 HP +10. 결계 맥동: 홀수 턴은 바깥 고리(국왕에게서 5–6칸), 짝수 턴은 안쪽 고리(2–3칸) — 그 칸에서 아군 턴을 마친 장수는 MP −3. TURN 2 의식 기사단장이 에릭에게 일기토를 청합니다.'});
// M22 The Ashen Choice: the lower city's square. Three heralds read the records, the plan and the king's word to the people,
// each on a dais, four turns each (from TURN 2, one turn read at the start of every turn); a herald hurt since the last
// turn's start loses that turn. A fallen herald's dais can be read by a hero standing on it. The chancellery comes to stop
// the reading (from the north gate); the banner that betrayed the legion at the summit comes by the side roads; a banner at
// the 「동맹」 stage sends two knights (TURN 2, south gate). Recruits still away after M16 come back on TURN 3 (a last
// chance: standing at the end, they rejoin). Victory: the three readings. Defeat: two heralds down, or TURN 12.
// D-094: extras reuse existing painted figures — the heralds are people of the lower city (the refugee look); the commanders wear the rite knights'.
const herald22=(id,name,x,y,reads)=>({id,name,kind:'herald',look:'refugee',x,y,hp:62,def:14,res:14,reads});
const cloak22=(id,x,y)=>unit(id,'재상부 회색 망토','bandit',x,y,{hp:68,atk:44,def:20,res:15,spd:25,mov:4,movementProfile:'rogue',look:'grayCloak'});
const knight22=(id,x,y,stats={})=>unit(id,'의식 기사','spear',x,y,{hp:88,atk:48,def:27,res:15,spd:21,mov:3,look:'ritualKnight',...stats});
const soldier22=(id,x,y,role='soldier')=>unit(id,'배신한 깃발의 병사',role==='archer'?'archer':'spear',x,y,{hp:74,atk:45,def:21,res:12,spd:22,mov:3,scav:role,...(role==='archer'?{range:[2,3],hp:58,atk:41,def:15,spd:24}:{})});
const banner22=(id,f,x,y)=>ally(id,{iron:'철왕관 기사',free:'연맹 기사',flame:'성화 기사'}[f],{iron:'ironInfantry',free:'lordA',flame:'flameKnight'}[f],x,y,{kind:'soldier',hp:78,atk:44,def:24,res:14,spd:22,mov:4,banner:f,benched:true});
const return22=(id,look,x,y)=>ally(id,look==='thea'?'테아':look==='dario'?'다리오':'이네스',look,x,y,{returning:look,benched:true});
MISSIONS[22]=authored({id:22,title:'잿빛 선택',en:'The Ashen Choice',
 rows:['xxxxxxxxrrxxxxxxxx','xvvlllllrrlllllvvx','xvvllkkkkkkkkllvvx','xlllkkkkkkkkkklllx','rrrlkzkkkkkkzklrrr','xlllkkkkkkkkkklllx','xvvlkkkkkkkkkklvvx','xvvlkkkkzzkkkklvvx','xlllkkkkkkkkkklllx','xllllllllllllllllx','xvvllllrrrrllllvvx','xlllllllrrlllllllx','xllllllrrrrllllllx','xxxxxxxrrrrxxxxxxx'],
 enemies:[knight22('gc',8,1,{name:'재상부 근위대장',kind:'captain',hp:150,atk:50,def:28,res:20,spd:25,look:'ritualKnight'}),
  knight22('k1',7,1),knight22('k2',10,1),cloak22('g1',3,1),cloak22('g2',14,1),cloak22('g3',9,1)],
 civilians:[herald22('hr','기록 낭독자',5,4,'records'),herald22('hp','계획서 낭독자',12,4,'plan'),herald22('hk','국왕의 말 낭독자',8,7,'king')],
 allies:[banner22('bi1','iron',7,13),banner22('bi2','iron',8,12),banner22('bf1','free',9,13),banner22('bf2','free',10,12),banner22('bl1','flame',7,12),banner22('bl2','flame',10,13),
  return22('rthea','thea',8,13),return22('rdario','dario',9,12),return22('rines','ines',11,12)],
 waves:[{turn:2,units:[cloak22('g6',0,4),cloak22('g7',17,4)]},{turn:3,story:'22:betrayer',units:[soldier22('b1',0,4),soldier22('b2',17,4)]},{turn:4,units:[cloak22('g4',8,0),knight22('k3',9,0)]},{turn:5,units:[soldier22('b3',0,4),soldier22('a1',17,4,'archer')]},{turn:7,units:[soldier22('b4',0,4),soldier22('b5',17,4),cloak22('g5',8,0)]}],
 readTurn:2,reads:4,bannerTurn:2,returnTurn:3,
 deployZone:s=>{const base=[];for(let y=5;y<=10;y++)for(let x=3;x<=14;x++)if(!(x===8&&y===7))base.push([x,y]);return zone(base);},
 deployments:{recommended:[[5,5],[12,5],[8,8],[6,5],[11,5],[9,7],[4,5],[13,5]],assault:[[5,5],[12,5],[8,6],[9,6],[4,5],[13,5],[8,8],[7,8]],defense:[[5,5],[12,5],[8,8],[4,5],[13,5],[7,7],[10,7],[9,8]]},
 threatTurn:1,par:8,turnLimit:12,level:17,deployLimit:7,
 objective:'세 낭독(기록·계획서·국왕의 말)을 모두 마치기 · TURN 12 안에 (전령 2명이 쓰러지면 패배)',
 brief:'전령 셋이 단 위에서 TURN 2부터 턴마다 한 번씩, 네 번 읽습니다. TURN 1에는 광장의 사람들이 길을 막아 적이 전령을 노리지 못합니다. 지난 턴 시작 뒤 다친 전령은 그 턴을 읽지 못합니다. 쓰러진 전령의 단에 장수가 서면 대신 읽습니다. 재상부는 북쪽 성문에서, 배신한 깃발은 동서 길에서 옵니다. 신뢰가 「동맹」인 깃발은 TURN 2 남쪽에서 기사 둘을 보냅니다.'});
// ---------- v0.10.0 ACT IV 「잿빛 왕관」 part 1 「연합」 (D-099/D-100, docs/v0.10.0/ACT4_DESIGN.md §4.1; maps and numbers PROPOSED) ----------
// M23 Toward the End of the War: the alliance camp at night. The three leaders and their guards fight beside the legion as allied
// units that take orders (따르라 / 지켜라 / 자유). Three council tents: an enemy that ends two enemy phases in a row beside a
// tent takes it. Victory: the raid captain falls, or TURN 10 ends. Defeat: two tents taken. A leader who falls costs their
// banner's trust (−1), never the battle. D-094: the raid captain wears the rite knights' painted sheet.
const knight23=(id,x,y,stats={})=>unit(id,'의식 기사','spear',x,y,{hp:90,atk:49,def:27,res:15,spd:21,mov:3,look:'ritualKnight',...stats});
const cloak23=(id,x,y)=>unit(id,'재상부 회색 망토','bandit',x,y,{hp:70,atk:45,def:20,res:15,spd:25,mov:4,movementProfile:'rogue',look:'grayCloak'});
const bolt23=(id,x,y)=>unit(id,'재상부 석궁수','archer',x,y,{hp:58,atk:42,def:15,res:13,spd:24,mov:3,range:[2,3],look:'grayCloak'});
const leader23=(id,name,look,x,y,faction)=>ally(id,name,look,x,y,{faction,kind:'leader',leader:true,orderable:true,hp:110,atk:44,def:24,res:18,spd:22,mov:4});
const guard23=(id,name,look,x,y,faction)=>ally(id,name,look,x,y,{faction,orderable:true,hp:84,atk:44,def:24,res:14,spd:21,mov:4});
const tent23=(id,faction,x,y)=>({id,name:{iron:'철왕관 천막',free:'연맹 천막',flame:'성화 천막'}[faction],kind:'tent',faction,x,y,prop:true,locked:true});
MISSIONS[23]=authored({id:23,title:'전쟁의 끝을 향해',en:'Toward the End of the War',
 rows:['ffggggggrrggggggff','fgggggggrrgggggggf','ggggggggrrgggggggg','ggrrrrrrrrrrrrrrgg','ggrgggggrrgggggrgg','ggrgggggrrgggggrgg','fgrgggggrrgggggrgf','ggrrrrrrrrrrrrrrgg','ggggggggrrgggggggg','gggggggrrrrggggggg','fggggggrggrggggggf','ggggggggrrgggggggg','fgggggggrrgggggggf','ffggggggrrggggggff'],
 enemies:[knight23('k1',6,0),knight23('k2',11,0),cloak23('g1',1,2),cloak23('g2',16,2),bolt23('a1',9,0)],
 objects:[tent23('ti','iron',5,5),tent23('tf','free',12,5),tent23('tl','flame',8,10)],
 allies:[leader23('cassian','카시안 · 철왕관 통령','cassian',5,6,'iron'),leader23('leonora','레오노라 · 연맹 의장','leonora',12,6,'free'),leader23('lucien','루시안 · 성화 대사제','lucien',9,10,'flame'),
  guard23('ig1','철왕관 근위병','ironInfantry',4,5,'iron'),guard23('fg1','연맹 경비병','guard',13,5,'free'),guard23('lg1','성화 기사','flameKnight',8,11,'flame')],
 waves:[{turn:2,story:'23:flank',units:[cloak23('g3',0,8),cloak23('g4',17,8)]},{turn:3,story:'23:south',units:[knight23('k3',8,13),knight23('k4',9,13),cloak23('g7',0,13)]},
  {turn:4,story:'23:captain',units:[knight23('rk',8,0,{name:'재상부 습격대장',kind:'captain',hp:230,atk:52,def:30,res:24,spd:25}),knight23('k8',7,0),knight23('k9',10,0)]},
  {turn:5,units:[cloak23('g5',0,11),cloak23('g6',17,11),knight23('k5',8,13)]},{turn:7,units:[knight23('k6',0,4),knight23('k7',17,4),bolt23('a2',9,13)]}],
 siegeTurns:2,
 deployZone:s=>{const base=[];for(let y=6;y<=9;y++)for(let x=3;x<=14;x++)base.push([x,y]);return zone(base.filter(([x,y])=>!MISSIONS[23].objects.some(o=>o.x===x&&o.y===y)&&!MISSIONS[23].allies.some(a=>a.x===x&&a.y===y)));},
 deployments:{recommended:[[8,7],[9,7],[6,7],[11,7],[7,8],[10,8],[4,7],[13,7]],assault:[[8,6],[9,6],[7,6],[10,6],[6,7],[11,7],[8,7],[9,7]],defense:[[6,6],[11,6],[7,9],[10,9],[5,7],[12,7],[8,8],[9,8]]},
 threatTurn:1,par:8,turnLimit:10,level:18,deployLimit:7,
 objective:'재상부 습격대장 격파 또는 TURN 10까지 회의 천막 지키기 (천막 2곳을 빼앗기면 패배)',
 brief:'세 지도자와 호위가 동맹군으로 함께 싸웁니다. 동맹 유닛을 누르면 「따르라 · 지켜라 · 자유」를 지시할 수 있습니다. 적이 천막 곁에서 적 턴을 두 번 연달아 마치면 천막을 빼앗깁니다. 지도자가 쓰러지면 그 깃발의 신뢰 −1 (패배는 아님). 습격대장은 TURN 4에 북쪽에서 나타납니다.'});
// M24 The Last Border: the ward breaks from the border. North of the wall the ash tide comes in a row a turn from TURN 2; anyone
// who ends the player phase on ash loses 10% of their max HP (the ash beasts are at home in it). Eight refugees walk two tiles
// a turn toward the gate (inside: row 9 and below). The player closes the gate at the lever (beside it, once six are in) —
// the Ashen Night's mirror: whoever is still outside stays outside. Victory: the gate closed with six or more inside (it
// closes by itself at the end of TURN 10). Defeat: three refugees fall, or fewer than six inside when it closes.
const beast24=(id,x,y,stats={})=>unit(id,'재의 짐승','bandit',x,y,{hp:72,atk:45,def:19,res:11,spd:24,mov:4,look:'ashRaider',ashBorn:true,...stats});
const refugee24=(id,x,y,look='refugee')=>({id,name:'국경 피난민',kind:'civilian',look,refugee:true,x,y,hp:44,def:12,res:10});
MISSIONS[24]=authored({id:24,title:'최후의 국경',en:'The Last Border',
 rows:['fffgggggrrgggggfff','ffggggggrrggggggff','fgggfgggrrgggfgggf','gggggggrrrrggggggg','ggfggggrggrggggfgg','gggggggrggrggggggg','ggggfggrrrrggfgggg','ggggggggrrgggggggg','xxxxxxxxkkxxxxxxxx','vvggggggrrggggggvv','vgggrrrrrrrrrrgggv','ggvgggggrrgggggvgg','gvvgggggrrgggggvvg','ggggggggrrgggggggg'],
 enemies:[beast24('b1',0,5),beast24('b2',17,5),beast24('b3',12,0)],
 civilians:[refugee24('p1',6,3),refugee24('p2',11,3),refugee24('p3',4,4,'pilgrim'),refugee24('p4',13,4),refugee24('p5',5,5,'child'),refugee24('p6',12,5),refugee24('p7',1,0,'pilgrim'),refugee24('p8',16,0)],
 objects:[{id:'lever',name:'관문 권양기',kind:'gateLever',x:11,y:9,prop:true,locked:true},{id:'gl1',name:'관문',kind:'gateLeaf',x:8,y:8,prop:true,locked:true,benched:true},{id:'gl2',name:'관문',kind:'gateLeaf',x:9,y:8,prop:true,locked:true,benched:true}],
 waves:[{turn:2,story:'24:beasts',units:[beast24('b4',0,2),beast24('b5',17,2)]},{turn:4,units:[beast24('b6',4,0),beast24('b7',13,0)]},{turn:6,units:[beast24('b8',0,6),beast24('b9',17,6),beast24('b10',8,0)]},{turn:8,units:[beast24('b11',5,0),beast24('b12',12,0)]}],
 ashTurn:2,ashRows:8,ashCut:10,gateRow:8,gate:[[8,8],[9,8]],insideRow:9,refugeeSteps:2,needInside:6,lostLimit:3,
 deployZone:s=>{const base=[];for(let y=5;y<=7;y++)for(let x=3;x<=14;x++)base.push([x,y]);for(let x=6;x<=12;x++)base.push([x,9]);return zone(base.filter(([x,y])=>Number.isFinite(TERRAIN[MISSIONS[24].map[y][x]].cost)&&!MISSIONS[24].civilians.some(c=>c.x===x&&c.y===y)&&!(x===11&&y===9)));},
 deployments:{recommended:[[6,6],[11,6],[4,5],[13,5],[6,7],[11,7],[10,9],[7,9]],assault:[[6,5],[11,5],[4,5],[13,5],[5,6],[12,6],[3,6],[14,6]],defense:[[6,7],[11,7],[5,7],[12,7],[10,9],[7,9],[4,6],[13,6]]},
 threatTurn:1,par:8,turnLimit:10,level:18,deployLimit:7,
 objective:'피난민 6명 이상을 관문 안에 들이고 관문 닫기 · TURN 10이 끝나면 저절로 닫힘 (피난민 3명이 쓰러지면 패배)',
 brief:'TURN 2부터 북쪽에서 한 줄씩 재의 조수가 밀려옵니다 — 재 칸에서 아군 턴을 마친 사람은 최대 HP의 10%를 잃습니다(재의 짐승은 멀쩡). 피난민 8명이 턴마다 2칸씩 관문으로 걷습니다(관문 칸을 비워 두세요). 6명이 들어오면 관문 권양기 곁에서 관문을 닫을 수 있습니다 — 언제 닫을지는 에릭이 정합니다. 밖에 남은 사람은 밖에 남습니다.'});
// v0.5.0 Phase E (D-047): promotion trials (101–105) and the repeatable Legion Drill (110). Non-story
// skirmishes after ACT I: never pushed into campaign.completed, no gold, permanent EXP (mission level 7).
// goal: survive (turn N ends with `protect` alive) · rout (all enemies down by `limit`) · reach (hero at row ≤ y)
// · gather (turn N ends with every `must` hero within `radius` of the trial hero). companions join the trial hero.
const skirmish=(id,kind,hero,m)=>{MISSIONS[id]=authored({id,skirmish:{kind,hero,...(m.tier?{tier:m.tier}:{})},threatTurn:99,level:7,par:m.limit,turnLimit:m.limit,...m});};
// (level is overridable per skirmish; the drill uses 9 so heroes below Lv 7 catch up faster)
skirmish(101,'trial','eric',{title:'수호의 시련',en:'Trial of the Guardian',
 rows:['ggggrrrrgggg','gfggrrrrggfg','ggggrrrrgggg','xxxxxrxrxxxx','xxxxxrxrxxxx','gggggrrrgggg','ggggggggfggg','gggvggggvggg','gggggggggggg','gggggggggggg'],
 enemies:[unit('b1','훈련 교관','bandit',4,0,{hp:30,atk:14,def:5,spd:6,mov:4}),unit('b2','훈련 교관','bandit',6,0,{hp:30,atk:14,def:5,spd:6,mov:4}),unit('b3','훈련 교관','bandit',8,0,{hp:30,atk:14,def:5,spd:6,mov:4}),unit('b4','훈련 교관','bandit',5,1,{hp:30,atk:14,def:5,spd:6,mov:4}),unit('b5','훈련 교관','bandit',7,1,{hp:30,atk:14,def:5,spd:6,mov:4})],
 civilians:[{id:'t1',name:'훈련병',kind:'trainee',x:4,y:8,hp:14,def:2,res:2},{id:'t2',name:'훈련병',kind:'trainee',x:8,y:8,hp:14,def:2,res:2}],
 deployments:{recommended:[[6,5],[0,9],[1,9],[10,9],[11,9]]},threatTurn:1,escortOnly:true,limit:5,
 goal:{type:'survive',turn:5,protect:['t1','t2'],hold:[6,5]},must:['eric'],
 objective:'TURN 5가 끝날 때까지 훈련병 2명 보호',brief:'방벽: 에릭 옆 칸의 적은 움직이지 못하고, 들어온 적도 멈춥니다. 두 관문 출구 사이에 서세요.'});
skirmish(102,'trial','elina',{title:'경계의 시련',en:'Trial of the Watch',
 rows:['gggggggggggg','gggfgggggfgg','gggggggggggg','ggggggrggggg','gggggrrrgggg','ggggrrrrrggg','gggggrrrgggg','ggggffffgggg','gggffffffggg','ggggffffgggg'],
 enemies:[unit('r1','습격 교관','bandit',1,0,{hp:26,atk:13,def:3,spd:7,mov:4}),unit('r2','습격 교관','bandit',4,0,{hp:26,atk:13,def:3,spd:7,mov:4}),unit('r3','습격 교관','bandit',7,0,{hp:26,atk:13,def:3,spd:7,mov:4}),unit('r4','습격 교관','bandit',10,0,{hp:26,atk:13,def:3,spd:7,mov:4}),unit('r5','습격 교관','bandit',6,1,{hp:26,atk:13,def:3,spd:7,mov:4})],
 deployments:{recommended:[[0,9],[5,8],[1,9],[10,9],[11,9]]},limit:9,
 goal:{type:'rout'},must:['elina'],
 objective:'TURN 9까지 습격 교관 5명 격파',brief:'경계 사격: 적 Phase에 사거리로 처음 들어온 적을 쏘고, 맞히면 그 자리에 묶습니다.'});
skirmish(103,'trial','lia',{title:'마력의 시련',en:'Trial of the Rune',
 rows:['gggggggggggg','ggfggvvggfgg','gggggvvggggg','gggggggggggg','ggggrrrrgggg','gggrrrrrrggg','ggggrrrrgggg','gggggggggggg','gggfggggfggg','gggggggggggg'],
 enemies:[unit('g1','룬 수호상','captain',3,1,{hp:64,atk:12,def:14,res:14,spd:3,mov:2}),unit('g2','룬 수호상','captain',6,0,{hp:64,atk:12,def:14,res:14,spd:3,mov:2}),unit('g3','룬 수호상','captain',8,1,{hp:64,atk:12,def:14,res:14,spd:3,mov:2}),unit('c1','룬 시종','bandit',4,2,{hp:22,atk:12,def:4,res:4,spd:5}),unit('c2','룬 시종','bandit',7,2,{hp:22,atk:12,def:4,res:4,spd:5})],
 deployments:{recommended:[[6,7],[0,9],[5,8],[10,9],[11,9]]},limit:7,companions:['eric'],
 goal:{type:'rout',targets:['g1','g2','g3']},must:['lia'],
 objective:'TURN 7까지 룬 수호상 3기 격파 (에릭 호위)',brief:'마력 지형: 십자 5칸 룬 위에서 아군 MAG +3, 적 RES −2. 수호상은 단단하지만 마법에 약해집니다.'});
skirmish(104,'trial','sain',{title:'구원의 시련',en:'Trial of the Ember',
 rows:['gggggggggggg','ggfgggggggfg','gggggggggggg','gggggggggggg','ggggggfggggg','gggggggggggg','gggggggggggg','ggggvttvgggg','gggggttggggg','gggggggggggg'],
 enemies:[unit('b1','추격 교관','bandit',2,0,{hp:34,atk:14,def:6,spd:6}),unit('b2','추격 교관','bandit',5,0,{hp:34,atk:14,def:6,spd:6}),unit('b3','추격 교관','bandit',9,0,{hp:34,atk:14,def:6,spd:6}),unit('b4','추격 교관','bandit',11,1,{hp:34,atk:14,def:6,spd:6}),unit('b5','추격 교관','bandit',0,1,{hp:34,atk:14,def:6,spd:6}),unit('a1','추격 궁수','archer',7,0,{hp:26,atk:13,def:3,spd:7})],
 deployments:{recommended:[[1,2],[0,9],[1,9],[6,8],[10,2]]},limit:5,companions:['eric','kai'],wounded:['eric','kai'],
 goal:{type:'gather',turn:5,radius:2},must:['sain','eric','kai'],
 objective:'TURN 5가 끝날 때 부상한 에릭·카이가 세인 곁(2칸 이내)에 생존',brief:'에릭과 카이는 부상으로 걷지 못합니다(HP 40%). 귀환의 기도로 2–4칸 떨어진 동료를 세인 곁으로 데려오세요.'});
skirmish(105,'trial','kai',{title:'그림자의 시련',en:'Trial of the Shadow',
 rows:['gggggggggggg','gggggggggggg','ggfggggggfgg','xxxxxxgxxxxx','gggggggggggg','ggfggggggfgg','gggggggggggg','gggggrrggggg','gggggrrggggg','gggggrrggggg'],
 enemies:[unit('s1','관문 파수꾼','captain',6,3,{hp:90,atk:10,def:15,res:10,spd:3,mov:1}),unit('w1','경비 교관','bandit',3,5,{hp:24,atk:12,def:4,spd:6,mov:2}),unit('w2','경비 교관','bandit',9,5,{hp:24,atk:12,def:4,spd:6,mov:2}),unit('w3','경비 교관','bandit',4,1,{hp:24,atk:12,def:4,spd:6,mov:2}),unit('w4','경비 궁수','archer',8,1,{hp:22,atk:12,def:3,spd:7,mov:1})],
 deployments:{recommended:[[0,9],[1,9],[11,9],[10,9],[6,8]]},limit:6,
 goal:{type:'reach',hero:'kai',row:0},must:['kai'],
 objective:'TURN 6까지 카이가 북쪽 끝(맨 윗줄) 도달',brief:'관문 틈은 파수꾼이 막고 있습니다. 그림자 교환으로 파수꾼과 자리를 바꿔 빠져나가세요.'});
skirmish(110,'drill',null,{title:'군단 훈련',en:'Legion Drill',level:9,
 rows:['ggggffggggggff','gfgggggrrggggf','ggggvgrrggvggg','ggggggrrgggggg','gffgggrrggggfg','gggggrrrrggggg','ggggrrggrrgggg','gggrrggggrrggg','ffggggfggggggf','gggvggggggvggg','gggggggggggggg','gggggggggggggg'],
 enemies:[unit('d1','모의전 보병','bandit',3,1,{hp:28,atk:14,def:6,spd:6}),unit('d2','모의전 보병','bandit',6,0,{hp:28,atk:14,def:6,spd:6}),unit('d3','모의전 보병','bandit',9,1,{hp:28,atk:14,def:6,spd:6}),unit('d4','모의전 보병','bandit',11,3,{hp:28,atk:14,def:6,spd:6}),unit('d5','모의전 보병','bandit',2,4,{hp:28,atk:14,def:6,spd:6}),unit('d6','모의전 궁수','archer',7,2,{hp:24,atk:13,def:3,spd:7}),unit('d7','모의전 궁수','archer',12,1,{hp:24,atk:13,def:3,spd:7}),unit('d8','모의전 대장','captain',8,0,{hp:40,atk:15,def:7,res:4,spd:6})],
 civilians:[{id:'q1',name:'보급병',kind:'trainee',x:1,y:6,hp:24,def:2,res:2},{id:'q2',name:'보급병',kind:'trainee',x:12,y:6,hp:24,def:2,res:2}],
 deployments:{recommended:[[6,10],[4,11],[7,11],[6,11],[9,10]]},threatTurn:4,limit:12,
 deployZone:s=>{const base=[];for(let y=9;y<=11;y++)for(let x=2;x<12;x++)base.push([x,y]);return zone(base);},
 goal:{type:'rout'},
 objective:'TURN 12까지 모의전 부대 8명 격파 (보급병 구출은 선택)',brief:'반복 가능한 훈련. 전투 경험과 잠재력 기록이 영구히 남습니다. 미션 레벨 7.'});
// v0.9.1 (D-084, ACT3_DESIGN §5.2, §6; PROPOSED): awakening trials 106–108 (Tier 3, the ④ skill) and the recruits'
// promotion trials 111–113 (Tier 2, the ① trait). ACT III instructors; mission levels 14 and 13 for EXP.
const drill3=(id,name,kind,x,y,stats={})=>unit(id,name,kind,x,y,{hp:56,atk:33,def:16,res:12,spd:20,mov:4,...(kind==='archer'?{hp:46,atk:31,def:12,spd:22,range:[2,3]}:{}),...stats});
const trainee3=(id,x,y)=>({id,name:'훈련병',kind:'trainee',x,y,hp:72,def:18,res:14});
skirmish(106,'trial','elina',{tier:3,level:14,title:'매의 시련',en:'Trial of the Hawk',
 rows:['gggggggggggg','ggfggggggfgg','gggggrrggggg','ggggrrrrgggg','gggrrggrrggg','ggrrggggrrgg','gggggffggggg','ggggffffgggg','gggggggggggg','gggggggggggg'],
 enemies:[drill3('r1','추격 교관','bandit',2,0),drill3('r2','추격 교관','bandit',5,0),drill3('r3','추격 교관','bandit',8,0),drill3('r4','추격 교관','bandit',11,1),drill3('r6','추격 궁수','archer',6,1)],
 deployments:{recommended:[[5,8],[6,9],[4,9],[7,9],[3,9],[8,9],[2,9],[9,9]]},limit:7,companions:['eric'],
 goal:{type:'rout'},must:['elina'],
 objective:'TURN 7까지 추격 교관 5명 격파 (에릭 호위)',brief:'퇴로 봉쇄(④, 전투당 1회): 5칸 안의 칸을 중심으로 십자 5칸을 봉쇄합니다. 다음 적 턴에 그 안의 적은 밖으로 나가지 못하고, 움직이면 화살을 맞습니다.'});
skirmish(107,'trial','eric',{tier:3,level:14,title:'맹세의 시련',en:'Trial of the Oath',
 rows:['ggggrrrrgggg','gfggrrrrggfg','ggggrrrrgggg','xxxxxrrxxxxx','xxxxxrrxxxxx','gggrrrrrrggg','ggggrrrrgggg','gggvggggvggg','gggggggggggg','gggggggggggg'],
 enemies:[drill3('b1','돌파 교관','bandit',4,0),drill3('b2','돌파 교관','bandit',6,0),drill3('b3','돌파 교관','bandit',8,0),drill3('b4','돌파 교관','bandit',5,1),drill3('b6','돌파 궁수','archer',2,1)],
 civilians:[trainee3('t1',5,7),trainee3('t2',6,7),trainee3('t3',6,8)],
 deployments:{recommended:[[5,4],[6,4],[1,9],[10,9],[11,9],[2,9],[9,9],[3,9]]},threatTurn:1,escortOnly:true,limit:5,companions:['sain'],
 goal:{type:'survive',turn:5,protect:['t1','t2','t3'],hold:[5,4]},must:['eric'],
 objective:'TURN 5가 끝날 때까지 훈련병 3명 보호 (세인 지원)',brief:'맹세의 성벽(④, 전투당 1회): 다음 아군 턴까지 2칸 안 아군과 주민이 받는 피해의 절반을 에릭이 대신 받고, 그동안 에릭은 HP 1 아래로 내려가지 않습니다.'});
skirmish(108,'trial','sain',{tier:3,level:14,title:'새벽의 시련',en:'Trial of the Dawn',
 rows:['gggggggggggg','ggfgggggggfg','gggggggggggg','gggggrrggggg','ggggrrrrgggg','gggggrrggggg','gggggggggggg','ggggvttvgggg','gggggttggggg','gggggggggggg'],
 enemies:[drill3('d1','추격 교관','bandit',2,0,{atk:34}),drill3('d2','추격 교관','bandit',5,0,{atk:34}),drill3('d3','추격 교관','bandit',9,0,{atk:34}),drill3('d5','추격 궁수','archer',7,0,{atk:32})],
 deployments:{recommended:[[5,8],[5,6],[6,7],[0,9],[1,9],[10,9],[11,9],[2,9]]},limit:5,companions:['eric','kai'],
 goal:{type:'standing',turn:5,revive:['eric','kai']},must:['sain','eric','kai'],
 objective:'TURN 5가 끝날 때 세인·에릭·카이가 모두 서 있음 (쓰러진 동료는 다시 일으켜도 됨)',brief:'새벽의 기도(④, 전투당 1회): 이번 전투에서 쓰러진 아군 한 명을 세인 곁에 HP 1/3로 일으킵니다. 쓰러진 동료가 있어도 TURN 5가 끝날 때 서 있으면 됩니다.'});
// v0.9.2 (D-089): the awakening trials of Lia (109, after M19) and Kai (114, after M20).
skirmish(109,'trial','lia',{tier:3,level:14,title:'결계의 시련',en:'Trial of the Ward',
 rows:['gggggggggggg','ggfggggggfgg','gggggggggggg','gggggggggggg','gggggggggggg','xxgxxxxxxgxx','gggggggggggg','ggggvttvgggg','gggggttggggg','gggggggggggg'],
 enemies:[drill3('w1','결계 교관','bandit',1,0),drill3('w2','결계 교관','bandit',4,0),drill3('w3','결계 교관','bandit',7,0),drill3('w4','결계 교관','bandit',10,0),drill3('w5','결계 교관','bandit',6,1),drill3('w6','결계 궁수','archer',3,1)],
 civilians:[trainee3('t1',5,8),trainee3('t2',6,8),trainee3('t3',6,7)],
 deployments:{recommended:[[9,6],[2,5],[1,9],[10,9],[11,9],[0,9],[3,9],[8,9]]},threatTurn:1,escortOnly:true,limit:4,companions:['eric'],
 goal:{type:'survive',turn:4,protect:['t1','t2','t3'],hold:[9,6],posts:{eric:[2,5]}},must:['lia'],
 objective:'TURN 4가 끝날 때까지 훈련병 3명 보호 (에릭 지원)',brief:'작은 결계(④, 전투당 1회): 4칸 안의 칸을 중심으로 3×3 결계를 2턴 칩니다. 적은 결계 안으로 들어오지 못하고, 안의 아군은 RES +5. 담장의 틈은 둘 — 하나는 에릭이, 하나는 결계가 막으세요.'});
skirmish(114,'trial','kai',{tier:3,level:14,title:'그림자 군주의 시련',en:'Trial of the Shadow Lord',
 rows:['gggggggggggg','googgggggoog','googgggggoog','ggggrrrrgggg','gggrrggrrggg','ggrrggggrrgg','gggggffggggg','ggggffffgggg','gggggggggggg','gggggggggggg'],
 enemies:[drill3('s1','그림자 교관','bandit',4,1),drill3('s2','그림자 교관','bandit',7,1),drill3('s3','그림자 교관','bandit',5,3),drill3('s4','지붕 궁수','archer',1,1),drill3('s5','지붕 궁수','archer',10,1)],
 deployments:{recommended:[[5,8],[6,9],[4,9],[7,9],[3,9],[8,9],[2,9],[9,9]]},limit:5,companions:['elina'],
 goal:{type:'rout',targets:['s4','s5']},must:['kai'],
 objective:'TURN 5까지 지붕 위 궁수 둘 격파 (엘리나 지원)',brief:'그림자 군무(④, 전투당 1회): 카이 4칸 안의 두 유닛 자리를 바꿉니다. 옮겨진 적은 다음 적 턴에 움직이지 못합니다. 지붕 위의 궁수를 아군 곁으로 끌어내리세요.'});
skirmish(111,'trial','thea',{level:13,title:'흑철의 시련',en:'Trial of Black Iron',
 rows:['gggggggggggg','gggggggggggg','ggrrrrrrrrgg','gggggggggggg','gggggggggggg','ggggrrrrgggg','gggggggggggg','gggggggggggg','gggggggggggg','gggggggggggg'],
 enemies:[drill3('k1','보병 교관','bandit',1,1,{hp:48}),drill3('k2','보병 교관','bandit',4,0,{hp:48}),drill3('k3','보병 교관','bandit',7,0,{hp:48}),drill3('k4','보병 교관','bandit',10,1,{hp:48}),drill3('k5','궁병 교관','archer',3,3,{hp:40}),drill3('k6','궁병 교관','archer',8,3,{hp:40})],
 deployments:{recommended:[[6,8],[5,9],[7,9],[4,9],[8,9],[3,9],[9,9],[2,9]]},limit:6,companions:['eric'],
 goal:{type:'rout'},must:['thea'],
 objective:'TURN 6까지 교관 6명 격파 (에릭 호위)',brief:'흑철 창기사: 돌격으로 적을 쓰러뜨리면 남은 이동을 쓸 수 있습니다. 쓰러뜨리고 다음 표적 쪽으로 빠지세요.'});
skirmish(112,'trial','dario',{level:13,title:'검성의 시련',en:'Trial of the Sword Saint',
 rows:['gggggggggggg','gfggggggggfg','gggggggggggg','ggggrrrrgggg','gggrrrrrrggg','gggrrrrrrggg','ggggrrrrgggg','gggggggggggg','gggggggggggg','gggggggggggg'],
 enemies:[drill3('w1','검술 교관','bandit',2,1,{atk:28}),drill3('w2','검술 교관','bandit',5,0,{atk:28}),drill3('w3','검술 교관','bandit',8,0,{atk:28}),drill3('w4','검술 교관','bandit',10,1,{atk:28}),drill3('w5','검술 교관','bandit',1,4,{atk:28})],
 deployments:{recommended:[[6,5],[6,9],[5,9],[7,9],[4,9],[8,9],[3,9],[9,9]]},limit:5,companions:['sain'],
 goal:{type:'survive',turn:5},must:['dario'],
 objective:'TURN 5가 끝날 때까지 다리오 생존 (세인 지원)',brief:'검성: 받아치기 상태에서는 반격을 두 번 합니다. 광장 한가운데에서 둘러싸이게 두세요.'});
skirmish(113,'trial','ines',{level:13,title:'성소의 시련',en:'Trial of the Sanctum',
 rows:['gggggggggggg','ggfggggggfgg','gggggggggggg','xxxxxrrxxxxx','ggggzzzzgggg','ggggzzzzgggg','gggggggggggg','gggggggggggg','gggggggggggg','gggggggggggg'],
 enemies:[drill3('p1','습격 교관','bandit',1,0),drill3('p2','습격 교관','bandit',4,0),drill3('p3','습격 교관','bandit',7,0),drill3('p4','습격 교관','bandit',10,0),drill3('p5','습격 궁수','archer',3,1)],
 civilians:[trainee3('t1',4,6),trainee3('t2',7,6),trainee3('t3',5,7)],
 deployments:{recommended:[[5,3],[6,3],[4,8],[7,8],[3,8],[8,8],[2,8],[9,8]]},threatTurn:1,escortOnly:true,limit:5,companions:['eric'],
 goal:{type:'survive',turn:5,protect:['t1','t2','t3'],hold:[5,3]},must:['ines'],
 objective:'TURN 5가 끝날 때까지 훈련병 3명 보호 (에릭 지원)',brief:'성소 수호자: 성역이 2칸까지 닿습니다(2칸 거리는 피해 −1). 훈련병 사이에 서세요.'});
// v0.10.0 (D-099 Q4): the awakening trials of Ines (115, after M23) and Thea (116, after M24). PROPOSED.
skirmish(115,'trial','ines',{tier:3,level:14,title:'새벽 성기사의 시련',en:'Trial of the Dawn Paladin',
 rows:['gggggggggggg','ggfggggggfgg','gggggggggggg','gggggggggggg','ggggzzzzgggg','ggggzzzzgggg','gggggggggggg','gggggggggggg','gggggggggggg','gggggggggggg'],
 enemies:[drill3('q1','돌격 교관','bandit',2,0),drill3('q2','돌격 교관','bandit',5,0),drill3('q3','돌격 교관','bandit',8,0),drill3('q4','돌격 교관','bandit',10,1),drill3('q5','돌격 궁수','archer',3,1)],
 civilians:[trainee3('t1',5,4),trainee3('t2',6,4),trainee3('t3',6,5)],
 deployments:{recommended:[[5,5],[5,6],[4,8],[7,8],[3,8],[8,8],[2,8],[9,8]]},threatTurn:1,escortOnly:true,limit:5,companions:['sain'],
 goal:{type:'survive',turn:4,protect:['t1','t2','t3'],hold:[5,5]},must:['ines'],
 objective:'TURN 4가 끝날 때까지 훈련병 3명 보호 (세인 지원)',brief:'성역의 문(④, 전투당 1회): 3칸 안의 아군·주민·동맹군이 다음 아군 턴까지 받는 피해가 절반이 되고 상태이상이 풀립니다. 적이 몰려오는 턴에 여세요.'});
skirmish(116,'trial','thea',{tier:3,level:14,title:'흑철 기병대장의 시련',en:'Trial of the Black Iron Captain',
 rows:['gggggggggggg','gggggggggggg','ggrrrrrrrrgg','gggggggggggg','xxxgggggxxxx','gggggggggggg','gggggggggggg','gggggggggggg','gggggggggggg','gggggggggggg'],
 enemies:[drill3('w1','방진 교관','bandit',4,4,{hp:52}),drill3('w2','방진 교관','bandit',5,4,{hp:52}),drill3('w3','방진 교관','bandit',6,4,{hp:52}),drill3('w4','방진 교관','bandit',7,4,{hp:52}),drill3('c1','지휘 교관','archer',5,1,{hp:44}),drill3('c2','지휘 교관','archer',7,1,{hp:44})],
 deployments:{recommended:[[5,7],[6,8],[4,8],[7,8],[3,8],[8,8],[2,8],[9,8]]},limit:5,companions:['dario'],
 goal:{type:'rout',targets:['c1','c2']},must:['thea'],
 objective:'TURN 5까지 방진 뒤의 지휘 교관 둘 격파 (다리오 지원)',brief:'철의 돌파(④, 전투당 1회): 직선 2–4칸을 꿰뚫고 끝 칸에 섭니다. 길 위의 적은 모두 공격받고(반격 없음), 끝 칸에서 3칸 더 움직일 수 있습니다. 방진을 꿰뚫어 뒤의 지휘 교관에게 닿으세요.'});
export const isSkirmish=id=>!!MISSIONS[id]?.skirmish;
export const LAST_MISSION=Math.max(...Object.keys(MISSIONS).map(Number).filter(id=>!MISSIONS[id].skirmish));
