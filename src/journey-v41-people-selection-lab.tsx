import { type ReactNode } from 'react';
import { useStored } from './journey-storage';

const V41_PEOPLE_SELECTION_MARKERS = [
  'V41PeopleSelectionLab',
  'v41 people selection lab cloned',
  'v41 people selection copy refined',
  '1on1 대상 고르기',
  '먼저 이야기할 팀원 고르기',
  '관찰과 해석 나누기',
  '첫 대화 방향 정하기',
  '다음 1on1로 넘길 메모',
  'ckd.v41.taskManagement.v10',
  'ckd.v41.peopleManagement.v2',
].join('|');
void V41_PEOPLE_SELECTION_MARKERS;

type TaskState = Record<string, any> & {
  peopleSignal?: string;
  boundaryDeclaration?: string;
  memberTasks?: string;
  leaderCheckTasks?: string;
};

type PeopleState = {
  selectedMemberId: string;
  observedFact: string;
  interpretation: string;
  conversationPurpose: string;
  riskToAvoid: string;
  firstQuestionFocus: string;
  nextDialogueMemo: string;
};

type MemberOption = {
  id: string;
  name: string;
  role: string;
  signal: string;
  suggestedFact: string;
  suggestedPurpose: string;
};

const TASK_STORAGE_KEY = 'ckd.v41.taskManagement.v10';
const PEOPLE_STORAGE_KEY = 'ckd.v41.peopleManagement.v2';

const MEMBER_OPTIONS: MemberOption[] = [
  { id: 'kim-jaeho', name: '김재호 차장', role: '경험 많은 선임 영업 담당', signal: '기록 방식이 개인화되어 팀 기준과 다를 수 있습니다.', suggestedFact: '최근 기록에서 고객 반응은 남아 있지만 다음 행동 표현이 팀 기준과 다르게 적힌 사례가 있다.', suggestedPurpose: '경험을 존중하면서 팀 공통 기록 기준에 맞출 방법을 함께 정한다.' },
  { id: 'kim-munho', name: '김문호 차장', role: '안정적 실행형 담당', signal: '기본 활동은 꾸준하지만 새로운 기준 전환은 느릴 수 있습니다.', suggestedFact: '기본 방문과 기록은 꾸준하지만 새 기준으로 바뀐 완료 조건 적용이 늦다.', suggestedPurpose: '새 기준이 왜 필요한지 확인하고 2주 동안 적용할 최소 기준을 합의한다.' },
  { id: 'yoo-heegwan', name: '유희관 과장', role: '관계 기반 영업 담당', signal: '고객 관계는 좋지만 후속 실행 증거가 약할 수 있습니다.', suggestedFact: '고객 관계 메모는 많지만 후속 확인 일정과 담당자가 비어 있는 기록이 있다.', suggestedPurpose: '관계 강점을 후속 실행으로 연결하는 방법을 정한다.' },
  { id: 'lee-daeun', name: '이대은 대리', role: '활동량 높은 실행형 담당', signal: '움직임은 빠르지만 우선순위와 기록 품질 점검이 필요합니다.', suggestedFact: '활동량은 높지만 먼저 볼 고객군과 잠시 줄일 일이 명확하지 않은 기록이 보인다.', suggestedPurpose: '속도는 유지하되 우선순위와 완료 기준을 맞춘다.' },
  { id: 'shin-jaeyoung', name: '신재영 대리', role: '분석적이고 신중한 담당', signal: '판단은 세밀하지만 실행 속도와 대화 타이밍을 살펴야 합니다.', suggestedFact: '확인해야 할 사항을 꼼꼼히 적지만 다음 행동 결정이 늦어지는 경우가 있다.', suggestedPurpose: '충분히 확인할 것과 바로 움직일 것을 구분한다.' },
  { id: 'park-jaeuk', name: '박재욱 사원', role: '성장형 담당', signal: '업무 기준과 고객 대화의 안전선을 구체적으로 알려줘야 합니다.', suggestedFact: '기록과 고객 대화에서 어디까지 말해도 되는지 확인 요청이 반복된다.', suggestedPurpose: '안전선과 완료 기준을 구체적으로 알려 주고 첫 실행을 돕는다.' },
  { id: 'moon-gyowon', name: '문교원 사원', role: '새로운 방식에 빠르게 적응하는 담당', signal: '도구 활용은 빠르지만 현장 언어로 바꾸는 코칭이 필요합니다.', suggestedFact: 'AI 초안 활용은 빠르지만 팀원이 실제 고객 대화 문장으로 바꾸는 데 수정이 필요하다.', suggestedPurpose: 'AI 초안을 현장 언어로 바꾸는 기준을 함께 잡는다.' },
];

const DEFAULT_PEOPLE_STATE: PeopleState = {
  selectedMemberId: MEMBER_OPTIONS[2].id,
  observedFact: '',
  interpretation: '',
  conversationPurpose: '',
  riskToAvoid: '',
  firstQuestionFocus: '',
  nextDialogueMemo: '',
};
const DEFAULT_TASK_STATE: TaskState = {};

