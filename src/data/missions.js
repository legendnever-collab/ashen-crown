import {MAP,ENEMIES,CIVILIANS,REINFORCEMENTS} from './game-data.js';
const grid=rows=>rows.map(r=>r.split(''));
const patrol=(id,name,x,y,kind='bandit',hp=28)=>({id,name,x,y,kind,hp,atk:12,def:4,res:3,spd:6,mov:3,range:kind==='archer'?[2,3]:[1,1]});
export const MISSIONS={
 1:{id:1,title:'잿빛 마을의 습격',en:'The Ashen Village',map:MAP,enemies:ENEMIES,civilians:CIVILIANS,reinforcements:REINFORCEMENTS,threatTurn:5,par:8,objective:'주민 2명 구출 + Garr 격파',brief:'T3 북쪽 증원 · T5 주민 위협. 구조는 인접해서 행동 1회.'},
 2:{id:2,title:'숲길의 추격',en:'Forest Pursuit',map:grid(['fgrrrgrrrgff','fgrgrfrgrgff','fggffrffggff','ffgffrffgfff','fggrrrrggfff','fgrffrffrgff','fgfffrrffgff','grgggrrgggrg','grgggrrgggrg','ggggrrrrgggg']),enemies:[patrol('b1','탈영병',3,5),patrol('b2','굶주린 습격자',8,5),patrol('a1','숲의 사수',6,4,'archer',25),patrol('b3','후미 경계병',2,3),{...patrol('boss','도주 대장',5,3,'captain',54),mov:1}],civilians:[],reinforcements:[],threatTurn:99,par:8,objective:'도주 대장 생포 또는 추격 종료 (8턴)',brief:'도주 대장 HP 절반 이하 → 인접 장수의 생포. 북쪽 출구로 도망치기 전에 퇴로를 막으세요. 생포 실패도 진행 가능.'},
 3:{id:3,title:'무너진 다리',en:'The Broken Bridge',map:grid(['ggggrrrrgggg','ggggrrrrgggg','ggggrrrrgggg','xxxxxbbxxxxx','xxxxxbbxxxxx','ggggrrrrgggg','ggggrrrrgggg','grgggrrgggrg','grgggrrgggrg','ggggrrrrgggg']),enemies:[patrol('b1','추격 선봉',3,5),patrol('b2','추격병',8,5),patrol('a1','교량 사수',7,2,'archer',25),patrol('b3','북부 경계병',3,2),{...patrol('boss','추격 지휘관',6,1,'captain',55),mov:2}],civilians:[{id:'c1',name:'부상한 Mira',x:4,y:6},{id:'c2',name:'Tomas',x:7,y:6}],reinforcements:[patrol('r1','후방 추격병',0,9),patrol('r2','후방 사수',11,9,'archer',24)],threatTurn:3,par:10,objective:'10턴 안에 1명 이상 구조 + 생존 장수 전원 북쪽 철수',brief:'장수가 인접한 주민은 매 턴 다리를 건너 이동합니다. 인접 구출은 즉시 안전 이송. y≤2에 생존 장수 전원이 모이면 철수. 전원 구조에 도전하세요.'}
};
export const missionOf=s=>MISSIONS[s?.missionId||1];
