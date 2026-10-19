# 사용 방법 (사용자용)

이 ZIP을 **통째로** ChatGPT 작업 창에 올리고, 아래 메시지 중 하나를 붙여 넣으면 됩니다. 나머지 지시는 ZIP 안의 `00_START_HERE.md`에 모두 들어 있습니다 (ChatGPT가 읽는 영문 작업 지시서).

## A. 한 번에 8장 모두 (권장)
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly: produce all 8 images in the listed order using the prompts in prompts/ and the reference images in references/, run the self-check, and return a single zip named Ashen_Crown_v050_World_Art_Pack.zip in the structure described in section 5.
```

## B. 먼저 2장만 보고 결정하기
세계 지도와 평시 마을의 화풍을 먼저 확인하고 싶다면 이 메시지를 쓰세요.
```
Attached is a work pack. Read 00_START_HERE.md first. Do only jobs 1 (world_map) and 3 (hub_village_day) now, show them to me, and wait for my approval before doing the rest.
```
마음에 들면 이어서 이렇게 보냅니다.
```
Approved. Continue with all remaining jobs and return the zip described in section 5.
```

## 받은 뒤
- 결과 ZIP(`Ashen_Crown_v050_World_Art_Pack.zip`)을 Claude에게 그대로 주세요.
- Claude가 SHA256을 검증한 뒤 다음 작업을 합니다.
  - WebP로 변환합니다.
  - 거점마다 걸을 수 있는 칸, 문, NPC 자리를 작성합니다.
  - 세계 지도 위에 세력 영역을 그립니다.
  - 테스트와 스크린샷으로 검증합니다.

## 파일 구성
| 파일 | 내용 |
|---|---|
| `00_START_HERE.md` | ChatGPT용 작업 지시서 (산출물 8장, 규칙, 순서, 자체 점검, 반환 형식) |
| `jobs.csv` | 작업 목록 (순서, 파일명, 크기, 첨부할 참고 그림) |
| `prompts/01–08_*.txt` | 그림마다 완성된 프롬프트 |
| `references/layout_*.png` | 세계 지도와 거점 6곳의 배치 스케치 |
| `references/style_*.png` | 화풍 기준 (Aren, Eric 반신) |
| `references/sprite_eric_sheet.png`, `scale_reference.png` | 거점 위를 걷는 캐릭터의 크기 기준 |
