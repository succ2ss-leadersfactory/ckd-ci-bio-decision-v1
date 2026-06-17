import { useStored } from './journey-storage';

const V40_VNEXT_PROMPT_REVIEW_MARKERS = [
  'V40VNextPromptPracticeReviewLab',
  '상황 보기 선택',
  '일반적인 질문',
  '일반적인 질문만 복사하기',
  '일반적인 질문 결과 붙여넣기',
  '정리된 프롬프트',
  '정리된 프롬프트 복사하기',
  '프롬프트 결과 붙여넣기',
  '구체성',
  '맥락 반영',
  '실행 가능성',
  '리더의 언어',
  '사실 검증 가능성',
  'ckd.v40-vnext.promptPracticeReview.v2',
].join('|');
void V40_VNEXT_PROMPT_REVIEW_MARKERS;

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

const STORAGE_KEY = 'ckd.v40-vnext.promptPracticeReview.v2';

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
    tag: '방문 이후가 흐릿한 상황',
    title: '방문은 하는데 다음 대화나 후속조치로 잘 이어지지 않는다',
    body: '방문은 꾸준히 하는데, 고객 질문이나 다음 약속, 자료 요청 대응으로 이어지는 경우가 적습니다.',
    generalQuestion: '방문은 꾸준히 하는데 고객 대화와 후속조치가 잘 이어지지 않을 때 어떻게 해야 하나요?',
  },
  {
    id: 'record-quality',
    tag: '기록은 있는데 읽기 어려운 상황',
    title: '영업활동 기록은 남기지만 고객 반응과 다음 행동이 잘 보이지 않는다',
    body: '방문·면담 기록은 남아 있지만 고객이 무엇에 반응했는지, 다음에 무엇을 확인해야 하는지가 흐릿합니다.',
    generalQuestion: '영업활동 기록은 있는데 고객 반응과 다음 행동이 잘 보이지 않을 때 어떻게 개선해야 하나요?',
  },
  {
    id: 'customer-signal',
    tag: '고객 반응 해석이 애매한 상황',
    title: '고객이 관심을 보인 것 같은데 어떤 신호를 기회로 봐야 할지 애매하다',
    body: '고객 질문이나 자료 요청이 있었지만, 이것을 실제 기회로 봐도 되는지 판단이 어렵습니다.',
    generalQuestion: '고객 반응 중 어떤 것을 기회 신호로 봐야 할지 잘 모르겠습니다.',
  },
  {
    id: 'temperature-gap',
    tag: '팀원마다 받아들이는 온도가 다른 상황',
    title: '자연차 팀원과 기존 팀원의 실행 온도차가 크다',
    body: '자연차 팀원은 기준과 이유를 알고 싶어 하고, 기존 팀원은 새로운 기준을 부담스럽게 느낍니다.',
    generalQuestion: '팀원마다 새로운 실행 기준을 받아들이는 정도가 다를 때 팀장은 어떻게 맞춰야 하나요?',
  },
  {
    id: 'ai-boundary',
    tag: 'AI에 어디까지 물어볼지 조심스러운 상황',
    title: 'AI로 실행계획을 만들 수는 있을 것 같은데 어디까지 물어봐도 되는지 불안하다',
    body: 'AI를 쓰면 회의 문장이나 실행계획 초안을 빨리 만들 수 있지만 민감정보와 표현 안전선이 걱정됩니다.',
    generalQuestion: '영업팀장이 AI로 실행계획을 만들 때 어디까지 물어봐도 괜찮은지 알고 싶습니다.',
  },
];

