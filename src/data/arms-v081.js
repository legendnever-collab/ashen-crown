// v0.8.1 「무기」 (D-073 §6, Q5/Q6; names, numbers and prices PROPOSED). Gear tiers II–III, the twelve treasures, one
// hidden objective (숨은 전과) per mission, supply carriers, the towns the legion can revisit and the cut-in lines.
// Names, slots, heroes and prices come from catalog-v08.js; this file adds the numbers the rules use.
import {CATALOG_GEAR,CATALOG_TREASURES} from './catalog-v08.js';
// Gear growth (조조전식): EXP to reach each star (index = star − 1). Normal gear ★1–3, treasures ★1–5.
export const STAR_EXP={gear:[0,30,80],treasure:[0,30,80,150,240]};
// 단련 (forge tempering) price for a full star, by tier (I keeps the v0.3 +1 price of 40 for ★1→★2).
export const TEMPER_PRICE={1:[40,70],2:[80,140],3:[120,200]};
// Tier I keeps its v0.3 ids, prices and bonuses; one star = the old +1 upgrade.
export const GEAR_I_GROW={ironBlade:{atk:1},huntingBow:{atk:1},longbow:{hit:4},crystalStaff:{mag:1},mercyStaff:{res:1},daggers:{atk:1},heavyShield:{res:1},lightShield:{def:1},travelCloak:{def:1},trailBoots:{res:1},focusCharm:{def:1}};
// Tier II–III: [bonus, one star]. Extra keys: crit (critical %), dodge (enemy hit −), heal (Sain's heal +), chargeDmg (Thea's
// Charge +), rangedCut (damage from 2+ tiles −), resist (status chance −%), poisonImmune.
const ARMS_STATS={
 steelGreatsword:[{atk:4},{atk:1}],knightLance:[{atk:3,chargeDmg:2},{atk:1}],ironwoodBow:[{atk:3},{atk:1}],
 plateCuirass:[{def:4,spd:-1},{def:1}],towerShield:[{def:2,rangedCut:2},{def:1}],lancerMail:[{def:2,res:2},{def:1}],steelGauntlets:[{atk:2},{atk:1}],runeforgedBlade:[{atk:6},{atk:1}],
 twinSabers:[{atk:3,spd:1},{atk:1}],repeatingCrossbow:[{atk:2,hit:10},{atk:1}],emberRod:[{mag:4},{mag:1}],shadowStiletto:[{atk:3,spd:1},{atk:1}],
 merchantCoat:[{def:1,res:2,spd:1},{res:1}],luckyCoin:[{crit:5},{crit:2}],windCharm:[{dodge:10},{dodge:3}],duelistRapier:[{atk:5,crit:5},{atk:1}],
 flameStaff:[{mag:2,heal:3},{heal:1}],pilgrimMace:[{atk:3},{atk:1}],pilgrimMantle:[{res:3,resist:25},{res:1}],sanctumTome:[{mag:3,res:2},{mag:1}],
 wardenShield:[{def:3},{def:1}],chrismCharm:[{poisonImmune:1},{res:1}],votiveBand:[{mag:2,res:1},{mag:1}],cathedralStaff:[{mag:4,heal:5},{heal:1}],
 crownGuardLance:[{atk:5,def:1},{atk:1}],crownGuardShield:[{def:5,res:2},{def:1}],leagueSaber:[{atk:5,spd:2},{atk:1}],leagueLongbow:[{atk:4,hit:10},{atk:1}],
 paladinMace:[{atk:5,res:2},{atk:1}],flameVestment:[{res:5,mag:2},{res:1}],
 // v0.9.0 (D-079, PROPOSED): the capital's lower-city forge
 royalSaber:[{atk:6,def:1},{atk:1}],archiveBow:[{atk:5,hit:10},{atk:1}],wardRod:[{mag:6},{mag:1}],courtVestment:[{res:4,def:2},{res:1}],greyMantle:[{def:2,spd:2,dodge:5},{def:1}],oathRing:[{def:1,mag:2,res:2},{res:1}],
 // v0.9.3 (D-092): a capital lance for Thea and a mace for Ines
 royalLance:[{atk:6,chargeDmg:2},{atk:1}],royalMace:[{atk:6,res:1},{atk:1}]
};
// Where each item is sold. home: the town hub; after: the mission whose clear puts it on the shelf; premium: on the shelf
// from the legion's first visit (expensive, meant to be bought on a later visit); trust: the faction and the stage needed.
const ARMS_HOME={castletown:{arrive:6,trust:'iron'},velmar:{arrive:8,trust:'free'},pilgrim:{arrive:10,trust:'flame'},capital:{arrive:14,trust:null}};
const ARMS_SALE={
 steelGreatsword:['castletown',7],knightLance:['castletown',7],ironwoodBow:['castletown',7],plateCuirass:['castletown',8],towerShield:['castletown',8],lancerMail:['castletown',8],steelGauntlets:['castletown',8],runeforgedBlade:['castletown','premium'],
 twinSabers:['velmar',9],repeatingCrossbow:['velmar',9],emberRod:['velmar',9],shadowStiletto:['velmar',10],merchantCoat:['velmar',10],luckyCoin:['velmar',10],windCharm:['velmar',10],duelistRapier:['velmar','premium'],
 flameStaff:['pilgrim',11],pilgrimMace:['pilgrim',11],pilgrimMantle:['pilgrim',11],sanctumTome:['pilgrim',12],wardenShield:['pilgrim',12],chrismCharm:['pilgrim',12],votiveBand:['pilgrim',12],cathedralStaff:['pilgrim','premium'],
 royalSaber:['capital',15],archiveBow:['capital',15],wardRod:['capital',15],courtVestment:['capital',16],greyMantle:['capital',16],oathRing:['capital','premium'],royalLance:['capital',15],royalMace:['capital',16],
 crownGuardLance:['castletown','trust'],crownGuardShield:['castletown','trust'],leagueSaber:['velmar','trust'],leagueLongbow:['velmar','trust'],paladinMace:['pilgrim','trust'],flameVestment:['pilgrim','trust']
};
export const TOWN_HOME=ARMS_HOME;
const ARMS_STAT_KO={atk:'ATK',def:'DEF',mag:'MAG',res:'RES',spd:'SPD',mov:'MOV',hit:'HIT',crit:'치명',dodge:'회피',heal:'치유',chargeDmg:'돌격 피해'};
export const statText=b=>Object.entries(b).map(([k,v])=>k==='poisonImmune'?'독 면역':k==='rangedCut'?`원거리 피해 −${v}`:k==='resist'?`상태이상 확률 −${v}%`:`${ARMS_STAT_KO[k]||k.toUpperCase()} ${v<0?'−':'+'}${Math.abs(v)}`).join(' · ');
// v0.8.1 gear table entries (merged into frontier-data GEAR).
export const GEAR_V081=Object.fromEntries(CATALOG_GEAR.filter(c=>c.tier>1).map(c=>{const [bonus,grow]=ARMS_STATS[c.id],[home,rule]=ARMS_SALE[c.id];
 return [c.id,{name:c.ko,en:c.en,icon:c.slot==='weapon'?'⚔':c.slot==='armor'?'▣':'✦',slot:c.slot,heroes:c.heroes,price:c.price,bonus,grow,tier:c.tier,home,after:typeof rule==='number'?rule:null,premium:rule==='premium',trust:rule==='trust'?ARMS_HOME[home].trust:null,description:statText(bonus)}];}));
