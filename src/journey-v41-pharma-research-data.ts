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
  'CSF는 핵심 성공 요인',
  'KPI는 측정 가능한 지표',
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
      '우선 시장 선택: 비만·당뇨·대사질환 중 먼저 키울 시장과 고객군이 정해져 있어야 한다',
      '제품별 근거 준비: 제품별로 의료진에게 제시할 핵심 근거와 설명 기준이 준비되어 있어야 한다',
      '시장 진입 실행체계: 출시·도입·고객 대응을 연결할 부서 간 실행 흐름이 잡혀 있어야 한다',
    ],
    kpis: [
      '우선 시장 정의율: 우선 시장과 고객군이 정의된 전략 제품 비율(%)',
      '제품별 핵심 근거 준비율: 핵심 근거 자료가 준비된 제품 비율(%)',
      '시장 진입 일정 준수율: 계획된 출시·도입 준비 일정이 기한 내 완료된 비율(%)',
      '초기 고객 반응 수집 건수: 전략 고객군에서 수집된 초기 반응·질문 건수(건)',
    ],
  },
  {
    id: 'ckd-core-product-value',
    title: '주력 제품군 고객가치 재정렬과 처방 지속성 강화',
    csfs: [
      '제품별 가치 재정리: 주력 제품을 계속 선택해야 하는 이유가 고객 관점으로 정리되어 있어야 한다',
      '처방 유지 위험 관리: 처방 감소나 대체 가능성을 빨리 볼 수 있는 기준이 있어야 한다',
      '경쟁 대응 자료 준비: 경쟁 제품 언급 시 사용할 사실 기반 자료와 표현 기준이 준비되어 있어야 한다',
    ],
    kpis: [
      '주력 제품 매출 유지율: 기준 기간 대비 주력 제품 매출 유지 비율(%)',
      '고객가치 메시지 정비율: 고객가치 메시지가 재정리된 주력 제품 비율(%)',
      '처방 감소 신호 등록 건수: 처방 감소·대체 가능성으로 등록된 주요 신호 건수(건)',
      '경쟁 대응 자료 준비율: 경쟁 대응 자료가 준비된 주력 제품 비율(%)',
    ],
  },
  {
    id: 'ckd-rnd-bio-pipeline-story',
    title: '신약·바이오 파이프라인 기반 미래 성장 스토리 현장 전환',
    csfs: [
      '핵심 파이프라인 우선순위: 회사가 집중할 신약·바이오 과제가 정해져 있어야 한다',
      '개발·사업 연계: 연구개발 성과가 사업 기회와 고객 커뮤니케이션으로 연결될 기준이 있어야 한다',
      '외부 메시지 관리: 고객과 시장에 말할 수 있는 내용과 아직 확인이 필요한 내용이 구분되어 있어야 한다',
    ],
    kpis: [
      '핵심 파이프라인 마일스톤 달성률: 계획된 개발 마일스톤이 기한 내 달성된 비율(%)',
      '전략 파이프라인 선정 건수: 전사 차원에서 집중 관리하는 파이프라인 과제 수(건)',
      '사업 연계 검토 완료율: 사업화 가능성 검토가 완료된 핵심 파이프라인 비율(%)',
      '외부 메시지 승인율: 고객·시장 커뮤니케이션용 메시지가 승인된 비율(%)',
    ],
  },
  {
    id: 'ckd-data-based-field-execution',
    title: '병원·의원 고객 접점의 데이터 기반 실행관리 고도화',
    csfs: [
      '고객 데이터 품질: 방문 기록에 고객 반응과 다음 행동이 남는 기준이 세워져 있어야 한다',
      '실행 현황 가시화: 방문, 자료 제공, Follow-up 상태가 한눈에 보이도록 관리되어야 한다',
      '리더 점검 체계: 팀장이 실행 지연과 막힌 지점을 주기적으로 볼 수 있어야 한다',
    ],
    kpis: [
      '고객 반응 기록률: 고객 반응이 포함된 방문 기록 비율(%)',
      '다음 행동 입력률: 다음 행동이 입력된 방문 기록 비율(%)',
      'Follow-up 기한 준수율: 예정일 안에 완료된 Follow-up 비율(%)',
      '실행 지연 건수: 예정일을 넘긴 고객 후속 과제 건수(건)',
    ],
  },
  {
    id: 'ckd-quality-supply-compliance',
    title: '품질·공급 신뢰와 컴플라이언스 기반 고객 커뮤니케이션 강화',
    csfs: [
      '품질·공급 이슈 대응 기준: 고객 문의에 답하기 전 확인해야 할 기준이 정해져 있어야 한다',
      '내부 확인 흐름: 현장 문의가 품질·공급·컴플라이언스 담당 부서로 빠르게 연결되어야 한다',
      '표현 리스크 관리: 고객에게 불안이나 오해를 줄 수 있는 표현을 사전에 걸러야 한다',
    ],
    kpis: [
      '품질·공급 문의 처리율: 정해진 기한 안에 처리된 품질·공급 문의 비율(%)',
      '내부 확인 리드타임: 내부 확인 요청부터 답변 완료까지 걸린 평균 일수(일)',
      '컴플라이언스 검토 완료율: 고객 전달 전 검토가 완료된 자료 비율(%)',
      '위험 표현 수정 건수: 고객 커뮤니케이션에서 수정한 위험 표현 건수(건)',
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
