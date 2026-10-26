// B4 rollout: bridges the 48-pixel original art in hd-art.js to the 64-unit world coordinates
// used by every renderer, hit test and camera. Art is pre-scaled ×3 (nearest) once and drawn
// with smoothing so the 4/3 world ratio never produces uneven pixel widths.
import {wagonSprite,outpostSprite,HD_TILE,paintGround,treeSprite,bushSprite,ruinSprite,cragSprite,houseSprite,bridgeSprite,wellSprite,townBuildingSprite,CAST} from './hd-art.js';
import {figureSprite,FIG_FOOT} from './hd-figure.js';
import {appearanceFor} from '../data/appearances.js';
export const HD_K=64/HD_TILE,HD_UP=3;
const hdUpCache=new WeakMap();
export function hdUp(src){let out=hdUpCache.get(src);if(out)return out;out=document.createElement('canvas');out.width=src.width*HD_UP;out.height=src.height*HD_UP;const g=out.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(src,0,0,out.width,out.height);hdUpCache.set(src,out);return out;}
// draw an hd-art canvas at hd-art pixel coordinates (ax,ay) converted to world units
function hdBlit(c,src,wx,wy){const up=hdUp(src),smooth=c.imageSmoothingEnabled;c.imageSmoothingEnabled=true;c.drawImage(up,wx,wy,src.width*HD_K,src.height*HD_K);c.imageSmoothingEnabled=smooth;}

// ---------- terrain ----------
const hdGroundCache=new Map();
// bake(o) → true draws that decor into the ground once (static scenery no actor can stand behind)
export function hdGround(key,map,theme='',bake=null){if(hdGroundCache.has(key))return hdGroundCache.get(key);const {pix,objects}=paintGround(map,{theme}),base=pix.canvas(),kept=[];if(bake){const g=base.getContext('2d');g.imageSmoothingEnabled=false;const baked=objects.filter(o=>bake(o)).sort((a,b)=>(a.key??a.y)-(b.key??b.y));for(const o of baked)drawHDObjectRaw(g,o);for(const o of objects)if(!baked.includes(o))kept.push(o);}else kept.push(...objects);const g={canvas:hdUp(base),objects:kept,width:map[0].length,height:map.length};hdGroundCache.set(key,g);if(hdGroundCache.size>6)hdGroundCache.delete(hdGroundCache.keys().next().value);return g;}
// same decor drawn at native hd-art scale (for baking)
function drawHDObjectRaw(g,o){if(o.kind==='tree'){const size=Math.round(o.size*20)/20,s=treeSprite(o.seed%9,size);g.fillStyle='rgba(20,24,30,.32)';g.beginPath();g.ellipse(o.x,o.y-2,11*size,3.5*size,0,0,Math.PI*2);g.fill();g.drawImage(s,Math.round(o.x-20),Math.round(o.y-s.height+3));}else if(o.kind==='bush'){g.drawImage(bushSprite(o.seed%5),o.x-12,o.y-14);}}
// Ground is resampled once per device scale, so each frame is a 1:1 blit (software renderers
// otherwise filter the whole map every frame).
export function drawHDGround(c,g){const t=c.getTransform(),scale=Math.abs(t.a),w=Math.max(1,Math.round(g.width*64*scale)),h=Math.max(1,Math.round(g.height*64*scale));
 if(!g.device||g.device.width!==w||g.device.height!==h){if(w*h>36e6){const smooth=c.imageSmoothingEnabled;c.imageSmoothingEnabled=true;c.drawImage(g.canvas,0,0,g.width*64,g.height*64);c.imageSmoothingEnabled=smooth;return;}const d=g.device||document.createElement('canvas');d.width=w;d.height=h;const dc=d.getContext('2d');dc.imageSmoothingEnabled=true;dc.imageSmoothingQuality='high';dc.drawImage(g.canvas,0,0,w,h);g.device=d;}
 c.save();c.setTransform(1,0,0,1,Math.round(t.e),Math.round(t.f));c.imageSmoothingEnabled=false;c.drawImage(g.device,0,0);c.restore();}
