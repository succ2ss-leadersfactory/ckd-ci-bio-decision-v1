import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { JourneyShell } from './journey-shell';
import { AiSafetyLab } from './journey-v36-ai-safety-lab';
import { removeStoredPrefix, useStored } from './journey-storage';
import { V39StepHero } from './journey-v39-ux-components';
import { V41FlowStrip, V41StepNavigationProvider } from './journey-v41-ux-components';
import { V41ProgressCoachPanel } from './journey-v41-progress-coach-panel';
import { clampV41Step, V41_VISIBLE_APP_STEPS } from './journey-v41-preview-config';
import { V41PromptPracticeReviewLab } from './journey-v41-prompt-practice-review-lab';
import { V41ResearchStrategyTrimmedLab } from './journey-v41-research-strategy-trimmed-lab';
import { V41PerformanceCompactCascadeLab } from './journey-v41-performance-compact-cascade-lab';
import { V41TaskExecutionBridgeLab } from './journey-v41-task-execution-bridge-lab';
import { V41TaskPriorityFlowLab } from './journey-v41-task-priority-flow-lab';
import { V41TaskBoundaryCoordinationLab } from './journey-v41-task-boundary-coordination-lab';
import { V41PeopleSelectionLab } from './journey-v41-people-selection-lab';
import { V41OneOnOnePracticeLab } from './journey-v41-one-on-one-practice-lab';

type V41Participant = { groupName: string; tableName: string; representativeSituation: string; roleAccepted: boolean };
type V41Progress = { step: number };
type Member = { name: string; title: string; work: string; talk: string; good: string; grow: string };

const rootElement = document.getElementById('journey-root') ?? document.getElementById('root');
const V41_PREVIEW_APP_MARKERS = ['V41PreviewApp','journey-v41-preview.html','v41 isolated app shell','v41 step 2 basic leader profile','v41 step 2 basic member profiles','V41PromptPracticeReviewLab','V41ResearchStrategyTrimmedLab','V41PerformanceCompactCascadeLab','V41TaskExecutionBridgeLab','V41TaskPriorityFlowLab','V41TaskBoundaryCoordinationLab','V41PeopleSelectionLab','V41OneOnOnePracticeLab','V41_VISIBLE_APP_STEPS','V41FlowStrip','V41ProgressCoachPanel','ckd.v41.participant.v1','ckd.v41.progress.v1','ckd.v41.promptPracticeReview.v2','ckd.v41.pharmaStrategyResearch.v1','ckd.v41.performanceCascade.v1','ckd.v41.taskManagement.v10','ckd.v41.peopleManagement.v2','existing pilot URLs preserved','ckd-ai-lab.html 보호','journey-v40-vnext-preview.html 보호'].join('|');
void V41_PREVIEW_APP_MARKERS;

const V41_STORAGE_KEYS = { participant: 'ckd.v41.participant.v1', progress: 'ckd.v41.progress.v1' };
const DEFAULT_PARTICIPANT: V41Participant = { groupName: '', tableName: '', representativeSituation: '', roleAccepted: false };
const DEFAULT_PROGRESS: V41Progress = { step: 0 };
const TEAM_OPTIONS = ['1팀', '2팀', '3팀', '4팀', '5팀', '6팀', '7팀', '8팀'];
const MEMBERS: Member[] = [
  { name: '김재호', title: '차장', work: '경험을 바탕으로 스스로 판단해 움직이는 편입니다.', talk: '말수는 적지만 필요한 의견은 분명히 말합니다.', good: '침착함과 판단력', grow: '개인 노하우를 팀과 더 자주 공유하기' },
  { name: '김문호', title: '차장', work: '꾸준하고 안정적으로 일을 관리하는 편입니다.', talk: '상대의 말을 잘 듣고 부드럽게 조율합니다.', good: '관계 유지와 신뢰 형성', grow: '새로운 방식에 조금 더 빠르게 적응하기' },
  { name: '유희관', title: '과장', work: '움직임이 빠르고 여러 일을 동시에 시도합니다.', talk: '밝고 적극적으로 의견을 냅니다.', good: '추진력과 에너지', grow: '많이 하기보다 먼저 할 일을 고르기' },
  { name: '이대은', title: '대리', work: '기록과 확인을 꼼꼼히 챙기는 편입니다.', talk: '질문과 확인이 구체적입니다.', good: '정리력과 안정성', grow: '핵심을 압축해 전달하기' },
  { name: '신재영', title: '대리', work: '새로운 내용을 빠르게 적용하는 편입니다.', talk: '간결하고 결론 중심으로 말합니다.', good: '속도감과 적용력', grow: '실행 후 짧게 돌아보기' },
  { name: '박재욱', title: '사원', work: '기본 업무 루틴을 배우는 단계입니다.', talk: '먼저 말하기보다 확인받고 움직이는 편입니다.', good: '성실함과 학습 태도', grow: '스스로 기준을 세워 판단하기' },
  { name: '문교원', title: '사원', work: '사람과의 관계를 부드럽게 만드는 편입니다.', talk: '상대 반응을 살피며 조심스럽게 말합니다.', good: '친화력과 접근성', grow: '좋은 분위기를 업무 대화로 연결하기' }
];

