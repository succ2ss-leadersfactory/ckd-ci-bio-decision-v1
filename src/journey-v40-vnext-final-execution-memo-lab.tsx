import { useMemo, useState } from 'react';
import { useStored } from './journey-storage';
import { TEAM_MEMBER_PROFILES, type TeamMemberProfile } from './journey-v39-team-seven-coaching-profiles';

const STORAGE_KEYS = {
  performance: 'ckd.v40-vnext.performanceCascade.v1',
  task: 'ckd.v40-vnext.taskManagement.v10',
  people: 'ckd.v40-vnext.peopleManagement.v2',
  final: 'ckd.v40-vnext.finalExecutionMemo.v1',
} as const;
const EMPTY = '미작성';

const V40_VNEXT_FINAL_MEMO_MARKERS = [
  'V40VNextFinalExecutionMemoLab',
  '13단계 운영 잠금: 성과관리·업무관리·사람관리 최신 결과 → 2주 실행 메모 → 복기 질문',
  'ckd.v40-vnext.performanceCascade.v1',
  'ckd.v40-vnext.taskManagement.v10',
  'ckd.v40-vnext.peopleManagement.v2',
  'ckd.v40-vnext.finalExecutionMemo.v1',
  '전사전략과제',
  '팀 과제·CSF·KPI',
  '팀 회의 설명 3문장',
  '역할극 후 수정한 첫 문장',
  '역할극 후 수정한 2주 행동 합의',
  '우리 조가 최종 적용할 코칭 문장 1개',
  '후속 확인 질문',
  'v40-vNext 최신 결과로 채우기',
].join('|');
void V40_VNEXT_FINAL_MEMO_MARKERS;

type PerformanceState = Record<string, any> & {
  selectedStrategyId?: string;
  customTeamTask?: string;
  selectedCsfIds?: string[];
  selectedKpiIds?: string[];
  cascadeInterpretation?: string;
  cascadeComplianceCaution?: string;
  finalCsfKpiMemo?: string;
  selectedEvidenceIds?: string[];
  missingInfo?: string;
  overInterpretationRisk?: string;
  teamQuestion?: string;
  revisedRiskExpression?: string;
  selectedFlowIds?: string[];
  twoWeekFirstAction?: string;
  pauseActivity?: string;
  memberRecord?: string;
  midCheckQuestion?: string;
  teamMeetingSentenceOne?: string;
  teamMeetingSentenceTwo?: string;
  teamMeetingSentenceThree?: string;
  finalExecutionStandard?: string;
};

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

