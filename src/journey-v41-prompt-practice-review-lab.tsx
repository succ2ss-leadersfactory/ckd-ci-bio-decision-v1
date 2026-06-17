import { useMemo } from 'react';
import { useStored } from './journey-storage';

const V41_PROMPT_REVIEW_MARKERS = [
  'V41PromptPracticeReviewLab',
  'v41 prompt practice lab cloned',
  'v41 prompt practice scenario redesign',
  'v41 prompt five part editable structure',
  'v41 prompt comparison criteria',
  'v41 AI input criteria and caution guide',
  '김박사 추천 AI 프롬프팅',
  '역할',
  '상황/맥락',
  '과제/요청',
  '출력형식',
  '제약/조건',
  '구체성',
  '맥락',
  '실행',
  '팀장 언어',
  '확인 가능',
  '주의해야 할 표현',
  'ckd.v41.promptPracticeReview.v2',
].join('|');
void V41_PROMPT_REVIEW_MARKERS;

type PromptPartKey = 'role' | 'context' | 'task' | 'format' | 'constraint';
type PromptParts = Record<PromptPartKey, string>;
type Situation = { id: string; tag: string; title: string; scene: string; basicQuestions: string[]; modelPrompt: string };
type PromptState = {
  selectedId: string;
  selectedQuestion: string;
  basicAiResult: string;
  modelAiResult: string;
  memo: string;
  promptParts?: Record<string, PromptParts>;
  basicChecks?: string[];
  modelChecks?: string[];
  inputChecks?: string[];
  cautionRewrite?: string;
};

const STORAGE_KEY = 'ckd.v41.promptPracticeReview.v2';
const CRITERIA = [
  { id: 'specific', label: '구체성', question: '무엇을 봐야 하는지 구체적으로 나왔나요?' },
  { id: 'context', label: '맥락', question: '영업팀장, 고객 접점, 팀원 상황이 반영되었나요?' },
  { id: 'action', label: '실행', question: '다음 행동이나 1~2주 안에 옮길 수 있는 일이 있나요?' },
  { id: 'leader-language', label: '팀장 언어', question: '팀원이 들을 수 있는 말로 바뀌었나요?' },
  { id: 'checkable', label: '확인 가능', question: '추정이 아니라 기록·질문·행동으로 확인할 수 있나요?' },
];
const INPUT_CRITERIA = [
  '실제 병원명, 의료진명, 고객명은 뺐나요?',
  '내부 전략이나 민감한 수치는 그대로 넣지 않았나요?',
  '팀원을 평가하거나 단정하는 말로 쓰지 않았나요?',
  'AI가 답해야 할 과제와 출력형식을 분명히 적었나요?',
  'AI 답변을 그대로 쓰지 않고 팀장 말로 다시 고칠 준비가 되었나요?',
];
const CAUTION_GUIDE = [
  ['왜 이렇게 기록이 부실하죠?', '어디가 빠졌는지 같이 한 번 보죠.'],
  ['다음부터 제대로 하세요.', '다음 방문 기록에는 고객 반응과 다음 질문을 하나씩만 넣어봅시다.'],
  ['실행력이 부족합니다.', '다음 행동이 문장으로 연결되면 더 좋겠습니다.'],
  ['고객이 별로 관심 없어 보이네요.', '고객이 어떤 부분에서 멈칫했는지 사실 중심으로 다시 적어볼까요?'],
  ['이건 팀 기준에 안 맞습니다.', '우리 팀 기준으로 보면 어떤 부분을 맞추면 좋을까요?'],
];

