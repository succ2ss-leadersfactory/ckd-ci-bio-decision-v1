import { useMemo, useState } from 'react';
import { useStored } from './journey-storage';

const V39_PROMPT_PRACTICE_STORAGE_KEY = 'ckd.v39.promptPractice.v1';

const V39_PROMPT_PRACTICE_OPTIMIZED_SMOKE_MARKERS = [
  'V39PromptPracticeOptimizedLab',
  '우리 팀 고민을 AI가 알아듣는 질문으로 바꾸기',
  '일반 질문과 구조화 질문의 차이',
  '역할·맥락·요청·출력 형식',
  '4단계 AI 전략 리서치로 넘길 질문',
  '영업활동 기록',
  '방문·면담 기록',
  '고객 활동 Data',
  '사내 영업활동 시스템',
  '관리 지표 → 고객 Data 확인 List → 고객군별 2주 대응 방향 → 코칭 대상 선정',
  '코칭 대상 선정 → 실행 대화 → 2주 실행계획',
  '실제 고객명, 병원명, 의료진명, 제품명, 내부 수치, 개인정보는 넣지 않습니다',
].join('|');
void V39_PROMPT_PRACTICE_OPTIMIZED_SMOKE_MARKERS;

type ConcernId = 'follow-up-gap' | 'record-blindspot' | 'customer-signal' | 'execution-temperature' | 'ai-boundary' | 'custom';

type PromptPracticeResponse = {
  concernId: ConcernId | '';
  customConcern: string;
  plainQuestion: string;
  roleText: string;
  context: string;
  task: string;
  format: string;
  finalPrompt: string;
  copiedPrompt: string;
  savedAt: string;
};

type ConcernOption = {
  id: ConcernId;
  group: string;
  label: string;
  situationSummary: string;
  plainQuestion: string;
  context: string;
  task: string;
  downstreamHint: string;
};

const DEFAULT_RESPONSE: PromptPracticeResponse = {
  concernId: '',
  customConcern: '',
  plainQuestion: '',
  roleText: '제약영업 현장을 오래 해본 선배 영업팀장 입장에서 봐주세요.',
  context: '',
  task: '',
  format: '1. 왜 이런 일이 생기는지\n2. 팀장이 먼저 확인할 것\n3. 이번 2주 동안 볼 지표 후보\n4. 섣불리 판단하면 안 되는 부분\n5. 팀 회의에서 꺼낼 첫 문장',
  finalPrompt: '',
  copiedPrompt: '',
  savedAt: '',
};

