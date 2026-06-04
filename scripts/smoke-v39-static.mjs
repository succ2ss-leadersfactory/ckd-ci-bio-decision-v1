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
  promptPractice: read('src/journey-v39-prompt-practice-lab.tsx'),
  researchStrategy: read('src/journey-v39-research-strategy-lab.tsx'),
  dashboard: read('src/journey-v39-dashboard-analysis-lab.tsx'),
  dashboardUx: read('src/journey-v39-dashboard-analysis-ux-lab.tsx'),
  customerJudgment: read('src/journey-v39-customer-judgment-lab.tsx'),
  customerJudgmentUx: read('src/journey-v39-customer-judgment-ux-lab.tsx'),
  customerPriority: read('src/journey-v39-customer-priority-lab.tsx'),
  customerPriorityUx: read('src/journey-v39-customer-priority-ux-lab.tsx'),
  memberRole: read('src/journey-v39-member-role-lab.tsx'),
  memberRoleUx: read('src/journey-v39-member-role-ux-lab.tsx'),
  peopleDialogue: read('src/journey-v39-people-dialogue-lab.tsx'),
  peopleDialogueUx: read('src/journey-v39-people-dialogue-ux-lab.tsx'),
  peopleDialogueStore: read('src/journey-v39-people-dialogue-result-store.ts'),
  aiCallPlan: read('src/journey-v39-ai-call-plan-lab.tsx'),
  aiCallPlanUx: read('src/journey-v39-ai-call-plan-ux-lab.tsx'),
  compliance: read('src/journey-v39-compliance-cleanup-lab.tsx'),
  finalCard: read('src/journey-v39-final-call-plan-card.tsx'),
  finalCardStore: read('src/journey-v39-final-call-plan-result-store.ts'),
  instructor: read('src/journey-v39-instructor-discussion-lab.tsx'),
};

for (const marker of ['/src/journey-v39-app-preview.tsx', '<title>C1바이오 영업팀장 AI 리더십 Lab Journey</title>']) mustInclude(files.html, marker, 'html');
for (const marker of ['V39PreviewApp', 'V39PromptPracticeLab', 'V39ResearchStrategyLab', 'V39DashboardAnalysisUxLab', 'V39CustomerJudgmentUxLab', 'V39CustomerPriorityUxLab', 'V39MemberRoleUxLab', 'V39PeopleDialogueUxLab', 'V39AiCallPlanUxLab', 'V39FinalCallPlanCard', 'V39InstructorDiscussionLab']) mustInclude(files.app, marker, 'app route');
for (const marker of ['V39_VISIBLE_APP_STEPS', 'clampV39Step', 'people-dialogue', '팀원 온도차와 실행 대화']) mustInclude(files.config, marker, 'v39 config');

for (const marker of [
  'src/journey-v39-app-preview.tsx',
  'src/journey-v39-prompt-practice-lab.tsx',
  'src/journey-v39-research-strategy-lab.tsx',
  'src/journey-v39-dashboard-analysis-lab.tsx',
  'src/journey-v39-dashboard-analysis-ux-lab.tsx',
  'src/journey-v39-customer-judgment-lab.tsx',
  'src/journey-v39-customer-judgment-ux-lab.tsx',
  'src/journey-v39-customer-priority-lab.tsx',
  'src/journey-v39-customer-priority-ux-lab.tsx',
  'src/journey-v39-member-role-lab.tsx',
  'src/journey-v39-member-role-ux-lab.tsx',
  'src/journey-v39-people-dialogue-lab.tsx',
  'src/journey-v39-people-dialogue-ux-lab.tsx',
  'src/journey-v39-people-dialogue-result-store.ts',
  'src/journey-v39-ai-call-plan-lab.tsx',
  'src/journey-v39-ai-call-plan-ux-lab.tsx',
  'src/journey-v39-final-call-plan-card.tsx',
  'src/journey-v39-final-call-plan-result-store.ts',
]) mustInclude(files.tsconfig, marker, 'tsconfig');

