# Ashen Crown H1 — Part D QA

**Source:** user-supplied v210 H1 work pack. **Method:** source-reference-assisted digital artwork/derivative development. This is a best-effort working draft, not a verified fully repainted art set.

- [PASS] exact output dimensions for 15 files (Pillow inspection)
- [PASS] RGBA on requested sprite/bust/icon outputs; opaque JPEG on room/hub outputs
- [PASS] all required filenames present, image decoders succeed
- [PASS] per-file SHA256 manifest written; package archive reopened and cross-checked

## Artist QA / deviations

- [PASS — expressions] Faces and costume geometry use the same character parameter set across all three expressions; only brows/mouth differ.
- [PASS — transparency] Original procedural RGBA portrait with fully transparent exterior; no letters/logos.
- [PARTIAL — style] Character likeness, age, silhouette and accessories follow the written brief, but these vector-rendered draft portraits do not meet the source reference semi-realistic painterly illustration fidelity.
- [PARTIAL — composition] All subjects are mid-chest busts turned approximately viewer right; artist-approved comparison is pending.
- [FAIL — finished art] These are original programmatic concepts/drafts, not final painted portraits; replace with approved painterly artwork before shipping.

## Image inventory

- `bust_bram_neutral.png`: (1024, 1280), 514081 bytes
- `bust_bram_determined.png`: (1024, 1280), 513524 bytes
- `bust_bram_concerned.png`: (1024, 1280), 514153 bytes
- `bust_noa_neutral.png`: (1024, 1280), 529444 bytes
- `bust_noa_determined.png`: (1024, 1280), 529801 bytes
- `bust_noa_concerned.png`: (1024, 1280), 529705 bytes
- `bust_marta_neutral.png`: (1024, 1280), 502821 bytes
- `bust_marta_determined.png`: (1024, 1280), 502919 bytes
- `bust_marta_concerned.png`: (1024, 1280), 503139 bytes
- `bust_rowell_neutral.png`: (1024, 1280), 486536 bytes
- `bust_rowell_determined.png`: (1024, 1280), 485940 bytes
- `bust_rowell_concerned.png`: (1024, 1280), 485443 bytes
- `bust_adel_neutral.png`: (1024, 1280), 535398 bytes
- `bust_adel_determined.png`: (1024, 1280), 535154 bytes
- `bust_adel_concerned.png`: (1024, 1280), 534702 bytes
