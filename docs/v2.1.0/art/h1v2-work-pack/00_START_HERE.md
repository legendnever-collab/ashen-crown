# Ashen Crown — v2.1.0 Art Work Order (pack H1, remade for taverns and the world map)

You are producing finished game art for **Ashen Crown**, an original offline tactical RPG (Western medieval frontier fantasy). Read this whole file first, then do the parts in order and return the zips described in section 7.
This order **replaces** the earlier H1 order. The battlefield draws **every soldier of a class with the same figure** and shows the side by **colour**. New in this version: the legion hires sellswords in **taverns**, small villages open on the world map with **requests**, and a besieged spearknight (Adel) can be rescued and join. This pack paints the class figures, the hires' and Adel's portraits, the village tavern, the two small villages, the duel arena and two icon sheets.

| part | what | images |
|---|---|---:|
| **A** | class map sheets, tier 1 (eight classes) | 8 |
| **B** | class map sheets, tier 2 | 8 |
| **C** | class map sheets, tier 3 | 8 |
| **D** | busts of the ACT I tavern hires (Bram, Noa, Marta, Rowell) and the rescued hero Adel × three expressions | 15 |
| **E** | busts of the later hires (Sera, Orin, Celine, Ren, Silva), neutral | 5 |
| **F** | the village tavern room and the two small villages (Reed Ferry, Stonewell) | 3 |
| **G** | the duel arena, icon sheet P (treasures) and icon sheet Q (tavern, requests, world map, duel) | 3 |
| | **total** | **50** |

## 1. The magenta rule (parts A–C)

