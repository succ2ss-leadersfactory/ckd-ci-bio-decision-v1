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
    typecheck: 'npm run typecheck:v35',
    'typecheck:v35': 'tsc -p tsconfig.v35-smoke.json --noEmit',
    'typecheck:full': 'tsc --noEmit',
    'smoke:v35:static': 'node scripts/smoke-v35-static.mjs',
    'smoke:v35:dist': 'node scripts/smoke-v35-dist.mjs',
    'smoke:v35:remote': 'node scripts/smoke-v35-remote.mjs',
    'preflight:v35:cutover': 'node scripts/preflight-v35-cutover.mjs',
    'audit:v35:readiness': 'node scripts/audit-v35-readiness.mjs',
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

  const readinessWorkflow = readText('.github/workflows/v35-readiness-audit.yml');
  if (readinessWorkflow !== null && !readinessWorkflow.includes('npm run audit:v35:readiness')) {
    fail('v35-readiness-audit.yml must run npm run audit:v35:readiness.');
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
    'typecheck:full',
    'src/vite-env.d.ts',
    'docs/v35-browser-qa-result.md',
    'docs/v35-browser-qa-console-snippet.md',
    'docs/v35-browser-qa-runbook.md',
    'docs/v35-validation-index.md',
    '.github/workflows/v35-readiness-audit.yml',
    'npm run audit:v35:readiness',
  ];

  for (const phrase of requiredPhrases) {
    if (!staticSmoke.includes(phrase)) {
      fail(`smoke-v35-static.mjs must require ${phrase}.`);
    }
  }
}

function assertBrowserQaDocs() {
  const browserQa = readText('docs/v35-browser-qa-result.md');
  if (browserQa !== null) {
    const requiredPhrases = [
      '브라우저 QA 전체 판정:',
      'Console snippet 근거:',
      'J01~J09 저장 여부:',
      'localStorage key 분리 여부:',
      'cutover 검토 가능 여부:',
    ];

    for (const phrase of requiredPhrases) {
      if (!browserQa.includes(phrase)) {
        fail(`docs/v35-browser-qa-result.md must include ${phrase}.`);
      }
    }
  }

  const snippet = readText('docs/v35-browser-qa-console-snippet.md');
  if (snippet !== null) {
    const requiredPhrases = [
      'requiredPreviewKeys',
      'requiredSavedStateKeys',
      'missingPreviewKeys',
      'missingSavedStateKeys',
      'v34FlowKeysFound',
      'pass',
    ];

    for (const phrase of requiredPhrases) {
      if (!snippet.includes(phrase)) {
        fail(`docs/v35-browser-qa-console-snippet.md must include ${phrase}.`);
      }
    }
  }

  const runbook = readText('docs/v35-browser-qa-runbook.md');
  if (runbook !== null) {
    const requiredPhrases = [
      '/journey.html',
      '/journey-v35-preview.html',
      'Step 0~8',
      'J01~J09',
      'Console snippet',
      'missingPreviewKeys: none',
      'missingSavedStateKeys: none',
      'pass: true',
      'Actions → v35 Readiness Audit → Run workflow',
    ];

    for (const phrase of requiredPhrases) {
      if (!runbook.includes(phrase)) {
        fail(`docs/v35-browser-qa-runbook.md must include ${phrase}.`);
      }
    }
  }

  const validationIndex = readText('docs/v35-validation-index.md');
  if (validationIndex !== null) {
    const requiredPhrases = [
      'v35 Validation Document Index',
      'docs/v35-smoke-automation-guide.md',
      'docs/v35-deployment-url-guide.md',
      'docs/v35-browser-qa-runbook.md',
      'docs/v35-browser-qa-console-snippet.md',
      'docs/v35-browser-qa-result.md',
      'docs/v35-preview-smoke-result.md',
      'docs/v35-cutover-gates.md',
      'Actions → v35 Smoke → Run workflow',
      'Actions → v35 Remote Smoke → Run workflow',
      'Actions → v35 Readiness Audit → Run workflow',
    ];

    for (const phrase of requiredPhrases) {
      if (!validationIndex.includes(phrase)) {
        fail(`docs/v35-validation-index.md must include ${phrase}.`);
      }
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
    'v35 Readiness Audit',
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
    '.github/workflows/v35-readiness-audit.yml',
    'docs/v35-preview-checklist.md',
    'docs/v35-preview-smoke-result.md',
    'docs/v35-browser-qa-result.md',
    'docs/v35-browser-qa-console-snippet.md',
    'docs/v35-browser-qa-runbook.md',
    'docs/v35-validation-index.md',
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
assertBrowserQaDocs();
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
