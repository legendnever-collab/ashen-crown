# Ashen Crown F2 — Part B1 QA

PASS and FAIL describe the submitted assets. N/A identifies checks for a different asset type.
Map layout is reviewed visually against the supplied sketches and approved JPEGs. Engine walkmesh and runtime playback require integration verification.

### bust_eric_t3_neutral.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — visually compared with old and new base portraits: same identity, warm lighting and right-facing framing; aged steel, stone-gray mantle and shield match the new design. The neutral expression reads as intended; no visible letters.
- FAIL — an inherited flame emblem remains on the chest.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_eric_t3_concerned.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — visually compared with old and new base portraits: same identity, warm lighting and right-facing framing; aged steel, stone-gray mantle and shield match the new design. The concerned expression reads as intended; no visible letters.
- FAIL — an inherited flame emblem remains on the chest.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_eric_t3_determined.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — visually compared with old and new base portraits: same identity, warm lighting and right-facing framing; aged steel, stone-gray mantle and shield match the new design. The determined expression reads as intended; no visible letters.
- FAIL — an inherited flame emblem remains on the chest.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_eric_t3_sad.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — visually compared with old and new base portraits: same identity, warm lighting and right-facing framing; aged steel, stone-gray mantle and shield match the new design. The sad expression reads as intended; no visible letters.
- FAIL — an inherited flame emblem remains on the chest.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_elina_t3_neutral.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — visually compared with old and new base portraits: same identity, warm lighting and right-facing framing; red braid, green leather outfit, feather mantle and quiver match the new design. The neutral expression reads as intended; no visible letters.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_elina_t3_concerned.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — visually compared with old and new base portraits: same identity, warm lighting and right-facing framing; red braid, green leather outfit, feather mantle and quiver match the new design. The concerned expression reads as intended; no visible letters.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_elina_t3_determined.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — visually compared with old and new base portraits: same identity, warm lighting and right-facing framing; red braid, green leather outfit, feather mantle and quiver match the new design. The determined expression reads as intended; no visible letters.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_elina_t3_sad.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — visually compared with old and new base portraits: same identity, warm lighting and right-facing framing; red braid, green leather outfit, feather mantle and quiver match the new design. The sad expression reads as intended; no visible letters.
- Processing — 1122×1402 RGBA → 1024x1280.

### sprite_eric_t3.png

- PASS — 1024×768 PNG, transparent alpha.
- PASS — expected visible cells, cell margins and visible-alpha baselines.
- PASS — three directions with the side row facing right; idle, walk and distinct sword attack are present. Stone-gray mantle and aged steel match the bust; no visible letters.
- FAIL — inherited shield device remains; walk A/B are near-duplicates in the front and rear rows.
- Processing — 1448×1086 RGBA → 1024x768 · sheet cells separated and positioned with aspect ratio preserved.

### sprite_elina_t3.png

- PASS — 1024×768 PNG, transparent alpha.
- PASS — expected visible cells, cell margins and visible-alpha baselines.
- PASS — down, right and up rows; feather mantle, braid, bow and colors match the bust. No visible text or emblem.
- FAIL — down and up attacks angle sideways relative to the movement axes, and the walking steps are very similar in the front and rear rows.
- Processing — 1448×1086 RGBA → 1024x768 · sheet cells separated and positioned with aspect ratio preserved.

