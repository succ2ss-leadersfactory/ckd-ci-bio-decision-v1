import { useMemo, useState } from 'react';
import { V38DashboardAnalysisLab } from './journey-v38-dashboard-analysis-lab';
import {
  clearV39DashboardResult,
  loadV39DashboardResult,
  saveV39DashboardResult,
  V39_DASHBOARD_RESULT_SCHEMA_VERSION,
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
        parseNotice: '팀 실행진단 메모 영역에서 저장한 결과입니다.',
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
        memberSplitNotice: '팀 실행진단 메모 영역에서 저장한 선택 유형 신호입니다.',
        memberPreps,
        selectedDeliverables: {},
        rawAiPrepResult: finalPrepDraft,
        prepSplitNotice: '팀 실행진단 메모 영역에서 저장한 다음 행동 준비물입니다.',
      },
    };

    saveV39DashboardResult(next);
    setSavedResult(loadV39DashboardResult());
    setStatus('입력 내용을 저장했습니다. 다음 단계에서 팀원 역할 배정 참고자료로 활용됩니다.');
  };

  const clearSavedResult = () => {
    clearV39DashboardResult();
    setSavedResult(loadV39DashboardResult());
    setStatus('저장된 입력 내용을 비웠습니다. 필요하면 다시 작성해 주세요.');
  };

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-indigo-100 bg-indigo-50 p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-indigo-700">Team Execution Memo</p>
            <h2 className="mt-2 text-xl font-black text-slate-950">팀 실행진단 메모</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              아래 메모는 5단계 팀 실행진단 결과를 정리해 두는 공간입니다. 입력한 내용은 이후 팀원 역할 배정 단계에서 참고자료로 활용됩니다.
              실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다.
            </p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-xs font-black text-indigo-700 shadow-sm">
            다음 단계 참고자료
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-3 text-sm shadow-sm">
            <p className="text-xs font-black text-slate-500">팀 상황 메모</p>
            <p className="mt-1 font-black text-slate-900">{savedSummary.teamSituationCount}개 저장됨</p>
          </div>
          <div className="rounded-2xl bg-white p-3 text-sm shadow-sm">
            <p className="text-xs font-black text-slate-500">지표 메모</p>
            <p className="mt-1 font-black text-slate-900">{savedSummary.selectedMetricCount}개 저장됨</p>
          </div>
          <div className="rounded-2xl bg-white p-3 text-sm shadow-sm">
            <p className="text-xs font-black text-slate-500">팀원 유형 메모</p>
            <p className="mt-1 font-black text-slate-900">{savedSummary.selectedMemberCount}명 저장됨</p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-indigo-100 bg-white p-4">
          <h3 className="text-sm font-black text-slate-950">팀 실행진단 핵심 메모</h3>
          <p className="mt-1 text-xs font-bold leading-5 text-slate-600">
            먼저 팀 상황과 실행 지표를 자기 언어로 정리해 보세요. 정답을 찾는 단계가 아니라, 다음 단계에서 팀원 역할을 더 구체화하기 위한 판단 근거를 남기는 단계입니다.
          </p>
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
              <span className="text-xs font-black text-slate-600">주목할 팀원 유형, 쉼표로 최대 2명</span>
              <input className="w-full rounded-2xl border px-3 py-2 text-sm" value={memberTypeDraft} onChange={(event) => setMemberTypeDraft(event.target.value)} placeholder="예: 후속 대화 필요, 실행 기록 지원 필요" />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-black text-slate-600">팀원 유형 신호 요약</span>
              <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm" value={memberSignalDraft} onChange={(event) => setMemberSignalDraft(event.target.value)} />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-black text-slate-600">다음 행동 준비물</span>
              <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm" value={finalPrepDraft} onChange={(event) => setFinalPrepDraft(event.target.value)} />
            </label>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="rounded-full bg-indigo-700 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-indigo-800" onClick={saveManualResult}>입력 내용 저장</button>
          <button type="button" className="rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-black text-indigo-700 shadow-sm hover:bg-indigo-50" onClick={clearSavedResult}>저장 내용 비우기</button>
        </div>

        {status ? <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-indigo-800 shadow-sm">{status}</p> : null}
        {savedResult.updatedAt ? <p className="mt-3 text-xs font-bold text-slate-500">마지막 저장 시각: {savedResult.updatedAt}</p> : null}
      </section>

      <V38DashboardAnalysisLab />
    </div>
  );
}
