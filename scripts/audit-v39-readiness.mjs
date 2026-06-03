import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const warnings = [];

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`Missing required file: ${relativePath}`);
    return '';
  }
  return fs.readFileSync(absolutePath, 'utf8');
}

function pass(condition, message) {
  if (!condition) failures.push(message);
}

function warn(condition, message) {
  if (!condition) warnings.push(message);
}

function includes(source, needle) {
  return source.includes(needle);
}

function notIncludes(source, needle) {
  return !source.includes(needle);
}

const protectedFiles = [
  'journey.html',
  'src/full-flow-journey-v34.tsx',
  'src/journey-active.tsx',
  'src/full-flow-journey-v35.tsx',
  'src/journey-v38-app-preview.tsx',
];

const v39Files = [
  'journey-v39-preview.html',
  'src/journey-v39-app-preview.tsx',
  'src/journey-v39-dashboard-analysis-lab.tsx',
  'src/journey-v39-dashboard-result-store.ts',
  'src/journey-v39-customer-judgment-lab.tsx',
  'src/journey-v39-customer-judgment-result-store.ts',
  'src/journey-v39-customer-priority-lab.tsx',
  'src/journey-v39-customer-strategy-result-store.ts',
  'src/journey-v39-member-role-lab.tsx',
  'src/journey-v39-member-role-result-store.ts',
  'src/journey-v39-ai-call-plan-lab.tsx',
  'src/journey-v39-ai-call-plan-result-store.ts',
  'src/journey-v39-compliance-cleanup-lab.tsx',
  'src/journey-v39-compliance-cleanup-result-store.ts',
  'src/journey-v39-final-call-plan-card.tsx',
  'src/journey-v39-final-call-plan-result-store.ts',
  'src/journey-v39-instructor-discussion-lab.tsx',
];

const qaDocs = [
  'docs/v39-preview-qa-checklist.md',
  'docs/v39-preview-readiness-report.md',
  'docs/v39-preview-manual-qa-run.md',
];

const files = Object.fromEntries([
  ...protectedFiles,
  ...v39Files,
  ...qaDocs,
  'tsconfig.v39-smoke.json',
  'scripts/smoke-v39-static.mjs',
].map((file) => [file, read(file)]));

for (const file of protectedFiles) {
  pass(files[file].length > 0, `Protected file is missing or unreadable: ${file}`);
}

const html = files['journey-v39-preview.html'];
pass(includes(html, '/src/journey-v39-app-preview.tsx'), 'v39 HTML must point to the v39 app entry');
pass(includes(html, '<title>C1바이오 영업팀장 AI 리더십 Lab Journey</title>'), 'v39 HTML title must be client-facing');
for (const unsafeTitle of ['v39 Preview', 'C1바이오 v39 Preview', 'preview shell', 'DOM 후처리']) {
  pass(notIncludes(html, unsafeTitle), `Client-facing HTML must not expose internal wording: ${unsafeTitle}`);
}

const app = files['src/journey-v39-app-preview.tsx'];
const routePairs = [
  ['dashboard-analysis', 'V39DashboardAnalysisLab'],
  ['customer-judgment', 'V39CustomerJudgmentLab'],
  ['customer-priority', 'V39CustomerPriorityLab'],
  ['member-role', 'V39MemberRoleLab'],
  ['ai-call-plan', 'V39AiCallPlanLab'],
  ['compliance-cleanup', 'V39ComplianceCleanupLab'],
  ['final-call-plan-card', 'V39FinalCallPlanCard'],
  ['instructor-discussion', 'V39InstructorDiscussionLab'],
];
for (const [routeId, componentName] of routePairs) {
  pass(includes(app, `current.id === '${routeId}'`) && includes(app, componentName), `v39 app must route ${routeId} to ${componentName}`);
}

for (const protectedImport of [
  "import './journey-v38-app-preview';",
  "from './journey-v38-app-preview'",
  "from './full-flow-journey-v34'",
  "from './full-flow-journey-v35'",
  "from './journey-active'",
]) {
  pass(notIncludes(app, protectedImport), `v39 app must not import protected implementation: ${protectedImport}`);
}

const wrapperExpectations = [
  ['src/journey-v39-dashboard-analysis-lab.tsx', 'V38DashboardAnalysisLab'],
  ['src/journey-v39-customer-judgment-lab.tsx', 'V39CustomerDataJudgmentFlow'],
  ['src/journey-v39-customer-priority-lab.tsx', 'V38CustomerPriorityLab'],
  ['src/journey-v39-member-role-lab.tsx', 'V38MemberRoleLab'],
  ['src/journey-v39-ai-call-plan-lab.tsx', 'V38AiCallPlanLab'],
  ['src/journey-v39-compliance-cleanup-lab.tsx', 'V38ComplianceCleanupLab'],
  ['src/journey-v39-final-call-plan-card.tsx', 'V38FinalCallPlanCard'],
  ['src/journey-v39-instructor-discussion-lab.tsx', 'V38InstructorDiscussionLab'],
];
for (const [file, reusedComponent] of wrapperExpectations) {
  pass(includes(files[file], reusedComponent), `v39 wrapper must use expected implementation: ${file} -> ${reusedComponent}`);
}

