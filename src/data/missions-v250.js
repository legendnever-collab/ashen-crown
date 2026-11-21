// v2.5.0 ACT IV 큰 맵 1부 (D-141, docs/v2.5.0/ACT4_MAPS_DESIGN.md §2): M23–M26 on big maps, the same way as M15–M22
// (src/data/missions-v240.js, missions-v241.js). Objectives, special rules, story, allied orders, the duel and the persuasion
// are unchanged; terrain, entry direction, size and the line-up change. Enemy counts start from the originals (the v2.4
// lesson: the design's larger counts were unwinnable on the big maps) and rise by tests only up to the design's cap; what
// must be guarded or opened stays within a few turns of the legion. Maps drawn by scripts/make-act4-maps.py.
// M23: the alliance camp inside a palisade with four gates, the three council tents in the middle; the north forest, the
// marsh causeways east and west, the river bridge in the south. M24: the pass from the north is under the ash when the tide
// starts (m.ashBase rows), the refugees walk down the slope to the gate in the wall, the village inside. M25: the
// hardliners' north camp, the west and east camps behind their fences, the legion at the south crossroads. M26: the Lion's
// Pass — the lion camp at the top, the broad wagon road up the west and the narrow rock path up the east.
// m.captainBox keeps the M25 captain and Baldrick inside it until their turn (it replaces the old "y <= 3").
export const ROWS2500={
 23:["ffffggffffffrrffffffffffff","ffffffffffffrrfffffggfffff","ffffffffgfffrrfffgffffffff","gffgggggggggrrgggggggggffg","gffggxxxxxxxrrxxxxxxxggffg","gggggxgvvgggrrgggvvgxggggg","sssssxgvvgggrrgggvvgxsssss","sssssxggggggrrggggggxsssss","sssssxggggggrrggggggxsssss","rrrrrrrrrrrrrrrrrrrrrrrrrr","rrrrrrrrrrrrrrrrrrrrrrrrrr","sssssxggggggrrggggggxsssss","sssssxggggggrrggggggxsssss","sssssxgvvgggrrgggvvgxsssss","gggggxgvvgggrrgggvvgxggggg","ggffgxxxxxxxrrxxxxxxxgffgg","ggffggggggggrrggggggggffgg","wwwwwwwwwwwwbbwwwwwwwwwwww","wwwwwwwwwwwwbbwwwwwwwwwwww","ggggggggfffgrrggfffggggggg"],
 24:["mmmmmmmmrrrrmmmmmmmm","mmmmmmmmrrrrmmmmmmmm","mmmmmmmmrrrrmmmmmmmm","mmmmmmggggggggmmmmmm","mmmmmmggggggggmmmmmm","mmmmmmggggggggmmmmmm","mmmmmmggggggggmmmmmm","mmmggggggggggggggmmm","mmmggggggggggggggmmm","mmmggggggggggggggmmm","ffgggggggrrgggggggff","ffgfgggxgrrgxgggfgff","ffgggfgggrrgggfgggff","ffggggggrrrrggggggff","ffggggxggrrggxggggff","ffggfggggrrggggfggff","ffgggggggrrgggggggff","ffgggggggrrgggggggff","xxxxxxxxxkkxxxxxxxxx","vvvggggggrrggggggvvv","vvvrrrrrrrrrrrrrrvvv","gggggggggrrggggggggg","gvvvgvvvgrrgvvvgvvvg","gvvvgvvvgrrgvvvgvvvg"],
 25:["gfffffggxggggggggggggxggfffffg","ffffffggxgvvvggggvvvgxggffffff","ffffffggxggggggggggggxggffffff","ffffffggrggggggggggggrggffffff","ffffffggxggggggggggggxggffffff","ggggggggxxxxxxrrxxxxxxgggggggg","ggggggggggggggrrgggggggggggggg","xxxxxxxggmmmggrrggmmmggxxxxxxx","gvvgggxggmmmggrrggmmmggxgggvvg","ggggggxgggggggrrgggggggxgggggg","ggggggrrrrrrrrrrrrrrrrrrgggggg","ggggggrrrrrrrrrrrrrrrrrrgggggg","ggggggxgggggggrrgggggggxgggggg","gvvgggxggmmmfgrrgfmmmggxgggvvg","xxxxxxxggmmmfgrrgfmmmggxxxxxxx","gggrggggggggggrrggggggggggrggg","gggrrrrrrrrrrrrrrrrrrrrrrrrggg","fffffgggggggggrrgggggggggfffff","fffffgfffffgggrrgggfffffgfffff","fffffgfffffgggrrgggfffffgfffff"],
 26:["mmmmggggggrrggggggmmmm","mmmmggvvggggggvvggmmmm","mmmmggggggggggggggmmmm","mmmmggvggggggggvggmmmm","mmmmggggggggggggggmmmm","mmmgffggggggggggffgmmm","mmmgffggggggggggffgmmm","mmmgrrggmmmmmmmgrmmmmm","mmmgrrgfmmmmmgmgrmmmmm","mmmgrrgfgmmmmgmgrmmmmm","mmmfrrgggmmmmmggrmmmmm","mmmfrrggmmmmmmggrmmmmm","mmmggrrrrrrrrgmgrmmmmm","mmmmgrrrrrrrrgmgrmmmmm","mmmmggggggrrgggggmmmmm","mmmmmmmmmgrrgggggmmmmm","mmmmmmmmmgrrfggmmmmmmm","mmmmmmmmmgrrfggmmmmmmm","mmmmmmmmmgrrgggmmmmmmm","mmmmmmmmmgrrgggmmmmmmm","mmmmggggggrrggggggmmmm","mmmmgffgggrrgggffgmmmm","mmmmgffgggrrgggffgmmmm","mmmmggggggrrggggggmmmm"]
};
const g2500=rows=>rows.map(r=>r.split(''));
const open2500=(rows,x,y)=>!!rows[y]&&!'xw'.includes(rows[y][x]??'x');
const area2500=(rows,x0,y0,x1,y1,skip=[])=>{const out=[];for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(open2500(rows,x,y)&&!skip.some(([a,b])=>a===x&&b===y))out.push([x,y]);return out;};
// [template id, new id, x, y, extra]: a copy of the mission's own unit (from its enemies or waves) at a new place
const U250=(t,id,x,y,o)=>[t,id,x,y,o];
export const V250_MISSIONS={
 23:{zoneArea:[9,7,16,12],
  enemies:[U250('k1','k1',10,2),U250('k2','k2',15,2),U250('a1','a1',12,1),U250('g1','g1',2,4),U250('g2','g2',23,4),
   U250('k1','k10',7,2),U250('g1','g8',4,3),U250('a1','a3',14,1)], // v2.5.0: up to the design's cap (8+16; the old 5+14 first-tried 53/54)
  objects:[['ti','철왕관 회의 천막','tent',9,7],['tf','연맹 회의 천막','tent',16,7],['tl','성화 회의 천막','tent',12,12]],
  allies:{cassian:[8,8],leonora:[17,8],lucien:[11,13],ig1:[9,6],fg1:[16,6],lg1:[13,13]},
  waves:[{turn:2,story:'23:flank',units:[U250('g3','g3',0,9),U250('g4','g4',25,9)]},
   {turn:3,story:'23:south',units:[U250('k3','k3',12,19),U250('k4','k4',13,19),U250('g7','g7',0,16)]},
   {turn:4,story:'23:captain',units:[U250('rk','rk',12,0),U250('k8','k8',11,0),U250('k9','k9',14,0),U250('k1','k11',13,0)]},
   {turn:5,units:[U250('g5','g5',0,10),U250('g6','g6',25,10),U250('k5','k5',13,19)]},
   {turn:7,units:[U250('k6','k6',0,9),U250('k7','k7',25,9),U250('a2','a2',12,19),U250('g3','g9',0,10)]}],
  deploy:[[12,9],[13,9],[12,10],[13,10],[11,9],[14,9],[11,10],[14,10],[10,9],[15,9],[10,10],[15,10]],
  council:{terrain:'Alliance Camp · 울타리(문 넷) 안 진영 풀밭 · 가운데 회의 천막 3(철왕관 서 · 연맹 동 · 성화 남) / 북쪽 숲 / 동서 늪과 둑길 / 남쪽 강의 다리',intel:'의식 기사 3 · 석궁수 2(북쪽 숲) · 회색 망토 3(북쪽 숲 양끝). TURN 2 동서 둑길 망토 2, TURN 3 남쪽 다리 기사 2와 망토 1, TURN 4 북쪽 습격대장과 기사 3, TURN 5 둑길 망토 2 · 남쪽 기사 1, TURN 7 둑길 기사 2 · 망토 1 · 남쪽 석궁수 1.'}},
 24:{zoneArea:[3,13,16,17],ashBase:10,ashRows:18,gateRow:18,gate:[[9,18],[10,18]],insideRow:19,
  enemies:[U250('b1','b1',1,15),U250('b2','b2',18,15),U250('b3','b3',13,10),U250('b1','b13',5,9),U250('b2','b14',14,9),U250('b3','b15',7,8)], // the cap (6+12)
  objects:[['lever','관문 권양기','gateLever',12,19],['gl1','관문','gateLeaf',9,18],['gl2','관문','gateLeaf',10,18]],
  civilians:{p1:[7,13],p2:[12,13],p3:[5,14],p4:[14,14],p5:[6,15],p6:[13,15],p7:[2,10],p8:[17,10]},
  waves:[{turn:2,story:'24:beasts',units:[U250('b4','b4',1,12),U250('b5','b5',18,12)]},
   {turn:4,units:[U250('b6','b6',8,6),U250('b7','b7',11,6),U250('b6','b16',10,5)]},
   {turn:6,units:[U250('b8','b8',1,16),U250('b9','b9',18,16),U250('b10','b10',9,5),U250('b8','b17',1,14)]},
   {turn:8,units:[U250('b11','b11',7,7),U250('b12','b12',12,7),U250('b11','b18',9,6)]}],
  deploy:[[7,16],[12,16],[5,15],[14,15],[7,17],[12,17],[11,17],[8,17],[9,16],[10,16]],
  brief:'북쪽 고개는 이미 재에 덮였습니다. TURN 2부터 재의 조수가 고개에서 한 줄씩 내려옵니다 — 재 칸에서 아군 턴을 마친 사람은 최대 HP의 10%를 잃습니다(재의 짐승은 멀쩡). 피난민 8명이 턴마다 2칸씩 관문으로 걷습니다(관문 칸을 비워 두세요). 6명이 들어오면 관문 권양기 곁에서 관문을 닫을 수 있습니다 — 언제 닫을지는 에릭이 정합니다. 밖에 남은 사람은 밖에 남습니다.',
  council:{terrain:'The Last Border · 북쪽 고개(재에 덮임) / 비탈 풀밭 · 양옆 숲 · 바위 / 성벽과 관문(2칸) · 관문 안 마을 · 관문 권양기',intel:'재의 짐승 6(양옆 숲 · 고개 아래). TURN 2 양옆 숲 2, TURN 4 고개 3, TURN 6 양옆 숲 3 · 고개 1, TURN 8 고개 3. 재의 조수 TURN 2부터 고개 아래로 한 줄씩.'}},
 25:{zoneArea:[11,15,18,17],captainBox:[9,0,20,4],
  enemies:[U250('hc','hc',14,2),U250('n1','n1',12,3),U250('n2','n2',17,3),U250('n11','n11',13,4),U250('n12','n12',16,4),U250('n3','n3',10,2),U250('n4','n4',19,2),
   U250('n1','n13',14,4),U250('n2','n14',15,4),U250('n3','n15',12,1),U250('n4','n16',17,1)], // the cap (11+8)
  allies:{lw:[2,10],w1:[3,9],w2:[3,12],w3:[1,11],le:[27,10],e1:[26,9],e2:[26,12],e3:[28,11]},
  waves:[{turn:2,story:'25:flank',units:[U250('n5','n5',6,1),U250('n6','n6',23,1)]},
   {turn:4,units:[U250('n7','n7',13,0),U250('n8','n8',16,0),U250('n7','n17',14,0)]},
   {turn:6,story:'25:riders',units:[U250('n9','n9',5,19),U250('n10','n10',24,19),U250('n9','n18',14,19)]}],
  deploy:[[14,16],[15,16],[13,16],[16,16],[14,17],[15,17],[12,16],[17,16],[14,15],[15,15],[13,17],[16,17]],
  council:{terrain:'Summit Field · 옛 회담장 · 북쪽 진영(울타리, 강경파) / 서 · 동 진영(울타리, 다른 두 깃발) / 남쪽 갈림길(군단) · 가운데 길 · 능선',intel:'강경파 대장 1(TURN 5까지 북쪽 진영) · 창병 6 · 궁수 4. TURN 2 북쪽 숲 양끝 창병 2, TURN 4 북쪽 창병 2 · 궁수 1, TURN 6 남쪽 가장자리 · 가운데 길 기병 3. 서 · 동 진영: 지도자 1 · 호위 2 · 궁수 1씩'}},
 26:{zoneArea:[5,20,16,23],captainBox:[4,0,17,4],
  enemies:[U250('boss','boss',11,2),U250('f1','f1',9,3),U250('f2','f2',13,3),U250('c1','c1',6,4),U250('c2','c2',15,4),U250('a1','a1',10,1),U250('a2','a2',12,1),U250('c1','c5',8,4),U250('c2','c6',13,4),U250('a1','a3',9,1)], // the cap (10+6)
  waves:[{turn:3,story:'26:riders',units:[U250('c3','c3',3,8),U250('c4','c4',15,8),U250('c3','c7',4,8)]},
   {turn:5,units:[U250('s1','s1',10,0),U250('s2','s2',11,0),U250('s1','s3',12,0)]}],
  deploy:[[10,21],[11,21],[9,21],[12,21],[10,22],[11,22],[8,21],[13,21],[9,22],[12,22],[10,20],[11,20]],
  council:{terrain:"Lion's Pass · 꼭대기 사자 진(요새) / 서쪽 수레길(넓고 굽음) · 동쪽 바위길(좁고 곧음) / 산비탈 · 숲 / 고개 아래(군단)",intel:'발드릭 1(TURN 2 일기토, 그 전엔 사자 진) · 사자 기수 2 · 철왕관 기병 4 · 궁수 3. TURN 3 양옆 비탈 기병 3, TURN 5 사자 진 창병 3.'}}
};
// Applied after applyV241; the same shape as the ACT III maps.
export function applyV250(MISSIONS){
 for(const [k,d] of Object.entries(V250_MISSIONS)){const id=+k,m=MISSIONS[id],rows=ROWS2500[id];
  const pool=[...(m.enemies||[]),...(m.waves||[]).flatMap(w=>w.units||[])],copy=([t,nid,x,y,o])=>{const src=pool.find(u=>u.id===t);if(!src)throw Error(`M${id}: no unit ${t}`);return {...structuredClone(src),id:nid,x,y,...structuredClone(o||{})};};
  m.map=g2500(rows);m.width=rows[0].length;m.height=rows.length;
  m.layers={terrain:m.map,collision:m.map.map(r=>r.map(t=>['x','w'].includes(t))),buildings:[],objects:[],actors:'units',effects:'feedback',events:'narrative'};
  for(const key of ['par','turnLimit','objective','brief','captainBox','ashBase','ashRows','gateRow','gate','insideRow'])if(d[key]!==undefined)m[key]=structuredClone(d[key]);
  m.council=d.council; // terrain and intel lines; the plan stays the briefing's
  m.enemies=d.enemies.map(copy);m.waves=d.waves.map(w=>({...w,units:w.units.map(copy)}));m.reinforcements=[];m.v250=true;
  // objects: the mission's own, moved (their flags kept)
  if(d.objects){const list=m.objects||[];m.objects=d.objects.map(([oid,name,kind,x,y])=>{const src=list.find(o=>o.id===oid);if(!src)throw Error(`M${id}: no object ${oid}`);return {...structuredClone(src),name:src.name||name,kind,x,y};});}
  for(const key of ['allies','civilians']){const place=d[key];if(!place)continue;const list=m[key]||[];
   m[key]=Object.entries(place).map(([cid,[x,y]])=>{const src=list.find(u=>u.id===cid);if(!src)throw Error(`M${id}: no ${key} ${cid}`);const u={...structuredClone(src),id:cid,x,y};if(u.post)u.post={x,y};return u;});}
  const taken=[...(m.civilians||[]),...(m.allies||[]),...(m.objects||[])].map(c=>[c.x,c.y]),spots=d.deploy.filter(([x,y])=>open2500(rows,x,y)&&!taken.some(([a,b])=>a===x&&b===y));
  const [zx0,zy0,zx1,zy1]=d.zoneArea,inZone=area2500(rows,zx0,zy0,zx1,zy1,taken);
  m.deployZone=()=>new Set(inZone.map(([x,y])=>`${x},${y}`));
  m.deployments={recommended:spots.slice(0,8),assault:spots.slice(0,8),defense:spots.slice(-8)};}
 return MISSIONS;}
