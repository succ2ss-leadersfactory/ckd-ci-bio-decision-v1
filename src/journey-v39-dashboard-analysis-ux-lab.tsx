import { V39DashboardAnalysisLab } from './journey-v39-dashboard-analysis-lab';
import { loadV39DashboardResult } from './journey-v39-dashboard-result-store';

function getDashboardAnalysisStatus() {
  const result = loadV39DashboardResult();
  const selectedMetricCount =
    result.metricSelection.selectedCoreMetricIds.length +
    result.metricSelection.selectedSupportMetricIds.length +
    result.metricSelection.selectedSafetyMetricIds.length;
  const prepCount = Object.values(result.memberResult.memberPreps).filter((prep) => (
    prep.observedSignal.trim() ||
    prep.strengthSignal.trim() ||
    prep.concernSignal.trim() ||
    prep.checkQuestion.trim() ||
    prep.doNotAssume.trim() ||
    prep.aiDraft.trim() ||
    prep.finalPrep.trim()
  )).length;

  return {
    teamSituationCount: result.teamSituations.length,
    selectedMetricCount,
    selectedMemberCount: result.memberResult.selectedMemberTypeIds.length,
    prepCount,
    hasMetricSuggestion: result.metricResult.rawAiMetricSuggestion.trim().length > 0,
    hasMemberSignal: result.memberResult.rawAiSignalResult.trim().length > 0,
    updatedAt: result.updatedAt,
  };
}

export function V39DashboardAnalysisUxLab() {
  const status = getDashboardAnalysisStatus();
  const savedStateLabel = status.updatedAt ? '저장 내용 있음' : '아직 작성 전';

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-violet-100 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-violet-700">5단계 진행 가이드</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">팀원 실행 Data를 역할 판단의 근거로 정리합니다</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[34rem]">
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-xs font-black text-violet-700">팀 실행진단 상태</p>
              <p className="mt-1 text-sm font-black text-violet-950">상황 {status.teamSituationCount}개 · 지표 {status.selectedMetricCount}개</p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
              <p className="text-xs font-black text-sky-700">선택 팀원 유형</p>
              <p className="mt-1 text-sm font-black text-sky-950">{status.selectedMemberCount}명</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">5단계 저장 상태</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{savedStateLabel}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">이 단계에서 하는 일</p>
            <p className="mt-1">팀원 실행 Data에서 관찰 가능한 신호, 핵심 지표, 보완 지표, 안전선 지표를 구분합니다.</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">이전 단계에서 가져온 것</p>
            <p className="mt-1">리서치·전략 해석에서 정리한 시장·현장 변화와 팀 실행 이슈입니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">다음 단계로 넘길 것</p>
            <p className="mt-1">8단계 팀원별 역할 방향에 반영할 팀원 신호, 지표 선택 이유, 다음 확인 질문입니다.</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">AI 지표 제안 결과</p>
            <p className="mt-1">{status.hasMetricSuggestion ? '붙여넣은 결과 있음' : '아직 없음'}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">팀원 신호 분리 결과</p>
            <p className="mt-1">{status.hasMemberSignal ? '붙여넣은 결과 있음' : '아직 없음'}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">팀원 준비 메모</p>
            <p className="mt-1">{status.prepCount}개 정리</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          최소 결과물: 팀 상황 선택, 핵심·보완·안전선 지표 선택, 팀원 유형 선택, 관찰 신호와 다음 확인 질문. 이 단계는 팀원을 점수화하는 단계가 아닙니다. 8단계 역할 방향을 정하기 위한 판단 근거만 남깁니다.
        </div>
      </section>

      <V39DashboardAnalysisLab />
    </section>
  );
}
