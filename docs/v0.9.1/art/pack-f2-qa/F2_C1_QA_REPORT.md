# Ashen Crown F2 — Part C1 QA

PASS and FAIL describe the submitted assets. N/A identifies checks for a different asset type.
Map layout is reviewed visually against the supplied sketches and approved JPEGs. Engine walkmesh and runtime playback require integration verification.

### bust_thea_t2_neutral.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — compared against the old portrait and the new neutral: same face, right-facing framing, hair and warm lighting. The neutral expression retains blackened plate, dark steel-blue trim and a gray fur collar; no visible text or emblem.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_thea_t2_concerned.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — compared against the old portrait and the new neutral: same face, right-facing framing, hair and warm lighting. The concerned expression retains blackened plate, dark steel-blue trim and a gray fur collar; no visible text or emblem.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_thea_t2_determined.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — the determined expression retains the established face, hair, dark plate, fur and lighting; it visually matches the previous-tier face and new neutral. No visible text or emblem.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_thea_t2_sad.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — compared against the old portrait and the new neutral: same face, right-facing framing, hair and warm lighting. The sad expression retains blackened plate, dark steel-blue trim and a gray fur collar; no visible text or emblem.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_dario_t2_neutral.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — compared against the old portrait and the new neutral: same face, right-facing framing, hair and warm lighting. The neutral expression retains teal-and-wine coat, chainmail and low-tied hair; no visible text or emblem.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_dario_t2_concerned.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — compared against the old portrait and the new neutral: same face, right-facing framing, hair and warm lighting. The concerned expression retains teal-and-wine coat, chainmail and low-tied hair; no visible text or emblem.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_dario_t2_determined.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — compared against the old portrait and the new neutral: same face, right-facing framing, hair and warm lighting. The determined expression retains teal-and-wine coat, chainmail and low-tied hair; no visible text or emblem.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_dario_t2_sad.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — compared against the old portrait and the new neutral: same face, right-facing framing, hair and warm lighting. The sad expression retains teal-and-wine coat, chainmail and low-tied hair; no visible text or emblem.
- Processing — 1122×1402 RGBA → 1024x1280.

### sprite_thea_t2.png

- PASS — 1024×768 PNG, transparent alpha.
- PASS — expected visible cells, cell margins and visible-alpha baselines.
- PASS — gray horse with black barding and steel-blue cloth in all 12 cells. Right-facing side row, long lance and distinct charge pose; rider matches the bust. No visible lettering or insignia.
- FAIL — side-view step A/B hoof poses are very similar; the plain black pennant is subdued.
- Processing — 1448×1086 RGBA → 1024x768 · sheet cells separated and positioned with aspect ratio preserved.

### sprite_dario_t2.png

- PASS — 1024×768 PNG, transparent alpha.
- PASS — expected visible cells, cell margins and visible-alpha baselines.
- PASS — three directions with right-facing second row. Teal and wine coat, hair and one-handed longsword match the design. No visible text or emblem.
- FAIL — the front and rear walking poses A and B differ only slightly.
- Processing — 1448×1086 RGBA → 1024x768 · sheet cells separated and positioned with aspect ratio preserved.

