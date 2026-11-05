# Ashen Crown v0.7 ACT II Part 2 — D3 QA

검수 기준: 첨부 작업 팩 00_START_HERE.md. 이미지 생성 도구로 순서대로 제작하고, Python/Pillow는 지시된 크기 변환·패딩·프레임 위치 정렬·JPEG 인코딩·연락 시트 제작에 사용했습니다.

PASS는 실제 확인한 항목만 뜻합니다. 엄격한 일치 조건을 충족하지 못한 항목은 FAIL로 기록했습니다. 게임 엔진 안에서의 애니메이션·충돌·이벤트 좌표 검증은 수행하지 않았습니다.

## 파일별 기술 검수

| 파일 | 크기·디코드 | 배경 / 인코딩 |
|---|---|---|
| img/hub_pilgrim.jpg | PASS · 1536×1024 | RGB JPEG, quality 94 |
| img/int_pilgrim_hostel.jpg | PASS · 1536×1024 | RGB JPEG, quality 94 |
| img/int_pilgrim_smithy.jpg | PASS · 1536×1024 | RGB JPEG, quality 94 |
| img/int_pilgrim_apothecary.jpg | PASS · 1536×1024 | RGB JPEG, quality 94 |
| img/int_pilgrim_hospice.jpg | PASS · 1536×1024 | RGB JPEG, quality 94 |
| img/int_pilgrim_house.jpg | PASS · 1536×1024 | RGB JPEG, quality 94 |
| img/int_pilgrim_granary.jpg | PASS · 1536×1024 | RGB JPEG, quality 94 |
| img/int_pilgrim_chapel.jpg | PASS · 1536×1024 | RGB JPEG, quality 94 |
| img/int_pilgrim_copyists.jpg | PASS · 1536×1024 | RGB JPEG, quality 94 |
| img/chests_pilgrim.png | PASS · 1024×512 | 실제 RGBA 투명도 |

## 작업 팩 체크리스트

| 항목 | 결과 | 확인 내용 |
|---|---|---|
| hub와 실내 8장, 1536×1024 RGB JPEG | PASS | 9장 모두 quality 94 quantization table 확인, 4:4:4 인코딩. |
| 상자 1024×512 PNG | PASS | 실제 RGBA alpha. 4열×2행, 총 8개 그림. |
| 마을·실내의 사람·동물 없음 | PASS | 모든 생성 결과와 최종 contact sheet 시각 확인. |
| 문자·숫자·로고·종교 표식 없음: 엄격 기준 | FAIL | hospice의 펼친 장부에 미세한 선형 표기가 남음. 읽을 수 있는 글자·로고·문장·십자가는 발견되지 않음. |
| 주요 마을 구역과 통행로 | PASS | 상단 성당, 양쪽 건물군, 중앙 화로와 광장, 하단 중앙 진입로 확인. |
| 모든 DOOR 타일·건물 외곽이 도면과 정확 일치 | FAIL | 문과 건물의 위치·크기가 도면에 비해 수십 px 이동. 대장간 문과 개방형 forge, 곡물창고 대문 등이 도면의 단일 DOOR 정의와 정확히 일치하지 않음. |
| 실내 하단 중앙 출입구와 비어 있는 하단 바닥 | PASS | 8개 실내 모두 확인. 천장 없음, 전면 벽은 절개된 형태. |
| 실내 모든 가구가 표시 상자 안에 엄격히 포함 | FAIL | 숙소 침상과 구호소 침상 등 일부 가구가 도면 상자 범위를 넘음. 창문·선반·화분 등 장식도 추가됨. |
| CHEST / SHOPKEEPER 예약 칸에 상자·사람 없음 | PASS | 해당 위치를 빈 바닥으로 남겼는지 도면과 생성 결과를 시각 비교. 자동 충돌 마스크 검사는 미수행. |
| 상자 4종의 닫힘/열림 대응, 열린 내부 비움 | PASS | 같은 열에 대응 배치, 보물·아이템·발광 없음. |
| 열린/닫힌 상자 본체 형태와 좌표 완전 동일 | FAIL | 열별 동일 배율·중앙·하단 기준은 맞췄으나 생성된 본체의 폭·경첩·잠금장치가 조금 다름. leaf ornament 형태도 open/closed에서 차이가 있음. |

## 제작 기록과 적용 메모

- 19 hub → 20 hostel → 21–27 실내 → 28 상자 순서로 생성했습니다. hub와 hostel을 후속 실내의 스타일 참조로 사용했습니다.
- 상자 프롬프트의 'Rows 1 and 3 / Rows 2 and 4'는 4×2 지시와 모순되므로 'Row 1 closed / Row 2 open'으로 정정했습니다. 실제 사용 프롬프트를 보존했습니다.
- 상자는 열별 동일 배율로 축소하고 중심과 base y=216을 맞췄습니다. 원본 alpha를 유지했고 초록색 배경으로 바꾸지 않았습니다.
- 이 배경은 완성 일러스트이며 좌표 보장형 타일셋이 아닙니다. 기존 게임의 DOOR/충돌/상호작용 위치를 그대로 적용하기 전 실제 배경 위에 겹쳐 확인해야 합니다. 이 작업에서는 게임 코드를 수정하지 않았습니다.

## 패키지 검증

- PASS: manifest의 모든 이미지 크기·바이트 수·SHA256를 실제 최종 파일에서 다시 계산했습니다.
- PASS: contact_sheet.jpg는 1 MB 미만이며 실제 확인했습니다.
- PASS: 각 ZIP은 20,000,000 bytes 미만입니다.
- PASS: ZIP을 다시 열어 CRC와 SHA256SUMS.txt의 모든 payload 항목을 검증했습니다. SHA256SUMS.txt 자체는 자기 해시를 포함하지 않습니다.
- PASS: 각 ZIP 안 이미지와 manifest SHA256도 다시 비교하고 모든 이미지를 디코드했습니다.
- FAIL 항목은 이 보고서에 기록된 편차이며, 모든 지시가 충족됐다고 주장하지 않습니다.
