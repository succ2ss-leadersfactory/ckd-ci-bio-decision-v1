import type { JourneyStep } from './journey-shell';

export const V36_STORAGE_KEYS = {
  participant: 'ckd-v36-participant',
  progress: 'ckd-v36-progress',
  responses: 'ckd-v36-responses',
  researchStrategy: 'ckd-v36-lab-research-strategy-v2',
  sourceCheck: 'ckd-v36-lab-source-check',
  dashboardAnalysis: 'ckd-v36-lab-dashboard-analysis',
  customerCallPlan: 'ckd-v36-lab-customer-call-plan',
  hqTranslation: 'ckd-v36-lab-hq-translation',
  stakeholderMessage: 'ckd-v36-lab-stakeholder-message',
  performanceDialogue: 'ckd-v36-lab-performance-dialogue',
  oneOnOneCoaching: 'ckd-v36-lab-one-on-one-coaching',
  wrapUp: 'ckd-v36-wrap-up',
} as const;

export const V36_APP_STEPS: JourneyStep[] = [
  { id: 'entry', title: '입장', description: 'C1바이오 영업팀장 역할을 부여합니다.' },
  { id: 'ai-safety', title: 'AI 안전선', description: '제약영업에서 AI 사용 금지선을 확인합니다.' },
  { id: 'prompt-practice', title: '좋은 질문 만들기', description: '안전하고 구체적인 AI 질문 구조를 연습합니다.' },
  { id: 'research-strategy', title: 'AI Research 전략 Lab', description: '외부 환경 변화와 전략 이슈를 도출합니다.' },
  { id: 'source-check', title: 'Source Check', description: 'AI 결과의 출처·최근성·위험 표현을 감별합니다.' },
  { id: 'dashboard-analysis', title: '팀원 Dashboard 분석', description: '내부 실행 데이터를 진단합니다.' },
  { id: 'customer-judgment', title: '고객군 판단', description: '어디에 집중하고 무엇을 줄일지 결정합니다.' },
  { id: 'action-map', title: '실행행동 Map', description: '팀원별 2주 실행행동을 설계합니다.' },
  { id: 'hq-translation', title: '본사 요청 현장 번역', description: '본사 언어를 팀 실행 언어로 변환합니다.' },
  { id: 'stakeholder-message', title: '이해관계자 메시지', description: '상사·본사·팀원별 메시지를 정렬합니다.' },
  { id: 'performance-dialogue', title: '성과대화 감별', description: 'AI 대화문을 데이터 기반·현장형으로 수정합니다.' },
  { id: 'one-on-one-coaching', title: '1on1 코칭', description: '팀원별 개입 전략과 코칭 질문을 설계합니다.' },
  { id: 'wrap-up', title: 'Wrap-up', description: '7일 실행계획과 30일 점검 기준을 확정합니다.' },
];

export const V36_PROTECTED_FILES = [
  'src/full-flow-journey-v34.tsx',
  'src/journey-active.tsx',
  'src/full-flow-journey-v35.tsx',
] as const;

export function clampV36Step(step: number) {
  return Math.min(Math.max(step, 0), V36_APP_STEPS.length - 1);
}
