# Map Architecture — v0.3.1

| Map | Width | Height | Purpose |
|---|---:|---:|---|
| Village | 16 | 16 | Square, alleys, shops, barracks, houses/depot |
| Border Camp | 20 | 24 | Campfire, field services, southern operations/supply |
| Blacksmith | 12 | 10 | Counter, furnace, racks, owner, exit |
| Item Shop | 10 | 12 | Counter, herb/bottle shelves, owner, exit |
| M01 | 16 | 12 | Existing rescue core, eastern street/supply/fire houses |
| M02 | 18 | 14 | Winding forest core, eastern trail/mountain flank |
| M03 | 14 | 12 | Gorge/bridge core, riverbank path and rear approach |

Mission data define dimensions independently, with terrain/collision/building/object/actor/effect/event layer contracts. Rule bounds derive from mission dimensions; impassability and movement profiles share terrainCost, occupancy from actors. Deployment retains old rectangle x1–10/y7–9. Reinforcement fallback uses actual dimensions. M03 north three rows remain the safe zone; appended cells do not extend its turn limit. Preserve every legacy core coordinate; full recentering/large new battle layouts belong to later authored missions.

MapCamera: bounded follow, smooth focus, manual offsets, zoom and viewport fitting. Logical transform used for all clicks; minimap shows actors/objectives/terrain/viewport. Short landscape views use 40-pixel base tiles. Frontier and battle inputs are isolated. Render caches use 128 native pixels/tile; portraits use 256. Camera UI state is transient; actor/return coordinates, flags and quest preference are persisted.
