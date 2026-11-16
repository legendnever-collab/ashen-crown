// v1.0.0 ACT IV 「잿빛 왕관」 part 4 「왕관 없는 새벽」 — M29 왕관의 심장, M30 왕관 없는 새벽 (D-099/D-113, docs/v0.10.0/ACT4_DESIGN.md
// §3, §4.2, §6, §11). Wording PROPOSED. Bellard is not a monster: he drew another conclusion from the same night (§11.3); he
// gives his memory to the ward only when he asks it himself (§11.4). The king rests (the M21 request). What lies beyond the ward
// stays OPEN (§11.7). The endings' own scenes are in ending-v100.js.
const s1000=(speaker,text,expression='neutral')=>({speaker,text,expression});
const PATH_LINE={king:'의식 지점은 옥좌 곁에 있어요. 새 왕관과 수호자단의 의식이에요 — 벨라드와 가까워요.',council:'의식 지점은 홀의 세 모퉁이에 있어요. 세 깃발의 회의가 고른 의식이에요 — 서로 멀어요.',oath:'의식 지점은 홀을 가로질러 한 줄로 서 있어요. 모든 사람의 서약을 받는 의식이에요.'};
export const STORY_V100={
 '29:intro':[s1000('bellard','왔군, 군단. 잿빛 밤의 기억까지 보고 왔겠지.','determined'),
  s1000('aren','벨라드. 그 밤의 명령서는 당신이 쓰고, 국왕이 서명하고, 내가 전했다.','sad'),
  s1000('bellard','그래. 그리고 나는 그 밤에 배웠다. 강요된 맹세로는 결계가 서지 않는다. 그렇다면 누군가의 기억은 전장에서 바쳐져야 한다.','determined'),
  s1000('lia','새 결계의 의식이 시작됐어요. 의식 지점 셋 가운데 둘을 지켜야 해요. 벨라드는 의식을 풀려고 할 거예요.','concerned'),
  s1000('eric','벨라드를 꺾고, 의식을 지킨다. 국왕을 쉬게 한다.','determined')],
 '29:squads':[s1000('lia','세 깃발의 부대가 의식 지점을 지키러 왔어요! 지시를 내릴 수 있어요.','determined')],
 '29:lion':[s1000('baldrick','마지막 작전이라 했지. 끝까지 함께한다.','determined')],
 '29:duel':[s1000('bellard','에릭. 군단이 키운 기사. 칼로 내 계산이 틀렸다고 말해 보아라.','determined'),
  s1000('aren','에릭, 일기토를 받지 않아도 된다. …그렇다면 내가 그에게 할 말이 있다.','sad')],
 '29:duel:hero':[s1000('bellard','…칼끝이 흔들리지 않는군. 그 밤의 아이들이 이렇게 자랐나.','concerned'),s1000('eric','당신의 계산에는 우리가 없었습니다.','determined')],
 '29:duel:foe':[s1000('bellard','아직이다. 아직은 내 계산이 맞다.','determined'),s1000('eric','끝까지 해 보겠습니다.','determined')],
 '29:words':[s1000('aren','벨라드. 그 밤, 나는 알고 명령서를 전했다. 당신은 알고 썼다. 국왕은 알고 서명했다.','sad'),
  s1000('aren','우리 셋 다 그 밤을 혼자 갚으려 했다. 당신은 전장으로, 국왕은 자기 기억으로, 나는 군단으로.','sad'),
  s1000('bellard','…그래서 무엇이 달라지나.','concerned'),
  s1000('aren','이번엔 혼자 갚지 않는다. 모두가 함께 진다. 그게 우리가 찾은 길이다.','determined'),
  s1000('bellard','……','sad'),s1000('lia','왕관의 빛이 흔들려요. 벨라드가… 망설이고 있어요.','concerned')],
 '29:reinforce':[s1000('kai','북쪽 문으로 의식 기사가 더 들어와!','concerned')],
 '29:last':[s1000('elina','의식사가 또 와요! 의식 지점을 노려요!','concerned'),s1000('eric','의식 지점 곁을 비우지 마라!','determined')],
 '29:rite:broken':[s1000('lia','의식 지점 하나가 풀렸어요! 하나 더 풀리면 의식이 무너져요!','concerned')],
 '29:rite:broken2':[s1000('lia','두 곳이… 풀렸어요.','sad')],
 '29:crown':[s1000('bellard','아직 끝나지 않았다. 왕관이여, 그 밤처럼 나에게 답하라!','determined'),
  s1000('lia','벨라드가 왕관의 힘을 빌렸어요! 2단계예요. 더 강해요!','concerned'),s1000('eric','한 번 더!','determined')],
 '29:crown:words':[s1000('bellard','왕관이여… 답하라.','concerned'),
  s1000('lia','왕관이 전처럼 답하지 않아요. 벨라드가 망설이는 만큼, 힘도 약해요!','determined'),s1000('eric','지금이다. 끝내자!','determined')],
 '29:fall':[s1000('bellard','……내 계산이 틀렸군.','sad'),s1000('aren','틀린 게 아니라, 혼자 한 계산이었다.','sad')],
 '29:end':[s1000('chronicle','의식 지점이 빛을 모아 왕관의 심장으로 흘려보낸다. 새 결계가 국왕의 기억을 대신해 일어선다.'),
  s1000('king','…이제, 놓아도 되겠는가.','sad'),
  s1000('aren','네. 이제 쉬십시오. 약속을 지키러 왔습니다.','sad'),
  s1000('king','고맙다. 이름 없는 왕은… 이제 잠든다.','sad'),
  s1000('lia','국왕이 결계를 놓았어요. 새 결계가 버티고 있어요. 하지만 결계 가장자리에서… 재가 마지막으로 밀려와요.','concerned')],
 '30:intro':[s1000('lia','새 결계가 결계의 심장에서 일어나고 있어요. 새벽까지 — TURN 8이 끝날 때까지 지키면 완전히 서요.','concerned'),
  s1000('kai','북쪽 가장자리에서 재의 짐승이 넘어와. 결계의 심장을 노려.','concerned'),
  s1000('cassian','철왕관은 서쪽을 맡는다.','determined'),s1000('leonora','연맹은 동쪽이에요.','determined'),s1000('lucien','성화는 심장 곁을 지키겠습니다.','determined'),
  s1000('aren','군단, 세 깃발. 오늘은 모두 같은 새벽을 지킨다.','determined'),s1000('eric','새벽까지. 끝까지 함께!','determined')],
 '30:lion':[s1000('baldrick','검은 사자도 이 새벽을 지킨다.','determined')],
 '30:tide':[s1000('elina','가장 큰 물결이에요! 재가 하늘까지 덮어요!','concerned'),s1000('lia','이게 마지막이에요. 이 물결만 넘기면 돼요!','determined')],
 '30:last':[s1000('kai','남은 재가 전부 몰려와. 거의 다 왔어!','concerned'),s1000('eric','두 턴만 더!','determined')],
 '30:heart:lost':[s1000('lia','결계의 심장이… 부서졌어요.','sad')],
 '30:end':[s1000('chronicle','동쪽 하늘이 밝아 온다. 왕관 없는 새벽. 새 결계가 대륙을 감싸며 선다.'),
  s1000('aren','섰다. 국왕 한 사람이 아니라, 우리가 세운 결계다.','determined'),
  s1000('lia','이제 정해야 해요. 이 결계를 누가, 어떻게 지탱할지.','concerned'),
  s1000('eric','함께 정하자. 처음부터 그렇게 해 왔으니까.','determined')]
};
export const FRONTIER_V100={
 'pre:29':{actors:['aren','eric','lia','kai'],lines:[['lia','왕관의 심장이에요. 벨라드가 계승 의식을 끝내려 해요. 우리는 그 자리에 새 결계의 의식을 세울 거예요.','concerned'],
  ['kai','M22에서 정한 길대로 의식 지점이 놓였어. 그걸 지키면서 벨라드를 쳐야 해.','concerned'],
  ['aren','벨라드와는 내가 할 말이 있다. 에릭, 그가 일기토를 청하면 네가 정해라.','sad'],['eric','네.','determined']]},
 'after:29':{actors:['aren','eric','lia','sain'],lines:[['sain','국왕이… 편히 잠들었어요.','sad'],
  ['aren','벨라드는 무릎을 꿇었다. 이제 그를 어떻게 할지 정해야 한다.','concerned'],['lia','재판, 추방… 어느 쪽이든 세 깃발이 지켜볼 거예요.','concerned']]},
 'after:29:trial':{actors:['aren','eric','bellard','leonora'],lines:[['leonora','벨라드는 세 깃발의 법정에 섭니다. 봉인 명령도, 통제된 전쟁도 모두 기록될 거예요.','determined'],
  ['bellard','부인하지 않겠다. 기록하라. 다음에 같은 계산을 하는 자가 읽도록.','sad'],['eric','기록은 벌이 아니라, 다시 그러지 않으려는 것입니다.','determined']]},
 'after:29:exile':{actors:['aren','eric','bellard','cassian'],lines:[['cassian','왕도를 떠나라, 벨라드. 철왕관의 법은 칼을 거둔 자를 베지 않는다.','determined'],
  ['bellard','…결계 가장자리로 가겠다. 그곳에서 그 밤을 갚을 일이 있겠지.','sad'],['aren','그곳 사람들을 지켜 주시오. 그게 당신의 계산이 될 수 있다면.','sad']]},
 'after:29:offer':{actors:['aren','eric','bellard','lucien'],lines:[['bellard','청이 있다. 내 기억을 새 결계에 바치겠다. 잿빛 밤의 기억을. …누가 시켜서가 아니다.','sad'],
  ['lucien','스스로 하는 맹세라면, 성화가 증인이 되겠습니다.','determined'],
  ['aren','벨라드. …고맙다.','sad'],['bellard','이제야 맹세가 무엇인지 알겠군. 그 밤의 징집병들이 하지 못한 것을.','sad']]},
 'pre:30':{actors:['aren','eric','lia','elina'],lines:[['lia','마지막이에요. 새 결계가 서는 새벽까지만 버티면 돼요.','determined'],
  ['elina','세 깃발이 모두 왔어요. 처음 회담장에서 서로 칼을 겨누던 사람들이에요.','determined'],['aren','그리고 오늘은 같은 쪽을 본다.','determined'],['eric','새벽까지.','determined']]},
 'after:30':{actors:['aren','eric','lia','kai','sain','elina'],lines:[['aren','결계가 섰다. 이제 마지막 결정이다.','determined'],
  ['lia','누가 이 결계를 지탱할지요. 어느 길도 정답은 아니에요. 각자 얻는 것과 치르는 값이 있어요.','concerned'],
  ['kai','우리가 걸어온 길이 어떤 문을 열어 뒀는지 보자.','concerned'],['eric','함께 정하자.','determined']]}
};
export const ADVISOR_V100={
 29:[['lia','에릭, 왕관의 심장이에요. 벨라드와의 결전이에요.','concerned'],['eric','조건은?'],
  ['lia','벨라드를 두 번 쓰러뜨려야 해요 — 두 번째는 왕관의 힘을 빌린 모습이에요. 그때까지 의식 지점 셋 가운데 둘 이상이 서 있으면 이겨요.','concerned'],
  ['lia','의식 지점 두 곳이 풀리거나 TURN 14를 넘기면 실패예요. 장수가 곁에 있는 의식 지점은 아군 턴마다 HP +10이에요. TURN 2에 일기토 — 거절하면 아렌이 벨라드에게 말을 건네요.','determined'],['eric','끝내자.','determined']],
 30:[['lia','에릭, 마지막 싸움이에요. 결계의 심장을 새벽까지 지켜요.','determined'],['eric','조건은?'],
  ['lia','TURN 8이 끝날 때까지 결계의 심장이 서 있으면 이겨요. 부서지면 실패예요. 세 깃발의 부대가 모두 함께 싸워요.','concerned'],
  ['lia','재의 물결은 TURN 2, 4, 6에 와요. 4가 가장 커요. 그리고 끝나면… 엔딩을 골라요.','determined'],['eric','새벽까지.','determined']]
};
export const ADVISOR_AFTER_V100={
 29:[['lia','에릭, 국왕이 쉬었어요. 새 결계가 버티고 있어요.','sad'],['eric','다음은?'],['lia','마지막 재의 물결이 와요. 새벽까지 결계의 심장을 지켜요.','determined'],['eric','준비하자.','determined']],
 30:[['lia','에릭, 새 결계가 섰어요.','determined'],['eric','이제는?'],['lia','군단이 걸어온 길이 열어 둔 엔딩 가운데 하나를 골라요. 고른 뒤에도 진영은 그대로 남아요.','concerned'],['eric','함께 정하자.','determined']]
};
const cmd1000=s=>s.command?` · 아렌의 군령 「${({hold:'지켜라',advance:'나아가라',leaveNoOne:'한 사람도 두고 가지 않는다'})[s.command]}」`:'';
export const COUNCIL_V100={
 29:s=>({terrain:`Heart of the Crown · 왕관의 심장 · 옥좌 단 / 의식 지점 셋(${({king:'옥좌 곁',council:'세 모퉁이',oath:'홀을 가로지르는 한 줄'})[s.campaign?.choices?.act3_choice]||'세 모퉁이'})`,intel:'벨라드(2단계) · 의식 기사 4 · 의식사 3(의식 지점을 노림) · 회색 망토 2. TURN 3 의식 기사 2, TURN 5 회색 망토 2, TURN 7 의식사·의식 기사',plan:`의식 지점 둘 이상 지키기 · 벨라드 2단계 격파 · TURN 2 일기토 또는 아렌의 마지막 말${cmd1000(s)}`}),
 30:s=>({terrain:'Crownless Dawn · 왕관의 심장 앞 광장 · 북쪽 가장자리(재) / 남쪽 결계의 심장',intel:'재의 짐승 6. TURN 2 짐승 4, TURN 4 가장 큰 물결(재에 삼켜진 기사 2·짐승 4), TURN 6 짐승 2·기사 2. 세 깃발의 부대 6(지시 가능)',plan:`TURN 8까지 결계의 심장 지키기${cmd1000(s)}`})
};
// The rite points' places, told at the start of M29 by the path chosen at M22.
for(const [k,v] of Object.entries(PATH_LINE))STORY_V100[`29:path:${k}`]=[s1000('lia',v,'concerned')];

