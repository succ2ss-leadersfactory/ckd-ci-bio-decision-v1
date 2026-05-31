import type { ReactNode } from 'react';
import { JourneyShell } from './journey-shell';
import { ActionMapLab } from './journey-v36-action-map-lab';
import { AiSafetyLab } from './journey-v36-ai-safety-lab';
import { CustomerCallPlanLab } from './journey-v36-customer-call-plan-lab';
import { DashboardAnalysisLab } from './journey-v36-dashboard-analysis-lab';
import { HqTranslationLab } from './journey-v36-hq-translation-lab';
import { OneOnOneCoachingLab } from './journey-v36-one-on-one-coaching-lab';
import { PerformanceDialogueLab } from './journey-v36-performance-dialogue-lab';
import { PromptPracticeLab } from './journey-v36-prompt-practice-lab';
import { ResearchStrategyLab } from './journey-v36-research-strategy-lab';
import { SourceCheckLab } from './journey-v36-source-check-lab';
import { StakeholderMessageLab } from './journey-v36-stakeholder-message-lab';
import { WrapUpLab } from './journey-v36-wrap-up-lab';
import { clampV36Step, V36_APP_STEPS, V36_STORAGE_KEYS } from './journey-v36-preview-config';
import { useStored } from './journey-storage';

type V36Participant = {
  name: string;
  teamName: string;
  roleAccepted: boolean;
};

type V36Progress = {
  step: number;
};

const DEFAULT_PARTICIPANT: V36Participant = {
  name: '',
  teamName: '',
  roleAccepted: false,
};

const DEFAULT_PROGRESS: V36Progress = {
  step: 0,
};

function ComplianceNotice() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="font-bold">AI 안전선</p>
      <p className="mt-1">민감정보를 입력하지 말고 AI 결과는 반드시 검토한 뒤 현장형으로 수정합니다.</p>
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

function EntryStep({ participant, setParticipant }: { participant: V36Participant; setParticipant: (next: V36Participant) => void }) {
  return (
    <div className="space-y-4">
      <ComplianceNotice />
      <ShellCard title="C1바이오 영업팀장 역할 부여">
        <p>당신은 C1바이오 영업2본부 수도권중부영업팀장입니다. 외부 환경, 고객군 반응, 팀원 실행 데이터를 읽고 2주 실행전략을 설계합니다.</p>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">이름</span>
            <input className="w-full rounded-xl border px-3 py-2" value={participant.name} onChange={(event) => setParticipant({ ...participant, name: event.target.value })} placeholder="예: 김현태" />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">팀명</span>
            <input className="w-full rounded-xl border px-3 py-2" value={participant.teamName} onChange={(event) => setParticipant({ ...participant, teamName: event.target.value })} placeholder="예: 3조" />
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

function PlaceholderStep({ stepTitle }: { stepTitle: string }) {
  return (
    <div className="space-y-4">
      <ComplianceNotice />
      <ShellCard title={`${stepTitle} - v36 preview shell`}>
        <p>이 화면은 v36 preview shell의 자리표시자입니다. 다음 구현 단계에서 실제 실습 데이터를 연결합니다.</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>사람의 1차 판단을 먼저 입력합니다.</li>
          <li>AI 질문을 생성하고 외부 AI에 복사합니다.</li>
          <li>AI 답변을 감별하고 현장형으로 수정합니다.</li>
        </ul>
      </ShellCard>
    </div>
  );
}

function renderV36Step(step: number, participant: V36Participant, setParticipant: (next: V36Participant) => void) {
  const current = V36_APP_STEPS[step];

  if (current.id === 'entry') return <EntryStep participant={participant} setParticipant={setParticipant} />;
  if (current.id === 'ai-safety') return <AiSafetyLab />;
  if (current.id === 'prompt-practice') return <PromptPracticeLab />;
  if (current.id === 'research-strategy') return <ResearchStrategyLab />;
  if (current.id === 'source-check') return <SourceCheckLab />;
  if (current.id === 'dashboard-analysis') return <DashboardAnalysisLab />;
  if (current.id === 'customer-judgment') return <CustomerCallPlanLab />;
  if (current.id === 'action-map') return <ActionMapLab />;
  if (current.id === 'hq-translation') return <HqTranslationLab />;
  if (current.id === 'stakeholder-message') return <StakeholderMessageLab />;
  if (current.id === 'performance-dialogue') return <PerformanceDialogueLab />;
  if (current.id === 'one-on-one-coaching') return <OneOnOneCoachingLab />;
  if (current.id === 'wrap-up') return <WrapUpLab />;

  return <PlaceholderStep stepTitle={current.title} />;
}

export function FullFlowJourneyV36PreviewApp() {
  const [participant, setParticipant] = useStored<V36Participant>(V36_STORAGE_KEYS.participant, DEFAULT_PARTICIPANT);
  const [progress, setProgress] = useStored<V36Progress>(V36_STORAGE_KEYS.progress, DEFAULT_PROGRESS);
  const safeStep = clampV36Step(progress.step);

  return (
    <JourneyShell
      title="종근당/C1바이오 영업팀장 AI 리더십 Lab Journey v36 Preview"
      subtitle="v35 안정 상태를 유지한 채, v36 실습 고도화를 독립 preview route에서 검증합니다."
      steps={V36_APP_STEPS}
      currentStep={safeStep}
      onPrev={() => setProgress({ step: clampV36Step(safeStep - 1) })}
      onNext={() => setProgress({ step: clampV36Step(safeStep + 1) })}
      onStepSelect={(step) => setProgress({ step: clampV36Step(step) })}
    >
      {renderV36Step(safeStep, participant, setParticipant)}
      <details className="mt-4 rounded-2xl border bg-white p-4 text-xs text-slate-500 shadow-sm">
        <summary className="cursor-pointer font-bold text-slate-700">QA 정보 보기</summary>
        <p className="mt-2">storage: {Object.values(V36_STORAGE_KEYS).join(', ')}</p>
        <p className="mt-1">current step: {safeStep + 1} / {V36_APP_STEPS.length}</p>
      </details>
    </JourneyShell>
  );
}

export default FullFlowJourneyV36PreviewApp;
