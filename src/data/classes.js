// v0.5.0 class progression data (D-047/D-048, APPROVED_DIRECTION; names and numbers tunable after play-tests).
// Tier 1 = the classes heroes start with. Tier 2 = promotion after ACT I, confirmed by a trial battle.
// Promotion adds one new tactical action per hero; stat changes stay small (GAME_DESIGN_PRINCIPLES).
export const PROMOTION_LEVEL=6;
export const CLASS_TREE={
 eric:[{tier:1,key:'knight',name:'Apprentice Knight',ko:'견습 기사'},
  {tier:2,key:'guardianKnight',name:'Guardian Knight',ko:'수호기사',action:'bulwark',bonus:{maxHP:4,def:2},growth:{def:1},skillNote:'Guard가 원거리·마법의 첫 피격도 대신 받는다.'}],
 elina:[{tier:1,key:'archer',name:'Archer',ko:'궁수'},
  {tier:2,key:'ranger',name:'Ranger',ko:'레인저',action:'overwatch',bonus:{maxHP:3,atk:2},growth:{},profile:'ranger',skillNote:'숲·마을에서 Aimed Shot 사거리 2–4. 숲 이동 비용 1.'}],
 lia:[{tier:1,key:'mage',name:'Apprentice Mage',ko:'견습 마도사'},
  {tier:2,key:'arcanist',name:'Arcanist',ko:'비전술사',action:'arcane',bonus:{maxMP:4,mag:2},growth:{},skillNote:'Fire Bolt의 저HP MP 추가 비용이 사라진다.'}],
 sain:[{tier:1,key:'healer',name:'Healer',ko:'치유사'},
  {tier:2,key:'emberCleric',name:'Ember Cleric',ko:'성화 사제',action:'recall',bonus:{maxMP:4,res:2},growth:{res:1},skillNote:'Heal 사거리 1–3.'}],
 kai:[{tier:1,key:'rogue',name:'Rogue',ko:'도적'},
  {tier:2,key:'shadowblade',name:'Shadowblade',ko:'그림자 추적자',action:'exchange',bonus:{maxHP:3,spd:2},growth:{},movBonus:1,skillNote:'Quick Strike 뒤에도 남은 이동을 쓸 수 있다.'}]
};
// New tactical actions (one per promoted hero). `mode` is the performAction mode used from Phase D on.
export const CLASS_ACTIONS={
 bulwark:{hero:'eric',name:'Bulwark',ko:'방벽',cost:4,note:'다음 아군 턴까지 에릭과 인접한 칸의 적은 움직일 수 없고, 그 칸에 들어온 적도 그 자리에서 멈춘다.'},
 overwatch:{hero:'elina',name:'Overwatch',ko:'경계 사격',cost:4,note:'적 Phase에 사거리 안으로 처음 들어온 적에게 즉시 사격하고, 명중하면 그 적의 이동을 끝낸다.'},
 arcane:{hero:'lia',name:'Arcane Territory',ko:'마력 지형',cost:6,note:'십자 5칸에 3턴 동안 룬: 아군 MAG +3, 적 RES −2. 화염 지형은 1턴 연장된다.'},
 recall:{hero:'sain',name:'Divine Recall',ko:'귀환의 기도',cost:6,note:'4칸 안의 아군 1명을 세인 옆 빈칸으로 끌어오고 HP 10을 회복한다.'},
 exchange:{hero:'kai',name:'Shadow Exchange',ko:'그림자 교환',cost:3,note:'3칸 안의 아군 또는 인접한 적과 위치를 바꾼다. 바뀐 적은 다음 Phase에 반격할 수 없다.'}
};
// Potential, three steps per hero, read from campaign.tacticalMemory and the hero's discovered clue so
// progress made in v0.2–v0.4 saves counts retroactively. m = tacticalMemory, h = campaign hero record.
const pmN=(m,k)=>m[k]||0,pmSum=(m,re)=>Object.entries(m).filter(([k])=>re.test(k)).reduce((a,[,v])=>a+v,0),pmKeys=(m,re)=>Object.keys(m).filter(k=>re.test(k)&&m[k]>0).length;
export const POTENTIAL={
 eric:[{label:'Guard로 실제 공격을 대신 받기',done:(m,h)=>h.clues.includes('Guardian’s Oath')||pmSum(m,/^guard_eric_/)>0},
  {label:'서로 다른 동료 2명을 Guard로 보호',done:m=>pmKeys(m,/^guard_eric_/)>=2},
  {label:'Guard 보호 누적 5회',done:m=>pmSum(m,/^guard_eric_/)>=5}],
 elina:[{label:'숲·마을에서 사격',done:(m,h)=>h.clues.includes('Overwatch')||pmN(m,'elina_forest_shot')>0},
  {label:'유리한 지형 사격 누적 5회',done:m=>pmN(m,'elina_forest_shot')>=5},
  {label:'봉화 격파 · 세인 엄호 · 지형 사격 10회 중 하나',done:m=>pmN(m,'m6_elina_beacon')>0||pmN(m,'m5_elina_guards_sain')>0||pmN(m,'elina_forest_shot')>=10}],
 lia:[{label:'Fire Bolt로 적 격파',done:(m,h)=>h.clues.includes('Arcane Territory')||pmN(m,'lia_kill')>0},
  {label:'격파 누적 6회 또는 성채 기록 조사(M04)',done:m=>pmN(m,'lia_kill')>=6||pmN(m,'lia_search')>0},
  {label:'봉인석 해제 또는 격파 누적 12회',done:m=>pmN(m,'m6_unseal_lia')>0||pmN(m,'lia_kill')>=12}],
 sain:[{label:'Gentle Hands 연결 회복',done:(m,h)=>h.clues.includes('Divine Recall')},
  {label:'치유 누적 8회',done:m=>pmN(m,'sain_heal')>=8},
  {label:'피난민 치유 · 엘리나 치유(M05) · 치유 16회 중 하나',done:m=>pmN(m,'m6_sain_refugee')>0||pmN(m,'m5_sain_heals_elina')>0||pmN(m,'sain_heal')>=16}],
 kai:[{label:'빠른 이동으로 구출',done:(m,h)=>h.clues.includes('Shadow Exchange')||pmN(m,'kai_rescue')>0},
  {label:'구출·우회 누적 3회',done:m=>pmN(m,'kai_rescue')+pmN(m,'kai_bypass')+pmN(m,'kai_capture')>=3},
  {label:'측면 관문 레버 또는 구출·우회·조사 누적 6회',done:m=>pmN(m,'m6_kai_lever')>0||pmN(m,'kai_rescue')+pmN(m,'kai_bypass')+pmN(m,'kai_capture')+pmN(m,'kai_search')>=6}]
};
// Proficiency ★ counts the hero's signature actions; bonus applies only to promoted heroes (classTier ≥ 2),
// so M01–M06 combat with tier-1 heroes is exactly as released in v0.4.0.
export const PROFICIENCY_STEPS=[1,4,9,16,25];
export const PROFICIENCY_SOURCE={
 eric:m=>pmSum(m,/^guard_eric_/)+pmN(m,'eric_skill'),
 elina:m=>pmN(m,'elina_forest_shot')+pmN(m,'elina_skill'),
 lia:m=>pmN(m,'lia_kill')+pmN(m,'lia_skill'),
 sain:m=>pmN(m,'sain_heal'),
 kai:m=>pmN(m,'kai_rescue')+pmN(m,'kai_bypass')+pmN(m,'kai_capture')+pmN(m,'kai_skill')
};
export const PROFICIENCY_EFFECT={eric:{hit:2},elina:{hit:2},lia:{hit:2},sain:{heal:1},kai:{hit:2}};
