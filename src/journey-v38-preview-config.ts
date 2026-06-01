import type { JourneyStep } from './journey-shell';

export const V38_STORAGE_KEYS = {
  participant: 'ckd-c1bio-v38-participant',
  progress: 'ckd-c1bio-v38-progress',
} as const;

export const V38_VISIBLE_APP_STEPS: JourneyStep[] = [
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
    title: '고객군 판단',
    description: '고객군 후보별 Data를 읽고 직접 분류한 뒤 후속 실행 판단의 근거를 만듭니다.',
  },
];

export function clampV38Step(step: number) {
  if (!Number.isFinite(step)) return 0;
  return Math.min(Math.max(Math.trunc(step), 0), V38_VISIBLE_APP_STEPS.length - 1);
}