const SITUATIONS: Situation[] = [
  { id: 'record-next-action', tag: '방문 기록', title: '기록은 있는데 다음 행동이 보이지 않는다', scene: '이대호 팀장이 CRM을 열어 보니 방문 기록은 꽤 많습니다. 그런데 고객이 무엇에 반응했는지, 다음에 무엇을 확인해야 하는지는 잘 보이지 않습니다.', basicQuestions: ['영업활동 기록을 잘 쓰게 하려면 어떻게 해야 하나요?', '고객 반응과 다음 행동을 잘 남기게 하는 방법을 알려줘.', '팀원들이 방문 기록을 더 잘 쓰게 하려면 어떻게 말해야 하나요?'], modelPrompt: ['역할: 당신은 제약영업팀장의 업무 정리를 돕는 코치입니다.','상황/맥락: 팀원들의 방문 기록은 남아 있지만 고객 반응과 다음 행동이 잘 보이지 않습니다. 팀장은 기록을 더 길게 쓰게 하고 싶은 것이 아니라, 다음 방문으로 이어지는 기록을 만들고 싶습니다.','과제/요청: 1) 부족한 기록의 특징을 3가지로 정리해 주세요. 2) 팀원에게 안내할 기록 기준을 짧은 문장으로 만들어 주세요. 3) 다음 회의에서 바로 말할 수 있는 팀장 멘트 2개를 제안해 주세요.','출력형식: 문제 징후 / 기록 기준 / 팀장 멘트 / 다음 확인 질문 순서로 써 주세요.','제약/조건: 실제 병원명, 의료진명, 고객명, 제품명은 쓰지 말고 익명 표현으로 작성해 주세요. 팀원이 방어적으로 느끼지 않게 말투를 부드럽게 해 주세요.'].join('\n') },
  { id: 'followup-delay', tag: '후속 확인', title: '자료는 보냈는데 그다음 확인이 늦어진다', scene: '고객 요청 자료는 보냈지만 이후 확인 전화나 다음 방문 약속이 늦어집니다. 팀원들은 바빠서 놓쳤다고 말하지만 팀장은 반복되는 패턴이 신경 쓰입니다.', basicQuestions: ['Follow-up을 잘하게 하려면 어떻게 해야 하나요?', '자료 보낸 뒤 확인을 잘하게 하는 방법을 알려줘.', '팀원들이 후속 확인을 놓치지 않게 하려면 어떻게 해야 하나요?'], modelPrompt: ['역할: 당신은 제약영업팀장의 실행 관리를 돕는 코치입니다.','상황/맥락: 팀원들이 고객 요청 자료는 보내지만, 이후 확인 연락이나 다음 약속으로 이어지는 힘이 약합니다. 팀장은 압박보다 자연스러운 확인 흐름을 만들고 싶습니다.','과제/요청: 1) 후속 확인이 늦어지는 원인을 업무 흐름 관점에서 정리해 주세요. 2) 자료 전달 후 3일 안에 확인할 질문 예시를 만들어 주세요. 3) 팀장이 팀원에게 줄 짧은 업무 기준을 제안해 주세요.','출력형식: 원인 / 확인 질문 / 업무 기준 / 팀장 멘트 순서로 써 주세요.','제약/조건: 고객을 몰아붙이는 표현은 피하고, 제약영업 현장에서 자연스럽게 쓸 수 있는 말로 써 주세요.'].join('\n') },
  { id: 'new-member-asks', tag: '신입 질문', title: '신입 사원이 매번 확인을 받고 움직인다', scene: '문교원 사원은 열심히 하지만 작은 문장 하나도 팀장에게 확인받고 싶어 합니다. 이대호 팀장은 도와주고 싶지만 매번 답을 주다 보니 시간이 계속 끊깁니다.', basicQuestions: ['신입이 스스로 판단하게 하려면 어떻게 해야 하나요?', '계속 물어보는 팀원에게 어떻게 말해야 하나요?', '신입사원에게 판단력을 키워주려면 어떻게 코칭해야 하나요?'], modelPrompt: ['역할: 당신은 제약영업팀장의 1on1 대화를 돕는 코치입니다.','상황/맥락: 신입 사원이 일을 대충 하는 것은 아니지만 작은 판단도 계속 확인받으려 합니다. 팀장은 답을 대신 주기보다 스스로 판단하는 기준을 만들어 주고 싶습니다.','과제/요청: 1) 신입이 계속 확인하는 이유를 가능한 해석 3가지로 나눠 주세요. 2) 팀장이 바로 쓸 수 있는 질문 3개를 만들어 주세요. 3) 다음 1주일 동안 해볼 작은 약속을 제안해 주세요.','출력형식: 가능한 이유 / 팀장 질문 / 1주일 약속 / 피해야 할 말 순서로 써 주세요.','제약/조건: 신입을 탓하는 말투는 피하고, 실제 사무실에서 말할 수 있는 자연스러운 문장으로 써 주세요.'].join('\n') },
  { id: 'career-member-alone', tag: '경력직 융화', title: '성과가 좋은 경력직이 팀과 따로 움직인다', scene: '유희관 과장은 성과도 좋고 고객 대응도 빠릅니다. 다만 회의에서 자기 방식이 강하고, 후배들과 같이 움직이는 데는 거리가 있습니다.', basicQuestions: ['성과는 좋은데 팀워크가 약한 직원은 어떻게 해야 하나요?', '경력직이 팀에 잘 섞이게 하려면 어떻게 말해야 하나요?', '실적 좋은 직원에게 협업을 어떻게 요구해야 하나요?'], modelPrompt: ['역할: 당신은 제약영업팀장의 사람관리 대화를 돕는 코치입니다.','상황/맥락: 경력직 과장은 실력과 실적은 좋지만 팀의 기존 방식이나 후배들의 속도에 답답함을 느끼고, 혼자 처리하려는 모습이 있습니다. 팀장은 성과를 인정하면서도 함께 일하는 방식을 이야기해야 합니다.','과제/요청: 1) 팀장이 먼저 인정해야 할 부분을 정리해 주세요. 2) 협업을 요구할 때 쓸 수 있는 첫 문장 2개를 제안해 주세요. 3) 후배들과 지식을 나누게 하는 작은 행동을 제안해 주세요.','출력형식: 인정할 점 / 대화 첫 문장 / 작은 행동 / 주의할 표현 순서로 써 주세요.','제약/조건: 성과를 깎아내리는 말은 피하고, 경력직의 자존심을 건드리지 않는 표현으로 써 주세요.'].join('\n') },
  { id: 'meeting-too-long', tag: '회의 운영', title: '회의는 길지만 정작 할 일이 정리되지 않는다', scene: '주간 회의에서 각자 활동을 길게 말합니다. 그런데 회의가 끝나면 누가 무엇을 언제까지 할지 또렷하지 않습니다.', basicQuestions: ['회의를 효율적으로 하려면 어떻게 해야 하나요?', '영업회의에서 실행할 일을 잘 정하려면 어떻게 해야 하나요?', '회의 후 팀원들이 바로 움직이게 하려면 어떻게 해야 하나요?'], modelPrompt: ['역할: 당신은 제약영업팀장의 회의 운영을 돕는 코치입니다.','상황/맥락: 회의 시간은 길지만 회의가 끝난 뒤 실행할 일이 또렷하지 않습니다. 팀장은 보고 시간을 줄이고 다음 행동을 분명히 남기고 싶습니다.','과제/요청: 1) 회의에서 줄일 말과 남길 말을 구분해 주세요. 2) 회의 마지막 10분에 확인할 질문 4개를 만들어 주세요. 3) 회의 후 기록 양식을 간단히 제안해 주세요.','출력형식: 줄일 말 / 남길 말 / 마지막 10분 질문 / 회의 후 기록 양식 순서로 써 주세요.','제약/조건: 보고서 문체가 아니라 팀장이 실제 회의에서 말할 수 있는 문장으로 써 주세요.'].join('\n') },
  { id: 'mz-feedback', tag: 'MZ 피드백', title: '젊은 팀원에게 피드백을 어떻게 해야 할지 조심스럽다', scene: '박재욱 사원은 빠르게 움직이지만 왜 해야 하는지 납득되지 않으면 표정이 굳습니다. 팀장은 지적처럼 들리지 않게 말하고 싶습니다.', basicQuestions: ['MZ세대 팀원에게 피드백을 잘하려면 어떻게 해야 하나요?', '젊은 직원에게 지적처럼 들리지 않게 말하는 법을 알려줘.', '팀원이 납득하게 피드백하려면 어떻게 말해야 하나요?'], modelPrompt: ['역할: 당신은 제약영업팀장의 피드백 대화를 돕는 코치입니다.','상황/맥락: 3년차 사원은 빠르게 움직이지만 업무의 이유와 기대 결과가 분명하지 않으면 지시를 단순 업무로 받아들입니다. 팀장은 지적보다 납득을 돕는 방식으로 말하고 싶습니다.','과제/요청: 1) 피드백 전에 먼저 확인할 질문 3개를 만들어 주세요. 2) 팀장이 말할 수 있는 짧은 피드백 문장 3개를 제안해 주세요. 3) 다음 방문 전까지 합의할 작은 행동을 제안해 주세요.','출력형식: 확인 질문 / 피드백 문장 / 작은 행동 / 피해야 할 말 순서로 써 주세요.','제약/조건: 세대 일반화처럼 들리는 표현은 피하고, 한 사람의 업무 행동을 기준으로 말해 주세요.'].join('\n') },
];

