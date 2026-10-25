import {stageHubFor,hubFor} from './hubs-v05.js';
import {FRONTIER_SCENES,NPC_LINES,ADVISOR_BRIEFINGS,HUBS} from './frontier-data.js';
import {NPC_TALK,ADVISOR_AFTER} from './talk-v06.js';
import {STORY_V06,FRONTIER_V06,ADVISOR_V06} from './story-v06.js';
import {STORY_V04,FRONTIER_V04,ADVISOR_V04} from './story-v04.js';
import {STORY_V05} from './story-v05.js';
import {STORY_WORLD} from './story-world.js';
import {LAST_MISSION} from './missions.js';
Object.assign(FRONTIER_SCENES,FRONTIER_V04);Object.assign(ADVISOR_BRIEFINGS,ADVISOR_V04,ADVISOR_V06);
const line=(speaker,text,expression='neutral')=>({speaker,text,expression});
export const STORY={
 '1:intro':[line('aren','왕실 명령을 기다릴 여유는 없다. …에릭, 주민부터 지켜라.','determined'),line('eric','알았다. 이번엔 한 사람도 안 놓친다. 엘리나, 적은 어디 있지?'),line('elina','숲에 궁수, 북쪽엔 가르. …뒤쪽에서도 발소리가 나요. 기분 나쁘게.','concerned'),line('lia','뒤쪽까지요? 불이 번지면 사람도 기록도 다 잃어요! 스승님 흔적을 쫓다 머문 마을인데, 여기서 끝나게 둘 순 없어요.'),line('sain','리아 말대로 서둘러야겠네요. 다친 분은 신분이 어떻든 제가 먼저 돕겠습니다.'),line('kai','그럼 세인 갈 길은 내가 터 줄게. …근데 저 상자 봤어? 군용 인장이야. 뭐, 그건 사람부터 꺼내고 보자.')],
 '1:turn2':[line('elina','북쪽 숲이 움직여요. 다음 턴, 양쪽 모서리로 증원이 붙을 거예요.','concerned'),line('eric','양쪽이라… 그럼 증원 붙기 전에 퇴로부터 열어 둬. 주민 옆에 있는 사람부터 움직여.')],
 '1:turn4':[line('boss','우리도 굶고 있단 말이다! 피난민을 잡아!','determined'),line('sain','굶주림이 뭔지는 저도 알아요. 그래도 그게 사람을 해칠 이유는 안 됩니다. …다들 서둘러요!','concerned')],
 '1:encounter':[line('boss','왕국은 우릴 버렸어. 이젠 알아서 살아남을 뿐이다.'),line('eric','버려진 기분이 어떤지는 안다. 그렇다고 이 마을까지 버리게 둘 순 없다. 칼 내려.','determined')],
 '1:boss':[line('boss','그 상자는… 우리한테 남은 마지막 몫이었다.','sad'),line('elina','몫이요? 군용 인장이 찍힌 상자가요? 누가 이걸 당신들한테 대 준 거죠?'),line('aren','엘리나, 본 것만 적어 둬라. …배후는 아직 단정하지 않는다.')],
 '1:rescue':[line('sain','길이 열렸어요. 제 손 잡으세요, 안전한 데로 모실게요.'),line('kai','세인 따라가면 돼. 일단 살아. 얘기는 그다음에 하고.')],
 '1:end':[line('aren','마을은 지켰다. 하지만… 이 군용 물자는 설명이 안 돼.'),line('elina','설명할 사람들은 숲으로 달아났어요. 지금 쫓으면 잡아요.'),line('eric','쫓는 건 다들 돌아온 걸 확인하고 나서다. 이번 일, 같이 짚어 보자.')],
 '2:intro':[line('elina','숲길은 제가 알아요. 퇴로 막고 끝내죠.','determined'),line('sain','끝내기 전에요, 엘리나. 저 중엔 탈영병도, 피난민도 있습니다. 살아 있는 증언이 필요해요.'),line('kai','증언이 필요하면 생포지. 대장 HP를 반 아래로 깎고 옆에 붙으면 돼. 우회는 내가 맡을게.'),line('aren','정보는 얻는다. 단, 동료를 사지로 몰면서까지는 아니다. …판단은 현장에 맡기지.')],
 '2:turn2':[line('elina','대장이 북쪽 출구로 빠져요. 이대로면 놓쳐요!','concerned'),line('kai','안 놓쳐. 숲을 가로지르면 앞을 끊을 수 있어. 엘리나, 길목에 서.')],
 '2:encounter':[line('boss','우린 군인도 산적도 아니야! 집에 좀 보내 줘!'),line('sain','집으로 가는 길은 있습니다. 칼을 놓으면요. 다만 마을을 해친 책임은 남아요.')],
 '2:capture':[line('boss','상자는 버려진 성채에서 받았어. 누가 시켰는지는 몰라, 정말이야.'),line('elina','몰랐다는 말 한마디로 죄가 없어지진 않아.','determined'),line('sain','맞아요, 엘리나. 그래서 살려서 책임지게 하는 거예요. 그것도 우리 선택이에요.'),line('aren','버려진 성채라… 보급로는 기록해 둔다. 포로는 구호대에 넘겨라.')],
 '2:end':[line('aren','상자 흔적은 숲길 너머로 이어진다. 진술이 있든 없든… 조사는 계속한다.'),line('sain','그 전에 대장님, 마을 분들이 다리로 모이고 있어요. 추격대보다 먼저 길을 열어야 해요.'),line('elina','그럼 지금은 피난로가 먼저예요. 숲 흔적은 제가 기억해 둘게요.')],
 '3:intro':[line('eric','다리는 좁다. 내가 앞을 막을 테니 주민부터 건너보내.','determined'),line('sain','부상자가 있어요, 에릭. 곁에 누가 있어 주면 스스로 걸을 수 있어요.'),line('kai','그럼 난 돌아가서 안전한 길을 잡을게. 에릭, 앞은 맡기는데… 혼자 다 버티려고 하진 마.'),line('aren','카이 말이 맞다. 열 턴. 그 안에 구조와 철수를 끝낸다. …전원, 북쪽 안전 구역으로 돌아와라.')],
 '3:turn2':[line('kai','뒤에 추격병이 보여. 다음 턴이면 들이닥쳐!','concerned'),line('eric','알았다. 세인은 내가 지킨다. 카이, 주민들 길 좀 부탁해.')],
 '3:encounter':[line('boss','다리 건너기 전에 멈춰!'),line('aren','멈출 이유는 없다. …놈들 목적은 아직 모르지만, 지금은 탈출로만 지킨다.')],
 '3:rescue':[line('sain','부상자분들도 안전한 곳으로 가셨어요. 이제 우리가 돌아갈 차례예요.'),line('eric','그래. 다들 돌아갈 때까지 방패는 내가 들고 있지.')],
 '3:guard':[line('sain','에릭! 저 대신 칼을 받으셨잖아요… 바로 치료할게요.','concerned'),line('eric','방패 뒤에서 넌 사람을 살려. 혼자 버티는 싸움이 아니야.')],
 '3:bond':[line('eric','네가 도망칠 줄 알았다. …내가 틀렸군.'),line('kai','틀린 건 아니야. 예전 같았으면 그랬겠지. 근데 혼자 살겠다는 놈한테도 돌아갈 데는 필요하거든. 오늘은 여기였고.'),line('sain','그 덕분에 누군가에게 내일이 남았어요. 두 분 다 고마워요.'),line('aren','방식은 달라도 같은 사람을 지켰다. 이 일은 군단의 기억으로 남기자.')],
 '3:loss':[line('sain','모두를 구하진 못했어요. 이 이름들… 잊지 않겠습니다.','sad'),line('aren','그 판단의 무게는 같이 진다. 남은 사람은 끝까지 지키자.','concerned')],
 '3:end':[line('aren','잿빛 밤에도… 난 명령서를 쥐고 있었다. 그 봉인 명령 때문에 피난민들이 갇혔지.','sad'),line('eric','그걸 너 혼자 짊어질 필요는 없어. 이번엔 같이 정한다.'),line('aren','…그래. 그럼 같이 정하자. 성채의 보급 기록부터 확인한다. 명령이 어디서 시작됐는지 알아야 해.','determined'),line('lia','기록 찾는 건 제 몫이죠! 진실이 사람을 다치게 하지 않도록, 같이요.')],
 defeat:[line('aren','철수한다. …이번 판단을 돌아보고, 다시 준비하자.','sad')]
};
export const SPEAKERS={chronicle:{id:'chronicle',name:'연대기',ko:'연대기'},aren:{id:'aren',name:'아렌 발터',ko:'아렌',team:'commander'},eric:{id:'eric',name:'에릭',ko:'에릭'},elina:{id:'elina',name:'엘리나',ko:'엘리나'},lia:{id:'lia',name:'리아',ko:'리아'},sain:{id:'sain',name:'세인',ko:'세인'},kai:{id:'kai',name:'카이',ko:'카이'}};

