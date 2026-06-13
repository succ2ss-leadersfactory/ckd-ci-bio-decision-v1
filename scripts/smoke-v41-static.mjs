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
  taskBoundaryLab: read('src/journey-v41-task-boundary-coordination-lab.tsx'),
  peopleSelectionLab: read('src/journey-v41-people-selection-lab.tsx'),
  oneOnOneLab: read('src/journey-v41-one-on-one-practice-lab.tsx'),
  viteConfig: read('vite.config.ts'),
  tsconfig: read('tsconfig.v41-smoke.json'),
  packageJson: read('package.json'),
  pilotEntry: read('ckd-ai-lab.html'),
  v40Html: read('journey-v40-vnext-preview.html'),
};

for (const marker of ['<title>C1바이오 영업팀장 AI 리더십 Lab Journey v41 Preview</title>', '/src/journey-v41-app-preview.tsx', 'v41 isolated preview route']) mustInclude(files.html, marker, 'v41 html');
for (const marker of ['journeyV41Preview', "resolve(__dirname, 'journey-v41-preview.html')"]) mustInclude(files.viteConfig, marker, 'v41 Vite build input');
for (const marker of ['V41PreviewApp', 'V41PeopleSelectionLab', 'V41OneOnOnePracticeLab', 'v41 one-on-one practice lab cloned', 'V41_VISIBLE_APP_STEPS', 'V41FlowStrip', 'V41ProgressCoachPanel', 'ckd.v41.peopleManagement.v2']) mustInclude(files.app, marker, 'v41 app');
for (const marker of ['v41 step 2 leader profile added', 'V41_LEADER_PROFILE', '이대호 팀장 소개', '리더십 딜레마', '오늘의 판단 기준']) mustInclude(files.app, marker, 'v41 step 2 leader profile');
for (const marker of ['v41 step 2 enriched team member signals', 'v41 team signal density restored', 'TEAM_MEMBER_SIGNALS', '방문 신호', '고객 반응', 'Follow-up', '코칭 우선도', '첫 질문']) mustInclude(files.app, marker, 'v41 step 2 enriched team signal content');
for (const marker of ['V40VNextPeopleSelectionLab', 'V40VNextOneOnOnePracticeLab', "import './journey-v40-vnext-app-preview'"]) mustNotInclude(files.app, marker, 'old app dependency');

for (const marker of ['V41PromptPracticeReviewLab', 'v41 prompt practice lab cloned', 'ckd.v41.promptPracticeReview.v2']) mustInclude(files.promptLab, marker, 'v41 prompt lab');
for (const marker of ['V41ResearchStrategyTrimmedLab', 'V41PharmaStrategyResearchLab', 'v41 research strategy wrapper cloned']) mustInclude(files.researchWrapper, marker, 'v41 research wrapper');
for (const marker of ['V41PharmaStrategyResearchLab', 'v41 research strategy lab cloned', 'ckd.v41.pharmaStrategyResearch.v1']) mustInclude(files.researchLab, marker, 'v41 research lab');
for (const marker of ['v41 pharma research data cloned', 'ckd.v41.pharmaStrategyResearch.v1']) mustInclude(files.researchData, marker, 'v41 research data');
for (const marker of ['v41 pharma research prompts cloned', 'Perplexity 자료 찾기']) mustInclude(files.researchPrompts, marker, 'v41 research prompts');
for (const marker of ['v41 pharma research parser cloned', 'parseNotebookAnswer']) mustInclude(files.researchParser, marker, 'v41 research parser');
for (const marker of ['V41PerformanceCompactCascadeLab', 'v41 performance cascade lab cloned', 'ckd.v41.performanceCascade.v1']) mustInclude(files.performanceLab, marker, 'v41 performance lab');
for (const marker of ['V41TaskExecutionBridgeLab', 'v41 task execution bridge lab cloned', 'ckd.v41.taskManagement.v10']) mustInclude(files.taskExecutionLab, marker, 'v41 task execution lab');
for (const marker of ['V41TaskPriorityFlowLab', 'v41 task priority flow lab cloned', '할 일·줄일 일']) mustInclude(files.taskPriorityLab, marker, 'v41 task priority lab');
for (const marker of ['V41TaskBoundaryCoordinationLab', 'v41 task boundary coordination lab cloned', '업무 경계 나누기']) mustInclude(files.taskBoundaryLab, marker, 'v41 task boundary lab');
for (const marker of ['V41PeopleSelectionLab', 'v41 people selection lab cloned', '1on1 대상 고르기']) mustInclude(files.peopleSelectionLab, marker, 'v41 people selection lab');
for (const marker of ['V41OneOnOnePracticeLab', 'v41 one-on-one practice lab cloned', 'v41 one-on-one copy refined', '1on1 첫 문장', '첫 문장 만들기', '확인 질문 만들기', '작은 행동 합의하기', '대화 후 메모 남기기', 'ckd.v41.peopleManagement.v2']) mustInclude(files.oneOnOneLab, marker, 'v41 one-on-one lab');
for (const marker of ['V40VNextOneOnOnePracticeLab', 'ckd.v40-vnext.peopleManagement.v2']) mustNotInclude(files.oneOnOneLab, marker, 'old one-on-one dependency');

for (const marker of ['V41_VISIBLE_APP_STEPS', 'v41 field-friendly step labels', '1on1 첫 문장']) mustInclude(files.config, marker, 'v41 config');
for (const marker of ['V41FlowStrip', 'v41 field-friendly flow chips', '첫 문장']) mustInclude(files.ux, marker, 'v41 ux');
for (const marker of ['V41ProgressCoachPanel', '지금 할 일']) mustInclude(files.progressCoach, marker, 'v41 progress');
for (const marker of ['V41LabStorageScope', 'v41 inherited lab storage isolation']) mustInclude(files.storageScope, marker, 'v41 storage scope');
for (const marker of ['src/journey-v41-*.tsx', 'src/journey-v41-*.ts']) mustInclude(files.tsconfig, marker, 'v41 tsconfig');
for (const marker of ['typecheck:v41', 'smoke:v41:static', 'smoke:v41']) mustInclude(files.packageJson, marker, 'v41 scripts');
for (const marker of ['journey-v41-preview.html', 'journey-v41-app-preview.tsx', 'v41 isolated preview route']) { mustNotInclude(files.pilotEntry, marker, 'existing pilot entry'); mustNotInclude(files.v40Html, marker, 'existing v40 route'); }
for (const marker of ['journey-v40-vnext-preview.html', '/src/journey-v40-vnext-app-preview.tsx']) mustInclude(files.v40Html, marker, 'existing v40 route remains intact');

if (failures.length > 0) { console.error('v41 static smoke failed:'); for (const failure of failures) console.error(`- ${failure}`); process.exit(1); }
console.log('v41 static smoke passed.');
