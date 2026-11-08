# Ashen Crown — ACT III Part 2 Art Work Order (pack F2, v0.9.1)

You are producing finished game art for **Ashen Crown**, an original offline tactical RPG (Western medieval frontier fantasy). Read this whole file first, then work through the jobs part by part and return the zips described in section 8.
The game already plays with temporary game-drawn art for everything in this pack. It has **58 images in four parts** (A–D). The user may order one part at a time: **do only the parts the user asks for**, in the order A → B → D → C unless told otherwise, and return each part as its own zip(s).

| part | what | images |
|---|---|---:|
| **A** | places and things — the keep, the forest village and its six rooms, forest chests, icon sheet I, battle props | 11 |
| **B** | the awakened looks of Erik, Elina and Sain | 15 |
| **C** | the recruits' tier 2 looks of Thea, Dario and Ines | 15 |
| **D** | the people of the keep and the forest, the M16 knight-captains, three map figures | 17 |
| | total | **58** |

## 1. Part A — places and things (11 images)

| # | file | what | size (px) | attach | prompt |
|---|---|---|---|---|---|
| 1 | `hub_forest.jpg` | hub_forest | 1536×1024 | layout_hub_village.png, approved_hub_village_day.jpg (same footprint), approved_hub_capital.jpg (latest style), scale_reference.png, sprite_eric_sheet.png | `prompts/01_hub_forest.txt` |
| 2 | `int_forest_longhouse.jpg` | int_forest_longhouse | 1536×1024 | layout_int_forest_longhouse.png, scale_reference_interior.png, hub_forest.jpg (your approved result), approved_int_village_barracks.jpg (same room footprint), approved_int_capital_tavern.jpg | `prompts/02_int_forest_longhouse.txt` |
| 3 | `int_forest_bowyer.jpg` | int_forest_bowyer | 1536×1024 | layout_int_forest_bowyer.png, scale_reference_interior.png, hub_forest.jpg (your approved result), approved_int_village_forge.jpg (same room footprint), int_forest_longhouse.jpg (your approved result) | `prompts/03_int_forest_bowyer.txt` |
| 4 | `int_forest_herbalist.jpg` | int_forest_herbalist | 1536×1024 | layout_int_forest_herbalist.png, scale_reference_interior.png, hub_forest.jpg (your approved result), approved_int_village_shop.jpg (same room footprint), int_forest_longhouse.jpg (your approved result) | `prompts/04_int_forest_herbalist.txt` |
| 5 | `int_forest_lodge.jpg` | int_forest_lodge | 1536×1024 | layout_int_forest_lodge.png, scale_reference_interior.png, hub_forest.jpg (your approved result), approved_int_village_hall.jpg (same room footprint), int_forest_longhouse.jpg (your approved result) | `prompts/05_int_forest_lodge.txt` |
| 6 | `int_forest_house.jpg` | int_forest_house | 1536×1024 | layout_int_forest_house.png, scale_reference_interior.png, hub_forest.jpg (your approved result), approved_int_village_house.jpg (same room footprint), int_forest_longhouse.jpg (your approved result) | `prompts/06_int_forest_house.txt` |
| 7 | `int_forest_store.jpg` | int_forest_store | 1536×1024 | layout_int_forest_store.png, scale_reference_interior.png, hub_forest.jpg (your approved result), approved_int_village_store.jpg (same room footprint), int_forest_longhouse.jpg (your approved result) | `prompts/07_int_forest_store.txt` |
| 8 | `chests_forest.png` | chests_forest | 1024×512 | layout_chests_forest.png, approved_chests_act2.png, int_forest_longhouse.jpg (your approved result) | `prompts/08_chests_forest.txt` |
| 9 | `hub_keep.jpg` | hub_keep | 1536×1024 | layout_hub_fortress.png, approved_hub_fortress.jpg (same footprint), approved_hub_capital.jpg (latest style), scale_reference.png, sprite_eric_sheet.png | `prompts/09_hub_keep.txt` |
| 10 | `props_act3b.png` | props_act3b | 1024×256 | layout_props_act3b.png, ref_sprite_eric.png, ref_sprite_ironSpear.png, ref_battle_m17.jpg, ref_battle_m18.jpg | `prompts/10_props_act3b.txt` |

