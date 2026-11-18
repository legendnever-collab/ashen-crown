# Ashen Crown H1 — Part F QA

**Source:** user-supplied v210 H1 work pack. **Method:** source-reference-assisted digital artwork/derivative development. This is a best-effort working draft, not a verified fully repainted art set.

- [PASS] exact output dimensions for 3 files (Pillow inspection)
- [PASS] RGBA on requested sprite/bust/icon outputs; opaque JPEG on room/hub outputs
- [PASS] all required filenames present, image decoders succeed
- [PASS] per-file SHA256 manifest written; package archive reopened and cross-checked

## Artist QA / deviations

- [PASS — format] Three 1536×1024 opaque JPEGs, no people, text or rendered interface.
- [PASS — footprint] Hub building positions, doorways, square, paths and well inherited from the supplied approved village layout.
- [PARTIAL — environment] Tavern reuses the approved capital tavern as the base, revised with village hearth and blank notice board rather than newly painted from scratch. Design positions are approximate.
- [PARTIAL — reserved floor] Required CHEST/KEEPER coordinates were intentionally left without added props; existing base imagery and exact walkability/collision should be checked in engine.
- [PARTIAL — distinct villages] Roof textures, water/river props and well repairs added to reference village; variation is less substantial than a finished original environment repaint.
- [UNVERIFIED] Art-director style review and gameplay walkability test pending.

## Image inventory

- `int_village_tavern.jpg`: (1536, 1024), 518015 bytes
- `hub_reed.jpg`: (1536, 1024), 727356 bytes
- `hub_stonewell.jpg`: (1536, 1024), 728469 bytes
