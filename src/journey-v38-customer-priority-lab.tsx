import { useMemo, useState } from 'react';

const CUSTOMER_TYPES = [
  {
    id: 'A',
    label: '고객 유형 A',
    signal: '반응 상승 · 자료 요청 · 후속 가능 · 표현 주의',
    dataRead: '기회 신호는 강하지만 표현과 자료 활용 안전선 확인이 필요합니다.',
    strategyHint: '후속 대화 가능성을 살리되, 허용된 정보 범위와 표현 안전선을 먼저 확인합니다.',
  },
  {
    id: 'B',
    label: '고객 유형 B',
    signal: '관심 보류 · 니즈 재확인 · 속도 조절',
    dataRead: '잠재력과 관심은 있으나 후속 미팅이 보류되어 있습니다.',
    strategyHint: '압박보다 보류 이유와 니즈를 확인하는 질문 전략을 설계합니다.',
  },
  {
    id: 'C',
    label: '고객 유형 C',
    signal: '관계 안정 · 변화 신호 낮음 · 유지 품질',
    dataRead: '관계는 안정적이지만 즉시 실행 신호는 약합니다.',
    strategyHint: '관계 품질을 유지하면서 반응 변화와 추가 Data를 관찰합니다.',
  },
  {
    id: 'D',
    label: '고객 유형 D',
    signal: '접촉 피로 · 무반응 증가 · 리스크 관리',
    dataRead: '접촉은 많지만 반응이 낮고 고객 부담 신호가 있습니다.',
    strategyHint: '접근 강도를 낮추고 메시지·기록·컴플라이언스 리스크를 정비합니다.',
  },
  {
    id: 'E',
    label: '고객 유형 E',
    signal: '기회 신호 큼 · 후속 가능 · 표현 안전선 중요',
    dataRead: '기회 신호가 크지만 컴플라이언스 민감도가 높습니다.',
    strategyHint: '조건부 집중으로 접근하되 자료 범위와 표현 안전선을 먼저 점검합니다.',
  },
  {
    id: 'F',
    label: '고객 유형 F',
    signal: 'Data 부족 · 정보 보완 · 판단 유보',
    dataRead: '관계는 있으나 최근 반응과 CRM 기록이 부족합니다.',
    strategyHint: '대응 전략을 단정하기보다 정보 보완과 기록 정리를 우선 설계합니다.',
  },
];

const PRIORITY_OPTIONS = [
  '적극 집중',
  '조건부 집중',
  '속도 조절',
  '관찰/유지',
  '정보 보완',
  '접근 강도 축소',
];

const MEMBER_ROLE_OPTIONS = [
  '신재영 대리 · 후속 대화 연결',
  '이대은 대리 · 관계 유지 품질 관리',
  '박재욱 사원 · CRM·정보 보완',
  '유희관 과장 · 변화 신호 관찰',
  '김문호 차장 · 접근 강도 조절',
  '김재호 차장 · 현장 대응 후 기록 정리',
  '팀장 직접 점검 필요',
];

const AI_REVIEW_OPTIONS = [
  '고객 유형별 우선순위 판단이 Data 신호와 맞는지 점검',
  '2주 대응 전략이 과도하게 공격적/소극적인지 점검',
  '컴플라이언스 리스크 표현과 실행 방향 점검',
  '팀원 배정 방향이 고객 유형 특성과 맞는지 점검',
  '방치 위험이 있는 고객 유형 확인',
  '전체 전략 포트폴리오 균형 점검',
];

const FORBIDDEN_ITEMS = [
  '실제 고객명·병원명·의료진명',
  '제품명 또는 미승인 제품 표현',
  '실제 매출·처방 수치·내부 전략 수치',
  '개인정보·민감정보',
  '처방 유도·비교 우위 단정 표현',
];

type StrategyState = Record<string, {
  priority: string;
  strategy: string;
  memberRole: string;
  risk: string;
}>;

function emptyStrategy() {
  return { priority: '', strategy: '', memberRole: '', risk: '' };
}

