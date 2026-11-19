# Ashen Crown v2.2.1 「용량 관리」 — Test Report
Updated 2026-11-19 KST (draft — results below are from the run before the class sheets went back to WebP; replaced when the final run ends). **Release candidate on feature/v2.2.1-size; not merged before the user looks at it and approves it.**
- Decision: D-125. Plan: docs/v2.2.1/SIZE_PLAN.md.
- HTML SHA256: see `releases/Ashen_Crown_v2.2.1_SHA256SUMS` (`index.html` is identical).

## What changed
- **The paintings are AVIF:** 382 portraits, duel images, map sprites, rooms, hubs and world-map images (scripts/convert-art-avif.py). The 24 class sheets stay WebP: their magenta sash is recoloured by threshold.
  - Same resolution as before.
  - Each image is checked by SSIM against the WebP it replaces.
  - The conversion log, src/assets/avif-conversion-log.csv, links each AVIF to the import log's WebP hash.
- **Size:** 63.7 → 46.5 MiB (build/size-report.json, kept as docs/v2.2.1/evidence/size-report.json).
- **Build output:** builds go to build/Ashen_Crown.html, which git ignores.
  - The HTML is committed only by scripts/package.py.
  - The size budget warns above 80 MiB and fails the build above 90 MiB.
- **AVIF notice:** a browser that cannot decode AVIF sees a notice.
- **Earlier builds:**
  - releases/ARCHIVE.json lists the 28 earlier builds with their hashes.
  - The workflow "Archive old builds" is for the user to run. A Claude session gets 403 on tags and releases.
  - scripts/fetch-releases.mjs fetches earlier builds by REST.
- **No gameplay change:** schema 21; the save format is unchanged.

## Results on this build
- **Unit tests: 543 PASS / 0 FAIL / 16 skipped with reasons (559 in all)** (docs/v2.2.1/evidence/unit-results.txt).
  - New in tests/size-budget.test.mjs:
    - the budget thresholds;
    - the six painting folders are AVIF only, and every file matches its conversion record at or above its SSIM floor;
    - the AVIF notice;
    - the archive manifest.
  - The art tests now follow the chain import log → conversion log → AVIF (tests/art-file.mjs), including every bust's and sprite's pixel size.
- **Full browser and balance matrix, 66 suites: every suite's final exit is 0** (docs/v2.2.1/evidence/browser-run-summary.log; 2,307 `PASS` lines).
  - Every suite ran on the build packaging produces: SHA256 7bad5ee6…, confirmed by a rebuild.
  - Three suites failed in the parallel run and passed when rerun one at a time after fixes:

    | Suite | Cause |
    |---|---|
    | http | A comment added to scripts/serve.mjs in this version commented out the port declaration, so the local server did not start. Fixed. |
    | migration-v050, v200 | They still expected version 2.2.0. |

- **Balance:** identical to the v2.2.0 final run, mission by mission. Only the art changed.
  - act1-balance: M01 30/30, M02 30/30, M03 27/30, M04 20/27, M05 19/20, M06 18/19.
  - act2-balance first try: the same figures as v2.2.0, M01–M30 (e.g. M15 11/19, M17 10/16, M22 13/15).
- **Decoding** (tests/decode-time.mjs, docs/v2.2.1/evidence/decode-time.json): all 394 large paintings decoded at once in a fresh page, median of three.

  | Build | 1440 | 390 |
  |---|---:|---:|
  | v2.2.0 (WebP) | 1,789 ms | 1,749 ms |
  | v2.2.1 (AVIF) | 1,488 ms | 1,547 ms |

  An earlier run gave 1,843 / 1,647 ms and 1,663 / 1,630 ms. AVIF is no slower.
- **Image quality:** docs/v2.2.1/screenshots/avif-compare-*.png show the same crops side by side at full size, WebP left and AVIF right.
  - The portrait, finisher and map sprite are indistinguishable.
  - The tavern floor's grain and the camp ground are slightly softer.
  - Lowest SSIM 0.970 (a room); the busts' mean is 0.983.
- **Archive mechanism:**
  - scripts/fetch-releases.mjs restored the v0.3.1 build from its existing release, byte-identical.
  - Run over every CI suite list, it finds the 25 builds those suites need.

## Not measured
- A browser without AVIF: the notice is checked in source, not shown in a browser without AVIF.
- The archive workflow itself: it can only be run by the user on GitHub.
