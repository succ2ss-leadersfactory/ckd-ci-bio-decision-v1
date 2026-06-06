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
  'src/journey-v39-prompt-practice-lab.tsx',
  'src/journey-v39-research-strategy-lab.tsx',
  'src/journey-v39-dashboard-analysis-lab.tsx',
  'src/journey-v39-dashboard-analysis-ux-lab.tsx',
  'src/journey-v39-dashboard-result-store.ts',
  'src/journey-v39-customer-judgment-lab.tsx',
  'src/journey-v39-customer-judgment-ux-lab.tsx',
  'src/journey-v39-customer-judgment-result-store.ts',
  'src/journey-v39-customer-priority-lab.tsx',
  'src/journey-v39-customer-priority-ux-lab.tsx',
  'src/journey-v39-customer-strategy-result-store.ts',
  'src/journey-v39-member-role-lab.tsx',
  'src/journey-v39-member-role-ux-lab.tsx',
  'src/journey-v39-member-role-result-store.ts',
  'src/journey-v39-people-dialogue-lab.tsx',
  'src/journey-v39-people-dialogue-ux-lab.tsx',
  'src/journey-v39-people-dialogue-result-store.ts',
  'src/journey-v39-ai-call-plan-lab.tsx',
  'src/journey-v39-ai-call-plan-ux-lab.tsx',
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

for (const file of protectedFiles) pass(files[file].length > 0, `Protected file missing or unreadable: ${file}`);

const html = files['journey-v39-preview.html'];
pass(includes(html, '/src/journey-v39-app-preview.tsx'), 'v39 HTML must point to v39 app entry');
pass(includes(html, '<title>C1바이오 영업팀장 AI 리더십 Lab Journey</title>'), 'v39 HTML title must be client-facing');
for (const marker of ['v39 Preview', 'C1바이오 v39 Preview', 'preview shell', 'DOM 후처리']) pass(notIncludes(html, marker), `Client-facing HTML must not expose internal wording: ${marker}`);

const app = files['src/journey-v39-app-preview.tsx'];
for (const marker of ['V39PreviewApp', 'V39PromptPracticeLab', 'V39ResearchStrategyLab', 'V39DashboardAnalysisUxLab', 'V39CustomerJudgmentUxLab', 'V39CustomerPriorityUxLab', 'V39MemberRoleUxLab', 'V39PeopleDialogueUxLab', 'V39AiCallPlanUxLab', 'V39ComplianceCleanupLab', 'V39FinalCallPlanCard', 'V39InstructorDiscussionLab']) {
  pass(includes(app, marker), `v39 app missing route/component marker: ${marker}`);
}
for (const marker of ['V38_VISIBLE_APP_STEPS', 'clampV38Step', "import './journey-v38-app-preview';", "from './journey-active'"]) pass(notIncludes(app, marker), `v39 app must not expose old route marker: ${marker}`);

const config = files['src/journey-v39-preview-config.ts'];
for (const marker of ['V39_VISIBLE_APP_STEPS', 'clampV39Step', '프롬프트 기본 실습', 'AI 전략 리서치', '우리 팀 관리 지표 선정', '고객 Data 확인 List', '고객군별 2주 대응 방향', '팀원 온도차와 실행 대화']) pass(includes(config, marker), `v39 config missing marker: ${marker}`);
for (const marker of ['AI 전략 리서치 Pack', '팀원 실행진단']) pass(notIncludes(config, marker), `v39 config must not expose outdated marker: ${marker}`);

