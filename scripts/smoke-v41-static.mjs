import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const read = (relativePath) => {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    failures.push(`Missing required file: ${relativePath}`);
    return '';
  }
  return fs.readFileSync(fullPath, 'utf8');
};
const mustInclude = (source, marker, label) => { if (!source.includes(marker)) failures.push(`Missing ${label}: ${marker}`); };
const mustNotInclude = (source, marker, label) => { if (source.includes(marker)) failures.push(`Unexpected ${label}: ${marker}`); };

const files = {
  html: read('journey-v41-preview.html'),
  app: read('src/journey-v41-app-preview.tsx'),
  config: read('src/journey-v41-preview-config.ts'),
  ux: read('src/journey-v41-ux-components.tsx'),
  progressCoach: read('src/journey-v41-progress-coach-panel.tsx'),
  storageScope: read('src/journey-v41-lab-storage-scope.tsx'),
  promptLab: read('src/journey-v41-prompt-practice-review-lab.tsx'),
  researchWrapper: read('src/journey-v41-research-strategy-trimmed-lab.tsx'),
  researchLab: read('src/journey-v41-pharma-strategy-research-lab.tsx'),
  researchData: read('src/journey-v41-pharma-research-data.ts'),
  researchPrompts: read('src/journey-v41-pharma-research-prompts.ts'),
  researchParser: read('src/journey-v41-pharma-research-parser.ts'),
  performanceLab: read('src/journey-v41-performance-compact-cascade-lab.tsx'),
  taskExecutionLab: read('src/journey-v41-task-execution-bridge-lab.tsx'),
  taskPriorityLab: read('src/journey-v41-task-priority-flow-lab.tsx'),
  tsconfig: read('tsconfig.v41-smoke.json'),
  packageJson: read('package.json'),
  pilotEntry: read('ckd-ai-lab.html'),
  v40Html: read('journey-v40-vnext-preview.html'),
};

for (const marker of ['<title>C1바이오 영업팀장 AI 리더십 Lab Journey v41 Preview</title>', '/src/journey-v41-app-preview.tsx', 'v41 isolated preview route']) mustInclude(files.html, marker, 'v41 html');
for (const marker of ['V41PreviewApp', 'V41PromptPracticeReviewLab', 'V41ResearchStrategyTrimmedLab', 'V41PerformanceCompactCascadeLab', 'V41TaskExecutionBridgeLab', 'V41TaskPriorityFlowLab', 'v41 task priority flow lab cloned', 'V41_VISIBLE_APP_STEPS', 'V41FlowStrip', 'V41ProgressCoachPanel', 'ckd.v41.taskManagement.v10']) mustInclude(files.app, marker, 'v41 app');
for (const marker of ['V40VNextPromptPracticeReviewLab', 'V40VNextResearchStrategyTrimmedLab', 'V40VNextPerformanceCompactCascadeLab', 'V40VNextTaskExecutionBridgeLab', 'V40VNextTaskPriorityFlowLab', "import './journey-v40-vnext-app-preview'"]) mustNotInclude(files.app, marker, 'old app dependency');

for (const marker of ['V41PromptPracticeReviewLab', 'v41 prompt practice lab cloned', 'ckd.v41.promptPracticeReview.v2']) mustInclude(files.promptLab, marker, 'v41 prompt lab');
for (const marker of ['V41ResearchStrategyTrimmedLab', 'V41PharmaStrategyResearchLab', 'v41 research strategy wrapper cloned']) mustInclude(files.researchWrapper, marker, 'v41 research wrapper');
for (const marker of ['V41PharmaStrategyResearchLab', 'v41 research strategy lab cloned', 'v41 research strategy copy refined', 'ckd.v41.pharmaStrategyResearch.v1']) mustInclude(files.researchLab, marker, 'v41 research lab');
for (const marker of ['V40VNextPharmaStrategyResearchLab', 'ckd.v40-vnext.pharmaStrategyResearch.v1']) mustNotInclude(files.researchLab, marker, 'old research lab dependency');
for (const marker of ['v41 pharma research data cloned', 'ckd.v41.pharmaStrategyResearch.v1']) mustInclude(files.researchData, marker, 'v41 research data');
for (const marker of ['v41 pharma research prompts cloned', 'Perplexity 자료 찾기', 'NotebookLM 소스 기반 정리', 'LM Studio 산출물 요청']) mustInclude(files.researchPrompts, marker, 'v41 research prompts');
for (const marker of ['v41 pharma research parser cloned', 'NOTEBOOK_SECTION_ALIASES', 'parseNotebookAnswer']) mustInclude(files.researchParser, marker, 'v41 research parser');

