# Ashen Crown v2.5.2 「마을에서 누르면 바로」 (small update) — Test Report
Updated 2026-11-22 KST. **Release candidate** on feature/v2.5.2 (not merged; the user plays and approves it first).
- Decisions: D-148 (the first small update, 16:48), D-149 (the second, 17:14), D-151 (the v2.5.0 build out of the tree). Notes: docs/v2.5.2/RELEASE_NOTES.md.
- HTML SHA256: see `releases/Ashen_Crown_v2.5.2_SHA256SUMS` (`index.html` is identical).

## What changed
- **A click on a person** walks Eric within reach (the tavern keeper behind his counter: two tiles) and talks; the tile above a person's feet counts. A person with a service opens a small menu beside them: 대화 · 인재 확보 (tavern), 대화 · 거래 (smith, merchant, wandering merchant), 대화 · 의뢰 게시판 (request board), 닫기. 「대화」 says one of three lines in turn (src/data/npc-talk-v252.js) and offers the service from there.
- **A click on a chest** walks beside it and opens it; with no way there it says so.
- **A click during a walk replaces it**: the walk stops after its current step and the newest click walks (people, chests and doors too; the first target's talk or door does not happen).
- **The gear purchase fits the screen**: the three columns share the window's height and scroll on their own; the stars sit on the name line; the buy button stays in view. On short screens (height ≤ 520 px, a phone held sideways) the modal's button bar scrolls with the rest (found by the quality suite: at 844×390 it covered the shop's buttons).
- **Shops name classes only**: the purchase window lost its 「장착: <hero names>」 line and the shop list its hero names (spoilers for heroes not met yet); the descriptions already name the classes.
- **Doors matched to the paintings** (D-149): all 20 town and camp paintings were overlaid with their entrance tiles and the 117 doors checked one by one. Moved: the hall on the village footprint (eleven hubs) 21→20, the forest forge 5→3, the Saltport forge 5→4, the camp's command tent 17→19, the bivouac's soldiers' tent 3→4 and command tent 17→18 (also march, refuge, field camp), the oath camp's command tent 17→18 (also summit), the pilgrim granary 20→21, the keep's two gate doors one row lower (row 1→2). Doors drawn across two tiles by half a tile stay.
- **Fix:** in the royal lower city Ines (from ACT III) stood on the tavern's door tile and Baldrick (from M27) on the house's, so those doors could not be used; they stand at (11,10) and (13,11) now. In the raided village Ines moved one tile off the hall's new door tile.
- **Repository (D-151):** v2.5.0's GitHub Release holds every file at its recorded size; its HTML and source ZIP left the tree. v2.5.1 joined releases/ARCHIVE.json.
- Rules, missions, story, balance and saves (schema 27) are unchanged. Size: 50.4 MiB (warn at 80 MiB).

## How it was tested (the user's request, 2026-11-21 19:02)
- Only the town UI and the hub data changed; no battle rule or mission changed, so the campaign balance chain was not rerun (its last run is v2.5.1's).
- In the browser, the suites the change touches ran here; the other suites run in the PR's CI.

## Results on this build
- **Unit tests on the packaged build: 573 PASS / 0 FAIL / 16 skipped** (docs/v2.5.2/evidence/unit-results.txt; the 16 skipped are pinned on the pre-v2.0 maps, D-115).
  - New: tests/doors-v252.test.mjs — the moved doors stand where the paintings put them (inside their buildings; the fortress keeps its own gate; the other village paintings keep the forge at 5); every painted door in every hub is a solid threshold with a walkable tile in front that nobody stands on, usable from the front, entered and left back to that tile; the weapon shop in three towns names no hero and names the classes; every shop description names its classes.
- **Browser suites run here (8): every final exit is 0** (docs/v2.5.2/evidence/browser-run-summary.log): v252, hub-doors, quality, frontier, journey, act2-hubs, world, v210.
  - quality failed twice before the fix: once on a held-key timing check under load (1440×1000 "direction changes", passed alone), then at 844×390 where the modal's sticky button bar covered the shop's 「비교 / 구매」 button; after the short-screen rule it passed alone (98 checks).
  - **v252 suite (42 checks, 1440×900, 1280×720, 390×844):** from the tavern's door a click on the keeper (his head, or his feet when the head is under the bar) walks within reach and opens 대화 · 인재 확보; 대화 says a keeper's line and leads to the hires; a second click beside him opens the menu at once; a click on a chest walks there and opens it; a click on the village elder walks there and he talks (no menu); a click six tiles west, then two tiles east while walking, ends on the second tile; the purchase names classes, not heroes; the buy button is on screen without scrolling; no runtime errors. Screenshots: docs/v2.5.2/screenshots (and doors-moved.jpg, the old and new door tiles on the paintings).
- **The other browser suites:** run by CI on the PR.

## Not done in this version
- **Not tested here:** native phones, Safari/WebKit and Firefox.
- The next major update (D-150, docs/next/MAJOR_UPDATE_REQUESTS.md) is recorded, not started.
