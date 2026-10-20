# Ashen Crown — World Art Work Order, Part 2 (v0.5.0)

This is a follow-up to the earlier world/hub work order. The earlier return zip was cut off during upload (it arrived truncated at 25.19 MB).
Four hub maps arrived intact and are approved: hub_garrison, hub_bivouac_night, hub_fortress, hub_oathcamp. **Do not redo or include them.**
Only the four images below are needed.

| # | id | file | size (px) | final image reported earlier: SHA256 · bytes | prompt |
|---|---|---|---|---|---|
| 1 | `world_map` | `world_map.png` | 1536×1024 | `af31a6b35846b683…` · 3,855,413 | `prompts/01_world_map.txt` |
| 2 | `world_icons` | `world_icons.png` | 1024×1024 | `7f6ddc8030e17ef3…` · 1,613,245 | `prompts/02_world_icons.txt` |
| 3 | `hub_village_day` | `hub_village_day.png` | 1536×1024 | `f1b5d45d936aa06a…` · 3,723,455 | `prompts/03_hub_village_day.txt` |
| 4 | `hub_village_raid` | `hub_village_raid.png` | 1536×1024 | `f448c3fdce020d4c…` · 3,511,292 | `prompts/04_hub_village_raid.txt` |

## 1. Path A — repackage (preferred)
If the final files from the earlier run are still available in this conversation or your workspace, **do not regenerate**.
Instead, verify that each one has exactly this SHA256 and package it:

```
af31a6b35846b683e9ba7f5b3c4c8ddff2621d1a726403a619d1a7214e4e5f24  png/world_map.png
7f6ddc8030e17ef3984f6e7f2def00d4797206ae1f511a7627c9a0da2e46d285  png/world_icons.png
f1b5d45d936aa06a0d44a83bfd0ce2ab6ad1fd9f014d50da8392d8c966a85d26  png/hub_village_day.png
f448c3fdce020d4ce79a3b896342fa4ec93c74d9d3879ce0289ae623d6b681d0  png/hub_village_raid.png
```

Use Path A per file. Any file that is missing or has a different hash goes through Path B.

## 2. Path B — regenerate
Use `prompts/01–04_*.txt` and attach the listed references from `references/`. The global rules of the first work order still apply:

- Painting style: match the attached approved character art (style_aren_neutral.png, style_eric_neutral.png) — hand-painted fantasy illustration with confident contours, painterly cel shading with soft gradients, warm rim light, rich but slightly earthy colors, detailed but readable textures. Original world: do not imitate any existing game's map, town, emblem or layout.
- **No text anywhere in the images**: no place names, sign lettering, legends, watermarks, UI or frames.
- Village maps contain **no people and no animals**. The game places walking characters on top.
- The layout sketches use a 64 px grid. Labelled areas stay in place, and paths and the square stay wide and clear.
- Final sizes must be exact. Resize keeping the aspect ratio, then center-crop or pad. Never stretch.
- The four `references/approved_*.jpg` images are the already-approved hub maps. New images must look like the same game.
- Generation order: `world_map` → `world_icons` (attach your final map) → `hub_village_day` → `hub_village_raid` (an edit of your final village).

World-map site positions that must stay clear (x, y on 1536×1024):

| site | x | y |
|---|---|---|
| royal capital (center) | 795 | 510 |
| northern stronghold | 710 | 207 |
| grey canyon mouth | 600 | 335 |
| free city on the west coast | 322 | 517 |
| lord castle A | 423 | 411 |
| lord castle B | 433 | 651 |
| cathedral (south) | 760 | 785 |
| cliff monastery (south coast) | 975 | 853 |
| border village | 1150 | 610 |
| border garrison camp | 1200 | 545 |
| forest trail | 1240 | 470 |
| broken bridge over the gorge | 1300 | 440 |
| abandoned hill fortress | 1361 | 363 |
| border ridge | 1310 | 290 |
| border gate in the wall | 1441 | 331 |

## 3. Self-check (write the results in QA_REPORT.md; only claim what you actually checked)

- [ ] 4 PNGs, exact sizes, all decode. `world_icons` is RGBA with real transparency.
- [ ] For each file, state Path A (hash matched) or Path B (regenerated).
- [ ] No text, letters, numbers, watermarks or UI. No people in the village maps.
- [ ] Path B only: world-map sites are clear, icon cells have ≥24 px empty margins, and raid/day building outlines align (attach a 50% blend).

## 4. Return format — one zip under 20 MB: `Ashen_Crown_v050_World_Art_Pack_Part2.zip`

```
Ashen_Crown_v050_World_Art_Pack_Part2/
  png/world_map.png  png/world_icons.png  png/hub_village_day.png  png/hub_village_raid.png
  manifest.csv        # id,kind,path,width,height,bytes,sha256  (4 rows)
  SHA256SUMS.txt
  QA_REPORT.md
  contact_sheet.jpg   # small JPEG preview of the 4 images
  evidence/           # JPEG only, each under 1 MB (e.g. raid_vs_day_blend.jpg) — Path B only
  prompts_used/       # Path B only
```

- **Size limit:** the whole zip must be under 20 MB, because the earlier 25 MB zip was cut off in upload.
  - Keep the four masters as PNG. Make all evidence and previews JPEG.
  - If the zip would still exceed 20 MB, split it into `…_Part2a.zip` (world_map, world_icons) and `…_Part2b.zip` (both village maps). Each part gets its own manifest and checksums.
- Before finishing, reopen the zip you produced and verify every file against SHA256SUMS. Report the final zip size in the reply.
