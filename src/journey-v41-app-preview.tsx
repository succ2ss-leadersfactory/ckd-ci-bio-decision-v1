import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { JourneyShell } from './journey-shell';
import { removeStoredPrefix, useStored } from './journey-storage';
import { V39StepHero } from './journey-v39-ux-components';
import { V41FlowStrip, V41StepNavigationProvider } from './journey-v41-ux-components';
import { V41ProgressCoachPanel } from './journey-v41-progress-coach-panel';
import { clampV41Step, V41_VISIBLE_APP_STEPS } from './journey-v41-preview-config';
import { V41PromptPracticeReviewLab } from './journey-v41-prompt-practice-review-lab';
import { V41ResearchStrategyTrimmedLab } from './journey-v41-research-strategy-trimmed-lab';
import { V41PerformanceCompactCascadeLab } from './journey-v41-performance-compact-cascade-lab';
import { V41PerformanceAiExpansionLab } from './journey-v41-performance-ai-expansion-lab';
import { V41TaskExecutionBridgeLab } from './journey-v41-task-execution-bridge-lab';
import { V41TaskPriorityFlowLab } from './journey-v41-task-priority-flow-lab';
import { V41TaskBoundaryCoordinationLab } from './journey-v41-task-boundary-coordination-lab';
import { V41PeopleSelectionLab } from './journey-v41-people-selection-lab';
import { V41OneOnOnePracticeLab } from './journey-v41-one-on-one-practice-lab';

type V41Participant = { groupName: string; tableName: string; representativeSituation: string; roleAccepted: boolean };
type V41Progress = { step: number };
type TeamMemberProfile = { name: string; role: string; tenure: string; style: string; signal: string; question: string; coaching: string };

const rootElement = document.getElementById('journey-root') ?? document.getElementById('root');
const V41_PREVIEW_APP_MARKERS = ['V41PreviewApp','V41PerformanceCompactCascadeLab','V41PerformanceAiExpansionLab','팀원 보기 복구','김박사 추천 프롬프팅 기준','AI 추가 팀 전략과제 발굴 실습','ckd.v41.performanceCascade.aiExpansion.v1','journey-v41-preview.html'].join('|');
void V41_PREVIEW_APP_MARKERS;

const V41_STORAGE_KEYS = { participant: 'ckd.v41.participant.v1', progress: 'ckd.v41.progress.v1' };
const DEFAULT_PARTICIPANT: V41Participant = { groupName: '', tableName: '', representativeSituation: '', roleAccepted: false };
const DEFAULT_PROGRESS: V41Progress = { step: 0 };
const TEAM_OPTIONS = ['1팀', '2팀', '3팀', '4팀', '5팀', '6팀', '7팀', '8팀'];
const TEAM_MEMBERS: TeamMemberProfile[] = [
  { name: '신재영', role: '대리', tenure: '3년차', style: '활동량은 많고 실행 속도는 빠르지만, 고객 반응 기록이 짧아 다음 행동 연결이 약해질 수 있습니다.', signal: '방문 후 “좋았다/관심 있음” 수준의 메모가 많고 Follow-up 근거가 부족합니다.', question: '이번 방문에서 고객이 실제로 한 말은 무엇이고, 그 말 다음에 우리가 해야 할 행동은 무엇인가요?', coaching: '기록량보다 고객 반응-다음 행동 연결 문장을 1개씩 남기도록 코칭합니다.' },
  { name: '이대은', role: '대리', tenure: '4년차', style: '꼼꼼하고 안정적이지만, 판단 전에 확인을 반복해 실행 속도가 늦어질 수 있습니다.', signal: '자료 준비와 내부 확인은 충실하지만 결정 시점이 뒤로 밀리는 경향이 있습니다.', question: '지금 70% 정보로 먼저 실행해도 되는 행동은 무엇인가요?', coaching: '완벽한 자료보다 2주 안에 확인 가능한 작은 실행 기준을 정하게 돕습니다.' },
  { name: '박재욱', role: '사원', tenure: '1년차', style: '학습 의지가 높지만 고객 반응을 해석하고 우선순위를 잡는 경험이 부족합니다.', signal: '방문 사실은 남기지만 고객 반응의 의미와 다음 행동이 분리되어 있습니다.', question: '고객 반응을 관심, 우려, 자료요청, 보류 중 어디로 볼 수 있나요?', coaching: '분류 기준을 먼저 알려주고 좋은 기록 예시와 부족한 기록 예시를 비교하게 합니다.' },
  { name: '유희관', role: '과장', tenure: '7년차', style: '관계 형성은 강하지만 익숙한 방식에 머물러 데이터 기반 실행관리는 느슨해질 수 있습니다.', signal: '고객과의 관계 정보는 풍부하지만 팀 공통 기준으로 공유되는 기록은 제한적입니다.', question: '그 고객과의 관계 정보 중 팀 전략에 도움이 되는 신호는 무엇인가요?', coaching: '개인 노하우를 팀이 활용 가능한 기록과 후속 행동 기준으로 바꾸게 합니다.' },
  { name: '김문호', role: '차장', tenure: '10년차', style: '경험과 판단력은 강하지만 기존 방식에 대한 확신이 커서 새 기준 수용이 늦을 수 있습니다.', signal: '전략 방향에는 동의하지만 실행 양식이나 기록 기준 변경에는 신중하게 반응합니다.', question: '이번 전략과제에서 기존 방식으로 충분한 부분과 바꿔야 할 부분은 무엇인가요?', coaching: '경험을 부정하지 않고 새 CSF/KPI 기준에 연결되는 부분을 먼저 인정합니다.' },
  { name: '김재호', role: '차장', tenure: '12년차', style: '성과 책임감이 강하고 영향력이 크지만, 팀 기준보다 개인 판단으로 움직일 가능성이 있습니다.', signal: '핵심 고객 대응은 빠르지만 팀 전체가 같은 기준으로 따라가기는 어렵습니다.', question: '이 방식이 팀 전체 기준으로 복제되려면 어떤 조건이 필요할까요?', coaching: '개인 성과 방식을 팀 기준과 후배 코칭 자산으로 전환하게 합니다.' },
];

