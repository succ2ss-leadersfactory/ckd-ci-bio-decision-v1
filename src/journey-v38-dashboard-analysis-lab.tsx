import { useMemo, useState } from 'react';

const TEAM_MEMBERS = [
  {
    id: 'M01',
    name: '신재영 대리',
    profile: '접점 활동 적극 수행',
    observation: '고객 접점 활동이 많고 이동 동선도 넓다. 회의에서는 “저는 누구보다 많이 움직이고 있다”고 말하지만, 방문 이후 어떤 대화가 이어졌는지는 설명이 짧다.',
    signals: ['계획 접점 실행률 112%', '핵심 고객군 커버리지 96%', '후속 대화 연결지수 54', 'CRM 기록 품질 64', '컴플라이언스 위험 점검: 주의'],
  },
  {
    id: 'M02',
    name: '이대은 대리',
    profile: '담당처 자율 관리 성향',
    observation: '고객과의 관계와 후속 대화는 안정적이다. 다만 팀 회의에서는 자신의 방식 공유를 부담스러워하고, 동료의 질문에는 “각자 담당처는 본인이 책임지는 것”이라고 선을 긋는다.',
    signals: ['후속 대화 연결지수 128', '고객 인게이지먼트 지수 84', '팀 학습 기여도 42', '실행 인사이트 재사용도 38', 'AI 입력 안전 점검: 안전'],
  },
  {
    id: 'M03',
    name: '박재욱 사원',
    profile: '신규 역할 적응 중',
    observation: 'CRM 기록은 꼼꼼하게 남기지만 고객 앞에서는 질문이 짧아진다. 방문 전 준비 자료는 많지만, 실제 대화에서 고객의 참여를 끌어내는 데 어려움을 느낀다.',
    signals: ['CRM 기록 품질 90', '고객 인게이지먼트 지수 51', '후속 대화 연결지수 48', '팀 학습 기여도 70', '컴플라이언스 위험 점검: 안전'],
  },
  {
    id: 'M04',
    name: '유희관 과장',
    profile: '장기 담당처 관계 보유',
    observation: '담당처와의 관계는 안정적이다. 그러나 새로운 기록 기준이나 실행 방식이 나오면 “현장에서는 그런 방식이 잘 안 맞는다”고 말하며 신중한 태도를 보인다.',
    signals: ['핵심 고객군 커버리지 92%', '고객 대화 지속성 86', 'CRM 기록 품질 55', '팀 학습 기여도 58', '컴플라이언스 위험 점검: 주의'],
  },
  {
    id: 'M05',
    name: '김문호 차장',
    profile: '최근 목표 압박을 크게 느낌',
    observation: '최근 목표 압박을 크게 느끼며 지역 상황과 외부 요인을 자주 언급한다. 실행 변수 중 자신이 바꿀 수 있는 것에 대해서는 말을 아끼는 편이다.',
    signals: ['실행 적시성 59', '후속조치 실행률 52', '고객 인게이지먼트 지수 56', '사전 인사이트 준비도 60', '컴플라이언스 위험 점검: 안전'],
  },
  {
    id: 'M06',
    name: '김재호 차장',
    profile: '현장 요청 대응 속도 강점',
    observation: '현장 요청에는 빠르게 대응하지만 사후 기록과 후속 실행 정리가 뒤로 밀리는 경향이 있다. 즉흥 대응은 강하지만 팀장 판단에 필요한 기록은 부족하다.',
    signals: ['실행 적시성 88', '고객 대화 지속성 82', 'CRM 기록 품질 50', '후속조치 실행률 57', 'AI 입력 안전 점검: 안전'],
  },
];

