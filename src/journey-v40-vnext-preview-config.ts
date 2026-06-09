import type { JourneyStep } from './journey-shell';

const V40_VNEXT_CONFIG_SMOKE_MARKERS = [
  'v40-vNext 계승형 후속 버전',
  '파일럿 11단계 운영',
  '12단계 최종 실행 메모 숨김',
  '팀장 역할 시작하기',
  '우리 팀과 팀원 살펴보기',
  '입력 기준 확인하기',
  'AI 질문 다시 쓰기',
  '성과관리 1: 시장 변화에서 우리 팀 질문 찾기',
  '성과관리 2: 전사전략을 우리 팀 실행 기준으로 바꾸기',
  '6·7단계 숨김 기본 운영',
  '여러분의 2주 성과관리 기준',
  '성과관리 3: 팀원별 CRM 기록에서 실행 신호 찾기',
  '성과관리 4: 팀 전략과제·CSF·KPI별 2주 실행 흐름 정하기',
  '업무관리 1: 성과 기준을 실행할 일로 바꾸기',
  '업무관리 2: 먼저 할 일과 잠시 줄일 일 정하기',
  '업무관리 3: 혼자 처리하면 안 되는 일 나누기',
  '사람관리 1: 먼저 이야기할 팀원 고르기',
  '사람관리 2: 1on1 첫 문장 준비하기',
  '성과관리 → 업무관리 → 사람관리',
  '실행할 일로 바꾸기',
  '우선순위와 업무 흐름',
  '혼자 처리하면 안 되는 일',
  'Perplexity 리서치 질문',
  'NotebookLM 소스 기반 종합 답변',
  'Studio 보고서 초안',
  '신재영 대리',
  '이대은 대리',
  '박재욱 사원',
  '유희관 과장',
  '김문호 차장',
  '김재호 차장',
  '문교원 사원',
].join('|');
void V40_VNEXT_CONFIG_SMOKE_MARKERS;

export const V40_VNEXT_VISIBLE_APP_STEPS: JourneyStep[] = [
  {
    id: 'entry',
    title: '팀장 역할 시작하기',
    description: '먼저 팀과 이름을 입력하고, 오늘 다룰 상황을 하나 정합니다.',
  },
  {
    id: 'role-team-intro',
    title: '우리 팀과 팀원 살펴보기',
    description: '이대호 팀장 역할과 함께 일할 팀원 7명의 상황을 확인합니다.',
  },
  {
    id: 'ai-safety',
    title: '입력 기준 확인하기',
    description: '화면 안내에 따라 AI에 넣어도 되는 말과 넣지 말아야 할 말을 구분합니다.',
  },
  {
    id: 'prompt-practice',
    title: 'AI 질문 다시 쓰기',
    description: '막연한 고민을 AI가 답하기 쉬운 질문으로 바꿔 봅니다.',
  },
  {
    id: 'research-strategy',
    title: '성과관리 1: 시장 변화에서 우리 팀 질문 찾기',
    description: '공개자료를 살펴보고, 우리 팀 성과관리에 던질 질문을 뽑습니다.',
  },
  {
    id: 'dashboard-analysis',
    title: '성과관리 2: 전사전략을 우리 팀 실행 기준으로 바꾸기',
    description: '전사전략과제를 우리 팀 과제, 성공조건, 지표와 2주 기준으로 바꿉니다.',
  },
  {
    id: 'task-execution-design',
    title: '업무관리 1: 성과 기준을 실행할 일로 바꾸기',
    description: '성과관리에서 정한 기준을 팀원이 바로 움직일 수 있는 업무지시로 바꿉니다.',
  },
  {
    id: 'task-priority-flow',
    title: '업무관리 2: 먼저 할 일과 잠시 줄일 일 정하기',
    description: '무엇을 먼저 하고, 무엇은 잠시 줄일지 정리합니다.',
  },
  {
    id: 'task-boundary-coordination',
    title: '업무관리 3: 혼자 처리하면 안 되는 일 나누기',
    description: '팀원이 할 일, 팀장이 확인할 일, 함께 풀어야 할 일을 나눕니다.',
  },
  {
    id: 'member-role',
    title: '사람관리 1: 먼저 이야기할 팀원 고르기',
    description: '관찰한 행동과 해석을 나누고, 먼저 1on1로 확인할 팀원을 고릅니다.',
  },
  {
    id: 'people-dialogue',
    title: '사람관리 2: 1on1 첫 문장 준비하기',
    description: '지적이 아니라 확인으로 시작하는 첫 문장과 다음 행동 합의를 준비합니다.',
  },
];

export function clampV40VNextStep(step: number) {
  if (!Number.isFinite(step)) return 0;
  return Math.min(Math.max(Math.trunc(step), 0), V40_VNEXT_VISIBLE_APP_STEPS.length - 1);
}
