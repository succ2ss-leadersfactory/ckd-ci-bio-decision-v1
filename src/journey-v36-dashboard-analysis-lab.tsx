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

type MetricMeta = { group: MetricGroup; expertLabel: ExpertMetricLabel; description: string };
type SignalItem = { key: string; value: number | GuardrailStatus; note: string };
type Hint = { title: string; reason: string; metrics: string[]; priority: number };

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
  selectedExperiments: string[];
  selectedCheckMetrics: string[];
  aiAnswerRaw: string;
  diagnosisStatement: string;
  finalActionSentence: string;
  reviewChecks: Record<string, boolean>;
  savedAt: string;
};

const CORE_GROUPS: MetricGroup[] = ['기회 만들기', '실행 품질', '고객 반응', '팀 학습'];
const CORE_METRIC_ORDER = ['계획 접점 실행률', '핵심 고객군 커버리지', '사전 인사이트 준비도', '메시지-니즈 적합도', 'CRM 기록 품질', '후속조치 실행률', '실행 적시성', '고객 인게이지먼트 지수', '후속 대화 연결지수', '고객 대화 지속성', '팀 학습 기여도', '실행 인사이트 재사용도'];
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
  { id: 'M01', name: '신재영 대리', profile: '접점 활동 적극 수행', observation: '고객 접점 활동이 많고 이동 동선도 넓다. 회의에서는 “저는 누구보다 많이 움직이고 있다”고 말하지만, 방문 이후 어떤 대화가 이어졌는지는 설명이 짧다.', quote: '저는 누구보다 많이 움직이고 있습니다.', metrics: { '계획 접점 실행률': 112, '핵심 고객군 커버리지': 96, '사전 인사이트 준비도': 62, '메시지-니즈 적합도': 58, 'CRM 기록 품질': 64, '후속조치 실행률': 58, '실행 적시성': 68, '고객 인게이지먼트 지수': 62, '후속 대화 연결지수': 54, '고객 대화 지속성': 57, '팀 학습 기여도': 61, '실행 인사이트 재사용도': 52 }, guardrails: { '컴플라이언스 위험 점검': '주의', 'AI 입력 안전 점검': '안전' } },
  { id: 'M02', name: '이대은 대리', profile: '담당처 자율 관리 성향', observation: '고객과의 관계와 후속 대화는 안정적이다. 다만 팀 회의에서는 자신의 방식 공유를 부담스러워하고, 동료의 질문에는 “각자 담당처는 본인이 책임지는 것”이라고 선을 긋는다.', quote: '각자 자기 담당처는 본인이 책임지는 게 맞지 않나요?', metrics: { '계획 접점 실행률': 91, '핵심 고객군 커버리지': 88, '사전 인사이트 준비도': 82, '메시지-니즈 적합도': 86, 'CRM 기록 품질': 72, '후속조치 실행률': 74, '실행 적시성': 81, '고객 인게이지먼트 지수': 84, '후속 대화 연결지수': 128, '고객 대화 지속성': 88, '팀 학습 기여도': 42, '실행 인사이트 재사용도': 38 }, guardrails: { '컴플라이언스 위험 점검': '안전', 'AI 입력 안전 점검': '안전' } },
  { id: 'M03', name: '박재욱 사원', profile: '신규 역할 적응 중', observation: 'CRM 기록은 꼼꼼하게 남기지만 고객 앞에서는 질문이 짧아진다. 방문 전 준비 자료는 많지만, 실제 대화에서 고객의 참여를 끌어내는 데 어려움을 느낀다.', quote: '제가 가면 오히려 불편해하시는 것 같습니다.', metrics: { '계획 접점 실행률': 72, '핵심 고객군 커버리지': 69, '사전 인사이트 준비도': 54, '메시지-니즈 적합도': 57, 'CRM 기록 품질': 90, '후속조치 실행률': 67, '실행 적시성': 76, '고객 인게이지먼트 지수': 51, '후속 대화 연결지수': 48, '고객 대화 지속성': 50, '팀 학습 기여도': 70, '실행 인사이트 재사용도': 63 }, guardrails: { '컴플라이언스 위험 점검': '안전', 'AI 입력 안전 점검': '안전' } },
  { id: 'M04', name: '유희관 과장', profile: '장기 담당처 관계 보유', observation: '담당처와의 관계는 안정적이다. 그러나 새로운 기록 기준이나 실행 방식이 나오면 “현장에서는 그런 방식이 잘 안 맞는다”고 말하며 신중한 태도를 보인다.', quote: '현장에서는 그런 방식이 잘 안 맞습니다.', metrics: { '계획 접점 실행률': 86, '핵심 고객군 커버리지': 92, '사전 인사이트 준비도': 78, '메시지-니즈 적합도': 61, 'CRM 기록 품질': 55, '후속조치 실행률': 63, '실행 적시성': 64, '고객 인게이지먼트 지수': 76, '후속 대화 연결지수': 82, '고객 대화 지속성': 86, '팀 학습 기여도': 58, '실행 인사이트 재사용도': 45 }, guardrails: { '컴플라이언스 위험 점검': '주의', 'AI 입력 안전 점검': '안전' } },
  { id: 'M05', name: '김문호 차장', profile: '최근 목표 압박 노출', observation: '최근 목표 압박을 크게 느끼고 있다. 회의에서 지역 상황과 외부 요인을 자주 언급하며, 본인의 실행으로 바꿀 수 있는 부분에 대해서는 말을 아낀다.', quote: '이번 지역 상황은 제가 어떻게 할 수 있는 게 아닙니다.', metrics: { '계획 접점 실행률': 79, '핵심 고객군 커버리지': 75, '사전 인사이트 준비도': 63, '메시지-니즈 적합도': 60, 'CRM 기록 품질': 68, '후속조치 실행률': 61, '실행 적시성': 52, '고객 인게이지먼트 지수': 60, '후속 대화 연결지수': 68, '고객 대화 지속성': 59, '팀 학습 기여도': 55, '실행 인사이트 재사용도': 50 }, guardrails: { '컴플라이언스 위험 점검': '안전', 'AI 입력 안전 점검': '주의' } },
  { id: 'M06', name: '김재호 차장', profile: '현장 요청 우선 대응', observation: '고객의 현장 요청에는 빠르게 대응한다. 하지만 사후 기록과 후속 실행 정리는 뒤로 밀리는 경우가 반복되고, 본인은 “현장 대응이 먼저”라고 설명한다.', quote: '현장 대응하느라 입력은 나중에 하게 됩니다.', metrics: { '계획 접점 실행률': 93, '핵심 고객군 커버리지': 81, '사전 인사이트 준비도': 74, '메시지-니즈 적합도': 69, 'CRM 기록 품질': 41, '후속조치 실행률': 45, '실행 적시성': 48, '고객 인게이지먼트 지수': 69, '후속 대화 연결지수': 73, '고객 대화 지속성': 71, '팀 학습 기여도': 62, '실행 인사이트 재사용도': 56 }, guardrails: { '컴플라이언스 위험 점검': '안전', 'AI 입력 안전 점검': '점검 필요' } },
];

