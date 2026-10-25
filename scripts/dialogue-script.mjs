// Writes docs/v0.6.0/DIALOGUE_SCRIPT.md: every story conversation (ACT I + ACT II M07–M08) in play order, for reading and review (D-062).
import fs from 'node:fs';import {STORY,SPEAKERS} from '../src/data/story.js';import {LAST_MISSION} from '../src/data/missions.js';
const who=l=>l.name||SPEAKERS[l.speaker]?.ko||(l.speaker==='boss'?'적 지휘관':l.speaker);
const out=['# 대화 대본 · ACT I + ACT II M07–M08 (v0.6.0, D-062/D-064)','','`node scripts/dialogue-script.mjs`로 게임 데이터에서 만든 문서입니다. 문구는 PROPOSED이고, 줄거리·선택지·목표는 그대로입니다.',''];
const scene=(k,title)=>{if(!STORY[k])return;out.push(`### ${title||k}`,'',...STORY[k].map(l=>`- **${who(l)}**: ${l.text}`),'');};
const NPCS=['aren','elina','lia','sain','kai','thea','thea:joined','thea:parted','elder','refugee','guard','advisor'];const WORLD={7:'world:castletown',8:'world:march'};
for(let m=1;m<=LAST_MISSION;m++){out.push(`## M0${m}`,'');if(WORLD[m])scene(WORLD[m]);
 for(const k of [`pre:${m}`,...Object.keys(STORY).filter(k=>k.startsWith(`pre:${m}:`))])scene(k);if(m===1)scene('raid');
 out.push('#### 거점 대화 · 출전 전','');for(const id of NPCS)scene(`npc:${m}:preparation:${id}`,`npc · ${id}`);
 out.push('#### 전투','');for(const k of Object.keys(STORY).filter(k=>k.startsWith(`${m}:`)))scene(k);
 for(const k of [`after:${m}`,...Object.keys(STORY).filter(k=>k.startsWith(`after:${m}:`))])scene(k);if(m===6)scene('act1:complete');
 out.push('#### 거점 대화 · 전투 후','');for(const id of NPCS)scene(`npc:${m}:aftermath:${id}`,`npc · ${id}`);}
fs.writeFileSync('docs/v0.6.0/DIALOGUE_SCRIPT.md',out.join('\n'));console.log('lines',out.length);
