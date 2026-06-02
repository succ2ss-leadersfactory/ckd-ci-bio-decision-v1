import { useMemo, useState } from 'react';

const DECISION_GUIDES = [
  {
    title: '집중 고객군으로 볼 때',
    signal: '긍정 신호가 2개 이상이고, 후속 행동이 2주 안에 가능할 때',
    check: '반응 상승, 자료 요청, 후속 미팅 동의, 높은 잠재력',
    caution: '컴플라이언스 주의 신호가 있으면 표현 안전선을 먼저 확인합니다.',
  },
  {
    title: '후순위 고객군으로 볼 때',
    signal: '주의 신호나 보완 필요가 크고, 지금 밀어붙이면 고객 부담이 커질 때',
    check: '무반응 증가, 접촉 피로, CRM 기록 부족, 컴플라이언스 높음',
    caution: '후순위는 포기가 아니라 접근 강도와 순서를 조절하는 판단입니다.',
  },
  {
    title: '관찰/유지 고객군으로 볼 때',
    signal: '관계는 안정적이지만 변화 신호가 낮아 즉시 집중보다 유지가 적합할 때',
    check: '관계 안정, 자료 요청 없음, 후속 미팅 없음, 추가 필요성 낮음',
    caution: '방치가 되지 않도록 다음 확인 시점과 관찰 기준을 정합니다.',
  },
];

const CUSTOMER_OPTIONS = [
  {
    id: 'G1',
    label: '고객군 후보 1',
    hint: '반응 상승 · 자료 요청 · 후속 가능 · 표현 주의',
    signalMix: '긍정 신호 다수 + 표현 주의',
    recommendedRole: '2주 안에 후속 대화로 연결할 집중 후보',
    reasonHint: '반응 상승, 자료 요청, 후속 미팅 동의가 있어 2주 안에 후속 대화로 연결할 가능성이 높다. 다만 표현 안전선을 먼저 확인해야 한다.',
  },
  {
    id: 'G2',
    label: '고객군 후보 2',
    hint: '관심 보류 · 니즈 재확인 · 속도 조절',
    signalMix: '긍정 신호 + 판단 유보/주의 신호',
    recommendedRole: '압박보다 니즈 재확인이 필요한 관리 후보',
    reasonHint: '잠재력과 관심 신호는 있지만 후속 미팅이 보류되어 있어, 압박보다 니즈와 보류 이유를 먼저 확인해야 한다.',
  },
  {
    id: 'G3',
    label: '고객군 후보 3',
    hint: '관계 안정 · 변화 신호 낮음 · 유지 품질',
    signalMix: '관계 긍정 신호 + 변화 신호 낮음',
    recommendedRole: '관계 품질을 유지할 관찰 후보',
    reasonHint: '관계와 접촉 기반은 안정적이지만 자료 요청이나 후속 미팅 같은 변화 신호가 낮아, 유지 품질과 반응 변화를 관찰하는 것이 적합하다.',
  },
  {
    id: 'G4',
    label: '고객군 후보 4',
    hint: '접촉 피로 · 무반응 증가 · 리스크 관리',
    signalMix: '주의 신호 다수 + 보완 필요',
    recommendedRole: '접근 강도와 표현을 줄일 후순위 후보',
    reasonHint: '접촉은 많지만 무반응과 피로감이 커지고 실행 품질도 낮아, 지금은 접근 강도를 낮추고 기록과 메시지를 정비해야 한다.',
  },
  {
    id: 'G5',
    label: '고객군 후보 5',
    hint: '기회 신호 큼 · 후속 가능 · 표현 안전선 중요',
    signalMix: '강한 긍정 신호 + 높은 컴플라이언스 주의',
    recommendedRole: '집중 가능하지만 컴플라이언스 안전선이 중요한 후보',
    reasonHint: '질문 증가와 후속 미팅 동의가 있어 집중 가능성이 높지만, 컴플라이언스 주의 신호가 강하므로 자료와 표현 안전선을 먼저 점검해야 한다.',
  },
  {
    id: 'G6',
    label: '고객군 후보 6',
    hint: '데이터 부족 · 정보 보완 · 판단 유보',
    signalMix: '보완 필요 + 판단 유보',
    recommendedRole: '분류보다 정보 보완이 먼저인 후보',
    reasonHint: '최근 반응과 CRM 기록이 부족해 고객군을 단정하기 어렵다. 우선 정보 보완과 기록 정리를 통해 판단 근거를 확보해야 한다.',
  },
];

