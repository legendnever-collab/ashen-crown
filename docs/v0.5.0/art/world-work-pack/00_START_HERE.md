# Ashen Crown — World Map & Hub Art Work Order (v0.5.0)

You are producing finished game art for **Ashen Crown**, an original offline tactical RPG. Read this whole file first, then work through the jobs in order and return ONE zip file.
Everything you need is in this pack: `jobs.csv` (job list), `prompts/` (the full image prompt for each job) and `references/` (images to attach as references).

## 1. Deliverables (8 images)

| # | id | file | size (px) | attach these references | prompt |
|---|---|---|---|---|---|
| 1 | `world_map` | `world_map.png` | 1536×1024 | layout_world_map.png, style_aren_neutral.png | `prompts/01_world_map.txt` |
| 2 | `world_icons` | `world_icons.png` | 1024×1024 | world_map.png (your approved result), style_aren_neutral.png | `prompts/02_world_icons.txt` |
| 3 | `hub_village_day` | `hub_village_day.png` | 1536×1024 | layout_hub_village.png, scale_reference.png, sprite_eric_sheet.png, style_aren_neutral.png | `prompts/03_hub_village_day.txt` |
| 4 | `hub_village_raid` | `hub_village_raid.png` | 1536×1024 | hub_village_day.png (your approved result), layout_hub_village_raid.png | `prompts/04_hub_village_raid.txt` |
| 5 | `hub_garrison` | `hub_garrison.png` | 1536×1024 | layout_hub_garrison.png, hub_village_day.png, scale_reference.png, sprite_eric_sheet.png | `prompts/05_hub_garrison.txt` |
| 6 | `hub_bivouac_night` | `hub_bivouac_night.png` | 1536×1024 | layout_hub_bivouac.png, hub_village_day.png, scale_reference.png, sprite_eric_sheet.png | `prompts/06_hub_bivouac_night.txt` |
| 7 | `hub_fortress` | `hub_fortress.png` | 1536×1024 | layout_hub_fortress.png, hub_village_day.png, scale_reference.png, sprite_eric_sheet.png | `prompts/07_hub_fortress.txt` |
| 8 | `hub_oathcamp` | `hub_oathcamp.png` | 1536×1024 | layout_hub_oathcamp.png, hub_village_day.png, scale_reference.png, sprite_eric_sheet.png | `prompts/08_hub_oathcamp.txt` |

## 2. Global rules (apply to every image)

- Painting style: match the attached approved character art (style_aren_neutral.png, style_eric_neutral.png) — hand-painted fantasy illustration with confident contours, painterly cel shading with soft gradients, warm rim light, rich but slightly earthy colors, detailed but readable textures. Original world: do not imitate any existing game's map, town, emblem or layout.
- Never write the name of any existing game, character or studio in a prompt, and do not copy any existing artwork.
- **No text anywhere in the images**: no place names, sign lettering, legends, watermarks, signatures, UI or frames. The game draws all labels itself in Korean.
- Hub maps contain **no people** (two horses in the night camp are allowed). The game places walking characters on top.
- The layout sketches are composition guides on a 64 px grid. The painting does not have to snap to the grid, but every labelled area must stay in place, and paths and open areas must stay wide and uncluttered.
- Final sizes must be exact. If the generator returns another size, resize (keeping the aspect ratio) and center-crop or pad to the exact size. Do not stretch.
- Generate each image individually. Regenerate when an image breaks a rule (text appears, people appear, layout drifts, wrong time of day).

## 3. Order of work

1. `world_map` — compare it with `references/layout_world_map.png`. Coastline, regions, river and mountain range must match the sketch.
   The following positions (x, y on the 1536×1024 map) must stay clear, fairly flat ground about 80 px across, with no painted buildings:

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

2. `world_icons` — attach your final `world_map.png` as the style anchor.
3. `hub_village_day` — this becomes the **style anchor for all hubs**. Attach it to every later hub job.
4. `hub_village_raid` — **edit** `hub_village_day.png` instead of generating from scratch. The layout must stay identical.
5. `hub_garrison`, `hub_bivouac_night`, `hub_fortress`, `hub_oathcamp`.

## 4. Self-check before packaging (record the result of each item in QA_REPORT.md)

- [ ] 8 PNG files, exact sizes, all decode, RGB or RGBA. `world_icons` has real transparency, or a pure `#00FF00` background that is noted in the report.
- [ ] No text, letters, numbers, watermarks or UI in any image. Zoom in and check signs and banners.
- [ ] No people in the hub maps.
- [ ] Each hub matches its layout sketch: shop and service areas are in the labelled places, the center is open, and the entrance is at the bottom center.
- [ ] `hub_village_raid` overlays `hub_village_day` with the same buildings and paths (include a 50% blend image as evidence).
- [ ] Night and dusk scenes keep the ground readable.
- [ ] The world map keeps the listed site positions clear.
- [ ] The scale fits `scale_reference.png`: a 64 px doorway, an adult about 60–70 px tall.

## 5. Return format — one zip: `Ashen_Crown_v050_World_Art_Pack.zip`

```
Ashen_Crown_v050_World_Art_Pack/
  png/world_map.png
  png/world_icons.png
  png/hub_village_day.png  png/hub_village_raid.png  png/hub_garrison.png
  png/hub_bivouac_night.png  png/hub_fortress.png  png/hub_oathcamp.png
  manifest.csv        # id,kind,path,width,height,bytes,sha256   (one row per PNG)
  SHA256SUMS.txt      # sha256  path
  QA_REPORT.md        # the checklist above with PASS/FAIL, generation notes, any deviations
  contact_sheet.png   # all 8 images as thumbnails with their ids, for quick review
  evidence/raid_vs_day_blend.png
  prompts_used/       # the exact final prompt text used for each image (txt)
```

- Do not include WebP or other runtime conversions. The game team converts the PNG masters.
- The `kind` column takes one of `world`, `icons` or `hub`. Paths are relative to the pack root.
- If an item cannot be met, still deliver your best image, and state the deviation plainly in QA_REPORT.md. Do not claim a check passed unless you performed it.
