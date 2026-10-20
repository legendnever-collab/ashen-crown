# Ashen Crown v0.5.0 — Ranks of the Ashen Legion / QA Report
Updated 2026-10-20 KST. The user received the v0.5.0 release candidate (through Phase F) and approved the merge in chat on 2026-10-20 20:45 KST ("좋아 우선 병합진행해"). The PR number, hosted CI run and merge SHA are recorded in docs/v0.5.0/RELEASE_NOTES.md after the merge and on GitHub.

Baseline main f922a180f49821c72247b9d105d79b36ea7e2809 (v0.4.0, tag v0.4.0). Branch feature/v0.5-advanced-class; source checkpoint 41ba70118f421e29d7d55117f105ba9599c4056c (Phase F) plus the release packaging commit (build title/description, v0.4.0 browser migration suite, CI group, documentation, evidence).

HTML SHA256: `19b499c3110682c846f2cf8740e0820f538aa306d6016f40a3bf7af29b13584e` (15,787,210 bytes; the same bytes were rebuilt from source before and after the validation run).

## Outcome
ACT I (Missions 01–06) unchanged, plus Advanced Class & Character Progression:
- **Promotions after ACT I** (D-047/048):
  - Aren's rite in the oath camp; conditions are ACT I + Lv 6 + potential 3/3.
  - Five trial battles, each teaching the hero's new action, and the repeatable Legion Drill.
  - Guardian Knight (방벽), Ranger (경계 사격), Arcanist (마력 지형), Ember Cleric (귀환의 기도) and Shadowblade (그림자 교환), with tier-2 skill upgrades.
  - Potential is read retroactively from tactical memory; proficiency ★ applies after promotion.
  - The unit sheet has a '성장' tab.
- **Tier 2 art:** 20 promoted busts and 5 map sheets from the user's pack, hash-verified.
- **World map and hubs** (D-052/053):
  - The world map of Erdia appears at a new game, on every hub change and from the menu; regions are revealed when met.
  - Six painted hubs follow the story moment: village day, village after the raid, garrison, night bivouac with a wandering merchant, reclaimed fortress, oath camp.
  - Shop catalogs, prices and chest doors are unchanged.
  - Art came from the user's ChatGPT packs; the first upload was truncated, and Part 2 was repackaged byte-identical by SHA256.
- **Presentation** (Phase F): battle flourishes for the five actions and the overwatch shot; a one-time promotion card; five new original tracks.
- **Saves:** schema 8 imports 0–7; every load re-anchors the frontier to the hub of its story moment (spatial only).

## Executed validation (final build, headless Chromium 141.0.7390.37 / Playwright 1.58.2, offline file URLs + HTTP smoke)
198 unit PASS / 0 FAIL (`npm test`, after packaging; docs/v0.5.0/evidence/unit-results.txt). The documentation test now also skips links to screenshots and earlier release HTML when run from the Source ZIP, because D-054 leaves them out of it.
- Before packaging, the same run had 197/198: the documentation test failed because the Source ZIP that README links to did not exist yet.

1,128 browser assertions PASS across 21 suites, plus the performance suite. The suites ran in offline browser contexts, and no runtime errors were recorded. Touch was emulated at 390×844, 360×640, 430×932 and landscape 844×390 where a suite specifies it. Summary: docs/v0.5.0/evidence/browser-run-summary.log (26 suites, all exit 0).

