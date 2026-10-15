import {HUBS,INTERIORS,RECRUITS,NPC_LINES} from '../data/frontier-data.js';
import {enqueueStory,openStory,introStory,setStoryFlag} from './narrative.js';
import {STORY} from '../data/story.js';
import {ensureEconomy} from './economy.js';
export function frontierState(missionId=1){return {actorId:'eric',campaignEntry:'advisor',advisorPending:false,hub:missionId===1?'village':'camp',x:7,y:7,facing:'down',visited:{village:['square'],camp:['square']},events:[],affiliation:{eric:'affiliated',elina:'affiliated',lia:'available',sain:'available',kai:'available'},members:['eric','elina','lia','sain','kai'],phase:'preparation',pendingRecruit:null,ready:{equipment:false,items:false,formation:false,objective:false}};}
export function ensureFrontier(s){if(!s.frontier)s.frontier=structuredClone(s.campaign.frontier||frontierState(s.missionId));ensureEconomy(s);return s.frontier;}
export function syncFrontier(s){if(!s.practice)s.campaign.frontier=structuredClone(s.frontier);}
export function enterHub(s,{aftermath=false,story=true}={}){const f=ensureFrontier(s);const hub=s.missionId===1?'village':'camp';if(f.hub!==hub){f.hub=hub;[f.x,f.y]=HUBS[hub].spawn;}if(f.interior){const p=f.returnPosition;f.x=p.x;f.y=p.y;delete f.interior;delete f.returnPosition;}f.phase=aftermath?'aftermath':'preparation';s.screen='exploration';if(story&&!s.practice)enqueueStory(s,aftermath&&s.missionId===3&&!s.campaign.bonds.erik_kai?'after:3:quiet':`${aftermath?'after':'pre'}:${s.missionId}`);if(aftermath&&s.missionId===3&&(s.campaign.results.at(-1)?.rescued||0)<2)enqueueStory(s,'after:3:loss');openStory(s);syncFrontier(s);return s;}
export const currentHub=s=>s.frontier?.interior?INTERIORS[s.frontier.interior]:HUBS[s.frontier.hub];
export function enterInterior(s,kind){const f=s.frontier;if(s.screen!=='exploration'||s.narrative.active||f.interior||!INTERIORS[kind]||!interactions(s).some(n=>n.action===kind))return false;f.returnPosition={hub:f.hub,x:f.x,y:f.y,facing:f.facing};f.interior=kind;[f.x,f.y]=INTERIORS[kind].spawn;f.facing='up';syncFrontier(s);return true;}
export function exitInterior(s){const f=s.frontier;if(!f.interior||s.narrative.active||!interactions(s).some(n=>n.action==='exit'))return false;const p=f.returnPosition;if(!p)return false;f.hub=p.hub;f.x=p.x;f.y=p.y;f.facing=p.facing;delete f.interior;delete f.returnPosition;syncFrontier(s);return true;}
export function walkable(s,x,y){const h=currentHub(s);return Number.isInteger(x)&&Number.isInteger(y)&&x>0&&y>0&&x<h.width-1&&y<h.height-1&&!h.buildings.some(b=>x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h)&&!h.npcs.some(n=>n.x===x&&n.y===y);}
export function visitPlaces(s){const f=s.frontier,h=currentHub(s);for(const p of h.places)if(!f.interior&&Math.abs(f.x-p.x)+Math.abs(f.y-p.y)<=1&&!f.visited[f.hub].includes(p.id))f.visited[f.hub].push(p.id);syncFrontier(s);}
export function stepAren(s,dx,dy){if(s.screen!=='exploration'||s.narrative.active||![[0,1],[0,-1],[1,0],[-1,0]].some(d=>d[0]===dx&&d[1]===dy))return false;const f=s.frontier;f.facing=dx<0?'left':dx>0?'right':dy<0?'up':'down';if(!walkable(s,f.x+dx,f.y+dy))return false;f.x+=dx;f.y+=dy;visitPlaces(s);return true;}
export function frontierPath(s,x,y){if(!walkable(s,x,y))return null;const f=s.frontier,q=[[[f.x,f.y]]],seen=new Set([`${f.x},${f.y}`]);while(q.length){const p=q.shift(),[a,b]=p.at(-1);if(a===x&&b===y)return p;for(const [dx,dy]of[[0,-1],[-1,0],[1,0],[0,1]]){const nx=a+dx,ny=b+dy,k=`${nx},${ny}`;if(!seen.has(k)&&walkable(s,nx,ny)){seen.add(k);q.push([...p,[nx,ny]]);}}}return null;}
export function fastTravel(s,id){const f=s.frontier,h=HUBS[f.hub],p=h.places.find(p=>p.id===id);if(s.screen!=='exploration'||s.narrative.active||f.interior||!p||!f.visited[f.hub].includes(id)||!frontierPath(s,p.x,p.y))return false;[f.x,f.y]=[p.x,p.y];visitPlaces(s);return true;}
export function interactions(s){const f=s.frontier,h=currentHub(s);return [...h.npcs.map(n=>({...n,npc:true})),...h.places.filter(p=>p.action)].filter(n=>n.entrance?n.x===f.x&&n.y===f.y:Math.abs(n.x-f.x)+Math.abs(n.y-f.y)<=1);}
export function interactNPC(s,id){const f=s.frontier,n=currentHub(s).npcs.find(n=>n.id===id);if(s.screen!=='exploration'||s.narrative.active||!n||Math.abs(n.x-f.x)+Math.abs(n.y-f.y)>1)return false;if(id==='advisor')f.advisorPending=true;const key=`npc:${s.missionId}:${f.phase}:${id}`;if(!STORY[key])return false;if(!f.events.includes(key))f.events.push(key);if(RECRUITS[id]&&f.affiliation[id]==='available')f.affiliation[id]='encountered';if(RECRUITS[id]&&f.affiliation[id]==='encountered')f.pendingRecruit=id;// repeat dialogue, never duplicate affiliation/reward
 s.narrative.events=s.narrative.events.filter(k=>k!==key);enqueueStory(s,key);if(id==='lia'&&s.campaign.flags.royal_supply_evidence)enqueueStory(s,'npc:evidence');if(id==='kai'&&s.campaign.bonds.erik_kai)enqueueStory(s,'npc:bond');openStory(s);syncFrontier(s);return true;}
