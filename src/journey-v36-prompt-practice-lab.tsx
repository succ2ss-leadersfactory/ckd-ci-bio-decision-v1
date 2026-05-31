import { useMemo, useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';
import { V36_STORAGE_KEYS } from './journey-v36-preview-config';

type PromptCase = {
  id: string;
  title: string;
  badPrompt: string;
  problem: string;
  improved: string;
};

type PromptPracticeResponse = {
  selectedCaseId: string;
  selectedProblems: string[];
  selectedConditions: string[];
  contextInput: string;
  finalPrompt: string;
  copiedPrompt: string;
  reviewChecks: Record<string, boolean>;
  savedAt: string;
};

const PROMPT_CASES: PromptCase[] = [
  {
    id: 'research',
    title: '전략 리서치 질문',
    badPrompt: '요즘 제약영업 트렌드 알려줘.',
    problem: '범위가 넓고 출처·최근성·활용 목적이 빠져 있다.',
    improved: '제약영업팀장 관점에서 최근 1년 내 공개 자료를 기준으로 의료진 정보 탐색 방식 변화 3가지를 정리하고, 각 변화가 영업팀 실행 방식에 주는 시사점과 추가 확인 질문을 제안해줘.',
  },
  {
    id: 'dashboard',
    title: 'Dashboard 분석 질문',
    badPrompt: '이 팀원 왜 성과가 낮은지 분석해줘.',
    problem: '근거 지표와 가설 검증 방식이 없어 사람 탓 분석으로 흐를 수 있다.',
    improved: '아래 지표를 선행변수, 과정변수, 결과변수로 구분해 분석하고, 이 해석이 틀렸을 가능성과 팀장이 확인해야 할 질문을 제안해줘.',
  },
  {
    id: 'callplan',
    title: '콜플랜 질문',
    badPrompt: '고객을 설득할 콜 스크립트를 만들어줘.',
    problem: '고객 압박·효과 단정·미승인 표현 위험이 있다.',
    improved: '고객을 설득하는 표현 대신, 고객의 정보 니즈와 후속 확인사항을 파악하는 중립적 콜 질문과 콜 후 24시간 내 후속조치 기준을 만들어줘.',
  },
  {
    id: 'coaching',
    title: '1on1 코칭 질문',
    badPrompt: '실적 낮은 팀원을 압박하는 면담 스크립트 만들어줘.',
    problem: '평가 낙인과 압박 표현이 강해 방어적 대화로 흐를 수 있다.',
    improved: '실적이 낮은 팀원과 최근 실행 데이터를 함께 보며 원인 가설을 확인하고, 2주 동안 실험할 행동을 합의하는 1on1 질문을 만들어줘.',
  },
];

const PROBLEMS = [
  '목적이 불명확하다',
  '맥락과 데이터가 부족하다',
  '출처·최근성 기준이 없다',
  '민감정보 입력 위험이 있다',
  '효과 단정·고객 압박 표현 위험이 있다',
  '출력 형식이 없다',
  '리더의 최종 판단 기준이 없다',
];

const CONDITIONS = [
  '역할을 지정한다',
  '맥락과 목적을 설명한다',
  '사용 가능한 데이터만 제공한다',
  '민감정보를 제외한다',
  '출처·최근성 확인을 요구한다',
  '위험 표현을 점검하게 한다',
  '출력 형식을 지정한다',
  '현장형 수정 기준을 포함한다',
];

const REVIEW_ITEMS = [
  '나쁜 질문의 문제를 진단했는가?',
  '안전한 질문 조건을 선택했는가?',
  '민감정보와 위험 표현을 제거했는가?',
  '출력 형식을 지정했는가?',
  '복사 가능한 최종 질문을 만들었는가?',
];

const DEFAULT_RESPONSE: PromptPracticeResponse = {
  selectedCaseId: 'research',
  selectedProblems: [],
  selectedConditions: [],
  contextInput: '',
  finalPrompt: '',
  copiedPrompt: '',
  reviewChecks: {},
  savedAt: '',
};

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-2xl border bg-white p-5 shadow-sm"><h3 className="text-lg font-bold text-slate-900">{title}</h3><div className="mt-4 space-y-4">{children}</div></section>;
}

function FieldLabel({ children }: { children: string }) {
  return <span className="text-xs font-bold text-slate-500">{children}</span>;
}

function toggle(items: string[], item: string) {
  return items.includes(item) ? items.filter((value) => value !== item) : [...items, item];
}

function getCase(id: string) {
  return PROMPT_CASES.find((item) => item.id === id) ?? PROMPT_CASES[0];
}

function buildFinalPrompt(promptCase: PromptCase, response: PromptPracticeResponse) {
  return `역할: 제약영업팀장의 AI 활용을 돕는 실무 파트너\n\n맥락: ${response.contextInput || 'C1바이오 영업2본부 수도권중부영업팀장이 현장 실행 판단을 정리하고 있습니다.'}\n\n질문 목적: ${promptCase.title}\n\n요청:\n${promptCase.improved}\n\n작성 조건:\n- 실제 고객명, 병원명, 의사명, 제품명, 내부 매출·처방 수치, 개인정보는 사용하지 마세요.\n- 효과 단정, 고객 압박, 경쟁사 비방, 미승인 표현은 제외하세요.\n- 근거가 약한 내용은 추정이라고 표시하세요.\n- 현장 팀장이 바로 검토하고 수정할 수 있는 문장으로 작성하세요.\n\n출력 형식:\n1. 핵심 요약\n2. 판단 기준\n3. 실행 제안\n4. 확인 질문\n5. 주의해야 할 표현`;
}

