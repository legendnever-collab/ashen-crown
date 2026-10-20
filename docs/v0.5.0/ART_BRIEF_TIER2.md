# Ashen Crown — 전직(Tier 2) 외형 ChatGPT 지시서 (v0.5.0, 2026-10-19)

v0.4.0에서 쓴 [ART_BRIEF_CHATGPT](../v0.4.0/ART_BRIEF_CHATGPT.md)와 같은 화풍·규격·작업 순서를 따릅니다. 이번에는 **전직한 다섯 장수의 새 외형**만 그립니다.

| 항목 | 수량 |
|---|---|
| 반신 | 5명 × 표정 4 = **20장** |
| 맵 스프라이트 시트 | **5장** |
| 합계 | **25장** |

## 0. 원칙 (v0.4.0과 동일)
- **화풍은 참고, 내용은 독자.** 원작 게임 이름, 캐릭터 이름, 문양은 쓰지 않습니다.
- **같은 사람이 승진한 모습입니다.** 얼굴, 머리색, 눈색, 흉터 같은 신원 특징은 그대로 두고 **의상·장비·색 강조만** 바꿉니다.
  - 각 장수의 기존 neutral 반신(`bust_<id>_neutral.png`, v0.4.0 팩)을 반드시 **함께 첨부**하세요.
- 세인의 성별처럼 OPEN인 항목은 이번에도 단정하지 않습니다.
- 아래 의상 묘사는 **PROPOSED**(게임 그림용 제안)입니다. 마음에 들지 않으면 바꿔도 됩니다.

## 1. 작업 순서
1. 장수 한 명마다 **새 대화창**을 엽니다. 기존 neutral 반신과 Aren 시험 이미지(화풍 기준)를 첨부합니다.
2. **프롬프트 T1**로 전직 neutral 반신을 만들고, 마음에 들 때까지 반복합니다.
3. v0.4.0 지시서의 **프롬프트 C**로 concerned / determined / sad 표정을 만듭니다. 이때 전직 neutral을 첨부합니다.
4. v0.4.0 지시서의 **프롬프트 D**로 스프라이트 시트를 만듭니다. 전직 neutral과 아래 표의 무기 문장을 넣습니다.
5. 25장을 모아 ZIP으로 Claude에게 주세요. 파일 이름 규칙은 §3을 따릅니다. `manifest.csv`는 선택이고, 없으면 Claude가 만듭니다.

## 2. 프롬프트 T1 — 전직 반신 (기존 neutral 첨부)
```
The first attached image is the exact model sheet of this character (face, hair, eye color, scars, body). The second attached image is the approved painting-style reference.
Paint the SAME person after a promotion in rank, in the same painting style, same three-quarter bust framing turned slightly to the viewer's RIGHT, eyes looking right.
Keep the face, hair, eye color, skin tone and identifying marks identical. Change only the outfit and equipment to:
<PROMOTED OUTFIT>
Expression: neutral, composed, a little more confident than before.
Output: PNG 1024×1280, transparent background, no text, no frame, no UI, same framing and scale as the attached model sheet.
```

## 3. 전직 외형 목록 (`<PROMOTED OUTFIT>`에 그대로 붙여 넣기)

| id (파일명) | 전직 (게임 내 이름, PROPOSED) | `<PROMOTED OUTFIT>` (영문) | 스프라이트 무기 문장 |
|---|---|---|---|
| `eric_t2` | Guardian Knight · 수호기사 | heavier polished teal plate armor with layered gold-edged pauldrons, a short ash-grey surcoat over the breastplate with a simple ember emblem, a dark purple cape fastened by gold clasps, a closed gauntlet resting on the rim of a tall tower shield | longsword and a tall teal tower shield with a gold rim; open-face knight helmet with a short ash-grey plume |
| `elina_t2` | Ranger · 레인저 | a long dark-green ranger cloak with the hood down, layered leather armor with shoulder guard on the bow arm, laced bracers, a small hawk-feather token tied into the braid, two quivers on the back | tall recurved longbow, red-fletched arrows |
| `lia_t2` | Arcanist · 비전술사 | deep indigo robe with silver rune embroidery along the hems, the same wide-brimmed hat now darker indigo with a larger glowing pale-blue crystal, a silver rune circlet of light faintly floating beside her raised hand | staff crowned by a larger pale-blue crystal held in a silver ring |
| `sain_t2` | Ember Cleric · 성화 사제 | cream robe with an ember-orange inner lining, hood DOWN showing short cream-white hair, a gold sun-and-ember sigil on the chest, a small gold censer-lantern hanging from the belt, gender intentionally ambiguous | golden staff with a sun-disc head and a small glowing ember at its center |
| `kai_t2` | Shadowblade · 그림자 추적자 | fitted charcoal coat with dark-teal accents and many small straps, the large orange scarf now pulled up over the lower face as a half mask (eyes and scar visible), fingerless gloves, a short shoulder cape | twin long curved daggers held in reverse grip |

## 4. 납품 규격

| 종류 | 파일명 | ChatGPT 출력 | 게임 반영 |
|---|---|---|---|
| 반신 | `bust_<id>_<neutral\|concerned\|determined\|sad>.png` (예: `bust_kai_t2_sad.png`) | 1024×1280, 투명 배경 | 720×880 WebP로 변환. 표정이 빠지면 neutral로 대체 |
| 스프라이트 | `sprite_<id>.png` (예: `sprite_lia_t2.png`) | 1024×768, 4열×3행, 칸 256×256, 발 기준선은 칸 아래에서 16px | 512×384 WebP로 변환 (칸마다 반으로 축소, 기준점 64,120) |

- 배경이 투명하게 나오지 않으면 크로마 그린 `#00FF00` 단색 배경으로 요청하세요. 배경 제거는 Claude가 합니다.
- 아트가 도착하기 전까지 전직 장수는 기존 그림을 색·소품만 바꿔 임시로 씁니다. 게임과 문서에서는 이 그림을 '완성'이라고 표시하지 않습니다.
- 용량 목표(WebP): 반신 약 80KB, 시트 약 60KB. 25장을 모두 넣으면 HTML이 약 2MB 늘어납니다.
