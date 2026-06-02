import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, normalize } from 'node:path';

const failures = [];

function fail(message) {
  failures.push(message);
}

function readText(file) {
  if (!existsSync(file)) {
    fail(`Missing required dist file: ${file}`);
    return '';
  }
  return readFileSync(file, 'utf8');
}

function listFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  });
}

function extractModuleScriptPaths(html) {
  const matches = [...html.matchAll(/<script\b[^>]*type=["']module["'][^>]*src=["']([^"']+\.js)["'][^>]*>/gs)];
  return matches.map((match) => normalize(join('dist', match[1].replace(/^\//, ''))));
}

const distHtml = readText('dist/journey-v38-preview.html');

if (!distHtml.includes('journey-root')) {
  fail('dist/journey-v38-preview.html must include #journey-root.');
}

if (!distHtml.includes('<title>C1바이오 v38 Preview</title>')) {
  fail('dist/journey-v38-preview.html must include the v38 title.');
}

const v38ScriptPaths = extractModuleScriptPaths(distHtml);
if (v38ScriptPaths.length === 0) {
  fail('dist/journey-v38-preview.html must include a bundled module script.');
}

const distFiles = listFiles('dist');
const assetFiles = distFiles.filter((file) => file.includes('assets'));

if (assetFiles.length === 0) {
  fail('dist/assets must include bundled assets.');
}

const v38BundledJs = v38ScriptPaths.map((file) => readText(file)).join('\n');

for (const text of [
  'C1바이오 영업팀장 AI 리더십 Lab Journey v38',
  '입장·역할 부여',
  'AI 안전선',
  '프롬프트 기본 실습',
  '리서치·전략 해석',
  '팀원 실행진단',
  '고객군 판단',
  '집중/후순위 고객군 선택',
  '팀원별 역할 방향',
  'AI 콜플랜 결과물 요청',
  '컴플라이언스 위험 표현 제거',
  '최종 2주 콜플랜 카드',
  '강사용 토의 질문',
  'v38 진행 초기화',
  '6개 고객군, 먼저 이렇게 읽어보세요',
  '아래 요약은 정답이 아니라 고객군을 읽기 위한 첫 인상입니다.',
  '핵심 특징',
  '강한 신호',
  '판단 질문',
  '반응 상승과 후속 가능성이 뚜렷하게 보이는 고객군입니다.',
  '기회성은 높지만 고객이 아직 결정을 보류하는 고객군입니다.',
  '관계는 안정적이지만 변화 신호는 약한 고객군입니다.',
  '접촉은 많지만 반응이 낮고 피로 신호가 보이는 고객군입니다.',
  '기회 신호가 강하지만 컴플라이언스 안전선 관리가 중요한 고객군입니다.',
  '관계는 있으나 최근 판단 Data가 부족한 고객군입니다.',
  '전체 13개 Data 다시 보기',
  '기회성 Data',
  '반응성 Data',
  '실행 가능성 Data',
  '리스크 Data',
  '긍정 신호',
  '판단 유보',
  '주의 신호',
  '보완 필요',
  '아래 평가는 정답이 아니라 판단을 돕기 위한 해석 힌트입니다.',
  '우선 검토할 가치가 높은 고객군입니다.',
  '방문 자체보다 이후 반응과 후속 행동 여부가 더 중요합니다.',
  '실행은 가능하지만 표현과 자료 활용 안전선을 먼저 확인해야 합니다.',
  '고객 부담과 접촉 피로를 점검합니다.',
  '분류 전에 기록 정리가 필요합니다.',
  '선택 기준 먼저 잡기',
  '선택한 고객군 신호',
  '추천 역할',
  '선택 이유 작성 힌트',
  '고객군을 선택하면 6단계 Data 평가 라벨과 연결된 선택 이유 힌트가 표시됩니다.',
  '집중 고객군으로 볼 때',
  '후순위 고객군으로 볼 때',
  '관찰/유지 고객군으로 볼 때',
  '평가 라벨 조합',
  '긍정 신호가 2개 이상',
  '7단계 판단을 팀원 역할로 바꾸는 기준',
  '집중 고객군 배정 기준',
  '후순위 고객군 배정 기준',
  '관찰/유지 고객군 배정 기준',
  '고객군 우선순위는 팀원 배정으로 이어질 때 실행력이 생깁니다.',
  '강점:',
  '코칭 초점:',
  '선택한 고객군 배정 힌트',
  '우선순위 성격:',
  '배정 방향:',
  '담당 고객군을 선택하면 7단계 우선순위 판단과 연결된 배정 힌트가 표시됩니다.',
  '이 요약은 9단계 AI 콜플랜 결과물 요청에서 팀원별 실행 역할을 설명하는 기준으로 활용합니다.',
]) {
  if (!v38BundledJs.includes(text)) {
    fail(`v38 entry bundle must include ${text}.`);
  }
}

for (const forbidden of ['MutationObserver', 'querySelectorAll', 'innerHTML']) {
  if (v38BundledJs.includes(forbidden)) {
    fail(`v38 entry bundle must not include DOM post-processing marker: ${forbidden}.`);
  }
}

const journeyHtml = readText('dist/journey.html');
if (journeyHtml.includes('journey-v38-app-preview')) {
  fail('dist/journey.html must not load the v38 preview entry.');
}

const v36Html = readText('dist/journey-v36-preview.html');
if (v36Html.includes('journey-v38-app-preview')) {
  fail('dist/journey-v36-preview.html must not load the v38 preview entry.');
}

if (failures.length > 0) {
  console.error('v38 dist smoke failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('v38 dist smoke passed.');
