# Exploration System

v0.3 implementation specification, 2026-10-14.
Hybrid grid Town/Camp. Erik WASD/arrows, click destination pathfinding, mobile D-pad. Solid buildings/bounds/NPC collision. NPC interaction at Manhattan distance ≤1; doors require their exact front tile. Visited landmarks unlock Fast Travel; route existence required. Persist hub/position/visited/events. Modal/story consumes input; battle handlers never run in exploration.


## v0.3.1 interiors and camera
currentHub returns exterior or independent INTERIORS. Forge door (3,4) and item door (12,4) require approach; enterInterior stores hub/x/y/facing and moves to an authored indoor entrance. Trade opens only after walking adjacent to the owner. Closing/comparing/buying leaves the actor inside; an explicit exit restores the exact stored doorway. Save/reload preserves interior and return coordinates. NPC dialogue omits staged-scene rendering and never changes actor or camera coordinates. WASD, click paths, D-pad, wheel zoom, Shift/right drag and Erik focus use camera coordinate conversion. Terrain is cached; actors/fire animate separately. Quest text is click-through; its summary toggle consumes input and preference is durable.

## v0.3.2
Runtime input controller supports arrow/WASD and pointer D-pad hold180/100ms, release/cancel/blur/modal/screen stop. Browser repeat ignored. Exact doorway tile prompts entry, clears input; cancel remains in place without popup loop. Explicit nearby Interaction can retry. Shop exit remains explicit; no key/modal persistence.

## v0.3.3 authoritative behavior
D-031 supersedes Aren controller ownership: frontier.actorId=eric; renderer reads the existing battle hero, including armor tier, and retains facing/walk/idle. No second growth record. Aren NPC at5,5, advisor at8,7. Weapon/item facade anchor tile(3,3)/(12,3), approach(3,4)/(12,4), north-facing interaction from that exact southern tile only. Painted door center is anchor tile center, wall remains solid. Clicking facade maps to approach; cancel stays there. Debug only: URL ?debugMap=1 shows grid, solid bounds, threshold, legal approach; exact approach replaces radius. Command pointerdown clears held movement/cancels paths before hit validation.
Advisor dialogue persists its pending choice; only completed dialogue/adjacency enables shared openCouncil. Cancel returns to unchanged position/camera. War Room building has no progression action. Schema6 imports0–5 and repairs invalid legacy locations/return points/checkpoints only.
