import { useMemo, type ReactNode } from 'react';
import { useStored } from './journey-storage';

const V41_TASK_PRIORITY_FLOW_MARKERS = [
  'V41TaskPriorityFlowLab',
  '할 일·줄일 일',
  '6단계 실행계획 확인',
  '6단계 요약 입력값',
  '긴 원문 표시 금지',
  '중복 문장 정리 표시',
  '먼저 할 일 고르기',
  '잠시 줄일 일 고르기',
  '업무 흐름 3단계 만들기',
  '실행 선언문',
  'ckd.v41.taskManagement.v10',
].join('|');
void V41_TASK_PRIORITY_FLOW_MARKERS;

type ExecutionCycle = '1주' | '2주' | '4주' | '월간' | '분기';

type TaskState = Record<string, any> & {
  executionCycle?: ExecutionCycle;
  confirmedTeamStandard?: string;
  managementTaskType?: string;
  managementTask?: string;
  managementTaskReason?: string;
  selectedOutput?: string;
  outputLocation?: string;
  completionStandard?: string;
  selectedWorkItems?: string;
  workItemCompletionCriteria?: string;
  excludedWorkItems?: string;
  step6HandoffToStep7?: string;
  finalExecutionPlan?: string;
  taskInstructionDraft?: string;
  pauseActivities?: string;
  evidenceToCheck?: string;
  midCheckQuestions?: string;
  selectedPriorityTasks?: string[];
  selectedReduceTasks?: string[];
  priorityReason?: string;
  reduceReason?: string;
  flowStepOne?: string;
  flowStepTwo?: string;
  flowStepThree?: string;
  bottleneckSignal?: string;
  midCheckQuestion?: string;
  executionDeclaration?: string;
};

const STORAGE_KEY = 'ckd.v41.taskManagement.v10';
const DEFAULT_TASK_STATE: TaskState = {};

const PRIORITY_TASKS = [
  '최종 선택한 업무 단위 중 가장 먼저 시작할 업무 1개 고르기',
  '업무산출물 작성에 필요한 기존 기록·자료 먼저 확인하기',
  '업무별 완료 기준이 불분명한 항목 먼저 정리하기',
  '기록 위치와 산출물 저장 위치를 먼저 맞추기',
  '누락·미분류·추가 확인 필요 항목 먼저 표시하기',
  '7단계에서 역할·일정으로 배정할 업무 단위를 확정하기',
];

const REDUCE_TASKS = [
  '6단계 업무산출물과 연결되지 않는 추가 자료 만들기',
  '최종 선택 업무 단위 밖의 업무를 함께 진행하기',
  '역할·일정이 정해지기 전에 모든 업무를 동시에 시작하기',
  'KPI 확인과 무관한 장문 기록 작성하기',
  '제외 업무로 분리한 전략·성과관리·사람관리 업무를 다시 끌어오기',
  '확인 증거 없이 완료로 처리하기',
];

function toggle(list: string[] = [], value: string, max = 2) {
  if (list.includes(value)) return list.filter((item) => item !== value);
  if (list.length >= max) return list;
  return [...list, value];
}

function compact(value?: string) {
  return value?.trim() || '미작성';
}

function short(value?: string, max = 180) {
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
  const generatedSuffix = '의 결과로 남길 업무산출물';
  if (raw.includes(generatedSuffix)) {
    const base = stripSentenceEnd(raw.replace(generatedSuffix, '').replace(task, task));
    if (base.includes('관리표')) return `${base.replace(/관리표.*$/g, '관리표')}`;
    if (base.includes('현황')) return `${base.replace(/현황.*$/g, '현황표')}`;
    if (base.includes('리스트')) return `${base.replace(/리스트.*$/g, '리스트')}`;
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
  return short(raw, 150);
}

function displayEvidenceSummary(state: TaskState, outputName: string, completionText: string) {
  const location = compact(state.outputLocation);
  const raw = compact(state.evidenceToCheck);
  const evidenceParts = [
    outputName !== '미작성' ? outputName : '업무산출물',
    location !== '미작성' ? location : '지정 기록 위치',
    completionText !== '미작성' ? '누락·다음 행동 확인 흔적' : '완료 기준 확인 흔적',
  ];
  if (raw === '미작성') return evidenceParts.join(' / ');
  if (raw.includes('의 결과로 남길 업무산출물') || raw.includes('와 관련된 기록 또는 결과물')) return evidenceParts.join(' / ');
  return short(raw, 150);
}

function lines(value?: string, max = 5) {
  return compact(value)
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-•]\s*/, '').trim())
    .filter(Boolean)
    .slice(0, max);
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"><h3 className="text-lg font-black text-slate-950">{title}</h3><div className="mt-4 space-y-3">{children}</div></section>;
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="text-sm font-black text-slate-950">{label}</span><textarea className="mt-3 min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

