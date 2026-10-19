import {drawWarTable} from './hd-world.js';
import {HUBS} from '../data/frontier-data.js';
import {explorationHero,currentHub,chestKey,exitDoor} from '../core/frontier.js';
import {drawTile,drawSprite,pixel} from './art.js';
import {drawBuilding,drawFire} from './world-art.js';
import {MapCamera,drawMinimap} from './camera.js';
import {hdGround,drawHDGround,drawHDObject,hdObjectKey,drawTownBuilding,drawHDFigure,hdCastFor,hdDirection} from './hd-world.js';
const TOWN_TYPES=new Set(['forge','shop','inn','warroom','residence','depot']);
export const hubCamera=new MapCamera();
let hubTerrainCache=null;
// v0.5 painted hubs (D-052): one WebP per hub, decoded once; the mask doubles as the minimap terrain.
const HUB_ART=typeof ASHEN_HUBS!=='undefined'?ASHEN_HUBS:null,hubImages=new Map();
export function hubArt(id){if(!HUB_ART?.[id])return null;let img=hubImages.get(id);if(!img){img=new Image();img.src=HUB_ART[id];hubImages.set(id,img);}return img.complete&&img.naturalWidth?img:null;}
function drawHubLights(c,h,time){if(!h.lights?.length)return;c.save();c.globalCompositeOperation='lighter';for(const [x,y,r,kind] of h.lights){const flick=kind==='fire'?.82+.18*Math.sin(time/90+x)*Math.sin(time/37+y):.9+.1*Math.sin(time/400+x),g=c.createRadialGradient(x,y,0,x,y,r*flick);const a=(kind==='fire'?.22:.14)*(h.night?1.25:1);g.addColorStop(0,`rgba(255,170,80,${a})`);g.addColorStop(1,'rgba(255,140,60,0)');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}c.restore();}
export function hubTerrain(h){if(h.mask)return h.mask.map(r=>[...r].map(ch=>ch==='.'?'r':'x'));return Array.from({length:h.height},(_,y)=>Array.from({length:h.width},(_,x)=>h.tone==='interior'?'r':x===0||y===0||x===h.width-1||y===h.height-1?'f':x===7||y===4||y===7||y===11?'r':'g'));}
// staged dialogue: fill the stage (cover) and frame the speaking cast above the dialogue window
function stageCamera(line,width,height,h){const n=(line.actors||['aren',line.speaker]).filter((id,i,a)=>a.indexOf(id)===i).length,mw=h.width*64,mh=h.height*64,scale=Math.max(width/mw,height/mh),fx=(h.stage?.x??220)+75*(n-1)/2,fy=(h.stage?.y??424)+16,clamp=(v,lo)=>Math.min(0,Math.max(lo,v));return {x:clamp(width/2-fx*scale,width-mw*scale),y:clamp(height*.42-fy*scale,height-mh*scale),scale};}
export function drawHub(canvas,s,{line=null,time=performance.now()}={}){
 const c=canvas.getContext('2d'),f=s.frontier,h=line?HUBS[line.stage]:currentHub(s),box=canvas.getBoundingClientRect(),width=Math.max(1,box.width||1024),height=Math.max(1,box.height||768),resolution=width<600?Math.max(1,window.devicePixelRatio||1):Math.max(2.1,window.devicePixelRatio||1);
 if(canvas.width!==Math.round(width*resolution)||canvas.height!==Math.round(height*resolution)){canvas.width=Math.round(width*resolution);canvas.height=Math.round(height*resolution);}c.setTransform(resolution,0,0,resolution,0,0);c.imageSmoothingEnabled=false;pixel(c,'#172c31',0,0,width,height);
 const camera=line?stageCamera(line,width,height,h):hubCamera.layout(width,height,h.width,h.height,{follow:{x:f.x,y:f.y},key:`${f.hub}:${f.interior||'outside'}`});
 c.translate(camera.x,camera.y);c.scale(camera.scale,camera.scale);
 const art=h.art?hubArt(h.art):null,painted=!!h.art;
 const map=hubTerrain(h),hd=painted?{objects:[]}:hdGround(`hub:${h.name}:${h.width}x${h.height}:${h.tone}`,h.tone==='interior'?map.map(r=>r.map(()=>'p')):map,'',o=>{const tx=Math.floor(o.x/48),ty=Math.floor((o.y-1)/48);return (o.kind==='tree'||o.kind==='bush')&&(tx<=0||ty<=0||tx>=h.width-1||ty>=h.height-1);});if(painted){if(art)c.drawImage(art,0,0,h.width*64,h.height*64);else pixel(c,'#2a3328',0,0,h.width*64,h.height*64);}else drawHDGround(c,hd);
 if(h.tone==='interior'){for(let y=0;y<h.height;y++){pixel(c,'#4a4140',0,y*64,64,64);pixel(c,'#4a4140',(h.width-1)*64,y*64,64,64);}pixel(c,'#473d3a',0,0,h.width*64,64);pixel(c,'#c4aa7f',64,62,(h.width-2)*64,3);const door=exitDoor(h);for(let x=0;x<h.width;x++)if(x!==door.x)pixel(c,'#4a4140',x*64,(h.height-1)*64,64,64);pixel(c,'#5d4a36',door.x*64,(h.height-1)*64,64,64);pixel(c,'#2b221b',door.x*64+6,(h.height-1)*64+4,52,60);pixel(c,'#e9d29a',door.x*64+10,(h.height-1)*64+8,44,6);pixel(c,'#a0453a',door.x*64+8,(h.height-1)*64-10,48,10);c.fillStyle='#f3e1b2';c.font='bold 12px sans-serif';c.textAlign='center';c.fillText('출구 ↓',door.x*64+32,(h.height-1)*64+38);c.textAlign='left';}
 const burned=!!s.campaign.flags.mission_01_completed;
 const opened=new Set(s.economy?.chests||[]),buildingState=b=>b.type==='chest'?(opened.has(chestKey(s,b.chestId))?'open':'closed'):burned&&f.hub==='village'&&b.type==='residence'?'burned':line&&s.narrative.active?.key==='raid'&&b.type==='residence'?'burning':'intact';const drawB=b=>TOWN_TYPES.has(b.type)&&h.tone!=='interior'?drawTownBuilding(c,b,h.tone,buildingState(b)):drawBuilding(c,b,time,buildingState(b));
 if(line&&!painted){for(const o of hd.objects)drawHDObject(c,o,time);for(const b of h.buildings)drawB(b);}
 if(painted)drawHubLights(c,h,time);else if(h.tone==='camp')drawFire(c,7*64,6*64,time,.65);
 if(line){const cast=(line.actors||['aren',line.speaker]).filter((id,i,a)=>a.indexOf(id)===i);const sx=h.stage?.x??220,sy=h.stage?.y??424;cast.forEach((id,i)=>{const actor=s.units.find(u=>u.id===id)||{id,team:id==='aren'?'commander':'civilian'};drawHDFigure(c,hdCastFor(actor),sx+i*75,sy+i%2*30,{facing:'down'});if(id===line.speaker)pixel(c,'#f5d594',sx-4+i*75,sy-82+i%2*30,8,8);});}
 else{const near=n=>Math.abs(n.x-f.x)+Math.abs(n.y-f.y)<=1,talking=n=>s.narrative.active?.key.startsWith('npc:')&&s.narrative.active.key.endsWith(`:${n.id}`);
  const items=[...hd.objects.map(o=>({y:hdObjectKey(o),draw:()=>drawHDObject(c,o,time)})),...(painted?[]:h.buildings.map(b=>({y:(b.y+b.h)*64-2,draw:()=>drawB(b)}))),...h.npcs.map((n,k)=>({y:(n.y+1)*64,draw:()=>{if(n.kind==='advisor'){if(!h.paintedTable)drawWarTable(c,n.x*64+32,n.y*64+58,time);if(near(n)||talking(n))pixel(c,'#f0d291',n.x*64+28,n.y*64-6,8,8);return;}const still=near(n)||talking(n),t=time/1700+k*1.7+n.x,dx=still?0:Math.round(Math.sin(t)*9),moving=!still&&Math.abs(Math.cos(t))>.3,actor=s.units.find(u=>u.id===n.id)||{...n,team:'civilian'},x=n.x*64+32+dx,y=n.y*64+36;
    const facing=still?hdDirection(f.x-n.x,f.y-n.y,'down'):moving?(Math.cos(t)>0?'right':'left'):'down';
    c.fillStyle='rgba(20,24,30,.3)';c.beginPath();c.ellipse(x,y+23,13,4,0,0,Math.PI*2);c.fill();drawHDFigure(c,hdCastFor(actor),x,y+24,{facing,frame:moving?1+Math.floor(time/260)%4:0});if(near(n)||talking(n))pixel(c,'#f0d291',n.x*64+28,n.y*64-30,8,8);}})),
   {y:(f.y+1)*64+1,draw:()=>{const hero=explorationHero(s),px=f.x*64+32,py=f.y*64+36-(s.doorStep?26:0);c.fillStyle='rgba(20,24,30,.3)';c.beginPath();c.ellipse(px,py+23,13,4,0,0,Math.PI*2);c.fill();drawHDFigure(c,hdCastFor(hero),px,py+24,{facing:f.facing||'down',frame:s.walking?1+Math.floor(time/110)%4:0});pixel(c,'#e4c580',px-20,py+29,40,2);}}];
  for(const it of items.sort((a,b)=>a.y-b.y))it.draw();}
 if(!line&&new URLSearchParams(location.search).get('debugMap')==='1'){
 c.save();c.lineWidth=1;c.strokeStyle='#91bcc055';for(let x=0;x<h.width;x++)for(let y=0;y<h.height;y++)c.strokeRect(x*64,y*64,64,64);
 if(h.mask)for(let y=0;y<h.height;y++)for(let x=0;x<h.width;x++)if(h.mask[y][x]==='#'){c.fillStyle='#f1696c33';c.fillRect(x*64,y*64,64,64);}
 for(const b of h.buildings){c.strokeStyle='#f1696c';c.strokeRect(b.x*64,b.y*64,b.w*64,b.h*64);if(b.entrance){const e=b.entrance;c.strokeStyle='#ffda71';c.strokeRect(e.tileX*64,e.tileY*64,64,64);c.strokeStyle='#71efb9';c.strokeRect(e.tileX*64,(e.tileY+1)*64,64,64);c.fillStyle='#ffda71';c.font='12px monospace';c.fillText(`${b.buildingId}: solid / front only`,e.tileX*64-42,e.tileY*64-8);}}
 c.restore();
 }
 const mini=document.querySelector('#hub-minimap');if(!line&&mini)drawMinimap(mini,map,[{id:'eric',x:f.x,y:f.y,team:'ally'},...h.npcs.map(n=>({...n,team:'civilian'}))],camera,h.places);
 canvas.dataset.backingPixels=String(canvas.width*canvas.height);canvas.dataset.mapSize=`${h.width}×${h.height}`;
}
// Distinct villager silhouettes (original): elder's staff, guard's spear, merchant's hat, smith's apron, refugee bundle.
function drawNPCProp(c,n,x,y){const r=(col,a,b,w,h)=>pixel(c,col,x+a,y+b,w,h);
 if(n.id==='elder'){r('#7a5a3a',18,-26,3,52);r('#d9d2c0',-9,-33,18,5);r('#cfc8b6',-6,-12,12,8);}
 else if(n.id==='guard'){r('#8a6a45',20,-44,2,70);r('#d6dde0',18,-50,6,8);r('#4f6b84',-12,-36,24,8);}
 else if(n.id==='merchant'){r('#3e6a50',-16,-38,32,5);r('#4f8460',-10,-46,20,9);r('#c9a24a',-10,-40,20,2);}
 else if(n.id==='smith'){r('#3b2f2a',-10,-6,20,22);r('#5a4a40',-8,-4,16,2);}
 else if(n.id==='refugee'){r('#8b8f87',-14,-30,28,10);r('#6f6e66',12,0,12,14);r('#c9b48a',13,2,10,3);}}
