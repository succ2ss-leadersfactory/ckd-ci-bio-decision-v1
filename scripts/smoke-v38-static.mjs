import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Missing required file: ${relativePath}`);
  }
  return fs.readFileSync(absolutePath, 'utf8');
}

function assertIncludes(source, needle, label) {
  if (!source.includes(needle)) {
    throw new Error(`Missing ${label}: ${needle}`);
  }
}

function assertInOrder(source, needles, label) {
  let previousIndex = -1;
  for (const needle of needles) {
    const currentIndex = source.indexOf(needle);
    if (currentIndex === -1) {
      throw new Error(`Missing ${label}: ${needle}`);
    }
    if (currentIndex <= previousIndex) {
      throw new Error(`Wrong order for ${label}: ${needle}`);
    }
    previousIndex = currentIndex;
  }
}

const html = read('journey-v38-preview.html');
const app = read('src/journey-v38-app-preview.tsx');
const config = read('src/journey-v38-preview-config.ts');
const viteConfig = read('vite.config.ts');
const dashboardAnalysis = read('src/journey-v38-dashboard-analysis-lab.tsx');
const dashboardAnalysisData = read('src/journey-v38-dashboard-analysis-data.ts');
const dashboardAnalysisParsers = read('src/journey-v38-dashboard-analysis-parsers.ts');
const dashboardAnalysisPrompts = read('src/journey-v38-dashboard-analysis-prompts.ts');
const dashboardAnalysisUi = read('src/journey-v38-dashboard-analysis-ui.tsx');
const selectedMemberPrepPanel = read('src/journey-v38-selected-member-prep-panel.tsx');
const dashboardRefactorMap = read('docs/v38-dashboard-analysis-refactor-map.md');
const customerJudgment = read('src/journey-v38-customer-judgment-lab.tsx');
const customerPriority = read('src/journey-v38-customer-priority-lab.tsx');
const memberRole = read('src/journey-v38-member-role-lab.tsx');

assertIncludes(html, '/src/journey-v38-app-preview.tsx', 'v38 HTML entry script');
assertIncludes(viteConfig, 'journeyV38Preview', 'vite v38 input key');
assertIncludes(viteConfig, 'journey-v38-preview.html', 'vite v38 HTML input');

for (const [id, title] of [
  ['entry', '입장·역할 부여'],
  ['ai-safety', 'AI 안전선'],
  ['prompt-practice', '프롬프트 기본 실습'],
  ['research-strategy', '리서치·전략 해석'],
  ['dashboard-analysis', '팀원 실행진단'],
  ['customer-judgment', '고객 Data 분석'],
  ['customer-priority', '고객 유형별 대응 전략'],
  ['member-role', '팀원별 역할 방향'],
  ['ai-call-plan', 'AI 콜플랜 결과물 요청'],
  ['compliance-cleanup', '컴플라이언스 위험 표현 제거'],
  ['final-call-plan-card', '최종 2주 콜플랜 카드'],
  ['instructor-discussion', '강사용 토의 질문'],
]) {
  assertIncludes(config, `id: '${id}'`, `v38 step id ${id}`);
  assertIncludes(config, `title: '${title}'`, `v38 step title ${title}`);
}

for (const componentName of [
  'V38DashboardAnalysisLab',
  'V38CustomerJudgmentLab',
  'V38CustomerPriorityLab',
  'V38MemberRoleLab',
  'V38AiCallPlanLab',
  'V38ComplianceCleanupLab',
  'V38FinalCallPlanCard',
  'V38InstructorDiscussionLab',
]) {
  assertIncludes(app, componentName, `v38 app component ${componentName}`);
}

const expectedMemberOrder = ['김재호 차장', '김문호 차장', '유희관 과장', '이대은 대리', '신재영 대리', '박재욱 사원', '문교원 사원'];
assertInOrder(dashboardAnalysisData, expectedMemberOrder, 'dashboard data member order');

for (const marker of [
  'V38DashboardAnalysisLab',
  'V38_TEAM_MEMBERS as TEAM_MEMBERS',
  'V38_TEAM_SITUATION_OPTIONS as TEAM_SITUATION_OPTIONS',
  'V38_MAX_TEAM_SITUATIONS as MAX_TEAM_SITUATIONS',
  'V38_METRIC_OPTIONS as METRIC_OPTIONS',
  'V38_ACTION_OUTPUT_OPTIONS as ACTION_OUTPUT_OPTIONS',
  'V38_FORBIDDEN_ITEMS as FORBIDDEN_ITEMS',
  'V38_SUGGESTED_DELIVERABLES_BY_MEMBER_ID',
  'buildV38MetricPrompt',
  'buildV38SignalPrompt',
  'buildV38PrepPrompt',
  'V38MetricPicker as MetricPicker',
  'V38ReviewTextarea as ReviewTextarea',
  'V38PrepTextarea as PrepTextarea',
  'V38TeamMemberCard as TeamMemberCard',
  'toggleTeamSituation',
  '상황 선택',
  '우리 팀 상황은 처음부터 선택되어 있지 않습니다',
  '우리 팀에 가장 가까운 상황을 최대 3개까지 선택하세요',
  '1~3개를 선택하세요',
  '최대 3개 선택 후에는 기존 선택을 해제해야 다른 상황을 선택할 수 있습니다',
  'AI 추천 지표 자동 분리·채우기',
  'AI 추천 지표 분리정리',
  '우리 팀 핵심 실행지표 최종 선택',
  '7명 유형 카드 보기와 우리 팀 유사 유형 2명 선택',
  '아래 7명은 교육용 가상 인물입니다',
  '우리 팀에 실제로 존재하거나 비슷한 행동 신호를 보이는 유형 2명',
  'AI 결과 선택 유형 자동 분리·채우기',
  '선택한 유형별 신호 분리 정리',
  '나머지 5명은 전체 맥락을 이해하기 위한 참고 자료로만 사용합니다',
  '팀장 행동 선택',
  'AI 2차 활용: 선택한 준비물 생성',
  'AI 2차 결과 붙여넣기',
  'AI 2차 결과를 선택 유형별로 채우기',
  'AI가 제안한 준비물 초안',
  '최종 결과물: 선택 유형별 다음 행동 준비물',
  'parseAiMetricSuggestion',
  'parseAiSignalResultByMember',
  'parseAiPrepDraftByMember',
  'selectedMemberTypeIds',
  'selectedTeamMembers',
  'autoFillPrepDrafts',
]) {
  assertIncludes(dashboardAnalysis, marker, `dashboard analysis marker ${marker}`);
}

for (const marker of [
  'V38_TEAM_MEMBERS',
  'V38_TEAM_SITUATION_OPTIONS',
  'V38_MAX_TEAM_SITUATIONS',
  'V38_METRIC_OPTIONS',
  'V38_ACTION_OUTPUT_OPTIONS',
  'V38_FORBIDDEN_ITEMS',
  'V38_SUGGESTED_DELIVERABLES_BY_MEMBER_ID',
  'V38_MEMBER_CARD_ORDER',
  '신입·저연차 팀원이 지시를 이해했는지 확인하기 어렵다',
  'MZ세대 팀원과 소통 방식·일의 의미를 두고 갈등이 있다',
  '팀원이 질문하지 않고 혼자 끙끙대거나 이탈 신호를 보인다',
  '신재영 대리',
  '이대은 대리',
  '박재욱 사원',
  '유희관 과장',
  '김문호 차장',
  '김재호 차장',
  '문교원 사원',
  '신입·저연차 조직 적응 중',
  '이탈 위험 점검: 주의',
  '지시 이해 확인 질문',
  '일의 의미와 기대 조율 대화',
]) {
  assertIncludes(dashboardAnalysisData, marker, `dashboard analysis data marker ${marker}`);
}

for (const marker of [
  'V38MemberPrep',
  'V38MetricParseResult',
  'V38SignalParseResult',
  'V38PrepDraftParseResult',
  'createEmptyV38MemberPrep',
  'cleanV38Markdown',
  'parseV38AiMetricSuggestion',
  'parseV38AiSignalResultByMember',
  'parseV38AiPrepDraftByMember',
  '팀원 이름을 자동으로 찾지 못했습니다',
  '선택한 유형 이름을 자동으로 찾지 못했습니다',
]) {
  assertIncludes(dashboardAnalysisParsers, marker, `dashboard analysis parser marker ${marker}`);
}

for (const marker of [
  'V38MetricPromptInput',
  'V38SignalPromptInput',
  'V38PrepPromptInput',
  'buildV38MetricPrompt',
  'buildV38SignalPrompt',
  'buildV38PrepPrompt',
  '우리 팀 상황:',
  '아래 섹션 제목을 반드시 그대로 사용해 주세요',
  '팀원 실행 Data:',
  '선택한 유형별 분리 정리와 팀장 행동 선택:',
  '문제 직원, 동기 부족, 변화 저항처럼 단정하지 마세요',
]) {
  assertIncludes(dashboardAnalysisPrompts, marker, `dashboard analysis prompt marker ${marker}`);
}

for (const marker of [
  'V38MetricPicker',
  'V38ReviewTextarea',
  'V38PrepTextarea',
  'V38TeamMemberCard',
  'type V38TeamMember',
  'member.signals.map',
  '이 유형 선택',
  '선택됨',
  'V38_METRIC_OPTIONS as METRIC_OPTIONS',
  '단정 금지',
  'min-h-24 w-full rounded-2xl border',
]) {
  assertIncludes(dashboardAnalysisUi, marker, `dashboard analysis UI marker ${marker}`);
}

for (const marker of [
  'V38SelectedMemberPrepPanel',
  'type V38MemberPrep',
  'V38PrepTextarea as PrepTextarea',
  '팀원별 관찰 신호',
  '강점으로 볼 수 있는 신호',
  '우려 또는 확인이 필요한 신호',
  '추가로 확인해야 할 질문',
  '성급하게 단정하면 안 되는 점',
]) {
  assertIncludes(selectedMemberPrepPanel, marker, `selected member prep panel marker ${marker}`);
}

for (const marker of [
  'v38 Dashboard Analysis Lab 리팩터링 맵',
  '현재 책임 분리 구조',
  'src/journey-v38-dashboard-analysis-ui.tsx',
  '반복 UI 하위 컴포넌트',
  '수정 원칙',
  '데이터 수정은 data 파일에서만 한다',
  '자동분리 로직 수정은 parsers 파일에서만 한다',
  '프롬프트 문구 수정은 prompts 파일에서만 한다',
  '반복 UI 수정은 ui 파일에서 먼저 검토한다',
  '컴포넌트는 사용자 흐름만 담당한다',
  'data, parsers, prompts, ui 모듈 연결',
  '보호해야 할 사용자 경험 기준',
  '2fdfeafc7a3d902f5d2c589e545261ee274d3cc5',
]) {
  assertIncludes(dashboardRefactorMap, marker, `dashboard refactor map marker ${marker}`);
}

for (const marker of [
  'Customer Data Analysis',
  '고객 Data 분석',
  '고객 유형 A',
  '고객 유형 F',
]) {
  assertIncludes(customerJudgment, marker, `customer data analysis marker ${marker}`);
}

for (const marker of [
  'Customer Type Strategy Lab',
  '고객 유형별 대응 전략',
  'AI 전략 점검 프롬프트 복사',
]) {
  assertIncludes(customerPriority, marker, `customer type strategy marker ${marker}`);
}

for (const marker of [
  'ROLE_GUIDES',
  '신재영 대리',
  '이대은 대리',
  '박재욱 사원',
  '유희관 과장',
  '김문호 차장',
  '김재호 차장',
]) {
  assertIncludes(memberRole, marker, `member role marker ${marker}`);
}

for (const file of [
  'src/journey-v38-dashboard-analysis-lab.tsx',
  'src/journey-v38-dashboard-analysis-data.ts',
  'src/journey-v38-dashboard-analysis-parsers.ts',
  'src/journey-v38-dashboard-analysis-prompts.ts',
  'src/journey-v38-dashboard-analysis-ui.tsx',
  'src/journey-v38-selected-member-prep-panel.tsx',
  'src/journey-v38-customer-judgment-lab.tsx',
  'src/journey-v38-customer-priority-lab.tsx',
  'src/journey-v38-member-role-lab.tsx',
  'src/journey-v38-ai-call-plan-lab.tsx',
  'src/journey-v38-compliance-cleanup-lab.tsx',
  'src/journey-v38-final-call-plan-card.tsx',
  'src/journey-v38-instructor-discussion-lab.tsx',
  'docs/v38-qa-checklist.md',
  'docs/v38-dashboard-analysis-refactor-map.md',
]) {
  read(file);
}

console.log('v38 static smoke passed');
