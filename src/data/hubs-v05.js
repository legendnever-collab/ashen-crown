// v0.5.0 painted interlude hubs (D-052). Each hub is one 1536×1024 painting = 24×16 tiles of 64 px.
// mask: '.' walkable, '#' solid (authored over the painting). Doors use the same five building ids in
// every camp-type hub so chest records and saved interiors stay valid when the legion moves on.
// Hub choice by story moment is fixed here (W3); shop catalogs and prices do not depend on the hub.

// Which hub a story moment uses. phase: 'preparation' | 'aftermath'.
export function hubFor(missionId,phase='preparation'){
 const after=phase==='aftermath';
 if(missionId<=1)return after?'village_raid':'village';
 if(missionId===2||missionId===3&&!after)return 'camp';
 if(missionId===3||missionId===4&&!after)return 'bivouac';
 if(missionId===6&&after)return 'oathcamp';
 if(missionId>=4&&missionId<=6)return 'fortress';
 return 'oathcamp';
}
// v0.6 ACT II plan (D-055 §6, PROPOSED): Ironhold's castle town for M07–M08, the march bivouac after M08, Velmar for
// M09–M10. hubFor switches to it in Phase D, when the castle town and Velmar hubs exist (LAST_MISSION is still 6).
export function act2HubFor(missionId,phase='preparation'){const after=phase==='aftermath';if(missionId===7||missionId===8&&!after)return 'castletown';if(missionId===8)return 'bivouac';return 'velmar';}
// Story key → hub used as the staged backdrop ('pre:3', 'after:3:loss', '6:oath' …).
export function stageHubFor(key){
 const m=/^(pre|after):(\d+)/.exec(key);if(m)return hubFor(+m[2],m[1]==='after'?'aftermath':'preparation');
 if(key==='raid')return 'village';if(key.startsWith('6:'))return 'oathcamp';if(key.startsWith('promo:'))return 'oathcamp';return null;
}

const hv5Interior={inn:'barracks',warroom:'quarters',depot:'store',residence:'house'};
// Village shop doors keep the v0.3.3 anchors: place 'forge'/'shop', action and interior 'weapon'/'item'.
const hv5Shop={forge:'weapon',shop:'item'};
function hv5Build(id,spec){
 const mask=spec.solid?spec.mask.map((r,y)=>[...r].map((c,x)=>spec.solid.some(([a,b])=>a===x&&b===y)?'#':c).join('')):spec.mask;if(mask.length!==16||mask.some(r=>r.length!==24))throw Error(`hub mask ${id}`);
 const buildings=[],places=spec.places.map(([pid,name,x,y])=>({id:pid,name,x,y}));
 for(const [bid,label,name,x,y,w,h,dx,dy] of spec.doors){const type=bid.split('-')[0],shop=hv5Shop[bid],interior=shop||hv5Interior[type];
  const entrance={tileX:dx,tileY:dy,approachDirection:'north',triggerType:'interact'};
  buildings.push({x,y,w,h,label,type,buildingId:bid,entrance,returnPoint:{tileX:dx,tileY:dy+1},interiorScene:interior,painted:true});
  places.push(shop?{id:bid,name,x:dx,y:dy+1,action:shop,entrance,buildingId:bid}:{id:bid,name,x:dx,y:dy+1,action:'enter',entrance,buildingId:bid,interior,hub:id});}
 const npcs=spec.npcs.map(([nid,name,x,y,extra])=>({id:nid,name,x,y,...(extra||{})}));
 return {name:spec.name,tone:spec.tone||'camp',kind:spec.kind,art:spec.art,width:24,height:16,spawn:spec.spawn,mask,stage:spec.stage,lights:spec.lights||[],paintedTable:!!spec.paintedTable,night:!!spec.night,buildings,places,npcs};
}
const hv5Heroes=(pos)=>[['aren','아렌 · 군단장',...pos.aren,{kind:'commander'}],['elina',pos.elinaName,...pos.elina,{kind:'hero'}],['lia','리아 · 군사',...pos.lia,{kind:'hero'}],['sain',pos.sainName,...pos.sain,{kind:'hero'}],['kai',pos.kaiName,...pos.kai,{kind:'hero'}],['advisor','리아의 작전 탁자 · 작전 회의',...pos.advisor,{kind:'advisor'}]];

