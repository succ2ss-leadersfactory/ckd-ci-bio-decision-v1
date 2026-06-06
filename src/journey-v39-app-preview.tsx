import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { JourneyShell } from './journey-shell';
import { AiSafetyLab } from './journey-v36-ai-safety-lab';
import { useStored } from './journey-storage';
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
import { V39PromptPracticeLab } from './journey-v39-prompt-practice-lab';
import { V39TeamSevenCoachingUxWrapper } from './journey-v39-team-seven-coaching-ux-wrapper';
import { V39FlowStrip, V39MinimumChecklist, V39MiniFlow, V39SafetyStrip, V39StepHero } from './journey-v39-ux-components';
import { clampV39Step, V39_VISIBLE_APP_STEPS } from './journey-v39-preview-config';

const rootElement = document.getElementById('journey-root') ?? document.getElementById('root');
const V39_STATIC_ROUTE_MARKERS = 'V39ComplianceCleanupLab V39ResearchStrategyLab V39NotebookLmGuidedResearchLab V39PromptPracticeLab V39PromptConcernBridgeCard V39DirectConcernContextCard V39TeamSevenCoachingMap V39TeamSevenCoachingUxWrapper V39AiCallPlanUxLab V39AiCallPlanGuidedUxLab V39FinalCallPlanTeamSevenUxCard V39FinalCallPlanOnePageGuidance 3단계에서 선택한 우리 팀 고민 6단계 고객 Data 확인 List 연결 V39StepHero V39FlowStrip 1단계 입장 2단계 AI 안전선 3단계 질문 연습 4단계 전략 리서치 hideStepOverview';
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
      <p className="font-bold">AI·제약영업 안전선</p>
      <p className="mt-1">교육용 가상 자료만 사용합니다. 실제 고객·기관·제품·성과 수치·개인 관련 정보는 입력하지 않습니다.</p>
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
        eyebrow="1단계 · 입장과 역할 부여"
        icon="🚪"
        title="오늘은 C1바이오 영업팀장 역할로 판단합니다"
        tone="indigo"
        description="이 앱은 정답을 맞히는 퀴즈가 아닙니다. 교육용 가상 상황에서 영업팀장이 고객 활동 기록, 팀원 실행 상황, AI 초안을 활용해 2주 실행전략을 정리하는 실습 도구입니다. 먼저 팀 정보와 이름을 입력하고, 오늘의 역할을 확인합니다."
        badges={[
          { label: '오늘 역할', value: '영업팀장', tone: 'indigo', icon: '👤' },
          { label: '실습 방식', value: '판단 기록', tone: 'emerald', icon: '📝' },
          { label: '안전 기준', value: '가상 자료만', tone: 'amber', icon: '🛡️' },
        ]}
      />
      <section className="rounded-3xl border border-indigo-100 bg-white p-4 shadow-sm md:p-5">
        <V39MiniFlow
          items={[
            { icon: '🚪', title: '역할 확인', body: '오늘은 C1바이오 영업팀장 입장에서 판단합니다.' },
            { icon: '🛡️', title: '안전선 확인', body: '다음 화면에서 AI 입력 금지 기준을 먼저 확인합니다.' },
            { icon: '✍️', title: '질문 연습으로 이동', body: '좋은 AI 질문을 만들기 위한 기본 구조를 익힙니다.' },
          ]}
        />
        <div className="mt-3">
          <V39MinimumChecklist tone="indigo" items={['팀명 선택', '이름 또는 닉네임 입력', '영업팀장 역할 확인']} />
        </div>
      </section>
      <ComplianceNotice />
      <ShellCard title="C1바이오 영업팀장 역할 부여">
        <p>당신은 C1바이오 영업2본부 수도권중부영업팀장입니다. 외부 환경, 고객군 반응, 팀원 실행 데이터를 읽고 2주 실행전략을 설계합니다.</p>
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
          <span>나는 오늘 실습에서 C1바이오 영업팀장 역할로 판단하고 기록합니다.</span>
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
        eyebrow="2단계 · AI 안전선 확인"
        icon="🛡️"
        title="AI를 쓰기 전에 말해도 되는 선부터 확인합니다"
        tone="amber"
        description="제약영업 실습에서는 AI에게 실제 고객명, 기관명, 제품명, 내부 수치, 개인정보를 넣지 않습니다. 이 단계는 이후 모든 AI 실습에서 지켜야 할 기준을 먼저 맞추는 시간입니다."
        badges={[
          { label: '목적', value: '입력 금지 기준 확인', tone: 'amber', icon: '🛡️' },
          { label: '다음 단계', value: '질문 연습', tone: 'violet', icon: '✍️' },
          { label: '적용 범위', value: '전체 AI 실습', tone: 'emerald', icon: '✅' },
        ]}
      />
      <V39SafetyStrip>
        실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다. AI는 판단을 대신 정하는 도구가 아니라, 팀장의 생각을 정리하고 넓히는 도구입니다.
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
        eyebrow="3단계 · 질문 연습"
        icon="✍️"
        title="AI에게 잘 묻기 전에, 내 고민을 먼저 정리합니다"
        tone="violet"
        description="좋은 답은 좋은 질문에서 시작됩니다. 이 단계에서는 AI에게 바로 답을 요구하지 않고, 역할·상황·요청·출력 형식을 담아 질문을 구조화하는 연습을 합니다."
        badges={[
          { label: '앞 단계', value: '안전선 확인', tone: 'amber', icon: '🛡️' },
          { label: '지금 할 일', value: '질문 구조 연습', tone: 'violet', icon: '✍️' },
          { label: '다음 단계', value: '전략 리서치', tone: 'sky', icon: '🔭' },
        ]}
      />
      <section className="rounded-3xl border border-violet-100 bg-white p-4 shadow-sm md:p-5">
        <V39MiniFlow
          items={[
            { icon: '🧑‍💼', title: '역할을 정하기', body: 'AI에게 어떤 관점으로 봐야 하는지 알려줍니다.' },
            { icon: '📌', title: '상황을 넣기', body: '현장 맥락과 제한 조건을 짧게 정리합니다.' },
            { icon: '📋', title: '원하는 형식 말하기', body: '표, 체크리스트, 질문 목록처럼 필요한 결과 형태를 지정합니다.' },
          ]}
        />
      </section>
      <V39PromptPracticeLab />
    </div>
  );
}

