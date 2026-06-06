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
    title: 'AI 전략 리서치',
    description: '이 단계: Perplexity·NotebookLM·Studio를 활용해 공개자료 기반 변화 신호를 찾고 전략회의용 초안과 실행 질문을 만듭니다. 가져온 것: 프롬프트 기본 구조와 AI 안전선입니다. 넘길 것: 5단계 관리 지표로 전환할 전략 이슈와 실행 질문입니다.',
  },
  {
    id: 'dashboard-analysis',
    title: '우리 팀 관리 지표 선정',
    description: '이 단계: 4단계 전략 이슈와 우리 팀 상황을 바탕으로 이번 2주 동안 볼 관리 지표 List를 정합니다. 가져온 것: AI 전략 리서치의 실행 질문과 역할 맥락입니다. 넘길 것: 고객 Data 확인 List로 전환할 핵심 실행 지표와 참고 신호입니다.',
  },
  {
    id: 'customer-judgment',
    title: '고객 Data 확인 List',
    description: '이 단계: 5단계 관리 지표를 고객 Data에서 확인할 항목·출처·확인 기준·주의할 해석·팀원 확인 질문으로 바꿉니다. 가져온 것: 핵심 실행 지표와 함께 볼 현장 신호입니다. 넘길 것: 고객군별 2주 대응 방향의 판단 근거입니다.',
  },
  {
    id: 'customer-priority',
    title: '고객군별 2주 대응 방향',
    description: '이 단계: 6단계 고객 Data 확인 기준을 바탕으로 고객군 후보와 점검 조건별 2주 대응 방향을 정리합니다. 가져온 것: 고객 Data 확인 List입니다. 넘길 것: 코칭 대상 선정에서 참고할 현장 신호와 2주 행동 방향입니다.',
  },
  {
    id: 'member-role',
    title: '코칭 대상 선정',
    description: '이 단계: 7명의 팀원 유형을 참고하고 필요한 경우 실제 고민 팀원을 익명으로 등록해, 지금 먼저 1on1이 필요한 1~2명을 고릅니다. 가져온 것: 고객군별 2주 대응 방향과 팀원 실행 신호입니다. 넘길 것: 9단계에서 대화 흐름으로 바꿀 선택 이유와 코칭 초점입니다.',
  },
  {
    id: 'people-dialogue',
    title: '팀원 온도차와 실행 대화',
    description: '이 단계: 8단계에서 고른 1on1 대상과 코칭 초점을 바탕으로, 팀원이 받아들일 수 있는 실행 대화의 첫 흐름을 준비합니다. 가져온 것: 코칭 대상, 선택 이유, 코칭 초점입니다. 넘길 것: AI 실행계획 프롬프트에 반영할 실행 대화 메모입니다.',
  },
  {
    id: 'ai-call-plan',
    title: 'AI 실행계획 Prompt',
    description: '이 단계: 관리 지표, 고객 Data, 고객군 대응 방향, 코칭 대상, 실행 대화를 AI에 붙여넣을 실행계획 프롬프트로 통합합니다. 가져온 것: 코칭 대상과 실행 대화 결과입니다. 넘길 것: 컴플라이언스 점검 대상이 될 AI 실행계획 초안입니다.',
  },
  {
    id: 'compliance-cleanup',
    title: '컴플라이언스 위험 표현 제거',
    description: '이 단계: AI 초안의 위험 표현을 찾아 안전한 실행 문장으로 바꿉니다. 가져온 것: AI 실행계획 초안입니다. 넘길 것: 최종 2주 실행 카드에 반영할 안전 문장과 체크리스트입니다.',
  },
  {
    id: 'final-call-plan-card',
    title: '최종 2주 실행 카드',
    description: '이 단계: 관리 지표, 고객 Data 확인 List, 고객군 대응 방향, 코칭 대상, 실행 대화, 안전선을 하나의 카드로 압축합니다. 가져온 것: 코칭 대상·대화·컴플라이언스 결과입니다. 넘길 것: 강사용 토의 질문의 기준 자료입니다.',
  },
  {
    id: 'instructor-discussion',
    title: '강사용 토의 질문',
    description: '이 단계: 최종 2주 실행 카드를 강사용 디브리핑 질문으로 전환합니다. 가져온 것: 최종 2주 실행 카드입니다. 넘길 것: 실습 후 토의와 현업 적용 대화의 기준입니다.',
  },
];

export function clampV39Step(step: number) {
  if (!Number.isFinite(step)) return 0;
  return Math.min(Math.max(Math.trunc(step), 0), V39_VISIBLE_APP_STEPS.length - 1);
}
