# Ashen Crown v0.6.0 — Character Art QA (B1)

Cassian + Leonora — 8 busts

검수일: 2026-10-25 (한국시간)

## 결과

요청 범위의 8개 PNG를 모두 포함한다. 해상도·파일 디코딩·실제 투명도·패키지 무결성을 검사했다. 스프라이트가 있는 패키지는 4×3 프레임 배치와 셀 경계도 검사했다. 아래 FAIL 및 차이점을 숨기지 않고 기록한다. 작업 지시서의 예외 규정에 따라 최선의 결과와 함께 제공한다.

## 요청 체크리스트

| 항목 | 결과 | 근거 / 제한 |
|---|---|---|
| 8 busts at 1024×1280; 0 sheets at 1024×768 | PASS | 모든 PNG를 실제로 디코딩하고 크기·RGBA 모드 확인 |
| 투명 배경 또는 순수 녹색 | PASS | 모든 파일이 실제 alpha 투명 배경. 녹색 대체 방식 사용 안 함. 파일별 표 참고 |
| 글자·숫자·문장·로고·crest 없음 | PASS (육안) | 원본 크기와 contact sheet에서 확인. 방패·의상·마구는 색면과 소재로 구분. 일반 리벳·버클·색면 분할은 유지. OCR 완전성 보증은 아님 |
| 각 인물의 4개 bust가 같은 얼굴·의상·구도·조명 | PASS (시각적 일관성) | neutral을 직접 참조해 3개 표정 생성. 머리·얼굴 특징·복장·조명 유지 |
| 표정 외 모든 픽셀이 동일하고 머리 자세도 완전히 고정됨 | FAIL | 편집 생성 특성상 머리 윤곽·고개 각도·털/머리카락·의상 텍스처 및 색감에 미세한 차이. 아래 측정 결과 참고 |
| 시트의 12프레임 배치 | N/A | 이 ZIP은 bust만 포함 |
| RIGHT 행 검사 | N/A | sprite 없음 |
| 발 기준선·셀 경계 | N/A | sprite 없음 |
| 기마/보행 | N/A | sprite 없음 |
| sprite scale | N/A | sprite 없음 |
| contact_sheet.jpg 1 MB 미만 | PASS | 실제 바이트 크기 확인 |
| ZIP 20,000,000 bytes 미만 | PASS | ZIP 생성 후 실제 크기 확인 |
| ZIP 재개봉, SHA256, manifest 검사 | PASS | ZIP의 CRC 검사와 모든 체크섬 항목 대조. ZIP 안 모든 PNG를 다시 디코딩 |

## 파일별 배경

| file | background | alpha range |
|---|---|---|
| bust_cassian_neutral.png | RGBA / actual transparency | 0–255 |
| bust_cassian_concerned.png | RGBA / actual transparency | 0–255 |
| bust_cassian_determined.png | RGBA / actual transparency | 0–255 |
| bust_cassian_sad.png | RGBA / actual transparency | 0–255 |
| bust_leonora_neutral.png | RGBA / actual transparency | 0–255 |
| bust_leonora_concerned.png | RGBA / actual transparency | 0–255 |
| bust_leonora_determined.png | RGBA / actual transparency | 0–255 |
| bust_leonora_sad.png | RGBA / actual transparency | 0–255 |

## 인물 일관성 측정

같은 1024×1280 캔버스에서 alpha>128 실루엣의 IoU를 구했다. 별도 위치 정합은 하지 않았다. 의상 RGB MAE는 얼굴을 제외한 하단(y≥700)의 공통 고형 영역에서 0–255 채널 값을 비교한 평균 절대차다. 이는 얼굴 인식 점수가 아니며, 픽셀 완전 동일 조건이 충족되지 않았음을 확인하기 위한 수치다.

| character / expression | silhouette IoU | lower-costume RGB MAE |
|---|---:|---:|
| cassian / concerned | 0.9906 | 5.374 |
| cassian / determined | 0.9862 | 4.953 |
| cassian / sad | 0.9900 | 4.985 |
| leonora / concerned | 0.9907 | 5.626 |
| leonora / determined | 0.9918 | 5.227 |
| leonora / sad | 0.9883 | 11.652 |

## 주요 차이점 / 적용 참고

- Cassian: 지정한 회색 홍채가 따뜻한 조명 아래 갈색 기운으로 보이는 표현이 있다. 초기 neutral의 구도·특징을 후속 표정에 유지했다.
- Leonora: ash-blonde braid, 주근깨, green/cream 의상, 다색 리본 sash를 유지했다. sad에서 고개가 약간 내려가고 조명/색감이 미세하게 변한다.
- 두 인물 모두 표정별 리벳, 모피/머리카락과 일부 가장자리 픽셀은 neutral과 완전히 같지 않다. 정적 대화 초상화로 쓰기 위한 결과이며, 얼굴만 교체하는 픽셀 완전 일치 합성본은 아니다.

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
