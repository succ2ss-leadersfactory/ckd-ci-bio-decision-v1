import { useMemo, useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';
import { V36_STORAGE_KEYS } from './journey-v36-preview-config';

type ResearchResponse = {
  selectedTheme: string;
  customTheme: string;
  leaderQuestion: string;
  perplexityAnswer: string;
  notebookSourcePack: string;
  sourcePackMemo: string;
  notebookLmAnswer: string;
  sourceReliabilityMemo: string;
  issueOne: string;
  issueTwo: string;
  issueThree: string;
  teamImpact: string;
  nextQuestions: string;
  executionTranslation: string;
  studioReportPrompt: string;
  studioReportDraft: string;
  studioSlidePrompt: string;
  studioSlideOutline: string;
  studioInfographicPrompt: string;
  studioInfographicDraft: string;
  strategyMeetingMemo: string;
  expectedQuestions: string;
  complianceCaution: string;
  reviewChecks: Record<string, boolean>;
  savedAt: string;
};

type ParsedKey = 'sourceReliabilityMemo' | 'issueOne' | 'issueTwo' | 'issueThree' | 'teamImpact' | 'nextQuestions' | 'executionTranslation' | 'complianceCaution';

const THEMES = [
  '의료진 정보 탐색 방식 변화',
  '병원·의원 방문 환경 변화',
  '제약영업 컴플라이언스 기준 강화',
  '디지털 채널과 대면 영업의 역할 재조정',
];

const REVIEW_ITEMS = [
  'Perplexity 결과에 출처와 최근성 단서가 있는가?',
  'NotebookLM에 넣을 소스 패키지를 생성했는가?',
  'NotebookLM 결과가 소스 기반 종합으로 정리되었는가?',
  'NotebookLM Studio 보고서 산출물 목적이 명확한가?',
  '발표용 10장 슬라이드가 메시지 중심으로 구성되었는가?',
  '인포그래픽이 한눈에 이해되는 요약형 구조인가?',
  '전략회의 발표 슬라이드 흐름이 잡혀 있는가?',
  '전략 이슈 3개가 팀 실행과 연결되어 있는가?',
  '민감정보나 단정적 표현을 제거했는가?',
];

const DEFAULT_RESPONSE: ResearchResponse = {
  selectedTheme: THEMES[0],
  customTheme: '',
  leaderQuestion: '',
  perplexityAnswer: '',
  notebookSourcePack: '',
  sourcePackMemo: '',
  notebookLmAnswer: '',
  sourceReliabilityMemo: '',
  issueOne: '',
  issueTwo: '',
  issueThree: '',
  teamImpact: '',
  nextQuestions: '',
  executionTranslation: '',
  studioReportPrompt: '',
  studioReportDraft: '',
  studioSlidePrompt: '',
  studioSlideOutline: '',
  studioInfographicPrompt: '',
  studioInfographicDraft: '',
  strategyMeetingMemo: '',
  expectedQuestions: '',
  complianceCaution: '',
  reviewChecks: {},
  savedAt: '',
};

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function FieldLabel({ children }: { children: string }) {
  return <span className="text-xs font-bold text-slate-500">{children}</span>;
}

function TextArea({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={value ?? ''} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />;
}

function getResearchTheme(response: ResearchResponse) {
  return response.customTheme?.trim() || response.selectedTheme;
}

function buildPerplexityPrompt(response: ResearchResponse) {
  const researchTheme = getResearchTheme(response);
  return `Perplexity 리서치 질문\n\n역할: 제약영업 팀장의 외부 환경 리서치 파트너\n주제: ${researchTheme}\n우리 팀 관점의 리서치 질문: ${response.leaderQuestion || '최근 제약영업 환경 변화가 영업팀 실행 방식에 어떤 영향을 주는지 조사해줘.'}\n\n요청:\n1. 최근 변화 신호를 5개 이내로 정리해줘.\n2. 각 신호마다 확인 가능한 출처 또는 출처 유형을 함께 제시해줘.\n3. 제약영업팀장 관점에서 의미 있는 전략 이슈 후보를 제안해줘.\n4. 확인이 더 필요한 내용은 추정이라고 표시해줘.\n5. 실제 고객명, 기관명, 제품명, 내부 수치, 민감정보는 사용하지 말아줘.\n\n출력 형식:\n- 변화 신호\n- 근거/출처\n- 신뢰도 주의점\n- 전략 이슈 후보\n- 추가 확인 질문`;
}

function buildSourcePackage(response: ResearchResponse) {
  const answer = response.perplexityAnswer?.trim();
  if (!answer) return '';
  const researchTheme = getResearchTheme(response);

  return `NotebookLM 소스 패키지 초안\n\n[리서치 주제]\n${researchTheme}\n\n[우리 팀 관점의 리서치 질문]\n${response.leaderQuestion || '최근 제약영업 환경 변화가 영업팀 실행 방식에 어떤 영향을 주는지 조사'}\n\n[NotebookLM에 넣을 소스 후보]\n아래 Perplexity 결과에서 출처, 링크, 자료명, 근거 문장을 확인하여 NotebookLM 소스로 넣습니다.\n\n${answer}\n\n[소스 검토 메모]\n- 실제 링크가 열리는지 확인한다.\n- 자료 날짜와 최근성을 확인한다.\n- 기사, 보고서, 기관자료 등 자료 유형을 구분한다.\n- 출처가 약하거나 추정 표현이 많은 내용은 회의 자료의 근거로 직접 사용하지 않는다.\n- 실제 고객명, 기관명, 제품명, 내부 수치, 민감정보는 제거한다.`;
}

function buildNotebookPrompt(response: ResearchResponse) {
  const researchTheme = getResearchTheme(response);
  return `NotebookLM 소스 기반 종합 프롬프트\n\n역할(R):\n당신은 제약영업 팀장을 돕는 외부 환경 분석 파트너입니다.\n\n맥락(C):\n나는 C1바이오 영업팀장입니다. Perplexity로 찾은 공개 자료를 NotebookLM 소스로 넣었습니다. 업로드된 소스만 근거로, 우리 팀 실행에 영향을 줄 전략 이슈를 정리하려고 합니다.\n\n주제:\n${researchTheme}\n\n우리 팀 관점의 리서치 질문:\n${response.leaderQuestion || '소스 자료를 근거로 제약영업팀 실행에 중요한 전략 이슈를 정리해줘.'}\n\n지시사항(I):\n1. 업로드된 소스에 근거한 변화 신호만 정리해 주세요.\n2. 출처가 약하거나 추정이 필요한 내용은 구분해 주세요.\n3. 영업팀장 관점에서 전략 이슈 3개로 압축해 주세요.\n4. 각 이슈가 우리 팀 실행에 미치는 영향을 설명해 주세요.\n5. 추가 확인 질문과 실행전략으로 바꿀 질문을 제시해 주세요.\n6. 컴플라이언스상 주의해야 할 표현을 정리해 주세요.\n\n출력 형식(F):\n아래 제목을 그대로 사용해 주세요.\n\n[핵심 변화 신호]\n[출처/근거 요약]\n[전략 이슈 1]\n[전략 이슈 2]\n[전략 이슈 3]\n[우리 팀에 미치는 영향]\n[추가 확인 질문]\n[실행전략으로 번역할 질문]\n[주의해야 할 표현]`;
}

function buildStudioReportPrompt(response: ResearchResponse) {
  const researchTheme = getResearchTheme(response);
  return `NotebookLM Studio 보고서 제작 요청\n\n목적: 전략회의에서 발표할 1~2페이지 보고서 초안을 만든다.\n주제: ${researchTheme}\n전략 이슈:\n1. ${response.issueOne || '전략 이슈 1'}\n2. ${response.issueTwo || '전략 이슈 2'}\n3. ${response.issueThree || '전략 이슈 3'}\n우리 팀 영향: ${response.teamImpact || '우리 팀에 미치는 영향'}\n\n요청:\n1. 회의 참석자가 빠르게 이해할 수 있는 보고서 제목을 제안해줘.\n2. 배경, 근거, 전략 이슈, 팀 영향, 제안 방향 순서로 구성해줘.\n3. 소스 기반 내용과 팀장 판단을 구분해줘.\n4. 확인이 더 필요한 내용은 별도 표시해줘.\n5. 민감정보나 단정적 표현은 제외해줘.\n\n출력 형식:\n- 보고서 제목\n- 핵심 메시지 3줄\n- 근거 요약\n- 전략 이슈 3개\n- 우리 팀 실행 제안\n- 추가 확인 필요사항`;
}

function buildStudioSlidePrompt(response: ResearchResponse) {
  return `NotebookLM Studio 발표 슬라이드 제작 요청\n\n목적:\n전략회의에서 발표할 수 있는 발표용 슬라이드 초안을 만든다. 단순 요약 문서가 아니라, 실제 발표자가 설명하기 쉬운 발표 자료로 구성한다.\n\n활용할 핵심 내용:\n${response.studioReportDraft || 'NotebookLM Studio 보고서 초안 내용을 반영'}\n\n반드시 반영할 전략 이슈:\n1. ${response.issueOne || '전략 이슈 1'}\n2. ${response.issueTwo || '전략 이슈 2'}\n3. ${response.issueThree || '전략 이슈 3'}\n\n추가 맥락:\n- 우리 팀에 미치는 영향: ${response.teamImpact || '우리 팀에 미치는 영향'}\n- 실행전략으로 번역할 질문: ${response.executionTranslation || '실행전략으로 번역할 질문'}\n- 주의해야 할 표현: ${response.complianceCaution || '주의해야 할 표현'}\n\n요청:\n1. 발표용으로 최적화된 10장 슬라이드 구성안을 만들어줘.\n2. 각 슬라이드는 읽는 문서형이 아니라 발표형으로 구성해줘.\n3. 슬라이드마다 핵심 메시지는 1개만 분명하게 보이게 해줘.\n4. 본문 bullet은 3개 이내로 제한해줘.\n5. 시각자료(차트, 아이콘, 비교표, 흐름도 등) 제안도 함께 넣어줘.\n6. 마지막 슬라이드는 실행 제안과 회의 논의 질문으로 마무리해줘.\n7. 민감정보나 단정적 표현은 제외해줘.\n\n출력 형식:\n각 슬라이드는 아래 형식을 따른다.\n\n- Slide 1. 제목\n  - 슬라이드 목적\n  - 핵심 메시지\n  - 본문 bullet 3개 이내\n  - 권장 시각자료\n  - 발표자 메모\n\n반드시 총 10장으로 작성해줘.\n\n권장 10장 구성 예시:\n- Slide 1: 전략회의 제목 / 문제 제기\n- Slide 2: 외부 변화 신호 요약\n- Slide 3: 핵심 근거 요약\n- Slide 4: 전략 이슈 1\n- Slide 5: 전략 이슈 2\n- Slide 6: 전략 이슈 3\n- Slide 7: 우리 팀에 미치는 영향\n- Slide 8: 실행전략 제안\n- Slide 9: 실행 우선순위와 팀 적용 포인트\n- Slide 10: 회의 논의 질문 및 의사결정 요청`;
}

function buildStudioInfographicPrompt(response: ResearchResponse) {
  const researchTheme = getResearchTheme(response);
  return `NotebookLM Studio 인포그래픽 제작 요청\n\n목적:\n전략회의 핵심 내용을 한눈에 보여주는 1페이지 인포그래픽 초안을 만든다. 발표 보조자료나 회의 후 공유자료로 바로 활용할 수 있도록 시각적으로 정리한다.\n\n주제:\n${researchTheme}\n\n핵심 전략 이슈:\n1. ${response.issueOne || '전략 이슈 1'}\n2. ${response.issueTwo || '전략 이슈 2'}\n3. ${response.issueThree || '전략 이슈 3'}\n\n우리 팀에 미치는 영향:\n${response.teamImpact || '우리 팀에 미치는 영향'}\n\n추가 확인 질문:\n${response.nextQuestions || '추가 확인 질문'}\n\n실행전략으로 번역할 질문:\n${response.executionTranslation || '실행전략으로 번역할 질문'}\n\n주의해야 할 표현:\n${response.complianceCaution || '주의해야 할 표현'}\n\n요청:\n1. 1페이지 인포그래픽 구조로 정리해줘.\n2. 상단에는 핵심 제목과 핵심 메시지 1~2줄을 넣어줘.\n3. 중단에는 전략 이슈 3개를 아이콘/박스 중심으로 정리해줘.\n4. 하단에는 우리 팀 실행 제안과 다음 액션을 요약해줘.\n5. 오른쪽 또는 하단에는 추가 확인 질문과 주의 표현을 넣어줘.\n6. 텍스트는 짧고 명확하게, 시각 중심 구조로 제안해줘.\n7. 발표용 보조자료답게 과밀한 문장형 설명은 줄여줘.\n8. 민감정보나 단정적 표현은 제외해줘.\n\n출력 형식:\n- 인포그래픽 제목\n- 핵심 메시지\n- 섹션 1: 외부 변화 신호\n- 섹션 2: 전략 이슈 3개\n- 섹션 3: 우리 팀 영향\n- 섹션 4: 실행 제안\n- 섹션 5: 추가 확인 질문 / 주의 표현\n- 권장 시각 요소(아이콘, 흐름도, 강조 박스, 숫자 카드 등)`;
}

function sectionTitleToKey(title: string): ParsedKey | '' {
  const clean = title
    .replace(/[\[\]#*_`]/g, '')
    .replace(/^\d+[.)]\s*/, '')
    .replace(/^[-•]\s*/, '')
    .trim();

  if (clean.includes('전략 이슈 1')) return 'issueOne';
  if (clean.includes('전략 이슈 2')) return 'issueTwo';
  if (clean.includes('전략 이슈 3')) return 'issueThree';
  if (clean.includes('우리 팀에 미치는 영향') || clean.includes('팀 영향')) return 'teamImpact';
  if (clean.includes('추가 확인')) return 'nextQuestions';
  if (clean.includes('실행전략')) return 'executionTranslation';
  if (clean.includes('주의')) return 'complianceCaution';
  if (clean.includes('핵심 변화') || clean.includes('출처') || clean.includes('근거') || clean.includes('신뢰도') || clean.includes('충돌')) return 'sourceReliabilityMemo';
  return '';
}

function readNotebookHeading(line: string): { key: ParsedKey; inlineText: string } | null {
  let normalized = line
    .trim()
    .replace(/^>\s*/, '')
    .replace(/^#{1,6}\s*/, '')
    .replace(/^\d+[.)]\s*/, '')
    .replace(/^[-•]\s*/, '')
    .trim();

  normalized = normalized.replace(/^\*\*/, '').replace(/\*\*$/, '').trim();

  const bracketMatch = normalized.match(/^\[([^\]]+)\]\s*(?:[:：-]\s*)?(.*)$/);
  if (bracketMatch) {
    const key = sectionTitleToKey(bracketMatch[1]);
    if (key) return { key, inlineText: bracketMatch[2]?.trim() || '' };
  }

  const plainMatch = normalized.match(/^(핵심 변화 신호|출처\/근거 요약|소스 신뢰도와 충돌 메모|전략 이슈\s*1|전략 이슈\s*2|전략 이슈\s*3|우리 팀에 미치는 영향|추가 확인 질문|실행전략으로 번역할 질문|주의해야 할 표현|주의 표현)\s*(?:[:：-]\s*)?(.*)$/);
  if (plainMatch) {
    const key = sectionTitleToKey(plainMatch[1]);
    if (key) return { key, inlineText: plainMatch[2]?.trim() || '' };
  }

  return null;
}

function parseNotebookAnswer(answer: string): Partial<ResearchResponse> {
  const lines = answer.split(/\r?\n/);
  const buckets: Record<ParsedKey, string[]> = {
    sourceReliabilityMemo: [],
    issueOne: [],
    issueTwo: [],
    issueThree: [],
    teamImpact: [],
    nextQuestions: [],
    executionTranslation: [],
    complianceCaution: [],
  };
  let currentKey: ParsedKey | '' = '';

  for (const line of lines) {
    const heading = readNotebookHeading(line);

    if (heading) {
      currentKey = heading.key;
      if (heading.inlineText) buckets[currentKey].push(heading.inlineText);
      continue;
    }

    if (currentKey) buckets[currentKey].push(line);
  }

  const patch: Partial<ResearchResponse> = {};
  const apply = (key: ParsedKey) => {
    const value = buckets[key].join('\n').replace(/^\s+|\s+$/g, '');
    if (value) patch[key] = value;
  };

  apply('sourceReliabilityMemo');
  apply('issueOne');
  apply('issueTwo');
  apply('issueThree');
  apply('teamImpact');
  apply('nextQuestions');
  apply('executionTranslation');
  apply('complianceCaution');
  return patch;
}

export function ResearchStrategyLab() {
  const [storedResponse, setResponse] = useStored<ResearchResponse>(V36_STORAGE_KEYS.researchStrategy, DEFAULT_RESPONSE);
  const response = { ...DEFAULT_RESPONSE, ...storedResponse };
  const [copyMessage, setCopyMessage] = useState('');
  const activeResearchTheme = getResearchTheme(response);
  const perplexityPrompt = useMemo(() => buildPerplexityPrompt(response), [response]);
  const notebookPrompt = useMemo(() => buildNotebookPrompt(response), [response]);
  const reportPrompt = useMemo(() => response.studioReportPrompt || buildStudioReportPrompt(response), [response]);
  const slidePrompt = useMemo(() => response.studioSlidePrompt || buildStudioSlidePrompt(response), [response]);
  const infographicPrompt = useMemo(() => response.studioInfographicPrompt || buildStudioInfographicPrompt(response), [response]);
  const checkedCount = REVIEW_ITEMS.filter((item) => response.reviewChecks?.[item]).length;

  const update = (patch: Partial<ResearchResponse>) => {
    setResponse({ ...response, ...patch, savedAt: new Date().toISOString() });
  };

  const generateSourcePack = () => {
    const nextSourcePack = buildSourcePackage(response);
    update({ notebookSourcePack: nextSourcePack, sourcePackMemo: nextSourcePack });
    setCopyMessage(nextSourcePack ? 'NotebookLM 소스 패키지를 생성했습니다. 내용을 검토한 뒤 복사하세요.' : 'Perplexity 답변을 먼저 붙여넣으세요.');
  };

  const splitNotebookAnswer = () => {
    const patch = parseNotebookAnswer(response.notebookLmAnswer || '');
    const count = Object.keys(patch).length;
    if (!count) {
      setCopyMessage('분리할 수 있는 제목을 찾지 못했습니다. NotebookLM 출력 형식의 대괄호 제목을 확인하세요.');
      return;
    }
    update(patch);
    setCopyMessage(`NotebookLM 결과를 ${count}개 항목의 초안으로 분리했습니다. 4단계 이후에서 반드시 검토·수정하세요.`);
  };

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text || '');
      setCopyMessage(`${label} 내용을 복사했습니다.`);
    } catch {
      setCopyMessage('복사가 차단되었습니다. 내용을 직접 선택해 복사하세요.');
    }
  };

  const outputText = `전략회의 산출물\n\n[주제]\n${activeResearchTheme}\n\n[전략 이슈 1]\n${response.issueOne}\n\n[전략 이슈 2]\n${response.issueTwo}\n\n[전략 이슈 3]\n${response.issueThree}\n\n[보고서 초안]\n${response.studioReportDraft}\n\n[슬라이드 구성안]\n${response.studioSlideOutline}\n\n[인포그래픽 초안]\n${response.studioInfographicDraft}\n\n[발표 메모]\n${response.strategyMeetingMemo}\n\n[예상 질문]\n${response.expectedQuestions}\n\n[주의 표현]\n${response.complianceCaution}`;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
        <p className="font-bold">Perplexity + NotebookLM Studio 전략회의 Lab</p>
        <p className="mt-1">최종 산출물은 전략회의에 사용할 보고서 초안, 발표용 10장 슬라이드, 1페이지 인포그래픽입니다. Perplexity 결과를 바탕으로 NotebookLM 소스 패키지를 만들고, Studio에서 발표 산출물을 제작합니다.</p>
      </div>

      <SectionCard title="1단계: Perplexity 최신 자료 탐색">
        <label className="block space-y-1">
          <FieldLabel>리서치 주제 선택</FieldLabel>
          <select className="w-full rounded-xl border px-3 py-2" value={response.selectedTheme} onChange={(event) => update({ selectedTheme: event.target.value })}>
            {THEMES.map((theme) => <option key={theme} value={theme}>{theme}</option>)}
          </select>
        </label>
        <label className="block space-y-1">
          <FieldLabel>리서치 주제 직접 입력</FieldLabel>
          <input className="w-full rounded-xl border px-3 py-2" value={response.customTheme} onChange={(event) => update({ customTheme: event.target.value })} placeholder="예: 비대면 채널 확대에 따른 개원의 방문 전략 변화" />
          <p className="text-xs text-slate-500">직접 입력하면 선택형 주제보다 우선 반영됩니다. 현재 적용 주제: {activeResearchTheme}</p>
        </label>
        <label className="block space-y-1"><FieldLabel>우리 팀 관점의 리서치 질문</FieldLabel><TextArea value={response.leaderQuestion} onChange={(value) => update({ leaderQuestion: value })} placeholder="예: 이 변화가 우리 팀의 방문 우선순위와 2주 실행계획에 어떤 영향을 주는지 조사해줘." /></label>
        <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm text-slate-600">Perplexity에 복사해 최신 자료와 출처를 탐색합니다.</p><button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={() => copyText(perplexityPrompt, 'Perplexity 프롬프트')}>Perplexity 프롬프트 복사</button></div>
        {copyMessage ? <p className="text-sm font-semibold text-cyan-700">{copyMessage}</p> : null}
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{perplexityPrompt}</pre>
      </SectionCard>

      <SectionCard title="2단계: Perplexity 결과와 NotebookLM 소스 묶음 정리">
        <label className="block space-y-1"><FieldLabel>Perplexity 답변 붙여넣기</FieldLabel><textarea className="min-h-40 w-full rounded-xl border px-3 py-2" value={response.perplexityAnswer} onChange={(event) => update({ perplexityAnswer: event.target.value })} placeholder="Perplexity 답변을 붙여넣으세요. 출처, 링크, 근거 문장이 포함되어 있으면 좋습니다." /></label>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={generateSourcePack}>NotebookLM 소스 패키지 생성</button>
        </div>
        <label className="block space-y-1"><FieldLabel>NotebookLM 소스 패키지 검토·수정</FieldLabel><textarea className="min-h-40 w-full rounded-xl border px-3 py-2" value={response.notebookSourcePack || response.sourcePackMemo} onChange={(event) => update({ notebookSourcePack: event.target.value, sourcePackMemo: event.target.value })} placeholder="생성된 소스 패키지를 검토·수정하세요. 출처, 링크, 근거 문장, 제외할 표현을 확인한 뒤 복사합니다." /></label>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-xl border px-4 py-2 text-sm font-bold text-slate-700" onClick={() => copyText(response.notebookSourcePack || response.sourcePackMemo, 'NotebookLM 소스 패키지')}>소스 패키지 복사</button>
        </div>
      </SectionCard>

      <SectionCard title="3단계: NotebookLM 소스 기반 종합">
        <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm text-slate-600">NotebookLM에 소스 패키지를 넣은 뒤, 아래 R-C-I-F 프롬프트를 복사해 사용합니다.</p><button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={() => copyText(notebookPrompt, 'NotebookLM 프롬프트')}>NotebookLM 프롬프트 복사</button></div>
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{notebookPrompt}</pre>
        <label className="block space-y-1"><FieldLabel>NotebookLM 소스 기반 종합 결과 붙여넣기</FieldLabel><TextArea value={response.notebookLmAnswer} onChange={(value) => update({ notebookLmAnswer: value })} placeholder="NotebookLM의 소스 기반 종합 결과를 붙여넣으세요." /></label>
        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">자동 분리 결과는 초안입니다. 이후 단계에서 팀장 관점으로 반드시 검토·수정하세요.</div>
        <button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={splitNotebookAnswer}>전략 이슈 초안으로 분리</button>
      </SectionCard>

      <SectionCard title="4단계: 전략 이슈 3개 정리">
        <label className="block space-y-1"><FieldLabel>전략 이슈 1</FieldLabel><TextArea value={response.issueOne} onChange={(value) => update({ issueOne: value })} /></label>
        <label className="block space-y-1"><FieldLabel>전략 이슈 2</FieldLabel><TextArea value={response.issueTwo} onChange={(value) => update({ issueTwo: value })} /></label>
        <label className="block space-y-1"><FieldLabel>전략 이슈 3</FieldLabel><TextArea value={response.issueThree} onChange={(value) => update({ issueThree: value })} /></label>
      </SectionCard>

      <SectionCard title="5단계: 팀 실행전략으로 번역">
        <label className="block space-y-1"><FieldLabel>우리 팀에 미치는 영향</FieldLabel><TextArea value={response.teamImpact} onChange={(value) => update({ teamImpact: value })} /></label>
        <label className="block space-y-1"><FieldLabel>추가 확인 질문</FieldLabel><TextArea value={response.nextQuestions} onChange={(value) => update({ nextQuestions: value })} /></label>
        <label className="block space-y-1"><FieldLabel>실행전략으로 번역할 질문</FieldLabel><TextArea value={response.executionTranslation} onChange={(value) => update({ executionTranslation: value })} /></label>
      </SectionCard>

      <SectionCard title="6단계: NotebookLM Studio 전략회의 보고서 제작">
        <p className="text-sm text-slate-600">NotebookLM Studio에서 보고서 형식 산출물을 만들 때 사용할 요청문입니다.</p>
        <TextArea value={reportPrompt} onChange={(value) => update({ studioReportPrompt: value })} />
        <button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={() => copyText(reportPrompt, '보고서 제작 요청문')}>보고서 요청문 복사</button>
        <TextArea value={response.studioReportDraft} onChange={(value) => update({ studioReportDraft: value })} placeholder="NotebookLM Studio에서 생성한 전략회의 보고서 초안을 붙여넣고 팀장 관점으로 수정하세요." />
      </SectionCard>

      <SectionCard title="7단계: NotebookLM Studio 발표용 10장 슬라이드 제작">
        <p className="text-sm text-slate-600">보고서 초안을 바탕으로 전략회의 발표용 10장 슬라이드 구성을 만듭니다.</p>
        <TextArea value={slidePrompt} onChange={(value) => update({ studioSlidePrompt: value })} />
        <button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={() => copyText(slidePrompt, '슬라이드 제작 요청문')}>슬라이드 요청문 복사</button>
        <TextArea value={response.studioSlideOutline} onChange={(value) => update({ studioSlideOutline: value })} placeholder="NotebookLM Studio에서 생성한 발표용 10장 슬라이드 구성안을 붙여넣고 수정하세요." />
      </SectionCard>

      <SectionCard title="8단계: NotebookLM Studio 인포그래픽 제작">
        <p className="text-sm text-slate-600">전략회의 핵심 내용을 1페이지 인포그래픽 형태로 정리합니다. 회의 후 공유용 요약자료로도 활용할 수 있습니다.</p>
        <TextArea value={infographicPrompt} onChange={(value) => update({ studioInfographicPrompt: value })} />
        <button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={() => copyText(infographicPrompt, '인포그래픽 제작 요청문')}>인포그래픽 요청문 복사</button>
        <TextArea value={response.studioInfographicDraft} onChange={(value) => update({ studioInfographicDraft: value })} placeholder="NotebookLM Studio에서 생성한 인포그래픽 초안을 붙여넣고 수정하세요." />
      </SectionCard>

      <SectionCard title="9단계: 전략회의 발표 준비">
        <label className="block space-y-1"><FieldLabel>발표 메모</FieldLabel><TextArea value={response.strategyMeetingMemo} onChange={(value) => update({ strategyMeetingMemo: value })} placeholder="전략회의에서 팀장이 설명할 핵심 발언을 작성하세요." /></label>
        <label className="block space-y-1"><FieldLabel>예상 질문과 답변 관점</FieldLabel><TextArea value={response.expectedQuestions} onChange={(value) => update({ expectedQuestions: value })} placeholder="상사, 본사, 팀원 관점에서 나올 질문과 답변 방향을 작성하세요." /></label>
        <label className="block space-y-1"><FieldLabel>주의해야 할 표현</FieldLabel><TextArea value={response.complianceCaution} onChange={(value) => update({ complianceCaution: value })} placeholder="발표자료에서 제거하거나 완화해야 할 표현을 작성하세요." /></label>
      </SectionCard>

      <SectionCard title="최종 점검과 산출물">
        <div className="grid gap-2 md:grid-cols-2">
          {REVIEW_ITEMS.map((item) => <label key={item} className="flex items-start gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" className="mt-1" checked={Boolean(response.reviewChecks?.[item])} onChange={(event) => update({ reviewChecks: { ...response.reviewChecks, [item]: event.target.checked } })} /><span>{item}</span></label>)}
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">점검 완료: {checkedCount} / {REVIEW_ITEMS.length}</div>
        <pre className="whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{outputText}</pre>
        <p className="text-xs text-slate-500">자동 저장 키: {V36_STORAGE_KEYS.researchStrategy} / 마지막 저장: {response.savedAt || '아직 입력 전'}</p>
      </SectionCard>
    </div>
  );
}

export default ResearchStrategyLab;
