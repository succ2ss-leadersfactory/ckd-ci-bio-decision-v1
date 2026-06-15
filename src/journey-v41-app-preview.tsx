import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import { JourneyShell, type JourneyStep } from './journey-shell';
import { useStored } from './journey-storage';
import { V41TaskExecutionBridgeLab, type V41TaskExecutionSnapshot, type V41TaskExecutionStage } from './journey-v41-task-execution-bridge-lab';
import { V41PeopleSelectionLab, V41_PEOPLE_CANDIDATES, type V41PeopleCandidate } from './journey-v41-people-selection-lab';
import { V41OneOnOnePracticeLab, type V41OneOnOneSnapshot } from './journey-v41-one-on-one-practice-lab';
import { V41FlowStrip, V41StepHero } from './journey-v41-ux-components';
import {
  V41_ONE_ON_ONE_STORAGE_KEY,
  V41_PARTICIPANT_STORAGE_KEY,
  V41_PEOPLE_SELECTION_STORAGE_KEY,
  V41_PREVIEW_ROUTE,
  V41_TASK_EXECUTION_STORAGE_KEY,
  V41_VISIBLE_APP_STEPS,
  V41_VISIBLE_STEP_LABELS,
} from './journey-v41-preview-config';

const V41_APP_PREVIEW_MARKERS = [
  'V41AppPreview',
  'journey-v41-app-preview.tsx',
  'v41 preview app shell',
  'V41_PREVIEW_ROUTE',
  'V41_VISIBLE_APP_STEPS',
  'V41_PARTICIPANT_STORAGE_KEY',
  'V41_TASK_EXECUTION_STORAGE_KEY',
  'V41_PEOPLE_SELECTION_STORAGE_KEY',
  'V41_ONE_ON_ONE_STORAGE_KEY',
  'useStored',
  'V41ParticipantGate',
  'teamName',
  'participantName',
  '팀명',
  '이름',
  'V41TaskExecutionBridgeLab',
  'V41PeopleSelectionLab',
  'V41OneOnOnePracticeLab',
  'selectedCandidateId',
  'typeof document !== undefined',
].join('|');
void V41_APP_PREVIEW_MARKERS;

const steps: JourneyStep[] = V41_VISIBLE_STEP_LABELS.map((label, index) => ({
  id: `v41-step-${index + 1}`,
  title: label,
  description: `${index + 1}단계 / ${V41_VISIBLE_APP_STEPS}단계`,
}));

type V41ParticipantIdentity = {
  teamName: string;
  participantName: string;
  savedAt: string;
};

type V41TaskExecutionState = Partial<Record<V41TaskExecutionStage, V41TaskExecutionSnapshot>>;

type V41PeopleSelectionSnapshot = {
  selectedCandidateId: string;
  selectedCandidateName: string;
  firstQuestionFocus: string;
  savedAt: string;
};

function hasParticipantIdentity(participant: V41ParticipantIdentity | null) {
  return Boolean(participant?.teamName.trim() && participant?.participantName.trim());
}