// world-space sort key (feet / base line) for decor objects
export const hdObjectKey=o=>o.key!=null?o.key*HD_K:o.y*HD_K;
const shadowAt=(c,x,y,w,h)=>{c.fillStyle='rgba(20,24,30,.32)';c.beginPath();c.ellipse(x,y,w,h,0,0,Math.PI*2);c.fill();};
export function drawHDObject(c,o,time=0){const K=HD_K;
 if(o.kind==='tree'){const size=Math.round(o.size*20)/20,s=treeSprite(o.seed%9,size);shadowAt(c,o.x*K,(o.y-2)*K,11*size*K,3.5*size*K);hdBlit(c,s,(o.x-20)*K,(o.y-s.height+3)*K);}
 if(o.kind==='bush'){shadowAt(c,o.x*K,o.y*K,9*K,3*K);hdBlit(c,bushSprite(o.seed%5),(o.x-12)*K,(o.y-14)*K);}
 if(o.kind==='ruin')hdBlit(c,ruinSprite(o.seed%4),o.x*K,(o.y-40)*K);
 if(o.kind==='crag'){shadowAt(c,(o.x+24)*K,(o.y-3)*K,20*K,5*K);hdBlit(c,cragSprite(o.seed%3),o.x*K,(o.y-56)*K);}
 if(o.kind==='bridge')hdBlit(c,bridgeSprite(o.map,o.tx,o.ty),o.x*K,o.y*K);
 if(o.kind==='well')hdBlit(c,wellSprite(),o.x*K,(o.y-48)*K);
 if(o.kind==='outpost'){shadowAt(c,(o.x+24)*K,(o.y-4)*K,20*K,5*K);hdBlit(c,outpostSprite(),o.x*K,(o.y-56)*K);}
 if(o.kind==='house'){const s=houseSprite(o.seed%6,o.w||1,o.h||1,o.state||'intact');c.fillStyle='rgba(20,24,30,.28)';c.fillRect((o.x+6)*K,(o.y-4)*K,(s.width-4)*K,6*K);hdBlit(c,s,o.x*K,(o.y-s.height+2)*K);if(o.state==='burning')hdHouseFire(c,o.x*K,(o.y-s.height+2)*K,s.width*K,(o.w||1),time);}
}
export function hdHouseFire(c,x,y,w,tiles,time){for(let i=0;i<tiles*2;i++){const fx=x+16+i*(w-28)/Math.max(1,tiles*2-1),fy=y+22+(i%2)*10;for(let k=0;k<5;k++){const ph=time/120+k*1.7+i,h=(13+8*Math.sin(ph)),wd=5;c.fillStyle=k%2?'#ffcf6a':'#f07a32';c.fillRect(Math.round(fx-10+k*5),Math.round(fy-h),wd,Math.round(h));}c.fillStyle='#fff2b0';c.fillRect(Math.round(fx-2),Math.round(fy-10),5,6);}
 for(let i=0;i<7;i++){const r=Math.round(5+i*1.8),px=Math.round(x+w/2-6+i*4+Math.sin(i*1.3+time/500)*4),py=Math.round(y-4-i*10-(time/40)%10);c.fillStyle=`rgba(70,66,72,${Math.max(0,.30-i*.035)})`;c.fillRect(px-r,py-r+2,r*2,r*2-4);c.fillRect(px-r+2,py-r,r*2-4,r*2);}}
// M01 layer buildings: one-wide buildings become stacked cottages, wider ones a single house
export function hdLayerBuildings(buildings,stateOf){const out=[];for(const b of buildings){const st=stateOf(b);if(b.w===1){for(let j=0;j<b.h;j++)out.push({kind:'house',x:b.x*HD_TILE,y:(b.y+j+1)*HD_TILE,w:1,h:1,state:j===0?st:st==='burning'?'intact':st,seed:b.x*5+(b.y+j)*11});}else out.push({kind:'house',x:b.x*HD_TILE,y:(b.y+b.h)*HD_TILE,w:b.w,h:b.h,state:st,seed:b.x*5+b.y*11});}return out;}
export const hdCovered=buildings=>{const set=new Set();for(const b of buildings)for(let j=0;j<b.h;j++)for(let i=0;i<b.w;i++)set.add((b.x+i)+','+(b.y+j));return set;};
export function drawTownBuilding(c,b,tone,state){const s=townBuildingSprite(b,tone,state),K=HD_K,x=b.x*64,bottom=(b.y+b.h)*64;c.fillStyle='rgba(12,24,24,.35)';c.beginPath();c.ellipse(x+b.w*32+6,bottom-3,b.w*32+6,10,0,0,Math.PI*2);c.fill();hdBlit(c,s,x,bottom-s.height*K+2*K);
 if(b.label){c.font='bold 11px sans-serif';c.textAlign='center';const tx=x+b.w*32,ty=bottom-s.height*K+28*K;const w=c.measureText(b.label).width+10;c.fillStyle='rgba(30,22,16,.78)';c.fillRect(tx-w/2,ty-11,w,15);c.fillStyle='#f2ddb0';c.fillText(b.label,tx,ty);c.textAlign='left';}}

