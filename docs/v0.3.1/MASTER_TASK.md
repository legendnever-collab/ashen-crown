# Ashen Crown v0.3.1
## GitHub-Native Development Master Task
### Classic SRPG Renaissance — Visual Fidelity, Tactical UX & Living Towns

**Repository:** https://github.com/legendnever-collab/ashen-crown

**Target Version:** `v0.3.1`

**Proposed Branch:** `feature/v0.3.1-classic-srpg-renaissance`

**Development Method:** Incremental Upgrade / Documentation-first / Game-first

**Reference:** 사용자가 제공한 삼국지 조조전 스크린샷 6장 및 14개 UX·그래픽·게임플레이 피드백.

**Release Policy:** 실제 구현, 자동 테스트, 사용자 실행 HTML, Source ZIP, Test Report, GitHub PR까지 완료한다. 사용자 승인 전 main에 병합하지 않는다.

---

# 0. 역할과 개발 목적

당신은 다음 역할을 동시에 수행한다.

- Game Director
- Classic Tactical SRPG Designer
- Narrative Director
- Pixel Art Director
- Visual Rendering Engineer
- Map & Level Designer
- UI/UX Designer
- Equipment & Economy Designer
- Tactical Combat Systems Designer
- Software Architect
- QA Lead
- GitHub Release Engineer
- Project Documentation Maintainer

## 핵심 개발 목표

Ashen Crown v0.3까지는 SRPG의 주요 기능이 구현되었다.

하지만 다음 문제가 존재한다.

1. 마을과 상점이 실제 공간처럼 느껴지지 않는다.
2. 캐릭터와 건물의 그래픽 표현력이 부족하다.
3. 마을과 전투맵이 작고 규격화되어 있다.
4. 전투 조작이 고전 SRPG의 직관적인 조작 방식과 다르다.
5. 대화와 스토리 연출이 부자연스럽다.
6. 장수별 이동 및 지형 특성이 충분히 드러나지 않는다.
7. 시각적으로 전투와 스토리 사건이 일치하지 않는 경우가 있다.

이번 릴리스는 위 문제를 해결한다.

**최종 목표: 플레이어가 조작법을 고민하지 않고 장수의 이동, 전투, 성장과 이야기에 집중할 수 있는 Classic SRPG 경험을 완성한다.**

단, 조조전의 에셋, 대사, UI 그래픽을 복제하지 않는다.

참고할 것은 게임플레이 문법과 사용성이다.

실제 그래픽과 세계관은 Ashen Crown 고유의 스타일을 유지한다.

---

# 1. Authoritative Baseline

개발 시작 전 실제 GitHub Repository를 확인한다.

이전 확인 기준:

- v0.3.0 Branch: `feature/v0.3-living-frontier`
- v0.3.0 PR: https://github.com/legendnever-collab/ashen-crown/pull/6
- v0.3.0 Release Candidate 존재
- Mission 01–03 구현
- Town / Camp
- Shops / Equipment
- Recruitment Foundation
- Original BGM
- Save Schema 3

위 기록은 현재 상태를 보증하지 않는다.

반드시 다음을 확인한다.

- main 최신 Commit
- v0.3 PR 병합 여부
- Open PR
- 현재 CI
- Source Structure
- Rendering Architecture
- Town / Camp Implementation
- Equipment Transaction State
- Combat Movement Rules
- Save Schema

v0.3이 이미 병합되었으면 최신 main에서 개발한다.

v0.3이 병합되지 않았다면 사용자 승인 없이 main에 병합하지 않는다.

필요하면 v0.3 Head를 기준으로 Stacked Branch를 만들고 기존 PR 의존성을 명확히 기록한다.

기존 개발을 새로 만들지 않는다.

전투, 성장, 저장, 상점, 스토리 시스템을 보존하면서 Incremental Upgrade한다.

---

# 2. 개발 우선순위

## P0 — Interaction Stability

- 마을 대화 순간이동 버그 수정
- 캐릭터 선택 시 이동범위 즉시 표시
- 캐릭터 옆 행동 메뉴
- 불필요한 전투 준비 체크박스 제거
- 접이식 Quest / Objective Panel
- 상점 구매 후 위치 및 화면 유지

