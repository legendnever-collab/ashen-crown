import {HUBS,INTERIORS,RECRUITS,NPC_LINES} from '../data/frontier-data.js';
import {COUNCIL_V04} from '../data/story-v04.js';
import {COUNCIL_V06} from '../data/story-v06.js';
import {COUNCIL_V061} from '../data/story-v061.js';
import {COUNCIL_V070} from '../data/story-v070.js';
import {COUNCIL_V071} from '../data/story-v071.js';
import {enqueueStory,openStory,introStory,setStoryFlag} from './narrative.js';
import {STORY} from '../data/story.js';
import {ensureEconomy} from './economy.js';
import {hubFor} from '../data/hubs-v05.js';
import {ALL_HEROES,heroDef} from '../data/game-data.js';
import {paintedRoom} from '../data/rooms-v06.js';
export {hubFor};
export function frontierState(missionId=1){const hub=hubFor(missionId),[x,y]=HUBS[hub].spawn;return {actorId:'eric',campaignEntry:'advisor',advisorPending:false,hub,x,y,facing:'down',visited:Object.fromEntries(Object.keys(HUBS).map(id=>[id,['square']])),events:[],affiliation:{eric:'affiliated',elina:'affiliated',lia:'available',sain:'available',kai:'available'},members:['eric','elina','lia','sain','kai'],phase:'preparation',pendingRecruit:null,ready:{equipment:false,items:false,formation:false,objective:false}};}
export function ensureFrontier(s){if(!s.frontier)s.frontier=structuredClone(s.campaign.frontier||frontierState(s.missionId));for(const id of s.campaign.roster||[])if(!s.frontier.members.includes(id)){s.frontier.members.push(id);s.frontier.affiliation[id]='affiliated';}ensureEconomy(s);return s.frontier;}
export function syncFrontier(s){if(!s.practice)s.campaign.frontier=structuredClone(s.frontier);}
export function enterHub(s,{aftermath=false,story=true}={}){const f=ensureFrontier(s);fillVisited(f);const hub=hubFor(s.missionId,aftermath?'aftermath':'preparation');if(story&&!s.practice&&s.missionId===1&&!aftermath)enqueueStory(s,'world:intro');if(f.hub!==hub&&story&&!s.practice)enqueueStory(s,`world:${hub}`);if(f.hub!==hub){delete f.interior;delete f.interiorBuilding;delete f.returnPosition;f.hub=hub;[f.x,f.y]=HUBS[hub].spawn;f.facing='down';}if(f.interior){const p=f.returnPosition;f.x=p.x;f.y=p.y;delete f.interior;delete f.interiorBuilding;delete f.returnPosition;}f.phase=aftermath?'aftermath':'preparation';s.screen='exploration';if(!walkable(s,f.x,f.y)){[f.x,f.y]=HUBS[f.hub].spawn;f.facing='down';}if(story&&!s.practice)enqueueStory(s,aftermath&&s.missionId===3&&!s.campaign.bonds.erik_kai?'after:3:quiet':aftermath&&s.missionId===6&&!s.campaign.choices?.m06_oath?'6:oath':`${aftermath?'after':'pre'}:${s.missionId}`);if(story&&!s.practice&&!aftermath&&s.missionId===6)enqueueStory(s,`pre:6:order:${s.campaign.choices?.m04_records_choice==='reported'?'reported':'kept'}`);if(aftermath&&s.missionId===3&&(s.campaign.results.at(-1)?.rescued||0)<2)enqueueStory(s,'after:3:loss');if(story&&!s.practice&&aftermath&&s.missionId===5&&s.campaign.choices?.m05_erik_answer)enqueueStory(s,`after:5:${s.campaign.choices.m05_erik_answer}`);if(story&&!s.practice&&aftermath)for(const k of act2After(s))enqueueStory(s,k);openStory(s);syncFrontier(s);return s;}
// v0.6 (D-056): a building with a painted room uses it; otherwise the procedural interior template.
// v0.6.1: a hub NPC may require a recruit in the legion ({requires:'thea'}); without them the NPC is not there.
export const npcsFor=(s,h)=>h?.npcs?.some(n=>n.requires)?{...h,npcs:h.npcs.filter(n=>!n.requires||s.campaign?.roster?.includes(n.requires))}:h;
export const currentHub=s=>{const f=s.frontier;return f?.interior?paintedRoom(f.hub,f.interior,f.interiorBuilding)||INTERIORS[f.interior]:npcsFor(s,HUBS[f.hub]);};
export function enterInterior(s,kind){const f=s.frontier;if(s.screen!=='exploration'||s.narrative.active||f.interior)return false;
 const door=!INTERIORS[kind]?interactions(s).find(n=>n.action==='enter'&&n.buildingId===kind):null;
 if(!door&&(!INTERIORS[kind]||INTERIORS[kind].generic||!interactions(s).some(n=>n.action===kind)))return false;
 f.returnPosition={hub:f.hub,x:f.x,y:f.y,facing:f.facing};f.interior=door?door.interior:kind;if(door)f.interiorBuilding=door.buildingId;[f.x,f.y]=currentHub(s).spawn;f.facing='up';syncFrontier(s);return true;}
