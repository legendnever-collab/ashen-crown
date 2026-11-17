// v1.0.0 (D-113): painted ending illustrations (ending_a|ending_b|ending_c) and the epilogue background (epilogue), embedded by
// the build from src/assets/endings (ACT IV art pack G4). Until the pack returns, the epilogue draws a game-made dawn instead.
export const ENDING_ART=typeof ASHEN_ENDINGS!=='undefined'?ASHEN_ENDINGS:{};
export const endingArt=id=>ENDING_ART[`ending_${String(id).toLowerCase()}`]||null;
