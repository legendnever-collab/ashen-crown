# Ashen Crown — ACT II Towns, Rooms & Chests Art Work Order (v0.6.0)

You are producing finished game art for **Ashen Crown**, an original offline tactical RPG. Read this whole file first, then work through the jobs in order and return the zip described in section 5.
Two new walkable town maps for ACT II — a snowy castle town of the northern Iron Crown Dominion and the market quarter of Velmar, a free port city — the rooms inside their buildings, and a sheet of chests that suit those rooms.

## 1. Deliverables (15 images)

| # | id | file | size (px) | attach | prompt |
|---|---|---|---|---|---|
| 1 | `hub_castletown` | `hub_castletown.jpg` | 1536×1024 | layout_hub_castletown.png, scale_reference.png, sprite_eric_sheet.png, approved_hub_village_day.jpg, approved_hub_fortress.jpg | `prompts/01_hub_castletown.txt` |
| 2 | `int_north_inn` | `int_north_inn.jpg` | 1536×1024 | layout_int_north_inn.png, scale_reference_interior.png, hub_castletown.jpg (your approved result), approved_int_village_house.jpg | `prompts/02_int_north_inn.txt` |
| 3 | `int_north_smithy` | `int_north_smithy.jpg` | 1536×1024 | layout_int_north_smithy.png, scale_reference_interior.png, hub_castletown.jpg (your approved result), int_north_inn.jpg (your approved result) | `prompts/03_int_north_smithy.txt` |
| 4 | `int_north_provisioner` | `int_north_provisioner.jpg` | 1536×1024 | layout_int_north_provisioner.png, scale_reference_interior.png, hub_castletown.jpg (your approved result), int_north_inn.jpg (your approved result) | `prompts/04_int_north_provisioner.txt` |
| 5 | `int_north_office` | `int_north_office.jpg` | 1536×1024 | layout_int_north_office.png, scale_reference_interior.png, hub_castletown.jpg (your approved result), int_north_inn.jpg (your approved result) | `prompts/05_int_north_office.txt` |
| 6 | `int_north_house` | `int_north_house.jpg` | 1536×1024 | layout_int_north_house.png, scale_reference_interior.png, hub_castletown.jpg (your approved result), int_north_inn.jpg (your approved result) | `prompts/06_int_north_house.txt` |
| 7 | `int_north_store` | `int_north_store.jpg` | 1536×1024 | layout_int_north_store.png, scale_reference_interior.png, hub_castletown.jpg (your approved result), int_north_inn.jpg (your approved result) | `prompts/07_int_north_store.txt` |
| 8 | `hub_velmar` | `hub_velmar.jpg` | 1536×1024 | layout_hub_velmar.png, scale_reference.png, sprite_eric_sheet.png, approved_hub_village_day.jpg, approved_hub_fortress.jpg, hub_castletown.jpg (your approved result) | `prompts/08_hub_velmar.txt` |
| 9 | `int_port_tavern` | `int_port_tavern.jpg` | 1536×1024 | layout_int_port_tavern.png, scale_reference_interior.png, hub_velmar.jpg (your approved result), approved_int_village_house.jpg | `prompts/09_int_port_tavern.txt` |
| 10 | `int_port_armory` | `int_port_armory.jpg` | 1536×1024 | layout_int_port_armory.png, scale_reference_interior.png, hub_velmar.jpg (your approved result), int_port_tavern.jpg (your approved result) | `prompts/10_int_port_armory.txt` |
| 11 | `int_port_apothecary` | `int_port_apothecary.jpg` | 1536×1024 | layout_int_port_apothecary.png, scale_reference_interior.png, hub_velmar.jpg (your approved result), int_port_tavern.jpg (your approved result) | `prompts/11_int_port_apothecary.txt` |
| 12 | `int_port_council` | `int_port_council.jpg` | 1536×1024 | layout_int_port_council.png, scale_reference_interior.png, hub_velmar.jpg (your approved result), int_port_tavern.jpg (your approved result) | `prompts/12_int_port_council.txt` |
| 13 | `int_port_house` | `int_port_house.jpg` | 1536×1024 | layout_int_port_house.png, scale_reference_interior.png, hub_velmar.jpg (your approved result), int_port_tavern.jpg (your approved result) | `prompts/13_int_port_house.txt` |
| 14 | `int_port_warehouse` | `int_port_warehouse.jpg` | 1536×1024 | layout_int_port_warehouse.png, scale_reference_interior.png, hub_velmar.jpg (your approved result), int_port_tavern.jpg (your approved result) | `prompts/14_int_port_warehouse.txt` |
| 15 | `chests_act2` | `chests_act2.png` | 1024×1024 | layout_chests_act2.png, approved_chests_act1.png if you have it, int_north_inn.jpg, int_port_tavern.jpg (your approved results) | `prompts/15_chests_act2.txt` |

