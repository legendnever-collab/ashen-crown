# Ashen Crown v0.3.2 — Release Candidate Validation
Baseline main b826c49851596398967b36d517270a3f556df94c (PR6/7 merged). New branch feature/v0.3.2-gameplay-quality-rewards. User play approval and main merge pending.

Implemented: keyboard/touch held movement and transient entrance confirmation; owner buy/sell/upgrade menu; explicit compatible hero auto-equip retaining old gear/nonce rollback; own-phase terrain HP/MP recovery and bounded enemy tactics; first-clear supplies/optional30 Gold/Focus Charm; schema0–4→5 migration and reward overflow delivery.

Executed locally:107 unit PASS,0 FAIL;30 M01 legal-policy wins;30 standard complete campaigns (90 mission wins),15 selected captures,30 full rescues,bridge5–8 turns;30 economy-loadout campaigns (90 mission wins). Total210 mission victories. Source syntax/build and offline embedding verified. Hosted browser/HTTP/CI and source package evidence pending at this checkpoint. No historical browser PASS counts are claimed for the new build.

Economy: base Gold unchanged100/120/140; max cumulative570 including starting180 and optional capture30. Gear65–85 and upgrade40 remain meaningful alternatives. Free reward supplies retain capacity6 with deferred overflow. Focus Charm RES+1 matches existing mild accessory, sale18<buy45. Existing no-purchase policy completes all missions. Stage restart/retry restores departure assets; practice cannot farm.

Limits: local Chromium download blocked/truncated; hosted Chromium is authoritative for browser validation. Physical devices/other engines/long-term eviction unverified. Cross-backup global deduplication unavailable offline; a backup restores its entire world timeline. No M04–06 or playable promotion. v0.4 design remains ready in existing story docs; implementation excluded.
