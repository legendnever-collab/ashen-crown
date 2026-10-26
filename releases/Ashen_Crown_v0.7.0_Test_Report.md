# Ashen Crown v0.7.0 — The Three Banners / QA Report
Updated 2026-10-27 KST. The user received the v0.7.0 release candidate and approved the merge in chat on 2026-10-27 06:16 KST ("병합하고 다음버전 진행해줘", D-070). Design approved 2026-10-26 23:47 KST (D-068); implementation details D-069. Hosted CI on PR #14 head ef79d05: run 40363637648, attempt 1 had two jobs cancelled by the 30-minute limit while installing the browser, attempt 2 (failed jobs re-run) 6/6 success.

Baseline main dcafb731c15e252bf61d69d24b987f820e0dc989 (v0.6.1). Source checkpoint b24b925 plus the release commit (build description "ACT II Missions 07–12", documentation, evidence and packaging).

HTML SHA256: `328a0965774550d28d9b075f79a4f690b1b2fb53ad8662591cd53c84be704697` (27,108,083 bytes). The validation run below used this build; rebuilding from the release commit produces the same bytes.

## Outcome
ACT I (Missions 01–06), the v0.5.0 promotions and v0.6.x's M07–M10 unchanged, plus the first half of ACT II part 2 (D-068/D-069):
- **M11 성화의 행렬:** a night valley (18×14, level 10). Four pilgrims walk the road to the sanctuary rows from TURN 2: two tiles in light, one in the dark, none with an enemy beside them. Three roadside braziers are lit by search (radius 2). A legion attacker standing in light hits +10; any target outside the light −15 (floor 40). Pilgrims in light heal 5 each player phase. Ines and two Sacred Flame knights escort as allies; raider waves arrive on TURN 3, 5 and 7. Three pilgrims in the sanctuary, or dawn after TURN 12, win; two lost lose. Lucien's offer (the flame oath) is a camp choice.
- **M12 침묵의 수도원:** a monastery (18×14, level 11). Seven quiet guards watch two tiles ahead and the two diagonals ahead, and turn in a fixed order each enemy phase. A sighting raises suspicion (watch 3 tiles); a second sighting, or a strike that does not drop a guard or the abbot, rings the bell. The bell wakes every guard, brings three more from the dormitory, and the abbot burns unsecured records three turns later. A sneak attack from outside the watch gets +5 damage and +30 hit. Securing the ledger and defeating or capturing the abbot wins. The records choice is made in the camp: return / take / copy.
- **Ines:** Sanctuary (adjacent allies take −2) and Sanctuary Oath (−4, and −2 for herself until the next player phase). She joins at Lv 10 after M12 when Sacred Flame trust ≥ 1 or the records were copied.
- **Story and world:** the south region and route on the world map, the pilgrim village and the refugee camp, the Sacred Flame trust row, Sain's past up to her excommunication.
- **Music and art:** two original tracks (Procession of the Sacred Flame, The Silent Monastery). The night and watch overlays are drawn by the game. The pilgrim village uses a temporary dusk-tinted painting until art work pack D (28 images) arrives.
- **Saves:** schema 9 unchanged (imports 0–8). A schema-9 save from an earlier build loads as v0.7.0.

## Executed validation (final build, headless Chromium 141.0.7390.37 / Playwright 1.58.2, offline file URLs + HTTP smoke)
282 unit PASS / 0 FAIL (`npm test`, after packaging; docs/v0.7.0/evidence/unit-results.txt). New unit files are tests/mission11.test.mjs, tests/mission12.test.mjs and tests/migration-v061.test.mjs. tests/presentation.test.mjs adds the v0.7.0 music routing.

1,541 browser assertions passed across 30 suites, plus the performance suite. No runtime errors were recorded. The summary is in docs/v0.7.0/evidence/browser-run-summary.log: 39 suites including the balances, all exit 0.