## P1 — Living Town & Shop Redesign

- 상점 내부 공간
- 상점 주인 NPC
- 건물별 외형 차별화
- 무기 구매와 장수 선택 UI
- 실시간 능력치 비교
- 장소별 가변 크기 맵

## P2 — Visual Renaissance

- 렌더링 해상도 대폭 개선
- 캐릭터와 지형 아트 개선
- 전투맵 재설계
- 화재 및 파괴 연출
- 대화 UI 개선

## P3 — Tactical Identity

- 병종별 이동력 차등
- 지형 이동 비용 개편
- 전직 후 이동력 확장 구조
- 모든 주요 대사 자연스러운 문체로 수정

P0부터 순차적으로 구현한다.

다만 릴리스 산출물은 사용자가 전체 변경을 함께 검토할 수 있도록 하나의 v0.3.1 Release Candidate로 제공한다.

---

# 3. Rendering & Resolution Overhaul

## 3.1 사용자 요구사항

현재 게임보다 최소 4배 높은 시각적 해상도를 목표로 한다.

단순히 기존 이미지를 4배 확대하는 방식은 금지한다.

## 3.2 해상도 정의

현재 Canvas의 실제 렌더링 크기, CSS 크기, Tile Native Resolution, Sprite Native Resolution을 먼저 측정한다.

데스크톱 기본 화면에서 Render Backing Buffer의 총 픽셀 수를 기존 기준 대비 최소 4배로 확대하는 것을 목표로 한다.

예:

기존 800×450이라면 1600×900 이상.

이것은 예시이며 실제 기존 해상도를 확인한 후 기준을 설정한다.

CSS 화면 크기만 확대하거나 Device Pixel Ratio를 높이는 것으로 완료 처리하지 않는다.

확대된 해상도에서 실질적인 표현 디테일과 가독성이 개선되어야 한다.

## 3.3 Pixel Art 방향

Classic 16-bit Pixel Art를 유지한다.

목표:

- 선명한 캐릭터 실루엣
- 인물별 얼굴과 의상 특징
- 장비와 무기 구분
- 자연스러운 지형 경계
- 건물별 구조적 차이
- 그림자와 높낮이
- 애니메이션 프레임 강화

고해상도라는 이유로 부드럽고 흐릿한 일러스트 스타일로 변경하지 않는다.

Pixel-perfect Scaling을 유지한다.

## 3.4 Camera System

맵 크기에 관계없이 카메라가 자연스럽게 작동해야 한다.

필수 기능:

- Camera Follow
- Smooth Pan
- Zoom
- Map Boundaries
- Focus on Character
- Return to Selected Unit
- Minimap View
- Responsive Viewport

맵이 커져도 UI가 타일이나 캐릭터를 과도하게 가리지 않도록 한다.

## 3.5 성능

Desktop과 Mobile에서 Render Scaling을 구분한다.

고해상도 그래픽으로 인해 프레임이 떨어지면 Adaptive Resolution을 적용할 수 있다.

단, 저사양 모드에서도 게임 규칙, 캐릭터 식별성, 버튼 조작을 유지해야 한다.

---

# 4. Variable Map Architecture

## 4.1 기존 문제

마을과 전투맵이 모두 작은 정사각형 구조처럼 보인다.

이는 세계관의 현실감과 전술적 다양성을 떨어뜨린다.

## 4.2 개선 방향

고정 Map Size 의존성을 제거한다.

Map Data는 Width와 Height를 독립적으로 정의한다.

예시:

| Map | Example Size |
|---|---|
| Small Village | 16×16 |
| Border Camp | 20×28 |
| Forest Pursuit | 18×32 |
| Bridge Battle | 20×36 |
| Fortress Exterior | 28×40 |

위 크기는 설계 예시다.

실제 미션은 목적과 전투 밸런스에 맞춰 정한다.

## 4.3 필수 구조

- Variable Width / Height
- Separate Collision Map
- Terrain Layer
- Building Layer
- Object Layer
- Actor Layer
- Effect Layer
- Event Layer
- Camera Boundaries

충돌 판정, 이동 가능 영역, 적 AI, 미니맵, 경로 탐색이 가변 크기 맵에서 모두 작동해야 한다.

