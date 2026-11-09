# Ashen Crown — ACT III Part 4 Art Work Order (pack F4, v0.9.3)

You are producing finished game art for **Ashen Crown**, an original offline tactical RPG (Western medieval frontier fantasy). Read this whole file first, then work through the jobs part by part and return the zips described in section 7.
The game already plays with temporary game-drawn art for everything in this pack. It has **7 images in two parts** (A–B). The user may order one part at a time: **do only the parts the user asks for**, in the order B → A unless told otherwise, and return each part as its own zip(s).

| part | what | images |
|---|---|---:|
| **A** | things — icon sheet K (Thea's lance, Ines' mace, two treasures), battle props (the anchor stone) | 2 |
| **B** | the last king | 5 |
| | total | **7** |

## 1. Part A — things (2 images)

| # | file | what | size (px) | attach | prompt |
|---|---|---|---|---|---|
| 1 | `props_act3d.png` | props_act3d | 1024×256 | layout_props_act3d.png, ref_sprite_eric.png, ref_sprite_ironSpear.png, ref_battle_m21.jpg | `prompts/01_props_act3d.txt` |

Plus job 2: `icons_K.png` (1024×1024, attach layout_icons_K.png, approved_icons_D.png, approved_icons_H.png, style_aren_neutral.png, prompt `prompts/02_icons_K.txt`).

| cell | id | icon |
|---|---|---|
| K01 | `royalLance` | Royal Cavalry Lance (왕도 기병창) |
| K02 | `royalMace` | Royal Chaplain Mace (왕도 사제 철퇴) |
| K03 | `kingsSignet` | The King's Signet (왕의 인장) |
| K04 | `heraldHorn` | The Herald's Horn (전령의 뿔피리) |

## 2. Part B — the last king (5 images)

| # | file | what | size (px) | attach | prompt |
|---|---|---|---|---|---|
| 3 | `bust_king_neutral.png` | the last king (마지막 국왕, M21–M22; his name is OPEN until ACT IV) | 1024×1280 | style_aren_neutral.png, ref_bust_archivist_neutral.png (the hero they are tied to, for the painting style only) | `prompts/03_bust_king_neutral.txt` |
| 4 | `bust_king_concerned.png` | the last king (마지막 국왕, M21–M22; his name is OPEN until ACT IV) | 1024×1280 | bust_king_neutral.png (your approved result) | `prompts/04_bust_king_concerned.txt` |
| 5 | `bust_king_determined.png` | the last king (마지막 국왕, M21–M22; his name is OPEN until ACT IV) | 1024×1280 | bust_king_neutral.png (your approved result) | `prompts/05_bust_king_determined.txt` |
| 6 | `bust_king_sad.png` | the last king (마지막 국왕, M21–M22; his name is OPEN until ACT IV) | 1024×1280 | bust_king_neutral.png (your approved result) | `prompts/06_bust_king_sad.txt` |
| 7 | `sprite_king.png` | the last king — map figure (M21 throne dais; cannot move) | 1024×768 | bust_king_neutral.png (your approved result), ref_sprite_archivist.png | `prompts/07_sprite_king.txt` |

## 4. Global rules

- Characters: Painting style: match the attached approved art (style_aren_neutral.png, ref_bust_baldrick_neutral.png) — semi-realistic painted character art for a classic tactical RPG dialogue portrait: confident inked contour lines, painterly cel shading with soft gradients, strong warm rim light, rich saturated but slightly earthy colors, detailed metal and cloth textures, expressive mature faces (not chibi, not western cartoon, not photo-real). Original characters: do not copy any existing game's character, costume, emblem or logo.
- Icons: Painted game-item art in the same hand as the attached approved busts and chests: soft painterly rendering with visible but controlled brushwork, warm key light from the upper left, gentle rim light, rich but slightly muted Western medieval frontier colors, a subtle darker outline so the shape reads on dark UI. Objects in three-quarter view, centered, filling about 80% of their cell, every object fully inside its cell with an even margin. Each icon must still be recognisable at 40×40 px: one clear silhouette, strong value contrast, no tiny clutter. No text, letters, numbers, runes, emblems, crests, holy symbols or logos anywhere. No hands or people except the small abstract silhouettes named in a few skill icons.
- Never write the name of any existing game, character or studio in a prompt, and do not copy any existing artwork.
- **No text, letters, numbers, emblems, crests, holy symbols or logos** anywhere (clothing, papers, rings, horns, banners, the anchor stone). The stone carries plain bands and light only.
- **The king is frail but dignified** — never a corpse, ghost or monster; the violet light drawn from him is faint.
- The king has **no name** in the game yet; never write a name on anything.
- Busts: exactly 1024×1280, transparent (or flat pure `#00FF00`), framed like `style_aren_neutral.png`, turned to the viewer's right.
- Sprite sheets: exactly 1024×768, 4 columns × 3 rows of 256 px cells (row 1 down, row 2 right, row 3 up; columns idle, step A, step B, attack), feet on a baseline 16 px above each cell bottom, transparent (or `#00FF00`). Match the scale of the attached reference sheets.
- Icon sheet K: 4×4 cells of 256 px, cells 05–16 empty, every icon inside the 80 % safe square of its cell. Prop sheet: 4 cells of 256 px in one row.
- Final sizes must be exact. Resize keeping the aspect ratio and pad or center-crop; never stretch.

## 5. Order of work

- **B:** `king`: neutral bust → concerned / determined / sad → map sheet.
- **A:** `props_act3d.png` → `icons_K.png`.

## 6. Self-check (record PASS/FAIL per item in each zip's QA_REPORT.md)

- [ ] Every bust exactly 1024×1280 and every sheet exactly 1024×768; real transparency or pure `#00FF00` (say which per file).
- [ ] `icons_K.png` exactly 1024×1024; `props_act3d.png` exactly 1024×256 (PNG).
- [ ] No text, letters, emblems, holy symbols or logos anywhere.
- [ ] Each character's busts share the same face, outfit, framing and lighting; only the expression changes. Each sheet matches its bust. 
- [ ] Each sheet: 12 frames in the right rows/columns, feet on one baseline, nothing cut at cell edges, row 2 faces RIGHT.
- [ ] Prop sheet: the two anchor-stone states line up (same position and size); cells 3–4 empty.
- [ ] Icon sheet: 4 icons in cells 01–04, the other cells fully transparent, same finish as the approved icon sheets.

## 7. Return format — one zip per part, **each under 20 MB**

- `Ashen_Crown_v093_ACT3_Art_Pack_F4_A.zip` — part A: things — icon sheet K (Thea's lance, Ines' mace, two treasures), battle props (the anchor stone)
- `Ashen_Crown_v093_ACT3_Art_Pack_F4_B.zip` — part B: the last king

```
Ashen_Crown_v093_ACT3_Art_Pack_F4_A/   (and _B the same way)
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
