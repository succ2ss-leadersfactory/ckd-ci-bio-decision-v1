import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { JourneyShell } from './journey-shell';
import { AiSafetyLab } from './journey-v36-ai-safety-lab';
import { removeStoredPrefix, useStored } from './journey-storage';
import { V39AiCallPlanGuidedUxLab } from './journey-v39-ai-call-plan-guided-ux-lab';
import { V39ComplianceCleanupUxLab } from './journey-v39-compliance-cleanup-ux-lab';
import { V39CustomerJudgmentUxLab } from './journey-v39-customer-judgment-ux-lab';
import { V39CustomerPriorityUxLab } from './journey-v39-customer-priority-ux-lab';
import { V39DashboardAnalysisUxLab } from './journey-v39-dashboard-analysis-ux-lab';
import { V39DirectConcernContextCard } from './journey-v39-direct-concern-context-card';
import { V39FinalCallPlanCard } from './journey-v39-final-call-plan-card';
import { V39FinalCallPlanOnePageGuidance } from './journey-v39-final-call-plan-one-page-guidance';
import { V39FinalCallPlanTeamSevenUxCard } from './journey-v39-final-call-plan-team-seven-ux-card';
import { V39InstructorDiscussionLab } from './journey-v39-instructor-discussion-lab';
import { V39InstructorDiscussionUxLab } from './journey-v39-instructor-discussion-ux-lab';
import { V39MemberRoleUxLab } from './journey-v39-member-role-ux-lab';
import { V39NotebookLmGuidedResearchLab } from './journey-v39-notebooklm-guided-research-lab';
import { V39PeopleDialogueUxLab } from './journey-v39-people-dialogue-ux-lab';
import { V39PromptConcernBridgeCard } from './journey-v39-prompt-concern-bridge-card';
import { V39PromptPracticeOptimizedLab } from './journey-v39-prompt-practice-optimized-lab';
import { V39TeamSevenCoachingUxWrapper } from './journey-v39-team-seven-coaching-ux-wrapper';
import { V39FlowStrip, V39MinimumChecklist, V39MiniFlow, V39SafetyStrip, V39StepHero, V39StepNavigationProvider } from './journey-v39-ux-components';
import { clampV39Step, V39_VISIBLE_APP_STEPS } from './journey-v39-preview-config';

const rootElement = document.getElementById('journey-root') ?? document.getElementById('root');
const V39_STATIC_ROUTE_MARKERS = 'V39ComplianceCleanupLab V39ResearchStrategyLab V39NotebookLmGuidedResearchLab V39PromptPracticeOptimizedLab V39PromptConcernBridgeCard V39DirectConcernContextCard V39TeamSevenCoachingMap V39TeamSevenCoachingUxWrapper V39AiCallPlanUxLab V39AiCallPlanGuidedUxLab V39FinalCallPlanTeamSevenUxCard V39FinalCallPlanOnePageGuidance 3단계에서 선택한 우리 팀 고민 6단계 고객 Data 확인 List 연결 V39StepHero V39FlowStrip 1단계 입장 2단계 AI 안전선 3단계 질문 연습 4단계 전략 리서치 hideStepOverview route wrapper order V39StepNavigationProvider v39 full storage reset removeStoredPrefix';
void V39_STATIC_ROUTE_MARKERS;
void V39FinalCallPlanCard;
void V39InstructorDiscussionLab;

type V39Participant = {
  name: string;
  teamName: string;
  roleAccepted: boolean;
};

type V39Progress = {
  step: number;
};

const V39_STORAGE_KEYS = {
  participant: 'ckd.v39.participant.v1',
  progress: 'ckd.v39.progress.v1',
};

const DEFAULT_PARTICIPANT: V39Participant = {
  name: '',
  teamName: '',
  roleAccepted: false,
};

const DEFAULT_PROGRESS: V39Progress = {
  step: 0,
};

const TEAM_OPTIONS = ['1팀', '2팀', '3팀', '4팀', '5팀', '6팀', '7팀', '8팀'];

