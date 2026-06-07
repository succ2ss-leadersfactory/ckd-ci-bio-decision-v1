import { useMemo, useState } from 'react';
import { useStored } from './journey-storage';

const V40_VNEXT_TASK_MANAGEMENT_STORAGE_KEY = 'ckd.v40-vnext.taskManagement.v2';

const V40_VNEXT_TASK_MANAGEMENT_SMOKE_MARKERS = [
  'V40VNextTaskInstructionSelectLab',
  'V40VNextTaskCriteriaDiagnosisLab',
  'V40VNextTaskAiDraftLab',
  '업무관리 1: 모호한 업무지시 고르기',
  '업무관리 2: 빠진 업무 기준 진단하기',
  '업무관리 3: AI로 업무지시문 초안 만들기',
  '모호한 업무지시 예시 선택',
  '팀원 예상 반응',
  '빠진 업무 기준 진단',
  'AI에게 업무지시문 초안 부탁하기',
  'AI 답변 붙여넣기',
  'AI 초안 감별',
  '최종 업무지시문',
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
  '우리 조가 준비한 업무지시문',
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
  diagnosisQuestions: { criterion: TaskCriterion; question: string }[];
};

type TaskManagementState = {
  selectedExampleId: string;
  customInstruction: string;
  missingCriteria: TaskCriterion[];
  aiPrompt: string;
  aiRawDraft: string;
  usefulSentences: string;
  cautionExpressions: string;
  missingFromAi: string;
  revisedInstruction: string;
  completionCriteria: string;
  midCheckQuestion: string;
  leaderSupport: string;
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
    diagnosisQuestions: [
      { criterion: '범위', question: '어떤 고객군을 말하는지 보이는가?' },
      { criterion: '완료 기준', question: '무엇을 하면 후속조치를 했다고 볼 수 있는가?' },
      { criterion: '중간 확인', question: '언제 막힌 지점을 확인할 것인가?' },
      { criterion: '우선순위', question: '다른 업무와 충돌하면 무엇을 먼저 할 것인가?' },
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
    diagnosisQuestions: [
      { criterion: '목적', question: '이 기록을 왜 남겨야 하는지 설명되어 있는가?' },
      { criterion: '범위', question: '어떤 반응을 반드시 기록해야 하는지 보이는가?' },
      { criterion: '완료 기준', question: '최소 기록 항목이 행동이나 산출물로 표현되어 있는가?' },
      { criterion: '중간 확인', question: '기록 품질을 언제 함께 확인할 것인가?' },
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
    diagnosisQuestions: [
      { criterion: '배경', question: '왜 지금 우선순위를 바꾸는지 설명되어 있는가?' },
      { criterion: '범위', question: '중요 고객의 조건이 분명한가?' },
      { criterion: '우선순위', question: '무엇을 먼저 하고 무엇을 뒤로 미뤄도 되는지 보이는가?' },
      { criterion: '일정', question: '언제까지 우선 실행해야 하는지 보이는가?' },
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
    diagnosisQuestions: [
      { criterion: '목적', question: '왜 속도를 높여야 하는지 설명되어 있는가?' },
      { criterion: '범위', question: '어떤 업무의 속도를 높여야 하는지 보이는가?' },
      { criterion: '일정', question: '언제까지 어떤 단계가 끝나야 하는지 보이는가?' },
      { criterion: '완료 기준', question: '빠르게 하되 놓치면 안 되는 산출물이 있는가?' },
    ],
  },
  {
    id: 'sharing',
    category: '공유방식형',
    title: '고객 반응을 팀 안에서 잘 공유하기',
    instruction: '고객 반응은 팀 안에서 잘 공유해 주세요.',
    typicalMissing: ['목적', '범위', '일정', '완료 기준'],
    likelyReactions: [
      { member: '이대은 대리', reaction: '공유는 하겠지만 어떤 반응을 공유해야 하는지 애매하다.', hiddenNeed: '공유 대상 정보의 범위가 필요합니다.' },
      { member: '박재욱 사원', reaction: '메신저에 쓰면 되는지 회의 때 말하면 되는지 모르겠다.', hiddenNeed: '공유 방식과 시점이 필요합니다.' },
      { member: '김재호 차장', reaction: '너무 많은 공유는 오히려 회의 시간을 늘릴 수 있다.', hiddenNeed: '공유 기준과 최소 산출물이 필요합니다.' },
    ],
    diagnosisQuestions: [
      { criterion: '목적', question: '공유를 통해 무엇을 맞추려는지 설명되어 있는가?' },
      { criterion: '범위', question: '어떤 고객 반응을 공유해야 하는지 보이는가?' },
      { criterion: '일정', question: '언제, 어떤 방식으로 공유해야 하는지 보이는가?' },
      { criterion: '완료 기준', question: '공유가 완료됐다고 볼 수 있는 형식이 있는가?' },
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
    diagnosisQuestions: [
      { criterion: '범위', question: '각자가 맡은 고객군과 책임 범위가 보이는가?' },
      { criterion: '우선순위', question: '충돌 상황에서 무엇을 먼저 해야 하는지 보이는가?' },
      { criterion: '완료 기준', question: '관리 완료 기준이 행동이나 산출물로 표현되어 있는가?' },
      { criterion: '중간 확인', question: '혼자 판단하지 않고 도움을 요청할 시점이 있는가?' },
    ],
  },
];

const DEFAULT_TASK_MANAGEMENT: TaskManagementState = {
  selectedExampleId: VAGUE_INSTRUCTION_EXAMPLES[0].id,
  customInstruction: '',
  missingCriteria: VAGUE_INSTRUCTION_EXAMPLES[0].typicalMissing,
  aiPrompt: '',
  aiRawDraft: '',
  usefulSentences: '',
  cautionExpressions: '',
  missingFromAi: '',
  revisedInstruction: '',
  completionCriteria: '',
  midCheckQuestion: '',
  leaderSupport: '',
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

function buildAiPrompt(state: TaskManagementState) {
  const example = getSelectedExample(state.selectedExampleId);
  const instruction = state.customInstruction.trim() || example.instruction;
  const missingCriteria = state.missingCriteria.length > 0 ? state.missingCriteria.join(', ') : '아직 선택하지 않음';

  return `당신은 제약영업 팀장의 업무관리 문장을 구체화하는 코치입니다.

[상황]
우리 조는 다음과 같은 모호한 업무지시를 선택했습니다.

"${instruction}"

[이 지시에 빠진 기준]
${missingCriteria}

[요청]
이 업무지시를 팀원이 바로 실행할 수 있는 문장으로 바꿔 주세요.

[작성 기준]
1. 배경, 목적, 범위, 우선순위, 일정, 완료 기준, 중간 확인이 드러나게 써 주세요.
2. 실제 고객명, 병원명, 의료진명, 제품명, 실제 수치, 처방 정보, 내부 전략은 쓰지 마세요.
3. 미승인 효능, 허가 외 사용 암시, 처방 유도 표현, 경쟁사 비방, 비교 우위 단정 표현은 피해주세요.
4. 지시형으로 몰아붙이지 말고, 팀장이 지원할 부분도 포함해 주세요.
5. 팀원이 무엇을, 어디까지, 언제까지, 어떤 기준으로 하면 되는지 알 수 있게 써 주세요.

[출력 형식]
1. 수정한 업무지시문
2. 완료 기준
3. 중간 확인 질문
4. 팀장이 지원할 부분
5. 조심해야 할 표현`;
}

function buildFinalMemo(state: TaskManagementState) {
  const example = getSelectedExample(state.selectedExampleId);
  const instruction = state.customInstruction.trim() || example.instruction;
  return [
    '[업무관리 Lab 결과]',
    `- 기존 모호한 업무지시: ${instruction || '미작성'}`,
    `- 빠진 기준: ${state.missingCriteria.length > 0 ? state.missingCriteria.join(' · ') : '미선택'}`,
    `- AI 초안에서 쓸 만한 문장: ${state.usefulSentences || '미작성'}`,
    `- AI 초안에서 조심할 표현: ${state.cautionExpressions || '미작성'}`,
    `- AI 초안에서 빠진 기준: ${state.missingFromAi || '미작성'}`,
    `- 수정한 업무지시문: ${state.revisedInstruction || '미작성'}`,
    `- 완료 기준: ${state.completionCriteria || '미작성'}`,
    `- 중간 확인 질문: ${state.midCheckQuestion || '미작성'}`,
    `- 팀장이 지원할 부분: ${state.leaderSupport || '미작성'}`,
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

export function V40VNextTaskInstructionSelectLab() {
  const [state, setState] = useStored<TaskManagementState>(V40_VNEXT_TASK_MANAGEMENT_STORAGE_KEY, DEFAULT_TASK_MANAGEMENT);
  const selectedExample = getSelectedExample(state.selectedExampleId);
  const update = (patch: Partial<TaskManagementState>) => setState({ ...state, ...patch });

  return (
    <div className="space-y-4">
      <SectionHeader
        eyebrow="업무관리 1 · 모호한 업무지시 예시 선택"
        title="성과관리 결과를 팀원이 다르게 해석할 수 있는 말로 던지고 있지 않은지 봅니다"
        body="자유 기술부터 시작하지 않습니다. 현장에서 자주 나오는 모호한 업무지시 예시를 먼저 고르고, 이 말이 팀원에게 어떻게 다르게 들릴 수 있는지 확인합니다."
      />

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-sm font-black text-slate-950">1. 모호한 업무지시 고르기</p>
        <p className="mt-1 text-sm font-bold leading-6 text-slate-600">성과관리에서 정한 2주 기준을 팀원에게 전달할 때 나올 법한 지시를 하나 고릅니다.</p>
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

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-sm font-black text-slate-950">선택한 업무지시</p>
        <p className="mt-2 rounded-2xl bg-slate-900 p-4 text-sm font-bold leading-7 text-white">{state.customInstruction.trim() || selectedExample.instruction}</p>
        <details className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <summary className="cursor-pointer text-sm font-black text-slate-950">우리 조 상황에 맞게 문장만 살짝 바꾸기</summary>
          <textarea
            className="mt-3 min-h-24 w-full rounded-2xl border bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            value={state.customInstruction}
            onChange={(event) => update({ customInstruction: event.target.value })}
            placeholder={selectedExample.instruction}
          />
        </details>
      </section>

      <TeamReactionCards example={selectedExample} />
    </div>
  );
}

export function V40VNextTaskCriteriaDiagnosisLab() {
  const [state, setState] = useStored<TaskManagementState>(V40_VNEXT_TASK_MANAGEMENT_STORAGE_KEY, DEFAULT_TASK_MANAGEMENT);
  const selectedExample = getSelectedExample(state.selectedExampleId);
  const update = (patch: Partial<TaskManagementState>) => setState({ ...state, ...patch });

  return (
    <div className="space-y-4">
      <SectionHeader
        eyebrow="업무관리 2 · 빠진 업무 기준 진단하기"
        title="팀원이 헷갈릴 수 있는 빠진 기준을 체크합니다"
        body="모호한 지시의 문제는 말이 짧은 것이 아니라 팀원이 해석해야 할 여지가 너무 많다는 점입니다. 빠진 기준을 먼저 진단한 뒤 AI를 활용합니다."
      />

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-sm font-black text-slate-950">기존 모호한 업무지시</p>
        <p className="mt-2 rounded-2xl bg-slate-50 p-4 text-sm font-bold leading-7 text-slate-700">{state.customInstruction.trim() || selectedExample.instruction}</p>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-sm font-black text-slate-950">1. 이 지시에 빠졌을 가능성이 높은 기준</p>
        <p className="mt-1 text-sm font-bold leading-6 text-slate-600">아래 질문을 보고 우리 조가 반드시 보완해야 할 기준을 선택합니다.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {selectedExample.diagnosisQuestions.map((item) => {
            const selected = state.missingCriteria.includes(item.criterion);
            return (
              <button
                key={`${selectedExample.id}-${item.criterion}`}
                type="button"
                className={`rounded-2xl border p-4 text-left text-sm font-bold leading-6 transition ${criterionBadgeClass(selected)}`}
                onClick={() => update({ missingCriteria: toggleCriterion(state.missingCriteria, item.criterion), finalMemo: '' })}
              >
                <span className="text-xs font-black">{item.criterion}</span>
                <p className="mt-2">{item.question}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-sm font-black text-slate-950">2. 전체 기준에서 추가로 빠진 것 확인</p>
        <p className="mt-1 text-sm font-bold leading-6 text-slate-600">필요하면 다른 기준도 추가로 선택합니다.</p>
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
    </div>
  );
}

export function V40VNextTaskAiDraftLab() {
  const [state, setState] = useStored<TaskManagementState>(V40_VNEXT_TASK_MANAGEMENT_STORAGE_KEY, DEFAULT_TASK_MANAGEMENT);
  const [copied, setCopied] = useState(false);
  const selectedExample = getSelectedExample(state.selectedExampleId);
  const promptText = useMemo(() => buildAiPrompt(state), [state]);
  const finalMemo = useMemo(() => state.finalMemo || buildFinalMemo(state), [state]);
  const update = (patch: Partial<TaskManagementState>) => setState({ ...state, ...patch });

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      update({ aiPrompt: promptText });
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
      update({ aiPrompt: promptText });
    }
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        eyebrow="업무관리 3 · AI로 업무지시문 초안 만들기"
        title="AI 초안을 받은 뒤 우리 조의 현장 언어로 다시 고칩니다"
        body="AI가 먼저 정답을 만들게 하지 않습니다. 앞에서 선택한 모호한 지시와 빠진 기준을 바탕으로 초안을 받고, 좋은 점과 위험한 표현과 빠진 기준을 감별한 뒤 최종 문장을 완성합니다."
      />

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-black text-slate-950">AI에게 업무지시문 초안 부탁하기</p>
            <p className="mt-1 text-sm font-bold leading-6 text-slate-600">선택한 모호한 지시와 빠진 기준을 반영해 AI 질문을 자동 생성합니다.</p>
          </div>
          <button type="button" className="rounded-2xl bg-cyan-700 px-4 py-3 text-sm font-black text-white shadow-sm" onClick={copyPrompt}>
            {copied ? 'AI 질문 복사됨' : 'AI 질문 복사'}
          </button>
        </div>
        <details className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <summary className="cursor-pointer text-sm font-black text-slate-950">AI에게 붙여넣을 질문 보기</summary>
          <pre className="mt-3 whitespace-pre-wrap rounded-2xl bg-white p-4 text-xs leading-6 text-slate-700">{promptText}</pre>
        </details>
      </section>

      <Field
        label="AI 답변 붙여넣기"
        help="AI가 준 내용을 그대로 쓰지 않습니다. 먼저 아래에서 쓸 만한 문장, 조심할 표현, 빠진 기준으로 나눕니다."
        placeholder="AI가 준 업무지시문 초안을 여기에 붙여넣습니다. 실제 고객명, 병원명, 제품명, 내부 수치가 들어간 내용은 붙여넣지 않습니다."
        value={state.aiRawDraft}
        onChange={(aiRawDraft) => update({ aiRawDraft })}
        minHeight="min-h-36"
      />

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-sm font-black text-slate-950">AI 초안 감별</p>
        <p className="mt-1 text-sm font-bold leading-6 text-slate-600">AI 초안이 그럴듯해 보여도 그대로 쓰지 않습니다. 우리 조가 책임질 수 있는 문장인지 나눠 봅니다.</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <Field
            label="쓸 만한 문장"
            help="팀원이 바로 실행하는 데 도움이 되는 문장을 고릅니다."
            placeholder="예: 48시간 안에 고객 질문과 다음 접점 가능성을 1줄씩 기록한다는 기준은 쓸 만합니다."
            value={state.usefulSentences}
            onChange={(usefulSentences) => update({ usefulSentences })}
          />
          <Field
            label="조심할 표현"
            help="과장, 처방 유도, 비교 우위 단정, 통제적으로 들리는 표현을 적습니다."
            placeholder="예: 공략, 전환 가능성, 반드시 확보 같은 표현은 조심합니다."
            value={state.cautionExpressions}
            onChange={(cautionExpressions) => update({ cautionExpressions })}
          />
          <Field
            label="빠진 기준"
            help="AI 초안에도 아직 빠진 기준을 적습니다."
            placeholder="예: 중간 확인 시점은 있으나 팀장이 지원할 부분이 약합니다."
            value={state.missingFromAi}
            onChange={(missingFromAi) => update({ missingFromAi })}
          />
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Field
          label="최종 업무지시문"
          help="팀원이 무엇을, 어디까지, 언제까지 하면 되는지 알 수 있게 씁니다."
          placeholder={`예: ${selectedExample.instruction}를 아래 기준이 보이도록 다시 씁니다.`}
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

export function V40VNextTaskManagementLab() {
  return <V40VNextTaskInstructionSelectLab />;
}
