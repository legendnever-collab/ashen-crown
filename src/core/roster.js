// v0.6 (Phase C, D-055 Q2): an ACT II recruit joins the legion. The hero record starts at the given level
// (base stats plus that many level-ups of growth), gets empty equipment slots and appears on the hub roster.
import {RECRUIT_HEROES,heroDef} from '../data/game-data.js';
export function recruitRecord(id,level=1){
 const h=heroDef(id),u={...structuredClone(h),team:'ally',maxHP:h.hp,maxMP:h.mp,xp:0,earnedXP:0,growthHistory:[],clues:[],highlights:[],healTargets:[],appearanceTier:1,classTier:1};
 for(let lv=2;lv<=level;lv++){const changes={...h.growth};for(const [k,n]of Object.entries(changes)){if(k==='hp')u.maxHP+=n;else if(k==='mp')u.maxMP+=n;else u[k]+=n;}u.level=lv;u.growthHistory.push({level:lv,changes});}
 u.hp=u.maxHP;u.mp=u.maxMP;return u;
}
export function joinRoster(s,id,level=1){
 if(!RECRUIT_HEROES.some(h=>h.id===id))return false;const c=s.campaign;c.roster??=[];if(c.roster.includes(id))return false;
 c.roster.push(id);const rec=recruitRecord(id,level);if(Array.isArray(c.heroes))c.heroes.push(rec);
 for(const e of [c.economy,s.economy])if(e?.equipped&&!e.equipped[id])e.equipped[id]={weapon:null,armor:null,accessory:null};
 for(const f of [s.frontier,c.frontier])if(f){if(!f.members.includes(id))f.members.push(id);f.affiliation[id]='affiliated';}
 return true;
}
