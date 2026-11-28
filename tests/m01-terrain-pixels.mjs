// Sample empty terrain and scenery on the real battle canvas, independently of the minimap.
export async function terrainPixels(page){
 return page.evaluate(()=>{
  const canvas=document.querySelector('#battle-map'),ctx=canvas.getContext('2d');
  const box=canvas.getBoundingClientRect(),ratio=canvas.width/box.width;
  const colors={};
  for(const [name,x,y] of [['grass',7,3],['road',11,6],['forest',1,6],['house',8,5]]){
   const p=AshenCrown.tileCenter(x,y),tileWidth=AshenCrown.tileCenter(x+1,y).x-p.x;
   const size=Math.max(3,Math.round(tileWidth*ratio*.7));
   const pixels=ctx.getImageData(Math.round(p.x*ratio-size/2),Math.round(p.y*ratio-size/2),size,size).data;
   let green=0,brown=0,background=0;
   for(let i=0;i<pixels.length;i+=4){
    const [r,g,b]=pixels.subarray(i,i+3);
    if(g>r+5&&g>b+15)green++;
    if(r>g+12&&g>b+10)brown++;
    if(r===23&&g===43&&b===43)background++;
   }
   colors[name]={green:green/(size*size),brown:brown/(size*size),background:background/(size*size)};
  }
  return colors;
 });
}
