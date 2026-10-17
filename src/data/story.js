import {FRONTIER_SCENES,NPC_LINES,ADVISOR_BRIEFINGS} from './frontier-data.js';
import {STORY_V04,FRONTIER_V04,ADVISOR_V04} from './story-v04.js';
import {LAST_MISSION} from './missions.js';
Object.assign(FRONTIER_SCENES,FRONTIER_V04);Object.assign(ADVISOR_BRIEFINGS,ADVISOR_V04);
const line=(speaker,text,expression='neutral')=>({speaker,text,expression});
export const STORY={
 '1:intro':[line('aren','왕실 명령을 기다릴 여유는 없다. …에릭, 주민부터 지켜라.','determined'),line('eric','알았다. 이번엔 한 사람도 안 놓친다.'),line('elina','숲에 궁수, 북쪽엔 Garr. …뒤쪽에서도 발소리가 나요. 기분 나쁘게.'),line('lia','스승님 봉인 흔적을 쫓다가 머문 마을이에요! 불이 기록까지 삼키기 전에 막아야 해요.'),line('sain','신분이 어떻든, 다친 분부터 돕겠습니다.'),line('kai','저 상자 봤어? 군용 인장이야. …뭐, 일단 사람부터 꺼내자.')],
 '1:turn2':[line('elina','북쪽 숲이 움직여요. 다음 턴, 양쪽 모서리로 증원이 붙을 거예요.','concerned'),line('eric','퇴로부터 열어 둬. 주민 옆에 있는 사람부터 움직여.')],
 '1:turn4':[line('boss','우리도 굶고 있단 말이다! 피난민을 잡아!','determined'),line('sain','배고픔이 사람을 해쳐도 되는 이유는 안 됩니다. 서둘러요.','concerned')],
 '1:encounter':[line('boss','왕국은 우릴 버렸어. 이젠 알아서 살아남을 뿐이다.'),line('eric','그래서 이 마을을 버리겠다고? 칼 내려.','determined')],
 '1:boss':[line('boss','그 상자는… 우리한테 남은 마지막 몫이었다.','sad'),line('elina','군용 인장이네요. 누가 이 사람들한테 이걸 대 준 거죠?'),line('aren','본 것만 적어 둬라. …배후는 아직 단정하지 않는다.')],
 '1:rescue':[line('sain','길이 열렸어요. 제 손 잡으세요, 안전한 데로 모실게요.'),line('kai','일단 살아. 얘기는 그다음에 하고.')],
 '1:end':[line('aren','마을은 지켰다. 하지만… 이 군용 물자는 설명이 안 돼.'),line('elina','도망친 놈들은 숲으로 갔어요. 지금 쫓으면 잡아요.'),line('eric','다들 돌아왔군. 이번 일, 같이 짚어 보자.')],
 '2:intro':[line('elina','숲길은 제가 알아요. 퇴로 막고 끝내죠.','determined'),line('sain','저 중엔 탈영병도, 피난민도 있습니다. 살아 있는 증언이 필요해요.'),line('kai','대장 HP를 반 아래로 깎고 옆에 붙으면 생포야. 우회는 내가 맡을게.'),line('aren','정보는 얻는다. 단, 동료를 사지로 몰면서까지는 아니다. …판단은 현장에 맡기지.')],
 '2:turn2':[line('elina','대장이 북쪽 출구로 빠져요. 이대로면 놓쳐요!','concerned'),line('kai','숲을 가로지르면 앞을 끊을 수 있어. 길목에 서.')],
 '2:encounter':[line('boss','우린 군인도 산적도 아니야! 집에 좀 보내 줘!'),line('sain','칼을 놓으면 살 길은 있습니다. 다만 마을을 해친 책임은 남아요.')],
 '2:capture':[line('boss','상자는 버려진 성채에서 받았어. 누가 시켰는지는 몰라, 정말이야.'),line('elina','그런 말 한마디로 죄가 없어지진 않아.','determined'),line('sain','맞아요. 살아서 책임지게 하는 것도 우리 선택이에요.'),line('aren','보급로는 기록해 둔다. 포로는 구호대에 넘겨라.')],
 '2:end':[line('aren','상자 흔적은 숲길 너머로 이어진다. 진술이 없어도… 조사는 계속한다.'),line('sain','마을 분들이 다리로 모이고 있어요. 추격대보다 먼저 길을 열어야 해요.'),line('elina','지금은 피난로가 먼저예요. 숲 흔적은 제가 기억해 둘게요.')],
 '3:intro':[line('eric','다리는 좁다. 내가 앞을 막을 테니 주민부터 건너보내.','determined'),line('sain','부상자가 있어요. 옆에 있어 주면 스스로 걸을 수 있어요.'),line('kai','난 돌아가서 안전한 길을 잡을게. 에릭, 혼자 다 버티려고 하지 마.'),line('aren','열 턴. 그 안에 구조와 철수를 끝낸다. …전원, 북쪽 안전 구역으로 돌아와라.')],
 '3:turn2':[line('kai','뒤에 추격병이 보여. 다음 턴이면 들이닥쳐!','concerned'),line('eric','세인은 내가 지킨다. 카이, 주민들 길 좀 부탁해.')],
 '3:encounter':[line('boss','다리 건너기 전에 멈춰!'),line('aren','놈들 목적은 아직 모른다. 지금은… 탈출로만 지킨다.')],
 '3:rescue':[line('sain','부상자분들도 안전한 곳으로 가셨어요. 이제 우리가 돌아갈 차례예요.'),line('eric','다들 돌아올 때까지 방패는 내가 들고 있지.')],
 '3:guard':[line('sain','에릭! 저 대신 칼을 받으셨잖아요… 바로 치료할게요.','concerned'),line('eric','방패 뒤에서 넌 사람을 살려. 혼자 버티는 싸움이 아니야.')],
 '3:bond':[line('eric','네가 도망칠 줄 알았다. …내가 틀렸군.'),line('kai','혼자 살겠다는 놈한테도 돌아갈 데는 필요하거든. 오늘은 여기였고.'),line('sain','두 분 덕분에 누군가에게 내일이 남았어요.'),line('aren','방식은 달라도 같은 사람을 지켰다. 이 일은 군단의 기억으로 남기자.')],
 '3:loss':[line('sain','모두를 구하진 못했어요. 이 이름들… 잊지 않겠습니다.','sad'),line('aren','그 판단의 무게는 같이 진다. 남은 사람은 끝까지 지키자.','concerned')],
 '3:end':[line('aren','잿빛 밤에도… 난 명령서를 쥐고 있었다. 그 봉인 명령 때문에 피난민들이 갇혔지.','sad'),line('eric','그걸 너 혼자 짊어질 필요는 없어. 이번엔 같이 정한다.'),line('aren','성채의 보급 기록을 확인하자. 명령이 어디서 시작됐는지 알아야 한다.','determined'),line('lia','돌 밑에 남은 기록은 제가 찾을게요. 진실이 사람을 다치게 하지 않도록, 같이요.')],
 defeat:[line('aren','철수한다. …이번 판단을 돌아보고, 다시 준비하자.','sad')]
};
export const SPEAKERS={aren:{id:'aren',name:'Aren Valter',ko:'아렌',team:'commander'},eric:{id:'eric',name:'Erik',ko:'에릭'},elina:{id:'elina',name:'Elina',ko:'엘리나'},lia:{id:'lia',name:'Lia',ko:'리아'},sain:{id:'sain',name:'Sain',ko:'세인'},kai:{id:'kai',name:'Kai',ko:'카이'}};

