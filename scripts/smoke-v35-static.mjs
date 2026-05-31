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
  {
    file: 'src/journey-v35-preview-config.ts',
    text: 'c1bio_v35_preview_step',
    message: 'v35 preview config must define preview-specific step storage key.',
  },
  {
    file: 'src/journey-v35-preview-config.ts',
    text: 'c1bio_v35_preview_state',
    message: 'v35 preview config must define preview-specific state storage key.',
  },
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
