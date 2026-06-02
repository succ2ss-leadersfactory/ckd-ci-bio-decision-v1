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

function checkInOrder(source, needles, label) {
  let previousIndex = -1;
  for (const needle of needles) {
    const currentIndex = source.indexOf(needle);
    if (currentIndex === -1) {
      failures.push(`Missing ${label}: ${needle}`);
      continue;
    }
    if (currentIndex <= previousIndex) failures.push(`Wrong order for ${label}: ${needle}`);
    previousIndex = currentIndex;
  }
}

function checkMany(source, label, markers) {
  for (const marker of markers) checkIncludes(source, marker, label);
}

const files = {
  html: read('journey-v38-preview.html'),
  app: read('src/journey-v38-app-preview.tsx'),
  config: read('src/journey-v38-preview-config.ts'),
  viteConfig: read('vite.config.ts'),
  dashboardAnalysis: read('src/journey-v38-dashboard-analysis-lab.tsx'),
  dashboardAnalysisData: read('src/journey-v38-dashboard-analysis-data.ts'),
  dashboardAnalysisParsers: read('src/journey-v38-dashboard-analysis-parsers.ts'),
  dashboardAnalysisPrompts: read('src/journey-v38-dashboard-analysis-prompts.ts'),
  dashboardAnalysisUi: read('src/journey-v38-dashboard-analysis-ui.tsx'),
  selectedMemberPrepPanel: read('src/journey-v38-selected-member-prep-panel.tsx'),
  actionDeliverablePicker: read('src/journey-v38-action-deliverable-picker.tsx'),
  finalMemberPrepCard: read('src/journey-v38-final-member-prep-card.tsx'),
  dashboardRefactorMap: read('docs/v38-dashboard-analysis-refactor-map.md'),
  qaChecklist: read('docs/v38-qa-checklist.md'),
  screenQaGuide: read('docs/v38-screen-qa-guide.md'),
  screenQaResult: read('docs/v38-screen-qa-result.md'),
  functionalQaSamples: read('docs/v38-functional-qa-test-samples.md'),
  finalReadinessSummary: read('docs/v38-final-readiness-summary.md'),
  customerJudgment: read('src/journey-v38-customer-judgment-lab.tsx'),
  customerPriority: read('src/journey-v38-customer-priority-lab.tsx'),
  memberRole: read('src/journey-v38-member-role-lab.tsx'),
  aiCallPlan: read('src/journey-v38-ai-call-plan-lab.tsx'),
  complianceCleanup: read('src/journey-v38-compliance-cleanup-lab.tsx'),
  finalCallPlanCard: read('src/journey-v38-final-call-plan-card.tsx'),
  instructorDiscussion: read('src/journey-v38-instructor-discussion-lab.tsx'),
};

checkIncludes(files.html, '/src/journey-v38-app-preview.tsx', 'v38 HTML entry script');
checkIncludes(files.viteConfig, 'journeyV38Preview', 'vite v38 input key');
checkIncludes(files.viteConfig, 'journey-v38-preview.html', 'vite v38 HTML input');

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
  checkIncludes(files.config, `id: '${id}'`, `v38 step id ${id}`);
  checkIncludes(files.config, `title: '${title}'`, `v38 step title ${title}`);
}

checkMany(files.app, 'v38 app component', [
  'V38DashboardAnalysisLab',
  'V38CustomerJudgmentLab',
  'V38CustomerPriorityLab',
  'V38MemberRoleLab',
  'V38AiCallPlanLab',
  'V38ComplianceCleanupLab',
  'V38FinalCallPlanCard',
  'V38InstructorDiscussionLab',
]);

checkInOrder(
  files.dashboardAnalysisData,
  ['김재호 차장', '김문호 차장', '유희관 과장', '이대은 대리', '신재영 대리', '박재욱 사원', '문교원 사원'],
  'dashboard data member order',
);

