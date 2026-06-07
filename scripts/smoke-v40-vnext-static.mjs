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
  taskLab: read('src/journey-v40-vnext-task-management-lab.tsx'),
  vite: read('vite.config.ts'),
  tsconfig: read('tsconfig.v40-vnext-smoke.json'),
  journeyHtml: read('journey.html'),
  v39Html: read('journey-v39-preview.html'),
  v39App: read('src/journey-v39-app-preview.tsx'),
  v40LiteHtml: read('journey-v40-lite-preview.html'),
};

for (const marker of [
  '<title>C1바이오 영업팀장 AI 리더십 Lab Journey v40-vNext</title>',
  '<div id="journey-root"></div>',
  '/src/journey-v40-vnext-app-preview.tsx',
  'v40-vNext route only',
]) mustInclude(files.html, marker, 'v40-vNext html');

for (const marker of [
  'V40VNextPreviewApp',
  'v40-vNext 계승형 후속 버전',
  'v39 기준 원본 보호',
  '성과관리 → 업무관리 → 사람관리',
  '조별 실습형',
  '우리 조가 다룰 대표 상황',
  '우리 조가 선택한 기준',
  '우리 조가 준비한 첫 문장',
  '우리 조의 2주 실행 메모 초안',
  '성과관리 1: 시장 변화에서 성과 질문 찾기',
  '성과관리 2: 이번 2주 성과 기준 정하기',
  '성과관리 3: 고객 기록에서 성과 단서 찾기',
  '성과관리 4: 고객군별 2주 성과 흐름 정하기',
  '업무관리 1: 모호한 업무지시 고르기',
  '업무관리 2: 빠진 업무 기준 진단하기',
  '업무관리 3: AI로 업무지시문 초안 만들기',
  '사람관리 1: 먼저 이야기할 팀원 고르기',
  '사람관리 2: 1on1 첫 문장 준비하기',
  'V39NotebookLmGuidedResearchLab',
  'V39DashboardAnalysisUxLab',
  'V39CustomerJudgmentUxLab',
  'V39CustomerPriorityUxLab',
  'V40VNextTaskInstructionSelectLab',
  'V40VNextTaskCriteriaDiagnosisLab',
  'V40VNextTaskAiDraftLab',
  'V39TeamSevenCoachingUxWrapper',
  'V39PeopleDialogueUxLab',
  'V39FinalCallPlanTeamSevenUxCard',
  'V39InstructorDiscussionUxLab',
  'perplexityAnswer',
  'notebookSourceBundle',
  'notebookLmAnswer',
  'issueOne',
  'issueTwo',
  'issueThree',
  'teamImpact',
  'metricBridgeQuestions',
  'studioReportDraft',
  'studioSlideOutline',
  'studioInfographicDraft',
  'strategyMeetingMemo',
  'expectedQuestions',
  'complianceCaution',
  '신재영 대리',
  '이대은 대리',
  '박재욱 사원',
  '유희관 과장',
  '김문호 차장',
  '김재호 차장',
  '문교원 사원',
]) mustInclude(files.app, marker, 'v40-vNext app shell');

for (const marker of [
  '조별 역할 잡기',
  '성과관리 1: 시장 변화에서 성과 질문 찾기',
  '성과관리 2: 이번 2주 성과 기준 정하기',
  '성과관리 3: 고객 기록에서 성과 단서 찾기',
  '성과관리 4: 고객군별 2주 성과 흐름 정하기',
  '업무관리 1: 모호한 업무지시 고르기',
  '업무관리 2: 빠진 업무 기준 진단하기',
  '업무관리 3: AI로 업무지시문 초안 만들기',
  '사람관리 1: 먼저 이야기할 팀원 고르기',
  '사람관리 2: 1on1 첫 문장 준비하기',
  '2주 실행 메모와 복기 질문 완성하기',
  'Perplexity 리서치 질문',
  'NotebookLM 소스 기반 종합 답변',
  'Studio 보고서 초안',
]) mustInclude(files.config, marker, 'v40-vNext config');

for (const marker of [
  'V40VNextTaskInstructionSelectLab',
  'V40VNextTaskCriteriaDiagnosisLab',
  'V40VNextTaskAiDraftLab',
  '업무관리 1: 모호한 업무지시 고르기',
  '업무관리 2: 빠진 업무 기준 진단하기',
  '업무관리 3: AI로 업무지시문 초안 만들기',
  '모호한 업무지시 예시 선택',
  '팀원 예상 반응',
  '빠진 업무 기준 진단',
  'AI에게 업무지시문 초안 부탁하기',
  'AI 답변 붙여넣기',
  'AI 초안 감별',
  '최종 업무지시문',
  '기존 모호한 업무지시',
  '빠진 기준',
  '수정한 업무지시문',
  '완료 기준',
  '중간 확인 질문',
  '팀장이 지원할 부분',
  '배경',
  '목적',
  '범위',
  '우선순위',
  '일정',
  '중간 확인',
  '우리 조가 준비한 업무지시문',
  'ckd.v40-vnext.taskManagement.v2',
]) mustInclude(files.taskLab, marker, 'v40-vNext task management lab');

for (const marker of [
  'journeyV40VNextPreview',
  'journey-v40-vnext-preview.html',
]) mustInclude(files.vite, marker, 'vite input');

for (const marker of [
  'src/journey-v40-vnext-app-preview.tsx',
  'src/journey-v40-vnext-preview-config.ts',
  'src/journey-v40-vnext-task-management-lab.tsx',
  'src/journey-v39-notebooklm-guided-research-lab.tsx',
  'src/journey-v39-team-seven-coaching-profiles.ts',
]) mustInclude(files.tsconfig, marker, 'v40-vNext tsconfig');

for (const marker of [
  '/src/journey-v40-vnext-app-preview.tsx',
  'ckd.v40-vnext.',
  'journey-v40-vnext-preview.html',
]) {
  mustNotInclude(files.journeyHtml, marker, 'operating route pollution');
  mustNotInclude(files.v39Html, marker, 'v39 route pollution');
  mustNotInclude(files.v39App, marker, 'v39 app pollution');
  mustNotInclude(files.v40LiteHtml, marker, 'v40-lite route pollution');
}

if (failures.length > 0) {
  console.error('v40-vNext static smoke failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  throw new Error(`v40-vNext static smoke failed: ${failures.length} issue(s)`);
}

console.log('v40-vNext static smoke passed');
