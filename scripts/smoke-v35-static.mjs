import { readFileSync, existsSync } from 'node:fs';

const requiredFiles = [
  'journey.html',
  'journey-v35-preview.html',
  'package.json',
  'vercel.json',
  'vite.config.ts',
  'scripts/smoke-v35-dist.mjs',
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

const requiredSaveKeyChecks = [
  { file: 'src/journey-entry.tsx', key: 'J01-entry' },
  { file: 'src/journey-prompt-practice.tsx', key: 'J02-prompt' },
  { file: 'src/journey-v35-preview-steps.tsx', key: 'J03-strategy-issue-review' },
  { file: 'src/journey-v35-preview-steps.tsx', key: 'J04-source-check' },
  { file: 'src/journey-v35-preview-steps.tsx', key: 'J05-notebook-source-prep' },
  { file: 'src/journey-v35-preview-steps.tsx', key: 'J06-notebook-readiness-check' },
  { file: 'src/journey-v35-preview-steps.tsx', key: 'J07-studio-report' },
  { file: 'src/journey-v35-preview-steps.tsx', key: 'J08-studio-slides' },
  { file: 'src/journey-v35-preview-steps.tsx', key: 'J09-presentation-checklist' },
];

const requiredCodePatterns = [
  {
    file: 'src/journey-active.tsx',
    pattern: /import\s+['"]\.\/full-flow-journey-v35['"];?/,
    message: 'journey-active.tsx must keep importing full-flow-journey-v35 before cutover.',
  },
  {
    file: 'src/full-flow-journey-v35.tsx',
    pattern: /import\s+['"]\.\/full-flow-journey-v34['"];?/,
    message: 'full-flow-journey-v35.tsx must still delegate to v34 before cutover.',
  },
  {
    file: 'src/full-flow-journey-v35.tsx',
    pattern: /\bFullFlowJourneyV35App\b/,
    message: 'full-flow-journey-v35.tsx must smoke-check FullFlowJourneyV35App.',
  },
  {
    file: 'src/full-flow-journey-v35.tsx',
    pattern: /\brenderV35PreviewStep\b/,
    message: 'full-flow-journey-v35.tsx must smoke-check renderV35PreviewStep.',
  },
  {
    file: 'src/full-flow-journey-v35.tsx',
    pattern: /\buseV35PreviewState\b/,
    message: 'full-flow-journey-v35.tsx must smoke-check useV35PreviewState.',
  },
  {
    file: 'src/full-flow-journey-v35-app.tsx',
    pattern: /\bJourneyShell\b/,
    message: 'full-flow-journey-v35-app.tsx must render JourneyShell.',
  },
  {
    file: 'src/full-flow-journey-v35-app.tsx',
    pattern: /\brenderV35PreviewStep\b/,
    message: 'full-flow-journey-v35-app.tsx must use renderV35PreviewStep.',
  },
  {
    file: 'src/full-flow-journey-v35-app.tsx',
    pattern: /\buseV35PreviewState\b/,
    message: 'full-flow-journey-v35-app.tsx must use useV35PreviewState.',
  },
  {
    file: 'src/full-flow-journey-v35-app.tsx',
    pattern: /\bV35PreviewSmokePanel\b/,
    message: 'full-flow-journey-v35-app.tsx must render V35PreviewSmokePanel.',
  },
  {
    file: 'src/full-flow-journey-v35-app.tsx',
    pattern: /\bV35PreviewDebugPanel\b/,
    message: 'full-flow-journey-v35-app.tsx must render V35PreviewDebugPanel.',
  },
  {
    file: 'src/journey-v35-preview-panels.tsx',
    pattern: /data-testid\s*=\s*['"]v35-preview-smoke-panel['"]/,
    message: 'journey-v35-preview-panels.tsx must expose v35 preview smoke panel test id.',
  },
  {
    file: 'src/journey-v35-preview-panels.tsx',
    pattern: /data-testid\s*=\s*['"]v35-preview-debug-panel['"]/,
    message: 'journey-v35-preview-panels.tsx must expose v35 preview debug panel test id.',
  },
  {
    file: 'src/journey-v35-app-preview.tsx',
    pattern: /\bFullFlowJourneyV35App\b/,
    message: 'journey-v35-app-preview.tsx must render FullFlowJourneyV35App.',
  },
];

const failures = [];
const fileCache = new Map();

function fail(message) {
  failures.push(message);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function readText(file) {
  if (fileCache.has(file)) {
    return fileCache.get(file);
  }

  if (!existsSync(file)) {
    fail(`Missing required file: ${file}`);
    fileCache.set(file, null);
    return null;
  }

  const content = readFileSync(file, 'utf8');
  fileCache.set(file, content);
  return content;
}

function stripCodeComments(content) {
  return content.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

function readCode(file) {
  const content = readText(file);
  return content === null ? null : stripCodeComments(content);
}

function assertPattern({ file, pattern, message, code = true }) {
  const content = code ? readCode(file) : readText(file);
  if (content === null) {
    return;
  }

  if (!pattern.test(content)) {
    fail(message);
  }
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

function assertHtmlModuleEntry(file, expectedSrc) {
  assertPattern({
    file,
    code: false,
    pattern: new RegExp(`<script\\b(?=[^>]*\\btype=["']module["'])(?=[^>]*\\bsrc=["']${escapeRegExp(expectedSrc)}["'])[^>]*>`, 's'),
    message: `${file} must load ${expectedSrc} as a module script.`,
  });
}

function assertPackageScripts() {
  const packageJson = readJson('package.json');
  if (!packageJson?.scripts) {
    fail('package.json must include scripts.');
    return;
  }

  const scripts = packageJson.scripts;

  if (scripts['smoke:v35:static'] !== 'node scripts/smoke-v35-static.mjs') {
    fail('package.json smoke:v35:static must run node scripts/smoke-v35-static.mjs.');
  }

  if (scripts['smoke:v35:dist'] !== 'node scripts/smoke-v35-dist.mjs') {
    fail('package.json smoke:v35:dist must run node scripts/smoke-v35-dist.mjs.');
  }

  const smokeV35 = scripts['smoke:v35'] ?? '';
  const requiredCommands = ['npm run smoke:v35:static', 'npm run typecheck', 'npm run build', 'npm run smoke:v35:dist'];
  for (const command of requiredCommands) {
    if (!smokeV35.includes(command)) {
      fail(`package.json smoke:v35 must include ${command}.`);
    }
  }
}

function assertVercelRedirect() {
  const vercelJson = readJson('vercel.json');
  const redirects = Array.isArray(vercelJson?.redirects) ? vercelJson.redirects : [];
  const hasRootJourneyRedirect = redirects.some((redirect) => redirect?.source === '/' && redirect?.destination === '/journey.html');

  if (!hasRootJourneyRedirect) {
    fail('vercel.json must redirect root to /journey.html.');
  }
}

function assertVitePreviewInput() {
  const content = readCode('vite.config.ts');
  if (content === null) {
    return;
  }

  if (!/\bjourneyV35Preview\s*:/.test(content)) {
    fail('vite.config.ts must include journeyV35Preview input.');
  }

  if (!/resolve\s*\([^)]*['"]journey-v35-preview\.html['"][^)]*\)/s.test(content)) {
    fail('vite.config.ts must include journey-v35-preview.html as a build input.');
  }
}

function assertV35Config() {
  const content = readCode('src/journey-v35-preview-config.ts');
  if (content === null) {
    return;
  }

  for (const storageKey of requiredStorageKeys) {
    const storageKeyPattern = new RegExp(`["']${escapeRegExp(storageKey)}["']`);
    if (!storageKeyPattern.test(content)) {
      fail(`V35_STORAGE_KEYS must include storage key: ${storageKey}`);
    }
  }

  for (const stepId of requiredStepIds) {
    const stepPattern = new RegExp(`\\bid\\s*:\\s*["']${escapeRegExp(stepId)}["']`);
    if (!stepPattern.test(content)) {
      fail(`V35_APP_STEPS must include step id: ${stepId}`);
    }
  }

  if (/['"]c1bio_flow_/.test(content) || /c1bio_flow_/.test(content)) {
    fail('v35 preview config must not use v34 c1bio_flow_ storage keys.');
  }
}

function assertV35RouterCases() {
  const content = readCode('src/journey-v35-preview-router.tsx');
  if (content === null) {
    return;
  }

  for (let index = 0; index < requiredStepIds.length; index += 1) {
    const casePattern = new RegExp(`case\\s+${index}\\s*:`);
    if (!casePattern.test(content)) {
      fail(`renderV35PreviewStep must include case ${index}.`);
    }
  }
}

function assertSaveKeys() {
  for (const { file, key } of requiredSaveKeyChecks) {
    const content = readCode(file);
    if (content === null) {
      continue;
    }

    const keyPattern = new RegExp(`["']${escapeRegExp(key)}["']`);
    if (!keyPattern.test(content)) {
      fail(`${file} must save ${key}.`);
    }
  }
}

for (const file of requiredFiles) {
  readText(file);
}

assertPackageScripts();
assertHtmlModuleEntry('journey.html', '/src/journey-active.tsx');
assertHtmlModuleEntry('journey-v35-preview.html', '/src/journey-v35-app-preview.tsx');
assertVitePreviewInput();
assertVercelRedirect();

for (const check of requiredCodePatterns) {
  assertPattern(check);
}

assertV35Config();
assertV35RouterCases();
assertSaveKeys();

if (failures.length > 0) {
  console.error('v35 static smoke check failed.');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('v35 static smoke check passed.');
