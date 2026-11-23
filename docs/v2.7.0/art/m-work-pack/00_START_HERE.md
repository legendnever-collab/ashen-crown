# Ashen Crown — v2.7.0 Art Work Order (pack M: the village request board)

You are producing finished game art for **Ashen Crown**, an original offline tactical RPG (Western medieval frontier fantasy, painted style). Read this whole file first and return one zip (section 5).

| part | what | images |
|---|---|---:|
| **A** | the request board that stands in the square of the eight small villages | 1 |

## 1. Job

| # | file | what | size | attach | prompt |
|---|---|---|---|---|---|
| 1 | `prop_request_board.png` | the county office's request board (posts, a small roof, pinned notices, a pennant) | 512×512, transparent | style_aren_neutral.png, approved_hub_reed.jpg, approved_hub_village_day.jpg, square_placement.png, scale_reference.png, sprite_eric_sheet.png | `prompts/01_prop_request_board.txt` |

## 2. Where it goes
It stands on the cobbled square right of the well (see `references/square_placement.png`), in front of the painted village, at the same angle and light. The game draws it over all eight village paintings (river, snow, salt, lamp, moss, beacon and spring villages), so keep it neutral — no snow, no sea.

## 3. Global rules
- Exact size 512×512; real transparency (or flat pure `#00FF00`, stated in QA_REPORT.md).
- No text, letters, numbers, emblems or logos — the notices carry unreadable scribble lines only. No people. Nothing may imitate an existing game.

## 4. Self-check (record PASS/FAIL in QA_REPORT.md; do not claim a check you did not do)
- [ ] Exact size and format; the alpha method stated.
- [ ] Beside `style_aren_neutral.png` and the hub paintings it looks like the same artist's work (painted, not vector).
- [ ] At 128 px it still reads as a notice board of an official place (posts, roof, pinned sheets).
- [ ] The base sits near the bottom centre (posts' feet about y=470).

## 5. Return format — one zip under 20 MB
`Ashen_Crown_v270_Art_Pack_M_A.zip`
```
Ashen_Crown_v270_Art_Pack_M_A/
  png/prop_request_board.png
  manifest.csv        # id,kind,expression,file,width,height,sha256
  SHA256SUMS.txt
  QA_REPORT.md
```
