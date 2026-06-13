export const PHARMA_STRATEGY_RESEARCH_STORAGE_KEY = 'ckd.v41.pharmaStrategyResearch.v1';

const V41_PHARMA_RESEARCH_DATA_MARKERS = [
  'v41 pharma research data cloned',
  'ckd.v41.pharmaStrategyResearch.v1',
  '시장 변화 읽기',
  '팀 기준 만들기 전 리서치',
  '종근당 2026 하반기 전략과제',
  'CKD First Mover',
  'GLP-1 비만·대사질환 포트폴리오',
  '주력 제품군 고객가치 재정렬',
  '신약·바이오 파이프라인 현장 전환',
  '데이터 기반 실행관리',
  '품질·공급 신뢰와 컴플라이언스',
].join('|');
void V41_PHARMA_RESEARCH_DATA_MARKERS;

export type PharmaResearchTopic = {
  id: string;
  title: string;
  focus: string;
  kpis: string[];
};

export type PharmaStrategyResearchState = {
  selectedTopicId: string;
  customTopic: string;
  teamSituation: string;
  leaderQuestion: string;
  perplexityAnswer: string;
  notebookAnswer: string;
  issueOne: string;
  issueTwo: string;
  issueThree: string;
  teamImpact: string;
  metricQuestions: string;
  caution: string;
  reportDraft: string;
  slideDraft: string;
  infographicDraft: string;
  meetingMemo: string;
  expectedQuestions: string;
};

export const PHARMA_RESEARCH_TOPICS: PharmaResearchTopic[] = [
  {
    id: 'ckd-glp1-obesity-metabolic',
    title: 'GLP-1 비만·대사질환 포트폴리오 실행 기반 구축',
    focus: '비만·당뇨·대사질환 고객군에서 의료진 관심사, 환자 여정, 자료 요청, 다음 방문 질문을 정리해 C1바이오 영업팀의 실행 언어로 바꿉니다.',
    kpis: ['비만·대사질환 고객 질문 기록률', '의료진 관심 주제 분류율', '후속 자료 요청 처리율', '2주 후속 방문 연결률'],
  },
  {
    id: 'ckd-core-product-value',
    title: '주력 제품군 고객가치 재정렬과 처방 지속성 강화',
    focus: '기존 주력 제품군의 고객별 사용 이유, 처방 지속 장벽, 경쟁 대체 신호를 팀원이 기록하고 다음 행동으로 연결하게 합니다.',
    kpis: ['주력 제품 고객가치 질문 기록률', '처방 지속 장벽 확인율', '경쟁 대체 신호 공유건수', '고객별 다음 행동 작성률'],
  },
  {
    id: 'ckd-rnd-bio-pipeline-story',
    title: '신약·바이오 파이프라인 기반 미래 성장 스토리 현장 전환',
    focus: '종근당의 First Mover 방향과 연구·바이오 성장 이미지를 고객 접점에서 과장 없이 설명할 수 있는 질문과 표현으로 바꿉니다.',
    kpis: ['파이프라인 관심 질문 기록률', '승인자료 기반 설명률', '과장 표현 수정건수', '고객별 정보 요구 수준 분류율'],
  },
  {
    id: 'ckd-data-based-field-execution',
    title: '병원·의원 고객 접점의 데이터 기반 실행관리 고도화',
    focus: '방문 기록, 고객 반응, 자료 제공, Follow-up 상태를 연결해 팀장이 2주 단위로 실행 흐름을 볼 수 있게 만듭니다.',
    kpis: ['고객 반응 기록률', '다음 행동 입력률', 'Follow-up 지연 건수', '2주 실행 점검 완료율'],
  },
  {
    id: 'ckd-quality-supply-compliance',
    title: '품질·공급 신뢰와 컴플라이언스 기반 고객 커뮤니케이션 강화',
    focus: '품질·공급·안전성 관련 고객 우려를 사실 중심으로 듣고, 내부 확인 필요 이슈와 설명 가능한 범위를 구분합니다.',
    kpis: ['품질·공급 문의 기록률', '내부 확인 필요 이슈 공유건수', '위험 표현 수정건수', '컴플라이언스 체크 완료율'],
  },
];

export const DEFAULT_PHARMA_RESEARCH_STATE: PharmaStrategyResearchState = {
  selectedTopicId: PHARMA_RESEARCH_TOPICS[0].id,
  customTopic: '',
  teamSituation: 'C1바이오 영업팀이 종근당의 2026년 하반기 핵심 전략과제를 바탕으로 2주 실행관리 계획을 세워야 한다.',
  leaderQuestion: '',
  perplexityAnswer: '',
  notebookAnswer: '',
  issueOne: '',
  issueTwo: '',
  issueThree: '',
  teamImpact: '',
  metricQuestions: '',
  caution: '',
  reportDraft: '',
  slideDraft: '',
  infographicDraft: '',
  meetingMemo: '',
  expectedQuestions: '',
};

export function pharmaTopicOf(topicId: string) {
  return PHARMA_RESEARCH_TOPICS.find((item) => item.id === topicId) ?? PHARMA_RESEARCH_TOPICS[0];
}

export function pharmaTitleOf(state: Pick<PharmaStrategyResearchState, 'selectedTopicId' | 'customTopic'>) {
  return state.customTopic.trim() || pharmaTopicOf(state.selectedTopicId).title;
}
