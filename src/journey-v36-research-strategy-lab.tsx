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
  'NotebookLM 결과가 소스 기반 요약으로 정리되었는가?',
  '두 도구의 결과가 서로 충돌하는 지점을 표시했는가?',
  '전략 이슈가 3개로 압축되어 있는가?',
  '우리 팀 실행과 연결된 영향이 작성되어 있는가?',
  '추가 확인 질문과 실행전략 번역 질문이 있는가?',
  '주의해야 할 표현이나 안전선이 포함되어 있는가?',
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

function buildPerplexityPrompt(response: ResearchResponse) {
  return `Perplexity에서 사용할 리서치 질문입니다.

역할: 제약영업 팀장의 외부 환경 리서치 파트너
주제: ${response.selectedTheme}
팀장 질문: ${response.leaderQuestion || '최근 제약영업 환경 변화가 영업팀 실행 방식에 어떤 영향을 주는지 조사해줘.'}

요청:
1. 최근 변화 신호를 5개 이내로 정리해줘.
2. 각 신호마다 확인 가능한 출처 또는 출처 유형을 함께 제시해줘.
3. 제약영업팀장 관점에서 의미 있는 전략 이슈 후보를 제안해줘.
4. 확인이 더 필요한 내용은 추정이라고 표시해줘.
5. 실제 고객명, 병원명, 제품명, 내부 수치, 민감정보는 사용하지 말아줘.

출력 형식:
- 변화 신호
- 근거/출처
- 신뢰도 주의점
- 팀장 관점의 전략 이슈 후보
- 추가 확인 질문`;
}

function buildNotebookPrompt(response: ResearchResponse) {
  return `NotebookLM에서 사용할 소스 기반 종합 질문입니다.

전제: Perplexity에서 확인한 자료, 기사, 보고서, 공개 자료를 NotebookLM 소스로 넣은 뒤 사용합니다.

주제: ${response.selectedTheme}
팀장 질문: ${response.leaderQuestion || '소스 자료를 근거로 제약영업팀 실행에 중요한 전략 이슈를 정리해줘.'}

요청:
1. 업로드한 소스에 근거한 핵심 변화만 정리해줘.
2. 소스 간 공통적으로 반복되는 신호와 서로 다른 주장을 구분해줘.
3. 영업팀장 관점에서 전략 이슈 3개로 압축해줘.
4. 우리 팀 실행에 미치는 영향을 설명해줘.
5. 추가로 확인해야 할 질문을 제시해줘.
6. 컴플라이언스상 주의해야 할 표현을 정리해줘.

출력 형식:
- 소스 기반 핵심 변화
- 전략 이슈 3개
- 우리 팀에 미치는 영향
- 추가 확인 질문
- 실행전략으로 바꿀 질문
- 주의 표현`;
}