const ACTION_OUTPUT_OPTIONS = [
  {
    label: '1on1 면담 질문',
    promptGuide: '팀원이 방어적으로 느끼지 않도록 관찰 신호를 확인하는 1on1 질문을 만들어 주세요.',
    outputFormat: '면담 시작 질문 2개, 상황 확인 질문 3개, 마무리 약속 질문 2개',
  },
  {
    label: '이번 주 코칭 포인트',
    promptGuide: '이번 주에 팀장이 짧게 개입할 수 있는 코칭 초점을 행동 중심으로 정리해 주세요.',
    outputFormat: '코칭 초점 3개, 팀장 피드백 문장 3개, 피해야 할 표현 2개',
  },
  {
    label: '실행 점검 기준',
    promptGuide: '활동량이 아니라 고객 반응과 후속 행동을 확인할 수 있는 점검 기준을 만들어 주세요.',
    outputFormat: '점검 기준 5개, 확인 질문 3개, 2주 후 확인 지표 3개',
  },
  {
    label: '강점 활용 역할 제안',
    promptGuide: '팀원의 강점을 팀 전체 실행과 학습에 연결할 수 있는 역할 제안을 만들어 주세요.',
    outputFormat: '강점 활용 역할 2개, 공유 방식 2개, 부담을 줄이는 합의 질문 2개',
  },
  {
    label: '우려 신호 확인 질문',
    promptGuide: '단정하지 않고 우려 신호를 확인할 수 있는 질문을 만들어 주세요.',
    outputFormat: '우려 신호별 확인 질문 5개, 성급한 단정 방지 문장 2개',
  },
  {
    label: '팀 회의 공유용 학습 포인트',
    promptGuide: '개인 평가처럼 보이지 않도록 팀 회의에서 공유할 수 있는 학습 포인트로 바꿔 주세요.',
    outputFormat: '공유 메시지 1개, 학습 포인트 3개, 팀 토의 질문 3개',
  },
  {
    label: '컴플라이언스 안전선 점검 문장',
    promptGuide: '제약영업 맥락에서 위험 표현이나 민감정보 입력을 예방하는 안전선 문장을 만들어 주세요.',
    outputFormat: '방문 전 안전선 3개, AI 입력 전 안전선 3개, 팀장 리마인드 문장 2개',
  },
  {
    label: '후속 대화 연결 코칭 질문',
    promptGuide: '방문 이후 고객 반응과 다음 행동을 연결하도록 돕는 코칭 질문을 만들어 주세요.',
    outputFormat: '방문 직후 질문 3개, 후속 대화 설계 질문 3개, CRM 기록 질문 2개',
  },
  {
    label: '방문 후 기록 점검표',
    promptGuide: '방문 이후 남겨야 할 기록을 고객 반응, 다음 행동, 안전선 중심으로 점검표로 만들어 주세요.',
    outputFormat: '방문 후 10분 점검 항목 7개, 기록 예시 문장 3개',
  },
  {
    label: '고객 질문 연습 스크립트',
    promptGuide: '고객 앞에서 사용할 수 있는 열린 질문과 반응 기록 문장을 연습용으로 만들어 주세요.',
    outputFormat: '방문 전 준비 질문 3개, 고객에게 사용할 열린 질문 5개, 반응 기록 문장 3개',
  },
  {
    label: '통제 가능한 실행 변수 찾기 질문',
    promptGuide: '외부 요인 설명에서 멈추지 않고 팀원이 직접 바꿀 수 있는 실행 변수를 찾도록 질문을 만들어 주세요.',
    outputFormat: '통제 가능 변수 질문 5개, 작은 실행 실험 3개, 팀장 확인 질문 2개',
  },
  {
    label: '작은 실행 약속 카드',
    promptGuide: '2주 안에 실행 가능한 작은 약속을 정리하는 카드 형태로 만들어 주세요.',
    outputFormat: '이번 2주 실행 약속 3개, 시작 조건 2개, 확인 지표 3개',
  },
];

const FORBIDDEN_ITEMS = [
  '실제 고객명·병원명·의료진명',
  '제품명 또는 미승인 제품 표현',
  '실제 매출·처방 수치·내부 전략 수치',
  '개인정보·민감정보',
  '처방 유도나 비교 우위처럼 보이는 표현',
  '팀원에 대한 단정적 낙인 표현',
];

