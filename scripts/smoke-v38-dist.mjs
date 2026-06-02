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
  '고객 Data 분석',
  '고객 유형별 대응 전략',
  '팀원별 역할 방향',
  'AI 콜플랜 결과물 요청',
  '컴플라이언스 위험 표현 제거',
  '최종 2주 콜플랜 카드',
  '강사용 토의 질문',
  'v38 진행 초기화',
  '우리 팀 지표로 다음 행동 준비하기',
  '우리 팀 상황은 처음부터 선택되어 있지 않습니다',
  '우리 팀에 가장 가까운 상황을 최대 3개까지 선택하세요',
  '상황 선택',
  '1~3개를 선택하세요',
  '최대 3개 선택 후에는 기존 선택을 해제해야 다른 상황을 선택할 수 있습니다',
  '신입·저연차 팀원이 지시를 이해했는지 확인하기 어렵다',
  'MZ세대 팀원과 소통 방식·일의 의미를 두고 갈등이 있다',
  '팀원이 질문하지 않고 혼자 끙끙대거나 이탈 신호를 보인다',
  'AI 추천 지표 붙여넣기',
  'AI 추천 지표 자동 분리·채우기',
  'AI 추천 지표 분리정리',
  '우리 팀 핵심 실행지표 최종 선택',
  '7명 유형 카드 보기와 우리 팀 유사 유형 2명 선택',
  '아래 7명은 교육용 가상 인물입니다',
  '우리 팀에 실제로 존재하거나 비슷한 행동 신호를 보이는 유형 2명',
  'AI 결과 선택 유형 자동 분리·채우기',
  '선택한 유형별 신호 분리 정리',
  '팀원별 관찰 신호',
  '강점으로 볼 수 있는 신호',
  '우려 또는 확인이 필요한 신호',
  '성급하게 단정하면 안 되는 점',
  '나머지 5명은 전체 맥락을 이해하기 위한 참고 자료로만 사용합니다',
  '팀장 행동 선택',
  '추천 준비물 선택',
  'AI 2차 활용: 선택한 준비물 생성',
  'AI 2차 결과 붙여넣기',
  'AI 2차 결과를 선택 유형별로 채우기',
  'AI가 제안한 준비물 초안',
  '실제 팀원에게 사용할 문장과 행동은 팀장이 수정해 확정하십시오',
  '최종 결과물: 선택 유형별 다음 행동 준비물',
  '최종 유형별 다음 행동 준비물',
  '신재영 대리',
  '이대은 대리',
  '박재욱 사원',
  '유희관 과장',
  '김문호 차장',
  '김재호 차장',
  '문교원 사원',
  '신입·저연차 조직 적응 중',
  '이탈 위험 점검: 주의',
  '지시 이해 확인 질문',
  '일의 의미와 기대 조율 대화',
  '고객 유형 A',
  '고객 유형 F',
  '고객 유형별 전략 설계',
  'AI 전략 점검 프롬프트 복사',
  '7단계 판단을 팀원 역할로 바꾸는 기준',
]) {
  if (!v38BundledJs.includes(text)) {
    fail(`v38 entry bundle must include ${text}.`);
  }
}

for (const forbidden of ['MutationObserver', 'querySelectorAll', 'innerHTML', '김민재 프로', '이서연 프로', '정하늘 프로', '최도윤 프로']) {
  if (v38BundledJs.includes(forbidden)) {
    fail(`v38 entry bundle must not include forbidden marker: ${forbidden}.`);
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
