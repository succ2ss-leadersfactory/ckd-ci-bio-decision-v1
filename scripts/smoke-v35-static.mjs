import { readFileSync, existsSync } from 'node:fs';

const requiredFiles = [
  'journey.html',
  'journey-v35-preview.html',
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
    file: 'src/journey-v35-app-preview.tsx',
    text: 'FullFlowJourneyV35App',
    message: 'journey-v35-app-preview.tsx must render FullFlowJourneyV35App.',
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

if (failures.length > 0) {
  console.error('v35 static smoke check failed.');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('v35 static smoke check passed.');
