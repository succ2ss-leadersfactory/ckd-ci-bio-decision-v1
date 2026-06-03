import { useMemo, useState } from 'react';
import { V38DashboardAnalysisLab } from './journey-v38-dashboard-analysis-lab';
import {
  clearV39DashboardResult,
  createEmptyV39DashboardResult,
  loadV39DashboardResult,
  saveV39DashboardResult,
  V39_DASHBOARD_RESULT_SCHEMA_VERSION,
  V39_DASHBOARD_RESULT_STORAGE_KEY,
} from './journey-v39-dashboard-result-store';

export function V39DashboardAnalysisLab() {
  const [savedResult, setSavedResult] = useState(() => loadV39DashboardResult());
  const [status, setStatus] = useState('');

  const savedSummary = useMemo(() => {
    const selectedMemberCount = savedResult.memberResult.selectedMemberTypeIds.length;
    const selectedMetricCount =
      savedResult.metricSelection.selectedCoreMetricIds.length +
      savedResult.metricSelection.selectedSupportMetricIds.length +
      savedResult.metricSelection.selectedSafetyMetricIds.length;

    return {
      teamSituationCount: savedResult.teamSituations.length,
      selectedMetricCount,
      selectedMemberCount,
      hasUpdatedAt: Boolean(savedResult.updatedAt),
    };
  }, [savedResult]);

  const saveEmptyBaseline = () => {
    const next = createEmptyV39DashboardResult();
    saveV39DashboardResult(next);
    setSavedResult(loadV39DashboardResult());
    setStatus('v39 5단계 결과 저장 구조가 localStorage에 초기화되었습니다. 다음 개발에서 실제 선택 결과를 연결합니다.');
  };

  const clearBaseline = () => {
    clearV39DashboardResult();
    setSavedResult(loadV39DashboardResult());
    setStatus('v39 5단계 결과 저장 구조를 초기화했습니다.');
  };

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-indigo-100 bg-indigo-50 p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-indigo-700">v39 Dashboard Result Bridge</p>
            <h2 className="mt-2 text-xl font-black text-slate-950">5단계 결과 저장 구조 준비</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              v39는 v38의 팀원 실행진단 화면을 유지하면서, 이후 8단계와 강사용 대시보드가 읽을 수 있는 결과 저장 구조를 먼저 준비합니다.
              현재 버튼은 저장 구조 자체를 검증하기 위한 안전한 초기화 기능이며, 실제 5단계 선택 결과 연결은 다음 개발 단계에서 진행합니다.
            </p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-xs font-black text-indigo-700 shadow-sm">
            {V39_DASHBOARD_RESULT_SCHEMA_VERSION}
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-3 text-sm shadow-sm">
            <p className="text-xs font-black text-slate-500">저장 Key</p>
            <p className="mt-1 break-all font-black text-slate-900">{V39_DASHBOARD_RESULT_STORAGE_KEY}</p>
          </div>
          <div className="rounded-2xl bg-white p-3 text-sm shadow-sm">
            <p className="text-xs font-black text-slate-500">상황 선택</p>
            <p className="mt-1 font-black text-slate-900">{savedSummary.teamSituationCount}개 저장됨</p>
          </div>
          <div className="rounded-2xl bg-white p-3 text-sm shadow-sm">
            <p className="text-xs font-black text-slate-500">지표 선택</p>
            <p className="mt-1 font-black text-slate-900">{savedSummary.selectedMetricCount}개 저장됨</p>
          </div>
          <div className="rounded-2xl bg-white p-3 text-sm shadow-sm">
            <p className="text-xs font-black text-slate-500">유형 선택</p>
            <p className="mt-1 font-black text-slate-900">{savedSummary.selectedMemberCount}명 저장됨</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-full bg-indigo-700 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-indigo-800"
            onClick={saveEmptyBaseline}
          >
            v39 저장 구조 초기화 테스트
          </button>
          <button
            type="button"
            className="rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-black text-indigo-700 shadow-sm hover:bg-indigo-50"
            onClick={clearBaseline}
          >
            v39 저장 구조 비우기
          </button>
        </div>

        {status ? <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-indigo-800 shadow-sm">{status}</p> : null}
        {savedResult.updatedAt ? <p className="mt-3 text-xs font-bold text-slate-500">마지막 저장 시각: {savedResult.updatedAt}</p> : null}
      </section>

      <V38DashboardAnalysisLab />
    </div>
  );
}
