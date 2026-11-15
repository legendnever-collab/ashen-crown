# Ashen Crown — ACT IV Part 3 Art Work Order (pack G3, v0.10.2)

You are producing finished game art for **Ashen Crown**, an original offline tactical RPG (Western medieval frontier fantasy). Read this whole file first, then do the jobs in order and return the zip described in section 7.
The game already plays with temporary game-drawn art for everything in this pack. It has **2 images in one part** (A).

| part | what | images |
|---|---|---:|
| **A** | things — battle props (the siege ram, a scaling ladder, a memory fragment glowing and read), icon sheet N (Aren's last order, two treasures) | 2 |

## 1. Part A — things (2 images)

| # | file | what | size (px) | attach | prompt |
|---|---|---|---|---|---|
| 1 | `props_act4c.png` | props_act4c | 1024×256 | layout_props_act4c.png, ref_sprite_eric.png, ref_sprite_ironSpear.png, ref_battle_m27.jpg, ref_battle_m28.jpg | `prompts/01_props_act4c.txt` |
| 2 | `icons_N.png` | icon sheet N | 1024×1024 | layout_icons_N.png, approved_icons_D.png, approved_icons_H.png, style_aren_neutral.png | `prompts/02_icons_N.txt` |

| cell | id | icon |
|---|---|---|
| N01 | `lastOrder` | Aren's Last Order: To the End, Together (아렌의 군령 · 끝까지 함께) |
| N02 | `ramHead` | The Ram's Iron Head (성문 파쇄추의 쇠머리) |
| N03 | `nightLocket` | The Ashen Night Locket (잿빛 밤의 목걸이) |

| prop cell | id | prop |
|---|---|---|
| 1 | `ram` | siege ram |
| 2 | `ladder` | scaling ladder |
| 3 | `memory` | memory fragment |
| 4 | `memory_read` | memory fragment — read |

## 4. Global rules

- Icons: Painted game-item art in the same hand as the attached approved busts and chests: soft painterly rendering with visible but controlled brushwork, warm key light from the upper left, gentle rim light, rich but slightly muted Western medieval frontier colors, a subtle darker outline so the shape reads on dark UI. Objects in three-quarter view, centered, filling about 80% of their cell, every object fully inside its cell with an even margin. Each icon must still be recognisable at 40×40 px: one clear silhouette, strong value contrast, no tiny clutter. No text, letters, numbers, runes, emblems, crests, holy symbols or logos anywhere. No hands or people except the small abstract silhouettes named in a few skill icons.
- Props: Painting style: match the attached approved art (style_aren_neutral.png and the attached exterior hub map) — hand-painted fantasy illustration with confident contours, painterly cel shading with soft gradients, warm rim light, rich but slightly earthy colors, detailed but readable textures. Original world: do not imitate any existing game's rooms, furniture designs, emblems or layout.
- Never write the name of any existing game, character or studio in a prompt, and do not copy any existing artwork.
- **No text, letters, numbers, emblems, crests, holy symbols or logos** anywhere (the ram, the ladder, the locket, the cloak).
- Prop sheet: exactly 1024×256, 4 cells of 256 px in one row, each prop centered with its base on the red baseline 16 px above the cell bottom, the same scale as the attached map figures (a character is about 150 px tall in a cell), transparent (or `#00FF00`).
- Icon sheet N: 4×4 cells of 256 px, cells 04–16 empty, every icon inside the 80 % safe square of its cell.
- Final sizes must be exact. Resize keeping the aspect ratio and pad or center-crop; never stretch.

## 5. Order of work

- **A:** `props_act4c.png` → `icons_N.png`.

## 6. Self-check (record PASS/FAIL per item in the zip's QA_REPORT.md)

- [ ] `props_act4c.png` exactly 1024×256 and `icons_N.png` exactly 1024×1024 (PNG); real transparency or pure `#00FF00` (say which per file).
- [ ] No text, letters, emblems, holy symbols or logos anywhere.
- [ ] Props: the ram points up the map; the ladder is upright and fills the cell height; `memory` and `memory_read` are the same shard and plinth at the same size and place (only glow and colour differ); every base on the baseline, nothing cut at cell edges.
- [ ] Icon sheet: 3 icons in cells 01–03, the other cells fully transparent, same finish as the approved icon sheets.

## 7. Return format — one zip, **under 20 MB**

- `Ashen_Crown_v0102_ACT4_Art_Pack_G3_A.zip` — part A: things — battle props (the siege ram, a scaling ladder, a memory fragment glowing and read), icon sheet N (Aren's last order, two treasures)

```
Ashen_Crown_v0102_ACT4_Art_Pack_G3_A/
  png/                # PNG masters (props_act4c.png, icons_N.png)
  manifest.csv        # props: id,kind,path,width,height,bytes,sha256
  manifest_icons.csv  # sheet,file,width,height,background,bytes,sha256
  SHA256SUMS.txt      # sha256  path
  QA_REPORT.md        # the checklist above, generation notes, deviations
  contact_sheet.jpg   # thumbnails with file names, JPEG under 1 MB
  prompts_used/       # the exact final prompt per image
```

- **Before you hand the zip over, reopen it and test it** (the whole archive must open and list every file; then verify every file against SHA256SUMS). Report the zip's exact size in bytes so a cut-off download can be spotted. Do not include WebP.
- If an item cannot be met, still deliver your best image and state the deviation plainly in QA_REPORT.md. Do not claim a check passed unless you performed it.
