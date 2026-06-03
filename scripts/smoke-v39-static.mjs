import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`Missing required file: ${relativePath}`);
    return '';
  }
  return fs.readFileSync(absolutePath, 'utf8');
}

function checkIncludes(source, needle, label) {
  if (!source.includes(needle)) failures.push(`Missing ${label}: ${needle}`);
}

function checkNotIncludes(source, needle, label) {
  if (source.includes(needle)) failures.push(`Unexpected ${label}: ${needle}`);
}

const files = {
  html: read('journey-v39-preview.html'),
  app: read('src/journey-v39-app-preview.tsx'),
  previewConfig: read('src/journey-v39-preview-config.ts'),
  dashboardWrapper: read('src/journey-v39-dashboard-analysis-lab.tsx'),
  dashboardCore: read('src/journey-v38-dashboard-analysis-lab.tsx'),
  customerJudgmentWrapper: read('src/journey-v39-customer-judgment-lab.tsx'),
  customerJudgmentStore: read('src/journey-v39-customer-judgment-result-store.ts'),
  customerPriorityBridge: read('src/journey-v39-customer-priority-lab.tsx'),
  customerStrategyStore: read('src/journey-v39-customer-strategy-result-store.ts'),
  memberRoleBridge: read('src/journey-v39-member-role-lab.tsx'),
  memberRoleStore: read('src/journey-v39-member-role-result-store.ts'),
  peopleDialogueLab: read('src/journey-v39-people-dialogue-lab.tsx'),
  peopleDialogueStore: read('src/journey-v39-people-dialogue-result-store.ts'),
  aiCallPlanBridge: read('src/journey-v39-ai-call-plan-lab.tsx'),
  aiCallPlanStore: read('src/journey-v39-ai-call-plan-result-store.ts'),
  complianceBridge: read('src/journey-v39-compliance-cleanup-lab.tsx'),
  complianceStore: read('src/journey-v39-compliance-cleanup-result-store.ts'),
  finalCardBridge: read('src/journey-v39-final-call-plan-card.tsx'),
  finalCardStore: read('src/journey-v39-final-call-plan-result-store.ts'),
  instructorBridge: read('src/journey-v39-instructor-discussion-lab.tsx'),
  dashboardStore: read('src/journey-v39-dashboard-result-store.ts'),
  viteConfig: read('vite.config.ts'),
  packageJson: read('package.json'),
  tsconfig: read('tsconfig.v39-smoke.json'),
};

for (const [label, source, markers] of [
  ['html', files.html, ['/src/journey-v39-app-preview.tsx', '<title>C1바이오 영업팀장 AI 리더십 Lab Journey</title>']],
  ['app route', files.app, ['V39PreviewApp', 'V39DashboardAnalysisLab', 'V39CustomerJudgmentLab', 'V39CustomerPriorityLab', 'V39MemberRoleLab', 'V39PeopleDialogueLab', 'V39AiCallPlanLab', 'V39ComplianceCleanupLab', 'V39FinalCallPlanCard', 'V39InstructorDiscussionLab']],
  ['v39 preview config', files.previewConfig, ['people-dialogue', '팀원 온도차와 실행 대화', 'clampV39Step', 'V39_VISIBLE_APP_STEPS']],
  ['vite', files.viteConfig, ['journeyV39Preview', 'journey-v39-preview.html']],
  ['package', files.packageJson, ['smoke:v39', 'typecheck:v39']],
  ['tsconfig', files.tsconfig, [
    'src/journey-v39-app-preview.tsx',
    'src/journey-v39-preview-config.ts',
    'src/journey-v39-dashboard-analysis-lab.tsx',
    'src/journey-v39-customer-judgment-lab.tsx',
    'src/journey-v39-customer-judgment-result-store.ts',
    'src/journey-v39-customer-priority-lab.tsx',
    'src/journey-v39-customer-strategy-result-store.ts',
    'src/journey-v39-member-role-lab.tsx',
    'src/journey-v39-member-role-result-store.ts',
    'src/journey-v39-people-dialogue-lab.tsx',
    'src/journey-v39-people-dialogue-result-store.ts',
    'src/journey-v39-ai-call-plan-lab.tsx',
    'src/journey-v39-ai-call-plan-result-store.ts',
    'src/journey-v39-compliance-cleanup-lab.tsx',
    'src/journey-v39-compliance-cleanup-result-store.ts',
    'src/journey-v39-final-call-plan-card.tsx',
    'src/journey-v39-final-call-plan-result-store.ts',
    'src/journey-v39-instructor-discussion-lab.tsx',
    'src/journey-v39-dashboard-result-store.ts',
  ]],
]) {
  for (const marker of markers) checkIncludes(source, marker, label);
}