// ---------- figures ----------
const ENEMY_LOOK={9:{spear:'mercSpear',archer:'archer',assassin:'assassin',captain:'assassin'},7:{bandit:'ironDeserter',archer:'ironArcher',captain:'deserterCaptain'},8:{spear:'mercSpear',archer:'archer',captain:'mercSpear',bandit:'assassin'},6:{bandit:'pursuer',archer:'pursuerArcher',captain:'pursuerCaptain'},5:{lion:'lion',bearer:'bearer',spear:'ironSpear',archer:'ironArcher',cavalry:'cavalry',captain:'lion'},1:{bandit:'bandit',archer:'archer',captain:'captain'},2:{bandit:'deserter',archer:'archer',captain:'deserterCaptain'},3:{bandit:'pursuer',archer:'pursuerArcher',captain:'pursuerCaptain'},4:{bandit:'fortGuard',archer:'fortArcher',captain:'quartermaster'}};
const STAGE_LOOK={oswin:'lordA',brennan:'lordB',councilor:'councillor'};
export function hdCastFor(u,missionId=1){
 if(u.look&&CAST[u.look])return u.look; // v0.6: mission data may name a look (allied escorts, Baldrick, ACT II troops)
 if(STAGE_LOOK[u.id])return STAGE_LOOK[u.id]; // v0.6.1: the M10 lords on the dialogue stage wear their army's look
 if(CAST[u.id]&&u.team!=='enemy'){if((u.classTier||1)>=2&&CAST[`${u.id}_t2`])return `${u.id}_t2`;return u.id==='eric'&&appearanceFor(u)?.tier>=2?'eric_adv':u.id;}
 if(u.team==='commander'||u.id==='aren')return 'aren';
 if(u.id==='advisor')return 'aide';
 if(u.kind==='wagon')return 'wagon';
 if(u.kind==='beacon')return 'beacon';
 if(missionId===6&&u.id==='boss')return 'executor';
 if(missionId===6&&u.team==='enemy'&&/^g\d/.test(u.id))return 'fortGuard';
 if(missionId===6&&u.id==='i1')return 'inspector';
 if(u.team==='civilian'){const n=String(u.name||'');return /Mira|미라/.test(n)?'mira':/Tomas|토마스/.test(n)?'farmer':CAST[u.id]?u.id:'refugee';}
 if(u.burns)return 'torch';
 if(missionId===4&&/^r\d/.test(u.id))return 'storeman';
 return (ENEMY_LOOK[missionId]||ENEMY_LOOK[1])[u.kind]||'bandit';
}
// draws a figure with its feet at world (x, footY); pose 'attack' leans toward the facing.
// Painted map sprites (user-supplied pack, 2026-10-18): one 4×3 sheet per look — rows down/right/up
// (left mirrors right), columns idle / step A / step B / attack-or-action. Anchor (64,120) of a 128 cell
// sits on the unit's feet. Until a sheet has decoded, or for looks without a sheet, the parametric
// pixel figure below is drawn instead.
const SPRITES=typeof ASHEN_SPRITES!=='undefined'?ASHEN_SPRITES:null,spriteImages=new Map();
const SPRITE_ALIAS={captain:'garr',lion:'baldrick',aide:'advisor'};
export const PAINTED_CELL=74;
export const spriteIdFor=castId=>SPRITE_ALIAS[castId]||castId;
let spritesWarm=false;
function loadSheet(id){let img=spriteImages.get(id);if(!img){img=new Image();img.decoding='async';img.onerror=()=>{img.failed=true;};img.src=SPRITES[id];spriteImages.set(id,img);img.decode?.().catch(()=>{});}return img;}
// decode every sheet once up front so no frame pays for a first-time decode mid-animation
export function paintedSheet(castId){const id=spriteIdFor(castId),src=SPRITES?.[id];if(!src||typeof Image==='undefined')return null;if(!spritesWarm){spritesWarm=true;for(const k of Object.keys(SPRITES))loadSheet(k);}const img=loadSheet(id);return img.complete&&img.naturalWidth&&!img.failed?img:null;}
// Walk cycle (2026-10-18 feedback: feet must alternate, not slide). The generated step frames do not
// reliably alternate legs, so for the front and back views the two steps are rebuilt from the idle
// frame: the lower-leg band is split at the figure's centre and one side is stretched down (foot
// forward) while the other is compressed up (foot lifted), then swapped. The side view keeps the
// painted strides. Cycle: step 1 → stand → step 2 → stand.
export function paintedFrame(facing='down',frame=0,pose='idle'){return {row:facing==='up'?2:facing==='down'?0:1,col:pose==='attack'?3:frame?[1,0,2,0][(frame-1)%4]:0,mirror:facing==='left'};}
const walkSheets=new WeakMap();
function cellBox(g,x0,y0,size){const d=g.getImageData(x0,y0,size,size).data;let minX=size,maxX=-1,minY=size,maxY=-1;for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(d[(y*size+x)*4+3]>40){if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;}return maxX<0?null:{minX,maxX,minY,maxY};}
export function walkSheet(img){let out=walkSheets.get(img);if(out)return out;const cell=img.naturalWidth/4;out=document.createElement('canvas');out.width=img.naturalWidth;out.height=img.naturalHeight;const g=out.getContext('2d',{willReadFrequently:true});g.drawImage(img,0,0);
 try{for(const row of [0,2]){const oy=row*cell,b=cellBox(g,0,oy,cell);if(!b)continue;const legH=Math.max(8,Math.round((b.maxY-b.minY)*.26)),cut=b.maxY+1-legH,cx=Math.round((b.minX+b.maxX)/2),amp=Math.max(3,Math.round(cell*.05));
   for(const [col,sign]of [[1,1],[2,-1]]){const ox=col*cell;g.clearRect(ox,oy,cell,cell);g.drawImage(img,0,oy,cell,cut,ox,oy,cell,cut);
    const left=sign>0?legH+amp:legH-2*amp,right=sign>0?legH-2*amp:legH+amp;
    g.drawImage(img,0,oy+cut,cx,legH,ox,oy+cut,cx,Math.min(left,cell-cut-1));g.drawImage(img,cx,oy+cut,cell-cx,legH,ox+cx,oy+cut,cell-cx,Math.min(right,cell-cut-1));}}}
 catch(e){out=img;}
 walkSheets.set(img,out);return out;}
