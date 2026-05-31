import { existsSync, readFileSync } from 'node:fs';

const failures = [];
const cache = new Map();

const requiredFiles = [
  'README.md',
  'journey.html',
  'journey-v35-preview.html',
  'package.json',
  'tsconfig.v35-smoke.json',
  'vercel.json',
  'vite.config.ts',
  'scripts/smoke-v35-dist.mjs',
  'scripts/smoke-v35-remote.mjs',
  'scripts/preflight-v35-cutover.mjs',
  '.github/workflows/v35-smoke.yml',
  '.github/workflows/v35-remote-smoke.yml',
  '.github/workflows/v35-readiness-audit.yml',
  'docs/v35-browser-qa-result.md',
  'docs/v35-browser-qa-console-snippet.md',
  'docs/v35-browser-qa-runbook.md',
  'docs/v35-validation-index.md',
  'src/vite-env.d.ts',
  'src/journey-active.tsx',
  'src/full-flow-journey-v34.tsx',
  'src/full-flow-journey-v35.tsx',
  'src/full-flow-journey-v35-app.tsx',
  'src/journey-v35-app-preview.tsx',
  'src/journey-v35-preview-config.ts',
  'src/journey-v35-preview-state.ts',
  'src/journey-v35-preview-router.tsx',
  'src/journey-v35-preview-steps.tsx',
  'src/journey-v35-preview-panels.tsx',
  'src/journey-v35-preview-types.ts',
];

const requiredStorageKeys = [
  'c1bio_v35_preview_step',
  'c1bio_v35_preview_participant',
  'c1bio_v35_preview_state',
  'c1bio_v35_preview_strategy_notes',
  'c1bio_v35_preview_source_checks',
  'c1bio_v35_preview_source_risk',
  'c1bio_v35_preview_readiness_result',
  'c1bio_v35_preview_report_summary',
  'c1bio_v35_preview_report_link_or_file_name',
  'c1bio_v35_preview_slides_summary',
  'c1bio_v35_preview_slides_link_or_file_name',
  'c1bio_v35_preview_presentation_checks',
  'c1bio_v35_preview_presentation_one_liner',
  'c1bio_v35_preview_presentation_manager_request',
];

const requiredStepIds = [
  'entry',
  'prompt-practice',
  'strategy-issue-review',
  'source-check',
  'notebook-source-prep',
  'notebook-readiness-check',
  'studio-report',
  'studio-slides',
  'presentation-checklist',
];

