import { spawn } from 'node:child_process';

const HOST = '127.0.0.1';
const PORT = 41739;
const ROUTE = '/journey-v39-preview.html';
const BASE_URL = `http://${HOST}:${PORT}`;
const TARGET_URL = `${BASE_URL}${ROUTE}`;
const EXPECTED_TITLE = 'C1바이오 영업팀장 AI 리더십 Lab Journey';
const EXPECTED_ROOT = 'id="journey-root"';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForRoute(timeoutMs = 20000) {
  const startedAt = Date.now();
  let lastError = '';

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(TARGET_URL, { redirect: 'manual' });
      const text = await response.text();
      const hasExpectedTitle = text.includes(EXPECTED_TITLE);
      const hasJourneyRoot = text.includes(EXPECTED_ROOT);
      const hasAppAsset = text.includes('/assets/') || text.includes('/src/journey-v39-app-preview.tsx');

      if (response.status === 200 && hasExpectedTitle && hasJourneyRoot && hasAppAsset) {
        return { status: response.status, text };
      }
      lastError = `status=${response.status}, title=${hasExpectedTitle}, root=${hasJourneyRoot}, asset=${hasAppAsset}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await wait(500);
  }

  throw new Error(`v39 local preview route did not become ready: ${lastError}`);
}

function startPreviewServer() {
  const child = spawn('npx', ['vite', 'preview', '--host', HOST, '--port', String(PORT), '--strictPort'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: process.platform === 'win32',
  });

  child.stdout.on('data', (chunk) => process.stdout.write(`[vite-preview] ${chunk}`));
  child.stderr.on('data', (chunk) => process.stderr.write(`[vite-preview] ${chunk}`));

  return child;
}

async function main() {
  const preview = startPreviewServer();
  let exitCode = 0;

  try {
    await waitForRoute();
    console.log(`v39 local preview smoke passed: ${TARGET_URL}`);
  } catch (error) {
    exitCode = 1;
    console.error(error instanceof Error ? error.message : error);
  } finally {
    preview.kill('SIGTERM');
    await wait(300);
    if (!preview.killed) preview.kill('SIGKILL');
  }

  process.exit(exitCode);
}

main();
