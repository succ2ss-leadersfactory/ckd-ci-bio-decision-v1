import { existsSync, readFileSync } from 'node:fs';

const RESULT_DOC = 'docs/v35-preview-smoke-result.md';
const BROWSER_QA_DOC = 'docs/v35-browser-qa-result.md';
const CONSOLE_SNIPPET_DOC = 'docs/v35-browser-qa-console-snippet.md';
const BROWSER_QA_RUNBOOK_DOC = 'docs/v35-browser-qa-runbook.md';
const VALIDATION_INDEX_DOC = 'docs/v35-validation-index.md';
const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function readText(file) {
  if (!existsSync(file)) {
    fail(`Missing required file: ${file}`);
    return '';
  }

  return readFileSync(file, 'utf8');
}

function findLine(content, label) {
  return content.split('\n').find((line) => line.includes(label)) || '';
}

function assertNoPendingTableStatus(content, docName) {
  const pendingTableRows = content
    .split('\n')
    .filter((line) => /^\|/.test(line))
    .filter((line) => /\|\s*(미확인|대기|실행 대기|보류|실패|아직 불가)\s*\|/.test(line));

  if (pendingTableRows.length > 0) {
    fail(`${docName} still contains pending or failed table rows (${pendingTableRows.length}).`);
    for (const row of pendingTableRows.slice(0, 10)) {
      warn(`${docName} pending row: ${row}`);
    }
    if (pendingTableRows.length > 10) {
      warn(`${docName}: ...and ${pendingTableRows.length - 10} more pending rows.`);
    }
  }
}

function assertSmokeFinalJudgement(content) {
  const overall = findLine(content, '전체 판정:');
  if (!overall) {
    fail('Smoke result must include 전체 판정.');
  } else if (/(미확인|대기|실행 검증 대기|불가|보류|실패)/.test(overall)) {
    fail(`전체 판정 is not ready: ${overall.trim()}`);
  } else if (!/(통과|PASS|pass|검토 가능|전환 가능)/.test(overall)) {
    warn(`전체 판정 does not clearly say 통과/PASS/검토 가능: ${overall.trim()}`);
  }

  const cutover = findLine(content, 'v35 운영 전환 가능 여부:');
  if (!cutover) {
    fail('Smoke result must include v35 운영 전환 가능 여부.');
  } else if (/(미확인|대기|불가|보류|실패)/.test(cutover)) {
    fail(`v35 운영 전환 가능 여부 is not ready: ${cutover.trim()}`);
  } else if (!/(가능|검토 가능)/.test(cutover)) {
    warn(`v35 운영 전환 가능 여부 does not clearly say 가능/검토 가능: ${cutover.trim()}`);
  }
}

function assertBrowserQaFinalJudgement(content) {
  const requiredLines = [
    ['브라우저 QA 전체 판정:', /(통과|PASS|pass)/],
    ['v34 운영 영향 여부:', /(영향 없음|정상|통과)/],
    ['v35 preview 독립 실행 여부:', /(정상|통과)/],
    ['J01~J09 저장 여부:', /(정상|통과|모두 확인)/],
    ['localStorage key 분리 여부:', /(정상|통과|분리 확인)/],
    ['Console snippet 근거:', /(통과|PASS|pass|확인)/],
    ['cutover 검토 가능 여부:', /(가능|검토 가능)/],
  ];

  for (const [label, readyPattern] of requiredLines) {
    const line = findLine(content, label);
    if (!line) {
      fail(`Browser QA result must include ${label}.`);
      continue;
    }

    if (/(미확인|대기|불가|보류|실패|아직 불가)/.test(line)) {
      fail(`Browser QA result is not ready: ${line.trim()}`);
      continue;
    }

    if (!readyPattern.test(line)) {
      warn(`Browser QA result line does not clearly indicate readiness: ${line.trim()}`);
    }
  }
}

function assertConsoleSnippetEvidence(content) {
  const requiredEvidence = [
    'Console snippet 실행',
    'missingPreviewKeys',
    'missingSavedStateKeys',
    'savedStateKeysFound',
    'v34FlowKeysFound',
    'pass',
  ];

  for (const evidence of requiredEvidence) {
    if (!content.includes(evidence)) {
      fail(`Browser QA result must include console snippet evidence: ${evidence}.`);
    }
  }

  const missingPreviewLine = findLine(content, 'missingPreviewKeys');
  if (!/(none|없음|0)/i.test(missingPreviewLine)) {
    fail(`missingPreviewKeys must be recorded as none/없음/0. Current line: ${missingPreviewLine.trim()}`);
  }

  const missingSavedStateLine = findLine(content, 'missingSavedStateKeys');
  if (!/(none|없음|0)/i.test(missingSavedStateLine)) {
    fail(`missingSavedStateKeys must be recorded as none/없음/0. Current line: ${missingSavedStateLine.trim()}`);
  }

  const passLine = findLine(content, 'pass');
  if (!/(true|통과|PASS|pass)/.test(passLine)) {
    fail(`Console snippet pass must be recorded as true/통과. Current line: ${passLine.trim()}`);
  }
}

