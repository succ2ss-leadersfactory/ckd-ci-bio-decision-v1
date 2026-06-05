import { useState } from 'react';
import {
  type V39CustomerDecisionResult,
  type V39CustomerJudgmentResult,
  loadV39CustomerJudgmentResult,
  normalizeV39CustomerDecisionResult,
  normalizeV39CustomerJudgmentResult,
} from './journey-v39-customer-judgment-result-store';
import {
  type V39CustomerStrategyResultItem,
  loadV39CustomerStrategyResult,
  normalizeV39CustomerStrategyItem,
  saveV39CustomerStrategyResult,
} from './journey-v39-customer-strategy-result-store';

const V39_CUSTOMER_TWO_WEEK_DIRECTION_SMOKE_MARKERS = [
  'V39CustomerPriorityLab',
  'V39CustomerJudgmentBridgePanel',
  '고객군별 2주 대응 방향',
  '고객군 × 팀원 2주 실행 Map',
  '6단계 고객 Data 확인 List',
  '대응 강도',
  '2주 대응 방향',
  '팀원 연결 기준',
  '실제 연결 후보',
  '위험·보완 조건',
  '고객 Data 증거 카드',
  'AI로 2주 실행 Map 초안 만들기',
  'AI 2주 실행 Map 프롬프트 복사',
  '정보 보완 고객군',
  '안전선 점검 조건',
  '대응군 C · 신규·미접촉 고객군',
  '대응군 F · 표현·자료 안전선 고객군',
].join('|');
void V39_CUSTOMER_TWO_WEEK_DIRECTION_SMOKE_MARKERS;

type CustomerDirectionItem = {
  id: string;
  label: string;
  kind: 'customerGroup' | 'condition';
  defaultGuide: string;
  defaultPriority: string;
  defaultMemberRole: string;
};

const CUSTOMER_DIRECTION_ITEMS: CustomerDirectionItem[] = [
  {
    id: 'A',
    label: '반응 확인 고객군',
    kind: 'customerGroup',
    defaultGuide: '고객 질문과 반응의 구체성을 확인한 뒤, 승인자료 범위 안에서 다음 대화 주제를 준비합니다.',
    defaultPriority: '조건부 실행',
    defaultMemberRole: '신재영 대리 · 후속 대화 연결',
  },
  {
    id: 'B',
    label: '다음 접점 고객군',
    kind: 'customerGroup',
    defaultGuide: '다음 접점의 목적과 준비 자료를 정리하고, 과도한 설득 없이 후속 일정을 확인합니다.',
    defaultPriority: '조건부 실행',
    defaultMemberRole: '김재호 차장 · 현장 대응 후 기록 정리',
  },
  {
    id: 'C',
    label: '정보 보완 고객군',
    kind: 'customerGroup',
    defaultGuide: '미접촉 이유, 신규 접점 가능성, 접근 경로를 확인하고 무리한 확대보다 정보 보완을 먼저 진행합니다.',
    defaultPriority: '정보 보완 후 실행',
    defaultMemberRole: '박재욱 사원 · 영업활동 기록·정보 보완',
  },
  {
    id: 'D',
    label: '대체 접점 고객군',
    kind: 'customerGroup',
    defaultGuide: '방문이 어려운 고객에게 자료 확인, 비대면 접점, 협업 요청 등 대체 접점이 실제로 작동하는지 확인합니다.',
    defaultPriority: '정보 보완 후 실행',
    defaultMemberRole: '유희관 과장 · 변화 신호 관찰',
  },
  {
    id: 'E',
    label: '제약 해소 고객군',
    kind: 'customerGroup',
    defaultGuide: '실행 부진을 환경 탓으로 단정하지 않고, 고객 제약과 팀 실행 제약을 분리해 보완 조건을 정합니다.',
    defaultPriority: '접근 강도 조절',
    defaultMemberRole: '김문호 차장 · 접근 강도 조절',
  },
  {
    id: 'F',
    label: '안전선 점검 조건',
    kind: 'condition',
    defaultGuide: '관심 신호가 있어도 승인자료 범위와 표현 안전선을 먼저 확인하고, 답변 가능 범위를 좁힙니다.',
    defaultPriority: '안전선 선확인',
    defaultMemberRole: '팀장 직접 점검 필요',
  },
];