const CONCERN_OPTIONS: ConcernOption[] = [
  {
    id: 'follow-up-gap',
    group: '방문 이후가 흐릿한 상황',
    label: '방문은 하는데 다음 대화나 후속조치로 잘 이어지지 않는다',
    situationSummary: '방문은 꾸준히 하는데, 고객 질문이나 다음 약속, 자료 요청 대응으로 이어지는 경우가 적습니다.',
    plainQuestion: '방문은 하고 있는데 후속조치가 잘 이어지지 않습니다. 어떻게 해야 하나요?',
    context: '우리 팀은 고객 방문과 접촉 활동은 꾸준히 하고 있지만, 방문 이후 다음 대화, 자료 요청 대응, 후속 일정 확인으로 이어지는 비율은 낮습니다. 팀원들도 방문 이후 무엇을 남겨야 하는지 기준이 다릅니다.',
    task: '이 상황에서 팀장이 먼저 확인해야 할 원인과, 이번 2주 동안 볼 만한 관리 지표 후보를 정리해 주세요. 단순 활동량보다 후속 행동과 고객 대화의 질을 볼 수 있는 기준을 포함해 주세요.',
    downstreamHint: '볼 지표 정하기 → 고객 기록 보기 → 2주 방향 잡기 → 1on1 대상 고르기',
  },
  {
    id: 'record-blindspot',
    group: '기록은 있는데 읽기 어려운 상황',
    label: '영업활동 기록은 남기지만 고객 반응과 다음 행동이 잘 보이지 않는다',
    situationSummary: '방문·면담 기록은 남아 있지만 고객이 무엇에 반응했는지, 다음에 무엇을 확인해야 하는지가 흐릿합니다.',
    plainQuestion: '영업활동 기록은 있는데 고객 반응과 다음 행동이 잘 보이지 않습니다. 어떻게 정리하면 좋을까요?',
    context: '우리 팀은 사내 영업활동 시스템에 방문·면담 내용이 남아 있지만, 고객 질문, 자료 요청, 다음 접점, 후속조치가 멈춘 이유는 팀원마다 다르게 적고 있습니다.',
    task: '영업활동 기록과 고객 활동 Data에서 팀장이 꼭 봐야 할 항목을 정리해 주세요. 고객 반응, 다음 행동, 부족한 정보, 조심할 해석을 구분해 이번 2주 관리 기준으로 바꿔 주세요.',
    downstreamHint: '볼 지표 정하기 → 고객 기록 보기 → 2주 방향 잡기 → 1on1 대상 고르기',
  },
  {
    id: 'customer-signal',
    group: '고객 반응 해석이 애매한 상황',
    label: '고객이 관심을 보인 것 같은데 어떤 신호를 기회로 봐야 할지 애매하다',
    situationSummary: '고객 질문이나 자료 요청이 있었지만, 이것을 실제 기회로 봐도 되는지 판단이 어렵습니다.',
    plainQuestion: '고객 반응 중 어떤 것을 기회 신호로 봐야 할지 잘 모르겠습니다.',
    context: '일부 고객은 질문이 늘고 자료를 요청하지만, 이것이 실제 다음 대화로 이어질 수 있는 신호인지 단순 관심인지 판단이 어렵습니다. 팀원들도 같은 반응을 다르게 해석합니다.',
    task: '고객 반응을 기회 신호, 주의 신호, 아직 부족한 정보로 나누는 기준을 정리해 주세요. 고객을 평가하거나 등급화하지 않고, 다음에 확인할 질문 중심으로 정리해 주세요.',
    downstreamHint: '고객 기록 보기 → 2주 방향 잡기 → 안전한 다음 질문 정하기',
  },
  {
    id: 'execution-temperature',
    group: '팀원마다 받아들이는 온도가 다른 상황',
    label: '저연차 팀원과 기존 팀원의 실행 온도차가 크다',
    situationSummary: '저연차 팀원은 기준과 이유를 알고 싶어 하고, 기존 팀원은 새로운 기준을 부담스럽게 느낍니다.',
    plainQuestion: '저연차 팀원과 기존 팀원의 실행 온도차를 어떻게 다뤄야 할까요?',
    context: '저연차 팀원은 고객 활동 Data를 보고도 무엇을 먼저 해야 할지 몰라 움직임이 느립니다. 기존 팀원은 새로운 기준이 번거롭다고 느끼며, 같은 실행계획도 팀원마다 받아들이는 온도가 다릅니다.',
    task: '팀장이 먼저 1on1로 맞춰볼 대상과 코칭 초점을 판단할 때 확인해야 할 신호를 정리해 주세요. 대화문은 만들지 말고, 실행 대화로 넘어가기 전 판단 기준까지만 정리해 주세요.',
    downstreamHint: '1on1 대상 고르기 → 첫 대화 준비 → 2주 실행 메모',
  },
  {
    id: 'ai-boundary',
    group: 'AI에 어디까지 물어볼지 조심스러운 상황',
    label: 'AI로 실행계획을 만들 수는 있을 것 같은데 어디까지 물어봐도 되는지 불안하다',
    situationSummary: 'AI를 쓰면 회의 문장이나 실행계획 초안을 빨리 만들 수 있지만 민감정보와 표현 안전선이 걱정됩니다.',
    plainQuestion: 'AI에게 어디까지 물어봐도 되는지 모르겠습니다.',
    context: 'AI를 활용해 2주 실행계획, 회의 설명 문장, 점검 질문을 만들고 싶지만 실제 고객명, 병원명, 의료진명, 제품명, 내부 수치, 개인정보가 들어갈까 봐 조심스럽습니다.',
    task: 'AI에게 물어봐도 되는 범위와 피해야 할 정보를 구분하고, 안전한 실행계획 초안 요청 기준을 정리해 주세요.',
    downstreamHint: 'AI 질문 묶기 → 표현 다시 보기 → 안전한 실행 메모',
  },
];

function findConcern(id: ConcernId | '') {
  return CONCERN_OPTIONS.find((item) => item.id === id);
}

function buildFinalPrompt(response: PromptPracticeResponse) {
  return [
    response.roleText || DEFAULT_RESPONSE.roleText,
    '',
    '[상황]',
    response.customConcern || response.context || '우리 팀의 제약영업 실행 고민을 정리하고 있습니다.',
    '',
    '[부탁할 일]',
    response.task || '팀장이 확인해야 할 원인과 이번 2주 동안 볼 관리 기준을 정리해 주세요.',
    '',
    '[받고 싶은 형태]',
    response.format || DEFAULT_RESPONSE.format,
    '',
    '[주의할 점]',
    '- 실제 고객명, 병원명, 의료진명, 제품명, 내부 수치, 개인정보는 넣지 않습니다.',
    '- 고객을 평가하거나 등급화하지 않습니다.',
    '- 팀원을 성격이나 세대로 단정하지 않습니다.',
    '- AI는 답을 대신 정하지 않고, 팀장의 판단을 정리하고 넓히는 도구로 사용합니다.',
  ].join('\n');
}

function OptionButton({ option, selected, onClick }: { option: ConcernOption; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`rounded-2xl border p-4 text-left shadow-sm ${selected ? 'border-violet-300 bg-violet-50 text-violet-950' : 'bg-white text-slate-700'}`}>
      <p className="text-xs font-black text-violet-700">{option.group}</p>
      <p className="mt-1 text-sm font-black text-slate-950">{option.label}</p>
      <p className="mt-2 text-xs font-bold leading-5 text-slate-600">{option.situationSummary}</p>
      <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-[11px] font-bold leading-5 text-slate-600">다음에 이어질 흐름: {option.downstreamHint}</p>
    </button>
  );
}

