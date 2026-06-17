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
const mustInclude = (source, marker, label) => {
  if (!source.includes(marker)) failures.push(`Missing ${label}: ${marker}`);
};
const mustNotInclude = (source, marker, label) => {
  if (source.includes(marker)) failures.push(`Unexpected ${label}: ${marker}`);
};

const files = {
  html: read('journey-v41-preview.html'),
  app: read('src/journey-v41-app-preview.tsx'),
  config: read('src/journey-v41-preview-config.ts'),
  ux: read('src/journey-v41-ux-components.tsx'),
  designCss: read('src/journey-v41-design.css'),
  designOverridesCss: read('src/journey-v41-design-overrides.css'),
  heroHorizontalFixCss: read('src/journey-v41-hero-horizontal-fix.css'),
  storageScope: read('src/journey-v41-lab-storage-scope.tsx'),
  promptLab: read('src/journey-v41-prompt-practice-review-lab.tsx'),
  researchWrapper: read('src/journey-v41-research-strategy-trimmed-lab.tsx'),
  researchLab: read('src/journey-v41-pharma-strategy-research-lab.tsx'),
  performanceLab: read('src/journey-v41-performance-compact-cascade-lab.tsx'),
  performanceAiLab: read('src/journey-v41-performance-ai-expansion-lab.tsx'),
  taskExecutionLab: read('src/journey-v41-task-execution-bridge-lab.tsx'),
  taskPriorityLab: read('src/journey-v41-task-priority-flow-lab.tsx'),
  taskBoundaryLab: read('src/journey-v41-task-boundary-coordination-lab.tsx'),
  peopleSelectionLab: read('src/journey-v41-people-selection-lab.tsx'),
  oneOnOneLab: read('src/journey-v41-one-on-one-practice-lab.tsx'),
  storageKeyUsageMap: read('docs/v41-storage-key-usage-map.md'),
  storageScopeAudit: read('docs/v41-storage-scope-audit.md'),
  stepComponentMap: read('docs/v41-step-component-map.md'),
  browserQaChecklist: read('docs/v41-browser-qa-checklist.md'),
  viteConfig: read('vite.config.ts'),
  v41Workflow: read('.github/workflows/v41-smoke.yml'),
  pilotEntry: read('ckd-ai-lab.html'),
  v40Html: read('journey-v40-vnext-preview.html'),
};

for (const marker of ['<title>C1 Bio Journey v41 Preview</title>', '/src/journey-v41-app-preview.tsx', '/src/journey-v41-hero-horizontal-fix.css', 'v41 preview']) {
  mustInclude(files.html, marker, 'v41 html');
}
for (const marker of ['journeyV41Preview', "resolve(__dirname, 'journey-v41-preview.html')"]) {
  mustInclude(files.viteConfig, marker, 'v41 Vite build input');
}
for (const marker of ['V41PreviewApp', 'V41_VISIBLE_APP_STEPS', 'V41FlowStrip', 'V41PeopleSelectionLab', 'V41OneOnOnePracticeLab']) {
  mustInclude(files.app, marker, 'v41 app shell');
}
for (const marker of ['V40VNextPeopleSelectionLab', 'V40VNextOneOnOnePracticeLab', "import './journey-v40-vnext-app-preview'"]) {
  mustNotInclude(files.app, marker, 'old v40 app dependency');
}

for (const marker of ['시작하기', '팀원 보기', '질문 다듬기', '시장 변화 읽기', '팀 기준 만들기', '업무관리 실행계획 만들기', '업무 순서·업무지시', '업무 경계·병목 대응', '사람관리 1: 대상 선택', '사람관리 2: 1on1 실천']) {
  mustInclude(files.config, marker, 'v41 visible step label');
}
for (const marker of ['업무관리 실행계획', '업무 순서·업무지시', '업무 경계·병목 대응', '사람관리 1: 대상 선택', '사람관리 2: 1on1 실천']) {
  mustInclude(files.ux, marker, 'v41 flow strip label');
}

for (const marker of ['v41 preview-only design refinement', '#journey-root', 'v41-domain-flow']) {
  mustInclude(files.designCss, marker, 'v41 base design css');
}
for (const marker of ['v41 phase2 UX overrides', 'v41 hero redesign', 'v41 hero final stabilization']) {
  mustInclude(files.designOverridesCss, marker, 'v41 design override css');
}
for (const marker of ['v41 preview-only hero horizontal alignment fix', 'html body #journey-root main > div > header h1::after']) {
  mustInclude(files.heroHorizontalFixCss, marker, 'v41 hero horizontal fix css');
}

