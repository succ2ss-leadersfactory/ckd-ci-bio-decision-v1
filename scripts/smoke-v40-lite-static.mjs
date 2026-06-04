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
  html: read('journey-v40-lite-preview.html'),
  app: read('src/journey-v40-lite-app-preview.tsx'),
  store: read('src/journey-v40-lite-store.ts'),
  aiWorkflow: read('src/journey-v40-lite-ai-workflow.tsx'),
  vite: read('vite.config.ts'),
  tsconfig: read('tsconfig.v40-lite-smoke.json'),
  journeyHtml: read('journey.html'),
  v39Html: read('journey-v39-preview.html'),
};

for (const marker of [
  '<title>C1바이오 영업팀장 AI 리더십 Lab Journey Lite</title>',
  '<div id="journey-root"></div>',
  '/src/journey-v40-lite-app-preview.tsx',
]) mustInclude(files.html, marker, 'v40-lite html');

for (const marker of [
  'V40LitePreviewApp',
  'V40_LITE_STEPS',
  'V40LiteAiWorkflow',
  'v39의 흐름은 유지하되 교육장에서 바로 실습할 수 있게 줄인 화면입니다',
  '우리 팀에서 지금 무엇을 봐야 하나?',
  '이번 2주, 우리 팀이 실제로 볼 것만 추립니다',
  '활동은 늘었는데, 실행이 이어지는지는 아직 불분명합니다',
  '먼저 볼 관점 선택',
  '이번 2주 실행진단의 초점을 하나 고릅니다',
  '후속 실행으로 이어지는지 보기',
  '이번 2주에 꼭 볼 지표',
  '함께 봐야 할 현장 신호',
  '성급하게 보면 안 되는 해석',
  '6단계로 넘길 판단 기준',
  '팀장이 더 확인할 질문',
  '5단계 저장 요약 · 6단계로 넘길 내용',
  '고객 반응에서 무엇을 읽을까?',
  '의미 있어 보이는 고객 반응',
  '아직 부족한 정보',
  '조심해서 읽어야 할 부분',
  '고객 반응을 더 정확히 보기 위한 질문',
  '저장된 고객 반응 읽기 초안',
]) mustInclude(files.app, marker, 'v40-lite app');

for (const marker of [
  'V40LiteAiWorkflow',
  'separateV40LiteAiResult',
  'AI 질문 복사',
  'AI가 준 내용을 여기에 붙여넣기',
  '현장에서 쓸 만한 제안',
  '조심할 표현',
  '더 확인할 질문',
  'AI 내용 한 줄 정리',
  '팀장 최종 문장',
]) mustInclude(files.aiWorkflow, marker, 'v40-lite AI workflow');

for (const marker of [
  'ckd.v40-lite.participant.v1',
  'ckd.v40-lite.progress.v1',
  'ckd.v40-lite.step5.metrics.v1',
  'ckd.v40-lite.step6.customerReaction.v1',
  'V40LiteStep5Metrics',
  'V40LiteStep6CustomerReaction',
  'selectedFocus',
  'step6Handoff',
  'aiDraft',
]) mustInclude(files.store, marker, 'v40-lite store');

for (const marker of [
  'journeyV40LitePreview',
  'journey-v40-lite-preview.html',
]) mustInclude(files.vite, marker, 'vite input');

for (const marker of [
  'src/journey-v40-lite-app-preview.tsx',
  'src/journey-v40-lite-store.ts',
  'src/journey-v40-lite-ai-workflow.tsx',
  'src/journey-shell.tsx',
  'src/journey-storage.ts',
]) mustInclude(files.tsconfig, marker, 'v40-lite tsconfig');

for (const marker of [
  '/src/journey-v40-lite-app-preview.tsx',
  'ckd.v40-lite.',
]) {
  mustNotInclude(files.journeyHtml, marker, 'operating route pollution');
  mustNotInclude(files.v39Html, marker, 'v39 route pollution');
}

for (const marker of [
  '점수',
  '평가',
  '등급',
  '정답',
]) mustNotInclude(files.app, marker, 'v40-lite prohibited wording');

if (failures.length > 0) {
  console.error('v40-lite static smoke failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  throw new Error(`v40-lite static smoke failed: ${failures.length} issue(s)`);
}

console.log('v40-lite static smoke passed');
