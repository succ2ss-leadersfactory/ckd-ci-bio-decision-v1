import { V39DashboardAnalysisLab } from './journey-v39-dashboard-analysis-lab';
import { loadV39DashboardResult } from './journey-v39-dashboard-result-store';

const V39_RESEARCH_STRATEGY_STORAGE_KEY = 'ckd.v39.researchStrategy.v2';

const V39_DASHBOARD_ANALYSIS_UX_SMOKE_MARKERS = [
  '5단계 진행 가이드',
  '4단계 AI 전략 리서치 연결',
  '관리 지표 선정 상태',
  '선택한 핵심 실행 지표',
  '고객 Data 확인 List로 넘길 기준',
  '이 단계에서 하는 일',
  '이전 단계에서 가져온 것',
  '다음 단계로 넘길 것',
  '최소 결과물',
].join('|');
void V39_DASHBOARD_ANALYSIS_UX_SMOKE_MARKERS;

type ResearchBridge = {
  selectedTheme?: string;
  customTheme?: string;
  metricBridgeQuestions?: string;
};

function readResearchBridge(): ResearchBridge {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(V39_RESEARCH_STRATEGY_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ResearchBridge;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function getLineCount(text: string) {
  return text.split(/\r?\n/).map((item) => item.trim()).filter(Boolean).length;
}

function getDashboardAnalysisStatus() {
  const result = loadV39DashboardResult();
  const bridge = readResearchBridge();
  const selectedMetricCount = result.metricSelection.selectedCoreMetricIds.length;
  const supportSignalCount = result.metricSelection.selectedSupportMetricIds.length;
  const cautionCount = result.metricSelection.selectedSafetyMetricIds.length;
  const questionCount = getLineCount(result.metricResult.aiRecommendedQuestions);
  const bridgeQuestions = bridge.metricBridgeQuestions?.trim() ?? '';
  const researchTheme = bridge.customTheme?.trim() || bridge.selectedTheme?.trim() || '';

  return {
    teamSituationCount: result.teamSituations.length,
    selectedMetricCount,
    supportSignalCount,
    cautionCount,
    questionCount,
    hasMetricSuggestion: result.metricResult.rawAiMetricSuggestion.trim().length > 0,
    hasBridgeQuestions: bridgeQuestions.length > 0,
    bridgeQuestions,
    researchTheme,
    updatedAt: result.updatedAt,
  };
}

export function V39DashboardAnalysisUxLab() {
  const status = getDashboardAnalysisStatus();
  const savedStateLabel = status.updatedAt ? '관리 지표 저장됨' : '아직 비어 있음';

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-violet-100 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-violet-700">5단계 진행 가이드 · 우리 팀 관리 지표 선정</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">4단계 전략 이슈를 이번 2주 동안 볼 관리 지표로 바꿉니다</h2>
            <p className="mt-2 max-w-4xl text-sm font-bold leading-6 text-slate-600">이 단계에서는 팀원 유형을 고르지 않습니다. 4단계 AI 전략 리서치에서 남긴 실행 질문과 우리 팀 상황을 바탕으로, 6단계 고객 Data 확인 List로 넘길 관리 기준만 정리합니다.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[34rem]">
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-xs font-black text-violet-700">관리 지표 선정 상태</p>
              <p className="mt-1 text-sm font-black text-violet-950">상황 {status.teamSituationCount}개 · 지표 {status.selectedMetricCount}개</p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
              <p className="text-xs font-black text-sky-700">4단계 연결 질문</p>
              <p className="mt-1 text-sm font-black text-sky-950">{status.hasBridgeQuestions ? '가져온 질문 있음' : '아직 없음'}</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">현재 메모</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{savedStateLabel}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
          <p className="font-black">4단계 AI 전략 리서치 연결</p>
          <p className="mt-1">{status.researchTheme ? `선택 주제: ${status.researchTheme}` : '4단계에서 선택한 리서치 주제가 아직 저장되지 않았습니다.'}</p>
          <div className="mt-2 rounded-2xl bg-white/80 px-3 py-2 text-slate-700">
            {status.bridgeQuestions ? status.bridgeQuestions : '4단계의 “관리 지표로 바꿀 실행 질문”이 여기에 표시됩니다. 이 질문을 참고해 아래에서 우리 팀 상황과 관리 지표를 정리하세요.'}
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">이 단계에서 하는 일</p>
            <p className="mt-1">전략 이슈와 우리 팀 상황을 바탕으로 이번 2주 동안 실제로 볼 관리 지표를 고릅니다.</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">이전 단계에서 가져온 것</p>
            <p className="mt-1">AI 전략 리서치 주제, 전략 이슈, 관리 지표로 바꿀 실행 질문입니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">다음 단계로 넘길 것</p>
            <p className="mt-1">6단계 고객 Data 확인 List로 넘길 핵심 실행 지표, 참고 신호, 조심할 해석, 확인 질문입니다.</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">선택한 핵심 실행 지표</p>
            <p className="mt-1">{status.selectedMetricCount}개</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">함께 볼 현장 신호</p>
            <p className="mt-1">{status.supportSignalCount}개</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">조심할 해석·확인 질문</p>
            <p className="mt-1">주의 {status.cautionCount}개 · 질문 {status.questionCount}개</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          <p className="font-black text-slate-950">최소 결과물</p>
          <p className="mt-1">이 화면에서는 고객 Data 확인 List로 넘길 기준만 남기면 됩니다. 핵심 실행 지표 2~4개, 함께 볼 현장 신호, 조심할 해석, 팀장이 확인할 질문, 그리고 “왜 이 지표를 보려는지” 한 문장을 정리합니다.</p>
        </div>
      </section>

      <V39DashboardAnalysisLab />
    </section>
  );
}
