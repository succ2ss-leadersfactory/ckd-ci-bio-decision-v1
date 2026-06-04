import { useMemo, useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';

const V39_RESEARCH_STRATEGY_STORAGE_KEY = 'ckd.v39.researchStrategy.v2';
const V39_PROMPT_PRACTICE_STORAGE_KEY = 'ckd.v39.promptPractice.v1';
const V39_RESEARCH_STRATEGY_SMOKE_MARKERS = [
  'V39ResearchStrategyLab',
  'AI 전략 리서치',
  'Perplexity',
  'NotebookLM',
  'Studio',
  'AI 없이도 할 수 있습니다',
  'AI를 쓰면 좋아지는 점',
  '보고서를 예쁘게 만드는 시간이 아닙니다',
  '3단계 구조화 프롬프트 연결',
  '5단계 연결 카드',
  '관리 지표로 바꿀 실행 질문',
  '영업활동 기록은 늘었지만 실행 전환이 약한 팀',
].join('|');
void V39_RESEARCH_STRATEGY_SMOKE_MARKERS;

type ResearchStrategyResponse = {
  selectedTheme: string;
  customTheme: string;
  leaderQuestion: string;
  perplexityAnswer: string;
  notebookSourceBundle: string;
  notebookLmAnswer: string;
  sourceReliabilityMemo: string;
  issueOne: string;
  issueTwo: string;
  issueThree: string;
  teamImpact: string;
  metricBridgeQuestions: string;
  complianceCaution: string;
  studioReportPrompt: string;
  studioReportDraft: string;
  studioSlidePrompt: string;
  studioSlideOutline: string;
  studioInfographicPrompt: string;
  studioInfographicDraft: string;
  strategyMeetingMemo: string;
  expectedQuestions: string;
  reviewChecks: Record<string, boolean>;
  savedAt: string;
};

type ParsedKey = 'sourceReliabilityMemo' | 'issueOne' | 'issueTwo' | 'issueThree' | 'teamImpact' | 'metricBridgeQuestions' | 'complianceCaution';

type PromptPracticeSummary = {
  concern?: string;
  plainQuestion?: string;
  finalPrompt?: string;
  task?: string;
};

const LEGACY_CRM_THEME = 'CRM 기록은 늘었지만 실행 전환이 약한 팀';
const ACTIVITY_RECORD_THEME = '영업활동 기록은 늘었지만 실행 전환이 약한 팀';

const RESEARCH_THEMES = [
  '의료진 정보 탐색 변화와 고객 대화 품질',
  '대면 방문 제약과 대체 접점 실행관리',
  ACTIVITY_RECORD_THEME,
  '승인자료 활용과 안전한 후속 대화 품질',
  '팀원별 실행 편차와 후속조치 품질 차이',
];

const THEME_BRIDGE_HINTS: Record<string, string[]> = {
  '의료진 정보 탐색 변화와 고객 대화 품질': ['고객 질문 기록률', '방문 전 사전 준비 메모율', '후속 자료 요청 대응률', '대화 주제 전환 기록 수'],
  '대면 방문 제약과 대체 접점 실행관리': ['대안활동 실행건수', '방문 제한 사유 공유건수', '비대면 후속 접점 확보건수', '자료 전달 후 후속 확인율'],
  [ACTIVITY_RECORD_THEME]: ['후속조치 완료율', '다음접점 확보건수', '고객 질문 기록률', '실행 제약 공유건수'],
  '승인자료 활용과 안전한 후속 대화 품질': ['승인자료 활용 점검률', '위험 표현 수정건수', '자료 제공 후 확인 질문 기록률', '안전 표현 사전 점검건수'],
  '팀원별 실행 편차와 후속조치 품질 차이': ['후속조치 편차 확인건수', '팀원별 다음접점 확보율', '고객 반응 기록 충실도', '동행 후 개선 행동 실행률'],
};

const REVIEW_ITEMS = [
  '3단계 구조화 프롬프트의 문제의식이 4단계 리서치 질문으로 이어졌는가?',
  'Perplexity 결과에 출처와 최근성 단서가 있는가?',
  'NotebookLM에 넣을 공개자료 소스 후보가 정리되었는가?',
  'NotebookLM 결과가 소스 기반 종합으로 정리되었는가?',
  '전략 이슈 3개가 제약 영업팀장의 실행관리 고민과 연결되는가?',
  '보고서·슬라이드·인포그래픽은 선택 활용이며 핵심은 5단계 실행 질문임을 확인했는가?',
  '5단계 관리 지표로 바꿀 실행 질문이 별도 카드에 남았는가?',
  '실제 고객명·기관명·제품명·내부 수치·개인정보가 제거되었는가?',
  '처방 가능성·전환 가능성·공략 등 위험 표현을 제거했는가?',
];

const DEFAULT_RESPONSE: ResearchStrategyResponse = {
  selectedTheme: ACTIVITY_RECORD_THEME,
  customTheme: '',
  leaderQuestion: '',
  perplexityAnswer: '',
  notebookSourceBundle: '',
  notebookLmAnswer: '',
  sourceReliabilityMemo: '',
  issueOne: '',
  issueTwo: '',
  issueThree: '',
  teamImpact: '',
  metricBridgeQuestions: '',
  complianceCaution: '',
  studioReportPrompt: '',
  studioReportDraft: '',
  studioSlidePrompt: '',
  studioSlideOutline: '',
  studioInfographicPrompt: '',
  studioInfographicDraft: '',
  strategyMeetingMemo: '',
  expectedQuestions: '',
  reviewChecks: {},
  savedAt: '',
};

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-black text-slate-900">{title}</h3>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function FieldLabel({ children }: { children: string }) {
  return <span className="text-xs font-black text-slate-500">{children}</span>;
}