const DEFAULT_STATE: PromptState = { selectedId: SITUATIONS[0].id, selectedQuestion: SITUATIONS[0].basicQuestions[0], basicAiResult: '', modelAiResult: '', memo: '', promptParts: {}, basicChecks: [], modelChecks: [], inputChecks: [], cautionRewrite: '' };
const partLabels: { key: PromptPartKey; label: string; hint: string }[] = [
  { key: 'role', label: '역할', hint: 'AI가 어떤 입장으로 답해야 하는지 정합니다.' },
  { key: 'context', label: '상황/맥락', hint: '누가, 어떤 장면에서, 무엇 때문에 막혔는지 씁니다.' },
  { key: 'task', label: '과제/요청', hint: 'AI가 실제로 해줘야 할 일을 번호로 나눕니다.' },
  { key: 'format', label: '출력형식', hint: '답을 어떤 순서와 모양으로 받을지 정합니다.' },
  { key: 'constraint', label: '제약/조건', hint: '빼야 할 정보와 조심할 말투를 정합니다.' },
];

function selectedSituation(id: string) { return SITUATIONS.find((s) => s.id === id) ?? SITUATIONS[0]; }
async function copyText(text: string) { try { await navigator.clipboard.writeText(text); } catch { window.prompt('아래 내용을 복사해 AI 도구에 붙여넣으세요.', text); } }
function extractTaskLines(text: string) { return text.split('\n').map((line) => line.replace(/^[-*\d.\s]+/, '').trim()).filter((line) => /(확인|정리|제안|작성|나눠|물어|말할|합의|준비|구분)/.test(line)).slice(0, 8); }
function parsePromptParts(prompt: string): PromptParts {
  const parts: PromptParts = { role: '', context: '', task: '', format: '', constraint: '' };
  for (const line of prompt.split('\n')) {
    const [rawLabel, ...rest] = line.split(':');
    const value = rest.join(':').trim();
    if (rawLabel === '역할') parts.role = value;
    if (rawLabel === '상황/맥락') parts.context = value;
    if (rawLabel === '과제/요청') parts.task = value;
    if (rawLabel === '출력형식') parts.format = value;
    if (rawLabel === '제약/조건') parts.constraint = value;
  }
  return parts;
}
function buildPrompt(parts: PromptParts) { return [`역할: ${parts.role}`, `상황/맥락: ${parts.context}`, `과제/요청: ${parts.task}`, `출력형식: ${parts.format}`, `제약/조건: ${parts.constraint}`].join('\n'); }
function toggle(list: string[] | undefined, id: string) { const current = list ?? []; return current.includes(id) ? current.filter((item) => item !== id) : [...current, id]; }
function comparisonSentence(basicCount: number, modelCount: number) {
  if (modelCount > basicCount) return '모범 프롬프트는 상황과 요청이 나뉘어 있어, 팀장이 바로 가져다 쓸 말과 행동이 더 잘 보입니다.';
  if (modelCount === basicCount && modelCount > 0) return '두 답변 모두 쓸 만한 부분이 있습니다. 그래도 모범 프롬프트가 어떤 장면에 쓸 답인지 더 분명한지 확인해 보세요.';
  return '아직 붙여넣은 답변을 기준으로 비교하기 어렵습니다. 결과를 넣고 5가지 기준을 체크해 보세요.';
}

