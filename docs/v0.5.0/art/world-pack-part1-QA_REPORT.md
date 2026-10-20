# Ashen Crown v0.5.0 — World Art QA Report

## Result

All eight requested PNG masters are included, with exact delivery dimensions, the required folder structure, final prompts, manifest, checksums, contact sheet and 50% day/raid blend.

**Overall strict specification result: FAIL.** Delivering the best generated versions as explicitly permitted in section 5 of 00_START_HERE.md. Remaining failures concern exact world-site clearances, uniform icon gutters and strict doorway sizing. These images are review masters; the failed constraints should be resolved before coordinate-dependent runtime integration.

## Required self-check

| Check | Result | Performed check and finding |
|---|---|---|
| Eight PNG masters; exact sizes; decode; RGB/RGBA | PASS | Decoded all eight locally. Seven are RGB 1536×1024; world_icons is RGBA 1024×1024. |
| Icons have real transparency or documented pure green | PASS | Actual alpha range 0–255; 471,305 fully transparent pixels in final 1024×1024 sheet. No green-key substitute used. |
| No text, letters, numbers, watermark or UI | PASS (visual) | Inspected all eight full images and their full-resolution quadrants, including signs, banners and tables. No readable writing or UI found. Banners contain abstract heraldry/flame motifs; infirmaries use a cross pictogram. This is visual inspection, not a guarantee from OCR. Evidence/contact-sheet labels are outside the eight PNG masters. |
| No people in hub maps | PASS (visual) | All six hub masters inspected. No people found. Only the night camp has the two permitted horses. Training figures are straw dummies. The separate scale evidence deliberately overlays the supplied character; it is not a runtime master. |
| Hubs match labelled service locations; center open; entrance bottom center | PASS for broad composition; FAIL for exact geometry | Each requested service occupies the correct general sector; bottom entrances and wide circulation routes remain visible. Generated footprints are approximate rather than grid-locked. Night fire is about one tile north of the sketch target, and several buildings/tents extend beyond their drawn rectangles. No collision mesh or game traversal test was performed. |
| Raid/day identical buildings and paths; 50% blend evidence | PASS (visual alignment) | Raid was an edit of the generated day image. Blend inspected: well, smithy, shop, inn, elder hall, depot, square corners and entrance align without a global camera shift. Intentional destroyed houses, damage, cots, cart/crates and lighting differ. This is not a claim of pixel-identical untouched pixels. See evidence/raid_vs_day_blend.png. |
| Night/dusk ground readable | PASS | Visual inspection plus central-region luminance measurement: night median ~83/255, dusk ~123/255. Warm fires/lanterns and cool night ground remain legible. These measurements cover x520–1030,y350–800 and are descriptive, not a gameplay contrast certification. |
| World-map listed sites clear for ~80px | FAIL | All 15 exact centers inspected in 100×100 crops with 80px circles. Some sites still contain trees, rocks, water edges or relief. See detailed notes and evidence/world_site_clearance_review.png. No buildings were painted on the terrain map. |
| Scale matches 64px doors and 60–70px adult | FAIL for strict doorway width; approximate visual fit | Added supplied sprite at exactly 64px visible height to separate QA evidence and inspected it. Buildings and props read plausibly at that character scale, but ordinary single doors vary and some are only roughly 40–60px wide, while command openings are wider. Uniform 64px door width is not achieved. See evidence/scale_overlay.png. |

## Other prompt checks and deviations

- **Icon gutters: FAIL.** Nine correct subjects appear in the requested row-major order on a transparent sheet, but a second cleanup generation still did not achieve 24px empty padding on every side of every equal cell. Alpha-threshold (>16) inspection found content at some cell boundaries. Do not assume safe uniform 3×3 slicing without checking the individual bounds.
- **Icon edge quality:** small red/yellow/cyan fringes remain around some silhouettes when inspected against a dark background. The alpha was preserved; no destructive key removal or manual repainting was applied.
- **World geography:** the five terrain families, east gorge, main west-flowing river, northern snow range, southern ochre plateaus and east mist are present. Coastline and relief remain an artistic approximation of the sketch, with more rugged coastal inlets. Farmland boundaries may read as small tracks; no explicit road network was requested or added.
- **World site clearance:** capital (795,510) includes trees/river edge within the full 80px area; north stronghold (710,207) contains pine/rock relief; canyon (600,335) is relatively open but has scattered terrain; free city (322,517) has trees and nearby riverbank; castle A (423,411) and B (433,651) include vegetation/relief; cathedral (760,785) is comparatively open with scattered rocks; monastery (975,853) is a cliff plateau rather than an uninterrupted flat clearing; village (1150,610) has vegetation; garrison (1200,545) is close to the gorge and has trees; forest trail (1240,470) is on a bank with nearby trees/rocks; bridge (1300,440), fortress (1361,363) and ridge (1310,290) include trees/relief; gate (1441,331) is flat but partially mist-covered. None is certified as a fully unobstructed 80px placement area.
- **Village raid:** main geometry is preserved; the scene includes some visible active flame in addition to smoke/smouldering damage. Ground paths are still readable. The inn's medical cross is a pictogram, not lettering.
- **Garrison palette:** warmer and greener than the requested muted teal-grey overcast direction; the correct service arrangement is retained.
- **Oath camp:** flame heraldry is repeated on ancillary banners as well as the central banner; each uses a flame pictogram without letters. The training area includes straw dummies and a rope enclosure.
- **Style:** all hubs use the generated daytime village as the style/camera anchor; requested original character references supplied the painterly contour/shading direction. No existing game, studio or unrelated character names were introduced into prompts.
- No WebP or other runtime conversions are included. Evidence and contact sheet are PNG.

## Generation record

Built-in image generation/editing was used throughout; no external image API or CLI fallback was used.

Initial generation order was exactly:
1. world_map
2. world_icons
3. hub_village_day
4. hub_village_raid
5. hub_garrison
6. hub_bivouac_night
7. hub_fortress
8. hub_oathcamp

The first world map received a targeted clearance edit before icons were generated. After the eight initial jobs, the map received one further clearance/parchment correction and the icons received one spacing/edge cleanup referencing that final map. World-map total: three generations/edits; icon-sheet total: two; each hub: one. No review approval is implied: anchor selections were made by the assistant's self-check.

Reference use:
- world_map: supplied world layout and Aren style; correction passes additionally referenced the preceding map.
- world_icons: selected map and Aren style; final cleanup additionally referenced preceding icons and the final map.
- village day: village layout, scale reference, Eric sprite sheet, Aren style.
- village raid: generated village day as edit target and supplied raid layout.
- remaining hubs: their respective layout, generated village day, scale reference and Eric sprite sheet.
- Eric portrait style reference was visually inspected; the listed job reference sets used Aren where specified.

All eight exact final prompt strings are in prompts_used/. Their reference-image order is described in each prompt. Superseded generations are not included.

## Processing and package verification

- Hub/map masters retained their generated 1536×1024 dimensions.
- Final icons were generated at 1254×1254 and proportionally resized to 1024×1024 with Lanczos, preserving RGBA. No stretching, cropping or padding was needed because both were square.
- No master was manually repainted. Python/Pillow was used only for the instructed size normalization, technical inspection, evidence composites, contact sheet, hashes and packaging.
- manifest.csv has one row per master: id,kind,path,width,height,bytes,sha256.
- SHA256SUMS.txt covers all pack files except itself, using paths relative to the pack root.
- Archive CRC integrity, master decoding, exact dimensions, manifest hashes and checksum entries are verified by the packaging script.