for (const forbiddenCustomerJudgmentMarker of [
  'V38CustomerJudgmentLab',
  "from './journey-v38-customer-judgment-lab'",
  '<V38CustomerJudgmentLab />',
]) {
  pass(notIncludes(files['src/journey-v39-customer-judgment-lab.tsx'], forbiddenCustomerJudgmentMarker), `v39 customer judgment must not expose legacy v38 flow: ${forbiddenCustomerJudgmentMarker}`);
}

const storeKeys = new Map();
for (const file of v39Files.filter((name) => name.endsWith('-store.ts'))) {
  const matches = [...files[file].matchAll(/ckd\.v39\.[A-Za-z0-9.]+\.v1/g)].map((match) => match[0]);
  pass(matches.length >= 1, `Store file must declare a v39 localStorage key: ${file}`);
  for (const key of matches) {
    if (storeKeys.has(key) && storeKeys.get(key) !== file) failures.push(`Duplicate v39 localStorage key: ${key} in ${storeKeys.get(key)} and ${file}`);
    storeKeys.set(key, file);
  }
}

const expectedKeys = [
  'ckd.v39.dashboardAnalysis.result.v1',
  'ckd.v39.customerJudgment.result.v1',
  'ckd.v39.customerStrategy.result.v1',
  'ckd.v39.memberRole.result.v1',
  'ckd.v39.aiCallPlan.result.v1',
  'ckd.v39.complianceCleanup.result.v1',
  'ckd.v39.finalCallPlan.result.v1',
];
for (const key of expectedKeys) {
  pass(storeKeys.has(key), `Missing expected v39 localStorage key: ${key}`);
}

const allV39Content = v39Files.map((file) => files[file]).join('\n');
for (const safetyPhrase of [
  '실제 고객명',
  '병원명',
  '의료진명',
  '제품명',
  '내부 매출',
  '개인정보',
]) {
  pass(includes(allV39Content, safetyPhrase), `v39 flow should repeatedly show sensitive-input guardrail: ${safetyPhrase}`);
}

for (const internalPhrase of ['DOM 후처리', 'preview shell', 'v39 Preview', 'C1바이오 v39 Preview']) {
  pass(notIncludes(html, internalPhrase), `HTML must not expose internal phrase: ${internalPhrase}`);
}

for (const riskyPhrase of ['점수화하는 단계가 아닙니다', '등급화하는 단계가 아닙니다', '평가 자료가 아니라']) {
  warn(includes(allV39Content, riskyPhrase), `Recommended anti-scoring/anti-evaluation guidance is missing: ${riskyPhrase}`);
}

const tsconfig = files['tsconfig.v39-smoke.json'];
for (const file of v39Files.filter((name) => name.endsWith('.tsx') || name.endsWith('.ts'))) {
  pass(includes(tsconfig, file), `tsconfig.v39-smoke.json must include ${file}`);
}

const staticSmoke = files['scripts/smoke-v39-static.mjs'];
for (const file of ['src/journey-v39-final-call-plan-result-store.ts', 'src/journey-v39-instructor-discussion-lab.tsx']) {
  pass(includes(staticSmoke, file), `v39 static smoke should cover ${file}`);
}

const qaChecklist = files['docs/v39-preview-qa-checklist.md'];
for (const marker of [
  '# v39 Preview QA Checklist',
  '5단계 저장',
  '6단계 저장',
  '7단계 저장',
  '8단계 저장',
  '9단계 저장',
  '10단계 저장',
  '11단계 저장',
  'Go / No-Go',
]) {
  pass(includes(qaChecklist, marker), `QA checklist must include marker: ${marker}`);
}

const readinessReport = files['docs/v39-preview-readiness-report.md'];
for (const marker of [
  '# v39 Preview Readiness Report',
  'Conditional Go',
  '보호 파일 준수 여부',
  '5→12단계 연결 구조',
  'localStorage key 현황',
  '남은 수동 QA 항목',
  'Go / No-Go 기준',
]) {
  pass(includes(readinessReport, marker), `Readiness report must include marker: ${marker}`);
}

const manualQaRun = files['docs/v39-preview-manual-qa-run.md'];
for (const marker of [
  '# v39 Preview Manual QA Run',
  'QA 기본 정보',
  'End-to-End 저장·연결 QA',
  '5→8',
  '11→12',
  '발견 이슈 기록',
  'Go / No-Go 판단',
]) {
  pass(includes(manualQaRun, marker), `Manual QA run must include marker: ${marker}`);
}

if (failures.length > 0) {
  console.error('v39 readiness audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  if (warnings.length > 0) {
    console.warn('v39 readiness audit warnings:');
    for (const item of warnings) console.warn(`- ${item}`);
  }
  throw new Error(`v39 readiness audit failed: ${failures.length} issue(s)`);
}

console.log('v39 readiness audit passed');
if (warnings.length > 0) {
  console.warn('v39 readiness audit warnings:');
  for (const item of warnings) console.warn(`- ${item}`);
}
