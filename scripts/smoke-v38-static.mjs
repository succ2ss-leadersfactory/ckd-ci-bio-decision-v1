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
const customerJudgment = read('src/journey-v38-customer-judgment-lab.tsx');
const customerPriority = read('src/journey-v38-customer-priority-lab.tsx');
const memberRole = read('src/journey-v38-member-role-lab.tsx');

assertIncludes(html, '/src/journey-v38-app-preview.tsx', 'v38 HTML entry script');
assertIncludes(viteConfig, 'journeyV38Preview', 'vite v38 input key');
assertIncludes(viteConfig, 'journey-v38-preview.html', 'vite v38 HTML input');

const requiredSteps = [
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
];

for (const [id, title] of requiredSteps) {
  assertIncludes(config, `id: '${id}'`, `v38 step id ${id}`);
  assertIncludes(config, `title: '${title}'`, `v38 step title ${title}`);
}

for (const componentName of [
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
  'Customer Data Analysis',
  '고객 Data 분석',
  '고객 유형 A',
  '고객 유형 F',
  '교육용 가상 고객 묶음',
  '전체 고객 유형 한눈에 보기',
  '고객 유형 A~F, 먼저 이렇게 읽어보세요',
  'Data 해석 도우미',
  '핵심 기회 신호',
  '핵심 우려 신호',
  '추가 확인 정보',
  '1차 판단 메모',
  '도우미 문장 가져오기',
  'DataSignalCard',
  'getDataSignal',
  '기회성 Data',
  '리스크 Data',
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
  '2주 대응 전략',
  '팀원 배정 방향',
  '주의할 리스크',
  '6개 고객 유형 대응 전략 요약',
  'AI로 고객 유형별 대응 전략 점검',
  'AI는 고객 유형별 대응 전략의 정답을 정하지 않습니다.',
  '복사용 AI 전략 점검 프롬프트',
  'AI 전략 점검 프롬프트 복사',
  '전체 전략 포트폴리오 균형 점검',
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
