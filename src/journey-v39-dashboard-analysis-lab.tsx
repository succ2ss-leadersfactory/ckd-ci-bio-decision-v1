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
type MetricCandidate = { id: string; label: string; source: string; reason?: string };

const TEAM_SITUATION_OPTIONS = [
  '방문은 했는데, 다음 행동으로 이어지지 않는다',
  '관심 보이는 고객은 있는데, 어디부터 챙길지 헷갈린다',
  '팀원마다 움직이는 속도와 방식이 다르다',
  '늘 가던 고객만 챙기고, 새로 봐야 할 고객은 놓친다',
  '자료 설명은 했지만, 고객이 원하는 건 충분히 못 물었다',
];

const MAX_TEAM_SITUATIONS = 2;
const MEASURABLE_METRIC_PATTERN = /(율|비율|횟수|건수|수|여부|전환율|완료율|기록률|공유율|방문율|요청|예약|확보|접촉|방문|메모|동행)/;
const NON_METRIC_PATTERN = /(하고 있는지|해야|않고|어려움|어려움을|보인다|판단|고민|상황|느낌|팀장이|고객이|팀원이|참고|질문|해석|신호|설명|이유)/;

function getSuggestedDeliverables(memberId: string) {
  return V38_SUGGESTED_DELIVERABLES_BY_MEMBER_ID[memberId] ?? [];
}

function parseAiSignalResultByMember(rawText: string) {
  return parseV38AiSignalResultByMember(rawText, TEAM_MEMBERS);
}

function parseAiPrepDraftByMember(rawText: string, members: TeamMember[]) {
  return parseV38AiPrepDraftByMember(rawText, members);
}

function buildSituationSources(teamSituations: string[], customSituation: string) {
  return [
    ...teamSituations.map((label, index) => ({ id: `selected-${index + 1}`, title: `선택 상황 ${index + 1}`, label })),
    ...(customSituation.trim() ? [{ id: 'custom-1', title: '직접 작성 상황', label: customSituation.trim() }] : []),
  ];
}

function buildV39MetricPrompt(teamSituations: string[], customSituation: string) {
  const situationSources = buildSituationSources(teamSituations, customSituation);

  return [
    '당신은 제약영업 팀장의 실행 판단을 돕는 리더십 코치입니다.',
    '이 실습은 정답을 찾는 것이 아니라, 팀장이 이번 2주 동안 무엇을 보고 어떻게 판단할지 연습하는 과정입니다.',
    '',
    '우리 팀 상황:',
    ...(situationSources.length > 0 ? situationSources.map((source) => `- ${source.title}: ${source.label}`) : ['- 아직 선택하지 않았습니다.']),
    '',
    '중요한 반영 기준:',
    '- 선택한 2개 상황과 직접 작성한 상황을 모두 반영해 주세요.',
    '- 직접 작성한 상황은 선택한 2개 상황을 대체하는 것이 아니라, 우리 팀 맥락을 보완하는 정보입니다.',
    '- 핵심 실행 지표 후보와 현장 신호를 섞지 마세요.',
    '- 체크박스로 선택할 것은 핵심 실행 지표 후보뿐입니다.',
    '- 현장 신호, 조심할 해석, 확인 질문은 선택 대상이 아니라 참고 정보입니다.',
    '',
    '아래 4가지를 구분해서 정리해 주세요.',
    '',
    '## 1. 핵심 실행 지표 후보',
    '- 각 상황별로 핵심 실행 지표 후보를 정확히 2개씩 제안해 주세요.',
    '- 선택 상황이 2개이고 직접 작성 상황이 1개 있으면 총 6개 후보가 나와야 합니다.',
    '- 각 상황은 아래 형식을 반드시 지켜 주세요.',
    '',
    '### 선택 상황 1: 상황명',
    '- 지표명: 방문 후 후속 행동 완료율',
    '  이유: 방문 이후 실제 다음 행동이 남았는지 보기 위해',
    '- 지표명: 다음 약속 확보 건수',
    '  이유: 고객 반응이 다음 접점으로 이어졌는지 보기 위해',
    '',
    '작성 기준:',
    '- 지표명에는 설명 문장을 넣지 마세요.',
    '- 지표명은 20자 안팎의 짧은 명사형으로 작성하세요.',
    '- 지표명에는 가능하면 “율, 횟수, 건수, 수, 여부, 전환율, 완료율” 같은 측정 단어를 포함하세요.',
    '- “~하고 있는지”, “~해야 한다”, “~않고 있다” 같은 문장형 표현은 지표명으로 쓰지 마세요.',
    '- 한 지표명 안에 여러 지표를 쉼표로 길게 나열하지 마세요.',
    '',
    '## 2. 함께 봐야 할 현장 신호',
    '- 선택 대상이 아니라 참고 신호입니다.',
    '- 숫자만으로는 놓칠 수 있는 팀원 또는 고객 반응의 신호를 키워드 중심으로 3~5개 작성해 주세요.',
    '- 긴 설명문보다 짧은 구절로 써 주세요.',
    '',
    '## 3. 조심해서 봐야 할 해석',
    '- 선택 대상이 아니라 주의할 해석입니다.',
    '- 숫자나 반응을 잘못 해석할 수 있는 위험을 키워드 중심으로 2~4개 작성해 주세요.',
    '- 경고문처럼 짧게 써 주세요.',
    '',
    '## 4. 팀장이 더 확인할 질문',
    '- 선택 대상이 아니라 대화나 점검에서 쓸 질문입니다.',
    '- 짧은 질문문으로 2~4개 작성해 주세요.',
    '',
    '주의:',
    '- 정답처럼 말하지 마세요.',
    '- 평가나 점수처럼 보이게 쓰지 마세요.',
    '- 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 쓰지 마세요.',
    ...FORBIDDEN_ITEMS.map((item) => `- ${item}`),
    '- 팀장이 교육장에서 바로 이해할 수 있는 현실적인 문장으로 써 주세요.',
  ].join('\n');
}

