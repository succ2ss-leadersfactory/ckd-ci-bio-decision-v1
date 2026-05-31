import { useMemo, useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';
import { V36_STORAGE_KEYS } from './journey-v36-preview-config';

type ResearchResponse = {
  selectedTheme: string;
  leaderQuestion: string;
  perplexityAnswer: string;
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
  strategyMeetingMemo: string;
  expectedQuestions: string;
  complianceCaution: string;
  reviewChecks: Record<string, boolean>;
  savedAt: string;
};

const THEMES = [
  '의료진 정보 탐색 방식 변화',
  '병원·의원 방문 환경 변화',
  '제약영업 컴플라이언스 기준 강화',
  '디지털 채널과 대면 영업의 역할 재조정',
];

const REVIEW_ITEMS = [
  'Perplexity 결과에 출처와 최근성 단서가 있는가?',
  'NotebookLM에 넣을 소스 묶음이 명확한가?',
  'NotebookLM 결과가 소스 기반 종합으로 정리되었는가?',
  'NotebookLM Studio 보고서 산출물 목적이 명확한가?',
  '전략회의 발표 슬라이드 흐름이 잡혀 있는가?',
  '전략 이슈 3개가 팀 실행과 연결되어 있는가?',
  '전략회의 예상 질문과 답변 관점이 정리되어 있는가?',
  '민감정보나 단정적 표현을 제거했는가?',
];

const DEFAULT_RESPONSE: ResearchResponse = {
  selectedTheme: THEMES[0],
  leaderQuestion: '',
  perplexityAnswer: '',
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
  return <textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />;
}

function buildPerplexityPrompt(response: ResearchResponse) {
  return `Perplexity 리서치 질문

역할: 제약영업 팀장의 외부 환경 리서치 파트너
주제: ${response.selectedTheme}
팀장 질문: ${response.leaderQuestion || '최근 제약영업 환경 변화가 영업팀 실행 방식에 어떤 영향을 주는지 조사해줘.'}

요청:
1. 최근 변화 신호를 5개 이내로 정리해줘.
2. 각 신호마다 확인 가능한 출처 또는 출처 유형을 함께 제시해줘.
3. 제약영업팀장 관점에서 의미 있는 전략 이슈 후보를 제안해줘.
4. 확인이 더 필요한 내용은 추정이라고 표시해줘.
5. 실제 고객명, 기관명, 제품명, 내부 수치, 민감정보는 사용하지 말아줘.

출력 형식:
- 변화 신호
- 근거/출처
- 신뢰도 주의점
- 전략 이슈 후보
- 추가 확인 질문`;
}

function buildNotebookPrompt(response: ResearchResponse) {
  return `NotebookLM 소스 기반 종합 질문

전제: Perplexity에서 확인한 기사, 공개 보고서, 자료를 NotebookLM 소스로 넣은 뒤 사용합니다.

주제: ${response.selectedTheme}
팀장 질문: ${response.leaderQuestion || '소스 자료를 근거로 제약영업팀 실행에 중요한 전략 이슈를 정리해줘.'}

요청:
1. 업로드한 소스에 근거한 핵심 변화만 정리해줘.
2. 소스 간 공통 신호와 서로 다른 주장을 구분해줘.
3. 영업팀장 관점에서 전략 이슈 3개로 압축해줘.
4. 우리 팀 실행에 미치는 영향을 설명해줘.
5. 추가 확인 질문과 실행전략으로 바꿀 질문을 제시해줘.
6. 주의해야 할 표현을 정리해줘.

출력 형식:
- 소스 기반 핵심 변화
- 전략 이슈 3개
- 우리 팀에 미치는 영향
- 추가 확인 질문
- 실행전략 질문
- 주의 표현`;
}

function buildStudioReportPrompt(response: ResearchResponse) {
  return `NotebookLM Studio 보고서 제작 요청

목적: 전략회의에서 발표할 1~2페이지 보고서 초안을 만든다.
주제: ${response.selectedTheme}
전략 이슈:
1. ${response.issueOne || '전략 이슈 1'}
2. ${response.issueTwo || '전략 이슈 2'}
3. ${response.issueThree || '전략 이슈 3'}
우리 팀 영향: ${response.teamImpact || '우리 팀에 미치는 영향'}

요청:
1. 회의 참석자가 빠르게 이해할 수 있는 보고서 제목을 제안해줘.
2. 배경, 근거, 전략 이슈, 팀 영향, 제안 방향 순서로 구성해줘.
3. 소스 기반 내용과 팀장 판단을 구분해줘.
4. 확인이 더 필요한 내용은 별도 표시해줘.
5. 민감정보나 단정적 표현은 제외해줘.

출력 형식:
- 보고서 제목
- 핵심 메시지 3줄
- 근거 요약
- 전략 이슈 3개
- 우리 팀 실행 제안
- 추가 확인 필요사항`;
}

function buildStudioSlidePrompt(response: ResearchResponse) {
  return `NotebookLM Studio 발표 슬라이드 제작 요청

목적: 전략회의에서 5~7분 발표할 슬라이드 초안을 만든다.
보고서 핵심 내용: ${response.studioReportDraft || 'NotebookLM Studio 보고서 초안 내용을 반영'}

요청:
1. 5~6장 분량의 발표 슬라이드 구성안을 만들어줘.
2. 각 장마다 제목, 핵심 메시지, 넣을 근거, 발표자 메모를 작성해줘.
3. 전략 이슈 3개와 팀 실행 제안이 자연스럽게 연결되게 해줘.
4. 마지막 장에는 회의에서 논의할 질문 2~3개를 넣어줘.
5. 민감정보나 단정적 표현은 제외해줘.

출력 형식:
- Slide 1: 문제 제기
- Slide 2: 외부 변화 신호
- Slide 3: 전략 이슈 3개
- Slide 4: 우리 팀 영향
- Slide 5: 실행 제안
- Slide 6: 회의 질문`;
}

export function ResearchStrategyLab() {
  const [response, setResponse] = useStored<ResearchResponse>(V36_STORAGE_KEYS.researchStrategy, DEFAULT_RESPONSE);
  const [copyMessage, setCopyMessage] = useState('');
  const perplexityPrompt = useMemo(() => buildPerplexityPrompt(response), [response]);
  const notebookPrompt = useMemo(() => buildNotebookPrompt(response), [response]);
  const reportPrompt = useMemo(() => response.studioReportPrompt || buildStudioReportPrompt(response), [response]);
  const slidePrompt = useMemo(() => response.studioSlidePrompt || buildStudioSlidePrompt(response), [response]);
  const checkedCount = REVIEW_ITEMS.filter((item) => response.reviewChecks[item]).length;

  const update = (patch: Partial<ResearchResponse>) => {
    setResponse({ ...response, ...patch, savedAt: new Date().toISOString() });
  };

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage(`${label} 내용을 복사했습니다.`);
    } catch {
      setCopyMessage('복사가 차단되었습니다. 내용을 직접 선택해 복사하세요.');
    }
  };

  const outputText = `전략회의 산출물\n\n[주제]\n${response.selectedTheme}\n\n[전략 이슈 1]\n${response.issueOne}\n\n[전략 이슈 2]\n${response.issueTwo}\n\n[전략 이슈 3]\n${response.issueThree}\n\n[보고서 초안]\n${response.studioReportDraft}\n\n[슬라이드 구성안]\n${response.studioSlideOutline}\n\n[발표 메모]\n${response.strategyMeetingMemo}\n\n[예상 질문]\n${response.expectedQuestions}\n\n[주의 표현]\n${response.complianceCaution}`;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
        <p className="font-bold">Perplexity + NotebookLM Studio 전략회의 Lab</p>
        <p className="mt-1">최종 산출물은 전략회의에 사용할 보고서 초안과 발표 슬라이드 구성안입니다. 조사, 소스 종합, 보고서·슬라이드 제작, 발표 준비를 분리합니다.</p>
      </div>

      <SectionCard title="1단계: Perplexity 최신 자료 탐색">
        <label className="block space-y-1">
          <FieldLabel>리서치 주제</FieldLabel>
          <select className="w-full rounded-xl border px-3 py-2" value={response.selectedTheme} onChange={(event) => update({ selectedTheme: event.target.value })}>
            {THEMES.map((theme) => <option key={theme} value={theme}>{theme}</option>)}
          </select>
        </label>
        <label className="block space-y-1"><FieldLabel>팀장 질문</FieldLabel><TextArea value={response.leaderQuestion} onChange={(value) => update({ leaderQuestion: value })} placeholder="전략회의에서 다룰 외부 환경 질문을 작성하세요." /></label>
        <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm text-slate-600">Perplexity에 복사해 최신 자료와 출처를 탐색합니다.</p><button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={() => copyText(perplexityPrompt, 'Perplexity 프롬프트')}>Perplexity 프롬프트 복사</button></div>
        {copyMessage ? <p className="text-sm font-semibold text-cyan-700">{copyMessage}</p> : null}
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{perplexityPrompt}</pre>
      </SectionCard>

      <SectionCard title="2단계: Perplexity 결과와 NotebookLM 소스 묶음 정리">
        <TextArea value={response.perplexityAnswer} onChange={(value) => update({ perplexityAnswer: value })} placeholder="Perplexity 답변, 출처, 최근성 단서를 붙여넣으세요." />
        <TextArea value={response.sourcePackMemo} onChange={(value) => update({ sourcePackMemo: value })} placeholder="NotebookLM에 넣을 소스 묶음을 정리하세요. 예: 기사, 보고서, 공개자료 등" />
      </SectionCard>

      <SectionCard title="3단계: NotebookLM 소스 기반 종합">
        <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm text-slate-600">소스를 NotebookLM에 넣은 뒤 아래 질문을 사용합니다.</p><button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={() => copyText(notebookPrompt, 'NotebookLM 프롬프트')}>NotebookLM 프롬프트 복사</button></div>
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{notebookPrompt}</pre>
        <TextArea value={response.notebookLmAnswer} onChange={(value) => update({ notebookLmAnswer: value })} placeholder="NotebookLM의 소스 기반 종합 결과를 붙여넣으세요." />
      </SectionCard>

      <SectionCard title="4단계: Source Check와 전략 이슈 3개">
        <label className="block space-y-1"><FieldLabel>소스 신뢰도와 충돌 메모</FieldLabel><TextArea value={response.sourceReliabilityMemo} onChange={(value) => update({ sourceReliabilityMemo: value })} placeholder="출처가 약한 내용, 최근성 확인이 필요한 내용, 충돌하는 내용을 적으세요." /></label>
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
        <p className="text-sm text-slate-600">NotebookLM Studio에서 보고서 형식 산출물을 만들 때 사용할 요청문입니다. 필요하면 수정한 뒤 복사합니다.</p>
        <TextArea value={reportPrompt} onChange={(value) => update({ studioReportPrompt: value })} />
        <button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={() => copyText(reportPrompt, '보고서 제작 요청문')}>보고서 요청문 복사</button>
        <TextArea value={response.studioReportDraft} onChange={(value) => update({ studioReportDraft: value })} placeholder="NotebookLM Studio에서 생성한 전략회의 보고서 초안을 붙여넣고 팀장 관점으로 수정하세요." />
      </SectionCard>

      <SectionCard title="7단계: NotebookLM Studio 발표 슬라이드 제작">
        <p className="text-sm text-slate-600">보고서 초안을 바탕으로 전략회의 발표 슬라이드 구성을 만듭니다.</p>
        <TextArea value={slidePrompt} onChange={(value) => update({ studioSlidePrompt: value })} />
        <button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={() => copyText(slidePrompt, '슬라이드 제작 요청문')}>슬라이드 요청문 복사</button>
        <TextArea value={response.studioSlideOutline} onChange={(value) => update({ studioSlideOutline: value })} placeholder="NotebookLM Studio에서 생성한 발표 슬라이드 구성안을 붙여넣고 수정하세요." />
      </SectionCard>

      <SectionCard title="8단계: 전략회의 발표 준비">
        <label className="block space-y-1"><FieldLabel>발표 메모</FieldLabel><TextArea value={response.strategyMeetingMemo} onChange={(value) => update({ strategyMeetingMemo: value })} placeholder="전략회의에서 팀장이 설명할 핵심 발언을 작성하세요." /></label>
        <label className="block space-y-1"><FieldLabel>예상 질문과 답변 관점</FieldLabel><TextArea value={response.expectedQuestions} onChange={(value) => update({ expectedQuestions: value })} placeholder="상사, 본사, 팀원 관점에서 나올 질문과 답변 방향을 작성하세요." /></label>
        <label className="block space-y-1"><FieldLabel>주의해야 할 표현</FieldLabel><TextArea value={response.complianceCaution} onChange={(value) => update({ complianceCaution: value })} placeholder="발표자료에서 제거하거나 완화해야 할 표현을 작성하세요." /></label>
      </SectionCard>

      <SectionCard title="최종 점검과 산출물">
        <div className="grid gap-2 md:grid-cols-2">
          {REVIEW_ITEMS.map((item) => <label key={item} className="flex items-start gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" className="mt-1" checked={Boolean(response.reviewChecks[item])} onChange={(event) => update({ reviewChecks: { ...response.reviewChecks, [item]: event.target.checked } })} /><span>{item}</span></label>)}
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">점검 완료: {checkedCount} / {REVIEW_ITEMS.length}</div>
        <pre className="whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{outputText}</pre>
        <p className="text-xs text-slate-500">자동 저장 키: {V36_STORAGE_KEYS.researchStrategy} / 마지막 저장: {response.savedAt || '아직 입력 전'}</p>
      </SectionCard>
    </div>
  );
}

export default ResearchStrategyLab;
