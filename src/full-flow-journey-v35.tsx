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

const modularSmokeCheck = {
  components: { CardShell, Help, TextBox, Chips, CopyBlock, IssueEditor, ContextCard },
  screens: { EntryScreen, PromptPracticeScreen, StrategyIssueReview, SourceCheckSection, NotebookSourcePrep, NotebookReadinessCheck, StudioReportSection, StudioSlidesSection },
  data: { MEMBERS, SCENARIOS, METRIC_ORDER, FOCUS_OPTIONS, SOURCE_CHECKS, STUDIO_CHECKS },
  utils: { emptyNotes, metricLabel, parseResearch, parseAiSections, buildSourceSearchQuery, buildSourcePackage, promptSourceCheck, promptStudioReport, promptStudioSlides, promptResearch, promptMember },
  output: { getMember, buildPayloadBase, buildContextRows },
  storage: { STORAGE_KEYS, getJson, setJson, useStored, callGoogleScript, buildResponsePayload },
};

void modularSmokeCheck;

import './full-flow-journey-v34';
