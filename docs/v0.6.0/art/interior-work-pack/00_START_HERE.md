# Ashen Crown — Building Interiors & Chests Art Work Order (v0.6.0)

You are producing finished game art for **Ashen Crown**, an original offline tactical RPG. Read this whole file first, then work through the jobs in order and return the zip described in section 5.
Everything you need is in this pack: `jobs.csv` (job list), `prompts/` (the full prompt for each job) and `references/` (images to attach).
When the player walks into a building on a town map, the game now shows a painted room. There are three families of rooms — a timber village, canvas army tents and an old stone fortress — and a sheet of treasure chests that suit each room.

## 1. Deliverables (16 images)

| # | id | file | size (px) | attach these references | prompt |
|---|---|---|---|---|---|
| 1 | `int_village_house` | `int_village_house.jpg` | 1536×1024 | layout_int_village_house.png, scale_reference_interior.png, exterior_village_day.jpg, style_aren_neutral.png | `prompts/01_int_village_house.txt` |
| 2 | `int_tent_soldier` | `int_tent_soldier.jpg` | 1536×1024 | layout_int_tent_soldier.png, scale_reference_interior.png, exterior_garrison.jpg, style_aren_neutral.png, int_village_house.jpg (your approved result) | `prompts/02_int_tent_soldier.txt` |
| 3 | `int_fort_barracks` | `int_fort_barracks.jpg` | 1536×1024 | layout_int_fort_barracks.png, scale_reference_interior.png, exterior_fortress.jpg, style_aren_neutral.png, int_village_house.jpg (your approved result) | `prompts/03_int_fort_barracks.txt` |
| 4 | `int_village_forge` | `int_village_forge.jpg` | 1536×1024 | layout_int_village_forge.png, scale_reference_interior.png, exterior_village_day.jpg, int_village_house.jpg (your approved result) | `prompts/04_int_village_forge.txt` |
| 5 | `int_village_shop` | `int_village_shop.jpg` | 1536×1024 | layout_int_village_shop.png, scale_reference_interior.png, exterior_village_day.jpg, int_village_house.jpg (your approved result) | `prompts/05_int_village_shop.txt` |
| 6 | `int_village_barracks` | `int_village_barracks.jpg` | 1536×1024 | layout_int_village_barracks.png, scale_reference_interior.png, exterior_village_day.jpg, int_village_house.jpg (your approved result) | `prompts/06_int_village_barracks.txt` |
| 7 | `int_village_hall` | `int_village_hall.jpg` | 1536×1024 | layout_int_village_hall.png, scale_reference_interior.png, exterior_village_day.jpg, int_village_house.jpg (your approved result) | `prompts/07_int_village_hall.txt` |
| 8 | `int_village_store` | `int_village_store.jpg` | 1536×1024 | layout_int_village_store.png, scale_reference_interior.png, exterior_village_day.jpg, int_village_house.jpg (your approved result) | `prompts/08_int_village_store.txt` |
| 9 | `int_tent_triage` | `int_tent_triage.jpg` | 1536×1024 | layout_int_tent_triage.png, scale_reference_interior.png, exterior_garrison.jpg, int_tent_soldier.jpg (your approved result) | `prompts/09_int_tent_triage.txt` |
| 10 | `int_tent_command` | `int_tent_command.jpg` | 1536×1024 | layout_int_tent_command.png, scale_reference_interior.png, exterior_garrison.jpg, int_tent_soldier.jpg (your approved result) | `prompts/10_int_tent_command.txt` |
| 11 | `int_tent_operations` | `int_tent_operations.jpg` | 1536×1024 | layout_int_tent_operations.png, scale_reference_interior.png, exterior_garrison.jpg, int_tent_soldier.jpg (your approved result) | `prompts/11_int_tent_operations.txt` |
| 12 | `int_tent_supply` | `int_tent_supply.jpg` | 1536×1024 | layout_int_tent_supply.png, scale_reference_interior.png, exterior_garrison.jpg, int_tent_soldier.jpg (your approved result) | `prompts/12_int_tent_supply.txt` |
| 13 | `int_fort_armory` | `int_fort_armory.jpg` | 1536×1024 | layout_int_fort_armory.png, scale_reference_interior.png, exterior_fortress.jpg, int_fort_barracks.jpg (your approved result) | `prompts/13_int_fort_armory.txt` |
| 14 | `int_fort_records` | `int_fort_records.jpg` | 1536×1024 | layout_int_fort_records.png, scale_reference_interior.png, exterior_fortress.jpg, int_fort_barracks.jpg (your approved result) | `prompts/14_int_fort_records.txt` |
| 15 | `int_fort_command` | `int_fort_command.jpg` | 1536×1024 | layout_int_fort_command.png, scale_reference_interior.png, exterior_fortress.jpg, int_fort_barracks.jpg (your approved result) | `prompts/15_int_fort_command.txt` |
| 16 | `chests_act1` | `chests_act1.png` | 1536×1024 | layout_chests.png, int_village_house.jpg, int_tent_soldier.jpg, int_fort_barracks.jpg (your approved results) | `prompts/16_chests_act1.txt` |

## 2. Global rules (apply to every image)

