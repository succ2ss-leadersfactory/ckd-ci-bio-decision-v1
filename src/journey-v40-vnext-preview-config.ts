import type { JourneyStep } from './journey-shell';

const V40_VNEXT_CONFIG_SMOKE_MARKERS = [
  'v40-vNext 계승형 후속 버전',
  '조별 역할 잡기',
  '말해도 되는 선 확인',
  'AI 질문 다듬기',
  '성과관리 1: 시장 변화에서 성과 질문 찾기',
  '성과관리 2: 전사전략과제를 팀 전략과제·CSF·KPI로 분해하기',
  '성과관리 3: 고객 기록에서 성과 신호 읽기',
  '성과관리 4: 팀 전략과제·CSF·KPI별 2주 실행 흐름 정하기',
  '업무관리 1: 성과 기준을 실행 과제로 바꾸기',
  '업무관리 2: 우선순위와 업무 흐름 정리하기',
  '업무관리 3: 혼자 해결하면 안 되는 일 구분하기',
  '사람관리 1: 먼저 이야기할 팀원 고르기',
  '사람관리 2: 1on1 첫 문장 준비하기',
  '2주 실행 메모와 복기 질문 완성하기',
  '성과관리 → 업무관리 → 사람관리',
  '실행 과제화',
  '우선순위와 업무 흐름',
  '혼자 해결하면 안 되는 일',
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
    title: '성과관리 2: 전사전략과제를 팀 전략과제·CSF·KPI로 분해하기',
    description: '전사전략과제를 우리 조의 팀 전략과제, 성공조건, 관리 지표로 번역합니다.',
  },
  {
    id: 'customer-judgment',
    title: '성과관리 3: 고객 기록에서 성과 신호 읽기',
    description: '가상 CRM 기록에서 성과 단서, 부족 정보, 위험한 해석, 팀장 확인 질문을 구분합니다.',
  },
  {
    id: 'customer-priority',
    title: '성과관리 4: 팀 전략과제·CSF·KPI별 2주 실행 흐름 정하기',
    description: '팀 전략과제와 CSF/KPI를 2주 실행 흐름, 팀장 점검 질문, 회의 설명 문장으로 바꿉니다.',
  },
  {
    id: 'task-execution-design',
    title: '업무관리 1: 성과 기준을 실행 과제로 바꾸기',
    description: '성과관리에서 정한 기준을 팀원이 바로 실행할 수 있는 과제, 완료 기준, 지원 조건으로 바꿉니다.',
  },
  {
    id: 'task-priority-flow',
    title: '업무관리 2: 우선순위와 업무 흐름 정리하기',
    description: '먼저 할 일, 잠시 줄일 일, 업무 흐름, 막힘 신호, 중간 확인 질문을 정리합니다.',
  },
  {
    id: 'task-boundary-coordination',
    title: '업무관리 3: 혼자 해결하면 안 되는 일 구분하기',
    description: '팀원이 혼자 처리할 일, 팀장 확인이 필요한 일, 부서 협조와 상위 공유가 필요한 일을 구분합니다.',
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
