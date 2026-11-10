# Ashen Crown — ACT IV Part 2 Art Work Order (pack G2, v0.10.1)

You are producing finished game art for **Ashen Crown**, an original offline tactical RPG (Western medieval frontier fantasy). Read this whole file first, then work through the jobs part by part and return the zips described in section 7.
The game already plays with temporary game-drawn art for everything in this pack. It has **6 images in two parts** (A–B). The user may order one part at a time: **do only the parts the user asks for**, in the order B → A unless told otherwise, and return each part as its own zip(s).

| part | what | images |
|---|---|---:|
| **A** | things — icon sheet M (Dario's ④, Baldrick's four skills, two treasures) | 1 |
| **B** | the awakened look of Dario | 5 |
| | total | **6** |

## 1. Part A — things (1 images)

| # | file | what | size (px) | attach | prompt |
|---|---|---|---|---|---|

Plus job 1: `icons_M.png` (1024×1024, attach layout_icons_M.png, approved_icons_D.png, approved_icons_H.png, style_aren_neutral.png, prompt `prompts/01_icons_M.txt`).

| cell | id | icon |
|---|---|---|
| L01 | `hundredCounters` | A Hundred Counters (백 번의 반격) |
| L02 | `lionStrike` | Lion Strike (사자의 일격) |
| L03 | `lionRoar` | Lion's Roar (사자의 포효) |
| L04 | `lionBanner` | Lion Banner (사자의 깃발) |
| L05 | `lastCharge` | The Black Lion's Resolve (검은 사자의 결의) |
| L06 | `threeSeals` | The Seal of the Three Houses (세 왕가의 인장) |
| L07 | `blackMane` | The Black Mane (검은 갈기) |

## 2. Part B — the awakened look of Dario (5 images)

| # | file | what | size (px) | attach | prompt |
|---|---|---|---|---|---|
| 2 | `bust_dario_t3_neutral.png` | Dario — Master of the Blade (다리오 · 칼의 주인, awakened) | 1024×1280 | ref_bust_dario_t2_neutral.png, style_aren_neutral.png | `prompts/02_bust_dario_t3_neutral.txt` |
| 3 | `bust_dario_t3_concerned.png` | Dario — Master of the Blade (다리오 · 칼의 주인, awakened) | 1024×1280 | bust_dario_t3_neutral.png (your approved result) | `prompts/03_bust_dario_t3_concerned.txt` |
| 4 | `bust_dario_t3_determined.png` | Dario — Master of the Blade (다리오 · 칼의 주인, awakened) | 1024×1280 | bust_dario_t3_neutral.png (your approved result) | `prompts/04_bust_dario_t3_determined.txt` |
| 5 | `bust_dario_t3_sad.png` | Dario — Master of the Blade (다리오 · 칼의 주인, awakened) | 1024×1280 | bust_dario_t3_neutral.png (your approved result) | `prompts/05_bust_dario_t3_sad.txt` |
| 6 | `sprite_dario_t3.png` | Dario — Master of the Blade (다리오 · 칼의 주인, awakened) | 1024×768 | bust_dario_t3_neutral.png (your approved result), ref_sprite_dario_t2.png, ref_sprite_eric.png | `prompts/06_sprite_dario_t3.txt` |

## 4. Global rules

