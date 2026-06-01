import { useMemo, useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';
import { V36_STORAGE_KEYS } from './journey-v36-preview-config';

type MetricGroup = '기회 만들기' | '실행 품질' | '고객 반응' | '팀 학습' | '안전선 점검';

type Member = {
  id: string;
  name: string;
  type: string;
  signal: string;
  comment: string;
  metrics: Record<string, number>;
  guardrails: Record<string, '안전' | '주의' | '점검 필요'>;
};

type MetricMeta = {
  group: MetricGroup;
  expertLabel: '선행변수' | '과정변수' | '결과변수' | '확산변수' | '가드레일';
  description: string;
  interpretation: string;
};

type DashboardResponse = {
  selectedMemberId: string;
  intuitionJudgment: string;
  selectedLeadVariables: string[];
  selectedProcessVariables: string[];
  selectedResultVariables: string[];
  selectedDiffusionVariables: string[];
  selectedGuardrails: string[];
  diagnosisType: string;
  reasonOneLine: string;
  diagnosisStatement: string;
  selectedExperiments: string[];
  selectedCheckMetrics: string[];
  aiAnswerRaw: string;
  aiRationale: string;
  aiCounter: string;
  aiQuestions: string;
  aiExperiment: string;
  aiCaution: string;
  confirmQuestion: string;
  finalActionSentence: string;
  reviewChecks: Record<string, boolean>;
  savedAt: string;
};

const CORE_METRIC_ORDER = [
  '계획 접점 실행률',
  '핵심 고객군 커버리지',
  '사전 인사이트 준비도',
  '메시지-니즈 적합도',
  'CRM 기록 품질',
  '후속조치 실행률',
  '실행 적시성',
  '고객 인게이지먼트 지수',
  '후속 대화 연결지수',
  '고객 대화 지속성',
  '팀 학습 기여도',
  '실행 인사이트 재사용도',
];

const GUARDRAIL_ORDER = ['컴플라이언스 위험 점검', 'AI 입력 안전 점검'];
const ALL_METRIC_ORDER = [...CORE_METRIC_ORDER, ...GUARDRAIL_ORDER];

const INTUITION_OPTIONS = [
  '활동 기회 부족',
  '실행 품질 문제',
  '메시지-니즈 불일치',
  '후속 대화 연결 약화',
  '고객 대화 지속성 약화',
  '개인플레이와 팀 학습 단절',
  '안전선 우선 점검 필요',
  '판단 유보',
];

const METRIC_META: Record<string, MetricMeta> = {
  '계획 접점 실행률': {
    group: '기회 만들기',
    expertLabel: '선행변수',
    description: '우선순위 고객군에 대해 사전에 계획한 접점을 실제로 실행한 정도',
    interpretation: '성과 가능성을 만드는 활동 기회가 충분한지 봅니다.',
  },
  '핵심 고객군 커버리지': {
    group: '기회 만들기',
    expertLabel: '선행변수',
    description: '우선순위 고객군을 계획 기준에 맞게 균형 있게 접촉한 정도',
    interpretation: '특정 고객군에 치우치지 않고 전략적 접점이 유지되는지 봅니다.',
  },
  '사전 인사이트 준비도': {
    group: '기회 만들기',
    expertLabel: '선행변수',
    description: '방문 전 고객 상황, 이전 반응, 정보 니즈, 대화 목적을 준비한 정도',
    interpretation: '많이 만나는가보다 목적 있게 만나는가를 봅니다.',
  },
  '메시지-니즈 적합도': {
    group: '실행 품질',
    expertLabel: '과정변수',
    description: '고객의 정보 니즈와 허가된 메시지 범위에 맞게 근거 기반 메시지를 전달한 정도',
    interpretation: '고객에게 맞는 대화를 하고 있는지 확인합니다.',
  },
  'CRM 기록 품질': {
    group: '실행 품질',
    expertLabel: '과정변수',
    description: '고객 상황, 반응, 이슈, 다음 행동이 후속 판단 가능하도록 기록된 정도',
    interpretation: '기록량이 아니라 다음 실행을 판단할 수 있는 기록인지 봅니다.',
  },
  '후속조치 실행률': {
    group: '실행 품질',
    expertLabel: '과정변수',
    description: '고객 접점 이후 약속되거나 필요한 다음 행동을 실행한 정도',
    interpretation: '방문이 실제 다음 행동으로 이어지는지 봅니다.',
  },
  '실행 적시성': {
    group: '실행 품질',
    expertLabel: '과정변수',
    description: '계획된 실행과 후속조치가 지연 없이 적시에 이루어진 정도',
    interpretation: '실행 리듬이 끊기거나 늦어지지 않는지 봅니다.',
  },
  '고객 인게이지먼트 지수': {
    group: '고객 반응',
    expertLabel: '결과변수',
    description: '고객이 질문, 관심, 자료 요청, 추가 논의 등으로 대화에 참여한 정도',
    interpretation: '고객이 대화 안으로 들어오고 있는지 봅니다.',
  },
  '후속 대화 연결지수': {
    group: '고객 반응',
    expertLabel: '결과변수',
    description: '고객 반응이 후속 설명, 추가 자료 요청, 다음 미팅 등 다음 대화로 연결된 정도',
    interpretation: '성과 압박이 아니라 다음 대화의 연결 신호를 봅니다.',
  },
  '고객 대화 지속성': {
    group: '고객 반응',
    expertLabel: '결과변수',
    description: '고객이 반복 대화, 피드백 제공, 추가 질문, 후속 접점 수락 등으로 대화를 지속한 정도',
    interpretation: '관계 신뢰를 추상적으로 보지 않고 행동 신호로 봅니다.',
  },
  '팀 학습 기여도': {
    group: '팀 학습',
    expertLabel: '확산변수',
    description: '개인의 실행 경험을 팀 회의, 사례 공유, 개선 아이디어로 전환한 정도',
    interpretation: '개인 경험이 팀의 재사용 가능한 학습으로 바뀌는지 봅니다.',
  },
  '실행 인사이트 재사용도': {
    group: '팀 학습',
    expertLabel: '확산변수',
    description: '한 팀원의 성공·실패 사례가 다른 팀원의 실행 개선에 활용된 정도',
    interpretation: '공유에서 끝나지 않고 실제 실행에 재사용되는지 봅니다.',
  },
  '컴플라이언스 위험 점검': {
    group: '안전선 점검',
    expertLabel: '가드레일',
    description: '고객 커뮤니케이션, 자료 활용, AI 생성 문장에 규정상 위험 표현이 없는지 점검한 상태',
    interpretation: '성과보다 먼저 확인해야 하는 안전 기준입니다.',
  },
  'AI 입력 안전 점검': {
    group: '안전선 점검',
    expertLabel: '가드레일',
    description: 'AI 사용 과정에서 고객명, 병원명, 내부 전략, 민감 수치 등을 입력하지 않았는지 점검한 상태',
    interpretation: 'AI 활용 전후에 반드시 확인해야 하는 정보보안 기준입니다.',
  },
};

const MEMBERS: Member[] = [
  {
    id: 'M01',
    name: '신재영 대리',
    type: '활동량 과다·후속 대화 연결 약화형',
    signal: '계획 접점 실행률은 높지만 메시지-니즈 적합도와 후속조치 실행률이 낮다. 활동량보다 접점 목적, 메시지 품질, 후속 대화 연결을 점검해야 한다.',
    comment: '저는 누구보다 많이 움직이고 있습니다.',
    metrics: { '계획 접점 실행률': 112, '핵심 고객군 커버리지': 96, '사전 인사이트 준비도': 62, '메시지-니즈 적합도': 58, 'CRM 기록 품질': 64, '후속조치 실행률': 58, '실행 적시성': 68, '고객 인게이지먼트 지수': 62, '후속 대화 연결지수': 54, '고객 대화 지속성': 57, '팀 학습 기여도': 61, '실행 인사이트 재사용도': 52 },
    guardrails: { '컴플라이언스 위험 점검': '주의', 'AI 입력 안전 점검': '안전' },
  },
  {
    id: 'M02',
    name: '이대은 대리',
    type: '고성과 개인플레이·팀 학습 단절형',
    signal: '고객 반응과 후속 대화 연결은 높지만 팀 학습 기여도와 실행 인사이트 재사용도가 낮다. 개인 성과 인정과 팀 확산 요청의 균형이 필요하다.',
    comment: '각자 자기 담당처는 본인이 책임지는 게 맞지 않나요?',
    metrics: { '계획 접점 실행률': 91, '핵심 고객군 커버리지': 88, '사전 인사이트 준비도': 82, '메시지-니즈 적합도': 86, 'CRM 기록 품질': 72, '후속조치 실행률': 74, '실행 적시성': 81, '고객 인게이지먼트 지수': 84, '후속 대화 연결지수': 128, '고객 대화 지속성': 88, '팀 학습 기여도': 42, '실행 인사이트 재사용도': 38 },
    guardrails: { '컴플라이언스 위험 점검': '안전', 'AI 입력 안전 점검': '안전' },
  },
  {
    id: 'M03',
    name: '박재욱 사원',
    type: '신입 위축·사전 준비 부족형',
    signal: 'CRM 기록 품질은 높지만 계획 접점 실행률, 사전 인사이트 준비도, 고객 인게이지먼트가 낮다. 자신감 부족보다 접점 전 준비와 질문 설계 지원이 필요하다.',
    comment: '제가 가면 오히려 불편해하시는 것 같습니다.',
    metrics: { '계획 접점 실행률': 72, '핵심 고객군 커버리지': 69, '사전 인사이트 준비도': 54, '메시지-니즈 적합도': 57, 'CRM 기록 품질': 90, '후속조치 실행률': 67, '실행 적시성': 76, '고객 인게이지먼트 지수': 51, '후속 대화 연결지수': 48, '고객 대화 지속성': 50, '팀 학습 기여도': 70, '실행 인사이트 재사용도': 63 },
    guardrails: { '컴플라이언스 위험 점검': '안전', 'AI 입력 안전 점검': '안전' },
  },
  {
    id: 'M04',
    name: '유희관 과장',
    type: '경력 안정·변화 요구 저항형',
    signal: '고객 대화 지속성은 안정적이나 CRM 기록 품질, 메시지-니즈 적합도, 실행 인사이트 재사용도가 낮다. 변화 요구를 현장 언어로 연결해야 한다.',
    comment: '현장에서는 그런 방식이 잘 안 맞습니다.',
    metrics: { '계획 접점 실행률': 86, '핵심 고객군 커버리지': 92, '사전 인사이트 준비도': 78, '메시지-니즈 적합도': 61, 'CRM 기록 품질': 55, '후속조치 실행률': 63, '실행 적시성': 64, '고객 인게이지먼트 지수': 76, '후속 대화 연결지수': 82, '고객 대화 지속성': 86, '팀 학습 기여도': 58, '실행 인사이트 재사용도': 45 },
    guardrails: { '컴플라이언스 위험 점검': '주의', 'AI 입력 안전 점검': '안전' },
  },
  {
    id: 'M05',
    name: '김문호 차장',
    type: '방어적 목표미달·원인 외부화형',
    signal: '기회 만들기와 실행 품질, 고객 반응 지표가 전반적으로 낮다. 외부 요인 탓으로 단정하기보다 데이터 기반 공동 진단이 필요하다.',
    comment: '이번 지역 상황은 제가 어떻게 할 수 있는 게 아닙니다.',
    metrics: { '계획 접점 실행률': 79, '핵심 고객군 커버리지': 75, '사전 인사이트 준비도': 63, '메시지-니즈 적합도': 60, 'CRM 기록 품질': 68, '후속조치 실행률': 61, '실행 적시성': 52, '고객 인게이지먼트 지수': 60, '후속 대화 연결지수': 68, '고객 대화 지속성': 59, '팀 학습 기여도': 55, '실행 인사이트 재사용도': 50 },
    guardrails: { '컴플라이언스 위험 점검': '안전', 'AI 입력 안전 점검': '주의' },
  },
  {
    id: 'M06',
    name: '김재호 차장',
    type: '실행 적시성·CRM 기록 품질 저하형',
    signal: '계획 접점은 유지되지만 CRM 기록 품질, 후속조치 실행률, 실행 적시성이 낮다. 완료 기준과 사후보고 기준을 명확히 해야 한다.',
    comment: '현장 대응하느라 입력은 나중에 하게 됩니다.',
    metrics: { '계획 접점 실행률': 93, '핵심 고객군 커버리지': 81, '사전 인사이트 준비도': 74, '메시지-니즈 적합도': 69, 'CRM 기록 품질': 41, '후속조치 실행률': 45, '실행 적시성': 48, '고객 인게이지먼트 지수': 69, '후속 대화 연결지수': 73, '고객 대화 지속성': 71, '팀 학습 기여도': 62, '실행 인사이트 재사용도': 56 },
    guardrails: { '컴플라이언스 위험 점검': '안전', 'AI 입력 안전 점검': '점검 필요' },
  },
];

const DIAGNOSIS_TYPES = [
  '기회 부족형: 고객 접점 기회가 충분하지 않다',
  '준비 부족형: 접점 전 고객 인사이트와 질문 설계가 약하다',
  '실행 품질 저하형: 만나고는 있지만 메시지와 후속 실행 품질이 약하다',
  '후속 대화 연결 약화형: 고객 반응이 다음 대화로 이어지지 않는다',
  '고객 대화 지속성 약화형: 관계가 반복 대화와 피드백으로 이어지지 않는다',
  '팀 학습 단절형: 개인 실행 경험이 팀 학습과 재사용으로 확산되지 않는다',
  '안전선 우선 점검형: 컴플라이언스 또는 AI 입력 안전을 먼저 확인해야 한다',
  '판단 유보형: 현재 데이터만으로는 단정하기 어렵고 추가 확인이 필요하다',
];

const EXPERIMENT_OPTIONS = [
  '콜 전 고객별 질문 2개와 대화 목적 1개 준비',
  '핵심 고객군별 방문 목적과 우선순위 재정리',
  '고객 니즈에 맞춘 안전 메시지 2문장 재작성',
  '콜 이후 24시간 내 CRM에 고객 반응과 다음 행동 기록',
  '고객 반응별 후속조치 1개 지정',
  '2주 동안 후속 대화 연결 시도 기록',
  '선배/동료와 콜 리뷰 1회 진행',
  '성공·실패 인사이트 1개를 팀 회의에서 공유',
  'AI 입력 전 고객명·병원명·민감정보 제거 체크',
];

const CHECK_METRIC_OPTIONS = [
  '메시지-니즈 적합도',
  'CRM 기록 품질',
  '후속조치 실행률',
  '고객 인게이지먼트 지수',
  '후속 대화 연결지수',
  '고객 대화 지속성',
  '팀 학습 기여도',
  '컴플라이언스 위험 점검',
  'AI 입력 안전 점검',
  '팀원 1on1 대화 내용',
];

const REVIEW_ITEMS = [
  '기회 만들기 지표를 확인했는가?',
  '실행 품질 지표를 확인했는가?',
  '고객 반응 지표를 확인했는가?',
  '팀 학습 지표를 확인했는가?',
  '안전선 점검을 별도로 확인했는가?',
  '인과 진단문을 생성하고 수정했는가?',
  '2주 동안 실행할 실험을 2개 이내로 정했는가?',
  'AI로 반대 가능성과 확인 질문을 점검했는가?',
];

const DEFAULT_RESPONSE: DashboardResponse = {
  selectedMemberId: 'M01',
  intuitionJudgment: '',
  selectedLeadVariables: [],
  selectedProcessVariables: [],
  selectedResultVariables: [],
  selectedDiffusionVariables: [],
  selectedGuardrails: [],
  diagnosisType: '',
  reasonOneLine: '',
  diagnosisStatement: '',
  selectedExperiments: [],
  selectedCheckMetrics: [],
  aiAnswerRaw: '',
  aiRationale: '',
  aiCounter: '',
  aiQuestions: '',
  aiExperiment: '',
  aiCaution: '',
  confirmQuestion: '',
  finalActionSentence: '',
  reviewChecks: {},
  savedAt: '',
};

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-2xl border bg-white p-5 shadow-sm"><h3 className="text-lg font-bold text-slate-900">{title}</h3><div className="mt-4 space-y-4">{children}</div></section>;
}

