# Ashen Crown v0.6.0 — Character Art QA (B2)

Thea + Dario — 8 busts + 2 sheets

검수일: 2026-10-25 (한국시간)

## 결과

요청 범위의 10개 PNG를 모두 포함한다. 해상도·파일 디코딩·실제 투명도·패키지 무결성을 검사했다. 스프라이트가 있는 패키지는 4×3 프레임 배치와 셀 경계도 검사했다. 아래 FAIL 및 차이점을 숨기지 않고 기록한다. 작업 지시서의 예외 규정에 따라 최선의 결과와 함께 제공한다.

## 요청 체크리스트

| 항목 | 결과 | 근거 / 제한 |
|---|---|---|
| 8 busts at 1024×1280; 2 sheets at 1024×768 | PASS | 모든 PNG를 실제로 디코딩하고 크기·RGBA 모드 확인 |
| 투명 배경 또는 순수 녹색 | PASS | 모든 파일이 실제 alpha 투명 배경. 녹색 대체 방식 사용 안 함. 파일별 표 참고 |
| 글자·숫자·문장·로고·crest 없음 | PASS (육안) | 원본 크기와 contact sheet에서 확인. 방패·의상·마구는 색면과 소재로 구분. 일반 리벳·버클·색면 분할은 유지. OCR 완전성 보증은 아님 |
| 각 인물의 4개 bust가 같은 얼굴·의상·구도·조명 | PASS (시각적 일관성) | neutral을 직접 참조해 3개 표정 생성. 머리·얼굴 특징·복장·조명 유지 |
| 표정 외 모든 픽셀이 동일하고 머리 자세도 완전히 고정됨 | FAIL | 편집 생성 특성상 머리 윤곽·고개 각도·털/머리카락·의상 텍스처 및 색감에 미세한 차이. 아래 측정 결과 참고 |
| 각 시트 12프레임, 올바른 행/열 | PASS | 9개 전체 작업 중 이 ZIP의 2개 시트를 검사. 4열×3행, 각 셀에 하나의 연결된 고형 실루엣. 행: DOWN / RIGHT / UP, 열: idle / step A / step B / attack |
| 두 번째 행이 RIGHT, 좌우 혼동 없음 | PASS (육안) | 모든 네 프레임의 얼굴·몸통·공격 방향을 시트별 확인 |
| 발/발굽 기준선 및 셀 경계 | PASS (배치 기준) | 셀 안 기준선 좌표 y=240, 기준 고형 발 픽셀 y=239. 비율 유지 축소·이동 후 경계의 고형 픽셀 없음. Dario 정면 idle은 발보다 검 끝이 더 낮으므로 발 위치를 별도 기준으로 사용. 세부 설명 참고 |
| Thea는 기마, 나머지는 보행 | PASS | Thea 12프레임 전부 회색 말 탑승. Dario는 전부 보행 |
| 참조 시트의 스케일 및 약 2/3 셀 높이 | PASS (대략) / 정확히 동일한 체형 비율은 FAIL | 시트별 공통 비율 축소로 보행 인물 크기를 약 2/3 셀 높이에 가깝게 맞춤. 포즈·투시 및 무기 길이에 따른 차이가 남음. 기마 Thea는 말과 창 때문에 더 큰 실루엣 |
| contact_sheet.jpg 1 MB 미만 | PASS | 실제 바이트 크기 확인 |
| ZIP 20,000,000 bytes 미만 | PASS | ZIP 생성 후 실제 크기 확인 |
| ZIP 재개봉, SHA256, manifest 검사 | PASS | ZIP의 CRC 검사와 모든 체크섬 항목 대조. ZIP 안 모든 PNG를 다시 디코딩 |

## 파일별 배경

| file | background | alpha range |
|---|---|---|
| bust_thea_neutral.png | RGBA / actual transparency | 0–255 |
| bust_thea_concerned.png | RGBA / actual transparency | 0–255 |
| bust_thea_determined.png | RGBA / actual transparency | 0–255 |
| bust_thea_sad.png | RGBA / actual transparency | 0–255 |
| bust_dario_neutral.png | RGBA / actual transparency | 0–255 |
| bust_dario_concerned.png | RGBA / actual transparency | 0–255 |
| bust_dario_determined.png | RGBA / actual transparency | 0–255 |
| bust_dario_sad.png | RGBA / actual transparency | 0–255 |
| sprite_thea.png | RGBA / actual transparency | 0–255 |
| sprite_dario.png | RGBA / actual transparency | 0–255 |

## 인물 일관성 측정

같은 1024×1280 캔버스에서 alpha>128 실루엣의 IoU를 구했다. 별도 위치 정합은 하지 않았다. 의상 RGB MAE는 얼굴을 제외한 하단(y≥700)의 공통 고형 영역에서 0–255 채널 값을 비교한 평균 절대차다. 이는 얼굴 인식 점수가 아니며, 픽셀 완전 동일 조건이 충족되지 않았음을 확인하기 위한 수치다.

| character / expression | silhouette IoU | lower-costume RGB MAE |
|---|---:|---:|
| thea / concerned | 0.9880 | 6.522 |
| thea / determined | 0.9900 | 6.482 |
| thea / sad | 0.9864 | 6.509 |
| dario / concerned | 0.9900 | 6.563 |
| dario / determined | 0.9894 | 7.110 |
| dario / sad | 0.9838 | 6.517 |

## 주요 차이점 / 적용 참고

- Thea: copper-brown high ponytail, blue eyes, 턱 흉터, steel-blue 갑옷과 fur collar를 유지. 네 bust 간 머리 자세·텍스처에 미세한 차이.
- Dario: black tied curls, stubble, gold hoop, wine-red/brown/sea-green 의상, 왼팔 붕대를 유지. 네 bust 간 머리 자세·텍스처에 미세한 차이.
- Dario의 선택된 sprite에는 일부 프레임에서 오른팔에도 흰 붕대가 추가되어, 왼팔만 붕대가 보이는 bust와 복장이 완전히 일치하지 않는다. 이 복장 연속성 항목은 FAIL이다. 무기와 손이 온전히 들어가는 시트를 선택했다.
- 작은 sprite에서 눈색·미세한 흉터는 판독이 어렵다. 얼굴·머리·옷색은 같은 인물로 읽히도록 유지했다.
- Dario의 검은 작은 크기에서 양날처럼 보이는 부분이 있어, 단날 검 형태의 엄격한 재현은 완전하지 않다.
- Thea의 lance 및 기마 attack 포즈는 셀에 맞춘 축약된 투시·길이이며, 모든 방향에 대한 같은 3D 무기 모델의 투영은 아니다.

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
