import { useStored } from './journey-storage';

const V41_PROMPT_REVIEW_MARKERS = [
  'V41PromptPracticeReviewLab',
  'v41 prompt practice lab cloned',
  'v41 prompt practice copy refined',
  '질문 다듬기',
  '먼저 장면을 고릅니다',
  '한 줄 질문으로 먼저 물어보기',
  '정리된 프롬프트로 다시 물어보기',
  '결과 차이 메모',
  'ckd.v41.promptPracticeReview.v2',
].join('|');
void V41_PROMPT_REVIEW_MARKERS;

type ReviewKey = 'specificity' | 'contextFit' | 'actionability' | 'leaderLanguage' | 'factCheckable';
type ReviewFlags = Record<ReviewKey, boolean>;

type SituationOption = {
  id: string;
  tag: string;
  title: string;
  body: string;
  generalQuestion: string;
};

type PromptReviewState = {
  selectedSituationId: string;
  customSituation: string;
  generalQuestion: string;
  generalAiResult: string;
  generalChecks: ReviewFlags;
  structuredAiResult: string;
  structuredChecks: ReviewFlags;
  comparisonMemo: string;
};

const STORAGE_KEY = 'ckd.v41.promptPracticeReview.v2';

const EMPTY_CHECKS: ReviewFlags = {
  specificity: false,
  contextFit: false,
  actionability: false,
  leaderLanguage: false,
  factCheckable: false,
};

const SITUATION_OPTIONS: SituationOption[] = [
  {
    id: 'visit-followup',
    tag: '후속조치가 약한 상황',
    title: '방문은 하는데 다음 대화로 잘 이어지지 않는다',
    body: '방문은 꾸준하지만 고객 질문, 다음 약속, 자료 요청 대응으로 연결되는 경우가 적습니다.',
    generalQuestion: '방문은 꾸준히 하는데 고객 대화와 후속조치가 잘 이어지지 않을 때 어떻게 해야 하나요?',
  },
  {
    id: 'record-quality',
    tag: '기록 품질이 아쉬운 상황',
    title: '기록은 있는데 고객 반응과 다음 행동이 잘 보이지 않는다',
    body: '방문·면담 기록은 남아 있지만 고객이 무엇에 반응했는지, 다음에 무엇을 확인해야 하는지가 흐릿합니다.',
    generalQuestion: '영업활동 기록은 있는데 고객 반응과 다음 행동이 잘 보이지 않을 때 어떻게 개선해야 하나요?',
  },
  {
    id: 'customer-signal',
    tag: '고객 신호가 애매한 상황',
    title: '고객 관심을 기회 신호로 봐도 될지 애매하다',
    body: '고객 질문이나 자료 요청은 있었지만 실제 기회인지 판단하기 어렵습니다.',
    generalQuestion: '고객 반응 중 어떤 것을 기회 신호로 봐야 할지 잘 모르겠습니다.',
  },
  {
    id: 'temperature-gap',
    tag: '팀원 실행 온도차',
    title: '팀원마다 새로운 기준을 받아들이는 온도차가 크다',
    body: '일부 팀원은 기준과 이유를 알고 싶어 하고, 일부 팀원은 새로운 기준을 부담스럽게 느낍니다.',
    generalQuestion: '팀원마다 새로운 실행 기준을 받아들이는 정도가 다를 때 팀장은 어떻게 맞춰야 하나요?',
  },
  {
    id: 'ai-boundary',
    tag: 'AI 사용 안전선',
    title: 'AI에 어디까지 물어봐도 되는지 조심스럽다',
    body: 'AI로 실행계획 초안은 만들 수 있지만 민감정보와 표현 안전선이 걱정됩니다.',
    generalQuestion: '영업팀장이 AI로 실행계획을 만들 때 어디까지 물어봐도 괜찮은지 알고 싶습니다.',
  },
];

const CHECKS: { key: ReviewKey; label: string; help: string }[] = [
  { key: 'specificity', label: '구체성', help: '무엇을 봐야 하는지 구체적으로 나왔나요?' },
  { key: 'contextFit', label: '맥락', help: '영업팀장, 고객 접점, 팀원 실행 신호가 반영되었나요?' },
  { key: 'actionability', label: '실행', help: '다음 행동이나 2주 기준으로 옮길 수 있나요?' },
  { key: 'leaderLanguage', label: '팀장 언어', help: '팀원이 들을 수 있는 말로 바뀌었나요?' },
  { key: 'factCheckable', label: '확인 가능', help: '추정이 아니라 기록·질문·행동으로 확인할 수 있나요?' },
];