Plus job 11: `icons_I.png` (1024×1024, attach layout_icons_I.png, approved_icons_B.png, approved_icons_D.png, approved_icons_H.png, style_aren_neutral.png, ref_ui_shop.jpg, prompt `prompts/11_icons_I.txt`).

| cell | id | icon |
|---|---|---|
| I01 | `oathWall` | Wall of the Oath (맹세의 성벽) |
| I02 | `blockade` | Blockade (퇴로 봉쇄) |
| I03 | `dawnPrayer` | Dawn Prayer (새벽의 기도) |
| I04 | `oathBadge` | Badge of the Oath (맹세의 휘장) |
| I05 | `groveLeaf` | Leaf of the Ward Tree (고목의 잎) |
| I06 | `potion` | Basic Potion (기본 회복약) |

## 2. Part B — awakened looks (15 images)

| # | file | what | size (px) | attach | prompt |
|---|---|---|---|---|---|
| 12 | `bust_eric_t3_neutral.png` | Erik — Oath Guardian (에릭 · 맹세의 수호자, awakened) | 1024×1280 | ref_bust_eric_t2_neutral.png, style_aren_neutral.png | `prompts/12_bust_eric_t3_neutral.txt` |
| 13 | `bust_eric_t3_concerned.png` | Erik — Oath Guardian (에릭 · 맹세의 수호자, awakened) | 1024×1280 | bust_eric_t3_neutral.png (your approved result) | `prompts/13_bust_eric_t3_concerned.txt` |
| 14 | `bust_eric_t3_determined.png` | Erik — Oath Guardian (에릭 · 맹세의 수호자, awakened) | 1024×1280 | bust_eric_t3_neutral.png (your approved result) | `prompts/14_bust_eric_t3_determined.txt` |
| 15 | `bust_eric_t3_sad.png` | Erik — Oath Guardian (에릭 · 맹세의 수호자, awakened) | 1024×1280 | bust_eric_t3_neutral.png (your approved result) | `prompts/15_bust_eric_t3_sad.txt` |
| 16 | `bust_elina_t3_neutral.png` | Elina — Hawk Archer (엘리나 · 매의 사수, awakened) | 1024×1280 | ref_bust_elina_t2_neutral.png, style_aren_neutral.png | `prompts/16_bust_elina_t3_neutral.txt` |
| 17 | `bust_elina_t3_concerned.png` | Elina — Hawk Archer (엘리나 · 매의 사수, awakened) | 1024×1280 | bust_elina_t3_neutral.png (your approved result) | `prompts/17_bust_elina_t3_concerned.txt` |
| 18 | `bust_elina_t3_determined.png` | Elina — Hawk Archer (엘리나 · 매의 사수, awakened) | 1024×1280 | bust_elina_t3_neutral.png (your approved result) | `prompts/18_bust_elina_t3_determined.txt` |
| 19 | `bust_elina_t3_sad.png` | Elina — Hawk Archer (엘리나 · 매의 사수, awakened) | 1024×1280 | bust_elina_t3_neutral.png (your approved result) | `prompts/19_bust_elina_t3_sad.txt` |
| 20 | `bust_sain_t3_neutral.png` | Sain — Dawn Priest (세인 · 새벽 사제, awakened) | 1024×1280 | ref_bust_sain_t2_neutral.png, style_aren_neutral.png | `prompts/20_bust_sain_t3_neutral.txt` |
| 21 | `bust_sain_t3_concerned.png` | Sain — Dawn Priest (세인 · 새벽 사제, awakened) | 1024×1280 | bust_sain_t3_neutral.png (your approved result) | `prompts/21_bust_sain_t3_concerned.txt` |
| 22 | `bust_sain_t3_determined.png` | Sain — Dawn Priest (세인 · 새벽 사제, awakened) | 1024×1280 | bust_sain_t3_neutral.png (your approved result) | `prompts/22_bust_sain_t3_determined.txt` |
| 23 | `bust_sain_t3_sad.png` | Sain — Dawn Priest (세인 · 새벽 사제, awakened) | 1024×1280 | bust_sain_t3_neutral.png (your approved result) | `prompts/23_bust_sain_t3_sad.txt` |
| 24 | `sprite_eric_t3.png` | Erik — Oath Guardian (에릭 · 맹세의 수호자, awakened) | 1024×768 | bust_eric_t3_neutral.png (your approved result), ref_sprite_eric_t2.png, ref_sprite_eric.png | `prompts/24_sprite_eric_t3.txt` |
| 25 | `sprite_elina_t3.png` | Elina — Hawk Archer (엘리나 · 매의 사수, awakened) | 1024×768 | bust_elina_t3_neutral.png (your approved result), ref_sprite_elina_t2.png, ref_sprite_eric.png | `prompts/25_sprite_elina_t3.txt` |
| 26 | `sprite_sain_t3.png` | Sain — Dawn Priest (세인 · 새벽 사제, awakened) | 1024×768 | bust_sain_t3_neutral.png (your approved result), ref_sprite_sain_t2.png, ref_sprite_eric.png | `prompts/26_sprite_sain_t3.txt` |

