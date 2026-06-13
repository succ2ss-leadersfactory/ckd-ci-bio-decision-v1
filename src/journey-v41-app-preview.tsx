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
import { V40VNextPerformanceCompactCascadeLab } from './journey-v40-vnext-performance-compact-cascade-lab';
import { V40VNextTaskExecutionBridgeLab } from './journey-v40-vnext-task-execution-bridge-lab';
import { V40VNextTaskPriorityFlowLab } from './journey-v40-vnext-task-management-lab';
import { V40VNextTaskBoundaryCoordinationLab } from './journey-v40-vnext-task-boundary-coordination-lab';
import { V40VNextPeopleSelectionLab } from './journey-v40-vnext-people-selection-lab';
import { V40VNextOneOnOnePracticeLab } from './journey-v40-vnext-one-on-one-practice-lab';

type V41Participant = { groupName: string; tableName: string; representativeSituation: string; roleAccepted: boolean };
type V41Progress = { step: number };
type TeamMember = { name: string; role: string; signal: string };
type V41StorageScopePair = (typeof V41_STORAGE_SCOPE_KEYS)[keyof typeof V41_STORAGE_SCOPE_KEYS];

const rootElement = document.getElementById('journey-root') ?? document.getElementById('root');

const V41_PREVIEW_APP_MARKERS = [
  'V41PreviewApp',
  'journey-v41-preview.html',
  'v41 isolated app shell',
  'v41 entry step simplified',
  'v41 entry and team intro copy refined',
  'v41 learner-facing title refined',
  'v41 prompt practice lab cloned',
  'v41 research strategy lab cloned',
  'V41PromptPracticeReviewLab',
  'V41ResearchStrategyTrimmedLab',
  'v41 team name gate',
  'v40-vNext parity scaffold with v41 core',
  'V41_VISIBLE_APP_STEPS',
  'V41FlowStrip',
  'V41ProgressCoachPanel',
  'V41LabStorageScope',
  'ckd.v41.participant.v1',
  'ckd.v41.progress.v1',
  'ckd.v41.promptPracticeReview.v2',
  'ckd.v41.pharmaStrategyResearch.v1',
  'ckd.v41.performanceCascade.v1',
  'ckd.v41.taskManagement.v10',
  'ckd.v41.peopleManagement.v2',
  'existing pilot URLs preserved',
  'ckd-ai-lab.html 보호',
  'journey-v40-vnext-preview.html 보호',
  'src/journey-v40-vnext-*.tsx 직접 수정 금지',
].join('|');
void V41_PREVIEW_APP_MARKERS;

const V41_STORAGE_KEYS = { participant: 'ckd.v41.participant.v1', progress: 'ckd.v41.progress.v1' };
const DEFAULT_PARTICIPANT: V41Participant = { groupName: '', tableName: '', representativeSituation: '', roleAccepted: false };
const DEFAULT_PROGRESS: V41Progress = { step: 0 };
const TEAM_OPTIONS = ['1팀', '2팀', '3팀', '4팀', '5팀', '6팀', '7팀', '8팀'];

const TEAM_MEMBERS: TeamMember[] = [
  { name: '김재호 차장', role: '경험 많은 선임 영업 담당', signal: '성과 경험은 많지만 기록 방식이 개인화되어 있습니다.' },
  { name: '김문호 차장', role: '안정적 실행형 담당', signal: '기본 활동은 꾸준하지만 새로운 실행 기준 전환은 느릴 수 있습니다.' },
  { name: '유희관 과장', role: '관계 기반 영업 담당', signal: '고객 관계는 좋지만 후속 실행 증거가 약해질 수 있습니다.' },
  { name: '이대은 대리', role: '활동량 높은 실행형 담당', signal: '움직임은 빠르지만 우선순위와 기록 품질 점검이 필요합니다.' },
  { name: '신재영 대리', role: '분석적이고 신중한 담당', signal: '판단은 세밀하지만 실행 속도와 대화 타이밍을 살펴야 합니다.' },
  { name: '박재욱 사원', role: '신입에 가까운 성장형 담당', signal: '업무 기준과 고객 대화의 안전선을 구체적으로 알려줘야 합니다.' },
  { name: '문교원 사원', role: '새로운 방식에 빠르게 적응하는 담당', signal: '도구 활용은 빠르지만 현장 언어로 바꾸는 코칭이 필요합니다.' },
];

function scrollV41ToTop() {
  window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function isParticipantReady(participant: V41Participant) {
  return Boolean(participant.groupName.trim() && participant.tableName.trim());
}

function showV41EntryGateMessage() {
  window.alert('먼저 팀과 이름/닉네임을 입력해 주세요. 그다음부터는 필요한 단계로 바로 이동할 수 있습니다.');
}

function V41ComplianceNotice() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
      <p className="font-black">AI에 넣기 전 확인할 것</p>
      <p className="mt-1">실제 고객, 기관, 사람, 수치, 내부 전략처럼 식별되거나 민감한 정보는 가상·익명 표현으로 바꿉니다.</p>
    </div>
  );
}

function ShellCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-black text-slate-900">{title}</h3>
      <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">{children}</div>
    </section>
  );
}

function EntryStep({ participant, setParticipant }: { participant: V41Participant; setParticipant: (next: V41Participant) => void }) {
  const ready = isParticipantReady(participant);

  return (
    <div className="space-y-4">
      <V41FlowStrip currentStep={1} />
      <V39StepHero
        eyebrow="1단계 · 시작하기"
        icon="🚪"
        title="팀과 이름을 입력하고 바로 시작하세요"
        tone="indigo"
        description="오늘 실습은 C1바이오 영업팀장 관점으로 진행됩니다. 먼저 팀과 이름만 입력하면 다음 단계부터 필요한 화면으로 바로 이동할 수 있습니다."
        badges={[
          { label: '필수', value: '팀 / 이름', tone: 'indigo', icon: '✅' },
          { label: '역할', value: '영업팀장 관점', tone: 'emerald', icon: '👤' },
          { label: '방식', value: '필요 단계 이동', tone: 'amber', icon: '🧭' },
        ]}
      />

      <section className="rounded-3xl border border-indigo-100 bg-white p-4 shadow-sm md:p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-indigo-50 p-4">
            <p className="text-sm font-black text-indigo-950">1. 팀 선택</p>
            <p className="mt-1 text-xs font-bold leading-5 text-indigo-800">조 활동 기준으로 선택합니다.</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-4">
            <p className="text-sm font-black text-emerald-950">2. 이름 입력</p>
            <p className="mt-1 text-xs font-bold leading-5 text-emerald-800">닉네임이나 테이블명도 괜찮습니다.</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-4">
            <p className="text-sm font-black text-amber-950">3. 바로 이동</p>
            <p className="mt-1 text-xs font-bold leading-5 text-amber-800">2단계 이후에는 필요한 화면으로 이동합니다.</p>
          </div>
        </div>
      </section>

      <V41ComplianceNotice />

      <ShellCard title="시작 정보 입력">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-bold text-slate-500">팀 <span className="text-rose-600">필수</span></span>
            <select className="w-full rounded-xl border bg-white px-3 py-2" value={participant.groupName} onChange={(event) => setParticipant({ ...participant, groupName: event.target.value })}>
              <option value="">팀을 선택하세요</option>
              {TEAM_OPTIONS.map((team) => <option key={team} value={team}>{team}</option>)}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-xs font-bold text-slate-500">이름/닉네임 <span className="text-rose-600">필수</span></span>
            <input className="w-full rounded-xl border bg-white px-3 py-2" value={participant.tableName} onChange={(event) => setParticipant({ ...participant, tableName: event.target.value })} placeholder="예: 김팀장, A테이블, 리더1" />
          </label>
        </div>
        <label className="block space-y-1">
          <span className="text-xs font-bold text-slate-500">오늘 다뤄보고 싶은 상황 <span className="text-slate-400">선택</span></span>
          <textarea className="min-h-20 w-full rounded-xl border px-3 py-2" value={participant.representativeSituation} onChange={(event) => setParticipant({ ...participant, representativeSituation: event.target.value })} placeholder="예: 고객 반응은 기록되는데 다음 행동으로 잘 이어지지 않는다." />
        </label>
        <label className="flex items-start gap-2 rounded-xl bg-slate-50 p-3">
          <input className="mt-1" type="checkbox" checked={participant.roleAccepted} onChange={(event) => setParticipant({ ...participant, roleAccepted: event.target.checked })} />
          <span>AI 결과는 답이 아니라 비교하고 고쳐 쓸 초안으로 다룹니다.</span>
        </label>
        {!ready ? <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-black text-amber-800">팀과 이름/닉네임을 입력하면 다음 단계로 이동할 수 있습니다.</p> : null}
      </ShellCard>
    </div>
  );
}

function RoleTeamIntroStep() {
  return (
    <div className="space-y-4">
      <V41FlowStrip currentStep={2} />
      <V39StepHero
        eyebrow="2단계 · 팀원 보기"
        icon="👥"
        title="오늘 함께 볼 팀원 7명입니다"
        tone="indigo"
        description="이대호 팀장 관점에서 팀원별 실행 신호를 가볍게 확인합니다. 지금은 평가가 아니라 이후 1on1과 업무관리에서 참고할 관찰 자료를 보는 단계입니다."
        badges={[
          { label: '역할', value: '이대호 팀장', tone: 'indigo', icon: '👤' },
          { label: '팀원', value: '7명', tone: 'emerald', icon: '👥' },
          { label: '관점', value: '관찰 먼저', tone: 'amber', icon: '🔎' },
        ]}
      />
      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-4">
          <p className="text-sm font-black text-cyan-950">먼저 볼 것</p>
          <p className="mt-2 text-sm leading-6 text-cyan-900">팀원별로 어떤 실행 신호가 보이는지 확인합니다.</p>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-sm font-black text-emerald-950">아직 하지 않을 것</p>
          <p className="mt-2 text-sm leading-6 text-emerald-900">성급하게 평가하거나 원인을 단정하지 않습니다.</p>
        </div>
        <div className="rounded-3xl border border-amber-100 bg-amber-50 p-4">
          <p className="text-sm font-black text-amber-950">나중에 쓸 곳</p>
          <p className="mt-2 text-sm leading-6 text-amber-900">10·11단계에서 1on1 대상과 첫 문장을 준비할 때 다시 활용합니다.</p>
        </div>
      </section>
      <ShellCard title="팀원별 실행 신호">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-black text-slate-950">{member.name}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">{member.role}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{member.signal}</p>
            </div>
          ))}
        </div>
      </ShellCard>
    </div>
  );
}

