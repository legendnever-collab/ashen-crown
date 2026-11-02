# Economy And Shops

v0.3 implementation specification, 2026-10-14.
Gold only. Initial grant 180, first clear rewards M01 100/M02 120/M03 140. Legacy migration grants initial Gold plus unique completed-mission rewards once. Consumable purchased capacity 6, free legacy field potion×2 separate and unchanged. Medium Potion HP+30, Ether MP+8, Ward Tonic DEF/RES+2 until next player phase; self-use, consumes one action, permitted after movement. Buy/sell price spread prevents arbitrage. Transactions use monotonic nonce/idempotency ledger, clone-validate-commit, single save envelope; failed storage rolls UI state back. Practice shops disabled, purchased item use isolated. Canonical economy untouched until first victory; restart/retry departure snapshot. Result cannot enter economy before returning safely to hub.

## v0.3.2
Owner menus expose buy/sell/upgrade, costs unchanged. Added supplies and optional rewards documented in BATTLE_REWARDS.md. Overflow remains in rewardPending with Inventory delivery; first canonical claim and save atomic. Schema5 ledger supplements prior Gold only once.

## v0.8.1 「무기」 (D-073 §6, D-076; PROPOSED)
- Tier I gear and the v0.8.0 tool stock are unchanged and sold in every hub. Ironhold's castle town, Velmar and the pilgrim village sell only their own tier II goods, unlocked by their missions (shown locked until then), one premium piece from the first visit, and two elite pieces at their faction's trust 2.
- Velmar's rare-goods shelf: one specialty of another town, turned by each mission cleared, +25%, one purchase per turn.
- Towns passed can be revisited from the world map during preparation (free); shops, forge and townsfolk only. Gear limit 30 bought pieces plus treasures.
- First-clear Gold, v0.3.2 supplies and optional rewards are unchanged; hidden objectives add treasures (and two Elixirs) once each; supply carriers drop one tool per battle into the bag.