export function V39PromptPracticeOptimizedLab() {
  const [response, setResponse] = useStored<PromptPracticeResponse>(V39_PROMPT_PRACTICE_STORAGE_KEY, DEFAULT_RESPONSE);
  const [copied, setCopied] = useState(false);
  const selectedConcern = findConcern(response.concernId);
  const finalPrompt = useMemo(() => buildFinalPrompt(response), [response]);

  const persist = (patch: Partial<PromptPracticeResponse>) => {
    setResponse((current) => ({ ...current, ...patch, savedAt: new Date().toISOString() }));
  };

  const selectConcern = (id: ConcernId) => {
    const concern = findConcern(id);
    if (!concern) return;
    persist({
      concernId: id,
      customConcern: '',
      plainQuestion: concern.plainQuestion,
      context: concern.context,
      task: concern.task,
      finalPrompt: buildFinalPrompt({ ...response, concernId: id, customConcern: '', plainQuestion: concern.plainQuestion, context: concern.context, task: concern.task }),
    });
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(finalPrompt);
      persist({ finalPrompt, copiedPrompt: finalPrompt });
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-violet-100 bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-violet-700">먼저 고르기</p>
        <h3 className="text-xl font-black text-slate-950">우리 팀에서 제일 걸리는 장면을 하나 고릅니다</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">AI에게 바로 답을 묻기 전에, 지금 우리 팀에서 가장 신경 쓰이는 장면을 먼저 고릅니다. 여기서 고른 고민이 뒤에서 볼 지표, 고객 기록, 2주 행동 방향, 1on1 대상까지 이어집니다.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {CONCERN_OPTIONS.map((option) => <OptionButton key={option.id} option={option} selected={response.concernId === option.id} onClick={() => selectConcern(option.id)} />)}
        </div>
        <label className="mt-4 block space-y-1">
          <span className="text-xs font-black text-slate-500">목록에 없으면 직접 적어도 됩니다</span>
          <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={response.customConcern} onChange={(event) => persist({ concernId: 'custom', customConcern: event.target.value, context: event.target.value })} placeholder="예: 고객 반응은 있는데 다음 행동으로 이어지지 않아 팀원들과 무엇을 확인해야 할지 고민입니다." />
        </label>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">질문 비교</p>
        <h3 className="text-xl font-black text-slate-950">막연한 질문과 쓸 만한 질문은 다릅니다</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-bold leading-6 text-rose-950">
            <p className="font-black">막연한 질문</p>
            <p className="mt-2">{response.plainQuestion || selectedConcern?.plainQuestion || '우리 팀 실행 고민을 어떻게 해결하면 좋을까요?'}</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-bold leading-6 text-emerald-950">
            <p className="font-black">쓸 만한 질문</p>
            <p className="mt-2">누구 관점에서 볼지, 우리 팀 상황은 어떤지, 무엇을 정리해 달라는지, 어떤 형태로 받고 싶은지를 함께 적습니다.</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-sky-700">질문 만들기</p>
        <h3 className="text-xl font-black text-slate-950">AI에게 넘길 말을 필요한 만큼만 채웁니다</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="space-y-1"><span className="text-xs font-black text-slate-500">어떤 관점으로 봐 달라고 할까요?</span><textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={response.roleText} onChange={(event) => persist({ roleText: event.target.value })} /></label>
          <label className="space-y-1"><span className="text-xs font-black text-slate-500">우리 팀 상황은 어떤가요?</span><textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={response.context} onChange={(event) => persist({ context: event.target.value })} /></label>
          <label className="space-y-1"><span className="text-xs font-black text-slate-500">무엇을 정리해 달라고 할까요?</span><textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={response.task} onChange={(event) => persist({ task: event.target.value })} /></label>
          <label className="space-y-1"><span className="text-xs font-black text-slate-500">어떤 모양으로 받고 싶나요?</span><textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={response.format} onChange={(event) => persist({ format: event.target.value })} /></label>
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-emerald-700">복사해서 쓰기</p>
        <h3 className="text-xl font-black text-slate-950">다음 화면에서 쓸 질문을 준비합니다</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">아래 문장을 복사해 AI 도구에 붙여넣습니다. 답이 나오면 그대로 믿지 말고, 다음 화면에서 우리 팀 지표와 고객 기록 기준으로 다시 줄여 봅니다.</p>
        <div className="mt-3 flex flex-wrap gap-2"><button type="button" className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white" onClick={copyPrompt}>{copied ? '복사 완료' : '질문 복사하기'}</button></div>
        <textarea className="mt-4 min-h-80 w-full rounded-2xl border bg-slate-50 px-4 py-3 font-mono text-xs leading-6 text-slate-900" value={finalPrompt} readOnly />
      </section>

      <section className="rounded-3xl border border-amber-100 bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-950">
        <p className="font-black">넣지 말아야 할 말</p>
        <p className="mt-1">실제 고객명, 병원명, 의료진명, 제품명, 내부 수치, 개인정보는 넣지 않습니다. 고객을 평가하거나 등급화하지 않고, 팀원을 성격이나 세대로 단정하지 않습니다.</p>
      </section>
    </section>
  );
}
