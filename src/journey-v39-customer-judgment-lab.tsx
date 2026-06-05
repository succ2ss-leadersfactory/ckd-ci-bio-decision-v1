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
  '고객 Data 증거 카드',
  '이번 지표를 확인할 고객 Data 증거를 고르세요',
  '확인 신호 A',
  'AI 결과에서 가져올 것',
  '전부 가져오지 마세요',
  '대응 전략은 아직 확정하지 않습니다',
  'AI 결과 1차 분리 정리',
  '붙여넣은 결과에서 아래 항목을 자동으로 찾아 보여줍니다',
].join('|');
void V39_CUSTOMER_DATA_CHECK_SMOKE_MARKERS;

type DataCheckItem = {
  id: string;
  label: string;
  oldLabel: string;
  checkTarget: string;
  likelyData: string;
  opportunityCriteria: string;
  cautionCriteria: string;
  missingInfo: string;
  checkQuestion: string;
  complianceNote: string;
};

type AiExtractionBucket = {
  title: string;
  description: string;
  aliases: string[];
};

const AI_RESULT_EXTRACTION_BUCKETS: AiExtractionBucket[] = [
  {
    title: '무엇을 볼까',
    description: '고객 Data에서 실제로 확인할 항목',
    aliases: ['무엇을 볼까', '확인할 Data', '확인할 데이터', '확인할 항목', '확인해야 할 Data', '확인해야 할 데이터'],
  },
  {
    title: '기회로 볼 수 있는 경우',
    description: '긍정 단서로 볼 수 있는 조건',
    aliases: ['기회로 볼 수 있는 경우', '기회 단서', '긍정 단서', '기회 신호', '긍정 신호'],
  },
  {
    title: '성급하게 해석하면 안 되는 경우',
    description: '과잉해석하거나 단정하면 위험한 부분',
    aliases: ['성급하게 해석하면 안 되는 경우', '주의 단서', '주의 신호', '과잉해석', '단정하면 위험', '조심할 해석'],
  },
  {
    title: '아직 부족한 정보',
    description: '팀장이 판단 전에 더 확인해야 할 정보',
    aliases: ['아직 부족한 정보', '부족한 정보', '추가 확인 필요', '더 확인해야 할 정보', '판단 전에 확인'],
  },
  {
    title: '팀원에게 더 확인할 질문',
    description: '다음 방문·면담 전에 팀원에게 물어볼 문장',
    aliases: ['팀원에게 더 확인할 질문', '팀원에게 물어볼 질문', '추가 확인 질문', '확인 질문', '팀원 질문'],
  },
  {
    title: '표현·자료 안전선',
    description: '승인자료 범위와 위험 표현 점검',
    aliases: ['표현·자료 안전선', '표현 자료 안전선', '안전선', '컴플라이언스', '승인자료', '위험 표현'],
  },
  {
    title: '7단계로 넘길 메모',
    description: '고객군별 대응 방향을 정할 때 참고할 1~2줄',
    aliases: ['7단계로 넘길 메모', '7단계', '대응 준비 메모', '다음 단계 메모', '고객군별 대응 방향'],
  },
];

