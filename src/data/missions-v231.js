// v2.3.1 ACT II 큰 맵 2부 (D-128/D-131, docs/v2.3.0/ACT2_MAPS_DESIGN.md §2): M11–M14 on big maps. Objectives, special
// rules, story and duel pairs are unchanged; terrain, entry direction, size and the enemy line-up change (numbers
// PROPOSED, tuned by act2-balance). Maps drawn by scripts/make-act2-maps.py. M11: a switchback road from the south-west
// foot up to the sanctuary, five braziers at its bends. M12: in through the side gate (south-east), round the cloister,
// across the courtyard, to the three record rooms to the north. M13: the lion's host from the north road onto the
// refugee camp, cavalry down the hills east and west. M14: from the council hall at the top, through the square and the
// south gate, out to the bottom row.
const g2310=rows=>rows.map(r=>r.split(''));
const open2310=(rows,x,y)=>!!rows[y]&&!'xw'.includes(rows[y][x]??'x');
const area2310=(rows,x0,y0,x1,y1,skip=[])=>{const out=[];for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(open2310(rows,x,y)&&!skip.some(([a,b])=>a===x&&b===y))out.push([x,y]);return out;};
export const ROWS2310={
 11:["xxxzzzzzzzxxxxxxxxxxxxxx","mmmzzzzzzzmmmmmmmmmmmmmm","mmmzzzzzzzgmmmmgmmmmmmmm","mmmgggrgffgmmmmgmmmmmmmm","mmmgggrgffgmmmmgggggmmmm","mmmgggrgffggggggfffgmmmm","mmmgggrgggggfffffffgmmmm","mmmgggrrrgggfffffffggggg","mmmgggggrgggffffgggggggg","ggggggffrgggffffgggggggg","gffgggggrggggggggfffffgg","gffgrrrrrggggggggfffffgg","gffgrggggggmmggggfffffgg","gffgrggfffgmmggggfffffgg","ggggrggfffgggggggggggggg","ggggrggfffgggffffggggggg","ffggrggggggggffffggfffff","ffggrggggggggffffggfffff","ffggrggggggggggggggfffff","ffggrggggggggggggggfffff"],
 12:["xxxxxxxxxxxxxxxxxxxxxxxx","xkkkkkxxxkkkkkxxxkkkkkxx","xkkkkkxxxkkkkkxxxkkkkkxx","xxxkxxxxxxxkkxxxxxxkxxxx","xkkkkkkkkkkkkkkkkkkkkkkx","xkkkkkkkkkkkkkkkkkkkkkkx","xkkxxxkxxxxggxxxxkxxxkkx","xkkxggggggggggggggggxkkx","xkkkggggggggggggggggkkkx","xkkxggggggggggggggggxkkx","xkkkggggggggggggggggkkkx","xkkxggggggggggggggggxkkx","xkkxxxkxxxxggxxxxkxxxkkx","xkkkkkkkkkkkkkkkkkkkkkkx","xkkkkkkkkkkkkkkkkkkkkkkx","xxxxxxxxxxxxxxxxxxxkxxxx","gggfffggggggggggggrrrggg","ggffggggggggggggggrrrggf","gfffgggggggggggggrrrrgff","ffffggggggggggggrrrrrgff"],
 13:["mmmmmfffffggrrrrggfffffmmmmm","mmmmmfffffgggrrgggfffffmmmmm","gggggfffffgggrrgggfffffggggg","gggfffgggggggrrgggggggfffggg","gggfffgggxxggrrggxxgggfffggg","mmmggggggxxggrrggxxggggggmmm","mmmgggfffggggrrggggfffgggmmm","mmmgggfffggggrrggggfffgggmmm","mmmggggggggggrrggggggggggmmm","mmmggggggggggrrggggggggggmmm","ggggxxgggggrrrrrrgggggxxgggg","ggggxxggggvvvvvvvvggggxxgggg","rrrrrrrrrvvvvvvvvvvrrrrrrrrr","gggggggggvvvvhhvvvvggggggggg","ggggggffgvvvvhhvvvvgffgggggg","ffffggffgvvvvvvvvvvgffggffff","ffffggffggvvvvvvvvggffggffff","ffffggggggggggggggggggggffff"],
 14:["xxxxxxxxxxxxxxxxxxxxxxxx","xxxxxkkkkkkkkkkkkkkxxxxx","xxxxxkkkkkkkkkkkkkkxxxxx","xxxxxkkkkkkkkkkkkkkxxxxx","lllllxkkkkkkkkkkkkxlllll","lxxlrrrrrrrrrrrrrrrrlxxl","lxxlrrggggggggggggrrlxxl","llllrgggggfggfgggggrllll","lxxlrggggggggggggggrlxxl","lxxlrrrrrrrrrrrrrrrrlxxl","llllggxxxggggggxxxggllll","lxxlggxxxggrrggxxxgglxxl","xxxxxxxxxxrrrrxxxxxxxxxx","ggffgggggrrrrrrgggggffgg","gfffgggggrrrrrrggggfffgg","ggfgggggrrrrrrrrgggggfgg","gggggggrrrrrrrrrrggggggg","ggggggrrrrrrrrrrrrgggggg"]
};
// the old M11–M14 soldiers, with new ones beside them
const raid231=(id,x,y,o={})=>({id,name:'재 약탈단',kind:'bandit',x,y,hp:30,atk:16,def:5,res:3,spd:8,mov:4,range:[1,1],movementProfile:'rogue',look:'ashRaider',...o});
const rbow231=(id,x,y)=>({id,name:'재 약탈단 궁수',kind:'archer',x,y,hp:26,atk:15,def:3,res:3,spd:8,mov:3,range:[2,3],look:'ashRaider'});
const watch231=(id,x,y,facing,turns,o={})=>({id,name:'수도원 경비',kind:'spear',x,y,hp:40,atk:16,def:8,res:4,spd:7,mov:0,range:[1,1],alertMov:3,look:'monasteryGuard',watch:true,facing,turns,...o});
const dorm231=(id,x,y,facing)=>watch231(id,x,y,facing,[],{mov:3,awake:true});
const spear231=(id,x,y)=>({id,name:'철왕관 창병',kind:'spear',x,y,hp:36,atk:17,def:8,res:3,spd:6,mov:3,range:[1,1],look:'ironSpear'});
const ibow231=(id,x,y)=>({id,name:'철왕관 궁수',kind:'archer',x,y,hp:28,atk:16,def:4,res:3,spd:7,mov:3,range:[2,3],look:'ironArcher'});
const bearer231=(id,x,y)=>({id,name:'사자 기수',kind:'bearer',x,y,hp:44,atk:12,def:9,res:6,spd:5,mov:2,range:[1,1],look:'bearer'});
const horse231=(id,x,y)=>({id,name:'철왕관 기병',kind:'cavalry',x,y,hp:34,atk:17,def:6,res:2,spd:9,mov:5,range:[1,1],look:'cavalry',movementProfile:'cavalry'});
const mask231=(id,x,y)=>({id,name:'가면 습격대',kind:'bandit',x,y,hp:34,atk:18,def:7,res:4,spd:9,mov:4,range:[1,1],movementProfile:'rogue',look:'maskedRaider',masked:true});
const mbow231=(id,x,y)=>({id,name:'가면 습격대',kind:'archer',x,y,hp:28,atk:16,def:4,res:4,spd:9,mov:4,range:[2,3],movementProfile:'rogue',look:'maskedRaider',masked:true});
export const V231_MISSIONS={
 11:{zoneArea:[0,13,9,19],par:12,turnLimit:14,sanctuaryRow:2,night:{radius:2,fixed:[[4,2],[5,2],[6,2],[7,2],[8,2]]},
  enemies:[raid231('r1',22,10),raid231('r2',22,17),raid231('r3',15,5),raid231('r4',21,7),raid231('r5',23,13),raid231('r6',11,5),
   rbow231('a1',12,3),rbow231('a3',17,6)], // the raiders wait in the woods east of the road; the foot of the road is quiet until TURN 3
  // v2.3.1: the pilgrims walk a longer road past more raiders — +10 HP each (they were 26/24 on the small map)
  civilians:[{id:'p1',name:'순례자 노사제',look:'pilgrim',kind:'pilgrim',x:4,y:13,hp:36,def:3,res:4},{id:'p2',name:'순례자',look:'pilgrim',kind:'pilgrim',x:4,y:14,hp:36,def:3,res:3},
   {id:'p3',name:'순례자 어머니',look:'pilgrim',kind:'pilgrim',x:4,y:15,hp:36,def:3,res:3},{id:'p4',name:'순례자 소년',look:'pilgrim',kind:'pilgrim',x:4,y:16,hp:34,def:2,res:3}],
  allies:{ines_warden:[5,14],fk1:[3,15],fk2:[5,16]},
  objects:[['br1','길가 화로','brazier',3,12],['br2','길가 화로','brazier',9,12],['br3','길가 화로','brazier',9,8],['br4','길가 화로','brazier',5,8],['br5','길가 화로','brazier',7,4]],
  waves:[{turn:4,story:'11:wave',units:[raid231('r9',2,19),raid231('r10',12,19)]},
   {turn:5,story:'11:flank',units:[raid231('r12',0,10),raid231('r13',23,9),rbow231('a6',23,12)]},
   {turn:7,story:'11:captain',units:[{id:'boss',name:'재 약탈단 두목',kind:'captain',x:16,y:4,hp:72,atk:19,def:8,res:5,spd:9,mov:4,range:[1,1],movementProfile:'rogue',look:'ashRaider'},raid231('r14',18,4),raid231('r15',11,8),raid231('r16',3,3)]}],
  deploy:[[5,13],[3,13],[5,15],[3,14],[5,17],[3,16],[6,14],[2,15],[6,16],[3,17],[5,18],[3,18]],
  objective:'순례자 4명 중 3명을 성소(맨 위)까지 호위 또는 TURN 14 새벽까지 버팀 · 순례자 2명 이상 잃으면 패배',
  brief:'순례자는 TURN 2부터 산길을 따라 성소로 걷습니다. 기슭에서 오른쪽으로 꺾어 오르고, 다시 왼쪽으로 돌아 꼭대기 성소에 닿습니다. 빛 안에서는 2칸, 어둠에서는 1칸. 적이 곁에 붙거나 장수가 길을 막으면 멈춥니다. 굽이마다 있는 길가 화로 5개에 인접해 조사하면 불이 켜져 반경 2칸이 밝아집니다. 빛 안의 아군은 명중 +10, 빛 밖의 대상을 노리면 명중 −15. 빛 안의 순례자는 아군 턴마다 HP +5. TURN 4 아래쪽 기슭, TURN 5 양옆, TURN 7 북동쪽 비탈에 두목.',
  council:{terrain:'Mountain Path · 산길(순례자만 걷는 길, 굽이 둘) / 평지 / 숲(이동 2) / 비탈(산) / 성소 바닥(맨 위, 턴 시작 HP 회복)',intel:'재 약탈단 6 · 궁수 2가 산길 동쪽 숲과 비탈에. TURN 4 아래 기슭 2, TURN 5 양옆 3, TURN 7 북동쪽 비탈에 두목 + 3. 동맹: 이네스(곁의 아군 피해 −2)와 성화 기사 2.',plan:'길가 화로 5개를 켜서(인접 조사) 산길을 밝히세요. 빛 안의 순례자는 2칸씩 걷고 HP +5. 길 위에 서지 말고 길 옆을 지키세요. 순례자 3명 성소 도착 또는 TURN 14 새벽까지 버팀. 2명을 잃으면 실패.'}},
 12:{zoneArea:[14,16,23,19],par:12,turnLimit:16,
  enemies:[watch231('g1',8,9,'down',['down','left','up','right']),watch231('g2',12,13,'left',['left','right']),watch231('g3',6,14,'right',['right','up']),watch231('g4',21,10,'down',['down','up']),
   watch231('g5',2,10,'up',['up','down']),watch231('g6',17,14,'right',['right','up']),watch231('g7',15,9,'left',['left','up','right','down']),watch231('g8',11,8,'up',['up','down']),
   watch231('g9',6,5,'right',['right','left']),watch231('g10',17,5,'left',['left','right']),watch231('g11',12,4,'down',['down','left','right']),watch231('g12',3,4,'down',['down','right']),
   watch231('g13',20,4,'down',['down','left']),watch231('g14',11,2,'down',['down','left']),
   {id:'boss',name:'침묵의 원장',kind:'captain',x:2,y:2,hp:84,atk:19,def:8,res:7,spd:6,mov:0,range:[1,1],alertMov:3,look:'abbot'}],
  objects:[['rec_ledger','장부 기록','evidence',1,1,{evidence:'ledger'}],['rec_seal','봉인술 연구','evidence',21,1,{evidence:'seal'}],['rec_roster','교단 명부','evidence',12,1,{evidence:'roster'}]],
  waves:[{turn:99,alarm:true,story:'12:dorm',units:[dorm231('w1',1,8,'right'),dorm231('w2',1,11,'right'),dorm231('w3',2,12,'up'),dorm231('w4',22,9,'left'),dorm231('w5',21,11,'left')]}],
  deploy:[[19,16],[20,16],[18,17],[19,17],[20,17],[18,16],[17,18],[18,18],[19,18],[20,18],[16,19],[17,19]],
  objective:'장부 기록 확보(인접해 조사) + 침묵의 원장 격파·생포 · 장부 기록이 불타거나 TURN 16을 넘기면 패배',
  brief:'남동쪽 바깥 담의 쪽문으로 들어가 회랑을 돌아 안뜰을 지나, 북쪽 기록실 세 곳(서쪽 장부 · 가운데 명부 · 동쪽 봉인술)으로 갑니다. 경비는 바라보는 방향 앞 2칸과 앞 대각선 2칸을 감시하고, 적 턴마다 정해진 순서로 돌아섭니다(붉은 칸). 적 턴이 시작될 때 감시 칸에 장수가 있으면 의심(감시 3칸), 한 번 더 들키거나 경비를 한 번에 쓰러뜨리지 못하면 종이 울립니다(경보). 경보가 울리면 경비가 모두 움직이고 양쪽 숙소에서 다섯이 나오며, 3턴 뒤 원장이 확보하지 못한 기록을 태웁니다. 감시 밖에서 조용한 경비를 치면 기습(명중 +30, 피해 +5). 원장은 HP 절반 이하에서 인접해 생포할 수 있습니다.',
  council:{terrain:'Silent Monastery · 회랑·방(성채 바닥) / 안뜰(평지) / 벽 / 남동쪽 쪽문',intel:'수도원 경비 14(조용한 동안 제자리에서 감시, 적 턴마다 방향 전환) · 침묵의 원장(서쪽 기록실). 경보가 울리면 서쪽 · 동쪽 숙소에서 경비 5, 3턴 뒤 소각.'}},
 13:{zoneArea:[6,8,21,12],par:10,turnLimit:12,
  enemies:[{id:'boss',name:'발드릭 로엔 · 검은 사자',kind:'lion',x:13,y:3,hp:120,atk:21,def:12,res:7,spd:7,mov:3,range:[1,1],look:'lion'},bearer231('f1',12,4),bearer231('f2',15,4),bearer231('f3',13,5),
   spear231('s1',11,5),spear231('s2',16,5),spear231('s3',12,6),spear231('s4',15,6),spear231('s5',10,3),spear231('s6',17,3),spear231('s7',8,4),spear231('s8',19,4),spear231('s9',12,1),spear231('s10',15,1),
   ibow231('a1',6,2),ibow231('a2',20,2),ibow231('a3',3,3),ibow231('a4',24,3)],
  civilians:[{id:'v1',name:'피난민 노인',x:11,y:12,hp:26,def:2},{id:'v2',name:'피난민 어머니',x:16,y:12,hp:26,def:2},{id:'v3',name:'피난민 아이',look:'child',x:12,y:15,hp:22,def:1},{id:'v4',name:'맹세하지 않은 순례자',look:'pilgrim',x:15,y:15,hp:26,def:2}],
  waves:[{turn:3,story:'13:cavalry',units:[horse231('c1',0,4),horse231('c2',27,4),horse231('c3',0,10),horse231('c4',27,10)]},
   {turn:5,story:'13:reinforce',units:[spear231('s11',12,0),spear231('s12',13,0),spear231('s13',14,0),spear231('s14',15,0)]}],
  deploy:[[12,10],[15,10],[11,10],[16,10],[13,9],[14,9],[10,11],[17,11],[9,10],[18,10],[13,11],[14,11]],
  brief:'에릭이 발드릭 곁에서 "설득"하면 결단이 1 오릅니다(턴마다 1번). 테아가 출전했다면 한 번 말을 건넬 수 있습니다. ACT I–II의 선택과, TURN 4부터 적 턴 동안 피난민이 다치지 않을 때마다(최대 2)도 결단이 오릅니다. 6이면 발드릭이 군을 멈춥니다. 발드릭은 TURN 5 전에는 대형이 무너져도 물러서지 않습니다. 사자 기수 곁의 적은 DEF+2·명중+10, 발드릭은 고립된 장수를 노립니다(피해+4). 사자군 본대는 북쪽 길로 내려오고, TURN 3 동서 언덕에서 기병, TURN 5 북쪽 증원.',
  council:{terrain:'Refugee Camp · 천막(마을, 회복) / 길 / 숲 / 폐허(벽) / 동서 언덕(산)',intel:'발드릭(쓰러지지 않음, HP 50%까지) · 사자 기수 3(곁의 적 DEF+2·명중+10) · 창병 10 · 궁수 4. TURN 3 동서 언덕에서 기병 4, TURN 5 북쪽 창병 4. TURN 4부터 병사들이 천막을 노립니다.'}},
 14:{zoneArea:[4,5,19,8],par:9,turnLimit:12,exitRow:17,
  enemies:[mask231('k1',0,5),mask231('k2',23,5),mask231('k3',0,10),mask231('k4',23,10),mask231('k7',4,16),mask231('k9',19,16),mask231('k5',2,7)],
  allies:{cassian:[8,2],leonora:[12,2],lucien:[16,2],ig1:[7,1],ig2:[9,1],fg1:[11,1],fg2:[13,1],lg1:[15,1],lg2:[17,1]},
  waves:[{turn:2,story:'14:raid',units:[mask231('k11',0,7),mask231('k12',23,7),mbow231('k13',0,4)]},
   {turn:4,units:[mask231('k15',3,17),mask231('k16',20,17),mask231('k17',0,13)]},
   {turn:6,story:'14:exit',units:[mask231('k19',5,16),mask231('k20',18,16),mask231('k23',0,11)]}],
  deploy:[[10,6],[14,6],[6,6],[18,6],[10,7],[14,7],[6,7],[18,7],[9,8],[15,8],[11,8],[13,8]], // beside the leaders' way down (columns 8, 12, 16)
  brief:'회담장에서 출발해 광장과 집들 사이를 지나 남문 밖 길로 빠져나갑니다(맨 아랫줄이 출구). 카시안·레오노라·루시안과 호위병이 동맹군으로 남쪽 출구로 물러납니다. 가면 습격대는 지도자를 노리고 양옆 골목과 남쪽에서 계속 들어옵니다. TURN 4에 군단을 가장 믿지 않는 깃발(신뢰가 가장 낮은 세력)이 군단에 칼을 돌립니다: 그 지도자는 전장을 떠나고 호위병은 적이 됩니다.',
  council:{terrain:'Velmar Old Town · 회담장(성채 바닥) / 광장 / 골목(이동 1, 회피 +5) / 집(벽) / 남문 · 맨 아랫줄 출구',intel:'가면 습격대 7 (지도자를 노림, 숲을 가볍게 이동). TURN 2 양옆 골목 3, TURN 4 남쪽 3, TURN 6 남쪽 · 왼쪽 3. 동맹: 카시안·레오노라·루시안과 호위병 각 2. TURN 4에 신뢰가 가장 낮은 깃발이 등을 돌립니다.'}}
};
// Applied after applyV230; same shape as the v2.3.0 maps.
export function applyV231(MISSIONS){
 for(const [k,d] of Object.entries(V231_MISSIONS)){const id=+k,m=MISSIONS[id],rows=ROWS2310[id];
  m.map=g2310(rows);m.width=rows[0].length;m.height=rows.length;
  m.layers={terrain:m.map,collision:m.map.map(r=>r.map(t=>['x','w'].includes(t))),buildings:[],objects:[],actors:'units',effects:'feedback',events:'narrative'};
  for(const key of ['par','turnLimit','enemies','civilians','waves','objective','brief','sanctuaryRow','night','exitRow','council'])if(d[key]!==undefined)m[key]=structuredClone(d[key]);
  m.reinforcements=[];m.v231=true;
  if(d.objects)m.objects=d.objects.map(([oid,name,kind,x,y,extra])=>({id:oid,name,kind,x,y,...(extra||{})}));
  for(const a of m.allies||[]){const p=d.allies?.[a.id];if(!p)continue;a.x=p[0];a.y=p[1];if(a.post&&!p[2])a.post={x:p[0],y:p[1]};Object.assign(a,structuredClone(p[2]||{}));}
  const taken=[...(m.civilians||[]),...(m.allies||[])].map(c=>[c.x,c.y]),spots=d.deploy.filter(([x,y])=>open2310(rows,x,y)&&!taken.some(([a,b])=>a===x&&b===y));
  const [zx0,zy0,zx1,zy1]=d.zoneArea,inZone=area2310(rows,zx0,zy0,zx1,zy1,taken);
  m.deployZone=()=>new Set(inZone.map(([x,y])=>`${x},${y}`));
  m.deployments={recommended:spots.slice(0,8),assault:spots.slice(0,8),defense:spots.slice(-8)};}
 return MISSIONS;}
