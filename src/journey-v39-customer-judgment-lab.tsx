import { useMemo, useState } from 'react';
import { loadV39DashboardResult } from './journey-v39-dashboard-result-store';
import {
  type V39CustomerDecisionResult,
  createEmptyV39CustomerJudgmentResult,
  loadV39CustomerJudgmentResult,
  normalizeV39CustomerDecisionResult,
  normalizeV39CustomerJudgmentResult,
  saveV39CustomerJudgmentResult,
} from './journey-v39-customer-judgment-result-store';

const V39_CUSTOMER_DATA_CHECK_SMOKE_MARKERS = [
  'V39CustomerJudgmentLab',
  'V39CustomerDataJudgmentFlow',
  '고객 Data 확인 List',
  '고객의 무엇을 확인할 것인가',
  '이번 2주 동안 고객 Data에서 볼 신호',
  '필수 3개만 완료하면 다음 단계로 갈 수 있습니다',
  '기회 신호 기준',
  '주의 신호 기준',
  '부족한 정보',
  '추가 확인 질문',
  '7단계로 넘길 대응 준비 메모',
  '영업활동 기록이 실행 판단에 충분한가',
].join('|');
void V39_CUSTOMER_DATA_CHECK_SMOKE_MARKERS;

type DataCheckContext = {
  id: string;
  label: string;
  description: string;
};

type DataCheckLens = {
  id: string;
  label: string;
  description: string;
  className: string;
};

type DataCheckItem = {
  id: string;
  label: string;
  checkTarget: string;
  likelyData: string;
  opportunityCriteria: string;
  cautionCriteria: string;
  missingInfo: string;
  checkQuestion: string;
  complianceNote: string;
};

const DATA_CONTEXT_OPTIONS: DataCheckContext[] = [
  {
    id: 'follow-up-conversion',
    label: '방문 이후 후속 행동이 실제로 남았는가',
    description: '방문·통화·자료 전달 이후 다음 약속, 질문, 요청, 기록이 이어졌는지 봅니다.',
  },
  {
    id: 'reaction-quality',
    label: '고객 반응의 질이 달라졌는가',
    description: '단순 호의가 아니라 구체 질문, 니즈 표현, 자료 요청 등으로 바뀌었는지 확인합니다.',
  },
  {
    id: 'activity-record-quality',
    label: '영업활동 기록이 실행 판단에 충분한가',
    description: '기록량보다 다음 행동 판단에 필요한 정보가 남아 있는지 확인합니다.',
  },
  {
    id: 'activity-constraint',
    label: '방문·대화에 제약이 생겼는가',
    description: '일정 변경, 접근 제한, 대체 접점 필요, 내부 지원 필요 여부를 봅니다.',
  },
  {
    id: 'safe-material-use',
    label: '자료·표현 안전선을 먼저 확인해야 하는가',
    description: '승인자료 범위, 표현 리스크, 과도한 설득 가능성을 확인합니다.',
  },
];

const DATA_CHECK_LENSES: DataCheckLens[] = [
  {
    id: 'response',
    label: '고객 반응 Data',
    description: '질문, 피드백, 자료 요청, 후속 반응의 구체성을 봅니다.',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-950',
  },
  {
    id: 'next-step',
    label: '다음 접점 Data',
    description: '다음 대화·방문·자료 확인으로 이어질 가능성을 봅니다.',
    className: 'border-cyan-200 bg-cyan-50 text-cyan-950',
  },
  {
    id: 'coverage',
    label: '고객군 커버리지 Data',
    description: '기존 고객 편중, 신규·미접촉 고객군, 접점 공백을 봅니다.',
    className: 'border-indigo-200 bg-indigo-50 text-indigo-950',
  },
  {
    id: 'constraint',
    label: '제약요인 Data',
    description: '방문 제한, 일정 변경, 정보 접근 제한, 내부 지원 필요성을 봅니다.',
    className: 'border-amber-200 bg-amber-50 text-amber-950',
  },
  {
    id: 'safety',
    label: '표현·자료 안전 Data',
    description: '승인자료 범위, 표현 리스크, 고객 부담 가능성을 봅니다.',
    className: 'border-rose-200 bg-rose-50 text-rose-950',
  },
];

