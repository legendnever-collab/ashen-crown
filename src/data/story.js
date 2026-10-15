import {FRONTIER_SCENES,NPC_LINES,ADVISOR_BRIEFINGS} from './frontier-data.js';
const line=(speaker,text,expression='neutral')=>({speaker,text,expression});
export const STORY={
 '1:intro':[line('aren','왕실의 명령을 기다릴 시간이 없다. 에릭, 먼저 주민을 지켜라.','determined'),line('eric','네 판단을 믿는다. 이번에는 한 사람도 놓치지 않겠다.'),line('elina','숲에 궁수, 북쪽에 Garr. 뒤쪽에서도 발소리가 들려요.'),line('lia','스승의 봉인 흔적을 조사하러 머물던 마을이에요. 불길이 기록까지 삼키기 전에 구해야 해요.'),line('sain','명령이나 신분보다 먼저, 다친 사람부터 도와야 합니다.'),line('kai','저 상자… 군용 인장 아닌가? 지금은 사람부터 꺼내자.')],
 '1:turn2':[line('elina','북쪽 숲이 움직입니다. 다음 턴에 양쪽 모서리에서 증원이 올 거예요.','concerned'),line('eric','퇴로를 열어 두자. 주민 곁의 장수부터 움직여.')],
 '1:turn4':[line('boss','우리도 굶고 있다! 피난민을 붙잡아라!','determined'),line('sain','굶주림이 무고한 사람을 해칠 이유가 될 수는 없어요. 서둘러 구조해요.','concerned')],
 '1:encounter':[line('boss','왕국은 우리를 버렸다. 이제 스스로 살아남을 뿐이다.'),line('eric','그러면서 이 마을도 버리려는 거냐. 칼을 내려라.','determined')],
 '1:boss':[line('boss','이 상자는… 우리에게 남은 마지막 몫이었다.','sad'),line('elina','군용 인장이 있어요. 누가 이들에게 보급한 거죠?'),line('aren','관찰한 사실만 기록하자. 아직 배후를 단정할 수 없다.')],
 '1:rescue':[line('sain','길이 열렸어요. 제 손을 잡고 안전한 곳으로 가세요.'),line('kai','먼저 살아남아. 이야기는 그 다음이다.')],
 '1:end':[line('aren','마을은 지켰지만 이 군용 물자는 설명되지 않는다.'),line('elina','살아남은 습격자들이 숲으로 도망갔어요. 추격할 수 있어요.'),line('eric','장수들이 돌아왔다. 이번 일의 책임을 함께 확인하자.')],
 '2:intro':[line('elina','숲길은 제가 압니다. 퇴로를 막고 끝내겠어요.','determined'),line('sain','저들 중에는 탈영병과 피난민도 있어요. 살아 있는 증언이 필요합니다.'),line('kai','HP를 절반까지 낮추고 인접하면 생포할 수 있어. 우회로는 내가 맡지.'),line('aren','정보를 얻되 동료를 위험에 몰지 않는다. 생포 여부는 현장의 판단에 맡긴다.')],
 '2:turn2':[line('elina','도주 대장이 북쪽 출구로 향해요. 이대로면 놓쳐요!','concerned'),line('kai','숲을 가로지르면 앞을 잡을 수 있어. 길목에 서자.')],
 '2:encounter':[line('boss','우린 군인도 산적도 아니야. 집으로 가게 해 줘!'),line('sain','칼을 놓으면 살 길을 찾을 수 있어요. 하지만 마을을 해친 책임은 남습니다.')],
 '2:capture':[line('boss','상자는 버려진 성채에서 받았다. 누가 명령했는지는 몰라.'),line('elina','그 말만으로 죄가 사라지는 건 아니야.','determined'),line('sain','맞아요. 살아서 책임지게 하는 것도 우리의 선택입니다.'),line('aren','보급로를 기록한다. 포로는 구호대에 인계하라.')],
 '2:end':[line('aren','군용 상자의 흔적은 숲길 너머로 이어진다. 진술이 없더라도 조사는 계속한다.'),line('sain','마을 사람들이 다리로 모이고 있어요. 추격대가 오기 전에 길을 열어야 해요.'),line('elina','지금은 피난로가 먼저예요. 숲의 흔적은 기억해 둘게요.')],
 '3:intro':[line('eric','다리는 좁다. 앞을 막는 동안 주민을 건너보내라.','determined'),line('sain','부상자가 있어요. 곁을 지키면 스스로 움직일 수 있어요.'),line('kai','내가 우회해서 안전한 길을 확보하지. 무조건 혼자 버티지 마, 에릭.'),line('aren','10턴 안에 구조와 철수를 마친다. 모두가 북쪽 안전 구역으로 돌아와야 한다.')],
 '3:turn2':[line('kai','후방에 추격병이 보여. 다음 턴이면 들어온다!','concerned'),line('eric','세인을 보호할게. 카이, 주민들의 길을 부탁한다.')],
 '3:encounter':[line('boss','다리를 넘기 전에 멈춰라!'),line('aren','저들의 목적은 아직 모른다. 지금은 탈출로를 지킨다.')],
 '3:rescue':[line('sain','부상자도 안전한 곳으로 갔어요. 남은 장수들이 돌아올 차례예요.'),line('eric','방패는 동료가 돌아올 때까지 들고 있겠다.')],
 '3:guard':[line('sain','에릭! 제 대신 칼을 받으셨군요. 지금 치료하겠습니다.','concerned'),line('eric','방패 뒤에서는 네가 사람을 살린다. 혼자 견디는 전투가 아니야.')],
 '3:bond':[line('eric','네가 도망칠 거라 생각했다. 내가 틀렸군.'),line('kai','혼자 살겠다는 사람도 돌아갈 곳은 필요해. 오늘은 여기였지.'),line('sain','두 분 덕분에 누군가의 내일이 남았어요.'),line('aren','다른 방식으로 같은 사람을 지켰다. 이것을 우리 군단의 기억으로 남기자.')],
 '3:loss':[line('sain','모두를 구하지는 못했어요. 이 이름을 잊지 않겠습니다.','sad'),line('aren','판단의 책임을 함께 지겠다. 남은 사람을 끝까지 지키자.','concerned')],
 '3:end':[line('aren','잿빛 밤에도 나는 명령서를 들고 있었다. 봉인 명령 때문에 피난민들이 갇혔지.','sad'),line('eric','네가 혼자 짊어질 일이 아니다. 이번에는 우리가 함께 판단한다.'),line('aren','성채의 보급 기록을 확인하자. 명령이 어디에서 시작됐는지 알아야 한다.','determined'),line('lia','돌 아래 남은 기록을 찾을게요. 진실이 사람을 해치지 않도록 함께요.')],
 defeat:[line('aren','철수한다. 이번 판단을 돌아보고 다시 준비하자.','sad')]
};
export const SPEAKERS={aren:{id:'aren',name:'Aren Valter',ko:'아렌',team:'commander'},eric:{id:'eric',name:'Erik',ko:'에릭'},elina:{id:'elina',name:'Elina',ko:'엘리나'},lia:{id:'lia',name:'Lia',ko:'리아'},sain:{id:'sain',name:'Sain',ko:'세인'},kai:{id:'kai',name:'Kai',ko:'카이'}};

