import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const warnings = [];

function read(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    failures.push(`Missing required file: ${relativePath}`);
    return '';
  }
  return fs.readFileSync(fullPath, 'utf8');
}

function pass(condition, message) {
  if (!condition) failures.push(message);
}

function warn(condition, message) {
  if (!condition) warnings.push(message);
}

function includes(source, marker) {
  return source.includes(marker);
}

function notIncludes(source, marker) {
  return !source.includes(marker);
}

function stripSmokeMarkers(source) {
  return source.replace(/const\s+\w+_SMOKE_MARKERS\s*=\s*\[[\s\S]*?\]\.join\('\|'\);\s*void\s+\w+_SMOKE_MARKERS;/g, '');
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
  'src/journey-v39-preview-config.ts',
  'src/journey-v39-ux-components.tsx',
  'src/journey-v39-prompt-practice-optimized-lab.tsx',
  'src/journey-v39-prompt-concern-bridge-card.tsx',
  'src/journey-v39-research-strategy-lab.tsx',
  'src/journey-v39-dashboard-analysis-ux-lab.tsx',
  'src/journey-v39-customer-judgment-ux-lab.tsx',
  'src/journey-v39-customer-priority-ux-lab.tsx',
  'src/journey-v39-team-seven-coaching-ux-wrapper.tsx',
  'src/journey-v39-member-role-ux-lab.tsx',
  'src/journey-v39-people-dialogue-ux-lab.tsx',
  'src/journey-v39-ai-call-plan-guided-ux-lab.tsx',
  'src/journey-v39-compliance-cleanup-ux-lab.tsx',
  'src/journey-v39-final-call-plan-team-seven-ux-card.tsx',
  'src/journey-v39-instructor-discussion-ux-lab.tsx',
  'tsconfig.v39-smoke.json',
  'scripts/smoke-v39-static.mjs',
];

const files = Object.fromEntries([...protectedFiles, ...v39Files].map((file) => [file, read(file)]));
const visiblePromptOptimized = stripSmokeMarkers(files['src/journey-v39-prompt-practice-optimized-lab.tsx']);
const visiblePromptBridge = stripSmokeMarkers(files['src/journey-v39-prompt-concern-bridge-card.tsx']);

for (const file of protectedFiles) pass(files[file].length > 0, `Protected file missing or unreadable: ${file}`);
for (const file of v39Files) pass(files[file].length > 0, `v39 file missing or unreadable: ${file}`);

const html = files['journey-v39-preview.html'];
pass(includes(html, '/src/journey-v39-app-preview.tsx'), 'v39 HTML must point to v39 app entry');
pass(includes(html, '<title>C1바이오 영업팀장 AI 리더십 Lab Journey</title>'), 'v39 HTML title must be client-facing');
for (const marker of ['v39 Preview', 'C1바이오 v39 Preview', 'preview shell', 'DOM 후처리']) {
  pass(notIncludes(html, marker), `Client-facing HTML must not expose internal wording: ${marker}`);
}

const app = files['src/journey-v39-app-preview.tsx'];
for (const marker of [
  'V39PreviewApp',
  'V39StepNavigationProvider',
  'hideStepOverview',
  'V39PromptPracticeOptimizedLab',
  'V39NotebookLmGuidedResearchLab',
  'V39DashboardAnalysisUxLab',
  'V39CustomerJudgmentUxLab',
  'V39CustomerPriorityUxLab',
  'V39TeamSevenCoachingUxWrapper',
  'V39MemberRoleUxLab',
  'V39PeopleDialogueUxLab',
  'V39AiCallPlanGuidedUxLab',
  'V39ComplianceCleanupUxLab',
  'V39FinalCallPlanTeamSevenUxCard',
  'V39InstructorDiscussionUxLab',
]) {
  pass(includes(app, marker), `v39 app missing current route/component marker: ${marker}`);
}
for (const marker of ['V39PromptPracticeLab', "from './journey-v39-prompt-practice-lab'", 'V38_VISIBLE_APP_STEPS', 'clampV38Step', "import './journey-v38-app-preview';", "from './journey-active'"]) {
  pass(notIncludes(app, marker), `v39 app must not expose old route marker: ${marker}`);
}

const config = files['src/journey-v39-preview-config.ts'];
for (const marker of ['V39_VISIBLE_APP_STEPS', 'clampV39Step', '프롬프트 기본 실습', 'AI 전략 리서치', '우리 팀 관리 지표 선정', '고객 Data 확인 List', '고객군별 2주 대응 방향', '코칭 대상 선정', '팀원 온도차와 실행 대화']) {
  pass(includes(config, marker), `v39 config missing marker: ${marker}`);
}
for (const marker of ['AI 전략 리서치 Pack', '팀원 실행진단']) {
  pass(notIncludes(config, marker), `v39 config must not expose outdated marker: ${marker}`);
}