type MemberPrep = {
  observedSignal: string;
  strengthSignal: string;
  concernSignal: string;
  checkQuestion: string;
  doNotAssume: string;
  aiDraft: string;
  finalPrep: string;
};

type PrepState = Record<string, MemberPrep>;
type DeliverableState = Record<string, string[]>;

function emptyPrep(): MemberPrep {
  return {
    observedSignal: '',
    strengthSignal: '',
    concernSignal: '',
    checkQuestion: '',
    doNotAssume: '',
    aiDraft: '',
    finalPrep: '',
  };
}

function formatMemberData(member: typeof TEAM_MEMBERS[number]) {
  return [
    `${member.name}`,
    `- 프로필: ${member.profile}`,
    `- 관찰 장면: ${member.observation}`,
    `- 주요 실행 Data: ${member.signals.join(' / ')}`,
  ].join('\n');
}

function formatMemberSignalsForPrompt(member: typeof TEAM_MEMBERS[number], prep?: MemberPrep, selectedDeliverables?: string[]) {
  const current = prep ?? emptyPrep();
  return [
    `${member.name}`,
    `- 프로필: ${member.profile}`,
    `- 관찰 장면: ${member.observation}`,
    `- 주요 실행 Data: ${member.signals.join(' / ')}`,
    `- 팀원별 관찰 신호: ${current.observedSignal || '아직 작성하지 않았습니다.'}`,
    `- 강점으로 볼 수 있는 신호: ${current.strengthSignal || '아직 작성하지 않았습니다.'}`,
    `- 우려 또는 확인이 필요한 신호: ${current.concernSignal || '아직 작성하지 않았습니다.'}`,
    `- 추가로 확인해야 할 질문: ${current.checkQuestion || '아직 작성하지 않았습니다.'}`,
    `- 성급하게 단정하면 안 되는 점: ${current.doNotAssume || '아직 작성하지 않았습니다.'}`,
    `- 팀장 행동 선택: ${(selectedDeliverables ?? []).length > 0 ? selectedDeliverables?.join(' / ') : '아직 선택하지 않았습니다.'}`,
  ].join('\n');
}

function getSuggestedDeliverables(memberId: string) {
  const map: Record<string, string[]> = {
    M01: ['후속 대화 연결 코칭 질문', '방문 후 기록 점검표'],
    M02: ['강점 활용 역할 제안', '팀 회의 공유용 학습 포인트'],
    M03: ['고객 질문 연습 스크립트', '1on1 면담 질문'],
    M04: ['컴플라이언스 안전선 점검 문장', '우려 신호 확인 질문'],
    M05: ['통제 가능한 실행 변수 찾기 질문', '작은 실행 약속 카드'],
    M06: ['실행 점검 기준', '방문 후 기록 점검표'],
  };
  return map[memberId] ?? [];
}

