import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';

const STORAGE_KEY = 'ckd.v40-vnext.pharmaStrategyResearch.v1';

const V40_VNEXT_PHARMA_STRATEGY_RESEARCH_MARKERS = [
  'V40VNextPharmaStrategyResearchLab',
  '2026년 제약업계 전략 과제 선택',
  '영업팀 추진계획 수립 실습',
  'Perplexity 최신자료 검색 전용 프롬프트',
  'Perplexity 전략 과제 프롬프트',
  '전략 제안이나 실행계획을 만들지 말고',
  'URL이 없는 자료는 제외',
  'Perplexity 출처 URL만 분리',
  'NotebookLM 웹 소스 URL 복사',
  '분리된 웹 소스 URL',
  'NotebookLM 소스 기반 전략 과제 압축',
  'NotebookLM 프롬프트 복사',
  'NotebookLM 분석 질문 복사',
  'NotebookLM 결과 항목별로 정리하기',
  'LM Studio 보고서 생성 요청',
  'LM Studio 슬라이드 생성 요청',
  'LM Studio 인포그래픽 생성 요청',
  '업로드한 소스와 3단계 정리 결과를 근거로',
  '산출물 형식만 지시',
  'URL 추출 1회 계산',
  '핸들러 useCallback 안정화',
  'ckd.v40-vnext.pharmaStrategyResearch.v1',
].join('|');
void V40_VNEXT_PHARMA_STRATEGY_RESEARCH_MARKERS;

type Topic = { id: string; title: string; focus: string; kpis: string[] };

type State = {
  selectedTopicId: string;
  customTopic: string;
  teamSituation: string;
  leaderQuestion: string;
  perplexityAnswer: string;
  notebookAnswer: string;
  issueOne: string;
  issueTwo: string;
  issueThree: string;
  teamImpact: string;
  metricQuestions: string;
  caution: string;
  reportDraft: string;
  slideDraft: string;
  infographicDraft: string;
  meetingMemo: string;
  expectedQuestions: string;
};

type ParsedNotebookSections = {
  issueOne?: string;
  issueTwo?: string;
  issueThree?: string;
  teamImpact?: string;
  metricQuestions?: string;
  caution?: string;
};

const TOPICS: Topic[] = [
  {
    id: 'ai-commercial',
    title: 'AI 기반 영업·마케팅 실행관리 고도화',
    focus: 'AI 결과를 고객 접점 준비, 기록 품질, 후속 질문으로 바꾸는 기준을 세웁니다.',
    kpis: ['AI 활용 전 안전성 점검률', '고객 질문 기록률', '후속 실행안 작성률', '위험 표현 수정 건수'],
  },
  {
    id: 'market-access',
    title: '약가·급여·시장접근성 변화 대응',
    focus: '가치 근거, 자료 요청, 사용 맥락 질문을 안전하게 기록하고 후속 대응으로 연결합니다.',
    kpis: ['가치 근거 질문 기록률', '승인자료 기반 후속 대응률', '자료 요청 처리 리드타임', '고객 관심 주제 분류율'],
  },
  {
    id: 'patent-portfolio',
    title: '특허만료·제네릭/바이오시밀러 경쟁 대응',
    focus: '고객 세그먼트별 질문, 대체 선택 기준, 안전한 후속 커뮤니케이션을 정리합니다.',
    kpis: ['핵심 고객군별 질문 기록률', '후속 접점 확보율', '경쟁 비교 위험표현 수정 건수', '세그먼트별 실행 완료율'],
  },
  {
    id: 'cdmo-cmo',
    title: 'CDMO/CMO 전략 확대와 공급·품질 신뢰 강화',
    focus: '공급·품질 관련 고객 우려를 듣고 내부 확인 필요 이슈와 설명 가능 범위를 구분합니다.',
    kpis: ['공급·품질 문의 기록률', '내부 확인 필요 이슈 공유건수', '고객 우려 후속 확인율', '안전 답변 가이드 활용률'],
  },
  {
    id: 'therapy-growth',
    title: '비만·대사질환·항암·면역 등 고성장 치료영역 대응',
    focus: '고객 질문과 승인자료 기반 후속 대화를 안전하게 연결합니다.',
    kpis: ['치료영역 질문 기록률', '승인자료 기반 대화율', '후속 정보 제공 계획률', '고객 의도 단정 표현 수정건수'],
  },
  {
    id: 'digital-journey',
    title: '디지털 채널·환자 여정 기반 고객 접점 혁신',
    focus: '방문, 비대면, 자료 제공, 후속 확인을 하나의 고객 접점 흐름으로 설계합니다.',
    kpis: ['대체 접점 실행률', '자료 제공 후 후속 확인율', '채널별 고객 반응 기록률', '2주 접점 흐름 완료율'],
  },
];