for(const [key,lines]of Object.entries(FRONTIER_SCENES))STORY[key]=lines.map(([speaker,text],i)=>({...line(speaker,text,i%4===1?'concerned':i%4===2?'determined':'neutral'),stage:key.startsWith('pre:1')||key==='raid'||key==='after:1'?'village':'camp',focus:i%3,actors:['aren','eric','elina','lia','sain','kai']}));
for(let mission=1;mission<=3;mission++)for(const phase of ['preparation','aftermath'])for(const [id,copy]of Object.entries(NPC_LINES)){
 const lines=copy.map(text=>line(id,text));
 const contextual={eric:'손이 떨리는 병사부터 쉬게 하자.',elina:'자국은 남아요. 누가 밟고 갔는지 끝까지 찾겠어요.',lia:'아직 모르는 게 많네요. 그래서 더 살펴봐야죠.',sain:'기다려 주세요. 붕대를 한 번 더 감아야 해요.',kai:'쉬는 동안에도 출구는 봐 둬. 버릇이거든.',elder:'빈집에도 돌아올 사람의 자리는 남겨 두겠습니다.',refugee:'오늘은 아이가 잠들었어요. 그걸로 됐어요.',guard:'교대할 병사가 왔습니다. 이제 잠깐 쉬어도 되겠지요.'};
 if(phase==='aftermath'&&contextual[id])lines.push(line(id,contextual[id]));
 STORY[`npc:${mission}:${phase}:${id}`]=lines.map(l=>({...l,inPlace:true,actors:['aren',id],focus:1}));
}
for(const [id,name]of Object.entries({elder:'마을 어른',smith:'대장장이',merchant:'도구 상인',refugee:'피난민',guard:'경비병'}))SPEAKERS[id]={id,name,ko:name,team:'civilian'};
STORY['after:3:quiet']=STORY['after:3'].map(l=>({...l}));STORY['after:3:quiet'][1].text='서로 다른 방식으로 길을 지켰다. 아직 맞춰 가야 할 점이 있겠지.';STORY['after:3:quiet'][2].text='돌아온 사람들이 있잖아. 다음에도 길을 찾아보지.';
STORY['after:3:loss']=[{...line('sain','모든 사람을 구하지는 못했어요. 돌아오지 못한 이름을 기억하겠습니다.','sad'),stage:'camp',actors:['aren','sain']}];
STORY['npc:evidence']=[line('lia','왕실 군용 인장은 확인했어요. 누가 상자를 보냈는지는 알 수 없어요.')];
STORY['npc:bond']=[line('eric','카이와 함께 세인을 지킨 일을 기억한다. 서로 다른 방식으로 같은 사람을 지켰지.'),line('kai','돌아올 곳이 있다는 걸 그날 알았어.')];

SPEAKERS.advisor={id:'advisor',name:'Operations Advisor',ko:'작전 참모',team:'civilian'};
for(let mission=1;mission<=3;mission++)for(const phase of ['preparation','aftermath']){
 const lines=phase==='aftermath'?(mission===3?[['advisor','함께 돌아온 이들을 살피겠습니다. 성채로 향할 다음 작전은 아직 준비되지 않았습니다.'],['eric','지금은 동료들을 쉬게 하자.']]:[['advisor','전투 기록을 정리하고 있습니다. 동료들을 살핀 뒤 다음 이동을 결정하시지요.']]):ADVISOR_BRIEFINGS[mission];
 STORY[`npc:${mission}:${phase}:advisor`]=lines.map(([speaker,text])=>({...line(speaker,text),inPlace:true,actors:['eric','advisor']}));
}
