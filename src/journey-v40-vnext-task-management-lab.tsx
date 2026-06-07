import { useMemo, useState } from 'react';
import { useStored } from './journey-storage';

const V40_VNEXT_TASK_MANAGEMENT_STORAGE_KEY = 'ckd.v40-vnext.taskManagement.v3';

const V40_VNEXT_TASK_MANAGEMENT_SMOKE_MARKERS = [
  'V40VNextTaskExecutionDesignLab',
  'V40VNextTaskPriorityFlowLab',
  'V40VNextTaskBoundaryCoordinationLab',
  '업무관리 1: 성과 기준을 실행 과제로 바꾸기',
  '업무관리 2: 우선순위와 업무 흐름 정리하기',
  '업무관리 3: 혼자 해결하면 안 되는 일 구분하기',
  '실행 과제화',
  '업무지시 명확화',
  '완료 기준',
  '팀장이 지원할 부분',
  '먼저 할 일',
  '잠시 줄일 일',
  '업무 흐름 3단계',
  '막힘 신호',
  '중간 확인 질문',
  '팀원이 혼자 처리할 일',
  '팀장 확인이 필요한 일',
  '다른 부서 협조가 필요한 일',
  '상위 리더에게 공유할 일',
  '주의 표현 또는 확인 필요 사항',
  'AI에게 실행 과제 초안 부탁하기',
  'AI에게 업무 흐름 점검 질문 부탁하기',
  'AI에게 조율 문장 초안 부탁하기',
].join('|');
void V40_VNEXT_TASK_MANAGEMENT_SMOKE_MARKERS;

type TaskCriterion = '배경' | '목적' | '범위' | '우선순위' | '일정' | '완료 기준' | '중간 확인';

type VagueInstructionExample = {
  id: string;
  category: string;
  title: string;
  instruction: string;
  typicalMissing: TaskCriterion[];
  likelyReactions: { member: string; reaction: string; hiddenNeed: string }[];
};

type TaskManagementState = {
  selectedExampleId: string;
  customInstruction: string;
  missingCriteria: TaskCriterion[];
  aiExecutionPrompt: string;
  aiExecutionDraft: string;
  revisedInstruction: string;
  completionCriteria: string;
  leaderSupport: string;
  priorityTask: string;
  reduceOrPause: string;
  flowStepOne: string;
  flowStepTwo: string;
  flowStepThree: string;
  bottleneckSignal: string;
  midCheckQuestion: string;
  aiFlowPrompt: string;
  soloWork: string;
  leaderCheckWork: string;
  crossFunctionalHelp: string;
  seniorLeaderShare: string;
  cautionOrApproval: string;
  coordinationMessage: string;
  aiCoordinationPrompt: string;
  finalMemo: string;
};

const TASK_CRITERIA: TaskCriterion[] = ['배경', '목적', '범위', '우선순위', '일정', '완료 기준', '중간 확인'];

