import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`Missing QA document: ${relativePath}`);
    return '';
  }
  return fs.readFileSync(absolutePath, 'utf8');
}

function mustInclude(source, marker, label) {
  if (!source.includes(marker)) failures.push(`Missing ${label}: ${marker}`);
}

const docs = {
  checklist: read('docs/v39-preview-qa-checklist.md'),
  readiness: read('docs/v39-preview-readiness-report.md'),
  run: read('docs/v39-preview-manual-qa-run.md'),
  guide: read('docs/v39-preview-manual-qa-execution-guide.md'),
};

for (const marker of ['# v39 Preview QA Checklist', 'End-to-End QA', 'Go / No-Go']) {
  mustInclude(docs.checklist, marker, 'QA checklist marker');
}

for (const marker of ['# v39 Preview Readiness Report', 'Conditional Go', 'Go / No-Go 기준']) {
  mustInclude(docs.readiness, marker, 'readiness report marker');
}

for (const marker of ['# v39 Preview Manual QA Run', 'Pending Manual QA', 'End-to-End 저장·연결 QA']) {
  mustInclude(docs.run, marker, 'manual QA run marker');
}

for (const marker of ['# v39 Preview Manual QA Execution Guide', '브라우저 QA 준비', '최소 End-to-End QA 절차', 'Go / No-Go 판단 기준']) {
  mustInclude(docs.guide, marker, 'manual QA execution guide marker');
}

if (failures.length > 0) {
  console.error('v39 QA docs audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  throw new Error(`v39 QA docs audit failed: ${failures.length} issue(s)`);
}

console.log('v39 QA docs audit passed');
