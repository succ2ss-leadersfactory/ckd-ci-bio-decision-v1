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
  performanceLab: read('src/journey-v40-vnext-performance-strategy-cascade-lab.tsx'),
  taskLab: read('src/journey-v40-vnext-task-management-lab.tsx'),
  boundaryLab: read('src/journey-v40-vnext-task-boundary-coordination-lab.tsx'),
  peopleSelectionLab: read('src/journey-v40-vnext-people-selection-lab.tsx'),
  oneOnOneLab: read('src/journey-v40-vnext-one-on-one-practice-lab.tsx'),
  finalMemoLab: read('src/journey-v40-vnext-final-execution-memo-lab.tsx'),
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
  '성과관리 1: 시장 변화에서 성과 질문 찾기',
  '성과관리 2: 전사전략과제를 팀 과제·CSF·KPI로 분해하기',
  '성과관리 3: CSF/KPI를 고객 활동 기록 확인 항목으로 바꾸기',
  '성과관리 4: 팀 과제·CSF·KPI별 2주 실행 흐름 정하기',
  'V40VNextPerformanceStrategyCascadeLab',
  'V40VNextPerformanceRecordEvidenceLab',
  'V40VNextPerformanceTwoWeekFlowLab',
  'ckd.v40-vnext.performanceCascade.v1',
  '전사전략과제 → 팀 과제 → CSF → KPI → 고객 활동 기록 → 2주 실행',
  '업무관리 1: 성과 기준을 실행 과제로 바꾸기',
  '업무관리 2: 우선순위와 업무 흐름 정리하기',
  '업무관리 3: 혼자 해결하면 안 되는 일 구분하기',
  '사람관리 1: 먼저 이야기할 팀원 고르기',
  '사람관리 2: 1on1 대화 설계와 실천하기',
  'V39NotebookLmGuidedResearchLab',
  'V40VNextTaskExecutionDesignLab',
  'V40VNextTaskPriorityFlowLab',
  'V40VNextTaskBoundaryCoordinationLab',
  'V40VNextPeopleSelectionLab',
  'V40VNextOneOnOnePracticeLab',
  'V40VNextFinalExecutionMemoLab',
  'V40VNextProgressCoachPanel',
  'ckd.v40-vnext.finalExecutionMemo.v1',
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
  '성과관리 2: 전사전략과제를 팀 과제·CSF·KPI로 분해하기',
  '성과관리 3: CSF/KPI를 고객 활동 기록 확인 항목으로 바꾸기',
  '성과관리 4: 팀 과제·CSF·KPI별 2주 실행 흐름 정하기',
  '업무관리 1: 성과 기준을 실행 과제로 바꾸기',
  '업무관리 2: 우선순위와 업무 흐름 정리하기',
  '업무관리 3: 혼자 해결하면 안 되는 일 구분하기',
  '사람관리 1: 먼저 이야기할 팀원 고르기',
  '사람관리 2: 1on1 첫 문장 준비하기',
  '2주 실행 메모와 복기 질문 완성하기',
  'Perplexity 리서치 질문',
  'NotebookLM 소스 기반 종합 답변',
  'Studio 보고서 초안',
]) mustInclude(files.config, marker, 'v40-vNext config');

for (const marker of [
  'V40VNextPerformanceStrategyCascadeLab',
  '성과관리 2: 전사전략과제를 팀 과제·CSF·KPI로 분해하기',
  '성과관리 3: CSF/KPI를 고객 활동 기록 확인 항목으로 바꾸기',
  '성과관리 4: 팀 과제·CSF·KPI별 2주 실행 흐름 정하기',
  '전사전략과제 → 팀 과제 → CSF → KPI → 고객 활동 기록 → 2주 실행',
  '팀 과제 선택 보기 4개 제시',
  '팀 과제 선택 후 CSF 선택창 활성화',
  '선택한 팀 과제별 CSF 4개 제시',
  'CSF 보기 4개 제시',
  'CSF 선택 후 KPI 선택창 활성화',
  '선택한 CSF별 KPI 4개 제시',
  'KPI 선택 후 AI 확장 요청 활성화',
  'ckd.v40-vnext.performanceCascade.v1',
  '팀 회의 설명 3문장',
  'AI에게 CSF/KPI 후보 확장 요청',
  'AI에게 고객 활동 기록 해석 초안 요청',
  'AI에게 2주 실행 흐름 초안 요청',
  '전사전략과제 선택',
  '우리 조가 선정한 팀 과제',
  '팀 과제 예시 보기',
  'CSF 선택',
  'KPI 선택',
  'AI는 선택을 대신하지 않고, 비교와 보완에만 사용합니다',
  '고객가치 기반 성장 강화',
  '디지털 기반 실행관리 고도화',
  '지속가능한 성장 기반 강화',
  '시장 변화 대응력 강화',
  '후속 행동 포함 기록률',
  '후속 행동 포함 CRM 기록률',
  '승인자료 사용 확인률',
]) mustInclude(files.performanceLab, marker, 'performance cascade lab');