function scrollV39ToTop() {
  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function ComplianceNotice() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="font-bold">AI에 그대로 넣으면 안 되는 말</p>
      <p className="mt-1">실습은 가상 상황으로만 진행합니다. 실제 고객·기관·제품·숫자·개인 이야기는 넣지 않습니다.</p>
    </div>
  );
}

function ShellCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <div className="mt-3 space-y-3 text-sm text-slate-700">{children}</div>
    </section>
  );
}

function EntryStep({ participant, setParticipant }: { participant: V39Participant; setParticipant: (next: V39Participant) => void }) {
  return (
    <div className="space-y-4">
      <V39FlowStrip currentStep={1} />
      <V39StepHero
        eyebrow="1단계 · 오늘 역할 잡기"
        icon="🚪"
        title="오늘은 현장에서 판단해야 하는 영업팀장입니다"
        tone="indigo"
        description="정답을 고르는 시간이 아닙니다. 고객 반응, 팀원 움직임, AI가 정리한 초안을 놓고 ‘이번 2주를 어떻게 끌고 갈지’ 직접 정리해 봅니다. 편한 팀명과 닉네임만 적고 시작하세요."
        badges={[
          { label: '오늘 역할', value: '영업팀장', tone: 'indigo', icon: '👤' },
          { label: '오늘 할 일', value: '판단 정리', tone: 'emerald', icon: '📝' },
          { label: '전제', value: '가상 상황', tone: 'amber', icon: '🛡️' },
        ]}
      />
      <section className="rounded-3xl border border-indigo-100 bg-white p-4 shadow-sm md:p-5">
        <V39MiniFlow
          items={[
            { icon: '🚪', title: '오늘 역할 잡기', body: 'C1바이오 영업팀장 입장에서 상황을 봅니다.' },
            { icon: '🛡️', title: '말해도 되는 선 확인', body: 'AI에 넣으면 안 되는 실제 정보를 먼저 지웁니다.' },
            { icon: '✍️', title: '우리 팀 고민 적기', body: '막연한 고민을 AI에게 물어볼 질문으로 바꿉니다.' },
          ]}
        />
        <div className="mt-3">
          <V39MinimumChecklist tone="indigo" items={['팀명 선택', '이름 또는 닉네임 입력', '오늘 역할 확인']} />
        </div>
      </section>
      <ComplianceNotice />
      <ShellCard title="오늘 맡을 역할">
        <p>오늘은 C1바이오 영업2본부 수도권중부영업팀장이라고 가정합니다. 시장 변화와 고객 반응, 팀원들의 움직임을 읽고 다음 2주를 정리합니다.</p>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">팀명</span>
            <select className="w-full rounded-xl border bg-white px-3 py-2" value={participant.teamName} onChange={(event) => setParticipant({ ...participant, teamName: event.target.value })}>
              <option value="">팀을 선택하세요</option>
              {TEAM_OPTIONS.map((team) => <option key={team} value={team}>{team}</option>)}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">이름/닉네임</span>
            <input className="w-full rounded-xl border px-3 py-2" value={participant.name} onChange={(event) => setParticipant({ ...participant, name: event.target.value })} placeholder="예: 콜플랜마스터" />
          </label>
        </div>
        <label className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
          <input type="checkbox" checked={participant.roleAccepted} onChange={(event) => setParticipant({ ...participant, roleAccepted: event.target.checked })} />
          <span>오늘은 C1바이오 영업팀장 입장에서 판단해 보겠습니다.</span>
        </label>
      </ShellCard>
    </div>
  );
}

function V39AiSafetyStep() {
  return (
    <div className="space-y-4">
      <V39FlowStrip currentStep={2} />
      <V39StepHero
        eyebrow="2단계 · 말해도 되는 선부터 확인"
        icon="🛡️"
        title="AI를 쓰기 전에, 먼저 지워야 할 말이 있습니다"
        tone="amber"
        description="현장 이야기를 AI에 그대로 넣으면 안 됩니다. 실제 고객명, 기관명, 제품명, 내부 숫자, 개인 사정은 빼고 익명화된 상황과 고민만 남깁니다. 이 기준은 뒤 화면에서도 계속 지킵니다."
        badges={[
          { label: '먼저 할 일', value: '민감정보 지우기', tone: 'amber', icon: '🛡️' },
          { label: '다음', value: '질문 다듬기', tone: 'violet', icon: '✍️' },
          { label: '계속 지킬 기준', value: '전체 실습', tone: 'emerald', icon: '✅' },
        ]}
      />
      <V39SafetyStrip>
        실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다. AI는 결정을 대신하는 사람이 아니라, 팀장의 생각을 정리해 주는 도구입니다.
      </V39SafetyStrip>
      <AiSafetyLab />
    </div>
  );
}