export function ResearchStrategyLab() {
  const [response, setResponse] = useStored<ResearchResponse>(V36_STORAGE_KEYS.researchStrategy, DEFAULT_RESPONSE);
  const [copyMessage, setCopyMessage] = useState('');
  const perplexityPrompt = useMemo(() => buildPerplexityPrompt(response), [response]);
  const notebookPrompt = useMemo(() => buildNotebookPrompt(response), [response]);
  const checkedCount = REVIEW_ITEMS.filter((item) => response.reviewChecks[item]).length;

  const update = (patch: Partial<ResearchResponse>) => {
    setResponse({ ...response, ...patch, savedAt: new Date().toISOString() });
  };

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage(`${label} 프롬프트를 복사했습니다.`);
    } catch {
      setCopyMessage('복사가 차단되었습니다. 프롬프트 영역을 직접 선택해 복사하세요.');
    }
  };

  const outputText = `Perplexity + NotebookLM 전략 Lab\n\n[주제]\n${response.selectedTheme}\n\n[전략 이슈 1]\n${response.issueOne}\n\n[전략 이슈 2]\n${response.issueTwo}\n\n[전략 이슈 3]\n${response.issueThree}\n\n[소스 신뢰도 메모]\n${response.sourceReliabilityMemo}\n\n[우리 팀에 미치는 영향]\n${response.teamImpact}\n\n[추가 확인 질문]\n${response.nextQuestions}\n\n[실행전략 번역 질문]\n${response.executionTranslation}\n\n[주의 표현]\n${response.complianceCaution}`;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
        <p className="font-bold">Perplexity + NotebookLM 전략 Lab 목표</p>
        <p className="mt-1">Perplexity로 최신 외부 자료를 찾고, NotebookLM으로 소스 기반 종합을 한 뒤, 팀장의 실행전략으로 번역합니다.</p>
      </div>

      <SectionCard title="상황 제시: 외부 변화에서 전략 이슈 찾기">
        <p className="text-sm leading-6 text-slate-700">영업팀장은 팀원 데이터를 보기 전에 외부 환경의 변화를 먼저 읽어야 합니다. 이 Lab은 조사, 소스 검토, 전략 번역을 분리해 AI 결과를 그대로 믿지 않도록 설계합니다.</p>
      </SectionCard>

      <SectionCard title="1단계: Perplexity 리서치 질문 만들기">
        <label className="block space-y-1">
          <FieldLabel>리서치 주제</FieldLabel>
          <select className="w-full rounded-xl border px-3 py-2" value={response.selectedTheme} onChange={(event) => update({ selectedTheme: event.target.value })}>
            {THEMES.map((theme) => <option key={theme} value={theme}>{theme}</option>)}
          </select>
        </label>
        <label className="block space-y-1"><FieldLabel>팀장 질문</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.leaderQuestion} onChange={(event) => update({ leaderQuestion: event.target.value })} placeholder="최근 외부 환경 변화가 우리 영업팀 실행에 어떤 영향을 주는지 질문으로 작성하세요." /></label>
        <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm text-slate-600">아래 프롬프트를 Perplexity에 복사합니다.</p><button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={() => copyText(perplexityPrompt, 'Perplexity')}>Perplexity 프롬프트 복사</button></div>
        {copyMessage ? <p className="text-sm font-semibold text-cyan-700">{copyMessage}</p> : null}
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{perplexityPrompt}</pre>
      </SectionCard>

      <SectionCard title="2단계: Perplexity 결과와 소스 후보 정리">
        <textarea className="min-h-40 w-full rounded-xl border px-3 py-2" value={response.perplexityAnswer} onChange={(event) => update({ perplexityAnswer: event.target.value })} placeholder="Perplexity 답변을 붙여넣으세요. 출처 링크, 출처 유형, 최근성 단서를 함께 남깁니다." />
        <textarea className="min-h-28 w-full rounded-xl border px-3 py-2" value={response.sourcePackMemo} onChange={(event) => update({ sourcePackMemo: event.target.value })} placeholder="NotebookLM에 넣을 소스 묶음을 정리하세요. 예: 기사 2개, 공개 보고서 1개, 내부 교육자료 1개 등" />
      </SectionCard>

      <SectionCard title="3단계: NotebookLM 소스 기반 종합 질문">
        <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm text-slate-600">Perplexity에서 찾은 소스를 NotebookLM에 넣은 뒤, 아래 질문을 사용합니다.</p><button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={() => copyText(notebookPrompt, 'NotebookLM')}>NotebookLM 프롬프트 복사</button></div>
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{notebookPrompt}</pre>
        <textarea className="min-h-40 w-full rounded-xl border px-3 py-2" value={response.notebookLmAnswer} onChange={(event) => update({ notebookLmAnswer: event.target.value })} placeholder="NotebookLM의 소스 기반 종합 결과를 붙여넣으세요." />
      </SectionCard>

      <SectionCard title="4단계: Source Check와 전략 이슈 도출">
        <label className="block space-y-1"><FieldLabel>소스 신뢰도와 충돌 메모</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.sourceReliabilityMemo} onChange={(event) => update({ sourceReliabilityMemo: event.target.value })} placeholder="Perplexity와 NotebookLM 결과 중 출처가 약한 항목, 최근성 확인이 필요한 항목, 충돌하는 내용을 작성하세요." /></label>
        <label className="block space-y-1"><FieldLabel>전략 이슈 1</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.issueOne} onChange={(event) => update({ issueOne: event.target.value })} /></label>
        <label className="block space-y-1"><FieldLabel>전략 이슈 2</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.issueTwo} onChange={(event) => update({ issueTwo: event.target.value })} /></label>
        <label className="block space-y-1"><FieldLabel>전략 이슈 3</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.issueThree} onChange={(event) => update({ issueThree: event.target.value })} /></label>
      </SectionCard>

      <SectionCard title="5단계: 팀 실행전략으로 번역">
        <label className="block space-y-1"><FieldLabel>우리 팀에 미치는 영향</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.teamImpact} onChange={(event) => update({ teamImpact: event.target.value })} /></label>
        <label className="block space-y-1"><FieldLabel>추가 확인 질문</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.nextQuestions} onChange={(event) => update({ nextQuestions: event.target.value })} /></label>
        <label className="block space-y-1"><FieldLabel>실행전략으로 번역할 질문</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.executionTranslation} onChange={(event) => update({ executionTranslation: event.target.value })} /></label>
        <label className="block space-y-1"><FieldLabel>주의해야 할 표현</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.complianceCaution} onChange={(event) => update({ complianceCaution: event.target.value })} /></label>
      </SectionCard>

      <SectionCard title="Research 품질 점검">
        <div className="grid gap-2 md:grid-cols-2">
          {REVIEW_ITEMS.map((item) => <label key={item} className="flex items-start gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" className="mt-1" checked={Boolean(response.reviewChecks[item])} onChange={(event) => update({ reviewChecks: { ...response.reviewChecks, [item]: event.target.checked } })} /><span>{item}</span></label>)}
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">점검 완료: {checkedCount} / {REVIEW_ITEMS.length}</div>
      </SectionCard>

      <SectionCard title="최종 산출물">
        <pre className="whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{outputText}</pre>
        <p className="text-xs text-slate-500">자동 저장 키: {V36_STORAGE_KEYS.researchStrategy} / 마지막 저장: {response.savedAt || '아직 입력 전'}</p>
      </SectionCard>
    </div>
  );
}

export default ResearchStrategyLab;
