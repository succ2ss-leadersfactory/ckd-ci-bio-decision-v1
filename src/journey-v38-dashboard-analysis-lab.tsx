import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';

const TEAM_MEMBERS = [
  { id: 'M01', name: '신재영 대리', profile: '접점 활동 적극 수행', observation: '고객 접점 활동이 많고 이동 동선도 넓다. 회의에서는 “저는 누구보다 많이 움직이고 있다”고 말하지만, 방문 이후 어떤 대화가 이어졌는지는 설명이 짧다.', signals: ['계획 접점 실행률 112%', '핵심 고객군 커버리지 96%', '후속 대화 연결지수 54', 'CRM 기록 품질 64', '컴플라이언스 위험 점검: 주의'] },
  { id: 'M02', name: '이대은 대리', profile: '담당처 자율 관리 성향', observation: '고객과의 관계와 후속 대화는 안정적이다. 다만 팀 회의에서는 자신의 방식 공유를 부담스러워하고, 동료의 질문에는 “각자 담당처는 본인이 책임지는 것”이라고 선을 긋는다.', signals: ['후속 대화 연결지수 128', '고객 인게이지먼트 지수 84', '팀 학습 기여도 42', '실행 인사이트 재사용도 38', 'AI 입력 안전 점검: 안전'] },
  { id: 'M03', name: '박재욱 사원', profile: '신규 역할 적응 중', observation: 'CRM 기록은 꼼꼼하게 남기지만 고객 앞에서는 질문이 짧아진다. 방문 전 준비 자료는 많지만, 실제 대화에서 고객의 참여를 끌어내는 데 어려움을 느낀다.', signals: ['CRM 기록 품질 90', '고객 인게이지먼트 지수 51', '후속 대화 연결지수 48', '팀 학습 기여도 70', '컴플라이언스 위험 점검: 안전'] },
  { id: 'M04', name: '유희관 과장', profile: '장기 담당처 관계 보유', observation: '담당처와의 관계는 안정적이다. 그러나 새로운 기록 기준이나 실행 방식이 나오면 “현장에서는 그런 방식이 잘 안 맞는다”고 말하며 신중한 태도를 보인다.', signals: ['핵심 고객군 커버리지 92%', '고객 대화 지속성 86', 'CRM 기록 품질 55', '팀 학습 기여도 58', '컴플라이언스 위험 점검: 주의'] },
  { id: 'M05', name: '김문호 차장', profile: '최근 목표 압박을 크게 느낌', observation: '최근 목표 압박을 크게 느끼며 지역 상황과 외부 요인을 자주 언급한다. 실행 변수 중 자신이 바꿀 수 있는 것에 대해서는 말을 아끼는 편이다.', signals: ['실행 적시성 59', '후속조치 실행률 52', '고객 인게이지먼트 지수 56', '사전 인사이트 준비도 60', '컴플라이언스 위험 점검: 안전'] },
  { id: 'M06', name: '김재호 차장', profile: '현장 요청 대응 속도 강점', observation: '현장 요청에는 빠르게 대응하지만 사후 기록과 후속 실행 정리가 뒤로 밀리는 경향이 있다. 즉흥 대응은 강하지만 팀장 판단에 필요한 기록은 부족하다.', signals: ['실행 적시성 88', '고객 대화 지속성 82', 'CRM 기록 품질 50', '후속조치 실행률 57', 'AI 입력 안전 점검: 안전'] },
];

const TEAM_SITUATION_OPTIONS = ['활동량은 충분한데 고객 반응이 약하다', '방문 후 후속조치가 잘 이어지지 않는다', 'CRM 기록은 있지만 실행 판단에 도움이 부족하다', '팀원별 실행 편차가 크다', '기존 방식에 익숙해 새 실행 기준 적용이 느리다', '컴플라이언스 안전선이 걱정된다', '팀 학습과 노하우 공유가 부족하다'];

const METRIC_OPTIONS = [
  { id: 'contact', name: '계획 접점 실행률', group: '활동 실행', meaning: '계획한 실행이 실제로 이루어졌는지 본다.', caution: '활동량이 높다고 성과가 좋다고 단정하지 않는다.', safety: false },
  { id: 'coverage', name: '핵심 고객군 커버리지', group: '고객 커버리지', meaning: '우선순위 고객군을 놓치지 않았는지 본다.', caution: '커버리지가 높아도 대화 품질은 별도 확인한다.', safety: false },
  { id: 'engagement', name: '고객 인게이지먼트 지수', group: '고객 반응', meaning: '고객의 질문·관심·후속 반응 신호를 본다.', caution: '낮다고 팀원 역량 부족으로 단정하지 않는다.', safety: false },
  { id: 'followTalk', name: '후속 대화 연결지수', group: '후속 연결', meaning: '방문 이후 다음 대화로 이어졌는지 본다.', caution: '단기 숫자만으로 관계 품질을 판단하지 않는다.', safety: false },
  { id: 'followAction', name: '후속조치 실행률', group: '실행 품질', meaning: '약속한 다음 행동이 실행됐는지 본다.', caution: '실행 지연의 외부 변수와 지원 필요성도 확인한다.', safety: false },
  { id: 'crm', name: 'CRM 기록 품질', group: '기록 품질', meaning: '팀장 판단에 필요한 기록이 남았는지 본다.', caution: '기록 부족을 성의 부족으로 단정하지 않는다.', safety: false },
  { id: 'learning', name: '팀 학습 기여도', group: '학습 확산', meaning: '개인 경험이 팀 학습으로 전환되는지 본다.', caution: '공유가 낮다고 협업 의지 부족으로 단정하지 않는다.', safety: false },
  { id: 'reuse', name: '실행 인사이트 재사용도', group: '재사용성', meaning: '좋은 실행 방식이 동료에게 재사용 가능한지 본다.', caution: '개인 방식과 팀 표준화 가능성을 구분한다.', safety: false },
  { id: 'compliance', name: '컴플라이언스 위험 점검', group: '안전선', meaning: '부적절한 표현이나 민감정보 사용 가능성을 점검한다.', caution: '주의 신호를 개인 문제로 낙인찍지 않는다.', safety: true },
  { id: 'aiSafety', name: 'AI 입력 안전 점검', group: 'AI 활용 안전', meaning: 'AI에 입력하면 안 되는 정보가 걸러졌는지 본다.', caution: '안전 점검은 감시가 아니라 보호 장치로 설명한다.', safety: true },
];