const DEFAULT_REASONS = {
  focus: '2주 안에 후속 대화로 이어질 가능성이 높고, 팀장이 실행 우선순위를 명확히 잡아야 하기 때문이다.',
  deprioritized: '접촉 피로, 정보 부족, 또는 컴플라이언스 리스크 때문에 지금은 접근 강도를 낮추거나 보완이 먼저 필요하기 때문이다.',
  watch: '관계는 유지하되 즉시 집중하기보다 반응 변화와 추가 데이터를 관찰하는 편이 적절하기 때문이다.',
};

const AI_REVIEW_OPTIONS = [
  '집중 고객군 선택 근거 점검',
  '후순위 고객군 선택의 놓친 기회 확인',
  '관찰/유지 고객군의 전환 기준 만들기',
  '세 고객군 선택 조합의 균형 점검',
  '선택 이유 문장 다듬기',
  '컴플라이언스 리스크 재점검',
];

const FORBIDDEN_ITEMS = [
  '실제 고객명·병원명·의료진명',
  '제품명 또는 미승인 제품 표현',
  '실제 매출·처방 수치·내부 전략 수치',
  '개인정보·민감정보',
  '처방 유도·비교 우위 단정 표현',
];

type PriorityState = {
  focus: string;
  deprioritized: string;
  watch: string;
  focusReason: string;
  deprioritizedReason: string;
  watchReason: string;
};

type CustomerOption = typeof CUSTOMER_OPTIONS[number];

const INITIAL_STATE: PriorityState = {
  focus: '',
  deprioritized: '',
  watch: '',
  focusReason: '',
  deprioritizedReason: '',
  watchReason: '',
};

function findCustomerOption(value: string) {
  return CUSTOMER_OPTIONS.find((item) => item.id === value);
}

function formatCustomerSignal(option?: CustomerOption) {
  if (!option) return '아직 선택되지 않았습니다.';
  return `${option.label}: ${option.hint} / 평가 라벨 조합: ${option.signalMix} / 추천 역할: ${option.recommendedRole}`;
}

