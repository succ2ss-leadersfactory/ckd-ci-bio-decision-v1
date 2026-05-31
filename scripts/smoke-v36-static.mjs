import { existsSync, readFileSync } from 'node:fs';

const failures = [];
const cache = new Map();

const requiredFiles = [
  'journey.html',
  'journey-v35-preview.html',
  'journey-v36-preview.html',
  'package.json',
  'tsconfig.v36-smoke.json',
  'vite.config.ts',
  'src/journey-active.tsx',
  'src/full-flow-journey-v34.tsx',
  'src/full-flow-journey-v35.tsx',
  'src/journey-v36-app-preview.tsx',
  'src/full-flow-journey-v36-preview.tsx',
  'src/journey-v36-customer-call-plan-lab.tsx',
  'src/journey-v36-preview-config.ts',
];

const requiredStepIds = [
  'entry',
  'ai-safety',
  'prompt-practice',
  'research-strategy',
  'source-check',
  'dashboard-analysis',
  'customer-judgment',
  'action-map',
  'hq-translation',
  'stakeholder-message',
  'performance-dialogue',
  'one-on-one-coaching',
  'wrap-up',
];

const requiredStorageKeys = [
  'ckd-v36-participant',
  'ckd-v36-progress',
  'ckd-v36-responses',
  'ckd-v36-lab-customer-call-plan',
  'ckd-v36-wrap-up',
];

function fail(message) {
  failures.push(message);
}

function readText(file) {
  if (cache.has(file)) return cache.get(file);
  if (!existsSync(file)) {
    fail(`Missing required file: ${file}`);
    cache.set(file, '');
    return '';
  }
  const content = readFileSync(file, 'utf8');
  cache.set(file, content);
  return content;
}

function readJson(file) {
  const content = readText(file);
  try {
    return JSON.parse(content);
  } catch (error) {
    fail(`${file} must be valid JSON. ${error instanceof Error ? error.message : String(error)}`);
    return {};
  }
}