const expectedImplementationMarkers = [
  ['src/journey-v39-prompt-practice-lab.tsx', 'V39PromptPracticeLab'],
  ['src/journey-v39-research-strategy-lab.tsx', 'V39ResearchStrategyLab'],
  ['src/journey-v39-dashboard-analysis-lab.tsx', 'V38DashboardAnalysisLab'],
  ['src/journey-v39-dashboard-analysis-ux-lab.tsx', 'V39DashboardAnalysisUxLab'],
  ['src/journey-v39-customer-judgment-lab.tsx', 'V39CustomerDataJudgmentFlow'],
  ['src/journey-v39-customer-judgment-ux-lab.tsx', 'V39CustomerJudgmentUxLab'],
  ['src/journey-v39-customer-priority-lab.tsx', 'V39CustomerJudgmentBridgePanel'],
  ['src/journey-v39-customer-priority-ux-lab.tsx', 'V39CustomerPriorityUxLab'],
  ['src/journey-v39-member-role-lab.tsx', 'V39CustomerRolePlanningPanel'],
  ['src/journey-v39-member-role-ux-lab.tsx', 'V39MemberRoleUxLab'],
  ['src/journey-v39-people-dialogue-lab.tsx', 'V39PeopleDialogueLab'],
  ['src/journey-v39-people-dialogue-ux-lab.tsx', 'V39PeopleDialogueUxLab'],
  ['src/journey-v39-ai-call-plan-lab.tsx', 'V39MemberRoleCallPlanPanel'],
  ['src/journey-v39-ai-call-plan-ux-lab.tsx', 'V39AiCallPlanUxLab'],
  ['src/journey-v39-compliance-cleanup-lab.tsx', 'V39AiCallPlanCleanupPanel'],
  ['src/journey-v39-final-call-plan-card.tsx', 'V39FinalExecutionCardPanel'],
  ['src/journey-v39-instructor-discussion-lab.tsx', 'V39InstructorDiscussionPanel'],
];
for (const [file, marker] of expectedImplementationMarkers) pass(includes(files[file], marker), `${file} missing implementation marker: ${marker}`);

for (const marker of ['일반 질문과 구조화 질문의 차이', '역할·맥락·요청·출력 형식', 'AI 없이도 할 수 있습니다', 'AI를 쓰면 좋아지는 점', '제약영업 현장을 오래 해본 선배 팀장', '4단계 AI 전략 리서치로 넘길 질문']) {
  pass(includes(files['src/journey-v39-prompt-practice-lab.tsx'], marker), `prompt practice missing marker: ${marker}`);
}
for (const marker of ['실행관리 코치', 'AI 사고 파트너', '전략적 실행관리 전문가']) {
  pass(notIncludes(files['src/journey-v39-prompt-practice-lab.tsx'], marker), `prompt practice must not expose artificial marker: ${marker}`);
}

for (const marker of ['AI 전략 리서치', 'Perplexity', 'NotebookLM', 'Studio', '5단계 연결 카드', '관리 지표로 바꿀 실행 질문']) {
  pass(includes(files['src/journey-v39-research-strategy-lab.tsx'], marker), `research strategy missing marker: ${marker}`);
}
for (const marker of ['AI 전략 리서치 Pack']) pass(notIncludes(files['src/journey-v39-research-strategy-lab.tsx'], marker), `research strategy must not expose outdated marker: ${marker}`);

for (const marker of ['5단계 진행 가이드', '4단계 AI 전략 리서치 연결', '관리 지표 선정 상태', '선택한 핵심 실행 지표', '고객 Data 확인 List로 넘길 기준', '이 단계에서 하는 일', '이전 단계에서 가져온 것', '다음 단계로 넘길 것', '최소 결과물']) {
  pass(includes(files['src/journey-v39-dashboard-analysis-ux-lab.tsx'], marker), `dashboard analysis UX wrapper missing marker: ${marker}`);
}
for (const marker of ['팀원 실행 Data를 역할 판단의 근거로 정리합니다', '팀 실행진단 상태', '선택 팀원 유형']) {
  pass(notIncludes(files['src/journey-v39-dashboard-analysis-ux-lab.tsx'], marker), `dashboard analysis UX wrapper must not expose old marker: ${marker}`);
}

for (const marker of ['고객 Data 확인 List', '고객의 무엇을 확인할 것인가', '기회 신호 기준', '주의 신호 기준', '부족한 정보', '추가 확인 질문']) {
  pass(includes(files['src/journey-v39-customer-judgment-lab.tsx'], marker), `customer judgment missing data checklist marker: ${marker}`);
}
for (const marker of ['고객 유형 A~F 카드 보기와 판단 대상 선택', '집중/유지/보류/정보 보완 중 현재 판단']) {
  pass(notIncludes(files['src/journey-v39-customer-judgment-lab.tsx'], marker), `customer judgment must not expose old priority marker: ${marker}`);
}

for (const marker of ['6단계 진행 가이드', '6단계. 고객의 무엇을 볼 것인가', '5단계에서 넘겨받은 기준', '관리 지표를 고객 Data로 확인하기', '고객 Data 해석 메모', '이 단계에서 하는 일', '이전 단계에서 가져온 것', '다음 단계로 넘길 것', '최소 결과물']) {
  pass(includes(files['src/journey-v39-customer-judgment-ux-lab.tsx'], marker), `customer judgment UX wrapper missing marker: ${marker}`);
}