// Village (M01): same 24×16 layout for the morning and the evening after the raid.
const HV5_VILLAGE={tone:'village',spawn:[19,9],paintedTable:true,stage:{x:430,y:590},
  mask:[
   '########################',
   '###########..###########',
   '###########..###########',
   '###########..###########',
   '#......................#',
   '#######..........#######',
   '#######..#.##.#..#######',
   '#######...####...#######',
   '#######..#....#..#######',
   '#......................#',
   '##########....##########',
   '##########....##########',
   '#########.....##########',
   '##........#..###########',
   '###########..###########',
   '########################'],
  doors:[['forge','BLACKSMITH','Blacksmith',1,0,6,4,5,3],['shop','ITEM SHOP','Item Shop',16,0,7,4,21,3],['inn-1','BARRACKS','병영',1,5,6,4,3,8],['warroom-2','COMMAND QUARTERS','지휘관 숙소',20,5,4,4,21,8],['residence-3','HOME','민가',1,10,4,3,3,12],['depot-4','SUPPLY','보급 창고',5,10,4,3,6,12]],
  places:[['square','Village Square',12,8],['exit','Village Exit',11,14],['advisor','작전 탁자 · 촌장 회관',19,9]],
  npcs:[...hv5Heroes({aren:[16,8],elina:[12,1],elinaName:'엘리나 · 경계',lia:[18,8],sain:[5,8],sainName:'세인 · 구호',kai:[15,5],kaiName:'카이 · 길목 관찰',advisor:[19,8]}),['elder','마을 촌장',22,9],['refugee','피난민',7,8],['guard','경비병',12,14]]};
