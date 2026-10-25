# 사용 방법 (사용자용) — ACT II 인물 25장

ChatGPT 작업 모드(Sol 6.1)에 이 ZIP을 **통째로** 올리고 아래 메시지를 붙여 넣으세요. GPT용 영문 지시는 `00_START_HERE.md`에 있습니다.

## A. 한 번에 (권장)
```
Attached is a work pack. Read 00_START_HERE.md first and follow it exactly: produce all 25 images in the listed order using the prompts in prompts/ and the reference images in references/, run the self-check, and return the three zips Ashen_Crown_v060_Character_Art_Pack_B1/_B2/_B3 (each under 20 MB) exactly as described in section 5.
```

## B. 지도자 2명을 먼저 보고 결정하기
```
Attached is a work pack. Read 00_START_HERE.md first. Do only the two neutral busts of cassian and leonora now, show them to me, and wait for my approval before doing the rest.
```
마음에 들면 `Approved. Continue with all remaining jobs and return the zips described in section 5.`를 보냅니다.

## 받은 뒤
- ZIP 세 개(_B1, _B2, _B3)를 Claude에게 주세요. 한 개씩 와도 됩니다.
- Claude가 SHA256을 검증하고, 지난번과 같은 방식(`scripts/import-art.py`)으로 WebP로 바꿔 넣습니다.

## 인물 (모두 PROPOSED — 생김새, 이름 모두 바꿀 수 있습니다)
| id | 인물 | 생김새 요점 |
|---|---|---|
| `cassian` | 카시안 아케인, 철왕관 통령 | 40대 초반, 관자놀이가 센 짙은 머리, 회색 눈, 강철 청색 장교 외투와 회색 털 망토, 문장 없는 쇠 목깃 |
| `leonora` | 레오노라 아케인, 자유 영주 연맹 의장 | 30대 후반, 은핀을 꽂은 잿빛 금발 땋은 머리, 녹색·크림색 승마 외투, 여러 영주 색 리본 띠, 레이피어 |
| `thea` | 테아 코르빈, 철왕관 기병 창기사 | 20대 중반, 구릿빛 갈색 포니테일, 강철 청색 미늘 갑옷과 털 깃, 창. 맵에서는 회색 말을 탐 |
| `dario` | 다리오 벤, 벨마르 용병 검사 | 20대 후반, 올리브빛 피부, 묶은 검은 곱슬머리, 금 귀걸이, 와인색 더블릿과 가죽 브리건딘, 바다빛 띠, 외날 장검 |

맵 시트만 그리는 병종 7종:
- 통령국 보병(동맹)
- 통령국 탈영병
- 강경파 용병 창병
- 자객
- 영주군 A(청백)
- 영주군 B(주황·갈색)
- 벨마르 의회 대표(민간인)