function V41ParticipantGate({
  initialParticipant,
  onSave,
}: {
  initialParticipant: V41ParticipantIdentity | null;
  onSave: (participant: V41ParticipantIdentity) => void;
}) {
  const [teamName, setTeamName] = useState(initialParticipant?.teamName ?? '');
  const [participantName, setParticipantName] = useState(initialParticipant?.participantName ?? '');
  const canStart = Boolean(teamName.trim() && participantName.trim());

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-900 md:p-8">
      <div className="mx-auto max-w-5xl space-y-4">
        <header className="rounded-2xl bg-slate-900 p-5 text-white shadow-sm">
          <p className="text-sm text-cyan-100">AI Leadership Lab Journey</p>
          <h1 className="mt-1 text-2xl font-bold">C1 Bio Journey v41 Preview</h1>
          <p className="mt-2 text-sm text-slate-200">팀명과 이름을 입력한 뒤 실습 Journey를 시작합니다.</p>
        </header>

        <section className="rounded-3xl border border-cyan-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700">v41 participant entry · ckd.v41.participant.v1</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">팀과 이름을 입력해 주세요</h2>
          <p className="mt-3 text-sm font-bold leading-6 text-slate-600">
            입력한 정보는 이 브라우저에만 저장되며, Step 6~10 실습 저장 흐름과 분리된 v41 전용 key로 관리됩니다.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-black text-slate-700">팀명</span>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                placeholder="예: C1바이오 영업팀"
                value={teamName}
                onChange={(event) => setTeamName(event.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-sm font-black text-slate-700">이름</span>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                placeholder="예: 김팀장"
                value={participantName}
                onChange={(event) => setParticipantName(event.target.value)}
              />
            </label>
          </div>

          <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-bold leading-6 text-slate-600">
              팀명과 이름이 저장되면 다음 접속부터 바로 Journey 화면으로 이어집니다.
            </p>
            <button
              type="button"
              className="rounded-xl bg-cyan-700 px-5 py-3 text-sm font-black text-white shadow-sm hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!canStart}
              onClick={() => onSave({ teamName: teamName.trim(), participantName: participantName.trim(), savedAt: new Date().toISOString() })}
            >
              Journey 시작하기
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function V41ParticipantSummary({
  participant,
  onEdit,
}: {
  participant: V41ParticipantIdentity;
  onEdit: () => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">참가자 정보 · ckd.v41.participant.v1</p>
          <p className="mt-1 text-sm font-bold text-slate-700">
            팀명: <span className="text-slate-950">{participant.teamName}</span> · 이름: <span className="text-slate-950">{participant.participantName}</span>
          </p>
        </div>
        <button type="button" className="rounded-xl border px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-50" onClick={onEdit}>
          정보 수정
        </button>
      </div>
    </div>
  );
}

function getRecommendedCandidate() {
  return [...V41_PEOPLE_CANDIDATES].sort((a, b) => b.urgency - a.urgency)[0] ?? V41_PEOPLE_CANDIDATES[0];
}

function getSavedCandidate(snapshot: V41PeopleSelectionSnapshot | null) {
  return V41_PEOPLE_CANDIDATES.find((candidate) => candidate.id === snapshot?.selectedCandidateId) ?? getRecommendedCandidate();
}

function buildPeopleSelectionSnapshot(candidate: V41PeopleCandidate): V41PeopleSelectionSnapshot {
  return {
    selectedCandidateId: candidate.id,
    selectedCandidateName: candidate.name,
    firstQuestionFocus: candidate.firstQuestionFocus,
    savedAt: new Date().toISOString(),
  };
}

function V41PeopleSelectionSaveBox({
  snapshot,
  onSave,
}: {
  snapshot: V41PeopleSelectionSnapshot | null;
  onSave: (snapshot: V41PeopleSelectionSnapshot) => void;
}) {
  const candidate = getSavedCandidate(snapshot);
  const recommended = getRecommendedCandidate();

  return (
    <div className="rounded-3xl border border-indigo-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-indigo-700">v41 people selection save · ckd.v41.peopleSelection.v1</p>
          <h3 className="mt-2 text-lg font-black text-slate-950">추천 1on1 대상 저장</h3>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
            현재 추천 대상은 {candidate.name}입니다. 저장하면 Step 10 첫 문장이 이 대상 기준으로 만들어집니다.
          </p>
        </div>
        <button
          type="button"
          className="rounded-xl bg-indigo-700 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-indigo-800"
          onClick={() => onSave(buildPeopleSelectionSnapshot(recommended))}
        >
          추천 대상 저장
        </button>
      </div>
      {snapshot?.savedAt ? <p className="mt-3 text-xs font-bold text-indigo-700">저장됨: {new Date(snapshot.savedAt).toLocaleString('ko-KR')}</p> : null}
    </div>
  );
}

function V41PlaceholderStep({ currentStep }: { currentStep: number }) {
  const label = V41_VISIBLE_STEP_LABELS[currentStep] ?? 'v41 preview';
  const oneBasedStep = currentStep + 1;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">v41 clean preview shell</p>
      <h3 className="mt-2 text-xl font-black text-slate-950">{oneBasedStep}. {label}</h3>
      <p className="mt-3 text-sm font-bold leading-6 text-slate-600">
        이 화면은 아직 v41 전용 실습 콘텐츠 연결 전 상태입니다. 기존 Journey 흐름과 맞추기 위해 단계별 화면을 순차적으로 복구합니다.
      </p>
      <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-xs font-bold text-slate-500">
        Route marker: {V41_PREVIEW_ROUTE}
      </p>
    </div>
  );
}

function V41StepBody({
  currentStep,
  taskExecutionState,
  onSaveTaskExecution,
  peopleSelectionState,
  onSavePeopleSelection,
  oneOnOneState,
  onSaveOneOnOne,
}: {
  currentStep: number;
  taskExecutionState: V41TaskExecutionState;
  onSaveTaskExecution: (snapshot: V41TaskExecutionSnapshot) => void;
  peopleSelectionState: V41PeopleSelectionSnapshot | null;
  onSavePeopleSelection: (snapshot: V41PeopleSelectionSnapshot) => void;
  oneOnOneState: V41OneOnOneSnapshot | null;
  onSaveOneOnOne: (snapshot: V41OneOnOneSnapshot) => void;
}) {
  const selectedCandidate = getSavedCandidate(peopleSelectionState);

  if (currentStep === 5) return <V41TaskExecutionBridgeLab stage="plan" savedAt={taskExecutionState.plan?.savedAt} onSaveSnapshot={onSaveTaskExecution} />;
  if (currentStep === 6) return <V41TaskExecutionBridgeLab stage="priority" savedAt={taskExecutionState.priority?.savedAt} onSaveSnapshot={onSaveTaskExecution} />;
  if (currentStep === 7) return <V41TaskExecutionBridgeLab stage="boundary" savedAt={taskExecutionState.boundary?.savedAt} onSaveSnapshot={onSaveTaskExecution} />;
  if (currentStep === 8) {
    return (
      <div className="space-y-4">
        <V41PeopleSelectionLab />
        <V41PeopleSelectionSaveBox snapshot={peopleSelectionState} onSave={onSavePeopleSelection} />
      </div>
    );
  }
  if (currentStep === 9) return <V41OneOnOnePracticeLab candidate={selectedCandidate} savedAt={oneOnOneState?.savedAt} onSaveSnapshot={onSaveOneOnOne} />;
  return <V41PlaceholderStep currentStep={currentStep} />;
}

export function V41AppPreview() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isEditingParticipant, setIsEditingParticipant] = useState(false);
  const [participant, setParticipant] = useStored<V41ParticipantIdentity | null>(V41_PARTICIPANT_STORAGE_KEY, null);
  const [taskExecutionState, setTaskExecutionState] = useStored<V41TaskExecutionState>(V41_TASK_EXECUTION_STORAGE_KEY, {});
  const [peopleSelectionState, setPeopleSelectionState] = useStored<V41PeopleSelectionSnapshot | null>(V41_PEOPLE_SELECTION_STORAGE_KEY, null);
  const [oneOnOneState, setOneOnOneState] = useStored<V41OneOnOneSnapshot | null>(V41_ONE_ON_ONE_STORAGE_KEY, null);
  const safeStep = Math.min(Math.max(currentStep, 0), V41_VISIBLE_APP_STEPS - 1);

  if (!hasParticipantIdentity(participant) || isEditingParticipant) {
    return (
      <V41ParticipantGate
        initialParticipant={participant}
        onSave={(nextParticipant) => {
          setParticipant(nextParticipant);
          setIsEditingParticipant(false);
        }}
      />
    );
  }

  return (
    <JourneyShell
      title="C1 Bio Journey v41 Preview"
      subtitle="v41 clean preview · isolated foundation shell"
      steps={steps}
      currentStep={safeStep}
      onPrev={() => setCurrentStep((step) => Math.max(step - 1, 0))}
      onNext={() => setCurrentStep((step) => Math.min(step + 1, V41_VISIBLE_APP_STEPS - 1))}
      onStepSelect={setCurrentStep}
      hideStepOverview
    >
      <div className="space-y-4">
        <V41ParticipantSummary participant={participant} onEdit={() => setIsEditingParticipant(true)} />
        <V41FlowStrip currentStep={safeStep + 1} onStepSelect={(stepNumber) => setCurrentStep(stepNumber - 1)} />
        <V41StepHero
          eyebrow={`v41 preview · step ${safeStep + 1}`}
          title={steps[safeStep]?.title ?? 'v41 preview'}
          description="v41 전용 파일만 사용해 preview foundation을 검증합니다. v39/v40 UX 컴포넌트는 import하지 않습니다."
          icon="🧪"
          tone="cyan"
          badges={[
            { label: 'Route', value: V41_PREVIEW_ROUTE, tone: 'cyan', icon: '🔗' },
            { label: 'Steps', value: V41_VISIBLE_APP_STEPS, tone: 'slate', icon: '🧭' },
            { label: 'Scope', value: 'v41 only', tone: 'emerald', icon: '🛡️' },
          ]}
        />
        <V41StepBody
          currentStep={safeStep}
          taskExecutionState={taskExecutionState}
          onSaveTaskExecution={(snapshot) => setTaskExecutionState((current) => ({ ...current, [snapshot.stage]: snapshot }))}
          peopleSelectionState={peopleSelectionState}
          onSavePeopleSelection={setPeopleSelectionState}
          oneOnOneState={oneOnOneState}
          onSaveOneOnOne={setOneOnOneState}
        />
      </div>
    </JourneyShell>
  );
}

const rootElement = typeof document !== 'undefined'
  ? document.getElementById('root')
  : null;

if (rootElement) {
  createRoot(rootElement).render(<V41AppPreview />);
}