function V39PromptPracticeStep() {
  return (
    <div className="space-y-4">
      <V39FlowStrip currentStep={3} />
      <V39StepHero
        eyebrow="3단계 · 질문 다듬기"
        icon="✍️"
        title="그냥 묻지 말고, 팀장 고민을 질문으로 바꿉니다"
        tone="violet"
        description="AI에게 ‘어떻게 할까요?’라고만 물으면 뻔한 답이 나옵니다. 우리 팀 상황, 무엇을 정리하고 싶은지, 어떤 모양으로 받고 싶은지를 함께 적어야 현장에서 쓸 만한 답이 나옵니다."
        badges={[
          { label: '앞에서 한 것', value: '안전선 확인', tone: 'amber', icon: '🛡️' },
          { label: '지금 할 것', value: '질문 다듬기', tone: 'violet', icon: '✍️' },
          { label: '다음', value: '자료로 넓히기', tone: 'sky', icon: '🔭' },
        ]}
      />
      <section className="rounded-3xl border border-violet-100 bg-white p-4 shadow-sm md:p-5">
        <V39MiniFlow
          items={[
            { icon: '🧑‍💼', title: '관점 정하기', body: 'AI가 어떤 입장에서 봐야 하는지 먼저 알려줍니다.' },
            { icon: '📌', title: '상황 붙이기', body: '우리 팀의 현장 상황과 제약을 짧게 적습니다.' },
            { icon: '📋', title: '받고 싶은 모양 정하기', body: '회의 문장, 체크리스트, 질문 목록처럼 필요한 형태를 말합니다.' },
          ]}
        />
      </section>
      <V39PromptPracticeOptimizedLab />
    </div>
  );
}

function V39ResearchStrategyStep() {
  return (
    <div className="space-y-4">
      <V39FlowStrip currentStep={4} />
      <V39StepHero
        eyebrow="4단계 · 시장 변화 보기"
        icon="🔭"
        title="자료를 모으는 게 아니라, 우리 팀 질문을 뽑습니다"
        tone="sky"
        description="공개자료를 읽고 끝내지 않습니다. 고객이 어떻게 달라지고 있는지, 우리 팀은 무엇을 다시 봐야 하는지 질문으로 바꿉니다. 다음 화면에서는 이 질문을 2주 동안 볼 지표로 좁힙니다."
        badges={[
          { label: '앞에서 한 것', value: '질문 다듬기', tone: 'violet', icon: '✍️' },
          { label: '지금 볼 것', value: '시장 변화', tone: 'sky', icon: '🔭' },
          { label: '다음', value: '볼 지표 정하기', tone: 'emerald', icon: '🎯' },
        ]}
      />
      <section className="rounded-3xl border border-sky-100 bg-white p-4 shadow-sm md:p-5">
        <V39MiniFlow
          items={[
            { icon: '🔭', title: '공개자료 훑기', body: '시장, 고객, 제도, 경쟁 환경에서 달라진 점을 봅니다.' },
            { icon: '🧠', title: '우리 팀 이슈로 바꾸기', body: '자료 요약이 아니라 팀장이 회의에서 물어볼 질문으로 바꿉니다.' },
            { icon: '🎯', title: '지표 후보로 넘기기', body: '다음 화면에서 이번 2주 동안 볼 기준으로 좁힙니다.' },
          ]}
        />
        <div className="mt-3">
          <V39MinimumChecklist tone="sky" items={['공개자료에서 본 변화', '우리 팀에 미칠 영향', '회의에서 던질 질문']} />
        </div>
      </section>
      <V39PromptConcernBridgeCard mode="research" />
      <V39DirectConcernContextCard mode="research" />
      <V39NotebookLmGuidedResearchLab />
    </div>
  );
}