const OBSERVATION_OPTIONS = ['활동은 충분하지만 방향이 흐릿해 보인다', '의지는 있으나 자신감이 낮아 보인다', '자기 방식에 익숙해 변화가 어려워 보인다', '성과는 좋지만 팀 기여는 약해 보인다', '목표 부담 때문에 방어적으로 보인다', '현장 대응은 빠르지만 정리가 부족해 보인다', '안전선 확인이 먼저 필요해 보인다', '아직 판단하기 어렵다'];
const COMPARISON_OPTIONS = ['처음 판단을 유지한다', '데이터를 보고 판단을 수정한다', '처음 판단과 데이터가 일부만 일치한다', '아직 판단을 유보한다'];
const REVIEW_ITEMS = ['상황만 보고 처음 든 생각을 기록했다', '데이터 신호 요약을 확인했다', '핵심 근거 지표 2~4개를 선택했다', '가설 생성 후 직접 수정·보완했다', '직관과 데이터 비교 및 이유를 기록했다', '최종 2주 실행 문장을 작성했다'];

const DEFAULT_RESPONSE: DiagnosisResponse = {
  selectedMemberId: 'M01', observationIntuition: '', dataHypothesis: '', comparisonChoice: '', changedReason: '',
  selectedLeadVariables: [], selectedProcessVariables: [], selectedResultVariables: [], selectedDiffusionVariables: [], selectedGuardrails: [],
  selectedExperiments: [], selectedCheckMetrics: [], aiAnswerRaw: '', diagnosisStatement: '', finalActionSentence: '', reviewChecks: {}, savedAt: '',
};

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-2xl border bg-white p-5 shadow-sm"><h3 className="text-lg font-bold text-slate-900">{title}</h3><div className="mt-4 space-y-4">{children}</div></section>;
}
function FieldLabel({ children }: { children: string }) { return <span className="text-xs font-bold text-slate-500">{children}</span>; }
function getMember(id: string) { return MEMBERS.find((member) => member.id === id) ?? MEMBERS[0]; }
function toggle(items: string[], item: string) { return items.includes(item) ? items.filter((value) => value !== item) : [...items, item]; }
function metricValue(member: Member, key: string) { return member.metrics[key] ?? 0; }
function metricTone(value: number) { if (value >= 85) return 'border-cyan-200 bg-cyan-50'; if (value >= 70) return 'border-amber-200 bg-amber-50'; return 'border-red-200 bg-red-50'; }
function signalTone(type: 'strong' | 'weak' | 'guardrail') { if (type === 'strong') return 'border-cyan-200 bg-cyan-50 text-cyan-900'; if (type === 'weak') return 'border-red-200 bg-red-50 text-red-900'; return 'border-amber-200 bg-amber-50 text-amber-900'; }
function guardrailTone(status: GuardrailStatus) { if (status === '안전') return 'border-cyan-200 bg-cyan-50 text-cyan-800'; if (status === '주의') return 'border-amber-200 bg-amber-50 text-amber-800'; return 'border-red-200 bg-red-50 text-red-800'; }
function groupTone(group: MetricGroup) { if (group === '기회 만들기') return 'bg-blue-50 text-blue-700 border-blue-100'; if (group === '실행 품질') return 'bg-amber-50 text-amber-700 border-amber-100'; if (group === '고객 반응') return 'bg-emerald-50 text-emerald-700 border-emerald-100'; if (group === '팀 학습') return 'bg-purple-50 text-purple-700 border-purple-100'; return 'bg-rose-50 text-rose-700 border-rose-100'; }
function expertLabelForGroup(group: MetricGroup): ExpertMetricLabel { if (group === '기회 만들기') return '선행지표'; if (group === '실행 품질') return '과정지표'; if (group === '고객 반응') return '결과지표'; if (group === '팀 학습') return '확산지표'; return '가드레일'; }
function groupLabel(group: MetricGroup) { return `${group} · ${expertLabelForGroup(group)}`; }
function metricOptions(group: MetricGroup) { return CORE_METRIC_ORDER.filter((key) => METRIC_META[key].group === group); }
function makeSignalItem(member: Member, key: string): SignalItem { return { key, value: metricValue(member, key), note: `${METRIC_META[key].group} · ${METRIC_META[key].expertLabel}` }; }
function createHint(title: string, reason: string, metrics: string[], priority: number): Hint { return { title, reason, metrics, priority }; }

