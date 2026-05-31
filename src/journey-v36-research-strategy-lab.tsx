import { useMemo, useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';
import { V36_STORAGE_KEYS } from './journey-v36-preview-config';

type ResearchResponse = {
  selectedTheme: string;
  leaderQuestion: string;
  aiAnswer: string;
  sourceMemo: string;
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
  '출처 또는 확인 경로가 적혀 있는가?',
  '최근성 확인이 필요한 항목을 표시했는가?',
  '시장 변화와 우리 팀 실행이 연결되어 있는가?',
  '전략 이슈가 3개로 압축되어 있는가?',
  '추가 확인 질문이 포함되어 있는가?',
  '실행전략으로 번역할 질문이 있는가?',
  '주의해야 할 표현이나 안전선이 포함되어 있는가?',
];

const DEFAULT_RESPONSE: ResearchResponse = {
  selectedTheme: THEMES[0],
  leaderQuestion: '',
  aiAnswer: '',
  sourceMemo: '',
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

function buildPrompt(response: ResearchResponse) {
  return `너는 제약영업 팀장의 전략 리서치를 돕는 분석 파트너다.

주제: ${response.selectedTheme}
팀장 질문: ${response.leaderQuestion || '제약영업팀장이 외부 환경 변화를 읽고 팀 실행전략으로 바꿀 수 있도록 분석해줘.'}

조건:
1. 단정하지 말고 확인이 필요한 내용은 별도로 표시한다.
2. 출처 유형 또는 확인 경로를 함께 제안한다.
3. 전략 이슈 3개로 압축한다.
4. 각 이슈가 영업팀 실행에 미치는 영향을 설명한다.
5. 추가 확인 질문과 팀 실행전략으로 번역할 질문을 제안한다.
6. 실제 고객명, 병원명, 제품명, 내부 수치, 민감정보는 사용하지 않는다.

출력 형식:
- 전략 이슈 3개
- 출처와 신뢰도 확인 포인트
- 우리 팀에 미치는 영향
- 추가 확인 질문
- 실행전략으로 번역할 질문
- 주의해야 할 표현`;
}

export function ResearchStrategyLab() {
  const [response, setResponse] = useStored<ResearchResponse>(V36_STORAGE_KEYS.researchStrategy, DEFAULT_RESPONSE);
  const [copyMessage, setCopyMessage] = useState('');
  const prompt = useMemo(() => buildPrompt(response), [response]);
  const checkedCount = REVIEW_ITEMS.filter((item) => response.reviewChecks[item]).length;

  const update = (patch: Partial<ResearchResponse>) => {
    setResponse({ ...response, ...patch, savedAt: new Date().toISOString() });
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyMessage('AI Research 프롬프트를 복사했습니다.');
    } catch {
      setCopyMessage('복사가 차단되었습니다. 프롬프트 영역을 직접 선택해 복사하세요.');
    }
  };

  const outputText = `AI Research 전략 Lab\n\n[주제]\n${response.selectedTheme}\n\n[전략 이슈 1]\n${response.issueOne}\n\n[전략 이슈 2]\n${response.issueTwo}\n\n[전략 이슈 3]\n${response.issueThree}\n\n[출처와 확인 메모]\n${response.sourceMemo}\n\n[우리 팀에 미치는 영향]\n${response.teamImpact}\n\n[추가 확인 질문]\n${response.nextQuestions}\n\n[실행전략 번역 질문]\n${response.executionTranslation}\n\n[주의 표현]\n${response.complianceCaution}`;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
        <p className="font-bold">AI Research 전략 Lab 목표</p>
        <p className="mt-1">외부 환경 변화를 단순 조사로 끝내지 않고, 팀장의 고객군 판단과 실행전략으로 번역합니다.</p>
      </div>

      <SectionCard title="상황 제시: 외부 변화에서 전략 이슈 찾기">
        <p className="text-sm leading-6 text-slate-700">영업팀장은 팀원 데이터를 보기 전에 외부 환경의 변화를 먼저 읽어야 합니다. 그래야 팀원 성과를 사람 탓으로만 해석하지 않고, 고객 접점과 시장 변화의 영향까지 함께 볼 수 있습니다.</p>
      </SectionCard>

      <SectionCard title="AI Research 질문 만들기">
        <label className="block space-y-1">
          <FieldLabel>리서치 주제</FieldLabel>
          <select className="w-full rounded-xl border px-3 py-2" value={response.selectedTheme} onChange={(event) => update({ selectedTheme: event.target.value })}>
            {THEMES.map((theme) => <option key={theme} value={theme}>{theme}</option>)}
          </select>
        </label>
        <label className="block space-y-1"><FieldLabel>팀장 질문</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.leaderQuestion} onChange={(event) => update({ leaderQuestion: event.target.value })} placeholder="외부 환경 변화가 우리 영업팀 실행에 어떤 영향을 주는지 질문으로 작성하세요." /></label>
        <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm text-slate-600">아래 프롬프트를 외부 AI에 복사해 사용합니다.</p><button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={copyPrompt}>프롬프트 복사</button></div>
        {copyMessage ? <p className="text-sm font-semibold text-cyan-700">{copyMessage}</p> : null}
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{prompt}</pre>
      </SectionCard>

      <SectionCard title="AI 답변 붙여넣기와 출처 확인">
        <textarea className="min-h-40 w-full rounded-xl border px-3 py-2" value={response.aiAnswer} onChange={(event) => update({ aiAnswer: event.target.value })} placeholder="외부 AI 답변을 붙여넣으세요. 출처, 최근성, 확인 필요 항목을 반드시 다시 점검합니다." />
        <textarea className="min-h-28 w-full rounded-xl border px-3 py-2" value={response.sourceMemo} onChange={(event) => update({ sourceMemo: event.target.value })} placeholder="출처 유형, 확인 경로, 최근성, 신뢰도 메모를 작성하세요." />
      </SectionCard>

      <SectionCard title="전략 이슈 3개 도출">
        <label className="block space-y-1"><FieldLabel>전략 이슈 1</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.issueOne} onChange={(event) => update({ issueOne: event.target.value })} /></label>
        <label className="block space-y-1"><FieldLabel>전략 이슈 2</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.issueTwo} onChange={(event) => update({ issueTwo: event.target.value })} /></label>
        <label className="block space-y-1"><FieldLabel>전략 이슈 3</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.issueThree} onChange={(event) => update({ issueThree: event.target.value })} /></label>
      </SectionCard>

      <SectionCard title="팀 실행전략으로 번역">
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
