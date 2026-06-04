import { loadV39CustomerJudgmentResult } from './journey-v39-customer-judgment-result-store';
import { loadV39CustomerStrategyResult } from './journey-v39-customer-strategy-result-store';
import { V39CustomerPriorityLab } from './journey-v39-customer-priority-lab';

const V39_CUSTOMER_PRIORITY_UX_SMOKE_MARKERS = [
  '7단계 진행 가이드',
  '고객군별 2주 대응 방향',
  '6단계 고객 Data 확인 List',
  '대응 강도',
  '팀원 연결 기준',
  '이 단계에서 하는 일',
  '이전 단계에서 가져온 것',
  '다음 단계로 넘길 것',
  '최소 결과물',
].join('|');
void V39_CUSTOMER_PRIORITY_UX_SMOKE_MARKERS;

function getSelectedDataCheckCount() {
  const judgmentResult = loadV39CustomerJudgmentResult();
  return judgmentResult.selectedCustomerTypeIds.length;
}

function getDataCheckMemoCount() {
  const judgmentResult = loadV39CustomerJudgmentResult();
  return Object.values(judgmentResult.decisions).filter((decision) => decision.reason.trim() || decision.judgmentMemo.trim()).length;
}

function getSavedDirectionCount() {
  const strategyResult = loadV39CustomerStrategyResult();
  return Object.values(strategyResult.strategies).filter((strategy) => strategy.strategy.trim()).length;
}

export function V39CustomerPriorityUxLab() {
  const selectedDataCheckCount = getSelectedDataCheckCount();
  const dataCheckMemoCount = getDataCheckMemoCount();
  const savedDirectionCount = getSavedDirectionCount();

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">7단계 진행 가이드 · 고객군별 2주 대응 방향</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">고객 Data 확인 List를 이번 2주 대응 방향으로 바꿉니다</h2>
            <p className="mt-2 max-w-4xl text-sm font-bold leading-6 text-slate-600">6단계에서 만든 확인 List를 바탕으로, 고객군별 대응 강도·2주 대응 방향·팀원 연결 기준·위험 보완 조건을 정리합니다. 고객을 서열화하지 않고, 어디는 움직이고 어디는 더 확인할지 결정합니다.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[34rem]">
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
              <p className="text-xs font-black text-sky-700">6단계 확인 항목</p>
              <p className="mt-1 text-sm font-black text-sky-950">{selectedDataCheckCount || '전체'}개</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">확인 List 메모</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{dataCheckMemoCount}건</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-xs font-black text-violet-700">2주 방향 메모</p>
              <p className="mt-1 text-sm font-black text-violet-950">{savedDirectionCount}건</p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">이 단계에서 하는 일</p>
            <p className="mt-1">확인된 Data를 바탕으로 고객군별 대응 강도, 2주 대응 방향, 보완 조건을 정합니다.</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">이전 단계에서 가져온 것</p>
            <p className="mt-1">6단계 고객 Data 확인 List, 기회 신호 기준, 주의 신호 기준, 부족 정보, 추가 확인 질문입니다.</p>
          </div>
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">다음 단계로 넘길 것</p>
            <p className="mt-1">8단계 팀원별 실행 역할 Map에서 활용할 고객군별 대응 방향과 팀원 연결 기준입니다.</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          <p className="font-black text-slate-950">최소 결과물</p>
          <p className="mt-1">고객군별 2주 대응 방향입니다. 대응 강도, 2주 대응 방향, 팀원 연결 기준, 위험·보완 조건을 남기면 충분합니다.</p>
        </div>

        <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
          고객을 점수화하거나 순위표로 세우는 시간이 아닙니다. 확인된 Data를 근거로 이번 2주 동안 움직일 조건과 보완할 조건을 정리합니다.
        </div>
      </section>

      <V39CustomerPriorityLab />
    </section>
  );
}