export function V38CustomerPriorityLab() {
  const [state, setState] = useState<PriorityState>(INITIAL_STATE);
  const [selectedAiReviews, setSelectedAiReviews] = useState<string[]>([
    AI_REVIEW_OPTIONS[0],
    AI_REVIEW_OPTIONS[1],
    AI_REVIEW_OPTIONS[3],
    AI_REVIEW_OPTIONS[5],
  ]);
  const [copied, setCopied] = useState(false);

  const selectedOptions = useMemo(() => ({
    focus: findCustomerOption(state.focus),
    deprioritized: findCustomerOption(state.deprioritized),
    watch: findCustomerOption(state.watch),
  }), [state.focus, state.deprioritized, state.watch]);

  const selectedLabels = useMemo(() => ({
    focus: selectedOptions.focus?.label ?? '아직 선택되지 않았습니다',
    deprioritized: selectedOptions.deprioritized?.label ?? '아직 선택되지 않았습니다',
    watch: selectedOptions.watch?.label ?? '아직 선택되지 않았습니다',
  }), [selectedOptions.focus, selectedOptions.deprioritized, selectedOptions.watch]);

  const aiReviewPrompt = useMemo(() => {
    return [
      '당신은 제약영업 팀장의 고객군 우선순위 판단을 돕는 리더십 코치입니다.',
      '',
      '아래 내용은 교육용 가상 고객군 판단 자료입니다.',
      '실제 고객명, 병원명, 의료진명, 제품명, 매출/처방 수치, 내부 민감정보는 포함하지 않습니다.',
      '',
      'AI는 정답을 제시하지 말고, 내가 선택한 집중/후순위/관찰 고객군 판단을 점검해 주세요.',
      '내 선택을 바꾸라고 단정하지 말고, 판단 근거·놓친 리스크·대안 가능성·추가 확인 질문을 제시해 주세요.',
      '',
      '반드시 지킬 안전선:',
      ...FORBIDDEN_ITEMS.map((item) => `- ${item}은 입력하거나 생성하지 마세요.`),
      '- 허가 범위를 벗어난 효능·비교·처방 유도 표현은 사용하지 마세요.',
      '- 모든 표현은 교육용 가상 상황 기준으로 작성하세요.',
      '',
      '내 선택:',
      `1. 집중 고객군: ${selectedLabels.focus}`,
      `- 선택 이유: ${state.focusReason || '아직 작성하지 않았습니다.'}`,
      '',
      `2. 후순위 고객군: ${selectedLabels.deprioritized}`,
      `- 선택 이유: ${state.deprioritizedReason || '아직 작성하지 않았습니다.'}`,
      '',
      `3. 관찰/유지 고객군: ${selectedLabels.watch}`,
      `- 선택 이유: ${state.watchReason || '아직 작성하지 않았습니다.'}`,
      '',
      '선택한 고객군 신호 요약:',
      `- 집중: ${formatCustomerSignal(selectedOptions.focus)}`,
      `- 후순위: ${formatCustomerSignal(selectedOptions.deprioritized)}`,
      `- 관찰/유지: ${formatCustomerSignal(selectedOptions.watch)}`,
      '',
      '점검 요청:',
      ...(selectedAiReviews.length > 0 ? selectedAiReviews.map((item, index) => `${index + 1}. ${item}`) : ['1. 집중/후순위/관찰 선택의 판단 근거와 리스크를 점검해 주세요.']),
      '',
      '출력 형식:',
      '1. 전체 판단 요약',
      '2. 집중 고객군 선택 점검',
      '3. 후순위 고객군 선택 점검',
      '4. 관찰/유지 고객군 선택 점검',
      '5. 놓친 리스크와 추가 확인 질문',
      '6. 다듬은 선택 이유 문장',
      '7. 최종 판단 전 팀장이 확인할 3가지',
    ].join('\n');
  }, [selectedAiReviews, selectedLabels.deprioritized, selectedLabels.focus, selectedLabels.watch, selectedOptions.deprioritized, selectedOptions.focus, selectedOptions.watch, state.deprioritizedReason, state.focusReason, state.watchReason]);

  const update = (field: keyof PriorityState, value: string) => {
    setState((current) => ({ ...current, [field]: value }));
  };

  const applyReasonHint = (field: 'focusReason' | 'deprioritizedReason' | 'watchReason', value: string) => {
    setState((current) => ({ ...current, [field]: current[field] || value }));
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
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700">v38 Customer Priority Lab</p>
        <h2 className="mt-2 text-2xl font-black text-slate-950">집중/후순위 고객군 선택하기</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          고객군을 모두 똑같이 관리할 수는 없습니다. 6단계의 Data 평가 라벨을 바탕으로 어디에 집중하고, 어디는 강도를 낮추며, 어디는 관찰 유지할지 선택합니다.
        </p>
      </div>

      <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-5 shadow-sm md:p-6">
        <h3 className="text-lg font-black text-slate-950">선택 기준 먼저 잡기</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
          아래 기준은 정답이 아니라 6단계의 긍정 신호·주의 신호·보완 필요를 7단계 우선순위 판단으로 연결하기 위한 도움말입니다.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {DECISION_GUIDES.map((guide) => (
            <article key={guide.title} className="rounded-2xl border bg-white p-4">
              <p className="font-black text-slate-950">{guide.title}</p>
              <p className="mt-2 text-xs font-black text-cyan-700">기준: {guide.signal}</p>
              <p className="mt-2 text-xs font-bold leading-5 text-slate-700">확인할 신호: {guide.check}</p>
              <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold leading-5 text-slate-600">주의: {guide.caution}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <h3 className="text-lg font-black text-slate-950">선택 전 고객군 신호 다시 보기</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {CUSTOMER_OPTIONS.map((option) => (
            <article key={option.id} className="rounded-2xl border bg-slate-50 p-4">
              <p className="font-black text-slate-900">{option.label}</p>
              <p className="mt-2 text-xs font-bold leading-5 text-slate-600">{option.hint}</p>
              <p className="mt-2 rounded-xl bg-white px-3 py-2 text-xs font-black leading-5 text-slate-700">평가 라벨 조합: {option.signalMix}</p>
              <p className="mt-2 rounded-xl bg-white px-3 py-2 text-xs font-bold leading-5 text-cyan-800">{option.recommendedRole}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <PrioritySelector
          title="집중 고객군"
          description="2주 안에 후속 대화와 실행을 가장 먼저 설계할 고객군입니다."
          value={state.focus}
          selectedOption={selectedOptions.focus}
          reason={state.focusReason}
          reasonPlaceholder="예: 반응 상승과 자료 요청이 있어 2주 안에 후속 대화로 연결할 가능성이 높다."
          defaultReason={DEFAULT_REASONS.focus}
          onValueChange={(value) => update('focus', value)}
          onReasonChange={(value) => update('focusReason', value)}
          onUseHint={(value) => applyReasonHint('focusReason', value)}
        />
        <PrioritySelector
          title="후순위 고객군"
          description="당장 밀어붙이기보다 접근 강도, 정보 보완, 리스크 관리가 먼저인 고객군입니다."
          value={state.deprioritized}
          selectedOption={selectedOptions.deprioritized}
          reason={state.deprioritizedReason}
          reasonPlaceholder="예: 접촉 피로와 컴플라이언스 리스크가 있어 현재는 접근 강도를 낮춰야 한다."
          defaultReason={DEFAULT_REASONS.deprioritized}
          onValueChange={(value) => update('deprioritized', value)}
          onReasonChange={(value) => update('deprioritizedReason', value)}
          onUseHint={(value) => applyReasonHint('deprioritizedReason', value)}
        />
        <PrioritySelector
          title="관찰/유지 고객군"
          description="관계는 유지하되 즉시 집중보다 반응 변화와 추가 데이터를 지켜볼 고객군입니다."
          value={state.watch}
          selectedOption={selectedOptions.watch}
          reason={state.watchReason}
          reasonPlaceholder="예: 관계는 안정적이지만 변화 신호가 낮아 유지 품질 관리가 적합하다."
          defaultReason={DEFAULT_REASONS.watch}
          onValueChange={(value) => update('watch', value)}
          onReasonChange={(value) => update('watchReason', value)}
          onUseHint={(value) => applyReasonHint('watchReason', value)}
        />
      </div>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <h3 className="text-lg font-black text-slate-950">2주 실행 우선순위 요약</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <SummaryCard label="집중" value={selectedLabels.focus} reason={state.focusReason} />
          <SummaryCard label="후순위" value={selectedLabels.deprioritized} reason={state.deprioritizedReason} />
          <SummaryCard label="관찰/유지" value={selectedLabels.watch} reason={state.watchReason} />
        </div>
      </div>

      <details className="rounded-3xl border border-indigo-100 bg-indigo-50 p-5 shadow-sm md:p-6">
        <summary className="cursor-pointer text-lg font-black text-slate-950">AI 우선순위 판단 점검</summary>
        <p className="mt-3 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-600">
          AI는 고객군 선택의 정답을 정하지 않습니다. 내가 선택한 집중/후순위/관찰 판단의 근거, 리스크, 대안 가능성, 실행 전 확인 조건을 점검하는 용도로만 활용합니다.
        </p>

        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-black text-amber-950">입력 금지 기준</p>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {FORBIDDEN_ITEMS.map((item) => (
              <div key={item} className="rounded-xl bg-white px-3 py-2 text-xs font-bold leading-5 text-amber-900">{item}</div>
            ))}
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
              <h4 className="text-sm font-black text-slate-950">복사용 AI 점검 프롬프트</h4>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-600">외부 AI에 붙여넣기 전, 실제 고객정보나 제품명이 포함되지 않았는지 다시 확인하세요.</p>
            </div>
            <button type="button" className="rounded-2xl bg-indigo-700 px-4 py-3 text-sm font-black text-white" onClick={copyPrompt}>
              {copied ? '복사 완료' : 'AI 점검 프롬프트 복사'}
            </button>
          </div>
          <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{aiReviewPrompt}</pre>
        </div>
      </details>
    </section>
  );
}