function LabStep({ currentStep, children }: { currentStep: number; children: ReactNode }) {
  return <div className="space-y-4"><V41FlowStrip currentStep={currentStep} />{children}</div>;
}

function ScopedLabStep({ currentStep, pairs, children }: { currentStep: number; pairs: V41StorageScopePair[]; children: ReactNode }) {
  return <LabStep currentStep={currentStep}><V41LabStorageScope pairs={pairs}>{children}</V41LabStorageScope></LabStep>;
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
    <LabStep key="ai-safety" currentStep={3}><AiSafetyLab /></LabStep>,
    <LabStep key="prompt-practice" currentStep={4}><V41PromptPracticeReviewLab /></LabStep>,
    <LabStep key="research-strategy" currentStep={5}><V41ResearchStrategyTrimmedLab /></LabStep>,
    <ScopedLabStep key="dashboard-analysis" currentStep={6} pairs={[V41_STORAGE_SCOPE_KEYS.performanceCascade]}><V40VNextPerformanceCompactCascadeLab /></ScopedLabStep>,
    <ScopedLabStep key="task-execution-design" currentStep={7} pairs={[V41_STORAGE_SCOPE_KEYS.performanceCascade, V41_STORAGE_SCOPE_KEYS.taskManagement]}><V40VNextTaskExecutionBridgeLab /></ScopedLabStep>,
    <ScopedLabStep key="task-priority-flow" currentStep={8} pairs={[V41_STORAGE_SCOPE_KEYS.taskManagement]}><V40VNextTaskPriorityFlowLab /></ScopedLabStep>,
    <ScopedLabStep key="task-boundary-coordination" currentStep={9} pairs={[V41_STORAGE_SCOPE_KEYS.taskManagement]}><V40VNextTaskBoundaryCoordinationLab /></ScopedLabStep>,
    <ScopedLabStep key="member-role" currentStep={10} pairs={[V41_STORAGE_SCOPE_KEYS.taskManagement, V41_STORAGE_SCOPE_KEYS.peopleManagement]}><V40VNextPeopleSelectionLab /></ScopedLabStep>,
    <ScopedLabStep key="people-dialogue" currentStep={11} pairs={[V41_STORAGE_SCOPE_KEYS.peopleManagement]}><V40VNextOneOnOnePracticeLab /></ScopedLabStep>,
  ];

  return (
    <V41StepNavigationProvider onStepSelect={(stepNumber) => selectStep(stepNumber - 1)}>
      <JourneyShell title="C1바이오 영업팀장 AI 리더십 Lab" subtitle="성과관리, 업무관리, 사람관리 흐름을 팀장 관점으로 연습합니다. v41 Preview는 기존 파일럿과 분리된 검증용 화면입니다." steps={V41_VISIBLE_APP_STEPS} currentStep={currentStep} onPrev={goPrev} onNext={goNext} onStepSelect={selectStep} hideStepOverview>
        <V41ProgressCoachPanel currentStep={currentStep} participant={participant} onStepSelect={selectStep} />
        <div className="mb-4 flex justify-end"><button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-500 shadow-sm hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700" onClick={resetV41}>v41 입력 초기화</button></div>
        {screens[currentStep] ?? screens[0]}
      </JourneyShell>
    </V41StepNavigationProvider>
  );
}

if (!rootElement) throw new Error('journey-root element is required for v41 preview app.');
createRoot(rootElement).render(<V41PreviewApp />);
