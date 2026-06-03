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

function mustNotInclude(source, marker, label) {
  if (source.includes(marker)) failures.push(`Unexpected customer-facing ${label}: ${marker}`);
}

function mustInclude(source, marker, label) {
  if (!source.includes(marker)) failures.push(`Missing customer-facing ${label}: ${marker}`);
}

const dashboardWrapper = read('src/journey-v39-dashboard-analysis-lab.tsx');
const dashboardCore = read('src/journey-v38-dashboard-analysis-lab.tsx');

for (const marker of [
  'v39 Dashboard Result Bridge',
  '저장 Key',
  'V39_DASHBOARD_RESULT_STORAGE_KEY',
  'ckd.v39.dashboardAnalysis.result.v1',
  'localStorage',
  'v39 5단계 핵심 결과 수동 저장 패널',
  'v39 저장 구조 초기화 테스트',
  'v39 저장 구조 비우기',
  '팀 실행진단 메모',
  'Team Execution Memo',
  '입력 내용 저장',
  '저장 내용 비우기',
]) {
  mustNotInclude(dashboardWrapper, marker, 'dashboard wrapper copy');
}

for (const marker of [
  'V38DashboardAnalysisLab heroVariant="customer"',
]) {
  mustInclude(dashboardWrapper, marker, 'dashboard wrapper connection');
}

for (const marker of [
  'heroVariant?: DashboardHeroVariant',
  'heroVariant === \'customer\'',
  '5단계 팀 실행진단',
  '우리 팀 지표로 다음 행동 준비하기',
  '안내',
  'CustomerProgressItem',
  '모든 항목을 순서대로 완료하면 우리 팀만의 실행 계획이 완성됩니다',
]) {
  mustInclude(dashboardCore, marker, 'dashboard customer hero copy');
}

for (const marker of [
  'v39 Dashboard Result Bridge',
  '저장 Key',
]) {
  mustNotInclude(dashboardCore, marker, 'dashboard customer hero copy');
}

if (failures.length > 0) {
  console.error('v39 customer UI copy audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  throw new Error(`v39 customer UI copy audit failed: ${failures.length} issue(s)`);
}

console.log('v39 customer UI copy audit passed');