function drawPaintedFigure(c,img,x,footY,{facing,frame,pose,alpha}){const sheet=walkSheet(img),cell=img.naturalWidth/4,{row,col,mirror}=paintedFrame(facing,frame,pose),D=PAINTED_CELL,lean=pose==='attack'?{left:[-4,0],right:[4,0],up:[0,-4],down:[0,3]}[facing]:[0,0];
 c.save();c.globalAlpha*=alpha;c.imageSmoothingEnabled=true;c.imageSmoothingQuality='low';c.translate(x+lean[0],footY+lean[1]);
 if(pose==='death'){c.globalAlpha*=.45;c.translate(0,-8);c.rotate(-Math.PI/2);}if(mirror)c.scale(-1,1);
 c.drawImage(sheet,col*cell,row*cell,cell,cell,-D/2,-D*120/128,D,D);c.restore();}
// scale (v0.6, user feedback 2026-10-25): exploration hubs, rooms and staged dialogue draw figures 1.5× around the foot point; battle stays 1×.
// v0.6 (user feedback 2026-10-25, D-061): the v0.4–v0.6 painted enemy and NPC sheets were drawn shorter than the heroes
// (head-to-foot 84–99 px in a 128 cell vs 98–108 for heroes), so soldiers looked small beside the legion. Each listed
// sheet is drawn larger around its foot point: rank and file to about hero height (104), captains a little taller (110).
export const FIGURE_FIT={executor:1.3,baldrick:1.24,garr:1.22,guard:1.16,ironSpear:1.16,fortGuard:1.14,ironInfantry:1.13,lordA:1.13,lordB:1.13,
 archer:1.12,mercSpear:1.12,fortArcher:1.11,smith:1.11,pursuerCaptain:1.16,bearer:1.08,assassin:1.07,pursuer:1.07,cavalry:1.06,pursuerArcher:1.06,ironDeserter:1.05,deserterCaptain:1.08};