const VAGUE_INSTRUCTION_EXAMPLES: VagueInstructionExample[] = [
  {
    id: 'follow-up',
    category: '후속조치형',
    title: '후속조치가 약한 고객군을 더 챙기기',
    instruction: '이번 2주 동안 후속조치가 약한 고객군을 더 챙겨봅시다.',
    typicalMissing: ['범위', '우선순위', '완료 기준', '중간 확인'],
    likelyReactions: [
      { member: '박재욱 사원', reaction: '어떤 고객군을 말하는지 잘 모르겠지만, 일단 방문 건수를 늘려야 하나?', hiddenNeed: '대상 고객군과 행동 기준이 필요합니다.' },
      { member: '신재영 대리', reaction: '후속조치가 약하다는 기준이 뭘까? 기록을 더 쓰라는 건지, 다시 연락하라는 건지 애매하다.', hiddenNeed: '완료 기준과 기록 기준이 필요합니다.' },
      { member: '김문호 차장', reaction: '기존 우선순위와 충돌하면 무엇을 먼저 해야 하지?', hiddenNeed: '우선순위와 중간 확인 시점이 필요합니다.' },
    ],
  },
  {
    id: 'record-quality',
    category: '기록품질형',
    title: '고객 반응을 더 꼼꼼히 기록하기',
    instruction: '고객 반응을 좀 더 꼼꼼히 기록해 주세요.',
    typicalMissing: ['목적', '범위', '완료 기준', '중간 확인'],
    likelyReactions: [
      { member: '문교원 사원', reaction: '어디까지 자세히 써야 하는지 모르겠어서 길게만 써야 할 것 같다.', hiddenNeed: '기록 항목과 예시가 필요합니다.' },
      { member: '유희관 과장', reaction: '기록을 꼼꼼히 쓰라는 말은 알겠는데, 어떤 판단에 쓰려는지 모르겠다.', hiddenNeed: '목적과 활용 방식이 필요합니다.' },
      { member: '이대은 대리', reaction: '바쁜 일정에서 어느 정도면 충분한 기록인지 기준이 필요하다.', hiddenNeed: '완료 기준과 최소 기준이 필요합니다.' },
    ],
  },
  {
    id: 'priority',
    category: '우선순위형',
    title: '중요 고객부터 먼저 신경 쓰기',
    instruction: '중요 고객부터 먼저 신경 써 주세요.',
    typicalMissing: ['배경', '범위', '우선순위', '일정'],
    likelyReactions: [
      { member: '김재호 차장', reaction: '중요 고객의 기준이 매출인지 관계인지 최근 반응인지 분명하지 않다.', hiddenNeed: '중요 고객의 판단 기준이 필요합니다.' },
      { member: '박재욱 사원', reaction: '기존에 맡은 고객도 있는데 무엇을 뒤로 미뤄도 되는지 모르겠다.', hiddenNeed: '우선순위 조정 기준이 필요합니다.' },
      { member: '김문호 차장', reaction: '어느 시점까지 먼저 움직여야 하는지 일정 기준이 있어야 한다.', hiddenNeed: '일정과 확인 시점이 필요합니다.' },
    ],
  },
  {
    id: 'speed',
    category: '실행속도형',
    title: '이번 주 실행 속도 높이기',
    instruction: '이번 주에는 실행 속도를 좀 높입시다.',
    typicalMissing: ['목적', '범위', '일정', '완료 기준'],
    likelyReactions: [
      { member: '신재영 대리', reaction: '속도를 높이라는 말은 알겠는데 품질보다 속도가 우선인지 모르겠다.', hiddenNeed: '목적과 품질 기준이 필요합니다.' },
      { member: '유희관 과장', reaction: '어떤 업무의 속도를 높이라는 건지 범위가 애매하다.', hiddenNeed: '업무 범위가 필요합니다.' },
      { member: '문교원 사원', reaction: '빨리 하라는 말처럼 들려서 질문하기가 조심스럽다.', hiddenNeed: '지원 조건과 중간 확인이 필요합니다.' },
    ],
  },
  {
    id: 'ownership',
    category: '책임범위형',
    title: '각자 맡은 고객군 책임지고 관리하기',
    instruction: '각자 맡은 고객군은 책임지고 관리해 주세요.',
    typicalMissing: ['범위', '우선순위', '완료 기준', '중간 확인'],
    likelyReactions: [
      { member: '김문호 차장', reaction: '책임지라는 말은 알지만 어디까지 혼자 판단해도 되는지 모르겠다.', hiddenNeed: '권한과 지원 범위가 필요합니다.' },
      { member: '유희관 과장', reaction: '관리한다는 기준이 방문인지 기록인지 후속 실행인지 모호하다.', hiddenNeed: '완료 기준이 필요합니다.' },
      { member: '문교원 사원', reaction: '막히는 부분을 말하면 책임감 없어 보일까 봐 조심스럽다.', hiddenNeed: '중간 확인과 지원 조건이 필요합니다.' },
    ],
  },
];

const DEFAULT_TASK_MANAGEMENT: TaskManagementState = {
  selectedExampleId: VAGUE_INSTRUCTION_EXAMPLES[0].id,
  customInstruction: '',
  missingCriteria: VAGUE_INSTRUCTION_EXAMPLES[0].typicalMissing,
  aiExecutionPrompt: '',
  aiExecutionDraft: '',
  revisedInstruction: '',
  completionCriteria: '',
  leaderSupport: '',
  priorityTask: '',
  reduceOrPause: '',
  flowStepOne: '',
  flowStepTwo: '',
  flowStepThree: '',
  bottleneckSignal: '',
  midCheckQuestion: '',
  aiFlowPrompt: '',
  soloWork: '',
  leaderCheckWork: '',
  crossFunctionalHelp: '',
  seniorLeaderShare: '',
  cautionOrApproval: '',
  coordinationMessage: '',
  aiCoordinationPrompt: '',
  finalMemo: '',
};

