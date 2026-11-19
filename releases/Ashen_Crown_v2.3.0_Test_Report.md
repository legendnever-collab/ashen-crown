# Ashen Crown v2.3.0 「ACT II 큰 맵 (1부)」 — Test Report
Updated 2026-11-20 KST. **Release candidate on feature/v2.3.0-act2 — not merged before the user plays and approves it.**
- Decisions: D-128 (design), D-129 (approval 2026-11-20 06:21 「개발 진행해줘」 with the recommended answers, and this implementation). Notes: docs/v2.3.0/RELEASE_NOTES.md.
- HTML SHA256: see `releases/Ashen_Crown_v2.3.0_SHA256SUMS` (`index.html` is identical). Build 8f2e259a…, 46.5 MiB (budget: warn 80, fail 90).

## What changed
- **ACT II M07–M10 on big maps** (src/data/missions-v230.js, applied after the v2.0 ACT I maps):

  | Mission | Size | Enemies (start + waves) | TURN limit |
  |---|---|---|---|
  | M07 convoy east | 30×14 | 16 + 6 | 20 (was 14) |
  | M08 two fronts | 22×20 | 12 + 14 | 10 |
  | M09 street fight from the SW docks | 26×20 | 15 + 8 | 12 |
  | M10 march east, three sides | 30×18 | 24 + 8 | 14 |

  - Objectives, special rules, story, dialogue, choices and duels are unchanged.
- **M07 convoy:** the wagons follow the road network to the gate tiles (mission-rules-v06 convoyDistance). They may take one sideways step to a lane at the same distance.
- **M09:** with the first layout the test player lost two delegates in all 19 runs. The delegates now stand along the legion's way up from the docks, and two rooftop assassins start farther off.
- **어려움 re-measured** (act1-balance and act2-balance with ASHEN_DIFFICULTY=hard):
  - **Fixed a save bug.** On 어려움, the M06 stage-start record with the inspector's wave (records reported) was refused, because the start wave's extra soldier was not counted. This bug dates from v2.0.0.
  - **ACT II** now gets the full +1 level and ×1.1 stats.
  - **M15, M17 and M18** keep 보통's numbers on 어려움 (core/stats8.js HARD_SHARE). These three had become walls.
- **Saves:** schema 22 (imports 0–21). M07–M10 battle, result and deployment saves reopen in camp; camp positions on new walls are moved.
- **Archive script:** on a 403 it tags the default branch instead, and it continues past failures.

## Results on this build (8f2e259a…, confirmed by a rebuild after the run)
- **Unit tests: 548 PASS / 1 FAIL / 16 skipped before packaging** (docs/v2.3.0/evidence/unit-results.txt).
  - The one failure is the documentation link check: README links to releases/Ashen_Crown_v2.3.0.html, which only packaging creates. After packaging: **549 PASS / 0 FAIL / 16 skipped**, and scripts/verify-release.py passes (manifests, ZIP, byte-identical rebuild, unit tests).
  - New tests:
    - tests/difficulty-hard.test.mjs: every story mission starts, saves and loads on 어려움; M06 with the inspector's wave; the push by mission. It fails on the v2.2.1 save-manager.
    - renaissance: on M07–M10 every unit starts on its own passable tile.
- **Full browser and balance matrix, 66 suites + the new v230 suite: every suite's final exit is 0** (docs/v2.3.0/evidence/browser-run-summary.log; 2,346 `PASS` lines).
  - Two suites failed in the parallel run, and each passed when rerun alone on the same build:
    - **quality:** a click timed out under the story overlay (98 checks on the rerun).
    - **act2d-campaign:** its M10 capture setup put Erik on a wall of the new map. The test now picks a free passable tile. 30 checks on the rerun.
  - Earlier in development, these were fixed:
    - 27 suites checked for schema 21 by name;
    - an M09 assassin was placed on an occupied tile.
- **v230 suite (23 checks):** M07–M10 restore into battle at 1440 and 390 on 30×14, 22×20, 26×20 and 30×18 with the minimap. The 어려움 M06 battle with the extra soldier opens and backs up again. Screenshots: docs/v2.3.0/screenshots/m07–m10-big-map.png.

## Balance (test player, campaign policy)

**보통, ACT I** (act1-balance, 30 campaigns; the band gate passes):

| | M01 | M02 | M03 | M04 | M05 | M06 |
|---|---:|---:|---:|---:|---:|---:|
| Win rate | 100% | 100% | 77% | 91% | 100% | 95% |

**보통, first try** (act2-balance; the gate is a Wilson upper bound ≥ 0.6 for every mission):

| Run | M07 | M08 | M09 | M10 | M11 | M12 | M13 | M14 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 30 seeds | 26/30 | 29/29 | 29/29 | 29/29 | 29/29 | 27/29 | 28/28 | 28/28 |
| 20 seeds (matrix) | 17/20 | 19/19 | 19/19 | 19/19 | 19/19 | 18/19 | 18/18 | 18/18 |

- Every mission M01–M30 passes the gate. The lowest is M15 (16/28 and 12/18).

**어려움, ACT I** (act1-balance, 30 campaigns):

| | M01 | M02 | M03 | M04 | M05 | M06 |
|---|---:|---:|---:|---:|---:|---:|
| Win rate | 100% | 100% | 73% | 77% | 100% | 88% |

**어려움, first try** (act2-balance, 30 seeds):

| | M07 | M08 | M09 | M10 | M11 | M12 | M13 | M14 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| First try | 19/23 | 23/23 | 23/23 | 23/23 | 23/23 | 22/23 | 23/23 | 22/23 |

- **Beyond the scope (ACT III):** M15 15/23, M16 16/19, M17 12/19, M18 17/19.
  - Before HARD_SHARE: M15 1/23, M17 5/19, M18 0/9.
- **Open:** on 어려움, M19–M22 stay low (6/18, 6/13, 3/12, 1/4). They are left for a later pass.
- Evidence: docs/v2.3.0/evidence/act1-balance-*.log and act2-balance-*.log.

## Not done in this version
- **The archived builds stay in the tree.** Only 11 of the 28 ARCHIVE.json versions have a Release. The user's 2026-11-19 run stopped at v0.3.2 with a 403.
  - After the merge, the user reruns Actions → Archive old builds.
  - The next version removes the files once all 28 exist.
- **v2.3.1:** M11–M14, 서리목 and 소금항, 군나르 and art pack J.
- **Not tested here:** native phones, Safari/WebKit and Firefox.
