import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

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

const distHtml = readText('dist/journey-v36-preview.html');

if (!distHtml.includes('journey-root')) {
  fail('dist/journey-v36-preview.html must include #journey-root.');
}

if (!distHtml.includes('<title>C1바이오 영업팀장 AI 리더십 Lab Journey</title>')) {
  fail('dist/journey-v36-preview.html must include the customer-facing title.');
}

if (/Preview|preview|v35|v36|검증|QA/.test(distHtml)) {
  fail('dist/journey-v36-preview.html must not expose demo/debug wording in the page shell.');
}

if (!/<script\b[^>]*type=["']module["'][^>]*src=["'][^"']+\.js["'][^>]*>/s.test(distHtml)) {
  fail('dist/journey-v36-preview.html must include a bundled module script.');
}

const distFiles = listFiles('dist');
const assetFiles = distFiles.filter((file) => file.includes('assets'));

if (assetFiles.length === 0) {
  fail('dist/assets must include bundled assets.');
}

const bundledJs = assetFiles.filter((file) => file.endsWith('.js')).map((file) => readText(file)).join('\n');

for (const text of [
  'C1바이오 영업팀장 AI 리더십 Lab Journey',
  'Journey Smoke Marker',
  '고객군 판단',
  'AI 답변 붙여넣기',
  '컴플라이언스 위험 표현 제거',
  '최종 산출물: 2주 콜플랜',
  'ckd-v36-lab-customer-call-plan',
]) {
  if (!bundledJs.includes(text)) {
    fail(`v36 dist bundle must include ${text}.`);
  }
}

for (const forbidden of ['v36 Preview Smoke', 'QA 정보 보기']) {
  if (bundledJs.includes(forbidden)) {
    fail(`v36 dist bundle must not include ${forbidden}.`);
  }
}

const journeyHtml = readText('dist/journey.html');
if (journeyHtml.includes('journey-v36-app-preview')) {
  fail('dist/journey.html must not load the v36 preview entry.');
}

const v35Html = readText('dist/journey-v35-preview.html');
if (v35Html.includes('journey-v36-app-preview')) {
  fail('dist/journey-v35-preview.html must not load the v36 preview entry.');
}

if (failures.length > 0) {
  console.error('v36 dist smoke failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('v36 dist smoke passed.');