const RESPONSE_DIRECTION_OPTIONS = ['조건부 실행', '정보 보완 후 실행', '관찰/유지', '접근 강도 조절', '안전선 선확인', '팀장 직접 확인'];

const MEMBER_ROLE_OPTIONS = [
  '신재영 대리 · 후속 대화 연결',
  '김재호 차장 · 현장 대응 후 기록 정리',
  '박재욱 사원 · 영업활동 기록·정보 보완',
  '유희관 과장 · 변화 신호 관찰',
  '김문호 차장 · 접근 강도 조절',
  '이대은 대리 · 관계 유지 품질 관리',
  '팀장 직접 점검 필요',
];

function loadSourceJudgmentResult(): V39CustomerJudgmentResult {
  if (typeof window === 'undefined') return normalizeV39CustomerJudgmentResult(undefined);
  return normalizeV39CustomerJudgmentResult(loadV39CustomerJudgmentResult());
}

function loadBridgeDecisions(sourceResult: V39CustomerJudgmentResult): Record<string, V39CustomerDecisionResult> {
  const decisions: Record<string, V39CustomerDecisionResult> = {};
  for (const item of CUSTOMER_DIRECTION_ITEMS) {
    decisions[item.id] = normalizeV39CustomerDecisionResult(sourceResult.decisions[item.id], item.id, item.label);
  }
  return decisions;
}

function loadStrategyState(): Record<string, V39CustomerStrategyResultItem> {
  if (typeof window === 'undefined') return {};
  const saved = loadV39CustomerStrategyResult();
  const strategies: Record<string, V39CustomerStrategyResultItem> = {};
  for (const item of CUSTOMER_DIRECTION_ITEMS) {
    strategies[item.id] = normalizeV39CustomerStrategyItem(saved.strategies[item.id], item.id, item.label);
  }
  return strategies;
}

function getDisplayItems(sourceResult: V39CustomerJudgmentResult) {
  return sourceResult.selectedCustomerTypeIds.length > 0
    ? CUSTOMER_DIRECTION_ITEMS.filter((item) => sourceResult.selectedCustomerTypeIds.includes(item.id))
    : CUSTOMER_DIRECTION_ITEMS;
}

function buildRiskGuide(decision: V39CustomerDecisionResult) {
  return [decision.riskSignal, decision.missingInfo, decision.complianceNote].map((item) => item.trim()).filter(Boolean).join('\n');
}

function buildDirectionGuide(item: CustomerDirectionItem, decision: V39CustomerDecisionResult) {
  const checkData = decision.reason.trim();
  const opportunity = decision.opportunitySignal.trim();
  const risk = decision.riskSignal.trim();
  const question = decision.nextCheck.trim();

  return [
    checkData ? `확인할 Data 단서: ${checkData}` : '',
    opportunity ? `기회 단서: ${opportunity}` : '',
    risk ? `주의 단서: ${risk}` : '',
    question ? `팀원 확인 질문: ${question}` : '',
  ].filter(Boolean).join('\n') || item.defaultGuide;
}

function defaultDirection(item: CustomerDirectionItem, decision: V39CustomerDecisionResult) {
  if (decision.twoWeekDirection.trim() && !decision.twoWeekDirection.includes('7단계에서')) return decision.twoWeekDirection;
  return buildDirectionGuide(item, decision);
}