export function PromptPracticeLab() {
  const [storedResponse, setResponse] = useStored<PromptPracticeResponse>(V36_STORAGE_KEYS.promptPractice, DEFAULT_RESPONSE);
  const response = {
    ...DEFAULT_RESPONSE,
    ...storedResponse,
    selectedProblems: storedResponse.selectedProblems ?? [],
    selectedConditions: storedResponse.selectedConditions ?? [],
    reviewChecks: storedResponse.reviewChecks ?? {},
  };
  const [copyMessage, setCopyMessage] = useState('');
  const currentCase = getCase(response.selectedCaseId);
  const generatedPrompt = useMemo(() => response.finalPrompt || buildFinalPrompt(currentCase, response), [currentCase, response]);
  const checkedCount = REVIEW_ITEMS.filter((item) => response.reviewChecks[item]).length;

  const update = (patch: Partial<PromptPracticeResponse>) => {
    setResponse({ ...response, ...patch, savedAt: new Date().toISOString() });
  };

  const generatePrompt = () => {
    update({ finalPrompt: buildFinalPrompt(currentCase, response) });
    setCopyMessage('최종 질문 초안을 생성했습니다. 필요한 부분만 수정하세요.');
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      update({ copiedPrompt: generatedPrompt });
      setCopyMessage('최종 질문을 복사했습니다.');
    } catch {
      setCopyMessage('복사가 차단되었습니다. 내용을 직접 선택해 복사하세요.');
    }
  };

  const outputText = `[좋은 질문 만들기 결과]\n\n[선택 사례]\n${currentCase.title}\n\n[진단한 문제]\n${response.selectedProblems.join(', ') || '-'}\n\n[선택한 좋은 질문 조건]\n${response.selectedConditions.join(', ') || '-'}\n\n[최종 질문]\n${generatedPrompt}`;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
        <p className="font-bold">좋은 질문 만들기 Lab</p>
        <p className="mt-1">나쁜 질문을 안전하고 구체적인 질문으로 바꿉니다. 이후 모든 Lab에서 사용할 질문 습관을 만드는 짧은 실습입니다.</p>
      </div>

      <SectionCard title="1단계: 나쁜 질문 선택">
        <label className="block space-y-1"><FieldLabel>연습할 질문 사례</FieldLabel><select className="w-full rounded-xl border px-3 py-2" value={response.selectedCaseId} onChange={(event) => update({ selectedCaseId: event.target.value, finalPrompt: '' })}>{PROMPT_CASES.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-900"><p className="font-bold">나쁜 질문</p><p className="mt-2">{currentCase.badPrompt}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700"><p className="font-bold text-slate-900">문제점 힌트</p><p className="mt-2">{currentCase.problem}</p></div>
      </SectionCard>

      <SectionCard title="2단계: 질문의 문제 진단">
        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">복수 선택 가능 · 이 질문이 왜 위험하거나 약한지 선택하세요.</div>
        <div className="grid gap-2 md:grid-cols-2">{PROBLEMS.map((item) => <label key={item} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={response.selectedProblems.includes(item)} onChange={() => update({ selectedProblems: toggle(response.selectedProblems, item) })} />{item}</label>)}</div>
      </SectionCard>

      <SectionCard title="3단계: 좋은 질문 조건 선택">
        <div className="rounded-xl bg-cyan-50 p-3 text-sm text-cyan-900">복수 선택 가능 · 좋은 질문은 역할, 맥락, 데이터, 안전선, 출력 형식이 함께 있어야 합니다.</div>
        <div className="grid gap-2 md:grid-cols-2">{CONDITIONS.map((item) => <label key={item} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={response.selectedConditions.includes(item)} onChange={() => update({ selectedConditions: toggle(response.selectedConditions, item) })} />{item}</label>)}</div>
        <label className="block space-y-1"><FieldLabel>추가 맥락 입력</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.contextInput} onChange={(event) => update({ contextInput: event.target.value, finalPrompt: '' })} placeholder="예: 팀원 Dashboard 분석에서 선행변수와 과정변수를 구분해 원인 가설을 점검하려고 한다." /></label>
      </SectionCard>

      <SectionCard title="4단계: 최종 질문 생성과 복사">
        <div className="flex flex-wrap gap-2"><button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white" onClick={generatePrompt}>최종 질문 생성</button><button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={copyPrompt}>최종 질문 복사</button></div>
        {copyMessage ? <p className="text-sm font-semibold text-cyan-700">{copyMessage}</p> : null}
        <textarea className="min-h-72 w-full rounded-xl border px-3 py-2 font-mono text-xs" value={generatedPrompt} onChange={(event) => update({ finalPrompt: event.target.value })} />
      </SectionCard>

      <SectionCard title="최종 점검과 산출물">
        <div className="grid gap-2 md:grid-cols-2">{REVIEW_ITEMS.map((item) => <label key={item} className="flex items-start gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" className="mt-1" checked={Boolean(response.reviewChecks[item])} onChange={(event) => update({ reviewChecks: { ...response.reviewChecks, [item]: event.target.checked } })} /><span>{item}</span></label>)}</div>
        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">점검 완료: {checkedCount} / {REVIEW_ITEMS.length}</div>
        <pre className="whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{outputText}</pre>
        <p className="text-xs text-slate-500">자동 저장 키: {V36_STORAGE_KEYS.promptPractice} / 마지막 저장: {response.savedAt || '아직 입력 전'}</p>
      </SectionCard>
    </div>
  );
}

export default PromptPracticeLab;
