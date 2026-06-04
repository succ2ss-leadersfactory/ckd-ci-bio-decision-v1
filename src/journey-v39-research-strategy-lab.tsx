import { useMemo, useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';

const V39_RESEARCH_STRATEGY_STORAGE_KEY = 'ckd.v39.researchStrategyPack.v1';
const V39_RESEARCH_STRATEGY_SMOKE_MARKERS = [
  'V39ResearchStrategyLab',
  'AI 전략 리서치 Pack',
  'Perplexity',
  'NotebookLM',
  'Studio',
  '5단계로 넘길 실행전략 질문',
].join('|');
void V39_RESEARCH_STRATEGY_SMOKE_MARKERS;

type ResearchPackResponse = {
  selectedTheme: string;
  customTheme: string;
  leaderQuestion: string;
  perplexityAnswer: string;
  notebookSourcePack: string;
  notebookLmAnswer: string;
  sourceReliabilityMemo: string;
  issueOne: string;
  issueTwo: string;
  issueThree: string;
  teamImpact: string;
  executionQuestions: string;
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

type ParsedKey = 'sourceReliabilityMemo' | 'issueOne' | 'issueTwo' | 'issueThree' | 'teamImpact' | 'executionQuestions' | 'complianceCaution';

const RESEARCH_THEMES = [
  '의료진 정보 탐색 변화와 고객 대화 품질',
  '대면 방문 제약과 대체 접점 실행관리',
  'CRM 기록은 늘었지만 실행 전환이 약한 팀',
  '컴플라이언스 강화 속 안전한 고객 대화 품질',
  '기존 팀원과 MZ·저연차 팀원의 실행 방식 차이',
];

const REVIEW_ITEMS = [
  'Perplexity 결과에 출처와 최근성 단서가 있는가?',
  'NotebookLM에 넣을 공개자료 소스 후보가 정리되었는가?',
  'NotebookLM 결과가 소스 기반 종합으로 정리되었는가?',
  '전략 이슈 3개가 제약 영업팀장의 실행관리 고민과 연결되는가?',
  '보고서 초안이 전략회의에서 설명 가능한 흐름인가?',
  '발표용 10장 슬라이드가 메시지 중심으로 구성되었는가?',
  '인포그래픽이 한눈에 이해되는 1페이지 요약 구조인가?',
  '5단계 관리 지표로 넘길 실행전략 질문이 남았는가?',
  '실제 고객명·기관명·제품명·내부 수치·개인정보가 제거되었는가?',
  '처방 가능성·전환 가능성·공략 등 위험 표현을 제거했는가?',
];

const DEFAULT_RESPONSE: ResearchPackResponse = {
  selectedTheme: RESEARCH_THEMES[0],
  customTheme: '',
  leaderQuestion: '',
  perplexityAnswer: '',
  notebookSourcePack: '',
  notebookLmAnswer: '',
  sourceReliabilityMemo: '',
  issueOne: '',
  issueTwo: '',
  issueThree: '',
  teamImpact: '',
  executionQuestions: '',
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

function activeTheme(response: ResearchPackResponse) {
  return response.customTheme.trim() || response.selectedTheme;
}

function buildPerplexityPrompt(response: ResearchPackResponse) {
  const theme = activeTheme(response);
  return `Perplexity 리서치 질문

역할: 제약 영업팀장의 공개자료 리서치 파트너
주제: ${theme}
우리 팀 관점의 질문: ${response.leaderQuestion || '이 변화가 제약 영업팀장의 2주 실행관리, 고객 대화 품질, 팀원 실행 점검에 어떤 영향을 주는지 조사해줘.'}

요청:
1. 최근 공개자료 기반 변화 신호를 5개 이내로 정리해 주세요.
2. 각 신호마다 확인 가능한 출처, 자료명, 날짜 또는 최근성 단서를 함께 제시해 주세요.
3. 제약 영업팀장 관점에서 전략 이슈 후보를 제안해 주세요.
4. 5단계 관리 지표로 바꿀 수 있는 실행 질문 후보를 제안해 주세요.
5. 출처가 약하거나 추정이 필요한 내용은 추정이라고 표시해 주세요.
6. 실제 고객명, 기관명, 제품명, 내부 수치, 개인정보는 사용하지 마세요.
7. 처방 가능성, 전환 가능성, 공략, 비교 우위 단정 같은 표현은 피하세요.

출력 형식:
- 핵심 변화 신호
- 근거/출처
- 신뢰도 주의점
- 전략 이슈 후보
- 5단계로 넘길 실행전략 질문
- 주의해야 할 표현`;
}

function buildSourcePackage(response: ResearchPackResponse) {
  if (!response.perplexityAnswer.trim()) return '';
  return `NotebookLM 소스 패키지 초안

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

function buildNotebookPrompt(response: ResearchPackResponse) {
  return `NotebookLM 소스 기반 종합 프롬프트

역할(R):
당신은 제약 영업팀장의 전략 리서치 파트너입니다.

맥락(C):
나는 C1바이오 영업팀장입니다. Perplexity로 찾은 공개자료를 NotebookLM 소스로 넣었습니다. 업로드된 소스만 근거로, 우리 팀의 2주 실행관리에 영향을 줄 전략 이슈를 정리하려고 합니다.

주제:
${activeTheme(response)}

지시사항(I):
1. 업로드된 소스에 근거한 변화 신호만 정리해 주세요.
2. 출처가 약하거나 추정이 필요한 내용은 구분해 주세요.
3. 제약 영업팀장 관점에서 전략 이슈 3개로 압축해 주세요.
4. 각 이슈가 우리 팀 실행, 고객 대화 품질, 팀원 실행 점검에 미치는 영향을 설명해 주세요.
5. 다음 단계에서 관리 지표로 바꿀 수 있는 실행전략 질문을 3~5개 제시해 주세요.
6. 실제 고객명, 기관명, 제품명, 내부 수치, 개인정보는 쓰지 마세요.
7. 처방 가능성, 전환 가능성, 공략, 비교 우위 단정 표현은 피하고 주의해야 할 표현으로 따로 정리해 주세요.

출력 형식(F):
아래 제목을 그대로 사용해 주세요.

[핵심 변화 신호]
[출처/근거 요약]
[전략 이슈 1]
[전략 이슈 2]
[전략 이슈 3]
[우리 팀에 미치는 영향]
[5단계로 넘길 실행전략 질문]
[주의해야 할 표현]`;
}

function buildStudioReportPrompt(response: ResearchPackResponse) {
  return `NotebookLM Studio 보고서 제작 요청

목적: 전략회의에서 사용할 1~2페이지 보고서 초안을 만든다. 회사 공식 자료가 아니라 교육용 전략회의 초안으로 작성한다.
주제: ${activeTheme(response)}
전략 이슈:
1. ${response.issueOne || '전략 이슈 1'}
2. ${response.issueTwo || '전략 이슈 2'}
3. ${response.issueThree || '전략 이슈 3'}
우리 팀 영향: ${response.teamImpact || '우리 팀에 미치는 영향'}
5단계로 넘길 실행전략 질문: ${response.executionQuestions || '관리 지표로 바꿀 실행전략 질문'}
주의해야 할 표현: ${response.complianceCaution || '주의해야 할 표현'}

요청:
1. 회의 참석자가 빠르게 이해할 수 있는 보고서 제목을 제안해 주세요.
2. 배경, 공개자료 근거, 전략 이슈 3개, 우리 팀 영향, 5단계 실행 질문 순서로 구성해 주세요.
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
- 5단계로 넘길 실행전략 질문
- 추가 확인 필요사항`;
}

function buildStudioSlidePrompt(response: ResearchPackResponse) {
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
- 5단계로 넘길 실행전략 질문: ${response.executionQuestions || '관리 지표로 바꿀 질문'}
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

function buildStudioInfographicPrompt(response: ResearchPackResponse) {
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

5단계로 넘길 실행전략 질문:
${response.executionQuestions || '관리 지표로 바꿀 질문'}

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
- 섹션 4: 5단계로 넘길 실행전략 질문
- 권장 시각 요소`;
}

function sectionTitleToKey(title: string): ParsedKey | '' {
  const clean = title.replace(/[\[\]#*_`]/g, '').replace(/^\d+[.)]\s*/, '').replace(/^[-•]\s*/, '').trim();
  if (clean.includes('전략 이슈 1')) return 'issueOne';
  if (clean.includes('전략 이슈 2')) return 'issueTwo';
  if (clean.includes('전략 이슈 3')) return 'issueThree';
  if (clean.includes('우리 팀에 미치는 영향') || clean.includes('팀 영향')) return 'teamImpact';
  if (clean.includes('5단계') || clean.includes('실행전략 질문')) return 'executionQuestions';
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
  const plainMatch = normalized.match(/^(핵심 변화 신호|출처\/근거 요약|전략 이슈\s*1|전략 이슈\s*2|전략 이슈\s*3|우리 팀에 미치는 영향|5단계로 넘길 실행전략 질문|실행전략 질문|주의해야 할 표현|주의 표현)\s*(?:[:：-]\s*)?(.*)$/);
  if (plainMatch) {
    const key = sectionTitleToKey(plainMatch[1]);
    if (key) return { key, inlineText: plainMatch[2]?.trim() || '' };
  }
  return null;
}

function parseNotebookAnswer(answer: string): Partial<ResearchPackResponse> {
  const buckets: Record<ParsedKey, string[]> = {
    sourceReliabilityMemo: [],
    issueOne: [],
    issueTwo: [],
    issueThree: [],
    teamImpact: [],
    executionQuestions: [],
    complianceCaution: [],
  };
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
  const patch: Partial<ResearchPackResponse> = {};
  for (const key of Object.keys(buckets) as ParsedKey[]) {
    const value = buckets[key].join('\n').trim();
    if (value) patch[key] = value;
  }
  return patch;
}

export function V39ResearchStrategyLab() {
  const [storedResponse, setResponse] = useStored<ResearchPackResponse>(V39_RESEARCH_STRATEGY_STORAGE_KEY, DEFAULT_RESPONSE);
  const response = { ...DEFAULT_RESPONSE, ...storedResponse };
  const [copyMessage, setCopyMessage] = useState('');
  const theme = activeTheme(response);
  const perplexityPrompt = useMemo(() => buildPerplexityPrompt(response), [response]);
  const notebookPrompt = useMemo(() => buildNotebookPrompt(response), [response]);
  const reportPrompt = useMemo(() => response.studioReportPrompt || buildStudioReportPrompt(response), [response]);
  const slidePrompt = useMemo(() => response.studioSlidePrompt || buildStudioSlidePrompt(response), [response]);
  const infographicPrompt = useMemo(() => response.studioInfographicPrompt || buildStudioInfographicPrompt(response), [response]);
  const checkedCount = REVIEW_ITEMS.filter((item) => response.reviewChecks?.[item]).length;

  const update = (patch: Partial<ResearchPackResponse>) => setResponse({ ...response, ...patch, savedAt: new Date().toISOString() });
  const generateSourcePack = () => {
    const nextSourcePack = buildSourcePackage(response);
    update({ notebookSourcePack: nextSourcePack });
    setCopyMessage(nextSourcePack ? 'NotebookLM 소스 패키지를 생성했습니다. 공개자료·최근성·위험 표현을 검토한 뒤 복사하세요.' : 'Perplexity 답변을 먼저 붙여넣으세요.');
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

  const outputText = `AI 전략 리서치 Pack\n\n[주제]\n${theme}\n\n[전략 이슈 1]\n${response.issueOne}\n\n[전략 이슈 2]\n${response.issueTwo}\n\n[전략 이슈 3]\n${response.issueThree}\n\n[우리 팀에 미치는 영향]\n${response.teamImpact}\n\n[5단계로 넘길 실행전략 질문]\n${response.executionQuestions}\n\n[보고서 초안]\n${response.studioReportDraft}\n\n[슬라이드 구성안]\n${response.studioSlideOutline}\n\n[인포그래픽 초안]\n${response.studioInfographicDraft}\n\n[발표 메모]\n${response.strategyMeetingMemo}\n\n[예상 질문]\n${response.expectedQuestions}\n\n[주의 표현]\n${response.complianceCaution}`;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-cyan-900">
        <p className="font-black">4단계 AI 전략 리서치 Pack</p>
        <p className="mt-1">Perplexity로 공개자료 기반 변화 신호를 찾고, NotebookLM으로 소스 기반 전략 이슈를 압축한 뒤, Studio로 전략회의용 보고서·슬라이드·인포그래픽 초안을 생성합니다.</p>
        <p className="mt-1 font-bold">이 단계의 마지막 결과물은 5단계 관리 지표로 넘길 실행전략 질문입니다.</p>
      </div>

      <SectionCard title="1단계: 리서치 주제 선택과 Perplexity 탐색">
        <label className="block space-y-1">
          <FieldLabel>리서치 주제 선택</FieldLabel>
          <select className="w-full rounded-xl border px-3 py-2" value={response.selectedTheme} onChange={(event) => update({ selectedTheme: event.target.value })}>
            {RESEARCH_THEMES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="block space-y-1">
          <FieldLabel>리서치 주제 직접 입력</FieldLabel>
          <input className="w-full rounded-xl border px-3 py-2" value={response.customTheme} onChange={(event) => update({ customTheme: event.target.value })} placeholder="예: 대면 방문 제약 증가와 고객 대화 품질 관리" />
          <p className="text-xs font-bold text-slate-500">직접 입력하면 선택형 주제보다 우선 반영됩니다. 현재 적용 주제: {theme}</p>
        </label>
        <label className="block space-y-1"><FieldLabel>우리 팀 관점의 리서치 질문</FieldLabel><TextArea value={response.leaderQuestion} onChange={(value) => update({ leaderQuestion: value })} placeholder="예: 이 변화가 우리 팀의 고객 대화 품질과 2주 실행관리 지표에 어떤 영향을 주는지 조사해줘." /></label>
        <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-bold text-slate-600">Perplexity에 복사해 공개자료와 출처를 탐색합니다.</p><button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(perplexityPrompt, 'Perplexity 프롬프트')}>Perplexity 프롬프트 복사</button></div>
        {copyMessage ? <p className="text-sm font-black text-cyan-700">{copyMessage}</p> : null}
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{perplexityPrompt}</pre>
      </SectionCard>

      <SectionCard title="2단계: Perplexity 결과와 NotebookLM 소스 패키지 정리">
        <label className="block space-y-1"><FieldLabel>Perplexity 답변 붙여넣기</FieldLabel><textarea className="min-h-40 w-full rounded-xl border px-3 py-2 text-sm leading-6" value={response.perplexityAnswer} onChange={(event) => update({ perplexityAnswer: event.target.value })} placeholder="Perplexity 답변을 붙여넣으세요. 출처, 링크, 자료명, 날짜, 근거 문장이 포함되어 있으면 좋습니다." /></label>
        <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={generateSourcePack}>NotebookLM 소스 패키지 생성</button>
        <label className="block space-y-1"><FieldLabel>NotebookLM 소스 패키지 검토·수정</FieldLabel><textarea className="min-h-40 w-full rounded-xl border px-3 py-2 text-sm leading-6" value={response.notebookSourcePack} onChange={(event) => update({ notebookSourcePack: event.target.value })} placeholder="생성된 소스 패키지를 검토·수정하세요. 출처, 최근성, 제외할 표현을 확인한 뒤 복사합니다." /></label>
        <button type="button" className="rounded-xl border px-4 py-2 text-sm font-black text-slate-700" onClick={() => copyText(response.notebookSourcePack, 'NotebookLM 소스 패키지')}>소스 패키지 복사</button>
      </SectionCard>

      <SectionCard title="3단계: NotebookLM 소스 기반 전략 이슈 압축">
        <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-bold text-slate-600">NotebookLM에 소스 패키지를 넣은 뒤 아래 프롬프트를 복사합니다.</p><button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(notebookPrompt, 'NotebookLM 프롬프트')}>NotebookLM 프롬프트 복사</button></div>
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{notebookPrompt}</pre>
        <label className="block space-y-1"><FieldLabel>NotebookLM 소스 기반 종합 결과 붙여넣기</FieldLabel><TextArea value={response.notebookLmAnswer} onChange={(value) => update({ notebookLmAnswer: value })} placeholder="NotebookLM의 소스 기반 종합 결과를 붙여넣으세요." /></label>
        <div className="rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-600">자동 분리 결과는 초안입니다. 팀장 관점에서 반드시 검토·수정하세요.</div>
        <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={splitNotebookAnswer}>전략 이슈 초안으로 분리</button>
      </SectionCard>

      <SectionCard title="4단계: 전략 이슈 3개와 실행 질문 정리">
        <label className="block space-y-1"><FieldLabel>전략 이슈 1</FieldLabel><TextArea value={response.issueOne} onChange={(value) => update({ issueOne: value })} /></label>
        <label className="block space-y-1"><FieldLabel>전략 이슈 2</FieldLabel><TextArea value={response.issueTwo} onChange={(value) => update({ issueTwo: value })} /></label>
        <label className="block space-y-1"><FieldLabel>전략 이슈 3</FieldLabel><TextArea value={response.issueThree} onChange={(value) => update({ issueThree: value })} /></label>
        <label className="block space-y-1"><FieldLabel>우리 팀에 미치는 영향</FieldLabel><TextArea value={response.teamImpact} onChange={(value) => update({ teamImpact: value })} /></label>
        <label className="block space-y-1"><FieldLabel>5단계로 넘길 실행전략 질문</FieldLabel><TextArea value={response.executionQuestions} onChange={(value) => update({ executionQuestions: value })} placeholder="예: 방문 이후 실제 다음 행동으로 이어졌는가? 고객 질문이 기록되고 후속 대화로 연결되는가?" /></label>
        <label className="block space-y-1"><FieldLabel>주의해야 할 표현</FieldLabel><TextArea value={response.complianceCaution} onChange={(value) => update({ complianceCaution: value })} placeholder="예: 처방 가능성, 공략 고객, 전환 가능성, 비교 우위 단정 등" /></label>
      </SectionCard>

      <SectionCard title="5단계: NotebookLM Studio 보고서 초안 생성">
        <p className="text-sm font-bold text-slate-600">전략회의에서 사용할 1~2페이지 보고서 초안 요청문입니다.</p>
        <TextArea value={reportPrompt} onChange={(value) => update({ studioReportPrompt: value })} />
        <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(reportPrompt, '보고서 제작 요청문')}>보고서 요청문 복사</button>
        <TextArea value={response.studioReportDraft} onChange={(value) => update({ studioReportDraft: value })} placeholder="NotebookLM Studio에서 생성한 전략회의 보고서 초안을 붙여넣고 수정하세요." />
      </SectionCard>

      <SectionCard title="6단계: NotebookLM Studio 발표용 10장 슬라이드 구성">
        <p className="text-sm font-bold text-slate-600">보고서 초안을 바탕으로 전략회의 발표용 10장 슬라이드 구성을 만듭니다.</p>
        <TextArea value={slidePrompt} onChange={(value) => update({ studioSlidePrompt: value })} />
        <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(slidePrompt, '슬라이드 제작 요청문')}>슬라이드 요청문 복사</button>
        <TextArea value={response.studioSlideOutline} onChange={(value) => update({ studioSlideOutline: value })} placeholder="NotebookLM Studio에서 생성한 발표용 10장 슬라이드 구성안을 붙여넣고 수정하세요." />
      </SectionCard>

      <SectionCard title="7단계: NotebookLM Studio 인포그래픽 초안 생성">
        <p className="text-sm font-bold text-slate-600">전략회의 핵심 내용을 1페이지 인포그래픽 형태로 정리합니다.</p>
        <TextArea value={infographicPrompt} onChange={(value) => update({ studioInfographicPrompt: value })} />
        <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(infographicPrompt, '인포그래픽 제작 요청문')}>인포그래픽 요청문 복사</button>
        <TextArea value={response.studioInfographicDraft} onChange={(value) => update({ studioInfographicDraft: value })} placeholder="NotebookLM Studio에서 생성한 인포그래픽 초안을 붙여넣고 수정하세요." />
      </SectionCard>

      <SectionCard title="8단계: 전략회의 발표 준비와 최종 점검">
        <label className="block space-y-1"><FieldLabel>발표 메모</FieldLabel><TextArea value={response.strategyMeetingMemo} onChange={(value) => update({ strategyMeetingMemo: value })} placeholder="전략회의에서 팀장이 설명할 핵심 발언을 작성하세요." /></label>
        <label className="block space-y-1"><FieldLabel>예상 질문과 답변 관점</FieldLabel><TextArea value={response.expectedQuestions} onChange={(value) => update({ expectedQuestions: value })} placeholder="상사, 본사, 팀원 관점에서 나올 질문과 답변 방향을 작성하세요." /></label>
        <div className="grid gap-2 md:grid-cols-2">
          {REVIEW_ITEMS.map((item) => <label key={item} className="flex items-start gap-2 rounded-xl border p-3 text-sm font-bold leading-5"><input type="checkbox" className="mt-1" checked={Boolean(response.reviewChecks?.[item])} onChange={(event) => update({ reviewChecks: { ...response.reviewChecks, [item]: event.target.checked } })} /><span>{item}</span></label>)}
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-700">점검 완료: {checkedCount} / {REVIEW_ITEMS.length}</div>
        <pre className="whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{outputText}</pre>
        <p className="text-xs font-bold text-slate-500">자동 저장 키: {V39_RESEARCH_STRATEGY_STORAGE_KEY} / 마지막 저장: {response.savedAt || '아직 입력 전'}</p>
      </SectionCard>
    </div>
  );
}

export default V39ResearchStrategyLab;
