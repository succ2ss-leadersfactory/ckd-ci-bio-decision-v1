import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const failures = [];

function fail(message) {
  failures.push(message);
}

function readText(file) {
  if (!existsSync(file)) {
    fail(`Missing required build output: ${file}`);
    return null;
  }

  return readFileSync(file, 'utf8');
}

function assertBuiltHtml(file, devEntry) {
  const html = readText(file);
  if (html === null) {
    return;
  }

  if (html.includes(devEntry)) {
    fail(`${file} must not reference dev source entry ${devEntry} after Vite build.`);
  }

  if (!/<script\b(?=[^>]*\btype=["']module["'])(?=[^>]*\bsrc=["'][^"']*\/assets\/[^"']+\.js["'])[^>]*>/s.test(html)) {
    fail(`${file} must include a built module script under /assets/.`);
  }
}

if (!existsSync('dist')) {
  fail('Missing dist directory. Run npm run build before npm run smoke:v35:dist.');
} else {
  const assetDir = join('dist', 'assets');
  if (!existsSync(assetDir)) {
    fail('Missing dist/assets directory after Vite build.');
  } else {
    const assets = readdirSync(assetDir);
    if (!assets.some((asset) => asset.endsWith('.js'))) {
      fail('dist/assets must include at least one built JavaScript asset.');
    }
  }
}

assertBuiltHtml('dist/journey.html', '/src/journey-active.tsx');
assertBuiltHtml('dist/journey-v35-preview.html', '/src/journey-v35-app-preview.tsx');

if (failures.length > 0) {
  console.error('v35 dist smoke check failed.');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('v35 dist smoke check passed.');
