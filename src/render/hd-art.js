// B4 graphics sample (v0.4, PROPOSED — not wired into the game until approved).
// Original pixel art painted at 48 logical pixels per tile: per-pixel shading ramps with
// ordered dithering, coloured outlines, organic terrain edges and hand-built figures.
// Nothing here is traced or copied from any existing game.
export const HD_TILE=48;

// ---------- colour helpers ----------
const hex=h=>{const n=parseInt(h.slice(1),16);return [n>>16&255,n>>8&255,n&255];};
const pack=([r,g,b],a=255)=>((a<<24)|(b<<16)|(g<<8)|r)>>>0;
const mixRGB=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
const SHADOW=hex('#2b2148'),LIGHT=hex('#fff0c0');
// five-step ramp from one base colour: deep shadow → shadow → base → light → highlight,
// hue-shifted toward violet in shadow and warm yellow in light (classic pixel-art ramp).
export function ramp(h){const c=hex(h);return [mixRGB(c,SHADOW,.55),mixRGB(c,SHADOW,.28),c,mixRGB(c,LIGHT,.22),mixRGB(c,LIGHT,.45)].map(v=>pack(v));}
export const col=h=>pack(hex(h));
const BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v=>(v+.5)/16);
const dither=(x,y,v)=>v>BAYER[(y&3)*4+(x&3)];
// deterministic hashing / value noise for seamless terrain
const hash=(x,y,s=0)=>{let h=(x*374761393+y*668265263+s*1442695041)|0;h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967296;};
const smooth=t=>t*t*(3-2*t);
export function noise(x,y,scale,s=0){const gx=x/scale,gy=y/scale,x0=Math.floor(gx),y0=Math.floor(gy),fx=smooth(gx-x0),fy=smooth(gy-y0);const a=hash(x0,y0,s),b=hash(x0+1,y0,s),c=hash(x0,y0+1,s),d=hash(x0+1,y0+1,s);return a+(b-a)*fx+(c-a)*fy+(a-b-c+d)*fx*fy;}

// ---------- pixel buffer ----------
export class Pix{
 constructor(w,h){this.w=w;this.h=h;this.d=new Uint32Array(w*h);}
 get(x,y){return x<0||y<0||x>=this.w||y>=this.h?0:this.d[y*this.w+x];}
 set(x,y,c){x=Math.floor(x);y=Math.floor(y);if(c&&x>=0&&y>=0&&x<this.w&&y<this.h)this.d[y*this.w+x]=c;}
 rect(x,y,w,h,c){for(let j=0;j<h;j++)for(let i=0;i<w;i++)this.set(x+i,y+j,c);}
 // shaded box: light from upper-left
 box(x,y,w,h,r,{edge=true}={}){for(let j=0;j<h;j++)for(let i=0;i<w;i++){let t=2;if(edge){if(i===0||j===0)t=3;if(i>=w-2&&w>3)t=1;if(j===h-1&&h>2)t=1;if(i===w-1&&j===h-1)t=0;}this.set(x+i,y+j,r[t]);}}
 // shaded ellipse with dithered lighting; r = 5-step ramp
 ball(cx,cy,rx,ry,r,{bias=0,flat=0,hi=true,maxY=1e9,clean=false}={}){const L=[-.5,-.62,.6],n=Math.hypot(...L);for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++){const dx=(x+.5-cx)/rx,dy=(y+.5-cy)/ry,d=dx*dx+dy*dy;if(d>1||y>maxY)continue;const nz=Math.sqrt(1-d);let l=(dx*L[0]+dy*L[1]+nz*L[2])/n;l=l*(1-flat)+flat*.5+bias;let v=(l+.15)*3.1;const base=Math.floor(v),f=v-base;let t=Math.max(0,Math.min(hi?4:3,base+(clean?(f>.5?1:0):(dither(x,y,f)?1:0))));this.set(x,y,r[t]);}}
 fillEllipse(cx,cy,rx,ry,c){for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++){const dx=(x+.5-cx)/rx,dy=(y+.5-cy)/ry;if(dx*dx+dy*dy<=1)this.set(x,y,c);}}
 poly(pts,c){const ys=pts.map(p=>p[1]),y0=Math.floor(Math.min(...ys)),y1=Math.ceil(Math.max(...ys));for(let y=y0;y<=y1;y++){const xs=[];for(let i=0;i<pts.length;i++){const [ax,ay]=pts[i],[bx,by]=pts[(i+1)%pts.length];if((ay<=y+.5&&by>y+.5)||(by<=y+.5&&ay>y+.5))xs.push(ax+(y+.5-ay)/(by-ay)*(bx-ax));}xs.sort((a,b)=>a-b);for(let k=0;k+1<xs.length;k+=2)for(let x=Math.round(xs[k]);x<Math.round(xs[k+1]);x++)this.set(x,y,c);}}
 line(x0,y0,x1,y1,c){x0|=0;y0|=0;x1|=0;y1|=0;const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;for(;;){this.set(x0,y0,c);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}}
 // coloured outline: transparent pixels touching the figure take a deep version of the neighbour
 outline(dark=col('#1a1622'),{diag=false}={}){const add=[];for(let y=0;y<this.h;y++)for(let x=0;x<this.w;x++){if(this.get(x,y))continue;const n=[[1,0],[-1,0],[0,1],[0,-1],...(diag?[[1,1],[-1,1],[1,-1],[-1,-1]]:[])].map(([a,b])=>this.get(x+a,y+b)).find(v=>v&&v!==dark);if(n){const r=n&255,g=n>>8&255,b=n>>16&255,d=hex('#1a1622');add.push([x,y,pack(mixRGB([r,g,b],d,.78))]);}}for(const [x,y,c]of add)this.set(x,y,c);return this;}
 blit(src,ox,oy){for(let y=0;y<src.h;y++)for(let x=0;x<src.w;x++){const v=src.d[y*src.w+x];if(v)this.set(ox+x,oy+y,v);}}
 canvas(){const c=document.createElement('canvas');c.width=this.w;c.height=this.h;const g=c.getContext('2d'),img=g.createImageData(this.w,this.h);new Uint32Array(img.data.buffer).set(this.d);g.putImageData(img,0,0);return c;}
}

// ---------- terrain palettes ----------
const GRASS=['#43623a','#527440','#5f8445','#6d924c','#8cad5c'].map(col);
const DIRT=['#6e5638','#86694a','#9e8058','#b7996b','#cdb283'].map(col);
const SAND=['#a58a5a','#bba06a','#cdb27a','#dcc48e','#ebd8a6'].map(col);
const WATER=['#1f3f5c','#2a5674','#346c8a','#4f8ca3','#8cc2c9'].map(col);
// v0.6 ACT II snow and ice (M07–M08). Only maps that contain snow use them; ACT I ground is unchanged.
const SNOW=['#9fb0bd','#bccad4','#d6e0e7','#e7eef2','#f6f9fb'].map(col),ICE=['#6f98ae','#88afc3','#a3c4d4','#c0dae4','#e3f1f6'].map(col);
const STONE=ramp('#8a8778'),MOSS=ramp('#5d7a43'),WOOD=ramp('#8a6040'),PLASTER=ramp('#dccaa0'),ROOF=ramp('#a3593b'),THATCH=ramp('#b98d4f');
const LEAF=['#1d3528','#284a33','#36623d','#4e8248','#71a455'].map(col);
const FLAG=ramp('#a29a86'),PLANK=ramp('#8a6442'),WALLR=ramp('#6e6a60');
const COBBLE=['#5e594c','#978f7a','#a49c86','#b3ab93'].map(col);

