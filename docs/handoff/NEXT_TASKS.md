# Next Tasks
1. Review v0.3.1 standalone: walk into both shops/owners, compare/choose/equip, exit/re-enter, NPC position, Quest toggle, select/move/attack/undo, fire and M01–03. Physical-device play and human narrative/art/audio taste remain the review step.
2. Use PR #7 Checks/body for exact recovery-head CI and release gate results. The historical 0869636c CI failed on queued Quest preference persistence; the recovery adds synchronous saving and regression coverage. Existing legacy save migration passes remain valid; regenerate them only after a migration/core change. v0.3.1 is stacked on unmerged PR #6; merge dependency only with authorization, then retarget/rebase if needed. No automatic merge.
3. v0.4 The Broken Allegiance: M04–06, abandoned fort, supply investigation, Baldrick, Ashen Oath; larger authored geography and advanced object interactions. Preserve OPEN supply provenance and 30-mission order.
4. v0.5 Advanced Class: actual tactical promotion behavior/conditions, hero-specific tier art, mounted class only when fully designed/tested.
5. Continue recruitment/relationships and later-act causal review without silently promoting proposed details.

Keep schema4 migration, atomic economy/failure rollback, interior return positions, map click transforms, popup target clearance and legal starter-equipment campaigns as gates. Actual phones/Safari/Firefox/storage eviction remain unverified. Zero external runtime assets; font attribution retained.

Recovery workflow: if a command fails or stops producing output, inspect its last log and exit/process state once, then report the failure and last completed step. Do not restart the entire development or loop legacy Save Migration. Ordinary Chromium cannot start here (socket() EPERM); use the installed headless shell for local file-browser checks and hosted CI for HTTP.
