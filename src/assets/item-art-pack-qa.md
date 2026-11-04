# Ashen Crown v0.8 — Item Art Pack E QA

Produced: 2026-11-04 (Asia/Seoul)

102 populated icon cells on seven sheets, in the requested A → B → C → D → E → F → G production order. The source pack's prompts, seven layout sketches, approved chest sheet, Aren portrait and shop UI reference were inspected. Art was generated with the built-in image generator, using those references. No existing commercial game art was requested or used.

## Required checklist

| Check | Result | Evidence / limits |
|---|---|---|
| Seven PNGs, exactly 1024×1024; alpha or pure green | PASS | All seven decoded and checked as 1024×1024 RGBA, with real transparent background. |
| Every cell exactly matches its prompt and layout; empty cells empty | FAIL (minor visual deviations) | All 102 IDs occupy their specified row-major cells. A16, E16 and G09–G16 are alpha-zero throughout. A10 and F12 differ from the detailed brief as documented below. |
| No text, letters, numbers, runes, heraldry, holy symbols, logos, grids or labels | PASS (visual review) | Reviewed full generated sheets and final previews. Functional arrows/chevrons, plain shield reinforcements and the four-way elemental flame effect are intentional. No writing was observed. This is visual inspection, not an OCR certification. |
| Every icon inside its safe square; nothing crosses cell edges | PASS | Programmatic check of every nonzero-alpha bounding box: all inside local [26,230) × [26,230). Occupied icons have a maximum dimension of 204px. |
| Recognisable at 160×160 sheet size (40×40 cells) | PASS with limits | Inspected a preview with each sheet reduced to 160×160 on dark UI color. Primary silhouettes remain readable. Similar long weapons and the three golden healing skills need their in-game names/tooltips for exact identity; fine material details disappear at this size. No player recognition study was performed. |
| Consistent light, finish and regional colors | PASS (visual review) | Warm upper-left material highlights; Iron Crown blue-grey/steel, Velmar crimson/brown/brass, Sacred Flame ivory/gold/crimson. F/G use the requested hero-color rim groups. Emissive effects have their own local light. |

## Background and count by sheet

| Sheet | Icons | Background | Empty cells |
|---|---:|---|---|
| A | 15 | transparent | 16 |
| B | 16 | transparent | none |
| C | 16 | transparent | none |
| D | 16 | transparent | none |
| E | 15 | transparent | 16 |
| F | 16 | transparent | none |
| G | 8 | transparent | 09–16 |

## Generation and packaging notes

- The generator returned 1254×1254 sources despite the 1024×1024 prompt. Packaging resampled and centered each generated motif into the exact requested 256×256 cells with at least 26px transparent margins. This was technical atlas assembly; the painted icon designs were retained.
- Sheet C's first result retained a partially opaque pale backdrop. A targeted image edit replaced that backdrop with green, preserving all 16 motifs. Chroma-key conversion then removed the green for the final RGBA atlas. The generation prompt and corrective prompt are both recorded in `prompts_used/icons_C.txt`.
- Source gutters were used when separating motifs. G's generated rows sat slightly below the ideal mathematical grid; its separation boundaries were adjusted to retain the full circular rims, then placed into the exact final grid.
- All sheets were reopened and decoded after saving. The final ZIP is reopened, CRC checked, and every entry listed in SHA256SUMS.txt is verified against its bytes from the archive. SHA256SUMS.txt excludes itself, and its archive integrity is covered by the ZIP CRC check.
- `contact_sheet.jpg` shows all seven sheets side by side, labeled A–G. Labels appear only on this preview, never in the PNG atlases. Its file size is below 1 MB.
- The pack does not include game integration or a game runtime test; it is the requested art handoff.

## Deviations and uncertain cells

| Cell | Observation | Assessment |
|---|---|---|
| A10 — Smoke Bomb | Reads as a tied cloth/powder pouch with smoke rather than a clearly visible cracked clay ball wrapped in cloth. | Usable smoke-consumable silhouette, but not an exact material/shape match. |
| F12 — Divine Recall | Golden recall beam is present, but the near figure has a visible cloak, hair and hand instead of being only a small abstract silhouette. | Usable action vignette, but exceeds the requested silhouette simplicity. |
| C09 — Lucky Coin | The face has mottled worn metal texture. | No readable markings observed; retain a visual check if the integration crop is enlarged. |
| B01 / B12 and C07 / C11 | Sword and narrow-blade families are visually similar at 40px. | Names/tooltips remain useful; their hilt, color and blade proportions differ. |

No unresolved technical format failures. The two visual deviations above are disclosed rather than claimed as exact prompt compliance.
