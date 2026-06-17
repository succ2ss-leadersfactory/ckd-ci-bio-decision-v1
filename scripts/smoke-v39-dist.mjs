import { existsSync, readFileSync } from 'node:fs';

const failures = [];

function fail(message) {
  failures.push(message);
}

function readText(file) {
  if (!existsSync(file)) {
    fail(`Missing required dist file: ${file}`);
    return '';
  }
  return readFileSync(file, 'utf8');
}

const distHtml = readText('dist/journey-v39-preview.html');
const journeyHtml = readText('dist/journey.html');
const v38Html = readText('dist/journey-v38-preview.html');

if (!distHtml.includes('journey-root')) {
  fail('dist/journey-v39-preview.html must include #journey-root.');
}

if (!distHtml.includes('<title>C1바이오 영업팀장 AI 리더십 Lab Journey</title>')) {
  fail('dist/journey-v39-preview.html must include the client-facing title.');
}

if (!distHtml.includes('.js')) {
  fail('dist/journey-v39-preview.html must include a bundled module script.');
}

if (journeyHtml.includes('journey-v39-app-preview')) {
  fail('dist/journey.html must not load the v39 preview entry.');
}

if (v38Html.includes('journey-v39-app-preview')) {
  fail('dist/journey-v38-preview.html must not load the v39 preview entry.');
}

if (failures.length > 0) {
  console.error('v39 dist smoke failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('v39 dist smoke passed.');
