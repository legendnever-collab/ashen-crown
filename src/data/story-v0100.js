// v0.10.0 ACT IV 「잿빛 왕관」 part 1 「연합」 — M23 전쟁의 끝을 향해, M24 최후의 국경, the awakenings of Ines and Thea (D-099/D-100,
// docs/v0.10.0/ACT4_DESIGN.md §2–§5). Wording PROPOSED. Reveal rule (ACT4_DESIGN §3): why the rite failed, who signed the
// sealing order and what Aren knew are told in M28; here the border's gate only mirrors the Ashen Night, and Aren is silent on it.
const s100=(speaker,text,expression='neutral')=>({speaker,text,expression});
export const STORY_V0100={
 '23:intro':[s100('lia','세 깃발의 지도자가 모두 이 진영에 모였어요. 광장의 낭독 뒤로 처음이에요.','concerned'),
  s100('cassian','철왕관은 더는 다른 깃발을 상대로 칼을 들 이유가 없소. 남은 적은 왕관의 심장에 있지.','determined'),
  s100('leonora','연맹도 같은 생각이에요. 다만 끝낸 뒤의 일은 따로 이야기해야겠지요.'),
  s100('lucien','성화는 결계를 다시 세우는 일에 몸을 보탤 것이오.','determined'),
  s100('kai','…진영 바깥이 너무 조용해. 회색 망토야. 재상부가 회의장을 치러 왔어!','concerned'),
  s100('rk','세 깃발이 한자리에 모였다니, 일을 한 번에 끝낼 수 있겠군. 천막을 거둬라.','determined'),
  s100('eric','지도자들과 천막을 지킨다. 동맹군에게는 「따르라 · 지켜라 · 자유」로 지시할 수 있다.','determined'),
  s100('lia','적이 천막 곁에서 적 턴을 두 번 연달아 마치면 천막을 빼앗겨요. 두 곳을 빼앗기면 회의가 흩어져요. 습격대장을 쓰러뜨리면 습격이 끝나요.','determined')],
 '23:flank':[s100('elina','동서 울타리 쪽으로 회색 망토가 넘어와요! 지도자를 노려요!','concerned'),s100('eric','지도자 곁에 붙어라. 동맹군은 「따르라」로 우리 곁에 모은다.','determined')],
 '23:south':[s100('kai','남쪽 길로 의식 기사 둘. 성화 천막으로 가고 있어.','concerned'),s100('lucien','성화의 천막은 내가 지키겠소. 군단은 걱정 마시오.','determined')],
 '23:siege':[s100('lia','적이 천막 곁에 버티고 있어요! 다음 적 턴이 끝날 때도 곁에 있으면 천막을 빼앗겨요!','concerned'),s100('eric','천막 곁의 적부터 떼어 낸다!','determined')],
 '23:tent:iron':[s100('cassian','철왕관의 천막이…! 회의 문서가 불타고 있소.','concerned'),s100('eric','한 곳은 내줬다. 남은 둘은 지킨다!','determined')],
 '23:tent:free':[s100('leonora','연맹 천막을 빼앗겼어요. 장부와 지도가 거기 있었는데.','concerned'),s100('eric','한 곳은 내줬다. 남은 둘은 지킨다!','determined')],
 '23:tent:flame':[s100('lucien','성화의 천막이 무너졌소. 기도문은 내 머릿속에도 있으니 괜찮소.','concerned'),s100('eric','한 곳은 내줬다. 남은 둘은 지킨다!','determined')],
 '23:tent2':[s100('lia','천막을 하나 더 빼앗기면 회의가 흩어져요!','concerned')],
 '23:captain':[s100('rk','시간이 됐다. 직접 가서 천막을 거둔다.','determined'),s100('aren','습격대장이 북쪽에 나타났다. 저자를 쓰러뜨리면 습격이 끝난다.','determined')],
 '23:captain:down':[s100('rk','…세 깃발이 정말로 한편이 될 줄은… 재상께 그렇게 전해라…','sad'),s100('eric','습격대장이 쓰러졌다. 습격대가 물러난다!','determined')],
 '23:fallen:cassian':[s100('cassian','크윽… 철왕관의 통령이 이렇게 쓰러질 줄이야…','sad'),s100('sain','카시안 통령을 뒤로! 숨은 붙어 있어요!','concerned')],
 '23:fallen:leonora':[s100('leonora','…셈이 틀렸네요. 이번엔 제가 빚을 졌어요…','sad'),s100('sain','레오노라 의장을 뒤로! 제가 볼게요!','concerned')],
 '23:fallen:lucien':[s100('lucien','불꽃이… 잠시 흔들릴 뿐이오…','sad'),s100('sain','루시안 대사제를 뒤로! 아직 괜찮아요!','concerned')],
 '23:end':[s100('cassian','진영은 지켰소. 재상부가 이렇게까지 하는 건 그들도 몰렸다는 뜻이지.','determined'),
  s100('leonora','이번 습격으로 확실해졌어요. 세 깃발이 따로 싸우면 재상부에게 하나씩 먹혀요.'),
  s100('lucien','그러니 마지막 작전은 함께 하되, 누가 앞에서 이끌지는 정해야 하오.'),
  s100('eric','군단과 세 깃발이 함께 정한다.','determined')],
 '24:intro':[s100('lia','결계가… 국경부터 무너지고 있어요. 북쪽에서 재의 조수가 밀려와요.','concerned'),
  s100('elder','에릭! 살아 있었구나. 국경 너머 사람들이 이 관문으로 몰려오고 있다.','concerned'),
  s100('aren','……관문이다.','sad'),
  s100('kai','재 속에서 뭔가 움직여. 짐승이야. 재에 젖어도 멀쩡해.','concerned'),
  s100('lia','재 칸에서 턴을 마치면 최대 HP의 10%를 잃어요. 재는 TURN 2부터 북쪽에서 한 줄씩 내려와요.','determined'),
  s100('eric','피난민을 관문 안으로 들인다. 관문 칸은 비워 둬라.','determined'),
  s100('lia','여섯 명이 들어오면 관문 권양기에서 관문을 닫을 수 있어요. 언제 닫을지는… 에릭이 정해요. 밖에 남은 사람은 밖에 남아요.','concerned')],
 '24:ash':[s100('elina','재가 내려와요! 첫 줄이 덮였어요!','concerned'),s100('eric','재 칸에서 턴을 끝내지 마라. 피난민을 앞으로!','determined')],
 '24:beasts':[s100('kai','양쪽 숲에서 재의 짐승이 더 나와. 피난민 냄새를 맡았어.','concerned'),s100('eric','짐승을 피난민에게서 떼어 낸다!','determined')],
 '24:ash5':[s100('lia','재가 절반을 넘었어요. 이제 관문 바로 앞까지 와요.','concerned')],
 '24:six':[s100('lia','여섯 명이 안으로 들어왔어요! 이제 관문을 닫을 수 있어요.','determined'),
  s100('aren','…서두를 것 없다. 아직 밖에 사람이 있다면.','sad'),s100('eric','언제 닫을지는 내가 정한다. 끝까지 보고 정한다.','determined')],
 '24:lost':[s100('sain','피난민 한 분이 쓰러졌어요…!','sad'),s100('eric','남은 사람을 지킨다. 더는 놓치지 않는다.','determined')],
 '24:lost2':[s100('lia','두 분째예요. 한 분만 더 쓰러지면 국경이 무너져요!','concerned')],
 '24:closed:all':[s100('eric','모두 들어왔다. 관문을 닫는다!','determined'),s100('aren','…밖에 남은 사람이 없다. 그 밤과는 다르다.','sad')],
 '24:closed:left':[s100('eric','관문을 닫는다!','determined'),s100('refugee','기다려요! 아직 밖에…!','concerned'),
  s100('aren','……','sad'),s100('sain','에릭… 밖에 아직 사람이 있었어요.','sad')],
 '24:end':[s100('lia','관문이 닫혔어요. 재의 조수가 관문 앞에서 멈췄어요.','concerned'),
  s100('aren','그 밤에도 관문이 닫혔다. 나는… 그 관문에 있었다.','sad'),
  s100('eric','아렌?','concerned'),s100('aren','지금은 아니다. 왕관의 심장 앞에서 말하겠다. 약속하마.','sad')],
 // trials (awakening)
 'skirmish:115:intro':[s100('aren','이네스, 돌격 교관 넷과 궁수 둘이 훈련병에게 몰려온다. 세인이 곁에 있다.'),s100('ines','이름을 부르는 자리를 지키는 것. 그게 제 성소예요. 문을 열게요.','determined')],
 'skirmish:116:intro':[s100('aren','테아, 방진 너머에 지휘 교관 둘이 있다. 다리오가 따라간다.'),s100('thea','방진은 부수라고 있는 거예요. 똑바로 뚫고 지나갈게요.','determined')],
 'awaken:ines':[s100('aren','이네스. 새벽 성기사. 이름을 부르는 자리를 문처럼 지키는 자다.'),s100('ines','잊힌 이름들 앞에 섰던 것처럼, 이제는 살아 있는 이름들 앞에 설게요.','determined')],
 'awaken:thea':[s100('aren','테아. 흑철 기병대장. 앞을 막는 것이 무엇이든 꿰뚫고 지나가는 자다.'),s100('thea','철왕관의 창이었던 걸 잊진 않아요. 이제는 군단의 창으로 앞장설게요.','determined')]
};
// Staged camp scenes (M23 at the alliance camp, M24 in the Ashen Village by the last border).
export const FRONTIER_V0100={
 'pre:23':{actors:['aren','eric','lia','kai'],lines:[['aren','세 지도자가 오늘 밤 이 진영에 모인다. 카시안, 레오노라, 루시안.'],
  ['kai','재상부가 이 소식을 모를 리 없어. 회의장을 노릴 거야.','concerned'],
  ['lia','지도자들은 호위와 함께 동맹군으로 싸워요. 이번엔 지시를 내릴 수 있어요 — 따르라, 지켜라, 자유.','determined'],
  ['aren','지도자가 쓰러지면 그 깃발의 믿음이 흔들린다. 천막을 빼앗기면 회의가 흩어진다.'],['eric','둘 다 지킨다.','determined']]},
 'after:23':{actors:['aren','eric','lia','sain'],lines:[['lia','연합 회의는 견뎠어요. 재상부의 습격대는 물러났어요.','determined'],
  ['sain','다친 사람이 많아요. 그래도 세 깃발이 같은 천막 아래 모였어요.'],
  ['aren','세 지도자가 묻는다. 왕도로 가는 마지막 작전, 누가 앞에서 이끌지.'],['eric','함께 정하자.','determined']]},
 'after:23:legion':{actors:['eric','aren','lia'],lines:[['aren','군단이 지휘를 맡는다. 세 깃발이 군단의 명령을 따르기로 했다.','determined'],
  ['lia','빨리 움직일 수 있어요. 대신 실패하면 그 책임도 군단이 져요.','concerned'],['eric','그 무게, 군단이 함께 진다.','determined']]},
 'after:23:banners':{actors:['eric','aren','lia'],lines:[['aren','세 깃발이 나눠 맡는다. 성문은 철왕관, 성벽은 연맹, 결계는 성화. 군단은 그 사이를 잇는다.','determined'],
  ['lia','누구도 혼자 이끌지 않아요. 대신 서로를 믿지 못하면 결정이 늦어져요.','concerned'],['eric','믿게 만들면 된다. 우리가 곁에 선다.','determined']]},
 'pre:24':{actors:['aren','eric','lia','elder','sain'],lines:[['lia','국경에서 전갈이 왔어요. 결계가 국경부터 무너지고 있어요. 잿빛 마을 근처예요.','concerned'],
  ['elder','에릭, 오랜만이구나. 마을은 다시 세웠지만… 북쪽 관문 너머로 재가 몰려온다.','concerned'],
  ['sain','관문 밖에 피난민이 여덟 명 있대요. 관문으로 걸어오고 있어요.','concerned'],
  ['aren','…관문을 닫아야 재가 멈춘다. 그리고 닫으면 밖의 사람은 남는다.','sad'],['eric','그러니 닫기 전에 최대한 들인다.','determined']]},
 'after:24:all':{actors:['eric','aren','sain'],lines:[['sain','여덟 분 모두 들어왔어요. 아무도 밖에 남지 않았어요.','determined'],
  ['aren','…그 밤에는 그러지 못했다.','sad'],['eric','아렌. 왕관의 심장 앞에서 말해 준다고 했죠.'],['aren','그래. 약속은 지킨다.','sad']]},
 'after:24:left':{actors:['eric','aren','sain'],lines:[['sain','관문 밖에 남은 분들이 있어요. 재가 걷히면 바로 찾으러 갈게요.','sad'],
  ['eric','닫은 건 나다. 그 이름들은 내가 기억한다.','sad'],['aren','…그 밤의 관문 앞에서 나도 같은 말을 했다. 왕관의 심장 앞에서 전부 말하겠다.','sad']]},
 'after:24':{actors:['aren','eric','lia','elder'],lines:[['elder','관문이 버텼구나. 마을 사람들이 너희 이름을 부르며 고마워한다.'],
  ['lia','결계가 국경부터 무너지기 시작했어요. 국왕이 홀로 붙드는 것도 오래 못 가요.','concerned'],
  ['aren','남은 길은 왕도다. 세 깃발의 땅을 지나 왕관의 심장으로.','determined'],['eric','끝까지 함께 간다.','determined']]}
};
export const ADVISOR_V0100={
 23:[['lia','에릭, 연합 진영이에요. 세 지도자와 호위가 동맹군으로 함께 싸워요. 동맹 유닛을 누르면 지시를 내릴 수 있어요.','concerned'],['eric','조건은?'],
  ['lia','재상부 습격대장을 쓰러뜨리거나 TURN 10까지 버티면 돼요. 적이 천막 곁에서 적 턴을 두 번 연달아 마치면 천막을 빼앗겨요. 두 곳을 빼앗기면 실패예요.','concerned'],
  ['lia','지도자가 쓰러지면 그 깃발의 신뢰가 1 떨어져요. 전투는 계속돼요. 습격대장은 TURN 4에 북쪽에서 기사 둘과 함께 나타나요.','determined'],['eric','천막 셋과 지도자 셋, 다 지킨다.','determined']],
 24:[['lia','에릭, 최후의 국경이에요. 피난민 여덟 명이 턴마다 2칸씩 관문으로 걸어와요. 관문 칸을 비워 두세요.','concerned'],['eric','재는?'],
  ['lia','TURN 2부터 북쪽에서 한 줄씩 덮여요. 재 칸에서 턴을 마치면 최대 HP의 10%를 잃어요. 재의 짐승은 재 속에서도 멀쩡해요.','concerned'],
  ['lia','여섯 명이 들어오면 관문 권양기 곁에서 관문을 닫을 수 있어요. TURN 10이 끝나면 저절로 닫혀요. 피난민 세 명이 쓰러지면 실패예요.','determined'],['eric','닫는 때는 내가 정한다.','determined']]
};
export const ADVISOR_AFTER_V0100={
 23:[['lia','에릭, 연합 회의를 지켰어요. 이네스도 각성의 시련을 치를 수 있어요.','determined'],['eric','다음은?'],['lia','국경이요. 결계가 국경부터 무너지고 있어요. 잿빛 마을 근처예요.','concerned'],['eric','준비하자.','determined']],
 24:[['lia','에릭, 관문을 닫았어요. 테아도 각성의 시련을 치를 수 있어요.','determined'],['eric','다음은?'],['lia','세 깃발의 땅이요. ACT IV는 다음 업데이트에서 이어져요.','concerned'],['eric','그때까지 정비하자.','determined']]
};
const cmd100=s=>s.command?` · 아렌의 군령 「${({hold:'지켜라',advance:'나아가라',leaveNoOne:'한 사람도 두고 가지 않는다'})[s.command]}」`:'';
export const COUNCIL_V0100={
 23:s=>({terrain:'Alliance Camp · 진영 풀밭 / 길 / 숲 가장자리 · 회의 천막 3 (철왕관·연맹·성화)',intel:'의식 기사 2 · 회색 망토 2 · 석궁수 1. TURN 2 동서 망토 2, TURN 3 남쪽 기사 2, TURN 4 북쪽 습격대장과 기사 2, TURN 5 망토 2·남쪽 기사 1, TURN 7 기사 2·석궁수 1.',plan:`천막 곁의 적을 떼어 내기 · 지도자에게 「따르라 · 지켜라」 · 습격대장 격파 또는 TURN 10까지${cmd100(s)}`}),
 24:s=>({terrain:'The Last Border · 국경 풀밭 / 숲 / 성벽과 관문 (2칸) · 관문 안 마을 · 관문 권양기',intel:'재의 짐승 3. TURN 2·4·6·8 북쪽에서 짐승 2–3. 재의 조수 TURN 2부터 북쪽 한 줄씩.',plan:`피난민 길을 열기 · 관문 칸 비우기 · 여섯 명이 들면 닫을 때를 정하기${cmd100(s)}`})
};