const DATA_CHECK_ITEMS: DataCheckItem[] = [
  {
    id: 'A',
    label: '확인 신호 A · 고객 반응 변화',
    checkTarget: '고객의 질문, 피드백, 자료 요청, 반응 구체성',
    likelyData: '고객 질문 내용, 자료 요청 여부, 피드백 기록, 대화 후 메모',
    opportunityCriteria: '질문이 구체적이고 다음 논의 주제가 남아 있으면 기회 신호로 봅니다.',
    cautionCriteria: '호의적 반응만으로 실행 가능성을 단정하지 않습니다.',
    missingInfo: '고객이 실제로 무엇을 확인하고 싶어 하는지, 질문의 배경이 무엇인지',
    checkQuestion: '고객이 다음에 확인하고 싶은 주제는 무엇인가?',
    complianceNote: '고객 질문에 답할 때 승인자료 범위 밖의 표현을 확장하지 않습니다.',
  },
  {
    id: 'B',
    label: '확인 신호 B · 다음 접점 가능성',
    checkTarget: '후속 미팅, 다음 약속, 응답 속도, 논의 일정 가능성',
    likelyData: '후속 미팅 여부, 다음 약속 기록, 응답 속도, 일정 변경 기록',
    opportunityCriteria: '다음 접점이 명확하거나 고객이 확인 일정을 제안하면 기회 신호로 봅니다.',
    cautionCriteria: '일정 가능성만으로 고객 의사나 성과 가능성을 단정하지 않습니다.',
    missingInfo: '다음 접점의 목적, 준비 자료, 고객이 기대하는 논의 범위',
    checkQuestion: '다음 접점에서 고객이 확인하려는 것은 무엇인가?',
    complianceNote: '다음 접점 확보를 위해 과도한 설득이나 압박 표현을 쓰지 않습니다.',
  },
  {
    id: 'C',
    label: '확인 신호 C · 신규·미접촉 고객군',
    checkTarget: '미접촉 고객군, 신규 고객 반응, 접근 경로, 기존 고객 편중 여부',
    likelyData: '고객군별 접촉 이력, 신규 접점 수, 미접촉 기간, 접근 경로 기록',
    opportunityCriteria: '미접촉 고객군에서 새로운 질문이나 반응이 확인되면 기회 신호로 봅니다.',
    cautionCriteria: '신규 접촉 수만으로 활동 품질이나 성과를 판단하지 않습니다.',
    missingInfo: '접근 경로, 고객군별 반응 차이, 왜 미접촉 상태였는지',
    checkQuestion: '새롭게 봐야 할 고객군은 어디이며, 접근을 막는 요인은 무엇인가?',
    complianceNote: '신규 고객 접근에서도 실제 고객명·기관명·내부 수치를 입력하지 않습니다.',
  },
  {
    id: 'D',
    label: '확인 신호 D · 방문 외 대체 접점',
    checkTarget: '방문 외 대체 접점, 온라인·자료·협업 가능성, 대안활동 실행 여부',
    likelyData: '비대면 접점 기록, 자료 전달 후 확인 여부, 협업 요청, 대체 접점 실행 메모',
    opportunityCriteria: '방문이 어렵지만 자료 확인이나 대체 접점이 이어지면 실행 신호로 봅니다.',
    cautionCriteria: '자료 전달 자체를 고객 이해나 실행 가능성으로 해석하지 않습니다.',
    missingInfo: '대체 접점의 목적, 자료 확인 여부, 후속 질문 유무',
    checkQuestion: '방문이 어려운 고객에게 어떤 대체 접점이 실제로 작동했는가?',
    complianceNote: '자료 전달 시 승인자료 여부와 전달 목적을 명확히 합니다.',
  },
  {
    id: 'E',
    label: '확인 신호 E · 방문·대화 제약요인',
    checkTarget: '방문 제한, 일정 변경, 정보 접근 제한, 내부 지원 필요 여부',
    likelyData: '방문 제한 사유, 일정 변경 기록, 고객 응답 지연, 내부 지원 요청',
    opportunityCriteria: '제약요인이 구체적으로 확인되면 우선순위보다 해결 조건을 설계할 수 있습니다.',
    cautionCriteria: '환경 탓으로 모든 실행 부진을 설명하지 않습니다.',
    missingInfo: '실제 제약인지, 준비 부족인지, 팀 지원이 필요한 문제인지',
    checkQuestion: '후속조치가 미뤄진 이유는 고객 제약인가, 팀 실행 제약인가?',
    complianceNote: '고객 사정을 추정하거나 민감한 내부 상황을 기록하지 않습니다.',
  },
  {
    id: 'F',
    label: '확인 신호 F · 표현·자료 사용 안전선',
    checkTarget: '승인자료 활용 여부, 위험 표현, 비교 우위 단정, 고객 부담 가능성',
    likelyData: '사용 자료, 전달 메시지, 고객 질문 범위, 수정한 표현, 안전선 점검 기록',
    opportunityCriteria: '고객 질문이 있어도 승인자료 안에서 안전하게 답변 가능한 범위가 확인되면 실행 가능성이 높아집니다.',
    cautionCriteria: '관심이 높아 보일수록 미승인 표현이나 과도한 약속 위험이 커질 수 있습니다.',
    missingInfo: '답변 가능한 근거자료, 승인자료 범위, 사용하면 안 되는 표현',
    checkQuestion: '이 고객에게 말해도 되는 것과 말하면 안 되는 것은 무엇인가?',
    complianceNote: '미승인 효능 표현, 비교 우위 단정, 처방 유도 문장을 만들지 않습니다.',
  },
];