checkMany(files.dashboardAnalysis, 'dashboard analysis marker', [
  'V38DashboardAnalysisLab',
  'V38_TEAM_MEMBERS as TEAM_MEMBERS',
  'V38_TEAM_SITUATION_OPTIONS as TEAM_SITUATION_OPTIONS',
  'V38_MAX_TEAM_SITUATIONS as MAX_TEAM_SITUATIONS',
  'V38_METRIC_OPTIONS as METRIC_OPTIONS',
  'buildV38MetricPrompt',
  'buildV38SignalPrompt',
  'buildV38PrepPrompt',
  'TeamMemberCard',
  'SelectedMemberPrepPanel',
  'ActionDeliverablePicker',
  'FinalMemberPrepCard',
  '우리 팀 상황은 처음부터 선택되어 있지 않습니다',
  '우리 팀에 가장 가까운 상황을 최대 3개까지 선택하세요',
  'AI 추천 지표 자동 분리·채우기',
  'AI 추천 지표 분리정리',
  '우리 팀 핵심 실행지표 최종 선택',
  '7명 유형 카드 보기와 우리 팀 유사 유형 2명 선택',
  'AI 결과 선택 유형 자동 분리·채우기',
  '선택한 유형별 신호 분리 정리',
  '나머지 5명은 전체 맥락을 이해하기 위한 참고 자료로만 사용합니다',
  '팀장 행동 선택',
  'AI 2차 활용: 선택한 준비물 생성',
  'AI 2차 결과를 선택 유형별로 채우기',
  '최종 결과물: 선택 유형별 다음 행동 준비물',
  'parseAiMetricSuggestion',
  'parseAiSignalResultByMember',
  'parseAiPrepDraftByMember',
  'selectedMemberTypeIds',
  'selectedTeamMembers',
  'autoFillPrepDrafts',
]);

checkMany(files.dashboardAnalysisData, 'dashboard analysis data marker', [
  'V38_TEAM_MEMBERS',
  'V38_TEAM_SITUATION_OPTIONS',
  'V38_MAX_TEAM_SITUATIONS',
  'V38_METRIC_OPTIONS',
  'V38_ACTION_OUTPUT_OPTIONS',
  'V38_FORBIDDEN_ITEMS',
  'V38_SUGGESTED_DELIVERABLES_BY_MEMBER_ID',
  '신입·저연차 팀원이 지시를 이해했는지 확인하기 어렵다',
  'MZ세대 팀원과 소통 방식·일의 의미를 두고 갈등이 있다',
  '팀원이 질문하지 않고 혼자 끙끙대거나 이탈 신호를 보인다',
  '신입·저연차 조직 적응 중',
  '이탈 위험 점검: 주의',
  '지시 이해 확인 질문',
  '일의 의미와 기대 조율 대화',
]);

checkMany(files.dashboardAnalysisParsers, 'dashboard analysis parser marker', [
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
]);

checkMany(files.dashboardAnalysisPrompts, 'dashboard analysis prompt marker', [
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
]);

checkMany(files.dashboardAnalysisUi, 'dashboard analysis UI marker', [
  'V38MetricPicker',
  'V38ReviewTextarea',
  'V38PrepTextarea',
  'V38TeamMemberCard',
  'member.signals.map',
  '이 유형 선택',
  '선택됨',
  '단정 금지',
]);

checkMany(files.selectedMemberPrepPanel, 'selected member prep panel marker', [
  'V38SelectedMemberPrepPanel',
  'V38PrepTextarea as PrepTextarea',
  '팀원별 관찰 신호',
  '강점으로 볼 수 있는 신호',
  '우려 또는 확인이 필요한 신호',
  '추가로 확인해야 할 질문',
  '성급하게 단정하면 안 되는 점',
]);

