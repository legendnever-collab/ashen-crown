// v2.0.0 (REFORM_DESIGN §4.1, D-115): gear by class, not by hero. Each weapon has a kind, each armour a weight; a class
// may use the kinds and weights listed below. `heroes` on every gear entry is recomputed from this (heroes and officers
// whose class fits), so the equip rules, the shops and the save check keep reading g.heroes. Descriptions lose the names.
import {UNIT_CLASS8,CLASSES8} from './classes8.js';
export const WEAPON_KIND={ironBlade:'sword',huntingBow:'bow',longbow:'bow',crystalStaff:'staff',mercyStaff:'staff',daggers:'dagger',
 steelGreatsword:'greatsword',knightLance:'spear',ironwoodBow:'bow',runeforgedBlade:'sword',twinSabers:'sword',repeatingCrossbow:'bow',
 emberRod:'staff',shadowStiletto:'dagger',duelistRapier:'sword',flameStaff:'staff',pilgrimMace:'hammer',sanctumTome:'tome',cathedralStaff:'staff',
 crownGuardLance:'spear',leagueSaber:'sword',leagueLongbow:'bow',paladinMace:'hammer',royalSaber:'sword',archiveBow:'bow',wardRod:'staff',
 royalLance:'spear',royalMace:'hammer'};
export const ARMOR_WEIGHT={heavyShield:'heavy',lightShield:'light',travelCloak:'light',plateCuirass:'heavy',towerShield:'heavy',lancerMail:'heavy',
 merchantCoat:'light',pilgrimMantle:'light',wardenShield:'heavy',crownGuardShield:'heavy',flameVestment:'robe',courtVestment:'robe',greyMantle:'light'};
export const GEAR_KIND_KO={sword:'검',greatsword:'대검',spear:'창',bow:'활',staff:'지팡이',tome:'마도서',dagger:'단검',hammer:'망치'};
export const WEIGHT_KO={light:'경갑',heavy:'중갑',robe:'로브'};
// Weights each class may wear (§4.1; infantry knights also take shields and plate).
export const CLASS_ARMOR={infantry:['light','heavy'],spear:['heavy','light'],archer:['light'],cavalry:['heavy','light'],mage:['robe','light'],healer:['robe','light'],rogue:['light'],shield:['heavy']};
export const CLASS_WEAPONS=Object.fromEntries(Object.entries(CLASSES8).map(([k,c])=>[k,c.weapons]));
export function gearClasses(id,g){if(g.slot==='weapon'){const k=WEAPON_KIND[id];return k?Object.keys(CLASSES8).filter(c=>CLASS_WEAPONS[c].includes(k)):Object.keys(CLASSES8);}
 if(g.slot==='armor'){const w=ARMOR_WEIGHT[id];return w?Object.keys(CLASSES8).filter(c=>CLASS_ARMOR[c].includes(w)):Object.keys(CLASSES8);}
 if(id==='hawkFeather')return ['archer'];return Object.keys(CLASSES8);}
export const classesKo=list=>list.length===Object.keys(CLASSES8).length?'모든 병종':list.map(c=>CLASSES8[c].ko).join('·');
export function applyClassGear(GEAR,statText){for(const [id,g] of Object.entries(GEAR)){const cls=gearClasses(id,g);g.classes=cls;g.kind=g.slot==='weapon'?WEAPON_KIND[id]||null:g.slot==='armor'?ARMOR_WEIGHT[id]||null:null;
 g.heroes=Object.keys(UNIT_CLASS8).filter(h=>cls.includes(UNIT_CLASS8[h]));
 if(!g.treasure){const kind=g.slot==='weapon'?GEAR_KIND_KO[g.kind]:g.slot==='armor'?WEIGHT_KO[g.kind]:'장신구';g.description=`${kind||''}${kind?' · ':''}${classesKo(cls)} · ${statText(g.bonus)}`;}}
 return GEAR;}
