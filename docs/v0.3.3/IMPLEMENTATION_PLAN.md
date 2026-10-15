# v0.3.3 — The Hero's Journey
Baseline main b826c49851596398967b36d517270a3f556df94c; unmerged PR8 HEAD c0a5fc1fdfe6b64c58815c0c4a189e5bbd46a29d, CI38769901779 success. Work branch feature/v0.3.3-erik-advisor-campaign is stacked on PR8; neither PR is approved for merge.

Order: anchor/collision + shared council API → stable eric exploration and schema6 migration → advisor dialogue/council → narrative → fresh build regression/package/PR. Preserve tactical engine, v0.3.2 economy/recovery/rewards, M01–03, M03 ten-turn deadline and original four acts/30 missions. No M04–06.

Root-cause evidence: facade center x=3.0/12.0 vs approach tile centers3.5/12.5; council place12,7 is north of building11,8–14,10 although painted threshold faces south. Radius-based place filtering admits lateral activation. Generic council button worked in a baseline desktop reproduction; reported no-op is not universally reproduced. Active path walking silently discards place commands, and held-key frame commits can replace a pressed button before click identity validation. Stop input on command press, cancel active route and await settling before dispatch; retain anti-ghost-click identity protection.

Tests must use release0.3.3, actual pointer/touch commands and public backup imports; inspect screenshots. Migration must repair only legacy spatial records, preserve all economic/tactical/story payloads and recursively migrate stageStart. No runtime held keys/modal persistence.
