import { loadV39CustomerJudgmentResult } from './journey-v39-customer-judgment-result-store';
import { V39CustomerJudgmentLab } from './journey-v39-customer-judgment-lab';

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
  const savedStateLabel = status.updatedAt ? '저장 내용 있음' : '아직 작성 전';
  const selectedCustomerLabel = status.selectedCustomerCount > 0 ? status.selectedCustomerLabels : '아직 선택 전';

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">6단계 진행 가이드</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">고객 Data에서 기회와 착시를 분리합니다</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[34rem]">
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
              <p className="text-xs font-black text-sky-700">고객 Data 판단 상태</p>
              <p className="mt-1 text-sm font-black text-sky-950">상황 {status.contextCount}개 · 기준 {status.criteriaCount}개</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">선택 고객 유형</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{status.selectedCustomerCount}개</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-xs font-black text-violet-700">6단계 저장 상태</p>
              <p className="mt-1 text-sm font-black text-violet-950">{savedStateLabel}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">이 단계에서 하는 일</p>
            <p className="mt-1">고객 Data를 기회 신호, 착시·리스크 신호, 부족한 정보, 다음 확인 질문으로 나눕니다.</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">이전 단계에서 가져온 것</p>
            <p className="mt-1">리서치·전략 해석에서 잡은 시장·현장 이슈와 팀장 관점의 실행 가설입니다.</p>
          </div>
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">다음 단계로 넘길 것</p>
            <p className="mt-1">7단계 고객 유형별 대응 전략에 반영할 고객별 판단 근거와 안전선입니다.</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">현재 선택 고객</p>
            <p className="mt-1">{selectedCustomerLabel}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">고객별 판단 메모</p>
            <p className="mt-1">{status.decisionCount}개 정리</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">AI 신호 분리 결과</p>
            <p className="mt-1">{status.hasAiSignal ? '붙여넣은 결과 있음' : '아직 없음'}</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          최소 결과물: 고객 Data 상황 선택, 판단 기준 선택, 판단 대상 고객 유형 선택, 고객별 2주 판단 메모와 컴플라이언스 안전선. 고객을 점수화하거나 등급화하지 않고, 다음 단계에서 전략으로 바꿀 판단 근거만 남깁니다.
        </div>
      </section>

      <V39CustomerJudgmentLab />
    </section>
  );
}
