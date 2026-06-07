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
  boundaryLab: read('src/journey-v40-vnext-task-boundary-coordination-lab.tsx'),
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
  '업무관리 1: 성과 기준을 실행 과제로 바꾸기',
  '업무관리 2: 우선순위와 업무 흐름 정리하기',
  '업무관리 3: 혼자 해결하면 안 되는 일 구분하기',
  '사람관리 1: 먼저 이야기할 팀원 고르기',
  '사람관리 2: 1on1 첫 문장 준비하기',
  'V39NotebookLmGuidedResearchLab',
  'V39DashboardAnalysisUxLab',
  'V39CustomerJudgmentUxLab',
  'V39CustomerPriorityUxLab',
  'V40VNextTaskExecutionDesignLab',
  'V40VNextTaskPriorityFlowLab',
  'V40VNextTaskBoundaryCoordinationLab',
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
  '업무관리 1: 성과 기준을 실행 과제로 바꾸기',
  '업무관리 2: 우선순위와 업무 흐름 정리하기',
  '업무관리 3: 혼자 해결하면 안 되는 일 구분하기',
  '실행 과제화',
  '우선순위와 업무 흐름',
  '혼자 해결하면 안 되는 일',
  '사람관리 1: 먼저 이야기할 팀원 고르기',
  '사람관리 2: 1on1 첫 문장 준비하기',
  '2주 실행 메모와 복기 질문 완성하기',
  'Perplexity 리서치 질문',
  'NotebookLM 소스 기반 종합 답변',
  'Studio 보고서 초안',
]) mustInclude(files.config, marker, 'v40-vNext config');

for (const marker of [
  'V40VNextTaskExecutionDesignLab',
  'V40VNextTaskPriorityFlowLab',
  '업무관리 1: 성과 기준을 실행 과제로 바꾸기',
  '업무관리 2: 우선순위와 업무 흐름 정리하기',
  '우리 조가 보기엔 무엇이 빠졌습니까?',
  '전문가 기준 확인',
  '우리 조 선택과 전문가 추천 비교',
  '최종 반영 기준',
  '모범 선택과 이유',
  '9단계 순서 잠금: 업무지시 → 후보 → 먼저 할 일 → 줄일 일 → AI 실습 → 결과 붙여넣기 → 내용 자동 분리',
  '8단계에서 선택한 업무지시',
  '실행해야 하는 업무 후보',
  '먼저 할 일 선택',
  '잠시 줄일 일 선택',
  'AI에게 실행 흐름 초안 부탁하기',
  'AI 초안 전체 붙여넣기',
  '내용 자동 분리',
  'AI 초안에서 항목 나누기',
  '생성 결과 기준으로 업무 흐름 자동 반영',
  'AI 분리 결과를 최종 업무 흐름 칸에도 반영합니다',
  'AI가 제안한 먼저 할 일',
  'AI가 제안한 잠시 줄일 일',
  'AI가 제안한 업무 흐름 3단계',
  'AI가 제안한 막힘 신호',
  'AI가 제안한 중간 확인 질문',
  '최대 2개까지 선택',
  '선택 이유 1문장',
  '업무 흐름 3단계',
  '막힘 신호',
  '중간 확인 질문',
  '30초 실행 선언문',
  'AI에게 최종 실행 흐름 점검받기',
  '최종 점검용 AI 질문 보기',
  'AI 점검 의견 붙여넣기',
  '우리 조가 최종 수정할 부분 1가지',
  'ckd.v40-vnext.taskManagement.v10',
]) mustInclude(files.taskLab, marker, 'v40-vNext task management lab');

for (const marker of [
  'V40VNextTaskBoundaryCoordinationLab',
  '업무관리 3: 혼자 해결하면 안 되는 일 구분하기',
  '10단계 운영 잠금: 9단계 실행 흐름 다시 보기 → 실행 항목 카드 확인 → 네 가지 바구니로 분류 → 위험 이유 선택 → 팀장 개입 타이밍 선택 → AI 조율 문장 → 업무 경계 선언문',
  '9단계 실행 흐름 다시 보기',
  '실행 항목 카드 확인',
  '네 가지 바구니로 분류',
  '팀원이 혼자 처리할 일',
  '팀장 확인이 필요한 일',
  '다른 부서 협조가 필요한 일',
  '상위 리더에게 공유할 일',
  '혼자 처리하면 위험한 이유',
  '팀장 개입 타이밍',
  'AI에게 조율 문장 초안 부탁하기',
  'AI 조율 문장 붙여넣기',
  '우리 조 언어로 수정',
  '업무 경계 선언문',
  '이 일은 혼자 해도 되는가, 아니면 연결해야 하는가?',
]) mustInclude(files.boundaryLab, marker, 'v40-vNext boundary coordination lab');

for (const marker of [
  'journeyV40VNextPreview',
  'journey-v40-vnext-preview.html',
]) mustInclude(files.vite, marker, 'vite input');

for (const marker of [
  'src/journey-v40-vnext-app-preview.tsx',
  'src/journey-v40-vnext-preview-config.ts',
  'src/journey-v40-vnext-task-management-lab.tsx',
  'src/journey-v40-vnext-task-boundary-coordination-lab.tsx',
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
