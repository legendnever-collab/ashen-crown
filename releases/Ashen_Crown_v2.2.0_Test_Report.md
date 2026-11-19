# Ashen Crown v2.2.0 「일기토 장면과 새 주점」 — Test Report
Updated 2026-11-19 KST. **Merged on the user's word** ("그림까지 넣은뒤 병합해줘", D-124).
- Decisions: D-122 (design and the art pack I work order), D-123 (the RC) and D-124 (the foe leaves the field, difficulty, art pack I B–I).
- HTML SHA256: see `releases/Ashen_Crown_v2.2.0_SHA256SUMS` (`index.html` is identical).

## What changed (for the reader of the results)
- **Every duel is won by our hero** (`core/duel.js duelWin`): three scripted exchanges, then +1 level through `awardXP` (HP and MP refill) and the foe's treasure.
- **The beaten foe leaves the field** (D-124, `core/game.js setDuelFall`, mission rule `duelFall`):

  | Missions | The foe after the duel |
  |---|---|
  | M01, M16, M18–M21, M25 | struck down (Garr counts as defeated) |
  | M09, M10, M12 | captured (the mission's capture rule) |
  | M05, M13 | Baldrick withdraws: the 「꺾임」 ending, victory |
  | M26 | Baldrick lays down his sword: victory, joining or riding beside by the M13 flag |
  | M29 | Bellard turns to his second phase |

- **No choice:** there is no exchange choice and no stepping back, except at M29, which keeps the story choice to leave the duel to Aren's last words.
- **Difficulty** (D-124, `core/stats8.js`): enemy stats ×1.08 from M02 on both difficulties; M03 ×1.01, M04 ×1.03, M15 and M16 ×1.
- **The duel window** (`ui/duel-scene.js`): a 16:9 stage of about 9.4 s that can be skipped, now drawn with art pack I — 24 action sheets, 6 finisher arts, 5 backdrops and the effect sheet.
- **Art pack I** (SHA256 verified): part A, the village tavern (earlier on this RC); B–G, the duel art (`scripts/import-duel-art-v220.py`); H/I, 20 busts of the hires and Adel and icon sheets P/Q (14 icons, shown at the tavern and the request board).

## Results on this build
- **Unit tests: 539 PASS / 0 FAIL / 16 skipped with reasons (555 in all)** (docs/v2.2.0/evidence/unit-results.txt), on the final build f007275.
  - New: `tests/duel-art.test.mjs` (the 36 duel images against their import log; every duel event has both sheets, a finisher for each hero and a backdrop) and the pack H1 P/Q icon test.
  - Changed:
    - Garr (M01) and the M16 captain fall after the duel (`s.duel.fall==='down'`).
    - M26: the won duel ends the mission — Baldrick yields and joins; persuasion without a duel is tested separately.
    - Bust count +20, icon count +14.
- **Full browser and balance matrix, 66 suites: every suite's final exit is 0** (docs/v2.2.0/evidence/browser-run-summary.log, which copies every exit code in order; 2,307 `PASS` lines in the last runs).
  - Builds:
    - The A/B halves ran on 76e695c.
    - f007275 differs from 76e695c only in M22's enemy multiplier. The suites that play M22 (act3d, act4a, migration-v093, migration-v0100) and act2-balance were rerun on it, one at a time.
  - Load failures: the halves run in parallel on 2 cores, and four suites failed under that load. Each was rerun alone, unchanged, and passed.

    | Suite | Failure under load |
    |---|---|
    | act1 | a 30 s wait timeout when moving to the next mission |
    | act4c | a click timeout |
    | migration-v040 | a click timeout |
    | v210 | the town-walk speed check (6 tiles in one second) |

  - A container restart stopped the run midway; the remaining suites were resumed.
- **Test changes made during this run:**
  - **v210-e2e** waits for the LEVEL UP banner itself instead of a fixed 8 s. With the painted art the two screenshots taken during the window took long enough that the 9.4 s window had closed.
  - **economy-balance**: in the M03 timed retreat, Lia sets the ward instead of Erik. The test player finishes M03 on its last turn, and spending Erik's first move lost it by one turn (supplies M3: 4/10 in the RC, 2/10 with ×1.08; Lia warding: 9/10).
- **v210-e2e: 46 checks PASS at 1440 and 390** (screenshots docs/v2.2.0/screenshots/duel-scene-*.png, now with the painted art):
  - Erik beside Garr opens the duel window;
  - Erik gains a level, Garr falls and leaves the field, and no choice is offered;
  - the window names both fighters and the stage, and ends on LEVEL UP · LV 1 → 2.
- **Story duels in the browser:**
  - act3 (M16): the window opens, Erik gains a level and the captain falls; the battle goes on.
  - act4b (M26): the duel gives two of resolve and Baldrick lays down his sword — victory, and he joins.
  - act4d (M29): 「아렌에게 맡긴다」 leads to Aren's last words.

## Balance (보통; the test player always lets the duel happen)

| ACT I (act1-balance, 30 seeds chained) | M01 | M02 | M03 | M04 | M05 | M06 |
|---|---:|---:|---:|---:|---:|---:|
| Won / played | 30/30 | 30/30 | 27/30 | 20/27 | 19/20 | 18/19 |
| Win % | 100% | 100% | 90% | 74% | 95% | 95% |
| v2.2.0 RC (no ×1.08, foe left at a third) | 100% | 100% | 97% | 76% | 95% | 90% |

- **act2-balance**, first try per mission, on f007275 (gate: Wilson upper bound ≥ 0.6). **No mission is low.**

  | Missions | First-try wins |
  |---|---|
  | ACT I | M01 20/20, M02 20/20, M03 18/20, M04 15/20, M05 18/19, M06 18/19 |
  | ACT II | M07 18/19, M08–M11 19/19, M12 17/19, M13 19/19, M14 19/19 |
  | ACT III | M15 11/19, M16 16/16, M17 10/16, M18 13/15, M19 15/15, M20 15/15, M21 13/15, M22 13/15 |
  | ACT IV | M23 14/15, M24–M30 15/15 |

- **Missions near the line:**
  - M15 is 58% and M17 is 62% on the first try. Both pass the gate, but M15's point estimate is under 60%.
  - M15 runs at the RC strength (×1). In the RC it was 14/18. Its losses are record boxes carried out of the gate (3 of 19).
- **On the M22 change:**
  - An earlier run on 76e695c (M22 at ×1.08) had M22 at 8/15. Its losses were heralds falling.
  - That is why M22 is held at ×1.
- **economy-balance** (all loadouts together): M1 30/30, M2 30/30, M3 26/30.
- **CI on f007275:** every balance step passed, act2-balance included. The release hash check waited for this packaging.

## Not measured
- 어려움 was not re-measured with ×1.08.
- The new duel art was checked by eye in screenshots (the VS, clash, finisher and LEVEL UP frames). There is no automated image comparison.
