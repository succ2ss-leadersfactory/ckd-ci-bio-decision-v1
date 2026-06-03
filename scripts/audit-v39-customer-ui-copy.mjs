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

const dashboard = read('src/journey-v39-dashboard-analysis-lab.tsx');

for (const marker of [
  'v39 Dashboard Result Bridge',
  '저장 Key',
  'V39_DASHBOARD_RESULT_STORAGE_KEY',
  'ckd.v39.dashboardAnalysis.result.v1',
  'localStorage',
  'v39 5단계 핵심 결과 수동 저장 패널',
  'v39 저장 구조 초기화 테스트',
  'v39 저장 구조 비우기',
]) {
  mustNotInclude(dashboard, marker, 'dashboard copy');
}

for (const marker of [
  '팀 실행진단 메모',
  '다음 단계에서 팀원 역할 배정 참고자료로 활용됩니다',
  '입력 내용 저장',
  '저장 내용 비우기',
  '실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다',
]) {
  mustInclude(dashboard, marker, 'dashboard copy');
}

if (failures.length > 0) {
  console.error('v39 customer UI copy audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  throw new Error(`v39 customer UI copy audit failed: ${failures.length} issue(s)`);
}

console.log('v39 customer UI copy audit passed');
