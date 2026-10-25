// v0.6 ACT II M07–M08 dialogue (Phase D). Wording PROPOSED within approved direction (D-055): no faction is drawn as
// simply good or evil — the Iron Crown feeds and houses the refugees (merit) and executes deserters (cost); the royal
// command's identity stays OPEN (Cassian neither confirms nor denies); Sain's past is one hint only. Lines answer the
// line before (D-062).
const s6=(speaker,text,expression='neutral')=>({speaker,text,expression});
export const STORY_V06={
 '7:intro':[s6('thea','마차는 길을 따라 북쪽 성문으로 갑니다. 적이 붙으면 마차는 멈춰요. 길만 열어 주세요!','determined'),s6('eric','마차 앞은 내가 연다. 다들 길 위는 비워 둬.'),s6('elina','서쪽 숲이랑 동쪽 능선, 둘 다 사람이 숨어 있어요. 눈 위 발자국이 너무 많아요.','concerned'),s6('kai','탈영병은 눈길에 익숙해. 우리보다 빨라. 얼음 다리에서 붙잡히면 끝이야.'),s6('lia','세 대 중에 두 대만 성문을 넘으면 돼요! 대장을 생포하면… 왜 이러는지도 들을 수 있고요.'),s6('aren','생포는 현장 판단에 맡긴다. 마차보다 앞서서 무리하진 마라.')],
 '7:turn2':[s6('thea','마차가 움직입니다! 앞을 막지 마세요.'),s6('eric','길 양옆으로 붙어. 마차가 지나갈 자리를 남긴다.','determined')],
 '7:ambush':[s6('kai','뒤쪽 눈밭에서 둘! 마차 꽁무니를 노린다.','concerned'),s6('sain','마차 뒤는 제가 볼게요. 다치신 분은 제 쪽으로 오세요!')],
 '7:gatewave':[s6('elina','성문 앞에도 둘이 내려와요! 길목을 끊으려는 거예요.','concerned'),s6('thea','성문 앞은 제 병사들이 막겠습니다. 군단은 마차 곁을 지켜 주세요!','determined')],
 '7:through':[s6('thea','한 대 들어갔습니다! 성문 안쪽은 안전해요.','determined')],
 '7:encounter':[s6('boss','철왕관의 개들이군. 배급표 한 장에 목숨을 파는 놈들!'),s6('eric','우린 수송대를 지키러 왔다. 너희를 굶기러 온 게 아니야.','determined')],
 '7:capture':[s6('boss','…죽이든 넘기든 마음대로 해. 어차피 저 성에선 탈영은 사형이야.','sad'),s6('sain','사형이요…?','concerned'),s6('eric','결정은 돌아가서 다 같이 한다. 지금은 아무도 더 죽지 않게 하자.')],
 '7:boss':[s6('boss','우린 그냥… 굶어 죽기 싫었을 뿐이야.','sad'),s6('elina','그 마음은 알아요. 그래도 마차를 습격한 건 당신이에요.','concerned')],
 '7:end':[s6('thea','수송대가 성문을 넘었습니다. 이 보급이면 피난민 배급도 늘릴 수 있어요. 고맙습니다, 재의 군단.'),s6('aren','약속을 지켜 줘서 고맙다. …남은 건 습격한 사람들의 처분이군.'),s6('lia','이 땅의 법이 그 사람들을 어떻게 다루는지… 저도 보고 싶어요.','concerned')],
 '8:order':[s6('baldrick','사령부 명령이다. TURN 6이 되면 후위 마을은 포기하고, 전 병력은 협곡을 사수한다.','determined'),s6('sain','마을 사람들은요? 아직 세 분이 남아 있어요.','concerned'),s6('baldrick','스스로 피하게 둔다. 병력을 나누면 협곡이 뚫린다. 그러면 더 많은 사람이 죽는다.'),s6('elina','틀린 계산은 아니네요. …그래서 더 싫은 거예요.','concerned'),s6('aren','에릭, 네 생각은?')],
 '8:order:hold':[s6('eric','명령을 따르겠습니다. 협곡을 지키는 게 마을을 지키는 길이라면.','determined'),s6('baldrick','현명하군. …마을 사람들이 스스로 길을 찾길 바라지.'),s6('sain','…기도할게요.','sad')],
 '8:order:rescue':[s6('eric','구출조를 보내겠습니다. 협곡은 지키고, 마을 사람도 데려옵니다.','determined'),s6('baldrick','명령에 없는 일이다. …막지는 않겠다. 대신 협곡이 뚫리면 그 책임도 군단이 진다.','concerned'),s6('aren','그 책임, 같이 지겠소.','determined')],
 '8:intro':[s6('baldrick','용병단이 북쪽 입구로 들어온다. 위쪽 목은 내 병사들이 막는다!','determined'),s6('eric','그럼 우리는 그 아래를 맡는다. 다들 대열에 붙어.'),s6('kai','양쪽 벼랑 위에 낙석 장치가 있어. 적이 위쪽 목에 몰렸을 때 떨어뜨리면 한 번에 쓸어버릴 수 있어.'),s6('lia','용병단장은 TURN 7에 와요. 그를 쓰러뜨리거나 TURN 10까지 버티면 이겨요! 북쪽 적이 열두 번째 줄 아래로 넘어오면… 협곡이 뚫린 거예요.','determined')],
 '8:turn2':[s6('elina','궁수가 벼랑 그림자에 숨어 있어요. 사거리 조심하세요.','concerned'),s6('sain','다치면 바로 물러나세요. 협곡은 길어요.')],
 '8:wave':[s6('kai','북쪽에서 2진이 온다! 창병이 더 많아.','concerned'),s6('baldrick','대열 유지! 한 칸도 내주지 마라!','determined')],
 '8:captain':[s6('elina','협곡 입구에 깃발이 올라와요. 용병단장이에요!','concerned'),s6('baldrick','서두르지 마라. 놈은 입구에서 버티다 내려온다. 그때가 기회다.')],
 '8:rockfall':[s6('lia','낙석이에요! 위쪽 목이 바위에 덮였어요!','determined'),s6('baldrick','좋다. 그 틈에 밀어낸다!')],
 '8:village:hold':[s6('sain','마을 쪽에서… 사람들이 남쪽으로 흩어지고 있어요.','sad'),s6('kai','남쪽 샛길로 습격조가 들어온다! 마을을 지나 우리 뒤를 노려!','concerned'),s6('eric','명령대로다. 뒤를 돌아 막는다. 협곡은 놓지 않는다.','determined')],
 '8:village:rescue':[s6('kai','남쪽 샛길로 습격조! 마을 사람들을 노린다!','concerned'),s6('sain','지금이에요. 주민분들 곁으로 가서 구출해 주세요!','determined'),s6('eric','구출조는 마을로! 나머지는 아래 목을 지킨다.')],
 '8:rescue':[s6('sain','한 분 모셨어요! 협곡 뒤 야영지로 보내 드릴게요.')],
 '8:encounter':[s6('boss','철왕관 편에 붙은 수비대라. 연맹의 돈을 받은 이상 길은 열어야겠다.'),s6('eric','이 길 끝엔 피난민 마을이 있다. 열어 줄 수 없다.','determined')],
 '8:boss':[s6('boss','…물러난다. 연맹이 다 같은 생각은 아니라는 것만 알아 둬.','sad'),s6('baldrick','쫓지 마라. 명령은 협곡을 지키는 것까지다.')],
 '8:end':[s6('baldrick','협곡은 지켰다. 군단이 아니었다면 아래 목이 뚫렸을 거다.'),s6('aren','서로 할 일을 했을 뿐이오.'),s6('eric','다들 돌아왔군. …야영지로 가자.')]
};
// Camp scenes (staged on the hub painting). actors: who stands on the stage besides the legion.
export const FRONTIER_V06={
 'pre:7':{actors:['aren','eric','elina','lia','sain','kai','thea'],lines:[['thea','재의 군단이죠? 관문을 넘어온 피난민 행렬은 이미 보고받았어요. 철왕관 수송 호위대장, 테아 코르빈입니다.'],['aren','아렌 발터다. 피난민이 머물 곳이 필요하다. 통령국은 그들을 받아 주는가?'],['thea','받아 줍니다. 규율을 지키는 한, 이 땅에선 아무도 굶지 않아요. 배급표와 막사는 이미 준비돼 있고요.','determined'],['elina','규율을 어기면요?','concerned'],['thea','…법대로 처리합니다.','concerned'],['kai','법대로라. 그 법이 꽤 무겁다고 들었는데.'],['thea','그래서 부탁이 있어요. 성으로 가는 보급 수송대가 탈영병들에게 노려지고 있어요. 호위를 함께 맡아 주면, 피난민 배급은 제가 책임지고 늘리겠습니다.'],['sain','탈영병이라면… 그 사람들도 굶주려서 그러는 거 아닌가요?','concerned'],['thea','맞아요. 그래서 더 빨리 끝내고 싶어요. 오래 끌수록 처벌만 무거워지니까요.'],['aren','조건은 알겠다. 에릭, 리아와 작전을 맞춰 봐라. 받을 건 받고, 지킬 건 지킨다.','determined'],['eric','알았다. 수송대도, 그쪽 병사들도 같이 돌아오게 하지.']]},
 'after:7':{actors:['aren','eric','elina','lia','kai','thea','cassian'],lines:[['cassian','수송대를 지켜 준 군단이 그대들인가. 철왕관 통령, 카시안이다.','determined'],['aren','아렌 발터요. 피난민을 받아 준 것, 감사하오.'],['cassian','감사는 필요 없다. 이 땅에서 질서를 지키는 자는 누구든 먹고 잔다. 그것이 통일이 주는 평화다.'],['elina','질서를 어긴 사람은요?','concerned'],['cassian','법대로. 예외를 두면 다음 사람이 그 예외를 노린다.'],['thea','통령님, 탈영병들은 대부분 굶주린 병사였습니다.','concerned'],['cassian','알고 있다, 코르빈. 그래서 법이 필요한 거다.'],['lia','통령님, 하나만 여쭤도 될까요? 국경 관문을 봉인하라던 왕실 군령부의 명령… 철왕관도 알던 일인가요?'],['cassian','왕실의 명령은 왕실에 물어라. 나는 내 명령만 책임진다.'],['kai','…아니라고는 안 하네.'],['aren','지금은 그 대답으로 충분하오. 피난민이 머물 곳부터 지키겠소.','determined']]},
 'after:7:captured':{actors:['aren','eric','elina','sain','thea','cassian'],lines:[['cassian','군단이 탈영병 대장을 붙잡았다고 들었다. 처분은 군단에게 맡기겠다. 넘기든, 데려가든.'],['sain','넘기면… 사형인가요?','concerned'],['cassian','법이 정한 대로다. 데려간다면 그것도 기억해 두지. 군단이 무엇을 택했는지.'],['eric','다 같이 정하겠습니다. 오늘 안에.','determined']]},
 'after:7:none':{actors:['aren','eric','sain','thea'],lines:[['thea','탈영병 대장은 쓰러졌고, 남은 자들은 흩어졌어요. 잡히면… 법대로겠죠.','sad'],['sain','흩어진 사람들도 어딘가에서 다시 굶겠네요.','concerned'],['eric','그 사람들까지 다 구할 순 없었다. …그래도 기억은 해 두자.']]},
 'after:7:handover':{actors:['aren','eric','elina','sain','thea'],lines:[['aren','탈영병은 통령국에 넘긴다. 이 땅의 법을 따르겠다.'],['elina','마차를 습격했으니까요. 책임은 져야죠.'],['sain','법이 사람을 살릴 수도 있겠죠. 저는… 그렇게 믿고 싶어요.','sad'],['thea','제가 직접 호송하겠습니다. 적어도 가는 길엔 아무도 손대지 못하게요.','concerned'],['eric','부탁한다, 테아.']]},
 'after:7:legion':{actors:['aren','eric','elina','sain','thea'],lines:[['aren','탈영병은 군단이 데려간다. 우리 진영에서 일하고, 피난민과 같은 빵을 먹게 하겠다.','determined'],['elina','습격한 사람들을 데려간다고요? …감시는 제가 할게요.','concerned'],['sain','고마워요, 엘리나. 살아 있어야 책임도 질 수 있어요.'],['thea','통령님은 이 선택을 기억하시겠죠. 그래도… 저는 틀렸다고 생각하지 않아요.','determined'],['eric','고맙다, 테아. 그 말이면 충분하다.']]},
 'pre:8':{actors:['aren','eric','elina','lia','sain','kai','baldrick'],lines:[['baldrick','오랜만이군, 에릭. 이번엔 같은 깃발 아래다.'],['eric','…같은 편이라. 그날 이후 처음입니다.','concerned'],['baldrick','회색 협곡에 용병단이 몰려온다. 자유 영주 연맹 강경파가 돈을 댄 자들이다. 협곡이 뚫리면 이 성하 마을까지 열린다.','determined'],['aren','군단도 협곡을 지키겠소. 피난민이 머무는 마을이기도 하니.'],['baldrick','좋다. 위쪽 목은 내 병사가, 그 아래는 군단이 맡는다. 양쪽 벼랑에 낙석 장치가 하나씩 있다. 한 번씩만 쓸 수 있다.'],['kai','벼랑 위라… 올라가는 길은 내가 봐 둘게.'],['lia','협곡 아래 마을은요? 거기도 사람이 살잖아요.','concerned'],['baldrick','…사령부는 협곡을 우선하라고 했다. 출전 전에 명령서를 보여 주지.','concerned'],['aren','명령서는 받아 보겠소. 따를지는 그다음에 정한다.','determined']]},
 'after:8':{actors:['aren','eric','lia','kai','baldrick'],lines:[['baldrick','아렌 발터. 철왕관은 군단의 공을 기억한다. 통령께도 그렇게 보고하겠다.'],['aren','고맙소. 다만 우리는 철왕관의 군대가 되려는 건 아니오.','determined'],['baldrick','알고 있다. 그래서 더 지켜볼 가치가 있지. …서쪽에서 소식이 왔다. 자유도시 벨마르의 의회가 군단을 부른다는군.'],['lia','벨마르… 자유 영주 연맹이요? 오늘 싸운 용병단도 그쪽 돈을 받았다던데요.','concerned'],['kai','연맹이 다 같은 생각은 아니라고 했지. 가 보면 알겠지.'],['eric','피난민이 머물 땅도 거기 있을지 모르고. …다 같이 정하자.']]},
 'after:8:hold':{actors:['eric','sain','baldrick'],lines:[['sain','마을 분들 소식은… 아직 없어요.','sad'],['baldrick','명령은 지켰다. 그 대가도 우리가 기억하지.'],['eric','…다음엔 명령서보다 먼저 그 사람들 얼굴을 떠올리겠습니다.','concerned']]},
 'after:8:rescue':{actors:['eric','sain','baldrick'],lines:[['sain','구출한 분들이 모닥불 곁에 계세요. 다들 무사해요.'],['baldrick','명령에 없던 구출이었다. …결과는 나쁘지 않군.'],['eric','책임도 같이 진다고 했으니까요. 오늘은 둘 다 지켰습니다.','determined']]},
 'after:8:thea:joined':{actors:['aren','eric','thea','baldrick'],lines:[['thea','아렌 발터 님. 부탁이 있습니다. 저를 군단에 받아 주십시오.','determined'],['aren','철왕관 수송 호위대장이 왜 우리에게 오지?'],['thea','법을 믿습니다. 하지만 사람을 법보다 먼저 본 건 군단이었어요. 그 방식을 곁에서 배우고 싶습니다.'],['baldrick','통령께는 내가 말해 두지. 코르빈, 네 창은 어디서든 질서를 지킬 거다.'],['eric','환영한다, 테아. 군단에선 혼자 앞에 서지 않아도 돼.'],['thea','…네. 같이 돌아오는 법부터 배우겠습니다.','determined']]},
 'after:8:thea:parted':{actors:['eric','thea'],lines:[['thea','이번엔 철왕관에 남겠습니다. 아직 이 깃발 아래서 할 일이 있어요.'],['eric','알았다. 다음에 만날 땐 같은 편이면 좋겠군.'],['thea','그건… 군단이 걷는 길에 달려 있겠죠.','concerned']]}
};
export const ADVISOR_V06={
 7:[['lia','에릭, 수송로 정찰 결과예요. 마차 세 대가 성 아래 길을 따라 북쪽 성문으로 가요.'],['eric','습격은 어디서 오지?'],['lia','서쪽 숲에 대장과 탈영병, 동쪽 능선에 궁수, 얼음 다리 건너편에도 둘이요. TURN 3엔 뒤에서, TURN 5엔 성문 앞에서 더 와요!'],['lia','마차는 매 턴 두 칸씩 가는데 적이 붙으면 멈춰요. 두 대만 성문을 넘으면 돼요. 길 위에는 서지 마요!']],
 8:[['lia','에릭, 회색 협곡 지도예요. 위쪽 목은 발드릭의 병사들이, 아래 목은 우리가 지켜요.'],['eric','적은 몇이지?'],['lia','먼저 창병 넷과 궁수 둘이요. TURN 3에 북쪽에서 넷이 더 오고, TURN 6엔 남쪽 샛길로 습격조, TURN 7엔 용병단장이 호위병과 입구에 와요!'],['lia','양쪽 벼랑의 낙석 장치는 한 번씩이에요. 적이 위쪽 목에 몰렸을 때 써요. 출전 전에 사령부 명령도 정해야 해요!']]
};
export const COUNCIL_V06={
 7:()=>({terrain:'Northern Road · 눈밭(이동 2, 탈영병 1) / 길 / 얼어붙은 강(통과 불가) · 얼음 다리 2곳 / 서쪽 숲 · 동쪽 능선',intel:'탈영병 대장 · 탈영병 4 · 탈영 궁수 2. TURN 3 후미 습격 2, TURN 5 성문 앞 2. 동맹: 테아와 철왕관 보병 2(마차 곁을 따라 움직임).',plan:'보급 마차 3대 중 2대를 성문(맨 위 두 줄)까지 호위. 마차를 2대 잃으면 패배. 선택: 탈영병 대장 생포 (HP 절반 이하 + 인접), 세 대 모두 통과.'}),
 8:s=>({terrain:'Grey Canyon · 위쪽 목(6칸) / 아래 목(4칸) / 양쪽 벼랑 낙석 장치 / 남쪽 후위 마을',intel:'창병 4 · 궁수 2. TURN 3 북쪽 2진 4, TURN 6 남쪽 습격조 3, TURN 7 용병단장 + 호위병 2(TURN 8까지 입구 사수). 동맹: 발드릭과 철왕관 보병 2(위쪽 목 사수).',plan:`${s.campaign.choices?.m08_order==='rescue'?'구출조: 후위 마을 주민 3명에게 인접해 구출. ':s.campaign.choices?.m08_order==='hold'?'명령 준수: TURN 6에 후위 마을을 포기합니다. ':'출전 전에 사령부 명령을 정합니다. '}승리: 용병단장 격파 또는 TURN 10까지 사수. 패배: 북쪽 적이 12번째 줄 아래로 돌파.`})
};
