// v0.6 (D-056): every enterable building resolves to a room that fits its setting (village timber,
// army canvas, fortress stone; ACT II north and port towns), and every chest gets a style that fits the room.
// Interior kinds, building ids, chest ids and chest rewards are unchanged — this only picks the look.
// A room with a painted layout (ROOM_LAYOUTS, filled in when the art pack arrives) replaces the
// procedural interior template; until then the template is used and only the chest style changes.
import {HUBS,INTERIORS} from './frontier-data.js';

export const ROOM_FAMILY={village:'village',garrison:'tent',bivouac:'tent',oathcamp:'tent',fortress:'fort',castletown:'north',velmar:'port',pilgrim:'village',refuge:'tent'};
const RV6_BY_KIND={
 village:{house:'int_village_house',weapon:'int_village_forge',item:'int_village_shop',barracks:'int_village_barracks',quarters:'int_village_hall',store:'int_village_store'},
 tent:{barracks:'int_tent_soldier',quarters:'int_tent_command',store:'int_tent_supply'},
 fort:{barracks:'int_fort_barracks',quarters:'int_fort_command',store:'int_fort_armory'},
 north:{house:'int_north_house',weapon:'int_north_smithy',item:'int_north_provisioner',barracks:'int_north_inn',quarters:'int_north_office',store:'int_north_store'},
 port:{house:'int_port_house',weapon:'int_port_armory',item:'int_port_apothecary',barracks:'int_port_tavern',quarters:'int_port_council',store:'int_port_warehouse'}
};
// Buildings whose sign makes them a different room of the same kind.
const RV6_BY_LABEL={tent:{TRIAGE:'int_tent_triage',OPERATIONS:'int_tent_operations'},fort:{'RECORDS HALL':'int_fort_records'}};

export const ROOM_CHESTS={
 int_village_house:{a:'village_chest'},int_village_barracks:{a:'militia_locker',b:'militia_locker'},int_village_hall:{a:'elder_coffer'},int_village_store:{a:'grain_bin',b:'grain_bin'},
 int_tent_soldier:{a:'field_locker',b:'field_locker'},int_tent_triage:{a:'medic_chest',b:'medic_chest'},int_tent_command:{a:'officer_strongbox'},int_tent_operations:{a:'document_coffer'},int_tent_supply:{a:'supply_crate',b:'supply_crate'},
 int_fort_barracks:{a:'fort_locker',b:'fort_locker'},int_fort_armory:{a:'armory_chest',b:'armory_chest'},int_fort_records:{a:'document_coffer'},int_fort_command:{a:'officer_strongbox'},
 int_north_inn:{a:'fur_trunk',b:'fur_trunk'},int_north_office:{a:'iron_lockbox'},int_north_house:{a:'frost_chest'},int_north_store:{a:'sled_crate',b:'sled_crate'},
 int_port_tavern:{a:'sea_chest',b:'sea_chest'},int_port_council:{a:'council_strongbox'},int_port_house:{a:'merchant_coffer'},int_port_warehouse:{a:'cargo_crate',b:'cargo_crate'}
};
export const CHEST_STYLES=['village_chest','militia_locker','grain_bin','elder_coffer','field_locker','medic_chest','supply_crate','officer_strongbox','document_coffer','armory_chest','fort_locker','old_chest',
 'frost_chest','fur_trunk','sled_crate','iron_lockbox','sea_chest','merchant_coffer','cargo_crate','council_strongbox'];

