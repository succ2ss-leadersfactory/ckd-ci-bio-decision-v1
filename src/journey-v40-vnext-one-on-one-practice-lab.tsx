import { useMemo, useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';
import { TEAM_MEMBER_PROFILES, type TeamMemberProfile } from './journey-v39-team-seven-coaching-profiles';

const PEOPLE_STORAGE_KEY = 'ckd.v40-vnext.peopleManagement.v1';

const V40_VNEXT_ONE_ON_ONE_MARKERS = [
  'V40VNextOneOnOnePracticeLab',
  '사람관리 2: 1on1 대화 설계와 실천하기',
  '12단계 운영 잠금: 선택 팀원 다시 보기 → 첫 문장 → 확인 질문 2개 → 팀원 예상 반응 → 리더 재질문 → 2주 행동 합의 → 피해야 할 표현 → AI 스크립트 → 리허설 → 후속 확인',
  '지적이 아니라 확인으로 시작합니다',
  '선택한 팀원 다시 보기',
  '1on1 초점 확인',
  '첫 문장 만들기',
  '확인 질문 2개 만들기',
  '팀원 예상 반응 선택',
  '리더의 재질문 만들기',
  '2주 행동 합의 문장 만들기',
  '피해야 할 표현 고르기',
  'AI에게 1on1 대화 스크립트 초안 요청',
  'AI 초안 붙여넣기',
  '우리 조 언어로 수정',
  '3분 역할극 리허설',
  '관찰자 체크',
  '후속 확인 질문 만들기',
].join('|');
void V40_VNEXT_ONE_ON_ONE_MARKERS;

type PeopleState = {
  selectedMemberId: string;
  observedBehaviors: string[];
  riskyInterpretations: string[];
  oneOnOneFocus: string;
  selectionReason: string;
  firstSentence: string;
  checkQuestionOne: string;
  checkQuestionTwo: string;
  expectedResponse: string;
  leaderFollowUpQuestion: string;
  twoWeekAgreement: string;
  avoidedExpressions: string[];
  aiScriptPrompt: string;
  aiScriptDraft: string;
  revisedOneOnOneScript: string;
  rehearsalChecks: string[];
  observerFeedback: string;
  followUpQuestion: string;
  finalPeopleMemo: string;
};

const DEFAULT_PEOPLE_STATE: PeopleState = {
  selectedMemberId: TEAM_MEMBER_PROFILES[0]?.id ?? 'kim-jaeho',
  observedBehaviors: [],
  riskyInterpretations: [],
  oneOnOneFocus: '',
  selectionReason: '',
  firstSentence: '',
  checkQuestionOne: '',
  checkQuestionTwo: '',
  expectedResponse: '',
  leaderFollowUpQuestion: '',
  twoWeekAgreement: '',
  avoidedExpressions: [],
  aiScriptPrompt: '',
  aiScriptDraft: '',
  revisedOneOnOneScript: '',
  rehearsalChecks: [],
  observerFeedback: '',
  followUpQuestion: '',
  finalPeopleMemo: '',
};

const EXPECTED_RESPONSES = [
  '시간이 부족해서 깊게 정리하지 못했습니다',
  '어디까지 답해도 되는지 애매했습니다',
  '우선순위가 계속 바뀌어서 헷갈렸습니다',
  '기록은 했는데 다음 행동으로 어떻게 바꿔야 할지 몰랐습니다',
  '제가 부족해서 그런 것 같습니다',
  '그럼 기존에 하던 고객군은 줄여도 되는 건가요?',
];

const AVOID_EXPRESSIONS = [
  '왜 이것밖에 못 했습니까?',
  '고객 대응력이 부족한 것 같습니다',
  '다른 사람들은 다 하고 있습니다',
  '책임감을 가져야 합니다',
  '이 정도는 알아서 해야죠',
  '다음부터 제대로 하세요',
];

const REHEARSAL_CHECKS = [
  '지적보다 확인으로 시작했다',
  '관찰한 행동과 해석을 구분했다',
  '팀원의 상황을 물었다',
  '지원 필요를 확인했다',
  '행동 합의가 작고 구체적이다',
  '후속 확인 시점을 정했다',
];

function selectedMember(state: PeopleState): TeamMemberProfile {
  return TEAM_MEMBER_PROFILES.find((member) => member.id === state.selectedMemberId) ?? TEAM_MEMBER_PROFILES[0];
}

function asList(value: unknown) {
  return Array.isArray(value) && value.length > 0 ? value.join(' · ') : typeof value === 'string' && value.trim() ? value : '미작성';
}

function toggleList(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function defaultFirstSentence(member: TeamMemberProfile, state: PeopleState) {
  const behavior = state.observedBehaviors[0] || member.currentSignal;
  return `최근에 제가 본 것은 ${behavior}입니다. 제가 단정하려는 것은 아니고, 어디서 막히는지 같이 확인해보고 싶습니다.`;
}

function defaultQuestionOne(member: TeamMemberProfile, state: PeopleState) {
  const focus = state.oneOnOneFocus || member.defaultCoachingPurpose;
  return `이번 2주 동안 ${focus}와 관련해서 가장 애매했거나 막혔던 지점은 무엇입니까?`;
}

function defaultQuestionTwo() {
  return '그 지점에서 제가 먼저 정리해주면 도움이 될 기준이나 지원은 무엇입니까?';
}

function defaultFollowUp(state: PeopleState) {
  const response = state.expectedResponse || '어디까지 해야 하는지 애매했습니다';
  return `그렇다면 “${response}”라고 느낀 지점에서, 다음부터 혼자 판단해도 되는 것과 확인이 필요한 것을 어떻게 나누면 좋을까요?`;
}

function defaultAgreement() {
  return '이번 2주 동안 추가 확인이 필요한 내용을 2건만 정리해보고, 금요일 회의 전 10분 동안 같이 확인하겠습니다.';
}

function defaultFollowUpQuestion() {
  return '다음 주 금요일 기준으로 실제로 어디서 막혔고, 제가 추가로 정리해줘야 할 기준은 무엇인지 다시 확인하겠습니다.';
}

function buildAiScriptPrompt(state: PeopleState, member: TeamMemberProfile) {
  return `당신은 제약영업 팀장의 1on1 코칭 대화 리허설을 돕는 코치입니다.\n\n[선택한 팀원]\n${member.label} · ${member.role}\n\n[팀원 신호]\n${member.currentSignal}\n\n[관찰한 행동]\n${asList(state.observedBehaviors)}\n\n[확인 없이 말하지 않을 위험한 해석]\n${asList(state.riskyInterpretations)}\n\n[1on1 초점]\n${state.oneOnOneFocus || member.defaultCoachingPurpose}\n\n[첫 문장]\n${state.firstSentence || defaultFirstSentence(member, state)}\n\n[확인 질문 2개]\n1. ${state.checkQuestionOne || defaultQuestionOne(member, state)}\n2. ${state.checkQuestionTwo || defaultQuestionTwo()}\n\n[팀원 예상 반응]\n${state.expectedResponse || '미선택'}\n\n[리더의 재질문]\n${state.leaderFollowUpQuestion || defaultFollowUp(state)}\n\n[2주 행동 합의]\n${state.twoWeekAgreement || defaultAgreement()}\n\n[피해야 할 표현]\n${asList(state.avoidedExpressions)}\n\n[요청]\n위 내용을 바탕으로 실제 1on1 대화 스크립트 초안을 작성해 주세요.\n\n[출력 형식]\n1. 1on1 대화 스크립트\n2. 팀원 반응 예상\n3. 리더 재질문 개선안\n4. 피해야 할 표현\n5. 2주 행동 합의 문장\n6. 후속 확인 질문\n\n[주의]\n실제 고객명, 병원명, 의료진명, 제품명, 실제 매출자료, 처방 정보, 팀원 실명, 개인 성과등급, 처방 유도 표현, 비교 우위 단정, 경쟁사 비방은 쓰지 마세요. 지적이 아니라 확인으로 시작하는 대화로 작성해 주세요.`;
}

function buildPeopleMemo(state: PeopleState, member: TeamMemberProfile) {
  return [
    '[사람관리 Lab 결과]',
    `- 선택한 팀원: ${member.label}`,
    `- 팀원 신호: ${member.currentSignal}`,
    `- 관찰한 행동: ${asList(state.observedBehaviors)}`,
    `- 위험한 해석: ${asList(state.riskyInterpretations)}`,
    `- 1on1 초점: ${state.oneOnOneFocus || member.defaultCoachingPurpose}`,
    `- 먼저 이야기해야 하는 이유: ${state.selectionReason || member.defaultSelectionReason}`,
    `- 첫 문장: ${state.firstSentence || defaultFirstSentence(member, state)}`,
    `- 확인 질문 1: ${state.checkQuestionOne || defaultQuestionOne(member, state)}`,
    `- 확인 질문 2: ${state.checkQuestionTwo || defaultQuestionTwo()}`,
    `- 팀원 예상 반응: ${state.expectedResponse || '미작성'}`,
    `- 리더 재질문: ${state.leaderFollowUpQuestion || defaultFollowUp(state)}`,
    `- 2주 행동 합의: ${state.twoWeekAgreement || defaultAgreement()}`,
    `- 피해야 할 표현: ${asList(state.avoidedExpressions)}`,
    `- 우리 조 언어로 수정한 스크립트: ${state.revisedOneOnOneScript || '미작성'}`,
    `- 리허설 체크: ${asList(state.rehearsalChecks)}`,
    `- 관찰자 피드백: ${state.observerFeedback || '미작성'}`,
    `- 후속 확인 질문: ${state.followUpQuestion || defaultFollowUpQuestion()}`,
  ].join('\n');
}

function ChoiceButton({ selected, children, onClick }: { selected: boolean; children: ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`rounded-2xl border px-4 py-3 text-left text-sm font-black transition ${selected ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'}`}>{children}</button>;
}

function Field({ label, help, placeholder, value, onChange, minHeight = 'min-h-24' }: { label: string; help: string; placeholder: string; value: string; onChange: (next: string) => void; minHeight?: string }) {
  return <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="text-sm font-black text-slate-950">{label}</span><p className="mt-1 text-xs font-bold leading-5 text-slate-600">{help}</p><textarea className={`mt-3 ${minHeight} w-full rounded-2xl border bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100`} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

function CopyButton({ label, copiedLabel, text, onCopied }: { label: string; copiedLabel: string; text: string; onCopied: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(text); setCopied(true); onCopied(); window.setTimeout(() => setCopied(false), 1500); } catch { onCopied(); } };
  return <button type="button" className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white shadow-sm" onClick={copy}>{copied ? copiedLabel : label}</button>;
}

export function V40VNextOneOnOnePracticeLab() {
  const [state, setState] = useStored<PeopleState>(PEOPLE_STORAGE_KEY, DEFAULT_PEOPLE_STATE);
  const member = selectedMember(state);
  const prompt = useMemo(() => buildAiScriptPrompt(state, member), [state, member]);
  const finalMemo = useMemo(() => state.finalPeopleMemo || buildPeopleMemo(state, member), [state, member]);
  const update = (patch: Partial<PeopleState>) => setState({ ...state, ...patch });

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-emerald-700">사람관리 2 · 1on1 실천</p>
        <h2 className="mt-2 text-2xl font-black leading-tight text-slate-950">첫 문장에서 행동 합의까지 1on1을 연습합니다</h2>
        <p className="mt-3 max-w-4xl text-sm font-bold leading-7 text-slate-600">첫 문장을 만드는 데서 끝내지 않습니다. 확인 질문, 팀원 반응, 리더의 재질문, 2주 행동 합의, 후속 확인까지 실제 대화 흐름으로 만들어 봅니다.</p>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-sm font-black text-slate-950">선택한 팀원 다시 보기</p>
        <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-lg font-black text-slate-950">{member.label}</p>
          <p className="mt-1 text-sm font-black text-emerald-900">{member.role}</p>
          <p className="mt-3 text-sm font-bold leading-6 text-slate-700">{member.currentSignal}</p>
          <p className="mt-2 text-xs font-bold leading-5 text-slate-600">선택 이유: {state.selectionReason || member.defaultSelectionReason}</p>
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-sm font-black text-slate-950">1on1 초점 확인</p>
        <p className="mt-2 rounded-2xl bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-800">{state.oneOnOneFocus || member.defaultCoachingPurpose}</p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="첫 문장 만들기" help="지적이 아니라 확인으로 시작합니다." placeholder={defaultFirstSentence(member, state)} value={state.firstSentence} onChange={(firstSentence) => update({ firstSentence })} />
        <Field label="확인 질문 1" help="팀원의 상황과 막힌 지점을 확인합니다." placeholder={defaultQuestionOne(member, state)} value={state.checkQuestionOne} onChange={(checkQuestionOne) => update({ checkQuestionOne })} />
        <Field label="확인 질문 2" help="팀장이 지원할 수 있는 기준이나 도움을 묻습니다." placeholder={defaultQuestionTwo()} value={state.checkQuestionTwo} onChange={(checkQuestionTwo) => update({ checkQuestionTwo })} />
        <Field label="리더의 재질문 만들기" help="팀원 반응 이후 다시 탐색하는 질문입니다." placeholder={defaultFollowUp(state)} value={state.leaderFollowUpQuestion} onChange={(leaderFollowUpQuestion) => update({ leaderFollowUpQuestion })} />
      </div>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-sm font-black text-slate-950">팀원 예상 반응 선택</p>
        <p className="mt-1 text-sm font-bold leading-6 text-slate-600">리허설이 살아나려면 팀원의 반응을 먼저 예상해야 합니다.</p>
        <div className="mt-4 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {EXPECTED_RESPONSES.map((response) => <ChoiceButton key={response} selected={state.expectedResponse === response} onClick={() => update({ expectedResponse: response })}>{response}</ChoiceButton>)}
        </div>
      </section>

      <Field label="2주 행동 합의 문장 만들기" help="좋은 대화가 아니라 작은 실행 약속으로 끝나야 합니다." placeholder={defaultAgreement()} value={state.twoWeekAgreement} onChange={(twoWeekAgreement) => update({ twoWeekAgreement })} />

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-sm font-black text-slate-950">피해야 할 표현 고르기</p>
        <p className="mt-1 text-sm font-bold leading-6 text-slate-600">1on1에서 방어를 부르는 표현을 먼저 걸러냅니다.</p>
        <div className="mt-4 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {AVOID_EXPRESSIONS.map((expression) => <ChoiceButton key={expression} selected={state.avoidedExpressions.includes(expression)} onClick={() => update({ avoidedExpressions: toggleList(state.avoidedExpressions, expression) })}>{expression}</ChoiceButton>)}
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><p className="text-sm font-black text-slate-950">AI에게 1on1 대화 스크립트 초안 요청</p><p className="mt-1 text-sm font-bold leading-6 text-slate-600">우리 조가 먼저 만든 첫 문장, 확인 질문, 예상 반응, 재질문, 행동 합의를 넣어 대화 초안을 받습니다.</p></div><CopyButton label="AI 질문 복사" copiedLabel="복사됨" text={prompt} onCopied={() => update({ aiScriptPrompt: prompt })} /></div>
        <details className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"><summary className="cursor-pointer text-sm font-black text-slate-950">AI에게 붙여넣을 질문 보기</summary><pre className="mt-3 whitespace-pre-wrap rounded-2xl bg-white p-4 text-xs leading-6 text-slate-700">{prompt}</pre></details>
      </section>

      <Field label="AI 초안 붙여넣기" help="AI가 만든 1on1 스크립트 초안을 붙여넣습니다." placeholder="AI 1on1 대화 스크립트 초안을 붙여넣습니다." value={state.aiScriptDraft} onChange={(aiScriptDraft) => update({ aiScriptDraft })} minHeight="min-h-32" />
      <Field label="우리 조 언어로 수정" help="AI 문장을 그대로 쓰지 말고 실제 리더가 말할 수 있는 대화문으로 고칩니다." placeholder="리더: ...\n팀원: ...\n리더: ..." value={state.revisedOneOnOneScript} onChange={(revisedOneOnOneScript) => update({ revisedOneOnOneScript })} minHeight="min-h-40" />

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-sm font-black text-slate-950">3분 역할극 리허설</p>
        <p className="mt-1 text-sm font-bold leading-6 text-slate-600">리더 1분, 팀원 1분, 리더 재질문과 행동 합의 1분으로 짧게 연습합니다.</p>
        <div className="mt-4 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {REHEARSAL_CHECKS.map((check) => <ChoiceButton key={check} selected={state.rehearsalChecks.includes(check)} onClick={() => update({ rehearsalChecks: toggleList(state.rehearsalChecks, check) })}>{check}</ChoiceButton>)}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="관찰자 체크" help="관찰자가 본 좋은 점과 수정할 점을 짧게 남깁니다." placeholder="예: 첫 문장은 좋았지만, 해결책을 조금 빨리 제시했습니다." value={state.observerFeedback} onChange={(observerFeedback) => update({ observerFeedback })} />
        <Field label="후속 확인 질문 만들기" help="2주 뒤 다시 확인할 질문을 만듭니다." placeholder={defaultFollowUpQuestion()} value={state.followUpQuestion} onChange={(followUpQuestion) => update({ followUpQuestion })} />
      </div>

      <section className="rounded-3xl border border-slate-200 bg-slate-900 p-5 text-white shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><p className="text-xs font-black uppercase tracking-wide text-emerald-100">사람관리 결과 메모</p><h3 className="mt-2 text-xl font-black">1on1 실천 메모</h3><p className="mt-2 text-sm font-bold leading-6 text-slate-200">이 내용은 마지막 2주 실행 메모에 붙여 넣을 수 있는 사람관리 결과입니다.</p></div><button type="button" className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-900" onClick={() => update({ finalPeopleMemo: buildPeopleMemo(state, member) })}>사람관리 결과 정리</button></div>
        <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-white/10 p-4 text-sm leading-7 text-slate-100">{finalMemo}</pre>
      </section>
    </div>
  );
}
