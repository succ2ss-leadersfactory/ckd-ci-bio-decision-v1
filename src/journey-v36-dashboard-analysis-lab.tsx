import { useMemo, useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';
import { V36_STORAGE_KEYS } from './journey-v36-preview-config';

type MetricGroup = '기회 만들기' | '실행 품질' | '고객 반응' | '팀 학습' | '안전선 점검';
type ExpertMetricLabel = '선행지표' | '과정지표' | '결과지표' | '확산지표' | '가드레일';
type GuardrailStatus = '안전' | '주의' | '점검 필요';

type Member = {
  id: string;
  name: string;
  profile: string;
  observation: string;
  quote: string;
  metrics: Record<string, number>;
  guardrails: Record<string, GuardrailStatus>;
};

type MetricMeta = {
  group: MetricGroup;
  expertLabel: ExpertMetricLabel;
  description: string;
};

type DiagnosisResponse = {
  selectedMemberId: string;
  observationIntuition: string;
  dataHypothesis: string;
  comparisonChoice: string;
  changedReason: string;
  selectedLeadVariables: string[];
  selectedProcessVariables: string[];
  selectedResultVariables: string[];
  selectedDiffusionVariables: string[];
  selectedGuardrails: string[];
  diagnosisStatement: string;
  selectedExperiments: string[];
  selectedCheckMetrics: string[];
  aiAnswerRaw: string;
  aiProfileCheck: string;
  aiPathCheck: string;
  aiCounter: string;
  aiQuestions: string;
  aiExperiment: string;
  aiCaution: string;
  confirmQuestion: string;
  finalActionSentence: string;
  reviewChecks: Record<string, boolean>;
  savedAt: string;
};

type SignalItem = {
  key: string;
  value: number | GuardrailStatus;
  note: string;
};

type HypothesisCandidate = {
  hypothesis: string;
  reason: string;
  metrics: string[];
  priority: number;
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

const METRIC_META: Record<string, MetricMeta> = {
  '계획 접점 실행률': { group: '기회 만들기', expertLabel: '선행지표', description: '우선순위 고객군에 대해 사전에 계획한 접점을 실제로 실행한 정도' },
  '핵심 고객군 커버리지': { group: '기회 만들기', expertLabel: '선행지표', description: '우선순위 고객군을 계획 기준에 맞게 균형 있게 접촉한 정도' },
  '사전 인사이트 준비도': { group: '기회 만들기', expertLabel: '선행지표', description: '방문 전 고객 상황, 이전 반응, 정보 니즈, 대화 목적을 준비한 정도' },
  '메시지-니즈 적합도': { group: '실행 품질', expertLabel: '과정지표', description: '고객의 정보 니즈와 허가된 메시지 범위에 맞게 근거 기반 메시지를 전달한 정도' },
  'CRM 기록 품질': { group: '실행 품질', expertLabel: '과정지표', description: '고객 상황, 반응, 이슈, 다음 행동이 후속 판단 가능하도록 기록된 정도' },
  '후속조치 실행률': { group: '실행 품질', expertLabel: '과정지표', description: '고객 접점 이후 약속되거나 필요한 다음 행동을 실행한 정도' },
  '실행 적시성': { group: '실행 품질', expertLabel: '과정지표', description: '계획된 실행과 후속조치가 지연 없이 적시에 이루어진 정도' },
  '고객 인게이지먼트 지수': { group: '고객 반응', expertLabel: '결과지표', description: '고객이 질문, 관심, 자료 요청, 추가 논의 등으로 대화에 참여한 정도' },
  '후속 대화 연결지수': { group: '고객 반응', expertLabel: '결과지표', description: '고객 반응이 후속 설명, 추가 자료 요청, 다음 미팅 등 다음 대화로 연결된 정도' },
  '고객 대화 지속성': { group: '고객 반응', expertLabel: '결과지표', description: '고객이 반복 대화, 피드백 제공, 추가 질문, 후속 접점 수락 등으로 대화를 지속한 정도' },
  '팀 학습 기여도': { group: '팀 학습', expertLabel: '확산지표', description: '개인의 실행 경험을 팀 회의, 사례 공유, 개선 아이디어로 전환한 정도' },
  '실행 인사이트 재사용도': { group: '팀 학습', expertLabel: '확산지표', description: '한 팀원의 성공·실패 사례가 다른 팀원의 실행 개선에 활용된 정도' },
  '컴플라이언스 위험 점검': { group: '안전선 점검', expertLabel: '가드레일', description: '고객 커뮤니케이션, 자료 활용, AI 생성 문장에 규정상 위험 표현이 없는지 점검한 상태' },
  'AI 입력 안전 점검': { group: '안전선 점검', expertLabel: '가드레일', description: 'AI 사용 과정에서 고객명, 병원명, 내부 전략, 민감 수치 등을 입력하지 않았는지 점검한 상태' },
};

const MEMBERS: Member[] = [
  {
    id: 'M01',
    name: '신재영 대리',
    profile: '접점 활동 적극 수행',
    observation: '고객 접점 활동이 많고 이동 동선도 넓다. 회의에서는 “저는 누구보다 많이 움직이고 있다”고 말하지만, 방문 이후 어떤 대화가 이어졌는지는 설명이 짧다.',
    quote: '저는 누구보다 많이 움직이고 있습니다.',
    metrics: { '계획 접점 실행률': 112, '핵심 고객군 커버리지': 96, '사전 인사이트 준비도': 62, '메시지-니즈 적합도': 58, 'CRM 기록 품질': 64, '후속조치 실행률': 58, '실행 적시성': 68, '고객 인게이지먼트 지수': 62, '후속 대화 연결지수': 54, '고객 대화 지속성': 57, '팀 학습 기여도': 61, '실행 인사이트 재사용도': 52 },
    guardrails: { '컴플라이언스 위험 점검': '주의', 'AI 입력 안전 점검': '안전' },
  },
  {
    id: 'M02',
    name: '이대은 대리',
    profile: '담당처 자율 관리 성향',
    observation: '고객과의 관계와 후속 대화는 안정적이다. 다만 팀 회의에서는 자신의 방식 공유를 부담스러워하고, 동료의 질문에는 “각자 담당처는 본인이 책임지는 것”이라고 선을 긋는다.',
    quote: '각자 자기 담당처는 본인이 책임지는 게 맞지 않나요?',
    metrics: { '계획 접점 실행률': 91, '핵심 고객군 커버리지': 88, '사전 인사이트 준비도': 82, '메시지-니즈 적합도': 86, 'CRM 기록 품질': 72, '후속조치 실행률': 74, '실행 적시성': 81, '고객 인게이지먼트 지수': 84, '후속 대화 연결지수': 128, '고객 대화 지속성': 88, '팀 학습 기여도': 42, '실행 인사이트 재사용도': 38 },
    guardrails: { '컴플라이언스 위험 점검': '안전', 'AI 입력 안전 점검': '안전' },
  },
  {
    id: 'M03',
    name: '박재욱 사원',
    profile: '신규 역할 적응 중',
    observation: 'CRM 기록은 꼼꼼하게 남기지만 고객 앞에서는 질문이 짧아진다. 방문 전 준비 자료는 많지만, 실제 대화에서 고객의 참여를 끌어내는 데 어려움을 느낀다.',
    quote: '제가 가면 오히려 불편해하시는 것 같습니다.',
    metrics: { '계획 접점 실행률': 72, '핵심 고객군 커버리지': 69, '사전 인사이트 준비도': 54, '메시지-니즈 적합도': 57, 'CRM 기록 품질': 90, '후속조치 실행률': 67, '실행 적시성': 76, '고객 인게이지먼트 지수': 51, '후속 대화 연결지수': 48, '고객 대화 지속성': 50, '팀 학습 기여도': 70, '실행 인사이트 재사용도': 63 },
    guardrails: { '컴플라이언스 위험 점검': '안전', 'AI 입력 안전 점검': '안전' },
  },
  {
    id: 'M04',
    name: '유희관 과장',
    profile: '장기 담당처 관계 보유',
    observation: '담당처와의 관계는 안정적이다. 그러나 새로운 기록 기준이나 실행 방식이 나오면 “현장에서는 그런 방식이 잘 안 맞는다”고 말하며 신중한 태도를 보인다.',
    quote: '현장에서는 그런 방식이 잘 안 맞습니다.',
    metrics: { '계획 접점 실행률': 86, '핵심 고객군 커버리지': 92, '사전 인사이트 준비도': 78, '메시지-니즈 적합도': 61, 'CRM 기록 품질': 55, '후속조치 실행률': 63, '실행 적시성': 64, '고객 인게이지먼트 지수': 76, '후속 대화 연결지수': 82, '고객 대화 지속성': 86, '팀 학습 기여도': 58, '실행 인사이트 재사용도': 45 },
    guardrails: { '컴플라이언스 위험 점검': '주의', 'AI 입력 안전 점검': '안전' },
  },
  {
    id: 'M05',
    name: '김문호 차장',
    profile: '최근 목표 압박 노출',
    observation: '최근 목표 압박을 크게 느끼고 있다. 회의에서 지역 상황과 외부 요인을 자주 언급하며, 본인의 실행으로 바꿀 수 있는 부분에 대해서는 말을 아낀다.',
    quote: '이번 지역 상황은 제가 어떻게 할 수 있는 게 아닙니다.',
    metrics: { '계획 접점 실행률': 79, '핵심 고객군 커버리지': 75, '사전 인사이트 준비도': 63, '메시지-니즈 적합도': 60, 'CRM 기록 품질': 68, '후속조치 실행률': 61, '실행 적시성': 52, '고객 인게이지먼트 지수': 60, '후속 대화 연결지수': 68, '고객 대화 지속성': 59, '팀 학습 기여도': 55, '실행 인사이트 재사용도': 50 },
    guardrails: { '컴플라이언스 위험 점검': '안전', 'AI 입력 안전 점검': '주의' },
  },
  {
    id: 'M06',
    name: '김재호 차장',
    profile: '현장 요청 우선 대응',
    observation: '고객의 현장 요청에는 빠르게 대응한다. 하지만 사후 기록과 후속 실행 정리는 뒤로 밀리는 경우가 반복되고, 본인은 “현장 대응이 먼저”라고 설명한다.',
    quote: '현장 대응하느라 입력은 나중에 하게 됩니다.',
    metrics: { '계획 접점 실행률': 93, '핵심 고객군 커버리지': 81, '사전 인사이트 준비도': 74, '메시지-니즈 적합도': 69, 'CRM 기록 품질': 41, '후속조치 실행률': 45, '실행 적시성': 48, '고객 인게이지먼트 지수': 69, '후속 대화 연결지수': 73, '고객 대화 지속성': 71, '팀 학습 기여도': 62, '실행 인사이트 재사용도': 56 },
    guardrails: { '컴플라이언스 위험 점검': '안전', 'AI 입력 안전 점검': '점검 필요' },
  },
];

const OBSERVATION_OPTIONS = [
  '활동은 충분하지만 방향이 흐릿해 보인다',
  '의지는 있으나 자신감이 낮아 보인다',
  '자기 방식에 익숙해 변화가 어려워 보인다',
  '성과는 좋지만 팀 기여는 약해 보인다',
  '목표 부담 때문에 방어적으로 보인다',
  '현장 대응은 빠르지만 정리가 부족해 보인다',
  '안전선 확인이 먼저 필요해 보인다',
  '아직 판단하기 어렵다',
];

const DATA_HYPOTHESIS_OPTIONS = [
  '접점 기회가 부족한 것 같다',
  '사전 준비가 약한 것 같다',
  '메시지와 고객 니즈가 맞지 않는 것 같다',
  '기록과 후속 실행이 끊기는 것 같다',
  '고객 반응 자체가 약한 것 같다',
  '반응은 있으나 다음 대화로 연결되지 않는 것 같다',
  '대화가 반복 관계로 이어지지 않는 것 같다',
  '개인 경험이 팀 학습으로 퍼지지 않는 것 같다',
  '안전선부터 확인해야 할 것 같다',
  '아직 단정하기 어렵다',
];

const DATA_HYPOTHESIS_GUIDES: Record<string, string> = {
  '접점 기회가 부족한 것 같다': '선행지표인 계획 접점 실행률과 핵심 고객군 커버리지가 낮을 때 검토합니다.',
  '사전 준비가 약한 것 같다': '선행지표인 사전 인사이트 준비도와 과정지표인 메시지-니즈 적합도가 함께 낮을 때 검토합니다.',
  '메시지와 고객 니즈가 맞지 않는 것 같다': '과정지표인 메시지-니즈 적합도와 결과지표인 고객 인게이지먼트가 낮을 때 검토합니다.',
  '기록과 후속 실행이 끊기는 것 같다': '과정지표인 CRM 기록 품질, 후속조치 실행률, 실행 적시성이 함께 낮을 때 검토합니다.',
  '고객 반응 자체가 약한 것 같다': '결과지표인 고객 질문, 관심, 자료 요청, 대화 참여 신호가 전반적으로 낮을 때 검토합니다.',
  '반응은 있으나 다음 대화로 연결되지 않는 것 같다': '결과지표 중 고객 인게이지먼트는 있지만 후속 대화 연결지수가 낮을 때 검토합니다.',
  '대화가 반복 관계로 이어지지 않는 것 같다': '결과지표인 고객 대화 지속성이 낮거나 반복 접점, 피드백, 추가 질문이 약할 때 검토합니다.',
  '개인 경험이 팀 학습으로 퍼지지 않는 것 같다': '확산지표인 팀 학습 기여도와 실행 인사이트 재사용도가 낮을 때 검토합니다.',
  '안전선부터 확인해야 할 것 같다': '가드레일인 컴플라이언스 위험 점검 또는 AI 입력 안전 점검이 주의·점검 필요일 때 검토합니다.',
  '아직 단정하기 어렵다': '선행·과정·결과·확산지표의 신호가 엇갈리거나 추가 맥락이 필요할 때 선택합니다.',
};

const COMPARISON_OPTIONS = [
  '처음 판단을 유지한다',
  '데이터를 보고 판단을 수정한다',
  '처음 판단과 데이터가 일부만 일치한다',
  '아직 판단을 유보한다',
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
  '지표를 보기 전 직관적 해석을 먼저 기록했는가?',
  '데이터 신호 요약을 확인했는가?',
  '검토 후보 가설과 연결 지표를 확인했는가?',
  '데이터 확인 후 진단 가설을 다시 세웠는가?',
  '직관과 데이터의 차이를 비교했는가?',
  '선행지표·과정지표·결과지표·확산지표를 모두 확인했는가?',
  '안전선 점검·가드레일을 별도로 확인했는가?',
  '2주 동안 실행할 실험을 2개 이내로 정했는가?',
  'AI로 반대 가능성과 확인 질문을 점검했는가?',
];

const DEFAULT_RESPONSE: DiagnosisResponse = {
  selectedMemberId: 'M01',
  observationIntuition: '',
  dataHypothesis: '',
  comparisonChoice: '',
  changedReason: '',
  selectedLeadVariables: [],
  selectedProcessVariables: [],
  selectedResultVariables: [],
  selectedDiffusionVariables: [],
  selectedGuardrails: [],
  diagnosisStatement: '',
  selectedExperiments: [],
  selectedCheckMetrics: [],
  aiAnswerRaw: '',
  aiProfileCheck: '',
  aiPathCheck: '',
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

function metricTone(value: number) {
  if (value >= 85) return 'border-cyan-200 bg-cyan-50';
  if (value >= 70) return 'border-amber-200 bg-amber-50';
  return 'border-red-200 bg-red-50';
}

function signalTone(type: 'strong' | 'weak' | 'guardrail') {
  if (type === 'strong') return 'border-cyan-200 bg-cyan-50 text-cyan-900';
  if (type === 'weak') return 'border-red-200 bg-red-50 text-red-900';
  return 'border-amber-200 bg-amber-50 text-amber-900';
}

function guardrailTone(status: GuardrailStatus) {
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

function expertLabelForGroup(group: MetricGroup): ExpertMetricLabel {
  if (group === '기회 만들기') return '선행지표';
  if (group === '실행 품질') return '과정지표';
  if (group === '고객 반응') return '결과지표';
  if (group === '팀 학습') return '확산지표';
  return '가드레일';
}

function groupLabel(group: MetricGroup) {
  return `${group} · ${expertLabelForGroup(group)}`;
}

function metricOptions(group: MetricGroup) {
  return CORE_METRIC_ORDER.filter((key) => METRIC_META[key].group === group);
}

function listOrNone(items: string[], noneText = '-') {
  return items.length ? items.join(', ') : noneText;
}

function metricValue(member: Member, key: string) {
  return member.metrics[key] ?? 0;
}

function makeSignalItem(member: Member, key: string): SignalItem {
  const value = metricValue(member, key);
  return { key, value, note: `${METRIC_META[key].group} · ${METRIC_META[key].expertLabel}` };
}

function createCandidate(hypothesis: string, reason: string, metrics: string[], priority: number): HypothesisCandidate {
  return { hypothesis, reason, metrics, priority };
}

function buildDataSignalSummary(member: Member) {
  const strong = CORE_METRIC_ORDER
    .filter((key) => metricValue(member, key) >= 85)
    .map((key) => makeSignalItem(member, key))
    .slice(0, 5);

  const weak = CORE_METRIC_ORDER
    .filter((key) => metricValue(member, key) < 65)
    .map((key) => makeSignalItem(member, key));

  const guardrailIssues = GUARDRAIL_ORDER
    .filter((key) => member.guardrails[key] !== '안전')
    .map((key) => ({ key, value: member.guardrails[key], note: '안전선 점검 · 가드레일' }));

  const candidates: HypothesisCandidate[] = [];

  if (metricValue(member, '계획 접점 실행률') < 75 || metricValue(member, '핵심 고객군 커버리지') < 75) {
    candidates.push(createCandidate(
      '접점 기회가 부족한 것 같다',
      '계획 접점 실행률 또는 핵심 고객군 커버리지가 낮아, 성과 가능성을 만드는 접점 기회부터 확인할 필요가 있습니다.',
      ['계획 접점 실행률', '핵심 고객군 커버리지'],
      70,
    ));
  }

  if (metricValue(member, '사전 인사이트 준비도') < 70 && metricValue(member, '메시지-니즈 적합도') < 75) {
    candidates.push(createCandidate(
      '사전 준비가 약한 것 같다',
      '사전 인사이트 준비도와 메시지-니즈 적합도가 함께 낮아, 방문 전 고객 맥락과 대화 목적 준비를 점검할 수 있습니다.',
      ['사전 인사이트 준비도', '메시지-니즈 적합도'],
      72,
    ));
  }

  if (metricValue(member, '메시지-니즈 적합도') < 70 && metricValue(member, '고객 인게이지먼트 지수') < 75) {
    candidates.push(createCandidate(
      '메시지와 고객 니즈가 맞지 않는 것 같다',
      '메시지-니즈 적합도와 고객 인게이지먼트가 낮아, 고객에게 맞는 메시지였는지 확인할 필요가 있습니다.',
      ['메시지-니즈 적합도', '고객 인게이지먼트 지수'],
      76,
    ));
  }

  const executionWeakCount = ['CRM 기록 품질', '후속조치 실행률', '실행 적시성'].filter((key) => metricValue(member, key) < 70).length;
  if (executionWeakCount >= 2) {
    candidates.push(createCandidate(
      '기록과 후속 실행이 끊기는 것 같다',
      'CRM 기록 품질, 후속조치 실행률, 실행 적시성 중 두 개 이상이 낮아 접점 이후 다음 행동이 끊기는지 확인할 수 있습니다.',
      ['CRM 기록 품질', '후속조치 실행률', '실행 적시성'],
      80 + executionWeakCount,
    ));
  }

  if (metricValue(member, '고객 인게이지먼트 지수') < 70 && metricValue(member, '고객 대화 지속성') < 70) {
    candidates.push(createCandidate(
      '고객 반응 자체가 약한 것 같다',
      '고객 인게이지먼트와 고객 대화 지속성이 모두 낮아 고객의 질문, 관심, 반복 대화 신호가 약한지 볼 필요가 있습니다.',
      ['고객 인게이지먼트 지수', '고객 대화 지속성'],
      74,
    ));
  }

  if (metricValue(member, '고객 인게이지먼트 지수') >= 70 && metricValue(member, '후속 대화 연결지수') < 70) {
    candidates.push(createCandidate(
      '반응은 있으나 다음 대화로 연결되지 않는 것 같다',
      '고객 반응은 있지만 후속 대화 연결지수가 낮아, 관심이 다음 설명·자료·미팅으로 이어지는지 점검할 수 있습니다.',
      ['고객 인게이지먼트 지수', '후속 대화 연결지수'],
      76,
    ));
  }

  if (metricValue(member, '고객 대화 지속성') < 65) {
    candidates.push(createCandidate(
      '대화가 반복 관계로 이어지지 않는 것 같다',
      '고객 대화 지속성이 낮아 반복 대화, 피드백, 후속 접점 수락 신호가 약한지 확인할 필요가 있습니다.',
      ['고객 대화 지속성'],
      68,
    ));
  }

  if (metricValue(member, '팀 학습 기여도') < 65 || metricValue(member, '실행 인사이트 재사용도') < 65) {
    candidates.push(createCandidate(
      '개인 경험이 팀 학습으로 퍼지지 않는 것 같다',
      '팀 학습 기여도 또는 실행 인사이트 재사용도가 낮아, 개인 경험이 팀의 공유 자산으로 전환되는지 점검할 수 있습니다.',
      ['팀 학습 기여도', '실행 인사이트 재사용도'],
      82,
    ));
  }

  if (guardrailIssues.length > 0) {
    candidates.push(createCandidate(
      '안전선부터 확인해야 할 것 같다',
      '컴플라이언스 또는 AI 입력 안전이 주의·점검 필요 상태이므로 실행 강화보다 안전선 확인을 먼저 해야 합니다.',
      guardrailIssues.map((item) => item.key),
      95,
    ));
  }

  const sortedCandidates = candidates.sort((a, b) => b.priority - a.priority).slice(0, 3);

  return {
    strong,
    weak,
    guardrailIssues,
    candidates: sortedCandidates.length > 0
      ? sortedCandidates
      : [createCandidate('아직 단정하기 어렵다', '강한 신호와 약한 신호가 뚜렷하게 한 방향으로 모이지 않아 추가 맥락 확인이 필요합니다.', [], 10)],
  };
}

function selectedHypothesisReason(member: Member, hypothesis: string) {
  const candidate = buildDataSignalSummary(member).candidates.find((item) => item.hypothesis === hypothesis);
  return candidate?.reason ?? DATA_HYPOTHESIS_GUIDES[hypothesis] ?? '';
}

function makeDiagnosisStatement(member: Member, response: DiagnosisResponse) {
  const comparison = response.comparisonChoice || '직관과 데이터의 차이는 추가 확인이 필요하다';
  const lead = listOrNone(response.selectedLeadVariables, '선행지표에서 결정적 신호는 아직 약함');
  const process = listOrNone(response.selectedProcessVariables, '과정지표는 추가 확인 필요');
  const result = listOrNone(response.selectedResultVariables, '결과지표는 추가 확인 필요');
  const diffusion = listOrNone(response.selectedDiffusionVariables, '확산지표는 추가 확인 필요');
  const guardrails = listOrNone(response.selectedGuardrails, '현재 선택한 가드레일 이슈 없음');
  const experiments = response.selectedExperiments.length ? response.selectedExperiments.join(', ') : '2주 실행 실험 1개를 정한다';
  const checks = response.selectedCheckMetrics.length ? response.selectedCheckMetrics.join(', ') : '핵심 지표 2~3개';

  return `${member.name}에 대한 상황 기반 첫 해석은 “${response.observationIntuition || '미기록'}”이었다. 실제 데이터를 확인한 뒤 진단 가설은 “${response.dataHypothesis || '미기록'}”로 정리했다. ${comparison}. 근거는 선행지표(${lead}), 과정지표(${process}), 결과지표(${result}), 확산지표(${diffusion}), 가드레일(${guardrails})이다. 따라서 2주 동안 ${experiments}을/를 실행하고, ${checks}의 변화를 확인한다.`;
}

function parseAi(raw: string) {
  const text = (raw || '').trim();
  const pick = (n: number) => text.match(new RegExp('##\\s*' + n + '[\\s\\S]*?(?=##\\s*' + (n + 1) + '|$)'))?.[0] || '';
  return {
    aiProfileCheck: pick(1),
    aiPathCheck: pick(2),
    aiCounter: pick(3),
    aiQuestions: pick(4),
    aiExperiment: pick(5),
    aiCaution: pick(6),
  };
}

function buildPrompt(member: Member, response: DiagnosisResponse) {
  const dataSummary = buildDataSignalSummary(member);
  return `당신은 제약영업팀장의 팀원 실행진단을 돕는 리더십 코치입니다.\n\n핵심 원칙:\n팀장이 먼저 상황만 보고 직관적 해석을 했고, 이후 실제 데이터를 보고 데이터 기반 진단 가설을 세웠습니다. 이 둘이 어떻게 같고 다른지, 그리고 선행지표→과정지표→결과지표→확산지표의 연결 경로가 타당한지 검토하세요.\n\n[팀원]\n${member.name}\n\n[관찰 프로필]\n${member.profile}\n\n[관찰 상황]\n${member.observation}\n\n[팀원 발언]\n${member.quote}\n\n[1단계: 상황만 보고 처음 든 생각]\n${response.observationIntuition || '-'}\n\n[2단계: 데이터를 보고 다시 세운 진단 가설]\n${response.dataHypothesis || '-'}\n\n[데이터 신호 요약]\n강한 신호: ${dataSummary.strong.map((item) => `${item.key} ${item.value}`).join(', ') || '-'}\n약한 신호: ${dataSummary.weak.map((item) => `${item.key} ${item.value}`).join(', ') || '-'}\n안전선 이슈: ${dataSummary.guardrailIssues.map((item) => `${item.key} ${item.value}`).join(', ') || '현재 주요 이슈 없음'}\n검토 후보 가설: ${dataSummary.candidates.map((item) => `${item.hypothesis}(${item.reason})`).join(' / ')}\n\n[2단계 가설 선택 기준]\n${selectedHypothesisReason(member, response.dataHypothesis) || '-'}\n\n[3단계: 직관과 데이터 비교]\n${response.comparisonChoice || '-'}\n\n[판단이 유지/수정/유보된 이유]\n${response.changedReason || '-'}\n\n[진단 지표 데이터]\n${CORE_METRIC_ORDER.map((key) => `${key}(${METRIC_META[key].group}/${METRIC_META[key].expertLabel}): ${member.metrics[key]} - ${METRIC_META[key].description}`).join('\n')}\n\n[안전선 점검]\n${GUARDRAIL_ORDER.map((key) => `${key}: ${member.guardrails[key]} - ${METRIC_META[key].description}`).join('\n')}\n\n[팀장이 선택한 근거 지표]\n- 기회 만들기·선행지표: ${listOrNone(response.selectedLeadVariables)}\n- 실행 품질·과정지표: ${listOrNone(response.selectedProcessVariables)}\n- 고객 반응·결과지표: ${listOrNone(response.selectedResultVariables)}\n- 팀 학습·확산지표: ${listOrNone(response.selectedDiffusionVariables)}\n- 안전선 점검·가드레일: ${listOrNone(response.selectedGuardrails)}\n\n[팀장이 작성한 인과 진단문]\n${response.diagnosisStatement || makeDiagnosisStatement(member, response)}\n\n[선택한 2주 실행 실험]\n${response.selectedExperiments.join(', ') || '-'}\n\n[2주 후 확인 지표]\n${response.selectedCheckMetrics.join(', ') || '-'}\n\n검토 요청:\n1. 상황 기반 직관과 데이터 기반 가설이 섞이지 않았는지 점검하세요.\n2. 선행지표→과정지표→결과지표→확산지표의 연결 경로가 타당한지 설명하세요.\n3. 이 진단이 틀렸을 가능성이나 빠진 변수를 지적하세요.\n4. 팀장이 팀원에게 확인해야 할 질문을 제안하세요.\n5. 선택한 2주 실행 실험을 더 현실적으로 보완하세요.\n6. 컴플라이언스와 AI 입력 안전선 관점의 주의점을 제안하세요.\n\n아래 제목을 그대로 사용해 답하세요.\n## 1. 직관과 데이터 가설 구분 점검\n## 2. 선행·과정·결과·확산지표 연결 점검\n## 3. 이 진단이 틀렸을 가능성\n## 4. 팀장이 확인해야 할 질문\n## 5. 2주 실행 실험 보완 제안\n## 6. 안전선 관점의 주의점`;
}

export function DashboardAnalysisLab() {
  const [storedResponse, setResponse] = useStored<DiagnosisResponse>(V36_STORAGE_KEYS.dashboardAnalysis, DEFAULT_RESPONSE);
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
  const dataSummary = useMemo(() => buildDataSignalSummary(currentMember), [currentMember]);
  const prompt = useMemo(() => buildPrompt(currentMember, response), [currentMember, response]);
  const checkedCount = REVIEW_ITEMS.filter((item) => response.reviewChecks[item]).length;

  const update = (patch: Partial<DiagnosisResponse>) => {
    setResponse({ ...response, ...patch, savedAt: new Date().toISOString() });
  };

  const selectCandidate = (candidate: HypothesisCandidate) => {
    update({ dataHypothesis: candidate.hypothesis });
    setCopyMessage(`검토 후보 가설을 선택했습니다: ${candidate.hypothesis}`);
  };

  const generateDiagnosis = () => {
    update({ diagnosisStatement: makeDiagnosisStatement(currentMember, response) });
    setCopyMessage('인과 진단문 초안을 생성했습니다. 필요하면 문장을 수정하세요.');
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyMessage('AI 검증 프롬프트를 복사했습니다. 직관, 데이터 가설, 근거 지표가 함께 포함되어 있습니다.');
    } catch {
      setCopyMessage('복사가 차단되었습니다. 프롬프트 영역을 직접 선택해 복사하세요.');
    }
  };

  const applyAiAnswer = () => {
    const parsed = parseAi(response.aiAnswerRaw);
    update(parsed);
    setCopyMessage('AI 답변을 6개 검토 영역으로 분리했습니다.');
  };

  const outputText = `[팀원 실행진단 결과]\n\n[선택 팀원]\n${currentMember.name}\n\n[관찰 프로필]\n${currentMember.profile}\n\n[상황 기반 첫 해석]\n${response.observationIntuition || '-'}\n\n[데이터 기반 진단 가설]\n${response.dataHypothesis || '-'}\n\n[직관과 데이터 비교]\n${response.comparisonChoice || '-'}\n${response.changedReason || ''}\n\n[인과 진단문]\n${response.diagnosisStatement || makeDiagnosisStatement(currentMember, response)}\n\n[기회 만들기 · 선행지표]\n${listOrNone(response.selectedLeadVariables)}\n\n[실행 품질 · 과정지표]\n${listOrNone(response.selectedProcessVariables)}\n\n[고객 반응 · 결과지표]\n${listOrNone(response.selectedResultVariables)}\n\n[팀 학습 · 확산지표]\n${listOrNone(response.selectedDiffusionVariables)}\n\n[안전선 점검 · 가드레일]\n${listOrNone(response.selectedGuardrails)}\n\n[2주 실행 실험]\n${response.selectedExperiments.join(', ') || '-'}\n\n[2주 후 확인 지표]\n${response.selectedCheckMetrics.join(', ') || '-'}\n\n[팀원에게 던질 질문]\n${response.confirmQuestion}\n\n[최종 실행 문장]\n${response.finalActionSentence}`;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
        <p className="font-bold">팀원 실행진단 Lab</p>
        <p className="mt-1">상황만 보고 떠오르는 직관을 먼저 기록한 뒤, 실제 데이터를 근거로 가설을 수정·검증합니다.</p>
      </div>

      <SectionCard title="1단계: 관찰 상황 읽기">
        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">아직 지표를 보지 않습니다. 팀원의 말과 행동만 보고, 팀장으로서 처음 떠오르는 해석을 선택하세요. 이 판단은 정답이 아니라 이후 데이터로 검증할 첫 인상입니다.</div>
        <label className="block space-y-1"><FieldLabel>관찰할 팀원 선택</FieldLabel><select className="w-full rounded-xl border px-3 py-2" value={response.selectedMemberId} onChange={(event) => update({ selectedMemberId: event.target.value, observationIntuition: '', dataHypothesis: '', comparisonChoice: '', changedReason: '', diagnosisStatement: '' })}>{MEMBERS.map((member) => <option key={member.id} value={member.id}>{member.name} · {member.profile}</option>)}</select></label>
        <article className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-700"><div className="flex flex-wrap items-center gap-2"><h4 className="font-bold text-slate-900">{currentMember.name}</h4><span className="rounded-full border bg-white px-3 py-1 text-xs font-bold text-slate-600">관찰 프로필: {currentMember.profile}</span></div><p className="mt-3 leading-6">{currentMember.observation}</p><p className="mt-3 rounded-xl bg-white p-3 font-semibold text-slate-800">“{currentMember.quote}”</p></article>
        <label className="block space-y-1"><FieldLabel>상황만 보고 처음 든 생각</FieldLabel><select className="w-full rounded-xl border px-3 py-2" value={response.observationIntuition} onChange={(event) => update({ observationIntuition: event.target.value })}><option value="">선택하세요</option>{OBSERVATION_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
      </SectionCard>

      <SectionCard title="2단계: 실제 지표 Data 확인과 데이터 기반 가설 세우기">
        <div className="rounded-xl bg-cyan-50 p-3 text-sm text-cyan-900">이제 실제 실행 데이터를 확인합니다. 선행지표, 과정지표, 결과지표, 확산지표, 가드레일을 종합해 처음 판단을 유지할지 수정할지 결정하세요.</div>
        <div className="grid gap-3 md:grid-cols-5">
          {(['기회 만들기', '실행 품질', '고객 반응', '팀 학습', '안전선 점검'] as MetricGroup[]).map((group) => (
            <div key={group} className={`rounded-2xl border p-4 ${groupTone(group)}`}><div className="flex flex-wrap items-center gap-2"><h4 className="font-black">{group}</h4><span className="rounded-full border bg-white/70 px-2 py-0.5 text-[10px] font-black">{expertLabelForGroup(group)}</span></div><p className="mt-2 text-xs leading-5">{group === '기회 만들기' ? '성과 가능성을 만드는 사전 행동' : group === '실행 품질' ? '접점이 다음 행동으로 이어지는 과정 품질' : group === '고객 반응' ? '고객 질문·관심·후속 대화 신호' : group === '팀 학습' ? '개인 경험이 팀 실행 역량으로 퍼지는 정도' : '성과보다 먼저 확인해야 하는 안전 기준'}</p></div>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          {CORE_METRIC_ORDER.map((key) => {
            const meta = METRIC_META[key];
            return <div key={key} className={`rounded-2xl border p-3 ${metricTone(currentMember.metrics[key])}`}><div className="flex items-center justify-between gap-2"><p className="text-xs font-bold text-slate-500">{key}</p><span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${groupTone(meta.group)}`}>{meta.group} · {meta.expertLabel}</span></div><p className="mt-1 text-2xl font-black text-slate-900">{currentMember.metrics[key]}</p><p className="mt-2 text-xs leading-5 text-slate-600">{meta.description}</p></div>;
          })}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {GUARDRAIL_ORDER.map((key) => {
            const status = currentMember.guardrails[key];
            return <div key={key} className={`rounded-2xl border p-4 ${guardrailTone(status)}`}><div className="flex items-center justify-between gap-2"><div><p className="text-sm font-black">{key}</p><p className="text-xs font-bold">안전선 점검 · 가드레일</p></div><span className="rounded-full bg-white/70 px-3 py-1 text-xs font-black">{status}</span></div><p className="mt-2 text-xs leading-5">{METRIC_META[key].description}</p></div>;
          })}
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="font-black text-slate-900">데이터 신호 요약</h4>
              <p className="mt-1 text-sm text-slate-600">강한 신호와 약한 신호의 조합을 보고 우선 검토할 가설을 찾습니다. 이 후보는 정답이 아니라 판단을 돕는 힌트입니다.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className={`rounded-2xl border p-3 ${signalTone('strong')}`}>
              <p className="font-bold">강한 신호</p>
              <div className="mt-2 space-y-2 text-xs">
                {dataSummary.strong.length ? dataSummary.strong.map((item) => <p key={item.key}><b>{item.key}</b> {item.value} · {item.note}</p>) : <p>뚜렷한 강한 신호 없음</p>}
              </div>
            </div>
            <div className={`rounded-2xl border p-3 ${signalTone('weak')}`}>
              <p className="font-bold">약한 신호</p>
              <div className="mt-2 space-y-2 text-xs">
                {dataSummary.weak.length ? dataSummary.weak.map((item) => <p key={item.key}><b>{item.key}</b> {item.value} · {item.note}</p>) : <p>뚜렷한 약한 신호 없음</p>}
              </div>
            </div>
            <div className={`rounded-2xl border p-3 ${dataSummary.guardrailIssues.length ? signalTone('guardrail') : signalTone('strong')}`}>
              <p className="font-bold">안전선 상태</p>
              <div className="mt-2 space-y-2 text-xs">
                {dataSummary.guardrailIssues.length ? dataSummary.guardrailIssues.map((item) => <p key={item.key}><b>{item.key}</b> {item.value}</p>) : <p>현재 주요 안전선 이슈 없음</p>}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-black text-slate-900">검토해볼 만한 가설 후보</p>
            <div className="mt-2 grid gap-3 md:grid-cols-3">
              {dataSummary.candidates.map((candidate) => (
                <button key={candidate.hypothesis} type="button" onClick={() => selectCandidate(candidate)} className={`rounded-2xl border p-4 text-left text-sm transition hover:-translate-y-0.5 hover:shadow ${response.dataHypothesis === candidate.hypothesis ? 'border-cyan-500 bg-cyan-50' : 'bg-white'}`}>
                  <p className="font-black text-slate-900">{candidate.hypothesis}</p>
                  <p className="mt-2 leading-5 text-slate-600">{candidate.reason}</p>
                  {candidate.metrics.length ? <p className="mt-2 text-xs font-bold text-cyan-700">연결 지표: {candidate.metrics.join(', ')}</p> : null}
                </button>
              ))}
            </div>
          </div>
        </div>

        <label className="block space-y-1"><FieldLabel>데이터 조합을 보고 가장 설명력이 큰 진단 가설</FieldLabel><select className="w-full rounded-xl border px-3 py-2" value={response.dataHypothesis} onChange={(event) => update({ dataHypothesis: event.target.value })}><option value="">선택하세요</option>{DATA_HYPOTHESIS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
        {response.dataHypothesis ? <div className="rounded-xl border border-cyan-100 bg-white p-3 text-sm text-cyan-900"><p className="font-bold">왜 이 가설인가?</p><p className="mt-1">{selectedHypothesisReason(currentMember, response.dataHypothesis)}</p></div> : null}
      </SectionCard>

      <SectionCard title="3단계: 직관과 데이터 비교, 근거 지표 선택">
        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">1단계의 직관과 2단계의 데이터 가설이 같은지 비교하세요. 판단이 바뀌었다면 어떤 지표 때문인지 기록합니다.</div>
        <div className="grid gap-3 md:grid-cols-2"><div className="rounded-xl border p-3 text-sm"><p className="font-bold text-slate-500">상황 기반 첫 해석</p><p className="mt-1 text-slate-900">{response.observationIntuition || '아직 선택하지 않음'}</p></div><div className="rounded-xl border p-3 text-sm"><p className="font-bold text-slate-500">데이터 기반 진단 가설</p><p className="mt-1 text-slate-900">{response.dataHypothesis || '아직 선택하지 않음'}</p></div></div>
        <label className="block space-y-1"><FieldLabel>직관과 데이터 비교</FieldLabel><select className="w-full rounded-xl border px-3 py-2" value={response.comparisonChoice} onChange={(event) => update({ comparisonChoice: event.target.value })}><option value="">선택하세요</option>{COMPARISON_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
        <label className="block space-y-1"><FieldLabel>판단이 유지/수정/유보된 이유</FieldLabel><input className="w-full rounded-xl border px-3 py-2" value={response.changedReason} onChange={(event) => update({ changedReason: event.target.value })} placeholder="예: 처음에는 변화 저항으로 봤지만, 실제로는 CRM 기록 품질과 실행 인사이트 재사용도가 낮았다." /></label>
        <div className="grid gap-4 md:grid-cols-5">
          <div><FieldLabel>{groupLabel('기회 만들기')}</FieldLabel><div className="mt-2 space-y-2">{metricOptions('기회 만들기').map((metric) => <label key={metric} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={response.selectedLeadVariables.includes(metric)} onChange={() => update({ selectedLeadVariables: toggle(response.selectedLeadVariables, metric) })} />{metric}</label>)}</div></div>
          <div><FieldLabel>{groupLabel('실행 품질')}</FieldLabel><div className="mt-2 space-y-2">{metricOptions('실행 품질').map((metric) => <label key={metric} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={response.selectedProcessVariables.includes(metric)} onChange={() => update({ selectedProcessVariables: toggle(response.selectedProcessVariables, metric) })} />{metric}</label>)}</div></div>
          <div><FieldLabel>{groupLabel('고객 반응')}</FieldLabel><div className="mt-2 space-y-2">{metricOptions('고객 반응').map((metric) => <label key={metric} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={response.selectedResultVariables.includes(metric)} onChange={() => update({ selectedResultVariables: toggle(response.selectedResultVariables, metric) })} />{metric}</label>)}</div></div>
          <div><FieldLabel>{groupLabel('팀 학습')}</FieldLabel><div className="mt-2 space-y-2">{metricOptions('팀 학습').map((metric) => <label key={metric} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={response.selectedDiffusionVariables.includes(metric)} onChange={() => update({ selectedDiffusionVariables: toggle(response.selectedDiffusionVariables, metric) })} />{metric}</label>)}</div></div>
          <div><FieldLabel>{groupLabel('안전선 점검')}</FieldLabel><div className="mt-2 space-y-2">{GUARDRAIL_ORDER.map((metric) => <label key={metric} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={response.selectedGuardrails.includes(metric)} onChange={() => update({ selectedGuardrails: toggle(response.selectedGuardrails, metric) })} />{metric}</label>)}</div></div>
        </div>
        <button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={generateDiagnosis}>인과 진단문 생성</button>
        <label className="block space-y-1"><FieldLabel>인과 진단문</FieldLabel><textarea className="min-h-28 w-full rounded-xl border px-3 py-2" value={response.diagnosisStatement} onChange={(event) => update({ diagnosisStatement: event.target.value })} /></label>
      </SectionCard>

      <SectionCard title="4단계: 2주 실행 실험과 확인 지표 선택">
        <div className="rounded-xl bg-cyan-50 p-3 text-sm text-cyan-900">복수 선택 가능 · 2주 동안 실제로 실행 가능한 실험은 2개 이내, 확인 지표는 2~3개를 권장합니다.</div>
        <div><FieldLabel>2주 실행 실험</FieldLabel><div className="mt-2 grid gap-2 md:grid-cols-2">{EXPERIMENT_OPTIONS.map((item) => <label key={item} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={response.selectedExperiments.includes(item)} onChange={() => update({ selectedExperiments: toggle(response.selectedExperiments, item) })} />{item}</label>)}</div><p className="mt-2 text-xs text-slate-500">현재 선택: {response.selectedExperiments.length}개 / 권장: 최대 2개</p></div>
        <div><FieldLabel>2주 후 확인 지표</FieldLabel><div className="mt-2 grid gap-2 md:grid-cols-3">{CHECK_METRIC_OPTIONS.map((item) => <label key={item} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={response.selectedCheckMetrics.includes(item)} onChange={() => update({ selectedCheckMetrics: toggle(response.selectedCheckMetrics, item) })} />{item}</label>)}</div><p className="mt-2 text-xs text-slate-500">현재 선택: {response.selectedCheckMetrics.length}개 / 권장: 2~3개</p></div>
      </SectionCard>

      <SectionCard title="5단계: AI로 반대 가능성 점검">
        <div className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-700"><p className="font-bold text-slate-900">AI 프롬프트에 반영되는 선택 요약</p><div className="mt-3 grid gap-2 md:grid-cols-2"><p><b>상황 기반 첫 해석:</b> {response.observationIntuition || '-'}</p><p><b>데이터 기반 진단 가설:</b> {response.dataHypothesis || '-'}</p><p><b>직관과 데이터 비교:</b> {response.comparisonChoice || '-'}</p><p><b>비교 이유:</b> {response.changedReason || '-'}</p><p><b>기회 만들기·선행지표:</b> {listOrNone(response.selectedLeadVariables)}</p><p><b>실행 품질·과정지표:</b> {listOrNone(response.selectedProcessVariables)}</p><p><b>고객 반응·결과지표:</b> {listOrNone(response.selectedResultVariables)}</p><p><b>팀 학습·확산지표:</b> {listOrNone(response.selectedDiffusionVariables)}</p><p><b>안전선 점검·가드레일:</b> {listOrNone(response.selectedGuardrails)}</p><p><b>2주 실험:</b> {response.selectedExperiments.join(', ') || '-'}</p></div></div>
        <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm text-slate-600">AI는 진단을 대신 만드는 것이 아니라, 직관과 데이터 가설의 차이를 검증하고 놓친 가능성을 찾습니다.</p><button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={copyPrompt}>프롬프트 복사</button></div>
        {copyMessage ? <p className="text-sm font-semibold text-cyan-700">{copyMessage}</p> : null}
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{prompt}</pre>
        <textarea className="min-h-40 w-full rounded-xl border px-3 py-2" value={response.aiAnswerRaw} onChange={(event) => update({ aiAnswerRaw: event.target.value })} placeholder="AI 답변을 붙여넣으세요. ## 1~6 제목을 기준으로 자동 분리할 수 있습니다." />
        <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white" onClick={applyAiAnswer}>AI 답변 6개 영역으로 분리</button>
        <label className="block space-y-1"><FieldLabel>직관과 데이터 가설 구분 점검</FieldLabel><textarea className="min-h-20 w-full rounded-xl border px-3 py-2" value={response.aiProfileCheck} onChange={(event) => update({ aiProfileCheck: event.target.value })} /></label>
        <label className="block space-y-1"><FieldLabel>선행·과정·결과·확산지표 연결 점검</FieldLabel><textarea className="min-h-20 w-full rounded-xl border px-3 py-2" value={response.aiPathCheck} onChange={(event) => update({ aiPathCheck: event.target.value })} /></label>
        <label className="block space-y-1"><FieldLabel>이 진단이 틀렸을 가능성</FieldLabel><textarea className="min-h-20 w-full rounded-xl border px-3 py-2" value={response.aiCounter} onChange={(event) => update({ aiCounter: event.target.value })} /></label>
        <label className="block space-y-1"><FieldLabel>팀장이 확인해야 할 질문</FieldLabel><textarea className="min-h-20 w-full rounded-xl border px-3 py-2" value={response.aiQuestions} onChange={(event) => update({ aiQuestions: event.target.value })} /></label>
      </SectionCard>

      <SectionCard title="6단계: 최종 실행 문장">
        <label className="block space-y-1"><FieldLabel>팀원에게 던질 확인 질문</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.confirmQuestion} onChange={(event) => update({ confirmQuestion: event.target.value })} placeholder="예: 제가 처음 본 것과 데이터가 조금 다르게 보입니다. 실제로는 어느 지점이 가장 막히고 있나요?" /></label>
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