## 3. Part C — recruits' tier 2 looks (15 images)

| # | file | what | size (px) | attach | prompt |
|---|---|---|---|---|---|
| 27 | `bust_thea_t2_neutral.png` | Thea — Black Iron Lancer (테아 · 흑철 창기사, tier 2) | 1024×1280 | ref_bust_thea_neutral.png, style_aren_neutral.png | `prompts/27_bust_thea_t2_neutral.txt` |
| 28 | `bust_thea_t2_concerned.png` | Thea — Black Iron Lancer (테아 · 흑철 창기사, tier 2) | 1024×1280 | bust_thea_t2_neutral.png (your approved result) | `prompts/28_bust_thea_t2_concerned.txt` |
| 29 | `bust_thea_t2_determined.png` | Thea — Black Iron Lancer (테아 · 흑철 창기사, tier 2) | 1024×1280 | bust_thea_t2_neutral.png (your approved result) | `prompts/29_bust_thea_t2_determined.txt` |
| 30 | `bust_thea_t2_sad.png` | Thea — Black Iron Lancer (테아 · 흑철 창기사, tier 2) | 1024×1280 | bust_thea_t2_neutral.png (your approved result) | `prompts/30_bust_thea_t2_sad.txt` |
| 31 | `bust_dario_t2_neutral.png` | Dario — Sword Saint (다리오 · 검성, tier 2) | 1024×1280 | ref_bust_dario_neutral.png, style_aren_neutral.png | `prompts/31_bust_dario_t2_neutral.txt` |
| 32 | `bust_dario_t2_concerned.png` | Dario — Sword Saint (다리오 · 검성, tier 2) | 1024×1280 | bust_dario_t2_neutral.png (your approved result) | `prompts/32_bust_dario_t2_concerned.txt` |
| 33 | `bust_dario_t2_determined.png` | Dario — Sword Saint (다리오 · 검성, tier 2) | 1024×1280 | bust_dario_t2_neutral.png (your approved result) | `prompts/33_bust_dario_t2_determined.txt` |
| 34 | `bust_dario_t2_sad.png` | Dario — Sword Saint (다리오 · 검성, tier 2) | 1024×1280 | bust_dario_t2_neutral.png (your approved result) | `prompts/34_bust_dario_t2_sad.txt` |
| 35 | `bust_ines_t2_neutral.png` | Ines — Sanctum Warden (이네스 · 성소 수호자, tier 2) | 1024×1280 | ref_bust_ines_neutral.png, style_aren_neutral.png | `prompts/35_bust_ines_t2_neutral.txt` |
| 36 | `bust_ines_t2_concerned.png` | Ines — Sanctum Warden (이네스 · 성소 수호자, tier 2) | 1024×1280 | bust_ines_t2_neutral.png (your approved result) | `prompts/36_bust_ines_t2_concerned.txt` |
| 37 | `bust_ines_t2_determined.png` | Ines — Sanctum Warden (이네스 · 성소 수호자, tier 2) | 1024×1280 | bust_ines_t2_neutral.png (your approved result) | `prompts/37_bust_ines_t2_determined.txt` |
| 38 | `bust_ines_t2_sad.png` | Ines — Sanctum Warden (이네스 · 성소 수호자, tier 2) | 1024×1280 | bust_ines_t2_neutral.png (your approved result) | `prompts/38_bust_ines_t2_sad.txt` |
| 39 | `sprite_thea_t2.png` | Thea — Black Iron Lancer (테아 · 흑철 창기사, tier 2) | 1024×768 | bust_thea_t2_neutral.png (your approved result), ref_sprite_thea.png, ref_sprite_cavalry.png | `prompts/39_sprite_thea_t2.txt` |
| 40 | `sprite_dario_t2.png` | Dario — Sword Saint (다리오 · 검성, tier 2) | 1024×768 | bust_dario_t2_neutral.png (your approved result), ref_sprite_dario.png, ref_sprite_eric.png | `prompts/40_sprite_dario_t2.txt` |
| 41 | `sprite_ines_t2.png` | Ines — Sanctum Warden (이네스 · 성소 수호자, tier 2) | 1024×768 | bust_ines_t2_neutral.png (your approved result), ref_sprite_ines.png, ref_sprite_eric.png | `prompts/41_sprite_ines_t2.txt` |