## 4.4 맵 설계 원칙

맵은 단순한 평면이 아니라 스토리를 전달하는 공간이다.

마을:

거리, 광장, 건물, 작은 골목, 출입구.

숲길:

우회로, 수풀, 좁은 길, 높은 지형.

다리:

병목, 접근로, 구조 지점, 위험 지역.

맵 크기를 늘리기 위해 의미 없는 빈 공간을 추가하지 않는다.

---

# 5. Town Building & Interior System

## 5.1 건물 외형 차별화

각 건물은 용도를 시각적으로 알 수 있어야 한다.

### Blacksmith

- 무기 간판
- 용광로 또는 굴뚝
- 금속 장식
- 무기 전시
- 공구와 상자

### Item Shop

- 약병 간판
- 나무 선반
- 약초와 상자
- 상인용 장식

### Inn / Barracks

- 다른 지붕 구조
- 넓은 출입구
- 침구 / 휴식 공간
- 병사 또는 여행자

### War Council

- 군단 깃발
- 문장
- 지도
- 작전 테이블

### Residence

- 크기와 형태가 다른 민가
- 각기 다른 창문과 지붕
- 생활 소품

건물 스프라이트를 모두 같은 형태에 간판만 바꾼 수준으로 만들지 않는다.

## 5.2 Building Interior

무기점과 도구점은 별도의 내부 맵을 제공한다.

예:

Town Exterior → Blacksmith Door → Blacksmith Interior

내부에는 다음이 있어야 한다.

- 상점 주인
- 카운터
- 상품 또는 전시용 소품
- 출구
- NPC Interaction

플레이어는 아렌을 움직여 상점 주인에게 접근한다.

## 5.3 Shop Lifecycle

상점 이용 흐름:

1. 건물 입구 접근
2. 상점 내부로 전환
3. 아렌이 상점 주인에게 접근
4. NPC 대화
5. 구매 / 판매 / 강화
6. 상점 UI 종료
7. 내부 공간에 남음
8. 출구로 이동
9. 원래 마을의 건물 앞 복귀

구매 후 상점 밖으로 자동 이동시키지 않는다.

장비를 여러 개 연속 구매할 수 있어야 한다.

## 5.4 Position Persistence

상점 입장 직전 Town Position을 보존한다.

Shop Exit 이후 동일한 건물 입구 근처로 복귀한다.

NPC 대화, 장비 구매, 저장 및 복원 과정에서 플레이어 좌표가 잘못 변경되지 않아야 한다.

---

# 6. Shop Equipment Selection UX

사용자가 제시한 핵심 흐름을 구현한다.

## 6.1 Weapon-first Interaction

현재처럼 캐릭터를 먼저 선택하고 무기를 선택하는 방식에서 벗어난다.

새로운 기본 흐름:

**무기 선택 → 장수 선택 → 능력치 비교 → 구매 확정**

## 6.2 Equipment Purchase UI

무기점에서 상품을 선택하면 장수 선택 Modal을 표시한다.

왼쪽:

- 구매할 장비
- 장비 설명
- 가격
- 능력치
- 사용 가능한 병종

중앙:

- 장수 목록
- Portrait
- Name
- Class
- 장착 가능 여부

오른쪽:

- 선택한 장수 Portrait
- Current Equipment
- Current Effective Stats
- New Equipment Stats
- Stat Delta
- Final Purchase Price

## 6.3 Stat Comparison

능력치 비교는 실제 Combat Calculation을 사용한다.

예:

Current Attack: 18

New Attack: 22

Delta: +4

변화가 없는 경우 0을 표시한다.

하락하는 능력치는 음수로 표시한다.

장비의 모든 효과가 단순 공격력으로 표현될 수는 없다.

이동력, 방어력, 회피, 스킬 조건, 사거리 등에 영향을 줄 경우 해당 변화도 표시한다.

## 6.4 Character Eligibility

장착 가능한 캐릭터는 활성화한다.

장착할 수 없는 캐릭터는 비활성화하거나 사용 불가 이유를 표시한다.

예:

"이 장비는 Knight 전용입니다."

