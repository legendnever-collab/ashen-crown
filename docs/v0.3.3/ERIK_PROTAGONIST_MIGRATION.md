# Erik Protagonist & Save Migration
Schema6 accepts0–5. stable `eric` remains battle ID; frontier.actorId eric, campaignEntry advisor, advisorPending boolean. Renderer reads existing battle unit, appearance tier and facing; no second growth/equipment table. Aren remains NPC/commander, never deployed. Historical story events/history remain valid.

Only legacy frontier spatial records change: invalid hub chooses mission hub, blocked position chooses authored exterior/interior spawn, invalid interior/return chooses its authored exit approach. The same migration runs on campaign.frontier and stageStart. New schema6 malformed saves still fail validation. Current pending advisor dialogue survives reload. Existing Gold, equipment, inventory, results, flags, bonds, reward claims/transactions and battle/practice state are preserved.

Executed: actual shipped v0.3.1 equipped shop and battle saves (10 checks); actual shipped v0.3.2 equipped shop and battle saves (9 checks), restart and re-departure; a blocked coordinate injected into the actual v0.3.2 timeline repairs without asset loss. Actual v0.2 M01–03 campaign save plus legacy v0.1.x browser migration retain growth. Unit coverage verifies schema4/5 nested checkpoints and both blocked/unblocked legacy positions. No serialized held keys/modals.

[Actual v0.3.1 evidence](evidence/migration-v031.json) / [Actual v0.3.2 evidence](evidence/migration-v032.json) / [v0.2 evidence](evidence/migration-v02.json).
