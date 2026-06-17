import { loadV39CustomerJudgmentResult } from './journey-v39-customer-judgment-result-store';
import { V39CustomerJudgmentLab } from './journey-v39-customer-judgment-lab';
import { loadV39DashboardResult } from './journey-v39-dashboard-result-store';
import { V39ActionTriplet, V39FlowStrip, V39MinimumChecklist, V39SafetyStrip, V39StepHero } from './journey-v39-ux-components';

const V39_CUSTOMER_JUDGMENT_HUMANIZED_SMOKE_MARKERS = [
  'V39CustomerJudgmentHumanizedUxLab',
  '기록을 보며 다음에 뭘 확인할지 남깁니다',
  '앞에서 고른 기준',
  '다시 볼 단서',
  '아직 모르는 것',
  '팀원에게 물어볼 질문',
  '8단계에서는 먼저 1on1로 맞춰볼 코칭 대상을 고릅니다',
].join('|');
void V39_CUSTOMER_JUDGMENT_HUMANIZED_SMOKE_MARKERS;

function uniqueItems(items: string[]) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function ChipList({ items, emptyText }: { items: string[]; emptyText: string }) {
  const visibleItems = uniqueItems(items);
  if (visibleItems.length === 0) return <p className="mt-2 rounded-2xl bg-white/70 px-3 py-2 text-xs font-bold leading-5 text-slate-500">{emptyText}</p>;

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {visibleItems.map((item) => <span key={item} className="rounded-full bg-white px-3 py-1 text-xs font-black leading-5 text-slate-800 shadow-sm">{item}</span>)}
    </div>
  );
}

function getStatus() {
  const result = loadV39CustomerJudgmentResult();
  const dashboard = loadV39DashboardResult();
  const coreMetrics = uniqueItems(dashboard.metricSelection.selectedCoreMetricIds);
  const supportSignals = uniqueItems(dashboard.metricSelection.selectedSupportMetricIds);
  const safetySignals = uniqueItems(dashboard.metricSelection.selectedSafetyMetricIds);
  const memoCount = [
    result.selectedCustomerTypeIds.length >= 1,
    Object.values(result.decisions).some((decision) => decision.missingInfo.trim()),
    Object.values(result.decisions).some((decision) => decision.nextCheck.trim()),
  ].filter(Boolean).length;

  return {
    memoCount,
    selectedEvidenceCount: result.selectedCustomerTypeIds.length,
    hasMetric: Boolean(dashboard.updatedAt || coreMetrics.length || supportSignals.length || safetySignals.length),
    coreMetrics,
    supportSignals,
    safetySignals,
    metricRationale: dashboard.metricSelection.metricRationale.trim(),
    savedStateLabel: result.updatedAt ? '메모 있음' : '아직 비어 있음',
  };
}

export function V39CustomerJudgmentHumanizedUxLab() {
  const status = getStatus();

  return (
    <section className="space-y-4">
      <V39FlowStrip currentStep={6} />
      <V39StepHero
        eyebrow="6단계 · 고객 기록 다시 보기"
        icon="🔎"
        title="기록을 보며 다음에 뭘 확인할지 남깁니다"
        tone="sky"
        description="여기서는 고객을 판단하지 않습니다. 앞에서 고른 기준을 놓고 고객 활동 기록에서 다시 볼 단서, 아직 모르는 것, 팀원에게 물어볼 질문만 추립니다. 어디부터 움직일지는 다음 화면에서 정합니다."
        badges={[
          { label: '남긴 메모', value: `${status.memoCount} / 3`, tone: 'emerald', icon: '✅' },
          { label: '고른 단서', value: `${status.selectedEvidenceCount}개`, tone: 'sky', icon: '🔎' },
          { label: '상태', value: status.savedStateLabel, tone: 'violet', icon: '📝' },
        ]}
      />

      <section className="rounded-3xl border border-cyan-100 bg-white p-4 shadow-sm md:p-5">
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
          <p className="font-black">지표를 고른 다음에는 기록을 다시 봐야 합니다</p>
          <p className="mt-1">고객 활동 기록에서 다시 볼 단서를 고릅니다. 다음 화면에서는 그 단서를 보고 2주 동안 어디부터 확인할지 정합니다. 그다음에는 그 일을 움직이게 하려면 누구와 먼저 이야기해야 할지 고릅니다.</p>
        </div>

        <div className="mt-3 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
          <p className="font-black text-slate-950">앞에서 고른 기준</p>
          <p className="mt-1">아래 기준이 고객 기록에서 어떤 모습으로 남아 있는지 봅니다. 기록이 충분한지, 빠진 정보가 있는지, 너무 빨리 단정한 것은 아닌지 확인합니다.</p>
          {status.hasMetric ? (
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-white bg-cyan-50 px-4 py-3"><p className="font-black text-cyan-950">🎯 핵심 지표</p><ChipList items={status.coreMetrics} emptyText="아직 핵심 지표가 없습니다." /></div>
              <div className="rounded-2xl border border-white bg-emerald-50 px-4 py-3"><p className="font-black text-emerald-950">🔎 같이 볼 신호</p><ChipList items={status.supportSignals} emptyText="같이 볼 신호가 아직 없습니다." /></div>
              <div className="rounded-2xl border border-white bg-amber-50 px-4 py-3"><p className="font-black text-amber-950">⚠️ 조심할 부분</p><ChipList items={status.safetySignals} emptyText="조심할 부분이 아직 없습니다." /></div>
            </div>
          ) : (
            <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">5단계에서 고른 지표가 아직 없습니다. 지금도 아래에서 직접 단서를 고를 수 있지만, 먼저 이번 2주 동안 볼 기준을 정하면 기록을 훨씬 선명하게 볼 수 있습니다.</div>
          )}
          {status.metricRationale ? <p className="mt-3 rounded-2xl bg-white/70 px-3 py-2 text-xs font-bold leading-5 text-slate-700">선택 이유: {status.metricRationale}</p> : null}
        </div>

        <div className="mt-3">
          <V39ActionTriplet
            previous={{ icon: '🎯', title: status.hasMetric ? '앞에서 고른 기준이 있습니다' : '앞에서 고른 기준이 필요합니다', body: status.hasMetric ? '그 기준이 고객 활동 기록에서 어떻게 보이는지 확인합니다.' : '먼저 기준을 고르면 어떤 기록을 다시 봐야 할지 분명해집니다.' }}
            current={{ icon: '🔎', title: '기록에서 단서를 고릅니다', body: '다시 볼 단서, 아직 모르는 것, 팀원에게 물어볼 질문을 남깁니다.' }}
            next={{ icon: '🧭', title: '다음 화면에서 2주 방향을 잡습니다', body: '여기서 남긴 단서와 질문이 다음 화면의 움직일 방향이 됩니다.' }}
          />
        </div>

        <div className="mt-3"><V39MinimumChecklist items={['다시 볼 단서 1개', '아직 모르는 것 1개', '팀원에게 물어볼 질문 1개']} /></div>
        <div className="mt-3"><V39SafetyStrip>고객에게 이름표를 붙이는 시간이 아닙니다. 기록에 남은 작은 신호를 보고, 무엇은 기회로 볼 수 있는지, 무엇은 아직 더 확인해야 하는지, 어떤 표현은 조심해야 하는지만 남기면 됩니다.</V39SafetyStrip></div>
      </section>

      <div className="v39-customer-judgment-core">
        <style>{`.v39-customer-judgment-core > section > section:nth-child(1), .v39-customer-judgment-core > section > section:nth-child(2) { display: none; }`}</style>
        <V39CustomerJudgmentLab />
      </div>
    </section>
  );
}
