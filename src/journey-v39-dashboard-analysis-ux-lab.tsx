import { V39DashboardAnalysisLab } from './journey-v39-dashboard-analysis-lab';
import { loadV39DashboardResult } from './journey-v39-dashboard-result-store';
import { V39ActionTriplet, V39FlowStrip, V39MinimumChecklist, V39MiniFlow, V39SafetyStrip, V39StepHero } from './journey-v39-ux-components';

const V39_RESEARCH_STRATEGY_STORAGE_KEY = 'ckd.v39.researchStrategy.v2';

const V39_DASHBOARD_ANALYSIS_UX_SMOKE_MARKERS = [
  '5단계 진행 가이드',
  '4단계 AI 전략 리서치 연결',
  'AI 없이도 할 수 있습니다',
  'AI를 쓰면 좋아지는 점',
  '활동 지표',
  '전환 지표',
  '품질 지표',
  '전환 지표 또는 품질 지표',
  '관리 지표 선정 상태',
  '선택한 핵심 실행 지표',
  '고객 Data 확인 List로 넘길 기준',
  '이 단계에서 하는 일',
  '이전 단계에서 가져온 것',
  '다음 단계로 넘길 것',
  '최소 결과물',
  '5단계 · 우리 팀 관리 지표 선정',
  '4단계 전략 이슈를 이번 2주 동안 볼 관리 지표로 바꿉니다',
  '전략 질문 → 관리 지표 → 고객 활동 기록 확인',
  'V39StepHero',
  'V39FlowStrip',
  'V39ActionTriplet',
  'V39MinimumChecklist',
  'V39MiniFlow',
  'V39SafetyStrip',
].join('|');
void V39_DASHBOARD_ANALYSIS_UX_SMOKE_MARKERS;

type ResearchBridge = {
  selectedTheme?: string;
  customTheme?: string;
  metricBridgeQuestions?: string;
};

type MetricType = 'activity' | 'transition' | 'quality' | 'unclear';

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

function classifyMetricType(metric: string): MetricType {
  const value = metric.replace(/\s+/g, '');
  if (/(후속|다음접점|다음약속|전환|완료|확보|이어|연결|자료요청대응|후속확인)/.test(value)) return 'transition';
  if (/(질문|기록품질|충실도|제약요인|안전|표현|품질|대화|메모|사전준비|점검|동행후개선)/.test(value)) return 'quality';
  if (/(방문|접촉|활동|실행건수|신규|대체접점|자료전달|횟수|건수|수$)/.test(value)) return 'activity';
  return 'unclear';
}

function countMetricTypes(metrics: string[]) {
  return metrics.reduce<Record<MetricType, number>>((counts, metric) => {
    counts[classifyMetricType(metric)] += 1;
    return counts;
  }, { activity: 0, transition: 0, quality: 0, unclear: 0 });
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
  const metricTypeCounts = countMetricTypes(result.metricSelection.selectedCoreMetricIds);
  const hasTransitionOrQuality = metricTypeCounts.transition + metricTypeCounts.quality > 0;

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
    metricTypeCounts,
    hasTransitionOrQuality,
    updatedAt: result.updatedAt,
  };
}

