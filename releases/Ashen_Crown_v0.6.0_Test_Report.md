# Ashen Crown v0.6.0 — The Three Banners / QA Report
Updated 2026-10-26 KST. The user played the v0.6.0 Phase D build and approved the merge in chat on 2026-10-26 05:56 KST after one fix ("한가지 minor tuning 후 병합하자. 마을에서 보면 맨 아래있는 집들은 길이 없어서 못들어가는 경우가 생겨. 이 부분만 수정해줘"). The fix is in this build (D-065). The PR number, hosted CI run and merge SHA are recorded in docs/v0.6.0/RELEASE_NOTES.md after the merge and on GitHub.

Baseline main 33577c4ee39279e7c38795ae15610bac63c8605d (v0.5.0, tag v0.5.0). Branch feature/v0.6-act2-three-banners; source checkpoint 1017b81e3c5fc254548e36fcbbba54c008f93df3 (Phase D) plus the release commit (town-door fix, build title/description, v0.5.0 migration suites, CI groups, documentation, evidence).

HTML SHA256: `51a958eedd2c75ff33ba7312fb304a5e4b106c86c1e11af81aebcd8b48ee75fc` (26,974,991 bytes; built from source before the validation run and unchanged by packaging).

## Outcome
ACT I (Missions 01–06) and the v0.5.0 promotions unchanged, plus the start of ACT II 「세 개의 깃발」:
- **Story** (D-064): after the Ashen Oath the M06 camp offers Mission 7; the world map shows the ACT II card and the legion reaches the castle town below Ironhold (M07–M08 preparation), then the canyon bivouac after M08.
- **M07 북부의 군령:** 18×14 snowy road, sortie of six, level 8; three supply wagons, Thea and two Iron Crown soldiers as allied escort, ambushes on TURN 3 and 5, the deserter captain can be captured; camp choice on the deserters.
- **M08 협곡 방어전:** 16×16 canyon, level 9; Baldrick's line, two rockfall devices, the rear-village raid, the mercenary captain on TURN 7, Baldrick's order chosen at deployment (hold / rescue), breach rule.
- **Faction trust and Thea:** trust moves with ACT I/II choices; Thea joins at Lv 8 after M08 when Iron Crown trust ≥ 1 and the deserters were not handed over.
- **Town doors** (D-065, the requested fix): the hub camera may scroll past the map edge by the HUD's measured size, and clicking any part of a painted house walks Erik to its door.
- **Earlier v0.6 work:** painted rooms and chests (D-056/057), figures 1.5× outside battle (D-058), pack B characters (D-059), Hangul names (D-060), enemy/NPC figure fit (D-061), connected dialogue (D-062), ACT II hub pack C (D-063).
- **Saves:** schema 9 imports 0–8; every load re-anchors the frontier to the hub of its story moment.

## Executed validation (final build, headless Chromium 141.0.7390.37 / Playwright 1.58.2, offline file URLs + HTTP smoke)
239 unit PASS / 0 FAIL (`npm test`, after packaging; docs/v0.6.0/evidence/unit-results.txt). New unit files: tests/mission07.test.mjs, tests/mission08.test.mjs, tests/migration-v050.test.mjs.

1,436 browser assertions PASS across 26 suites, plus the performance suite. The suites ran in offline browser contexts and recorded no runtime errors. Touch was emulated at 390×844 and the other sizes each suite specifies. Summary: docs/v0.6.0/evidence/browser-run-summary.log (36 suites including balances, all exit 0).

| Suite | Checks | Result |
|---|---:|---|
| journey-e2e (hubs, doors, stalls, council) | 176 | PASS |
| renaissance-e2e | 141 | PASS |
| campaign-e2e | 128 | PASS |
| hub-doors-e2e (new: 111 doors clear of the HUD at 1440×900 / 1280×720 / 390×844, 12 house clicks at 1440) | 123 | PASS |
| act2-hubs-e2e (castle town, Velmar, 12 rooms, ACT II chests) | 120 | PASS |
| act1-e2e (M04–M06, oath, ACT I card, march to Mission 7) | 113 | PASS |
| frontier-e2e | 104 | PASS |
| gameplay-quality-e2e | 98 | PASS |
| mobile-dock | 81 | PASS |
| e2e | 63 | PASS |
| world-e2e | 32 | PASS |
| class-e2e | 30 | PASS |
| act2-e2e (faction relations panel, room chests, schema-8 restore) | 28 | PASS |
| tactical-ui | 27 | PASS |
| act2-campaign-e2e (M06 → ACT II card → castle town → M07 → deserters → M08 order → Thea; 1440 / 390) | 24 | PASS |
| mobile-command | 24 | PASS |
| restart-stage | 22 | PASS |
| legion-e2e | 19 | PASS |
| migration-v02 | 16 | PASS |
| migration-v040 (shipped v0.4.0 HTML saves + v0.4.0-source fixtures) | 12 | PASS |
| migration-v050 (new: shipped v0.5.0 HTML saves + v0.5.0-source fixtures) | 12 | PASS |
| migration-v031 | 11 | PASS |
| migration-v033 | 11 | PASS |
| migration-v032 | 9 | PASS |
| post-move-attack | 8 | PASS |
| http-smoke | 4 | PASS |
| performance | 4 samples | PASS |

