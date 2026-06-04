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
  '우리 팀에서 지금 무엇을 봐야 하나?',
  '이번 2주, 우리 팀이 실제로 볼 것만 추립니다',
  '이번 2주에 꼭 볼 지표',
  '함께 봐야 할 현장 신호',
  '조심해서 봐야 할 해석',
  '팀장이 더 확인할 질문',
  '저장된 Lite 판단 초안',
  '하나의 답을 고르는 화면이 아닙니다',
]) mustInclude(files.app, marker, 'v40-lite app');

for (const marker of [
  'ckd.v40-lite.participant.v1',
  'ckd.v40-lite.progress.v1',
  'ckd.v40-lite.step5.metrics.v1',
  'V40LiteStep5Metrics',
]) mustInclude(files.store, marker, 'v40-lite store');

for (const marker of [
  'journeyV40LitePreview',
  'journey-v40-lite-preview.html',
]) mustInclude(files.vite, marker, 'vite input');

for (const marker of [
  'src/journey-v40-lite-app-preview.tsx',
  'src/journey-v40-lite-store.ts',
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
