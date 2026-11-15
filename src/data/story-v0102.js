// v0.10.2 ACT IV 「잿빛 왕관」 part 3 「잿빛 밤」 — M27 왕도의 성문, M28 잿빛 밤의 진실 (D-099/D-110, docs/v0.10.0/ACT4_DESIGN.md §3,
// §4.2). Wording PROPOSED. Reveal rule (ACT4_DESIGN §3, Q1): M28 tells all of the Ashen Night — the rite failed on forced
// oaths; the king held the ward alone so no one would be forced again; the sealing order was signed by the king and written by
// Bellard, then deputy of the war office (shared responsibility); Aren carried it knowing who would be left outside, and his
// refusal at M06 was his atonement. Bellard is not a monster: he drew another conclusion from the same night (§11.3). What lies
// beyond the ward stays OPEN (§11.7).
const s102=(speaker,text,expression='neutral')=>({speaker,text,expression});
export const STORY_V0102={
 '27:intro':[s102('kai','왕도 아우렐리아의 남쪽 성문이야. 성벽 위에 궁수, 문 안에 의식 기사.','concerned'),
  s102('aren','두 전선이다. 공성추로 성문을 부수고, 사다리로 성벽에 오른다.','determined'),
  s102('lia','공성추는 장수가 곁에 있어야 움직여요. 성문 앞에 닿으면 턴마다 한 번 쳐요 — 세 번이면 부서져요.','concerned'),
  s102('lia','사다리는 셋이에요. 사다리 위 성벽 칸에서 아군 턴을 마치면 그 구간을 장악해요. 두 곳이면 충분해요.','determined'),
  s102('eric','둘로 나눈다. 한쪽은 공성추를, 한쪽은 성벽을.','determined')],
 '27:squads':[s102('lia','세 깃발의 부대가 함께 왔어요! 군단을 믿는 깃발이 보낸 사람들이에요. 동맹 유닛을 누르면 지시를 내릴 수 있어요.','determined'),
  s102('aren','연합의 전쟁이다. 우리만의 싸움이 아니다.','determined')],
 '27:lion':[s102('baldrick','약속대로 왔다. 철왕관 기병, 군단의 곁에 선다!','determined'),s102('eric','발드릭 경! 함께 갑시다.','determined')],
 '27:sally':[s102('elina','성 안쪽에서 의식 기사가 더 나와요! 성벽으로 오르는 길을 막으려고 해요!','concerned'),s102('eric','사다리 위를 서둘러라!','determined')],
 '27:flank':[s102('kai','양옆 들판에서 회색 망토! 공성추를 노려!','concerned'),s102('eric','공성추 곁을 비우지 마라!','determined')],
 '27:blow':[s102('aren','첫 번째 일격이다. 성문이 울린다.','determined'),s102('lia','두 번 더요! 공성추를 지켜 주세요!','concerned')],
 '27:gate':[s102('kai','성문이 부서졌어! 왕도로 들어가는 길이 열렸다!','determined'),s102('aren','성벽을 마저 잡아라. 등 뒤를 남겨 두지 마라.','determined')],
 '27:section:1':[s102('elina','성벽 한 곳을 잡았어요! 위에서 성 안이 다 보여요.','determined')],
 '27:section:2':[s102('lia','성벽 두 곳이에요! 성문만 열리면 돼요.','determined')],
 '27:section:3':[s102('eric','성벽 세 곳을 모두 잡았다. 왕도의 남쪽은 우리 것이다.','determined')],
 '27:ram:lost':[s102('lia','공성추가… 부서졌어요. 이제 성문을 열 방법이 없어요…','sad')],
 '27:end':[s102('aren','왕도의 성문이 열렸다. 이백 년 동안 닫혀 있던 문이다.','determined'),
  s102('lia','왕관의 심장으로 가는 길에… 무언가가 열리고 있어요. 국왕의 기억이에요.','concerned'),s102('eric','들어가자. 끝까지.','determined')],
 '28:intro':[s102('lia','여기는… 왕관의 심장이 아니에요. 국왕의 남은 기억이에요. 잿빛 밤의 궁.','concerned'),
  s102('youngAren','누구냐! …이 밤에 성 안에 남은 병사는 없을 텐데.','determined'),
  s102('aren','…저건 나다. 그 밤의 나.','sad'),
  s102('lia','기억 조각이 셋 있어요. 곁에서 「기억 보기」로 열면 그 밤에 있었던 일이 보여요. 연 조각 곁의 잔영은 흩어져요.','concerned'),
  s102('kai','잔영 병사는 쓰러뜨려도 3턴 뒤에 다시 선대. 기억 속의 병사니까.','concerned'),
  s102('eric','조각을 찾고, 이 밤의 끝까지 본다. 그리고 우리는 돌아간다.','determined')],
 '28:echo':[s102('elina','궁 양쪽 회랑에서 잔영이 더 나와요!','concerned'),s102('youngAren','물러서지 마라. 이 밤은 길다.','determined')],
 '28:memory:oath':[s102('chronicle','— 잿빛 밤. 맹세의 단. 결계를 다시 세울 계승 의식이 시작된다.'),
  s102('conscript','저는… 수호자가 아닙니다. 전쟁청에서 이름을 불러 데려왔을 뿐입니다.','sad'),
  s102('youngBellard','맹세하라. 왕국이 너희를 수호자로 정했다.','determined'),
  s102('conscript','…맹세합니다.','sad'),
  s102('lia','결계는 맹세한 사람의 기억으로 서요. 그런데 이 사람들은 스스로 맹세하지 않았어요. 강요된 맹세였어요.','sad'),
  s102('chronicle','결계는 서지 않았다. 그 밤, 대륙을 둘러싼 결계가 무너지기 시작했다.')],
 '28:memory:king':[s102('chronicle','— 잿빛 밤. 국왕의 자리. 무너지는 결계 앞에 국왕이 홀로 선다.'),
  s102('king','더는 누구에게도 맹세를 강요하지 않겠다. 결계는 내 기억으로 붙든다.','determined'),
  s102('youngBellard','폐하, 한 사람의 기억으로는 오래 버티지 못합니다!','concerned'),
  s102('king','버티는 동안 다른 길을 찾아라. 그것이 왕의 일이다.','sad'),
  s102('sain','그래서 국왕은 그 밤부터 홀로… 쉬지 못하고 있었던 거예요.','sad')],
 '28:memory:order':[s102('chronicle','— 잿빛 밤. 전쟁청 집무실. 봉인 명령이 쓰인다.'),
  s102('youngBellard','결계가 버틸 수 있는 땅만 지킨다. 관문을 닫는다. …바깥의 피난민은 남는다.','sad'),
  s102('king','…서명하마. 책임은 나와 그대가 함께 진다.','sad'),
  s102('youngBellard','명령서를 국경 수비대에 전하라. 아렌 발터.','determined'),
  s102('youngAren','관문 밖에… 아직 사람들이 있습니다.','sad'),
  s102('youngBellard','알고 있다. 그래도 전하라.','determined'),
  s102('youngAren','…전하겠습니다.','sad'),
  s102('eric','아렌…','sad'),
  s102('aren','그래. 나는 알고 전했다. 관문 밖에 누가 남는지 알면서.','sad')],
 '28:dawn':[s102('lia','세 조각을 모두 봤어요. 이제 이 기억이… 그 밤의 끝으로 가요.','concerned'),
  s102('kai','잔영이 전부 에릭 쪽으로 몰려와!','concerned'),
  s102('youngAren','끝까지 버텨라. 그 밤은 끝났다. 끝나야 한다.','determined'),
  s102('eric','적 턴 두 번이다. 모두, 끝까지 함께!','determined')],
 '28:end':[s102('chronicle','잿빛 밤이 끝나고, 기억 속의 새벽이 궁을 비춘다.'),
  s102('youngAren','…너희가 누군지 모르지만, 고맙다.','sad'),
  s102('aren','고맙다는 말은 내가 해야겠지. 그 밤의 나에게.','sad'),
  s102('lia','기억이 닫혀요. 원래 자리로 돌아가요.','concerned')]
};
export const FRONTIER_V0102={
 'pre:27':{actors:['aren','eric','lia','kai'],lines:[['kai','하층가로 돌아왔어. 이번엔 성 밖에서 왕도의 성벽을 올려다보네.','concerned'],
  ['lia','벨라드가 성문을 닫아걸고 왕관의 심장에서 계승 의식을 끝내려 해요. 국왕은 점점 약해지고요.','concerned'],
  ['aren','세 깃발이 함께 왔다. 오늘은 연합의 전쟁이다.','determined'],['eric','성문을 연다.','determined']]},
 'after:27':{actors:['aren','eric','lia'],lines:[['lia','성문이 열렸어요. 그런데 왕관의 심장 앞에서… 국왕의 기억이 새어 나와요.','concerned'],
  ['aren','잿빛 밤의 기억이다. …나도 그 밤에 있었다.','sad'],['eric','함께 보겠습니다.','determined']]},
 'pre:28':{actors:['aren','eric','lia','sain'],lines:[['lia','기억 속으로 들어가면 그 밤에 있었던 일을 그대로 보게 돼요. 바꿀 수는 없어요. 볼 수만 있어요.','concerned'],
  ['sain','그래도 보는 사람이 있으면, 그 밤도 혼자가 아니게 되겠죠.','concerned'],
  ['aren','에릭. 그 안에서 무엇을 보든, 끝까지 봐 다오.','sad'],['eric','끝까지 함께 보겠습니다.','determined']]},
 'after:28':{actors:['aren','eric','lia','sain'],lines:[['lia','잿빛 밤에 있었던 일을… 이제 다 알아요.','sad'],
  ['sain','강요된 맹세, 홀로 버틴 국왕, 함께 쓴 봉인 명령. 누구 한 사람의 잘못이 아니었어요.','sad'],
  ['aren','하지만 그 명령서를 들고 간 것은 나다. …말해야 할 것이 있다.','sad']]},
 'after:28:all':{actors:['aren','eric','lia','kai','sain','elina'],lines:[['aren','모두 들어라. 잿빛 밤, 나는 관문 밖에 사람들이 남는 것을 알고 명령서를 전했다.','sad'],
  ['aren','국경에서 같은 명령을 거부한 것은 정의감이 아니었다. 그 밤에 대한 속죄였다.','sad'],
  ['elina','…그래서 그때 망설이지 않았던 거군요.','concerned'],['kai','숨기지 않고 말해 줘서 고마워. 이제 같은 짐이야.','determined'],
  ['eric','군단은 아렌이 그 밤을 어떻게 갚아 왔는지 다 봤습니다. 끝까지 함께 갑니다.','determined']]},
 'after:28:eric':{actors:['aren','eric'],lines:[['aren','에릭, 너에게만 말하마. 잿빛 밤, 나는 알고 명령서를 전했다.','sad'],
  ['aren','국경에서 명령을 거부한 날, 나는 그 밤을 갚고 싶었다. 군단의 맹세도 그 속죄에서 시작됐다.','sad'],
  ['eric','그 맹세 덕에 저는 오늘 여기 있습니다.','determined'],['aren','…언젠가는 모두에게 말하겠다. 그때까지 네가 함께 들어 다오.','sad'],['eric','네.','determined']]}
};
export const ADVISOR_V0102={
 27:[['lia','에릭, 왕도의 남쪽 성문이에요. 성문과 성벽, 두 전선이에요.','concerned'],['eric','조건은?'],
  ['lia','성문을 부수고 성벽 두 곳을 장악하면 이겨요. 공성추가 부서지거나 TURN 14를 넘기면 실패예요.','concerned'],
  ['lia','공성추는 장수가 곁에 있어야 전진해요. 사다리 위 성벽 칸에서 턴을 마치면 그 구간을 잡아요. 출전은 8명이에요.','determined'],['eric','둘로 나눠 간다.','determined']],
 28:[['lia','에릭, 국왕의 기억 속이에요. 잿빛 밤의 궁.','concerned'],['eric','조건은?'],
  ['lia','기억 조각 셋을 찾고, 그 밤의 끝까지 — 적 턴 두 번을 버티면 돼요. 에릭이 쓰러지면 기억이 닫혀요.','concerned'],
  ['lia','잔영 병사는 3턴 뒤 다시 서요. 조각을 열면 그 곁의 잔영은 흩어지고요. 젊은 아렌이 함께 싸워요. 아렌의 마지막 군령 「끝까지 함께」도 쓸 수 있어요.','determined'],['eric','끝까지 본다.','determined']]
};
export const ADVISOR_AFTER_V0102={
 27:[['lia','에릭, 성문이 열렸어요.','determined'],['eric','다음은?'],['lia','국왕의 기억이에요. 잿빛 밤으로 들어가요.','concerned'],['eric','준비하자.','determined']],
 28:[['lia','에릭, 잿빛 밤의 진실을 모두 봤어요.','sad'],['eric','다음은?'],['lia','왕관의 심장이요. 벨라드와의 마지막 싸움이에요. ACT IV는 다음 업데이트에서 끝나요.','concerned'],['eric','그때까지 정비하자.','determined']]
};
const cmd102=s=>s.command?` · 아렌의 군령 「${({hold:'지켜라',advance:'나아가라',leaveNoOne:'한 사람도 두고 가지 않는다'})[s.command]}」`:'';
export const COUNCIL_V0102={
 27:s=>({terrain:'Royal Gate · 남쪽 성문 / 성벽(사다리 셋) / 성 밖 들판 · 가운데 왕도 길',intel:'성벽 경비병 3 · 궁수 4 · 의식 기사 2(성문 안). TURN 3 의식 기사 2·경비병 1, TURN 5 양옆 회색 망토 2, TURN 7 경비병 2·궁수 1, TURN 9 의식 기사·회색 망토 2',plan:`공성추 호위 · 사다리 두 곳 장악 · 출전 8명${cmd102(s)}`}),
 28:s=>({terrain:'Palace of the Ashen Night · 잿빛 밤의 궁 · 서쪽 날개(맹세의 단) / 동쪽 날개(국왕의 자리) / 북쪽(봉인 명령)',intel:'잔영 병사 10 (쓰러져도 3턴 뒤 제자리에서 다시 섬). TURN 4 회랑 잔영 2, TURN 8 잔영 2. 젊은 아렌(동맹, 지시 가능)',plan:`기억 조각 셋 · 그 밤의 끝까지 · 아렌의 마지막 군령「끝까지 함께」${cmd102(s)}`})
};
