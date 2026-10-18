import {STORY} from '../data/story.js';
export function narrativeState(){return {queue:[],active:null,events:[],seen:[],history:[],auto:false};}
export function enqueueStory(s,key){const n=s.narrative;if(!n||!STORY[key]||n.events.includes(key))return false;n.events.push(key);n.queue.push(key);return true;}
export function openStory(s){const n=s.narrative;if(!n.active&&n.queue.length)n.active={key:n.queue.shift(),index:0};return n.active;}
export function storyLine(s){const a=s.narrative?.active;return a?STORY[a.key]?.[a.index]:null;}
export function advanceStory(s,skip=false){const n=s.narrative,a=n.active;if(!a)return false;const lines=STORY[a.key];if(skip){for(let i=a.index;i<lines.length;i++)n.history.push({...lines[i],scene:a.key});a.index=lines.length;}else{n.history.push({...lines[a.index],scene:a.key});a.index++;}n.history=n.history.slice(-250);if(a.index>=lines.length){if(!n.seen.includes(a.key))n.seen.push(a.key);n.active=null;openStory(s);}s.campaign.dialogueMemory={seen:[...n.seen],history:structuredClone(n.history)};return true;}
export function remember(s,key){if(s.practice)return;s.campaign.tacticalMemory[key]=(s.campaign.tacticalMemory[key]||0)+1;}
export function setStoryFlag(s,key,value=true){if(!s.practice)s.campaign.flags[key]=value;}
export function introStory(s){enqueueStory(s,`${s.missionId}:intro`);if(s.campaign?.choices?.m04_records_choice)enqueueStory(s,`${s.missionId}:intro:${s.campaign.choices.m04_records_choice}`);openStory(s);}
export function afterBattleEvents(s){
 if(s.screen==='battle'&&s.phase==='player'&&s.turn===2)enqueueStory(s,`${s.missionId}:turn2`);
 if(s.missionId===1&&s.screen==='battle'&&s.turn===4)enqueueStory(s,'1:turn4');
 if(s.units.some(u=>u.rescued))enqueueStory(s,`${s.missionId}:rescue`);
 if(s.missionId===3&&s.units.some(u=>u.team==='civilian'&&u.hp<=0))enqueueStory(s,'3:loss');
 if(s.outcome){enqueueStory(s,s.outcome==='victory'?`${s.missionId}:end`:'defeat');}
}
