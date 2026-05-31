import { existsSync, readFileSync } from 'node:fs';

const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function readText(file) {
  if (!existsSync(file)) {
    fail(`Missing required file: ${file}`);
    return null;
  }

  return readFileSync(file, 'utf8');
}

function stripCodeComments(content) {
  return content.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

function readCode(file) {
  const content = readText(file);
  return content === null ? null : stripCodeComments(content);
}

function readJson(file) {
  const content = readText(file);
  if (content === null) {
    return null;
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    fail(`${file} must be valid JSON. ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

function assertContains(file, pattern, message, { code = false } = {}) {
  const content = code ? readCode(file) : readText(file);
  if (content === null) {
    return;
  }

  if (!pattern.test(content)) {
    fail(message);
  }
}

function assertNotContains(file, pattern, message, { code = false } = {}) {
  const content = code ? readCode(file) : readText(file);
  if (content === null) {
    return;
  }

  if (pattern.test(content)) {
    fail(message);
  }
}

function assertPackageScripts() {
  const packageJson = readJson('package.json');
  const scripts = packageJson?.scripts ?? {};

  const requiredScripts = {
    'smoke:v35:static': 'node scripts/smoke-v35-static.mjs',
    'smoke:v35:dist': 'node scripts/smoke-v35-dist.mjs',
    'smoke:v35:remote': 'node scripts/smoke-v35-remote.mjs',
    'preflight:v35:cutover': 'node scripts/preflight-v35-cutover.mjs',
    'typecheck:v35': 'tsc -p tsconfig.v35-smoke.json --noEmit',
  };

  for (const [name, expected] of Object.entries(requiredScripts)) {
    if (scripts[name] !== expected) {
      fail(`package.json must keep ${name} = ${expected}.`);
    }
  }

  const smokeV35 = scripts['smoke:v35'] ?? '';
  const requiredCommands = [
    'npm run smoke:v35:static',
    'npm run typecheck:v35',
    'npm run build',
    'npm run smoke:v35:dist',
    'npm run preflight:v35:cutover',
  ];

  for (const command of requiredCommands) {
    if (!smokeV35.includes(command)) {
      fail(`package.json smoke:v35 must include ${command}.`);
    }
  }

  if (smokeV35.includes('npm run typecheck &&')) {
    fail('package.json smoke:v35 must not use full npm run typecheck; use npm run typecheck:v35 instead.');
  }
}

function assertV35TsConfig() {
  const config = readJson('tsconfig.v35-smoke.json');
  const includes = Array.isArray(config?.include) ? config.include : [];

  const requiredIncludes = [
    'src/vite-env.d.ts',
    'src/journey-v35-app-preview.tsx',
    'src/full-flow-journey-v35-app.tsx',
    'src/journey-v35-preview-config.ts',
    'src/journey-v35-preview-state.ts',
    'src/journey-v35-preview-router.tsx',
    'src/journey-v35-preview-steps.tsx',
    'src/journey-v35-preview-panels.tsx',
    'src/journey-v35-preview-types.ts',
  ];

  for (const include of requiredIncludes) {
    if (!includes.includes(include)) {
      fail(`tsconfig.v35-smoke.json must include ${include}.`);
    }
  }

  const forbiddenIncludes = [
    'src/full-flow-journey-v26.tsx',
    'src/full-flow-journey-v28.tsx',
    'src/full-flow-journey-v29.tsx',
    'src/full-flow-journey-v30.tsx',
    'src/full-flow-journey-v31.tsx',
    'src/full-flow-journey-v32.tsx',
    'src/full-flow-journey-v33.tsx',
    'src/full-flow-journey-v34.tsx',
  ];

  for (const include of forbiddenIncludes) {
    if (includes.includes(include)) {
      fail(`tsconfig.v35-smoke.json must not include archived operating file ${include}.`);
    }
  }
}

function assertVercelRedirect() {
  const vercelJson = readJson('vercel.json');
  const redirects = Array.isArray(vercelJson?.redirects) ? vercelJson.redirects : [];
  const hasRootJourneyRedirect = redirects.some((redirect) => redirect?.source === '/' && redirect?.destination === '/journey.html');

  if (!hasRootJourneyRedirect) {
    fail('vercel.json must keep / redirecting to /journey.html.');
  }
}

function assertWorkflowCoverage() {
  const smokeWorkflow = readText('.github/workflows/v35-smoke.yml');
  if (smokeWorkflow !== null && !smokeWorkflow.includes('npm run preflight:v35:cutover')) {
    fail('v35-smoke.yml must run npm run preflight:v35:cutover.');
  }
  if (smokeWorkflow !== null && !smokeWorkflow.includes('npm run typecheck:v35')) {
    fail('v35-smoke.yml must run npm run typecheck:v35 instead of full typecheck.');
  }
  if (smokeWorkflow !== null && smokeWorkflow.includes('npm run typecheck\n')) {
    fail('v35-smoke.yml must not run full npm run typecheck.');
  }

  const remoteWorkflow = readText('.github/workflows/v35-remote-smoke.yml');
  if (remoteWorkflow !== null && !remoteWorkflow.includes('npm run smoke:v35:remote')) {
    fail('v35-remote-smoke.yml must run npm run smoke:v35:remote.');
  }
}

function assertStaticSmokeCoversPreflight() {
  const staticSmoke = readText('scripts/smoke-v35-static.mjs');
  if (staticSmoke === null) {
    return;
  }

  const requiredPhrases = [
    'scripts/preflight-v35-cutover.mjs',
    'preflight:v35:cutover',
    'npm run preflight:v35:cutover',
    'typecheck:v35',
    'npm run typecheck:v35',
    'src/vite-env.d.ts',
  ];

  for (const phrase of requiredPhrases) {
    if (!staticSmoke.includes(phrase)) {
      fail(`smoke-v35-static.mjs must require ${phrase}.`);
    }
  }
}

function assertCutoverDocsStillBlockCutover() {
  const cutoverDoc = readText('docs/v35-cutover-gates.md');
  if (cutoverDoc === null) {
    return;
  }

  const requiredPhrases = [
    'Cutover 불가',
    '실행 검증 대기',
    'import \'./full-flow-journey-v34\';',
    'v35 Remote Smoke',
    'rollback',
  ];

  for (const phrase of requiredPhrases) {
    if (!cutoverDoc.includes(phrase)) {
      warn(`docs/v35-cutover-gates.md should mention: ${phrase}`);
    }
  }

  const smokeResultDoc = readText('docs/v35-preview-smoke-result.md');
  if (smokeResultDoc === null) {
    return;
  }

  if (/전체 판정:\s*(통과|PASS|Pass|pass)/.test(smokeResultDoc)) {
    warn('docs/v35-preview-smoke-result.md appears to mark overall status as passed. Confirm all gates are genuinely complete before cutover.');
  }

  if (!/전체 판정:\s*실행 검증 대기/.test(smokeResultDoc)) {
    warn('docs/v35-preview-smoke-result.md no longer says 전체 판정: 실행 검증 대기. Confirm this reflects real QA results.');
  }
}

function assertCurrentNoCutoverState() {
  assertContains('src/journey-active.tsx', /import\s+['"]\.\/full-flow-journey-v35['"];?/, 'journey-active.tsx must keep importing full-flow-journey-v35.', { code: true });
  assertContains('src/full-flow-journey-v35.tsx', /import\s+['"]\.\/full-flow-journey-v34['"];?/, 'full-flow-journey-v35.tsx must still delegate to v34 before approved cutover.', { code: true });
  assertNotContains('src/journey-v35-preview-config.ts', /c1bio_flow_/, 'v35 preview config must not use v34 c1bio_flow_* keys.', { code: true });
}

function assertRequiredFiles() {
  const requiredFiles = [
    'scripts/smoke-v35-static.mjs',
    'scripts/smoke-v35-dist.mjs',
    'scripts/smoke-v35-remote.mjs',
    'scripts/preflight-v35-cutover.mjs',
    'tsconfig.v35-smoke.json',
    'src/vite-env.d.ts',
    '.github/workflows/v35-smoke.yml',
    '.github/workflows/v35-remote-smoke.yml',
    'docs/v35-preview-checklist.md',
    'docs/v35-preview-smoke-result.md',
    'docs/v35-cutover-gates.md',
    'docs/v35-deployment-url-guide.md',
  ];

  for (const file of requiredFiles) {
    readText(file);
  }
}

console.log('Running v35 cutover preflight guard...');

assertRequiredFiles();
assertPackageScripts();
assertV35TsConfig();
assertVercelRedirect();
assertWorkflowCoverage();
assertStaticSmokeCoversPreflight();
assertCurrentNoCutoverState();
assertCutoverDocsStillBlockCutover();

if (warnings.length > 0) {
  console.warn('v35 cutover preflight warnings:');
  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
}

if (failures.length > 0) {
  console.error('v35 cutover preflight failed.');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('v35 cutover preflight passed. Current state remains protected; cutover is still blocked until QA results are recorded.');
