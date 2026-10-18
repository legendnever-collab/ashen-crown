// Classic SRPG placement: the command list sits right beside the unit (right side first, then
// left, below, above). It never covers the unit itself and avoids legal targets when a
// beside-the-unit slot exists; it is always clamped inside the field.
export function placePopover({width,height,popupWidth,popupHeight,anchor,tile=48,protectedPoints=[]}){
 const margin=6,gap=Math.max(14,tile/2+6),maxX=Math.max(margin,width-popupWidth-margin),maxY=Math.max(margin,height-popupHeight-margin),clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
 const half=Math.max(10,tile/2);
 const slots=[
  {x:anchor.x+gap,y:anchor.y-popupHeight/2,side:'right'},
  {x:anchor.x-gap-popupWidth,y:anchor.y-popupHeight/2,side:'left'},
  {x:anchor.x-popupWidth/2,y:anchor.y+gap,side:'below'},
  {x:anchor.x-popupWidth/2,y:anchor.y-gap-popupHeight,side:'above'}];
 let best=null;
 slots.forEach((slot,order)=>{
  const fitsX=slot.x>=margin&&slot.x+popupWidth<=width-margin,fitsY=slot.y>=margin&&slot.y+popupHeight<=height-margin;
  const x=clamp(slot.x,margin,maxX),y=clamp(slot.y,margin,maxY);
  const covers=(p,r)=>p.x+r>x&&p.x-r<x+popupWidth&&p.y+r>y&&p.y-r<y+popupHeight;
  let score=order*10;
  if((slot.side==='right'||slot.side==='left')&&!fitsX)score+=5000;
  if((slot.side==='below'||slot.side==='above')&&!fitsY)score+=5000;
  if(covers(anchor,half))score+=1000000;
  for(const p of protectedPoints)if(covers(p,p.radius??12))score+=100*(p.weight??1);
  if(!best||score<best.score)best={x,y,score,side:slot.side};
 });
 return {x:Math.round(best.x),y:Math.round(best.y),side:best.side};
}
