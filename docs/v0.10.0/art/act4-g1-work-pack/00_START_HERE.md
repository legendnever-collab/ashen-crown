# Ashen Crown — ACT IV Part 1 Art Work Order (pack G1, v0.10.0)

You are producing finished game art for **Ashen Crown**, an original offline tactical RPG (Western medieval frontier fantasy). Read this whole file first, then work through the jobs part by part and return the zips described in section 7.
The game already plays with temporary game-drawn art for everything in this pack. It has **12 images in two parts** (A–B). The user may order one part at a time: **do only the parts the user asks for**, in the order B → A unless told otherwise, and return each part as its own zip(s).

| part | what | images |
|---|---|---:|
| **A** | things — icon sheet L (Ines's and Thea's ④, two treasures), battle props (the council tents) | 2 |
| **B** | the awakened looks of Ines and Thea | 10 |
| | total | **12** |

## 1. Part A — things (2 images)

| # | file | what | size (px) | attach | prompt |
|---|---|---|---|---|---|
| 1 | `props_act4a.png` | props_act4a | 1024×256 | layout_props_act4a.png, ref_sprite_eric.png, ref_sprite_ironSpear.png, ref_battle_m23.jpg | `prompts/01_props_act4a.txt` |

Plus job 2: `icons_L.png` (1024×1024, attach layout_icons_L.png, approved_icons_D.png, approved_icons_H.png, style_aren_neutral.png, prompt `prompts/02_icons_L.txt`).

| cell | id | icon |
|---|---|---|
| L01 | `sanctumGate` | Gate of the Sanctum (성역의 문) |
| L02 | `ironBreak` | Iron Break (철의 돌파) |
| L03 | `allianceBanner` | The Alliance Banner (연합의 깃발) |
| L04 | `lastLantern` | The Last Lantern (마지막 등불) |

## 2. Part B — awakened looks of Ines and Thea (10 images)

| # | file | what | size (px) | attach | prompt |
|---|---|---|---|---|---|
| 3 | `bust_ines_t3_neutral.png` | Ines — Dawn Paladin (이네스 · 새벽 성기사, awakened) | 1024×1280 | ref_bust_ines_t2_neutral.png, style_aren_neutral.png | `prompts/03_bust_ines_t3_neutral.txt` |
| 4 | `bust_ines_t3_concerned.png` | Ines — Dawn Paladin (이네스 · 새벽 성기사, awakened) | 1024×1280 | bust_ines_t3_neutral.png (your approved result) | `prompts/04_bust_ines_t3_concerned.txt` |
| 5 | `bust_ines_t3_determined.png` | Ines — Dawn Paladin (이네스 · 새벽 성기사, awakened) | 1024×1280 | bust_ines_t3_neutral.png (your approved result) | `prompts/05_bust_ines_t3_determined.txt` |
| 6 | `bust_ines_t3_sad.png` | Ines — Dawn Paladin (이네스 · 새벽 성기사, awakened) | 1024×1280 | bust_ines_t3_neutral.png (your approved result) | `prompts/06_bust_ines_t3_sad.txt` |
| 7 | `bust_thea_t3_neutral.png` | Thea — Black Iron Captain (테아 · 흑철 기병대장, awakened) | 1024×1280 | ref_bust_thea_t2_neutral.png, style_aren_neutral.png | `prompts/07_bust_thea_t3_neutral.txt` |
| 8 | `bust_thea_t3_concerned.png` | Thea — Black Iron Captain (테아 · 흑철 기병대장, awakened) | 1024×1280 | bust_thea_t3_neutral.png (your approved result) | `prompts/08_bust_thea_t3_concerned.txt` |
| 9 | `bust_thea_t3_determined.png` | Thea — Black Iron Captain (테아 · 흑철 기병대장, awakened) | 1024×1280 | bust_thea_t3_neutral.png (your approved result) | `prompts/09_bust_thea_t3_determined.txt` |
| 10 | `bust_thea_t3_sad.png` | Thea — Black Iron Captain (테아 · 흑철 기병대장, awakened) | 1024×1280 | bust_thea_t3_neutral.png (your approved result) | `prompts/10_bust_thea_t3_sad.txt` |
| 11 | `sprite_ines_t3.png` | Ines — Dawn Paladin (이네스 · 새벽 성기사, awakened) | 1024×768 | bust_ines_t3_neutral.png (your approved result), ref_sprite_ines_t2.png, ref_sprite_eric.png | `prompts/11_sprite_ines_t3.txt` |
| 12 | `sprite_thea_t3.png` | Thea — Black Iron Captain (테아 · 흑철 기병대장, awakened) | 1024×768 | bust_thea_t3_neutral.png (your approved result), ref_sprite_thea_t2.png, ref_sprite_cavalry.png | `prompts/12_sprite_thea_t3.txt` |

