// v0.7.0 ACT II part 2 M11–M12 dialogue (D-068). Wording PROPOSED within the approved direction: the Order of the Sacred
// Flame is neither good nor evil — it feeds anyone who comes (merit) but shelters and heals only those who swear its oath,
// and a monastery burns records to guard its doctrine (cost). Lucien is not shown behind the burning (whether it was the
// abbot's own zeal or the Order's way stays OPEN). The ledger cord reaches the Order's relief supplies too; no name is
// attached. Sain's past is told up to why she left: she gave medicine to people who had not sworn the oath and was
// excommunicated. Lia's teacher appears only as a hand in the margins (identity OPEN). Lines answer the line before (D-062).
const s70=(speaker,text,expression='neutral')=>({speaker,text,expression});
export const STORY_V070={
 '11:intro':[s70('ines_warden','군단 여러분, 행렬은 해가 지기 전에 떠났어야 했어요. 이 골짜기는 밤이 되면 지키는 힘이 약해져요.','concerned'),s70('eric','약해지면 뭐가 오지?'),
  s70('ines_warden','재 약탈단요. 어둠 속에서 순례자를 노려요. 길가 화로에 불을 켜면 그들도 쉽게 다가오지 못해요.','determined'),s70('lia','화로는 셋이에요. 빛 안에서는 우리 손이 정확해지고, 순례자분들도 두 걸음씩 걸을 수 있어요.'),
  s70('p1','…세인? 구호원의 세인 아니냐.','concerned'),s70('sain','…노사제님. 지금은 길부터 가요. 이야기는 성소에서 해요.','sad'),
  s70('eric','좋다. 화로를 켜고, 순례자는 길 위로. 어둠 속으로 깊이 쫓아가지는 마라.','determined')],
 '11:turn2':[s70('lia','순례자분들이 걷기 시작했어요! 길 위에 서 있으면 멈추니까, 길 옆을 지켜 주세요.'),s70('kai','숲 속에서 뭔가 움직여. 빛 밖에서 싸우면 우리도 잘 안 맞아.','concerned'),s70('eric','그럼 빛을 넓힌다. 화로부터.')],
 '11:lit':[s70('ines_warden','불이 켜졌어요! 빛 안에서는 순례자들이 두 걸음씩 걸을 수 있어요.','determined'),s70('eric','다음 화로도 켠다. 길 전체를 밝히자.')],
 '11:arrive':[s70('ines_warden','한 분이 성소 문을 넘었어요! 성소 안은 안전해요.','determined'),s70('eric','남은 사람도 모두 들인다. 끝까지 곁에 붙어라.')],
 '11:lost':[s70('sain','순례자 한 분이… 쓰러졌어요.','sad'),s70('eric','더는 안 된다. 남은 사람 곁을 떠나지 마!','determined')],
 '11:wave':[s70('elina','아래쪽 양 끝에서 둘! 행렬 꼬리를 노려요.','concerned'),s70('eric','뒤는 우리가 막는다. 앞사람은 계속 걸으시오!')],
 '11:flank':[s70('kai','양옆 숲에서 셋! 하나는 활이야.','concerned'),s70('lia','빛 밖에서 쏘면 잘 안 맞아요. 빛 안으로 끌어내요!')],
 '11:captain':[s70('elina','북동쪽 숲에 두목이에요! 성소 문 앞을 노려요!','concerned'),s70('ines_warden','성소 문은 제가 지킬게요. 군단은 행렬을 끝까지 지켜 주세요!','determined')],
 '11:encounter':[s70('boss','성화의 개들이 오늘은 칼까지 데려왔군.'),s70('eric','개도 칼도 아니다. 길을 지키러 왔을 뿐이다.','determined')],
 '11:boss':[s70('boss','불빛… 저 불빛만 없었어도…','sad'),s70('elina','어둠에 숨는 사람은 결국 빛 앞에서 멈춰요.')],
 '11:end':[s70('lucien','성소에 온 것을 환영하오, 재의 군단. 나는 루시안, 성화를 지키는 사람이오.'),s70('aren','아렌 발터요. 우리 피난민도 이 길을 따라 여기까지 왔소.'),
  s70('lucien','성화는 누구도 내치지 않소. 배고픈 이에게는 빵을, 다친 이에게는 약을 나누오.'),s70('sain','…맹세한 사람에게는요.','sad'),s70('lucien','세인. 돌아왔구려.','concerned')],
 '12:intro':[s70('kai','경비가 일곱. 바라보는 방향이 정해져 있고, 적 턴마다 돌아서.'),s70('lia','붉은 칸이 감시 칸이에요. 적 턴이 시작될 때 거기 있으면 들켜요.'),
  s70('eric','한 번은 의심, 두 번이면 종이 울린다고 했지.'),s70('kai','그리고 경비를 한 번에 못 쓰러뜨려도 소리가 나. 뒤에서, 한 번에.','determined'),
  s70('sain','…기록 보관소는 북서쪽이에요. 교단 명부도 거기 있을 거예요.','sad'),s70('eric','장부 기록이 먼저다. 조용히 간다.','determined')],
 '12:turn2':[s70('lia','경비가 돌아섰어요. 다음에 볼 방향을 확인하고 움직여요.'),s70('eric','서두르지 말자. 한 칸씩.')],
 '12:suspicion':[s70('kai','들켰어. 아직 종은 아니야. 대신 감시가 한 칸 더 길어졌어.','concerned'),s70('eric','한 번 더 들키면 끝이다. 그늘로 붙어라.')],
 '12:alarm':[s70('boss','종을 울려라! 이단의 무리가 기록을 노린다! 보관소에 불을 준비하라!','determined'),s70('lia','3턴 뒤에 기록을 태운대요! 장부 기록부터요!','concerned'),s70('eric','원장을 막는다. 서둘러!','determined')],
 '12:dorm':[s70('elina','서쪽 숙소에서 경비 셋이 나와요!','concerned')],
 '12:silent':[s70('kai','…조용히. 이렇게 하는 거야.')],
 '12:burn-warn':[s70('lia','원장이 보관소에 불을 붙이려 해요! 이번 턴이 마지막이에요!','concerned'),s70('eric','장부 기록만은 넘기지 마라!','determined')],
 '12:burn':[s70('sain','기록이… 타고 있어요.','sad'),s70('eric','남은 것만이라도 지킨다!','determined')],
 '12:search:ledger':[s70('lia','장부 기록이에요! 교단 구호 물자도 성채 장부와 같은 창고 번호로 들어왔어요. 묶은 끈 매듭까지 같아요.','determined'),
  s70('kai','철왕관, 연맹, 이제 교단까지. 세 깃발의 물자에 다 같은 손이 닿아 있었네.','concerned'),s70('eric','이름은?'),s70('lia','없어요. 이번에도 없어요.','sad')],
 '12:search:seal':[s70('eric','봉인술 연구 기록이다. 리아가 보면 알 거다.'),s70('lia','…챙겨 주세요. 지금은 읽을 시간이 없어요.')],
 '12:search:seal:lia':[s70('lia','이 필체… 스승님 거예요. 여백에 남긴 작은 표시까지 똑같아요.','concerned'),s70('eric','스승님이 이 수도원에 있었다는 건가?'),s70('lia','모르겠어요. 날짜도 이름도 지워져 있어요.','sad')],
 '12:search:roster':[s70('sain','교단 명부예요. …여기, 제 이름이 있어요. "파문."','sad'),s70('eric','세인…'),s70('sain','끝나고 말할게요. 약속해요.','determined')],
 '12:encounter':[s70('boss','군단이라. 교단의 문을 부수고 들어와 무엇을 지키겠다는 거냐.'),s70('eric','기록을요. 태워서 지킬 수 있는 건 없습니다.','determined'),s70('boss','무지한 손에 들어간 기록은 독이 된다. 성화는 믿음으로 지켜진다!')],
 '12:capture':[s70('boss','…불을 멈춰라. 더는 태우지 마라.','sad'),s70('lia','원장님, 왜 기록을 태우려 하셨죠?'),s70('boss','누군가 이 기록을 찾고 있었다. 그 손에 넘어가느니 재가 낫다고… 생각했다.','sad')],
 '12:boss':[s70('boss','성화여… 기록을… 지켜…','sad'),s70('sain','…지키려던 방식이 틀렸을 뿐이에요.','sad')],
 '12:end':[s70('lucien','수도원의 불이 꺼졌다는 소식을 들었소. 고맙소.'),s70('eric','원장은 기록을 노리는 누군가가 있었다고 했습니다.'),s70('lucien','…그 누군가가 누구인지, 나도 알고 싶소.','concerned'),s70('aren','기록은 지금 군단이 가지고 있소. 어떻게 할지는 야영지에서 정하겠소.')]
};
// Staged camp scenes: the pilgrim village (M11–M12 preparation, after M11) and the refugee camp (after M12).
export const FRONTIER_V070={
 'pre:11':{actors:['aren','eric','lia','sain','ines'],lines:[['ines','재의 군단이죠? 벨마르에서 소식 들었어요. 저는 이네스, 성화 교단의 순례 수호자예요.'],['aren','아렌 발터요. 피난민이 머물 곳을 찾아 남쪽까지 왔소.'],
  ['ines','성화는 누구에게나 빵을 나눠요. 오늘 밤 행렬이 골짜기를 지나 성소로 올라가요. 피난민분들도 함께 가실 수 있어요.'],['eric','밤에? 위험하지 않나?'],['ines','대성당 문은 밤 기도 때만 열려요. 규칙이에요. …저도 가끔은 그 규칙이 무거워요.','concerned'],
  ['sain','이네스 씨, 노사제님은 아직 행렬을 이끄시나요?','concerned'],['ines','노사제님을 아세요? 오늘도 맨 앞에 서세요.'],['eric','좋다. 군단이 행렬을 지키겠다.','determined']]},
 'after:11':{actors:['aren','eric','lia','sain','lucien','ines'],lines:[['lucien','행렬을 지켜 주어 고맙소. 순례자들이 새벽 기도를 올리고 있소.'],['aren','우리 피난민은 이제 어떻게 되오?'],
  ['lucien','성화는 누구도 굶기지 않소. 다만 성소 안에서 지내려면 성화의 맹세를 해야 하오. 서로를 지키겠다는 약속이오.'],['lia','맹세하지 않으면요?'],
  ['lucien','성소 밖 천막에서 지내오. 빵은 똑같이 나누오. 약은… 맹세한 이에게 먼저 가오.','concerned'],['sain','먼저가 아니라, 맹세한 사람에게만이었죠. 제가 떠날 때는요.','sad'],
  ['lucien','세인. 그 규칙은 여전하오. 그래서 그대가 떠났지.','sad'],['eric','피난민과 이야기해 보겠습니다. 맹세는 그들이 정할 일입니다.','determined']]},
 'after:11:sain':{actors:['eric','sain'],lines:[['eric','세인, 노사제님이 널 알아보더군.'],['sain','저는 성화 교단의 구호사였어요. 대성당 아래 구호원에서 일했죠.'],['eric','그런데 왜 떠났지?'],
  ['sain','그 이야긴… 조금만 더 기다려 줄래요? 아직 제 입으로 말하기가 어려워요.','sad'],['eric','기다리지. 네가 말하고 싶을 때.']]},
 'after:11:oath':{actors:['aren','eric','sain','lucien'],lines:[['lucien','피난민 대부분이 맹세를 했소. 오늘부터 성소 안에서 지내오.'],['aren','따뜻한 곳에서 자게 되었군. 고맙소.'],
  ['sain','…맹세하지 못한 노인 두 분은 밖에 남았어요.','concerned'],['eric','군단 천막에 모시자. 그분들은 우리가 돌본다.','determined']]},
 'after:11:legion':{actors:['aren','eric','lucien','ines'],lines:[['eric','피난민은 군단이 계속 돌보겠습니다. 맹세를 강요하지는 않겠습니다.','determined'],['lucien','그것도 하나의 길이오. 빵은 성소 밖에도 나누겠소.'],
  ['ines','군단 천막 옆에 순례자 천막을 붙여 드릴게요. 밤에는 추워요.'],['aren','고맙소, 이네스.']]},
 'pre:12':{actors:['aren','eric','lia','kai','ines','lucien'],lines:[['lucien','부탁이 하나 있소. 남쪽 계곡의 침묵의 수도원이 연락을 끊었소. 원장이 기록 보관소를 닫고 "이단 기록"을 태운다는 소문이 들리오.'],
  ['lia','기록을 태운다고요? 어떤 기록요?'],['lucien','교단이 백 년 동안 모은 기록이오. 결계를 연구한 글도, 교단을 떠난 이들의 이름도.','concerned'],
  ['kai','구호 물자 장부도 있겠지. 교단 창고에서 성채 장부랑 같은 매듭을 봤어.','concerned'],['eric','원장을 멈추고 기록을 지켜 달라는 겁니까?'],
  ['lucien','원장은 교단의 형제요. 그가 왜 문을 닫았는지 알고 싶소. 하지만 기록이 타는 것은 원치 않소.'],
  ['ines','책을 태우는 건 성화의 뜻이 아니에요. …하지만 수호자는 형제의 문을 부술 수 없어요.','concerned'],['aren','조용히 들어가라. 수도원과 전쟁을 하러 가는 게 아니다.','determined']]},
 'after:12':{actors:['aren','eric','lia','kai','lucien'],lines:[['lucien','수도원 기록은 교단의 것이오. 돌려주길 바라오. 다만 강요하지는 않겠소.'],['lia','장부 기록은 우리가 쫓아온 실마리예요. 봉인술 연구도요.','concerned'],
  ['kai','돌려주든, 가져가든, 군단이 정하자. 어느 쪽이든 누군가는 서운하겠지만.'],['aren','에릭, 네가 정해라. 군단이 함께 책임진다.']]},
 'after:12:sain':{actors:['eric','sain'],lines:[['sain','약속대로 말할게요. 구호원에는 규칙이 있었어요. 약은 맹세한 사람에게만.'],['eric','그 규칙을 어겼나?'],
  ['sain','열병이 돈 겨울이었어요. 맹세하지 않은 가족이 문밖에서 아이를 안고 있었어요. 저는 약을 줬어요. 한 번이 아니라, 겨울 내내요.','sad'],['eric','그래서 파문당했군.'],
  ['sain','네. 후회하지 않아요. 그렇다고 교단을 미워하지도 않아요. 그 빵으로 살아난 사람도 많으니까요.','determined'],['eric','둘 다 사실이겠지. 그걸 아는 네가 군단에 있어서 다행이다.']]},
 'after:12:return':{actors:['eric','lia','lucien'],lines:[['lucien','기록이 돌아왔소. 교단은 군단을 잊지 않겠소.'],['lia','…장부 기록은 제가 다 외웠어요. 그건 괜찮죠?','concerned'],['lucien','기억까지 거둘 수는 없지.'],['eric','그 기억으로 끈의 주인을 찾겠습니다.','determined']]},
 'after:12:take':{actors:['aren','eric','lucien'],lines:[['lucien','군단이 기록을 가져간다면… 교단은 그것을 기억하겠소.','concerned'],['aren','숨기려는 게 아니오. 다시는 태워지지 않게 하려는 거요.'],['lucien','그 마음은 알겠소. 하지만 형제들은 그렇게 보지 않을 거요.','sad'],['eric','언젠가 돌려드리겠습니다. 끈의 주인을 찾은 뒤에.']]},
 'after:12:copy':{actors:['eric','lia','kai','lucien'],lines:[['kai','밤새 다 베꼈어. 원본은 아침에 돌려줬고.'],['lia','봉인술 연구도요. 필체까지 그대로 옮겼어요.','determined'],['lucien','…기록이 하나도 빠짐없이 돌아왔군. 고맙소.'],['eric','기록은 태우지도, 숨기지도 않을 겁니다.']]},
 'after:12:ines:joined':{actors:['aren','eric','sain','ines'],lines:[['ines','군단장님, 순례 수호자 이네스, 군단과 함께 가고 싶어요.'],['aren','교단은 허락했소?'],
  ['ines','대사제님이 말씀하셨어요. "지키는 이의 자리는 지켜야 할 사람 곁이다." 지금 그건 군단이에요.','determined'],['sain','…이네스, 나는 교단을 떠난 사람이에요. 괜찮겠어요?','concerned'],
  ['ines','떠난 사람에게도 돌아올 길은 있어야 해요. 저는 그 길을 지키는 사람이에요.'],['eric','환영한다, 이네스.']]},
 'after:12:ines:parted':{actors:['eric','ines'],lines:[['ines','저는 순례자 마을에 남을게요. 교단이 군단을 믿게 되면, 그때 다시 만나요.','concerned'],['eric','언젠가 같은 길 위에서 보자.']]}
};
export const ADVISOR_V070={
 11:[['lia','에릭, 남쪽 골짜기 지도예요. 길은 하나, 맨 위가 성소 입구예요.'],['eric','순례자는 몇 명이지?'],['lia','넷이에요. TURN 2부터 길을 따라 걸어요. 빛 안에서는 2칸, 어둠에서는 1칸이고, 적이 곁에 붙거나 우리가 길을 막으면 멈춰요.'],
  ['eric','화로는?'],['lia','길가에 셋. 곁에서 조사하면 불이 켜지고 반경 2칸이 밝아져요. 빛 안에서는 우리 명중이 오르고, 빛 밖의 적을 노리면 명중이 떨어져요.','determined'],
  ['lia','셋이 성소에 들어가거나 TURN 12 새벽까지 버티면 돼요. 두 명을 잃으면 실패예요. TURN 3, 5, 7에 약탈단이 더 와요.'],['eric','길 옆을 지키고, 화로부터 켠다.','determined']],
 12:[['lia','에릭, 침묵의 수도원 지도예요. 남쪽 정문, 가운데 안뜰과 회랑, 북쪽에 방이 셋이에요.'],['eric','기록은 어디 있지?'],['lia','북서쪽 기록 보관소에 장부 기록과 원장, 가운데 예배실에 교단 명부, 북동쪽 필사실에 봉인술 연구예요.'],
  ['lia','경비 일곱은 붉은 칸을 감시하고 적 턴마다 돌아서요. 두 번 들키거나, 경비를 한 번에 못 쓰러뜨리면 종이 울려요.','concerned'],
  ['eric','종이 울리면?'],['lia','경비가 모두 움직이고 숙소에서 셋이 더 나와요. 그리고 3턴 뒤에 원장이 남은 기록을 태워요. 장부 기록이 타면 실패예요.'],['eric','조용히, 한 번에. 장부 기록과 원장이다.','determined']]
};
export const COUNCIL_V070={
 11:()=>({terrain:'Night Valley · 길(순례자만 걷는 길) / 평지 / 숲(이동 2) / 산길 / 성소 바닥(맨 위, 턴 시작 HP 회복)',intel:'재 약탈단 4 · 궁수 2가 양옆 숲에. TURN 3 아래쪽 2, TURN 5 양옆 숲 3, TURN 7 북동쪽 숲에 두목 + 2. 동맹: 이네스(곁의 아군 피해 −2)와 성화 기사 2.',plan:'길가 화로 3개를 켜서(인접 조사) 길을 밝히세요. 빛 안의 순례자는 2칸씩 걷고 HP +5. 길 위에 서지 말고 길 옆을 지키세요. 순례자 3명 성소 도착 또는 TURN 12 새벽까지 버팀. 2명을 잃으면 실패.'}),
 12:()=>({terrain:'Silent Monastery · 회랑·방(성채 바닥) / 안뜰(평지) / 벽 / 남쪽 정문',intel:'수도원 경비 7(조용한 동안 제자리에서 감시, 적 턴마다 방향 전환) · 침묵의 원장(기록 보관소). 경보가 울리면 서쪽 숙소에서 경비 3, 3턴 뒤 소각.',plan:'붉은 감시 칸 밖으로 움직이고, 경비는 감시 밖에서 한 번에 쓰러뜨리세요(기습: 명중 +30, 피해 +5). 장부 기록을 조사하고 원장을 격파하거나 HP 절반 이하에서 생포하면 승리. 리아와 카이가 모두 기록을 조사하면 야영지에서 "베끼고 돌려주기"를 고를 수 있습니다.'})
};
