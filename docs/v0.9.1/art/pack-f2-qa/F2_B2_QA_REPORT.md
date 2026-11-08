# Ashen Crown F2 — Part B2 QA

PASS and FAIL describe the submitted assets. N/A identifies checks for a different asset type.
Map layout is reviewed visually against the supplied sketches and approved JPEGs. Engine walkmesh and runtime playback require integration verification.

### bust_sain_t3_neutral.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — visually compared with old and new base portraits: same identity, warm lighting and right-facing framing; white curls, dawn-pink and gold robes and small lantern match the new design. The neutral expression reads as intended; no visible letters.
- FAIL — an inherited sun device remains on the chest.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_sain_t3_concerned.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — visually compared with old and new base portraits: same identity, warm lighting and right-facing framing; white curls, dawn-pink and gold robes and small lantern match the new design. The concerned expression reads as intended; no visible letters.
- FAIL — an inherited sun device remains on the chest.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_sain_t3_determined.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — visually compared with old and new base portraits: same identity, warm lighting and right-facing framing; white curls, dawn-pink and gold robes and small lantern match the new design. The determined expression reads as intended; no visible letters.
- FAIL — an inherited sun device remains on the chest.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_sain_t3_sad.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — compared with old and new base portraits: same identity, white curls, dawn-pink robes, lantern, lighting and framing; lowered eyes convey sadness. No visible lettering.
- FAIL — an inherited sun device remains on the chest.
- Processing — 1122×1402 RGBA → 1024x1280.

### sprite_sain_t3.png

- PASS — 1024×768 PNG, transparent alpha.
- PASS — expected visible cells, cell margins and visible-alpha baselines.
- PASS — three directions, right-facing side row, and idle/walk/cast poses. Robe palette, gold-ring staff, lantern and white curls match the bust; no visible text.
- FAIL — walking steps A and B look very similar in side view; alternating feet should be checked in engine.
- Processing — 1448×1086 RGBA → 1024x768 · sheet cells separated and positioned with aspect ratio preserved.

