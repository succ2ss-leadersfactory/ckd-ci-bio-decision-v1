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
  dashboardUx: read('src/journey-v39-dashboard-analysis-ux-lab.tsx'),
  customerJudgment: read('src/journey-v39-customer-judgment-lab.tsx'),
  customerJudgmentUx: read('src/journey-v39-customer-judgment-ux-lab.tsx'),
  customerPriority: read('src/journey-v39-customer-priority-lab.tsx'),
  customerPriorityUx: read('src/journey-v39-customer-priority-ux-lab.tsx'),
  memberRoleUx: read('src/journey-v39-member-role-ux-lab.tsx'),
  teamSevenCoaching: read('src/journey-v39-team-seven-coaching-map.tsx'),
  teamSevenProfiles: read('src/journey-v39-team-seven-coaching-profiles.ts'),
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
for (const marker of ['V39_VISIBLE_APP_STEPS', 'clampV39Step', '코칭 대상 선정']) mustInclude(files.config, marker, 'v39 config');

for (const marker of [
  'src/journey-v39-app-preview.tsx',
  'src/journey-v39-team-seven-coaching-map.tsx',
  'src/journey-v39-team-seven-coaching-profiles.ts',
  'src/journey-v39-ai-call-plan-lab.tsx',
  'src/journey-v39-ai-call-plan-ux-lab.tsx',
  'src/journey-v39-final-call-plan-card.tsx',
  'src/journey-v39-instructor-discussion-lab.tsx',
]) mustInclude(files.tsconfig, marker, 'tsconfig');

for (const marker of ['V39PromptPracticeLab', '일반 질문과 구조화 질문의 차이', '제약영업 현장을 오래 해본 선배 팀장']) mustInclude(files.promptPractice, marker, 'prompt practice');
for (const marker of ['V39ResearchStrategyLab', 'AI 전략 리서치', '관리 지표로 바꿀 실행 질문']) mustInclude(files.researchStrategy, marker, 'research strategy');
for (const marker of ['V39DashboardAnalysisUxLab', '관리 지표 선정 상태', '고객 Data 확인 List로 넘길 기준']) mustInclude(files.dashboardUx, marker, 'dashboard UX wrapper');
for (const marker of ['V39CustomerJudgmentLab', '고객 Data 확인 List', '고객의 무엇을 확인할 것인가']) mustInclude(files.customerJudgment, marker, 'customer judgment');
for (const marker of ['V39CustomerJudgmentUxLab', '관리 지표를 고객 Data로 확인하기']) mustInclude(files.customerJudgmentUx, marker, 'customer judgment UX wrapper');
for (const marker of ['V39CustomerPriorityLab', '고객군별 2주 대응 방향', '위험·보완 조건']) mustInclude(files.customerPriority, marker, 'customer priority');
for (const marker of ['V39CustomerPriorityUxLab', '7단계 진행 가이드', '고객군별 2주 대응 방향']) mustInclude(files.customerPriorityUx, marker, 'customer priority UX wrapper');
for (const marker of ['V39MemberRoleUxLab', '코칭 대상 선정으로 전환됨']) mustInclude(files.memberRoleUx, marker, 'member role UX compatibility');
for (const marker of ['V39TeamSevenCoachingMap', '코칭 대상 선정', 'AI로 코칭 필요 신호 정리하기', 'MZ 성장 탐색형']) mustInclude(files.teamSevenCoaching, marker, 'team seven coaching');
for (const marker of ['TEAM_MEMBER_PROFILES', 'DIRECT_PROFILE', '문교원 사원', '왜 해야 하는지', '어디까지 하면 되는지']) mustInclude(files.teamSevenProfiles, marker, 'team seven profiles');
for (const marker of ['V39PeopleDialogueLab', '팀장의 첫마디를 목적에 맞게 바꾸기', 'DIALOGUE_PURPOSES']) mustInclude(files.peopleDialogue, marker, 'people dialogue');
for (const marker of ['V39PeopleDialogueUxLab', '9단계 진행 가이드', '10단계 AI 실행계획 프롬프트']) mustInclude(files.peopleDialogueUx, marker, 'people dialogue UX wrapper');
for (const marker of ['conversationSituationId', 'dialoguePurposeId', 'ckd.v39.peopleDialogue.result.v1']) mustInclude(files.peopleDialogueStore, marker, 'people dialogue store');
for (const marker of ['V39AiCallPlanLab', '8단계 코칭 대상 선정 요약', '9단계 실행 대화 요약']) mustInclude(files.aiCallPlan, marker, 'AI call plan');
for (const marker of ['V39AiCallPlanUxLab', '코칭 대상과 실행 대화를 AI 실행계획 프롬프트로 연결합니다', '8단계 코칭 대상 선정']) mustInclude(files.aiCallPlanUx, marker, 'AI call plan UX wrapper');
for (const marker of ['팀원 역할과 실행 대화를 AI 실행계획 프롬프트로 연결합니다', '8단계 역할 결과', '팀원에게 맡길 일', '정리된 역할']) mustNotInclude(files.aiCallPlanUx, marker, 'AI call plan UX old wording');
for (const marker of ['V39ComplianceCleanupLab', 'V39AiCallPlanCleanupPanel']) mustInclude(files.compliance, marker, 'compliance');
for (const marker of ['V39FinalCallPlanCard', 'V39FinalExecutionCardPanel', '8단계 코칭 대상 선정 요약', '11단계 안전 문장·체크리스트']) mustInclude(files.finalCard, marker, 'final card');
for (const marker of ['8단계 팀원 역할 요약', '고객군 × 팀원 실행 Map', '팀원별 역할 요약']) mustNotInclude(files.finalCard, marker, 'final card old wording');
for (const marker of ['ckd.v39.finalCallPlan.result.v1', 'saveV39FinalCallPlanResult', 'loadV39FinalCallPlanResult']) mustInclude(files.finalCardStore, marker, 'final card store');
for (const marker of ['V39InstructorDiscussionLab', 'V39InstructorDiscussionPanel', '관찰 신호와 해석의 구분']) mustInclude(files.instructor, marker, 'instructor');
for (const marker of ['고객군 × 팀원 실행 Map', '업무배분 균형', '팀원 7명 업무배분']) mustNotInclude(files.instructor, marker, 'instructor old wording');