function stripComments(content) {
  return content.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

function readCode(file) {
  return stripComments(readText(file));
}

function mustMatch(file, pattern, message, code = true) {
  const content = code ? readCode(file) : readText(file);
  if (!pattern.test(content)) fail(message);
}

function mustNotMatch(file, pattern, message, code = true) {
  const content = code ? readCode(file) : readText(file);
  if (pattern.test(content)) fail(message);
}

for (const file of requiredFiles) readText(file);

const scripts = readJson('package.json').scripts ?? {};
if (scripts['typecheck:v36'] !== 'tsc -p tsconfig.v36-smoke.json --noEmit') {
  fail('package.json typecheck:v36 must run tsc -p tsconfig.v36-smoke.json --noEmit.');
}
if (scripts['smoke:v36:static'] !== 'node scripts/smoke-v36-static.mjs') {
  fail('package.json smoke:v36:static must run node scripts/smoke-v36-static.mjs.');
}
const smoke = scripts['smoke:v36'] ?? '';
for (const command of ['npm run smoke:v36:static', 'npm run typecheck:v36', 'npm run build']) {
  if (!smoke.includes(command)) fail(`package.json smoke:v36 must include ${command}.`);
}

const include = readJson('tsconfig.v36-smoke.json').include ?? [];
for (const file of [
  'src/vite-env.d.ts',
  'src/journey-v36-app-preview.tsx',
  'src/full-flow-journey-v36-preview.tsx',
  'src/journey-v36-customer-call-plan-lab.tsx',
  'src/journey-v36-preview-config.ts',
  'src/journey-shell.tsx',
  'src/journey-storage.ts',
]) {
  if (!include.includes(file)) fail(`tsconfig.v36-smoke.json must include ${file}.`);
}

mustMatch('journey.html', /<script\b(?=[^>]*\btype=["']module["'])(?=[^>]*\bsrc=["']\/src\/journey-active\.tsx["'])[^>]*>/s, 'journey.html must keep loading /src/journey-active.tsx as module.', false);
mustMatch('journey-v35-preview.html', /<script\b(?=[^>]*\btype=["']module["'])(?=[^>]*\bsrc=["']\/src\/journey-v35-app-preview\.tsx["'])[^>]*>/s, 'journey-v35-preview.html must keep loading /src/journey-v35-app-preview.tsx as module.', false);
mustMatch('journey-v36-preview.html', /<script\b(?=[^>]*\btype=["']module["'])(?=[^>]*\bsrc=["']\/src\/journey-v36-app-preview\.tsx["'])[^>]*>/s, 'journey-v36-preview.html must load /src/journey-v36-app-preview.tsx as module.', false);
mustMatch('src/journey-active.tsx', /import\s+['"]\.\/full-flow-journey-v35['"];?/, 'journey-active.tsx must keep importing v35 staging entry.');
mustMatch('src/full-flow-journey-v35.tsx', /import\s+['"]\.\/full-flow-journey-v34['"];?/, 'full-flow-journey-v35.tsx must still delegate to v34.');
mustMatch('vite.config.ts', /journeyV36Preview\s*:/, 'vite.config.ts must include journeyV36Preview input.');
mustMatch('vite.config.ts', /journey-v36-preview\.html/, 'vite.config.ts must include journey-v36-preview.html build input.');

const config = readCode('src/journey-v36-preview-config.ts');
for (const id of requiredStepIds) {
  if (!new RegExp(`\\bid\\s*:\\s*['"]${id}['"]`).test(config)) fail(`V36_APP_STEPS must include ${id}.`);
}
for (const key of requiredStorageKeys) {
  if (!config.includes(key)) fail(`V36_STORAGE_KEYS must include ${key}.`);
}

const v36App = readCode('src/full-flow-journey-v36-preview.tsx');
if (!v36App.includes('CustomerCallPlanLab')) fail('full-flow-journey-v36-preview.tsx must render CustomerCallPlanLab.');
if (!v36App.includes('AI 안전선')) fail('full-flow-journey-v36-preview.tsx must include AI safety notice text.');
if (!v36App.includes('v36 Preview Smoke')) fail('full-flow-journey-v36-preview.tsx must include v36 Preview Smoke panel.');

const customerLab = readCode('src/journey-v36-customer-call-plan-lab.tsx');
for (const text of [
  'CustomerCallPlanLab',
  'CUSTOMER_SEGMENTS',
  'TEAM_MEMBERS',
  'REVIEW_ITEMS',
  'RISK_EXPRESSIONS',
  'AI 답변 붙여넣기',
  '컴플라이언스 위험 표현 제거',
  '최종 산출물: 2주 콜플랜',
  '강사용 토의 질문',
]) {
  if (!customerLab.includes(text)) fail(`journey-v36-customer-call-plan-lab.tsx must include ${text}.`);
}
for (const member of ['신재영 대리', '이대은 대리', '박재욱 사원', '유희관 과장', '김문호 차장', '김재호 차장']) {
  if (!customerLab.includes(member)) fail(`CustomerCallPlanLab must include fixed team member ${member}.`);
}
for (const segment of ['A군', 'B군', 'C군', 'D군']) {
  if (!customerLab.includes(segment)) fail(`CustomerCallPlanLab must include customer segment ${segment}.`);
}

for (const forbidden of ['src/full-flow-journey-v34.tsx', 'src/journey-active.tsx', 'src/full-flow-journey-v35.tsx']) {
  const content = readCode('src/journey-v36-preview-config.ts');
  if (!content.includes(forbidden)) fail(`V36_PROTECTED_FILES must include ${forbidden}.`);
}

mustNotMatch('src/full-flow-journey-v36-preview.tsx', /import\s+['"]\.\/full-flow-journey-v34['"]/, 'v36 preview shell must not import v34 directly.');
mustNotMatch('src/full-flow-journey-v36-preview.tsx', /import\s+['"]\.\/full-flow-journey-v35['"]/, 'v36 preview shell must not import v35 staging entry.');
mustNotMatch('src/journey-v36-customer-call-plan-lab.tsx', /병원명\s*[:=]/, 'CustomerCallPlanLab must not define real hospital names.');
mustNotMatch('src/journey-v36-customer-call-plan-lab.tsx', /제품명\s*[:=]/, 'CustomerCallPlanLab must not define real product names.');

if (failures.length > 0) {
  console.error('v36 static smoke failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('v36 static smoke passed.');
