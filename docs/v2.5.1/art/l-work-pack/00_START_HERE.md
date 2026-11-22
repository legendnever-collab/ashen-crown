# Ashen Crown — v2.5.1 Art Work Order (pack L: Luka and the ACT IV villages)

You are producing finished game art for **Ashen Crown**, an original offline tactical RPG (Western medieval frontier fantasy, semi-realistic painted style). Read this whole file first, then do one part per run and return the zips described in section 6.

| part | what | images |
|---|---|---:|
| **A** | the rescued hero Luka (루카) × three expressions | 3 |
| **B** | the ACT IV small villages 봉화둔덕 (Beacon Mound) and 사자샘 (Lionspring) | 2 |
| | **total** | **5** |

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
| 1 | A | `bust_luka_neutral.png` | luka · neutral | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png, ref_bust_sain.png, ref_bust_celine.png | `prompts/01_bust_luka_neutral.txt` |
| 2 | A | `bust_luka_concerned.png` | luka · concerned | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png, ref_bust_sain.png, ref_bust_celine.png | `prompts/02_bust_luka_concerned.txt` |
| 3 | A | `bust_luka_determined.png` | luka · determined | 1024×1280 | style_aren_neutral.png, ref_bust_baldrick_neutral.png, ref_bust_sain.png, ref_bust_celine.png | `prompts/03_bust_luka_determined.txt` |
| 4 | B | `hub_beacon.jpg` | hub_beacon | 1536×1024 | layout_hub_village.png, approved_hub_village_day.jpg, approved_hub_garrison.jpg, approved_hub_capital.jpg, scale_reference.png, sprite_eric_sheet.png | `prompts/04_hub_beacon.txt` |
| 5 | B | `hub_lionspring.jpg` | hub_lionspring | 1536×1024 | layout_hub_village.png, approved_hub_village_day.jpg, approved_hub_frost.jpg, approved_hub_capital.jpg, scale_reference.png, sprite_eric_sheet.png | `prompts/05_hub_lionspring.txt` |

## 4. Global rules
- Exact pixel sizes as listed. PNGs use real transparency, or flat pure `#00FF00` if you cannot export alpha; say which in QA_REPORT.md. Hubs (part B) are opaque JPEG.
- Hubs keep the attached village footprint exactly (the same buildings, door tiles, square and paths as approved_hub_village_day.jpg); no people.
- No text, letters, numbers, emblems or logos. No blood or gore. Nothing may imitate an existing game.

## 5. Self-check (record PASS/FAIL per item in QA_REPORT.md; do not claim a check you did not do)
- [ ] Every file at its exact size and format; the alpha method stated.
- [ ] Style: beside `style_aren_neutral.png`, each image looks like the same artist's work (painted, not vector).
- [ ] Part A: the three expressions are the same young man; he does not look like Sain or Celine.
- [ ] Part B: the footprint matches the village layout; the beacon tower and tents (봉화둔덕) and the spring well-house with stables (사자샘) read at a glance; no people.

## 6. Return format — one zip per part, each under 20 MB
- `Ashen_Crown_v251_Art_Pack_L_A.zip`
- `Ashen_Crown_v251_Art_Pack_L_B.zip`

```
Ashen_Crown_v251_Art_Pack_L_<A–B>/
  png/ or jpg/        # the masters, file names exactly as in section 3
  manifest.csv        # id,kind,expression,file,width,height,sha256
  SHA256SUMS.txt
  QA_REPORT.md
  contact_sheet.jpg   # under 1 MB
  prompts_used/
```

- Before you hand a zip over, reopen it and test it (it must open and list every file; verify every file against SHA256SUMS). Report each zip's exact size in bytes.
- If an item cannot be met, deliver your best image and state the deviation plainly in QA_REPORT.md.