const CHECKS: { key: ReviewKey; label: string; help: string }[] = [
  { key: 'specificity', label: '구체성', help: '추상적 조언이 아니라 무엇을 봐야 하는지 구체적으로 제시되었는가?' },
  { key: 'contextFit', label: '맥락 반영', help: '이대호 팀장, C1바이오 영업팀, 고객 접점, 팀원 실행 신호 맥락이 반영되었는가?' },
  { key: 'actionability', label: '실행 가능성', help: '바로 다음 행동, 확인 질문, 2주 실행 기준으로 옮길 수 있는가?' },
  { key: 'leaderLanguage', label: '리더의 언어', help: '팀장이 팀원에게 설명하거나 질문할 수 있는 말로 바뀌었는가?' },
  { key: 'factCheckable', label: '사실 검증 가능성', help: '추정·단정이 아니라 기록, 질문, 행동으로 확인 가능한가?' },
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
    '역할: 당신은 C1바이오 영업팀장 이대호 팀장의 사고 정리를 돕는 리더십 코치입니다.',
    '',
    '상황:',
    selectedSituationText(state),
    '',
    '내가 처음 던진 일반적인 질문:',
    state.generalQuestion,
    '',
    '요청:',
    '1. 이 상황에서 팀장이 먼저 확인해야 할 사실과 해석을 분리해 주세요.',
    '2. 고객 반응, 영업활동 기록, 팀원 실행 신호 중 무엇을 먼저 봐야 하는지 정리해 주세요.',
    '3. 다음 2주 동안 팀장이 팀원에게 물어볼 확인 질문 3개를 제안해 주세요.',
    '4. 팀원에게 그대로 말할 수 있는 리더의 언어로 첫 문장 2개를 제안해 주세요.',
    '5. 단정적 표현, 고객 의도 추정, 민감정보 입력 위험이 있는 표현을 따로 표시해 주세요.',
    '',
    '출력 형식:',
    '- 사실로 볼 수 있는 것',
    '- 아직 확인해야 할 것',
    '- 다음 2주 실행 신호',
    '- 팀원에게 물어볼 질문',
    '- 리더의 첫 문장',
    '- 주의할 표현',
    '',
    '주의: 실제 고객명, 병원명, 의료진명, 제품명, 실제 수치, 개인정보, 내부 전략은 사용하지 말고 가상·익명 표현으로 작성해 주세요.',
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

export function V40VNextPromptPracticeReviewLab() {
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
        <p className="text-xs font-black uppercase tracking-wide text-violet-700">먼저 고르기</p>
        <h3 className="mt-1 text-xl font-black text-slate-950">팀에서 제일 걸리는 장면을 하나 고릅니다</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
          AI에게 바로 잘 정리된 프롬프트를 넣기 전에, 일반적인 한 줄 질문으로 어떤 답이 나오는지 먼저 확인합니다.
        </p>
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
          <span className="text-sm font-black text-slate-700">목록에 없으면 직접 적어도 됩니다</span>
          <textarea
            className="mt-2 min-h-20 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100"
            value={state.customSituation}
            onChange={(event) => update({ customSituation: event.target.value })}
            placeholder="예: 고객 반응은 있는데 다음 행동으로 이어지지 않아 팀원들과 무엇을 확인해야 할지 고민입니다."
          />
        </label>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700">1차 실험</p>
        <h3 className="mt-1 text-xl font-black text-slate-950">일반적인 질문만 복사해 AI 결과를 받아봅니다</h3>
        <label className="mt-4 block">
          <span className="text-sm font-black text-slate-800">선택한 보기에서 자동 생성된 일반적인 질문</span>
          <textarea
            className="mt-2 min-h-20 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
            value={state.generalQuestion}
            onChange={(event) => update({ generalQuestion: event.target.value })}
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => copyText(state.generalQuestion)} className="rounded-2xl bg-cyan-700 px-4 py-3 text-sm font-black text-white">
            일반적인 질문만 복사하기
          </button>
          <span className="rounded-2xl bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-600">
            한 줄짜리 일반 질문만 복사합니다. 기준이나 출력 형식은 일부러 넣지 않습니다.
          </span>
        </div>
        <label className="mt-4 block">
          <span className="text-sm font-black text-slate-800">일반적인 질문 결과 붙여넣기</span>
          <textarea
            className="mt-2 min-h-36 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
            value={state.generalAiResult}
            onChange={(event) => update({ generalAiResult: event.target.value })}
            placeholder="일반적인 질문으로 생성된 AI 답변을 여기에 붙여넣으세요."
          />
        </label>
        <div className="mt-4">
          <ReviewChecklist flags={state.generalChecks} onChange={(key, checked) => update({ generalChecks: { ...state.generalChecks, [key]: checked } })} />
        </div>
        <div className="mt-4 rounded-2xl border border-cyan-100 bg-cyan-50 p-4 text-sm font-bold leading-6 text-cyan-950">
          일반 질문 결과 체크: {generalCheckedCount} / {CHECKS.length}개 · 부족한 항목이 다음 프롬프트에서 보완되어야 합니다.
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-200 bg-white p-4 shadow-sm md:p-5">
        <p className="text-xs font-black uppercase tracking-wide text-emerald-700">2차 실험</p>
        <h3 className="mt-1 text-xl font-black text-slate-950">같은 장면을 정리된 프롬프트로 다시 요청합니다</h3>
        <label className="mt-4 block">
          <span className="text-sm font-black text-slate-800">정리된 프롬프트</span>
          <textarea
            className="mt-2 min-h-56 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            value={structuredPrompt}
            readOnly
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => copyText(structuredPrompt)} className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white">
            정리된 프롬프트 복사하기
          </button>
          <span className="rounded-2xl bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-900">
            같은 상황이라도 역할, 맥락, 출력 형식, 안전선을 넣으면 결과가 어떻게 달라지는지 비교합니다.
          </span>
        </div>
        <label className="mt-4 block">
          <span className="text-sm font-black text-slate-800">프롬프트 결과 붙여넣기</span>
          <textarea
            className="mt-2 min-h-36 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            value={state.structuredAiResult}
            onChange={(event) => update({ structuredAiResult: event.target.value })}
            placeholder="정리된 프롬프트로 생성된 AI 답변을 여기에 붙여넣으세요."
          />
        </label>
        <div className="mt-4">
          <ReviewChecklist flags={state.structuredChecks} onChange={(key, checked) => update({ structuredChecks: { ...state.structuredChecks, [key]: checked } })} />
        </div>
        <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-bold leading-6 text-emerald-950">
          정리된 프롬프트 결과 체크: {structuredCheckedCount} / {CHECKS.length}개 · 일반 질문 결과와 비교해 무엇이 좋아졌는지 확인합니다.
        </div>
        <label className="mt-4 block">
          <span className="text-sm font-black text-slate-800">비교 메모</span>
          <textarea
            className="mt-2 min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            value={state.comparisonMemo}
            onChange={(event) => update({ comparisonMemo: event.target.value })}
            placeholder="예: 일반 질문은 조언이 넓었고, 정리된 프롬프트는 팀장 질문과 2주 실행 기준이 더 분명했다."
          />
        </label>
      </section>
    </section>
  );
}
