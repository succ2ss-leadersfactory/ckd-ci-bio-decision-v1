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
  wrapper: read('src/journey-v39-dashboard-analysis-lab.tsx'),
  customerJudgmentWrapper: read('src/journey-v39-customer-judgment-lab.tsx'),
  customerJudgmentStore: read('src/journey-v39-customer-judgment-result-store.ts'),
  customerPriorityBridge: read('src/journey-v39-customer-priority-lab.tsx'),
  customerStrategyStore: read('src/journey-v39-customer-strategy-result-store.ts'),
  memberRoleBridge: read('src/journey-v39-member-role-lab.tsx'),
  memberRoleStore: read('src/journey-v39-member-role-result-store.ts'),
  aiCallPlanBridge: read('src/journey-v39-ai-call-plan-lab.tsx'),
  store: read('src/journey-v39-dashboard-result-store.ts'),
  viteConfig: read('vite.config.ts'),
  packageJson: read('package.json'),
  tsconfig: read('tsconfig.v39-smoke.json'),
};

checkIncludes(files.html, '/src/journey-v39-app-preview.tsx', 'v39 HTML entry script');
checkIncludes(files.html, '<title>C1바이오 영업팀장 AI 리더십 Lab Journey</title>', 'v39 client-facing HTML title');
checkIncludes(files.app, 'V39PreviewApp', 'v39 preview app component');
checkIncludes(files.app, 'V39DashboardAnalysisLab', 'v39 dashboard wrapper route');
checkIncludes(files.app, 'V39CustomerJudgmentLab', 'v39 customer judgment wrapper route');
checkIncludes(files.app, 'V39CustomerPriorityLab', 'v39 customer priority bridge route');
checkIncludes(files.app, 'V39MemberRoleLab', 'v39 member role bridge route');
checkIncludes(files.app, 'V39AiCallPlanLab', 'v39 AI call plan bridge route');
checkIncludes(files.app, 'ckd.v39.participant.v1', 'v39 participant storage key');
checkIncludes(files.app, 'ckd.v39.progress.v1', 'v39 progress storage key');
checkIncludes(files.viteConfig, 'journeyV39Preview', 'vite v39 input key');
checkIncludes(files.viteConfig, 'journey-v39-preview.html', 'vite v39 HTML input');
checkIncludes(files.packageJson, 'smoke:v39', 'package v39 smoke script');
checkIncludes(files.packageJson, 'typecheck:v39', 'package v39 typecheck script');
checkIncludes(files.tsconfig, 'src/journey-v39-app-preview.tsx', 'v39 tsconfig entry');
checkIncludes(files.tsconfig, 'src/journey-v39-dashboard-analysis-lab.tsx', 'v39 tsconfig dashboard wrapper');
checkIncludes(files.tsconfig, 'src/journey-v39-customer-judgment-lab.tsx', 'v39 tsconfig customer judgment wrapper');
checkIncludes(files.tsconfig, 'src/journey-v39-customer-judgment-result-store.ts', 'v39 tsconfig customer judgment result store');
checkIncludes(files.tsconfig, 'src/journey-v39-customer-priority-lab.tsx', 'v39 tsconfig customer priority bridge');
checkIncludes(files.tsconfig, 'src/journey-v39-customer-strategy-result-store.ts', 'v39 tsconfig customer strategy result store');
checkIncludes(files.tsconfig, 'src/journey-v39-member-role-lab.tsx', 'v39 tsconfig member role bridge');
checkIncludes(files.tsconfig, 'src/journey-v39-member-role-result-store.ts', 'v39 tsconfig member role result store');
checkIncludes(files.tsconfig, 'src/journey-v39-ai-call-plan-lab.tsx', 'v39 tsconfig AI call plan bridge');
checkIncludes(files.tsconfig, 'src/journey-v39-dashboard-result-store.ts', 'v39 tsconfig dashboard result store');

for (const marker of [
  'V39DashboardAnalysisLab',
  'V38DashboardAnalysisLab',
  '5단계 결과 저장 구조 준비',
  'v39 5단계 핵심 결과 수동 저장 패널',
  'v39 5단계 결과 저장',
  '우리 팀 상황, 줄바꿈으로 최대 3개',
  '핵심 지표, 쉼표로 최대 3개',
  '선택 유형 ID, 쉼표로 최대 2개',
  '최종 다음 행동 준비물',
  'splitLines',
  'splitComma',
  'saveManualResult',
  'v39 저장 구조 초기화 테스트',
  'v39 저장 구조 비우기',
  'saveV39DashboardResult',
  'loadV39DashboardResult',
  'clearV39DashboardResult',
]) {
  checkIncludes(files.wrapper, marker, 'v39 dashboard wrapper marker');
}

