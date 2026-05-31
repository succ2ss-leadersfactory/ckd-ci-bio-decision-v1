import { EntryScreen } from './journey-entry';
import { PromptPracticeScreen } from './journey-prompt-practice';
import { V35_STRATEGY_SCENARIO_TITLE } from './journey-v35-preview-config';
import {
  NotebookReadinessCheckStep,
  NotebookSourcePrepStep,
  PresentationChecklistStep,
  SourceCheckStep,
  StrategyIssueReviewStep,
  StudioReportStep,
  StudioSlidesStep,
} from './journey-v35-preview-steps';
import type { V35PreviewState } from './journey-v35-preview-types';

export function renderV35PreviewStep(safeStep: number, state: V35PreviewState) {
  switch (safeStep) {
    case 0:
      return <EntryScreen participant={state.participant} setParticipant={state.setParticipant} save={state.save} />;
    case 1:
      return <PromptPracticeScreen save={state.save} />;
    case 2:
      return <StrategyIssueReviewStep notes={state.notes} setNotes={state.setNotes} save={state.save} />;
    case 3:
      return (
        <SourceCheckStep
          sourceChecks={state.sourceChecks}
          setSourceChecks={state.setSourceChecks}
          sourceRisk={state.sourceRisk}
          setSourceRisk={state.setSourceRisk}
          save={state.save}
        />
      );
    case 4:
      return (
        <NotebookSourcePrepStep
          title={V35_STRATEGY_SCENARIO_TITLE}
          notes={state.notes}
          sourceChecks={state.sourceChecks}
          sourceRisk={state.sourceRisk}
          save={state.save}
        />
      );
    case 5:
      return <NotebookReadinessCheckStep readinessResult={state.readinessResult} setReadinessResult={state.setReadinessResult} save={state.save} />;
    case 6:
      return (
        <StudioReportStep
          reportSummary={state.reportSummary}
          setReportSummary={state.setReportSummary}
          reportLinkOrFileName={state.reportLinkOrFileName}
          setReportLinkOrFileName={state.setReportLinkOrFileName}
          save={state.save}
        />
      );
    case 7:
      return (
        <StudioSlidesStep
          slidesSummary={state.slidesSummary}
          setSlidesSummary={state.setSlidesSummary}
          slidesLinkOrFileName={state.slidesLinkOrFileName}
          setSlidesLinkOrFileName={state.setSlidesLinkOrFileName}
          save={state.save}
        />
      );
    case 8:
    default:
      return (
        <PresentationChecklistStep
          presentationChecks={state.presentationChecks}
          setPresentationChecks={state.setPresentationChecks}
          presentationOneLiner={state.presentationOneLiner}
          setPresentationOneLiner={state.setPresentationOneLiner}
          presentationManagerRequest={state.presentationManagerRequest}
          setPresentationManagerRequest={state.setPresentationManagerRequest}
          save={state.save}
        />
      );
  }
}
