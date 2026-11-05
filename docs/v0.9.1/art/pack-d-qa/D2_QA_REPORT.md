# Ashen Crown v0.7 ACT II Part 2 — D2 QA

검수 기준: 첨부 작업 팩 00_START_HERE.md. 이미지 생성 도구로 순서대로 제작하고, Python/Pillow는 지시된 크기 변환·패딩·프레임 위치 정렬·JPEG 인코딩·연락 시트 제작에 사용했습니다.

PASS는 실제 확인한 항목만 뜻합니다. 엄격한 일치 조건을 충족하지 못한 항목은 FAIL로 기록했습니다. 게임 엔진 안에서의 애니메이션·충돌·이벤트 좌표 검증은 수행하지 않았습니다.

## 파일별 기술 검수

| 파일 | 크기·디코드 | 배경 / 인코딩 |
|---|---|---|
| png/sprite_flameKnight.png | PASS · 1024×768 | 실제 RGBA 투명도 |
| png/sprite_pilgrim.png | PASS · 1024×768 | 실제 RGBA 투명도 |
| png/sprite_ashRaider.png | PASS · 1024×768 | 실제 RGBA 투명도 |
| png/sprite_monasteryGuard.png | PASS · 1024×768 | 실제 RGBA 투명도 |
| png/sprite_abbot.png | PASS · 1024×768 | 실제 RGBA 투명도 |
| png/sprite_maskedRaider.png | PASS · 1024×768 | 실제 RGBA 투명도 |

## 작업 팩 체크리스트

| 항목 | 결과 | 확인 내용 |
|---|---|---|
| 일반 유닛 6장, 1024×768 | PASS | 모두 RGBA PNG, 정확한 해상도, 정상 디코드. |
| 실제 투명 배경 | PASS | 모든 파일 alpha=0 영역 존재. 원본의 미세 반투명 가장자리·그림자 유지. |
| 4열×3행과 프레임 순서 | PASS | 72개 셀 유효. 정면 / 오른쪽 / 뒷면, idle / step A / step B / attack 확인. pilgrim의 마지막 열은 등불을 든 flinch. |
| 하단 16px 여백·셀 내 배치 | PASS | alpha≥40 실루엣 하단을 모든 셀 y=240으로 맞추고 안전 여백 재측정. |
| 문자·문장·로고·종교 표식 없음 | PASS | 개별 생성 결과와 최종 contact sheet에서 발견되지 않음. |
| 여섯 유닛의 시각 구분 | PASS | 흰색 기사, 무염색 순례복, 붉은 얼굴 가리개, 청동 가면, 횃불, 흰색 무표정 가면으로 구별. |
| 모든 색상·의상 지시 엄격 일치 | FAIL | ashRaider가 순수 검댕색보다 갈색 가죽·금속 장식 비중이 큼. maskedRaider도 무채색으로 수정했으나 어깨 장식 형태 일부가 남음. |
| 모든 프레임의 장비·체형 완전 일치 | FAIL | 공격 자세에서 무기 각도·비례가 약간 변함. 원본의 일부 무기는 셀 가장자리에 가까웠음. |

## 제작 기록과 적용 메모

- 13–18 순서로 생성했습니다. flameKnight는 첫 결과의 짙은 외투를 흰 tabard·강철 투구로 수정했습니다.
- maskedRaider는 첫 결과의 진홍색·금색 장식을 charcoal/black으로 수정했습니다. 최초 프롬프트와 수정 프롬프트를 모두 prompts_used에 보존했습니다.
- 시트마다 공통 배율을 사용하고 셀별 위치만 정렬했습니다. 정확한 변환과 원본 크기는 NORMALIZATION.json에 있습니다.
- 기준선은 alpha 실루엣 기준입니다. 접지 그림자나 긴 무기 끝 때문에 해부학적 발 위치와 수 px 차이가 날 수 있습니다. 실제 게임 동작 검수는 미수행입니다.

## 패키지 검증

- PASS: manifest의 모든 이미지 크기·바이트 수·SHA256를 실제 최종 파일에서 다시 계산했습니다.
- PASS: contact_sheet.jpg는 1 MB 미만이며 실제 확인했습니다.
- PASS: 각 ZIP은 20,000,000 bytes 미만입니다.
- PASS: ZIP을 다시 열어 CRC와 SHA256SUMS.txt의 모든 payload 항목을 검증했습니다. SHA256SUMS.txt 자체는 자기 해시를 포함하지 않습니다.
- PASS: 각 ZIP 안 이미지와 manifest SHA256도 다시 비교하고 모든 이미지를 디코드했습니다.
- FAIL 항목은 이 보고서에 기록된 편차이며, 모든 지시가 충족됐다고 주장하지 않습니다.
