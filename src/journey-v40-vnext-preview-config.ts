import type { JourneyStep } from './journey-shell';

const V40_VNEXT_CONFIG_SMOKE_MARKERS = [
  'v40-vNext 계승형 후속 버전',
  '조별 역할 잡기',
  '말해도 되는 선 확인',
  'AI 질문 다듬기',
  '성과관리 1: 시장 변화에서 성과 질문 찾기',
  '성과관리 2: 이번 2주 성과 기준 정하기',
  '성과관리 3: 고객 기록에서 성과 단서 찾기',
  '성과관리 4: 고객군별 2주 성과 흐름 정하기',
  '업무관리 1: 모호한 업무지시 고르기',
  '업무관리 2: 빠진 업무 기준 진단하기',
  '업무관리 3: AI로 업무지시문 초안 만들기',
  '사람관리 1: 먼저 이야기할 팀원 고르기',
  '사람관리 2: 1on1 첫 문장 준비하기',
  '2주 실행 메모와 복기 질문 완성하기',
  '성과관리 → 업무관리 → 사람관리',
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
    title: '조별 역할 잡기',
    description: '개인 실습이 아니라 우리 조가 C1바이오 영업팀장 역할로 대표 상황을 정합니다.',
  },
  {
    id: 'ai-safety',
    title: '말해도 되는 선 확인',
    description: '실제 고객명, 기관명, 제품명, 내부 수치, 팀원 실명은 넣지 않고 가상·익명 상황으로 바꿉니다.',
  },
  {
    id: 'prompt-practice',
    title: 'AI 질문 다듬기',
    description: '우리 조의 대표 고민을 AI가 알아들을 수 있는 질문으로 바꿉니다.',
  },
  {
    id: 'research-strategy',
    title: '성과관리 1: 시장 변화에서 성과 질문 찾기',
    description: 'Perplexity, NotebookLM, Studio 산출물을 만들어 시장 변화에서 성과관리 질문을 뽑습니다.',
  },
  {
    id: 'dashboard-analysis',
    title: '성과관리 2: 이번 2주 성과 기준 정하기',
    description: '이번 2주 동안 우리 조가 볼 성과 기준과 현장 신호를 정합니다.',
  },
  {
    id: 'customer-judgment',
    title: '성과관리 3: 고객 기록에서 성과 단서 찾기',
    description: '고객을 평가하지 않고, 고객 기록에서 다음 행동으로 이어질 성과 단서를 찾습니다.',
  },
  {
    id: 'customer-priority',
    title: '성과관리 4: 고객군별 2주 성과 흐름 정하기',
    description: '앞에서 찾은 단서를 바탕으로 고객군별 2주 흐름과 보완 조건을 정리합니다.',
  },
  {
    id: 'task-instruction-select',
    title: '업무관리 1: 모호한 업무지시 고르기',
    description: '성과관리 결과를 팀원에게 전달할 때 흔히 나오는 모호한 업무지시 예시를 고르고 팀원 예상 반응을 봅니다.',
  },
  {
    id: 'task-criteria-diagnosis',
    title: '업무관리 2: 빠진 업무 기준 진단하기',
    description: '선택한 업무지시에 빠진 배경, 목적, 범위, 우선순위, 일정, 완료 기준, 중간 확인을 체크합니다.',
  },
  {
    id: 'task-ai-draft',
    title: '업무관리 3: AI로 업무지시문 초안 만들기',
    description: 'AI에게 업무지시문 초안을 부탁한 뒤, 우리 조가 실행 가능한 문장으로 다시 고칩니다.',
  },
  {
    id: 'member-role',
    title: '사람관리 1: 먼저 이야기할 팀원 고르기',
    description: '기존 7명 인물 장면을 바탕으로 먼저 1on1로 확인할 팀원을 고릅니다.',
  },
  {
    id: 'people-dialogue',
    title: '사람관리 2: 1on1 첫 문장 준비하기',
    description: '지적이 아니라 확인으로 시작하는 첫 문장과 확인 질문을 준비합니다.',
  },
  {
    id: 'final-call-plan-card',
    title: '2주 실행 메모와 복기 질문 완성하기',
    description: '성과관리, 업무관리, 사람관리 결과를 하나의 2주 실행 메모와 복기 질문으로 묶습니다.',
  },
];

export function clampV40VNextStep(step: number) {
  if (!Number.isFinite(step)) return 0;
  return Math.min(Math.max(Math.trunc(step), 0), V40_VNEXT_VISIBLE_APP_STEPS.length - 1);
}
