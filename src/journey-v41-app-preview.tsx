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

const rootElement = document.getElementById('journey-root') ?? document.getElementById('root');
const V41_PREVIEW_APP_MARKERS = ['V41PreviewApp','V41PerformanceCompactCascadeLab','V41PerformanceAiExpansionLab','김박사 추천 프롬프팅 기준','AI 추가 팀 전략과제 발굴 실습','ckd.v41.performanceCascade.aiExpansion.v1','journey-v41-preview.html'].join('|');
void V41_PREVIEW_APP_MARKERS;

const V41_STORAGE_KEYS = { participant: 'ckd.v41.participant.v1', progress: 'ckd.v41.progress.v1' };
const DEFAULT_PARTICIPANT: V41Participant = { groupName: '', tableName: '', representativeSituation: '', roleAccepted: false };
const DEFAULT_PROGRESS: V41Progress = { step: 0 };
const TEAM_OPTIONS = ['1팀', '2팀', '3팀', '4팀', '5팀', '6팀', '7팀', '8팀'];

function scrollV41ToTop() {
  window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
function isParticipantReady(p: V41Participant) {
  return Boolean(p.groupName.trim() && p.tableName.trim());
}
function showV41EntryGateMessage() {
  window.alert('먼저 팀과 이름/닉네임을 입력해 주세요.');
}
function Box({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-2xl border bg-white p-5 shadow-sm"><h3 className="text-lg font-black text-slate-900">{title}</h3><div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">{children}</div></section>;
}

function EntryStep({ participant, setParticipant }: { participant: V41Participant; setParticipant: (next: V41Participant) => void }) {
  return <div className="space-y-4"><V41FlowStrip currentStep={1} /><V39StepHero eyebrow="1단계 · 시작하기" icon="🚪" title="팀과 이름을 입력하고 바로 시작하세요" tone="indigo" description="먼저 팀과 이름만 입력하면 다음 단계부터 필요한 화면으로 이동할 수 있습니다." badges={[{ label: '필수', value: '팀 / 이름', tone: 'indigo', icon: '✅' }, { label: '역할', value: '영업팀장 관점', tone: 'emerald', icon: '👤' }]} /><Box title="시작 정보 입력"><select className="w-full rounded-xl border bg-white px-3 py-2" value={participant.groupName} onChange={(e) => setParticipant({ ...participant, groupName: e.target.value })}><option value="">팀을 선택하세요</option>{TEAM_OPTIONS.map((team) => <option key={team} value={team}>{team}</option>)}</select><input className="w-full rounded-xl border px-3 py-2" value={participant.tableName} onChange={(e) => setParticipant({ ...participant, tableName: e.target.value })} placeholder="이름 또는 닉네임" /></Box></div>;
}

function RoleTeamIntroStep() {
  return <div className="space-y-4"><V41FlowStrip currentStep={2} /><V39StepHero eyebrow="2단계 · 기본 정보 보기" icon="👥" title="이대호 팀장과 팀원 기본 성향을 봅니다" tone="indigo" description="과제를 정하기 전에 팀장과 팀원의 경력, 업무스타일, 소통스타일을 먼저 이해합니다." badges={[{ label: '팀장', value: '이대호', tone: 'indigo', icon: '👤' }, { label: '초점', value: '성향 파악', tone: 'amber', icon: '🧭' }]} /><Box title="팀장과 팀원 이해"><p>이 단계는 전략과제를 정하기 전에 팀장과 팀원의 기본 업무 성향을 확인하는 준비 단계입니다.</p><p>다음 단계부터 AI 질문 다듬기, 전사 전략과제 분석, 팀 기준 만들기로 이어집니다.</p></Box></div>;
}

function LabStep({ currentStep, children }: { currentStep: number; children: ReactNode }) {
  return <div className="space-y-4"><V41FlowStrip currentStep={currentStep} />{children}</div>;
}

function PerformanceStep() {
  return <LabStep currentStep={5}><V41PerformanceCompactCascadeLab /><V41PerformanceAiExpansionLab /></LabStep>;
}

function V41PreviewApp() {
  const [participant, setParticipant] = useStored<V41Participant>(V41_STORAGE_KEYS.participant, DEFAULT_PARTICIPANT);
  const [progress, setProgress] = useStored<V41Progress>(V41_STORAGE_KEYS.progress, DEFAULT_PROGRESS);
  const currentStep = clampV41Step(progress.step);
  const selectStep = (stepIndex: number) => { setProgress({ step: clampV41Step(stepIndex) }); scrollV41ToTop(); };
  const goPrev = () => selectStep(currentStep - 1);
  const goNext = () => { if (currentStep === 0 && !isParticipantReady(participant)) { showV41EntryGateMessage(); return; } selectStep(currentStep + 1); };
  const resetV41 = () => { removeStoredPrefix('ckd.v41.'); setParticipant(DEFAULT_PARTICIPANT); setProgress(DEFAULT_PROGRESS); scrollV41ToTop(); };
  const screens = [
    <EntryStep key="entry" participant={participant} setParticipant={setParticipant} />,
    <RoleTeamIntroStep key="role-team-intro" />,
    <LabStep key="prompt-practice" currentStep={3}><V41PromptPracticeReviewLab /></LabStep>,
    <LabStep key="research-strategy" currentStep={4}><V41ResearchStrategyTrimmedLab /></LabStep>,
    <PerformanceStep key="dashboard-analysis" />,
    <LabStep key="task-execution-design" currentStep={6}><V41TaskExecutionBridgeLab /></LabStep>,
    <LabStep key="task-priority-flow" currentStep={7}><V41TaskPriorityFlowLab /></LabStep>,
    <LabStep key="task-boundary-coordination" currentStep={8}><V41TaskBoundaryCoordinationLab /></LabStep>,
    <LabStep key="member-role" currentStep={9}><V41PeopleSelectionLab /></LabStep>,
    <LabStep key="people-dialogue" currentStep={10}><V41OneOnOnePracticeLab /></LabStep>,
  ];
  return <V41StepNavigationProvider onStepSelect={(n) => selectStep(n - 1)}><JourneyShell title="C1바이오 영업팀장 AI 리더십 Lab" subtitle="성과관리, 업무관리, 사람관리 흐름을 팀장 관점으로 연습합니다. v41 Preview는 기존 파일럿과 분리된 검증용 화면입니다." steps={V41_VISIBLE_APP_STEPS} currentStep={currentStep} onPrev={goPrev} onNext={goNext} onStepSelect={selectStep} hideStepOverview><V41ProgressCoachPanel currentStep={currentStep} participant={participant} onStepSelect={selectStep} /><div className="mb-4 flex justify-end"><button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-500 shadow-sm hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700" onClick={resetV41}>v41 입력 초기화</button></div>{screens[currentStep] ?? screens[0]}</JourneyShell></V41StepNavigationProvider>;
}

if (!rootElement) throw new Error('journey-root element is required for v41 preview app.');
createRoot(rootElement).render(<V41PreviewApp />);
