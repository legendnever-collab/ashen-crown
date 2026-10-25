# Ashen Crown v0.6.0 — Character Art QA (B3)

7 unit sheets

검수일: 2026-10-25 (한국시간)

## 결과

요청 범위의 7개 PNG를 모두 포함한다. 해상도·파일 디코딩·실제 투명도·패키지 무결성을 검사했다. 스프라이트가 있는 패키지는 4×3 프레임 배치와 셀 경계도 검사했다. 아래 FAIL 및 차이점을 숨기지 않고 기록한다. 작업 지시서의 예외 규정에 따라 최선의 결과와 함께 제공한다.

## 요청 체크리스트

| 항목 | 결과 | 근거 / 제한 |
|---|---|---|
| 0 busts at 1024×1280; 7 sheets at 1024×768 | PASS | 모든 PNG를 실제로 디코딩하고 크기·RGBA 모드 확인 |
| 투명 배경 또는 순수 녹색 | PASS | 모든 파일이 실제 alpha 투명 배경. 녹색 대체 방식 사용 안 함. 파일별 표 참고 |
| 글자·숫자·문장·로고·crest 없음 | PASS (육안) | 원본 크기와 contact sheet에서 확인. 방패·의상·마구는 색면과 소재로 구분. 일반 리벳·버클·색면 분할은 유지. OCR 완전성 보증은 아님 |
| 인물별 4개 bust 일관성 | N/A | 이 ZIP은 일반 병종 시트만 포함 |
| bust의 표정 외 픽셀 완전 동일 | N/A | bust 없음 |
| 각 시트 12프레임, 올바른 행/열 | PASS | 9개 전체 작업 중 이 ZIP의 7개 시트를 검사. 4열×3행, 각 셀에 하나의 연결된 고형 실루엣. 행: DOWN / RIGHT / UP, 열: idle / step A / step B / attack |
| 두 번째 행이 RIGHT, 좌우 혼동 없음 | PASS (육안) | 모든 네 프레임의 얼굴·몸통·공격 방향을 시트별 확인 |
| 발/발굽 기준선 및 셀 경계 | PASS (배치 기준) | 셀 안 기준선 좌표 y=240, 기준 고형 발 픽셀 y=239. 비율 유지 축소·이동 후 경계의 고형 픽셀 없음. Dario 정면 idle은 발보다 검 끝이 더 낮으므로 발 위치를 별도 기준으로 사용. 세부 설명 참고 |
| 기마/보행 | PASS | 7개 병종 모두 보행 |
| 참조 시트의 스케일 및 약 2/3 셀 높이 | PASS (대략) / 정확히 동일한 체형 비율은 FAIL | 시트별 공통 비율 축소로 보행 인물 크기를 약 2/3 셀 높이에 가깝게 맞춤. 포즈·투시 및 무기 길이에 따른 차이가 남음. 기마 Thea는 말과 창 때문에 더 큰 실루엣 |
| contact_sheet.jpg 1 MB 미만 | PASS | 실제 바이트 크기 확인 |
| ZIP 20,000,000 bytes 미만 | PASS | ZIP 생성 후 실제 크기 확인 |
| ZIP 재개봉, SHA256, manifest 검사 | PASS | ZIP의 CRC 검사와 모든 체크섬 항목 대조. ZIP 안 모든 PNG를 다시 디코딩 |

## 파일별 배경

| file | background | alpha range |
|---|---|---|
| sprite_ironInfantry.png | RGBA / actual transparency | 0–255 |
| sprite_ironDeserter.png | RGBA / actual transparency | 0–255 |
| sprite_mercSpear.png | RGBA / actual transparency | 0–255 |
| sprite_assassin.png | RGBA / actual transparency | 0–255 |
| sprite_lordA.png | RGBA / actual transparency | 0–255 |
| sprite_lordB.png | RGBA / actual transparency | 0–255 |
| sprite_councillor.png | RGBA / actual transparency | 0–255 |

## 주요 차이점 / 적용 참고

- ironInfantry: gunmetal/steel-blue, 회색 모피와 무표기 직사각 방패. 정돈된 군인 실루엣.
- ironDeserter: 찢어진 steel-blue 천과 ragged fur, 손도끼. 참조 영향으로 붉은 목천이 추가되어 있다. 진영 주색은 steel-blue이나 지정 색만으로 구성된 결과는 아니다.
- mercSpear: red/black 의상, brigandine, pike. 초기 누락된 투구를 12프레임 모두 보완했다. 둥근 open sallet 계열로 단순화되어 역사적 세부 구조의 엄격한 재현은 아니다.
- assassin: grey-green 후드와 얼굴 마스크, 쌍곡검. 일부 공격 자세에서 비틀림·옷자락 변화가 크다.
- lordA: blue/white 색면, 흰 plume, spear와 원형 방패. 색면 분할 외 crest 없음.
- lordB: orange/brown 색면, orange plume, halberd. 헬멧은 kettle 계열로 단순화.
- councillor: green/cream robe, soft cap, grey beard, plain chain, 말린 문서. 무기 없음. 네 번째 열은 공격 대신 문서를 든 놀람/방어 동작.

## 제작·배치·검증 기록

- Built-in Imagegen으로 개별 이미지를 제작했다. 네 인물의 neutral bust를 먼저 만들고 각각을 직접 참조하여 concerned/determined/sad를 생성했다. Thea의 sheet를 네 bust 직후 제작한 뒤 Dario로 넘어가는 순서를 지켰다. 모든 작업은 같은 대화 스레드에서 수행했다.
- 실제 사용한 생성/수정 프롬프트를 prompts_used/에 포함했다. 기존 상용 게임·캐릭터·스튜디오 이름을 추가하지 않았다.
- Bust 원본은 1122×1402, sheet 원본은 1448×1086이었다. 비율을 유지해 목표 크기 안에 축소하고 필요하면 투명 여백으로 패딩했다. 늘이거나 비율을 왜곡하지 않았다.
- 저장 중 디코딩 오류가 발견된 3개 중간 파일은 정상 원본에서 복원했다. 최종 PNG는 완전한 메모리 인코딩 후 atomic write로 저장하고 다시 열었다. 최종 ZIP에서도 재디코딩했다.
- Sprite는 각 시트의 12개 실루엣을 분리해 시트별 동일 축소율로 셀 안에 재배치했다. 세로/가로를 서로 다르게 늘이지 않았다. 프레임별 자체 스케일을 바꿔 포즈 크기를 억지로 통일하지 않았다.
- 발 기준선은 셀의 아래 경계에서 16px 위인 좌표 y=240이다. 발의 마지막 고형 픽셀을 y=239에 맞췄다(alpha>128 기준). Dario 정면 idle에서 검이 발보다 낮게 내려오는 경우 원본의 보이는 boot 끝(y=227)을 별도 기준으로 사용했다. 가장자리의 부드러운 alpha는 고형 발 픽셀 아래로 조금 확장될 수 있다.
- 각 시트의 12프레임, 방향과 포즈를 육안 검토했고, 최종 PNG에서 12개 실루엣 및 셀 경계를 자동 검사했다. 해부학적 발/발굽의 모든 픽셀에 대해 자동 의미 분할을 수행한 것은 아니다.
- 스프라이트의 pose별 체형·갑옷·손·무기 각도와 색면은 생성된 그림 사이에서 미세하게 달라진다. 완전 동일한 3D rig에서 추출한 프레임은 아니며 실제 게임에서의 이동/공격 재생 검증은 이번 아트 작업에 포함하지 않았다.
- PNG masters만 납품한다. WebP, 실행 파일, 게임 코드 변경은 포함하지 않는다.
