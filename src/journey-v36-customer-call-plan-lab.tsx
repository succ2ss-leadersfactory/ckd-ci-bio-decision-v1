import { useMemo, useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';
import { V36_STORAGE_KEYS } from './journey-v36-preview-config';

type CustomerSegment = {
  id: string;
  name: string;
  signal: string;
  opportunity: string;
  risk: string;
  caution: string;
};

type TeamMember = {
  name: string;
  role: string;
  signal: string;
  suggestedRole: string;
};

type FinalCallPlan = {
  focusDirection: string;
  customerSegmentPrinciples: string;
  memberRoles: string;
  beforeCallMaterials: string;
  duringCallQuestions: string;
  afterCallFollowUp: string;
  crmRecordStandards: string;
  actionsToAvoid: string;
  complianceWarnings: string;
  managerMessage: string;
};

type CustomerCallPlanResponse = {
  selectedFocusSegment: string;
  selectedDeprioritizedSegment: string;
  segmentDecisionReason: string;
  riskTradeoffMemo: string;
  memberRoles: Record<string, string>;
  pastedAiAnswer: string;
  reviewChecks: Record<string, boolean>;
  riskExpressions: Record<string, boolean>;
  fieldRevisions: string;
  finalCallPlan: FinalCallPlan;
  savedAt: string;
};

const CUSTOMER_SEGMENTS: CustomerSegment[] = [
  {
    id: 'A',
    name: 'A군: 반응 상승 고객군',
    signal: '메시지 수용도 높음, 후속자료 요청 증가',
    opportunity: '2주 내 실행 전환 가능성이 높음',
    risk: '과잉 접촉 시 피로감 발생 가능',
    caution: '효능 단정·미승인 표현 금지',
  },
  {
    id: 'B',
    name: 'B군: 관심은 있으나 지연되는 고객군',
    signal: '관심은 있으나 반응이 늦고 후속 확인이 필요함',
    opportunity: '관계 회복과 니즈 재확인 가능',
    risk: '후속조치 누락 시 신뢰 저하',
    caution: '고객 상황 확인 없는 압박 금지',
  },
  {
    id: 'C',
    name: 'C군: 안정적 기존 관계 고객군',
    signal: '기존 관계는 안정적이나 변화 신호는 낮음',
    opportunity: '장기 관계 유지와 접점 품질 개선',
    risk: '관성적 방문으로 시간 대비 성과 저하',
    caution: '방문 목적 불명확 주의',
  },
  {
    id: 'D',
    name: 'D군: 반응 낮고 이슈 민감 고객군',
    signal: '최근 반응 낮고 이슈 민감도가 높음',
    opportunity: '장기 모니터링과 관계 악화 방지',
    risk: '무리한 접근 시 관계 악화 가능',
    caution: '접근 빈도 조절 필요',
  },
];

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: '신재영 대리',
    role: 'MR',
    signal: '활동량은 높지만 메시지 일관성이 약함',
    suggestedRole: 'A군 핵심 메시지 정리와 콜 전 준비',
  },
  {
    name: '이대은 대리',
    role: 'MR',
    signal: '고객 반응은 있으나 후속조치 속도가 늦음',
    suggestedRole: 'B군 후속조치 리듬 회복',
  },
  {
    name: '박재욱 사원',
    role: 'MR',
    signal: '신규 접점 경험이 적고 질문 설계가 약함',
    suggestedRole: '콜 중 확인 질문 연습',
  },
  {
    name: '유희관 과장',
    role: 'MR',
    signal: '기존 관계 관리는 안정적이나 변화 대응 속도가 낮음',
    suggestedRole: 'C군 유지 고객 접점 품질 개선',
  },
  {
    name: '김문호 차장',
    role: 'MR',
    signal: '경험은 많지만 CRM 기록 품질에 편차가 있음',
    suggestedRole: 'CRM 기록 기준 표준화',
  },
  {
    name: '김재호 차장',
    role: 'MR',
    signal: '전략 이해도는 높으나 팀 공유가 부족함',
    suggestedRole: '팀 회의 공유 문장 정리',
  },
];

