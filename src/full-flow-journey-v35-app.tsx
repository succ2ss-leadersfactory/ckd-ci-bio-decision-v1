import { JourneyShell } from './journey-shell';
import { V35PreviewDebugPanel, V35PreviewSmokePanel } from './journey-v35-preview-panels';
import { clampStep, V35_APP_STEPS, V35_STORAGE_KEYS } from './journey-v35-preview-config';
import { renderV35PreviewStep } from './journey-v35-preview-router';
import { resetV35PreviewStorage, useV35PreviewState } from './journey-v35-preview-state';

export function FullFlowJourneyV35App() {
  const state = useV35PreviewState();
  const safeStep = clampStep(state.step);

  return (
    <JourneyShell
      title="종근당/C1바이오 영업팀장 AI 리더십 Lab Journey v35"
      subtitle="v34 운영 화면에 연결하지 않은 v35 독립 실행 준비용 최소 앱입니다."
      steps={V35_APP_STEPS}
      currentStep={safeStep}
      onPrev={() => state.setStep(clampStep(safeStep - 1))}
      onNext={() => state.setStep(clampStep(safeStep + 1))}
    >
      {renderV35PreviewStep(safeStep, state)}
      <V35PreviewSmokePanel step={safeStep} storageKeys={V35_STORAGE_KEYS} onReset={resetV35PreviewStorage} />
      <V35PreviewDebugPanel
        participant={state.participant}
        savedState={state.savedState}
        notes={state.notes}
        sourceChecks={state.sourceChecks}
        sourceRisk={state.sourceRisk}
        readinessResult={state.readinessResult}
        reportSummary={state.reportSummary}
        reportLinkOrFileName={state.reportLinkOrFileName}
        slidesSummary={state.slidesSummary}
        slidesLinkOrFileName={state.slidesLinkOrFileName}
        presentationChecks={state.presentationChecks}
        presentationOneLiner={state.presentationOneLiner}
        presentationManagerRequest={state.presentationManagerRequest}
      />
    </JourneyShell>
  );
}

export default FullFlowJourneyV35App;