function getSelectedExample(exampleId: string) {
  return VAGUE_INSTRUCTION_EXAMPLES.find((example) => example.id === exampleId) ?? VAGUE_INSTRUCTION_EXAMPLES[0];
}

function toggleCriterion(current: TaskCriterion[], criterion: TaskCriterion) {
  if (current.includes(criterion)) return current.filter((item) => item !== criterion);
  return [...current, criterion];
}

function criterionBadgeClass(selected: boolean) {
  return selected ? 'border-cyan-700 bg-cyan-700 text-white' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-300 hover:bg-cyan-50';
}

function buildExecutionPrompt(state: TaskManagementState) {
  const example = getSelectedExample(state.selectedExampleId);
  const instruction = state.customInstruction.trim() || example.instruction;
  return `당신은 제약영업 팀장의 업무관리 문장을 구체화하는 코치입니다.\n\n[성과관리 이후 실행 과제화 상황]\n우리 조는 다음 업무지시를 실행 가능한 과제로 바꾸려고 합니다.\n\n"${instruction}"\n\n[빠진 기준]\n${state.missingCriteria.length > 0 ? state.missingCriteria.join(', ') : '아직 선택하지 않음'}\n\n[요청]\n이 지시를 팀원이 바로 실행할 수 있는 실행 과제로 바꿔 주세요.\n\n[작성 기준]\n- 실제 고객명, 병원명, 의료진명, 제품명, 실제 수치, 처방 정보, 내부 전략은 쓰지 마세요.\n- 미승인 효능, 허가 외 사용 암시, 처방 유도 표현, 경쟁사 비방, 비교 우위 단정 표현은 피해주세요.\n- 팀원이 무엇을, 어디까지, 언제까지, 어떤 기준으로 하면 되는지 알 수 있게 써 주세요.\n- 팀장이 지원할 부분도 포함해 주세요.\n\n[출력 형식]\n1. 수정한 업무지시문\n2. 완료 기준\n3. 팀장이 지원할 부분\n4. 조심해야 할 표현`;
}

function buildFlowPrompt(state: TaskManagementState) {
  return `당신은 영업팀장의 실행 흐름 점검을 돕는 업무관리 코치입니다.\n\n[우선 실행 과제]\n${state.priorityTask || '미작성'}\n\n[잠시 줄이거나 미룰 일]\n${state.reduceOrPause || '미작성'}\n\n[업무 흐름]\n1) ${state.flowStepOne || '미작성'}\n2) ${state.flowStepTwo || '미작성'}\n3) ${state.flowStepThree || '미작성'}\n\n[요청]\n위 실행 흐름에서 막힐 가능성이 높은 지점을 찾고, 질책이 아니라 확인으로 시작하는 중간 점검 질문 3개를 제안해 주세요.\n\n[주의]\n실제 고객명, 제품명, 처방 유도 표현, 비교 우위 단정은 쓰지 마세요.`;
}

function buildCoordinationPrompt(state: TaskManagementState) {
  return `당신은 제약영업 팀장의 실행 조율 문장을 다듬는 코치입니다.\n\n[팀원이 혼자 처리할 일]\n${state.soloWork || '미작성'}\n\n[팀장 확인이 필요한 일]\n${state.leaderCheckWork || '미작성'}\n\n[다른 부서 협조가 필요한 일]\n${state.crossFunctionalHelp || '미작성'}\n\n[상위 리더에게 공유할 일]\n${state.seniorLeaderShare || '미작성'}\n\n[주의 표현 또는 확인 필요 사항]\n${state.cautionOrApproval || '미작성'}\n\n[요청]\n팀 회의에서 공유할 짧은 조율 문장과 다른 부서에 확인 요청할 문장을 작성해 주세요. 정중하되 무엇을 확인받고 싶은지 분명해야 합니다.\n\n[주의]\n실제 고객명, 병원명, 제품명, 내부 수치, 처방 유도 표현은 쓰지 마세요.`;
}