for(const [key,lines]of Object.entries(FRONTIER_SCENES))STORY[key]=lines.map(([speaker,text],i)=>({...line(speaker,text,i%4===1?'concerned':i%4===2?'determined':'neutral'),stage:key.startsWith('pre:1')||key==='raid'||key==='after:1'?'village':'camp',focus:i%3,actors:['aren','eric','elina','lia','sain','kai']}));
for(let mission=1;mission<=LAST_MISSION;mission++)for(const phase of ['preparation','aftermath'])for(const [id,copy]of Object.entries(NPC_LINES)){
 const lines=copy.map(text=>line(id,text));
 const contextual={eric:'손 떨리는 병사부터 쉬게 하자.',elina:'발자국은 남아요. 누가 밟고 갔는지 끝까지 찾을 거예요.',lia:'모르는 게 아직 많네요. 그러니까 더 파 봐야죠!',sain:'잠깐만요, 붕대 한 번만 더 감을게요.',kai:'쉬는 동안에도 출구는 봐 둬. 버릇이야.',elder:'빈집에도 돌아올 사람 자리는 남겨 두겠네.',refugee:'오늘은 애가 푹 잠들었어요. 그거면 됐어요.',guard:'교대 병사가 왔습니다. 이제 잠깐은 쉬셔도 됩니다.'};
 if(phase==='aftermath'&&contextual[id])lines.push(line(id,contextual[id]));
 STORY[`npc:${mission}:${phase}:${id}`]=lines.map(l=>({...l,inPlace:true,actors:['eric',id],focus:1}));
}
for(const [id,name]of Object.entries({elder:'마을 어른',smith:'대장장이',merchant:'도구 상인',refugee:'피난민',guard:'경비병'}))SPEAKERS[id]={id,name,ko:name,team:'civilian'};
STORY['after:3:quiet']=STORY['after:3'].map(l=>({...l}));STORY['after:3:quiet'][1].text='방식은 달랐지만 같이 길을 지켰다. 아직 맞춰 갈 게 있겠지.';STORY['after:3:quiet'][2].text='그래도 돌아온 사람이 있잖아. 다음에도 길은 찾아보지 뭐.';
STORY['after:3:loss']=[{...line('sain','모두를 구하진 못했어요. 돌아오지 못한 이름들, 기억하겠습니다.','sad'),stage:'camp',actors:['aren','sain']}];
STORY['npc:evidence']=[line('lia','왕실 군용 인장은 확실해요. 근데 누가 보냈는지는… 아직 몰라요.')];
STORY['npc:bond']=[line('eric','카이랑 같이 세인을 지킨 날은 기억한다. 방식은 달라도 같은 사람을 지켰지.'),line('kai','돌아올 데가 있다는 거, 그날 알았어.')];

