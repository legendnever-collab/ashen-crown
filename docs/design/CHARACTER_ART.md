# Character Art
Original procedural pixels in src/render/art.js. Native terrain 64×64, hero sprites 64×64 고유 silhouette 유지·강화. Portrait 128×128 디테일/표정, 원본을 단순 확대하여 해상도 증가로 주장하지 않는다. Canvas imageSmoothingEnabled=false, integer pixel primitives.
Erik 방패·청록 갑옷 / Elina 땋은 머리·녹색 망토·활 / Lia 높은 모자·보라 로브 / Sain 밝은 후드·금빛 지팡이 / Kai 주황 스카프·쌍단검. Aren은 dialogue portrait와 v0.3 탐색 walking sprite, 비출전.
Tier1 base / Tier2 advanced / Tier3 elite reserved. Erik T2 어깨 갑옷·망토·방패 문양 실제 표시. 타 장수 advanced preview는 아직 없음. expression neutral/concerned/determined/sad. Motion Reduction은 entrance·전투 presentation 완화.

Font expansion: AshenUI derived from locally available @fontsource/nanum-gothic 400 WOFF subsets (NHN/Sandoll, SIL OFL; original src/assets/OFL.txt preserved). Additional Korean syllables merged and unused glyphs removed. src/assets/font-glyphs.json is checked against authored text; no runtime dependency on fontsource. Source-composed music/art use repository MIT LICENSE.

Tier metadata and reserved assets: src/data/appearances.js. Resolver accepts appearanceTier, classTier and storyTier and selects an available rendered variant; incomplete Tier2/3 assets do not silently appear as finished.

v0.3 adds procedural Aren walking, Village/Camp layout, shop interior, NPC sprites and equipment icons. Existing identity tiers preserved; gear shown in inventory/portrait panel, no promise of per-combination tactical sprites.


## v0.3.1 native detail
World units use a 64-unit tile coordinate system. Terrain caches are rendered at native 128 pixels per tile; procedural sprites contain half-world-pixel seams, etched gear, face highlights and walk arm frames (128 native extent); portraits have 256 backing pixels and new native face/hair/garment detail. This is not CSS enlargement. Existing silhouettes, Erik Tier2 and original art ownership remain. No sprite for every gear combination or new promotion claimed.
