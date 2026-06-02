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

const html = read('journey-v38-preview.html');
const app = read('src/journey-v38-app-preview.tsx');
const config = read('src/journey-v38-preview-config.ts');
const viteConfig = read('vite.config.ts');
const dashboardAnalysis = read('src/journey-v38-dashboard-analysis-lab.tsx');
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

for (const marker of [
  'V38DashboardAnalysisLab',
  'MetricParseResult',
  'parseAiMetricSuggestion',
  'parseNotice',
  'AI 추천 지표 자동 분리·채우기',
  '자동 분리·채우기는 초안입니다',
  '자동 채우기 후에도 각 입력칸에서 자유롭게 수정할 수 있습니다',
  'AI 추천 확인 질문',
  '우리 팀 지표로 다음 행동 준비하기',
  '우리 팀 지표 정하기',
  'AI 지표 추천 프롬프트 복사',
  'AI 추천 지표 붙여넣기',
  'AI 추천 지표 분리정리',
  'AI 추천 핵심 지표 후보',
  'AI 추천 보완 지표 후보',
  'AI 추천 안전선 지표 후보',
  '우리 팀에 맞는 지표',
  '제외할 지표',
  '추가하고 싶은 지표',
  '우리 팀 핵심 실행지표 최종 선택',
  'AI 추천 지표 분리정리와 기본 안전 지표를 참고',
  '핵심 지표 3개',
  '보완 지표 2개',
  '안전선 지표 1개',
  '지표 선택 이유',
  '선택한 우리 팀 실행지표 기준으로 6명 Data 보기',
  '계획 접점 실행률',
  '고객 인게이지먼트 지수',
  '후속 대화 연결지수',
  'CRM 기록 품질',
  '팀 학습 기여도',
  '컴플라이언스 위험 점검',
  'AI 입력 안전 점검',
  'AI로 6명 Data에서 보이는 신호 정리',
  'AI 결과 붙여넣기',
  '팀원별 신호 분리 정리',
  '팀장 행동 선택',
  'AI 2차 활용: 선택한 준비물 생성',
  '팀원별 다음 행동 준비물',
  'AI 신호 정리 프롬프트 복사',
  'AI 준비물 생성 프롬프트 복사',
  '팀원별 관찰 신호',
  '강점으로 볼 수 있는 신호',
  '우려 또는 확인이 필요한 신호',
  '추가로 확인해야 할 질문',
  '성급하게 단정하면 안 되는 점',
  '1on1 면담 질문',
  '이번 주 코칭 포인트',
  '실행 점검 기준',
  '강점 활용 역할 제안',
  '우려 신호 확인 질문',
  '팀 회의 공유용 학습 포인트',
  '컴플라이언스 안전선 점검 문장',
  '후속 대화 연결 코칭 질문',
  '방문 후 기록 점검표',
  '고객 질문 연습 스크립트',
  '통제 가능한 실행 변수 찾기 질문',
  '작은 실행 약속 카드',
  '신재영 대리',
  '이대은 대리',
  '박재욱 사원',
  '유희관 과장',
  '김문호 차장',
  '김재호 차장',
]) {
  assertIncludes(dashboardAnalysis, marker, `dashboard analysis marker ${marker}`);
}

for (const marker of [
  'Customer Data Analysis',
  '고객 Data 분석',
  '고객 유형 A',
  '고객 유형 F',
  '교육용 가상 고객 묶음',
  'Data 해석 도우미',
  '핵심 기회 신호',
  '핵심 우려 신호',
  '추가 확인 정보',
  '1차 판단 메모',
  '보완 필요',
]) {
  assertIncludes(customerJudgment, marker, `customer data analysis marker ${marker}`);
}

for (const marker of [
  'Customer Type Strategy Lab',
  '고객 유형별 대응 전략',
  '전략 설계 기준',
  '적극 집중',
  '조건부 집중',
  '속도 조절',
  '관찰/유지',
  '정보 보완',
  '접근 강도 축소',
  '고객 유형별 전략 설계',
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
  '7단계 판단을 팀원 역할로 바꾸는 기준',
  '선택한 고객군 배정 힌트',
]) {
  assertIncludes(memberRole, marker, `member role marker ${marker}`);
}

for (const file of [
  'src/journey-v38-dashboard-analysis-lab.tsx',
  'src/journey-v38-customer-judgment-lab.tsx',
  'src/journey-v38-customer-priority-lab.tsx',
  'src/journey-v38-member-role-lab.tsx',
  'src/journey-v38-ai-call-plan-lab.tsx',
  'src/journey-v38-compliance-cleanup-lab.tsx',
  'src/journey-v38-final-call-plan-card.tsx',
  'src/journey-v38-instructor-discussion-lab.tsx',
  'docs/v38-qa-checklist.md',
]) {
  read(file);
}

console.log('v38 static smoke passed');
