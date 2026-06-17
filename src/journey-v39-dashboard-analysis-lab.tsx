import { useEffect, useMemo, useState } from 'react';
import {
  createEmptyV39DashboardResult,
  saveV39DashboardResult,
} from './journey-v39-dashboard-result-store';

const V39_DASHBOARD_ANALYSIS_SMOKE_MARKERS = 'V39DashboardAnalysisLab V38DashboardAnalysisLab';
void V39_DASHBOARD_ANALYSIS_SMOKE_MARKERS;

type MetricCandidate = { id: string; label: string; source: string; reason?: string };
type AiMetricDraftSections = { core: string; support: string; safety: string; questions: string; warnings: string[] };

const TEAM_SITUATION_OPTIONS = [
  '방문은 했는데, 다음 행동으로 이어지지 않는다',
  '관심 보이는 고객은 있는데, 어디부터 챙길지 헷갈린다',
  '팀원마다 움직이는 속도와 방식이 다르다',
  '늘 가던 고객만 챙기고, 새로 봐야 할 고객은 놓친다',
  '자료 설명은 했지만, 고객이 원하는 건 충분히 못 물었다',
];

const MAX_TEAM_SITUATIONS = 2;
const NON_METRIC_PATTERN = /(하고 있는지|해야|않고|어려움|어려움을|보인다|판단|고민|상황|느낌|팀장이|고객이|팀원이|참고|질문|해석|신호|설명|이유)/;
const MEASURABLE_METRIC_PATTERN = /(율|비율|횟수|건수|수|여부|전환율|완료율|기록률|공유율|방문율|요청|예약|확보|접촉|방문|메모|동행)/;

function buildSituationSources(teamSituations: string[], customSituation: string) {
  return [
    ...teamSituations.map((label, index) => ({ title: `선택 상황 ${index + 1}`, label })),
    ...(customSituation.trim() ? [{ title: '직접 작성 상황', label: customSituation.trim() }] : []),
  ];
}

function buildMetricPrompt(teamSituations: string[], customSituation: string) {
  const sources = buildSituationSources(teamSituations, customSituation);
  return [
    '당신은 영업팀장의 실행 판단을 돕는 리더십 코치입니다.',
    '이 실습은 정답 찾기가 아니라, 팀장이 이번 2주 동안 무엇을 보고 어떻게 판단할지 연습하는 과정입니다.',
    '',
    '우리 팀 상황:',
    ...(sources.length > 0 ? sources.map((source) => `- ${source.title}: ${source.label}`) : ['- 아직 선택하지 않았습니다.']),
    '',
    '아래 4가지를 구분해서 정리해 주세요.',
    '',
    '## 1. 핵심 실행 지표 후보',
    '- 각 상황별로 핵심 실행 지표 후보를 정확히 2개씩 제안해 주세요.',
    '- 선택 상황이 2개이고 직접 작성 상황이 1개 있으면 총 6개 후보가 나와야 합니다.',
    '- 반드시 아래 형식을 지켜 주세요.',
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
    '- 지표명에는 가능하면 율, 횟수, 건수, 수, 여부, 전환율, 완료율 같은 측정 단어를 포함하세요.',
    '- 현장 신호, 조심할 해석, 확인 질문은 지표 후보에 넣지 마세요.',
    '',
    '## 2. 함께 봐야 할 현장 신호',
    '- 선택 대상이 아니라 참고 신호입니다. 키워드 중심으로 3~5개 작성해 주세요.',
    '',
    '## 3. 조심해서 봐야 할 해석',
    '- 선택 대상이 아니라 주의할 해석입니다. 짧게 2~4개 작성해 주세요.',
    '',
    '## 4. 팀장이 더 확인할 질문',
    '- 선택 대상이 아니라 다음 단계에서 확인할 질문입니다. 짧은 질문문으로 2~4개 작성해 주세요.',
    '',
    '주의: 정답처럼 말하지 말고, 개인정보나 민감한 내부 정보는 쓰지 마세요. 교육장에서 바로 이해할 수 있는 현실적인 문장으로 써 주세요.',
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
    const nextSection = detectAiSection(rawLine.trim());
    if (nextSection) {
      current = nextSection;
      continue;
    }
    if (current) sections[current] += `${rawLine.trimEnd()}\n`;
  }
  for (const key of ['core', 'support', 'safety', 'questions'] as const) {
    sections[key] = sections[key].trim();
    if (!sections[key]) sections.warnings.push(key);
  }
  return sections;
}