for (const marker of ['고객군별 2주 대응 방향', '6단계 고객 Data 확인 List', '대응 강도', '2주 대응 방향', '팀원 연결 기준', '위험·보완 조건']) {
  pass(includes(files['src/journey-v39-customer-priority-lab.tsx'], marker), `customer priority missing direction marker: ${marker}`);
}
for (const marker of ['고객 판단을 대응 전략으로 정리하기', '판단 정리']) {
  pass(notIncludes(files['src/journey-v39-customer-priority-lab.tsx'], marker), `customer priority must not expose old marker: ${marker}`);
}
for (const marker of ['7단계 진행 가이드', '고객군별 2주 대응 방향', '6단계 고객 Data 확인 List', '대응 강도', '팀원 연결 기준', '이 단계에서 하는 일', '이전 단계에서 가져온 것', '다음 단계로 넘길 것', '최소 결과물']) {
  pass(includes(files['src/journey-v39-customer-priority-ux-lab.tsx'], marker), `customer priority UX wrapper missing marker: ${marker}`);
}
for (const marker of ['고객 판단을 2주 대응 전략으로 바꿉니다']) {
  pass(notIncludes(files['src/journey-v39-customer-priority-ux-lab.tsx'], marker), `customer priority UX must not expose old marker: ${marker}`);
}

for (const marker of ['8단계 진행 가이드', '고객 전략을 팀원 역할과 코칭 포인트로 바꿉니다', '이 단계에서 하는 일', '이전 단계에서 가져온 것', '다음 단계로 넘길 것', '최소 결과물']) {
  pass(includes(files['src/journey-v39-member-role-ux-lab.tsx'], marker), `member role UX wrapper missing marker: ${marker}`);
}

for (const marker of ['팀장의 첫마디를 목적에 맞게 바꾸기', '나 때는 말이야', '지금은 말이야', '왜 대화의 시작을 바꿔야 할까', '지금 필요한 대화는 무엇인가', '평소라면 어떻게 시작하시겠습니까', '팀원은 이렇게 들을 수 있습니다', '내가 실제로 사용할 실행 대화 저장', 'DIALOGUE_PURPOSES', 'CONVERSATION_SITUATIONS']) {
  pass(includes(files['src/journey-v39-people-dialogue-lab.tsx'], marker), `people dialogue missing purpose-based marker: ${marker}`);
}

for (const marker of ['9단계 진행 가이드', '팀원 온도차와 실행 대화', '8단계 우선 1on1 연결 요약', '우선 1on1 대상']) {
  pass(includes(files['src/journey-v39-people-dialogue-ux-lab.tsx'], marker), `people dialogue UX missing marker: ${marker}`);
}

for (const marker of ['V39MemberRoleCallPlanPanel', 'AI 실행계획 Prompt', '9단계 실행 대화 요약', '목적에 맞게 바꾼 첫마디']) {
  pass(includes(files['src/journey-v39-ai-call-plan-lab.tsx'], marker), `AI call plan missing marker: ${marker}`);
}
for (const marker of ['10단계 진행 가이드', '팀원 역할과 실행 대화를 AI 실행계획 프롬프트로 연결합니다', '8단계 역할 결과', '9단계 실행 대화', '10단계 저장 상태']) {
  pass(includes(files['src/journey-v39-ai-call-plan-ux-lab.tsx'], marker), `AI call plan UX missing marker: ${marker}`);
}

for (const marker of ['V39AiCallPlanCleanupPanel', 'AI 실행계획 초안을 안전한 실행 문장으로 정리합니다', '위험 표현', '안전한 표현']) {
  pass(includes(files['src/journey-v39-compliance-cleanup-lab.tsx'], marker), `compliance cleanup missing marker: ${marker}`);
}

for (const marker of ['V39FinalExecutionCardPanel', '최종 2주 실행 카드를 완성하기', '8단계 팀원 역할 요약', '9단계 실행 대화 요약', '11단계 컴플라이언스 요약', '13단계 강사용 토의에 넘길 최종 실행 카드 저장']) {
  pass(includes(files['src/journey-v39-final-call-plan-card.tsx'], marker), `final call plan missing marker: ${marker}`);
}

for (const marker of ['V39InstructorDiscussionPanel', '최종 실행 카드를 강사용 토의 질문으로 전환하기', '13단계 강사용 토의 연결 요약', '강사용 핵심 질문', '12단계 최종 카드 새로고침', 'buildInstructorDiscussionGuide']) {
  pass(includes(files['src/journey-v39-instructor-discussion-lab.tsx'], marker), `instructor discussion missing marker: ${marker}`);
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
