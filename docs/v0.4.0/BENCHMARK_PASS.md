# v0.4.0 Benchmark Pass (Cao Cao's Legend conventions, original content)

Decisions: D-038 (Lia as strategist), D-039 (balance re-baseline), D-040 (scope). Only gameplay conventions, information layout and presentation density are benchmarked; all art, UI chrome, characters and text are original.

## B1 — controls and bugs (implemented)
| # | Rule |
|---|---|
| 2 | Arriving in front of a door never prompts. Stepping into the doorway (↑ at the threshold, or clicking the door) shows Erik in the doorway and asks to enter. |
| 5 | Guard = self stance, usable anywhere. Until the next player turn: DEF +3 and the first melee hit on an adjacent ally is taken by Erik. 12 EXP per use; intercept still grants Guard EXP. |
| 6 | When no hero can act, a centred non-blocking card asks "다음 턴으로 넘어가겠습니까? 예/아니오". The end-turn button keeps working. |
| 8 | Command list is a compact vertical icon list placed beside the unit (right, else left/below/above), never covering the unit; only relevant commands appear. |
| 10 | Level-up restores HP/MP. Each heal grants min(24, 10 + ⌊(heal+splash)/2⌋) EXP. |
| 11 | Bag slots with pixel icons, detail panel, gear storage grid; paper-doll equipment with stat bars (equipment bonus in gold). |

## B2 — systems (implemented)
### Enterable buildings and chests (#3)
Every ordinary building (homes, barracks/triage, supply depots, command quarters) has a door anchor computed from its footprint and an original interior template (house, barracks, store, quarters). Chests: one roll per chest per mission, fixed by the run seed (`m{mission}:{hub}:{building}:{chest}`), stored in `economy.chests` inside the atomic transaction. Odds: 60% Gold 15–40, 20% Medium Potion, 10% Ether, 10% empty. A full bag converts an item to 20 Gold. Practice mode cannot open chests.

