# Town And Camp

v0.3 implementation specification, 2026-10-14.
Ashen Village: Square, Blacksmith, Item Shop, Barracks, Supply Depot, Commander Quarters, Exit. Border Camp: tents, quartermaster, field forge, triage, records, watch. Character locations follow roles. Shared renderer/navigation, distinct layout/palette/audio. Interiors use map-backed functional shop scene. Aftermath hub separate from next mission preparation.


## v0.3.1 spaces
Village 16×16; Camp 20×24; forge 12×10; item shop 10×12. Forge has furnace/chimney/anvil, shop awning/bottles/herbs, barracks broad roof, council flag/table motifs, residences and supply stacks. Exterior shop owners removed, interior owners/counters/racks/exits are walkable interactions. Village residential shells become burned after M01, raid scene flames and battle burning objects reflect story chronology. Added southern camp facilities and village homes retain all legacy positions. Decorative building footprints block exploration movement.

## v0.3.2
Doors ask confirmation before entering. Inside, approach owner and choose buy/sell/upgrade (forge only). Transactions keep actor/map/camera location; leaving remains explicit.

## v0.3.3 current map use
Erik is player; Aren5,5 is commander, advisor8,7 beside central gathering space, with existing scout/research/triage/Kai locations. War Room/Command building becomes COMMAND QUARTERS, optional scenery with no required entry. Shops retain independent interiors and exact doorway return. "군사 찾기" paths to and talks with the visible NPC; it never opens battle directly. Advisor is accessible without entering a building.