## 4. Global rules

- Characters: Painting style: match the attached approved art (style_aren_neutral.png, ref_bust_baldrick_neutral.png) — semi-realistic painted character art for a classic tactical RPG dialogue portrait: confident inked contour lines, painterly cel shading with soft gradients, strong warm rim light, rich saturated but slightly earthy colors, detailed metal and cloth textures, expressive mature faces (not chibi, not western cartoon, not photo-real). Original characters: do not copy any existing game's character, costume, emblem or logo.
- Icons: Painted game-item art in the same hand as the attached approved busts and chests: soft painterly rendering with visible but controlled brushwork, warm key light from the upper left, gentle rim light, rich but slightly muted Western medieval frontier colors, a subtle darker outline so the shape reads on dark UI. Objects in three-quarter view, centered, filling about 80% of their cell, every object fully inside its cell with an even margin. Each icon must still be recognisable at 40×40 px: one clear silhouette, strong value contrast, no tiny clutter. No text, letters, numbers, runes, emblems, crests, holy symbols or logos anywhere. No hands or people except the small abstract silhouettes named in a few skill icons.
- Never write the name of any existing game, character or studio in a prompt, and do not copy any existing artwork.
- **No text, letters, numbers, emblems, crests, holy symbols or logos** anywhere (clothing, shields, pennants, tents, the lantern). Banners and tents carry plain cloth colours only.
- **New looks of existing heroes (part B): the same person.** Start from the attached approved bust (`ref_bust_<id>_neutral.png`) and keep the face, age, hair and core colors (Ines white-gold and crimson, Thea black iron and steel blue); only the outfit grows. The map sheet must match the old sheet's size and proportions (`ref_sprite_<id>.png`); Thea stays mounted.
- Busts: exactly 1024×1280, transparent (or flat pure `#00FF00`), framed like `style_aren_neutral.png`, turned to the viewer's right.
- Sprite sheets: exactly 1024×768, 4 columns × 3 rows of 256 px cells (row 1 down, row 2 right, row 3 up; columns idle, step A, step B, attack), feet on a baseline 16 px above each cell bottom, transparent (or `#00FF00`). Match the scale of the attached reference sheets.
- Icon sheet L: 4×4 cells of 256 px, cells 05–16 empty, every icon inside the 80 % safe square of its cell. Prop sheet: 4 cells of 256 px in one row.
- Final sizes must be exact. Resize keeping the aspect ratio and pad or center-crop; never stretch.

## 5. Order of work

- **B:** for each of `ines_t3`, `thea_t3`: neutral bust → concerned / determined / sad → map sheet.
- **A:** `props_act4a.png` → `icons_L.png`.

## 6. Self-check (record PASS/FAIL per item in each zip's QA_REPORT.md)

- [ ] Every bust exactly 1024×1280 and every sheet exactly 1024×768; real transparency or pure `#00FF00` (say which per file).
- [ ] `icons_L.png` exactly 1024×1024; `props_act4a.png` exactly 1024×256 (PNG).
- [ ] No text, letters, emblems, holy symbols or logos anywhere.
- [ ] Each character's busts share the same face, outfit, framing and lighting; only the expression changes. Each sheet matches its bust. Part B: the face matches the attached old bust.
- [ ] Each sheet: 12 frames in the right rows/columns, feet on one baseline, nothing cut at cell edges, row 2 faces RIGHT.
- [ ] Prop sheet: the four tents share one shape, size and position; only the cloth colour changes (and the fourth is taken).
- [ ] Icon sheet: 4 icons in cells 01–04, the other cells fully transparent, same finish as the approved icon sheets.

## 7. Return format — one zip per part, **each under 20 MB**

- `Ashen_Crown_v0100_ACT4_Art_Pack_G1_A.zip` — part A: things — icon sheet L (Ines's and Thea's ④, two treasures), battle props (the council tents)
- `Ashen_Crown_v0100_ACT4_Art_Pack_G1_B.zip` — part B: the awakened looks of Ines and Thea

```
Ashen_Crown_v0100_ACT4_Art_Pack_G1_A/   (and _B the same way)
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