const HV5_SPECS={
 village:{...HV5_VILLAGE,name:'Ashen Village · 잿빛 마을',kind:'village',art:'hub_village_day',lights:[[190,180,90,'fire']]},
 village_raid:{...HV5_VILLAGE,name:'Ashen Village · 습격 후',kind:'village',art:'hub_village_raid',solid:[[10,8],[13,8],[14,7],[15,7]],lights:[[200,720,120,'fire'],[420,740,110,'fire'],[300,800,90,'fire'],[930,500,70,'fire'],[1290,175,60,'fire']]},
 camp:{name:'Border Camp · 국경 수비대 진영',kind:'garrison',art:'hub_garrison',spawn:[9,7],paintedTable:true,stage:{x:500,y:285},
  mask:[
   '########################',
   '###########..###########',
   '##########...###########',
   '##########...###########',
   '#......................#',
   '########........########',
   '########.######.########',
   '########..####..########',
   '########...##...########',
   '####.....#....#........#',
   '##########.....#########',
   '##########.....#########',
   '###########....#########',
   '###########..###########',
   '###########..###########',
   '########################'],
  doors:[['inn-1','TRIAGE','구호 천막',1,5,4,4,4,8],['inn-3','BARRACKS','병영 천막',5,5,3,4,6,8],['warroom-2','COMMAND QUARTERS','지휘 천막',16,5,4,4,17,8],['warroom-4','OPERATIONS','작전 천막',20,5,4,4,21,8],['depot-5','SUPPLY','보급 천막',15,1,4,3,17,3]],
  places:[['square','연병장',12,9],['forge','야전 대장간',4,4],['shop','보급관 천막',19,4],['gate','진영 입구',11,13],['advisor','작전 탁자 · 연병장',9,7]],
  npcs:[...hv5Heroes({aren:[22,9],elina:[12,2],elinaName:'엘리나 · 정찰',lia:[10,8],sain:[5,8],sainName:'세인 · 부상자',kai:[22,4],kaiName:'카이 · 우회로',advisor:[10,7]}),
   ['smith','야전 대장장이 · 무기점',4,3,{service:'weapon'}],['merchant','보급관 · 도구점',19,3,{service:'item'}],['elder','진영 관리인',14,11],['refugee','피난 주민',10,11],['guard','보초',12,13]],
  lights:[[770,385,150,'fire'],[150,190,110,'fire']]},
 bivouac:{name:'Field Bivouac · 행군 야영지',kind:'bivouac',art:'hub_bivouac_night',spawn:[19,4],paintedTable:true,night:true,stage:{x:620,y:318},
  mask:[
   '########################',
   '########.###############',
   '########.###############',
   '########.###############',
   '##.....................#',
   '#########.............##',
   '#########.#..#...#######',
   '########..####...#######',
   '########...#.#...#######',
   '#########......#########',
   '#########.....##########',
   '##########....##########',
   '###########..###########',
   '###########..###########',
   '###########..###########',
   '########################'],
  doors:[['inn-1','TENT','병사 천막',1,1,4,3,3,3],['inn-3','TENT','보초 천막',5,1,3,3,6,3],['depot-5','SUPPLY','보급 천막',9,1,6,3,11,3],['warroom-2','COMMAND QUARTERS','지휘 천막',15,1,4,3,17,3],['warroom-4','OPERATIONS','작전 천막',20,1,4,3,22,3]],
  places:[['square','모닥불',12,9],['shop','방랑 상인 마차',9,7],['gate','야영지 입구',11,13],['advisor','작전 탁자 · 지휘 천막',19,4]],
  npcs:[...hv5Heroes({aren:[12,6],elina:[16,8],elinaName:'엘리나 · 경계',lia:[20,4],sain:[9,11],sainName:'세인 · 부상자',kai:[9,6],kaiName:'카이 · 모닥불',advisor:[19,3]}),
   ['merchant','방랑 상인 · 도구와 무기',8,7,{services:['item','weapon']}],['elder','진영 관리인',16,5],['refugee','피난 주민',10,10],['guard','보초',12,14]],
  lights:[[770,470,330,'fire'],[655,800,120,'torch'],[870,800,120,'torch'],[250,420,110,'lantern'],[1235,150,120,'lantern'],[1300,690,110,'lantern']]},
 fortress:{name:'Reclaimed Fortress · 탈환한 성채',kind:'fortress',art:'hub_fortress',spawn:[9,7],stage:{x:520,y:660},
  mask:[
   '########################',
   '########################',
   '###########..###########',
   '########.......#########',
   '#......................#',
   '########.........#######',
   '########.#.##.#..#######',
   '########...##....#######',
   '########...##....#######',
   '#........#....#........#',
   '#######..........#######',
   '#######..........#######',
   '###########..###########',
   '###########..###########',
   '###########..###########',
   '########################'],
  doors:[['depot-5','ARMORY','무기고',1,1,7,3,4,3],['inn-1','BARRACKS','병영',1,5,3,4,3,8],['inn-3','BARRACKS','병영 별채',4,5,4,4,6,8],['warroom-2','RECORDS HALL','기록실',9,0,3,2,11,1],['warroom-4','COMMAND QUARTERS','지휘관 숙소',12,0,3,2,12,1]],
  places:[['square','안뜰',12,10],['forge','성채 대장간',19,9],['shop','창고',19,4],['gate','성문',11,13],['advisor','작전 탁자 · 안뜰 서쪽',9,7]],
  npcs:[...hv5Heroes({aren:[13,3],elina:[22,4],elinaName:'엘리나 · 성벽 경계',lia:[8,8],sain:[2,8],sainName:'세인 · 부상자',kai:[15,11],kaiName:'카이 · 뒷길',advisor:[8,7]}),
   ['smith','성채 대장장이 · 무기점',19,8,{service:'weapon'}],['merchant','보급관 · 도구점',19,3,{service:'item'}],['elder','성채 관리인',7,3],['refugee','피난 주민',14,11],['guard','보초',12,12]],
  lights:[[614,345,90,'torch'],[918,345,90,'torch'],[614,520,90,'torch'],[918,520,90,'torch'],[655,780,100,'torch'],[875,780,100,'torch'],[1290,490,120,'fire']]},
 oathcamp:{name:'Oath Camp · 재의 군단 진영',kind:'oathcamp',art:'hub_oathcamp',spawn:[20,5],paintedTable:true,stage:{x:560,y:225},
  mask:[
   '########################',
   '###########..###########',
   '###########..###########',
   '########........########',
   '########........########',
   '##.#.#.#...##..........#',
   '.........#.##.##########',
   '########.###############',
   '########...###..########',
   '########.#.....#########',
   '.........##............#',
   '##########....##########',
   '##########....##########',
   '###########..###########',
   '###########..###########',
   '########################'],
  doors:[['inn-1','TENT','병사 천막',1,2,2,3,2,4],['inn-3','TENT','병사 천막 2',3,2,2,3,4,4],['depot-5','SUPPLY','보급 천막',5,2,3,3,6,4],['warroom-2','COMMAND QUARTERS','지휘 천막',16,2,3,3,17,4],['warroom-4','OPERATIONS','작전 천막',21,2,3,3,22,4]],
  places:[['square','맹세의 광장',12,10],['shop','방랑 상인',5,10],['gate','국경 관문',11,2],['training','훈련장',17,10],['advisor','작전 탁자 · 지휘 천막',20,5]],
  npcs:[...hv5Heroes({aren:[12,9],elina:[22,10],elinaName:'엘리나 · 훈련장',lia:[21,4],sain:[10,3],sainName:'세인 · 피난민',kai:[8,3],kaiName:'카이 · 길목',advisor:[20,4]}),
   ['merchant','방랑 상인 · 도구와 무기',5,9,{services:['item','weapon']}],['elder','진영 관리인',15,4],['refugee','피난 주민',13,3],['guard','보초',13,12]],
  lights:[[815,490,170,'fire'],[625,420,90,'lantern'],[945,420,90,'lantern'],[625,610,90,'lantern'],[945,610,90,'lantern'],[680,830,100,'torch'],[855,830,100,'torch'],[300,500,120,'fire']]}
};
export const ART_HUBS=Object.fromEntries(Object.entries(HV5_SPECS).map(([id,spec])=>[id,hv5Build(id,spec)]));
