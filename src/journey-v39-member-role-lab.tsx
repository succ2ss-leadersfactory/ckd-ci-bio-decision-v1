import { useMemo, useState } from 'react';
import { V38MemberRoleLab } from './journey-v38-member-role-lab';
import { loadV39DashboardResult } from './journey-v39-dashboard-result-store';

function joinOrEmpty(items: string[]) {
  return items.length > 0 ? items.join(' / ') : '아직 저장된 값이 없습니다';
}

export function V39MemberRoleLab() {
  const [dashboardResult, setDashboardResult] = useState(() => loadV39DashboardResult());

  const summary = useMemo(() => {
    const selectedMetricCount =
      dashboardResult.metricSelection.selectedCoreMetricIds.length +
      dashboardResult.metricSelection.selectedSupportMetricIds.length +
      dashboardResult.metricSelection.selectedSafetyMetricIds.length;

    return {
      teamSituationCount: dashboardResult.teamSituations.length,
      selectedMetricCount,
      selectedMemberCount: dashboardResult.memberResult.selectedMemberTypeIds.length,
      coreMetrics: joinOrEmpty(dashboardResult.metricSelection.selectedCoreMetricIds),
      supportMetrics: joinOrEmpty(dashboardResult.metricSelection.selectedSupportMetricIds),
      safetyMetrics: joinOrEmpty(dashboardResult.metricSelection.selectedSafetyMetricIds),
      selectedMembers: joinOrEmpty(dashboardResult.memberResult.selectedMemberTypeIds),
      memberSignal: dashboardResult.memberResult.rawAiSignalResult || '아직 저장된 신호 요약이 없습니다',
      finalPrep: dashboardResult.memberResult.rawAiPrepResult || '아직 저장된 다음 행동 준비물이 없습니다',
      hasSavedResult: Boolean(dashboardResult.updatedAt),
    };
  }, [dashboardResult]);

  const refreshDashboardResult = () => {
    setDashboardResult(loadV39DashboardResult());
  };

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-violet-100 bg-violet-50 p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-violet-700">v39 Step 5 → Step 8 Bridge</p>
            <h2 className="mt-2 text-xl font-black text-slate-950">5단계 저장 결과를 팀원 역할 방향에 연결</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              이 패널은 5단계에서 저장한 팀 상황, 실행지표, 선택 유형, 다음 행동 준비물을 8단계 역할 배정 전에 다시 보여줍니다.
              아직 자동 배정은 하지 않고, 팀장이 역할 방향을 정하기 전에 판단 근거를 확인하도록 돕습니다.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full bg-violet-700 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-violet-800"
            onClick={refreshDashboardResult}
          >
            5단계 저장 결과 새로고침
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-black text-slate-500">저장 상태</p>
            <p className="mt-1 text-sm font-black text-slate-900">{summary.hasSavedResult ? '저장 결과 있음' : '저장 결과 없음'}</p>
            {dashboardResult.updatedAt ? <p className="mt-1 text-xs font-bold text-slate-500">{dashboardResult.updatedAt}</p> : null}
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-black text-slate-500">상황·지표·유형</p>
            <p className="mt-1 text-sm font-black text-slate-900">상황 {summary.teamSituationCount}개 · 지표 {summary.selectedMetricCount}개 · 유형 {summary.selectedMemberCount}명</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-black text-slate-500">선택 유형</p>
            <p className="mt-1 text-sm font-black text-slate-900">{summary.selectedMembers}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-black text-slate-500">핵심 지표</p>
            <p className="mt-1 text-sm font-bold leading-6 text-slate-800">{summary.coreMetrics}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-black text-slate-500">보완 지표</p>
            <p className="mt-1 text-sm font-bold leading-6 text-slate-800">{summary.supportMetrics}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-black text-slate-500">안전선 지표</p>
            <p className="mt-1 text-sm font-bold leading-6 text-slate-800">{summary.safetyMetrics}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-black text-slate-500">지표 선택 이유</p>
            <p className="mt-1 text-sm font-bold leading-6 text-slate-800">{dashboardResult.metricSelection.metricRationale || '아직 저장된 이유가 없습니다'}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm md:col-span-2">
            <p className="text-xs font-black text-slate-500">선택 유형 신호 요약</p>
            <p className="mt-1 whitespace-pre-wrap text-sm font-bold leading-6 text-slate-800">{summary.memberSignal}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm md:col-span-2">
            <p className="text-xs font-black text-slate-500">최종 다음 행동 준비물</p>
            <p className="mt-1 whitespace-pre-wrap text-sm font-bold leading-6 text-slate-800">{summary.finalPrep}</p>
          </div>
        </div>
      </section>

      <V38MemberRoleLab />
    </div>
  );
}
