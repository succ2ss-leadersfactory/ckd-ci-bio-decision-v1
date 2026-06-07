import { useMemo } from 'react';
import { useStored } from './journey-storage';

const V40_VNEXT_TASK_MANAGEMENT_STORAGE_KEY = 'ckd.v40-vnext.taskManagement.v1';

const V40_VNEXT_TASK_MANAGEMENT_SMOKE_MARKERS = [
  'V40VNextTaskManagementLab',
  '업무관리 Lab',
  '모호한 지시를 기준 문장으로 바꾸기',
  '기존 모호한 업무지시',
  '빠진 기준',
  '수정한 업무지시문',
  '완료 기준',
  '중간 확인 질문',
  '팀장이 지원할 부분',
  '배경',
  '목적',
  '범위',
  '우선순위',
  '일정',
  '완료 기준',
  '중간 확인',
  '우리 조가 선택한 기준',
  '우리 조가 준비한 업무지시문',
].join('|');
void V40_VNEXT_TASK_MANAGEMENT_SMOKE_MARKERS;

type TaskManagementState = {
  vagueInstruction: string;
  missingCriteria: string[];
  revisedInstruction: string;
  completionCriteria: string;
  midCheckQuestion: string;
  leaderSupport: string;
  finalMemo: string;
};

const TASK_CRITERIA = ['배경', '목적', '범위', '우선순위', '일정', '완료 기준', '중간 확인'];

const DEFAULT_TASK_MANAGEMENT: TaskManagementState = {
  vagueInstruction: '이번 2주 동안 후속조치가 약한 고객군을 더 챙겨봅시다.',
  missingCriteria: [],
  revisedInstruction: '',
  completionCriteria: '',
  midCheckQuestion: '',
  leaderSupport: '',
  finalMemo: '',
};

function toggleCriterion(current: string[], criterion: string) {
  if (current.includes(criterion)) return current.filter((item) => item !== criterion);
  return [...current, criterion];
}

