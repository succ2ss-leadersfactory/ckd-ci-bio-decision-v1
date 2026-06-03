import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`Missing required file: ${relativePath}`);
    return '';
  }
  return fs.readFileSync(absolutePath, 'utf8');
}

function checkIncludes(source, needle, label) {
  if (!source.includes(needle)) failures.push(`Missing ${label}: ${needle}`);
}

function checkNotIncludes(source, needle, label) {
  if (source.includes(needle)) failures.push(`Unexpected ${label}: ${needle}`);
}

const files = {
  html: read('journey-v39-preview.html'),
  app: read('src/journey-v39-app-preview.tsx'),
  store: read('src/journey-v39-dashboard-result-store.ts'),
  viteConfig: read('vite.config.ts'),
  packageJson: read('package.json'),
  tsconfig: read('tsconfig.v39-smoke.json'),
};

checkIncludes(files.html, '/src/journey-v39-app-preview.tsx', 'v39 HTML entry script');
checkIncludes(files.html, '<title>C1바이오 영업팀장 AI 리더십 Lab Journey</title>', 'v39 client-facing HTML title');
checkIncludes(files.app, "import './journey-v38-app-preview';", 'v39 safe wrapper import');
checkIncludes(files.app, 'v39 preview starts as a safe wrapper', 'v39 wrapper comment');
checkIncludes(files.viteConfig, 'journeyV39Preview', 'vite v39 input key');
checkIncludes(files.viteConfig, 'journey-v39-preview.html', 'vite v39 HTML input');
checkIncludes(files.packageJson, 'smoke:v39', 'package v39 smoke script');
checkIncludes(files.packageJson, 'typecheck:v39', 'package v39 typecheck script');
checkIncludes(files.tsconfig, 'src/journey-v39-app-preview.tsx', 'v39 tsconfig entry');
checkIncludes(files.tsconfig, 'src/journey-v38-app-preview.tsx', 'v39 tsconfig stable wrapper dependency');
checkIncludes(files.tsconfig, 'src/journey-v39-dashboard-result-store.ts', 'v39 tsconfig dashboard result store');

for (const marker of [
  'V39_DASHBOARD_RESULT_SCHEMA_VERSION',
  'V39_DASHBOARD_RESULT_STORAGE_KEY',
  'V39DashboardResult',
  'V39DashboardMetricResult',
  'V39DashboardMetricSelection',
  'V39DashboardMemberResult',
  'createEmptyV39DashboardResult',
  'normalizeV39DashboardResult',
  'saveV39DashboardResult',
  'loadV39DashboardResult',
  'clearV39DashboardResult',
]) {
  checkIncludes(files.store, marker, 'v39 dashboard result store marker');
}

checkNotIncludes(files.html, 'v39 Preview', 'internal v39 preview wording in HTML title');
checkNotIncludes(files.html, 'C1바이오 v39 Preview', 'internal v39 preview title');

if (failures.length > 0) {
  console.error('v39 static smoke failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  throw new Error(`v39 static smoke failed: ${failures.length} issue(s)`);
}

console.log('v39 static smoke passed');