const ACTION_OUTPUT_OPTIONS = ['1on1 면담 질문', '이번 주 코칭 포인트', '실행 점검 기준', '강점 활용 역할 제안', '우려 신호 확인 질문', '팀 회의 공유용 학습 포인트', '컴플라이언스 안전선 점검 문장', '후속 대화 연결 코칭 질문', '방문 후 기록 점검표', '고객 질문 연습 스크립트', '통제 가능한 실행 변수 찾기 질문', '작은 실행 약속 카드'];
const FORBIDDEN_ITEMS = ['실제 고객명·병원명·의료진명', '제품명 또는 미승인 표현', '실제 매출·내부 전략 수치', '개인정보·민감정보', '부적절한 권유나 비교 우위처럼 보이는 표현', '팀원에 대한 단정적 낙인 표현'];

type MemberPrep = { observedSignal: string; strengthSignal: string; concernSignal: string; checkQuestion: string; doNotAssume: string; aiDraft: string; finalPrep: string };
type PrepState = Record<string, MemberPrep>;
type DeliverableState = Record<string, string[]>;
type MetricSectionKey = 'core' | 'support' | 'safety' | 'excluded' | 'additional' | 'questions';
type MetricParseResult = Record<MetricSectionKey, string> & { warnings: string[] };

function emptyPrep(): MemberPrep { return { observedSignal: '', strengthSignal: '', concernSignal: '', checkQuestion: '', doNotAssume: '', aiDraft: '', finalPrep: '' }; }
function metricNames(ids: string[]) { return ids.map((id) => METRIC_OPTIONS.find((item) => item.id === id)?.name ?? id); }
function getSuggestedDeliverables(memberId: string) { const map: Record<string, string[]> = { M01: ['후속 대화 연결 코칭 질문', '방문 후 기록 점검표'], M02: ['강점 활용 역할 제안', '팀 회의 공유용 학습 포인트'], M03: ['고객 질문 연습 스크립트', '1on1 면담 질문'], M04: ['컴플라이언스 안전선 점검 문장', '우려 신호 확인 질문'], M05: ['통제 가능한 실행 변수 찾기 질문', '작은 실행 약속 카드'], M06: ['실행 점검 기준', '방문 후 기록 점검표'] }; return map[memberId] ?? []; }
function cleanMarkdown(text: string) { return text.replace(/<[^>]+>/g, '').replace(/[*`>#]/g, '').replace(/&nbsp;/g, ' ').trim(); }
function isTableSeparator(line: string) { return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim()); }
function parseTableCells(line: string) { return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cleanMarkdown(cell)); }
function classifyMetricHeading(line: string): MetricSectionKey | null {
  const title = cleanMarkdown(line).replace(/^\d+\.?\s*/, '');
  if (!title) return null;
  if (/질문|면담/.test(title)) return 'questions';
  if (/맞지|제외|채택|역효과/.test(title)) return 'excluded';
  if (/추가|중장기|생각해볼/.test(title)) return 'additional';
  if (/안전선|컴플라이언스|리스크/.test(title)) return 'safety';
  if (/보완|보조|함께/.test(title)) return 'support';
  if (/핵심|직접 연결|우선/.test(title)) return 'core';
  return null;
}
function formatMetricSection(lines: string[], key: MetricSectionKey) {
  const output: string[] = [];
  let previousWasQuestionGroup = false;
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line === '---' || line.startsWith('>')) continue;
    if (isTableSeparator(line)) continue;
    if (line.startsWith('|')) {
      const cells = parseTableCells(line).filter(Boolean);
      if (cells.length === 0 || /지표|관찰|확인|후보|이유|포인트|방법/.test(cells[0])) continue;
      const [name, ...details] = cells;
      const detailText = details.filter(Boolean).map((detail) => `  - ${detail}`).join('\n');
      output.push(`- ${name}${detailText ? `\n${detailText}` : ''}`);
      previousWasQuestionGroup = false;
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      output.push(`- ${cleanMarkdown(line.replace(/^[-*]\s+/, ''))}`);
      previousWasQuestionGroup = false;
      continue;
    }
    if (/^\*\*.+\*\*$/.test(line) || (key === 'questions' && !line.includes('|') && !line.startsWith('#'))) {
      const clean = cleanMarkdown(line);
      if (clean && !previousWasQuestionGroup) {
        output.push(`${output.length > 0 ? '\n' : ''}${clean}`);
        previousWasQuestionGroup = true;
      }
      continue;
    }
    const clean = cleanMarkdown(line);
    if (clean && !/^\d+\./.test(clean)) output.push(clean);
    previousWasQuestionGroup = false;
  }
  return output.join('\n').trim();
}
function countItems(text: string) { return text.split('\n').filter((line) => line.trim().startsWith('- ')).length; }
function parseAiMetricSuggestion(rawText: string): MetricParseResult {
  const buckets: Record<MetricSectionKey, string[]> = { core: [], support: [], safety: [], excluded: [], additional: [], questions: [] };
  const warnings: string[] = [];
  let current: MetricSectionKey | null = null;
  const lines = rawText.split(/\r?\n/);
  for (const line of lines) {
    const headingCandidate = /^#{1,6}\s+/.test(line.trim()) || /^\d+\.\s+/.test(line.trim()) || /^##\s*\d+\./.test(line.trim());
    const classified = headingCandidate ? classifyMetricHeading(line) : null;
    if (classified) {
      current = classified;
      continue;
    }
    if (current) buckets[current].push(line);
  }
  const result: MetricParseResult = {
    core: formatMetricSection(buckets.core, 'core'),
    support: formatMetricSection(buckets.support, 'support'),
    safety: formatMetricSection(buckets.safety, 'safety'),
    excluded: formatMetricSection(buckets.excluded, 'excluded'),
    additional: formatMetricSection(buckets.additional, 'additional'),
    questions: formatMetricSection(buckets.questions, 'questions'),
    warnings,
  };
  for (const [key, label] of [['core', '핵심 지표'], ['support', '보완 지표'], ['safety', '안전선 지표'], ['excluded', '제외 지표'], ['additional', '추가 지표'], ['questions', '확인 질문']] as const) {
    if (!result[key]) warnings.push(`${label} 섹션을 자동으로 찾지 못했습니다.`);
  }
  return result;
}

export function V38DashboardAnalysisLab() {
  const [teamSituations, setTeamSituations] = useState<string[]>(['활동량은 충분한데 고객 반응이 약하다', '방문 후 후속조치가 잘 이어지지 않는다']);
  const [aiMetricSuggestion, setAiMetricSuggestion] = useState('');
  const [metricParsePreview, setMetricParsePreview] = useState<MetricParseResult | null>(null);
  const [aiRecommendedCoreMetrics, setAiRecommendedCoreMetrics] = useState('');
  const [aiRecommendedSupportMetrics, setAiRecommendedSupportMetrics] = useState('');
  const [aiRecommendedSafetyMetrics, setAiRecommendedSafetyMetrics] = useState('');
  const [fitForOurTeam, setFitForOurTeam] = useState('');
  const [excludedMetrics, setExcludedMetrics] = useState('');
  const [additionalMetricIdea, setAdditionalMetricIdea] = useState('');
  const [aiRecommendedQuestions, setAiRecommendedQuestions] = useState('');
  const [selectedCoreMetrics, setSelectedCoreMetrics] = useState<string[]>(['followTalk', 'engagement', 'crm']);
  const [selectedSupportMetrics, setSelectedSupportMetrics] = useState<string[]>(['followAction', 'learning']);
  const [selectedSafetyMetrics, setSelectedSafetyMetrics] = useState<string[]>(['compliance']);
  const [metricRationale, setMetricRationale] = useState('');
  const [memberPreps, setMemberPreps] = useState<PrepState>({});
  const [aiSignalResult, setAiSignalResult] = useState('');
  const [selectedDeliverables, setSelectedDeliverables] = useState<DeliverableState>({});
  const [copiedPrompt, setCopiedPrompt] = useState<'metric' | 'signal' | 'prep' | null>(null);

  const selectedMetricSummary = useMemo(() => [`핵심 지표 3개: ${metricNames(selectedCoreMetrics).join(' / ') || '미선택'}`, `보완 지표 2개: ${metricNames(selectedSupportMetrics).join(' / ') || '미선택'}`, `안전선 지표 1개: ${metricNames(selectedSafetyMetrics).join(' / ') || '미선택'}`], [selectedCoreMetrics, selectedSupportMetrics, selectedSafetyMetrics]);
  const completedSignalCount = useMemo(() => TEAM_MEMBERS.filter((member) => { const current = memberPreps[member.id]; return Boolean(current?.observedSignal || current?.concernSignal || current?.checkQuestion); }).length, [memberPreps]);
  const completedActionChoiceCount = useMemo(() => TEAM_MEMBERS.filter((member) => (selectedDeliverables[member.id] ?? []).length > 0).length, [selectedDeliverables]);
  const completedFinalCount = useMemo(() => TEAM_MEMBERS.filter((member) => memberPreps[member.id]?.finalPrep).length, [memberPreps]);

  const metricPrompt = useMemo(() => ['당신은 제약영업 팀장의 실행관리 교육을 돕는 리더십 코치입니다.', '이 지표는 팀원을 평가하기 위한 점수표가 아니라, 팀장이 무엇을 확인하고 어떤 대화를 준비할지 정하기 위한 관찰 기준입니다.', '우리 팀 상황:', ...(teamSituations.length > 0 ? teamSituations.map((item) => `- ${item}`) : ['- 아직 선택하지 않았습니다.']), '요청: 우리 팀 상황에 맞는 안전한 실행 관찰 지표 후보를 제안해 주세요.', '아래 섹션 제목을 반드시 그대로 사용해 주세요.', '## 1. 핵심 지표 후보', '## 2. 보완 지표 후보', '## 3. 안전선 지표 후보', '## 4. 우리 팀에는 맞지 않을 수 있는 지표', '## 5. 추가로 생각해볼 지표', '## 6. 팀장이 던질 수 있는 확인 질문', '각 지표는 표보다 아래 불릿 형식으로 작성해 주세요.', '- 지표명:', '  - 관찰 포인트:', '  - 필요한 이유:', '  - 단정 금지:', '주의:', ...FORBIDDEN_ITEMS.map((item) => `- ${item}`), '- 지표는 실행 코칭과 다음 행동 준비에 연결될 수 있어야 합니다.', '- AI 추천은 최종 선택이 아니라 후보입니다. 팀장이 우리 팀 맥락에 맞게 다시 분리하고 걸러낼 수 있게 작성해 주세요.'].join('\n'), [teamSituations]);
  const signalPrompt = useMemo(() => ['당신은 제약영업 팀장의 팀원 실행 Data 해석을 돕는 리더십 코치입니다.', '6명의 팀원 Data를 보고, 각 팀원에 대해 확정 진단이 아니라 관찰 가능한 신호와 이슈 후보를 정리해 주세요.', '우리 팀이 최종 선택한 실행 관찰 지표:', ...selectedMetricSummary.map((item) => `- ${item}`), metricRationale ? `지표 선택 이유: ${metricRationale}` : '지표 선택 이유: 아직 작성하지 않았습니다.', aiRecommendedQuestions ? `참고 가능한 AI 추천 확인 질문:\n${aiRecommendedQuestions}` : '참고 가능한 AI 추천 확인 질문: 아직 정리하지 않았습니다.', '이 지표를 우선 렌즈로 사용하되, 팀원을 평가하거나 낙인찍지 마세요.', '반드시 피할 것:', ...FORBIDDEN_ITEMS.map((item) => `- ${item}`), '팀원 실행 Data:', ...TEAM_MEMBERS.flatMap((member, index) => [`${index + 1}. ${member.name}`, `- 프로필: ${member.profile}`, `- 관찰 장면: ${member.observation}`, `- 주요 실행 Data: ${member.signals.join(' / ')}`, '']), '출력 형식:', '1. 팀원별 관찰 신호', '2. 강점으로 볼 수 있는 신호', '3. 우려 또는 확인이 필요한 신호', '4. 추가로 확인해야 할 질문', '5. 성급하게 단정하면 안 되는 점', '문제 직원, 동기 부족, 변화 저항처럼 단정하지 마세요.'].join('\n'), [selectedMetricSummary, metricRationale, aiRecommendedQuestions]);
  const prepPrompt = useMemo(() => ['당신은 제약영업 팀장이 팀원별 다음 행동 준비물을 만들도록 돕는 리더십 코치입니다.', 'AI가 판단을 대신 확정하지 않도록, 관찰 신호와 선택한 팀장 행동 결과물에 맞춰 실무 준비물을 만들어 주세요.', '선택한 우리 팀 실행지표:', ...selectedMetricSummary.map((item) => `- ${item}`), '반드시 피할 것:', ...FORBIDDEN_ITEMS.map((item) => `- ${item}`), 'AI 1차 결과 붙여넣기 내용:', aiSignalResult || '아직 붙여넣지 않았습니다.', '팀원별 분리 정리와 팀장 행동 선택:', ...TEAM_MEMBERS.flatMap((member, index) => { const current = memberPreps[member.id] ?? emptyPrep(); const choices = selectedDeliverables[member.id] ?? []; return [`${index + 1}. ${member.name}`, `- 팀원별 관찰 신호: ${current.observedSignal || '미작성'}`, `- 강점으로 볼 수 있는 신호: ${current.strengthSignal || '미작성'}`, `- 우려 또는 확인이 필요한 신호: ${current.concernSignal || '미작성'}`, `- 추가로 확인해야 할 질문: ${current.checkQuestion || '미작성'}`, `- 성급하게 단정하면 안 되는 점: ${current.doNotAssume || '미작성'}`, `- 팀장 행동 선택: ${choices.length > 0 ? choices.join(' / ') : '미선택'}`, '']; }), '선택 가능한 준비물:', ...ACTION_OUTPUT_OPTIONS.map((item, index) => `${index + 1}. ${item}`), '출력 형식: 팀원별로 선택된 준비물만 작성해 주세요. 문장과 체크리스트 중심으로 작성해 주세요.'].join('\n'), [selectedMetricSummary, aiSignalResult, memberPreps, selectedDeliverables]);

  const toggleString = (value: string, setter: Dispatch<SetStateAction<string[]>>) => setter((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  const updatePrep = (memberId: string, field: keyof MemberPrep, value: string) => setMemberPreps((current) => ({ ...current, [memberId]: { ...emptyPrep(), ...(current[memberId] ?? {}), [field]: value } }));
  const toggleDeliverable = (memberId: string, label: string) => setSelectedDeliverables((current) => { const previous = current[memberId] ?? []; const next = previous.includes(label) ? previous.filter((item) => item !== label) : [...previous, label]; return { ...current, [memberId]: next }; });
  const copyPrompt = async (type: 'metric' | 'signal' | 'prep') => { try { await navigator.clipboard.writeText(type === 'metric' ? metricPrompt : type === 'signal' ? signalPrompt : prepPrompt); setCopiedPrompt(type); window.setTimeout(() => setCopiedPrompt(null), 1600); } catch { setCopiedPrompt(null); } };
  const applySuggestedDeliverables = (memberId: string) => setSelectedDeliverables((current) => ({ ...current, [memberId]: getSuggestedDeliverables(memberId) }));
  const parseMetricSuggestion = () => setMetricParsePreview(parseAiMetricSuggestion(aiMetricSuggestion));
  const applyMetricParsePreview = () => {
    if (!metricParsePreview) return;
    setAiRecommendedCoreMetrics(metricParsePreview.core);
    setAiRecommendedSupportMetrics(metricParsePreview.support);
    setAiRecommendedSafetyMetrics(metricParsePreview.safety);
    setExcludedMetrics(metricParsePreview.excluded);
    setAdditionalMetricIdea(metricParsePreview.additional);
    setAiRecommendedQuestions(metricParsePreview.questions);
    const fitSummary = [metricParsePreview.core, metricParsePreview.support].filter(Boolean).join('\n\n');
    setFitForOurTeam((current) => current || fitSummary);
  };

  return (
    <section className="space-y-4">
      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6"><div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><p className="text-xs font-black uppercase tracking-wide text-cyan-700">v38 Dashboard Analysis Lab</p><h2 className="mt-2 text-2xl font-black text-slate-950">우리 팀 지표로 다음 행동 준비하기</h2><p className="mt-2 text-sm leading-6 text-slate-600">이 단계는 <span className="font-black text-slate-950">AI 추천 결과 붙여넣기 → 자동 분리 → 분리 결과 적용 → 최종 실행지표 선택 → 6명 팀원 Data 보기</span> 흐름으로, 팀장이 사용할 <span className="font-black text-slate-950">팀원별 다음 행동 준비물</span>을 만듭니다.</p></div><div className="grid gap-2 text-sm font-black text-cyan-800 md:text-right"><div className="rounded-2xl bg-amber-50 px-4 py-3 text-amber-800">지표 선택 {selectedCoreMetrics.length + selectedSupportMetrics.length + selectedSafetyMetrics.length} / 6</div><div className="rounded-2xl bg-cyan-50 px-4 py-3">신호 분리 {completedSignalCount} / {TEAM_MEMBERS.length}</div><div className="rounded-2xl bg-indigo-50 px-4 py-3 text-indigo-800">행동 선택 {completedActionChoiceCount} / {TEAM_MEMBERS.length}</div><div className="rounded-2xl bg-emerald-50 px-4 py-3 text-emerald-800">준비물 완성 {completedFinalCount} / {TEAM_MEMBERS.length}</div></div></div></div>

      <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5 shadow-sm md:p-6"><p className="text-xs font-black uppercase tracking-wide text-amber-700">Block 0</p><h3 className="text-lg font-black text-slate-950">우리 팀 지표 정하기</h3><p className="mt-2 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-600">자동 분리는 초안입니다. AI 추천을 그대로 확정하지 말고, 분리 결과를 확인한 뒤 우리 팀 상황에 맞게 수정하십시오.</p><div className="mt-4 grid gap-4 lg:grid-cols-2"><div className="rounded-2xl border bg-white p-4"><h4 className="text-sm font-black text-slate-950">우리 팀 상황 선택</h4><div className="mt-3 grid gap-2">{TEAM_SITUATION_OPTIONS.map((option) => <label key={option} className={`flex gap-3 rounded-2xl border p-3 text-xs font-bold leading-5 ${teamSituations.includes(option) ? 'border-amber-700 bg-amber-50 text-amber-950' : 'bg-white text-slate-700'}`}><input type="checkbox" checked={teamSituations.includes(option)} onChange={() => toggleString(option, setTeamSituations)} /><span>{option}</span></label>)}</div></div><div className="rounded-2xl border bg-white p-4"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h4 className="text-sm font-black text-slate-950">AI 지표 추천 프롬프트</h4><p className="mt-1 text-xs font-bold leading-5 text-slate-600">자동분리가 잘 되도록 섹션 제목과 불릿 구조를 지정합니다.</p></div><button type="button" className="rounded-2xl bg-amber-700 px-4 py-3 text-sm font-black text-white" onClick={() => copyPrompt('metric')}>{copiedPrompt === 'metric' ? '복사 완료' : 'AI 지표 추천 프롬프트 복사'}</button></div><pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{metricPrompt}</pre></div></div><label className="mt-4 block space-y-1"><span className="text-xs font-black text-slate-600">AI 추천 지표 붙여넣기</span><textarea className="min-h-28 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6" value={aiMetricSuggestion} onChange={(event) => setAiMetricSuggestion(event.target.value)} placeholder="클로드, ChatGPT 등에서 생성한 지표 추천 결과를 붙여넣으세요. 표 형식도 자동분리를 시도합니다." /></label><div className="mt-3 flex flex-col gap-2 md:flex-row"><button type="button" className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white" onClick={parseMetricSuggestion}>AI 추천 지표 자동 분리</button><button type="button" className="rounded-2xl border bg-white px-4 py-3 text-sm font-black text-slate-700" onClick={applyMetricParsePreview} disabled={!metricParsePreview}>분리 결과 적용</button></div>{metricParsePreview && <div className="mt-4 rounded-2xl border bg-white p-4"><div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"><div><h4 className="text-sm font-black text-slate-950">분리 결과 미리보기</h4><p className="mt-1 text-xs font-bold text-slate-600">분리 결과는 초안입니다. 적용 후 반드시 수정하십시오.</p></div><div className="text-xs font-black text-slate-500">핵심 {countItems(metricParsePreview.core)} · 보완 {countItems(metricParsePreview.support)} · 안전선 {countItems(metricParsePreview.safety)} · 제외 {countItems(metricParsePreview.excluded)} · 추가 {countItems(metricParsePreview.additional)}</div></div>{metricParsePreview.warnings.length > 0 && <div className="mt-3 rounded-2xl bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-800">{metricParsePreview.warnings.map((warning) => <p key={warning}>- {warning}</p>)}</div>}<div className="mt-3 grid gap-3 md:grid-cols-2"><PreviewBox title="핵심" text={metricParsePreview.core} /><PreviewBox title="보완" text={metricParsePreview.support} /><PreviewBox title="안전선" text={metricParsePreview.safety} /><PreviewBox title="제외" text={metricParsePreview.excluded} /><PreviewBox title="추가" text={metricParsePreview.additional} /><PreviewBox title="확인 질문" text={metricParsePreview.questions} /></div></div>}<div className="mt-4 rounded-2xl border bg-white p-4"><h4 className="text-sm font-black text-slate-950">AI 추천 지표 분리정리</h4><p className="mt-1 text-xs font-bold leading-5 text-slate-600">자동분리 결과를 적용한 뒤, 팀장 판단으로 수정합니다. 최종 선택은 아래 기본 안전 지표와 함께 검토합니다.</p><div className="mt-3 grid gap-3 md:grid-cols-2"><ReviewTextarea label="AI 추천 핵심 지표 후보" value={aiRecommendedCoreMetrics} onChange={setAiRecommendedCoreMetrics} /><ReviewTextarea label="AI 추천 보완 지표 후보" value={aiRecommendedSupportMetrics} onChange={setAiRecommendedSupportMetrics} /><ReviewTextarea label="AI 추천 안전선 지표 후보" value={aiRecommendedSafetyMetrics} onChange={setAiRecommendedSafetyMetrics} /><ReviewTextarea label="우리 팀에 맞는 지표" value={fitForOurTeam} onChange={setFitForOurTeam} /><ReviewTextarea label="제외할 지표" value={excludedMetrics} onChange={setExcludedMetrics} /><ReviewTextarea label="추가하고 싶은 지표" value={additionalMetricIdea} onChange={setAdditionalMetricIdea} /><ReviewTextarea label="AI 추천 확인 질문" value={aiRecommendedQuestions} onChange={setAiRecommendedQuestions} /></div></div><div className="mt-4 rounded-2xl border bg-white p-4"><h4 className="text-sm font-black text-slate-950">우리 팀 핵심 실행지표 최종 선택</h4><p className="mt-1 text-xs font-bold leading-5 text-slate-600">AI 추천 지표 분리정리와 기본 안전 지표를 참고해 최종 실행지표를 선택하세요. 핵심 지표 3개, 보완 지표 2개, 안전선 지표 1개를 선택합니다.</p><MetricPicker title="핵심 지표 3개" selected={selectedCoreMetrics} setter={setSelectedCoreMetrics} max={3} safetyOnly={false} /><MetricPicker title="보완 지표 2개" selected={selectedSupportMetrics} setter={setSelectedSupportMetrics} max={2} safetyOnly={false} /><MetricPicker title="안전선 지표 1개" selected={selectedSafetyMetrics} setter={setSelectedSafetyMetrics} max={1} safetyOnly={true} /><label className="mt-4 block space-y-1"><span className="text-xs font-black text-slate-600">지표 선택 이유</span><textarea className="min-h-20 w-full rounded-2xl border bg-slate-50 px-3 py-2 text-sm leading-6" value={metricRationale} onChange={(event) => setMetricRationale(event.target.value)} placeholder="예: AI 추천 중 후속 대화 연결과 고객 반응 지표가 우리 팀 상황에 가장 맞다고 판단했다." /></label></div></div>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6"><p className="text-xs font-black uppercase tracking-wide text-slate-500">Block 1</p><h3 className="text-lg font-black text-slate-950">선택한 우리 팀 실행지표 기준으로 6명 Data 보기</h3><div className="mt-3 flex flex-wrap gap-2">{selectedMetricSummary.map((item) => <span key={item} className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-800">{item}</span>)}</div><div className="mt-4 grid gap-4 lg:grid-cols-2">{TEAM_MEMBERS.map((member) => <article key={member.id} className="rounded-3xl border bg-slate-50 p-4"><p className="font-black text-slate-950">{member.name}</p><p className="mt-1 text-xs font-bold text-slate-600">{member.profile}</p><p className="mt-3 text-sm font-bold leading-6 text-slate-700">{member.observation}</p><div className="mt-3 flex flex-wrap gap-2">{member.signals.map((signal) => <span key={signal} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700">{signal}</span>)}</div></article>)}</div></div>
      <details className="rounded-3xl border border-indigo-100 bg-indigo-50 p-5 shadow-sm md:p-6" open><summary className="cursor-pointer text-lg font-black text-slate-950">Block 2. AI로 6명 Data에서 보이는 신호 정리</summary><p className="mt-3 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-600">AI 1차 활용은 진단 확정이 아니라 이슈 후보를 넓히는 단계입니다. 최종 선택한 우리 팀 실행지표만 우선 렌즈로 사용합니다.</p><div className="mt-4 rounded-2xl border bg-white p-4"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h3 className="text-sm font-black text-slate-950">복사용 AI 1차 신호 정리 프롬프트</h3><p className="mt-1 text-xs font-bold leading-5 text-slate-600">6명 Data에서 보이는 신호를 관찰 가능한 표현과 확인 질문 중심으로 뽑아냅니다.</p></div><button type="button" className="rounded-2xl bg-indigo-700 px-4 py-3 text-sm font-black text-white" onClick={() => copyPrompt('signal')}>{copiedPrompt === 'signal' ? '복사 완료' : 'AI 신호 정리 프롬프트 복사'}</button></div><pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{signalPrompt}</pre></div></details>
      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6"><h3 className="text-lg font-black text-slate-950">AI 결과 붙여넣기</h3><p className="mt-2 text-sm font-bold leading-6 text-slate-600">AI가 뽑은 신호를 붙여넣은 뒤, 그대로 확정하지 말고 팀장 판단으로 다시 정리합니다.</p><textarea className="mt-4 min-h-40 w-full rounded-2xl border bg-slate-50 px-4 py-3 text-sm leading-6" value={aiSignalResult} onChange={(event) => setAiSignalResult(event.target.value)} placeholder="AI 1차 결과를 여기에 붙여넣으세요." /></div>
      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6"><h3 className="text-lg font-black text-slate-950">팀원별 신호 분리 정리</h3><p className="mt-2 text-sm font-bold leading-6 text-slate-600">AI 결과는 전체 신호 후보입니다. 참여자가 팀원별로 다시 나누고 확인 질문을 적습니다.</p><div className="mt-4 grid gap-4 lg:grid-cols-2">{TEAM_MEMBERS.map((member, index) => { const current = memberPreps[member.id] ?? emptyPrep(); return <details key={member.id} className="rounded-3xl border bg-slate-50 shadow-sm" open={index === 0}><summary className="cursor-pointer list-none p-4"><p className="font-black text-slate-950">{member.name}</p><p className="mt-1 text-xs font-bold text-slate-600">{member.profile}</p></summary><div className="border-t p-4"><div className="grid gap-3 md:grid-cols-2"><PrepTextarea label="팀원별 관찰 신호" value={current.observedSignal} onChange={(value) => updatePrep(member.id, 'observedSignal', value)} /><PrepTextarea label="강점으로 볼 수 있는 신호" value={current.strengthSignal} onChange={(value) => updatePrep(member.id, 'strengthSignal', value)} /><PrepTextarea label="우려 또는 확인이 필요한 신호" value={current.concernSignal} onChange={(value) => updatePrep(member.id, 'concernSignal', value)} /><PrepTextarea label="추가로 확인해야 할 질문" value={current.checkQuestion} onChange={(value) => updatePrep(member.id, 'checkQuestion', value)} /><PrepTextarea label="성급하게 단정하면 안 되는 점" value={current.doNotAssume} onChange={(value) => updatePrep(member.id, 'doNotAssume', value)} /></div></div></details>; })}</div></div>
      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6"><h3 className="text-lg font-black text-slate-950">팀장 행동 선택</h3><p className="mt-2 text-sm font-bold leading-6 text-slate-600">모든 팀원에게 같은 결과물을 만들지 않습니다. 팀원별 신호에 따라 지금 필요한 준비물을 선택합니다.</p><div className="mt-4 grid gap-4">{TEAM_MEMBERS.map((member) => { const checkedItems = selectedDeliverables[member.id] ?? []; return <article key={member.id} className="rounded-3xl border bg-slate-50 p-4"><div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"><div><p className="font-black text-slate-950">{member.name}</p><p className="mt-1 text-xs font-bold text-slate-600">추천: {getSuggestedDeliverables(member.id).join(' / ')}</p></div><button type="button" className="rounded-2xl border bg-white px-4 py-2 text-xs font-black text-slate-700" onClick={() => applySuggestedDeliverables(member.id)}>추천 준비물 선택</button></div><div className="mt-3 grid gap-2 md:grid-cols-2 lg:grid-cols-3">{ACTION_OUTPUT_OPTIONS.map((option) => <label key={option} className={`flex items-start gap-3 rounded-2xl border p-3 text-xs font-bold leading-5 ${checkedItems.includes(option) ? 'border-cyan-700 bg-white text-cyan-950' : 'bg-white/70 text-slate-700'}`}><input type="checkbox" className="mt-1" checked={checkedItems.includes(option)} onChange={() => toggleDeliverable(member.id, option)} /><span>{option}</span></label>)}</div></article>; })}</div></div>
      <details className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm md:p-6"><summary className="cursor-pointer text-lg font-black text-slate-950">AI 2차 활용: 선택한 준비물 생성</summary><p className="mt-3 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-600">AI 2차 활용은 선택한 팀장 행동 결과물만 생성하는 단계입니다.</p><div className="mt-4 rounded-2xl border bg-white p-4"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h3 className="text-sm font-black text-slate-950">복사용 AI 준비물 생성 프롬프트</h3><p className="mt-1 text-xs font-bold leading-5 text-slate-600">팀원별 분리 정리와 팀장 행동 선택 결과를 바탕으로 실무 준비물 초안을 만듭니다.</p></div><button type="button" className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white" onClick={() => copyPrompt('prep')}>{copiedPrompt === 'prep' ? '복사 완료' : 'AI 준비물 생성 프롬프트 복사'}</button></div><pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{prepPrompt}</pre></div></details>
      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6"><h3 className="text-lg font-black text-slate-950">최종 결과물: 팀원별 다음 행동 준비물</h3><p className="mt-2 text-sm font-bold leading-6 text-slate-600">AI 2차 결과를 붙여넣고, 팀장 판단으로 수정해 최종 준비물을 확정합니다.</p><div className="mt-4 grid gap-4 lg:grid-cols-2">{TEAM_MEMBERS.map((member) => { const current = memberPreps[member.id] ?? emptyPrep(); return <article key={member.id} className="rounded-3xl border bg-slate-50 p-4"><p className="font-black text-slate-950">{member.name}</p><label className="mt-3 block space-y-1"><span className="text-xs font-black text-slate-500">AI 2차 결과 붙여넣기 또는 참고 메모</span><textarea className="min-h-28 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6" value={current.aiDraft} onChange={(event) => updatePrep(member.id, 'aiDraft', event.target.value)} /></label><label className="mt-3 block space-y-1"><span className="text-xs font-black text-slate-500">최종 팀원별 다음 행동 준비물</span><textarea className="min-h-36 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6" value={current.finalPrep} onChange={(event) => updatePrep(member.id, 'finalPrep', event.target.value)} /></label></article>; })}</div></div>
    </section>
  );
}

function MetricPicker({ title, selected, setter, max, safetyOnly }: { title: string; selected: string[]; setter: Dispatch<SetStateAction<string[]>>; max: number; safetyOnly: boolean }) { const options = METRIC_OPTIONS.filter((item) => safetyOnly ? item.safety : !item.safety); return <div className="mt-4"><p className="text-xs font-black text-slate-700">{title}</p><div className="mt-2 grid gap-2 md:grid-cols-2">{options.map((metric) => { const checked = selected.includes(metric.id); return <label key={metric.id} className={`rounded-2xl border p-3 text-xs font-bold leading-5 ${checked ? 'border-cyan-700 bg-cyan-50 text-cyan-950' : 'bg-white text-slate-700'}`}><div className="flex gap-2"><input type="checkbox" checked={checked} onChange={() => setter((current) => current.includes(metric.id) ? current.filter((item) => item !== metric.id) : current.length >= max ? current : [...current, metric.id])} /><span className="font-black">{metric.name}</span></div><p className="mt-1 text-slate-600">{metric.group} · {metric.meaning}</p><p className="mt-1 text-slate-500">단정 금지: {metric.caution}</p></label>; })}</div></div>; }
function PreviewBox({ title, text }: { title: string; text: string }) { return <div className="rounded-2xl border bg-slate-50 p-3"><p className="text-xs font-black text-slate-700">{title}</p><pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap text-xs leading-5 text-slate-600">{text || '감지된 내용 없음'}</pre></div>; }
function ReviewTextarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="space-y-1"><span className="text-xs font-black text-slate-500">{label}</span><textarea className="min-h-24 w-full rounded-2xl border bg-slate-50 px-3 py-2 text-sm leading-6" value={value} onChange={(event) => onChange(event.target.value)} /></label>; }
function PrepTextarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="space-y-1"><span className="text-xs font-black text-slate-500">{label}</span><textarea className="min-h-24 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6" value={value} onChange={(event) => onChange(event.target.value)} /></label>; }