구매 후 장비가 해당 장수의 Inventory 또는 Equipment Slot에 정확히 반영되어야 한다.

## 6.5 Transaction Safety

실제 구매 확정 이전에는 Gold를 차감하지 않는다.

취소하면 모든 변경을 취소한다.

중복 클릭이나 UI 재진입으로 장비가 복제되지 않아야 한다.

구매 이후 상점 내부 화면을 유지한다.

기존 v0.3의 Atomic Transaction 시스템을 보존한다.

---

# 7. Quest / Objective Panel

마을과 전투에서 공통으로 사용할 수 있는 Objective UI를 구현한다.

## 7.1 위치

기본 위치는 화면 오른쪽 상단이다.

## 7.2 동작

- Expand
- Collapse
- Persist User Preference
- Contextual Objective
- Optional Objective
- Progress Display

## 7.3 Town Example

Main Quest:

무기점에서 출전 준비하기.

Optional:

- 에릭과 대화
- 마을 사람들의 소문 듣기
- 도구점 방문

## 7.4 Battle Example

Mission 01:

- Garr 격파
- 민간인 2명 구조

Mission 02:

- 적장 생포 또는 다른 허용된 전투 결말

Mission 03:

- 민간인 구조
- 제한 턴 안에 아군 철수

선택 목표와 필수 목표를 명확히 구분한다.

패널을 접어도 전투 진행과 입력에는 영향을 주지 않는다.

좁은 모바일 화면에서는 Compact Mode를 제공한다.

---

# 8. Dialogue System Overhaul

## 8.1 순간이동 버그 수정

현재 Town NPC Dialogue에서 캐릭터가 갑자기 다른 곳으로 이동하는 현상을 재현한다.

원인을 조사한다.

가능한 원인:

- Dialogue Scene Actor 재배치
- Camera State 변경
- NPC Interaction에서 Story Staging 좌표 적용
- Exploration / Narrative State 충돌

실제 원인을 코드로 확인한 뒤 수정한다.

## 8.2 In-place Dialogue

Town에서 대화를 시작하면:

- 아렌의 위치를 유지
- NPC 위치 유지
- 카메라 위치 유지
- 현재 맵을 배경으로 유지
- 대화창만 표시

캐릭터의 위치를 변경하는 연출은 명시적으로 작성된 Cutscene에서만 허용한다.

## 8.3 Dialogue UI

사용자 제공 스크린샷을 참고해 다음 요소를 지원한다.

- Character Portrait
- Character Name
- Dialogue Box
- Speaker Indicator
- Text Advance
- Expression Change
- Dialogue History

대화창은 화면 하단 또는 상황에 적절한 위치에 표시한다.

대화창이 주요 인물이나 중요한 사물을 가릴 경우 배치를 조정한다.

말풍선 위치를 사용하는 경우 현재 말하는 인물을 명확히 가리켜야 한다.

## 8.4 Natural Dialogue Rewrite

주요 등장인물의 대사를 다시 검토한다.

AI가 생성한 설명문처럼 느껴지는 문장을 수정한다.

목표:

- 짧지만 인물다운 말투
- 상황에 따른 감정
- 불필요한 세계관 설명 최소화
- 관계에 따른 말투 차이
- 자연스러운 농담과 침묵
- 갈등과 여운

인물별 말투 기준:

Aren:

짧고 신중하며 책임감 있는 지휘관의 말투.

Erik:

직설적이고 무뚝뚝하지만 동료에게는 따뜻한 말투.

Elina:

경계심이 강하고 비판적이며 감정이 드러나는 말투.

Lia:

지적이고 호기심이 강하지만 때로는 냉소적인 말투.

Sain:

온화하지만 도덕적 판단에서는 단호한 말투.

Kai:

가벼운 농담으로 본심을 감추는 말투.

설정 설명을 위해 등장인물을 부자연스럽게 장황하게 말하게 만들지 않는다.

기존 Story Canon은 유지한다.

---

# 9. Classic SRPG Tactical UI

## 9.1 Immediate Movement Preview

현재:

유닛 선택 → Move 메뉴 → 이동범위 표시.

변경:

**유닛 선택 → 이동범위 즉시 표시.**