function compactList(items: string[], limit = 8) {
  const seen = new Set<string>();
  const results: string[] = [];
  for (const item of items) {
    const clean = item.replace(/^[-*•]\s*/, '').replace(/^\d+[.)]\s*/, '').trim();
    if (!clean || seen.has(clean)) continue;
    seen.add(clean);
    results.push(clean);
    if (results.length >= limit) break;
  }
  return results;
}

function splitLines(value: string, limit = 8) {
  return compactList(value.split(/\r?\n/), limit);
}

function getDashboardBridge() {
  if (typeof window === 'undefined') {
    return { coreMetrics: [], fieldSignals: [], cautions: [], questions: [], rationale: '', teamSituations: [] };
  }
  const result = loadV39DashboardResult();
  return {
    coreMetrics: compactList(result.metricSelection.selectedCoreMetricIds, 6),
    fieldSignals: compactList(result.metricSelection.selectedSupportMetricIds, 6),
    cautions: compactList(result.metricSelection.selectedSafetyMetricIds, 6),
    questions: splitLines(result.metricResult.aiRecommendedQuestions, 6),
    rationale: result.metricSelection.metricRationale.trim() || result.metricResult.additionalMetricIdea.trim(),
    teamSituations: compactList(result.teamSituations, 4),
  };
}

function dataContextLabel(id: string) {
  return DATA_CONTEXT_OPTIONS.find((item) => item.id === id)?.label ?? id;
}

function dataLensLabel(id: string) {
  return DATA_CHECK_LENSES.find((item) => item.id === id)?.label ?? id;
}

function getDataCheckItem(id: string) {
  return DATA_CHECK_ITEMS.find((item) => item.id === id) ?? DATA_CHECK_ITEMS[0];
}

function buildInitialCustomerJudgmentState(): ReturnType<typeof loadV39CustomerJudgmentResult> {
  if (typeof window === 'undefined') return createEmptyV39CustomerJudgmentResult();
  const saved = loadV39CustomerJudgmentResult();
  const normalized = normalizeV39CustomerJudgmentResult(saved);
  const decisions = { ...normalized.decisions };

  for (const item of DATA_CHECK_ITEMS) {
    decisions[item.id] = normalizeV39CustomerDecisionResult(decisions[item.id], item.id, item.label);
  }

  return { ...normalized, decisions };
}

