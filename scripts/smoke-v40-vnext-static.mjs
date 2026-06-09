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
  shell: read('src/journey-shell.tsx'),
  app: read('src/journey-v40-vnext-app-preview.tsx'),
  config: read('src/journey-v40-vnext-preview-config.ts'),
  ux: read('src/journey-v40-vnext-ux-components.tsx'),
  promptReviewLab: read('src/journey-v40-vnext-prompt-practice-review-lab.tsx'),
  researchTrimmedLab: read('src/journey-v40-vnext-research-strategy-trimmed-lab.tsx'),
  pharmaResearchLab: read('src/journey-v40-vnext-pharma-strategy-research-lab.tsx'),
  pharmaResearchData: read('src/journey-v40-vnext-pharma-research-data.ts'),
  pharmaResearchPrompts: read('src/journey-v40-vnext-pharma-research-prompts.ts'),
  pharmaResearchParser: read('src/journey-v40-vnext-pharma-research-parser.ts'),
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

for (const marker of [
  'isV40VNextEntryBlocked',
  'ckd.v40-vnext.participant.v1',
  '먼저 팀과 이름/닉네임을 입력해 주세요',
  '팀과 이름/닉네임을 입력하면 다음으로 넘어갈 수 있습니다.',
  'AI 리더십 실습',
  '입력 내용 저장',
]) mustInclude(files.shell, marker, 'v40-vNext entry gate and shell copy');

mustNotInclude(files.app, 'V39NotebookLmGuidedResearchLab', 'legacy notebook wrapper import/use in v40 app');

for (const marker of [
  'V40VNextResearchStrategyTrimmedLab',
  'V40VNextPharmaStrategyResearchLab',
  'return <V40VNextPharmaStrategyResearchLab />',
]) mustInclude(files.researchTrimmedLab, marker, 'v40-vNext research bridge lab');

for (const marker of [
  'V40VNextPharmaStrategyResearchLab',
  'journey-v40-vnext-pharma-research-data',
  'journey-v40-vnext-pharma-research-prompts',
  'journey-v40-vnext-pharma-research-parser',
  '2026년 제약업계 전략 과제 선택',
  'Perplexity 최신자료 검색 프롬프트 복사',
  'Perplexity 자료 목록 결과 붙여넣기',
  'NotebookLM 웹 소스 URL 복사',
  '분리된 웹 소스 URL',
  'NotebookLM 소스 기반 전략 과제 압축',
  'NotebookLM 프롬프트 복사',
  'NotebookLM 결과 붙여넣기',
  'NotebookLM 결과 항목별로 정리하기',
  'LM Studio 보고서 생성 요청',
  'LM Studio 슬라이드 생성 요청',
  'LM Studio 인포그래픽 생성 요청',
  'URL 추출 1회 계산',
  '핸들러 useCallback 안정화',
  '토픽 데이터 분리',
  '프롬프트 생성 분리',
  'NotebookLM 파서 분리',
]) mustInclude(files.pharmaResearchLab, marker, 'v40-vNext pharma strategy research lab UI');

for (const marker of [
  'PHARMA_STRATEGY_RESEARCH_STORAGE_KEY',
  'ckd.v40-vnext.pharmaStrategyResearch.v1',
  'PHARMA_RESEARCH_TOPICS',
  'DEFAULT_PHARMA_RESEARCH_STATE',
  'AI 기반 영업·마케팅 실행관리 고도화',
  '디지털 채널·환자 여정 기반 고객 접점 혁신',
  'pharmaTopicOf',
  'pharmaTitleOf',
]) mustInclude(files.pharmaResearchData, marker, 'v40-vNext pharma research data module');

for (const marker of [
  'buildPerplexityPrompt',
  'buildNotebookAnalysisPrompt',
  'buildStudioPrompt',
  '전략 제안이나 실행계획을 만들지 말고',
  'URL이 없는 자료는 제외',
  '업로드한 소스만 근거로 분석해 주세요',
  '업로드한 소스와 3단계 정리 결과를 근거로',
  '산출물 형식만 지시받은 대로 작성',
  'LM Studio ${kind} 생성 요청',
  '8장짜리 발표용 슬라이드 구성안',
  '1페이지 인포그래픽 구성안',
]) mustInclude(files.pharmaResearchPrompts, marker, 'v40-vNext pharma research prompt module');

for (const marker of [
  'extractUrls',
  'buildWebSourceUrlText',
  'NOTEBOOK_SECTION_ALIASES',
  'normalizeHeading',
  'detectNotebookSection',
  'parseNotebookAnswer',
  '영업팀 추진 과제 1',
  '2주 실행관리 질문',
  'KPI 후보',
  '주의해야 할 표현',
]) mustInclude(files.pharmaResearchParser, marker, 'v40-vNext pharma research parser module');

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
  '파일럿 11단계 전체 흐름',
  '12단계 최종 실행 메모 숨김',
  '전체 흐름',
  '성과관리 1',
  '업무관리 1',
  '사람관리 1',
  '사람관리 2',
]) mustInclude(files.ux, marker, 'v40-vNext UX components');

mustNotInclude(files.ux, '2주 실행 메모와 복기 질문 완성하기', 'hidden final memo step in v40 flow strip');

for (const marker of [
  'V40VNextProgressCoachPanel',
  '팀장 역할 진행 코치',
  'v40-vNext 파일럿 11단계 기준',
  '12단계 최종 실행 메모 숨김',
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
  '파일럿 11단계 운영',
  '12단계 최종 실행 메모 숨김',
  '팀장 역할 시작하기',
  '우리 팀과 팀원 살펴보기',
  '입력 기준 확인하기',
  'AI 질문 다시 쓰기',
  '성과관리 1: 시장 변화에서 우리 팀 질문 찾기',
  '성과관리 2: 전사전략을 우리 팀 실행 기준으로 바꾸기',
  '업무관리 1: 성과 기준을 실행할 일로 바꾸기',
  '업무관리 2: 먼저 할 일과 잠시 줄일 일 정하기',
  '업무관리 3: 혼자 처리하면 안 되는 일 나누기',
]) mustInclude(files.config, marker, 'v40-vNext config');

mustNotInclude(files.config, "id: 'final-call-plan-card'", 'hidden final memo step in v40 config');

for (const marker of [
  'src/journey-v40-vnext-app-preview.tsx',
  'src/journey-v40-vnext-research-strategy-trimmed-lab.tsx',
  'src/journey-v40-vnext-pharma-strategy-research-lab.tsx',
  'src/journey-v40-vnext-pharma-research-data.ts',
  'src/journey-v40-vnext-pharma-research-prompts.ts',
  'src/journey-v40-vnext-pharma-research-parser.ts',
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
