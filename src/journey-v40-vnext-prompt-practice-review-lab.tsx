import { useStored } from './journey-storage';

const V40_VNEXT_PROMPT_REVIEW_MARKERS = [
  'V40VNextPromptPracticeReviewLab',
  '일반적인 질문',
  '일반적인 질문 복사하기',
  'AI 결과 붙여넣기',
  '구체성',
  '맥락 반영',
  '실행 가능성',
  '리더의 언어',
  '사실 검증 가능성',
  'ckd.v40-vnext.promptPracticeReview.v1',
].join('|');
void V40_VNEXT_PROMPT_REVIEW_MARKERS;

type PromptReviewState = {
  generalQuestion: string;
  aiResult: string;
  specificity: boolean;
  contextFit: boolean;
  actionability: boolean;
  leaderLanguage: boolean;
  factCheckable: boolean;
  revisionMemo: string;
};

const STORAGE_KEY = 'ckd.v40-vnext.promptPracticeReview.v1';

const DEFAULT_STATE: PromptReviewState = {
  generalQuestion: '고객 반응 중 어떤 것을 기회 신호로 봐야 할지 잘 모르겠습니다.',
  aiResult: '',
  specificity: false,
  contextFit: false,
  actionability: false,
  leaderLanguage: false,
  factCheckable: false,
  revisionMemo: '',
};

const CHECKS = [
  { key: 'specificity', label: '구체성', help: '추상적 조언이 아니라 무엇을 봐야 하는지 구체적으로 제시되었는가?' },
  { key: 'contextFit', label: '맥락 반영', help: 'C1바이오 영업팀장, 팀원 실행 신호, 고객 접점 맥락이 반영되었는가?' },
  { key: 'actionability', label: '실행 가능성', help: '바로 다음 행동, 확인 질문, 2주 실행 기준으로 옮길 수 있는가?' },
  { key: 'leaderLanguage', label: '리더의 언어', help: '팀장이 팀원에게 설명하거나 질문할 수 있는 말로 바뀌었는가?' },
  { key: 'factCheckable', label: '사실 검증 가능성', help: '추정·단정이 아니라 기록, 질문, 행동으로 확인 가능한가?' },
] as const;

function buildAiPrompt(question: string) {
  return [
    '나는 C1바이오 영업팀장 이대호 팀장 역할로 리더십 실습을 하고 있습니다.',
    '아래 질문은 아직 일반적인 질문입니다. 이 질문에 답해 주세요.',
    '',
    `[일반적인 질문]\n${question}`,
    '',
    '답변할 때 다음 기준을 지켜 주세요.',
    '1. 고객명, 병원명, 제품명, 실제 수치, 개인정보는 사용하지 않습니다.',
    '2. 고객 의도나 평가를 단정하지 말고, 확인 가능한 행동과 기록 중심으로 설명합니다.',
    '3. C1바이오 영업팀장 입장에서 바로 볼 수 있는 실행 신호를 정리합니다.',
    '4. 다음 2주 동안 확인할 질문과 행동 기준을 제안합니다.',
    '5. 팀원에게 말할 수 있는 리더의 언어로 정리합니다.',
  ].join('\n');
}

export function V40VNextPromptPracticeReviewLab() {
  const [state, setState] = useStored<PromptReviewState>(STORAGE_KEY, DEFAULT_STATE);
  const update = (patch: Partial<PromptReviewState>) => setState({ ...state, ...patch });
  const promptText = buildAiPrompt(state.generalQuestion);
  const checkedCount = CHECKS.filter((check) => Boolean(state[check.key])).length;

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
    } catch {
      window.prompt('아래 내용을 복사해 AI에 붙여넣으세요.', promptText);
    }
  };

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700">질문 비교</p>
        <h3 className="mt-1 text-xl font-black text-slate-950">일반적인 질문도 AI 결과를 먼저 받아본 뒤 점검합니다</h3>
        <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-black text-slate-950">일반적인 질문</p>
          <textarea
            className="mt-3 min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
            value={state.generalQuestion}
            onChange={(event) => update({ generalQuestion: event.target.value })}
            placeholder="예: 고객 반응 중 어떤 것을 기회 신호로 봐야 할지 잘 모르겠습니다."
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={copyPrompt} className="rounded-2xl bg-cyan-700 px-4 py-3 text-sm font-black text-white">
              일반적인 질문 복사하기
            </button>
            <span className="rounded-2xl bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-900">
              복사한 질문을 AI에 붙여넣고, 생성된 답변을 아래에 붙여넣습니다.
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700">AI 결과 점검</p>
        <h3 className="mt-1 text-xl font-black text-slate-950">생성 결과가 현장에서 쓸 수 있는지 확인합니다</h3>
        <label className="mt-4 block">
          <span className="text-sm font-black text-slate-800">AI 결과 붙여넣기</span>
          <textarea
            className="mt-2 min-h-44 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
            value={state.aiResult}
            onChange={(event) => update({ aiResult: event.target.value })}
            placeholder="AI가 생성한 답변을 여기에 붙여넣으세요."
          />
        </label>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {CHECKS.map((check) => (
            <label key={check.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-2">
                <input
                  className="mt-1"
                  type="checkbox"
                  checked={Boolean(state[check.key])}
                  onChange={(event) => update({ [check.key]: event.target.checked } as Partial<PromptReviewState>)}
                />
                <span className="text-sm font-black text-slate-950">{check.label}</span>
              </div>
              <p className="mt-2 text-xs font-bold leading-5 text-slate-500">{check.help}</p>
            </label>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-cyan-100 bg-cyan-50 p-4 text-sm font-bold leading-6 text-cyan-950">
          현재 체크: {checkedCount} / {CHECKS.length}개 · 3개 미만이면 그대로 쓰지 말고 질문이나 답변을 다시 다듬습니다.
        </div>
        <label className="mt-4 block">
          <span className="text-sm font-black text-slate-800">다시 다듬을 점</span>
          <textarea
            className="mt-2 min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
            value={state.revisionMemo}
            onChange={(event) => update({ revisionMemo: event.target.value })}
            placeholder="예: 고객 의도를 단정한 표현을 줄이고, 팀원이 실제로 확인할 질문 중심으로 다시 요청한다."
          />
        </label>
      </section>
    </section>
  );
}
