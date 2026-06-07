import { useMemo, useState } from 'react';
import { useStored } from './journey-storage';
import { TEAM_MEMBER_PROFILES, type TeamMemberProfile } from './journey-v39-team-seven-coaching-profiles';

const STORAGE_KEYS = {
  task: 'ckd.v40-vnext.taskManagement.v10',
  people: 'ckd.v40-vnext.peopleManagement.v2',
  final: 'ckd.v40-vnext.finalExecutionMemo.v1',
} as const;
const EMPTY = '미작성';

const V40_VNEXT_FINAL_MEMO_MARKERS = [
  'V40VNextFinalExecutionMemoLab',
  '13단계 운영 잠금: 성과관리·업무관리·사람관리 최신 결과 → 2주 실행 메모 → 복기 질문',
  'ckd.v40-vnext.taskManagement.v10',
  'ckd.v40-vnext.peopleManagement.v2',
  'ckd.v40-vnext.finalExecutionMemo.v1',
  '역할극 후 수정한 첫 문장',
  '역할극 후 수정한 2주 행동 합의',
  '우리 조가 최종 적용할 코칭 문장 1개',
  '후속 확인 질문',
  'v40-vNext 최신 결과로 채우기',
].join('|');
void V40_VNEXT_FINAL_MEMO_MARKERS;

type TaskState = Record<string, any> & {
  revisedInstruction?: string;
  completionCriteria?: string;
  leaderSupport?: string;
  selectedPriorityTasks?: string[];
  selectedReduceTasks?: string[];
  flowStepOne?: string;
  flowStepTwo?: string;
  flowStepThree?: string;
  bottleneckSignal?: string;
  midCheckQuestion?: string;
  finalRevisionOneThing?: string;
  soloWork?: string;
  leaderCheckWork?: string;
  crossFunctionalHelp?: string;
  seniorLeaderShare?: string;
  cautionOrApproval?: string;
  coordinationMessage?: string;
  boundaryDeclaration?: string;
  finalMemo?: string;
};

type PeopleState = Record<string, any> & {
  selectedMemberId?: string;
  observedBehaviors?: string[];
  riskyInterpretations?: string[];
  oneOnOneFocus?: string;
  selectionReason?: string;
  firstSentence?: string;
  twoWeekAgreement?: string;
  finalCoachingSentence?: string;
  revisedFirstSentenceAfterRoleplay?: string;
  revisedAgreementAfterRoleplay?: string;
  observerFeedback?: string;
  followUpQuestion?: string;
};

type FinalMemoState = {
  performanceMemo: string;
  taskMemo: string;
  boundaryMemo: string;
  peopleMemo: string;
  followUpMemo: string;
  reviewQuestions: string;
};

type FinalMemoFieldKey = keyof FinalMemoState;

type FinalFieldConfig = {
  key: FinalMemoFieldKey;
  label: string;
  help: string;
  copyLabel: string;
  minHeight?: string;
};

const DEFAULT_TASK_STATE: TaskState = {
  selectedPriorityTasks: [],
  selectedReduceTasks: [],
};

const DEFAULT_PEOPLE_STATE: PeopleState = {
  selectedMemberId: TEAM_MEMBER_PROFILES[0]?.id ?? 'kim-jaeho',
  observedBehaviors: [],
  riskyInterpretations: [],
};

const DEFAULT_FINAL_STATE: FinalMemoState = {
  performanceMemo: '',
  taskMemo: '',
  boundaryMemo: '',
  peopleMemo: '',
  followUpMemo: '',
  reviewQuestions: '',
};

const FINAL_FIELD_CONFIG: FinalFieldConfig[] = [
  {
    key: 'performanceMemo',
    label: '성과관리 기준',
    help: '4~7단계에서 정한 성과 기준과 고객군별 2주 흐름을 짧게 남깁니다.',
    copyLabel: '성과관리 기준',
  },
  {
    key: 'taskMemo',
    label: '업무관리 실행 메모',
    help: '8~9단계의 실행 과제, 우선순위, 업무 흐름, 막힘 신호를 정리합니다.',
    copyLabel: '업무관리 실행 메모',
    minHeight: 'min-h-40',
  },
  {
    key: 'boundaryMemo',
    label: '업무 경계와 조율 메모',
    help: '10단계에서 정한 혼자 처리할 일, 팀장 확인, 부서 협조, 상위 공유를 정리합니다.',
    copyLabel: '업무 경계와 조율 메모',
    minHeight: 'min-h-40',
  },
  {
    key: 'peopleMemo',
    label: '사람관리 1on1 메모',
    help: '11~12단계의 선택 팀원, 역할극 후 수정한 첫 문장, 최종 코칭 문장, 2주 행동 합의를 정리합니다.',
    copyLabel: '사람관리 1on1 메모',
    minHeight: 'min-h-40',
  },
  {
    key: 'followUpMemo',
    label: '후속 확인 메모',
    help: '2주 뒤 다시 볼 질문과 관찰자 체크를 남깁니다.',
    copyLabel: '후속 확인 메모',
  },
  {
    key: 'reviewQuestions',
    label: '복기 질문',
    help: '교육 후 현업에서 다시 펼쳐볼 질문입니다.',
    copyLabel: '복기 질문',
  },
];

