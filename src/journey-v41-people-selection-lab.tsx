import { type ReactNode } from 'react';
import { useStored } from './journey-storage';
import { TEAM_MEMBER_PROFILES, type TeamMemberProfile } from './journey-v39-team-seven-coaching-profiles';

const PEOPLE_STORAGE_KEY = 'ckd.v41.peopleManagement.v2';
const TASK_STORAGE_KEY = 'ckd.v41.taskManagement.v10';

const V41_PEOPLE_SELECTION_MARKERS = [
  'V41PeopleSelectionLab',
  '1on1 대상 고르기',
  '사람관리 1: 먼저 이야기할 팀원 고르기',
  'v40-vNext people management step 10 parity',
  '9단계 운영: 7·8단계 실행 결과 다시 보기 → 팀원별 실행 신호 카드 보기 → 먼저 이야기할 팀원 1명 선택 → 관찰한 행동 고르기 → 위험한 해석 고르기 → 1on1 대화 초점 1개 선택 → 선택 이유 1문장 작성',
  '관찰한 행동은 말할 수 있지만, 위험한 해석은 확인 없이 말하지 않습니다',
  '7·8단계 실행 결과 다시 보기',
  '팀원별 실행 신호 카드 보기',
  '먼저 이야기할 팀원 1명 선택',
  '관찰한 행동 고르기',
  '위험한 해석 고르기',
  '1on1 대화 초점 1개 선택',
  '선택 이유 1문장 작성',
  'ckd.v41.taskManagement.v10',
  'ckd.v41.peopleManagement.v2',
].join('|');
void V41_PEOPLE_SELECTION_MARKERS;

type PeopleState = Record<string, any> & {
  selectedMemberId?: string;
  observedBehaviors?: string[];
  riskyInterpretations?: string[];
  oneOnOneFocus?: string;
  selectionReason?: string;
};

type TaskState = Record<string, any> & {
  selectedWorkItems?: string;
  selectedReduceTasks?: string[];
  workloadAdjustments?: string;
  orderedWorkSteps?: string;
  memberTasks?: string;
  leaderCheckTasks?: string;
  coordinationTasks?: string;
  bottleneckSignal?: string;
  midCheckQuestion?: string;
  boundaryDeclaration?: string;
  peopleSignal?: string;
};

const DEFAULT_PEOPLE_STATE: PeopleState = {
  selectedMemberId: TEAM_MEMBER_PROFILES[0]?.id ?? 'kim-jaeho',
  observedBehaviors: [],
  riskyInterpretations: [],
  oneOnOneFocus: '',
  selectionReason: '',
};

const DEFAULT_TASK_STATE: TaskState = {};

const RISKY_INTERPRETATIONS = [
  '의지가 부족하다',
  '책임감이 약하다',
  '고객 대응력이 낮다',
  '변화를 싫어한다',
  '소극적이다',
  '불만이 많아졌다',
  '알아서 하지 못한다',
  '경험이 있으니 굳이 말하지 않아도 된다',
];

const FOCUS_OPTIONS = [
  '업무 기준을 다시 맞춘다',
  '막힌 지점을 확인한다',
  '지원이 필요한 부분을 묻는다',
  '우선순위 충돌을 정리한다',
  '다음 2주 행동을 작게 합의한다',
  '말해도 되는 선을 함께 확인한다',
];

function safeArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function selectedMember(state: PeopleState): TeamMemberProfile {
  return TEAM_MEMBER_PROFILES.find((member) => member.id === state.selectedMemberId) ?? TEAM_MEMBER_PROFILES[0];
}

function asList(value: unknown) {
  return Array.isArray(value) && value.length > 0 ? value.join(' · ') : typeof value === 'string' && value.trim() ? value : '미작성';
}

