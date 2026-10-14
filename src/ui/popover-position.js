// Keep actionable map targets clear wherever the viewport has enough room.
export function placePopover({width,height,popupWidth,popupHeight,anchor,protectedPoints=[]}){
 const margin=6,maxX=Math.max(margin,width-popupWidth-margin),maxY=Math.max(margin,height-popupHeight-margin),clamp=(v,max)=>Math.max(margin,Math.min(max,v));
 const xs=[anchor.x+20,anchor.x-popupWidth-20,anchor.x-popupWidth/2,margin,maxX],ys=[anchor.y-popupHeight-23,anchor.y+23,anchor.y-popupHeight/2,margin,maxY];let best=null;
 for(const x0 of xs)for(const y0 of ys){const x=clamp(x0,maxX),y=clamp(y0,maxY);let score=Math.hypot(x+popupWidth/2-anchor.x,y+popupHeight/2-anchor.y);
  for(const p of protectedPoints){const r=p.radius??12;if(p.x+r>x&&p.x-r<x+popupWidth&&p.y+r>y&&p.y-r<y+popupHeight)score+=(p.x>x&&p.x<x+popupWidth&&p.y>y&&p.y<y+popupHeight?1000000:100)*(p.weight??1);}
  if(!best||score<best.score)best={x,y,score};
 }return {x:Math.round(best.x),y:Math.round(best.y)};
}
