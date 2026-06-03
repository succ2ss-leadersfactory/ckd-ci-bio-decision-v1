import type { JourneyStep } from './journey-shell';

export const V39_VISIBLE_APP_STEPS: JourneyStep[] = [
  {
    id: 'entry',
    title: '입장·역할 부여',
    description: '이 단계: 오늘 실습에서 맡을 C1바이오 영업팀장 역할과 팀 정보를 설정합니다. 가져온 것: 교육 안내와 참여자 정보입니다. 넘길 것: 이후 실습에서 사용할 역할 맥락입니다.',
  },
  {
    id: 'ai-safety',
    title: 'AI 안전선',
    description: '이 단계: 제약영업 맥락에서 AI 입력 금지 기준을 확인합니다. 가져온 것: 오늘 역할과 실습 상황입니다. 넘길 것: 모든 AI 실습에 적용할 안전선입니다.',
  },
  {
    id: 'prompt-practice',
    title: '프롬프트 기본 실습',
    description: '이 단계: 좋은 질문의 구조와 필요한 맥락 정리 방식을 익힙니다. 가져온 것: AI 안전선입니다. 넘길 것: 이후 단계에서 사용할 프롬프트 작성 기준입니다.',
  },
  {
    id: 'research-strategy',
    title: '리서치·전략 해석',
    description: '이 단계: 시장·현장 정보를 팀장 관점의 실행 이슈로 전환합니다. 가져온 것: 프롬프트 기본 구조입니다. 넘길 것: 고객·팀 실행 판단의 배경 맥락입니다.',
  },
  {
    id: 'dashboard-analysis',
    title: '팀원 실행진단',
    description: '이 단계: 팀원 실행 데이터를 보고 가설을 세웁니다. 가져온 것: 역할 맥락과 전략 해석 관점입니다. 넘길 것: 팀원 역할 방향에 반영할 핵심 지표와 안전선입니다.',
  },
  {
    id: 'customer-judgment',
    title: '고객 Data 분석',
    description: '이 단계: 고객 Data 신호에서 기회·착시·부족 정보를 구분합니다. 가져온 것: 전략 해석 관점입니다. 넘길 것: 고객 유형별 대응 전략의 판단 근거입니다.',
  },
  {
    id: 'customer-priority',
    title: '고객 유형별 대응 전략',
    description: '이 단계: 고객별 2주 대응 전략과 리스크 관리 방향을 설계합니다. 가져온 것: 고객 Data 판단 결과입니다. 넘길 것: 팀원별 역할 방향에 반영할 고객 실행 전략입니다.',
  },
  {
    id: 'member-role',
    title: '팀원별 역할 방향',
    description: '이 단계: 고객 대응 전략을 팀원별 역할과 코칭 포인트로 전환합니다. 가져온 것: 팀원 실행진단과 고객 대응 전략입니다. 넘길 것: 실행 대화와 AI 실행계획에 반영할 역할 기준입니다.',
  },
  {
    id: 'people-dialogue',
    title: '팀원 온도차와 실행 대화',
    description: '이 단계: 팀원 온도차를 읽고 목적에 맞는 첫마디를 설계합니다. 가져온 것: 팀원별 역할 방향입니다. 넘길 것: AI 실행계획 프롬프트에 반영할 실행 대화 맥락입니다.',
  },
  {
    id: 'ai-call-plan',
    title: 'AI 실행계획 프롬프트 준비',
    description: '이 단계: AI에 붙여넣을 실행계획 프롬프트를 준비합니다. 가져온 것: 팀원 역할과 실행 대화 결과입니다. 넘길 것: 컴플라이언스 점검 대상이 될 AI 실행계획 초안입니다.',
  },
  {
    id: 'compliance-cleanup',
    title: '컴플라이언스 위험 표현 제거',
    description: '이 단계: AI 초안의 위험 표현을 안전한 실행 문장으로 바꿉니다. 가져온 것: AI 실행계획 초안입니다. 넘길 것: 최종 2주 실행 카드에 반영할 안전 문장과 체크리스트입니다.',
  },
  {
    id: 'final-call-plan-card',
    title: '최종 2주 실행 카드',
    description: '이 단계: 고객 실행, 팀원 역할, 실행 대화, 안전선을 하나의 카드로 통합합니다. 가져온 것: 역할·대화·컴플라이언스 결과입니다. 넘길 것: 강사용 토의 질문의 기준 자료입니다.',
  },
  {
    id: 'instructor-discussion',
    title: '강사용 토의 질문',
    description: '이 단계: 최종 실행 카드를 강사용 디브리핑 질문으로 전환합니다. 가져온 것: 최종 2주 실행 카드입니다. 넘길 것: 실습 후 토의와 현업 적용 대화의 기준입니다.',
  },
];

export function clampV39Step(step: number) {
  if (!Number.isFinite(step)) return 0;
  return Math.min(Math.max(Math.trunc(step), 0), V39_VISIBLE_APP_STEPS.length - 1);
}