const requiredSaveKeys = [
  ['src/journey-entry.tsx', 'J01-entry'],
  ['src/journey-prompt-practice.tsx', 'J02-prompt'],
  ['src/journey-v35-preview-steps.tsx', 'J03-strategy-issue-review'],
  ['src/journey-v35-preview-steps.tsx', 'J04-source-check'],
  ['src/journey-v35-preview-steps.tsx', 'J05-notebook-source-prep'],
  ['src/journey-v35-preview-steps.tsx', 'J06-notebook-readiness-check'],
  ['src/journey-v35-preview-steps.tsx', 'J07-studio-report'],
  ['src/journey-v35-preview-steps.tsx', 'J08-studio-slides'],
  ['src/journey-v35-preview-steps.tsx', 'J09-presentation-checklist'],
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

function mustInclude(file, text, message) {
  if (!readText(file).includes(text)) fail(message);
}

function mustMatch(file, pattern, message, code = true) {
  const content = code ? readCode(file) : readText(file);
  if (!pattern.test(content)) fail(message);
}

function mustNotMatch(file, pattern, message, code = true) {
  const content = code ? readCode(file) : readText(file);
  if (pattern.test(content)) fail(message);
}

function assertPackageScripts() {
  const scripts = readJson('package.json').scripts ?? {};
  const expected = {
    typecheck: 'npm run typecheck:v35',
    'typecheck:v35': 'tsc -p tsconfig.v35-smoke.json --noEmit',
    'typecheck:full': 'tsc --noEmit',
    'smoke:v35:static': 'node scripts/smoke-v35-static.mjs',
    'smoke:v35:dist': 'node scripts/smoke-v35-dist.mjs',
    'smoke:v35:remote': 'node scripts/smoke-v35-remote.mjs',
    'preflight:v35:cutover': 'node scripts/preflight-v35-cutover.mjs',
    'audit:v35:readiness': 'node scripts/audit-v35-readiness.mjs',
  };

  for (const [name, command] of Object.entries(expected)) {
    if (scripts[name] !== command) fail(`package.json ${name} must run ${command}.`);
  }

  const smoke = scripts['smoke:v35'] ?? '';
  for (const command of [
    'npm run smoke:v35:static',
    'npm run typecheck:v35',
    'npm run build',
    'npm run smoke:v35:dist',
    'npm run preflight:v35:cutover',
  ]) {
    if (!smoke.includes(command)) fail(`package.json smoke:v35 must include ${command}.`);
  }
  if (smoke.includes('npm run typecheck &&')) fail('package.json smoke:v35 must not run full typecheck; use typecheck:v35.');
}

function assertV35TsConfig() {
  const include = readJson('tsconfig.v35-smoke.json').include ?? [];
  for (const file of [
    'src/vite-env.d.ts',
    'src/journey-v35-app-preview.tsx',
    'src/full-flow-journey-v35-app.tsx',
    'src/journey-v35-preview-config.ts',
    'src/journey-v35-preview-state.ts',
    'src/journey-v35-preview-router.tsx',
    'src/journey-v35-preview-steps.tsx',
    'src/journey-v35-preview-panels.tsx',
    'src/journey-v35-preview-types.ts',
  ]) {
    if (!include.includes(file)) fail(`tsconfig.v35-smoke.json must include ${file}.`);
  }

  for (const archived of [
    'src/full-flow-journey-v26.tsx',
    'src/full-flow-journey-v28.tsx',
    'src/full-flow-journey-v29.tsx',
    'src/full-flow-journey-v30.tsx',
    'src/full-flow-journey-v31.tsx',
    'src/full-flow-journey-v32.tsx',
    'src/full-flow-journey-v33.tsx',
    'src/full-flow-journey-v34.tsx',
  ]) {
    if (include.includes(archived)) fail(`tsconfig.v35-smoke.json must not include archived file ${archived}.`);
  }
}

function assertVercelAndVite() {
  const redirects = readJson('vercel.json').redirects ?? [];
  if (!redirects.some((r) => r?.source === '/' && r?.destination === '/journey.html')) {
    fail('vercel.json must redirect / to /journey.html.');
  }
  mustMatch('vite.config.ts', /\bjourneyV35Preview\s*:/, 'vite.config.ts must include journeyV35Preview input.');
  mustMatch('vite.config.ts', /journey-v35-preview\.html/, 'vite.config.ts must include journey-v35-preview.html build input.');
}

function assertRuntimeGuards() {
  mustMatch('journey.html', /<script\b(?=[^>]*\btype=["']module["'])(?=[^>]*\bsrc=["']\/src\/journey-active\.tsx["'])[^>]*>/s, 'journey.html must load /src/journey-active.tsx as module.', false);
  mustMatch('journey-v35-preview.html', /<script\b(?=[^>]*\btype=["']module["'])(?=[^>]*\bsrc=["']\/src\/journey-v35-app-preview\.tsx["'])[^>]*>/s, 'journey-v35-preview.html must load /src/journey-v35-app-preview.tsx as module.', false);
  mustMatch('src/journey-active.tsx', /import\s+['"]\.\/full-flow-journey-v35['"];?/, 'journey-active.tsx must keep importing v35 staging entry.');
  mustMatch('src/full-flow-journey-v35.tsx', /import\s+['"]\.\/full-flow-journey-v34['"];?/, 'full-flow-journey-v35.tsx must still delegate to v34 before cutover.');
  mustNotMatch('src/journey-v35-preview-config.ts', /c1bio_flow_/, 'v35 preview config must not use c1bio_flow_* keys.');
}

function assertV35ConfigAndRouter() {
  const config = readCode('src/journey-v35-preview-config.ts');
  for (const key of requiredStorageKeys) if (!config.includes(key)) fail(`V35_STORAGE_KEYS must include ${key}.`);
  for (const id of requiredStepIds) if (!new RegExp(`\\bid\\s*:\\s*['"]${id}['"]`).test(config)) fail(`V35_APP_STEPS must include ${id}.`);
  const router = readCode('src/journey-v35-preview-router.tsx');
  for (let index = 0; index < requiredStepIds.length; index += 1) {
    if (!new RegExp(`case\\s+${index}\\s*:`).test(router)) fail(`renderV35PreviewStep must include case ${index}.`);
  }
}

function assertSavedStateKeys() {
  for (const [file, key] of requiredSaveKeys) {
    if (!readCode(file).includes(key)) fail(`${file} must save ${key}.`);
  }
}

function assertWorkflowCoverage() {
  const smokeWorkflow = readText('.github/workflows/v35-smoke.yml');
  for (const text of ['npm run smoke:v35:static', 'npm run typecheck:v35', 'npm run smoke:v35:dist', 'npm run preflight:v35:cutover', 'npm run smoke:v35']) {
    if (!smokeWorkflow.includes(text)) fail(`v35-smoke.yml must include ${text}.`);
  }
  for (const text of ['Protected validation entry points', 'README.md keeps the v35 validation entry point', 'docs/v35-validation-index.md keeps the document sequence', 'docs/v35-browser-qa-runbook.md keeps the browser QA procedure', 'docs/v35-browser-qa-console-snippet.md keeps the storage/key evidence check', 'docs/v35-browser-qa-result.md keeps the required browser QA result fields', 'Open README.md and start from docs/v35-validation-index.md', 'console snippet and confirm missingPreviewKeys none, missingSavedStateKeys none, pass true']) {
    if (!smokeWorkflow.includes(text)) fail(`v35-smoke.yml summary must include ${text}.`);
  }
  if (smokeWorkflow.includes('npm run typecheck\n')) fail('v35-smoke.yml must not run full npm run typecheck.');
  mustInclude('.github/workflows/v35-remote-smoke.yml', 'npm run smoke:v35:remote', 'v35-remote-smoke.yml must run remote smoke.');
  mustInclude('.github/workflows/v35-readiness-audit.yml', 'npm run audit:v35:readiness', 'v35-readiness-audit.yml must run readiness audit.');
}

function assertBrowserQaDocs() {
  for (const text of ['브라우저 QA 전체 판정:', 'Console snippet 근거:', 'J01~J09 저장 여부:', 'localStorage key 분리 여부:', 'cutover 검토 가능 여부:']) {
    mustInclude('docs/v35-browser-qa-result.md', text, `docs/v35-browser-qa-result.md must include ${text}.`);
  }

  for (const text of ['requiredPreviewKeys', 'requiredSavedStateKeys', 'missingPreviewKeys', 'missingSavedStateKeys', 'v34FlowKeysFound', 'pass']) {
    mustInclude('docs/v35-browser-qa-console-snippet.md', text, `docs/v35-browser-qa-console-snippet.md must include ${text}.`);
  }

  for (const text of ['/journey.html', '/journey-v35-preview.html', 'Step 0~8', 'J01~J09', 'Console snippet', 'missingPreviewKeys: none', 'missingSavedStateKeys: none', 'pass: true', 'Actions → v35 Readiness Audit → Run workflow']) {
    mustInclude('docs/v35-browser-qa-runbook.md', text, `docs/v35-browser-qa-runbook.md must include ${text}.`);
  }

  for (const text of ['v35 Validation Document Index', 'docs/v35-smoke-automation-guide.md', 'docs/v35-deployment-url-guide.md', 'docs/v35-browser-qa-runbook.md', 'docs/v35-browser-qa-console-snippet.md', 'docs/v35-browser-qa-result.md', 'docs/v35-preview-smoke-result.md', 'docs/v35-cutover-gates.md', 'Actions → v35 Smoke → Run workflow', 'Actions → v35 Remote Smoke → Run workflow', 'Actions → v35 Readiness Audit → Run workflow']) {
    mustInclude('docs/v35-validation-index.md', text, `docs/v35-validation-index.md must include ${text}.`);
  }
}

function assertReadmeV35Entry() {
  for (const text of ['v35 검증 상태', 'docs/v35-validation-index.md', 'Actions → v35 Smoke → Run workflow', 'Actions → v35 Remote Smoke → Run workflow', 'Actions → v35 Readiness Audit → Run workflow', '/journey.html', '/journey-v35-preview.html', 'npm run smoke:v35', 'npm run audit:v35:readiness']) {
    mustInclude('README.md', text, `README.md must include ${text}.`);
  }

  const readme = readText('README.md');
  const hasCutoverHold = readme.includes('cutover는 아직 진행하지 않습니다') || readme.includes('현재 cutover는 진행하지 않습니다');
  if (!hasCutoverHold) {
    fail('README.md must state that cutover is not currently being performed.');
  }
}

for (const file of requiredFiles) readText(file);
assertPackageScripts();
assertV35TsConfig();
assertVercelAndVite();
assertRuntimeGuards();
assertV35ConfigAndRouter();
assertSavedStateKeys();
assertWorkflowCoverage();
assertBrowserQaDocs();
assertReadmeV35Entry();

if (failures.length > 0) {
  console.error('v35 static smoke check failed.');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('v35 static smoke check passed.');
