import { useMemo, type ReactNode } from 'react';
import { useStored } from './journey-storage';

const V41_TASK_EXECUTION_BRIDGE_MARKERS = [
  'V41TaskExecutionBridgeLab',
  'v41 task execution bridge lab cloned',
  'v41 task execution copy refined',
  '업무지시 만들기',
  '성과 기준을 업무지시로 바꾸기',
  '빠진 기준 확인하기',
  '팀원이 움직일 문장으로 바꾸기',
  '다음 단계로 넘길 실행 과제',
  'ckd.v41.performanceCascade.v1',
  'ckd.v41.taskManagement.v10',
].join('|');
void V41_TASK_EXECUTION_BRIDGE_MARKERS;

type PerformanceState = Record<string, any> & {
  teamStandard?: string;
  twoWeekFirstAction?: string;
  pauseActivity?: string;
  midCheckQuestion?: string;
  finalExecutionStandard?: string;
};

type Criterion = '배경' | '목적' | '범위' | '우선순위' | '일정' | '완료 기준' | '중간 확인';

type TaskExecutionState = {
  baseInstruction: string;
  selectedCriteria: Criterion[];
  revisedInstruction: string;
  completionCriteria: string;
  leaderSupport: string;
  nextTaskMemo: string;
};

const PERFORMANCE_STORAGE_KEY = 'ckd.v41.performanceCascade.v1';
const TASK_STORAGE_KEY = 'ckd.v41.taskManagement.v10';
const CRITERIA: Criterion[] = ['배경', '목적', '범위', '우선순위', '일정', '완료 기준', '중간 확인'];
const DEFAULT_PERFORMANCE_STATE: PerformanceState = {};
const DEFAULT_TASK_STATE: TaskExecutionState = {
  baseInstruction: '',
  selectedCriteria: ['목적', '범위', '완료 기준', '중간 확인'],
  revisedInstruction: '',
  completionCriteria: '',
  leaderSupport: '',
  nextTaskMemo: '',
};

function textOrEmpty(value?: string) {
  return value?.trim() || '';
}

function line(label: string, value?: string) {
  return <p><span className="font-black text-slate-700">{label}: </span><span>{textOrEmpty(value) || '미작성'}</span></p>;
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"><h3 className="text-lg font-black text-slate-950">{title}</h3><div className="mt-4 space-y-3">{children}</div></section>;
}

function Field({ label, help, value, onChange, placeholder }: { label: string; help?: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="text-sm font-black text-slate-950">{label}</span>{help ? <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{help}</p> : null}<textarea className="mt-3 min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

function toggleCriterion(list: Criterion[], criterion: Criterion) {
  return list.includes(criterion) ? list.filter((item) => item !== criterion) : [...list, criterion];
}

export function V41TaskExecutionBridgeLab() {
  const [performanceState] = useStored<PerformanceState>(PERFORMANCE_STORAGE_KEY, DEFAULT_PERFORMANCE_STATE);
  const [state, setState] = useStored<TaskExecutionState>(TASK_STORAGE_KEY, DEFAULT_TASK_STATE);
  const update = (patch: Partial<TaskExecutionState>) => setState({ ...state, ...patch });

  const suggestedInstruction = useMemo(() => {
    const standard = textOrEmpty(performanceState.finalExecutionStandard) || textOrEmpty(performanceState.twoWeekFirstAction) || '선택 KPI와 연결되는 기록과 후속 행동을 확인한다.';
    return `${standard} 이번 2주 동안 실행 기준이 보이도록 팀원별 다음 행동을 정리해 주세요.`;
  }, [performanceState.finalExecutionStandard, performanceState.twoWeekFirstAction]);

  const makeDraft = () => {
    const instruction = textOrEmpty(state.baseInstruction) || suggestedInstruction;
    const selected = state.selectedCriteria.length ? state.selectedCriteria.join(', ') : '목적, 범위, 완료 기준, 중간 확인';
    update({
      revisedInstruction: `${instruction}\n\n이번 업무는 ${selected} 기준이 보이도록 진행합니다. 고객 반응과 다음 행동이 기록에 남고, 막히는 부분은 중간 점검 때 바로 공유해 주세요.`,
      completionCriteria: '고객 반응, 다음 행동, 담당자, 확인 시점이 기록에 남아 있으면 완료로 봅니다.',
      leaderSupport: '팀장은 중간 점검에서 막힌 고객군, 자료 확인 필요, 우선순위 충돌을 확인하고 지원합니다.',
      nextTaskMemo: '다음 단계에서는 먼저 할 일 2개, 잠시 줄일 일 2개, 업무 흐름 3단계로 바꿉니다.',
    });
  };

  return <section className="space-y-4">
    <section className="rounded-3xl border border-cyan-100 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-cyan-700">업무지시 만들기</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">성과 기준을 업무지시로 바꾸기</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-600">성과관리에서 만든 2주 기준을 팀원이 바로 움직일 수 있는 업무지시로 바꿉니다.</p>
    </section>

    <Card title="성과관리에서 넘어온 기준">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
        {line('팀 기준 초안', performanceState.teamStandard)}
        {line('이번 2주 동안 먼저 볼 것', performanceState.twoWeekFirstAction)}
        {line('잠시 줄일 활동', performanceState.pauseActivity)}
        {line('팀장 중간 점검 질문', performanceState.midCheckQuestion)}
        {line('업무관리로 넘길 실행 기준', performanceState.finalExecutionStandard)}
      </div>
    </Card>

    <Card title="빠진 기준 확인하기">
      <Field label="현재 업무지시 초안" help="성과 기준을 팀원에게 말한다고 생각하고 한 문장으로 적습니다." value={state.baseInstruction || suggestedInstruction} onChange={(value) => update({ baseInstruction: value })} placeholder={suggestedInstruction} />
      <div className="grid gap-2 md:grid-cols-4">
        {CRITERIA.map((criterion) => <label key={criterion} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-black"><input type="checkbox" checked={state.selectedCriteria.includes(criterion)} onChange={() => update({ selectedCriteria: toggleCriterion(state.selectedCriteria, criterion) })} />{criterion}</label>)}
      </div>
      <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={makeDraft}>팀원이 움직일 문장으로 바꾸기</button>
    </Card>

    <Card title="수정한 업무지시">
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="업무지시문" value={state.revisedInstruction} onChange={(value) => update({ revisedInstruction: value })} placeholder="팀원이 무엇을, 어디까지, 언제 확인해야 하는지 보이게 씁니다." />
        <Field label="완료 기준" value={state.completionCriteria} onChange={(value) => update({ completionCriteria: value })} placeholder="예: 고객 반응, 다음 행동, 담당자, 확인 시점이 기록에 남으면 완료로 본다." />
        <Field label="팀장 지원 기준" value={state.leaderSupport} onChange={(value) => update({ leaderSupport: value })} placeholder="예: 막힌 고객군, 자료 확인 필요, 우선순위 충돌은 팀장에게 공유한다." />
        <Field label="다음 단계로 넘길 실행 과제" value={state.nextTaskMemo} onChange={(value) => update({ nextTaskMemo: value })} placeholder="예: 먼저 할 일 2개, 잠시 줄일 일 2개, 업무 흐름 3단계로 바꾼다." />
      </div>
    </Card>
  </section>;
}
