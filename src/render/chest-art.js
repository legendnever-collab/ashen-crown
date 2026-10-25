import {pixel,pixelOval} from './art.js';
// v0.6 (D-056): chests that fit their room. A painted chest sheet (src/assets/chests/<style>_<closed|open>.webp,
// 256×256 cells, chest baseline 40 px above the cell bottom) is used when present; otherwise each style is
// drawn here as an original pixel placeholder with its own shape, wood, metal and props.
const CHEST_ART=typeof ASHEN_CHESTS!=='undefined'?ASHEN_CHESTS:null,chestImages=new Map();
function chestImage(key){if(!CHEST_ART?.[key])return null;let img=chestImages.get(key);if(!img){img=new Image();img.src=CHEST_ART[key];chestImages.set(key,img);}return img.complete&&img.naturalWidth?img:null;}
export const paintedChest=style=>!!CHEST_ART?.[`${style}_closed`];

// shape: box (flat lid), dome, crate (planks), long, low, small. wood/lid/band/metal colours, extra(r,open) props.
const CHEST_LOOKS={
 village_chest:{shape:'box',wood:'#a05a3a',lid:'#b56a43',band:'#6b3c26',metal:'#5a5c5e',extra:(r,o)=>{if(!o)for(let i=0;i<3;i++){r('#e3b54a',16+i*12,24,5,5);r('#c8473b',17+i*12,25,3,3);}r('#e3b54a',14,40,36,2);}},
 militia_locker:{shape:'box',wood:'#8a6a44',lid:'#9c7a4f',band:'#5e4630',metal:'#6d6a62',extra:(r,o)=>{r('#c9b07c',8,36,4,8);r('#c9b07c',52,36,4,8);if(!o){r('#6b4b2c',14,13,36,4);r('#4a3626',46,10,6,10);}}},
 grain_bin:{shape:'crate',wood:'#b08d5a',lid:'#c09c66',band:'#7d6340',metal:'#7d6340',extra:(r,o)=>{r('#cdb27a',8,42,18,12);r('#a99060',9,46,16,2);for(let i=0;i<5;i++)r('#e6cf86',20+i*7,52+i%2,6,2);}},
 elder_coffer:{shape:'dome',wood:'#5e3b26',lid:'#6f4630',band:'#c49a46',metal:'#d8b25a',extra:(r)=>{r('#d8b25a',10,26,4,4);r('#d8b25a',50,26,4,4);r('#d8b25a',10,48,4,4);r('#d8b25a',50,48,4,4);}},
 field_locker:{shape:'box',wood:'#4f4a3c',lid:'#5d5746',band:'#3a2f24',metal:'#9a8d6c',extra:(r,o)=>{r('#7a5a34',18,22,4,32);r('#7a5a34',42,22,4,32);r('#c6b27a',17,40,6,4);r('#c6b27a',41,40,6,4);if(!o){r('#7f8a68',12,12,40,7);r('#66704f',12,12,40,2);}}},
 medic_chest:{shape:'box',wood:'#cdbf9e',lid:'#ddd0ae',band:'#f2ece0',metal:'#b3a888',extra:(r,o)=>{r('#f4efe4',8,34,48,6);r('#b8473d',29,30,6,14);if(!o){r('#6f9a58',12,16,10,6);r('#86b26a',14,14,6,3);}}},
 supply_crate:{shape:'crate',wood:'#c6a46c',lid:'#d4b47c',band:'#8c6d43',metal:'#5b5048',extra:(r)=>{r('#8c6d43',8,30,48,3);r('#d9c08a',6,36,4,8);r('#d9c08a',54,36,4,8);}},
 officer_strongbox:{shape:'small',wood:'#2f3236',lid:'#3b3f45',band:'#1d1f22',metal:'#8f949a',extra:(r,o)=>{if(!o){r('#9c9fa4',28,38,8,10);r('#c43c32',34,46,8,6);r('#7a2a24',38,50,2,6);}}},
 document_coffer:{shape:'box',wood:'#6b4a32',lid:'#7b5538',band:'#4b3322',metal:'#c9a24a',extra:(r,o)=>{r('#c9a24a',20,38,6,6);r('#c9a24a',38,38,6,6);if(!o){r('#e2d3ad',10,12,30,6);r('#c6b48c',10,12,4,6);r('#e2d3ad',26,9,26,5);}}},
 armory_chest:{shape:'long',wood:'#6a4a30',lid:'#77543a',band:'#2e2f31',metal:'#686b6e',extra:(r)=>{for(let i=0;i<5;i++)r('#9a9da0',6+i*12,30,3,3);r('#3d3f42',0,38,4,10);r('#3d3f42',60,38,4,10);}},
 fort_locker:{shape:'box',wood:'#3f2f24',lid:'#4b3a2c',band:'#25201c',metal:'#7d7f80',extra:(r)=>{for(let i=0;i<4;i++){r('#a0a2a3',12+i*12,26,3,3);r('#a0a2a3',12+i*12,46,3,3);}}},
 old_chest:{shape:'dome',wood:'#7a4b26',lid:'#9a6334',band:'#5a3518',metal:'#c9a24a',extra:()=>{}},
 frost_chest:{shape:'box',wood:'#6a5a4a',lid:'#7b6a58',band:'#3f4448',metal:'#a9b4ba',extra:(r,o)=>{if(!o){r('#d7d2c8',8,12,48,8);r('#bdb6aa',10,18,44,3);}for(let i=0;i<6;i++)r('#eef6fb',8+i*9,20+(i%3)*14,3,2);}},
 fur_trunk:{shape:'dome',wood:'#8c8378',lid:'#9d958a',band:'#4a3a2c',metal:'#7f7a72',extra:(r)=>{for(let i=0;i<6;i++)r('#b8b0a4',8+i*8,22+(i%2)*3,5,8);}},
 sled_crate:{shape:'low',wood:'#8a7258',lid:'#9b8264',band:'#5d4a38',metal:'#7c858a',extra:(r)=>{r('#5d4a38',2,56,60,3);r('#5d4a38',2,50,3,8);r('#5d4a38',59,50,3,8);r('#eef4f7',12,30,40,2);}},
 iron_lockbox:{shape:'small',wood:'#24272b',lid:'#30343a',band:'#4f6b84',metal:'#8f9aa3',extra:(r,o)=>{if(!o)r('#8f9aa3',27,38,10,12);}},
 sea_chest:{shape:'box',wood:'#3a2e26',lid:'#46382e',band:'#2a201a',metal:'#c49a46',extra:(r)=>{r('#c49a46',8,20,6,6);r('#c49a46',50,20,6,6);r('#d9c79a',2,36,6,3);r('#d9c79a',56,36,6,3);}},
 merchant_coffer:{shape:'dome',wood:'#2f5a46',lid:'#376a52',band:'#c9a24a',metal:'#e2c06a',extra:(r)=>{r('#e2c06a',10,54,6,4);r('#e2c06a',48,54,6,4);}},
 cargo_crate:{shape:'crate',wood:'#b9935c',lid:'#c7a26a',band:'#7e6242',metal:'#5a4e44',extra:(r)=>{r('#3f7f8f',8,40,48,5);for(let i=0;i<4;i++)r('#a99b7c',10+i*12,22,1,30);r('#a99b7c',8,32,48,1);}},
 council_strongbox:{shape:'box',wood:'#c9b48e',lid:'#d8c49e',band:'#9ea4aa',metal:'#c8ced3',extra:(r,o)=>{if(!o)for(let i=0;i<3;i++){r('#7d848a',18+i*11,38,6,8);r(['#3f7f8f','#b8473d','#c9a24a'][i],19+i*11,40,4,2);}}}
};

