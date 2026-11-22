// v2.7.0 (D-158, the user's request 2026-11-22 22:46 「Mission 6의 맵은 … 아래에서 위로 올라가는 방식이 맞을 것 같아」): M06
// 「재의 맹세」 rebuilt south to north on 22×24 — the legion and the refugees start in the burning south of the village and
// climb to the north wall's gate, as the dialogue always said (「남쪽에서 추격대」, 「관문 북쪽」 수비대, 「동쪽 감시탑 봉화」,
// 「서쪽 레버」). The rules, the objectives and the people are the v2.0.0 ones; refugees walk 3 tiles a turn beside a hero
// (core/mission-rules.js escortRefugees reads m.escortSteps). Saves of an M06 battle in progress reopen in its camp (schema 28).
const ROWS270_M06=[
  "fffffgggggrrgggggfffff",
  "fffgggggggrrgggggggfff",
  "fffgggggggrrgggggggfff",
  "fffgggggggrrgggggggfff",
  "xrxxqxxxxxkkxxxxxqxxxx",
  "frggggggggrrggggggmmmm",
  "fffgggggggrrgggggmmmmm",
  "fffgggggvvrrvvggmmmmmm",
  "fffgvvxxvvrrvvxxmmmmmm",
  "frggvvxxggrrggxxmmmmmm",
  "grgggggvvgrrgvvggmmmmm",
  "grgggggvvgrrgvvggggggg",
  "ggrrrrrrrrrrrrrrrrrrgg",
  "gggggxxgggrrgggxxggggg",
  "gggvvxxgggrrgggxxvvggg",
  "gggvvgggggrrgggggvvggg",
  "ggggggggggrrgggggggggg",
  "ggggggggvvrrvvgggggggg",
  "gggxxgggggrrgggggxxggg",
  "gggxxgggggrrgggggxxggg",
  "ggggggvvggrrggvvgggggg",
  "ffggggvvggrrggvvggggff",
  "ffgrrrrrrrrrrrrrrrrgff",
  "ffffffggggrrggggffffff"];
