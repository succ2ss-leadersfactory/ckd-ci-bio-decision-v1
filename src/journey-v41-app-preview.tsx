import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { JourneyShell } from './journey-shell';
import { AiSafetyLab } from './journey-v36-ai-safety-lab';
import { removeStoredPrefix, useStored } from './journey-storage';
import { V39StepHero } from './journey-v39-ux-components';
import { V41LabStorageScope, V41_STORAGE_SCOPE_KEYS } from './journey-v41-lab-storage-scope';
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
import { V40VNextOneOnOnePracticeLab } from './journey-v40-vnext-one-on-one-practice-lab';

type V41Participant = { groupName: string; tableName: string; representativeSituation: string; roleAccepted: boolean };
type V41Progress = { step: number };
type V41StorageScopePair = (typeof V41_STORAGE_SCOPE_KEYS)[keyof typeof V41_STORAGE_SCOPE_KEYS];

const rootElement = document.getElementById('journey-root') ?? document.getElementById('root');
const V41_PREVIEW_APP_MARKERS = [
  'V41PreviewApp','journey-v41-preview.html','v41 isolated app shell','v41 entry step simplified','v41 entry and team intro copy refined','v41 learner-facing title refined','v41 prompt practice lab cloned','v41 research strategy lab cloned','v41 performance cascade lab cloned','v41 task execution bridge lab cloned','v41 task priority flow lab cloned','v41 task boundary coordination lab cloned','v41 people selection lab cloned','V41PromptPracticeReviewLab','V41ResearchStrategyTrimmedLab','V41PerformanceCompactCascadeLab','V41TaskExecutionBridgeLab','V41TaskPriorityFlowLab','V41TaskBoundaryCoordinationLab','V41PeopleSelectionLab','v41 team name gate','v40-vNext parity scaffold with v41 core','V41_VISIBLE_APP_STEPS','V41FlowStrip','V41ProgressCoachPanel','V41LabStorageScope','ckd.v41.participant.v1','ckd.v41.progress.v1','ckd.v41.promptPracticeReview.v2','ckd.v41.pharmaStrategyResearch.v1','ckd.v41.performanceCascade.v1','ckd.v41.taskManagement.v10','ckd.v41.peopleManagement.v2','existing pilot URLs preserved','ckd-ai-lab.html 보호','journey-v40-vnext-preview.html 보호','src/journey-v40-vnext-*.tsx 직접 수정 금지'
].join('|');
void V41_PREVIEW_APP_MARKERS;

