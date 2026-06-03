import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { JourneyShell } from './journey-shell';
import { AiSafetyLab } from './journey-v36-ai-safety-lab';
import { PromptPracticeLab } from './journey-v36-prompt-practice-lab';
import { ResearchStrategyLab } from './journey-v36-research-strategy-lab';
import { useStored } from './journey-storage';
import { clampV38Step, V38_STORAGE_KEYS, V38_VISIBLE_APP_STEPS } from './journey-v38-preview-config';
import { V39AiCallPlanLab } from './journey-v39-ai-call-plan-lab';
import { V39ComplianceCleanupLab } from './journey-v39-compliance-cleanup-lab';
import { V39CustomerJudgmentLab } from './journey-v39-customer-judgment-lab';
import { V39CustomerPriorityLab } from './journey-v39-customer-priority-lab';
import { V39DashboardAnalysisLab } from './journey-v39-dashboard-analysis-lab';
import { V39FinalCallPlanCard } from './journey-v39-final-call-plan-card';
import { V39InstructorDiscussionLab } from './journey-v39-instructor-discussion-lab';
import { V39MemberRoleLab } from './journey-v39-member-role-lab';

const rootElement = document.getElementById('journey-root') ?? document.getElementById('root');

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
      <p className="mt-1">교육용 가상 자료만 사용합니다. 실제 고객명, 병원명, 의료진명, 제품명, 매출·처방 정보, 내부 수치, 민감정보는 입력하지 않습니다.</p>
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

function renderV39Step(step: number, participant: V39Participant, setParticipant: (next: V39Participant) => void) {
  const current = V38_VISIBLE_APP_STEPS[step];

  if (current.id === 'entry') return <EntryStep participant={participant} setParticipant={setParticipant} />;
  if (current.id === 'ai-safety') return <AiSafetyLab />;
  if (current.id === 'prompt-practice') return <PromptPracticeLab />;
  if (current.id === 'research-strategy') return <ResearchStrategyLab />;
  if (current.id === 'dashboard-analysis') return <V39DashboardAnalysisLab />;
  if (current.id === 'customer-judgment') return <V39CustomerJudgmentLab />;
  if (current.id === 'customer-priority') return <V39CustomerPriorityLab />;
  if (current.id === 'member-role') return <V39MemberRoleLab />;
  if (current.id === 'ai-call-plan') return <V39AiCallPlanLab />;
  if (current.id === 'compliance-cleanup') return <V39ComplianceCleanupLab />;
  if (current.id === 'final-call-plan-card') return <V39FinalCallPlanCard />;
  if (current.id === 'instructor-discussion') return <V39InstructorDiscussionLab />;

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
  const safeStep = clampV38Step(progress.step);

  const goToStep = (nextStep: number) => {
    setProgress({ step: clampV38Step(nextStep) });
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
        steps={V38_VISIBLE_APP_STEPS}
        currentStep={safeStep}
        onPrev={() => goToStep(safeStep - 1)}
        onNext={() => goToStep(safeStep + 1)}
        onStepSelect={(step) => goToStep(step)}
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