const REVIEW_ITEMS = [
  '고객군 데이터와 연결된 제안인가?',
  '2주 안에 실행 가능한 행동인가?',
  '팀원별 역할이 서로 다르게 설계되었는가?',
  '팀 회의에서 바로 말할 수 있는 표현인가?',
  '금지 표현이나 위험 표현이 없는가?',
  '집중할 행동과 줄일 행동이 모두 있는가?',
  '콜 후 24시간 내 행동이 명확한가?',
  'CRM 기록 기준이 구체적인가?',
];

const RISK_EXPRESSIONS = [
  '효과가 확실합니다',
  '경쟁 제품보다 우월합니다',
  '반드시 사용해야 합니다',
  '처방을 늘려야 합니다',
  '고객을 설득해 전환시키십시오',
  '병원별 처방 데이터를 바탕으로 압박하십시오',
  '내부 전략상 반드시 밀어야 합니다',
];

const FINAL_OUTPUT_LABELS: Array<{ key: keyof FinalCallPlan; title: string; placeholder: string }> = [
  { key: 'focusDirection', title: '1. 2주 집중 방향', placeholder: '예: A군은 정보 니즈 확인과 후속자료 응답 속도를 높이고, D군은 접근 빈도를 낮춰 관계 리스크를 관리한다.' },
  { key: 'customerSegmentPrinciples', title: '2. 고객군별 접근 원칙', placeholder: '고객군별로 콜 전 준비, 콜 중 확인, 콜 후 후속조치 원칙을 구분해 작성합니다.' },
  { key: 'memberRoles', title: '3. 팀원별 역할', placeholder: '신재영 대리: A군 핵심 메시지 정리 / 이대은 대리: B군 후속 리듬 회복 ...' },
  { key: 'beforeCallMaterials', title: '4. 콜 전 준비자료', placeholder: '공식 자료 범위 내에서 준비할 자료와 확인 질문을 작성합니다.' },
  { key: 'duringCallQuestions', title: '5. 콜 중 확인 질문', placeholder: '고객의 정보 니즈, 현재 고민, 추가 확인 필요사항을 묻는 질문을 작성합니다.' },
  { key: 'afterCallFollowUp', title: '6. 콜 후 24시간 내 후속조치', placeholder: '후속자료 전달, 내부 공유, 다음 접점 준비 등 24시간 내 행동을 작성합니다.' },
  { key: 'crmRecordStandards', title: '7. CRM 기록 기준', placeholder: '고객 반응 신호, 요청자료, 다음 행동, 주의 표현 등을 기록 기준으로 작성합니다.' },
  { key: 'actionsToAvoid', title: '8. 하지 않을 행동', placeholder: '무리한 접촉, 효과 단정, 고객 압박, 내부 민감정보 입력 등을 작성합니다.' },
  { key: 'complianceWarnings', title: '9. 컴플라이언스 주의 표현', placeholder: '효과 단정, 경쟁사 비방, 미승인 표현, 고객 압박 표현 등을 정리합니다.' },
  { key: 'managerMessage', title: '10. 팀장 회의 공유 문장', placeholder: '팀 회의에서 팀장이 바로 말할 수 있는 3~5문장을 작성합니다.' },
];

function createDefaultMemberRoles() {
  return Object.fromEntries(TEAM_MEMBERS.map((member) => [member.name, member.suggestedRole]));
}

function createDefaultFinalCallPlan(): FinalCallPlan {
  return Object.fromEntries(FINAL_OUTPUT_LABELS.map((item) => [item.key, ''])) as FinalCallPlan;
}

const DEFAULT_RESPONSE: CustomerCallPlanResponse = {
  selectedFocusSegment: 'A',
  selectedDeprioritizedSegment: 'D',
  segmentDecisionReason: '',
  riskTradeoffMemo: '',
  memberRoles: createDefaultMemberRoles(),
  pastedAiAnswer: '',
  reviewChecks: {},
  riskExpressions: {},
  fieldRevisions: '',
  finalCallPlan: createDefaultFinalCallPlan(),
  savedAt: '',
};