const DEFAULT_STATE: State = {
  selectedTopicId: TOPICS[0].id,
  customTopic: '',
  teamSituation: 'C1바이오 영업팀이 2026년 제약업계 전략 과제를 바탕으로 2주 실행관리 계획을 세워야 한다.',
  leaderQuestion: '',
  perplexityAnswer: '',
  notebookAnswer: '',
  issueOne: '',
  issueTwo: '',
  issueThree: '',
  teamImpact: '',
  metricQuestions: '',
  caution: '',
  reportDraft: '',
  slideDraft: '',
  infographicDraft: '',
  meetingMemo: '',
  expectedQuestions: '',
};

const NOTEBOOK_SECTION_ALIASES: Array<{ key: string; labels: string[] }> = [
  { key: 'issueOne', labels: ['영업팀 추진 과제 1', '영업팀 추진과제 1', '추진 과제 1', '추진과제 1', '과제 1'] },
  { key: 'issueTwo', labels: ['영업팀 추진 과제 2', '영업팀 추진과제 2', '추진 과제 2', '추진과제 2', '과제 2'] },
  { key: 'issueThree', labels: ['영업팀 추진 과제 3', '영업팀 추진과제 3', '추진 과제 3', '추진과제 3', '과제 3'] },
  { key: 'teamImpact', labels: ['우리 팀 실행 영향', '팀 실행 영향', '영업팀 실행 영향', '실행 영향'] },
  { key: 'questions', labels: ['2주 실행관리 질문', '2주 실행 관리 질문', '실행관리 질문', '실행 질문'] },
  { key: 'kpis', labels: ['KPI 후보', '관리 지표 후보', '지표 후보'] },
  { key: 'caution', labels: ['주의해야 할 표현', '주의 표현', '위험 표현', '컴플라이언스 주의 표현'] },
];

function topicOf(topicId: string) {
  return TOPICS.find((item) => item.id === topicId) ?? TOPICS[0];
}

function titleOf(state: Pick<State, 'selectedTopicId' | 'customTopic'>) {
  return state.customTopic.trim() || topicOf(state.selectedTopicId).title;
}

function safeRule() {
  return '실제 고객명·기관명·의료진명·제품명·내부 수치·개인정보는 제외하고, 단정적 비교·비방·허가 범위 밖 암시 표현은 피합니다.';
}

function buildPerplexityPrompt(state: Pick<State, 'selectedTopicId' | 'customTopic' | 'teamSituation' | 'leaderQuestion'>) {
  return `2026년 현재 제약·바이오 산업에서 중요한 전략 과제인 "${titleOf(state)}"에 대해 최신 공개자료를 찾아주세요.

목적:
C1바이오 영업팀장 교육 실습에서 NotebookLM에 넣을 신뢰 가능한 소스 자료를 수집하려고 합니다.

중요:
전략 제안이나 실행계획을 만들지 말고, 최신 자료와 출처 URL을 찾는 데 집중해 주세요. 영업팀 추진 과제, KPI, 2주 실행계획, 주의 표현은 나중에 NotebookLM에서 소스 기반으로 분석할 예정입니다.

우리 팀 상황 참고:
${state.teamSituation}

영업팀 관점 참고 질문:
${state.leaderQuestion || topicOf(state.selectedTopicId).focus}

찾아야 할 자료:
1. 2025~2026년 제약·바이오 산업 전망 자료
2. 선택한 전략 과제와 관련된 산업 리포트, 정책·규제 자료, 협회 자료, 신뢰 가능한 기사
3. FDA, EMA, MFDS, KHIDI, 보건산업 관련 기관, 제약·바이오 협회, 컨설팅사 자료
4. 영업팀이 고객 질문과 실행관리 기준을 만들 때 참고할 수 있는 자료

출력 형식:
아래 형식으로만 정리해 주세요. 전략 요약, 추진 과제, 실행 리스크, KPI는 작성하지 마세요.

[자료 1]
- 제목:
- 발행기관/매체:
- 발행일 또는 최근성:
- 핵심 내용 2줄:
- URL:

[자료 2]
- 제목:
- 발행기관/매체:
- 발행일 또는 최근성:
- 핵심 내용 2줄:
- URL:

[자료 3]
...

주의:
- URL이 없는 자료는 제외하세요.
- 가능하면 8~12개 자료를 제시해 주세요.
- 실제 고객명, 병원명, 의료진명, 제품명, 매출·처방 정보는 포함하지 마세요.
- 처방 유도, 경쟁사 비방, 비교 우위 단정, 허가 외 사용 암시 표현은 쓰지 마세요.
- ${safeRule()}`;
}

