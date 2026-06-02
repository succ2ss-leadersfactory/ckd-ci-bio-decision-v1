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
  'AI 추천 지표 자동 분리·채우기',
  '자동 분리·채우기는 초안입니다',
  '자동 채우기 후에도 각 입력칸에서 자유롭게 수정할 수 있습니다',
  'AI 추천 확인 질문',
  '우리 팀 지표 정하기',
  'AI 지표 추천 프롬프트 복사',
  'AI 추천 지표 붙여넣기',
  'AI 추천 지표 분리정리',
  'AI 추천 핵심 지표 후보',
  'AI 추천 보완 지표 후보',
  'AI 추천 안전선 지표 후보',
  '우리 팀에 맞는 지표',
  '제외할 지표',
  '추가하고 싶은 지표',
  '우리 팀 핵심 실행지표 최종 선택',
  'AI 추천 지표 분리정리와 기본 안전 지표를 참고',
  '핵심 지표 3개',
  '보완 지표 2개',
  '안전선 지표 1개',
  '지표 선택 이유',
  '선택한 우리 팀 실행지표 기준으로 6명 Data 보기',
  '계획 접점 실행률',
  '고객 인게이지먼트 지수',
  '후속 대화 연결지수',
  'CRM 기록 품질',
  '팀 학습 기여도',
  '컴플라이언스 위험 점검',
  'AI 입력 안전 점검',
  'AI로 6명 Data에서 보이는 신호 정리',
  'AI 결과 붙여넣기',
  'AI 결과 팀원별 자동 분리·채우기',
  '자동 분리된 팀원별 내용은 초안입니다',
  '팀원별 신호 분리 정리',
  '팀장 행동 선택',
  'AI 2차 활용: 선택한 준비물 생성',
  '팀원별 다음 행동 준비물',
  'AI 신호 정리 프롬프트 복사',
  'AI 준비물 생성 프롬프트 복사',
  '팀원별 관찰 신호',
  '강점으로 볼 수 있는 신호',
  '우려 또는 확인이 필요한 신호',
  '추가로 확인해야 할 질문',
  '성급하게 단정하면 안 되는 점',
  '1on1 면담 질문',
  '이번 주 코칭 포인트',
  '실행 점검 기준',
  '강점 활용 역할 제안',
  '우려 신호 확인 질문',
  '팀 회의 공유용 학습 포인트',
  '컴플라이언스 안전선 점검 문장',
  '후속 대화 연결 코칭 질문',
  '방문 후 기록 점검표',
  '고객 질문 연습 스크립트',
  '통제 가능한 실행 변수 찾기 질문',
  '작은 실행 약속 카드',
  '고객 유형 A',
  '고객 유형 F',
  '교육용 가상 고객 묶음',
  'Data 해석 도우미',
  '핵심 기회 신호',
  '핵심 우려 신호',
  '추가 확인 정보',
  '1차 판단 메모',
  '보완 필요',
  '전략 설계 기준',
  '적극 집중',
  '조건부 집중',
  '속도 조절',
  '관찰/유지',
  '정보 보완',
  '접근 강도 축소',
  '고객 유형별 전략 설계',
  'AI 전략 점검 프롬프트 복사',
  '신재영 대리',
  '이대은 대리',
  '박재욱 사원',
  '유희관 과장',
  '김문호 차장',
  '김재호 차장',
  '7단계 판단을 팀원 역할로 바꾸는 기준',
  '선택한 고객군 배정 힌트',
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
