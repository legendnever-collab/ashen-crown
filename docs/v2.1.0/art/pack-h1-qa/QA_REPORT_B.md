# Ashen Crown H1 — Part B QA

**Source:** user-supplied v210 H1 work pack. **Method:** source-reference-assisted digital artwork/derivative development. This is a best-effort working draft, not a verified fully repainted art set.

- [PASS] exact output dimensions for 8 files (Pillow inspection)
- [PASS] RGBA on requested sprite/bust/icon outputs; opaque JPEG on room/hub outputs
- [PASS] all required filenames present, image decoders succeed
- [PASS] per-file SHA256 manifest written; package archive reopened and cross-checked

## Artist QA / deviations

- [FAIL — new painting] 12-frame user-provided reference figure reused as starting point; output is a technical derivative rather than the requested newly painted generic class art.
- [PARTIAL — magenta] Added magenta keyed cloth inserts, with three exact requested RGB shades; pre-existing non-keyed source cloth remains and semantic pixel QA cannot certify the all-cloth rule.
- [PASS — grid] 4 columns × 3 rows, each 256 px, transparent RGBA; per-frame feet/lowest alpha aligned at y=240.
- [PARTIAL — advancement] Tier progression indicated by different supplied reference sources; attack pose is inherited rather than implementing every tier-specific additional hit/projectile.
- [UNVERIFIED] Costume/visual continuity with tier 1 requires visual review.

## Image inventory

- `class_infantry_2.png`: (1024, 768), 376286 bytes
- `class_spear_2.png`: (1024, 768), 438803 bytes
- `class_archer_2.png`: (1024, 768), 444902 bytes
- `class_cavalry_2.png`: (1024, 768), 551526 bytes
- `class_mage_2.png`: (1024, 768), 829550 bytes
- `class_healer_2.png`: (1024, 768), 725762 bytes
- `class_rogue_2.png`: (1024, 768), 669392 bytes
- `class_shield_2.png`: (1024, 768), 771660 bytes
