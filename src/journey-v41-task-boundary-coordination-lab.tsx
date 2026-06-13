import { type ReactNode } from 'react';
import { useStored } from './journey-storage';

const V41_TASK_BOUNDARY_MARKERS = [
  'V41TaskBoundaryCoordinationLab',
  'v41 task boundary coordination lab cloned',
  'v41 task boundary copy refined',
  '업무 경계 나누기',
  '팀원이 할 일',
  '팀장이 확인할 일',
  '협조 요청할 일',
  '경계 선언문 만들기',
  '다음 사람관리로 넘길 신호',
  'ckd.v41.taskManagement.v10',
].join('|');
void V41_TASK_BOUNDARY_MARKERS;

type BoundaryState = Record<string, any> & {
  selectedPriorityTasks?: string[];
  selectedReduceTasks?: string[];
  flowStepOne?: string;
  flowStepTwo?: string;
  flowStepThree?: string;
  bottleneckSignal?: string;
  midCheckQuestion?: string;
  executionDeclaration?: string;
  memberTasks?: string;
  leaderCheckTasks?: string;
  coordinationTasks?: string;
  riskBoundary?: string;
  boundaryDeclaration?: string;
  peopleSignal?: string;
};

const STORAGE_KEY = 'ckd.v41.taskManagement.v10';
const DEFAULT_STATE: BoundaryState = {};

const MEMBER_TASK_OPTIONS = [
  '고객 반응과 다음 행동을 기록에 남기기',
  '후속조치 예정일과 담당자를 정하기',
  '막힌 고객군과 필요한 지원을 표시하기',
  '중간 점검 전에 샘플 기록 2건 준비하기',
];

const LEADER_CHECK_OPTIONS = [
  '기록이 다음 행동으로 이어지는지 확인하기',
  '우선순위 충돌과 업무 과부하를 확인하기',
  '위험 표현과 민감정보 입력 가능성을 확인하기',
  '지원이 필요한 팀원을 먼저 파악하기',
];

const COORDINATION_OPTIONS = [
  '자료 확인이 필요한 내용은 내부 담당자에게 연결하기',
  '고객 문의 중 확인이 필요한 내용은 팀장에게 공유하기',
  '공통으로 반복되는 막힘은 팀 회의 안건으로 올리기',
  '승인자료 범위를 벗어날 수 있는 표현은 별도 확인하기',
];

function compact(value?: string | string[]) {
  if (Array.isArray(value)) return value.length ? value.join('\n- ') : '미작성';
  return value?.trim() || '미작성';
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"><h3 className="text-lg font-black text-slate-950">{title}</h3><div className="mt-4 space-y-3">{children}</div></section>;
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="text-sm font-black text-slate-950">{label}</span><textarea className="mt-3 min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

function OptionGroup({ title, options, value, onChange }: { title: string; options: string[]; value: string; onChange: (value: string) => void }) {
  const selected = value.split('\n').map((item) => item.replace(/^[-•]\s*/, '').trim()).filter(Boolean);
  const toggle = (option: string) => {
    const next = selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option];
    onChange(next.map((item) => `- ${item}`).join('\n'));
  };
  return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm font-black text-slate-950">{title}</p><div className="mt-3 space-y-2">{options.map((option) => <label key={option} className="flex gap-2 rounded-xl bg-white p-2 text-sm font-bold"><input type="checkbox" checked={selected.includes(option)} onChange={() => toggle(option)} />{option}</label>)}</div></div>;
}