const DEFAULT_PERFORMANCE_STATE: PerformanceState = {
  selectedCsfIds: [],
  selectedKpiIds: [],
  selectedEvidenceIds: [],
  selectedFlowIds: [],
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
    help: '4~7단계에서 정한 전사전략과제, 팀 과제, CSF/KPI, 고객 기록 증거, 2주 실행 흐름을 짧게 남깁니다.',
    copyLabel: '성과관리 기준',
    minHeight: 'min-h-48',
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

function buildPerformanceMemo(state: PerformanceState) {
  const meetingSentences = [state.teamMeetingSentenceOne, state.teamMeetingSentenceTwo, state.teamMeetingSentenceThree].filter(Boolean).join(' / ') || EMPTY;
  return [
    line('전사전략과제', state.selectedStrategyId),
    line('우리 팀 과제', state.customTeamTask),
    line('전략과제 핵심 의도', state.cascadeInterpretation),
    line('팀 과제·CSF·KPI 메모', state.finalCsfKpiMemo),
    line('선택 CSF', state.selectedCsfIds),
    line('선택 KPI', state.selectedKpiIds),
    line('고객 활동 기록 증거', state.selectedEvidenceIds),
    line('아직 부족한 정보', state.missingInfo),
    line('과잉해석 위험', state.overInterpretationRisk),
    line('팀원에게 확인할 질문', state.teamQuestion),
    line('수정한 위험 표현', state.revisedRiskExpression),
    line('이번 2주 먼저 확인할 것', state.twoWeekFirstAction),
    line('잠시 줄일 활동', state.pauseActivity),
    line('팀원이 남길 기록', state.memberRecord),
    line('팀장 중간 점검 질문', state.midCheckQuestion),
    line('팀 회의 설명 3문장', meetingSentences),
    line('8단계로 넘길 실행 기준', state.finalExecutionStandard),
  ].join('\n');
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

function buildDefaultFinal(performanceState: PerformanceState, taskState: TaskState, peopleState: PeopleState): FinalMemoState {
  return {
    performanceMemo: buildPerformanceMemo(performanceState),
    taskMemo: buildTaskMemo(taskState),
    boundaryMemo: buildBoundaryMemo(taskState),
    peopleMemo: buildPeopleMemo(peopleState),
    followUpMemo: [
      line('성과관리 중간 점검 질문', performanceState.midCheckQuestion),
      line('업무관리 중간 확인 질문', taskState.midCheckQuestion),
      line('사람관리 후속 확인 질문', peopleState.followUpQuestion),
      line('관찰자 체크', peopleState.observerFeedback),
    ].join('\n'),
    reviewQuestions: [
      '1. 우리 조는 전사전략과제를 팀 과제·CSF·KPI로 충분히 번역했는가?',
      '2. KPI를 고객 활동 기록 증거로 확인했는가, 아니면 숫자만 고른 것에 머물렀는가?',
      '3. AI 초안에서 과잉해석이나 위험 표현을 사람의 판단으로 수정했는가?',
      '4. 이번 2주 동안 줄일 일과 먼저 확인할 일을 팀원이 이해할 수 있게 설명했는가?',
      '5. 2주 뒤 어떤 기록과 질문으로 실행을 복기할 것인가?',
    ].join('\n'),
  };
}

function copyText(text: string) {
  void navigator.clipboard?.writeText(text);
}

function fieldValue(state: FinalMemoState, key: FinalMemoFieldKey) {
  return state[key] ?? '';
}

function buildCopyText(state: FinalMemoState) {
  return FINAL_FIELD_CONFIG.map((field) => `## ${field.copyLabel}\n${fieldValue(state, field.key) || EMPTY}`).join('\n\n');
}

export function V40VNextFinalExecutionMemoLab() {
  const [performanceState] = useStored<PerformanceState>(STORAGE_KEYS.performance, DEFAULT_PERFORMANCE_STATE);
  const [taskState] = useStored<TaskState>(STORAGE_KEYS.task, DEFAULT_TASK_STATE);
  const [peopleState] = useStored<PeopleState>(STORAGE_KEYS.people, DEFAULT_PEOPLE_STATE);
  const [finalState, setFinalState] = useStored<FinalMemoState>(STORAGE_KEYS.final, DEFAULT_FINAL_STATE);
  const [copied, setCopied] = useState(false);
  const generatedFinal = useMemo(() => buildDefaultFinal(performanceState, taskState, peopleState), [performanceState, taskState, peopleState]);
  const copyAll = useMemo(() => buildCopyText(finalState), [finalState]);

  const updateField = (key: FinalMemoFieldKey, value: string) => setFinalState({ ...finalState, [key]: value });
  const fillLatest = () => setFinalState(generatedFinal);
  const handleCopy = () => {
    copyText(copyAll);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <section className="space-y-4 rounded-3xl border border-indigo-100 bg-white p-4 shadow-sm md:p-5">
      <div className="rounded-3xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm leading-6 text-indigo-950">
        <p className="font-black">v40-vNext 13단계 · 통합 실행 메모</p>
        <p className="mt-1">성과관리 4~7단계, 업무관리 8~10단계, 사람관리 11~12단계 결과를 하나의 2주 실행 메모로 묶습니다. 버튼을 누르면 최신 저장값을 가져오고, 이후 우리 조 언어로 수정합니다.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={fillLatest} className="rounded-2xl bg-indigo-700 px-4 py-3 text-sm font-black text-white shadow-sm hover:bg-indigo-800">v40-vNext 최신 결과로 채우기</button>
        <button type="button" onClick={handleCopy} className="rounded-2xl border border-indigo-200 bg-white px-4 py-3 text-sm font-black text-indigo-800 hover:bg-indigo-50">2주 실행 메모 복사</button>
        {copied ? <span className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">복사 완료</span> : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {FINAL_FIELD_CONFIG.map((field) => (
          <label key={field.key} className="block rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <span className="text-sm font-black text-slate-950">{field.label}</span>
            <span className="mt-1 block text-xs font-bold leading-5 text-slate-500">{field.help}</span>
            <textarea className={`mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm leading-6 ${field.minHeight ?? 'min-h-28'}`} value={fieldValue(finalState, field.key)} onChange={(event) => updateField(field.key, event.target.value)} placeholder={`${field.label}을 작성하세요.`} />
          </label>
        ))}
      </div>
    </section>
  );
}