function Field({
  label,
  help,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  help: string;
  placeholder: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <span className="text-sm font-black text-slate-950">{label}</span>
      <p className="mt-1 text-xs font-bold leading-5 text-slate-600">{help}</p>
      <textarea
        className="mt-3 min-h-24 w-full rounded-2xl border bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function buildFinalMemo(state: TaskManagementState) {
  return [
    '[업무관리 Lab 결과]',
    `- 기존 모호한 업무지시: ${state.vagueInstruction || '미작성'}`,
    `- 빠진 기준: ${state.missingCriteria.length > 0 ? state.missingCriteria.join(' · ') : '미선택'}`,
    `- 수정한 업무지시문: ${state.revisedInstruction || '미작성'}`,
    `- 완료 기준: ${state.completionCriteria || '미작성'}`,
    `- 중간 확인 질문: ${state.midCheckQuestion || '미작성'}`,
    `- 팀장이 지원할 부분: ${state.leaderSupport || '미작성'}`,
  ].join('\n');
}

export function loadV40VNextTaskManagementResult() {
  try {
    const raw = typeof window === 'undefined' ? null : window.localStorage.getItem(V40_VNEXT_TASK_MANAGEMENT_STORAGE_KEY);
    if (!raw) return DEFAULT_TASK_MANAGEMENT;
    return { ...DEFAULT_TASK_MANAGEMENT, ...(JSON.parse(raw) as Partial<TaskManagementState>) };
  } catch {
    return DEFAULT_TASK_MANAGEMENT;
  }
}

export function V40VNextTaskManagementLab() {
  const [state, setState] = useStored<TaskManagementState>(V40_VNEXT_TASK_MANAGEMENT_STORAGE_KEY, DEFAULT_TASK_MANAGEMENT);
  const finalMemo = useMemo(() => state.finalMemo || buildFinalMemo(state), [state]);
  const update = (patch: Partial<TaskManagementState>) => setState({ ...state, ...patch });

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-cyan-100 bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700">업무관리 Lab · v40-vNext 신규 보강</p>
        <h2 className="mt-2 text-2xl font-black leading-tight text-slate-950">모호한 지시를 기준 문장으로 바꾸기</h2>
        <p className="mt-3 max-w-4xl text-sm font-bold leading-7 text-slate-600">
          5단계에서 정한 이번 2주 기준은 팀원에게 전달될 때 비로소 실행이 됩니다. 이 화면에서는 “더 챙겨보자” 수준의 말을 배경, 목적, 범위, 우선순위, 일정, 완료 기준, 중간 확인이 들어간 업무 기준 문장으로 바꿉니다.
        </p>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-sm font-black text-slate-950">1. 기존 모호한 업무지시</p>
        <p className="mt-1 text-sm font-bold leading-6 text-slate-600">우리 조가 실제 팀 회의에서 자주 말할 법한 모호한 지시를 적습니다.</p>
        <textarea
          className="mt-3 min-h-24 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-cyan-700 focus:bg-white focus:ring-2 focus:ring-cyan-100"
          value={state.vagueInstruction}
          onChange={(event) => update({ vagueInstruction: event.target.value })}
          placeholder="예: 이번 2주 동안 후속조치가 약한 고객군을 더 챙겨봅시다."
        />
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-sm font-black text-slate-950">2. 빠진 기준 고르기</p>
        <p className="mt-1 text-sm font-bold leading-6 text-slate-600">모호한 지시에 빠져 있어 팀원이 헷갈릴 수 있는 기준을 고릅니다.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {TASK_CRITERIA.map((criterion) => {
            const selected = state.missingCriteria.includes(criterion);
            return (
              <button
                key={criterion}
                type="button"
                className={`rounded-2xl border px-4 py-3 text-left text-sm font-black transition ${selected ? 'border-cyan-700 bg-cyan-700 text-white' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-300 hover:bg-cyan-50'}`}
                onClick={() => update({ missingCriteria: toggleCriterion(state.missingCriteria, criterion) })}
              >
                {criterion}
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Field
          label="수정한 업무지시문"
          help="팀원이 무엇을, 어디까지, 언제까지 하면 되는지 알 수 있게 씁니다."
          placeholder="예: 이번 2주 동안 A 고객군은 방문 후 48시간 안에 고객 질문과 다음 접점 가능성을 기록하고, 금요일 오전 회의에서 막힌 지점을 공유해 주세요."
          value={state.revisedInstruction}
          onChange={(revisedInstruction) => update({ revisedInstruction })}
        />
        <Field
          label="완료 기준"
          help="끝났다고 볼 수 있는 기준을 행동이나 산출물로 적습니다."
          placeholder="예: 고객 반응 메모, 다음 접점 가능성, 추가 확인 질문이 각각 1줄 이상 남아 있으면 완료로 봅니다."
          value={state.completionCriteria}
          onChange={(completionCriteria) => update({ completionCriteria })}
        />
        <Field
          label="중간 확인 질문"
          help="팀원이 막히기 전에 팀장이 확인할 질문을 준비합니다."
          placeholder="예: 이번 주 중반 기준으로 후속 실행이 막힌 고객군은 어디이고, 막힌 이유는 정보 부족인지 일정 문제인지 함께 보겠습니다."
          value={state.midCheckQuestion}
          onChange={(midCheckQuestion) => update({ midCheckQuestion })}
        />
        <Field
          label="팀장이 지원할 부분"
          help="지시만 남기지 않고 팀장이 도울 조건을 적습니다."
          placeholder="예: 고객 질문 정리가 어려운 경우 승인자료 범위 안에서 사용할 수 있는 표현을 함께 점검하겠습니다."
          value={state.leaderSupport}
          onChange={(leaderSupport) => update({ leaderSupport })}
        />
      </div>

      <section className="rounded-3xl border border-slate-200 bg-slate-900 p-5 text-white shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-100">최종 메모 연결</p>
            <h3 className="mt-2 text-xl font-black">우리 조가 준비한 업무지시문</h3>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-200">이 내용은 마지막 2주 실행 메모에 붙여 넣을 수 있는 업무관리 결과입니다.</p>
          </div>
          <button
            type="button"
            className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-900"
            onClick={() => update({ finalMemo: buildFinalMemo(state) })}
          >
            업무관리 결과 정리
          </button>
        </div>
        <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-white/10 p-4 text-sm leading-7 text-slate-100">{finalMemo}</pre>
      </section>
    </div>
  );
}