| Suite | Checks | Result |
|---|---:|---|
| journey-e2e | 176 | PASS |
| hub-doors-e2e (144 doors at three sizes incl. the pilgrim village and the refugee camp; 12 house clicks) | 156 | PASS |
| renaissance-e2e | 141 | PASS |
| campaign-e2e | 128 | PASS |
| act2-hubs-e2e | 120 | PASS |
| act1-e2e | 113 | PASS |
| frontier-e2e | 104 | PASS |
| gameplay-quality-e2e | 98 | PASS |
| mobile-dock | 81 | PASS |
| e2e | 63 | PASS |
| world-e2e | 32 | PASS |
| class-e2e | 30 | PASS |
| act2-e2e | 28 | PASS |
| tactical-ui | 27 | PASS |
| act2c-campaign-e2e (new; 1440 and 390 touch): M10 camp → Sacred Flame card → pilgrim village → M11 → Lucien's offer → M12 → records → Ines card → refugee camp | 26 | PASS |
| act2-campaign-e2e | 24 | PASS |
| mobile-command | 24 | PASS |
| act2b-campaign-e2e (camp now leads on to Mission 11) | 22 | PASS |
| restart-stage | 22 | PASS |
| legion-e2e | 19 | PASS |
| migration-v02 | 16 | PASS |
| migration-v040 | 12 | PASS |
| migration-v050 | 12 | PASS |
| migration-v060 | 12 | PASS |
| migration-v061 (new): shipped v0.6.1 HTML saves + v0.6.1-source fixtures → M11 | 12 | PASS |
| migration-v031 | 11 | PASS |
| migration-v033 | 11 | PASS |
| migration-v032 | 9 | PASS |
| post-move-attack | 8 | PASS |
| http-smoke | 4 | PASS |
| performance | 4 samples | PASS |

The first full run checked 111 doors in hub-doors. The suite was then extended to the two new hubs and run again on the same build (144/144 doors, 12/12 house clicks).

## Balance (legal player policy, rules API only, no state edits)
- These balance suites gave results identical to the v0.6.1 evidence: `test:balance`, `test:campaign-balance`, `test:economy-balance`, `test:m05-balance`, `test:m06-balance`, `test:class-balance`, `test:act1-balance`.
  - M01: 30 wins in 4–6 turns.
  - 30 M01–M03 campaigns; 90 economy victories.
  - M05: 30/30; M06: 30/30.
  - ACT I: 30/30 full clears.
- `test:act2-balance` M01→M12, 30 seeds. The M07 deserters, M08 order, M10 stance and M11 oath choices are rotated; for M12 the copy is taken when open, otherwise return or take.

| Mission | Result |
|---|---|
| M07–M10 | Every per-seed record identical to v0.6.1: 30/30 wins each; Thea joined 21/30, Dario 30/30 |
| M11 | 30/30 wins: 26 in 8–10 turns, 4 at dawn (13). All four pilgrims through in 17/30. All three braziers lit in 30/30 |
| M12 | 30/30 wins in 9–10 turns. Ledger secured before the bell 30/30. Abbot captured 20/30. Copy route 30/30. Ines joined 30/30 |

- The policy plays M12 with knowledge of the next watch direction and never stands in a watched tile. Human players are likely to be seen more often; difficulty is for the user's play-test.

## Save compatibility
- Unit tests (tests/migration-v061.test.mjs): the v0.6.1 Velmar camp loads with completed missions, economy, flags, choices, promotions and trust unchanged. It continues to M11 in the pilgrim village with Thea, Dario and Ines present and the M11 battle is won. The mid-M10 battle under mediation resumes with every unit's position, HP and team unchanged and is won.
- Browser (tests/migration-v061.mjs): saves made by the shipped v0.6.1 HTML (village and Mission 01 battle) restore with their checkpoint, and restart works. The source fixtures reach the pilgrim village, and a reload shows v0.7.0.

## Packaging
`python3 scripts/package.py` → `npm test` → `python3 scripts/package.py` → `python3 scripts/verify-release.py`. Results are in docs/v0.7.0/evidence and the SHA256 manifest. Following D-066, the Source ZIP leaves out the built HTML; verify-release rebuilds it from the ZIP and compares the two.

## Not verified
- Physical phones, Safari and Firefox.
- Long-term browser storage eviction.
- Real-PC frame times (performance numbers are headless).
