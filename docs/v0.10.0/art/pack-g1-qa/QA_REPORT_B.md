# G1 B — QA report

Created 2026-11-10. All images generated with the built-in image generator using the supplied reference art. Exact prompts, including correction prompts, are in prompts_used/. No approval from the user is implied by selection of these deliverables.

## Technical checks

- PASS: all requested PNG files present and decoded successfully.
- PASS: exact final dimensions checked programmatically against jobs.csv.
- PASS: genuine RGBA transparency in every PNG; alpha extrema 0–255. No green-screen substitute.
- PASS: aspect ratio preserved during resizing; transparent padding used. Sprite/prop cells resized uniformly per sheet, icons fitted individually to 204 px safe squares.
- PASS: contact sheet is JPEG and smaller than 1,000,000 bytes.
- PASS: visually inspected generated art and final contact sheets for forbidden text, emblems, logos and holy symbols; none observed.
- PASS: final ZIP reopened, CRC checked and every payload SHA256 verified by the packaging script.

## File inventory

| File | Size | Background |
|---|---|---|
| bust_ines_t3_neutral.png | 1024×1280 | transparent RGBA |
| bust_ines_t3_concerned.png | 1024×1280 | transparent RGBA |
| bust_ines_t3_determined.png | 1024×1280 | transparent RGBA |
| bust_ines_t3_sad.png | 1024×1280 | transparent RGBA |
| bust_thea_t3_neutral.png | 1024×1280 | transparent RGBA |
| bust_thea_t3_concerned.png | 1024×1280 | transparent RGBA |
| bust_thea_t3_determined.png | 1024×1280 | transparent RGBA |
| bust_thea_t3_sad.png | 1024×1280 | transparent RGBA |
| sprite_ines_t3.png | 1024×768 | transparent RGBA |
| sprite_thea_t3.png | 1024×768 | transparent RGBA |

## Character checks

- PASS (visual): Ines retains short dark hair, thin braid, nose scar, white/gold/crimson colors; Thea retains copper ponytail, grey-blue eyes, chin scar and black/steel-blue colors.
- PASS (visual): four distinct expressions per character with consistent costume, pose and lighting. Exact pixel identity outside the face is not guaranteed; small painted edge/texture differences remain.
- PASS (visual): each sprite sheet contains 12 figures in 4×3 arrangement; rows down/right/back, columns idle/step A/step B/attack. Thea is mounted and wears a helmet in all 12 final frames.
- PASS: all final cell content fits within the cell; no additional clipping introduced during layout.
- FAIL (strict baseline): visible alpha bounds were bottom-aligned to y=240 in each 256 px cell. Feet/hooves themselves were visually checked, but weapon tips/shadows and lifted walking feet prevent claiming exact foot-level equality in every frame.

## Deviations / integration review

- Ines: correction generated shield-plant attack poses, but dawn light remains a rounded glow rather than a clean thin open-gate arch. Some glow was already cropped at the generated source top edge; final padding cannot restore missing paint. Body and weapons remain intact.
- Thea: row 1, column 2 has a small extra angled lance-tip-like protrusion near the top of the upright lance after the helmet correction. It is preserved and disclosed rather than marked as clean.
- Back-facing attack frames remain somewhat diagonal, similar to the supplied reference. A strict straight-away directional pose is not claimed.
- Compare scale in game before final acceptance: within-sheet scale is normalized; exact old-to-new silhouette equality is not asserted.
- No in-game animation playback or engine import was performed in this art-production task.
