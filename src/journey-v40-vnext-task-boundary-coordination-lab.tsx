import { useMemo, useState } from 'react';
import { useStored } from './journey-storage';

const V40_VNEXT_TASK_MANAGEMENT_STORAGE_KEY = 'ckd.v40-vnext.taskManagement.v10';
const V40_VNEXT_BOUNDARY_SMOKE_MARKERS = [
  'V40VNextTaskBoundaryCoordinationLab',
  '업무관리 3: 혼자 해결하면 안 되는 일 구분하기',
  '10단계 운영 잠금: 9단계 실행 흐름 다시 보기 → 실행 항목 카드 확인 → 네 가지 바구니로 분류 → 위험 이유 선택 → 팀장 개입 타이밍 선택 → AI 조율 문장 → 업무 경계 선언문',
  '9단계 실행 흐름 다시 보기',
  '실행 항목 카드 확인',
  '네 가지 바구니로 분류',
  '팀원이 혼자 처리할 일',
  '팀장 확인이 필요한 일',
  '다른 부서 협조가 필요한 일',
  '상위 리더에게 공유할 일',
  '혼자 처리하면 위험한 이유',
  '팀장 개입 타이밍',
  'AI에게 조율 문장 초안 부탁하기',
  'AI 조율 문장 붙여넣기',
  '우리 조 언어로 수정',
  '업무 경계 선언문',
  '이 일은 혼자 해도 되는가, 아니면 연결해야 하는가?',
].join('|');
void V40_VNEXT_BOUNDARY_SMOKE_MARKERS;

type BoundaryBucketId = 'soloWork' | 'leaderCheckWork' | 'crossFunctionalHelp' | 'seniorLeaderShare';
type BoundaryState = Record<string, any> & {
  selectedExampleId?: string;
  customInstruction?: string;
  selectedPriorityTasks?: string[];
  selectedReduceTasks?: string[];
  flowStepOne?: string;
  flowStepTwo?: string;
  flowStepThree?: string;
  bottleneckSignal?: string;
  midCheckQuestion?: string;
  soloWork?: string;
  leaderCheckWork?: string;
  crossFunctionalHelp?: string;
  seniorLeaderShare?: string;
  cautionOrApproval?: string;
  coordinationMessage?: string;
  aiCoordinationPrompt?: string;
  boundaryAssignments?: Record<string, BoundaryBucketId>;
  boundaryRiskReasons?: string[];
  boundaryInterventionTimings?: string[];
  aiCoordinationDraft?: string;
  boundaryDeclaration?: string;
  finalMemo?: string;
};

type BoundaryCard = { id: string; text: string; hint: string };

const DEFAULT_STATE: BoundaryState = {
  selectedExampleId: 'follow-up',
  customInstruction: '',
  selectedPriorityTasks: [],
  selectedReduceTasks: [],
  flowStepOne: '',
  flowStepTwo: '',
  flowStepThree: '',
  bottleneckSignal: '',
  midCheckQuestion: '',
  soloWork: '',
  leaderCheckWork: '',
  crossFunctionalHelp: '',
  seniorLeaderShare: '',
  cautionOrApproval: '',
  coordinationMessage: '',
  aiCoordinationPrompt: '',
  boundaryAssignments: {},
  boundaryRiskReasons: [],
  boundaryInterventionTimings: [],
  aiCoordinationDraft: '',
  boundaryDeclaration: '',
  finalMemo: '',
};

const INSTRUCTION_BY_EXAMPLE: Record<string, string> = {
  'follow-up': '이번 2주 동안 후속조치가 약한 고객군을 더 챙겨봅시다.',
  'record-quality': '고객 반응을 좀 더 꼼꼼히 기록해 주세요.',
  priority: '중요 고객부터 먼저 신경 써 주세요.',
  speed: '이번 주에는 실행 속도를 좀 높입시다.',
  ownership: '각자 맡은 고객군은 책임지고 관리해 주세요.',
};

