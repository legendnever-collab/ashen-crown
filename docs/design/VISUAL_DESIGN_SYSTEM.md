# Visual Design System — v0.3.1
Original classic pixel fantasy; warm parchment accents on readable dark teal UI. Distinct broad-armored Erik, braided green Elina, pointed-hat Lia, cream-hood Sain, orange-scarf Kai and gray/red Aren. Native fine detail supplements the existing silhouette system.

| Surface | v0.3 baseline | v0.3.1 |
|---|---:|---:|
| World coordinate tile | 64 | 64, stable hit testing |
| Native terrain raster | 64 | 128 |
| Procedural sprite detail extent | 64 | 128 (half-world-pixel details) |
| Portrait buffer | 128 | 256 |
| Standard desktop battle buffer at 1440×1000 | 1440×695 | 3024×1447 |
| Total pixels | 1,000,800 | 4,375,728 = 4.372× |

Actual measured data: REGRESSION_RESULTS.md. CSS size changes/DPR alone are not the deliverable: new seams/etching/face and terrain marks, architectural silhouettes, awning/furnace/shelves, water/mountain/swamp detail and animated flame/smoke/embers are visible. Zoom remains pixelated and canvas smoothing disabled. Logical coordinates separate from backing resolution; tested DPR1/DPR2, portrait/landscape. Terrain caches prevent redrawing every procedural mark per frame. Pixel-perfect means crisp raster edges, not a guarantee of integer physical pixels at every fractional zoom.

Intact/Burning/Burned states are authored visual effects, never untested damage/spread. Real mobile hardware/performance preference and original six reference-image comparison remain unverified.
