import { useEffect, useMemo, useState } from 'react';
import {
  V38_FORBIDDEN_ITEMS as FORBIDDEN_ITEMS,
  V38_TEAM_MEMBERS as TEAM_MEMBERS,
  type V38TeamMember,
} from './journey-v38-dashboard-analysis-data';
import {
  createEmptyV38MemberPrep,
  type V38MemberPrep,
  type V38PrepState,
} from './journey-v38-dashboard-analysis-parsers';
import {
  createEmptyV39DashboardResult,
  saveV39DashboardResult,
} from './journey-v39-dashboard-result-store';

const V39_DASHBOARD_ANALYSIS_SMOKE_MARKERS = 'V39DashboardAnalysisLab V38DashboardAnalysisLab';
void V39_DASHBOARD_ANALYSIS_SMOKE_MARKERS;

type TeamMember = V38TeamMember;
type PrepState = V38PrepState;
type MetricCandidate = { id: string; label: string; source: string; reason?: string };
type AiMetricDraftSections = {
  core: string;
  support: string;
  safety: string;
  questions: string;
  warnings: string[];
};

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

function buildSituationSources(teamSituations: string[], customSituation: string) {
  return [
    ...teamSituations.map((label, index) => ({ id: `selected-${index + 1}`, title: `선택 상황 ${index + 1}`, label })),
    ...(customSituation.trim() ? [{ id: 'custom-1', title: '직접 작성 상황', label: customSituation.trim() }] : []),
  ];
}

function buildMetricPrompt(teamSituations: string[], customSituation: string) {
  const sources = buildSituationSources(teamSituations, customSituation);

  return [
    '당신은 제약영업 팀장의 실행 판단을 돕는 리더십 코치입니다.',
    '이 실습은 정답을 찾는 것이 아니라, 팀장이 이번 2주 동안 무엇을 보고 어떻게 판단할지 연습하는 과정입니다.',
    '',
    '우리 팀 상황:',
    ...(sources.length > 0 ? sources.map((source) => `- ${source.title}: ${source.label}`) : ['- 아직 선택하지 않았습니다.']),
    '',
    '중요한 기준:',
    '- 선택한 2개 상황과 직접 작성한 상황을 모두 반영해 주세요.',
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
    '- 지표명은 짧은 명사형으로 작성하세요.',
    '- 지표명에는 가능하면 “율, 횟수, 건수, 수, 여부, 전환율, 완료율” 같은 측정 단어를 포함하세요.',
    '- “~하고 있는지”, “~해야 한다”, “~않고 있다” 같은 문장형 표현은 지표명으로 쓰지 마세요.',
    '- 한 지표명 안에 여러 지표를 쉼표로 길게 나열하지 마세요.',
    '',
    '## 2. 함께 봐야 할 현장 신호',
    '- 선택 대상이 아니라 참고 신호입니다.',
    '- 키워드 중심으로 3~5개 작성해 주세요.',
    '',
    '## 3. 조심해서 봐야 할 해석',
    '- 선택 대상이 아니라 주의할 해석입니다.',
    '- 경고문처럼 짧게 2~4개 작성해 주세요.',
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

function detectAiSection(line: string): keyof Omit<AiMetricDraftSections, 'warnings'> | null {
  const clean = line.replace(/^#{1,6}\s*/, '').replace(/\*\*/g, '').trim();
  if (/^1[.)]?\s*핵심 실행 지표 후보/.test(clean) || /^핵심 실행 지표 후보/.test(clean)) return 'core';
  if (/^2[.)]?\s*함께 봐야 할 현장 신호/.test(clean) || /^함께 봐야 할 현장 신호/.test(clean)) return 'support';
  if (/^3[.)]?\s*조심해서 봐야 할 해석/.test(clean) || /^조심해서 봐야 할 해석/.test(clean)) return 'safety';
  if (/^4[.)]?\s*팀장이 더 확인할 질문/.test(clean) || /^팀장이 더 확인할 질문/.test(clean)) return 'questions';
  return null;
}