function buildDataSignalSummary(member: Member) {
  const strong = CORE_METRIC_ORDER.filter((key) => metricValue(member, key) >= 85).map((key) => makeSignalItem(member, key)).slice(0, 5);
  const weak = CORE_METRIC_ORDER.filter((key) => metricValue(member, key) < 65).map((key) => makeSignalItem(member, key));
  const guardrailIssues = GUARDRAIL_ORDER.filter((key) => member.guardrails[key] !== '안전').map((key) => ({ key, value: member.guardrails[key], note: '안전선 점검 · 가드레일' }));
  const hints: Hint[] = [];
  if (metricValue(member, '계획 접점 실행률') < 75 || metricValue(member, '핵심 고객군 커버리지') < 75) hints.push(createHint('접점 기회 부족 가능성', '성과 가능성을 만드는 접점 기회부터 확인할 수 있습니다.', ['계획 접점 실행률', '핵심 고객군 커버리지'], 70));
  if (metricValue(member, '사전 인사이트 준비도') < 70 && metricValue(member, '메시지-니즈 적합도') < 75) hints.push(createHint('사전 준비 부족 가능성', '방문 전 고객 맥락과 대화 목적 준비를 점검할 수 있습니다.', ['사전 인사이트 준비도', '메시지-니즈 적합도'], 72));
  if (['CRM 기록 품질', '후속조치 실행률', '실행 적시성'].filter((key) => metricValue(member, key) < 70).length >= 2) hints.push(createHint('기록·후속 실행 단절 가능성', '접점 이후 다음 행동이 끊기는지 확인할 수 있습니다.', ['CRM 기록 품질', '후속조치 실행률', '실행 적시성'], 83));
  if (metricValue(member, '팀 학습 기여도') < 65 || metricValue(member, '실행 인사이트 재사용도') < 65) hints.push(createHint('팀 학습 확산 부족 가능성', '개인 경험이 팀의 공유 자산으로 전환되는지 점검할 수 있습니다.', ['팀 학습 기여도', '실행 인사이트 재사용도'], 82));
  if (guardrailIssues.length > 0) hints.push(createHint('안전선 우선 점검 필요', '실행 강화보다 컴플라이언스 또는 AI 입력 안전선을 먼저 확인해야 합니다.', guardrailIssues.map((item) => item.key), 95));
  return { strong, weak, guardrailIssues, hints: hints.sort((a, b) => b.priority - a.priority).slice(0, 3) };
}

function selectedEvidence(response: DiagnosisResponse) { return [...response.selectedLeadVariables, ...response.selectedProcessVariables, ...response.selectedResultVariables, ...response.selectedDiffusionVariables, ...response.selectedGuardrails]; }
function selectedEvidenceItems(member: Member, response: DiagnosisResponse) {
  return selectedEvidence(response).map((key) => ({ key, value: GUARDRAIL_ORDER.includes(key) ? member.guardrails[key] : metricValue(member, key), group: METRIC_META[key].group, expertLabel: METRIC_META[key].expertLabel }));
}
function describeEvidence(items: Array<{ key: string; value: number | GuardrailStatus; group: MetricGroup; expertLabel: ExpertMetricLabel }>) { return items.length ? items.map((item) => `${item.key} ${item.value}(${item.group}·${item.expertLabel})`).join(', ') : '선택한 핵심 근거 지표가 아직 없습니다.'; }
function buildRecommendedChecks(member: Member) { return CORE_METRIC_ORDER.filter((key) => metricValue(member, key) < 70).slice(0, 3).concat(GUARDRAIL_ORDER.filter((key) => member.guardrails[key] !== '안전')); }
function buildRecommendedExperiments(member: Member) {
  const items: string[] = [];
  if (member.guardrails['컴플라이언스 위험 점검'] !== '안전' || member.guardrails['AI 입력 안전 점검'] !== '안전') items.push('AI 입력 전 고객명·병원명·민감정보 제거 체크');
  if (metricValue(member, '팀 학습 기여도') < 65 || metricValue(member, '실행 인사이트 재사용도') < 65) items.push('성공·실패 인사이트 1개를 팀 회의에서 공유');
  if (['CRM 기록 품질', '후속조치 실행률', '실행 적시성'].some((key) => metricValue(member, key) < 65)) items.push('콜 이후 24시간 내 CRM에 고객 반응과 다음 행동 기록');
  if (metricValue(member, '메시지-니즈 적합도') < 70) items.push('고객 니즈에 맞춘 안전 메시지 2문장 재작성');
  if (metricValue(member, '후속 대화 연결지수') < 70) items.push('2주 동안 후속 대화 연결 시도 기록');
  if (metricValue(member, '사전 인사이트 준비도') < 70) items.push('콜 전 고객별 질문 2개와 대화 목적 1개 준비');
  return Array.from(new Set(items)).slice(0, 3).concat(items.length === 0 ? ['팀원과 1on1로 데이터 해석 차이를 확인하고 2주 실행행동 1개 합의'] : []);
}

