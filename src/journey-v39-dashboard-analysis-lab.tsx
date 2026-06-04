import { useEffect, useMemo, useState } from 'react';
import {
  V38_ACTION_OUTPUT_OPTIONS as ACTION_OUTPUT_OPTIONS,
  V38_FORBIDDEN_ITEMS as FORBIDDEN_ITEMS,
  V38_SUGGESTED_DELIVERABLES_BY_MEMBER_ID,
  V38_TEAM_MEMBERS as TEAM_MEMBERS,
  type V38TeamMember,
} from './journey-v38-dashboard-analysis-data';
import {
  createEmptyV38MemberPrep as emptyPrep,
  parseV38AiMetricSuggestion as parseAiMetricSuggestion,
  parseV38AiPrepDraftByMember,
  parseV38AiSignalResultByMember,
  type V38MemberPrep,
  type V38PrepState,
} from './journey-v38-dashboard-analysis-parsers';
import {
  buildV38PrepPrompt,
  buildV38SignalPrompt,
} from './journey-v38-dashboard-analysis-prompts';
import {
  V38ReviewTextarea as ReviewTextarea,
  V38TeamMemberCard as TeamMemberCard,
} from './journey-v38-dashboard-analysis-ui';
import { V38ActionDeliverablePicker as ActionDeliverablePicker } from './journey-v38-action-deliverable-picker';
import { V38FinalMemberPrepCard as FinalMemberPrepCard } from './journey-v38-final-member-prep-card';
import { V38SelectedMemberPrepPanel as SelectedMemberPrepPanel } from './journey-v38-selected-member-prep-panel';
import {
  createEmptyV39DashboardResult,
  saveV39DashboardResult,
} from './journey-v39-dashboard-result-store';

const V39_DASHBOARD_ANALYSIS_SMOKE_MARKERS = 'V38DashboardAnalysisLab';
void V39_DASHBOARD_ANALYSIS_SMOKE_MARKERS;

type TeamMember = V38TeamMember;
type MemberPrep = V38MemberPrep;
type PrepState = V38PrepState;
type DeliverableState = Record<string, string[]>;

const TEAM_SITUATION_OPTIONS = [
  '방문은 했는데, 다음 행동으로 이어지지 않는다',
  '관심 보이는 고객은 있는데, 어디부터 챙길지 헷갈린다',
  '팀원마다 움직이는 속도와 방식이 다르다',
  '늘 가던 고객만 챙기고, 새로 봐야 할 고객은 놓친다',
  '자료 설명은 했지만, 고객이 원하는 건 충분히 못 물었다',
];

const MAX_TEAM_SITUATIONS = 2;

function getSuggestedDeliverables(memberId: string) {
  return V38_SUGGESTED_DELIVERABLES_BY_MEMBER_ID[memberId] ?? [];
}

function parseAiSignalResultByMember(rawText: string) {
  return parseV38AiSignalResultByMember(rawText, TEAM_MEMBERS);
}

function parseAiPrepDraftByMember(rawText: string, members: TeamMember[]) {
  return parseV38AiPrepDraftByMember(rawText, members);
}

