import { useMemo, useState } from 'react';
import { V38CustomerJudgmentLab } from './journey-v38-customer-judgment-lab';
import {
  type V39CustomerDecisionResult,
  type V39CustomerPriorityDecision,
  createEmptyV39CustomerJudgmentResult,
  loadV39CustomerJudgmentResult,
  normalizeV39CustomerDecisionResult,
  normalizeV39CustomerJudgmentResult,
  saveV39CustomerJudgmentResult,
} from './journey-v39-customer-judgment-result-store';

type CustomerDataContext = {
  id: string;
  label: string;
  description: string;
};

type JudgmentCriterion = {
  id: string;
  label: string;
  description: string;
  className: string;
};

type CustomerTypeCard = {
  id: string;
  label: string;
  dataRead: string;
  goodSignal: string;
  cautionSignal: string;
  missingInfo: string;
  complianceNote: string;
  suggestedDecision: V39CustomerPriorityDecision;
};

type PriorityOption = {
  id: V39CustomerPriorityDecision;
  label: string;
  description: string;
};

const CUSTOMER_CONTEXT_OPTIONS: CustomerDataContext[] = [
  {
    id: 'response-up-action-low',
    label: '반응은 좋아졌지만 후속 행동은 약함',
    description: '좋은 반응이 실제 실행 가능성으로 이어지는지 확인이 필요합니다.',
  },
  {
    id: 'contact-high-depth-low',
    label: '방문 빈도는 높지만 대화 깊이는 부족함',
    description: '접촉량과 의미 있는 고객 신호를 분리해야 합니다.',
  },
  {
    id: 'stable-no-change',
    label: '관계는 안정적이나 변화 신호가 약함',
    description: '유지 관리와 새로운 니즈 확인의 균형이 필요합니다.',
  },
  {
    id: 'interest-compliance-risk',
    label: '관심은 높아 보이나 표현 안전선이 민감함',
    description: '기회 신호보다 승인 자료와 표현 범위를 먼저 확인해야 합니다.',
  },
  {
    id: 'low-base-new-question',
    label: '기존 실적은 낮지만 최근 질문이 달라짐',
    description: '낮은 과거 실적에 묻힌 변화 신호를 다시 읽어야 합니다.',
  },
  {
    id: 'activity-many-info-low',
    label: '활동 기록은 많지만 니즈 정보가 부족함',
    description: '기록량보다 판단에 필요한 정보의 질을 확인해야 합니다.',
  },
];

const JUDGMENT_CRITERIA: JudgmentCriterion[] = [
  {
    id: 'opportunity',
    label: '기회성 Data',
    description: '고객 니즈, 관심, 변화 가능성을 보여주는 신호입니다.',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-950',
  },
  {
    id: 'response',
    label: '반응성 Data',
    description: '질문, 피드백, 후속 반응, 대화의 깊이를 보여주는 신호입니다.',
    className: 'border-cyan-200 bg-cyan-50 text-cyan-950',
  },
  {
    id: 'execution',
    label: '실행 가능성 Data',
    description: '2주 안에 실제 행동으로 이어질 수 있는 정도를 보여줍니다.',
    className: 'border-indigo-200 bg-indigo-50 text-indigo-950',
  },
  {
    id: 'risk',
    label: '리스크 Data',
    description: '과잉접촉, 자료 사용, 표현 리스크, 고객 부담을 보여주는 신호입니다.',
    className: 'border-amber-200 bg-amber-50 text-amber-950',
  },
  {
    id: 'hold',
    label: '판단 유보 Data',
    description: '아직 해석하기 부족한 정보와 추가 확인이 필요한 신호입니다.',
    className: 'border-slate-200 bg-slate-50 text-slate-800',
  },
];