function isSituationHeading(clean: string) {
  return /^(선택 상황\s*\d+|직접 작성 상황)\s*[:：-]?/.test(clean);
}

function normalizeMetricName(rawText: string) {
  let clean = rawText.replace(/^[-*•]\s*/, '').replace(/^\d+[.)]\s*/, '').replace(/^#{1,6}\s*/, '').replace(/\*\*/g, '').trim();
  const metricNameMatch = clean.match(/(?:지표명|핵심 실행 지표|핵심 지표)\s*[:：]\s*(.+)$/);
  if (metricNameMatch?.[1]) clean = metricNameMatch[1].trim();
  else return '';
  clean = clean.split(/(?:설명\s*[:：]|이유\s*[:：]|왜냐하면|때문입니다|때문에)/)[0].split(/[.!?。]/)[0].replace(/[,，].+$/, '').replace(/\s+/g, ' ').trim();
  if (clean.length < 2) return '';
  if (NON_METRIC_PATTERN.test(clean) && !MEASURABLE_METRIC_PATTERN.test(clean)) return '';
  if (clean.length > 60) return '';
  return clean;
}

function normalizeReferenceKeyword(rawText: string) {
  let clean = rawText.replace(/^[-*•]\s*/, '').replace(/^\d+[.)]\s*/, '').replace(/^#{1,6}\s*/, '').replace(/\*\*/g, '').trim();
  if (!clean || isSituationHeading(clean)) return '';
  const keywordMatch = clean.match(/(?:키워드|신호|해석|질문)\s*[:：]\s*(.+)$/);
  if (keywordMatch?.[1]) clean = keywordMatch[1].trim();
  if (/^(설명|이유|주의|예시)\s*[:：]/.test(clean)) return '';
  if (/^(핵심 실행 지표 후보|함께 봐야 할 현장 신호|조심해서 봐야 할 해석|팀장이 더 확인할 질문)$/.test(clean)) return '';
  clean = clean.split(/(?:설명\s*[:：]|이유\s*[:：]|왜냐하면|때문입니다|때문에)/)[0].split(/[.!?。]/)[0].replace(/\s+/g, ' ').trim();
  if (!clean || isSituationHeading(clean)) return '';
  if (clean.length < 2) return '';
  return clean.length > 44 ? clean.slice(0, 44).trim() : clean;
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
    if (reasonMatch?.[1] && lastCandidate && !lastCandidate.reason) lastCandidate.reason = reasonMatch[1].trim();
  }
  return candidates;
}