캐릭터를 클릭하면 바로 다음을 보여준다.

- Selected Unit Highlight
- Reachable Tiles
- HP / MP
- Character Info
- Available Actions

이동 가능 범위는 실제 지형 이동 비용과 충돌을 반영한다.

직선거리만으로 표시하지 않는다.

## 9.2 Contextual Action Menu

선택한 캐릭터 근처에 행동 메뉴가 표시되어야 한다.

메뉴:

- 이동
- 공격
- 전략 / 스킬
- 도구
- 대기
- 취소

공격 또는 이동이 불가능한 경우 비활성화하거나 이유를 설명한다.

화면 경계에 가까우면 메뉴를 반대편에 배치한다.

메뉴가 적 유닛이나 이동 목적지에 대한 클릭을 가로막지 않도록 한다.

## 9.3 Menu Display Behavior

처음 클릭했을 때 이동범위와 행동 메뉴를 동시에 표시할 수 있다.

다만 사용자가 이동 가능한 타일을 클릭했을 때 자연스럽게 이동 목표를 지정할 수 있어야 한다.

전투 행동은 다음 흐름을 유지한다.

Select → Preview → Choose → Confirm → Animate → Resolve

기존 이동 확정 / 취소 및 Undo 규칙을 보존한다.

## 9.4 Command Dock

하단 Dock은 다음 용도로 유지할 수 있다.

- 캐릭터 정보
- 현재 행동 상태
- 공격 예측
- HP / MP
- 상태이상
- 턴 종료

행동 선택의 주 인터페이스는 캐릭터 근처 Context Menu로 한다.

하단 Dock과 Popup Menu가 서로 충돌하거나 동일한 명령을 중복 실행하지 않아야 한다.

---

# 10. Terrain & Movement Class System

## 10.1 초기 병종별 이동력

다음 값을 v0.3.1 설계 목표로 사용한다.

| Class | Base MOV |
|---|---:|
| Tank / Knight | 2 |
| Archer | 3 |
| Mage | 3 |
| Healer / Priest | 3 |
| Rogue | 4 |
| Future Cavalry | 5 |

실제 맵 크기와 전투 밸런스에 따라 조정할 수 있지만, 최종 변경 사항은 기록해야 한다.

## 10.2 Terrain Movement Cost

지형별 이동 비용을 정의한다.

예시:

| Terrain | Infantry | Rogue | Cavalry |
|---|---:|---:|---:|
| Road | 1 | 1 | 1 |
| Grassland | 1 | 1 | 1 |
| Forest | 2 | 1 | 2 |
| Mountain Path | 3 | 1 | 제한 |
| Desert | 2 | 1 | 2 |
| Swamp | 3 | 2 | 제한 |

이는 초기 제안값이다.

실제 전투 밸런스 테스트로 검증한다.

Rogue가 모든 지형을 무조건 통과하는 것은 아니다.

절벽, 벽, 깊은 물, 통행 불가능한 구조물 등의 제약은 유지한다.

## 10.3 Movement Calculation

이동 경로는 Tile별 비용을 누적한다.

다음 조건을 처리해야 한다.

- Terrain Cost
- Unit Collision
- Impassable Tiles
- Allied Units
- Enemy Occupancy
- Movement Modifiers
- Equipment Bonus
- Class Bonus
- Upgrade Effect

이동 표시와 실제 이동 결과가 항상 일치해야 한다.

## 10.4 Mounted Advancement

후속 전직 시스템을 위한 구조를 만든다.

예:

Tank → Mounted Knight

MOV: 2 → 5

단, 실제 기병 전직과 전직 조건은 후속 릴리스 범위다.

v0.3.1에서는 Class Movement Modifier 및 확장 가능한 데이터 구조를 구현한다.

미구현 전직이 실제로 사용 가능한 것처럼 표시하지 않는다.

## 10.5 Balance Regression

이동력 변경은 기존 Mission을 크게 바꿀 수 있다.

Mission 01–03을 모두 다시 검증한다.

필수:

- Civilian Rescue Feasibility
- Garr Defeat
- Forest Capture
- Bridge Withdrawal
- 10-turn Mission 03 Deadline
- Enemy AI Pathfinding
- No Softlock