function V39ResearchStrategyStep() {
  return (
    <div className="space-y-4">
      <V39FlowStrip currentStep={4} />
      <V39StepHero
        eyebrow="4단계 · 전략 리서치"
        icon="🔭"
        title="공개자료에서 변화 신호를 찾고, 우리 팀 질문으로 바꿉니다"
        tone="sky"
        description="외부 자료를 많이 모으는 것이 목적이 아닙니다. 공개자료에서 우리 팀에 영향을 줄 변화 신호를 찾고, 다음 단계에서 볼 관리 지표로 이어질 질문을 정리합니다."
        badges={[
          { label: '앞 단계', value: '질문 구조', tone: 'violet', icon: '✍️' },
          { label: '지금 할 일', value: '변화 신호 찾기', tone: 'sky', icon: '🔭' },
          { label: '다음 단계', value: '관리 지표 선정', tone: 'emerald', icon: '🎯' },
        ]}
      />
      <section className="rounded-3xl border border-sky-100 bg-white p-4 shadow-sm md:p-5">
        <V39MiniFlow
          items={[
            { icon: '🔭', title: '공개자료 보기', body: '시장, 고객, 제도, 경쟁 환경의 변화 신호를 찾습니다.' },
            { icon: '🧠', title: '우리 팀 질문으로 바꾸기', body: '자료 요약이 아니라 팀장이 봐야 할 질문으로 전환합니다.' },
            { icon: '🎯', title: '지표로 넘기기', body: '다음 화면에서 2주 동안 볼 관리 지표를 고르는 기준이 됩니다.' },
          ]}
        />
        <div className="mt-3">
          <V39MinimumChecklist tone="sky" items={['공개자료 기반 변화 신호', '우리 팀에 줄 영향', '다음 단계로 넘길 실행 질문']} />
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
  if (current.id === 'dashboard-analysis') return <div className="space-y-4"><V39PromptConcernBridgeCard mode="metric" /><V39DirectConcernContextCard mode="metric" /><V39DashboardAnalysisUxLab /></div>;
  if (current.id === 'customer-judgment') return <div className="space-y-4"><V39PromptConcernBridgeCard mode="customerData" /><V39DirectConcernContextCard mode="customerData" /><V39CustomerJudgmentUxLab /></div>;
  if (current.id === 'customer-priority') return <V39CustomerPriorityUxLab />;
  if (current.id === 'member-role') return <div className="space-y-4"><V39TeamSevenCoachingUxWrapper /><V39MemberRoleUxLab /></div>;
  if (current.id === 'people-dialogue') return <V39PeopleDialogueUxLab />;
  if (current.id === 'ai-call-plan') return <V39AiCallPlanGuidedUxLab />;
  if (current.id === 'compliance-cleanup') return <V39ComplianceCleanupUxLab />;
  if (current.id === 'final-call-plan-card') return <div className="space-y-4"><V39FinalCallPlanOnePageGuidance /><V39FinalCallPlanTeamSevenUxCard /></div>;
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
    window.localStorage.removeItem(V39_STORAGE_KEYS.participant);
    window.localStorage.removeItem(V39_STORAGE_KEYS.progress);
    setParticipant(DEFAULT_PARTICIPANT);
    setProgress(DEFAULT_PROGRESS);
    scrollV39ToTop();
  };

  return (
    <>
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
    </>
  );
}

if (rootElement) {
  createRoot(rootElement).render(<V39PreviewApp />);
}
