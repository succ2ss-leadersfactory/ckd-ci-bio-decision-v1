import { useMemo, type ReactNode } from 'react';
import { useStored } from './journey-storage';

const V41_TASK_EXECUTION_BRIDGE_MARKERS = [
  'V41TaskExecutionBridgeLab',
  '업무관리 실행계획 만들기',
  '6단계: 관리할 업무과제와 산출물 정하기',
  '성과기준이 업무로 전환되는 방식',
  '업무과제 유형 선택',
  '기준 정렬형',
  '산출물 작성형',
  '기록·현황 정리형',
  '누락·품질 보완형',
  '다음 행동 연결형',
  '추천 업무과제 후보 선택',
  '추천 관리 기간',
  '이번 주기 관리할 업무과제',
  '5단계 기준은 입력값으로만 사용',
  '성과기준 재평가 금지',
  '사람관리 판단 금지',
  '업무산출물 정의',
  '업무분해 후보 만들기',
  '프롬프트 복사하기',
  '선택 사항 · 5단계 AI 검토 요약 참고하기',
  '산출물-KPI 연결 확인',
  'CSF 반영 확인',
  '7단계 전달 메모로 넘기기',
  '실행관리 주기',
  '최종 실행계획',
  'ckd.v41.performanceCascade.v1',
  'ckd.v41.performanceCascade.aiExpansion.v1',
  'ckd.v41.taskManagement.v10',
].join('|');
void V41_TASK_EXECUTION_BRIDGE_MARKERS;

type PerformanceState = Record<string, unknown> & {
  selectedTeamTask?: string;
  customTeamTask?: string;
  selectedCsf?: string;
  selectedKpi?: string;
  selectedInitiative?: string;
};

type AiExpansionState = {
  prompt: string;
  result: string;
  review: string;
};

type ExecutionCycle = '1주' | '2주' | '4주' | '월간' | '분기';
type ManagedTaskType = '기준 정렬형' | '산출물 작성형' | '기록·현황 정리형' | '누락·품질 보완형' | '다음 행동 연결형';

type TaskExecutionState = {
  confirmedTeamStandard: string;
  managementTaskType: ManagedTaskType | '';
  selectedTaskCandidate: string;
  managementTask: string;
  managementTaskReason: string;
  includedWorkScope: string;
  excludedWorkScope: string;
  executionCycle: ExecutionCycle;
  selectedOutput: string;
  outputLocation: string;
  completionStandard: string;
  outputKpiConnection: string;
  outputCsfConnection: string;
  workBreakdownDraft: string;
  selectedWorkItems: string;
  workItemCompletionCriteria: string;
  excludedWorkItems: string;
  step6HandoffToStep7: string;
  aiPrompt: string;
  aiResult: string;
  humanReview: string;
  aiExpansionAppliedNote: string;
  finalExecutionPlan: string;
  taskInstructionDraft: string;
  executionTaskOne: string;
  executionTaskTwo: string;
  executionTaskThree: string;
  memberTasks: string;
  leaderCheckTasks: string;
  leaderSupportTasks: string;
  evidenceToCheck: string;
  midCheckQuestions: string;
  pauseActivities: string;
  expectedRisks: string;
  peopleSignal: string;
  boundaryDeclaration: string;
};

const PERFORMANCE_STORAGE_KEY = 'ckd.v41.performanceCascade.v1';
const AI_EXPANSION_STORAGE_KEY = 'ckd.v41.performanceCascade.aiExpansion.v1';
const TASK_STORAGE_KEY = 'ckd.v41.taskManagement.v10';
const DEFAULT_PERFORMANCE_STATE: PerformanceState = {};
const DEFAULT_AI_EXPANSION_STATE: AiExpansionState = { prompt: '', result: '', review: '' };
const EXECUTION_CYCLES: ExecutionCycle[] = ['1주', '2주', '4주', '월간', '분기'];
const MANAGED_TASK_TYPES: Array<{ type: ManagedTaskType; description: string; recommendedCycle: ExecutionCycle; logic: string }> = [
  { type: '기준 정렬형', description: 'CSF를 업무 기준, 입력 기준, 분류 기준으로 바꿉니다.', recommendedCycle: '2주', logic: 'CSF → 업무 기준' },
  { type: '산출물 작성형', description: 'KPI 확인에 필요한 새 결과물이나 관리표를 만듭니다.', recommendedCycle: '2주', logic: 'KPI → 확인 증거물' },
  { type: '기록·현황 정리형', description: '흩어진 CRM·고객·활동 기록을 KPI 확인 가능한 형태로 정리합니다.', recommendedCycle: '1주', logic: '실행 흔적 → 확인 가능한 현황' },
  { type: '누락·품질 보완형', description: '빠진 항목, 불명확한 기록, 품질이 낮은 산출물을 보완합니다.', recommendedCycle: '1주', logic: '성과 저해 요인 → 보완 업무' },
  { type: '다음 행동 연결형', description: '기록과 산출물을 다음 행동, Follow-up, 후속 확인 업무로 연결합니다.', recommendedCycle: '2주', logic: '기록 → 다음 행동' },
];
const DEFAULT_TASK_STATE: TaskExecutionState = {
  confirmedTeamStandard: '',
  managementTaskType: '',
  selectedTaskCandidate: '',
  managementTask: '',
  managementTaskReason: '',
  includedWorkScope: '',
  excludedWorkScope: '',
  executionCycle: '2주',
  selectedOutput: '',
  outputLocation: '',
  completionStandard: '',
  outputKpiConnection: '',
  outputCsfConnection: '',
  workBreakdownDraft: '',
  selectedWorkItems: '',
  workItemCompletionCriteria: '',
  excludedWorkItems: '',
  step6HandoffToStep7: '',
  aiPrompt: '',
  aiResult: '',
  humanReview: '',
  aiExpansionAppliedNote: '',
  finalExecutionPlan: '',
  taskInstructionDraft: '',
  executionTaskOne: '',
  executionTaskTwo: '',
  executionTaskThree: '',
  memberTasks: '',
  leaderCheckTasks: '',
  leaderSupportTasks: '',
  evidenceToCheck: '',
  midCheckQuestions: '',
  pauseActivities: '',
  expectedRisks: '',
  peopleSignal: '',
  boundaryDeclaration: '',
};

