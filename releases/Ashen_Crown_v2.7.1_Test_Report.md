# Ashen Crown v2.7.1 「게시판 그림과 마무리」 — Test Report
Updated 2026-11-24 KST. **Release candidate** on feature/v2.7.1 (not merged), built on v2.7.0 (merged, D-160); the user plays and approves it first.
- Decision: D-161. Notes: docs/v2.7.1/RELEASE_NOTES.md.
- HTML SHA256: see `releases/Ashen_Crown_v2.7.1_SHA256SUMS` (`index.html` is identical).

## What changed
- **Art pack M** (the request board) checked against its manifest and SHA256SUMS (512×512 RGBA, clear corners) and imported as a 256×256 WebP prop; the square's board is the painting now (108 px, feet on the tile's lower edge).
- **어려움 M06** starts from ×1.7 (보통 keeps ×1.8).
- **Large towns:** every town map lists its places in Korean; the royal lower city and the summit camp have their own place names instead of Velmar's and the border camp's; Lia's line in the keep says 「안뜰」.
- **Archive:** v2.5.1's Release checked (four files at the recorded sizes) and its HTML and Source.zip left the tree; v2.5.2, v2.6.0, v2.6.1 and v2.7.0 joined releases/ARCHIVE.json at their last packaging commits.
- Story, choices, endings and saves (schema 28) unchanged otherwise.

## How it was tested
- 어려움 M06 tuned from the 30 어려움 camps saved before it (two tries each); then the 어려움 chain ran M01→M30 (30 campaigns). 보통 has no changed number, so its v2.7.0 chain stands.
- Browser: the suites the change touches ran here; the rest run in the PR's CI.

## Results on this build
- **어려움 M06 (60 tries from camps):** 1.45 60/60 · 1.6 59/60 · **1.7 46/60** · 1.75 33/60 · 1.8 33/60.
- **어려움 chain:** M06 21/30 (v2.7.0 15/30); lowest M26 11/20, M28 13/20, M03 17/30, M23 15/23; 17 campaigns reach M30 (v2.7.0 13). Full line: docs/v2.7.1/evidence/balance-chains.txt.
- **Unit tests on the packaged build: 594 PASS / 0 FAIL / 16 skipped** (docs/v2.7.1/evidence/unit-results.txt; the 16 skipped are pinned on the pre-v2.0 maps, D-115).
  - New: tests/v271.test.mjs (the board in the import log with the pack's master hash; HARD_BASE_AT and the 보통/어려움 M06 strengths; Korean place names in every town, the lower city's and the summit's names; the archive list and .gitignore). Re-pinned: the prop count (19), version 2.7.1.
- **Browser suites run here (13): every exit is 0** (docs/v2.7.1/evidence/browser-run-summary.log): v271 9, v270 16, v210 46, v231 26, v241 26, v251 28, frontier 90, journey 176, world 32, quality 98, mobile 91, hub-doors, act2-hubs 315 checks.
  - **v271 suite** (1440×900, 390×844): the build carries the painted board; 갈대 나루's clerk opens 「의뢰 게시판」; the town map lists 마을 광장 · 마을 출구 · 대장간 · 잡화점; no runtime errors. Screenshot: docs/v2.7.1/screenshots/reed-board-painted-1440.png.
- **The other browser suites:** run by CI on the PR.

## Not done in this version
- **Not tested here:** native phones, Safari/WebKit and Firefox.
- The four camp hubs that share the night-bivouac painting keep its generic names (campfire, tents, wagon).
