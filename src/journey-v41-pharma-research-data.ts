export const PHARMA_STRATEGY_RESEARCH_STORAGE_KEY = 'ckd.v41.pharmaStrategyResearch.v1';

const V41_PHARMA_RESEARCH_DATA_MARKERS = [
  'v41 pharma research data cloned',
  'ckd.v41.pharmaStrategyResearch.v1',
  '시장 변화 읽기',
  '팀 기준 만들기 전 리서치',
  '종근당 2026 하반기 전략과제',
  '전사 관점 CSF 실무언어',
  '전사 관점 KPI 실무언어',
  '성공하려면 꼭 챙겨야 할 일',
  '잘 되고 있는지 볼 확인 신호',
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
      '어떤 환자군과 의료진에게 먼저 집중할지 정한다',
      '의료진이 궁금해할 설명 포인트를 한 문장으로 맞춘다',
      '자료 요청, 상담 흐름, 다음 확인 질문이 끊기지 않게 만든다',
    ],
    kpis: [
      '우선 고객군이 정리되었는가',
      '의료진 관심 질문이 모였는가',
      '요청받은 자료가 제때 전달되었는가',
      '다음 확인 일정이 잡혔는가',
    ],
  },
  {
    id: 'ckd-core-product-value',
    title: '주력 제품군 고객가치 재정렬과 처방 지속성 강화',
    csfs: [
      '고객이 우리 제품을 계속 쓰는 이유를 다시 확인한다',
      '처방이 흔들리는 지점을 빨리 알아차린다',
      '경쟁 제품 이야기가 나왔을 때 사실 중심으로 대응한다',
    ],
    kpis: [
      '고객별 사용 이유가 정리되었는가',
      '처방이 줄어드는 신호를 기록했는가',
      '경쟁 제품 관련 질문이 공유되었는가',
      '다음 방문에서 확인할 말이 정해졌는가',
    ],
  },
  {
    id: 'ckd-rnd-bio-pipeline-story',
    title: '신약·바이오 파이프라인 기반 미래 성장 스토리 현장 전환',
    csfs: [
      '종근당의 연구·바이오 방향을 과장 없이 설명한다',
      '고객이 궁금해하는 정보와 아직 말하면 안 되는 정보를 나눈다',
      '미래 성장 이야기를 현재 고객 대화와 자연스럽게 연결한다',
    ],
    kpis: [
      '고객이 물어본 연구·바이오 질문이 모였는가',
      '승인된 자료 안에서 설명했는가',
      '과장되거나 앞서간 표현을 걸러냈는가',
      '고객별 관심 수준이 구분되었는가',
    ],
  },
  {
    id: 'ckd-data-based-field-execution',
    title: '병원·의원 고객 접점의 데이터 기반 실행관리 고도화',
    csfs: [
      '방문 기록이 다음 행동으로 이어지게 만든다',
      '고객 반응, 자료 제공, 후속 확인이 한 흐름으로 보이게 한다',
      '팀장이 2주 단위로 막힌 곳을 볼 수 있게 한다',
    ],
    kpis: [
      '고객 반응이 남아 있는가',
      '다음 행동이 한 문장으로 적혀 있는가',
      '후속 확인이 늦어진 건이 보이는가',
      '2주 점검 때 바로 볼 수 있는가',
    ],
  },
  {
    id: 'ckd-quality-supply-compliance',
    title: '품질·공급 신뢰와 컴플라이언스 기반 고객 커뮤니케이션 강화',
    csfs: [
      '품질·공급 관련 고객 우려를 먼저 사실로 듣는다',
      '바로 답할 수 있는 것과 내부 확인이 필요한 것을 구분한다',
      '불안하게 들릴 수 있는 표현은 쓰지 않도록 맞춘다',
    ],
    kpis: [
      '품질·공급 문의가 기록되었는가',
      '내부 확인이 필요한 이슈가 공유되었는가',
      '위험한 표현을 걸러냈는가',
      '설명 전에 컴플라이언스 확인을 거쳤는가',
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
