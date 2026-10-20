# 사용 방법 (사용자용) — 못 받은 4장만

ChatGPT 작업 모드(Sol 6.1)에 이 ZIP을 **통째로** 올리고 아래 메시지를 붙여 넣으세요.

## 처음 그림을 그렸던 대화창이 남아 있을 때 (권장)
같은 대화창에 이 ZIP을 올리면, GPT가 이미 만든 4장을 다시 그리지 않고 SHA256을 확인한 뒤 묶어서 줍니다.
```
Attached is a follow-up work pack. Read 00_START_HERE.md first. The previous return zip was cut off during upload. Use Path A for every file you still have (verify the SHA256), Path B only for the rest, and return Ashen_Crown_v050_World_Art_Pack_Part2.zip under 20 MB exactly as described in section 4.
```

## 새 대화창일 때
같은 메시지를 쓰면 됩니다. GPT가 4장을 새로 그리고(Path B), 이미 승인된 거점 4장의 화풍에 맞춥니다.

## 받은 뒤
- 결과 ZIP을 그대로 Claude에게 주세요.
- 20MB를 넘으면 GPT가 두 개(Part2a, Part2b)로 나눕니다. 그때는 두 개 모두 주세요.

## 파일 구성
| 파일 | 내용 |
|---|---|
| `00_START_HERE.md` | GPT가 읽는 영문 작업 지시서 (Path A 재포장 / Path B 재생성, 20MB 제한) |
| `jobs.csv` | 4장 목록과 예전 결과물의 SHA256 |
| `prompts/01–04_*.txt` | Path B로 다시 그릴 때 쓰는 프롬프트 (지난번 품질 지적 사항 보강) |
| `references/approved_*.jpg` | 이미 게임에 들어간 거점 4장 (화풍 맞추기용) |
| `references/layout_*.png`, `scale_reference.png`, `sprite_eric_sheet.png`, `style_aren_neutral.png`, `style_eric_neutral.png` | 배치 스케치와 크기·화풍 기준 |
