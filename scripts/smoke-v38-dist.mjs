import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, normalize } from 'node:path';

const failures = [];

function fail(message) {
  failures.push(message);
}

function readText(file) {
  if (!existsSync(file)) {
    fail(`Missing required dist file: ${file}`);
    return '';
  }
  return readFileSync(file, 'utf8');
}

function listFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  });
}

function extractModuleScriptPaths(html) {
  const matches = [...html.matchAll(/<script\b[^>]*type=["']module["'][^>]*src=["']([^"']+\.js)["'][^>]*>/gs)];
  return matches.map((match) => normalize(join('dist', match[1].replace(/^\//, ''))));
}

const distHtml = readText('dist/journey-v38-preview.html');

if (!distHtml.includes('journey-root')) {
  fail('dist/journey-v38-preview.html must include #journey-root.');
}

if (!distHtml.includes('<title>C1바이오 v38 Preview</title>')) {
  fail('dist/journey-v38-preview.html must include the v38 title.');
}

const v38ScriptPaths = extractModuleScriptPaths(distHtml);
if (v38ScriptPaths.length === 0) {
  fail('dist/journey-v38-preview.html must include a bundled module script.');
}

const distFiles = listFiles('dist');
const assetFiles = distFiles.filter((file) => file.includes('assets'));

if (assetFiles.length === 0) {
  fail('dist/assets must include bundled assets.');
}

const v38BundledJs = v38ScriptPaths.map((file) => readText(file)).join('\n');

for (const text of [
  'C1바이오 영업팀장 AI 리더십 Lab Journey v38',
  '입장·역할 부여',
  'AI 안전선',
  '프롬프트 기본 실습',
  '리서치·전략 해석',
  '팀원 실행진단',
  '고객군 판단',
  '집중/후순위 고객군 선택',
  '팀원별 역할 방향',
  'AI 콜플랜 결과물 요청',
  '컴플라이언스 위험 표현 제거',
  '최종 2주 콜플랜 카드',
  '강사용 토의 질문',
  'v38 진행 초기화',
  '전체 13개 Data 다시 보기',
  '긍정 신호',
  '판단 유보',
  '주의 신호',
  '보완 필요',
  '아래 평가는 정답이 아니라 판단을 돕기 위한 해석 힌트입니다.',
  '선택 기준 먼저 잡기',
  '집중 고객군으로 볼 때',
  '후순위 고객군으로 볼 때',
  '관찰/유지 고객군으로 볼 때',
  '평가 라벨 조합',
  '긍정 신호가 2개 이상',
]) {
  if (!v38BundledJs.includes(text)) {
    fail(`v38 entry bundle must include ${text}.`);
  }
}

for (const forbidden of ['MutationObserver', 'querySelectorAll', 'innerHTML']) {
  if (v38BundledJs.includes(forbidden)) {
    fail(`v38 entry bundle must not include DOM post-processing marker: ${forbidden}.`);
  }
}

const journeyHtml = readText('dist/journey.html');
if (journeyHtml.includes('journey-v38-app-preview')) {
  fail('dist/journey.html must not load the v38 preview entry.');
}

const v36Html = readText('dist/journey-v36-preview.html');
if (v36Html.includes('journey-v38-app-preview')) {
  fail('dist/journey-v36-preview.html must not load the v38 preview entry.');
}

if (failures.length > 0) {
  console.error('v38 dist smoke failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('v38 dist smoke passed.');