export function V38DashboardAnalysisLab() {
  const [memberPreps, setMemberPreps] = useState<PrepState>({});
  const [aiSignalResult, setAiSignalResult] = useState('');
  const [selectedDeliverables, setSelectedDeliverables] = useState<DeliverableState>({});
  const [copiedPrompt, setCopiedPrompt] = useState<'signal' | 'prep' | null>(null);

  const completedSignalCount = useMemo(
    () => TEAM_MEMBERS.filter((member) => {
      const current = memberPreps[member.id];
      return Boolean(current?.observedSignal?.trim() || current?.concernSignal?.trim() || current?.checkQuestion?.trim());
    }).length,
    [memberPreps],
  );

  const completedActionChoiceCount = useMemo(
    () => TEAM_MEMBERS.filter((member) => (selectedDeliverables[member.id] ?? []).length > 0).length,
    [selectedDeliverables],
  );

  const completedFinalCount = useMemo(
    () => TEAM_MEMBERS.filter((member) => memberPreps[member.id]?.finalPrep?.trim()).length,
    [memberPreps],
  );

  const signalPrompt = useMemo(() => [
    '당신은 제약영업 팀장의 팀원 실행 Data 해석을 돕는 리더십 코치입니다.',
    '',
    '아래 자료는 교육용 가상 팀원 실행 Data입니다. 실제 고객명, 병원명, 의료진명, 제품명, 처방·매출 수치, 내부 민감정보는 포함하지 않습니다.',
    '',
    '요청:',
    '6명의 팀원 Data를 보고, 각 팀원에 대해 확정 진단이 아니라 관찰 가능한 신호와 이슈 후보를 정리해 주세요.',
    'AI로 6명 Data에서 보이는 신호 정리를 하되, 팀원을 평가하거나 낙인찍지 마세요.',
    '',
    '반드시 피할 것:',
    ...FORBIDDEN_ITEMS.map((item) => `- ${item}`),
    '',
    '팀원 실행 Data:',
    ...TEAM_MEMBERS.flatMap((member, index) => [`${index + 1}. ${formatMemberData(member)}`, '']),
    '출력 형식:',
    '팀원별로 아래 형식을 반복해 주세요.',
    '1. 팀원별 관찰 신호',
    '2. 강점으로 볼 수 있는 신호',
    '3. 우려 또는 확인이 필요한 신호',
    '4. 추가로 확인해야 할 질문',
    '5. 성급하게 단정하면 안 되는 점',
    '',
    '주의:',
    '- 문제 직원, 동기 부족, 변화 저항처럼 단정하지 마세요.',
    '- Data에 근거한 이슈 후보와 질문 중심으로 작성하세요.',
    '- 팀장이 다음 단계에서 팀원별로 다시 분리 정리할 수 있도록 짧고 명확하게 작성하세요.',
  ].join('\n'), []);

  const prepPrompt = useMemo(() => [
    '당신은 제약영업 팀장이 팀원별 다음 행동 준비물을 만들도록 돕는 리더십 코치입니다.',
    '',
    '아래 내용은 교육용 가상 Data, AI 1차 신호 정리 결과, 그리고 팀장이 팀원별로 다시 분리 정리한 판단 메모입니다.',
    'AI가 판단을 대신 확정하지 않도록, 관찰 신호와 선택한 팀장 행동 결과물에 맞춰 실무 준비물을 만들어 주세요.',
    '',
    '반드시 피할 것:',
    ...FORBIDDEN_ITEMS.map((item) => `- ${item}`),
    '',
    'AI 1차 결과 붙여넣기 내용:',
    aiSignalResult || '아직 붙여넣지 않았습니다.',
    '',
    '팀원별 분리 정리와 팀장 행동 선택:',
    ...TEAM_MEMBERS.flatMap((member, index) => [`${index + 1}. ${formatMemberSignalsForPrompt(member, memberPreps[member.id], selectedDeliverables[member.id])}`, '']),
    '',
    '선택 가능한 준비물별 세부 지시:',
    ...ACTION_OUTPUT_OPTIONS.map((option, index) => `${index + 1}. ${option.label}\n   - 작성 기준: ${option.promptGuide}\n   - 출력 형식: ${option.outputFormat}`),
    '',
    '출력 형식:',
    '팀원별로 선택된 준비물만 작성해 주세요.',
    '각 준비물은 현장에서 바로 복사해 활용할 수 있는 문장과 체크리스트 중심으로 작성해 주세요.',
    '마지막에는 팀장이 다시 검토해야 할 컴플라이언스 안전선 3개를 붙여 주세요.',
  ].join('\n'), [aiSignalResult, memberPreps, selectedDeliverables]);

  const updatePrep = (memberId: string, field: keyof MemberPrep, value: string) => {
    setMemberPreps((current) => ({
      ...current,
      [memberId]: {
        ...emptyPrep(),
        ...(current[memberId] ?? {}),
        [field]: value,
      },
    }));
  };

  const toggleDeliverable = (memberId: string, label: string) => {
    setSelectedDeliverables((current) => {
      const previous = current[memberId] ?? [];
      const next = previous.includes(label) ? previous.filter((item) => item !== label) : [...previous, label];
      return {
        ...current,
        [memberId]: next,
      };
    });
  };

  const copyPrompt = async (type: 'signal' | 'prep') => {
    try {
      await navigator.clipboard.writeText(type === 'signal' ? signalPrompt : prepPrompt);
      setCopiedPrompt(type);
      window.setTimeout(() => setCopiedPrompt(null), 1600);
    } catch {
      setCopiedPrompt(null);
    }
  };

  const applySignalStarter = (memberId: string) => {
    const starterMap: Record<string, Partial<MemberPrep>> = {
      M01: {
        observedSignal: '활동량과 고객 접점은 높지만 방문 이후 고객 반응과 후속 대화 연결 설명이 짧다.',
        strengthSignal: '접점 확보와 실행 속도가 빠르다.',
        concernSignal: '방문 횟수를 실행 성과로 오해할 가능성이 있다.',
        checkQuestion: '최근 방문 중 고객 반응이 다음 대화로 이어진 사례는 무엇인가?',
        doNotAssume: '열심히 움직인다는 사실만으로 고객 반응이 충분하다고 단정하지 않는다.',
      },
      M02: {
        observedSignal: '고객 후속 대화는 안정적이지만 팀 학습 공유 신호는 약하다.',
        strengthSignal: '고객 관계와 후속 대화 연결력이 좋다.',
        concernSignal: '개인 담당처 중심으로 머물러 팀 전체 학습 확산이 제한될 수 있다.',
        checkQuestion: '최근 후속 대화로 이어진 좋은 사례 중 팀이 재사용할 수 있는 것은 무엇인가?',
        doNotAssume: '공유를 꺼린다고 협업 의지가 낮다고 단정하지 않는다.',
      },
      M03: {
        observedSignal: 'CRM 기록은 꼼꼼하지만 고객 대화 참여와 후속 연결 지표가 낮다.',
        strengthSignal: '기록 정리와 방문 전 준비 자료 구성에 강점이 있다.',
        concernSignal: '준비와 기록에 머물고 고객 질문을 끌어내는 행동이 약할 수 있다.',
        checkQuestion: '다음 방문에서 고객에게 확인할 열린 질문 2개는 무엇인가?',
        doNotAssume: '신규 역할 적응 중인 팀원을 역량 부족으로 빠르게 규정하지 않는다.',
      },
      M04: {
        observedSignal: '장기 고객 관계는 안정적이지만 새 기록 기준과 실행 방식에는 신중하다.',
        strengthSignal: '관계 유지와 고객 맥락 이해가 좋다.',
        concernSignal: '기존 방식에 익숙해 변화 신호나 새 실행 기준을 늦게 받아들일 수 있다.',
        checkQuestion: '기존 관계를 유지하면서 새로 기록해야 할 고객 반응 신호는 무엇인가?',
        doNotAssume: '신중한 태도를 변화 저항으로 단정하지 않는다.',
      },
      M05: {
        observedSignal: '외부 요인을 자주 언급하고 통제 가능한 실행 변수에 대한 설명은 짧다.',
        strengthSignal: '지역 상황과 현실적 제약을 잘 파악한다.',
        concernSignal: '외부 요인 설명에 머물면 2주 안에 바꿀 수 있는 행동이 좁아질 수 있다.',
        checkQuestion: '이번 2주 동안 본인이 직접 바꿀 수 있는 실행 변수는 무엇인가?',
        doNotAssume: '목표 압박을 느낀다는 이유만으로 책임 회피라고 단정하지 않는다.',
      },
      M06: {
        observedSignal: '현장 요청 대응은 빠르지만 사후 기록과 후속 실행 정리가 부족하다.',
        strengthSignal: '고객 반응에 민감하고 즉시 대응 속도가 빠르다.',
        concernSignal: '기록과 후속조치가 늦어지면 팀장 판단과 다음 실행 연결이 약해질 수 있다.',
        checkQuestion: '현장 대응 직후 10분 안에 남길 핵심 기록은 무엇인가?',
        doNotAssume: '기록 부족을 성의 부족으로 단정하지 않는다.',
      },
    };
    setMemberPreps((current) => ({
      ...current,
      [memberId]: {
        ...emptyPrep(),
        ...(current[memberId] ?? {}),
        ...starterMap[memberId],
      },
    }));
  };

  const applySuggestedDeliverables = (memberId: string) => {
    setSelectedDeliverables((current) => ({
      ...current,
      [memberId]: getSuggestedDeliverables(memberId),
    }));
  };

  return (
    <section className="space-y-4">
      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700">v38 Dashboard Analysis Lab</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">팀원 실행진단</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              이 단계는 팀원을 평가하는 화면이 아닙니다. <span className="font-black text-slate-950">6명 팀원 Data 전체 보기 → AI로 신호 뽑기 → 팀원별로 분리 정리 → 필요한 준비물 만들기</span> 흐름으로,
              팀장이 다음 1on1과 실행 점검 전에 사용할 <span className="font-black text-slate-950">팀원별 다음 행동 준비물</span>을 만듭니다.
            </p>
          </div>
          <div className="grid gap-2 text-sm font-black text-cyan-800 md:text-right">
            <div className="rounded-2xl bg-cyan-50 px-4 py-3">신호 분리 {completedSignalCount} / {TEAM_MEMBERS.length}</div>
            <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-indigo-800">행동 선택 {completedActionChoiceCount} / {TEAM_MEMBERS.length}</div>
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-emerald-800">준비물 완성 {completedFinalCount} / {TEAM_MEMBERS.length}</div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Block 1</p>
            <h3 className="text-lg font-black text-slate-950">6명 팀원 Data 전체 보기</h3>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
              처음에는 분석 기준이 막막한 것이 정상입니다. 활동량, 고객 반응, 후속조치, 기록 품질, 안전선 신호를 한 번에 보고 AI를 사고 보조자로 활용합니다.
            </p>
          </div>
          <div className="rounded-2xl bg-amber-50 px-4 py-3 text-xs font-black leading-5 text-amber-800">
            Data는 교육용 가상 정보이며 실제 고객명·병원명·제품명·처방 수치는 사용하지 않습니다.
          </div>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {TEAM_MEMBERS.map((member) => (
            <article key={member.id} className="rounded-3xl border bg-slate-50 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-black text-slate-950">{member.name}</p>
                  <p className="mt-1 text-xs font-bold text-slate-600">{member.profile}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700">{member.id}</span>
              </div>
              <p className="mt-3 text-sm font-bold leading-6 text-slate-700">{member.observation}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {member.signals.map((signal) => <span key={signal} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700">{signal}</span>)}
              </div>
            </article>
          ))}
        </div>
      </div>

      <details className="rounded-3xl border border-indigo-100 bg-indigo-50 p-5 shadow-sm md:p-6" open>
        <summary className="cursor-pointer text-lg font-black text-slate-950">Block 2. AI로 6명 Data에서 보이는 신호 정리</summary>
        <p className="mt-3 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-600">
          AI 1차 활용은 진단 확정이 아니라 이슈 후보를 넓히는 단계입니다. AI 결과를 그대로 믿지 않고, 다음 블록에서 팀원별로 다시 분리 정리합니다.
        </p>
        <div className="mt-4 rounded-2xl border bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-950">복사용 AI 1차 신호 정리 프롬프트</h3>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-600">6명 Data에서 보이는 신호를 관찰 가능한 표현과 확인 질문 중심으로 뽑아냅니다.</p>
            </div>
            <button type="button" className="rounded-2xl bg-indigo-700 px-4 py-3 text-sm font-black text-white" onClick={() => copyPrompt('signal')}>{copiedPrompt === 'signal' ? '복사 완료' : 'AI 신호 정리 프롬프트 복사'}</button>
          </div>
          <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{signalPrompt}</pre>
        </div>
      </details>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Block 3</p>
        <h3 className="text-lg font-black text-slate-950">AI 결과 붙여넣기</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
          AI가 뽑은 신호를 붙여넣은 뒤, 그대로 확정하지 말고 팀장 판단으로 팀원별 신호 분리 정리를 진행합니다.
        </p>
        <textarea
          className="mt-4 min-h-40 w-full rounded-2xl border bg-slate-50 px-4 py-3 text-sm leading-6"
          value={aiSignalResult}
          onChange={(event) => setAiSignalResult(event.target.value)}
          placeholder="AI 1차 결과를 여기에 붙여넣으세요. 예: 팀원별 관찰 신호, 강점 신호, 우려 신호, 추가 확인 질문, 성급하게 단정하면 안 되는 점."
        />
      </div>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Block 3-1</p>
        <h3 className="text-lg font-black text-slate-950">팀원별 신호 분리 정리</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
          AI 결과는 전체 신호 후보입니다. 여기서는 참여자가 팀원별로 다시 나누고, 무엇을 더 확인해야 하는지 적습니다.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {TEAM_MEMBERS.map((member, index) => {
            const current = memberPreps[member.id] ?? emptyPrep();
            return (
              <details key={member.id} className="rounded-3xl border bg-slate-50 shadow-sm" open={index === 0}>
                <summary className="cursor-pointer list-none p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-black text-slate-950">{member.name}</p>
                      <p className="mt-1 text-xs font-bold text-slate-600">{member.profile}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700">{current.observedSignal ? '신호 정리 중' : '정리 전'}</span>
                  </div>
                </summary>
                <div className="border-t p-4">
                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-xs font-black text-cyan-700">관찰 장면과 주요 실행 Data</p>
                    <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{member.observation}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {member.signals.map((signal) => <span key={signal} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{signal}</span>)}
                    </div>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <PrepTextarea label="팀원별 관찰 신호" value={current.observedSignal} onChange={(value) => updatePrep(member.id, 'observedSignal', value)} placeholder="예: 활동량은 높지만 후속 대화 연결 설명이 짧다." />
                    <PrepTextarea label="강점으로 볼 수 있는 신호" value={current.strengthSignal} onChange={(value) => updatePrep(member.id, 'strengthSignal', value)} placeholder="예: 접점 확보와 실행 속도가 빠르다." />
                    <PrepTextarea label="우려 또는 확인이 필요한 신호" value={current.concernSignal} onChange={(value) => updatePrep(member.id, 'concernSignal', value)} placeholder="예: 방문 횟수를 실행 성과로 오해할 수 있다." />
                    <PrepTextarea label="추가로 확인해야 할 질문" value={current.checkQuestion} onChange={(value) => updatePrep(member.id, 'checkQuestion', value)} placeholder="예: 최근 방문 중 후속 대화로 이어진 사례는 무엇인가?" />
                    <PrepTextarea label="성급하게 단정하면 안 되는 점" value={current.doNotAssume} onChange={(value) => updatePrep(member.id, 'doNotAssume', value)} placeholder="예: 열심히 움직인다는 사실만으로 고객 반응이 충분하다고 단정하지 않는다." />
                  </div>
                  <button type="button" className="mt-3 rounded-2xl border bg-white px-4 py-2 text-xs font-black text-slate-700" onClick={() => applySignalStarter(member.id)}>신호 분리 예시 가져오기</button>
                </div>
              </details>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Block 4</p>
        <h3 className="text-lg font-black text-slate-950">팀장 행동 선택</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
          모든 팀원에게 같은 결과물을 만들지 않습니다. 팀원별 신호에 따라 지금 필요한 준비물을 선택합니다.
        </p>
        <div className="mt-4 grid gap-4">
          {TEAM_MEMBERS.map((member) => {
            const checkedItems = selectedDeliverables[member.id] ?? [];
            return (
              <article key={member.id} className="rounded-3xl border bg-slate-50 p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-black text-slate-950">{member.name}</p>
                    <p className="mt-1 text-xs font-bold text-slate-600">추천: {getSuggestedDeliverables(member.id).join(' / ')}</p>
                  </div>
                  <button type="button" className="rounded-2xl border bg-white px-4 py-2 text-xs font-black text-slate-700" onClick={() => applySuggestedDeliverables(member.id)}>추천 준비물 선택</button>
                </div>
                <div className="mt-3 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {ACTION_OUTPUT_OPTIONS.map((option) => {
                    const checked = checkedItems.includes(option.label);
                    return (
                      <label key={option.label} className={`flex items-start gap-3 rounded-2xl border p-3 text-xs font-bold leading-5 ${checked ? 'border-cyan-700 bg-white text-cyan-950' : 'bg-white/70 text-slate-700'}`}>
                        <input type="checkbox" className="mt-1" checked={checked} onChange={() => toggleDeliverable(member.id, option.label)} />
                        <span>{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <details className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm md:p-6">
        <summary className="cursor-pointer text-lg font-black text-slate-950">AI 2차 활용: 선택한 준비물 생성</summary>
        <p className="mt-3 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-600">
          AI 2차 활용은 선택한 팀장 행동 결과물만 생성하는 단계입니다. AI가 만든 문장은 그대로 쓰지 않고, 제약영업 컴플라이언스와 팀원 맥락에 맞게 다시 수정합니다.
        </p>
        <div className="mt-4 rounded-2xl border bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-950">복사용 AI 준비물 생성 프롬프트</h3>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-600">팀원별 분리 정리와 팀장 행동 선택 결과를 바탕으로 실무 준비물 초안을 만듭니다.</p>
            </div>
            <button type="button" className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white" onClick={() => copyPrompt('prep')}>{copiedPrompt === 'prep' ? '복사 완료' : 'AI 준비물 생성 프롬프트 복사'}</button>
          </div>
          <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{prepPrompt}</pre>
        </div>
      </details>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <h3 className="text-lg font-black text-slate-950">최종 결과물: 팀원별 다음 행동 준비물</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
          AI 2차 결과를 붙여넣고, 팀장 판단으로 수정해 최종 준비물을 확정합니다. 이 결과물은 다음 단계의 고객 유형 전략과 팀원별 역할 방향을 연결하는 실행 재료가 됩니다.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {TEAM_MEMBERS.map((member) => {
            const current = memberPreps[member.id] ?? emptyPrep();
            const checkedItems = selectedDeliverables[member.id] ?? [];
            return (
              <article key={member.id} className="rounded-3xl border bg-slate-50 p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-black text-slate-950">{member.name}</p>
                    <p className="mt-1 text-xs font-bold text-slate-600">선택한 준비물: {checkedItems.length > 0 ? checkedItems.join(' / ') : '아직 선택하지 않았습니다.'}</p>
                  </div>
                </div>
                <label className="mt-3 block space-y-1">
                  <span className="text-xs font-black text-slate-500">AI 2차 결과 붙여넣기 또는 참고 메모</span>
                  <textarea className="min-h-28 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6" value={current.aiDraft} onChange={(event) => updatePrep(member.id, 'aiDraft', event.target.value)} placeholder="AI가 만든 준비물 초안 중 참고할 내용을 붙여넣거나 요약하세요." />
                </label>
                <label className="mt-3 block space-y-1">
                  <span className="text-xs font-black text-slate-500">최종 팀원별 다음 행동 준비물</span>
                  <textarea className="min-h-36 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6" value={current.finalPrep} onChange={(event) => updatePrep(member.id, 'finalPrep', event.target.value)} placeholder="예: 1on1 질문, 이번 주 코칭 포인트, 실행 점검 기준, 후속 대화 연결 질문 등을 현장 언어로 정리하세요." />
                </label>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PrepTextarea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-black text-slate-500">{label}</span>
      <textarea className="min-h-24 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}
