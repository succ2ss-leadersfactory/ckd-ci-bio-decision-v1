import { useMemo } from 'react';
import { useStored } from './journey-storage';

const V41_PROMPT_REVIEW_MARKERS = [
  'V41PromptPracticeReviewLab',
  'v41 prompt practice lab cloned',
  'v41 prompt practice scenario redesign',
  '김박사 추천 AI 프롬프팅',
  '역할',
  '상황/맥락',
  '과제/요청',
  '출력형식',
  '제약/조건',
  'ckd.v41.promptPracticeReview.v2',
].join('|');
void V41_PROMPT_REVIEW_MARKERS;

type Situation = {
  id: string;
  tag: string;
  title: string;
  scene: string;
  basicQuestions: string[];
  modelPrompt: string;
};

type PromptState = {
  selectedId: string;
  selectedQuestion: string;
  basicAiResult: string;
  modelAiResult: string;
  memo: string;
};

const STORAGE_KEY = 'ckd.v41.promptPracticeReview.v2';

const SITUATIONS: Situation[] = [
  {
    id: 'record-next-action',
    tag: '방문 기록',
    title: '기록은 있는데 다음 행동이 보이지 않는다',
    scene: '이대호 팀장이 CRM을 열어 보니 방문 기록은 꽤 많습니다. 그런데 고객이 무엇에 반응했는지, 다음에 무엇을 확인해야 하는지는 잘 보이지 않습니다.',
    basicQuestions: [
      '영업활동 기록을 잘 쓰게 하려면 어떻게 해야 하나요?',
      '고객 반응과 다음 행동을 잘 남기게 하는 방법을 알려줘.',
      '팀원들이 방문 기록을 더 잘 쓰게 하려면 어떻게 말해야 하나요?',
    ],
    modelPrompt: ['역할: 당신은 제약영업팀장의 업무 정리를 돕는 코치입니다.','상황/맥락: 팀원들의 방문 기록은 남아 있지만 고객 반응과 다음 행동이 잘 보이지 않습니다. 팀장은 기록을 더 길게 쓰게 하고 싶은 것이 아니라, 다음 방문으로 이어지는 기록을 만들고 싶습니다.','과제/요청: 1) 부족한 기록의 특징을 3가지로 정리해 주세요. 2) 팀원에게 안내할 기록 기준을 짧은 문장으로 만들어 주세요. 3) 다음 회의에서 바로 말할 수 있는 팀장 멘트 2개를 제안해 주세요.','출력형식: 문제 징후 / 기록 기준 / 팀장 멘트 / 다음 확인 질문 순서로 써 주세요.','제약/조건: 실제 병원명, 의료진명, 고객명, 제품명은 쓰지 말고 익명 표현으로 작성해 주세요. 팀원이 방어적으로 느끼지 않게 말투를 부드럽게 해 주세요.'].join('\n'),
  },
  {
    id: 'followup-delay',
    tag: '후속 확인',
    title: '자료는 보냈는데 그다음 확인이 늦어진다',
    scene: '고객 요청 자료는 보냈지만 이후 확인 전화나 다음 방문 약속이 늦어집니다. 팀원들은 바빠서 놓쳤다고 말하지만 팀장은 반복되는 패턴이 신경 쓰입니다.',
    basicQuestions: ['Follow-up을 잘하게 하려면 어떻게 해야 하나요?', '자료 보낸 뒤 확인을 잘하게 하는 방법을 알려줘.', '팀원들이 후속 확인을 놓치지 않게 하려면 어떻게 해야 하나요?'],
    modelPrompt: ['역할: 당신은 제약영업팀장의 실행 관리를 돕는 코치입니다.','상황/맥락: 팀원들이 고객 요청 자료는 보내지만, 이후 확인 연락이나 다음 약속으로 이어지는 힘이 약합니다. 팀장은 압박보다 자연스러운 확인 흐름을 만들고 싶습니다.','과제/요청: 1) 후속 확인이 늦어지는 원인을 업무 흐름 관점에서 정리해 주세요. 2) 자료 전달 후 3일 안에 확인할 질문 예시를 만들어 주세요. 3) 팀장이 팀원에게 줄 짧은 업무 기준을 제안해 주세요.','출력형식: 원인 / 확인 질문 / 업무 기준 / 팀장 멘트 순서로 써 주세요.','제약/조건: 고객을 몰아붙이는 표현은 피하고, 제약영업 현장에서 자연스럽게 쓸 수 있는 말로 써 주세요.'].join('\n'),
  },
  {
    id: 'new-member-asks',
    tag: '신입 질문',
    title: '신입 사원이 매번 확인을 받고 움직인다',
    scene: '문교원 사원은 열심히 하지만 작은 문장 하나도 팀장에게 확인받고 싶어 합니다. 이대호 팀장은 도와주고 싶지만 매번 답을 주다 보니 시간이 계속 끊깁니다.',
    basicQuestions: ['신입이 스스로 판단하게 하려면 어떻게 해야 하나요?', '계속 물어보는 팀원에게 어떻게 말해야 하나요?', '신입사원에게 판단력을 키워주려면 어떻게 코칭해야 하나요?'],
    modelPrompt: ['역할: 당신은 제약영업팀장의 1on1 대화를 돕는 코치입니다.','상황/맥락: 신입 사원이 일을 대충 하는 것은 아니지만 작은 판단도 계속 확인받으려 합니다. 팀장은 답을 대신 주기보다 스스로 판단하는 기준을 만들어 주고 싶습니다.','과제/요청: 1) 신입이 계속 확인하는 이유를 가능한 해석 3가지로 나눠 주세요. 2) 팀장이 바로 쓸 수 있는 질문 3개를 만들어 주세요. 3) 다음 1주일 동안 해볼 작은 약속을 제안해 주세요.','출력형식: 가능한 이유 / 팀장 질문 / 1주일 약속 / 피해야 할 말 순서로 써 주세요.','제약/조건: 신입을 탓하는 말투는 피하고, 실제 사무실에서 말할 수 있는 자연스러운 문장으로 써 주세요.'].join('\n'),
  },
  {
    id: 'career-member-alone',
    tag: '경력직 융화',
    title: '성과가 좋은 경력직이 팀과 따로 움직인다',
    scene: '유희관 과장은 성과도 좋고 고객 대응도 빠릅니다. 다만 회의에서 자기 방식이 강하고, 후배들과 같이 움직이는 데는 거리가 있습니다.',
    basicQuestions: ['성과는 좋은데 팀워크가 약한 직원은 어떻게 해야 하나요?', '경력직이 팀에 잘 섞이게 하려면 어떻게 말해야 하나요?', '실적 좋은 직원에게 협업을 어떻게 요구해야 하나요?'],
    modelPrompt: ['역할: 당신은 제약영업팀장의 사람관리 대화를 돕는 코치입니다.','상황/맥락: 경력직 과장은 실력과 실적은 좋지만 팀의 기존 방식이나 후배들의 속도에 답답함을 느끼고, 혼자 처리하려는 모습이 있습니다. 팀장은 성과를 인정하면서도 함께 일하는 방식을 이야기해야 합니다.','과제/요청: 1) 팀장이 먼저 인정해야 할 부분을 정리해 주세요. 2) 협업을 요구할 때 쓸 수 있는 첫 문장 2개를 제안해 주세요. 3) 후배들과 지식을 나누게 하는 작은 행동을 제안해 주세요.','출력형식: 인정할 점 / 대화 첫 문장 / 작은 행동 / 주의할 표현 순서로 써 주세요.','제약/조건: 성과를 깎아내리는 말은 피하고, 경력직의 자존심을 건드리지 않는 표현으로 써 주세요.'].join('\n'),
  },
  {
    id: 'meeting-too-long',
    tag: '회의 운영',
    title: '회의는 길지만 정작 할 일이 정리되지 않는다',
    scene: '주간 회의에서 각자 활동을 길게 말합니다. 그런데 회의가 끝나면 누가 무엇을 언제까지 할지 또렷하지 않습니다.',
    basicQuestions: ['회의를 효율적으로 하려면 어떻게 해야 하나요?', '영업회의에서 실행할 일을 잘 정하려면 어떻게 해야 하나요?', '회의 후 팀원들이 바로 움직이게 하려면 어떻게 해야 하나요?'],
    modelPrompt: ['역할: 당신은 제약영업팀장의 회의 운영을 돕는 코치입니다.','상황/맥락: 회의 시간은 길지만 회의가 끝난 뒤 실행할 일이 또렷하지 않습니다. 팀장은 보고 시간을 줄이고 다음 행동을 분명히 남기고 싶습니다.','과제/요청: 1) 회의에서 줄일 말과 남길 말을 구분해 주세요. 2) 회의 마지막 10분에 확인할 질문 4개를 만들어 주세요. 3) 회의 후 기록 양식을 간단히 제안해 주세요.','출력형식: 줄일 말 / 남길 말 / 마지막 10분 질문 / 회의 후 기록 양식 순서로 써 주세요.','제약/조건: 보고서 문체가 아니라 팀장이 실제 회의에서 말할 수 있는 문장으로 써 주세요.'].join('\n'),
  },
  {
    id: 'mz-feedback',
    tag: 'MZ 피드백',
    title: '젊은 팀원에게 피드백을 어떻게 해야 할지 조심스럽다',
    scene: '박재욱 사원은 빠르게 움직이지만 왜 해야 하는지 납득되지 않으면 표정이 굳습니다. 팀장은 지적처럼 들리지 않게 말하고 싶습니다.',
    basicQuestions: ['MZ세대 팀원에게 피드백을 잘하려면 어떻게 해야 하나요?', '젊은 직원에게 지적처럼 들리지 않게 말하는 법을 알려줘.', '팀원이 납득하게 피드백하려면 어떻게 말해야 하나요?'],
    modelPrompt: ['역할: 당신은 제약영업팀장의 피드백 대화를 돕는 코치입니다.','상황/맥락: 3년차 사원은 빠르게 움직이지만 업무의 이유와 기대 결과가 분명하지 않으면 지시를 단순 업무로 받아들입니다. 팀장은 지적보다 납득을 돕는 방식으로 말하고 싶습니다.','과제/요청: 1) 피드백 전에 먼저 확인할 질문 3개를 만들어 주세요. 2) 팀장이 말할 수 있는 짧은 피드백 문장 3개를 제안해 주세요. 3) 다음 방문 전까지 합의할 작은 행동을 제안해 주세요.','출력형식: 확인 질문 / 피드백 문장 / 작은 행동 / 피해야 할 말 순서로 써 주세요.','제약/조건: 세대 일반화처럼 들리는 표현은 피하고, 한 사람의 업무 행동을 기준으로 말해 주세요.'].join('\n'),
  },
];

