import type { JourneyStep } from './journey-shell';

export const V39_VISIBLE_APP_STEPS: JourneyStep[] = [
  {
    id: 'entry',
    title: '입장·역할 부여',
    description: '오늘 실습에서 맡을 C1바이오 영업팀장 역할과 팀 정보를 설정합니다.',
  },
  {
    id: 'ai-safety',
    title: 'AI 안전선',
    description: '제약영업 맥락에서 AI를 사용할 때 반드시 지켜야 할 입력 금지 기준을 확인합니다.',
  },
  {
    id: 'prompt-practice',
    title: '프롬프트 기본 실습',
    description: '좋은 질문의 구조를 익히고 AI에 요청할 때 필요한 맥락을 정리합니다.',
  },
  {
    id: 'research-strategy',
    title: '리서치·전략 해석',
    description: '시장·현장 정보를 해석하고 팀장 관점의 실행 이슈로 전환합니다.',
  },
  {
    id: 'dashboard-analysis',
    title: '팀원 실행진단',
    description: '팀원 실행 데이터를 보고 가설을 세우고 2주 실행 약속을 정합니다.',
  },
  {
    id: 'customer-judgment',
    title: '고객 Data 분석',
    description: '고객 Data 신호를 읽고 기회·착시·추가 확인 정보를 정리합니다.',
  },
  {
    id: 'customer-priority',
    title: '고객 유형별 대응 전략',
    description: '고객 유형별 2주 대응 전략과 리스크 관리 방향을 설계합니다.',
  },
  {
    id: 'member-role',
    title: '팀원별 역할 방향',
    description: '고객 대응 전략을 팀원별 실행 역할과 코칭 포인트로 전환합니다.',
  },
  {
    id: 'people-dialogue',
    title: '팀원 온도차와 실행 대화',
    description: '신세대 팀원의 질문과 기존 팀원의 부담을 함께 읽고 실행 대화 전략을 설계합니다.',
  },
  {
    id: 'ai-call-plan',
    title: 'AI 실행계획 프롬프트 준비',
    description: '앞 단계의 판단, 팀원 역할, 실행 대화 맥락을 바탕으로 AI에 요청할 실행계획 프롬프트를 준비합니다.',
  },
  {
    id: 'compliance-cleanup',
    title: '컴플라이언스 위험 표현 제거',
    description: 'AI 초안과 실행계획 문장에서 위험 표현을 찾아 안전한 대체 표현으로 수정합니다.',
  },
  {
    id: 'final-call-plan-card',
    title: '최종 2주 실행 카드',
    description: '앞 단계의 판단과 수정 내용을 교육 후 가져갈 수 있는 실행 카드로 정리합니다.',
  },
  {
    id: 'instructor-discussion',
    title: '강사용 토의 질문',
    description: '강사가 실습 후 디브리핑에 사용할 토의 질문을 영역별로 확인합니다.',
  },
];

export function clampV39Step(step: number) {
  if (!Number.isFinite(step)) return 0;
  return Math.min(Math.max(Math.trunc(step), 0), V39_VISIBLE_APP_STEPS.length - 1);
}
