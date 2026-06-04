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
  '6단계 고객 Data 확인 List',
  '대응 강도',
  '2주 대응 방향',
  '팀원 연결 기준',
  '위험·보완 조건',
].join('|');
void V39_CUSTOMER_TWO_WEEK_DIRECTION_SMOKE_MARKERS;

type CustomerDirectionItem = {
  id: string;
  label: string;
  defaultGuide: string;
  defaultPriority: string;
  defaultMemberRole: string;
};

const CUSTOMER_DIRECTION_ITEMS: CustomerDirectionItem[] = [
  { id: 'A', label: '대응군 A · 반응 변화 고객군', defaultGuide: '고객 질문과 반응의 구체성을 확인한 뒤, 승인자료 범위 안에서 다음 대화 주제를 준비합니다.', defaultPriority: '조건부 실행', defaultMemberRole: '신재영 대리 · 후속 대화 연결' },
  { id: 'B', label: '대응군 B · 다음 접점 가능 고객군', defaultGuide: '다음 접점의 목적과 준비 자료를 정리하고, 과도한 설득 없이 후속 일정을 확인합니다.', defaultPriority: '조건부 실행', defaultMemberRole: '김재호 차장 · 현장 대응 후 기록 정리' },
  { id: 'C', label: '대응군 C · 신규·미접촉 고객군', defaultGuide: '신규 접촉 수보다 접근 경로와 반응 차이를 확인하고, 무리한 확대보다 안전한 첫 접점을 설계합니다.', defaultPriority: '정보 보완 후 실행', defaultMemberRole: '박재욱 사원 · CRM·정보 보완' },
  { id: 'D', label: '대응군 D · 대체 접점 필요 고객군', defaultGuide: '방문이 어려운 고객에게 자료 확인, 비대면 접점, 협업 요청 등 대체 접점이 실제로 작동하는지 확인합니다.', defaultPriority: '정보 보완 후 실행', defaultMemberRole: '유희관 과장 · 변화 신호 관찰' },
  { id: 'E', label: '대응군 E · 제약요인 확인 고객군', defaultGuide: '실행 부진을 환경 탓으로 단정하지 않고, 고객 제약과 팀 실행 제약을 분리해 보완 조건을 정합니다.', defaultPriority: '접근 강도 조절', defaultMemberRole: '김문호 차장 · 접근 강도 조절' },
  { id: 'F', label: '대응군 F · 표현·자료 안전선 고객군', defaultGuide: '관심 신호가 있어도 승인자료 범위와 표현 안전선을 먼저 확인하고, 답변 가능 범위를 좁힙니다.', defaultPriority: '안전선 선확인', defaultMemberRole: '팀장 직접 점검 필요' },
];

const RESPONSE_DIRECTION_OPTIONS = ['조건부 실행', '정보 보완 후 실행', '관찰/유지', '접근 강도 조절', '안전선 선확인', '팀장 직접 확인'];

const MEMBER_ROLE_OPTIONS = [
  '신재영 대리 · 후속 대화 연결',
  '김재호 차장 · 현장 대응 후 기록 정리',
  '박재욱 사원 · CRM·정보 보완',
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
    checkData ? `확인할 Data: ${checkData}` : '',
    opportunity ? `살릴 신호: ${opportunity}` : '',
    risk ? `조심할 신호: ${risk}` : '',
    question ? `다음 확인 질문: ${question}` : '',
  ].filter(Boolean).join('\n') || item.defaultGuide;
}