for (const [label, source, markers] of [
  ['dashboard wrapper', files.dashboardWrapper, ['V39DashboardAnalysisLab', 'V38DashboardAnalysisLab', 'heroVariant="customer"']],
  ['dashboard customer hero', files.dashboardCore, ['heroVariant?: DashboardHeroVariant', 'heroVariant === \'customer\'', '5단계 팀 실행진단', '우리 팀 지표로 다음 행동 준비하기', 'CustomerProgressItem']],
  ['customer judgment wrapper', files.customerJudgmentWrapper, ['V39CustomerJudgmentLab', 'V39CustomerDataJudgmentFlow', '고객 Data에서 기회와 착시 구분하기', '고객 Data 상황 선택', '고객 판단 기준 정하기', '고객별 신호 정리와 2주 판단 메모', 'AI 고객 신호 분리 프롬프트 준비']],
  ['customer judgment store', files.customerJudgmentStore, ['ckd.v39.customerJudgment.result.v1', 'customerContextSelections', 'judgmentCriteriaSelections', 'selectedCustomerTypeIds', 'rawAiSignalResult', 'saveV39CustomerJudgmentResult', 'loadV39CustomerJudgmentResult']],
  ['customer priority bridge', files.customerPriorityBridge, ['V39CustomerPriorityLab', 'V39CustomerJudgmentBridgePanel', '고객 판단을 대응 전략으로 정리하기', '기회 신호', '착시·리스크 신호', '부족한 정보', '2주 판단 메모', '6단계 판단으로 전략 초안 채우기', 'saveV39CustomerStrategyResult']],
  ['customer strategy store', files.customerStrategyStore, ['ckd.v39.customerStrategy.result.v1', 'saveV39CustomerStrategyResult', 'loadV39CustomerStrategyResult']],
  ['member role bridge', files.memberRoleBridge, ['V39MemberRoleLab', 'V39CustomerRolePlanningPanel', '고객 대응 전략을 팀원 역할로 구체화하기', '팀 실행진단을 역할 방향으로 정리하기', '역할 초안 가져오기', 'saveV39MemberRoleResult']],
  ['member role store', files.memberRoleStore, ['ckd.v39.memberRole.result.v1', 'saveV39MemberRoleResult', 'loadV39MemberRoleResult']],
  ['people dialogue lab', files.peopleDialogueLab, ['V39PeopleDialogueLab', '팀장의 첫마디를 목적에 맞게 바꾸기', '나 때는 말이야', '지금은 말이야', '왜 대화의 시작을 바꿔야 할까', '지금 필요한 대화는 무엇인가', '평소라면 어떻게 시작하시겠습니까', '팀원은 이렇게 들을 수 있습니다', '내가 실제로 사용할 실행 대화 저장', 'DIALOGUE_PURPOSES', 'CONVERSATION_SITUATIONS']],
  ['people dialogue store', files.peopleDialogueStore, ['ckd.v39.peopleDialogue.result.v1', 'conversationSituationId', 'dialoguePurposeId', 'familiarOpeningId', 'perceivedByNewGen', 'purposeFitOpening', 'saveV39PeopleDialogueResult', 'loadV39PeopleDialogueResult']],
  ['AI call plan bridge', files.aiCallPlanBridge, ['V39AiCallPlanLab', 'V39MemberRoleCallPlanPanel', '역할과 실행 대화를 AI Call Plan으로 구체화하기', '실행 대화 새로고침', '9단계 실행 대화 요약', '선택한 대화 목적 ID', '목적에 맞게 바꾼 첫마디', 'AI Call Plan 프롬프트 복사', '팀원 실행 대화 포인트', 'saveV39AiCallPlanResult']],
  ['AI call plan store', files.aiCallPlanStore, ['ckd.v39.aiCallPlan.result.v1', 'saveV39AiCallPlanResult', 'loadV39AiCallPlanResult']],
  ['compliance bridge', files.complianceBridge, ['V39ComplianceCleanupLab', 'V39AiCallPlanCleanupPanel', 'AI Call Plan의 위험 표현을 안전한 실행 문장으로 바꾸기', '팀원 실행 대화 기준', '팀원에게 부담을 전가하는 표현', '세대 특성으로 팀원을 단정하는 표현', '12단계 최종 실행 카드에 반영할 안전 문장 정리', 'saveV39ComplianceCleanupResult']],
  ['compliance store', files.complianceStore, ['ckd.v39.complianceCleanup.result.v1', 'saveV39ComplianceCleanupResult', 'loadV39ComplianceCleanupResult']],
  ['final card bridge', files.finalCardBridge, ['V39FinalCallPlanCard', 'V38FinalCallPlanCard', '10단계 컴플라이언스 정리 결과를 최종 실행 카드에 연결', '12단계 연결용 최종 실행 카드 요약 저장', 'saveV39FinalCallPlanResult']],
  ['final card store', files.finalCardStore, ['ckd.v39.finalCallPlan.result.v1', 'saveV39FinalCallPlanResult', 'loadV39FinalCallPlanResult']],
  ['instructor bridge', files.instructorBridge, ['V39InstructorDiscussionLab', 'V38InstructorDiscussionLab', '11단계 최종 실행 카드를 강사용 토의 화면에 연결', '토의 요약 복사', 'buildInstructorDiscussionGuide']],
  ['dashboard store', files.dashboardStore, ['ckd.v39.dashboardAnalysis.result.v1', 'saveV39DashboardResult', 'loadV39DashboardResult']],
]) {
  for (const marker of markers) checkIncludes(source, marker, label);
}

