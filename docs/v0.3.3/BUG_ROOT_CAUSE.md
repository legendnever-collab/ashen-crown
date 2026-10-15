# v0.3.3 Root Cause & Recovery

## Baseline
main b826c49851596398967b36d517270a3f556df94c, v0.3.1. PR8 open/draft, unmerged at c0a5fc1fdfe6b64c58815c0c4a189e5bbd46a29d. Its CI38769901779 passed4/4, but tests did not cover facade anchoring or command timing adequately. PR8 remains untouched.

## Door geometry — confirmed
`drawBuilding` painted doors at `building.x + building.w/2`: x3.0 and12.0 on four-tile shops. The authored approach cells were3,4 and12,4, whose centers are3.5 and12.5. Thus the door was half a tile west of the legal standing position. Places used Manhattan radius≤1, independent of facade direction. Council place12,7 lay north of building(11,8,w4,h3), while the facade threshold faces south at y10. This explains the behind-building interaction.

Fix: building.entrance tile(3,3)/(12,3), explicit front/return(3,4)/(12,4), shared with place/render. Wall footprint stays solid. Doors require exact front cell; NPCs retain ordinary adjacency. Pointer coordinates already used MapCamera.tileAt; no CSS scale multiplication or enlarged interaction radius was introduced. Clicking the visible threshold paths to the same approach. A new test caught a second bug: clicking a facade while already on its approach had a zero-step path, so loop-only prompt dispatch never ran. Post-path dispatch now handles this case.

## Command / progression — confirmed paths, bounded reproduction
The generic council button successfully opened raid/warroom in a baseline desktop reproduction. The reported button no-op is not claimed to be universally reproduced. However, `frontierDispatch` silently dropped place commands while a route was active, and held-key frame commits could replace a pressed button before ghost-click identity validation. A route to the old council could also stop at an unrelated doorway while the old UI directly changed screens without checking arrival.

Fix: pointer command press clears held movement and invalidates the active route; command dispatch waits for the route to settle. Existing anti-ghost-click identity checks stay. `openCouncil` centralizes mission preparation/narrative preconditions. Advisor interaction never mutates battle units or directly starts combat: council → existing deployment → explicit confirmation → unchanged startBattle. Error-only recovery invokes the same API beside the advisor; it is absent from the normal flow. War Room building gate is retired as COMMAND QUARTERS.

## Actual landscape hit-test obstruction — reproduced during new QA
At844×390, item-door test point(447,205.25) hit `Quest / Objective` summary, not the canvas. Even collapsed, its interactive summary overlaid the map. Inverse camera coordinates were correct. The persistent Quest element now lives inside the exploration side panel; collapse/expand and saved preference remain, and no Quest interactive rectangle covers a door/NPC. Battle Quest behavior stays as before.

## Save / character ownership
Schema5 had no explicit exploration owner; renderer hardcoded Aren. Schema6 owns stable eric and reads the existing battle hero, with no duplicate growth/equipment record. Aren is a commander NPC. Legacy blocked exterior/interior/return positions repair to authored safe positions, recursively in stageStart; economies/results/flags/bonds/hero data are preserved. New schema validation rejects invalid new saves rather than silently repairing arbitrary corruption.
