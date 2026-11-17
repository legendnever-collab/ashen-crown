# Ashen Crown — ACT IV Part 4 Art Work Order (pack G4, v1.0.0 — the last pack)

You are producing finished game art for **Ashen Crown**, an original offline tactical RPG (Western medieval frontier fantasy). Read this whole file first, then do the jobs in order and return the zips described in section 7.
The game already plays with temporary game-drawn art for everything in this pack. It has **5 images in two parts** (A, B).

| part | what | images |
|---|---|---:|
| **A** | scenes — three ending illustrations and the epilogue background | 4 |
| **B** | things — icon sheet O (two treasures) | 1 |

## 1. Part A — scenes (4 images)

| # | file | what | size (px) | attach | prompt |
|---|---|---|---|---|---|
| 1 | `ending_a.png` | Ending A — One Kingdom (하나의 왕국) | 1600×900 | bust_eric_t3_neutral.png, bust_aren_neutral.png, bust_lia_neutral.png, bust_kai_neutral.png, hub_capital.png, ref_ending_epilogue.jpg | `prompts/01_ending_a.txt` |
| 2 | `ending_b.png` | Ending B — A Free Continent (자유로운 대륙) | 1600×900 | bust_eric_t3_neutral.png, bust_dario_neutral.png, bust_leonora_neutral.png, hub_capital.png, ref_ending_epilogue.jpg | `prompts/02_ending_b.txt` |
| 3 | `ending_c.png` | Ending C — A New Oath (새로운 서약) | 1600×900 | bust_ines_neutral.png, bust_sain_neutral.png, bust_elina_neutral.png, bust_eric_t3_neutral.png, hub_capital.png, ref_ending_epilogue.jpg | `prompts/03_ending_c.txt` |
| 4 | `epilogue.png` | Epilogue background (에필로그 배경) | 1600×900 | hub_capital.png, ref_ending_epilogue.jpg | `prompts/04_epilogue.txt` |

## 2. Part B — things (1 image)

| # | file | what | size (px) | attach | prompt |
|---|---|---|---|---|---|
| 5 | `icons_O.png` | icon sheet O | 1024×1024 | layout_icons_O.png, approved_icons_D.png, approved_icons_H.png, style_aren_neutral.png | `prompts/05_icons_O.txt` |

| cell | id | icon |
|---|---|---|
| O01 | `bellardQuill` | Bellard's Quill (벨라드의 깃펜) |
| O02 | `dawnRing` | The Dawn Ring (새벽의 반지) |

## 3. What the endings must say (read before painting A)

- The three endings are **equal**: none is the right answer. Each shows what it gains and, quietly, what it costs (the prompts say how). Do not make one brighter, holier or happier than the others.
- No one wears the crown in Ending A. No god, no halo, no angel in Ending C. No army marching in Ending B.
- What lies beyond the ward stays a mystery: no monsters on the horizon, only the faint golden dome of the new ward.

## 4. Global rules

- Scenes: Painting style: a finished painted illustration in the same hand as the attached approved busts and the attached painted hub (hub_capital.png): soft painterly rendering with visible but controlled brushwork, warm dawn light against cool shadows, readable silhouettes, Western medieval frontier fantasy (no anime, no photo-realism, no 3D render look). The named characters must match the attached busts exactly (faces, hair, outfits, colours) at a smaller scale; everyone else is an unnamed extra. 16:9, the important action inside the central 60% (the game crops the top and bottom for a wide banner). No text, letters, numbers, emblems, crests, holy symbols or logos anywhere.
- Icons: Painted game-item art in the same hand as the attached approved busts and chests: soft painterly rendering with visible but controlled brushwork, warm key light from the upper left, gentle rim light, rich but slightly muted Western medieval frontier colors, a subtle darker outline so the shape reads on dark UI. Objects in three-quarter view, centered, filling about 80% of their cell, every object fully inside its cell with an even margin. Each icon must still be recognisable at 40×40 px: one clear silhouette, strong value contrast, no tiny clutter. No text, letters, numbers, runes, emblems, crests, holy symbols or logos anywhere. No hands or people except the small abstract silhouettes named in a few skill icons.
- Never write the name of any existing game, character or studio in a prompt, and do not copy any existing artwork.
- Scenes: exactly 1600×900 PNG, opaque. Icon sheet: 4×4 cells of 256 px, cells 03–16 empty, every icon inside the 80 % safe square of its cell, transparent (or `#00FF00`).
- Final sizes must be exact. Resize keeping the aspect ratio and pad or center-crop; never stretch.

## 5. Order of work

- **A:** `ending_a.png` → `ending_b.png` → `ending_c.png` → `epilogue.png`.
- **B:** `icons_O.png`.

## 6. Self-check (record PASS/FAIL per item in each zip's QA_REPORT.md)

- [ ] Every scene exactly 1600×900 PNG; the icon sheet exactly 1024×1024 PNG with real transparency or pure `#00FF00` (say which).
- [ ] No text, letters, numbers, emblems, crests, holy symbols or logos anywhere.
- [ ] Named characters match their attached busts (faces, hair, outfits, colours).
- [ ] Each ending shows its cost as the prompt says; none of the three looks like the "good" ending; no one wears the crown.
- [ ] The important action sits in the central 60 % of each scene; the epilogue background keeps its lower third quiet.
- [ ] Icon sheet: 2 icons in cells 01–02, the other cells fully transparent, same finish as the approved icon sheets.

## 7. Return format — two zips, **each under 20 MB**

- `Ashen_Crown_v100_ACT4_Art_Pack_G4_A.zip` — part A: the four scenes
- `Ashen_Crown_v100_ACT4_Art_Pack_G4_B.zip` — part B: icon sheet O

```
Ashen_Crown_v100_ACT4_Art_Pack_G4_<A|B>/
  png/                # PNG masters
  manifest.csv        # A: id,kind,path,width,height,bytes,sha256
  manifest_icons.csv  # B: sheet,file,width,height,background,bytes,sha256
  SHA256SUMS.txt      # sha256  path
  QA_REPORT.md        # the checklist above, generation notes, deviations
  contact_sheet.jpg   # thumbnails with file names, JPEG under 1 MB
  prompts_used/       # the exact final prompt per image
```

- **Before you hand a zip over, reopen it and test it** (the whole archive must open and list every file; then verify every file against SHA256SUMS). Report each zip's exact size in bytes so a cut-off download can be spotted. Do not include WebP.
- If an item cannot be met, still deliver your best image and state the deviation plainly in QA_REPORT.md. Do not claim a check passed unless you performed it.