for (const marker of [
  'V39CustomerJudgmentLab',
  'V38CustomerJudgmentLab',
  'Customer Data Judgment Frame',
  '고객 Data 판단 프레임',
  '6단계는 고객을 점수화하거나 등급화하는 단계가 아닙니다',
  '기회성 Data',
  '반응성 Data',
  '실행 가능성 Data',
  '리스크 Data',
  '판단 유보 Data',
  'Block 0. 고객 Data 판단 프레임',
  'Block 1. 좋은 신호와 주의 신호 구분',
  'Block 2. 판단 유보 Data 확인',
  'Block 3. 우선순위 판단 기준',
  'Block 4. AI 분석 프롬프트 준비',
  'V39CustomerPrioritySelectionPanel',
  '고객별 우선순위 선택',
  '집중',
  '유지',
  '보류',
  '정보 보완',
  '판단 초안 가져오기',
  '선택 완료',
  '고객 판단 선택 초기화',
  'buildCustomerAiAnalysisPrompt',
  'AI 분석 프롬프트 생성',
  '프롬프트 복사',
  '프롬프트 복사 완료',
  '복사해서 사용할 AI 분석 프롬프트',
  '기회 신호',
  '리스크 신호',
  '부족한 정보',
  '다음 확인 질문',
  '2주 실행 방향',
  '컴플라이언스 주의점',
  '안전선 문구를 포함했습니다',
  '실제 고객명',
  '제품명',
  '내부 수치',
]) {
  checkIncludes(files.customerJudgmentWrapper, marker, 'v39 customer judgment wrapper marker');
}

for (const marker of [
  'V39_CUSTOMER_JUDGMENT_RESULT_SCHEMA_VERSION',
  'V39_CUSTOMER_JUDGMENT_RESULT_STORAGE_KEY',
  'ckd.v39.customerJudgment.result.v1',
  'V39CustomerPriorityDecision',
  'V39CustomerDecisionResult',
  'V39CustomerJudgmentResult',
  'createEmptyV39CustomerDecisionResult',
  'createEmptyV39CustomerJudgmentResult',
  'normalizeV39CustomerDecisionResult',
  'normalizeV39CustomerJudgmentResult',
  'saveV39CustomerJudgmentResult',
  'loadV39CustomerJudgmentResult',
  'clearV39CustomerJudgmentResult',
]) {
  checkIncludes(files.customerJudgmentStore, marker, 'v39 customer judgment result store marker');
}

for (const marker of [
  'V39CustomerPriorityLab',
  'V38CustomerPriorityLab',
  'V39CustomerJudgmentBridgePanel',
  'Customer Judgment Bridge',
  '6단계 고객 판단 결과 연결',
  '6단계 판단 새로고침',
  '연결된 판단',
  '7단계 전략 작성 방향',
  '8단계 연결용 우선순위',
  '8단계 연결용 팀원 배정 방향',
  '8단계 연결용 2주 대응 전략',
  '8단계 연결용 주의 리스크',
  '8단계 연결 초안 가져오기',
  '저장된 전략',
  'defaultStrategyPriority',
  'defaultMemberRole',
  'getStrategyGuide',
  'loadBridgeDecisions',
  'loadStrategyState',
  'saveV39CustomerStrategyResult',
  '자동 결정이 아니라',
  '실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다',
]) {
  checkIncludes(files.customerPriorityBridge, marker, 'v39 customer priority bridge marker');
}

for (const marker of [
  'V39_CUSTOMER_STRATEGY_RESULT_SCHEMA_VERSION',
  'V39_CUSTOMER_STRATEGY_RESULT_STORAGE_KEY',
  'ckd.v39.customerStrategy.result.v1',
  'V39CustomerStrategyResultItem',
  'V39CustomerStrategyResult',
  'createEmptyV39CustomerStrategyItem',
  'createEmptyV39CustomerStrategyResult',
  'normalizeV39CustomerStrategyItem',
  'normalizeV39CustomerStrategyResult',
  'saveV39CustomerStrategyResult',
  'loadV39CustomerStrategyResult',
  'clearV39CustomerStrategyResult',
]) {
  checkIncludes(files.customerStrategyStore, marker, 'v39 customer strategy result store marker');
}

