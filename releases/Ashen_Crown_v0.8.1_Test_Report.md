# Ashen Crown v0.8.1 — Arms (무기) / QA Report
Updated 2026-11-03 KST. The user approved the merge in chat on 2026-11-03 07:56 KST ("병합 진행해 주고", D-077). Hosted CI on PR #17 head 3dfa1f9: run 41470788485, 7/7 on attempt 1. Art pack E has not come back yet; the merge keeps the temporary icons. Started on the user's instruction in chat on 2026-11-02 07:08 KST ("그다음 버전 진행해줘"); design D-073 §6 (Q5/Q6, approved 2026-10-28), implementation details D-076.

Baseline main 7b8b2e80b003140c92b33be91a5a30cdac1c377d (v0.8.0, PR #16). Branch feature/v0.8.1-arms.

HTML SHA256: `338ccb2bb2e491075f612dfd0080b65b99d9ec37f4edf0a8212ebae03c84c773` (27,266,112 bytes). The full validation run below used this build; `verify-release.py` rebuilds it from the Source ZIP and compares the bytes.

## Outcome
ACT I–II (Missions 01–14), promotions, skills, tools and every story scene unchanged, plus D-076:
- **Regional shelves:** tier I gear everywhere; 24 tier II pieces sold only in their own town and opened by that town's missions (Ironhold M07/M08, Velmar M09/M10, the pilgrim village M11/M12), shown locked with what opens them; one premium piece per town from the first visit; six elite pieces at faction trust 2; Velmar's rare-goods shelf (another town's specialty at +25%, turned by each clear, one purchase). Thea, Dario and Ines get their first gear.
- **Revisits:** 「마을 다시 찾기」 in camp (and the menu world map) lists the towns passed; travel is free; shops, forge and townsfolk only; council and story stay in camp; a save during a visit resumes there.
- **Gear stars:** ★1–3 (treasures ★1–5) from strikes, heals and blows, kept on a victory only; 단련 at the forge replaces the +1 upgrade (★2 of a tier I piece equals the old +1); a fourth 보물 slot.
- **Hidden objectives and treasures:** one 숨은 전과 per mission (Lia's hint at the war council, a mark in the mission list); twelve treasures and two Elixirs; a cleared mission's practice wins its objective once.
- **Supply carriers** (one per battle, 보 chip) drop a tool; **cut-ins** for heroes' critical hits and ③ skills (still under 「효과 약하게」).
- **Saves:** schema 11 imports 0–10.
- Art work pack E importer (`scripts/import-item-art.py`, checked on a generated test pack); new gear and treasures use temporary game-drawn icons until the user's art returns.

Fixed during validation (each before the final run):
- M07's hidden objective asked for all three wagons through the gate, but M07 is won as soon as two pass (convoyGoal 2), so it could never be met. It now asks for all three wagons kept and nobody fallen. A new unit test checks that every objective reads flags the game records.
- The forge's 「이 마을 특산」 heading sat in one grid cell and left an empty cell beside it at 1440 px; shelf headings now span the row.
- world-e2e clicked the first `world-map` button, which is now the camp's revisit button under the open menu; the test clicks the one in the menu.
- Browser migration suites compared old saves' gear with the new star records; they now compare through `arms081View` (a +1 is ★2 with the same numbers).

## Executed validation (final build, headless Chromium 141.0.7390.37 / Playwright 1.58.2, offline file URLs + HTTP smoke)
343 unit tests PASS / 0 FAIL (`npm test` after packaging; docs/v0.8.1/evidence/unit-results.txt). New unit files: tests/arms.test.mjs (15), tests/migration-v080.test.mjs (5).

1,712 browser assertions passed across 45 suites, plus the performance suite. No runtime errors were recorded. Summary: docs/v0.8.1/evidence/browser-run-summary.log — 46 suites including the balances, all exit 0.

| Suite | Checks | Result |
|---|---:|---|
| journey-e2e | 176 | PASS |
| hub-doors-e2e (159 doors at three sizes; 12 house clicks) | 171 | PASS |
| renaissance-e2e | 141 | PASS |
| campaign-e2e | 128 | PASS |
| act2-hubs-e2e | 120 | PASS |
| act1-e2e | 113 | PASS |
| frontier-e2e | 104 | PASS |
| gameplay-quality-e2e | 98 | PASS |
| mobile-dock | 81 | PASS |
| e2e | 63 | PASS |
| **arms-e2e (new; 1440 and 390 touch):** Ironhold's forge before and after M07 (locked pieces, premium blade), buying and equipping the Steel Greatsword, 단련 ★1 → ★2 for 80 Gold, the four-slot equipment sheet with stars and a treasure, revisiting Ironhold from the Velmar camp and back (kept across a reload), Velmar's rare-goods shelf, Lia's hidden-objective hint, the supply carrier, Erik's ③ cut-in, M01 won on turn 3 giving the Herb Pouch | 42 | PASS |
| world-e2e | 32 | PASS |
| act2d-campaign-e2e | 30 | PASS |
| class-e2e | 30 | PASS |
| act2-e2e | 28 | PASS |
| tactical-ui | 27 | PASS |
| act2c-campaign-e2e | 26 | PASS |
| tactics-e2e | 26 | PASS |
| act2-campaign-e2e | 24 | PASS |
| mobile-command | 24 | PASS |
| act2b-campaign-e2e | 22 | PASS |
| restart-stage | 22 | PASS |
| audio-mute-e2e | 20 | PASS |
| legion-e2e | 19 | PASS |
| migration-v02 | 16 | PASS |
| **migration-v080 (new):** shipped v0.8.0 HTML saves (village and battle) and v0.8.0-source fixtures (ACT II summit camp with a +1 sword, mid-M14 battle) → schema 11; every asset kept, +1 → ★2, four towns revisitable, the M14 battle resumes with its bag | 14 | PASS |
| migration-v040 · v050 · v060 · v061 · v070 · v071 | 12 each | PASS |
| migration-v031 · v033 | 11 each | PASS |
| migration-v032 | 9 | PASS |
| post-move-attack | 8 | PASS |
| http-smoke | 4 | PASS |
| performance | 4 samples | PASS |

## Balance (legal player policy, rules API only, no state edits)
The policy does not buy gear, equip treasures or aim at hidden objectives. Every balance output of the final build — wins, turns, levels, choices and Gold — is identical to the v0.8.0 evidence (compared field by field, ignoring only the new hidden-objective counts):

| Suite | Result vs v0.8.0 |
|---|---|
| M01 (`test:balance`), M01–M03 (`test:campaign-balance`), economy, promotion trials and drills | identical |
| M05 (`test:m05-balance`) 30/30, M06 (`test:m06-balance`) 29/30 | identical |
| ACT I campaign (`test:act1-balance`) | identical |
| ACT II campaign (`test:act2-balance`, 29 campaigns reach ACT II) | identical |

Hidden objectives the policy met without aiming (of 30 campaigns; ACT II of 29): M01 29, M02 14, M03 27, M04 10, M05 17, M06 0, M07 26, M08 15, M09 2, M10 29, M11 29, M12 19, M13 5, M14 29. M06 (nobody falls), M09 and M13 need deliberate play; human difficulty with bought gear and treasures is for the user's play-test.

## Save compatibility
- Unit tests (tests/migration-v080.test.mjs): v0.8.0 schema-10 saves load as schema 11 with completed missions, economy, flags, choices, promotions, trust and roster unchanged; +1 gear becomes ★2 with the same numbers; the treasure slot is empty; the mid-M14 battle resumes and is won.
- Browser (tests/migration-v080.mjs): saves made by the shipped v0.8.0 HTML restore with their checkpoint and restart; the source fixtures restore; a reload shows v0.8.1.

## Packaging
`python3 scripts/package.py` → `npm test` → `python3 scripts/package.py` → `python3 scripts/verify-release.py`. Results are in docs/v0.8.1/evidence and the SHA256 manifest. Following D-066, the Source ZIP leaves out the built HTML; verify-release rebuilds it from the ZIP and compares the two.

## Performance
Headless medians on this run: 1440 town 33.3 ms, 1440 battle 49.9 ms, 390 town 16.6 ms, 390 battle 16.6 ms. In the same session the shipped v0.8.0 HTML measured 16.7 / 33.3 / 16.6 / 16.6 ms and v0.8.1 measured the same on two reruns, so the 1440 numbers reflect this container (v0.8.0's own report, on another container, had 16.7 ms everywhere), not a change in the game. Not a physical-device benchmark.

## Not verified
- Physical phones, Safari and Firefox.
- Long-term browser storage eviction.
- Real-PC frame times.
- Human difficulty with bought gear, treasures and tempering, and how hard each hidden objective feels (the policy uses none of them).
- The item art: pack E has not come back from the user yet.