function FieldLabel({ children }: { children: string }) {
  return <span className="text-xs font-bold text-slate-500">{children}</span>;
}

function getMember(id: string) {
  return MEMBERS.find((member) => member.id === id) ?? MEMBERS[0];
}

function toggle(items: string[], item: string) {
  return items.includes(item) ? items.filter((value) => value !== item) : [...items, item];
}

function metricTone(value: number, key: string) {
  const group = METRIC_META[key]?.group;
  if (group === '안전선 점검') return 'border-slate-200 bg-slate-50';
  if (value >= 85) return 'border-cyan-200 bg-cyan-50';
  if (value >= 70) return 'border-amber-200 bg-amber-50';
  return 'border-red-200 bg-red-50';
}

function guardrailTone(status: '안전' | '주의' | '점검 필요') {
  if (status === '안전') return 'border-cyan-200 bg-cyan-50 text-cyan-800';
  if (status === '주의') return 'border-amber-200 bg-amber-50 text-amber-800';
  return 'border-red-200 bg-red-50 text-red-800';
}

function groupTone(group: MetricGroup) {
  if (group === '기회 만들기') return 'bg-blue-50 text-blue-700 border-blue-100';
  if (group === '실행 품질') return 'bg-amber-50 text-amber-700 border-amber-100';
  if (group === '고객 반응') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  if (group === '팀 학습') return 'bg-purple-50 text-purple-700 border-purple-100';
  return 'bg-rose-50 text-rose-700 border-rose-100';
}

