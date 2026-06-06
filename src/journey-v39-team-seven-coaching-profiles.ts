export const DIRECT_CANDIDATE_ID = 'direct-concern-candidate';

export type TeamMemberProfile = {
  id: string;
  label: string;
  role: string;
  workStyle: string;
  customerStyle: string;
  currentSignal: string;
  recentChange: string;
  strength: string;
  risk: string;
  misreadRisk: string;
  oneOnOneReason: string;
  leaderQuestion: string;
  defaultCoachingPurpose: string;
  defaultSelectionReason: string;
  defaultCoachingFocus: string;
  defaultRiskMemo: string;
  isDirect?: boolean;
};

export const COACHING_PURPOSE_OPTIONS = ['먼저 들어보기', '부담 확인', '성장 의미 부여', '실행 기준 합의', '안전선 확인', '역할 설명', '동기 회복', '업무 조정'];

export const TEAM_MEMBER_PROFILES: TeamMemberProfile[] = [
  {
    id: 'kim-jaeho',
    label: '김재호 차장',
    role: '경험 많은 안정형',
    workStyle: '오랜 현장 경험을 바탕으로 스스로 판단해 움직이는 편입니다. 새 양식이나 새 기준보다 검증된 방식과 관계 감각을 더 신뢰합니다.',
    customerStyle: '기존 고객과의 관계 안정성이 높고, 어려운 상황에서도 감정적으로 흔들리지 않습니다. 다만 고객 활동 기록이나 후속조치 기준이 바뀌면 “왜 이렇게까지 해야 하나”라는 거리감이 생길 수 있습니다.',
    currentSignal: '기존 고객 관계는 안정적이지만 새로운 실행 방식에는 속도가 느릴 수 있습니다.',
    recentChange: '회의에서는 동의하지만 실제 기록 방식이나 후속조치 문장에는 예전 습관이 남아 있을 수 있습니다.',
    strength: '관계 안정성, 현장 대응 경험, 후배에게 줄 수 있는 현실 조언',
    risk: '기존 방식 고착, 영업활동 기록·후속조치 기준 변화에 대한 거리감',
    misreadRisk: '팀장이 “경력이 많으니 알아서 하겠지”라고 보면 변화 기준을 맞추는 대화를 놓칠 수 있습니다. 반대로 “변화를 싫어한다”고 단정하면 경험 자산을 잃을 수 있습니다.',
    oneOnOneReason: '경험을 존중하면서도 이번 2주 동안 꼭 맞춰야 할 새 기준을 함께 좁혀야 하기 때문입니다.',
    leaderQuestion: '어려운 고객을 계속 맡기는 것이 신뢰인가, 반복 부담인가?',
    defaultCoachingPurpose: '부담 확인',
    defaultSelectionReason: '경험을 믿고 계속 맡기는 장면이 반복 부담이나 변화 기준 미정렬로 받아들여지고 있는지 확인할 필요가 있습니다.',
    defaultCoachingFocus: '최근 부담, 기존 방식과 새 기준의 차이, 후속조치 기록 기준을 함께 맞춥니다.',
    defaultRiskMemo: '“경험 있으니 알아서 해주세요”로 들리지 않게 인정과 지원 기준을 같이 제시합니다.',
  },
  {
    id: 'kim-moonho',
    label: '김문호 차장',
    role: '책임감 강한 실무형',
    workStyle: '문제가 생기면 먼저 뛰어들어 수습하는 편입니다. 책임감이 강해 거절을 잘 하지 않지만, 그만큼 부담을 조용히 쌓을 수 있습니다.',
    customerStyle: '민감한 고객 상황이나 꼬인 이슈를 안정적으로 처리합니다. 다만 어려운 상황이 반복 배정되면 인정받는 느낌보다 “또 나인가”라는 피로가 커질 수 있습니다.',
    currentSignal: '어려운 고객 대응을 자주 맡지만 부담이 쌓이고 있을 가능성이 있습니다.',
    recentChange: '표면적으로는 문제없이 처리하지만 회의 발언이 줄거나 후배 지원에 냉소가 섞일 수 있습니다.',
    strength: '문제 상황 수습, 책임감, 고객 대응 신뢰도',
    risk: '반복 배정에 따른 번아웃, 인정 없이 어려운 일만 몰리는 느낌',
    misreadRisk: '팀장이 “책임감이 강하니 괜찮다”고 보면 소진 신호를 놓칠 수 있습니다. “불만이 많아졌다”고 보면 실제 부담 구조를 보지 못할 수 있습니다.',
    oneOnOneReason: '잘하는 사람에게 일이 몰리는 구조가 지속 가능한지 확인하고, 조정이 필요한 일을 함께 정해야 하기 때문입니다.',
    leaderQuestion: '이번에도 맡겨야 하는가, 아니면 부담을 덜어주어야 하는가?',
    defaultCoachingPurpose: '부담 확인',
    defaultSelectionReason: '일을 잘한다는 이유로 어려운 상황이 계속 몰리고 있는지 먼저 확인할 필요가 있습니다.',
    defaultCoachingFocus: '최근 부담 수준, 조정이 필요한 일, 팀장이 덜어줄 수 있는 조건을 확인합니다.',
    defaultRiskMemo: '“믿어서 맡긴다”는 말이 반복 부담의 합리화로 들릴 수 있습니다.',
  },
  {
    id: 'yoo-heegwan',
    label: '유희관 과장',
    role: '관찰력 있는 신중형',
    workStyle: '자료와 맥락을 충분히 본 뒤 움직이는 편입니다. 성급한 실행보다 놓친 조건을 확인하려는 성향이 강합니다.',
    customerStyle: '고객 반응의 뉘앙스와 변화 신호를 잘 포착합니다. 다만 관찰한 신호를 다음 행동으로 바꾸는 시점이 늦어질 수 있습니다.',
    currentSignal: '고객 변화 신호는 잘 포착하지만 실행 전환은 늦어질 수 있습니다.',
    recentChange: '회의에서 “조금 더 확인해 보겠습니다”라는 말이 늘고, 실행 시점이 뒤로 밀릴 수 있습니다.',
    strength: '변화 감지, 세밀한 관찰, 고객 반응의 맥락 이해',
    risk: '신중함이 실행 지연으로 이어질 수 있음',
    misreadRisk: '팀장이 “소극적이다”라고 단정하면 관찰력이라는 강점을 잃습니다. 반대로 “꼼꼼해서 괜찮다”고 보면 실행 기준이 흐려질 수 있습니다.',
    oneOnOneReason: '관찰을 존중하되 이번 2주 동안 확인할 기준과 다음 행동 시점을 함께 정해야 하기 때문입니다.',
    leaderQuestion: '더 많은 지시가 필요한가, 더 명확한 실행 기준이 필요한가?',
    defaultCoachingPurpose: '실행 기준 합의',
    defaultSelectionReason: '관찰한 신호가 다음 행동으로 이어지지 않는 이유를 단정하지 않고 확인할 필요가 있습니다.',
    defaultCoachingFocus: '어떤 신호를 언제까지 확인하고, 그다음 어떤 행동으로 옮길지 작은 기준을 정합니다.',
    defaultRiskMemo: '분석을 더 요구하기보다 실행 기준과 시점을 좁히는 대화가 필요합니다.',
  },
  {
    id: 'lee-daeun',
    label: '이대은 대리',
    role: '관계 유지형',
    workStyle: '꾸준한 루틴과 안정적인 관계 관리를 선호합니다. 갑작스러운 확장 과제보다 기존 관계 안에서 품질을 높이는 데 강점이 있습니다.',
    customerStyle: '기존 고객과의 신뢰 기반 대화가 자연스럽습니다. 다만 신규 접점이나 낯선 고객군으로 확장할 때는 자신감이 낮아질 수 있습니다.',
    currentSignal: '기존 고객 관리는 안정적이지만 신규 확장 과제에서는 주저할 수 있습니다.',
    recentChange: '새로운 접점 후보보다 익숙한 고객군 중심으로 활동 기록이 반복될 수 있습니다.',
    strength: '관계 유지, 신뢰 기반 대화, 꾸준한 방문 리듬',
    risk: '늘 하던 고객군에 머물며 성장 기회가 제한될 수 있음',
    misreadRisk: '팀장이 “안정적으로 잘한다”고만 보면 성장 기회가 좁아집니다. 반대로 “도전 의지가 낮다”고 보면 관계 유지 역량을 과소평가할 수 있습니다.',
    oneOnOneReason: '기존 관계 강점을 기반으로 작은 확장 시도를 어떻게 설계할지 함께 정해야 하기 때문입니다.',
    leaderQuestion: '안정 업무만 맡기고 있는 것은 아닌가?',
    defaultCoachingPurpose: '성장 의미 부여',
    defaultSelectionReason: '안정적인 관계 관리가 강점이지만, 성장 기회가 좁아지고 있는지 확인할 필요가 있습니다.',
    defaultCoachingFocus: '기존 관계 강점을 살리면서 새 접점을 작게 시도할 수 있는 범위와 지원을 정합니다.',
    defaultRiskMemo: '갑자기 큰 신규 과제를 맡기면 회피가 커질 수 있으므로 작은 시도부터 합의합니다.',
  },
  {
    id: 'shin-jaeyoung',
    label: '신재영 대리',
    role: '실행 빠른 추진형',
    workStyle: '방향이 정해지면 빠르게 움직이고 후속 접점을 만드는 데 강합니다. 속도가 빠른 만큼 사전 점검을 건너뛸 위험도 있습니다.',
    customerStyle: '고객과의 다음 만남을 빠르게 연결하고 대화 에너지가 높습니다. 다만 표현 안전선, 고객 피로감, 승인자료 범위를 세밀하게 확인해야 합니다.',
    currentSignal: '후속 연결은 빠르지만 표현 안전선과 고객 부담 신호를 놓칠 수 있습니다.',
    recentChange: '성과 압박이 커질수록 “일단 만나보겠습니다”가 늘고, 대화 전 안전선 점검이 짧아질 수 있습니다.',
    strength: '속도, 실행력, 다음 접점 확보',
    risk: '과도한 설득, 표현 리스크, 고객 피로감',
    misreadRisk: '팀장이 속도만 칭찬하면 표현 리스크를 키울 수 있습니다. 반대로 속도를 꺾으면 실행 에너지가 떨어질 수 있습니다.',
    oneOnOneReason: '실행 속도를 살리면서도 표현 안전선과 고객 부담 신호를 함께 맞춰야 하기 때문입니다.',
    leaderQuestion: '속도를 살리면서 안전선을 어떻게 맞출 것인가?',
    defaultCoachingPurpose: '안전선 확인',
    defaultSelectionReason: '실행 속도는 강점이지만, 표현 안전선과 고객 부담 신호를 함께 맞출 필요가 있습니다.',
    defaultCoachingFocus: '방문 전 사용할 수 있는 표현, 피해야 할 표현, 고객 부담 신호를 짧게 점검합니다.',
    defaultRiskMemo: '속도 자체를 꺾기보다 승인자료 범위와 고객 부담 신호 기준을 먼저 맞춥니다.',
  },
  {
    id: 'park-jaeuk',
    label: '박재욱 사원',
    role: '성장 초기형',
    workStyle: '배우려는 의지는 높지만 우선순위와 기록 기준이 아직 안정되지 않았습니다. 큰 과제보다 작은 실행 단위가 필요합니다.',
    customerStyle: '고객 질문을 듣고 메모하려는 태도는 좋지만, 어떤 질문을 남기고 어떤 후속조치로 연결해야 하는지 구조화가 필요합니다.',
    currentSignal: '학습 의지는 있으나 고객 질문 기록과 다음 행동 연결이 아직 약할 수 있습니다.',
    recentChange: '활동량은 늘었지만 기록이 단순 방문 메모에 머물거나 다음 확인 질문이 빠질 수 있습니다.',
    strength: '학습 의지, 새로운 방식 수용, 기록 습관 형성 가능성',
    risk: '업무 크기가 커지면 무엇을 남겨야 하는지 놓칠 수 있음',
    misreadRisk: '팀장이 “아직 부족하다”고만 보면 학습 에너지가 줄어듭니다. 반대로 너무 큰 일을 맡기면 실패 경험이 커질 수 있습니다.',
    oneOnOneReason: '성과 요구보다 먼저 고객 활동 기록과 후속조치의 최소 기준을 맞춰야 하기 때문입니다.',
    leaderQuestion: '무엇부터 맡기면 성장 과제가 될 수 있는가?',
    defaultCoachingPurpose: '역할 설명',
    defaultSelectionReason: '성과를 빨리 요구하기보다 고객 활동 기록과 다음 질문을 남기는 습관을 먼저 맞출 필요가 있습니다.',
    defaultCoachingFocus: '고객 질문 1개, 다음 확인 질문 1개, 후속조치 1개를 남기는 작은 기준부터 합의합니다.',
    defaultRiskMemo: '성과 압박보다 기록 품질과 질문 습관을 먼저 보는 대화가 필요합니다.',
  },
  {
    id: 'moon-gyowon',
    label: '문교원 사원',
    role: 'MZ 성장 탐색형',
    workStyle: '디지털 도구와 자료 정리는 빠르게 익히지만, “왜 해야 하는지”, “어디까지 하면 되는지”, “이 일을 통해 무엇을 배우는지”가 분명할 때 실행 몰입이 높아집니다. 지시 자체를 거부한다기보다 목적, 기준, 피드백 방식을 확인하려는 경향이 있습니다.',
    customerStyle: '방문 전 자료 정리와 고객 활동 Data 정리는 빠르게 할 수 있습니다. 다만 고객 앞에서 말해도 되는 표현, 승인자료 범위, 질문 순서가 명확하지 않으면 조심스러워지고 선배 동행이나 사전 리허설을 요구할 수 있습니다.',
    currentSignal: '업무 지시를 받으면 바로 움직이기보다 목적, 성공 기준, 보고 방식, 피드백 시점을 먼저 확인하려는 모습이 보일 수 있습니다.',
    recentChange: '“일단 따라다니면서 배워”라는 방식에는 답답함을 느끼고, 작은 역할이라도 본인이 맡을 범위와 성장 포인트가 명확할 때 더 적극적으로 움직입니다.',
    strength: '디지털 도구 활용, 고객 활동 Data 정리, 학습 속도, 기준이 명확할 때의 실행 몰입, 새로운 방식 수용',
    risk: '위계적 지시나 암묵적 기대가 강하면 소극적으로 보일 수 있고, 피드백이 늦거나 기준이 모호하면 실행을 망설일 수 있음',
    misreadRisk: '팀장이 “요즘 세대는 힘든 일을 피한다”고 보면 실제로는 기준과 의미를 확인하려는 신호를 놓칠 수 있습니다. 반대로 모든 요구를 맞춰줘야 한다고 보면 책임 기준이 흐려질 수 있습니다.',
    oneOnOneReason: '보수적인 제약영업 조직의 암묵지와 MZ 저연차가 요구하는 명확한 기준 사이를 연결해야 하기 때문입니다. 무엇을 왜 하고, 어디까지 맡고, 어떤 피드백을 받을지 합의할 필요가 있습니다.',
    leaderQuestion: '의미와 기준을 설명해야 하는가, 아니면 현장에서는 일단 부딪혀 보게 해야 하는가?',
    defaultCoachingPurpose: '성장 의미 부여',
    defaultSelectionReason: '문교원 사원은 일을 피하는 것이 아니라 목적, 기준, 성장 포인트가 명확할 때 몰입하는 유형일 수 있으므로 먼저 확인이 필요합니다.',
    defaultCoachingFocus: '이번 2주 동안 맡을 작은 역할, 말해도 되는 표현 범위, 고객 활동 기록 기준, 피드백 시점을 함께 합의합니다.',
    defaultRiskMemo: '“MZ라서 그렇다”고 단정하지 말고, 목적·기준·성장 피드백이 충분히 제시되었는지 먼저 확인합니다.',
  },
];

