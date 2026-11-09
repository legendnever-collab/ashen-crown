# QA_REPORT — F4 Part B: The Last King

Produced in order: neutral → concerned → determined → sad → map sheet. Original painted game art generated with the built-in image generator using the supplied style references; expression images use the newly generated neutral king as their model.

## Per-item checks

| Check | Result | Evidence / scope |
|---|---|---|
| Five requested PNG masters present | PASS | Four named expression busts and sprite_king.png. |
| Bust dimensions exactly 1024×1280 | PASS | Decoded each final PNG and checked dimensions. |
| Sprite exactly 1024×768, 4×3 cells | PASS | Decoded final PNG; twelve 256×256 cells inspected. |
| Real transparent alpha | PASS | All PNGs RGBA, alpha range 0–255; no green key or painted backdrop. |
| No text, letters, emblems, crests, holy symbols or logos | PASS | Visual review of all final masters. Circlet, staff head and clothing borders are plain. |
| Frail, dignified living king | PASS | White hair/beard, tired face, deep-violet robe and dark-crimson mantle. Faint violet shoulder effects; no monster/corpse depiction. |
| Same portrait identity, outfit, pose and lighting | PASS | All four final portraits visually compared together. Consistent head orientation to viewer’s right and garment design. |
| ONLY facial expression changes, with all other pixels identical | FAIL | Small generated brushwork differences remain in beard edges, garment texture and violet threads; silhouettes and design are visually consistent, not pixel-identical. |
| Concerned / determined / sad expressions distinct | PASS | Raised knit brows; lowered focused brows; downcast eyes respectively. |
| Sprite matches portrait costume and colors | PASS | Long white hair, white beard in front views, gold circlet, violet robe, crimson mantle, plain gold-capped wooden staff. |
| Twelve figures; down / RIGHT / up row directions | PASS | Visual review of each row. Right-facing profiles in row 2, back views in row 3. |
| Idle / step A / step B / pulse column arrangement | PASS | Column 1 idle, 2–3 walking poses, 4 staff raised with violet pulse. |
| Strict alternating left / right foot in every walking row | FAIL | Columns 2 and 3 are too similar in the front and back rows to certify strict opposite-foot animation; robe occlusion also limits inspection. This is a stationary NPC in M21; no smooth walk-cycle claim is made. |
| Approximately 3.5-head sprite proportions | FAIL | Figure proportions are somewhat taller/slimmer than the requested 3.5-head target (visually about 4–4.5 heads). |
| Common foot baseline 16 px above cell bottom | PASS | Each final cell’s lowest alpha≥128 foot pixel is local y=239; baseline is y=240. Lower-alpha antialiasing can extend a few pixels below. |
| No clipping at cell edges | PASS | Each final cell has fully transparent outermost rows/columns; visually inspected staff, hair, shoes and glow. |
| Contact sheet JPEG below 1 MB | PASS | Size checked during packaging. |
| Whole archive opens and file hashes match | PASS | Reopened completed ZIP, checked CRC for all entries and SHA256 for every payload listed in SHA256SUMS.txt. |

## Generation and formatting notes

- Exact prompts, including the sprite spacing revision, are in prompts_used/. The first sprite attempt was superseded to contain the raised-staff light effect.
- Bust source canvas was 1122×1402. It was uniformly resized and center-fitted to 1024×1280, without stretching.
- Sprite source was 1448×1086. Equal square source cells were uniformly resized to 256×256 and padded vertically to align their foot baseline. The same scale was used for all frames. See NORMALIZATION.json for shifts.
- Isolated practically invisible alpha≤1/255 generation noise was removed. Remaining soft alpha edges and light effects were preserved.
- This deliverable was inspected as image files and sprite cells. It has not been integrated into, or play-tested in, the game.
- Recorded FAIL items are retained deviations, not passed requirements. All five requested images are supplied as the best current result.