// Draws a chest occupying the 64-px tile whose top-left is (x, y).
export function drawChest(c,x,y,style,state='closed'){
 const open=state==='open',img=chestImage(`${style}_${open?'open':'closed'}`);
 // Painted cells are drawn 1.2× a tile wide (the chest itself is about 0.85 tile), centred, resting on the tile's bottom edge.
 if(img){const w=77,h=w*img.naturalHeight/img.naturalWidth;c.drawImage(img,x+32-w/2,y+64-h*216/256,w,h);return;}
 const s=CHEST_LOOKS[style]||CHEST_LOOKS.old_chest,r=(col,a,d,w,h)=>pixel(c,col,x+a,y+d,w,h);
 const sh=s.shape,top=sh==='low'?30:sh==='small'?24:sh==='long'?22:18,left=sh==='small'?14:sh==='long'?2:8,w=64-left*2,bottom=sh==='low'?54:56;
 pixelOval(c,'rgba(12,24,24,.35)',x+32,y+bottom,w/2+4,5);
 if(open){
  r(s.lid,left,top-12,w,10);r(s.band,left,top-3,w,3);
  r(s.wood,left,top,w,bottom-top);r('#20160f',left+4,top+2,w-8,10);r(s.band,left,top,w,2);
 }else{
  r(s.wood,left,top+8,w,bottom-top-8);
  if(sh==='dome'){r(s.lid,left+3,top-2,w-6,4);r(s.lid,left+1,top+2,w-2,10);}else r(s.lid,left,top,w,12);
  r(s.band,left,top+11,w,3);
  if(sh==='crate'){for(let i=left+12;i<left+w-4;i+=12)r(s.band,i,top+14,2,bottom-top-14);}
  r(s.metal,left+w/2-4,top+8,8,10);r('#fff0b0',left+w/2-1,top+12,2,3);
 }
 r(s.band,left,bottom-4,w,4);r(s.band,left,top+(open?0:2),3,bottom-top-(open?0:2));r(s.band,left+w-3,top+(open?0:2),3,bottom-top-(open?0:2));
 s.extra(r,open);
}