export function affiliate(s,id){const f=s.frontier;if(s.practice||s.screen!=='exploration'||s.narrative.active||!RECRUITS[id]||f.affiliation[id]!=='encountered')return false;f.affiliation[id]='affiliated';f.pendingRecruit=null;if(!f.members.includes(id))f.members.push(id);syncFrontier(s);return true;}
export function validateFrontier(f){if(f?.pendingRecruit!=null&&(!RECRUITS[f.pendingRecruit]||f.affiliation?.[f.pendingRecruit]!=='encountered'))throw Error('동료 선택 기록이 손상되었습니다.');if(!f||f.actorId!=='eric'||f.campaignEntry!=='advisor'||typeof f.advisorPending!=='boolean'||!HUBS[f.hub]||!Number.isInteger(f.x)||!Number.isInteger(f.y)||!['preparation','aftermath'].includes(f.phase)||!['up','down','left','right'].includes(f.facing)||!f.visited||!f.affiliation||!Array.isArray(f.events)||!Array.isArray(f.members)||new Set(f.members).size!==5||f.members.length!==5||!['eric','elina','lia','sain','kai'].every(id=>f.members.includes(id)&&['available','encountered','affiliated'].includes(f.affiliation[id]))||!f.ready||['equipment','items','formation','objective'].some(k=>typeof f.ready[k]!=='boolean'))throw Error('탐색 기록이 손상되었습니다.');for(const hub of Object.keys(HUBS))if(!Array.isArray(f.visited[hub])||f.visited[hub].some(id=>!HUBS[hub].places.some(p=>p.id===id)))throw Error('방문 기록이 손상되었습니다.');if(f.interior){if(!INTERIORS[f.interior]||!f.returnPosition||f.returnPosition.hub!==f.hub||!walkable({frontier:{...f,interior:null}},f.returnPosition.x,f.returnPosition.y))throw Error('상점 복귀 위치가 손상되었습니다.');}const dummy={frontier:f};if(!walkable(dummy,f.x,f.y))throw Error('에릭 위치가 손상되었습니다.');return f;}
export function councilInfo(s){return s.missionId===1?{terrain:'Village / Forest / Ruin',intel:'북쪽 Garr, TURN 3 양쪽 모서리 증원. TURN 5부터 주민 위협.',plan:'주민 둘을 모두 구출하고 Garr 격파. 방패/궁수의 거리와 퇴로를 확인.'}:s.missionId===2?{terrain:'Forest · 이동 비용 2 (Kai 1)',intel:s.campaign.flags.royal_supply_evidence?'군용 인장 확인. 배후는 알 수 없음. 도주 대장 북쪽 출구.':'보급품 출처: 알 수 없음. 도주 대장 북쪽 출구.',plan:'대장 HP 절반 이하 + 인접 → 생포. 생포는 선택; 섬멸/도주 종료도 승리. 길목과 장거리 사격, 우회 기동.'}:{terrain:'Broken Bridge · 좁은 교량 / 북쪽 안전 구역 y≤2',intel:s.campaign.flags.mission_02_supply_route_discovered?'포로 진술: 버려진 성채. 진위·명령자는 미확인. 후방 추격병 접근.':'보급로 진술 없음. 후방 추격병 접근과 교량 위험은 확인.',plan:'10턴 안에 주민 1명 이상 구조 + 생존 장수 전원 북쪽 3줄(y≤2) 철수. 인접 구조 또는 호위 이동. 전원 구조 선택 목표. Guard/Heal/우회 협력.'};}

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
 f.actorId='eric';f.campaignEntry='advisor';f.advisorPending=false;if(!HUBS[f.hub])f.hub=missionId===1?'village':'camp';
 const safe=(interior,x,y)=>walkable({frontier:{...f,interior}},x,y);
 if(f.interior){
  if(!INTERIORS[f.interior]){delete f.interior;delete f.returnPosition;}
  else{const p=f.returnPosition;if(!p||p.hub!==f.hub||!safe(null,p.x,p.y)){const door=HUBS[f.hub].places.find(p=>p.action===f.interior);f.returnPosition={hub:f.hub,x:door.x,y:door.y,facing:'up'};}}
 }
 if(!safe(f.interior,f.x,f.y)){const spawn=(f.interior?INTERIORS[f.interior]:HUBS[f.hub]).spawn;[f.x,f.y]=spawn;f.facing='down';}
 return f;
}

// Error-only retry route uses the same progression API and still requires the advisor.
export function recoverCouncil(s){
 if(s.screen!=='exploration'||s.narrative.active||s.frontier.interior||s.frontier.phase!=='preparation'||!interactions(s).some(n=>n.id==='advisor'&&n.npc))return false;
 s.frontier.advisorPending=true;return openCouncil(s);
}
