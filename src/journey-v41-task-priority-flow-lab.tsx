import { type ReactNode } from 'react';
import { useStored } from './journey-storage';

const V41_TASK_PRIORITY_FLOW_MARKERS = [
  'V41TaskPriorityFlowLab',
  '할 일·줄일 일',
  '7단계: 업무 순서와 업무지시 만들기',
  '7단계: 실행방식 결정하기',
  '업무지시 초안 최적화 프롬프트',
  '6단계 실행계획 확인',
  '6단계 요약 입력값',
  '긴 원문 표시 금지',
  '업무 순서 정하기',
  '실행 순서 결정하기',
  '역할과 책임 정하기',
  '역할과 책임 결정하기',
  '일정과 체크포인트 정하기',
  '일정과 점검방식 결정하기',
  '업무량 조정: 이번 주기에는 잠시 줄일 일',
  'AI로 실행방식 3안 추천받기',
  'AI로 업무지시 초안 만들기',
  '사람 검토 후 최종 업무지시 확정',
  '검토 체크리스트',
  '8단계 업무 경계·병목 대응으로 넘기기',
  '성과기준 재해석 금지',
  '사람관리 판단 금지',
  'ckd.v41.taskManagement.v10',
].join('|');
void V41_TASK_PRIORITY_FLOW_MARKERS;

type ExecutionCycle = '1주' | '2주' | '4주' | '월간' | '분기';

type RoleDecision = {
  owner?: string;
  leaderCheck?: string;
  collaboration?: string;
};

type DecisionOption = {
  id: string;
  title: string;
  description: string;
};

type TaskState = Record<string, any> & {
  executionCycle?: ExecutionCycle;
  managementTaskType?: string;
  managementTask?: string;
  selectedOutput?: string;
  outputLocation?: string;
  completionStandard?: string;
  evidenceToCheck?: string;
  selectedWorkItems?: string;
  workItemCompletionCriteria?: string;
  excludedWorkItems?: string;
  step7ExecutionPlanConfirmed?: boolean;
  sequenceDecisionType?: string;
  selectedSequenceOption?: string;
  orderedWorkSteps?: string;
  roleDecisionMatrix?: Record<string, RoleDecision>;
  roleResponsibilityMap?: string;
  checkpointDecisionType?: string;
  selectedCheckpointQuestions?: string[];
  selectedEvidenceChecks?: string[];
  scheduleCheckpoints?: string;
  selectedReduceTasks?: string[];
  selectedWorkloadReductionReasons?: string[];
  workloadAdjustments?: string;
  step7AiPrompt?: string;
  step7AiResult?: string;
  step7HumanReview?: string;
  step7ReviewChecklist?: string[];
  step7InstructionTone?: string;
  step7AiRevisionMode?: string;
  taskInstructionDraft?: string;
  finalTaskInstruction?: string;
  selectedStep8HandoffSignals?: string[];
  step7HandoffToStep8?: string;
};

const STORAGE_KEY = 'ckd.v41.taskManagement.v10';
const DEFAULT_TASK_STATE: TaskState = {};

const SEQUENCE_OPTIONS: DecisionOption[] = [
  { id: 'output-first', title: '산출물 구조 먼저', description: '먼저 표·양식·기록 위치를 고정한 뒤 세부 내용을 채웁니다.' },
  { id: 'risk-first', title: '누락 위험 먼저', description: '누락·오류가 생기면 영향이 큰 업무부터 먼저 처리합니다.' },
  { id: 'impact-first', title: '고객 영향 먼저', description: '고객 반응, 다음 행동, 현장 실행에 직접 영향을 주는 항목부터 정리합니다.' },
  { id: 'quick-win', title: '빠른 완료 먼저', description: '짧게 끝낼 수 있는 항목을 먼저 완료해 실행 속도를 만듭니다.' },
  { id: 'leader-check-first', title: '팀장 확인 필요 먼저', description: '팀장 확인이 필요한 기준·표현·권한 이슈부터 먼저 정리합니다.' },
];

const OWNER_OPTIONS = ['담당자 개인', '담당자 + 동료', '팀 공통', '팀장 주도'];
const LEADER_CHECK_OPTIONS = ['산출물만 확인', '중간 과정 확인', '고객 반응까지 확인', '위험 표현만 확인'];
const COLLABORATION_OPTIONS = ['협업 없음', '동료 확인 필요', '내부 담당자 확인 필요', '팀장 연결 필요'];

const CHECKPOINT_OPTIONS: DecisionOption[] = [
  { id: 'two-days', title: '시작 후 2일', description: '초기 방향이 맞는지 빠르게 확인합니다.' },
  { id: 'week-one', title: '1주차 종료', description: '실행관리 주기 중간에 누락·지연을 확인합니다.' },
  { id: 'before-meeting', title: '중간 회의 전', description: '회의에서 말로 설명하기 전에 산출물로 확인합니다.' },
  { id: 'three-days-before', title: '마감 3일 전', description: '마감 직전 수정이 몰리지 않도록 미리 점검합니다.' },
];

