# v0.3.2 Gameplay Quality & Rewards
Baseline main b826c49851596398967b36d517270a3f556df94c; PR6/7 merged. Schema4. v0.3.1 publication CI running at baseline inspection, no release/tag yet. Older entry/handoff docs contain stale stacked-branch statements; actual GitHub refs take precedence.

Incremental phases: B held keyboard/pointer input (180ms/100ms), transient door confirmation; C owner menu buy/sell/upgrade retaining nonce atomic auto-equip; D phase-once Village/Fort/Recovery terrain plus healing feedback and bounded AI preference; E stable supplemental reward ledger and legacy catchup; F regression, standalone/package checks and review PR, no main merge.

Preserve canonical Gold 100/120/140 and 180 start, 6 active tools/24 equipment cap, raw hero growth, ten-turn M03 and M02 capture. Overflow rewards remain claimable in a separate reward delivery queue; no silent loss or Gold conversion. New schema5 initializes recovery markers/ledger, migrating nested departure checkpoints separately without adding catchup twice. Only canonical completed missions qualify for catchup; practice/working attempt economies remain isolated. Rewards never auto-equip.

QA: behavioral input timing/door/owner/atomic failed storage; recovery round/clamp/faction/idempotence/reload/AI; first/optional/replay/retry/legacy/overflow and failure rollback; all existing unit/browser/campaign/offline suites against the newly built v0.3.2 HTML. Preserve historical v0.3.1 evidence, record new evidence separately. Story Bible and 4-act/30-mission canon reviewed unchanged.
