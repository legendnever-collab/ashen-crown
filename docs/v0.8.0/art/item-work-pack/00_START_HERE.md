# Ashen Crown — Item, Skill and Status Icon Work Order (pack E, v0.8)

You are producing finished game art for **Ashen Crown**, an original offline tactical RPG (Western medieval frontier fantasy). Read this whole file first, then paint the seven icon sheets in order and return the zip described in section 6.
The pack holds **102 icons** on **7 sheets**: tools, gear, unique treasures, status effects, battle commands and hero skills. Today the game draws these as tiny flat pixel rectangles, which clash with the painted portraits and towns; your icons replace them.

## 1. Sheets

| # | file | contents | layout | prompt |
|---|---|---|---|---|
| 1 | `icons_A.png` | tools and supplies (15) | `references/layout_icons_A.png` | `prompts/01_icons_A.txt` |
| 2 | `icons_B.png` | gear (basic and regional) (16) | `references/layout_icons_B.png` | `prompts/02_icons_B.txt` |
| 3 | `icons_C.png` | gear (regional) (16) | `references/layout_icons_C.png` | `prompts/03_icons_C.txt` |
| 4 | `icons_D.png` | gear (regional and elite) and treasures (16) | `references/layout_icons_D.png` | `prompts/04_icons_D.txt` |
| 5 | `icons_E.png` | treasures, status effects and commands (15) | `references/layout_icons_E.png` | `prompts/05_icons_E.txt` |
| 6 | `icons_F.png` | hero skills 1 (16) | `references/layout_icons_F.png` | `prompts/06_icons_F.txt` |
| 7 | `icons_G.png` | hero skills 2 (8) | `references/layout_icons_G.png` | `prompts/07_icons_G.txt` |

## 2. Sheet format

- Exactly **1024×1024 px PNG**, a 4×4 grid of 256×256 px cells, read left to right, top to bottom (cell 01 top-left, cell 16 bottom-right).
- **Real transparency**, or a flat pure `#00FF00` background if transparency is not possible (say which in QA_REPORT.md). No grid lines, cell numbers, labels or frames in the output; the layout sketches are only a guide.
- Keep every icon inside the inner safe square of its cell (about 26 px margin on each side). Nothing may cross into a neighbouring cell.
- Cells marked "leave empty" in a layout sketch stay fully empty (transparent or `#00FF00`).
- One shared light direction (upper left) and one scale logic per sheet: small objects (coins, rings) are drawn large enough to fill their cell.

## 3. Style (all sheets)

- Painted game-item art in the same hand as the attached approved busts and chests: soft painterly rendering with visible but controlled brushwork, warm key light from the upper left, gentle rim light, rich but slightly muted Western medieval frontier colors, a subtle darker outline so the shape reads on dark UI. Objects in three-quarter view, centered, filling about 80% of their cell, every object fully inside its cell with an even margin. Each icon must still be recognisable at 40×40 px: one clear silhouette, strong value contrast, no tiny clutter. No text, letters, numbers, runes, emblems, crests, holy symbols or logos anywhere. No hands or people except the small abstract silhouettes named in a few skill icons.
- Match the approved painted chests (`approved_chests_act2.png`) for material rendering (wood, iron, brass, cloth) and the bust (`style_aren_neutral.png`) for palette and finish.
- `ref_ui_shop.jpg` shows where icons appear: on dark parchment-and-wood UI panels, often at 40–64 px. Check each icon at that size.
- Regional families must be told apart at a glance: Iron Crown gear = dark blue-grey and polished steel; Velmar gear = crimson, dark brown and brass; Sacred Flame gear = ivory, gold trim and crimson.
- Skill icons (sheets F–G) are painted vignettes inside a round dark disk with a thin rim of light in the hero's color (given per cell). Status and command icons (sheet E) are bold simple shapes without a disk.
- Never write the name of any existing game, character or studio in a prompt, and do not copy any existing artwork.

## 4. Order of work

1. Sheet A (tools) first: it sets the finish for the whole pack.
2. Sheets B–D (gear and treasures), keeping the three regional color families distinct.
3. Sheet E (treasures, statuses, commands).
4. Sheets F–G (skills), one hero color per rim as listed.

## 5. Self-check (record PASS/FAIL per item in QA_REPORT.md)

- [ ] 7 PNG files, each exactly 1024×1024, transparent or pure `#00FF00` (say which per file).
- [ ] Every cell matches its id in the layout sketch and its description in the prompt; empty cells are empty.
- [ ] No text, letters, numbers, runes, emblems, crests, holy symbols or logos anywhere; no grid lines or labels.
- [ ] Every icon sits inside its safe square; nothing crosses a cell edge.
- [ ] Each icon is recognisable when the sheet is scaled to 160×160 px (each icon about 40 px).
- [ ] Consistent light direction, palette and finish across all sheets; regional gear families readable by color.

## 6. Return format — **one zip under 20 MB**

```
Ashen_Crown_v080_Item_Art_Pack_E/
  png/              # icons_A.png … icons_G.png
  manifest.csv      # sheet,file,width,height,background(transparent|00FF00),bytes,sha256
  SHA256SUMS.txt    # sha256  path
  QA_REPORT.md      # the checklist above, generation notes, deviations, any cell you are unsure about
  contact_sheet.jpg # all 7 sheets side by side with their letters, JPEG under 1 MB
  prompts_used/     # the exact final prompt per sheet
```

- Reopen the zip and verify every file against SHA256SUMS before finishing; report the zip size.
- If an item cannot be met, still deliver your best image and state the deviation plainly in QA_REPORT.md. Do not claim a check passed unless you performed it.
