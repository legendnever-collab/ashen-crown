# Art pack H1 (v2.1.0) — import record (D-121, 2026-11-18)

Received 2026-11-18 19:29 KST: seven ZIPs, parts A–G, 50 images. Every file matched its pack's `SHA256SUMS.txt`.

| Part | Content | Imported? |
|---|---|---|
| A–C | 24 class sheets (8 classes × 3 tiers, magenta sash) | **Yes** — `scripts/import-art.py` → `src/assets/sprites/sprite_class_<cls>_<tier>.webp` |
| F | village tavern interior, 갈대 나루, 돌우물 마을 | **Yes** — `scripts/import-interior-art.py` → `rooms/int_village_tavern.webp`, `hubs/hub_reed.webp`, `hubs/hub_stonewell.webp`; tavern mask authored over the painting |
| D, E | 20 busts (Bram, Noa, Marta, Rowell, Adel × 3; Sera, Orin, Celine, Ren, Silva) | **No** — flat vector drafts; the pack's own QA marks them "FAIL — finished art, replace before shipping". The user chose to keep the borrowed painted busts until they are redrawn. |
| G | arena, icon sheets P and Q | **No** — same reason (vector drafts, QA "PARTIAL — visual"). |

The class sheets are derivatives of the reference sheets (the same figure geometry, a magenta sash added). On the battlefield the
game replaces the magenta with the side's colour and then washes the body — armour and cloth — in that colour, keeping the
head and bare skin as painted (D-120).
