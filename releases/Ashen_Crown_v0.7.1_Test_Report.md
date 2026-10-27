# Ashen Crown v0.7.1 — The Three Banners (ACT II complete) / QA Report
Updated 2026-10-27 KST. The user played the release candidate and approved the merge with one fix in chat on 2026-10-27 18:34 KST ("좋은데 버그가 하나있어 음악을 가장 작은 소리나 mute를 눌러도 아주 작은 소리가 나고 있어. 이것까지 수정해서 병합해줘", D-072). The fix is in this build and the full validation was run again on it. The work started with the user's approval of the v0.7.0 merge in chat on 2026-10-27 06:16 KST ("병합하고 다음버전 진행해줘", D-070). Design D-068 §3–§6; implementation details D-071.

Baseline main 81f11d36c8ce701ad9d59fc0b6271397fef1e0ff (v0.7.0, PR #14). Release candidate c5ca873 (PR #15; build 965ae7ee…f6f8, hosted CI run 40417800182 7/7 on attempt 1) plus the fix commit (music mute, D-072: src/audio/audio-engine.js, two new test suites, documentation, evidence and packaging).

HTML SHA256: `c9263af431331ee6327e4203e2624f7d6cb5323f7081f1eaed22a4d1bbdd7436` (27,165,284 bytes). The validation run below used this build; rebuilding from the release commit produces the same bytes (`verify-release.py`).

## Outcome
ACT I (Missions 01–06), the v0.5.0 promotions and v0.7.0's M07–M12 unchanged, plus the end of ACT II (D-068/D-071):
- **M13 검은 사자의 결단:** the refugee camp (18×14, level 11). Baldrick's lion formation (three living bearers give adjacent enemy units +2 DEF and +10 hit, and Baldrick's charge hits isolated targets +4) comes down on four refugees; cavalry on TURN 3, spears on TURN 5. Resolve starts from ACT I–II choices (M05 answer "구해 주신 목숨입니다" +1, M08 hold +1, Iron Crown trust ≥ 2 +1) and rises with Erik's **persuade** (beside Baldrick, once a turn), Thea's word (once) and enemy phases from TURN 4 with no refugee hurt (at most 2). Resolve 6 halts the army (victory, Iron Crown trust −1). Otherwise break the formation and drive Baldrick to half HP from TURN 5, or hold to TURN 12. Baldrick never falls below half. Two refugees lost lose.
- **M14 부서진 동맹:** the ruined waystation (18×14, level 12). Cassian, Leonora and Lucien with six guards withdraw south as allies while masked raiders hunt the leaders (waves on TURN 2, 4, 6). On TURN 4 the banner with the lowest trust turns (ties Iron Crown → Free Lords → Sacred Flame): its leader leaves and its guards become enemies. Two loyal leaders through the exit row win; a loyal leader down after the betrayal, or TURN 12, loses. Afterwards the betrayer −1, the others +1. The recruit from the betraying banner stays if they fought in M14 or that banner's trust is ≥ 1; otherwise they leave for now (kept aside in the save).
- **ACT II completion card** after M14: the three banners' standing with the legion, who turned, Baldrick's ending and who remains.
- **Fix (D-072): music was still faintly audible with Mute, BGM 0 or Music Pause.** Every music track also feeds the reverb, and since v0.4.0 the reverb return reached the output at a fixed level, bypassing the music volume. It now follows the BGM level (the mix at the default BGM .45 is unchanged, and the dry/reverb balance is the same at every volume), and a level of 0 ends at an exact 0.
- **Fix:** the `생포` (capture) command now appears in every mission with capture rules, not only M02 (M07, M09, M10 mediation, M12).
- **Music and art:** one original track (The Black Lion's Decision). The summit camp uses the oath-camp painting; the masked raiders and the three leaders' map looks are drawn by the game until art work pack D arrives.
- **Saves:** schema 9 unchanged (imports 0–8). `campaign.departed` is validated (recruit ids only, never also in the roster); turned guards save as enemies.

## Executed validation (final build, headless Chromium 141.0.7390.37 / Playwright 1.58.2, offline file URLs + HTTP smoke)
303 unit tests PASS / 0 FAIL (`npm test` after packaging; docs/v0.7.1/evidence/unit-results.txt). New unit files: tests/mission13.test.mjs (7), tests/mission14.test.mjs (6), tests/migration-v070.test.mjs, tests/audio-mix.test.mjs (4; follows every path from a music track to the output through a recording fake of the audio graph).

1,618 browser assertions passed across 33 suites, plus the performance suite. No runtime errors were recorded. Summary: docs/v0.7.1/evidence/browser-run-summary.log — 42 suites including the balances, all exit 0, in one run on this build.

| Suite | Checks | Result |
|---|---:|---|
| journey-e2e | 176 | PASS |
| audio-mute-e2e (new; 1440 and 390 touch, output tapped by an analyser from a test-only init script, the game's own 음악 / 효과음 controls) | 20 | PASS |
| hub-doors-e2e (159 doors at three sizes, now including the summit camp; 12 house clicks) | 171 | PASS |
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
| act2d-campaign-e2e (new; 1440 and 390 touch): v0.7.0 refugee-camp fixture → M13 → persuade from the command menu (forecast resolve +1) → halt → summit camp → M14 battle opens with the three leaders → (summit outcome with the Iron Crown turning set up through the rules) → recruit scene → ACT II card; capture button in M10 mediation | 30 | PASS |
| act2-e2e | 28 | PASS |
| tactical-ui | 27 | PASS |
| act2c-campaign-e2e (camp now leads on to Mission 13) | 26 | PASS |
| act2-campaign-e2e | 24 | PASS |
| mobile-command | 24 | PASS |
| act2b-campaign-e2e | 22 | PASS |
| restart-stage | 22 | PASS |
| legion-e2e | 19 | PASS |
| migration-v02 | 16 | PASS |
| migration-v040 | 12 | PASS |
| migration-v050 | 12 | PASS |
| migration-v060 | 12 | PASS |
| migration-v061 | 12 | PASS |
| migration-v070 (new): shipped v0.7.0 HTML saves + v0.7.0-source fixtures → M13 | 12 | PASS |
| migration-v031 | 11 | PASS |
| migration-v033 | 11 | PASS |
| migration-v032 | 9 | PASS |
| post-move-attack | 8 | PASS |
| http-smoke | 4 | PASS |
| performance | 4 samples | PASS |

### Music mute fix (D-072)
Peak output level over about 1.4 s while the music plays (headless Chromium, the same audio-mute steps):

| Setting | Release candidate 965ae7ee | Fixed build c9263af4 (1440 / 390) |
|---|---:|---:|
| Playing, BGM .45 | −12.5 dB | −12.7 / −12.7 dB |
| Mute | −28.2 dB | silent (0) / silent (0) |
| BGM 0 (SFX 0) | −32.8 dB | silent (0) / silent (0) |
| BGM 0.05 (lowest step) | not measured | −30.8 / −31.3 dB |
| Music Pause | −30.0 dB | silent (0) / silent (0) |
| Mute off / Pause off | −12.7 dB | −11.8 to −12.7 dB |

The release-candidate column comes from a scratch measurement made before the fix. Run against the release-candidate HTML, the audio-mute suite failed 6 of 20 checks: every Mute, BGM 0 and Music Pause check at both sizes, at −30.5 to −33.2 dB. tests/audio-mix.test.mjs fails on the old engine with the reverb path (gain 0.14 at Mute).

### Performance note
In this run the 1440 medians are 33 ms (town p95 50 ms; battle p95 50 ms), against 16.7 ms in the release-candidate run in the earlier session. To check whether the fix caused this, the performance suite was run twice more on the fixed build and twice on the release-candidate HTML in this environment. The release candidate measured the same or slower (1440 battle median 33.3 and 50.0 ms). So the difference comes from the environment, not from this change. 390 medians are 16.7 ms throughout.

### Release candidate run
In the release candidate's first full run, act2c-campaign failed one check: it still expected v0.7.0's "M13 comes in the next update" camp text. The check was updated to expect the `Mission 13` next-mission button, and the suite passed again on the same build (26/26). No game code changed.

## Balance (legal player policy, rules API only, no state edits)
- Every balance result on the fixed build is identical to the release candidate's (all eight balance suites compared). These are also identical to the v0.7.0 evidence: `test:balance`, `test:campaign-balance`, `test:economy-balance`, `test:m05-balance`, `test:m06-balance`, `test:class-balance`, `test:act1-balance`.
- `test:act2-balance` M01→M14, 30 seeds. Every per-seed M07–M12 record is identical to v0.7.0. On even seeds the policy persuades first and never strikes Baldrick.

| Mission | Result |
|---|---|
| M07–M12 | Identical to v0.7.0: 30/30 wins each; Thea 21/30, Dario 30/30, Ines 30/30 |
| M13 | 30/30 wins, all on TURN 5. Persuade-first (15): 13 halted at resolve 6, 2 broke the formation. Strike-first (15): 15 broke the formation. Held to TURN 12: 0. All four refugees safe 30/30 |
| M14 | 30/30 wins in 5–6 turns, two leaders through. Betrayer Iron Crown 21, Sacred Flame 9, Free Lords 0. Recruit stayed 21 (Thea), left 9 (Ines) |

- The Free Lords betrayal never occurred on the policy's choice paths; all three betrayals are covered by unit tests (tests/mission14.test.mjs).
- The policy wins M13–M14 quickly. Human difficulty is for the user's play-test.

## Save compatibility
- Unit tests (tests/migration-v070.test.mjs): the v0.7.0 refugee-camp save loads with completed missions, economy, flags, choices, promotions and trust unchanged and continues to M13; the mid-M12 battle resumes unchanged and is won.
- Browser (tests/migration-v070.mjs): saves made by the shipped v0.7.0 HTML (village and Mission 01 battle) restore with their checkpoint, and restart works. The source fixtures reach the refugee camp before M13, and a reload shows v0.7.1.

## Packaging
`python3 scripts/package.py` → `npm test` → `python3 scripts/package.py` → `python3 scripts/verify-release.py`. Results are in docs/v0.7.1/evidence and the SHA256 manifest. Following D-066, the Source ZIP leaves out the built HTML; verify-release rebuilds it from the ZIP and compares the two.

## Not verified
- Physical phones, Safari and Firefox.
- Long-term browser storage eviction.
- Real-PC frame times (performance numbers are headless).