필요하면 지형, 배치, 턴 제한을 조정한다.

단, 미션별 전술적 개성을 유지해야 한다.

---

# 11. Battle Map Redesign

## 11.1 목표

기존 12×12 전후의 정사각형 전장 느낌을 제거한다.

Mission마다 명확히 다른 공간 구조를 제공한다.

## 11.2 Mission 01

Ashen Village Assault.

필수 지형:

- Village Houses
- Narrow Streets
- Village Square
- Supply Storage
- Entrance Routes
- Burning Structures
- Civilian Escape Routes

적 증원 방향과 민간인 구조의 전술적 의미를 유지한다.

## 11.3 Mission 02

Forest Pursuit.

필수 지형:

- Winding Forest Path
- Dense Forest
- Ambush Point
- Escape Route
- Alternate Flanking Path
- Limited Visibility Area 검토

엘리나와 카이의 이동 특성이 드러나야 한다.

## 11.4 Mission 03

Broken Bridge.

필수 지형:

- River / Gorge
- Bridge
- Narrow Crossing
- Refugee Route
- Enemy Pursuit Route
- Safe Withdrawal Zone

Mission 03의 10턴 구조를 유지하되 확장된 맵에 맞춰 다시 검증한다.

## 11.5 Minimap

큰 맵에서도 전장의 전체 구조를 볼 수 있어야 한다.

Minimap에는 다음 정보를 표시한다.

- Allies
- Enemies
- Key Objectives
- Camera Viewport
- Terrain Regions

접거나 펼칠 수 있는 옵션을 검토한다.

---

# 12. Fire & Destruction System

## 12.1 Visual State

건물에는 최소 다음 상태가 존재할 수 있어야 한다.

- Intact
- Burning
- Burned

각 상태는 실제 화면에서 명확하게 구분되어야 한다.

## 12.2 Fire Animation

- Animated Flames
- Smoke
- Ember Particles
- Flickering Light
- Burned Roof / Wall
- Debris

현재 불타는 마을이라는 설정이 있으면 실제 화재가 보여야 한다.

전투 후 불탄 집은 잔해 또는 탄 흔적이 있는 건물로 표시한다.

## 12.3 Story State Integration

Story Flags와 Map Visual State를 연결한다.

예:

`village_fire_started`

→ Burning Tiles

`mission_01_completed`

→ Burned Village Variants

지도 상태는 Save / Reload 이후에도 일관성을 유지해야 한다.

## 12.4 Gameplay Scope

v0.3.1의 필수 범위는 시각적 상태와 스토리 연동이다.

화재 확산, 화염 피해, 방화 및 소화 시스템을 구현한다면 전투 규칙과 밸런스까지 완전히 검증해야 한다.

미검증 화재 피해를 임의로 전투에 추가하지 않는다.

---

# 13. War Council Simplification

현재 장비 확인, 도구 확인 등의 체크박스가 플레이 흐름을 방해한다.

강제 확인 체크박스를 제거한다.

War Council에서는 정보를 명확하게 요약한다.

필수 표시:

- Mission Name
- Objective
- Enemy Intelligence
- Terrain
- Party
- Equipment Summary
- Consumables
- Battle Start

준비가 부족한 항목은 경고할 수 있다.

그러나 체크박스를 직접 선택해야만 전투를 시작할 수 있는 방식은 제거한다.

전투 시작 버튼을 누르면 필요한 경우 간단한 최종 확인만 제공한다.

---

# 14. Story & Character Presentation

첨부한 고전 SRPG 스크린샷처럼 전투 중에도 자연스럽게 인물의 얼굴과 대사가 등장해야 한다.

필수:

- Battle Dialogue
- Portrait
- Speaker Name
- Contextual Dialogue Position
- No Forced Teleportation
- Turn Event Trigger
- Combat Pause During Dialogue
- Return to Battle State

특정 장수가 공격하거나 적장을 처음 만났을 때 짧은 대사가 등장할 수 있다.

하지만 매번 반복되어 전투를 끊지 않도록 한다.

중요 이벤트가 아닌 일반 전투 대사는 제한적으로 사용한다.

---

# 15. QA & Regression