| Suite | Checks | Result |
|---|---:|---|
| journey-e2e (hubs, doors, stalls, council) | 176 | PASS |
| renaissance-e2e | 141 | PASS |
| campaign-e2e | 128 | PASS |
| act1-e2e (M04–M06, oath, ACT I card) | 113 | PASS |
| frontier-e2e | 104 | PASS |
| gameplay-quality-e2e | 98 | PASS |
| mobile-dock | 81 | PASS |
| e2e | 63 | PASS |
| world-e2e (world map, travel map, wandering merchant; 1440 / 390) | 32 | PASS |
| class-e2e (promotion actions, flourish; 1440 / 390) | 30 | PASS |
| tactical-ui | 27 | PASS |
| mobile-command | 24 | PASS |
| restart-stage | 22 | PASS |
| legion-e2e (rite panel, trial by touch, promotion card, drill) | 19 | PASS |
| migration-v02 | 16 | PASS |
| migration-v040 (shipped v0.4.0 HTML saves + v0.4.0-source fixtures) | 12 | PASS |
| migration-v033 | 11 | PASS |
| migration-v031 | 10 | PASS |
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
- `test:act1-balance` M01→M06: **30/30 full ACT I clears**.
  - The 30-seed per-mission result is identical to v0.4.0 (compared field by field with the v0.4.0 report).
- `test:class-balance`:
  - Every trial was won 30/30.
  - Wins without the new action: Erik 0, Elina 12, Lia 30, Sain 0, Kai 0.
  - Legion Drill: all five heroes went from Lv 4 to 6 in 2–4 drills (average 3.7); drills won 110/110.

## Save compatibility
- **Shipped v0.4.0 HTML:** a village save and a Mission 01 battle checkpoint were made live in the shipped v0.4.0 HTML and imported through the visible backup UI.
  - The village save opens in the painted village with gold and heroes kept.
  - Battle units, economy and the nested checkpoint are unchanged, and a restart of the migrated battle works.
- **v0.4.0-source fixtures** (`tests/fixtures/v040`, generator included):
  - The ACT I complete camp opens in the oath camp, with the campaign economy and completed missions kept and the rite panel offered.
  - The mid-M05 battle resumes, and the same save is also won under v0.5.0 rules (unit test).
- **Older saves:** v0.2–v0.3.3 migrations still pass.

## Art integrity
`tests/presentation.test.mjs` hashes every shipped painted WebP and compares it with the import logs:
- busts and sheets: `src/assets/art-import-log.csv`;
- hubs, world map and icons: `src/assets/world-art-import-log.csv`.

Each import checked the user's PNG masters against the pack manifests first. Pack QA reports: docs/v0.5.0/art.

## Performance
Frame time in headless Chromium with software rendering:
- 1440×900: town median 16.7 ms (p95 16.8); battle median 16.7 ms (p95 33.4).
- 390×844: town and battle median 16.7 ms (p95 16.7–16.8).

This is not a physical-device benchmark.

## Packaging / documentation
The standalone HTML embeds code, painted art (busts, sheets, hubs, world map), fonts and music, with no external runtime files.
- `npm run build` regenerates it byte-identically.
- `python scripts/verify-release.py` checks:
  - the text and JSON hash manifests;
  - that the Source ZIP covers the exact current tree;
  - a clean byte-identical rebuild;
  - the unit tests.

Source ZIP policy (D-054, new in this release): the ZIP (58 MB) leaves out two things so it stays under GitHub's 100 MB file limit.
- Browser screenshots (`docs/*/screenshots`, regenerated by the suites). With the painted hubs each one is about 2 MB, and with them the ZIP was 133 MB.
- Earlier releases' standalone HTML, which remains in git history, the tags and the GitHub Releases.

Both scripts and the documentation test apply the same rule.

Evidence: docs/v0.5.0/evidence (suite JSON/logs). Screenshots are in the repository at docs/v0.5.0/screenshots, not in the ZIP. Decisions D-045–D-053 are in docs/decisions/DECISION_LOG.md. Class names, trial maps and numbers, and place names are PROPOSED.

## Limits / next
- Not verified: physical hardware beyond the user's own play, Safari/Firefox, and long-term browser storage eviction.
- Lia's trial is winnable without the rune.
- The HTML is about 15.8 MB because of the embedded paintings.
- Battle-map backgrounds are unchanged.
- ACT II and awakening (Tier 3) are not started.
