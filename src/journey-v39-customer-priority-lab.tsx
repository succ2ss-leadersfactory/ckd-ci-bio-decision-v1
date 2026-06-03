import { useState } from 'react';
import {
  type V39CustomerDecisionResult,
  type V39CustomerJudgmentResult,
  type V39CustomerPriorityDecision,
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

type CustomerBridgeItem = {
  id: string;
  label: string;
  defaultGuide: string;
};

const CUSTOMER_BRIDGE_ITEMS: CustomerBridgeItem[] = [
  { id: 'A', label: '고객 유형 A', defaultGuide: '후속 대화 가능성은 살리되, 표현과 자료 활용 안전선을 먼저 확인합니다.' },
  { id: 'B', label: '고객 유형 B', defaultGuide: '관심 신호를 과잉해석하지 말고 보류 이유와 니즈를 먼저 확인합니다.' },
  { id: 'C', label: '고객 유형 C', defaultGuide: '관계 유지 품질을 관리하면서 변화 신호를 관찰합니다.' },
  { id: 'D', label: '고객 유형 D', defaultGuide: '접촉 강도를 낮추고 고객 부담, 메시지, 기록 리스크를 먼저 정비합니다.' },
  { id: 'E', label: '고객 유형 E', defaultGuide: '기회 신호는 크지만 승인 자료 범위와 표현 안전선 확인을 선행합니다.' },
  { id: 'F', label: '고객 유형 F', defaultGuide: '전략 단정보다 최근 반응, 접촉 공백, CRM 기록 보완을 먼저 설계합니다.' },
];

const PRIORITY_BADGE_CLASS: Record<V39CustomerPriorityDecision, string> = {
  focus: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  maintain: 'border-cyan-200 bg-cyan-50 text-cyan-900',
  defer: 'border-amber-200 bg-amber-50 text-amber-900',
  supplement: 'border-slate-200 bg-slate-50 text-slate-800',
};

const STRATEGY_PRIORITY_OPTIONS = ['적극 집중', '조건부 집중', '속도 조절', '관찰/유지', '정보 보완', '접근 강도 축소'];

const MEMBER_ROLE_OPTIONS = [
  '신재영 대리 · 후속 대화 연결',
  '이대은 대리 · 관계 유지 품질 관리',
  '박재욱 사원 · CRM·정보 보완',
  '유희관 과장 · 변화 신호 관찰',
  '김문호 차장 · 접근 강도 조절',
  '김재호 차장 · 현장 대응 후 기록 정리',
  '팀장 직접 점검 필요',
];

function getPriorityLabel(priorityDecision: V39CustomerPriorityDecision | '') {
  if (priorityDecision === 'focus') return '집중';
  if (priorityDecision === 'maintain') return '유지';
  if (priorityDecision === 'defer') return '보류';
  if (priorityDecision === 'supplement') return '정보 보완';
  return '미선택';
}

function getStrategyGuide(decision: V39CustomerDecisionResult, fallbackGuide: string) {
  if (decision.twoWeekDirection.trim()) return decision.twoWeekDirection;
  if (decision.judgmentMemo.trim()) return decision.judgmentMemo;
  if (decision.priorityDecision === 'focus') return '2주 안에 대응 전략을 구체화하되, 자료·표현·접촉 안전선을 먼저 확인합니다.';
  if (decision.priorityDecision === 'maintain') return '관계 유지 품질과 반응 변화 관찰 기준을 세우고 과도한 설득을 피합니다.';
  if (decision.priorityDecision === 'defer') return '접근 강도와 타이밍을 낮추고 고객 부담·리스크를 먼저 관리합니다.';
  if (decision.priorityDecision === 'supplement') return '우선순위 결정보다 부족한 정보와 확인 질문, CRM 기록 보완을 먼저 설계합니다.';
  return fallbackGuide;
}

function buildRiskGuide(decision: V39CustomerDecisionResult) {
  return [decision.riskSignal, decision.complianceNote].map((item) => item.trim()).filter(Boolean).join('\n');
}

function defaultStrategyPriority(decision: V39CustomerDecisionResult) {
  if (decision.priorityDecision === 'focus') return '조건부 집중';
  if (decision.priorityDecision === 'maintain') return '관찰/유지';
  if (decision.priorityDecision === 'defer') return '접근 강도 축소';
  if (decision.priorityDecision === 'supplement') return '정보 보완';
  return '';
}

function defaultMemberRole(decision: V39CustomerDecisionResult) {
  if (decision.priorityDecision === 'focus') return '신재영 대리 · 후속 대화 연결';
  if (decision.priorityDecision === 'maintain') return '이대은 대리 · 관계 유지 품질 관리';
  if (decision.priorityDecision === 'defer') return '김문호 차장 · 접근 강도 조절';
  if (decision.priorityDecision === 'supplement') return '박재욱 사원 · CRM·정보 보완';
  return '';
}

function loadSourceJudgmentResult(): V39CustomerJudgmentResult {
  if (typeof window === 'undefined') return normalizeV39CustomerJudgmentResult(undefined);
  return normalizeV39CustomerJudgmentResult(loadV39CustomerJudgmentResult());
}

function loadBridgeDecisions(sourceResult: V39CustomerJudgmentResult): Record<string, V39CustomerDecisionResult> {
  const decisions: Record<string, V39CustomerDecisionResult> = {};

  for (const item of CUSTOMER_BRIDGE_ITEMS) {
    decisions[item.id] = normalizeV39CustomerDecisionResult(sourceResult.decisions[item.id], item.id, item.label);
  }

  return decisions;
}

function loadStrategyState(): Record<string, V39CustomerStrategyResultItem> {
  if (typeof window === 'undefined') return {};

  const saved = loadV39CustomerStrategyResult();
  const strategies: Record<string, V39CustomerStrategyResultItem> = {};

  for (const item of CUSTOMER_BRIDGE_ITEMS) {
    strategies[item.id] = normalizeV39CustomerStrategyItem(saved.strategies[item.id], item.id, item.label);
  }

  return strategies;
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
  const displayItems = sourceResult.selectedCustomerTypeIds.length > 0
    ? CUSTOMER_BRIDGE_ITEMS.filter((item) => sourceResult.selectedCustomerTypeIds.includes(item.id))
    : CUSTOMER_BRIDGE_ITEMS;
  const selectedCount = displayItems.filter((item) => decisions[item.id]?.priorityDecision).length;
  const savedStrategyCount = displayItems.filter((item) => strategies[item.id]?.strategy?.trim()).length;

  const refreshCustomerJudgmentBridge = () => {
    const nextSource = loadSourceJudgmentResult();
    setSourceResult(nextSource);
    setDecisions(loadBridgeDecisions(nextSource));
  };

  const updateStrategy = (customerTypeId: string, patch: Partial<V39CustomerStrategyResultItem>) => {
    setStrategies((current) => {
      const item = CUSTOMER_BRIDGE_ITEMS.find((bridgeItem) => bridgeItem.id === customerTypeId);
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

  const applyStrategyDraft = (item: CustomerBridgeItem, decision: V39CustomerDecisionResult) => {
    const riskGuide = buildRiskGuide(decision);
    updateStrategy(item.id, {
      priority: strategies[item.id]?.priority || defaultStrategyPriority(decision),
      memberRole: strategies[item.id]?.memberRole || defaultMemberRole(decision),
      strategy: strategies[item.id]?.strategy || getStrategyGuide(decision, item.defaultGuide),
      risk: strategies[item.id]?.risk || riskGuide || '표현·자료·접촉 강도 안전선을 다시 확인합니다.',
    });
  };

  return (
    <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Customer Strategy Review</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">고객 판단을 대응 전략으로 정리하기</h2>
          <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-slate-700">
            이전 단계에서 정리한 고객별 기회 신호, 착시·리스크 신호, 부족한 정보, 2주 판단 메모를 바탕으로 대응 강도와 팀원 배정 방향을 정리합니다.
            이 요약은 자동 결정이 아니라 팀장이 현장 맥락에 맞게 다시 검토하기 위한 참고 자료입니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="rounded-2xl bg-white px-4 py-3 text-xs font-black leading-5 text-emerald-800 shadow-sm">
            판단 정리 {selectedCount} / {displayItems.length}
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-xs font-black leading-5 text-emerald-800 shadow-sm">
            전략 작성 {savedStrategyCount} / {displayItems.length}
          </div>
          <button type="button" className="rounded-2xl border bg-white px-4 py-3 text-xs font-black text-slate-600 shadow-sm" onClick={refreshCustomerJudgmentBridge}>
            이전 판단 새로고침
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <SelectionChips title="6단계 고객 Data 상황" items={sourceResult.customerContextSelections} empty="아직 선택된 상황이 없습니다." />
        <SelectionChips title="6단계 판단 기준" items={sourceResult.judgmentCriteriaSelections} empty="아직 선택된 판단 기준이 없습니다." />
        <SelectionChips title="7단계 표시 고객" items={displayItems.map((item) => item.label)} empty="전체 고객 유형을 표시합니다." />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {displayItems.map((item) => {
          const current = decisions[item.id] ?? normalizeV39CustomerDecisionResult(undefined, item.id, item.label);
          const strategy = strategies[item.id] ?? normalizeV39CustomerStrategyItem(undefined, item.id, item.label);
          const badgeClass = current.priorityDecision ? PRIORITY_BADGE_CLASS[current.priorityDecision] : 'border-slate-200 bg-white text-slate-500';

          return (
            <article key={item.id} className="rounded-2xl border bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-black text-slate-950">{item.label}</p>
                <span className={`rounded-full border px-3 py-1 text-xs font-black ${badgeClass}`}>
                  {getPriorityLabel(current.priorityDecision)}
                </span>
              </div>
              <p className="mt-3 text-xs font-black text-emerald-700">전략 작성 방향</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-700">{getStrategyGuide(current, item.defaultGuide)}</p>
              <div className="mt-3 grid gap-2 text-xs font-bold leading-5 text-slate-700">
                <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-950"><span className="font-black">기회 신호: </span>{current.opportunitySignal || '6단계에서 기회 신호를 정리하지 않았습니다.'}</div>
                <div className="rounded-2xl bg-amber-50 p-3 text-amber-950"><span className="font-black">착시·리스크 신호: </span>{current.riskSignal || '6단계에서 리스크 신호를 정리하지 않았습니다.'}</div>
                <div className="rounded-2xl bg-slate-50 p-3"><span className="font-black text-slate-950">부족한 정보: </span>{current.missingInfo || '추가 확인 정보가 아직 정리되지 않았습니다.'}</div>
                <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-950"><span className="font-black">2주 판단 메모: </span>{current.judgmentMemo || current.reason || '이전 단계의 2주 판단 메모가 아직 저장되지 않았습니다.'}</div>
                <div className="rounded-2xl bg-rose-50 p-3 text-rose-950"><span className="font-black">안전선 메모: </span>{current.complianceNote || '표현·자료·접촉 강도 안전선을 다시 확인하세요.'}</div>
              </div>

              <div className="mt-4 grid gap-3">
                <label className="space-y-1">
                  <span className="text-xs font-black text-slate-500">고객 대응 우선순위</span>
                  <select className="min-h-11 w-full rounded-2xl border bg-white px-3 py-2 text-sm font-bold" value={strategy.priority} onChange={(event) => updateStrategy(item.id, { priority: event.target.value })}>
                    <option value="">선택하세요</option>
                    {STRATEGY_PRIORITY_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-black text-slate-500">팀원 배정 방향</span>
                  <select className="min-h-11 w-full rounded-2xl border bg-white px-3 py-2 text-sm font-bold" value={strategy.memberRole} onChange={(event) => updateStrategy(item.id, { memberRole: event.target.value })}>
                    <option value="">선택하세요</option>
                    {MEMBER_ROLE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-black text-slate-500">2주 대응 전략</span>
                  <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={strategy.strategy} onChange={(event) => updateStrategy(item.id, { strategy: event.target.value })} placeholder="예: 후속 대화 가능성을 살리되, 자료·표현 안전선을 먼저 확인한다." />
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-black text-slate-500">주의 리스크</span>
                  <textarea className="min-h-20 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={strategy.risk} onChange={(event) => updateStrategy(item.id, { risk: event.target.value })} placeholder="예: 고객 부담, 과잉 접촉, 컴플라이언스 표현 리스크." />
                </label>
                <button type="button" className="rounded-2xl border bg-slate-50 px-4 py-2 text-xs font-black text-slate-700" onClick={() => applyStrategyDraft(item, current)}>
                  6단계 판단으로 전략 초안 채우기
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-950">
        7단계에서도 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다.
        고객 유형별 대응 전략은 교육용 가상 Data를 바탕으로 작성합니다.
      </div>
    </section>
  );
}

export function V39CustomerPriorityLab() {
  return <V39CustomerJudgmentBridgePanel />;
}
