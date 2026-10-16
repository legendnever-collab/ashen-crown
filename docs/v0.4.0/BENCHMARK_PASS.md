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
