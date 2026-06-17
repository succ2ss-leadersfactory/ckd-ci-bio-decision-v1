export const PHARMA_STRATEGY_RESEARCH_STORAGE_KEY = 'ckd.v40-vnext.pharmaStrategyResearch.v1';

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
    id: 'ai-commercial',
    title: 'AI 기반 영업·마케팅 실행관리 고도화',
    focus: 'AI 결과를 고객 접점 준비, 기록 품질, 후속 질문으로 바꾸는 기준을 세웁니다.',
    kpis: ['AI 활용 전 안전성 점검률', '고객 질문 기록률', '후속 실행안 작성률', '위험 표현 수정 건수'],
  },
  {
    id: 'market-access',
    title: '약가·급여·시장접근성 변화 대응',
    focus: '가치 근거, 자료 요청, 사용 맥락 질문을 안전하게 기록하고 후속 대응으로 연결합니다.',
    kpis: ['가치 근거 질문 기록률', '승인자료 기반 후속 대응률', '자료 요청 처리 리드타임', '고객 관심 주제 분류율'],
  },
  {
    id: 'patent-portfolio',
    title: '특허만료·제네릭/바이오시밀러 경쟁 대응',
    focus: '고객 세그먼트별 질문, 대체 선택 기준, 안전한 후속 커뮤니케이션을 정리합니다.',
    kpis: ['핵심 고객군별 질문 기록률', '후속 접점 확보율', '경쟁 비교 위험표현 수정 건수', '세그먼트별 실행 완료율'],
  },
  {
    id: 'cdmo-cmo',
    title: 'CDMO/CMO 전략 확대와 공급·품질 신뢰 강화',
    focus: '공급·품질 관련 고객 우려를 듣고 내부 확인 필요 이슈와 설명 가능 범위를 구분합니다.',
    kpis: ['공급·품질 문의 기록률', '내부 확인 필요 이슈 공유건수', '고객 우려 후속 확인율', '안전 답변 가이드 활용률'],
  },
  {
    id: 'therapy-growth',
    title: '비만·대사질환·항암·면역 등 고성장 치료영역 대응',
    focus: '고객 질문과 승인자료 기반 후속 대화를 안전하게 연결합니다.',
    kpis: ['치료영역 질문 기록률', '승인자료 기반 대화율', '후속 정보 제공 계획률', '고객 의도 단정 표현 수정건수'],
  },
  {
    id: 'digital-journey',
    title: '디지털 채널·환자 여정 기반 고객 접점 혁신',
    focus: '방문, 비대면, 자료 제공, 후속 확인을 하나의 고객 접점 흐름으로 설계합니다.',
    kpis: ['대체 접점 실행률', '자료 제공 후 후속 확인율', '채널별 고객 반응 기록률', '2주 접점 흐름 완료율'],
  },
];

export const DEFAULT_PHARMA_RESEARCH_STATE: PharmaStrategyResearchState = {
  selectedTopicId: PHARMA_RESEARCH_TOPICS[0].id,
  customTopic: '',
  teamSituation: 'C1바이오 영업팀이 2026년 제약업계 전략 과제를 바탕으로 2주 실행관리 계획을 세워야 한다.',
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