const V41_STORAGE_KEYS = { participant: 'ckd.v41.participant.v1', progress: 'ckd.v41.progress.v1' };
const DEFAULT_PARTICIPANT: V41Participant = { groupName: '', tableName: '', representativeSituation: '', roleAccepted: false };
const DEFAULT_PROGRESS: V41Progress = { step: 0 };
const TEAM_OPTIONS = ['1팀', '2팀', '3팀', '4팀', '5팀', '6팀', '7팀', '8팀'];
const TEAM_MEMBERS = ['김재호 차장', '김문호 차장', '유희관 과장', '이대은 대리', '신재영 대리', '박재욱 사원', '문교원 사원'];
function scrollV41ToTop() { window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' })); }
function isParticipantReady(p: V41Participant) { return Boolean(p.groupName.trim() && p.tableName.trim()); }
function showV41EntryGateMessage() { window.alert('먼저 팀과 이름/닉네임을 입력해 주세요. 그다음부터는 필요한 단계로 바로 이동할 수 있습니다.'); }
function Box({ title, children }: { title: string; children: ReactNode }) { return <section className="rounded-2xl border bg-white p-5 shadow-sm"><h3 className="text-lg font-black text-slate-900">{title}</h3><div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">{children}</div></section>; }
function EntryStep({ participant, setParticipant }: { participant: V41Participant; setParticipant: (next: V41Participant) => void }) {
  const ready = isParticipantReady(participant);
  return <div className="space-y-4"><V41FlowStrip currentStep={1} /><V39StepHero eyebrow="1단계 · 시작하기" icon="🚪" title="팀과 이름을 입력하고 바로 시작하세요" tone="indigo" description="오늘 실습은 C1바이오 영업팀장 관점으로 진행됩니다. 먼저 팀과 이름만 입력하면 다음 단계부터 필요한 화면으로 바로 이동할 수 있습니다." badges={[{ label: '필수', value: '팀 / 이름', tone: 'indigo', icon: '✅' }, { label: '역할', value: '영업팀장 관점', tone: 'emerald', icon: '👤' }, { label: '방식', value: '필요 단계 이동', tone: 'amber', icon: '🧭' }]} /><Box title="시작 정보 입력"><select className="w-full rounded-xl border bg-white px-3 py-2" value={participant.groupName} onChange={(e) => setParticipant({ ...participant, groupName: e.target.value })}><option value="">팀을 선택하세요</option>{TEAM_OPTIONS.map((team) => <option key={team}>{team}</option>)}</select><input className="w-full rounded-xl border bg-white px-3 py-2" value={participant.tableName} onChange={(e) => setParticipant({ ...participant, tableName: e.target.value })} placeholder="이름/닉네임" /><textarea className="min-h-20 w-full rounded-xl border px-3 py-2" value={participant.representativeSituation} onChange={(e) => setParticipant({ ...participant, representativeSituation: e.target.value })} placeholder="오늘 다뤄보고 싶은 상황" /><label className="flex gap-2 rounded-xl bg-slate-50 p-3"><input type="checkbox" checked={participant.roleAccepted} onChange={(e) => setParticipant({ ...participant, roleAccepted: e.target.checked })} />AI 결과는 답이 아니라 비교하고 고쳐 쓸 초안으로 다룹니다.</label>{!ready ? <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-black text-amber-800">팀과 이름/닉네임을 입력하면 다음 단계로 이동할 수 있습니다.</p> : null}</Box></div>;
}
function RoleTeamIntroStep() { return <div className="space-y-4"><V41FlowStrip currentStep={2} /><V39StepHero eyebrow="2단계 · 팀원 보기" icon="👥" title="오늘 함께 볼 팀원 7명입니다" tone="indigo" description="팀원별 실행 신호를 가볍게 확인합니다. 지금은 평가가 아니라 이후 1on1과 업무관리에서 참고할 관찰 자료를 보는 단계입니다." badges={[{ label: '역할', value: '이대호 팀장', tone: 'indigo', icon: '👤' }, { label: '팀원', value: '7명', tone: 'emerald', icon: '👥' }, { label: '관점', value: '관찰 먼저', tone: 'amber', icon: '🔎' }]} /><Box title="팀원별 실행 신호"><div className="grid gap-3 md:grid-cols-3">{TEAM_MEMBERS.map((name) => <div key={name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="font-black text-slate-950">{name}</p><p className="mt-2 text-sm leading-6 text-slate-700">실행 신호를 관찰하고 이후 1on1에서 확인합니다.</p></div>)}</div></Box></div>; }
function LabStep({ currentStep, children }: { currentStep: number; children: ReactNode }) { return <div className="space-y-4"><V41FlowStrip currentStep={currentStep} />{children}</div>; }
function ScopedLabStep({ currentStep, pairs, children }: { currentStep: number; pairs: V41StorageScopePair[]; children: ReactNode }) { return <LabStep currentStep={currentStep}><V41LabStorageScope pairs={pairs}>{children}</V41LabStorageScope></LabStep>; }
function V41PreviewApp() {
  const [participant, setParticipant] = useStored<V41Participant>(V41_STORAGE_KEYS.participant, DEFAULT_PARTICIPANT);
  const [progress, setProgress] = useStored<V41Progress>(V41_STORAGE_KEYS.progress, DEFAULT_PROGRESS);
  const currentStep = clampV41Step(progress.step);
  const selectStep = (stepIndex: number) => { setProgress({ step: clampV41Step(stepIndex) }); scrollV41ToTop(); };
  const goPrev = () => selectStep(currentStep - 1);
  const goNext = () => { if (currentStep === 0 && !isParticipantReady(participant)) { showV41EntryGateMessage(); return; } selectStep(currentStep + 1); };
  const resetV41 = () => { removeStoredPrefix('ckd.v41.'); setParticipant(DEFAULT_PARTICIPANT); setProgress(DEFAULT_PROGRESS); scrollV41ToTop(); };
  const screens = [<EntryStep key="entry" participant={participant} setParticipant={setParticipant} />, <RoleTeamIntroStep key="role-team-intro" />, <LabStep key="ai-safety" currentStep={3}><AiSafetyLab /></LabStep>, <LabStep key="prompt-practice" currentStep={4}><V41PromptPracticeReviewLab /></LabStep>, <LabStep key="research-strategy" currentStep={5}><V41ResearchStrategyTrimmedLab /></LabStep>, <LabStep key="dashboard-analysis" currentStep={6}><V41PerformanceCompactCascadeLab /></LabStep>, <LabStep key="task-execution-design" currentStep={7}><V41TaskExecutionBridgeLab /></LabStep>, <LabStep key="task-priority-flow" currentStep={8}><V41TaskPriorityFlowLab /></LabStep>, <LabStep key="task-boundary-coordination" currentStep={9}><V41TaskBoundaryCoordinationLab /></LabStep>, <LabStep key="member-role" currentStep={10}><V41PeopleSelectionLab /></LabStep>, <ScopedLabStep key="people-dialogue" currentStep={11} pairs={[V41_STORAGE_SCOPE_KEYS.peopleManagement]}><V40VNextOneOnOnePracticeLab /></ScopedLabStep>];
  return <V41StepNavigationProvider onStepSelect={(n) => selectStep(n - 1)}><JourneyShell title="C1바이오 영업팀장 AI 리더십 Lab" subtitle="성과관리, 업무관리, 사람관리 흐름을 팀장 관점으로 연습합니다. v41 Preview는 기존 파일럿과 분리된 검증용 화면입니다." steps={V41_VISIBLE_APP_STEPS} currentStep={currentStep} onPrev={goPrev} onNext={goNext} onStepSelect={selectStep} hideStepOverview><V41ProgressCoachPanel currentStep={currentStep} participant={participant} onStepSelect={selectStep} /><div className="mb-4 flex justify-end"><button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-500 shadow-sm hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700" onClick={resetV41}>v41 입력 초기화</button></div>{screens[currentStep] ?? screens[0]}</JourneyShell></V41StepNavigationProvider>;
}
if (!rootElement) throw new Error('journey-root element is required for v41 preview app.');
createRoot(rootElement).render(<V41PreviewApp />);
