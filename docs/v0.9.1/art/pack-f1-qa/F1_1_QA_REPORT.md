# Ashen Crown v0.9.0 ACT III Part 1 — F1_1 QA

기준: 첨부 작업 팩의 00_START_HERE.md. PASS는 실제 수행한 기술 검사 또는 시각 검사에 한정합니다. 생성형 그림의 미세한 차이는 엄격한 일치 항목에서 FAIL로 기록했습니다.

## 파일별 규격

| 파일 | 크기 | 디코드 | 배경·인코딩 |
|---|---|---|---|
| png/bust_bellard_neutral.png | 1024×1280 | PASS | 실제 RGBA alpha |
| png/bust_bellard_concerned.png | 1024×1280 | PASS | 실제 RGBA alpha |
| png/bust_bellard_determined.png | 1024×1280 | PASS | 실제 RGBA alpha |
| png/bust_bellard_sad.png | 1024×1280 | PASS | 실제 RGBA alpha |
| png/bust_archivist_neutral.png | 1024×1280 | PASS | 실제 RGBA alpha |
| png/bust_archivist_concerned.png | 1024×1280 | PASS | 실제 RGBA alpha |
| png/sprite_archivist.png | 1024×768 | PASS | 실제 RGBA alpha |
| png/sprite_bellard.png | 1024×768 | PASS | 실제 RGBA alpha |
| png/sprite_watchman.png | 1024×768 | PASS | 실제 RGBA alpha |
| png/sprite_grayCloak.png | 1024×768 | PASS | 실제 RGBA alpha |
| png/sprite_clerk.png | 1024×768 | PASS | 실제 RGBA alpha |
| png/sprite_harvester.png | 1024×768 | PASS | 실제 RGBA alpha |

## 작업 팩 체크리스트

| 항목 | 결과 | 근거·편차 |
|---|---|---|
| 6 busts 1024×1280, 6 sheets 1024×768 | PASS | 전체 12장 정상 디코드·정확한 해상도 확인. |
| 실제 투명 배경 또는 순녹색 | PASS | 12장 모두 실제 RGBA alpha. 녹색 방식 아님. |
| 같은 인물의 얼굴·복장·조명·구도 연속성 | PASS | Bellard 네 표정과 archivist 두 표정은 각각 neutral을 직접 참조. 최종 contact sheet 비교. |
| 표정 외 모든 자세·윤곽·의복 픽셀 동일 | FAIL | Bellard sad에서 머리가 약간 숙여지고, 표정 변형 시 얼굴 윤곽·일부 의복 질감에 미세한 변형이 있음. |
| sprite와 bust 인물 일치 | PASS | Bellard의 회색 머리·자주색 예복·직무 사슬, archivist의 대머리·안경·청회색 로브·서류 가방·등불 확인. |
| 시트마다 12개 프레임, 4열×3행 | PASS | 자동 검사로 72개 셀 모두 유효. row1 down, row2 RIGHT, row3 back을 개별 생성 결과와 최종 미리보기에서 확인. |
| idle / step A / step B / attack 순서 | PASS | 움직임·공격 자세 구분 확인. archivist와 clerk는 마지막 열이 flinch. 실제 엔진 재생 검증은 미수행. |
| 셀 하단 16px 기준과 셀 안전 여백 | PASS | alpha≥40 실루엣의 bbox 하단이 72개 모두 y=240. 가장자리와 접촉하지 않는 것을 재측정. |
| 해부학적 발 접지점·장비 크기가 모든 프레임 완전 동일 | FAIL | 그림자·옷자락·무기 끝이 발보다 낮을 수 있음. 공격 자세의 장비 비례와 시점이 소폭 달라짐. 일부 생성 원본 무기가 캔버스 가장자리에 가까웠으며, 보이지 않는 부분까지 복원됐다고 보장하지 않음. |
| 세력별 색상·역할 구별 | PASS | Bellard plum/silver, archivist slate-blue/brown, watchman brass/crimson/gold, grayCloak ash-grey, clerk dark plum/record box, harvester violet-black/lavender. |
| 문자·문장·로고·종교 표식 없음 | PASS | 개별 결과와 최종 미리보기에서 읽을 수 있는 글자나 식별 가능한 금지 표식을 발견하지 않음. 원형 단추 등의 미세 장식은 남아 있으며 자동 OCR로 모든 픽셀을 증명한 것은 아님. |

## 제작·변환 기록

- 01–12 순서로 제작했습니다. sprite_clerk의 붉은 스카프는 최종 수정에서 dark plum으로 바꿨습니다.
- 생성형 이미지 도구를 사용했습니다. Python/Pillow는 지시된 비율 유지 축소·패딩·프레임 배치·연락 시트·검증에 사용했습니다.
- bust는 공통 원본 비율을 유지해 최종 해상도에 맞췄습니다. sprite는 한 시트 내 공통 배율을 적용하고 셀별 위치만 정렬했습니다. 자세별 독립적인 비율 왜곡은 없습니다.
- 원본 크기·변환 방법은 NORMALIZATION.json, 최종 기술 검사 수치는 VALIDATION.json에 있습니다. 원본 alpha 가장자리·그림자·국소 발광은 보존했습니다.
- 게임 안에서의 이동·공격 애니메이션, 충돌, 전투 이벤트 검증은 수행하지 않았습니다.

## ZIP 무결성 검사

- PASS: manifest의 최종 이미지 크기·바이트·SHA256 재계산.
- PASS: contact_sheet.jpg 1,000,000 bytes 미만, 실제 시각 검사.
- PASS: 각 ZIP 20,000,000 bytes 미만.
- PASS: ZIP 재개봉 후 모든 항목 CRC와 SHA256SUMS.txt의 모든 payload 해시 검사.
- PASS: ZIP 안 manifest와 모든 주 이미지 해시를 대조하고 다시 디코드.
- SHA256SUMS.txt는 자기 자신의 해시를 포함하지 않습니다.
- FAIL 항목은 남아 있는 편차입니다. 모든 지시가 완전히 충족됐다고 주장하지 않습니다.

## 전달본 복구 및 재패키징

- 이전에 전달된 F1_1 ZIP은 중간에서 잘렸습니다. 제작 당시 보존된 최종 파일에서 전체 구성품을 확보했습니다.
- PNG 원본 12개 모두 이전 ZIP에서 회수한 manifest 및 원래 SHA256 목록과 일치합니다. PNG를 다시 생성하거나 재인코딩하지 않았습니다.
- 복구한 PNG는 모두 디코드되며 지정 해상도와 RGBA 투명도를 갖습니다. 스프라이트 시트의 72개 셀 모두에 이미지가 있습니다.
- 새 ZIP을 다시 열어 CRC, 모든 수록 파일의 SHA256, 원본 manifest와의 일치를 재검증했습니다.
