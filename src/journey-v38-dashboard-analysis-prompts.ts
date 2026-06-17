import type { V38TeamMember } from './journey-v38-dashboard-analysis-data';
import { createEmptyV38MemberPrep, type V38PrepState } from './journey-v38-dashboard-analysis-parsers';

export type V38MetricPromptInput = {
  teamSituations: string[];
  forbiddenItems: string[];
};

export type V38SignalPromptInput = {
  selectedMetricSummary: string[];
  metricRationale: string;
  aiRecommendedQuestions: string;
  selectedTeamMembers: V38TeamMember[];
  signalPromptMembers: V38TeamMember[];
  forbiddenItems: string[];
};

export type V38PrepPromptInput = {
  selectedMetricSummary: string[];
  aiSignalResult: string;
  memberPreps: V38PrepState;
  selectedDeliverables: Record<string, string[]>;
  selectedTeamMembers: V38TeamMember[];
  forbiddenItems: string[];
  actionOutputOptions: string[];
};

export function buildV38MetricPrompt({ teamSituations, forbiddenItems }: V38MetricPromptInput) {
  return [
    '당신은 제약영업 팀장의 실행관리 교육을 돕는 리더십 코치입니다.',
    '이 지표는 팀원을 평가하기 위한 점수표가 아니라, 팀장이 무엇을 확인하고 어떤 대화를 준비할지 정하기 위한 관찰 기준입니다.',
    '우리 팀 상황:',
    ...(teamSituations.length > 0 ? teamSituations.map((item) => `- ${item}`) : ['- 아직 선택하지 않았습니다. 참여자가 선택한 실제 팀 상황을 우선 기준으로 삼아야 합니다.']),
    '요청: 우리 팀 상황에 맞는 안전한 실행 관찰 지표 후보를 제안해 주세요.',
    '아래 섹션 제목을 반드시 그대로 사용해 주세요.',
    '## 1. 핵심 지표 후보',
    '## 2. 보완 지표 후보',
    '## 3. 안전선 지표 후보',
    '## 4. 우리 팀에는 맞지 않을 수 있는 지표',
    '## 5. 추가로 생각해볼 지표',
    '## 6. 팀장이 던질 수 있는 확인 질문',
    '각 지표는 표보다 아래 불릿 형식으로 작성해 주세요.',
    '- 지표명:',
    '  - 관찰 포인트:',
    '  - 필요한 이유:',
    '  - 단정 금지:',
    '주의:',
    ...forbiddenItems.map((item) => `- ${item}`),
    '- 지표는 실행 코칭과 다음 행동 준비에 연결될 수 있어야 합니다.',
    '- AI 추천은 최종 선택이 아니라 후보입니다. 팀장이 우리 팀 맥락에 맞게 다시 분리하고 걸러낼 수 있게 작성해 주세요.',
  ].join('\n');
}

export function buildV38SignalPrompt({
  selectedMetricSummary,
  metricRationale,
  aiRecommendedQuestions,
  selectedTeamMembers,
  signalPromptMembers,
  forbiddenItems,
}: V38SignalPromptInput) {
  return [
    '당신은 제약영업 팀장의 팀원 실행 Data 해석을 돕는 리더십 코치입니다.',
    '아래 팀원 유형 중 참여자가 우리 팀에 실제로 존재하거나 비슷하다고 선택한 유형을 중심으로 정리해 주세요.',
    '우리 팀이 최종 선택한 실행 관찰 지표:',
    ...selectedMetricSummary.map((item) => `- ${item}`),
    metricRationale ? `지표 선택 이유: ${metricRationale}` : '지표 선택 이유: 아직 작성하지 않았습니다.',
    aiRecommendedQuestions ? `참고 가능한 AI 추천 확인 질문:\n${aiRecommendedQuestions}` : '참고 가능한 AI 추천 확인 질문: 아직 정리하지 않았습니다.',
    '이 지표를 우선 렌즈로 사용하되, 팀원을 평가하거나 낙인찍지 마세요.',
    '반드시 피할 것:',
    ...forbiddenItems.map((item) => `- ${item}`),
    selectedTeamMembers.length > 0 ? `선택한 우리 팀 유사 유형: ${selectedTeamMembers.map((member) => member.name).join(' / ')}` : '선택한 우리 팀 유사 유형: 아직 선택하지 않았습니다. 아래 7명 전체를 참고용으로만 훑어보세요.',
    '팀원 실행 Data:',
    ...signalPromptMembers.flatMap((member, index) => [`${index + 1}. ${member.name}`, `- 프로필: ${member.profile}`, `- 관찰 장면: ${member.observation}`, `- 주요 실행 Data: ${member.signals.join(' / ')}`, '']),
    '출력 형식:',
    '각 팀원 이름을 제목으로 쓰고 아래 항목을 반드시 포함해 주세요.',
    '- 팀원별 관찰 신호:',
    '- 강점으로 볼 수 있는 신호:',
    '- 우려 또는 확인이 필요한 신호:',
    '- 추가로 확인해야 할 질문:',
    '- 성급하게 단정하면 안 되는 점:',
    '문제 직원, 동기 부족, 변화 저항처럼 단정하지 마세요.',
  ].join('\n');
}

export function buildV38PrepPrompt({
  selectedMetricSummary,
  aiSignalResult,
  memberPreps,
  selectedDeliverables,
  selectedTeamMembers,
  forbiddenItems,
  actionOutputOptions,
}: V38PrepPromptInput) {
  return [
    '당신은 제약영업 팀장이 팀원별 다음 행동 준비물을 만들도록 돕는 리더십 코치입니다.',
    'AI가 판단을 대신 확정하지 않도록, 관찰 신호와 선택한 팀장 행동 결과물에 맞춰 실무 준비물을 만들어 주세요.',
    '이번 실습에서 선택한 우리 팀 유사 유형:',
    ...(selectedTeamMembers.length > 0 ? selectedTeamMembers.map((member) => `- ${member.name}: ${member.profile}`) : ['- 아직 선택하지 않았습니다.']),
    '선택한 우리 팀 실행지표:',
    ...selectedMetricSummary.map((item) => `- ${item}`),
    '반드시 피할 것:',
    ...forbiddenItems.map((item) => `- ${item}`),
    'AI 1차 결과 붙여넣기 내용:',
    aiSignalResult || '아직 붙여넣지 않았습니다.',
    '선택한 유형별 분리 정리와 팀장 행동 선택:',
    ...selectedTeamMembers.flatMap((member, index) => {
      const current = memberPreps[member.id] ?? createEmptyV38MemberPrep();
      const choices = selectedDeliverables[member.id] ?? [];
      return [
        `${index + 1}. ${member.name}`,
        `- 팀원별 관찰 신호: ${current.observedSignal || '미작성'}`,
        `- 강점으로 볼 수 있는 신호: ${current.strengthSignal || '미작성'}`,
        `- 우려 또는 확인이 필요한 신호: ${current.concernSignal || '미작성'}`,
        `- 추가로 확인해야 할 질문: ${current.checkQuestion || '미작성'}`,
        `- 성급하게 단정하면 안 되는 점: ${current.doNotAssume || '미작성'}`,
        `- 팀장 행동 선택: ${choices.length > 0 ? choices.join(' / ') : '미선택'}`,
        '',
      ];
    }),
    '선택 가능한 준비물:',
    ...actionOutputOptions.map((item, index) => `${index + 1}. ${item}`),
    '출력 형식: 선택한 유형별로 선택된 준비물만 작성해 주세요. 각 유형 이름을 제목으로 쓰고 문장과 체크리스트 중심으로 작성해 주세요.',
  ].join('\n');
}