const DEFAULT_STATE: PromptReviewState = {
  selectedSituationId: SITUATION_OPTIONS[2].id,
  customSituation: '',
  generalQuestion: SITUATION_OPTIONS[2].generalQuestion,
  generalAiResult: '',
  generalChecks: { ...EMPTY_CHECKS },
  structuredAiResult: '',
  structuredChecks: { ...EMPTY_CHECKS },
  comparisonMemo: '',
};

function findSituation(id: string) {
  return SITUATION_OPTIONS.find((option) => option.id === id) ?? SITUATION_OPTIONS[2];
}

function selectedSituationText(state: PromptReviewState) {
  const custom = state.customSituation.trim();
  if (custom) return custom;
  const selected = findSituation(state.selectedSituationId);
  return `${selected.title} ${selected.body}`;
}

function buildStructuredPrompt(state: PromptReviewState) {
  return [
    '역할: 당신은 C1바이오 영업팀장의 사고 정리를 돕는 리더십 코치입니다.',
    '',
    '상황:',
    selectedSituationText(state),
    '',
    '처음 던진 한 줄 질문:',
    state.generalQuestion,
    '',
    '요청:',
    '1. 이 상황에서 사실과 해석을 나눠 주세요.',
    '2. 고객 반응, 활동 기록, 팀원 실행 신호 중 무엇을 먼저 볼지 정리해 주세요.',
    '3. 다음 2주 동안 팀원이 바로 움직일 수 있는 확인 질문 3개를 제안해 주세요.',
    '4. 팀장이 팀원에게 그대로 말할 수 있는 첫 문장 2개를 제안해 주세요.',
    '5. 단정, 고객 의도 추정, 민감정보 입력 위험이 있는 표현을 표시해 주세요.',
    '',
    '출력 형식:',
    '- 사실로 볼 수 있는 것',
    '- 아직 확인해야 할 것',
    '- 다음 2주 실행 신호',
    '- 팀원에게 물어볼 질문',
    '- 팀장의 첫 문장',
    '- 주의할 표현',
    '',
    '주의: 실제 고객명, 병원명, 의료진명, 제품명, 실제 수치, 개인정보, 내부 전략은 넣지 말고 가상·익명 표현으로 작성해 주세요.',
  ].join('\n');
}

function checkedCount(flags: ReviewFlags) {
  return CHECKS.filter((check) => flags[check.key]).length;
}

function ReviewChecklist({ flags, onChange }: { flags: ReviewFlags; onChange: (key: ReviewKey, checked: boolean) => void }) {
  return (
    <div className="grid gap-3 md:grid-cols-5">
      {CHECKS.map((check) => (
        <label key={check.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-2">
            <input className="mt-1" type="checkbox" checked={flags[check.key]} onChange={(event) => onChange(check.key, event.target.checked)} />
            <span className="text-sm font-black text-slate-950">{check.label}</span>
          </div>
          <p className="mt-2 text-xs font-bold leading-5 text-slate-500">{check.help}</p>
        </label>
      ))}
    </div>
  );
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    window.prompt('아래 내용을 복사해 AI에 붙여넣으세요.', text);
  }
}