function scrollV41ToTop() { window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' })); }
function isParticipantReady(p: V41Participant) { return Boolean(p.groupName.trim() && p.tableName.trim()); }
function showV41EntryGateMessage() { window.alert('먼저 팀과 이름/닉네임을 입력해 주세요.'); }
function Box({ title, children }: { title: string; children: ReactNode }) { return <section className="rounded-2xl border bg-white p-5 shadow-sm"><h3 className="text-lg font-black text-slate-900">{title}</h3><div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">{children}</div></section>; }

function EntryStep({ participant, setParticipant }: { participant: V41Participant; setParticipant: (next: V41Participant) => void }) {
  return <div className="space-y-4"><V41FlowStrip currentStep={1} /><V39StepHero eyebrow="1단계 · 시작하기" icon="🚪" title="팀과 이름을 입력하고 바로 시작하세요" tone="indigo" description="먼저 팀과 이름만 입력하면 다음 단계부터 필요한 화면으로 이동할 수 있습니다." badges={[{ label: '필수', value: '팀 / 이름', tone: 'indigo', icon: '✅' }, { label: '역할', value: '영업팀장 관점', tone: 'emerald', icon: '👤' }]} /><Box title="시작 정보 입력"><select className="w-full rounded-xl border bg-white px-3 py-2" value={participant.groupName} onChange={(e) => setParticipant({ ...participant, groupName: e.target.value })}><option value="">팀을 선택하세요</option>{TEAM_OPTIONS.map((team) => <option key={team} value={team}>{team}</option>)}</select><input className="w-full rounded-xl border px-3 py-2" value={participant.tableName} onChange={(e) => setParticipant({ ...participant, tableName: e.target.value })} placeholder="이름 또는 닉네임" /></Box></div>;
}

function RoleTeamIntroStep() {
  return <div className="space-y-4"><V41FlowStrip currentStep={2} /><V39StepHero eyebrow="2단계 · 팀원 보기" icon="👥" title="이대호 팀장과 팀원 기본 성향을 봅니다" tone="indigo" description="전략과제를 정하기 전에 팀장과 팀원의 경력, 업무스타일, 실행 신호, 코칭 포인트를 먼저 확인합니다." badges={[{ label: '팀장', value: '이대호', tone: 'indigo', icon: '👤' }, { label: '팀원', value: '6명', tone: 'emerald', icon: '👥' }, { label: '초점', value: '성향 파악', tone: 'amber', icon: '🧭' }]} /><Box title="이대호 팀장 이해"><div className="grid gap-3 md:grid-cols-3"><div className="rounded-2xl bg-indigo-50 p-4"><p className="text-xs font-black text-indigo-700">팀장 역할</p><p className="mt-1 font-black text-slate-900">전략을 현장 실행 기준으로 바꾸는 사람</p></div><div className="rounded-2xl bg-emerald-50 p-4"><p className="text-xs font-black text-emerald-700">현재 과제</p><p className="mt-1 font-black text-slate-900">팀 전략과제, CSF, KPI, 2주 실행계획 연결</p></div><div className="rounded-2xl bg-amber-50 p-4"><p className="text-xs font-black text-amber-700">주의점</p><p className="mt-1 font-black text-slate-900">팀원을 평가하기보다 실행 신호와 지원 필요를 확인</p></div></div></Box><section className="rounded-2xl border bg-white p-5 shadow-sm"><h3 className="text-lg font-black text-slate-900">팀원 6명 기본 성향과 코칭 포인트</h3><p className="mt-2 text-sm font-bold leading-6 text-slate-600">아래 정보는 이후 팀 기준 만들기, 업무지시 만들기, 1on1 대상 고르기에서 판단 재료로 사용됩니다.</p><div className="mt-4 grid gap-3 md:grid-cols-2">{TEAM_MEMBERS.map((member) => <article key={member.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex flex-wrap items-center gap-2"><h4 className="text-base font-black text-slate-950">{member.name} {member.role}</h4><span className="rounded-full bg-white px-2 py-1 text-xs font-black text-slate-500">{member.tenure}</span></div><dl className="mt-3 space-y-2 text-sm leading-6"><div><dt className="font-black text-slate-800">업무 성향</dt><dd className="text-slate-600">{member.style}</dd></div><div><dt className="font-black text-slate-800">현재 보이는 실행 신호</dt><dd className="text-slate-600">{member.signal}</dd></div><div><dt className="font-black text-slate-800">팀장이 확인할 질문</dt><dd className="text-slate-600">{member.question}</dd></div><div><dt className="font-black text-slate-800">코칭 포인트</dt><dd className="text-slate-600">{member.coaching}</dd></div></dl></article>)}</div></section><Box title="다음 단계와 연결"><p>3단계에서는 이 팀원 맥락을 바탕으로 AI에게 묻는 질문을 다듬습니다.</p><p>5단계에서는 팀 전략과제, CSF, KPI를 만들 때 팀원별 실행 가능성과 지원 필요를 함께 고려합니다.</p></Box></div>;
}

function LabStep({ currentStep, children }: { currentStep: number; children: ReactNode }) { return <div className="space-y-4"><V41FlowStrip currentStep={currentStep} />{children}</div>; }
function PerformanceStep() { return <LabStep currentStep={5}><V41PerformanceCompactCascadeLab /><V41PerformanceAiExpansionLab /></LabStep>; }

function V41PreviewApp() {
  const [participant, setParticipant] = useStored<V41Participant>(V41_STORAGE_KEYS.participant, DEFAULT_PARTICIPANT);
  const [progress, setProgress] = useStored<V41Progress>(V41_STORAGE_KEYS.progress, DEFAULT_PROGRESS);
  const currentStep = clampV41Step(progress.step);
  const selectStep = (stepIndex: number) => { setProgress({ step: clampV41Step(stepIndex) }); scrollV41ToTop(); };
  const goPrev = () => selectStep(currentStep - 1);
  const goNext = () => { if (currentStep === 0 && !isParticipantReady(participant)) { showV41EntryGateMessage(); return; } selectStep(currentStep + 1); };
  const resetV41 = () => { removeStoredPrefix('ckd.v41.'); setParticipant(DEFAULT_PARTICIPANT); setProgress(DEFAULT_PROGRESS); scrollV41ToTop(); };
  const screens = [<EntryStep key="entry" participant={participant} setParticipant={setParticipant} />, <RoleTeamIntroStep key="role-team-intro" />, <LabStep key="prompt-practice" currentStep={3}><V41PromptPracticeReviewLab /></LabStep>, <LabStep key="research-strategy" currentStep={4}><V41ResearchStrategyTrimmedLab /></LabStep>, <PerformanceStep key="dashboard-analysis" />, <LabStep key="task-execution-design" currentStep={6}><V41TaskExecutionBridgeLab /></LabStep>, <LabStep key="task-priority-flow" currentStep={7}><V41TaskPriorityFlowLab /></LabStep>, <LabStep key="task-boundary-coordination" currentStep={8}><V41TaskBoundaryCoordinationLab /></LabStep>, <LabStep key="member-role" currentStep={9}><V41PeopleSelectionLab /></LabStep>, <LabStep key="people-dialogue" currentStep={10}><V41OneOnOnePracticeLab /></LabStep>];
  return <V41StepNavigationProvider onStepSelect={(n) => selectStep(n - 1)}><JourneyShell title="C1바이오 영업팀장 AI 리더십 Lab" subtitle="성과관리, 업무관리, 사람관리 흐름을 팀장 관점으로 연습합니다. v41 Preview는 기존 파일럿과 분리된 검증용 화면입니다." steps={V41_VISIBLE_APP_STEPS} currentStep={currentStep} onPrev={goPrev} onNext={goNext} onStepSelect={selectStep} hideStepOverview><V41ProgressCoachPanel currentStep={currentStep} participant={participant} onStepSelect={selectStep} /><div className="mb-4 flex justify-end"><button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-500 shadow-sm hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700" onClick={resetV41}>v41 입력 초기화</button></div>{screens[currentStep] ?? screens[0]}</JourneyShell></V41StepNavigationProvider>;
}

if (!rootElement) throw new Error('journey-root element is required for v41 preview app.');
createRoot(rootElement).render(<V41PreviewApp />);