for (const [label, source, markers] of [
  ['html title', files.html, ['v39 Preview', 'C1바이오 v39 Preview']],
  ['app old side effect', files.app, ["import './journey-v38-app-preview';", 'V38_VISIBLE_APP_STEPS', 'clampV38Step']],
  ['people dialogue banned wording', files.peopleDialogueLab, ['보수적 조직', '보수적 조직문화', '상명하복 문화', '권위적 문화', '구시대적 문화']],
  ['customer judgment old flow hidden', files.customerJudgmentWrapper, ['V38CustomerJudgmentLab', "from './journey-v38-customer-judgment-lab'", '<V38CustomerJudgmentLab />', 'Customer Priority Selection', '고객별 우선순위 선택', '프롬프트 대상 고객 유형']],
  ['customer priority old flow hidden', files.customerPriorityBridge, ['V38CustomerPriorityLab', "from './journey-v38-customer-priority-lab'", '<V38CustomerPriorityLab />', 'Customer Judgment Bridge', '6단계 고객 판단 결과 연결', '8단계 연결용', '연결 초안 가져오기']],
  ['member role old flow hidden', files.memberRoleBridge, ['V38MemberRoleLab', "from './journey-v38-member-role-lab'", '<V38MemberRoleLab />', 'Customer Strategy Bridge', 'Step 5 → Step 8 Bridge', '7단계 고객 대응 전략을 팀원 역할 배정에 연결', '9단계 연결용', '9단계 연결 초안 가져오기']],
  ['AI call plan old flow hidden', files.aiCallPlanBridge, ['V38AiCallPlanLab', "from './journey-v38-ai-call-plan-lab'", '<V38AiCallPlanLab />', 'Member Role Bridge', '8단계 팀원 역할 배정을 AI Call Plan에 연결', '연결 프롬프트 복사', 'Call Plan Cleanup Bridge', '10단계 연결용', '10단계 연결 초안 가져오기']],
  ['compliance old flow hidden', files.complianceBridge, ['V38ComplianceCleanupLab', "from './journey-v38-compliance-cleanup-lab'", '<V38ComplianceCleanupLab />', 'Call Plan Cleanup Bridge', '9단계 AI Call Plan 결과를 컴플라이언스 정리에 연결', '11단계 연결용', '11단계 연결 초안 가져오기', 'Final Card Bridge']],
  ['dashboard wrapper removed memo panel', files.dashboardWrapper, ['팀 실행진단 메모', 'Team Execution Memo', '입력 내용 저장', '저장 내용 비우기', 'saveV39DashboardResult']],
]) {
  for (const marker of markers) checkNotIncludes(source, marker, label);
}

if (failures.length > 0) {
  console.error('v39 static smoke failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  throw new Error(`v39 static smoke failed: ${failures.length} issue(s)`);
}

console.log('v39 static smoke passed');