function metricOptions(group: MetricGroup) {
  return CORE_METRIC_ORDER.filter((key) => METRIC_META[key].group === group);
}

function listOrNone(items: string[], noneText = '큰 문제 없음') {
  return items.length ? items.join(', ') : noneText;
}

function makeDiagnosisStatement(member: Member, response: DashboardResponse) {
  const lead = listOrNone(response.selectedLeadVariables, '기회 만들기 지표는 큰 문제 없어 보이지만');
  const process = listOrNone(response.selectedProcessVariables, '실행 품질은 추가 확인이 필요하고');
  const result = listOrNone(response.selectedResultVariables, '고객 반응에는 약한 신호가 나타나고 있다');
  const diffusion = response.selectedDiffusionVariables.length ? ` 또한 ${listOrNone(response.selectedDiffusionVariables)}도 함께 점검해야 한다.` : '';
  const guardrails = response.selectedGuardrails.length ? ` 단, ${listOrNone(response.selectedGuardrails)}은 먼저 안전선 기준으로 확인해야 한다.` : '';
  const experiment = response.selectedExperiments.length ? response.selectedExperiments.join(', ') : '선행/과정 행동 1개를 정해 실험한다';
  const check = response.selectedCheckMetrics.length ? response.selectedCheckMetrics.join(', ') : '고객 인게이지먼트 지수와 후속 대화 연결지수';
  const reason = response.reasonOneLine ? ` 판단 근거는 ${response.reasonOneLine}` : '';
  return `현재 ${member.name}은 ${lead} 신호가 있고, ${process} 문제가 나타나 ${result}.${diffusion}${guardrails}${reason} 따라서 2주 동안 ${experiment}을/를 실험하고, ${check}의 변화를 확인한다.`;
}