for (const marker of [
  'V39MemberRoleLab',
  'V38MemberRoleLab',
  'loadV39DashboardResult',
  'Step 5 → Step 8 Bridge',
  '5단계 저장 결과를 팀원 역할 방향에 연결',
  '5단계 저장 결과 새로고침',
  '선택 유형 신호 요약',
  '최종 다음 행동 준비물',
  '저장 결과 있음',
  '저장 결과 없음',
  'RoleRecommendationDraft',
  'buildRoleRecommendationDrafts',
  'readableMemberLabel',
  '역할 추천 초안',
  '저장 결과 기반 역할 추천 초안',
  '역할 후보',
  '코칭 초점',
  '주의할 점',
  '추천은 자동 배정이 아니라 팀장 판단을 돕는 초안입니다',
  'V39CustomerStrategyBridgePanel',
  'Customer Strategy Bridge',
  '7단계 고객 대응 전략을 팀원 역할 배정에 연결',
  '7단계 전략 결과 새로고침',
  'buildStrategyRoleHints',
  '팀원 역할 배정 참고 초안',
  '9단계 연결용 팀원 역할 배정 저장',
  '9단계 연결 초안 가져오기',
  'saveV39MemberRoleResult',
  'loadMemberRoleSaveState',
]) {
  checkIncludes(files.memberRoleBridge, marker, 'v39 member role bridge marker');
}

for (const marker of [
  'V39_MEMBER_ROLE_RESULT_SCHEMA_VERSION',
  'V39_MEMBER_ROLE_RESULT_STORAGE_KEY',
  'ckd.v39.memberRole.result.v1',
  'V39MemberRoleResultItem',
  'V39MemberRoleResult',
  'createEmptyV39MemberRoleItem',
  'createEmptyV39MemberRoleResult',
  'normalizeV39MemberRoleItem',
  'normalizeV39MemberRoleResult',
  'saveV39MemberRoleResult',
  'loadV39MemberRoleResult',
  'clearV39MemberRoleResult',
]) {
  checkIncludes(files.memberRoleStore, marker, 'v39 member role result store marker');
}

for (const marker of [
  'V39AiCallPlanLab',
  'V38AiCallPlanLab',
  'V39MemberRoleCallPlanBridgePanel',
  'Member Role Bridge',
  '8단계 팀원 역할 배정을 AI Call Plan에 연결',
  '8단계 역할 결과 새로고침',
  '연결 프롬프트 복사',
  '연결 프롬프트 복사 완료',
  'buildCallPlanContextPrompt',
  '복사해서 AI Call Plan 프롬프트에 붙일 연결 맥락',
  'AI Call Plan 프롬프트 맥락화',
  '실제 고객명, 병원명, 의료진명, 제품명, 매출·처방 수치, 개인정보는 포함하지 않습니다',
]) {
  checkIncludes(files.aiCallPlanBridge, marker, 'v39 AI call plan bridge marker');
}

for (const marker of [
  'V39_DASHBOARD_RESULT_SCHEMA_VERSION',
  'V39_DASHBOARD_RESULT_STORAGE_KEY',
  'V39DashboardResult',
  'V39DashboardMetricResult',
  'V39DashboardMetricSelection',
  'V39DashboardMemberResult',
  'createEmptyV39DashboardResult',
  'normalizeV39DashboardResult',
  'saveV39DashboardResult',
  'loadV39DashboardResult',
  'clearV39DashboardResult',
]) {
  checkIncludes(files.store, marker, 'v39 dashboard result store marker');
}

checkNotIncludes(files.html, 'v39 Preview', 'internal v39 preview wording in HTML title');
checkNotIncludes(files.html, 'C1바이오 v39 Preview', 'internal v39 preview title');
checkNotIncludes(files.app, "import './journey-v38-app-preview';", 'old v39 side-effect wrapper import');
checkNotIncludes(files.customerJudgmentWrapper, 'v39 Customer Priority Selection', 'internal v39 customer priority wording');
checkNotIncludes(files.customerJudgmentWrapper, 'v39 Customer Data', 'internal v39 customer data wording');

if (failures.length > 0) {
  console.error('v39 static smoke failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  throw new Error(`v39 static smoke failed: ${failures.length} issue(s)`);
}

console.log('v39 static smoke passed');