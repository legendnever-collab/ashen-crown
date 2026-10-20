# Ashen Crown v0.5.0 — Part 2 QA Report

## Recovery result

All four requested original final PNGs were retained. All four match the complete SHA256 values supplied in Part 2 00_START_HERE.md. Path A was used for every file. No images were regenerated, repainted, resized or recompressed. The approved garrison, night camp, fortress and oath camp are not included.

| File | Path | Bytes | Supplied SHA256 comparison |
|---|---|---:|---|
| world_map.png | A | 3,855,413 | PASS — exact full hash |
| world_icons.png | A | 1,613,245 | PASS — exact full hash |
| hub_village_day.png | A | 3,723,455 | PASS — exact full hash |
| hub_village_raid.png | A | 3,511,292 | PASS — exact full hash |

## Required self-check

| Check | Result | What was checked |
|---|---|---|
| Four PNG masters; exact sizes; all decode | PASS | Reopened and fully decoded all four originals and all four PNG entries from the finished ZIP. Map/day/raid: 1536×1024 RGB. Icons: 1024×1024 RGBA. |
| Real icon transparency | PASS | Alpha extrema are 0 and 255; transparent pixels exist. Original alpha retained unchanged. |
| Path A or B recorded per file | PASS | All four are Path A, verified against the complete supplied hashes. manifest.csv contains these same hashes. |
| No text, letters, numbers, watermarks or UI | PASS — prior visual inspection reused | These exact masters were inspected full-frame and in native-resolution quadrants during Part 1, including signs, banners and tables. No readable lettering or UI was found. Abstract heraldry and medical cross pictograms are present. Hash equality verifies the inspected images are unchanged. No new OCR or visual inspection is claimed for this packaging-only pass. |
| No people in the village masters | PASS — prior visual inspection reused | No people or animals were observed in the two unchanged village masters during Part 1 inspection. |
| Path B: world-site clearances, icon margins, day/raid blend | NOT APPLICABLE to this recovery | No file used Path B. The requested Path A originals were preserved exactly; no new generation compliance is claimed. |
| JPEG preview; no extra approved hubs | PASS | contact_sheet.jpg previews only the four requested files. |
| Archive under 20 MB | PASS | Verified actual archive length is below 20,000,000 bytes, the stricter decimal interpretation. Exact size is reported in the accompanying reply. |
| Reopen ZIP and verify every checksummed file | PASS | Archive CRC test, all seven SHA256SUMS entries, four manifest hashes, and master PNG decode checks completed after archive creation. SHA256SUMS.txt conventionally excludes itself. |

## Preserved limitations from the earlier art QA

Path A preserves the supplied originals, including their previously disclosed limitations: some world-map sites are not fully clear across an 80px area; the icon sheet does not guarantee 24px padding on every cell edge and has some colored edge fringes; village doorway widths are not uniformly 64px. This is a successful exact-file recovery, not a claim that those art constraints were fixed. Day/raid landmark alignment was visually checked with a 50% blend in Part 1; that larger evidence file is intentionally omitted here because Part 2 asks for evidence only for Path B.

## Package contents

Four PNG masters, manifest.csv (four data rows), SHA256SUMS.txt, this QA_REPORT.md and a compact contact_sheet.jpg. Paths are relative to Ashen_Crown_v050_World_Art_Pack_Part2/. evidence/ and prompts_used/ are omitted because every file used Path A. No WebP, source generation variants, or unrelated hubs are included.
