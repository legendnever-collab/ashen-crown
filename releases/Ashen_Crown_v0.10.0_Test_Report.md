# Ashen Crown v0.10.0 「연합」 — Test Report
Updated 2026-11-10 KST. **Release candidate on feature/v0.10-act4-design; not merged before the user plays and approves it.** Decision: D-100 (implementation details, PROPOSED) within D-099 (docs/v0.10.0/ACT4_DESIGN.md), built on main d7960ae (v0.9.3 + ACT III art pack F4).

HTML SHA256 of the build under review: `47fcc21d596a9dd37c9cce49dafa25a80a15917d9d586f0e2300fc608e5cf7fa` (47,823,563 bytes; `index.html` identical; also in `releases/Ashen_Crown_v0.10.0_SHA256SUMS`). The full matrix ran on this HTML; only docs changed after it.

## Summary
- **458 unit tests PASS / 0 FAIL** (docs/v0.10.0/evidence/unit-results.txt). New: tests/mission23.test.mjs (6), tests/mission24.test.mjs (6), tests/awaken-v0100.test.mjs (3), tests/migration-v093.test.mjs (4). Updated expectations: schema 16 and version 0.10.0, the gear table (71 pieces, 22 treasures), 30 music tracks, LAST_MISSION 24 with trials 101–116, two more 18×14 maps.
- **Full browser and balance matrix, 58 suites, all passed on the first run** (docs/v0.10.0/evidence/browser-run-summary.log): 2,010 `PASS` lines (1,967 on v0.9.3 + F4). No runtime errors.
- Balances: ACT I 30/30; ACT II M07–M14 30/30 each; ACT III M15–M22 30/30 each; **M23 30/30, M24 30/30** (gate ≥ 90% of the previous mission passed).

## Browser suites (new or changed)
| Suite | Checks | Result |
|---|---:|---|
| **act4a-e2e (new):** a real v0.9.3 lower-city save (ACT III complete) offers Mission 23 → the 「ACT IV · 잿빛 왕관」 world card and the alliance camp → M23 (seven heroes, three council tents, Cassian/Leonora/Lucien as allied units, the objective panel 천막 3/3 · 지도자 3/3) → tap a leader: 「따르라 · 지켜라 · 자유」, 따르라 kept on the unit → after the win, who leads the final campaign (two ways), its scene, Mission 24 next → M24 (eight refugees, the wall and gate, the winch locked, 관문 안 0/8) → the ash tide drawn (재 4줄) → six inside, Erik beside the winch: 「관문 닫기」 → victory with the turn and the two left outside kept, their scene → an awakened recruit's ④ in the unit menu. 1440×900 and 390×844 touch | 30 | PASS |
| **migration-v093 (new):** shipped v0.9.3 HTML saves (village, battle checkpoint) and v0.9.3-source fixtures (the lower city after M22, a mid-M22 battle) → schema 16 with every asset kept; the camp goes on to Mission 23; the M22 battle resumes in the square | 13 | PASS |
| act3d-e2e: after M22 the way now goes on to Mission 23; the ACT III card ends with 「ACT IV · 잿빛 왕관」 | 44 | PASS |
| migration-v02…v092 browser suites: schema 16 after import | as before | PASS |

Screenshots: docs/v0.10.0/screenshots/act4a.

## Balance (legal player policy, rules API only, no state edits)
| Mission | Result |
|---|---|
| ACT I M01–M06 | 30/30 full clears |
| ACT II M07–M14 | 30/30 each |
| ACT III M15–M22 | 30/30 each |
| M23 전쟁의 끝을 향해 | 30/30 wins in 5–6 turns, all by the raid captain's fall; no tent taken in 30; all three leaders standing in 2 (at least one leader fell in 28 — the trust cost applies); hidden objective 2 |
| M24 최후의 국경 | 30/30 wins; the policy shuts the gate on TURN 8–9 with six inside in all 30 (it waits for stragglers until TURN 9); refugees down 0–2 (none in 15); hidden objective (all eight) 0 |

- Policy additions: M23 meets whoever stands beside a tent, then whoever nears a tent or a leader, then the raid captain; M24 meets beasts near the refugees, keeps the gate tiles, the tiles before them and each refugee's next steps clear, avoids ending on ash, and shuts the gate once nobody is outside or on TURN 9.
- Trials (balance run, forced at each campaign's levels): Ines's 115 won 54 of 60 (the six losses at Lv 10, below the Lv 14 requirement; 성역의 문 used in 30); Thea's 116 won 40 of 40 (the policy did not need 철의 돌파; it is covered by tests/awaken-v0100.test.mjs).
- Reading: the leaders fall often under the policy (it does not give allied orders); the policy never brings all eight refugees in. Both are where a human play-test matters.

## Save compatibility
- Unit (tests/migration-v093.test.mjs): real v0.9.3 schema-15 saves made with d7960ae (tests/fixtures/v093, scripts in tests/fixtures/v093/make-v093-fixtures.mjs, seed 20261015: the lower city after M22 with the king promised rest and the truth entrusted to the council; a mid-M22 battle) load as schema 16 with completed missions, flags, choices, promotions, trust, roster, feats, departed, economy, heroes, bonds, tactical memory and hero records unchanged; the camp continues to M23 at the alliance camp (seven heroes, the leaders take orders); the M22 battle resumes and is won under v0.10.0 rules.
- Browser (tests/migration-v093.mjs): see the table. All older migration suites still pass.

## Packaging
`python3 scripts/package.py` → `npm test` → `python3 scripts/package.py` → `python3 scripts/verify-release.py`. Results are in docs/v0.10.0/evidence and the SHA256 manifest.

## Performance
Headless medians on this run: 16.7 ms in town and battle at 1440 and 390. Not a physical-device benchmark.

## Not verified
- Physical phones, Safari and Firefox; long-term browser storage eviction; real-PC frame times.
- Human difficulty: how often players use allied orders and keep the leaders standing; the tent siege pace; the ash tide's bite and the refugees' walk; when people shut the gate. The council tents, the gate winch and leaves, Ines's and Thea's tier 3 looks and the four new icons are temporary art until pack G1.
