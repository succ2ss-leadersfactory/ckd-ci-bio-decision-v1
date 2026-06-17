import { V40VNextPharmaStrategyResearchLab } from './journey-v40-vnext-pharma-strategy-research-lab';

const V40_VNEXT_RESEARCH_TRIMMED_MARKERS = [
  'V40VNextResearchStrategyTrimmedLab',
  'V40VNextPharmaStrategyResearchLab',
  '2026년 제약업계 전략 과제 선택',
  '영업팀 추진계획 수립 실습',
  'Perplexity 최신자료 검색 전용 프롬프트',
  'Perplexity 전략 과제 프롬프트',
  '전략 제안이나 실행계획을 만들지 말고',
  'URL이 없는 자료는 제외',
  'Perplexity 출처 URL만 분리',
  'NotebookLM 웹 소스 URL 복사',
  '분리된 웹 소스 URL',
  'NotebookLM 소스 기반 전략 과제 압축',
  'NotebookLM 프롬프트 복사',
  'NotebookLM 분석 질문 복사',
  'NotebookLM 결과 항목별로 정리하기',
  'parseNotebookAnswer',
  'NOTEBOOK_SECTION_ALIASES',
  'LM Studio 보고서 생성 요청',
  'LM Studio 슬라이드 생성 요청',
  'LM Studio 인포그래픽 생성 요청',
  '업로드한 소스와 3단계 정리 결과를 근거로',
  '산출물 형식만 지시',
  'ckd.v40-vnext.pharmaStrategyResearch.v1',
  'v40에서 v39 리서치 안내 3개 블록 숨김',
  '4단계 AI 전략 리서치 숨김',
  'AI 없이도 할 수 있습니다 숨김',
  '3단계 구조화 프롬프트 연결 숨김',
  'NotebookLM 중복 소스 등록 섹션 제거',
].join('|');
void V40_VNEXT_RESEARCH_TRIMMED_MARKERS;

export function V40VNextResearchStrategyTrimmedLab() {
  return <V40VNextPharmaStrategyResearchLab />;
}