function normalizeMetricName(rawText: string) {
  let clean = rawText
    .replace(/^[-*•]\s*/, '')
    .replace(/^\d+[.)]\s*/, '')
    .replace(/^#{1,6}\s*/, '')
    .replace(/\*\*/g, '')
    .trim();

  const metricNameMatch = clean.match(/(?:지표명|핵심 실행 지표|핵심 지표)\s*[:：]\s*(.+)$/);
  if (metricNameMatch?.[1]) clean = metricNameMatch[1].trim();
  else return '';

  clean = clean
    .split(/(?:설명\s*[:：]|이유\s*[:：]|왜냐하면|때문입니다|때문에|확인해야|관찰해야|살펴봐야|볼 수 있습니다|봐야 합니다)/)[0]
    .split(/[.!?。]/)[0]
    .replace(/[,，].+$/, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (clean.length < 2) return '';
  if (NON_METRIC_PATTERN.test(clean) && !MEASURABLE_METRIC_PATTERN.test(clean)) return '';
  if (clean.length > 60) return '';
  return clean;
}

function normalizeReferenceKeyword(rawText: string) {
  let clean = rawText
    .replace(/^[-*•]\s*/, '')
    .replace(/^\d+[.)]\s*/, '')
    .replace(/^#{1,6}\s*/, '')
    .replace(/\*\*/g, '')
    .trim();

  const keywordMatch = clean.match(/(?:키워드|신호|해석|질문)\s*[:：]\s*(.+)$/);
  if (keywordMatch?.[1]) clean = keywordMatch[1].trim();

  if (/^(설명|이유|주의|예시)\s*[:：]/.test(clean)) return '';
  if (/^(함께 봐야 할 현장 신호|조심해서 봐야 할 해석|팀장이 더 확인할 질문)$/.test(clean)) return '';

  clean = clean
    .split(/(?:설명\s*[:：]|이유\s*[:：]|왜냐하면|때문입니다|때문에)/)[0]
    .split(/[.!?。]/)[0]
    .replace(/\s+/g, ' ')
    .trim();

  if (clean.length < 2) return '';
  if (clean.length > 44) clean = clean.slice(0, 44).trim();
  return clean;
}

function sourceTitleFromHeading(line: string) {
  const heading = line.replace(/^#{1,6}\s*/, '').trim();
  const match = heading.match(/^(선택 상황\s*\d+|직접 작성 상황)\s*[:：-]?\s*(.*)$/);
  if (!match) return null;
  const title = match[1].replace(/\s+/g, ' ').trim();
  const label = match[2]?.trim();
  return label ? `${title}: ${label}` : title;
}

function extractMetricCandidatesBySituation(rawText: string, situationSources: { title: string; label: string }[]) {
  const fallbackSource = situationSources[0] ? `${situationSources[0].title}: ${situationSources[0].label}` : '핵심 지표';
  const seen = new Set<string>();
  const candidates: MetricCandidate[] = [];
  let currentSource = fallbackSource;
  let lastCandidate: MetricCandidate | null = null;

  for (const rawLine of rawText.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    const headingSource = sourceTitleFromHeading(line);
    if (headingSource) {
      currentSource = headingSource;
      lastCandidate = null;
      continue;
    }

    const label = normalizeMetricName(line);
    if (label) {
      if (seen.has(label)) continue;
      seen.add(label);
      const candidate = { id: `${currentSource}-${candidates.length}-${label}`, label, source: currentSource };
      candidates.push(candidate);
      lastCandidate = candidate;
      continue;
    }

    const reasonMatch = line.match(/(?:이유|설명)\s*[:：]\s*(.+)$/);
    if (reasonMatch?.[1] && lastCandidate && !lastCandidate.reason) {
      lastCandidate.reason = reasonMatch[1].trim();
    }
  }

  return candidates;
}

function extractReferenceKeywords(rawText: string, limit = 8) {
  const seen = new Set<string>();
  const keywords: string[] = [];
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    const normalized = normalizeReferenceKeyword(line);
    if (!normalized) continue;
    const pieces = normalized
      .split(/[,/·;]|\s{2,}/)
      .map((item) => item.trim())
      .filter((item) => item.length >= 2 && item.length <= 36);
    for (const piece of pieces.length > 0 ? pieces : [normalized]) {
      if (seen.has(piece)) continue;
      seen.add(piece);
      keywords.push(piece);
      if (keywords.length >= limit) return keywords;
    }
  }

  return keywords;
}

function ReferenceKeywordCards({ title, guide, items, emptyText, tone }: { title: string; guide: string; items: string[]; emptyText: string; tone: 'cyan' | 'rose' | 'violet' }) {
  const toneClass =
    tone === 'cyan'
      ? 'border-cyan-100 bg-cyan-50 text-cyan-950'
      : tone === 'rose'
        ? 'border-rose-100 bg-rose-50 text-rose-950'
        : 'border-violet-100 bg-violet-50 text-violet-950';

  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <h5 className="text-sm font-black">{title}</h5>
      <p className="mt-1 text-xs font-bold leading-5 opacity-80">{guide}</p>
      {items.length === 0 ? (
        <p className="mt-3 rounded-2xl bg-white/70 px-3 py-2 text-xs font-bold opacity-80">{emptyText}</p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <span key={item} className="max-w-full whitespace-normal break-keep rounded-full bg-white px-3 py-1 text-xs font-black leading-5 shadow-sm">
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function groupMetricCandidates(candidates: MetricCandidate[]) {
  return candidates.reduce<Record<string, MetricCandidate[]>>((groups, candidate) => {
    groups[candidate.source] = [...(groups[candidate.source] ?? []), candidate];
    return groups;
  }, {});
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
  const [metricCandidates, setMetricCandidates] = useState<MetricCandidate[]>([]);
  const [supportKeywords, setSupportKeywords] = useState<string[]>([]);
  const [safetyKeywords, setSafetyKeywords] = useState<string[]>([]);
  const [questionKeywords, setQuestionKeywords] = useState<string[]>([]);
  const [selectedCoreExecutionMetrics, setSelectedCoreExecutionMetrics] = useState<string[]>([]);
  const [finalCoreMetric, setFinalCoreMetric] = useState('');
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
  const situationSources = useMemo(() => buildSituationSources(teamSituations, customSituation), [teamSituations, customSituation]);
  const groupedMetricCandidates = useMemo(() => groupMetricCandidates(metricCandidates), [metricCandidates]);
  const coreMetricItems = useMemo(
    () => [...selectedCoreExecutionMetrics, ...(finalCoreMetric.trim() ? [finalCoreMetric.trim()] : [])],
    [selectedCoreExecutionMetrics, finalCoreMetric],
  );
  const visibleSupportKeywords = supportKeywords.length > 0 ? supportKeywords : extractReferenceKeywords(aiRecommendedSupportMetrics);
  const visibleSafetyKeywords = safetyKeywords.length > 0 ? safetyKeywords : extractReferenceKeywords(aiRecommendedSafetyMetrics);
  const visibleQuestionKeywords = questionKeywords.length > 0 ? questionKeywords : extractReferenceKeywords(aiRecommendedQuestions);

  const selectedMetricSummary = useMemo(
    () => [
      `핵심 실행 지표: ${coreMetricItems.join(' / ') || '미작성'}`,
      `함께 봐야 할 현장 신호: ${visibleSupportKeywords.join(' / ') || '미작성'}`,
      `조심해서 봐야 할 해석: ${visibleSafetyKeywords.join(' / ') || '미작성'}`,
    ],
    [coreMetricItems, visibleSupportKeywords, visibleSafetyKeywords],
  );

  const metricPrompt = useMemo(() => buildV39MetricPrompt(teamSituations, customSituation), [teamSituations, customSituation]);
  const signalPrompt = useMemo(
    () => buildV38SignalPrompt({
      selectedMetricSummary,
      metricRationale,
      aiRecommendedQuestions: visibleQuestionKeywords.join('\n') || aiRecommendedQuestions,
      selectedTeamMembers,
      signalPromptMembers,
      forbiddenItems: FORBIDDEN_ITEMS,
    }),
    [selectedMetricSummary, metricRationale, visibleQuestionKeywords, aiRecommendedQuestions, selectedTeamMembers, signalPromptMembers],
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

  const finalMetricCount = [coreMetricItems.length > 0 ? 'core' : '', visibleSupportKeywords.length > 0 ? 'support' : '', visibleSafetyKeywords.length > 0 ? 'safety' : ''].filter((value) => value.trim()).length;
  const completedSignalCount = selectedTeamMembers.filter((member) => {
    const current = memberPreps[member.id];
    return Boolean(current?.observedSignal || current?.concernSignal || current?.checkQuestion);
  }).length;
  const completedActionChoiceCount = selectedTeamMembers.filter((member) => (selectedDeliverables[member.id] ?? []).length > 0).length;
  const completedFinalCount = selectedTeamMembers.filter((member) => memberPreps[member.id]?.finalPrep).length;
  void completedSignalCount;
  void completedActionChoiceCount;
  void completedFinalCount;

  useEffect(() => {
    const nextResult = createEmptyV39DashboardResult();
    nextResult.teamSituations = [...teamSituations, ...(customSituation.trim() ? [`직접 작성: ${customSituation.trim()}`] : [])];
    nextResult.metricResult = {
      rawAiMetricSuggestion: aiMetricSuggestion,
      aiRecommendedCoreMetrics,
      aiRecommendedSupportMetrics,
      aiRecommendedSafetyMetrics,
      fitForOurTeam: [coreMetricItems.join('\n'), visibleSupportKeywords.join('\n')].filter((value) => value.trim()).join('\n\n'),
      excludedMetrics: '',
      additionalMetricIdea: '',
      aiRecommendedQuestions: visibleQuestionKeywords.join('\n') || aiRecommendedQuestions,
      parseNotice,
    };
    nextResult.metricSelection = {
      selectedCoreMetricIds: coreMetricItems,
      selectedSupportMetricIds: visibleSupportKeywords,
      selectedSafetyMetricIds: visibleSafetyKeywords,
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
    coreMetricItems,
    visibleSupportKeywords,
    visibleSafetyKeywords,
    visibleQuestionKeywords,
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

  const toggleCoreExecutionMetric = (label: string) =>
    setSelectedCoreExecutionMetrics((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label],
    );

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
    const nextCandidates = extractMetricCandidatesBySituation(parsed.core, situationSources);
    const nextSupportKeywords = extractReferenceKeywords(parsed.support, 8);
    const nextSafetyKeywords = extractReferenceKeywords(parsed.safety, 6);
    const nextQuestionKeywords = extractReferenceKeywords(parsed.questions, 6);
    setAiRecommendedCoreMetrics(parsed.core);
    setAiRecommendedSupportMetrics(parsed.support);
    setAiRecommendedSafetyMetrics(parsed.safety);
    setAiRecommendedQuestions(parsed.questions);
    setMetricCandidates(nextCandidates);
    setSupportKeywords(nextSupportKeywords);
    setSafetyKeywords(nextSafetyKeywords);
    setQuestionKeywords(nextQuestionKeywords);
    setSelectedCoreExecutionMetrics((current) => current.filter((item) => nextCandidates.some((candidate) => candidate.label === item)));
    setParseNotice(
      parsed.warnings.length > 0
        ? `AI 초안을 옮겼습니다. 다만 ${parsed.warnings.length}개 항목은 자동으로 찾지 못했습니다. 핵심 실행 지표 후보는 아래에서 직접 선택해 주세요.`
        : 'AI 초안을 옮겼습니다. 상황별 핵심 실행 지표 후보를 확인하고, 실제로 볼 지표만 선택하세요.',
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
            <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-black text-amber-950">핵심 지표 선택 {selectedCoreExecutionMetrics.length}</div>
            <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm font-black text-cyan-950">유형 선택 {selectedMemberTypeIds.length} / 2</div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-950">입력 내용은 자동 저장됩니다</div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-amber-700">Block 0</p>
        <h3 className="text-lg font-black text-slate-950">우리 팀 지표 정하기</h3>
        <p className="mt-2 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-600">
          우리 팀과 가장 가까운 상황 2개를 고릅니다. 직접 쓴 우리 팀 상황은 선택한 2개 상황과 함께 AI 질문에 반영됩니다.
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
                <p className="mt-1 text-xs font-bold leading-5 text-slate-600">AI가 답을 정하는 것이 아니라, 상황별 핵심 실행 지표 후보를 뽑는 질문입니다.</p>
              </div>
              <button type="button" className="rounded-2xl bg-amber-700 px-4 py-3 text-sm font-black text-white" onClick={() => copyPrompt('metric')}>{copiedPrompt === 'metric' ? '복사 완료' : 'AI에 물어볼 질문 복사'}</button>
            </div>
            <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{metricPrompt}</pre>
          </div>
        </div>

        <label className="mt-4 block space-y-1">
          <span className="text-xs font-black text-slate-600">AI 초안 붙여넣기</span>
          <textarea className="min-h-28 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6" value={aiMetricSuggestion} onChange={(event) => setAiMetricSuggestion(event.target.value)} placeholder="외부 AI가 정리한 초안을 붙여넣으세요. 핵심 실행 지표만 선택하고 나머지는 참고 카드로 봅니다." />
        </label>
        <div className="mt-3">
          <button type="button" className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white" onClick={autoFillMetricSuggestion}>AI 초안에서 후보와 참고 신호 나누기</button>
          <p className="mt-2 text-xs font-bold leading-5 text-slate-600">선택은 핵심 실행 지표만 합니다. 현장 신호, 조심할 해석, 확인 질문은 지표를 해석할 때 참고합니다.</p>
          {parseNotice && <div className="mt-3 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-amber-800">{parseNotice}</div>}
        </div>

        <div className="mt-4 rounded-2xl border bg-white p-4">
          <h4 className="text-sm font-black text-slate-950">AI가 나눈 후보와 참고 신호</h4>
          <p className="mt-1 text-xs font-bold leading-5 text-slate-600">선택 대상은 핵심 실행 지표 후보뿐입니다. 나머지는 판단을 돕는 참고 카드로만 봅니다.</p>
          <div className="mt-3 grid gap-3 lg:grid-cols-3">
            <ReferenceKeywordCards title="함께 봐야 할 현장 신호" guide="선택 대상이 아니라 지표를 해석할 때 함께 볼 신호입니다." items={visibleSupportKeywords} emptyText="AI 초안을 분리하면 현장 신호 키워드가 표시됩니다." tone="cyan" />
            <ReferenceKeywordCards title="조심해서 봐야 할 해석" guide="성급하게 판단하지 않기 위한 주의점입니다." items={visibleSafetyKeywords} emptyText="AI 초안을 분리하면 조심할 해석이 표시됩니다." tone="rose" />
            <ReferenceKeywordCards title="팀장이 더 확인할 질문" guide="면담이나 점검에서 던질 수 있는 질문입니다." items={visibleQuestionKeywords} emptyText="AI 초안을 분리하면 확인 질문이 표시됩니다." tone="violet" />
          </div>

          <details className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <summary className="cursor-pointer text-sm font-black text-slate-950">AI 원문과 참고 키워드 직접 수정</summary>
            <p className="mt-2 text-xs font-bold leading-5 text-slate-600">긴 설명은 여기에서 확인합니다. 화면의 카드에는 짧은 키워드만 보여줍니다.</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <ReviewTextarea label="핵심 실행 지표 후보 원문" value={aiRecommendedCoreMetrics} onChange={setAiRecommendedCoreMetrics} />
              <ReviewTextarea label="함께 봐야 할 현장 신호 원문" value={aiRecommendedSupportMetrics} onChange={(value) => { setAiRecommendedSupportMetrics(value); setSupportKeywords(extractReferenceKeywords(value, 8)); }} />
              <ReviewTextarea label="조심해서 봐야 할 해석 원문" value={aiRecommendedSafetyMetrics} onChange={(value) => { setAiRecommendedSafetyMetrics(value); setSafetyKeywords(extractReferenceKeywords(value, 6)); }} />
              <ReviewTextarea label="팀장이 더 확인할 질문 원문" value={aiRecommendedQuestions} onChange={(value) => { setAiRecommendedQuestions(value); setQuestionKeywords(extractReferenceKeywords(value, 6)); }} />
            </div>
          </details>
        </div>

        <div className="mt-4 rounded-2xl border bg-white p-4">
          <h4 className="text-sm font-black text-slate-950">핵심 실행 지표 선택</h4>
          <p className="mt-1 text-xs font-bold leading-5 text-slate-600">AI가 상황별로 제안한 후보 중 이번 2주에 실제로 볼 지표를 선택합니다. 현장 신호와 조심할 해석은 선택하지 않고 참고만 합니다.</p>
          {metricCandidates.length === 0 ? (
            <div className="mt-3 rounded-2xl bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-900">AI 초안을 붙여넣고 “후보와 참고 신호 나누기”를 누르면 상황별 후보가 표시됩니다.</div>
          ) : (
            <div className="mt-3 grid gap-3 lg:grid-cols-3">
              {Object.entries(groupedMetricCandidates).map(([source, candidates]) => (
                <div key={source} className="rounded-2xl border border-amber-100 bg-amber-50 p-3">
                  <p className="text-xs font-black leading-5 text-amber-900">{source}</p>
                  <div className="mt-2 grid gap-2">
                    {candidates.map((candidate) => {
                      const selected = selectedCoreExecutionMetrics.includes(candidate.label);
                      return (
                        <label key={candidate.id} className={`flex min-w-0 gap-3 rounded-2xl border p-3 text-xs font-bold leading-5 ${selected ? 'border-amber-700 bg-white text-amber-950' : 'bg-white/80 text-slate-700'}`}>
                          <input type="checkbox" className="mt-1 shrink-0" checked={selected} onChange={() => toggleCoreExecutionMetric(candidate.label)} />
                          <span className="min-w-0 flex-1 whitespace-normal break-keep leading-5">
                            <span className="block font-black">{candidate.label}</span>
                            {candidate.reason && <span className="mt-1 block text-[11px] font-bold text-slate-500">{candidate.reason}</span>}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          <label className="mt-4 block space-y-1">
            <span className="text-xs font-black text-slate-600">직접 추가할 핵심 실행 지표</span>
            <textarea className="min-h-20 w-full rounded-2xl border bg-slate-50 px-3 py-2 text-sm leading-6" value={finalCoreMetric} onChange={(event) => setFinalCoreMetric(event.target.value)} placeholder="AI 후보에 없지만 꼭 봐야 할 지표가 있으면 짧게 적습니다." />
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {coreMetricItems.length === 0 ? <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">아직 선택한 핵심 실행 지표가 없습니다</span> : coreMetricItems.map((item) => <span key={item} className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-800">{item}</span>)}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border bg-white p-4">
          <h4 className="text-sm font-black text-slate-950">선택한 지표를 볼 때의 기준</h4>
          <p className="mt-1 text-xs font-bold leading-5 text-slate-600">위에서 선택한 핵심 실행 지표를 볼 때, 어떤 이유로 이 기준을 보려는지 한 문장만 남깁니다.</p>
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