function generateHypothesis(member: Member, response: DiagnosisResponse) {
  const items = selectedEvidenceItems(member, response);
  if (!items.length) return '선택한 핵심 근거 지표가 아직 없습니다. 강한 신호, 약한 신호, 안전선 상태 중 진단 가설에 가장 큰 영향을 준 지표 2~4개를 먼저 선택하세요.';
  const strong = items.filter((item) => typeof item.value === 'number' && item.value >= 85);
  const weak = items.filter((item) => typeof item.value === 'number' && item.value < 70);
  const guardrails = items.filter((item) => item.group === '안전선 점검' && item.value !== '안전');
  const groups = new Set(items.map((item) => item.group));
  const strongPart = strong.length ? `${strong.map((item) => `${item.key} ${item.value}`).join(', ')}는 강하게 나타나지만` : '일부 실행 신호는 확인되지만';
  const weakPart = weak.length ? `${weak.map((item) => `${item.key} ${item.value}`).join(', ')}가 낮아` : `${items.map((item) => `${item.key} ${item.value}`).join(', ')}를 함께 보면`;
  let bottleneck = '선택한 지표들 사이의 연결 구조를 추가로 확인할 필요가 있다';
  if (groups.has('팀 학습')) bottleneck = '개인의 실행 경험이 팀 학습과 재사용 가능한 실행 자산으로 충분히 확산되지 않는 상황으로 보인다';
  else if (groups.has('고객 반응')) bottleneck = '고객 반응이나 후속 대화 연결에서 병목이 있는 상황으로 보인다';
  else if (groups.has('실행 품질')) bottleneck = '접점 이후 메시지 품질, 기록, 후속 실행 과정에서 병목이 있는 상황으로 보인다';
  else if (groups.has('기회 만들기')) bottleneck = '성과 가능성을 만드는 사전 준비나 접점 기회 형성에서 병목이 있는 상황으로 보인다';
  if (guardrails.length) bottleneck = '실행 강화보다 컴플라이언스와 AI 입력 안전선을 먼저 점검해야 하는 상황으로 보인다';
  const guardPart = guardrails.length ? ` 또한 ${guardrails.map((item) => `${item.key} ${item.value}`).join(', ')} 상태이므로 안전선 확인이 우선 필요하다.` : '';
  return `${member.name}은/는 ${strongPart}, ${weakPart} ${bottleneck}.${guardPart} 다만 이 판단은 지표만으로 단정하기보다 1on1에서 실제 실행 맥락과 방해 요인을 확인해야 한다.`;
}

function makeDiagnosisStatement(member: Member, response: DiagnosisResponse) {
  const experiments = response.selectedExperiments.length ? response.selectedExperiments.join(', ') : '2주 실행 실험 1개';
  const checks = response.selectedCheckMetrics.length ? response.selectedCheckMetrics.join(', ') : buildRecommendedChecks(member).join(', ') || '핵심 지표 2~3개';
  return `${member.name}에 대한 상황 기반 첫 해석은 “${response.observationIntuition || '미기록'}”이었다. 데이터를 확인한 뒤 작성한 가설은 “${response.dataHypothesis || '미기록'}”이다. 핵심 근거 지표는 ${describeEvidence(selectedEvidenceItems(member, response))}이며, 직관과 데이터 비교 결과는 “${response.comparisonChoice || '미기록'}”이다. 따라서 2주 동안 ${experiments}을/를 실행하고, ${checks}의 변화를 확인한다.`;
}

