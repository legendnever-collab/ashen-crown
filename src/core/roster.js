// v0.6 (Phase C, D-055 Q2): an ACT II recruit joins the legion. The hero record starts at the given level
// (base stats plus that many level-ups of growth), gets empty equipment slots and appears on the hub roster.
import {RECRUIT_HEROES,heroDef} from '../data/game-data.js';
import {deployZoneOf} from './game.js';
import {at,terrainAt} from './rules.js';
import {ensureStats} from './stats8.js';
export function recruitRecord(id,level=1){
 const h=heroDef(id),u={...structuredClone(h),team:'ally',maxHP:h.hp,maxMP:h.mp,xp:0,earnedXP:0,growthHistory:[],clues:[],highlights:[],healTargets:[],appearanceTier:1,classTier:1};
 for(let lv=2;lv<=level;lv++){const changes={...h.growth};for(const [k,n]of Object.entries(changes)){if(k==='hp')u.maxHP+=n;else if(k==='mp')u.maxMP+=n;else u[k]+=n;}u.level=lv;u.growthHistory.push({level:lv,changes});}
 delete u.hp;ensureStats(u);u.hp=u.maxHP;u.mp=u.maxMP;return u; // v2.0.0: stats at the join level (stats8.statsAt)
}
// v0.9.0: `record` brings back a recruit's own record (the one kept aside in campaign.departed) instead of a new one.
export function joinRoster(s,id,level=1,record=null){
 if(!RECRUIT_HEROES.some(h=>h.id===id))return false;const c=s.campaign;c.roster??=[];if(c.roster.includes(id))return false;
 c.roster.push(id);const rec=record?structuredClone(record):recruitRecord(id,level);if(Array.isArray(c.heroes))c.heroes.push(rec);
 for(const e of [c.economy,s.economy])if(e?.equipped&&!e.equipped[id])e.equipped[id]={weapon:null,armor:null,accessory:null,treasure:null};
 for(const f of [s.frontier,c.frontier])if(f){if(!f.members.includes(id))f.members.push(id);f.affiliation[id]='affiliated';}
 // The current state's board gains the hero in reserve (a free deployment tile), so the save stays whole.
 if(Array.isArray(s.units)&&!s.units.some(u=>u.id===id)){const tile=[...deployZoneOf(s)].map(k=>k.split(',').map(Number)).find(([x,y])=>!at(s,x,y)&&!s.units.some(u=>u.x===x&&u.y===y)&&Number.isFinite(terrainAt(x,y,s)?.cost))||[0,0];
  s.units.push({...structuredClone(rec),x:tile[0],y:tile[1],moved:false,acted:false,hitThisTurn:false,shadowBonus:0,guardTarget:null,benched:true});
  s.missionStart?.push({id,level:rec.level,stats:{maxHP:rec.maxHP,atk:rec.atk,def:rec.def,mag:rec.mag}});}
 return true;
}

// v2.0.0 부장 (REFORM_DESIGN §5.2, D-115): who joins when — 0 = before M01, n = after Mission n is won. Joining needs no
// scene; an officer arrives at the party's average level −1 (at least 1). Old saves gain the officers they have earned.
export const OFFICER_JOIN={bram:0,noa:0,marta:0,rowell:4};
export function ensureOfficers(c,missionId=1){if(!c)return [];c.roster??=[];const done=new Set(c.completed||[]),added=[];
 const levels=(c.heroes||[]).filter(h=>h&&!OFFICER_JOIN[h.id]&&OFFICER_JOIN[h.id]!==0).map(h=>h.level||1),avg=levels.length?levels.reduce((a,b)=>a+b,0)/levels.length:1;
 for(const [id,after] of Object.entries(OFFICER_JOIN)){if(c.roster.includes(id))continue;if(after>0&&!done.has(after))continue;
  c.roster.push(id);added.push(id);if(Array.isArray(c.heroes)&&!c.heroes.some(h=>h.id===id))c.heroes.push(recruitRecord(id,Math.max(1,Math.round(avg)-1)));
  for(const e of [c.economy])if(e?.equipped&&!e.equipped[id])e.equipped[id]={weapon:null,armor:null,accessory:null,treasure:null};
  if(c.frontier){if(!c.frontier.members.includes(id))c.frontier.members.push(id);c.frontier.affiliation[id]='affiliated';}}
 return added;}
