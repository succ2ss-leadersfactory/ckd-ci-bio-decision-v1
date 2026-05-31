import { useCallback } from 'react';
import { EntryScreen, type ParticipantInfo } from './journey-entry';
import { PromptPracticeScreen } from './journey-prompt-practice';
import { NotebookReadinessCheck } from './journey-notebook-readiness';
import { StudioReportSection } from './journey-studio-report';
import { StudioSlidesSection } from './journey-studio-slides';
import { PresentationChecklist } from './journey-presentation-checklist';
import { JourneyShell, type JourneyStep } from './journey-shell';
import { getJson, useStored, type JsonRecord } from './journey-storage';
import { promptSourceCheck, promptStudioReport, promptStudioSlides } from './journey-utils';
import { V35PreviewDebugPanel, V35PreviewSmokePanel } from './journey-v35-preview-panels';
import { NotebookSourcePrepStep, SourceCheckStep, StrategyIssueReviewStep } from './journey-v35-preview-steps';
import type { IssueNote } from './journey-components';

const V35_STORAGE_KEYS = {
  step: 'c1bio_v35_preview_step',
  participant: 'c1bio_v35_preview_participant',
  state: 'c1bio_v35_preview_state',
  notes: 'c1bio_v35_preview_strategy_notes',
  sourceChecks: 'c1bio_v35_preview_source_checks',
  sourceRisk: 'c1bio_v35_preview_source_risk',
  readinessResult: 'c1bio_v35_preview_readiness_result',
  reportSummary: 'c1bio_v35_preview_report_summary',
  reportLinkOrFileName: 'c1bio_v35_preview_report_link_or_file_name',
  slidesSummary: 'c1bio_v35_preview_slides_summary',
  slidesLinkOrFileName: 'c1bio_v35_preview_slides_link_or_file_name',
  presentationChecks: 'c1bio_v35_preview_presentation_checks',
  presentationOneLiner: 'c1bio_v35_preview_presentation_one_liner',
  presentationManagerRequest: 'c1bio_v35_preview_presentation_manager_request',
};

