# Ashen Crown v0.10.2 「잿빛 밤」 — Test Report
Updated 2026-11-16 KST. **Release candidate on feature/v0.10.2-ashen-night; not merged before the user plays and approves it.** Decision: D-110 (implementation details, PROPOSED) within D-099 (docs/v0.10.0/ACT4_DESIGN.md §3, §4.2, §7, §10), built on main 6adba79 (v0.10.1 merged, D-109).

HTML SHA256 of the build under review: `e916f6cd57d145340fd49472e53ad7ffba135df242126f9e5327b4581a164874` (`index.html` identical; also in `releases/Ashen_Crown_v0.10.2_SHA256SUMS`). **The full 62-suite matrix ran on this HTML** (2026-11-16); a rebuild after it gave the same hash. Only docs changed after the run.

## Summary
- **495 unit tests PASS / 0 FAIL** (docs/v0.10.2/evidence/unit-results.txt). New: tests/mission27.test.mjs (5), tests/mission28.test.mjs (5), tests/migration-v0101.test.mjs (4).
- **Full browser and balance matrix, 62 suites** (docs/v0.10.2/evidence/browser-run-summary.log): 61 passed on the first run. **e2e failed once** — it reads test-output/winning-trace.json, which the balance suite (run right after it) writes, and this container was new, so the file did not exist yet. With the file written, e2e passed on rerun (59 checks). 2,100 `PASS` lines in all. No runtime errors.
- Balances: ACT I 30/30; ACT II M07–M14 30/30 each; ACT III M15–M22 30/30 each; ACT IV M23–M26 30/30 each, **M27 30/30, M28 30/30** (gate ≥ 90% of the previous mission passed).
- During development, act4c's "gate's third blow" check stopped at the end-phase confirmation prompt; the test now presses 확인 after 턴 종료, as a player does.

## Browser suites (new or changed)
| Suite | Checks | Result |
|---|---:|---|
| **act4c-e2e (new):** a real v0.10.1 oath camp save (after M26, nine heroes) offers Mission 27 → the 「왕도의 성문」 world card and the lower city → sortie of eight of nine → M27 (the ram on the road, the gate's two leaves, three ladders, squads by trust) → the objective panel counts the gate's blows and the wall's sections → the gate's third blow with two sections held wins → M28 (ten remnants, three fragments, young Aren as an ally) → the objective panel counts the fragments → young Aren takes orders → beside a fragment the menu offers 기억 보기, and Aren's last order for the fallen Kai → 「끝까지 함께」 given (once a battle) → the oath fragment opens its scene and counts 1/3 → after M28 Aren asks to whom he should confess; the choice is kept and its scene plays → Erik's 열전 tells M27 and M28; no page errors. 1440 and 390 | 32 | PASS |
| **migration-v0101 (new):** shipped v0.10.1 HTML saves and v0.10.1-source fixtures (the oath camp after M26, a mid-M26 battle) → schema 18 with every asset kept and the roster intact; the camp goes on to Mission 27; the battle resumes; restart works; no runtime errors | 13 | PASS |
| migration-v02…v0100 browser suites: schema 18 after import | as before | PASS |

Screenshots: docs/v0.10.2/screenshots/act4c (the royal-gate card, the lower city, the M27 field and win, the M28 field and a memory scene, the confession, Erik's 열전; 1440 and 390). Checked by eye: the ram, the three ladders and the gate on the M27 field; the remnants drawn grey, the fragments (glowing / read) and young Aren in sepia on M28.

## Balance (legal player policy, rules API only, no state edits)
| Mission | Result |
|---|---|
| ACT I M01–M06 | 30/30 full clears |
| ACT II M07–M14 | 30/30 each |
| ACT III M15–M22 | 30/30 each |
| M23–M26 | 30/30 each (as in v0.10.1) |
| **M27 왕도의 성문** | **30/30 wins** in 8 turns (25), 9 (4) or 10 (1); the gate broke on the same turn. All three sections taken in 26, two in 4. The ram ended with 144–170 of 170 HP (above half in all 30). Squads: two banners in 25, three in 5; Baldrick's lion rode along in 6 (the six 「협력」 campaigns). Hidden objective 「성문 파쇄추의 쇠머리」 26/30 |
| **M28 잿빛 밤의 진실** | **30/30 wins** in 6 turns (4), 7 (18), 8 (1), 9 (1) or 10 (6); the third fragment read on TURN 4–8. Young Aren stood in all 30. Hidden objective 「잿빛 밤의 목걸이」 (young Aren standing, won by TURN 8) 23/30 |

- Policy additions (tests/campaign-policy.mjs): M27 keeps a hero beside the ram on the road and sends heroes to the open section tiles (a bonus for standing on one); M28 goes fragment to fragment; Baldrick joins the hero loop when he is in the legion. The balance chain chooses a confession after M28.
- Reading: under the policy the ram is never at risk and the hidden objectives are common. How hard the grey cloaks press the ram for a human player, and whether two enemy phases after the third fragment feel right, is for the play-test.

## Save compatibility
- Unit (tests/migration-v0101.test.mjs): real v0.10.1 schema-17 saves made with 6adba79 (tests/fixtures/v0101, script tests/fixtures/v0101/make-v0101-fixtures.mjs) → schema 18, then into Mission 27.
- Browser (tests/migration-v0101.mjs): see the table. All older migration suites still pass.

## Art
- New things drawn by the game for now: the ram, the ladders, the memory fragments (glowing / read), and the icons for 「끝까지 함께」 and the two treasures. Young Aren (sepia) and the remnants (grey) recolour existing art (Q8, D-094).
- Art pack G3 work order (2 images): scripts/make-act4-g3-art-pack.py → docs/v0.10.2/art/act4-g3-work-pack; import paths are ready (scripts/import-interior-art.py PROPS['props_act4c'], scripts/import-item-art.py --cells).

## Packaging
`python3 scripts/package.py` → `npm test` → `python3 scripts/package.py` → `python3 scripts/verify-release.py`. Results are in docs/v0.10.2/evidence and the SHA256 manifest.