function textOrEmpty(value?: string) {
  return value?.trim() || '';
}

function compact(value?: string) {
  const text = textOrEmpty(value);
  if (!text) return '미작성';
  return text.length > 260 ? `${text.slice(0, 260)}…` : text;
}

function splitLines(value: string) {
  return value.split(/\r?\n/).map((line) => line.replace(/^[-•]\s*/, '').trim()).filter(Boolean);
}

function firstLines(value: string, count = 3) {
  return splitLines(value).slice(0, count);
}

function line(label: string, value?: string) {
  return <p><span className="font-black text-slate-700">{label}: </span><span>{textOrEmpty(value) || '미작성'}</span></p>;
}

function Card({ title, children, tone = 'slate' }: { title: string; children: ReactNode; tone?: 'slate' | 'cyan' | 'emerald' | 'violet' | 'amber' }) {
  const toneClass = tone === 'cyan' ? 'border-cyan-100' : tone === 'emerald' ? 'border-emerald-100' : tone === 'violet' ? 'border-violet-100' : tone === 'amber' ? 'border-amber-100' : 'border-slate-200';
  return <section className={`rounded-3xl border ${toneClass} bg-white p-4 shadow-sm md:p-5`}><h3 className="text-lg font-black text-slate-950">{title}</h3><div className="mt-4 space-y-3">{children}</div></section>;
}

