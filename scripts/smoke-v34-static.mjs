import fs from 'node:fs';

const journey = fs.readFileSync('journey.html', 'utf8');
const source = fs.readFileSync('src/full-flow-journey-v34.tsx', 'utf8');

const checks = [
  ['journey.html points to v34', journey.includes('/src/full-flow-journey-v34.tsx')],
  ['v34 title exists', source.includes('C1바이오 Full Flow Journey v34')],
  ['NotebookLM Studio flow exists', source.includes('NotebookLM Studio')],
  ['localStorage step key exists', source.includes('c1bio_flow_step')],
  ['participant storage key exists', source.includes('c1bio_flow_participant')],
  ['state storage key exists', source.includes('c1bio_flow_state')],
  ['Google saveResponse integration exists', source.includes("callGoogle('saveResponse'")],
  ['Live Dashboard route exists', source.includes('/instructor-live.html')],
  ['Wrap-up screen exists', source.includes('Wrap-up')],
  ['Compliance notice exists', source.includes('실제 고객명') && source.includes('제품명')]
];

const failed = checks.filter(([, ok]) => !ok);

for (const [label, ok] of checks) {
  console.log(`${ok ? '✅' : '❌'} ${label}`);
}

if (failed.length) {
  console.error(`\nV34 static smoke failed: ${failed.length} check(s) failed.`);
  process.exit(1);
}

console.log('\nV34 static smoke passed.');
