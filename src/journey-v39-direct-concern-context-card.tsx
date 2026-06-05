const V39_PROMPT_PRACTICE_STORAGE_KEY = 'ckd.v39.promptPractice.v1';

const V39_DIRECT_CONCERN_CONTEXT_CARD_SMOKE_MARKERS = [
  'V39DirectConcernContextCard',
  '3단계 직접 입력 고민 우선 반영',
  '직접 입력한 고민을 이번 단계의 기준 맥락으로 사용합니다',
].join('|');
void V39_DIRECT_CONCERN_CONTEXT_CARD_SMOKE_MARKERS;

type DirectConcernMode = 'research' | 'metric' | 'customerData';

type StoredPromptPractice = {
  customConcern?: string;
  plainQuestion?: string;
  context?: string;
  task?: string;
  finalPrompt?: string;
};

function loadPromptPractice(): StoredPromptPractice | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(V39_PROMPT_PRACTICE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredPromptPractice;
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function getModeLabel(mode: DirectConcernMode) {
  if (mode === 'research') return '4단계 리서치 질문';
  if (mode === 'metric') return '5단계 관리 지표';
  return '6단계 고객 Data 확인 List';
}

function getModeAction(mode: DirectConcernMode) {
  if (mode === 'research') return '직접 입력한 고민을 공개자료 탐색과 변화 신호 질문으로 좁힙니다.';
  if (mode === 'metric') return '직접 입력한 고민을 이번 2주 동안 볼 관리 지표 후보로 바꿉니다.';
  return '직접 입력한 고민을 고객 Data에서 확인할 기회 신호, 주의 신호, 부족 정보, 추가 확인 질문으로 나눕니다.';
}

export function V39DirectConcernContextCard({ mode }: { mode: DirectConcernMode }) {
  const result = loadPromptPractice();
  const directConcern = result?.customConcern?.trim();

  if (!directConcern) return null;

  return (
    <section className="rounded-3xl border border-indigo-100 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-indigo-700">3단계 직접 입력 고민 우선 반영</p>
      <h2 className="mt-1 text-lg font-black text-slate-950">직접 입력한 고민을 이번 단계의 기준 맥락으로 사용합니다</h2>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs font-bold leading-5 text-indigo-950">
          <p className="font-black">직접 입력한 우리 팀 고민</p>
          <p className="mt-1 whitespace-pre-wrap">{directConcern}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          <p className="font-black text-slate-950">이번 단계 연결</p>
          <p className="mt-1">{getModeLabel(mode)}</p>
          <p className="mt-2">{getModeAction(mode)}</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
          <p className="font-black">참고할 구조화 질문</p>
          <p className="mt-1 whitespace-pre-wrap">{result?.task?.trim() || result?.plainQuestion?.trim() || '3단계에서 작성한 구조화 질문을 참고해 다음 단계 입력을 이어갑니다.'}</p>
        </div>
      </div>
    </section>
  );
}
