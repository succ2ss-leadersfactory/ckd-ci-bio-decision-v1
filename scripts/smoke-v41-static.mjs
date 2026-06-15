import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const read = (relativePath) => {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) { failures.push(`Missing required file: ${relativePath}`); return ''; }
  return fs.readFileSync(fullPath, 'utf8');
};
const mustInclude = (source, marker, label) => { if (!source.includes(marker)) failures.push(`Missing ${label}: ${marker}`); };
const mustNotInclude = (source, marker, label) => { if (source.includes(marker)) failures.push(`Unexpected ${label}: ${marker}`); };
const collectV41StorageKeys = (...sources) => {
  const keyPattern = /\bckd\.v41\.[A-Za-z0-9.-]+\b/g;
  return [...new Set(sources.flatMap((source) => source.match(keyPattern) ?? []))].sort();
};

const files = {
  html: read('journey-v41-preview.html'),
  app: read('src/journey-v41-app-preview.tsx'),
  config: read('src/journey-v41-preview-config.ts'),
  ux: read('src/journey-v41-ux-components.tsx'),
  progressCoach: read('src/journey-v41-progress-coach-panel.tsx'),
  sharedUi: read('src/journey-v41-shared-ui.tsx'),
  storageScope: read('src/journey-v41-lab-storage-scope.tsx'),
  promptLab: read('src/journey-v41-prompt-practice-review-lab.tsx'),
  researchWrapper: read('src/journey-v41-research-strategy-trimmed-lab.tsx'),
  researchLab: read('src/journey-v41-pharma-strategy-research-lab.tsx'),
  researchData: read('src/journey-v41-pharma-research-data.ts'),
  researchPrompts: read('src/journey-v41-pharma-research-prompts.ts'),
  researchParser: read('src/journey-v41-pharma-research-parser.ts'),
  performanceLab: read('src/journey-v41-performance-compact-cascade-lab.tsx'),
  performanceAiLab: read('src/journey-v41-performance-ai-expansion-lab.tsx'),
  taskExecutionLab: read('src/journey-v41-task-execution-bridge-lab.tsx'),
  taskPriorityLab: read('src/journey-v41-task-priority-flow-lab.tsx'),
  taskBoundaryLab: read('src/journey-v41-task-boundary-coordination-lab.tsx'),
  peopleSelectionLab: read('src/journey-v41-people-selection-lab.tsx'),
  oneOnOneLab: read('src/journey-v41-one-on-one-practice-lab.tsx'),
  qaChecklist: read('docs/v41-manual-qa-checklist.md'),
  qaRunLog: read('docs/v41-manual-qa-run-log.md'),
  ciOptimizationStatus: read('docs/v41-ci-optimization-status.md'),
  storageKeyUsageMap: read('docs/v41-storage-key-usage-map.md'),
  storageScopeAudit: read('docs/v41-storage-scope-audit.md'),
  stepComponentMap: read('docs/v41-step-component-map.md'),
  baselineFreeze: read('docs/v41-pre-optimization-baseline-freeze.md'),
  browserQaConfirmation: read('docs/v41-baseline-browser-qa-confirmation.md'),
  ciOptimizationGuard: read('src/journey-v41-ci-optimization-guard.ts'),
  v41Workflow: read('.github/workflows/v41-smoke.yml'),
  viteConfig: read('vite.config.ts'),
  tsconfig: read('tsconfig.v41-smoke.json'),
  packageJson: read('package.json'),
  pilotEntry: read('ckd-ai-lab.html'),
  v40Html: read('journey-v40-vnext-preview.html'),
};

const preservedStepLabels = [
  '시작하기',
  '팀원 보기',
  '질문 다듬기',
  '시장 변화 읽기',
  '팀 기준 만들기',
  '업무관리 실행계획 만들기',
  '할 일·줄일 일',
  '업무 경계 나누기',
  '1on1 대상 고르기',
  '1on1 첫 문장',
];

const continuityMarkers = [
  'Step 5 selects team strategy task, CSF, KPI, and initiative candidate.',
  'Step 6 creates the execution plan and execution cycle.',
  'Step 7 converts the execution plan into priority',
  'Step 8 converts the flow into task boundaries and people signals.',
  'Step 9 selects the 1on1 target from boundary and people signals.',
  'Step 10 creates opening line, check questions, and action agreement using the execution cycle.',
];

