import { V39DashboardAnalysisLab } from './journey-v39-dashboard-analysis-lab';
import { loadV39DashboardResult } from './journey-v39-dashboard-result-store';

const V39_DASHBOARD_ANALYSIS_UX_SMOKE_MARKERS = [
  '5단계 진행 가이드',
  '팀원 실행 Data를 역할 판단의 근거로 정리합니다',
  '팀 실행진단 상태',
  '선택 팀원 유형',
  '5단계 저장 상태',
  '이 단계에서 하는 일',
  '이전 단계에서 가져온 것',
  '다음 단계로 넘길 것',
  '최소 결과물',
].join('|');
void V39_DASHBOARD_ANALYSIS_UX_SMOKE_MARKERS;

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
  const savedStateLabel = status.updatedAt ? '메모 남김' : '아직 비어 있음';

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-violet-100 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-violet-700">5단계 · 팀 실행 흐름 읽기</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">숫자만 보지 말고, 팀원별 움직임이 어디서 갈리는지 먼저 짚어봅니다</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[34rem]">
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-xs font-black text-violet-700">팀에서 잡힌 신호</p>
              <p className="mt-1 text-sm font-black text-violet-950">상황 {status.teamSituationCount}개 · 지표 {status.selectedMetricCount}개</p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
              <p className="text-xs font-black text-sky-700">눈여겨볼 팀원</p>
              <p className="mt-1 text-sm font-black text-sky-950">{status.selectedMemberCount}명</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">현재 메모</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{savedStateLabel}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">지금 볼 것</p>
            <p className="mt-1">누가 열심히 했는지보다, 어디에서 실행이 끊기고 어디에서 기준이 흔들렸는지를 봅니다.</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">앞에서 확인한 내용</p>
            <p className="mt-1">리서치와 전략 해석에서 확인한 시장 변화, 현장 반응, 팀 실행상의 걸림돌입니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">다음 화면에서 이어 쓸 내용</p>
            <p className="mt-1">8단계에서 역할을 나눌 때 필요한 팀원별 신호, 지표를 고른 이유, 확인 질문입니다.</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">AI가 정리한 지표</p>
            <p className="mt-1">{status.hasMetricSuggestion ? '가져온 답변 있음' : '아직 없음'}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">팀원별 신호 정리</p>
            <p className="mt-1">{status.hasMemberSignal ? '가져온 답변 있음' : '아직 없음'}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">팀장 메모</p>
            <p className="mt-1">{status.prepCount}건 정리됨</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          이 화면에서는 팀 상황, 핵심 지표, 보완 지표, 안전하게 봐야 할 지표, 팀원별 관찰 신호와 확인 질문만 남기면 됩니다. 팀원을 점수 매기려는 화면이 아니라, 다음 역할 배분 전에 팀장이 눈여겨볼 근거를 정리하는 자리입니다.
        </div>
      </section>

      <V39DashboardAnalysisLab />
    </section>
  );
}