const unit270=(id,name,kind,x,y,stats={})=>({id,name,kind,x,y,hp:28,atk:12,def:4,res:3,spd:6,mov:3,range:kind==='archer'?[2,3]:[1,1],...stats});
const open270=(rows,x,y)=>!!rows[y]&&!'xw'.includes(rows[y][x]??'x');
const M06_V270={zoneArea:[5,14,16,20],safe:[6,0,15,2],gateGoal:{x:10,y:3},escortSteps:3,
 enemies:[unit270('boss','봉쇄 집행관','captain',10,1,{hp:72,atk:17,def:8,res:5,spd:6,mov:0,breakMov:3}),
  unit270('k1','왕실 봉인대','bandit',7,5,{hp:30,atk:14,def:6,spd:5,mov:0}),unit270('k2','왕실 봉인대','bandit',8,6,{hp:30,atk:14,def:6,spd:5,mov:0}),
  unit270('k3','왕실 봉인대','bandit',14,5,{hp:30,atk:14,def:6,spd:5,mov:0}),unit270('k4','왕실 봉인대','bandit',13,6,{hp:30,atk:14,def:6,spd:5,mov:0}),
  unit270('a1','봉인대 궁수','archer',4,4,{hp:24,atk:13,def:3,spd:7,mov:0}),unit270('a2','봉인대 궁수','archer',17,4,{hp:24,atk:13,def:3,spd:7,mov:0}),
  unit270('n1','북쪽 포위대','bandit',9,9,{hp:30,atk:14,def:6,spd:5}),unit270('n2','북쪽 포위대','spear',12,9,{hp:30,atk:14,def:6,spd:5}),
  unit270('e1','동쪽 포위대','bandit',18,13,{hp:30,atk:14,def:6,spd:5}),unit270('e2','동쪽 포위대','spear',19,11,{hp:30,atk:14,def:6,spd:5}),
  unit270('s1','서쪽 포위대','spear',3,10,{hp:30,atk:14,def:6,spd:5}),unit270('s2','서쪽 포위대','bandit',4,13,{hp:30,atk:14,def:6,spd:5}),
  unit270('beacon','감시탑 봉화','beacon',19,8,{hp:26,atk:0,def:3,res:3,spd:0,mov:0,range:[0,0],noScale:true})],
 civilians:[{id:'p1',name:'피난민 노인',x:9,y:16,hp:30,def:3},{id:'p2',name:'부상한 피난민',x:12,y:16,hp:30,def:3,startHP:13},{id:'p3',name:'피난민 어머니',x:9,y:17,hp:30,def:3},{id:'p4',name:'부상한 소년',x:12,y:17,hp:30,def:3,startHP:14}],
 objects:[['seal1','봉인석','sealstone',8,5,{locked:true,progress:0}],['seal2','봉인석','sealstone',13,5,{locked:true,progress:0}],['lever','측면 관문 레버','lever',2,10],['sidegate','측면 관문','gate',1,4,{inert:true}]],
 waves:[{trigger:'start',when:'reported',story:'6:inspector',units:[unit270('i1','군령부 감찰관','bandit',21,14,{hp:32,atk:15,def:6,spd:6})]},
  {trigger:'phase2',story:'6:pursuers',units:[unit270('r1','남쪽 추격대','bandit',6,23,{hp:28,atk:14,def:5,spd:6}),unit270('r2','남쪽 추격대','bandit',15,23,{hp:28,atk:14,def:5,spd:6})]},
  {trigger:'phase3',unlessBeacon:true,story:'6:garrison',units:[unit270('g1','관문 수비대','bandit',8,0,{hp:30,atk:14,def:6,spd:5}),unit270('g2','관문 수비대','bandit',13,0,{hp:30,atk:14,def:6,spd:5})]}],
 deploy:[[10,17],[11,17],[8,16],[13,16],[10,18],[11,18],[8,18],[13,18],[9,19],[12,19],[7,17],[14,17]],
 objective:'피난민 호위 → 봉인석 2개 해제(TURN 11 종료 전) → 봉쇄 집행관 격파 또는 생존 장수 전원 북쪽 관문 너머로 철수',
 brief:'불타는 마을의 남쪽에서 시작합니다. 북쪽 성벽의 관문이 탈출구입니다. 장수가 인접한 피난민은 매 턴 관문 쪽으로 3칸 이동합니다(HP 절반 이하는 세인의 치유가 필요). 피난민 머리 위에 지금 상태가 보입니다. 피난민 2명 통과 또는 TURN 5에 2단계: 관문 앞 봉인석에 인접해 해제(리아 1회, 다른 장수 2회 누적). 2단계가 되면 남쪽 길로 추격대가 피난민 뒤를 노립니다. 서쪽 레버는 측면 관문을 엽니다. 동쪽 산 위 봉화를 부수면 3단계 증원이 오지 않습니다.'};
export function applyV270(MISSIONS){const m=MISSIONS[6],d=M06_V270,rows=ROWS270_M06;
 m.map=rows.map(r=>r.split(''));m.width=rows[0].length;m.height=rows.length;
 m.layers={terrain:m.map,collision:m.map.map(r=>r.map(t=>['x','w'].includes(t))),buildings:[],objects:[],actors:'units',effects:'feedback',events:'narrative'};
 for(const k of ['enemies','civilians','waves','objective','brief','safe','gateGoal','escortSteps'])m[k]=structuredClone(d[k]);
 m.objects=d.objects.map(([id,name,kind,x,y,extra])=>({id,name,kind,x,y,...(extra||{})}));m.v270=true;
 const civ=d.civilians.map(c=>[c.x,c.y]),[x0,y0,x1,y1]=d.zoneArea,zone=[];for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(open270(rows,x,y)&&!civ.some(([a,b])=>a===x&&b===y))zone.push(`${x},${y}`);
 m.deployZone=()=>new Set(zone);
 const spots=d.deploy.filter(([x,y])=>open270(rows,x,y)&&!civ.some(([a,b])=>a===x&&b===y));m.deployments={recommended:spots.slice(0,8),assault:[...spots.slice(4),...spots.slice(0,4)].slice(0,8),defense:spots.slice(0,8)};
 return MISSIONS;}