const tileAt=(map,x,y)=>map[y]?.[x];
const isLike=(t,set)=>t!==undefined&&set.includes(t);
// ground layer for one tile into a Pix covering the whole map (global coords keep noise seamless)
function groundPixel(kind,gx,gy){
 if(kind==='grass'){const n=noise(gx,gy,22,1)*.75+noise(gx,gy,6,2)*.25;let t=2;if(n<.3)t=dither(gx,gy,(.3-n)*6)?1:2;else if(n>.66)t=dither(gx,gy,(n-.66)*6)?3:2;return GRASS[t];}
 if(kind==='dirt'){const n=noise(gx,gy,14,3)*.7+noise(gx,gy,4,4)*.3;let t=2;if(n<.32)t=dither(gx,gy,(.32-n)*7)?1:2;else if(n>.68)t=dither(gx,gy,(n-.68)*7)?3:2;return DIRT[t];}
 if(kind==='sand'){const w=Math.sin((gx*.35+gy*.9+noise(gx,gy,18,5)*9))*.5+.5;return SAND[w<.18?1:w>.85?3:2];}
 if(kind==='water'){const n=noise(gx,gy,26,6)*.7+noise(gx*.6,gy*2,8,8)*.3;let t=2;if(n<.34)t=dither(gx,gy,(.34-n)*6)?1:2;return WATER[t];}
 if(kind==='swamp'){const n=noise(gx,gy,12,7);return n<.38?(dither(gx,gy,(.38-n)*4)?col('#35524f'):col('#3f5d55')):n<.72?col('#4f6a4a'):col('#5b7550');}
 if(kind==='flag'){return FLAG[2];}
 if(kind==='plank'){const row=Math.floor(gy/8),seam=gy%8===7,joint=(gx+row*29)%41===0;const n=noise(gx,gy*.25,10,12);let t=n<.4?1:2;if(seam||joint)t=0;else if(gy%8===0)t=3;return PLANK[t];}
 if(kind==='wall'){return WALLR[2];}
 if(kind==='snow'){const n=noise(gx,gy,20,13)*.75+noise(gx,gy,5,14)*.25;let t=2;if(n<.3)t=dither(gx,gy,(.3-n)*6)?1:2;else if(n>.64)t=dither(gx,gy,(n-.64)*6)?3:2;return SNOW[t];}
 // v0.6.1 Velmar (M09): clay roof tiles on rooftop high ground and cobbles on alleys and the market square.
 if(kind==='roof'){const row=Math.floor(gy/6),off=(row%2)*4,ly=gy%6,seam=(gx+off)%8===0,n=noise(gx,gy,10,17);return ly===5?ROOF[0]:ly===0?ROOF[3]:seam?ROOF[1]:ROOF[n<.4?1:2];}
 if(kind==='cobble'){const row=Math.floor(gy/7),off=(row%2)*4,cx=Math.floor((gx+off)/8),grout=gy%7===6||(gx+off)%8===7;if(grout)return COBBLE[0];const h=hash(cx,row,3);return COBBLE[h<.33?1:h<.7?2:3];}
 if(kind==='ice'){const n=noise(gx,gy,16,15);const crack=Math.abs(Math.sin(gx*.21+gy*.47+noise(gx,gy,9,16)*6))<.04;return crack?ICE[0]:ICE[n<.35?1:n>.7?3:2];}
 return GRASS[2];
}
const KIND={g:'grass',f:'grass',v:'grass',t:'grass',h:'grass',r:'dirt',x:'grass',m:'grass',d:'sand',w:'water',b:'water',s:'swamp',k:'flag',q:'flag',p:'plank',n:'snow',i:'ice',o:'roof',l:'cobble',z:'flag'};
const SNOW_BASE={g:'snow',f:'snow',v:'snow',t:'snow',h:'snow',x:'snow',m:'snow'};
// paints the full terrain ground; decor (trees, houses, rocks) is returned as sortable objects
export function paintGround(map,{theme=''}={}){
 const H=map.length,W=map[0].length,T=HD_TILE,p=new Pix(W*T,H*T),objects=[],fort=theme==='fortress',snowy=theme==='snow',city=theme==='city';
 for(let ty=0;ty<H;ty++)for(let tx=0;tx<W;tx++){
  const t=map[ty][tx],kind=(fort||city)&&t==='x'?'wall':city&&(t==='r'||t==='h')?'cobble':snowy&&SNOW_BASE[t]||KIND[t]||'grass';
  for(let y=0;y<T;y++)for(let x=0;x<T;x++){const gx=tx*T+x,gy=ty*T+y;let k=kind;
   // organic edges: dirt/sand/water tiles fray into neighbouring grass
   if(['dirt','sand','water','swamp','ice'].includes(kind)){const same=(dx,dy)=>(KIND[tileAt(map,tx+dx,ty+dy)]??kind)===kind||(kind==='water'&&['b','i'].includes(tileAt(map,tx+dx,ty+dy)))||(kind==='ice'&&tileAt(map,tx+dx,ty+dy)==='w')||(kind==='dirt'&&['r','h'].includes(tileAt(map,tx+dx,ty+dy)));const j=2+noise(gx,gy,6,9)*5;let dmin=99;if(!same(-1,0))dmin=Math.min(dmin,x);if(!same(1,0))dmin=Math.min(dmin,T-1-x);if(!same(0,-1))dmin=Math.min(dmin,y);if(!same(0,1))dmin=Math.min(dmin,T-1-y);for(const [dx,dy,cx,cy]of[[-1,-1,0,0],[1,-1,T-1,0],[-1,1,0,T-1],[1,1,T-1,T-1]])if(same(dx,0)&&same(0,dy)&&!same(dx,dy))dmin=Math.min(dmin,Math.hypot(x-cx,y-cy));if(dmin<j)k=snowy?'snow':'grass';else if(dmin<j+1.2)k=kind==='water'?'foam':'rim';}
   let c=k==='rim'?(kind==='dirt'?DIRT[0]:kind==='sand'?SAND[0]:kind==='ice'?ICE[0]:snowy?SNOW[0]:col('#33483a')):k==='foam'?WATER[4]:groundPixel(k,gx,gy);
   p.set(gx,gy,c);}
  const ox=tx*T,oy=ty*T,R=(i)=>hash(tx,ty,i);
  // surface detail
  if(kind==='grass'){for(let i=0;i<14;i++){const x=ox+Math.floor(R(i)*44)+2,y=oy+Math.floor(R(i+40)*42)+4;if(p.get(x,y)!==GRASS[1]&&p.get(x,y)!==GRASS[2]&&p.get(x,y)!==GRASS[3])continue;p.set(x,y,GRASS[4]);p.set(x-1,y+1,GRASS[3]);p.set(x+1,y+1,GRASS[3]);p.set(x,y+1,GRASS[0]);}
   if(R(80)<.35){const x=ox+6+Math.floor(R(81)*34),y=oy+8+Math.floor(R(82)*32);for(let i=0;i<7;i++){const gx=x+Math.floor(R(83+i)*9),gy=y+Math.floor(R(84+i*2)*5);p.set(gx,gy,GRASS[0]);p.set(gx,gy-1,GRASS[1]);p.set(gx,gy-2,GRASS[3]);}}
   if(t==='g'&&R(86)<.18){const x=ox+8+Math.floor(R(87)*30),y=oy+10+Math.floor(R(88)*28),sr=ramp('#9a9682');p.rect(x,y,3,2,sr[2]);p.set(x,y,sr[3]);p.rect(x,y+2,3,1,sr[0]);}
   if(t==='g'&&R(90)<.45){const x=ox+6+Math.floor(R(91)*36),y=oy+6+Math.floor(R(92)*34),fc=R(93)<.5?col('#f2e6c4'):col('#f0c95a');for(let i=0;i<3;i++){const fx=x+Math.floor(R(94+i)*8),fy=y+Math.floor(R(97+i)*6);p.set(fx,fy,fc);p.set(fx,fy+1,GRASS[0]);}}}
  if(kind==='dirt'){for(let i=0;i<6;i++){const x=ox+4+Math.floor(R(i)*40),y=oy+4+Math.floor(R(i+20)*40);if(![DIRT[1],DIRT[2],DIRT[3]].includes(p.get(x,y)))continue;p.set(x,y,DIRT[4]);p.set(x+1,y,DIRT[3]);p.set(x,y+1,DIRT[0]);p.set(x+1,y+1,DIRT[1]);}}
  if(kind==='water'){for(let i=0;i<5;i++){const x=ox+3+Math.floor(R(i)*38),y=oy+4+Math.floor(R(i+9)*40);for(let k=0;k<5+Math.floor(R(i+30)*4);k++)if(p.get(x+k,y)!==WATER[4])p.set(x+k,y,k%4===0?WATER[3]:WATER[4]);}}
  if(kind==='swamp'){for(let i=0;i<6;i++){const x=ox+4+Math.floor(R(i)*40),y=oy+10+Math.floor(R(i+9)*32);for(let k=0;k<5+i%3;k++)p.set(x+(k>3?1:0),y-k,k>3?col('#9a8a54'):col('#6f8f55'));}}
  if(kind==='flag')paintFlagstones(p,ox,oy,tx,ty,t==='q');
  if(kind==='wall')paintWall(p,ox,oy,tx,ty,tileAt(map,tx,ty+1)!=='x');
  // objects
  if(t==='f'){const spots=[[12,30],[34,28],[23,45],[8,46],[40,46]],n=3+(R(50)<.5?1:0);for(let i=0;i<n;i++){const [sx,sy]=spots[(i+Math.floor(R(49)*5))%5];objects.push({kind:'tree',x:ox+sx+Math.floor(R(51+i)*5)-2,y:oy+sy,size:.66+R(60+i)*.16,seed:tx*31+ty*17+i});}}
  if(t==='g'&&R(70)<.07)objects.push({kind:'bush',x:ox+10+Math.floor(R(71)*28),y:oy+16+Math.floor(R(72)*26),seed:tx+ty*7});
  if(t==='x'&&!fort&&!city)objects.push({kind:'ruin',x:ox,y:oy+T,seed:tx*13+ty});
  if(t==='m')objects.push({kind:'crag',x:ox,y:oy+T,seed:tx*7+ty*3});
  if(t==='b')objects.push({kind:'bridge',x:ox,y:oy,key:oy-48,seed:tx,map,tx,ty});
  if(t==='v')objects.push({kind:'house',x:ox,y:oy+T,seed:tx*5+ty*11,w:1,h:1});
  if(t==='t')objects.push({kind:'outpost',x:ox,y:oy+T,seed:tx});
  if(t==='h')objects.push({kind:'well',x:ox,y:oy+T,seed:tx});
 }
 return {pix:p,objects};
}
function paintWall(p,ox,oy,tx,ty,face){
 // fortress wall seen from above: capstone walk on top, brick face where the wall drops toward the viewer
 const top=ramp('#5c5850'),brick=ramp('#4a463f'),faceH=face?18:0;
 for(let y=0;y<48-faceH;y++)for(let x=0;x<48;x++){const gx=ox+x,gy=oy+y,bx=(x+(Math.floor(y/12)%2?6:0))%12,by=y%12;let t=2;if(bx===0||by===0)t=1;else if(bx===1||by===1)t=3;else if(noise(gx,gy,5,13)>.7)t=1;p.set(gx,gy,top[t]);}
 if(face){for(let y=48-faceH;y<48;y++)for(let x=0;x<48;x++){const row=Math.floor((y-48+faceH)/6),bx=(x+(row%2?5:0))%10,by=(y-48+faceH)%6;let t=y<48-faceH+2?0:2;if(t===2&&(bx===0||by===0))t=0;else if(t===2&&by===1)t=3;p.set(ox+x,oy+y,brick[t]);}p.rect(ox,oy+48-faceH-1,48,1,top[4]);}
}
function paintFlagstones(p,ox,oy,tx,ty,rampart){
 for(let row=0;row<4;row++)for(let k=-1;k<3;k++){const w=18,h=12,sx=ox+k*w+(row%2?9:0),sy=oy+row*h;const shade=hash(tx*9+k,ty*7+row,5);const r=shade<.3?ramp('#958e7a'):shade<.7?FLAG:ramp('#aaa28c');for(let y=0;y<h;y++)for(let x=0;x<w;x++){const gx=sx+x,gy=sy+y;if(gx<ox||gx>=ox+48||gy<oy||gy>=oy+48)continue;let t=2;if(x===0||y===0)t=0;else if(x===1||y===1)t=3;else if(y===h-1||x===w-1)t=1;else if(noise(gx,gy,4,11)>.72)t=1;p.set(gx,gy,r[t]);}}
 if(rampart){for(let k=0;k<4;k++){const sx=ox+k*12;p.rect(sx,oy,12,16,FLAG[1]);p.box(sx+1,oy,9,12,STONE);p.rect(sx+1,oy+12,10,2,FLAG[0]);}p.rect(ox,oy+16,48,2,FLAG[0]);}
}

