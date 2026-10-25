// v0.6 (D-056): every enterable building resolves to a room that fits its setting (village timber,
// army canvas, fortress stone; ACT II north and port towns), and every chest gets a style that fits the room.
// Interior kinds, building ids, chest ids and chest rewards are unchanged — this only picks the look.
// A room with a painted layout (ROOM_LAYOUTS, filled in when the art pack arrives) replaces the
// procedural interior template; until then the template is used and only the chest style changes.
import {HUBS} from './frontier-data.js';

export const ROOM_FAMILY={village:'village',garrison:'tent',bivouac:'tent',oathcamp:'tent',fortress:'fort',castletown:'north',velmar:'port'};
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

// Painted room layouts, keyed by room id: {art, width, height, spawn, mask, doors:[[x,y]…], props, chests:[[id,x,y]…], npcs, night}.
// Empty until the user's interior art pack is imported (docs/v0.6.0/INTERIORS_AND_CHESTS.md).
export const ROOM_LAYOUTS={};

// Which room a building shows: hub kind → family, then the building's sign, then its interior kind.
export function roomId(hubId,interior,buildingId){
 const hub=HUBS[hubId],family=ROOM_FAMILY[hub?.kind];if(!family||!interior)return null;
 const label=buildingId&&hub.buildings.find(b=>b.buildingId===buildingId)?.label;
 return RV6_BY_LABEL[family]?.[label]||RV6_BY_KIND[family]?.[interior]||null;
}
export const frontierRoom=f=>f?.interior?roomId(f.hub,f.interior,f.interiorBuilding):null;
export const chestStyle=(room,chestId)=>ROOM_CHESTS[room]?.[chestId]||'old_chest';