export function V38CustomerPriorityLab() {
  const [strategies, setStrategies] = useState<StrategyState>({});
  const [selectedAiReviews, setSelectedAiReviews] = useState<string[]>([
    AI_REVIEW_OPTIONS[0],
    AI_REVIEW_OPTIONS[1],
    AI_REVIEW_OPTIONS[2],
    AI_REVIEW_OPTIONS[5],
  ]);
  const [copied, setCopied] = useState(false);

  const completedCount = useMemo(
    () => CUSTOMER_TYPES.filter((type) => strategies[type.id]?.priority && strategies[type.id]?.strategy?.trim()).length,
    [strategies],
  );

  const aiReviewPrompt = useMemo(() => {
    const strategyLines = CUSTOMER_TYPES.flatMap((type, index) => {
      const current = strategies[type.id] ?? emptyStrategy();
      return [
        `${index + 1}. ${type.label}`,
        `- Data 신호: ${type.signal}`,
        `- Data 해석: ${type.dataRead}`,
        `- 우선순위 판단: ${current.priority || '아직 선택하지 않았습니다.'}`,
        `- 2주 대응 전략: ${current.strategy || '아직 작성하지 않았습니다.'}`,
        `- 팀원 배정 방향: ${current.memberRole || '아직 선택하지 않았습니다.'}`,
        `- 주의할 리스크: ${current.risk || '아직 작성하지 않았습니다.'}`,
        '',
      ];
    });

    return [
      '당신은 제약영업 팀장의 고객 유형별 대응 전략을 점검하는 리더십 코치입니다.',
      '',
      '아래 내용은 교육용 가상 고객 유형별 전략 자료입니다.',
      '고객 유형 A~F는 실제 고객이 아니라 유사한 Data 패턴을 가진 교육용 가상 고객 묶음입니다.',
      '실제 고객명, 병원명, 의료진명, 제품명, 매출/처방 수치, 내부 민감정보는 포함하지 않습니다.',
      '',
      'AI는 정답을 제시하지 말고, 내가 작성한 6개 고객 유형별 대응 전략을 점검해 주세요.',
      '내 전략을 바꾸라고 단정하지 말고, Data 적합성·과잉/과소 대응·컴플라이언스 리스크·팀원 배정 균형을 검토해 주세요.',
      '',
      '반드시 지킬 안전선:',
      ...FORBIDDEN_ITEMS.map((item) => `- ${item}은 입력하거나 생성하지 마세요.`),
      '- 허가 범위를 벗어난 효능·비교·처방 유도 표현은 사용하지 마세요.',
      '- 모든 표현은 교육용 가상 상황 기준으로 작성하세요.',
      '',
      '고객 유형별 내 전략:',
      ...strategyLines,
      '점검 요청:',
      ...(selectedAiReviews.length > 0 ? selectedAiReviews.map((item, index) => `${index + 1}. ${item}`) : ['1. 6개 고객 유형별 대응 전략의 균형과 리스크를 점검해 주세요.']),
      '',
      '출력 형식:',
      '1. 전체 전략 요약',
      '2. 고객 유형별 전략 적합성 점검',
      '3. 과잉 대응 또는 과소 대응 위험',
      '4. 컴플라이언스 주의점',
      '5. 팀원 배정 보완 의견',
      '6. 2주 실행 우선순위 재정리',
      '7. 팀장이 최종 확인할 질문 5개',
    ].join('\n');
  }, [selectedAiReviews, strategies]);

  const updateStrategy = (typeId: string, field: keyof StrategyState[string], value: string) => {
    setStrategies((current) => ({
      ...current,
      [typeId]: {
        ...emptyStrategy(),
        ...(current[typeId] ?? {}),
        [field]: value,
      },
    }));
  };

  const applyHint = (typeId: string) => {
    const type = CUSTOMER_TYPES.find((item) => item.id === typeId);
    if (!type) return;
    setStrategies((current) => ({
      ...current,
      [typeId]: {
        ...emptyStrategy(),
        ...(current[typeId] ?? {}),
        strategy: current[typeId]?.strategy || type.strategyHint,
        risk: current[typeId]?.risk || type.dataRead,
      },
    }));
  };

  const toggleAiReview = (value: string) => {
    setSelectedAiReviews((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(aiReviewPrompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700">v38 Customer Type Strategy Lab</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">고객 유형별 대응 전략</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              고객 유형 A~F 각각에 대해 2주 대응 전략을 세웁니다. 하나의 정답을 고르는 것이 아니라, 각 유형별 Data 신호를 바탕으로 우선순위·실행 방향·팀원 배정·리스크를 설계합니다.
            </p>
          </div>
          <div className="rounded-2xl bg-cyan-50 px-4 py-3 text-sm font-black text-cyan-800">
            전략 작성 {completedCount} / {CUSTOMER_TYPES.length}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-5 shadow-sm md:p-6">
        <h3 className="text-lg font-black text-slate-950">전략 설계 기준</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
          6단계의 고객 Data 분석을 바탕으로 각 유형에 맞는 대응 강도를 조절합니다. 모든 고객 유형을 같은 방식으로 관리하지 않는 것이 핵심입니다.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {PRIORITY_OPTIONS.map((option) => (
            <div key={option} className="rounded-2xl border bg-white p-4 text-sm font-black text-slate-800">{option}</div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {CUSTOMER_TYPES.map((type, index) => {
          const current = strategies[type.id] ?? emptyStrategy();
          return (
            <details key={type.id} className="rounded-3xl border bg-white shadow-sm" open={index === 0}>
              <summary className="cursor-pointer list-none p-5 md:p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-black text-cyan-700">고객 유형별 전략 설계</p>
                    <h3 className="mt-1 text-xl font-black text-slate-950">{type.label}</h3>
                    <p className="mt-2 text-xs font-bold leading-5 text-slate-600">{type.signal}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">{current.priority || '우선순위 미정'}</span>
                </div>
              </summary>

              <div className="border-t px-5 pb-5 md:px-6 md:pb-6">
                <div className="mt-4 rounded-2xl border bg-slate-50 p-4">
                  <p className="text-xs font-black text-cyan-700">Data 해석 요약</p>
                  <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{type.dataRead}</p>
                  <p className="mt-2 rounded-xl bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700">전략 힌트: {type.strategyHint}</p>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <label className="space-y-1">
                    <span className="text-xs font-black text-slate-500">우선순위 판단</span>
                    <select className="min-h-12 w-full rounded-2xl border bg-white px-3 py-2 text-sm font-bold" value={current.priority} onChange={(event) => updateStrategy(type.id, 'priority', event.target.value)}>
                      <option value="">선택하세요</option>
                      {PRIORITY_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-black text-slate-500">팀원 배정 방향</span>
                    <select className="min-h-12 w-full rounded-2xl border bg-white px-3 py-2 text-sm font-bold" value={current.memberRole} onChange={(event) => updateStrategy(type.id, 'memberRole', event.target.value)}>
                      <option value="">선택하세요</option>
                      {MEMBER_ROLE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </label>
                  <label className="space-y-1 md:col-span-2">
                    <span className="text-xs font-black text-slate-500">2주 대응 전략</span>
                    <textarea className="min-h-28 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.strategy} onChange={(event) => updateStrategy(type.id, 'strategy', event.target.value)} placeholder="예: 후속 대화 가능성을 확인하되, 사용 가능한 자료 범위와 표현 안전선을 먼저 점검한다." />
                  </label>
                  <label className="space-y-1 md:col-span-2">
                    <span className="text-xs font-black text-slate-500">주의할 리스크</span>
                    <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.risk} onChange={(event) => updateStrategy(type.id, 'risk', event.target.value)} placeholder="예: 고객 부담, 과잉 접촉, 컴플라이언스 표현, Data 부족으로 인한 과잉 판단." />
                  </label>
                </div>

                <button type="button" className="mt-3 rounded-2xl border px-4 py-2 text-xs font-black text-slate-700" onClick={() => applyHint(type.id)}>전략 힌트 가져오기</button>
              </div>
            </details>
          );
        })}
      </div>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <h3 className="text-lg font-black text-slate-950">6개 고객 유형 대응 전략 요약</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {CUSTOMER_TYPES.map((type) => {
            const current = strategies[type.id] ?? emptyStrategy();
            return (
              <article key={type.id} className="rounded-2xl border bg-slate-50 p-4">
                <p className="font-black text-slate-950">{type.label}</p>
                <p className="mt-2 text-xs font-bold leading-5 text-slate-600">우선순위: {current.priority || '미정'}</p>
                <p className="mt-1 text-xs font-bold leading-5 text-slate-600">팀원 배정: {current.memberRole || '미정'}</p>
                <p className="mt-2 text-xs font-bold leading-5 text-slate-700">{current.strategy || '2주 대응 전략이 아직 작성되지 않았습니다.'}</p>
              </article>
            );
          })}
        </div>
      </div>

      <details className="rounded-3xl border border-indigo-100 bg-indigo-50 p-5 shadow-sm md:p-6">
        <summary className="cursor-pointer text-lg font-black text-slate-950">AI로 고객 유형별 대응 전략 점검</summary>
        <p className="mt-3 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-600">
          AI는 고객 유형별 대응 전략의 정답을 정하지 않습니다. 내가 작성한 6개 고객 유형별 전략의 Data 적합성, 과잉/과소 대응, 컴플라이언스 리스크, 팀원 배정 균형을 점검하는 용도로만 활용합니다.
        </p>

        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-black text-amber-950">입력 금지 기준</p>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {FORBIDDEN_ITEMS.map((item) => <div key={item} className="rounded-xl bg-white px-3 py-2 text-xs font-bold leading-5 text-amber-900">{item}</div>)}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border bg-white p-4">
          <h4 className="text-sm font-black text-slate-950">AI에 점검받을 항목 선택</h4>
          <div className="mt-3 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {AI_REVIEW_OPTIONS.map((option) => {
              const checked = selectedAiReviews.includes(option);
              return (
                <label key={option} className={`flex items-start gap-3 rounded-2xl border p-3 text-xs font-bold leading-5 ${checked ? 'border-indigo-700 bg-indigo-50 text-indigo-950' : 'bg-white text-slate-700'}`}>
                  <input type="checkbox" className="mt-1" checked={checked} onChange={() => toggleAiReview(option)} />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h4 className="text-sm font-black text-slate-950">복사용 AI 전략 점검 프롬프트</h4>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-600">외부 AI에 붙여넣기 전, 실제 고객정보나 제품명이 포함되지 않았는지 다시 확인하세요.</p>
            </div>
            <button type="button" className="rounded-2xl bg-indigo-700 px-4 py-3 text-sm font-black text-white" onClick={copyPrompt}>{copied ? '복사 완료' : 'AI 전략 점검 프롬프트 복사'}</button>
          </div>
          <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{aiReviewPrompt}</pre>
        </div>
      </details>
    </section>
  );
}
