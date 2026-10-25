# 사용 방법 (사용자용) — 건물 내부 15곳 + 상자 시트

ChatGPT 작업 모드(Sol 6.1)에 이 ZIP을 **통째로** 올리고 아래 메시지를 붙여 넣으세요. 나머지 지시는 ZIP 안의 `00_START_HERE.md`(GPT가 읽는 영문 지시서)에 있습니다.

## A. 한 번에 16장 (권장)
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly: produce all 16 images in the listed order using the prompts in prompts/ and the reference images in references/, run the self-check, and return Ashen_Crown_v060_Interior_Art_Pack.zip (under 20 MB, or split into _A1/_A2) exactly as described in section 5.
```

## B. 기준 3장을 먼저 보고 결정하기
마을 민가, 병사 천막, 성채 병영(각 계열의 기준 그림)을 먼저 확인하고 싶을 때 쓰세요.
```
Attached is a work pack. Read 00_START_HERE.md first. Do only jobs 1-3 (the three family anchors) now, show them to me, and wait for my approval before doing the rest.
```
마음에 들면 이어서 이렇게 보냅니다.
```
Approved. Continue with all remaining jobs and return the zip described in section 5.
```

## 받은 뒤
- 결과 ZIP을 그대로 Claude에게 주세요. 20MB를 넘으면 GPT가 두 개(_A1, _A2)로 나눕니다. 그때는 둘 다 주세요.
- Claude가 SHA256을 검증한 뒤 이렇게 반영합니다.
  - WebP로 변환합니다.
  - 방마다 걸을 수 있는 칸, 문, 상자 자리를 그림에 맞춰 작성합니다.
  - 상자 시트를 잘라 방마다 어울리는 상자를 놓습니다(열림/닫힘).
  - 테스트와 스크린샷으로 확인합니다.
- 그림이 오기 전에도 게임은 지금처럼 동작합니다. 상자는 장소에 맞춘 임시 그림으로 먼저 바뀝니다.

## 파일 구성
| 파일 | 내용 |
|---|---|
| `00_START_HERE.md` | GPT용 작업 지시서 (16장, 규칙, 순서, 자체 점검, 반환 형식) |
| `jobs.csv` | 작업 목록 (순서, 파일명, 크기, 첨부할 참고 그림) |
| `prompts/01–16_*.txt` | 그림마다 완성된 프롬프트 |
| `references/layout_int_*.png` | 방 15곳의 배치 스케치 (12×8칸, 칸당 128px) |
| `references/layout_chests.png` | 상자 시트 배치 (6열×4행) |
| `references/exterior_*.jpg` | 이미 게임에 들어간 바깥 거점 그림 (재질·빛 맞추기용) |
| `references/scale_reference_interior.png`, `style_aren_neutral.png` | 크기·화풍 기준 |

## 방 목록 (PROPOSED — 마음에 들지 않는 방은 빼거나 바꿔도 됩니다)
| 계열 | 방 | 쓰이는 건물 | 상자 |
|---|---|---|---|
| 마을 | 민가 | 민가 | 꽃무늬 혼수함 |
| 마을 | 대장간 | 무기점 | — (대장장이) |
| 마을 | 도구점 | 도구점 | — (상인) |
| 마을 | 민병 병영 | 병영 | 민병 사물함 ×2 |
| 마을 | 촌장 회관 | 지휘관 숙소 | 호두나무 함 |
| 마을 | 보급 창고 | 보급 창고 | 곡식 궤 ×2 |
| 천막 | 병사 천막 | 수비대·야영지·맹세 진영 병사 천막 | 야전 사물함 ×2 |
| 천막 | 구호 천막 | 수비대 구호 천막 | 의약 상자 ×2 |
| 천막 | 지휘 천막 | 세 진영의 지휘 천막 | 장교 금고 |
| 천막 | 작전 천막 | 세 진영의 작전 천막 | 문서함 |
| 천막 | 보급 천막 | 세 진영의 보급 천막 | 보급 상자 ×2 |
| 성채 | 병영 | 병영, 병영 별채 | 성채 사물함 ×2 |
| 성채 | 무기고 | 무기고 | 무기고 궤 ×2 |
| 성채 | 기록실 | 기록실 | 문서함 |
| 성채 | 지휘관 숙소 | 지휘관 숙소 | 장교 금고 |