checkMany(files.actionDeliverablePicker, 'action deliverable picker marker', [
  'V38ActionDeliverablePicker',
  'V38_ACTION_OUTPUT_OPTIONS as ACTION_OUTPUT_OPTIONS',
  'V38_SUGGESTED_DELIVERABLES_BY_MEMBER_ID',
  '추천 준비물 선택',
  'onToggleDeliverable',
  'ACTION_OUTPUT_OPTIONS.map',
]);

checkMany(files.finalMemberPrepCard, 'final member prep card marker', [
  'V38FinalMemberPrepCard',
  'V38FinalPrepField',
  'AI가 제안한 준비물 초안',
  '최종 유형별 다음 행동 준비물',
  'onUpdate',
  'finalPrep',
]);

checkMany(files.dashboardRefactorMap, 'dashboard refactor map marker', [
  'v38 Dashboard Analysis Lab 리팩터링 맵',
  '현재 책임 분리 구조',
  'src/journey-v38-dashboard-analysis-ui.tsx',
  'src/journey-v38-selected-member-prep-panel.tsx',
  'src/journey-v38-action-deliverable-picker.tsx',
  'src/journey-v38-final-member-prep-card.tsx',
  '공통 반복 UI 하위 컴포넌트',
  '공통 UI 수정은 해당 UI 컴포넌트 파일에서 먼저 검토한다',
  'V38FinalMemberPrepCard',
  'data, parsers, prompts, UI 컴포넌트 모듈 연결',
  '보호해야 할 사용자 경험 기준',
]);

checkMany(files.screenQaGuide, 'screen QA guide marker', [
  'v38 화면 QA 가이드',
  '5분 빠른 정상성 확인',
  '5단계 핵심 흐름 QA',
  'AI 자동분리 3종',
  '문교원 사원 카드가 표시되지 않는다',
  '고객사 시연 또는 파일럿용으로 사용 가능하다',
]);

checkMany(files.screenQaResult, 'screen QA result marker', [
  'v38 화면 QA 결과 기록지',
  'QA 기본 정보',
  '빠른 정상성 확인',
  '5단계 팀원 실행진단 QA',
  'AI 추천 지표 자동분리',
  'AI 신호 정리 자동분리',
  'AI 2차 준비물 자동 채우기',
  '발견 이슈 기록',
  '최종 판정',
]);

checkMany(files.functionalQaSamples, 'functional QA sample marker', [
  'v38 기능 클릭 QA 테스트 샘플',
  'AI 추천 지표 자동 분리·채우기',
  'AI 결과 선택 유형 자동 분리·채우기',
  'AI 2차 결과를 선택 유형별로 채우기',
  '박재욱 사원',
  '문교원 사원',
  '빠른 판정 기준',
  'docs/v38-screen-qa-result.md',
]);

checkMany(files.finalReadinessSummary, 'final readiness summary marker', [
  'v38 Final Readiness Summary',
  '현재 결론',
  '완료된 핵심 개발 범위',
  '완료된 리팩터링 범위',
  '완료된 보호 기준',
  '고객사 시연 전 남은 작업',
  '최종 판정 문장',
]);

checkMany(files.customerJudgment, 'customer data analysis marker', ['v38 Customer Data Analysis', '고객 Data 분석', '고객 유형 A', '고객 유형 F']);
checkMany(files.customerPriority, 'customer type strategy marker', ['v38 Customer Type Strategy Lab', '고객 유형별 대응 전략', 'AI 전략 점검 프롬프트 복사']);
checkMany(files.memberRole, 'member role marker', ['ROLE_GUIDES', '신재영 대리', '이대은 대리', '박재욱 사원', '유희관 과장', '김문호 차장', '김재호 차장']);
checkIncludes(files.qaChecklist, 'v38 QA Checklist', 'v38 QA checklist title');

if (failures.length > 0) {
  console.error('v38 static smoke failed with missing markers:');
  for (const failure of failures) console.error(`- ${failure}`);
  throw new Error(`v38 static smoke failed: ${failures.length} issue(s)`);
}

console.log('v38 static smoke passed');