function parseAiMetricDraftSections(rawText: string): AiMetricDraftSections {
  const sections: AiMetricDraftSections = { core: '', support: '', safety: '', questions: '', warnings: [] };
  let current: keyof Omit<AiMetricDraftSections, 'warnings'> | null = null;

  for (const rawLine of rawText.split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    const nextSection = detectAiSection(line.trim());
    if (nextSection) {
      current = nextSection;
      continue;
    }
    if (current) sections[current] += `${line}\n`;
  }

  for (const key of ['core', 'support', 'safety', 'questions'] as const) {
    sections[key] = sections[key].trim();
    if (!sections[key]) sections.warnings.push(key);
  }

  return sections;
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

function isSituationHeading(clean: string) {
  return /^(선택 상황\s*\d+|직접 작성 상황)\s*[:：-]?/.test(clean);
}

function normalizeReferenceKeyword(rawText: string) {
  let clean = rawText
    .replace(/^[-*•]\s*/, '')
    .replace(/^\d+[.)]\s*/, '')
    .replace(/^#{1,6}\s*/, '')
    .replace(/\*\*/g, '')
    .trim();

  if (!clean || isSituationHeading(clean)) return '';

  const keywordMatch = clean.match(/(?:키워드|신호|해석|질문)\s*[:：]\s*(.+)$/);
  if (keywordMatch?.[1]) clean = keywordMatch[1].trim();
  if (/^(설명|이유|주의|예시)\s*[:：]/.test(clean)) return '';
  if (/^(핵심 실행 지표 후보|함께 봐야 할 현장 신호|조심해서 봐야 할 해석|팀장이 더 확인할 질문)$/.test(clean)) return '';

  clean = clean
    .split(/(?:설명\s*[:：]|이유\s*[:：]|왜냐하면|때문입니다|때문에)/)[0]
    .split(/[.!?。]/)[0]
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean || isSituationHeading(clean)) return '';
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
    if (!line || /^---+$/.test(line)) continue;

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

  for (const rawLine of rawText.split(/\r?\n/)) {
    const normalized = normalizeReferenceKeyword(rawLine.trim());
    if (!normalized) continue;
    const pieces = normalized
      .split(/[,/·;]|\s{2,}/)
      .map((item) => item.trim())
      .filter((item) => item.length >= 2 && item.length <= 36 && !isSituationHeading(item));

    for (const piece of pieces.length > 0 ? pieces : [normalized]) {
      if (seen.has(piece)) continue;
      seen.add(piece);
      keywords.push(piece);
      if (keywords.length >= limit) return keywords;
    }
  }

  return keywords;
}

function groupMetricCandidates(candidates: MetricCandidate[]) {
  return candidates.reduce<Record<string, MetricCandidate[]>>((groups, candidate) => {
    groups[candidate.source] = [...(groups[candidate.source] ?? []), candidate];
    return groups;
  }, {});
}

function toSignalWords(signal: string) {
  return signal
    .replace(/\s*\d+%?\s*$/, '')
    .replace(/:\s*(안전|주의)$/, ': $1')
    .replace('실행 적시성', '대응 속도')
    .replace('고객 대화 지속성', '대화 지속')
    .replace('CRM 기록 품질', '기록 정리')
    .replace('후속조치 실행률', '후속 실행')
    .replace('고객 인게이지먼트 지수', '고객 반응')
    .replace('핵심 고객군 커버리지', '핵심 고객 커버')
    .replace('팀 학습 기여도', '공유와 학습')
    .replace('실행 인사이트 재사용도', '좋은 방식 재사용')
    .replace('계획 접점 실행률', '계획 접점 실행')
    .replace('후속 대화 연결지수', '후속 대화 연결');
}

function GuideBox({ title, items, tone = 'slate' }: { title: string; items: string[]; tone?: 'slate' | 'amber' | 'cyan' }) {
  const toneClass = tone === 'amber' ? 'border-amber-100 bg-amber-50 text-amber-950' : tone === 'cyan' ? 'border-cyan-100 bg-cyan-50 text-cyan-950' : 'border-slate-100 bg-slate-50 text-slate-700';
  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <p className="text-xs font-black text-slate-950">{title}</p>
      <ul className="mt-2 space-y-1 text-xs font-bold leading-5">
        {items.map((item) => <li key={item}>• {item}</li>)}
      </ul>
    </div>
  );
}