function extractUrls(text: string) {
  const matches = text.match(/https?:\/\/[^\s)\]]+/g) ?? [];
  return Array.from(new Set(matches.map((url) => url.replace(/[.,;:]+$/g, '').trim()).filter(Boolean)));
}

function buildWebSourceUrlText(urls: string[]) {
  if (urls.length === 0) return 'Perplexity 답변에서 URL을 찾지 못했습니다. Perplexity 답변에 출처 링크가 포함되어 있는지 확인하세요.';
  return urls.join('\n');
}

function buildNotebookAnalysisPrompt(state: Pick<State, 'selectedTopicId' | 'customTopic'>) {
  return `업로드한 소스만 근거로 분석해 주세요.

나는 C1바이오 영업팀장 이대호 팀장입니다. 2026년 제약업계 전략 과제 "${titleOf(state)}"를 영업팀 추진계획으로 바꾸려고 합니다.

요청:
1. 소스에 근거한 핵심 변화 신호를 3개로 정리해 주세요.
2. 이 전략 과제가 영업팀의 고객 대화, 실행관리, 팀원 코칭에 주는 영향을 설명해 주세요.
3. 영업팀 추진 과제 3개로 압축해 주세요.
4. 각 추진 과제를 2주 실행관리 질문과 KPI 후보로 바꿔 주세요.
5. 고객 의도 단정, 처방 유도, 경쟁사 비방, 허가 외 사용 암시처럼 조심할 표현을 따로 표시해 주세요.

출력 형식:
[핵심 변화 신호]
[출처/근거 요약]
[영업팀 추진 과제 1]
[영업팀 추진 과제 2]
[영업팀 추진 과제 3]
[우리 팀 실행 영향]
[2주 실행관리 질문]
[KPI 후보]
[주의해야 할 표현]`;
}

