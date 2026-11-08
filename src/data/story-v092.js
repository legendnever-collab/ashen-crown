// v0.9.2 ACT III 「왕관의 진실」 part 3 — M19 금지된 의식, M20 왕관의 그림자, the awakenings of Lia and Kai (D-089,
// docs/v0.9.0/ACT3_DESIGN.md §4.2, §5, §6). Wording PROPOSED. Reveal rule (STORY_BIBLE): a rite that replaces the oath with
// taken memories cannot leave people as themselves; the thread's owner is the chancellery and its controlled-war plan;
// what each banner does with it is its own choice. The teacher and the old superior stay unnamed (names OPEN, CHARACTER_BIBLE).
// The king, the Ashen Night's failed rite and who signed the sealing order stay for M21–M22 and ACT IV.
const s92=(speaker,text,expression='neutral')=>({speaker,text,expression});
export const STORY_V092={
 '19:intro':[s92('lia','의식진이 넷이에요. 진마다 붙잡힌 피난민이 한 분씩… 진이 그분들의 기억을 거둬요.','concerned'),
  s92('teacher','…리아니? 여기까지 오지 말았어야 했다.','sad'),
  s92('lia','스승님…! 이 의식, 스승님 표기예요. 스승님이 설계하셨어요?','sad'),
  s92('eric','이야기는 나중이다. 의식사부터 막는다. 진 곁에서 봉인을 끊으면 진이 꺼진다고 했지?','determined'),
  s92('lia','네. 그리고 제가 진 가까이 있으면 진이 제대로 돌지 못해요. 스승님한테 배운 거니까요.','determined')],
 '19:drain':[s92('sain','포로들이… 이름을 부르는 소리가 작아져요.','sad'),s92('eric','의식사를 쓰러뜨려! 아니면 진을 꺼라!','determined')],
 '19:stall':[s92('lia','제 마력으로 진을 붙들고 있어요. 오래는 못 버텨요!','determined'),s92('teacher','…그 방식을 아직 기억하는구나.','sad')],
 '19:forgot':[s92('sain','한 분이… 자기 이름을 잊었어요. 숨은 쉬는데, 우리를 보지 못해요.','sad'),
  s92('lia','이게 스승님이 말한 "작은 계승"이에요? 사람이 사람으로 남지 못하잖아요!','sad'),s92('eric','더는 안 된다. 남은 진부터 끈다.','determined')],
 '19:forgot2':[s92('teacher','그만두거라, 리아. 이미 늦었다…','sad'),s92('lia','늦은 건 없어요. 아직 이름을 부를 사람이 남아 있어요!','determined')],
 '19:unseal':[s92('kai','진 하나가 꺼졌어. 포로가 숨을 몰아쉬어.','concerned'),s92('eric','셋 남았다. 서두르자.','determined')],
 '19:unseal:lia':[s92('lia','봉인 해제… 스승님이 가르쳐 주신 순서 그대로예요.','sad'),s92('teacher','그 순서를 나는 사람을 묶는 데 썼고, 너는 푸는 데 쓰는구나.','sad')],
 '19:unseal3':[s92('elina','하나 남았어요!','determined'),s92('eric','끝까지 간다.','determined')],
 '19:reinforce':[s92('elina','북쪽 통로로 의식 기사들이 내려와요!','concerned'),s92('eric','진 곁을 비우지 마라.','determined')],
 '19:end':[s92('teacher','…다 꺼졌구나. 이 의식이 무엇을 남기는지, 너희가 다 보았겠지.','sad'),
  s92('lia','스승님. 왜 이걸 만드셨어요? 이 지식이 사람을 해칠 걸 아셨잖아요.','sad'),
  s92('teacher','알았다. 결계가 무너지면 더 많은 사람이 죽는다고 믿었다. 그래서 재상부가 부르자 갔다. 대신… 의식의 마지막 장은 쓰지 않았다.','sad'),
  s92('lia','저는 같은 지식으로 사람을 지킬 거예요. 그게 스승님께 배운 거라고 믿을래요.','determined')],
 '20:intro':[s92('kai','성문 쪽에서 함성이 들려. 배신한 깃발이 성문을 치고 있어. 이 혼란을 틈타 문서고로 들어간다.','concerned'),
  s92('lia','북쪽은 재상부 문서고, 남쪽은 하층가예요. 하층가에 벌써 불이 붙었어요!','concerned'),
  s92('bellard','소란스럽군. 재의 군단이라고 했나.','neutral'),
  s92('eric','…재상 벨라드.','determined'),
  s92('bellard','민간인을 지키려면 누군가의 기억은 바쳐야 하오. 나는 그 값을 누가 치를지 정하는 사람일 뿐이오. 오늘 밤 그대들이 무엇을 지키는지 보겠소.','neutral'),
  s92('eric','둘 다 지킨다. 문서고와 하층가, 둘 다.','determined')],
 '20:torch':[s92('lia','서기가 서가에 불을 붙였어요! 다음 적 턴이 끝나기 전에 꺼내야 해요!','concerned'),s92('eric','가장 가까운 사람이 간다!','determined')],
 '20:burned':[s92('lia','서가 하나가… 다 타 버렸어요.','sad'),s92('eric','남은 서가는 내주지 않는다.','determined')],
 '20:plan':[s92('lia','계획서예요. "세 깃발의 보급 조정안"… 전쟁을 끌기 위한 물자 배분이 다 적혀 있어요.','concerned'),s92('kai','이 서식… 내가 날랐던 서류랑 같아.','sad')],
 '20:plan2':[s92('lia','계획서 묶음이 맞춰졌어요! 통제된 전쟁… 끈의 주인은 재상부예요.','determined'),s92('eric','이제 하층가로!','determined')],
 '20:evacuate':[s92('sain','한 분을 다리 건너로 보냈어요. 아직 집 안에 사람들이 있어요!','concerned'),s92('eric','불길보다 먼저 닿아라.','determined')],
 '20:lost':[s92('sain','불길 속에서 한 분을… 놓쳤어요.','sad'),s92('eric','남은 사람은 한 명도 놓치지 않는다.','determined')],
 '20:gate':[s92('elina','남쪽 성문이 뚫렸어요! 배신한 깃발 병사들이 하층가로 들어와요!','concerned'),s92('eric','주민 곁을 지켜라.','determined')],
 '20:duel':[s92('sup','오랜만이군. 회색 장부를 버리고 도망친 아이가 군단의 칼이 되었다고?','determined'),
  s92('kai','도망친 게 아니야. 내가 나른 끈이 무엇을 묶는지 알고 나서 내려놓은 거지.','determined'),
  s92('sup','그럼 칼로 증명해 봐라. 세 합이다.','determined')],
 '20:duel:hero':[s92('sup','…손이 빨라졌군. 그때보다.','sad'),s92('kai','그때는 무엇을 위해 뛰는지 몰랐으니까.','determined')],
 '20:duel:foe':[s92('sup','아직 멀었다. 장부를 내려놓는다고 지은 죄가 지워지진 않아.','determined'),s92('kai','지우려는 게 아니야. 지고 가려는 거지.','sad')],
 '20:yield':[s92('sup','…여기까지인가. 칼을 거두겠다. 끈을 끊는 건 네 몫이 되겠군.','sad'),s92('kai','도망치지 마. 이번엔 같이 책임지는 거야.','determined')],
 '20:end':[s92('bellard','계획서를 가져가는군. 좋소. 세 깃발이 그걸 읽고도 같은 선택을 하는지 보시오.','neutral'),
  s92('lia','…발코니에서 물러났어요. 막으려 하지도 않았어요.','concerned'),
  s92('kai','벨라드는 늘 그래. 패를 빼앗겨도 판은 자기 거라고 믿어.','concerned'),
  s92('eric','판이 누구 건지는 사람들이 정한다. 하층가 사람들부터 살피자.','determined')],
 // trials (awakening)
 'skirmish:109:intro':[s92('aren','리아, 담장의 틈은 둘이다. 하나는 에릭이 막는다. 다른 하나는 네 결계로 막아라.'),s92('lia','스승님은 결계로 사람을 묶으셨어요. 저는 지키는 데 쓸게요.','determined')],
 'skirmish:114:intro':[s92('aren','카이, 지붕 위 궁수 둘과 교관 셋이다. 그림자 속에서 판을 뒤집어 봐라.'),s92('kai','자리만 바꿔도 싸움이 달라지지. 회색 장부에서 배운 것 중 쓸 만한 게 하나는 있네.','determined')],
 'awaken:lia':[s92('aren','리아. 결계술사. 사람을 묶던 지식으로 사람을 지키는 결계를 친다.'),s92('lia','스승님께 배운 걸 버리지 않을 거예요. 쓰는 곳을 제가 고를 뿐이에요.','determined')],
 'awaken:kai':[s92('aren','카이. 그림자 군주. 그림자 속에서 판 전체를 움직이는 자다.'),s92('kai','예전엔 남의 판에서 끈을 날랐어. 이제는 내가 고른 사람들 곁에서 움직일 거야.','determined')]
};
// Staged camp scenes in the capital's lower city (M19–M20 preparation and after).
export const FRONTIER_V092={
 'after:18:next':{actors:['eric','aren','lia'],lines:[['lia','재상부가 왕도 지하에서 "작은 계승 의식"을 시험한다는 첩보예요. 잡혀간 피난민들의 기억으로요.','concerned'],
  ['aren','왕도로 돌아간다. 하층가에서 기록관이 길을 안다.'],['eric','가자. 이번엔 지하다.','determined']]},
 'pre:19':{actors:['aren','eric','lia','elder','kai'],lines:[['elder','다시 왔군요. 하층가에서 사람들이 사라지고 있어요. 다들 피난민이라 아무도 찾지 않지요.','concerned'],
  ['kai','재상부 의식사들이 데려간 거야. 기록원 지하 수로 아래에 의식장이 있어.','concerned'],
  ['lia','기억으로 결계를 세우는 의식이요… 그 방식을 아는 사람은 많지 않아요.','sad'],['aren','리아. 무엇을 보게 되든 군사는 너다. 판단은 흔들리지 마라.'],
  ['lia','네. 사람부터 구할게요.','determined'],['eric','지하로 간다.','determined']]},
 'after:19':{actors:['aren','eric','lia','sain'],lines:[['lia','스승님은 의식의 마지막 장을 쓰지 않으셨대요. 그래서 의식이 완성되지 못했어요.','concerned'],
  ['sain','그래도 그 의식이 사람에게서 이름을 거뒀어요.','sad'],['aren','스승을 어떻게 할지는 리아가 정해라. 우리가 데려갈 수도, 남겨 둘 수도 있다.'],
  ['eric','어느 쪽이든 군단이 함께 진다.']]},
 'after:19:take':{actors:['eric','lia','aren'],lines:[['lia','스승님은 증인이에요. 이 의식을 누가 시켰는지 사람들 앞에서 말할 수 있는 유일한 분이에요.','determined'],
  ['aren','군단이 지키겠다. 증인을 잃지 않도록.'],['eric','스승님이 말할 날까지 곁에 있겠다.']]},
 'after:19:leave':{actors:['eric','lia','sain'],lines:[['lia','스승님은 여기 남아 이름을 잃은 분들을 돌보시겠대요. 그게 자기 몫이라고요.','sad'],
  ['sain','이름을 다시 부르는 일은… 오래 걸릴 거예요.'],['lia','그래도 스승님 뜻이에요. 저는 제 길을 갈게요.','determined']]},
 'after:19:lia':{actors:['eric','aren','lia'],lines:[['lia','에릭. 저 오늘 알았어요. 스승님을 찾으면 답이 있을 줄 알았는데, 답은 제가 정해야 하는 거였어요.','concerned'],
  ['eric','그럼 정했나?'],['lia','네. 같은 지식으로 사람을 지킬 거예요. 묶는 결계 말고, 지키는 결계로요.','determined'],
  ['aren','그럼 시련을 치러라. 레벨 14, 비전술사. 각성의 자격은 갖췄다.']]},
 'pre:20':{actors:['aren','eric','kai','lia','elder'],lines:[['kai','오늘 밤이야. 배신한 깃발이 성문을 친대. 재상부는 그 틈에 문서고를 비울 거고.','concerned'],
  ['elder','하층가는 성문과 가까워요. 불이라도 나면…','concerned'],['lia','문서고와 하층가, 두 갈래예요. 군단을 나눠야 해요.'],
  ['kai','…회색 망토들. 저 사람들 우두머리는 내가 알아. 예전에 내 상관이었어.','sad'],
  ['aren','카이. 말해 줘서 고맙다. 오늘 밤 그를 만나면 네가 정해라.'],['eric','둘 다 지킨다.','determined']]},
 'after:20':{actors:['aren','eric','kai','lia'],lines:[['lia','계획서를 다 읽었어요. 재상부가 세 깃발에 물자를 대며 전쟁을 끌어 왔어요. "통제된 전쟁"… 전장의 죽음으로 결계를 채우려고요.','concerned'],
  ['kai','그 물자 지시를 세 깃발에 나른 게… 나였어. 회색 장부에 있을 때.','sad'],
  ['aren','카이. 너는 끈이 무엇을 묶는지 알고 나서 내려놓았다. 그것도 선택이었다.'],
  ['eric','옛 상관을 어떻게 할지는 카이가 정해라. 그리고 이 계획서를 어떻게 쓸지는 다 같이 정하자.']]},
 'after:20:release':{actors:['eric','kai','aren'],lines:[['kai','놓아줄게. 대신 회색 장부의 남은 사람들을 거둬 달라고 했어. 끈을 끊는 건 우리 둘의 몫이야.','determined'],
  ['aren','그가 약속을 지키는지는 시간이 말해 주겠지.'],['eric','카이가 믿는다면 군단도 믿는다.']]},
 'after:20:trial':{actors:['eric','kai','aren'],lines:[['kai','재판에 넘길게. 나도 증인으로 설 거야. 내가 나른 서류까지 다 말할 거야.','determined'],
  ['aren','그 자리에 군단장으로 함께 서겠다.'],['eric','같이 진다. 그게 군단이다.']]},
 'after:20:send':{actors:['eric','lia','aren'],lines:[['lia','사본을 세 깃발에 보냈어요. 각자 무엇을 할지는 각자의 몫이에요.','determined'],
  ['aren','깃발들이 이걸 읽고 무엇을 고르는지, 광장에서 보게 되겠지.']]},
 'after:20:keep':{actors:['eric','lia','aren'],lines:[['lia','계획서는 군단이 지녀요. 광장에서 모두 앞에 한 번에 읽을 거예요.','determined'],
  ['aren','그때까지 아무도 이 서류를 빼앗지 못하게 하자.']]},
 'after:20:kai':{actors:['eric','aren','kai'],lines:[['kai','에릭. 나 오늘 처음으로 회색 장부 앞에서 도망치지 않았어.','concerned'],
  ['eric','도망친 적 없다. 내려놓았을 뿐이지.'],['kai','…그래. 이제는 내가 고른 사람들 곁에서 움직일 거야.','determined'],
  ['aren','그럼 시련을 치러라. 레벨 14, 그림자 추적자. 각성의 자격은 갖췄다.']]},
 'after:20:baldrick:halted':{actors:['eric','aren','kai'],lines:[['kai','성문 위에서 발드릭을 봤어. 지휘권을 잃었대. 싸우지도 않고 그냥 왕도를 보고 있었어.','concerned'],
  ['eric','…발드릭이.'],['aren','고원에서 그를 멈춘 게 우리다. 그가 무엇을 보고 있는지는 언젠가 직접 묻자.']]},
 'after:20:baldrick:envoy':{actors:['eric','aren','kai'],lines:[['kai','성문 밖 철왕관 진영에 발드릭이 있었어. 아직 철왕관의 사자로 왕도를 지켜보는 중이야.','concerned'],
  ['eric','…또 만나겠군.'],['aren','그는 다른 방식의 평화를 믿는 자다. 이 계획서를 읽으면 무엇을 고를지 궁금하군.']]},
 'after:20:next':{actors:['eric','aren','lia'],lines:[['lia','계획서 마지막 장에 "왕관의 심장"이라는 말이 있어요. 궁 아래요.','concerned'],
  ['aren','…폐하가 계신 곳이다. M21 「마지막 국왕」은 다음 업데이트에서 이어진다.','sad'],['eric','그때까지 군단을 정비하자.','determined']]}
};
export const ADVISOR_V092={
 19:[['lia','에릭, 왕도 지하 의식장이에요. 의식진이 넷, 진마다 붙잡힌 피난민이 한 분씩 있어요.','concerned'],['eric','어떻게 끄지?'],
  ['lia','진 곁에서 「봉인 해제」하면 꺼져요. TURN 3부터 턴이 시작될 때마다, 의식사가 3칸 안에 있는 진은 포로의 기억을 하나씩 거둬요. 셋이 다 빠지면 이름을 잊어요.','concerned'],
  ['lia','제가 진 2칸 안에 있거나 마력 지형의 룬이 진을 덮으면 그 진은 멈춰요. 두 분이 이름을 잊으면 실패예요. TURN 14 안에 진 넷을 모두 끄면 돼요.','determined'],['eric','의식사부터 떼어 낸다.','determined']],
 20:[['lia','에릭, 오늘 밤은 두 갈래예요. 북쪽 문서고 서가 셋, 남쪽 하층가 주민 여섯.','concerned'],['eric','조건은?'],
  ['lia','서가 두 곳을 조사해 계획서를 확보하고, 주민 네 분 이상을 대피시키면 돼요. 서기가 TURN 3부터 서가에 불을 붙여요. 불붙은 서가는 다음 적 턴이 끝나면 재가 돼요.','concerned'],
  ['lia','하층가 불길은 집에서 집으로 번지고, 정해진 턴마다 다른 집으로 옮겨 붙어요. 회색 망토는 첫 공격을 피해요. 서가 둘이 타거나 주민 셋을 잃으면 실패예요.','determined'],['eric','군단을 나눈다.','determined']]
};
export const ADVISOR_AFTER_V092={
 18:[['lia','에릭, 숲이 지켜졌어요. 세인도 각성의 시련을 치를 수 있어요.'],['eric','다음 일은?'],['lia','왕도 지하의 의식이요. 잡혀간 피난민들을 구해야 해요.','concerned'],['eric','왕도로 가자.','determined']],
 19:[['lia','에릭, 진은 다 꺼졌어요. 저도 이제 각성의 시련을 치를 수 있대요.','determined'],['eric','다음은?'],['lia','배신한 깃발이 성문을 치는 밤, 재상부 문서고예요.','concerned'],['eric','준비하자.','determined']],
 20:[['lia','에릭, 끈의 주인을 찾았어요. 카이도 각성의 시련을 치를 수 있어요.'],['eric','다음 일은?'],['lia','왕관의 심장이요. M21은 다음 업데이트에서 이어져요.','concerned'],['eric','그때까지 정비하자.','determined']]
};
const cmd=s=>s.command?` · 아렌의 군령 「${({hold:'지켜라',advance:'나아가라',leaveNoOne:'한 사람도 두고 가지 않는다'})[s.command]}」`:'';
export const COUNCIL_V092={
 19:s=>({terrain:'Rite Hall · 지하 석조 바닥 / 기둥(통행 불가) / 수로 / 단상 · 의식진 4 (포로 4)',intel:'의식사 4 (진 곁) · 의식 기사 2 · 회색 망토 3 · 의식 감독관 1 (TURN 5까지 단상). TURN 3 북쪽 기사 2, TURN 5 양옆 문 망토 2.',plan:`의식사를 떼어 내고 진 곁에서 봉인 해제 · 리아는 진 2칸 안에서 붙들기 · TURN 14 안에 진 4곳${cmd(s)}`}),
 20:s=>({terrain:"Crown's Shadow · 문서고 바닥(북) / 거리·정원 / 운하와 다리 / 하층가 골목·집(남) · 서가 3 · 주민 6 · 번지는 불",intel:'회색 장부의 우두머리 1 (TURN 5까지 문서고) · 서기 3 · 회색 망토 6 (첫 공격 회피). TURN 3·5·7 남쪽 성문에서 배신한 깃발 2씩.',plan:`군단을 둘로: 문서고 서가 2곳 조사 + 주민 4명 대피 · TURN 2 카이의 일기토${cmd(s)}`})
};