function safeArray(value: unknown) {
  return Array.isArray(value) ? value.filter(Boolean).map(String) : [];
}

function asList(value: unknown, fallback = EMPTY) {
  const items = safeArray(value);
  if (items.length > 0) return items.join(' · ');
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function firstText(...items: Array<string | undefined>) {
  return items.find((item) => item?.trim())?.trim() || '';
}

function line(label: string, value: unknown) {
  return `[${label}] ${asList(value)}`;
}

function selectedMember(state: PeopleState): TeamMemberProfile {
  return TEAM_MEMBER_PROFILES.find((member) => member.id === state.selectedMemberId) ?? TEAM_MEMBER_PROFILES[0];
}

function taskFlow(state: TaskState) {
  return [state.flowStepOne, state.flowStepTwo, state.flowStepThree].filter(Boolean).join(' → ') || EMPTY;
}

function buildTaskMemo(state: TaskState) {
  return [
    line('수정한 업무지시문', state.revisedInstruction),
    line('완료 기준', state.completionCriteria),
    line('팀장이 지원할 부분', state.leaderSupport),
    line('먼저 할 일', state.selectedPriorityTasks),
    line('잠시 줄일 일', state.selectedReduceTasks),
    line('업무 흐름 3단계', taskFlow(state)),
    line('막힘 신호', state.bottleneckSignal),
    line('중간 확인 질문', state.midCheckQuestion),
    line('우리 조가 최종 수정할 부분', state.finalRevisionOneThing),
  ].join('\n');
}

function buildBoundaryMemo(state: TaskState) {
  return [
    line('팀원이 혼자 처리할 일', state.soloWork),
    line('팀장 확인이 필요한 일', state.leaderCheckWork),
    line('다른 부서 협조가 필요한 일', state.crossFunctionalHelp),
    line('상위 리더에게 공유할 일', state.seniorLeaderShare),
    line('주의 표현 또는 확인 필요 사항', state.cautionOrApproval),
    line('업무 경계 선언문', firstText(state.boundaryDeclaration, state.finalMemo, state.coordinationMessage)),
  ].join('\n');
}

function buildPeopleMemo(state: PeopleState) {
  const member = selectedMember(state);
  const firstSentence = firstText(state.revisedFirstSentenceAfterRoleplay, state.firstSentence) || `최근에 제가 본 것은 ${member.currentSignal}입니다. 제가 단정하려는 것은 아니고, 어디서 막히는지 같이 확인해보고 싶습니다.`;
  const agreement = firstText(state.revisedAgreementAfterRoleplay, state.twoWeekAgreement) || '이번 2주 동안 막힌 지점을 작게 확인하고, 다음 점검 때 함께 조정하겠습니다.';

  return [
    line('먼저 이야기할 팀원', member.label),
    line('관찰한 행동', state.observedBehaviors),
    line('확인 없이 말하지 않을 위험한 해석', state.riskyInterpretations),
    line('1on1 초점', state.oneOnOneFocus || member.defaultCoachingPurpose),
    line('선택 이유', state.selectionReason || member.defaultSelectionReason),
    line('역할극 후 수정한 첫 문장', firstSentence),
    line('우리 조가 최종 적용할 코칭 문장 1개', state.finalCoachingSentence),
    line('역할극 후 수정한 2주 행동 합의', agreement),
    line('후속 확인 질문', state.followUpQuestion),
  ].join('\n');
}

function buildDefaultFinal(taskState: TaskState, peopleState: PeopleState): FinalMemoState {
  return {
    performanceMemo: '성과관리 1~4단계에서 정한 우리 조의 성과 기준과 고객군별 2주 흐름을 기준으로, 이번 2주는 활동량보다 후속 실행·기록 품질·막힘 신호를 함께 보겠습니다.',
    taskMemo: buildTaskMemo(taskState),
    boundaryMemo: buildBoundaryMemo(taskState),
    peopleMemo: buildPeopleMemo(peopleState),
    followUpMemo: [
      line('중간 확인 질문', taskState.midCheckQuestion),
      line('후속 확인 질문', peopleState.followUpQuestion),
      line('관찰자 체크', peopleState.observerFeedback),
    ].join('\n'),
    reviewQuestions: [
      '1. 이번 2주 실행에서 실제로 움직인 성과 신호는 무엇입니까?',
      '2. 우리 조가 줄이기로 한 일을 실제로 줄였습니까?',
      '3. 팀원이 혼자 처리하면 안 되는 일을 제때 연결했습니까?',
      '4. 1on1에서 관찰과 해석을 분리해 말했습니까?',
      '5. 다음 2주에는 어떤 기준 하나를 더 선명하게 바꿔야 합니까?',
    ].join('\n'),
  };
}

function buildCopyText(result: FinalMemoState) {
  return [
    '[v40-vNext 2주 실행 메모]',
    ...FINAL_FIELD_CONFIG.flatMap((field) => ['', `[${field.copyLabel}]`, result[field.key] || EMPTY]),
  ].join('\n');
}

function Field({ label, help, value, placeholder, onChange, minHeight = 'min-h-28' }: { label: string; help: string; value: string; placeholder: string; onChange: (value: string) => void; minHeight?: string }) {
  return (
    <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <span className="text-sm font-black text-slate-950">{label}</span>
      <p className="mt-1 text-xs font-bold leading-5 text-slate-600">{help}</p>
      <textarea className={`mt-3 ${minHeight} w-full rounded-2xl border bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100`} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}

export function V40VNextFinalExecutionMemoLab() {
  const [taskState] = useStored<TaskState>(STORAGE_KEYS.task, DEFAULT_TASK_STATE);
  const [peopleState] = useStored<PeopleState>(STORAGE_KEYS.people, DEFAULT_PEOPLE_STATE);
  const [finalState, setFinalState] = useStored<FinalMemoState>(STORAGE_KEYS.final, DEFAULT_FINAL_STATE);
  const [copied, setCopied] = useState(false);
  const suggested = useMemo(() => buildDefaultFinal(taskState, peopleState), [taskState, peopleState]);
  const copyText = useMemo(() => buildCopyText(finalState), [finalState]);
  const filledCount = useMemo(() => Object.values(finalState).filter((value) => value.trim()).length, [finalState]);

  const updateField = (key: FinalMemoFieldKey, value: string) => setFinalState({ ...finalState, [key]: value });
  const fillFromV40 = () => setFinalState(suggested);
  const copyMemo = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="rounded-3xl border border-indigo-100 bg-indigo-50 p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-indigo-700">v40-vNext 13단계 · 통합 실행 메모</p>
          <h2 className="mt-2 text-xl font-black text-slate-950">업무관리·사람관리 최신 결과를 2주 실행 메모로 묶습니다</h2>
          <p className="mt-2 max-w-4xl text-sm font-bold leading-6 text-slate-700">8~12단계에서 남긴 실행 과제, 업무 흐름, 업무 경계, 1on1 역할극 결과를 가져와 우리 조의 최종 메모로 정리합니다.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-2xl border bg-white px-4 py-3 text-sm font-black text-slate-800 shadow-sm" onClick={fillFromV40}>v40-vNext 최신 결과로 채우기</button>
          <button type="button" className="rounded-2xl bg-indigo-700 px-4 py-3 text-sm font-black text-white shadow-sm" onClick={copyMemo}>{copied ? '복사 완료' : '2주 실행 메모 복사'}</button>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-indigo-200 bg-white px-4 py-3 text-xs font-bold leading-5 text-indigo-950">
        <p className="font-black">현재 작성된 항목: {filledCount} / {FINAL_FIELD_CONFIG.length}</p>
        <p className="mt-1">버튼을 누르면 v40-vNext storage key의 최신 업무관리·사람관리 결과가 자동 반영됩니다. 이후 우리 조 언어로 줄이고 고치면 됩니다.</p>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {FINAL_FIELD_CONFIG.map((field) => (
          <Field
            key={field.key}
            label={field.label}
            help={field.help}
            value={finalState[field.key]}
            onChange={(value) => updateField(field.key, value)}
            placeholder={suggested[field.key]}
            minHeight={field.minHeight}
          />
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
        최종 메모에도 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보, 개인 성과등급, 처방 유도 표현, 비교 우위 단정, 경쟁사 비방은 입력하지 않습니다.
      </div>
    </section>
  );
}
