import {newGame,startBattle} from '../src/core/game.js';import {playBattle} from './player-policy.mjs';import {MISSIONS} from '../src/data/missions.js';
const v=process.argv[2]||'base',m=MISSIONS[1];
if(v==='civhp')m.civilians.forEach(c=>{c.hp=40;c.def=6;});
if(v==='hold')m.enemies.filter(e=>['r1','r2'].includes(e.id)).forEach(e=>e.hold=3);
if(v==='both'){m.civilians.forEach(c=>{c.hp=40;c.def=6;});m.enemies.filter(e=>['r1','r2'].includes(e.id)).forEach(e=>e.hold=3);}
if(v==='weak'){m.enemies.filter(e=>['r1','r2'].includes(e.id)).forEach(e=>{e.atk=8;});m.civilians.forEach(c=>{c.hp=36;});}
if(v==='weak2'){m.enemies.filter(e=>['r1','r2'].includes(e.id)).forEach(e=>{e.atk=8;});m.civilians.forEach(c=>{c.hp=40;});}
if(v==='X'||v==='Y'){m.enemies.filter(e=>['r1','r2'].includes(e.id)).forEach(e=>{e.atk=8;});m.waves[1].turn=6;}if(v==='Y')m.civilians.forEach(c=>{c.hp=36;});if(v==='Z'){m.enemies.filter(e=>['r1','r2'].includes(e.id)).forEach(e=>{e.atk=8;});m.waves[1].turn=7;m.civilians.forEach(c=>{c.hp=36;});}
const S0=+(process.argv[3]||20261014),N=+(process.argv[4]||60);
let w=0,n=0,why={};for(let seed=S0;seed<S0+N;seed++){const s=newGame(seed);s.campaign.difficulty='normal';s.screen='deployment';startBattle(s);const r=playBattle(s);n++;if(s.outcome==='victory')w++;else why[s.reason||r.reason||s.outcome]=(why[s.reason||r.reason||s.outcome]||0)+1;}
console.log(v,w,'/',n,JSON.stringify(why));