const V35_STRATEGY_SCENARIO_TITLE = 'v35 preview 전략 이슈 검토';

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
  {
    id: 'source-check',
    title: 'Source Check',
    description: '출처 확인 체크와 위험 메모를 v35 preview localStorage에 저장합니다.',
  },
  {
    id: 'notebook-source-prep',
    title: 'NotebookLM Source Prep',
    description: '전략 이슈와 Source Check 결과를 바탕으로 NotebookLM 소스 준비 텍스트를 생성합니다.',
  },
  {
    id: 'notebook-readiness-check',
    title: 'NotebookLM Readiness Check',
    description: 'NotebookLM 소스 준비 상태 점검 결과를 v35 preview localStorage에 저장합니다.',
  },
  {
    id: 'studio-report',
    title: 'Studio Report Output',
    description: 'NotebookLM Studio 전략 보고서 산출 결과를 v35 preview localStorage에 저장합니다.',
  },
  {
    id: 'studio-slides',
    title: 'Studio Slide Deck Output',
    description: 'NotebookLM Studio 전략회의 슬라이드 산출 결과를 v35 preview localStorage에 저장합니다.',
  },
  {
    id: 'presentation-checklist',
    title: 'Presentation Checklist',
    description: '전략회의 발표 전 핵심 메시지와 요청사항을 v35 preview localStorage에 저장합니다.',
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

function NotebookReadinessCheckStep({
  readinessResult,
  setReadinessResult,
  save,
}: {
  readinessResult: string;
  setReadinessResult: (value: string) => void;
  save: (key: string, payload: JsonRecord) => void;
}) {
  const readinessPrompt = promptSourceCheck();

  return (
    <div className="grid gap-4">
      <NotebookReadinessCheck promptText={readinessPrompt} resultText={readinessResult} setResultText={setReadinessResult} />
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">NotebookLM readiness result는 v35 preview 전용 key에 저장됩니다. 아래 버튼은 현재 점검 결과를 savedState에도 명시적으로 기록합니다.</p>
        <button className="mt-3 rounded-xl bg-cyan-700 px-4 py-2 font-semibold text-white" type="button" onClick={() => save('J06-notebook-readiness-check', { readinessPrompt, readinessResult })}>
          Readiness Check 저장
        </button>
      </div>
    </div>
  );
}

function StudioReportStep({
  reportSummary,
  setReportSummary,
  reportLinkOrFileName,
  setReportLinkOrFileName,
  save,
}: {
  reportSummary: string;
  setReportSummary: (value: string) => void;
  reportLinkOrFileName: string;
  setReportLinkOrFileName: (value: string) => void;
  save: (key: string, payload: JsonRecord) => void;
}) {
  const reportPrompt = promptStudioReport();

  return (
    <div className="grid gap-4">
      <StudioReportSection
        promptText={reportPrompt}
        summary={reportSummary}
        setSummary={setReportSummary}
        linkOrFileName={reportLinkOrFileName}
        setLinkOrFileName={setReportLinkOrFileName}
      />
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">Studio report 결과 요약과 파일명/링크는 v35 preview 전용 key에 저장됩니다. 아래 버튼은 현재 보고서 산출 결과를 savedState에도 명시적으로 기록합니다.</p>
        <button className="mt-3 rounded-xl bg-cyan-700 px-4 py-2 font-semibold text-white" type="button" onClick={() => save('J07-studio-report', { reportPrompt, reportSummary, reportLinkOrFileName })}>
          Studio Report 저장
        </button>
      </div>
    </div>
  );
}

function StudioSlidesStep({
  slidesSummary,
  setSlidesSummary,
  slidesLinkOrFileName,
  setSlidesLinkOrFileName,
  save,
}: {
  slidesSummary: string;
  setSlidesSummary: (value: string) => void;
  slidesLinkOrFileName: string;
  setSlidesLinkOrFileName: (value: string) => void;
  save: (key: string, payload: JsonRecord) => void;
}) {
  const slidesPrompt = promptStudioSlides();

  return (
    <div className="grid gap-4">
      <StudioSlidesSection
        promptText={slidesPrompt}
        summary={slidesSummary}
        setSummary={setSlidesSummary}
        linkOrFileName={slidesLinkOrFileName}
        setLinkOrFileName={setSlidesLinkOrFileName}
      />
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">Studio slide deck 결과 요약과 파일명/링크는 v35 preview 전용 key에 저장됩니다. 아래 버튼은 현재 슬라이드 산출 결과를 savedState에도 명시적으로 기록합니다.</p>
        <button className="mt-3 rounded-xl bg-cyan-700 px-4 py-2 font-semibold text-white" type="button" onClick={() => save('J08-studio-slides', { slidesPrompt, slidesSummary, slidesLinkOrFileName })}>
          Studio Slides 저장
        </button>
      </div>
    </div>
  );
}

function PresentationChecklistStep({
  presentationChecks,
  setPresentationChecks,
  presentationOneLiner,
  setPresentationOneLiner,
  presentationManagerRequest,
  setPresentationManagerRequest,
  save,
}: {
  presentationChecks: string[];
  setPresentationChecks: (checks: string[]) => void;
  presentationOneLiner: string;
  setPresentationOneLiner: (value: string) => void;
  presentationManagerRequest: string;
  setPresentationManagerRequest: (value: string) => void;
  save: (key: string, payload: JsonRecord) => void;
}) {
  return (
    <div className="grid gap-4">
      <PresentationChecklist
        checks={presentationChecks}
        setChecks={setPresentationChecks}
        oneLiner={presentationOneLiner}
        setOneLiner={setPresentationOneLiner}
        managerRequest={presentationManagerRequest}
        setManagerRequest={setPresentationManagerRequest}
      />
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">Presentation Checklist 입력값은 v35 preview 전용 key에 저장됩니다. 아래 버튼은 현재 발표 준비 결과를 savedState에도 명시적으로 기록합니다.</p>
        <button className="mt-3 rounded-xl bg-cyan-700 px-4 py-2 font-semibold text-white" type="button" onClick={() => save('J09-presentation-checklist', { presentationChecks, presentationOneLiner, presentationManagerRequest })}>
          Presentation Checklist 저장
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
  const [sourceChecks, setSourceChecks] = useStored<string[]>(V35_STORAGE_KEYS.sourceChecks, []);
  const [sourceRisk, setSourceRisk] = useStored<string>(V35_STORAGE_KEYS.sourceRisk, '');
  const [readinessResult, setReadinessResult] = useStored<string>(V35_STORAGE_KEYS.readinessResult, '');
  const [reportSummary, setReportSummary] = useStored<string>(V35_STORAGE_KEYS.reportSummary, '');
  const [reportLinkOrFileName, setReportLinkOrFileName] = useStored<string>(V35_STORAGE_KEYS.reportLinkOrFileName, '');
  const [slidesSummary, setSlidesSummary] = useStored<string>(V35_STORAGE_KEYS.slidesSummary, '');
  const [slidesLinkOrFileName, setSlidesLinkOrFileName] = useStored<string>(V35_STORAGE_KEYS.slidesLinkOrFileName, '');
  const [presentationChecks, setPresentationChecks] = useStored<string[]>(V35_STORAGE_KEYS.presentationChecks, []);
  const [presentationOneLiner, setPresentationOneLiner] = useStored<string>(V35_STORAGE_KEYS.presentationOneLiner, '');
  const [presentationManagerRequest, setPresentationManagerRequest] = useStored<string>(V35_STORAGE_KEYS.presentationManagerRequest, '');

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

  const renderCurrentStep = () => {
    switch (safeStep) {
      case 0:
        return <EntryScreen participant={participant} setParticipant={setParticipant} save={save} />;
      case 1:
        return <PromptPracticeScreen save={save} />;
      case 2:
        return <StrategyIssueReviewStep notes={notes} setNotes={setNotes} save={save} />;
      case 3:
        return <SourceCheckStep sourceChecks={sourceChecks} setSourceChecks={setSourceChecks} sourceRisk={sourceRisk} setSourceRisk={setSourceRisk} save={save} />;
      case 4:
        return <NotebookSourcePrepStep title={V35_STRATEGY_SCENARIO_TITLE} notes={notes} sourceChecks={sourceChecks} sourceRisk={sourceRisk} save={save} />;
      case 5:
        return <NotebookReadinessCheckStep readinessResult={readinessResult} setReadinessResult={setReadinessResult} save={save} />;
      case 6:
        return (
          <StudioReportStep
            reportSummary={reportSummary}
            setReportSummary={setReportSummary}
            reportLinkOrFileName={reportLinkOrFileName}
            setReportLinkOrFileName={setReportLinkOrFileName}
            save={save}
          />
        );
      case 7:
        return (
          <StudioSlidesStep
            slidesSummary={slidesSummary}
            setSlidesSummary={setSlidesSummary}
            slidesLinkOrFileName={slidesLinkOrFileName}
            setSlidesLinkOrFileName={setSlidesLinkOrFileName}
            save={save}
          />
        );
      case 8:
      default:
        return (
          <PresentationChecklistStep
            presentationChecks={presentationChecks}
            setPresentationChecks={setPresentationChecks}
            presentationOneLiner={presentationOneLiner}
            setPresentationOneLiner={setPresentationOneLiner}
            presentationManagerRequest={presentationManagerRequest}
            setPresentationManagerRequest={setPresentationManagerRequest}
            save={save}
          />
        );
    }
  };

  return (
    <JourneyShell
      title="종근당/C1바이오 영업팀장 AI 리더십 Lab Journey v35"
      subtitle="v34 운영 화면에 연결하지 않은 v35 독립 실행 준비용 최소 앱입니다."
      steps={V35_APP_STEPS}
      currentStep={safeStep}
      onPrev={() => setStep(clampStep(safeStep - 1))}
      onNext={() => setStep(clampStep(safeStep + 1))}
    >
      {renderCurrentStep()}
      <V35PreviewSmokePanel step={safeStep} storageKeys={V35_STORAGE_KEYS} onReset={resetV35PreviewStorage} />
      <V35PreviewDebugPanel
        participant={participant}
        savedState={savedState}
        notes={notes}
        sourceChecks={sourceChecks}
        sourceRisk={sourceRisk}
        readinessResult={readinessResult}
        reportSummary={reportSummary}
        reportLinkOrFileName={reportLinkOrFileName}
        slidesSummary={slidesSummary}
        slidesLinkOrFileName={slidesLinkOrFileName}
        presentationChecks={presentationChecks}
        presentationOneLiner={presentationOneLiner}
        presentationManagerRequest={presentationManagerRequest}
      />
    </JourneyShell>
  );
}

export default FullFlowJourneyV35App;
