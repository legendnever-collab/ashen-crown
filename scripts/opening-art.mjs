// Bake the existing M01 painting into the offline page. No browser or external art files needed.
import {crc32,deflateSync} from 'node:zlib';
import {missionOf} from '../src/data/missions.js';
import {paintGround,treeSprite,bushSprite,ruinSprite,houseSprite} from '../src/render/hd-art.js';

function pngChunk(type,body){
 const name=Buffer.from(type),size=Buffer.alloc(4),crc=Buffer.alloc(4);
 size.writeUInt32BE(body.length);
 crc.writeUInt32BE(crc32(body,crc32(name)));
 return Buffer.concat([size,name,body,crc]);
}
function pngURL(pix){
 const header=Buffer.alloc(13);
 header.writeUInt32BE(pix.w);header.writeUInt32BE(pix.h,4);
 header[8]=8;header[9]=6; // RGBA, 8 bits per channel
 const stride=1+pix.w*4,rows=Buffer.alloc(stride*pix.h);
 for(let y=0;y<pix.h;y++)for(let x=0;x<pix.w;x++)
  rows.writeUInt32LE(pix.d[y*pix.w+x],y*stride+1+x*4);
 const png=Buffer.concat([Buffer.from('89504e470d0a1a0a','hex'),pngChunk('IHDR',header),
  pngChunk('IDAT',deflateSync(rows,{level:9})),pngChunk('IEND',Buffer.alloc(0))]);
 return 'data:image/png;base64,'+png.toString('base64');
}
export function openingArt(){
 const {pix,objects}=paintGround(missionOf({missionId:1}).map),sprites={};
 function record(key,paint){
  if(sprites[key])return;
  const art=paint();sprites[key]={width:art.w,height:art.h,url:pngURL(art)};
 }
 for(const o of objects){
  if(o.kind==='tree')treeSprite(o.seed%9,Math.round(o.size*20)/20,record);
  if(o.kind==='bush')bushSprite(o.seed%5,record);
  if(o.kind==='ruin')ruinSprite(o.seed%4,record);
  if(o.kind==='house')houseSprite(o.seed%6,o.w,o.h,'intact',record);
 }
 return {ground:pngURL(pix),sprites,objects};
}
