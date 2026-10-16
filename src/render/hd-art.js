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
const col=h=>pack(hex(h));
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
const STONE=ramp('#8a8778'),MOSS=ramp('#5d7a43'),WOOD=ramp('#8a6040'),PLASTER=ramp('#dccaa0'),ROOF=ramp('#a3593b'),THATCH=ramp('#b98d4f');
const LEAF=['#1d3528','#284a33','#36623d','#4e8248','#71a455'].map(col);
const FLAG=ramp('#7d7a6c');

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
 return GRASS[2];
}
const KIND={g:'grass',f:'grass',v:'grass',t:'grass',h:'dirt',r:'dirt',x:'grass',m:'grass',d:'sand',w:'water',b:'water',s:'swamp',k:'flag',q:'flag'};
// paints the full terrain ground; decor (trees, houses, rocks) is returned as sortable objects
export function paintGround(map){
 const H=map.length,W=map[0].length,T=HD_TILE,p=new Pix(W*T,H*T),objects=[];
 for(let ty=0;ty<H;ty++)for(let tx=0;tx<W;tx++){
  const t=map[ty][tx],kind=KIND[t]||'grass';
  for(let y=0;y<T;y++)for(let x=0;x<T;x++){const gx=tx*T+x,gy=ty*T+y;let k=kind;
   // organic edges: dirt/sand/water tiles fray into neighbouring grass
   if(['dirt','sand','water','swamp'].includes(kind)){const same=(dx,dy)=>(KIND[tileAt(map,tx+dx,ty+dy)]??kind)===kind||(kind==='water'&&tileAt(map,tx+dx,ty+dy)==='b')||(kind==='dirt'&&['r','h'].includes(tileAt(map,tx+dx,ty+dy)));const j=2+noise(gx,gy,6,9)*5;let dmin=99;if(!same(-1,0))dmin=Math.min(dmin,x);if(!same(1,0))dmin=Math.min(dmin,T-1-x);if(!same(0,-1))dmin=Math.min(dmin,y);if(!same(0,1))dmin=Math.min(dmin,T-1-y);for(const [dx,dy,cx,cy]of[[-1,-1,0,0],[1,-1,T-1,0],[-1,1,0,T-1],[1,1,T-1,T-1]])if(same(dx,0)&&same(0,dy)&&!same(dx,dy))dmin=Math.min(dmin,Math.hypot(x-cx,y-cy));if(dmin<j)k='grass';else if(dmin<j+1.2)k=kind==='water'?'foam':'rim';}
   let c=k==='rim'?(kind==='dirt'?DIRT[0]:kind==='sand'?SAND[0]:col('#33483a')):k==='foam'?WATER[4]:groundPixel(k,gx,gy);
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
  // objects
  if(t==='f'){const spots=[[12,30],[34,28],[23,45],[8,46],[40,46]],n=3+(R(50)<.5?1:0);for(let i=0;i<n;i++){const [sx,sy]=spots[(i+Math.floor(R(49)*5))%5];objects.push({kind:'tree',x:ox+sx+Math.floor(R(51+i)*5)-2,y:oy+sy,size:.66+R(60+i)*.16,seed:tx*31+ty*17+i});}}
  if(t==='g'&&R(70)<.07)objects.push({kind:'bush',x:ox+10+Math.floor(R(71)*28),y:oy+16+Math.floor(R(72)*26),seed:tx+ty*7});
  if(t==='x')objects.push({kind:'ruin',x:ox,y:oy+T,seed:tx*13+ty});
  if(t==='m')objects.push({kind:'crag',x:ox,y:oy+T,seed:tx*7+ty*3});
  if(t==='b')objects.push({kind:'bridge',x:ox,y:oy,key:oy-48,seed:tx,map,tx,ty});
  if(t==='v'||t==='t'||t==='h')objects.push({kind:'house',x:ox,y:oy+T,seed:tx*5+ty*11,w:1,h:1});
 }
 return {pix:p,objects};
}
function paintFlagstones(p,ox,oy,tx,ty,rampart){
 for(let row=0;row<4;row++)for(let k=-1;k<3;k++){const w=18,h=12,sx=ox+k*w+(row%2?9:0),sy=oy+row*h;const shade=hash(tx*9+k,ty*7+row,5);const r=shade<.3?ramp('#77746a'):shade<.7?FLAG:ramp('#87826f');for(let y=0;y<h;y++)for(let x=0;x<w;x++){const gx=sx+x,gy=sy+y;if(gx<ox||gx>=ox+48||gy<oy||gy>=oy+48)continue;let t=2;if(x===0||y===0)t=0;else if(x===1||y===1)t=3;else if(y===h-1||x===w-1)t=1;else if(noise(gx,gy,4,11)>.72)t=1;p.set(gx,gy,r[t]);}}
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

// ---------- characters ----------
// Figures are 40×52 pixels, feet on row 50. Front three-quarter idle pose.
const SKIN={fair:'#f0c7a2',warm:'#dfae86',tan:'#c58f63',deep:'#9a6644',pale:'#ead5c0'};
export const CAST={
 eric:{name:'에릭',skin:'warm',hair:'#6b4630',style:'short',helm:'knight',body:'plate',coat:'#3f7fa3',tabard:'#3f7fa3',trim:'#e1c27a',legs:'#40505c',boots:'#5b4632',weapon:'sword',off:'shield',shield:'#3f7fa3',eye:'#2f5d78'},
 elina:{name:'엘리나',skin:'fair',hair:'#b5562e',style:'braid',hood:'#4f7a46',body:'leather',coat:'#6d8f4c',trim:'#d8b46a',legs:'#5a4a36',boots:'#4a3a28',weapon:'bow',back:'quiver',eye:'#4f7a3a'},
 lia:{name:'리아',skin:'fair',hair:'#4b3550',style:'long',hat:'witch',hatColor:'#5f4791',body:'robe',coat:'#9b7fc4',trim:'#e3c37b',legs:'#4a3a66',boots:'#3b2f4c',weapon:'staff',orb:'#9ad6ff',eye:'#b88a3e'},
 sain:{name:'세인',skin:'deep',hair:'#efe4c8',style:'short',veil:'#f4ead2',body:'robe',coat:'#efe6cf',trim:'#d6ae55',legs:'#c9bc98',boots:'#8b7650',weapon:'holy',eye:'#4a3a2c'},
 kai:{name:'카이',skin:'tan',hair:'#24404b',style:'spiky',scarf:'#e0874a',body:'jacket',coat:'#4d6672',trim:'#d8a35e',legs:'#33424a',boots:'#2a2f33',weapon:'daggers',eye:'#86a85a'},
 aren:{name:'아렌',skin:'warm',hair:'#25323a',style:'swept',body:'coat',coat:'#6c7a82',trim:'#d6b06a',cape:'#9c3f36',legs:'#37414a',boots:'#2f2a28',weapon:'sheathed',eye:'#5a4a40'},
 bandit:{name:'산적',skin:'tan',hair:'#3e2c22',style:'short',bandana:'#a23d32',body:'leather',coat:'#7a5a3e',trim:'#5a4030',legs:'#4b3e30',boots:'#3a2c20',weapon:'axe',beard:'stubble',eye:'#3a2a22'},
 archer:{name:'산적 궁수',skin:'warm',hair:'#4a3626',style:'short',hood:'#6b4e36',body:'leather',coat:'#85663f',trim:'#a23d32',legs:'#4b3e30',boots:'#3a2c20',weapon:'bow',back:'quiver',eye:'#3a2a22'},
 captain:{name:'Garr',skin:'tan',hair:'#3a241c',style:'mohawk',body:'fur',coat:'#7c3a2e',fur:'#8a7558',trim:'#c9a24a',legs:'#3e3026',boots:'#2c221a',weapon:'greataxe',beard:'full',eye:'#2a1a14',big:true},
 torch:{name:'횃불 병참병',skin:'warm',hair:'#3b302a',style:'short',helm:'cap',helmColor:'#6b6d6a',body:'tunic',coat:'#5f6a63',trim:'#a28a5a',legs:'#44494a',boots:'#2f2c28',weapon:'torch',eye:'#3a2a22'},
 quartermaster:{name:'병참관',skin:'pale',hair:'#5a5a5e',style:'swept',body:'coat',coat:'#4e5560',trim:'#c9b07a',legs:'#33373e',boots:'#26262a',weapon:'ledger',beard:'mustache',eye:'#3a3a40'},
 elder:{name:'마을 어른',skin:'warm',hair:'#e6e1d6',style:'bald',body:'robe',coat:'#7b5b42',trim:'#c2a36d',legs:'#5a4634',boots:'#3d2f22',weapon:'cane',beard:'long',eye:'#4a3a2c',stoop:true},
 smith:{name:'대장장이',skin:'tan',hair:'#2e2420',style:'bald',body:'apron',coat:'#8a7a68',apron:'#5a3c2a',trim:'#a07a50',legs:'#4a3c30',boots:'#2c221a',weapon:'hammer',beard:'full',eye:'#2a1a14',big:true},
 merchant:{name:'도구 상인',skin:'fair',hair:'#6a4a30',style:'short',helm:'beret',helmColor:'#3f7a5a',body:'vest',coat:'#d7c49a',vest:'#3f7a5a',trim:'#d8b46a',legs:'#5a4a36',boots:'#4a3a28',weapon:'satchel',eye:'#4a3a2c'},
 refugee:{name:'피난민',skin:'warm',hair:'#4a3a30',style:'long',scarfHead:'#9a8f7c',body:'shawl',coat:'#8c8a7e',shawl:'#b0866a',trim:'#7a6a54',legs:'#6a6254',boots:'#4a4034',weapon:'bundle',eye:'#3a2a22'},
 child:{name:'아이',skin:'fair',hair:'#8a5a34',style:'short',body:'tunic',coat:'#c98a4a',trim:'#f0d090',legs:'#5a5040',boots:'#4a3a28',weapon:'none',eye:'#3a2a22',small:true},
 farmer:{name:'Tomas',skin:'tan',hair:'#5a3a24',style:'short',helm:'straw',helmColor:'#d8b866',body:'tunic',coat:'#b8a07a',trim:'#7a5a3a',legs:'#5a5040',boots:'#4a3a28',weapon:'none',eye:'#3a2a22'},
 mira:{name:'Mira',skin:'fair',hair:'#9a5a3a',style:'long',scarfHead:'#c7b18a',body:'shawl',coat:'#a59c8a',shawl:'#8a6a8a',trim:'#c7b18a',legs:'#6a6254',boots:'#4a4034',weapon:'none',bandage:true,eye:'#4a3a2c'},
 guard:{name:'경비병',skin:'fair',hair:'#2f2a26',style:'short',helm:'kettle',helmColor:'#9aa4a8',body:'tunic',coat:'#4f6b84',trim:'#c9b07a',legs:'#3a4652',boots:'#2c2a26',weapon:'spear',eye:'#3a3a40'},
 aide:{name:'작전 보좌관',skin:'pale',hair:'#2a2430',style:'swept',body:'coat',coat:'#3f3a63',trim:'#c9b07a',legs:'#2a2840',boots:'#1f1d2a',weapon:'papers',eye:'#4a3a5a'}
};
export function figureSprite(id,{frame=0}={}){return cached(`fig${id}:${frame}`,()=>drawFigure(CAST[id]||CAST.bandit,frame));}
function drawFigure(S,frame){
 const p=new Pix(40,52),sk=ramp(SKIN[S.skin]||S.skin),hr=ramp(S.hair),coat=ramp(S.coat),trim=ramp(S.trim),legs=ramp(S.legs),boots=ramp(S.boots),big=S.big?1:0,small=S.small?1:0,lift=frame===1?1:0;
 const top=small?8:0; // children stand shorter
 const cx=20,headY=16+top+(S.stoop?2:0)+lift,bodyTop=26+top+lift,hip=39+(small?3:0);
 // ---- behind the body ----
 if(S.cape){const cr=ramp(S.cape);p.poly([[cx-9,bodyTop],[cx+9,bodyTop],[cx+12,48],[cx-12,48]],cr[1]);for(let y=bodyTop;y<48;y++)p.set(cx-10-(y-bodyTop)/8,y,cr[2]);}
 if(S.back==='quiver'){const q=ramp('#7a5434');p.box(cx+5,bodyTop-7,5,14,q);for(let i=0;i<3;i++){p.set(cx+6+i*1,bodyTop-9,col('#e8e0c8'));p.set(cx+6+i,bodyTop-8,col('#c9443a'));}}
 if(S.weapon==='bow'){const b=ramp('#8a5a32');for(let i=0;i<22;i++){const y=bodyTop-6+i,x=cx-14+Math.round(Math.sin(i/21*Math.PI)*-4);p.set(x,y,b[i<11?3:2]);p.set(x-1,y,b[1]);}p.line(cx-14,bodyTop-6,cx-14,bodyTop+15,col('#efe6c8'));}
 // ---- legs and boots ----
 const legTop=hip-1,legL=cx-6+big*-1,legR=cx+1+big;
 if(['robe'].includes(S.body)){p.poly([[cx-8-big,bodyTop+6],[cx+8+big,bodyTop+6],[cx+10+big,49],[cx-10-big,49]],coat[2]);for(let y=bodyTop+6;y<49;y++){const half=8+big+(y-bodyTop-6)*2/(49-bodyTop-6);p.set(cx-half,y,coat[3]);p.set(cx+half-1,y,coat[1]);p.set(cx+half-2,y,coat[1]);if(y%5===0)p.set(cx+2,y,coat[1]);}p.rect(cx-9-big,47,19+2*big,1,trim[2]);p.box(cx-6,49,5,2,boots);p.box(cx+1,49,5,2,boots);}
 else{p.box(legL,legTop,5,9-lift,legs);p.box(legR,legTop,5,9-lift,legs);p.box(legL-1,47-lift,6,3+lift,boots);p.box(legR,47-lift,6,3+lift,boots);p.rect(legL-1,46-lift,6,1,boots[3]);p.rect(legR,46-lift,6,1,boots[3]);}
 // ---- torso ----
 const tw=8+big*2-small,tTop=bodyTop,tBot=hip+1;
 const shirt=S.body==='plate'?ramp('#b9c6ca'):coat;
 p.poly([[cx-tw-1,tTop+1],[cx+tw+1,tTop+1],[cx+tw-1,tBot],[cx-tw+1,tBot]],shirt[2]);
 for(let y=tTop+1;y<=tBot;y++){const k=(y-tTop)/(tBot-tTop),half=tw+1-k*2;p.set(cx-half,y,shirt[3]);p.set(cx-half+1,y,shirt[3]);p.set(cx+half-1,y,shirt[1]);p.set(cx+half-2,y,shirt[1]);}
 if(S.body==='plate'){const tb=ramp(S.tabard);p.poly([[cx-5,tTop+3],[cx+5,tTop+3],[cx+6,tBot+5],[cx-6,tBot+5]],tb[2]);for(let y=tTop+3;y<tBot+5;y++){p.set(cx-5,y,tb[3]);p.set(cx+4,y,tb[1]);p.set(cx+5,y,tb[1]);}p.rect(cx-6,tBot-3,12,2,ramp('#5a3e2a')[2]);p.set(cx,tBot-3,trim[3]);p.rect(cx-6,tBot+5,13,1,trim[1]);
  // pauldrons
  p.ball(cx-tw-1,tTop+2,4,3.5,ramp('#b9c6ca'));p.ball(cx+tw+1,tTop+2,4,3.5,ramp('#b9c6ca'));}
 if(S.body==='leather'){p.rect(cx-tw+1,tTop+9,2*tw-2,2,ramp('#4a3424')[2]);p.set(cx,tTop+9,trim[3]);p.line(cx-tw+1,tTop+1,cx+tw-2,tTop+12,ramp('#4a3424')[1]);}
 if(S.body==='robe'){p.rect(cx-1,tTop+1,2,tBot-tTop,trim[2]);p.rect(cx-tw+1,tBot-3,2*tw-2,2,trim[3]);p.set(cx,tBot-3,col('#ffffff'));}
 if(S.body==='jacket'){p.poly([[cx-2,tTop+1],[cx+2,tTop+1],[cx+1,tBot],[cx-1,tBot]],ramp('#d9c8a4')[2]);p.rect(cx-tw+1,tBot-4,2*tw-2,2,trim[1]);}
 if(S.body==='coat'){p.rect(cx-1,tTop+2,2,tBot-tTop+5,coat[0]);for(let i=0;i<3;i++)p.set(cx+2,tTop+4+i*3,trim[3]);p.rect(cx-tw,tBot-3,2*tw,2,ramp('#3a2a22')[2]);p.poly([[cx-tw,tBot],[cx+tw,tBot],[cx+tw+1,tBot+6],[cx-tw-1,tBot+6]],coat[1]);p.rect(cx-tw,tTop+1,2*tw,2,trim[2]);}
 if(S.body==='fur'){p.ball(cx,tTop+2,tw+3,4,ramp(S.fur));for(let i=0;i<8;i++)p.set(cx-tw+i*2.5,tTop+5,ramp(S.fur)[1]);p.rect(cx-tw+1,tBot-4,2*tw-2,3,trim[2]);p.rect(cx-2,tBot-4,4,3,col('#e8d48a'));}
 if(S.body==='apron'){const ap=ramp(S.apron);p.poly([[cx-6,tTop+4],[cx+6,tTop+4],[cx+7,tBot+6],[cx-7,tBot+6]],ap[2]);for(let y=tTop+4;y<tBot+6;y++){p.set(cx-6,y,ap[3]);p.set(cx+6,y,ap[1]);}p.rect(cx-4,tTop+9,8,4,ap[1]);}
 if(S.body==='vest'){const v=ramp(S.vest);p.poly([[cx-tw,tTop+1],[cx-2,tTop+1],[cx-2,tBot],[cx-tw+1,tBot]],v[2]);p.poly([[cx+2,tTop+1],[cx+tw,tTop+1],[cx+tw-1,tBot],[cx+2,tBot]],v[1]);p.set(cx-4,tTop+6,trim[3]);p.set(cx-4,tTop+9,trim[3]);}
 if(S.body==='shawl'){const sh=ramp(S.shawl);p.poly([[cx-tw-2,tTop],[cx+tw+2,tTop],[cx+2,tTop+11],[cx-2,tTop+11]],sh[2]);for(let x=-tw;x<tw;x+=3)p.set(cx+x,tTop+2,sh[3]);}
 if(S.body==='tunic'){p.rect(cx-tw+1,tBot-4,2*tw-2,2,ramp('#4a3424')[2]);p.rect(cx-1,tTop+1,2,4,coat[1]);}
 if(S.scarf){const sc=ramp(S.scarf);p.ball(cx,tTop+1,tw,3,sc);p.poly([[cx+3,tTop+2],[cx+7,tTop+2],[cx+9,tTop+12],[cx+6,tTop+12]],sc[2]);p.set(cx+8,tTop+11,sc[3]);}
 // ---- arms ----
 const armY=tTop+2,sleeve=S.body==='plate'?ramp('#9fb0b6'):S.body==='apron'||S.body==='vest'?ramp(S.coat):coat;
 const armL=cx-tw-4,armR=cx+tw+1;
 p.box(armL,armY,4,10,sleeve);p.box(armR,armY,4,10,sleeve);
 if(S.body==='apron'){p.box(armL,armY+3,4,7,sk);p.box(armR,armY+3,4,7,sk);}
 p.ball(armL+2,armY+11,2.4,2.2,sk);p.ball(armR+2,armY+11,2.4,2.2,sk);
 if(S.bandage){p.rect(armR,armY+6,4,2,col('#f2ece0'));p.set(armR+1,armY+7,col('#c9443a'));}
 // ---- head (large chibi head, eyes always visible) ----
 const hx=cx,hy=headY,hw=small?7:8.5,eyeTop=hy;
 p.ball(hx-hw+.3,hy+1.5,1.7,2.4,sk);p.ball(hx+hw-.3,hy+1.5,1.7,2.4,sk); // ears
 p.ball(hx,hy,hw,7.8,sk,{flat:.5,bias:.08,clean:true,hi:false});
 p.rect(hx-2,hy+7,4,2,sk[1]); // neck
 const ey=eyeTop,eL=hx-5,eR=hx+3;
 // ---- facial hair under the eyes ----
 if(S.beard==='full'||S.beard==='long'){const br=ramp(S.hair),bot=hy+(S.beard==='long'?15:10);p.poly([[hx-hw+1,hy+3],[hx+hw-1,hy+3],[hx+4,bot],[hx-4,bot]],br[2]);for(let y=hy+4;y<bot;y++){p.set(hx-hw+1+(y-hy-3)*.6,y,br[3]);p.set(hx+hw-2-(y-hy-3)*.6,y,br[1]);}for(let y=hy+5;y<bot-1;y+=2)p.set(hx+((y>>1)%2?2:-2),y,br[3]);p.rect(hx-2,ey+5,4,1,col('#5a2a2a'));}
 if(S.beard==='stubble')for(let y=ey+4;y<hy+8;y++)for(let x=hx-5;x<=hx+5;x++)if((x+y)%2===0&&p.get(x,y))p.set(x,y,sk[1]);
 if(S.beard==='mustache'){p.rect(hx-3,ey+4,7,1,hr[1]);p.set(hx-3,ey+5,hr[1]);p.set(hx+3,ey+5,hr[1]);}
 // eyes: dark lash line, coloured iris, catch-light
 for(const ex of [eL,eR]){p.rect(ex,ey,3,1,col('#231a26'));p.rect(ex,ey+1,3,2,col(S.eye));p.set(ex+(ex===eL?2:0),ey+1,col('#231a26'));p.set(ex+1,ey+1,col('#fbf6ec'));p.rect(ex,ey+3,3,1,sk[1]);}
 p.rect(eL,ey-2,3,1,hr[0]);p.rect(eR,ey-2,3,1,hr[0]);
 p.set(hx,ey+3,sk[1]);if(S.beard!=='full'&&S.beard!=='long')p.rect(hx-1,ey+5,3,1,col('#a05a50'));
 p.set(eL-1,ey+4,col('#f2a9a0'));p.set(eR+3,ey+4,col('#f2a9a0'));
 // ---- hair: cap above the brow, side locks beside the cheeks ----
 const brow=hy-3;
 if(S.style!=='bald'){
  for(let y=Math.floor(hy-hw-2);y<=hy+3;y++)for(let x=Math.floor(hx-hw-1);x<=Math.ceil(hx+hw+1);x++){const dx=(x+.5-hx)/(hw+1),dy=(y+.5-(hy-1.5))/(hw*.92);if(dx*dx+dy*dy>1)continue;const side=Math.abs(x+.5-hx)>hw-1.5;if(y>brow&&!side)continue;let t=x<hx-2?3:x>hx+3?1:2;if(y<hy-hw+1&&x<hx)t=4;if(y===brow||(side&&y>brow))t=Math.max(1,t-1);p.set(x,y,hr[t]);}
  for(let x=Math.round(hx-hw+1);x<=Math.round(hx+hw-1);x++){const len=((x*7+3)%3);for(let y=brow+1;y<=brow+len;y++)p.set(x,y,hr[x<hx?2:1]);}
  if(S.style==='long'||S.style==='braid'){p.box(Math.round(hx-hw-1.5),hy-1,3,S.style==='long'?17:9,hr);p.box(Math.round(hx+hw-1.5),hy-1,3,S.style==='long'?17:9,hr);}
  if(S.style==='braid'){for(let i=0;i<6;i++)p.ball(hx-hw-1,hy+9+i*2.4,1.9,1.5,hr);p.set(hx-hw-1,hy+24,col('#d8b46a'));}
  if(S.style==='spiky')for(let i=0;i<5;i++){const x=hx-7+i*3.5;p.poly([[x,hy-hw+1],[x+4,hy-hw+1],[x+2.5+(i%2),hy-hw-4]],hr[i<2?3:2]);}
  if(S.style==='mohawk'){for(let y=Math.floor(hy-hw);y<=brow;y++)for(let x=Math.floor(hx-hw);x<=hx+hw;x++)if(Math.abs(x+.5-hx)>2&&p.get(x,y)===hr[3]||Math.abs(x+.5-hx)>2&&p.get(x,y)===hr[2]||Math.abs(x+.5-hx)>2&&p.get(x,y)===hr[1]||Math.abs(x+.5-hx)>2&&p.get(x,y)===hr[4])p.set(x,y,sk[x<hx?3:1]);p.box(hx-2,hy-hw-5,4,8,hr);}
  if(S.style==='swept')p.poly([[hx-hw,brow],[hx+hw+1,brow-4],[hx+hw+1,brow+2]],hr[2]);
 } else {p.set(hx-3,hy-6,sk[4]);p.set(hx-2,hy-6,sk[4]);p.set(hx-3,hy-5,sk[4]);if(S.hair){p.box(Math.round(hx-hw),hy-1,2,4,hr);p.box(Math.round(hx+hw-1),hy-1,2,4,hr);}}
 // ---- headgear ----
 const capY=brow;
 if(S.helm==='knight'){const m=ramp('#c4d0d4');p.ball(hx,hy-3,hw+1.4,6.4,m,{maxY:capY});p.rect(Math.round(hx-hw-1),capY,Math.round(2*hw+3),2,m[1]);p.rect(Math.round(hx-hw-1),capY,Math.round(2*hw+3),1,m[3]);p.box(hx-1,hy-hw-8,3,6,ramp(S.trim));p.box(Math.round(hx-hw-1.5),capY,3,8,m);p.box(Math.round(hx+hw-1.5),capY,3,8,m);}
 if(S.helm==='kettle'){const m=ramp(S.helmColor);p.ball(hx,hy-3,hw+.8,6,m,{maxY:capY});p.box(Math.round(hx-hw-3),capY,Math.round(2*hw+7),2,m);}
 if(S.helm==='cap'){const m=ramp(S.helmColor);p.ball(hx,hy-3,hw+.8,6,m,{maxY:capY});p.rect(Math.round(hx-hw),capY,Math.round(2*hw+1),1,m[1]);}
 if(S.helm==='beret'){const m=ramp(S.helmColor);p.ball(hx-1,hy-5,hw+2,4,m,{maxY:capY});p.set(hx+4,hy-10,col('#d8b46a'));}
 if(S.helm==='straw'){const m=ramp(S.helmColor);p.ball(hx,hy-6,hw-1,4,m);p.ball(hx,capY-.5,hw+5,2.4,m,{flat:.5});p.rect(Math.round(hx-hw+1),capY-2,Math.round(2*hw-1),1,col('#a2463a'));}
 if(S.bandana){const b=ramp(S.bandana);p.ball(hx,hy-3,hw+.8,6,b,{maxY:capY});p.rect(Math.round(hx-hw),capY,Math.round(2*hw+1),1,b[1]);p.poly([[hx+hw-1,capY],[hx+hw+5,capY+3],[hx+hw+3,capY+5],[hx+hw-1,capY+2]],b[2]);}
 const wrap=(r,top,bottom,widen,tones)=>{for(let y=Math.floor(hy-top);y<=hy+bottom;y++)for(let x=Math.floor(hx-hw-widen);x<=Math.ceil(hx+hw+widen);x++){const dx=(x+.5-hx)/(hw+widen),dy=(y+.5-(hy-1))/((top+bottom)/2+1);const face=Math.abs(x+.5-hx)<hw-1.2&&y>brow-1&&y<hy+8;if(dx*dx+dy*dy<=1&&!face)p.set(x,y,r[tones(x,y)]);}};
 if(S.hood){const hd=ramp(S.hood);wrap(hd,hw+3,9,3,(x,y)=>x<hx-3?3:y>hy+4?1:2);p.rect(Math.round(hx-hw+1),brow-1,Math.round(2*hw-1),1,hd[0]);}
 if(S.veil){const v=ramp(S.veil);wrap(v,hw+3,10,3,(x)=>x<hx-3?4:x>hx+4?2:3);p.rect(Math.round(hx-hw+1),brow-1,Math.round(2*hw-1),1,ramp(S.trim)[2]);p.box(hx-1,hy-hw-3,3,3,ramp(S.trim));}
 if(S.scarfHead){const v=ramp(S.scarfHead);wrap(v,hw+2,4,2,(x)=>x<hx?3:2);p.poly([[hx+hw-2,hy+2],[hx+hw+3,hy+4],[hx+hw+1,hy+9]],v[1]);}
 if(S.hat==='witch'){const h=ramp(S.hatColor);p.ball(hx,capY-1,hw+7,2.8,h,{flat:.5});p.poly([[hx-hw+1,capY-2],[hx+hw,capY-2],[hx+6,capY-12],[hx+11,capY-18],[hx+2,capY-11]],h[2]);for(let y=capY-11;y<capY-2;y++)p.set(hx-hw+2+(capY-2-y)*.45,y,h[3]);p.rect(Math.round(hx-hw+1),capY-4,Math.round(2*hw-1),2,ramp(S.trim)[2]);p.set(hx+3,capY-4,col('#ffffff'));p.set(hx+11,capY-18,h[3]);}
 // ---- weapons in front ----
 const handL=[armL+2,armY+11],handR=[armR+2,armY+11];
 if(S.weapon==='sword'){const bl=ramp('#d9e2e6');p.box(handR[0]+1,handR[1]-17,3,16,bl);p.rect(handR[0]+2,handR[1]-17,1,15,col('#ffffff'));p.box(handR[0]-1,handR[1]-2,7,2,ramp('#c9a24a'));p.ball(handR[0]+2,handR[1],2,2,sk);}
 if(S.off==='shield'){const sh=ramp(S.shield);p.poly([[handL[0]-6,handL[1]-10],[handL[0]+5,handL[1]-10],[handL[0]+5,handL[1]+2],[handL[0],handL[1]+8],[handL[0]-6,handL[1]+2]],sh[2]);for(let y=handL[1]-10;y<handL[1]+6;y++){p.set(handL[0]-6+(y>handL[1]+2?(y-handL[1]-2):0),y,sh[3]);p.set(handL[0]+4-(y>handL[1]+2?(y-handL[1]-2):0),y,sh[1]);}p.rect(handL[0]-6,handL[1]-10,12,1,ramp('#d6b25e')[3]);p.rect(handL[0]-1,handL[1]-8,2,12,ramp('#e1c27a')[2]);p.rect(handL[0]-4,handL[1]-5,8,2,ramp('#e1c27a')[2]);}
 if(S.weapon==='bow'&&!S.back){} // archer bow already drawn
 if(S.weapon==='staff'){const w=ramp('#7a5232');p.box(handR[0],handR[1]-20,2,30,w);const o=ramp(S.orb);p.ball(handR[0]+1,handR[1]-23,3.6,3.6,o);p.set(handR[0],handR[1]-25,col('#ffffff'));p.box(handR[0]-1,handR[1]-19,4,2,ramp('#c9a24a'));p.ball(handR[0]+1,handR[1],2.2,2,sk);}
 if(S.weapon==='holy'){const w=ramp('#d8c48c');p.box(handR[0],handR[1]-18,2,28,w);const g=ramp('#e8b84a');p.ball(handR[0]+1,handR[1]-21,3.2,3.2,g);for(const [a,b]of[[0,-5],[0,4],[-5,0],[4,0]])p.set(handR[0]+1+a,handR[1]-21+b,col('#fff3b0'));p.ball(handR[0]+1,handR[1],2.2,2,sk);}
 if(S.weapon==='daggers'){const bl=ramp('#d5dde0');for(const [x,y,d]of[[handR[0]+1,handR[1]-7,1],[handL[0]-2,handL[1]-7,-1]]){p.box(x,y,2,7,bl);p.rect(x-1,y+6,4,1,ramp('#c26a36')[2]);}}
 if(S.weapon==='axe'){const w=ramp('#6a4a30');p.box(handR[0],handR[1]-14,2,18,w);const bl=ramp('#c5ccc8');p.poly([[handR[0]+2,handR[1]-14],[handR[0]+8,handR[1]-16],[handR[0]+8,handR[1]-6],[handR[0]+2,handR[1]-8]],bl[2]);p.line(handR[0]+8,handR[1]-16,handR[0]+8,handR[1]-6,bl[4]);}
 if(S.weapon==='greataxe'){const w=ramp('#5a3a24');p.box(handR[0],handR[1]-22,3,30,w);const bl=ramp('#b8c0bc');for(const d of[1,-1]){const bx=handR[0]+(d>0?3:0);p.poly([[bx,handR[1]-22],[bx+d*9,handR[1]-25],[bx+d*10,handR[1]-12],[bx,handR[1]-14]],bl[d>0?2:3]);}}
 if(S.weapon==='torch'){const w=ramp('#6a4a30');p.box(handR[0],handR[1]-12,2,14,w);p.ball(handR[0]+1,handR[1]-15,3,4,ramp('#f08a3a'),{bias:.3});p.ball(handR[0]+1,handR[1]-16,1.6,2.4,ramp('#ffd27a'),{bias:.4});}
 if(S.weapon==='ledger'){p.box(handL[0]-3,handL[1]-6,7,9,ramp('#6a3a2a'));p.rect(handL[0]-2,handL[1]-5,5,1,col('#e8dcc0'));}
 if(S.weapon==='cane'){p.box(handR[0]+1,handR[1]-4,2,16,ramp('#7a5a3a'));p.box(handR[0]-1,handR[1]-5,5,2,ramp('#7a5a3a'));}
 if(S.weapon==='hammer'){p.box(handR[0],handR[1]-10,2,12,ramp('#6a4a30'));p.box(handR[0]-3,handR[1]-14,8,5,ramp('#8a9094'));}
 if(S.weapon==='satchel'){const b=ramp('#8a5a34');p.box(cx-tw-3,hip-4,7,7,b);p.line(cx-tw-1,tTop+1,cx+tw-2,hip-4,b[1]);p.set(cx-tw,hip-2,col('#d8b46a'));}
 if(S.weapon==='bundle'){p.ball(cx+tw+2,hip-6,5,5,ramp('#b8a07a'));p.line(cx+tw-1,tTop+1,cx+tw+3,hip-10,ramp('#6a5a44')[1]);}
 if(S.weapon==='spear'){p.box(handR[0],handR[1]-26,2,34,ramp('#7a5a3a'));p.poly([[handR[0]-1,handR[1]-26],[handR[0]+3,handR[1]-26],[handR[0]+1,handR[1]-33]],ramp('#d0d8dc')[3]);}
 if(S.weapon==='papers'){p.box(handL[0]-3,handL[1]-5,6,8,ramp('#efe6cf'));p.rect(handL[0]-2,handL[1]-3,4,1,col('#8a7a5a'));p.rect(handL[0]-2,handL[1]-1,4,1,col('#8a7a5a'));}
 if(S.weapon==='sheathed'){p.line(cx-tw-1,hip-1,cx-tw-6,hip+8,ramp('#3a2a22')[2]);p.line(cx-tw,hip-1,cx-tw-5,hip+8,ramp('#3a2a22')[3]);p.box(cx-tw-1,hip-3,3,2,ramp('#c9a24a'));}
 return p.outline();
}

// ---------- scene composition ----------
export function drawShadow(c,x,y,w=14,h=4){c.fillStyle='rgba(20,24,30,.32)';c.beginPath();c.ellipse(x,y,w,h,0,0,Math.PI*2);c.fill();}
export function drawFlame(c,x,y,t,s=1){for(let i=0;i<5;i++){const ph=t/120+i*1.7,h=(10+6*Math.sin(ph))*s,w=4*s;c.fillStyle=i%2?'#ffcf6a':'#f07a32';c.fillRect(Math.round(x-8*s+i*4*s),Math.round(y-h),Math.round(w),Math.round(h));}c.fillStyle='#fff2b0';c.fillRect(Math.round(x-2*s),Math.round(y-8*s),Math.round(4*s),Math.round(5*s));}