function renderV39Step(step: number, participant: V39Participant, setParticipant: (next: V39Participant) => void) {
  const current = V39_VISIBLE_APP_STEPS[step];

  if (current.id === 'entry') return <EntryStep participant={participant} setParticipant={setParticipant} />;
  if (current.id === 'ai-safety') return <V39AiSafetyStep />;
  if (current.id === 'prompt-practice') return <V39PromptPracticeStep />;
  if (current.id === 'research-strategy') return <V39ResearchStrategyStep />;
  if (current.id === 'dashboard-analysis') return <div className="space-y-4"><V39DashboardAnalysisUxLab /><V39PromptConcernBridgeCard mode="metric" /><V39DirectConcernContextCard mode="metric" /></div>;
  if (current.id === 'customer-judgment') return <div className="space-y-4"><V39CustomerJudgmentUxLab /><V39PromptConcernBridgeCard mode="customerData" /><V39DirectConcernContextCard mode="customerData" /></div>;
  if (current.id === 'customer-priority') return <V39CustomerPriorityUxLab />;
  if (current.id === 'member-role') return <div className="space-y-4"><V39TeamSevenCoachingUxWrapper /><V39MemberRoleUxLab /></div>;
  if (current.id === 'people-dialogue') return <V39PeopleDialogueUxLab />;
  if (current.id === 'ai-call-plan') return <V39AiCallPlanGuidedUxLab />;
  if (current.id === 'compliance-cleanup') return <V39ComplianceCleanupUxLab />;
  if (current.id === 'final-call-plan-card') return <div className="space-y-4"><V39FinalCallPlanTeamSevenUxCard /><V39FinalCallPlanOnePageGuidance /></div>;
  if (current.id === 'instructor-discussion') return <V39InstructorDiscussionUxLab />;

  return <ShellCard title={current.title}><p>이 단계는 준비 중입니다.</p></ShellCard>;
}

function V39ResetControl({ onReset }: { onReset: () => void }) {
  return (
    <div className="mx-auto -mt-3 mb-4 flex max-w-6xl justify-end px-4 md:px-6">
      <button
        type="button"
        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-600 shadow-sm hover:bg-slate-50"
        onClick={onReset}
      >
        진행 초기화
      </button>
    </div>
  );
}

function V39PreviewApp() {
  const [participant, setParticipant] = useStored<V39Participant>(V39_STORAGE_KEYS.participant, DEFAULT_PARTICIPANT);
  const [progress, setProgress] = useStored<V39Progress>(V39_STORAGE_KEYS.progress, DEFAULT_PROGRESS);
  const safeStep = clampV39Step(progress.step);

  const goToStep = (nextStep: number) => {
    setProgress({ step: clampV39Step(nextStep) });
    scrollV39ToTop();
  };

  const resetV39Progress = () => {
    removeStoredPrefix('ckd.v39.');
    setParticipant(DEFAULT_PARTICIPANT);
    setProgress(DEFAULT_PROGRESS);
    scrollV39ToTop();
  };

  return (
    <V39StepNavigationProvider onStepSelect={(stepNumber) => goToStep(stepNumber - 1)}>
      <JourneyShell
        title="C1바이오 영업팀장 AI 리더십 Lab Journey"
        subtitle="영업팀장이 AI를 활용해 고객·팀원·실행 데이터를 해석하고 2주 실행전략을 설계하는 실습 과정입니다."
        steps={V39_VISIBLE_APP_STEPS}
        currentStep={safeStep}
        onPrev={() => goToStep(safeStep - 1)}
        onNext={() => goToStep(safeStep + 1)}
        onStepSelect={(step) => goToStep(step)}
        hideStepOverview
      >
        {renderV39Step(safeStep, participant, setParticipant)}
      </JourneyShell>
      <V39ResetControl onReset={resetV39Progress} />
    </V39StepNavigationProvider>
  );
}

if (rootElement) {
  createRoot(rootElement).render(<V39PreviewApp />);
}
