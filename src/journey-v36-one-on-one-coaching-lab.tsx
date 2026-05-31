import { useMemo, useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';
import { V36_STORAGE_KEYS } from './journey-v36-preview-config';

type CoachingMember = {
  name: string;
  role: string;
  currentSignal: string;
  hiddenNeed: string;
  growthFocus: string;
  avoidApproach: string;
};

type CoachingPlan = {
  coachingPurpose: string;
  factsToConfirm: string;
  firstQuestion: string;
  followUpQuestions: string;
  supportAgreement: string;
  twoWeekExperiment: string;
  checkInCriteria: string;
  wordsToAvoid: string;
};

type CoachingResponse = {
  selectedMember: string;
  coachingHypothesis: string;
  supportNeed: string;
  interventionRisk: string;
  pastedAiCoachingPlan: string;
  reviewChecks: Record<string, boolean>;
  riskItems: Record<string, boolean>;
  fieldRevision: string;
  finalPlan: CoachingPlan;
  savedAt: string;
};

const MEMBERS: CoachingMember[] = [
  {
    name: '신재영 대리',
    role: 'MR',
    currentSignal: '활동량은 높지만 고객군별 메시지 구조화가 약합니다.',
    hiddenNeed: '노력 인정을 받으면서도 우선순위를 정리받고 싶어 합니다.',
    growthFocus: '콜 전 메시지 구조화와 콜 중 확인 질문 설계',
    avoidApproach: '더 열심히 하라는 식의 추상적 격려',
  },
  {
    name: '이대은 대리',
    role: 'MR',
    currentSignal: '고객 반응은 있으나 후속조치와 CRM 기록이 늦습니다.',
    hiddenNeed: '지적보다 실행 리듬을 함께 설계하는 지원이 필요합니다.',
    growthFocus: '콜 후 24시간 내 후속조치 루틴화',
    avoidApproach: '태도 문제나 책임감 부족으로 단정',
  },
  {
    name: '박재욱 사원',
    role: 'MR',
    currentSignal: '신규 접점 경험이 적고 질문보다 보고 중심으로 움직입니다.',
    hiddenNeed: '실수해도 학습할 수 있다는 안전감이 필요합니다.',
    growthFocus: '콜 전 목표 설정과 콜 후 학습 기록',
    avoidApproach: '세세한 지시로 모든 행동을 대신 정해주는 방식',
  },
  {
    name: '유희관 과장',
    role: 'MR',
    currentSignal: '기존 관계 관리는 안정적이나 신규 전략 메시지 적용 속도가 낮습니다.',
    hiddenNeed: '경험을 존중받으면서 변화 이유를 납득하고 싶어 합니다.',
    growthFocus: '기존 관계를 활용한 전략 메시지 전환',
    avoidApproach: '과거 방식이 틀렸다는 식의 표현',
  },
  {
    name: '김문호 차장',
    role: 'MR',
    currentSignal: '고객 접점은 넓지만 CRM 기록 품질에 편차가 큽니다.',
    hiddenNeed: '자신의 경험이 팀 자산으로 인정되길 원합니다.',
    growthFocus: '개인 노하우의 팀 학습 전환',
    avoidApproach: 'CRM을 행정업무나 감시 도구처럼 말하는 방식',
  },
  {
    name: '김재호 차장',
    role: 'MR',
    currentSignal: '전략 이해도는 높지만 팀 공유와 후배 지원이 부족합니다.',
    hiddenNeed: '성과 인정과 추가 역할 부담 사이의 균형이 필요합니다.',
    growthFocus: '고성과자의 팀 기여 역할 설계',
    avoidApproach: '잘하니까 당연히 더 해야 한다는 요구',
  },
];

const REVIEW_ITEMS = [
  '팀원의 현재 신호와 성장 필요를 구분했는가?',
  '리더의 가설을 사실처럼 단정하지 않았는가?',
  '코칭 질문이 지시나 추궁이 아니라 탐색형인가?',
  '2주 안에 실행할 작은 행동 실험이 있는가?',
  '팀원이 요청할 수 있는 지원이 포함되어 있는가?',
  '실제 고객명·병원명·제품명·내부 수치가 없는가?',
  '성과 압박보다 성장 지원 언어로 수정했는가?',
  '점검 기준이 관찰 가능한 행동으로 쓰였는가?',
];

const RISK_ITEMS = [
  '왜 아직도 못합니까',
  '당신은 주도성이 부족합니다',
  '잘하는 사람은 알아서 합니다',
  '고객을 더 강하게 설득하세요',
  '앞으로 무조건 이렇게 하세요',
  '이 정도는 기본입니다',
  '팀장이 시키는 대로만 하세요',
];

const FINAL_PLAN_LABELS: Array<{ key: keyof CoachingPlan; title: string; placeholder: string }> = [
  { key: 'coachingPurpose', title: '1. 코칭 목적', placeholder: '예: 이대은 대리의 후속조치 리듬을 회복하고 2주 행동 실험을 합의한다.' },
  { key: 'factsToConfirm', title: '2. 확인해야 할 사실', placeholder: '현재 막히는 지점, 고객 요청 후 처리 흐름, CRM 기록 시점 등을 작성합니다.' },
  { key: 'firstQuestion', title: '3. 첫 질문', placeholder: '팀원이 방어적으로 느끼지 않도록 시작 질문을 작성합니다.' },
  { key: 'followUpQuestions', title: '4. 후속 질문', placeholder: '원인 탐색, 지원 요청, 작은 행동 실험을 끌어내는 질문을 작성합니다.' },
  { key: 'supportAgreement', title: '5. 지원 합의', placeholder: '팀장이 제공할 자료, 피드백, 점검 방식 등을 작성합니다.' },
  { key: 'twoWeekExperiment', title: '6. 2주 행동 실험', placeholder: '2주 동안 작게 시도할 행동을 구체적으로 작성합니다.' },
  { key: 'checkInCriteria', title: '7. 점검 기준', placeholder: '2주 후 무엇을 보면 변화가 시작됐다고 판단할지 작성합니다.' },
  { key: 'wordsToAvoid', title: '8. 피해야 할 말', placeholder: '성격 단정, 압박, 비교, 고객 압박 표현 등을 작성합니다.' },
];

function createDefaultPlan(): CoachingPlan {
  return Object.fromEntries(FINAL_PLAN_LABELS.map((item) => [item.key, ''])) as CoachingPlan;
}

const DEFAULT_RESPONSE: CoachingResponse = {
  selectedMember: MEMBERS[2].name,
  coachingHypothesis: '',
  supportNeed: '',
  interventionRisk: '',
  pastedAiCoachingPlan: '',
  reviewChecks: {},
  riskItems: {},
  fieldRevision: '',
  finalPlan: createDefaultPlan(),
  savedAt: '',
};

function getSelectedMember(name: string) {
  return MEMBERS.find((member) => member.name === name) ?? MEMBERS[0];
}

function buildPrompt(response: CoachingResponse) {
  const member = getSelectedMember(response.selectedMember);

  return `너는 제약영업 팀장의 1on1 코칭 준비를 돕는 리더십 코치다.

나는 C1바이오 영업2본부 수도권중부영업팀장 역할을 맡고 있다. 아래 팀원의 현재 신호와 성장 초점을 바탕으로 1on1 코칭 계획 초안을 만들어줘. 단, 정답 대본이 아니라 팀장이 검토하고 수정할 수 있는 초안으로 작성해줘.

[코칭 대상]
- 이름/직책: ${member.name} / ${member.role}
- 현재 신호: ${member.currentSignal}
- 숨어 있는 필요: ${member.hiddenNeed}
- 성장 초점: ${member.growthFocus}
- 피해야 할 접근: ${member.avoidApproach}

[팀장의 1차 판단]
- 코칭 가설: ${response.coachingHypothesis || '교육생이 작성한 코칭 가설을 반영'}
- 필요한 지원: ${response.supportNeed || '교육생이 작성한 지원 필요를 반영'}
- 개입 리스크: ${response.interventionRisk || '교육생이 작성한 개입 리스크를 반영'}

[작성 조건]
1. 실제 고객명, 병원명, 의사명, 제품명, 내부 매출 수치, 처방 수치, 개인정보는 사용하지 말 것.
2. 팀원의 성격이나 태도를 단정하지 말고 관찰 가능한 실행 신호 중심으로 표현할 것.
3. 지시나 추궁보다 탐색형 질문을 중심으로 작성할 것.
4. 2주 안에 실행할 작은 행동 실험을 포함할 것.
5. 팀장이 제공할 지원과 점검 기준을 포함할 것.

[출력 형식]
1. 코칭 목적
2. 첫 질문
3. 후속 질문 3개
4. 팀장이 제공할 지원
5. 2주 행동 실험
6. 2주 후 점검 기준
7. 피해야 할 말`;
}

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

export function OneOnOneCoachingLab() {
  const [response, setResponse] = useStored<CoachingResponse>(V36_STORAGE_KEYS.oneOnOneCoaching, DEFAULT_RESPONSE);
  const [copyMessage, setCopyMessage] = useState('');
  const selectedMember = getSelectedMember(response.selectedMember);
  const generatedPrompt = useMemo(() => buildPrompt(response), [response]);
  const checkedReviewCount = REVIEW_ITEMS.filter((item) => response.reviewChecks[item]).length;
  const riskCount = RISK_ITEMS.filter((item) => response.riskItems[item]).length;

  const update = (patch: Partial<CoachingResponse>) => {
    setResponse({ ...response, ...patch, savedAt: new Date().toISOString() });
  };

  const updateFinalPlan = (key: keyof CoachingPlan, value: string) => {
    update({ finalPlan: { ...response.finalPlan, [key]: value } });
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopyMessage('1on1 코칭 프롬프트를 복사했습니다.');
    } catch {
      setCopyMessage('복사가 차단되었습니다. 프롬프트 영역을 직접 선택해 복사하세요.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-bold">1on1 코칭 AI 안전선</p>
        <p className="mt-1">팀원 코칭에는 실제 고객명, 병원명, 제품명, 내부 수치를 넣지 않습니다. 팀원을 단정하지 말고 관찰 가능한 실행 신호와 성장 지원 언어로 수정합니다.</p>
      </div>

      <SectionCard title="상황 제시: 1on1 코칭 Lab">
        <p className="text-sm leading-6 text-slate-700">이번 Lab은 팀원 한 명을 선택해 개입 가설을 세우고, AI 초안을 감별한 뒤 실제 1on1에서 사용할 코칭 질문과 2주 행동 실험을 설계하는 과정입니다.</p>
      </SectionCard>

      <SectionCard title="판단 데이터: 팀원별 성장·지원 신호">
        <label className="block space-y-1">
          <FieldLabel>코칭 대상 선택</FieldLabel>
          <select className="w-full rounded-xl border px-3 py-2" value={response.selectedMember} onChange={(event) => update({ selectedMember: event.target.value })}>
            {MEMBERS.map((member) => <option key={member.name} value={member.name}>{member.name} / {member.role}</option>)}
          </select>
        </label>
        <article className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-700">
          <h4 className="font-bold text-slate-900">{selectedMember.name} <span className="text-xs text-slate-500">{selectedMember.role}</span></h4>
          <dl className="mt-3 space-y-2">
            <div><dt className="font-semibold">현재 신호</dt><dd>{selectedMember.currentSignal}</dd></div>
            <div><dt className="font-semibold">숨어 있는 필요</dt><dd>{selectedMember.hiddenNeed}</dd></div>
            <div><dt className="font-semibold">성장 초점</dt><dd>{selectedMember.growthFocus}</dd></div>
            <div><dt className="font-semibold">피해야 할 접근</dt><dd>{selectedMember.avoidApproach}</dd></div>
          </dl>
        </article>
      </SectionCard>

      <SectionCard title="리더의 1차 판단">
        <label className="block space-y-1"><FieldLabel>코칭 가설</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.coachingHypothesis} onChange={(event) => update({ coachingHypothesis: event.target.value })} placeholder="팀원이 지금 어떤 지점에서 막혀 있다고 보십니까?" /></label>
        <label className="block space-y-1"><FieldLabel>필요한 지원</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.supportNeed} onChange={(event) => update({ supportNeed: event.target.value })} placeholder="팀장이 제공해야 할 지원은 무엇입니까?" /></label>
        <label className="block space-y-1"><FieldLabel>개입 리스크</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.interventionRisk} onChange={(event) => update({ interventionRisk: event.target.value })} placeholder="어떤 말이나 방식이 팀원을 방어적으로 만들 수 있습니까?" /></label>
      </SectionCard>

      <SectionCard title="AI 질문 생성: 1on1 코칭 프롬프트">
        <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm text-slate-600">아래 프롬프트를 외부 AI에 복사한 뒤, 답변을 다음 영역에 붙여넣습니다.</p><button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={copyPrompt}>프롬프트 복사</button></div>
        {copyMessage ? <p className="text-sm font-semibold text-cyan-700">{copyMessage}</p> : null}
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{generatedPrompt}</pre>
      </SectionCard>

      <SectionCard title="AI 답변 붙여넣기">
        <textarea className="min-h-48 w-full rounded-xl border px-3 py-2" value={response.pastedAiCoachingPlan} onChange={(event) => update({ pastedAiCoachingPlan: event.target.value })} placeholder="외부 AI가 만든 1on1 코칭 초안을 여기에 붙여넣으세요." />
      </SectionCard>

      <SectionCard title="AI 코칭 답변 감별 기준 8개">
        <div className="grid gap-2 md:grid-cols-2">
          {REVIEW_ITEMS.map((item) => <label key={item} className="flex items-start gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" className="mt-1" checked={Boolean(response.reviewChecks[item])} onChange={(event) => update({ reviewChecks: { ...response.reviewChecks, [item]: event.target.checked } })} /><span>{item}</span></label>)}
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">감별 완료: {checkedReviewCount} / {REVIEW_ITEMS.length}</div>
      </SectionCard>

      <SectionCard title="위험 코칭 표현 제거">
        <div className="grid gap-2 md:grid-cols-2">
          {RISK_ITEMS.map((item) => <label key={item} className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"><input type="checkbox" className="mt-1" checked={Boolean(response.riskItems[item])} onChange={(event) => update({ riskItems: { ...response.riskItems, [item]: event.target.checked } })} /><span>{item}</span></label>)}
        </div>
      </SectionCard>

      <SectionCard title="현장형 수정">
        <textarea className="min-h-36 w-full rounded-xl border px-3 py-2" value={response.fieldRevision} onChange={(event) => update({ fieldRevision: event.target.value })} placeholder="AI 답변에서 지시·추궁·성격 단정처럼 들리는 표현을 어떻게 수정할지 작성하세요." />
      </SectionCard>

      <SectionCard title="최종 산출물: 1on1 코칭 계획">
        <div className="grid gap-3 md:grid-cols-2">
          {FINAL_PLAN_LABELS.map((item) => <label key={item.key} className="block space-y-1"><FieldLabel>{item.title}</FieldLabel><textarea className="min-h-28 w-full rounded-xl border px-3 py-2" value={response.finalPlan[item.key]} onChange={(event) => updateFinalPlan(item.key, event.target.value)} placeholder={item.placeholder} /></label>)}
        </div>
      </SectionCard>

      <SectionCard title="저장 및 강사용 대시보드 요약">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-3 text-sm"><p className="font-bold text-slate-900">선택 요약</p><p className="mt-1">코칭 대상: {selectedMember.name}</p><p>성장 초점: {selectedMember.growthFocus}</p></div>
          <div className="rounded-xl bg-slate-50 p-3 text-sm"><p className="font-bold text-slate-900">감별 요약</p><p className="mt-1">체크된 감별 기준: {checkedReviewCount} / {REVIEW_ITEMS.length}</p><p>위험 표현 표시: {riskCount}개</p></div>
        </div>
        <div className="rounded-xl border bg-cyan-50 p-3 text-sm text-cyan-900"><p className="font-bold">강사용 토의 질문</p><p className="mt-1">왜 {selectedMember.name}을 1on1 코칭 대상으로 선택했습니까?</p><p>AI 답변 중 지시나 추궁처럼 들릴 수 있는 문장은 무엇이었습니까?</p><p>최종 계획에 2주 행동 실험과 점검 기준이 포함되어 있습니까?</p></div>
        <p className="text-xs text-slate-500">자동 저장 키: {V36_STORAGE_KEYS.oneOnOneCoaching} / 마지막 저장: {response.savedAt || '아직 입력 전'}</p>
      </SectionCard>
    </div>
  );
}

export default OneOnOneCoachingLab;
