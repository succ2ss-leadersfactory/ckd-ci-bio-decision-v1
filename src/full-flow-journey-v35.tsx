// v35 staging entry for the modular refactor.
//
// The extracted helper modules are now available and imported below as a
// smoke check. Runtime behavior still delegates to v34 so the live screen
// remains unchanged while we verify module compatibility.
import { CardShell, Help, TextBox, Chips, CopyBlock, IssueEditor, ContextCard } from './journey-components';
import { MEMBERS, SCENARIOS, METRIC_ORDER, FOCUS_OPTIONS, SOURCE_CHECKS, STUDIO_CHECKS } from './journey-data';
import { emptyNotes, metricLabel, parseResearch, parseAiSections, buildSourceSearchQuery, buildSourcePackage, promptSourceCheck, promptStudioReport, promptStudioSlides, promptResearch, promptMember } from './journey-utils';
import { getMember, buildPayloadBase, buildContextRows } from './journey-output';

const modularSmokeCheck = {
  components: { CardShell, Help, TextBox, Chips, CopyBlock, IssueEditor, ContextCard },
  data: { MEMBERS, SCENARIOS, METRIC_ORDER, FOCUS_OPTIONS, SOURCE_CHECKS, STUDIO_CHECKS },
  utils: { emptyNotes, metricLabel, parseResearch, parseAiSections, buildSourceSearchQuery, buildSourcePackage, promptSourceCheck, promptStudioReport, promptStudioSlides, promptResearch, promptMember },
  output: { getMember, buildPayloadBase, buildContextRows },
};

void modularSmokeCheck;

import './full-flow-journey-v34';
