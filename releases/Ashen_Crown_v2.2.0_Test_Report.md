# Ashen Crown v2.2.0 「일기토 장면과 새 주점」 — Test Report
Updated 2026-11-19 KST. **Release candidate on feature/v2.2.0-duel; not merged before the user plays and approves it.**
- Decisions: D-122 (design and the art pack I work order) and D-123 (this build).
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
- **Unit tests: 535 PASS / 0 FAIL / 16 skipped with reasons (551 in all)** (docs/v2.2.0/evidence/unit-results.txt).
  - New: the village tavern room test (the keeper behind the bar, the chests, other taverns unchanged).
  - Changed: the Garr and M16 duel tests now expect an always-won duel — a level gained, the foe at a third and alive, no stepping back.
- **Full browser and balance matrix, 66 suites: all exit 0** (docs/v2.2.0/evidence/browser-run-summary.log, 2,325 `PASS` lines). Run in two parallel halves on 2 cores.
  - 64 suites passed on the first run.
  - migration-v093 and migration-v0100: the browser tab crashed out of memory while both halves ran. Each was rerun alone, unchanged, and passed with 13 checks each.
- **v210-e2e: 46 checks PASS at 1440 and 390** (docs/v2.2.0/evidence/v210-e2e.json; screenshots docs/v2.2.0/screenshots/duel-scene-*.png).
  - Erik beside Garr opens the duel window at the next player phase.
  - Erik is a level up, Garr is left at a third and alive, and no choice is offered.
  - The window names both fighters, 「일기토」 and the stage.
  - It ends on LEVEL UP · LV 1 → 2, then closes, and the battle goes on.
  - The new tavern's keeper is reached from the bar.
- **Story duels in the browser:**
  - act3 (M16): the window opens and Erik gains a level.
  - act4b (M26): resolve ≥ 2 and Baldrick stays alive.
  - act4d (M29): the choice modal; 「아렌에게 맡긴다」 leads to Aren's last words.
- **The e2e winning trace** replays M01 move by move with the duel window opening and being skipped: `Duel event opens the duel window`.
- **Performance** (median frame): camp 16.7 ms at 1440 and 390; battle 33.3 ms at 1440 and 16.7 ms at 390. Same as v2.1.0.

## Balance (보통; the test player always lets the duel happen)

| ACT I (act1-balance, 30 seeds chained) | M01 | M02 | M03 | M04 | M05 | M06 |
|---|---:|---:|---:|---:|---:|---:|
| Won / played | 30/30 | 30/30 | 29/30 | 22/29 | 21/22 | 19/21 |
| Win % | 100% | 100% | 97% | 76% | 95% | 90% |
| v2.1.0 final | 100% | 100% | 70% | 71% | 80% | 100% |

- **act2-balance**, first try per mission (gate: Wilson upper bound ≥ 0.6). **No mission is low.**

  | Missions | First-try wins |
  |---|---|
  | ACT I | M01 20/20, M02 20/20, M03 20/20, M04 15/20, M05 18/19, M06 17/19 |
  | ACT II | M07–M14 all 18/18 |
  | ACT III | M15 14/18, M16 17/17, M17 13/17, M18 16/16, M19 16/16, M20 15/16, M21 13/16, M22 14/16 |
  | ACT IV | M23–M28 15/15, M29 14/15, M30 15/15 |

- **economy-balance** (all loadouts together): M1 30/30, M2 30/30, M3 24/30.
- The ACT I band's top of 85% is a target shown in the report, not a gate. With the level a duel now gives, M01–M03 and M05–M06 sit above it.

## Not measured
- The duel window's look with the final art (pack I parts B–G not yet delivered).
- 어려움 was not re-measured. The only change there is the foe being left at half its HP after a duel.
