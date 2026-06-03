import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];

function read(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    failures.push(`Missing required file: ${relativePath}`);
    return '';
  }
  return fs.readFileSync(fullPath, 'utf8');
}

function mustInclude(source, marker, label) {
  if (!source.includes(marker)) failures.push(`Missing ${label}: ${marker}`);
}

function mustNotInclude(source, marker, label) {
  if (source.includes(marker)) failures.push(`Unexpected ${label}: ${marker}`);
}

const files = {
  html: read('journey-v39-preview.html'),
  app: read('src/journey-v39-app-preview.tsx'),
  config: read('src/journey-v39-preview-config.ts'),
  tsconfig: read('tsconfig.v39-smoke.json'),
  dashboard: read('src/journey-v39-dashboard-analysis-lab.tsx'),
  customerJudgment: read('src/journey-v39-customer-judgment-lab.tsx'),
  customerPriority: read('src/journey-v39-customer-priority-lab.tsx'),
  memberRole: read('src/journey-v39-member-role-lab.tsx'),
  peopleDialogue: read('src/journey-v39-people-dialogue-lab.tsx'),
  peopleDialogueStore: read('src/journey-v39-people-dialogue-result-store.ts'),
  aiCallPlan: read('src/journey-v39-ai-call-plan-lab.tsx'),
  compliance: read('src/journey-v39-compliance-cleanup-lab.tsx'),
  finalCard: read('src/journey-v39-final-call-plan-card.tsx'),
  finalCardStore: read('src/journey-v39-final-call-plan-result-store.ts'),
  instructor: read('src/journey-v39-instructor-discussion-lab.tsx'),
};

for (const marker of ['/src/journey-v39-app-preview.tsx', '<title>C1바이오 영업팀장 AI 리더십 Lab Journey</title>']) mustInclude(files.html, marker, 'html');
for (const marker of ['V39PreviewApp', 'V39PeopleDialogueLab', 'V39FinalCallPlanCard', 'V39InstructorDiscussionLab']) mustInclude(files.app, marker, 'app route');
for (const marker of ['V39_VISIBLE_APP_STEPS', 'clampV39Step', 'people-dialogue', '팀원 온도차와 실행 대화']) mustInclude(files.config, marker, 'v39 config');

for (const marker of [
  'src/journey-v39-app-preview.tsx',
  'src/journey-v39-people-dialogue-lab.tsx',
  'src/journey-v39-people-dialogue-result-store.ts',
  'src/journey-v39-final-call-plan-card.tsx',
  'src/journey-v39-final-call-plan-result-store.ts',
]) mustInclude(files.tsconfig, marker, 'tsconfig');

for (const marker of ['V39DashboardAnalysisLab', 'V38DashboardAnalysisLab']) mustInclude(files.dashboard, marker, 'dashboard');
for (const marker of ['V39CustomerJudgmentLab', 'V39CustomerDataJudgmentFlow']) mustInclude(files.customerJudgment, marker, 'customer judgment');
for (const marker of ['V39CustomerPriorityLab', 'V39CustomerJudgmentBridgePanel']) mustInclude(files.customerPriority, marker, 'customer priority');
for (const marker of ['V39MemberRoleLab', 'V39CustomerRolePlanningPanel']) mustInclude(files.memberRole, marker, 'member role');

for (const marker of [
  'V39PeopleDialogueLab',
  '팀장의 첫마디를 목적에 맞게 바꾸기',
  '나 때는 말이야',
  '지금은 말이야',
  '왜 대화의 시작을 바꿔야 할까',
  '지금 필요한 대화는 무엇인가',
  '평소라면 어떻게 시작하시겠습니까',
  '팀원은 이렇게 들을 수 있습니다',
  '내가 실제로 사용할 실행 대화 저장',
  'DIALOGUE_PURPOSES',
  'CONVERSATION_SITUATIONS',
]) mustInclude(files.peopleDialogue, marker, 'people dialogue');

for (const marker of ['conversationSituationId', 'dialoguePurposeId', 'familiarOpeningId', 'purposeFitOpening', 'ckd.v39.peopleDialogue.result.v1']) mustInclude(files.peopleDialogueStore, marker, 'people dialogue store');
for (const marker of ['V39AiCallPlanLab', '9단계 실행 대화 요약', '목적에 맞게 바꾼 첫마디']) mustInclude(files.aiCallPlan, marker, 'AI call plan');
for (const marker of ['V39ComplianceCleanupLab', 'V39AiCallPlanCleanupPanel', '12단계 최종 실행 카드에 반영할 안전 문장 정리']) mustInclude(files.compliance, marker, 'compliance');

for (const marker of [
  'V39FinalCallPlanCard',
  'V39FinalExecutionCardPanel',
  '최종 2주 실행 카드를 완성하기',
  '8단계 팀원 역할 요약',
  '9단계 실행 대화 요약',
  '11단계 컴플라이언스 요약',
  '13단계 강사용 토의에 넘길 최종 실행 카드 저장',
]) mustInclude(files.finalCard, marker, 'final card');

for (const marker of ['ckd.v39.finalCallPlan.result.v1', 'saveV39FinalCallPlanResult', 'loadV39FinalCallPlanResult']) mustInclude(files.finalCardStore, marker, 'final card store');
for (const marker of ['V39InstructorDiscussionLab', 'buildInstructorDiscussionGuide']) mustInclude(files.instructor, marker, 'instructor');

for (const marker of ['v39 Preview', 'C1바이오 v39 Preview']) mustNotInclude(files.html, marker, 'html title');
for (const marker of ['V38_VISIBLE_APP_STEPS', 'clampV38Step']) mustNotInclude(files.app, marker, 'old app route');
for (const marker of ['보수적 조직', '보수적 조직문화', '상명하복 문화', '권위적 문화', '구시대적 문화']) mustNotInclude(files.peopleDialogue, marker, 'people dialogue wording');
for (const marker of ['V38FinalCallPlanCard', "from './journey-v38-final-call-plan-card'", '<V38FinalCallPlanCard />', 'Final Card Bridge', '10단계 컴플라이언스 정리 결과를 최종 실행 카드에 연결', '12단계 연결용 최종 실행 카드 요약 저장']) mustNotInclude(files.finalCard, marker, 'old final card flow');

if (failures.length > 0) {
  console.error('v39 static smoke failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  throw new Error(`v39 static smoke failed: ${failures.length} issue(s)`);
}

console.log('v39 static smoke passed');
