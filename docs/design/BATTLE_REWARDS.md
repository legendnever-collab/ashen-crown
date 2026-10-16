# Victory Rewards — v0.3.2
First canonical clear only. Preserve existing Gold M01 100 / M02 120 / M03 140; starting Gold180. No repeated Gold, growth or inventory from practice/replay.

| Mission | Added guaranteed supplies | Optional supplement |
|---|---|---|
| 01 | Medium Potion ×1 | Both civilians rescued: Ward Tonic ×1 |
| 02 | Ether ×1 | Captain captured: 30 Gold |
| 03 | Medium Potion ×1 + Ether ×1 | Both rescued: Focus Charm ×1 (RES+1) |

Stable v032:mN:condition IDs are claimed together with actual inventory/Gold in one save envelope. Victory screen lists rewards, optional result, growth and relationship/Potential. Unique optional gear stays unequipped. Item capacity6/gear24: overflow stays in rewardPending, never discarded; Inventory offers nonce-confirmed delivery. Existing equipped items cannot be sold. Sale price remains40% gear / tools below buy price; no arbitrage.
Schema4→5 grants only these supplements once for canonical completed missions. Existing base Gold ledger remains. Results/flags establish optional eligibility; unknown outcomes do not fabricate optional completion. Canonical, attempt and departure checkpoint each migrate their own economy; no inventory consumption reset. Backup restore preserves ledger within the backup timeline. Restoring an older backup rewinds its whole timeline; cross-backup/global-server deduplication is intentionally absent in an offline game.
User-visible victory storage failure restores the pre-action state and presents no success; shop failure restores the complete pre-transaction state. No pressed keys, open modal or pending transaction token is persisted. There is no permanent exploration input preference setting to migrate; timings are fixed180/100ms.
