# Door Alignment Test
PASS: village/camp weapon and item shops, front arrival/Enter/Cancel, held key cancellation without loop, actual facade click from current approach, separate interior/reload/exact exterior return, no lateral radius or rear activation. Unit anchors share object identity with visual facade; wall is solid. UI tested1440×1000,390×844 and844×390, offline Chromium with actual touch emulation. Quest summary is outside exploration canvas. Debug view only via ?debugMap=1.

[Executed journey cases](evidence/journey-e2e.json) / [root cause](BUG_ROOT_CAUSE.md).

Final manifest-build screenshots visually inspected for tile threshold/front alignment and unobstructed map hit targets:
- [Desktop](screenshots/doors-debug-1440.png)
- [Mobile portrait](screenshots/doors-debug-390.png)
- [Mobile landscape](screenshots/doors-debug-844.png)

No physical-phone claim. Buildings remaining as scenery have no entry gate; only weapon/item shops are enterable.