export const DIRECT_PROFILE: TeamMemberProfile = {
  id: DIRECT_CANDIDATE_ID,
  label: '직접 등록한 팀원',
  role: '익명 등록 후보',
  workStyle: '실제 고민 중인 팀원을 익명으로 등록하면 이곳에 역할/상황이 표시됩니다.',
  customerStyle: '고객명이나 기관명 없이, 관찰 가능한 고객 대응 방식만 적어 주세요.',
  currentSignal: '실제 고민 중인 팀원을 익명으로 등록하면 이곳에 현재 신호가 표시됩니다.',
  recentChange: '최근 달라진 행동이나 반복되는 신호가 있다면 적어 주세요.',
  strength: '관찰 가능한 강점이나 활용 가능한 자원을 적어 주세요.',
  risk: '단정이 아니라 관찰 가능한 리스크 신호를 적어 주세요.',
  misreadRisk: '성격, 태도, 의지 문제로 단정하지 말고 아직 확인하지 못한 맥락을 남겨 주세요.',
  oneOnOneReason: '지금 이 팀원과 먼저 1on1을 해야 하는 이유를 적어 주세요.',
  leaderQuestion: '지금 이 팀원과 먼저 1on1을 해야 하는 이유는 무엇입니까?',
  defaultCoachingPurpose: '먼저 들어보기',
  defaultSelectionReason: '실제 팀에서 지금 가장 먼저 확인해야 할 신호가 있어 1on1 후보로 검토합니다.',
  defaultCoachingFocus: '관찰된 신호, 강점, 리스크를 사실 중심으로 확인하고 9단계에서 대화 흐름으로 바꿉니다.',
  defaultRiskMemo: '실명, 고객명, 병원명, 의료진명, 제품명, 내부 수치, 평가등급, 개인정보는 입력하지 않습니다.',
  isDirect: true,
};