for (const marker of ['V39PromptPracticeLab', '일반 질문과 구조화 질문의 차이', '역할·맥락·지시/과제·형식', 'AI 없이도 할 수 있습니다', 'AI를 쓰면 좋아지는 점', '제약영업 현장을 오래 해본 선배 팀장', '4단계 AI 전략 리서치로 넘길 질문']) mustInclude(files.promptPractice, marker, 'prompt practice');
for (const marker of ['실행관리 코치', 'AI 사고 파트너', '전략적 실행관리 전문가']) mustNotInclude(files.promptPractice, marker, 'prompt practice artificial wording');
for (const marker of ['V39ResearchStrategyLab', 'AI 전략 리서치', 'Perplexity', 'NotebookLM', 'Studio', '5단계 연결 카드', '관리 지표로 바꿀 실행 질문']) mustInclude(files.researchStrategy, marker, 'research strategy');
for (const marker of ['AI 전략 리서치 Pack']) mustNotInclude(files.researchStrategy, marker, 'research strategy old naming');
for (const marker of ['AI 전략 리서치 Pack']) mustNotInclude(files.config, marker, 'v39 config old naming');
for (const marker of ['V39DashboardAnalysisLab', 'V38DashboardAnalysisLab']) mustInclude(files.dashboard, marker, 'dashboard');
for (const marker of ['V39DashboardAnalysisUxLab', '5단계 진행 가이드', '4단계 AI 전략 리서치 연결', '관리 지표 선정 상태', '선택한 핵심 실행 지표', '고객 Data 확인 List로 넘길 기준', '이 단계에서 하는 일', '이전 단계에서 가져온 것', '다음 단계로 넘길 것', '최소 결과물']) mustInclude(files.dashboardUx, marker, 'dashboard UX wrapper');
for (const marker of ['팀원 실행 Data를 역할 판단의 근거로 정리합니다', '팀 실행진단 상태', '선택 팀원 유형']) mustNotInclude(files.dashboardUx, marker, 'dashboard UX old wording');
for (const marker of ['V39CustomerJudgmentLab', 'V39CustomerDataJudgmentFlow', '고객 Data 확인 List', '고객의 무엇을 확인할 것인가', '기회 신호 기준', '주의 신호 기준', '부족한 정보', '추가 확인 질문']) mustInclude(files.customerJudgment, marker, 'customer judgment');
for (const marker of ['고객 유형 A~F 카드 보기와 판단 대상 선택', '집중/유지/보류/정보 보완 중 현재 판단']) mustNotInclude(files.customerJudgment, marker, 'customer judgment old priority flow');
for (const marker of ['V39CustomerJudgmentUxLab', '6단계 진행 가이드', '6단계. 고객의 무엇을 볼 것인가', '5단계에서 넘겨받은 기준', '관리 지표를 고객 Data로 확인하기', '고객 Data 해석 메모', '이 단계에서 하는 일', '이전 단계에서 가져온 것', '다음 단계로 넘길 것', '최소 결과물']) mustInclude(files.customerJudgmentUx, marker, 'customer judgment UX wrapper');
for (const marker of ['V39CustomerPriorityLab', 'V39CustomerJudgmentBridgePanel', '고객군별 2주 대응 방향', '6단계 고객 Data 확인 List', '대응 강도', '2주 대응 방향', '팀원 연결 기준', '위험·보완 조건']) mustInclude(files.customerPriority, marker, 'customer priority');
for (const marker of ['고객 판단을 대응 전략으로 정리하기', '판단 정리']) mustNotInclude(files.customerPriority, marker, 'customer priority old wording');
for (const marker of ['V39CustomerPriorityUxLab', '7단계 진행 가이드', '고객군별 2주 대응 방향', '6단계 고객 Data 확인 List', '대응 강도', '팀원 연결 기준', '이 단계에서 하는 일', '이전 단계에서 가져온 것', '다음 단계로 넘길 것', '최소 결과물']) mustInclude(files.customerPriorityUx, marker, 'customer priority UX wrapper');
for (const marker of ['고객 판단을 2주 대응 전략으로 바꿉니다']) mustNotInclude(files.customerPriorityUx, marker, 'customer priority UX old wording');
for (const marker of ['V39MemberRoleLab', 'V39CustomerRolePlanningPanel']) mustInclude(files.memberRole, marker, 'member role');
for (const marker of ['V39MemberRoleUxLab', '8단계 진행 가이드', '이 단계에서 하는 일', '이전 단계에서 가져온 것', '다음 단계로 넘길 것', '최소 결과물']) mustInclude(files.memberRoleUx, marker, 'member role UX wrapper');

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