function buildDataCheckPrompt(
  contextSelections: string[],
  lensSelections: string[],
  selectedItemIds: string[],
  decisions: Record<string, V39CustomerDecisionResult>,
) {
  const dashboardBridge = getDashboardBridge();
  const selectedItems = selectedItemIds.map(getDataCheckItem);

  return [
    '당신은 제약영업 팀장의 고객 Data 확인 List 작성을 돕는 AI 사고 파트너입니다.',
    '',
    '[안전선]',
    '- 아래 내용은 교육용 가상 고객 Data 확인 실습입니다.',
    '- 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보를 추정하거나 요구하지 마세요.',
    '- 고객을 점수화하거나 등급화하지 마세요.',
    '- 미승인 효능 표현, 비교 우위 단정, 처방 유도 문장, 과도한 설득 문장을 만들지 마세요.',
    '- 답변은 고객 우선순위 결정이 아니라, 팀장이 고객 Data에서 확인해야 할 신호·부족 정보·추가 질문을 분리하는 초안으로 작성하세요.',
    '',
    '[5단계에서 가져온 기준]',
    dashboardBridge.coreMetrics.length > 0 ? dashboardBridge.coreMetrics.map((item) => `- 핵심 실행 지표: ${item}`).join('\n') : '- 핵심 실행 지표: 아직 선택되지 않음',
    dashboardBridge.fieldSignals.length > 0 ? dashboardBridge.fieldSignals.map((item) => `- 함께 볼 현장 신호: ${item}`).join('\n') : '- 함께 볼 현장 신호: 아직 없음',
    dashboardBridge.cautions.length > 0 ? dashboardBridge.cautions.map((item) => `- 조심할 해석: ${item}`).join('\n') : '- 조심할 해석: 아직 없음',
    dashboardBridge.questions.length > 0 ? dashboardBridge.questions.map((item) => `- 팀장이 확인할 질문: ${item}`).join('\n') : '- 팀장이 확인할 질문: 아직 없음',
    dashboardBridge.rationale ? `- 왜 이 지표를 보는가: ${dashboardBridge.rationale}` : '- 왜 이 지표를 보는가: 아직 없음',
    '',
    '[고객 Data에서 먼저 볼 신호]',
    contextSelections.length > 0 ? contextSelections.map((id) => `- ${dataContextLabel(id)}`).join('\n') : '- 아직 선택하지 않았습니다.',
    '',
    '[확인 렌즈]',
    lensSelections.length > 0 ? lensSelections.map((id) => `- ${dataLensLabel(id)}`).join('\n') : '- 아직 선택하지 않았습니다.',
    '',
    '[선택한 고객 Data 확인 신호]',
    ...selectedItems.flatMap((item) => {
      const decision = decisions[item.id] ?? normalizeV39CustomerDecisionResult(undefined, item.id, item.label);
      return [
        `- ${item.label}`,
        `  · 확인할 Data: ${decision.reason || item.checkTarget}`,
        `  · 기회 신호 기준: ${decision.opportunitySignal || item.opportunityCriteria}`,
        `  · 주의 신호 기준: ${decision.riskSignal || item.cautionCriteria}`,
        `  · 부족한 정보: ${decision.missingInfo || item.missingInfo}`,
        `  · 추가 확인 질문: ${decision.nextCheck || item.checkQuestion}`,
        `  · 7단계로 넘길 메모: ${decision.twoWeekDirection || '아직 작성되지 않았습니다.'}`,
        `  · 안전선: ${decision.complianceNote || item.complianceNote}`,
      ];
    }),
    '',
    '[요청]',
    '선택한 항목별로 고객 Data 확인 List 초안을 작성해 주세요.',
    '1. 확인할 고객 Data 항목',
    '2. 어디에서 확인할지: 영업활동 기록, 방문·면담 메모, 후속 질문, 자료 요청, 일정 변경, 팀원 확인 등',
    '3. 기회 신호 기준: 어떤 경우를 긍정 신호로 볼 수 있는지',
    '4. 주의 신호 기준: 어떤 경우를 과잉해석하면 안 되는지',
    '5. 부족한 정보: 아직 확인해야 할 정보',
    '6. 추가 확인 질문: 팀원이 다음 방문·면담 전에 준비할 질문',
    '7. 7단계로 넘길 대응 준비 메모: 고객군별 대응 방향을 정할 때 참고할 1~2줄 메모',
    '8. 표현·자료 안전선: 사용하면 안 되는 표현과 확인해야 할 자료 범위',
    '',
    '주의: 7단계에서 고객군별 대응 방향을 정할 예정이므로, 여기서는 고객 우선순위나 대응 전략을 확정하지 말고 확인 List만 작성해 주세요.',
  ].join('\n');
}

