# ACT I balance report (M01→M06, legal policy)

Executed 2026-10-18 16:02 UTC with `node tests/act1-balance.mjs 30 20261014` — 30 seeds, rules API only, no shopping, no state edits.

**Full ACT I clears: 30/30 (100%)**

| Mission | Played | Wins | Win % | Win turns (avg) | Par / Limit | Heroes standing | Avg level in | Gold in → out | Civilians safe (M05: wagons) |
|---|---|---|---|---|---|---|---|---|---|
| M01 잿빛 마을의 습격 | 30 | 30 | 100% | 4–6 (5.0) | 8 / — | 3.8/5.0 | 1.4 | 180.0 → 280.0 | 2.0/2 |
| M02 숲길의 추격 | 30 | 30 | 100% | 3–3 (3.0) | 8 / 8 | 5.0/5.0 | 2.5 | 280.0 → 415.0 | — |
| M03 무너진 다리 | 30 | 30 | 100% | 5–9 (5.9) | 10 / 10 | 4.1/5.0 | 3.1 | 415.0 → 555.0 | 2.0/2 |
| M04 버려진 성채 | 30 | 30 | 100% | 7–13 (9.1) | 9 / 14 | 4.3/5.0 | 4.4 | 555.0 → 755.0 | — |
| M05 국경의 사자 | 30 | 30 | 100% | 7–11 (9.1) | 8 / 10 | 3.0/5.0 | 5.8 | 755.0 → 985.0 | 2.0/2 |
| M06 재의 맹세 | 30 | 30 | 100% | 12–16 (13.9) | 10 / 16 | 4.9/5.0 | 6.8 | 985.0 → 1185.0 | 1.0/4 |

## Losses

- none

## Levels after ACT I (completed runs)

| Hero | Min | Avg | Max |
|---|---|---|---|
| eric | 4 | 4.6 | 5 |
| elina | 6 | 7.2 | 8 |
| lia | 13 | 13.0 | 13 |
| sain | 5 | 5.7 | 9 |
| kai | 8 | 9.3 | 11 |

Final gold (completed runs): 1170–1200, avg 1185.0.
## Reading the numbers (Phase F)

- **Clearability:** every one of the 30 seeds clears all six missions with the legal player policy (rules API only, no purchases). M01–M03 results match the approved re-baseline (`test:balance` 30 wins turns 4–6, `test:campaign-balance` 30 wins, bridge turns 5–9, `test:economy-balance` 90 legal victories).
- **Pacing:** M04 and M05 finish around par; M06 lands at 12–16 of its 16-turn safety limit, so the finale is the longest fight, as intended for the ACT I climax.
- **EXP spread (D-045):** before level-relative EXP, the same 30 seeds ended ACT I with Lia at Lv 19–23 and Erik at Lv 4–5. With the M04–M06 mission levels Lia ends at Lv 13; the other heroes are unchanged within a level. M01–M03 EXP is untouched.
- **Economy:** gold rises 180 → about 1185 by the end of ACT I without shopping; first-clear rewards (100/120/140/160/180/200) and supplemental rewards are paid exactly once per mission.
- **Open for the user's play-test (not tuned without approval):**
  - M06 refugees: the policy brings about 1 of 4 refugees through the gate (never all four). The policy does not screen refugees deliberately, so a human escort should do better; if play-testing agrees it is too harsh, the levers are pursuer bias, refugee speed or the phase-2 trigger.
  - M05 is the costliest fight for the party (about 3 of 5 heroes standing at the end).
  - The policy funnels kills to Lia; human play usually spreads EXP more evenly.

Raw data: `test-output/act1-balance.json` (per seed, per mission).