const BASE_CARDS_BY_EXAMPLE: Record<string, BoundaryCard[]> = {
  'follow-up': [
    { id: 'review-records', text: '최근 고객 반응 기록 다시 보기', hint: '기록 범위 안에서 팀원이 먼저 확인할 수 있는 일입니다.' },
    { id: 'segment-follow-up', text: '후속 접점이 끊긴 고객군 분류하기', hint: '기준이 명확하면 팀원이 자율적으로 진행할 수 있습니다.' },
    { id: 'unresolved-questions', text: '고객 질문과 미해결 요청 정리하기', hint: '질문 내용에 따라 팀장 확인이나 부서 확인이 필요할 수 있습니다.' },
    { id: 'material-boundary', text: '필요한 자료 사용 가능 범위 확인하기', hint: '자료·표현 범위는 관련 부서 확인이 필요한 일입니다.' },
    { id: 'share-blockers', text: '금요일 회의에서 막힌 고객군 공유하기', hint: '팀장이 중간에 연결하고 조정해야 하는 일입니다.' },
  ],
  'record-quality': [
    { id: 'record-items', text: '기록에 반드시 남길 항목 정하기', hint: '팀장 기준 정렬이 필요한 일입니다.' },
    { id: 'record-examples', text: '좋은 기록 예시와 부족한 기록 예시 비교하기', hint: '팀원 학습용으로 함께 맞출 수 있습니다.' },
    { id: 'dead-records', text: '다음 행동으로 이어지지 않는 메모 찾기', hint: '팀원이 먼저 점검할 수 있습니다.' },
    { id: 'record-sample-review', text: '중간 점검 때 기록 샘플 확인하기', hint: '팀장 개입 타이밍이 중요한 일입니다.' },
    { id: 'record-use-purpose', text: '기록 활용 목적을 상위 방향과 맞추기', hint: '상위 리더와 공유할 수 있는 일입니다.' },
  ],
  priority: [
    { id: 'priority-criteria', text: '중요 고객군 판단 기준 정하기', hint: '팀장이 기준을 분명히 제시해야 하는 일입니다.' },
    { id: 'classify-customers', text: '기존 고객군을 기준에 따라 다시 나누기', hint: '팀원이 기준 안에서 실행할 수 있습니다.' },
    { id: 'narrow-focus', text: '이번 2주 우선 고객군 1~2개로 좁히기', hint: '팀장 확인이 필요한 우선순위 판단입니다.' },
    { id: 'low-priority-minimum', text: '후순위 고객군의 최소 관리 기준 정하기', hint: '상위 방향과 충돌하지 않도록 확인이 필요합니다.' },
    { id: 'priority-conflict', text: '우선순위 충돌 시 판단 기준 정하기', hint: '팀장이 개입해야 할 가능성이 높은 일입니다.' },
  ],
  speed: [
    { id: 'speed-scope', text: '속도를 높일 업무 범위 정하기', hint: '범위가 없으면 단순 압박으로 들릴 수 있습니다.' },
    { id: 'minimum-output', text: '이번 주 안에 끝낼 최소 산출물 정하기', hint: '팀장 확인이 필요한 완료 기준입니다.' },
    { id: 'delay-cause', text: '지연되고 있는 업무 원인 확인하기', hint: '팀원이 먼저 확인하되 팀장 지원이 필요할 수 있습니다.' },
    { id: 'decision-point', text: '의사결정이 필요한 지점 표시하기', hint: '팀장이 빠르게 확인해야 하는 일입니다.' },
    { id: 'remove-blocker', text: '팀장이 바로 풀어줄 수 있는 장애물 정리하기', hint: '팀장 개입이 필요한 일입니다.' },
  ],
  ownership: [
    { id: 'ownership-scope', text: '팀원별 책임 고객군 범위 확인하기', hint: '책임과 권한의 경계를 맞추는 일입니다.' },
    { id: 'decision-boundary', text: '혼자 판단해도 되는 일과 확인받아야 할 일 구분하기', hint: '이 단계의 핵심 판단입니다.' },
    { id: 'minimum-standard', text: '고객군별 최소 관리 기준 정하기', hint: '팀원 자율 실행을 돕는 기준입니다.' },
    { id: 'share-rule', text: '막히면 공유할 기준 정하기', hint: '팀장 개입 타이밍과 연결됩니다.' },
    { id: 'support-condition', text: '팀장 지원이 필요한 조건 정리하기', hint: '책임 전가를 막기 위한 장치입니다.' },
  ],
};

