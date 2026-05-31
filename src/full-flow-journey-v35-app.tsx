import { useCallback } from 'react';
import { EntryScreen, type ParticipantInfo } from './journey-entry';
import { PromptPracticeScreen } from './journey-prompt-practice';
import { JourneyShell } from './journey-shell';
import { getJson, useStored, type JsonRecord } from './journey-storage';
import { V35PreviewDebugPanel, V35PreviewSmokePanel } from './journey-v35-preview-panels';
import {
  NotebookReadinessCheckStep,
  NotebookSourcePrepStep,
  PresentationChecklistStep,
  SourceCheckStep,
  StrategyIssueReviewStep,
  StudioReportStep,
  StudioSlidesStep,
} from './journey-v35-preview-steps';
import { clampStep, createEmptyIssueNotes, V35_APP_STEPS, V35_STORAGE_KEYS, V35_STRATEGY_SCENARIO_TITLE } from './journey-v35-preview-config';
import type { IssueNote } from './journey-components';

const DEFAULT_PARTICIPANT: ParticipantInfo = {
  participantId: `v35-${Date.now()}`,
  sessionCode: '',
  name: '',
  teamName: '',
};

function resetV35PreviewStorage() {
  Object.values(V35_STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  window.location.reload();
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
