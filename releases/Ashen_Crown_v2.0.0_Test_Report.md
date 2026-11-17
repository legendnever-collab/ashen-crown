# Ashen Crown v2.0.0 「전장 개편」 stage 1 — Test Report
Updated 2026-11-17 KST. **Release candidate on feature/v2.0.0-reform; not merged before the user plays and approves it.** Decisions: D-115 (docs/v2.0.0/REFORM_DESIGN.md, approved with the recommended answers) and D-116 (implementation details, PROPOSED); base feature/v2.0-design ← v1.0.0 RC 306f3e3 (v1.0.0 stays its own release candidate, PR #28).

HTML SHA256 of the build under review: `7117ce2c052958958f195804a6379f052a22a34afd005d659bc9ddd562f145dc` (`index.html` identical; also in `releases/Ashen_Crown_v2.0.0_SHA256SUMS`). Art pack H1 has not been made yet: class figures are the existing painted sheets tinted by side, the officer busts, the arena background and icon sheet P are game-drawn stand-ins.

## Summary
- **526 unit tests PASS / 0 FAIL / 16 skipped with reasons** (542 in all; docs/v2.0.0/evidence/unit-results.txt). New: tests/stats8.test.mjs (7), tests/act1-v200.test.mjs (20), tests/migration-v200.test.mjs (4); every older unit suite moved onto the v2 rules.
- **Full browser and balance matrix, 65 suites, on this build** (docs/v2.0.0/evidence/browser-run-summary.log): **all exit 0**. 2,363 `PASS` lines. No runtime errors. Run in two halves on a 2-core container; act2-balance was rerun after its gate was changed from a plain 60% cut to the Wilson bound (same seeds, same rates).
- Balance on 보통 (policy player, same rules API as the UI): ACT I (30 seeds chained, one try each) M01 27/30 (balance.mjs 24/30), M02 27/27, M03 22/27, M04 16/22, M05 12/16, M06 12/12; ACT II–IV (20 seeds, up to three tries per battle) every mission's first try passes the gate, lowest M26 5/10 and M21 8/12.
- 어려움 (measured with the scratch harness from the same policy, see below): retuned in D-116 after the designed +2 levels / ×1.15 walled M01–M05 and M15.
- Performance (performance suite, headless Chromium on 2 cores, median frame): camp 16.7 ms at 1440 and 390, battle 16.7 ms at 390, **battle 33.3 ms at 1440 (p95 50 ms)** — the big map draws more tiles; v1.0.0 measured 16.7 ms everywhere. Watch item for real devices.
- Save conversion: real v1.0.0 schema-19 saves (camp before M02, M05 battle, finished campaign with ending B; tests/fixtures/v100) and shipped v0.2–v0.10.2 pages' saves open as schema 20.

## New suites
| Suite | Checks | Result |
|---|---:|---|
| **stats8** (unit): Lv 1 numbers kept, growth and promotion, enemy level (rank, share, floor, 어려움 from a Lv 19 sortie), proportional troop scaling and idempotence, the troop tier cap, 어려움's ramp, the ratio formula, curses, the triangle | 7 | PASS |
| **act1-v200** (unit): M01 on the 22×16 village (five heroes, three officers on the bench, raiders, two villagers); movement costs and blocked tiles; deployment swaps and presets (every ACT I preset inside its zone); undo; the ratio formula; Hawk Eye, Unstable Mana, Quick Strike flanks; the counter in the forecast; healing by 의지; growth by the six stats; rescue; the T3 wave at the sortie's level; villagers safe until T6; fire; victory and defeat; 어려움's potion and bigger waves, and its extra soldiers saved and reloaded | 20 | PASS |
| **migration-v200** (unit): real v1.0.0 saves → schema 20, assets kept, officers and start treasures added, heroes recomputed, M02 won on the new map, a battle reopens in camp, the ending-B campaign carries over with every piece of gear | 4 | PASS |
| **v200-e2e** (browser): difficulty asked for a new campaign and changed in camp; officers in roster and camp; item tabs and start treasures; six stats in the unit sheet; five of eight sortie, officers on the bench; M01 on the 22×16 village with the minimap; enemies at the sortie's level; the shipped v1.0.0 page's village and battle saves and the finished v1.0.0 campaign open as v2.0.0 and survive a reload; no runtime errors | 18 | PASS |

Screenshots: docs/v2.0.0/screenshots (difficulty, inventory treasures, unit sheet, M01 big map, v1.0.0 ending camp, duel arena).

## Balance (보통)
### ACT I (act1-balance, 30 seeds; docs/v2.0.0/evidence/act1-balance.json)
| Mission | Played | Wins | Win % | Win turns (avg) | Par / Limit | Avg level in |
|---|---:|---:|---:|---|---|---:|
| M01 잿빛 마을의 습격 (22×16) | 30 | 27 | 90% | 7–10 (8.3) | 9 / 14 | 1.4 |
| M02 숲길의 추격 (28×14) | 27 | 27 | 100% | 7–9 (8.3) | 8 / 8 | 3.2 |
| M03 무너진 다리 (26×18) | 27 | 22 | 81% | 14–16 (15.3) | 13 / 16 | 4.7 |
| M04 버려진 성채 (24×20) | 22 | 16 | 73% | 8–15 (10.1) | 11 / 16 | 7.5 |
| M05 국경의 사자 (28×16) | 16 | 12 | 75% | 6–7 (6.6) | 9 / 10 | 9.7 |
| M06 재의 맹세 (24×20) | 12 | 12 | 100% | 12–17 (14.2) | 11 / 18 | 10.9 |

- balance.mjs (M01 alone): 24/30, turns 7–11. campaign-balance: M01 27/30 · M02 27/27 (capture 8) · M03 22/27. m05-balance 12/16, m06-balance 12/12. economy-balance 80/86 with no purchase required.
- The band is 60–85% (D-115 §6.4); the gate is ≥ 60% per mission. **M01 (90%) and M06 (100% of 12) sit above the band** — play-test watch items. M02 cannot be lost by design.
- Trials (class-balance): Lia 30/30 (30/30 without the action), **Sain 30/30 (29/30 without the prayer)**, Kai 30/30 (0/30 without the action); drill Lv 4 → 6 in 10 drills.

### ACT II–IV (act2-balance, 20 seeds, up to three tries per battle; gate on the first try)
| Mission | First try | Mission | First try | Mission | First try |
|---|---:|---|---:|---|---:|
| M07–M14 | 17/17 each | M19 | 16/16 | M25 | 10/10 |
| M15 | 15/17 | M20 | 11/16 | M26 | **5/10** |
| M16 | 14/17 | M21 | 8/12 | M27 | 10/10 |
| M17 | 14/17 | M22 | 9/10 | M28 | 10/10 |
| M18 | 14/16 | M23, M24 | 10/10 | M29, M30 | 10/10 |

- Gate: the 95% Wilson upper bound of each mission's first-try rate reaches 0.6 (n is 10–17 late in the chain, so a plain 60% cut fails a 75% mission by chance). M26 5/10 passes it; measured separately from the five post-M25 saves × 4 rolls it is 18/20 (two losses: Eric falls).
- Ten of twenty campaigns win M30 (each battle at most three tries; a campaign ends at its third loss of one battle).
- Mission shares tuned here (D-116): M03 +.4 → +.55 (the chain had won M03 27/27), M22 −.04 → −.14 (first try 4/10).

## 어려움 (D-116)
Measured with the same policy player (scratch harness, not a shipped suite): ACT I chained over 20 seeds with up to three tries per mission; later missions from the post-M14/M19/M24/M29 chain saves.

| Mission | First try | Note |
|---|---:|---|
| M01 | 17/20 | no stat push in ACT I: waves +25%, one potion, AI focus on healers and mages |
| M02 | 20/20 | cannot be lost |
| M03 | 4/20 | |
| M04 | 13/17 | |
| M05 | 4/16 | |
| M06 | 11/11 | |
| M15 | 6/20 | full push (+1 level, ×1.1); with the designed +2 / ×1.15 it was 2/20 |
| M20 | 6/12 | |
| M22 | 3/20 | share −.14 (0/20 at −.09) |
| M25 | 10/10 | |
| M30 | 12/12 | |

- Before D-116 (the designed +2 levels / ×1.15 from the first battle) M01 was 0/20 and M03 0/12.
- 어려움 is far from the design's 30–60% band in places (M03, M05, M22 low; M01, M04, M06, M25, M30 high). Left for the play-test: the policy player is weaker than a person in some missions and stronger in others.

## Anti-plagiarism checklist (REFORM_DESIGN §13)
| # | Check | Result |
|---|---|---|
| 1 | New names compared with 조조전 class chains and item names and the Koei 삼국지 stat set (`node scripts/name-check.mjs`, docs/v2.0.0/evidence/name-check.txt) | 173 names. Exact matches only on generic words: the category labels 보병, 궁병, 도적 and the stats 무력, 민첩, 운. **No class chain, tier name, skill, treasure or tool name matches.** The stat set differs (ours 무력·지혜·의지·강인·민첩·운; 삼국지 무력·지력·통솔·정치·매력·민첩·운) |
| 2 | Art ordered with "do not imitate any existing game's art, unit costumes or duel screen; do not name the game" | In the H1 work order (docs/v2.0.0/art/h1-work-pack/00_START_HERE.md). The pack has not returned; check it on import |
| 3 | Screen layouts | The duel is our own 잿빛 결투장 (exchanges of 베기·막기·노리기 with stat bars), not a stone-pattern backdrop with corner portraits and speech bubbles; the battle UI and sortie screens keep the v1 layout with tabs and the minimap added |
| 4 | Tables | Growth, matchups (our own triangle with healers outside), the ratio formula, treasure stats and difficulty set by our own tests (D-116) |
| 5 | Story and dialogue | Unchanged Ashen Crown text; the officers' lines are new and original |

## All suites (exit code and `PASS` lines)
| Suite | PASS lines | Exit |
|---|---:|---:|
| act1 | 114 | 0 |
| act1-balance | 0 | 0 |
| act2 | 28 | 0 |
| act2-balance | 0 | 0 |
| act2-campaign | 24 | 0 |
| act2-hubs | 315 | 0 |
| act2b-campaign | 22 | 0 |
| act2c-campaign | 26 | 0 |
| act2d-campaign | 30 | 0 |
| act3 | 38 | 0 |
| act3b | 48 | 0 |
| act3c | 50 | 0 |
| act3d | 44 | 0 |
| act4a | 30 | 0 |
| act4b | 32 | 0 |
| act4c | 34 | 0 |
| act4d | 38 | 0 |
| arms | 42 | 0 |
| audio-mute | 20 | 0 |
| balance | 0 | 0 |
| campaign | 235 | 0 |
| campaign-balance | 0 | 0 |
| class | 31 | 0 |
| class-balance | 0 | 0 |
| e2e | 86 | 0 |
| economy-balance | 0 | 0 |
| feedback-v091 | 5 | 0 |
| frontier | 105 | 0 |
| http | 1 | 0 |
| hub-doors | 0 | 0 |
| item-art | 18 | 0 |
| journey | 177 | 0 |
| legion | 20 | 0 |
| m05-balance | 0 | 0 |
| m06-balance | 0 | 0 |
| migration-v0100 | 14 | 0 |
| migration-v0101 | 14 | 0 |
| migration-v0102 | 14 | 0 |
| migration-v02 | 17 | 0 |
| migration-v031 | 12 | 0 |
| migration-v032 | 9 | 0 |
| migration-v033 | 11 | 0 |
| migration-v040 | 13 | 0 |
| migration-v050 | 13 | 0 |
| migration-v060 | 13 | 0 |
| migration-v061 | 13 | 0 |
| migration-v070 | 13 | 0 |
| migration-v071 | 13 | 0 |
| migration-v080 | 15 | 0 |
| migration-v081 | 15 | 0 |
| migration-v090 | 15 | 0 |
| migration-v091 | 14 | 0 |
| migration-v092 | 14 | 0 |
| migration-v093 | 14 | 0 |
| mobile | 98 | 0 |
| mobile-command | 25 | 0 |
| performance | 0 | 0 |
| post-move | 1 | 0 |
| quality | 99 | 0 |
| renaissance | 142 | 0 |
| restart | 23 | 0 |
| tactical | 28 | 0 |
| tactics | 26 | 0 |
| v200 | 19 | 0 |
| world | 33 | 0 |

## Not tested
- Real-device touch play (only Chromium emulation at 390×844 and 1440×900).
- The H1 art (not made yet).
- 어려움 in ACT II–IV beyond the sampled M15, M20, M25 and M30.