function TextArea({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <textarea className="min-h-24 w-full rounded-xl border px-3 py-2 text-sm leading-6" value={value ?? ''} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />;
}

function normalizeTheme(theme: string) {
  return theme === LEGACY_CRM_THEME ? ACTIVITY_RECORD_THEME : theme;
}

function sanitizeCrmWording(value: string) {
  return value
    .replaceAll(LEGACY_CRM_THEME, ACTIVITY_RECORD_THEME)
    .replaceAll('CRM 기록', '영업활동 기록')
    .replaceAll('CRM', '영업활동 기록');
}

function activeTheme(response: ResearchStrategyResponse) {
  const custom = sanitizeCrmWording(response.customTheme.trim());
  return custom || normalizeTheme(response.selectedTheme);
}

function getThemeBridgeHints(theme: string) {
  return THEME_BRIDGE_HINTS[normalizeTheme(theme)] ?? ['후속조치 완료율', '다음접점 확보건수', '고객 질문 기록률', '실행 제약 공유건수'];
}

function loadPromptPracticeSummary(): PromptPracticeSummary | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(V39_PROMPT_PRACTICE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PromptPracticeSummary;
  } catch {
    return null;
  }
}

function promptPracticePreview(summary: PromptPracticeSummary | null) {
  if (!summary) return '3단계에서 만든 구조화 프롬프트가 있으면 이곳에 연결됩니다. 없더라도 아래에서 우리 팀 관점의 리서치 질문을 직접 입력할 수 있습니다.';
  return [
    summary.concern ? `[우리 팀 고민]\n${sanitizeCrmWording(summary.concern)}` : '',
    summary.plainQuestion ? `[일반 질문]\n${sanitizeCrmWording(summary.plainQuestion)}` : '',
    summary.task ? `[4단계로 넘길 질문]\n${sanitizeCrmWording(summary.task)}` : '',
  ].filter(Boolean).join('\n\n') || '3단계 결과가 저장되어 있지만 요약할 수 있는 항목이 부족합니다.';
}

function buildPerplexityPrompt(response: ResearchStrategyResponse) {
  const theme = activeTheme(response);
  return `Perplexity 리서치 질문

역할: 제약영업 현장을 이해하는 공개자료 리서치 담당자 관점에서 봐주세요.
주제: ${theme}
우리 팀 관점의 질문: ${response.leaderQuestion || '이 변화가 제약 영업팀장의 2주 실행관리, 고객 대화 품질, 팀원 실행 점검에 어떤 영향을 주는지 조사해줘.'}

요청:
1. 최근 공개자료 기반 변화 신호를 5개 이내로 정리해 주세요.
2. 각 신호마다 확인 가능한 출처, 자료명, 날짜 또는 최근성 단서를 함께 제시해 주세요.
3. 제약 영업팀장 관점에서 전략 이슈 후보를 제안해 주세요.
4. 다음 단계에서 관리 지표로 바꿀 수 있는 실행 질문 후보를 제안해 주세요.
5. 출처가 약하거나 추정이 필요한 내용은 추정이라고 표시해 주세요.
6. 실제 고객명, 기관명, 제품명, 내부 수치, 개인정보는 사용하지 마세요.
7. 처방 가능성, 전환 가능성, 공략, 비교 우위 단정 같은 표현은 피하세요.

출력 형식:
- 핵심 변화 신호
- 근거/출처
- 신뢰도 주의점
- 전략 이슈 후보
- 관리 지표로 바꿀 실행 질문
- 주의해야 할 표현`;
}

