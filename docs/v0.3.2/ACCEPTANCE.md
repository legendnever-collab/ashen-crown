# v0.3.2 Acceptance
Implementation and full hosted code validation complete:108 unit,680 browser/scenario checks,210 legal-policy victories. See RELEASE_VALIDATION for exact verified code/build and final PR package CI. User play approval/main merge pending.

| Area | Delivered behavior | Evidence |
|---|---|---|
| Keyboard | single step / held repeat / direction / release / blur | held-movement unit + quality UI |
| Touch | real emulated touch hold, up/cancel, stable body capture across renders | quality UI3 viewports |
| Doors | exact trigger, explicit enter/cancel, no repeated popup, original exit | quality + frontier + Renaissance |
| Shops | owner buy/sell/forge upgrade; no automatic trade on entrance | quality + frontier |
| Equipment | explicit compatible hero, effective-stat comparison, atomic auto-equip, old gear retained | unit + quality + frontier |
| Transactions | nonce duplicate rejection; equipped sale protection; failed save and write-then-throw rollback | unit + quality + frontier |
| Recovery | own-phase only, floor/min1/clamp, saved marker, enemy priorities | terrain unit + quality + campaign |
| Feedback | separate colored HP/MP floating numbers, healing aura/log, hover/touch ratios | renderer + hosted screenshots |
| Rewards | existing Gold preserved, supplies/optional capture/unique rescue gear, visible result screen | reward unit + campaign UI |
| Persistence | schema0–4→5, nested departure checkpoints, canonical/attempt/practice isolation | migration/restart/legacy UI + units |
| Capacity | no lost overflow, inventory delivery, reload cannot duplicate | reward unit + quality UI |
| Campaign | M01–03, legal capture, bridge10-turn deadline, no purchase needed |210 local mission victories + campaign UI |
| Offline | standalone embedded art/font/music, source rebuild identical, checksum/current tree audit | build/package/HTTP/offline suites |
| Scope | 4 acts30 missions and story source unchanged; no M04–06 or promotions | git diff/canon audit |

Fixed180ms/100ms input timings have no player preference to persist. Runtime pressed keys, entrance modal and pending transaction remain transient. Stable reward claims/history and recovery phase markers are durable. An offline backup restores its entire timeline; no cross-backup server ledger exists. Physical devices/other browser engines/long-term eviction remain unverified. v0.4 design remains in the existing story roadmap, development not included here.
