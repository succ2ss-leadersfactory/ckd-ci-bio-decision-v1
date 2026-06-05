import { loadV39CustomerJudgmentResult } from './journey-v39-customer-judgment-result-store';
import { V39CustomerJudgmentLab } from './journey-v39-customer-judgment-lab';
import { loadV39DashboardResult } from './journey-v39-dashboard-result-store';

const V39_CUSTOMER_JUDGMENT_UX_SMOKE_MARKERS = [
  'V39CustomerJudgmentUxLab',
  '6단계 진행 가이드',
  '고객 Data에서 기회와 착시를 분리합니다',
  '고객 Data 판단 상태',
  '선택 확인 신호',
  '6단계 저장 상태',
  '고객 Data에서 신호 찾기',
  'AI 없이도 할 수 있습니다',
  'AI를 쓰면 좋아지는 점',
  '패턴·편중·부족 정보',
  '고객을 평가하거나 등급화하지 않습니다',
  '이번 2주 동안 고객 Data에서 볼 신호',
  '필수 3개만 완료하면 다음 단계로 갈 수 있습니다',
  '이 단계에서 하는 일',
  '이전 단계에서 가져온 것',
  '다음 단계로 넘길 것',
  '최소 결과물',
  '6단계. 고객의 무엇을 볼 것인가',
  '5단계에서 가져온 기준',
  '5단계에서 넘겨받은 기준',
  '관리 지표를 고객 Data로 확인하기',
  '고객 Data 해석 메모',
  '팀원별 영업활동 기록 품질 차이',
].join('|');
void V39_CUSTOMER_JUDGMENT_UX_SMOKE_MARKERS;

const CUSTOMER_DATA_VIEWPOINTS = [
  '고객 반응이 실제로 있었는가',
  '다음 대화나 방문으로 이어질 수 있는가',
  '새롭게 봐야 할 고객군이 있는가',
  '아직 판단하기에 부족한 정보는 무엇인가',
  '방문이나 대화에 제약은 없는가',
  '표현이나 자료 사용에서 조심할 것은 무엇인가',
];

const CUSTOMER_DATA_ANALYSIS_PATTERNS = [
  '고객군별 접촉 편중',
  '방문 이후 후속조치 전환',
  '고객 질문·자료 요청 변화',
  '신규·미접촉 고객군 반응',
  '방문 제한·일정 변경 패턴',
  '팀원별 영업활동 기록 품질 차이',
  '자료 전달 후 후속 확인 여부',
];

const SAMPLE_CUSTOMER_DATA_ROWS = [
  ['고객군 A', '높음', '질문 증가', '일부 완료', '낮음', '보통'],
  ['고객군 B', '중간', '자료 요청', '미완료', '일정 변경', '낮음'],
  ['고객군 C', '낮음', '정보 부족', '없음', '접근 경로 부족', '낮음'],
  ['고객군 D', '높음', '반응은 있으나 다음 약속 없음', '지연', '방문 제한', '보통'],
];

const METRIC_TO_CUSTOMER_DATA_EXAMPLES = [
  {
    metric: '후속조치 완료율',
    dataQuestions: ['후속 미팅 여부', '고객 질문', '자료 요청', '다음 약속'],
  },
  {
    metric: '다음접점 확보건수',
    dataQuestions: ['고객의 응답 속도', '다음 논의 주제', '일정 가능성'],
  },
  {
    metric: '신규접촉 고객수',
    dataQuestions: ['미접촉 고객군', '신규 고객 반응', '접근 경로'],
  },
  {
    metric: '신규고객 방문비율',
    dataQuestions: ['기존 고객 편중 여부', '신규 고객 접점 비중'],
  },
  {
    metric: '대안활동 실행건수',
    dataQuestions: ['방문 외 대체 접점', '온라인·자료·협업 가능성'],
  },
  {
    metric: '제약요인 공유건수',
    dataQuestions: ['방문 제한', '일정 변경', '정보 접근 제한', '내부 지원 필요'],
  },
];

function normalizeListItem(value: string) {
  return value
    .replace(/^[-*•]\s*/, '')
    .replace(/^\d+[.)]\s*/, '')
    .replace(/^#{1,6}\s*/, '')
    .replace(/\*\*/g, '')
    .trim();
}