## 4. Part D — people of the keep and the forest, captains, figures (17 images)

| # | file | what | size (px) | attach | prompt |
|---|---|---|---|---|---|
| 42 | `bust_guardianElder_neutral.png` | the last guardian of the keep (마지막 수호자) | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png | `prompts/42_bust_guardianElder_neutral.txt` |
| 43 | `bust_guardianElder_concerned.png` | the last guardian of the keep (마지막 수호자) | 1024×1280 | bust_guardianElder_neutral.png (your approved result) | `prompts/43_bust_guardianElder_concerned.txt` |
| 44 | `bust_guardianElder_sad.png` | the last guardian of the keep (마지막 수호자) | 1024×1280 | bust_guardianElder_neutral.png (your approved result) | `prompts/44_bust_guardianElder_sad.txt` |
| 45 | `bust_forestElder_neutral.png` | the forest elder of the unburning forest (숲지기 장로) | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png | `prompts/45_bust_forestElder_neutral.txt` |
| 46 | `bust_forestElder_concerned.png` | the forest elder of the unburning forest (숲지기 장로) | 1024×1280 | bust_forestElder_neutral.png (your approved result) | `prompts/46_bust_forestElder_concerned.txt` |
| 47 | `bust_forestElder_sad.png` | the forest elder of the unburning forest (숲지기 장로) | 1024×1280 | bust_forestElder_neutral.png (your approved result) | `prompts/47_bust_forestElder_sad.txt` |
| 48 | `bust_captain16_iron_determined.png` | Iron Crown knight-captain of the betraying banner (철왕관 기사대장, M16 duel) | 1024×1280 | ref_sprite_ironInfantry.png (the map figure this captain must match), style_aren_neutral.png, ref_bust_baldrick_neutral.png | `prompts/48_bust_captain16_iron_determined.txt` |
| 49 | `bust_captain16_iron_sad.png` | Iron Crown knight-captain of the betraying banner (철왕관 기사대장, M16 duel) | 1024×1280 | bust_captain16_iron_determined.png (your approved result) | `prompts/49_bust_captain16_iron_sad.txt` |
| 50 | `bust_captain16_free_determined.png` | Free Lords Alliance knight-captain of the betraying banner (연맹 기사대장, M16 duel) | 1024×1280 | ref_sprite_lordA.png (the map figure this captain must match), style_aren_neutral.png, ref_bust_baldrick_neutral.png | `prompts/50_bust_captain16_free_determined.txt` |
| 51 | `bust_captain16_free_sad.png` | Free Lords Alliance knight-captain of the betraying banner (연맹 기사대장, M16 duel) | 1024×1280 | bust_captain16_free_determined.png (your approved result) | `prompts/51_bust_captain16_free_sad.txt` |
| 52 | `bust_captain16_flame_determined.png` | Sacred Flame knight-captain of the betraying banner (성화 기사대장, M16 duel) | 1024×1280 | ref_sprite_flameKnight.png (the map figure this captain must match), style_aren_neutral.png, ref_bust_baldrick_neutral.png | `prompts/52_bust_captain16_flame_determined.txt` |
| 53 | `bust_captain16_flame_sad.png` | Sacred Flame knight-captain of the betraying banner (성화 기사대장, M16 duel) | 1024×1280 | bust_captain16_flame_determined.png (your approved result) | `prompts/53_bust_captain16_flame_sad.txt` |
| 54 | `sprite_guardianElder.png` | the last guardian — map figure (hub NPC) | 1024×768 | bust_guardianElder_neutral.png (your approved result), ref_sprite_eric.png | `prompts/54_sprite_guardianElder.txt` |
| 55 | `sprite_forestElder.png` | the forest elder — map figure (hub NPC) | 1024×768 | bust_forestElder_neutral.png (your approved result), ref_sprite_eric.png | `prompts/55_sprite_forestElder.txt` |
| 56 | `sprite_guardianStatue.png` | guardian statue, awakened — map figure (fights for whoever swore the oath, M17) | 1024×768 | ref_sprite_ironSpear.png, style_aren_neutral.png | `prompts/56_sprite_guardianStatue.txt` |
| 57 | `sprite_forester.png` | forest-keeper villager (civilian to lead to safety, M18) | 1024×768 | ref_sprite_eric.png, style_aren_neutral.png | `prompts/57_sprite_forester.txt` |
| 58 | `sprite_greyCaptain.png` | the chancellery's grey captain (enemy commander, M17) | 1024×768 | ref_sprite_ironSpear.png, style_aren_neutral.png | `prompts/58_sprite_greyCaptain.txt` |