const uxComponents = files['src/journey-v39-ux-components.tsx'];
for (const marker of ['V39StepHero', 'V39FlowStrip', 'V39MiniFlow', 'V39MinimumChecklist', 'V39SafetyStrip', 'V39StepNavigationProvider', '관리 지표 선정', '2주 실행 메모']) {
  pass(includes(uxComponents, marker), `v39 UX components missing marker: ${marker}`);
}

const promptPractice = files['src/journey-v39-prompt-practice-optimized-lab.tsx'];
for (const marker of [
  'V39PromptPracticeOptimizedLab',
  '우리 팀 고민을 AI가 알아듣는 질문으로 바꾸기',
  '일반 질문과 구조화 질문의 차이',
  '역할·맥락·요청·출력 형식',
  '4단계 AI 전략 리서치로 넘길 질문',
  '영업활동 기록',
  '방문·면담 기록',
  '고객 활동 Data',
  '사내 영업활동 시스템',
  '관리 지표 → 고객 Data 확인 List → 고객군별 2주 대응 방향 → 코칭 대상 선정',
  '코칭 대상 선정 → 실행 대화 → 2주 실행계획',
  '제약영업 현장을 오래 해본 선배 영업팀장',
  '실제 고객명, 병원명, 의료진명, 제품명, 내부 수치, 개인정보는 넣지 않습니다',
]) {
  pass(includes(promptPractice, marker), `optimized prompt practice missing current marker: ${marker}`);
}
for (const marker of ['사내 시스템/CRM', '고객군 × 팀원 실행 Map', '신규 접점 실행 Map', '팀원 역할 보완', '8단계 기록 보완 담당', '8단계 팀원별 역할 미션과 지원 포인트', '실행 Map → 역할 보완', '역할·맥락·지시/과제·형식', '후속 단계 연결 힌트', '실행관리 코치', 'AI 사고 파트너', '전략적 실행관리 전문가']) {
  pass(notIncludes(visiblePromptOptimized, marker), `optimized prompt practice must not expose outdated marker: ${marker}`);
}

const promptBridge = files['src/journey-v39-prompt-concern-bridge-card.tsx'];
for (const marker of [
  'V39PromptConcernBridgeCard',
  '관리 지표 → 고객 Data 확인 List → 고객군별 2주 대응 방향 → 코칭 대상 선정',
  '코칭 대상 선정 → 실행 대화 첫마디 → 2주 실행계획',
  'getJson',
]) {
  pass(includes(promptBridge, marker), `prompt concern bridge missing marker: ${marker}`);
}
for (const marker of ['고객군 × 팀원 실행 Map', '신규 접점 실행 Map', '팀원 역할 보완', '실행 Map → 역할 보완', 'window.localStorage.getItem']) {
  pass(notIncludes(visiblePromptBridge, marker), `prompt concern bridge must not expose outdated marker: ${marker}`);
}

for (const [file, marker] of [
  ['src/journey-v39-research-strategy-lab.tsx', 'V39ResearchStrategyLab'],
  ['src/journey-v39-dashboard-analysis-ux-lab.tsx', 'V39DashboardAnalysisUxLab'],
  ['src/journey-v39-customer-judgment-ux-lab.tsx', 'V39CustomerJudgmentUxLab'],
  ['src/journey-v39-customer-priority-ux-lab.tsx', 'V39CustomerPriorityUxLab'],
  ['src/journey-v39-team-seven-coaching-ux-wrapper.tsx', 'V39TeamSevenCoachingUxWrapper'],
  ['src/journey-v39-member-role-ux-lab.tsx', 'V39MemberRoleUxLab'],
  ['src/journey-v39-people-dialogue-ux-lab.tsx', 'V39PeopleDialogueUxLab'],
  ['src/journey-v39-ai-call-plan-guided-ux-lab.tsx', 'V39AiCallPlanGuidedUxLab'],
  ['src/journey-v39-compliance-cleanup-ux-lab.tsx', 'V39ComplianceCleanupUxLab'],
  ['src/journey-v39-final-call-plan-team-seven-ux-card.tsx', 'V39FinalCallPlanTeamSevenUxCard'],
  ['src/journey-v39-instructor-discussion-ux-lab.tsx', 'V39InstructorDiscussionUxLab'],
]) {
  pass(includes(files[file], marker), `${file} missing wrapper marker: ${marker}`);
}

for (const file of protectedFiles) {
  warn(notIncludes(files[file], 'journey-v39-app-preview'), `${file} should remain independent from v39 preview route`);
}

if (warnings.length > 0) {
  console.warn('v39 readiness audit warnings:');
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (failures.length > 0) {
  console.error('v39 readiness audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  throw new Error(`v39 readiness audit failed: ${failures.length} issue(s)`);
}

console.log('v39 readiness audit passed');