// ---------- decor objects ----------
const cache=new Map();
const cached=(key,fn)=>{if(!cache.has(key))cache.set(key,fn().canvas());return cache.get(key);};
export function treeSprite(seed,size=1){return cached('tree'+seed+size.toFixed(2),()=>{const w=40,h=52,p=new Pix(w,h),rx=12*size,cy=h-14-14*size;
 // trunk
 p.box(18,cy+6,5,h-cy-9,WOOD);p.set(17,h-4,WOOD[1]);p.set(23,h-4,WOOD[0]);
 const blobs=[[20,cy,rx,rx*.85],[20-rx*.6,cy+4,rx*.7,rx*.6],[20+rx*.6,cy+5,rx*.7,rx*.6],[20,cy-rx*.55,rx*.7,rx*.6]];
 for(const [x,y,a,b]of blobs)p.ball(x,y,a,b,LEAF,{bias:.05});
 // leaf clusters
 for(let i=0;i<14;i++){const a=hash(seed,i,3)*Math.PI*2,r=hash(seed,i,4)*rx*.9,x=20+Math.cos(a)*r,y=cy+Math.sin(a)*r*.8-2;if(p.get(x|0,y|0)){p.set(x,y,LEAF[4]);p.set(x+1,y,LEAF[3]);p.set(x,y+1,LEAF[1]);}}
 return p.outline();});}