function Field({ label, help, value, onChange, placeholder, minHeight = 'min-h-24' }: { label: string; help?: string; value: string; onChange: (value: string) => void; placeholder: string; minHeight?: string }) {
  return <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="text-sm font-black text-slate-950">{label}</span>{help ? <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{help}</p> : null}<textarea className={`${minHeight} mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100`} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

function cycleHelp(cycle: ExecutionCycle) {
  const map: Record<ExecutionCycle, string> = {
    '1주': '기록·현황 정리, 누락·품질 보완처럼 짧게 확인하고 바로 정리할 업무에 적합합니다.',
    '2주': '기준 정렬, 산출물 작성, 다음 행동 연결처럼 만들고 1차 적용까지 확인할 업무에 적합합니다.',
    '4주': '반복 운영, 패턴 확인, 누적 기록 관리에 적합합니다.',
    '월간': '월간 보고, 정기 점검, 팀 단위 현황 정리에 적합합니다.',
    '분기': '큰 과제의 중간 정리, 전략 과제 단위 산출물 정의에 적합합니다.',
  };
  return map[cycle];
}

function normalizeTaskType(value: string): ManagedTaskType | '' {
  if (value === '기준 통일형') return '기준 정렬형';
  if (value === '기록 정리형') return '기록·현황 정리형';
  if (value === '누락 보완형') return '누락·품질 보완형';
  if (value === '확인 체계형') return '';
  return MANAGED_TASK_TYPES.some((item) => item.type === value) ? value as ManagedTaskType : '';
}

function taskTypeHelp(type: ManagedTaskType | '') {
  return MANAGED_TASK_TYPES.find((item) => item.type === type);
}

function taskCandidates(type: ManagedTaskType | '', kpi: string, csf: string, initiative: string) {
  const base = textOrEmpty(initiative) || `${kpi} 확인`;
  const candidates: Record<ManagedTaskType, string[]> = {
    '기준 정렬형': [
      `${csf}를 놓치지 않도록 입력·분류·작성 기준을 정리한다.`,
      `${base}를 진행하기 위한 필수 항목과 판단 기준을 맞춘다.`,
      `${kpi} 확인에 필요한 기록 기준을 팀 내에서 통일한다.`,
    ],
    '산출물 작성형': [
      `${base}에 필요한 업무산출물을 작성하고 확인한다.`,
      `${kpi} 확인에 필요한 관리표를 작성한다.`,
      `${base} 관련 기록을 한 화면에서 볼 수 있는 산출물로 정리한다.`,
    ],
    '기록·현황 정리형': [
      `기존 기록을 ${kpi} 확인 기준에 맞게 정리한다.`,
      `${base}와 관련된 기존 CRM·공유 시트 기록을 정리한다.`,
      `담당자별 현황을 ${csf} 기준에 맞게 한 화면으로 정리한다.`,
    ],
    '누락·품질 보완형': [
      `${kpi} 확인에 필요한 누락 항목과 불명확한 기록을 보완한다.`,
      `${base} 진행 과정에서 빠진 필수 기록과 품질이 낮은 메모를 정리한다.`,
      `${csf}와 연결된 필수 항목의 누락 여부를 확인하고 보완한다.`,
    ],
    '다음 행동 연결형': [
      `${base} 결과를 다음 행동과 Follow-up 예정일로 연결한다.`,
      `${kpi} 확인에 필요한 기록을 후속 확인 업무로 연결한다.`,
      `${csf}를 놓치지 않도록 고객 반응·다음 행동·후속 확인을 한 흐름으로 정리한다.`,
    ],
  };
  return type ? candidates[type] ?? [] : [];
}

export function V41TaskExecutionBridgeLab() {
  const [performanceState] = useStored<PerformanceState>(PERFORMANCE_STORAGE_KEY, DEFAULT_PERFORMANCE_STATE);
  const [aiExpansion] = useStored<AiExpansionState>(AI_EXPANSION_STORAGE_KEY, DEFAULT_AI_EXPANSION_STATE);
  const [rawState, setState] = useStored<TaskExecutionState>(TASK_STORAGE_KEY, DEFAULT_TASK_STATE);
  const state = { ...DEFAULT_TASK_STATE, ...rawState };
  const update = (patch: Partial<TaskExecutionState>) => setState({ ...state, ...patch });

  const rawTeamTask = textOrEmpty(performanceState.customTeamTask) || textOrEmpty(performanceState.selectedTeamTask);
  const rawCsf = textOrEmpty(performanceState.selectedCsf);
  const rawKpi = textOrEmpty(performanceState.selectedKpi);
  const rawInitiative = textOrEmpty(performanceState.selectedInitiative);
  const teamTask = rawTeamTask || '5단계에서 선택한 팀 전략과제';
  const selectedCsf = rawCsf || '5단계에서 선택한 팀 CSF';
  const selectedKpi = rawKpi || '5단계에서 선택한 팀 KPI';
  const selectedInitiative = rawInitiative || '5단계에서 선택한 세부 추진과제 후보';
  const selectedType = normalizeTaskType(state.managementTaskType);
  const selectedTypeMeta = taskTypeHelp(selectedType);
  const candidates = taskCandidates(selectedType, selectedKpi, selectedCsf, selectedInitiative);
  const hasBaseCriteria = Boolean(rawTeamTask && rawCsf && rawKpi);
  const hasManagementTask = Boolean(textOrEmpty(state.managementTask));
  const hasAiExpansionReview = Boolean(textOrEmpty(aiExpansion.review));
  const aiExpansionAppliedNote = textOrEmpty(state.aiExpansionAppliedNote);

  const criteriaMaterial = useMemo(() => {
    return [
      `팀 전략과제: ${teamTask}`,
      `팀 CSF: ${selectedCsf}`,
      `팀 KPI: ${selectedKpi}`,
      `세부 추진과제 후보: ${selectedInitiative}`,
    ].join('\n');
  }, [teamTask, selectedCsf, selectedKpi, selectedInitiative]);

  const suggestedManagementTask = candidates[0] || (rawInitiative
    ? `${rawInitiative}를 이번 주기에서 관리 가능한 업무과제로 구체화한다.`
    : `${selectedKpi} 확인에 필요한 업무과제를 하나 정한다.`);
  const suggestedManagementReason = selectedTypeMeta
    ? `${selectedTypeMeta.logic} 관점에서 ${selectedKpi}를 확인할 수 있는 업무산출물로 전환하기 위해 이 과제를 관리한다.`
    : `${selectedKpi}를 확인할 수 있는 업무산출물을 만들기 위해 이번 관리 대상을 먼저 좁힌다.`;
  const suggestedIncludedScope = '이번 관리 범위에 실제로 작성·정리·확인·연결할 업무를 씁니다. 예: 기준 정리, 기존 자료 확인, 산출물 작성, 누락 보완, 다음 행동 연결.';
  const suggestedExcludedScope = '이번 관리 범위에서 제외할 내용을 씁니다. 예: 개인별 코칭, 고객 설득 전략, 역할 배정, 세부 일정표, 병목 대응, 체크포인트 설계.';
  const managementTask = textOrEmpty(state.managementTask) || suggestedManagementTask;
  const suggestedOutput = `${managementTask}의 결과로 남길 업무산출물`;
  const suggestedLocation = 'CRM 기록, 팀 공유 시트, 주간 업무관리 메모 중 하나로 통일';
  const suggestedCompletion = `${managementTask}와 관련된 기록 또는 결과물이 정해진 위치에 남아 있고, 누락 여부와 다음 행동 여부를 확인할 수 있어야 한다.`;
  const suggestedKpiConnection = `이 산출물은 ${selectedKpi} 확인에 필요한 기록 또는 결과물이어야 한다.`;
  const suggestedCsfConnection = `업무분해 과정에서 ${selectedCsf}를 놓치지 않도록 필수 항목과 완료 기준을 정한다.`;

  const defaultWorkItems = [
    '업무산출물에 반드시 들어갈 항목을 정한다.',
    '기존 기록·자료 중 활용할 수 있는 것을 확인한다.',
    '산출물을 남길 위치와 입력 기준을 정한다.',
    '실행 후 산출물을 작성하거나 기존 기록을 보완한다.',
    '완료 기준에 맞게 누락 여부와 다음 행동 연결 여부를 확인한다.',
  ].join('\n');

  const defaultWorkCriteria = [
    '필수 항목이 빠지지 않았다.',
    '정해진 위치에 산출물이 남았다.',
    '5단계 KPI 확인에 필요한 흔적이 보인다.',
    'CSF를 놓치지 않도록 기준·기록·산출물·다음 행동이 연결되어 있다.',
    '7단계에서 순서·역할·일정으로 바꿀 수 있을 만큼 업무 단위가 분명하다.',
  ].join('\n');

  const bringAiExpansionReview = () => {
    const review = textOrEmpty(aiExpansion.review);
    if (!review) {
      window.alert('5단계에서 사람이 검토한 AI 후보 요약이 있을 때만 선택 참고자료로 가져올 수 있습니다. AI 확장 실습을 하지 않았다면 이 영역은 건너뛰어도 됩니다.');
      return;
    }
    update({
      aiExpansionAppliedNote: [
        '[5단계 사람 검토 요약 중 업무분해에 참고할 내용]',
        review,
        '',
        '[6단계 적용 원칙]',
        '성과기준을 새로 만들지 않고, 관리할 업무과제·업무산출물·업무 단위로 바꿀 때만 참고한다.',
      ].join('\n'),
    });
  };

  const selectTaskType = (type: ManagedTaskType) => {
    const meta = taskTypeHelp(type);
    update({
      managementTaskType: type,
      selectedTaskCandidate: '',
      managementTask: '',
      executionCycle: meta?.recommendedCycle ?? state.executionCycle,
    });
  };

  const selectCandidate = (candidate: string) => {
    update({
      selectedTaskCandidate: candidate,
      managementTask: candidate,
      managementTaskReason: textOrEmpty(state.managementTaskReason) || suggestedManagementReason,
      includedWorkScope: textOrEmpty(state.includedWorkScope) || suggestedIncludedScope,
      excludedWorkScope: textOrEmpty(state.excludedWorkScope) || suggestedExcludedScope,
    });
  };

  const buildAiPrompt = () => {
    if (!hasBaseCriteria) {
      window.alert('5단계에서 기본 팀 전략과제·CSF·KPI를 먼저 선택해 주세요. AI 추가 후보는 선택 사항이지만, 기본 기준은 6단계 업무분해의 출발점입니다.');
      return;
    }
    if (!hasManagementTask) {
      window.alert('먼저 업무과제 유형과 추천 후보를 선택하거나, “최종 관리할 업무과제 문장”을 작성해 주세요. 관리할 과제가 정해져야 업무분해를 할 수 있습니다.');
      return;
    }
    const selectedOutput = textOrEmpty(state.selectedOutput) || suggestedOutput;
    const outputLocation = textOrEmpty(state.outputLocation) || suggestedLocation;
    const completionStandard = textOrEmpty(state.completionStandard) || suggestedCompletion;
    update({
      aiPrompt: [
        '역할: 당신은 제약영업팀장의 순수 업무관리 설계를 돕는 업무분해 전문가입니다.',
        '',
        '[상황/맥락]',
        '아래 5단계 기준은 입력값입니다. 이 기준을 다시 평가하거나 수정하지 마세요.',
        criteriaMaterial,
        '',
        `[업무과제 유형]\n${selectedType || '미선택'}`,
        `[성과기준이 업무로 전환되는 방식]\n${selectedTypeMeta?.logic || '미선택'}`,
        `[추천 관리 기간]\n${state.executionCycle} - ${cycleHelp(state.executionCycle)}\n실제 일정과 체크포인트는 7단계에서 확정합니다.`,
        `[이번 관리할 업무과제]\n${textOrEmpty(state.managementTask)}`,
        `[이 과제를 선택한 이유]\n${textOrEmpty(state.managementTaskReason) || suggestedManagementReason}`,
        `[이번 관리 범위에 포함할 업무]\n${textOrEmpty(state.includedWorkScope) || suggestedIncludedScope}`,
        `[이번 관리 범위에서 제외할 업무]\n${textOrEmpty(state.excludedWorkScope) || suggestedExcludedScope}`,
        '',
        `[업무산출물]\n${selectedOutput}`,
        `[기록 위치]\n${outputLocation}`,
        `[완료 기준]\n${completionStandard}`,
        '',
        aiExpansionAppliedNote ? `[선택 참고자료: 5단계 AI 후보 중 사람이 검토해 참고하기로 한 내용]\n${aiExpansionAppliedNote}` : '[선택 참고자료: 5단계 AI 후보]\n없음. AI 확장 실습을 하지 않았으므로 기본 기준과 관리할 업무과제만 사용합니다.',
        '',
        '[과제/요청]',
        '이번 단계는 성과관리나 사람관리가 아니라 업무관리입니다. 위 관리할 업무과제와 업무산출물을 바탕으로 업무산출물을 만들기 위한 업무 단위 후보를 제안해 주세요.',
        '',
        '[반드시 지킬 원칙]',
        '1. 전략과제·CSF·KPI를 다시 평가하거나 새로 만들지 마세요.',
        '2. 팀원의 역량·태도·동기·코칭 필요 여부를 판단하지 마세요.',
        '3. 업무 순서, 역할, 일정, 업무량 조정, 병목 대응은 다루지 마세요. 이것은 7~8단계에서 다룹니다.',
        '4. 오직 업무산출물 보완, 필수 항목, 업무분해, 시작 조건, 완료 조건, 제외해도 되는 업무만 제안하세요.',
        '5. 실제 병원명, 의료진명, 고객명은 쓰지 마세요.',
        '',
        '[출력형식]',
        '1. 업무산출물 보완 제안',
        '2. 산출물에 반드시 들어갈 항목',
        '3. 업무 단위 후보 5~7개',
        '4. 각 업무의 시작 조건',
        '5. 각 업무의 완료 조건',
        '6. 제외해도 되는 업무와 제외 이유',
      ].join('\n'),
    });
  };

  const copyAiPrompt = async () => {
    const prompt = textOrEmpty(state.aiPrompt);
    if (!prompt) {
      window.alert('먼저 “AI 업무분해 프롬프트 만들기”를 눌러 프롬프트를 생성해 주세요.');
      return;
    }
    try {
      await navigator.clipboard.writeText(prompt);
      window.alert('AI 업무분해 프롬프트를 복사했습니다.');
    } catch {
      window.prompt('아래 프롬프트를 직접 복사해 주세요.', prompt);
    }
  };

  const makeWorkBreakdownHandoff = () => {
    const managementTaskType = selectedType;
    const managementTaskValue = textOrEmpty(state.managementTask) || suggestedManagementTask;
    const managementTaskReason = textOrEmpty(state.managementTaskReason) || suggestedManagementReason;
    const includedWorkScope = textOrEmpty(state.includedWorkScope) || suggestedIncludedScope;
    const excludedWorkScope = textOrEmpty(state.excludedWorkScope) || suggestedExcludedScope;
    const selectedOutput = textOrEmpty(state.selectedOutput) || suggestedOutput;
    const outputLocation = textOrEmpty(state.outputLocation) || suggestedLocation;
    const completionStandard = textOrEmpty(state.completionStandard) || suggestedCompletion;
    const outputKpiConnection = textOrEmpty(state.outputKpiConnection) || suggestedKpiConnection;
    const outputCsfConnection = textOrEmpty(state.outputCsfConnection) || suggestedCsfConnection;
    const selectedWorkItems = textOrEmpty(state.selectedWorkItems) || textOrEmpty(state.workBreakdownDraft) || defaultWorkItems;
    const workItemCompletionCriteria = textOrEmpty(state.workItemCompletionCriteria) || defaultWorkCriteria;
    const excludedWorkItems = textOrEmpty(state.excludedWorkItems) || '7단계에서 다룰 업무 순서·역할·일정, 8단계에서 다룰 병목·에스컬레이션, 9단계 이후 사람관리 판단은 6단계 업무분해에서 제외한다. 확인 체계의 세부 체크포인트 설계는 7단계에서 다룬다.';
    const aiReview = [textOrEmpty(state.aiResult), textOrEmpty(state.humanReview)].filter(Boolean).join('\n\n[사람 검토 보완]\n');
    const workItems = firstLines(selectedWorkItems, 3);
    const step6HandoffToStep7 = [
      '[6단계 전달 메모]',
      `업무과제 유형: ${managementTaskType || '미선택'}`,
      `성과기준이 업무로 전환되는 방식: ${selectedTypeMeta?.logic || '미선택'}`,
      `추천 관리 기간: ${state.executionCycle} - ${cycleHelp(state.executionCycle)} (실제 일정과 체크포인트는 7단계에서 확정)`,
      `이번 관리할 업무과제: ${managementTaskValue}`,
      `선택 이유: ${managementTaskReason}`,
      `포함 범위: ${includedWorkScope}`,
      `제외 범위: ${excludedWorkScope}`,
      '',
      `업무산출물: ${selectedOutput}`,
      `기록 위치: ${outputLocation}`,
      `완료 기준: ${completionStandard}`,
      '',
      '[업무분해]',
      selectedWorkItems,
      '',
      '[업무별 완료 기준]',
      workItemCompletionCriteria,
      '',
      '[6단계에서 제외한 업무]',
      excludedWorkItems,
    ].join('\n');
    const finalPlan = [
      '[5단계 입력 기준]',
      criteriaMaterial,
      '',
      '[이번 관리할 업무과제]',
      `업무과제 유형: ${managementTaskType || '미선택'}`,
      `성과기준이 업무로 전환되는 방식: ${selectedTypeMeta?.logic || '미선택'}`,
      `추천 관리 기간: ${state.executionCycle} - ${cycleHelp(state.executionCycle)}`,
      managementTaskValue,
      `선택 이유: ${managementTaskReason}`,
      `포함 범위: ${includedWorkScope}`,
      `제외 범위: ${excludedWorkScope}`,
      '',
      '[6단계 업무산출물]',
      `산출물: ${selectedOutput}`,
      `기록 위치: ${outputLocation}`,
      `완료 기준: ${completionStandard}`,
      '',
      '[산출물-KPI 연결 확인]',
      outputKpiConnection,
      '',
      '[CSF 반영 확인]',
      outputCsfConnection,
      '',
      '[업무분해]',
      selectedWorkItems,
      '',
      '[업무별 완료 기준]',
      workItemCompletionCriteria,
      '',
      '[6단계에서 제외한 업무]',
      excludedWorkItems,
      aiExpansionAppliedNote ? `\n[선택 참고자료: 5단계 AI 후보 중 업무분해 참고 내용]\n${aiExpansionAppliedNote}` : '',
      aiReview ? `\n[AI 업무분해 초안 및 사람 검토]\n${aiReview}` : '',
    ].filter(Boolean).join('\n');
    update({
      confirmedTeamStandard: criteriaMaterial,
      managementTaskType: managementTaskType || '',
      managementTask: managementTaskValue,
      managementTaskReason,
      includedWorkScope,
      excludedWorkScope,
      selectedOutput,
      outputLocation,
      completionStandard,
      outputKpiConnection,
      outputCsfConnection,
      selectedWorkItems,
      workItemCompletionCriteria,
      excludedWorkItems,
      step6HandoffToStep7,
      finalExecutionPlan: finalPlan,
      taskInstructionDraft: step6HandoffToStep7,
      executionTaskOne: workItems[0] || '',
      executionTaskTwo: workItems[1] || '',
      executionTaskThree: workItems[2] || '',
      evidenceToCheck: `${selectedOutput} / ${outputLocation} / ${completionStandard}`,
    });
  };

  const planLineCount = splitLines(state.finalExecutionPlan).length;

  return <section className="space-y-4">
    <section className="rounded-3xl border border-cyan-100 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-cyan-700">업무관리 실행계획 만들기</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">6단계: 관리할 업무과제와 산출물 정하기</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-600">5단계 기준을 빈칸에 바로 쓰지 않습니다. 성과기준이 업무로 전환되는 방식을 먼저 고른 뒤, 추천 후보를 짧게 수정해 이번 관리할 업무과제를 정하고 업무산출물과 업무 단위로 바꿉니다.</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs font-black text-cyan-800"><span className="rounded-full bg-cyan-50 px-3 py-1">후보 선택형</span><span className="rounded-full bg-cyan-50 px-3 py-1">성과기준→업무전환</span><span className="rounded-full bg-cyan-50 px-3 py-1">추천 관리 기간</span><span className="rounded-full bg-cyan-50 px-3 py-1">성과기준 재평가 금지</span><span className="rounded-full bg-cyan-50 px-3 py-1">사람관리 판단 금지</span><span className="rounded-full bg-cyan-50 px-3 py-1">7단계 전달</span></div>
    </section>

    <Card title="5단계 기준 확인" tone="cyan">
      <p className="text-sm font-bold leading-6 text-slate-600">이 내용은 관리할 업무과제 후보를 고르기 위한 입력값입니다. 이 화면에서는 전략과제·CSF·KPI를 새로 만들거나 평가하지 않습니다.</p>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
        {line('팀 전략과제', teamTask)}
        {line('팀 CSF', selectedCsf)}
        {line('팀 KPI', selectedKpi)}
        {line('세부 추진과제 후보', selectedInitiative)}
      </div>
      {!hasBaseCriteria ? <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-900"><p className="font-black">먼저 확인하세요</p><p className="mt-2">6단계 AI 업무분해 실습을 하려면 5단계에서 기본 팀 전략과제·CSF·KPI를 먼저 선택해야 합니다. 추가 AI 후보는 선택 사항입니다.</p></div> : null}
      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-900">
        <p className="font-black">6단계 경계</p>
        <p className="mt-2">- 성과기준 재평가, KPI 해석, CSF 재정의는 5단계 영역입니다.</p>
        <p>- 실제 일정과 체크포인트, 역할·업무량 조정은 7단계에서 확정합니다.</p>
        <p>- 업무 경계·병목·에스컬레이션은 8단계에서 다룹니다.</p>
        <p>- 팀원 역량·태도·동기·코칭 판단은 사람관리 단계에서 다룹니다.</p>
      </div>
    </Card>

    <Card title="업무과제 유형 선택" tone="emerald">
      <p className="text-sm font-bold leading-6 text-slate-600">이번 유형은 업무의 겉모양이 아니라, 5단계 성과기준이 업무로 전환되는 방식을 기준으로 나눕니다. 유형을 선택하면 추천 업무과제 후보와 추천 관리 기간이 제안됩니다.</p>
      <div className="grid gap-3 md:grid-cols-5">
        {MANAGED_TASK_TYPES.map((item) => <button key={item.type} type="button" className={`rounded-2xl border p-3 text-left text-sm font-black ${selectedType === item.type ? 'border-emerald-300 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-100' : 'border-slate-200 bg-slate-50 text-slate-700'}`} onClick={() => selectTaskType(item.type)}><span>{item.type}</span><span className="mt-2 block text-xs font-bold leading-5 text-slate-500">{item.description}</span><span className="mt-2 block text-xs font-bold leading-5 text-emerald-700">{item.logic}</span><span className="mt-2 inline-block rounded-full bg-white px-2 py-1 text-xs font-black text-emerald-800">추천 {item.recommendedCycle}</span></button>)}
      </div>
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-xs font-bold leading-5 text-emerald-900">
        <p className="font-black">추천 관리 기간</p>
        <p className="mt-2">현재 추천값: <span className="font-black">{state.executionCycle}</span> · {cycleHelp(state.executionCycle)}</p>
        <p className="mt-1">이 값은 6단계에서 업무분해 범위를 잡기 위한 참고값입니다. 실제 시작일, 중간 확인일, 마감일은 7단계에서 확정합니다.</p>
      </div>
    </Card>

    <Card title="추천 업무과제 후보 선택" tone="emerald">
      <p className="text-sm font-bold leading-6 text-slate-600">후보 중 하나를 선택하면 아래 최종 문장에 자동 입력됩니다. 필요하면 현장 언어로 짧게 수정하세요.</p>
      {!selectedType ? <p className="rounded-2xl border border-amber-100 bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-900">먼저 업무과제 유형을 선택하세요. 예전 저장값인 확인 체계형은 7단계 체크포인트 설계 영역으로 이동했으므로 다시 선택해야 합니다.</p> : null}
      <div className="grid gap-3 md:grid-cols-3">
        {candidates.map((candidate) => <button key={candidate} type="button" className={`rounded-2xl border p-3 text-left text-sm font-bold leading-6 ${state.selectedTaskCandidate === candidate ? 'border-emerald-300 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-100' : 'border-slate-200 bg-slate-50 text-slate-700'}`} onClick={() => selectCandidate(candidate)}>{candidate}</button>)}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="최종 관리할 업무과제 문장" help="선택한 후보가 자동 입력됩니다. 필요하면 한 문장으로 수정합니다." value={state.managementTask} onChange={(value) => update({ managementTask: value })} placeholder={suggestedManagementTask} minHeight="min-h-32" />
        <Field label="이 과제를 선택한 이유" help="KPI 확인과 CSF 누락 방지 관점에서 왜 이 과제를 관리하는지 씁니다." value={state.managementTaskReason} onChange={(value) => update({ managementTaskReason: value })} placeholder={suggestedManagementReason} minHeight="min-h-32" />
        <Field label="이번 관리 범위에 포함할 업무" help="이번 범위에서 실제로 작성·정리·확인·연결할 업무만 씁니다." value={state.includedWorkScope} onChange={(value) => update({ includedWorkScope: value })} placeholder={suggestedIncludedScope} minHeight="min-h-32" />
        <Field label="이번 관리 범위에서 제외할 업무" help="7~8단계나 사람관리에서 다룰 내용은 여기서 제외합니다." value={state.excludedWorkScope} onChange={(value) => update({ excludedWorkScope: value })} placeholder={suggestedExcludedScope} minHeight="min-h-32" />
      </div>
      {!hasManagementTask ? <p className="rounded-2xl border border-amber-100 bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-900">추천 후보를 선택하거나 최종 관리할 업무과제 문장을 직접 작성해야 AI 업무분해 프롬프트를 만들 수 있습니다.</p> : null}
    </Card>

    <Card title="업무산출물 정의" tone="emerald">
      <p className="text-sm font-bold leading-6 text-slate-600">관리할 업무과제가 정해진 뒤, 이번 관리 범위 끝에 남길 업무산출물과 완료 기준을 정합니다.</p>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="이번 관리 범위의 업무산출물" help="이번 관리 범위 끝에 실제로 남아야 할 결과물입니다." value={state.selectedOutput} onChange={(value) => update({ selectedOutput: value })} placeholder={suggestedOutput} />
        <Field label="기록 위치" help="산출물이 어디에 남아야 하는지 정합니다." value={state.outputLocation} onChange={(value) => update({ outputLocation: value })} placeholder={suggestedLocation} />
        <Field label="완료 기준" help="산출물이 완료되었다고 볼 수 있는 최소 기준입니다." value={state.completionStandard} onChange={(value) => update({ completionStandard: value })} placeholder={suggestedCompletion} minHeight="min-h-32" />
        <Field label="산출물-KPI 연결 확인" help="KPI를 다시 평가하지 않고, 산출물이 KPI 확인에 필요한 기록인지 확인합니다." value={state.outputKpiConnection} onChange={(value) => update({ outputKpiConnection: value })} placeholder={suggestedKpiConnection} minHeight="min-h-32" />
        <Field label="CSF 반영 확인" help="CSF를 재정의하지 않고, 업무산출물과 업무분해가 CSF를 놓치지 않도록 확인합니다." value={state.outputCsfConnection} onChange={(value) => update({ outputCsfConnection: value })} placeholder={suggestedCsfConnection} minHeight="min-h-32" />
      </div>
    </Card>

    <Card title="AI로 업무산출물과 업무분해 후보 만들기" tone="violet">
      <p className="text-sm font-bold leading-6 text-slate-600">6단계의 AI 활용은 업무분해 후보 생성에 집중합니다. 5단계 AI 검토 요약은 필요한 경우에만 펼쳐서 선택 참고자료로 추가하세요.</p>
      <details className="rounded-2xl border border-violet-100 bg-violet-50 p-4 text-sm leading-6 text-slate-700">
        <summary className="cursor-pointer text-sm font-black text-violet-900">선택 사항 · 5단계 AI 검토 요약 참고하기</summary>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-violet-100 bg-white p-4 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">5단계 사람 검토 요약</p>
            <p className="mt-2 whitespace-pre-wrap rounded-xl bg-violet-50 px-3 py-2 text-slate-600">{compact(aiExpansion.review)}</p>
            {!hasAiExpansionReview ? <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-amber-900">검토 요약이 없으면 이 선택 참고자료는 사용하지 않습니다.</p> : null}
          </div>
          <div className="rounded-2xl border border-violet-100 bg-white p-4 text-xs font-bold leading-5 text-slate-600">
            <p className="font-black text-violet-800">반영 원칙</p>
            <p className="mt-2">1. 관리할 업무과제·업무산출물·업무 단위로 바꿀 수 있는 내용만 참고합니다.</p>
            <p>2. 성과기준을 새로 만들거나 KPI를 다시 해석하지 않습니다.</p>
            <p>3. 사람관리, 코칭, 1on1 판단은 만들지 않습니다.</p>
            <button type="button" className="mt-4 rounded-xl bg-violet-700 px-4 py-2 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-50" onClick={bringAiExpansionReview} disabled={!hasAiExpansionReview}>선택 참고자료로 추가</button>
          </div>
        </div>
        <div className="mt-3">
          <Field label="업무분해에 참고할 5단계 AI 후보" help="선택 사항입니다. 5단계에서 사람이 검토한 내용 중 업무과제·산출물·업무 단위로 바꿀 수 있는 내용만 남깁니다." value={state.aiExpansionAppliedNote} onChange={(value) => update({ aiExpansionAppliedNote: value })} placeholder={'[5단계 사람 검토 요약 중 업무분해에 참고할 내용]\n\n[6단계 적용 원칙]'} minHeight="min-h-32" />
        </div>
      </details>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-black text-white" onClick={buildAiPrompt}>AI 업무분해 프롬프트 만들기</button>
        <button type="button" className="rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-black text-violet-800 disabled:cursor-not-allowed disabled:opacity-50" onClick={copyAiPrompt} disabled={!textOrEmpty(state.aiPrompt)}>프롬프트 복사하기</button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="AI에게 입력할 프롬프트" value={state.aiPrompt} onChange={(value) => update({ aiPrompt: value })} placeholder="버튼을 누르면 관리할 업무과제와 업무산출물 기반 업무분해 프롬프트가 생성됩니다." minHeight="min-h-64" />
        <Field label="AI 결과 붙여넣기" value={state.aiResult} onChange={(value) => update({ aiResult: value })} placeholder="AI가 제안한 업무산출물 보완안과 업무분해 후보를 붙여넣습니다." minHeight="min-h-64" />
        <Field label="사람 검토 보완" help="유지할 업무, 제외할 업무, 현장 표현으로 수정할 내용을 정리합니다." value={state.humanReview} onChange={(value) => update({ humanReview: value })} placeholder="AI 결과 중 실제로 사용할 내용과 제외할 내용을 씁니다." minHeight="min-h-40" />
        <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4 text-xs font-bold leading-5 text-violet-950"><p className="font-black">검토 기준</p><p className="mt-2">관리할 업무과제와 연결되는가?</p><p>업무산출물이 명확한가?</p><p>기록 위치와 완료 기준이 있는가?</p><p>5단계 KPI 확인에 필요한 흔적이 남는가?</p><p>CSF를 놓치지 않도록 업무 단위가 나뉘었는가?</p><p>역할·일정·병목·코칭 내용이 섞이지 않았는가?</p></div>
      </div>
    </Card>

    <Card title="최종 업무분해 선택" tone="slate">
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="AI 업무분해 초안" help="AI 결과 중 업무 단위 후보만 옮겨 적거나 수정합니다." value={state.workBreakdownDraft} onChange={(value) => update({ workBreakdownDraft: value })} placeholder={defaultWorkItems} minHeight="min-h-48" />
        <Field label="최종 선택한 업무 단위 3~5개" help="7단계에서 순서·역할·일정으로 바꿀 업무 단위만 남깁니다." value={state.selectedWorkItems} onChange={(value) => update({ selectedWorkItems: value })} placeholder={defaultWorkItems} minHeight="min-h-48" />
        <Field label="업무별 완료 기준" help="각 업무가 어디까지 되면 완료인지 정합니다." value={state.workItemCompletionCriteria} onChange={(value) => update({ workItemCompletionCriteria: value })} placeholder={defaultWorkCriteria} minHeight="min-h-48" />
        <Field label="6단계에서 제외한 업무" help="7~8단계나 사람관리에서 다룰 내용은 여기서 제외했다고 명시합니다." value={state.excludedWorkItems} onChange={(value) => update({ excludedWorkItems: value })} placeholder="업무 순서·역할·일정, 병목·에스컬레이션, 사람관리 판단은 6단계에서 제외한다. 체크포인트 세부 설계는 7단계에서 다룬다." minHeight="min-h-48" />
      </div>
      <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={makeWorkBreakdownHandoff}>관리할 업무과제와 업무분해 확정하기</button>
    </Card>

    <Card title="최종 실행계획과 7단계 전달 메모" tone="emerald">
      <p className="text-sm font-bold leading-6 text-slate-600">6단계는 관리할 업무과제, 업무산출물, 업무분해를 최종 실행계획으로 마무리합니다. 실제 업무 순서, 역할과 책임, 일정과 체크포인트, 업무량 조정, 업무지시 초안은 7단계에서 만듭니다.</p>
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-black text-emerald-900">최종 실행계획 줄 수: {planLineCount}</div>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="최종 실행계획" value={state.finalExecutionPlan} onChange={(value) => update({ finalExecutionPlan: value })} placeholder="관리할 업무과제와 업무분해 확정 버튼을 누르면 생성됩니다." minHeight="min-h-64" />
        <Field label="7단계 전달 메모" value={state.step6HandoffToStep7} onChange={(value) => update({ step6HandoffToStep7: value })} placeholder="7단계에서 업무 순서·역할·일정·업무지시 초안으로 바꿀 입력값입니다." minHeight="min-h-64" />
      </div>
    </Card>
  </section>;
}