function memberOf(id: string) {
  return MEMBER_OPTIONS.find((member) => member.id === id) ?? MEMBER_OPTIONS[2];
}

function compact(value?: string) {
  return value?.trim() || '미작성';
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"><h3 className="text-lg font-black text-slate-950">{title}</h3><div className="mt-4 space-y-3">{children}</div></section>;
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="text-sm font-black text-slate-950">{label}</span><textarea className="mt-3 min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-violet-700 focus:ring-2 focus:ring-violet-100" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

export function V41PeopleSelectionLab() {
  const [taskState] = useStored<TaskState>(TASK_STORAGE_KEY, DEFAULT_TASK_STATE);
  const [state, setState] = useStored<PeopleState>(PEOPLE_STORAGE_KEY, DEFAULT_PEOPLE_STATE);
  const update = (patch: Partial<PeopleState>) => setState({ ...state, ...patch });
  const member = memberOf(state.selectedMemberId);

  const useSuggestedMember = (option: MemberOption) => {
    setState({
      ...state,
      selectedMemberId: option.id,
      observedFact: option.suggestedFact,
      interpretation: '',
      conversationPurpose: option.suggestedPurpose,
      riskToAvoid: '성격이나 태도를 단정하지 않고, 기록·행동·상황을 기준으로 이야기한다.',
      firstQuestionFocus: '최근 실행 흐름에서 막힌 지점과 필요한 지원을 확인한다.',
      nextDialogueMemo: `${option.name}와 1on1에서 관찰 사실을 확인하고, 다음 2주 동안 적용할 작은 행동 1개를 합의한다.`,
    });
  };

  return <section className="space-y-4">
    <section className="rounded-3xl border border-violet-100 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-violet-700">1on1 대상 고르기</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">먼저 이야기할 팀원을 고릅니다</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-600">Step 9에서 넘긴 사람관리 신호를 보고, 지금 1on1이 필요한 팀원을 고릅니다. 평가는 뒤로 미루고 관찰과 해석을 나눕니다.</p>
    </section>

    <Card title="업무 경계에서 넘어온 사람관리 신호">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
        <p><span className="font-black text-slate-700">경계 선언문: </span>{compact(taskState.boundaryDeclaration)}</p>
        <p><span className="font-black text-slate-700">팀원이 할 일: </span>{compact(taskState.memberTasks)}</p>
        <p><span className="font-black text-slate-700">팀장이 확인할 일: </span>{compact(taskState.leaderCheckTasks)}</p>
        <p><span className="font-black text-slate-700">사람관리 신호: </span>{compact(taskState.peopleSignal)}</p>
      </div>
    </Card>

    <Card title="먼저 이야기할 팀원 고르기">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {MEMBER_OPTIONS.map((option) => {
          const selected = state.selectedMemberId === option.id;
          return <button key={option.id} type="button" onClick={() => useSuggestedMember(option)} className={`rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${selected ? 'border-violet-300 bg-violet-50 ring-2 ring-violet-100' : 'border-slate-200 bg-white'}`}>
            <p className="text-base font-black text-slate-950">{option.name}</p>
            <p className="mt-1 text-xs font-bold text-slate-500">{option.role}</p>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-600">{option.signal}</p>
          </button>;
        })}
      </div>
    </Card>

    <Card title="관찰과 해석 나누기">
      <div className="rounded-2xl border border-violet-100 bg-violet-50 p-3 text-sm font-bold leading-6 text-violet-950">선택한 팀원: {member.name} · {member.role}</div>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="관찰 사실" value={state.observedFact} onChange={(value) => update({ observedFact: value })} placeholder="기록, 행동, 일정, 대화처럼 실제로 본 것을 씁니다." />
        <Field label="해석 또는 추정" value={state.interpretation} onChange={(value) => update({ interpretation: value })} placeholder="왜 그랬는지에 대한 추정은 사실과 분리해서 씁니다." />
        <Field label="대화 목적" value={state.conversationPurpose} onChange={(value) => update({ conversationPurpose: value })} placeholder="지적이 아니라 무엇을 확인하고 합의하려는 대화인가요?" />
        <Field label="피해야 할 말" value={state.riskToAvoid} onChange={(value) => update({ riskToAvoid: value })} placeholder="성격 단정, 의도 추정, 압박 표현을 피합니다." />
      </div>
    </Card>

    <Card title="첫 대화 방향 정하기">
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="첫 질문 초점" value={state.firstQuestionFocus} onChange={(value) => update({ firstQuestionFocus: value })} placeholder="처음에 무엇을 확인할지 씁니다." />
        <Field label="다음 1on1로 넘길 메모" value={state.nextDialogueMemo} onChange={(value) => update({ nextDialogueMemo: value })} placeholder="11단계에서 첫 문장과 행동 합의로 바꿀 메모를 씁니다." />
      </div>
    </Card>
  </section>;
}
