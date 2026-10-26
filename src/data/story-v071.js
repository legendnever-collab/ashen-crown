// v0.7.1 ACT II part 2 M13–M14 dialogue (D-068, D-071). Wording PROPOSED within the approved direction: Baldrick is able
// and seeks another kind of peace; M13 is a parting, never a recruitment (that is M26). Cassian, Leonora and Lucien are
// none of them simply good or evil; the banner that turns on the legion at the summit does so out of suspicion, not
// villainy. The masked raiders carry the ledger cord; no name is attached (Bellard only as rumour; the royal command, the
// crown's working and Lia's teacher stay OPEN). Lines answer the line before (D-062).
const s71=(speaker,text,expression='neutral')=>({speaker,text,expression});
export const STORY_V071={
 '13:intro':[s71('baldrick','아렌의 군단. 통령의 명이다. 이 야영지를 해산하고, 맹세를 거부한 자들과 탈영병을 넘겨라.','determined'),s71('eric','여기 있는 건 갈 곳 없는 사람들뿐입니다. 넘길 사람은 없습니다.','determined'),
  s71('baldrick','…그래서 칼을 들고 왔다. 명령은 명령이다.'),s71('lia','사자 대형이에요. 기수 셋이 버티는 한 진형이 단단해요.','concerned'),
  s71('aren','에릭. 발드릭은 말이 통하지 않는 사람이 아니다. 곁에 갈 수 있다면 말을 걸어 봐라.'),s71('eric','칼보다 말이 먼저 닿기를 바랍니다.','determined')],
 '13:turn2':[s71('kai','사자 진형이 천천히 내려와. 피난민 천막까지 몇 턴 안 남았어.','concerned'),s71('eric','천막 앞을 막는다. 고립되지 마라. 발드릭은 혼자 선 사람을 노린다.')],
 '13:cavalry':[s71('elina','양쪽에서 기병이 와요! 천막을 노려요!','concerned'),s71('eric','바깥쪽부터 끊는다!','determined')],
 '13:reinforce':[s71('kai','북쪽에서 창병 둘이 더 와.','concerned'),s71('eric','진형은 그대로다. 우리도 그대로 버틴다.')],
 '13:persuade':[s71('eric','발드릭 경. 이 사람들을 쫓아내는 게 경이 말하던 평화입니까?','determined'),s71('baldrick','…평화는 질서에서 온다. 질서는 명령에서 오고.','concerned'),s71('eric','그 명령이 아이를 눈밭으로 내몹니다. 경은 그걸 압니다.')],
 '13:thea':[s71('thea','장군님. 협곡에서 장군님은 마을을 버리라는 명을 받고도 끝까지 버티셨죠.','concerned'),s71('baldrick','…테아. 너는 이쪽을 골랐구나.'),s71('thea','저는 장군님께 배운 대로 했을 뿐이에요. 지킬 사람 앞에 서라고요.','determined')],
 '13:waver':[s71('baldrick','…창을 늦춰라. 아직 명을 거두진 않았다.','concerned'),s71('lia','진형이 흔들려요. 한 걸음만 더요!')],
 '13:halt':[s71('baldrick','전군, 멈춰라. …통령께는 내가 직접 답하겠다.','determined'),s71('eric','발드릭 경.'),s71('baldrick','착각하지 마라, 에릭. 너희 편이 된 게 아니다. 내가 지키려던 질서가 무엇이었는지 다시 묻고 싶어졌을 뿐이다.','sad')],
 '13:lost':[s71('sain','피난민 한 분이… 쓰러졌어요.','sad'),s71('eric','더는 안 된다. 천막 앞으로!','determined')],
 '13:encounter':[s71('baldrick','여기까지 왔구나, 에릭. 그날 구한 목숨으로 오늘 내 앞을 막는가.'),s71('eric','그날 받은 목숨이라 오늘 지킬 사람이 생겼습니다.','determined')],
 '13:end':[s71('baldrick','오늘은 여기까지다. 다음에 만날 때는 지금보다 많은 것을 걸어야 할 거다.','concerned'),s71('aren','발드릭. 자네의 질서가 사람을 지키는 질서이길 바라네.'),s71('baldrick','…그 말, 기억해 두지.')],
 '14:intro':[s71('cassian','습격이다! 회담장 문이 뚫렸다!','determined'),s71('leonora','가면 쓴 자들이에요. 어느 깃발도 들고 있지 않아요!','concerned'),
  s71('lucien','군단장, 우리가 남쪽 길로 빠지겠소. 출구까지 길을 열어 주시오.'),s71('eric','지도자들을 출구까지 모신다. 습격대는 지도자만 노린다. 곁에서 막아라!','determined')],
 '14:turn2':[s71('lia','세 분이 남쪽으로 움직여요. 가면 습격대가 양옆에서 붙어요!','concerned'),s71('kai','저놈들 움직임, 벨마르 지붕에서 본 자객이랑 똑같아.','concerned')],
 '14:raid':[s71('elina','양쪽 숲에서 셋! 하나는 활이에요!','concerned'),s71('eric','지도자 곁을 비우지 마라!')],
 '14:exit':[s71('kai','남쪽 출구 근처에도 셋이 숨어 있었어!','concerned'),s71('eric','길목을 먼저 연다. 출구까지 몇 걸음 안 남았다!','determined')],
 '14:betray:iron':[s71('cassian','이 습격, 군단이 끌어들인 게 아니라고 어떻게 믿지? 철왕관은 스스로 지킨다.','determined'),s71('eric','통령!'),s71('cassian','근위병, 군단을 막아라. 나는 철관성으로 돌아간다.','determined'),s71('aren','…가장 믿어 주지 않던 깃발이 먼저 등을 돌렸군.','sad')],
 '14:betray:free':[s71('leonora','미안해요. 연맹은 누구에게도 목숨을 맡기지 않아요. 이 습격의 끝에 누가 있는지 모르니까요.','sad'),s71('eric','의장님, 우리는…'),s71('leonora','경비병, 군단을 붙잡아요. 나는 벨마르로 가요.','determined'),s71('aren','…우리를 믿지 못한 쪽이 먼저 떠났군.','sad')],
 '14:betray:flame':[s71('lucien','맹세 없는 칼을 끝까지 믿을 수는 없소. 성화의 형제들이여, 군단을 막으시오.','sad'),s71('eric','대사제님!'),s71('lucien','성소로 돌아가겠소. 성화가 답을 줄 것이오.','determined'),s71('aren','…가장 믿어 주지 않던 깃발이 먼저 등을 돌렸군.','sad')],
 '14:arrive':[s71('lia','한 분이 출구를 빠져나갔어요!','determined'),s71('eric','남은 분도 모신다!')],
 '14:fallen:cassian':[s71('cassian','철왕관은… 여기서 끝나지 않는다…','sad'),s71('eric','통령!','sad')],
 '14:fallen:leonora':[s71('leonora','연맹은… 누구도… 지켜 주지 않는다더니…','sad'),s71('eric','의장님!','sad')],
 '14:fallen:lucien':[s71('lucien','성화여… 이들을…','sad'),s71('eric','대사제님!','sad')],
 '14:end':[s71('aren','회담장은 무너졌다. 그래도 군단은 무너지지 않았다.','determined'),s71('kai','습격대 하나 품에서 이게 나왔어. 장부랑 같은 끈. 이번에도 이름은 없어.','concerned'),
  s71('lia','세 깃발 모두에 같은 손이 닿아 있었고, 그 손이 세 깃발을 한자리에서 부수려 했어요.','concerned'),s71('eric','그 손이 누구든, 이제는 왕관의 문제다. 왕도로 가야 한다.','determined')]
};
// Staged camp scenes: the refugee camp (M13 preparation) and the camp before the summit (after M13, M14).
export const FRONTIER_V071={
 'pre:13':{actors:['aren','eric','lia','sain','kai'],lines:[['kai','철관성에서 전령이 왔어. 통령 카시안의 명령서야.','concerned'],['aren','읽어 봐라.'],
  ['kai','"맹세를 거부한 피난민과 탈영병을 보호하는 무장 집단을 해산시켜라. 집행: 발드릭 로엔."'],['sain','…여기 있는 사람들 이야기예요. 성소에 들지 못한 노인, 아이, 그리고 우리.','sad'],
  ['eric','발드릭 경이 직접 오는군요.'],['aren','그래. 칼을 들고 오겠지. 하지만 발드릭은 명령만 아는 사람이 아니다.'],['lia','명령과 명예 사이에서 흔들릴 수 있다면… 우리 행동이 그 저울에 올라가요.','determined'],['eric','그럼 끝까지 사람을 지키는 쪽을 보여 주겠습니다.','determined']]},
 'after:13':{actors:['aren','eric','lia','sain'],lines:[['sain','야영지는 무사해요. 다들 떨고 있지만요.'],['aren','발드릭은 물러났다. 철관성으로 돌아가 통령에게 답하겠지.'],['lia','그리고 소식이 왔어요. 세 지도자가 왕도 외곽 폐허 역참에서 처음으로 만나요.','concerned'],['eric','회담… 우리도 부른 겁니까?'],['aren','피난민 문제를 꺼낸 게 우리니까. 다들 우리를 의심하면서도 부르더군.','concerned']]},
 'after:13:halted':{actors:['eric','baldrick','thea'],lines:[['baldrick','에릭. 오늘 일로 나는 통령 앞에 서게 될 거다.'],['eric','경을 곤란하게 만들었습니다.'],['baldrick','아니. 곤란한 건 처음부터 명령이었다. 나는 그걸 오늘 처음 인정했을 뿐이다.','sad'],['baldrick','다음에 만날 때, 내가 어느 깃발 아래 서 있을지는 나도 모르겠다.','concerned'],['eric','어디에 서시든, 오늘을 기억하겠습니다.']]},
 'after:13:broken':{actors:['eric','baldrick'],lines:[['baldrick','사자 진형이 무너졌다. 명령대로 물러난다.'],['eric','경, 다음에는 칼이 아니라…'],['baldrick','다음에 만날 때도 나는 철왕관의 사자다. 그걸 잊지 마라.','determined']]},
 'after:13:held':{actors:['eric','baldrick'],lines:[['baldrick','해가 저문다. 명령의 시한이 지났다. 물러난다.'],['eric','끝까지 칼을 거두지 않으셨군요.'],['baldrick','거두지 못한 거다. …다음엔 더 무거운 명령을 들고 오겠지.','concerned']]},
 'pre:14':{actors:['aren','eric','lia','cassian','leonora','lucien'],lines:[['cassian','재의 군단장. 피난민 문제로 세 깃발을 한자리에 앉힌 건 당신들이오.'],['aren','앉혀 준 건 세 분이오. 우리는 부탁했을 뿐이고.'],
  ['leonora','연맹은 피난민에게 일자리를, 교단은 빵을, 통령국은 질서를 줄 수 있어요. 문제는 누가 무엇을 내놓느냐죠.'],['lucien','그리고 장부의 끈이 우리 세 깃발 모두에 닿아 있다는 소문도 들었소. 그것부터 말해 보시오.','concerned'],
  ['lia','증거는 있어요. 이름은 없지만요.'],['cassian','이름 없는 증거라. 편리하군.','determined'],['eric','그래서 함께 찾자는 겁니다. 누군가 세 깃발을 서로 싸우게 만들고 있습니다.','determined']]},
 'after:14':{actors:['aren','eric','lia','kai','sain'],lines:[['aren','회담은 실패했다. 하지만 누가 끝까지 곁에 남았는지는 분명해졌다.'],['lia','세 깃발과 군단의 관계를 정리해 둘게요. 다음 길을 정하려면 필요해요.'],
  ['kai','가면 쓴 놈들, 끈을 묶은 손, 벨마르 자객. 다 한 줄로 이어져. 그 줄 끝은 왕도야.','concerned'],['sain','왕도에는… 왕관이 있죠. 결계를 세운 왕관이.','concerned'],['eric','그럼 다음 길은 정해졌다. 왕관의 진실을 보러 간다.','determined']]},
 'after:14:recruit:stayed:thea':{actors:['eric','thea'],lines:[['thea','통령께서 떠나셨어요. 근위병들은 저를 배신자라고 불렀고요.','sad'],['eric','남아 준 이유를 물어도 될까.'],['thea','깃발보다 곁에 선 사람을 믿기로 했어요. 장군님께 배운 것도 그거였고요.','determined']]},
 'after:14:recruit:stayed:dario':{actors:['eric','dario'],lines:[['dario','의장이 떠났어. 나한테도 같이 가자더군.'],['eric','왜 남았지?'],['dario','계약서보다 오래 간 계약은 처음이거든. 끝은 내가 정할 거야.','determined']]},
 'after:14:recruit:stayed:ines':{actors:['eric','ines'],lines:[['ines','대사제님이 성소로 돌아가셨어요. 저를 부르셨지만… 대답하지 않았어요.','sad'],['eric','괜찮겠어?'],['ines','지키는 이의 자리는 지켜야 할 사람 곁. 대사제님께 배운 말이에요. 지금 그 사람들은 여기 있어요.','determined']]},
 'after:14:recruit:left:thea':{actors:['eric','thea'],lines:[['thea','통령의 명이에요. 철관성으로 돌아가야 해요.','sad'],['eric','다시 만날 수 있을까.'],['thea','깃발이 다시 군단을 믿게 되면요. 그날 제가 먼저 달려올게요.','determined']]},
 'after:14:recruit:left:dario':{actors:['eric','dario'],lines:[['dario','연맹이 군단을 의심하는 동안은 같이 못 다녀. 의장이 날 붙잡았어.','sad'],['eric','계약은 여기까지인가.'],['dario','잠시 멈출 뿐이야. 계약서는 내가 들고 있지.','determined']]},
 'after:14:recruit:left:ines':{actors:['eric','ines'],lines:[['ines','대사제님이 저를 성소로 부르셨어요. 지금은 따라야 해요.','sad'],['eric','교단이 군단을 믿게 되면.'],['ines','네. 그때 다시 길을 지키러 올게요.','determined']]}
};
export const ADVISOR_V071={
 13:[['lia','에릭, 야영지 지도예요. 남쪽이 피난민 천막, 북쪽에서 발드릭의 사자 진형이 내려와요.'],['eric','결단이라는 건?'],['lia','발드릭의 마음이 기우는 정도예요. 6이 되면 군을 멈춰요. 지금까지 우리가 한 선택으로 이미 몇 점은 쌓였어요.','determined'],
  ['lia','에릭이 발드릭 곁에서 설득하면 턴마다 1, 테아가 출전하면 한 번 1. TURN 4부터 적 턴에 피난민이 다치지 않으면 1씩, 최대 2예요.'],['eric','설득이 안 되면?'],['lia','기수 셋을 쓰러뜨리고 발드릭을 절반까지 몰거나, TURN 12까지 천막을 지켜요. 피난민 둘을 잃으면 실패예요.','concerned'],['eric','칼과 말, 둘 다 준비하자.','determined']],
 14:[['lia','에릭, 폐허 역참 지도예요. 맨 위가 회담장, 맨 아래 줄이 출구예요.'],['eric','지도자 셋은 출구로 가면 되나?'],['lia','네. 둘 이상이 빠져나가면 돼요. 가면 습격대는 지도자만 노려요. TURN 2, 4, 6에 더 와요.','concerned'],
  ['lia','그리고… TURN 4에 신뢰가 가장 낮은 깃발이 우리를 의심해서 등을 돌릴 거라는 첩보가 있어요. 그 지도자는 떠나고 호위병이 적이 돼요.','concerned'],['eric','그럼 남은 두 분은 반드시 모신다.','determined']]
};
export const COUNCIL_V071={
 13:s=>{const st=s.missionState;return {terrain:'Refugee Camp · 천막(마을, 회복) / 보급 거점 / 길 / 숲 / 폐허(엄폐)',intel:'발드릭(쓰러지지 않음, HP 50%까지) · 사자 기수 3(곁의 적 DEF+2·명중+10) · 창병 4 · 궁수 2. TURN 3 양쪽 기병 2, TURN 5 북쪽 창병 2. TURN 4부터 병사들이 천막을 노립니다.',plan:`결단 ${st?.resolve??0}/6에서 시작. 에릭이 발드릭 곁에서 설득(턴마다 1), 테아의 말(1번), 피난민을 지킨 적 턴(최대 2). 또는 기수 셋 격파 + 발드릭 HP 50% 이하, 또는 TURN 12까지 사수. 고립된 장수는 발드릭의 돌격(+4)을 받습니다.`};},
 14:s=>({terrain:'Ruined Waystation · 회담장(성채 바닥) / 길 / 숲 / 폐허 / 맨 아래 줄 출구',intel:'가면 습격대 4 (지도자를 노림, 숲을 가볍게 이동). TURN 2·4·6 증원. 동맹: 카시안·레오노라·루시안과 호위병 각 2. TURN 4에 신뢰가 가장 낮은 깃발이 등을 돌립니다.',plan:'지도자 곁을 지키며 출구까지 길을 엽니다. 둘 이상 출구 도착이면 승리. 등을 돌린 깃발의 호위병은 적이 됩니다. 남은 두 지도자 중 하나라도 쓰러지면 실패.'})
};
