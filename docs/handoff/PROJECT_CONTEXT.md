# Project Context
Ashen Crown, https://github.com/legendnever-collab/ashen-crown : original 16-bit fantasy browser standalone tactical SRPG. «장수를 키워 전쟁을 승리하고 전쟁으로 장수의 이야기를 완성한다.»
Main baseline v0.1.3 5aa56dd4596246057611606f28ece4643e1d080a, PR #4 merged. v0.2 branch feature/v0.2-burning-frontier. 구현 상태는 CURRENT_STATUS를 읽는다.
Erdia는 200년 전 Aurelius의 왕관 결계로 통일, 3년 전 잿빛 밤 의식 실패·국왕 실종·세 왕족 내전. Cassian 통일/Leonora 자치/Lucien 신앙은 장단점이 있다. Aren 지휘관 비출전, 봉인 명령의 죄책감. Erik 전우·Elina 정찰·Lia 새 마도사·Sain 치유사·Kai 수상한 여행자(B안).
4막: 국경 01–06 / 세 깃발 07–14 / 진실 15–22 / 왕관 23–30. 엔딩 왕권/지역 연합/분산 결계, 정답 없음. STORY_BIBLE가 정본, 후반 인과는 OPEN/PROPOSED.
그래픽: original procedural 64 tile/128 portrait, identity silhouettes, Erik tier sample; 음악 original oscillator score offline. 저장은 schema migration + checksum + last-good + text backup + current mission checkpoint, 기존 영구 성장 보존. 첫 clear만 확정 성장, practice 비확정.
금지: 전면 재작성, 강제 희생, Aren 필수 출전, 단순 수치 각성, canon 무단 변경, 실패 CI 완료 선언, 라이선스 불명 자산, v0.2 자동 merge.
읽기: AGENTS.md 지정 순서. 코드 src/core/game.js/rules.js, data/missions.js/story.js, narrative.js, save-manager.js, audio, render, ui. npm test/build와 tests 회귀. NEXT_TASKS의 P0 확인 후 신규 콘텐츠.