const CHECKPOINT_QUESTIONS = [
  '현재까지 기록된 내용 중 다음 행동이 비어 있는 항목은 무엇인가요?',
  '정해진 기록 위치에 산출물이 남아 있나요?',
  '누락 여부와 다음 행동 여부를 확인할 수 있나요?',
  '팀원 단독으로 판단하기 어려운 고객 요청이나 표현이 있나요?',
  '마감 전 팀장 확인이 필요한 항목은 무엇인가요?',
];

const EVIDENCE_CHECKS = [
  '산출물 등록 여부',
  '누락 항목 표시 여부',
  '다음 행동 입력 여부',
  '담당자 표시 여부',
  '고객 반응 요약 여부',
];

const REDUCE_TASKS = [
  '6단계 업무산출물과 연결되지 않는 추가 자료 만들기',
  '최종 선택 업무 단위 밖의 업무를 함께 진행하기',
  '역할·일정이 정해지기 전에 모든 업무를 동시에 시작하기',
  '고객 설득 논리나 제품 메시지 개발로 확장하기',
  '담당자별 성과목표 배분이나 KPI 변경 논의하기',
  '병목 원인 분석과 에스컬레이션 설계를 7단계에서 깊게 다루기',
];

const REVIEW_CHECKLIST = [
  '업무 배경이 너무 길지 않다',
  '해야 할 일이 3~5개로 보인다',
  '최종 산출물이 분명하다',
  '완료 기준이 확인 가능하다',
  '역할과 책임이 모호하지 않다',
  '중간 확인 시점이 있다',
  '잠시 줄일 일이 포함되어 있다',
  '팀원 역량·태도·동기 판단 표현이 없다',
  '병목·에스컬레이션은 8단계로 넘겼다',
];

const INSTRUCTION_TONES = ['간결한 업무지시', '현장 말투', '회의 공유용', '메신저 전달용'];
const STEP8_HANDOFF_SIGNALS = ['업무 경계 필요', '병목 예상', '담당자 권한 밖 이슈', '에스컬레이션 후보', '팀장 개입 후보'];

function compact(value?: string) {
  return value?.trim() || '미작성';
}

function short(value?: string, max = 160) {
  const text = compact(value).replace(/\s+/g, ' ');
  if (text === '미작성') return text;
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function stripSentenceEnd(value: string) {
  return value
    .replace(/\s+/g, ' ')
    .replace(/[.。]\s*$/g, '')
    .replace(/(을|를)\s*(작성|정리|확인|등록|표시|구분|보완)한다$/g, '')
    .replace(/(작성|정리|확인|등록|표시|구분|보완)한다$/g, '')
    .trim();
}

function displayOutputName(output?: string, managementTask?: string) {
  const raw = compact(output);
  const task = compact(managementTask);
  if (raw === '미작성') return '미작성';
  const suffix = '의 결과로 남길 업무산출물';
  if (raw.includes(suffix)) {
    const base = stripSentenceEnd(raw.replace(suffix, '').replace(task, task));
    if (base.includes('관리표')) return base.replace(/관리표.*$/g, '관리표');
    if (base.includes('현황')) return base.replace(/현황.*$/g, '현황표');
    if (base.includes('리스트')) return base.replace(/리스트.*$/g, '리스트');
    return `${base} 산출물`;
  }
  return short(raw, 120);
}

function displayCompletionStandard(completion?: string, managementTask?: string) {
  const raw = compact(completion);
  const task = compact(managementTask);
  if (raw === '미작성') return '미작성';
  if (task !== '미작성' && raw.includes(task)) {
    return '정해진 위치에 산출물이 남고, 누락 여부와 다음 행동 여부가 확인 가능해야 한다.';
  }
  return short(raw, 140);
}

function splitLines(value?: string, max = 6) {
  return compact(value)
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-•]\s*/, '').trim())
    .filter(Boolean)
    .slice(0, max);
}

function toggle(list: string[] = [], value: string, max = 3) {
  if (list.includes(value)) return list.filter((item) => item !== value);
  if (list.length >= max) return list;
  return [...list, value];
}

function getSequenceOption(id?: string) {
  return SEQUENCE_OPTIONS.find((option) => option.id === id) ?? SEQUENCE_OPTIONS[1];
}

function getCheckpointOption(id?: string) {
  return CHECKPOINT_OPTIONS.find((option) => option.id === id) ?? CHECKPOINT_OPTIONS[1];
}

function defaultRoleDecision(): RoleDecision {
  return {
    owner: OWNER_OPTIONS[0],
    leaderCheck: LEADER_CHECK_OPTIONS[0],
    collaboration: COLLABORATION_OPTIONS[0],
  };
}

function normalizeCriterionLine(line: string, item?: string) {
  let text = line.replace(/^[-•]\s*/, '').trim();
  if (item && text.startsWith(`${item}:`)) text = text.slice(item.length + 1).trim();
  return text || '완료 기준을 확인할 수 있음';
}

function criterionForWorkItem(item: string, criteria: string[], index: number) {
  const exact = criteria.find((criterion) => criterion.startsWith(`${item}:`) || criterion.includes(`${item}:`));
  if (exact) return normalizeCriterionLine(exact, item);
  const contains = criteria.find((criterion) => criterion.includes(item));
  if (contains) return normalizeCriterionLine(contains, item);
  return normalizeCriterionLine(criteria[index] || '완료 기준을 확인할 수 있음', item);
}