export function drawHDFigure(c,castId,x,footY,{facing='down',frame=0,pose='idle',alpha=1,scale=1,fitted=false}={}){
 const fit=!fitted&&FIGURE_FIT[spriteIdFor(castId)];if(fit&&paintedSheet(castId))scale*=fit;
 if(scale!==1){c.save();c.translate(x,footY);c.scale(scale,scale);c.translate(-x,-footY);drawHDFigure(c,castId,x,footY,{facing,frame,pose,alpha,fitted:true});c.restore();return;}
 const sheet=paintedSheet(castId);if(sheet){drawPaintedFigure(c,sheet,x,footY,{facing,frame,pose,alpha});return;}
 if(castId==='beacon'){drawBeacon(c,x,footY,pose==='death',alpha);return;}
 if(castId==='wagon'){const w=wagonSprite();c.save();c.globalAlpha*=pose==='death'?.4:alpha;hdBlit(c,w,x-24*HD_K,footY-50*HD_K);c.restore();return;}
 const s=figureSprite(castId,{facing,frame}),K=HD_K,lean=pose==='attack'?{left:[-6,0],right:[6,0],up:[0,-6],down:[0,5]}[facing]:[0,0];
 c.save();c.globalAlpha*=alpha;if(pose==='death'){c.globalAlpha*=.45;c.translate(x,footY-8);c.rotate(-Math.PI/2);hdBlit(c,s,-24*K,-FIG_FOOT*K);c.restore();return;}
 hdBlit(c,s,x-24*K+lean[0],footY-FIG_FOOT*K+lean[1]);c.restore();}
export const hdDirection=(dx,dy,fallback='down')=>Math.abs(dx)<.001&&Math.abs(dy)<.001?fallback:Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');

// M06 watchtower beacon (original): stone brazier on a timber stand; the fire animates, a fallen beacon smokes.
function drawBeacon(c,x,footY,dead,alpha=1){const t=performance.now(),K=HD_K;c.save();c.globalAlpha*=alpha;const y=footY,R=(col,a,b,w,h)=>{c.fillStyle=col;c.fillRect(Math.round(x+a*K),Math.round(y+b*K),Math.round(w*K),Math.round(h*K));};
 c.fillStyle='rgba(20,24,30,.32)';c.beginPath();c.ellipse(x,y-2,16*K,4*K,0,0,Math.PI*2);c.fill();
 for(const dx of [-11,8])R('#5a3e28',dx,-30,3,30);R('#6e4c30',-12,-18,24,3);R('#3a281a',-12,-16,24,1);
 R('#6b6d6a',-13,-38,26,9);R('#8c8f8a',-13,-38,26,2);R('#45474a',-13,-31,26,2);R('#5a5c5a',-9,-29,18,2);
 if(dead){for(let i=0;i<5;i++){const py=-44-i*7-(t/60)%7,px=Math.sin(t/500+i)*3;c.fillStyle=`rgba(70,68,72,${.35-i*.06})`;c.beginPath();c.ellipse(x+px*K,y+py*K,(4+i)*K,(3+i*.6)*K,0,0,Math.PI*2);c.fill();}R('#2a2224',-10,-40,20,3);}
 else{for(let i=0;i<6;i++){const ph=t/110+i*1.3,h=9+5*Math.sin(ph);R(i%2?'#ffcf6a':'#f07a32',-10+i*3.4,-38-h,3.4,h);}R('#fff2b0',-3,-46,6,6);c.fillStyle='rgba(255,180,90,.18)';c.beginPath();c.ellipse(x,y-44*K,22*K,14*K,0,0,Math.PI*2);c.fill();}
 c.restore();}

// Lia's war table (the 'advisor' interaction point): a map table with markers and a candle — an object, not a person.
export function drawWarTable(c,x,y,time=0){const R=(col,a,b,w,h)=>{c.fillStyle=col;c.fillRect(Math.round(x+a),Math.round(y+b),w,h);};
 c.fillStyle='rgba(20,24,30,.32)';c.beginPath();c.ellipse(x,y+2,30,7,0,0,Math.PI*2);c.fill();
 for(const dx of [-24,20])R('#4a3324',dx,-18,5,20);R('#6e4c30',-28,-26,56,10);R('#8a6240',-28,-26,56,3);R('#3a281a',-28,-17,56,2);
 R('#e6d6ac',-22,-34,40,12);R('#c9b48a',-22,-24,40,2);R('#7a9a6a',-16,-31,10,5);R('#6a8aa8',-2,-32,8,4);R('#b23a2e',-8,-30,3,3);R('#2f5d8a',6,-28,3,3);R('#e8c56a',-14,-27,3,3);
 R('#d8d0c0',20,-40,4,10);const f=Math.sin(time/140)*1.2;c.fillStyle='#ffcf6a';c.beginPath();c.ellipse(x+22,y-44+f*.3,2.2,4,0,0,Math.PI*2);c.fill();c.fillStyle='rgba(255,200,110,.18)';c.beginPath();c.ellipse(x+22,y-42,12,9,0,0,Math.PI*2);c.fill();}