function assertRequiredEvidence(content, docName, requiredEvidence) {
  for (const evidence of requiredEvidence) {
    if (!content.includes(evidence)) {
      warn(`${docName} should mention evidence: ${evidence}`);
    }
  }
}

function assertNoKnownBlockingText(content, docName) {
  const blockingPatterns = [
    /전체 판정:\s*실행 검증 대기/,
    /전체 판정:\s*부분 통과/,
    /v35 운영 전환 가능 여부:\s*아직 불가/,
    /remote smoke 검증:\s*실행 대기/,
    /build smoke 검증:\s*실행 대기/,
    /dist smoke 검증:\s*실행 대기/,
    /브라우저 QA 전체 판정:\s*미확인/,
    /Console snippet 근거:\s*미확인/,
    /cutover 검토 가능 여부:\s*아직 불가/,
  ];

  for (const pattern of blockingPatterns) {
    if (pattern.test(content)) {
      fail(`${docName} still contains blocking text matching ${pattern}.`);
    }
  }
}

function assertConsoleSnippetDoc(content) {
  const requiredContent = [
    'requiredPreviewKeys',
    'requiredSavedStateKeys',
    'missingPreviewKeys',
    'missingSavedStateKeys',
    'v34FlowKeysFound',
    'pass',
  ];

  for (const item of requiredContent) {
    if (!content.includes(item)) {
      fail(`${CONSOLE_SNIPPET_DOC} must include ${item}.`);
    }
  }
}

function assertBrowserQaRunbookDoc(content) {
  const requiredContent = [
    '/journey.html',
    '/journey-v35-preview.html',
    'Step 0~8',
    'J01~J09',
    'Console snippet',
    'missingPreviewKeys: none',
    'missingSavedStateKeys: none',
    'pass: true',
    'docs/v35-browser-qa-result.md',
    'docs/v35-preview-smoke-result.md',
    'Actions → v35 Readiness Audit → Run workflow',
  ];

  for (const item of requiredContent) {
    if (!content.includes(item)) {
      fail(`${BROWSER_QA_RUNBOOK_DOC} must include ${item}.`);
    }
  }
}

function assertValidationIndexDoc(content) {
  const requiredContent = [
    'v35 Validation Document Index',
    'docs/v35-smoke-automation-guide.md',
    'docs/v35-deployment-url-guide.md',
    'docs/v35-browser-qa-runbook.md',
    'docs/v35-browser-qa-console-snippet.md',
    'docs/v35-browser-qa-result.md',
    'docs/v35-preview-smoke-result.md',
    'docs/v35-cutover-gates.md',
    'Actions → v35 Smoke → Run workflow',
    'Actions → v35 Remote Smoke → Run workflow',
    'Actions → v35 Readiness Audit → Run workflow',
    'missingPreviewKeys: none',
    'missingSavedStateKeys: none',
    'pass: true',
  ];

  for (const item of requiredContent) {
    if (!content.includes(item)) {
      fail(`${VALIDATION_INDEX_DOC} must include ${item}.`);
    }
  }
}

console.log('Running v35 readiness audit...');

const smokeResult = readText(RESULT_DOC);
const browserQaResult = readText(BROWSER_QA_DOC);
const consoleSnippet = readText(CONSOLE_SNIPPET_DOC);
const browserQaRunbook = readText(BROWSER_QA_RUNBOOK_DOC);
const validationIndex = readText(VALIDATION_INDEX_DOC);

assertNoPendingTableStatus(smokeResult, RESULT_DOC);
assertSmokeFinalJudgement(smokeResult);
assertRequiredEvidence(smokeResult, RESULT_DOC, [
  'npm run smoke:v35',
  'npm run smoke:v35:dist',
  'npm run smoke:v35:remote',
  '/journey.html',
  '/journey-v35-preview.html',
  'J01-entry',
  'J09-presentation-checklist',
  'c1bio_v35_preview_*',
  'c1bio_flow_*',
]);
assertNoKnownBlockingText(smokeResult, RESULT_DOC);

assertNoPendingTableStatus(browserQaResult, BROWSER_QA_DOC);
assertBrowserQaFinalJudgement(browserQaResult);
assertConsoleSnippetEvidence(browserQaResult);
assertRequiredEvidence(browserQaResult, BROWSER_QA_DOC, [
  '/journey.html',
  '/journey-v35-preview.html',
  'J01-entry',
  'J09-presentation-checklist',
  'c1bio_v35_preview_*',
  'c1bio_flow_*',
  'missingPreviewKeys',
  'missingSavedStateKeys',
  'pass',
]);
assertNoKnownBlockingText(browserQaResult, BROWSER_QA_DOC);

assertConsoleSnippetDoc(consoleSnippet);
assertBrowserQaRunbookDoc(browserQaRunbook);
assertValidationIndexDoc(validationIndex);

if (warnings.length > 0) {
  console.warn('v35 readiness audit warnings:');
  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
}

if (failures.length > 0) {
  console.error('v35 readiness audit failed.');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('v35 readiness audit passed. QA result documentation supports cutover review.');
