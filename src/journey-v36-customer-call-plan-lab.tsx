import { useMemo, useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';
import { V36_STORAGE_KEYS } from './journey-v36-preview-config';

type CustomerGroup = {
  id: string;
  label: string;
  customerGrade: string;
  potentialGrade: string;
  relationshipLevel: string;
  lastVisit: string;
  callCount4w: number;
  contactSuccessRate: string;
  recentCallReaction: string;
  materialRequest: string;
  followUpMeeting: string;
  holdReason: string;
  followUpCompletion: string;
  crmQuality: string;
  complianceSensitivity: string;
  dataSignal: string;
  recommendedType: string;
};

type TeamMember = {
  name: string;
  role: string;
  signal: string;
  suggestedRole: string;
};

type AiOutputOption = {
  id: string;
  title: string;
  description: string;
  required?: boolean;
};

type CustomerCallPlanResponse = {
  groupClassifications: Record<string, string>;
  classificationReasons: Record<string, string>;
  selectedFocusType: string;
  selectedDeprioritizedType: string;
  decisionReason: string;
  riskTradeoffMemo: string;
  memberRoles: Record<string, string>;
  selectedAiOutputs: string[];
  pastedAiAnswer: string;
  aiOutputResults: Record<string, string>;
  riskExpressions: Record<string, boolean>;
  fieldRevisions: string;
  finalFocusDirection: string;
  finalOperatingPrinciples: string;
  finalMemberRoles: string;
  finalFollowUpStandards: string;
  finalAvoidActions: string;
  finalManagerMessage: string;
  savedAt: string;
};

const CUSTOMER_SEGMENTS = ['A군', 'B군', 'C군', 'D군'];
const CUSTOMER_TYPES = ['반응 상승 집중군', '관심 보류 관리군', '관계 유지군', '리스크 관리군', '데이터 보완군'];

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

const CUSTOMER_GROUPS: CustomerGroup[] = [
  {
    id: 'G1',
    label: '고객 묶음 1',
    customerGrade: 'A',
    potentialGrade: '높음',
    relationshipLevel: '중간',
    lastVisit: '7일 전',
    callCount4w: 2,
    contactSuccessRate: '80%',
    recentCallReaction: '긍정 상승',
    materialRequest: '근거자료 요청 있음',
    followUpMeeting: '동의',
    holdReason: '없음',
    followUpCompletion: '90%',
    crmQuality: '충실',
    complianceSensitivity: '중간',
    dataSignal: '반응 상승, 자료 요청, 후속 미팅 동의가 함께 나타나는 2주 집중 후보',
    recommendedType: '반응 상승 집중군',
  },
  {
    id: 'G2',
    label: '고객 묶음 2',
    customerGrade: 'A',
    potentialGrade: '높음',
    relationshipLevel: '높음',
    lastVisit: '20일 전',
    callCount4w: 1,
    contactSuccessRate: '60%',
    recentCallReaction: '관심 있으나 보류',
    materialRequest: '자료 요청 있음',
    followUpMeeting: '보류',
    holdReason: '기존 치료 유지 선호',
    followUpCompletion: '60%',
    crmQuality: '보통',
    complianceSensitivity: '낮음',
    dataSignal: '관심 신호는 있으나 후속 미팅이 보류되어 니즈 재확인이 필요한 고객군',
    recommendedType: '관심 보류 관리군',
  },
  {
    id: 'G3',
    label: '고객 묶음 3',
    customerGrade: 'B',
    potentialGrade: '중간',
    relationshipLevel: '높음',
    lastVisit: '10일 전',
    callCount4w: 2,
    contactSuccessRate: '90%',
    recentCallReaction: '안정적 유지',
    materialRequest: '없음',
    followUpMeeting: '없음',
    holdReason: '추가 필요성 낮음',
    followUpCompletion: '80%',
    crmQuality: '충실',
    complianceSensitivity: '낮음',
    dataSignal: '관계는 안정적이나 변화 신호는 낮아 유지 품질 관리가 적합한 고객군',
    recommendedType: '관계 유지군',
  },
  {
    id: 'G4',
    label: '고객 묶음 4',
    customerGrade: 'B',
    potentialGrade: '중간',
    relationshipLevel: '낮음',
    lastVisit: '5일 전',
    callCount4w: 4,
    contactSuccessRate: '40%',
    recentCallReaction: '무반응 증가',
    materialRequest: '없음',
    followUpMeeting: '없음',
    holdReason: '시간 부족·피로감 표현',
    followUpCompletion: '30%',
    crmQuality: '부족',
    complianceSensitivity: '높음',
    dataSignal: '접촉은 많지만 반응이 낮고 민감도가 높아 접근 빈도 조절이 필요한 고객군',
    recommendedType: '리스크 관리군',
  },
  {
    id: 'G5',
    label: '고객 묶음 5',
    customerGrade: 'A',
    potentialGrade: '높음',
    relationshipLevel: '낮음',
    lastVisit: '14일 전',
    callCount4w: 1,
    contactSuccessRate: '70%',
    recentCallReaction: '질문 증가',
    materialRequest: '자료 요청 있음',
    followUpMeeting: '동의',
    holdReason: '근거자료 확인 필요',
    followUpCompletion: '70%',
    crmQuality: '보통',
    complianceSensitivity: '높음',
    dataSignal: '기회 신호는 크지만 표현·자료 활용 안전선을 함께 관리해야 하는 고객군',
    recommendedType: '반응 상승 집중군',
  },
  {
    id: 'G6',
    label: '고객 묶음 6',
    customerGrade: 'C',
    potentialGrade: '낮음',
    relationshipLevel: '높음',
    lastVisit: '35일 전',
    callCount4w: 0,
    contactSuccessRate: '50%',
    recentCallReaction: '데이터 부족',
    materialRequest: '없음',
    followUpMeeting: '없음',
    holdReason: '정보 없음',
    followUpCompletion: '20%',
    crmQuality: '부족',
    complianceSensitivity: '중간',
    dataSignal: '반응 데이터와 CRM 기록이 부족해 당장 집중보다 정보 보완이 필요한 고객군',
    recommendedType: '데이터 보완군',
  },
];

const TEAM_MEMBERS: TeamMember[] = [
  { name: '신재영 대리', role: 'MR', signal: '활동량은 높지만 메시지 일관성이 약함', suggestedRole: '반응 상승 집중군의 콜 전 질문과 메시지 정리' },
  { name: '이대은 대리', role: 'MR', signal: '고객 반응은 있으나 후속조치 속도가 늦음', suggestedRole: '관심 보류 관리군의 후속 대화 리듬 회복' },
  { name: '박재욱 사원', role: 'MR', signal: '신규 접점 경험이 적고 질문 설계가 약함', suggestedRole: '콜 중 확인 질문 연습과 CRM 기록 보완' },
  { name: '유희관 과장', role: 'MR', signal: '기존 관계 관리는 안정적이나 변화 대응 속도가 낮음', suggestedRole: '관계 유지군의 접점 품질 개선' },
  { name: '김문호 차장', role: 'MR', signal: '경험은 많지만 CRM 기록 품질에 편차가 있음', suggestedRole: '데이터 보완군의 CRM 기록 기준 표준화' },
  { name: '김재호 차장', role: 'MR', signal: '전략 이해도는 높으나 팀 공유가 부족함', suggestedRole: '팀 회의 공유 문장과 하지 않을 행동 정리' },
];

const AI_OUTPUT_OPTIONS: AiOutputOption[] = [
  { id: 'customer-principles', title: '고객군별 접근 원칙', description: '분류된 고객군별 콜 전·중·후 접근 원칙 제안', required: true },
  { id: 'member-role-plan', title: '팀원별 역할 방향', description: '팀원 실행 신호와 고객군을 연결한 역할 방향 제안' },
  { id: 'call-prep-questions', title: '콜 전 준비 질문', description: '고객군별 콜 전 확인해야 할 질문 제안' },
  { id: 'during-call-questions', title: '콜 중 확인 질문', description: '고객 니즈와 후속 가능성을 확인할 질문 제안' },
  { id: 'follow-up-24h', title: '콜 후 24시간 후속조치', description: '자료 전달, CRM 기록, 다음 행동 제안', required: true },
  { id: 'crm-standards', title: 'CRM 기록 기준', description: '반응 신호, 요청자료, 다음 행동 기록 기준 제안' },
  { id: 'avoid-actions', title: '하지 않을 행동', description: '과잉 접촉, 압박, 위험 표현 등 줄일 행동 제안' },
  { id: 'compliance-language', title: '컴플라이언스 주의 표현', description: '주의해야 할 표현과 안전한 대체 표현 제안' },
  { id: 'manager-message', title: '팀장 회의 공유 문장', description: '팀 회의에서 바로 설명할 수 있는 문장 제안' },
];

function createDefaultClassifications() {
  return Object.fromEntries(CUSTOMER_GROUPS.map((group) => [group.id, '']));
}
function createDefaultReasons() {
  return Object.fromEntries(CUSTOMER_GROUPS.map((group) => [group.id, '']));
}
function createDefaultMemberRoles() {
  return Object.fromEntries(TEAM_MEMBERS.map((member) => [member.name, member.suggestedRole]));
}

const DEFAULT_RESPONSE: CustomerCallPlanResponse = {
  groupClassifications: createDefaultClassifications(),
  classificationReasons: createDefaultReasons(),
  selectedFocusType: '',
  selectedDeprioritizedType: '',
  decisionReason: '',
  riskTradeoffMemo: '',
  memberRoles: createDefaultMemberRoles(),
  selectedAiOutputs: ['customer-principles', 'follow-up-24h', 'avoid-actions'],
  pastedAiAnswer: '',
  aiOutputResults: {},
  riskExpressions: {},
  fieldRevisions: '',
  finalFocusDirection: '',
  finalOperatingPrinciples: '',
  finalMemberRoles: '',
  finalFollowUpStandards: '',
  finalAvoidActions: '',
  finalManagerMessage: '',
  savedAt: '',
};

function FieldLabel({ children }: { children: string }) {
  return <span className="text-xs font-bold text-slate-500">{children}</span>;
}
function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-2xl border bg-white p-5 shadow-sm"><h3 className="text-lg font-bold text-slate-900">{title}</h3><div className="mt-4 space-y-4">{children}</div></section>;
}
function DataPill({ label, value }: { label: string; value: ReactNode }) {
  return <div className="rounded-xl border bg-white px-3 py-2"><p className="text-[11px] font-black text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold text-slate-800">{value}</p></div>;
}
function toggle(items: string[], item: string) {
  return items.includes(item) ? items.filter((value) => value !== item) : [...items, item];
}
function selectedOutputOptions(ids: string[]) {
  return AI_OUTPUT_OPTIONS.filter((option) => ids.includes(option.id));
}
function outputStatus(count: number) {
  return count < 3 ? `${count}개 선택됨 · 3개 이상 권장` : `${count}개 선택됨 · 프롬프트 생성 가능`;
}
function summarizeGroupData(group: CustomerGroup) {
  return `${group.label}: 고객등급 ${group.customerGrade}, 잠재력 ${group.potentialGrade}, 관계 ${group.relationshipLevel}, 최근방문 ${group.lastVisit}, 4주 콜 ${group.callCount4w}회, 접촉성공률 ${group.contactSuccessRate}, 반응 ${group.recentCallReaction}, 자료요청 ${group.materialRequest}, 후속미팅 ${group.followUpMeeting}, 보류사유 ${group.holdReason}, 후속조치 ${group.followUpCompletion}, CRM ${group.crmQuality}, 컴플라이언스 ${group.complianceSensitivity}`;
}
function buildClassificationText(response: CustomerCallPlanResponse) {
  return CUSTOMER_GROUPS.map((group) => `- ${group.label}: ${response.groupClassifications[group.id] || '미분류'} / 이유: ${response.classificationReasons[group.id] || '미작성'} / 데이터: ${summarizeGroupData(group)}`).join('\n');
}
function parseAiAnswerByOutputs(raw: string, selectedIds: string[]) {
  const results: Record<string, string> = {};
  const selected = selectedOutputOptions(selectedIds);
  const lines = raw.split('\n');
  let currentId = '';
  lines.forEach((line) => {
    const matched = selected.find((option) => line.includes(`[${option.title}]`) || line.trim().startsWith(option.title));
    if (matched) {
      currentId = matched.id;
      results[currentId] = '';
      return;
    }
    if (currentId) results[currentId] = `${results[currentId] || ''}${line}\n`;
  });
  selected.forEach((option) => {
    results[option.id] = (results[option.id] || '').trim() || 'AI 답변에서 해당 항목을 명확히 찾지 못했습니다. 원문을 참고해 직접 정리하세요.';
  });
  return results;
}
function buildPrompt(response: CustomerCallPlanResponse) {
  const selectedOutputs = selectedOutputOptions(response.selectedAiOutputs);
  const memberRoleText = TEAM_MEMBERS.map((member) => `- ${member.name}: ${response.memberRoles[member.name] || member.suggestedRole}`).join('\n');
  return `너는 제약영업 팀장의 고객군 판단과 2주 콜플랜 설계를 돕는 리더십 코치입니다.\n\n[상황]\n나는 C1바이오 영업2본부 수도권중부영업팀장입니다. 실제 고객명·병원명은 사용하지 않고, 아래 교육용 고객 묶음 데이터를 기준으로 향후 2주 실행 방향을 정하려고 합니다.\n\n[기존 라벨 참고]\n기존 ${CUSTOMER_SEGMENTS.join('/')} 라벨을 먼저 사용하지 말고, 아래 고객 Data와 교육생의 분류 결과를 우선으로 판단하세요.\n\n[고객 묶음별 원천 Data]\n${CUSTOMER_GROUPS.map(summarizeGroupData).join('\n')}\n\n[교육생의 고객군 분류 결과]\n${buildClassificationText(response)}\n\n[집중/후순위 판단]\n- 2주 집중 고객군 유형: ${response.selectedFocusType || '미선택'}\n- 후순위 고객군 유형: ${response.selectedDeprioritizedType || '미선택'}\n- 선택 이유: ${response.decisionReason || '미작성'}\n- 포기 비용/리스크 관리 기준: ${response.riskTradeoffMemo || '미작성'}\n\n[팀원별 역할 방향]\n${memberRoleText}\n\n[요청 결과물]\n${selectedOutputs.map((item, index) => `${index + 1}. ${item.title}: ${item.description}`).join('\n') || '-'}\n\n작성 원칙:\n1. 선택된 고객군 분류와 집중/후순위 판단을 중심으로 작성하세요.\n2. 실제 고객명, 병원명, 의사명, 제품명, 내부 매출·처방 수치, 개인정보는 사용하지 마세요.\n3. 미승인 효능, 허가 외 사용, 제품 효과 단정, 고객 압박, 경쟁사 비방 표현은 사용하지 마세요.\n4. 고객군별 반응 데이터, 후속 가능성, CRM 기록, 컴플라이언스 민감도를 함께 고려하세요.\n5. 팀원별 실행 행동은 서로 다르게 제안하세요.\n6. 후속 단계인 실행행동 Map에서 더 세분화할 수 있도록 방향과 원칙 중심으로 작성하세요.\n\n출력 형식:\n${selectedOutputs.map((item) => `[${item.title}]\n- 내용을 작성하세요.`).join('\n\n')}`;
}
function getGroupsByType(response: CustomerCallPlanResponse, type: string) {
  return CUSTOMER_GROUPS.filter((group) => response.groupClassifications[group.id] === type).map((group) => group.label).join(', ') || '해당 고객 묶음 없음';
}
function checkedRiskExpressions(response: CustomerCallPlanResponse) {
  return RISK_EXPRESSIONS.filter((item) => response.riskExpressions[item]);
}
function makeCallPlanCard(response: CustomerCallPlanResponse) {
  return `[2주 콜플랜 카드]\n\n[집중 고객군 유형]\n${response.selectedFocusType || '미선택'}\n\n[집중 고객 묶음]\n${getGroupsByType(response, response.selectedFocusType)}\n\n[후순위 고객군 유형]\n${response.selectedDeprioritizedType || '미선택'}\n\n[후순위 고객 묶음]\n${getGroupsByType(response, response.selectedDeprioritizedType)}\n\n[판단 이유]\n${response.decisionReason || '미작성'}\n\n[포기 비용/리스크 관리]\n${response.riskTradeoffMemo || '미작성'}\n\n[2주 집중 방향]\n${response.finalFocusDirection || '미작성'}\n\n[고객군별 운영 원칙]\n${response.finalOperatingPrinciples || '미작성'}\n\n[팀원별 역할]\n${response.finalMemberRoles || '미작성'}\n\n[후속조치·CRM 기준]\n${response.finalFollowUpStandards || '미작성'}\n\n[하지 않을 행동/주의 표현]\n${response.finalAvoidActions || '미작성'}\n\n[팀장 회의 공유 문장]\n${response.finalManagerMessage || '미작성'}`;
}