export function V39DashboardAnalysisUxLab() {
  const status = getDashboardAnalysisStatus();
  const savedStateLabel = status.updatedAt ? '관리 지표 저장됨' : '아직 비어 있음';

  return (
    <section className="space-y-4">
      <V39FlowStrip currentStep={5} />
      <V39StepHero
        eyebrow="5단계 · 우리 팀 관리 지표 선정"
        icon="🎯"
        title="4단계 전략 이슈를 이번 2주 동안 볼 관리 지표로 바꿉니다"
        tone="violet"
        description="이 단계에서는 팀원 유형을 고르지 않습니다. 4단계 전략 리서치에서 남긴 실행 질문과 우리 팀 상황을 바탕으로, 고객 활동 기록에서 무엇을 확인할지 기준이 되는 관리 지표만 정리합니다."
        badges={[
          { label: '관리 지표', value: `${status.selectedMetricCount}개`, tone: 'violet', icon: '🎯' },
          { label: '4단계 질문', value: status.hasBridgeQuestions ? '있음' : '아직 없음', tone: 'sky', icon: '🔭' },
          { label: '메모 상태', value: savedStateLabel, tone: 'emerald', icon: '📝' },
        ]}
      />

      <section className="rounded-3xl border border-violet-100 bg-white p-4 shadow-sm md:p-5">
        <V39MiniFlow
          items={[
            { icon: '🔭', title: '전략 질문 가져오기', body: '4단계에서 남긴 리서치 질문과 우리 팀 상황을 가져옵니다.' },
            { icon: '🎯', title: '관리 지표로 바꾸기', body: '이번 2주 동안 볼 활동·전환·품질 지표를 고릅니다.' },
            { icon: '🔎', title: '고객 기록 확인으로 넘기기', body: '다음 화면에서 고객 활동 기록에서 확인할 단서로 바꿉니다.' },
          ]}
        />

        <div className="mt-3 rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
          <p className="font-black">4단계 전략 리서치 연결</p>
          <p className="mt-1">{status.researchTheme ? `선택 주제: ${status.researchTheme}` : '4단계에서 선택한 리서치 주제가 아직 저장되지 않았습니다.'}</p>
          <div className="mt-2 rounded-2xl bg-white/80 px-3 py-2 text-slate-700">
            {status.bridgeQuestions ? status.bridgeQuestions : '4단계의 “관리 지표로 바꿀 실행 질문”이 여기에 표시됩니다. 이 질문을 참고해 아래에서 우리 팀 상황과 관리 지표를 정리하세요.'}
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">AI 없이도 할 수 있습니다</p>
            <p className="mt-1">팀장은 경험을 바탕으로 방문 건수, 영업활동 기록 입력, 신규 접촉 수 같은 익숙한 지표를 정하고 팀원에게 설명할 수 있습니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">AI를 쓰면 좋아지는 점</p>
            <p className="mt-1">활동량 지표에 머무르지 않고, 다음 행동으로 이어졌는지 보는 전환 지표와 대화·기록의 질을 보는 품질 지표까지 후보를 넓힐 수 있습니다.</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-xs font-bold leading-5 text-orange-950">
            <p className="font-black">활동 지표</p>
            <p className="mt-1">무엇을 했는가를 봅니다. 예: 신규접촉 고객수, 대체접점 실행건수, 영업활동 기록 입력건수.</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">전환 지표</p>
            <p className="mt-1">다음 행동으로 이어졌는가를 봅니다. 예: 후속조치 완료율, 다음접점 확보건수.</p>
          </div>
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">품질 지표</p>
            <p className="mt-1">대화와 기록의 질이 남았는가를 봅니다. 예: 고객 질문 기록률, 제약요인 공유건수, 안전 표현 점검건수.</p>
          </div>
        </div>

        <div className="mt-3">
          <V39ActionTriplet
            previous={{
              icon: '🔭',
              title: '전략 리서치 주제와 실행 질문',
              body: '4단계에서 찾은 변화 신호와 우리 팀에 필요한 질문을 가져옵니다.',
            }}
            current={{
              icon: '🎯',
              title: '이번 2주 동안 볼 지표를 고릅니다',
              body: '활동 지표에만 머무르지 않고 전환·품질 지표까지 함께 봅니다.',
            }}
            next={{
              icon: '🔎',
              title: '6단계에서 고객 활동 기록의 단서로 바꿉니다',
              body: '선택한 지표가 고객 기록에서 어떻게 보이는지 확인합니다.',
            }}
          />
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">선택한 핵심 실행 지표</p>
            <p className="mt-1">{status.selectedMetricCount}개 · 활동 {status.metricTypeCounts.activity} · 전환 {status.metricTypeCounts.transition} · 품질 {status.metricTypeCounts.quality}</p>
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

        <div className="mt-3">
          <V39MinimumChecklist
            tone="violet"
            items={[
              '핵심 실행 지표 2~4개',
              '전환 또는 품질 지표 1개 이상',
              '함께 볼 현장 신호',
              '조심할 해석',
              '팀장이 확인할 질문',
            ]}
          />
        </div>

        <div className="mt-3">
          <V39SafetyStrip>
            방문을 많이 했는지만 보지 않습니다. 이번 2주 동안 고객 반응, 다음 접점, 기록의 질, 말해도 되는 선까지 함께 볼 수 있는 지표를 남깁니다.
          </V39SafetyStrip>
        </div>

        {status.selectedMetricCount > 0 && !status.hasTransitionOrQuality ? (
          <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
            현재 선택은 활동 지표 중심으로 보입니다. 후속조치 완료율, 다음접점 확보건수, 고객 질문 기록률처럼 전환·품질 지표를 하나 이상 추가해 보세요.
          </div>
        ) : null}
      </section>

      <V39DashboardAnalysisLab />
    </section>
  );
}