const CUSTOMER_TYPE_CARDS: CustomerTypeCard[] = [
  {
    id: 'A',
    label: '고객 유형 A',
    dataRead: '반응 상승, 자료 요청, 후속 미팅 동의가 함께 나타나지만 표현 안전선 확인이 필요합니다.',
    goodSignal: '자료 요청과 후속 미팅 동의가 함께 나타납니다.',
    cautionSignal: '기회처럼 보이지만 승인 자료 범위 확인이 선행되어야 합니다.',
    missingInfo: '고객 질문의 구체 내용과 답변 가능한 근거자료 범위',
    complianceNote: '자료 제공 전 승인된 자료인지 확인하고 제품명·효능 표현을 임의로 확장하지 않습니다.',
    suggestedDecision: 'focus',
  },
  {
    id: 'B',
    label: '고객 유형 B',
    dataRead: '잠재력과 관계 수준은 높지만 후속 미팅 보류와 기존 치료 유지 선호가 있습니다.',
    goodSignal: '관계 수준과 잠재력은 높게 보입니다.',
    cautionSignal: '보류 이유가 확인되지 않으면 관심 신호를 과잉해석할 수 있습니다.',
    missingInfo: '보류 이유의 실제 의미와 고객이 비교하거나 확인하려는 기준',
    complianceNote: '고객의 기존 선택을 부정하거나 전환을 압박하는 표현을 피합니다.',
    suggestedDecision: 'supplement',
  },
  {
    id: 'C',
    label: '고객 유형 C',
    dataRead: '관계는 안정적이지만 자료 요청과 후속 미팅이 없어 변화 신호는 약합니다.',
    goodSignal: '관계 유지 기반은 안정적입니다.',
    cautionSignal: '안정적 관계를 기회 신호로 착각할 수 있습니다.',
    missingInfo: '관계 유지 외에 새롭게 확인할 니즈나 변화 신호',
    complianceNote: '필요성이 낮은 상황에서 과도한 자료 제공이나 반복 접촉을 하지 않습니다.',
    suggestedDecision: 'maintain',
  },
  {
    id: 'D',
    label: '고객 유형 D',
    dataRead: '접촉은 많지만 무반응과 피로감이 커지고 실행 품질도 낮습니다.',
    goodSignal: '접촉 이력은 충분히 남아 있습니다.',
    cautionSignal: '접촉량을 실행 가능성으로 오해하면 고객 부담을 키울 수 있습니다.',
    missingInfo: '무반응 원인, 고객 부담 수준, 최근 메시지의 적절성',
    complianceNote: '반복 접촉으로 부담을 키우지 않고 고객이 요청하지 않은 정보 제공을 자제합니다.',
    suggestedDecision: 'defer',
  },
  {
    id: 'E',
    label: '고객 유형 E',
    dataRead: '질문 증가와 후속 미팅 동의가 있지만 컴플라이언스 민감도가 높습니다.',
    goodSignal: '질문 증가와 후속 미팅 동의가 함께 나타납니다.',
    cautionSignal: '기회 신호가 커도 안전선 점검 없는 실행은 위험합니다.',
    missingInfo: '질문의 범위, 승인 근거자료, 답변 가능한 표현 수준',
    complianceNote: '미승인 표현, 비교 우위 단정, 내부 수치 언급을 피하고 승인 자료 안에서 답변합니다.',
    suggestedDecision: 'focus',
  },
  {
    id: 'F',
    label: '고객 유형 F',
    dataRead: '관계 수준은 있으나 최근 콜과 CRM 기록이 부족해 판단 Data가 약합니다.',
    goodSignal: '관계 기반은 일부 존재합니다.',
    cautionSignal: '최근 Data가 부족해 과거 관계를 현재 기회로 착각할 수 있습니다.',
    missingInfo: '최근 반응, 접촉 공백 이유, 실제 니즈, CRM 기록 보완 항목',
    complianceNote: '부족한 정보를 추측으로 채우지 않고 확인 가능한 사실만 기록합니다.',
    suggestedDecision: 'supplement',
  },
];

const CUSTOMER_PRIORITY_OPTIONS: PriorityOption[] = [
  {
    id: 'focus',
    label: '집중',
    description: '2주 안에 안전한 후속 행동을 구체화할 고객입니다.',
  },
  {
    id: 'maintain',
    label: '유지',
    description: '관계와 반응 변화를 관찰하며 안정적으로 관리할 고객입니다.',
  },
  {
    id: 'defer',
    label: '보류',
    description: '지금은 접근 강도나 타이밍을 낮출 고객입니다.',
  },
  {
    id: 'supplement',
    label: '정보 보완',
    description: '판단보다 추가 확인 질문과 기록 정리가 먼저 필요한 고객입니다.',
  },
];

const PRIORITY_BADGE_CLASS: Record<V39CustomerPriorityDecision, string> = {
  focus: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  maintain: 'border-cyan-200 bg-cyan-50 text-cyan-900',
  defer: 'border-amber-200 bg-amber-50 text-amber-900',
  supplement: 'border-slate-200 bg-slate-50 text-slate-800',
};

