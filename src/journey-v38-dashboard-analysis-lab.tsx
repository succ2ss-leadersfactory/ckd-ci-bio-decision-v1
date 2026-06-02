import { useMemo, useState } from 'react';
import {
  V38_ACTION_OUTPUT_OPTIONS as ACTION_OUTPUT_OPTIONS,
  V38_FORBIDDEN_ITEMS as FORBIDDEN_ITEMS,
  V38_MAX_TEAM_SITUATIONS as MAX_TEAM_SITUATIONS,
  V38_METRIC_OPTIONS as METRIC_OPTIONS,
  V38_SUGGESTED_DELIVERABLES_BY_MEMBER_ID,
  V38_TEAM_MEMBERS as TEAM_MEMBERS,
  V38_TEAM_SITUATION_OPTIONS as TEAM_SITUATION_OPTIONS,
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
  buildV38MetricPrompt,
  buildV38PrepPrompt,
  buildV38SignalPrompt,
} from './journey-v38-dashboard-analysis-prompts';
import {
  V38MetricPicker as MetricPicker,
  V38ReviewTextarea as ReviewTextarea,
  V38TeamMemberCard as TeamMemberCard,
} from './journey-v38-dashboard-analysis-ui';
import { V38ActionDeliverablePicker as ActionDeliverablePicker } from './journey-v38-action-deliverable-picker';
import { V38FinalMemberPrepCard as FinalMemberPrepCard } from './journey-v38-final-member-prep-card';
import { V38SelectedMemberPrepPanel as SelectedMemberPrepPanel } from './journey-v38-selected-member-prep-panel';

type TeamMember = V38TeamMember;
type MemberPrep = V38MemberPrep;
type PrepState = V38PrepState;
type DeliverableState = Record<string, string[]>;

function metricNames(ids: string[]) {
  return ids.map((id) => METRIC_OPTIONS.find((item) => item.id === id)?.name ?? id);
}

function getSuggestedDeliverables(memberId: string) {
  return V38_SUGGESTED_DELIVERABLES_BY_MEMBER_ID[memberId] ?? [];
}

function parseAiSignalResultByMember(rawText: string) {
  return parseV38AiSignalResultByMember(rawText, TEAM_MEMBERS);
}

function parseAiPrepDraftByMember(rawText: string, members: TeamMember[]) {
  return parseV38AiPrepDraftByMember(rawText, members);
}