function buildWorkItemCriteriaPrompt(items: string[], criteria: string[]) {
  const source = items.length ? items : ['최종 선택 업무 단위'];
  return source.map((item, index) => `${index + 1}. ${item}\n- 완료 기준: ${criterionForWorkItem(item, criteria, index)}`).join('\n\n');
}

function instructionOutputName(output: string, managementTask: string, items: string[]) {
  const raw = compact(output);
  const basis = `${raw} ${managementTask} ${items.join(' ')}`;
  if (raw === '미작성') return '업무지시 산출물';
  if (/산출물$/.test(raw) || raw.length > 38) {
    if (basis.includes('선택 기준')) return '핵심 고객별 선택 기준 확인 현황표';
    if (basis.includes('고객 반응') || basis.includes('다음 행동')) return '고객 반응 및 다음 행동 확인표';
    if (basis.includes('기록')) return '업무 기록 정리 현황표';
    if (basis.includes('누락')) return '누락 항목 점검표';
    return '업무 실행 현황표';
  }
  return raw;
}

function locationInstruction(location?: string) {
  const raw = compact(location);
  if (raw === '미작성') return '정해진 기록 위치 1곳';
  if (raw.includes('중 하나') || raw.includes(',')) {
    return `${raw}\n※ 업무지시 초안에서는 임의로 특정 위치를 선택하지 말고, “팀장이 정한 기록 위치 1곳에 등록한다”는 실행 문장으로 정리하세요.`;
  }
  return raw;
}

function finalCheckTiming(cycle: string, checkpointTitle: string) {
  if (cycle === '1주' && checkpointTitle === '1주차 종료') {
    return '중간 확인: 마감 전 2일 / 최종 확인: 1주차 종료';
  }
  return `중간 확인: ${checkpointTitle} / 최종 확인: 실행관리 주기 종료 시점`;
}

function Card({ title, children, tone = 'slate' }: { title: string; children: ReactNode; tone?: 'slate' | 'amber' | 'cyan' | 'emerald' | 'violet' }) {
  const border = tone === 'amber' ? 'border-amber-100' : tone === 'cyan' ? 'border-cyan-100' : tone === 'emerald' ? 'border-emerald-100' : tone === 'violet' ? 'border-violet-100' : 'border-slate-200';
  return <section className={`rounded-3xl border ${border} bg-white p-4 shadow-sm md:p-5`}><h3 className="text-lg font-black text-slate-950">{title}</h3><div className="mt-4 space-y-3">{children}</div></section>;
}

