# Ashen Crown v0.9.3 「잿빛 선택」 — Test Report
Updated 2026-11-09 KST. **Release candidate on feature/v0.9.3-crown; not merged before the user plays and approves it.** Decision: D-093 (implementation details, PROPOSED), built on main 78f30f0 (v0.9.2 + art pack F3) with the user's play-test feedback D-092.

HTML SHA256 of the release candidate: `7242f58358880336c9c7f1bec5a8ff6c05c35e9ba1bf56e6046b3b628d070e4f` (47,099,204 bytes; `index.html` identical) — see the addendum. The full matrix below ran on the previous build `4b8984f2…` (47,099,176 bytes).

## Addendum 2026-11-09 — extras reuse painted art (D-094)
On the user's rule (chat 2026-11-09 14:46) the rite knight commander and the chancellery guard captain now wear the rite knights' painted sheet and speak with the executor's painted bust; the three heralds use the painted refugee look; their temporary vector looks were removed (src/data/missions.js, src/data/story.js, src/render/bust.js BUST_REUSE, src/render/hd-art.js). Only looks changed — no rule, number or save field. On the rebuilt HTML `7242f583…`:
- 438 unit tests PASS / 0 FAIL.
- Browser suites touching ACT III art and saves rerun and passed: act3d-e2e 44, act3c-e2e 50, act3b-e2e 48, act3-e2e 38, migration-v092 13 (docs/v0.9.3/evidence/browser-run-summary.log). The other suites and the balances were not rerun: they do not draw these units (balance runs never render) and the change touches no rule.
- Art pack F4 shrinks to 7 images (icon sheet K, the anchor stone; the last king). Headless Chromium (chromium-1194) / Playwright, offline file URLs + HTTP smoke. Only tests and docs changed after this build.

## Summary
- **438 unit tests PASS / 0 FAIL** (docs/v0.9.3/evidence/unit-results.txt). New: tests/feedback-v093.test.mjs (6), tests/mission21.test.mjs (8), tests/mission22.test.mjs (7), tests/migration-v092.test.mjs (4); updated expectations for schema 15, the gear table (69 pieces, 20 treasures), 28 music tracks, 22 story missions and the Bulwark test (a rogue bandit, since every unit now stops beside a foe).
- **Full browser matrix, 56 suites including the balances** (docs/v0.9.3/evidence/browser-run-summary.log): 1,967 `PASS` lines across the browser suites (the same count on the v0.9.2 evidence gives 1,924); no runtime errors on the final runs.
- Two suites failed on their first run for test reasons and passed on a rerun (both runs in the summary log):
  - **mobile** (79 checks) still expected an imported v0.1.0 battle to read schema 14; the browser migration suites now expect schema 15 after import (commit 7b2c927).
  - **campaign** (120 checks): under the zone of control Kai stops on M02's top rows, and the suite's tap on his tile at 1440 landed on the phase bar (the fitted field is width-fitted and still hides those rows). The suite now fits the field and zooms out with the wheel before tapping a hidden tile — what a player would do.
  - **e2e** (59 checks) was rerun after the balance suite wrote its new winning trace.
- Suites whose check count follows the automated play changed with the zone of control: campaign 128 → 120, e2e 63 → 59, mobile 81 → 79 (fewer turns, different paths). Every other suite has the same count as on v0.9.2.
- Balances: ACT I 30/30 (M06 within the new limit of 18), ACT II M07–M14 30/30 each, ACT III M15–M22 30/30 each (gate ≥ 90% passed).

## Browser suites (new or changed)
| Suite | Checks | Result |
|---|---:|---|
| **act3d-e2e (new):** a real v0.9.2 lower-city save → M21 (seven heroes, the king on the dais, four anchor stones, the objective panel with the pulsing ring, 고정석 깨기 at one blow) → tap an empty tile cancels an aimed Heal and reopens the menu, Heal aims at a foe, the zone-of-control screenshot → the king's request (two ways) and Aren's awakening card → Mission 22 next → M22 (three heralds, readings 0/4, 「아렌의 군령 · 함께 정한다」 on an acted Erik, he acts again) → the unit sheet's 열전 tab → the ACT III choice (three ways with their trust costs), its scene and the ACT III card → no next mission. 1440×900 and 390×844 touch | 44 | PASS |
| **migration-v092 (new):** shipped v0.9.2 HTML saves (village, battle checkpoint) and v0.9.2-source fixtures (the lower city after M20, a mid-M20 battle) → schema 15 with every asset kept; the camp goes on to Mission 21; the legion panel; the M20 battle resumes and Erik shows ④ | 13 | PASS |
| act3c-e2e: after M20 the camp now goes on to Mission 21 | 50 | PASS |
| migration-v02…v091 browser suites: schema 15 after import | as before | PASS |

## Balance (legal player policy, rules API only, no state edits)
| Mission | Result |
|---|---|
| ACT I M01–M06 | 30/30 full clears; M05 4–11 turns; M06 12–17 turns (limit 16 → 18) |
| ACT II M07–M14 | 30/30 each |
| ACT III M15–M20 | 30/30 each (v0.9.2: M15 27/29 — the zone of control and the heal/purify changes moved the runs) |
| M21 마지막 국왕 | 30/30 wins in 5–10 turns; all four stones broken in 30; the king's HP at the end 22–135 of 160; Erik won the duel 21, lost 9; hidden objective 22 |
| M22 잿빛 선택 | 30/30 wins in 6–12 turns; all three heralds standing in 18, one fallen in 12; allied knights came in 30; hidden objective 18 |

- Policy changes: never heal or purify a foe; M05 guards the wagons first; M21 sends the one-blow heroes and Elina to the stones and the rest to whoever nears the king; M22 meets whoever nears a herald and sends Lia (or Sain, Erik) to a fallen herald's dais.
- The balance party took all the returning recruits back at M16, so M22's last chance never came up in the runs; it is covered by tests/mission22.test.mjs.

## Save compatibility
- Unit (tests/migration-v092.test.mjs): real v0.9.2 schema-14 saves made with 78f30f0 (tests/fixtures/v092, scripts in tests/fixtures/v092/make-v092-fixtures.mjs: the lower city after M20 with the superior to trial and the plan sent; a mid-M20 battle) load as schema 15 with completed missions, flags, choices, promotions, trust, roster, feats, departed, economy, heroes, bonds and tactical memory unchanged; the camp continues to M21 (sortie 7, three orders, 「함께 정한다」 closed until Aren awakens); the M20 battle resumes and is won under v0.9.3 rules, starting the hero records.
- Browser (tests/migration-v092.mjs): see the table. All older migration suites still pass.

## Packaging
`python3 scripts/package.py` → `npm test` → `python3 scripts/package.py` → `python3 scripts/verify-release.py`. Results are in docs/v0.9.3/evidence and the SHA256 manifest.

## Performance
Headless medians on this run: 16.7 ms in town and battle at 1440 and 390. Not a physical-device benchmark.

## Not verified
- Physical phones, Safari and Firefox; long-term browser storage eviction; real-PC frame times.
- Human difficulty: how the zone of control feels across ACT I–III for a human player (the policy was re-checked, people play differently); M21's pulse rings and M22's reading pace with human placement; the king, the commander, the heralds and the anchor stone are temporary art until pack F4.