## 5. Global rules

- Characters: Painting style: match the attached approved art (style_aren_neutral.png, ref_bust_baldrick_neutral.png) — semi-realistic painted character art for a classic tactical RPG dialogue portrait: confident inked contour lines, painterly cel shading with soft gradients, strong warm rim light, rich saturated but slightly earthy colors, detailed metal and cloth textures, expressive mature faces (not chibi, not western cartoon, not photo-real). Original characters: do not copy any existing game's character, costume, emblem or logo.
- Places: Painting style: match the attached approved art (style_aren_neutral.png and the attached exterior hub map) — hand-painted fantasy illustration with confident contours, painterly cel shading with soft gradients, warm rim light, rich but slightly earthy colors, detailed but readable textures. Original world: do not imitate any existing game's rooms, furniture designs, emblems or layout.
- Icons: Painted game-item art in the same hand as the attached approved busts and chests: soft painterly rendering with visible but controlled brushwork, warm key light from the upper left, gentle rim light, rich but slightly muted Western medieval frontier colors, a subtle darker outline so the shape reads on dark UI. Objects in three-quarter view, centered, filling about 80% of their cell, every object fully inside its cell with an even margin. Each icon must still be recognisable at 40×40 px: one clear silhouette, strong value contrast, no tiny clutter. No text, letters, numbers, runes, emblems, crests, holy symbols or logos anywhere. No hands or people except the small abstract silhouettes named in a few skill icons.
- Never write the name of any existing game, character or studio in a prompt, and do not copy any existing artwork.
- **No text, letters, numbers, emblems, crests, holy symbols or logos** anywhere (clothing, shields, banners, books, seals, signs, crates). Factions are told apart by colors only: Iron Crown = steel-blue and grey fur; Free Lords Alliance = green and cream with a many-colored ribbon sash; Sacred Flame = white, crimson and gold-colored; the chancellery = ash-grey and plum.
- **New looks of existing heroes (parts B and C): the same person.** Start from the attached approved bust (`ref_bust_<id>_neutral.png`) and keep the face, age, hair and core colors; only the outfit grows. The map sheet must match the old sheet's size and proportions (`ref_sprite_<id>.png`).
- Busts: exactly 1024×1280, transparent (or flat pure `#00FF00`), framed like `style_aren_neutral.png`, turned to the viewer's right.
- Sprite sheets: exactly 1024×768, 4 columns × 3 rows of 256 px cells (row 1 down, row 2 right, row 3 up; columns idle, step A, step B, attack), feet on a baseline 16 px above each cell bottom, transparent (or `#00FF00`). Match the scale of the attached reference sheets.
- The two town maps follow the attached layout sketches (24×16 tiles of 64 px) and **keep exactly the footprint of their attached approved hub** (`approved_hub_fortress.jpg` for the keep, `approved_hub_village_day.jpg` for the forest village): the same building positions, doors, squares, streets and gates. Rooms: 12×8 tiles of 128 px, each on the footprint of its attached approved village room.
- Icon sheet I: 4×4 cells of 256 px, cells 07–16 empty, every icon inside the 80 % safe square of its cell. Prop sheet: 4 cells of 256 px in one row.
- Final sizes must be exact. Resize keeping the aspect ratio and pad or center-crop; never stretch.