function buildV39MetricPrompt(teamSituations: string[], customSituation: string) {
  const customSituationLine = customSituation.trim();
  const situationLines = [
    ...teamSituations.map((item) => `- ${item}`),
    ...(customSituationLine ? [`- 우리 팀 추가 상황: ${customSituationLine}`] : []),
  ];

  return [
    '당신은 제약영업 팀장의 실행 판단을 돕는 리더십 코치입니다.',
    '이 실습은 정답을 찾는 것이 아니라, 팀장이 이번 2주 동안 무엇을 보고 어떻게 판단할지 연습하는 과정입니다.',
    '',
    '우리 팀 상황:',
    ...(situationLines.length > 0 ? situationLines : ['- 아직 선택하지 않았습니다.']),
    '',
    '중요한 반영 기준:',
    '- 참여자가 직접 쓴 “우리 팀 추가 상황”이 있으면 반드시 우선 반영해 주세요.',
    '- 선택 보기보다 직접 작성한 상황이 더 구체적이면, 직접 작성한 상황을 중심으로 판단해 주세요.',
    '- 각 항목에는 우리 팀 추가 상황이 어떤 판단에 영향을 주었는지 드러나게 써 주세요.',
    '',
    '아래 4가지만 현실적인 말로 짧게 정리해 주세요.',
    '',
    '## 1. 이번 2주에 꼭 볼 지표',
    '- 팀장이 가장 먼저 확인할 지표 1~2개',
    '- 왜 이 지표를 봐야 하는지 한 문장',
    '',
    '## 2. 함께 봐야 할 현장 신호',
    '- 숫자만으로는 놓칠 수 있는 팀원 또는 고객 반응의 신호 1~2개',
    '- 팀장이 무엇을 관찰해야 하는지 한 문장',
    '',
    '## 3. 조심해서 봐야 할 해석',
    '- 숫자나 반응을 잘못 해석할 수 있는 위험 1~2개',
    '- 성급하게 단정하지 않기 위해 볼 것 한 문장',
    '',
    '## 4. 팀장이 더 확인할 질문',
    '- 팀원이나 고객 반응을 보고 한 번 더 확인해야 할 질문 1~2개',
    '',
    '주의:',
    '- 정답처럼 말하지 마세요.',
    '- 평가나 점수처럼 보이게 쓰지 마세요.',
    '- 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 쓰지 마세요.',
    ...FORBIDDEN_ITEMS.map((item) => `- ${item}`),
    '- 팀장이 교육장에서 바로 이해할 수 있는 현실적인 문장으로 써 주세요.',
  ].join('\n');
}

