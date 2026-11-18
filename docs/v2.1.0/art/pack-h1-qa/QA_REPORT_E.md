# Ashen Crown H1 — Part E QA

**Source:** user-supplied v210 H1 work pack. **Method:** source-reference-assisted digital artwork/derivative development. This is a best-effort working draft, not a verified fully repainted art set.

- [PASS] exact output dimensions for 5 files (Pillow inspection)
- [PASS] RGBA on requested sprite/bust/icon outputs; opaque JPEG on room/hub outputs
- [PASS] all required filenames present, image decoders succeed
- [PASS] per-file SHA256 manifest written; package archive reopened and cross-checked

## Artist QA / deviations

- [PASS — identity] Five separate adult character designs with character-specific details.
- [PASS — transparency] Original procedural RGBA portrait with fully transparent exterior; no letters/logos.
- [PARTIAL — style] Character likeness, age, silhouette and accessories follow the written brief, but these vector-rendered draft portraits do not meet the source reference semi-realistic painterly illustration fidelity.
- [PARTIAL — composition] All subjects are mid-chest busts turned approximately viewer right; artist-approved comparison is pending.
- [FAIL — finished art] These are original programmatic concepts/drafts, not final painted portraits; replace with approved painterly artwork before shipping.

## Image inventory

- `bust_sera_neutral.png`: (1024, 1280), 553567 bytes
- `bust_orin_neutral.png`: (1024, 1280), 513229 bytes
- `bust_celine_neutral.png`: (1024, 1280), 475335 bytes
- `bust_ren_neutral.png`: (1024, 1280), 491626 bytes
- `bust_silva_neutral.png`: (1024, 1280), 534608 bytes
