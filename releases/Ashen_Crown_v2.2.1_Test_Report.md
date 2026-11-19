# Ashen Crown v2.2.1 「용량 관리」 — Test Report
Updated 2026-11-19 KST. **Merged on the user's approval (2026-11-19 22:53 「병합해」, D-127).**
- Decisions: D-125 (size), D-126 (the play-test feedback of 18:03) and D-127 (approval and merge). Plan: docs/v2.2.1/SIZE_PLAN.md.
- HTML SHA256: see `releases/Ashen_Crown_v2.2.1_SHA256SUMS` (`index.html` is identical).

## What changed
**Size (D-125)**
- **Paintings as AVIF:** 382 portraits, duel images, map sprites, rooms, hubs and world-map images (scripts/convert-art-avif.py).
  - Same resolution as before.
  - Each image is SSIM-checked against the WebP it replaced; the floor is 0.975 or 0.97 by kind.
  - The conversion log, src/assets/avif-conversion-log.csv, links each AVIF to the import log's WebP hash.
- **Class sheets stay WebP:** the 24 class sheets keep their format. Their magenta sash is recoloured by threshold, and in AVIF 31% more pink fringe pixels (14,247 → 18,679) fell outside the threshold.
- **Size:** 63.7 → 46.5 MiB.
- **Build output:** builds go to build/Ashen_Crown.html (git-ignored), with build/size-report.json.
  - The build warns above 80 MiB and fails above 90 MiB.
  - The HTML is committed only by scripts/package.py.
  - CI builds before it tests.
- **AVIF notice:** a browser without AVIF sees a notice.
- **Earlier builds:**
  - releases/ARCHIVE.json lists them.
  - The manual workflow "Archive old builds" is for the user to run, since a Claude session gets 403 on tags and releases.
  - scripts/fetch-releases.mjs fetches them.

**Play-test (D-126)**
- **Rogues:** MOV 5 → 4.
- **Heals:** every heal restores half (core/rules.js HEAL_SCALE 0.5, at least 1).
- **Range tiles:** move, attack and support tiles are drawn a second time above houses, walls and trees. That pass is a wash plus a bright border; a tile with a unit on it gets the border only.
- **M06:** the four royal seal guards hold their posts (MOV 0).
- **Enemy strength:** M03 ×0.95, M04 ×0.97, M06 ×1.02, M15 ×0.95, M17 ×0.97.
- **Saves:** schema 21 is unchanged.

## Results on this build (build SHA256 d43f373f…, confirmed by a rebuild after the run)
- **Unit tests: 546 PASS / 0 FAIL / 16 skipped with reasons (562 in all)** (docs/v2.2.1/evidence/unit-results.txt).
  - New: tests/size-budget.test.mjs and tests/playtest-d126.test.mjs.
  - The art tests follow the chain import log → conversion log → AVIF (tests/art-file.mjs).
  - Changed: the M06 guard test now expects the guards to hold their posts.
- **Full browser and balance matrix, 66 suites: every suite's final exit is 0** (docs/v2.2.1/evidence/browser-run-summary.log; 2,323 `PASS` lines).
  - act4d timed out once (a 30 s locator wait) while the two halves ran in parallel on 2 cores. It was rerun alone, unchanged, and passed with 38 checks.
  - Before this run, the size-only build ran the same matrix. That run found:
    - a comment in scripts/serve.mjs that hid the port declaration, which broke the http suite;
    - three suites still expecting version 2.2.0.

    Both are fixed.

### How each feedback point was settled (act1-balance, 30 seeds; first-try rates from act2-balance)
Each step changed one thing:

| Step | M03 | M04 | M06 | Note |
|---|---:|---:|---:|---|
| v2.2.0 | 90% | 74% | 95% | |
| Rogue MOV 4 + heals halved | 63% | 47% | 0% | M06: all losses at the seal (TURN 11) |
| Heals halved, rogue MOV 5 | 60% | 67% | 100% | so M06 depends on the rogue |
| Rogue MOV 4, full heals | 97% | 52% | 0% | and M03 on the heals |
| M06 seal TURN 12 / 13 (+ turn limit 20) | | | 25% / 32–36% | more time does not help |
| M06 one-action unsealing (anyone / the rogue) | | | 9% / 5% | the stones are not reached |
| M06 guards hold their posts (MOV 0), alone | | | 82% | 18/22 in mission06-balance |
| Final strengths (M03 ×0.95, M04 ×0.97, M06 ×1.02, M15 ×0.95, M17 ×0.97) | **77%** | **91%** | **95%** | |

- **Final ACT I (act1-balance):** M01 30/30, M02 30/30, M03 23/30, M04 21/23, M05 21/21, M06 20/21.
- **Final first try (act2-balance):** every mission ≥ 65%.

  | Missions | First-try wins |
  |---|---|
  | ACT I | M01 20/20, M02 20/20, M03 15/20, M04 17/20, M05 20/20, M06 18/20 |
  | ACT II | M07 18/20, M08–M11 20/20, M12 19/20, M13 20/20, M14 20/20 |
  | ACT III | M15 13/20, M16 15/15, M17 15/15, M18 12/15, M19 15/15, M20 15/15, M21 14/15, M22 12/14 |
  | ACT IV | M23 13/14, M24–M30 14/14 |

- **economy-balance:** 87/90 across the three loadouts.

### Size and art
- **Size:** build/size-report.json (kept as docs/v2.2.1/evidence/size-report.json): 46.48 MiB.
- **Decoding:** all 394 large paintings decoded at once, median of three (docs/v2.2.1/evidence/decode-time.json).

  | Build | 1440 | 390 |
  |---|---:|---:|
  | v2.2.0 (WebP) | 1,761 ms | 1,778 ms |
  | v2.2.1 | 1,565 ms | 1,551 ms |

- **Image quality** (docs/v2.2.1/screenshots/avif-compare-*.png):
  - portraits, the finisher and Erik's sheet are indistinguishable;
  - the tavern floor and the camp ground are slightly softer.
- **Range tiles** (docs/v2.2.1/screenshots/range-move-before-after.png, range-attack-before-after.png): the tiles under the M01 houses and the trees show on top.
- **Archive mechanism:** scripts/fetch-releases.mjs restored v0.3.1 from its existing release, byte-identical.

## Not measured
- 어려움 with the new heals and rogue MOV.
- iPhone Safari: WebKit cannot be downloaded in this environment.
- A browser without AVIF: the notice is checked in source only.
- The archive workflow: only the user can run it.