export function CustomerCallPlanLab() {
  const [storedResponse, setResponse] = useStored<CustomerCallPlanResponse>(V36_STORAGE_KEYS.customerCallPlan, DEFAULT_RESPONSE);
  const response = {
    ...DEFAULT_RESPONSE,
    ...storedResponse,
    groupClassifications: { ...createDefaultClassifications(), ...(storedResponse.groupClassifications ?? {}) },
    classificationReasons: { ...createDefaultReasons(), ...(storedResponse.classificationReasons ?? {}) },
    memberRoles: { ...createDefaultMemberRoles(), ...(storedResponse.memberRoles ?? {}) },
    selectedAiOutputs: storedResponse.selectedAiOutputs ?? DEFAULT_RESPONSE.selectedAiOutputs,
    aiOutputResults: storedResponse.aiOutputResults ?? {},
    riskExpressions: storedResponse.riskExpressions ?? {},
  };
  const [copyMessage, setCopyMessage] = useState('');
  const prompt = useMemo(() => buildPrompt(response), [response]);
  const selectedOutputs = selectedOutputOptions(response.selectedAiOutputs);
  const completedClassifications = CUSTOMER_GROUPS.filter((group) => response.groupClassifications[group.id]).length;
  const selectedRisks = checkedRiskExpressions(response);
  const callPlanCard = useMemo(() => makeCallPlanCard(response), [response]);
  const cardReady = Boolean(response.selectedFocusType && response.selectedDeprioritizedType && response.finalFocusDirection && response.finalOperatingPrinciples && response.finalManagerMessage);

  const update = (patch: Partial<CustomerCallPlanResponse>) => setResponse({ ...response, ...patch, savedAt: new Date().toISOString() });
  const updateClassification = (groupId: string, value: string) => update({ groupClassifications: { ...response.groupClassifications, [groupId]: value } });
  const updateReason = (groupId: string, value: string) => update({ classificationReasons: { ...response.classificationReasons, [groupId]: value } });
  const copyPrompt = async () => {
    if (completedClassifications < CUSTOMER_GROUPS.length) {
      setCopyMessage('먼저 고객 묶음 1~6을 모두 분류하세요.');
      return;
    }
    if (!response.selectedFocusType || !response.selectedDeprioritizedType) {
      setCopyMessage('집중 고객군과 후순위 고객군을 선택하세요.');
      return;
    }
    if (response.selectedAiOutputs.length < 3) {
      setCopyMessage('AI에 요청할 결과물을 3개 이상 선택하세요.');
      return;
    }
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyMessage('데이터 기반 고객군 판단 프롬프트를 복사했습니다.');
    } catch {
      setCopyMessage('복사가 차단되었습니다. 프롬프트 영역을 직접 선택해 복사하세요.');
    }
  };
  const parseAi = () => update({ aiOutputResults: parseAiAnswerByOutputs(response.pastedAiAnswer, response.selectedAiOutputs) });
  const copyCard = async () => {
    if (!cardReady) {
      setCopyMessage('2주 콜플랜 카드의 핵심 항목을 먼저 작성하세요.');
      return;
    }
    try {
      await navigator.clipboard.writeText(callPlanCard);
      setCopyMessage('2주 콜플랜 카드를 복사했습니다.');
    } catch {
      setCopyMessage('복사가 차단되었습니다. 카드 내용을 직접 선택해 복사하세요.');
    }
  };

  return <div className="space-y-4">
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="font-bold">제약영업 AI 안전선</p>
      <p className="mt-1">이번 실습은 가상 고객 Data를 사용합니다. 다만 실제 고객명, 병원명, 의사명, 내부 매출·처방 수치, 개인정보를 AI에 입력하지 않는 원칙은 유지합니다.</p>
    </div>

    <SectionCard title="상황 제시: 고객 Data를 보고 2주 콜플랜 방향 정하기">
      <p className="text-sm leading-6 text-slate-700">이대호 팀장은 앱이 미리 정해준 고객군을 고르는 것이 아니라, 고객 묶음별 CRM·콜 리포트 데이터를 읽고 직접 고객군을 분류해야 합니다. 분류 결과를 바탕으로 2주 동안 어디에 집중하고 무엇을 줄일지 판단합니다.</p>
      <div className="rounded-xl bg-cyan-50 p-4 text-sm text-cyan-900"><p className="font-bold">오늘의 판단 과제</p><p className="mt-1">고객 Data → 고객군 분류 → 집중/후순위 판단 → AI 결과물 요청 → 최종 산출물: 2주 콜플랜</p></div>
    </SectionCard>

    <SectionCard title="1단계: 고객 묶음별 현업형 Data 읽기">
      <div className="grid gap-3">{CUSTOMER_GROUPS.map((group) => <article key={group.id} className="rounded-2xl border bg-slate-50 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><h4 className="font-black text-slate-900">{group.label}</h4><span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600">추천 예시: {group.recommendedType}</span></div><p className="mt-2 text-sm leading-6 text-slate-700">{group.dataSignal}</p><div className="mt-3 grid gap-2 md:grid-cols-4"><DataPill label="고객 등급" value={group.customerGrade} /><DataPill label="잠재력" value={group.potentialGrade} /><DataPill label="관계 수준" value={group.relationshipLevel} /><DataPill label="최근 방문일" value={group.lastVisit} /><DataPill label="4주 콜 횟수" value={`${group.callCount4w}회`} /><DataPill label="접촉 성공률" value={group.contactSuccessRate} /><DataPill label="최근 콜 반응" value={group.recentCallReaction} /><DataPill label="자료 요청" value={group.materialRequest} /><DataPill label="후속 미팅" value={group.followUpMeeting} /><DataPill label="거절/보류 사유" value={group.holdReason} /><DataPill label="후속조치 완료율" value={group.followUpCompletion} /><DataPill label="CRM 기록" value={group.crmQuality} /><DataPill label="컴플라이언스" value={group.complianceSensitivity} /></div></article>)}</div>
    </SectionCard>

    <SectionCard title="2단계: 고객군 직접 분류하기">
      <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">각 고객 묶음을 데이터 근거로 분류하세요. 추천 예시는 참고용이며, 현장 판단에 따라 다르게 분류할 수 있습니다.</div>
      <div className="space-y-3">{CUSTOMER_GROUPS.map((group) => <div key={group.id} className="rounded-2xl border p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-black text-slate-900">{group.label}</p><span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800">{group.dataSignal}</span></div><div className="mt-3 grid gap-3 md:grid-cols-2"><label className="space-y-1"><FieldLabel>분류 유형</FieldLabel><select className="w-full rounded-xl border px-3 py-2" value={response.groupClassifications[group.id] || ''} onChange={(event) => updateClassification(group.id, event.target.value)}><option value="">선택하세요</option>{CUSTOMER_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}</select></label><label className="space-y-1"><FieldLabel>분류 이유</FieldLabel><input className="w-full rounded-xl border px-3 py-2" value={response.classificationReasons[group.id] || ''} onChange={(event) => updateReason(group.id, event.target.value)} placeholder="예: 반응 상승과 후속 미팅 동의가 있어 집중군으로 판단" /></label></div></div>)}</div>
      <p className="text-sm font-bold text-cyan-700">분류 완료: {completedClassifications} / {CUSTOMER_GROUPS.length}</p>
    </SectionCard>

    <SectionCard title="3단계: 집중/후순위 고객군 판단하기">
      <div className="grid gap-3 md:grid-cols-2"><label className="space-y-1"><FieldLabel>2주 집중 고객군 유형</FieldLabel><select className="w-full rounded-xl border px-3 py-2" value={response.selectedFocusType} onChange={(event) => update({ selectedFocusType: event.target.value })}><option value="">선택하세요</option>{CUSTOMER_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}</select></label><label className="space-y-1"><FieldLabel>후순위 고객군 유형</FieldLabel><select className="w-full rounded-xl border px-3 py-2" value={response.selectedDeprioritizedType} onChange={(event) => update({ selectedDeprioritizedType: event.target.value })}><option value="">선택하세요</option>{CUSTOMER_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}</select></label></div>
      <div className="grid gap-3 md:grid-cols-2"><div className="rounded-xl bg-cyan-50 p-3 text-sm text-cyan-900"><b>집중 고객 묶음:</b> {getGroupsByType(response, response.selectedFocusType)}</div><div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900"><b>후순위 고객 묶음:</b> {getGroupsByType(response, response.selectedDeprioritizedType)}</div></div>
      <label className="block space-y-1"><FieldLabel>선택 이유</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.decisionReason} onChange={(event) => update({ decisionReason: event.target.value })} placeholder="어떤 Data 때문에 이 고객군을 2주 집중 대상으로 보았습니까?" /></label>
      <label className="block space-y-1"><FieldLabel>포기 비용과 리스크 관리 기준</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.riskTradeoffMemo} onChange={(event) => update({ riskTradeoffMemo: event.target.value })} placeholder="후순위로 미루는 고객군에서 발생할 수 있는 비용과 관리 기준을 작성하세요." /></label>
    </SectionCard>

    <SectionCard title="4단계: 팀원별 역할 방향 정하기">
      <div className="space-y-3">{TEAM_MEMBERS.map((member) => <label key={member.name} className="block space-y-1 rounded-2xl border bg-slate-50 p-3"><FieldLabel>{member.name} · {member.role}</FieldLabel><p className="text-sm text-slate-600">{member.signal}</p><input className="mt-2 w-full rounded-xl border px-3 py-2" value={response.memberRoles[member.name] ?? ''} onChange={(event) => update({ memberRoles: { ...response.memberRoles, [member.name]: event.target.value } })} placeholder={member.suggestedRole} /></label>)}</div>
    </SectionCard>

    <SectionCard title="5단계: AI 콜플랜 결과물 요청하기">
      <div className="rounded-xl bg-cyan-50 p-3 text-sm text-cyan-900">AI에 요청할 결과물을 3개 이상 선택하세요. 선택한 결과물만 프롬프트와 자동 분리 항목에 반영됩니다.</div>
      <div className="flex justify-end"><span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-800">{outputStatus(response.selectedAiOutputs.length)}</span></div>
      <div className="grid gap-3 md:grid-cols-3">{AI_OUTPUT_OPTIONS.map((option) => <button type="button" key={option.id} onClick={() => update({ selectedAiOutputs: toggle(response.selectedAiOutputs, option.id), aiOutputResults: {} })} className={`rounded-2xl border p-4 text-left ${response.selectedAiOutputs.includes(option.id) ? 'border-cyan-600 bg-cyan-50 ring-2 ring-cyan-300' : 'bg-white'}`}><div className="flex items-start justify-between gap-2"><p className="font-black text-slate-900">{option.title}</p><span className={`rounded-full px-2 py-1 text-xs font-black ${response.selectedAiOutputs.includes(option.id) ? 'bg-cyan-700 text-white' : 'bg-slate-100 text-slate-500'}`}>{response.selectedAiOutputs.includes(option.id) ? '✓ 선택됨' : '선택'}</span></div><p className="mt-2 text-sm leading-6 text-slate-600">{option.description}</p></button>)}</div>
      <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm text-slate-600">고객 Data, 분류 결과, 집중/후순위 판단, 팀원 역할이 프롬프트에 반영됩니다.</p><button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={copyPrompt}>프롬프트 복사</button></div>
      {copyMessage ? <p className="text-sm font-semibold text-cyan-700">{copyMessage}</p> : null}
      <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{prompt}</pre>
      <label className="block space-y-1"><FieldLabel>AI 답변 붙여넣기</FieldLabel><textarea className="min-h-40 w-full rounded-xl border px-3 py-2" value={response.pastedAiAnswer} onChange={(event) => update({ pastedAiAnswer: event.target.value })} placeholder="외부 AI가 생성한 답변을 여기에 붙여넣으세요." /></label>
      <button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={parseAi}>선택 결과물 기준으로 자동 분리</button>
      <div className="grid gap-3 md:grid-cols-2">{selectedOutputs.map((option) => <div key={option.id} className="rounded-xl border bg-white p-3 text-sm"><p className="font-black text-slate-900">{option.title}</p><p className="mt-2 whitespace-pre-wrap leading-6 text-slate-700">{response.aiOutputResults[option.id] || '아직 정리된 내용이 없습니다.'}</p></div>)}</div>
    </SectionCard>

    <SectionCard title="컴플라이언스 위험 표현 제거">
      <p className="text-sm text-slate-600">AI 답변에 아래와 유사한 표현이 있으면 체크하고, 최종 콜플랜에서 제거하거나 안전한 표현으로 완화합니다.</p>
      <div className="grid gap-2 md:grid-cols-2">{RISK_EXPRESSIONS.map((item) => <label key={item} className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"><input type="checkbox" className="mt-1" checked={Boolean(response.riskExpressions[item])} onChange={(event) => update({ riskExpressions: { ...response.riskExpressions, [item]: event.target.checked } })} /><span>{item}</span></label>)}</div>
      <label className="block space-y-1"><FieldLabel>현장형 수정 메모</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.fieldRevisions} onChange={(event) => update({ fieldRevisions: event.target.value })} placeholder="AI 답변에서 현장에 맞지 않는 부분이나 위험 표현을 어떻게 수정할지 작성하세요." /></label>
    </SectionCard>

    <SectionCard title="최종 산출물: 2주 콜플랜">
      <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">AI 결과물은 참고자료입니다. 후속 실행행동 Map에서 세부 행동으로 나눌 수 있도록 방향과 원칙 중심으로 정리합니다.</div>
      <div className="grid gap-3 md:grid-cols-2"><label className="space-y-1"><FieldLabel>2주 집중 방향</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.finalFocusDirection} onChange={(event) => update({ finalFocusDirection: event.target.value })} /></label><label className="space-y-1"><FieldLabel>고객군별 운영 원칙</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.finalOperatingPrinciples} onChange={(event) => update({ finalOperatingPrinciples: event.target.value })} /></label><label className="space-y-1"><FieldLabel>팀원별 역할</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.finalMemberRoles} onChange={(event) => update({ finalMemberRoles: event.target.value })} /></label><label className="space-y-1"><FieldLabel>후속조치·CRM 기준</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.finalFollowUpStandards} onChange={(event) => update({ finalFollowUpStandards: event.target.value })} /></label><label className="space-y-1"><FieldLabel>하지 않을 행동/주의 표현</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.finalAvoidActions} onChange={(event) => update({ finalAvoidActions: event.target.value })} /></label><label className="space-y-1"><FieldLabel>팀장 회의 공유 문장</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.finalManagerMessage} onChange={(event) => update({ finalManagerMessage: event.target.value })} /></label></div>
      <button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={copyCard}>2주 콜플랜 카드 복사</button>
      <pre className="whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{callPlanCard}</pre>
    </SectionCard>

    <SectionCard title="강사용 토의 질문">
      <div className="grid gap-3 md:grid-cols-2"><div className="rounded-xl bg-slate-50 p-3 text-sm"><p className="font-bold text-slate-900">분류 토의</p><p className="mt-1">왜 같은 데이터를 보고도 고객군 분류가 달라질 수 있습니까?</p><p>기존 {CUSTOMER_SEGMENTS.join('/')} 라벨보다 데이터 기반 분류가 더 나은 지점은 무엇입니까?</p></div><div className="rounded-xl bg-slate-50 p-3 text-sm"><p className="font-bold text-slate-900">감별 요약</p><p className="mt-1">선택한 위험 표현: {selectedRisks.length}개</p><p>AI 답변에서 그대로 사용하면 위험한 표현은 무엇이었습니까?</p></div></div>
      <p className="text-xs text-slate-500">자동 저장 키: {V36_STORAGE_KEYS.customerCallPlan} / 마지막 저장: {response.savedAt || '아직 입력 전'}</p>
    </SectionCard>
  </div>;
}

export default CustomerCallPlanLab;
