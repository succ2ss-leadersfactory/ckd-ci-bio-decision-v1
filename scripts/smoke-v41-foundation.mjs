import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const checks = [
  {
    file: 'journey-v41-preview.html',
    includes: [
      'C1 Bio Journey v41 Preview',
      'id="root"',
      'v41 preview · CI smoke verified',
      '/src/journey-v41-app-preview.tsx?v=v41-ci-0b553346',
    ],
    excludes: [
      'journey-v39-app-preview',
      'journey-v40-vnext-app-preview',
    ],
  },
  {
    file: 'vite.config.ts',
    includes: [
      'journeyV41Preview',
      "resolve(__dirname, 'journey-v41-preview.html')",
    ],
  },
  {
    file: 'src/journey-v41-preview-config.ts',
    includes: [
      'V41_PREVIEW_ROUTE',
      'V41_VISIBLE_APP_STEPS',
      'V41_VISIBLE_STEP_LABELS',
      'ckd.v41.participant.v1',
      'ckd.v41.progress.v1',
      'ckd.v41.taskExecutionBridge.v1',
      'ckd.v41.peopleSelection.v1',
      'ckd.v41.oneOnOnePractice.v1',
    ],
  },
  {
    file: 'src/journey-v41-task-execution-bridge-lab.tsx',
    includes: [
      'V41TaskExecutionBridgeLab',
      'V41TaskExecutionStage',
      'V41TaskExecutionSnapshot',
      'buildV41TaskExecutionSnapshot',
      'ckd.v41.taskExecutionBridge.v1',
      'savedAt',
      '업무관리 실행계획 만들기',
      '할 일·줄일 일',
      '업무 경계 나누기',
    ],
    excludes: [
      'journey-v39',
      'journey-v40',
    ],
  },
  {
    file: 'src/journey-v41-people-selection-lab.tsx',
    includes: [
      'V41PeopleSelectionLab',
      'selectV41OneOnOneCandidate',
      'ckd.v41.peopleSelection.v1',
      '1on1 대상 고르기',
    ],
    excludes: [
      'journey-v39',
      'journey-v40',
    ],
  },
  {
    file: 'src/journey-v41-one-on-one-practice-lab.tsx',
    includes: [
      'V41OneOnOnePracticeLab',
      'V41OneOnOneSnapshot',
      'buildV41OneOnOneScript',
      'buildV41OneOnOneSnapshot',
      'ckd.v41.oneOnOnePractice.v1',
      'savedAt',
      '1on1 첫 문장',
    ],
    excludes: [
      'journey-v39',
      'journey-v40',
    ],
  },
  {
    file: 'src/journey-v41-app-preview.tsx',
    includes: [
      "import './index.css';",
      'V41AppPreview',
      'JourneyShell',
      'useStored',
      'V41FlowStrip',
      'V41StepHero',
      'V41TaskExecutionBridgeLab',
      'V41PeopleSelectionLab',
      'V41OneOnOnePracticeLab',
      'V41_TASK_EXECUTION_STORAGE_KEY',
      'V41_ONE_ON_ONE_STORAGE_KEY',
      'V41_PREVIEW_ROUTE',
      'V41_VISIBLE_APP_STEPS',
    ],
    excludes: [
      'journey-v39',
      'journey-v40',
    ],
  },
  {
    file: 'src/journey-v41-ux-components.tsx',
    includes: [
      'V41FlowStrip',
      'V41StepHero',
      'V41StepNavigationProvider',
      'ckd.v41.participant.v1',
      "typeof window !== 'undefined'",
    ],
    excludes: [
      'journey-v39',
      'journey-v40',
    ],
  },
  {
    file: 'src/journey-storage.ts',
    includes: [
      'removeStoredPrefix',
      'getLocalStorage',
      'useStored',
    ],
  },
  {
    file: 'tsconfig.v41-smoke.json',
    includes: [
      'src/journey-v41-*.tsx',
      'src/journey-v41-*.ts',
    ],
  },
];

const protectedFiles = [
  'journey.html',
  'ckd-ai-lab.html',
  'journey-v39-preview.html',
  'journey-v40-vnext-preview.html',
  'src/journey-v39-app-preview.tsx',
  'src/journey-v40-vnext-app-preview.tsx',
];

function readRequiredFile(file) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing required file: ${file}`);
  }
  return fs.readFileSync(fullPath, 'utf8');
}

for (const check of checks) {
  const content = readRequiredFile(check.file);
  for (const marker of check.includes ?? []) {
    if (!content.includes(marker)) {
      throw new Error(`${check.file} is missing required marker: ${marker}`);
    }
  }
  for (const marker of check.excludes ?? []) {
    if (content.includes(marker)) {
      throw new Error(`${check.file} must not include forbidden marker: ${marker}`);
    }
  }
}

for (const file of protectedFiles) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) continue;
  const content = fs.readFileSync(fullPath, 'utf8');
  if (content.includes('journey-v41-app-preview') || content.includes('V41AppPreview')) {
    throw new Error(`Protected file contains v41 preview markers: ${file}`);
  }
}

console.log('v41 foundation static smoke passed');
