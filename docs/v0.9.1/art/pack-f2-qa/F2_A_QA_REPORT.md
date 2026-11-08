# Ashen Crown F2 — Part A QA

PASS and FAIL describe the submitted assets. N/A identifies checks for a different asset type.
Map layout is reviewed visually against the supplied sketches and approved JPEGs. Engine walkmesh and runtime playback require integration verification.

### hub_forest.jpg

- PASS — 1536×1024 JPEG, opaque RGB · encoded at JPEG quality 94.
- PASS — no visible lettering, people or animals. All six building groups, the central well and bottom entrance are recognizable against the approved footprint.
- FAIL — leaf devices appear on the elder's lodge pennants and the longhouse sign. The upper-left shop front has a single round door where the approved footprint has an open workshop bay. Exact door/route equivalence is not established.
- Processing — 1536×1024 RGB PNG source encoded as 1536×1024 RGB JPEG at quality 94.

### int_forest_longhouse.jpg

- PASS — 1536×1024 JPEG, opaque RGB · encoded at JPEG quality 94.
- PASS — central exit falls within bottom tiles 5–6; both marked chest tiles are clear; three beds, central table and right-side equipment are in the intended areas. No visible lettering, people or animals.
- FAIL — no distinct low river-stone hearth is visible.

### int_forest_bowyer.jpg

- PASS — 1536×1024 JPEG, opaque RGB · encoded at JPEG quality 94.
- PASS — bottom-center exit, clear central shopkeeper area, counter, bow racks, brazier and front walk area are present. No visible text, people or animals.
- FAIL — decorative gold leaf device on counter cloth; the counter depth and shield rack differ slightly from their positions in the sketch.
- Processing — 1536×1024 RGB → 1536x1024.

### int_forest_herbalist.jpg

- PASS — 1536×1024 JPEG, opaque RGB · encoded at JPEG quality 94.
- PASS — bottom-center exit, open shopkeeper area and walkway, rear herb and bottle displays, and central sales counter are visible. No visible text, people or animals.
- FAIL — decorative botanical stitching appears on the counter cloth; the shelf masses and counter do not register exactly to the sketch.
- Processing — 1536×1024 RGB → 1536x1024.

### int_forest_lodge.jpg

- PASS — 1536×1024 JPEG, opaque RGB · encoded at JPEG quality 94.
- PASS — bottom-center exit, right-side chest tile, shelf, central low table and hearth follow the main sketch zones. No visible text, people or animals.
- FAIL — the requested living trunk beside the round table is not distinctly depicted.
- Processing — 1536×1024 RGB → 1536x1024.

### int_forest_house.jpg

- PASS — 1536×1024 JPEG, opaque RGB · encoded at JPEG quality 94.
- PASS — centered exit, clear chest tile, left bed, central-left table, cradle and front walk area visually checked; no visible text, people or animals.
- FAIL — hearth is shifted left of its exact sketch zone.
- Processing — 1536×1024 RGB → 1536x1024.

### int_forest_store.jpg

- PASS — 1536×1024 JPEG, opaque RGB · encoded at JPEG quality 94.
- PASS — bottom-center exit and both runtime chest tiles are clear. Back wall storage and ladder match the intended zones. No visible text, people or animals.
- PASS — the first generation added an obstructing table; a targeted revision removed it and restored the walkable center.
- Processing — 1536×1024 RGB → 1536x1024.

### chests_forest.png

- PASS — 1024×512 PNG, transparent alpha.
- PASS — expected visible cells, cell margins and visible-alpha baselines.
- PASS — four matching chest designs, closed above their open empty counterparts, with center and contact baseline aligned in each column. No visible text or insignia.
- Processing — 1774×887 RGBA → 1024x512 · sheet cells separated and positioned with aspect ratio preserved.

### hub_keep.jpg

- PASS — 1536×1024 JPEG, opaque RGB · encoded at JPEG quality 94.
- PASS — five main building groups, courtyard, central well and south gate visually track the approved fortress. Stone knights are depicted as scenery. No visible text, people or animals.
- FAIL — exact door and obstruction coordinates have not been demonstrated; wall and rubble edges differ from the approved artwork.
- Processing — 1536×1024 RGB → 1536x1024.

### props_act3b.png

- PASS — 1024×256 PNG, transparent alpha.
- PASS — expected visible cells, cell margins and visible-alpha baselines.
- PASS — four ordered cells. Standing and wounded trees have matching root positions, height and width; the damaged tree shows fresh wounds.
- FAIL — stump in felled state is offset left relative to the standing trunk to make room for the fallen crown. The sleeping statue has a cross-shaped shield marking.
- Processing — 2172×724 RGBA → 1024x256 · sheet cells separated and positioned with aspect ratio preserved.

### icons_I.png

- PASS — 1024×1024 PNG, transparent alpha.
- PASS — expected visible cells, cell margins and fully transparent unused cells and safe square.
- PASS — six requested subjects in cells 1–6, in order. Unused cells have no alpha content. Shapes were reviewed at thumbnail scale and there is no visible lettering.
- FAIL — stronger illumination than the approved icon sheets and a cross-shaped brace on the first shield; the first three icons retain some light haze.
- Processing — 1254×1254 RGBA → 1024x1024 · sheet cells separated and positioned with aspect ratio preserved.

