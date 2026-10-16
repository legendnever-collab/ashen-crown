// v0.4 mission hooks. M01–03 never reach this module, so their rules stay byte-for-byte the same.
import {missionOf} from '../data/missions.js';
import {alive,at,distance,findUnit,terrainAt} from './rules.js';
import {enqueueStory,setStoryFlag,remember} from './narrative.js';

export const objectUnit=o=>({...structuredClone(o),team:'object',hp:1,maxHP:1,mp:0,maxMP:0,atk:0,def:0,mag:0,res:0,spd:0,mov:0,range:[0,0],rescued:false});
export const enemyUnit=(e,spawnTurn=0)=>({...structuredClone(e),team:'enemy',maxHP:e.hp,mp:0,maxMP:0,mag:0,moved:false,acted:false,spawnTurn});
const searched=(s,type)=>s.units.some(u=>u.team==='object'&&u.evidence===type&&u.rescued);

export function spawnWave(s,list){
 const m=missionOf(s);
 for(const e of list){let pos={x:e.x,y:e.y};if(at(s,pos.x,pos.y)){const free=[];for(let y=0;y<m.height;y++)for(let x=0;x<m.width;x++)if(!at(s,x,y)&&Number.isFinite(terrainAt(x,y,s)?.cost))free.push({x,y});free.sort((a,b)=>distance(a,e)-distance(b,e)||a.y-b.y||a.x-b.x);pos=free[0];}
  s.units.push({...enemyUnit(e,s.turn),...pos});s.feedback.push({type:'spawn',id:e.id,text:'REINFORCEMENT'});}
}

const M4={
 init(s){s.missionState={alerted:false,burned:[],waves:[]};},
 validState(m){return !!m&&typeof m==='object'&&typeof m.alerted==='boolean'&&Array.isArray(m.burned)&&m.burned.every(v=>['seal','orders'].includes(v))&&new Set(m.burned).size===m.burned.length&&Array.isArray(m.waves)&&m.waves.every(n=>Number.isInteger(n)&&n>0);},
 status(s){const found=['ledger','seal','orders'].filter(t=>searched(s,t)).length,left=Math.max(0,missionOf(s).burnTurn-s.turn);return `증거 ${found}/3${s.missionState?.burned.length?` · 소각 ${s.missionState.burned.length}`:left&&s.turn<missionOf(s).burnTurn?` · 소각까지 ${left}턴`:''} · ${Math.max(0,missionOf(s).turnLimit+1-s.turn)}턴 남음`;},
 optional(s){const f=s.campaign.flags;return `증거 ${['mission_04_ledger_recovered','mission_04_seal_notes','mission_04_transfer_orders'].filter(k=>f[k]).length}/3 확보${f.mission_04_evidence_burned?` · 소각 ${f.mission_04_evidence_burned}`:''}`;},
 alert(s){const boss=findUnit(s,'boss');if(s.missionState.alerted||!alive(boss))return;if(s.turn>=6||s.units.some(u=>u.team==='ally'&&alive(u)&&distance(u,boss)<=4)){s.missionState.alerted=true;boss.mov=boss.alertMov;enqueueStory(s,'4:alert');s.log.push('성채 병참관이 보관실을 떠나 직접 움직입니다.');}},
 beforeEnemyPhase(s){M4.alert(s);},
 onTurnStart(s){
  const m=missionOf(s);
  for(const w of m.waves)if(s.turn===w.turn&&!s.missionState.waves.includes(w.turn)){s.missionState.waves.push(w.turn);spawnWave(s,w.units);if(w.story)enqueueStory(s,w.story);s.log.push(`적 증원 ${w.units.length}명 출현.`);}
  if(s.turn===m.burnTurn-1){const torches=s.units.filter(u=>u.burns&&alive(u)&&!searched(s,u.burns));if(torches.length){enqueueStory(s,'4:burn-warn');s.log.push('횃불 병참병이 기록고에 불을 붙일 준비를 합니다. 이번 TURN이 마지막 기회입니다.');}}
  if(s.turn===m.burnTurn){for(const t of s.units.filter(u=>u.burns&&alive(u))){const o=s.units.find(u=>u.team==='object'&&u.evidence===t.burns);if(o&&alive(o)){o.hp=0;o.burned=true;s.missionState.burned.push(o.evidence);s.feedback.push({type:'death',id:o.id,text:'BURNED'});s.log.push(`${o.name}이(가) 불타 사라졌습니다.`);}}if(s.missionState.burned.length)enqueueStory(s,'4:burn');}
  M4.alert(s);
 },
 checkOutcome(s,finish){
  if(s.turn>missionOf(s).turnLimit)return finish(s,'defeat','제한 14턴 안에 장부 확보와 병참관 격파를 마치지 못했습니다.');
  if(searched(s,'ledger')&&findUnit(s,'boss').hp<=0)finish(s,'victory',`보급 장부 확보 · 성채 병참관 격파 · 증거 ${['ledger','seal','orders'].filter(t=>searched(s,t)).length}/3.`);
 },
 beforeCommit(s){
  setStoryFlag(s,'mission_04_ledger_recovered');
  if(searched(s,'seal'))setStoryFlag(s,'mission_04_seal_notes');
  if(searched(s,'orders'))setStoryFlag(s,'mission_04_transfer_orders');
  setStoryFlag(s,'mission_04_evidence_burned',s.missionState.burned.length);
 },
 afterVictory(s){
  if(s.practice)return;const m=s.campaign.tacticalMemory,prior=s.stageStart?.campaign.tacticalMemory||{},did=k=>(m[k]||0)>(prior[k]||0);
  if(did('lia_search')&&did('kai_search')){s.campaign.bonds.lia_kai=true;setStoryFlag(s,'bond_lia_kai');enqueueStory(s,'4:bond');}
 },
 rewardContext(s){return {seal:!!s.campaign.flags.mission_04_seal_notes,orders:!!s.campaign.flags.mission_04_transfer_orders};}
};

export const MISSION_RULES={4:M4};
export const rulesOf=s=>MISSION_RULES[s?.missionId]||null;

export function searchEvidence(s,u,t){
 t.rescued=true;t.searchedBy=u.id;remember(s,`${u.id}_search`);
 s.feedback.push({type:'rescue',id:t.id,text:'SEARCHED'});s.log.push(`${u.name}: ${t.name} 조사 완료.`);
 enqueueStory(s,`${s.missionId}:search:${t.evidence}`);
 if(t.evidence==='seal'&&u.id==='lia')enqueueStory(s,`${s.missionId}:search:seal:lia`);
 if(t.evidence==='orders'&&u.id==='kai')enqueueStory(s,`${s.missionId}:search:orders:kai`);
}
export const missionUnitIds=m=>[...m.enemies,...m.reinforcements,...m.civilians,...(m.objects||[]),...(m.waves||[]).flatMap(w=>w.units)].map(u=>u.id);
export const maxUnits=m=>5+missionUnitIds(m).length;
