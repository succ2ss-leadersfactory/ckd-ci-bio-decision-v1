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
  promptReviewLab: read('src/journey-v40-vnext-prompt-practice-review-lab.tsx'),
  researchTrimmedLab: read('src/journey-v40-vnext-research-strategy-trimmed-lab.tsx'),
  pharmaResearchLab: read('src/journey-v40-vnext-pharma-strategy-research-lab.tsx'),
  progressCoach: read('src/journey-v40-vnext-progress-coach-panel.tsx'),
  compactPerformanceLab: read('src/journey-v40-vnext-performance-compact-cascade-lab.tsx'),
  enhancedPerformanceLabV2: read('src/journey-v40-vnext-performance-enhanced-cascade-lab-v2.tsx'),
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
]) mustInclude(files.html, marker, 'v40-vNext html');

for (const marker of [
  'V40VNextPreviewApp',
  'V40VNextPromptPracticeReviewLab',
  'V40VNextResearchStrategyTrimmedLab',
  'V40VNextPerformanceCompactCascadeLab',
  'V40VNextTaskExecutionBridgeLab',
  'V40VNextFlowStrip',
  'V40VNextProgressCoachPanel',
]) mustInclude(files.app, marker, 'v40-vNext app shell');

mustNotInclude(files.app, 'V39NotebookLmGuidedResearchLab', 'legacy notebook wrapper import/use in v40 app');

for (const marker of [
  'V40VNextResearchStrategyTrimmedLab',
  'V40VNextPharmaStrategyResearchLab',
  '2026년 제약업계 전략 과제 선택',
  '영업팀 추진계획 수립 실습',
  'Perplexity 최신자료 검색 전용 프롬프트',
  'Perplexity 전략 과제 프롬프트',
  '전략 제안이나 실행계획을 만들지 말고',
  'URL이 없는 자료는 제외',
  'Perplexity 출처 URL만 분리',
  'NotebookLM 웹 소스 URL 복사',
  '분리된 웹 소스 URL',
  'NotebookLM 소스 기반 전략 과제 압축',
  'NotebookLM 프롬프트 복사',
  'NotebookLM 분석 질문 복사',
  'NotebookLM 결과 항목별로 정리하기',
  'parseNotebookAnswer',
  'NOTEBOOK_SECTION_ALIASES',
  'LM Studio 보고서 생성 요청',
  'LM Studio 슬라이드 생성 요청',
  'LM Studio 인포그래픽 생성 요청',
  '업로드한 소스와 3단계 정리 결과를 근거로',
  '산출물 형식만 지시',
  'ckd.v40-vnext.pharmaStrategyResearch.v1',
]) mustInclude(files.researchTrimmedLab, marker, 'v40-vNext research bridge lab');

for (const marker of [
  'V40VNextPharmaStrategyResearchLab',
  '2026년 제약업계 전략 과제 선택',
  '영업팀 추진계획 수립 실습',
  'Perplexity 최신자료 검색 전용 프롬프트',
  'Perplexity 전략 과제 프롬프트',
  '전략 제안이나 실행계획을 만들지 말고',
  'URL이 없는 자료는 제외',
  'Perplexity 출처 URL만 분리',
  'NotebookLM 웹 소스 URL 복사',
  '분리된 웹 소스 URL',
  'NotebookLM 소스 기반 전략 과제 압축',
  'NotebookLM 프롬프트 복사',
  'NotebookLM 분석 질문 복사',
  'NotebookLM 결과 항목별로 정리하기',
  'parseNotebookAnswer',
  'NOTEBOOK_SECTION_ALIASES',
  'LM Studio 보고서 생성 요청',
  'LM Studio 슬라이드 생성 요청',
  'LM Studio 인포그래픽 생성 요청',
  '업로드한 소스와 3단계 정리 결과를 근거로',
  '산출물 형식만 지시',
  'ckd.v40-vnext.pharmaStrategyResearch.v1',
]) mustInclude(files.pharmaResearchLab, marker, 'v40-vNext pharma strategy research lab');

for (const marker of [
  'NotebookLM 소스 등록하기',
  'NotebookLM 소스 제목 복사',
  'NotebookLM 소스 본문 복사',
  'NotebookLM 소스 TXT 다운로드',
  'NotebookLM 소스 묶음 복사',
  'NotebookLM 소스 묶음 생성',
  'NotebookLM 소스 묶음 검토·수정',
]) mustNotInclude(files.pharmaResearchLab, marker, 'removed duplicate NotebookLM source section');

for (const marker of [
  'V40VNextPromptPracticeReviewLab',
  '일반적인 질문만 복사하기',
  '정리된 프롬프트 복사하기',
  '구체성',
  '맥락 반영',
  '실행 가능성',
  '리더의 언어',
  '사실 검증 가능성',
]) mustInclude(files.promptReviewLab, marker, 'v40-vNext prompt review lab');

for (const marker of [
  'V40VNextFlowStrip',
  '전체 흐름',
  '성과관리 1',
  '업무관리 1',
  '사람관리 1',
  '최종 실행 메모',
]) mustInclude(files.ux, marker, 'v40-vNext UX components');

for (const marker of [
  'V40VNextProgressCoachPanel',
  '팀장 역할 진행 코치',
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
]) mustInclude(files.enhancedPerformanceLabV2, marker, 'enhanced performance cascade UX V2');

for (const marker of [
  'V40VNextPerformanceCompactCascadeLab',
  'V40VNextPerformanceEnhancedCascadeLabV2',
]) mustInclude(files.compactPerformanceLab, marker, 'compact performance bridge lab');

for (const marker of [
  '팀장 역할 시작하기',
  '역할과 팀원 구성 이해하기',
  '말해도 되는 선 확인',
  '성과관리 1: 시장 변화에서 성과 질문 찾기',
  '성과관리 2: 전사전략과제를 팀 전략과제·CSF·KPI로 분해하기',
]) mustInclude(files.config, marker, 'v40-vNext config');

for (const marker of [
  'src/journey-v40-vnext-app-preview.tsx',
  'src/journey-v40-vnext-research-strategy-trimmed-lab.tsx',
  'src/journey-v40-vnext-pharma-strategy-research-lab.tsx',
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
