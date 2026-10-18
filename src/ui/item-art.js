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
 gold:R(6,16,20,8,'#b8862f')+R(8,12,16,6,'#e2b24a')+R(10,9,12,5,'#f3cf6c')+R(12,10,4,2,'#fff2b8')
};
export function itemIcon(type,size=32){return `<svg class="item-icon" viewBox="0 0 32 32" width="${size}" height="${size}" shape-rendering="crispEdges" aria-hidden="true">${ART[type]||ART.potion}</svg>`;}
