import { existsSync, readFileSync } from 'node:fs';

const failures = [];
const cache = new Map();

const requiredFiles = [
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
    'typecheck:v35': 'tsc -p tsconfig.v35-smoke.json --noEmit',
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
  if (smokeWorkflow.includes('npm run typecheck\n')) fail('v35-smoke.yml must not run full npm run typecheck.');
  mustInclude('.github/workflows/v35-remote-smoke.yml', 'npm run smoke:v35:remote', 'v35-remote-smoke.yml must run remote smoke.');
}

for (const file of requiredFiles) readText(file);
assertPackageScripts();
assertV35TsConfig();
assertVercelAndVite();
assertRuntimeGuards();
assertV35ConfigAndRouter();
assertSavedStateKeys();
assertWorkflowCoverage();

if (failures.length > 0) {
  console.error('v35 static smoke check failed.');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('v35 static smoke check passed.');