- SIDE COLOUR (important): every cloth area that should show which side the soldier fights for — tabard, cloak, sash, hood lining, horse barding cloth, a small pennant — is painted in shades of PURE MAGENTA only (#FF00FF midtone, #B000B0 shadow, #FF80FF highlight), keeping the folds and shading. Nothing else may be magenta or pink: skin, hair, metal, leather, wood and the horse stay natural colours. The game replaces the magenta with blue, red or a banner colour.
- Test: if you replace every magenta pixel with blue, the figure must read as a legion soldier; with red, as an enemy. Keep magenta out of everything else.

## 2. Each class grows (parts A–C)

The three tiers of one class are the same kind of soldier growing: the armour gets heavier and richer, the weapon better, and the **attack frame (column 4) changes** as listed — e.g. the archer looses one arrow at tier 1, two at tier 2 and three ember arrows at tier 3. Tier 3 always carries the Ashen Crown mark (ash-grey trim, a faint warm-gold ward light).

| class | tier 1 | tier 2 | tier 3 |
|---|---|---|---|
| 보병 (infantry) | 검사 | 기사 | 서약기사 |
| 창병 (spear) | 창병 | 방진창병 | 수문장 |
| 궁병 (archer) | 궁수 | 명사수 | 잿불궁수 |
| 기병 (cavalry) | 기수 | 돌격기사 | 사자기사 |
| 마도사 (mage) | 견습 마도사 | 마도사 | 재의 현자 |
| 치유사 (healer) | 치유사 | 사제 | 새벽사제 |
| 도적 (rogue) | 도적 | 그림자 | 밤까마귀 |
| 방패병 (shield) | 방패병 | 철벽병 | 결계수호자 |

## 3. Jobs

| # | part | file | what | size | attach | prompt |
|---|---|---|---|---|---|---|
| 1 | A | `class_infantry_1.png` | class_infantry_1 | 1024×768 | ref_sprite_ironInfantry.png, style_aren_neutral.png | `prompts/01_class_infantry_1.txt` |
| 2 | A | `class_spear_1.png` | class_spear_1 | 1024×768 | ref_sprite_ironSpear.png, style_aren_neutral.png | `prompts/02_class_spear_1.txt` |
| 3 | A | `class_archer_1.png` | class_archer_1 | 1024×768 | ref_sprite_archer.png, style_aren_neutral.png | `prompts/03_class_archer_1.txt` |
| 4 | A | `class_cavalry_1.png` | class_cavalry_1 | 1024×768 | ref_sprite_cavalry.png, style_aren_neutral.png | `prompts/04_class_cavalry_1.txt` |
| 5 | A | `class_mage_1.png` | class_mage_1 | 1024×768 | ref_sprite_ritualist.png, style_aren_neutral.png | `prompts/05_class_mage_1.txt` |
| 6 | A | `class_healer_1.png` | class_healer_1 | 1024×768 | ref_sprite_pilgrim.png, style_aren_neutral.png | `prompts/06_class_healer_1.txt` |
| 7 | A | `class_rogue_1.png` | class_rogue_1 | 1024×768 | ref_sprite_grayCloak.png, style_aren_neutral.png | `prompts/07_class_rogue_1.txt` |
| 8 | A | `class_shield_1.png` | class_shield_1 | 1024×768 | ref_sprite_bearer.png, style_aren_neutral.png | `prompts/08_class_shield_1.txt` |
| 9 | B | `class_infantry_2.png` | class_infantry_2 | 1024×768 | ref_sprite_guard.png, style_aren_neutral.png | `prompts/09_class_infantry_2.txt` |
| 10 | B | `class_spear_2.png` | class_spear_2 | 1024×768 | ref_sprite_mercSpear.png, style_aren_neutral.png | `prompts/10_class_spear_2.txt` |
| 11 | B | `class_archer_2.png` | class_archer_2 | 1024×768 | ref_sprite_ironArcher.png, style_aren_neutral.png | `prompts/11_class_archer_2.txt` |
| 12 | B | `class_cavalry_2.png` | class_cavalry_2 | 1024×768 | ref_sprite_thea_t2.png, style_aren_neutral.png | `prompts/12_class_cavalry_2.txt` |
| 13 | B | `class_mage_2.png` | class_mage_2 | 1024×768 | ref_sprite_lia_t2.png, style_aren_neutral.png | `prompts/13_class_mage_2.txt` |
| 14 | B | `class_healer_2.png` | class_healer_2 | 1024×768 | ref_sprite_sain_t2.png, style_aren_neutral.png | `prompts/14_class_healer_2.txt` |
| 15 | B | `class_rogue_2.png` | class_rogue_2 | 1024×768 | ref_sprite_kai_t2.png, style_aren_neutral.png | `prompts/15_class_rogue_2.txt` |
| 16 | B | `class_shield_2.png` | class_shield_2 | 1024×768 | ref_sprite_ines_t2.png, style_aren_neutral.png | `prompts/16_class_shield_2.txt` |
| 17 | C | `class_infantry_3.png` | class_infantry_3 | 1024×768 | ref_sprite_flameKnight.png, style_aren_neutral.png | `prompts/17_class_infantry_3.txt` |
| 18 | C | `class_spear_3.png` | class_spear_3 | 1024×768 | ref_sprite_ritualKnight.png, style_aren_neutral.png | `prompts/18_class_spear_3.txt` |
| 19 | C | `class_archer_3.png` | class_archer_3 | 1024×768 | ref_sprite_fortArcher.png, style_aren_neutral.png | `prompts/19_class_archer_3.txt` |
| 20 | C | `class_cavalry_3.png` | class_cavalry_3 | 1024×768 | ref_sprite_thea_t3.png, style_aren_neutral.png | `prompts/20_class_cavalry_3.txt` |
| 21 | C | `class_mage_3.png` | class_mage_3 | 1024×768 | ref_sprite_lia_t3.png, style_aren_neutral.png | `prompts/21_class_mage_3.txt` |
| 22 | C | `class_healer_3.png` | class_healer_3 | 1024×768 | ref_sprite_sain_t3.png, style_aren_neutral.png | `prompts/22_class_healer_3.txt` |
| 23 | C | `class_rogue_3.png` | class_rogue_3 | 1024×768 | ref_sprite_kai_t3.png, style_aren_neutral.png | `prompts/23_class_rogue_3.txt` |
| 24 | C | `class_shield_3.png` | class_shield_3 | 1024×768 | ref_sprite_ines_t3.png, style_aren_neutral.png | `prompts/24_class_shield_3.txt` |
| 25 | D | `bust_bram_neutral.png` | bram · neutral | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png | `prompts/25_bust_bram_neutral.txt` |
| 26 | D | `bust_bram_determined.png` | bram · determined | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png | `prompts/26_bust_bram_determined.txt` |
| 27 | D | `bust_bram_concerned.png` | bram · concerned | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png | `prompts/27_bust_bram_concerned.txt` |
| 28 | D | `bust_noa_neutral.png` | noa · neutral | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png | `prompts/28_bust_noa_neutral.txt` |
| 29 | D | `bust_noa_determined.png` | noa · determined | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png | `prompts/29_bust_noa_determined.txt` |
| 30 | D | `bust_noa_concerned.png` | noa · concerned | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png | `prompts/30_bust_noa_concerned.txt` |
| 31 | D | `bust_marta_neutral.png` | marta · neutral | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png | `prompts/31_bust_marta_neutral.txt` |
| 32 | D | `bust_marta_determined.png` | marta · determined | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png | `prompts/32_bust_marta_determined.txt` |
| 33 | D | `bust_marta_concerned.png` | marta · concerned | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png | `prompts/33_bust_marta_concerned.txt` |
| 34 | D | `bust_rowell_neutral.png` | rowell · neutral | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png | `prompts/34_bust_rowell_neutral.txt` |
| 35 | D | `bust_rowell_determined.png` | rowell · determined | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png | `prompts/35_bust_rowell_determined.txt` |
| 36 | D | `bust_rowell_concerned.png` | rowell · concerned | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png | `prompts/36_bust_rowell_concerned.txt` |
| 37 | D | `bust_adel_neutral.png` | adel · neutral | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png | `prompts/37_bust_adel_neutral.txt` |
| 38 | D | `bust_adel_determined.png` | adel · determined | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png | `prompts/38_bust_adel_determined.txt` |
| 39 | D | `bust_adel_concerned.png` | adel · concerned | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png | `prompts/39_bust_adel_concerned.txt` |
| 40 | E | `bust_sera_neutral.png` | sera · neutral | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png | `prompts/40_bust_sera_neutral.txt` |
| 41 | E | `bust_orin_neutral.png` | orin · neutral | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png | `prompts/41_bust_orin_neutral.txt` |
| 42 | E | `bust_celine_neutral.png` | celine · neutral | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png | `prompts/42_bust_celine_neutral.txt` |
| 43 | E | `bust_ren_neutral.png` | ren · neutral | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png | `prompts/43_bust_ren_neutral.txt` |
| 44 | E | `bust_silva_neutral.png` | silva · neutral | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png | `prompts/44_bust_silva_neutral.txt` |
| 45 | F | `int_village_tavern.jpg` | int_village_tavern | 1536×1024 | layout_int_village_tavern.png, scale_reference_interior.png, approved_int_village_barracks.jpg, approved_int_capital_tavern.jpg | `prompts/45_int_village_tavern.txt` |
| 46 | F | `hub_reed.jpg` | hub_reed | 1536×1024 | layout_hub_village.png, approved_hub_village_day.jpg, approved_hub_capital.jpg, scale_reference.png, sprite_eric_sheet.png | `prompts/46_hub_reed.txt` |
| 47 | F | `hub_stonewell.jpg` | hub_stonewell | 1536×1024 | layout_hub_village.png, approved_hub_village_day.jpg, approved_hub_capital.jpg, scale_reference.png, sprite_eric_sheet.png | `prompts/47_hub_stonewell.txt` |
| 48 | G | `arena.png` | arena | 1600×900 | hub_capital.png, ref_duel_screen.png | `prompts/48_arena.txt` |
| 49 | G | `icons_P.png` | icons_P | 1024×1024 | layout_icons_P.png, approved_icons_D.png, approved_icons_H.png, style_aren_neutral.png | `prompts/49_icons_P.txt` |
| 50 | G | `icons_Q.png` | icons_Q | 1024×1024 | layout_icons_Q.png, approved_icons_D.png, approved_icons_H.png, style_aren_neutral.png | `prompts/50_icons_Q.txt` |

| cell | id | icon |
|---|---|---|
| P01 | `arenCrest` | Aren's Shield Crest (아렌의 방패 문장) |
| P02 | `teacherTome` | The Teacher's Tome (스승의 마도서) |
| P03 | `garrRing` | Garr's Iron Ring (가르의 쇠가락지) |
| P04 | `runnerMapCase` | The Runner's Map Case (도주 대장의 지도통) |
| P05 | `pursuerGreaves` | The Pursuer's Greaves (추격 지휘관의 각반) |
| P06 | `quartermasterSeal` | The Quartermaster's Seal (병참관의 인장) |
| Q01 | `tavern` | 주점 |
| Q02 | `requestBoard` | 의뢰 게시판 |
| Q03 | `bounty` | 현상금 |
| Q04 | `worldTravel` | 세계 지도 이동 |
| Q05 | `duelEvent` | 일기토 |
| Q06 | `eliteHire` | 엘리트 용병 |
| Q07 | `hire` | 고용 |
| Q08 | `rescue` | 구출 |

## 4. Global rules

- Sprite sheets: exactly 1024×768, 4 columns × 3 rows of 256 px cells (row 1 down, row 2 right, row 3 up; columns idle, step A, step B, attack), feet on a baseline 16 px above each cell bottom, transparent (or `#00FF00`). Match the scale of the attached reference sheet (`ref_sprite_*.png`, shown at half size: double it).
- Rooms and hubs (part F): exactly 1536×1024 JPEG, opaque, no people; hubs keep the attached village footprint, rooms keep the barracks footprint and leave CHEST and KEEPER tiles as empty floor.
- Busts: exactly 1024×1280, transparent (or `#00FF00`), framed like `style_aren_neutral.png`, turned to the viewer's right. All expressions of one person are the same person. Noa and Celine are adults.
- Arena: exactly 1600×900, opaque, no people. Icon sheet: 4×4 cells of 256 px, cells 07–16 empty, transparent (or `#00FF00`).
- **Original work only.** Never write the name of any existing game, character or studio in a prompt, and do not copy or imitate any existing artwork, sprite, class costume or duel screen. No text, letters, numbers, emblems, crests, holy symbols or logos anywhere.
- Final sizes must be exact. Resize keeping the aspect ratio and pad or center-crop; never stretch.

## 5. Order of work

- **A → B → C:** class by class in the table order (keep each class consistent across its three tiers).
- **D:** person by person, neutral first. **E:** one bust each.
- **F:** `int_village_tavern.jpg` → `hub_reed.jpg` → `hub_stonewell.jpg`.
- **G:** `arena.png` → `icons_P.png` → `icons_Q.png`.

## 6. Self-check (record PASS/FAIL per item in each zip's QA_REPORT.md)

- [ ] Every file at its exact size; real transparency or pure `#00FF00` (say which) — part F is opaque JPEG.
- [ ] Parts A–C: side-colour cloth is pure magenta shades only; no other magenta or pink; the 12 frames of a sheet are consistent; the attack frame matches the tier.
- [ ] Tier 3 sheets carry the ash-grey and ward-gold mark.
- [ ] Parts D–E: the expressions of each person are the same person; Noa and Celine read as adults.
- [ ] Part F: hubs keep the village footprint (buildings, doors, square, paths); the tavern keeps the barracks footprint; CHEST and KEEPER tiles are empty floor; no people.
- [ ] No text, emblems or logos; nothing imitates an existing game.

## 7. Return format — one zip per part, **each under 20 MB**

- `Ashen_Crown_v210_Art_Pack_H1_A.zip`
- `Ashen_Crown_v210_Art_Pack_H1_B.zip`
- `Ashen_Crown_v210_Art_Pack_H1_C.zip`
- `Ashen_Crown_v210_Art_Pack_H1_D.zip`
- `Ashen_Crown_v210_Art_Pack_H1_E.zip`
- `Ashen_Crown_v210_Art_Pack_H1_F.zip`
- `Ashen_Crown_v210_Art_Pack_H1_G.zip`

```
Ashen_Crown_v210_Art_Pack_H1_<A–G>/
  png/                # PNG masters (part F: jpg/)
  manifest.csv        # A–E: id,kind,expression,file,sha256   (kind = sprite or bust)
  manifest_scene.csv  # F, G: id,file,width,height,sha256 (rooms, hubs, arena)
  manifest_icons.csv  # G: sheet,file,width,height,background,bytes,sha256
  SHA256SUMS.txt
  QA_REPORT.md
  contact_sheet.jpg   # under 1 MB
  prompts_used/
```

- **Before you hand a zip over, reopen it and test it** (it must open and list every file; verify every file against SHA256SUMS). Report each zip's exact size in bytes.
- If an item cannot be met, deliver your best image and state the deviation plainly in QA_REPORT.md. Do not claim a check passed unless you performed it.