for(const [key,lines]of Object.entries(FRONTIER_SCENES))STORY[key]=lines.map(([speaker,text,expression],i)=>({...line(speaker,text,expression||(i%4===1?'concerned':i%4===2?'determined':'neutral')),stage:stageHubFor(key),focus:i%3,actors:['aren','eric','elina','lia','sain','kai']}));
// Generic NPC copy (kept for the shopkeepers' keys and as a fallback); v0.6 hub talks below replace it per story moment.
for(let mission=1;mission<=LAST_MISSION;mission++)for(const phase of ['preparation','aftermath'])for(const [id,copy]of Object.entries(NPC_LINES))
 STORY[`npc:${mission}:${phase}:${id}`]=copy.map(text=>({...line(id,text),inPlace:true,actors:['eric',id],focus:1}));
for(const [id,name]of Object.entries({elder:'마을 어른',smith:'대장장이',merchant:'도구 상인',refugee:'피난민',guard:'경비병'}))SPEAKERS[id]={id,name,ko:name,team:'civilian'};
STORY['after:3:loss']=[{...line('sain','모두를 구하진 못했어요. 돌아오지 못한 이름들, 기억하겠습니다.','sad'),stage:stageHubFor('after:3'),actors:['aren','sain']}];
STORY['npc:evidence']=[line('lia','왕실 군용 인장은 확실해요. 근데 누가 보냈는지는… 아직 몰라요.')];
STORY['npc:bond']=[line('eric','카이랑 같이 세인을 지킨 날은 기억한다. 방식은 달라도 같은 사람을 지켰지.'),line('kai','돌아올 데가 있다는 거, 그날 알았어.')];