function getPriorityLabel(priorityDecision: V39CustomerPriorityDecision | '') {
  return CUSTOMER_PRIORITY_OPTIONS.find((option) => option.id === priorityDecision)?.label ?? '미선택';
}

function getCustomerCard(customerTypeId: string) {
  return CUSTOMER_TYPE_CARDS.find((card) => card.id === customerTypeId) ?? CUSTOMER_TYPE_CARDS[0];
}

function buildInitialCustomerJudgmentState(): ReturnType<typeof loadV39CustomerJudgmentResult> {
  if (typeof window === 'undefined') return createEmptyV39CustomerJudgmentResult();
  const saved = loadV39CustomerJudgmentResult();
  const normalized = normalizeV39CustomerJudgmentResult(saved);
  const decisions = { ...normalized.decisions };

  for (const card of CUSTOMER_TYPE_CARDS) {
    decisions[card.id] = normalizeV39CustomerDecisionResult(decisions[card.id], card.id, card.label);
  }

  return { ...normalized, decisions };
}

function buildCustomerAiSignalPrompt(
  contextSelections: string[],
  criteriaSelections: string[],
  selectedCustomerTypeIds: string[],
  decisions: Record<string, V39CustomerDecisionResult>,
) {
  const selectedCards = selectedCustomerTypeIds.map(getCustomerCard);

  return [
    '당신은 제약영업 팀장의 고객 Data 판단을 돕는 AI 사고 파트너입니다.',
    '',
    '[안전선]',
    '- 아래 내용은 교육용 가상 고객 유형 Data입니다.',
    '- 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보를 추정하거나 요구하지 마세요.',
    '- 고객을 점수화하거나 등급화하지 마세요.',
    '- 미승인 효능 표현, 비교 우위 단정, 처방 유도 문장, 과도한 설득 문장을 만들지 마세요.',
    '- 답변은 확정 결론이 아니라 팀장이 다시 판단할 수 있는 신호 분리 초안으로 작성하세요.',
    '',
    '[현재 고객 Data 상황]',
    contextSelections.length > 0 ? contextSelections.map((id) => `- ${CUSTOMER_CONTEXT_OPTIONS.find((item) => item.id === id)?.label ?? id}`).join('\n') : '- 아직 선택하지 않았습니다.',
    '',
    '[판단 기준]',
    criteriaSelections.length > 0 ? criteriaSelections.map((id) => `- ${JUDGMENT_CRITERIA.find((item) => item.id === id)?.label ?? id}`).join('\n') : '- 아직 선택하지 않았습니다.',
    '',
    '[선택 고객 유형]',
    ...selectedCards.flatMap((card) => {
      const decision = decisions[card.id] ?? normalizeV39CustomerDecisionResult(undefined, card.id, card.label);
      return [
        `- ${card.label}: ${card.dataRead}`,
        `  · 현재 판단: ${getPriorityLabel(decision.priorityDecision)}`,
        `  · 판단 이유: ${decision.reason || '아직 작성 전'}`,
        `  · 다음 확인 질문: ${decision.nextCheck || '아직 작성 전'}`,
        `  · 안전선 메모: ${decision.complianceNote || card.complianceNote}`,
      ];
    }),
    '',
    '[요청]',
    '선택 고객 유형별로 아래 항목을 분리해 주세요.',
    '1. 기회 신호: 믿을 수 있는 긍정 신호와 근거',
    '2. 착시 가능성: 기회처럼 보이지만 과잉해석일 수 있는 신호',
    '3. 부족한 정보: 추가로 확인해야 할 정보',
    '4. 다음 확인 질문: 팀원이 준비해야 할 질문 중심',
    '5. 2주 실행 방향: 집중/유지/보류/정보 보완 중 현재 판단에 맞춘 안전한 방향',
    '6. 컴플라이언스 주의점: 표현, 자료 활용, 접촉 강도에서 지켜야 할 안전선',
  ].join('\n');
}

function buildDecisionFromCard(card: CustomerTypeCard): Partial<V39CustomerDecisionResult> {
  return {
    priorityDecision: card.suggestedDecision,
    reason: `${card.goodSignal} 다만 ${card.cautionSignal}`,
    nextCheck: card.missingInfo,
    complianceNote: card.complianceNote,
    opportunitySignal: card.goodSignal,
    riskSignal: card.cautionSignal,
    missingInfo: card.missingInfo,
    twoWeekDirection: CUSTOMER_PRIORITY_OPTIONS.find((option) => option.id === card.suggestedDecision)?.description ?? '',
    judgmentMemo: `${card.label}은 ${card.dataRead} 따라서 ${CUSTOMER_PRIORITY_OPTIONS.find((option) => option.id === card.suggestedDecision)?.label ?? '미선택'} 방향으로 검토하되, ${card.complianceNote}`,
  };
}