function compactList(items: string[], limit = 8) {
  const seen = new Set<string>();
  const results: string[] = [];
  for (const item of items) {
    const normalized = normalizeListItem(item);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    results.push(normalized);
    if (results.length >= limit) break;
  }
  return results;
}

function splitListText(value: string, limit = 8) {
  return compactList(value.split(/\r?\n/), limit).filter((item) => !/^(팀장이 더 확인할 질문|함께 봐야 할 현장 신호|조심해서 봐야 할 해석|핵심 실행 지표 후보)$/.test(item));
}

function getDashboardMetricBridge() {
  const dashboardResult = loadV39DashboardResult();
  const coreMetrics = compactList(dashboardResult.metricSelection.selectedCoreMetricIds, 6);
  const fieldSignals = compactList(dashboardResult.metricSelection.selectedSupportMetricIds, 6);
  const cautions = compactList(dashboardResult.metricSelection.selectedSafetyMetricIds, 6);
  const questions = splitListText(dashboardResult.metricResult.aiRecommendedQuestions, 6);
  const rationale = dashboardResult.metricSelection.metricRationale.trim() || dashboardResult.metricResult.additionalMetricIdea.trim();
  const teamSituations = compactList(dashboardResult.teamSituations, 4);

  return {
    coreMetrics,
    fieldSignals,
    cautions,
    questions,
    rationale,
    teamSituations,
    hasDashboardResult: Boolean(
      dashboardResult.updatedAt ||
      coreMetrics.length ||
      fieldSignals.length ||
      cautions.length ||
      questions.length ||
      rationale,
    ),
  };
}

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

  const requiredDoneCount = [
    result.selectedCustomerTypeIds.length >= 1,
    Object.values(result.decisions).some((decision) => decision.missingInfo.trim()),
    Object.values(result.decisions).some((decision) => decision.nextCheck.trim()),
  ].filter(Boolean).length;

  return {
    contextCount: result.customerContextSelections.length,
    criteriaCount: result.judgmentCriteriaSelections.length,
    selectedCustomerCount: result.selectedCustomerTypeIds.length,
    selectedCustomerLabels: result.selectedCustomerTypeIds.map((id) => `확인 신호 ${id}`).join(' · '),
    decisionCount,
    requiredDoneCount,
    hasAiSignal: result.rawAiSignalResult.trim().length > 0,
    updatedAt: result.updatedAt,
  };
}

function PillList({ items, emptyText, tone = 'slate' }: { items: string[]; emptyText: string; tone?: 'slate' | 'emerald' | 'sky' | 'amber' | 'violet' }) {
  const toneClass = {
    slate: 'border-slate-200 bg-slate-50 text-slate-700',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    sky: 'border-sky-200 bg-sky-50 text-sky-900',
    amber: 'border-amber-200 bg-amber-50 text-amber-900',
    violet: 'border-violet-200 bg-violet-50 text-violet-900',
  }[tone];

  if (items.length === 0) return <p className="mt-2 rounded-2xl border border-dashed border-slate-200 bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-500">{emptyText}</p>;

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {items.map((item) => <span key={item} className={`rounded-full border px-3 py-1.5 text-xs font-black ${toneClass}`}>{item}</span>)}
    </div>
  );
}

