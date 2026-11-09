# QA_REPORT — F4 Part A: Props and Icons

Produced after Part B, in requested order: props_act3d.png → icons_K.png. Original painted game art generated with the built-in image generator and the supplied references.

## Per-item checks

| Check | Result | Evidence / scope |
|---|---|---|
| Two requested PNG masters present | PASS | props_act3d.png and icons_K.png. |
| Prop sheet exactly 1024×256 | PASS | Decoded final PNG; four 256×256 cells. |
| Icon sheet exactly 1024×1024 | PASS | Decoded final PNG; sixteen 256×256 cells. |
| Real transparent alpha | PASS | Both PNGs RGBA, alpha range 0–255. No green key or painted backdrop. |
| No text, letters, emblems, crests, holy symbols or logos | PASS | Visual inspection: plain metal bands, smooth unengraved ring stone, plain pennon, mace and horn. |
| Anchor stone whole / broken in cells 1 / 2 | PASS | Whole obelisk has three violet bands; broken state has a central stump and two fallen upper chunks, no emitted light. |
| Two stone states line up | PASS | Main-stone base centers placed at local x=128, floor anchor y=240, with a common uniform scale. Broken top naturally lowers the surviving silhouette; rubble extends beside the stump. |
| Prop cells 3–4 entirely empty | PASS | Every alpha value in final x≥512 equals zero. |
| Icon cells 01–04 correct | PASS | Lance with slate-blue pennon; ivory/gold-grip steel mace; violet-stone old gold signet; brass horn with cream cord and leather grip. |
| Icon cells 05–16 entirely transparent | PASS | Every alpha value in final y≥256 equals zero. |
| All icons, including glows, within 80% safe square | PASS | Final alpha bounds within local [26,230) on both axes for each occupied cell. |
| Approved icon finish / lighting | PASS | Visual comparison against approved D and H: painted metal, warm upper-left light, dark contour and clear silhouette. |
| Recognizable at 40×40 per icon | PASS | Four reduced cell thumbnails reviewed: distinct lance, mace, ring and curved horn silhouettes. |
| Contact sheet JPEG below 1 MB | PASS | Size checked during packaging. |
| Whole archive opens and hashes match | PASS | Reopened completed ZIP, checked CRC for all entries and SHA256 for every payload listed in SHA256SUMS.txt. |

## Generation and formatting notes

- Exact initial and revision prompts are included in prompts_used/. The icon spacing revision introduced a pale backdrop and was superseded by a transparent-background extraction revision.
- Generated prop canvas was 2172×724, rather than the requested 4:1 canvas. The first two logical cells were separated and uniformly resized with the same scale, then padded into the final 4-cell strip. No art was stretched. Main-stone floor centers were aligned; unused cells are empty.
- Each final icon was uniformly fitted into a 204×204 safe square and centered in its 256×256 cell. No art was stretched.
- Isolated practically invisible alpha≤1/255 generation noise was removed; the lower twelve icon cells and two unused prop cells contain no visible or hidden alpha pixels.
- These image assets have not been integrated into, or play-tested in, the game.
- PNG masters, manifests, checksums, exact prompts, layout normalization details and the supplied cell/prop metadata are included. No WebP or reference-image duplicates are included.
