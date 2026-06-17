import { useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';
import { V36_STORAGE_KEYS } from './journey-v36-preview-config';

type SafetyCase = {
  id: string;
  title: string;
  riskyPrompt: string;
  riskType: string;
  safeRewrite: string;
};

type AiSafetyResponse = {
  selectedRiskTypes: string[];
  selectedCases: string[];
  rewrittenPrompts: Record<string, string>;
  personalRules: string;
  finalDeclaration: string;
  reviewChecks: Record<string, boolean>;
  savedAt: string;
};

const RISK_TYPES = [
  '실제 고객명·병원명·의사명 입력',
  '제품명·내부 전략·매출·처방 수치 입력',
  '개인정보·민감정보 입력',
  '미승인 효능·허가 외 사용 암시',
  '효과 단정·경쟁사 비방 표현',
  '고객 압박·처방 유도 표현',
];

const SAFETY_CASES: SafetyCase[] = [
  {
    id: 'case-1',
    title: '고객명과 병원명이 들어간 질문',
    riskyPrompt: 'OO병원 김OO 교수님이 최근 반응이 낮은데, 어떻게 설득하면 처방을 늘릴 수 있을까?',
    riskType: '실제 고객명·병원명·의사명 입력 / 고객 압박 표현',
    safeRewrite: '특정 고객명과 기관명을 제외하고, 반응이 낮아진 고객군과의 다음 대화에서 정보 니즈를 확인하는 질문을 설계해줘.',
  },
  {
    id: 'case-2',
    title: '내부 수치와 전략이 들어간 질문',
    riskyPrompt: '이번 달 내부 목표 대비 A제품 처방이 부족한 병원 리스트를 기준으로 압박 메시지를 만들어줘.',
    riskType: '제품명·내부 수치 입력 / 고객 압박 표현',
    safeRewrite: '내부 수치와 제품명을 제외하고, 고객군별 후속조치 우선순위를 정하는 일반적인 기준을 만들어줘.',
  },
  {
    id: 'case-3',
    title: '효과 단정 표현이 들어간 질문',
    riskyPrompt: '경쟁 제품보다 우리 제품이 확실히 우월하다는 메시지를 의료진에게 전달할 문장을 만들어줘.',
    riskType: '효과 단정·경쟁사 비방 표현',
    safeRewrite: '경쟁사 비교나 효과 단정 없이, 공식 자료 범위 안에서 의료진의 정보 니즈를 확인하는 중립적 대화 문장을 만들어줘.',
  },
  {
    id: 'case-4',
    title: '팀원 평가로 오해될 수 있는 질문',
    riskyPrompt: '실적이 낮은 김OO 대리를 압박해서 활동량을 늘리게 하는 면담 스크립트를 만들어줘.',
    riskType: '개인정보·민감정보 입력 / 부적절한 압박 표현',
    safeRewrite: '실명과 평가 표현을 제외하고, 활동 데이터가 낮은 팀원과 원인을 공동 진단하는 면담 질문을 만들어줘.',
  },
];

const REVIEW_ITEMS = [
  '입력 금지 정보를 확인했는가?',
  '위험 질문 사례를 안전한 질문으로 바꾸었는가?',
  '효과 단정·고객 압박 표현을 제거했는가?',
  '나의 AI 사용 원칙을 작성했는가?',
  '최종 선언문을 작성했는가?',
];

const DEFAULT_RESPONSE: AiSafetyResponse = {
  selectedRiskTypes: [],
  selectedCases: [],
  rewrittenPrompts: {},
  personalRules: '',
  finalDeclaration: '',
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

export function AiSafetyLab() {
  const [storedResponse, setResponse] = useStored<AiSafetyResponse>(V36_STORAGE_KEYS.aiSafety, DEFAULT_RESPONSE);
  const response = {
    ...DEFAULT_RESPONSE,
    ...storedResponse,
    selectedRiskTypes: storedResponse.selectedRiskTypes ?? [],
    selectedCases: storedResponse.selectedCases ?? [],
    rewrittenPrompts: storedResponse.rewrittenPrompts ?? {},
    reviewChecks: storedResponse.reviewChecks ?? {},
  };
  const [copyMessage, setCopyMessage] = useState('');
  const checkedCount = REVIEW_ITEMS.filter((item) => response.reviewChecks[item]).length;

  const update = (patch: Partial<AiSafetyResponse>) => {
    setResponse({ ...response, ...patch, savedAt: new Date().toISOString() });
  };

  const applySafeRewrite = (caseItem: SafetyCase) => {
    update({
      selectedCases: response.selectedCases.includes(caseItem.id) ? response.selectedCases : [...response.selectedCases, caseItem.id],
      rewrittenPrompts: { ...response.rewrittenPrompts, [caseItem.id]: caseItem.safeRewrite },
    });
    setCopyMessage(`${caseItem.title}의 안전한 질문 예시를 반영했습니다.`);
  };

  const makeDeclaration = () => {
    const declaration = `나는 AI를 사용할 때 실제 고객명·기관명·제품명·내부 수치·개인정보를 입력하지 않는다. AI 답변은 출처와 표현 위험을 확인한 뒤, 공식 자료와 현장 맥락에 맞게 수정해서 사용한다.`;
    update({ finalDeclaration: declaration });
    setCopyMessage('AI 사용 선언문 초안을 생성했습니다.');
  };

  const outputText = `[AI 안전선 선언]\n\n[확인한 위험 유형]\n${response.selectedRiskTypes.join(', ') || '-'}\n\n[나의 AI 사용 원칙]\n${response.personalRules}\n\n[최종 선언문]\n${response.finalDeclaration}`;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-bold">AI 안전선 Lab</p>
        <p className="mt-1">제약영업에서 AI를 사용할 때 입력하지 말아야 할 정보와 피해야 할 표현을 확인하고, 안전한 질문으로 바꿉니다.</p>
      </div>

      <SectionCard title="1단계: 입력 금지 정보 확인">
        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">복수 선택 가능 · 오늘 실습 전체에서 특히 주의해야 할 위험 유형을 선택하세요.</div>
        <div className="grid gap-2 md:grid-cols-2">{RISK_TYPES.map((item) => <label key={item} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={response.selectedRiskTypes.includes(item)} onChange={() => update({ selectedRiskTypes: toggle(response.selectedRiskTypes, item) })} />{item}</label>)}</div>
      </SectionCard>

      <SectionCard title="2단계: 위험 질문을 안전한 질문으로 바꾸기">
        <div className="space-y-3">
          {SAFETY_CASES.map((caseItem) => (
            <article key={caseItem.id} className="rounded-2xl border bg-white p-4 text-sm shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-black text-slate-900">{caseItem.title}</h4>
                <button className="rounded-xl bg-cyan-700 px-3 py-2 text-xs font-bold text-white" onClick={() => applySafeRewrite(caseItem)}>안전한 질문 예시 반영</button>
              </div>
              <p className="mt-3 text-xs font-bold text-red-600">위험 질문</p>
              <p className="mt-1 rounded-xl bg-red-50 p-3 text-red-900">{caseItem.riskyPrompt}</p>
              <p className="mt-3 text-xs font-bold text-amber-700">위험 유형</p>
              <p className="mt-1 text-slate-700">{caseItem.riskType}</p>
              <label className="mt-3 block space-y-1"><FieldLabel>안전한 질문으로 수정</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.rewrittenPrompts[caseItem.id] || ''} onChange={(event) => update({ rewrittenPrompts: { ...response.rewrittenPrompts, [caseItem.id]: event.target.value } })} placeholder="고객명·제품명·내부 수치·효과 단정 없이 바꿔 쓰세요." /></label>
            </article>
          ))}
        </div>
        {copyMessage ? <p className="text-sm font-semibold text-cyan-700">{copyMessage}</p> : null}
      </SectionCard>

      <SectionCard title="3단계: 나의 AI 사용 원칙 작성">
        <label className="block space-y-1"><FieldLabel>나의 AI 사용 원칙 3가지</FieldLabel><textarea className="min-h-28 w-full rounded-xl border px-3 py-2" value={response.personalRules} onChange={(event) => update({ personalRules: event.target.value })} placeholder="예: 1. 실제 고객명과 기관명은 입력하지 않는다. 2. 제품 효과를 단정하지 않는다. 3. AI 답변은 반드시 현장형으로 수정한다." /></label>
        <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white" onClick={makeDeclaration}>최종 선언문 생성</button>
        <label className="block space-y-1"><FieldLabel>최종 AI 사용 선언문</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.finalDeclaration} onChange={(event) => update({ finalDeclaration: event.target.value })} /></label>
      </SectionCard>

      <SectionCard title="최종 점검과 산출물">
        <div className="grid gap-2 md:grid-cols-2">{REVIEW_ITEMS.map((item) => <label key={item} className="flex items-start gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" className="mt-1" checked={Boolean(response.reviewChecks[item])} onChange={(event) => update({ reviewChecks: { ...response.reviewChecks, [item]: event.target.checked } })} /><span>{item}</span></label>)}</div>
        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">점검 완료: {checkedCount} / {REVIEW_ITEMS.length}</div>
        <pre className="whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{outputText}</pre>
        <p className="text-xs text-slate-500">자동 저장 키: {V36_STORAGE_KEYS.aiSafety} / 마지막 저장: {response.savedAt || '아직 입력 전'}</p>
      </SectionCard>
    </div>
  );
}

export default AiSafetyLab;
