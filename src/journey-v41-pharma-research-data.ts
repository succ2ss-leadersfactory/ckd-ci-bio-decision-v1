export const PHARMA_STRATEGY_RESEARCH_STORAGE_KEY = 'ckd.v41.pharmaStrategyResearch.v1';

const V41_PHARMA_RESEARCH_DATA_MARKERS = [
  'v41 pharma research data cloned',
  'ckd.v41.pharmaStrategyResearch.v1',
  '시장 변화 읽기',
  '팀 기준 만들기 전 리서치',
  '종근당 2026 하반기 전략과제',
  '전사전략과제 CSF KPI cascade ready',
  '전사에서 팀으로 케스케이딩',
  '팀에서 팀원으로 케스케이딩',
  '전사 KPI와 팀 KPI 차별화',
  '전사 고객 데이터 표준화',
  'CSF는 핵심 성공 요인',
  'KPI는 측정 가능한 지표',
  '전략컨설턴트 성과관리 전문가 검토 반영',
  '드라마 작가 현업 표현 반영',
].join('|');
void V41_PHARMA_RESEARCH_DATA_MARKERS;

export type PharmaResearchTopic = {
  id: string;
  title: string;
  csfs: string[];
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
    csfs: [
      '타깃 시장 선정: 먼저 공략할 질환군, 환자군, 의료진 유형이 정해져 있어야 한다',
      '제품 가치 근거 준비: 의료진에게 제시할 임상, 환자관리, 보험·급여 관련 근거가 준비되어 있어야 한다',
      '출시 실행 준비: 마케팅, 영업, 학술, 공급, 컴플라이언스가 같은 일정과 기준으로 움직여야 한다',
    ],
    kpis: [
      '타깃 시장 정의율: 우선 공략 시장과 고객군이 정의된 전략 제품·질환군 비율(%)',
      '핵심 근거자료 준비율: 의료진 설명에 필요한 핵심 자료가 준비된 전략 제품 비율(%)',
      '출시 준비 일정 준수율: 계획된 출시·도입 준비 항목이 기한 내 완료된 비율(%)',
      '초기 시장 인사이트 확보 건수: 타깃 시장에서 수집된 주요 질문·우려·기회 신호 건수(건)',
    ],
  },
  {
    id: 'ckd-core-product-value',
    title: '주력 제품군 고객가치 재정렬과 시장 방어력 강화',
    csfs: [
      '제품 가치 재정립: 주력 제품을 계속 선택해야 하는 이유가 고객·시장 관점으로 다시 정리되어 있어야 한다',
      '시장 방어 논리 확보: 처방 감소, 대체 가능성, 경쟁 압박에 대응할 전사 기준이 있어야 한다',
      '경쟁 대응 메시지 체계화: 경쟁 제품 언급 시 사용할 근거와 표현 기준이 준비되어 있어야 한다',
    ],
    kpis: [
      '주력 제품 매출 유지율: 기준 기간 대비 주력 제품 매출 유지 비율(%)',
      '고객가치 메시지 정비율: 고객가치 메시지가 재정리된 주력 제품 비율(%)',
      '주요 시장 방어 전략 수립률: 핵심 시장별 방어 전략이 수립된 비율(%)',
      '경쟁 대응 자료 준비율: 경쟁 대응 자료와 표현 기준이 준비된 주력 제품 비율(%)',
    ],
  },
  {
    id: 'ckd-rnd-bio-pipeline-story',
    title: '신약·바이오 파이프라인 기반 미래 성장 스토리 현장 전환',
    csfs: [
      '핵심 파이프라인 우선순위: 회사가 집중할 신약·바이오 과제가 분명해야 한다',
      '사업화 연결 기준: 연구개발 성과가 시장, 고객, 제품 포트폴리오와 어떻게 연결되는지 정리되어 있어야 한다',
      '외부 커뮤니케이션 기준: 고객과 시장에 말할 수 있는 내용과 아직 확인이 필요한 내용이 구분되어 있어야 한다',
    ],
    kpis: [
      '핵심 파이프라인 마일스톤 달성률: 계획된 개발 마일스톤이 기한 내 달성된 비율(%)',
      '전략 파이프라인 선정 건수: 전사 차원에서 집중 관리하는 파이프라인 과제 수(건)',
      '사업화 검토 완료율: 사업화 가능성 검토가 완료된 핵심 파이프라인 비율(%)',
      '외부 메시지 승인율: 고객·시장 커뮤니케이션용 메시지가 승인된 비율(%)',
    ],
  },
  {
    id: 'ckd-data-based-field-execution',
    title: '고객 접점 데이터 기반 영업·마케팅 의사결정 체계 고도화',
    csfs: [
      '전사 고객 데이터 표준화: 영업·마케팅·의학부서가 같은 기준으로 고객 접점 데이터를 볼 수 있어야 한다',
      '부서 간 고객 인사이트 연계: 현장 반응이 제품 전략, 자료 개발, 고객 대응 기준으로 연결되어야 한다',
      '데이터 기반 의사결정 정착: 고객 접점 데이터가 전략회의와 실행 점검에 실제로 반영되어야 한다',
    ],
    kpis: [
      '고객 데이터 표준 적용률: 전사 표준에 맞게 관리되는 고객 접점 데이터 비율(%)',
      '주요 고객 인사이트 등록 건수: 전략 의사결정에 활용 가능한 고객 인사이트 등록 건수(건)',
      '부서 간 인사이트 공유 건수: 영업·마케팅·의학부서 간 공유된 고객 인사이트 건수(건)',
      '전략 의사결정 반영 건수: 고객 접점 데이터가 전략회의나 실행계획에 반영된 건수(건)',
    ],
  },
  {
    id: 'ckd-quality-supply-compliance',
    title: '품질·공급 신뢰와 컴플라이언스 기반 고객 커뮤니케이션 강화',
    csfs: [
      '품질·공급 이슈 대응 기준: 고객 문의에 답하기 전 확인해야 할 기준이 정해져 있어야 한다',
      '부서 간 확인 체계: 현장 문의가 품질, 공급, 컴플라이언스 담당 부서로 빠르게 연결되어야 한다',
      '컴플라이언스 리스크 사전 통제: 고객에게 불안이나 오해를 줄 수 있는 표현을 사전에 걸러야 한다',
    ],
    kpis: [
      '품질·공급 이슈 처리율: 정해진 기한 안에 처리된 품질·공급 이슈 비율(%)',
      '내부 확인 리드타임: 내부 확인 요청부터 답변 완료까지 걸린 평균 일수(일)',
      '컴플라이언스 검토 완료율: 고객 전달 전 검토가 완료된 자료 비율(%)',
      '재발 이슈 감소율: 동일 유형의 품질·공급·표현 리스크가 감소한 비율(%)',
    ],
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
