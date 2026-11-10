// v0.10.1 ACT IV 「잿빛 왕관」 part 2 「검은 사자」 — M25 세 왕가의 깃발, M26 검은 사자의 마지막 전투, Dario's awakening, Baldrick's
// three endings (D-099/D-102, docs/v0.10.0/ACT4_DESIGN.md §4.1, §5.2). Wording PROPOSED. Reveal rule (ACT4_DESIGN §3): the
// Ashen Night's truth waits for M28; Baldrick's debt of a life (M05) is settled here, whichever way it ends.
const s101=(speaker,text,expression='neutral')=>({speaker,text,expression});
export const STORY_V0101={
 '25:intro':[s101('lia','옛 회담장이에요. 세 깃발이 마지막으로 한자리에 모였어요.','concerned'),
  s101('aren','그런데 북쪽 진영의 깃발이 내려가지 않는다. M14에서 등을 돌렸던 깃발의 강경파다.','determined'),
  s101('hardliner','타협은 패배다. 이 자리에서 세 깃발의 승자를 가린다!','determined'),
  s101('eric','강경파 대장을 멈춘다. 다른 두 깃발의 지도자는 하나도 잃지 않는다.','determined'),
  s101('lia','우리를 「동맹」으로 믿는 깃발은 함께 싸워요. 아니면 중립으로 강경파와만 싸워요. 지도자가 쓰러지면 끝이에요.','concerned')],
 '25:reason:iron':[s101('cassian','철왕관의 강경파는 통일 없이 평화는 없다고 믿소. 나도 그렇게 가르쳤지. 그 말의 끝이 이것이오.','sad'),s101('eric','그 말을 끝내러 왔습니다.','determined')],
 '25:reason:free':[s101('leonora','연맹의 강경파는 왕 없는 세상을 지키려고 왕을 만들려 해요. 계산이 틀린 걸 모르는 거죠.','sad'),s101('eric','그 계산, 여기서 멈추게 하겠습니다.','determined')],
 '25:reason:flame':[s101('lucien','성화의 강경파는 인간의 탐욕을 불로 태워야 한다고 믿소. 그들이 태우려는 것도 결국 사람이오.','sad'),s101('eric','태우게 두지 않겠습니다.','determined')],
 '25:allied':[s101('lia','우리를 동맹으로 믿는 깃발이 함께 싸워요. 동맹 유닛을 누르면 지시를 내릴 수 있어요.','determined')],
 '25:neutral':[s101('kai','중립 진영은 우리 편도 적도 아니야. 강경파하고만 싸워. 지도자를 지키는 건 우리 몫이고.','concerned')],
 '25:flank':[s101('elina','북쪽 양끝으로 강경파 창병이 내려와요! 지도자 진영 쪽이에요!','concerned'),s101('eric','진영 앞을 막는다!','determined')],
 '25:riders':[s101('kai','남쪽 가장자리에서 강경파 기병 둘! 뒤를 노려!','concerned')],
 '25:captain:down':[s101('hardliner','…세 깃발이… 한자리에 서는 걸 보게 되다니…','sad'),s101('eric','강경파 대장이 쓰러졌다. 깃발을 거둬라!','determined')],
 '25:leader:down':[s101('lia','지도자가 쓰러졌어요…! 회담장이 무너져요!','sad')],
 '25:end':[s101('aren','강경파의 깃발이 내려갔다. 이제 세 깃발의 지도자가 군단을 본다.','determined'),
  s101('lia','등을 돌렸던 깃발을 어떻게 할지 정해야 해요. 용서할지, 깃발을 내리게 할지.','concerned'),s101('eric','함께 정하자.','determined')],
 '26:intro':[s101('kai','사자의 고개야. 왕도로 가는 마지막 길목. 그런데 길 위에 사자 깃발이 서 있어.','concerned'),
  s101('baldrick','에릭. 국경에서 내가 살려 준 소년이 군단의 칼이 되었구나.','determined'),
  s101('eric','발드릭 경. 그때 받은 목숨, 오늘 갚으러 왔습니다.','determined'),
  s101('baldrick','갚을 것 없다. 이 고개를 넘으려면 나를 넘어라. 그게 철왕관 기사의 마지막 예의다.','determined'),
  s101('lia','TURN 2에 일기토를 청할 거예요. 에릭은 턴마다 발드릭 곁에서 설득할 수 있어요. 결단 4면 칼을 내려요.','concerned')],
 '26:duel':[s101('baldrick','에릭! 칼로 묻겠다. 네가 지키는 것이 무엇인지.','determined'),s101('eric','받겠습니다.','determined')],
 '26:duel:won':[s101('baldrick','…그 칼끝에 망설임이 없구나. 국경의 소년이 아니야.','sad'),s101('aren','결단이 크게 흔들렸다. 조금만 더.','determined')],
 '26:waver':[s101('baldrick','네 말이… 카시안의 명령보다 무겁게 들리는구나.','sad'),s101('eric','명령이 아니라 사람을 보십시오.','determined')],
 '26:thea':[s101('thea','발드릭 경! 철왕관의 창은 사람을 지키라고 배웠습니다. 경에게서요!','determined'),s101('baldrick','테아… 그래, 그렇게 가르쳤지.','sad')],
 '26:riders':[s101('elina','양옆 비탈로 철왕관 기병이 내려와요!','concerned'),s101('eric','기병을 막아라. 발드릭은 내가 맡는다.','determined')],
 '26:broken':[s101('baldrick','…졌다. 하지만 목숨까지 내줄 생각은 없다. 사자는 살아서 물러난다.','sad'),s101('eric','가십시오. 다음엔 칼이 아니라 이야기로 만납시다.','determined')],
 '26:yield:join':[s101('baldrick','국경에서 나는 명령 대신 너희를 택했다. 오늘 다시 택하겠다.','determined'),
  s101('baldrick','검은 사자 발드릭 로엔. 군단의 깃발 아래 서겠다.','determined'),s101('aren','환영한다, 발드릭.','determined')],
 '26:yield:cooperate':[s101('baldrick','칼을 내리마. 하지만 나는 철왕관의 기사다. 깃발을 바꾸진 않는다.','determined'),
  s101('baldrick','대신 마지막 작전에 철왕관 기병을 이끌고 너희 곁에 서겠다.','determined'),s101('eric','그거면 충분합니다.','determined')],
 '26:end':[s101('lia','사자의 고개를 넘었어요. 이제 왕도가 보여요.','concerned'),s101('aren','남은 것은 벨라드와 왕관의 심장이다.','determined'),s101('eric','끝까지 함께 간다.','determined')],
 'skirmish:117:intro':[s101('aren','다리오, 검진 교관 여섯이 너를 둘러싼다. 엘리나가 곁에 있다.'),s101('dario','둘러싸는 쪽이 계산을 잘못한 거야. 칼 하나에 칼 여섯이면, 반격도 여섯이지.','determined')],
 'awaken:dario':[s101('aren','다리오. 칼의 주인. 어떤 칼도 대답 없이 지나가게 두지 않는 자다.'),s101('dario','장사꾼 칼잡이가 주인 소리를 듣네. 좋아, 값은 제대로 받아 줄게.','determined')]
};
export const FRONTIER_V0101={
 'pre:25':{actors:['aren','eric','lia','kai'],lines:[['lia','세 깃발이 옛 회담장에서 마지막으로 마주하기로 했어요. 타협할지, 끝을 볼지.','concerned'],
  ['kai','등을 돌렸던 깃발의 강경파가 이미 북쪽 진영을 쳤대. 지도자도 말리지 못했고.','concerned'],
  ['aren','우리를 믿는 깃발은 우리 곁에, 아닌 깃발은 지켜보기만 할 것이다.'],['eric','누구의 지도자도 쓰러뜨리게 두지 않는다.','determined']]},
 'after:25':{actors:['aren','eric','lia','sain'],lines:[['sain','강경파 병사들도 치료했어요. 깃발 색은 달라도 피는 같은 색이니까요.'],
  ['lia','등을 돌렸던 깃발의 지도자가 군단에게 처분을 맡긴대요.','concerned'],['aren','군단이 정한다. 용서할지, 깃발을 내리게 할지.']]},
 'after:25:forgive':{actors:['eric','aren','lia'],lines:[['eric','용서합니다. 대신 마지막 작전에 함께 서 주십시오.','determined'],
  ['lia','그 깃발의 신뢰가 크게 올랐어요. 다른 두 깃발은 지켜보고 있고요.','concerned'],['aren','용서는 약속이다. 지키는 것도 군단의 몫이다.']]},
 'after:25:lower':{actors:['eric','aren','lia'],lines:[['eric','깃발을 내려 주십시오. 전쟁이 끝날 때까지는.','determined'],
  ['lia','다른 두 깃발이 군단을 더 믿게 됐어요. 그 깃발에는 상처가 남았지만요.','concerned'],['aren','공정함에도 값이 있다. 우리가 그 값을 기억하자.']]},
 'pre:26':{actors:['aren','eric','lia','kai'],lines:[['kai','왕도로 가는 마지막 고개에 사자 깃발이 섰어. 발드릭이야.','concerned'],
  ['lia','그가 어떻게 끝날지는 국경에서 그가 무엇을 택했는지에 달려 있어요.','concerned'],
  ['aren','에릭, 그는 너에게 목숨을 준 사람이다. 칼로든 말로든, 오늘 매듭지어라.'],['eric','네.','determined']]},
 'after:26':{actors:['aren','eric','lia'],lines:[['lia','사자의 고개를 넘었어요. 왕도의 성벽이 보여요.','concerned'],['aren','벨라드가 성문을 닫아걸었다. 남은 것은 마지막 전투다.','determined'],['eric','끝까지 함께.','determined']]},
 'after:26:join':{actors:['eric','baldrick','aren'],lines:[['baldrick','군단의 진영이란 이런 곳이었군. 시끄럽고, 따뜻하다.'],['eric','환영합니다, 발드릭 경.'],['baldrick','경은 빼라. 이제 나는 군단의 한 사람이다.','determined'],['aren','아홉 번째 장수다. 출전 명단에 올려 두겠다.']]},
 'after:26:cooperate':{actors:['eric','aren','lia'],lines:[['lia','발드릭이 철왕관 기병을 이끌고 마지막 작전에 온대요.','determined'],['eric','깃발은 달라도 같은 쪽을 보는 거죠.'],['aren','그것으로 충분하다.']]},
 'after:26:withdraw':{actors:['eric','aren','sain'],lines:[['sain','발드릭은 살아서 고개를 넘어갔어요. 다친 기병들도 데려갔고요.','concerned'],['eric','목숨의 빚은… 이렇게 갚은 걸까.','sad'],['aren','살아 있다면 이야기는 끝나지 않았다.']]},
 'after:26:thea':{actors:['thea','eric'],lines:[['thea','발드릭 경이 칼을 내리는 걸 봤어요. 처음 창을 배울 때보다 떨렸어요.','sad'],['eric','네 말이 닿은 거다.'],['thea','…네. 이번엔 제가 경을 지킬 차례예요.','determined']]}
};
export const ADVISOR_V0101={
 25:[['lia','에릭, 세 깃발의 회담장이에요. 북쪽은 등을 돌렸던 깃발의 강경파, 서쪽과 동쪽은 다른 두 깃발이에요.','concerned'],['eric','조건은?'],
  ['lia','강경파 대장을 쓰러뜨리면 이겨요. 다른 두 깃발의 지도자가 쓰러지면 실패예요. TURN 12를 넘겨도 실패고요.','concerned'],
  ['lia','신뢰가 「동맹」(3)인 깃발은 아군이 되어 지시를 받아요. 아니면 중립으로 강경파와만 싸우고, 우리는 그들을 칠 수 없어요.','determined'],['eric','지도자 진영 앞을 막고 북쪽으로 간다.','determined']],
 26:[['lia','에릭, 사자의 고개예요. 발드릭과 철왕관 기병이 길을 막고 있어요.','concerned'],['eric','조건은?'],
  ['lia','발드릭을 설득하거나 쓰러뜨리면 돼요. 에릭이 쓰러지면 실패예요. TURN 2에 일기토를 청하고, 이기면 결단 +2예요.','concerned'],
  ['lia','에릭은 턴마다 한 번 발드릭 곁에서 설득할 수 있어요. 테아도 한 번. 결단 4면 칼을 내려요. 국경에서 군을 멈췄다면 합류할 거예요.','determined'],['eric','칼과 말, 둘 다 준비한다.','determined']]
};
export const ADVISOR_AFTER_V0101={
 25:[['lia','에릭, 세 깃발의 회담장을 지켰어요. 다리오도 각성의 시련을 치를 수 있어요.','determined'],['eric','다음은?'],['lia','사자의 고개요. 발드릭이 기다리고 있어요.','concerned'],['eric','준비하자.','determined']],
 26:[['lia','에릭, 사자의 고개를 넘었어요.','determined'],['eric','다음은?'],['lia','왕도요. 두 전선의 전투가 기다려요. ACT IV는 다음 업데이트에서 이어져요.','concerned'],['eric','그때까지 정비하자.','determined']]
};
const cmd101=s=>s.command?` · 아렌의 군령 「${({hold:'지켜라',advance:'나아가라',leaveNoOne:'한 사람도 두고 가지 않는다'})[s.command]}」`:'';
export const COUNCIL_V0101={
 25:s=>({terrain:'Summit Field · 옛 회담장 · 북쪽 진영(강경파) / 서·동 진영(다른 두 깃발) / 가운데 길',intel:'강경파 대장 1 (TURN 5까지 북쪽 진영) · 창병 4 · 궁수 2. TURN 2 북쪽 양끝 창병 2, TURN 4 북쪽 창병·궁수, TURN 6 남쪽 가장자리 기병 2. 서·동 진영: 지도자 1 · 호위 2 · 궁수 1씩',plan:`지도자 진영 앞을 막기 · 강경파 대장 격파${cmd101(s)}`}),
 26:s=>({terrain:"Lion's Pass · 산길 / 숲 / 돌무더기 · 가운데 왕도 길",intel:'발드릭 1 (TURN 2 일기토) · 사자 기수 2 · 철왕관 기병 2 · 궁수 2. TURN 3 비탈 기병 2, TURN 5 북쪽 창병 2.',plan:`일기토 · 에릭의 설득(턴마다) · 테아의 말(한 번) · 결단 4${cmd101(s)}`})
};
