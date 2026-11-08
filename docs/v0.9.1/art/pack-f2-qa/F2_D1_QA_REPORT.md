# Ashen Crown F2 — Part D1 QA

PASS and FAIL describe the submitted assets. N/A identifies checks for a different asset type.
Map layout is reviewed visually against the supplied sketches and approved JPEGs. Engine walkmesh and runtime playback require integration verification.

### bust_guardianElder_neutral.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — the neutral expression matches the same right-facing face, composition, lighting and white beard, bald head, slate underlayer and plain aged steel armor. No visible lettering or emblem.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_guardianElder_concerned.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — the concerned expression matches the same right-facing face, composition, lighting and white beard, bald head, slate underlayer and plain aged steel armor. No visible lettering or emblem.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_guardianElder_sad.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — the sad expression matches the same right-facing face, composition, lighting and white beard, bald head, slate underlayer and plain aged steel armor. No visible lettering or emblem.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_forestElder_neutral.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — the neutral expression matches the same right-facing face, composition, lighting and grey-white braid with green ribbon, green-brown robes and undyed wool shawl. No visible lettering or emblem.
- FAIL — the requested faint smile is barely visible in the neutral portrait.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_forestElder_concerned.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — the concerned expression matches the same right-facing face, composition, lighting and grey-white braid with green ribbon, green-brown robes and undyed wool shawl. No visible lettering or emblem.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_forestElder_sad.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — the sad expression matches the same right-facing face, composition, lighting and grey-white braid with green ribbon, green-brown robes and undyed wool shawl. No visible lettering or emblem.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_captain16_iron_determined.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — the determined expression retains the same right-facing face, framing, light and steel-blue armor, gray fur and open steel helm. Faction palette matches the supplied troop; no visible lettering or insignia.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_captain16_iron_sad.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — the sad expression retains the same right-facing face, framing, light and steel-blue armor, gray fur and open steel helm. Faction palette matches the supplied troop; no visible lettering or insignia.
- Processing — 1122×1402 RGBA → 1024x1280.

### sprite_guardianElder.png

- PASS — 1024×768 PNG, transparent alpha.
- PASS — expected visible cells, cell margins and visible-alpha baselines.
- PASS — down, right and up rows with staff-like spear and a thrust. White beard, gray mantle and slate fabric match the portrait. No visible lettering or insignia.
- FAIL — walking step A/B separation is weak in the front and rear rows.
- Processing — 1448×1086 RGBA → 1024x768 · sheet cells separated and positioned with aspect ratio preserved.

### sprite_forestElder.png

- PASS — 1024×768 PNG, transparent alpha.
- PASS — expected visible cells, cell margins and visible-alpha baselines.
- PASS — down, right and up rows, with the leaf-tipped staff and calm raised-hand gesture; the green ribbon, braid and shawl match the bust. No visible text.
- FAIL — front and rear walking steps are very similar.
- Processing — 1448×1086 RGBA → 1024x768 · sheet cells separated and positioned with aspect ratio preserved.

