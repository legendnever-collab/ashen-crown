# v0.3.1 implementation contract

Baseline inspected 2026-10-14: main fdcdcc42e3adaca7c961dd76dd51268b358ce08f (v0.2). PR #6 open/draft, head 461abfddd0a3a84a224781cff022dd58cc9afc5f; push and PR CI success (38565689422 / 38565695436). This branch is stacked on PR #6 and targets feature/v0.3-living-frontier until that dependency merges. No merge authorized.

Measured source baseline: world tile/sprite 64, portrait 128; battle buffer CSS×DPR, town buffer 1024×768 fixed, both hubs 16×12 and all battles 12×10. NPC stories erroneously use staged-scene actor coordinates; shop confirmation closes the only shop surface.

P0: in-place NPC/battle dialogue; immediate reachable range and contextual commands; preferences; retain shop UI/location; remove readiness checkboxes.
P1: independent walkable forge/item interiors, owner behind counter, explicit door/exit, durable return position; weapon-first compatible hero selection and effective-stat comparison; atomic buy/equip.
P2: variable rectangular maps retaining original battle core/save coordinates; meaningful side routes, villages/forest/river layers; shared bounded camera/pan/zoom/minimap; native 128 terrain/sprite details and 256 portrait details, desktop backing pixels ≥4× at same CSS/DPR baseline; animated burning/burned objects.
P3: class MOV 2/3/3/3/4, data-driven terrain profiles, future mounted modifier only; dialogue rewrite retaining facts/4 acts/30 missions. All 3 missions playable with starter equipment.

Save schema 4: schema 0–3 migrate once, preserve growth/stage checkpoints/assets/story. Geometry retains valid old core positions. UI preferences independent of canonical economy.
Verification: unit invariants, legal campaign policies over multiple seeds, actual visible Chromium desktop/mobile controls, legacy backup import, failed-save rollback, screenshots and byte-identical ZIP rebuild. Actual phone/Safari/Firefox not claimed. Six reference screenshots are not attached to this task; use written UX requirements and original assets, record comparison limitation.