export function bushSprite(seed){return cached('bush'+seed,()=>{const p=new Pix(24,16);p.ball(8,9,7,6,LEAF);p.ball(15,8,7,6,LEAF);p.set(9,5,col('#e7d6f0'));p.set(16,4,col('#f1d1e0'));return p.outline();});}
export function ruinSprite(seed){return cached('ruin'+seed,()=>{const p=new Pix(48,40);for(let row=0;row<3;row++)for(let k=0;k<4-(row===2?1:0);k++){const w=11,h=9,x=2+k*11+(row%2?5:0)+(hash(seed,k+row*4,1)*2|0),y=29-row*9;if(row===2&&hash(seed,k,6)<.4)continue;p.box(x,y,w-1,h-1,hash(seed,k+row,2)<.5?STONE:ramp('#7c7a6c'));if(hash(seed,k+row,8)<.5)for(let i=0;i<4;i++)p.set(x+1+i,y,MOSS[3]);}p.ball(9,34,6,4,MOSS);p.ball(40,36,5,3,STONE);return p.outline();});}
export function cragSprite(seed){return cached('crag'+seed,()=>{const p=new Pix(48,56),R=ramp(seed%2?'#8e8c78':'#857f6e'),pk=[[2,54],[12+seed%3*2,24+seed%2*4],[20,28],[28+seed%3,8+seed%2*3],[36,22],[46,54]];p.poly(pk,R[2]);for(let y=0;y<56;y++)for(let x=0;x<48;x++){if(!p.get(x,y))continue;const s=(x-30)*.6+(y-8)*.1;p.set(x,y,x<30-y*.18?R[3]:s>8?R[1]:R[2]);}p.poly([[26,14],[30,8],[34,15],[30,17]],col('#e8e4d6'));p.line(30,9,22,40,R[1]);p.line(14,24,8,46,R[3]);return p.outline();});}
export function bridgeSprite(map,tx,ty){return cached(`bridge${tx},${ty}`,()=>{const p=new Pix(48,48),horizontal=['b','r','g'].includes(map[ty]?.[tx-1])&&map[ty]?.[tx-1]!=='w';for(let i=0;i<6;i++){if(horizontal)p.box(i*8,4,8,40,WOOD);else p.box(4,i*8,40,8,WOOD);}if(horizontal){p.box(0,2,48,4,ramp('#5e3f28'));p.box(0,42,48,4,ramp('#5e3f28'));}else{p.box(2,0,4,48,ramp('#5e3f28'));p.box(42,0,4,48,ramp('#5e3f28'));}return p;});}
// cottage: plaster and timber walls with a shingled roof; tw/th in tiles
export function houseSprite(seed,tw=1,th=1,state='intact'){return cached(`house${seed},${tw},${th},${state}`,()=>{const W=tw*48,H=th*48+14,p=new Pix(W,H),burned=state==='burned';
 const roofR=burned?ramp('#4b3a33'):tw>1?ramp('#5d7088'):hash(seed,1,1)<.5?ROOF:THATCH,thatch=roofR===THATCH;
 const wallH=20,wallTop=H-wallH-2,wl=3,wr=W-3;
 // walls: plaster between timber posts, stone footing
 p.box(wl,wallTop,wr-wl,wallH,burned?ramp('#6d6153'):PLASTER);
 for(const x of [wl,wr-3,...(tw>1?[(W>>1)-1]:[])])p.box(x,wallTop,3,wallH,WOOD,{edge:false});
 p.box(wl,H-5,wr-wl,3,STONE);
 const dx=(W>>1)-5;p.box(dx,H-17,10,14,ramp('#5c3b27'));p.rect(dx+1,H-17,8,1,col('#3a2418'));p.rect(dx+4,H-16,1,12,ramp('#5c3b27')[1]);p.set(dx+7,H-10,col('#e0c27a'));
 for(const wx of tw>1?[9,W-19]:[7,W-15]){p.box(wx,wallTop+4,8,8,ramp('#3d2c25'));p.rect(wx+1,wallTop+5,6,6,state==='intact'?col('#f2c66e'):col('#2a2220'));p.rect(wx+1,wallTop+5,3,3,state==='intact'?col('#fbe3a0'):col('#3a2a24'));p.rect(wx+4,wallTop+5,1,6,WOOD[1]);p.rect(wx+1,wallTop+8,6,1,WOOD[1]);p.rect(wx-1,wallTop+12,10,1,WOOD[2]);}
 // roof: front slope seen from above, overhanging the walls
 const rTop=4,rBot=wallTop+2;
 for(let y=rTop;y<=rBot;y++){const t=(y-rTop)/(rBot-rTop),inset=Math.round((1-t)*4);const row=Math.floor((y-rTop)/(thatch?3:4)),edge=(y-rTop)%(thatch?3:4)===(thatch?2:3);
  for(let x=inset;x<W-inset;x++){let tone=t<.15?3:t<.6?2:2;if(x<inset+2)tone=3;if(x>W-inset-3)tone=1;if(edge)tone=Math.max(0,tone-1);if(thatch){if(hash(x,y,seed)<.18)tone=Math.min(4,tone+1);if(hash(x,y,seed+3)<.12)tone=Math.max(0,tone-1);}else if((x+row*5)%8===0)tone=Math.max(0,tone-1);if(y>=rBot-1)tone=0;p.set(x,y,roofR[tone]);}}
 // ridge cap
 for(let x=4;x<W-4;x++){p.set(x,rTop,roofR[4]);p.set(x,rTop+1,roofR[3]);}
 if(!burned){p.box(W-13,0,6,9,ramp('#7a6f62'));p.rect(W-13,0,6,1,ramp('#7a6f62')[4]);}
 if(burned){for(let i=0;i<10;i++){const x=4+Math.floor(hash(seed,i,9)*(W-8)),y=rTop+3+Math.floor(hash(seed,i,10)*(rBot-rTop-4));p.rect(x,y,3,2,col('#1f1a1a'));}}
 return p.outline();});}