function buildTwoWeekMapPrompt(displayItems: CustomerDirectionItem[], decisions: Record<string, V39CustomerDecisionResult>) {
  return [
    '당신은 제약영업 팀장의 2주 실행 Map 초안 작성을 돕는 AI 사고 파트너입니다.',
    '',
    '[안전선]',
    '- 아래 내용은 교육용 가상 실습입니다.',
    '- 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보를 요구하거나 추정하지 마세요.',
    '- 고객을 점수화하거나 순위표로 세우지 마세요.',
    '- 처방 가능성, 매출 가능성, 고객 등급을 단정하지 마세요.',
    '- 미승인 효능 표현, 비교 우위 단정, 처방 유도 문장, 과도한 설득 문장을 만들지 마세요.',
    '- AI는 정답을 만드는 것이 아니라, 팀장이 수정할 2주 실행 Map 초안을 정리합니다.',
    '',
    '[6단계 고객 Data 증거 카드에서 가져온 단서]',
    ...displayItems.flatMap((item) => {
      const decision = normalizeV39CustomerDecisionResult(decisions[item.id], item.id, item.label);
      return [
        `- 구분: ${item.label}`,
        `  · 유형: ${item.kind === 'condition' ? '고객군이 아니라 점검 조건' : '고객군 후보'}`,
        `  · 확인된 Data 단서: ${decision.reason || item.defaultGuide}`,
        `  · 기회 단서: ${decision.opportunitySignal || '아직 없음'}`,
        `  · 주의 단서·부족 정보·안전선: ${buildRiskGuide(decision) || '아직 없음'}`,
        `  · 팀원에게 더 확인할 질문: ${decision.nextCheck || '아직 없음'}`,
        `  · 7단계로 넘긴 메모: ${decision.twoWeekDirection || '아직 없음'}`,
      ];
    }),
    '',
    '[요청]',
    '위 단서를 바탕으로 고객군별 2주 실행 Map 초안을 작성해 주세요.',
    '각 항목은 다음 형식으로 정리해 주세요.',
    '1. 고객군 후보 또는 점검 조건',
    '2. 확인된 단서',
    '3. 아직 부족한 정보',
    '4. 이번 2주 행동',
    '5. 팀원에게 확인할 질문',
    '6. 표현·자료 안전선',
    '7. 다음 회의에서 확인할 것',
    '',
    '주의: F처럼 표현·자료 안전선은 고객군이 아니라 점검 조건으로 다뤄 주세요. 대응 방향은 확정 명령이 아니라 팀장이 수정할 실행 가설로 써 주세요.',
  ].join('\n');
}

function SelectionChips({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return (
    <div className="rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-700 shadow-sm">
      <p className="font-black text-slate-950">{title}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.length > 0 ? items.map((item) => (
          <span key={item} className="rounded-full bg-emerald-50 px-2.5 py-1 font-black text-emerald-800">{item}</span>
        )) : <span className="text-slate-500">{empty}</span>}
      </div>
    </div>
  );
}

