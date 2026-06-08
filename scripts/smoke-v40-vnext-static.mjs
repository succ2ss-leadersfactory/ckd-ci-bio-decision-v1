import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];

function read(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    failures.push(`Missing required file: ${relativePath}`);
    return '';
  }
  return fs.readFileSync(fullPath, 'utf8');
}

function mustInclude(source, marker, label) {
  if (!source.includes(marker)) failures.push(`Missing ${label}: ${marker}`);
}

function mustNotInclude(source, marker, label) {
  if (source.includes(marker)) failures.push(`Unexpected ${label}: ${marker}`);
}

const files = {
  html: read('journey-v40-vnext-preview.html'),
  app: read('src/journey-v40-vnext-app-preview.tsx'),
  config: read('src/journey-v40-vnext-preview-config.ts'),
  ux: read('src/journey-v40-vnext-ux-components.tsx'),
  shell: read('src/journey-v40-vnext-shell.tsx'),
  progressCoach: read('src/journey-v40-vnext-progress-coach-panel.tsx'),
  compactPerformanceLab: read('src/journey-v40-vnext-performance-compact-cascade-lab.tsx'),
  enhancedPerformanceLabV2: read('src/journey-v40-vnext-performance-enhanced-cascade-lab-v2.tsx'),
  finalMemoLab: read('src/journey-v40-vnext-final-execution-memo-lab.tsx'),
  tsconfig: read('tsconfig.v40-vnext-smoke.json'),
  journeyHtml: read('journey.html'),
  v39Html: read('journey-v39-preview.html'),
  v39App: read('src/journey-v39-app-preview.tsx'),
  v40LiteHtml: read('journey-v40-lite-preview.html'),
};

for (const marker of [
  '<title>C1바이오 영업팀장 AI 리더십 Lab Journey</title>',
  '<div id="journey-root"></div>',
  '/src/journey-v40-vnext-app-preview.tsx',
  'v40-vNext route only',
  '역할과 팀원 구성 이해하기',
  '여러분은 오늘 C1바이오 영업팀장입니다',
  '여러분',
]) mustInclude(files.html, marker, 'v40-vNext html');

for (const marker of [
  'V40VNextPreviewApp',
  'V40VNextFlowStrip',
  'V40VNextProgressCoachPanel',
  '역할과 팀원 구성 이해하기',
  '여러분은 오늘 C1바이오 영업팀장입니다',
  '팀 선택 1팀~8팀',
  '이름/닉네임 입력',
  '성과관리 → 업무관리 → 사람관리',
  '성과관리 1: 시장 변화에서 성과 질문 찾기',
  '성과관리 2: 전사전략과제를 팀 전략과제·CSF·KPI로 분해하기',
  '업무관리 1: 성과 기준을 실행 과제로 바꾸기',
  '업무관리 2: 우선순위와 업무 흐름 정리하기',
  '업무관리 3: 혼자 해결하면 안 되는 일 구분하기',
  '사람관리 1: 먼저 이야기할 팀원 고르기',
  '사람관리 2: 1on1 대화 설계와 실천하기',
  'ckd.v40-vnext.performanceCascade.v1',
  'ckd.v40-vnext.finalExecutionMemo.v1',
]) mustInclude(files.app, marker, 'v40-vNext app shell');

for (const marker of [
  'V40VNextFlowStrip',
  'v40-vNext 12단계 전용 흐름',
  '팀장 역할 시작',
  '역할·팀원 이해',
  '말해도 되는 선',
  '성과관리 1',
  '성과관리 2',
  '업무관리 1',
  '업무관리 2',
  '업무관리 3',
  '사람관리 1',
  '사람관리 2',
  '최종 실행 메모',
]) mustInclude(files.ux, marker, 'v40-vNext UX components');

for (const marker of [
  'V40VNextProgressCoachPanel',
  '팀장 역할 진행 코치',
  'v40-vNext 12단계 기준',
  '팀장 역할 진행 상태',
  '팀',
  '이름/닉네임',
]) mustInclude(files.progressCoach, marker, 'v40-vNext progress coach');

for (const marker of [
  'V40VNextPerformanceEnhancedCascadeLabV2',
  '전사전략과제 초기 선택 없음',
  '팀 전략과제 선택 보기 4개 제시',
  'CSF 보기 4개 제시',
  '선택한 CSF별 KPI 후보 4개',
  'AI 답변 항목별로 정리하기',
]) mustInclude(files.enhancedPerformanceLabV2, marker, 'enhanced performance cascade UX V2');

for (const marker of [
  'V40VNextPerformanceCompactCascadeLab',
  'V40VNextPerformanceEnhancedCascadeLabV2',
  '우리 조의 2주 성과관리 기준 정리',
]) mustInclude(files.compactPerformanceLab, marker, 'compact performance bridge lab');

for (const marker of [
  '팀장 역할 시작하기',
  '역할과 팀원 구성 이해하기',
  '말해도 되는 선 확인',
  '성과관리 1: 시장 변화에서 성과 질문 찾기',
  '성과관리 2: 전사전략과제를 팀 전략과제·CSF·KPI로 분해하기',
  '업무관리 1: 성과 기준을 실행 과제로 바꾸기',
  '업무관리 2: 우선순위와 업무 흐름 정리하기',
  '업무관리 3: 혼자 해결하면 안 되는 일 구분하기',
  '사람관리 1: 먼저 이야기할 팀원 고르기',
  '2주 실행 메모와 복기 질문 완성하기',
]) mustInclude(files.config, marker, 'v40-vNext config');

for (const marker of [
  'src/journey-v40-vnext-app-preview.tsx',
  'src/journey-v40-vnext-preview-config.ts',
  'src/journey-v40-vnext-ux-components.tsx',
  'src/journey-v40-vnext-progress-coach-panel.tsx',
  'src/journey-v40-vnext-performance-enhanced-cascade-lab-v2.tsx',
  'src/journey-v40-vnext-performance-compact-cascade-lab.tsx',
  'src/journey-v40-vnext-final-execution-memo-lab.tsx',
]) mustInclude(files.tsconfig, marker, 'v40-vNext tsconfig');

for (const marker of ['journey-v40-vnext-app-preview.tsx', 'v40-vNext route only']) {
  mustNotInclude(files.journeyHtml, marker, 'operating journey route');
  mustNotInclude(files.v39Html, marker, 'v39 preview route');
  mustNotInclude(files.v39App, marker, 'v39 app');
  mustNotInclude(files.v40LiteHtml, marker, 'v40-lite route');
}

if (failures.length > 0) {
  console.error('v40-vNext static smoke failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('v40-vNext static smoke passed.');
