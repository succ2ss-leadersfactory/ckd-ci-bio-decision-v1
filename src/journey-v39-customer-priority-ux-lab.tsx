import { loadV39CustomerJudgmentResult } from './journey-v39-customer-judgment-result-store';
import { loadV39CustomerStrategyResult } from './journey-v39-customer-strategy-result-store';
import { V39CustomerPriorityLab } from './journey-v39-customer-priority-lab';

const V39_CUSTOMER_PRIORITY_UX_SMOKE_MARKERS = [
  '7단계 진행 가이드',
  '고객 판단을 2주 대응 전략으로 바꿉니다',
  '이 단계에서 하는 일',
  '이전 단계에서 가져온 것',
  '다음 단계로 넘길 것',
  '최소 결과물',
].join('|');
void V39_CUSTOMER_PRIORITY_UX_SMOKE_MARKERS;

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
            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">7단계 · 이번 2주 고객 대응 잡기</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">고객별 판단을 이번 2주 안에 움직일 수 있는 대응안으로 좁힙니다</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[34rem]">
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
              <p className="text-xs font-black text-sky-700">먼저 볼 고객군</p>
              <p className="mt-1 text-sm font-black text-sky-950">{selectedCustomerCount || '전체'}개</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">앞 단계 판단 메모</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{judgmentDecisionCount}건</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-xs font-black text-violet-700">이번 단계 전략 메모</p>
              <p className="mt-1 text-sm font-black text-violet-950">{savedStrategyCount}건</p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">지금 정할 것</p>
            <p className="mt-1">고객별로 어디까지 밀고 갈지, 이번 2주 동안 어떤 대응을 할지, 누구에게 맡길지를 정합니다.</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">앞에서 확인한 내용</p>
            <p className="mt-1">6단계에서 남긴 고객 반응, 아직 모르는 정보, 조심해야 할 해석입니다.</p>
          </div>
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">다음 화면에서 이어 쓸 내용</p>
            <p className="mt-1">8단계에서 팀원 역할을 나눌 때 기준이 될 고객 대응안입니다.</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          고객을 서열화하는 시간이 아닙니다. 이번 2주 동안 팀이 어디에 힘을 싣고, 어디는 더 확인한 뒤 움직일지 정리하면 충분합니다.
        </div>
      </section>

      <V39CustomerPriorityLab />
    </section>
  );
}
