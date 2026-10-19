# Tier 2 Asset QA

검증일: 2026-10-19

## 파일 검증

| 항목 | 결과 |
|---|---|
| 고유 이미지 | 반신 20장 + Sprite Sheet 5종 = 25개 |
| PNG master | 25/25 decode·RGBA·실제 alpha·지정 해상도 PASS |
| Runtime WebP | 25/25 decode·RGBA·실제 alpha·지정 해상도 PASS |
| Manifest SHA256 | 50/50 PASS |
| Sprite 4열×3행 | 5/5 PASS |
| 비어 있지 않은 프레임 | 원본 PNG 60/60, 변환 WebP 60/60 PASS |
| Sprite 하단 여백 | PNG 16px / WebP 8px, 120/120 PASS |
| 시트 내 공통 축소율 | 5/5 PASS |
| 얼굴/외형 비교 | 기존 승인 neutral과 전직 neutral 비교 시트 육안 확인 |
| 표정/방향/장비 확인 | 생성 이미지와 최종 roster 육안 확인 |
| 게임 통합 / Save / Mobile / CI / Offline HTML | 미수행, Claude 적용 단계에서 검증 |

## 용량

- Runtime 25개 전체: 2,691,852 bytes (2.57 MiB).
- PNG 25개 전체: 44,128,242 bytes (42.08 MiB).
- Base64 이미지 문자열 예상: 약 3.42 MiB. 최종 HTML 증가는 실제 build 후 측정해야 한다.
- 반신 목표 약 80 KiB 초과: 20/20. 최대 168.4 KiB.
- Sheet 목표 약 60 KiB 초과: 1/5. 최대 63.4 KiB.
- 투명 alpha와 얼굴/복장 세부를 보존해 지시서의 예상 2MB HTML 증가 목표보다 실제 예상 크기가 크다. 정확한 개별 크기와 SHA256은 manifest를 따른다.

## 제작 및 후처리

이미지는 built-in image_gen으로 개별 생성했다 (기본 반신 5회, 표정 변경 15회, Sprite Sheet 5회). 실제 승인 이미지 파일을 reference로 사용했다. 전직 neutral을 concerned/determined/sad의 기준으로 다시 사용했다.

생성 반신 1122×1402는 비율을 유지해 1024×1280으로 변환했다. Runtime은 720×880 안에 contain하고 하단 정렬했다. 좌우의 소량 투명 여백은 종횡비 차이를 보존하기 위한 것이다.

Sprite 생성 원본은 1448×1086이다. 연결된 figure를 12개로 분리하고, 경계를 넘은 bow/staff를 포함해 전체 figure의 source bbox를 보존한 뒤 같은 시트의 12프레임에 공통 배율을 적용했다. PNG 256px cell 안으로 정렬하고 각 cell을 128px로 축소했다. 아주 낮은 alpha(≤4) fringe만 정리하고 하단 여백을 확보했다.

기준 anchor는 전체 실루엣의 하단 정렬을 나타낸다. 검·지팡이의 끝이 발보다 낮은 프레임은 실제 renderer에서 발 접지를 보고 anchor override가 필요할 수 있다. 원본 frame 의미와 동작은 제공한 이미지 그대로이며 skeleton animation이나 보간 프레임은 생성하지 않았다. 생성 이미지 특성상 표정별 작은 붓터치/의상 주름 차이가 남을 수 있다.

## Claude 적용 시 반드시 확인

기존 85개 이미지와 전직 전 외형을 보존하고, `_t2` appearance 선택만 연결한다. `eric_adv`와 `eric_t2`를 합치지 않는다. 기존 unit ID/전직 조건/save schema/campaign/balance를 바꾸지 않는다. 걷기 loop, 공격 방향, 무기 잘림, 발 접지, 이미지 캐시, Mobile 가독성 및 offline 실행은 게임에서 확인해야 한다. 이 팩은 플레이 검증을 마친 release가 아니다.