const healMark=p=>{p.rect(38,2,8,8,col('#1f3a2a'));p.rect(41,3,2,6,col('#9fe0b5'));p.rect(39,5,6,2,col('#9fe0b5'));};
export function outpostSprite(){return cached('outpost',()=>{const p=new Pix(48,56),W=ramp('#7a5634');for(let x=4;x<44;x+=5){p.box(x,26,5,26,W);p.poly([[x,26],[x+5,26],[x+2.5,21]],W[3]);}p.box(10,14,28,10,ramp('#9c3f36'));p.rect(10,14,28,2,ramp('#9c3f36')[4]);p.box(22,0,2,20,WOOD);p.box(24,1,12,8,ramp('#3f7fa3'));p.rect(28,3,4,4,col('#e1c27a'));p.box(14,40,9,10,WOOD);p.box(26,42,9,8,WOOD);healMark(p);return p.outline();});}
export function wellSprite(){return cached('well',()=>{const p=new Pix(48,48);p.ball(24,34,15,9,STONE);p.fillEllipse(24,32,10,5.5,WATER[1]);p.fillEllipse(22,31,5,2,WATER[3]);p.box(9,10,3,24,WOOD);p.box(36,10,3,24,WOOD);p.box(7,6,34,5,ROOF);p.rect(23,11,1,16,col('#3a2a22'));p.box(21,24,5,5,WOOD);healMark(p);return p.outline();});}
// multi-tile town buildings: taller walls, the door on the real entrance column, and a trade sign.
const TOWN_ROOF={forge:'#5a5f66',shop:'#3f7d72',inn:'#8a4f5e',warroom:'#3f5a7a',residence:'#a3593b',depot:'#7a5a3a'};
export function townBuildingSprite(b,tone='village',state='intact'){const door=b.entrance?b.entrance.tileX-b.x:Math.floor(b.w/2);return cached(`town${b.type}:${b.w}x${b.h}:${door}:${tone}:${state}`,()=>{
 const W=b.w*48,H=b.h*48+14,p=new Pix(W,H),camp=tone==='camp',burned=state==='burned';
 const roofR=burned?ramp('#4b3a33'):camp?ramp('#b9a57a'):ramp(TOWN_ROOF[b.type]||'#a3593b'),wallR=burned?ramp('#6d6153'):camp?ramp('#d9c9a0'):PLASTER;
 const wallH=Math.min(40,Math.round(b.h*48*.42)),wallTop=H-wallH-2,wl=3,wr=W-3;
 p.box(wl,wallTop,wr-wl,wallH,wallR);
 if(!camp){for(let x=wl;x<wr-2;x+=24)p.box(x,wallTop,3,wallH,WOOD,{edge:false});p.box(wr-3,wallTop,3,wallH,WOOD,{edge:false});p.box(wl,H-6,wr-wl,4,STONE);p.box(wl,wallTop,wr-wl,3,WOOD);}
 else{for(let x=wl+6;x<wr;x+=14)p.rect(x,wallTop,1,wallH,wallR[1]);}
 const dx=door*48+19;p.box(dx,H-22,12,20,ramp('#5c3b27'));p.rect(dx+1,H-22,10,1,col('#3a2418'));p.rect(dx+5,H-21,1,18,ramp('#5c3b27')[1]);p.set(dx+9,H-12,col('#e0c27a'));p.box(dx-2,H-24,16,3,WOOD);
 for(let wx=8;wx<W-16;wx+=26){if(Math.abs(wx+4-(dx+6))<16)continue;p.box(wx,wallTop+8,10,10,ramp('#3d2c25'));p.rect(wx+1,wallTop+9,8,8,burned?col('#2a2220'):b.type==='forge'?col('#f0a050'):col('#f2c66e'));p.rect(wx+1,wallTop+9,4,4,burned?col('#3a2a24'):col('#fbe3a0'));p.rect(wx+5,wallTop+9,1,8,WOOD[1]);p.rect(wx+1,wallTop+13,8,1,WOOD[1]);}
 const rTop=6,rBot=wallTop+2;
 for(let y=rTop;y<=rBot;y++){const t=(y-rTop)/(rBot-rTop),inset=Math.round((1-t)*6);const row=Math.floor((y-rTop)/4),edge=(y-rTop)%4===3;
  for(let x=inset;x<W-inset;x++){let tone2=2;if(t<.12)tone2=3;if(x<inset+2)tone2=3;if(x>W-inset-3)tone2=1;if(edge&&!camp)tone2=Math.max(0,tone2-1);if(camp&&(x%16===0))tone2=1;else if(!camp&&(x+row*5)%8===0)tone2=Math.max(0,tone2-1);if(y>=rBot-1)tone2=0;p.set(x,y,roofR[tone2]);}}
 for(let x=6;x<W-6;x++){p.set(x,rTop,roofR[4]);p.set(x,rTop+1,roofR[3]);}
 if(rBot-rTop>60&&!camp&&!burned)for(let dx2=24;dx2<W-24;dx2+=48){const dy=Math.round((rTop+rBot)/2)-8;p.box(dx2-7,dy,14,12,roofR);p.poly([[dx2-9,dy+1],[dx2+9,dy+1],[dx2,dy-7]],roofR[3]);p.box(dx2-4,dy+3,8,8,ramp('#3d2c25'));p.rect(dx2-3,dy+4,6,6,col('#f2c66e'));p.rect(dx2,dy+4,1,6,WOOD[1]);}
 // trade details
 if(b.type==='forge'&&!burned){p.box(W-20,0,10,rBot-10,STONE);p.rect(W-20,0,10,2,STONE[4]);p.box(10,H-14,12,6,ramp('#4a4a4e'));p.box(13,H-18,6,4,ramp('#4a4a4e'));}
 if(b.type==='shop'&&!burned){for(let x=wl;x<wr;x++){const stripe=Math.floor(x/6)%2;for(let y=wallTop-2;y<wallTop+5;y++)p.set(x,y,stripe?col('#f1e3c4'):ramp('#3f7d72')[2]);}for(let i=0;i<3;i++){p.box(W-22+i*6,H-12,5,8,ramp(['#c8413a','#3a6fc8','#3d9a63'][i]));}}
 if(b.type==='inn'&&!burned){p.box(dx+16,wallTop+4,14,10,WOOD);p.rect(dx+18,wallTop+7,10,4,col(camp?'#e8e2d0':'#e8c66e'));if(camp){p.rect(dx+22,wallTop+6,2,6,col('#c9443a'));p.rect(dx+20,wallTop+8,6,2,col('#c9443a'));}}
 if(b.type==='warroom'&&!burned){p.box(W/2-1,0,2,rTop+10,WOOD);p.box(W/2+1,1,14,9,ramp('#9c3f36'));p.rect(W/2+6,3,4,5,col('#e1c27a'));}
 if(b.type==='depot'){p.box(W-20,H-16,14,12,WOOD);p.rect(W-20,H-11,14,1,WOOD[0]);p.box(6,H-14,10,10,WOOD);}
 if(burned){for(let i=0;i<14;i++){const x=4+Math.floor(hash(b.x,i,9)*(W-8)),y=rTop+3+Math.floor(hash(b.y,i,10)*(rBot-rTop-4));p.rect(x,y,3,2,col('#1f1a1a'));}}
 return p.outline();});}