const DEFAULT_STATE: PromptState = {
  selectedId: SITUATIONS[0].id,
  selectedQuestion: SITUATIONS[0].basicQuestions[0],
  basicAiResult: '',
  modelAiResult: '',
  memo: '',
};

function selectedSituation(id: string) {
  return SITUATIONS.find((s) => s.id === id) ?? SITUATIONS[0];
}

async function copyText(text: string) {
  try { await navigator.clipboard.writeText(text); }
  catch { window.prompt('아래 내용을 복사해 AI 도구에 붙여넣으세요.', text); }
}

function extractTaskLines(text: string) {
  return text.split('\n').map((line) => line.replace(/^[-*\d.\s]+/, '').trim()).filter((line) => /(확인|정리|제안|작성|나눠|물어|말할|합의|준비|구분)/.test(line)).slice(0, 8);
}

export function V41PromptPracticeReviewLab() {
  const [state, setState] = useStored<PromptState>(STORAGE_KEY, DEFAULT_STATE);
  const situation = selectedSituation(state.selectedId);
  const taskLines = useMemo(() => extractTaskLines(state.modelAiResult), [state.modelAiResult]);
  const selectSituation = (next: Situation) => setState({ ...state, selectedId: next.id, selectedQuestion: next.basicQuestions[0], basicAiResult: '', modelAiResult: '', memo: '' });

  return <section className="space-y-4">
    <section className="rounded-3xl border border-violet-100 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-violet-700">질문 다듬기</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">먼저 제약영업에서 자주 생기는 장면을 고릅니다</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-600">처음부터 멋진 질문을 만들 필요는 없습니다. 우리가 평소 던지는 짧은 질문과, 김박사 방식으로 정리한 프롬프트를 비교해 봅니다.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">{SITUATIONS.map((option) => <button key={option.id} type="button" onClick={() => selectSituation(option)} className={`rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${state.selectedId === option.id ? 'border-violet-300 bg-violet-50 ring-2 ring-violet-100' : 'border-slate-200 bg-white'}`}><p className="text-xs font-black text-violet-700">{option.tag}</p><p className="mt-2 text-base font-black leading-6 text-slate-950">{option.title}</p><p className="mt-2 text-sm font-bold leading-6 text-slate-600">{option.scene}</p></button>)}</div>
    </section>

    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-cyan-700">1차</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">평소 하듯 한 줄로 먼저 물어봅니다</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-3">{situation.basicQuestions.map((question) => <button key={question} type="button" onClick={() => setState({ ...state, selectedQuestion: question, basicAiResult: '' })} className={`rounded-2xl border p-4 text-left text-sm font-bold leading-6 ${state.selectedQuestion === question ? 'border-cyan-300 bg-cyan-50 text-cyan-950' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>{question}</button>)}</div>
      <div className="mt-4 rounded-2xl bg-slate-50 p-4"><p className="text-sm font-black text-slate-700">선택한 한 줄 질문</p><p className="mt-2 text-sm font-bold leading-6 text-slate-900">{state.selectedQuestion}</p><button type="button" onClick={() => copyText(state.selectedQuestion)} className="mt-3 rounded-full bg-cyan-700 px-4 py-2 text-xs font-black text-white">한 줄 질문 복사</button></div>
      <label className="mt-4 block"><span className="text-sm font-black text-slate-800">AI 도구 결과 붙여넣기</span><textarea className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6" value={state.basicAiResult} onChange={(event) => setState({ ...state, basicAiResult: event.target.value })} placeholder="한 줄 질문을 AI 도구에 넣은 뒤 나온 답을 붙여넣으세요." /></label>
    </section>

    <section className="rounded-3xl border border-indigo-100 bg-indigo-50 p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-indigo-700">김박사 추천 AI 프롬프팅</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">질문을 길게 쓰는 것이 아니라, 필요한 칸을 나눠 주는 방식입니다</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-700">AI는 눈치로 우리 상황을 알아듣지 못합니다. 역할, 상황/맥락, 과제/요청, 출력형식, 제약/조건을 나눠 주면 답이 훨씬 현장에 맞게 나옵니다.</p>
      <div className="mt-4 grid gap-2 md:grid-cols-5">{['역할','상황/맥락','과제/요청','출력형식','제약/조건'].map((item) => <div key={item} className="rounded-2xl bg-white p-3 text-center text-sm font-black text-indigo-900">{item}</div>)}</div>
    </section>

    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-emerald-700">2차</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">모범 프롬프트로 다시 물어봅니다</h3>
      <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-sm leading-6 text-slate-50">{situation.modelPrompt}</pre>
      <button type="button" onClick={() => copyText(situation.modelPrompt)} className="mt-3 rounded-full bg-emerald-700 px-4 py-2 text-xs font-black text-white">모범 프롬프트 복사</button>
      <label className="mt-4 block"><span className="text-sm font-black text-slate-800">AI 도구 결과 붙여넣기</span><textarea className="mt-2 min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6" value={state.modelAiResult} onChange={(event) => setState({ ...state, modelAiResult: event.target.value })} placeholder="모범 프롬프트를 AI 도구에 넣은 뒤 나온 답을 붙여넣으세요." /></label>
    </section>

    <section className="rounded-3xl border border-amber-100 bg-amber-50 p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-amber-700">자동 분리</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">붙여넣은 결과에서 과제/요청으로 보이는 문장을 따로 봅니다</h3>
      {taskLines.length ? <ul className="mt-4 space-y-2">{taskLines.map((line, index) => <li key={`${line}-${index}`} className="rounded-2xl bg-white p-3 text-sm font-bold leading-6 text-slate-800">{line}</li>)}</ul> : <p className="mt-3 rounded-2xl bg-white p-3 text-sm font-bold text-slate-500">모범 프롬프트 결과를 붙여넣으면 확인, 정리, 제안, 작성처럼 과제/요청으로 보이는 문장이 여기에 분리됩니다.</p>}
      <label className="mt-4 block"><span className="text-sm font-black text-slate-800">비교 메모</span><textarea className="mt-2 min-h-24 w-full rounded-2xl border border-amber-200 px-4 py-3 text-sm leading-6" value={state.memo} onChange={(event) => setState({ ...state, memo: event.target.value })} placeholder="한 줄 질문과 모범 프롬프트 결과가 어떻게 달랐는지 적어보세요." /></label>
    </section>
  </section>;
}