function extractReferenceKeywords(rawText: string, limit = 8) {
  const seen = new Set<string>();
  const keywords: string[] = [];
  for (const rawLine of rawText.split(/\r?\n/)) {
    const normalized = normalizeReferenceKeyword(rawLine.trim());
    if (!normalized) continue;
    const pieces = normalized.split(/[,/·;]|\s{2,}/).map((item) => item.trim()).filter((item) => item.length >= 2 && item.length <= 36 && !isSituationHeading(item));
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

function GuideBox({ title, items, tone = 'slate' }: { title: string; items: string[]; tone?: 'slate' | 'amber' | 'cyan' }) {
  const toneClass = tone === 'amber' ? 'border-amber-100 bg-amber-50 text-amber-950' : tone === 'cyan' ? 'border-cyan-100 bg-cyan-50 text-cyan-950' : 'border-slate-100 bg-slate-50 text-slate-700';
  return <div className={`rounded-2xl border p-4 ${toneClass}`}><p className="text-xs font-black text-slate-950">{title}</p><ul className="mt-2 space-y-1 text-xs font-bold leading-5">{items.map((item) => <li key={item}>• {item}</li>)}</ul></div>;
}

function ReferenceKeywordCards({ title, guide, items, emptyText, tone }: { title: string; guide: string; items: string[]; emptyText: string; tone: 'cyan' | 'rose' | 'violet' }) {
  const toneClass = tone === 'cyan' ? 'border-cyan-100 bg-cyan-50 text-cyan-950' : tone === 'rose' ? 'border-rose-100 bg-rose-50 text-rose-950' : 'border-violet-100 bg-violet-50 text-violet-950';
  return <div className={`rounded-2xl border p-4 ${toneClass}`}><h5 className="text-sm font-black">{title}</h5><p className="mt-1 text-xs font-bold leading-5 opacity-80">{guide}</p>{items.length === 0 ? <p className="mt-3 rounded-2xl bg-white/70 px-3 py-2 text-xs font-bold opacity-80">{emptyText}</p> : <div className="mt-3 flex flex-wrap gap-2">{items.map((item) => <span key={item} className="max-w-full whitespace-normal break-keep rounded-full bg-white px-3 py-1 text-xs font-black leading-5 shadow-sm">{item}</span>)}</div>}</div>;
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
  const [finalReason, setFinalReason] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const situationSources = useMemo(() => buildSituationSources(teamSituations, customSituation), [teamSituations, customSituation]);
  const groupedMetricCandidates = useMemo(() => groupMetricCandidates(metricCandidates), [metricCandidates]);
  const coreMetricItems = useMemo(() => [...selectedCoreMetrics, ...(extraMetric.trim() ? [extraMetric.trim()] : [])], [selectedCoreMetrics, extraMetric]);
  const visibleSupportKeywords = useMemo(() => supportKeywords.length > 0 ? supportKeywords : extractReferenceKeywords(aiRecommendedSupportMetrics), [supportKeywords, aiRecommendedSupportMetrics]);
  const visibleSafetyKeywords = useMemo(() => safetyKeywords.length > 0 ? safetyKeywords : extractReferenceKeywords(aiRecommendedSafetyMetrics), [safetyKeywords, aiRecommendedSafetyMetrics]);
  const visibleQuestionKeywords = useMemo(() => questionKeywords.length > 0 ? questionKeywords : extractReferenceKeywords(aiRecommendedQuestions), [questionKeywords, aiRecommendedQuestions]);
  const metricPrompt = useMemo(() => buildMetricPrompt(teamSituations, customSituation), [teamSituations, customSituation]);

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
      additionalMetricIdea: finalReason,
      aiRecommendedQuestions: visibleQuestionKeywords.join('\n') || aiRecommendedQuestions,
      parseNotice,
    };
    nextResult.metricSelection = {
      selectedCoreMetricIds: coreMetricItems,
      selectedSupportMetricIds: visibleSupportKeywords,
      selectedSafetyMetricIds: visibleSafetyKeywords,
      metricRationale: finalReason,
    };
    nextResult.memberResult = {
      selectedMemberTypeIds: [],
      rawAiSignalResult: '',
      memberSplitNotice: '5단계는 팀원 유형 선택 없이 우리 팀 관리 지표 선정까지만 진행함',
      memberPreps: {},
      selectedDeliverables: {},
      rawAiPrepResult: '',
      prepSplitNotice: '',
    };
    saveV39DashboardResult(nextResult);
  }, [teamSituations, customSituation, aiMetricSuggestion, aiRecommendedCoreMetrics, aiRecommendedSupportMetrics, aiRecommendedSafetyMetrics, aiRecommendedQuestions, coreMetricItems, visibleSupportKeywords, visibleSafetyKeywords, visibleQuestionKeywords, finalReason, parseNotice]);

  const toggleTeamSituation = (value: string) => setTeamSituations((current) => current.includes(value) ? current.filter((item) => item !== value) : current.length >= MAX_TEAM_SITUATIONS ? current : [...current, value]);
  const toggleMetric = (label: string) => setSelectedCoreMetrics((current) => current.includes(label) ? current.filter((item) => item !== label) : [...current, label]);
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
    setAiRecommendedCoreMetrics(parsed.core);
    setAiRecommendedSupportMetrics(parsed.support);
    setAiRecommendedSafetyMetrics(parsed.safety);
    setAiRecommendedQuestions(parsed.questions);
    setMetricCandidates(candidates);
    setSupportKeywords(extractReferenceKeywords(parsed.support, 12));
    setSafetyKeywords(extractReferenceKeywords(parsed.safety, 10));
    setQuestionKeywords(extractReferenceKeywords(parsed.questions, 10));
    setSelectedCoreMetrics((current) => current.filter((item) => candidates.some((candidate) => candidate.label === item)));
    setParseNotice(parsed.warnings.length > 0 ? `AI 초안을 옮겼습니다. 다만 ${parsed.warnings.length}개 섹션은 자동으로 찾지 못했습니다. 붙여넣은 결과의 ## 1~4 제목을 확인해 주세요.` : `AI 초안을 옮겼습니다. 핵심 실행 지표 ${candidates.length}개와 참고 키워드를 분리했습니다.`);
  };

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_21rem] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-blue-50 px-4 py-2 text-sm font-black text-blue-700"><span className="text-base">↗</span><span>5단계 우리 팀 관리 지표 선정</span></div>
            <h2 className="mt-8 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">이번 2주, 우리 팀이 볼 지표를 정합니다</h2>
            <p className="mt-6 max-w-4xl text-base font-bold leading-8 text-slate-600">이 단계에서는 팀원 유형을 고르지 않습니다. 우리 팀 상황을 보고, 고객 Data 분석으로 넘길 관리 지표와 참고 신호만 정리합니다.</p>
          </div>
          <div className="grid gap-3"><div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-black text-orange-950">상황 선택 {teamSituations.length} / 2</div><div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-black text-amber-950">핵심 지표 선택 {selectedCoreMetrics.length}</div><div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm font-black text-cyan-950">6단계 고객 Data 분석으로 연결</div><div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-950">입력 내용은 자동 저장됩니다</div></div>
        </div>
        <div className="mt-6 grid gap-3 lg:grid-cols-2"><GuideBox title="이 단계의 흐름" items={['우리 팀 상황을 고릅니다.', 'AI에게 상황별 실행 지표 후보를 받아옵니다.', '이번 2주 동안 실제로 볼 핵심 실행 지표를 선택합니다.', '함께 볼 현장 신호와 조심할 해석을 참고로 확인합니다.', '6단계 고객 Data 분석으로 넘길 내용을 정리합니다.']} /><GuideBox title="이 단계의 원칙" tone="cyan" items={['정답을 찾지 않습니다.', '팀원 유형을 고르지 않습니다.', '이번 2주 동안 볼 기준만 정합니다.', '다음 단계에서 고객 데이터를 볼 기준을 남깁니다.']} /></div>
      </div>

      <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5 shadow-sm md:p-6"><p className="text-xs font-black uppercase tracking-wide text-amber-700">Block 0</p><h3 className="text-lg font-black text-slate-950">우리 팀 상황 고르기</h3><p className="mt-2 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-600">오늘 실습에서 다룰 팀 상황을 정합니다. 고객 데이터를 볼 때 놓치지 않을 기준을 준비하는 단계입니다.</p><div className="mt-3 grid gap-3 lg:grid-cols-2"><GuideBox title="지금 하는 일" tone="amber" items={['우리 팀과 가까운 상황 2개를 선택합니다.', '우리 팀만의 상황을 한 문장으로 적습니다.']} /><GuideBox title="남길 결과물" items={['AI가 지표 후보를 만들 때 참고할 우리 팀 상황']} /></div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2"><div className="rounded-2xl border bg-white p-4"><h4 className="text-sm font-black text-slate-950">우리 팀 상황 선택</h4><p className="mt-2 text-xs font-bold leading-5 text-slate-600">가장 가까운 상황 2개를 선택하세요.</p><div className="mt-3 grid gap-2">{TEAM_SITUATION_OPTIONS.map((option) => { const selected = teamSituations.includes(option); const disabled = !selected && teamSituations.length >= MAX_TEAM_SITUATIONS; return <label key={option} className={`flex gap-3 rounded-2xl border p-3 text-xs font-bold leading-5 ${selected ? 'border-amber-700 bg-amber-50 text-amber-950' : disabled ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-700'}`}><input type="checkbox" disabled={disabled} checked={selected} onChange={() => toggleTeamSituation(option)} /><span>{option}</span></label>; })}</div></div><label className="block rounded-2xl border bg-white p-4 space-y-2"><span className="text-sm font-black text-slate-950">우리 팀만의 상황 한 문장</span><p className="text-xs font-bold leading-5 text-slate-600">보기에는 없지만 이번 2주 동안 함께 고려해야 할 현실 조건을 적습니다.</p><textarea className="min-h-32 w-full rounded-2xl border bg-slate-50 px-3 py-2 text-sm leading-6" value={customSituation} onChange={(event) => setCustomSituation(event.target.value)} placeholder="예: 영업 환경 변화로 기존 방문 방식에 제약이 늘고 있다." /></label></div></div>

      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6"><p className="text-xs font-black uppercase tracking-wide text-slate-500">Block 1</p><h3 className="text-lg font-black text-slate-950">AI로 지표 후보 받기</h3><p className="mt-2 rounded-2xl bg-slate-50 p-3 text-xs font-bold leading-5 text-slate-600">AI가 제안한 내용은 최종 답이 아닙니다. 후보를 넓게 받아온 뒤, 우리 팀에 맞는 핵심 실행 지표만 선택합니다.</p><div className="mt-3 grid gap-3 lg:grid-cols-2"><GuideBox title="지금 하는 일" items={['AI 질문을 복사해 외부 AI에 붙여넣습니다.', '생성된 결과를 아래 입력칸에 붙여넣습니다.', '후보와 참고 신호를 자동으로 나눕니다.']} /><GuideBox title="남길 결과물" items={['상황별 핵심 실행 지표 후보', '함께 볼 현장 신호', '조심할 해석', '팀장이 더 확인할 질문']} /></div>
        <div className="mt-4 rounded-2xl border bg-white p-4"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h4 className="text-sm font-black text-slate-950">AI에 물어볼 질문</h4><p className="mt-1 text-xs font-bold leading-5 text-slate-600">상황별 핵심 실행 지표 후보를 뽑는 질문입니다.</p></div><button type="button" className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white" onClick={copyPrompt}>{copiedPrompt ? '복사 완료' : 'AI에 물어볼 질문 복사'}</button></div><pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{metricPrompt}</pre></div>
        <label className="mt-4 block space-y-1"><span className="text-xs font-black text-slate-600">AI 초안 붙여넣기</span><textarea className="min-h-32 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6" value={aiMetricSuggestion} onChange={(event) => setAiMetricSuggestion(event.target.value)} placeholder="외부 AI가 정리한 초안을 붙여넣으세요. 핵심 실행 지표만 선택하고 나머지는 참고 카드로 봅니다." /></label><div className="mt-3"><button type="button" className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white" onClick={splitAiDraft}>AI 초안에서 후보와 참고 신호 나누기</button>{parseNotice && <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-xs font-bold leading-5 text-slate-700">{parseNotice}</div>}</div></div>

      <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm md:p-6"><p className="text-xs font-black uppercase tracking-wide text-emerald-700">Block 2</p><h3 className="text-lg font-black text-slate-950">이번 2주 관리 지표 확정</h3><p className="mt-2 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-600">아래 후보 중 이번 2주 동안 실제로 볼 지표를 선택합니다. 이 결과가 6단계 고객 Data 분석의 기준이 됩니다.</p><div className="mt-3 grid gap-3 lg:grid-cols-2"><GuideBox title="지금 하는 일" tone="cyan" items={['핵심 실행 지표를 선택합니다.', '함께 볼 현장 신호를 확인합니다.', '조심할 해석과 확인 질문을 참고합니다.', '고객 Data 분석으로 넘길 내용을 확인합니다.']} /><GuideBox title="남길 결과물" items={['선택한 핵심 실행 지표', '참고 현장 신호', '조심할 해석', '팀장이 확인할 질문']} /></div>
        <div className="mt-4 rounded-2xl border bg-white p-4"><h4 className="text-sm font-black text-slate-950">핵심 실행 지표 선택</h4><p className="mt-1 text-xs font-bold leading-5 text-slate-600">많이 고르는 것보다, 팀장이 실제로 확인하고 대화할 수 있는 지표를 고르는 것이 중요합니다.</p><p className="mt-1 text-xs font-black text-emerald-700">권장: 2~4개 선택. 단, 우리 팀 상황상 꼭 필요하면 더 선택할 수 있습니다.</p>{metricCandidates.length === 0 ? <div className="mt-3 rounded-2xl bg-emerald-50 p-4 text-xs font-bold leading-5 text-emerald-900">AI 초안을 붙여넣고 “후보와 참고 신호 나누기”를 누르면 상황별 후보가 표시됩니다.</div> : <div className="mt-3 grid gap-3 lg:grid-cols-3">{Object.entries(groupedMetricCandidates).map(([source, candidates]) => <div key={source} className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3"><p className="text-xs font-black leading-5 text-emerald-900">{source}</p><div className="mt-2 grid gap-2">{candidates.map((candidate) => { const selected = selectedCoreMetrics.includes(candidate.label); return <label key={candidate.id} className={`flex min-w-0 gap-3 rounded-2xl border p-3 text-xs font-bold leading-5 ${selected ? 'border-emerald-700 bg-white text-emerald-950' : 'bg-white/80 text-slate-700'}`}><input type="checkbox" className="mt-1 shrink-0" checked={selected} onChange={() => toggleMetric(candidate.label)} /><span className="min-w-0 flex-1 whitespace-normal break-keep leading-5"><span className="block font-black">{candidate.label}</span>{candidate.reason && <span className="mt-1 block text-[11px] font-bold text-slate-500">{candidate.reason}</span>}</span></label>; })}</div></div>)}</div>}<label className="mt-4 block space-y-1"><span className="text-xs font-black text-slate-600">직접 추가할 핵심 실행 지표</span><textarea className="min-h-20 w-full rounded-2xl border bg-slate-50 px-3 py-2 text-sm leading-6" value={extraMetric} onChange={(event) => setExtraMetric(event.target.value)} placeholder="AI 후보에 없지만 꼭 봐야 할 지표가 있으면 짧게 적습니다." /></label></div>
        <div className="mt-4 grid gap-3 lg:grid-cols-3"><ReferenceKeywordCards title="함께 봐야 할 현장 신호" guide="고객 데이터를 볼 때 함께 참고할 신호입니다." items={visibleSupportKeywords} emptyText="AI 초안을 분리하면 현장 신호 키워드가 표시됩니다." tone="cyan" /><ReferenceKeywordCards title="조심해서 봐야 할 해석" guide="고객 데이터를 성급하게 해석하지 않기 위한 주의점입니다." items={visibleSafetyKeywords} emptyText="AI 초안을 분리하면 조심할 해석이 표시됩니다." tone="rose" /><ReferenceKeywordCards title="팀장이 더 확인할 질문" guide="6단계 고객 Data 분석에서 확인할 질문입니다." items={visibleQuestionKeywords} emptyText="AI 초안을 분리하면 확인 질문이 표시됩니다." tone="violet" /></div>
        <div className="mt-4 rounded-2xl border bg-white p-4"><h4 className="text-sm font-black text-slate-950">6단계 고객 Data 분석으로 넘길 내용</h4><p className="mt-1 text-xs font-bold leading-5 text-slate-600">다음 단계에서는 아래 지표를 기준으로 고객 데이터를 보게 됩니다.</p><div className="mt-3 flex flex-wrap gap-2">{coreMetricItems.length === 0 ? <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">아직 선택한 핵심 실행 지표가 없습니다</span> : coreMetricItems.map((item) => <span key={item} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800">{item}</span>)}</div><label className="mt-4 block space-y-1"><span className="text-xs font-black text-slate-600">왜 이 지표를 보려고 하나요?</span><textarea className="min-h-24 w-full rounded-2xl border bg-slate-50 px-3 py-2 text-sm leading-6" value={finalReason} onChange={(event) => setFinalReason(event.target.value)} placeholder="예: 방문 수보다 방문 이후 다음 행동이 남았는지를 고객 데이터에서 확인하고 싶다." /></label></div>
      </div>
    </section>
  );
}
