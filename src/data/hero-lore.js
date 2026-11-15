// 2026-11-11 play-test (D-108): the hero sheet tells each hero's story — a title, personality, a line of their own, their
// past, the chapters they have lived through (opened mission by mission, so nothing ahead is spoiled), their bonds, and
// how to raise their potential with live progress. Wording follows docs/story (CHARACTER_BIBLE, STORY_BIBLE) and the
// shipped scenes; everything here is PROPOSED and can be rewritten by the user.
const tmN=(m,k)=>m?.[k]||0,tmSum=(m,re)=>Object.entries(m||{}).filter(([k])=>re.test(k)).reduce((a,[,v])=>a+v,0),tmKeys=(m,re)=>Object.keys(m||{}).filter(k=>re.test(k)&&m[k]>0).length;
export const HERO_LORE={
 eric:{title:'군단의 방패',traits:['규율','명예','과도한 보호'],likes:'잘 손질한 방패, 돌아온 동료의 얼굴',dislikes:'남겨지는 사람',quote:'이번엔 끝까지 지킨다.',
  bio:'변경 수비대의 기사이자 아렌의 오랜 전우. 언제나 맨 앞에 서서 동료를 지키는 것을 자기 몫으로 여긴다. 젊은 날 검은 사자 발드릭의 휘하에 있었고, 그날 발드릭이 명령을 어기고 자신만 끌어낸 탓에 남겨진 동료들은 돌아오지 못했다. 그 목숨의 빚과 자책을 오래 혼자 지고 왔다.',
  chapters:[{after:1,text:'잿빛 마을이 불탈 때 맨 앞에서 방패를 들었다. 습격자들의 짐 속에서 왕실 군용 물자가 나왔다.'},
   {after:3,text:'무너진 다리에서 카이가 고른 우회로를 믿고 방패를 세웠다. 방식은 달라도 같은 길을 지켰다.'},
   {after:5,text:'국경에서 옛 상관 발드릭과 마주했다. 그날 남겨진 동료들의 이야기를 처음으로 군단 앞에서 꺼냈다.'},
   {after:6,text:'왕실 명령을 거부하고 재의 군단의 맹세에 섰다.'},
   {after:13,text:f=>({halted:'고원에서 발드릭의 군을 멈췄다. 발드릭은 처음부터 명령이 잘못이었다고 인정했다.',held:'고원에서 발드릭과 해가 질 때까지 맞섰다. 발드릭은 끝내 칼을 거두지 않고 물러났다.',broken:'고원에서 사자 진형을 무너뜨렸다. 발드릭은 다음에도 철왕관의 사자로 오겠다고 했다.'})[f.mission_13_baldrick]||'고원에서 발드릭과 다시 칼을 맞댔다.'},
   {after:17,text:'수호자 성채의 석상 곁에서, 대신 쓰러지는 대신 서서 끝까지 지키겠다고 다짐했다.',awaken:'맹세의 수호자'},
   {after:26,text:f=>({join:'사자의 고개에서 발드릭이 칼을 내렸다. 목숨의 빚을 진 사람이 이제 같은 깃발 아래 선다.',cooperate:'사자의 고개에서 발드릭이 칼을 내렸다. 그는 마지막 작전에 철왕관 기병을 이끌고 함께하기로 했다.',withdraw:'사자의 고개에서 발드릭을 몰아붙였다. 그는 살아서 물러났고, 빚은 아직 매듭지어지지 않았다.'})[f.mission_26_baldrick]||'사자의 고개에서 발드릭과 마지막으로 마주했다.'}],
  bonds:[['aren','오랜 전우. 아렌이 혼자 지던 무게를 나눠 들기로 했다.'],['kai','규율과 생존. 다리 위에서 서로의 방식을 처음 인정했다.'],['baldrick','목숨의 빚. 그를 다시 만나는 날을 피하지 않는다.']]},
 elina:{title:'매의 눈',traits:['관찰','권력 불신','집요함'],likes:'높은 곳, 바람의 방향',dislikes:'근거 없는 명령',quote:'결론은 서두르지 않을 거예요.',
  bio:'수비대 정찰병. 고향을 잃은 뒤로 높은 사람들의 말을 쉽게 믿지 않는다. 숲과 마을에서 쏘는 화살은 빗나가는 법이 드물다. 복수할 상대를 찾던 눈이 조금씩 책임질 사람을 찾는 눈으로 바뀌어 간다.',
  chapters:[{after:2,text:'숲길에서 습격자를 쫓으며 생포와 처벌을 두고 세인과 부딪혔다. 그래도 서두르지 않기로 했다.'},
   {after:6,text:'직접 본 것을 따라 명령을 거부했다. 후회는 없다.'},
   {after:16,text:'잊힌 전장에서 결계석이 거둬 간 고향의 기억을 되찾았다. 복수할 상대는 사람 하나가 아니었다.',awaken:'매의 사수'},
   {after:22,text:'광장에서 잿빛 밤의 기록이 읽히는 것을 끝까지 지켜봤다.'}],
  bonds:[['sain','복수와 구원. 등 뒤를 서로에게 맡기는 사이가 되었다.'],['lia','힘에 대한 두려움. 리아의 마법을 경계하면서도 그 약속을 믿는다.'],['dario','용병은 언제 떠날지 모른다며 지켜보는 중.']]},
 lia:{title:'군단의 군사',traits:['호기심','진실 추구','위험 과소평가'],likes:'오래된 기록, 봉인 문양',dislikes:'지워진 서명',quote:'같은 지식으로 사람을 지킬 거예요.',
  bio:'봉인술을 연구하는 마도사. 사라진 스승의 흔적을 좇아 국경 마을에 머물다 군단과 길을 함께하게 되었다. 군단의 작전 회의를 이끄는 단 한 사람의 군사다.',
  chapters:[{after:1,text:'국경 마을에 머물던 이유 — 사라진 스승의 흔적 — 를 군단에 털어놓았다.'},
   {after:4,text:'버려진 성채의 봉인술 기록에서 스승과 같은 표기법을 찾았다.'},
   {after:16,text:'결계가 바쳐진 기억으로 선다는 사실을 처음 읽어 냈다.'},
   {after:19,text:'왕도 지하에서 스승을 찾았다. 스승은 의식의 마지막 장을 쓰지 않았다. 답은 자신이 정하는 것이었다.',awaken:'결계술사'},
   {after:20,text:'재상부의 「통제된 전쟁」 계획서를 해독했다.'}],
  bonds:[['kai','상호 비밀. 비밀은 언젠가 같이 말하기로 약속했다.'],['elina','리아의 힘을 두려워하는 엘리나에게 억제를 약속했다.'],['aren','진실과 위험 사이의 조율자.']]},
 sain:{title:'새벽의 손',traits:['자비','양심','고집'],likes:'따뜻한 수프, 돌아온 이름',dislikes:'버려지는 부상자',quote:'책임을 묻는 일과 생명을 지키는 일, 둘 다 할 수 있어요.',
  bio:'피난민을 돌보는 치유사. 금빛 성화 문양을 지니고 다닌다. 성화 교단을 떠난 사람이다. 칼을 내려놓은 사람이라면 적이라도 상처를 감아 준다.',
  chapters:[{after:2,text:'생포한 이들의 상처를 감았다. 엘리나와 다른 길을 보면서도 등을 맡겼다.'},
   {after:3,text:'돌아온 이름과 돌아오지 못한 이름을 모두 적어 두었다.'},
   {after:12,text:'침묵의 수도원에서 옛 동료 이네스를 다시 만났다. 이네스는 세인을 「떠난 사람」으로 기억하고 있었다.'},
   {after:18,text:'불타지 않는 숲에서 숲지기들이 해마다 잃는 한 해의 비밀을 알았다. 신앙과 양심을 둘 다 들고 가기로 했다.',awaken:'새벽 사제'},
   {after:21,text:'쉬고 싶다는 국왕의 말을 곁에서 들었다.'}],
  bonds:[['elina','복수와 구원. 엘리나의 앞은 엘리나가, 뒤는 세인이.'],['ines','교단을 떠난 사람과 남은 사람. 이제는 둘 다 지키는 사람이다.'],['eric','보호하는 자와 고치는 자.']]},
 kai:{title:'샛길의 그림자',traits:['실용','회의','몸에 밴 경계'],likes:'아무도 모르는 지름길',dislikes:'남이 짜 놓은 판',quote:'이제는 내가 고른 사람들 곁에서 움직일 거야.',
  bio:'어디서 왔는지 말하지 않던 여행자. 샛길과 지름길에 밝고, 위험한 냄새를 누구보다 먼저 맡는다. 한때 왕실 정보 조직의 끈을 날랐고, 그 끈이 무엇을 묶는지 알고 나서 내려놓았다.',
  chapters:[{after:1,text:'마을 상자 곁에서 수상한 군용 물자를 가장 먼저 알아봤다.'},
   {after:3,text:'무너진 다리에서 우회로를 골라 사람들을 데려왔다. 방패 뒤에 누가 버틸 거라 믿고 고른 길이었다.'},
   {after:6,text:'「그래서, 이제 우린 뭔데?」 — 재의 군단이라는 이름이 그 물음의 답이 되었다.'},
   {after:20,text:'왕도에서 옛 상관, 회색 장부의 우두머리와 마주했다. 세 깃발에 물자 지시를 나른 게 자신이었다고 털어놓았다.',awaken:'그림자 군주'}],
  bonds:[['eric','규율과 생존. 돌아올 데가 있다는 걸 에릭에게서 처음 알았다.'],['lia','상호 비밀의 공범.'],['dario','살아남는 방식이 닮은 사람.']]},
 thea:{title:'철왕관의 창',traits:['질서','책임감','직진'],likes:'정돈된 막사, 새벽 기마',dislikes:'법보다 무거운 처벌',quote:'같이 돌아오는 법부터 배우겠습니다.',
  bio:'테아 코르빈. 철왕관 통령국의 수송 호위대장으로, 질서를 믿지만 처벌의 방식에는 의문을 품는다. 발드릭에게 창을 배웠다.',
  chapters:[{after:8,text:'협곡에서 군단과 함께 수송대를 지켰다. 명령이 없어도 서로 빈자리를 메우는 군단, 사람을 법보다 먼저 보는 방식을 처음 보았다.'},
   {after:14,text:'동맹이 부서진 날, 깃발과 곁에 선 사람 사이에서 선택해야 했다.'},
   {after:24,text:'최후의 국경에서 잿빛 물결을 꿰뚫고 앞장섰다. 철왕관의 창이 아니라 군단의 창으로.',awaken:'흑철 기병대장'},
   {after:26,text:'사자의 고개에서 창을 가르쳐 준 발드릭에게, 그 창은 사람을 지키라고 배운 창이라고 외쳤다.'}],
  bonds:[['eric','군단에선 혼자 앞에 서지 않아도 된다는 걸 알려 준 사람.'],['baldrick','스승. 그에게 배운 건 깃발이 아니라 사람 곁에 서는 법이었다.']]},
 dario:{title:'벨마르의 칼잡이',traits:['계산','자존심','의리'],likes:'좋은 술, 제값 받는 계약',dislikes:'돈 없는 자유를 말하는 사람',quote:'떠나지 않는 걸 보여 주지.',
  bio:'다리오 벤. 벨마르 출신 용병 검사. 자유를 말하지만 돈 없는 자유를 비웃어 왔다. 받은 칼은 반드시 돌려준다.',
  chapters:[{after:10,text:'두 영주의 전쟁에서 돈 없이 마을을 지키는 군단을 처음 보았다. 비웃어 온 「돈 없는 자유」가 거기 있었다.'},
   {after:14,text:'동맹이 부서진 날, 계약서보다 오래 간 계약의 끝은 자신이 정하기로 했다.'},
   {after:25,text:'세 왕가의 깃발이 옛 회담장에서 마주한 날, 등을 돌렸던 깃발의 칼들 앞에서 한 번도 물러서지 않았다.',awaken:'칼의 주인'}],
  bonds:[['kai','살아남는 방식이 닮은 동료.'],['elina','아직 그를 지켜보는 중인 사수.']]},
 ines:{title:'순례의 등불',traits:['신앙','온화함','굳은 의지'],likes:'촛불, 순례길의 노래',dislikes:'불태워지는 기록',quote:'떠난 사람에게도 돌아올 길은 있어야 해요.',
  bio:'성화 교단의 순례 수호자. 교단의 구호를 믿지만 수도원의 소각에는 반대한다. 세인을 「떠난 사람」으로 기억해 왔다.',
  chapters:[{after:11,text:'성화의 행렬에서 순례 수호자로 피난민의 길을 함께 지켰다.'},
   {after:12,text:'침묵의 수도원의 소각을 지켜본 뒤 「지키는 이의 자리는 지켜야 할 사람 곁」이라는 대사제의 말을 새겼다. 떠난 세인에게도 돌아올 길이 있어야 한다고 믿는다.'},
   {after:23,text:'연합 진영의 밤, 습격 속에서 세 깃발의 천막 앞에 문처럼 섰다.',awaken:'새벽 성기사'}],
  bonds:[['sain','떠난 사람이라 기억했던, 그러나 지키는 사람이었던 옛 동료.'],['lia','지식을 공개하는 일의 무게를 함께 고민한다.']]},
 baldrick:{title:'검은 사자',traits:['명예','무게','늦은 결단'],likes:'오래된 군가, 묵묵한 말',dislikes:'사람을 버리는 명령',quote:'이제 나는 군단의 한 사람이다.',
  bio:'발드릭 로엔. 철왕관의 장군, 「검은 사자」. 통일 없이는 평화도 없다고 믿어 왔다. 오래전 명령을 어기고 젊은 에릭 하나를 전장에서 끌어냈다.',
  chapters:[{after:5,text:'국경에서 군단 앞에 처음 섰다. 「통일 없이는 평화도 없다.」'},
   {after:13,text:f=>({halted:'고원에서 군을 멈췄다. 곤란한 건 처음부터 명령이었다고 처음으로 인정했다.',held:'고원에서 해가 질 때까지 칼을 거두지 않았다.',broken:'고원에서 진형이 무너졌지만, 다음에도 철왕관의 사자로 오겠다고 했다.'})[f.mission_13_baldrick]||'고원에서 국가와 명예 사이에서 결단했다.'},
   {after:26,text:'사자의 고개에서 칼을 내렸다. 「국경에서 나는 명령 대신 너희를 택했다. 오늘 다시 택하겠다.」 군단의 아홉 번째 장수.'}],
  bonds:[['eric','그날 끌어낸 젊은 기사. 이제는 같은 깃발 아래.'],['thea','창을 가르친 제자.'],['aren','다른 평화를 믿던 맞수.']]}
};
// How each hero grows: the signature action behind ★ (proficiency) and, for the first five, how each potential step is met
// with its live progress [now, goal] (null when the step is a single event).
export const GROWTH_TIPS={
 eric:{signature:'수호로 동료를 지키거나 수호를 쓰기',steps:[{how:'수호(Guard)를 켠 채 곁의 동료가 받을 공격을 대신 받는다',progress:m=>[Math.min(1,tmSum(m,/^guard_eric_/)),1]},{how:'서로 다른 동료 둘을 수호로 지켜 낸다',progress:m=>[Math.min(2,tmKeys(m,/^guard_eric_/)),2]},{how:'수호로 지켜 낸 횟수를 5번 채운다',progress:m=>[Math.min(5,tmSum(m,/^guard_eric_/)),5]}]},
 elina:{signature:'숲·마을에서 쏘기, 조준 사격 쓰기',steps:[{how:'숲이나 마을 칸에 서서 활을 쏜다',progress:m=>[Math.min(1,tmN(m,'elina_forest_shot')),1]},{how:'유리한 지형에서 쏜 화살을 5번 채운다',progress:m=>[Math.min(5,tmN(m,'elina_forest_shot')),5]},{how:'M06 봉화를 쏘아 떨어뜨리거나, M05에서 세인을 엄호하거나, 지형 사격 10번',progress:m=>[Math.min(10,tmN(m,'elina_forest_shot')),10]}]},
 lia:{signature:'화염탄으로 적 쓰러뜨리기, 화염탄 쓰기',steps:[{how:'화염탄(Fire Bolt)으로 적을 쓰러뜨린다',progress:m=>[Math.min(1,tmN(m,'lia_kill')),1]},{how:'쓰러뜨린 적 6명, 또는 M04 성채 기록 조사',progress:m=>[Math.min(6,tmN(m,'lia_kill')),6]},{how:'M06 봉인석 해제, 또는 쓰러뜨린 적 12명',progress:m=>[Math.min(12,tmN(m,'lia_kill')),12]}]},
 sain:{signature:'치유하기',steps:[{how:'치유할 때 대상 곁의 다친 동료까지 함께 회복시킨다(연결 회복)',progress:null},{how:'치유 8번',progress:m=>[Math.min(8,tmN(m,'sain_heal')),8]},{how:'M06 피난민 치유, M05 엘리나 치유, 또는 치유 16번',progress:m=>[Math.min(16,tmN(m,'sain_heal')),16]}]},
 kai:{signature:'구출·우회·생포·빠른 일격',steps:[{how:'빠른 발로 주민을 구출한다',progress:m=>[Math.min(1,tmN(m,'kai_rescue')),1]},{how:'구출·우회·생포를 합쳐 3번',progress:m=>[Math.min(3,tmN(m,'kai_rescue')+tmN(m,'kai_bypass')+tmN(m,'kai_capture')),3]},{how:'M06 측면 관문 레버, 또는 구출·우회·조사를 합쳐 6번',progress:m=>[Math.min(6,tmN(m,'kai_rescue')+tmN(m,'kai_bypass')+tmN(m,'kai_capture')+tmN(m,'kai_search')),6]}]}
};
export const loreChapters=(id,campaign,tier=1)=>{const done=new Set(campaign?.completed||[]),f=campaign?.flags||{},all=HERO_LORE[id]?.chapters||[];
 /* the awakening is told only once the hero has awakened (the mission opens the trial; the trial awakens) */
 return {open:all.filter(c=>done.has(c.after)).map(c=>({after:c.after,text:(typeof c.text==='function'?c.text(f):c.text)+(c.awaken&&tier>=3?` → 각성 「${c.awaken}」`:'')})),next:all.find(c=>!done.has(c.after))?.after??null};};