function Field({ label, help, value, onChange, placeholder, minHeight = 'min-h-28' }: { label: string; help?: string; value: string; onChange: (value: string) => void; placeholder: string; minHeight?: string }) {
  return <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="text-sm font-black text-slate-950">{label}</span>{help ? <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{help}</p> : null}<textarea className={`${minHeight} mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100`} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

function ChoiceCard({ selected, title, description, onClick }: { selected: boolean; title: string; description: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`rounded-2xl border p-4 text-left transition ${selected ? 'border-amber-300 bg-amber-50 shadow-sm' : 'border-slate-200 bg-slate-50 hover:border-amber-200'}`}>
    <p className="text-sm font-black text-slate-950">{title}</p>
    <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{description}</p>
  </button>;
}

function MultiCheck({ checked, label, onChange }: { checked: boolean; label: string; onChange: () => void }) {
  return <label className={`flex gap-2 rounded-2xl border p-3 text-sm font-bold ${checked ? 'border-amber-200 bg-amber-50 text-amber-950' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span>{label}</span>
  </label>;
}

function SelectBox({ value, options, onChange }: { value: string; options: string[]; onChange: (value: string) => void }) {
  return <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100" value={value} onChange={(event) => onChange(event.target.value)}>
    {options.map((option) => <option key={option} value={option}>{option}</option>)}
  </select>;
}

function SummaryLine({ label, value }: { label: string; value?: string }) {
  return <p><span className="font-black text-slate-700">{label}: </span><span>{short(value)}</span></p>;
}

function buildSequenceDraft(items: string[], criteria: string[], optionId?: string) {
  const source = items.length ? items : ['최종 선택 업무 단위를 먼저 확인한다.'];
  const option = getSequenceOption(optionId);
  return [
    `결정 기준: ${option.title}`,
    `선택 이유: ${option.description}`,
    '',
    ...source.map((item, index) => {
      const criterion = criterionForWorkItem(item, criteria, index);
      return `${index + 1}. ${item}\n- 시작 조건: 이전 단계 입력값과 기존 기록을 확인할 수 있음\n- 완료 기준: ${criterion}`;
    }),
  ].join('\n');
}

function buildRoleDraft(items: string[], matrix?: Record<string, RoleDecision>) {
  const source = items.length ? items : ['최종 선택 업무 단위'];
  return source.map((item, index) => {
    const role = { ...defaultRoleDecision(), ...(matrix?.[item] ?? {}) };
    return `${index + 1}. ${item}\n- 주 실행: ${role.owner}\n- 팀장 확인: ${role.leaderCheck}\n- 협업 방식: ${role.collaboration}`;
  }).join('\n\n');
}

function buildCheckpointDraft(params: { cycle: string; output: string; location: string; completion: string; checkpointId?: string; selectedQuestions?: string[]; selectedEvidence?: string[] }) {
  const checkpoint = getCheckpointOption(params.checkpointId);
  const questions = params.selectedQuestions?.length ? params.selectedQuestions : CHECKPOINT_QUESTIONS.slice(0, 2);
  const evidence = params.selectedEvidence?.length ? params.selectedEvidence : EVIDENCE_CHECKS.slice(0, 3);
  return [
    `실행관리 주기: ${params.cycle}`,
    `점검 시점: ${finalCheckTiming(params.cycle, checkpoint.title)}`,
    `확인할 산출물: ${params.output}`,
    `기록 위치: ${params.location}`,
    `완료 기준: ${params.completion}`,
    `확인 증거: ${evidence.join(', ')}`,
    '중간 확인 질문:',
    ...questions.map((question) => `- ${question}`),
  ].join('\n');
}

function buildWorkloadDraft(reduceTasks: string[], reasons: string[]) {
  const selected = reduceTasks.length ? reduceTasks : ['업무산출물과 직접 연결되지 않는 활동은 줄입니다.'];
  const reasonText = reasons.length ? reasons : ['이번 단계는 실행방식 결정과 업무지시 초안 작성에 집중해야 하기 때문입니다.'];
  return [
    '이번 주기에 잠시 줄일 일:',
    ...selected.map((task) => `- ${task}`),
    '',
    '선택 이유:',
    ...reasonText.map((reason) => `- ${reason}`),
  ].join('\n');
}

function buildInstructionFromFields(state: TaskState, output: string, completion: string) {
  const reduce = splitLines(state.workloadAdjustments || (state.selectedReduceTasks ?? []).join('\n'), 4);
  return [
    `이번 주기에는 ${compact(state.managementTask)} 업무를 진행합니다.`,
    '',
    `최종 산출물은 ${output}입니다. 기록 위치는 ${compact(state.outputLocation)}로 맞춥니다.`,
    `완료 기준은 ${completion}`,
    '',
    '진행 순서는 다음과 같습니다.',
    compact(state.orderedWorkSteps),
    '',
    '역할과 책임은 아래 기준으로 정합니다.',
    compact(state.roleResponsibilityMap),
    '',
    '일정과 체크포인트는 아래 기준으로 관리합니다.',
    compact(state.scheduleCheckpoints),
    '',
    '이번 주기에는 아래 활동을 잠시 줄입니다.',
    ...(reduce.length ? reduce.map((item) => `- ${item}`) : ['- 업무산출물과 직접 연결되지 않는 활동은 줄입니다.']),
  ].join('\n');
}

export function V41TaskPriorityFlowLab() {
  const [state, setState] = useStored<TaskState>(STORAGE_KEY, DEFAULT_TASK_STATE);
  const update = (patch: Partial<TaskState>) => setState({ ...state, ...patch });

  const executionCycle = state.executionCycle ?? '2주';
  const workItems = splitLines(state.selectedWorkItems, 5);
  const criteria = splitLines(state.workItemCompletionCriteria, 8);
  const excluded = splitLines(state.excludedWorkItems, 8);
  const reduceTasks = state.selectedReduceTasks ?? [];
  const displayOutput = displayOutputName(state.selectedOutput, state.managementTask);
  const displayCompletion = displayCompletionStandard(state.completionStandard, state.managementTask);
  const outputForInstruction = instructionOutputName(displayOutput, compact(state.managementTask), workItems);
  const locationForInstruction = locationInstruction(state.outputLocation);
  const evidence = `${outputForInstruction} / ${compact(state.outputLocation)} / 누락·다음 행동 확인 흔적`;
  const roleMatrix = state.roleDecisionMatrix ?? {};
  const selectedQuestions = state.selectedCheckpointQuestions ?? [];
  const selectedEvidence = state.selectedEvidenceChecks ?? [];
  const reviewChecklist = state.step7ReviewChecklist ?? [];
  const sequenceOption = getSequenceOption(state.selectedSequenceOption);
  const checkpointOption = getCheckpointOption(state.checkpointDecisionType);
  const selectedStep8Signals = state.selectedStep8HandoffSignals ?? [];

  const sequenceDraft = buildSequenceDraft(workItems, criteria, state.selectedSequenceOption);
  const roleDraft = buildRoleDraft(workItems, roleMatrix);
  const checkpointDraft = buildCheckpointDraft({ cycle: executionCycle, output: outputForInstruction, location: locationForInstruction, completion: displayCompletion, checkpointId: state.checkpointDecisionType, selectedQuestions, selectedEvidence });
  const workloadDraft = buildWorkloadDraft(reduceTasks, state.selectedWorkloadReductionReasons ?? []);
  const workItemCriteriaPrompt = buildWorkItemCriteriaPrompt(workItems, criteria);

  const applyAiDecisionRecommendation = () => update({
    sequenceDecisionType: 'AI 추천안 중 선택',
    selectedSequenceOption: state.selectedSequenceOption || 'risk-first',
    checkpointDecisionType: state.checkpointDecisionType || 'week-one',
    selectedCheckpointQuestions: selectedQuestions.length ? selectedQuestions : CHECKPOINT_QUESTIONS.slice(0, 2),
    selectedEvidenceChecks: selectedEvidence.length ? selectedEvidence : EVIDENCE_CHECKS.slice(0, 3),
    selectedReduceTasks: reduceTasks.length ? reduceTasks : REDUCE_TASKS.slice(0, 2),
    selectedWorkloadReductionReasons: state.selectedWorkloadReductionReasons?.length ? state.selectedWorkloadReductionReasons : [
      '이번 단계의 목적은 산출물 완성과 완료 기준 확인에 집중하는 것이기 때문입니다.',
      '역할과 일정이 정해지기 전에 모든 업무를 동시에 시작하면 중복과 누락이 커질 수 있기 때문입니다.',
    ],
    step7AiPrompt: '',
  });

  const updateRoleDecision = (item: string, patch: RoleDecision) => {
    const current = { ...defaultRoleDecision(), ...(roleMatrix[item] ?? {}) };
    update({ roleDecisionMatrix: { ...roleMatrix, [item]: { ...current, ...patch } }, step7AiPrompt: '' });
  };

  const buildDecisionDrafts = () => update({
    orderedWorkSteps: sequenceDraft,
    roleResponsibilityMap: roleDraft,
    scheduleCheckpoints: checkpointDraft,
    workloadAdjustments: workloadDraft,
    step7AiPrompt: '',
  });

  const buildAiPrompt = () => update({
    orderedWorkSteps: state.orderedWorkSteps || sequenceDraft,
    roleResponsibilityMap: state.roleResponsibilityMap || roleDraft,
    scheduleCheckpoints: state.scheduleCheckpoints || checkpointDraft,
    workloadAdjustments: state.workloadAdjustments || workloadDraft,
    step7AiPrompt: [
      '역할: 당신은 제약영업팀장의 업무관리 실행지시 초안을 작성하는 전문가입니다.',
      '',
      '[최종 결과물]',
      '팀원이 바로 이해하고 실행할 수 있는 업무지시 초안을 작성해 주세요.',
      '결과물은 설명문, 분석문, 조언문이 아니라 “팀장 업무지시 초안”이어야 합니다.',
      '',
      '[작성 원칙]',
      '1. 아래 선택값만 사용해 업무지시 초안을 작성합니다.',
      '2. 어색한 원문 표현은 업무지시용 문장으로 자연스럽게 다듬되, 의미를 바꾸지 않습니다.',
      '3. 산출물명은 명사형으로 짧고 분명하게 씁니다.',
      '4. 최종 업무 단위와 완료 기준은 아래 1:1 매칭만 사용합니다.',
      '5. 지시는 짧고 구체적으로 씁니다. 팀원이 “무엇을, 어디에, 언제까지, 어떤 기준으로” 해야 하는지 보여야 합니다.',
      '',
      '[업무 배경]',
      `이번 주기에는 ${compact(state.managementTask)} 업무를 실행합니다.`,
      '',
      '[관리할 업무과제]',
      compact(state.managementTask),
      '',
      '[업무산출물]',
      outputForInstruction,
      '',
      '[기록 위치]',
      locationForInstruction,
      '',
      '[완료 기준]',
      displayCompletion,
      '',
      '[최종 업무 단위와 완료 기준]',
      workItemCriteriaPrompt,
      '',
      '[실행 순서 결정]',
      `기준: ${sequenceOption.title}`,
      `이유: ${sequenceOption.description}`,
      `실행 순서:\n${state.orderedWorkSteps || sequenceDraft}`,
      '',
      '[역할과 책임]',
      '아래 선택값을 “업무지시 문장”으로 바꾸어 작성하세요.',
      state.roleResponsibilityMap || roleDraft,
      '',
      '[일정과 점검]',
      `실행관리 주기: ${executionCycle}`,
      `점검 시점: ${finalCheckTiming(executionCycle, checkpointOption.title)}`,
      `확인 증거: ${(selectedEvidence.length ? selectedEvidence : EVIDENCE_CHECKS.slice(0, 3)).join(', ')}`,
      '중간 확인 질문:',
      ...(selectedQuestions.length ? selectedQuestions : CHECKPOINT_QUESTIONS.slice(0, 2)).map((question) => `- ${question}`),
      '',
      '[이번 주기에 잠시 줄일 일]',
      ...(reduceTasks.length ? reduceTasks : ['업무산출물과 직접 연결되지 않는 활동은 줄입니다.']).map((task) => `- ${task}`),
      '',
      '[이번 업무지시에 포함하지 말 것]',
      ...(excluded.length ? excluded : ['신규 조사, 고객 인터뷰, 대응 계획 수립, 성과목표 배분, 병목 원인 분석']).map((item) => `- ${item}`),
      '- KPI, CSF, 전략과제 재해석',
      '- 팀원의 역량, 태도, 동기, 코칭 필요 여부 판단',
      '- 병목 원인 분석이나 에스컬레이션 기준 확정',
      '',
      '[말투]',
      `${state.step7InstructionTone || '간결한 업무지시'} 방식으로 작성합니다.`,
      '',
      '[출력 형식]',
      '1. 업무 배경',
      '2. 이번 주기에 해야 할 일',
      '3. 최종 산출물',
      '4. 완료 기준',
      '5. 역할과 책임',
      '6. 일정과 중간 확인',
      '7. 이번 주기에 잠시 줄일 일',
      '8. 팀장 확인 문장',
      '',
      '[출력 제한]',
      '- 위 8개 항목만 작성하세요.',
      '- 새로운 업무, 새로운 기준, 새로운 사람 판단을 만들지 마세요.',
      '- 각 항목은 팀원이 바로 실행할 수 있는 문장으로 작성하세요.',
      '- 필요 이상으로 길게 설명하지 마세요.',
    ].join('\n'),
  });

  const copyAiPrompt = async () => {
    const prompt = compact(state.step7AiPrompt);
    if (prompt === '미작성') { window.alert('먼저 AI 업무지시 프롬프트 만들기를 눌러 주세요.'); return; }
    try { await navigator.clipboard.writeText(prompt); window.alert('7단계 AI 프롬프트를 복사했습니다.'); } catch { window.prompt('아래 프롬프트를 직접 복사해 주세요.', prompt); }
  };

  const makeInstructionDraft = () => {
    const baseDraft = compact(state.step7AiResult) !== '미작성'
      ? state.step7AiResult
      : buildInstructionFromFields({ ...state, orderedWorkSteps: state.orderedWorkSteps || sequenceDraft, roleResponsibilityMap: state.roleResponsibilityMap || roleDraft, scheduleCheckpoints: state.scheduleCheckpoints || checkpointDraft, workloadAdjustments: state.workloadAdjustments || workloadDraft }, outputForInstruction, displayCompletion);
    const reviewNote = reviewChecklist.length ? `\n\n[팀장 검토 통과 항목]\n${reviewChecklist.map((item) => `- ${item}`).join('\n')}` : '';
    const humanReview = state.step7HumanReview ? `\n\n[사람 검토 보완]\n${state.step7HumanReview}` : '';
    const draft = [baseDraft, reviewNote, humanReview].filter(Boolean).join('');
    update({ taskInstructionDraft: draft, finalTaskInstruction: draft });
  };

  const makeStep8Handoff = () => update({
    step7HandoffToStep8: [
      '[8단계 전달 메모]',
      `선택한 경계·병목 후보: ${selectedStep8Signals.length ? selectedStep8Signals.join(', ') : '업무 경계 필요, 병목 예상'}`,
      `업무 경계가 필요한 부분: ${excluded.length ? excluded.join(', ') : '6단계에서 제외한 업무와 최종 선택 업무 단위의 경계'}`,
      `병목이 예상되는 부분: ${checkpointOption.title}까지 산출물 등록, 누락 표시, 다음 행동 입력이 확인되지 않는 경우`,
      '담당자 권한 밖 이슈: 고객 데이터 접근, 부서 협조, 시스템 입력 권한, 기록 위치 변경 등',
      '에스컬레이션 후보: 반복 지연, 산출물 미등록, 필수 기록 누락, 역할 충돌',
      '주의: 이 메모는 사람 판단이 아니라 업무 경계와 프로세스 병목 후보입니다.',
    ].join('\n'),
  });

  return <section className="space-y-4">
    <section className="rounded-3xl border border-amber-100 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-amber-700">업무 순서와 업무지시</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">7단계: 업무 순서와 업무지시 만들기</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-600">6단계 실행계획을 다시 쓰지 않고, 실행 순서·역할·점검방식·줄일 일을 선택해 의사결정합니다. 최종 결과물은 팀원이 바로 실행할 수 있는 업무지시 초안입니다.</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs font-black text-amber-800"><span className="rounded-full bg-amber-50 px-3 py-1">업무지시 초안 최적화</span><span className="rounded-full bg-amber-50 px-3 py-1">선택형 의사결정</span><span className="rounded-full bg-amber-50 px-3 py-1">성과기준 재해석 금지</span><span className="rounded-full bg-amber-50 px-3 py-1">사람관리 판단 금지</span><span className="rounded-full bg-amber-50 px-3 py-1">8단계 전달</span></div>
    </section>

    <Card title="1. 6단계 실행계획 확인" tone="amber">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
        <p className="mb-2 text-xs font-black text-amber-700">6단계 요약 입력값 · 긴 원문 표시 금지</p>
        <SummaryLine label="실행관리 주기" value={executionCycle} />
        <SummaryLine label="업무과제 유형" value={state.managementTaskType} />
        <SummaryLine label="관리할 업무과제" value={state.managementTask} />
        <SummaryLine label="업무산출물" value={outputForInstruction} />
        <SummaryLine label="기록 위치" value={state.outputLocation} />
        <SummaryLine label="완료 기준" value={displayCompletion} />
        <SummaryLine label="확인 증거" value={evidence} />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-950"><p className="font-black">최종 선택 업무 단위</p><ul className="mt-2 list-disc space-y-1 pl-4">{workItems.length ? workItems.map((item) => <li key={item}>{item}</li>) : <li>미작성</li>}</ul></div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold leading-5 text-slate-700"><p className="font-black text-slate-900">업무별 완료 기준</p><ul className="mt-2 list-disc space-y-1 pl-4">{workItems.length ? workItems.map((item, index) => <li key={item}>{criterionForWorkItem(item, criteria, index)}</li>) : <li>미작성</li>}</ul></div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold leading-5 text-slate-700"><p className="font-black text-slate-900">6단계에서 제외한 업무</p><ul className="mt-2 list-disc space-y-1 pl-4">{excluded.length ? excluded.map((item) => <li key={item}>{item}</li>) : <li>미작성</li>}</ul></div>
      </div>
      <button type="button" className={`rounded-xl px-4 py-2 text-sm font-black ${state.step7ExecutionPlanConfirmed ? 'bg-emerald-700 text-white' : 'bg-amber-700 text-white'}`} onClick={() => update({ step7ExecutionPlanConfirmed: true })}>{state.step7ExecutionPlanConfirmed ? '이 실행계획으로 진행 중' : '이 실행계획으로 7단계 진행하기'}</button>
    </Card>

    <Card title="2. 실행 순서 결정하기" tone="cyan">
      <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-3 text-xs font-bold leading-5 text-cyan-950">직접 순서표를 쓰지 말고 먼저 실행 순서의 기준을 고릅니다. 필요하면 AI 추천안을 적용한 뒤 팀장이 최종 선택합니다.</div>
      <div className="flex flex-wrap gap-2"><button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={applyAiDecisionRecommendation}>AI로 실행방식 3안 추천받기</button><button type="button" className="rounded-xl border border-cyan-200 bg-white px-4 py-2 text-sm font-black text-cyan-800" onClick={buildDecisionDrafts}>선택한 결정으로 실행 초안 만들기</button></div>
      <div className="grid gap-3 md:grid-cols-2">
        {SEQUENCE_OPTIONS.map((option) => <ChoiceCard key={option.id} selected={sequenceOption.id === option.id} title={option.title} description={option.description} onClick={() => update({ selectedSequenceOption: option.id, sequenceDecisionType: '팀장 선택', step7AiPrompt: '' })} />)}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 whitespace-pre-wrap">{state.orderedWorkSteps || sequenceDraft}</div>
    </Card>

    <Card title="3. 역할과 책임 결정하기" tone="cyan">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold leading-5 text-slate-700">이 단계는 사람 평가가 아니라 업무 책임 명확화입니다. 업무 단위별로 주 실행, 팀장 확인, 협업 방식만 선택합니다.</div>
      <div className="space-y-3">
        {(workItems.length ? workItems : ['최종 선택 업무 단위']).map((item, index) => {
          const role = { ...defaultRoleDecision(), ...(roleMatrix[item] ?? {}) };
          return <div key={`${item}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-black text-slate-950">{index + 1}. {item}</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <label className="text-xs font-black text-slate-600">주 실행<SelectBox value={role.owner ?? OWNER_OPTIONS[0]} options={OWNER_OPTIONS} onChange={(value) => updateRoleDecision(item, { owner: value })} /></label>
              <label className="text-xs font-black text-slate-600">팀장 확인<SelectBox value={role.leaderCheck ?? LEADER_CHECK_OPTIONS[0]} options={LEADER_CHECK_OPTIONS} onChange={(value) => updateRoleDecision(item, { leaderCheck: value })} /></label>
              <label className="text-xs font-black text-slate-600">협업 방식<SelectBox value={role.collaboration ?? COLLABORATION_OPTIONS[0]} options={COLLABORATION_OPTIONS} onChange={(value) => updateRoleDecision(item, { collaboration: value })} /></label>
            </div>
          </div>;
        })}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 whitespace-pre-wrap">{state.roleResponsibilityMap || roleDraft}</div>
    </Card>

    <Card title="4. 일정과 점검방식 결정하기" tone="cyan">
      <div className="grid gap-3 md:grid-cols-2">
        {CHECKPOINT_OPTIONS.map((option) => <ChoiceCard key={option.id} selected={checkpointOption.id === option.id} title={option.title} description={option.description} onClick={() => update({ checkpointDecisionType: option.id, step7AiPrompt: '' })} />)}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-black text-slate-950">확인할 증거 선택</p>
          <div className="mt-3 grid gap-2">{EVIDENCE_CHECKS.map((item) => <MultiCheck key={item} checked={selectedEvidence.includes(item)} label={item} onChange={() => update({ selectedEvidenceChecks: toggle(selectedEvidence, item, 4), step7AiPrompt: '' })} />)}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-black text-slate-950">중간 확인 질문 선택</p>
          <div className="mt-3 grid gap-2">{CHECKPOINT_QUESTIONS.map((item) => <MultiCheck key={item} checked={selectedQuestions.includes(item)} label={item} onChange={() => update({ selectedCheckpointQuestions: toggle(selectedQuestions, item, 3), step7AiPrompt: '' })} />)}</div>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 whitespace-pre-wrap">{state.scheduleCheckpoints || checkpointDraft}</div>
    </Card>

    <Card title="5. 업무량 조정: 이번 주기에는 잠시 줄일 일" tone="amber">
      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-950">새 일을 추가하는 만큼 줄일 일을 정합니다. 최대 3개까지 선택할 수 있습니다.</div>
      <div className="grid gap-2 md:grid-cols-2">
        {REDUCE_TASKS.map((task) => <MultiCheck key={task} checked={reduceTasks.includes(task)} label={task} onChange={() => update({ selectedReduceTasks: toggle(reduceTasks, task, 3), step7AiPrompt: '' })} />)}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 whitespace-pre-wrap">{state.workloadAdjustments || workloadDraft}</div>
    </Card>

    <Card title="6. AI로 업무지시 초안 만들기" tone="violet">
      <div className="grid gap-3 md:grid-cols-4">
        {INSTRUCTION_TONES.map((tone) => <ChoiceCard key={tone} selected={(state.step7InstructionTone || INSTRUCTION_TONES[0]) === tone} title={tone} description="AI 초안의 표현 방식을 선택합니다." onClick={() => update({ step7InstructionTone: tone, step7AiPrompt: '' })} />)}
      </div>
      <div className="rounded-2xl border border-violet-100 bg-violet-50 p-3 text-xs font-bold leading-5 text-violet-950">현재 말투 선택: {state.step7InstructionTone || INSTRUCTION_TONES[0]} · 선택값을 바꾸면 프롬프트를 다시 만들어 주세요.</div>
      <div className="flex flex-wrap gap-2"><button type="button" className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-black text-white" onClick={buildAiPrompt}>업무지시 초안 최적화 프롬프트 만들기</button><button type="button" className="rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-black text-violet-800" onClick={copyAiPrompt}>프롬프트 복사하기</button></div>
      <div className="grid gap-3 md:grid-cols-2"><Field label="AI에게 입력할 프롬프트" value={state.step7AiPrompt ?? ''} onChange={(value) => update({ step7AiPrompt: value })} placeholder="프롬프트 만들기 버튼을 누르면 업무지시 초안 생성에 최적화된 프롬프트가 생성됩니다." minHeight="min-h-64" /><Field label="AI 업무지시 초안 붙여넣기" value={state.step7AiResult ?? ''} onChange={(value) => update({ step7AiResult: value })} placeholder="AI가 작성한 업무지시 초안을 붙여넣습니다." minHeight="min-h-64" /></div>
    </Card>

    <Card title="7. 사람 검토 후 최종 업무지시 확정" tone="emerald">
      <div className="grid gap-2 md:grid-cols-3">
        {REVIEW_CHECKLIST.map((item) => <MultiCheck key={item} checked={reviewChecklist.includes(item)} label={item} onChange={() => update({ step7ReviewChecklist: toggle(reviewChecklist, item, REVIEW_CHECKLIST.length) })} />)}
      </div>
      <Field label="사람 검토 보완" help="필요할 때만 짧게 씁니다. 현장 말투 수정, 제외할 문장, 팀장 확인 문장 정도만 보완합니다." value={state.step7HumanReview ?? ''} onChange={(value) => update({ step7HumanReview: value })} placeholder="예: 지시문을 더 짧게 줄이고, 마감 전 확인 질문을 한 문장으로 바꾼다." minHeight="min-h-20" />
      <button type="button" className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-black text-white" onClick={makeInstructionDraft}>최종 업무지시 확정하기</button>
      <Field label="최종 업무지시" value={state.finalTaskInstruction ?? state.taskInstructionDraft ?? ''} onChange={(value) => update({ finalTaskInstruction: value, taskInstructionDraft: value })} placeholder="확정 버튼을 누르면 업무지시 초안이 생성됩니다." minHeight="min-h-64" />
    </Card>

    <Card title="8. 8단계 업무 경계·병목 대응으로 넘기기" tone="slate">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold leading-5 text-slate-700">7단계에서는 경계·병목을 확정하지 않습니다. 8단계로 넘길 후보만 선택합니다.</div>
      <div className="grid gap-2 md:grid-cols-3">
        {STEP8_HANDOFF_SIGNALS.map((signal) => <MultiCheck key={signal} checked={selectedStep8Signals.includes(signal)} label={signal} onChange={() => update({ selectedStep8HandoffSignals: toggle(selectedStep8Signals, signal, STEP8_HANDOFF_SIGNALS.length) })} />)}
      </div>
      <button type="button" className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-black text-white" onClick={makeStep8Handoff}>경계·병목 후보 자동 추출하기</button>
      <Field label="8단계 전달 메모" value={state.step7HandoffToStep8 ?? ''} onChange={(value) => update({ step7HandoffToStep8: value })} placeholder="업무 경계, 병목 예상, 권한 밖 이슈, 에스컬레이션 후보를 정리합니다." minHeight="min-h-40" />
    </Card>
  </section>;
}
