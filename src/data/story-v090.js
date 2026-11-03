// v0.9.0 ACT III 「왕관의 진실」 part 1 — M15 사라진 기록, M16 잊힌 전장 (D-079, docs/v0.9.0/ACT3_DESIGN.md).
// Wording PROPOSED. Reveal rule (STORY_BIBLE): ACT III shows how the ward works, the king and the chancellor's plan; the
// Ashen Night's causes, who signed the sealing order and why stay for ACT IV (M28). No new fact names Bellard as behind
// everything; the factions' own decisions stay theirs.
const s90=(speaker,text,expression='neutral')=>({speaker,text,expression});
export const STORY_V090={
 '15:intro':[s90('archivist','저 서기들이에요. 잿빛 밤의 상자를 들고 있어요. 재상부 인장이 찍힌 명령서로 오늘 밤 옮긴다더군요.','concerned'),
  s90('aren','상자 셋, 성문 셋. 하나라도 더 남겨야 한다.','determined'),s90('lia','서기들은 싸우지 않아요. 쓰러뜨리면 상자를 놓칠 거예요. 회색 망토들이 길을 막고요.'),
  s90('kai','그리고 왕도 경비대. 저 사람들은 누구 편도 아니야. 코앞에서 칼을 휘두르면 우리를 적으로 볼 거야.','concerned'),s90('eric','싸울 곳은 우리가 고른다. 경비대 곁에서는 칼을 아낀다.','determined')],
 '15:run':[s90('elina','서기들이 움직여요! 북서쪽, 서쪽, 동쪽 성문으로 하나씩요.','concerned'),s90('eric','셋 다 쫓는다. 갈라져서 길목을 끊어.','determined')],
 '15:cloaks':[s90('kai','양쪽 골목에서 회색 망토가 더 와. 노리는 건… 기록관이야!','concerned'),s90('eric','기록관 곁에 한 명은 남아라.','determined')],
 '15:warn':[s90('guard','왕도 안에서 칼을 뽑지 마라! 한 번만 더 소란을 피우면 너희도 잡아들인다!','determined'),s90('lia','경고예요, 에릭. 다음엔 경비대가 칼을 뽑아요.','concerned')],
 '15:watch':[s90('guard','경비대, 무기를 들어라! 저 무리도 잡아들여!','determined'),s90('eric','…싸울 상대가 늘었군. 그래도 경비대는 죽이지 마라. 그들은 제 일을 할 뿐이다.','sad')],
 '15:box':[s90('lia','상자 하나 확보! 잿빛 밤의 날짜가 찍혀 있어요.','determined'),s90('eric','좋다. 다음.')],
 '15:box2':[s90('kai','두 번째 상자. 이제 나머지 하나만 남았어.','determined')],
 '15:escape':[s90('elina','서기 하나가 성문을 빠져나갔어요…','sad'),s90('eric','남은 상자에 집중한다.')],
 '15:archivist':[s90('archivist','기록은… 사람이 지켜야… 하는…','sad'),s90('eric','기록관님!','sad')],
 '15:end':[s90('archivist','이 상자들은 잿빛 밤의 마지막 장이에요. 3년 동안 아무도 열지 못했지요.','concerned'),
  s90('lia','의식 기록이 마지막 장에서 끊겨 있어요. 그리고 이 명부… 「기억 헌납 명부」? 결계석마다 무언가를 바친 기록이에요.','concerned'),
  s90('aren','…야영지에서 읽자. 오늘은 여기까지다.','sad')],
 '16:intro':[s90('lia','안개가 짙어요. 활도 마법도 한 칸 덜 닿을 거예요. 결계석 곁은 이상하게 맑아요.','concerned'),
  s90('elina','이 들판… 처음 오는 곳인데, 길을 알 것 같아요.','concerned'),s90('kai','근처 마을 사람들, 여기서 뭔 일이 있었는지 아무도 몰라. 3년 전 전장이었다는데.'),
  s90('eric','수확자라는 자들이 결계석에서 뭔가를 거둔다고 했지. 그 둘을 막는다.','determined')],
 '16:return:thea':[s90('thea','에릭 경…! 안개 속에서 군단 깃발이 보였어요.','concerned'),s90('eric','테아. 같이 싸우겠나?'),s90('thea','오늘은 깃발이 아니라 곁에 선 사람을 위해서요.','determined')],
 '16:return:dario':[s90('dario','계약이 끝난 줄 알았는데. 안개가 다시 데려다 놓는군.'),s90('eric','칼 한 자루가 필요하다.'),s90('dario','값은 나중에 치르라고. 지금은 같이 베자.','determined')],
 '16:return:ines':[s90('ines','성역의 등불이 이쪽을 가리켰어요. 지켜야 할 사람이 여기 있다고요.','determined'),s90('eric','이네스. 반갑다.'),s90('ines','지키는 이의 자리는 지켜야 할 사람 곁. 오늘은 여기예요.')],
 '16:duel':[s90('cap','재의 군단장 아래 기사여! 회담장에서 우리 깃발을 욕보인 값을 받으러 왔다. 나와 겨뤄라!','determined'),
  s90('eric','…받아들이지. 다른 이들은 손대지 마라.','determined')],
 '16:duel:hero':[s90('cap','큭… 제법이군. 그래도 이 들판은 내줄 수 없다.','sad'),s90('eric','들판이 아니라 사람을 지키러 왔다.','determined')],
 '16:duel:foe':[s90('cap','군단의 방패도 별것 아니군!','determined'),s90('eric','…아직 끝나지 않았다.','sad')],
 '16:harvest':[s90('sain','머리가… 어지러워요. 무언가가 빠져나가는 느낌이에요.','concerned'),s90('lia','결계석이에요! 수확자가 곁에 있는 돌이 가까운 사람의 기억을 거둬요. 돌을 먼저 조사하거나 수확자를 떼어 내요!','concerned')],
 '16:echo:st1':[s90('chronicle','잔영 — 깃발도 없는 병사들이 진흙 속에서 서로의 이름을 부른다. 아무도 대답하지 않는다.','sad'),s90('lia','이 돌이 그날의 기억을 품고 있었어요. 그래서 사람들이 잊은 거예요.','concerned')],
 '16:echo:st2':[s90('chronicle','잔영 — 누군가 쓰러진 병사의 이름을 적은 종이를 결계석 아래 묻는다. 종이가 재가 된다.','sad'),s90('kai','이름을 바치는 의식… 누가 시킨 거지.','concerned')],
 '16:echo:st3':[s90('chronicle','잔영 — 불타는 마을 하나. 아이들이 언덕 위로 달린다. 그 뒤의 길은 안개에 묻혀 있다.','sad'),s90('sain','이곳에 마을이 있었네요. 지도에서도 지워진 마을이요.','sad')],
 '16:echo:st3:elina':[s90('chronicle','잔영 — 불타는 마을 하나. 언덕 위로 달리는 아이들 사이에, 적갈색 머리를 땋은 소녀가 있다.','sad'),
  s90('elina','…저 언덕. 저 우물. 제 고향이에요. 저는 왜 이걸 잊고 있었던 거죠?','sad'),s90('eric','엘리나. 이제 기억했으면, 그걸로 됐다. 같이 끝까지 보자.','determined')],
 '16:reinforce':[s90('kai','북쪽에서 약탈대가 더 와!','concerned')],
 '16:fallen:thea':[s90('thea','에릭 경… 미안해요, 여기까지…','sad')],
 '16:fallen:dario':[s90('dario','젠장… 이번 계약은… 손해군…','sad')],
 '16:fallen:ines':[s90('ines','등불이… 꺼지지 않게…','sad')],
 '16:end':[s90('lia','수확자가 쓰러지자 결계석이 조용해졌어요. 안개도 옅어지고요.','concerned'),
  s90('elina','들판을 기억하는 사람이 이제 저 하나는 있네요.','sad'),s90('eric','그 기억을 혼자 들고 있게 하지 않겠다.','determined')]
};
// Staged camp scenes: the capital's lower city (M15 preparation and after) and the field camp after M16.
export const FRONTIER_V090={
 'pre:15':{actors:['aren','eric','lia','kai','archivist'],lines:[['archivist','재의 군단이라고요? 회담장 소문은 하층가까지 왔지요. 장부의 끈을 쫓는다고.'],['aren','왕실 기록원의 기록관이라 들었소.'],
  ['archivist','그 기록원에서 오늘 밤 잿빛 밤의 상자가 나가요. 재상부 서기들이 옮긴대요. 어디로 가는지는 아무도 몰라요.','concerned'],['kai','재상부라… 끈 끝이 드디어 보이는군.','concerned'],
  ['lia','상자 안에 의식 기록이 있다면, 우리가 찾던 빈칸이 거기 있을 거예요.','determined'],['eric','그럼 오늘 밤 되찾는다.','determined']]},
 'after:15':{actors:['aren','eric','lia','archivist','kai'],lines:[['lia','상자 안 명부를 다 읽었어요. 잿빛 밤 그날 봉인 명령서를 관문에 전한 전령 명단이 있어요.','concerned'],
  ['archivist','명단 맨 끝 이름이… 아렌 발터.','concerned'],['aren','…그래. 그날 밤, 궁에서 명령서를 받아 관문으로 달린 게 나였다.','sad'],['eric','명령서에 누가 서명했는지는 적혀 있나?'],
  ['lia','그 칸은 비어 있어요. 장부의 지워진 서명처럼요.','sad'],['kai','그리고 「기억 헌납 명부」. 결계석마다 누가, 무엇을 바쳤는지. 이름이 아니라 기억을 바친 기록이야.','concerned'],
  ['aren','혼자 짊어지지 않겠다고 했었지. …그 약속을 지키겠다. 이 기록을 어떻게 할지 같이 정하자.','determined']]},
 'after:15:archivist':{actors:['eric','archivist','lia'],lines:[['archivist','제가 맡지요. 기록원은 기록을 지키는 곳이니까요.'],['lia','사본은 제가 머리에 넣어 뒀어요.'],['eric','부탁합니다. 이번엔 지워지지 않게.']]},
 'after:15:keep':{actors:['eric','aren','kai'],lines:[['aren','원본은 군단이 지닌다. 누가 다시 가져가려 하면, 그때 맞선다.'],['kai','들고 다니는 증거는 표적이 되기도 해.','concerned'],['eric','그러니 같이 지킨다.','determined']]},
 'after:15:post':{actors:['eric','archivist','sain'],lines:[['archivist','하층가 게시판에 사본을 붙였어요. 아침이면 다들 읽겠지요.','concerned'],['sain','사람들이 무엇을 잊었는지, 스스로 알 권리가 있어요.'],['eric','진실을 혼자 쥐고 있지 않겠다는 뜻이다.','determined']]},
 'pre:16':{actors:['aren','eric','lia','elina','sain'],lines:[['lia','명부에 적힌 결계석 하나가 서쪽 들판에 있어요. 3년 전 내전의 전장이요.'],['elina','그 들판 이름… 어디서 들은 것 같아요. 기억이 안 나요.','concerned'],
  ['sain','근처 마을 사람들도 그래요. 거기서 무슨 일이 있었는지 아무도 기억하지 못한대요.','concerned'],['aren','그리고 재상부의 "수확자"들이 그 돌 곁에 있다는 첩보다.'],['eric','기억을 거두는 자들이라… 가 보자.','determined']]},
 'after:16':{actors:['aren','eric','lia','elina','kai'],lines:[['lia','이제 알겠어요. 결계는 바쳐진 기억으로 서 있어요. 그날 전장에서 죽은 사람들의 기억, 그리고 그들을 기억하던 사람들의 기억까지요.','concerned'],
  ['kai','그래서 아무도 그 전장을 기억 못 하는 거군. 결계가 먹어 버렸으니까.','concerned'],['elina','제 고향도요. 저는 복수할 상대를 찾았는데… 사람 하나가 아니었어요.','sad'],
  ['aren','명부 첫 장은 "수호자"들의 맹세로 시작한다. 처음엔 스스로 바친 기억이었다는 뜻이다. 그 맹세가 어디서 끊겼는지, 북쪽 고원의 수호자 성채에 답이 있을 거다.','determined'],
  ['eric','그 전에, 이 들판의 결계석을 어떻게 할지 정하자.']]},
 'after:16:return:thea':{actors:['eric','thea'],lines:[['thea','다시 받아 주셔서 고마워요. 떠난 동안 깨달은 게 있어요.'],['eric','무엇을?'],['thea','장군님께 배운 건 깃발을 지키는 법이 아니라 사람 곁에 서는 법이었다는 거요.','determined']]},
 'after:16:return:dario':{actors:['eric','dario'],lines:[['dario','계약서는 찢었어. 이번엔 내 이름으로 남는 거야.'],['eric','환영한다.'],['dario','환영은 술로 받지. 나중에.','determined']]},
 'after:16:return:ines':{actors:['eric','ines','sain'],lines:[['ines','이제부터는 군단의 등불이 될게요.','determined'],['sain','이네스… 반가워요.'],['ines','떠난 사람이라고 기억했었는데, 당신도 지키는 사람이었네요.']]},
 'after:16:break':{actors:['eric','lia','elina'],lines:[['lia','결계석을 부쉈어요. 근처 마을 사람들 기억이 조금씩 돌아올 거예요. 대신 이 땅의 결계는 약해져요.','concerned'],['elina','기억은 돌아와야 해요. 그게 아파도요.'],['eric','그 대가도 우리가 같이 본다.','determined']]},
 'after:16:leave':{actors:['eric','lia','sain'],lines:[['lia','결계석은 그대로 뒀어요. 이 땅은 안전하지만, 잊힌 기억은 돌아오지 않아요.','concerned'],['sain','지금 사는 사람들을 지키는 것도 필요한 일이에요.'],['eric','그 선택의 무게도 잊지 않겠다.']]},
 'after:16:next':{actors:['eric','aren','lia'],lines:[['aren','북쪽 고원으로 간다. 수호자 성채다.'],['lia','M17 「수호자의 맹세」는 다음 업데이트에서 이어져요.'],['eric','그때까지 군단을 정비하자.']]}
};
export const ADVISOR_V090={
 15:[['lia','에릭, 하층가 지도예요. 가운데가 왕실 기록원, 북서·서·동쪽 끝이 성문이에요. 운하에는 다리가 넷 있어요.'],['eric','서기 셋을 막으면 되나?'],
  ['lia','네. TURN 2부터 하나씩 자기 성문으로 달려요. 턴마다 2칸. 쓰러뜨리면 상자를 확보해요. 셋의 행방이 다 정해졌을 때 상자가 둘 이상이면 성공이에요.','determined'],
  ['lia','왕도 경비대는 중립이에요. 경비대 곁 2칸 안에서 싸우면 한 번 경고, 두 번째엔 적이 돼요. 그리고 회색 망토는 TURN 3부터 기록관님을 노려요.','concerned'],['eric','길목은 빠르게, 칼은 조용히.','determined']],
 16:[['lia','에릭, 잊힌 전장이에요. 안개 때문에 활과 마법이 한 칸 덜 닿고, 3칸 밖의 적은 정체가 안 보여요.'],['eric','수확자는?'],
  ['lia','북서쪽과 북동쪽 결계석 곁에 하나씩요. 수확자가 조사하지 않은 돌 곁에 있으면, 턴마다 그 돌 3칸 안의 장수 MP가 2씩 빠져요. 돌을 조사하면 그 주위 안개가 걷히고 수확이 멈춰요.','concerned'],
  ['lia','배신한 깃발의 약탈대가 들판을 뒤지고 있어요. 기사대장이 TURN 3에 에릭에게 일기토를 청할 거예요. 받아도 되고 거절해도 돼요.','determined'],['eric','수확자 둘. 그것만 보고 간다.','determined']]
};
export const COUNCIL_V090={
 15:s=>({terrain:'Royal Lower City · 골목 / 길 / 지붕(궁수 고지) / 운하(다리 4) / 기록원 바닥',intel:'재상부 서기 3 (싸우지 않음, TURN 2부터 성문으로 2칸씩) · 회색 망토 대장 1 · 회색 망토 5 + 지붕 궁수 2. TURN 3·5 양옆 골목에서 회색 망토 2씩. 왕도 경비대 3 (중립).',plan:`서기를 쓰러뜨려 상자 확보 · 셋의 행방이 정해졌을 때 2개 이상이면 승리. 경비대 2칸 안에서 싸우면 경고(1번 허용). 기록관(남쪽) 곁에 수비 한 명.${s.command?' · 아렌의 군령 「지켜라」: 첫 2턴 전군 DEF +2.':''}`}),
 16:s=>{const back=s.missionState?.returning||[];return {terrain:'Forgotten Battlefield · 평지 / 숲 / 폐허 / 강(다리 2) · 안개: 활·마법 사거리 −1, 3칸 밖 적 정보 숨김',intel:`기억 수확자 2 (결계석 곁을 떠나지 않음) · 약탈대 기사대장 1 · 약탈대 6 + 궁수 2. TURN 4 북쪽 2, TURN 6 양옆 2.${back.length?` TURN 2 서쪽에서 ${back.map(id=>({thea:'테아',dario:'다리오',ines:'이네스'})[id]).join('·')} 등장(동맹군).`:''}`,plan:'수확자 둘 격파. 결계석을 조사하면 주위 2칸 안개가 걷히고 수확이 멈춥니다. TURN 3 일기토(공격>필살>수비>공격, 2합 먼저 이기면 승리, 진 쪽 HP −30%).'};}
};
