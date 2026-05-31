import { useCallback } from 'react';
import { EntryScreen, type ParticipantInfo } from './journey-entry';
import { PromptPracticeScreen } from './journey-prompt-practice';
import { StrategyIssueReview } from './journey-strategy-issue-review';
import { JourneyShell, type JourneyStep } from './journey-shell';
import { getJson, useStored, type JsonRecord } from './journey-storage';
import type { IssueNote } from './journey-components';

const V35_STORAGE_KEYS = {
  step: 'c1bio_v35_preview_step',
  participant: 'c1bio_v35_preview_participant',
  state: 'c1bio_v35_preview_state',
  notes: 'c1bio_v35_preview_strategy_notes',
};

const V35_APP_STEPS: JourneyStep[] = [
  {
    id: 'entry',
    title: '입장',
    description: '참여자 정보와 세션 정보를 localStorage에 저장하는 v35 독립 실행 준비 단계입니다.',
  },
  {
    id: 'prompt-practice',
    title: '좋은 질문 만들기',
    description: '안전한 프롬프트를 복사하고 v35 preview localStorage에 저장하는 최소 실습 단계입니다.',
  },
  {
    id: 'strategy-issue-review',
    title: '전략 이슈 검토',
    description: '전략 이슈 메모를 v35 preview localStorage에 저장하며 화면 전환 안정성을 확인합니다.',
  },
];

const DEFAULT_PARTICIPANT: ParticipantInfo = {
  participantId: `v35-${Date.now()}`,
  sessionCode: '',
  name: '',
  teamName: '',
};

function createEmptyIssueNotes(): IssueNote[] {
  return Array.from({ length: 3 }, () => ({
    issue: '',
    change: '',
    source: '',
    date: '',
    reliability: '',
    why: '',
    check: '',
    question: '',
    compliance: '',
  }));
}

function clampStep(step: number) {
  return Math.min(Math.max(step, 0), Math.max(V35_APP_STEPS.length - 1, 0));
}

function resetV35PreviewStorage() {
  Object.values(V35_STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  window.location.reload();
}

function V35PreviewSmokePanel({ step }: { step: number }) {
  return (
    <aside className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-slate-700" data-testid="v35-preview-smoke-panel">
      <h3 className="font-bold text-slate-900">v35 Preview Smoke Check</h3>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        <div>
          <b>실행 경로</b>
          <p>/journey-v35-preview.html 전용</p>
        </div>
        <div>
          <b>현재 step</b>
          <p>{step}</p>
        </div>
        <div>
          <b>운영 연결</b>
          <p>journey-active.tsx 미사용</p>
        </div>
        <div>
          <b>Google Sheets</b>
          <p>아직 미연동</p>
        </div>
      </div>
      <p className="mt-3 font-semibold text-cyan-800">저장 key: {V35_STORAGE_KEYS.participant}, {V35_STORAGE_KEYS.state}, {V35_STORAGE_KEYS.notes}</p>
      <button className="mt-3 rounded-xl border border-cyan-700 bg-white px-4 py-2 font-semibold text-cyan-800" type="button" onClick={resetV35PreviewStorage}>
        v35 preview 저장 초기화
      </button>
    </aside>
  );
}

function V35PreviewDebugPanel({ participant, savedState, notes }: { participant: ParticipantInfo; savedState: JsonRecord; notes: IssueNote[] }) {
  const debugPayload = {
    participant,
    savedState,
    notes,
  };

  return (
    <aside className="mt-4 rounded-2xl border bg-white p-4 text-sm shadow-sm" data-testid="v35-preview-debug-panel">
      <h3 className="font-bold text-slate-900">v35 Preview Debug JSON</h3>
      <p className="mt-1 text-slate-600">화면 전환과 저장 결과를 개발자도구 없이 확인하기 위한 preview 전용 패널입니다.</p>
      <pre className="mt-3 max-h-72 overflow-auto rounded-xl bg-slate-100 p-3 text-xs leading-relaxed text-slate-800">
        {JSON.stringify(debugPayload, null, 2)}
      </pre>
    </aside>
  );
}

function StrategyIssueReviewStep({ notes, setNotes, save }: { notes: IssueNote[]; setNotes: (notes: IssueNote[]) => void; save: (key: string, payload: JsonRecord) => void }) {
  return (
    <div className="grid gap-4">
      <StrategyIssueReview notes={notes} setNotes={setNotes} />
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">전략 이슈 메모는 입력 즉시 v35 preview 전용 key에 저장됩니다. 아래 버튼은 현재 메모를 savedState에도 명시적으로 기록합니다.</p>
        <button className="mt-3 rounded-xl bg-cyan-700 px-4 py-2 font-semibold text-white" type="button" onClick={() => save('J03-strategy-issue-review', { notes })}>
          전략 이슈 저장
        </button>
      </div>
    </div>
  );
}

export function FullFlowJourneyV35App() {
  const [step, setStep] = useStored<number>(V35_STORAGE_KEYS.step, 0);
  const [participant, setParticipant] = useStored<ParticipantInfo>(V35_STORAGE_KEYS.participant, DEFAULT_PARTICIPANT);
  const [savedState, setSavedState] = useStored<JsonRecord>(V35_STORAGE_KEYS.state, {});
  const [notes, setNotes] = useStored<IssueNote[]>(V35_STORAGE_KEYS.notes, createEmptyIssueNotes());

  const safeStep = clampStep(step);

  const save = useCallback((key: string, payload: JsonRecord) => {
    const currentState = getJson<JsonRecord>(V35_STORAGE_KEYS.state, {});
    const nextState = {
      ...currentState,
      [key]: payload,
      v35AppLastSavedAt: new Date().toISOString(),
    };

    setSavedState(nextState);
  }, [setSavedState]);

  return (
    <JourneyShell
      title="종근당/C1바이오 영업팀장 AI 리더십 Lab Journey v35"
      subtitle="v34 운영 화면에 연결하지 않은 v35 독립 실행 준비용 최소 앱입니다."
      steps={V35_APP_STEPS}
      currentStep={safeStep}
      onPrev={() => setStep(clampStep(safeStep - 1))}
      onNext={() => setStep(clampStep(safeStep + 1))}
    >
      {safeStep === 0 ? (
        <EntryScreen participant={participant} setParticipant={setParticipant} save={save} />
      ) : safeStep === 1 ? (
        <PromptPracticeScreen save={save} />
      ) : (
        <StrategyIssueReviewStep notes={notes} setNotes={setNotes} save={save} />
      )}
      <V35PreviewSmokePanel step={safeStep} />
      <V35PreviewDebugPanel participant={participant} savedState={savedState} notes={notes} />
    </JourneyShell>
  );
}

export default FullFlowJourneyV35App;
