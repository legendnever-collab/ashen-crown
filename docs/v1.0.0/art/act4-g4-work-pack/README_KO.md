# 사용 방법 (사용자용) — 작업 팩 G4 (ACT IV 4부 · v1.0.0 「왕관 없는 새벽」, 5장 · 마지막 팩)

ACT IV 설계 Q8(최소 범위)과 §10에 따라 **엔딩 일러스트 3장 + 에필로그 배경 1장 + 아이콘 시트 1장**입니다. GPT용 영문 지시는 `00_START_HERE.md`에 있습니다.

| 부분 | 내용 | 장수 |
|---|---|---:|
| **A** | 장면 — 엔딩 A·B·C 일러스트, 에필로그 배경 (1600×900) | 4 |
| **B** | 물건 — 아이콘 시트 O (보물 둘) | 1 |

## 시키는 법 (부분마다 한 번씩)
ChatGPT 작업 모드에 이 ZIP을 **통째로** 올리고, 부분마다 붙여 넣으세요. `<A|B>`만 바꿉니다.
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly. Do part <A|B> only: produce its images in the listed order using the prompts in prompts/ and the reference images in references/, run the self-check, and return Ashen_Crown_v100_ACT4_Art_Pack_G4_<A|B>.zip as described in section 7. Reopen and test the zip before handing it over and tell me its size in bytes.
```

## 받은 뒤
- ZIP을 Claude에게 주세요. 받으면 SHA256을 검증하고 가안 그림을 교체합니다(장면: import-ending-art.py, 아이콘: import-item-art.py --cells).

## 장면 (모두 PROPOSED)
| 파일 | 무엇 | 쓰이는 곳 |
|---|---|---|
| `ending_a` | A 하나의 왕국 — 아무도 쓰지 않은 왕관과 헌장, 스스로 맹세하는 수호자단, 옥좌의 긴 그림자(값) | 에필로그 머리 |
| `ending_b` | B 자유로운 대륙 — 마을마다 빛나는 결계석, 지도 위의 협의, 희미한 결계석 하나(값) | 에필로그 머리 |
| `ending_c` | C 새로운 서약 — 광장에서 저마다 작은 빛을 내놓는 사람들, 깜박이는 등불 몇 개(값) | 에필로그 머리 |
| `epilogue` | 새벽의 왕도와 지평선의 옅은 금빛 결계, 사람 없는 길 | 엔딩 카드 머리 |

세 엔딩은 같은 무게로 그립니다(어느 것도 정답처럼 보이지 않게). 결계 너머는 그리지 않습니다(OPEN).

## 아이콘 시트 O (모두 PROPOSED)
벨라드의 깃펜(M29 숨은 전과) · 새벽의 반지(M30 숨은 전과)

## 새로 그리지 않는 것 (Q8 최소 · D-094)
- 벨라드 2단계: 지금 벨라드 그림 + 게임이 그리는 금빛 왕관의 기운
- 의식 지점: 칠한 의식진을 금빛으로, 결계의 심장: 칠한 의식 고정석
- 재의 짐승, 세 깃발의 부대: 기존 그림
