// v2.4.1 ACT III 큰 맵 2부 (D-135, docs/v2.4.0/ACT3_MAPS_DESIGN.md §2): M19–M22 on big maps, the same way as M15–M18
// (src/data/missions-v240.js). Objectives, special rules, story and duel pairs are unchanged; terrain, entry direction, size and
// the enemy line-up change, and M20 gets more of its objects (서가 3 → 4, 주민 6 → 8; the counts needed stay). Numbers PROPOSED,
// tuned by act2-balance. Maps drawn by scripts/make-act3-maps.py. M19: down the stair into a vault of four chambers round a
// water channel, the overseer and Lia's teacher in the bottom chamber. M20: the archive to the north and the burning lower
// city to the south of the canal, the legion in the street between. M21: the throne in the middle of the palace, an anchor
// stone at the end of each wing. M22: the square with three daises, the chancellery from the north gate, the betraying banner
// from the east and west roads, the allied knights and the returning recruits up the south street.
// m.captainBox keeps each mission's captain inside it until his turn (it replaces the old "y <= n" rows).
export const ROWS2410={
 19:["xxxxxxxxxxxxkkkkxxxxxxxxxxxx","xxxxxxxxxxxxkkkkxxxxxxxxxxxx","xxkkkkkkkkkkkkkkkkkkkkkkkkxx","xxkkkkkkkkkkkkkkkkkkkkkkkkxx","xxxxxkxxxxxkkkkkkxxxxxkxxxxx","xxkkkkkkkxxkkkkkkxxkkkkkkkxx","xxkkkkkkkxxkkkkkkxxkkkkkkkxx","xxkkkkkkkkkkkkkkkkkkkkkkkkxx","xxkkkkkkkxxkxkkxkxxkkkkkkkxx","xxkkkkkkkxxkkkkkkxxkkkkkkkxx","xwwwwbwwwwwwwbbwwwwwwwbwwwwx","xwwwwbwwwwwwwbbwwwwwwwbwwwwx","xxkkkkkkkxxkkkkkkxxkkkkkkkxx","xxkkkkkkkxxkxkkxkxxkkkkkkkxx","xxkkkkkkkkkkkkkkkkkkkkkkkkxx","xxkkkkkkkxxkkkkkkxxkkkkkkkxx","xxkkkkkkkxxkkkkkkxxkkkkkkkxx","xxxxxxxxxxxkkkkkkxxxxxxxxxxx","xxxxxxxxxxxkzzzzkxxxxxxxxxxx","xxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
 20:["xxxxxxxxxxxxxxxxxxxxxxxxxxxx","xkkkkkkkkxkkkkkkkkxkkkkkkkkx","xkkkkkkkkxkkkkkkkkxkkkkkkkkx","xkkkkkkkkxkkkkkkkkxkkkkkkkkx","xkkkkkkkkkkkkkkkkkkkkkkkkkkx","xkkkkkkkkkkkkkkkkkkkkkkkkkkx","xxxxxxkxxxxxxkkxxxxxxkxxxxxx","xxxxxxkxxxxxxkkxxxxxxkxxxxxx","rrrrrrrrrrrrrrrrrrrrrrrrrrrr","rrrrrrrrrrrrrrrrrrrrrrrrrrrr","wwwwwwwbwwwwwwwwwwwwbwwwwwww","wwwwwwwbwwwwwwwwwwwwbwwwwwww","rrrrrrrrrrrrrrrrrrrrrrrrrrrr","lllllllllllllrrlllllllllllll","llvvllvvllvvlrrlvvllvvllvvll","llvvllvvllvvlrrlvvllvvllvvll","lllllllllllllrrlllllllllllll","lllllllllllllrrlllllllllllll","llvvllvvllvvlrrlvvllvvllvvll","llvvllvvllvvlrrlvvllvvllvvll","lllllllllllllrrlllllllllllll","xxxxxxxxxxxxxrrxxxxxxxxxxxxx"],
 21:["xxxxxxxxxxkkkkxxxxxxxxxx","xkkkkkkxxxkkkkxxxkkkkkkx","xkkkkkkxxxkkkkxxxkkkkkkx","xkkkkkkxxxkkkkxxxkkkkkkx","xkkkkkkxxxkkkkxxxkkkkkkx","xkkkkkkkkkkkkkkkkkkkkkkx","xkkkkkkkkkkkkkkkkkkkkkkx","xxxxxkkkkkkkkkkkkkkxxxxx","xxxxxkkkxkkkkkkxkkkxxxxx","xxxxxkkkkkkkkkkkkkkxxxxx","xxxxxkkkkkzzzzkkkkkxxxxx","kkkkkkkkkkzzzzkkkkkkkkkk","kkkkkkkkkkzzzzkkkkkkkkkk","xxxxxkkkkkzzzzkkkkkxxxxx","xxxxxkkkkkkkkkkkkkkxxxxx","xxxxxkkkxkkkkkkxkkkxxxxx","xxxxxkkkkkkkkkkkkkkxxxxx","xkkkkkkkkkkkkkkkkkkkkkkx","xkkkkkkkkkkkkkkkkkkkkkkx","xkkkkkkxxxkkkkxxxkkkkkkx","xkkkkkkxxxkkkkxxxkkkkkkx","xkkkkkkxxxkkkkxxxkkkkkkx","xkkkkkkxxxkkkkxxxkkkkkkx","xxxxxxxxxxkkkkxxxxxxxxxx"],
 22:["xxxxxxxxxxxxrrrrxxxxxxxxxxxx","lvvvlllvvvllrrrrllvvvllvvvll","lvvvlllvvvllrrrrllvvvllvvvll","llllllllllllrrrrllllllllllll","llllllkkkkkkkkkkkkkkkkllllll","lvvvllkkkkkkkkkkkkkkkklvvvll","lvvvllkkkkkkkkkkkkkkkklvvvll","llllllkkkzkkkkkkkkzkkkllllll","llllllkkkkkkkkkkkkkkkkllllll","rrrrrrkkkkkkkkkkkkkkkkrrrrrr","rrrrrrkkkkkkkkkkkkkkkkrrrrrr","llllllkkkkkkkkkkkkkkkkllllll","llllllkkkkkkkzzkkkkkkkllllll","lvvvllkkkkkkkkkkkkkkkklvvvll","lvvvllkkkkkkkkkkkkkkkklvvvll","llllllkkkkkkkkkkkkkkkkllllll","llllllllllllrrrrllllllllllll","lvvvllllllllrrrrlllllllvvvll","lvvvlllvvvllrrrrllvvvllvvvll","lllllllvvvllrrrrllvvvlllllll","llllllllllllrrrrllllllllllll","xxxxxxxxxxxxrrrrxxxxxxxxxxxx"]
};
const g2410=rows=>rows.map(r=>r.split(''));
const open2410=(rows,x,y)=>!!rows[y]&&!'xw'.includes(rows[y][x]??'x');
const area2410=(rows,x0,y0,x1,y1,skip=[])=>{const out=[];for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(open2410(rows,x,y)&&!skip.some(([a,b])=>a===x&&b===y))out.push([x,y]);return out;};
// [template id, new id, x, y, extra]: a copy of the mission's own unit (from its enemies or waves) at a new place
const U241=(t,id,x,y,o)=>[t,id,x,y,o];
export const V241_MISSIONS={
 19:{zoneArea:[11,8,16,13],par:10,turnLimit:14,captainBox:[11,15,16,18],
  enemies:[U241('r1','r1',6,6),U241('r2','r2',21,6),U241('r3','r3',6,13),U241('r4','r4',21,13),U241('ov','ov',13,17),U241('k1','k1',12,3),U241('k2','k2',15,3),
   U241('g1','g1',3,8),U241('g2','g2',24,8),U241('g3','g3',13,14)], // v2.4.1: the old ten (12+5 first-tried 7/30, the legion ringed in the gallery)
  objects:[['rc1','의식진','ritualCircle',7,6,{prop:true,captive:'p1'}],['rc2','의식진','ritualCircle',20,6,{prop:true,captive:'p2'}],['rc3','의식진','ritualCircle',7,13,{prop:true,captive:'p3'}],['rc4','의식진','ritualCircle',20,13,{prop:true,captive:'p4'}]],
  civilians:{p1:[7,5],p2:[20,5],p3:[7,12],p4:[20,12],teacher:[13,18]},
  waves:[{turn:3,story:'19:reinforce',units:[U241('k3','k3',12,18),U241('k4','k4',15,18)]},
   {turn:5,units:[U241('g4','g4',2,9),U241('g5','g5',25,9)]}],
  deploy:[[13,10],[14,10],[13,11],[14,11],[12,9],[15,9],[12,12],[15,12],[13,9],[14,9],[13,12],[14,12]],
  objective:'의식진 4곳을 모두 끄기 · TURN 14 안에 (포로 2명이 이름을 잊으면 패배)',
  brief:'계단을 내려온 군단은 의식장 가운데 회랑(물길의 다리 위)에서 시작합니다. 의식진 넷은 회랑 양옆의 네 방(물길 위 둘 · 아래 둘)에 하나씩 있습니다. TURN 3부터 턴이 시작될 때마다, 의식사가 3칸 안에 있는 의식진은 포로의 기억(3)을 하나씩 거둡니다. 리아가 진 2칸 안에 있거나 마력 지형의 룬이 진을 덮으면 그 진은 멈춥니다. 진 곁에서 「봉인 해제」하면 그 진이 꺼집니다. 의식 감독관과 리아의 스승은 맨 아래 방에 있습니다.',
  council:{terrain:'Underground Rite Hall · 성채 바닥 / 벽 · 기둥 / 물길(다리 셋) / 맨 아래 방(성소 바닥)',intel:'의식사 4(진마다 하나) · 의식 감독관(TURN 5까지 맨 아래 방) · 의식 기사 2(위 홀) · 회색 망토 3. TURN 3 맨 아래 방에서 기사 2, TURN 5 양옆 방에서 회색 망토 2.'}},
 20:{zoneArea:[1,8,26,9],par:10,turnLimit:13,captainBox:[1,1,26,5],
  enemies:[U241('sup','sup',13,2),U241('ck1','ck1',3,3,{cabinet:'cb1'}),U241('ck2','ck2',10,3,{cabinet:'cb2'}),U241('ck3','ck3',17,3,{cabinet:'cb3'}), // the fourth cabinet has no clerk of its own (four lit at once burned two every time)
   U241('g1','g1',6,4),U241('g2','g2',21,4),U241('g3','g3',11,4),U241('g4','g4',16,4),U241('g5','g5',5,16),U241('g6','g6',22,16)],
  objects:[['cb1','문서고 서가','cabinet',2,1,{prop:true}],['cb2','문서고 서가','cabinet',11,1,{prop:true}],['cb3','문서고 서가','cabinet',16,1,{prop:true}],['cb4','문서고 서가','cabinet',25,1,{prop:true}]],
  civilians:{h1:[2,14],h2:[6,15],h3:[7,14],h4:[20,15],h5:[21,14],h6:[24,15],h7:[3,15],h8:[25,14]}, // by the bridges and the edges; the houses by the south road stand empty
  fires:[{turn:1,cells:[[3,19],[25,18]]},{turn:3,cells:[[7,18],[16,18]]},{turn:5,cells:[[10,18],[20,18]]},{turn:7,cells:[[2,15],[25,14],[17,15]]}],
  waves:[{turn:3,story:'20:gate',units:[U241('b1','b1',13,21),U241('b2','b2',14,21)]},
   {turn:5,units:[U241('b3','b3',13,21),U241('a1','a1',14,21)]},
   {turn:7,units:[U241('b4','b4',13,21),U241('b5','b5',14,21)]}],
  deploy:[[13,8],[14,8],[12,9],[15,9],[13,9],[14,9],[11,8],[16,8],[10,9],[17,9],[9,8],[18,8]],
  objective:'문서고 서가 2곳 조사(계획서 확보) + 주민 4명 이상 대피 · TURN 13 안에 (서가 2곳이 타거나 주민 3명을 잃으면 패배)',
  brief:'군단은 운하 북쪽 문서고 거리에서 시작합니다. 북쪽 문서고: 재상부 서기(3)가 TURN 3부터 서가(4) 곁에서 불을 붙입니다. 불붙은 서가는 다음 적 턴이 끝나면 재가 되니 그 전에 조사하세요. 남쪽 하층가(다리 둘 건너): 불길이 집 안에서 번지고 정해진 턴마다 다른 집으로 옮겨 붙습니다. 주민(8) 곁에서 「구출」하면 대피합니다. 회색 망토는 그림자에 숨어 첫 공격을 피합니다. TURN 2 카이의 옛 상관이 일기토를 청합니다. TURN 3부터 남문으로 배신한 깃발의 병사들이 들어옵니다.',
  council:{terrain:"Chancellery & Lower City · 문서고(성채 바닥, 서가 넷) / 문서고 거리(길) / 운하(물) · 다리 둘 / 골목 / 집(불이 붙는 곳) / 남문",intel:'회색 장부의 우두머리(TURN 5까지 문서고 안) · 재상부 서기 3(서가 넷 중 셋 곁, TURN 3부터 불) · 회색 망토 6(그림자, 첫 공격 회피 · 넷은 문서고, 둘은 하층가). TURN 3 · 5 · 7 남문에서 배신한 깃발의 병사 2씩. 하층가 주민 8(다리 가까운 집과 양 끝 집).'}},
 21:{zoneArea:[9,18,14,23],par:10,turnLimit:12,captainBox:[10,0,13,4],
  enemies:[U241('rc','rc',11,3),U241('k1','k1',4,4),U241('k2','k2',19,4),U241('k3','k3',4,19),U241('k4','k4',19,19),U241('r1','r1',8,10),U241('r2','r2',15,10),U241('g1','g1',6,12),U241('g2','g2',17,12),
   U241('k1','k8',10,2),U241('g1','g6',1,11),U241('g1','g7',22,11)],
  objects:[['as1','의식 고정석','anchorStone',6,6,{prop:true}],['as2','의식 고정석','anchorStone',17,6,{prop:true}],['as3','의식 고정석','anchorStone',6,17,{prop:true}],['as4','의식 고정석','anchorStone',17,17,{prop:true}]], // where each wing meets the great hall (at the far corners the king fell in 13 of 13)
  civilians:{king:[12,12]},
  waves:[{turn:3,story:'21:reinforce',units:[U241('k5','k5',11,0),U241('k6','k6',12,0),U241('k5','k9',13,0)]},
   {turn:5,units:[U241('g3','g3',0,11),U241('g4','g4',23,11)]},
   {turn:7,units:[U241('k7','k7',11,0),U241('r3','r3',12,0)]}],
  deploy:[[11,19],[12,19],[10,20],[13,20],[11,20],[12,20],[10,19],[13,19],[11,21],[12,21],[10,21],[13,21]],
  objective:'의식 고정석 4개를 모두 깨거나 TURN 12가 끝날 때까지 국왕을 지키기 (국왕이 쓰러지면 패배)',
  brief:'왕관의 심장 궁. 국왕은 한가운데 옥좌 단에서 움직이지 못합니다. 의식 기사들이 국왕을 노립니다. 고정석 넷은 궁의 네 날개가 큰 방과 만나는 곳에 하나씩 있습니다. 고정석 곁에서 「고정석 깨기」 — 에릭·테아·다리오·이네스는 한 번에, 다른 장수는 두 번. 고정석을 하나 깰 때마다 국왕 HP +10. 결계 맥동: 홀수 턴은 바깥 고리(국왕에게서 5–6칸), 짝수 턴은 안쪽 고리(2–3칸) — 그 칸에서 아군 턴을 마친 장수는 MP −3. TURN 2 의식 기사단장이 에릭에게 일기토를 청합니다.',
  council:{terrain:"Crown's Heart · 큰 방(성채 바닥) / 옥좌 단(가운데, 성소) / 네 날개(날개 어귀에 고정석) / 기둥 · 벽 / 남쪽 방(군단) · 북쪽 방 · 동서 통로",intel:'의식 기사단장(TURN 4까지 북쪽 방) · 의식 기사 5(날개마다 하나, 북쪽 방에 하나) · 의식사 2 · 회색 망토 4. TURN 3 북쪽에서 기사 3, TURN 5 동서 통로에서 회색 망토 2, TURN 7 북쪽에서 2.'}},
 22:{zoneArea:[6,4,21,15],par:10,turnLimit:12,captainBox:[10,0,17,3],arriveCols:[12,15],
  enemies:[U241('gc','gc',13,1),U241('k1','k1',12,2),U241('k2','k2',15,2),U241('g1','g1',4,3),U241('g2','g2',23,3),U241('g3','g3',14,3),
   U241('k1','k4',12,3),U241('g1','g8',8,2),U241('g1','g9',19,3),U241('k1','k5',15,1),U241('g1','g10',11,1),U241('g1','g11',20,2)],
  civilians:{hr:[9,7],hp:[18,7],hk:[13,12]},
  allies:{bi1:[12,21],bi2:[13,21],bf1:[14,21],bf2:[15,21],bl1:[12,20],bl2:[15,20],rthea:[13,20],rdario:[14,20],rines:[13,19]},
  waves:[{turn:2,units:[U241('g6','g6',0,9),U241('g7','g7',27,9)]},
   {turn:3,story:'22:betrayer',units:[U241('b1','b1',0,9),U241('b2','b2',27,9),U241('b1','b6',0,10),U241('b1','b7',27,10)]},
   {turn:4,units:[U241('g4','g4',13,0),U241('k3','k3',14,0),U241('g4','g12',12,0)]},
   {turn:5,units:[U241('b3','b3',0,9),U241('a1','a1',27,9),U241('b3','b8',0,10),U241('a1','a2',27,10)]},
   {turn:7,units:[U241('b4','b4',0,9),U241('b5','b5',27,9),U241('g5','g5',13,0)]}],
  deploy:[[13,9],[14,9],[11,10],[16,10],[12,11],[15,11],[10,8],[17,8],[9,9],[18,9],[13,10],[14,10]],
  objective:'세 낭독(기록·계획서·국왕의 말)을 모두 마치기 · TURN 12 안에 (전령 2명이 쓰러지면 패배)',
  brief:'하층가 광장. 전령 셋이 단(서쪽 · 동쪽 · 남쪽) 위에서 TURN 2부터 턴마다 한 번씩, 네 번 읽습니다. TURN 1에는 광장의 사람들이 길을 막아 적이 전령을 노리지 못합니다. 지난 턴 시작 뒤 다친 전령은 그 턴을 읽지 못합니다. 쓰러진 전령의 단에 장수가 서면 대신 읽습니다. 재상부는 북쪽 성문에서, 배신한 깃발은 동서 길에서 옵니다. 신뢰가 「동맹」인 깃발은 TURN 2 남쪽 길로 기사 둘을 보냅니다.',
  council:{terrain:'Lower City Square · 광장(성채 바닥) / 낭독 단 셋(성소) / 골목 · 집 / 북쪽 성문 · 동서 길 · 남쪽 길',intel:'재상부 근위대장(TURN 5까지 북쪽 성문) · 의식 기사 4 · 회색 망토 7. TURN 2 동서 길에서 회색 망토 2, TURN 3 배신한 깃발 4, TURN 4 북쪽 성문에서 3, TURN 5 동서 4, TURN 7 3.'}}
};
// Applied after applyV240; the same shape as the M15–M18 maps.
export function applyV241(MISSIONS){
 for(const [k,d] of Object.entries(V241_MISSIONS)){const id=+k,m=MISSIONS[id],rows=ROWS2410[id];
  const pool=[...(m.enemies||[]),...(m.waves||[]).flatMap(w=>w.units||[])],copy=([t,nid,x,y,o])=>{const src=pool.find(u=>u.id===t);if(!src)throw Error(`M${id}: no unit ${t}`);return {...structuredClone(src),id:nid,x,y,...structuredClone(o||{})};};
  m.map=g2410(rows);m.width=rows[0].length;m.height=rows.length;
  m.layers={terrain:m.map,collision:m.map.map(r=>r.map(t=>['x','w'].includes(t))),buildings:[],objects:[],actors:'units',effects:'feedback',events:'narrative'};
  for(const key of ['par','turnLimit','objective','brief','captainBox','arriveCols','fires'])if(d[key]!==undefined)m[key]=structuredClone(d[key]);
  m.council=d.council; // terrain and intel lines; the plan stays the briefing's
  const enemies=d.enemies.map(copy),waves=d.waves.map(w=>({...w,units:w.units.map(copy)}));m.enemies=enemies;m.waves=waves;
  m.reinforcements=[];m.v241=true;
  if(d.objects)m.objects=d.objects.map(([oid,name,kind,x,y,extra])=>({id:oid,name,kind,x,y,...(extra||{})}));
  // allies and civilians: the mission's own, moved; a new id copies the first of its list (M20's seventh and eighth residents)
  for(const key of ['allies','civilians']){const place=d[key];if(!place)continue;const list=m[key]||[];
   m[key]=Object.entries(place).map(([cid,[x,y]])=>{const src=list.find(u=>u.id===cid)||list[0];const u={...structuredClone(src),id:cid,x,y};if(u.post)u.post={x,y};return u;});}
  const taken=[...(m.civilians||[]),...(m.allies||[]),...(m.objects||[])].map(c=>[c.x,c.y]),spots=d.deploy.filter(([x,y])=>open2410(rows,x,y)&&!taken.some(([a,b])=>a===x&&b===y));
  const [zx0,zy0,zx1,zy1]=d.zoneArea,inZone=area2410(rows,zx0,zy0,zx1,zy1,taken);
  m.deployZone=()=>new Set(inZone.map(([x,y])=>`${x},${y}`));
  m.deployments={recommended:spots.slice(0,8),assault:spots.slice(0,8),defense:spots.slice(-8)};}
 return MISSIONS;}
