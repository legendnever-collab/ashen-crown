# Ashen Crown v0.9.0 ACT III Part 1 — F1_2 QA

기준: 첨부 작업 팩의 00_START_HERE.md. PASS는 실제 수행한 기술 검사 또는 시각 검사에 한정합니다. 생성형 그림의 미세한 차이는 엄격한 일치 항목에서 FAIL로 기록했습니다.

## 파일별 규격

| 파일 | 크기 | 디코드 | 배경·인코딩 |
|---|---|---|---|
| img/hub_capital.jpg | 1536×1024 | PASS | RGB JPEG quality94 |
| img/int_capital_tavern.jpg | 1536×1024 | PASS | RGB JPEG quality94 |
| img/int_capital_armory.jpg | 1536×1024 | PASS | RGB JPEG quality94 |
| img/int_capital_apothecary.jpg | 1536×1024 | PASS | RGB JPEG quality94 |
| img/int_capital_records.jpg | 1536×1024 | PASS | RGB JPEG quality94 |
| img/int_capital_house.jpg | 1536×1024 | PASS | RGB JPEG quality94 |
| img/int_capital_warehouse.jpg | 1536×1024 | PASS | RGB JPEG quality94 |
| img/chests_capital.png | 1024×512 | PASS | 실제 RGBA alpha |
| png/icons_H.png | 1024×1024 | PASS | 실제 RGBA alpha |

## 작업 팩 체크리스트

| 항목 | 결과 | 근거·편차 |
|---|---|---|
| hub와 6개 실내 1536×1024 RGB JPEG | PASS | 7장 모두 정상 디코드, quality94 quantization table 확인, 4:4:4 인코딩. |
| chests 1024×512 PNG, icons 1024×1024 PNG | PASS | 실제 RGBA alpha, 해상도·디코드 검사 완료. |
| hub·실내에 사람·동물 없음 | PASS | 개별 생성 결과와 최종 contact sheet 시각 검사. 무기점 허수아비·의복 진열대는 무생물 소품. |
| 문자·숫자·로고·문장·종교 표식 없음 | PASS | 식별 가능한 글자·룬·문장·종교 표식을 발견하지 않음. 책·서류·봉인·상자 표기는 비워 둠. 지도에는 지형 그림만 있음. |
| 왕도 주요 배치·왼쪽 수로·하단 중앙 길 유지 | PASS | approved_hub_velmar.jpg를 직접 편집 대상으로 사용. 건물군·문·분수·부두·수로·출입로의 큰 배치를 시각 비교. |
| 기존 footprint와 DOOR 위치의 완전 동일 보장 | FAIL | 생성형 재채색 과정에서 건물 외곽·문턱·계단·부두가 미세하게 변형됨. pixel-perfect 지형 일치를 보장하지 않음. 배치 스케치의 일부 문 좌표는 승인 원본과 애초에 다르므로, 명시된 기존 지형 유지 지시에 따라 승인 원본을 우선함. |
| 실내 스케치의 주요 가구·빈 통행로·하단 출입구 | PASS | 6개 실내 모두 해당 시설과 비어 있는 하단 바닥, 중앙 절개 출입구 확인. warehouse 출입구의 물은 최종 수정으로 마른 돌계단으로 교체. |
| 모든 가구가 도면 상자 안에 엄격히 포함 | FAIL | tavern bar·테이블과 일부 침대·서가 등의 크기와 위치가 스케치 범위를 조금 넘음. 벽 장식·선반·창문 등 추가 소품이 있음. |
| CHEST / SHOPKEEPER 칸에 상자·사람 없음 | PASS | 도면의 예약 위치를 개별 그림과 시각 비교. 실제 게임 충돌 마스크를 계산한 것은 아님. |
| 상자 4종 closed/open 대응·내부 비움 | PASS | 위쪽 닫힘 4개, 아래쪽 열린 4개, 동일 열 대응. 보물·아이템·발광 없음. |
| 닫힘/열림 상자 본체 완전 동일 | FAIL | 쌍별 공통 배율·중심·하단 기준선은 맞췄으나 본체 깊이·폭·잠금장치가 약간 다름. archive coffer의 종이 띠 위치도 소폭 다름. |
| H01–H08 정확한 셀 배치 | PASS | saber / bow / rod / vestment, mantle / ring / lens / lantern 순서 확인. cells.csv 포함. |
| 아이콘 80% 안전 영역 | PASS | 8개 모두 전체 alpha bbox가 각 셀 x,y 26–230 안에 있음. 실제 bbox는 VALIDATION.json 참조. |
| 아이콘 H09–H16 완전 투명 | PASS | 최종 atlas 하단 512px의 alpha 최솟값·최댓값 모두 0을 검사. |
| 승인 시트와 마감 일관성 및 40px 판독성 | PASS | 소재·조명·윤곽과 40×40 실크기 미리보기 시각 확인. 아이콘 금속·직물 무늬가 완전 동일한 스타일 파라미터로 고정된 것은 아님. |

## 제작·변환 기록

- 13 hub → 14 tavern → 15–19 실내 → 20 상자 → 21 아이콘 순서로 제작했습니다. hub와 tavern을 후속 실내의 스타일 참조로 사용했습니다.
- hub는 승인된 Velmar를 직접 편집 대상으로 삼았습니다. 장식과 건물 외관을 왕도 분위기로 재채색했지만 충돌 좌표 호환성을 엔진에서 검증한 것은 아닙니다.
- 상자 프롬프트의 'Rows1 and3 / Rows2 and4'는 4×2 지시와 모순되므로 상단 closed / 하단 open 두 행으로 정정했습니다.
- icons_H의 첫 두 결과에 공유된 흰 배경이 남아 승인 아이콘 시트만을 참조해 다시 생성했습니다. 최종 이미지에서 8개 개체를 비율 유지 축소·패딩하여 200×200 안전 영역 안에 배치했습니다. 원본의 두 행은 목표 행 경계를 조금 넘었으므로 개체가 잘리지 않도록 실제 내용의 행 범위를 사용해 재배치했습니다. 하단 두 행은 빈 투명 캔버스입니다.
- icons_H.png 외에도 40px 판독 확인용 icons_40px_preview.png, 매핑 cells.csv, 형식별 manifest_places.csv / manifest_icons.csv를 포함했습니다. 메인 manifest.csv는 패키지의 모든 주 이미지 9장을 나열합니다.
- 실제 사용 프롬프트와 수정 프롬프트는 prompts_used에 있습니다. 최종 선택 아이콘 프롬프트는 icons_H_final.txt입니다.
- 이미지 생성 도구로 제작했으며 Python/Pillow는 지시된 비율 유지 축소·패딩·위치 정렬·JPEG 변환·연락 시트·검증에만 사용했습니다.

## ZIP 무결성 검사

- PASS: manifest의 최종 이미지 크기·바이트·SHA256 재계산.
- PASS: contact_sheet.jpg 1,000,000 bytes 미만, 실제 시각 검사.
- PASS: 각 ZIP 20,000,000 bytes 미만.
- PASS: ZIP 재개봉 후 모든 항목 CRC와 SHA256SUMS.txt의 모든 payload 해시 검사.
- PASS: ZIP 안 manifest와 모든 주 이미지 해시를 대조하고 다시 디코드.
- SHA256SUMS.txt는 자기 자신의 해시를 포함하지 않습니다.
- FAIL 항목은 남아 있는 편차입니다. 모든 지시가 완전히 충족됐다고 주장하지 않습니다.