export function exitInterior(s,viaDoor=false){const f=s.frontier;if(!f.interior||s.narrative.active||!viaDoor&&!interactions(s).some(n=>n.action==='exit'))return false;const p=f.returnPosition;if(!p)return false;f.hub=p.hub;f.x=p.x;f.y=p.y;f.facing=p.facing;delete f.interior;delete f.interiorBuilding;delete f.returnPosition;syncFrontier(s);return true;}
export const exitDoor=h=>h.tone==='interior'?{x:h.places.find(p=>p.action==='exit')?.x??Math.floor(h.width/2),y:h.height-1}:null;
// Stepping onto a doorway tile leaves the room (painted rooms have a two-tile doorway).
export const isExitTile=(h,x,y)=>h.doors?h.doors.some(([a,b])=>a===x&&b===y):(d=>!!d&&d.x===x&&d.y===y)(exitDoor(h));
export function walkable(s,x,y){const h=currentHub(s);if(h.mask)return Number.isInteger(x)&&Number.isInteger(y)&&y>=0&&x>=0&&y<h.height&&x<h.width&&h.mask[y][x]==='.'&&!h.npcs.some(n=>n.x===x&&n.y===y);const door=exitDoor(h);if(door&&x===door.x&&y===door.y)return true;return Number.isInteger(x)&&Number.isInteger(y)&&x>0&&y>0&&x<h.width-1&&y<h.height-1&&!h.buildings.some(b=>x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h)&&!h.npcs.some(n=>n.x===x&&n.y===y);}
export function visitPlaces(s){const f=s.frontier,h=currentHub(s);for(const p of h.places)if(!f.interior&&Math.abs(f.x-p.x)+Math.abs(f.y-p.y)<=1&&!f.visited[f.hub].includes(p.id))f.visited[f.hub].push(p.id);syncFrontier(s);}
export function stepAren(s,dx,dy){if(s.screen!=='exploration'||s.narrative.active||![[0,1],[0,-1],[1,0],[-1,0]].some(d=>d[0]===dx&&d[1]===dy))return false;const f=s.frontier;f.facing=dx<0?'left':dx>0?'right':dy<0?'up':'down';if(!walkable(s,f.x+dx,f.y+dy))return false;f.x+=dx;f.y+=dy;if(isExitTile(currentHub(s),f.x,f.y)){exitInterior(s,true);return true;}visitPlaces(s);return true;}
export function frontierPath(s,x,y){if(!walkable(s,x,y))return null;const f=s.frontier,q=[[[f.x,f.y]]],seen=new Set([`${f.x},${f.y}`]);while(q.length){const p=q.shift(),[a,b]=p.at(-1);if(a===x&&b===y)return p;for(const [dx,dy]of[[0,-1],[-1,0],[1,0],[0,1]]){const nx=a+dx,ny=b+dy,k=`${nx},${ny}`;if(!seen.has(k)&&walkable(s,nx,ny)){seen.add(k);q.push([...p,[nx,ny]]);}}}return null;}
export function fastTravel(s,id){const f=s.frontier,h=HUBS[f.hub],p=h.places.find(p=>p.id===id);if(s.screen!=='exploration'||s.narrative.active||f.interior||!p||!f.visited[f.hub].includes(id)||!frontierPath(s,p.x,p.y))return false;[f.x,f.y]=[p.x,p.y];visitPlaces(s);return true;}
export function interactions(s){const f=s.frontier,h=currentHub(s),[fx,fy]={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[f.facing]||[0,0],rank=n=>n.x===f.x+fx&&n.y===f.y+fy?0:n.npc?1:2;return [...h.npcs.map(n=>({...n,npc:true})),...h.places.filter(p=>p.action)].filter(n=>n.entrance?n.x===f.x&&n.y===f.y:Math.abs(n.x-f.x)+Math.abs(n.y-f.y)<=(n.reach||1)).sort((a,b)=>rank(a)-rank(b));}
// v0.6 ACT II camp scenes that follow a battle's outcome or choice (M07 deserters, M08 order, Thea).
function act2After(s){const c=s.campaign,f=c.flags||{};
 if(s.missionId===7)return [f.mission_07_deserter_captured?(c.choices?.m07_deserters?`after:7:${c.choices.m07_deserters}`:'after:7:captured'):'after:7:none'];
 if(s.missionId===8)return [`after:8:${c.choices?.m08_order||'hold'}`,`after:8:thea:${c.roster?.includes('thea')?'joined':'parted'}`];
 if(s.missionId===9)return [f.mission_09_assassin_captured?'after:9:captured':'after:9:none'];
 if(s.missionId===10){const st=c.choices?.m10_stance||'mediate';return [st==='mediate'?(f.mission_10_mediated?'after:10:mediate':'after:10:failed'):`after:10:${st}`,`after:10:dario:${c.roster?.includes('dario')?'joined':'parted'}`];}
 // v0.7 (D-068): Sain's first word about the Order after M11; her full story after M12. The M11 oath and the M12 records
 // are chosen in the camp; their scenes (and Ines's) follow the choice.
 if(s.missionId===11)return ['after:11:sain',...(c.choices?.m11_oath?[`after:11:${c.choices.m11_oath}`]:[])];
 // v0.7.1 (D-071): Baldrick's parting follows the battle's outcome; after the summit a recruit of the betraying banner stays or leaves.
 if(s.missionId===13)return [`after:13:${f.mission_13_baldrick||'held'}`];
 if(s.missionId===14){const r=f.mission_14_recruit,id={iron:'thea',free:'dario',flame:'ines'}[f.mission_14_betrayer];return r==='stayed'||r==='left'?[`after:14:recruit:${r}:${id}`]:[];}
 if(s.missionId===12)return ['after:12:sain',...(c.choices?.m12_records?[`after:12:${c.choices.m12_records}`,`after:12:ines:${c.roster?.includes('ines')?'joined':'parted'}`]:[])];
 return [];}
export function interactNPC(s,id){const f=s.frontier,n=currentHub(s).npcs.find(n=>n.id===id);if(s.screen!=='exploration'||s.narrative.active||!n||Math.abs(n.x-f.x)+Math.abs(n.y-f.y)>(n.reach||1))return false;if(id==='advisor')f.advisorPending=true;let key=`npc:${s.missionId}:${f.phase}:${id}`;if(!STORY[key]&&STORY[`${key}:joined`])key+=s.campaign.roster?.includes(id)?':joined':':parted';if(!STORY[key])return false;if(!f.events.includes(key))f.events.push(key);if(RECRUITS[id]&&f.affiliation[id]==='available')f.affiliation[id]='encountered';if(RECRUITS[id]&&f.affiliation[id]==='encountered')f.pendingRecruit=id;// repeat dialogue, never duplicate affiliation/reward
 s.narrative.events=s.narrative.events.filter(k=>k!==key);enqueueStory(s,key);if(id==='lia'&&s.campaign.flags.royal_supply_evidence)enqueueStory(s,'npc:evidence');if(id==='kai'&&s.campaign.bonds.erik_kai)enqueueStory(s,'npc:bond');openStory(s);syncFrontier(s);return true;}
export function affiliate(s,id){const f=s.frontier;if(s.practice||s.screen!=='exploration'||s.narrative.active||!RECRUITS[id]||f.affiliation[id]!=='encountered')return false;f.affiliation[id]='affiliated';f.pendingRecruit=null;if(!f.members.includes(id))f.members.push(id);syncFrontier(s);return true;}
export function validateFrontier(f){if(f?.pendingRecruit!=null&&(!RECRUITS[f.pendingRecruit]||f.affiliation?.[f.pendingRecruit]!=='encountered'))throw Error('동료 선택 기록이 손상되었습니다.');if(!f||f.actorId!=='eric'||f.campaignEntry!=='advisor'||typeof f.advisorPending!=='boolean'||!HUBS[f.hub]||!Number.isInteger(f.x)||!Number.isInteger(f.y)||!['preparation','aftermath'].includes(f.phase)||!['up','down','left','right'].includes(f.facing)||!f.visited||!f.affiliation||!Array.isArray(f.events)||!Array.isArray(f.members)||new Set(f.members).size!==f.members.length||f.members.length<5||f.members.length>ALL_HEROES.length||f.members.some(id=>!heroDef(id))||!['eric','elina','lia','sain','kai'].every(id=>f.members.includes(id)&&['available','encountered','affiliated'].includes(f.affiliation[id]))||!f.ready||['equipment','items','formation','objective'].some(k=>typeof f.ready[k]!=='boolean'))throw Error('탐색 기록이 손상되었습니다.');for(const hub of Object.keys(HUBS))if(!Array.isArray(f.visited[hub])||f.visited[hub].some(id=>!HUBS[hub].places.some(p=>p.id===id)))throw Error('방문 기록이 손상되었습니다.');if(f.interiorBuilding!=null&&(typeof f.interiorBuilding!=='string'||!INTERIORS[f.interior]?.generic||!HUBS[f.hub]?.places.some(p=>p.buildingId===f.interiorBuilding&&p.interior===f.interior)))throw Error('건물 내부 기록이 손상되었습니다.');if(f.interior&&INTERIORS[f.interior]?.generic&&f.interiorBuilding==null)throw Error('건물 내부 기록이 손상되었습니다.');if(f.interior){if(!INTERIORS[f.interior]||!f.returnPosition||f.returnPosition.hub!==f.hub||!walkable({frontier:{...f,interior:null}},f.returnPosition.x,f.returnPosition.y))throw Error('상점 복귀 위치가 손상되었습니다.');}const dummy={frontier:f};if(!walkable(dummy,f.x,f.y))throw Error('에릭 위치가 손상되었습니다.');return f;}
export function councilInfo(s){if(COUNCIL_V071[s.missionId])return COUNCIL_V071[s.missionId](s);if(COUNCIL_V070[s.missionId])return COUNCIL_V070[s.missionId](s);if(COUNCIL_V061[s.missionId])return COUNCIL_V061[s.missionId](s);if(COUNCIL_V06[s.missionId])return COUNCIL_V06[s.missionId](s);if(COUNCIL_V04[s.missionId])return COUNCIL_V04[s.missionId](s);return s.missionId===1?{terrain:'Village / Forest / Ruin',intel:'북쪽 가르, TURN 3 양쪽 모서리 증원. TURN 5부터 주민 위협.',plan:'주민 둘을 모두 구출하고 가르 격파. 방패/궁수의 거리와 퇴로를 확인.'}:s.missionId===2?{terrain:'Forest · 이동 비용 2 (카이 1)',intel:s.campaign.flags.royal_supply_evidence?'군용 인장 확인. 배후는 알 수 없음. 도주 대장 북쪽 출구.':'보급품 출처: 알 수 없음. 도주 대장 북쪽 출구.',plan:'대장 HP 절반 이하 + 인접 → 생포. 생포는 선택; 섬멸/도주 종료도 승리. 길목과 장거리 사격, 우회 기동.'}:{terrain:'Broken Bridge · 좁은 교량 / 북쪽 안전 구역 y≤2',intel:s.campaign.flags.mission_02_supply_route_discovered?'포로 진술: 버려진 성채. 진위·명령자는 미확인. 후방 추격병 접근.':'보급로 진술 없음. 후방 추격병 접근과 교량 위험은 확인.',plan:'10턴 안에 주민 1명 이상 구조 + 생존 장수 전원 북쪽 3줄(y≤2) 철수. 인접 구조 또는 호위 이동. 전원 구조 선택 목표. Guard/Heal/우회 협력.'};}

// Shared progression entry: no walking/modal/UI state can bypass its preconditions.
export function openCouncil(s){
 if(!['exploration','intro','warroom','deployment'].includes(s.screen)||s.narrative.active||s.frontier.interior||s.frontier.phase==='aftermath'||s.screen==='exploration'&&(!s.frontier.advisorPending||!interactions(s).some(n=>n.id==='advisor'&&n.npc)))return false;
 s.frontier.advisorPending=false;s.screen='warroom';
 if(s.missionId===1&&!s.practice){setStoryFlag(s,'village_fire_started');enqueueStory(s,'raid');}
 introStory(s);syncFrontier(s);return true;
}

export function explorationHero(s){return s.units.find(u=>u.id==='eric');}
// Only legacy spatial records are repaired; economic/tactical/story state is untouched.
export function migrateFrontier(f,missionId=1){
 if(!f)return frontierState(missionId);
 f.actorId='eric';f.campaignEntry='advisor';f.advisorPending=false;return repairFrontierSpace(f,missionId);
}
// Spatial repair only (hub, visited lists, interior return door, a walkable position); story/economy untouched.
export function repairFrontierSpace(f,missionId=1){
 if(!HUBS[f.hub])f.hub=hubFor(missionId,f.phase);fillVisited(f);
 const safe=(interior,x,y)=>walkable({frontier:{...f,interior}},x,y);
 if(f.interior){
  if(!INTERIORS[f.interior]){delete f.interior;delete f.interiorBuilding;delete f.returnPosition;}
  else{const p=f.returnPosition;if(!p||p.hub!==f.hub||!safe(null,p.x,p.y)){const door=HUBS[f.hub].places.find(p=>f.interiorBuilding?p.buildingId===f.interiorBuilding:p.action===f.interior)||{x:HUBS[f.hub].spawn[0],y:HUBS[f.hub].spawn[1]};f.returnPosition={hub:f.hub,x:door.x,y:door.y,facing:'up'};}}
 }
 if(!safe(f.interior,f.x,f.y)){const spawn=currentHub({frontier:f}).spawn;[f.x,f.y]=spawn;f.facing='down';}
 return f;
}

// v0.5 hubs (D-052): every hub keeps a visited list; a move to another hub while inside a shared
// generic building (same building ids in every camp hub) re-anchors the return door.
export function fillVisited(f){f.visited??={};for(const id of Object.keys(HUBS)){if(!Array.isArray(f.visited[id]))f.visited[id]=['square'];f.visited[id]=f.visited[id].filter(p=>HUBS[id].places.some(q=>q.id===p));if(!f.visited[id].includes('square'))f.visited[id].unshift('square');}return f;}
function leaveInteriorFor(f,hub){const door=f.interiorBuilding&&HUBS[hub].places.find(p=>p.buildingId===f.interiorBuilding&&p.interior===f.interior);if(door){f.returnPosition={hub,x:door.x,y:door.y,facing:'up'};return;}const p=f.returnPosition;if(p){f.x=p.x;f.y=p.y;}delete f.interior;delete f.interiorBuilding;delete f.returnPosition;}
// Loading any save: the hub follows the story moment (hubFor), spatial records are repaired only.
export function alignFrontier(f,missionId,screen){if(!f)return f;repairFrontierSpace(f,missionId);if(screen==='exploration'||screen==='title'){const hub=hubFor(missionId,f.phase);if(f.hub!==hub){if(f.interior)leaveInteriorFor(f,hub);if(f.interior){f.hub=hub;}else{f.hub=hub;[f.x,f.y]=HUBS[hub].spawn;f.facing='down';}}}return f;}

// Error-only retry route uses the same progression API and still requires the advisor.
export function recoverCouncil(s){
 if(s.screen!=='exploration'||s.narrative.active||s.frontier.interior||s.frontier.phase!=='preparation'||!interactions(s).some(n=>n.id==='advisor'&&n.npc))return false;
 s.frontier.advisorPending=true;return openCouncil(s);
}
// Chests inside ordinary buildings: one roll per chest per mission, fixed by the run seed.
export const chestKey=(s,id)=>`m${s.missionId}:${s.frontier?.hub}:${s.frontier?.interiorBuilding}:${id}`;
export function chestReward(seed,key){let h=(seed>>>0)^2166136261;for(const ch of key){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}const roll=h%100,amount=15+((h>>>8)%26);
 return roll<60?{kind:'gold',amount}:roll<80?{kind:'item',type:'medium'}:roll<90?{kind:'item',type:'ether'}:{kind:'empty'};}
export function openChest(s,id,transact){const f=s.frontier;if(s.screen!=='exploration'||s.narrative.active||!f.interior||!INTERIORS[f.interior]?.generic||!f.interiorBuilding)return {ok:false,error:'상자를 열 수 없습니다.'};
 if(!interactions(s).some(n=>n.action==='chest'&&n.chestId===id))return {ok:false,error:'상자 가까이 다가가세요.'};
 const key=chestKey(s,id),reward=chestReward(s.initialSeed,key);const r=transact(s,{op:'chest',id:key,reward,token:`tx:${s.economy.nonce}`});return r.ok?{ok:true,reward}:r;}
