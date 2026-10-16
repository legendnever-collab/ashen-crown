# Exploration System

v0.3 implementation specification, 2026-10-14.
Hybrid grid Town/Camp. Aren WASD/arrows, click destination pathfinding, mobile D-pad. Solid buildings/bounds/NPC collision. Interaction at Manhattan distance ≤1. Visited landmarks unlock Fast Travel; route existence required. Persist hub/position/visited/events. Modal/story consumes input; battle handlers never run in exploration.


## v0.3.1 interiors and camera
currentHub returns exterior or independent INTERIORS. Forge door (3,4) and item door (12,4) require approach; enterInterior stores hub/x/y/facing and moves to an authored indoor entrance. Trade opens only after walking adjacent to the owner. Closing/comparing/buying leaves the actor inside; an explicit exit restores the exact stored doorway. Save/reload preserves interior and return coordinates. NPC dialogue omits staged-scene rendering and never changes actor or camera coordinates. WASD, click paths, D-pad, wheel zoom, Shift/right drag and Aren focus use camera coordinate conversion. Terrain is cached; actors/fire animate separately. Quest text is click-through; its summary toggle consumes input and preference is durable.

## v0.3.2
Runtime input controller supports arrow/WASD and pointer D-pad hold180/100ms, release/cancel/blur/modal/screen stop. Browser repeat ignored. Exact doorway tile prompts entry, clears input; cancel remains in place without popup loop. Explicit nearby Interaction can retry. Shop exit remains explicit; no key/modal persistence.
