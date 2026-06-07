import type { JourneyStep } from './journey-shell';

const V40_VNEXT_CONFIG_SMOKE_MARKERS = [
  'v40-vNext 계승형 후속 버전',
  '조별 역할 잡기',
  '말해도 되는 선 확인',
  'AI 질문 다듬기',
  '영업전략 리서치 산출물 만들기',
  '이번 2주에 볼 기준 정하기',
  '업무관리 Lab: 모호한 지시를 기준 문장으로 바꾸기',
  '고객 기록에서 단서 찾기',
  '고객군별 2주 흐름 정하기',
  '먼저 이야기할 팀원 고르기',
  '1on1 코칭 첫 문장 준비',
  'AI에게 2주 실행 초안 부탁하기',
  '말해도 되는 선 다시 보기',
  '2주 실행 메모와 복기 질문 완성',
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
    title: '영업전략 리서치 산출물 만들기',
    description: 'Perplexity, NotebookLM, Studio 산출물을 만들어 시장 변화에서 우리 팀 실행 질문을 뽑습니다.',
  },
  {
    id: 'dashboard-analysis',
    title: '이번 2주에 볼 기준 정하기',
    description: '이번 2주 동안 우리 조가 볼 관리 기준과 현장 신호를 정합니다.',
  },
  {
    id: 'task-management',
    title: '업무관리 Lab: 모호한 지시를 기준 문장으로 바꾸기',
    description: '5단계에서 정한 기준을 팀원에게 어떻게 명확하게 전달할지 업무지시문으로 바꿉니다.',
  },
  {
    id: 'customer-judgment',
    title: '고객 기록에서 단서 찾기',
    description: '고객을 평가하지 않고, 기록에서 다음 행동의 단서를 찾습니다.',
  },
  {
    id: 'customer-priority',
    title: '고객군별 2주 흐름 정하기',
    description: '앞에서 찾은 단서를 바탕으로 고객군별 2주 흐름과 보완 조건을 정리합니다.',
  },
  {
    id: 'member-role',
    title: '먼저 이야기할 팀원 고르기',
    description: '기존 7명 인물 장면을 바탕으로 먼저 1on1로 확인할 팀원을 고릅니다.',
  },
  {
    id: 'people-dialogue',
    title: '1on1 코칭 첫 문장 준비',
    description: '지적이 아니라 확인으로 시작하는 첫 문장과 확인 질문을 준비합니다.',
  },
  {
    id: 'ai-call-plan',
    title: 'AI에게 2주 실행 초안 부탁하기',
    description: '지금까지 정리한 내용을 AI에게 초안으로 정리시키고, 그대로 쓰지 않고 팀장 언어로 다시 고칩니다.',
  },
  {
    id: 'compliance-cleanup',
    title: '말해도 되는 선 다시 보기',
    description: 'AI 초안의 위험 표현을 걷어내고 우리 조가 책임질 수 있는 표현으로 고칩니다.',
  },
  {
    id: 'final-call-plan-card',
    title: '2주 실행 메모와 복기 질문 완성',
    description: '전략 리서치, 업무관리, 사람관리 결과를 하나의 2주 실행 메모로 묶습니다.',
  },
];

export function clampV40VNextStep(step: number) {
  if (!Number.isFinite(step)) return 0;
  return Math.min(Math.max(Math.trunc(step), 0), V40_VNEXT_VISIBLE_APP_STEPS.length - 1);
}
