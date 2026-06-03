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
  dashboardWrapper: read('src/journey-v39-dashboard-analysis-lab.tsx'),
  customerJudgmentWrapper: read('src/journey-v39-customer-judgment-lab.tsx'),
  customerJudgmentStore: read('src/journey-v39-customer-judgment-result-store.ts'),
  customerPriorityBridge: read('src/journey-v39-customer-priority-lab.tsx'),
  customerStrategyStore: read('src/journey-v39-customer-strategy-result-store.ts'),
  memberRoleBridge: read('src/journey-v39-member-role-lab.tsx'),
  memberRoleStore: read('src/journey-v39-member-role-result-store.ts'),
  aiCallPlanBridge: read('src/journey-v39-ai-call-plan-lab.tsx'),
  dashboardStore: read('src/journey-v39-dashboard-result-store.ts'),
  viteConfig: read('vite.config.ts'),
  packageJson: read('package.json'),
  tsconfig: read('tsconfig.v39-smoke.json'),
};

for (const [label, source, markers] of [
  ['html', files.html, ['/src/journey-v39-app-preview.tsx', '<title>C1바이오 영업팀장 AI 리더십 Lab Journey</title>']],
  ['app route', files.app, ['V39PreviewApp', 'V39DashboardAnalysisLab', 'V39CustomerJudgmentLab', 'V39CustomerPriorityLab', 'V39MemberRoleLab', 'V39AiCallPlanLab']],
  ['vite', files.viteConfig, ['journeyV39Preview', 'journey-v39-preview.html']],
  ['package', files.packageJson, ['smoke:v39', 'typecheck:v39']],
  ['tsconfig', files.tsconfig, [
    'src/journey-v39-app-preview.tsx',
    'src/journey-v39-dashboard-analysis-lab.tsx',
    'src/journey-v39-customer-judgment-lab.tsx',
    'src/journey-v39-customer-judgment-result-store.ts',
    'src/journey-v39-customer-priority-lab.tsx',
    'src/journey-v39-customer-strategy-result-store.ts',
    'src/journey-v39-member-role-lab.tsx',
    'src/journey-v39-member-role-result-store.ts',
    'src/journey-v39-ai-call-plan-lab.tsx',
    'src/journey-v39-dashboard-result-store.ts',
  ]],
]) {
  for (const marker of markers) checkIncludes(source, marker, label);
}

for (const [label, source, markers] of [
  ['dashboard wrapper', files.dashboardWrapper, ['V39DashboardAnalysisLab', 'V38DashboardAnalysisLab', 'saveV39DashboardResult', 'ckd.v39.dashboardAnalysis.result.v1']],
  ['customer judgment wrapper', files.customerJudgmentWrapper, ['V39CustomerJudgmentLab', 'V38CustomerJudgmentLab', '고객 Data 판단 프레임', '고객별 우선순위 선택', 'AI 분석 프롬프트 생성']],
  ['customer judgment store', files.customerJudgmentStore, ['ckd.v39.customerJudgment.result.v1', 'saveV39CustomerJudgmentResult', 'loadV39CustomerJudgmentResult']],
  ['customer priority bridge', files.customerPriorityBridge, ['V39CustomerPriorityLab', 'V38CustomerPriorityLab', '6단계 고객 판단 결과 연결', '8단계 연결용 2주 대응 전략', 'saveV39CustomerStrategyResult']],
  ['customer strategy store', files.customerStrategyStore, ['ckd.v39.customerStrategy.result.v1', 'saveV39CustomerStrategyResult', 'loadV39CustomerStrategyResult']],
  ['member role bridge', files.memberRoleBridge, ['V39MemberRoleLab', 'V38MemberRoleLab', '7단계 고객 대응 전략을 팀원 역할 배정에 연결', '9단계 연결용 팀원 역할 배정 저장', 'saveV39MemberRoleResult']],
  ['member role store', files.memberRoleStore, ['ckd.v39.memberRole.result.v1', 'saveV39MemberRoleResult', 'loadV39MemberRoleResult']],
  ['AI call plan bridge', files.aiCallPlanBridge, ['V39AiCallPlanLab', 'V38AiCallPlanLab', '8단계 팀원 역할 배정을 AI Call Plan에 연결', 'buildCallPlanContextPrompt']],
  ['dashboard store', files.dashboardStore, ['ckd.v39.dashboardAnalysis.result.v1', 'saveV39DashboardResult', 'loadV39DashboardResult']],
]) {
  for (const marker of markers) checkIncludes(source, marker, label);
}

for (const [label, source, markers] of [
  ['html title', files.html, ['v39 Preview', 'C1바이오 v39 Preview']],
  ['app old side effect', files.app, ["import './journey-v38-app-preview';"]],
  ['customer judgment internal wording', files.customerJudgmentWrapper, ['v39 Customer Priority Selection', 'v39 Customer Data']],
]) {
  for (const marker of markers) checkNotIncludes(source, marker, label);
}

if (failures.length > 0) {
  console.error('v39 static smoke failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  throw new Error(`v39 static smoke failed: ${failures.length} issue(s)`);
}

console.log('v39 static smoke passed');