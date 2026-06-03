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
  memberRoleBridge: read('src/journey-v39-member-role-lab.tsx'),
  store: read('src/journey-v39-dashboard-result-store.ts'),
  viteConfig: read('vite.config.ts'),
  packageJson: read('package.json'),
  tsconfig: read('tsconfig.v39-smoke.json'),
};

checkIncludes(files.html, '/src/journey-v39-app-preview.tsx', 'v39 HTML entry script');
checkIncludes(files.html, '<title>C1바이오 영업팀장 AI 리더십 Lab Journey</title>', 'v39 client-facing HTML title');
checkIncludes(files.app, 'V39PreviewApp', 'v39 preview app component');
checkIncludes(files.app, 'V39DashboardAnalysisLab', 'v39 dashboard wrapper route');
checkIncludes(files.app, 'V39MemberRoleLab', 'v39 member role bridge route');
checkIncludes(files.app, 'ckd.v39.participant.v1', 'v39 participant storage key');
checkIncludes(files.app, 'ckd.v39.progress.v1', 'v39 progress storage key');
checkIncludes(files.viteConfig, 'journeyV39Preview', 'vite v39 input key');
checkIncludes(files.viteConfig, 'journey-v39-preview.html', 'vite v39 HTML input');
checkIncludes(files.packageJson, 'smoke:v39', 'package v39 smoke script');
checkIncludes(files.packageJson, 'typecheck:v39', 'package v39 typecheck script');
checkIncludes(files.tsconfig, 'src/journey-v39-app-preview.tsx', 'v39 tsconfig entry');
checkIncludes(files.tsconfig, 'src/journey-v39-dashboard-analysis-lab.tsx', 'v39 tsconfig dashboard wrapper');
checkIncludes(files.tsconfig, 'src/journey-v39-member-role-lab.tsx', 'v39 tsconfig member role bridge');
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
  'V39MemberRoleLab',
  'V38MemberRoleLab',
  'loadV39DashboardResult',
  'v39 Step 5 → Step 8 Bridge',
  '5단계 저장 결과를 팀원 역할 방향에 연결',
  '5단계 저장 결과 새로고침',
  '선택 유형 신호 요약',
  '최종 다음 행동 준비물',
  '저장 결과 있음',
  '저장 결과 없음',
]) {
  checkIncludes(files.memberRoleBridge, marker, 'v39 member role bridge marker');
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

if (failures.length > 0) {
  console.error('v39 static smoke failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  throw new Error(`v39 static smoke failed: ${failures.length} issue(s)`);
}

console.log('v39 static smoke passed');