function defaultDirection(item: CustomerDirectionItem, decision: V39CustomerDecisionResult) {
  if (decision.twoWeekDirection.trim() && !decision.twoWeekDirection.includes('7단계에서')) return decision.twoWeekDirection;
  return buildDirectionGuide(item, decision);
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
  const displayItems = getDisplayItems(sourceResult);
  const checklistCount = displayItems.filter((item) => decisions[item.id]?.reason || decisions[item.id]?.judgmentMemo).length;
  const savedStrategyCount = displayItems.filter((item) => strategies[item.id]?.strategy?.trim()).length;

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

  return (
    <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Customer Two-Week Direction</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">고객군별 2주 대응 방향 정리하기</h2>
          <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-slate-700">
            6단계 고객 Data 확인 List를 바탕으로 이번 2주 동안 어떤 고객군은 조건부로 움직이고, 어떤 고객군은 정보를 보완하며, 어떤 고객군은 안전선을 먼저 확인할지 정리합니다.
            이 단계도 고객을 서열화하지 않고, 대응 방향과 보완 조건을 정하는 화면입니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="rounded-2xl bg-white px-4 py-3 text-xs font-black leading-5 text-emerald-800 shadow-sm">확인 List {checklistCount} / {displayItems.length}</div>
          <div className="rounded-2xl bg-white px-4 py-3 text-xs font-black leading-5 text-emerald-800 shadow-sm">대응 방향 {savedStrategyCount} / {displayItems.length}</div>
          <button type="button" className="rounded-2xl border bg-white px-4 py-3 text-xs font-black text-slate-600 shadow-sm" onClick={refreshCustomerJudgmentBridge}>6단계 확인 List 새로고침</button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <SelectionChips title="6단계 확인 상황" items={sourceResult.customerContextSelections} empty="아직 선택된 상황이 없습니다." />
        <SelectionChips title="6단계 확인 렌즈" items={sourceResult.judgmentCriteriaSelections} empty="아직 선택된 렌즈가 없습니다." />
        <SelectionChips title="7단계 표시 대응군" items={displayItems.map((item) => item.label)} empty="전체 대응군을 표시합니다." />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {displayItems.map((item) => {
          const current = decisions[item.id] ?? normalizeV39CustomerDecisionResult(undefined, item.id, item.label);
          const strategy = strategies[item.id] ?? normalizeV39CustomerStrategyItem(undefined, item.id, item.label);
          const sourceSummary = current.judgmentMemo.trim() || current.reason.trim() || item.defaultGuide;

          return (
            <article key={item.id} className="rounded-2xl border bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-black text-slate-950">{item.label}</p>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-900">{strategy.priority || item.defaultPriority}</span>
              </div>
              <p className="mt-3 text-xs font-black text-emerald-700">6단계 고객 Data 확인 List 요약</p>
              <p className="mt-1 whitespace-pre-wrap text-xs font-bold leading-5 text-slate-700">{sourceSummary}</p>
              <div className="mt-3 grid gap-2 text-xs font-bold leading-5 text-slate-700">
                <div className="rounded-2xl bg-emerald-50 p-3"><span className="font-black text-emerald-900">기회 신호 기준</span><br />{current.opportunitySignal || '6단계에서 기회 신호 기준을 정리하면 표시됩니다.'}</div>
                <div className="rounded-2xl bg-amber-50 p-3"><span className="font-black text-amber-900">주의·보완 조건</span><br />{buildRiskGuide(current) || '주의 신호, 부족 정보, 안전선을 확인합니다.'}</div>
                <div className="rounded-2xl bg-sky-50 p-3"><span className="font-black text-sky-900">추가 확인 질문</span><br />{current.nextCheck || '다음 대화 전에 팀원이 확인할 질문을 정리합니다.'}</div>
              </div>
              <button type="button" className="mt-3 w-full rounded-2xl bg-emerald-700 px-4 py-2 text-xs font-black text-white" onClick={() => applyDirectionDraft(item, current)}>2주 대응 방향 초안 가져오기</button>

              <div className="mt-3 space-y-3">
                <label className="block space-y-1"><span className="text-xs font-black text-slate-500">대응 강도</span><select className="w-full rounded-2xl border px-3 py-2 text-sm font-bold" value={strategy.priority} onChange={(event) => updateStrategy(item.id, { priority: event.target.value })}><option value="">선택하세요</option>{RESPONSE_DIRECTION_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
                <label className="block space-y-1"><span className="text-xs font-black text-slate-500">2주 대응 방향</span><textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={strategy.strategy} onChange={(event) => updateStrategy(item.id, { strategy: event.target.value })} placeholder="예: 고객 질문의 구체성을 확인하고, 승인자료 범위 안에서 다음 접점 주제를 준비한다." /></label>
                <label className="block space-y-1"><span className="text-xs font-black text-slate-500">팀원 연결 기준</span><select className="w-full rounded-2xl border px-3 py-2 text-sm font-bold" value={strategy.memberRole} onChange={(event) => updateStrategy(item.id, { memberRole: event.target.value })}><option value="">선택하세요</option>{MEMBER_ROLE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
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
