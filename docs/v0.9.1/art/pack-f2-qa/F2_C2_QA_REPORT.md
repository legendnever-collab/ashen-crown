# Ashen Crown F2 — Part C2 QA

PASS and FAIL describe the submitted assets. N/A identifies checks for a different asset type.
Map layout is reviewed visually against the supplied sketches and approved JPEGs. Engine walkmesh and runtime playback require integration verification.

### bust_ines_t2_neutral.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — compared against the old portrait and the new neutral: same face, right-facing framing, hair and warm lighting. The neutral expression retains white-and-gold armor, red cloak and round gold-rimmed shield; no visible text or emblem.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_ines_t2_concerned.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — compared against the old portrait and the new neutral: same face, right-facing framing, hair and warm lighting. The concerned expression retains white-and-gold armor, red cloak and round gold-rimmed shield; no visible text or emblem.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_ines_t2_determined.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — compared against the old portrait and the new neutral: same face, right-facing framing, hair and warm lighting. The determined expression retains white-and-gold armor, red cloak and round gold-rimmed shield; no visible text or emblem.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_ines_t2_sad.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — compared against the old portrait and the new neutral: same face, right-facing framing, hair and warm lighting. The sad expression retains white-and-gold armor, red cloak and round gold-rimmed shield; no visible text or emblem.
- Processing — 1122×1402 RGBA → 1024x1280.

### sprite_ines_t2.png

- PASS — 1024×768 PNG, transparent alpha.
- PASS — expected visible cells, cell margins and visible-alpha baselines.
- PASS — three directions with right-facing second row. Poleaxe, gold-rimmed white round shield and crimson cape match the design. No visible text or emblem.
- FAIL — the front and rear walking poses A and B differ only slightly.
- Processing — 1448×1086 RGBA → 1024x768 · sheet cells separated and positioned with aspect ratio preserved.

