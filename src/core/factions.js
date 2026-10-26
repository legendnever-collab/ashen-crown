// v0.6 faction trust (D-055 Q3, PROPOSED values). Three banners, each −2…+3, shown on a camp panel as a stage
// (경계 / 중립 / 신뢰 / 동맹) rather than a number. v0.6 moves the Iron Crown and the Free Lords; v0.7 the Sacred Flame.
export const FACTIONS={
 iron:{name:'철왕관 통령국',en:'Iron Crown Dominion',leader:'카시안',color:'#6f86a0',motto:'통일 없이는 평화도 없다.'},
 free:{name:'자유 영주 연맹',en:'Free Lords Alliance',leader:'레오노라',color:'#7aa35a',motto:'왕 없는 세상에도 질서는 존재한다.'},
 flame:{name:'성화 교단',en:'Order of the Sacred Flame',leader:'루시안',color:'#c4553f',motto:'왕국을 멸망시킨 것은 인간의 탐욕이다.'}
};
export const TRUST_MIN=-2,TRUST_MAX=3;
export const TRUST_STAGES=[
 {id:'wary',ko:'경계',min:-2,max:-1,note:'군단을 의심한다. 협력 제안이 줄어든다.'},
 {id:'neutral',ko:'중립',min:0,max:0,note:'지켜보는 중이다.'},
 {id:'trusted',ko:'신뢰',min:1,max:2,note:'군단의 말을 듣는다. 협력과 합류의 길이 열린다.'},
 {id:'allied',ko:'동맹',min:3,max:3,note:'군단을 동맹으로 대한다.'}
];
export const trustStage=v=>TRUST_STAGES.find(t=>v>=t.min&&v<=t.max)||TRUST_STAGES[1];
// Starting values carry a little of ACT I: a ledger reported to the royal command makes the Iron Crown wary (D-055 §4).
export function initialTrust(campaign){return {iron:campaign?.choices?.m04_records_choice==='reported'?-1:0,free:0,flame:0};}
export function ensureTrust(campaign){if(!campaign.factionTrust)campaign.factionTrust=initialTrust(campaign);campaign.trustLog??=[];return campaign.factionTrust;}
// Change one banner's trust; returns the applied delta (clamped). Reasons go to a short log for the panel.
export function adjustTrust(campaign,faction,delta,reason=''){
 if(!FACTIONS[faction]||!Number.isInteger(delta))return 0;const t=ensureTrust(campaign),before=t[faction];
 t[faction]=Math.max(TRUST_MIN,Math.min(TRUST_MAX,before+delta));const applied=t[faction]-before;
 if(applied){campaign.trustLog.push({faction,delta:applied,reason:String(reason).slice(0,80)});campaign.trustLog=campaign.trustLog.slice(-20);}
 return applied;
}
export function validTrust(campaign){
 const t=campaign.factionTrust;if(t==null)return true;
 if(typeof t!=='object'||Array.isArray(t)||Object.keys(t).some(k=>!FACTIONS[k])||Object.values(t).some(v=>!Number.isInteger(v)||v<TRUST_MIN||v>TRUST_MAX))return false;
 const log=campaign.trustLog;return log==null||Array.isArray(log)&&log.length<=20&&log.every(e=>e&&FACTIONS[e.faction]&&Number.isInteger(e.delta)&&typeof e.reason==='string');
}
// Panel rows: met banners only (Iron Crown from ACT I M05, the others when ACT II introduces them).
export function factionRows(campaign){
 const t=campaign.factionTrust||initialTrust(campaign),met=metFactions(campaign);
 return Object.entries(FACTIONS).map(([id,f])=>({id,...f,met:met.includes(id),value:t[id],stage:trustStage(t[id])}));
}
export function metFactions(campaign){const c=campaign.completed||[],out=[];if(c.includes(5))out.push('iron');if(campaign.flags?.act2_free_met||c.includes(8))out.push('free');if(campaign.flags?.act2_flame_met||c.includes(11))out.push('flame');return out;}
