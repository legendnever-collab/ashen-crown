import {GEAR,TOOLS} from '../data/frontier-data.js';
import {HEROES} from '../data/game-data.js';
export const CARRY_CAPACITY=6,GEAR_CAPACITY=24;
export const rewardFor=id=>({1:100,2:120,3:140}[id]||0);
export function initialEconomy(completed=[]){return {gold:180+[...new Set(completed)].reduce((a,id)=>a+rewardFor(id),0),items:{medium:0,ether:0,ward:0},gear:[],equipped:Object.fromEntries(HEROES.map(h=>[h.id,{weapon:null,armor:null,accessory:null}])),next:1,nonce:0,transactions:[],rewards:[...new Set(completed)]};}
export function ensureEconomy(s){if(!s.campaign.economy)s.campaign.economy=initialEconomy(s.campaign.completed);if(!s.economy)s.economy=structuredClone(s.campaign.economy);return s.economy;}
export const itemCount=e=>Object.values(e.items).reduce((a,b)=>a+b,0);
export function equipmentBonus(e,hero){const bonus={};for(const id of Object.values(e?.equipped?.[hero]||{})){const instance=e.gear.find(g=>g.id===id),g=GEAR[instance?.type];if(!g)continue;for(const [k,v]of Object.entries(g.bonus))bonus[k]=(bonus[k]||0)+v;if(instance.level===1)for(const [k,v]of Object.entries(g.upgrade))bonus[k]=(bonus[k]||0)+v;}return bonus;}
export function effectiveStats(s,u){const b=u.team==='ally'?equipmentBonus(s.economy,u.id):{};const v={...u};for(const [k,n]of Object.entries(b))v[k]=(v[k]||0)+n;if(u.ward){v.def+=2;v.res+=2;}return v;}
export function equipmentLabel(e,hero){return Object.entries(e.equipped[hero]).map(([slot,id])=>{const g=e.gear.find(a=>a.id===id);return `${slot}: ${g?GEAR[g.type].name+(g.level?' +1':''):'Standard'}`;}).join(' · ');}
export function validateEconomy(e){
 if(!e||!Number.isSafeInteger(e.gold)||e.gold<0||e.gold>1000000||!e.items||Object.keys(e.items).length!==3||Object.entries(e.items).some(([id,n])=>!TOOLS[id]||!Number.isInteger(n)||n<0)||itemCount(e)>CARRY_CAPACITY||!Array.isArray(e.gear)||e.gear.length>GEAR_CAPACITY||!Number.isSafeInteger(e.next)||e.next<1||!Number.isSafeInteger(e.nonce)||e.nonce<0||!Array.isArray(e.transactions)||e.transactions.length>100||e.transactions.some(t=>typeof t!=='string')||!Array.isArray(e.rewards)||e.rewards.some(id=>![1,2,3].includes(id))||new Set(e.rewards).size!==e.rewards.length)throw Error('자산 저장이 손상되었습니다.');
 const ids=new Set();for(const g of e.gear){if(!g||!GEAR[g.type]||typeof g.id!=='string'||!/^g[1-9][0-9]*$/.test(g.id)||ids.has(g.id)||Number(g.id.slice(1))>=e.next||![0,1].includes(g.level))throw Error('장비 저장이 손상되었습니다.');ids.add(g.id);}
 if(!e.equipped||Object.keys(e.equipped).length!==5)throw Error('장착 저장이 손상되었습니다.');const used=new Set();for(const h of HEROES){const slots=e.equipped[h.id];if(!slots||Object.keys(slots).length!==3||!['weapon','armor','accessory'].every(k=>Object.hasOwn(slots,k)))throw Error('장비 슬롯이 손상되었습니다.');for(const [slot,id]of Object.entries(slots)){if(id===null)continue;const g=e.gear.find(a=>a.id===id),type=GEAR[g?.type];if(!g||type.slot!==slot||!type.heroes.includes(h.id)||used.has(id))throw Error('장착 호환성이 손상되었습니다.');used.add(id);}}
 return e;
}
// Stale confirmation tokens never apply twice, even after a reload.
export function transact(s,request){
 if(s.practice)return {ok:false,error:'연습에서는 정식 자산 거래를 할 수 없습니다.'};
 if(!['exploration','warroom','deployment'].includes(s.screen)||s.narrative?.active)return {ok:false,error:'전투 전 준비 장소에서 거래하세요.'};
 const current=ensureEconomy(s);if(!request||request.token!==`tx:${current.nonce}`||current.transactions.includes(request.token))return {ok:false,error:'이미 처리되었거나 만료된 거래입니다.'};
 const e=structuredClone(current),{op,id,hero,slot}=request;let cost=0;
 try{
 if(op==='buy-item'){const t=TOOLS[id];if(!t)throw Error('알 수 없는 도구입니다.');if(itemCount(e)>=CARRY_CAPACITY)throw Error('도구 소지 한도는 6개입니다.');cost=t.price;e.items[id]++;}
 else if(op==='sell-item'){const t=TOOLS[id];if(!t||!e.items[id])throw Error('보유 도구가 없습니다.');cost=-t.sell;e.items[id]--;}
 else if(op==='buy-gear'){const g=GEAR[id];if(!g)throw Error('알 수 없는 장비입니다.');if(e.gear.length>=GEAR_CAPACITY)throw Error('장비 소지 한도는 24개입니다.');cost=g.price;e.gear.push({id:`g${e.next++}`,type:id,level:0});}
 else if(op==='sell-gear'||op==='upgrade'){const instance=e.gear.find(a=>a.id===id);if(!instance)throw Error('장비를 찾을 수 없습니다.');if(op==='upgrade'){if(instance.level)throw Error('이미 +1 강화한 장비입니다.');cost=40;instance.level=1;}else{if(Object.values(e.equipped).some(slots=>Object.values(slots).includes(id)))throw Error('장착을 해제한 뒤 판매하세요.');cost=-Math.floor(GEAR[instance.type].price*.4);e.gear=e.gear.filter(a=>a.id!==id);}}
 else if(op==='equip'){const instance=e.gear.find(a=>a.id===id),g=GEAR[instance?.type];if(!g||!g.heroes.includes(hero)||g.slot!==slot)throw Error('이 장수의 직업/슬롯과 호환되지 않습니다.');if(Object.values(e.equipped).some(slots=>Object.values(slots).includes(id)))throw Error('이미 장착된 장비입니다.');e.equipped[hero][slot]=id;}
 else if(op==='unequip'){if(!e.equipped[hero]||!['weapon','armor','accessory'].includes(slot))throw Error('슬롯이 올바르지 않습니다.');e.equipped[hero][slot]=null;}
 else throw Error('알 수 없는 거래입니다.');
 if(cost>e.gold)throw Error('Gold가 부족합니다.');e.gold-=cost;e.transactions.push(request.token);e.transactions=e.transactions.slice(-100);e.nonce++;validateEconomy(e);
 s.economy=e;s.campaign.economy=structuredClone(e);return {ok:true,cost};
 }catch(error){return {ok:false,error:error.message};}
}
export function commitEconomyReward(s){if(s.practice)return 0;const e=ensureEconomy(s);if(e.rewards.includes(s.missionId))return 0;const reward=rewardFor(s.missionId);e.rewards.push(s.missionId);e.gold+=reward;s.campaign.economy=structuredClone(e);s.log.push(`첫 승리 보상 +${reward} Gold`);return reward;}
export function useTool(s,u,id){const e=ensureEconomy(s),t=TOOLS[id];if(!t||!e.items[id])return {ok:false,error:'보유 도구가 없습니다.'};if(id==='ward'&&u.ward)return {ok:false,error:'보호 효과가 이미 적용 중입니다.'};if(t.stat==='hp'&&u.hp>=u.maxHP||t.stat==='mp'&&u.mp>=u.maxMP)return {ok:false,error:'회복할 수치가 없습니다.'};e.items[id]--;if(id==='ward'){u.ward=true;s.feedback.push({type:'guard',id:u.id,text:'WARD'});}else{const max=t.stat==='hp'?u.maxHP:u.maxMP,amount=Math.min(t.amount,max-u[t.stat]);u[t.stat]+=amount;s.feedback.push({type:'heal',id:u.id,text:`+${amount} ${t.stat.toUpperCase()}`,...(t.stat==='hp'?{toHP:u.hp}:{})});}s.log.push(`${u.name}: ${t.name} 사용 · 행동 1회`);return {ok:true};}
