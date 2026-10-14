# Combat System
실제 기준: src/core/rules.js / game.js, 기존 v0.1.3 회귀 tests. 12×10, 직교 이동, 점유 Tile 통과 불가, Forest cost 2(Kai 1), Village DEF+2, Forest evade+12, Ruin 통과 불가. 캐릭터당 이동 1+행동 1, 행동 전 Undo. 확인 이동·반격·예측·Guard·Heal·Quick Strike 유지. M01 증원 T3/주민 위협 T5.
M02 Capture는 인접+절반 HP 이하 도주 대장. M03 호위/즉시 구조+안전지대 철수. Mission 데이터는 src/data/missions.js, 결과 로직은 game.js. RNG 저장·재시작 결정성.
