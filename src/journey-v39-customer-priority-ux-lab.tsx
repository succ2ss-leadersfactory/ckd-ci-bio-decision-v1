import { loadV39CustomerJudgmentResult } from './journey-v39-customer-judgment-result-store';
import { loadV39CustomerStrategyResult } from './journey-v39-customer-strategy-result-store';
import { V39CustomerPriorityLab } from './journey-v39-customer-priority-lab';

const V39_CUSTOMER_PRIORITY_UX_SMOKE_MARKERS = [
  '7단계 진행 가이드',
  '고객군별 2주 대응 방향',
  '고객군 × 팀원 2주 실행 Map',
  '6단계 고객 Data 확인 List',
  'AI 없이도 할 수 있습니다',
  'AI를 쓰면 좋아지는 점',
  '대응 강도',
  '팀원 연결 기준',
  '실제 연결 후보',
  '8단계는 실행 대화로 이어집니다',
  '이 단계에서 하는 일',
  '이전 단계에서 가져온 것',
  '다음 단계로 넘길 것',
  '최소 결과물',
  '고객 Data 증거 카드',
  '고객군 후보와 점검 조건을 분리합니다',
  'AI로 2주 실행 Map 초안 만들기',
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

function getSavedMemberConnectionCount() {
  const strategyResult = loadV39CustomerStrategyResult();
  return Object.values(strategyResult.strategies).filter((strategy) => strategy.memberRole.trim()).length;
}

export function V39CustomerPriorityUxLab() {
  const selectedDataCheckCount = getSelectedDataCheckCount();
  const dataCheckMemoCount = getDataCheckMemoCount();
  const savedDirectionCount = getSavedDirectionCount();
  const savedMemberConnectionCount = getSavedMemberConnectionCount();

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">7단계 진행 가이드 · 고객군별 2주 대응 방향</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">고객군 후보와 점검 조건을 분리합니다</h2>
            <p className="mt-2 max-w-4xl text-sm font-bold leading-6 text-slate-600">6단계 고객 Data 증거 카드를 바탕으로, 이번 2주 동안 움직일 고객군 후보와 반드시 먼저 확인할 점검 조건을 나눕니다. 표현·자료 안전선은 고객군이 아니라 모든 대응 전에 확인할 조건으로 다룹니다.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-4 lg:w-[42rem]">
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
              <p className="text-xs font-black text-sky-700">6단계 증거 카드</p>
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
            <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
              <p className="text-xs font-black text-amber-700">1차 연결 후보</p>
              <p className="mt-1 text-sm font-black text-amber-950">{savedMemberConnectionCount}건</p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">AI 없이도 할 수 있습니다</p>
            <p className="mt-1">팀장은 6단계에서 확인한 고객 Data 단서를 보고, 어떤 고객군은 움직이고 어떤 조건은 더 확인해야 할지 판단할 수 있습니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">AI를 쓰면 좋아지는 점</p>
            <p className="mt-1">AI는 고객군 후보, 점검 조건, 2주 행동, 팀원 확인 질문, 안전선, 다음 회의 확인 포인트를 한눈에 보이는 실행 Map 초안으로 정리해 줍니다.</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">이 단계에서 하는 일</p>
            <p className="mt-1">6단계 단서를 고객군 후보와 점검 조건으로 나누고, 2주 실행 Map 초안을 만듭니다.</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">이전 단계에서 가져온 것</p>
            <p className="mt-1">6단계 고객 Data 증거 카드, 기회 단서, 주의 단서, 부족 정보, 추가 확인 질문입니다.</p>
          </div>
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">다음 단계로 넘길 것</p>
            <p className="mt-1">8단계 역할 보완에서 활용할 고객군별 2주 대응 방향과 1차 팀원 연결 후보입니다.</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
          <p className="font-black">8단계에서 역할을 완성합니다</p>
          <p className="mt-1">7단계에서는 “고객군별로 어떻게 움직일지”와 “누가 연결 후보가 될 수 있는지”만 정합니다. 다음 단계에서는 이 후보를 팀원이 실제로 받아들일 수 있도록 역할·지원 포인트·점검 질문으로 보완합니다.</p>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          <p className="font-black text-slate-950">최소 결과물</p>
          <p className="mt-1">고객군별 2주 실행 Map 초안입니다. 고객군 후보 또는 점검 조건, 확인된 단서, 아직 부족한 정보, 이번 2주 행동, 팀원 확인 질문, 안전선, 다음 회의 확인 포인트를 남기면 충분합니다.</p>
        </div>

        <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
          고객을 점수화하거나 순위표로 세우는 시간이 아닙니다. AI 초안도 그대로 확정하지 않습니다. 확인된 Data를 근거로 이번 2주 동안 움직일 조건과 보완할 조건을 정리합니다. 팀원 연결도 확정 배정이 아니라 8단계 보완을 위한 실행 가설로 다룹니다.
        </div>
      </section>

      <V39CustomerPriorityLab />
    </section>
  );
}