function parseAi(raw: string) {
  const text = (raw || '').trim();
  const pick = (n: number) => text.match(new RegExp('##\\s*' + n + '[\\s\\S]*?(?=##\\s*' + (n + 1) + '|$)'))?.[0] || '';
  return {
    aiRationale: pick(1),
    aiCounter: pick(2),
    aiQuestions: pick(3),
    aiExperiment: pick(4),
    aiCaution: pick(5),
  };
}

function buildPrompt(member: Member, response: DashboardResponse) {
  return `당신은 제약영업팀장의 팀원 실행진단을 돕는 리더십 코치입니다.\n\n역할:\n아래 진단을 새로 만드는 것이 아니라, 팀장이 먼저 선택한 판단이 타당한지 검증하고 보완하세요. 단순 성과 판단이 아니라 기회 만들기, 실행 품질, 고객 반응, 팀 학습, 안전선 점검의 경로를 보세요.\n\n[팀원]\n${member.name} / ${member.type}\n\n[팀원 발언]\n${member.comment}\n\n[진단 지표 데이터]\n${CORE_METRIC_ORDER.map((key) => `${key}(${METRIC_META[key].group}/${METRIC_META[key].expertLabel}): ${member.metrics[key]} - ${METRIC_META[key].description}`).join('\n')}\n\n[안전선 점검]\n${GUARDRAIL_ORDER.map((key) => `${key}: ${member.guardrails[key]} - ${METRIC_META[key].description}`).join('\n')}\n\n[팀장 첫 판단]\n${response.intuitionJudgment || '-'}\n\n[팀장이 선택한 기회 만들기 지표]\n${listOrNone(response.selectedLeadVariables, '-')}\n\n[팀장이 선택한 실행 품질 지표]\n${listOrNone(response.selectedProcessVariables, '-')}\n\n[팀장이 선택한 고객 반응 지표]\n${listOrNone(response.selectedResultVariables, '-')}\n\n[팀장이 선택한 팀 학습 지표]\n${listOrNone(response.selectedDiffusionVariables, '-')}\n\n[팀장이 선택한 안전선 점검]\n${listOrNone(response.selectedGuardrails, '-')}\n\n[진단 유형]\n${response.diagnosisType || '-'}\n\n[선택 이유]\n${response.reasonOneLine || '-'}\n\n[팀장이 작성한 인과 진단문]\n${response.diagnosisStatement || makeDiagnosisStatement(member, response)}\n\n[선택한 2주 실행 실험]\n${response.selectedExperiments.join(', ') || '-'}\n\n[2주 후 확인 지표]\n${response.selectedCheckMetrics.join(', ') || '-'}\n\n검토 요청:\n1. 위 진단이 타당한 이유를 근거 지표와 연결해 설명하세요.\n2. 이 진단이 틀렸을 가능성이나 빠진 변수를 지적하세요.\n3. 팀장이 팀원에게 확인해야 할 질문을 제안하세요.\n4. 선택한 2주 실행 실험을 더 현실적으로 보완하세요.\n5. 컴플라이언스와 AI 입력 안전선 관점의 주의점을 제안하세요.\n\n아래 제목을 그대로 사용해 답하세요.\n## 1. 이 진단이 타당한 이유\n## 2. 이 진단이 틀렸을 가능성\n## 3. 팀장이 확인해야 할 질문\n## 4. 2주 실행 실험 보완 제안\n## 5. 안전선 관점의 주의점`;
}