## 2. Global rules

- Painting style: match the attached approved art (style_aren_neutral.png and the attached exterior hub map) — hand-painted fantasy illustration with confident contours, painterly cel shading with soft gradients, warm rim light, rich but slightly earthy colors, detailed but readable textures. Original world: do not imitate any existing game's rooms, furniture designs, emblems or layout.
- Never write the name of any existing game, character or studio in a prompt, and do not copy any existing artwork.
- **No text anywhere** (signs, banners, books, maps, crates) and **no emblems or crests**. No watermarks, UI, frames or grid lines.
- **No people and no animals** in the town maps and rooms (gulls far out at sea are fine). The game draws the characters.
- Town maps follow the 24×16-tile / 64 px layout sketches, like the approved hubs (`approved_hub_*.jpg`). Every enterable building shows one front door at its DOOR tile.
- Rooms follow the 12×8-tile / 128 px layout sketches and the same frame as the approved village house (`approved_int_village_house.jpg`, if attached): back wall across the top two rows, thin side walls, no front wall, a 2-tile doorway at the bottom center (x 640–896). **CHEST tiles and SHOPKEEPER tiles stay empty floor.**
- Final sizes must be exact. Resize keeping the aspect ratio and center-crop or pad; never stretch.

## 3. Order of work

1. `hub_castletown` — style anchor of the north. 2. its six rooms, `int_north_inn` first (the anchor of those rooms).
3. `hub_velmar` — attach your castle town too. 4. its six rooms, `int_port_tavern` first.
5. `chests_act2` — eight chests, closed and open, open row lined up exactly with the closed row.

If `approved_int_village_house.jpg` / `approved_chests_act1.png` are not in references/ (the ACT I interiors may still be in progress), use `scale_reference_interior.png` and the layout sketches alone.

## 4. Self-check (record PASS/FAIL per item in QA_REPORT.md)

- [ ] 2 town maps and 12 rooms: exactly 1536×1024 RGB JPEG quality 92–95. `chests_act2.png`: exactly 1024×1024 PNG, real transparency or pure `#00FF00` (say which).
- [ ] No text, letters, numbers, emblems, crests, watermarks or UI. Zoom in on signs, banners, ships and crates.
- [ ] No people or animals.
- [ ] Town maps match their sketches: buildings in place, one door per enterable building at its DOOR tile, plaza/square open, streets at least 2 tiles wide, road at the bottom center; Velmar's harbor along the left edge.
- [ ] Rooms match their sketches; doorway at bottom-row tiles 5–6; CHEST and SHOPKEEPER tiles empty.
- [ ] Each town's rooms match that town (snowy dark stone and timber / whitewashed port).
- [ ] Chest sheet: 8 different chests, open cells lined up with closed cells (evidence image blending rows 1 and 2 at 50%), open chests empty.

## 5. Return format — one zip **under 20 MB**: `Ashen_Crown_v060_ACT2_Hub_Art_Pack.zip`

```
Ashen_Crown_v060_ACT2_Hub_Art_Pack/
  img/hub_castletown.jpg  img/hub_velmar.jpg  img/int_north_*.jpg (6)  img/int_port_*.jpg (6)  img/chests_act2.png
  manifest.csv        # id,kind,path,width,height,bytes,sha256   (kind = hub, interior or chests)
  SHA256SUMS.txt
  QA_REPORT.md
  contact_sheet.jpg   # thumbnails with ids, JPEG under 1 MB
  evidence/chests_open_closed_blend.jpg
  prompts_used/
```

- If the zip would exceed 20 MB, split it into `Ashen_Crown_v060_ACT2_Hub_Art_Pack_C1.zip` (castle town + its rooms) and `Ashen_Crown_v060_ACT2_Hub_Art_Pack_C2.zip` (Velmar + its rooms + chests), each with its own manifest and checksums.
- Do not include WebP. Reopen the zip(s) and verify every file against SHA256SUMS before finishing; report the final sizes.
- If an item cannot be met, still deliver your best image and state the deviation plainly in QA_REPORT.md. Do not claim a check passed unless you performed it.
