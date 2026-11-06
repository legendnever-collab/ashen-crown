// v0.9.1 ACT III 「왕관의 진실」 part 2 — M17 수호자의 맹세, M18 불타지 않는 숲, the first awakenings and the recruits'
// promotions (D-084, docs/v0.9.0/ACT3_DESIGN.md §4.1, §5, §6). Wording PROPOSED. Reveal rule (STORY_BIBLE): the ward first
// stood on oaths freely given (war is not its only source); the forest's peace is paid for with memory. The Ashen Night's
// causes and the sealing order's signer stay for ACT IV. No one is made to swear; no hero is lost to a ward.
const s91=(speaker,text,expression='neutral')=>({speaker,text,expression});
export const STORY_V091={
 '17:intro':[s91('elder','성채 안쪽 서고에 「맹세의 서」가 있소. 재상부가 그걸 가지러 오고 있지.','concerned'),
  s91('lia','석상들이 잠들어 있어요. 옛 수호자들이 맹세로 깨웠다는 석상이요.','concerned'),
  s91('elder','석상 곁에서 맹세하면 깨어나 함께 싸울 거요. 다만 재상부 병사가 먼저 곁에 서면… 그들 편으로 깨어나오.','concerned'),
  s91('eric','석상 곁을 먼저 잡는다. 그리고 서고에는 한 걸음도 들이지 않는다.','determined')],
 '17:oath':[s91('lia','석상이 눈을 떴어요! 우리 편이에요.','determined'),s91('eric','맹세는 지킨다. 같이 서자.','determined')],
 '17:oath:ines':[s91('ines','성역의 맹세와 같은 말이에요… 이 석상들도 지키는 이의 맹세로 서 있었네요.','determined'),s91('eric','같은 뿌리라는 건가.'),s91('ines','네. 그러니 이 석상은 우리 편이에요.','determined')],
 '17:claimed':[s91('kai','석상 하나가 재상부 쪽으로 깨어났어! 저것도 맹세를 아는 건가?','concerned'),s91('elder','맹세는 아오. 다만 누구의 맹세인지 가리지 못할 뿐이지…','sad')],
 '17:archive':[s91('elder','서고에 놈들이 들어섰소! 「맹세의 서」를 꺼내기 전에 몰아내야 하오!','concerned'),s91('eric','서고로! 다음 적 턴이 끝나기 전에!','determined')],
 '17:reinforce':[s91('elina','양옆 비탈로 회색 망토가 더 올라와요!','concerned'),s91('eric','석상 곁을 비우지 마라.')],
 '17:end':[s91('elder','석상들이 다시 잠드는군. …고맙소. 이 책이 이 성채를 떠나지 않고 지켜진 건 백 년 만이오.','sad'),
  s91('lia','「맹세의 서」. 첫 장부터 수호자들의 이름과 맹세가 있어요. 강요된 이름은 하나도 없어요. 모두 스스로 적었어요.','concerned'),
  s91('eric','스스로 바친 기억… 그게 처음의 결계였군.','determined')],
 '18:intro':[s91('sain','비가 와요. 불은 잘 붙지 않을 거예요. 리아의 불꽃도 약해지고요.','concerned'),
  s91('lia','숲 한가운데가 결계 안이에요. 그 안에서는 불이 아예 통하지 않고, 상처가 빨리 아물어요.'),
  s91('kai','배신한 깃발이 벌목대를 보냈어. 노리는 건 결계 고목 셋이야.','concerned'),
  s91('eric','고목 둘은 반드시 지킨다. 숲 가장자리의 숲지기들도 결계 안으로 데려온다.','determined')],
 '18:reinforce':[s91('elina','숲 양옆에서 벌목대가 더 들어와요!','concerned'),s91('eric','고목 곁을 비우지 마라.')],
 '18:captain':[s91('kai','남쪽 길로 벌목대장이 들어왔어! 저 녀석을 쓰러뜨리면 벌목대가 흩어질 거야.','concerned'),s91('eric','고목을 비우지 말고, 길이 열리면 친다.','determined')],
 '18:keeper':[s91('sain','숲지기 한 분을 결계 안으로 모셨어요. 이 사람들은… 자기가 무엇을 잊는지 몰라요.','sad'),s91('eric','오늘은 살리는 게 먼저다.')],
 '18:tree':[s91('sain','고목이…! 결계가 흔들려요!','sad'),s91('eric','남은 고목을 지킨다. 한 그루도 더 내주지 않는다!','determined')],
 '18:end':[s91('elder','고목이 서 있군요. 숲은 다시 조용해질 겁니다. 겨울이 오기 전까지는.','concerned'),
  s91('sain','장로님, 겨울이 오면 무엇을 하세요?'),s91('elder','글쎄요. 해마다 겨울 축제를 지낸다고 들었는데… 그 축제를 기억하는 사람이 없어요.','concerned'),
  s91('sain','…그게 이 숲의 값이군요.','sad')],
 // trials (awakening and the recruits' promotion)
 'skirmish:106:intro':[s91('aren','엘리나, 놈들은 흩어져서 도망친다. 쫓기만 해서는 못 잡는다.'),s91('elina','도망칠 길을 먼저 막으면 돼요. 그 들판에서 배웠어요.','determined')],
 'skirmish:107:intro':[s91('aren','에릭, 훈련병 셋을 끝까지 지켜라. 대신 쓰러지는 건 지키는 게 아니다.'),s91('eric','서서 끝까지 지키겠습니다.','determined')],
 'skirmish:108:intro':[s91('aren','세인, 에릭과 카이가 쓰러질 수도 있다. 그래도 TURN 5가 끝날 때 셋이 서 있어야 한다.'),s91('sain','쓰러진 사람을 다시 일으키는 것. 그게 제 기도예요.','determined')],
 'skirmish:111:intro':[s91('aren','테아, 한 번 찌르고 멈추면 기병이 아니다.'),s91('thea','찌르고, 빠지고, 다시 찌르죠. 철관성에서 배운 대로.','determined')],
 'skirmish:112:intro':[s91('aren','다리오, 둘러싸여도 버텨 봐라. 세인이 뒤에 있다.'),s91('dario','둘러싸이면 한 번에 둘씩 갚아 주면 되지.','determined')],
 'skirmish:113:intro':[s91('aren','이네스, 훈련병 셋이 네 등 뒤에 있다.'),s91('ines','성역이 닿는 곳까지가 제 자리예요. 오늘은 조금 더 멀리 닿게 해 볼게요.','determined')],
 'awaken:elina':[s91('aren','엘리나. 매의 사수. 이제 너는 적이 어디로 도망칠지를 먼저 본다.'),s91('elina','복수할 사람을 찾던 눈으로, 이제는 책임질 사람을 찾을 거예요.','determined')],
 'awaken:eric':[s91('aren','에릭. 맹세의 수호자. 대신 죽어서 지키는 게 아니라, 서서 끝까지 지키는 자다.'),s91('eric','발드릭이 끌어낸 목숨입니다. 이제는 그 목숨으로 곁의 사람들을 세우겠습니다.','determined')],
 'awaken:sain':[s91('aren','세인. 새벽 사제. 쓰러진 자를 다시 일으키는 기도를 얻었구나.'),s91('sain','신앙이 결계를 지키라 하고, 양심이 진실을 말하라 해요. 이제는 둘 다 들고 갈게요.','determined')],
 'promo:thea':[s91('aren','테아, 흑철 창기사. 이제 너는 깃발이 아니라 군단의 창끝이다.'),s91('thea','철관성의 철로 만든 창이지만, 겨누는 곳은 제가 정해요.','determined')],
 'promo:dario':[s91('aren','다리오, 검성. 받아치는 칼이 두 번 닿는다.'),s91('dario','두 번 받으면 두 번 갚는다. 장사의 기본이지.','determined')],
 'promo:ines':[s91('aren','이네스, 성소 수호자. 네 성역이 한 걸음 더 닿는다.'),s91('ines','등불은 멀리 비출수록 좋아요. 지킬 사람이 거기 있으니까요.','determined')]
};
// Staged camp scenes: the guardians' keep (M17 preparation and after), the forest-keepers' village (M18).
export const FRONTIER_V091={
 'after:16:next':{actors:['eric','aren','lia'],lines:[['aren','북쪽 고원으로 간다. 명부 첫 장의 수호자들이 남긴 성채다.'],['lia','재상부도 그 성채에 눈독을 들이고 있다는 소문이 있어요.','concerned'],['eric','그럼 먼저 닿자.','determined']]},
 'pre:17':{actors:['aren','eric','lia','elder','ines'],lines:[['elder','재의 군단이라고요. 이 성채에 사람이 찾아온 건 몇 해 만인지.'],['aren','명부 첫 장에 수호자들의 맹세가 있었소. 그 맹세를 알고 싶소.'],
  ['elder','맹세는 이렇소. "내 기억 한 조각을 결계에 둔다. 아무도 대신 바치게 하지 않는다." 그래서 우리는 누구에게도 맹세를 시키지 않았지요.','concerned'],
  ['ines','성역의 맹세와 닮았어요. 강요하는 순간 맹세가 아니게 된다고 배웠어요.'],['lia','재상부가 「맹세의 서」를 가지러 온다는 첩보예요. 서고를 지켜야 해요.','determined'],['eric','지키겠습니다. 성채도, 그 책도.','determined']]},
 'after:17':{actors:['aren','eric','lia','elder','elina'],lines:[['lia','「맹세의 서」를 다 읽었어요. 결계는 처음에 수호자들이 스스로 바친 기억으로 섰어요. 전쟁이 유일한 길이 아니었던 거예요.','concerned'],
  ['elder','수호자가 줄어들자 누군가 다른 길을 찾았겠지요. 더 많은 기억을, 더 빨리.','sad'],['elina','들판의 죽음처럼요.','sad'],
  ['aren','그 "다른 길"을 고른 게 누구인지는 아직 모른다. 다만 이 책은 그 길이 처음부터 정해진 게 아니었다는 증거다.','determined'],
  ['eric','이 책을 어떻게 할지 정하자.']]},
 'after:17:leave':{actors:['eric','elder','sain'],lines:[['elder','책은 성채에 남기겠소. 다음에 올 수호자를 위해서.'],['sain','언젠가 누군가 스스로 이 책에 이름을 적겠죠.'],['eric','그날까지 이 성채를 기억하겠습니다.','determined']]},
 'after:17:take':{actors:['eric','elder','lia'],lines:[['elder','가져가시오. 왕도 사람들 앞에서 이 책이 할 말이 있을 거요.','concerned'],['lia','광장에서 읽을 증거가 하나 늘었어요.'],['eric','함부로 쓰지 않겠습니다.','determined']]},
 'after:17:eric':{actors:['eric','aren'],lines:[['eric','석상들 곁에 서 있으면서 알았습니다. 저는 늘 대신 쓰러지는 쪽을 골랐어요.','concerned'],['aren','발드릭이 끌어낸 목숨이라서였나.'],
  ['eric','네. 하지만 수호자들은 쓰러지지 않았어요. 서서 끝까지 지켰죠. …저도 그렇게 하겠습니다.','determined'],['aren','그럼 성채에서 시련을 치러라. 레벨 14, 수호기사. 각성의 자격은 갖췄다.']]},
 'pre:18':{actors:['aren','eric','sain','lia','elder'],lines:[['elder','어서 오세요. 이 숲에서는 불이 붙지 않고, 아무도 병들지 않아요.'],['sain','…그게 결계 덕분이죠?'],
  ['elder','그렇다고들 해요. 대신 해마다 겨울이 오면 한 해를 잊어요. 다들 그게 당연하다고 여기지요.','concerned'],['lia','배신한 깃발의 벌목대가 결계 고목을 베러 온대요. 고목이 쓰러지면 결계도 무너져요.','concerned'],
  ['sain','이 숲의 평화가 무엇으로 서 있는지 알면서도… 지켜야 하는 거군요.','sad'],['eric','오늘은 지킨다. 그다음 일은 같이 정하자.','determined']]},
 'after:18':{actors:['aren','eric','sain','elder','lia'],lines:[['elder','고목이 남았어요. 고맙습니다.'],['sain','장로님. 해마다 잃는 한 해가 무엇인지… 저는 알게 됐어요.','concerned'],
  ['lia','결계석의 기록과 같아요. 이 숲은 숲지기들의 기억으로 결계를 세워요. 해마다 한 해씩요.','concerned'],['aren','진실을 말할지 말지는 세인이 정해라. 이 숲의 일은 네가 가장 잘 안다.'],
  ['eric','어느 쪽이든 세인의 선택을 존중한다.']]},
 'after:18:tell':{actors:['eric','sain','elder'],lines:[['sain','장로님, 이 숲의 결계는 여러분의 기억으로 서 있어요. 해마다 잃는 한 해가 그 값이에요.','concerned'],['elder','…그랬군요. 그래도 알게 되니 덜 두렵네요. 이제는 우리가 고를 수 있으니까요.','sad'],
  ['sain','신앙은 결계를 지키라 하고, 양심은 진실을 말하라 했어요. 둘 다 따를 수 있었어요.','determined']]},
 'after:18:keep':{actors:['eric','sain','elder'],lines:[['sain','…아무것도 아니에요, 장로님. 겨울 축제, 올해는 기억하시길 바라요.','sad'],['elder','고마워요. 좋은 겨울이 될 거예요.'],
  ['eric','무거운 걸 혼자 들지는 마라.'],['sain','네. 이 진실은 군단과 같이 들고 갈게요.','concerned']]},
 'after:18:next':{actors:['eric','aren','lia'],lines:[['lia','재상부가 왕도 지하에서 "작은 계승 의식"을 시험한다는 첩보예요. 잡혀간 피난민들의 기억으로요.','concerned'],
  ['aren','M19 「금지된 의식」은 다음 업데이트에서 이어진다.'],['eric','그때까지 군단을 정비하자.','determined']]}
};
export const ADVISOR_V091={
 17:[['lia','에릭, 수호자 성채예요. 맨 안쪽 서고 칸 둘에 「맹세의 서」가 있어요.'],['eric','지켜야 할 곳은 거기 하나인가?'],
  ['lia','네. 적이 서고 칸에 두 적 턴 연속 서 있으면 책을 빼앗겨요. TURN 10이 끝날 때까지 지키거나 재상부 대장을 쓰러뜨리면 돼요.','determined'],
  ['lia','성채 앞 석상 넷이 잠들어 있어요. 곁에서 「맹세」하면 깨어나 함께 싸워요. 적이 먼저 곁에 남아 있으면 턴이 시작될 때 적 편으로 깨어나요.','concerned'],['eric','석상 곁부터 잡는다.','determined']],
 18:[['lia','에릭, 불타지 않는 숲이에요. 비가 와서 불꽃이 약해지고 불이 번지지 않아요. 제 마법도 절반이에요.','concerned'],['eric','결계 안은?'],
  ['lia','숲 한가운데요. 그 안에선 불이 통하지 않고 회복이 50% 강해요. 고목 셋 가운데 둘이 쓰러지면 결계가 무너져요.','concerned'],
  ['lia','벌목대는 고목만 노려요. 숲 가장자리 숲지기 여섯 분 곁에서 「구출」하면 결계 안으로 모셔요. TURN 12까지 버티거나 벌목대장을 쓰러뜨리면 돼요.','determined'],['eric','고목 곁에 방패를 세운다.','determined']]
};
export const ADVISOR_AFTER_V091={
 16:[['lia','에릭, 결계의 원리가 조금 보여요. 바친 기억이에요.'],['eric','다음 길은?'],['lia','명부 첫 장의 수호자들. 북쪽 고원의 수호자 성채예요. 엘리나는 이제 각성의 시련을 치를 수 있어요(레벨 14).','concerned'],['eric','준비하자.']],
 17:[['lia','에릭, 수호자들의 맹세가 결계의 처음이었어요.'],['eric','다음은?'],['lia','남동쪽 숲이요. 결계 아래에서 불이 붙지 않는 숲이래요. 에릭도 이제 각성의 시련을 치를 수 있어요.','determined'],['eric','성채에서 시련부터 치르자.']],
 18:[['lia','에릭, 숲이 지켜졌어요. 세인도 각성의 시련을 치를 수 있어요.'],['eric','다음 일은?'],['lia','왕도 지하의 의식이요. M19는 다음 업데이트에서 이어져요.','concerned'],['eric','그때까지 정비하자.']]
};
export const COUNCIL_V091={
 17:s=>({terrain:"Guardians' Keep · 성채 바닥 / 성벽(통행 불가) / 성문 앞 길 / 고원 산길 · 서고 칸 2 (성채 맨 안쪽)",intel:'재상부 대장 1 (TURN 4부터 전진) · 회색 망토 5 + 석궁수 2. TURN 3 양옆 2, TURN 5 양옆 2, TURN 7 남쪽 2. 잠든 수호 석상 4.',plan:`석상 곁에서 맹세(조사) · 서고 칸을 비우지 않기 · TURN 10까지 사수 또는 대장 격파${s.command?` · 아렌의 군령 「${({hold:'지켜라',advance:'나아가라'})[s.command]}」`:''}`}),
 18:s=>({terrain:'Unburning Forest · 숲 / 평지 / 숲지기 집 · 비: 화염 −50%, 불 번짐 없음 · 결계 안: 화염 무효, 회복 +50%',intel:'벌목대 4 + 횃불병 2 · TURN 3 양옆 2, TURN 4 남쪽에서 벌목대장, TURN 5 양옆 2, TURN 7 남쪽 2. 결계 고목 3 · 숲지기 6.',plan:`고목 곁 방어 · 숲지기 구출(결계 안으로) · TURN 12까지 고목 2그루 이상 또는 벌목대장 격파${s.command?` · 아렌의 군령 「${({hold:'지켜라',advance:'나아가라'})[s.command]}」`:''}`})
};
