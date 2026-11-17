# Ashen Crown v1.0.0 「왕관 없는 새벽」 — Test Report
Updated 2026-11-17 KST. **Release candidate on feature/v1.0.0-crown; not merged before the user plays and approves it.** Decision: D-113 (implementation details, PROPOSED) within D-099 (docs/v0.10.0/ACT4_DESIGN.md §3 Q2, §4.2, §6, §8, §10–§13), built on main 3984064 (v0.10.2 merged, D-112).

HTML SHA256 of the build under review: `ab569b3cd8979a1868cba6e8eb4570a929c00a404308a994f0c5817114c6ee3b` (`index.html` identical; also in `releases/Ashen_Crown_v1.0.0_SHA256SUMS`). Art pack G4 has not returned yet: the three ending illustrations, the epilogue background and icon sheet O are game-drawn stand-ins.

## Summary
- **510 unit tests PASS / 0 FAIL** (docs/v1.0.0/evidence/unit-results.txt). New: tests/mission29.test.mjs (5), tests/mission30.test.mjs (5), tests/migration-v0102.test.mjs (4); the ending rules are covered in mission30.test.mjs.
- **Full browser and balance matrix, 64 suites** (docs/v1.0.0/evidence/browser-run-summary.log): **all exit 0 on the first pass**. The balance suite now runs first so e2e finds test-output/winning-trace.json in a fresh container (the cause of v0.10.2's single e2e rerun). 2,186 `PASS` lines in all. No runtime errors.
- Balances (30 seeds, chained M01→M30): ACT I M01–M06 30/30 each; ACT II M07–M14 30/30 each; ACT III M15–M22 30/30 each; ACT IV M23–M28 30/30 each, **M29 30/30, M30 30/30** (the ≥ 90% gate passed).
- Performance: median frame 16.7 ms at 1440 and 390, town and battle.

## New browser suites
| Suite | Checks | Result |
|---|---:|---|
| **act4d-e2e:** a real v0.10.2 lower-city save (after M28, nine heroes) offers Mission 29 → sortie of eight of nine → M29 with the rite points where the council path puts them → the objective panel counts the rite points and Bellard's phase → TURN 2 duel left to Aren's last words → Bellard rises crowned (weaker after the words) → his second fall with the rites standing wins; the king rests → Bellard's fate offers trial, exile and his own offer; the offer is kept and its scene plays → M30 with the heart stone and all three banners → the dawn after TURN 8 wins → the ending choice (2 open) → ending A's scene → the epilogue → the ending card → the camp stays open with the epilogue to see again; no page errors. 1440 and 390 | 38 | PASS |
| **migration-v0102:** shipped v0.10.2 village, battle and lower-city (after M28) saves open as schema 19 with everything kept, continue to Mission 29, the M28 battle resumes; no runtime errors | 13 | PASS |

Screenshots: docs/v1.0.0/screenshots/act4d (M29 field, duel, crowned Bellard, fate, M30 field, ending choice, epilogue, ending card, camp after; 1440 and 390).

## Balance details (docs/v1.0.0/evidence/act4-balance.json)
| | Result |
|---|---|
| M29 wins | 30/30, turns 5–8 |
| M29 rite points standing at victory | 3 in 16 seeds, 2 in 14 (hidden objective 16/30) |
| M29 path (from M22) | king 10, council 10, oath 10 — each path won every seed |
| M29 duel | Erik won 10, Bellard won 5, left to Aren's words 15 |
| Bellard's fate (policy) | exile 15, his offer 15, trial 0 |
| M30 wins | 30/30, all at the end of TURN 8 |
| M30 heart stone HP at victory | 240/240 in every seed — **the policy never let it be struck; M30 is likely too easy (play-test watch item)** |
| M30 heroes down | 0–2 (hidden objective 6/30) |
| Endings chosen (policy) | A 5, B 15, C 10 |

## All suites (exit code and `PASS` lines)
| Suite | PASS lines | Exit |
|---|---:|---:|
| act1-balance | 0 | 0 |
| act1 | 114 | 0 |
| act2-balance | 0 | 0 |
| act2-campaign | 24 | 0 |
| act2-hubs | 315 | 0 |
| act2 | 28 | 0 |
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
| campaign-balance | 0 | 0 |
| campaign | 121 | 0 |
| class-balance | 0 | 0 |
| class | 31 | 0 |
| e2e | 60 | 0 |
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
| mobile-command | 25 | 0 |
| mobile | 80 | 0 |
| performance | 0 | 0 |
| post-move | 1 | 0 |
| quality | 99 | 0 |
| renaissance | 142 | 0 |
| restart | 23 | 0 |
| tactical | 28 | 0 |
| tactics | 26 | 0 |
| world | 33 | 0 |

## Not tested
- Real-device touch play (only Chromium emulation at 390×844 and 1440×900).
- The G4 art (not returned yet).