function ReferenceKeywordCards({ title, guide, items, emptyText, tone }: { title: string; guide: string; items: string[]; emptyText: string; tone: 'cyan' | 'rose' | 'violet' }) {
  const toneClass = tone === 'cyan' ? 'border-cyan-100 bg-cyan-50 text-cyan-950' : tone === 'rose' ? 'border-rose-100 bg-rose-50 text-rose-950' : 'border-violet-100 bg-violet-50 text-violet-950';
  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <h5 className="text-sm font-black">{title}</h5>
      <p className="mt-1 text-xs font-bold leading-5 opacity-80">{guide}</p>
      {items.length === 0 ? (
        <p className="mt-3 rounded-2xl bg-white/70 px-3 py-2 text-xs font-bold opacity-80">{emptyText}</p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => <span key={item} className="max-w-full whitespace-normal break-keep rounded-full bg-white px-3 py-1 text-xs font-black leading-5 shadow-sm">{item}</span>)}
        </div>
      )}
    </div>
  );
}

function MemberSignalCard({ member, selected, disabled, onToggle }: { member: TeamMember; selected: boolean; disabled: boolean; onToggle: () => void }) {
  return (
    <article className={`rounded-3xl border p-5 ${selected ? 'border-cyan-500 bg-cyan-50' : disabled ? 'bg-slate-100 opacity-60' : 'bg-white'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-lg font-black text-slate-950">{member.name}</h4>
          <p className="mt-1 text-sm font-black text-cyan-700">{member.profile}</p>
        </div>
        <button type="button" disabled={disabled} className={`shrink-0 rounded-2xl px-3 py-2 text-xs font-black ${selected ? 'bg-cyan-700 text-white' : 'border bg-white text-slate-700'}`} onClick={onToggle}>{selected ? '선택됨' : '이 유형 선택'}</button>
      </div>
      <div className="mt-4 space-y-3 text-sm font-bold leading-6 text-slate-700">
        <p><span className="font-black text-slate-950">겉으로 보이는 모습: </span>{member.observation}</p>
        <p><span className="font-black text-slate-950">살펴볼 행동 신호: </span>이번 실행 초점에서 비슷한 움직임이 보이는지 확인합니다.</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {member.signals.slice(0, 4).map((signal) => <span key={signal} className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600 shadow-sm">{toSignalWords(signal)}</span>)}
      </div>
    </article>
  );
}

function updateMemberPrep(current: PrepState, memberId: string, field: keyof V38MemberPrep, value: string) {
  return {
    ...current,
    [memberId]: { ...createEmptyV38MemberPrep(), ...(current[memberId] ?? {}), [field]: value },
  };
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
  const [selectedCoreMetrics, setSelectedCoreMetrics] = useState<string[]>([]);
  const [extraMetric, setExtraMetric] = useState('');
  const [metricRationale, setMetricRationale] = useState('');
  const [behaviorBridge, setBehaviorBridge] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [memberPreps, setMemberPreps] = useState<PrepState>({});
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const situationSources = useMemo(() => buildSituationSources(teamSituations, customSituation), [teamSituations, customSituation]);
  const groupedMetricCandidates = useMemo(() => groupMetricCandidates(metricCandidates), [metricCandidates]);
  const selectedMembers = useMemo(() => TEAM_MEMBERS.filter((member) => selectedMemberIds.includes(member.id)), [selectedMemberIds]);
  const coreMetricItems = useMemo(() => [...selectedCoreMetrics, ...(extraMetric.trim() ? [extraMetric.trim()] : [])], [selectedCoreMetrics, extraMetric]);
  const visibleSupportKeywords = useMemo(() => supportKeywords.length > 0 ? supportKeywords : extractReferenceKeywords(aiRecommendedSupportMetrics), [supportKeywords, aiRecommendedSupportMetrics]);
  const visibleSafetyKeywords = useMemo(() => safetyKeywords.length > 0 ? safetyKeywords : extractReferenceKeywords(aiRecommendedSafetyMetrics), [safetyKeywords, aiRecommendedSafetyMetrics]);
  const visibleQuestionKeywords = useMemo(() => questionKeywords.length > 0 ? questionKeywords : extractReferenceKeywords(aiRecommendedQuestions), [questionKeywords, aiRecommendedQuestions]);
  const metricPrompt = useMemo(() => buildMetricPrompt(teamSituations, customSituation), [teamSituations, customSituation]);

  const selectedMetricSummary = useMemo(() => [
    `핵심 실행 지표: ${coreMetricItems.join(' / ') || '미작성'}`,
    `참고 신호: ${visibleSupportKeywords.join(' / ') || '미작성'}`,
    `조심할 해석: ${visibleSafetyKeywords.join(' / ') || '미작성'}`,
  ], [coreMetricItems, visibleSupportKeywords, visibleSafetyKeywords]);

  useEffect(() => {
    const nextResult = createEmptyV39DashboardResult();
    nextResult.teamSituations = [...teamSituations, ...(customSituation.trim() ? [`직접 작성: ${customSituation.trim()}`] : [])];
    nextResult.metricResult = {
      rawAiMetricSuggestion: aiMetricSuggestion,
      aiRecommendedCoreMetrics,
      aiRecommendedSupportMetrics,
      aiRecommendedSafetyMetrics,
      fitForOurTeam: [coreMetricItems.join('\n'), visibleSupportKeywords.join('\n')].filter(Boolean).join('\n\n'),
      excludedMetrics: '',
      additionalMetricIdea: behaviorBridge,
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
      selectedMemberTypeIds: selectedMemberIds,
      rawAiSignalResult: behaviorBridge,
      memberSplitNotice: selectedMemberIds.length > 0 ? '팀 현황에서 팀원 실행신호 보기로 연결됨' : '',
      memberPreps,
      selectedDeliverables: {},
      rawAiPrepResult: '',
      prepSplitNotice: '',
    };
    saveV39DashboardResult(nextResult);
  }, [teamSituations, customSituation, aiMetricSuggestion, aiRecommendedCoreMetrics, aiRecommendedSupportMetrics, aiRecommendedSafetyMetrics, aiRecommendedQuestions, coreMetricItems, visibleSupportKeywords, visibleSafetyKeywords, visibleQuestionKeywords, behaviorBridge, metricRationale, parseNotice, selectedMemberIds, memberPreps]);

  const toggleTeamSituation = (value: string) => {
    setTeamSituations((current) => current.includes(value) ? current.filter((item) => item !== value) : current.length >= MAX_TEAM_SITUATIONS ? current : [...current, value]);
  };
  const toggleMetric = (label: string) => setSelectedCoreMetrics((current) => current.includes(label) ? current.filter((item) => item !== label) : [...current, label]);
  const toggleMember = (memberId: string) => setSelectedMemberIds((current) => current.includes(memberId) ? current.filter((id) => id !== memberId) : current.length >= 2 ? current : [...current, memberId]);
  const updatePrep = (memberId: string, field: keyof V38MemberPrep, value: string) => setMemberPreps((current) => updateMemberPrep(current, memberId, field, value));

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(metricPrompt);
      setCopiedPrompt(true);
      window.setTimeout(() => setCopiedPrompt(false), 1600);
    } catch {
      setCopiedPrompt(false);
    }
  };

  const splitAiDraft = () => {
    const parsed = parseAiMetricDraftSections(aiMetricSuggestion);
    const candidates = extractMetricCandidatesBySituation(parsed.core, situationSources);
    const nextSupport = extractReferenceKeywords(parsed.support, 12);
    const nextSafety = extractReferenceKeywords(parsed.safety, 10);
    const nextQuestions = extractReferenceKeywords(parsed.questions, 10);
    setAiRecommendedCoreMetrics(parsed.core);
    setAiRecommendedSupportMetrics(parsed.support);
    setAiRecommendedSafetyMetrics(parsed.safety);
    setAiRecommendedQuestions(parsed.questions);
    setMetricCandidates(candidates);
    setSupportKeywords(nextSupport);
    setSafetyKeywords(nextSafety);
    setQuestionKeywords(nextQuestions);
    setSelectedCoreMetrics((current) => current.filter((item) => candidates.some((candidate) => candidate.label === item)));
    setParseNotice(parsed.warnings.length > 0 ? `AI 초안을 옮겼습니다. 다만 ${parsed.warnings.length}개 섹션은 자동으로 찾지 못했습니다. 붙여넣은 결과의 ## 1~4 제목을 확인해 주세요.` : `AI 초안을 옮겼습니다. 핵심 실행 지표 ${candidates.length}개와 참고 키워드를 분리했습니다.`);
  };

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_21rem] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-blue-50 px-4 py-2 text-sm font-black text-blue-700">
              <span className="text-base">↗</span><span>5단계 팀 현황 파악</span>
            </div>
            <h2 className="mt-8 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">팀 상황을 보고, 이번 2주 실행 초점을 정합니다</h2>
            <p className="mt-6 max-w-4xl text-base font-bold leading-8 text-slate-600">
              오늘은 우리 팀의 문제를 다 해결하려는 시간이 아닙니다. 먼저 이번 2주 동안 볼 실행 기준을 정하고, 그 기준을 잘 움직이게 하려면 팀장이 누구를 어떻게 도와야 할지 정리합니다.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-black text-orange-950">상황 선택 {teamSituations.length} / 2</div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-black text-amber-950">핵심 지표 선택 {selectedCoreMetrics.length}</div>
            <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm font-black text-cyan-950">유형 선택 {selectedMemberIds.length} / 2</div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-950">입력 내용은 자동 저장됩니다</div>
          </div>
        </div>
        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          <GuideBox title="이 단계의 흐름" tone="slate" items={['우리 팀 상황을 고릅니다.', 'AI에게 상황별 실행 지표 후보를 받아옵니다.', '이번 2주 동안 실제로 볼 핵심 실행 지표를 선택합니다.', '지표와 함께 볼 팀원 행동 신호를 생각합니다.', '먼저 도와볼 팀원 유형 2명을 고릅니다.', '각 유형별로 도와야 할 지점과 첫마디를 정리합니다.']} />
          <GuideBox title="이 단계의 원칙" tone="cyan" items={['정답을 찾지 않습니다.', '사람을 평가하지 않습니다.', '이번 2주 동안 볼 기준만 정합니다.', '팀장이 도와야 할 지점을 찾습니다.']} />
        </div>
      </div>

      <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-amber-700">Block 0</p>
        <h3 className="text-lg font-black text-slate-950">팀 현황 파악</h3>
        <p className="mt-2 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-600">우리 팀에서 지금 가장 신경 쓰이는 상황을 고릅니다. 정답을 고르는 것이 아니라, 오늘 실습에서 다룰 장면을 정하는 단계입니다.</p>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <GuideBox title="지금 하는 일" tone="amber" items={['우리 팀과 가까운 상황 2개를 선택합니다.', '우리 팀만의 상황을 한 문장으로 적습니다.', 'AI에게 상황별 핵심 실행 지표 후보를 받아옵니다.', '이번 2주 동안 실제로 볼 지표를 선택합니다.']} />
          <GuideBox title="남길 결과물" items={['이번 2주 동안 우리 팀이 볼 핵심 실행 지표', '지표를 해석할 때 함께 볼 참고 신호', '성급하게 판단하지 않기 위한 확인 질문']} />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border bg-white p-4">
            <h4 className="text-sm font-black text-slate-950">우리 팀 상황 선택</h4>
            <p className="mt-2 text-xs font-bold leading-5 text-slate-600">오늘 실습에서 먼저 다룰 장면 2개를 선택합니다.</p>
            <div className="mt-3 grid gap-2">
              {TEAM_SITUATION_OPTIONS.map((option) => {
                const selected = teamSituations.includes(option);
                const disabled = !selected && teamSituations.length >= MAX_TEAM_SITUATIONS;
                return <label key={option} className={`flex gap-3 rounded-2xl border p-3 text-xs font-bold leading-5 ${selected ? 'border-amber-700 bg-amber-50 text-amber-950' : disabled ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-700'}`}><input type="checkbox" disabled={disabled} checked={selected} onChange={() => toggleTeamSituation(option)} /><span>{option}</span></label>;
              })}
            </div>
            <label className="mt-4 block space-y-1">
              <span className="text-xs font-black text-slate-600">우리 팀만의 상황 한 문장</span>
              <textarea className="min-h-20 w-full rounded-2xl border bg-slate-50 px-3 py-2 text-sm leading-6" value={customSituation} onChange={(event) => setCustomSituation(event.target.value)} placeholder="예: 신규 담당자가 늘어 고객별 맥락을 빠르게 파악하기 어렵다." />
            </label>
          </div>

          <div className="rounded-2xl border bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div><h4 className="text-sm font-black text-slate-950">AI에 물어볼 질문</h4><p className="mt-1 text-xs font-bold leading-5 text-slate-600">상황별 핵심 실행 지표 후보를 뽑는 질문입니다.</p></div>
              <button type="button" className="rounded-2xl bg-amber-700 px-4 py-3 text-sm font-black text-white" onClick={copyPrompt}>{copiedPrompt ? '복사 완료' : 'AI에 물어볼 질문 복사'}</button>
            </div>
            <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{metricPrompt}</pre>
          </div>
        </div>

        <label className="mt-4 block space-y-1">
          <span className="text-xs font-black text-slate-600">AI 초안 붙여넣기</span>
          <textarea className="min-h-28 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6" value={aiMetricSuggestion} onChange={(event) => setAiMetricSuggestion(event.target.value)} placeholder="외부 AI가 정리한 초안을 붙여넣으세요. 핵심 실행 지표만 선택하고 나머지는 참고 카드로 봅니다." />
        </label>
        <div className="mt-3"><button type="button" className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white" onClick={splitAiDraft}>AI 초안에서 후보와 참고 신호 나누기</button><p className="mt-2 text-xs font-bold leading-5 text-slate-600">AI가 제안한 내용은 최종 답이 아닙니다. 후보를 넓게 받아온 뒤, 우리 팀에 맞는 핵심 실행 지표만 선택합니다.</p>{parseNotice && <div className="mt-3 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-amber-800">{parseNotice}</div>}</div>

        <div className="mt-4 rounded-2xl border bg-white p-4">
          <h4 className="text-sm font-black text-slate-950">핵심 실행 지표 선택</h4>
          <p className="mt-1 text-xs font-bold leading-5 text-slate-600">아래 후보 중 이번 2주 동안 실제로 볼 지표를 선택합니다. 많이 고르는 것보다, 팀장이 실제로 확인하고 대화할 수 있는 지표를 고르는 것이 중요합니다.</p>
          <p className="mt-1 text-xs font-black text-amber-700">권장: 2~4개 선택. 단, 우리 팀 상황상 꼭 필요하면 더 선택할 수 있습니다.</p>
          {metricCandidates.length === 0 ? <div className="mt-3 rounded-2xl bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-900">AI 초안을 붙여넣고 “후보와 참고 신호 나누기”를 누르면 상황별 후보가 표시됩니다.</div> : <div className="mt-3 grid gap-3 lg:grid-cols-3">{Object.entries(groupedMetricCandidates).map(([source, candidates]) => <div key={source} className="rounded-2xl border border-amber-100 bg-amber-50 p-3"><p className="text-xs font-black leading-5 text-amber-900">{source}</p><div className="mt-2 grid gap-2">{candidates.map((candidate) => { const selected = selectedCoreMetrics.includes(candidate.label); return <label key={candidate.id} className={`flex min-w-0 gap-3 rounded-2xl border p-3 text-xs font-bold leading-5 ${selected ? 'border-amber-700 bg-white text-amber-950' : 'bg-white/80 text-slate-700'}`}><input type="checkbox" className="mt-1 shrink-0" checked={selected} onChange={() => toggleMetric(candidate.label)} /><span className="min-w-0 flex-1 whitespace-normal break-keep leading-5"><span className="block font-black">{candidate.label}</span>{candidate.reason && <span className="mt-1 block text-[11px] font-bold text-slate-500">{candidate.reason}</span>}</span></label>; })}</div></div>)}</div>}
          <label className="mt-4 block space-y-1"><span className="text-xs font-black text-slate-600">직접 추가할 핵심 실행 지표</span><textarea className="min-h-20 w-full rounded-2xl border bg-slate-50 px-3 py-2 text-sm leading-6" value={extraMetric} onChange={(event) => setExtraMetric(event.target.value)} placeholder="AI 후보에 없지만 꼭 봐야 할 지표가 있으면 짧게 적습니다." /></label>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <ReferenceKeywordCards title="함께 봐야 할 현장 신호" guide="지표를 해석할 때 함께 볼 참고 신호입니다." items={visibleSupportKeywords} emptyText="AI 초안을 분리하면 현장 신호 키워드가 표시됩니다." tone="cyan" />
          <ReferenceKeywordCards title="조심해서 봐야 할 해석" guide="성급하게 판단하지 않기 위한 주의점입니다." items={visibleSafetyKeywords} emptyText="AI 초안을 분리하면 조심할 해석이 표시됩니다." tone="rose" />
          <ReferenceKeywordCards title="팀장이 더 확인할 질문" guide="면담이나 점검에서 던질 질문입니다." items={visibleQuestionKeywords} emptyText="AI 초안을 분리하면 확인 질문이 표시됩니다." tone="violet" />
        </div>
      </div>

      <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Block 1</p>
        <h3 className="text-lg font-black text-slate-950">실행 초점 연결</h3>
        <p className="mt-2 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-600">앞에서 고른 지표는 팀 전체를 보는 기준입니다. 이제 그 지표를 볼 때, 팀원들에게서 어떤 움직임을 함께 살펴봐야 할지 생각합니다.</p>
        <div className="mt-3 grid gap-3 lg:grid-cols-2"><GuideBox title="지금 하는 일" tone="cyan" items={['왜 이 지표를 보려는지 한 문장으로 정리합니다.', '이 지표와 관련해 팀원들에게서 함께 볼 움직임을 적습니다.']} /><GuideBox title="남길 결과물" items={['핵심 실행 지표를 볼 때 함께 살펴볼 팀원 행동 신호']} /></div>
        <div className="mt-3 flex flex-wrap gap-2">{coreMetricItems.length === 0 ? <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500">아직 선택한 핵심 실행 지표가 없습니다</span> : coreMetricItems.map((item) => <span key={item} className="rounded-full bg-white px-3 py-1 text-xs font-black text-cyan-800 shadow-sm">{item}</span>)}</div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2"><label className="block space-y-1"><span className="text-xs font-black text-slate-600">왜 이 지표를 보려고 하나요?</span><textarea className="min-h-24 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6" value={metricRationale} onChange={(event) => setMetricRationale(event.target.value)} placeholder="예: 방문 수보다 방문 이후 다음 행동이 남았는지를 먼저 보고 싶다." /></label><label className="block space-y-1"><span className="text-xs font-black text-slate-600">이 지표와 관련해 팀원들에게서 어떤 움직임을 살펴봐야 할까요?</span><textarea className="min-h-24 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6" value={behaviorBridge} onChange={(event) => setBehaviorBridge(event.target.value)} placeholder="예: 방문은 했지만 다음 약속이나 고객 질문이 남지 않는다. 신규 고객 접촉을 미루거나, 제약요인을 혼자 안고 있다." /></label></div>
      </div>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Block 2</p>
        <h3 className="text-lg font-black text-slate-950">팀원 실행신호 보기: 먼저 도와볼 유형 고르기</h3>
        <p className="mt-2 rounded-2xl bg-cyan-50 p-3 text-xs font-bold leading-5 text-cyan-900">앞에서 고른 핵심 실행 지표를 떠올리며, 우리 팀에서 비슷한 행동 신호를 보이는 유형 2명을 선택합니다. 사람을 평가하는 것이 아니라, 팀장이 먼저 도와볼 지점을 찾는 단계입니다.</p>
        <div className="mt-3 grid gap-3 lg:grid-cols-2"><GuideBox title="카드 읽는 법" tone="cyan" items={['실제 인물을 맞히는 단계가 아닙니다.', '사람 이름보다 행동 신호를 봅니다.', '우리 팀에 정확히 같은 사람이 없어도 비슷한 움직임이 보이면 선택합니다.']} /><GuideBox title="남길 결과물" items={['실제로 보이는 행동 신호', '팀장이 도와야 할 지점', '팀원에게 꺼낼 첫마디']} /></div>
        <div className="mt-3 flex flex-wrap gap-2">{coreMetricItems.map((item) => <span key={item} className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-800">{item}</span>)}</div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">{TEAM_MEMBERS.map((member) => { const selected = selectedMemberIds.includes(member.id); const disabled = !selected && selectedMemberIds.length >= 2; return <MemberSignalCard key={member.id} member={member} selected={selected} disabled={disabled} onToggle={() => toggleMember(member.id)} />; })}</div>

        <div className="mt-6 rounded-3xl border bg-slate-50 p-4">
          <h4 className="text-sm font-black text-slate-950">선택한 유형별 다음 행동 준비</h4>
          <p className="mt-1 text-xs font-bold leading-5 text-slate-600">선택한 2명에 대해서만 간단히 정리합니다. 긴 분석보다 실제 대화와 지원으로 이어지는 문장을 남깁니다.</p>
          {selectedMembers.length === 0 ? <div className="mt-3 rounded-2xl bg-white p-4 text-sm font-bold text-slate-600">먼저 위 카드에서 우리 팀과 비슷한 유형 2명을 선택하세요.</div> : <div className="mt-4 grid gap-4 lg:grid-cols-2">{selectedMembers.map((member) => { const current = memberPreps[member.id] ?? createEmptyV38MemberPrep(); return <article key={member.id} className="rounded-3xl border bg-white p-4"><h5 className="text-base font-black text-slate-950">{member.name}</h5><label className="mt-3 block space-y-1"><span className="text-xs font-black text-slate-600">실제로 보이는 행동 신호</span><p className="text-[11px] font-bold text-slate-500">관찰 가능한 행동으로 적습니다. 성격이나 태도 평가로 쓰지 않습니다.</p><textarea className="min-h-20 w-full rounded-2xl border bg-slate-50 px-3 py-2 text-sm leading-6" value={current.observedSignal} onChange={(event) => updatePrep(member.id, 'observedSignal', event.target.value)} placeholder="예: 방문은 빠르지만 방문 후 기록과 다음 행동 정리가 늦다." /></label><label className="mt-3 block space-y-1"><span className="text-xs font-black text-slate-600">팀장이 도와야 할 지점</span><p className="text-[11px] font-bold text-slate-500">지시보다 지원 관점으로 적습니다.</p><textarea className="min-h-20 w-full rounded-2xl border bg-slate-50 px-3 py-2 text-sm leading-6" value={current.concernSignal} onChange={(event) => updatePrep(member.id, 'concernSignal', event.target.value)} placeholder="예: 방문 후 24시간 안에 고객 반응과 다음 행동을 정리하게 돕는다." /></label><label className="mt-3 block space-y-1"><span className="text-xs font-black text-slate-600">팀원에게 꺼낼 첫마디</span><p className="text-[11px] font-bold text-slate-500">평가하거나 추궁하는 말이 아니라, 함께 보자는 말로 시작합니다.</p><textarea className="min-h-20 w-full rounded-2xl border bg-slate-50 px-3 py-2 text-sm leading-6" value={current.finalPrep} onChange={(event) => updatePrep(member.id, 'finalPrep', event.target.value)} placeholder="예: 이번에는 방문 수보다 방문 뒤에 무엇이 남았는지를 같이 보려고 합니다." /></label></article>; })}</div>}
        </div>
      </div>
    </section>
  );
}
