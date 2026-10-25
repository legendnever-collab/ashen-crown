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
 threatTurn:3,par:10,sealTurn:11,level:7,turnLimit:16,escortOnly:true,healCivilians:true,
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
// v0.5.0 Phase E (D-047): promotion trials (101–105) and the repeatable Legion Drill (110). Non-story
// skirmishes after ACT I: never pushed into campaign.completed, no gold, permanent EXP (mission level 7).
// goal: survive (turn N ends with `protect` alive) · rout (all enemies down by `limit`) · reach (hero at row ≤ y)
// · gather (turn N ends with every `must` hero within `radius` of the trial hero). companions join the trial hero.
const skirmish=(id,kind,hero,m)=>{MISSIONS[id]=authored({id,skirmish:{kind,hero},threatTurn:99,level:7,par:m.limit,turnLimit:m.limit,...m});};
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
export const isSkirmish=id=>!!MISSIONS[id]?.skirmish;
export const LAST_MISSION=Math.max(...Object.keys(MISSIONS).map(Number).filter(id=>!MISSIONS[id].skirmish));