function normalizeHeading(line: string) {
  return line
    .replace(/^\s{0,3}#{1,6}\s*/, '')
    .replace(/^\s*[-*+>]\s*/, '')
    .replace(/\*\*/g, '')
    .replace(/__+/g, '')
    .trim();
}

function detectNotebookSection(line: string) {
  const normalized = normalizeHeading(line);
  const withoutBrackets = normalized.replace(/^\[/, '').replace(/\]$/, '').trim();
  for (const item of NOTEBOOK_SECTION_ALIASES) {
    if (item.labels.some((label) => normalized === `[${label}]` || withoutBrackets === label || normalized.startsWith(`[${label}]`) || normalized.startsWith(`${label}:`) || normalized.startsWith(`${label}`))) {
      return item.key;
    }
  }
  return null;
}

function cleanParsedText(value?: string) {
  return (value ?? '').replace(/^\n+|\n+$/g, '').trim();
}

function parseNotebookAnswer(answer: string): ParsedNotebookSections {
  const buckets: Record<string, string[]> = {};
  let currentKey: string | null = null;
  for (const line of answer.split(/\r?\n/)) {
    const detectedKey = detectNotebookSection(line);
    if (detectedKey) {
      currentKey = detectedKey;
      if (!buckets[currentKey]) buckets[currentKey] = [];
      continue;
    }
    if (currentKey) buckets[currentKey].push(line);
  }

  const questions = cleanParsedText(buckets.questions?.join('\n'));
  const kpis = cleanParsedText(buckets.kpis?.join('\n'));
  const metricQuestions = [questions ? `[2주 실행관리 질문]\n${questions}` : '', kpis ? `[KPI 후보]\n${kpis}` : ''].filter(Boolean).join('\n\n');

  return {
    issueOne: cleanParsedText(buckets.issueOne?.join('\n')),
    issueTwo: cleanParsedText(buckets.issueTwo?.join('\n')),
    issueThree: cleanParsedText(buckets.issueThree?.join('\n')),
    teamImpact: cleanParsedText(buckets.teamImpact?.join('\n')),
    metricQuestions,
    caution: cleanParsedText(buckets.caution?.join('\n')),
  };
}

function buildStudioPrompt(kind: '보고서' | '슬라이드' | '인포그래픽', state: Pick<State, 'selectedTopicId' | 'customTopic' | 'teamSituation'>) {
  const common = `LM Studio ${kind} 생성 요청

역할:
당신은 제약영업 전략회의 자료를 만드는 편집자이자 비주얼 커뮤니케이션 전문가입니다.

입력자료:
- 업로드한 소스와 3단계 정리 결과를 근거로 작성합니다.
- 3단계 정리 결과에는 전략 과제, 핵심 변화 신호, 영업팀 추진 과제, 우리 팀 실행 영향, 2주 실행관리 질문, KPI 후보, 주의 표현이 포함되어 있습니다.
- 아래 주제와 맥락을 기준으로 자료를 재구성하되, 입력 내용을 길게 반복하지 말고 최종 산출물 형식에 맞게 압축합니다.

주제:
${titleOf(state)}

우리 팀 상황:
${state.teamSituation}

작성 기준:
- 공개자료와 업로드한 소스를 근거로 작성합니다.
- 교육용 전략회의 자료처럼 명확하고 간결하게 작성합니다.
- 실제 고객명, 기관명, 의료진명, 제품명, 내부 수치, 개인정보는 쓰지 않습니다.
- 처방 유도, 경쟁사 비방, 비교 우위 단정, 허가 외 사용 암시 표현은 피합니다.
- 산출물 형식만 지시받은 대로 작성하고, 불필요한 설명은 덧붙이지 않습니다.`;

  if (kind === '보고서') return `${common}

요청 산출물:
1~2페이지 분량의 전략회의 보고서 초안을 작성해 주세요.

출력 형식:
1. 제목
2. 한 줄 요약
3. 배경과 변화 신호
4. 영업팀 추진 과제 3개
5. 우리 팀 실행 영향
6. 2주 실행관리 질문
7. KPI 후보
8. 주의해야 할 표현
9. 회의에서 던질 토의 질문 3개`;

  if (kind === '슬라이드') return `${common}

요청 산출물:
8장짜리 발표용 슬라이드 구성안을 작성해 주세요.

출력 형식:
각 슬라이드마다 아래 항목을 작성합니다.
- 슬라이드 번호
- 제목
- 핵심 메시지
- 본문 bullet 3개 이내
- 시각화 아이디어
- 발표자 메모 2문장 이내

권장 흐름:
1. 왜 이 전략 과제가 중요한가
2. 시장 변화 신호
3. 고객 접점에서 달라지는 질문
4. 영업팀 추진 과제 3개
5. 2주 실행관리 질문
6. KPI 후보
7. 주의해야 할 표현
8. 팀장 실행 메시지`;

  return `${common}

요청 산출물:
1페이지 인포그래픽 구성안을 작성해 주세요.

출력 형식:
1. 인포그래픽 제목
2. 상단 핵심 메시지 1개
3. 가운데 핵심 변화 신호 3개
4. 하단 영업팀 추진 과제 3개
5. 오른쪽 박스: 2주 실행관리 질문
6. 왼쪽 박스: KPI 후보
7. 하단 주의 표현 3개
8. 아이콘/도식/레이아웃 제안`;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block space-y-1"><span className="text-xs font-black text-slate-500">{label}</span>{children}</label>;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-2xl border bg-white p-5 shadow-sm"><h3 className="text-lg font-black text-slate-950">{title}</h3><div className="mt-4 space-y-4">{children}</div></section>;
}

function TextArea({ value, onChange, placeholder, readOnly = false }: { value: string; onChange?: (value: string) => void; placeholder?: string; readOnly?: boolean }) {
  return <textarea className="min-h-36 w-full rounded-xl border px-3 py-2 text-sm leading-6" value={value} readOnly={readOnly} onChange={(event) => onChange?.(event.target.value)} placeholder={placeholder} />;
}

export function V40VNextPharmaStrategyResearchLab() {
  const [state, setState] = useStored<State>(STORAGE_KEY, DEFAULT_STATE);
  const [copyMessage, setCopyMessage] = useState('');
  const topic = useMemo(() => topicOf(state.selectedTopicId), [state.selectedTopicId]);
  const pPrompt = useMemo(() => buildPerplexityPrompt(state), [state.selectedTopicId, state.customTopic, state.teamSituation, state.leaderQuestion]);
  const extractedUrls = useMemo(() => extractUrls(state.perplexityAnswer), [state.perplexityAnswer]);
  const webSourceUrls = useMemo(() => buildWebSourceUrlText(extractedUrls), [extractedUrls]);
  const webSourceUrlCount = extractedUrls.length;
  const analysisPrompt = useMemo(() => buildNotebookAnalysisPrompt(state), [state.selectedTopicId, state.customTopic]);
  const report = useMemo(() => buildStudioPrompt('보고서', state), [state.selectedTopicId, state.customTopic, state.teamSituation]);
  const slides = useMemo(() => buildStudioPrompt('슬라이드', state), [state.selectedTopicId, state.customTopic, state.teamSituation]);
  const infographic = useMemo(() => buildStudioPrompt('인포그래픽', state), [state.selectedTopicId, state.customTopic, state.teamSituation]);

  const update = useCallback((patch: Partial<State>) => {
    setState((current) => ({ ...current, ...patch }));
  }, [setState]);

  const copyText = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage(`${label} 내용을 복사했습니다.`);
    } catch {
      setCopyMessage('복사가 차단되었습니다. 내용을 직접 선택해 복사하세요.');
    }
  }, []);

  const structureNotebookAnswer = useCallback(() => {
    const parsed = parseNotebookAnswer(state.notebookAnswer);
    const hasParsedValue = Object.values(parsed).some((value) => Boolean(value?.trim()));
    if (!hasParsedValue) {
      setCopyMessage('NotebookLM 결과에서 인식 가능한 항목 제목을 찾지 못했습니다. [영업팀 추진 과제 1], [우리 팀 실행 영향], [2주 실행관리 질문], [KPI 후보], [주의해야 할 표현] 형태가 있는지 확인해 주세요.');
      return;
    }
    setState((current) => ({
      ...current,
      issueOne: parsed.issueOne || current.issueOne,
      issueTwo: parsed.issueTwo || current.issueTwo,
      issueThree: parsed.issueThree || current.issueThree,
      teamImpact: parsed.teamImpact || current.teamImpact,
      metricQuestions: parsed.metricQuestions || current.metricQuestions,
      caution: parsed.caution || current.caution,
    }));
    setCopyMessage('NotebookLM 결과를 항목별 칸에 정리했습니다. 비어 있는 항목은 기존 입력값을 유지했습니다.');
  }, [setState, state.notebookAnswer]);

  return <section className="space-y-4">
    <Section title="1단계: Perplexity로 최신 공개자료와 URL 찾기">
      <Field label="2026년 전략 과제 선택">
        <select className="w-full rounded-xl border px-3 py-2" value={state.selectedTopicId} onChange={(event) => update({ selectedTopicId: event.target.value })}>
          {TOPICS.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
      </Field>
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-bold leading-5 text-emerald-950">
        <p className="font-black">이 과제의 영업팀 추진 초점</p>
        <p className="mt-1">{topic.focus}</p>
        <p className="mt-1">KPI 후보: {topic.kpis.join(' · ')}</p>
      </div>
      <Field label="전략 과제 직접 입력"><input className="w-full rounded-xl border px-3 py-2" value={state.customTopic} onChange={(event) => update({ customTopic: event.target.value })} placeholder="예: CDMO/CMO 전략 확대와 영업팀 고객가치 제안" /></Field>
      <Field label="우리 팀 상황"><TextArea value={state.teamSituation} onChange={(value) => update({ teamSituation: value })} /></Field>
      <Field label="영업팀 관점 참고 질문"><TextArea value={state.leaderQuestion} onChange={(value) => update({ leaderQuestion: value })} placeholder="예: 이 전략 과제를 영업팀의 고객 대화, 2주 실행관리, 팀원 코칭으로 어떻게 바꿀 수 있을까?" /></Field>
      <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-3 text-xs font-bold leading-5 text-cyan-950">Perplexity에는 답을 완성하라고 요청하지 않습니다. 최신 공개자료, 발행기관, 최근성, URL만 찾게 한 뒤 NotebookLM에서 소스 기반 분석을 진행합니다.</div>
      <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(pPrompt, 'Perplexity 최신자료 검색 전용 프롬프트')}>Perplexity 최신자료 검색 프롬프트 복사</button>
      {copyMessage ? <p className="text-sm font-black text-cyan-700">{copyMessage}</p> : null}
      <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{pPrompt}</pre>
      <Field label="Perplexity 자료 목록 결과 붙여넣기"><TextArea value={state.perplexityAnswer} onChange={(value) => update({ perplexityAnswer: value })} placeholder="Perplexity가 제시한 자료 목록과 URL을 그대로 붙여넣으세요. 전략 요약이나 실행계획이 아니라 자료 목록 중심이면 가장 좋습니다." /></Field>
    </Section>

    <Section title="2단계: Perplexity 결과에서 NotebookLM 웹 소스만 분리">
      <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-3 text-xs font-bold leading-5 text-cyan-950">
        NotebookLM에서 ‘웹’ 소스로 등록할 때는 분석 내용이 아니라 URL만 넣어야 합니다. 아래 URL 목록을 복사해 하나씩 웹 소스로 등록하세요. 긴 분석문은 웹 소스 입력칸에 넣지 않습니다.
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-black text-slate-700">분리된 웹 소스 URL: {webSourceUrlCount}개</div>
      <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(webSourceUrls, 'NotebookLM 웹 소스 URL')}>NotebookLM 웹 소스 URL 복사</button>
      <Field label="분리된 웹 소스 URL"><TextArea value={webSourceUrls} readOnly /></Field>
    </Section>

    <Section title="3단계: NotebookLM 소스 기반 전략 과제 압축">
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-bold leading-5 text-emerald-950">
        2단계에서 분리한 URL을 NotebookLM 웹 소스로 등록한 뒤, 아래 프롬프트를 채팅창에 붙여넣어 소스 기반으로 전략 과제와 2주 실행관리 질문을 압축합니다.
      </div>
      <button type="button" className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(analysisPrompt, 'NotebookLM 분석 질문')}>NotebookLM 프롬프트 복사</button>
      <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{analysisPrompt}</pre>
      <Field label="NotebookLM 결과 붙여넣기"><TextArea value={state.notebookAnswer} onChange={(value) => update({ notebookAnswer: value })} /></Field>
      <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={structureNotebookAnswer}>NotebookLM 결과 항목별로 정리하기</button>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="추진 과제 1"><TextArea value={state.issueOne} onChange={(value) => update({ issueOne: value })} /></Field>
        <Field label="추진 과제 2"><TextArea value={state.issueTwo} onChange={(value) => update({ issueTwo: value })} /></Field>
        <Field label="추진 과제 3"><TextArea value={state.issueThree} onChange={(value) => update({ issueThree: value })} /></Field>
        <Field label="우리 팀 실행 영향"><TextArea value={state.teamImpact} onChange={(value) => update({ teamImpact: value })} /></Field>
      </div>
      <Field label="2주 실행관리 질문과 KPI 후보"><TextArea value={state.metricQuestions} onChange={(value) => update({ metricQuestions: value })} /></Field>
      <Field label="주의해야 할 표현"><TextArea value={state.caution} onChange={(value) => update({ caution: value })} /></Field>
    </Section>

    <Section title="4단계: LM Studio 보고서·슬라이드·인포그래픽 생성 요청">
      <Field label="LM Studio 보고서 생성 요청"><TextArea value={report} readOnly /></Field>
      <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(report, 'LM Studio 보고서 생성 요청')}>보고서 요청문 복사</button>
      <TextArea value={state.reportDraft} onChange={(value) => update({ reportDraft: value })} placeholder="LM Studio에서 생성한 보고서 초안을 붙여넣으세요." />
      <Field label="LM Studio 슬라이드 생성 요청"><TextArea value={slides} readOnly /></Field>
      <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(slides, 'LM Studio 슬라이드 생성 요청')}>슬라이드 요청문 복사</button>
      <TextArea value={state.slideDraft} onChange={(value) => update({ slideDraft: value })} placeholder="LM Studio에서 생성한 슬라이드 구성안을 붙여넣으세요." />
      <Field label="LM Studio 인포그래픽 생성 요청"><TextArea value={infographic} readOnly /></Field>
      <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(infographic, 'LM Studio 인포그래픽 생성 요청')}>인포그래픽 요청문 복사</button>
      <TextArea value={state.infographicDraft} onChange={(value) => update({ infographicDraft: value })} placeholder="LM Studio에서 생성한 인포그래픽 초안을 붙여넣으세요." />
      <Field label="전략회의 메모"><TextArea value={state.meetingMemo} onChange={(value) => update({ meetingMemo: value })} /></Field>
      <Field label="예상 질문"><TextArea value={state.expectedQuestions} onChange={(value) => update({ expectedQuestions: value })} /></Field>
    </Section>
  </section>;
}