export function V41PromptPracticeReviewLab() {
  const [state, setState] = useStored<PromptReviewState>(STORAGE_KEY, DEFAULT_STATE);
  const update = (patch: Partial<PromptReviewState>) => setState({ ...state, ...patch });
  const structuredPrompt = buildStructuredPrompt(state);
  const generalCheckedCount = checkedCount(state.generalChecks);
  const structuredCheckedCount = checkedCount(state.structuredChecks);

  const selectSituation = (option: SituationOption) => {
    setState({
      ...state,
      selectedSituationId: option.id,
      generalQuestion: option.generalQuestion,
      generalAiResult: '',
      generalChecks: { ...EMPTY_CHECKS },
      structuredAiResult: '',
      structuredChecks: { ...EMPTY_CHECKS },
      comparisonMemo: '',
    });
  };

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-violet-100 bg-white p-4 shadow-sm md:p-5">
        <p className="text-xs font-black uppercase tracking-wide text-violet-700">질문 다듬기</p>
        <h3 className="mt-1 text-xl font-black text-slate-950">먼저 장면을 고릅니다</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">처음부터 완벽한 프롬프트를 만들지 않습니다. 한 줄 질문과 정리된 프롬프트의 차이를 비교해 봅니다.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {SITUATION_OPTIONS.map((option) => {
            const selected = state.selectedSituationId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => selectSituation(option)}
                className={`rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${selected ? 'border-violet-300 bg-violet-50 ring-2 ring-violet-100' : 'border-slate-200 bg-white'}`}
              >
                <p className="text-xs font-black text-violet-700">{option.tag}</p>
                <p className="mt-2 text-base font-black leading-6 text-slate-950">{option.title}</p>
                <p className="mt-2 text-sm font-bold leading-6 text-slate-600">{option.body}</p>
              </button>
            );
          })}
        </div>
        <label className="mt-4 block">
          <span className="text-sm font-black text-slate-700">다른 장면이면 직접 적기</span>
          <textarea
            className="mt-2 min-h-20 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100"
            value={state.customSituation}
            onChange={(event) => update({ customSituation: event.target.value })}
            placeholder="예: 고객 반응은 있는데 다음 행동으로 이어지지 않아 팀원들과 무엇을 확인해야 할지 고민입니다."
          />
        </label>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700">1차</p>
        <h3 className="mt-1 text-xl font-black text-slate-950">한 줄 질문으로 먼저 물어보기</h3>
        <label className="mt-4 block">
          <span className="text-sm font-black text-slate-800">한 줄 질문</span>
          <textarea className="mt-2 min-h-20 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" value={state.generalQuestion} onChange={(event) => update({ generalQuestion: event.target.value })} />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => copyText(state.generalQuestion)} className="rounded-2xl bg-cyan-700 px-4 py-3 text-sm font-black text-white">한 줄 질문 복사</button>
          <span className="rounded-2xl bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-600">일부러 역할, 기준, 출력 형식은 넣지 않습니다.</span>
        </div>
        <label className="mt-4 block">
          <span className="text-sm font-black text-slate-800">AI 답변 붙여넣기</span>
          <textarea className="mt-2 min-h-36 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100" value={state.generalAiResult} onChange={(event) => update({ generalAiResult: event.target.value })} placeholder="한 줄 질문으로 받은 AI 답변을 붙여넣으세요." />
        </label>
        <div className="mt-4"><ReviewChecklist flags={state.generalChecks} onChange={(key, checked) => update({ generalChecks: { ...state.generalChecks, [key]: checked } })} /></div>
        <div className="mt-4 rounded-2xl border border-cyan-100 bg-cyan-50 p-4 text-sm font-bold leading-6 text-cyan-950">한 줄 질문 체크: {generalCheckedCount} / {CHECKS.length}개</div>
      </section>

      <section className="rounded-3xl border border-emerald-200 bg-white p-4 shadow-sm md:p-5">
        <p className="text-xs font-black uppercase tracking-wide text-emerald-700">2차</p>
        <h3 className="mt-1 text-xl font-black text-slate-950">정리된 프롬프트로 다시 물어보기</h3>
        <label className="mt-4 block">
          <span className="text-sm font-black text-slate-800">정리된 프롬프트</span>
          <textarea className="mt-2 min-h-56 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" value={structuredPrompt} readOnly />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => copyText(structuredPrompt)} className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white">정리된 프롬프트 복사</button>
          <span className="rounded-2xl bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-900">역할, 맥락, 출력 형식, 안전선을 넣어 결과가 어떻게 달라지는지 봅니다.</span>
        </div>
        <label className="mt-4 block">
          <span className="text-sm font-black text-slate-800">AI 답변 붙여넣기</span>
          <textarea className="mt-2 min-h-36 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" value={state.structuredAiResult} onChange={(event) => update({ structuredAiResult: event.target.value })} placeholder="정리된 프롬프트로 받은 AI 답변을 붙여넣으세요." />
        </label>
        <div className="mt-4"><ReviewChecklist flags={state.structuredChecks} onChange={(key, checked) => update({ structuredChecks: { ...state.structuredChecks, [key]: checked } })} /></div>
        <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-bold leading-6 text-emerald-950">정리된 프롬프트 체크: {structuredCheckedCount} / {CHECKS.length}개</div>
        <label className="mt-4 block">
          <span className="text-sm font-black text-slate-800">결과 차이 메모</span>
          <textarea className="mt-2 min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" value={state.comparisonMemo} onChange={(event) => update({ comparisonMemo: event.target.value })} placeholder="예: 한 줄 질문은 조언이 넓었고, 정리된 프롬프트는 팀장 질문과 2주 실행 기준이 더 분명했다." />
        </label>
      </section>
    </section>
  );
}