function getSegmentName(id: string) {
  return CUSTOMER_SEGMENTS.find((segment) => segment.id === id)?.name ?? id;
}

function buildPrompt(response: CustomerCallPlanResponse) {
  const memberRoleText = TEAM_MEMBERS.map((member) => `- ${member.name}: ${response.memberRoles[member.name] || member.suggestedRole}`).join('\n');

  return `너는 제약영업 팀장의 실행전략 수립을 돕는 조언자다.

나는 C1바이오 영업2본부 수도권중부영업팀장 역할을 맡고 있다. 아래 고객군별 반응 데이터와 팀원별 실행 특성을 바탕으로, 향후 2주간 사용할 콜플랜 초안을 만들어줘.

[고객군 판단]
- 집중 고객군: ${getSegmentName(response.selectedFocusSegment)}
- 제외 또는 후순위 고객군: ${getSegmentName(response.selectedDeprioritizedSegment)}
- 선택 이유: ${response.segmentDecisionReason || '교육생이 작성한 선택 이유를 반영'}
- 포기 비용/리스크: ${response.riskTradeoffMemo || '교육생이 작성한 포기 비용과 리스크를 반영'}

[팀원별 역할]
${memberRoleText}

[작성 조건]
1. 실제 고객명, 병원명, 의사명, 내부 매출 수치, 처방 수치, 개인정보, 민감 정보는 사용하지 말 것.
2. 미승인 효능, 허가 외 사용, 제품 효과를 단정하는 표현은 사용하지 말 것.
3. 고객을 압박하거나 경쟁사를 비방하는 표현은 사용하지 말 것.
4. 콜 전 준비, 콜 중 확인 질문, 콜 후 24시간 내 후속조치, CRM 기록 기준을 포함할 것.
5. 팀원별로 실행 행동을 다르게 제안할 것.
6. 하지 않을 행동도 명확히 제안할 것.
7. 현장 영업팀장이 팀 회의에서 바로 설명할 수 있는 문장으로 작성할 것.

[출력 형식]
1. 2주 집중 방향
2. 고객군별 접근 원칙
3. 팀원별 역할
4. 콜 전 준비자료
5. 콜 중 확인 질문
6. 콜 후 24시간 내 후속조치
7. CRM 기록 기준
8. 하지 않을 행동
9. 컴플라이언스 주의 표현`;
}

function FieldLabel({ children }: { children: string }) {
  return <span className="text-xs font-bold text-slate-500">{children}</span>;
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function SafetyNotice() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="font-bold">제약영업 AI 안전선</p>
      <p className="mt-1">
        실제 고객명, 병원명, 의사명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다. AI 답변은 반드시 감별하고 현장형으로 수정합니다.
      </p>
    </div>
  );
}