export function V38DashboardAnalysisLab() {
  const [teamSituations, setTeamSituations] = useState<string[]>([]);
  const [aiMetricSuggestion, setAiMetricSuggestion] = useState('');
  const [parseNotice, setParseNotice] = useState('');
  const [aiRecommendedCoreMetrics, setAiRecommendedCoreMetrics] = useState('');
  const [aiRecommendedSupportMetrics, setAiRecommendedSupportMetrics] = useState('');
  const [aiRecommendedSafetyMetrics, setAiRecommendedSafetyMetrics] = useState('');
  const [fitForOurTeam, setFitForOurTeam] = useState('');
  const [excludedMetrics, setExcludedMetrics] = useState('');
  const [additionalMetricIdea, setAdditionalMetricIdea] = useState('');
  const [aiRecommendedQuestions, setAiRecommendedQuestions] = useState('');
  const [selectedCoreMetrics, setSelectedCoreMetrics] = useState<string[]>([]);
  const [selectedSupportMetrics, setSelectedSupportMetrics] = useState<string[]>([]);
  const [selectedSafetyMetrics, setSelectedSafetyMetrics] = useState<string[]>([]);
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
      `핵심 지표 3개: ${metricNames(selectedCoreMetrics).join(' / ') || '미선택'}`,
      `보완 지표 2개: ${metricNames(selectedSupportMetrics).join(' / ') || '미선택'}`,
      `안전선 지표 1개: ${metricNames(selectedSafetyMetrics).join(' / ') || '미선택'}`,
    ],
    [selectedCoreMetrics, selectedSupportMetrics, selectedSafetyMetrics],
  );

  const metricPrompt = useMemo(
    () => buildV38MetricPrompt({ teamSituations, forbiddenItems: FORBIDDEN_ITEMS }),
    [teamSituations],
  );
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

  const completedSignalCount = selectedTeamMembers.filter((member) => {
    const current = memberPreps[member.id];
    return Boolean(current?.observedSignal || current?.concernSignal || current?.checkQuestion);
  }).length;
  const completedActionChoiceCount = selectedTeamMembers.filter((member) => (selectedDeliverables[member.id] ?? []).length > 0).length;
  const completedFinalCount = selectedTeamMembers.filter((member) => memberPreps[member.id]?.finalPrep).length;

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
    setExcludedMetrics(parsed.excluded);
    setAdditionalMetricIdea(parsed.additional);
    setAiRecommendedQuestions(parsed.questions);
    setFitForOurTeam((current) => current || [parsed.core, parsed.support].filter(Boolean).join('\n\n'));
    setParseNotice(
      parsed.warnings.length > 0
        ? `자동 분리·채우기를 완료했습니다. 다만 ${parsed.warnings.length}개 영역은 찾지 못했습니다. 입력칸을 확인해 주세요.`
        : '자동 분리·채우기를 완료했습니다. 아래 입력칸에서 우리 팀 상황에 맞게 수정하세요.',
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
      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700">v38 Dashboard Analysis Lab</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">우리 팀 지표로 다음 행동 준비하기</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              이 단계는 <span className="font-black text-slate-950">우리 팀 상황 선택 → AI 추천 결과 붙여넣기 → 자동 분리·채우기 → 최종 실행지표 선택 → 우리 팀에 존재하는 유형 2명 선택 → 선택한 2명 상세 분석 → AI 2차 결과 자동 채우기</span> 흐름으로, 팀장이 사용할 <span className="font-black text-slate-950">다음 행동 준비물</span>을 만듭니다.
            </p>
          </div>
          <div className="grid gap-2 text-sm font-black text-cyan-800 md:text-right">
            <div className="rounded-2xl bg-amber-50 px-4 py-3 text-amber-800">상황 선택 {teamSituations.length} / {MAX_TEAM_SITUATIONS}</div>
            <div className="rounded-2xl bg-amber-50 px-4 py-3 text-amber-800">지표 선택 {selectedCoreMetrics.length + selectedSupportMetrics.length + selectedSafetyMetrics.length} / 6</div>
            <div className="rounded-2xl bg-cyan-50 px-4 py-3">유형 선택 {selectedMemberTypeIds.length} / 2</div>
            <div className="rounded-2xl bg-cyan-50 px-4 py-3">신호 분리 {completedSignalCount} / {selectedTeamMembers.length || 2}</div>
            <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-indigo-800">행동 선택 {completedActionChoiceCount} / {selectedTeamMembers.length || 2}</div>
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-emerald-800">준비물 완성 {completedFinalCount} / {selectedTeamMembers.length || 2}</div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-amber-700">Block 0</p>
        <h3 className="text-lg font-black text-slate-950">우리 팀 지표 정하기</h3>
        <p className="mt-2 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-600">우리 팀 상황은 처음부터 선택되어 있지 않습니다. 우리 팀에 가장 가까운 상황을 최대 3개까지 선택하세요. 이번 실습에서는 모든 문제를 다루기보다, 먼저 볼 실행 이슈를 좁히는 것이 중요합니다.</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-sm font-black text-slate-950">우리 팀 상황 선택</h4>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-800">상황 선택 {teamSituations.length} / {MAX_TEAM_SITUATIONS}</span>
            </div>
            <p className="mt-2 text-xs font-bold leading-5 text-slate-600">1~3개를 선택하세요. 최대 3개 선택 후에는 기존 선택을 해제해야 다른 상황을 선택할 수 있습니다.</p>
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
          </div>
          <div className="rounded-2xl border bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h4 className="text-sm font-black text-slate-950">AI 지표 추천 프롬프트</h4>
                <p className="mt-1 text-xs font-bold leading-5 text-slate-600">자동분리가 잘 되도록 섹션 제목과 불릿 구조를 지정합니다.</p>
              </div>
              <button type="button" className="rounded-2xl bg-amber-700 px-4 py-3 text-sm font-black text-white" onClick={() => copyPrompt('metric')}>{copiedPrompt === 'metric' ? '복사 완료' : 'AI 지표 추천 프롬프트 복사'}</button>
            </div>
            <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{metricPrompt}</pre>
          </div>
        </div>
        <label className="mt-4 block space-y-1">
          <span className="text-xs font-black text-slate-600">AI 추천 지표 붙여넣기</span>
          <textarea className="min-h-28 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6" value={aiMetricSuggestion} onChange={(event) => setAiMetricSuggestion(event.target.value)} placeholder="클로드, ChatGPT 등에서 생성한 지표 추천 결과를 붙여넣으세요. 표 형식도 자동분리를 시도합니다." />
        </label>
        <div className="mt-3">
          <button type="button" className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white" onClick={autoFillMetricSuggestion}>AI 추천 지표 자동 분리·채우기</button>
          <p className="mt-2 text-xs font-bold leading-5 text-slate-600">자동 채우기 후에도 각 입력칸에서 자유롭게 수정할 수 있습니다.</p>
          {parseNotice && <div className="mt-3 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-amber-800">{parseNotice}</div>}
        </div>
        <div className="mt-4 rounded-2xl border bg-white p-4">
          <h4 className="text-sm font-black text-slate-950">AI 추천 지표 분리정리</h4>
          <p className="mt-1 text-xs font-bold leading-5 text-slate-600">자동분리 결과는 아래 입력칸에 바로 채워집니다. 팀장 판단으로 수정한 뒤 최종 선택으로 이동합니다.</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <ReviewTextarea label="AI 추천 핵심 지표 후보" value={aiRecommendedCoreMetrics} onChange={setAiRecommendedCoreMetrics} />
            <ReviewTextarea label="AI 추천 보완 지표 후보" value={aiRecommendedSupportMetrics} onChange={setAiRecommendedSupportMetrics} />
            <ReviewTextarea label="AI 추천 안전선 지표 후보" value={aiRecommendedSafetyMetrics} onChange={setAiRecommendedSafetyMetrics} />
            <ReviewTextarea label="우리 팀에 맞는 지표" value={fitForOurTeam} onChange={setFitForOurTeam} />
            <ReviewTextarea label="제외할 지표" value={excludedMetrics} onChange={setExcludedMetrics} />
            <ReviewTextarea label="추가하고 싶은 지표" value={additionalMetricIdea} onChange={setAdditionalMetricIdea} />
            <ReviewTextarea label="AI 추천 확인 질문" value={aiRecommendedQuestions} onChange={setAiRecommendedQuestions} />
          </div>
        </div>
        <div className="mt-4 rounded-2xl border bg-white p-4">
          <h4 className="text-sm font-black text-slate-950">우리 팀 핵심 실행지표 최종 선택</h4>
          <p className="mt-1 text-xs font-bold leading-5 text-slate-600">AI 추천 지표 분리정리와 기본 안전 지표를 참고해 최종 실행지표를 선택하세요. 핵심 지표 3개, 보완 지표 2개, 안전선 지표 1개를 선택합니다.</p>
          <MetricPicker title="핵심 지표 3개" selected={selectedCoreMetrics} setter={setSelectedCoreMetrics} max={3} safetyOnly={false} />
          <MetricPicker title="보완 지표 2개" selected={selectedSupportMetrics} setter={setSelectedSupportMetrics} max={2} safetyOnly={false} />
          <MetricPicker title="안전선 지표 1개" selected={selectedSafetyMetrics} setter={setSelectedSafetyMetrics} max={1} safetyOnly={true} />
          <label className="mt-4 block space-y-1">
            <span className="text-xs font-black text-slate-600">지표 선택 이유</span>
            <textarea className="min-h-20 w-full rounded-2xl border bg-slate-50 px-3 py-2 text-sm leading-6" value={metricRationale} onChange={(event) => setMetricRationale(event.target.value)} placeholder="예: AI 추천 중 후속 대화 연결과 고객 반응 지표가 우리 팀 상황에 가장 맞다고 판단했다." />
          </label>
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