export function V39DashboardAnalysisLab() {
  const [teamSituations, setTeamSituations] = useState<string[]>([]);
  const [customSituation, setCustomSituation] = useState('');
  const [aiMetricSuggestion, setAiMetricSuggestion] = useState('');
  const [parseNotice, setParseNotice] = useState('');
  const [aiRecommendedCoreMetrics, setAiRecommendedCoreMetrics] = useState('');
  const [aiRecommendedSupportMetrics, setAiRecommendedSupportMetrics] = useState('');
  const [aiRecommendedSafetyMetrics, setAiRecommendedSafetyMetrics] = useState('');
  const [aiRecommendedQuestions, setAiRecommendedQuestions] = useState('');
  const [finalCoreMetric, setFinalCoreMetric] = useState('');
  const [finalSupportSignal, setFinalSupportSignal] = useState('');
  const [finalCautionPoint, setFinalCautionPoint] = useState('');
  const [metricRationale, setMetricRationale] = useState('');
  const [selectedMemberTypeIds, setSelectedMemberTypeIds] = useState<string[]>([]);
  const [memberPreps, setMemberPreps] = useState<PrepState>({});
  const [aiSignalResult, setAiSignalResult] = useState('');
  const [memberSplitNotice, setMemberSplitNotice] = useState('');
  const [aiPrepResult, setAiPrepResult] = useState('');
  const [prepSplitNotice, setPrepSplitNotice] = useState('');
  const [selectedDeliverables, setSelectedDeliverables] = useState<DeliverableState>({});
  const [copiedPrompt, setCopiedPrompt] = useState<'metric' | 'signal' | 'prep' | null>(null);

  const selectedTeamMembers = useMemo(
    () => TEAM_MEMBERS.filter((member) => selectedMemberTypeIds.includes(member.id)),
    [selectedMemberTypeIds],
  );
  const signalPromptMembers = selectedTeamMembers.length > 0 ? selectedTeamMembers : TEAM_MEMBERS;

  const selectedMetricSummary = useMemo(
    () => [
      `이번 2주에 꼭 볼 지표: ${finalCoreMetric.trim() || '미작성'}`,
      `함께 봐야 할 현장 신호: ${finalSupportSignal.trim() || '미작성'}`,
      `조심해서 봐야 할 해석: ${finalCautionPoint.trim() || '미작성'}`,
    ],
    [finalCoreMetric, finalSupportSignal, finalCautionPoint],
  );

  const metricPrompt = useMemo(() => buildV39MetricPrompt(teamSituations, customSituation), [teamSituations, customSituation]);
  const signalPrompt = useMemo(
    () => buildV38SignalPrompt({
      selectedMetricSummary,
      metricRationale,
      aiRecommendedQuestions,
      selectedTeamMembers,
      signalPromptMembers,
      forbiddenItems: FORBIDDEN_ITEMS,
    }),
    [selectedMetricSummary, metricRationale, aiRecommendedQuestions, selectedTeamMembers, signalPromptMembers],
  );
  const prepPrompt = useMemo(
    () => buildV38PrepPrompt({
      selectedMetricSummary,
      aiSignalResult,
      memberPreps,
      selectedDeliverables,
      selectedTeamMembers,
      forbiddenItems: FORBIDDEN_ITEMS,
      actionOutputOptions: ACTION_OUTPUT_OPTIONS,
    }),
    [selectedMetricSummary, aiSignalResult, memberPreps, selectedDeliverables, selectedTeamMembers],
  );

  const finalMetricCount = [finalCoreMetric, finalSupportSignal, finalCautionPoint].filter((value) => value.trim()).length;
  const completedSignalCount = selectedTeamMembers.filter((member) => {
    const current = memberPreps[member.id];
    return Boolean(current?.observedSignal || current?.concernSignal || current?.checkQuestion);
  }).length;
  const completedActionChoiceCount = selectedTeamMembers.filter((member) => (selectedDeliverables[member.id] ?? []).length > 0).length;
  const completedFinalCount = selectedTeamMembers.filter((member) => memberPreps[member.id]?.finalPrep).length;

  useEffect(() => {
    const nextResult = createEmptyV39DashboardResult();
    nextResult.teamSituations = [...teamSituations, ...(customSituation.trim() ? [`직접 작성: ${customSituation.trim()}`] : [])];
    nextResult.metricResult = {
      rawAiMetricSuggestion: aiMetricSuggestion,
      aiRecommendedCoreMetrics,
      aiRecommendedSupportMetrics,
      aiRecommendedSafetyMetrics,
      fitForOurTeam: [finalCoreMetric, finalSupportSignal].filter((value) => value.trim()).join('\n\n'),
      excludedMetrics: '',
      additionalMetricIdea: '',
      aiRecommendedQuestions,
      parseNotice,
    };
    nextResult.metricSelection = {
      selectedCoreMetricIds: finalCoreMetric.trim() ? [finalCoreMetric.trim()] : [],
      selectedSupportMetricIds: finalSupportSignal.trim() ? [finalSupportSignal.trim()] : [],
      selectedSafetyMetricIds: finalCautionPoint.trim() ? [finalCautionPoint.trim()] : [],
      metricRationale,
    };
    nextResult.memberResult = {
      selectedMemberTypeIds,
      rawAiSignalResult: aiSignalResult,
      memberSplitNotice,
      memberPreps,
      selectedDeliverables,
      rawAiPrepResult: aiPrepResult,
      prepSplitNotice,
    };
    saveV39DashboardResult(nextResult);
  }, [
    teamSituations,
    customSituation,
    aiMetricSuggestion,
    aiRecommendedCoreMetrics,
    aiRecommendedSupportMetrics,
    aiRecommendedSafetyMetrics,
    aiRecommendedQuestions,
    finalCoreMetric,
    finalSupportSignal,
    finalCautionPoint,
    metricRationale,
    parseNotice,
    selectedMemberTypeIds,
    aiSignalResult,
    memberSplitNotice,
    memberPreps,
    selectedDeliverables,
    aiPrepResult,
    prepSplitNotice,
  ]);

  const toggleTeamSituation = (value: string) =>
    setTeamSituations((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : current.length >= MAX_TEAM_SITUATIONS
          ? current
          : [...current, value],
    );

  const toggleMemberType = (memberId: string) =>
    setSelectedMemberTypeIds((current) =>
      current.includes(memberId)
        ? current.filter((id) => id !== memberId)
        : current.length >= 2
          ? current
          : [...current, memberId],
    );

  const updatePrep = (memberId: string, field: keyof MemberPrep, value: string) =>
    setMemberPreps((current) => ({
      ...current,
      [memberId]: { ...emptyPrep(), ...(current[memberId] ?? {}), [field]: value },
    }));

  const toggleDeliverable = (memberId: string, label: string) =>
    setSelectedDeliverables((current) => {
      const previous = current[memberId] ?? [];
      const next = previous.includes(label) ? previous.filter((item) => item !== label) : [...previous, label];
      return { ...current, [memberId]: next };
    });

  const copyPrompt = async (type: 'metric' | 'signal' | 'prep') => {
    try {
      await navigator.clipboard.writeText(type === 'metric' ? metricPrompt : type === 'signal' ? signalPrompt : prepPrompt);
      setCopiedPrompt(type);
      window.setTimeout(() => setCopiedPrompt(null), 1600);
    } catch {
      setCopiedPrompt(null);
    }
  };

  const applySuggestedDeliverables = (memberId: string) =>
    setSelectedDeliverables((current) => ({ ...current, [memberId]: getSuggestedDeliverables(memberId) }));

  const autoFillMetricSuggestion = () => {
    const parsed = parseAiMetricSuggestion(aiMetricSuggestion);
    setAiRecommendedCoreMetrics(parsed.core);
    setAiRecommendedSupportMetrics(parsed.support);
    setAiRecommendedSafetyMetrics(parsed.safety);
    setAiRecommendedQuestions(parsed.questions);
    setFinalCoreMetric((current) => current || parsed.core);
    setFinalSupportSignal((current) => current || parsed.support);
    setFinalCautionPoint((current) => current || parsed.safety);
    setParseNotice(
      parsed.warnings.length > 0
        ? `AI 초안을 옮겼습니다. 다만 ${parsed.warnings.length}개 항목은 자동으로 찾지 못했습니다. 아래 칸에서 직접 확인해 주세요.`
        : 'AI 초안을 옮겼습니다. 우리 팀 상황에 맞게 짧게 고쳐 쓰면 됩니다.',
    );
  };

  const autoFillMemberSignals = () => {
    if (selectedTeamMembers.length === 0) {
      setMemberSplitNotice('먼저 우리 팀에 존재하거나 비슷한 유형 2명을 선택해 주세요.');
      return;
    }
    const parsed = parseAiSignalResultByMember(aiSignalResult);
    setMemberPreps((current) => {
      const next = { ...current };
      for (const member of selectedTeamMembers) {
        if (parsed.preps[member.id]) next[member.id] = { ...emptyPrep(), ...(current[member.id] ?? {}), ...parsed.preps[member.id] };
      }
      return next;
    });
    const missingSelected = selectedTeamMembers.filter((member) => !parsed.preps[member.id]).map((member) => member.name);
    setMemberSplitNotice(
      missingSelected.length > 0
        ? `선택한 유형 중 ${missingSelected.join(', ')} 내용은 자동으로 찾지 못했습니다. 해당 입력칸을 직접 확인해 주세요.`
        : '선택한 2명 유형에 대해 자동 분리·채우기를 완료했습니다. 각 입력칸에서 현장 맥락에 맞게 수정하세요.',
    );
  };

  const autoFillPrepDrafts = () => {
    if (selectedTeamMembers.length === 0) {
      setPrepSplitNotice('먼저 우리 팀에 존재하거나 비슷한 유형 2명을 선택해 주세요.');
      return;
    }
    const parsed = parseAiPrepDraftByMember(aiPrepResult, selectedTeamMembers);
    setMemberPreps((current) => {
      const next = { ...current };
      for (const member of selectedTeamMembers) {
        if (parsed.drafts[member.id]) next[member.id] = { ...emptyPrep(), ...(current[member.id] ?? {}), aiDraft: parsed.drafts[member.id] };
      }
      return next;
    });
    setPrepSplitNotice(
      parsed.warnings.length > 0
        ? `AI 2차 결과 자동 채우기를 완료했습니다. 다만 ${parsed.warnings.length}개 영역은 찾지 못했습니다. 선택 유형별 초안 칸을 확인해 주세요.`
        : 'AI 2차 결과를 선택 유형별 준비물 초안 칸에 채웠습니다. 최종 준비물은 팀장 판단으로 수정해 확정하세요.',
    );
  };

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_21rem] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-blue-50 px-4 py-2 text-sm font-black text-blue-700">
              <span className="text-base">↗</span>
              <span>5단계 팀 실행진단</span>
            </div>
            <h2 className="mt-8 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">우리 팀 지표로 다음 행동 준비하기</h2>
            <p className="mt-6 max-w-4xl text-base font-bold leading-8 text-slate-600">
              정답을 찾는 화면이 아닙니다. 이번 2주 동안 팀장이 무엇을 보고, 무엇을 더 확인하고, 어떤 해석은 조심해야 할지 가볍게 정리합니다.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-black text-orange-950">상황 선택 {teamSituations.length} / 2</div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-black text-amber-950">최종 기준 {finalMetricCount} / 3</div>
            <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm font-black text-cyan-950">유형 선택 {selectedMemberTypeIds.length} / 2</div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-950">입력 내용은 자동 저장됩니다</div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-amber-700">Block 0</p>
        <h3 className="text-lg font-black text-slate-950">우리 팀 지표 정하기</h3>
        <p className="mt-2 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-600">
          우리 팀과 가장 가까운 상황 2개를 고릅니다. 아래에 직접 쓴 우리 팀 상황은 AI 질문에 우선 반영됩니다.
        </p>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-sm font-black text-slate-950">우리 팀 상황 선택</h4>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-800">상황 선택 {teamSituations.length} / 2</span>
            </div>
            <p className="mt-2 text-xs font-bold leading-5 text-slate-600">가장 가까운 상황 2개를 선택하세요. 2개를 선택한 뒤에는 기존 선택을 해제해야 다른 상황을 선택할 수 있습니다.</p>
            <div className="mt-3 grid gap-2">
              {TEAM_SITUATION_OPTIONS.map((option) => {
                const selected = teamSituations.includes(option);
                const disabled = !selected && teamSituations.length >= MAX_TEAM_SITUATIONS;
                return (
                  <label key={option} className={`flex gap-3 rounded-2xl border p-3 text-xs font-bold leading-5 ${selected ? 'border-amber-700 bg-amber-50 text-amber-950' : disabled ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-700'}`}>
                    <input type="checkbox" disabled={disabled} checked={selected} onChange={() => toggleTeamSituation(option)} />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
            <label className="mt-4 block space-y-1">
              <span className="text-xs font-black text-slate-600">우리 팀만의 상황 한 문장</span>
              <textarea
                className="min-h-20 w-full rounded-2xl border bg-slate-50 px-3 py-2 text-sm leading-6"
                value={customSituation}
                onChange={(event) => setCustomSituation(event.target.value)}
                placeholder="예: 신규 담당자가 늘어 고객별 맥락을 빠르게 파악하기 어렵다."
              />
            </label>
          </div>

          <div className="rounded-2xl border bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h4 className="text-sm font-black text-slate-950">AI에 물어볼 질문</h4>
                <p className="mt-1 text-xs font-bold leading-5 text-slate-600">AI가 답을 정하는 것이 아니라, 팀장이 볼 지표와 조심할 해석을 가볍게 정리하는 질문입니다.</p>
              </div>
              <button type="button" className="rounded-2xl bg-amber-700 px-4 py-3 text-sm font-black text-white" onClick={() => copyPrompt('metric')}>{copiedPrompt === 'metric' ? '복사 완료' : 'AI에 물어볼 질문 복사'}</button>
            </div>
            <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{metricPrompt}</pre>
          </div>
        </div>

        <label className="mt-4 block space-y-1">
          <span className="text-xs font-black text-slate-600">AI 초안 붙여넣기</span>
          <textarea className="min-h-28 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6" value={aiMetricSuggestion} onChange={(event) => setAiMetricSuggestion(event.target.value)} placeholder="외부 AI가 정리한 초안을 붙여넣으세요. 그대로 쓰지 말고 아래에서 우리 팀 말로 줄여 씁니다." />
        </label>
        <div className="mt-3">
          <button type="button" className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white" onClick={autoFillMetricSuggestion}>AI 초안에서 필요한 것만 옮기기</button>
          <p className="mt-2 text-xs font-bold leading-5 text-slate-600">자동으로 옮겨진 내용도 우리 팀 상황에 맞게 짧게 고쳐 쓰면 됩니다.</p>
          {parseNotice && <div className="mt-3 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-amber-800">{parseNotice}</div>}
        </div>

        <div className="mt-4 rounded-2xl border bg-white p-4">
          <h4 className="text-sm font-black text-slate-950">AI 초안에서 꼭 필요한 것만 남기기</h4>
          <p className="mt-1 text-xs font-bold leading-5 text-slate-600">많이 적는 것이 목적이 아닙니다. 이번 2주 동안 팀장이 실제로 볼 것만 남깁니다.</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <ReviewTextarea label="이번 2주에 꼭 볼 지표" value={aiRecommendedCoreMetrics} onChange={setAiRecommendedCoreMetrics} />
            <ReviewTextarea label="함께 봐야 할 현장 신호" value={aiRecommendedSupportMetrics} onChange={setAiRecommendedSupportMetrics} />
            <ReviewTextarea label="조심해서 봐야 할 해석" value={aiRecommendedSafetyMetrics} onChange={setAiRecommendedSafetyMetrics} />
            <ReviewTextarea label="팀장이 더 확인할 질문" value={aiRecommendedQuestions} onChange={setAiRecommendedQuestions} />
          </div>
        </div>

        <div className="mt-4 rounded-2xl border bg-white p-4">
          <h4 className="text-sm font-black text-slate-950">우리 팀이 이번 2주에 볼 것 최종 정리</h4>
          <p className="mt-1 text-xs font-bold leading-5 text-slate-600">고정 지표 목록에서 억지로 고르지 않습니다. AI 초안에서 필요한 말을 우리 팀 기준으로 다시 써서 남깁니다.</p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <ReviewTextarea label="최종 1. 꼭 볼 지표" value={finalCoreMetric} onChange={setFinalCoreMetric} />
            <ReviewTextarea label="최종 2. 함께 볼 현장 신호" value={finalSupportSignal} onChange={setFinalSupportSignal} />
            <ReviewTextarea label="최종 3. 조심할 해석" value={finalCautionPoint} onChange={setFinalCautionPoint} />
          </div>
          <label className="mt-4 block space-y-1">
            <span className="text-xs font-black text-slate-600">왜 이 기준을 보려고 하나요?</span>
            <textarea className="min-h-20 w-full rounded-2xl border bg-slate-50 px-3 py-2 text-sm leading-6" value={metricRationale} onChange={(event) => setMetricRationale(event.target.value)} placeholder="예: 방문 수보다 방문 이후 다음 행동이 남았는지를 먼저 보고 싶다." />
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedMetricSummary.map((item) => <span key={item} className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-800">{item}</span>)}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Block 1</p>
        <h3 className="text-lg font-black text-slate-950">7명 유형 카드 보기와 우리 팀 유사 유형 2명 선택</h3>
        <p className="mt-2 rounded-2xl bg-cyan-50 p-3 text-xs font-bold leading-5 text-cyan-900">아래 7명은 교육용 가상 인물입니다. 이 중 우리 팀에 실제로 존재하거나 비슷한 행동 신호를 보이는 유형 2명을 선택하세요. 실명보다 행동 신호와 관리 고민을 기준으로 선택하십시오.</p>
        <div className="mt-3 flex flex-wrap gap-2">{selectedMetricSummary.map((item) => <span key={item} className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-800">{item}</span>)}</div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {TEAM_MEMBERS.map((member) => {
            const selected = selectedMemberTypeIds.includes(member.id);
            const disabled = !selected && selectedMemberTypeIds.length >= 2;
            return (
              <TeamMemberCard
                key={member.id}
                member={member}
                selected={selected}
                disabled={disabled}
                onToggle={() => toggleMemberType(member.id)}
              />
            );
          })}
        </div>
      </div>

      <details className="rounded-3xl border border-indigo-100 bg-indigo-50 p-5 shadow-sm md:p-6" open>
        <summary className="cursor-pointer text-lg font-black text-slate-950">Block 2. AI로 선택한 유형에서 보이는 신호 정리</summary>
        <p className="mt-3 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-600">AI 1차 활용은 진단 확정이 아니라 이슈 후보를 넓히는 단계입니다. 선택한 우리 팀 유사 유형 2명만 상세 분석 대상으로 사용합니다.</p>
        <div className="mt-4 rounded-2xl border bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-950">복사용 AI 1차 신호 정리 프롬프트</h3>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-600">선택한 유형에서 보이는 신호를 관찰 가능한 표현과 확인 질문 중심으로 뽑아냅니다.</p>
            </div>
            <button type="button" className="rounded-2xl bg-indigo-700 px-4 py-3 text-sm font-black text-white" onClick={() => copyPrompt('signal')}>{copiedPrompt === 'signal' ? '복사 완료' : 'AI 신호 정리 프롬프트 복사'}</button>
          </div>
          <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{signalPrompt}</pre>
        </div>
      </details>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <h3 className="text-lg font-black text-slate-950">AI 결과 붙여넣기</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">AI가 뽑은 신호를 붙여넣은 뒤, 선택한 2명 유형만 자동 분리·채우기로 아래 입력칸에 초안을 채웁니다.</p>
        <textarea className="mt-4 min-h-40 w-full rounded-2xl border bg-slate-50 px-4 py-3 text-sm leading-6" value={aiSignalResult} onChange={(event) => setAiSignalResult(event.target.value)} placeholder="AI 1차 결과를 여기에 붙여넣으세요. 선택한 팀원 유형 이름이 포함되어 있으면 자동분리가 더 잘 됩니다." />
        <div className="mt-3">
          <button type="button" className="rounded-2xl bg-indigo-700 px-4 py-3 text-sm font-black text-white" onClick={autoFillMemberSignals}>AI 결과 선택 유형 자동 분리·채우기</button>
          <p className="mt-2 text-xs font-bold leading-5 text-slate-600">자동 분리된 선택 유형별 내용은 초안입니다. 각 입력칸에서 반드시 수정하십시오.</p>
          {memberSplitNotice && <div className="mt-3 rounded-2xl bg-indigo-50 p-3 text-xs font-bold leading-5 text-indigo-800">{memberSplitNotice}</div>}
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <h3 className="text-lg font-black text-slate-950">선택한 유형별 신호 분리 정리</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">선택한 2명에 대해서만 신호를 분리하고 다음 행동을 준비합니다. 나머지 5명은 전체 맥락을 이해하기 위한 참고 자료로만 사용합니다.</p>
        {selectedTeamMembers.length === 0 ? (
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">먼저 위 유형 카드에서 우리 팀에 존재하거나 비슷한 유형 2명을 선택하세요.</div>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {selectedTeamMembers.map((member, index) => {
              const current = memberPreps[member.id] ?? emptyPrep();
              return (
                <SelectedMemberPrepPanel
                  key={member.id}
                  member={member}
                  current={current}
                  defaultOpen={index === 0}
                  onUpdate={(field, value) => updatePrep(member.id, field, value)}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <h3 className="text-lg font-black text-slate-950">팀장 행동 선택</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">선택한 유형별 신호에 따라 지금 필요한 준비물을 선택합니다.</p>
        {selectedTeamMembers.length === 0 ? (
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">유형 2명을 선택하면 행동 선택 영역이 표시됩니다.</div>
        ) : (
          <div className="mt-4 grid gap-4">
            {selectedTeamMembers.map((member) => (
              <ActionDeliverablePicker
                key={member.id}
                member={member}
                checkedItems={selectedDeliverables[member.id] ?? []}
                onApplySuggested={() => applySuggestedDeliverables(member.id)}
                onToggleDeliverable={(label) => toggleDeliverable(member.id, label)}
              />
            ))}
          </div>
        )}
      </div>

      <details className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm md:p-6">
        <summary className="cursor-pointer text-lg font-black text-slate-950">AI 2차 활용: 선택한 준비물 생성</summary>
        <p className="mt-3 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-600">AI 2차 활용은 선택한 유형의 팀장 행동 결과물만 생성하는 단계입니다.</p>
        <div className="mt-4 rounded-2xl border bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-950">복사용 AI 준비물 생성 프롬프트</h3>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-600">선택한 유형별 분리 정리와 팀장 행동 선택 결과를 바탕으로 실무 준비물 초안을 만듭니다.</p>
            </div>
            <button type="button" className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white" onClick={() => copyPrompt('prep')}>{copiedPrompt === 'prep' ? '복사 완료' : 'AI 준비물 생성 프롬프트 복사'}</button>
          </div>
          <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{prepPrompt}</pre>
        </div>
      </details>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <h3 className="text-lg font-black text-slate-950">AI 2차 결과 붙여넣기</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">외부 AI가 생성한 준비물 결과를 전체로 붙여넣은 뒤, 선택한 2명 유형별 준비물 초안 칸에 자동으로 채웁니다.</p>
        <textarea className="mt-4 min-h-40 w-full rounded-2xl border bg-slate-50 px-4 py-3 text-sm leading-6" value={aiPrepResult} onChange={(event) => setAiPrepResult(event.target.value)} placeholder="AI 2차 결과를 여기에 붙여넣으세요. 선택한 유형 이름이 포함되어 있으면 자동분리가 더 잘 됩니다." />
        <div className="mt-3">
          <button type="button" className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white" onClick={autoFillPrepDrafts}>AI 2차 결과를 선택 유형별로 채우기</button>
          <p className="mt-2 text-xs font-bold leading-5 text-slate-600">AI가 제안한 준비물은 초안입니다. 실제 팀원에게 사용할 문장과 행동은 팀장이 수정해 확정하십시오.</p>
          {prepSplitNotice && <div className="mt-3 rounded-2xl bg-emerald-50 p-3 text-xs font-bold leading-5 text-emerald-800">{prepSplitNotice}</div>}
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <h3 className="text-lg font-black text-slate-950">최종 결과물: 선택 유형별 다음 행동 준비물</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">AI 2차 결과를 선택 유형별 초안으로 채운 뒤, 팀장 판단으로 수정해 최종 준비물을 확정합니다.</p>
        {selectedTeamMembers.length === 0 ? (
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">유형 2명을 선택하면 최종 준비물 작성 영역이 표시됩니다.</div>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {selectedTeamMembers.map((member) => {
              const current = memberPreps[member.id] ?? emptyPrep();
              return (
                <FinalMemberPrepCard
                  key={member.id}
                  member={member}
                  current={current}
                  onUpdate={(field, value) => updatePrep(member.id, field, value)}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