function buildFinalMemo(state: TaskManagementState) {
  const example = getSelectedExample(state.selectedExampleId);
  const instruction = state.customInstruction.trim() || example.instruction;
  return [
    '[업무관리 Lab 결과]',
    `- 실행 과제화 기준: ${instruction || '미작성'}`,
    `- 빠진 기준: ${state.missingCriteria.length > 0 ? state.missingCriteria.join(' · ') : '미선택'}`,
    `- 수정한 업무지시문: ${state.revisedInstruction || '미작성'}`,
    `- 완료 기준: ${state.completionCriteria || '미작성'}`,
    `- 팀장이 지원할 부분: ${state.leaderSupport || '미작성'}`,
    `- 우선 실행 과제: ${state.priorityTask || '미작성'}`,
    `- 잠시 줄일 일: ${state.reduceOrPause || '미작성'}`,
    `- 업무 흐름: ${[state.flowStepOne, state.flowStepTwo, state.flowStepThree].filter(Boolean).join(' → ') || '미작성'}`,
    `- 막힘 신호: ${state.bottleneckSignal || '미작성'}`,
    `- 중간 확인 질문: ${state.midCheckQuestion || '미작성'}`,
    `- 팀원이 혼자 처리할 일: ${state.soloWork || '미작성'}`,
    `- 팀장 확인 필요: ${state.leaderCheckWork || '미작성'}`,
    `- 부서 협조 필요: ${state.crossFunctionalHelp || '미작성'}`,
    `- 상위 리더 공유: ${state.seniorLeaderShare || '미작성'}`,
    `- 주의 표현/확인 필요: ${state.cautionOrApproval || '미작성'}`,
    `- 조율 문장: ${state.coordinationMessage || '미작성'}`,
  ].join('\n');
}

function Field({
  label,
  help,
  placeholder,
  value,
  onChange,
  minHeight = 'min-h-24',
}: {
  label: string;
  help: string;
  placeholder: string;
  value: string;
  onChange: (next: string) => void;
  minHeight?: string;
}) {
  return (
    <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <span className="text-sm font-black text-slate-950">{label}</span>
      <p className="mt-1 text-xs font-bold leading-5 text-slate-600">{help}</p>
      <textarea
        className={`mt-3 ${minHeight} w-full rounded-2xl border bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function SectionHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <section className="rounded-3xl border border-cyan-100 bg-white p-5 shadow-sm md:p-6">
      <p className="text-xs font-black uppercase tracking-wide text-cyan-700">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black leading-tight text-slate-950">{title}</h2>
      <p className="mt-3 max-w-4xl text-sm font-bold leading-7 text-slate-600">{body}</p>
    </section>
  );
}

function CopyButton({ label, copiedLabel, text, onCopied }: { label: string; copiedLabel: string; text: string; onCopied: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopied();
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      onCopied();
    }
  };
  return (
    <button type="button" className="rounded-2xl bg-cyan-700 px-4 py-3 text-sm font-black text-white shadow-sm" onClick={copy}>
      {copied ? copiedLabel : label}
    </button>
  );
}

function TeamReactionCards({ example }: { example: VagueInstructionExample }) {
  return (
    <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
      <p className="text-sm font-black text-slate-950">이 지시를 들은 팀원들의 예상 반응</p>
      <p className="mt-1 text-sm font-bold leading-6 text-slate-600">이 팀원이 나쁘다는 뜻이 아닙니다. 모호한 지시는 팀원마다 다르게 해석될 수 있습니다.</p>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {example.likelyReactions.map((reaction) => (
          <article key={`${example.id}-${reaction.member}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-black text-slate-950">{reaction.member}</p>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-700">“{reaction.reaction}”</p>
            <p className="mt-3 rounded-2xl bg-white px-3 py-2 text-xs font-bold leading-5 text-cyan-900">필요한 기준: {reaction.hiddenNeed}</p>
          </article>
        ))}
      </div>
    </section>
  );
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