function buildDecisionFromItem(item: DataCheckItem): Partial<V39CustomerDecisionResult> {
  return {
    priorityDecision: '',
    reason: item.checkTarget,
    nextCheck: item.checkQuestion,
    complianceNote: item.complianceNote,
    opportunitySignal: item.opportunityCriteria,
    riskSignal: item.cautionCriteria,
    missingInfo: item.missingInfo,
    twoWeekDirection: '7단계에서 고객군별 대응 방향을 정할 때 이 신호가 기회인지, 추가 확인이 필요한지 먼저 구분합니다.',
    judgmentMemo: `${item.label}: ${item.likelyData}를 확인하고, 기회 신호와 주의 신호를 분리합니다.`,
  };
}

function PillList({ items, emptyText }: { items: string[]; emptyText: string }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {items.length > 0 ? items.map((item) => <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-black text-slate-700">{item}</span>) : <span className="text-xs font-bold text-slate-500">{emptyText}</span>}
    </div>
  );
}

function V39CustomerDataJudgmentFlow() {
  const [result, setResult] = useState(buildInitialCustomerJudgmentState);
  const [copied, setCopied] = useState(false);
  const selectedItemIds = result.selectedCustomerTypeIds;
  const selectedItems = selectedItemIds.map(getDataCheckItem);
  const dashboardBridge = useMemo(() => getDashboardBridge(), [result.updatedAt, result.selectedCustomerTypeIds.length]);
  const requiredDoneCount = [
    selectedItemIds.length >= 1,
    selectedItems.some((item) => result.decisions[item.id]?.missingInfo?.trim()),
    selectedItems.some((item) => result.decisions[item.id]?.nextCheck?.trim()),
  ].filter(Boolean).length;
  const prompt = useMemo(
    () => buildDataCheckPrompt(
      result.customerContextSelections,
      result.judgmentCriteriaSelections,
      selectedItemIds,
      result.decisions,
    ),
    [result.customerContextSelections, result.decisions, result.judgmentCriteriaSelections, selectedItemIds],
  );

  const persist = (patch: Partial<typeof result>) => {
    setResult((current) => {
      const next = normalizeV39CustomerJudgmentResult({ ...current, ...patch });
      saveV39CustomerJudgmentResult(next);
      return next;
    });
  };

  const updateDecision = (itemId: string, patch: Partial<V39CustomerDecisionResult>) => {
    const item = getDataCheckItem(itemId);
    const currentDecision = normalizeV39CustomerDecisionResult(result.decisions[itemId], item.id, item.label);
    persist({
      decisions: {
        ...result.decisions,
        [itemId]: {
          ...currentDecision,
          ...patch,
        },
      },
    });
  };

  const toggleContext = (id: string) => {
    const exists = result.customerContextSelections.includes(id);
    const next = exists ? [] : [id];
    persist({ customerContextSelections: next });
  };

  const toggleLens = (id: string) => {
    const exists = result.judgmentCriteriaSelections.includes(id);
    const next = exists
      ? result.judgmentCriteriaSelections.filter((item) => item !== id)
      : result.judgmentCriteriaSelections.length >= 2
        ? result.judgmentCriteriaSelections
        : [...result.judgmentCriteriaSelections, id];
    persist({ judgmentCriteriaSelections: next });
  };

  const toggleDataCheckItem = (id: string) => {
    const exists = selectedItemIds.includes(id);
    const next = exists
      ? selectedItemIds.filter((item) => item !== id)
      : selectedItemIds.length >= 3
        ? selectedItemIds
        : [...selectedItemIds, id];
    persist({ selectedCustomerTypeIds: next });
  };

  const copyPrompt = () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    void navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  };

  const applyDraft = (item: DataCheckItem) => {
    updateDecision(item.id, buildDecisionFromItem(item));
  };

  const resetFlow = () => {
    const empty = createEmptyV39CustomerJudgmentResult();
    const decisions: Record<string, V39CustomerDecisionResult> = {};
    for (const item of DATA_CHECK_ITEMS) {
      decisions[item.id] = normalizeV39CustomerDecisionResult(undefined, item.id, item.label);
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
            <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700"><span>↗</span><span>6단계 고객 Data 확인 List</span></div>
            <h2 className="mt-8 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">고객의 무엇을 확인할 것인가</h2>
            <p className="mt-6 max-w-4xl text-base font-bold leading-8 text-slate-600">5단계에서 정한 관리 지표를 고객 Data에서 확인할 신호로 바꿉니다. 고객을 평가하지 않고, 기회 신호·주의 신호·부족 정보·추가 확인 질문을 나눕니다.</p>
            <div className="mt-8 rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-sm font-bold leading-6 text-emerald-950">실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다.</div>
          </div>
          <div className="grid gap-3">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-950">필수 완료 {requiredDoneCount} / 3</div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-black text-sky-950">먼저 볼 신호 {result.customerContextSelections.length} / 1</div>
            <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm font-black text-cyan-950">확인 렌즈 {result.judgmentCriteriaSelections.length} / 2</div>
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-black text-indigo-950">확인 신호 {selectedItemIds.length} / 3</div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">5단계에서 가져온 기준</p>
        <h3 className="mt-1 text-xl font-black text-slate-950">이번 2주 동안 고객 Data에서 볼 신호</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">아래 내용은 새로 정하는 기준이 아니라, 5단계에서 가져온 관리 지표와 현장 신호입니다. 이번 단계에서는 이를 고객 Data에서 확인할 신호와 질문으로 바꿉니다.</p>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-4"><p className="text-sm font-black text-slate-950">핵심 실행 지표</p><PillList items={dashboardBridge.coreMetrics} emptyText="5단계에서 선택한 지표가 아직 없습니다." /></div>
          <div className="rounded-2xl bg-white p-4"><p className="text-sm font-black text-slate-950">함께 볼 현장 신호</p><PillList items={dashboardBridge.fieldSignals} emptyText="5단계에서 분리한 현장 신호가 아직 없습니다." /></div>
          <div className="rounded-2xl bg-white p-4"><p className="text-sm font-black text-slate-950">조심할 해석</p><PillList items={dashboardBridge.cautions} emptyText="5단계에서 분리한 조심할 해석이 아직 없습니다." /></div>
          <div className="rounded-2xl bg-white p-4"><p className="text-sm font-black text-slate-950">팀장이 확인할 질문</p><PillList items={dashboardBridge.questions} emptyText="5단계에서 남긴 확인 질문이 아직 없습니다." /></div>
        </div>
        <div className="mt-3 rounded-2xl bg-white p-4 text-xs font-bold leading-5 text-slate-700"><p className="font-black text-slate-950">왜 이 지표를 보려는가</p><p className="mt-1">{dashboardBridge.rationale || '5단계에서 지표 선정 이유를 한 문장으로 남기면 이곳에 표시됩니다.'}</p></div>
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Block 1</p>
        <h3 className="text-xl font-black text-slate-950">고객 Data에서 먼저 볼 신호 1개 선택</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">참여 부담을 줄이기 위해 가장 중요한 상황 1개만 선택합니다. 여러 신호가 보여도 7단계 대응 전에는 우선 확인 질문을 선명하게 만드는 것이 중요합니다.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {DATA_CONTEXT_OPTIONS.map((option) => {
            const selected = result.customerContextSelections.includes(option.id);
            return (
              <button key={option.id} type="button" className={`rounded-2xl border p-4 text-left ${selected ? 'border-emerald-300 bg-white text-emerald-950 shadow-sm' : 'bg-white text-slate-700'}`} onClick={() => toggleContext(option.id)}>
                <p className="text-sm font-black">{option.label}</p>
                <p className="mt-2 text-xs font-bold leading-5">{option.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Block 2</p>
        <h3 className="text-xl font-black text-slate-950">확인 렌즈 최대 2개 선택</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">고객을 분류하지 않습니다. 이번 Data를 어떤 관점으로 확인할지만 고릅니다.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {DATA_CHECK_LENSES.map((lens) => {
            const selected = result.judgmentCriteriaSelections.includes(lens.id);
            const disabled = !selected && result.judgmentCriteriaSelections.length >= 2;
            return (
              <button key={lens.id} type="button" disabled={disabled} className={`rounded-2xl border p-4 text-left ${selected ? lens.className : disabled ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-700'}`} onClick={() => toggleLens(lens.id)}>
                <p className="text-sm font-black">{lens.label}</p>
                <p className="mt-2 text-xs font-bold leading-5">{lens.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-indigo-700">Block 3</p>
        <h3 className="text-xl font-black text-slate-950">고객 Data에서 확인할 신호 1~3개 선택</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">모든 고객을 판단하지 않습니다. 이번 2주 동안 먼저 확인할 신호만 고르고, 기회 신호·주의 신호·부족 정보·추가 확인 질문으로 나눕니다.</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {DATA_CHECK_ITEMS.map((item) => {
            const selected = selectedItemIds.includes(item.id);
            const disabled = !selected && selectedItemIds.length >= 3;
            return (
              <article key={item.id} className={`rounded-3xl border p-4 shadow-sm ${selected ? 'border-indigo-300 bg-indigo-50' : 'bg-white'}`}>
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div><p className="text-base font-black text-slate-950">{item.label}</p><p className="mt-2 text-xs font-bold leading-5 text-slate-600">{item.checkTarget}</p></div>
                  <button type="button" disabled={disabled} className={`rounded-full px-4 py-2 text-xs font-black ${selected ? 'bg-indigo-700 text-white' : disabled ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white'}`} onClick={() => toggleDataCheckItem(item.id)}>{selected ? '선택됨' : '확인 신호 선택'}</button>
                </div>
                <div className="mt-4 grid gap-2 md:grid-cols-2">
                  <div className="rounded-2xl bg-emerald-50 p-3 text-xs font-bold leading-5 text-emerald-950"><span className="font-black">기회 신호 기준</span><br />{item.opportunityCriteria}</div>
                  <div className="rounded-2xl bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-950"><span className="font-black">주의 신호 기준</span><br />{item.cautionCriteria}</div>
                  <div className="rounded-2xl bg-slate-50 p-3 text-xs font-bold leading-5 text-slate-700"><span className="font-black">부족 정보</span><br />{item.missingInfo}</div>
                  <div className="rounded-2xl bg-rose-50 p-3 text-xs font-bold leading-5 text-rose-950"><span className="font-black">안전선</span><br />{item.complianceNote}</div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Block 4</p>
        <h3 className="text-xl font-black text-slate-950">AI 고객 Data 확인 List 프롬프트 준비</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">AI에게 판단을 맡기지 않고, 선택한 신호를 고객 Data 확인 List 초안으로 정리하게 합니다. 고객 우선순위와 대응 방향은 7단계에서 정합니다.</p>
        <div className="mt-4 flex flex-wrap gap-2"><button type="button" className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white" onClick={copyPrompt}>{copied ? '프롬프트 복사 완료' : 'AI 확인 List 프롬프트 복사'}</button><button type="button" className="rounded-2xl border bg-white px-4 py-3 text-sm font-black text-slate-700" onClick={resetFlow}>입력 초기화</button></div>
        <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{prompt}</pre>
        <label className="mt-4 block space-y-1"><span className="text-xs font-black text-slate-600">AI 결과 붙여넣기</span><textarea className="min-h-32 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6" value={result.rawAiSignalResult} onChange={(event) => persist({ rawAiSignalResult: event.target.value })} placeholder="AI가 정리한 고객 Data 확인 List 초안을 붙여넣으세요. 아래 항목별 메모는 팀장이 직접 수정해 확정합니다." /></label>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-violet-700">Block 5</p>
        <h3 className="text-xl font-black text-slate-950">최종 고객 Data 확인 List</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">선택한 신호별로 확인할 Data, 기회 신호 기준, 주의 신호 기준, 부족 정보, 추가 확인 질문, 7단계로 넘길 메모, 안전선을 정리합니다.</p>
        <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
          필수 3개만 완료하면 다음 단계로 갈 수 있습니다. 1) 확인 신호 1개 이상 선택 2) 부족 정보 1개 작성 3) 추가 확인 질문 1개 작성
        </div>
        {selectedItems.length === 0 ? (
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">먼저 고객 Data 확인 신호 A~F 중 1~3개를 선택하세요.</div>
        ) : (
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            {selectedItems.map((item) => {
              const current = normalizeV39CustomerDecisionResult(result.decisions[item.id], item.id, item.label);
              return (
                <article key={item.id} className="rounded-3xl border bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between"><div><p className="text-base font-black text-slate-950">{item.label}</p><p className="mt-1 text-xs font-bold leading-5 text-slate-600">{item.likelyData}</p></div><button type="button" className="rounded-full border bg-slate-50 px-4 py-2 text-xs font-black text-slate-700" onClick={() => applyDraft(item)}>확인 List 초안 가져오기</button></div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <label className="space-y-1"><span className="text-xs font-black text-slate-500">확인할 Data 항목</span><textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.reason} onChange={(event) => updateDecision(item.id, { reason: event.target.value })} /></label>
                    <label className="space-y-1"><span className="text-xs font-black text-slate-500">기회 신호 기준</span><textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.opportunitySignal} onChange={(event) => updateDecision(item.id, { opportunitySignal: event.target.value })} /></label>
                    <label className="space-y-1"><span className="text-xs font-black text-slate-500">주의 신호 기준</span><textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.riskSignal} onChange={(event) => updateDecision(item.id, { riskSignal: event.target.value })} /></label>
                    <label className="space-y-1"><span className="text-xs font-black text-slate-500">부족한 정보</span><textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.missingInfo} onChange={(event) => updateDecision(item.id, { missingInfo: event.target.value })} /></label>
                    <label className="space-y-1"><span className="text-xs font-black text-slate-500">팀원에게 더 확인할 질문</span><textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.nextCheck} onChange={(event) => updateDecision(item.id, { nextCheck: event.target.value })} /></label>
                    <label className="space-y-1"><span className="text-xs font-black text-slate-500">표현·자료 안전선</span><textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.complianceNote} onChange={(event) => updateDecision(item.id, { complianceNote: event.target.value })} /></label>
                    <label className="space-y-1 md:col-span-2"><span className="text-xs font-black text-slate-500">7단계로 넘길 대응 준비 메모</span><textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.twoWeekDirection} onChange={(event) => updateDecision(item.id, { twoWeekDirection: event.target.value })} placeholder="예: 이 신호는 관심 고객군으로 바로 판단하지 말고, 자료 확인 여부와 다음 접점 가능성을 먼저 확인한다." /></label>
                    <label className="space-y-1 md:col-span-2"><span className="text-xs font-black text-slate-500">고객 Data 해석 메모</span><textarea className="min-h-28 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.judgmentMemo} onChange={(event) => updateDecision(item.id, { judgmentMemo: event.target.value })} placeholder="예: 이 항목은 후속 행동 완료율을 고객 Data에서 확인하기 위한 기준이다. 기회 신호와 과잉해석 위험을 분리해 7단계 대응 방향으로 넘긴다." /></label>
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
  return <V39CustomerDataJudgmentFlow />;
}
