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
  html: read('journey-v41-preview.html'),
  app: read('src/journey-v41-app-preview.tsx'),
  config: read('src/journey-v41-preview-config.ts'),
  ux: read('src/journey-v41-ux-components.tsx'),
  progressCoach: read('src/journey-v41-progress-coach-panel.tsx'),
  storageScope: read('src/journey-v41-lab-storage-scope.tsx'),
  tsconfig: read('tsconfig.v41-smoke.json'),
  packageJson: read('package.json'),
  pilotEntry: read('ckd-ai-lab.html'),
  v40Html: read('journey-v40-vnext-preview.html'),
};

for (const marker of [
  '<title>C1바이오 영업팀장 AI 리더십 Lab Journey v41 Preview</title>',
  '<div id="journey-root"></div>',
  '/src/journey-v41-app-preview.tsx',
  'v41 isolated preview route',
  'pilot URLs preserved',
]) mustInclude(files.html, marker, 'v41 html');

for (const marker of [
  'V41PreviewApp',
  'journey-v41-preview.html',
  'v41 isolated app shell',
  'v41 entry step simplified',
  'v41 team name gate',
  '먼저 팀과 이름만 입력하세요',
  '팀과 이름/닉네임을 입력하면 다음 단계로 이동할 수 있습니다.',
  'isParticipantReady',
  'showV41EntryGateMessage',
  'v40-vNext parity scaffold with v41 core',
  'V41_VISIBLE_APP_STEPS',
  'V41FlowStrip',
  'V41ProgressCoachPanel',
  'V41LabStorageScope',
  'ckd.v41.participant.v1',
  'ckd.v41.progress.v1',
  'ckd.v41.promptPracticeReview.v2',
  'ckd.v41.pharmaStrategyResearch.v1',
  'ckd.v41.performanceCascade.v1',
  'ckd.v41.taskManagement.v10',
  'ckd.v41.peopleManagement.v2',
  'existing pilot URLs preserved',
]) mustInclude(files.app, marker, 'v41 preview app');

for (const marker of [
  "import './journey-v40-vnext-app-preview'",
  'V39MiniFlow',
  'V39MinimumChecklist',
  'ckd.v40-vnext.participant.v1',
  'ckd.v40-vnext.progress.v1',
]) mustNotInclude(files.app, marker, 'removed v40 whole-app, old entry blocks, or shell storage dependency in v41 app');

for (const marker of [
  'V41LabStorageScope',
  'V41_STORAGE_SCOPE_KEYS',
  'v41 inherited lab storage isolation',
  'ckd.v40-vnext.promptPracticeReview.v2',
  'ckd.v41.promptPracticeReview.v2',
  'ckd.v40-vnext.pharmaStrategyResearch.v1',
  'ckd.v41.pharmaStrategyResearch.v1',
  'ckd.v40-vnext.performanceCascade.v1',
  'ckd.v41.performanceCascade.v1',
  'ckd.v40-vnext.taskManagement.v10',
  'ckd.v41.taskManagement.v10',
  'ckd.v40-vnext.peopleManagement.v2',
  'ckd.v41.peopleManagement.v2',
]) mustInclude(files.storageScope, marker, 'v41 lab storage scope');

for (const marker of [
  'V41_VISIBLE_APP_STEPS',
  'clampV41Step',
  'v41 field-friendly step labels',
  '시작하기',
  '팀원 보기',
  'AI 입력 기준',
  '질문 다듬기',
  '시장 변화 읽기',
  '팀 기준 만들기',
  '업무지시 만들기',
  '할 일·줄일 일',
  '업무 경계 나누기',
  '1on1 대상 고르기',
  '1on1 첫 문장',
  '파일럿 11단계 운영 계승',
  '12단계 최종 실행 메모 숨김 유지',
]) mustInclude(files.config, marker, 'v41 config');

for (const marker of [
  'V41FlowStrip',
  'V41StepNavigationProvider',
  'v41 field-friendly flow chips',
  '흐름',
  '시작',
  '팀원 보기',
  'AI 기준',
  '질문 다듬기',
  '시장 읽기',
  '팀 기준',
  '업무지시',
  '할 일·줄일 일',
  '업무 경계',
  '1on1 대상',
  '첫 문장',
  'ckd.v41.participant.v1',
  'v41 파일럿 11단계 전체 흐름',
]) mustInclude(files.ux, marker, 'v41 ux components');

for (const marker of [
  '팀장 역할 시작하기',
  '역할과 팀원 구성 이해하기',
  '성과관리 1: 시장 변화에서 성과 질문 찾기',
  '성과관리 2: 전략과제·CSF·KPI 분해',
  '업무관리 1: 성과 기준을 실행 과제로 바꾸기',
  '업무관리 2: 우선순위와 업무 흐름 정리하기',
  '사람관리 2: 1on1 대화 설계와 실천하기',
]) mustNotInclude(files.ux, marker, 'old long flow chip labels');

for (const marker of [
  'V41ProgressCoachPanel',
  '지금 할 일',
  '현재 단계에서 하나만 확인하세요',
  'v41 progress coach copy refined',
  '진행 정보',
  '이번 단계 산출물',
  'ckd.v41.participant.v1',
  'v41 파일럿 11단계 기준',
]) mustInclude(files.progressCoach, marker, 'v41 progress coach panel');

for (const marker of [
  '팀장 역할 진행 코치',
  '이 영역에서는 여러분의 진행 상태와 영역별 이동만 확인합니다',
  '팀장 역할 진행 상태',
]) mustNotInclude(files.progressCoach, marker, 'old progress coach copy');

for (const marker of [
  'src/journey-v41-app-preview.tsx',
  'src/journey-v41-preview-config.ts',
  'src/journey-v41-ux-components.tsx',
  'src/journey-v41-progress-coach-panel.tsx',
  'src/journey-v41-lab-storage-scope.tsx',
  'src/journey-v40-vnext-app-preview.tsx',
]) mustInclude(files.tsconfig, marker, 'v41 tsconfig');

for (const marker of [
  'typecheck:v41',
  'smoke:v41:static',
  'smoke:v41',
]) mustInclude(files.packageJson, marker, 'v41 package scripts');

for (const marker of [
  'journey-v41-preview.html',
  'journey-v41-app-preview.tsx',
  'v41 isolated preview route',
]) {
  mustNotInclude(files.pilotEntry, marker, 'existing pilot entry route');
  mustNotInclude(files.v40Html, marker, 'existing v40 preview route');
}

for (const marker of [
  'journey-v40-vnext-preview.html',
  '/src/journey-v40-vnext-app-preview.tsx',
]) mustInclude(files.v40Html, marker, 'existing v40 preview route remains intact');

if (failures.length > 0) {
  console.error('v41 static smoke failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('v41 static smoke passed.');