for (const marker of ['V41PerformanceCompactCascadeLab', 'v41 performance cascade lab cloned', 'ckd.v41.performanceCascade.v1']) mustInclude(files.performanceLab, marker, 'v41 performance lab');
for (const marker of ['V40VNextPerformanceEnhancedCascadeLabV2', 'V40VNextPerformanceCompactCascadeLab', 'ckd.v40-vnext.performanceCascade.v1']) mustNotInclude(files.performanceLab, marker, 'old performance lab dependency');
for (const marker of ['V41TaskExecutionBridgeLab', 'v41 task execution bridge lab cloned', 'ckd.v41.taskManagement.v10']) mustInclude(files.taskExecutionLab, marker, 'v41 task execution lab');
for (const marker of ['V40VNextTaskExecutionBridgeLab', 'V40VNextTaskExecutionDesignLab', 'ckd.v40-vnext.taskManagement.v10']) mustNotInclude(files.taskExecutionLab, marker, 'old task execution dependency');
for (const marker of ['V41TaskPriorityFlowLab', 'v41 task priority flow lab cloned', 'v41 task priority flow copy refined', '할 일·줄일 일', '먼저 할 일 고르기', '잠시 줄일 일 고르기', '업무 흐름 3단계 만들기', '30초 실행 선언문', 'ckd.v41.taskManagement.v10']) mustInclude(files.taskPriorityLab, marker, 'v41 task priority lab');
for (const marker of ['V40VNextTaskPriorityFlowLab', 'AI에게 실행 흐름 초안 부탁하기', 'ckd.v40-vnext.taskManagement.v10']) mustNotInclude(files.taskPriorityLab, marker, 'old task priority dependency');

for (const marker of ['V41_VISIBLE_APP_STEPS', 'v41 field-friendly step labels', '할 일·줄일 일']) mustInclude(files.config, marker, 'v41 config');
for (const marker of ['V41FlowStrip', 'v41 field-friendly flow chips', '할 일·줄일 일']) mustInclude(files.ux, marker, 'v41 ux');
for (const marker of ['V41ProgressCoachPanel', '지금 할 일']) mustInclude(files.progressCoach, marker, 'v41 progress');
for (const marker of ['V41LabStorageScope', 'v41 inherited lab storage isolation']) mustInclude(files.storageScope, marker, 'v41 storage scope');
for (const marker of ['src/journey-v41-task-priority-flow-lab.tsx', 'src/journey-v41-task-execution-bridge-lab.tsx']) mustInclude(files.tsconfig, marker, 'v41 tsconfig');
for (const marker of ['typecheck:v41', 'smoke:v41:static', 'smoke:v41']) mustInclude(files.packageJson, marker, 'v41 scripts');
for (const marker of ['journey-v41-preview.html', 'journey-v41-app-preview.tsx', 'v41 isolated preview route']) {
  mustNotInclude(files.pilotEntry, marker, 'existing pilot entry');
  mustNotInclude(files.v40Html, marker, 'existing v40 route');
}
for (const marker of ['journey-v40-vnext-preview.html', '/src/journey-v40-vnext-app-preview.tsx']) mustInclude(files.v40Html, marker, 'existing v40 route remains intact');

if (failures.length > 0) {
  console.error('v41 static smoke failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('v41 static smoke passed.');