for (const marker of [
  'V40VNextTaskExecutionDesignLab',
  'V40VNextTaskPriorityFlowLab',
  '업무관리 1: 성과 기준을 실행 과제로 바꾸기',
  '업무관리 2: 우선순위와 업무 흐름 정리하기',
  '우리 조가 보기엔 무엇이 빠졌습니까?',
  '전문가 기준 확인',
  '업무 흐름 3단계',
  '막힘 신호',
  '중간 확인 질문',
  '30초 실행 선언문',
  'AI에게 최종 실행 흐름 점검받기',
  'ckd.v40-vnext.taskManagement.v10',
]) mustInclude(files.taskLab, marker, 'v40-vNext task management lab');

for (const marker of [
  'V40VNextTaskBoundaryCoordinationLab',
  '업무관리 3: 혼자 해결하면 안 되는 일 구분하기',
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
  '업무 경계 선언문',
]) mustInclude(files.boundaryLab, marker, 'v40-vNext boundary coordination lab');

for (const marker of [
  'V40VNextPeopleSelectionLab',
  '사람관리 1: 먼저 이야기할 팀원 고르기',
  '관찰한 행동은 말할 수 있지만, 위험한 해석은 확인 없이 말하지 않습니다',
  '팀원별 실행 신호 카드 보기',
  '먼저 이야기할 팀원 1명 선택',
  '관찰한 행동 고르기',
  '위험한 해석 고르기',
  '1on1 대화 초점 1개 선택',
  '선택 이유 1문장 작성',
  'ckd.v40-vnext.peopleManagement.v2',
]) mustInclude(files.peopleSelectionLab, marker, 'v40-vNext people selection lab');

for (const marker of [
  'V40VNextOneOnOnePracticeLab',
  '사람관리 2: 1on1 대화 설계와 실천하기',
  '지적이 아니라 확인으로 시작합니다',
  '선택한 팀원 다시 보기',
  '첫 문장 만들기',
  '확인 질문 2개 만들기',
  'AI 역할극 리허설 1 · 내가 팀장 역할',
  'AI 역할극 리허설 2 · AI가 코칭 팀장 역할',
  '딴지 유형 선택',
  'AI 팀장의 대응에서 배울 점 1가지',
  '우리 조가 최종 적용할 코칭 문장 1개',
  '역할극 후 수정한 첫 문장',
  '역할극 후 수정한 2주 행동 합의',
  'ckd.v40-vnext.peopleManagement.v2',
]) mustInclude(files.oneOnOneLab, marker, 'v40-vNext one-on-one lab');

for (const marker of [
  'V40VNextFinalExecutionMemoLab',
  '13단계 운영 잠금: 성과관리·업무관리·사람관리 최신 결과 → 2주 실행 메모 → 복기 질문',
  'ckd.v40-vnext.performanceCascade.v1',
  'ckd.v40-vnext.taskManagement.v10',
  'ckd.v40-vnext.peopleManagement.v2',
  'ckd.v40-vnext.finalExecutionMemo.v1',
  '전사전략과제',
  '팀 과제·CSF·KPI',
  '팀 회의 설명 3문장',
  '역할극 후 수정한 첫 문장',
  '역할극 후 수정한 2주 행동 합의',
  '우리 조가 최종 적용할 코칭 문장 1개',
  '후속 확인 질문',
  'v40-vNext 최신 결과로 채우기',
]) mustInclude(files.finalMemoLab, marker, 'v40-vNext final memo lab');

for (const marker of [
  'journeyV40VNextPreview',
  'journey-v40-vnext-preview.html',
]) mustInclude(files.vite, marker, 'vite v40-vNext route');

for (const marker of [
  'src/journey-v40-vnext-app-preview.tsx',
  'src/journey-v40-vnext-preview-config.ts',
  'src/journey-v40-vnext-performance-strategy-cascade-lab.tsx',
  'src/journey-v40-vnext-task-management-lab.tsx',
  'src/journey-v40-vnext-task-boundary-coordination-lab.tsx',
  'src/journey-v40-vnext-people-selection-lab.tsx',
  'src/journey-v40-vnext-one-on-one-practice-lab.tsx',
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
