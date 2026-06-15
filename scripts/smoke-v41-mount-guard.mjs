import fs from 'node:fs';
import path from 'node:path';

const appFile = path.join(process.cwd(), 'src/journey-v41-app-preview.tsx');

if (!fs.existsSync(appFile)) {
  throw new Error('Missing v41 app preview file');
}

const content = fs.readFileSync(appFile, 'utf8');

const requiredMarkers = [
  "typeof document !== 'undefined'",
  "document.getElementById('root')",
  'createRoot(rootElement).render(<V41AppPreview />)',
];

for (const marker of requiredMarkers) {
  if (!content.includes(marker)) {
    throw new Error(`v41 app mount guard missing marker: ${marker}`);
  }
}

console.log('v41 app mount guard smoke passed');
