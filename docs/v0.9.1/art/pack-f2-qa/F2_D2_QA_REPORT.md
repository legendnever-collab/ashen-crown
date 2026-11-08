# Ashen Crown F2 — Part D2 QA

PASS and FAIL describe the submitted assets. N/A identifies checks for a different asset type.
Map layout is reviewed visually against the supplied sketches and approved JPEGs. Engine walkmesh and runtime playback require integration verification.

### bust_captain16_free_determined.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — the determined expression retains the same right-facing face, framing, light and green-and-cream half-plate, green cloak and multicolor sash. Faction palette matches the supplied troop; no visible lettering or insignia.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_captain16_free_sad.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — the sad expression retains the same right-facing face, framing, light and green-and-cream half-plate, green cloak and multicolor sash. Faction palette matches the supplied troop; no visible lettering or insignia.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_captain16_flame_determined.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — the determined expression retains the same right-facing face, framing, light and white armor, gold trim and crimson cloak. Faction palette matches the supplied troop; no visible lettering or insignia.
- Processing — 1122×1402 RGBA → 1024x1280.

### bust_captain16_flame_sad.png

- PASS — 1024×1280 PNG, transparent alpha.
- PASS — the sad expression retains the same right-facing face, framing, light and white armor, gold trim and crimson cloak. Faction palette matches the supplied troop; no visible lettering or insignia.
- Processing — 1122×1402 RGBA → 1024x1280.

### sprite_guardianStatue.png

- PASS — 1024×768 PNG, transparent alpha.
- PASS — expected visible cells, cell margins and visible-alpha baselines.
- PASS — revised sheet uses the sleeping prop as the character reference. Matte granite, moss, tower shield, closed helm and sword match the prop; no fabric or lettering. Three rows face down, right and up.
- FAIL — eye light reads weakly at map scale, and some step A/B poses are nearly identical.
- Processing — 1448×1086 RGBA → 1024x768 · sheet cells separated and positioned with aspect ratio preserved.

### sprite_forester.png

- PASS — 1024×768 PNG, transparent alpha.
- PASS — expected visible cells, cell margins and visible-alpha baselines.
- PASS — down, right and up rows; herb satchel, walking staff and startled gesture are present, with no visible lettering or insignia.
- FAIL — the front and rear step A/B poses are very similar.
- Processing — 1448×1086 RGBA → 1024x768 · sheet cells separated and positioned with aspect ratio preserved.

### sprite_greyCaptain.png

- PASS — 1024×768 PNG, transparent alpha.
- PASS — expected visible cells, cell margins and visible-alpha baselines.
- PASS — down, right and up rows; two-handed sword and overhead cut in the final column; no visible lettering or insignia.
- FAIL — two walk steps are near-duplicates, and the plum accent is muted.
- Processing — 1448×1086 RGBA → 1024x768 · sheet cells separated and positioned with aspect ratio preserved.

