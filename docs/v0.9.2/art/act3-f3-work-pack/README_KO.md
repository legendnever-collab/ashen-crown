# 사용 방법 (사용자용) — 작업 팩 F3 (ACT III 3부 · v0.9.2의 가안 그림 전부, 24장)

v0.9.2에서 게임이 그린 가안으로 나오는 그림을 모두 모았습니다. **세 부분(A–C)으로 나뉘어 있어서 한 부분씩 시켜도 됩니다.** GPT용 영문 지시는 `00_START_HERE.md`에 있습니다.

| 부분 | 내용 | 장수 |
|---|---|---:|
| **A** | 물건 — 아이콘 시트 J, 전투 소품(의식진, 문서고 서가) | 2 |
| **B** | 리아·카이의 각성 모습 | 10 |
| **C** | 리아의 스승, 카이의 옛 상관, 의식 기사, 의식사 | 12 |

권장 순서: **B → C → A** (눈에 많이 띄는 순서).

## 한 부분씩 시키기 (권장)
ChatGPT 작업 모드에 이 ZIP을 **통째로** 올리고 붙여 넣으세요. `B` 자리에 원하는 부분을 넣습니다.
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly. Do part B only: produce its images in the listed order using the prompts in prompts/ and the reference images in references/, run the self-check, and return Ashen_Crown_v092_ACT3_Art_Pack_F3_B.zip as described in section 7 (split it if it would exceed 20 MB). Reopen and test every zip before handing it over and tell me each zip's size in bytes.
```

## 전부 한 번에
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly: produce all parts in the order B, C, A, run the self-check, and return one zip per part as described in section 7. Reopen and test every zip before handing it over and tell me each zip's size in bytes.
```

## 받은 뒤
- ZIP을 Claude에게 주세요. 한 개씩 와도 됩니다. 받으면 SHA256을 검증하고 해당 가안 그림을 교체합니다.
- GPT가 알려준 ZIP 크기와 받은 파일 크기가 같은지 봐 주세요.

## A. 물건 (모두 PROPOSED)
- **아이콘 시트 J (4개)**: 작은 결계 · 그림자 군무(④) · 스승의 깃펜 · 회색 장부(보물)
- **전투 소품 시트**: 의식진(빛남 / 꺼짐), 문서고 서가(멀쩡함 / 불탐)

## B. 각성 모습 — 반신 4표정 + 맵 그림
| id | 모습 요점 |
|---|---|
| `lia_t3` 결계술사 | 짙은 남보라 겉옷에 옅은 은금 테, 접힌 빛 같은 반투명 금빛 어깨 망토, 챙 넓은 모자는 그대로(보석 장식 대신 옅은 금 띠), 스승의 수첩, 손끝의 작은 네모 결계 빛 |
| `kai_t3` 그림자 군주 | 숯빛 가죽 긴 코트에 짙은 청록 안감, 내린 반두건, 주황 목도리는 턱 아래로 내려 얼굴을 드러냄, 옷자락의 옅은 그림자, 서류가 빈 회색 장부 끈, 쌍단검 |

## C. 사람과 맵 그림
- 반신(표정 4개씩): **리아의 스승**(60대 봉인술 학자, 둥근 안경, 리아와 같은 계열의 짙은 파랑 학자 겉옷 — 이름 없음), **회색 장부의 우두머리**(카이의 옛 상관, 50대, 철회색 머리와 턱 흉터, 숯빛 가죽 코트와 잿빛 망토 — 이름 없음)
- 맵 그림: 리아의 스승, 회색 장부의 우두머리, 의식 기사, 재상부 의식사