// Treasures (slot 'treasure', never sold): bonus at ★1, one star of `grow`, and the power of their effect by star.
// fx keys read by the rules: pouch (HP healed once below half), hawk (bow range +1), sage (EXP +%), twin (second strike %),
// silence (no counter), mirror (ranged damage halved), clear (status immunity), reliquary (HP per turn), mana (MP per turn),
// lion (adjacent allies DEF +), seal (opening turns with MOV +1 for the legion).
const ARMS_ALL8=['eric','elina','lia','sain','kai','thea','dario','ines','baldrick']; /* v0.10.1: and Baldrick */
const TREASURE_RULES={
 herbPouch:[{},{res:1},'pouch',[15,15,20,20,25],ARMS_ALL8],hawkFeather:[{},{hit:3},'hawk',[1,1,1,1,1],['elina']],sageNotebook:[{},{res:1},'sage',[20,20,25,25,30],ARMS_ALL8],
 windHorseshoe:[{mov:2},{spd:1},null,null,ARMS_ALL8],twinDaggers:[{},{atk:1},'twin',[50,50,75,75,100],ARMS_ALL8],silenceShield:[{},{def:1},'silence',[1,1,1,1,1],ARMS_ALL8],
 mirrorCuirass:[{},{res:1},'mirror',[1,1,1,1,1],ARMS_ALL8],clearCharm:[{},{res:1},'clear',[1,1,1,1,1],ARMS_ALL8],flameReliquary:[{},{def:1},'reliquary',[5,5,7,7,10],ARMS_ALL8],
 manaRing:[{},{mag:1},'mana',[2,2,3,3,4],ARMS_ALL8],lionEpaulette:[{},{def:1},'lion',[1,1,1,1,2],ARMS_ALL8],allianceSeal:[{},{spd:1},'seal',[1,1,2,2,3],ARMS_ALL8],
 // v0.9.0 (D-079): mist — bows and spells keep their reach in the fog
 archivistLens:[{hit:10,crit:5},{hit:2},null,null,ARMS_ALL8],mistLantern:[{res:2},{res:1},'mist',[1,1,1,1,1],ARMS_ALL8],
 // v0.9.1 (D-084): oath — once a battle a blow that would fell the wearer leaves 1 HP; the leaf heals like the reliquary
 oathBadge:[{def:1},{def:1},'oath',[1,1,1,1,1],ARMS_ALL8],groveLeaf:[{res:2},{res:1},'reliquary',[4,4,6,6,8],ARMS_ALL8],
 // v0.9.2 (D-089): the quill restores MP like the mana ring; the ledger silences like the shield of silence
 teacherQuill:[{mag:2},{mag:1},'mana',[2,2,3,3,4],ARMS_ALL8],greyLedger:[{spd:2},{spd:1},'silence',[1,1,1,1,1],ARMS_ALL8],
 // v0.9.3 (D-093): the king's signet steadies those beside the wearer like the lion epaulette; the herald's horn calls the legion on like the alliance seal
 kingsSignet:[{def:2},{def:1},'lion',[1,1,1,1,2],ARMS_ALL8],heraldHorn:[{spd:1},{spd:1},'seal',[1,1,2,2,3],ARMS_ALL8],
 // v0.10.0 (D-100): the alliance banner steadies those beside the bearer like the lion epaulette; the last lantern heals like the reliquary
 allianceBanner:[{atk:1,def:1},{def:1},'lion',[1,1,1,1,2],ARMS_ALL8],lastLantern:[{res:2},{res:1},'reliquary',[4,4,6,6,8],ARMS_ALL8],
 // v0.10.1 (D-102): the seal of the three houses moves the army on the first turn like the alliance seal; the black mane steadies like the lion epaulette
 threeSeals:[{res:1},{res:1},'seal',[1,1,2,2,3],ARMS_ALL8],blackMane:[{atk:2},{atk:1},'lion',[1,1,1,1,2],ARMS_ALL8]
};
export const TREASURE_FX_KO={oath:()=>'전투마다 한 번, 쓰러질 피해를 받아도 HP 1로 버팀',pouch:n=>`HP 절반 아래로 떨어지면 1회 HP +${n}`,hawk:()=>'활 사거리 +1',sage:n=>`얻는 경험치 +${n}%`,twin:n=>`반격을 받으면 한 번 더 공격 (${n}%)`,silence:()=>'이 장수가 공격한 적은 반격하지 못함',mirror:()=>'원거리 피해 절반',clear:()=>'상태이상 면역',reliquary:n=>`턴마다 HP +${n}`,mana:n=>`턴마다 MP +${n}`,lion:n=>`인접 아군 DEF +${n}`,seal:n=>`전투 첫 ${n}턴 전군 MOV +1`,mist:()=>'안개 속에서도 사거리가 줄지 않음'};
export const TREASURES=Object.fromEntries(CATALOG_TREASURES.map(c=>{const [bonus,grow,fx,power,heroes]=TREASURE_RULES[c.id];return [c.id,{name:c.ko,en:c.en,icon:'✧',slot:'treasure',heroes,price:0,bonus,grow,fx,power,treasure:true,tier:'T',description:c.effect}];}));
// Hidden objectives (숨은 전과): Lia's hint, the reward and the test, read from this battle's own record (bf: flags set during
// this battle, also in practice; fell: a deployed hero fell). M02 and M09 give an Elixir; the others a treasure.
const featDef=(missionId,reward,hint,test)=>({missionId,reward,hint,test});
export const FEATS={
 1:featDef(1,'herbPouch','TURN 6 안에 마을을 구한다',(s)=>s.turn<=6),
 2:featDef(2,'elixir','아무도 쓰러지지 않고 도주 대장을 생포한다',(s,bf,fell)=>!!bf.mission_02_prisoner_captured&&!fell),
 3:featDef(3,'hawkFeather','TURN 7 안에 다리를 건너 철수한다',(s)=>s.turn<=7),
 4:featDef(4,'sageNotebook','봉인 메모와 이송 명령서를 모두 찾고 TURN 10 안에 이긴다',(s,bf)=>!!bf.mission_04_seal_notes&&!!bf.mission_04_transfer_orders&&s.turn<=10),
 5:featDef(5,'windHorseshoe','사자 대형을 무너뜨리고 보급 마차 2대를 모두 지킨다',(s,bf)=>bf.mission_05_baldrick_withdrew==='broken'&&bf.mission_05_wagons_saved===2),
 6:featDef(6,'twinDaggers','봉화를 부수고 아무도 쓰러지지 않는다',(s,bf,fell)=>!!bf.mission_06_beacon_destroyed&&!fell),
 7:featDef(7,'silenceShield','마차 3대를 모두 지키고 아무도 쓰러지지 않는다',(s,bf,fell)=>bf.mission_07_wagons_intact===3&&!fell),
 8:featDef(8,'mirrorCuirass','구출 명령으로 주민 3명을 모두 구하고 용병단장을 쓰러뜨린다',(s,bf)=>!!bf.mission_08_captain_defeated&&bf.mission_08_villagers_saved===3),
 9:featDef(9,'elixir','자객 우두머리를 생포하고 대표 3명을 모두 피신시킨다',(s,bf)=>!!bf.mission_09_assassin_captured&&bf.mission_09_delegates_saved===3),
 10:featDef(10,'clearCharm','TURN 8 안에 전쟁을 끝낸다',(s)=>s.turn<=8),
 11:featDef(11,'flameReliquary','화로 3개를 모두 밝히고 순례자 4명이 모두 성소에 닿는다',(s,bf)=>bf.mission_11_braziers===3&&bf.mission_11_arrived===4),
 12:featDef(12,'manaRing','종이 울리기 전에 기록을 확보하고 원장을 생포한다',(s,bf)=>!!bf.mission_12_quiet&&!!bf.mission_12_abbot_captured),
 13:featDef(13,'lionEpaulette','발드릭을 말로 멈추고 피난민 4명을 모두 지킨다',(s,bf)=>bf.mission_13_baldrick==='halted'&&bf.mission_13_refugees===4),
 14:featDef(14,'allianceSeal','지도자와 호위 모두 살아서 TURN 10 안에 빠져나간다',(s,bf)=>(bf.mission_14_escort||0)>=6&&s.turn<=10),
 // v0.9.0 ACT III (D-079, PROPOSED)
 15:featDef(15,'archivistLens','기록 상자 셋을 모두 확보하고 왕도 경비대의 경고를 한 번도 받지 않는다',(s,bf)=>bf.mission_15_boxes===3&&bf.mission_15_watch==='calm'),
 16:featDef(16,'mistLantern','결계석 셋을 모두 조사하고 아무도 쓰러지지 않는다',(s,bf,fell)=>bf.mission_16_echoes===3&&!fell),
 17:featDef(17,'oathBadge','수호 석상 넷을 모두 맹세로 깨우고 서고를 한 번도 밟히지 않는다',(s,bf)=>bf.mission_17_sworn===4&&bf.mission_17_archive==='clean'),
 18:featDef(18,'groveLeaf','결계 고목 셋과 숲지기 여섯을 모두 지킨다',(s,bf)=>bf.mission_18_trees===3&&bf.mission_18_keepers===6),
 // v0.9.2 (D-089, PROPOSED)
 19:featDef(19,'teacherQuill','의식진 넷을 모두 끄고 포로 누구도 이름을 잊지 않는다',(s,bf)=>bf.mission_19_unsealed===4&&bf.mission_19_remembered===4),
 20:featDef(20,'greyLedger','서가 셋을 모두 조사하고 주민 여섯을 모두 대피시킨다',(s,bf)=>bf.mission_20_cabinets===3&&bf.mission_20_residents===6),
 // v0.9.3 (D-093, PROPOSED)
 21:featDef(21,'kingsSignet','고정석 넷을 모두 깨고 국왕의 HP를 절반 아래로 떨어뜨리지 않는다',(s,bf)=>bf.mission_21_anchors===4&&bf.mission_21_king_half===true),
 22:featDef(22,'heraldHorn','전령 셋이 모두 선 채로 TURN 8 안에 세 낭독을 마친다',(s,bf)=>bf.mission_22_heralds===3&&s.turn<=8),
 // v0.10.0 (D-100, PROPOSED)
 23:featDef(23,'allianceBanner','세 지도자가 모두 선 채로 천막을 하나도 빼앗기지 않는다',(s,bf)=>bf.mission_23_leaders===3&&bf.mission_23_tents===3),
 24:featDef(24,'lastLantern','피난민 여덟 명을 모두 관문 안에 들이고 관문을 닫는다',(s,bf)=>bf.mission_24_inside===8),
 // v0.10.1 (D-102, PROPOSED)
 25:featDef(25,'threeSeals','두 지도자가 HP 절반 이상으로 선 채 TURN 8 안에 강경파 대장을 쓰러뜨린다',(s,bf)=>bf.mission_25_leaders_half===true&&s.turn<=8),
 26:featDef(26,'blackMane','발드릭이 칼을 내린다 (합류 또는 협력)',(s,bf)=>bf.mission_26_baldrick==='join'||bf.mission_26_baldrick==='cooperate')
};
// Supply carriers (조조전 식량대): one ordinary enemy per mission carries a crate; defeating it drops this tool into the bag
// (usable at once; kept only if the battle is won, like every battle-time change to the bag).
export const SUPPLY={1:['b3','herb'],2:['b3','antidote'],3:['b3','medium'],4:['t1','net'],5:['s4','ether'],6:['k4','ward'],7:['d4','drum'],8:['m4','bomb'],9:['m3','clarity'],10:['la7','smoke'],11:['r4','clarity'],12:['g7','antidote'],13:['s4','bomb'],14:['k4','medium'],15:['g4','clarity'],16:['s3','bomb'],17:['g4','ether'],18:['l4','medium'],19:['g2','ether'],20:['g6','medium'],21:['g2','ether'],22:['g3','medium']};
// Velmar's rare-goods shelf: one item from another town, changing with every mission cleared (+25%).
export const RARE_MARKUP=1.25;
// Towns the legion can revisit from the world map during preparation (§6.3). reached: the story moment from which they
// are on the list. Only shops, forge, inn and townsfolk are there; the story goes on in the current camp.
export const TOWNS=[
 {hub:'village_raid',name:'잿빛 마을',site:'village',reached:m=>m>=2},
 {hub:'castletown',name:'철관성 성하 마을',site:'stronghold',reached:m=>m>=7},
 {hub:'velmar',name:'벨마르 시장',site:'freecity',reached:m=>m>=9},
 {hub:'pilgrim',name:'순례자 마을',site:'pilgrimvillage',reached:m=>m>=11},
 {hub:'capital',name:'왕도 하층가',site:'capital',reached:m=>m>=15}
];
// Townsfolk on a revisit: a short word on how the town is doing (PROPOSED wording; no new facts about the crown or factions).
export const REVISIT_LINES={
 village_raid:{elder:['에릭 경, 다시 와 줬구먼! 불탄 지붕은 거의 다 새로 얹었네.','대장간도 다시 불을 지폈다네. 필요한 게 있으면 들러 보게.'],refugee:['다리 건너 마을 사람들도 하나둘 돌아오고 있어요.'],guard:['마을 경계는 저희가 맡고 있습니다. 군단은 앞길만 보십시오.']},
 castletown:{elder:['군단이 지나간 뒤로 수송로가 조용해졌소. 성하 사람들도 그걸 알고 있지.','대장간 화로는 밤낮없이 돌아가오. 철관 강철은 여기서만 나오니까.'],refugee:['천막 대신 집을 얻었어요. 아직 좁지만요.'],guard:['성문은 열려 있습니다. 통행증만 보여 주시면 됩니다.']},
 velmar:{elder:['벨마르는 장사꾼의 도시요. 다시 왔으니 진열장부터 보시오. 매번 바뀌거든.','의회도 군단 얘기를 하더군. 좋은 얘기만은 아니지만, 나쁜 얘기도 아니오.'],refugee:['시장이 다시 붐벼요. 그날 일은 다들 기억해요.'],guard:['시장 안에서는 칼을 뽑지 마십시오. 상인들이 놀랍니다.']},
 capital:{elder:['기록원은 조용해졌소. 그 밤 이후로 아무도 상자 얘기를 하지 않지.','하층가 대장간은 왕실 근위대 물건도 다룬다오. 비싸지만 좋은 물건이오.'],refugee:['게시판 앞에 사람들이 모여요. 다들 뭔가를 기억해 내려고 해요.'],guard:['왕도 안에서는 소란을 피우지 마십시오. 그것만 지키면 됩니다.']},
 pilgrim:{elder:['순례길이 다시 열렸소. 성화가 꺼지지 않은 건 그날 덕이오.','대장간에서 성물도 다룬다오. 성화 교단의 손을 거친 물건이지.'],refugee:['밤에도 화로가 켜져 있어서 이제는 덜 무서워요.'],guard:['대성당 쪽은 아직 출입이 엄합니다. 마을 안은 편히 다니십시오.']}
};
// Cut-in lines (§7 B, v0.8.1): a critical hit and the ③ skill show the hero's bust with one line.
export const CUTIN={
 eric:{crit:'물러서지 않는다!',third:'여기서부터는 못 지나간다.'},elina:{crit:'놓치지 않아요.',third:'그 길로 오면 쏩니다.'},lia:{crit:'불길이여, 길을 열어요!',third:'이 땅의 마력, 제가 빌릴게요!'},
 sain:{crit:'용서해 주세요… 지금은 막아야 해요.',third:'돌아오세요. 제가 데려갈게요.'},kai:{crit:'그림자는 등 뒤에 있지.',third:'자리 좀 바꾸자.'},
 thea:{crit:'돌격, 멈추지 마라!',third:'기병대, 나를 따르라!'},dario:{crit:'칼끝은 거짓말을 안 해.',third:'빈틈이 보이는군.'},ines:{crit:'성화의 이름으로!',third:'등불이 우리를 지킨다.'}
};
