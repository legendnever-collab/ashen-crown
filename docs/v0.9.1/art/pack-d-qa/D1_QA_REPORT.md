# Ashen Crown v0.7 ACT II Part 2 — D1 QA

검수 기준: 첨부 작업 팩 00_START_HERE.md. 이미지 생성 도구로 순서대로 제작하고, Python/Pillow는 지시된 크기 변환·패딩·프레임 위치 정렬·JPEG 인코딩·연락 시트 제작에 사용했습니다.

PASS는 실제 확인한 항목만 뜻합니다. 엄격한 일치 조건을 충족하지 못한 항목은 FAIL로 기록했습니다. 게임 엔진 안에서의 애니메이션·충돌·이벤트 좌표 검증은 수행하지 않았습니다.

## 파일별 기술 검수

| 파일 | 크기·디코드 | 배경 / 인코딩 |
|---|---|---|
| png/bust_lucien_neutral.png | PASS · 1024×1280 | 실제 RGBA 투명도 |
| png/bust_lucien_concerned.png | PASS · 1024×1280 | 실제 RGBA 투명도 |
| png/bust_lucien_determined.png | PASS · 1024×1280 | 실제 RGBA 투명도 |
| png/bust_lucien_sad.png | PASS · 1024×1280 | 실제 RGBA 투명도 |
| png/sprite_lucien.png | PASS · 1024×768 | 실제 RGBA 투명도 |
| png/bust_ines_neutral.png | PASS · 1024×1280 | 실제 RGBA 투명도 |
| png/bust_ines_concerned.png | PASS · 1024×1280 | 실제 RGBA 투명도 |
| png/bust_ines_determined.png | PASS · 1024×1280 | 실제 RGBA 투명도 |
| png/bust_ines_sad.png | PASS · 1024×1280 | 실제 RGBA 투명도 |
| png/sprite_ines.png | PASS · 1024×768 | 실제 RGBA 투명도 |
| png/sprite_cassian.png | PASS · 1024×768 | 실제 RGBA 투명도 |
| png/sprite_leonora.png | PASS · 1024×768 | 실제 RGBA 투명도 |

## 작업 팩 체크리스트

| 항목 | 결과 | 확인 내용 |
|---|---|---|
| 8 busts, 4 sprite sheets, 정확한 해상도 | PASS | 8×1024×1280, 4×1024×768. 모두 디코드 완료. |
| 투명 배경 | PASS | 모든 파일 실제 RGBA alpha. #00FF00 방식 아님. 미세한 반투명 가장자리와 그림자는 유지. |
| 문자·문장·로고·종교 표식 없음 | PASS | 개별 생성 결과 및 최종 contact sheet 시각 검사에서 발견되지 않음. 자동 문자 인식으로 증명한 것은 아님. |
| 각 인물의 얼굴·의상·조명 연속성 | PASS | Lucien / Ines 각각 neutral을 직접 참조. Cassian / Leonora는 제공 승인 bust를 참조. |
| 표정 외 모든 픽셀/자세 동일 | FAIL | sad에서 머리 기울기와 얼굴 윤곽이 조금 달라짐. 생성형 변형이므로 의상 주름까지 완전 동일하지 않음. |
| 시트별 4열×3행, 12프레임 | PASS | 48개 셀 모두 유효 이미지. 정면 / 오른쪽 / 뒷면 순서 시각 확인. |
| idle, step A, step B, attack 열 순서 | PASS | 생성 결과에서 자세 순서 확인. 실제 게임 재생 검수는 미수행. |
| 셀 하단 16px 여백과 안전 여백 | PASS | alpha≥40 실루엣의 bbox 하단을 모든 셀 y=240으로 맞추고 재측정. 해부학적 발 접지점보다 그림자/의복이 낮을 수 있음. |
| 4방향/모든 셀의 인체·장비 형태 완전 동일 | FAIL | 공격 자세에서 시점과 장비 형태에 소폭 변형. 일부 원본 공격 무기가 우측 가장자리에 가까웠음. 최종 셀은 안전 여백을 확보했으나 원본의 보이지 않는 외곽까지 복원됐다고 보장하지 않음. |

## 제작 기록과 적용 메모

- 01–12 순서로 생성. Ines의 짧은 검은 머리·코 흉터, Lucien의 은발·등불 지팡이, Cassian의 남색 모피 외투, Leonora의 금발·녹색 망토를 확인했습니다.
- bust는 같은 원본 캔버스 비율을 유지해 축소·패딩했습니다. 원본 픽셀 크기와 변환 방법은 NORMALIZATION.json에 있습니다.
- sprite는 한 시트 내 공통 배율로 축소한 뒤 각 셀을 수평 중앙과 동일 하단 기준선에 배치했습니다. 자세별 크기를 독립적으로 늘이거나 찌그러뜨리지 않았습니다.
- 미세한 alpha fringe와 접지 그림자는 남아 있습니다. 다양한 게임 배경에서의 추가 합성 검수가 권장됩니다.

## 패키지 검증

- PASS: manifest의 모든 이미지 크기·바이트 수·SHA256를 실제 최종 파일에서 다시 계산했습니다.
- PASS: contact_sheet.jpg는 1 MB 미만이며 실제 확인했습니다.
- PASS: 각 ZIP은 20,000,000 bytes 미만입니다.
- PASS: ZIP을 다시 열어 CRC와 SHA256SUMS.txt의 모든 payload 항목을 검증했습니다. SHA256SUMS.txt 자체는 자기 해시를 포함하지 않습니다.
- PASS: 각 ZIP 안 이미지와 manifest SHA256도 다시 비교하고 모든 이미지를 디코드했습니다.
- FAIL 항목은 이 보고서에 기록된 편차이며, 모든 지시가 충족됐다고 주장하지 않습니다.
