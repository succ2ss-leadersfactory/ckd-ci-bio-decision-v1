import { loadV39CustomerJudgmentResult } from './journey-v39-customer-judgment-result-store';
import { loadV39CustomerStrategyResult } from './journey-v39-customer-strategy-result-store';
import { V39CustomerPriorityLab } from './journey-v39-customer-priority-lab';

function getSelectedCustomerCount() {
  const judgmentResult = loadV39CustomerJudgmentResult();
  return judgmentResult.selectedCustomerTypeIds.length;
}

function getJudgmentDecisionCount() {
  const judgmentResult = loadV39CustomerJudgmentResult();
  return Object.values(judgmentResult.decisions).filter((decision) => decision.priorityDecision || decision.judgmentMemo.trim()).length;
}

function getSavedStrategyCount() {
  const strategyResult = loadV39CustomerStrategyResult();
  return Object.values(strategyResult.strategies).filter((strategy) => strategy.strategy.trim()).length;
}

export function V39CustomerPriorityUxLab() {
  const selectedCustomerCount = getSelectedCustomerCount();
  const judgmentDecisionCount = getJudgmentDecisionCount();
  const savedStrategyCount = getSavedStrategyCount();

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">7단계 진행 가이드</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">고객 판단을 2주 대응 전략으로 바꿉니다</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[34rem]">
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
              <p className="text-xs font-black text-sky-700">선택 고객 유형</p>
              <p className="mt-1 text-sm font-black text-sky-950">{selectedCustomerCount || '전체'}개</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">6단계 판단</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{judgmentDecisionCount}개</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-xs font-black text-violet-700">7단계 저장 상태</p>
              <p className="mt-1 text-sm font-black text-violet-950">{savedStrategyCount}개 전략</p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">이 단계에서 하는 일</p>
            <p className="mt-1">고객별 판단을 대응 강도, 2주 전략, 팀원 배정 방향으로 정리합니다.</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">이전 단계에서 가져온 것</p>
            <p className="mt-1">6단계 고객 Data 판단 결과와 판단 유보 정보입니다.</p>
          </div>
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">다음 단계로 넘길 것</p>
            <p className="mt-1">8단계 팀원별 역할 방향에 반영할 고객 대응 전략입니다.</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          최소 결과물: 고객별 대응 강도, 2주 대응 전략, 팀원 배정 방향, 주의 리스크. 고객을 등급화하는 것이 아니라 2주 안에 실행 가능한 대응 방향을 정하는 단계입니다.
        </div>
      </section>

      <V39CustomerPriorityLab />
    </section>
  );
}
