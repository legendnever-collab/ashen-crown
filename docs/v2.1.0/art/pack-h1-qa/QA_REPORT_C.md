# Ashen Crown H1 — Part C QA

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
- [UNVERIFIED] Tier-3 ash-grey trim and warm-gold ward are lightly indicated for C, full finishing requires original repaint.

## Image inventory

- `class_infantry_3.png`: (1024, 768), 570021 bytes
- `class_spear_3.png`: (1024, 768), 530265 bytes
- `class_archer_3.png`: (1024, 768), 416077 bytes
- `class_cavalry_3.png`: (1024, 768), 524570 bytes
- `class_mage_3.png`: (1024, 768), 733493 bytes
- `class_healer_3.png`: (1024, 768), 772973 bytes
- `class_rogue_3.png`: (1024, 768), 678008 bytes
- `class_shield_3.png`: (1024, 768), 751502 bytes
