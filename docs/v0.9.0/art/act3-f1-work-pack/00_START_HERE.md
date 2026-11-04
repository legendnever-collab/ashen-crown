# Ashen Crown — ACT III Part 1 Art Work Order (pack F1, v0.9.0)

You are producing finished game art for **Ashen Crown**, an original offline tactical RPG (Western medieval frontier fantasy). Read this whole file first, then work through the jobs in order and return the zips described in section 7.
ACT III takes the legion into the royal capital. This pack has three parts: **characters** (the chancellor, the old archivist and four battle-map figures), **places** (the capital's lower city, six rooms and their chests) and **one icon sheet** (eight new items).

## 1. Characters (12 images)

| # | file | who | size (px) | attach | prompt |
|---|---|---|---|---|---|
| 1 | `bust_bellard_neutral.png` | Marquess Bellard — Chancellor of the realm (재상 벨라드) | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png | `prompts/01_bust_bellard_neutral.txt` |
| 2 | `bust_bellard_concerned.png` | Marquess Bellard — Chancellor of the realm (재상 벨라드) | 1024×1280 | bust_bellard_neutral.png (your approved result) | `prompts/02_bust_bellard_concerned.txt` |
| 3 | `bust_bellard_determined.png` | Marquess Bellard — Chancellor of the realm (재상 벨라드) | 1024×1280 | bust_bellard_neutral.png (your approved result) | `prompts/03_bust_bellard_determined.txt` |
| 4 | `bust_bellard_sad.png` | Marquess Bellard — Chancellor of the realm (재상 벨라드) | 1024×1280 | bust_bellard_neutral.png (your approved result) | `prompts/04_bust_bellard_sad.txt` |
| 5 | `bust_archivist_neutral.png` | the old archivist of the royal archive (늙은 기록관) | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png | `prompts/05_bust_archivist_neutral.txt` |
| 6 | `bust_archivist_concerned.png` | the old archivist of the royal archive (늙은 기록관) | 1024×1280 | bust_archivist_neutral.png (your approved result) | `prompts/06_bust_archivist_concerned.txt` |
| 7 | `sprite_archivist.png` | the old archivist — map figure (civilian to protect, M15) | 1024×768 | bust_archivist_neutral.png (your approved result), ref_sprite_eric.png | `prompts/07_sprite_archivist.txt` |
| 8 | `sprite_bellard.png` | Marquess Bellard — map figure | 1024×768 | bust_bellard_neutral.png (your approved result), ref_sprite_eric.png | `prompts/08_sprite_bellard.txt` |
| 9 | `sprite_watchman.png` | royal watch guard (neutral, may turn hostile, M15) | 1024×768 | ref_sprite_ironSpear.png, style_aren_neutral.png | `prompts/09_sprite_watchman.txt` |
| 10 | `sprite_grayCloak.png` | grey cloak — chancellery agent (enemy, M15) | 1024×768 | ref_sprite_eric.png, style_aren_neutral.png | `prompts/10_sprite_grayCloak.txt` |
| 11 | `sprite_clerk.png` | chancellery clerk carrying a record box (fleeing target, M15) | 1024×768 | ref_sprite_eric.png, style_aren_neutral.png | `prompts/11_sprite_clerk.txt` |
| 12 | `sprite_harvester.png` | memory harvester (enemy, M16) | 1024×768 | ref_sprite_eric.png, style_aren_neutral.png | `prompts/12_sprite_harvester.txt` |

## 2. Places (8 images)

| # | id | file | size (px) | attach | prompt |
|---|---|---|---|---|---|
| 13 | `hub_capital` | `hub_capital.jpg` | 1536×1024 | layout_hub_capital.png, approved_hub_velmar.jpg (same footprint), scale_reference.png, sprite_eric_sheet.png, approved_hub_castletown.jpg | `prompts/13_hub_capital.txt` |
| 14 | `int_capital_tavern` | `int_capital_tavern.jpg` | 1536×1024 | layout_int_capital_tavern.png, scale_reference_interior.png, hub_capital.jpg (your approved result), approved_int_port_tavern.jpg | `prompts/14_int_capital_tavern.txt` |
| 15 | `int_capital_armory` | `int_capital_armory.jpg` | 1536×1024 | layout_int_capital_armory.png, scale_reference_interior.png, hub_capital.jpg (your approved result), int_capital_tavern.jpg (your approved result) | `prompts/15_int_capital_armory.txt` |
| 16 | `int_capital_apothecary` | `int_capital_apothecary.jpg` | 1536×1024 | layout_int_capital_apothecary.png, scale_reference_interior.png, hub_capital.jpg (your approved result), int_capital_tavern.jpg (your approved result) | `prompts/16_int_capital_apothecary.txt` |
| 17 | `int_capital_records` | `int_capital_records.jpg` | 1536×1024 | layout_int_capital_records.png, scale_reference_interior.png, hub_capital.jpg (your approved result), int_capital_tavern.jpg (your approved result) | `prompts/17_int_capital_records.txt` |
| 18 | `int_capital_house` | `int_capital_house.jpg` | 1536×1024 | layout_int_capital_house.png, scale_reference_interior.png, hub_capital.jpg (your approved result), int_capital_tavern.jpg (your approved result) | `prompts/18_int_capital_house.txt` |
| 19 | `int_capital_warehouse` | `int_capital_warehouse.jpg` | 1536×1024 | layout_int_capital_warehouse.png, scale_reference_interior.png, hub_capital.jpg (your approved result), int_capital_tavern.jpg (your approved result) | `prompts/19_int_capital_warehouse.txt` |
| 20 | `chests_capital` | `chests_capital.png` | 1024×512 | layout_chests_capital.png, approved_chests_act2.png, int_capital_tavern.jpg (your approved result) | `prompts/20_chests_capital.txt` |

## 3. Icon sheet (1 image, 8 icons)

| # | file | size (px) | attach | prompt |
|---|---|---|---|---|
| 21 | `icons_H.png` | 1024×1024 | layout_icons_H.png, approved_icons_B.png, approved_icons_D.png, style_aren_neutral.png, ref_ui_shop.jpg | `prompts/21_icons_H.txt` |

| cell | id | item |
|---|---|---|
| H01 | `royalSaber` | Royal Guard Saber (왕도 근위검) |
| H02 | `archiveBow` | Archive Longbow (기록원 장궁) |
| H03 | `wardRod` | Ward Rod (결계 지팡이) |
| H04 | `courtVestment` | Court Vestment (궁정 사제복) |
| H05 | `greyMantle` | Grey Mantle (회색 외투) |
| H06 | `oathRing` | Oath Ring (맹세의 반지) |
| H07 | `archivistLens` | Archivist's Lens (기록관의 확대경) |
| H08 | `mistLantern` | Lantern of Echoes (잔영의 등불) |

## 4. Global rules

- Characters: Painting style: match the attached approved art (style_aren_neutral.png, ref_bust_baldrick_neutral.png) — semi-realistic painted character art for a classic tactical RPG dialogue portrait: confident inked contour lines, painterly cel shading with soft gradients, strong warm rim light, rich saturated but slightly earthy colors, detailed metal and cloth textures, expressive mature faces (not chibi, not western cartoon, not photo-real). Original characters: do not copy any existing game's character, costume, emblem or logo.
- Places: Painting style: match the attached approved art (style_aren_neutral.png and the attached exterior hub map) — hand-painted fantasy illustration with confident contours, painterly cel shading with soft gradients, warm rim light, rich but slightly earthy colors, detailed but readable textures. Original world: do not imitate any existing game's rooms, furniture designs, emblems or layout.
- Icons: Painted game-item art in the same hand as the attached approved busts and chests: soft painterly rendering with visible but controlled brushwork, warm key light from the upper left, gentle rim light, rich but slightly muted Western medieval frontier colors, a subtle darker outline so the shape reads on dark UI. Objects in three-quarter view, centered, filling about 80% of their cell, every object fully inside its cell with an even margin. Each icon must still be recognisable at 40×40 px: one clear silhouette, strong value contrast, no tiny clutter. No text, letters, numbers, runes, emblems, crests, holy symbols or logos anywhere. No hands or people except the small abstract silhouettes named in a few skill icons.
- Never write the name of any existing game, character or studio in a prompt, and do not copy any existing artwork.
- **No text, letters, numbers, emblems, crests, holy symbols or logos** anywhere (clothing, shields, banners, books, seals, signs, crates, papers). Factions are told apart by colors only: the royal watch = brass, crimson and gold-yellow; the chancellery = deep plum with silver or thin gold; the grey cloaks = ash grey without any color; the memory harvesters = violet-black with lavender.
- Busts: exactly 1024×1280, transparent (or flat pure `#00FF00`), framed like `style_aren_neutral.png`, turned to the viewer's right.
- Sprite sheets: exactly 1024×768, 4 columns × 3 rows of 256 px cells (row 1 down, row 2 right, row 3 up; columns idle, step A, step B, attack), feet on a baseline 16 px above each cell bottom, transparent (or `#00FF00`). Match the scale of the attached `ref_sprite_*.png` (shown at half size).
- The town map and rooms follow the layout sketches (24×16 tiles of 64 px; rooms 12×8 tiles of 128 px). **The lower city keeps exactly the footprint of the attached `approved_hub_velmar.jpg`** (same building positions, doors, square, streets and the water strip on the left) — the game already walks on that layout; paint a different city on it. **No people and no animals** in the town and rooms; every enterable building shows one front door at its DOOR tile; CHEST and SHOPKEEPER tiles stay empty floor.
- The icon sheet: 4×4 cells of 256 px, cells 09–16 empty, every icon inside the 80 % safe square of its cell.
- Final sizes must be exact. Resize keeping the aspect ratio and pad or center-crop; never stretch.

## 5. Order of work

1. `bellard` neutral bust → concerned / determined / sad.
2. `archivist` neutral bust → concerned.
3. The six map sheets: `archivist` and `bellard` from their approved busts, then `watchman`, `grayCloak`, `clerk`, `harvester`. They must be told apart by color at small size: archivist = slate-blue robe with a brown satchel; Bellard = plum-black with silver; watch = brass and crimson with a gold shield; grey cloak = ash grey only; clerk = dark plum coat hugging a dark box; harvester = violet-black with a glowing violet orb.
4. `hub_capital` (style anchor of the capital) → its six rooms, `int_capital_tavern` first → `chests_capital`.
5. `icons_H.png`.

## 6. Self-check (record PASS/FAIL per item in QA_REPORT.md)

- [ ] 6 busts at exactly 1024×1280 and 6 sheets at exactly 1024×768; real transparency or pure `#00FF00` (say which per file).
- [ ] The hub and 6 rooms are exactly 1536×1024 RGB JPEG quality 92–95; `chests_capital.png` exactly 1024×512 PNG; `icons_H.png` exactly 1024×1024 PNG.
- [ ] No text, letters, emblems, holy symbols or logos anywhere. No people or animals in the hub and rooms.
- [ ] Each character's busts share the same face, outfit, framing and lighting; only the expression changes. Each sheet matches its bust.
- [ ] Each sheet: 12 frames in the right rows/columns, feet on one baseline, nothing cut at cell edges, row 2 faces RIGHT.
- [ ] The hub keeps the footprint of `approved_hub_velmar.jpg` (doors at the same DOOR tiles, the square open, the road at the bottom center, the canal on the left); rooms match their sketches; doorway at bottom-row tiles 5–6.
- [ ] Chest sheet: 4 chests, open cells lined up with closed cells, open chests empty.
- [ ] Icon sheet: 8 icons in cells 01–08, cells 09–16 fully transparent, same finish as the approved icon sheets.

## 7. Return format — **two zips, each under 20 MB**

- `Ashen_Crown_v090_ACT3_Art_Pack_F1_1.zip` — characters: 6 busts and 6 sheets
- `Ashen_Crown_v090_ACT3_Art_Pack_F1_2.zip` — `hub_capital.jpg`, 6 rooms, `chests_capital.png` and `icons_H.png`

```
Ashen_Crown_v090_ACT3_Art_Pack_F1_1/   (and _2 the same way)
  png/ or img/      # PNG masters for characters and icons (png/), JPEG/PNG for places (img/)
  manifest.csv      # characters: kind,id,expression,file,width,height,bytes,sha256 · places: id,kind,path,width,height,bytes,sha256 · icons: sheet,file,width,height,background,bytes,sha256
  SHA256SUMS.txt    # sha256  path
  QA_REPORT.md      # the checklist above for the files in this zip, generation notes, deviations
  contact_sheet.jpg # thumbnails with file names, JPEG under 1 MB
  prompts_used/     # the exact final prompt per image
```

- If a zip would exceed 20 MB, split it again (`_2a`, `_2b`), each with its own manifest and checksums. Do not include WebP.
- Reopen each zip and verify every file against its SHA256SUMS before finishing; report each zip's size.
- If an item cannot be met, still deliver your best image and state the deviation plainly in QA_REPORT.md. Do not claim a check passed unless you performed it.