for (const marker of ['V41PromptPracticeReviewLab', 'ckd.v41.promptPracticeReview.v2']) mustInclude(files.promptLab, marker, 'v41 prompt lab');
for (const marker of ['V41ResearchStrategyTrimmedLab', 'V41PharmaStrategyResearchLab']) mustInclude(files.researchWrapper, marker, 'v41 research wrapper');
for (const marker of ['V41PharmaStrategyResearchLab', 'ckd.v41.pharmaStrategyResearch.v1']) mustInclude(files.researchLab, marker, 'v41 research lab');
for (const marker of ['V41PerformanceCompactCascadeLab', 'ckd.v41.performanceCascade.v1', '팀 전략과제', '팀 CSF', '팀 KPI']) mustInclude(files.performanceLab, marker, 'v41 performance criteria lab');
for (const marker of ['V41PerformanceAiExpansionLab', 'ckd.v41.performanceCascade.aiExpansion.v1']) mustInclude(files.performanceAiLab, marker, 'v41 performance AI lab');
for (const marker of ['V41TaskExecutionBridgeLab', 'ckd.v41.taskManagement.v10', '실행관리 주기', '최종 실행계획']) mustInclude(files.taskExecutionLab, marker, 'v41 task execution lab');
for (const marker of ['V41TaskPriorityFlowLab', 'ckd.v41.taskManagement.v10', '6단계 실행계획 확인', '업무지시 초안 최적화 프롬프트']) mustInclude(files.taskPriorityLab, marker, 'v41 task priority lab');
for (const marker of ['V41TaskBoundaryCoordinationLab', 'ckd.v41.taskManagement.v10', '업무 경계·병목 대응', '정제된 8단계 전달 메모']) mustInclude(files.taskBoundaryLab, marker, 'v41 task boundary lab');

for (const marker of ['V41PeopleSelectionLab', 'ckd.v41.peopleManagement.v2', 'ckd.v41.taskManagement.v10', '사람관리 1: 먼저 이야기할 팀원 고르기', '팀원별 실행 신호 카드 보기', '위험한 해석 고르기', '1on1 대화 초점 1개 선택']) {
  mustInclude(files.peopleSelectionLab, marker, 'v41 people selection parity lab');
}
for (const marker of ['V41OneOnOnePracticeLab', 'ckd.v41.peopleManagement.v2', '사람관리 2: 1on1 대화 설계와 실천하기', '팀원 예상 반응 선택', 'AI 역할극 리허설 1 · 내가 팀장 역할', 'AI 역할극 리허설 2 · AI가 코칭 팀장 역할', '사람관리 결과 메모']) {
  mustInclude(files.oneOnOneLab, marker, 'v41 one-on-one parity lab');
}
for (const marker of ['V40VNextOneOnOnePracticeLab', 'ckd.v40-vnext.peopleManagement.v2']) {
  mustNotInclude(files.oneOnOneLab, marker, 'old v40 one-on-one dependency');
}

for (const marker of ['ckd.v41.participant.v1', 'ckd.v41.progress.v1', 'ckd.v41.promptPracticeReview.v2', 'ckd.v41.pharmaStrategyResearch.v1', 'ckd.v41.performanceCascade.v1', 'ckd.v41.performanceCascade.aiExpansion.v1', 'ckd.v41.taskManagement.v10', 'ckd.v41.peopleManagement.v2']) {
  mustInclude(files.storageKeyUsageMap, marker, 'v41 storage map');
}
for (const marker of ['ckd.v40-vnext.taskManagement.v10', 'ckd.v40-vnext.peopleManagement.v2']) {
  mustInclude(files.storageScope, marker, 'v40-vNext bridge key retained');
  mustInclude(files.storageScopeAudit, marker, 'v40-vNext bridge key audit');
}
for (const marker of ["removeStoredPrefix('ckd.v41.')", 'v41 입력 초기화']) {
  mustInclude(files.app, marker, 'v41 reset scope');
}
for (const marker of ["removeStoredPrefix('ckd.v40-vnext.')", "removeStoredPrefix('ckd.v40')", "removeStoredPrefix('ckd.')"]) {
  mustNotInclude(files.app, marker, 'unsafe v41 reset scope');
}

for (const marker of ['Target route: `/journey-v41-preview.html`', '/journey-v41-preview.html?v=<short-sha>', 'Protected routes are not affected', 'Local storage keys remain in the v41 namespace']) {
  mustInclude(files.browserQaChecklist, marker, 'v41 browser QA checklist');
}
for (const marker of ['src/journey-v41-*.css', 'docs/v41-browser-qa-checklist.md', 'Run v41 static smoke check', 'Run v41 typecheck', 'Run v41 build check']) {
  mustInclude(files.v41Workflow, marker, 'v41 split smoke workflow');
}
for (const marker of ['v41 Smoke', 'smoke-v41-static.mjs']) {
  mustInclude(files.v41Workflow, marker, 'v41 workflow marker');
}

if (failures.length) {
  console.error('v41 static smoke failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('v41 static smoke passed');
