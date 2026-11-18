# Ashen Crown H1 — Part A QA

**Source:** user-supplied v210 H1 work pack. **Method:** source-reference-assisted digital artwork/derivative development. This is a best-effort working draft, not a verified fully repainted art set.

- [PASS] exact output dimensions for 8 files (Pillow inspection)
- [PASS] RGBA on requested sprite/bust/icon outputs; opaque JPEG on room/hub outputs
- [PASS] all required filenames present, image decoders succeed
- [PASS] per-file SHA256 manifest written; package archive reopened and cross-checked

## Artist QA / deviations

- [FAIL — new painting] This batch is a controlled derivative of user-supplied reference sprite sheets, not freshly hand-painted original figures. Artist replacement/review is required.
- [PARTIAL — magenta] Added three exact magenta keyed shades to cloth overlays (alpha composited). Existing source cloth remains in other colors; automated semantic segmentation cannot certify all team cloth is keyed.
- [PASS — layout] 12 separate frames, transparent cell backgrounds, 256px grid geometry; frame feet aligned to y=240 after resizing.
- [PARTIAL — frames] Source frame anatomy and attack poses kept; tier-specific combat animation not independently reanimated.
- [UNVERIFIED] Style match to approved assets and no marks/emblems require visual review.

## Image inventory

- `class_infantry_1.png`: (1024, 768), 447517 bytes
- `class_spear_1.png`: (1024, 768), 390707 bytes
- `class_archer_1.png`: (1024, 768), 382884 bytes
- `class_cavalry_1.png`: (1024, 768), 502974 bytes
- `class_mage_1.png`: (1024, 768), 618277 bytes
- `class_healer_1.png`: (1024, 768), 607754 bytes
- `class_rogue_1.png`: (1024, 768), 653409 bytes
- `class_shield_1.png`: (1024, 768), 461090 bytes