function short(value: unknown, max = 220) {
  const text = asList(value).replace(/\s+/g, ' ');
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function toggleList(list: string[] | undefined, value: string) {
  const current = safeArray(list);
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
}

function behaviorOptions(member: TeamMemberProfile) {
  return [
    member.currentSignal,
    member.recentChange,
    member.risk,
    member.oneOnOneReason,
  ].filter(Boolean);
}

function ChoiceButton({ selected, children, onClick }: { selected: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-left text-sm font-black transition ${selected ? 'border-indigo-700 bg-indigo-700 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50'}`}
    >
      {children}
    </button>
  );
}

function TaskSummary() {
  const [taskState] = useStored<TaskState>(TASK_STORAGE_KEY, DEFAULT_TASK_STATE);
  return (
    <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
      <p className="text-sm font-black text-slate-950">7·8단계 실행 결과 다시 보기</p>
      <p className="mt-1 text-sm font-bold leading-6 text-slate-600">사람관리는 새로 시작하는 활동이 아니라, 앞에서 정한 실행 흐름을 실제 팀원 대화로 연결하는 단계입니다.</p>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black text-slate-500">팀원이 직접 할 일</p><p className="mt-2 text-sm font-bold leading-6 text-slate-800">{short(taskState.memberTasks || taskState.selectedWorkItems)}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black text-slate-500">잠시 줄일 일</p><p className="mt-2 text-sm font-bold leading-6 text-slate-800">{short(taskState.workloadAdjustments || taskState.selectedReduceTasks)}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4 lg:col-span-2"><p className="text-xs font-black text-slate-500">업무 흐름</p><p className="mt-2 text-sm font-bold leading-6 text-slate-800">{short(taskState.orderedWorkSteps)}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black text-slate-500">팀장 확인 필요</p><p className="mt-2 text-sm font-bold leading-6 text-slate-800">{short(taskState.leaderCheckTasks || taskState.midCheckQuestion)}</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black text-slate-500">부서 협조·권한 밖 이슈</p><p className="mt-2 text-sm font-bold leading-6 text-slate-800">{short(taskState.coordinationTasks || taskState.bottleneckSignal)}</p></div>
      </div>
    </section>
  );
}

export function V41PeopleSelectionLab() {
  const [state, setState] = useStored<PeopleState>(PEOPLE_STORAGE_KEY, DEFAULT_PEOPLE_STATE);
  const member = selectedMember(state);
  const observedBehaviors = safeArray(state.observedBehaviors);
  const riskyInterpretations = safeArray(state.riskyInterpretations);
  const update = (patch: Partial<PeopleState>) => setState({ ...state, ...patch });

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-indigo-100 bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-indigo-700">사람관리 1 · 팀원 신호 진단</p>
        <h2 className="mt-2 text-2xl font-black leading-tight text-slate-950">성과와 업무 흐름을 움직이게 하려면 누구와 먼저 이야기해야 할까요?</h2>
        <p className="mt-3 max-w-4xl text-sm font-bold leading-7 text-slate-600">가장 문제가 큰 팀원을 고르는 시간이 아닙니다. 이번 실행 흐름을 실제로 움직이게 하기 위해 먼저 대화해야 할 팀원을 선택합니다.</p>
      </section>

      <TaskSummary />

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-sm font-black text-slate-950">팀원별 실행 신호 카드 보기</p>
        <div className="mt-4 grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {TEAM_MEMBER_PROFILES.map((profile) => {
            const selected = state.selectedMemberId === profile.id;
            return (
              <button
                key={profile.id}
                type="button"
                onClick={() => update({ selectedMemberId: profile.id, observedBehaviors: [], riskyInterpretations: [], oneOnOneFocus: profile.defaultCoachingPurpose, selectionReason: profile.defaultSelectionReason })}
                className={`rounded-2xl border p-4 text-left transition ${selected ? 'border-indigo-700 bg-indigo-700 text-white shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50'}`}
              >
                <p className="text-sm font-black">{profile.label}</p>
                <p className={`mt-1 text-xs font-black ${selected ? 'text-indigo-100' : 'text-indigo-700'}`}>{profile.role}</p>
                <p className={`mt-3 text-sm font-bold leading-6 ${selected ? 'text-white' : 'text-slate-700'}`}>{profile.currentSignal}</p>
                <p className={`mt-2 text-xs font-bold leading-5 ${selected ? 'text-indigo-100' : 'text-slate-500'}`}>조심할 해석: {profile.misreadRisk}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-sm font-black text-slate-950">먼저 이야기할 팀원 1명 선택</p>
        <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
          <p className="text-lg font-black text-slate-950">{member.label}</p>
          <p className="mt-1 text-sm font-bold leading-6 text-indigo-900">{member.oneOnOneReason}</p>
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-sm font-black text-slate-950">관찰한 행동 고르기</p>
        <p className="mt-1 text-sm font-bold leading-6 text-slate-600">대화에서 말할 수 있는 것은 평가가 아니라 관찰한 행동입니다.</p>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {behaviorOptions(member).map((behavior) => (
            <ChoiceButton key={behavior} selected={observedBehaviors.includes(behavior)} onClick={() => update({ observedBehaviors: toggleList(state.observedBehaviors, behavior) })}>{behavior}</ChoiceButton>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-sm font-black text-slate-950">위험한 해석 고르기</p>
        <p className="mt-1 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-black leading-6 text-amber-900">관찰한 행동은 말할 수 있지만, 위험한 해석은 확인 없이 말하지 않습니다.</p>
        <div className="mt-4 grid gap-2 md:grid-cols-2 lg:grid-cols-4">
          {RISKY_INTERPRETATIONS.map((risk) => (
            <ChoiceButton key={risk} selected={riskyInterpretations.includes(risk)} onClick={() => update({ riskyInterpretations: toggleList(state.riskyInterpretations, risk) })}>{risk}</ChoiceButton>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-sm font-black text-slate-950">1on1 대화 초점 1개 선택</p>
        <p className="mt-1 text-sm font-bold leading-6 text-slate-600">이번 대화에서 모든 것을 다루지 않습니다. 초점은 하나만 고릅니다.</p>
        <div className="mt-4 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {FOCUS_OPTIONS.map((focus) => (
            <ChoiceButton key={focus} selected={state.oneOnOneFocus === focus} onClick={() => update({ oneOnOneFocus: focus })}>{focus}</ChoiceButton>
          ))}
        </div>
      </section>

      <label className="block rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <span className="text-sm font-black text-slate-950">선택 이유 1문장 작성</span>
        <p className="mt-1 text-sm font-bold leading-6 text-slate-600">왜 이 팀원과 먼저 이야기해야 하는지 조별 판단을 한 문장으로 남깁니다.</p>
        <textarea
          className="mt-4 min-h-28 w-full rounded-2xl border bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100"
          value={state.selectionReason || ''}
          onChange={(event) => update({ selectionReason: event.target.value })}
          placeholder={member.defaultSelectionReason}
        />
      </label>
    </div>
  );
}
