# 사용 방법 (사용자용) — 작업 팩 G3 (ACT IV 3부 · v0.10.2 「잿빛 밤」, 2장)

ACT IV 설계 Q8(최소 범위)에 따라 v0.10.2에서 **새로 그릴 가치가 있는 가안 그림만** 모았습니다. 한 부분(A) 2장뿐입니다. GPT용 영문 지시는 `00_START_HERE.md`에 있습니다.

| 부분 | 내용 | 장수 |
|---|---|---:|
| **A** | 물건 — 전투 소품(공성추·사다리·기억 조각), 아이콘 시트 N | 2 |

## 시키는 법
ChatGPT 작업 모드에 이 ZIP을 **통째로** 올리고 붙여 넣으세요.
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly. Do part A: produce its images in the listed order using the prompts in prompts/ and the reference images in references/, run the self-check, and return Ashen_Crown_v0102_ACT4_Art_Pack_G3_A.zip as described in section 7. Reopen and test the zip before handing it over and tell me its size in bytes.
```

## 받은 뒤
- ZIP을 Claude에게 주세요. 받으면 SHA256을 검증하고 해당 가안 그림을 교체합니다(소품: import-interior-art.py `props_act4c`, 아이콘: import-item-art.py --cells).

## 전투 소품 시트 `props_act4c` (4칸, 모두 PROPOSED)
| 칸 | id | 무엇 |
|---|---|---|
| 1 | `ram` | M27 공성추 — 지붕 덮인 파쇄추, 앞이 맵 위쪽(성문)을 향함 |
| 2 | `ladder` | M27 성벽 사다리 — 세 구간에 걸리는 공성 사다리 |
| 3 | `memory` | M28 기억 조각 — 돌 받침 위에 뜬 옅은 보랏빛 수정 |
| 4 | `memory_read` | 같은 조각을 읽은 뒤 — 빛이 꺼지고 금이 간 회색 |

## 아이콘 시트 N (3개, 모두 PROPOSED)
아렌의 군령 · 끝까지 함께 · 성문 파쇄추의 쇠머리(M27 숨은 전과) · 잿빛 밤의 목걸이(M28 숨은 전과)

## 새로 그리지 않는 것 (Q8 최소 · D-094)
- **젊은 아렌(기억 속)**: 지금 아렌 그림을 게임이 세피아로 색만 바꿉니다.
- **잿빛 밤의 잔영**: 의식 기사·왕실 근위 그림을 회색으로 그립니다.
- 성문 문짝, 성벽 궁수, 기억의 궁 바닥·벽: 기존 그림과 타일을 그대로 씁니다.
