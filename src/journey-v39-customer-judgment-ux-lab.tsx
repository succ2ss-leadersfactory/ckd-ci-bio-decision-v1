import { loadV39CustomerJudgmentResult } from './journey-v39-customer-judgment-result-store';
import { V39CustomerJudgmentLab } from './journey-v39-customer-judgment-lab';
import { loadV39DashboardResult } from './journey-v39-dashboard-result-store';
import { V39ActionTriplet, V39FlowStrip, V39MinimumChecklist, V39SafetyStrip, V39StepHero } from './journey-v39-ux-components';

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
  '5단계에서 가져온 관리 지표',
  '이번 지표를 확인할 고객 Data 증거를 고르기 전에 먼저 봅니다',
  '5단계에서 넘겨받은 기준',
  '관리 지표를 고객 Data로 확인하기',
  '고객 Data 해석 메모',
  'Block 1부터 바로 실습',
  '방문·면담 기록에서 먼저 확인할 단서만 고릅니다',
  '고객에게 점수를 매기거나 줄 세우는 시간이 아닙니다',
  '8단계에서는 먼저 1on1로 맞춰볼 코칭 대상을 고릅니다',
  'V39StepHero',
  'V39FlowStrip',
  'V39ActionTriplet',
  'V39MinimumChecklist',
  'V39SafetyStrip',
].join('|');
void V39_CUSTOMER_JUDGMENT_UX_SMOKE_MARKERS;

function uniqueItems(items: string[]) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function MetricChipList({ items, emptyText }: { items: string[]; emptyText: string }) {
  const visibleItems = uniqueItems(items);

  if (visibleItems.length === 0) {
    return <p className="mt-2 rounded-2xl bg-white/70 px-3 py-2 text-xs font-bold leading-5 text-slate-500">{emptyText}</p>;
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {visibleItems.map((item) => (
        <span key={item} className="rounded-full bg-white px-3 py-1 text-xs font-black leading-5 text-slate-800 shadow-sm">
          {item}
        </span>
      ))}
    </div>
  );
}

function getV39CustomerJudgmentStatus() {
  const result = loadV39CustomerJudgmentResult();
  const dashboard = loadV39DashboardResult();
  const selectedEvidenceCardCount = result.selectedCustomerTypeIds.length;
  const coreMetrics = uniqueItems(dashboard.metricSelection.selectedCoreMetricIds);
  const supportSignals = uniqueItems(dashboard.metricSelection.selectedSupportMetricIds);
  const safetySignals = uniqueItems(dashboard.metricSelection.selectedSafetyMetricIds);
  const requiredDoneCount = [
    selectedEvidenceCardCount >= 1,
    Object.values(result.decisions).some((decision) => decision.missingInfo.trim()),
    Object.values(result.decisions).some((decision) => decision.nextCheck.trim()),
  ].filter(Boolean).length;
  const hasDashboardMetric = Boolean(
    dashboard.updatedAt ||
    coreMetrics.length ||
    supportSignals.length ||
    safetySignals.length,
  );

  return {
    requiredDoneCount,
    selectedEvidenceCardCount,
    hasDashboardMetric,
    coreMetrics,
    supportSignals,
    safetySignals,
    metricRationale: dashboard.metricSelection.metricRationale.trim(),
    savedStateLabel: result.updatedAt ? '메모 남김' : '아직 비어 있음',
    aiDraftLabel: result.rawAiSignalResult.trim() ? 'AI 초안 있음' : 'AI 초안 없음',
  };
}

