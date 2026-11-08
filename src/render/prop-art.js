// v0.9.1 (ACT III art pack F2, D-088): painted battle-map props — the ward tree standing, wounded and felled, and the
// sleeping guardian statue (src/assets/props/<id>.webp, 128×128 cells with the map sprites' anchor 64,120). Until an
// image has decoded the caller draws its game-drawn prop.
import {PAINTED_CELL} from './hd-world.js';
const PROPS=typeof ASHEN_PROPS!=='undefined'?ASHEN_PROPS:null,propImages=new Map();
export function paintedProp(id){const src=PROPS?.[id];if(!src||typeof Image==='undefined')return null;let img=propImages.get(id);
 if(!img){img=new Image();img.decoding='async';img.onerror=()=>{img.failed=true;};img.src=src;propImages.set(id,img);img.decode?.().catch(()=>{});}
 return img.complete&&img.naturalWidth&&!img.failed?img:null;}
// draws the prop with its base on the unit's foot point (x, footY); `scale` 1 = a map figure's cell.
export function drawProp(c,id,x,footY,scale=1){const img=paintedProp(id);if(!img)return false;const D=PAINTED_CELL*scale;
 c.save();c.imageSmoothingEnabled=true;c.imageSmoothingQuality='low';c.drawImage(img,x-D/2,footY-D*120/128,D,D);c.restore();return true;}
export const wardTreeProp=u=>u.hp<=0?'wardTree_felled':u.hp<u.maxHP*.6?'wardTree_hurt':'wardTree';
