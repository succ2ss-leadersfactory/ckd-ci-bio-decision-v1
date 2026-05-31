const DEFAULT_BASE_URL = 'https://ckd-ci-bio-decision-v1.vercel.app';
const baseUrl = (process.env.V35_REMOTE_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');
const maxAttempts = Number.parseInt(process.env.V35_REMOTE_MAX_ATTEMPTS || '5', 10);
const retryDelayMs = Number.parseInt(process.env.V35_REMOTE_RETRY_DELAY_MS || '5000', 10);
const requestTimeoutMs = Number.parseInt(process.env.V35_REMOTE_TIMEOUT_MS || '15000', 10);

const checks = [
  {
    path: '/',
    name: 'root redirect',
    requireHtml: true,
    expectedFinalPath: '/journey.html',
  },
  {
    path: '/journey.html',
    name: 'v34 operating journey page',
    requireHtml: true,
    forbiddenText: ['/src/journey-active.tsx'],
  },
  {
    path: '/journey-v35-preview.html',
    name: 'v35 preview page',
    requireHtml: true,
    forbiddenText: ['/src/journey-v35-app-preview.tsx'],
  },
];

const failures = [];

function fail(message) {
  failures.push(message);
}

function buildUrl(path) {
  return `${baseUrl}${path}`;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    return await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'c1bio-v35-remote-smoke/1.1',
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'cache-control': 'no-cache',
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchWithRetry(url, checkName) {
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      console.log(`[${checkName}] attempt ${attempt}/${maxAttempts}: ${url}`);
      const response = await fetchWithTimeout(url);
      console.log(`[${checkName}] attempt ${attempt}/${maxAttempts}: HTTP ${response.status}, final URL ${response.url}`);
      return response;
    } catch (error) {
      lastError = error;
      console.warn(`[${checkName}] attempt ${attempt}/${maxAttempts} failed: ${error instanceof Error ? error.message : String(error)}`);
      if (attempt < maxAttempts) {
        await sleep(retryDelayMs);
      }
    }
  }

  throw lastError ?? new Error(`Failed to fetch ${url}`);
}

async function runCheck(check) {
  const url = buildUrl(check.path);
  let response;

  try {
    response = await fetchWithRetry(url, check.name);
  } catch (error) {
    fail(`${check.name}: failed to fetch ${url} after ${maxAttempts} attempts. ${error instanceof Error ? error.message : String(error)}`);
    return;
  }

  if (!response.ok) {
    fail(`${check.name}: expected HTTP 2xx for ${url}, got ${response.status}.`);
    return;
  }

  const finalUrl = new URL(response.url);
  if (check.expectedFinalPath && finalUrl.pathname !== check.expectedFinalPath) {
    fail(`${check.name}: expected final path ${check.expectedFinalPath}, got ${finalUrl.pathname}.`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (check.requireHtml && !contentType.includes('text/html')) {
    fail(`${check.name}: expected text/html content-type, got ${contentType || 'empty content-type'}.`);
  }

  const html = await response.text();

  if (check.requireHtml && !/<script\b(?=[^>]*\btype=["']module["'])(?=[^>]*\bsrc=["'][^"']*\/assets\/[^"']+\.js["'])[^>]*>/s.test(html)) {
    fail(`${check.name}: expected built /assets/*.js module script in ${check.path}.`);
  }

  for (const forbiddenText of check.forbiddenText || []) {
    if (html.includes(forbiddenText)) {
      fail(`${check.name}: production HTML must not reference dev source entry ${forbiddenText}.`);
    }
  }
}

console.log(`Running v35 remote smoke checks against ${baseUrl}`);
console.log(`Retry policy: maxAttempts=${maxAttempts}, retryDelayMs=${retryDelayMs}, requestTimeoutMs=${requestTimeoutMs}`);

for (const check of checks) {
  await runCheck(check);
}

if (failures.length > 0) {
  console.error('v35 remote smoke check failed.');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('v35 remote smoke check passed.');