function buildSourceBundle(response: ResearchStrategyResponse) {
  if (!response.perplexityAnswer.trim()) return '';
  return `NotebookLM 소스 묶음 초안

[리서치 주제]
${activeTheme(response)}

[우리 팀 관점의 리서치 질문]
${response.leaderQuestion || '공개자료를 근거로 제약 영업팀 실행관리에 중요한 전략 이슈를 정리'}

[NotebookLM에 넣을 소스 후보]
아래 Perplexity 결과에서 실제로 확인 가능한 링크, 자료명, 기관명, 날짜, 근거 문장을 추려 NotebookLM 소스로 넣습니다.

${response.perplexityAnswer}

[소스 검토 메모]
- 실제 링크가 열리는지 확인합니다.
- 자료 날짜와 최근성을 확인합니다.
- 기사, 협회 자료, 보고서, 기관 자료 등 자료 유형을 구분합니다.
- 출처가 약하거나 추정 표현이 많은 내용은 전략회의 근거로 직접 사용하지 않습니다.
- 실제 고객명, 기관명, 제품명, 내부 수치, 개인정보는 제거합니다.
- 처방 가능성, 전환 가능성, 공략, 비교 우위 단정 표현은 제거합니다.`;
}

function buildNotebookPrompt(response: ResearchStrategyResponse) {
  return `NotebookLM 소스 기반 종합 프롬프트

역할:
제약영업 현장과 영업기획 보고 흐름을 모두 이해하는 담당자 관점에서 봐주세요.

맥락:
나는 C1바이오 영업팀장입니다. Perplexity로 찾은 공개자료를 NotebookLM 소스로 넣었습니다. 업로드된 소스만 근거로, 우리 팀의 2주 실행관리에 영향을 줄 전략 이슈를 정리하려고 합니다.

주제:
${activeTheme(response)}

지시/과제:
1. 업로드된 소스에 근거한 변화 신호만 정리해 주세요.
2. 출처가 약하거나 추정이 필요한 내용은 구분해 주세요.
3. 제약 영업팀장 관점에서 전략 이슈 3개로 압축해 주세요.
4. 각 이슈가 우리 팀 실행, 고객 대화 품질, 팀원 실행 점검에 미치는 영향을 설명해 주세요.
5. 다음 단계에서 관리 지표로 바꿀 수 있는 실행 질문을 3~5개 제시해 주세요.
6. 실제 고객명, 기관명, 제품명, 내부 수치, 개인정보는 쓰지 마세요.
7. 처방 가능성, 전환 가능성, 공략, 비교 우위 단정 표현은 피하고 주의해야 할 표현으로 따로 정리해 주세요.

형식:
아래 제목을 그대로 사용해 주세요.

[핵심 변화 신호]
[출처/근거 요약]
[전략 이슈 1]
[전략 이슈 2]
[전략 이슈 3]
[우리 팀에 미치는 영향]
[관리 지표로 바꿀 실행 질문]
[주의해야 할 표현]`;
}

function buildStudioReportPrompt(response: ResearchStrategyResponse) {
  return `NotebookLM Studio 보고서 제작 요청

목적: 전략회의에서 사용할 1~2페이지 보고서 초안을 만든다. 회사 공식 자료가 아니라 교육용 전략회의 초안으로 작성한다.
주제: ${activeTheme(response)}
전략 이슈:
1. ${response.issueOne || '전략 이슈 1'}
2. ${response.issueTwo || '전략 이슈 2'}
3. ${response.issueThree || '전략 이슈 3'}
우리 팀 영향: ${response.teamImpact || '우리 팀에 미치는 영향'}
관리 지표로 바꿀 실행 질문: ${response.metricBridgeQuestions || '5단계 관리 지표로 바꿀 질문'}
주의해야 할 표현: ${response.complianceCaution || '주의해야 할 표현'}

요청:
1. 회의 참석자가 빠르게 이해할 수 있는 보고서 제목을 제안해 주세요.
2. 배경, 공개자료 근거, 전략 이슈 3개, 우리 팀 영향, 관리 지표로 바꿀 실행 질문 순서로 구성해 주세요.
3. 소스 기반 내용과 팀장 판단을 구분해 주세요.
4. 확인이 더 필요한 내용은 별도 표시해 주세요.
5. 실제 고객명, 기관명, 제품명, 내부 수치, 개인정보는 제외해 주세요.
6. 처방 가능성, 전환 가능성, 공략, 비교 우위 단정 표현은 제외해 주세요.

출력 형식:
- 보고서 제목
- 핵심 메시지 3줄
- 근거 요약
- 전략 이슈 3개
- 우리 팀 실행 영향
- 관리 지표로 바꿀 실행 질문
- 추가 확인 필요사항`;
}

