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
  ['customer-judgment', '고객군 판단'],
  ['customer-priority', '집중/후순위 고객군 선택'],
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

const requiredComponentImports = [
  'V38CustomerJudgmentLab',
  'V38CustomerPriorityLab',
  'V38MemberRoleLab',
  'V38AiCallPlanLab',
  'V38ComplianceCleanupLab',
  'V38FinalCallPlanCard',
  'V38InstructorDiscussionLab',
];

for (const componentName of requiredComponentImports) {
  assertIncludes(app, componentName, `v38 app component import/render ${componentName}`);
}

for (const marker of [
  'FEATURE_SUMMARIES',
  '6개 고객군, 먼저 이렇게 읽어보세요',
  '아래 요약은 정답이 아니라 고객군을 읽기 위한 첫 인상입니다.',
  '핵심 특징',
  '강한 신호',
  '주의 신호',
  '판단 질문',
  '반응 상승과 후속 가능성이 뚜렷하게 보이는 고객군입니다.',
  '기회성은 높지만 고객이 아직 결정을 보류하는 고객군입니다.',
  '관계는 안정적이지만 변화 신호는 약한 고객군입니다.',
  '접촉은 많지만 반응이 낮고 피로 신호가 보이는 고객군입니다.',
  '기회 신호가 강하지만 컴플라이언스 안전선 관리가 중요한 고객군입니다.',
  '관계는 있으나 최근 판단 Data가 부족한 고객군입니다.',
  'DataSignalCard',
  'getDataSignal',
  'getGroupedData',
  '기회성 Data',
  '반응성 Data',
  '실행 가능성 Data',
  '리스크 Data',
  '긍정 신호',
  '판단 유보',
  '보완 필요',
  '아래 평가는 정답이 아니라 판단을 돕기 위한 해석 힌트입니다.',
  '우선 검토할 가치가 높은 고객군입니다.',
  '방문 자체보다 이후 반응과 후속 행동 여부가 더 중요합니다.',
  '실행은 가능하지만 표현과 자료 활용 안전선을 먼저 확인해야 합니다.',
  '고객 부담과 접촉 피로를 점검합니다.',
  '분류 전에 기록 정리가 필요합니다.',
]) {
  assertIncludes(customerJudgment, marker, `customer judgment feature summary marker ${marker}`);
}

for (const marker of [
  'DECISION_GUIDES',
  'findCustomerOption',
  'selectedOption',
  'reasonHint',
  '선택 기준 먼저 잡기',
  '선택한 고객군 신호',
  '추천 역할',
  '선택 이유 작성 힌트',
  '고객군을 선택하면 6단계 Data 평가 라벨과 연결된 선택 이유 힌트가 표시됩니다.',
  '집중 고객군으로 볼 때',
  '후순위 고객군으로 볼 때',
  '관찰/유지 고객군으로 볼 때',
  '평가 라벨 조합',
  '긍정 신호가 2개 이상',
]) {
  assertIncludes(customerPriority, marker, `customer priority selected signal marker ${marker}`);
}

for (const marker of [
  'ROLE_GUIDES',
  '7단계 판단을 팀원 역할로 바꾸는 기준',
  '집중 고객군 배정 기준',
  '후순위 고객군 배정 기준',
  '관찰/유지 고객군 배정 기준',
  '고객군 우선순위는 팀원 배정으로 이어질 때 실행력이 생깁니다.',
  '강점:',
  '코칭 초점:',
  '선택한 고객군 배정 힌트',
  '우선순위 성격:',
  '배정 방향:',
  '담당 고객군을 선택하면 7단계 우선순위 판단과 연결된 배정 힌트가 표시됩니다.',
  '이 요약은 9단계 AI 콜플랜 결과물 요청에서 팀원별 실행 역할을 설명하는 기준으로 활용합니다.',
]) {
  assertIncludes(memberRole, marker, `member role connection marker ${marker}`);
}

const requiredFiles = [
  'src/journey-v38-customer-judgment-lab.tsx',
  'src/journey-v38-customer-priority-lab.tsx',
  'src/journey-v38-member-role-lab.tsx',
  'src/journey-v38-ai-call-plan-lab.tsx',
  'src/journey-v38-compliance-cleanup-lab.tsx',
  'src/journey-v38-final-call-plan-card.tsx',
  'src/journey-v38-instructor-discussion-lab.tsx',
  'docs/v38-qa-checklist.md',
];

for (const file of requiredFiles) {
  read(file);
}

console.log('v38 static smoke passed');