SPEAKERS.advisor={id:'advisor',name:'작전 보좌관',ko:'작전 보좌관',team:'civilian'};
SPEAKERS.baldrick={id:'baldrick',name:'발드릭 로엔',ko:'발드릭',team:'enemy',kind:'lion'};
// v0.6 ACT II (PROPOSED names, D-060 Hangul): Thea the Iron Crown escort captain, Cassian the Dominion's leader.
SPEAKERS.thea={id:'thea',name:'테아',ko:'테아',team:'ally'};SPEAKERS.cassian={id:'cassian',name:'카시안',ko:'카시안',team:'enemy'};
for(let mission=1;mission<=LAST_MISSION;mission++)for(const phase of ['preparation','aftermath']){
 const lines=phase==='aftermath'?ADVISOR_AFTER[mission]:ADVISOR_BRIEFINGS[mission];
 const actors=lines.some(([who])=>who==='advisor')?['eric','lia','advisor']:['eric','lia'];
 STORY[`npc:${mission}:${phase}:advisor`]=lines.map(([speaker,text])=>({...line(speaker,text),inPlace:true,actors}));
}

// D-062 hub talks: Erik is the participant and answers each companion; Aren keeps command and his own
// Ashen Night memories. Townsfolk speak under the name they have in that hub (촌장, 진영 관리인 …).
for(const [moment,talks]of Object.entries(NPC_TALK)){const [mission,phase]=moment.split(':'),hub=HUBS[hubFor(+mission,phase)];
 for(const [id,lines]of Object.entries(talks)){const label=SPEAKERS[id]?.team==='civilian'?hub?.npcs.find(n=>n.id===id)?.name.split(' · ')[0]:null;
  STORY[`npc:${moment}:${id}`]=lines.map(([speaker,text,expression])=>({...line(speaker,text,expression),...(label&&speaker===id?{name:label}:{}),inPlace:true,actors:['eric',id],focus:speaker==='eric'?0:1}));}}
Object.assign(STORY,STORY_V04);
Object.assign(STORY,STORY_V06);
for(const [key,{actors,lines}]of Object.entries(FRONTIER_V06))STORY[key]=lines.map(([speaker,text,expression],i)=>({...line(speaker,text,expression||'neutral'),stage:stageHubFor(key),focus:i%3,actors}));
// Thea after the canyon: she joins (D-055 §5) or stays with the Iron Crown; her camp talk follows that.
STORY['npc:8:aftermath:thea:joined']=[['thea','에릭, 군단에서는 정찰 보고를 누구한테 하면 되죠?'],['eric','리아의 작전 탁자로. 그리고 다친 데가 있으면 세인한테 먼저.'],['thea','명령 체계가 생각보다 느슨하네요. …아니, 서로를 먼저 보는 체계겠죠.','determined'],['eric','금방 익숙해질 거다. 오늘은 쉬어.']].map(([sp,t,e])=>({...line(sp,t,e),inPlace:true,actors:['eric','thea'],focus:sp==='eric'?0:1}));
STORY['npc:8:aftermath:thea:parted']=[['thea','에릭, 떠나기 전에 인사하러 왔어요.'],['eric','성하 마을로 돌아가나?'],['thea','네. 수송로는 여전히 제 일이니까요. 그래도 군단이 지나간 길은 기억할게요.','concerned'],['eric','언젠가 그 길에서 다시 보자.']].map(([sp,t,e])=>({...line(sp,t,e),inPlace:true,actors:['eric','thea'],focus:sp==='eric'?0:1}));
Object.assign(STORY,STORY_V05);
Object.assign(STORY,STORY_WORLD);
// M06 camp: each companion's reason to stay replaces the generic preparation talk (PROPOSED wording).
for(const [npc,hero]of [['aren','eric'],['elina','elina'],['lia','lia'],['sain','sain'],['kai','kai']])if(STORY[`pre:6:reason:${hero}`])STORY[`npc:6:preparation:${npc}`]=STORY[`pre:6:reason:${hero}`].map(l=>({...l,stage:undefined,inPlace:true,actors:['eric',npc],focus:1}));
