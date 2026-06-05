import { loadV39CustomerJudgmentResult } from './journey-v39-customer-judgment-result-store';
import { V39CustomerJudgmentLab } from './journey-v39-customer-judgment-lab';
import { loadV39DashboardResult } from './journey-v39-dashboard-result-store';

const V39_CUSTOMER_JUDGMENT_UX_SMOKE_MARKERS = [
  'V39CustomerJudgmentUxLab',
  '6단계 진행 가이드',
  '고객 Data에서 기회와 착시를 분리합니다',
  '고객 Data 판단 상태',
  '선택 증거 카드',
  '6단계 저장 상태',
  '고객 Data에서 신호 찾기',
  'AI 없이도 할 수 있습니다',
  'AI를 쓰면 좋아지는 점',
  '패턴·편중·부족 정보',
  '고객을 평가하거나 등급화하지 않습니다',
  '이번 2주 동안 고객 Data에서 볼 증거',
  '필수 3개만 완료하면 다음 단계로 갈 수 있습니다',
  '6~8단계는 지표를 실행으로 바꾸는 짧은 흐름입니다',
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
  'Block 1부터 바로 실습',
].join('|');
void V39_CUSTOMER_JUDGMENT_UX_SMOKE_MARKERS;

function getV39CustomerJudgmentStatus() {
  const result = loadV39CustomerJudgmentResult();
  const dashboard = loadV39DashboardResult();
  const selectedEvidenceCardCount = result.selectedCustomerTypeIds.length;
  const requiredDoneCount = [
    selectedEvidenceCardCount >= 1,
    Object.values(result.decisions).some((decision) => decision.missingInfo.trim()),
    Object.values(result.decisions).some((decision) => decision.nextCheck.trim()),
  ].filter(Boolean).length;
  const hasDashboardMetric = Boolean(
    dashboard.updatedAt ||
    dashboard.metricSelection.selectedCoreMetricIds.length ||
    dashboard.metricSelection.selectedSupportMetricIds.length ||
    dashboard.metricSelection.selectedSafetyMetricIds.length,
  );

  return {
    requiredDoneCount,
    selectedEvidenceCardCount,
    hasDashboardMetric,
    savedStateLabel: result.updatedAt ? '메모 남김' : '아직 비어 있음',
    aiDraftLabel: result.rawAiSignalResult.trim() ? 'AI 초안 있음' : 'AI 초안 없음',
  };
}

export function V39CustomerJudgmentUxLab() {
  const status = getV39CustomerJudgmentStatus();

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">6단계 진행 가이드 · Block 1부터 바로 실습</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">고객 Data에서 볼 증거만 정리하고, 대응은 7단계에서 정합니다</h2>
            <p className="mt-2 max-w-4xl text-sm font-bold leading-6 text-slate-600">
              5단계 기준을 다시 설명하지 않고, 이번 단계에서는 고객 Data에서 확인할 증거·부족 정보·추가 확인 질문만 남깁니다. 고객군별 대응 방향은 다음 7단계에서 정합니다.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[34rem]">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">필수 완료</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{status.requiredDoneCount} / 3</p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
              <p className="text-xs font-black text-sky-700">선택 증거 카드</p>
              <p className="mt-1 text-sm font-black text-sky-950">{status.selectedEvidenceCardCount}개</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-xs font-black text-violet-700">6단계 저장 상태</p>
              <p className="mt-1 text-sm font-black text-violet-950">{status.savedStateLabel}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
          <p className="font-black">6~8단계는 지표를 실행으로 바꾸는 짧은 흐름입니다</p>
          <p className="mt-1">6단계는 고객 Data에서 볼 증거를 고르고, 7단계는 그 증거를 2주 대응 방향으로 묶고, 8단계는 그 실행을 맡을 팀원이 실제로 움직이도록 역할과 지원 포인트를 보완합니다.</p>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">이전 단계에서 가져온 것</p>
            <p className="mt-1">{status.hasDashboardMetric ? '5단계 관리 지표와 현장 신호가 연결되어 있습니다.' : '5단계에서 관리 지표를 선택하면 기준이 연결됩니다.'}</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">이 단계에서 하는 일</p>
            <p className="mt-1">고객 Data에서 먼저 볼 증거, 부족 정보, 팀원에게 더 확인할 질문을 정리합니다.</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">다음 단계로 넘길 것</p>
            <p className="mt-1">7단계 고객군별 대응 방향에서 활용할 대응 준비 메모입니다.</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
            <p className="font-black">최소 결과물</p>
            <p className="mt-1">증거 카드 1개, 부족 정보 1개, 추가 확인 질문 1개면 충분합니다.</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
          고객을 평가하거나 등급화하지 않습니다. 고객 Data에서 무엇을 기회로 볼지, 무엇은 더 확인해야 할지, 어떤 표현은 조심해야 할지만 남기면 됩니다.
        </div>
      </section>

      <div className="v39-customer-judgment-core">
        <style>{`
          .v39-customer-judgment-core > section > section:nth-child(1),
          .v39-customer-judgment-core > section > section:nth-child(2) {
            display: none;
          }
        `}</style>
        <V39CustomerJudgmentLab />
      </div>
    </section>
  );
}