function SummaryLine({ label, value }: { label: string; value?: string }) {
  return <p><span className="font-black text-slate-700">{label}: </span><span>{short(value)}</span></p>;
}

export function V41TaskPriorityFlowLab() {
  const [state, setState] = useStored<TaskState>(STORAGE_KEY, DEFAULT_TASK_STATE);
  const update = (patch: Partial<TaskState>) => setState({ ...state, ...patch });
  const selectedPriority = state.selectedPriorityTasks ?? [];
  const selectedReduce = state.selectedReduceTasks ?? [];
  const executionCycle = state.executionCycle ?? '2주';
  const selectedWorkItems = lines(state.selectedWorkItems, 5);
  const completionCriteria = lines(state.workItemCompletionCriteria, 5);
  const excludedItems = lines(state.excludedWorkItems, 4);
  const displayOutput = displayOutputName(state.selectedOutput, state.managementTask);
  const displayCompletion = displayCompletionStandard(state.completionStandard, state.managementTask);
  const displayEvidence = displayEvidenceSummary(state, displayOutput, displayCompletion);

  const suggestedFlow = useMemo(() => {
    const first = selectedPriority[0] || selectedWorkItems[0] || '최종 선택한 업무 단위 중 가장 먼저 시작할 업무를 정한다.';
    const second = selectedPriority[1] || selectedWorkItems[1] || '업무별 완료 기준과 확인 증거를 기준으로 실행 상태를 본다.';
    const reduce = selectedReduce[0] || '6단계에서 제외한 업무와 성과 기준에 직접 연결되지 않는 활동을 잠시 줄인다.';
    return { first, second, reduce };
  }, [selectedPriority, selectedReduce, selectedWorkItems]);

  const makeFlow = () => update({
    flowStepOne: suggestedFlow.first,
    flowStepTwo: suggestedFlow.second,
    flowStepThree: `${executionCycle} 실행관리 주기 안에서 산출물 위치와 완료 기준을 확인한다.`,
    bottleneckSignal: '최종 선택 업무 단위가 진행되지 않거나, 산출물·기록 위치·완료 기준 중 하나가 비어 있으면 막힘 신호로 본다.',
    midCheckQuestion: state.midCheckQuestions || '이번 실행관리 주기에서 최종 선택 업무 단위 중 완료 기준까지 도달한 것은 무엇인가요?',
    executionDeclaration: `이번 ${executionCycle} 동안 ${suggestedFlow.first} 그리고 ${suggestedFlow.reduce}`,
  });

  return <section className="space-y-4">
    <section className="rounded-3xl border border-amber-100 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-amber-700">할 일·줄일 일</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">6단계 실행계획을 할 일과 줄일 일로 정리하기</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-600">6단계 전체 원문을 다시 복사하지 않습니다. 관리할 업무과제, 최종 선택 업무 단위, 완료 기준만 받아 업무 순서·역할·일정으로 바꿀 준비를 합니다.</p>
    </section>

    <Card title="6단계 실행계획 확인">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
        <p className="mb-2 text-xs font-black text-amber-700">6단계 요약 입력값 · 긴 원문 표시 금지 · 중복 문장 정리 표시</p>
        <SummaryLine label="실행관리 주기" value={executionCycle} />
        <SummaryLine label="업무과제 유형" value={state.managementTaskType} />
        <SummaryLine label="관리할 업무과제" value={state.managementTask} />
        <SummaryLine label="업무산출물" value={displayOutput} />
        <SummaryLine label="기록 위치" value={state.outputLocation} />
        <SummaryLine label="완료 기준" value={displayCompletion} />
        <SummaryLine label="확인 증거" value={displayEvidence} />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-950">
          <p className="font-black">최종 선택한 업무 단위</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">{selectedWorkItems.length ? selectedWorkItems.map((item) => <li key={item}>{item}</li>) : <li>미작성</li>}</ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold leading-5 text-slate-700">
          <p className="font-black text-slate-900">업무별 완료 기준</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">{completionCriteria.length ? completionCriteria.map((item) => <li key={item}>{item}</li>) : <li>미작성</li>}</ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold leading-5 text-slate-700">
          <p className="font-black text-slate-900">6단계에서 제외한 업무</p>
          <ul className="mt-2 list-disc space-y-1 pl-4">{excludedItems.length ? excludedItems.map((item) => <li key={item}>{item}</li>) : <li>미작성</li>}</ul>
        </div>
      </div>
    </Card>

    <section className="grid gap-3 md:grid-cols-2">
      <Card title="먼저 할 일 고르기">
        <p className="text-xs font-bold leading-5 text-slate-500">6단계 최종 업무 단위를 실행으로 옮기기 위해 최대 2개까지 선택합니다.</p>
        {PRIORITY_TASKS.map((task) => <label key={task} className="flex gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold"><input type="checkbox" checked={selectedPriority.includes(task)} onChange={() => update({ selectedPriorityTasks: toggle(selectedPriority, task) })} />{task}</label>)}
        <Field label="선택 이유" value={state.priorityReason ?? ''} onChange={(value) => update({ priorityReason: value })} placeholder="왜 이 일을 먼저 해야 하나요?" />
      </Card>
      <Card title="잠시 줄일 일 고르기">
        <p className="text-xs font-bold leading-5 text-slate-500">실행 여력을 만들기 위해 최대 2개까지 줄입니다.</p>
        {REDUCE_TASKS.map((task) => <label key={task} className="flex gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold"><input type="checkbox" checked={selectedReduce.includes(task)} onChange={() => update({ selectedReduceTasks: toggle(selectedReduce, task) })} />{task}</label>)}
        <Field label="줄이는 이유" value={state.reduceReason ?? ''} onChange={(value) => update({ reduceReason: value })} placeholder="무엇을 줄여야 실행 여력이 생기나요?" />
      </Card>
    </section>

    <Card title="업무 흐름 3단계 만들기">
      <button type="button" className="rounded-xl bg-amber-700 px-4 py-2 text-sm font-black text-white" onClick={makeFlow}>선택한 내용으로 흐름 만들기</button>
      <div className="grid gap-3 md:grid-cols-3">
        <Field label="1단계" value={state.flowStepOne ?? ''} onChange={(value) => update({ flowStepOne: value })} placeholder="먼저 확인할 일을 씁니다." />
        <Field label="2단계" value={state.flowStepTwo ?? ''} onChange={(value) => update({ flowStepTwo: value })} placeholder="다음으로 정리할 일을 씁니다." />
        <Field label="3단계" value={state.flowStepThree ?? ''} onChange={(value) => update({ flowStepThree: value })} placeholder="점검과 공유 기준을 씁니다." />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="막힘 신호" value={state.bottleneckSignal ?? ''} onChange={(value) => update({ bottleneckSignal: value })} placeholder="어떤 신호가 보이면 팀장이 개입해야 하나요?" />
        <Field label="중간 확인 질문" value={state.midCheckQuestion ?? ''} onChange={(value) => update({ midCheckQuestion: value })} placeholder="중간 점검 때 무엇을 물어볼까요?" />
      </div>
      <Field label="실행 선언문" value={state.executionDeclaration ?? ''} onChange={(value) => update({ executionDeclaration: value })} placeholder="팀원에게 짧게 말할 실행 선언문을 씁니다." />
    </Card>
  </section>;
}
