# 사용 방법 (사용자용) — 작업 팩 G1 (ACT IV 1부 · v0.10.0 「연합」의 가안 그림 전부, 12장)

v0.10.0에서 게임이 그린 가안으로 나오는 그림을 모두 모았습니다. **두 부분(A–B)으로 나뉘어 있어서 한 부분씩 시켜도 됩니다.** 엑스트라는 새로 그리지 않고 기존 그림을 씁니다(D-094: 습격대장 = 의식 기사, 재의 짐승 = 재 약탈단, 국경 피난민 = 피난민·순례자·아이). GPT용 영문 지시는 `00_START_HERE.md`에 있습니다.

| 부분 | 내용 | 장수 |
|---|---|---:|
| **A** | 물건 — 아이콘 시트 L, 전투 소품(회의 천막) | 2 |
| **B** | 이네스·테아의 각성 모습 | 10 |

권장 순서: **B → A** (눈에 많이 띄는 순서).

## 한 부분씩 시키기 (권장)
ChatGPT 작업 모드에 이 ZIP을 **통째로** 올리고 붙여 넣으세요. `B` 자리에 원하는 부분을 넣습니다.
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly. Do part B only: produce its images in the listed order using the prompts in prompts/ and the reference images in references/, run the self-check, and return Ashen_Crown_v0100_ACT4_Art_Pack_G1_B.zip as described in section 7 (split it if it would exceed 20 MB). Reopen and test every zip before handing it over and tell me each zip's size in bytes.
```

## 전부 한 번에
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly: produce both parts in the order B, A, run the self-check, and return one zip per part as described in section 7. Reopen and test every zip before handing it over and tell me each zip's size in bytes.
```

## 받은 뒤
- ZIP을 Claude에게 주세요. 한 개씩 와도 됩니다. 받으면 SHA256을 검증하고 해당 가안 그림을 교체합니다.
- GPT가 알려준 ZIP 크기와 받은 파일 크기가 같은지 봐 주세요.

## A. 물건 (모두 PROPOSED)
- **아이콘 시트 L (4개)**: 성역의 문(이네스 ④) · 철의 돌파(테아 ④) · 연합의 깃발 · 마지막 등불(보물)
- **전투 소품 시트**: 회의 천막 — 철왕관(청회색) / 연맹(이끼색) / 성화(불꽃빛) / 빼앗긴 천막

## B. 각성 모습 — 반신 4표정 + 맵 그림
| id | 모습 요점 |
|---|---|
| `ines_t3` 새벽 성기사 | 흰·금 휘장 겉옷과 진홍 테는 그대로, 새벽 금빛 테의 견갑과 목가리개, 진홍 망토 안쪽의 옅은 장밋빛, 어깨 뒤의 옅은 아치 모양 빛(열린 문), 테두리가 새벽 금빛으로 빛나는 흰 원방패 |
| `thea_t3` 흑철 기병대장 | 흑철 판금에 길어진 판 치마, 가슴을 가로지르는 강청색 띠, 짙은 회색 늑대 털 망토, 짧은 강청색 깃 장식의 흑철 투구(반신은 옆구리에), 강청색 깃발 창, 더 무거운 흑철 마갑의 짙은 회색 말 |

## 기존 그림을 쓰는 것 (D-094)
- 습격대장·의식 기사: 의식 기사 맵 그림 + 봉쇄 집행관 초상 · 재의 짐승: 재 약탈단 · 국경 피난민: 피난민·순례자·아이 · 세 지도자와 호위: 기존 그림
- 관문 권양기와 관문 문짝은 게임이 그린 그림을 그대로 둡니다.
