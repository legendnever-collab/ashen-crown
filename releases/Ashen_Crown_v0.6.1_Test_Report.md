# Ashen Crown v0.6.1 — The Three Banners / QA Report
Updated 2026-10-26 KST. The user received the v0.6.1 release candidate and approved the merge in chat on 2026-10-26 20:22 KST ("좋아 병합해줘"). The PR number, hosted CI run and merge SHA are recorded in docs/v0.6.1/RELEASE_NOTES.md after the merge and on GitHub.

Baseline main 28bce957324a1ad82faeae531f11fcac175c5b84 (v0.6.0, tag v0.6.0). Branch feature/v0.6.1-free-city; source checkpoint 559aabdc9880238115db1977050ce81b2f4d8daf (release candidate) plus the release commit (build description "ACT II Missions 07–10", documentation, evidence, packaging).

HTML SHA256: `fff94cf9e32dfe282833838758a8fd7307c1643215637a3e3532729dcec5f4cc` (27,035,088 bytes; built from source before the validation run and unchanged by packaging).

## Outcome
ACT I (Missions 01–06), the v0.5.0 promotions and v0.6.0's M07–M08 unchanged, plus the rest of ACT II's first half (D-067):
- **M09 자유의 도시:** Velmar's market district (18×14, level 9) with rooftops and alleys; three delegates brought into the council hall by the rescue action; assassins hunt them over the roofs; the assassin leader arrives on TURN 5 and can be captured (the ledger-cord scene); Dario and two harbour guards as allies.
- **M10 두 영주의 전쟁:** two lords' armies (factions) fight each other around the mill village (18×16, level 10); stance chosen on the deployment screen — support Oswin, support Brennan, or mediate (capture both; a captured lord's army stands down; both = truce). Walled camps with two bodyguards per lord.
- **Recruits and trust:** Free Lords trust from M09 (every delegate safe +1) and M10 (side +1, truce +2); Dario joins at Lv 9 when trust ≥ 1 or the truce held; Riposte (+2 strike, counters +4 / +8 after the skill).
- **Story and world:** Free Lords world card and west map focus, Velmar staged scenes and hub talk for M09–M10, roster-conditional hub NPCs (Thea in Velmar only when she joined).
- **Music and art:** three original tracks (Banners in the Snow, Lanterns over Velmar, Two Banners, One Field); Velmar battle ground with roof tiles and cobbles.
- **v0.6.0 wrap-up:** tag v0.6.0 and GitHub Release published; War Council titles for ACT II; D-066 Source ZIP without the built HTML.
- **Saves:** schema 9 unchanged (imports 0–8); a schema-9 save from an earlier build loads as v0.6.1.

## Executed validation (final build, headless Chromium 141.0.7390.37 / Playwright 1.58.2, offline file URLs + HTTP smoke)
257 unit PASS / 0 FAIL (`npm test`, after packaging; docs/v0.6.1/evidence/unit-results.txt). New unit files: tests/mission09.test.mjs, tests/mission10.test.mjs, tests/migration-v060.test.mjs; tests/presentation.test.mjs adds the ACT II music routing.

1,470 browser assertions PASS across 28 suites, plus the performance suite; no runtime errors were recorded. Summary: docs/v0.6.1/evidence/browser-run-summary.log (37 suites including balances, all exit 0).

| Suite | Checks | Result |
|---|---:|---|
| journey-e2e | 176 | PASS |
| renaissance-e2e | 141 | PASS |
| campaign-e2e | 128 | PASS |
| hub-doors-e2e (111 doors at three sizes, 12 house clicks) | 123 | PASS |
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
| act2-campaign-e2e (M06 → castle town → M07 → M08 → Thea; 1440 / 390) | 24 | PASS |
| mobile-command | 24 | PASS |
| act2b-campaign-e2e (new: M08 camp → Free Lords card → Velmar → M09 → ledger scene → M10 stance → battle → Dario; 1440 / 390) | 22 | PASS |
| restart-stage | 22 | PASS |
| legion-e2e | 19 | PASS |
| migration-v02 | 16 | PASS |
| migration-v040 | 12 | PASS |
| migration-v050 | 12 | PASS |
| migration-v060 (new: shipped v0.6.0 HTML saves + v0.6.0-source fixtures) | 12 | PASS |
| migration-v031 | 11 | PASS |
| migration-v033 | 11 | PASS |
| migration-v032 | 9 | PASS |
| post-move-attack | 8 | PASS |
| http-smoke | 4 | PASS |
| performance | 4 samples | PASS |