export function V39CustomerJudgmentUxLab() {
  const status = getCustomerJudgmentStatus();
  const metricBridge = getDashboardMetricBridge();
  const savedStateLabel = status.updatedAt ? '메모 남김' : '아직 비어 있음';
  const selectedCustomerLabel = status.selectedCustomerCount > 0 ? status.selectedCustomerLabels : '아직 선택 전';

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">6단계 진행 가이드 · 고객 Data에서 신호 찾기</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">6단계. 고객의 무엇을 볼 것인가</h2>
            <p className="mt-2 max-w-4xl text-sm font-bold leading-6 text-slate-600">
              5단계에서 정한 관리 지표를 고객 Data에서 확인할 신호로 바꿉니다. 고객을 평가하지 않고, 기회 신호·주의 신호·부족 정보·추가 확인 질문을 나눕니다. 고객군별 대응 방향은 다음 7단계에서 정합니다.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[34rem]">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">필수 완료</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{status.requiredDoneCount} / 3</p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
              <p className="text-xs font-black text-sky-700">선택 확인 신호</p>
              <p className="mt-1 text-sm font-black text-sky-950">{status.selectedCustomerCount}개</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-xs font-black text-violet-700">6단계 저장 상태</p>
              <p className="mt-1 text-sm font-black text-violet-950">{savedStateLabel}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">AI 없이도 할 수 있습니다</p>
            <p className="mt-1">팀장은 영업활동 기록, 방문·면담 메모, 고객 반응을 보고 경험적으로 고객 상황을 확인하고 다음 행동을 준비할 수 있습니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">AI를 쓰면 좋아지는 점</p>
            <p className="mt-1">흩어진 활동 Data를 비교·분류·패턴화하고, 기회 신호, 주의 신호, 부족 정보, 추가 확인 질문을 더 빠르게 구조화할 수 있습니다.</p>
          </div>
        </div>

        <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">5단계에서 가져온 기준</p>
              <h3 className="mt-1 text-base font-black text-slate-950">이번 2주 동안 고객 Data에서 볼 신호</h3>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-600">아래 내용은 새로 정하는 기준이 아니라, 5단계에서 가져온 관리 지표와 현장 신호입니다.</p>
            </div>
            <p className="rounded-full border border-white bg-white px-3 py-1 text-xs font-black text-slate-600">핵심 지표 {metricBridge.coreMetrics.length}개</p>
          </div>
          {!metricBridge.hasDashboardResult && <p className="mt-3 rounded-2xl border border-dashed border-slate-200 bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-500">5단계에서 관리 지표를 선택하면 이곳에 고객 Data에서 볼 신호가 표시됩니다.</p>}
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <div className="rounded-2xl border border-white bg-white p-4">
              <p className="text-xs font-black text-slate-500">선택한 핵심 실행 지표</p>
              <PillList items={metricBridge.coreMetrics} tone="emerald" emptyText="아직 선택된 핵심 실행 지표가 없습니다." />
            </div>
            <div className="rounded-2xl border border-white bg-white p-4">
              <p className="text-xs font-black text-slate-500">함께 볼 현장 신호</p>
              <PillList items={metricBridge.fieldSignals} tone="sky" emptyText="5단계에서 현장 신호를 분리하면 표시됩니다." />
            </div>
            <div className="rounded-2xl border border-white bg-white p-4">
              <p className="text-xs font-black text-slate-500">조심할 해석</p>
              <PillList items={metricBridge.cautions} tone="amber" emptyText="5단계에서 조심할 해석을 분리하면 표시됩니다." />
            </div>
            <div className="rounded-2xl border border-white bg-white p-4">
              <p className="text-xs font-black text-slate-500">팀장이 더 확인할 질문</p>
              <PillList items={metricBridge.questions} tone="violet" emptyText="5단계에서 확인 질문을 분리하면 표시됩니다." />
            </div>
          </div>
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <div className="rounded-2xl border border-white bg-white p-4 text-xs font-bold leading-5 text-slate-700">
              <p className="font-black text-slate-950">왜 이 지표를 보려는가</p>
              <p className="mt-1">{metricBridge.rationale || '이번 2주 동안 고객 Data를 볼 이유를 5단계에서 한 문장으로 남기면 이곳에 표시됩니다.'}</p>
            </div>
            <div className="rounded-2xl border border-white bg-white p-4 text-xs font-bold leading-5 text-slate-700">
              <p className="font-black text-slate-950">우리 팀 상황</p>
              <p className="mt-1">{metricBridge.teamSituations.length > 0 ? metricBridge.teamSituations.join(' · ') : '5단계에서 선택한 팀 상황이 있으면 함께 표시됩니다.'}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">이 단계에서 하는 일</p>
            <p className="mt-1">고객 Data에서 먼저 볼 신호를 고르고, 기회 신호·주의 신호·부족 정보·추가 확인 질문으로 나눕니다.</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">이전 단계에서 가져온 것</p>
            <p className="mt-1">선택한 핵심 실행 지표, 함께 볼 현장 신호, 조심할 해석, 팀장이 더 확인할 질문입니다.</p>
          </div>
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">다음 단계로 넘길 것</p>
            <p className="mt-1">7단계 고객군별 대응 방향에서 활용할 고객 Data 확인 신호와 대응 준비 메모입니다.</p>
          </div>
        </div>

        <div className="mt-3 rounded-3xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">고객 Data에서 어떤 패턴을 먼저 볼까요?</p>
          <h3 className="mt-1 text-base font-black text-slate-950">신호를 고를 때 참고할 예시</h3>
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            {CUSTOMER_DATA_ANALYSIS_PATTERNS.map((pattern) => (
              <div key={pattern} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-black leading-5 text-slate-700">{pattern}</div>
            ))}
          </div>
        </div>

        <div className="mt-3 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">가상 고객 Data 예시</p>
          <h3 className="mt-1 text-base font-black text-slate-950">실제 고객명·병원명 없이도 Data 확인 흐름을 연습합니다</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-xs font-bold leading-5 text-slate-700">
              <thead className="text-slate-500">
                <tr>
                  {['고객군', '최근 접촉', '고객 반응', '후속조치', '제약요인', '기록 품질'].map((head) => <th key={head} className="whitespace-nowrap border-b px-3 py-2">{head}</th>)}
                </tr>
              </thead>
              <tbody>
                {SAMPLE_CUSTOMER_DATA_ROWS.map((row) => (
                  <tr key={row.join('-')} className="bg-white/70">
                    {row.map((cell) => <td key={cell} className="whitespace-nowrap border-b border-slate-100 px-3 py-2">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs font-bold leading-5 text-slate-600">이 예시는 확인 사고를 돕기 위한 가상 Data입니다. 실제 고객명, 병원명, 의료진명, 제품명, 내부 수치, 개인정보는 입력하지 않습니다.</p>
        </div>

        <div className="mt-3 rounded-3xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">고객 Data 확인 관점</p>
          <h3 className="mt-1 text-base font-black text-slate-950">고객 Data를 볼 때 놓치지 말아야 할 질문</h3>
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {CUSTOMER_DATA_VIEWPOINTS.map((viewpoint) => (
              <div key={viewpoint} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-black leading-5 text-slate-700">{viewpoint}</div>
            ))}
          </div>
        </div>

        <div className="mt-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">지표별 고객 Data 질문 예시</p>
          <h3 className="mt-1 text-base font-black text-slate-950">관리 지표를 고객 Data 질문으로 바꾸는 방식</h3>
          <div className="mt-3 grid gap-3 lg:grid-cols-3">
            {METRIC_TO_CUSTOMER_DATA_EXAMPLES.map((example) => (
              <div key={example.metric} className="rounded-2xl border border-white bg-white p-4 text-xs font-bold leading-5 text-slate-700">
                <p className="font-black text-slate-950">{example.metric}</p>
                <p className="mt-1 text-slate-500">→ {example.dataQuestions.join(' · ')}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">현재 선택 확인 신호</p>
            <p className="mt-1">{selectedCustomerLabel}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">확인 신호별 메모</p>
            <p className="mt-1">{status.decisionCount}건 정리됨</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">AI가 정리한 초안</p>
            <p className="mt-1">{status.hasAiSignal ? '가져온 답변 있음' : '아직 없음'}</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
          <p className="font-black">필수 3개만 완료하면 다음 단계로 갈 수 있습니다</p>
          <p className="mt-1">확인 신호 1개 이상 선택, 부족 정보 1개 작성, 추가 확인 질문 1개 작성이면 충분합니다. 나머지는 시간이 있을 때 보완합니다.</p>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          <p className="font-black text-slate-950">최소 결과물</p>
          <p className="mt-1">고객 Data 확인 List입니다. 고객별 우선순위를 확정하기보다, Data 패턴, 기회 신호, 주의 신호, 부족 정보, 추가 확인 질문, 7단계 대응 준비 메모를 분리해 넘깁니다.</p>
        </div>

        <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
          고객을 평가하거나 등급화하지 않습니다. 고객 반응에서 무엇을 기회로 볼지, 무엇은 더 확인해야 할지, 어떤 표현은 조심해야 할지만 남기면 됩니다.
        </div>
      </section>

      <V39CustomerJudgmentLab />
    </section>
  );
}