export function DashboardAnalysisLab() {
  const [storedResponse, setResponse] = useStored<DashboardResponse>(V36_STORAGE_KEYS.dashboardAnalysis, DEFAULT_RESPONSE);
  const response = {
    ...DEFAULT_RESPONSE,
    ...storedResponse,
    selectedLeadVariables: storedResponse.selectedLeadVariables ?? [],
    selectedProcessVariables: storedResponse.selectedProcessVariables ?? [],
    selectedResultVariables: storedResponse.selectedResultVariables ?? [],
    selectedDiffusionVariables: storedResponse.selectedDiffusionVariables ?? [],
    selectedGuardrails: storedResponse.selectedGuardrails ?? [],
    selectedExperiments: storedResponse.selectedExperiments ?? [],
    selectedCheckMetrics: storedResponse.selectedCheckMetrics ?? [],
    reviewChecks: storedResponse.reviewChecks ?? {},
  };
  const [copyMessage, setCopyMessage] = useState('');
  const currentMember = getMember(response.selectedMemberId);
  const prompt = useMemo(() => buildPrompt(currentMember, response), [currentMember, response]);
  const checkedCount = REVIEW_ITEMS.filter((item) => response.reviewChecks[item]).length;

  const update = (patch: Partial<DashboardResponse>) => {
    setResponse({ ...response, ...patch, savedAt: new Date().toISOString() });
  };

  const generateDiagnosis = () => {
    update({ diagnosisStatement: makeDiagnosisStatement(currentMember, response) });
    setCopyMessage('인과 진단문 초안을 생성했습니다. 필요하면 문장을 수정하세요.');
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyMessage('팀원 실행진단 프롬프트를 복사했습니다. 선택한 지표와 안전선 점검이 포함되어 있습니다.');
    } catch {
      setCopyMessage('복사가 차단되었습니다. 프롬프트 영역을 직접 선택해 복사하세요.');
    }
  };

  const applyAiAnswer = () => {
    const parsed = parseAi(response.aiAnswerRaw);
    update(parsed);
    setCopyMessage('AI 답변을 5개 검토 영역으로 분리했습니다.');
  };

  const outputText = `[팀원 실행진단 결과]\n\n[선택 팀원]\n${currentMember.name} / ${currentMember.type}\n\n[진단 유형]\n${response.diagnosisType}\n\n[인과 진단문]\n${response.diagnosisStatement || makeDiagnosisStatement(currentMember, response)}\n\n[기회 만들기]\n${listOrNone(response.selectedLeadVariables, '-')}\n\n[실행 품질]\n${listOrNone(response.selectedProcessVariables, '-')}\n\n[고객 반응]\n${listOrNone(response.selectedResultVariables, '-')}\n\n[팀 학습]\n${listOrNone(response.selectedDiffusionVariables, '-')}\n\n[안전선 점검]\n${listOrNone(response.selectedGuardrails, '-')}\n\n[2주 실행 실험]\n${response.selectedExperiments.join(', ') || '-'}\n\n[2주 후 확인 지표]\n${response.selectedCheckMetrics.join(', ') || '-'}\n\n[팀원에게 던질 질문]\n${response.confirmQuestion}\n\n[최종 실행 문장]\n${response.finalActionSentence}`;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
        <p className="font-bold">팀원 실행진단 Lab</p>
        <p className="mt-1">이 화면은 팀원을 평가하기 위한 점수표가 아니라, 실행 데이터를 바탕으로 팀원의 강점, 병목, 개입 지점을 찾는 진단 도구입니다.</p>
      </div>

      <SectionCard title="지표 읽는 법: 숫자보다 실행 경로를 본다">
        <div className="grid gap-3 md:grid-cols-5">
          {(['기회 만들기', '실행 품질', '고객 반응', '팀 학습', '안전선 점검'] as MetricGroup[]).map((group) => (
            <div key={group} className={`rounded-2xl border p-4 ${groupTone(group)}`}>
              <h4 className="font-black">{group}</h4>
              <p className="mt-2 text-sm">
                {group === '기회 만들기'
                  ? '성과 가능성을 만드는 사전 행동입니다.'
                  : group === '실행 품질'
                    ? '접점이 다음 행동으로 이어지는 과정 품질입니다.'
                    : group === '고객 반응'
                      ? '고객 질문, 관심, 후속 대화 신호입니다.'
                      : group === '팀 학습'
                        ? '개인 경험이 팀 실행 역량으로 퍼지는 정도입니다.'
                        : '성과보다 먼저 확인해야 하는 안전 기준입니다.'}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="1단계: 진단할 팀원 선택">
        <label className="block space-y-1"><FieldLabel>진단할 팀원 선택</FieldLabel><select className="w-full rounded-xl border px-3 py-2" value={response.selectedMemberId} onChange={(event) => update({ selectedMemberId: event.target.value })}>{MEMBERS.map((member) => <option key={member.id} value={member.id}>{member.name} · {member.type}</option>)}</select></label>
        <article className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-700"><h4 className="font-bold text-slate-900">{currentMember.name} · {currentMember.type}</h4><p className="mt-2">{currentMember.signal}</p><p className="mt-2 rounded-xl bg-white p-3 font-semibold text-slate-800">“{currentMember.comment}”</p></article>
        <div className="grid gap-3 md:grid-cols-4">
          {CORE_METRIC_ORDER.map((key) => {
            const meta = METRIC_META[key];
            return <div key={key} className={`rounded-2xl border p-3 ${metricTone(currentMember.metrics[key], key)}`}><div className="flex items-center justify-between gap-2"><p className="text-xs font-bold text-slate-500">{key}</p><span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${groupTone(meta.group)}`}>{meta.group}</span></div><p className="mt-1 text-2xl font-black text-slate-900">{currentMember.metrics[key]}</p><p className="mt-2 text-xs leading-5 text-slate-600">{meta.description}</p></div>;
          })}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {GUARDRAIL_ORDER.map((key) => {
            const status = currentMember.guardrails[key];
            return <div key={key} className={`rounded-2xl border p-4 ${guardrailTone(status)}`}><div className="flex items-center justify-between gap-2"><p className="text-sm font-black">{key}</p><span className="rounded-full bg-white/70 px-3 py-1 text-xs font-black">{status}</span></div><p className="mt-2 text-xs leading-5">{METRIC_META[key].description}</p></div>;
          })}
        </div>
      </SectionCard>

      <SectionCard title="2단계: 첫인상 판단 선택">
        <label className="block space-y-1"><FieldLabel>처음 든 판단</FieldLabel><select className="w-full rounded-xl border px-3 py-2" value={response.intuitionJudgment} onChange={(event) => update({ intuitionJudgment: event.target.value })}><option value="">선택하세요</option>{INTUITION_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
      </SectionCard>

      <SectionCard title="3단계: 현재 상황 점검">
        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">복수 선택 가능: 문제가 되는 지표를 모두 고르되, 가장 설명력이 큰 지표 중심으로 선택하세요. 안전선은 평균 점수가 아니라 우선 점검 기준입니다.</div>
        <label className="block space-y-1"><FieldLabel>진단 유형</FieldLabel><select className="w-full rounded-xl border px-3 py-2" value={response.diagnosisType} onChange={(event) => update({ diagnosisType: event.target.value })}><option value="">선택하세요</option>{DIAGNOSIS_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
        <div className="grid gap-4 md:grid-cols-5">
          <div><FieldLabel>기회 만들기</FieldLabel><div className="mt-2 space-y-2">{metricOptions('기회 만들기').map((metric) => <label key={metric} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={response.selectedLeadVariables.includes(metric)} onChange={() => update({ selectedLeadVariables: toggle(response.selectedLeadVariables, metric) })} />{metric}</label>)}</div></div>
          <div><FieldLabel>실행 품질</FieldLabel><div className="mt-2 space-y-2">{metricOptions('실행 품질').map((metric) => <label key={metric} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={response.selectedProcessVariables.includes(metric)} onChange={() => update({ selectedProcessVariables: toggle(response.selectedProcessVariables, metric) })} />{metric}</label>)}</div></div>
          <div><FieldLabel>고객 반응</FieldLabel><div className="mt-2 space-y-2">{metricOptions('고객 반응').map((metric) => <label key={metric} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={response.selectedResultVariables.includes(metric)} onChange={() => update({ selectedResultVariables: toggle(response.selectedResultVariables, metric) })} />{metric}</label>)}</div></div>
          <div><FieldLabel>팀 학습</FieldLabel><div className="mt-2 space-y-2">{metricOptions('팀 학습').map((metric) => <label key={metric} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={response.selectedDiffusionVariables.includes(metric)} onChange={() => update({ selectedDiffusionVariables: toggle(response.selectedDiffusionVariables, metric) })} />{metric}</label>)}</div></div>
          <div><FieldLabel>안전선 점검</FieldLabel><div className="mt-2 space-y-2">{GUARDRAIL_ORDER.map((metric) => <label key={metric} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={response.selectedGuardrails.includes(metric)} onChange={() => update({ selectedGuardrails: toggle(response.selectedGuardrails, metric) })} />{metric}</label>)}</div></div>
        </div>
        <label className="block space-y-1"><FieldLabel>선택 이유 한 줄</FieldLabel><input className="w-full rounded-xl border px-3 py-2" value={response.reasonOneLine} onChange={(event) => update({ reasonOneLine: event.target.value })} placeholder="예: 접점은 충분하지만 메시지-니즈 적합도와 후속 대화 연결지수가 낮다." /></label>
        <button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={generateDiagnosis}>인과 진단문 생성</button>
        <label className="block space-y-1"><FieldLabel>인과 진단문</FieldLabel><textarea className="min-h-28 w-full rounded-xl border px-3 py-2" value={response.diagnosisStatement} onChange={(event) => update({ diagnosisStatement: event.target.value })} placeholder="선택 후 인과 진단문을 생성하고 필요한 부분만 수정하세요." /></label>
      </SectionCard>

      <SectionCard title="4단계: 2주 실행 실험과 확인 지표 선택">
        <div className="rounded-xl bg-cyan-50 p-3 text-sm text-cyan-900">복수 선택 가능 · 2주 동안 실제로 실행 가능한 실험은 2개 이내, 확인 지표는 2~3개를 권장합니다.</div>
        <div>
          <FieldLabel>2주 실행 실험</FieldLabel>
          <div className="mt-2 grid gap-2 md:grid-cols-2">{EXPERIMENT_OPTIONS.map((item) => <label key={item} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={response.selectedExperiments.includes(item)} onChange={() => update({ selectedExperiments: toggle(response.selectedExperiments, item) })} />{item}</label>)}</div>
          <p className="mt-2 text-xs text-slate-500">현재 선택: {response.selectedExperiments.length}개 / 권장: 최대 2개</p>
        </div>
        <div>
          <FieldLabel>2주 후 확인 지표</FieldLabel>
          <div className="mt-2 grid gap-2 md:grid-cols-3">{CHECK_METRIC_OPTIONS.map((item) => <label key={item} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={response.selectedCheckMetrics.includes(item)} onChange={() => update({ selectedCheckMetrics: toggle(response.selectedCheckMetrics, item) })} />{item}</label>)}</div>
          <p className="mt-2 text-xs text-slate-500">현재 선택: {response.selectedCheckMetrics.length}개 / 권장: 2~3개</p>
        </div>
      </SectionCard>

      <SectionCard title="5단계: AI로 반대 가능성 점검">
        <div className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-bold text-slate-900">AI 프롬프트에 반영되는 선택 요약</p>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            <p><b>기회 만들기:</b> {listOrNone(response.selectedLeadVariables, '-')}</p>
            <p><b>실행 품질:</b> {listOrNone(response.selectedProcessVariables, '-')}</p>
            <p><b>고객 반응:</b> {listOrNone(response.selectedResultVariables, '-')}</p>
            <p><b>팀 학습:</b> {listOrNone(response.selectedDiffusionVariables, '-')}</p>
            <p><b>안전선 점검:</b> {listOrNone(response.selectedGuardrails, '-')}</p>
            <p><b>진단 유형:</b> {response.diagnosisType || '-'}</p>
            <p><b>2주 실험:</b> {response.selectedExperiments.join(', ') || '-'}</p>
            <p><b>확인 지표:</b> {response.selectedCheckMetrics.join(', ') || '-'}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm text-slate-600">AI는 진단을 대신 만드는 것이 아니라, 팀장의 판단을 검증하고 놓친 가능성을 찾습니다.</p><button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={copyPrompt}>프롬프트 복사</button></div>
        {copyMessage ? <p className="text-sm font-semibold text-cyan-700">{copyMessage}</p> : null}
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{prompt}</pre>
        <textarea className="min-h-40 w-full rounded-xl border px-3 py-2" value={response.aiAnswerRaw} onChange={(event) => update({ aiAnswerRaw: event.target.value })} placeholder="AI 답변을 붙여넣으세요. ## 1~5 제목을 기준으로 자동 분리할 수 있습니다." />
        <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white" onClick={applyAiAnswer}>AI 답변 5개 영역으로 분리</button>
        <label className="block space-y-1"><FieldLabel>이 진단이 타당한 이유</FieldLabel><textarea className="min-h-20 w-full rounded-xl border px-3 py-2" value={response.aiRationale} onChange={(event) => update({ aiRationale: event.target.value })} /></label>
        <label className="block space-y-1"><FieldLabel>이 진단이 틀렸을 가능성</FieldLabel><textarea className="min-h-20 w-full rounded-xl border px-3 py-2" value={response.aiCounter} onChange={(event) => update({ aiCounter: event.target.value })} /></label>
        <label className="block space-y-1"><FieldLabel>팀장이 확인해야 할 질문</FieldLabel><textarea className="min-h-20 w-full rounded-xl border px-3 py-2" value={response.aiQuestions} onChange={(event) => update({ aiQuestions: event.target.value })} /></label>
      </SectionCard>

      <SectionCard title="6단계: 최종 실행 문장">
        <label className="block space-y-1"><FieldLabel>팀원에게 던질 확인 질문</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.confirmQuestion} onChange={(event) => update({ confirmQuestion: event.target.value })} placeholder="예: 이번 2주 동안 고객 접점 후 어떤 후속 대화 연결이 가장 막혔나요?" /></label>
        <label className="block space-y-1"><FieldLabel>최종 실행 문장</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.finalActionSentence} onChange={(event) => update({ finalActionSentence: event.target.value })} placeholder="예: 2주 동안 고객별 질문 2개와 안전 메시지 2문장을 준비하고, 후속 대화 연결지수와 CRM 기록 품질 변화를 확인한다." /></label>
      </SectionCard>

      <SectionCard title="최종 점검과 산출물">
        <div className="grid gap-2 md:grid-cols-2">{REVIEW_ITEMS.map((item) => <label key={item} className="flex items-start gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" className="mt-1" checked={Boolean(response.reviewChecks[item])} onChange={(event) => update({ reviewChecks: { ...response.reviewChecks, [item]: event.target.checked } })} /><span>{item}</span></label>)}</div>
        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">점검 완료: {checkedCount} / {REVIEW_ITEMS.length}</div>
        <pre className="whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{outputText}</pre>
        <p className="text-xs text-slate-500">자동 저장 키: {V36_STORAGE_KEYS.dashboardAnalysis} / 마지막 저장: {response.savedAt || '아직 입력 전'}</p>
      </SectionCard>
    </div>
  );
}

export default DashboardAnalysisLab;