이번 개발은 렌더링, UI, 맵, 이동 규칙까지 변경하므로 테스트를 반드시 강화한다.

## P0 UI Tests

- Town NPC 대화 위치 유지
- Shop Exit / Re-entry
- Purchase 이후 상점 내부 유지
- Context Menu Positioning
- Character Selection
- Movement Range Immediate Display
- Quest Panel Collapse / Expand

## Rendering Tests

- High-DPI Desktop
- Standard Desktop
- Mobile Portrait
- Mobile Landscape
- Pixel Scaling
- Camera Boundaries
- Large Map Rendering
- Animation Performance

## Shop Tests

- Weapon Selection
- Character Eligibility
- Stat Preview
- Confirm / Cancel
- Purchase Persistence
- Shop Position Persistence
- No Duplicate Transactions

## Combat Tests

- Class Movement
- Terrain Cost
- Attack After Move
- Undo Move
- Skills
- Item Usage
- Enemy AI
- Rescue
- Reinforcement
- Victory / Defeat

## Campaign Tests

- Mission 01–03 Complete Run
- Save / Reload
- Stage Restart
- Defeat Retry
- Existing Growth
- Equipment Migration
- Story Flag Restoration

## Visual Tests

실제 Screenshot Evidence를 생성한다.

- Town Exterior
- Shop Interior
- Equipment Comparison
- NPC Dialogue
- Quest Panel
- Mission 01
- Mission 02
- Mission 03
- Fire / Burned Village
- Context Action Menu

참고 이미지와 새 게임 화면을 비교해 UX 목표를 달성했는지 검토한다.

단, 저작권이 있는 참조 이미지의 자산을 복제하지 않는다.

---

# 16. GitHub Documentation Continuity

기존 프로젝트 문서를 업데이트한다.

필수:

- `AGENTS.md`
- `CLAUDE.md`
- `docs/vision/PRODUCT_VISION.md`
- `docs/vision/DEVELOPMENT_ROADMAP.md`
- `docs/design/COMBAT_SYSTEM.md`
- `docs/design/CHARACTER_ART.md`
- `docs/design/EXPLORATION_SYSTEM.md`
- `docs/design/TOWN_AND_CAMP.md`
- `docs/design/EQUIPMENT_SYSTEM.md`
- `docs/design/NARRATIVE_SYSTEM.md`
- `docs/decisions/DECISION_LOG.md`
- `docs/handoff/PROJECT_CONTEXT.md`
- `docs/handoff/CURRENT_STATUS.md`
- `docs/handoff/NEXT_TASKS.md`

추가 권장 문서:

- `docs/design/VISUAL_DESIGN_SYSTEM.md`
- `docs/design/MAP_ARCHITECTURE.md`
- `docs/design/TACTICAL_UX.md`
- `docs/v0.3.1/FEEDBACK_TRACEABILITY.md`

`FEEDBACK_TRACEABILITY.md`에는 사용자의 14개 피드백을 각각 기록한다.

각 항목에 다음을 포함한다.

- Feedback ID
- User Requirement
- Implementation Location
- Implementation Status
- Test Evidence
- Screenshot Evidence
- Remaining Issues

기존 Story Bible의 4막 30 Mission과 캐릭터 관계는 변경하지 않는다.

프로젝트 정본을 사용자 승인 없이 변경하지 않는다.

---

# 17. Release Deliverables

완료 시 다음 파일을 생성한다.

```text id="b3v18k"
releases/
├── Ashen_Crown_v0.3.1.html
├── Ashen_Crown_v0.3.1_Source.zip
├── Ashen_Crown_v0.3.1_Test_Report.md
└── Ashen_Crown_v0.3.1_SHA256SUMS
```

추가 검증 자료:

```text id="ts7n2p"
docs/v0.3.1/
├── FEEDBACK_TRACEABILITY.md
├── VISUAL_REVIEW.md
├── REGRESSION_RESULTS.md
└── screenshots/
```

Source ZIP에서 실행 HTML을 재생성하여 동일한 결과가 나오는지 검증한다.

GitHub PR을 생성한다.

PR에는 다음 정보를 포함한다.

