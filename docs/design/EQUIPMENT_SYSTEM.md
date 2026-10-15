# Equipment System

v0.3 implementation specification, 2026-10-14.
Weapon/Armor/Accessory, stable instance IDs and one upgrade 0→1. Weapon class allowlist. Starter gear gives zero bonus, legacy growth remains unchanged. Preview old→new effective stats. Equipment locks during battle/result; shops only hub/warroom/deployment. Base stat already includes growth; effective=raw base+growth + gear + temporary effect, then terrain/skill in existing combat formula. Bonuses never baked into campaign.heroes. Cannot sell equipped/starter gear. Upgrade confirm then atomic Gold debit.


## v0.3.1 weapon-first purchase
Product → compatible hero portraits → current equipment and effective-stat delta → confirmation → atomic debit/instance creation/equip. The same effectiveStats function supplies UI and combat. Display ATK/DEF/MAG/RES/SPD/MOV/HIT, zero and negative deltas, unchanged range/terrain evasion. Incompatible heroes disabled with class reason; replacement gear returns to party storage. Cancel changes nothing. Existing nonce ledger and failed-save rollback cover combined purchase/equip; consecutive purchases retain catalogue and interior.

## v0.3.2
Purchase requires explicit compatible hero choice before confirmation. Owner service menu separates buy/sell/upgrade. Sale of equipped gear disabled with owner label; old replaced instances remain available to sell. Existing nonce and save rollback retained.
