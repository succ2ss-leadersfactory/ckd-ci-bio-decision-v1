import { useMemo, type ReactNode } from 'react';
import { useStored } from './journey-storage';

const V41_TASK_EXECUTION_BRIDGE_MARKERS = [
  'V41TaskExecutionBridgeLab',
  '업무관리 실행계획 만들기',
  '6단계: 관리할 업무과제와 산출물 정하기',
  '이번 주기 관리할 업무과제',
  '5단계 기준은 입력값으로만 사용',
  '성과기준 재평가 금지',
  '사람관리 판단 금지',
  '업무산출물 정의',
  '업무분해 후보 만들기',
  '산출물-KPI 연결 확인',
  'CSF 반영 확인',
  '7단계 업무지시로 넘기기',
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

type TaskExecutionState = {
  confirmedTeamStandard: string;
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
const DEFAULT_TASK_STATE: TaskExecutionState = {
  confirmedTeamStandard: '',
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
    '1주': '기존 기록 정리, 누락 확인, 짧은 보완 업무에 적합합니다.',
    '2주': '새 산출물 작성, 기준 통일, 첫 실행 확인에 적합한 기본 실습 주기입니다.',
    '4주': '반복 운영, 패턴 확인, 누적 기록 관리에 적합합니다.',
    '월간': '월간 보고, 정기 점검, 팀 단위 현황 정리에 적합합니다.',
    '분기': '큰 과제의 중간 정리, 전략 과제 단위 산출물 정의에 적합합니다.',
  };
  return map[cycle];
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

  const suggestedManagementTask = rawInitiative
    ? `${rawInitiative}를 이번 주기에서 관리 가능한 업무과제로 구체화한다.`
    : `${selectedKpi} 확인에 필요한 업무과제를 하나 정한다.`;
  const suggestedManagementReason = `${selectedKpi}를 확인할 수 있는 업무산출물을 만들기 위해 이번 주기 관리 대상을 먼저 좁힌다.`;
  const suggestedIncludedScope = '이번 주기에 실제로 작성·정리·확인할 업무 범위를 쓴다. 예: 필수 항목 정리, 기존 자료 확인, 산출물 작성, 누락 확인.';
  const suggestedExcludedScope = '이번 주기에서 다루지 않을 범위를 쓴다. 예: 개인별 코칭, 고객 설득 전략, 역할 배정, 일정표, 병목 대응.';
  const managementTask = textOrEmpty(state.managementTask) || suggestedManagementTask;
  const suggestedOutput = `${managementTask}의 결과로 남길 업무산출물`;
  const suggestedLocation = 'CRM 기록, 팀 공유 시트, 주간 업무관리 메모 중 하나로 통일';
  const suggestedCompletion = `${managementTask}와 관련된 기록 또는 결과물이 정해진 위치에 남아 있고, 누락 여부를 확인할 수 있어야 한다.`;
  const suggestedKpiConnection = `이 산출물은 ${selectedKpi} 확인에 필요한 기록 또는 결과물이어야 한다.`;
  const suggestedCsfConnection = `업무분해 과정에서 ${selectedCsf}를 놓치지 않도록 필수 항목과 완료 기준을 정한다.`;

  const defaultWorkItems = [
    '업무산출물에 반드시 들어갈 항목을 정한다.',
    '기존 기록·자료 중 활용할 수 있는 것을 확인한다.',
    '산출물을 남길 위치와 입력 기준을 정한다.',
    '실행 후 산출물을 작성한다.',
    '완료 기준에 맞게 누락 여부를 확인한다.',
  ].join('\n');

  const defaultWorkCriteria = [
    '필수 항목이 빠지지 않았다.',
    '정해진 위치에 산출물이 남았다.',
    '5단계 KPI 확인에 필요한 흔적이 보인다.',
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

  const buildAiPrompt = () => {
    if (!hasBaseCriteria) {
      window.alert('5단계에서 기본 팀 전략과제·CSF·KPI를 먼저 선택해 주세요. AI 추가 후보는 선택 사항이지만, 기본 기준은 6단계 업무분해의 출발점입니다.');
      return;
    }
    if (!hasManagementTask) {
      window.alert('먼저 “이번 주기 관리할 업무과제”를 작성해 주세요. 관리할 과제가 정해져야 실행관리 주기와 업무산출물을 기준으로 업무분해를 할 수 있습니다.');
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
        `[이번 주기 관리할 업무과제]\n${textOrEmpty(state.managementTask)}`,
        `[이 과제를 선택한 이유]\n${textOrEmpty(state.managementTaskReason) || suggestedManagementReason}`,
        `[이번 주기에 포함할 업무 범위]\n${textOrEmpty(state.includedWorkScope) || suggestedIncludedScope}`,
        `[이번 주기에서 제외할 업무 범위]\n${textOrEmpty(state.excludedWorkScope) || suggestedExcludedScope}`,
        '',
        `[실행관리 주기]\n${state.executionCycle} - ${cycleHelp(state.executionCycle)}`,
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

  const makeWorkBreakdownHandoff = () => {
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
    const excludedWorkItems = textOrEmpty(state.excludedWorkItems) || '7단계에서 다룰 업무 순서·역할·일정, 8단계에서 다룰 병목·에스컬레이션, 9단계 이후 사람관리 판단은 6단계 업무분해에서 제외한다.';
    const aiReview = [textOrEmpty(state.aiResult), textOrEmpty(state.humanReview)].filter(Boolean).join('\n\n[사람 검토 보완]\n');
    const workItems = firstLines(selectedWorkItems, 3);
    const step6HandoffToStep7 = [
      '[6단계 전달 메모]',
      `이번 주기 관리할 업무과제: ${managementTaskValue}`,
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
      '[이번 주기 관리할 업무과제]',
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
      <p className="mt-2 text-sm font-bold leading-6 text-slate-600">5단계에서 정한 팀 전략과제·CSF·KPI는 입력값으로만 사용합니다. 먼저 이번 실행관리 주기에서 실제로 관리할 업무과제를 정한 뒤, 그 과제를 업무산출물과 업무 단위로 바꿉니다.</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs font-black text-cyan-800"><span className="rounded-full bg-cyan-50 px-3 py-1">관리할 업무과제 먼저</span><span className="rounded-full bg-cyan-50 px-3 py-1">성과기준 재평가 금지</span><span className="rounded-full bg-cyan-50 px-3 py-1">사람관리 판단 금지</span><span className="rounded-full bg-cyan-50 px-3 py-1">업무산출물</span><span className="rounded-full bg-cyan-50 px-3 py-1">업무분해</span><span className="rounded-full bg-cyan-50 px-3 py-1">7단계 전달</span></div>
    </section>

    <Card title="5단계 기준 확인" tone="cyan">
      <p className="text-sm font-bold leading-6 text-slate-600">이 내용은 관리할 업무과제를 정하기 위한 입력값입니다. 이 화면에서는 전략과제·CSF·KPI를 새로 만들거나 평가하지 않습니다.</p>
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
        <p>- 역할·일정·업무량 조정은 7단계에서 다룹니다.</p>
        <p>- 업무 경계·병목·에스컬레이션은 8단계에서 다룹니다.</p>
        <p>- 팀원 역량·태도·동기·코칭 판단은 사람관리 단계에서 다룹니다.</p>
      </div>
    </Card>

    <Card title="이번 주기 관리할 업무과제 정하기" tone="emerald">
      <p className="text-sm font-bold leading-6 text-slate-600">실행관리 주기와 업무산출물을 정하기 전에, 이번 주기에서 실제로 관리할 업무과제를 하나로 좁힙니다. 과제가 정해져야 무엇을 남길지, 얼마 동안 관리할지 정할 수 있습니다.</p>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="이번 주기 관리할 업무과제" help="5단계 기준을 바탕으로 이번 주기에 실제로 관리할 업무를 한 문장으로 씁니다." value={state.managementTask} onChange={(value) => update({ managementTask: value })} placeholder={suggestedManagementTask} minHeight="min-h-32" />
        <Field label="이 과제를 선택한 이유" help="KPI 확인과 CSF 누락 방지 관점에서 왜 이 과제를 이번 주기에 관리하는지 씁니다." value={state.managementTaskReason} onChange={(value) => update({ managementTaskReason: value })} placeholder={suggestedManagementReason} minHeight="min-h-32" />
        <Field label="이번 주기에 포함할 업무 범위" help="이번 주기에 실제로 작성·정리·확인할 범위만 씁니다." value={state.includedWorkScope} onChange={(value) => update({ includedWorkScope: value })} placeholder={suggestedIncludedScope} minHeight="min-h-32" />
        <Field label="이번 주기에서 제외할 업무 범위" help="7~8단계나 사람관리에서 다룰 내용은 여기서 제외합니다." value={state.excludedWorkScope} onChange={(value) => update({ excludedWorkScope: value })} placeholder={suggestedExcludedScope} minHeight="min-h-32" />
      </div>
      {!hasManagementTask ? <p className="rounded-2xl border border-amber-100 bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-900">관리할 업무과제를 먼저 작성해야 AI 업무분해 프롬프트를 만들 수 있습니다.</p> : null}
    </Card>

    <Card title="실행관리 주기와 업무산출물 정의" tone="emerald">
      <p className="text-sm font-bold leading-6 text-slate-600">관리할 업무과제가 정해진 뒤에 실행관리 주기와 업무산출물을 정합니다. 업무과제의 성격에 맞춰 1주·2주·4주·월간·분기를 선택하세요.</p>
      <div className="grid gap-2 md:grid-cols-5">
        {EXECUTION_CYCLES.map((cycle) => <label key={cycle} className={`rounded-2xl border p-3 text-sm font-black ${state.executionCycle === cycle ? 'border-emerald-300 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-100' : 'border-slate-200 bg-slate-50 text-slate-700'}`}><input className="mr-2" type="radio" checked={state.executionCycle === cycle} onChange={() => update({ executionCycle: cycle })} />{cycle}<span className="mt-2 block text-xs font-bold leading-5 text-slate-500">{cycleHelp(cycle)}</span></label>)}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="이번 주기 업무산출물" help="이번 실행관리 주기 끝에 실제로 남아야 할 결과물입니다." value={state.selectedOutput} onChange={(value) => update({ selectedOutput: value })} placeholder={suggestedOutput} />
        <Field label="기록 위치" help="산출물이 어디에 남아야 하는지 정합니다." value={state.outputLocation} onChange={(value) => update({ outputLocation: value })} placeholder={suggestedLocation} />
        <Field label="완료 기준" help="산출물이 완료되었다고 볼 수 있는 최소 기준입니다." value={state.completionStandard} onChange={(value) => update({ completionStandard: value })} placeholder={suggestedCompletion} minHeight="min-h-32" />
        <Field label="산출물-KPI 연결 확인" help="KPI를 다시 평가하지 않고, 산출물이 KPI 확인에 필요한 기록인지 확인합니다." value={state.outputKpiConnection} onChange={(value) => update({ outputKpiConnection: value })} placeholder={suggestedKpiConnection} minHeight="min-h-32" />
        <Field label="CSF 반영 확인" help="CSF를 재정의하지 않고, 업무산출물과 업무분해가 CSF를 놓치지 않도록 확인합니다." value={state.outputCsfConnection} onChange={(value) => update({ outputCsfConnection: value })} placeholder={suggestedCsfConnection} minHeight="min-h-32" />
      </div>
    </Card>

    <Card title="선택 참고자료 · 5단계 AI 검토 요약" tone="violet">
      <p className="text-sm font-bold leading-6 text-slate-600">5단계에서 AI 확장 실습을 했다면, 사람이 검토한 요약만 업무분해 참고자료로 사용할 수 있습니다. AI 확장 실습을 하지 않았다면 이 영역은 건너뛰어도 됩니다.</p>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4 text-xs font-bold leading-5 text-violet-950">
          <p className="font-black">5단계 사람 검토 요약</p>
          <p className="mt-2 whitespace-pre-wrap rounded-xl bg-white px-3 py-2 text-slate-600">{compact(aiExpansion.review)}</p>
          {!hasAiExpansionReview ? <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-amber-900">검토 요약이 없으면 이 선택 참고자료는 사용하지 않습니다.</p> : null}
        </div>
        <div className="rounded-2xl border border-violet-100 bg-white p-4 text-xs font-bold leading-5 text-slate-600">
          <p className="font-black text-violet-800">반영 원칙</p>
          <p className="mt-2">1. 관리할 업무과제·업무산출물·업무 단위로 바꿀 수 있는 내용만 참고합니다.</p>
          <p>2. 성과기준을 새로 만들거나 KPI를 다시 해석하지 않습니다.</p>
          <p>3. 사람관리, 코칭, 1on1 판단은 만들지 않습니다.</p>
          <button type="button" className="mt-4 rounded-xl bg-violet-700 px-4 py-2 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-50" onClick={bringAiExpansionReview} disabled={!hasAiExpansionReview}>5단계 검토 요약 가져오기</button>
        </div>
      </div>
      <Field label="업무분해에 참고할 5단계 AI 후보" help="선택 사항입니다. 5단계에서 사람이 검토한 내용 중 업무과제·산출물·업무 단위로 바꿀 수 있는 내용만 남깁니다." value={state.aiExpansionAppliedNote} onChange={(value) => update({ aiExpansionAppliedNote: value })} placeholder={'[5단계 사람 검토 요약 중 업무분해에 참고할 내용]\n\n[6단계 적용 원칙]'} minHeight="min-h-40" />
    </Card>

    <Card title="AI로 업무산출물과 업무분해 후보 만들기" tone="violet">
      <button type="button" className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-black text-white" onClick={buildAiPrompt}>AI 업무분해 프롬프트 만들기</button>
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
        <Field label="6단계에서 제외한 업무" help="7~8단계나 사람관리에서 다룰 내용은 여기서 제외했다고 명시합니다." value={state.excludedWorkItems} onChange={(value) => update({ excludedWorkItems: value })} placeholder="업무 순서·역할·일정, 병목·에스컬레이션, 사람관리 판단은 6단계에서 제외한다." minHeight="min-h-48" />
      </div>
      <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={makeWorkBreakdownHandoff}>관리할 업무과제와 업무분해 확정하기</button>
    </Card>

    <Card title="최종 실행계획과 7단계 업무지시 초안" tone="emerald">
      <p className="text-sm font-bold leading-6 text-slate-600">6단계의 최종 실행계획은 관리할 업무과제, 업무산출물, 업무분해 요약입니다. 7단계에서는 이 내용을 받아 업무 순서, 역할과 책임, 일정과 체크포인트, 업무량 조정, 업무지시 초안을 만듭니다.</p>
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-black text-emerald-900">최종 실행계획 줄 수: {planLineCount}</div>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="최종 실행계획" value={state.finalExecutionPlan} onChange={(value) => update({ finalExecutionPlan: value })} placeholder="관리할 업무과제와 업무분해 확정 버튼을 누르면 생성됩니다." minHeight="min-h-64" />
        <Field label="7단계 업무지시 초안" value={state.taskInstructionDraft} onChange={(value) => update({ taskInstructionDraft: value })} placeholder="7단계로 넘길 업무과제와 업무분해 요약입니다." minHeight="min-h-64" />
        <Field label="7단계 전달 메모" value={state.step6HandoffToStep7} onChange={(value) => update({ step6HandoffToStep7: value })} placeholder="7단계에서 업무 실행흐름으로 바꿀 입력값입니다." minHeight="min-h-56" />
      </div>
    </Card>
  </section>;
}
