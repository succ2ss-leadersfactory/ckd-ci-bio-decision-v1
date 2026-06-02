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
  'AI 1차 활용: 실행 Data 관찰 질문 만들기',
  '참여자 1차 결과물: 팀원 실행 신호 메모 초안',
  'AI 2차 활용: 초안을 팀원 실행 신호 메모로 다듬기',
  '최종 결과물: 팀원 실행 신호 메모',
  'AI 관찰 질문 프롬프트 복사',
  'AI 메모 다듬기 프롬프트 복사',
  '팀원 실행 신호 메모 완성본',
  '고객 유형 A',
  '고객 유형 F',
  '교육용 가상 고객 묶음',
  '전체 고객 유형 한눈에 보기',
  '고객 유형 A~F, 먼저 이렇게 읽어보세요',
  'Data 해석 도우미',
  '핵심 기회 신호',
  '핵심 우려 신호',
  '추가 확인 정보',
  '1차 판단 메모',
  '도우미 문장 가져오기',
  '기회성 Data',
  '반응성 Data',
  '실행 가능성 Data',
  '리스크 Data',
  '긍정 신호',
  '판단 유보',
  '주의 신호',
  '보완 필요',
  '전략 설계 기준',
  '적극 집중',
  '조건부 집중',
  '속도 조절',
  '관찰/유지',
  '정보 보완',
  '접근 강도 축소',
  '고객 유형별 전략 설계',
  '2주 대응 전략',
  '팀원 배정 방향',
  '주의할 리스크',
  '6개 고객 유형 대응 전략 요약',
  'AI로 고객 유형별 대응 전략 점검',
  'AI는 고객 유형별 대응 전략의 정답을 정하지 않습니다.',
  '복사용 AI 전략 점검 프롬프트',
  'AI 전략 점검 프롬프트 복사',
  '전체 전략 포트폴리오 균형 점검',
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