function V39CustomerJudgmentBridgePanel() {
  const [sourceResult, setSourceResult] = useState<V39CustomerJudgmentResult>(loadSourceJudgmentResult);
  const [decisions, setDecisions] = useState<Record<string, V39CustomerDecisionResult>>(() => loadBridgeDecisions(sourceResult));
  const [strategies, setStrategies] = useState<Record<string, V39CustomerStrategyResultItem>>(loadStrategyState);
  const [aiMapPromptCopied, setAiMapPromptCopied] = useState(false);
  const [aiMapDraft, setAiMapDraft] = useState('');
  const displayItems = getDisplayItems(sourceResult);
  const checklistCount = displayItems.filter((item) => decisions[item.id]?.reason || decisions[item.id]?.judgmentMemo).length;
  const savedStrategyCount = displayItems.filter((item) => strategies[item.id]?.strategy?.trim()).length;
  const savedMemberConnectionCount = displayItems.filter((item) => strategies[item.id]?.memberRole?.trim()).length;
  const twoWeekMapPrompt = buildTwoWeekMapPrompt(displayItems, decisions);

  const refreshCustomerJudgmentBridge = () => {
    const nextSource = loadSourceJudgmentResult();
    setSourceResult(nextSource);
    setDecisions(loadBridgeDecisions(nextSource));
  };

  const updateStrategy = (customerTypeId: string, patch: Partial<V39CustomerStrategyResultItem>) => {
    setStrategies((current) => {
      const item = CUSTOMER_DIRECTION_ITEMS.find((bridgeItem) => bridgeItem.id === customerTypeId);
      if (!item) return current;
      const next = {
        ...current,
        [customerTypeId]: {
          ...normalizeV39CustomerStrategyItem(current[customerTypeId], item.id, item.label),
          ...patch,
        },
      };
      saveV39CustomerStrategyResult({ schemaVersion: 1, updatedAt: '', strategies: next });
      return next;
    });
  };

  const applyDirectionDraft = (item: CustomerDirectionItem, decision: V39CustomerDecisionResult) => {
    const riskGuide = buildRiskGuide(decision);
    updateStrategy(item.id, {
      priority: strategies[item.id]?.priority || item.defaultPriority,
      memberRole: strategies[item.id]?.memberRole || item.defaultMemberRole,
      strategy: strategies[item.id]?.strategy || defaultDirection(item, decision),
      risk: strategies[item.id]?.risk || riskGuide || '표현·자료·접촉 강도 안전선을 다시 확인합니다.',
    });
  };

  const copyTwoWeekMapPrompt = () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    void navigator.clipboard.writeText(twoWeekMapPrompt).then(() => {
      setAiMapPromptCopied(true);
      window.setTimeout(() => setAiMapPromptCopied(false), 1600);
    });
  };

  return (
    <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Customer × Member Two-Week Execution Map</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">고객군 × 팀원 2주 실행 Map 만들기</h2>
          <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-slate-700">
            6단계 고객 Data 증거 카드를 바탕으로 고객군 후보와 점검 조건을 구분해 2주 실행 Map을 만듭니다. F처럼 표현·자료 안전선은 고객군이 아니라 점검 조건으로 다루고, 팀원 연결은 8단계에서 보완할 1차 후보 수준으로만 남깁니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="rounded-2xl bg-white px-4 py-3 text-xs font-black leading-5 text-emerald-800 shadow-sm">확인 List {checklistCount} / {displayItems.length}</div>
          <div className="rounded-2xl bg-white px-4 py-3 text-xs font-black leading-5 text-emerald-800 shadow-sm">대응 방향 {savedStrategyCount} / {displayItems.length}</div>
          <div className="rounded-2xl bg-white px-4 py-3 text-xs font-black leading-5 text-emerald-800 shadow-sm">팀원 연결 {savedMemberConnectionCount} / {displayItems.length}</div>
          <button type="button" className="rounded-2xl border bg-white px-4 py-3 text-xs font-black text-slate-600 shadow-sm" onClick={refreshCustomerJudgmentBridge}>6단계 확인 List 새로고침</button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <SelectionChips title="6단계 선택 증거 카드" items={displayItems.map((item) => item.label)} empty="전체 후보와 조건을 표시합니다." />
        <SelectionChips title="고객군 후보" items={displayItems.filter((item) => item.kind === 'customerGroup').map((item) => item.label)} empty="고객군 후보가 아직 없습니다." />
        <SelectionChips title="점검 조건" items={displayItems.filter((item) => item.kind === 'condition').map((item) => item.label)} empty="점검 조건이 아직 없습니다." />
      </div>

      <section className="mt-4 rounded-3xl border border-sky-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-sky-700">AI로 2주 실행 Map 초안 만들기</p>
            <h3 className="mt-1 text-lg font-black text-slate-950">AI가 정답을 정하지 않고, 수정 가능한 초안만 만듭니다</h3>
            <p className="mt-2 max-w-3xl text-xs font-bold leading-5 text-slate-600">
              6단계 단서를 고객군 후보, 점검 조건, 2주 행동, 팀원 확인 질문, 안전선, 다음 회의 확인 포인트로 정리합니다. 고객 우선순위·등급·처방 가능성 판단은 사용하지 않습니다.
            </p>
          </div>
          <button type="button" className="rounded-2xl bg-sky-700 px-4 py-3 text-xs font-black text-white shadow-sm" onClick={copyTwoWeekMapPrompt}>{aiMapPromptCopied ? '프롬프트 복사 완료' : 'AI 2주 실행 Map 프롬프트 복사'}</button>
        </div>
        <pre className="mt-3 max-h-52 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{twoWeekMapPrompt}</pre>
        <label className="mt-3 block space-y-1">
          <span className="text-xs font-black text-slate-500">AI 2주 실행 Map 초안 붙여넣기</span>
          <textarea
            className="min-h-28 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6"
            value={aiMapDraft}
            onChange={(event) => setAiMapDraft(event.target.value)}
            placeholder="AI가 만든 2주 실행 Map 초안을 붙여넣으세요. 아래 카드에서 팀장 언어로 줄여 최종 수정합니다."
          />
        </label>
        <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
          AI 초안은 그대로 확정하지 않습니다. “집중 공략”, “우선순위 상향”, “처방 가능성” 같은 표현은 삭제하거나 “추가 확인 후 7단계에서 판단”으로 바꿉니다.
        </div>
      </section>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {displayItems.map((item) => {
          const current = decisions[item.id] ?? normalizeV39CustomerDecisionResult(undefined, item.id, item.label);
          const strategy = strategies[item.id] ?? normalizeV39CustomerStrategyItem(undefined, item.id, item.label);
          const sourceSummary = current.judgmentMemo.trim() || current.reason.trim() || item.defaultGuide;
          const kindLabel = item.kind === 'condition' ? '점검 조건' : '고객군 후보';

          return (
            <article key={item.id} className="rounded-2xl border bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-black text-slate-950">{item.label}</p>
                  <p className="mt-1 text-xs font-black text-slate-500">{kindLabel}</p>
                </div>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-900">{strategy.priority || item.defaultPriority}</span>
              </div>
              <p className="mt-3 text-xs font-black text-emerald-700">6단계 고객 Data 증거 요약</p>
              <p className="mt-1 whitespace-pre-wrap text-xs font-bold leading-5 text-slate-700">{sourceSummary}</p>
              <div className="mt-3 grid gap-2 text-xs font-bold leading-5 text-slate-700">
                <div className="rounded-2xl bg-emerald-50 p-3"><span className="font-black text-emerald-900">기회 단서</span><br />{current.opportunitySignal || '6단계에서 기회 단서를 정리하면 표시됩니다.'}</div>
                <div className="rounded-2xl bg-amber-50 p-3"><span className="font-black text-amber-900">주의·보완 조건</span><br />{buildRiskGuide(current) || '주의 단서, 부족 정보, 안전선을 확인합니다.'}</div>
                <div className="rounded-2xl bg-sky-50 p-3"><span className="font-black text-sky-900">팀원 확인 질문</span><br />{current.nextCheck || '다음 대화 전에 팀원이 확인할 질문을 정리합니다.'}</div>
              </div>
              <button type="button" className="mt-3 w-full rounded-2xl bg-emerald-700 px-4 py-2 text-xs font-black text-white" onClick={() => applyDirectionDraft(item, current)}>6단계 단서로 실행 Map 초안 가져오기</button>

              <div className="mt-3 space-y-3">
                <label className="block space-y-1"><span className="text-xs font-black text-slate-500">2주 대응 방식</span><select className="w-full rounded-2xl border px-3 py-2 text-sm font-bold" value={strategy.priority} onChange={(event) => updateStrategy(item.id, { priority: event.target.value })}><option value="">선택하세요</option>{RESPONSE_DIRECTION_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
                <label className="block space-y-1"><span className="text-xs font-black text-slate-500">2주 대응 방향</span><textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={strategy.strategy} onChange={(event) => updateStrategy(item.id, { strategy: event.target.value })} placeholder="예: 고객 질문의 구체성을 확인하고, 승인자료 범위 안에서 다음 접점 주제를 준비한다." /></label>
                <label className="block space-y-1"><span className="text-xs font-black text-slate-500">팀원 연결 기준 / 실제 연결 후보</span><select className="w-full rounded-2xl border px-3 py-2 text-sm font-bold" value={strategy.memberRole} onChange={(event) => updateStrategy(item.id, { memberRole: event.target.value })}><option value="">선택하세요</option>{MEMBER_ROLE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
                <label className="block space-y-1"><span className="text-xs font-black text-slate-500">위험·보완 조건</span><textarea className="min-h-20 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={strategy.risk} onChange={(event) => updateStrategy(item.id, { risk: event.target.value })} placeholder="예: 표현 안전선, 부족 정보, 고객 부담 가능성을 먼저 확인한다." /></label>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function V39CustomerPriorityLab() {
  return <V39CustomerJudgmentBridgePanel />;
}
