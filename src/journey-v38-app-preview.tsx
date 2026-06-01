import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { JourneyShell } from './journey-shell';
import { AiSafetyLab } from './journey-v36-ai-safety-lab';
import { DashboardAnalysisLab } from './journey-v36-dashboard-analysis-lab';
import { PromptPracticeLab } from './journey-v36-prompt-practice-lab';
import { ResearchStrategyLab } from './journey-v36-research-strategy-lab';
import { useStored } from './journey-storage';
import { V38CustomerJudgmentLab } from './journey-v38-customer-judgment-lab';
import { clampV38Step, V38_STORAGE_KEYS, V38_VISIBLE_APP_STEPS } from './journey-v38-preview-config';

const rootElement = document.getElementById('journey-root') ?? document.getElementById('root');

type V38Participant = {
  name: string;
  teamName: string;
  roleAccepted: boolean;
};

type V38Progress = {
  step: number;
};

const DEFAULT_PARTICIPANT: V38Participant = {
  name: '',
  teamName: '',
  roleAccepted: false,
};

const DEFAULT_PROGRESS: V38Progress = {
  step: 0,
};

const TEAM_OPTIONS = ['1팀', '2팀', '3팀', '4팀', '5팀', '6팀', '7팀', '8팀'];

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

function EntryStep({ participant, setParticipant }: { participant: V38Participant; setParticipant: (next: V38Participant) => void }) {
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

function renderV38Step(step: number, participant: V38Participant, setParticipant: (next: V38Participant) => void) {
  const current = V38_VISIBLE_APP_STEPS[step];

  if (current.id === 'entry') return <EntryStep participant={participant} setParticipant={setParticipant} />;
  if (current.id === 'ai-safety') return <AiSafetyLab />;
  if (current.id === 'prompt-practice') return <PromptPracticeLab />;
  if (current.id === 'research-strategy') return <ResearchStrategyLab />;
  if (current.id === 'dashboard-analysis') return <DashboardAnalysisLab />;
  if (current.id === 'customer-judgment') return <V38CustomerJudgmentLab />;

  return <ShellCard title={current.title}><p>이 단계는 v38에서 준비 중입니다.</p></ShellCard>;
}

function V38PreviewApp() {
  const [participant, setParticipant] = useStored<V38Participant>(V38_STORAGE_KEYS.participant, DEFAULT_PARTICIPANT);
  const [progress, setProgress] = useStored<V38Progress>(V38_STORAGE_KEYS.progress, DEFAULT_PROGRESS);
  const safeStep = clampV38Step(progress.step);

  return (
    <JourneyShell
      title="C1바이오 영업팀장 AI 리더십 Lab Journey v38"
      subtitle="v38은 DOM 후처리 없이 정식 React 컴포넌트 방식으로 복구·확장하는 미리보기 Journey입니다."
      steps={V38_VISIBLE_APP_STEPS}
      currentStep={safeStep}
      onPrev={() => setProgress({ step: clampV38Step(safeStep - 1) })}
      onNext={() => setProgress({ step: clampV38Step(safeStep + 1) })}
      onStepSelect={(step) => setProgress({ step: clampV38Step(step) })}
    >
      {renderV38Step(safeStep, participant, setParticipant)}
    </JourneyShell>
  );
}

if (rootElement) {
  createRoot(rootElement).render(<V38PreviewApp />);
}