## Balance (legal player policy, rules API only, no state edits)
- `test:balance` M01: 30 winning runs, turns 4–6.
- `test:campaign-balance` M01–M03: 30 complete campaigns; capture 15, perfect rescues 30, bridge turn 5–9.
- `test:economy-balance`: 90 legal victories across standard, reinforced and purchased-tools campaigns; no purchase required.
- `test:m05-balance`: 30/30 wins (25 by breaking the formation).
- `test:m06-balance`: 30/30 wins.
- `test:act1-balance` M01→M06: **30/30 full ACT I clears**. Every number in the 30-seed table and runs equals the v0.5.0 evidence; the only difference is the M01 result text, which now names 가르 instead of Garr (D-060).
- `test:class-balance`: every trial 30/30; wins without the new action Erik 0, Elina 12, Lia 30, Sain 0, Kai 0; Legion Drill Lv 4 → 6 in 2–4 drills (avg 3.7), 110/110 wins.
- `test:act2-balance` (new) M01→M08, 30 seeds, M07 deserter and M08 order choices alternated:
  - M07: 30/30 wins in 7–8 turns. The policy wins by clearing the field after the waves; no run drove a wagon through the gate. The captain was taken alive in 29.
  - M08: 30/30 wins in 7–9 turns. Hold runs used both rockfall devices in 14 of 15; rescue runs (two heroes deployed by the rear village) saved 3/3 villagers in 15 of 15.
  - Thea joined in 21/30 (every run that did not hand the deserters over).

## Save compatibility
- **Shipped v0.5.0 HTML:** a village save and a Mission 01 battle checkpoint were made live in the shipped v0.5.0 HTML and imported through the visible backup UI.
  - The village save opens in the painted village with gold and heroes kept.
  - Battle units, economy and the nested checkpoint are unchanged, and a restart of the migrated battle works.
- **v0.5.0-source fixtures** (`tests/fixtures/v050`, generator included, built from a worktree of tag v0.5.0):
  - The ACT I complete camp (oath chosen, Eric promoted to Tier 2) opens in the oath camp with economy, completed missions and the promotion kept; the camp offers Mission 7 and the save reaches the castle town (Iron Crown trust −1 from the reported ledger).
  - The mid-M06 battle resumes, and the same save is also won under v0.6.0 rules (unit test).
- **Older saves:** v0.2–v0.4.0 migrations still pass.

## Art integrity
- `tests/presentation.test.mjs` hashes busts, sheets, ACT I hubs, the world map and icons against `src/assets/art-import-log.csv` and `world-art-import-log.csv`.
- `tests/rooms.test.mjs` hashes the 27 rooms, 40 chest cells and the 2 ACT II hubs against `src/assets/room-art-import-log.csv`.
- Each import checked the user's PNG masters against the pack manifests first. Pack QA: docs/v0.6.0/art.

## Performance
Frame time in headless Chromium with software rendering:
- 1440×900: town median 16.7 ms (p95 16.7); battle median 16.7 ms (p95 33.3).
- 390×844: town and battle median 16.7 ms (p95 16.7).

This is not a physical-device benchmark.

## Packaging / documentation
The standalone HTML embeds code, painted art, fonts and music, with no external runtime files.
- `npm run build` regenerates it byte-identically.
- `python scripts/verify-release.py` checks the text and JSON hash manifests, that the Source ZIP covers the exact current tree, a clean byte-identical rebuild and the unit tests.
- Source ZIP policy D-054 is unchanged: browser screenshots and earlier releases' standalone HTML are left out. The ZIP is about 94 MB (the 27 MB standalone HTML and the painted sources), under GitHub's 100 MB file limit; the next version will need to trim it further.

Evidence: docs/v0.6.0/evidence (suite JSON/logs). Screenshots: docs/v0.6.0/screenshots (not in the ZIP). Decisions D-055–D-065: docs/decisions/DECISION_LOG.md. Mission maps, numbers, dialogue and new names are PROPOSED; the royal command, the crown's rules and Bellard's role stay OPEN.

## Limits / next
- Not verified: physical hardware beyond the user's own play, Safari/Firefox, long-term browser storage eviction.
- ACT II stops after M08; M09–M10, Velmar in the story, Dario and the ACT II tracks are next (D-065).
- The War Council heading shows the mission number for M07/M08 (titles exist for M01–M06 only).
- The HTML is about 27 MB because of the embedded paintings.
