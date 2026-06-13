import { useMemo, type ReactNode } from 'react';
import { useStored } from './journey-storage';

const V41_TASK_PRIORITY_FLOW_MARKERS = [
  'V41TaskPriorityFlowLab',
  'v41 task priority flow lab cloned',
  'v41 task priority flow copy refined',
  '할 일·줄일 일',
  '먼저 할 일 고르기',
  '잠시 줄일 일 고르기',
  '업무 흐름 3단계 만들기',
  '30초 실행 선언문',
  'ckd.v41.taskManagement.v10',
].join('|');
void V41_TASK_PRIORITY_FLOW_MARKERS;

type TaskState = Record<string, any> & {
  revisedInstruction?: string;
  completionCriteria?: string;
  leaderSupport?: string;
  nextTaskMemo?: string;
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
  '고객 반응과 다음 행동이 보이는 기록 3건 확인하기',
  '후속조치가 끊긴 고객군 1개 찾기',
  '기록에 반드시 남길 항목 3개 정하기',
  '팀원별 막힌 지점 1개씩 확인하기',
  '금요일 점검에서 볼 샘플 기록 정하기',
  '지원이 필요한 자료·확인사항 분리하기',
];

const REDUCE_TASKS = [
  '방문 건수만 늘리는 활동',
  '다음 행동 없는 장문 기록',
  '목적 없는 보고자료 정리',
  '모든 고객군을 동일하게 챙기기',
  '확인 없이 자료를 새로 만드는 일',
  '회의에서 기록을 다시 설명하는 시간',
];

function toggle(list: string[] = [], value: string, max = 2) {
  if (list.includes(value)) return list.filter((item) => item !== value);
  if (list.length >= max) return list;
  return [...list, value];
}

function compact(value?: string) {
  return value?.trim() || '미작성';
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"><h3 className="text-lg font-black text-slate-950">{title}</h3><div className="mt-4 space-y-3">{children}</div></section>;
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="text-sm font-black text-slate-950">{label}</span><textarea className="mt-3 min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

export function V41TaskPriorityFlowLab() {
  const [state, setState] = useStored<TaskState>(STORAGE_KEY, DEFAULT_TASK_STATE);
  const update = (patch: Partial<TaskState>) => setState({ ...state, ...patch });
  const selectedPriority = state.selectedPriorityTasks ?? [];
  const selectedReduce = state.selectedReduceTasks ?? [];

  const suggestedFlow = useMemo(() => {
    const first = selectedPriority[0] || '기록과 고객 반응을 먼저 확인한다.';
    const second = selectedPriority[1] || '후속 행동이 끊긴 지점을 찾는다.';
    const reduce = selectedReduce[0] || '성과 기준과 직접 연결되지 않는 활동을 잠시 줄인다.';
    return { first, second, reduce };
  }, [selectedPriority, selectedReduce]);

  const makeFlow = () => update({
    flowStepOne: suggestedFlow.first,
    flowStepTwo: suggestedFlow.second,
    flowStepThree: '금요일 점검에서 막힌 지점과 지원 요청을 공유한다.',
    bottleneckSignal: '고객 반응은 있는데 다음 행동, 담당자, 확인 시점이 비어 있으면 막힘 신호로 본다.',
    midCheckQuestion: '이번 주 기록에서 다음 행동으로 이어진 것과 아직 막힌 것은 무엇인가요?',
    executionDeclaration: `이번 2주 동안 ${suggestedFlow.first} 그리고 ${suggestedFlow.reduce}`,
  });

  return <section className="space-y-4">
    <section className="rounded-3xl border border-amber-100 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-amber-700">할 일·줄일 일</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">업무지시를 2주 실행 흐름으로 바꾸기</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-600">Step 7에서 만든 업무지시를 기준으로 먼저 할 일, 잠시 줄일 일, 업무 흐름 3단계를 정합니다.</p>
    </section>

    <Card title="이전 단계에서 넘어온 업무지시">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
        <p><span className="font-black text-slate-700">업무지시문: </span>{compact(state.revisedInstruction)}</p>
        <p><span className="font-black text-slate-700">완료 기준: </span>{compact(state.completionCriteria)}</p>
        <p><span className="font-black text-slate-700">팀장 지원 기준: </span>{compact(state.leaderSupport)}</p>
        <p><span className="font-black text-slate-700">다음 실행 과제: </span>{compact(state.nextTaskMemo)}</p>
      </div>
    </Card>

    <section className="grid gap-3 md:grid-cols-2">
      <Card title="먼저 할 일 고르기">
        <p className="text-xs font-bold leading-5 text-slate-500">최대 2개까지 선택합니다.</p>
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
      <Field label="30초 실행 선언문" value={state.executionDeclaration ?? ''} onChange={(value) => update({ executionDeclaration: value })} placeholder="팀원에게 30초 안에 말할 실행 선언문을 씁니다." />
    </Card>
  </section>;
}