const DATA_CHECK_ITEMS: DataCheckItem[] = [
  {
    id: 'A',
    label: '고객이 반응했나요?',
    oldLabel: '확인 신호 A · 고객 반응 변화',
    checkTarget: '고객 질문, 자료 요청, 피드백, 방문·면담 메모',
    likelyData: '고객 질문 내용, 자료 요청 여부, 피드백 기록, 대화 후 메모',
    opportunityCriteria: '고객 질문이 구체적이고 다음 논의 주제가 남아 있으면 기회 단서로 봅니다.',
    cautionCriteria: '호의적 반응이나 자료 요청만으로 실행 가능성을 단정하지 않습니다.',
    missingInfo: '고객이 실제로 무엇을 확인하고 싶어 하는지, 질문의 배경이 무엇인지',
    checkQuestion: '고객 질문이 단순 확인이었나요, 다음 논의로 이어질 만한 질문이었나요?',
    complianceNote: '고객 질문에 답할 때 승인자료 범위 밖의 표현을 확장하지 않습니다.',
  },
  {
    id: 'B',
    label: '다음 만남으로 이어질까요?',
    oldLabel: '확인 신호 B · 다음 접점 가능성',
    checkTarget: '다음 약속, 후속 미팅, 응답 속도, 다음 논의 주제',
    likelyData: '후속 미팅 여부, 다음 약속 기록, 응답 속도, 일정 변경 기록',
    opportunityCriteria: '다음 접점이 구체적으로 잡히거나 고객이 확인할 주제를 남기면 기회 단서로 봅니다.',
    cautionCriteria: '“다음에 보자”는 말이나 일정 가능성만으로 고객 의사나 성과 가능성을 단정하지 않습니다.',
    missingInfo: '다음 접점의 목적, 준비 자료, 고객이 기대하는 논의 범위',
    checkQuestion: '다음 접점은 실제 일정으로 잡힌 것인가요, 가능성만 언급된 것인가요?',
    complianceNote: '다음 접점 확보를 위해 과도한 설득이나 압박 표현을 쓰지 않습니다.',
  },
  {
    id: 'C',
    label: '놓친 고객군이 있나요?',
    oldLabel: '확인 신호 C · 신규·미접촉 고객군',
    checkTarget: '미접촉 고객군, 신규 접점, 기존 고객 편중, 접점 공백',
    likelyData: '고객군별 접촉 이력, 신규 접점 수, 미접촉 기간, 접근 경로 기록',
    opportunityCriteria: '미접촉 고객군에서 새로운 질문이나 반응이 확인되면 확인해볼 단서로 봅니다.',
    cautionCriteria: '신규 접촉 수가 늘었다고 해서 활동 품질이나 실행 전환을 판단하지 않습니다.',
    missingInfo: '접근 경로, 고객군별 반응 차이, 왜 미접촉 상태였는지',
    checkQuestion: '이번에 새롭게 접촉한 고객군은 왜 지금까지 비어 있었나요?',
    complianceNote: '신규 고객 접근에서도 실제 고객명·기관명·내부 수치를 입력하지 않습니다.',
  },
  {
    id: 'D',
    label: '방문 외 접점이 작동했나요?',
    oldLabel: '확인 신호 D · 방문 외 대체 접점',
    checkTarget: '자료 전달, 비대면 접점, 전화·메시지 후속 확인, 협업 요청',
    likelyData: '비대면 접점 기록, 자료 전달 후 확인 여부, 협업 요청, 대체 접점 실행 메모',
    opportunityCriteria: '방문이 어렵지만 자료 확인이나 후속 질문이 이어지면 실행 단서로 봅니다.',
    cautionCriteria: '자료 전달 자체를 고객 이해나 실행 가능성으로 해석하지 않습니다.',
    missingInfo: '대체 접점의 목적, 자료 확인 여부, 후속 질문 유무',
    checkQuestion: '자료를 전달한 뒤 고객이 실제로 확인하거나 질문한 내용이 있었나요?',
    complianceNote: '자료 전달 시 승인자료 여부와 전달 목적을 명확히 합니다.',
  },
  {
    id: 'E',
    label: '실행을 막는 제약은 무엇인가요?',
    oldLabel: '확인 신호 E · 방문·대화 제약요인',
    checkTarget: '방문 제한, 일정 변경, 응답 지연, 고객 접근 어려움, 내부 지원 필요',
    likelyData: '방문 제한 사유, 일정 변경 기록, 고객 응답 지연, 내부 지원 요청',
    opportunityCriteria: '제약요인이 구체적으로 확인되면 팀장이 지원할 조건을 설계할 수 있습니다.',
    cautionCriteria: '모든 실행 부진을 고객 탓이나 환경 탓으로 돌리지 않습니다. 팀원의 준비 부족일 수도 있습니다.',
    missingInfo: '실제 제약인지, 준비 부족인지, 팀 지원이 필요한 문제인지',
    checkQuestion: '후속조치가 미뤄진 이유는 고객 제약 때문인가요, 우리 쪽 준비나 실행 제약 때문인가요?',
    complianceNote: '고객 사정을 추정하거나 민감한 내부 상황을 기록하지 않습니다.',
  },
  {
    id: 'F',
    label: '말해도 되는 범위는 어디까지인가요?',
    oldLabel: '확인 신호 F · 표현·자료 사용 안전선',
    checkTarget: '승인자료, 전달 메시지, 고객 질문 범위, 위험 표현, 컴플라이언스 안전선',
    likelyData: '사용 자료, 전달 메시지, 고객 질문 범위, 수정한 표현, 안전선 점검 기록',
    opportunityCriteria: '고객 질문에 대해 승인자료 범위 안에서 안전하게 답변 가능한 경우 실행 단서로 봅니다.',
    cautionCriteria: '고객 관심이 높아 보일수록 미승인 표현이나 과도한 약속 위험이 커질 수 있습니다.',
    missingInfo: '답변 가능한 근거자료, 승인자료 범위, 사용하면 안 되는 표현',
    checkQuestion: '이 고객에게 답변할 때 승인자료 안에서 말할 수 있는 범위는 어디까지인가요?',
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

function cleanAiResultLine(value: string) {
  return value
    .replace(/^#{1,6}\s*/, '')
    .replace(/^[-*•]\s*/, '')
    .replace(/^\d+[.)]\s*/, '')
    .replace(/^\|?\s*/, '')
    .replace(/\*\*/g, '')
    .trim();
}

function lineMatchesBucket(line: string, bucket: AiExtractionBucket) {
  return bucket.aliases.some((alias) => line.includes(alias));
}

function lineMatchesAnyBucket(line: string) {
  return AI_RESULT_EXTRACTION_BUCKETS.some((bucket) => lineMatchesBucket(line, bucket));
}

function extractAiResultBuckets(raw: string) {
  const lines = raw
    .split(/\r?\n/)
    .map(cleanAiResultLine)
    .filter(Boolean);

  return AI_RESULT_EXTRACTION_BUCKETS.map((bucket) => {
    const startIndex = lines.findIndex((line) => lineMatchesBucket(line, bucket));
    const items: string[] = [];

    if (startIndex >= 0) {
      const firstLine = lines[startIndex];
      const afterColon = firstLine.split(/[:：]/).slice(1).join(':').trim();
      if (afterColon) items.push(afterColon);

      for (let index = startIndex + 1; index < lines.length; index += 1) {
        const line = lines[index];
        if (lineMatchesAnyBucket(line)) break;
        if (/^(요청|주의|안전선|결론|종합|예시|표\s*)/i.test(line)) break;
        items.push(line);
        if (items.length >= 4) break;
      }
    }

    return {
      title: bucket.title,
      description: bucket.description,
      items: compactList(items, 4),
    };
  });
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
    '- 답변은 고객 우선순위 결정이 아니라, 팀장이 고객 Data에서 확인해야 할 증거·부족 정보·추가 질문을 분리하는 초안으로 작성하세요.',
    '',
    '[5단계에서 가져온 기준]',
    dashboardBridge.coreMetrics.length > 0 ? dashboardBridge.coreMetrics.map((item) => `- 핵심 실행 지표: ${item}`).join('\n') : '- 핵심 실행 지표: 아직 선택되지 않음',
    dashboardBridge.fieldSignals.length > 0 ? dashboardBridge.fieldSignals.map((item) => `- 함께 볼 현장 신호: ${item}`).join('\n') : '- 함께 볼 현장 신호: 아직 없음',
    dashboardBridge.cautions.length > 0 ? dashboardBridge.cautions.map((item) => `- 조심할 해석: ${item}`).join('\n') : '- 조심할 해석: 아직 없음',
    dashboardBridge.questions.length > 0 ? dashboardBridge.questions.map((item) => `- 팀장이 확인할 질문: ${item}`).join('\n') : '- 팀장이 확인할 질문: 아직 없음',
    dashboardBridge.rationale ? `- 왜 이 지표를 보는가: ${dashboardBridge.rationale}` : '- 왜 이 지표를 보는가: 아직 없음',
    '',
    '[선택한 고객 Data 증거 카드]',
    ...selectedItems.flatMap((item) => {
      const decision = decisions[item.id] ?? normalizeV39CustomerDecisionResult(undefined, item.id, item.label);
      return [
        `- ${item.label}`,
        `  · 무엇을 볼까: ${decision.reason || item.checkTarget}`,
        `  · 기회로 볼 수 있는 경우: ${decision.opportunitySignal || item.opportunityCriteria}`,
        `  · 성급하게 해석하면 안 되는 경우: ${decision.riskSignal || item.cautionCriteria}`,
        `  · 아직 부족한 정보: ${decision.missingInfo || item.missingInfo}`,
        `  · 팀원에게 더 확인할 질문: ${decision.nextCheck || item.checkQuestion}`,
        `  · 7단계로 넘길 메모: ${decision.twoWeekDirection || '아직 작성되지 않았습니다.'}`,
        `  · 표현·자료 안전선: ${decision.complianceNote || item.complianceNote}`,
      ];
    }),
    '',
    '[요청]',
    '선택한 고객 Data 증거 카드별로 고객 Data 확인 List 초안을 작성해 주세요.',
    '1. 무엇을 볼까: 영업활동 기록, 방문·면담 메모, 후속 질문, 자료 요청, 일정 변경, 팀원 확인 등',
    '2. 기회로 볼 수 있는 경우: 어떤 경우를 긍정 단서로 볼 수 있는지',
    '3. 성급하게 해석하면 안 되는 경우: 어떤 경우를 과잉해석하면 안 되는지',
    '4. 아직 부족한 정보: 판단 전에 확인해야 할 정보',
    '5. 팀원에게 더 확인할 질문: 다음 방문·면담 전에 준비할 질문',
    '6. 7단계로 넘길 대응 준비 메모: 고객군별 대응 방향을 정할 때 참고할 1~2줄 메모',
    '7. 표현·자료 안전선: 사용하면 안 되는 표현과 확인해야 할 자료 범위',
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
    twoWeekDirection: '7단계에서 고객군별 대응 방향을 정할 때 이 증거가 기회인지, 추가 확인이 필요한지 먼저 구분합니다.',
    judgmentMemo: `${item.label}: ${item.likelyData}를 확인하고, 기회 단서와 과잉해석 위험을 분리합니다.`,
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
  const extractedAiBuckets = useMemo(() => extractAiResultBuckets(result.rawAiSignalResult), [result.rawAiSignalResult]);
  const hasAiRawResult = result.rawAiSignalResult.trim().length > 0;
  const requiredDoneCount = [
    selectedItemIds.length >= 1,
    selectedItems.some((item) => result.decisions[item.id]?.missingInfo?.trim()),
    selectedItems.some((item) => result.decisions[item.id]?.nextCheck?.trim()),
  ].filter(Boolean).length;
  const prompt = useMemo(
    () => buildDataCheckPrompt(
      selectedItemIds,
      result.decisions,
    ),
    [result.decisions, selectedItemIds],
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

  const toggleDataCheckItem = (id: string) => {
    const exists = selectedItemIds.includes(id);
    const next = exists
      ? selectedItemIds.filter((item) => item !== id)
      : selectedItemIds.length >= 2
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
            <p className="mt-6 max-w-4xl text-base font-bold leading-8 text-slate-600">5단계에서 정한 관리 지표를 고객 Data에서 확인할 증거 카드로 바꿉니다. 고객을 평가하지 않고, 기회 단서·주의 단서·부족 정보·추가 확인 질문을 나눕니다.</p>
            <div className="mt-8 rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-sm font-bold leading-6 text-emerald-950">실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다.</div>
          </div>
          <div className="grid gap-3">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-950">필수 완료 {requiredDoneCount} / 3</div>
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-black text-indigo-950">증거 카드 {selectedItemIds.length} / 2</div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">5단계에서 가져온 기준</p>
        <h3 className="mt-1 text-xl font-black text-slate-950">이번 지표를 확인할 고객 Data 단서</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">아래 내용은 새로 정하는 기준이 아니라, 5단계에서 가져온 관리 지표와 현장 신호입니다. 이번 단계에서는 이를 고객 Data에서 확인할 증거와 질문으로 바꿉니다.</p>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-4"><p className="text-sm font-black text-slate-950">핵심 실행 지표</p><PillList items={dashboardBridge.coreMetrics} emptyText="5단계에서 선택한 지표가 아직 없습니다." /></div>
          <div className="rounded-2xl bg-white p-4"><p className="text-sm font-black text-slate-950">함께 볼 현장 신호</p><PillList items={dashboardBridge.fieldSignals} emptyText="5단계에서 분리한 현장 신호가 아직 없습니다." /></div>
          <div className="rounded-2xl bg-white p-4"><p className="text-sm font-black text-slate-950">조심할 해석</p><PillList items={dashboardBridge.cautions} emptyText="5단계에서 분리한 조심할 해석이 아직 없습니다." /></div>
          <div className="rounded-2xl bg-white p-4"><p className="text-sm font-black text-slate-950">팀장이 확인할 질문</p><PillList items={dashboardBridge.questions} emptyText="5단계에서 남긴 확인 질문이 아직 없습니다." /></div>
        </div>
        <div className="mt-3 rounded-2xl bg-white p-4 text-xs font-bold leading-5 text-slate-700"><p className="font-black text-slate-950">왜 이 지표를 보려는가</p><p className="mt-1">{dashboardBridge.rationale || '5단계에서 지표 선정 이유를 한 문장으로 남기면 이곳에 표시됩니다.'}</p></div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-indigo-700">Block 1</p>
        <h3 className="text-xl font-black text-slate-950">이번 지표를 확인할 고객 Data 증거를 고르세요</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">5단계에서 정한 지표가 실제 현장에서 보이는지 확인할 단서를 고릅니다. 모든 카드를 고르지 않아도 됩니다. 이번 2주에 먼저 확인할 것만 1~2개 선택하세요.</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {DATA_CHECK_ITEMS.map((item) => {
            const selected = selectedItemIds.includes(item.id);
            const disabled = !selected && selectedItemIds.length >= 2;
            return (
              <article key={item.id} className={`rounded-3xl border p-4 shadow-sm ${selected ? 'border-indigo-300 bg-indigo-50' : 'bg-white'}`}>
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div><p className="text-base font-black text-slate-950">{item.label}</p><p className="mt-2 text-xs font-bold leading-5 text-slate-600">무엇을 볼까? {item.checkTarget}</p></div>
                  <button type="button" disabled={disabled} className={`rounded-full px-4 py-2 text-xs font-black ${selected ? 'bg-indigo-700 text-white' : disabled ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white'}`} onClick={() => toggleDataCheckItem(item.id)}>{selected ? '선택됨' : '증거 카드 선택'}</button>
                </div>
                <div className="mt-4 grid gap-2 md:grid-cols-2">
                  <div className="rounded-2xl bg-emerald-50 p-3 text-xs font-bold leading-5 text-emerald-950"><span className="font-black">기회로 볼 수 있는 경우</span><br />{item.opportunityCriteria}</div>
                  <div className="rounded-2xl bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-950"><span className="font-black">성급하게 해석하면 안 되는 경우</span><br />{item.cautionCriteria}</div>
                  <div className="rounded-2xl bg-slate-50 p-3 text-xs font-bold leading-5 text-slate-700"><span className="font-black">아직 부족한 정보</span><br />{item.missingInfo}</div>
                  <div className="rounded-2xl bg-sky-50 p-3 text-xs font-bold leading-5 text-sky-950"><span className="font-black">팀원에게 물어볼 질문</span><br />{item.checkQuestion}</div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Block 2</p>
        <h3 className="text-xl font-black text-slate-950">AI 고객 Data 확인 List 프롬프트 준비</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">AI에게 판단을 맡기지 않고, 선택한 증거 카드를 고객 Data 확인 List 초안으로 정리하게 합니다. 고객 우선순위와 대응 방향은 7단계에서 정합니다.</p>
        <div className="mt-4 flex flex-wrap gap-2"><button type="button" className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white" onClick={copyPrompt}>{copied ? '프롬프트 복사 완료' : 'AI 확인 List 프롬프트 복사'}</button><button type="button" className="rounded-2xl border bg-white px-4 py-3 text-sm font-black text-slate-700" onClick={resetFlow}>입력 초기화</button></div>
        <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{prompt}</pre>
        <label className="mt-4 block space-y-1"><span className="text-xs font-black text-slate-600">AI 결과 붙여넣기</span><textarea className="min-h-32 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6" value={result.rawAiSignalResult} onChange={(event) => persist({ rawAiSignalResult: event.target.value })} placeholder="AI가 정리한 고객 Data 확인 List 초안을 붙여넣으세요. 아래 항목별 메모는 팀장이 직접 수정해 확정합니다." /></label>
        {hasAiRawResult && (
          <div className="mt-4 rounded-3xl border border-violet-100 bg-white p-4">
            <p className="text-xs font-black uppercase tracking-wide text-violet-700">AI 결과 1차 분리 정리</p>
            <h4 className="mt-1 text-base font-black text-slate-950">붙여넣은 결과에서 아래 항목을 자동으로 찾아 보여줍니다</h4>
            <p className="mt-2 text-xs font-bold leading-5 text-slate-600">자동 분리는 참고용입니다. AI 표현을 그대로 확정하지 말고, 아래 Block 3에서 팀장 언어로 줄여 적으세요.</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {extractedAiBuckets.map((bucket) => (
                <div key={bucket.title} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
                  <p className="font-black text-slate-950">{bucket.title}</p>
                  <p className="mt-1 text-slate-500">{bucket.description}</p>
                  <div className="mt-2 space-y-1">
                    {bucket.items.length > 0 ? bucket.items.map((item) => <p key={item} className="rounded-xl bg-white px-3 py-2">{item}</p>) : <p className="rounded-xl border border-dashed border-slate-200 bg-white px-3 py-2 text-slate-400">AI 결과에서 해당 항목을 명확히 찾지 못했습니다. 필요한 문장을 직접 골라 Block 3에 정리하세요.</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mt-4 rounded-3xl border border-emerald-100 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700">AI 결과에서 가져올 것</p>
          <h4 className="mt-1 text-base font-black text-slate-950">전부 가져오지 마세요. 최종 List에는 필요한 것만 골라 옮깁니다.</h4>
          <p className="mt-2 text-xs font-bold leading-5 text-slate-600">AI 결과는 정답이 아니라 초안입니다. 긴 설명, 고객 우선순위 판단, 대응 전략 확정 문장은 그대로 쓰지 않습니다.</p>
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            {[
              ['무엇을 볼까', '고객 Data에서 실제로 확인할 항목'],
              ['기회로 볼 수 있는 경우', '긍정 단서로 볼 수 있는 조건'],
              ['성급하게 해석하면 안 되는 경우', '과잉해석하거나 단정하면 위험한 부분'],
              ['아직 부족한 정보', '팀장이 판단 전에 더 확인해야 할 정보'],
              ['팀원에게 더 확인할 질문', '다음 방문·면담 전에 팀원에게 물어볼 문장'],
              ['표현·자료 안전선', '승인자료 범위와 위험 표현 점검'],
              ['7단계로 넘길 메모', '고객군별 대응 방향을 정할 때 참고할 1~2줄'],
              ['버릴 내용', '고객 등급화, 대응 전략 확정, 실제 고객·제품 정보 추정'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
                <p className="font-black text-slate-950">{title}</p>
                <p className="mt-1">{description}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
            대응 전략은 아직 확정하지 않습니다. AI가 “집중 공략”, “우선순위 상향”처럼 답해도 6단계에서는 “추가 확인 후 7단계에서 판단”으로 바꿔 적습니다.
          </div>
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-violet-700">Block 3</p>
        <h3 className="text-xl font-black text-slate-950">최종 고객 Data 확인 List</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">선택한 증거 카드별로 확인할 Data, 기회 단서, 주의 단서, 부족 정보, 팀원 질문, 7단계로 넘길 메모, 안전선을 정리합니다.</p>
        <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
          필수 3개만 완료하면 다음 단계로 갈 수 있습니다. 1) 증거 카드 1개 이상 선택 2) 부족 정보 1개 작성 3) 추가 확인 질문 1개 작성
        </div>
        {selectedItems.length === 0 ? (
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">먼저 고객 Data 증거 카드 중 1~2개를 선택하세요.</div>
        ) : (
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            {selectedItems.map((item) => {
              const current = normalizeV39CustomerDecisionResult(result.decisions[item.id], item.id, item.label);
              return (
                <article key={item.id} className="rounded-3xl border bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between"><div><p className="text-base font-black text-slate-950">{item.label}</p><p className="mt-1 text-xs font-bold leading-5 text-slate-600">{item.likelyData}</p></div><button type="button" className="rounded-full border bg-slate-50 px-4 py-2 text-xs font-black text-slate-700" onClick={() => applyDraft(item)}>확인 List 초안 가져오기</button></div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <label className="space-y-1"><span className="text-xs font-black text-slate-500">무엇을 볼까</span><textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.reason} onChange={(event) => updateDecision(item.id, { reason: event.target.value })} /></label>
                    <label className="space-y-1"><span className="text-xs font-black text-slate-500">기회로 볼 수 있는 경우</span><textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.opportunitySignal} onChange={(event) => updateDecision(item.id, { opportunitySignal: event.target.value })} /></label>
                    <label className="space-y-1"><span className="text-xs font-black text-slate-500">성급하게 해석하면 안 되는 경우</span><textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.riskSignal} onChange={(event) => updateDecision(item.id, { riskSignal: event.target.value })} /></label>
                    <label className="space-y-1"><span className="text-xs font-black text-slate-500">아직 부족한 정보</span><textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.missingInfo} onChange={(event) => updateDecision(item.id, { missingInfo: event.target.value })} /></label>
                    <label className="space-y-1"><span className="text-xs font-black text-slate-500">팀원에게 더 확인할 질문</span><textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.nextCheck} onChange={(event) => updateDecision(item.id, { nextCheck: event.target.value })} /></label>
                    <label className="space-y-1"><span className="text-xs font-black text-slate-500">표현·자료 안전선</span><textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.complianceNote} onChange={(event) => updateDecision(item.id, { complianceNote: event.target.value })} /></label>
                    <label className="space-y-1 md:col-span-2"><span className="text-xs font-black text-slate-500">7단계로 넘길 대응 준비 메모</span><textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.twoWeekDirection} onChange={(event) => updateDecision(item.id, { twoWeekDirection: event.target.value })} placeholder="예: 이 단서는 관심 고객군으로 바로 판단하지 말고, 자료 확인 여부와 다음 접점 가능성을 먼저 확인한다." /></label>
                    <label className="space-y-1 md:col-span-2"><span className="text-xs font-black text-slate-500">고객 Data 해석 메모</span><textarea className="min-h-28 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.judgmentMemo} onChange={(event) => updateDecision(item.id, { judgmentMemo: event.target.value })} placeholder="예: 이 항목은 후속 행동 완료율을 고객 Data에서 확인하기 위한 단서다. 기회 단서와 과잉해석 위험을 분리해 7단계 대응 방향으로 넘긴다." /></label>
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
