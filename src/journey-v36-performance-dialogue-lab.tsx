import { useMemo, useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';
import { V36_STORAGE_KEYS } from './journey-v36-preview-config';

type DialogueMember = {
  name: string;
  role: string;
  performanceSignal: string;
  executionGap: string;
  emotionalSignal: string;
  managerRisk: string;
};

type DialoguePlan = {
  purpose: string;
  factsToCheck: string;
  openingSentence: string;
  coreQuestions: string;
  actionAgreement: string;
  twoWeekCheckCriteria: string;
  managerRecord: string;
};

type PerformanceDialogueResponse = {
  selectedMember: string;
  leaderHypothesis: string;
  dataSignal: string;
  conversationRisk: string;
  generatedPromptMemo: string;
  pastedAiDialogue: string;
  reviewChecks: Record<string, boolean>;
  riskSentences: Record<string, boolean>;
  fieldRevision: string;
  finalDialoguePlan: DialoguePlan;
  savedAt: string;
};

const MEMBERS: DialogueMember[] = [
  {
    name: '신재영 대리',
    role: 'MR',
    performanceSignal: '방문 활동량은 높지만 고객군별 메시지가 자주 흔들립니다.',
    executionGap: '콜 전 준비자료는 충분하지만 콜 중 확인 질문이 약합니다.',
    emotionalSignal: '성과 압박을 느끼며 빠른 답을 얻고 싶어 합니다.',
    managerRisk: '열심히 하는 태도를 칭찬하다가 핵심 개선점을 흐릴 수 있습니다.',
  },
  {
    name: '이대은 대리',
    role: 'MR',
    performanceSignal: '고객 반응은 있으나 콜 후 24시간 내 후속조치가 늦습니다.',
    executionGap: '고객 요청자료와 다음 행동을 CRM에 늦게 남기는 경향이 있습니다.',
    emotionalSignal: '지적받는 느낌에 민감하고 방어적으로 반응할 수 있습니다.',
    managerRisk: '태도 문제로 몰아가면 신뢰가 빠르게 낮아질 수 있습니다.',
  },
  {
    name: '박재욱 사원',
    role: 'MR',
    performanceSignal: '신규 접점 경험이 적어 고객 반응을 구조적으로 해석하지 못합니다.',
    executionGap: '콜 전 목표와 콜 후 학습 기록이 아직 불안정합니다.',
    emotionalSignal: '실수에 대한 부담이 커서 질문보다 보고 중심으로 움직입니다.',
    managerRisk: '세세하게 지시하면 학습 기회가 줄어들 수 있습니다.',
  },
  {
    name: '유희관 과장',
    role: 'MR',
    performanceSignal: '기존 고객 관계는 안정적이지만 신규 전략 메시지 적용 속도가 낮습니다.',
    executionGap: '관성적 방문이 늘고 고객군별 우선순위 조정이 늦습니다.',
    emotionalSignal: '오랜 경험을 존중받고 싶어 하며 급격한 방식 변화에 조심스럽습니다.',
    managerRisk: '변화를 강요하면 체면 손상으로 받아들일 수 있습니다.',
  },
  {
    name: '김문호 차장',
    role: 'MR',
    performanceSignal: '고객 접점은 넓지만 CRM 기록 품질에 편차가 큽니다.',
    executionGap: '개인 머릿속에는 정보가 있으나 팀 학습으로 전환되지 않습니다.',
    emotionalSignal: '자신의 방식에 대한 자부심이 강합니다.',
    managerRisk: '기록을 행정업무로만 말하면 반발할 수 있습니다.',
  },
  {
    name: '김재호 차장',
    role: 'MR',
    performanceSignal: '전략 이해도는 높지만 팀 공유와 후배 지원이 부족합니다.',
    executionGap: '개인 실행은 빠르지만 팀 전체 실행 표준으로 전환되지 않습니다.',
    emotionalSignal: '성과를 인정받고 싶지만 추가 역할 부여에는 부담을 느낄 수 있습니다.',
    managerRisk: '고성과자라는 이유로 팀 기여를 당연하게 요구할 수 있습니다.',
  },
];

const REVIEW_ITEMS = [
  '성과 데이터와 실행 신호를 구분했는가?',
  '인신평가나 성격 판단 표현이 없는가?',
  '실제 고객명·병원명·제품명·내부 수치가 없는가?',
  '미승인 효능·허가 외 표현이 없는가?',
  '팀원의 상황과 맥락을 확인하는 질문이 있는가?',
  '다음 행동이 2주 안에 실행 가능하게 구체적인가?',
  '팀장이 일방적으로 지시하지 않는가?',
  '2주 후 점검 기준이 포함되어 있는가?',
];

const RISK_SENTENCES = [
  '당신은 실행력이 부족합니다',
  '왜 이렇게 기본을 못 지킵니까',
  '고객을 더 강하게 설득하세요',
  '처방을 반드시 늘려야 합니다',
  '이 제품이 확실히 더 효과적입니다',
  '다른 팀원은 다 하는데 왜 못합니까',
  '앞으로 실적이 안 나오면 책임을 묻겠습니다',
];

const FINAL_PLAN_LABELS: Array<{ key: keyof DialoguePlan; title: string; placeholder: string }> = [
  { key: 'purpose', title: '1. 대화 목적', placeholder: '예: 이대은 대리의 후속조치 지연 원인을 확인하고 2주 실행 리듬을 합의한다.' },
  { key: 'factsToCheck', title: '2. 확인해야 할 사실', placeholder: '고객 요청자료, 콜 후 24시간 내 후속조치, CRM 기록 시점 등 확인할 사실을 작성합니다.' },
  { key: 'openingSentence', title: '3. 첫 문장', placeholder: '비난이 아니라 관찰 데이터로 대화를 여는 첫 문장을 작성합니다.' },
  { key: 'coreQuestions', title: '4. 핵심 질문 3개', placeholder: '무엇이 막혔는지, 어떤 지원이 필요한지, 다음 2주 행동은 무엇인지 묻는 질문을 작성합니다.' },
  { key: 'actionAgreement', title: '5. 합의할 행동', placeholder: '콜 후 24시간 내 후속조치, CRM 기록, 팀장 점검 방식 등을 합의합니다.' },
  { key: 'twoWeekCheckCriteria', title: '6. 2주 점검 기준', placeholder: '2주 후 무엇을 보면 개선되었다고 판단할지 기준을 작성합니다.' },
  { key: 'managerRecord', title: '7. 팀장이 남길 기록', placeholder: '대화 후 팀장이 남겨야 할 관찰, 합의, 지원, 리스크 기록을 작성합니다.' },
];

function createDefaultPlan(): DialoguePlan {
  return Object.fromEntries(FINAL_PLAN_LABELS.map((item) => [item.key, ''])) as DialoguePlan;
}

const DEFAULT_RESPONSE: PerformanceDialogueResponse = {
  selectedMember: MEMBERS[1].name,
  leaderHypothesis: '',
  dataSignal: '',
  conversationRisk: '',
  generatedPromptMemo: '',
  pastedAiDialogue: '',
  reviewChecks: {},
  riskSentences: {},
  fieldRevision: '',
  finalDialoguePlan: createDefaultPlan(),
  savedAt: '',
};

function getSelectedMember(name: string) {
  return MEMBERS.find((member) => member.name === name) ?? MEMBERS[0];
}

function buildPrompt(response: PerformanceDialogueResponse) {
  const member = getSelectedMember(response.selectedMember);

  return `너는 제약영업 팀장의 성과대화 준비를 돕는 리더십 코치다.

나는 C1바이오 영업2본부 수도권중부영업팀장 역할을 맡고 있다. 아래 팀원의 실행 신호를 바탕으로 성과대화 초안을 만들어줘. 단, 팀장이 그대로 읽을 완성 대본이 아니라, 팀장이 검토하고 수정할 수 있는 초안으로 작성해줘.

[대화 대상]
- 이름/직책: ${member.name} / ${member.role}
- 성과 신호: ${member.performanceSignal}
- 실행 Gap: ${member.executionGap}
- 감정/동기 신호: ${member.emotionalSignal}
- 팀장이 조심해야 할 위험: ${member.managerRisk}

[팀장의 1차 판단]
- 리더의 가설: ${response.leaderHypothesis || '교육생이 작성한 가설을 반영'}
- 가장 중요한 데이터 신호: ${response.dataSignal || '교육생이 작성한 데이터 신호를 반영'}
- 대화에서 조심할 점: ${response.conversationRisk || '교육생이 작성한 대화 리스크를 반영'}

[작성 조건]
1. 실제 고객명, 병원명, 의사명, 제품명, 내부 매출 수치, 처방 수치, 개인정보는 사용하지 말 것.
2. 미승인 효능, 허가 외 사용, 제품 효과 단정, 경쟁사 비방, 고객 압박 표현은 사용하지 말 것.
3. 팀원을 성격이나 태도로 평가하지 말고 관찰 가능한 실행 데이터 중심으로 표현할 것.
4. 팀장이 일방적으로 지시하기보다 확인 질문과 합의 문장을 포함할 것.
5. 대화 후 2주 점검 기준을 포함할 것.

[출력 형식]
1. 대화 목적
2. 첫 문장
3. 확인 질문 3개
4. 피해야 할 표현
5. 합의할 2주 행동
6. 2주 후 점검 기준
7. 팀장이 남길 기록`;
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

function SafetyNotice() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="font-bold">성과대화 AI 안전선</p>
      <p className="mt-1">
        성과대화문에는 실제 고객명, 병원명, 의사명, 제품명, 내부 매출·처방 수치를 넣지 않습니다. 팀원을 성격이나 태도로 단정하지 않고 실행 데이터와 확인 질문 중심으로 수정합니다.
      </p>
    </div>
  );
}