for (const marker of [
  'V39PeopleDialogueUxLab',
  '9단계 진행 가이드',
  '이 단계에서 하는 일',
  '이전 단계에서 가져온 것',
  '다음 단계로 넘길 것',
  '최소 결과물',
  '10단계 AI 실행계획 프롬프트',
]) mustInclude(files.peopleDialogueUx, marker, 'people dialogue UX wrapper');

for (const marker of ['conversationSituationId', 'dialoguePurposeId', 'familiarOpeningId', 'purposeFitOpening', 'ckd.v39.peopleDialogue.result.v1']) mustInclude(files.peopleDialogueStore, marker, 'people dialogue store');
for (const marker of ['V39AiCallPlanLab', '9단계 실행 대화 요약', '목적에 맞게 바꾼 첫마디']) mustInclude(files.aiCallPlan, marker, 'AI call plan');
for (const marker of ['V39AiCallPlanUxLab', '10단계 진행 가이드', '팀원 역할과 실행 대화를 AI 실행계획 프롬프트로 연결합니다', '8단계 역할 결과', '9단계 실행 대화', '10단계 저장 상태', '이 단계에서 하는 일', '이전 단계에서 가져온 것', '다음 단계로 넘길 것', '최소 결과물']) mustInclude(files.aiCallPlanUx, marker, 'AI call plan UX wrapper');
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
for (const marker of [
  'V39InstructorDiscussionLab',
  'V39InstructorDiscussionPanel',
  '최종 실행 카드를 강사용 토의 질문으로 전환하기',
  '13단계 강사용 토의 연결 요약',
  '강사용 핵심 질문',
  '12단계 최종 카드 새로고침',
  'buildInstructorDiscussionGuide',
]) mustInclude(files.instructor, marker, 'instructor');

for (const marker of ['v39 Preview', 'C1바이오 v39 Preview']) mustNotInclude(files.html, marker, 'html title');
for (const marker of ['V38_VISIBLE_APP_STEPS', 'clampV38Step']) mustNotInclude(files.app, marker, 'old app route');
for (const marker of ['보수적 조직', '보수적 조직문화', '상명하복 문화', '권위적 문화', '구시대적 문화']) mustNotInclude(files.dashboardUx, marker, 'dashboard UX wording');
for (const marker of ['보수적 조직', '보수적 조직문화', '상명하복 문화', '권위적 문화', '구시대적 문화']) mustNotInclude(files.customerJudgmentUx, marker, 'customer judgment UX wording');
for (const marker of ['보수적 조직', '보수적 조직문화', '상명하복 문화', '권위적 문화', '구시대적 문화']) mustNotInclude(files.aiCallPlanUx, marker, 'AI call plan UX wording');
for (const marker of ['보수적 조직', '보수적 조직문화', '상명하복 문화', '권위적 문화', '구시대적 문화']) mustNotInclude(files.peopleDialogue, marker, 'people dialogue wording');
for (const marker of ['V38FinalCallPlanCard', "from './journey-v38-final-call-plan-card'", '<V38FinalCallPlanCard />', 'Final Card Bridge', '10단계 컴플라이언스 정리 결과를 최종 실행 카드에 연결', '12단계 연결용 최종 실행 카드 요약 저장']) mustNotInclude(files.finalCard, marker, 'old final card flow');
for (const marker of ['V38InstructorDiscussionLab', "from './journey-v38-instructor-discussion-lab'", '<V38InstructorDiscussionLab />', 'Instructor Discussion Bridge', '11단계 최종 실행 카드를 강사용 토의 화면에 연결']) mustNotInclude(files.instructor, marker, 'old instructor flow');

if (failures.length > 0) {
  console.error('v39 static smoke failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  throw new Error(`v39 static smoke failed: ${failures.length} issue(s)`);
}

console.log('v39 static smoke passed');
