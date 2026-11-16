# 사용 방법 (사용자용) — 그림팩 H1 (v2.0.0 전장 개편, 38장)

설계안 §9(D-115)의 첫 그림팩입니다. GPT용 영문 지시는 `00_START_HERE.md`에 있습니다.

| 부분 | 내용 | 장수 |
|---|---|---:|
| **A** | 병종 전장 그림 1단계 (보병·창병·궁병·기병·마도사·치유사·도적·방패병) | 8 |
| **B** | 병종 전장 그림 2단계 | 8 |
| **C** | 병종 전장 그림 3단계 (잿빛 문장과 결계의 금빛) | 8 |
| **D** | 부장 넷(브람·노아·마르타·로웰)의 초상 × 표정 셋 | 12 |
| **E** | 잿빛 결투장 배경 + 아이콘 시트 P(보물 여섯) | 2 |

## 시키는 법 (부분마다 한 번씩)
ChatGPT 작업 모드에 이 ZIP을 **통째로** 올리고, 부분마다 붙여 넣으세요. `<A|B|C|D|E>`만 바꿉니다.
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly. Do part <A|B|C|D|E> only: produce its images in the listed order using the prompts in prompts/ and the reference images in references/, run the self-check, and return Ashen_Crown_v200_Art_Pack_H1_<A|B|C|D|E>.
```

## 진영 색(마젠타) 규칙
병종 그림에서 **진영을 나타낼 천(겉옷·망토·띠·마갑 천)만 순수한 마젠타**로 칠하게 했습니다. 게임이 그 부분을 아군 파랑·적 빨강·동맹 깃발 색으로 바꿉니다. 그래서 같은 병종은 아군과 적군이 같은 그림이고 색만 다릅니다.

## 승급별 변화 (§3.5)
| 병종 | 1단계 | 2단계 | 3단계 |
|---|---|---|---|
| 궁병 | 화살 1발 | 화살 2발 | 잿불 화살 3발 |
| 기병 | 가죽 마갑 | 사슬 마갑 | 판금 마갑, 갈기 장식 |
| 보병 | 베기 | 2연 베기 | 회전 베기 |
| 그 밖 | 표 `00_START_HERE.md` §2 | | |

## 표절 방지 (§13)
지시서에 「기존 게임의 그림·병과 복장·결투 화면을 흉내 내지 말 것, 게임 이름을 쓰지 말 것」을 적었습니다. 받은 뒤 확인합니다.

## 받은 뒤
ZIP을 Claude에게 주세요. SHA256을 검증하고 넣습니다(병종·초상: import-art.py, 결투장: import-duel-art.py, 아이콘: import-item-art.py --cells). 받기 전까지는 게임이 기존 그림에 색을 입혀 임시로 씁니다.
