import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const DEFAULT_BASE_URL = 'https://ckd-ci-bio-decision-v1.vercel.app';
const baseUrl = (process.env.V39_REMOTE_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');
const maxAttempts = Number.parseInt(process.env.V39_REMOTE_MAX_ATTEMPTS || '5', 10);
const retryDelayMs = Number.parseInt(process.env.V39_REMOTE_RETRY_DELAY_MS || '5000', 10);
const requestTimeoutMs = Number.parseInt(process.env.V39_REMOTE_TIMEOUT_MS || '15000', 10);
const reportPath = process.env.V39_REMOTE_REPORT_PATH || '';

const routeChecks = [
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
    forbiddenText: ['/src/journey-active.tsx', '/src/journey-v39-app-preview.tsx'],
  },
  {
    path: '/journey-v39-preview.html',
    name: 'v39 preview page',
    requireHtml: true,
    forbiddenText: ['/src/journey-v39-app-preview.tsx'],
    requiredHtmlText: ['journey-root', '<title>C1바이오 영업팀장 AI 리더십 Lab Journey</title>'],
    requireAssetMarkers: true,
  },
];

const requiredV39AssetMarkers = [
  'V39CustomerJudgmentUxLab',
  '고객의 무엇을 확인할 것인가',
  '고객 Data 증거 카드',
  '고객군별 2주 대응 방향',
  'AI 결과 1차 분리 정리',
  '팀원별 실행 보완 Map',
  '팀원 온도차와 실행 대화',
  'AI 실행계획',
  '컴플라이언스',
  '최종 실행 카드',
  '판단 근거·보완 지점·토의거리',
];

const forbiddenV39AssetMarkers = [
  'CRM 기록',
  'CRM Data',
  'CRM 분석',
  'CRM상 고객 등급',
  'CRM 기록 품질',
  '고객 순위표',
  '처방 가능성',
  '전환 가능성',
  '집중 공략',
  '비교 우위 단정',
  '미승인 효능',
];

const failures = [];
const routeResults = [];

