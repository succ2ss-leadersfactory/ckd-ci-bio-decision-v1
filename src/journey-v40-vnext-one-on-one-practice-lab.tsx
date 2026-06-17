import { useMemo, useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';
import { TEAM_MEMBER_PROFILES, type TeamMemberProfile } from './journey-v39-team-seven-coaching-profiles';

const PEOPLE_STORAGE_KEY = 'ckd.v40-vnext.peopleManagement.v2';

const V40_VNEXT_ONE_ON_ONE_MARKERS = [
  'V40VNextOneOnOnePracticeLab',
  '사람관리 2: 1on1 대화 설계와 실천하기',
  '12단계 운영 잠금: 선택 팀원 다시 보기 → 첫 문장 → 확인 질문 2개 → 팀원 예상 반응 → 리더 재질문 → 2주 행동 합의 → 피해야 할 표현 → AI 스크립트 → 역할극 1 → 역할극 2 → 비교 성찰 → 후속 확인',
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
  'AI 역할극 리허설 1 · 내가 팀장 역할',
  'AI는 선택한 팀원 페르소나로 반응합니다',
  '선택한 팀원에게 첫 대화를 시작하세요',
  'AI 역할극 1 대화 기록 붙여넣기',
  'AI 역할극 리허설 2 · AI가 코칭 팀장 역할',
  '참여자는 딴지 거는 팀원 역할을 맡습니다',
  '딴지 유형 선택',
  'AI 역할극 2 대화 기록 붙여넣기',
  '역할극 후 비교 성찰',
  'AI 팀장의 대응에서 배울 점 1가지',
  '우리 조가 최종 적용할 코칭 문장 1개',
  '역할극 후 수정한 첫 문장',
  '역할극 후 수정한 2주 행동 합의',
  '3분 역할극 리허설',
  '관찰자 체크',
  '후속 확인 질문 만들기',
  '12단계 역할극 구간 접이식 카드',
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
  roleplayOnePrompt: string;
  roleplayOneLog: string;
  roleplayTwoPushback: string;
  roleplayTwoPrompt: string;
  roleplayTwoLog: string;
  aiCoachLearning: string;
  finalCoachingSentence: string;
  revisedFirstSentenceAfterRoleplay: string;
  revisedAgreementAfterRoleplay: string;
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
  roleplayOnePrompt: '',
  roleplayOneLog: '',
  roleplayTwoPushback: '',
  roleplayTwoPrompt: '',
  roleplayTwoLog: '',
  aiCoachLearning: '',
  finalCoachingSentence: '',
  revisedFirstSentenceAfterRoleplay: '',
  revisedAgreementAfterRoleplay: '',
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

const PUSHBACK_TYPES = [
  '방어형: 제가 안 한 게 아니라 시간이 부족했습니다',
  '혼란형: 우선순위가 계속 바뀌어서 뭘 먼저 해야 할지 모르겠습니다',
  '불안형: 혹시 제 평가가 안 좋다는 뜻인가요?',
  '반문형: 그럼 기존에 하던 일은 줄여도 되는 겁니까?',
  '체념형: 네, 알겠습니다. 말씀하신 대로 하겠습니다',
  '현실저항형: 말은 이해하지만 현장에서 그렇게 하기는 어렵습니다',
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
  '딴지나 방어에 바로 설득하지 않았다',
  '팀원 관점에서 들리는 표현을 다시 고쳤다',
];

function selectedMember(state: PeopleState): TeamMemberProfile {
  return TEAM_MEMBER_PROFILES.find((member) => member.id === state.selectedMemberId) ?? TEAM_MEMBER_PROFILES[0];
}

function asList(value: unknown) {
  return Array.isArray(value) && value.length > 0 ? value.join(' · ') : typeof value === 'string' && value.trim() ? value : '미작성';
}

function toggleList(list: string[] | undefined, value: string) {
  const current = list ?? [];
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
}

function safeArray(value: string[] | undefined) {
  return Array.isArray(value) ? value : [];
}

function defaultFirstSentence(member: TeamMemberProfile, state: PeopleState) {
  const behavior = safeArray(state.observedBehaviors)[0] || member.currentSignal;
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

function buildTeamMemberRoleplayPrompt(state: PeopleState, member: TeamMemberProfile) {
  return `당신은 지금부터 제약영업팀의 팀원 역할을 맡아 1on1 코칭 대화 역할극을 진행합니다.\n\n[역할]\n- 당신은 아래에 제시된 팀원입니다.\n- 처음에는 코치나 조언자가 아니라, 실제 팀원처럼 반응하세요.\n- 팀장의 말에 따라 방어적, 혼란스러운, 조심스러운, 협조적인 반응을 현실적으로 보여주세요.\n- 너무 쉽게 수긍하지 마세요.\n- 단, 무례하거나 과장된 반응은 하지 마세요.\n\n[팀원 페르소나]\n이름/직급: ${member.label}\n역할 특성: ${member.role}\n현재 보이는 신호: ${member.currentSignal}\n관찰된 행동: ${asList(state.observedBehaviors)}\n리더가 조심해야 할 해석: ${asList(state.riskyInterpretations)}\n이번 1on1 초점: ${state.oneOnOneFocus || member.defaultCoachingPurpose}\n\n[팀장인 내가 준비한 첫 문장]\n${state.firstSentence || defaultFirstSentence(member, state)}\n\n[확인 질문]\n1. ${state.checkQuestionOne || defaultQuestionOne(member, state)}\n2. ${state.checkQuestionTwo || defaultQuestionTwo()}\n\n[팀원이 보일 수 있는 예상 반응]\n${state.expectedResponse || '미선택'}\n\n[역할극 진행 방식]\n1. 먼저 아래 문장으로 시작하세요.\n“저는 ${member.label}입니다. 지금 1on1 자리에 앉아 있습니다. 팀장님, 먼저 말씀해 주세요.”\n2. 이후 내가 팀장으로 말하면, 당신은 팀원 역할로만 반응하세요.\n3. 내가 너무 단정하거나 평가하거나 압박하는 표현을 쓰면, 팀원으로서 약간 방어적이거나 조심스럽게 반응하세요.\n4. 내가 관찰한 행동을 말하고 질문으로 확인하면, 조금씩 더 구체적으로 상황을 설명하세요.\n5. 내가 지원 질문을 하면, 실제로 필요한 지원이나 기준을 말하세요.\n6. 내가 2주 행동 합의를 제안하면, 현실적으로 받아들일 수 있는지 팀원 입장에서 반응하세요.\n7. 대화는 6~8턴 정도 이어가세요.\n8. 내가 “역할극 종료”라고 입력하면, 그때부터 코치 역할로 전환해 피드백을 주세요.\n\n[역할극 종료 후 피드백 기준]\n1. 리더의 좋은 점 2가지\n2. 리더가 단정하거나 평가처럼 들릴 수 있었던 표현\n3. 팀원이 더 말할 수 있게 만드는 질문 개선안\n4. 2주 행동 합의가 구체적인지 평가\n5. 다음 1on1에서 사용할 수 있는 개선 문장 3개\n\n[주의]\n- 실제 고객명, 병원명, 의료진명, 제품명, 실제 매출자료, 처방 정보는 사용하지 마세요.\n- 처방 유도 표현, 비교 우위 단정, 경쟁사 비방, 미승인 효능 표현은 하지 마세요.\n- 팀원의 실제 성과등급이나 인사평가처럼 보이는 표현은 사용하지 마세요.\n- 대화는 사람을 평가하는 방식이 아니라, 막힌 지점과 지원 필요를 확인하는 방식으로 진행하세요.`;
}

function buildCoachManagerRoleplayPrompt(state: PeopleState, member: TeamMemberProfile) {
  const pushback = state.roleplayTwoPushback || PUSHBACK_TYPES[0];
  return `당신은 지금부터 1on1 코칭을 잘하는 제약영업팀장 역할을 맡습니다. 나는 딴지 거는 팀원 역할을 맡겠습니다.\n\n[상황]\n선택한 팀원: ${member.label} · ${member.role}\n팀원 신호: ${member.currentSignal}\n관찰한 행동: ${asList(state.observedBehaviors)}\n리더가 조심해야 할 해석: ${asList(state.riskyInterpretations)}\n1on1 초점: ${state.oneOnOneFocus || member.defaultCoachingPurpose}\n\n[내가 맡을 팀원 딴지 유형]\n${pushback}\n\n[당신이 보여줄 좋은 팀장 페르소나]\n- 판단보다 관찰을 먼저 말합니다.\n- 질책보다 확인으로 시작합니다.\n- 바로 설득하지 않고, 먼저 감정과 맥락을 인정합니다.\n- 관찰한 행동과 해석을 분리합니다.\n- 질문으로 막힌 지점을 확인합니다.\n- 팀원이 1~2번 방어하거나 반문해도 억누르지 않습니다.\n- 마지막에는 2주 행동 합의를 작고 구체적으로 만듭니다.\n\n[역할극 진행 방식]\n1. 먼저 아래 문장으로 시작하세요.\n“저는 1on1 코칭을 잘하는 영업팀장 역할을 맡겠습니다. 당신은 팀원 역할로, 실제 현장에서 나올 법한 딴지나 우려를 말해 주세요. 제가 코칭 대화 방식으로 대응하겠습니다. 먼저 팀원 입장에서 말해 주세요.”\n2. 내가 팀원으로 딴지나 우려를 말하면, 당신은 좋은 팀장 역할로 대응하세요.\n3. 좋은 팀장의 대응은 ‘공감 → 관찰 확인 → 기준 확인 → 질문 → 작은 행동 합의’ 흐름을 따르세요.\n4. 너무 빨리 정답을 주거나 훈계하지 마세요.\n5. 대화는 5~7턴 정도 이어가세요.\n6. 내가 “시범 종료”라고 입력하면, 좋은 코칭 대응의 핵심 원리를 5가지로 요약해 주세요.\n\n[주의]\n- 실제 고객명, 병원명, 의료진명, 제품명, 실제 매출자료, 처방 정보는 사용하지 마세요.\n- 처방 유도 표현, 비교 우위 단정, 경쟁사 비방, 미승인 효능 표현은 하지 마세요.\n- 팀원의 실제 성과등급이나 인사평가처럼 보이는 표현은 사용하지 마세요.`;
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
    `- 첫 문장: ${state.revisedFirstSentenceAfterRoleplay || state.firstSentence || defaultFirstSentence(member, state)}`,
    `- 확인 질문 1: ${state.checkQuestionOne || defaultQuestionOne(member, state)}`,
    `- 확인 질문 2: ${state.checkQuestionTwo || defaultQuestionTwo()}`,
    `- 팀원 예상 반응: ${state.expectedResponse || '미작성'}`,
    `- 리더 재질문: ${state.leaderFollowUpQuestion || defaultFollowUp(state)}`,
    `- 2주 행동 합의: ${state.revisedAgreementAfterRoleplay || state.twoWeekAgreement || defaultAgreement()}`,
    `- 피해야 할 표현: ${asList(state.avoidedExpressions)}`,
    `- AI 역할극 1 기록: ${state.roleplayOneLog || '미작성'}`,
    `- AI 역할극 2 기록: ${state.roleplayTwoLog || '미작성'}`,
    `- AI 팀장의 대응에서 배울 점: ${state.aiCoachLearning || '미작성'}`,
    `- 최종 적용할 코칭 문장: ${state.finalCoachingSentence || '미작성'}`,
    `- 우리 조 언어로 수정한 스크립트: ${state.revisedOneOnOneScript || '미작성'}`,
    `- 리허설 체크: ${asList(state.rehearsalChecks)}`,
    `- 관찰자 피드백: ${state.observerFeedback || '미작성'}`,
    `- 후속 확인 질문: ${state.followUpQuestion || defaultFollowUpQuestion()}`,
  ].join('\n');
}

function ChoiceButton({ selected, children, onClick }: { selected: boolean; children: ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`rounded-2xl border px-4 py-3 text-left text-sm font-black transition ${selected ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'}`}>{children}</button>;
}

function Field({ label, help, placeholder, value, onChange, minHeight = 'min-h-24' }: { label: string; help: string; placeholder: string; value: string | undefined; onChange: (next: string) => void; minHeight?: string }) {
  return <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="text-sm font-black text-slate-950">{label}</span><p className="mt-1 text-xs font-bold leading-5 text-slate-600">{help}</p><textarea className={`mt-3 ${minHeight} w-full rounded-2xl border bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100`} value={value || ''} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

function CopyButton({ label, copiedLabel, text, onCopied }: { label: string; copiedLabel: string; text: string; onCopied: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(text); setCopied(true); onCopied(); window.setTimeout(() => setCopied(false), 1500); } catch { onCopied(); } };
  return <button type="button" className="rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white shadow-sm" onClick={copy}>{copied ? copiedLabel : label}</button>;
}

function PracticePanel({ title, subtitle, tone = 'emerald', children }: { title: string; subtitle: string; tone?: 'emerald' | 'indigo' | 'slate'; children: ReactNode }) {
  const toneClass = tone === 'indigo' ? 'border-indigo-200 bg-indigo-50 text-indigo-900' : tone === 'slate' ? 'border-slate-200 bg-white text-slate-700' : 'border-emerald-200 bg-emerald-50 text-emerald-900';
  return (
    <details className={`rounded-3xl border p-5 shadow-sm md:p-6 ${toneClass}`}>
      <summary className="cursor-pointer list-none">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black text-slate-950">{title}</p>
            <p className="mt-1 text-sm font-bold leading-6">{subtitle}</p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700 shadow-sm">펼쳐서 실습하기</span>
        </div>
      </summary>
      <div className="mt-4 space-y-4">{children}</div>
    </details>
  );
}

export function V40VNextOneOnOnePracticeLab() {
  const [state, setState] = useStored<PeopleState>(PEOPLE_STORAGE_KEY, DEFAULT_PEOPLE_STATE);
  const member = selectedMember(state);
  const prompt = useMemo(() => buildAiScriptPrompt(state, member), [state, member]);
  const roleplayOnePrompt = useMemo(() => buildTeamMemberRoleplayPrompt(state, member), [state, member]);
  const roleplayTwoPrompt = useMemo(() => buildCoachManagerRoleplayPrompt(state, member), [state, member]);
  const finalMemo = useMemo(() => state.finalPeopleMemo || buildPeopleMemo(state, member), [state, member]);
  const update = (patch: Partial<PeopleState>) => setState({ ...state, ...patch });

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-emerald-700">사람관리 2 · 1on1 실천</p>
        <h2 className="mt-2 text-2xl font-black leading-tight text-slate-950">첫 문장에서 행동 합의까지 1on1을 연습합니다</h2>
        <p className="mt-3 max-w-4xl text-sm font-bold leading-7 text-slate-600">첫 문장을 만드는 데서 끝내지 않습니다. 내가 팀장으로 말해보고, 이어서 좋은 팀장이 어떻게 대응하는지 팀원 입장에서 경험합니다.</p>
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
          {AVOID_EXPRESSIONS.map((expression) => <ChoiceButton key={expression} selected={safeArray(state.avoidedExpressions).includes(expression)} onClick={() => update({ avoidedExpressions: toggleList(state.avoidedExpressions, expression) })}>{expression}</ChoiceButton>)}
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><p className="text-sm font-black text-slate-950">AI에게 1on1 대화 스크립트 초안 요청</p><p className="mt-1 text-sm font-bold leading-6 text-slate-600">우리 조가 먼저 만든 첫 문장, 확인 질문, 예상 반응, 재질문, 행동 합의를 넣어 대화 초안을 받습니다.</p></div><CopyButton label="AI 질문 복사" copiedLabel="복사됨" text={prompt} onCopied={() => update({ aiScriptPrompt: prompt })} /></div>
        <details className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"><summary className="cursor-pointer text-sm font-black text-slate-950">AI에게 붙여넣을 질문 보기</summary><pre className="mt-3 whitespace-pre-wrap rounded-2xl bg-white p-4 text-xs leading-6 text-slate-700">{prompt}</pre></details>
      </section>

      <Field label="AI 초안 붙여넣기" help="AI가 만든 1on1 스크립트 초안을 붙여넣습니다." placeholder="AI 1on1 대화 스크립트 초안을 붙여넣습니다." value={state.aiScriptDraft} onChange={(aiScriptDraft) => update({ aiScriptDraft })} minHeight="min-h-32" />
      <Field label="우리 조 언어로 수정" help="AI 문장을 그대로 쓰지 말고 실제 리더가 말할 수 있는 대화문으로 고칩니다." placeholder="리더: ...\n팀원: ...\n리더: ..." value={state.revisedOneOnOneScript} onChange={(revisedOneOnOneScript) => update({ revisedOneOnOneScript })} minHeight="min-h-40" />

      <PracticePanel title="AI 역할극 리허설 1 · 내가 팀장 역할" subtitle="AI는 선택한 팀원 페르소나로 반응합니다. 먼저 내가 팀장으로 말해보고 피드백을 받습니다." tone="emerald">
        <section className="rounded-2xl border border-emerald-200 bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><p className="text-sm font-black text-slate-950">선택한 팀원에게 첫 대화를 시작하세요</p><p className="mt-1 text-sm font-bold leading-6 text-emerald-900">프롬프트를 복사해 외부 AI에 붙여넣으면 “선택한 팀원에게 첫 대화를 시작하세요”라는 흐름으로 1on1이 시작됩니다.</p></div><CopyButton label="역할극 1 프롬프트 복사" copiedLabel="복사됨" text={roleplayOnePrompt} onCopied={() => update({ roleplayOnePrompt })} /></div>
          <details className="mt-4 rounded-2xl border border-emerald-200 bg-white p-4"><summary className="cursor-pointer text-sm font-black text-slate-950">역할극 1 프롬프트 보기</summary><pre className="mt-3 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-xs leading-6 text-slate-700">{roleplayOnePrompt}</pre></details>
        </section>
        <Field label="AI 역할극 1 대화 기록 붙여넣기" help="내가 팀장으로 말하고 AI가 팀원으로 반응한 대화 기록과 피드백을 붙여넣습니다." placeholder="AI 팀원과 진행한 1on1 역할극 기록을 붙여넣습니다." value={state.roleplayOneLog} onChange={(roleplayOneLog) => update({ roleplayOneLog })} minHeight="min-h-36" />
      </PracticePanel>

      <PracticePanel title="AI 역할극 리허설 2 · AI가 코칭 팀장 역할" subtitle="이번에는 참여자가 딴지 거는 팀원이 되고, AI의 코칭 팀장 대응을 관찰합니다." tone="indigo">
        <section className="rounded-2xl border bg-white p-4">
          <p className="text-sm font-black text-slate-950">딴지 유형 선택</p>
          <p className="mt-1 text-sm font-bold leading-6 text-slate-600">참여자는 딴지 거는 팀원 역할을 맡습니다. AI가 코칭을 잘하는 팀장 역할을 맡습니다.</p>
          <div className="mt-4 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {PUSHBACK_TYPES.map((pushback) => <ChoiceButton key={pushback} selected={state.roleplayTwoPushback === pushback} onClick={() => update({ roleplayTwoPushback: pushback })}>{pushback}</ChoiceButton>)}
          </div>
        </section>
        <section className="rounded-2xl border border-indigo-200 bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><p className="text-sm font-black text-slate-950">AI가 좋은 팀장으로 대응하는 장면 보기</p><p className="mt-1 text-sm font-bold leading-6 text-indigo-900">AI가 좋은 팀장으로 어떻게 대응하는지 체험하고, 쓸 만한 코칭 문장을 가져옵니다.</p></div><CopyButton label="역할극 2 프롬프트 복사" copiedLabel="복사됨" text={roleplayTwoPrompt} onCopied={() => update({ roleplayTwoPrompt })} /></div>
          <details className="mt-4 rounded-2xl border border-indigo-200 bg-white p-4"><summary className="cursor-pointer text-sm font-black text-slate-950">역할극 2 프롬프트 보기</summary><pre className="mt-3 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-xs leading-6 text-slate-700">{roleplayTwoPrompt}</pre></details>
        </section>
        <Field label="AI 역할극 2 대화 기록 붙여넣기" help="내가 딴지 거는 팀원으로 말하고 AI가 코칭 팀장으로 대응한 대화 기록을 붙여넣습니다." placeholder="AI 코칭 팀장의 대응 기록을 붙여넣습니다." value={state.roleplayTwoLog} onChange={(roleplayTwoLog) => update({ roleplayTwoLog })} minHeight="min-h-36" />
      </PracticePanel>

      <PracticePanel title="역할극 후 비교 성찰" subtitle="내가 팀장으로 말했을 때와 AI 팀장이 대응했을 때의 차이를 비교합니다." tone="slate">
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="AI 팀장의 대응에서 배울 점 1가지" help="공감, 질문, 기준 확인, 행동 합의 중 가져갈 점을 적습니다." placeholder="예: 딴지를 바로 반박하지 않고 먼저 우선순위 혼란을 인정했다." value={state.aiCoachLearning} onChange={(aiCoachLearning) => update({ aiCoachLearning })} />
          <Field label="우리 조가 최종 적용할 코칭 문장 1개" help="실제 1on1에서 그대로 쓸 수 있는 문장을 하나 남깁니다." placeholder="예: 그렇게 느낄 수 있습니다. 오늘은 기존 일을 줄이자는 뜻이 아니라 이번 2주 동안 어디에 힘을 더 줄지 함께 정리하려는 것입니다." value={state.finalCoachingSentence} onChange={(finalCoachingSentence) => update({ finalCoachingSentence })} />
          <Field label="역할극 후 수정한 첫 문장" help="역할극을 거친 뒤 첫 문장을 더 자연스럽게 고칩니다." placeholder={defaultFirstSentence(member, state)} value={state.revisedFirstSentenceAfterRoleplay} onChange={(revisedFirstSentenceAfterRoleplay) => update({ revisedFirstSentenceAfterRoleplay })} />
          <Field label="역할극 후 수정한 2주 행동 합의" help="역할극을 거친 뒤 더 작고 실행 가능한 합의로 고칩니다." placeholder={defaultAgreement()} value={state.revisedAgreementAfterRoleplay} onChange={(revisedAgreementAfterRoleplay) => update({ revisedAgreementAfterRoleplay })} />
        </div>
      </PracticePanel>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-sm font-black text-slate-950">3분 역할극 리허설</p>
        <p className="mt-1 text-sm font-bold leading-6 text-slate-600">AI 역할극에서 얻은 문장을 바탕으로 조 안에서 마지막 3분 리허설을 진행합니다.</p>
        <div className="mt-4 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {REHEARSAL_CHECKS.map((check) => <ChoiceButton key={check} selected={safeArray(state.rehearsalChecks).includes(check)} onClick={() => update({ rehearsalChecks: toggleList(state.rehearsalChecks, check) })}>{check}</ChoiceButton>)}
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
