import { readFileSync, existsSync } from 'node:fs';

const requiredFiles = [
  'journey.html',
  'journey-v35-preview.html',
  'package.json',
  'vercel.json',
  'vite.config.ts',
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

const requiredTextChecks = [
  {
    file: 'package.json',
    text: 'smoke:v35:static',
    message: 'package.json must include smoke:v35:static script.',
  },
  {
    file: 'package.json',
    text: 'npm run smoke:v35:static && npm run typecheck && npm run build',
    message: 'package.json smoke:v35 must run static, typecheck, then build.',
  },
  {
    file: 'journey.html',
    text: '/src/journey-active.tsx',
    message: 'journey.html must load /src/journey-active.tsx.',
  },
  {
    file: 'journey-v35-preview.html',
    text: '/src/journey-v35-app-preview.tsx',
    message: 'journey-v35-preview.html must load /src/journey-v35-app-preview.tsx.',
  },
  {
    file: 'vite.config.ts',
    text: 'journeyV35Preview',
    message: 'vite.config.ts must include journeyV35Preview input.',
  },
  {
    file: 'vite.config.ts',
    text: 'journey-v35-preview.html',
    message: 'vite.config.ts must include journey-v35-preview.html.',
  },
  {
    file: 'vercel.json',
    text: '/journey.html',
    message: 'vercel.json must redirect root to /journey.html.',
  },
  {
    file: 'src/full-flow-journey-v35.tsx',
    text: "import './full-flow-journey-v34';",
    message: 'full-flow-journey-v35.tsx must still delegate to v34 before cutover.',
  },
  {
    file: 'src/full-flow-journey-v35.tsx',
    text: 'FullFlowJourneyV35App',
    message: 'full-flow-journey-v35.tsx must smoke-check FullFlowJourneyV35App.',
  },
  {
    file: 'src/full-flow-journey-v35.tsx',
    text: 'renderV35PreviewStep',
    message: 'full-flow-journey-v35.tsx must smoke-check renderV35PreviewStep.',
  },
  {
    file: 'src/full-flow-journey-v35.tsx',
    text: 'useV35PreviewState',
    message: 'full-flow-journey-v35.tsx must smoke-check useV35PreviewState.',
  },
  {
    file: 'src/full-flow-journey-v35-app.tsx',
    text: 'JourneyShell',
    message: 'full-flow-journey-v35-app.tsx must render JourneyShell.',
  },
  {
    file: 'src/full-flow-journey-v35-app.tsx',
    text: 'renderV35PreviewStep',
    message: 'full-flow-journey-v35-app.tsx must use renderV35PreviewStep.',
  },
  {
    file: 'src/full-flow-journey-v35-app.tsx',
    text: 'useV35PreviewState',
    message: 'full-flow-journey-v35-app.tsx must use useV35PreviewState.',
  },
  {
    file: 'src/journey-v35-app-preview.tsx',
    text: 'FullFlowJourneyV35App',
    message: 'journey-v35-app-preview.tsx must render FullFlowJourneyV35App.',
  },
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

const requiredRouterCases = ['case 0:', 'case 1:', 'case 2:', 'case 3:', 'case 4:', 'case 5:', 'case 6:', 'case 7:', 'case 8:'];

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

const forbiddenTextChecks = [
  {
    file: 'src/journey-v35-preview-config.ts',
    text: 'c1bio_flow_',
    message: 'v35 preview config must not use v34 c1bio_flow_ storage keys.',
  },
];

const failures = [];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    failures.push(`Missing required file: ${file}`);
  }
}

for (const check of requiredTextChecks) {
  if (!existsSync(check.file)) {
    continue;
  }

  const content = readFileSync(check.file, 'utf8');
  if (!content.includes(check.text)) {
    failures.push(check.message);
  }
}

if (existsSync('src/journey-v35-preview-config.ts')) {
  const configContent = readFileSync('src/journey-v35-preview-config.ts', 'utf8');

  for (const storageKey of requiredStorageKeys) {
    if (!configContent.includes(storageKey)) {
      failures.push(`V35_STORAGE_KEYS must include storage key: ${storageKey}`);
    }
  }

  for (const stepId of requiredStepIds) {
    if (!configContent.includes(`id: '${stepId}'`)) {
      failures.push(`V35_APP_STEPS must include step id: ${stepId}`);
    }
  }
}

if (existsSync('src/journey-v35-preview-router.tsx')) {
  const routerContent = readFileSync('src/journey-v35-preview-router.tsx', 'utf8');
  for (const routerCase of requiredRouterCases) {
    if (!routerContent.includes(routerCase)) {
      failures.push(`renderV35PreviewStep must include ${routerCase}`);
    }
  }
}

for (const check of requiredSaveKeyChecks) {
  if (!existsSync(check.file)) {
    continue;
  }

  const content = readFileSync(check.file, 'utf8');
  if (!content.includes(check.key)) {
    failures.push(`${check.file} must save ${check.key}`);
  }
}

for (const check of forbiddenTextChecks) {
  if (!existsSync(check.file)) {
    continue;
  }

  const content = readFileSync(check.file, 'utf8');
  if (content.includes(check.text)) {
    failures.push(check.message);
  }
}

if (failures.length > 0) {
  console.error('v35 static smoke check failed.');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('v35 static smoke check passed.');