function V39CustomerDataJudgmentFlow() {
  const [result, setResult] = useState(buildInitialCustomerJudgmentState);
  const [copied, setCopied] = useState(false);

  const selectedCustomerTypeIds = result.selectedCustomerTypeIds;
  const selectedCards = selectedCustomerTypeIds.map(getCustomerCard);
  const prompt = useMemo(
    () => buildCustomerAiSignalPrompt(
      result.customerContextSelections,
      result.judgmentCriteriaSelections,
      selectedCustomerTypeIds,
      result.decisions,
    ),
    [result.customerContextSelections, result.decisions, result.judgmentCriteriaSelections, selectedCustomerTypeIds],
  );

  const persist = (patch: Partial<typeof result>) => {
    setResult((current) => {
      const next = normalizeV39CustomerJudgmentResult({ ...current, ...patch });
      saveV39CustomerJudgmentResult(next);
      return next;
    });
  };

  const updateDecision = (customerTypeId: string, patch: Partial<V39CustomerDecisionResult>) => {
    const card = getCustomerCard(customerTypeId);
    const currentDecision = normalizeV39CustomerDecisionResult(result.decisions[customerTypeId], card.id, card.label);
    persist({
      decisions: {
        ...result.decisions,
        [customerTypeId]: {
          ...currentDecision,
          ...patch,
        },
      },
    });
  };

  const toggleContext = (id: string) => {
    const exists = result.customerContextSelections.includes(id);
    const next = exists
      ? result.customerContextSelections.filter((item) => item !== id)
      : result.customerContextSelections.length >= 3
        ? result.customerContextSelections
        : [...result.customerContextSelections, id];
    persist({ customerContextSelections: next });
  };

  const toggleCriterion = (id: string) => {
    const exists = result.judgmentCriteriaSelections.includes(id);
    const next = exists
      ? result.judgmentCriteriaSelections.filter((item) => item !== id)
      : [...result.judgmentCriteriaSelections, id];
    persist({ judgmentCriteriaSelections: next });
  };

  const toggleCustomerType = (id: string) => {
    const exists = selectedCustomerTypeIds.includes(id);
    const next = exists
      ? selectedCustomerTypeIds.filter((item) => item !== id)
      : selectedCustomerTypeIds.length >= 3
        ? selectedCustomerTypeIds
        : [...selectedCustomerTypeIds, id];
    persist({ selectedCustomerTypeIds: next });
  };

  const copyPrompt = () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    void navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  };

  const applyDraft = (card: CustomerTypeCard) => {
    updateDecision(card.id, buildDecisionFromCard(card));
  };

  const resetFlow = () => {
    const empty = createEmptyV39CustomerJudgmentResult();
    const decisions: Record<string, V39CustomerDecisionResult> = {};
    for (const card of CUSTOMER_TYPE_CARDS) {
      decisions[card.id] = normalizeV39CustomerDecisionResult(undefined, card.id, card.label);
    }
    const next = { ...empty, decisions };
    saveV39CustomerJudgmentResult(next);
    setResult(next);
  };

  return (
    <section className="space-y-4">
      <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
              <span>↗</span>
              <span>6단계 고객 Data 분석</span>
            </div>
            <h2 className="mt-8 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">고객 Data에서 기회와 착시 구분하기</h2>
            <p className="mt-6 max-w-4xl text-base font-bold leading-8 text-slate-600">
              고객을 등급화하거나 점수화하지 않습니다. 고객 Data에서 믿을 수 있는 신호, 착시 가능성, 부족한 정보, 2주 안에 가능한 다음 행동을 구분합니다.
            </p>
            <div className="mt-8 rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-sm font-bold leading-6 text-emerald-950">
              실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다.
            </div>
          </div>
          <div className="grid gap-3">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-950">상황 선택 {result.customerContextSelections.length} / 3</div>
            <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm font-black text-cyan-950">판단 기준 {result.judgmentCriteriaSelections.length} / {JUDGMENT_CRITERIA.length}</div>
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-black text-indigo-950">고객 유형 {selectedCustomerTypeIds.length} / 3</div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-black text-amber-950">AI 결과 {result.rawAiSignalResult.trim() ? '입력됨' : '대기'}</div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Block 0</p>
        <h3 className="text-xl font-black text-slate-950">고객 Data 상황 선택</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">지금 보고 있는 고객 Data 상황을 최대 3개까지 선택하세요. 먼저 상황을 좁혀야 Data 해석이 선명해집니다.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {CUSTOMER_CONTEXT_OPTIONS.map((option) => {
            const selected = result.customerContextSelections.includes(option.id);
            const disabled = !selected && result.customerContextSelections.length >= 3;
            return (
              <button key={option.id} type="button" disabled={disabled} className={`rounded-2xl border p-4 text-left ${selected ? 'border-emerald-300 bg-white text-emerald-950 shadow-sm' : disabled ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-700'}`} onClick={() => toggleContext(option.id)}>
                <p className="text-sm font-black">{option.label}</p>
                <p className="mt-2 text-xs font-bold leading-5">{option.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Block 1</p>
        <h3 className="text-xl font-black text-slate-950">고객 판단 기준 정하기</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">이번 Data를 어떤 렌즈로 볼지 선택합니다. 고객을 분류하기보다 신호의 성격을 나누는 단계입니다.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {JUDGMENT_CRITERIA.map((criterion) => {
            const selected = result.judgmentCriteriaSelections.includes(criterion.id);
            return (
              <button key={criterion.id} type="button" className={`rounded-2xl border p-4 text-left ${selected ? criterion.className : 'bg-white text-slate-700'}`} onClick={() => toggleCriterion(criterion.id)}>
                <p className="text-sm font-black">{criterion.label}</p>
                <p className="mt-2 text-xs font-bold leading-5">{criterion.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-indigo-700">Block 2-3</p>
        <h3 className="text-xl font-black text-slate-950">고객 유형 A~F 카드 보기와 판단 대상 선택</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">전체 고객을 다 판단하지 말고, 지금 판단이 필요한 고객 유형 2~3개를 선택하세요.</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {CUSTOMER_TYPE_CARDS.map((card) => {
            const selected = selectedCustomerTypeIds.includes(card.id);
            const disabled = !selected && selectedCustomerTypeIds.length >= 3;
            return (
              <article key={card.id} className={`rounded-3xl border p-4 shadow-sm ${selected ? 'border-indigo-300 bg-indigo-50' : 'bg-white'}`}>
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-base font-black text-slate-950">{card.label}</p>
                    <p className="mt-2 text-xs font-bold leading-5 text-slate-600">{card.dataRead}</p>
                  </div>
                  <button type="button" disabled={disabled} className={`rounded-full px-4 py-2 text-xs font-black ${selected ? 'bg-indigo-700 text-white' : disabled ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white'}`} onClick={() => toggleCustomerType(card.id)}>
                    {selected ? '선택됨' : '판단 대상 선택'}
                  </button>
                </div>
                <div className="mt-4 grid gap-2 md:grid-cols-2">
                  <div className="rounded-2xl bg-emerald-50 p-3 text-xs font-bold leading-5 text-emerald-950"><span className="font-black">좋은 신호</span><br />{card.goodSignal}</div>
                  <div className="rounded-2xl bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-950"><span className="font-black">주의 신호</span><br />{card.cautionSignal}</div>
                  <div className="rounded-2xl bg-slate-50 p-3 text-xs font-bold leading-5 text-slate-700"><span className="font-black">부족 정보</span><br />{card.missingInfo}</div>
                  <div className="rounded-2xl bg-rose-50 p-3 text-xs font-bold leading-5 text-rose-950"><span className="font-black">안전선</span><br />{card.complianceNote}</div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Block 4-5</p>
        <h3 className="text-xl font-black text-slate-950">AI 고객 신호 분리 프롬프트 준비</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">AI에게 판단을 맡기지 않고, 기회 신호·착시 가능성·부족 정보·확인 질문·안전선을 분리하도록 요청합니다.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white" onClick={copyPrompt}>{copied ? '프롬프트 복사 완료' : 'AI 분석 프롬프트 복사'}</button>
          <button type="button" className="rounded-2xl border bg-white px-4 py-3 text-sm font-black text-slate-700" onClick={resetFlow}>입력 초기화</button>
        </div>
        <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{prompt}</pre>
        <label className="mt-4 block space-y-1">
          <span className="text-xs font-black text-slate-600">AI 결과 붙여넣기</span>
          <textarea className="min-h-32 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6" value={result.rawAiSignalResult} onChange={(event) => persist({ rawAiSignalResult: event.target.value })} placeholder="AI가 분리한 고객 신호 결과를 붙여넣으세요. 아래 고객별 메모는 팀장이 직접 수정해 확정합니다." />
        </label>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-violet-700">Block 6-8</p>
        <h3 className="text-xl font-black text-slate-950">고객별 신호 정리와 2주 판단 메모</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">선택한 고객 유형별로 신호를 분리하고, 최종 대응 방향을 정리합니다. 이 결과는 다음 단계의 고객 대응 전략 참고자료가 됩니다.</p>
        {selectedCards.length === 0 ? (
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">먼저 고객 유형 A~F 중 판단이 필요한 고객 유형 2~3개를 선택하세요.</div>
        ) : (
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            {selectedCards.map((card) => {
              const current = normalizeV39CustomerDecisionResult(result.decisions[card.id], card.id, card.label);
              return (
                <article key={card.id} className="rounded-3xl border bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-base font-black text-slate-950">{card.label}</p>
                      <p className="mt-1 text-xs font-bold leading-5 text-slate-600">{card.dataRead}</p>
                    </div>
                    <button type="button" className="rounded-full border bg-slate-50 px-4 py-2 text-xs font-black text-slate-700" onClick={() => applyDraft(card)}>판단 초안 가져오기</button>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <label className="space-y-1">
                      <span className="text-xs font-black text-slate-500">기회 신호</span>
                      <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.opportunitySignal} onChange={(event) => updateDecision(card.id, { opportunitySignal: event.target.value })} />
                    </label>
                    <label className="space-y-1">
                      <span className="text-xs font-black text-slate-500">착시·리스크 신호</span>
                      <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.riskSignal} onChange={(event) => updateDecision(card.id, { riskSignal: event.target.value })} />
                    </label>
                    <label className="space-y-1">
                      <span className="text-xs font-black text-slate-500">부족한 정보</span>
                      <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.missingInfo} onChange={(event) => updateDecision(card.id, { missingInfo: event.target.value })} />
                    </label>
                    <label className="space-y-1">
                      <span className="text-xs font-black text-slate-500">다음 확인 질문</span>
                      <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.nextCheck} onChange={(event) => updateDecision(card.id, { nextCheck: event.target.value })} />
                    </label>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-4">
                    {CUSTOMER_PRIORITY_OPTIONS.map((option) => (
                      <label key={option.id} className={`cursor-pointer rounded-2xl border p-3 text-center text-xs font-black ${current.priorityDecision === option.id ? PRIORITY_BADGE_CLASS[option.id] : 'bg-white text-slate-600'}`}>
                        <input type="radio" className="sr-only" name={`customer-priority-${card.id}`} checked={current.priorityDecision === option.id} onChange={() => updateDecision(card.id, { priorityDecision: option.id, twoWeekDirection: option.description })} />
                        {option.label}
                      </label>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <label className="space-y-1">
                      <span className="text-xs font-black text-slate-500">2주 실행 방향</span>
                      <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.twoWeekDirection} onChange={(event) => updateDecision(card.id, { twoWeekDirection: event.target.value })} />
                    </label>
                    <label className="space-y-1">
                      <span className="text-xs font-black text-slate-500">컴플라이언스 안전선</span>
                      <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.complianceNote} onChange={(event) => updateDecision(card.id, { complianceNote: event.target.value })} />
                    </label>
                    <label className="space-y-1 md:col-span-2">
                      <span className="text-xs font-black text-slate-500">고객별 2주 판단 메모</span>
                      <textarea className="min-h-28 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.judgmentMemo} onChange={(event) => updateDecision(card.id, { judgmentMemo: event.target.value, reason: event.target.value })} placeholder="예: 이 고객은 기회 신호가 있으나 표현 안전선 확인이 먼저 필요하다. 2주 안에는 확인 질문과 승인 자료 범위 점검을 우선한다." />
                    </label>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
}

export function V39CustomerJudgmentLab() {
  return (
    <section className="space-y-4">
      <V39CustomerDataJudgmentFlow />
      <V38CustomerJudgmentLab />
    </section>
  );
}
