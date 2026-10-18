// Logical world coordinates; output backing resolution never alters hit testing.
export class MapCamera{
 constructor(){this.zoom=1;this.target=null;this.offset={x:0,y:0};this.current=null;this.key=null;}
 reset(){this.zoom=1;this.offset={x:0,y:0};this.target=null;this.current=null;}
 focus(x,y){this.target={x,y};this.offset={x:0,y:0};}
 zoomBy(factor){this.zoom=Math.max(.35,Math.min(2.4,this.zoom*factor));}
 panBy(x,y){this.offset.x+=x;this.offset.y+=y;}
 layout(width,height,mapWidth,mapHeight,{follow=null,key='',smooth=true}={}){
  if(this.key!==key){this.key=key;this.reset();}
  const base=width<600||height<300?40:64,tilePixels=Math.max(base,Math.min(width/mapWidth,base*1.5))*this.zoom,scale=tilePixels/64;
  const point=this.target||follow||{x:mapWidth/2-.5,y:mapHeight/2-.5};
  const clamp=(v,extent,view)=>extent<=view?(view-extent)/2:Math.max(view-extent,Math.min(0,v));
  let x=clamp(width/2-(point.x+.5)*tilePixels+this.offset.x,mapWidth*tilePixels,width),y=clamp(height/2-(point.y+.5)*tilePixels+this.offset.y,mapHeight*tilePixels,height);
  if(smooth&&this.current&&Math.abs(this.current.scale-scale)<.001){x=this.current.x+(x-this.current.x)*.3;y=this.current.y+(y-this.current.y)*.3;}
  this.current={x:Math.round(x*2)/2,y:Math.round(y*2)/2,scale,width,height,mapWidth,mapHeight};return this.current;
 }
 tileAt(px,py){const {x,y,scale}=this.current||{x:0,y:0,scale:1};return {x:Math.floor((px-x)/scale/64),y:Math.floor((py-y)/scale/64)};}
}
export function drawMinimap(canvas,map,actors,camera,objectives=[]){
 const c=canvas.getContext('2d'),w=map[0].length,h=map.length;canvas.width=192;canvas.height=Math.round(192*h/w);c.imageSmoothingEnabled=false;const sx=canvas.width/w,sy=canvas.height/h;
 const colors={f:'#395e4b',g:'#73835b',r:'#b9a17a',x:'#4b5050',w:'#477b96',b:'#bb9361',v:'#98734d',m:'#89917d',s:'#556f63',d:'#c2ad7b'};
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){c.fillStyle=colors[map[y][x]]||'#987655';c.fillRect(x*sx,y*sy,sx+.5,sy+.5);}
 for(const o of objectives){c.fillStyle='#f3dc83';c.fillRect(o.x*sx-1,o.y*sy-1,sx+2,sy+2);}
 for(const a of actors.filter(a=>a.hp!==0&&!a.rescued)){c.fillStyle=a.team==='enemy'?'#fa7d75':a.team==='civilian'?'#f5dfa2':'#86e0ef';c.fillRect(a.x*sx+sx*.2,a.y*sy+sy*.2,sx*.6,sy*.6);}
 if(camera){c.strokeStyle='#fff7d4';c.lineWidth=2;c.strokeRect(Math.max(0,-camera.x/camera.scale/64)*sx,Math.max(0,-camera.y/camera.scale/64)*sy,Math.min(w,camera.width/camera.scale/64)*sx,Math.min(h,camera.height/camera.scale/64)*sy);}
}
