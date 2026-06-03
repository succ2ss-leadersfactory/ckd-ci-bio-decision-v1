import { useMemo, useState } from 'react';
import { V38DashboardAnalysisLab } from './journey-v38-dashboard-analysis-lab';
import {
  clearV39DashboardResult,
  loadV39DashboardResult,
  saveV39DashboardResult,
  V39_DASHBOARD_RESULT_SCHEMA_VERSION,
  V39_DASHBOARD_RESULT_STORAGE_KEY,
  type V39DashboardResult,
} from './journey-v39-dashboard-result-store';

function splitLines(text: string) {
  return text.split('\n').map((item) => item.trim()).filter(Boolean);
}

function splitComma(text: string) {
  return text.split(',').map((item) => item.trim()).filter(Boolean);
}

export function V39DashboardAnalysisLab() {
  const [savedResult, setSavedResult] = useState(() => loadV39DashboardResult());
  const [status, setStatus] = useState('');
  const [teamSituationsDraft, setTeamSituationsDraft] = useState('');
  const [coreMetricDraft, setCoreMetricDraft] = useState('');
  const [supportMetricDraft, setSupportMetricDraft] = useState('');
  const [safetyMetricDraft, setSafetyMetricDraft] = useState('');
  const [metricRationaleDraft, setMetricRationaleDraft] = useState('');
  const [memberTypeDraft, setMemberTypeDraft] = useState('');
  const [memberSignalDraft, setMemberSignalDraft] = useState('');
  const [finalPrepDraft, setFinalPrepDraft] = useState('');

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

  const saveManualResult = () => {
    const selectedMemberTypeIds = splitComma(memberTypeDraft).slice(0, 2);
    const memberPreps = Object.fromEntries(
      selectedMemberTypeIds.map((memberId) => [
        memberId,
        {
          observedSignal: memberSignalDraft,
          strengthSignal: '',
          concernSignal: '',
          checkQuestion: '',
          doNotAssume: '',
          aiDraft: '',
          finalPrep: finalPrepDraft,
        },
      ]),
    );

    const next: V39DashboardResult = {
      schemaVersion: V39_DASHBOARD_RESULT_SCHEMA_VERSION,
      updatedAt: '',
      teamSituations: splitLines(teamSituationsDraft).slice(0, 3),
      metricResult: {
        rawAiMetricSuggestion: '',
        aiRecommendedCoreMetrics: coreMetricDraft,
        aiRecommendedSupportMetrics: supportMetricDraft,
        aiRecommendedSafetyMetrics: safetyMetricDraft,
        fitForOurTeam: '',
        excludedMetrics: '',
        additionalMetricIdea: '',
        aiRecommendedQuestions: '',
        parseNotice: 'v39 manual save panel에서 저장한 결과입니다.',
      },
      metricSelection: {
        selectedCoreMetricIds: splitComma(coreMetricDraft).slice(0, 3),
        selectedSupportMetricIds: splitComma(supportMetricDraft).slice(0, 2),
        selectedSafetyMetricIds: splitComma(safetyMetricDraft).slice(0, 1),
        metricRationale: metricRationaleDraft,
      },
      memberResult: {
        selectedMemberTypeIds,
        rawAiSignalResult: memberSignalDraft,
        memberSplitNotice: 'v39 manual save panel에서 저장한 선택 유형 신호입니다.',
        memberPreps,
        selectedDeliverables: {},
        rawAiPrepResult: finalPrepDraft,
        prepSplitNotice: 'v39 manual save panel에서 저장한 다음 행동 준비물입니다.',
      },
    };

    saveV39DashboardResult(next);
    setSavedResult(loadV39DashboardResult());
    setStatus('v39 5단계 핵심 결과를 localStorage에 저장했습니다. 다음 개발에서 이 결과를 8단계와 강사용 대시보드에 연결합니다.');
  };

  const saveEmptyBaseline = () => {
    saveV39DashboardResult({
      schemaVersion: V39_DASHBOARD_RESULT_SCHEMA_VERSION,
      updatedAt: '',
      teamSituations: [],
      metricResult: {
        rawAiMetricSuggestion: '',
        aiRecommendedCoreMetrics: '',
        aiRecommendedSupportMetrics: '',
        aiRecommendedSafetyMetrics: '',
        fitForOurTeam: '',
        excludedMetrics: '',
        additionalMetricIdea: '',
        aiRecommendedQuestions: '',
        parseNotice: '',
      },
      metricSelection: {
        selectedCoreMetricIds: [],
        selectedSupportMetricIds: [],
        selectedSafetyMetricIds: [],
        metricRationale: '',
      },
      memberResult: {
        selectedMemberTypeIds: [],
        rawAiSignalResult: '',
        memberSplitNotice: '',
        memberPreps: {},
        selectedDeliverables: {},
        rawAiPrepResult: '',
        prepSplitNotice: '',
      },
    });
    setSavedResult(loadV39DashboardResult());
    setStatus('v39 저장 구조 초기화 테스트를 완료했습니다.');
  };

  const clearBaseline = () => {
    clearV39DashboardResult();
    setSavedResult(loadV39DashboardResult());
    setStatus('v39 저장 구조를 비웠습니다.');
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
              아래 패널은 v39 전용 저장 연결 실험 영역이며, 실제 교육 화면의 v38 5단계는 하단에서 그대로 확인할 수 있습니다.
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

        <div className="mt-4 rounded-2xl border border-indigo-100 bg-white p-4">
          <h3 className="text-sm font-black text-slate-950">v39 5단계 핵심 결과 수동 저장 패널</h3>
          <p className="mt-1 text-xs font-bold leading-5 text-slate-600">먼저 수동 저장으로 데이터 구조를 안정화한 뒤, 다음 단계에서 v38 5단계 내부 상태와 자동 연결합니다.</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-xs font-black text-slate-600">우리 팀 상황, 줄바꿈으로 최대 3개</span>
              <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm" value={teamSituationsDraft} onChange={(event) => setTeamSituationsDraft(event.target.value)} />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-black text-slate-600">핵심 지표, 쉼표로 최대 3개</span>
              <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm" value={coreMetricDraft} onChange={(event) => setCoreMetricDraft(event.target.value)} />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-black text-slate-600">보완 지표, 쉼표로 최대 2개</span>
              <textarea className="min-h-20 w-full rounded-2xl border px-3 py-2 text-sm" value={supportMetricDraft} onChange={(event) => setSupportMetricDraft(event.target.value)} />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-black text-slate-600">안전선 지표, 쉼표로 최대 1개</span>
              <textarea className="min-h-20 w-full rounded-2xl border px-3 py-2 text-sm" value={safetyMetricDraft} onChange={(event) => setSafetyMetricDraft(event.target.value)} />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-black text-slate-600">지표 선택 이유</span>
              <textarea className="min-h-20 w-full rounded-2xl border px-3 py-2 text-sm" value={metricRationaleDraft} onChange={(event) => setMetricRationaleDraft(event.target.value)} />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-black text-slate-600">선택 유형 ID, 쉼표로 최대 2개</span>
              <input className="w-full rounded-2xl border px-3 py-2 text-sm" value={memberTypeDraft} onChange={(event) => setMemberTypeDraft(event.target.value)} placeholder="예: park-jaeuk, moon-gyowon" />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-black text-slate-600">선택 유형 신호 요약</span>
              <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm" value={memberSignalDraft} onChange={(event) => setMemberSignalDraft(event.target.value)} />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-black text-slate-600">최종 다음 행동 준비물</span>
              <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm" value={finalPrepDraft} onChange={(event) => setFinalPrepDraft(event.target.value)} />
            </label>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="rounded-full bg-indigo-700 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-indigo-800" onClick={saveManualResult}>v39 5단계 결과 저장</button>
          <button type="button" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-slate-800" onClick={saveEmptyBaseline}>v39 저장 구조 초기화 테스트</button>
          <button type="button" className="rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-black text-indigo-700 shadow-sm hover:bg-indigo-50" onClick={clearBaseline}>v39 저장 구조 비우기</button>
        </div>

        {status ? <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-indigo-800 shadow-sm">{status}</p> : null}
        {savedResult.updatedAt ? <p className="mt-3 text-xs font-bold text-slate-500">마지막 저장 시각: {savedResult.updatedAt}</p> : null}
      </section>

      <V38DashboardAnalysisLab />
    </div>
  );
}