- Painting style: match the attached approved art (style_aren_neutral.png and the attached exterior hub map) — hand-painted fantasy illustration with confident contours, painterly cel shading with soft gradients, warm rim light, rich but slightly earthy colors, detailed but readable textures. Original world: do not imitate any existing game's rooms, furniture designs, emblems or layout.
- Never write the name of any existing game, character or studio in a prompt, and do not copy any existing artwork.
- **No text anywhere**: no lettering on signs, books, maps, banners or crates; no watermarks, signatures, UI, frames or grid lines. The game draws all labels itself in Korean.
- **No people and no animals** in the rooms. The game draws the characters (and the shopkeepers) on top.
- **Chest tiles stay empty.** The game draws the chests from `chests_act1.png`, so it can show them opened. Furniture crates and barrels elsewhere are fine.
- The layout sketches are composition guides on a 128 px grid. The painting does not have to snap to the grid, but every labelled area must stay in place, and the open floor and the doorway must stay clear.
- Every room has the same frame: back wall across the top two rows, thin side walls, no front wall, a 2-tile doorway at the bottom center (x 640–896).
- Final sizes must be exact. If the generator returns another size, resize (keeping the aspect ratio) and center-crop or pad to the exact size. Do not stretch.
- Generate each image individually. Regenerate when an image breaks a rule (text appears, people appear, a chest is painted into a chest tile, the doorway moves, the layout drifts).

## 3. Order of work

1. `int_village_house` — the **style anchor for every interior**. Attach `exterior_village_day.jpg` so the room matches the village outside.
2. `int_tent_soldier` — anchor of the tent family. Attach `exterior_garrison.jpg` and your `int_village_house.jpg`.
3. `int_fort_barracks` — anchor of the fortress family. Attach `exterior_fortress.jpg` and your `int_village_house.jpg`.
4. The other rooms of each family, each with its family anchor attached.
5. `chests_act1` — attach the three anchors. The open row must line up exactly with the closed row.

Room list (the game uses each room for these buildings; for your information):

| id | family | used for |
|---|---|---|
| `int_village_house` | village | village / village_raid: residence-3 (민가) |
| `int_village_forge` | village | village / village_raid: forge (대장간, 무기점) |
| `int_village_shop` | village | village / village_raid: shop (도구점) |
| `int_village_barracks` | village | village / village_raid: inn-1 (병영) |
| `int_village_hall` | village | village / village_raid: warroom-2 (지휘관 숙소 / elder's hall) |
| `int_village_store` | village | village / village_raid: depot-4 (보급 창고) |
| `int_tent_soldier` | tent | garrison inn-3 · bivouac inn-1, inn-3 · oathcamp inn-1, inn-3 (병사 천막) |
| `int_tent_triage` | tent | garrison inn-1 (구호 천막 · TRIAGE) |
| `int_tent_command` | tent | garrison · bivouac · oathcamp warroom-2 (지휘 천막) |
| `int_tent_operations` | tent | garrison · bivouac · oathcamp warroom-4 (작전 천막) |
| `int_tent_supply` | tent | garrison · bivouac · oathcamp depot-5 (보급 천막) |
| `int_fort_barracks` | fortress | fortress inn-1, inn-3 (병영 · 병영 별채) |
| `int_fort_armory` | fortress | fortress depot-5 (무기고 · ARMORY) |
| `int_fort_records` | fortress | fortress warroom-2 (기록실 · RECORDS HALL) |
| `int_fort_command` | fortress | fortress warroom-4 (지휘관 숙소 · COMMAND QUARTERS) |

## 4. Self-check before packaging (record the result of each item in QA_REPORT.md)

- [ ] 15 interiors: exactly 1536×1024, RGB JPEG quality 92–95. `chests_act1.png`: exactly 1536×1024 PNG with real transparency, or a pure `#00FF00` background (say which).
- [ ] No text, letters, numbers, emblems, watermarks or UI anywhere. Zoom in on books, maps, banners and crates.
- [ ] No people or animals in the rooms.
- [ ] Each room matches its layout sketch: furniture in its boxes, open floor clear, doorway at bottom-row tiles 5–6, back wall across the top two rows.
- [ ] Every CHEST tile and SHOPKEEPER tile is empty floor.
- [ ] Each family looks like one place (same walls, floor and light as its anchor), and matches its exterior hub map.
- [ ] Chest sheet: 12 different chests, each OPEN cell lined up with its CLOSED cell (include an evidence image blending row 1 over row 2 at 50%), open chests empty.
- [ ] Scale fits `scale_reference_interior.png` (adult about 130 px, chest about 1 tile).

## 5. Return format — one zip **under 20 MB**: `Ashen_Crown_v060_Interior_Art_Pack.zip`

```
Ashen_Crown_v060_Interior_Art_Pack/
  img/int_village_house.jpg  img/int_village_forge.jpg  ... (all 15 rooms, JPEG)
  img/chests_act1.png
  manifest.csv        # id,kind,path,width,height,bytes,sha256   (one row per image; kind = interior or chests)
  SHA256SUMS.txt      # sha256  path
  QA_REPORT.md        # the checklist above with PASS/FAIL, generation notes, any deviations
  contact_sheet.jpg   # all 16 images as thumbnails with their ids (JPEG, under 1 MB)
  evidence/chests_open_closed_blend.jpg   # JPEG, under 1 MB
  prompts_used/       # the exact final prompt text used for each image (txt)
```

- **Size limit:** the whole zip must be under 20 MB, because larger uploads get cut off. If it would exceed 20 MB, split it into `Ashen_Crown_v060_Interior_Art_Pack_A1.zip` (village + tent rooms) and `Ashen_Crown_v060_Interior_Art_Pack_A2.zip` (fortress rooms + chests), each with its own manifest and checksums.
- Do not include WebP or other runtime conversions. The game team converts the masters.
- Before finishing, reopen the zip you produced and verify every file against SHA256SUMS. Report the final zip size(s) in the reply.
- If an item cannot be met, still deliver your best image, and state the deviation plainly in QA_REPORT.md. Do not claim a check passed unless you performed it.