- Characters: Painting style: match the attached approved art (style_aren_neutral.png, ref_bust_baldrick_neutral.png) — semi-realistic painted character art for a classic tactical RPG dialogue portrait: confident inked contour lines, painterly cel shading with soft gradients, strong warm rim light, rich saturated but slightly earthy colors, detailed metal and cloth textures, expressive mature faces (not chibi, not western cartoon, not photo-real). Original characters: do not copy any existing game's character, costume, emblem or logo.
- Icons: Painted game-item art in the same hand as the attached approved busts and chests: soft painterly rendering with visible but controlled brushwork, warm key light from the upper left, gentle rim light, rich but slightly muted Western medieval frontier colors, a subtle darker outline so the shape reads on dark UI. Objects in three-quarter view, centered, filling about 80% of their cell, every object fully inside its cell with an even margin. Each icon must still be recognisable at 40×40 px: one clear silhouette, strong value contrast, no tiny clutter. No text, letters, numbers, runes, emblems, crests, holy symbols or logos anywhere. No hands or people except the small abstract silhouettes named in a few skill icons.
- Never write the name of any existing game, character or studio in a prompt, and do not copy any existing artwork.
- **No text, letters, numbers, emblems, crests, holy symbols or logos** anywhere (clothing, blades, banners, seals). Banners carry plain cloth colours only.
- **New looks of existing heroes (part B): the same person.** Start from the attached approved bust (`ref_bust_<id>_neutral.png`) and keep the face, age, hair and core colors (Dario dark wine and black leather); only the outfit grows. The map sheet must match the old sheet's size and proportions (`ref_sprite_<id>.png`).
- Busts: exactly 1024×1280, transparent (or flat pure `#00FF00`), framed like `style_aren_neutral.png`, turned to the viewer's right.
- Sprite sheets: exactly 1024×768, 4 columns × 3 rows of 256 px cells (row 1 down, row 2 right, row 3 up; columns idle, step A, step B, attack), feet on a baseline 16 px above each cell bottom, transparent (or `#00FF00`). Match the scale of the attached reference sheets.
- Icon sheet M: 4×4 cells of 256 px, cells 08–16 empty, every icon inside the 80 % safe square of its cell.
- Final sizes must be exact. Resize keeping the aspect ratio and pad or center-crop; never stretch.

## 5. Order of work

- **B:** `dario_t3`: neutral bust → concerned / determined / sad → map sheet.
- **A:** `icons_M.png`.

## 6. Self-check (record PASS/FAIL per item in each zip's QA_REPORT.md)

- [ ] Every bust exactly 1024×1280 and every sheet exactly 1024×768; real transparency or pure `#00FF00` (say which per file).
- [ ] `icons_M.png` exactly 1024×1024 (PNG).
- [ ] No text, letters, emblems, holy symbols or logos anywhere.
- [ ] Each character's busts share the same face, outfit, framing and lighting; only the expression changes. Each sheet matches its bust. Part B: the face matches the attached old bust.
- [ ] Each sheet: 12 frames in the right rows/columns, feet on one baseline, nothing cut at cell edges, row 2 faces RIGHT.
- [ ] Icon sheet: 7 icons in cells 01–07, the other cells fully transparent, same finish as the approved icon sheets.

## 7. Return format — one zip per part, **each under 20 MB**

- `Ashen_Crown_v0101_ACT4_Art_Pack_G2_A.zip` — part A: things — icon sheet M (Dario's ④, Baldrick's four skills, two treasures)
- `Ashen_Crown_v0101_ACT4_Art_Pack_G2_B.zip` — part B: the awakened look of Dario

```
Ashen_Crown_v0101_ACT4_Art_Pack_G2_A/   (and _B the same way)
  png/              # PNG masters
  manifest.csv      # characters: kind,id,expression,file,width,height,bytes,sha256 · props: id,kind,path,width,height,bytes,sha256
  manifest_icons.csv  # part A only: sheet,file,width,height,background,bytes,sha256
  SHA256SUMS.txt    # sha256  path
  QA_REPORT.md      # the checklist above for the files in this zip, generation notes, deviations
  contact_sheet.jpg # thumbnails with file names, JPEG under 1 MB
  prompts_used/     # the exact final prompt per image
```

- Busts are large: **if a zip would exceed 20 MB, split it** (`_B1`, `_B2`, …), each with its own manifest, checksums and QA report. Do not include WebP.
- **Before you hand a zip over, reopen it and test it** (the whole archive must open and list every file; then verify every file against SHA256SUMS). Report each zip's exact size in bytes so a cut-off download can be spotted.
- If an item cannot be met, still deliver your best image and state the deviation plainly in QA_REPORT.md. Do not claim a check passed unless you performed it.
