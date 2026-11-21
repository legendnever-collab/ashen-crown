// v2.4.0 ACT III 큰 맵 1부 (D-135, docs/v2.4.0/ACT3_MAPS_DESIGN.md §2): M15–M18 on big maps. Objectives, special rules,
// story and duel pairs are unchanged; terrain, entry direction, size and the enemy line-up change, and three missions get
// more of their objects (M16 결계석 3 → 4, M17 수호 석상 4 → 6, M18 숲지기 6 → 8; the counts needed stay). Numbers PROPOSED,
// tuned by act2-balance. Maps drawn by scripts/make-act3-maps.py. M15: in over the canal bridges from the south; the clerks
// scatter from the chancellery annex to the north-west, west and east gates. M16: west → east through the fog, from the
// grave hill to the old camp. M17: the keep at the north (archive at the top), the chancellery up from the south gate and
// through the west and east breaches. M18: the ward in the middle of the forest, the loggers in from all four edges.
// The troops are the missions' own (same numbers), copied by id, with new ones beside them.
export const ROWS2400={
 15:["xrrxxxxxxxxxxxxxxxxxxxxxxxxx","xrrrrrrrrrrrrrrrrrrrrrrrrrrx","xrrrrrrrrrrrrrrrrrrrrrrrrrrx","xooorrlooooolrrlooooolrrooox","xxxxrrlxooxxxkkxxxxxxlrrxxxx","xxxxrrlxookkkkkkkxooxlrrxxxx","xxxxrrlxxxxkkkkkkkooxlrrxxxx","xlllrrllllxxxkkxxxllllrrlllx","rrrrrrrrrrrrrrrrrrrrrrrrrrrr","rrrrrrrrrrrrrrrrrrrrrrrrrrrr","xooorrlooooolrrlooooolrrooox","xxxxrrlxxxxxlrrlxxxxxlrrxxxx","xxxxrrlxxxxxlrrlxxxxxlrrxxxx","xrrrrrrrrrrrrrrrrrrrrrrrrrrx","xwwwbwwwwwwwwbbwwwwwwwwbwwwx","xwwwbwwwwwwwwbbwwwwwwwwbwwwx","xrrrrrrrrrrrrrrrrrrrrrrrrrrx","xlvvvllvvvllrrrrllvvvllvvvlx","xlvvvllvvvllrrrrllvvvllvvvlx","xlllllllllllrrrrlllllllllllx"],
 16:["mmmmmmmmmmmmmmwwmmmmmmmmmmmmmm","mmmmggfffgggggwwgxgggggggfffgx","mmmmggfffxggggwwgxgggggggfffgx","gggggvgggxggffwwgxggrggggggggx","gggggvgggxggffwwgxggrggxgggggx","gvvggggggxggggwwggggrggxgttttx","gvvgggggggggggwwggggrggxgtkktx","rrrrrrrrrrrrrrbbrrrrrrrrrrkktx","rrrrrrrrrrrrrrbbrrrrrrrrrrkktx","ggggggggrgggggwwgggggggggtkktx","gvvgggggrgggggwwggggggggxtkktx","gvvgggggrgxgggwwgxggggggxttttx","gggffgggrgxgggwwgxggggggxggggx","gggffgvgrgxgggbbgxffffggxggggx","ggggggvgggxfffwwgxffffggggfffx","mmmggggggggfffwwgxffffggggfffx","mmmggggggggfffwwgggggggggggggx","mmmmmmmmmmmmmmwwmmmmmmmmmmmmmm"],
 17:["xxxxxxxxxxxxxxxxxxxxxxxxxx","xkkkkkkkkxkkkkkkxkkkkkkkkx","xxxxxxxxxxxkkkkxxxxxxxxxxx","xkkkkkkkkkkkkkkkkkkkkkkkkx","xkkkkkkkkkkkkkkkkkkkkkkkkx","xkkkkkkkkkkkkkkkkkkkkkkkkx","xxxxkxxxxkkkkkkkkxxxxkxxxx","xkkkkkkkkkkkkkkkkkkkkkkkkx","xkkkkkkkkkkkkkkkkkkkkkkkkx","xqqqkkkkkkkkkkkkkkkkkkqqqx","mxxqxxxxxxxkkkkxxxxxxxqxxm","mggggggffgggrrgggffggggggm","gggggggffgggrrgggffggggggg","ggggggggggggrrgggggggggggg","mgggrrrrrrrrrrrrrrrrrrgggm","mgggggggggggrrgggggggggggm","mgfffgxxggggrrggggxxgfffgm","mgfffgxxggggrrggggxxgfffgm","mgfffggggffgrrgffggggfffgm","mggggggggffgrrgffggggggggm","mggggggggffgrrgffggggggggm","mmmmmmmmmmmgrrgmmmmmmmmmmm"],
 18:["mmffffffffffrrffffffffffmm","mmffffffgggfrrffffffffffmm","ffffffffgggfrrffmmffffffff","fffggggfffffrrffmmfggggfff","fffvgggfffffrrfffffgggvfff","fffggggfffffrrfffffggggfff","ffffffffffffrrffffffffffff","ffffggfffgggrrgggfffggffff","fggfggfffggggggggfffggffff","fggffffffggggggggfffffffff","rrrrrrrrrrggggggrrrrrrrrrr","rrrrrrrrrrggggggrrrrrrrrrr","fffffffffggggggggffffffggf","ffffggfffggggggggfffggfggf","ffffggfffgggrrgggfffggffff","ffffffffffffrrffffffffffff","fffggggfffffrrfffffggggfff","fffgvggfffffrrfffffggvgfff","fffggggmmfffrrfffffggggfff","fffffffmmfffrrfgggffffffff","mmffffffffffrrfgggffffffmm","mmffffffffffrrffffffffffmm"]
};
export const ACT3_COUNTS={stones16:4,statues17:6,keepers18:8,cabinets20:4,residents20:8}; // v2.4.1: M20's cabinets and residents too
const g2400=rows=>rows.map(r=>r.split(''));
const open2400=(rows,x,y)=>!!rows[y]&&!'xw'.includes(rows[y][x]??'x');
const area2400=(rows,x0,y0,x1,y1,skip=[])=>{const out=[];for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(open2400(rows,x,y)&&!skip.some(([a,b])=>a===x&&b===y))out.push([x,y]);return out;};
// [template id, new id, x, y, extra]: a copy of the mission's own unit (from its enemies or waves) at a new place
const U240=(t,id,x,y,o)=>[t,id,x,y,o];
// M16: the recruits who come back are named in the intel, as on the small map
const back16=s=>{const back=s.missionState?.returning||[];return back.length?` TURN 2 북쪽 언덕에서 ${back.map(id=>({thea:'테아',dario:'다리오',ines:'이네스'})[id]).join('·')} 등장(동맹군).`:'';};
export const V240_MISSIONS={
 15:{zoneArea:[1,16,26,19],par:11,turnLimit:14,
  enemies:[U240('c1','c1',12,5,{exit:[1,0]}),U240('c2','c2',11,6,{exit:[0,8]}),U240('c3','c3',16,5,{exit:[27,8]}),U240('cap','cap',14,5),
   U240('g1','g1',6,8),U240('g2','g2',20,9),U240('g3','g3',13,10),U240('g4','g4',5,2),U240('g5','g5',22,2),U240('a1','a1',8,4),U240('a2','a2',18,5),
   U240('g1','g10',3,8),U240('g1','g11',24,9),U240('g1','g12',9,1),U240('g1','g13',18,1),U240('a1','a3',12,3)],
  civilians:{archivist:[13,18],w1:[5,10],w2:[14,11],w3:[22,10]},
  waves:[{turn:3,story:'15:cloaks',units:[U240('g6','g6',1,16),U240('g7','g7',26,16),U240('g6','g14',26,19)]},
   {turn:5,units:[U240('g8','g8',1,19),U240('g9','g9',26,13),U240('a1','a4',1,13)]}],
  deploy:[[13,17],[14,17],[12,16],[15,16],[11,16],[16,16],[13,16],[14,16],[10,17],[17,17],[12,19],[15,19]],
  objective:'서기 세 명의 행방을 모두 정하고 상자 2개 이상 확보 · 기록관 생존 · 상자 2개가 성문 밖으로 나가면 패배 · TURN 14 안에',
  brief:'남쪽 다리 셋으로 운하를 건너 상층가로 들어갑니다. 재상부 별관(가운데)의 서기 셋이 곧바로 각자 성문 — 북서 모퉁이 · 서쪽 끝 · 동쪽 끝 — 으로 달아납니다(턴마다 2칸). 서기를 쓰러뜨리면 상자를 확보합니다. 회색 망토가 길과 지붕을 막고, TURN 3부터 운하 남쪽으로 돌아 기록관을 노립니다. 왕도 경비대(중립, 거리 셋) 곁 2칸 안에서 싸우면 한 번 경고하고, 두 번째에는 경비대가 적이 됩니다.',
  council:{terrain:'Upper City · 거리(길) / 골목(이동 1, 회피 +5) / 지붕(이동 2, 높은 곳) / 집(벽) / 운하(물) · 다리 셋 / 재상부 별관(성채 바닥)',intel:'재상부 서기 3(북서 · 서 · 동 성문으로 달아남) · 회색 망토 대장 · 회색 망토 12(궁수 3). TURN 3 운하 남쪽 양 끝에서 3, TURN 5 3. 왕도 경비대 3은 중립.'}},
 16:{zoneArea:[1,3,7,14],par:12,turnLimit:16,
  enemies:[U240('h1','h1',21,2,{stone:'st3'}),U240('h2','h2',22,14,{stone:'st4'}),U240('cap','cap',26,7),
   U240('s1','s1',10,6),U240('s2','s2',12,9),U240('s3','s3',18,5),U240('s4','s4',17,9),U240('s5','s5',21,10),U240('a1','a1',19,2),U240('a2','a2',16,12),
   U240('s1','s9',24,8),U240('s1','s10',25,9),U240('s1','s11',27,5),U240('s1','s12',20,15),U240('s1','s13',11,12),U240('a1','a4',25,3),U240('a1','a5',26,12)],
  objects:[['st1','결계석','wardStone',5,9],['st2','결계석','wardStone',11,4],['st3','결계석','wardStone',21,3],['st4','결계석','wardStone',22,13]],
  allies:{rthea:[3,3],rdario:[4,3],rines:[4,4]},
  waves:[{turn:4,story:'16:reinforce',units:[U240('s6','s6',28,1),U240('s7','s7',28,16),U240('s6','s14',16,16),U240('s6','s15',16,1)]},
   {turn:6,units:[U240('s8','s8',0,4),U240('a3','a3',0,12),U240('s8','s16',0,13),U240('a3','a6',28,3)]}],
  deploy:[[4,7],[4,8],[3,7],[3,8],[5,7],[5,8],[2,7],[2,8],[4,9],[3,9],[6,8],[6,7]],
  objective:'기억 수확자 2명 격파 · TURN 16 안에 (돌아온 동료가 쓰러져도 패배는 아님)',
  brief:'서쪽 무덤 언덕에서 동쪽 옛 진지까지 안개 속을 갑니다. 안개: 활과 마법의 사거리 −1, 3칸 밖의 적은 정체가 보이지 않습니다. 결계석(4)은 길을 따라 흩어져 있고, 조사하면 그 주위 2칸의 안개가 걷힙니다. 기억 수확자 둘은 동쪽 끝 북쪽과 남쪽의 결계석 곁에 있습니다. 수확자가 조사하지 않은 결계석 곁에 있으면 턴마다 그 돌 3칸 안 장수의 MP가 3 줄어듭니다. 개울을 건너는 곳은 길의 여울과 남쪽 여울 둘입니다. TURN 3 기사대장이 에릭에게 일기토를 청합니다.',
  council:{terrain:'Forgotten Battlefield · 옛 군용로(길) / 평지 / 참호(벽) / 숲(이동 2) / 개울(물) · 여울 둘 / 옛 진지(요새) / 무덤 언덕',intel:s=>'기억 수확자 2(동쪽 끝 북 · 남 결계석 곁) · 배신한 깃발의 기사대장(옛 진지) · 약탈대 14(궁수 4). TURN 4 동쪽 끝과 개울가에서 4, TURN 6 서쪽 뒤와 동쪽에서 4. 안개: 3칸 밖은 정체를 모름.'+back16(s)}},
 17:{zoneArea:[1,3,24,9],par:10,turnLimit:10,rearY:17,archive:[[12,1],[13,1]],
  enemies:[U240('gcap','gcap',12,19),U240('g1','g1',6,18),U240('g2','g2',19,18),U240('g3','g3',10,16),U240('g4','g4',3,15),U240('g5','g5',22,15),U240('c1','c1',11,20),U240('c2','c2',14,20),
   U240('g1','g11',9,15),U240('g1','g12',16,15),U240('c1','c4',13,18)],
  objects:[['st1','잠든 수호 석상','statue',6,4,{prop:true}],['st2','잠든 수호 석상','statue',19,4,{prop:true}],['st3','잠든 수호 석상','statue',6,8,{prop:true}],
   ['st4','잠든 수호 석상','statue',19,8,{prop:true}],['st5','잠든 수호 석상','statue',7,13,{prop:true}],['st6','잠든 수호 석상','statue',18,13,{prop:true}]],
  waves:[{turn:3,story:'17:reinforce',units:[U240('g6','g6',0,12),U240('g7','g7',25,12),U240('g6','g15',0,13)]},
   {turn:5,units:[U240('g8','g8',12,21),U240('c3','c3',13,21),U240('g8','g17',0,12)]},
   {turn:7,units:[U240('g9','g9',11,21),U240('g10','g10',14,21),U240('g9','g18',0,13)]}],
  deploy:[[12,7],[13,7],[11,8],[14,8],[12,9],[13,9],[10,7],[15,7],[11,4],[14,4],[12,3],[13,3]],
  objective:'TURN 10이 끝날 때까지 서고를 지키거나 재상부 대장 격파 (적이 서고 칸을 두 턴 연속 점거하면 패배)',
  brief:'수호자 성채는 북쪽에 있고, 「맹세의 서」가 있는 서고(2칸)는 맨 안쪽 꼭대기입니다. 재상부는 남쪽 문으로 바깥 마당을 지나 올라오고, TURN 3부터 동서 성벽 틈으로도 들어옵니다. 잠든 수호 석상(6) — 안뜰 넷, 바깥 마당 둘 — 곁에서 「맹세」하면 그 석상이 군단 편에서 싸웁니다. 적이 먼저 석상 곁에 남아 있으면 턴이 시작될 때 석상이 재상부 편으로 깨어납니다. 서고 칸에 적이 두 적 턴 연속 서 있으면 「맹세의 서」를 빼앗깁니다.',
  council:{terrain:'Guardians\' Keep · 성채 바닥 / 서고(맨 위, 성소) / 성벽 위(방어) / 바깥 마당(평지) / 숲 / 무너진 탑(벽) / 동서 성벽 틈',intel:'재상부 대장(TURN 6까지 남쪽 뒤에) · 회색 망토 7 · 석궁수 3. TURN 3 동서 성벽 틈에서 3, TURN 5 남쪽 문과 서쪽 틈에서 3, TURN 7 3.'}},
 18:{zoneArea:[9,7,16,14],par:10,turnLimit:12,rearY:18,ward:[9,7,16,14],
  enemies:[U240('l1','l1',12,1),U240('l2','l2',1,10),U240('l3','l3',24,11),U240('l4','l4',13,20),U240('a1','a1',8,1),U240('a2','a2',17,19)],
  allies:{tr1:[10,8],tr2:[15,8],tr3:[12,13]},
  civilians:{f1:[4,4],f2:[21,4],f3:[5,17],f4:[20,17],f5:[2,8],f6:[23,13],f7:[9,1],f8:[16,19]},
  waves:[{turn:3,story:'18:reinforce',units:[U240('l5','l5',0,10),U240('l6','l6',25,10)]},
   {turn:4,story:'18:captain',units:[U240('lcap','lcap',12,21)]},
   {turn:5,units:[U240('l7','l7',0,11),U240('a3','a3',25,11)]},
   {turn:7,units:[U240('l8','l8',12,0),U240('l9','l9',13,0),U240('l8','l18',0,18),U240('l8','l19',25,3)]}],
  deploy:[[12,10],[13,10],[12,11],[13,11],[11,9],[14,9],[11,12],[14,12],[10,10],[15,11],[10,12],[15,12]],
  objective:'결계 고목 2그루 이상 지키며 TURN 12까지 버티거나 벌목대장 격파 (고목 2그루가 쓰러지면 패배)',
  brief:'비: 화염 피해 −50%, 불이 번지지 않습니다. 결계(숲 한가운데 빈터) 안에서는 화염이 통하지 않고 회복이 50% 강해집니다. 결계 고목 셋이 빈터에 삼각형으로 서 있고, 벌목대는 네 가장자리의 숲길로 들어와 고목을 노립니다. 숲 가장자리 곳곳의 숲지기(8) 곁에서 「구출」하면 결계 안으로 이끕니다. TURN 4 남쪽 숲길로 벌목대장이 옵니다.',
  council:{terrain:'Unburning Forest · 결계 빈터(가운데, 화염 무효 · 회복 +50%) / 숲(이동 2) / 숲길(길, 십자) / 빈터 / 숲지기 오두막',intel:'벌목대 4 · 횃불병 2가 네 가장자리 숲길에. TURN 3 동서 숲길에서 2, TURN 4 남쪽에 벌목대장, TURN 5 동서 2, TURN 7 남북과 양옆에서 4. 횃불병은 TURN 3부터 숲지기를 노립니다.'}}
};
// Applied after applyV231; the same shape as the ACT II maps.
export function applyV240(MISSIONS){
 for(const [k,d] of Object.entries(V240_MISSIONS)){const id=+k,m=MISSIONS[id],rows=ROWS2400[id];
  const pool=[...(m.enemies||[]),...(m.waves||[]).flatMap(w=>w.units||[])],copy=([t,nid,x,y,o])=>{const src=pool.find(u=>u.id===t);if(!src)throw Error(`M${id}: no unit ${t}`);return {...structuredClone(src),id:nid,x,y,...structuredClone(o||{})};};
  m.map=g2400(rows);m.width=rows[0].length;m.height=rows.length;
  m.layers={terrain:m.map,collision:m.map.map(r=>r.map(t=>['x','w'].includes(t))),buildings:[],objects:[],actors:'units',effects:'feedback',events:'narrative'};
  for(const key of ['par','turnLimit','objective','brief','rearY','archive','ward'])if(d[key]!==undefined)m[key]=structuredClone(d[key]);
  m.council=d.council; // terrain and intel lines (M16's intel is a function of the returning recruits); the plan stays the briefing's
  const enemies=d.enemies.map(copy),waves=d.waves.map(w=>({...w,units:w.units.map(copy)}));m.enemies=enemies;m.waves=waves;
  m.reinforcements=[];m.v240=true;
  if(d.objects)m.objects=d.objects.map(([oid,name,kind,x,y,extra])=>({id:oid,name,kind,x,y,...(extra||{})}));
  // allies and civilians: the mission's own, moved; a new id copies the first of its kind (M18's seventh and eighth keepers)
  for(const key of ['allies','civilians']){const place=d[key];if(!place)continue;const list=m[key]||[];
   m[key]=Object.entries(place).map(([cid,[x,y]])=>{const src=list.find(u=>u.id===cid)||list[0];const u={...structuredClone(src),id:cid,x,y};if(u.post)u.post={x,y};return u;});}
  if(d.allies&&!Object.keys(d.allies).every(a=>m.allies.some(u=>u.id===a)))throw Error(`M${id}: allies`);
  const taken=[...(m.civilians||[]),...(m.allies||[]),...(m.objects||[])].map(c=>[c.x,c.y]),spots=d.deploy.filter(([x,y])=>open2400(rows,x,y)&&!taken.some(([a,b])=>a===x&&b===y));
  const [zx0,zy0,zx1,zy1]=d.zoneArea,inZone=area2400(rows,zx0,zy0,zx1,zy1,taken);
  m.deployZone=()=>new Set(inZone.map(([x,y])=>`${x},${y}`));
  m.deployments={recommended:spots.slice(0,8),assault:spots.slice(0,8),defense:spots.slice(-8)};}
 return MISSIONS;}