const v40VNextBridgeKeys = [
  'ckd.v40-vnext.promptPracticeReview.v2',
  'ckd.v40-vnext.pharmaStrategyResearch.v1',
  'ckd.v40-vnext.performanceCascade.v1',
  'ckd.v40-vnext.taskManagement.v10',
  'ckd.v40-vnext.peopleManagement.v2',
  'ckd.v40-vnext.finalExecutionMemo.v1',
];

const stepComponentMapMarkers = [
  'Current 10-step mapping',
  'EntryStep',
  'RoleTeamIntroStep',
  'V41PromptPracticeReviewLab',
  'V41ResearchStrategyTrimmedLab',
  'V41PerformanceCompactCascadeLab',
  'V41PerformanceAiExpansionLab',
  'V41TaskExecutionBridgeLab',
  'V41TaskPriorityFlowLab',
  'V41TaskBoundaryCoordinationLab',
  'V41PeopleSelectionLab',
  'V41OneOnOnePracticeLab',
  'ckd.v41.pharmaStrategyResearch.v1',
  'ckd.v41.performanceCascade.v1',
  'ckd.v41.taskManagement.v10',
  'ckd.v41.peopleManagement.v2',
  'Not allowed:',
];

const storageKeyCodeSources = [
  files.app,
  files.storageScope,
  files.promptLab,
  files.researchWrapper,
  files.researchLab,
  files.researchData,
  files.performanceLab,
  files.performanceAiLab,
  files.taskExecutionLab,
  files.taskPriorityLab,
  files.taskBoundaryLab,
  files.peopleSelectionLab,
  files.oneOnOneLab,
];
const storageKeysUsedInCode = collectV41StorageKeys(...storageKeyCodeSources);

for (const marker of ['<title>C1 Bio Journey v41 Preview</title>', '/src/journey-v41-app-preview.tsx', 'v41 preview']) mustInclude(files.html, marker, 'v41 html');
for (const marker of ['journeyV41Preview', "resolve(__dirname, 'journey-v41-preview.html')"]) mustInclude(files.viteConfig, marker, 'v41 Vite build input');
for (const marker of ['V41PreviewApp', 'V41PeopleSelectionLab', 'V41OneOnOnePracticeLab', 'V41_VISIBLE_APP_STEPS', 'V41FlowStrip', 'V41ProgressCoachPanel']) mustInclude(files.app, marker, 'v41 app');
for (const marker of ['v41 step 2 basic leader profile', 'v41 step 2 basic member profiles', '이대호 팀장 기본 정보', '주요 역할', '업무스타일', '소통스타일', '강점', '아쉬운 점', '비고']) mustInclude(files.app, marker, 'v41 step 2 basic profile content');
for (const marker of ['V40VNextPeopleSelectionLab', 'V40VNextOneOnOnePracticeLab', "import './journey-v40-vnext-app-preview'"]) mustNotInclude(files.app, marker, 'old app dependency');

for (const marker of preservedStepLabels) {
  mustInclude(files.config, marker, 'preserved v41 step label in config');
  mustInclude(files.baselineFreeze, marker, 'preserved v41 step label in baseline freeze');
  mustInclude(files.browserQaConfirmation, marker, 'preserved v41 step label in browser QA confirmation');
  mustInclude(files.stepComponentMap, marker, 'preserved v41 step label in step-component map');
}
for (const marker of ['participant entry experience', '10-step journey flow', 'No optimization commit may replace the v41 journey with a placeholder or clean shell']) mustInclude(files.baselineFreeze, marker, 'v41 baseline preservation rule');
for (const marker of ['confirmed by user', 'pre-optimization normal version', 'Before changing v41 code, add or strengthen a v41 preservation smoke guard']) mustInclude(files.browserQaConfirmation, marker, 'v41 browser QA confirmation');
for (const marker of continuityMarkers) {
  mustInclude(files.baselineFreeze, marker, 'v41 baseline Step 5~10 continuity marker');
  mustInclude(files.browserQaConfirmation, marker, 'v41 browser QA Step 5~10 continuity marker');
}
for (const marker of stepComponentMapMarkers) mustInclude(files.stepComponentMap, marker, 'v41 step-component map marker');

