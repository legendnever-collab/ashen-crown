// v2.0.0 (D-115): M01 is the 22×16 village and no raider stands in reach on TURN 1. Browser suites that test the controls
// (forecast, confirm, undo, menus) rather than the map start from an "arena": the real M01 battle at TURN 1 on 보통 with a
// few units moved — in the battle and in its stage start alike, so restart and validation agree — restored through the
// visible backup dialog. Every rule after that is the game's own.
import {newGame,startBattle} from '../src/core/game.js';import {serialize} from '../src/persistence/save-manager.js';import {findUnit,terrainAt} from '../src/core/rules.js';import {drainStory} from './story-helper.mjs';
export function arenaSave(moves={},{seed=20261014,mission=1,campaign=null}={}){const s=newGame(seed,campaign,mission);s.campaign.difficulty??='normal';s.screen='deployment';startBattle(s);
 for(const [id,[x,y]] of Object.entries(moves))for(const t of [s,s.stageStart].filter(Boolean)){const u=findUnit(t,id);if(!u)throw Error(`arena: no ${id}`);u.x=x;u.y=y;}
 return serialize(s);}
// The v0.1–v1.0 M01 layout (the old 16×12 village) laid onto the v2 village: the five heroes, the first raiders, Garr and the two
// villagers stand where the older control suites expect them; the v2 raiders of the east road keep to the east (x ≥ 14).
export const LEGACY_M01={eric:[5,8],elina:[3,8],lia:[6,8],sain:[6,9],kai:[8,8],b1:[3,5],b2:[8,5],a1:[6,4],b3:[1,2],boss:[6,1],c1:[2,3],c2:[9,3]};
export function legacyArena(extra={},opts={}){const s=newGame(opts.seed??20261014,opts.campaign??null,1);s.campaign.difficulty??='normal';s.screen='deployment';startBattle(s);
 const moves={...LEGACY_M01,...extra},taken=new Set(Object.values(moves).map(([x,y])=>`${x},${y}`));
 const m=s.units.filter(u=>!moves[u.id]&&u.team!=='ally'&&u.x<14);for(const u of m){for(let y=2;y<14&&!moves[u.id];y++)for(let x=14;x<22&&!moves[u.id];x++){const k=`${x},${y}`;if(taken.has(k)||s.units.some(o=>o!==u&&o.x===x&&o.y===y)||!Number.isFinite(terrainAt(x,y,s)?.cost))continue;moves[u.id]=[x,y];taken.add(k);}}
 for(const [id,[x,y]] of Object.entries(moves))for(const t of [s,s.stageStart].filter(Boolean)){const u=findUnit(t,id);if(u){u.x=x;u.y=y;}}
 return serialize(s);}
// Restores a backup text through ☰ → 백업 → 복원 (click or tap).
export async function restoreText(p,text,touch=false){const press=async(a)=>{const l=p.locator(`[data-do="${a}"]`).first();touch?await l.tap():await l.click();await p.waitForTimeout(120);};
 await drainStory(p);await press('menu');await press('backup');await p.locator('#backup-text').fill(text);await press('restore');await p.waitForFunction(()=>!window.AshenCrown.view().busy);await p.waitForTimeout(250);await drainStory(p);}
// v2.0.0: the big maps do not fit the battle view at the default zoom; suites that click tiles across the field (trace
// replays) zoom out with the visible − button until the whole map is in view, as a player would.
export async function fitMap(p,touch=false){for(let i=0;i<14;i++){const ok=await p.evaluate(()=>{const v=window.AshenCrown.view().camera;return v.scale*64*v.mapHeight<=v.height+1&&v.scale*64*v.mapWidth<=v.width+1;});if(ok)return true;const l=p.locator('[data-do="zoom-out"]').first();if(!(await l.count()))return false;touch?await l.tap():await l.click();await p.waitForTimeout(80);}return false;}
