# Character Design — r2

서로 다른 인물은 얼굴 골격 + hair silhouette/color + 체격 + costume silhouette로 구분합니다. 표정 변화는 같은 얼굴과 의상을 유지합니다.

| ID | 얼굴/체격 기준 | Hair / eyes | Costume silhouette |
|---|---|---|---|
| aren | 정돈된 길고 각진 얼굴, 절제된 지휘관 체형 | black swept-back / warm brown | ash-grey officer coat, red scarf, gold epaulettes, grey cloak |
| eric | 넓은 턱, 굵은 목, 건장한 어깨, 젊은 보호형 기사 | light chestnut short crew cut / blue | 넓은 plate armor, blue tabard, plain shield emblem |
| eric_adv | eric과 같은 얼굴·체격 | eric과 동일 | polished teal armor, rich gold trim, deep purple cape |
| elina | 좁은 heart-shaped 얼굴, 날렵한 scout 체형, freckles | auburn-red braid / green | green hood down, leather jerkin, quiver strap |
| lia | 부드럽고 둥근 얼굴, 성인 mage | long dark plum-purple / amber | wide-brimmed witch hat, violet robe, pale-blue crystals |
| sain | 길고 부드러운 oval face, 가는 체형, androgynous | cream-white short curls / warm brown | cream hood up, gold sun sigil |
| kai | 마른 angular face, 뾰족한 턱, wiry build, nose scar | asymmetric dark teal-black spikes / green | large orange scarf, dark leather, crossed dagger straps |

## Expression 기준

- neutral: 평상시. Aren은 침착, Erik은 보호적, Elina는 관찰, Lia는 호기심, Sain은 온화, Kai는 작은 half-smile.
- concerned: 안쪽 눈썹이 올라가고 모이며, 입가에 긴장과 걱정이 나타납니다.
- determined: 눈썹과 눈매를 단단히 잡고 입을 굳게 다뭅니다.
- sad: 시선을 낮추고 안쪽 눈썹과 입꼬리로 절제된 슬픔을 표현합니다.

## 적용 시 유지할 것

- Canonical visual reference는 각 ID의 neutral PNG입니다. 이후 sprite 제작도 해당 파일을 costume/color reference로 사용합니다.
- eric/eric_adv의 identity가 같아야 합니다. eric_adv를 별도 영웅으로 취급하지 않습니다.
- 얼굴을 좌우로 늘이거나 임의로 mirror하지 않습니다. 흉터·땋은 머리·망토 방향은 제공된 neutral 기준으로 고정합니다.
- Lia는 큰 모자가 있어 다른 인물과 얼굴 높이가 완전히 같지 않습니다. 얼굴 크기를 억지로 맞추다 모자를 자르지 않습니다.
- 손그림 기반 생성 이미지이므로 표정 간 작은 붓터치·일부 음영의 차이는 남아 있습니다. Pixel-perfect facial replacement나 animation registration용 sprite가 아닙니다.
