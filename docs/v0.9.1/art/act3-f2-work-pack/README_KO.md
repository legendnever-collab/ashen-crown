# 사용 방법 (사용자용) — 작업 팩 F2 (ACT III 2부 · v0.9.1의 가안 그림 전부, 58장)

v0.9.1에서 아직 게임이 그린 가안으로 나오는 그림을 모두 모았습니다. **네 부분(A–D)으로 나뉘어 있어서 GPT 사용량에 맞춰 한 부분씩 시켜도 됩니다.** GPT용 영문 지시는 `00_START_HERE.md`에 있습니다.

| 부분 | 내용 | 장수 |
|---|---|---:|
| **A** | 장소와 물건 — 수호자 성채, 숲지기 마을과 방 6, 숲 상자, 아이콘 시트 I, 전투 소품 | 11 |
| **B** | 엘리나·에릭·세인의 각성 모습 | 15 |
| **C** | 테아·다리오·이네스의 전직 모습 | 15 |
| **D** | 성채와 숲의 사람들, M16 기사대장, 맵 그림 5 | 17 |

권장 순서: **A → B → D → C** (눈에 많이 띄는 순서).

## 한 부분씩 시키기 (권장)
ChatGPT 작업 모드에 이 ZIP을 **통째로** 올리고 붙여 넣으세요. `A` 자리에 원하는 부분을 넣습니다.
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly. Do part A only: produce its images in the listed order using the prompts in prompts/ and the reference images in references/, run the self-check, and return Ashen_Crown_v091_ACT3_Art_Pack_F2_A.zip as described in section 8 (split it if it would exceed 20 MB). Reopen and test every zip before handing it over and tell me each zip's size in bytes.
```

## 전부 한 번에
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly: produce all parts in the order A, B, D, C, run the self-check, and return one zip per part as described in section 8. Reopen and test every zip before handing it over and tell me each zip's size in bytes.
```

## 받은 뒤
- ZIP을 Claude에게 주세요. 한 개씩 와도 됩니다. 받으면 SHA256을 검증하고 해당 가안 그림을 교체합니다.
- **GPT가 알려준 ZIP 크기와 받은 파일 크기가 같은지 봐 주세요.** F1_1은 처음에 내려받기가 끊긴 파일(6.59 MB)이었습니다.

## A. 장소와 물건 (모두 PROPOSED)
- **숲지기 마을** — 거대한 고목 숲 속 이끼 지붕 마을. 지금 쓰는 잿빛 마을 배치 위에 다른 마을로 그림(길과 문 그대로). 방 여섯: 길잡이 장옥, 활장이 공방(무기점), 약초상(도구점), 장로의 오두막, 숲지기 집, 씨앗 창고. 상자 4종.
- **수호자 성채** — 북쪽 고원의 오래된 화강암 성채, 일부 무너짐, 안뜰의 석상들. 지금 쓰는 탈환한 성채 배치 위에 그림. (성채 방은 탈환한 성채의 그려진 방을 계속 씀)
- **아이콘 시트 I (6개)**: 맹세의 성벽 · 퇴로 봉쇄 · 새벽의 기도(④) · 맹세의 휘장 · 고목의 잎(보물) · 기본 회복약(소지품 머리줄에 나오는 물약 — 지금 가안)
- **전투 소품 시트**: 결계 고목(서 있음 / 상처 / 쓰러짐), 잠든 수호 석상.

## B. 각성 모습 — 반신 4표정 + 맵 그림
| id | 모습 요점 |
|---|---|
| `eric_t3` 맹세의 수호자 | 낡아 빛바랜 강철과 옅은 금 테, 마지막 수호자가 준 돌빛 망토, 방패 테두리의 옅은 푸른 금빛 |
| `elina_t3` 매의 사수 | 매 깃털 어깨 망토, 매사냥 장갑, 땋은 머리의 긴 매 깃털, 옅은 물푸레 장궁 |
| `sain_t3` 새벽 사제 | 새벽빛 흰색·옅은 장밋빛 금, 옅은 금 반망토, 새벽빛 등불, 해돋이처럼 빛나는 금 고리 지팡이 |

## C. 영입 장수 전직 모습 — 반신 4표정 + 맵 그림
| id | 모습 요점 |
|---|---|
| `thea_t2` 흑철 창기사 | 검게 그을린 철판 갑옷에 강청색 테, 회색 늑대 털 깃, 검은 깃발 창, 흑철 마갑의 회색 말 |
| `dario_t2` 검성 | 바다빛·포도주빛 긴 외투와 사슬 셔츠, 단정히 묶은 머리, 여유 있는 미소, 맑은 강철 장검 |
| `ines_t2` 성소 수호자 | 흰색·금색 무거운 휘장 겉옷, 긴 진홍 망토, 넓은 금 테 흰 원방패(옅은 금빛) |

## D. 사람과 맵 그림
- 반신: **마지막 수호자**(70대 후반, 대머리, 긴 흰 수염, 옛 강철 갑옷 · 표정 3개), **숲지기 장로**(60대 여성, 초록 리본을 감은 흰 머리, 너무 평온한 미소 · 표정 3개), **M16 결투의 기사대장** 3명(철왕관·연맹·성화 — 배신한 깃발에 따라 달라짐 · 결의/슬픔)
- 맵 그림: 마지막 수호자, 숲지기 장로, 깨어난 수호 석상, 숲지기 주민, 재상부 회색 대장

## 이번에 코드로 고친 것 (그림 필요 없음)
- 빈 상자를 열면 나오던 가안 물약 그림 → 그 방의 **그려진 상자가 열린 모습**으로 바뀌었습니다.
- 전투 중 「연대기」 내레이션에 나오던 가안 얼굴 → 초상 없이 글만 나옵니다.