function buildPrompt(member: Member, response: DiagnosisResponse) {
  const summary = buildDataSignalSummary(member);
  return `당신은 제약영업팀장의 팀원 실행진단을 돕는 리더십 코치입니다.\n\n[팀원]\n${member.name}\n\n[관찰 상황]\n${member.observation}\n\n[상황만 보고 처음 든 생각]\n${response.observationIntuition || '-'}\n\n[핵심 근거 지표]\n${describeEvidence(selectedEvidenceItems(member, response))}\n\n[데이터 기반 진단 가설]\n${response.dataHypothesis || '-'}\n\n[직관과 데이터 비교]\n${response.comparisonChoice || '-'}\n${response.changedReason || '-'}\n\n[데이터 신호 요약]\n강한 신호: ${summary.strong.map((item) => `${item.key} ${item.value}`).join(', ') || '-'}\n약한 신호: ${summary.weak.map((item) => `${item.key} ${item.value}`).join(', ') || '-'}\n안전선 이슈: ${summary.guardrailIssues.map((item) => `${item.key} ${item.value}`).join(', ') || '현재 주요 이슈 없음'}\n\n[최종 실행 문장]\n${response.finalActionSentence || '-'}\n\n검토 요청:\n1. 데이터 기반 진단 가설이 선택한 핵심 근거 지표를 충분히 반영했는지 점검하세요.\n2. 선행지표→과정지표→결과지표→확산지표 연결에서 빠진 부분을 짚어주세요.\n3. 팀장이 팀원에게 확인해야 할 질문을 제안하세요.\n4. 2주 실행 문장을 더 현실적으로 다듬어 주세요.\n5. 컴플라이언스와 AI 입력 안전선 관점의 주의점을 제안하세요.`;
}

