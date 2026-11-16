# Ashen Crown ACT IV Part 3 · G3 Part A

## Self-check

| Check | Result | Verification |
|---|---|---|
| PNG format, exact dimensions and transparency | PASS | Decoded and inspected both masters. `props_act4c.png` is 1024 × 256. `icons_N.png` is 1024 × 1024. Both use real 8-bit RGBA transparency. |
| No text, letters, emblems, crests, holy symbols or logos | PASS | Visually checked both PNG masters on a dark ground. The shield, cloak and locket are plain. |
| Ram orientation, ladder upright and cell height | PASS | The ram nose points toward the top of its cell and all four wheels are visible. The upright ladder has two hooks and eight rungs, with visible alpha from y = 8 to 244. |
| Shared memory fragment and plinth size and position | PASS | Both states share the same shard and round plinth design. They were registered by plinth center at one scale. The solid-alpha bounding boxes agree at (97, 106)–(158, 240) in their respective cells. The read state has a dark, cracked shard and the glow is extinguished. |
| Every prop on the baseline with no clipping | PASS | In each cell, the last solid row (alpha > 210) is y = 240, measured from y = 0. Soft contact shadows extend below the baseline. Every alpha bounding box has a clear margin inside its cell. |
| Icon sheet occupancy, safe square and finish | PASS | Cells 01–03 contain the three requested icons in order. All visible alpha fits within the 80% safe square and every pixel in cells 04–16 has alpha 0. Visually compared colors, lighting and finish to the approved sheets and inspected all three icons at 40 × 40 pixels. |
| Contact sheet | PASS | Valid JPEG with both master filenames, occupied cells and 40 × 40 icon previews. File size is 83,688 bytes. |

## Generation notes

1. Generated `props_act4c.png` first with the supplied prop prompt, layout, two battle sprite sheets and two battle-map screenshots. Cell order is `ram`, `ladder`, `memory`, `memory_read`.
2. Generated `icons_N.png` second with the supplied icon prompt, layout, two approved icon sheets and Aren portrait. Cell order is `lastOrder`, `ramHead`, `nightLocket`.
3. The built-in image generator produced transparent source art. The final masters use aspect-preserving crops and resampling with placement onto empty RGBA canvases. The `prompts_used/` directory contains the full prompt text submitted for each master.

## Deviations

The two memory states match in placement, scale and overall geometry. Fine stone shading and brush texture vary slightly between the painted states. A few faint ash flecks sit just above the plinth in the read state, alongside the ash on its surface.
