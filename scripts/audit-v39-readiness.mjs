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
  'src/journey-v39-prompt-practice-lab.tsx',
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
  'V39PromptPracticeLab',
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
for (const marker of ['V38_VISIBLE_APP_STEPS', 'clampV38Step', "import './journey-v38-app-preview';", "from './journey-active'"]) {
  pass(notIncludes(app, marker), `v39 app must not expose old route marker: ${marker}`);
}

const config = files['src/journey-v39-preview-config.ts'];
for (const marker of ['V39_VISIBLE_APP_STEPS', 'clampV39Step', '프롬프트 기본 실습', 'AI 전략 리서치', '우리 팀 관리 지표 선정', '고객 Data 확인 List', '고객군별 2주 대응 방향', '팀원 온도차와 실행 대화']) {
  pass(includes(config, marker), `v39 config missing marker: ${marker}`);
}
for (const marker of ['AI 전략 리서치 Pack', '팀원 실행진단']) {
  pass(notIncludes(config, marker), `v39 config must not expose outdated marker: ${marker}`);
}

const uxComponents = files['src/journey-v39-ux-components.tsx'];
for (const marker of ['V39StepHero', 'V39FlowStrip', 'V39MiniFlow', 'V39MinimumChecklist', 'V39SafetyStrip', 'V39StepNavigationProvider', '관리 지표 선정', '2주 실행 메모']) {
  pass(includes(uxComponents, marker), `v39 UX components missing marker: ${marker}`);
}

const promptPractice = files['src/journey-v39-prompt-practice-lab.tsx'];
for (const marker of [
  'V39PromptPracticeLab',
  '일반 질문과 구조화 질문의 차이',
  '역할·맥락·요청·출력 형식',
  '결과 활용 목적',
  'AI 답변 1차 분리 정리',
  'STRUCTURED_ANSWER_SECTION_TITLES',
  'parseStructuredAiAnswer',
  '[원인 가설]',
  '[팀장이 확인할 질문]',
  '[2주 관리 지표 후보]',
  '[조심할 해석]',
  '[팀 회의 첫 설명 문장]',
  '아직 선택한 고민이 없습니다',
  '제약영업 현장을 오래 해본 선배 팀장',
  '4단계 AI 전략 리서치로 넘길 질문',
]) {
  pass(includes(promptPractice, marker), `prompt practice missing current marker: ${marker}`);
}
for (const marker of ['역할·맥락·지시/과제·형식', '후속 단계 연결 힌트', '실행관리 코치', 'AI 사고 파트너', '전략적 실행관리 전문가']) {
  pass(notIncludes(promptPractice, marker), `prompt practice must not expose outdated/artificial marker: ${marker}`);
}

const expectedWrapperMarkers = [
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
];

for (const [file, marker] of expectedWrapperMarkers) {
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