function fail(message) {
  failures.push(message);
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function buildUrl(path) {
  if (/^https?:\/\//.test(path)) return path;
  if (path.startsWith('/')) return `${baseUrl}${path}`;
  return `${baseUrl}/${path}`;
}

function resolveAssetUrl(assetPath) {
  return new URL(assetPath, `${baseUrl}/journey-v39-preview.html`).toString();
}

async function fetchWithTimeout(url, accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8') {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    return await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'c1bio-v39-remote-smoke/1.0',
        accept,
        'cache-control': 'no-cache',
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchWithRetry(url, checkName, accept) {
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      console.log(`[${checkName}] attempt ${attempt}/${maxAttempts}: ${url}`);
      const response = await fetchWithTimeout(url, accept);
      console.log(`[${checkName}] attempt ${attempt}/${maxAttempts}: HTTP ${response.status}, final URL ${response.url}`);
      return response;
    } catch (error) {
      lastError = error;
      console.warn(`[${checkName}] attempt ${attempt}/${maxAttempts} failed: ${error instanceof Error ? error.message : String(error)}`);
      if (attempt < maxAttempts) await sleep(retryDelayMs);
    }
  }

  throw lastError ?? new Error(`Failed to fetch ${url}`);
}

function extractModuleScriptUrls(html) {
  const urls = [];
  const scriptRegex = /<script\b(?=[^>]*\btype=["']module["'])(?=[^>]*\bsrc=["']([^"']+)["'])[^>]*>/gs;
  let match;
  while ((match = scriptRegex.exec(html))) {
    urls.push(match[1]);
  }
  return urls;
}

function extractImportedAssetUrls(jsText) {
  const urls = new Set();
  const importRegex = /(?:import\(|from\s*)["']([^"']*\/assets\/[^"']+\.js)["']/g;
  let match;
  while ((match = importRegex.exec(jsText))) {
    urls.add(match[1]);
  }
  return [...urls];
}

async function fetchAssetGraph(initialAssetUrls) {
  const visited = new Set();
  const queue = initialAssetUrls.map(resolveAssetUrl);
  const chunks = [];

  while (queue.length > 0) {
    const assetUrl = queue.shift();
    if (!assetUrl || visited.has(assetUrl)) continue;
    visited.add(assetUrl);

    let response;
    try {
      response = await fetchWithRetry(assetUrl, 'asset graph', 'application/javascript,text/javascript,*/*');
    } catch (error) {
      fail(`asset graph: failed to fetch ${assetUrl}. ${error instanceof Error ? error.message : String(error)}`);
      continue;
    }

    if (!response.ok) {
      fail(`asset graph: expected HTTP 2xx for ${assetUrl}, got ${response.status}.`);
      continue;
    }

    const text = await response.text();
    chunks.push({ url: assetUrl, text });

    for (const child of extractImportedAssetUrls(text)) {
      queue.push(new URL(child, assetUrl).toString());
    }
  }

  return chunks;
}

async function runRouteCheck(check) {
  const url = buildUrl(check.path);
  const result = {
    name: check.name,
    path: check.path,
    url,
    ok: false,
    status: null,
    finalUrl: null,
    finalPath: null,
    contentType: null,
    moduleScriptCount: 0,
    assetChunkCount: 0,
    missingHtmlText: [],
    forbiddenHtmlTextFound: [],
    missingAssetMarkers: [],
    forbiddenAssetMarkersFound: [],
    errors: [],
  };
  routeResults.push(result);

  let response;

  try {
    response = await fetchWithRetry(url, check.name);
  } catch (error) {
    const message = `${check.name}: failed to fetch ${url} after ${maxAttempts} attempts. ${error instanceof Error ? error.message : String(error)}`;
    result.errors.push(message);
    fail(message);
    return;
  }

  result.status = response.status;
  result.finalUrl = response.url;
  result.finalPath = new URL(response.url).pathname;

  if (!response.ok) {
    const message = `${check.name}: expected HTTP 2xx for ${url}, got ${response.status}.`;
    result.errors.push(message);
    fail(message);
    return;
  }

  const finalUrl = new URL(response.url);
  if (check.expectedFinalPath && finalUrl.pathname !== check.expectedFinalPath) {
    const message = `${check.name}: expected final path ${check.expectedFinalPath}, got ${finalUrl.pathname}.`;
    result.errors.push(message);
    fail(message);
  }

  const contentType = response.headers.get('content-type') || '';
  result.contentType = contentType;
  if (check.requireHtml && !contentType.includes('text/html')) {
    const message = `${check.name}: expected text/html content-type, got ${contentType || 'empty content-type'}.`;
    result.errors.push(message);
    fail(message);
  }

  const html = await response.text();
  const moduleScriptUrls = extractModuleScriptUrls(html);
  result.moduleScriptCount = moduleScriptUrls.length;

  if (check.requireHtml && moduleScriptUrls.length === 0) {
    const message = `${check.name}: expected built /assets/*.js module script in ${check.path}.`;
    result.errors.push(message);
    fail(message);
  }

  for (const requiredText of check.requiredHtmlText || []) {
    if (!html.includes(requiredText)) {
      result.missingHtmlText.push(requiredText);
      fail(`${check.name}: expected HTML to include ${requiredText}.`);
    }
  }

  for (const forbiddenText of check.forbiddenText || []) {
    if (html.includes(forbiddenText)) {
      result.forbiddenHtmlTextFound.push(forbiddenText);
      fail(`${check.name}: production HTML must not reference dev source entry ${forbiddenText}.`);
    }
  }

  if (check.requireAssetMarkers) {
    if (moduleScriptUrls.length === 0) {
      const message = `${check.name}: no module script URLs found.`;
      result.errors.push(message);
      fail(message);
      return;
    }

    const chunks = await fetchAssetGraph(moduleScriptUrls);
    const joinedAssets = chunks.map((chunk) => chunk.text).join('\n');
    result.assetChunkCount = chunks.length;
    console.log(`${check.name}: fetched ${chunks.length} asset chunk(s).`);

    for (const marker of requiredV39AssetMarkers) {
      if (!joinedAssets.includes(marker)) {
        result.missingAssetMarkers.push(marker);
        fail(`${check.name}: expected v39 asset marker not found: ${marker}`);
      }
    }

    for (const marker of forbiddenV39AssetMarkers) {
      if (joinedAssets.includes(marker)) {
        result.forbiddenAssetMarkersFound.push(marker);
        fail(`${check.name}: forbidden v39 asset marker found: ${marker}`);
      }
    }
  }

  result.ok = result.errors.length === 0 && result.missingHtmlText.length === 0 && result.forbiddenHtmlTextFound.length === 0 && result.missingAssetMarkers.length === 0 && result.forbiddenAssetMarkersFound.length === 0;
}

async function writeReport(pass) {
  if (!reportPath) return;
  const report = {
    schemaVersion: 1,
    checkedAt: new Date().toISOString(),
    baseUrl,
    maxAttempts,
    retryDelayMs,
    requestTimeoutMs,
    pass,
    failures,
    requiredV39AssetMarkers,
    forbiddenV39AssetMarkers,
    routeResults,
  };
  await mkdir(dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(`v39 remote smoke JSON report written to ${reportPath}`);
}

console.log(`Running v39 remote smoke checks against ${baseUrl}`);
console.log(`Retry policy: maxAttempts=${maxAttempts}, retryDelayMs=${retryDelayMs}, requestTimeoutMs=${requestTimeoutMs}`);

for (const check of routeChecks) {
  await runRouteCheck(check);
}

const pass = failures.length === 0;
await writeReport(pass);

if (!pass) {
  console.error('v39 remote smoke check failed.');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('v39 remote smoke check passed.');