export function PerformanceDialogueLab() {
  const [response, setResponse] = useStored<PerformanceDialogueResponse>(V36_STORAGE_KEYS.performanceDialogue, DEFAULT_RESPONSE);
  const [copyMessage, setCopyMessage] = useState('');
  const selectedMember = getSelectedMember(response.selectedMember);
  const generatedPrompt = useMemo(() => buildPrompt(response), [response]);
  const checkedReviewCount = REVIEW_ITEMS.filter((item) => response.reviewChecks[item]).length;
  const riskSentenceCount = RISK_SENTENCES.filter((item) => response.riskSentences[item]).length;

  const update = (patch: Partial<PerformanceDialogueResponse>) => {
    setResponse({ ...response, ...patch, savedAt: new Date().toISOString() });
  };

  const updateFinalPlan = (key: keyof DialoguePlan, value: string) => {
    update({ finalDialoguePlan: { ...response.finalDialoguePlan, [key]: value } });
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopyMessage('성과대화 프롬프트를 복사했습니다.');
    } catch {
      setCopyMessage('복사가 차단되었습니다. 프롬프트 영역을 직접 선택해 복사하세요.');
    }
  };

  return (
    <div className="space-y-4">
      <SafetyNotice />

      <SectionCard title="상황 제시: 성과대화 감별 Lab">
        <p className="text-sm leading-6 text-slate-700">
          이번 Lab의 목적은 AI가 만든 대화문을 그대로 쓰는 것이 아니라, 팀장의 1차 판단과 실행 데이터를 바탕으로
          위험한 표현을 감별하고 현장에서 사용할 수 있는 성과대화 계획으로 수정하는 것입니다.
        </p>
        <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-bold text-slate-900">오늘의 판단 과제</p>
          <p className="mt-1">누구와 어떤 목적으로 대화할지, 어떤 데이터를 확인할지, 어떤 표현을 피할지 먼저 정합니다.</p>
        </div>
      </SectionCard>

      <SectionCard title="판단 데이터: 팀원별 성과·실행 신호">
        <label className="block space-y-1">
          <FieldLabel>대화 대상 선택</FieldLabel>
          <select className="w-full rounded-xl border px-3 py-2" value={response.selectedMember} onChange={(event) => update({ selectedMember: event.target.value })}>
            {MEMBERS.map((member) => <option key={member.name} value={member.name}>{member.name} / {member.role}</option>)}
          </select>
        </label>
        <article className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-700">
          <h4 className="font-bold text-slate-900">{selectedMember.name} <span className="text-xs text-slate-500">{selectedMember.role}</span></h4>
          <dl className="mt-3 space-y-2">
            <div><dt className="font-semibold">성과 신호</dt><dd>{selectedMember.performanceSignal}</dd></div>
            <div><dt className="font-semibold">실행 Gap</dt><dd>{selectedMember.executionGap}</dd></div>
            <div><dt className="font-semibold">감정/동기 신호</dt><dd>{selectedMember.emotionalSignal}</dd></div>
            <div><dt className="font-semibold">팀장 리스크</dt><dd>{selectedMember.managerRisk}</dd></div>
          </dl>
        </article>
      </SectionCard>

      <SectionCard title="리더의 1차 판단">
        <label className="block space-y-1">
          <FieldLabel>리더의 가설</FieldLabel>
          <textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.leaderHypothesis} onChange={(event) => update({ leaderHypothesis: event.target.value })} placeholder="성과 저하 또는 실행 Gap의 원인을 사람 탓이 아니라 실행 구조, 우선순위, 후속조치, 기록 품질 관점에서 가설로 작성하세요." />
        </label>
        <label className="block space-y-1">
          <FieldLabel>가장 중요한 데이터 신호</FieldLabel>
          <textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.dataSignal} onChange={(event) => update({ dataSignal: event.target.value })} placeholder="대화에서 반드시 확인해야 할 데이터 신호를 작성하세요." />
        </label>
        <label className="block space-y-1">
          <FieldLabel>대화에서 조심할 점</FieldLabel>
          <textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.conversationRisk} onChange={(event) => update({ conversationRisk: event.target.value })} placeholder="팀원이 방어적으로 느끼거나, 성격 평가로 들릴 수 있는 지점을 작성하세요." />
        </label>
      </SectionCard>

      <SectionCard title="AI 질문 생성: 성과대화 프롬프트">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-slate-600">아래 프롬프트를 외부 AI에 복사한 뒤, 답변을 다음 영역에 붙여넣습니다.</p>
          <button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={copyPrompt}>프롬프트 복사</button>
        </div>
        {copyMessage ? <p className="text-sm font-semibold text-cyan-700">{copyMessage}</p> : null}
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{generatedPrompt}</pre>
      </SectionCard>

      <SectionCard title="AI 답변 붙여넣기">
        <textarea
          className="min-h-48 w-full rounded-xl border px-3 py-2"
          value={response.pastedAiDialogue}
          onChange={(event) => update({ pastedAiDialogue: event.target.value })}
          placeholder="외부 AI가 만든 성과대화 초안을 여기에 붙여넣으세요. 실제 고객명·병원명·제품명·내부 수치가 포함되어 있으면 제거 후 붙여넣습니다."
        />
      </SectionCard>

      <SectionCard title="AI 답변 감별 기준 8개">
        <div className="grid gap-2 md:grid-cols-2">
          {REVIEW_ITEMS.map((item) => (
            <label key={item} className="flex items-start gap-2 rounded-xl border p-3 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={Boolean(response.reviewChecks[item])}
                onChange={(event) => update({ reviewChecks: { ...response.reviewChecks, [item]: event.target.checked } })}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">감별 완료: {checkedReviewCount} / {REVIEW_ITEMS.length}</div>
      </SectionCard>

      <SectionCard title="위험 문장 표시 및 제거">
        <p className="text-sm text-slate-600">AI 답변에 아래와 유사한 문장이 있으면 체크하고, 최종 대화계획에서 제거하거나 수정합니다.</p>
        <div className="grid gap-2 md:grid-cols-2">
          {RISK_SENTENCES.map((item) => (
            <label key={item} className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <input
                type="checkbox"
                className="mt-1"
                checked={Boolean(response.riskSentences[item])}
                onChange={(event) => update({ riskSentences: { ...response.riskSentences, [item]: event.target.checked } })}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="현장형 수정">
        <textarea
          className="min-h-36 w-full rounded-xl border px-3 py-2"
          value={response.fieldRevision}
          onChange={(event) => update({ fieldRevision: event.target.value })}
          placeholder="AI 답변에서 성격 평가처럼 들리는 문장, 고객 압박 표현, 실행 불가능한 제안을 어떻게 수정할지 작성하세요."
        />
      </SectionCard>

      <SectionCard title="최종 산출물: 성과대화 계획">
        <div className="grid gap-3 md:grid-cols-2">
          {FINAL_PLAN_LABELS.map((item) => (
            <label key={item.key} className="block space-y-1">
              <FieldLabel>{item.title}</FieldLabel>
              <textarea
                className="min-h-28 w-full rounded-xl border px-3 py-2"
                value={response.finalDialoguePlan[item.key]}
                onChange={(event) => updateFinalPlan(item.key, event.target.value)}
                placeholder={item.placeholder}
              />
            </label>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="저장 및 강사용 대시보드 요약">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-3 text-sm">
            <p className="font-bold text-slate-900">선택 요약</p>
            <p className="mt-1">대화 대상: {selectedMember.name}</p>
            <p>핵심 신호: {selectedMember.executionGap}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-sm">
            <p className="font-bold text-slate-900">감별 요약</p>
            <p className="mt-1">체크된 감별 기준: {checkedReviewCount} / {REVIEW_ITEMS.length}</p>
            <p>위험 문장 표시: {riskSentenceCount}개</p>
          </div>
        </div>
        <div className="rounded-xl border bg-cyan-50 p-3 text-sm text-cyan-900">
          <p className="font-bold">강사용 토의 질문</p>
          <p className="mt-1">왜 {selectedMember.name}을 성과대화 대상으로 선택했습니까?</p>
          <p>AI 답변 중 성격 평가처럼 들릴 수 있는 문장은 무엇이었습니까?</p>
          <p>최종 대화계획에 2주 후 점검 기준이 충분히 들어 있습니까?</p>
        </div>
        <p className="text-xs text-slate-500">자동 저장 키: {V36_STORAGE_KEYS.performanceDialogue} / 마지막 저장: {response.savedAt || '아직 입력 전'}</p>
      </SectionCard>
    </div>
  );
}

export default PerformanceDialogueLab;