export function V40VNextTaskExecutionDesignLab() {
  const [state, setState] = useStored<TaskManagementState>(V40_VNEXT_TASK_MANAGEMENT_STORAGE_KEY, DEFAULT_TASK_MANAGEMENT);
  const selectedExample = getSelectedExample(state.selectedExampleId);
  const promptText = useMemo(() => buildExecutionPrompt(state), [state]);
  const update = (patch: Partial<TaskManagementState>) => setState({ ...state, ...patch });

  return (
    <div className="space-y-4">
      <SectionHeader
        eyebrow="업무관리 1 · 실행 과제화"
        title="성과 기준을 팀원이 실행할 수 있는 과제로 바꿉니다"
        body="업무지시 명확화는 이 단계 안에 통합합니다. 핵심은 성과관리에서 정한 기준을 팀원이 무엇을, 어디까지, 언제까지 하면 되는지 알 수 있는 실행 과제로 바꾸는 것입니다."
      />

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-sm font-black text-slate-950">1. 실행 과제로 바꿀 모호한 업무지시 고르기</p>
        <p className="mt-1 text-sm font-bold leading-6 text-slate-600">성과관리에서 정한 2주 기준을 팀원에게 전달할 때 나올 법한 표현을 하나 고릅니다.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {VAGUE_INSTRUCTION_EXAMPLES.map((example) => {
            const selected = state.selectedExampleId === example.id;
            return (
              <button
                key={example.id}
                type="button"
                className={`rounded-2xl border p-4 text-left transition ${selected ? 'border-cyan-700 bg-cyan-700 text-white shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-300 hover:bg-cyan-50'}`}
                onClick={() => update({ selectedExampleId: example.id, missingCriteria: example.typicalMissing, customInstruction: '', finalMemo: '' })}
              >
                <span className={`rounded-full px-2 py-1 text-[11px] font-black ${selected ? 'bg-white/20 text-white' : 'bg-white text-cyan-800'}`}>{example.category}</span>
                <p className="mt-3 text-sm font-black">{example.title}</p>
                <p className={`mt-2 text-sm font-bold leading-6 ${selected ? 'text-cyan-50' : 'text-slate-600'}`}>“{example.instruction}”</p>
              </button>
            );
          })}
        </div>
      </section>

      <TeamReactionCards example={selectedExample} />

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-sm font-black text-slate-950">2. 빠진 기준 고르기</p>
        <p className="mt-1 text-sm font-bold leading-6 text-slate-600">팀원이 헷갈릴 수 있는 기준을 고릅니다. 이것이 AI 질문과 최종 업무지시문에 들어갑니다.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {TASK_CRITERIA.map((criterion) => {
            const selected = state.missingCriteria.includes(criterion);
            return (
              <button
                key={criterion}
                type="button"
                className={`rounded-2xl border px-4 py-3 text-left text-sm font-black transition ${criterionBadgeClass(selected)}`}
                onClick={() => update({ missingCriteria: toggleCriterion(state.missingCriteria, criterion), finalMemo: '' })}
              >
                {criterion}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-black text-slate-950">AI에게 실행 과제 초안 부탁하기</p>
            <p className="mt-1 text-sm font-bold leading-6 text-slate-600">AI 초안은 답이 아니라 우리 조가 고칠 재료입니다.</p>
          </div>
          <CopyButton label="AI 질문 복사" copiedLabel="복사됨" text={promptText} onCopied={() => update({ aiExecutionPrompt: promptText })} />
        </div>
        <details className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <summary className="cursor-pointer text-sm font-black text-slate-950">AI에게 붙여넣을 질문 보기</summary>
          <pre className="mt-3 whitespace-pre-wrap rounded-2xl bg-white p-4 text-xs leading-6 text-slate-700">{promptText}</pre>
        </details>
      </section>

      <Field label="AI 실행 과제 초안 붙여넣기" help="AI가 준 초안을 붙여넣고, 아래에서 우리 조 언어로 다시 고칩니다." placeholder="AI가 준 수정 업무지시문, 완료 기준, 지원 조건을 붙여넣습니다." value={state.aiExecutionDraft} onChange={(aiExecutionDraft) => update({ aiExecutionDraft })} minHeight="min-h-32" />

      <div className="grid gap-4 lg:grid-cols-3">
        <Field label="수정한 업무지시문" help="팀원이 무엇을 해야 하는지 한 문단으로 씁니다." placeholder="예: 이번 2주 동안 A유형 고객군은 방문 후 48시간 안에 고객 질문과 다음 접점 가능성을 기록해 주세요." value={state.revisedInstruction} onChange={(revisedInstruction) => update({ revisedInstruction })} />
        <Field label="완료 기준" help="끝났다고 볼 수 있는 기준을 행동이나 산출물로 적습니다." placeholder="예: 고객 반응, 다음 접점 가능성, 추가 확인 질문이 각각 1줄 이상 남아 있으면 완료로 봅니다." value={state.completionCriteria} onChange={(completionCriteria) => update({ completionCriteria })} />
        <Field label="팀장이 지원할 부분" help="지시만 남기지 않고 팀장이 도울 조건을 적습니다." placeholder="예: 표현이나 자료 사용이 애매하면 승인된 범위 안에서 함께 점검하겠습니다." value={state.leaderSupport} onChange={(leaderSupport) => update({ leaderSupport })} />
      </div>
    </div>
  );
}

export function V40VNextTaskPriorityFlowLab() {
  const [state, setState] = useStored<TaskManagementState>(V40_VNEXT_TASK_MANAGEMENT_STORAGE_KEY, DEFAULT_TASK_MANAGEMENT);
  const promptText = useMemo(() => buildFlowPrompt(state), [state]);
  const update = (patch: Partial<TaskManagementState>) => setState({ ...state, ...patch });

  return (
    <div className="space-y-4">
      <SectionHeader
        eyebrow="업무관리 2 · 우선순위와 업무 흐름"
        title="중요한 일을 추가하기 전에 무엇을 먼저 하고 무엇을 줄일지 정합니다"
        body="업무관리는 일을 더 얹는 것이 아니라 실행 흐름을 다시 짜는 일입니다. 먼저 할 일, 잠시 줄일 일, 흐름 3단계, 막힘 신호, 중간 확인 질문을 정리합니다."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="먼저 할 일" help="이번 2주 동안 반드시 먼저 실행해야 할 과제를 적습니다." placeholder="예: 후속 실행이 끊긴 고객군의 최근 반응 기록을 먼저 확인한다." value={state.priorityTask} onChange={(priorityTask) => update({ priorityTask })} />
        <Field label="잠시 줄일 일" help="새 실행 과제를 위해 잠시 줄이거나 뒤로 미룰 일을 적습니다." placeholder="예: 단순 방문 건수 확대보다 후속 기록 품질 확인을 우선한다." value={state.reduceOrPause} onChange={(reduceOrPause) => update({ reduceOrPause })} />
      </div>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-sm font-black text-slate-950">업무 흐름 3단계</p>
        <p className="mt-1 text-sm font-bold leading-6 text-slate-600">일이 어떤 순서로 흘러가야 하는지 3단계로 줄입니다.</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <Field label="1단계" help="먼저 확인할 것" placeholder="예: 고객 반응 기록에서 추가 확인이 필요한 질문을 찾는다." value={state.flowStepOne} onChange={(flowStepOne) => update({ flowStepOne })} />
          <Field label="2단계" help="다음 행동으로 바꿀 것" placeholder="예: 후속 접점 가능성과 필요한 자료 범위를 정리한다." value={state.flowStepTwo} onChange={(flowStepTwo) => update({ flowStepTwo })} />
          <Field label="3단계" help="공유하거나 조정할 것" placeholder="예: 금요일 회의에서 막힌 지점과 지원 요청을 공유한다." value={state.flowStepThree} onChange={(flowStepThree) => update({ flowStepThree })} />
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="막힘 신호" help="실행이 흔들리고 있다는 조기 신호를 적습니다." placeholder="예: 기록은 늘었지만 다음 접점 가능성이 비어 있다." value={state.bottleneckSignal} onChange={(bottleneckSignal) => update({ bottleneckSignal })} />
        <Field label="중간 확인 질문" help="질책이 아니라 확인으로 시작하는 점검 질문을 적습니다." placeholder="예: 이번 주 중반 기준으로 어디서 막혔고, 제가 지원해야 할 부분은 무엇입니까?" value={state.midCheckQuestion} onChange={(midCheckQuestion) => update({ midCheckQuestion })} />
      </div>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-black text-slate-950">AI에게 업무 흐름 점검 질문 부탁하기</p>
            <p className="mt-1 text-sm font-bold leading-6 text-slate-600">우리 조가 정한 흐름을 기준으로 막힘 신호와 점검 질문을 다듬습니다.</p>
          </div>
          <CopyButton label="AI 질문 복사" copiedLabel="복사됨" text={promptText} onCopied={() => update({ aiFlowPrompt: promptText })} />
        </div>
      </section>
    </div>
  );
}

export function V40VNextTaskBoundaryCoordinationLab() {
  const [state, setState] = useStored<TaskManagementState>(V40_VNEXT_TASK_MANAGEMENT_STORAGE_KEY, DEFAULT_TASK_MANAGEMENT);
  const promptText = useMemo(() => buildCoordinationPrompt(state), [state]);
  const finalMemo = useMemo(() => state.finalMemo || buildFinalMemo(state), [state]);
  const update = (patch: Partial<TaskManagementState>) => setState({ ...state, ...patch });

  return (
    <div className="space-y-4">
      <SectionHeader
        eyebrow="업무관리 3 · 혼자 해결하면 안 되는 일"
        title="팀원이 혼자 처리할 일과 팀장이 연결해야 할 일을 구분합니다"
        body="업무관리의 마지막은 사람을 평가하는 것이 아니라 일의 경계를 정리하는 것입니다. 팀원이 자율적으로 처리할 일, 팀장 확인이 필요한 일, 부서 협조와 상위 공유가 필요한 일을 나눕니다."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="팀원이 혼자 처리할 일" help="팀원이 자율적으로 판단하고 실행해도 되는 범위를 적습니다." placeholder="예: 승인된 범위 안에서 고객 반응 기록과 다음 확인 질문을 정리한다." value={state.soloWork} onChange={(soloWork) => update({ soloWork })} />
        <Field label="팀장 확인이 필요한 일" help="팀원이 혼자 판단하면 위험하거나 기준 정렬이 필요한 일을 적습니다." placeholder="예: 고객에게 전달할 표현이 애매하거나 우선순위 충돌이 생긴 경우 팀장에게 먼저 확인한다." value={state.leaderCheckWork} onChange={(leaderCheckWork) => update({ leaderCheckWork })} />
        <Field label="다른 부서 협조가 필요한 일" help="마케팅, 학술, 영업기획, 컴플라이언스 등 확인이 필요한 일을 적습니다." placeholder="예: 자료 활용 범위나 표현 가능 여부는 관련 부서에 확인한다." value={state.crossFunctionalHelp} onChange={(crossFunctionalHelp) => update({ crossFunctionalHelp })} />
        <Field label="상위 리더에게 공유할 일" help="방향 정렬이나 우선순위 조정이 필요한 내용을 적습니다." placeholder="예: 기존 업무를 일부 줄이고 후속 실행 품질을 우선하겠다는 방향을 공유한다." value={state.seniorLeaderShare} onChange={(seniorLeaderShare) => update({ seniorLeaderShare })} />
      </div>

      <Field label="주의 표현 또는 확인 필요 사항" help="컴플라이언스·표현·자료 사용에서 반드시 확인해야 할 사항을 적습니다." placeholder="예: 특정 제품 비교 우위, 처방 유도처럼 들릴 수 있는 표현은 사용하지 않는다." value={state.cautionOrApproval} onChange={(cautionOrApproval) => update({ cautionOrApproval })} />

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-black text-slate-950">AI에게 조율 문장 초안 부탁하기</p>
            <p className="mt-1 text-sm font-bold leading-6 text-slate-600">팀 회의 공유 문장과 부서 확인 요청 문장을 초안으로 받습니다.</p>
          </div>
          <CopyButton label="AI 질문 복사" copiedLabel="복사됨" text={promptText} onCopied={() => update({ aiCoordinationPrompt: promptText })} />
        </div>
      </section>

      <Field label="팀 회의 또는 부서 확인용 조율 문장" help="우리 조가 실제로 말할 수 있는 짧은 공유·요청 문장을 적습니다." placeholder="예: 이번 2주는 단순 활동량보다 후속 실행 품질을 우선하겠습니다. 표현이나 자료 활용이 애매한 부분은 먼저 확인하고 진행하겠습니다." value={state.coordinationMessage} onChange={(coordinationMessage) => update({ coordinationMessage })} />

      <section className="rounded-3xl border border-slate-200 bg-slate-900 p-5 text-white shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-100">최종 메모 연결</p>
            <h3 className="mt-2 text-xl font-black">업무관리 실행 구조 메모</h3>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-200">이 내용은 마지막 2주 실행 메모에 붙여 넣을 수 있는 업무관리 결과입니다.</p>
          </div>
          <button type="button" className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-900" onClick={() => update({ finalMemo: buildFinalMemo(state) })}>
            업무관리 결과 정리
          </button>
        </div>
        <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-white/10 p-4 text-sm leading-7 text-slate-100">{finalMemo}</pre>
      </section>
    </div>
  );
}

export function V40VNextTaskInstructionSelectLab() {
  return <V40VNextTaskExecutionDesignLab />;
}
export function V40VNextTaskCriteriaDiagnosisLab() {
  return <V40VNextTaskPriorityFlowLab />;
}
export function V40VNextTaskAiDraftLab() {
  return <V40VNextTaskBoundaryCoordinationLab />;
}
export function V40VNextTaskManagementLab() {
  return <V40VNextTaskExecutionDesignLab />;
}
