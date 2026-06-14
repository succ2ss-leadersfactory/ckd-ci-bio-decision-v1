export const PHARMA_STRATEGY_RESEARCH_STORAGE_KEY = 'ckd.v41.pharmaStrategyResearch.v1';

const V41_PHARMA_RESEARCH_DATA_MARKERS = [
  'v41 pharma research data cloned',
  'ckd.v41.pharmaStrategyResearch.v1',
  '시장 변화 읽기',
  '팀 기준 만들기 전 리서치',
  '종근당 2026 하반기 전략과제',
  '전사 관점 CSF 핵심 성공 요인',
  '전사 관점 KPI 측정 가능한 지표',
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
      '우선 고객군 설정: 비만·당뇨·대사질환 영역에서 먼저 집중할 고객군을 명확히 정하는 것',
      '제품 메시지 정렬: 의료진에게 전달할 핵심 메시지를 과장 없이 한 방향으로 맞추는 것',
      '후속 대응 체계 확보: 자료 요청, 상담, 다음 확인 일정이 끊기지 않게 운영하는 것',
    ],
    kpis: [
      '우선 고객군 정의율: 우선 고객군이 정의된 전략 과제 비율(%)',
      '핵심 메시지 정렬률: 공통 설명 메시지가 정리된 제품·고객군 비율(%)',
      '자료 요청 처리율: 정해진 기한 안에 처리된 자료 요청 비율(%)',
      '후속 일정 확보율: 다음 확인 일정이 잡힌 핵심 고객 비율(%)',
    ],
  },
  {
    id: 'ckd-core-product-value',
    title: '주력 제품군 고객가치 재정렬과 처방 지속성 강화',
    csfs: [
      '고객가치 재정의: 주력 제품을 계속 써야 하는 이유를 고객 관점에서 다시 정리하는 것',
      '처방 유지 장벽 파악: 처방이 흔들리는 이유와 대체 가능성을 조기에 확인하는 것',
      '경쟁 대응 기준 정렬: 경쟁 제품 언급 시 사실 기반으로 대응할 기준을 맞추는 것',
    ],
    kpis: [
      '고객가치 정리율: 고객별 제품 사용 이유가 정리된 핵심 고객 비율(%)',
      '처방 유지 장벽 확인 건수: 처방 지속을 막는 요인으로 기록된 건수(건)',
      '경쟁 이슈 공유 건수: 경쟁 제품 관련 질문·우려가 공유된 건수(건)',
      '다음 행동 등록률: 고객별 다음 행동이 등록된 핵심 고객 비율(%)',
    ],
  },
  {
    id: 'ckd-rnd-bio-pipeline-story',
    title: '신약·바이오 파이프라인 기반 미래 성장 스토리 현장 전환',
    csfs: [
      '미래 성장 메시지 정렬: 연구·바이오 방향을 고객에게 설명 가능한 수준으로 정리하는 것',
      '정보 제공 범위 관리: 말할 수 있는 정보와 확인이 필요한 정보를 구분하는 것',
      '고객 관심도 파악: 고객이 어떤 연구·바이오 주제에 관심을 보이는지 확인하는 것',
    ],
    kpis: [
      '파이프라인 관심 질문 건수: 고객이 물어본 연구·바이오 관련 질문 수(건)',
      '승인자료 기반 설명률: 승인된 자료 범위 안에서 진행된 설명 비율(%)',
      '표현 점검 건수: 과장되거나 앞서간 표현을 수정한 건수(건)',
      '고객 관심도 분류율: 관심 수준이 구분된 핵심 고객 비율(%)',
    ],
  },
  {
    id: 'ckd-data-based-field-execution',
    title: '병원·의원 고객 접점의 데이터 기반 실행관리 고도화',
    csfs: [
      '기록 품질 표준화: 방문 기록에 고객 반응과 다음 행동이 남도록 기준을 맞추는 것',
      '후속 실행 가시화: 자료 제공과 Follow-up 상태가 한눈에 보이게 하는 것',
      '2주 실행 점검 체계화: 팀장이 2주 단위로 실행 지연과 막힌 지점을 확인하는 것',
    ],
    kpis: [
      '고객 반응 기록률: 고객 반응이 포함된 방문 기록 비율(%)',
      '다음 행동 입력률: 다음 행동이 입력된 방문 기록 비율(%)',
      'Follow-up 지연 건수: 예정일을 넘긴 Follow-up 건수(건)',
      '2주 점검 완료율: 2주 실행 점검이 완료된 팀원·고객 항목 비율(%)',
    ],
  },
  {
    id: 'ckd-quality-supply-compliance',
    title: '품질·공급 신뢰와 컴플라이언스 기반 고객 커뮤니케이션 강화',
    csfs: [
      '고객 우려 수집 체계: 품질·공급 관련 고객 우려를 빠짐없이 사실로 모으는 것',
      '내부 확인 절차 정립: 바로 답할 수 있는 내용과 내부 확인이 필요한 내용을 구분하는 것',
      '컴플라이언스 표현 관리: 불안이나 오해를 키울 수 있는 표현을 사전에 점검하는 것',
    ],
    kpis: [
      '품질·공급 문의 기록 건수: 품질·공급 관련 고객 문의 기록 건수(건)',
      '내부 확인 요청 처리율: 내부 확인 요청 중 정해진 기한 안에 처리된 비율(%)',
      '위험 표현 수정 건수: 컴플라이언스 관점에서 수정한 표현 건수(건)',
      '컴플라이언스 확인 완료율: 고객 전달 전 검토가 완료된 커뮤니케이션 비율(%)',
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
