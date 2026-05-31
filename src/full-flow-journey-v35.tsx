// v35 staging entry for the modular refactor.
//
// The extracted helper modules are imported below as a smoke check. Runtime
// behavior still delegates to v34 so the live screen remains unchanged while
// we verify module compatibility one small piece at a time.
import { CardShell, Help, TextBox, Chips, CopyBlock, IssueEditor, ContextCard } from './journey-components';
import { MEMBERS, SCENARIOS, METRIC_ORDER, FOCUS_OPTIONS, SOURCE_CHECKS, STUDIO_CHECKS } from './journey-data';
import { emptyNotes, metricLabel, parseResearch, parseAiSections, buildSourceSearchQuery, buildSourcePackage, promptSourceCheck, promptStudioReport, promptStudioSlides, promptResearch, promptMember } from './journey-utils';
import { getMember, buildPayloadBase, buildContextRows } from './journey-output';
import { EntryScreen } from './journey-entry';
import { PromptPracticeScreen } from './journey-prompt-practice';
import { STORAGE_KEYS, getJson, setJson, useStored, callGoogleScript, buildResponsePayload } from './journey-storage';
import { StrategyIssueReview } from './journey-strategy-issue-review';
import { SourceCheckSection } from './journey-source-check';
import { NotebookSourcePrep } from './journey-notebook-source-prep';
import { NotebookReadinessCheck } from './journey-notebook-readiness';
import { StudioReportSection } from './journey-studio-report';
import { StudioSlidesSection } from './journey-studio-slides';
import { PresentationChecklist } from './journey-presentation-checklist';
import { JourneyShell } from './journey-shell';
import { FullFlowJourneyV35App } from './full-flow-journey-v35-app';
import { clampStep, createEmptyIssueNotes, V35_APP_STEPS, V35_STORAGE_KEYS, V35_STRATEGY_SCENARIO_TITLE } from './journey-v35-preview-config';
import { V35PreviewDebugPanel, V35PreviewSmokePanel } from './journey-v35-preview-panels';
import { NotebookReadinessCheckStep, NotebookSourcePrepStep, PresentationChecklistStep, SourceCheckStep, StrategyIssueReviewStep, StudioReportStep, StudioSlidesStep } from './journey-v35-preview-steps';
import { renderV35PreviewStep } from './journey-v35-preview-router';
import { resetV35PreviewStorage, useV35PreviewState } from './journey-v35-preview-state';

const modularSmokeCheck = {
  components: { CardShell, Help, TextBox, Chips, CopyBlock, IssueEditor, ContextCard },
  shell: { JourneyShell },
  app: { FullFlowJourneyV35App },
  previewConfig: { clampStep, createEmptyIssueNotes, V35_APP_STEPS, V35_STORAGE_KEYS, V35_STRATEGY_SCENARIO_TITLE },
  previewPanels: { V35PreviewDebugPanel, V35PreviewSmokePanel },
  previewSteps: { NotebookReadinessCheckStep, NotebookSourcePrepStep, PresentationChecklistStep, SourceCheckStep, StrategyIssueReviewStep, StudioReportStep, StudioSlidesStep },
  previewRouter: { renderV35PreviewStep },
  previewState: { resetV35PreviewStorage, useV35PreviewState },
  screens: { EntryScreen, PromptPracticeScreen, StrategyIssueReview, SourceCheckSection, NotebookSourcePrep, NotebookReadinessCheck, StudioReportSection, StudioSlidesSection, PresentationChecklist },
  data: { MEMBERS, SCENARIOS, METRIC_ORDER, FOCUS_OPTIONS, SOURCE_CHECKS, STUDIO_CHECKS },
  utils: { emptyNotes, metricLabel, parseResearch, parseAiSections, buildSourceSearchQuery, buildSourcePackage, promptSourceCheck, promptStudioReport, promptStudioSlides, promptResearch, promptMember },
  output: { getMember, buildPayloadBase, buildContextRows },
  storage: { STORAGE_KEYS, getJson, setJson, useStored, callGoogleScript, buildResponsePayload },
};

void modularSmokeCheck;

import './full-flow-journey-v34';
