// Original 32×32 pixel-style item icons as inline SVG (no external art). Each is a few
// shaded rectangles on a pixel grid so the inventory reads like a classic RPG bag.
const R=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
const ART={
 ironBlade:R(14,3,4,18,'#d8e2e6')+R(15,3,1,18,'#ffffff')+R(17,4,1,16,'#8fa3ad')+R(9,20,14,3,'#c9a24a')+R(14,23,4,6,'#6b4a2e')+R(13,28,6,2,'#c9a24a'),
 huntingBow:R(9,4,3,24,'#8a5a32')+R(11,6,2,20,'#b07a45')+R(20,4,1,24,'#efe6c8')+R(12,4,8,1,'#efe6c8')+R(12,27,8,1,'#efe6c8')+R(10,14,3,4,'#5a3a20'),
 longbow:R(8,2,3,28,'#5f3b22')+R(10,4,2,24,'#8d5c34')+R(21,2,1,28,'#f3ead0')+R(11,2,10,1,'#f3ead0')+R(11,29,10,1,'#f3ead0')+R(9,14,3,4,'#c9a24a'),
 crystalStaff:R(15,9,3,21,'#7a5232')+R(16,9,1,21,'#a77447')+R(12,2,9,8,'#7ec8e3')+R(14,3,5,6,'#c8f1ff')+R(15,4,2,2,'#ffffff')+R(11,9,11,2,'#c9a24a'),
 mercyStaff:R(15,8,3,22,'#d9c79a')+R(16,8,1,22,'#fff2cf')+R(11,3,11,3,'#e7c35f')+R(15,1,3,9,'#e7c35f')+R(16,2,1,6,'#fff3b0'),
 daggers:R(7,5,3,14,'#d5dde0')+R(8,5,1,14,'#fff')+R(5,18,7,2,'#c26a36')+R(7,20,3,6,'#4a3b30')+R(22,7,3,14,'#d5dde0')+R(23,7,1,14,'#fff')+R(20,20,7,2,'#c26a36')+R(22,22,3,6,'#4a3b30'),
 heavyShield:R(7,4,18,20,'#4f7f8c')+R(9,6,14,16,'#6fa6b2')+R(9,24,14,3,'#4f7f8c')+R(12,27,8,2,'#4f7f8c')+R(15,6,2,20,'#d9c27a')+R(9,13,14,2,'#d9c27a'),
 lightShield:R(9,6,14,16,'#8aa7a9')+R(11,8,10,12,'#b9d1d0')+R(12,22,8,3,'#8aa7a9')+R(14,25,4,2,'#8aa7a9')+R(15,9,2,10,'#e6d39a'),
 travelCloak:R(9,5,14,4,'#4d6b57')+R(7,9,18,18,'#5f8a6b')+R(9,11,14,15,'#7aa785')+R(15,9,2,18,'#3f5a48')+R(13,6,6,3,'#c9a24a'),
 trailBoots:R(8,8,7,14,'#7a5534')+R(8,20,11,6,'#7a5534')+R(9,9,4,12,'#a2734a')+R(17,8,7,14,'#6a492d')+R(17,20,11,6,'#6a492d')+R(8,25,11,2,'#3a2a1c')+R(17,25,11,2,'#3a2a1c'),
 focusCharm:R(15,2,2,7,'#c9a24a')+R(10,9,12,12,'#9d6fd0')+R(12,11,8,8,'#c9a4f0')+R(14,13,3,3,'#ffffff')+R(14,21,4,6,'#c9a24a'),
 medium:R(13,3,6,4,'#8b6a43')+R(12,7,8,3,'#dfe8ea')+R(9,10,14,17,'#dfe8ea')+R(10,13,12,13,'#c8413a')+R(12,14,3,5,'#ff8a7a'),
 ether:R(13,3,6,4,'#8b6a43')+R(12,7,8,3,'#dfe8ea')+R(9,10,14,17,'#dfe8ea')+R(10,13,12,13,'#3a6fc8')+R(12,14,3,5,'#8fc0ff'),
 ward:R(13,3,6,4,'#8b6a43')+R(12,7,8,3,'#dfe8ea')+R(9,10,14,17,'#dfe8ea')+R(10,13,12,13,'#3d9a63')+R(12,14,3,5,'#9fe0b5'),
 potion:R(13,3,6,4,'#8b6a43')+R(12,7,8,3,'#dfe8ea')+R(9,10,14,17,'#dfe8ea')+R(10,15,12,11,'#d8a23a')+R(12,16,3,4,'#ffe08a'),
 // v0.8.0 temporary icons (D-073): replaced by art work pack E; not final art.
 herb:R(14,14,3,14,'#4a6b2e')+R(8,8,8,7,'#6fa04a')+R(17,6,8,8,'#7fb85a')+R(11,15,10,4,'#5d8f3c')+R(13,20,6,2,'#c9a24a'),
 antidote:R(9,18,14,10,'#9a6a43')+R(10,16,12,3,'#b98352')+R(12,19,8,6,'#7fb85a')+R(20,4,2,13,'#4a6b2e')+R(17,5,5,4,'#e8f0d8')+R(22,8,4,4,'#e8f0d8'),
 clarity:R(10,20,12,8,'#b8862f')+R(12,18,8,3,'#e2b24a')+R(14,10,3,8,'#c9a4f0')+R(16,5,3,6,'#d9c2f5')+R(13,3,3,4,'#ece0ff'),
 drum:R(8,12,16,13,'#8a5a32')+R(8,10,16,4,'#e8d8b0')+R(8,23,16,2,'#5a3a20')+R(10,14,2,9,'#c9a24a')+R(20,14,2,9,'#c9a24a')+R(4,4,10,2,'#a77447')+R(18,4,10,2,'#a77447'),
 bomb:R(9,11,15,15,'#2e2e33')+R(11,13,6,5,'#55555e')+R(18,6,3,6,'#8a5a32')+R(20,3,4,4,'#f3b03a')+R(22,2,3,3,'#ffe08a')+R(8,18,17,2,'#6b4a2e'),
 smoke:R(9,14,14,12,'#8b7a63')+R(11,16,6,4,'#a8977c')+R(13,4,10,8,'#b9bcc2')+R(8,7,8,7,'#cfd2d8')+R(18,9,8,6,'#a7abb3'),
 bewilder:R(8,16,14,11,'#7a5534')+R(10,14,10,3,'#a2734a')+R(18,6,4,4,'#c9a4f0')+R(22,10,4,4,'#9d6fd0')+R(14,4,3,3,'#e2cdfa')+R(24,4,2,2,'#e2cdfa'),
 net:R(6,6,20,2,'#b98352')+R(6,12,20,2,'#b98352')+R(6,18,20,2,'#b98352')+R(6,24,20,2,'#b98352')+R(6,6,2,20,'#b98352')+R(12,6,2,20,'#b98352')+R(18,6,2,20,'#b98352')+R(24,6,2,20,'#b98352')+R(5,25,4,4,'#55555e')+R(23,25,4,4,'#55555e'),
 caltrops:R(8,14,4,4,'#7d8790')+R(10,10,2,12,'#aab4bc')+R(6,15,10,2,'#aab4bc')+R(20,18,4,4,'#7d8790')+R(22,14,2,12,'#aab4bc')+R(18,19,10,2,'#aab4bc')+R(14,6,3,3,'#7d8790'),
 elixir:R(13,3,6,4,'#c9a24a')+R(12,7,8,3,'#f3ead0')+R(9,10,14,17,'#f3ead0')+R(10,13,12,13,'#f0c64a')+R(12,14,3,5,'#fff2b8')+R(8,9,2,2,'#fff7d0')+R(23,12,2,2,'#fff7d0'),
 gold:R(6,16,20,8,'#b8862f')+R(8,12,16,6,'#e2b24a')+R(10,9,12,5,'#f3cf6c')+R(12,10,4,2,'#fff2b8'),
 supplyCrate:R(6,10,20,16,'#8a5a32')+R(6,10,20,3,'#b07a45')+R(6,17,20,2,'#5a3a20')+R(15,10,2,16,'#5a3a20')+R(9,6,14,4,'#c9a24a')
};
// v0.8.1 temporary icons (D-073): shapes by kind, tinted by the town that makes them (steel for Ironhold, green and brass for
// Velmar, red and cream for the Sacred Flame, gold for elite pieces). Replaced by art work pack E; never final art.
const SHAPE={
 sword:(a,b,c)=>R(14,3,4,18,a)+R(15,3,1,18,'#ffffff')+R(9,20,14,3,c)+R(14,23,4,6,b),
 great:(a,b,c)=>R(13,2,6,20,a)+R(14,2,1,20,'#ffffff')+R(7,21,18,3,c)+R(14,24,4,6,b),
 lance:(a,b,c)=>R(15,2,2,26,b)+R(13,2,6,6,a)+R(14,1,4,2,'#ffffff')+R(12,18,8,3,c),
 bow:(a,b,c)=>R(8,3,3,26,b)+R(10,5,2,22,a)+R(21,3,1,26,'#f3ead0')+R(11,3,10,1,'#f3ead0')+R(11,28,10,1,'#f3ead0')+R(9,14,3,4,c),
 crossbow:(a,b,c)=>R(6,12,20,3,a)+R(14,8,4,18,b)+R(6,10,2,7,c)+R(24,10,2,7,c)+R(15,26,2,3,c),
 staff:(a,b,c)=>R(15,9,3,21,b)+R(12,2,9,8,a)+R(14,3,5,6,'#ffffff')+R(11,9,11,2,c),
 tome:(a,b,c)=>R(8,6,16,20,a)+R(10,8,12,16,b)+R(14,12,4,8,c)+R(8,6,2,20,c),
 mace:(a,b,c)=>R(15,12,3,18,b)+R(11,3,11,10,a)+R(13,5,7,6,'#ffffff')+R(12,24,9,2,c),
 dagger:(a,b,c)=>R(15,4,3,15,a)+R(16,4,1,15,'#ffffff')+R(12,18,9,2,c)+R(15,20,3,7,b),
 twin:(a,b,c)=>R(7,5,3,14,a)+R(5,18,7,2,c)+R(7,20,3,6,b)+R(22,7,3,14,a)+R(20,20,7,2,c)+R(22,22,3,6,b),
 shield:(a,b,c)=>R(7,4,18,20,a)+R(9,6,14,16,b)+R(9,24,14,3,a)+R(12,27,8,2,a)+R(15,6,2,20,c)+R(9,13,14,2,c),
 plate:(a,b,c)=>R(8,5,16,20,a)+R(10,7,12,16,b)+R(6,6,4,6,a)+R(22,6,4,6,a)+R(15,7,2,16,c)+R(10,25,12,3,a),
 cloak:(a,b,c)=>R(9,5,14,4,a)+R(7,9,18,18,a)+R(9,11,14,15,b)+R(15,9,2,18,a)+R(13,6,6,3,c),
 gauntlet:(a,b,c)=>R(9,8,12,14,a)+R(10,4,3,6,b)+R(13,3,3,7,b)+R(16,4,3,6,b)+R(9,22,12,5,c),
 charm:(a,b,c)=>R(15,2,2,7,c)+R(10,9,12,12,a)+R(12,11,8,8,b)+R(14,13,3,3,'#ffffff')+R(14,21,4,6,c),
 coin:(a,b,c)=>R(8,8,16,16,c)+R(10,10,12,12,a)+R(13,12,6,8,b)+R(14,14,2,2,'#ffffff'),
 band:(a,b,c)=>R(8,12,16,8,a)+R(10,14,12,4,b)+R(14,10,4,12,c),
 pouch:(a,b,c)=>R(9,12,14,15,a)+R(11,14,10,11,b)+R(12,8,8,5,c)+R(15,4,2,5,'#7fb85a'),
 feather:(a,b,c)=>R(14,3,4,22,a)+R(11,6,4,16,b)+R(18,8,4,14,b)+R(15,22,2,8,c),
 book:(a,b,c)=>R(7,7,18,18,a)+R(9,9,14,14,b)+R(9,13,14,1,c)+R(9,17,14,1,c),
 horseshoe:(a,b,c)=>R(8,6,4,18,a)+R(20,6,4,18,a)+R(8,22,16,4,a)+R(9,8,2,2,c)+R(21,8,2,2,c)+R(11,23,10,2,b),
 reliquary:(a,b,c)=>R(10,10,12,16,c)+R(12,12,8,12,a)+R(14,4,4,7,b)+R(15,2,2,3,'#fff2b8'),
 ring:(a,b,c)=>R(8,12,16,12,c)+R(11,15,10,6,'#00000000')+R(12,6,8,7,a)+R(14,8,4,3,b),
 epaulette:(a,b,c)=>R(6,10,20,8,a)+R(8,12,16,4,b)+R(6,18,2,8,c)+R(11,18,2,8,c)+R(16,18,2,8,c)+R(21,18,2,8,c),
 seal:(a,b,c)=>R(9,6,14,8,a)+R(13,14,6,6,b)+R(8,20,16,8,c)+R(11,22,10,4,a)
};
const TINT={castletown:['#aebdc6','#5f6f7a','#c9a24a'],velmar:['#9cc77a','#5a6b3a','#e2b24a'],pilgrim:['#e2584a','#efe2c4','#e7c35f'],elite:['#f3cf6c','#8a5a32','#ffffff'],treasure:['#c9a4f0','#6fa04a','#e7c35f']};
const SHAPE_OF={steelGreatsword:'great',knightLance:'lance',ironwoodBow:'bow',plateCuirass:'plate',towerShield:'shield',lancerMail:'plate',steelGauntlets:'gauntlet',runeforgedBlade:'great',
 twinSabers:'twin',repeatingCrossbow:'crossbow',emberRod:'staff',shadowStiletto:'dagger',merchantCoat:'cloak',luckyCoin:'coin',windCharm:'charm',duelistRapier:'sword',
 flameStaff:'staff',pilgrimMace:'mace',pilgrimMantle:'cloak',sanctumTome:'tome',wardenShield:'shield',chrismCharm:'charm',votiveBand:'band',cathedralStaff:'staff',
 crownGuardLance:'lance',crownGuardShield:'shield',leagueSaber:'sword',leagueLongbow:'bow',paladinMace:'mace',flameVestment:'cloak',
 herbPouch:'pouch',hawkFeather:'feather',sageNotebook:'book',windHorseshoe:'horseshoe',twinDaggers:'twin',silenceShield:'shield',mirrorCuirass:'plate',clearCharm:'charm',flameReliquary:'reliquary',manaRing:'ring',lionEpaulette:'epaulette',allianceSeal:'seal',
 royalSaber:'sword',archiveBow:'bow',wardRod:'staff',courtVestment:'cloak',greyMantle:'cloak',oathRing:'ring',archivistLens:'book',mistLantern:'reliquary'};