for (const marker of ['V41PromptPracticeReviewLab', 'v41 prompt practice lab cloned', 'ckd.v41.promptPracticeReview.v2']) mustInclude(files.promptLab, marker, 'v41 prompt lab');
for (const marker of ['V41ResearchStrategyTrimmedLab', 'V41PharmaStrategyResearchLab', 'v41 research strategy wrapper cloned']) mustInclude(files.researchWrapper, marker, 'v41 research wrapper');
for (const marker of ['V41PharmaStrategyResearchLab', 'v41 research strategy lab cloned', 'ckd.v41.pharmaStrategyResearch.v1']) mustInclude(files.researchLab, marker, 'v41 research lab');
for (const marker of ['v41 pharma research data cloned', 'ckd.v41.pharmaStrategyResearch.v1']) mustInclude(files.researchData, marker, 'v41 research data');
for (const marker of ['v41 pharma research prompts cloned', 'Perplexity 자료 찾기']) mustInclude(files.researchPrompts, marker, 'v41 research prompts');
for (const marker of ['v41 pharma research parser cloned', 'parseNotebookAnswer']) mustInclude(files.researchParser, marker, 'v41 research parser');

for (const marker of ['V41PerformanceCompactCascadeLab', 'ckd.v41.performanceCascade.v1', '팀 전략과제', '팀 CSF', '팀 KPI']) mustInclude(files.performanceLab, marker, 'v41 performance criteria lab');
for (const marker of ['V41PerformanceAiExpansionLab', 'ckd.v41.performanceCascade.aiExpansion.v1', 'AI 실습 프롬프트 만들기']) mustInclude(files.performanceAiLab, marker, 'v41 performance AI expansion lab');
for (const marker of ['V41TaskExecutionBridgeLab', 'ckd.v41.taskManagement.v10', '실행관리 주기', '최종 실행계획']) mustInclude(files.taskExecutionLab, marker, 'v41 task execution lab');
for (const marker of ['V41TaskPriorityFlowLab', 'ckd.v41.taskManagement.v10', '6단계 실행계획 확인', '할 일·줄일 일']) mustInclude(files.taskPriorityLab, marker, 'v41 task priority lab');
for (const marker of ['V41TaskBoundaryCoordinationLab', 'ckd.v41.taskManagement.v10', '7단계 실행 흐름 확인', '업무 경계 나누기']) mustInclude(files.taskBoundaryLab, marker, 'v41 task boundary lab');
for (const marker of ['V41PeopleSelectionLab', 'ckd.v41.peopleManagement.v2', '8단계 업무 경계와 사람관리 신호 확인', '자동 선택 없이 시작합니다']) mustInclude(files.peopleSelectionLab, marker, 'v41 people selection lab');
for (const marker of ['V41OneOnOnePracticeLab', 'ckd.v41.peopleManagement.v2', 'ckd.v41.taskManagement.v10', '9단계 1on1 준비 내용 확인', '실행관리 주기 반영']) mustInclude(files.oneOnOneLab, marker, 'v41 one-on-one lab');
for (const marker of ['V40VNextOneOnOnePracticeLab', 'ckd.v40-vnext.peopleManagement.v2']) mustNotInclude(files.oneOnOneLab, marker, 'old one-on-one dependency');

for (const marker of ['v41 shared ui helpers', 'V41Card', 'V41TextAreaField', 'compactV41Text']) mustInclude(files.sharedUi, marker, 'v41 shared UI helper marker');
for (const marker of ["import { compactV41Text, V41Card, V41TextAreaField } from './journey-v41-shared-ui';", 'compactV41Text(state.observedFact)', '<V41Card title="9단계 1on1 준비 내용 확인">']) mustInclude(files.oneOnOneLab, marker, 'v41 one-on-one shared helper usage');
for (const marker of ['function Card({ title, children }', 'function Field({ label, value, onChange, placeholder }', 'function compact(value?: string)']) mustNotInclude(files.oneOnOneLab, marker, 'old local one-on-one helper');

for (const storageKey of storageKeysUsedInCode) {
  mustInclude(files.storageKeyUsageMap, storageKey, 'v41 storage key usage map entry');
}
for (const marker of ['This is a documentation-only checkpoint', 'Do not rename any `ckd.v41.*` key without a migration', 'ckd.v41.taskManagement.v10', 'ckd.v41.peopleManagement.v2']) mustInclude(files.storageKeyUsageMap, marker, 'v41 storage key usage map rule');