SPEAKERS.advisor={id:'advisor',name:'Staff Aide',ko:'작전 보좌관',team:'civilian'};
SPEAKERS.baldrick={id:'baldrick',name:'Baldrick Roen',ko:'발드릭',team:'enemy',kind:'lion'};
for(let mission=1;mission<=LAST_MISSION;mission++)for(const phase of ['preparation','aftermath']){
 const lines=phase==='aftermath'?(mission===LAST_MISSION?[['lia','다들 돌아왔네요. 다음 작전은… 아직 정보가 모자라요. 정리되면 바로 말할게요.'],['eric','지금은 다들 쉬게 하자.']]:mission===3?[['lia','성채로 가는 길은 확보했어요! 동료들 먼저 살펴보고 출발을 정해요.'],['eric','같이 돌아온 사람부터 보자.']]:[['lia','전투 기록 정리하는 중이에요. 동료들 둘러보고 나서 다음 이동을 정해요.']]):ADVISOR_BRIEFINGS[mission];
 const actors=lines.some(([who])=>who==='advisor')?['eric','lia','advisor']:['eric','lia'];
 STORY[`npc:${mission}:${phase}:advisor`]=lines.map(([speaker,text])=>({...line(speaker,text),inPlace:true,actors}));
}

// Erik is the participant, Aren keeps command and his own Ashen Night memories.
const ERIK_REPLIES={aren:'너 혼자 질 짐이 아니야. 병사들은 내가 챙긴다.',elina:'알았다. 다들 돌아올 길도 같이 봐 줘.',lia:'위험한 흔적이 보이면 먼저 말해. 동료부터 지킨다.',sain:'치료에만 집중해. 그동안 옆은 내가 지킨다.',kai:'혼자 빠질 길만 찾지 마. 다 같이 돌아가는 거다.'};
for(let mission=1;mission<=LAST_MISSION;mission++)for(const phase of ['preparation','aftermath'])for(const [id,text]of Object.entries(ERIK_REPLIES))STORY[`npc:${mission}:${phase}:${id}`].push({...line('eric',text),inPlace:true,actors:['eric',id]});
Object.assign(STORY,STORY_V04);
