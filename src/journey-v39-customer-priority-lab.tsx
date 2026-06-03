import { useState } from 'react';
import { V38CustomerPriorityLab } from './journey-v38-customer-priority-lab';
import {
  type V39CustomerDecisionResult,
  type V39CustomerPriorityDecision,
  loadV39CustomerJudgmentResult,
  normalizeV39CustomerDecisionResult,
} from './journey-v39-customer-judgment-result-store';

type CustomerBridgeItem = {
  id: string;
  label: string;
  defaultGuide: string;
};

const CUSTOMER_BRIDGE_ITEMS: CustomerBridgeItem[] = [
  {
    id: 'A',
    label: '고객 유형 A',
    defaultGuide: '후속 대화 가능성은 살리되, 표현과 자료 활용 안전선을 먼저 확인합니다.',
  },
  {
    id: 'B',
    label: '고객 유형 B',
    defaultGuide: '관심 신호를 과잉해석하지 말고 보류 이유와 니즈를 먼저 확인합니다.',
  },
  {
    id: 'C',
    label: '고객 유형 C',
    defaultGuide: '관계 유지 품질을 관리하면서 변화 신호를 관찰합니다.',
  },
  {
    id: 'D',
    label: '고객 유형 D',
    defaultGuide: '접촉 강도를 낮추고 고객 부담, 메시지, 기록 리스크를 먼저 정비합니다.',
  },
  {
    id: 'E',
    label: '고객 유형 E',
    defaultGuide: '기회 신호는 크지만 승인 자료 범위와 표현 안전선 확인을 선행합니다.',
  },
  {
    id: 'F',
    label: '고객 유형 F',
    defaultGuide: '전략 단정보다 최근 반응, 접촉 공백, CRM 기록 보완을 먼저 설계합니다.',
  },
];

const PRIORITY_BADGE_CLASS: Record<V39CustomerPriorityDecision, string> = {
  focus: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  maintain: 'border-cyan-200 bg-cyan-50 text-cyan-900',
  defer: 'border-amber-200 bg-amber-50 text-amber-900',
  supplement: 'border-slate-200 bg-slate-50 text-slate-800',
};

function getPriorityLabel(priorityDecision: V39CustomerPriorityDecision | '') {
  if (priorityDecision === 'focus') return '집중';
  if (priorityDecision === 'maintain') return '유지';
  if (priorityDecision === 'defer') return '보류';
  if (priorityDecision === 'supplement') return '정보 보완';
  return '미선택';
}

function getStrategyGuide(decision: V39CustomerDecisionResult, fallbackGuide: string) {
  if (decision.priorityDecision === 'focus') return '2주 안에 대응 전략을 구체화하되, 자료·표현·접촉 안전선을 먼저 확인합니다.';
  if (decision.priorityDecision === 'maintain') return '관계 유지 품질과 반응 변화 관찰 기준을 세우고 과도한 설득을 피합니다.';
  if (decision.priorityDecision === 'defer') return '접근 강도와 타이밍을 낮추고 고객 부담·리스크를 먼저 관리합니다.';
  if (decision.priorityDecision === 'supplement') return '우선순위 결정보다 부족한 정보와 확인 질문, CRM 기록 보완을 먼저 설계합니다.';
  return fallbackGuide;
}

function loadBridgeDecisions(): Record<string, V39CustomerDecisionResult> {
  if (typeof window === 'undefined') return {};

  const saved = loadV39CustomerJudgmentResult();
  const decisions: Record<string, V39CustomerDecisionResult> = {};

  for (const item of CUSTOMER_BRIDGE_ITEMS) {
    decisions[item.id] = normalizeV39CustomerDecisionResult(saved.decisions[item.id], item.id, item.label);
  }

  return decisions;
}

function V39CustomerJudgmentBridgePanel() {
  const [decisions, setDecisions] = useState<Record<string, V39CustomerDecisionResult>>(loadBridgeDecisions);
  const selectedCount = CUSTOMER_BRIDGE_ITEMS.filter((item) => decisions[item.id]?.priorityDecision).length;

  const refreshCustomerJudgmentBridge = () => {
    setDecisions(loadBridgeDecisions());
  };

  return (
    <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Customer Judgment Bridge</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">6단계 고객 판단 결과 연결</h2>
          <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-slate-700">
            6단계에서 남긴 고객별 우선순위 판단을 7단계 대응 전략 설계의 출발점으로 가져옵니다. 이 요약은 자동 결정이 아니라,
            팀장이 전략 강도와 안전선을 다시 검토하기 위한 참고 자료입니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="rounded-2xl bg-white px-4 py-3 text-xs font-black leading-5 text-emerald-800 shadow-sm">
            연결된 판단 {selectedCount} / {CUSTOMER_BRIDGE_ITEMS.length}
          </div>
          <button type="button" className="rounded-2xl border bg-white px-4 py-3 text-xs font-black text-slate-600 shadow-sm" onClick={refreshCustomerJudgmentBridge}>
            6단계 판단 새로고침
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {CUSTOMER_BRIDGE_ITEMS.map((item) => {
          const current = decisions[item.id] ?? normalizeV39CustomerDecisionResult(undefined, item.id, item.label);
          const badgeClass = current.priorityDecision ? PRIORITY_BADGE_CLASS[current.priorityDecision] : 'border-slate-200 bg-white text-slate-500';

          return (
            <article key={item.id} className="rounded-2xl border bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-black text-slate-950">{item.label}</p>
                <span className={`rounded-full border px-3 py-1 text-xs font-black ${badgeClass}`}>
                  {getPriorityLabel(current.priorityDecision)}
                </span>
              </div>
              <p className="mt-3 text-xs font-black text-emerald-700">7단계 전략 작성 방향</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-700">{getStrategyGuide(current, item.defaultGuide)}</p>
              <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-xs font-bold leading-5 text-slate-700">
                <p><span className="font-black text-slate-950">판단 이유: </span>{current.reason || '6단계 판단 이유가 아직 저장되지 않았습니다.'}</p>
                <p className="mt-2"><span className="font-black text-slate-950">다음 확인 질문: </span>{current.nextCheck || '추가 확인 질문을 7단계에서 보완하세요.'}</p>
                <p className="mt-2"><span className="font-black text-slate-950">안전선 메모: </span>{current.complianceNote || '표현·자료·접촉 강도 안전선을 다시 확인하세요.'}</p>
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
  return (
    <section className="space-y-4">
      <V39CustomerJudgmentBridgePanel />
      <V38CustomerPriorityLab />
    </section>
  );
}