export function V41PromptPracticeReviewLab() {
  const [state, setState] = useStored<PromptState>(STORAGE_KEY, DEFAULT_STATE);
  const situation = selectedSituation(state.selectedId);
  const baseParts = parsePromptParts(situation.modelPrompt);
  const editableParts = state.promptParts?.[situation.id] ?? baseParts;
  const finalPrompt = buildPrompt(editableParts);
  const taskLines = useMemo(() => extractTaskLines(state.modelAiResult), [state.modelAiResult]);
  const basicChecks = state.basicChecks ?? [];
  const modelChecks = state.modelChecks ?? [];
  const inputChecks = state.inputChecks ?? [];
  const selectSituation = (next: Situation) => setState({ ...state, selectedId: next.id, selectedQuestion: next.basicQuestions[0], basicAiResult: '', modelAiResult: '', memo: '', basicChecks: [], modelChecks: [], inputChecks: [] });
  const updatePart = (key: PromptPartKey, value: string) => setState({ ...state, promptParts: { ...(state.promptParts ?? {}), [situation.id]: { ...editableParts, [key]: value } } });

  return <section className="space-y-4">
    <section className="rounded-3xl border border-violet-100 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-violet-700">질문 다듬기</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">질문을 잘하는 팀장은 AI 답도 다르게 받습니다</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-600">같은 상황도 어떻게 묻느냐에 따라 AI 답변의 쓸모가 달라집니다. 먼저 평소처럼 한 줄로 물어보고, 그다음 팀장답게 다시 물어보겠습니다.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">{SITUATIONS.map((option) => <button key={option.id} type="button" onClick={() => selectSituation(option)} className={`rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${state.selectedId === option.id ? 'border-violet-300 bg-violet-50 ring-2 ring-violet-100' : 'border-slate-200 bg-white'}`}><p className="text-xs font-black text-violet-700">{option.tag}</p><p className="mt-2 text-base font-black leading-6 text-slate-950">{option.title}</p><p className="mt-2 text-sm font-bold leading-6 text-slate-600">{option.scene}</p></button>)}</div>
    </section>

    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-cyan-700">1차 · 일반 질문</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">평소 하듯 한 줄로 먼저 물어봅니다</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-600">나쁜 질문은 아닙니다. 다만 상황이 충분히 들어가지 않으면 답변도 평범해집니다.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">{situation.basicQuestions.map((question) => <button key={question} type="button" onClick={() => setState({ ...state, selectedQuestion: question, basicAiResult: '', basicChecks: [] })} className={`rounded-2xl border p-4 text-left text-sm font-bold leading-6 ${state.selectedQuestion === question ? 'border-cyan-300 bg-cyan-50 text-cyan-950' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>{question}</button>)}</div>
      <div className="mt-4 rounded-2xl bg-slate-50 p-4"><p className="text-sm font-black text-slate-700">선택한 한 줄 질문</p><p className="mt-2 text-sm font-bold leading-6 text-slate-900">{state.selectedQuestion}</p><button type="button" onClick={() => copyText(state.selectedQuestion)} className="mt-3 rounded-full bg-cyan-700 px-4 py-2 text-xs font-black text-white">한 줄 질문 복사</button></div>
      <label className="mt-4 block"><span className="text-sm font-black text-slate-800">일반 질문 AI 결과 붙여넣기</span><textarea className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6" value={state.basicAiResult} onChange={(event) => setState({ ...state, basicAiResult: event.target.value })} placeholder="한 줄 질문을 AI 도구에 넣은 뒤 나온 답을 붙여넣으세요." /></label>
    </section>

    <section className="rounded-3xl border border-indigo-100 bg-indigo-50 p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-indigo-700">김박사 추천 AI 프롬프팅</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">질문을 길게 쓰는 것이 아니라, 필요한 칸을 나눠 주는 방식입니다</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-700">AI는 눈치로 우리 상황을 알아듣지 못합니다. 역할, 상황/맥락, 과제/요청, 출력형식, 제약/조건을 나눠 주면 답이 훨씬 현장에 맞게 나옵니다.</p>
      <div className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">{partLabels.map((part) => <div key={part.key} className="grid gap-2 rounded-2xl bg-white p-3 md:grid-cols-[120px_1fr]"><div><p className="text-sm font-black text-indigo-900">{part.label}</p><p className="mt-1 text-xs font-bold leading-5 text-slate-500">{part.hint}</p></div><textarea className="min-h-20 w-full rounded-xl border border-indigo-100 px-3 py-2 text-sm font-bold leading-6 text-slate-800" value={editableParts[part.key]} onChange={(event) => updatePart(part.key, event.target.value)} /></div>)}</div>
        <div className="rounded-2xl bg-slate-950 p-4 text-slate-50"><p className="text-sm font-black text-emerald-300">최종 조합 프롬프트</p><pre className="mt-3 max-h-[520px] overflow-auto whitespace-pre-wrap text-sm leading-6">{finalPrompt}</pre><button type="button" onClick={() => copyText(finalPrompt)} className="mt-4 rounded-full bg-emerald-600 px-4 py-2 text-xs font-black text-white">최종 프롬프트 복사</button></div>
      </div>
      <label className="mt-4 block"><span className="text-sm font-black text-slate-800">모범 프롬프트 AI 결과 붙여넣기</span><textarea className="mt-2 min-h-32 w-full rounded-2xl border border-indigo-200 px-4 py-3 text-sm leading-6" value={state.modelAiResult} onChange={(event) => setState({ ...state, modelAiResult: event.target.value })} placeholder="최종 프롬프트를 AI 도구에 넣은 뒤 나온 답을 붙여넣으세요." /></label>
    </section>

    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">결과 비교</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">두 답변을 같은 기준으로 비교합니다</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-600">중요한 것은 어느 답이 더 길었느냐가 아닙니다. 팀장이 실제로 가져다 쓸 수 있는 답인지 보는 것입니다.</p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {[{ title: '일반 질문 결과', checks: basicChecks, keyName: 'basicChecks' as const, result: state.basicAiResult }, { title: '모범 프롬프트 결과', checks: modelChecks, keyName: 'modelChecks' as const, result: state.modelAiResult }].map((box) => <div key={box.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-center justify-between gap-3"><p className="text-base font-black text-slate-950">{box.title}</p><span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600">체크 {box.checks.length}/5</span></div><p className="mt-2 line-clamp-3 text-xs font-bold leading-5 text-slate-500">{box.result || 'AI 결과를 붙여넣은 뒤 기준을 체크하세요.'}</p><div className="mt-3 grid gap-2">{CRITERIA.map((criterion) => <label key={`${box.title}-${criterion.id}`} className="flex gap-2 rounded-xl bg-white p-3"><input type="checkbox" checked={box.checks.includes(criterion.id)} onChange={() => setState({ ...state, [box.keyName]: toggle(box.checks, criterion.id) })} /><span><b className="text-sm text-slate-900">{criterion.label}</b><br /><span className="text-xs font-bold leading-5 text-slate-500">{criterion.question}</span></span></label>)}</div></div>)}
      </div>
      <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-black leading-6 text-emerald-900">{comparisonSentence(basicChecks.length, modelChecks.length)}</div>
    </section>

    <section className="rounded-3xl border border-amber-100 bg-amber-50 p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-amber-700">자동 분리</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">붙여넣은 결과에서 과제/요청으로 보이는 문장을 따로 봅니다</h3>
      {taskLines.length ? <ul className="mt-4 space-y-2">{taskLines.map((line, index) => <li key={`${line}-${index}`} className="rounded-2xl bg-white p-3 text-sm font-bold leading-6 text-slate-800">{line}</li>)}</ul> : <p className="mt-3 rounded-2xl bg-white p-3 text-sm font-bold text-slate-500">모범 프롬프트 결과를 붙여넣으면 확인, 정리, 제안, 작성처럼 과제/요청으로 보이는 문장이 여기에 분리됩니다.</p>}
      <label className="mt-4 block"><span className="text-sm font-black text-slate-800">비교 메모</span><textarea className="mt-2 min-h-24 w-full rounded-2xl border border-amber-200 px-4 py-3 text-sm leading-6" value={state.memo} onChange={(event) => setState({ ...state, memo: event.target.value })} placeholder="한 줄 질문과 모범 프롬프트 결과가 어떻게 달랐는지 적어보세요." /></label>
    </section>

    <section className="rounded-3xl border border-rose-100 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-rose-700">AI 입력 기준</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">AI에게 넣기 전에 잠깐 멈춰서 확인하세요</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-600">좋은 답을 받으려면 많이 쓰는 것보다, 빼야 할 것을 빼고 필요한 맥락을 넣는 것이 먼저입니다.</p>
      <div className="mt-4 grid gap-2 md:grid-cols-2">{INPUT_CRITERIA.map((item) => <label key={item} className="flex gap-2 rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-950"><input type="checkbox" checked={inputChecks.includes(item)} onChange={() => setState({ ...state, inputChecks: toggle(inputChecks, item) })} />{item}</label>)}</div>
    </section>

    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">주의해야 할 표현</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">맞는 말이어도 그대로 말하면 팀원이 방어적으로 들을 수 있습니다</h3>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200"><div className="grid grid-cols-2 bg-slate-50 text-sm font-black text-slate-700"><div className="p-3">피해야 할 표현</div><div className="p-3">바꿔 쓸 표현</div></div>{CAUTION_GUIDE.map(([bad, good]) => <div key={bad} className="grid grid-cols-2 border-t border-slate-200 text-sm font-bold leading-6"><div className="p-3 text-rose-700">{bad}</div><div className="p-3 text-emerald-800">{good}</div></div>)}</div>
      <label className="mt-4 block"><span className="text-sm font-black text-slate-800">직접 바꿔보기</span><textarea className="mt-2 min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6" value={state.cautionRewrite ?? ''} onChange={(event) => setState({ ...state, cautionRewrite: event.target.value })} placeholder="예: 다음 기록부터는 고객 반응 하나, 다음 확인 질문 하나만 꼭 남겨봅시다." /></label>
    </section>
  </section>;
}
