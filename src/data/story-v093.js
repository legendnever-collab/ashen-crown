// v0.9.3 ACT III 「왕관의 진실」 part 4 — M21 마지막 국왕, M22 잿빛 선택, Aren's awakening (D-093, docs/v0.9.0/ACT3_DESIGN.md
// §4.2, §5, §6). Wording PROPOSED. Reveal rule (STORY_BIBLE): the king is alive, has given his own memories to hold the ward
// alone since the Ashen Night, has forgotten his name and remembers only Aren. Why the rite failed that night, who signed the
// sealing order and what Aren knew stay for ACT IV (M28). The ACT III choice has no right answer; Bellard withdraws to the
// crown's heart.
const s93=(speaker,text,expression='neutral')=>({speaker,text,expression});
export const STORY_V093={
 '21:intro':[s93('lia','여기가 왕관의 심장이에요. 결계가… 숨을 쉬듯 고리 모양으로 맥동해요.','concerned'),
  s93('king','…누구냐. 아니, 됐다. 이름을 물어도 나는 답하지 못한다. 내 이름조차 남지 않았으니.','sad'),
  s93('eric','저 옥좌에… 사람이 있어. 결계에 묶인 채로.','concerned'),
  s93('rc','물러서라, 재의 군단. 폐하의 마지막 기억으로 계승 의식을 끝낸다. 그게 왕국을 살리는 길이다.','determined'),
  s93('lia','고정석 넷이 의식을 이 방에 붙들고 있어요. 고정석을 깨면 의식이 풀려요. 에릭, 테아, 다리오, 이네스는 한 번에 깰 수 있어요.','determined'),
  s93('eric','국왕을 지킨다. 고정석도 깬다. 맥동 칸에서는 턴을 끝내지 마라.','determined')],
 '21:duel':[s93('rc','방패의 기사여. 의식을 막을 셈이라면 칼로 말하라. 세 합이다.','determined'),
  s93('eric','지켜야 할 사람이 저기 있는데, 피할 이유가 없지.','determined')],
 '21:duel:hero':[s93('rc','…방패가 칼보다 무겁군.','sad'),s93('eric','등 뒤에 사람이 있으면 다 그렇다.','determined')],
 '21:duel:foe':[s93('rc','왕국을 살리는 데 감상은 필요 없다.','determined'),s93('eric','감상이 아니다. 저분도 사람이다.','determined')],
 '21:pulse:inner':[s93('lia','이번 턴은 안쪽 고리예요! 국왕 곁 두세 칸에서 턴을 끝내면 마력이 빠져요.','concerned')],
 '21:pulse':[s93('sain','맥동에 마력이 빨려 나갔어요… 결계가 사람에게서 힘을 거둬 가요.','concerned'),s93('lia','홀수 턴은 바깥, 짝수 턴은 안쪽이에요. 고리를 피해 서요!','determined')],
 '21:crack':[s93('kai','고정석에 금이 갔어. 한 번만 더.','determined')],
 '21:anchor':[s93('lia','고정석 하나가 깨졌어요! 국왕의 숨이 조금 돌아왔어요.','determined'),
  s93('king','…가볍구나. 누군가 이 무게를 같이 들고 있는 것처럼.','sad')],
 '21:anchor2':[s93('elina','둘째 고정석도 깨졌어요!','determined')],
 '21:anchor3':[s93('lia','하나 남았어요. 의식이 흔들려요!','determined'),s93('rc','막아라! 마지막 고정석을 지켜라!','determined')],
 '21:anchor4':[s93('lia','다 깨졌어요. 의식이 이 방에서 풀려요!','determined')],
 '21:king:low':[s93('sain','국왕의 숨이 약해져요! 의식 기사들을 떼어 내야 해요!','concerned'),s93('eric','옥좌 곁을 비우지 마라!','determined')],
 '21:commander':[s93('rc','…재상 각하께 고하라. 의식은… 끝나지 못했다고.','sad'),s93('eric','끝나지 않는 게 아니다. 다른 방법을 찾는 거다.','determined')],
 '21:reinforce':[s93('elina','북쪽 문으로 의식 기사들이 더 내려와요!','concerned'),s93('eric','옥좌로 가는 길을 막아라.','determined')],
 '21:end':[s93('king','…아렌. 아렌이냐. 그 밤에 명령서를 들고 달려온 아이.','sad'),
  s93('aren','…폐하. 기억하십니까. 저를.','sad'),
  s93('king','다른 건 다 내주었다. 이름도, 왕비의 얼굴도, 아침의 빛도. 그런데 너만은 남아 있더구나. 그 밤, 내가 마지막으로 본 얼굴이라.','sad'),
  s93('eric','…아렌이 잿빛 밤의 전령이었다니.','concerned'),
  s93('king','부탁이 있다, 아렌. 나를… 쉬게 해다오. 너무 오래 혼자 붙들고 있었다.','sad'),
  s93('aren','폐하. 그 답은… 군단과 함께 드리겠습니다.','determined')],
 '22:intro':[s93('lia','하층가 광장이에요. 사람들이 모여들고 있어요. 전령 세 분이 단에 올랐어요.','concerned'),
  s93('herald','기록과 계획서와 국왕의 말을 읽겠습니다. 네 번씩, 끝까지.','determined'),
  s93('bellard','광장에서 진실을 읽겠다. 좋은 연극이군. 하지만 진실이 사람을 살리지는 못하오.','neutral'),
  s93('eric','살릴지 말지는 사람들이 듣고 정한다. 군단은 전령을 지킨다.','determined'),
  s93('lia','다친 전령은 그 턴에 읽지 못해요. 전령이 쓰러지면 그 단에 우리가 서서 대신 읽을 수 있어요.','determined')],
 '22:reading':[s93('herald','"잿빛 밤의 기록. 그날 밤, 결계를 세우는 의식이 있었고…"','determined'),s93('eric','읽기 시작했다. 단 곁을 지켜라!','determined')],
 '22:betrayer':[s93('kai','동서 길에서 깃발이 들어와. 정상 회담장에서 우리 등을 친 그 깃발이야.','concerned'),s93('eric','전령에게 닿게 두지 마라.','determined')],
 '22:support:iron':[s93('elina','남쪽 문에 철왕관 기사들이 왔어요! 우리 곁에 서겠대요!','determined'),s93('eric','고맙다. 전령 곁을 함께 지키자.','determined')],
 '22:support:free':[s93('elina','남쪽 문에 연맹 기사들이 왔어요! 레오노라 의장이 보냈대요!','determined'),s93('eric','고맙다. 전령 곁을 함께 지키자.','determined')],
 '22:support:flame':[s93('elina','남쪽 문에 성화 기사들이 왔어요! 루시안 대사제가 보냈대요!','determined'),s93('eric','고맙다. 전령 곁을 함께 지키자.','determined')],
 '22:return:thea':[s93('thea','에릭! 광장 소식을 듣고 달려왔어요. 이번엔… 끝까지 곁에 설게요.','determined'),s93('eric','테아. 기다리고 있었다.','determined')],
 '22:return:dario':[s93('dario','광장에서 진실을 읽는다길래. 이런 구경은 공짜로 보면 안 되지. 칼값은 내가 내지.','determined'),s93('eric','다리오. 잘 왔다.','determined')],
 '22:return:ines':[s93('ines','이름을 부르는 자리라면, 저도 서야 해요. 늦었지만 왔어요.','determined'),s93('eric','이네스. 늦지 않았다.','determined')],
 '22:fallen:thea':[s93('thea','…미안해요, 에릭. 이번에도 끝까지는…','sad'),s93('sain','테아를 뒤로! 아직 숨이 있어요!','concerned')],
 '22:fallen:dario':[s93('dario','하… 이번엔 칼값이 좀 비쌌네.','sad'),s93('sain','다리오를 뒤로 옮겨요!','concerned')],
 '22:fallen:ines':[s93('ines','이름을… 끝까지 불러 주세요…','sad'),s93('sain','이네스를 뒤로! 제가 볼게요!','concerned')],
 '22:read:hr':[s93('herald','"…잿빛 밤의 기록, 여기까지입니다."','determined'),s93('lia','기록 낭독이 끝났어요!','determined')],
 '22:read:hp':[s93('herald','"…통제된 전쟁의 계획서, 여기까지입니다."','determined'),s93('kai','계획서 낭독이 끝났어. 광장이 조용해졌어.','concerned')],
 '22:read:hk':[s93('herald','"…나는 이름을 잊었으나 이 땅을 잊지 않았다. 국왕의 말, 여기까지입니다."','determined'),s93('aren','…폐하의 말이 사람들에게 닿았다.','sad')],
 '22:fallen':[s93('sain','전령 한 분이 쓰러졌어요!','concerned'),s93('lia','그 단에 누가 서요! 우리가 대신 읽을 수 있어요!','determined')],
 '22:fallen2':[s93('eric','…전령이 또 쓰러졌다.','sad')],
 '22:end':[s93('bellard','세 낭독이 끝났군. 사람들은 진실을 들었소. 이제 그 무게를 누가 질지 보겠소.','neutral'),
  s93('lia','벨라드가… 궁 쪽으로 물러나요. 왕관의 심장으로요.','concerned'),
  s93('aren','그는 아직 끝나지 않았다. 하지만 오늘 광장의 사람들은 자기 귀로 들었다.'),
  s93('eric','이제 이 진실을 누구에게 맡길지 정해야 한다. 다 같이.','determined')]
};
// Staged camp scenes in the capital's lower city (M21–M22 preparation and after).
export const FRONTIER_V093={
 'after:20:next':{actors:['eric','aren','lia'],lines:[['lia','계획서 마지막 장에 "왕관의 심장"이라는 말이 있어요. 궁 아래요. 재상부가 거기서 계승 의식을 끝내려 해요.','concerned'],
  ['aren','…폐하가 계신 곳이다. 아무도 모르게 그 밤 이후로.','sad'],['eric','그럼 가자. 왕관의 심장으로.','determined']]},
 'pre:21':{actors:['aren','eric','lia','elder','kai'],lines:[['elder','궁 아래로 내려가는 길은 기록원 지하 수로와 이어져 있소. 잿빛 밤 이후 아무도 내려가지 않았지.','concerned'],
  ['kai','재상부 의식 기사단이 그 길을 지키고 있어. 단장은 칼을 잘 쓰는 사람이야.','concerned'],
  ['lia','고정석 넷이 의식을 붙들고 있대요. 그리고 결계가 고리처럼 맥동한대요.','concerned'],
  ['aren','…폐하를 다시 뵙게 될지도 모르겠군.','sad'],['eric','아렌, 무엇을 보게 되든 함께 본다.','determined'],['aren','그래. 내려가자.','determined']]},
 'after:21':{actors:['aren','eric','lia','sain'],lines:[['aren','나는 잿빛 밤에 왕실 전령이었다. 봉인 명령서를 관문에 전했지. 그 전에 궁에서 폐하를 뵈었다.','sad'],
  ['eric','그래서 폐하가 아렌만 기억하는 거군요.','concerned'],['sain','폐하는 쉬고 싶다고 하셨어요. 결계를 대신할 길이 없으면… 쉬실 수 없는데.','sad'],
  ['lia','지금 폐하가 결계를 놓으면 왕국 전체의 결계가 무너져요. 대안이 필요해요.','concerned'],
  ['aren','폐하께 답을 드려야 한다. 오늘은 내가 혼자 정하지 않겠다.']]},
 'after:21:notyet':{actors:['eric','aren','sain'],lines:[['aren','"지금은 아닙니다, 폐하." 그렇게 말씀드렸다. 대안을 찾기 전까지는.','sad'],
  ['sain','폐하가 고개를 끄덕이셨어요. 조금은… 안심하신 얼굴로.'],['eric','그럼 대안을 찾는 게 우리 일이다.','determined']]},
 'after:21:promise':{actors:['eric','aren','lia'],lines:[['aren','"쉬게 해 드리겠습니다." 약속했다. 언제가 될지는 모르지만.','determined'],
  ['lia','약속을 지키려면 결계를 대신할 길이 있어야 해요. 그 길을 꼭 찾을게요.','determined'],['eric','군단의 약속이다. 다 같이 진다.','determined']]},
 'after:21:aren':{actors:['eric','aren','lia'],lines:[['aren','에릭. 나는 그 밤 이후로 모든 걸 혼자 정해 왔다. 군단을 세울 때도, 관문을 넘을 때도.','concerned'],
  ['eric','그 무게를 혼자 지셨죠.'],['aren','폐하를 보니 알겠다. 혼자 붙들면 결국 이름까지 내주게 된다. 이제는 함께 정하겠다.','determined'],
  ['lia','아렌의 군령… 「함께 정한다」. 전투 중에 한 번, 행동을 마친 장수가 다시 움직일 수 있어요.','determined']]},
 'pre:22':{actors:['aren','eric','lia','elder','kai'],lines:[['elder','하층가 광장에 사람들이 모였소. 기록과 계획서와 폐하의 말을 듣겠다고.','concerned'],
  ['lia','전령 세 분이 단에 올라 네 번씩 읽어요. 재상부가 막으러 올 거예요.','concerned'],
  ['kai','정상에서 우리 등을 친 깃발도 올 거야. 그 깃발은 진실이 퍼지면 잃을 게 많거든.','concerned'],
  ['aren','동맹이 된 깃발이 있다면 사람을 보내 줄 것이다. 신뢰는 그럴 때 쓰는 거다.'],['eric','전령을 지킨다. 끝까지 읽게 한다.','determined']]},
 'after:22':{actors:['aren','eric','lia','sain','kai'],lines:[['lia','사람들이 다 들었어요. 잿빛 밤의 기록, 통제된 전쟁, 그리고 폐하의 말까지.','determined'],
  ['kai','광장이 한참 조용했어. 그다음엔… 다들 서로 얼굴을 봤어.','concerned'],
  ['sain','이제 이 진실과 결계를 누구에게 맡길지 정해야 해요.'],
  ['aren','폐하께 맡길 수도, 세 깃발의 회의에 맡길 수도, 모든 사람의 서약에 맡길 수도 있다. 어느 길도 값이 없지는 않다.'],
  ['eric','함께 정하자. 아렌이 말한 대로.','determined']]},
 'after:22:king':{actors:['eric','aren','lia'],lines:[['aren','폐하께 맡기기로 했다. 왕관이 다시 서면 사람들은 기댈 곳을 얻는다.','determined'],
  ['lia','대신 폐하가 계속 결계를 붙드셔야 해요. 쉬실 날이 더 멀어질지도 몰라요.','sad'],['eric','그 무게를 폐하 혼자 지게 두지는 않는다.','determined']]},
 'after:22:council':{actors:['eric','aren','lia'],lines:[['aren','세 깃발의 회의에 맡기기로 했다. 셋이 함께 정하면 누구도 혼자 이 땅을 쥐지 못한다.','determined'],
  ['lia','대신 회의는 느려요. 셋이 서로를 믿지 못하면 결계는 그사이에 약해질 거예요.','concerned'],['eric','그 회의가 서도록 군단이 곁에 선다.','determined']]},
 'after:22:oath':{actors:['eric','aren','lia'],lines:[['aren','모든 사람의 서약에 맡기기로 했다. 처음의 수호자들처럼, 강요 없이.','determined'],
  ['lia','대신 모두가 서약할 거라는 보장은 없어요. 결계가 설지 말지는 사람들에게 달렸어요.','concerned'],['eric','그래도 사람들이 스스로 고르게 하자.','determined']]},
 'after:22:end':{actors:['eric','aren','lia'],lines:[['lia','벨라드는 왕관의 심장으로 물러났어요. 그곳에서 마지막 의식을 준비하고 있을 거예요.','concerned'],
  ['aren','ACT III는 여기까지다. 진실은 사람들에게 닿았다. 남은 건 그 진실로 무엇을 할지다.'],
  ['eric','ACT IV에서 끝을 본다. 그때까지 군단을 정비하자.','determined']]}
};
export const ADVISOR_V093={
 21:[['lia','에릭, 궁 아래 왕관의 심장이에요. 국왕이 옥좌 단에 결계로 묶여 계세요. 움직이지 못하세요.','concerned'],['eric','조건은?'],
  ['lia','고정석 넷을 모두 깨거나 TURN 12가 끝날 때까지 국왕을 지키면 돼요. 국왕이 쓰러지면 실패예요. 고정석은 에릭·테아·다리오·이네스는 한 번에, 다른 장수는 두 번에 깨요.','concerned'],
  ['lia','결계가 맥동해요. 홀수 턴은 바깥 고리(국왕에게서 5–6칸), 짝수 턴은 안쪽 고리(2–3칸) — 그 칸에서 턴을 끝내면 MP가 3 빠져요. 고정석을 깰 때마다 국왕 HP가 10 돌아와요.','determined'],['eric','옥좌 곁과 고정석, 둘로 나눈다.','determined']],
 22:[['lia','에릭, 하층가 광장이에요. 전령 세 분이 단에서 TURN 2부터 한 턴에 한 번씩, 네 번 읽어요.','concerned'],['eric','막는 건?'],
  ['lia','지난 턴 시작 뒤에 다친 전령은 그 턴을 읽지 못해요. 전령 두 분이 쓰러지면 실패예요. 쓰러진 전령의 단에 장수가 서면 대신 읽어요.','concerned'],
  ['lia','재상부는 북쪽 성문, 배신한 깃발은 동서 길로 와요. 신뢰가 「동맹」인 깃발은 TURN 2에 남쪽에서 기사를 보내 줘요. TURN 12 안에 세 낭독을 마쳐야 해요.','determined'],['eric','전령 곁에 붙는다.','determined']]
};
export const ADVISOR_AFTER_V093={
 20:[['lia','에릭, 끈의 주인을 찾았어요. 카이도 각성의 시련을 치를 수 있어요.'],['eric','다음 일은?'],['lia','왕관의 심장이요. 궁 아래에서 재상부가 계승 의식을 끝내려 해요.','concerned'],['eric','준비하자.','determined']],
 21:[['lia','에릭, 국왕을 지켰어요. 아렌의 군령 「함께 정한다」도 열렸어요.','determined'],['eric','다음은?'],['lia','하층가 광장에서 진실을 읽어요. 세 전령을 지켜야 해요.','concerned'],['eric','준비하자.','determined']],
 22:[['lia','에릭, 세 낭독이 끝났어요. ACT III가 여기서 매듭지어져요.','determined'],['eric','다음은?'],['lia','왕관의 심장의 벨라드요. ACT IV는 다음 업데이트에서 이어져요.','concerned'],['eric','그때까지 정비하자.','determined']]
};
const cmd93=s=>s.command?` · 아렌의 군령 「${({hold:'지켜라',advance:'나아가라',leaveNoOne:'한 사람도 두고 가지 않는다'})[s.command]}」`:'';
export const COUNCIL_V093={
 21:s=>({terrain:"Crown's Heart · 궁 아래 석조 바닥 / 기둥(통행 불가) / 옥좌 단(성소 바닥) · 고정석 4 · 국왕 1 (움직이지 못함)",intel:'의식 기사단장 1 (TURN 4까지 단 위) · 의식 기사 4 · 의식사 2 · 회색 망토 2. TURN 3 북쪽 기사 2, TURN 5 양옆 망토 2, TURN 7 기사·의식사.',plan:`옥좌 곁을 지키며 고정석 4개 깨기 · 맥동 고리를 피해 턴 끝내기 · TURN 12까지 버티면 승리${cmd93(s)}`}),
 22:s=>({terrain:'Ash Square · 광장 석조 바닥 / 골목 / 집 / 단 3 (기록·계획서·국왕의 말) · 동서 길과 남북 성문',intel:`재상부 근위대장 1 (TURN 5까지 북쪽) · 의식 기사 2 · 회색 망토 3. TURN 3·5·7 동서 길에서 배신한 깃발, TURN 4·7 북쪽 성문에서 재상부.${(s.missionState?.support||[]).length?' 동맹 깃발의 기사가 TURN 2에 남쪽에서 옵니다.':''}`,plan:`전령 셋 곁에 붙어 다치지 않게 · 쓰러진 전령의 단은 장수가 대신 · TURN 12 안에 세 낭독${cmd93(s)}`})
};
