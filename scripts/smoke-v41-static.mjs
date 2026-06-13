import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];

function read(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    failures.push(`Missing required file: ${relativePath}`);
    return '';
  }
  return fs.readFileSync(fullPath, 'utf8');
}

function mustInclude(source, marker, label) {
  if (!source.includes(marker)) failures.push(`Missing ${label}: ${marker}`);
}

function mustNotInclude(source, marker, label) {
  if (source.includes(marker)) failures.push(`Unexpected ${label}: ${marker}`);
}

const files = {
  html: read('journey-v41-preview.html'),
  app: read('src/journey-v41-app-preview.tsx'),
  tsconfig: read('tsconfig.v41-smoke.json'),
  packageJson: read('package.json'),
  pilotEntry: read('ckd-ai-lab.html'),
  v40Html: read('journey-v40-vnext-preview.html'),
};

for (const marker of [
  '<title>C1바이오 영업팀장 AI 리더십 Lab Journey v41 Preview</title>',
  '<div id="journey-root"></div>',
  '/src/journey-v41-app-preview.tsx',
  'v41 isolated preview route',
  'pilot URLs preserved',
]) mustInclude(files.html, marker, 'v41 html');

for (const marker of [
  'V41PreviewApp',
  'journey-v41-preview.html',
  'v40-vNext parity scaffold',
  "import './journey-v40-vnext-app-preview'",
  'existing pilot URLs preserved',
]) mustInclude(files.app, marker, 'v41 preview app');

for (const marker of [
  'src/journey-v41-app-preview.tsx',
  'src/journey-v40-vnext-app-preview.tsx',
]) mustInclude(files.tsconfig, marker, 'v41 tsconfig');

for (const marker of [
  'typecheck:v41',
  'smoke:v41:static',
  'smoke:v41',
]) mustInclude(files.packageJson, marker, 'v41 package scripts');

for (const marker of [
  'journey-v41-preview.html',
  'journey-v41-app-preview.tsx',
  'v41 isolated preview route',
]) {
  mustNotInclude(files.pilotEntry, marker, 'existing pilot entry route');
  mustNotInclude(files.v40Html, marker, 'existing v40 preview route');
}

for (const marker of [
  'journey-v40-vnext-preview.html',
  '/src/journey-v40-vnext-app-preview.tsx',
]) mustInclude(files.v40Html, marker, 'existing v40 preview route remains intact');

if (failures.length > 0) {
  console.error('v41 static smoke failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('v41 static smoke passed.');