for (const marker of ['v39 Preview', 'C1바이오 v39 Preview']) mustNotInclude(files.html, marker, 'html title');
for (const marker of ['V38_VISIBLE_APP_STEPS', 'clampV38Step']) mustNotInclude(files.app, marker, 'old app route');
for (const marker of ['보수적 조직', '보수적 조직문화', '상명하복 문화', '권위적 문화', '구시대적 문화']) mustNotInclude(files.dashboardUx, marker, 'dashboard UX wording');
for (const marker of ['보수적 조직', '보수적 조직문화', '상명하복 문화', '권위적 문화', '구시대적 문화']) mustNotInclude(files.customerJudgmentUx, marker, 'customer judgment UX wording');
for (const marker of ['보수적 조직', '보수적 조직문화', '상명하복 문화', '권위적 문화', '구시대적 문화']) mustNotInclude(files.aiCallPlanUx, marker, 'AI call plan UX wording');
for (const marker of ['보수적 조직', '보수적 조직문화', '상명하복 문화', '권위적 문화', '구시대적 문화']) mustNotInclude(files.peopleDialogue, marker, 'people dialogue wording');
for (const marker of ['V38FinalCallPlanCard', "from './journey-v38-final-call-plan-card'", '<V38FinalCallPlanCard />']) mustNotInclude(files.finalCard, marker, 'old final card flow');
for (const marker of ['V38InstructorDiscussionLab', "from './journey-v38-instructor-discussion-lab'", '<V38InstructorDiscussionLab />']) mustNotInclude(files.instructor, marker, 'old instructor flow');

if (failures.length > 0) {
  console.error('v39 static smoke failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  throw new Error(`v39 static smoke failed: ${failures.length} issue(s)`);
}

console.log('v39 static smoke passed');