const BUCKETS: { id: BoundaryBucketId; title: string; desc: string }[] = [
  { id: 'soloWork', title: '팀원이 혼자 처리할 일', desc: '승인된 기준 안에서 팀원이 스스로 실행해도 되는 일' },
  { id: 'leaderCheckWork', title: '팀장 확인이 필요한 일', desc: '우선순위·표현·완료 기준을 팀장이 중간에 확인해야 하는 일' },
  { id: 'crossFunctionalHelp', title: '다른 부서 협조가 필요한 일', desc: '자료, 표현, 기준, 컴플라이언스 확인이 필요한 일' },
  { id: 'seniorLeaderShare', title: '상위 리더에게 공유할 일', desc: '방향 정렬이나 우선순위 조정이 필요한 일' },
];

const RISK_REASONS = [
  '말해도 되는 선을 넘을 수 있다',
  '우선순위가 기존 방향과 충돌할 수 있다',
  '자료 사용 범위 확인이 필요하다',
  '팀원이 혼자 책임을 떠안을 수 있다',
  '고객 접점 전 표현 확인이 필요하다',
  '상위 리더와 방향 정렬이 필요하다',
];

const INTERVENTION_TIMINGS = [
  '시작 전 기준 확인',
  '중간 막힘 신호 확인',
  '고객 접점 전 표현 확인',
  '금요일 회의에서 공유',
  '부서 확인 후 실행',
  '상위 리더 방향 정렬 후 실행',
];

function asList(value: unknown) {
  return Array.isArray(value) ? value.filter(Boolean).join(' · ') : value ? String(value) : '미작성';
}
function selectedInstruction(state: BoundaryState) {
  return state.customInstruction?.trim() || INSTRUCTION_BY_EXAMPLE[state.selectedExampleId || 'follow-up'] || INSTRUCTION_BY_EXAMPLE['follow-up'];
}
function buildBoundaryCards(state: BoundaryState) {
  const base = BASE_CARDS_BY_EXAMPLE[state.selectedExampleId || 'follow-up'] ?? BASE_CARDS_BY_EXAMPLE['follow-up'];
  const dynamicCards: BoundaryCard[] = [state.flowStepOne, state.flowStepTwo, state.flowStepThree]
    .filter((text): text is string => Boolean(text && text.trim()))
    .map((text, index) => ({ id: `flow-${index + 1}-${text.slice(0, 16)}`, text, hint: '9단계에서 만든 업무 흐름입니다.' }));
  const unique = new Map<string, BoundaryCard>();
  [...base, ...dynamicCards].forEach((card) => unique.set(card.text, card));
  return Array.from(unique.values()).slice(0, 8);
}
function bucketText(state: BoundaryState, bucketId: BoundaryBucketId, cards: BoundaryCard[]) {
  return cards.filter((card) => state.boundaryAssignments?.[card.id] === bucketId).map((card) => card.text).join('\n');
}
function toggleList(list: string[] | undefined, value: string) {
  const current = list ?? [];
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
}
function buildCoordinationPrompt(state: BoundaryState, cards: BoundaryCard[]) {
  return `당신은 제약영업 팀장의 업무 조율 문장을 다듬는 코치입니다.\n\n[9단계에서 정리한 실행 흐름]\n- 먼저 할 일: ${asList(state.selectedPriorityTasks)}\n- 잠시 줄일 일: ${asList(state.selectedReduceTasks)}\n- 업무 흐름: ${[state.flowStepOne, state.flowStepTwo, state.flowStepThree].filter(Boolean).join(' → ') || '미작성'}\n- 막힘 신호: ${state.bottleneckSignal || '미작성'}\n- 중간 확인 질문: ${state.midCheckQuestion || '미작성'}\n\n[팀원이 혼자 처리할 일]\n${bucketText(state, 'soloWork', cards) || state.soloWork || '미작성'}\n\n[팀장 확인이 필요한 일]\n${bucketText(state, 'leaderCheckWork', cards) || state.leaderCheckWork || '미작성'}\n\n[다른 부서 협조가 필요한 일]\n${bucketText(state, 'crossFunctionalHelp', cards) || state.crossFunctionalHelp || '미작성'}\n\n[상위 리더에게 공유할 일]\n${bucketText(state, 'seniorLeaderShare', cards) || state.seniorLeaderShare || '미작성'}\n\n[혼자 처리하면 위험한 이유]\n${asList(state.boundaryRiskReasons)}\n\n[팀장 개입 타이밍]\n${asList(state.boundaryInterventionTimings)}\n\n[주의 표현 또는 확인 필요 사항]\n${state.cautionOrApproval || '미작성'}\n\n[요청]\n팀 회의에서 공유할 문장 1개, 다른 부서에 확인 요청할 문장 1개, 상위 리더에게 방향을 공유할 문장 1개를 작성해 주세요.\n\n[주의]\n실제 고객명, 병원명, 의료진명, 제품명, 실제 수치, 처방 정보, 처방 유도 표현, 비교 우위 단정, 경쟁사 비방은 쓰지 마세요.`;
}
function buildBoundaryDeclaration(state: BoundaryState, cards: BoundaryCard[]) {
  return `우리 조는 ${bucketText(state, 'soloWork', cards) || '팀원이 기준 안에서 처리할 일'}은 팀원이 직접 실행하도록 두겠습니다. 다만 ${bucketText(state, 'leaderCheckWork', cards) || '우선순위와 표현이 흔들릴 수 있는 일'}은 팀장이 중간에 확인하겠습니다. ${bucketText(state, 'crossFunctionalHelp', cards) || '자료나 표현 확인이 필요한 일'}은 관련 부서 확인 후 진행하겠습니다. ${bucketText(state, 'seniorLeaderShare', cards) || '방향 정렬이 필요한 일'}은 상위 리더와 방향을 맞추겠습니다.`;
}
function buildFinalMemo(state: BoundaryState, cards: BoundaryCard[]) {
  return [
    '[업무관리 3 결과]',
    `- 선택한 업무지시: ${selectedInstruction(state)}`,
    `- 팀원이 혼자 처리할 일: ${bucketText(state, 'soloWork', cards) || state.soloWork || '미작성'}`,
    `- 팀장 확인이 필요한 일: ${bucketText(state, 'leaderCheckWork', cards) || state.leaderCheckWork || '미작성'}`,
    `- 다른 부서 협조가 필요한 일: ${bucketText(state, 'crossFunctionalHelp', cards) || state.crossFunctionalHelp || '미작성'}`,
    `- 상위 리더에게 공유할 일: ${bucketText(state, 'seniorLeaderShare', cards) || state.seniorLeaderShare || '미작성'}`,
    `- 혼자 처리하면 위험한 이유: ${asList(state.boundaryRiskReasons)}`,
    `- 팀장 개입 타이밍: ${asList(state.boundaryInterventionTimings)}`,
    `- AI 조율 문장: ${state.aiCoordinationDraft || '미작성'}`,
    `- 우리 조 언어로 수정한 조율 문장: ${state.coordinationMessage || '미작성'}`,
    `- 업무 경계 선언문: ${state.boundaryDeclaration || buildBoundaryDeclaration(state, cards)}`,
  ].join('\n');
}