function PrioritySelector({
  title,
  description,
  value,
  selectedOption,
  reason,
  reasonPlaceholder,
  defaultReason,
  onValueChange,
  onReasonChange,
  onUseHint,
}: {
  title: string;
  description: string;
  value: string;
  selectedOption?: CustomerOption;
  reason: string;
  reasonPlaceholder: string;
  defaultReason: string;
  onValueChange: (value: string) => void;
  onReasonChange: (value: string) => void;
  onUseHint: (value: string) => void;
}) {
  const reasonHint = selectedOption?.reasonHint ?? defaultReason;

  return (
    <article className="rounded-3xl border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-black text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <label className="mt-4 block space-y-1">
        <span className="text-xs font-black text-slate-500">고객군 선택</span>
        <select className="min-h-12 w-full rounded-2xl border bg-white px-3 py-2 text-sm font-bold" value={value} onChange={(event) => onValueChange(event.target.value)}>
          <option value="">선택하세요</option>
          {CUSTOMER_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
        </select>
      </label>

      {selectedOption ? (
        <div className="mt-3 rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
          <p className="text-xs font-black text-cyan-800">선택한 고객군 신호</p>
          <p className="mt-2 text-sm font-black text-slate-950">{selectedOption.hint}</p>
          <p className="mt-2 rounded-xl bg-white px-3 py-2 text-xs font-black leading-5 text-slate-700">평가 라벨 조합: {selectedOption.signalMix}</p>
          <p className="mt-2 rounded-xl bg-white px-3 py-2 text-xs font-bold leading-5 text-cyan-800">추천 역할: {selectedOption.recommendedRole}</p>
          <p className="mt-2 rounded-xl bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700">선택 이유 작성 힌트: {selectedOption.reasonHint}</p>
        </div>
      ) : (
        <div className="mt-3 rounded-2xl border bg-slate-50 p-4 text-xs font-bold leading-5 text-slate-500">
          고객군을 선택하면 6단계 Data 평가 라벨과 연결된 선택 이유 힌트가 표시됩니다.
        </div>
      )}

      <label className="mt-3 block space-y-1">
        <span className="text-xs font-black text-slate-500">선택 이유</span>
        <textarea className="min-h-32 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={reason} onChange={(event) => onReasonChange(event.target.value)} placeholder={reasonPlaceholder} />
      </label>
      <button type="button" className="mt-3 rounded-2xl border px-4 py-2 text-xs font-black text-slate-700" onClick={() => onUseHint(reasonHint)}>선택 이유 힌트 사용</button>
    </article>
  );
}

function SummaryCard({ label, value, reason }: { label: string; value: string; reason: string }) {
  return (
    <article className="rounded-2xl border bg-slate-50 p-4">
      <p className="text-xs font-black text-cyan-700">{label}</p>
      <p className="mt-1 font-black text-slate-950">{value}</p>
      <p className="mt-2 text-xs font-bold leading-5 text-slate-600">{reason || '아직 이유가 작성되지 않았습니다.'}</p>
    </article>
  );
}