export function CustomerCallPlanLab() {
  const [response, setResponse] = useStored<CustomerCallPlanResponse>(V36_STORAGE_KEYS.customerCallPlan, DEFAULT_RESPONSE);
  const [copyMessage, setCopyMessage] = useState('');
  const generatedPrompt = useMemo(() => buildPrompt(response), [response]);
  const checkedReviewCount = REVIEW_ITEMS.filter((item) => response.reviewChecks[item]).length;
  const selectedRiskExpressions = RISK_EXPRESSIONS.filter((item) => response.riskExpressions[item]);

  const update = (patch: Partial<CustomerCallPlanResponse>) => {
    setResponse({ ...response, ...patch, savedAt: new Date().toISOString() });
  };

  const updateFinalOutput = (key: keyof FinalCallPlan, value: string) => {
    update({ finalCallPlan: { ...response.finalCallPlan, [key]: value } });
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopyMessage('AI 콜플랜 프롬프트를 복사했습니다.');
    } catch {
      setCopyMessage('복사가 차단되었습니다. 프롬프트 영역을 직접 선택해 복사하세요.');
    }
  };

  return (
    <div className="space-y-4">
      <SafetyNotice />

      <SectionCard title="상황 제시: 2주 고객군 판단과 콜플랜 설계">
        <p className="text-sm leading-6 text-slate-700">
          이대호 팀장은 다음 2주 동안 영업2본부 수도권중부영업팀의 실행 초점을 정해야 합니다. 목표는 고객을 압박하는 것이 아니라,
          고객군별 반응 신호를 읽고 정보 제공 품질, 후속조치 속도, CRM 기록 기준을 높이는 것입니다.
        </p>
        <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-bold text-slate-900">오늘의 판단 과제</p>
          <p className="mt-1">어디에 집중할 것인가, 무엇을 줄일 것인가, 누구에게 어떤 역할을 맡길 것인가를 결정합니다.</p>
        </div>
      </SectionCard>

      <SectionCard title="판단 데이터: 고객군 A~D 반응 신호">
        <div className="grid gap-3 md:grid-cols-2">
          {CUSTOMER_SEGMENTS.map((segment) => (
            <article key={segment.id} className="rounded-2xl border bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-slate-900">{segment.name}</h4>
                <span className="rounded-full bg-cyan-100 px-2 py-1 text-xs font-bold text-cyan-800">{segment.id}군</span>
              </div>
              <dl className="mt-3 space-y-2 text-sm text-slate-700">
                <div><dt className="font-semibold">반응 신호</dt><dd>{segment.signal}</dd></div>
                <div><dt className="font-semibold">기회</dt><dd>{segment.opportunity}</dd></div>
                <div><dt className="font-semibold">리스크</dt><dd>{segment.risk}</dd></div>
                <div><dt className="font-semibold">주의점</dt><dd>{segment.caution}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="판단 데이터: 팀원별 실행 신호">
        <div className="grid gap-3 md:grid-cols-2">
          {TEAM_MEMBERS.map((member) => (
            <article key={member.name} className="rounded-2xl border p-4">
              <p className="font-bold text-slate-900">{member.name} <span className="text-xs text-slate-500">{member.role}</span></p>
              <p className="mt-2 text-sm text-slate-700">{member.signal}</p>
              <p className="mt-2 rounded-xl bg-cyan-50 p-2 text-xs text-cyan-900">추천 역할: {member.suggestedRole}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="리더의 1차 판단">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <FieldLabel>2주 집중 고객군</FieldLabel>
            <select className="w-full rounded-xl border px-3 py-2" value={response.selectedFocusSegment} onChange={(event) => update({ selectedFocusSegment: event.target.value })}>
              {CUSTOMER_SEGMENTS.map((segment) => <option key={segment.id} value={segment.id}>{segment.name}</option>)}
            </select>
          </label>
          <label className="space-y-1">
            <FieldLabel>제외 또는 후순위 고객군</FieldLabel>
            <select className="w-full rounded-xl border px-3 py-2" value={response.selectedDeprioritizedSegment} onChange={(event) => update({ selectedDeprioritizedSegment: event.target.value })}>
              {CUSTOMER_SEGMENTS.map((segment) => <option key={segment.id} value={segment.id}>{segment.name}</option>)}
            </select>
          </label>
        </div>
        <label className="block space-y-1">
          <FieldLabel>선택 이유</FieldLabel>
          <textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.segmentDecisionReason} onChange={(event) => update({ segmentDecisionReason: event.target.value })} placeholder="어떤 데이터 신호 때문에 이 고객군에 집중해야 한다고 판단했습니까?" />
        </label>
        <label className="block space-y-1">
          <FieldLabel>포기 비용과 리스크</FieldLabel>
          <textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.riskTradeoffMemo} onChange={(event) => update({ riskTradeoffMemo: event.target.value })} placeholder="후순위로 미루는 고객군에서 발생할 수 있는 비용과 관리 기준을 작성하세요." />
        </label>
      </SectionCard>

      <SectionCard title="팀원별 역할 배분">
        <div className="space-y-3">
          {TEAM_MEMBERS.map((member) => (
            <label key={member.name} className="block space-y-1 rounded-2xl border bg-slate-50 p-3">
              <FieldLabel>{member.name}</FieldLabel>
              <input
                className="w-full rounded-xl border px-3 py-2"
                value={response.memberRoles[member.name] ?? ''}
                onChange={(event) => update({ memberRoles: { ...response.memberRoles, [member.name]: event.target.value } })}
                placeholder={member.suggestedRole}
              />
            </label>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="AI 질문 생성: AI 콜플랜 프롬프트">
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
          value={response.pastedAiAnswer}
          onChange={(event) => update({ pastedAiAnswer: event.target.value })}
          placeholder="외부 AI가 생성한 콜플랜 초안을 여기에 붙여넣으세요. 실제 고객명·병원명·제품명·내부 수치가 포함되어 있으면 제거 후 붙여넣습니다."
        />
      </SectionCard>

      <SectionCard title="AI 답변 감별">
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

      <SectionCard title="컴플라이언스 위험 표현 제거">
        <p className="text-sm text-slate-600">AI 답변에 아래와 유사한 표현이 있으면 체크하고, 최종 산출물에서 제거하거나 완화합니다.</p>
        <div className="grid gap-2 md:grid-cols-2">
          {RISK_EXPRESSIONS.map((item) => (
            <label key={item} className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <input
                type="checkbox"
                className="mt-1"
                checked={Boolean(response.riskExpressions[item])}
                onChange={(event) => update({ riskExpressions: { ...response.riskExpressions, [item]: event.target.checked } })}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="현장형 수정">
        <textarea
          className="min-h-36 w-full rounded-xl border px-3 py-2"
          value={response.fieldRevisions}
          onChange={(event) => update({ fieldRevisions: event.target.value })}
          placeholder="AI 답변에서 현장에 맞지 않는 부분, 위험 표현, 실행 불가능한 제안을 어떻게 수정할지 작성하세요."
        />
      </SectionCard>

      <SectionCard title="최종 산출물: 2주 콜플랜">
        <div className="grid gap-3 md:grid-cols-2">
          {FINAL_OUTPUT_LABELS.map((item) => (
            <label key={item.key} className="block space-y-1">
              <FieldLabel>{item.title}</FieldLabel>
              <textarea
                className="min-h-28 w-full rounded-xl border px-3 py-2"
                value={response.finalCallPlan[item.key]}
                onChange={(event) => updateFinalOutput(item.key, event.target.value)}
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
            <p className="mt-1">집중: {getSegmentName(response.selectedFocusSegment)}</p>
            <p>후순위: {getSegmentName(response.selectedDeprioritizedSegment)}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-sm">
            <p className="font-bold text-slate-900">감별 요약</p>
            <p className="mt-1">체크된 감별 기준: {checkedReviewCount} / {REVIEW_ITEMS.length}</p>
            <p>위험 표현 표시: {selectedRiskExpressions.length}개</p>
          </div>
        </div>
        <div className="rounded-xl border bg-cyan-50 p-3 text-sm text-cyan-900">
          <p className="font-bold">강사용 토의 질문</p>
          <p className="mt-1">왜 {getSegmentName(response.selectedFocusSegment)}에 집중하고 {getSegmentName(response.selectedDeprioritizedSegment)}을 후순위로 두었습니까?</p>
          <p>AI 답변에서 그대로 사용하면 위험한 표현은 무엇이었습니까?</p>
          <p>팀원별 역할 배분은 실제 실행 신호와 연결되어 있습니까?</p>
        </div>
        <p className="text-xs text-slate-500">자동 저장 키: {V36_STORAGE_KEYS.customerCallPlan} / 마지막 저장: {response.savedAt || '아직 입력 전'}</p>
      </SectionCard>
    </div>
  );
}

export default CustomerCallPlanLab;