for (const marker of ['Storage Scope Audit', 'No active mount confirmed in the visible 10-step v41 app', 'Reserved / bridge-only in the current visible v41 10-step flow', 'Keep it shared for now', 'test(v41): guard storage reset scope']) mustInclude(files.storageScopeAudit, marker, 'v41 storage scope audit decision');
for (const marker of ['removeStoredPrefix(\'ckd.v41.\')', '`ckd.v40-vnext.*` keys survive a v41 reset', 'participant/progress keys are not mixed with lab-state keys']) mustInclude(files.storageScopeAudit, marker, 'v41 storage reset scope audit rule');
for (const marker of ['const resetV41', "removeStoredPrefix('ckd.v41.')", 'v41 입력 초기화']) mustInclude(files.app, marker, 'v41 reset scope implementation');
for (const marker of ["removeStoredPrefix('ckd.v40-vnext.')", "removeStoredPrefix('ckd.v40')", "removeStoredPrefix('ckd.')", 'ckd.v40-vnext.* 를 삭제']) mustNotInclude(files.app, marker, 'unsafe v41 reset scope');
for (const marker of v40VNextBridgeKeys) {
  mustInclude(files.storageScope, marker, 'v40-vNext bridge key retained in v41 storage scope helper');
  mustInclude(files.storageKeyUsageMap, marker, 'v40-vNext bridge key retained in storage key usage map');
  mustInclude(files.storageScopeAudit, marker, 'v40-vNext bridge key considered by storage scope audit');
}
for (const marker of ['ckd.v41.finalExecutionMemo.v1', 'Reserved / bridge-only', 'Do not merge it into `ckd.v41.peopleManagement.v2`']) mustInclude(files.storageScopeAudit, marker, 'v41 reserved final execution memo rule');

for (const marker of ['V41_VISIBLE_APP_STEPS', 'v41 field-friendly step labels', '1on1 첫 문장']) mustInclude(files.config, marker, 'v41 config');
for (const marker of ['Step 11', '11단계', 'Steps 4~11', 'Step 4~11', 'Step 10~11']) {
  mustNotInclude(files.qaChecklist, marker, 'old v41 QA checklist step reference');
  mustNotInclude(files.qaRunLog, marker, 'old v41 QA run log step reference');
}
for (const marker of ['| 10 | 1on1 첫 문장 |', 'Step 5~10 data flow is usable', 'Step 9~10 use `ckd.v41.peopleManagement.v2`']) mustInclude(files.qaChecklist, marker, 'current v41 QA checklist');
for (const marker of ['The current v41 preview has 10 screens', 'Step 5~10 data-flow checks', 'Step 10 execution cycle reflection']) mustInclude(files.qaRunLog, marker, 'current v41 QA run log');
for (const marker of ['V41 CI Optimization Status', 'npm run smoke:v41', 'Automated checks are green, but browser QA is still required']) mustInclude(files.ciOptimizationStatus, marker, 'v41 CI optimization status');
for (const marker of ['V41_CI_OPTIMIZATION_GUARD', 'v41-ci-optimization-guard']) mustInclude(files.ciOptimizationGuard, marker, 'v41 CI optimization guard marker');
for (const marker of ["paths:", "'journey-v41-preview.html'", "'src/journey-v41-*.tsx'", "'scripts/smoke-v41-static.mjs'", 'run: npm run smoke:v41']) mustInclude(files.v41Workflow, marker, 'v41 optimized workflow');
for (const marker of ['Run v41 static smoke check', 'Run v41 scoped TypeScript check', 'Build Vite app']) mustNotInclude(files.v41Workflow, marker, 'old duplicate v41 workflow steps');
for (const marker of ['V41FlowStrip', 'v41 field-friendly flow chips', '첫 문장']) mustInclude(files.ux, marker, 'v41 ux');
for (const marker of ['V41ProgressCoachPanel', '지금 할 일']) mustInclude(files.progressCoach, marker, 'v41 progress');
for (const marker of ['V41LabStorageScope', 'v41 inherited lab storage isolation']) mustInclude(files.storageScope, marker, 'v41 storage scope');
for (const marker of ['src/journey-v41-*.tsx', 'src/journey-v41-*.ts']) mustInclude(files.tsconfig, marker, 'v41 tsconfig');
for (const marker of ['typecheck:v41', 'smoke:v41:static', 'smoke:v41']) mustInclude(files.packageJson, marker, 'v41 scripts');
for (const marker of ['journey-v41-preview.html', 'journey-v41-app-preview.tsx', 'v41 preview']) { mustNotInclude(files.pilotEntry, marker, 'existing pilot entry'); mustNotInclude(files.v40Html, marker, 'existing v40 route'); }
for (const marker of ['/src/journey-v40-vnext-app-preview.tsx']) mustInclude(files.v40Html, marker, 'existing v40 route remains intact');

if (failures.length > 0) { console.error('v41 static smoke failed:'); for (const failure of failures) console.error(`- ${failure}`); process.exit(1); }
console.log('v41 static smoke passed.');