// Painted rooms (art pack A, imported 2026-10-25): each painting is 12×8 tiles; the mask ('.' walkable, '#' solid) is
// authored over the painting, chest tiles are solid and drawn by the game, the doorway is the two bottom-centre tiles.
// npc: [x,y] where the room's shopkeeper stands behind the counter (talk reach 2, across the counter).
const RV6_DOOR='#####..#####';
export const ROOM_LAYOUTS={
 int_village_house:{name:'민가',chests:[['a',1,4]],mask:['###.########','#.........##','##.........#','#..........#','#..........#']},
 int_village_forge:{name:'대장간',npc:[6,4],mask:['#####....###','#.........##','#..........#','#...####...#','#..........#']},
 int_village_shop:{name:'도구점',npc:[5,3],mask:['####.....###','##.........#','#...####...#','#..........#','#..........#']},
 int_village_barracks:{name:'민병 병영',chests:[['a',1,4],['b',10,2]],mask:['###..#######','#...####...#','##..####...#','#.........##','#..........#']},
 int_village_hall:{name:'촌장 회관',chests:[['a',10,4]],mask:['##########.#','########...#','#.........##','#..........#','#..........#']},
 int_village_store:{name:'보급 창고',chests:[['a',10,4],['b',3,4]],mask:['######.#####','#..........#','#..#......##','#..........#','#..........#']},
 int_tent_soldier:{name:'병사 천막',chests:[['a',1,4],['b',10,2]],mask:['#.#..##.#.##','#..........#','##.........#','#..........#','#..........#']},
 int_tent_triage:{name:'구호 천막',chests:[['a',1,4],['b',10,2]],mask:['####.#..#.##','##.........#','##.........#','#.......####','#..........#']},
 int_tent_command:{name:'지휘 천막',chests:[['a',10,4]],mask:['############','#...#####..#','#.......#.##','#..........#','#..........#']},
 int_tent_operations:{name:'작전 천막',chests:[['a',10,4]],mask:['###.########','##..####...#','#...####..##','#..........#','#..........#']},
 int_tent_supply:{name:'보급 천막',chests:[['a',10,4],['b',3,4]],mask:['####.#######','#..........#','#..#......##','#..........#','#..........#']},
 int_fort_barracks:{name:'성채 병영',chests:[['a',1,4],['b',10,2]],mask:['#.........##','#...####...#','##..####...#','#..........#','#...#..#...#']},
 int_fort_armory:{name:'무기고',chests:[['a',10,4],['b',3,4]],mask:['##.##..#####','#..........#','#..#......##','#..........#','#...#..#...#']},
 int_fort_records:{name:'기록실',chests:[['a',10,4]],mask:['############','#...####...#','#...####..##','#..........#','#...#..#...#']},
 int_fort_command:{name:'지휘관 숙소',chests:[['a',10,4]],mask:['############','#...####...#','#...####..##','#..........#','#...#..#...#']},
 // ACT II (art pack C, imported 2026-10-25): castle town below Ironhold and Velmar. Shopkeepers stand behind the counter.
 int_north_inn:{name:'여관',chests:[['a',1,4],['b',10,2]],mask:['#....###..##','#...####...#','##.........#','#..........#','#..........#']},
 int_north_smithy:{name:'대장간',npc:[6,4],mask:['#####.....##','##.........#','#..........#','#...#####..#','#..........#']},
 int_north_provisioner:{name:'잡화점',npc:[6,4],mask:['#.........##','###........#','###........#','#...#####..#','#..........#']},
 int_north_office:{name:'검문소',chests:[['a',10,4]],mask:['##..#####..#','#..........#','####......##','#..........#','#..........#']},
 int_north_house:{name:'민가',chests:[['a',1,4]],mask:['######....##','#..........#','##.........#','#..........#','#..........#']},
 int_north_store:{name:'창고',chests:[['a',10,4],['b',3,4]],mask:['###......###','#..........#','#..#......##','#..........#','#..........#']},
 int_port_tavern:{name:'항구 주점',chests:[['a',1,4],['b',10,2]],mask:['######....##','#...##.#...#','##..##.#...#','##.........#','#.........##']},
 int_port_armory:{name:'용병 무기점',npc:[6,4],mask:['####....####','##........##','##.........#','##..#####..#','#..........#']},
 int_port_apothecary:{name:'약재상',npc:[6,4],mask:['####.....###','###........#','###........#','#...#####..#','#..........#']},
 int_port_council:{name:'의회 대기실',chests:[['a',10,4]],mask:['#########..#','#########..#','#...####..##','#..........#','#..........#']},
 int_port_house:{name:'연립주택',chests:[['a',1,4]],mask:['####.##...##','#....##....#','##.........#','#..........#','#..........#']},
 int_port_warehouse:{name:'항구 창고',chests:[['a',10,4],['b',3,4]],mask:['##..##..####','##.........#','##.#......##','##.........#','#.........##']}
};
const roomCache=new Map();
// The painted room for a building, or null (then the procedural interior template is used). Same interior kind,
// chest ids and service as the template; only the floor plan and the look change. A night hub dims the room.
export function paintedRoom(hubId,interior,buildingId){
 const id=roomId(hubId,interior,buildingId),L=ROOM_LAYOUTS[id],base=INTERIORS[interior];if(!L||!base)return null;
 const night=!!HUBS[hubId]?.night,key=`${id}:${night}`;if(roomCache.has(key))return roomCache.get(key);
 const mask=['############','############',...L.mask,RV6_DOOR],chests=L.chests||[],exit=[6,6];
 const room={name:`${L.name} · 내부`,tone:'interior',painted:true,art:id,night,width:12,height:8,spawn:exit,generic:base.generic,service:base.service,mask,doors:[[5,7],[6,7]],
  buildings:chests.map(([chestId,x,y])=>({type:'chest',x,y,w:1,h:1,label:'',chestId})),
  npcs:(base.npcs||[]).map(n=>L.npc?{...n,x:L.npc[0],y:L.npc[1],reach:2}:n),
  places:[{id:'exit',name:'밖으로 나가기',x:exit[0],y:exit[1],action:'exit'},...chests.map(([chestId,x,y])=>({id:`chest:${chestId}`,name:'보물상자',x,y,action:'chest',chestId}))]};
 roomCache.set(key,room);return room;
}

// Which room a building shows: hub kind → family, then the building's sign, then its interior kind.
export function roomId(hubId,interior,buildingId){
 const hub=HUBS[hubId],family=ROOM_FAMILY[hub?.kind];if(!family||!interior)return null;
 const label=buildingId&&hub.buildings.find(b=>b.buildingId===buildingId)?.label;
 return RV6_BY_LABEL[family]?.[label]||RV6_BY_KIND[family]?.[interior]||null;
}
export const frontierRoom=f=>f?.interior?roomId(f.hub,f.interior,f.interiorBuilding):null;
export const chestStyle=(room,chestId)=>ROOM_CHESTS[room]?.[chestId]||'old_chest';