function ChoiceButton({ selected, children, onClick }: { selected: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`rounded-2xl border px-4 py-3 text-left text-sm font-black transition ${selected ? 'border-cyan-700 bg-cyan-700 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-300 hover:bg-cyan-50'}`}>{children}</button>;
}
function Field({ label, help, placeholder, value, onChange, minHeight = 'min-h-24' }: { label: string; help: string; placeholder: string; value: string; onChange: (next: string) => void; minHeight?: string }) {
  return <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="text-sm font-black text-slate-950">{label}</span><p className="mt-1 text-xs font-bold leading-5 text-slate-600">{help}</p><textarea className={`mt-3 ${minHeight} w-full rounded-2xl border bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100`} value={value || ''} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}
function CopyButton({ label, copiedLabel, text, onCopied }: { label: string; copiedLabel: string; text: string; onCopied: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(text); setCopied(true); onCopied(); window.setTimeout(() => setCopied(false), 1500); } catch { onCopied(); } };
  return <button type="button" className="rounded-2xl bg-cyan-700 px-4 py-3 text-sm font-black text-white shadow-sm" onClick={copy}>{copied ? copiedLabel : label}</button>;
}

export function V40VNextTaskBoundaryCoordinationLab() {
  const [state, setState] = useStored<BoundaryState>(V40_VNEXT_TASK_MANAGEMENT_STORAGE_KEY, DEFAULT_STATE);
  const cards = useMemo(() => buildBoundaryCards(state), [state.selectedExampleId, state.flowStepOne, state.flowStepTwo, state.flowStepThree]);
  const prompt = useMemo(() => buildCoordinationPrompt(state, cards), [state, cards]);
  const finalMemo = useMemo(() => state.finalMemo || buildFinalMemo(state, cards), [state, cards]);
  const update = (patch: Partial<BoundaryState>) => setState({ ...state, ...patch });
  const assignCard = (cardId: string, bucketId: BoundaryBucketId) => update({ boundaryAssignments: { ...(state.boundaryAssignments ?? {}), [cardId]: bucketId }, finalMemo: '' });
  const assignText = (bucketId: BoundaryBucketId) => bucketText(state, bucketId, cards);

  return <div className="space-y-4">
    <section className="rounded-3xl border border-cyan-100 bg-white p-5 shadow-sm md:p-6">
      <p className="text-xs font-black uppercase tracking-wide text-cyan-700">업무관리 3 · 업무 경계 판단</p>
      <h2 className="mt-2 text-2xl font-black leading-tight text-slate-950">이 일은 혼자 해도 되는가, 아니면 연결해야 하는가?</h2>
      <p className="mt-3 max-w-4xl text-sm font-bold leading-7 text-slate-600">9단계에서 만든 실행 흐름을 다시 보고, 팀원이 혼자 처리할 일과 팀장이 확인하거나 다른 부서·상위 리더와 연결해야 할 일을 나눕니다.</p>
    </section>

    <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
      <p className="text-sm font-black text-slate-950">9단계 실행 흐름 다시 보기</p>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-black text-slate-500">먼저 할 일</p><p className="mt-2 text-sm font-bold leading-6 text-slate-900">{asList(state.selectedPriorityTasks)}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-black text-slate-500">잠시 줄일 일</p><p className="mt-2 text-sm font-bold leading-6 text-slate-900">{asList(state.selectedReduceTasks)}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:col-span-2"><p className="text-xs font-black text-slate-500">업무 흐름 3단계</p><p className="mt-2 text-sm font-bold leading-6 text-slate-900">{[state.flowStepOne, state.flowStepTwo, state.flowStepThree].filter(Boolean).join(' → ') || '미작성'}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-black text-slate-500">막힘 신호</p><p className="mt-2 text-sm font-bold leading-6 text-slate-900">{state.bottleneckSignal || '미작성'}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-black text-slate-500">중간 확인 질문</p><p className="mt-2 text-sm font-bold leading-6 text-slate-900">{state.midCheckQuestion || '미작성'}</p></div>
      </div>
    </section>

    <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
      <p className="text-sm font-black text-slate-950">실행 항목 카드 확인</p>
      <p className="mt-1 text-sm font-bold leading-6 text-slate-600">각 카드를 네 가지 바구니 중 하나로 분류합니다. 분류가 갈리는 카드일수록 토의 가치가 큽니다.</p>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {cards.map((card) => <article key={card.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-black text-slate-950">{card.text}</p>
          <p className="mt-1 text-xs font-bold leading-5 text-slate-600">{card.hint}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {BUCKETS.map((bucket) => <button key={bucket.id} type="button" onClick={() => assignCard(card.id, bucket.id)} className={`rounded-xl border px-3 py-2 text-left text-xs font-black transition ${state.boundaryAssignments?.[card.id] === bucket.id ? 'border-cyan-700 bg-cyan-700 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-300 hover:bg-cyan-50'}`}>{bucket.title}</button>)}
          </div>
        </article>)}
      </div>
    </section>

    <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
      <p className="text-sm font-black text-slate-950">네 가지 바구니로 분류</p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {BUCKETS.map((bucket) => <div key={bucket.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-black text-slate-950">{bucket.title}</p>
          <p className="mt-1 text-xs font-bold leading-5 text-slate-600">{bucket.desc}</p>
          <pre className="mt-3 min-h-20 whitespace-pre-wrap rounded-2xl bg-white p-3 text-sm font-bold leading-6 text-slate-800">{assignText(bucket.id) || '아직 분류된 카드가 없습니다.'}</pre>
        </div>)}
      </div>
    </section>

    <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
      <p className="text-sm font-black text-slate-950">혼자 처리하면 위험한 이유</p>
      <p className="mt-1 text-sm font-bold leading-6 text-slate-600">혼자 처리하면 위험한 이유를 고릅니다. 이것이 팀장 개입의 근거가 됩니다.</p>
      <div className="mt-4 grid gap-2 md:grid-cols-2 lg:grid-cols-3">{RISK_REASONS.map((reason) => <ChoiceButton key={reason} selected={(state.boundaryRiskReasons ?? []).includes(reason)} onClick={() => update({ boundaryRiskReasons: toggleList(state.boundaryRiskReasons, reason), finalMemo: '' })}>{reason}</ChoiceButton>)}</div>
    </section>

    <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
      <p className="text-sm font-black text-slate-950">팀장 개입 타이밍</p>
      <p className="mt-1 text-sm font-bold leading-6 text-slate-600">팀장이 언제 확인해야 도움이 되는지 선택합니다. 빠르면 통제가 되고, 늦으면 리스크가 커질 수 있습니다.</p>
      <div className="mt-4 grid gap-2 md:grid-cols-2 lg:grid-cols-3">{INTERVENTION_TIMINGS.map((timing) => <ChoiceButton key={timing} selected={(state.boundaryInterventionTimings ?? []).includes(timing)} onClick={() => update({ boundaryInterventionTimings: toggleList(state.boundaryInterventionTimings, timing), finalMemo: '' })}>{timing}</ChoiceButton>)}</div>
    </section>

    <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><p className="text-sm font-black text-slate-950">AI에게 조율 문장 초안 부탁하기</p><p className="mt-1 text-sm font-bold leading-6 text-slate-600">분류 결과, 위험 이유, 개입 타이밍을 넣어 팀 회의 공유 문장·부서 확인 요청 문장·상위 리더 공유 문장을 받습니다.</p></div><CopyButton label="AI 질문 복사" copiedLabel="복사됨" text={prompt} onCopied={() => update({ aiCoordinationPrompt: prompt })} /></div>
      <details className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"><summary className="cursor-pointer text-sm font-black text-slate-950">AI에게 붙여넣을 질문 보기</summary><pre className="mt-3 whitespace-pre-wrap rounded-2xl bg-white p-4 text-xs leading-6 text-slate-700">{prompt}</pre></details>
    </section>

    <Field label="AI 조율 문장 붙여넣기" help="AI가 제안한 팀 회의 공유 문장, 부서 확인 요청 문장, 상위 리더 공유 문장을 붙여넣습니다." placeholder="AI 조율 문장 초안을 붙여넣습니다." value={state.aiCoordinationDraft || ''} onChange={(aiCoordinationDraft) => update({ aiCoordinationDraft })} minHeight="min-h-32" />
    <Field label="우리 조 언어로 수정" help="AI 문장을 그대로 쓰지 말고 실제 회의에서 말할 수 있는 표현으로 바꿉니다." placeholder="예: 이번 2주는 단순 활동량보다 후속 실행 품질을 우선하겠습니다. 자료나 표현이 애매한 부분은 먼저 확인하고 진행하겠습니다." value={state.coordinationMessage || ''} onChange={(coordinationMessage) => update({ coordinationMessage })} minHeight="min-h-32" />

    <section className="rounded-3xl border border-slate-200 bg-slate-900 p-5 text-white shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><p className="text-xs font-black uppercase tracking-wide text-cyan-100">업무 경계 선언문</p><p className="mt-2 text-sm font-bold leading-6 text-slate-200">위임과 방치 사이의 경계를 조별 선언문으로 정리합니다.</p></div><button type="button" className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-900" onClick={() => update({ boundaryDeclaration: buildBoundaryDeclaration(state, cards) })}>선언문 만들기</button></div>
      <textarea className="mt-4 min-h-32 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm leading-7 text-white outline-none" value={state.boundaryDeclaration || ''} onChange={(event) => update({ boundaryDeclaration: event.target.value })} placeholder={buildBoundaryDeclaration(state, cards)} />
    </section>

    <section className="rounded-3xl border border-slate-200 bg-slate-900 p-5 text-white shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><p className="text-xs font-black uppercase tracking-wide text-cyan-100">최종 메모 연결</p><h3 className="mt-2 text-xl font-black">업무관리 실행 경계 메모</h3><p className="mt-2 text-sm font-bold leading-6 text-slate-200">이 내용은 마지막 2주 실행 메모에 붙여 넣을 수 있는 업무관리 3 결과입니다.</p></div><button type="button" className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-900" onClick={() => update({ soloWork: assignText('soloWork'), leaderCheckWork: assignText('leaderCheckWork'), crossFunctionalHelp: assignText('crossFunctionalHelp'), seniorLeaderShare: assignText('seniorLeaderShare'), finalMemo: buildFinalMemo(state, cards) })}>업무관리 결과 정리</button></div>
      <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-white/10 p-4 text-sm leading-7 text-slate-100">{finalMemo}</pre>
    </section>
  </div>;
}
