// v2.0.0 (REFORM_DESIGN §4.2, D-115): on the battlefield the same class wears the same figure; the side is its colour
// (legion blue, enemy red, allied banners in their own colours, neutral brown) and the heroes and officers carry a
// pennant in their own colour. Hubs, rooms and story scenes keep the personal figures. Pack H1 delivers one sheet per
// class and tier (ASHEN_CLASS_SPRITES, cloth marked magenta for the colour); until then a close painted sheet stands in.
import {hdCastFor} from './hd-world.js';
import {classKeyOf} from '../core/stats8.js';
export const SIDE_COLOR={ally:'#3a78d8',allied:'#d8b03a',enemy:'#d8443a',neutral:'#8a6a48'};
export const FACTION_COLOR={iron:'#8c96a6',free:'#4fa86a',flame:'#e8d8a0'};
const LOOK_FACTION={ironInfantry:'iron',ironArcher:'iron',ironSpear:'iron',cavalry:'iron',lion:'iron',flameKnight:'flame',lordA:'free',lordB:'free',guard:'free'};
export const TEMP_CLASS_SHEETS={infantry:['ironInfantry','guard','flameKnight'],spear:['ironSpear','mercSpear','ritualKnight'],archer:['archer','ironArcher','fortArcher'],
 cavalry:['cavalry','thea_t2','thea_t3'],mage:['ritualist','lia_t2','lia_t3'],healer:['pilgrim','sain_t2','sain_t3'],rogue:['grayCloak','kai_t2','kai_t3'],shield:['bearer','ines_t2','ines_t3']};
// Major figures keep their own painting (story weight, not rank and file): the king, Bellard, Aren, the three leaders, specials.
const OWN_FIGURE=new Set(['bellard','king','aren','cassian','leonora','lucien','harvester','guardianStatue','clerk','child','advisor']);
const H1=typeof ASHEN_CLASS_SPRITES!=='undefined'?ASHEN_CLASS_SPRITES:null;
export const unitTier=u=>u?.team==='ally'?Math.max(1,Math.min(3,u.classTier||1)):(u?.level||1)>=16?3:(u?.level||1)>=8?2:1;
export function battleFigure(u,missionId){const cls=classKeyOf(u),own=hdCastFor(u,missionId);
 if(!cls||OWN_FIGURE.has(own)||OWN_FIGURE.has(u.look)||u.team==='civilian'||u.team==='object'||u.team==='commander'||u.remnant||u.memory28)return {cast:own,tint:null,mask:false};
 const t=unitTier(u),h1=H1?.[`class_${cls}_${t}`];const side=u.neutral?'neutral':u.team==='allied'?'allied':u.team==='enemy'?'enemy':'ally';
 const color=side==='allied'&&LOOK_FACTION[u.look]?FACTION_COLOR[LOOK_FACTION[u.look]]:SIDE_COLOR[side];
 return {cast:h1?`class_${cls}_${t}`:TEMP_CLASS_SHEETS[cls][t-1],tint:color,mask:!!h1};}
// The pennant over a hero's or officer's head (their own colour, the first letter of their name).
export function drawPennant(c,u,x,y,color){if(!color)return;c.save();c.fillStyle='rgba(20,18,16,.55)';c.fillRect(x+8,y-62,2,20);c.fillStyle=color;c.beginPath();c.moveTo(x+10,y-62);c.lineTo(x+26,y-57);c.lineTo(x+10,y-51);c.closePath();c.fill();c.strokeStyle='rgba(255,246,220,.85)';c.lineWidth=1;c.stroke();
 c.fillStyle='#fff8e6';c.font='bold 8px sans-serif';c.textAlign='center';c.fillText(String(u.name||'').slice(0,1),x+15,y-54);c.restore();}
