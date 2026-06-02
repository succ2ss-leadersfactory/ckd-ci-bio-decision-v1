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

const AI_LENS_OPTIONS = [
  {
    title: '열심히만 한 건 아닐까?',
    promptGuide: '활동량, 방문 횟수, 콜 횟수와 실제 고객 반응, 후속 대화, 다음 행동 연결 여부를 구분할 수 있는 관찰 질문을 만들어 주세요.',
  },
  {
    title: '고객이 실제로 반응했나?',
    promptGuide: '고객이 단순히 만남에 응한 것인지, 실제 관심·질문·자료 요청·후속 미팅·추가 확인 행동으로 이어졌는지 확인할 질문을 만들어 주세요.',
  },
  {
    title: '약속한 다음 행동을 했나?',
    promptGuide: '방문이나 콜 이후 약속한 후속조치, CRM 기록, 자료 전달, 다음 미팅 준비, 고객 반응 기록이 실제로 남아 있는지 확인할 질문을 만들어 주세요.',
  },
  {
    title: '왜 잘 안 되고 있을까?',
    promptGuide: '팀원의 실행 부진을 성급하게 태도 문제로 보지 않도록 역량 부족, 동기 저하, 목표 이해 부족, 실행 환경 제약, 고객 상황 변화 중 무엇과 관련되는지 확인할 질문을 만들어 주세요.',
  },
  {
    title: '위험한 말이나 행동은 없나?',
    promptGuide: '제약영업 맥락에서 무리한 표현, 처방 유도처럼 보일 수 있는 표현, 승인되지 않은 자료 활용, 과잉 접촉, 실제 고객정보나 민감정보의 AI 입력 위험을 확인할 질문을 만들어 주세요.',
  },
  {
    title: '내가 오해하고 있진 않나?',
    promptGuide: '팀장이 활동량, 최근 사건, 선호하는 팀원, 조용한 팀원, 성과 수치 하나만 보고 성급하게 판단하지 않도록 편향 점검 질문을 만들어 주세요.',
  },
];

const AI_REFINEMENT_OPTIONS = [
  '단정적·낙인 표현 줄이기',
  '관찰 가능한 행동 중심으로 정리하기',
  '추가 확인 질문 보완하기',
  '이번 주 코칭 초점 구체화하기',
  '1on1에서 사용할 부드러운 질문 문장 만들기',
  '2주 후 확인 지표 제안하기',
];

const FORBIDDEN_ITEMS = [
  '실제 고객명·병원명·의료진명',
  '제품명 또는 미승인 제품 표현',
  '실제 매출·처방 수치·내부 전략 수치',
  '개인정보·민감정보',
  '팀원에 대한 단정적 낙인 표현',
];

type SignalMemo = {
  observedSignal: string;
  strengthSignal: string;
  concernSignal: string;
  checkQuestion: string;
  coachingFocus: string;
  aiDraft: string;
  finalMemo: string;
};

type MemoState = Record<string, SignalMemo>;

function emptyMemo(): SignalMemo {
  return {
    observedSignal: '',
    strengthSignal: '',
    concernSignal: '',
    checkQuestion: '',
    coachingFocus: '',
    aiDraft: '',
    finalMemo: '',
  };
}

function formatMemberInput(member: typeof TEAM_MEMBERS[number], memo?: SignalMemo) {
  const current = memo ?? emptyMemo();
  return [
    `${member.name}`,
    `- 프로필: ${member.profile}`,
    `- 관찰 장면: ${member.observation}`,
    `- 주요 실행 Data: ${member.signals.join(' / ')}`,
    `- 관찰된 실행 신호: ${current.observedSignal || '아직 작성하지 않았습니다.'}`,
    `- 강점 신호: ${current.strengthSignal || '아직 작성하지 않았습니다.'}`,
    `- 우려 신호: ${current.concernSignal || '아직 작성하지 않았습니다.'}`,
    `- 추가 확인 질문: ${current.checkQuestion || '아직 작성하지 않았습니다.'}`,
    `- 이번 주 코칭 초점: ${current.coachingFocus || '아직 작성하지 않았습니다.'}`,
  ].join('\n');
}

