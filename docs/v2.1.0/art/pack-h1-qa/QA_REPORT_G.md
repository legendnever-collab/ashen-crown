# Ashen Crown H1 — Part G QA

**Source:** user-supplied v210 H1 work pack. **Method:** source-reference-assisted digital artwork/derivative development. This is a best-effort working draft, not a verified fully repainted art set.

- [PASS] exact output dimensions for 3 files (Pillow inspection)
- [PASS] RGBA on requested sprite/bust/icon outputs; opaque JPEG on room/hub outputs
- [PASS] all required filenames present, image decoders succeed
- [PASS] per-file SHA256 manifest written; package archive reopened and cross-checked

## Artist QA / deviations

- [PASS — formats] Arena 1600×900 opaque PNG, icon sheets 1024×1024 RGBA, lower 10 cells (P) and 8 cells (Q) transparent.
- [PASS — scene] Arena with left blue/right red plain banners, no people or text; center-left and center-right fighter areas remain clear.
- [PASS — cells] Six P treasures and eight Q UI objects in prescribed reading order, no captions, no painted text; empty cells truly transparent.
- [PARTIAL — visual] Original digital vector/pixel-style illustration — recognisable icon silhouettes, but not a close painterly match to approved reference icons.
- [PARTIAL — arena] Original procedural painterly dusk arena, but not a separately art-directed hand-painted illustration.
- [UNVERIFIED] End-to-end game import/display and artistic approval pending.

## Image inventory

- `arena.png`: (1600, 900), 944838 bytes
- `icons_P.png`: (1024, 1024), 37828 bytes
- `icons_Q.png`: (1024, 1024), 14285 bytes