export function V41TaskBoundaryCoordinationLab() {
  const [state, setState] = useStored<BoundaryState>(STORAGE_KEY, DEFAULT_STATE);
  const update = (patch: Partial<BoundaryState>) => setState({ ...state, ...patch });

  const makeBoundary = () => update({
    memberTasks: state.memberTasks || MEMBER_TASK_OPTIONS.slice(0, 2).map((item) => `- ${item}`).join('\n'),
    leaderCheckTasks: state.leaderCheckTasks || LEADER_CHECK_OPTIONS.slice(0, 2).map((item) => `- ${item}`).join('\n'),
    coordinationTasks: state.coordinationTasks || COORDINATION_OPTIONS.slice(0, 2).map((item) => `- ${item}`).join('\n'),
    riskBoundary: state.riskBoundary || '고객 의도 단정, 승인자료 범위 밖 표현, 내부 수치 공유는 팀원이 단독으로 처리하지 않습니다.',
    boundaryDeclaration: '팀원은 고객 반응과 다음 행동을 기록하고, 팀장은 막힘과 위험 표현을 확인하며, 확인이 필요한 자료·표현은 관련 담당자와 연결합니다.',
    peopleSignal: '반복해서 다음 행동을 비워 두거나 지원 요청을 숨기는 팀원은 10단계에서 먼저 1on1 대상으로 검토합니다.',
  });

  return <section className="space-y-4">
    <section className="rounded-3xl border border-indigo-100 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-indigo-700">업무 경계 나누기</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">혼자 할 일과 연결할 일을 나눕니다</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-600">Step 8의 업무 흐름을 기준으로 팀원이 할 일, 팀장이 확인할 일, 협조 요청할 일을 구분합니다.</p>
    </section>

    <Card title="이전 단계에서 넘어온 업무 흐름">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
        <p><span className="font-black text-slate-700">먼저 할 일: </span>{compact(state.selectedPriorityTasks)}</p>
        <p><span className="font-black text-slate-700">잠시 줄일 일: </span>{compact(state.selectedReduceTasks)}</p>
        <p><span className="font-black text-slate-700">업무 흐름: </span>{compact([state.flowStepOne, state.flowStepTwo, state.flowStepThree].filter(Boolean) as string[])}</p>
        <p><span className="font-black text-slate-700">막힘 신호: </span>{compact(state.bottleneckSignal)}</p>
        <p><span className="font-black text-slate-700">중간 확인 질문: </span>{compact(state.midCheckQuestion)}</p>
      </div>
    </Card>

    <Card title="업무 경계 선택하기">
      <div className="grid gap-3 md:grid-cols-3">
        <OptionGroup title="팀원이 할 일" options={MEMBER_TASK_OPTIONS} value={state.memberTasks ?? ''} onChange={(value) => update({ memberTasks: value })} />
        <OptionGroup title="팀장이 확인할 일" options={LEADER_CHECK_OPTIONS} value={state.leaderCheckTasks ?? ''} onChange={(value) => update({ leaderCheckTasks: value })} />
        <OptionGroup title="협조 요청할 일" options={COORDINATION_OPTIONS} value={state.coordinationTasks ?? ''} onChange={(value) => update({ coordinationTasks: value })} />
      </div>
      <button type="button" className="rounded-xl bg-indigo-700 px-4 py-2 text-sm font-black text-white" onClick={makeBoundary}>경계 선언문 만들기</button>
    </Card>

    <Card title="정리한 업무 경계">
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="팀원이 할 일" value={state.memberTasks ?? ''} onChange={(value) => update({ memberTasks: value })} placeholder="팀원이 직접 실행할 일을 씁니다." />
        <Field label="팀장이 확인할 일" value={state.leaderCheckTasks ?? ''} onChange={(value) => update({ leaderCheckTasks: value })} placeholder="팀장이 중간 점검에서 볼 일을 씁니다." />
        <Field label="협조 요청할 일" value={state.coordinationTasks ?? ''} onChange={(value) => update({ coordinationTasks: value })} placeholder="다른 담당자나 내부 확인이 필요한 일을 씁니다." />
        <Field label="단독 처리하면 안 되는 경계" value={state.riskBoundary ?? ''} onChange={(value) => update({ riskBoundary: value })} placeholder="위험 표현, 민감정보, 확인이 필요한 내용을 씁니다." />
        <Field label="경계 선언문" value={state.boundaryDeclaration ?? ''} onChange={(value) => update({ boundaryDeclaration: value })} placeholder="팀원에게 공유할 업무 경계 문장을 씁니다." />
        <Field label="다음 사람관리로 넘길 신호" value={state.peopleSignal ?? ''} onChange={(value) => update({ peopleSignal: value })} placeholder="어떤 팀원을 1on1 대상으로 먼저 볼지 신호를 씁니다." />
      </div>
    </Card>
  </section>;
}
