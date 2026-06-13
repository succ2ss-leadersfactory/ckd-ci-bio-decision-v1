import type { JourneyStep } from './journey-shell';

const V41_CONFIG_SMOKE_MARKERS = [
  'v41 계승형 후속 버전',
  'v41 field-friendly step labels',
  'v40-vNext parity scaffold',
  '파일럿 11단계 운영 계승',
  '12단계 최종 실행 메모 숨김 유지',
  '시작하기',
  '팀원 보기',
  'AI 입력 기준',
  '질문 다듬기',
  '시장 변화 읽기',
  '팀 기준 만들기',
  '업무지시 만들기',
  '할 일·줄일 일',
  '업무 경계 나누기',
  '1on1 대상 고르기',
  '1on1 첫 문장',
].join('|');
void V41_CONFIG_SMOKE_MARKERS;

export const V41_VISIBLE_APP_STEPS: JourneyStep[] = [
  {
    id: 'entry',
    title: '시작하기',
    description: '팀과 이름을 입력하고 바로 시작합니다.',
  },
  {
    id: 'role-team-intro',
    title: '팀원 보기',
    description: '이대호 팀장 역할과 팀원 7명을 확인합니다.',
  },
  {
    id: 'ai-safety',
    title: 'AI 입력 기준',
    description: 'AI에 넣어도 되는 말과 가려야 할 말을 구분합니다.',
  },
  {
    id: 'prompt-practice',
    title: '질문 다듬기',
    description: '막연한 고민을 AI가 답하기 쉬운 질문으로 바꿉니다.',
  },
  {
    id: 'research-strategy',
    title: '시장 변화 읽기',
    description: '공개자료에서 우리 팀 성과관리 질문을 뽑습니다.',
  },
  {
    id: 'dashboard-analysis',
    title: '팀 기준 만들기',
    description: '전사전략을 우리 팀 기준, 지표, 2주 기준으로 바꿉니다.',
  },
  {
    id: 'task-execution-design',
    title: '업무지시 만들기',
    description: '성과 기준을 팀원이 실행할 업무지시로 바꿉니다.',
  },
  {
    id: 'task-priority-flow',
    title: '할 일·줄일 일',
    description: '먼저 할 일과 잠시 줄일 일을 정합니다.',
  },
  {
    id: 'task-boundary-coordination',
    title: '업무 경계 나누기',
    description: '혼자 할 일, 팀장 확인, 협조 요청을 나눕니다.',
  },
  {
    id: 'member-role',
    title: '1on1 대상 고르기',
    description: '먼저 이야기할 팀원을 고르고 관찰과 해석을 나눕니다.',
  },
  {
    id: 'people-dialogue',
    title: '1on1 첫 문장',
    description: '지적이 아니라 확인으로 시작하는 첫 문장을 준비합니다.',
  },
];

export function clampV41Step(step: number) {
  if (!Number.isFinite(step)) return 0;
  return Math.min(Math.max(Math.trunc(step), 0), V41_VISIBLE_APP_STEPS.length - 1);
}
