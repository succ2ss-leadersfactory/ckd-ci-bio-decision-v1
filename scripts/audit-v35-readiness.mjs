import { existsSync, readFileSync } from 'node:fs';

const RESULT_DOC = 'docs/v35-preview-smoke-result.md';
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

function assertNoPendingTableStatus(content) {
  const pendingTableRows = content
    .split('\n')
    .filter((line) => /^\|/.test(line))
    .filter((line) => /\|\s*(미확인|대기|실행 대기|보류|실패)\s*\|/.test(line));

  if (pendingTableRows.length > 0) {
    fail(`Smoke result still contains pending or failed table rows (${pendingTableRows.length}).`);
    for (const row of pendingTableRows.slice(0, 10)) {
      warn(`Pending row: ${row}`);
    }
    if (pendingTableRows.length > 10) {
      warn(`...and ${pendingTableRows.length - 10} more pending rows.`);
    }
  }
}

function assertFinalJudgement(content) {
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

function assertRequiredEvidence(content) {
  const requiredEvidence = [
    'npm run smoke:v35',
    'npm run smoke:v35:dist',
    'npm run smoke:v35:remote',
    '/journey.html',
    '/journey-v35-preview.html',
    'J01-entry',
    'J09-presentation-checklist',
    'c1bio_v35_preview_*',
    'c1bio_flow_*',
  ];

  for (const evidence of requiredEvidence) {
    if (!content.includes(evidence)) {
      warn(`Smoke result should mention evidence: ${evidence}`);
    }
  }
}

function assertNoKnownBlockingText(content) {
  const blockingPatterns = [
    /전체 판정:\s*실행 검증 대기/,
    /v35 운영 전환 가능 여부:\s*아직 불가/,
    /remote smoke 검증:\s*실행 대기/,
    /build smoke 검증:\s*실행 대기/,
    /dist smoke 검증:\s*실행 대기/,
  ];

  for (const pattern of blockingPatterns) {
    if (pattern.test(content)) {
      fail(`Smoke result still contains blocking text matching ${pattern}.`);
    }
  }
}

console.log('Running v35 readiness audit...');

const content = readText(RESULT_DOC);
assertNoPendingTableStatus(content);
assertFinalJudgement(content);
assertRequiredEvidence(content);
assertNoKnownBlockingText(content);

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