function MetricEvidenceCard({ metric, member, selected, onToggle }: { metric: string; member: Member; selected: boolean; onToggle: () => void }) {
  const meta = METRIC_META[metric];
  const value = metricValue(member, metric);
  return <button type="button" aria-pressed={selected} onClick={onToggle} className={`relative rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow ${selected ? 'border-cyan-600 bg-cyan-50 ring-2 ring-cyan-300 shadow-md' : metricTone(value)}`}><div className="flex items-start justify-between gap-2"><p className="pr-16 text-xs font-black text-slate-600">{metric}</p><span className={`absolute right-3 top-3 rounded-full border px-2 py-0.5 text-[10px] font-black ${selected ? 'border-cyan-500 bg-cyan-700 text-white' : 'border-slate-200 bg-white text-slate-500'}`}>{selected ? '✓ 선택됨' : '선택'}</span></div><p className="mt-2 text-2xl font-black text-slate-900">{value}</p><p className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${groupTone(meta.group)}`}>{meta.group} · {meta.expertLabel}</p><p className="mt-2 text-xs leading-5 text-slate-600">{meta.description}</p></button>;
}

function GuardrailEvidenceCard({ metric, member, selected, onToggle }: { metric: string; member: Member; selected: boolean; onToggle: () => void }) {
  const status = member.guardrails[metric];
  return <button type="button" aria-pressed={selected} onClick={onToggle} className={`relative rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow ${selected ? 'border-cyan-600 bg-cyan-50 text-cyan-900 ring-2 ring-cyan-300 shadow-md' : guardrailTone(status)}`}><div className="flex items-start justify-between gap-2"><div><p className="pr-16 text-xs font-black">{metric}</p><p className="mt-1 text-xs font-bold">안전선 점검 · 가드레일</p></div><span className={`absolute right-3 top-3 rounded-full border px-2 py-0.5 text-[10px] font-black ${selected ? 'border-cyan-500 bg-cyan-700 text-white' : 'bg-white/80 text-slate-600'}`}>{selected ? '✓ 선택됨' : status}</span></div><p className="mt-2 text-xs leading-5">{METRIC_META[metric].description}</p></button>;
}

function SelectedEvidenceSummary({ items }: { items: Array<{ key: string; value: number | GuardrailStatus; group: MetricGroup; expertLabel: ExpertMetricLabel }> }) {
  if (!items.length) return <div className="rounded-2xl border border-dashed bg-white p-3 text-sm text-slate-500">아직 선택한 지표가 없습니다. 아래 카드에서 핵심 근거 지표를 선택하세요.</div>;
  return <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-3"><p className="text-xs font-black text-cyan-900">현재 선택된 핵심 근거 지표</p><div className="mt-2 flex flex-wrap gap-2">{items.map((item) => <span key={item.key} className="rounded-full border border-cyan-300 bg-white px-3 py-1 text-xs font-bold text-cyan-900">✓ {item.key} {item.value} · {item.expertLabel}</span>)}</div></div>;
}

export function DashboardAnalysisLab() {
  const [storedResponse, setResponse] = useStored<DiagnosisResponse>(V36_STORAGE_KEYS.dashboardAnalysis, DEFAULT_RESPONSE);
  const response = { ...DEFAULT_RESPONSE, ...storedResponse, selectedLeadVariables: storedResponse.selectedLeadVariables ?? [], selectedProcessVariables: storedResponse.selectedProcessVariables ?? [], selectedResultVariables: storedResponse.selectedResultVariables ?? [], selectedDiffusionVariables: storedResponse.selectedDiffusionVariables ?? [], selectedGuardrails: storedResponse.selectedGuardrails ?? [], selectedExperiments: storedResponse.selectedExperiments ?? [], selectedCheckMetrics: storedResponse.selectedCheckMetrics ?? [], reviewChecks: storedResponse.reviewChecks ?? {} };
  const [copyMessage, setCopyMessage] = useState('');
  const [showHints, setShowHints] = useState(false);
  const currentMember = getMember(response.selectedMemberId);
  const summary = useMemo(() => buildDataSignalSummary(currentMember), [currentMember]);
  const recommendedExperiments = useMemo(() => buildRecommendedExperiments(currentMember), [currentMember]);
  const recommendedChecks = useMemo(() => buildRecommendedChecks(currentMember), [currentMember]);
  const prompt = useMemo(() => buildPrompt(currentMember, response), [currentMember, response]);
  const checkedCount = Object.values(response.reviewChecks).filter(Boolean).length;
  const evidenceItems = selectedEvidenceItems(currentMember, response);
  const evidenceCount = evidenceItems.length;
  const selectionMessage = evidenceCount === 0 ? '아직 선택 전' : evidenceCount < 2 ? '1개 선택됨 · 2개 이상 권장' : evidenceCount <= 4 ? `${evidenceCount}개 선택됨 · 적정` : `${evidenceCount}개 선택됨 · 4개 이하로 줄이면 더 좋습니다`;

  const update = (patch: Partial<DiagnosisResponse>) => setResponse({ ...response, ...patch, savedAt: new Date().toISOString() });
  const generateDataHypothesis = () => { update({ dataHypothesis: generateHypothesis(currentMember, response) }); setCopyMessage('선택한 지표 조합으로 진단 가설 초안을 생성했습니다. 현장 맥락에 맞게 수정하세요.'); };
  const generateDiagnosis = () => { update({ diagnosisStatement: makeDiagnosisStatement(currentMember, response) }); setCopyMessage('요약 문장을 생성했습니다. 필요하면 문장을 수정하세요.'); };
  const copyPrompt = async () => { try { await navigator.clipboard.writeText(prompt); setCopyMessage('AI 검증 프롬프트를 복사했습니다.'); } catch { setCopyMessage('복사가 차단되었습니다. 프롬프트 영역을 직접 선택해 복사하세요.'); } };

  const outputText = `[팀원 실행진단 결과]\n\n[선택 팀원]\n${currentMember.name}\n\n[상황 기반 첫 해석]\n${response.observationIntuition || '-'}\n\n[핵심 근거 지표]\n${describeEvidence(evidenceItems)}\n\n[데이터 기반 진단 가설]\n${response.dataHypothesis || '-'}\n\n[직관과 데이터 비교]\n${response.comparisonChoice || '-'}\n${response.changedReason || ''}\n\n[2주 실행 실험]\n${response.selectedExperiments.join(', ') || '-'}\n\n[확인할 지표]\n${(response.selectedCheckMetrics.length ? response.selectedCheckMetrics : recommendedChecks).join(', ') || '-'}\n\n[최종 실행 문장]\n${response.finalActionSentence || '-'}\n\n[AI 검토 후 보완]\n${response.aiAnswerRaw || '-'}`;

  return <div className="space-y-4">
    <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900"><p className="font-bold">팀원 실행진단 Lab</p><p className="mt-1">2단계에서 지표를 개별 카드로 확인하고, 선택한 지표 조합으로 진단 가설 초안을 생성합니다.</p></div>

    <SectionCard title="1단계: 관찰만 보고 판단하기">
      <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">아직 지표를 보지 않습니다. 팀원의 말과 행동만 보고 팀장으로서 처음 떠오르는 해석을 선택하세요.</div>
      <label className="block space-y-1"><FieldLabel>관찰할 팀원 선택</FieldLabel><select className="w-full rounded-xl border px-3 py-2" value={response.selectedMemberId} onChange={(event) => update({ selectedMemberId: event.target.value, observationIntuition: '', dataHypothesis: '', comparisonChoice: '', changedReason: '', diagnosisStatement: '', selectedExperiments: [], selectedCheckMetrics: [], selectedLeadVariables: [], selectedProcessVariables: [], selectedResultVariables: [], selectedDiffusionVariables: [], selectedGuardrails: [], finalActionSentence: '' })}>{MEMBERS.map((member) => <option key={member.id} value={member.id}>{member.name} · {member.profile}</option>)}</select></label>
      <article className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-700"><div className="flex flex-wrap items-center gap-2"><h4 className="font-bold text-slate-900">{currentMember.name}</h4><span className="rounded-full border bg-white px-3 py-1 text-xs font-bold text-slate-600">관찰 프로필: {currentMember.profile}</span></div><p className="mt-3 leading-6">{currentMember.observation}</p><p className="mt-3 rounded-xl bg-white p-3 font-semibold text-slate-800">“{currentMember.quote}”</p></article>
      <label className="block space-y-1"><FieldLabel>상황만 보고 처음 든 생각</FieldLabel><select className="w-full rounded-xl border px-3 py-2" value={response.observationIntuition} onChange={(event) => update({ observationIntuition: event.target.value })}><option value="">선택하세요</option>{OBSERVATION_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
    </SectionCard>

    <SectionCard title="2단계: 데이터로 판단 수정하기">
      <div className="rounded-xl bg-cyan-50 p-3 text-sm text-cyan-900">강한 신호, 약한 신호, 안전선 상태를 먼저 확인한 뒤, 아래 지표 카드 중 진단 가설에 가장 큰 영향을 준 지표 2~4개를 선택하세요.</div>
      <div className="grid gap-3 md:grid-cols-3"><div className={`rounded-2xl border p-3 ${signalTone('strong')}`}><p className="font-bold">강한 신호</p><div className="mt-2 space-y-2 text-xs">{summary.strong.length ? summary.strong.map((item) => <p key={item.key}><b>{item.key}</b> {item.value} · {item.note}</p>) : <p>뚜렷한 강한 신호 없음</p>}</div></div><div className={`rounded-2xl border p-3 ${signalTone('weak')}`}><p className="font-bold">약한 신호</p><div className="mt-2 space-y-2 text-xs">{summary.weak.length ? summary.weak.map((item) => <p key={item.key}><b>{item.key}</b> {item.value} · {item.note}</p>) : <p>뚜렷한 약한 신호 없음</p>}</div></div><div className={`rounded-2xl border p-3 ${summary.guardrailIssues.length ? signalTone('guardrail') : signalTone('strong')}`}><p className="font-bold">안전선 상태</p><div className="mt-2 space-y-2 text-xs">{summary.guardrailIssues.length ? summary.guardrailIssues.map((item) => <p key={item.key}><b>{item.key}</b> {item.value}</p>) : <p>현재 주요 안전선 이슈 없음</p>}</div></div></div>
      <div className="rounded-2xl border bg-slate-50 p-4 text-sm"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="font-black text-slate-900">핵심 근거 지표 선택</p><p className="mt-1 text-xs text-slate-500">각 지표를 별도 카드로 보여줍니다. 선택 전/후를 배지와 테두리로 구분합니다.</p></div><span className={`rounded-full px-3 py-1 text-xs font-black ${evidenceCount >= 2 && evidenceCount <= 4 ? 'bg-cyan-100 text-cyan-800' : 'bg-amber-100 text-amber-800'}`}>{selectionMessage}</span></div>
        <div className="mt-3"><SelectedEvidenceSummary items={evidenceItems} /></div>
        <div className="mt-4 space-y-4">{CORE_GROUPS.map((group) => <div key={group}><p className="mb-2 text-xs font-black text-slate-600">{groupLabel(group)}</p><div className="grid gap-3 md:grid-cols-3">{metricOptions(group).map((metric) => {
          const selectedMap: Record<MetricGroup, string[]> = { '기회 만들기': response.selectedLeadVariables, '실행 품질': response.selectedProcessVariables, '고객 반응': response.selectedResultVariables, '팀 학습': response.selectedDiffusionVariables, '안전선 점검': response.selectedGuardrails };
          const patchMap: Record<MetricGroup, Partial<DiagnosisResponse>> = { '기회 만들기': { selectedLeadVariables: toggle(response.selectedLeadVariables, metric) }, '실행 품질': { selectedProcessVariables: toggle(response.selectedProcessVariables, metric) }, '고객 반응': { selectedResultVariables: toggle(response.selectedResultVariables, metric) }, '팀 학습': { selectedDiffusionVariables: toggle(response.selectedDiffusionVariables, metric) }, '안전선 점검': { selectedGuardrails: toggle(response.selectedGuardrails, metric) } };
          return <MetricEvidenceCard key={metric} metric={metric} member={currentMember} selected={selectedMap[group].includes(metric)} onToggle={() => update(patchMap[group])} />;
        })}</div></div>)}<div><p className="mb-2 text-xs font-black text-slate-600">안전선 점검 · 가드레일</p><div className="grid gap-3 md:grid-cols-2">{GUARDRAIL_ORDER.map((metric) => <GuardrailEvidenceCard key={metric} metric={metric} member={currentMember} selected={response.selectedGuardrails.includes(metric)} onToggle={() => update({ selectedGuardrails: toggle(response.selectedGuardrails, metric) })} />)}</div></div></div>
        <div className="mt-4 flex justify-end"><button className="rounded-xl border bg-white px-3 py-1.5 text-xs font-bold text-slate-700" onClick={() => setShowHints((value) => !value)}>{showHints ? '진단 힌트 숨기기' : '진단 힌트 보기'}</button></div>
      </div>
      {showHints ? <div className="rounded-2xl border bg-slate-50 p-4 text-sm"><p className="font-black text-slate-900">진단 문장 작성 힌트</p><p className="mt-1 text-xs text-slate-500">힌트는 참고자료입니다. 선택한 핵심 근거 지표와 연결해 직접 문장화하세요.</p><div className="mt-3 grid gap-3 md:grid-cols-3">{summary.hints.length ? summary.hints.map((hint) => <div key={hint.title} className="rounded-xl border bg-white p-3"><p className="font-bold text-slate-900">{hint.title}</p><p className="mt-1 text-xs leading-5 text-slate-600">{hint.reason}</p><p className="mt-2 text-xs font-bold text-cyan-700">관련 지표: {hint.metrics.join(', ')}</p></div>) : <p className="text-xs text-slate-500">뚜렷한 힌트 없음</p>}</div></div> : null}
      <div className="rounded-2xl border bg-white p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="font-black text-slate-900">데이터를 보고 다시 세운 나의 진단 가설</p><p className="mt-1 text-xs text-slate-500">선택한 지표 조합으로 초안을 만든 뒤, 현장 맥락에 맞게 직접 수정하세요.</p></div><button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={generateDataHypothesis}>선택 지표로 가설 생성</button></div><textarea className="mt-3 min-h-32 w-full rounded-xl border px-3 py-2" value={response.dataHypothesis} onChange={(event) => update({ dataHypothesis: event.target.value })} placeholder="예: 고객 반응은 강하지만 팀 학습 지표가 낮아 개인 경험이 팀 자산으로 확산되지 않는 상황으로 보인다. 다만 그 이유는 1on1에서 확인해야 한다." /></div>
    </SectionCard>

    <SectionCard title="3단계: 내 판단 변화 확인하기"><div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">여기서는 팀원을 다시 진단하지 않습니다. 내 처음 판단이 데이터로 유지됐는지, 수정됐는지, 유보됐는지만 짧게 확인합니다.</div><div className="grid gap-3 md:grid-cols-2"><div className="rounded-xl border p-3 text-sm"><p className="font-bold text-slate-500">처음 든 생각</p><p className="mt-1 text-slate-900">{response.observationIntuition || '아직 선택하지 않음'}</p></div><div className="rounded-xl border p-3 text-sm"><p className="font-bold text-slate-500">데이터 기반 가설</p><p className="mt-1 whitespace-pre-wrap text-slate-900">{response.dataHypothesis || '아직 작성하지 않음'}</p></div></div><label className="block space-y-1"><FieldLabel>직관과 데이터 비교</FieldLabel><select className="w-full rounded-xl border px-3 py-2" value={response.comparisonChoice} onChange={(event) => update({ comparisonChoice: event.target.value })}><option value="">선택하세요</option>{COMPARISON_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select></label><label className="block space-y-1"><FieldLabel>판단이 유지/수정/유보된 이유 한 줄</FieldLabel><input className="w-full rounded-xl border px-3 py-2" value={response.changedReason} onChange={(event) => update({ changedReason: event.target.value })} placeholder="예: 처음에는 태도 문제로 봤지만, 데이터상으로는 팀 학습 확산의 문제로 보였다." /></label></SectionCard>

    <SectionCard title="4단계: 2주 실행안 만들기"><div className="rounded-xl bg-cyan-50 p-3 text-sm text-cyan-900">추천 실행 실험 중 하나만 선택하고, 최종 실행 문장을 직접 다듬습니다.</div><div><FieldLabel>추천 실행 실험 하나 선택</FieldLabel><div className="mt-2 grid gap-2 md:grid-cols-3">{recommendedExperiments.map((item) => <button key={item} className={`rounded-xl border p-3 text-left text-sm font-semibold ${response.selectedExperiments.includes(item) ? 'border-cyan-500 bg-cyan-50 text-cyan-900' : 'bg-white text-slate-700'}`} onClick={() => update({ selectedExperiments: [item] })}>{item}</button>)}</div></div><div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700"><b>확인할 지표 추천:</b> {(response.selectedCheckMetrics.length ? response.selectedCheckMetrics : recommendedChecks).join(', ') || '팀원 1on1 대화 내용'}</div><label className="block space-y-1"><FieldLabel>최종 2주 실행 문장</FieldLabel><textarea className="min-h-28 w-full rounded-xl border px-3 py-2" value={response.finalActionSentence} onChange={(event) => update({ finalActionSentence: event.target.value })} placeholder="예: 2주 동안 성공 콜 사례 1개를 팀 회의에서 공유하게 하고, 실행 인사이트 재사용도와 팀원 반응을 확인한다." /></label></SectionCard>

    <SectionCard title="5단계: AI로 점검하기 선택사항"><div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">AI는 답을 대신 만드는 도구가 아니라, 내가 쓴 가설과 실행문장의 빠진 부분을 점검하는 보조 도구입니다.</div><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm text-slate-600">프롬프트에는 상황, 데이터 요약, 핵심 근거 지표, 내가 작성한 가설, 실행문장이 포함됩니다.</p><button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={copyPrompt}>프롬프트 복사</button></div>{copyMessage ? <p className="text-sm font-semibold text-cyan-700">{copyMessage}</p> : null}<pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{prompt}</pre><label className="block space-y-1"><FieldLabel>AI 답변 붙여넣기</FieldLabel><textarea className="min-h-32 w-full rounded-xl border px-3 py-2" value={response.aiAnswerRaw} onChange={(event) => update({ aiAnswerRaw: event.target.value })} placeholder="AI가 제안한 보완점 중 실제 적용할 내용만 남기세요." /></label></SectionCard>

    <SectionCard title="최종 산출물"><div className="grid gap-2 md:grid-cols-2">{REVIEW_ITEMS.map((item) => <label key={item} className="flex items-start gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" className="mt-1" checked={Boolean(response.reviewChecks[item])} onChange={(event) => update({ reviewChecks: { ...response.reviewChecks, [item]: event.target.checked } })} /><span>{item}</span></label>)}</div><div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">점검 완료: {checkedCount} / {REVIEW_ITEMS.length}</div><button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={generateDiagnosis}>요약 문장 생성</button><label className="block space-y-1"><FieldLabel>요약 문장</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.diagnosisStatement} onChange={(event) => update({ diagnosisStatement: event.target.value })} /></label><pre className="whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{outputText}</pre><p className="text-xs text-slate-500">자동 저장 키: {V36_STORAGE_KEYS.dashboardAnalysis} / 마지막 저장: {response.savedAt || '아직 입력 전'}</p></SectionCard>
  </div>;
}

export default DashboardAnalysisLab;