function buildStudioSlidePrompt(response: ResearchStrategyResponse) {
  return `NotebookLM Studio 발표 슬라이드 제작 요청

목적:
전략회의에서 발표할 수 있는 10장 슬라이드 구성안을 만든다. 단순 요약 문서가 아니라, 팀장이 설명하기 쉬운 발표 자료로 구성한다.

활용할 핵심 내용:
${response.studioReportDraft || 'NotebookLM Studio 보고서 초안 내용을 반영'}

반드시 반영할 전략 이슈:
1. ${response.issueOne || '전략 이슈 1'}
2. ${response.issueTwo || '전략 이슈 2'}
3. ${response.issueThree || '전략 이슈 3'}

추가 맥락:
- 우리 팀에 미치는 영향: ${response.teamImpact || '우리 팀에 미치는 영향'}
- 관리 지표로 바꿀 실행 질문: ${response.metricBridgeQuestions || '5단계 관리 지표로 바꿀 질문'}
- 주의해야 할 표현: ${response.complianceCaution || '주의해야 할 표현'}

요청:
1. 발표용으로 최적화된 10장 슬라이드 구성안을 만들어 주세요.
2. 각 슬라이드는 핵심 메시지 1개만 분명하게 보이게 해 주세요.
3. 본문 bullet은 3개 이내로 제한해 주세요.
4. 시각자료 제안도 함께 넣어 주세요.
5. 마지막 슬라이드는 5단계 관리 지표로 연결할 실행 질문으로 마무리해 주세요.
6. 실제 고객명, 기관명, 제품명, 내부 수치, 개인정보는 제외해 주세요.
7. 처방 가능성, 전환 가능성, 공략, 비교 우위 단정 표현은 제외해 주세요.

권장 10장 구성:
- Slide 1: 전략회의 제목 / 문제 제기
- Slide 2: 공개자료 기반 변화 신호
- Slide 3: 핵심 근거 요약
- Slide 4: 전략 이슈 1
- Slide 5: 전략 이슈 2
- Slide 6: 전략 이슈 3
- Slide 7: 우리 팀 실행 영향
- Slide 8: 실행관리 관점의 시사점
- Slide 9: 5단계 관리 지표로 연결할 질문
- Slide 10: 회의 논의 질문`;
}

function buildStudioInfographicPrompt(response: ResearchStrategyResponse) {
  return `NotebookLM Studio 인포그래픽 제작 요청

목적:
전략회의 핵심 내용을 한눈에 보여주는 1페이지 인포그래픽 초안을 만든다. 회의 후 공유자료로도 활용할 수 있도록 짧고 시각적으로 정리한다.

주제:
${activeTheme(response)}

핵심 전략 이슈:
1. ${response.issueOne || '전략 이슈 1'}
2. ${response.issueTwo || '전략 이슈 2'}
3. ${response.issueThree || '전략 이슈 3'}

우리 팀에 미치는 영향:
${response.teamImpact || '우리 팀에 미치는 영향'}

관리 지표로 바꿀 실행 질문:
${response.metricBridgeQuestions || '5단계 관리 지표로 바꿀 질문'}

주의해야 할 표현:
${response.complianceCaution || '주의해야 할 표현'}

요청:
1. 1페이지 인포그래픽 구조로 정리해 주세요.
2. 상단에는 핵심 제목과 메시지 1~2줄을 넣어 주세요.
3. 중단에는 전략 이슈 3개를 아이콘/박스 중심으로 정리해 주세요.
4. 하단에는 우리 팀 실행 영향과 5단계로 넘길 질문을 요약해 주세요.
5. 텍스트는 짧고 명확하게, 시각 중심 구조로 제안해 주세요.
6. 실제 고객명, 기관명, 제품명, 내부 수치, 개인정보는 제외해 주세요.
7. 처방 가능성, 전환 가능성, 공략, 비교 우위 단정 표현은 제외해 주세요.

출력 형식:
- 인포그래픽 제목
- 핵심 메시지
- 섹션 1: 공개자료 기반 변화 신호
- 섹션 2: 전략 이슈 3개
- 섹션 3: 우리 팀 실행 영향
- 섹션 4: 관리 지표로 바꿀 실행 질문
- 권장 시각 요소`;
}