const ELITE=['crownGuardLance','crownGuardShield','leagueSaber','leagueLongbow','paladinMace','flameVestment','royalSaber','archiveBow','wardRod','courtVestment','greyMantle','oathRing'],HOME_OF=id=>['steelGreatsword','knightLance','ironwoodBow','plateCuirass','towerShield','lancerMail','steelGauntlets','runeforgedBlade'].includes(id)?'castletown':['twinSabers','repeatingCrossbow','emberRod','shadowStiletto','merchantCoat','luckyCoin','windCharm','duelistRapier'].includes(id)?'velmar':'pilgrim';
for(const [id,shape] of Object.entries(SHAPE_OF)){const tint=TINT[ELITE.includes(id)?'elite':SHAPE_OF[id]&&['pouch','feather','book','horseshoe','reliquary','ring','epaulette','seal'].includes(shape)||['twinDaggers','silenceShield','mirrorCuirass','clearCharm'].includes(id)?'treasure':HOME_OF(id)];ART[id]=SHAPE[shape](...tint);}
// Art work pack E (when imported): a painted 128-px icon replaces the temporary SVG of the same id.
const PAINTED_ITEMS=typeof ASHEN_ITEMS!=='undefined'?ASHEN_ITEMS:{};
export const paintedItem=type=>!!PAINTED_ITEMS[type];
// Skills (sheets F–G), statuses and commands (sheet E) have no temporary SVG: without the pack nothing is drawn.
export const paintedIcon=(id,size=24,cls='')=>PAINTED_ITEMS[id]?`<img class="item-icon painted ${cls}" src="${PAINTED_ITEMS[id]}" width="${size}" height="${size}" alt="" aria-hidden="true" decoding="async">`:'';
export function itemIcon(type,size=32){if(PAINTED_ITEMS[type])return `<img class="item-icon painted" src="${PAINTED_ITEMS[type]}" width="${size}" height="${size}" alt="" aria-hidden="true" decoding="async">`;return `<svg class="item-icon" viewBox="0 0 32 32" width="${size}" height="${size}" shape-rendering="crispEdges" aria-hidden="true">${ART[type]||ART.potion}</svg>`;}
