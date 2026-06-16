import type { JourneyStep } from './journey-shell';

const V41_CONFIG_SMOKE_MARKERS = [
  'v41 계승형 후속 버전',
  'v41 field-friendly step labels',
  'v40-vNext parity scaffold',
  '파일럿 10단계 운영 전환',
  'AI 입력 기준은 질문 다듬기 단계에 통합',
  '시작하기',
  '팀원 보기',
  '질문 다듬기',
  '시장 변화 읽기',
  '팀 기준 만들기',
  '업무관리 실행계획 만들기',
  '할 일·줄일 일',
  '업무 순서·업무지시',
  '업무 경계 나누기',
  '업무 경계·병목 대응',
  '1on1 대상 고르기',
  '1on1 첫 문장',
  '사람관리 1: 대상 선택',
  '사람관리 2: 1on1 실천',
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
    description: '이대호 팀장과 팀원 7명의 기본 정보를 확인합니다.',
  },
  {
    id: 'prompt-practice',
    title: '질문 다듬기',
    description: '제약영업 상황을 골라 한 줄 질문과 정리된 프롬프트를 비교합니다.',
  },
  {
    id: 'research-strategy',
    title: '시장 변화 읽기',
    description: '공개자료에서 우리 팀 성과관리 질문을 뽑습니다.',
  },
  {
    id: 'dashboard-analysis',
    title: '팀 기준 만들기',
    description: '전사전략을 우리 팀 전략과제, CSF, KPI 기준으로 바꿉니다.',
  },
  {
    id: 'task-execution-design',
    title: '업무관리 실행계획 만들기',
    description: '팀 성과기준을 실행관리 주기, 실행과제, 담당, 증거, 점검 질문으로 바꿉니다.',
  },
  {
    id: 'task-priority-flow',
    title: '업무 순서·업무지시',
    description: '업무 순서, 역할과 책임, 일정, 줄일 일, 업무지시 초안을 정합니다.',
  },
  {
    id: 'task-boundary-coordination',
    title: '업무 경계·병목 대응',
    description: '업무 경계, 병목 신호, 에스컬레이션 기준, 팀장 개입 기준을 정합니다.',
  },
  {
    id: 'member-role',
    title: '사람관리 1: 대상 선택',
    description: 'v40-vNext 사람관리 1단계를 계승해 팀원별 실행 신호를 보고 먼저 이야기할 팀원과 1on1 초점을 고릅니다.',
  },
  {
    id: 'people-dialogue',
    title: '사람관리 2: 1on1 실천',
    description: 'v40-vNext 사람관리 2단계를 계승해 첫 문장, 확인 질문, 행동 합의, AI 역할극, 사람관리 결과 메모를 완성합니다.',
  },
];

export function clampV41Step(step: number) {
  if (!Number.isFinite(step)) return 0;
  return Math.min(Math.max(Math.trunc(step), 0), V41_VISIBLE_APP_STEPS.length - 1);
}
