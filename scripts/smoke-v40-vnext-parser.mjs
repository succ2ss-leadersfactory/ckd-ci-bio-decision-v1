import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

const root = process.cwd();
const parserPath = path.join(root, 'src/journey-v40-vnext-pharma-research-parser.ts');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertIncludes(value, expected, message) {
  assert(String(value ?? '').includes(expected), `${message}\nExpected to include: ${expected}\nActual: ${value}`);
}

if (!fs.existsSync(parserPath)) {
  throw new Error(`Missing parser file: ${parserPath}`);
}

const source = fs.readFileSync(parserPath, 'utf8');
const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2020,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'v40-vnext-parser-'));
const tempModulePath = path.join(tempDir, 'parser.mjs');
fs.writeFileSync(tempModulePath, transpiled, 'utf8');

const { extractUrls, parseNotebookAnswer } = await import(pathToFileURL(tempModulePath).href);

const urls = extractUrls(`
[자료 1]
- URL: https://example.com/report.pdf,
[자료 2]
- URL: https://example.org/page)
[자료 3]
- URL: https://example.com/report.pdf
`);

assert(urls.length === 2, `Expected 2 unique URLs, got ${urls.length}: ${urls.join(', ')}`);
assert(urls[0] === 'https://example.com/report.pdf', 'Expected trailing comma to be removed from first URL');
assert(urls[1] === 'https://example.org/page', 'Expected trailing parenthesis to be removed from second URL');

const parsed = parseNotebookAnswer(`
#### [영업팀 추진 과제 1]
환자 여정 기반 고객 접점 질문을 정리한다.

## 영업팀 추진 과제 2:
디지털 채널 반응을 다음 방문 대화의 단서로 활용한다.

### 추진과제 3
실사용 근거 기반 학술 가치 전달 기준을 만든다.

[우리 팀 실행 영향]
방문 횟수 중심 관리에서 고객 반응 기반 실행관리로 바뀐다.

2주 실행관리 질문:
지난 2주간 고객 반응 데이터에서 다음 대화 단서를 찾았는가?

KPI 후보
디지털 반응 확인률
후속 질문 기록률

주의해야 할 표현:
처방량 증가를 직접 암시하지 않는다.
경쟁사 솔루션을 비방하지 않는다.
`);

assertIncludes(parsed.issueOne, '환자 여정 기반 고객 접점 질문', 'issueOne parsing failed');
assertIncludes(parsed.issueTwo, '디지털 채널 반응', 'issueTwo parsing failed');
assertIncludes(parsed.issueThree, '실사용 근거 기반', 'issueThree parsing failed');
assertIncludes(parsed.teamImpact, '방문 횟수 중심 관리', 'teamImpact parsing failed');
assertIncludes(parsed.metricQuestions, '[2주 실행관리 질문]', 'metricQuestions should include question heading');
assertIncludes(parsed.metricQuestions, '지난 2주간 고객 반응 데이터', 'questions parsing failed');
assertIncludes(parsed.metricQuestions, '[KPI 후보]', 'metricQuestions should include KPI heading');
assertIncludes(parsed.metricQuestions, '디지털 반응 확인률', 'KPI parsing failed');
assertIncludes(parsed.caution, '처방량 증가', 'caution parsing failed');
assertIncludes(parsed.caution, '경쟁사 솔루션', 'caution second line parsing failed');

console.log('v40-vNext NotebookLM parser smoke passed.');