- Baseline
- 14 Feedback Implementation Summary
- Before / After Screenshots
- Rendering Improvements
- Map Changes
- Town / Shop Improvements
- Tactical UI Changes
- Movement Balance Changes
- Save Compatibility
- CI Results
- Known Limitations
- Next Version Plan

사용자 승인 없이 main에 병합하지 않는다.

---

# 18. 완료 기준

이번 v0.3.1은 다음 조건을 만족해야 한다.

1. 마을에서 NPC에게 말을 걸어도 인물이 순간이동하지 않는다.
2. 상점에 들어가면 독립된 실내 공간이 나타난다.
3. 상점 주인은 실내에 존재한다.
4. 구매 후에도 실내에 머문다.
5. 건물마다 용도를 알아볼 수 있는 고유 외형을 갖는다.
6. 마을과 전투맵에 다양한 가로·세로 크기가 적용된다.
7. 오른쪽 상단 Quest Panel이 접히고 펼쳐진다.
8. 실제 고해상도 렌더링과 그래픽 디테일 향상이 확인된다.
9. 장비를 선택한 뒤 장수를 고르고 능력치를 비교해 구매할 수 있다.
10. 주요 대사의 문체가 자연스럽게 개선된다.
11. 불필요한 준비 체크박스가 제거된다.
12. 캐릭터 선택 즉시 이동 가능 범위가 표시된다.
13. 행동 메뉴가 캐릭터 옆에 나타난다.
14. 불타는 건물과 불탄 건물의 시각적 차이가 표현된다.
15. 병종별 이동력과 지형 비용이 적용된다.
16. 전직에 따른 이동력 확장 구조가 마련된다.
17. 기존 Mission 01–03이 정상 완료된다.
18. 기존 저장 데이터가 유지된다.
19. GitHub 정본 문서가 갱신된다.
20. 실행 HTML, Source ZIP, Test Report 및 PR이 준비된다.

**기능이 코드에 존재하더라도 실제 화면에서 플레이어가 경험할 수 없다면 완료로 간주하지 않는다.**

---

# 19. 구현 시 가장 중요한 원칙

이번 v0.3.1에서 새로운 시스템의 개수보다 중요한 것은 체감 품질이다.

마을 탐색은 자연스러워야 한다.

상점은 실제 공간이어야 한다.

장수의 외형은 구별되어야 한다.

대사는 인물의 성격을 표현해야 한다.

전투에서는 이동 가능한 영역과 행동이 즉시 이해되어야 한다.

맵은 시나리오의 지리적 특징을 보여줘야 한다.

플레이어가 UI와 싸우는 일이 없어야 한다.

**Ashen Crown은 고전 SRPG의 직관적인 조작감을 현대적인 브라우저 환경에서 재현하되, 독자적인 세계관과 아트, 장수 육성 철학을 지닌 오리지널 게임이어야 한다.**

---

# 20. 실행 지시

계획만 작성하지 말고 실제 구현을 수행한다.

다음 순서로 진행한다.

1. GitHub 최신 상태 확인
2. v0.3 의존성 및 CI 확인
3. 14개 피드백 분석·테스트 케이스 정의
4. P0 UI/UX 및 위치 버그 수정
5. 상점 내부 및 장비 비교 UI 구현
6. 가변 맵 구조와 전투맵 개선
7. 고해상도 렌더링 및 아트 개선
8. 화재·파괴 연출
9. 병종별 이동력 및 지형 비용
10. 대사 리라이트
11. 기존 Mission 01–03 회귀 검증
12. Desktop / Mobile 테스트
13. Story Bible / Roadmap / Handoff 업데이트
14. Release Artifact 생성
15. GitHub PR 생성

각 단계에서 작동 가능한 코드를 유지한다.

개발 범위가 커지더라도 단순 계획이나 구현되지 않은 Mockup을 최종 결과로 제출하지 않는다.

실제 기능을 구현하고 테스트한 항목만 완료로 표시한다.

v0.3.1이 안정화되면 그다음에 Mission 04–06을 개발한다.

**최종 목표: Ashen Crown을 전투·스토리·마을·장비·캐릭터가 자연스럽게 연결되는, 플레이 자체가 재미있는 오리지널 클래식 판타지 SRPG로 발전시켜라.**