During the release-candidate run a startup crash on page reload was found (a table in app.js read by the first render before its `const` was initialised; reload-heavy suites failed). It was fixed (function declarations) and the whole matrix was run again from the start; the numbers here come from the final build.

## Balance (legal player policy, rules API only, no state edits)
- `test:balance`, `test:campaign-balance`, `test:economy-balance`, `test:m05-balance`, `test:m06-balance`, `test:class-balance`: unchanged results (M01 30 wins in 4–6 turns; 30 M01–M03 campaigns; 90 economy victories; M05 30/30; M06 30/30; every trial 30/30, drills 110/110).
- `test:act1-balance` M01→M06: 30/30 full ACT I clears; table and runs identical to the v0.6.0 evidence.
- `test:act2-balance` M01→M10, 30 seeds (M07 deserters, M08 order and M10 stance rotated):

| Mission | Wins | Turns | Notes |
|---|---|---|---|
| M07 | 30/30 | 7–8 | captain captured 29 |
| M08 | 30/30 | 7–9 | Thea joined 21/30 |
| M09 | 30/30 | 7–8 | all delegates safe 30, leader captured 10 |
| M10 support Oswin | 10/10 | 5–8 | |
| M10 support Brennan | 10/10 | 5–7 | |
| M10 mediate | 10/10 | 7 | truce 10/10 |

  Villagers all rescued in 30; Dario joined in 30/30. The policy never fails a mediation it chooses and always keeps the delegates; difficulty is left to the user's play.

## Save compatibility
- **Shipped v0.6.0 HTML:** a village save and a Mission 01 battle checkpoint made live in the shipped v0.6.0 page and imported through the visible backup UI; a restart of the migrated battle works.
- **v0.6.0-source fixtures** (`tests/fixtures/v060`, generator included, from a worktree of tag v0.6.0): the canyon-bivouac camp after M08 (Thea joined) opens with every asset kept, offers Mission 9 and reaches Velmar with Thea in the town and in the sortie of six; the mid-M08 battle resumes unchanged and is won under v0.6.1 rules (unit test).
- **Older saves:** v0.2–v0.5.0 migrations still pass.

## Art integrity
No new painted assets in v0.6.1. `tests/presentation.test.mjs` and `tests/rooms.test.mjs` still hash every shipped painting against its import log. The Velmar roof tiles and cobbles are procedural pixel art drawn by the game.

## Performance
Frame time in headless Chromium with software rendering: 1440×900 town median 16.7 ms (p95 33.4), battle median 16.7 ms (p95 33.3); 390×844 town and battle median 16.7 ms (p95 16.8). Not a physical-device benchmark.

## Packaging / documentation
- `npm run build` regenerates the standalone HTML and index.html byte-identically.
- D-066: the Source ZIP (about 54 MB, was 90 MB in v0.6.0) holds source, docs and evidence but not the built HTML; `python scripts/verify-release.py` checks the hash manifests, that the ZIP covers the exact current tree, a clean rebuild from the extracted ZIP that equals both shipped HTML files, and the unit tests.

Evidence: docs/v0.6.1/evidence. Screenshots: docs/v0.6.1/screenshots (not in the ZIP). Decisions D-055–D-067: docs/decisions/DECISION_LOG.md. Maps, numbers, dialogue and new names are PROPOSED; the royal command, the crown's rules and Bellard's role stay OPEN.

## Limits / next
- Not verified: physical hardware beyond the user's own play, Safari/Firefox, long-term browser storage eviction.
- Next: v0.7.0 ACT II part 2 (M11–M14) and awakening (Tier 3), only on the user's instruction.
- The HTML is about 27 MB because of the embedded paintings.
