import type { JourneyStep } from './journey-shell';

const V39_PREVIEW_CONFIG_SMOKE_MARKERS = [
  '프롬프트 기본 실습',
  'AI 전략 리서치',
  '우리 팀 관리 지표 선정',
  '고객 Data 확인 List',
  '고객군별 2주 대응 방향',
  '코칭 대상 선정',
  '팀원 온도차와 실행 대화',
  'AI 실행계획 Prompt',
  '컴플라이언스 위험 표현 제거',
  '최종 2주 실행 카드',
  '강사용 토의 질문',
].join('|');
void V39_PREVIEW_CONFIG_SMOKE_MARKERS;

export const V39_VISIBLE_APP_STEPS: JourneyStep[] = [
  {
    id: 'entry',
    title: '오늘 역할 잡기',
    description: '오늘은 C1바이오 영업팀장 입장에서 시작합니다. 우리 팀 상황을 놓고 직접 판단할 준비를 합니다.',
  },
  {
    id: 'ai-safety',
    title: '말해도 되는 선 확인',
    description: 'AI에 넣어도 되는 말과 넣으면 안 되는 말을 먼저 확인합니다. 실제 고객·기관·제품·수치는 넣지 않습니다.',
  },
  {
    id: 'prompt-practice',
    title: 'AI 질문 다듬기',
    description: '막연한 고민을 AI에게 물어볼 수 있는 질문으로 다듬습니다. 현장 상황, 부탁할 일, 받고 싶은 형태를 정합니다.',
  },
  {
    id: 'research-strategy',
    title: '시장 변화에서 질문 찾기',
    description: '공개자료에서 우리 팀에 영향을 줄 변화만 골라 봅니다. 자료를 많이 모으는 것이 아니라 팀장이 던질 질문을 만드는 시간입니다.',
  },
  {
    id: 'dashboard-analysis',
    title: '이번 2주에 볼 기준 정하기',
    description: '이번 2주 동안 팀장이 볼 기준을 고릅니다. 활동량만 보지 않고 후속조치, 고객 반응, 기록의 질까지 함께 봅니다.',
  },
  {
    id: 'customer-judgment',
    title: '고객 기록에서 단서 찾기',
    description: '고객 활동 기록에서 다시 확인할 단서를 고릅니다. 고객을 평가하지 않고, 무엇을 더 봐야 할지만 정리합니다.',
  },
  {
    id: 'customer-priority',
    title: '2주 동안 다시 볼 흐름 정하기',
    description: '앞에서 고른 단서를 바탕으로 이번 2주 동안 다시 볼 고객 흐름과 움직일 방향을 잡습니다.',
  },
  {
    id: 'member-role',
    title: '먼저 이야기할 팀원 고르기',
    description: '7명의 팀원 모습을 참고해, 이번 주 먼저 앉아서 이야기해 볼 1~2명을 고릅니다.',
  },
  {
    id: 'people-dialogue',
    title: '첫 문장 준비하기',
    description: '그 팀원과 어떻게 말을 꺼낼지 준비합니다. 지시처럼 들리지 않게 첫 문장과 질문을 다듬습니다.',
  },
  {
    id: 'ai-call-plan',
    title: 'AI에게 한 번 정리시켜 보기',
    description: '지금까지 적은 메모를 AI에게 보여주고 2주 실행 초안을 받아 봅니다. AI 초안은 그대로 쓰지 않고 다음 단계에서 다시 고칩니다.',
  },
  {
    id: 'compliance-cleanup',
    title: '말해도 되는 선 다시 보기',
    description: 'AI가 만든 문장을 회사 기준에 맞는 표현으로 다시 봅니다. 현장에서 책임질 수 있는 말로 고칩니다.',
  },
  {
    id: 'final-call-plan-card',
    title: '2주 메모 완성하기',
    description: '교육장 밖에서 바로 꺼내 볼 2주 실행 메모를 완성합니다. 팀 회의와 1on1에서 쓸 말로 짧게 남깁니다.',
  },
  {
    id: 'instructor-discussion',
    title: '함께 복기할 질문 만들기',
    description: '왜 그렇게 판단했는지, 어디서 막힐 수 있는지 함께 이야기할 질문으로 바꿉니다.',
  },
];

export function clampV39Step(step: number) {
  if (!Number.isFinite(step)) return 0;
  return Math.min(Math.max(Math.trunc(step), 0), V39_VISIBLE_APP_STEPS.length - 1);
}
