# G1 A — QA report

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
| props_act4a.png | 1024×256 | transparent RGBA |
| icons_L.png | 1024×1024 | transparent RGBA |

## Sheet checks

- PASS: 4 icons in cells 01–04, cells 05–16 have zero alpha everywhere.
- PASS: all four icon alpha bounds fit within the centered 204×204 safe square; warm painted finish visually compared to supplied icon sheets.
- PASS (visual): blue, green and red tents use the same overall roof/door structure and footprint; fourth tent is damaged with smoke.
- PASS: prop bases aligned to cell y=240 by visible alpha bounds; no neighboring-cell overlap.

## Deviations / integration review

- FAIL (strict square tent geometry): generated tents have a rounded pavilion-like peaked roof rather than the requested clearly square canvas command-tent plan.
- The first three tents are separately painted variants with closely matched proportions, not exact recolored copies; small contour/texture differences remain.
- Gate of the Sanctum is rendered as a light-filled architectural doorway, with the round shield in front; it is more solid than a purely light-only arch.
- Visual recognition checked on contact sheet. Actual 40×40 UI legibility and in-game battle scale require integration review.
