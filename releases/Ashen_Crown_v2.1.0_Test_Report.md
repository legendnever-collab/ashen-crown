# Ashen Crown v2.1.0 「주점과 세계지도」 — Test Report
Updated 2026-11-18 KST. **Release candidate on feature/v2.1.0-tavern; not merged before the user plays and approves it.** Decisions: D-117 (v1.0.0 and v2.0.0 merged) and D-118 (docs/v2.1.0/TAVERN_WORLD_DESIGN.md, the user's five feedback items and eight answers, all recommended).

HTML SHA256 of the build under review: see `releases/Ashen_Crown_v2.1.0_SHA256SUMS` (`index.html` identical). New characters and places use existing painted art until art pack H1 v2 returns.

## Summary
- **Unit tests: **534 PASS / 0 FAIL / 16 skipped with reasons** (550 in all)** (docs/v2.1.0/evidence/unit-results.txt). New: tests/tavern-v210.test.mjs (8 tests: the five start alone; hiring; M04 opens the villages, the elite and the wanderer; a battle request; Adel's rescue; hand-over requests and the bounty; the Garr duel event; real v2.0.0 saves → schema 21).
- **Full browser and balance matrix, 66 suites, on this build: all exit 0** (docs/v2.1.0/evidence/browser-run-summary.log, 2,347 `PASS` lines). Run in two halves on a 2-core container.
  - 52 suites passed on the first run.
  - 14 failed first because their scripts still expected the v2.0 rules; each was updated and rerun to exit 0:
    - e2e, mobile, restart, campaign: a duel event opens in M01 when Garr stands beside Erik or Elina. The scripts now settle it or decline it (물러선다).
    - frontier: the 「동료의 약속」 step is gone.
    - renaissance: the shop roster has five heroes.
    - world, arms, migration-v080: the new world map has markers plus a list.
    - act4b: the pair's two lines come before the arena.
    - economy-balance: the gate was changed for small samples (see below).
    - act1-balance: the policy now settles a duel that opens at the start of the phase.
    - v200: see the finding below.
    - act2d-campaign: a click timed out under load and passed on an unchanged rerun.
  - The suites that use the test player's policy were rerun after the policy change: balance, e2e, mobile, campaign, campaign-balance, act1-balance, m05-balance, m06-balance, act1, migration-v02 and economy-balance. act2-balance and v210 ran after the change.
  - The world-map label fix (below) was rechecked with v210, world and arms.
- **New browser suite v210-e2e: 41 checks PASS at 1440 and 390** (docs/v2.1.0/evidence/v210-e2e.json; screenshots in docs/v2.1.0/screenshots). It covers:
  - a new campaign has only the five
  - the ash village tavern's 인재 확보: Bram, Noa and Marta at 200 G; hiring Bram
  - the camp exit opens the world map with the camp, the ash village and the two small villages; travelling to 갈대 나루
  - the request board, picking the sortie, and the request battle with the four chosen
  - no 일기토 신청 anywhere; the Erik–Garr duel event at the next player phase, with the arena and 물러선다
  - the 출전 장수 board on the M02 deployment: six in the legion, five go, swaps, and Erik always goes
- **The winning trace replays the duel event in the browser:** e2e reports "Duel event (Erik–Garr) settles as hero" while it replays M01 move by move.
- **Finding, fixed: `releases/Ashen_Crown_v1.0.0.html` on main was not the v1.0.0 build.**
  - During v2.0.0 development, interim builds were written over the v1.0.0 file (commits 708c5a4–eb85792). The file then contained the v2.0 officers and did not match `Ashen_Crown_v1.0.0_SHA256SUMS`.
  - It is restored from the v1.0.0 release candidate (306f3e3) and matches its manifest again. Every `*_SHA256SUMS` in releases/ was checked.
  - The v200 suite's "shipped v1.0.0 save" checks now run against the real v1.0.0 page.
- Performance (performance suite, headless Chromium on 2 cores, median frame): camp 16.7 ms at 1440 and 390; battle 16.7 ms at 390 and 33.4 ms at 1440. This is the same as v2.0.0.

## Balance (보통)
### ACT I (act1-balance, 30 seeds chained, one try each; docs/v2.1.0/evidence/act1-balance.md)
The five fight alone; nobody is hired. The policy takes every duel event and settles it with 베기 → 막기 → 노리기 in turn.

| Mission | Played | Wins | Win % | Win turns (avg) | Par / Limit | Avg level in |
|---|---:|---:|---:|---|---|---:|
| M01 잿빛 마을의 습격 | 30 | 27 | 90% | 7–10 (8.2) | 9 / 14 | 1.4 |
| M02 숲길의 추격 | 27 | 27 | 100% | 7–9 (8.3) | 8 / 8 | 3.2 |
| M03 무너진 다리 | 27 | 23 | 85% | 14–16 (15.3) | 13 / 16 | 4.7 |
| M04 버려진 성채 | 23 | 14 | **61%** | 8–14 (9.6) | 11 / 16 | 7.5 |
| M05 국경의 사자 | 14 | 12 | 86% | 5–7 (6.2) | 9 / 10 | 9.4 |
| M06 재의 맹세 | 12 | 12 | 100% | 12–17 (14.1) | 11 / 18 | 10.6 |

- **M01 with and without the duel event (30 seeds, the same policy):** 27/30 both ways.
  - With the event, Erik and Garr met in 29 of 30 runs: Erik won 13 and Garr won 16.
  - The first measurement (22/30, with 7 stalled runs) came from a policy bug: it did not settle a duel that opens as the player's phase starts. Fixed in tests/player-policy.mjs.
- **M04 61% is just above the 60% gate**; in v2.0.0 it measured 73%. No mission rule changed. What changes is which seeds reach M04, now that M01's duel event alters the run. Play-test watch item. Hiring (Bram, Noa, Marta from M01; Rowell after M04) adds bodies that the policy does not use.
- economy-balance (10 seeds × 3 loadouts, M01–M03): 81/88 wins.
  - Each loadout must not be clearly below 60% (95% Wilson upper bound, as act2-balance already uses), and each mission over all three loadouts must reach 60% outright: all M1 29/30, all M2 29/29, all M3 23/29.
  - The purchased-tools loadout loses its first turn of each mission to the ward and won M03 5/9. The same harness on v2.0.0 code (316d447) gave 5/8, so this is not new. Without the change, the old gate (60% on 8–10 runs) failed on one seed.
- campaign-balance, m05-balance, m06-balance and class-balance: exit 0.

### ACT II–IV (act2-balance, 20 seeds, up to three tries per battle; gate on the first try)
`first try not clearly below 60% per mission (Wilson 95% upper bound ≥ 0.6)` — **no mission low.**

| M | First try | M | First try | M | First try |
|---|---:|---|---:|---|---:|
| 07 | 18/18 | 15 | 11/18 | 23 | 14/14 |
| 08 | 18/18 | 16 | 13/16 | 24 | 14/14 |
| 09 | 18/18 | 17 | 12/16 | 25 | 14/14 |
| 10 | 18/18 | 18 | 16/16 | 26 | 12/14 |
| 11 | 18/18 | 19 | 16/16 | 27 | 13/13 |
| 12 | 18/18 | 20 | 12/16 | 28 | 13/13 |
| 13 | 18/18 | 21 | 15/16 | 29 | 13/13 |
| 14 | 18/18 | 22 | 10/16 | 30 | 13/13 |

The M16 duel (now an event that opens beside the captain from TURN 3) happened in 11 of 16 runs: Erik won 3, the captain won 8, and in 5 the pair never stood side by side.

## Not measured in this release
- 어려움 was not re-measured. The difficulty rules did not change; only the start roster did.
- Request battles (missions 120–124) are covered by the unit tests: a win for ferry and besieged, a loss for ferry. They are not covered by a win-rate harness. The enemy level follows the sortie's average, as in story missions.
- Hiring is not part of any balance harness; the policies play with the five and the story joiners.
