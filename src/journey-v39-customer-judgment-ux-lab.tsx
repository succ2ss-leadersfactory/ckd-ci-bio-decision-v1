import { loadV39CustomerJudgmentResult } from './journey-v39-customer-judgment-result-store';
import { V39CustomerJudgmentLab } from './journey-v39-customer-judgment-lab';

const V39_CUSTOMER_JUDGMENT_UX_SMOKE_MARKERS = [
  '6단계 진행 가이드',
  '고객 Data에서 기회와 착시를 분리합니다',
  '고객 Data 판단 상태',
  '선택 고객 유형',
  '6단계 저장 상태',
  '이 단계에서 하는 일',
  '이전 단계에서 가져온 것',
  '다음 단계로 넘길 것',
  '최소 결과물',
].join('|');
void V39_CUSTOMER_JUDGMENT_UX_SMOKE_MARKERS;

function getCustomerJudgmentStatus() {
  const result = loadV39CustomerJudgmentResult();
  const decisionCount = Object.values(result.decisions).filter((decision) => (
    decision.priorityDecision ||
    decision.opportunitySignal.trim() ||
    decision.riskSignal.trim() ||
    decision.missingInfo.trim() ||
    decision.nextCheck.trim() ||
    decision.twoWeekDirection.trim() ||
    decision.complianceNote.trim() ||
    decision.judgmentMemo.trim()
  )).length;

  return {
    contextCount: result.customerContextSelections.length,
    criteriaCount: result.judgmentCriteriaSelections.length,
    selectedCustomerCount: result.selectedCustomerTypeIds.length,
    selectedCustomerLabels: result.selectedCustomerTypeIds.map((id) => `고객 유형 ${id}`).join(' · '),
    decisionCount,
    hasAiSignal: result.rawAiSignalResult.trim().length > 0,
    updatedAt: result.updatedAt,
  };
}

export function V39CustomerJudgmentUxLab() {
  const status = getCustomerJudgmentStatus();
  const savedStateLabel = status.updatedAt ? '메모 남김' : '아직 비어 있음';
  const selectedCustomerLabel = status.selectedCustomerCount > 0 ? status.selectedCustomerLabels : '아직 선택 전';

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">6단계 · 고객 반응에서 읽어야 할 것</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">고객 반응을 바로 기회로 단정하지 말고, 확인할 신호와 조심할 해석을 나눠봅니다</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[34rem]">
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
              <p className="text-xs font-black text-sky-700">고객 반응 메모</p>
              <p className="mt-1 text-sm font-black text-sky-950">상황 {status.contextCount}개 · 기준 {status.criteriaCount}개</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">먼저 볼 고객군</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{status.selectedCustomerCount}개</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-xs font-black text-violet-700">현재 판단 메모</p>
              <p className="mt-1 text-sm font-black text-violet-950">{savedStateLabel}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">지금 나눠볼 것</p>
            <p className="mt-1">반응이 좋다는 말만으로 움직이지 않습니다. 기회 신호, 조심해야 할 해석, 더 물어봐야 할 질문을 나눕니다.</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">앞에서 확인한 내용</p>
            <p className="mt-1">리서치와 전략 해석에서 떠올린 시장 이슈, 현장 반응, 팀장 관점의 실행 가설입니다.</p>
          </div>
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">다음 화면에서 이어 쓸 내용</p>
            <p className="mt-1">7단계에서 고객별 대응안을 정할 때 필요한 판단 근거와 조심해야 할 표현입니다.</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">현재 선택 고객</p>
            <p className="mt-1">{selectedCustomerLabel}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">고객별 판단 메모</p>
            <p className="mt-1">{status.decisionCount}건 정리됨</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">AI가 나눠본 신호</p>
            <p className="mt-1">{status.hasAiSignal ? '가져온 답변 있음' : '아직 없음'}</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          고객을 점수화하거나 등급화하려는 화면이 아닙니다. 고객 반응에서 무엇을 기회로 볼지, 무엇은 더 확인해야 할지, 어떤 표현은 조심해야 할지만 남기면 됩니다.
        </div>
      </section>

      <V39CustomerJudgmentLab />
    </section>
  );
}