## 6. Order of work

- **A:** in the table's order — `hub_forest` → its six rooms (`int_forest_longhouse` first) → `chests_forest` → `hub_keep` → `props_act3b.png` → `icons_I.png`.
- **B:** for each of `eric_t3`, `elina_t3`, `sain_t3`: neutral bust → concerned / determined / sad → map sheet.
- **C:** the same for `thea_t2` (mounted, like `ref_sprite_thea.png`), `dario_t2`, `ines_t2`.
- **D:** `guardianElder` and `forestElder` busts (neutral first) → the three captains (`determined` first, then `sad`) → the five map sheets.

## 7. Self-check (record PASS/FAIL per item in each zip's QA_REPORT.md)

- [ ] Every bust exactly 1024×1280 and every sheet exactly 1024×768; real transparency or pure `#00FF00` (say which per file).
- [ ] Hubs and rooms exactly 1536×1024 RGB JPEG quality 92–95; `chests_forest.png` exactly 1024×512; `icons_I.png` exactly 1024×1024; `props_act3b.png` exactly 1024×256 (PNG).
- [ ] No text, letters, emblems, holy symbols or logos anywhere. No people or animals in hubs and rooms (the keep's stone statues are scenery).
- [ ] Each character's busts share the same face, outfit, framing and lighting; only the expression changes. Each sheet matches its bust. Parts B and C: the face matches the attached old bust.
- [ ] Each sheet: 12 frames in the right rows/columns, feet on one baseline, nothing cut at cell edges, row 2 faces RIGHT.
- [ ] The keep keeps the footprint of `approved_hub_fortress.jpg`; the forest village keeps the footprint of `approved_hub_village_day.jpg`; rooms match their sketches and their approved village rooms; doorway at bottom-row tiles 5–6.
- [ ] Chest sheet: 4 chests, open cells lined up with closed cells, open chests empty. Prop sheet: the three tree states line up (same position and size).
- [ ] Icon sheet: 6 icons in cells 01–06, cells 07–16 fully transparent, same finish as the approved icon sheets.

## 8. Return format — one zip per part, **each under 20 MB**

- `Ashen_Crown_v091_ACT3_Art_Pack_F2_A.zip` — part A: places and things — the keep, the forest village and its six rooms, forest chests, icon sheet I, battle props
- `Ashen_Crown_v091_ACT3_Art_Pack_F2_B.zip` — part B: the awakened looks of Erik, Elina and Sain
- `Ashen_Crown_v091_ACT3_Art_Pack_F2_C.zip` — part C: the recruits' tier 2 looks of Thea, Dario and Ines
- `Ashen_Crown_v091_ACT3_Art_Pack_F2_D.zip` — part D: the people of the keep and the forest, the M16 knight-captains, three map figures

```
Ashen_Crown_v091_ACT3_Art_Pack_F2_A/   (and _B, _C, _D the same way)
  png/ or img/      # PNG masters for characters, icons, props and chests (png/), JPEG for hubs and rooms (img/)
  manifest.csv      # characters: kind,id,expression,file,width,height,bytes,sha256 · places: id,kind,path,width,height,bytes,sha256
  manifest_icons.csv  # part A only: sheet,file,width,height,background,bytes,sha256
  SHA256SUMS.txt    # sha256  path
  QA_REPORT.md      # the checklist above for the files in this zip, generation notes, deviations
  contact_sheet.jpg # thumbnails with file names, JPEG under 1 MB
  prompts_used/     # the exact final prompt per image
```

- Busts are large: **if a zip would exceed 20 MB, split it** (`_B1`, `_B2`, …), each with its own manifest, checksums and QA report. Do not include WebP.
- **Before you hand a zip over, reopen it and test it** (the whole archive must open and list every file; then verify every file against SHA256SUMS). A zip of pack F1 once arrived cut off in the middle of a file; report each zip's exact size in bytes so a cut-off download can be spotted.
- If an item cannot be met, still deliver your best image and state the deviation plainly in QA_REPORT.md. Do not claim a check passed unless you performed it.
