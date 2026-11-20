# Ashen Crown — v2.3.1 Art Work Order (pack J: Gunnar, the ACT II villages, the wolf)

You are producing finished game art for **Ashen Crown**, an original offline tactical RPG (Western medieval frontier fantasy, semi-realistic painted style). Read this whole file first, then do one part per run and return the zips described in section 6.

| part | what | images |
|---|---|---:|
| **A** | the rescued hero Gunnar (군나르) × three expressions | 3 |
| **B** | the ACT II small villages 서리목 (Frostneck) and 소금항 (Saltport) | 2 |
| **C** | the hungry wolf: one map sheet and one portrait | 2 |
| | **total** | **7** |

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
| 1 | A | `bust_gunnar_neutral.png` | gunnar · neutral | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png, ref_bust_dario.png | `prompts/01_bust_gunnar_neutral.txt` |
| 2 | A | `bust_gunnar_concerned.png` | gunnar · concerned | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png, ref_bust_dario.png | `prompts/02_bust_gunnar_concerned.txt` |
| 3 | A | `bust_gunnar_determined.png` | gunnar · determined | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png, ref_bust_dario.png | `prompts/03_bust_gunnar_determined.txt` |
| 4 | B | `hub_frost.jpg` | hub_frost | 1536×1024 | layout_hub_village.png, approved_hub_village_day.jpg, approved_hub_stonewell.jpg, approved_hub_capital.jpg, scale_reference.png, sprite_eric_sheet.png | `prompts/04_hub_frost.txt` |
| 5 | B | `hub_saltport.jpg` | hub_saltport | 1536×1024 | layout_hub_village.png, approved_hub_village_day.jpg, approved_hub_reed.jpg, approved_hub_capital.jpg, scale_reference.png, sprite_eric_sheet.png | `prompts/05_hub_saltport.txt` |
| 6 | C | `sprite_wolf.png` | wolf | 1024×768 | ref_sprite_ironInfantry.png, style_aren_neutral.png, ref_wolf_ingame.png | `prompts/06_sprite_wolf.txt` |
| 7 | C | `bust_wolf_neutral.png` | wolf · neutral | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png, ref_wolf_ingame.png | `prompts/07_bust_wolf_neutral.txt` |

## 4. Global rules
- Exact pixel sizes as listed. PNGs use real transparency, or flat pure `#00FF00` if you cannot export alpha; say which in QA_REPORT.md. Hubs (part B) are opaque JPEG.
- Hubs keep the attached village footprint exactly (the same buildings, door tiles, square and paths as approved_hub_village_day.jpg); no people.
- The wolf sheet (part C) follows the class-sheet grid: 4 columns × 3 rows of 256×256, rows DOWN / RIGHT / UP, columns idle / step A / step B / attack; the paws on the same baseline 16 px above each cell's bottom; only the collar is magenta.
- No text, letters, numbers, emblems or logos. No blood or gore. Nothing may imitate an existing game.

## 5. Self-check (record PASS/FAIL per item in QA_REPORT.md; do not claim a check you did not do)
- [ ] Every file at its exact size and format; the alpha method stated.
- [ ] Style: beside `style_aren_neutral.png`, each image looks like the same artist's work (painted, not vector).
- [ ] Part A: the three expressions are the same man; he does not look like Dario.
- [ ] Part B: the footprint matches the village layout; snow (서리목) and salt pans with a quay (소금항) read at a glance; no people.
- [ ] Part C: twelve consistent frames, paws on the baseline, only the collar magenta; the portrait is a natural wolf.

## 6. Return format — one zip per part, each under 20 MB
- `Ashen_Crown_v231_Art_Pack_J_A.zip`
- `Ashen_Crown_v231_Art_Pack_J_B.zip`
- `Ashen_Crown_v231_Art_Pack_J_C.zip`

```
Ashen_Crown_v231_Art_Pack_J_<A–C>/
  png/ or jpg/        # the masters, file names exactly as in section 3
  manifest.csv        # id,kind,expression,file,width,height,sha256
  SHA256SUMS.txt
  QA_REPORT.md
  contact_sheet.jpg   # under 1 MB
  prompts_used/
```

- Before you hand a zip over, reopen it and test it (it must open and list every file; verify every file against SHA256SUMS). Report each zip's exact size in bytes.
- If an item cannot be met, deliver your best image and state the deviation plainly in QA_REPORT.md.