function scrollV41ToTop() { window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' })); }
function isParticipantReady(p: V41Participant) { return Boolean(p.groupName.trim() && p.tableName.trim()); }
function showV41EntryGateMessage() { window.alert('먼저 팀과 이름/닉네임을 입력해 주세요.'); }
function Box({ title, children }: { title: string; children: ReactNode }) { return <section className="rounded-2xl border bg-white p-5 shadow-sm"><h3 className="text-lg font-black text-slate-900">{title}</h3><div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">{children}</div></section>; }

function EntryStep({ participant, setParticipant }: { participant: V41Participant; setParticipant: (next: V41Participant) => void }) {
  const ready = isParticipantReady(participant);
  return <div className="space-y-4"><V41FlowStrip currentStep={1} /><V39StepHero eyebrow="1단계 · 시작하기" icon="🚪" title="팀과 이름을 입력하고 바로 시작하세요" tone="indigo" description="먼저 팀과 이름만 입력하면 다음 단계부터 필요한 화면으로 이동할 수 있습니다." badges={[{ label: '필수', value: '팀 / 이름', tone: 'indigo', icon: '✅' }, { label: '역할', value: '영업팀장 관점', tone: 'emerald', icon: '👤' }, { label: '방식', value: '필요 단계 이동', tone: 'amber', icon: '🧭' }]} /><Box title="시작 정보 입력"><select className="w-full rounded-xl border bg-white px-3 py-2" value={participant.groupName} onChange={(e) => setParticipant({ ...participant, groupName: e.target.value })}><option value="">팀을 선택하세요</option>{TEAM_OPTIONS.map((team) => <option key={team}>{team}</option>)}</select><input className="w-full rounded-xl border bg-white px-3 py-2" value={participant.tableName} onChange={(e) => setParticipant({ ...participant, tableName: e.target.value })} placeholder="이름/닉네임" /><textarea className="min-h-20 w-full rounded-xl border px-3 py-2" value={participant.representativeSituation} onChange={(e) => setParticipant({ ...participant, representativeSituation: e.target.value })} placeholder="오늘 다뤄보고 싶은 상황" /><label className="flex gap-2 rounded-xl bg-slate-50 p-3"><input type="checkbox" checked={participant.roleAccepted} onChange={(e) => setParticipant({ ...participant, roleAccepted: e.target.checked })} />AI 결과는 비교하고 고쳐 쓸 초안으로 다룹니다.</label>{!ready ? <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-black text-amber-800">팀과 이름/닉네임을 입력하면 다음 단계로 이동할 수 있습니다.</p> : null}</Box></div>;
}

function RoleTeamIntroStep() {
  return <div className="space-y-4"><V41FlowStrip currentStep={2} /><V39StepHero eyebrow="2단계 · 기본 정보 보기" icon="👥" title="이대호 팀장과 팀원 7명의 기본 성향을 봅니다" tone="indigo" description="아직 과제를 정하는 단계가 아닙니다. 먼저 팀장과 팀원의 업무 방식, 소통 방식, 강점과 성장 포인트를 가볍게 파악합니다." badges={[{ label: '팀장', value: '이대호', tone: 'indigo', icon: '👤' }, { label: '팀원', value: '7명', tone: 'emerald', icon: '👥' }, { label: '초점', value: '성향 파악', tone: 'amber', icon: '🧭' }]} />
    <Box title="이대호 팀장 기본 정보"><div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4"><p className="text-xl font-black text-slate-950">이대호 팀장</p><p className="mt-1 text-sm font-bold text-indigo-700">C1바이오 영업팀장</p><p className="mt-3 leading-7 text-slate-800">현장 경험이 길고 팀원에게 먼저 맡겨 본 뒤 필요한 순간에 방향을 잡아주는 실무형 팀장입니다.</p></div><div className="grid gap-3 md:grid-cols-2"><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black text-slate-500">리더십 스타일</p><p className="mt-1 font-bold text-slate-800">자율을 존중하되 흐름이 흔들릴 때 기준을 잡아주는 편입니다.</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black text-slate-500">강점</p><p className="mt-1 font-bold text-slate-800">현장 언어를 잘 알고 팀원의 어려움을 현실적으로 이해합니다.</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black text-slate-500">주의해서 볼 점</p><p className="mt-1 font-bold text-slate-800">성실해 보이는 팀원은 괜찮다고 판단하고 조용한 팀원의 어려움은 늦게 알아차릴 수 있습니다.</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black text-slate-500">이 단계의 초점</p><p className="mt-1 font-bold text-slate-800">과제를 정하기 전에 팀원 성향을 먼저 이해합니다.</p></div></div></Box>
    <Box title="팀원별 기본 정보와 성향"><div className="grid gap-4 lg:grid-cols-2">{MEMBERS.map((m) => <article key={m.name} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-lg font-black text-slate-950">{m.name} {m.title}</p><div className="mt-4 space-y-3 text-sm leading-6 text-slate-700"><p><b className="text-slate-950">업무 방식</b> — {m.work}</p><p><b className="text-slate-950">소통 방식</b> — {m.talk}</p><p><b className="text-slate-950">강점</b> — {m.good}</p><p><b className="text-slate-950">성장 포인트</b> — {m.grow}</p></div></article>)}</div></Box>
  </div>;
}

function LabStep({ currentStep, children }: { currentStep: number; children: ReactNode }) { return <div className="space-y-4"><V41FlowStrip currentStep={currentStep} />{children}</div>; }

function V41PreviewApp() {
  const [participant, setParticipant] = useStored<V41Participant>(V41_STORAGE_KEYS.participant, DEFAULT_PARTICIPANT);
  const [progress, setProgress] = useStored<V41Progress>(V41_STORAGE_KEYS.progress, DEFAULT_PROGRESS);
  const currentStep = clampV41Step(progress.step);
  const selectStep = (stepIndex: number) => { setProgress({ step: clampV41Step(stepIndex) }); scrollV41ToTop(); };
  const goPrev = () => selectStep(currentStep - 1);
  const goNext = () => { if (currentStep === 0 && !isParticipantReady(participant)) { showV41EntryGateMessage(); return; } selectStep(currentStep + 1); };
  const resetV41 = () => { removeStoredPrefix('ckd.v41.'); setParticipant(DEFAULT_PARTICIPANT); setProgress(DEFAULT_PROGRESS); scrollV41ToTop(); };
  const screens = [<EntryStep key="entry" participant={participant} setParticipant={setParticipant} />, <RoleTeamIntroStep key="role-team-intro" />, <LabStep key="ai-safety" currentStep={3}><AiSafetyLab /></LabStep>, <LabStep key="prompt-practice" currentStep={4}><V41PromptPracticeReviewLab /></LabStep>, <LabStep key="research-strategy" currentStep={5}><V41ResearchStrategyTrimmedLab /></LabStep>, <LabStep key="dashboard-analysis" currentStep={6}><V41PerformanceCompactCascadeLab /></LabStep>, <LabStep key="task-execution-design" currentStep={7}><V41TaskExecutionBridgeLab /></LabStep>, <LabStep key="task-priority-flow" currentStep={8}><V41TaskPriorityFlowLab /></LabStep>, <LabStep key="task-boundary-coordination" currentStep={9}><V41TaskBoundaryCoordinationLab /></LabStep>, <LabStep key="member-role" currentStep={10}><V41PeopleSelectionLab /></LabStep>, <LabStep key="people-dialogue" currentStep={11}><V41OneOnOnePracticeLab /></LabStep>];
  return <V41StepNavigationProvider onStepSelect={(n) => selectStep(n - 1)}><JourneyShell title="C1바이오 영업팀장 AI 리더십 Lab" subtitle="성과관리, 업무관리, 사람관리 흐름을 팀장 관점으로 연습합니다. v41 Preview는 기존 파일럿과 분리된 검증용 화면입니다." steps={V41_VISIBLE_APP_STEPS} currentStep={currentStep} onPrev={goPrev} onNext={goNext} onStepSelect={selectStep} hideStepOverview><V41ProgressCoachPanel currentStep={currentStep} participant={participant} onStepSelect={selectStep} /><div className="mb-4 flex justify-end"><button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-500 shadow-sm hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700" onClick={resetV41}>v41 입력 초기화</button></div>{screens[currentStep] ?? screens[0]}</JourneyShell></V41StepNavigationProvider>;
}

if (!rootElement) throw new Error('journey-root element is required for v41 preview app.');
createRoot(rootElement).render(<V41PreviewApp />);