### Terrain (#9)
Defender terrain modifies damage by percentage; fire (Lia's Fire Bolt) uses the fire multiplier instead of the physical cut.

| Terrain | Move infantry / rogue / cavalry | Physical damage | Evade | Fire | Other |
|---|---|---|---|---|---|
| 평지 | 1 / 1 / 1 | — | — | ×1.25 | |
| 길 | 1 / 1 / 1 | — | — | ×1 | |
| 숲 | 2 / 1 / 1 | −20% | +15% | ×1.5 | |
| 산길 | 3 / 1 / 불가 | −30% | +10% | ×1 | |
| 사막 | 2 / 1 / 1 | — | −5% | ×1 | |
| 늪 | 3 / 2 / 불가 | — | −10% | ×0.5 | |
| 다리 | 1 | — | −10% | ×1 | |
| 마을 | 1 | −10% | — | ×1.25 | HP 10% / MP 5% per phase |
| 요새 | 1 | −25% | — | ×1 | HP 15% / MP 10% per phase |
| 성벽 위 (M04) | 1 | −25% | +5% | ×1 | |

Tapping a tile shows a one-line summary, e.g. `숲 · 이동 보병 2 · 도적 1 · 기병 1 · 일반공격 20%↓ · 회피 15%↑ · 화공 50%↑`.

### Fire tactics
A Fire Bolt hit on grass/forest/village sets the tile burning for two turns. Units standing in fire at the start of their side's phase lose 10% max HP (min 3), never below 1 HP. Fire is drawn on the map and saved (`burning`).

### Unit sheet, tactics, turn display
`정보` opens a tabbed sheet: 능력 (letter grades S–E, HP/MP/EXP bars, talent, clues), 장비, 책략 (MP, effect, range grid), 열전 (original short biography), 병종 (terrain aptitude table and 7×7 attack range grid). Enemies can be inspected from the dock. The phase bar shows `턴 n / 제한` (M02 8, M03 10, M04 14) or `턴 n · 권장 8` for M01.

## Balance re-baseline (executed locally, legal policy)
M01 30/30 (turns 4–6); M01–M03 campaigns 30/30 (capture 15, perfect rescues 30, bridge turns 5–8); economy 90/90; M04 30/30 (turns 4–10, avg 8.0, avg 4.47 surviving heroes). The legal-play test policy now steps deeper into the M03 safe zone so arriving heroes do not block the bridge exit.

## B3 — voice, strategist and play-test feedback (implemented, 2026-10-17)
### Dialogue (PROPOSED wording; canon facts unchanged)
All ACT I scenes, camp/village conversations, NPC lines, Erik's replies and briefings were rewritten in spoken Korean with one voice per character: Erik short soldier 반말; Aren weighty, pauses (…); Elina sharp, dry 해요체; Lia quick, excited scholar; Sain gentle 존댓말; Kai teasing 반말; the M04 quartermaster speaks 하오체. Line order, speakers and every observed fact (seal, crate numbers, 「폐기 처분」, scraped signature, Lia's teacher notation, Kai's courier-form knowledge) are unchanged; nothing names a culprit.

### Lia as strategist (D-038)
Lia stands at the war table beside her staff aide (the aide keeps the `advisor` id that drives the council). The aide reports scouting; Lia gives the plan in every briefing and aftermath note. The council screen and the briefing window show Lia's portrait ("군사 리아").

### Feedback batch
| # | Change |
|---|---|
| 1 | New original score: 11 tracks (adds M04 "Halls of the Quartermaster"), each with its own key, tempo, chord loop and melody. Layered synthesis: detuned low-pass pads, harp/pluck arpeggios, breathy flute with vibrato, FM celesta, soft horn, timpani/snare noise, generated stereo reverb and a bus compressor. Only the current and fading tracks are scheduled. Offline render check: peaks 0.18–0.33, no clipping. |
| 2 | Command list: 공격 / 기술 / 도구 / 정보 / 이동 취소 (plus 조사·구출·생포 only when a legal target is adjacent, and 대기). |
| 3 | Opening and story text enlarged. |
| 4 | Village/camp map fills the screen (no side panels); controls float over the map. |
| 5 | Ending the turn early shows the same centred card: "아직 행동하지 않은 장수가 n명 있습니다. 넘어가겠습니까?" |
| 6 | Result screen: banner, stars, reward icons (item × n, Gold), hero portrait tiles with EXP bars and a LEVEL UP badge; text only for important notes. |
| 7 | Quest is a scroll button (or Q) that opens a short card and closes again; default closed. |
| 8 | Interiors have the exit door on the bottom row; walking onto it leaves the building. |
| 9 | Hit = clamp(70–100, 97 (magic 100) + 1.5 × SPD gap − terrain evade + skill/gear bonuses − target dodge). Crit = clamp(3–12%, SPD gap/2 + 5), ×1.5 damage; magic never crits. |
| 10 | Depth-sorted town drawing (heroes never draw over roofs), villagers pace slowly with role props, and the faced person is talked to first when several are adjacent. |

## B4 — graphics (sample approved by the user 2026-10-17 07:43; rolled out)
`src/render/hd-art.js` paints original pixel art at 48 logical pixels per tile, shown at 2× (96 px per tile on desktop):
- Per-pixel shading ramps (hue-shifted shadows/highlights) with ordered dithering, coloured outlines on every figure and object.
- Organic terrain edges (roads, sand, water and swamp fray into grass), tufts/flowers/stones, shore foam, plank bridges, flagstone fortress floors and ramparts.
- Trees, bushes, ruined walls, crags and cottages are depth-sorted objects; a unit always draws in front of the trees on its own tile.
- 20 hand-built figures (six heroes and the commander, five enemy types, nine civilians/staff) with distinct silhouettes, headgear and props; chibi proportions with eyes that stay visible under hair, hoods and helmets.
Sample images: docs/v0.4.0/b4/ (`b4-compare` current vs sample on the same M01 scene at the same scale, `b4-scene`, `b4-zoom`, `b4-cast`, `b4-terrain`). Harness: `samples/b4/index.html` (`#scene`, `#cast`, `#terrain`), rendered by `node samples/b4/shots.mjs <outdir> scene cast terrain`.
Rollout after approval: replace battle tiles/sprites, town tiles/NPCs and portraits-on-map with this renderer, add walk/attack frames and facing, keep the 64-unit logical coordinate system and all hit-testing unchanged.

### B4 revision 1 (user feedback 2026-10-17 07:27)
- Head reduced (15×14 px instead of 17×16) so bodies read taller.
- Four facings: down (front), right (profile), up (back view), left (mirrored profile), plus a four-step walk cycle; units turn to the direction they travel. Back views show hair, capes, quivers and shields; profiles show one eye, nose and the near arm. Images: `b4-facing.png`, `b4-walk.gif`; harness views `#facing`, `#walk`.

### B4 rollout (implemented 2026-10-17)
- Battle (`pixel-renderer.js`) and towns/interiors (`frontier-renderer.js`) now draw through `src/render/hd-world.js`: hd-art ground (organic edges, fortress walls with brick faces, plank interior floors), depth-sorted decor, M01 burning cottages with flames/smoke, recovery wells and supply outposts (green mark), and 30 figure looks.
- Enemy looks per mission: M01 bandits/Garr, M02 deserters and their leader, M03 armoured pursuers and commander, M04 fortress guards, wall archers, torch-bearers, cellar workers and the quartermaster. Erik switches to his LV5 outfit (cape) when that appearance tier unlocks.
- Facing: battle units face the direction of travel step by step, face their target when attacking, and start facing the nearest opponent; town NPCs pace slowly turning left/right, pause facing front, and turn toward Erik when he is next to them; Erik faces his last step.
- Coordinates, hit-testing, cameras, saves and rules are unchanged (64-unit world; art is drawn at 4/3 scale from ×3 nearest-upscaled caches). The ground is resampled once per device scale and blitted 1:1 each frame: desktop 1440 median frame time fell from 33 ms to 16.7 ms in the local headless run.
- Portraits (dialogue, dock, result, info sheet) keep the existing 128-pixel art.

### Character pass v2 (user benchmark sheets, 2026-10-18)
The user supplied classic tactical-SRPG unit sheets as a benchmark. Only measurable conventions were taken from them; no pixels were traced or copied.
| Convention measured | Reference | Ashen Crown v2 (`src/render/hd-figure.js`) |
|---|---|---|
| Cell | 48×48, one unit per tile | 48×48 cell drawn into the 48-px tile, feet on row 46 |
| Figure height | 43–48 px (fills the tile) | 46–47 px |
| Head : body | ≈ 1 : 3.4 | head 11–12 px of 46 (≈ 1 : 3.6), larger eyes |
| Width front / side | 27–46 / 37–48 px (weapons, stride and horses extend) | 31–40 / 26–48 px; side stride 8 px, bows held forward |
| Directions | down, left, right (mirror), up | same |
| March | 2 alternating poses per direction, also played while standing | 2 poses (step A / step B); units march in place on the battle map, faster while moving |
| Mounted | horse fills the cell width, rider above | horse body/legs across the cell, rider seated, horse head in front view |
Outlines are a single dark ink, figures are assembled from parametric original parts (heads, hair, headgear, bodies, weapons, horse). The old 40×52 figure code was removed from `hd-art.js`.
