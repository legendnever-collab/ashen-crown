import {SCHEMA,WIDTH,HEIGHT,HEROES,ENEMIES,REINFORCEMENTS,CIVILIANS} from '../data/game-data.js';
import {terrainAt,alive} from '../core/rules.js';
export const SAVE_KEY='ashen-crown:v1',BACKUP_KEY='ashen-crown:last-good';
export function checksum(text){let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(16);}
export function validate(s){
 if(!s||s.schema!==SCHEMA||!['title','intro','warroom','deployment','battle','result'].includes(s.screen)||!['player','enemy'].includes(s.phase))throw Error('지원하지 않는 저장 형식입니다.');
 if(!Number.isInteger(s.turn)||s.turn<1||s.turn>10000||!Number.isInteger(s.rng)||s.rng<0||s.rng>4294967295)throw Error('턴 또는 RNG 상태가 손상되었습니다.');
 if(!Array.isArray(s.units)||s.units.length<12||s.units.length>14||!Array.isArray(s.log)||!s.campaign||!Array.isArray(s.campaign.results)||!Number.isInteger(s.campaign.clears)||!Array.isArray(s.missionStart))throw Error('필수 게임 기록이 없습니다.');
 const known=new Set([...HEROES,...ENEMIES,...REINFORCEMENTS,...CIVILIANS].map(u=>u.id)),ids=new Set(),occupied=new Set();
 for(const u of s.units){if(!known.has(u.id)||ids.has(u.id)||!['ally','enemy','civilian'].includes(u.team))throw Error('장수 목록이 손상되었습니다.');ids.add(u.id);
  const expected=HEROES.some(h=>h.id===u.id)?'ally':CIVILIANS.some(c=>c.id===u.id)?'civilian':'enemy';if(u.team!==expected||typeof u.name!=='string'||u.name.length>120||!Array.isArray(u.range)||u.range.length!==2||u.range.some(n=>!Number.isInteger(n)||n<0||n>12)||u.range[0]>u.range[1])throw Error('유닛 분류 또는 사거리가 손상되었습니다.');
  for(const k of ['hp','maxHP','mp','maxMP','atk','def','mag','res','spd','mov','x','y'])if(!Number.isFinite(u[k])||u[k]<0||!Number.isInteger(u[k]))throw Error('유닛 수치가 올바르지 않습니다.');
  if(u.hp>u.maxHP||u.mp>u.maxMP||u.maxHP<1||u.x>=WIDTH||u.y>=HEIGHT||!Number.isFinite(terrainAt(u.x,u.y)?.cost))throw Error('유닛 위치 또는 HP가 손상되었습니다.');
  if(alive(u)){const p=`${u.x},${u.y}`;if(occupied.has(p))throw Error('유닛이 중복 배치되었습니다.');occupied.add(p);}
  if(u.team==='ally'&&(!HEROES.some(h=>h.id===u.id)||!Number.isInteger(u.level)||u.level<1||!Number.isInteger(u.xp)||u.xp<0||u.xp>=100||!Array.isArray(u.clues)||!Array.isArray(u.growthHistory)||!Array.isArray(u.highlights)||!Array.isArray(u.healTargets)))throw Error('성장 기록이 손상되었습니다.');
  if(u.team==='ally'&&(!Number.isInteger(u.earnedXP)||u.earnedXP<0||u.clues.some(c=>typeof c!=='string')||u.highlights.some(h=>typeof h!=='string')||u.growthHistory.some(g=>!g||!Number.isInteger(g.level)||!g.changes)||typeof u.moved!=='boolean'||typeof u.acted!=='boolean'))throw Error('장수 행동 또는 성장 기록이 손상되었습니다.');
 }
 for(const u of [...HEROES,...ENEMIES,...CIVILIANS])if(!ids.has(u.id))throw Error('필수 유닛이 없습니다.');
 if(!Array.isArray(s.enemyQueue)||!Number.isInteger(s.enemyIndex)||s.enemyIndex<0||s.enemyIndex>s.enemyQueue.length||!s.undo||!Number.isInteger(s.potions)||s.potions<0||s.potions>2)throw Error('전투 상태가 손상되었습니다.');
 if(s.enemyQueue.some(id=>!s.units.some(u=>u.id===id&&u.team==='enemy')))throw Error('AI 순서가 손상되었습니다.');
 if(s.campaign.heroes!==null){if(!Array.isArray(s.campaign.heroes)||s.campaign.heroes.length!==5||new Set(s.campaign.heroes.map(u=>u.id)).size!==5)throw Error('군단 성장 저장이 손상되었습니다.');for(const u of s.campaign.heroes){if(!HEROES.some(h=>h.id===u.id)||!Array.isArray(u.clues)||!Array.isArray(u.growthHistory)||['level','xp','maxHP','maxMP','atk','def','mag','res','spd'].some(k=>!Number.isInteger(u[k])||u[k]<0))throw Error('군단 수치가 손상되었습니다.');}}
 if(s.log.some(l=>typeof l!=='string')||s.missionStart.length!==5||s.missionStart.some(m=>!m||!HEROES.some(h=>h.id===m.id)||!m.stats||!Number.isInteger(m.level)))throw Error('미션 기록이 손상되었습니다.');
 if(s.outcome!==null&&!['victory','defeat'].includes(s.outcome)||s.screen==='result'&&!s.outcome)throw Error('미션 결과가 손상되었습니다.');
 if(s.stageStart!=null){const initial=s.stageStart;if(initial.stageStart!=null||initial.screen!=='battle'||initial.phase!=='player'||initial.turn!==1||initial.initialSeed!==s.initialSeed||initial.rng!==s.initialSeed||initial.potions!==2||initial.reinforced||initial.units?.length!==12||initial.units?.some(u=>u.team==='ally'&&(u.moved||u.acted)||u.team==='civilian'&&u.rescued))throw Error('스테이지 시작 기록이 손상되었습니다.');validate(initial);}
 return s;
}
export function migrate(s){if(s?.schema===0){s.schema=1;s.version='0.1.0';s.feedback=s.feedback||[];}if(s?.schema>SCHEMA)throw Error('더 최신 버전의 저장입니다.');return validate(s);}
export function serialize(s){validate(s);const data=JSON.stringify({...s,feedback:[]});return JSON.stringify({format:'AshenCrown',schema:SCHEMA,checksum:checksum(data),data});}
export function deserialize(text){if(typeof text!=='string'||text.length>5000000)throw Error('저장 크기가 올바르지 않습니다.');const envelope=JSON.parse(text);if(envelope.format!=='AshenCrown'||typeof envelope.data!=='string'||checksum(envelope.data)!==envelope.checksum)throw Error('저장 검증에 실패했습니다.');return migrate(JSON.parse(envelope.data));}
export function saveGame(s,storage){try{const data=serialize(s),old=storage.getItem(SAVE_KEY);if(old){try{deserialize(old);storage.setItem(BACKUP_KEY,old);}catch{}}
 storage.setItem(SAVE_KEY,data);if(storage.getItem(SAVE_KEY)!==data)throw Error('저장 확인 실패');return {ok:true};}catch(e){return {ok:false,error:e.message};}}
export function loadGame(storage){try{const data=storage.getItem(SAVE_KEY);if(!data)return {state:null};try{return {state:deserialize(data)};}catch(primary){const backup=storage.getItem(BACKUP_KEY);if(backup)return {state:deserialize(backup),warning:'최근 저장이 손상되어 이전 정상 저장을 복구했습니다.'};return {state:null,warning:`저장을 불러올 수 없습니다: ${primary.message}`};}}catch(e){return {state:null,warning:`브라우저 저장을 사용할 수 없습니다: ${e.message}`};}}
export function resetSave(storage){try{storage.removeItem(SAVE_KEY);storage.removeItem(BACKUP_KEY);return {ok:true};}catch(e){return {ok:false,error:e.message};}}
