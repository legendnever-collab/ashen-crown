// v2.5.1 ACT IV 큰 맵 2부 (D-141, docs/v2.5.0/ACT4_MAPS_DESIGN.md §2): M27–M30 on big maps, the same way as M23–M26
// (src/data/missions-v250.js). Objectives, special rules, story, allied squads, the duel, Aren's last words and the ending are
// unchanged; terrain, entry direction, size and the line-up change. Maps drawn by scripts/make-act4-maps.py.
// M27: two fronts below the wall — the straight ram road up the west to the gate, the three ladders over the east field, a
// ridge between them (m.wallTopY: the rampart row; m.sectionNames). M28: the palace of memory — the great hall, the three
// fragments in the west, east and north wings. M29: the heart chamber — Bellard's dais in the middle, the rite points on the
// ring by the M22 path, four doors (m.captainBox holds Bellard on the dais in his first phase). M30: the dawn courtyard — the
// ward heart in the south middle, five breaches in the broken wall.
export const ROWS2510={
 27:["klllkkkkkkkklllkkkkkkklllkkkkkkk","kkkkklllkkkkkkkklllkkkkkkkklllkk","kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk","kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk","qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq","xxxxxxxxkkxxxxxxxxxxqxxxqxxxqxxx","ggggggggrrgggggggggggggggggggggg","ggggggggrrgggggggffggggggggggggg","gffgggggrrgggggggffgggggggggggff","gffgggggrrgggmgmggggggggggggggff","gggxggggrrgggmmmggggggggggxgggff","ggggggggrrggxmmmgggggggggggggggg","ggggggggrrgggmmmgggggffggggggggg","ggggffggrrgggmmmgggggffggggggggg","ggggffggrrgggmgmgggggggggggffggg","ggggggggrrgggggggggggggggggffggg","ggggggggrrgfgggggggxgggggggggggg","ggggggggrrgfgggggggggggggggggggg","ggggggggrrggggggffgggggggggggggg","ffggggggrrggggggffggggggggggggff","ffggggggrrggggggggggggggggggggff","ffggggggrrggggggggggggggggggggff"],
 28:["xxxxxxxxxxxxxxxxxxxxxxxxxx","xxxxxxxxxkkkkkkkkxxxxxxxxx","xxxxxxxxxkkkkkkkkxxxxxxxxx","xxxxxxxxxkxkkkkxkxxxxxxxxx","xxxxxxxxxkkkkkkkkxxxxxxxxx","xxxxxxxxxkkkkkkkkxxxxxxxxx","xkkkkkkkxkkkkkkkkxkkkkkkkx","xkkxkkkkxkkkkkkkkxkkxkkkkx","xkkkkkkkxxxkkkkxxxkkkkkkkx","xkkkkkkkxkkkkkkkkxkkkkkkkx","xkkkkkkkxkxkkkkxkxkkkkkkkx","xkkkxkkkkkkkkkkkkkkkkxkkkx","xkkkkkkkkkkkkkkkkkkkkkkkkx","xkkkkkkkkkkkkkkkkkkkkkkkkx","xkkkkxkkxkkkkkkkkxkkkkxkkx","xkkkkkkkxkkkkkkkkxkkkkkkkx","xkkkkkkkxkxkkkkxkxkkkkkkkx","xxxxxxxxxkkkkkkkkxxxxxxxxx","xxxxxxxxxxxkrrkxxxxxxxxxxx","xxxxxxxxxxxkrrkxxxxxxxxxxx","xxxxxxxxxxxkrrkxxxxxxxxxxx","xxxxxxxxxxxkrrkxxxxxxxxxxx"],
 29:["xxxxxxxxxxxxkkxxxxxxxxxxxx","xxkkkkkkkkkkkkkkkkkkkkkkxx","xkkkkkkkkkkkkkkkkkkkkkkkkx","xkkkkkkkkkkkkkkkkkkkkkkkkx","xkkkkkkkkxkkkkkkxkkkkkkkkx","xkkkkxkkkkkkkkkkkkkkxkkkkx","xkkkkkkkkkkkkkkkkkkkkkkkkx","xkkkkkkkkkkkzzkkkkkkkkkkkx","xkkkkkkkkkkzzzzkkkkkkkkkkx","xkkkkkkxkkkzzzzkkkxkkkkkkx","xkkkkkkkkkkkzzkkkkkkkkkkkx","xkkkkkkkkkkkkkkkkkkkkkkkkx","xkkkkkkkkkkkkkkkkkkkkkkkkx","xkkkkkkkkkkkkkkkkkkkkkkkkx","xkkkkkkkkkkkkkkkkkkkkkkkkx","kkkkkkkxkkkkkkkkkkxkkkkkkk","kkkkkkkkkkkkkkkkkkkkkkkkkk","xkkkkkkkkkkkkkkkkkkkkkkkkx","xkkkkkkkkkkkkkkkkkkkkkkkkx","xkkkkxkkkkkkkkkkkkkkxkkkkx","xkkkkkkkkkkkkkkkkkkkkkkkkx","xkkkkkkkkkkkkkkkkkkkkkkkkx","xkkkkkkkkkkkkkkkkkkkkkkkkx","xxxxxxxxxxxxkkxxxxxxxxxxxx"],
 30:["ffggggggggggggrrggggggggggggff","ffggggggggggggrrggggggggggggff","ggggggggxgggggrrgggggxgggggggg","ggggggggggggggrrgggggggggggggg","gggggxggggggggrrggggggggxggggg","ggggggggggggggrrgggggggggggggg","xxxggxxxxggxxxggxxxggxxxxggxxx","kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk","kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk","kkkkkkxkkkkkkkkkkkkkkkkxkkkkkk","kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk","kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk","kkkkkkkkkkxkkkkkkkkxkkkkkkkkkk","kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk","kkkxkkkkkkkkkkkkkkkkkkkkkkxkkk","kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk","kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk","xxxxxxxxxkkkkkkkkkkkkxxxxxxxxx"]
};
const g2510=rows=>rows.map(r=>r.split(''));
const open2510=(rows,x,y)=>!!rows[y]&&!'xw'.includes(rows[y][x]??'x');
const area2510=(rows,x0,y0,x1,y1,skip=[])=>{const out=[];for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(open2510(rows,x,y)&&!skip.some(([a,b])=>a===x&&b===y))out.push([x,y]);return out;};
// [template id, new id, x, y]: a copy of the mission's own unit (from its enemies or waves) at a new place
const U251=(t,id,x,y,o)=>[t,id,x,y,o];
export const V251_MISSIONS={
 27:{zoneArea:[2,16,29,20],wallTopY:4,gate27:[[8,5],[9,5]],ramRow:6,sections:[[20,4],[24,4],[28,4]],ladders:[[20,5],[24,5],[28,5]],sectionNames:['서쪽 사다리 성벽','가운데 망루','동쪽 사다리 성벽'],
  enemies:[U251('s1','s1',20,4),U251('s2','s2',24,4),U251('s3','s3',28,4),U251('a1','a1',6,4),U251('a2','a2',11,4),U251('a3','a3',22,4),U251('a4','a4',26,4),U251('k1','k1',8,3),U251('k2','k2',9,3),
   U251('a1','a6',16,4),U251('a4','a7',30,4),U251('k1','k6',12,3),U251('s1','s7',4,4)], // the cap (13+15)
  objects:[['gl1','성문','gateLeaf',8,5],['gl2','성문','gateLeaf',9,5]],
  civilians:{ram:[8,17]},
  allies:{ib1:[6,18],ib2:[7,19],fb1:[24,18],fb2:[25,19],lb1:[11,19],lb2:[18,19],bk:[10,20],bc1:[4,18],bc2:[27,18]},
  waves:[{turn:3,story:'27:sally',units:[U251('k3','k3',7,2),U251('k4','k4',10,2),U251('s4','s4',22,2),U251('k3','k8',13,2)]},
   {turn:5,story:'27:flank',units:[U251('g1','g1',0,13),U251('g2','g2',31,13),U251('g1','g5',0,16)]},
   {turn:7,units:[U251('s5','s5',19,2),U251('s6','s6',29,2),U251('a5','a5',12,2),U251('s5','s8',25,2)]},
   {turn:9,units:[U251('k5','k5',8,2),U251('g3','g3',0,20),U251('g4','g4',31,20),U251('g3','g6',14,21)]}],
  deploy:[[7,17],[10,17],[7,16],[10,16],[20,17],[24,17],[22,17],[26,17],[6,17],[11,17],[21,18],[23,18]],
  council:{terrain:'The Royal Gate · 서쪽 공성추 길(곧은 두 줄 길, 성문까지) / 동쪽 들판과 사다리 셋 / 두 전선 사이 능선 / 성벽 위 성루 · 성벽 너머 왕도',intel:'성벽 위 창병 4(사다리 위 셋 · 서쪽 하나) · 궁수 6 · 성문 안 의식 기사 3. TURN 3 성문 안 기사 3 · 성벽 창병 1, TURN 5 양옆 망토 3, TURN 7 성벽 창병 3 · 궁수 1, TURN 9 성문 안 기사 1 · 남쪽 망토 3.'}},
 28:{zoneArea:[10,13,15,17],
  enemies:[U251('r1','r1',3,8),U251('r2','r2',6,11),U251('r7','r7',2,10),U251('r3','r3',22,8),U251('r4','r4',19,11),U251('r8','r8',23,10),U251('r5','r5',11,2),U251('r6','r6',14,3),U251('r9','r9',8,12),U251('r10','r10',17,12),
   U251('r1','r01',2,7),U251('r3','r02',23,7),U251('r5','r03',13,2)], // the cap (13+6); extra posted remnants are r01–r03 (the waves, r11 and up, roam)
  objects:[['mem1','맹세의 기억','memory',4,10],['mem2','왕의 기억','memory',21,10],['mem3','명령의 기억','memory',12,3]],
  allies:{aren:[12,15]},
  waves:[{turn:4,story:'28:echo',units:[U251('r11','r11',1,14),U251('r12','r12',24,14),U251('r11','r15',12,1)]},
   {turn:8,units:[U251('r13','r13',1,16),U251('r14','r14',24,16),U251('r13','r16',13,1)]}],
  deploy:[[11,14],[13,14],[10,15],[14,15],[11,16],[13,16],[10,14],[14,14],[12,16],[12,14]],
  council:{terrain:'Memory Palace · 가운데 큰 방(군단 · 젊은 아렌) / 서쪽 날개(맹세) · 동쪽 날개(왕) · 북쪽 날개(명령) / 남쪽 밤의 문',intel:'잔영 13(서 · 동 날개 넷씩, 북쪽 날개 셋, 큰 방 양옆 둘) — 쓰러지면 3턴 뒤 제자리에서 다시 섬. TURN 4 · 8 서 · 동 날개 끝과 북쪽 날개에서 잔영 3씩.'}},
 29:{zoneArea:[9,17,16,20],captainBox:[9,0,16,11],rites29:{king:[[10,13],[15,13],[13,15]],council:[[6,12],[19,12],[13,16]],oath:[[8,14],[13,14],[17,14]]},
  enemies:[U251('boss','boss',12,8),U251('k1','k1',7,8),U251('k2','k2',18,8),U251('k3','k3',8,11),U251('k4','k4',17,11),U251('r1','r1',9,10),U251('r2','r2',16,10),U251('r3','r3',13,7),U251('g1','g1',6,14),U251('g2','g2',19,14),
   U251('k1','k8',10,5),U251('k2','k9',15,5),U251('g1','g5',3,12)], // the cap (13+8)
  civilians:{rp1:[10,13],rp2:[15,13],rp3:[13,15]},
  allies:{ib1:[6,18],ib2:[7,19],fb1:[19,18],fb2:[18,19],lb1:[10,19],lb2:[15,19],bk:[13,20]},
  waves:[{turn:3,story:'29:reinforce',units:[U251('k5','k5',12,0),U251('k6','k6',13,0)]},
   {turn:5,units:[U251('g3','g3',0,15),U251('g4','g4',25,15),U251('g3','g6',0,16)]},
   {turn:7,story:'29:last',units:[U251('r4','r4',12,0),U251('k7','k7',13,0),U251('k7','k10',13,1)]}],
  deploy:[[12,17],[14,17],[9,17],[16,17],[11,17],[15,17],[8,17],[17,17],[13,17],[10,17]],
  council:{terrain:'Heart Chamber · 가운데 벨라드의 단(성역) / 단을 둘러싼 고리의 의식 지점 셋(M22의 길마다 자리가 다름) / 바깥 벽의 문 넷(북 · 서 · 동 · 남)',intel:'벨라드(1단계는 단 위) · 의식 기사 6 · 의식사 3 · 회색 망토 3. TURN 3 북쪽 문 기사 2, TURN 5 서 · 동 문 망토 3, TURN 7 북쪽 문 의식사 1 · 기사 2.'}},
 30:{zoneArea:[9,9,20,12],
  enemies:[U251('b1','b1',3,1),U251('b2','b2',10,0),U251('b3','b3',19,0),U251('b4','b4',26,1),U251('b5','b5',7,3),U251('b6','b6',22,3),
   U251('b1','b17',12,2),U251('b4','b18',17,2),U251('b5','b19',0,3)], // the cap (9+20)
  civilians:{heart:[14,14]},
  allies:{ib1:[6,11],ib2:[7,12],fb1:[23,11],fb2:[22,12],lb1:[12,14],lb2:[16,14],bk:[14,15]},
  waves:[{turn:2,units:[U251('b7','b7',0,2),U251('b8','b8',29,2),U251('b9','b9',14,0),U251('b10','b10',15,0),U251('b7','b20',5,0),U251('b8','b21',24,0)]},
   {turn:4,story:'30:tide',units:[U251('a1','a1',5,0),U251('a2','a2',24,0),U251('b11','b11',0,5),U251('b12','b12',29,5),U251('b13','b13',12,0),U251('b14','b14',17,0),U251('b11','b22',8,0),U251('b12','b23',21,0)]},
   {turn:6,story:'30:last',units:[U251('b15','b15',2,0),U251('b16','b16',27,0),U251('a3','a3',14,0),U251('a4','a4',15,0),U251('b15','b24',10,0),U251('b16','b25',19,0)]}],
  deploy:[[13,10],[16,10],[11,10],[18,10],[14,11],[15,11],[10,11],[19,11],[12,9],[17,9]],
  council:{terrain:'The Crownless Dawn · 남쪽 가운데 결계의 심장 / 무너진 성벽(틈 다섯) / 북쪽 잿빛 들판 · 가장자리 전체에서 재의 물결',intel:'재의 짐승 9(들판). TURN 2 짐승 6, TURN 4 짐승 6 · 재의 기사 2, TURN 6 짐승 4 · 재의 기사 2 — 모두 결계의 심장을 노림.'}}
};
// Applied after applyV250; the same shape as the ACT III and M23–M26 maps.
export function applyV251(MISSIONS){
 for(const [k,d] of Object.entries(V251_MISSIONS)){const id=+k,m=MISSIONS[id],rows=ROWS2510[id];
  const pool=[...(m.enemies||[]),...(m.waves||[]).flatMap(w=>w.units||[])],copy=([t,nid,x,y,o])=>{const src=pool.find(u=>u.id===t);if(!src)throw Error(`M${id}: no unit ${t}`);const u={...structuredClone(src),id:nid,x,y,...structuredClone(o||{})};if(u.post)u.post={x,y};return u;}; // a post (M28's remnants) moves with the unit
  m.map=g2510(rows);m.width=rows[0].length;m.height=rows.length;
  m.layers={terrain:m.map,collision:m.map.map(r=>r.map(t=>['x','w'].includes(t))),buildings:[],objects:[],actors:'units',effects:'feedback',events:'narrative'};
  for(const key of ['par','turnLimit','objective','brief','captainBox','wallTopY','gate27','ramRow','sections','ladders','sectionNames','rites29'])if(d[key]!==undefined)m[key]=structuredClone(d[key]);
  m.council=d.council; // terrain and intel lines; the plan stays the briefing's
  m.enemies=d.enemies.map(copy);m.waves=d.waves.map(w=>({...w,units:w.units.map(copy)}));m.reinforcements=[];m.v251=true;
  if(d.objects){const list=m.objects||[];m.objects=d.objects.map(([oid,name,kind,x,y])=>{const src=list.find(o=>o.id===oid);if(!src)throw Error(`M${id}: no object ${oid}`);return {...structuredClone(src),name:src.name||name,kind,x,y};});}
  for(const key of ['allies','civilians']){const place=d[key];if(!place)continue;const list=m[key]||[];
   m[key]=Object.entries(place).map(([cid,[x,y]])=>{const src=list.find(u=>u.id===cid);if(!src)throw Error(`M${id}: no ${key} ${cid}`);const u={...structuredClone(src),id:cid,x,y};if(u.post)u.post={x,y};return u;});}
  const taken=[...(m.civilians||[]),...(m.allies||[]),...(m.objects||[])].map(c=>[c.x,c.y]),spots=d.deploy.filter(([x,y])=>open2510(rows,x,y)&&!taken.some(([a,b])=>a===x&&b===y));
  const [zx0,zy0,zx1,zy1]=d.zoneArea,inZone=area2510(rows,zx0,zy0,zx1,zy1,taken);
  m.deployZone=()=>new Set(inZone.map(([x,y])=>`${x},${y}`));
  m.deployments={recommended:spots.slice(0,8),assault:spots.slice(0,8),defense:spots.slice(-8)};}
 return MISSIONS;}