function sectionTitleToKey(title: string): ParsedKey | '' {
  const clean = title.replace(/[\[\]#*_`]/g, '').replace(/^\d+[.)]\s*/, '').replace(/^[-•]\s*/, '').trim();
  if (clean.includes('전략 이슈 1')) return 'issueOne';
  if (clean.includes('전략 이슈 2')) return 'issueTwo';
  if (clean.includes('전략 이슈 3')) return 'issueThree';
  if (clean.includes('우리 팀에 미치는 영향') || clean.includes('팀 영향')) return 'teamImpact';
  if (clean.includes('관리 지표로 바꿀 실행 질문') || clean.includes('5단계') || clean.includes('실행전략 질문')) return 'metricBridgeQuestions';
  if (clean.includes('주의')) return 'complianceCaution';
  if (clean.includes('핵심 변화') || clean.includes('출처') || clean.includes('근거') || clean.includes('신뢰도') || clean.includes('충돌')) return 'sourceReliabilityMemo';
  return '';
}

function readNotebookHeading(line: string): { key: ParsedKey; inlineText: string } | null {
  let normalized = line.trim().replace(/^>\s*/, '').replace(/^#{1,6}\s*/, '').replace(/^\d+[.)]\s*/, '').replace(/^[-•]\s*/, '').trim();
  normalized = normalized.replace(/^\*\*/, '').replace(/\*\*$/, '').trim();
  const bracketMatch = normalized.match(/^\[([^\]]+)\]\s*(?:[:：-]\s*)?(.*)$/);
  if (bracketMatch) {
    const key = sectionTitleToKey(bracketMatch[1]);
    if (key) return { key, inlineText: bracketMatch[2]?.trim() || '' };
  }
  const plainMatch = normalized.match(/^(핵심 변화 신호|출처\/근거 요약|전략 이슈\s*1|전략 이슈\s*2|전략 이슈\s*3|우리 팀에 미치는 영향|관리 지표로 바꿀 실행 질문|5단계로 넘길 실행전략 질문|실행전략 질문|주의해야 할 표현|주의 표현)\s*(?:[:：-]\s*)?(.*)$/);
  if (plainMatch) {
    const key = sectionTitleToKey(plainMatch[1]);
    if (key) return { key, inlineText: plainMatch[2]?.trim() || '' };
  }
  return null;
}

function parseNotebookAnswer(answer: string): Partial<ResearchStrategyResponse> {
  const buckets: Record<ParsedKey, string[]> = { sourceReliabilityMemo: [], issueOne: [], issueTwo: [], issueThree: [], teamImpact: [], metricBridgeQuestions: [], complianceCaution: [] };
  let currentKey: ParsedKey | '' = '';
  for (const line of answer.split(/\r?\n/)) {
    const heading = readNotebookHeading(line);
    if (heading) {
      currentKey = heading.key;
      if (heading.inlineText) buckets[currentKey].push(heading.inlineText);
      continue;
    }
    if (currentKey) buckets[currentKey].push(line);
  }
  const patch: Partial<ResearchStrategyResponse> = {};
  for (const key of Object.keys(buckets) as ParsedKey[]) {
    const value = buckets[key].join('\n').trim();
    if (value) patch[key] = value;
  }
  return patch;
}

export function V39ResearchStrategyLab() {
  const [storedResponse, setResponse] = useStored<ResearchStrategyResponse>(V39_RESEARCH_STRATEGY_STORAGE_KEY, DEFAULT_RESPONSE);
  const response = { ...DEFAULT_RESPONSE, ...storedResponse, selectedTheme: normalizeTheme(storedResponse.selectedTheme ?? DEFAULT_RESPONSE.selectedTheme), customTheme: sanitizeCrmWording(storedResponse.customTheme ?? ''), reviewChecks: storedResponse.reviewChecks ?? {} };
  const [copyMessage, setCopyMessage] = useState('');
  const [promptSummary, setPromptSummary] = useState<PromptPracticeSummary | null>(loadPromptPracticeSummary);
  const theme = activeTheme(response);
  const bridgeHints = getThemeBridgeHints(theme);
  const perplexityPrompt = useMemo(() => buildPerplexityPrompt(response), [response]);
  const notebookPrompt = useMemo(() => buildNotebookPrompt(response), [response]);
  const reportPrompt = useMemo(() => response.studioReportPrompt || buildStudioReportPrompt(response), [response]);
  const slidePrompt = useMemo(() => response.studioSlidePrompt || buildStudioSlidePrompt(response), [response]);
  const infographicPrompt = useMemo(() => response.studioInfographicPrompt || buildStudioInfographicPrompt(response), [response]);
  const checkedCount = REVIEW_ITEMS.filter((item) => response.reviewChecks?.[item]).length;

  const update = (patch: Partial<ResearchStrategyResponse>) => setResponse({ ...response, ...patch, savedAt: new Date().toISOString() });
  const refreshPromptPracticeSummary = () => {
    const nextSummary = loadPromptPracticeSummary();
    setPromptSummary(nextSummary);
    setCopyMessage(nextSummary ? '3단계 구조화 프롬프트 결과를 다시 불러왔습니다.' : '3단계 저장 결과를 찾지 못했습니다.');
  };
  const applyPromptPracticeQuestion = () => {
    const question = promptSummary?.task || promptSummary?.plainQuestion || '';
    if (!question.trim()) {
      setCopyMessage('4단계 리서치 질문으로 가져올 3단계 문장이 없습니다.');
      return;
    }
    update({ leaderQuestion: sanitizeCrmWording(question) });
    setCopyMessage('3단계 질문을 4단계 리서치 질문으로 가져왔습니다.');
  };
  const generateSourceBundle = () => {
    const nextSourceBundle = buildSourceBundle(response);
    update({ notebookSourceBundle: nextSourceBundle });
    setCopyMessage(nextSourceBundle ? 'NotebookLM 소스 묶음을 생성했습니다. 공개자료·최근성·위험 표현을 검토한 뒤 복사하세요.' : 'Perplexity 답변을 먼저 붙여넣으세요.');
  };
  const splitNotebookAnswer = () => {
    const patch = parseNotebookAnswer(response.notebookLmAnswer || '');
    const count = Object.keys(patch).length;
    if (!count) {
      setCopyMessage('분리할 수 있는 제목을 찾지 못했습니다. NotebookLM 출력 형식의 대괄호 제목을 확인하세요.');
      return;
    }
    update(patch);
    setCopyMessage(`NotebookLM 결과를 ${count}개 항목의 초안으로 분리했습니다. 반드시 팀장 관점으로 검토·수정하세요.`);
  };
  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text || '');
      setCopyMessage(`${label} 내용을 복사했습니다.`);
    } catch {
      setCopyMessage('복사가 차단되었습니다. 내용을 직접 선택해 복사하세요.');
    }
  };

  const outputText = `AI 전략 리서치 결과

[주제]
${theme}

[3단계 구조화 프롬프트 연결]
${promptPracticePreview(promptSummary)}

[전략 이슈 1]
${response.issueOne}

[전략 이슈 2]
${response.issueTwo}

[전략 이슈 3]
${response.issueThree}

[우리 팀에 미치는 영향]
${response.teamImpact}

[관리 지표로 바꿀 실행 질문]
${response.metricBridgeQuestions}

[보고서 초안]
${response.studioReportDraft}

[슬라이드 구성안]
${response.studioSlideOutline}

[인포그래픽 초안]
${response.studioInfographicDraft}

[발표 메모]
${response.strategyMeetingMemo}

[예상 질문]
${response.expectedQuestions}

[주의 표현]
${response.complianceCaution}`;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950">
        <p className="font-black">4단계 AI 전략 리서치</p>
        <p className="mt-1 font-bold">보고서를 예쁘게 만드는 시간이 아닙니다. 팀장이 감으로 느끼던 현장 변화를 공개자료와 AI로 정리해, 우리 팀의 실행 기준으로 바꾸기 위한 단계입니다.</p>
        <p className="mt-1">Perplexity로 공개자료 기반 변화 신호를 찾고, NotebookLM으로 소스 기반 전략 이슈를 압축합니다. Studio 보고서·슬라이드·인포그래픽은 Wow 포인트이자 선택 활용이며, 핵심 결과물은 5단계에서 관리 지표로 바꿀 실행 질문입니다.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
          <p className="font-black text-slate-950">AI 없이도 할 수 있습니다</p>
          <p className="mt-1">팀장은 현장 경험, 기사, 내부 회의 자료를 바탕으로 시장 변화와 고객 변화를 파악하고 전략회의 자료를 준비할 수 있습니다.</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
          <p className="font-black">AI를 쓰면 좋아지는 점</p>
          <p className="mt-1">공개자료 탐색, 출처·최근성 정리, 전략 이슈 압축, 보고서·슬라이드 초안을 더 빠르게 만들고 5단계 실행 질문까지 연결할 수 있습니다.</p>
        </div>
      </section>

      <SectionCard title="3단계 구조화 프롬프트 연결">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-bold leading-5 text-slate-700 whitespace-pre-wrap">{promptPracticePreview(promptSummary)}</div>
        <div className="flex flex-wrap gap-2"><button type="button" className="rounded-xl border px-4 py-2 text-sm font-black text-slate-700" onClick={refreshPromptPracticeSummary}>3단계 결과 새로고침</button><button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={applyPromptPracticeQuestion}>리서치 질문으로 가져오기</button></div>
        <p className="text-xs font-bold leading-5 text-slate-500">3단계에서 만든 질문을 그대로 쓰기보다, 4단계에서는 공개자료 리서치에 맞게 주제와 질문을 한 번 더 좁혀 사용합니다.</p>
      </SectionCard>

      <SectionCard title="1단계: 리서치 주제 선택과 Perplexity 탐색">
        <label className="block space-y-1"><FieldLabel>리서치 주제 선택</FieldLabel><select className="w-full rounded-xl border px-3 py-2" value={normalizeTheme(response.selectedTheme)} onChange={(event) => update({ selectedTheme: event.target.value })}>{RESEARCH_THEMES.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-bold leading-5 text-emerald-950"><p className="font-black">이 주제는 다음 관리 지표로 연결될 수 있습니다.</p><p className="mt-1">{bridgeHints.join(' · ')}</p></div>
        <label className="block space-y-1"><FieldLabel>리서치 주제 직접 입력</FieldLabel><input className="w-full rounded-xl border px-3 py-2" value={response.customTheme} onChange={(event) => update({ customTheme: sanitizeCrmWording(event.target.value) })} placeholder="예: 대면 방문 제약 증가와 고객 대화 품질 관리" /><p className="text-xs font-bold text-slate-500">직접 입력하면 선택형 주제보다 우선 반영됩니다. 현재 적용 주제: {theme}</p></label>
        <label className="block space-y-1"><FieldLabel>우리 팀 관점의 리서치 질문</FieldLabel><TextArea value={response.leaderQuestion} onChange={(value) => update({ leaderQuestion: sanitizeCrmWording(value) })} placeholder="예: 이 변화가 우리 팀의 고객 대화 품질과 2주 실행관리 지표에 어떤 영향을 주는지 조사해줘." /></label>
        <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-bold text-slate-600">Perplexity에 복사해 공개자료와 출처를 탐색합니다.</p><button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(perplexityPrompt, 'Perplexity 프롬프트')}>Perplexity 프롬프트 복사</button></div>
        {copyMessage ? <p className="text-sm font-black text-cyan-700">{copyMessage}</p> : null}
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{perplexityPrompt}</pre>
      </SectionCard>

      <SectionCard title="2단계: Perplexity 결과와 NotebookLM 소스 묶음 정리">
        <label className="block space-y-1"><FieldLabel>Perplexity 답변 붙여넣기</FieldLabel><textarea className="min-h-40 w-full rounded-xl border px-3 py-2 text-sm leading-6" value={response.perplexityAnswer} onChange={(event) => update({ perplexityAnswer: event.target.value })} placeholder="Perplexity 답변을 붙여넣으세요. 출처, 링크, 자료명, 날짜, 근거 문장이 포함되어 있으면 좋습니다." /></label>
        <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={generateSourceBundle}>NotebookLM 소스 묶음 생성</button>
        <label className="block space-y-1"><FieldLabel>NotebookLM 소스 묶음 검토·수정</FieldLabel><textarea className="min-h-40 w-full rounded-xl border px-3 py-2 text-sm leading-6" value={response.notebookSourceBundle} onChange={(event) => update({ notebookSourceBundle: event.target.value })} placeholder="생성된 소스 묶음을 검토·수정하세요. 출처, 최근성, 제외할 표현을 확인한 뒤 복사합니다." /></label>
        <button type="button" className="rounded-xl border px-4 py-2 text-sm font-black text-slate-700" onClick={() => copyText(response.notebookSourceBundle, 'NotebookLM 소스 묶음')}>소스 묶음 복사</button>
      </SectionCard>

      <SectionCard title="3단계: NotebookLM 소스 기반 전략 이슈 압축">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-950">NotebookLM은 업로드한 소스를 근거로 정리합니다. 출처가 약한 내용은 회의자료로 바로 쓰지 말고, 팀장 판단으로 다시 확인합니다.</div>
        <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-bold text-slate-600">NotebookLM에 소스 묶음을 넣은 뒤 아래 프롬프트를 복사합니다.</p><button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(notebookPrompt, 'NotebookLM 프롬프트')}>NotebookLM 프롬프트 복사</button></div>
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{notebookPrompt}</pre>
        <label className="block space-y-1"><FieldLabel>NotebookLM 소스 기반 종합 결과 붙여넣기</FieldLabel><TextArea value={response.notebookLmAnswer} onChange={(value) => update({ notebookLmAnswer: value })} placeholder="NotebookLM의 소스 기반 종합 결과를 붙여넣으세요." /></label>
        <div className="rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-600">자동 분리 결과는 초안입니다. 팀장 관점에서 반드시 검토·수정하세요.</div>
        <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={splitNotebookAnswer}>전략 이슈 초안으로 분리</button>
      </SectionCard>

      <SectionCard title="4단계: 전략 이슈 3개와 팀 영향 정리">
        <label className="block space-y-1"><FieldLabel>전략 이슈 1</FieldLabel><TextArea value={response.issueOne} onChange={(value) => update({ issueOne: value })} /></label>
        <label className="block space-y-1"><FieldLabel>전략 이슈 2</FieldLabel><TextArea value={response.issueTwo} onChange={(value) => update({ issueTwo: value })} /></label>
        <label className="block space-y-1"><FieldLabel>전략 이슈 3</FieldLabel><TextArea value={response.issueThree} onChange={(value) => update({ issueThree: value })} /></label>
        <label className="block space-y-1"><FieldLabel>우리 팀에 미치는 영향</FieldLabel><TextArea value={response.teamImpact} onChange={(value) => update({ teamImpact: value })} /></label>
        <label className="block space-y-1"><FieldLabel>주의해야 할 표현</FieldLabel><TextArea value={response.complianceCaution} onChange={(value) => update({ complianceCaution: value })} placeholder="예: 처방 가능성, 공략 고객, 전환 가능성, 비교 우위 단정 등" /></label>
      </SectionCard>

      <SectionCard title="5단계 연결 카드: 관리 지표로 바꿀 실행 질문">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold leading-6 text-emerald-950"><p className="font-black">이 카드가 5단계 입력값입니다.</p><p className="mt-1">전략 이슈를 회의자료로 끝내지 않고, 다음 단계에서 우리 팀의 2주 관리 지표로 바꾸기 위한 질문을 남깁니다.</p></div>
        <label className="block space-y-1"><FieldLabel>관리 지표로 바꿀 실행 질문</FieldLabel><TextArea value={response.metricBridgeQuestions} onChange={(value) => update({ metricBridgeQuestions: value })} placeholder="예: 방문 이후 실제 다음 행동으로 이어졌는가? 고객 질문이 기록되고 후속 대화로 연결되는가? 방문 제한 고객에게 대체 접점이 실행되었는가?" /></label>
        <div className="rounded-2xl bg-slate-50 p-3 text-xs font-bold leading-5 text-slate-600"><p className="font-black text-slate-900">현재 주제에서 관리 지표로 연결 가능한 후보</p><p className="mt-1">{bridgeHints.join(' · ')}</p></div>
      </SectionCard>

      <SectionCard title="6단계: NotebookLM Studio 보고서 초안 생성"><div className="rounded-2xl border border-violet-200 bg-violet-50 p-3 text-xs font-bold leading-5 text-violet-950">Studio는 Wow 포인트이자 선택 활용입니다. 시간이 부족하면 강사 시연으로 확인하고, 반드시 완성해야 할 핵심 결과물은 5단계 연결 질문입니다.</div><p className="text-sm font-bold text-slate-600">전략회의에서 사용할 1~2페이지 보고서 초안 요청문입니다.</p><TextArea value={reportPrompt} onChange={(value) => update({ studioReportPrompt: value })} /><button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(reportPrompt, '보고서 제작 요청문')}>보고서 요청문 복사</button><TextArea value={response.studioReportDraft} onChange={(value) => update({ studioReportDraft: value })} placeholder="NotebookLM Studio에서 생성한 전략회의 보고서 초안을 붙여넣고 수정하세요." /></SectionCard>
      <SectionCard title="7단계: NotebookLM Studio 발표용 10장 슬라이드 구성"><p className="text-sm font-bold text-slate-600">보고서 초안을 바탕으로 전략회의 발표용 10장 슬라이드 구성을 만듭니다.</p><TextArea value={slidePrompt} onChange={(value) => update({ studioSlidePrompt: value })} /><button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(slidePrompt, '슬라이드 제작 요청문')}>슬라이드 요청문 복사</button><TextArea value={response.studioSlideOutline} onChange={(value) => update({ studioSlideOutline: value })} placeholder="NotebookLM Studio에서 생성한 발표용 10장 슬라이드 구성안을 붙여넣고 수정하세요." /></SectionCard>
      <SectionCard title="8단계: NotebookLM Studio 인포그래픽 초안 생성"><p className="text-sm font-bold text-slate-600">전략회의 핵심 내용을 1페이지 인포그래픽 형태로 정리합니다.</p><TextArea value={infographicPrompt} onChange={(value) => update({ studioInfographicPrompt: value })} /><button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(infographicPrompt, '인포그래픽 요청문')}>인포그래픽 요청문 복사</button><TextArea value={response.studioInfographicDraft} onChange={(value) => update({ studioInfographicDraft: value })} placeholder="NotebookLM Studio에서 생성한 인포그래픽 초안을 붙여넣고 수정하세요." /></SectionCard>

      <SectionCard title="9단계: 전략회의 발표 준비와 최종 점검">
        <label className="block space-y-1"><FieldLabel>발표 메모</FieldLabel><TextArea value={response.strategyMeetingMemo} onChange={(value) => update({ strategyMeetingMemo: value })} placeholder="전략회의에서 팀장이 설명할 핵심 발언을 작성하세요." /></label>
        <label className="block space-y-1"><FieldLabel>예상 질문과 답변 관점</FieldLabel><TextArea value={response.expectedQuestions} onChange={(value) => update({ expectedQuestions: value })} placeholder="상사, 본사, 팀원 관점에서 나올 질문과 답변 방향을 작성하세요." /></label>
        <div className="grid gap-2 md:grid-cols-2">{REVIEW_ITEMS.map((item) => <label key={item} className="flex items-start gap-2 rounded-xl border p-3 text-sm font-bold leading-5"><input type="checkbox" className="mt-1" checked={Boolean(response.reviewChecks?.[item])} onChange={(event) => update({ reviewChecks: { ...response.reviewChecks, [item]: event.target.checked } })} /><span>{item}</span></label>)}</div>
        <div className="rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-700">점검 완료: {checkedCount} / {REVIEW_ITEMS.length}</div>
        <pre className="whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{outputText}</pre>
        <p className="text-xs font-bold text-slate-500">자동 저장 키: {V39_RESEARCH_STRATEGY_STORAGE_KEY} / 마지막 저장: {response.savedAt || '아직 입력 전'}</p>
      </SectionCard>
    </div>
  );
}

export default V39ResearchStrategyLab;
