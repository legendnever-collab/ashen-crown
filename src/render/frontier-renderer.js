import {HUBS} from '../data/frontier-data.js';
import {explorationHero,currentHub,chestKey} from '../core/frontier.js';
import {drawTile,drawSprite,pixel} from './art.js';
import {drawBuilding,drawFire} from './world-art.js';
import {MapCamera,drawMinimap} from './camera.js';
export const hubCamera=new MapCamera();
let hubTerrainCache=null;
export function hubTerrain(h){return Array.from({length:h.height},(_,y)=>Array.from({length:h.width},(_,x)=>h.tone==='interior'?'r':x===0||y===0||x===h.width-1||y===h.height-1?'f':x===7||y===4||y===7||y===11?'r':'g'));}
export function drawHub(canvas,s,{line=null,time=performance.now()}={}){
 const c=canvas.getContext('2d'),f=s.frontier,h=line?HUBS[line.stage]:currentHub(s),box=canvas.getBoundingClientRect(),width=Math.max(1,box.width||1024),height=Math.max(1,box.height||768),resolution=width<600?Math.max(1,window.devicePixelRatio||1):Math.max(2.1,window.devicePixelRatio||1);
 if(canvas.width!==Math.round(width*resolution)||canvas.height!==Math.round(height*resolution)){canvas.width=Math.round(width*resolution);canvas.height=Math.round(height*resolution);}c.setTransform(resolution,0,0,resolution,0,0);c.imageSmoothingEnabled=false;pixel(c,'#172c31',0,0,width,height);
 const camera=line?{x:0,y:0,scale:Math.min(width/h.width/64,height/h.height/64)}:hubCamera.layout(width,height,h.width,h.height,{follow:{x:f.x,y:f.y},key:`${f.hub}:${f.interior||'outside'}`});
 c.translate(camera.x,camera.y);c.scale(camera.scale,camera.scale);
 const map=hubTerrain(h);if(hubTerrainCache?.hub!==h){const image=document.createElement('canvas');image.width=h.width*128;image.height=h.height*128;const tc=image.getContext('2d');tc.scale(2,2);for(let y=0;y<h.height;y++)for(let x=0;x<h.width;x++)drawTile(tc,map[y][x],x*64,y*64,y*h.width+x);hubTerrainCache={hub:h,image};}c.drawImage(hubTerrainCache.image,0,0,h.width*64,h.height*64);
 if(h.tone==='interior'){for(let y=0;y<h.height;y++){pixel(c,'#4a4140',0,y*64,64,64);pixel(c,'#4a4140',(h.width-1)*64,y*64,64,64);}pixel(c,'#473d3a',0,0,h.width*64,64);pixel(c,'#c4aa7f',64,62,(h.width-2)*64,3);const e=h.places[0];pixel(c,'#cab78b',e.x*64+12,e.y*64+7,40,49);pixel(c,'#8b7460',e.x*64+18,e.y*64+12,28,39);c.fillStyle='#f3e1b2';c.font='bold 11px monospace';c.fillText('EXIT',e.x*64+18,e.y*64+39);}
 const burned=!!s.campaign.flags.mission_01_completed;
 const opened=new Set(s.economy?.chests||[]);for(const b of h.buildings)drawBuilding(c,b,time,b.type==='chest'?(opened.has(chestKey(s,b.chestId))?'open':'closed'):burned&&f.hub==='village'&&b.type==='residence'?'burned':line&&s.narrative.active?.key==='raid'&&b.type==='residence'?'burning':'intact');
 if(h.tone==='camp')drawFire(c,7*64,6*64,time,.65);
 if(line){const cast=(line.actors||['aren',line.speaker]).filter((id,i,a)=>a.indexOf(id)===i);cast.forEach((id,i)=>{const actor=s.units.find(u=>u.id===id)||{id,team:id==='aren'?'commander':'civilian'};drawSprite(c,actor,220+i*75,400+i%2*30,time);if(id===line.speaker)pixel(c,'#f5d594',216+i*75,342+i%2*30,8,8);});}
 else{for(const n of h.npcs){drawSprite(c,s.units.find(u=>u.id===n.id)||{...n,team:'civilian'},n.x*64+32,n.y*64+36,time);if(Math.abs(n.x-f.x)+Math.abs(n.y-f.y)<=1||s.narrative.active?.key.startsWith('npc:')&&s.narrative.active.key.endsWith(`:${n.id}`)){pixel(c,'#f0d291',n.x*64+28,n.y*64-12,8,8);}}
 const hero={...explorationHero(s),facing:f.facing},px=f.x*64+32,py=f.y*64+36-(s.doorStep?26:0);c.save();if(f.facing==='left'){c.translate(px,0);c.scale(-1,1);drawSprite(c,hero,0,py,time,s.walking?'walk':'idle');}else drawSprite(c,hero,px,py,time,s.walking?'walk':'idle');c.restore();pixel(c,'#e4c580',px-20,py+29,40,2);}
 if(!line&&new URLSearchParams(location.search).get('debugMap')==='1'){
 c.save();c.lineWidth=1;c.strokeStyle='#91bcc055';for(let x=0;x<h.width;x++)for(let y=0;y<h.height;y++)c.strokeRect(x*64,y*64,64,64);
 for(const b of h.buildings){c.strokeStyle='#f1696c';c.strokeRect(b.x*64,b.y*64,b.w*64,b.h*64);if(b.entrance){const e=b.entrance;c.strokeStyle='#ffda71';c.strokeRect(e.tileX*64,e.tileY*64,64,64);c.strokeStyle='#71efb9';c.strokeRect(e.tileX*64,(e.tileY+1)*64,64,64);c.fillStyle='#ffda71';c.font='12px monospace';c.fillText(`${b.buildingId}: solid / front only`,e.tileX*64-42,e.tileY*64-8);}}
 c.restore();
 }
 const mini=document.querySelector('#hub-minimap');if(!line&&mini)drawMinimap(mini,map,[{id:'eric',x:f.x,y:f.y,team:'ally'},...h.npcs.map(n=>({...n,team:'civilian'}))],camera,h.places);
 canvas.dataset.backingPixels=String(canvas.width*canvas.height);canvas.dataset.mapSize=`${h.width}×${h.height}`;
}