// ---------- characters ----------
// Figures are 40×52 pixels, feet on row 50. Front three-quarter idle pose.
export const SKIN={fair:'#f0c7a2',warm:'#dfae86',tan:'#c58f63',deep:'#9a6644',pale:'#ead5c0'};
export const CAST={
 eric:{name:'에릭',skin:'warm',hair:'#6b4630',style:'short',helm:'knight',body:'plate',coat:'#3f7fa3',tabard:'#3f7fa3',trim:'#e1c27a',legs:'#40505c',boots:'#5b4632',weapon:'sword',off:'shield',shield:'#3f7fa3',eye:'#2f5d78'},
 elina:{name:'엘리나',skin:'fair',hair:'#b5562e',style:'braid',hood:'#4f7a46',body:'leather',coat:'#6d8f4c',trim:'#d8b46a',legs:'#5a4a36',boots:'#4a3a28',weapon:'bow',back:'quiver',eye:'#4f7a3a'},
 lia:{name:'리아',skin:'fair',hair:'#4b3550',style:'long',hat:'witch',hatColor:'#5f4791',body:'robe',coat:'#9b7fc4',trim:'#e3c37b',legs:'#4a3a66',boots:'#3b2f4c',weapon:'staff',orb:'#9ad6ff',eye:'#b88a3e'},
 sain:{name:'세인',skin:'deep',hair:'#efe4c8',style:'short',veil:'#f4ead2',body:'robe',coat:'#efe6cf',trim:'#d6ae55',legs:'#c9bc98',boots:'#8b7650',weapon:'holy',eye:'#4a3a2c'},
 kai:{name:'카이',skin:'tan',hair:'#24404b',style:'spiky',scarf:'#e0874a',body:'jacket',coat:'#4d6672',trim:'#d8a35e',legs:'#33424a',boots:'#2a2f33',weapon:'daggers',eye:'#86a85a'},
 aren:{name:'아렌',skin:'warm',hair:'#25323a',style:'swept',body:'coat',coat:'#6c7a82',trim:'#d6b06a',cape:'#9c3f36',legs:'#37414a',boots:'#2f2a28',weapon:'sheathed',eye:'#5a4a40'},
 bandit:{name:'산적',skin:'tan',hair:'#3e2c22',style:'short',bandana:'#a23d32',body:'leather',coat:'#7a5a3e',trim:'#5a4030',legs:'#4b3e30',boots:'#3a2c20',weapon:'axe',beard:'stubble',eye:'#3a2a22'},
 archer:{name:'산적 궁수',skin:'warm',hair:'#4a3626',style:'short',hood:'#6b4e36',body:'leather',coat:'#85663f',trim:'#a23d32',legs:'#4b3e30',boots:'#3a2c20',weapon:'bow',back:'quiver',eye:'#3a2a22'},
 captain:{name:'가르',skin:'tan',hair:'#3a241c',style:'mohawk',body:'fur',coat:'#7c3a2e',fur:'#8a7558',trim:'#c9a24a',legs:'#3e3026',boots:'#2c221a',weapon:'greataxe',beard:'full',eye:'#2a1a14',big:true},
 torch:{name:'횃불 병참병',skin:'warm',hair:'#3b302a',style:'short',helm:'cap',helmColor:'#6b6d6a',body:'tunic',coat:'#5f6a63',trim:'#a28a5a',legs:'#44494a',boots:'#2f2c28',weapon:'torch',eye:'#3a2a22'},
 quartermaster:{name:'병참관',skin:'pale',hair:'#5a5a5e',style:'swept',body:'coat',coat:'#4e5560',trim:'#c9b07a',legs:'#33373e',boots:'#26262a',weapon:'ledger',beard:'mustache',eye:'#3a3a40'},
 elder:{name:'마을 어른',skin:'warm',hair:'#e6e1d6',style:'bald',body:'robe',coat:'#7b5b42',trim:'#c2a36d',legs:'#5a4634',boots:'#3d2f22',weapon:'cane',beard:'long',eye:'#4a3a2c',stoop:true},
 smith:{name:'대장장이',skin:'tan',hair:'#2e2420',style:'bald',body:'apron',coat:'#8a7a68',apron:'#5a3c2a',trim:'#a07a50',legs:'#4a3c30',boots:'#2c221a',weapon:'hammer',beard:'full',eye:'#2a1a14',big:true},
 merchant:{name:'도구 상인',skin:'fair',hair:'#6a4a30',style:'short',helm:'beret',helmColor:'#3f7a5a',body:'vest',coat:'#d7c49a',vest:'#3f7a5a',trim:'#d8b46a',legs:'#5a4a36',boots:'#4a3a28',weapon:'satchel',eye:'#4a3a2c'},
 refugee:{name:'피난민',skin:'warm',hair:'#4a3a30',style:'long',scarfHead:'#9a8f7c',body:'shawl',coat:'#8c8a7e',shawl:'#b0866a',trim:'#7a6a54',legs:'#6a6254',boots:'#4a4034',weapon:'bundle',eye:'#3a2a22'},
 child:{name:'아이',skin:'fair',hair:'#8a5a34',style:'short',body:'tunic',coat:'#c98a4a',trim:'#f0d090',legs:'#5a5040',boots:'#4a3a28',weapon:'none',eye:'#3a2a22',small:true},
 farmer:{name:'토마스',skin:'tan',hair:'#5a3a24',style:'short',helm:'straw',helmColor:'#d8b866',body:'tunic',coat:'#b8a07a',trim:'#7a5a3a',legs:'#5a5040',boots:'#4a3a28',weapon:'none',eye:'#3a2a22'},
 mira:{name:'미라',skin:'fair',hair:'#9a5a3a',style:'long',scarfHead:'#c7b18a',body:'shawl',coat:'#a59c8a',shawl:'#8a6a8a',trim:'#c7b18a',legs:'#6a6254',boots:'#4a4034',weapon:'none',bandage:true,eye:'#4a3a2c'},
 guard:{name:'경비병',skin:'fair',hair:'#2f2a26',style:'short',helm:'kettle',helmColor:'#9aa4a8',body:'tunic',coat:'#4f6b84',trim:'#c9b07a',legs:'#3a4652',boots:'#2c2a26',weapon:'spear',eye:'#3a3a40'},
 eric_adv:{name:'에릭',skin:'warm',hair:'#6b4630',style:'short',helm:'knight',body:'plate',coat:'#3f7fa3',tabard:'#3f7fa3',trim:'#e7c783',legs:'#40505c',boots:'#5b4632',weapon:'sword',off:'shield',shield:'#3f7fa3',eye:'#2f5d78',cape:'#5d425e'},
 deserter:{name:'탈영병',skin:'warm',hair:'#4a3a2a',style:'short',body:'tunic',coat:'#6a7058',trim:'#8a7a54',legs:'#4a4a3a',boots:'#3a3226',weapon:'sword',beard:'stubble',eye:'#3a2a22'},
 deserterCaptain:{name:'도주 대장',skin:'tan',hair:'#3a2a1c',style:'swept',hood:'#4e5a3e',body:'leather',coat:'#5d6a48',trim:'#c9a24a',cape:'#4e5a3e',legs:'#3e3a2c',boots:'#2c261c',weapon:'axe',beard:'full',eye:'#2a1a14',big:true},
 pursuer:{name:'추격병',skin:'fair',hair:'#2f2a26',style:'short',helm:'kettle',helmColor:'#7a8288',body:'tunic',coat:'#4a3f5a',trim:'#9a8a6a',legs:'#33303a',boots:'#24222a',weapon:'sword',eye:'#3a3a40'},
 pursuerArcher:{name:'추격 사수',skin:'warm',hair:'#3a302a',style:'short',helm:'cap',helmColor:'#4a3f5a',body:'leather',coat:'#5a4f66',trim:'#9a8a6a',legs:'#33303a',boots:'#24222a',weapon:'bow',back:'quiver',eye:'#3a3a40'},
 pursuerCaptain:{name:'추격 지휘관',skin:'pale',hair:'#2a2430',style:'swept',helm:'knight',body:'plate',coat:'#4a3f5a',tabard:'#4a3f5a',trim:'#c9b07a',cape:'#2e2838',legs:'#2a2832',boots:'#1f1d24',weapon:'sword',eye:'#4a3a5a'},
 fortGuard:{name:'성채 경비병',skin:'warm',hair:'#3b302a',style:'short',helm:'kettle',helmColor:'#6b6d6a',body:'tunic',coat:'#5f6a63',trim:'#a28a5a',legs:'#44494a',boots:'#2f2c28',weapon:'spear',eye:'#3a2a22'},
 fortArcher:{name:'성벽 사수',skin:'fair',hair:'#4a3626',style:'short',helm:'cap',helmColor:'#5f6a63',body:'leather',coat:'#6a6f62',trim:'#a28a5a',legs:'#44494a',boots:'#2f2c28',weapon:'bow',back:'quiver',eye:'#3a2a22'},
 storeman:{name:'지하 창고병',skin:'tan',hair:'#2e2420',style:'short',bandana:'#5f6a63',body:'apron',coat:'#6a5e50',apron:'#4a3a2a',trim:'#7a6a50',legs:'#44494a',boots:'#2f2c28',weapon:'hammer',beard:'stubble',eye:'#2a1a14'},
 lion:{name:'발드릭',skin:'warm',hair:'#5d5650',style:'swept',body:'plate',metal:'#3a3d44',coat:'#2b2d33',tabard:'#1f2026',trim:'#c9a24a',collar:'#a8742e',cape:'#24262c',legs:'#26282c',boots:'#1d1d20',weapon:'spear',beard:'full',beardColor:'#6e665e',eye:'#6a5a40',big:true},
 bearer:{name:'사자 기수',skin:'fair',hair:'#3a302a',style:'short',helm:'kettle',helmColor:'#5c6068',body:'tunic',coat:'#3a3e48',trim:'#c9a24a',legs:'#2e3038',boots:'#1f1f24',weapon:'banner',eye:'#3a3a40'},
 ironSpear:{name:'철왕관 창병',skin:'warm',hair:'#3b302a',style:'short',helm:'kettle',helmColor:'#6e737a',body:'plate',metal:'#7d838a',coat:'#3a3e48',tabard:'#3a3e48',trim:'#c9a24a',legs:'#2e3038',boots:'#1f1f24',weapon:'spear',eye:'#3a2a22'},
 ironArcher:{name:'철왕관 궁수',skin:'fair',hair:'#4a3626',style:'short',helm:'cap',helmColor:'#3a3e48',body:'leather',coat:'#4a4f5a',trim:'#c9a24a',legs:'#2e3038',boots:'#1f1f24',weapon:'bow',back:'quiver',eye:'#3a2a22'},
 cavalry:{name:'철왕관 기병',horse:'#8a5a3a',barding:'#3a3e48',skin:'tan',hair:'#2a2420',style:'short',helm:'knight',helmMetal:'#7d838a',body:'plate',metal:'#7d838a',coat:'#3a3e48',tabard:'#7a2e2a',trim:'#c9a24a',legs:'#2e3038',boots:'#1f1f24',weapon:'spear',eye:'#3a2a22',mounted:true},
 // v0.6 ACT II cast (pack B, D-059). Painted sheets are used; these are the procedural fallbacks and the palette for small UI.
 thea:{name:'테아',horse:'#9a9a96',barding:'#4f6b84',skin:'fair',hair:'#a5532c',style:'ponytail',body:'plate',metal:'#6f7f8f',coat:'#4f6b84',tabard:'#4f6b84',trim:'#c9b07c',legs:'#2e3038',boots:'#1f1f24',weapon:'spear',eye:'#4f6b84',mounted:true},
 dario:{name:'다리오',skin:'tan',hair:'#1e1a18',style:'long',body:'leather',coat:'#7a2e30',trim:'#c9a24a',scarf:'#3f7f74',legs:'#4a3a2c',boots:'#3a2a20',weapon:'sword',beard:'stubble',eye:'#3a2a22'},
 cassian:{name:'카시안',skin:'fair',hair:'#2e2c2c',style:'swept',body:'coat',coat:'#3c5677',fur:'#5e5a56',trim:'#b8bec4',cape:'#3c5677',legs:'#2a2e36',boots:'#1d1d20',weapon:'sheathed',eye:'#7f878e'},
 leonora:{name:'레오노라',skin:'fair',hair:'#c9b48a',style:'braid',body:'coat',coat:'#3f6a4a',trim:'#c8ced3',cape:'#2f5a3c',legs:'#d8cfb4',boots:'#4a3a28',weapon:'sword',eye:'#7a6a40'},
 ironInfantry:{name:'통령국 보병',skin:'warm',hair:'#3b302a',style:'short',helm:'kettle',helmColor:'#6e737a',body:'plate',metal:'#7d838a',coat:'#4f6b84',tabard:'#4f6b84',fur:'#8a8680',trim:'#b8bec4',legs:'#2e3038',boots:'#1f1f24',weapon:'spear',off:'shield',shield:'#4f6b84',eye:'#3a2a22'},
 ironDeserter:{name:'통령국 탈영병',skin:'warm',hair:'#3a2c22',style:'short',body:'plate',metal:'#6a6e74',coat:'#4f6b84',fur:'#6e665e',trim:'#7a6a50',legs:'#3a3a3a',boots:'#2a2620',weapon:'axe',beard:'stubble',eye:'#3a2a22'},
 mercSpear:{name:'용병 창병',skin:'warm',hair:'#3a2c22',style:'short',helm:'kettle',helmColor:'#7d838a',body:'leather',coat:'#8a2e2a',tabard:'#1f1d1d',trim:'#5a4030',legs:'#3a2c22',boots:'#2a2018',weapon:'spear',eye:'#3a2a22'},
 assassin:{name:'자객',skin:'warm',hair:'#2a2420',style:'short',hood:'#4a5444',body:'leather',coat:'#3e463a',trim:'#2a2a26',legs:'#2e322a',boots:'#22241f',weapon:'daggers',eye:'#3a2a22'},
 lordA:{name:'영주군(청백)',skin:'warm',hair:'#3b302a',style:'short',helm:'kettle',helmColor:'#b8bec4',body:'plate',metal:'#9aa0a6',coat:'#2f4f8a',tabard:'#e8e4d8',trim:'#2f4f8a',legs:'#2e3038',boots:'#1f1f24',weapon:'spear',off:'shield',shield:'#2f4f8a',eye:'#3a2a22'},
 lordB:{name:'영주군(주황)',skin:'warm',hair:'#3b302a',style:'short',helm:'kettle',helmColor:'#7d838a',body:'plate',metal:'#7d838a',coat:'#c8682a',tabard:'#6a4428',trim:'#c8682a',legs:'#2e3038',boots:'#1f1f24',weapon:'spear',eye:'#3a2a22'},
 councillor:{name:'벨마르 의원',skin:'fair',hair:'#b8b0a4',style:'short',helm:'beret',helmColor:'#3f6a4a',body:'robe',coat:'#3f6a4a',trim:'#e6dcc0',legs:'#d8cfb4',boots:'#4a3a28',weapon:'satchel',beard:'full',beardColor:'#b8b0a4',eye:'#4a3a2c'},
 // v0.7 ACT II part 2 cast (D-068, PROPOSED looks; art pack D will replace these procedural fallbacks).
 lucien:{name:'루시안',skin:'fair',hair:'#d8d4cc',style:'long',body:'robe',coat:'#ece4d0',trim:'#c9a24a',cape:'#a0302a',legs:'#e0d6bc',boots:'#6a5a44',weapon:'staff',orb:'#f0a040',beard:'full',beardColor:'#d8d4cc',eye:'#b07a2a'},
 ines:{name:'이네스',skin:'tan',hair:'#1c1816',style:'short',body:'plate',metal:'#8a9096',coat:'#ece4d0',tabard:'#ece4d0',trim:'#a0302a',cape:'#a0302a',legs:'#5a5048',boots:'#3a3026',weapon:'greataxe',off:'shield',shield:'#ece4d0',eye:'#3a2a1c'},
 flameKnight:{name:'성화 기사',skin:'fair',hair:'#4a3626',style:'short',helm:'knight',helmMetal:'#b8bec4',body:'plate',metal:'#b8bec4',coat:'#ece4d0',tabard:'#ece4d0',trim:'#a0302a',legs:'#5a5048',boots:'#3a3026',weapon:'sword',off:'shield',shield:'#ece4d0',eye:'#3a2a22'},
 pilgrim:{name:'순례자',skin:'warm',hair:'#5a4a3a',style:'short',hood:'#b8ab90',body:'robe',coat:'#b8ab90',trim:'#a0302a',legs:'#8a7e66',boots:'#5a4a34',weapon:'torch',eye:'#3a2a22'},
 ashRaider:{name:'재 약탈단',skin:'warm',hair:'#2a2420',style:'long',bandana:'#6a2422',body:'leather',coat:'#2e2a28',trim:'#5a3a2a',legs:'#2a2624',boots:'#1e1a18',weapon:'axe',eye:'#3a2a22'},
 monasteryGuard:{name:'수도원 경비',skin:'fair',hair:'#3a302a',style:'short',hood:'#7a7a74',body:'robe',coat:'#7a7a74',trim:'#a07a3a',legs:'#5a5a54',boots:'#3a3a36',weapon:'staff',orb:'#8a7a5a',eye:'#3a3a40'},
 abbot:{name:'침묵의 원장',skin:'pale',hair:'#b8b4ac',style:'bald',body:'robe',coat:'#2e2c2c',trim:'#7a7a74',cape:'#4a4846',legs:'#3a3836',boots:'#24221f',weapon:'torch',beard:'long',beardColor:'#b8b4ac',eye:'#4a4a50',stoop:true},
 aide:{name:'작전 보좌관',skin:'pale',hair:'#2a2430',style:'swept',body:'coat',coat:'#3f3a63',trim:'#c9b07a',legs:'#2a2840',boots:'#1f1d2a',weapon:'papers',eye:'#4a3a5a'}
};
// M06 looks that have painted sheets; their pixel fallback borrows an existing look.
CAST.executor={...CAST.pursuerCaptain,name:'봉쇄 집행관',weapon:'spear'};
// v0.5 tier-2 looks: painted sheets come from the art pack; the pixel fallback reuses the tier-1 figure.
for(const id of ['eric','elina','lia','sain','kai'])CAST[`${id}_t2`]={...CAST[id==='eric'?'eric_adv':id]};CAST.inspector={...CAST.quartermaster,name:'군령부 감찰관',weapon:'sword'};
export function wagonSprite(){return cached('wagon',()=>{const p=new Pix(48,52),W=ramp('#7a5634'),C=ramp('#e2d6b4');
 p.box(5,30,38,10,W);for(let x=7;x<42;x+=6)p.rect(x,31,1,8,W[1]);
 for(let y=10;y<31;y++){const half=17-Math.round(Math.pow((y-10)/20,0.5)*0)-((y<14)?(14-y):0);for(let x=24-half;x<24+half;x++){let t=x<14?3:x>36?1:2;if((x-6)%8===0)t=1;p.set(x,y,C[t]);}}
 p.rect(8,14,32,1,C[4]);for(const [x,y]of[[12,40],[36,40]]){p.ball(x,y,6,6,ramp('#5a3e28'));p.ball(x,y,2,2,ramp('#c9a24a'));for(const [a,b]of[[0,-4],[0,4],[-4,0],[4,0]])p.set(x+a,y+b,W[3]);}
 p.box(40,32,8,2,W);p.rect(14,22,6,6,col('#3a6fc8'));p.rect(26,20,8,5,col('#c8413a'));
 return p.outline();});}
// ---------- scene composition ----------
export function drawShadow(c,x,y,w=14,h=4){c.fillStyle='rgba(20,24,30,.32)';c.beginPath();c.ellipse(x,y,w,h,0,0,Math.PI*2);c.fill();}
export function drawFlame(c,x,y,t,s=1){for(let i=0;i<5;i++){const ph=t/120+i*1.7,h=(10+6*Math.sin(ph))*s,w=4*s;c.fillStyle=i%2?'#ffcf6a':'#f07a32';c.fillRect(Math.round(x-8*s+i*4*s),Math.round(y-h),Math.round(w),Math.round(h));}c.fillStyle='#fff2b0';c.fillRect(Math.round(x-2*s),Math.round(y-8*s),Math.round(4*s),Math.round(5*s));}
