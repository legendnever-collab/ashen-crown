# Current Status
Last Updated: 2026-10-16 (KST)
Current Version: v0.3.1 — Classic SRPG Renaissance (approved for official release)
Release publication: authorized
User play validation: complete. Official final release authorized.
main: v0.3.0 PR #6 merged at 05736c74d828955b5eea1bc6184e0b240d107f76; v0.3.1 PR #7 merged at b7866fcc6b92497090682ac04f614d12e8d39cff.
Original development commit: 0869636c39fa61c051ed4c7cb0f76d17f8e58f8e. Final verified PR head: 42cecebd8e17f409e7a8a268af03c4c1bfe613b2.
Original CI 38587741878 failed on Quest preference reload. The root cause was a deferred details.toggle storage race, not a save schema or migration defect. The recovery saves immediately on summary activation and isolates Enter/Space from exploration shortcuts.
Hosted PR CI 38733801539 and push CI 38733794764 both passed all Game validation steps, including Renaissance, performance, HTTP and actual v0.2 migration. Original 95 unit, 541 browser/scenario, 210 balance victories are preserved; new hosted Renaissance checks pass in all four viewports. Exact-final-main CI must pass before automated publication.
Scope: walkable shop interiors, equipment selection/comparison and atomic purchase, in-place NPC dialogue, tactical movement/commands, persistent Quest, camera/minimaps, native pixel detail, fire/ruins, terrain profiles and schema 0–3 to 4 save compatibility. No new missions or v0.3.2 work.
Assets: releases/Ashen_Crown_v0.3.1.html, Ashen_Crown_v0.3.1_Source.zip, Ashen_Crown_v0.3.1_Test_Report.md, Ashen_Crown_v0.3.1_SHA256SUMS.
Known limits: physical devices, Safari/Firefox, long-term storage eviction, subjective story/audio preference; no fire spread or playable promotions.