export function V39CustomerJudgmentUxLab() {
  const status = getV39CustomerJudgmentStatus();

  return (
    <section className="space-y-4">
      <V39FlowStrip currentStep={6} />
      <V39StepHero
        eyebrow="6단계 · 고객 기록에서 단서를 찾습니다"
        icon="🔎"
        title="방문·면담 기록에서 먼저 확인할 단서만 고릅니다"
        tone="sky"
        description={(
          <>
            5단계에서 정한 지표를 다시 설명할 필요는 없습니다. 지금은 고객 활동 기록을 보며 “무엇을 더 봐야 하는지”, “무엇을 섣불리 믿으면 안 되는지”, “팀원에게 무엇을 물어봐야 하는지”만 남깁니다. 고객군별로 어떻게 움직일지는 다음 화면에서 정합니다.
          </>
        )}
        badges={[
          { label: '지금 남긴 것', value: `${status.requiredDoneCount} / 3`, tone: 'emerald', icon: '✅' },
          { label: '고른 단서 카드', value: `${status.selectedEvidenceCardCount}개`, tone: 'sky', icon: '🔎' },
          { label: '메모 상태', value: status.savedStateLabel, tone: 'violet', icon: '📝' },
        ]}
      />

      <section className="rounded-3xl border border-cyan-100 bg-white p-4 shadow-sm md:p-5">
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
          <p className="font-black">지표가 현장 행동으로 바뀌는 흐름입니다</p>
          <p className="mt-1">6단계에서는 고객 활동 기록에서 볼 단서를 고릅니다. 7단계에서는 그 단서를 보고 이번 2주 동안 어떻게 움직일지 정합니다. 8단계에서는 이 대응 방향을 실행으로 옮기기 위해 먼저 1on1로 맞춰볼 코칭 대상을 고릅니다.</p>
        </div>

        <div className="mt-3 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
          <p className="font-black text-slate-950">5단계에서 가져온 관리 지표</p>
          <p className="mt-1">이번 지표를 확인할 고객 Data 증거를 고르기 전에 먼저 봅니다. 아래 지표와 신호를 고객 활동 기록에서 어떻게 확인할지 생각한 뒤, Block 1의 증거 카드를 선택하세요.</p>
          {status.hasDashboardMetric ? (
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-white bg-cyan-50 px-4 py-3">
                <p className="font-black text-cyan-950">🎯 핵심 관리 지표</p>
                <MetricChipList items={status.coreMetrics} emptyText="아직 핵심 관리 지표가 없습니다." />
              </div>
              <div className="rounded-2xl border border-white bg-emerald-50 px-4 py-3">
                <p className="font-black text-emerald-950">🔎 함께 볼 현장 신호</p>
                <MetricChipList items={status.supportSignals} emptyText="함께 볼 현장 신호가 아직 없습니다." />
              </div>
              <div className="rounded-2xl border border-white bg-amber-50 px-4 py-3">
                <p className="font-black text-amber-950">⚠️ 조심할 해석</p>
                <MetricChipList items={status.safetySignals} emptyText="조심할 해석이 아직 없습니다." />
              </div>
            </div>
          ) : (
            <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
              5단계에서 선택한 관리 지표가 아직 없습니다. 지금도 아래에서 직접 단서를 고를 수 있지만, 먼저 5단계에서 이번 2주 동안 볼 지표를 정하면 선택 기준이 더 분명해집니다.
            </div>
          )}
          {status.metricRationale ? <p className="mt-3 rounded-2xl bg-white/70 px-3 py-2 text-xs font-bold leading-5 text-slate-700">선택 이유: {status.metricRationale}</p> : null}
        </div>

        <div className="mt-3">
          <V39ActionTriplet
            previous={{
              icon: '🎯',
              title: status.hasDashboardMetric ? '5단계에서 정한 관리 지표가 있습니다' : '5단계 지표가 이 화면의 기준이 됩니다',
              body: status.hasDashboardMetric ? '앞에서 고른 지표와 현장 신호를 고객 활동 기록에서 확인합니다.' : '관리 지표를 먼저 고르면 어떤 기록을 봐야 할지 더 분명해집니다.',
            }}
            current={{
              icon: '🔎',
              title: '고객 활동 기록에서 단서를 찾습니다',
              body: '먼저 볼 단서, 아직 부족한 정보, 팀원에게 물어볼 질문을 정리합니다.',
            }}
            next={{
              icon: '🧭',
              title: '7단계에서 2주 행동 방향을 잡습니다',
              body: '여기서 남긴 단서와 질문이 다음 화면의 행동 방향을 정하는 재료가 됩니다.',
            }}
          />
        </div>

        <div className="mt-3">
          <V39MinimumChecklist items={['단서 카드 1개', '아직 부족한 정보 1개', '팀원에게 물어볼 질문 1개']} />
        </div>

        <div className="mt-3">
          <V39SafetyStrip>
            고객에게 점수를 매기거나 줄 세우는 시간이 아닙니다. 기록에서 보이는 작은 신호를 보고, 무엇을 기회로 볼지, 무엇은 아직 더 확인해야 할지, 어떤 표현은 조심해야 할지만 남기면 됩니다.
          </V39SafetyStrip>
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