export function V38DashboardAnalysisLab() {
  const [selectedLensOptions, setSelectedLensOptions] = useState<string[]>([
    AI_LENS_OPTIONS[0].title,
    AI_LENS_OPTIONS[1].title,
    AI_LENS_OPTIONS[5].title,
  ]);
  const [selectedRefinementOptions, setSelectedRefinementOptions] = useState<string[]>([
    AI_REFINEMENT_OPTIONS[0],
    AI_REFINEMENT_OPTIONS[1],
    AI_REFINEMENT_OPTIONS[3],
    AI_REFINEMENT_OPTIONS[4],
  ]);
  const [memos, setMemos] = useState<MemoState>({});
  const [copiedPrompt, setCopiedPrompt] = useState<'lens' | 'refine' | null>(null);

  const completedDraftCount = useMemo(
    () => TEAM_MEMBERS.filter((member) => memos[member.id]?.observedSignal || memos[member.id]?.coachingFocus).length,
    [memos],
  );

  const completedFinalCount = useMemo(
    () => TEAM_MEMBERS.filter((member) => memos[member.id]?.finalMemo?.trim()).length,
    [memos],
  );

  const selectedLensDetails = useMemo(
    () => AI_LENS_OPTIONS.filter((option) => selectedLensOptions.includes(option.title)),
    [selectedLensOptions],
  );

  const lensPrompt = useMemo(() => [
    '당신은 제약영업 팀장의 팀원 실행 Data 해석을 돕는 리더십 코치입니다.',
    '',
    '아래 자료는 교육용 가상 팀원 실행 Data입니다. 실제 고객명, 병원명, 의료진명, 제품명, 매출·처방 수치, 내부 민감정보는 포함하지 않습니다.',
    '',
    'AI는 팀원에 대한 평가나 정답 진단을 제시하지 마세요.',
    '대신 팀장이 1차 메모를 작성하기 전에 확인해야 할 관찰 질문과 확인 관점만 제안해 주세요.',
    '',
    '반드시 피할 것:',
    ...FORBIDDEN_ITEMS.map((item) => `- ${item}`),
    '',
    '선택한 화면 질문과 AI용 세부 지시:',
    ...(selectedLensDetails.length > 0
      ? selectedLensDetails.map((item, index) => `${index + 1}. ${item.title}\n   - ${item.promptGuide}`)
      : ['1. 팀원 실행 Data를 볼 때 필요한 관찰 질문을 제안해 주세요.']),
    '',
    '팀원 실행 Data:',
    ...TEAM_MEMBERS.flatMap((member, index) => [`${index + 1}. ${member.name}`, `- 프로필: ${member.profile}`, `- 관찰 장면: ${member.observation}`, `- 주요 실행 Data: ${member.signals.join(' / ')}`, '']),
    '출력 형식:',
    '선택한 각 관점별로 아래 형식을 반복해 주세요.',
    '- 핵심 질문 3개',
    '- 이 관점이 필요한 이유 1줄',
    '- 1on1에서 바로 쓸 수 있는 질문 문장 1개',
    '- 성급하게 단정하지 말아야 할 점 1개',
  ].join('\n'), [selectedLensDetails]);

  const refinementPrompt = useMemo(() => [
    '당신은 제약영업 팀장의 팀원 실행 신호 메모를 다듬는 리더십 코치입니다.',
    '',
    '아래 내용은 교육용 가상 팀원 실행 Data와 내가 작성한 1차 메모입니다.',
    'AI 초안은 그대로 확정하지 않을 예정이며, 현장 맥락과 팀원 특성에 맞게 다시 수정할 것입니다.',
    '',
    '요청:',
    '내가 작성한 팀원 실행 신호 메모 초안을 바탕으로, 팀원별 실행 신호 메모 완성본 초안을 만들어 주세요.',
    '단정적 평가나 낙인 표현은 피하고, 관찰 가능한 행동, 추가 확인 질문, 이번 주 코칭 초점 중심으로 정리해 주세요.',
    '',
    '반드시 피할 것:',
    ...FORBIDDEN_ITEMS.map((item) => `- ${item}`),
    '',
    '보완 요청:',
    ...(selectedRefinementOptions.length > 0 ? selectedRefinementOptions.map((item, index) => `${index + 1}. ${item}`) : ['1. 팀원 실행 신호 메모를 실무적으로 다듬어 주세요.']),
    '',
    '팀원별 1차 메모:',
    ...TEAM_MEMBERS.flatMap((member, index) => [`${index + 1}. ${formatMemberInput(member, memos[member.id])}`, '']),
    '출력 형식:',
    '팀원별로 아래 형식을 반복해 주세요.',
    '- 관찰된 실행 신호:',
    '- 강점 신호:',
    '- 우려 신호:',
    '- 추가 확인 질문:',
    '- 이번 주 코칭 초점:',
    '- 1on1에서 사용할 질문 문장:',
    '- 2주 후 확인 지표:',
  ].join('\n'), [memos, selectedRefinementOptions]);

  const updateMemo = (memberId: string, field: keyof SignalMemo, value: string) => {
    setMemos((current) => ({
      ...current,
      [memberId]: {
        ...emptyMemo(),
        ...(current[memberId] ?? {}),
        [field]: value,
      },
    }));
  };

  const toggleLensOption = (option: string) => {
    setSelectedLensOptions((current) => current.includes(option) ? current.filter((item) => item !== option) : [...current, option]);
  };

  const toggleRefinementOption = (option: string) => {
    setSelectedRefinementOptions((current) => current.includes(option) ? current.filter((item) => item !== option) : [...current, option]);
  };

  const copyPrompt = async (type: 'lens' | 'refine') => {
    try {
      await navigator.clipboard.writeText(type === 'lens' ? lensPrompt : refinementPrompt);
      setCopiedPrompt(type);
      window.setTimeout(() => setCopiedPrompt(null), 1600);
    } catch {
      setCopiedPrompt(null);
    }
  };

  const applyStarterMemo = (memberId: string) => {
    const member = TEAM_MEMBERS.find((item) => item.id === memberId);
    if (!member) return;
    const starterMap: Record<string, Partial<SignalMemo>> = {
      M01: {
        observedSignal: '활동량은 높지만 방문 이후 고객 반응과 후속 대화 연결 설명이 짧다.',
        strengthSignal: '접점 확보와 실행 속도가 빠르다.',
        concernSignal: '방문 횟수를 실행 성과로 오해할 가능성이 있다.',
        checkQuestion: '최근 방문 중 후속 대화로 이어진 사례는 무엇인가?',
        coachingFocus: '콜 횟수보다 고객 반응과 다음 행동 근거를 남기도록 돕는다.',
      },
      M02: {
        observedSignal: '고객과의 후속 대화는 안정적이지만 팀 학습 공유가 낮다.',
        strengthSignal: '고객 관계와 후속 대화 연결력이 좋다.',
        concernSignal: '개인 담당처 중심으로 머물러 팀 전체 학습 확산이 약해질 수 있다.',
        checkQuestion: '최근 후속 대화로 이어진 좋은 사례를 팀이 재사용하려면 무엇을 공유할 수 있는가?',
        coachingFocus: '개인 성공 방식을 팀 언어와 실행 기준으로 나누게 한다.',
      },
      M03: {
        observedSignal: 'CRM 기록은 꼼꼼하지만 고객 대화 참여와 후속 연결 지표가 낮다.',
        strengthSignal: '기록 정리와 준비 자료 구성에 강점이 있다.',
        concernSignal: '준비와 기록에 머물고 고객 질문을 끌어내는 행동이 약할 수 있다.',
        checkQuestion: '다음 방문에서 고객에게 확인할 질문 2개는 무엇인가?',
        coachingFocus: '기록을 질문과 다음 행동 기준으로 연결하게 한다.',
      },
      M04: {
        observedSignal: '장기 고객 관계는 안정적이지만 새 기록 기준과 실행 방식에는 신중하다.',
        strengthSignal: '관계 유지와 고객 맥락 이해가 좋다.',
        concernSignal: '기존 방식에 익숙해 변화 신호나 새 실행 기준을 늦게 받아들일 수 있다.',
        checkQuestion: '기존 관계를 유지하면서 새로 기록해야 할 반응 신호는 무엇인가?',
        coachingFocus: '관계 유지 강점을 살리되 새 기준으로 관찰할 항목을 합의한다.',
      },
      M05: {
        observedSignal: '외부 요인을 자주 언급하고 통제 가능한 실행 변수에 대한 설명은 짧다.',
        strengthSignal: '지역 상황과 현실적 제약을 잘 파악한다.',
        concernSignal: '외부 요인 설명에 머물면 2주 안에 바꿀 수 있는 행동이 좁아질 수 있다.',
        checkQuestion: '이번 2주 동안 본인이 직접 바꿀 수 있는 실행 변수는 무엇인가?',
        coachingFocus: '통제 가능한 행동과 점검 지표를 작게 정하게 한다.',
      },
      M06: {
        observedSignal: '현장 요청 대응은 빠르지만 사후 기록과 후속 실행 정리가 부족하다.',
        strengthSignal: '고객 반응에 민감하고 즉시 대응 속도가 빠르다.',
        concernSignal: '기록과 후속조치가 늦어지면 팀장 판단과 다음 실행 연결이 약해질 수 있다.',
        checkQuestion: '현장 대응 직후 10분 안에 남길 핵심 기록은 무엇인가?',
        coachingFocus: '현장 대응 직후 기록과 다음 행동을 함께 남기게 한다.',
      },
    };
    setMemos((current) => ({
      ...current,
      [memberId]: {
        ...emptyMemo(),
        ...(current[memberId] ?? {}),
        ...starterMap[memberId],
      },
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
              이 단계의 결과물은 팀원 평가표가 아니라 1on1과 실행 점검 전에 사용할 <span className="font-black text-slate-950">팀원 실행 신호 메모</span>입니다. AI를 두 번 활용해 생각을 열고, 내 초안을 다듬어 최종 메모로 완성합니다.
            </p>
          </div>
          <div className="grid gap-2 text-sm font-black text-cyan-800 md:text-right">
            <div className="rounded-2xl bg-cyan-50 px-4 py-3">1차 메모 {completedDraftCount} / {TEAM_MEMBERS.length}</div>
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-emerald-800">최종 메모 {completedFinalCount} / {TEAM_MEMBERS.length}</div>
          </div>
        </div>
      </div>

      <details className="rounded-3xl border border-indigo-100 bg-indigo-50 p-5 shadow-sm md:p-6" open>
        <summary className="cursor-pointer text-lg font-black text-slate-950">AI 1차 활용: 실행 Data 관찰 질문 만들기</summary>
        <p className="mt-3 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-600">
          AI 1차 활용은 정답 진단을 받는 단계가 아닙니다. 팀원 Data를 볼 때 무엇을 확인해야 하는지 질문과 관찰 렌즈를 얻는 단계입니다.
        </p>
        <div className="mt-4 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {AI_LENS_OPTIONS.map((option) => {
            const checked = selectedLensOptions.includes(option.title);
            return (
              <label key={option.title} className={`flex items-start gap-3 rounded-2xl border p-3 text-xs font-bold leading-5 ${checked ? 'border-indigo-700 bg-white text-indigo-950' : 'bg-white/70 text-slate-700'}`}>
                <input type="checkbox" className="mt-1" checked={checked} onChange={() => toggleLensOption(option.title)} />
                <span>{option.title}</span>
              </label>
            );
          })}
        </div>
        <div className="mt-4 rounded-2xl border bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-950">복사용 AI 관찰 질문 프롬프트</h3>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-600">화면에는 쉬운 질문이 보이지만, 프롬프트에는 AI가 깊이 이해할 수 있도록 세부 지시가 함께 들어갑니다.</p>
            </div>
            <button type="button" className="rounded-2xl bg-indigo-700 px-4 py-3 text-sm font-black text-white" onClick={() => copyPrompt('lens')}>{copiedPrompt === 'lens' ? '복사 완료' : 'AI 관찰 질문 프롬프트 복사'}</button>
          </div>
          <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{lensPrompt}</pre>
        </div>
      </details>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <h3 className="text-lg font-black text-slate-950">참여자 1차 결과물: 팀원 실행 신호 메모 초안</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">AI 1차 질문을 참고하되, 판단은 먼저 직접 작성합니다. 완성도보다 관찰 신호와 확인 질문을 남기는 것이 중요합니다.</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {TEAM_MEMBERS.map((member, index) => {
            const current = memos[member.id] ?? emptyMemo();
            return (
              <details key={member.id} className="rounded-3xl border bg-slate-50 shadow-sm" open={index === 0}>
                <summary className="cursor-pointer list-none p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-black text-slate-950">{member.name}</p>
                      <p className="mt-1 text-xs font-bold text-slate-600">{member.profile}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700">{current.observedSignal ? '초안 작성 중' : '초안 전'}</span>
                  </div>
                </summary>
                <div className="border-t p-4">
                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-xs font-black text-cyan-700">관찰 장면</p>
                    <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{member.observation}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {member.signals.map((signal) => <span key={signal} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{signal}</span>)}
                    </div>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <MemoTextarea label="관찰된 실행 신호" value={current.observedSignal} onChange={(value) => updateMemo(member.id, 'observedSignal', value)} placeholder="예: 활동량은 높지만 후속 대화 연결 설명이 짧다." />
                    <MemoTextarea label="강점 신호" value={current.strengthSignal} onChange={(value) => updateMemo(member.id, 'strengthSignal', value)} placeholder="예: 접점 확보와 실행 속도가 빠르다." />
                    <MemoTextarea label="우려 신호" value={current.concernSignal} onChange={(value) => updateMemo(member.id, 'concernSignal', value)} placeholder="예: 방문 횟수를 실행 성과로 오해할 수 있다." />
                    <MemoTextarea label="추가 확인 질문" value={current.checkQuestion} onChange={(value) => updateMemo(member.id, 'checkQuestion', value)} placeholder="예: 최근 방문 중 후속 대화로 이어진 사례는 무엇인가?" />
                    <MemoTextarea label="이번 주 코칭 초점" value={current.coachingFocus} onChange={(value) => updateMemo(member.id, 'coachingFocus', value)} placeholder="예: 콜 횟수보다 고객 반응과 다음 행동 근거를 남기도록 돕는다." />
                  </div>
                  <button type="button" className="mt-3 rounded-2xl border bg-white px-4 py-2 text-xs font-black text-slate-700" onClick={() => applyStarterMemo(member.id)}>초안 예시 가져오기</button>
                </div>
              </details>
            );
          })}
        </div>
      </div>

      <details className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm md:p-6">
        <summary className="cursor-pointer text-lg font-black text-slate-950">AI 2차 활용: 초안을 팀원 실행 신호 메모로 다듬기</summary>
        <p className="mt-3 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-600">
          AI 2차 활용은 내가 작성한 초안을 현업에서 쓸 수 있는 메모로 정리하는 단계입니다. AI 초안은 그대로 확정하지 않고, 팀장 판단으로 수정합니다.
        </p>
        <div className="mt-4 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {AI_REFINEMENT_OPTIONS.map((option) => {
            const checked = selectedRefinementOptions.includes(option);
            return (
              <label key={option} className={`flex items-start gap-3 rounded-2xl border p-3 text-xs font-bold leading-5 ${checked ? 'border-emerald-700 bg-white text-emerald-950' : 'bg-white/70 text-slate-700'}`}>
                <input type="checkbox" className="mt-1" checked={checked} onChange={() => toggleRefinementOption(option)} />
                <span>{option}</span>
              </label>
            );
          })}
        </div>
        <div className="mt-4 rounded-2xl border bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-950">복사용 AI 메모 다듬기 프롬프트</h3>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-600">1차 메모를 작성한 뒤 복사하면, AI가 팀원 실행 신호 메모 완성본 초안을 만들어줍니다.</p>
            </div>
            <button type="button" className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white" onClick={() => copyPrompt('refine')}>{copiedPrompt === 'refine' ? '복사 완료' : 'AI 메모 다듬기 프롬프트 복사'}</button>
          </div>
          <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{refinementPrompt}</pre>
        </div>
      </details>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <h3 className="text-lg font-black text-slate-950">최종 결과물: 팀원 실행 신호 메모</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">AI 결과를 참고해 최종 메모를 직접 확정합니다. 이 메모는 다음 단계의 고객 유형 전략을 팀원 실행으로 연결할 때 활용됩니다.</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {TEAM_MEMBERS.map((member) => {
            const current = memos[member.id] ?? emptyMemo();
            return (
              <article key={member.id} className="rounded-3xl border bg-slate-50 p-4">
                <p className="font-black text-slate-950">{member.name}</p>
                <label className="mt-3 block space-y-1">
                  <span className="text-xs font-black text-slate-500">AI 결과 붙여넣기 또는 참고 메모</span>
                  <textarea className="min-h-28 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6" value={current.aiDraft} onChange={(event) => updateMemo(member.id, 'aiDraft', event.target.value)} placeholder="AI가 만든 메모 초안 중 참고할 내용을 붙여넣거나 요약하세요." />
                </label>
                <label className="mt-3 block space-y-1">
                  <span className="text-xs font-black text-slate-500">최종 팀원 실행 신호 메모</span>
                  <textarea className="min-h-36 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6" value={current.finalMemo} onChange={(event) => updateMemo(member.id, 'finalMemo', event.target.value)} placeholder="예: 관찰된 실행 신호, 강점 신호, 우려 신호, 추가 확인 질문, 이번 주 코칭 초점을 한 문단으로 정리하세요." />
                </label>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MemoTextarea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-black text-slate-500">{label}</span>
      <textarea className="min-h-24 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}
