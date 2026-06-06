import { useMemo, useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';

const V39_PROMPT_PRACTICE_STORAGE_KEY = 'ckd.v39.promptPractice.v1';
const V39_PROMPT_PRACTICE_SMOKE_MARKERS = [
  'V39PromptPracticeLab',
  '일반 질문과 구조화 질문의 차이',
  '우리 팀 고민을 AI가 알아듣는 질문으로 바꾸기',
  '역할·맥락·요청·출력 형식',
  'AI 없이도 할 수 있습니다',
  'AI를 쓰면 좋아지는 점',
  '제약영업 현장을 오래 해본 선배 팀장',
  '영업활동 기록',
  '방문·면담 기록',
  '고객 활동 Data',
  '사내 시스템/CRM',
  '고객 Data와 실행 신호 고민',
  '팀원 실행과 대화 고민',
  'AI 활용과 실행계획 고민',
  '결과 활용 목적',
  'AI 답변 1차 분리 정리',
  '[원인 가설]',
  '[팀장이 확인할 질문]',
  '[2주 관리 지표 후보]',
  '[조심할 해석]',
  '[팀 회의 첫 설명 문장]',
  '상황 설명',
  '4단계 AI 전략 리서치로 넘길 질문',
  '아직 선택한 고민이 없습니다',
  'Block 1 선택한 고민 요약',
].join('|');
void V39_PROMPT_PRACTICE_SMOKE_MARKERS;

type RoleOption = {
  id: string;
  label: string;
  promptText: string;
  useWhen: string;
};

type ConcernGroupId = 'customer-data' | 'member-execution' | 'ai-execution';

type ConcernOption = {
  id: string;
  groupId: ConcernGroupId;
  label: string;
  situationSummary: string;
  plainQuestion: string;
  context: string;
  task: string;
  downstreamHint: string;
  downstreamSteps: string[];
};

type PromptPracticeResponse = {
  concernId: string;
  customConcern: string;
  plainQuestion: string;
  roleId: string;
  customRole: string;
  context: string;
  task: string;
  format: string;
  aiPlainAnswer: string;
  aiStructuredAnswer: string;
  differenceMemo: string;
  finalPrompt: string;
  copiedPrompt: string;
  reviewChecks: Record<string, boolean>;
  savedAt: string;
};

const CONCERN_GROUPS: { id: ConcernGroupId; title: string; description: string }[] = [
  {
    id: 'customer-data',
    title: 'A. 고객 Data와 실행 신호 고민',
    description: '고객 반응, 방문·면담 기록, 신규 접점, Data 해석 기준이 흐릿할 때 고릅니다.',
  },
  {
    id: 'member-execution',
    title: 'B. 팀원 실행과 대화 고민',
    description: '저연차와 기존 팀원의 실행 온도차, 역할 부여, 상부 요구와 현장 제약 사이의 설명이 어려울 때 고릅니다.',
  },
  {
    id: 'ai-execution',
    title: 'C. AI 활용과 실행계획 고민',
    description: 'AI 활용 범위, 회의 설명 구조, 실행계획 통합과 안전한 표현 기준이 고민될 때 고릅니다.',
  },
];

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'senior-manager',
    label: '선배 영업팀장',
    promptText: '제약영업 현장을 오래 해본 선배 팀장 입장에서 봐주세요.',
    useWhen: '현장감 있는 판단과 팀장 관점의 조언이 필요할 때',
  },
  {
    id: 'head-office',
    label: '영업본부장',
    promptText: '본부장에게 보고받는 사람 입장에서, 숫자와 현장 설명이 납득되는지 봐주세요.',
    useWhen: '상위 보고 메시지와 근거가 설득력 있는지 점검할 때',
  },
  {
    id: 'sales-planning',
    label: '영업기획 담당자',
    promptText: '영업기획 담당자 입장에서, 이번 2주 동안 확인할 관리 기준을 정리해 주세요.',
    useWhen: '관리 지표와 실행 기준을 정리할 때',
  },
  {
    id: 'sales-record-support',
    label: '영업활동 기록/영업지원 담당자',
    promptText: '영업활동 기록과 고객 활동 Data를 보는 담당자 입장에서, 어떤 기록을 더 확인해야 할지 봐주세요. 필요하면 사내 시스템/CRM에 남긴 활동 기록 관점도 함께 봐주세요.',
    useWhen: '고객 활동 Data와 방문·면담 기록 품질을 볼 때',
  },
  {
    id: 'compliance',
    label: '컴플라이언스 담당자',
    promptText: '제약영업 컴플라이언스 담당자 입장에서, 조심해야 할 표현과 자료 사용 기준을 봐주세요.',
    useWhen: '표현·자료·고객 대화 안전선을 점검할 때',
  },
  {
    id: 'peer-manager',
    label: '동료 팀장',
    promptText: '비슷한 팀을 맡고 있는 동료 팀장 입장에서, 제가 놓치고 있는 부분을 짚어주세요.',
    useWhen: '팀원에게 어떻게 설명할지 현실적인 피드백이 필요할 때',
  },
];

const CONCERN_OPTIONS: ConcernOption[] = [
  {
    id: 'follow-up-gap',
    groupId: 'customer-data',
    label: '방문은 하는데 다음 대화나 후속조치로 잘 이어지지 않는다',
    situationSummary: '방문 횟수는 유지되고 있지만 고객 질문, 자료 요청, 다음 약속, 후속 확인으로 이어지는 경우가 적습니다. 팀원들도 방문 이후 무엇을 남겨야 하는지 기준이 다릅니다.',
    plainQuestion: '방문은 하고 있는데 후속조치가 잘 이어지지 않습니다. 어떻게 해야 하나요?',
    context: '우리 팀은 고객 방문과 접촉 활동은 꾸준히 하고 있지만, 방문 이후 다음 대화, 자료 요청 대응, 후속 일정 확인으로 이어지는 비율은 낮습니다. 고연차 팀원은 “현장은 숫자로만 보면 안 됩니다”라고 말하고, 저연차 팀원은 “무엇을 후속조치로 봐야 할지 기준이 필요합니다”라고 말합니다.',
    task: '이 상황에서 팀장이 확인해야 할 원인 가설과, 이번 2주 동안 볼 수 있는 관리 지표 후보를 정리해 주세요. 단순 활동량보다 후속 행동과 고객 대화 품질을 볼 수 있는 기준을 포함해 주세요.',
    downstreamHint: '관리 지표 → 고객 Data 확인 List → 고객군 × 팀원 실행 Map',
    downstreamSteps: ['5단계 후속조치 완료율·다음접점 확보건수', '6단계 고객 질문·자료 요청·다음 일정 확인', '7단계 반응 변화 고객군과 후속 대화 담당 연결'],
  },
  {
    id: 'activity-record-blindspot',
    groupId: 'customer-data',
    label: '영업활동 기록은 남기지만 고객 반응과 다음 행동이 잘 보이지 않는다',
    situationSummary: '방문·면담 기록은 남아 있지만 고객이 무엇에 반응했는지, 다음에 무엇을 확인해야 하는지가 흐릿합니다. 기록은 있는데 실행 기준으로 쓰기 어렵습니다.',
    plainQuestion: '영업활동 기록은 있는데 고객 반응과 다음 행동이 잘 보이지 않습니다. 어떻게 정리하면 좋을까요?',
    context: '우리 팀은 사내 영업활동 기록에는 방문·면담 내용이 남아 있지만, 고객 질문, 자료 요청, 다음 접점, 후속조치가 멈춘 이유는 팀원마다 다르게 적고 있습니다. 숫자는 보이지만 고객 반응의 질과 다음 행동을 비교하기 어렵습니다.',
    task: '영업활동 기록과 고객 활동 Data에서 팀장이 꼭 봐야 할 항목을 정리해 주세요. 고객 반응, 다음 행동, 부족 정보, 조심할 해석을 구분해 이번 2주 관리 기준으로 바꿔 주세요.',
    downstreamHint: '관리 지표 → 고객 Data 확인 List → 기록 품질 점검',
    downstreamSteps: ['5단계 고객 질문 기록률·후속조치 완료율', '6단계 기록 품질·부족 정보·추가 확인 질문', '8단계 기록 보완 담당과 점검 질문 연결'],
  },
  {
    id: 'existing-customer-bias',
    groupId: 'customer-data',
    label: '기존 거래처 중심으로 활동이 몰리고 신규 접점은 계속 뒤로 밀린다',
    situationSummary: '익숙한 고객군 방문은 계속되지만 새롭게 봐야 할 고객군은 정보 부족과 접근 부담 때문에 뒤로 밀립니다. 상부는 신규 접점을 요구하지만 현장 부담은 큽니다.',
    plainQuestion: '기존 고객 중심으로만 활동이 몰리는데 신규 접점을 어떻게 봐야 할까요?',
    context: '팀원들은 익숙한 고객군에는 안정적으로 방문하지만, 신규·미접촉 고객군은 접근 경로가 애매하다는 이유로 뒤로 밀리는 경우가 많습니다. 상부에서는 신규 접점 확대를 요구하지만, 현장에서는 방문 제약과 정보 부족을 이야기합니다.',
    task: '기존 고객 편중을 확인할 수 있는 고객 활동 Data 항목과, 신규 접점을 무리 없이 늘리기 위한 2주 실행 기준을 정리해 주세요. 단순 신규 방문 수가 아니라 접근 경로, 고객 반응, 후속 가능성까지 포함해 주세요.',
    downstreamHint: '관리 지표 → 고객군 편중 확인 → 신규 접점 실행 Map',
    downstreamSteps: ['5단계 신규접촉 고객수·신규고객 방문비율', '6단계 기존 고객 편중과 미접촉 고객군 확인', '7단계 신규·미접촉 고객군의 안전한 첫 접점 설계'],
  },
  {
    id: 'customer-signal-ambiguity',
    groupId: 'customer-data',
    label: '고객이 관심을 보인 것 같은데 어떤 신호를 기회로 봐야 할지 애매하다',
    situationSummary: '고객 질문이나 자료 요청이 있었지만 이것을 실제 기회 신호로 봐도 되는지 판단이 어렵습니다. 팀원마다 같은 반응을 다르게 해석합니다.',
    plainQuestion: '고객 반응 중 어떤 것을 기회 신호로 봐야 할지 잘 모르겠습니다.',
    context: '일부 고객은 질문이 늘고 자료를 요청하지만, 이것이 실제 다음 대화로 이어질 수 있는 신호인지 단순 관심인지 판단이 어렵습니다. 팀원들도 같은 반응을 다르게 해석해 실행 방향이 흔들립니다.',
    task: '고객 반응을 기회 신호, 주의 신호, 아직 부족한 정보로 나누는 기준을 정리해 주세요. 고객을 평가하거나 등급화하지 않고, 다음 확인 질문 중심으로 정리해 주세요.',
    downstreamHint: '고객 Data 확인 List → 기회/주의 신호 → 안전한 다음 질문',
    downstreamSteps: ['6단계 기회 신호·주의 신호·부족 정보 구분', '7단계 고객군별 대응 강도 조정', '11단계 전환 가능성 단정 표현 제거'],
  },
  {
    id: 'data-interpretation-gap',
    groupId: 'customer-data',
    label: '팀원마다 같은 고객 Data를 다르게 해석해 실행 방향이 엇갈린다',
    situationSummary: '같은 고객 활동 Data를 보고도 어떤 팀원은 움직일 때라고 보고, 다른 팀원은 아직 이르다고 판단합니다. 팀 회의에서 기준이 맞지 않아 실행 방향이 흐려집니다.',
    plainQuestion: '같은 고객 Data를 팀원마다 다르게 해석합니다. 어떻게 기준을 맞추면 좋을까요?',
    context: '같은 고객 활동 Data를 보고도 어떤 팀원은 “기회가 있다”고 보고, 다른 팀원은 “아직 움직일 상황이 아니다”라고 판단합니다. 팀 회의에서 고객군별 대응 방향을 정하려 해도 해석 기준이 맞지 않아 결론이 흐려집니다.',
    task: '팀원들이 고객 Data를 해석할 때 함께 쓸 수 있는 기준을 정리해 주세요. 기회 신호, 주의 신호, 부족 정보, 추가 확인 질문을 구분하고 팀 회의에서 설명할 문장도 제안해 주세요.',
    downstreamHint: '고객 Data 해석 기준 → 실행 Map → 팀 회의 설명 문장',
    downstreamSteps: ['6단계 Data 분석 관점 통일', '7단계 고객군 × 팀원 실행 Map', '10단계 팀 회의 설명 문장 생성'],
  },
  {
    id: 'junior-senior-temperature-gap',
    groupId: 'member-execution',
    label: '저연차 팀원은 우선순위를 어려워하고 기존 팀원은 예전 방식이 낫다고 느낀다',
    situationSummary: '저연차 팀원은 무엇부터 해야 할지 몰라 움직임이 느리고, 기존 팀원은 새로운 기준이 번거롭다고 느낍니다. 같은 실행계획도 팀원마다 받아들이는 온도가 다릅니다.',
    plainQuestion: '저연차 팀원과 기존 팀원의 실행 온도차를 어떻게 다뤄야 할까요?',
    context: '저연차 팀원은 고객 활동 Data를 보고도 무엇을 먼저 해야 할지 몰라 움직임이 느립니다. 반면 기존 팀원은 “예전에는 이렇게까지 따지지 않았다”고 느끼며 새로운 기준을 부담스러워합니다.',
    task: '저연차 팀원과 기존 팀원이 다르게 받아들일 수 있는 지점을 정리하고, 팀장이 실행 기준을 설명할 때 사용할 첫 문장과 점검 질문을 제안해 주세요.',
    downstreamHint: '팀원 역할 보완 → 실행 대화 → 첫마디 전환',
    downstreamSteps: ['8단계 팀원별 역할 미션과 지원 포인트', '9단계 기존 팀원과 저연차 팀원의 수용 차이 점검', '10단계 팀원별 실행 요청 문장 생성'],
  },
  {
    id: 'pressure-vs-field-constraint',
    groupId: 'member-execution',
    label: '상부는 활동량과 속도를 요구하지만 현장에서는 고객 반응과 방문 제약이 커지고 있다',
    situationSummary: '상부는 활동량과 속도를 요구하지만 현장에서는 일정 변경, 방문 제한, 자료 확인 지연이 늘고 있습니다. 숫자와 현장 설명을 함께 정리해야 합니다.',
    plainQuestion: '상부의 활동량 요구와 현장의 방문 제약 사이에서 어떤 기준으로 설명해야 할까요?',
    context: '상부에서는 활동량, 실행 속도, 신규 접점을 강조합니다. 하지만 현장에서는 고객 일정 변경, 방문 제한, 자료 확인 지연, 후속 대화 제약이 커지고 있습니다. 팀장으로서 숫자와 현장 설명을 함께 정리해야 합니다.',
    task: '상부 보고와 팀 실행관리에서 함께 쓸 수 있는 기준을 정리해 주세요. 활동량, 전환 신호, 고객 반응, 제약요인을 구분하고 이번 2주 동안 확인할 지표 후보를 제안해 주세요.',
    downstreamHint: '관리 지표 → 제약요인 확인 → 보고/회의 설명 문장',
    downstreamSteps: ['5단계 활동·전환·품질 지표 균형', '6단계 방문 제한·일정 변경 패턴 확인', '10단계 팀 회의 설명 문장과 중간 점검 방식'],
  },
  {
    id: 'role-assignment-first-message',
    groupId: 'member-execution',
    label: '팀원에게 역할을 맡기려 해도 지시처럼 들릴까 봐 첫마디가 어렵다',
    situationSummary: '고객군별로 역할을 나눠야 하지만 특정 팀원에게 맡기면 부담이나 지시로 들릴 수 있습니다. 왜 이 역할인지 어떻게 말해야 할지 고민됩니다.',
    plainQuestion: '팀원에게 역할을 맡길 때 지시처럼 들리지 않게 말하려면 어떻게 해야 하나요?',
    context: '고객군별 대응 방향은 어느 정도 정했지만, 팀원에게 역할을 맡기는 첫마디가 어렵습니다. 어떤 팀원은 부담으로 받아들일 수 있고, 어떤 팀원은 “왜 나에게만 맡기나”라고 느낄 수 있습니다.',
    task: '팀원에게 역할을 맡길 때 사용할 수 있는 실행 대화 문장을 정리해 주세요. 역할 기준, 팀장이 지원할 것, 중간 점검 질문, 피해야 할 표현을 포함해 주세요.',
    downstreamHint: '실행 Map → 역할 보완 → 실행 대화 첫마디',
    downstreamSteps: ['7단계 팀원 연결 기준 확인', '8단계 역할 미션과 팀장 지원 포인트', '9단계 지시가 아닌 실행 대화 문장'],
  },
  {
    id: 'ai-boundary-anxiety',
    groupId: 'ai-execution',
    label: 'AI로 실행계획을 만들 수는 있을 것 같은데 어디까지 물어봐도 되는지 불안하다',
    situationSummary: 'AI를 쓰면 회의 문장이나 실행계획 초안을 빨리 만들 수 있을 것 같지만 고객명, 제품명, 내부 수치, 미승인 표현이 들어갈까 봐 조심스럽습니다.',
    plainQuestion: '제약영업에서 AI에게 어디까지 물어봐도 되는지 불안합니다. 기준을 정리해 주세요.',
    context: 'AI를 쓰면 실행계획 초안이나 팀 회의 문장을 빨리 만들 수 있을 것 같지만, 고객명, 병원명, 제품명, 내부 수치, 미승인 표현이 들어가면 위험할 수 있다는 걱정이 있습니다. 팀원들도 AI 활용 기준을 명확히 알고 싶어 합니다.',
    task: '제약영업 팀장이 AI에게 물어볼 수 있는 것과 피해야 할 것을 구분해 주세요. 안전한 프롬프트 작성 기준, 위험 표현, 대체 문장, 최종 검토 체크리스트를 정리해 주세요.',
    downstreamHint: 'AI 실행계획 Prompt → 컴플라이언스 점검 → 안전 문장',
    downstreamSteps: ['10단계 AI 실행계획 Prompt 안전 조건', '11단계 위험 표현 제거', '12단계 최종 카드의 컴플라이언스 포인트'],
  },
  {
    id: 'meeting-message-unclear',
    groupId: 'ai-execution',
    label: '팀 회의에서 실행 기준을 설명해야 하는데 지표·고객 Data·팀원 역할이 하나로 정리되지 않는다',
    situationSummary: '이번 2주 동안 무엇을 볼지, 고객 활동 Data에서 무엇을 확인할지, 팀원이 어떤 역할을 맡을지 정리해야 합니다. 하지만 회의에서 설명할 한 흐름으로 아직 묶이지 않습니다.',
    plainQuestion: '팀 회의에서 실행 기준을 어떻게 설명해야 할지 정리가 안 됩니다.',
    context: '이번 2주 동안 무엇을 볼지, 고객 활동 Data에서 무엇을 확인할지, 어떤 팀원이 어떤 역할을 맡을지까지 정해야 합니다. 하지만 팀 회의에서 설명하려고 하면 관리 지표, 고객 Data, 팀원 역할, 컴플라이언스 기준이 따로 노는 느낌입니다.',
    task: '팀 회의에서 사용할 실행 기준 설명 구조를 정리해 주세요. 관리 지표, 고객 Data 확인 List, 팀원 역할, 안전한 표현 기준, 마지막 확인 질문을 하나의 흐름으로 묶어 주세요.',
    downstreamHint: '통합 실행계획 → 최종 2주 실행 카드 → 강사용 토의 질문',
    downstreamSteps: ['10단계 팀 회의 설명 문장', '12단계 최종 2주 실행 카드', '13단계 관리 지표 선택 이유와 2주 후 리뷰 질문'],
  },
];

const DEFAULT_FORMAT = [
  '아래 5개 제목을 그대로 사용해 주세요. 제목 이름을 바꾸지 마세요.',
  '',
  '[원인 가설]',
  '- 3개 bullet로 작성',
  '',
  '[팀장이 확인할 질문]',
  '- 5개 bullet로 작성',
  '',
  '[2주 관리 지표 후보]',
  '- 5개 bullet로 작성',
  '- 각 지표는 “지표명 / 무엇을 보는지 / 조심할 해석” 형식으로 작성',
  '',
  '[조심할 해석]',
  '- 3개 bullet로 작성',
  '',
  '[팀 회의 첫 설명 문장]',
  '- 팀장이 회의에서 바로 말할 수 있는 문장 1개',
].join('\n');

const STRUCTURED_ANSWER_SECTION_TITLES = [
  '원인 가설',
  '팀장이 확인할 질문',
  '2주 관리 지표 후보',
  '조심할 해석',
  '팀 회의 첫 설명 문장',
] as const;

type StructuredAnswerSectionTitle = typeof STRUCTURED_ANSWER_SECTION_TITLES[number];

const REVIEW_ITEMS = [
  '일반 질문과 구조화 질문의 차이를 비교했는가?',
  '역할을 “누구의 도움을 받을 것인가”로 정했는가?',
  '우리 팀 상황이 실제 장면처럼 들어갔는가?',
  '요청이 분석·정리·실행 기준 중 무엇인지 분명한가?',
  '출력 형식이 후속 단계에서 바로 쓸 수 있게 정리되었는가?',
  '결과 활용 목적이 관리 지표·고객 활동 기록·팀원 질문 중 어디로 이어지는지 확인했는가?',
  '실제 고객명·병원명·의료진명·제품명·내부 수치·개인정보를 넣지 않았는가?',
];

const DEFAULT_RESPONSE: PromptPracticeResponse = {
  concernId: '',
  customConcern: '',
  plainQuestion: '',
  roleId: ROLE_OPTIONS[0].id,
  customRole: '',
  context: '',
  task: '',
  format: DEFAULT_FORMAT,
  aiPlainAnswer: '',
  aiStructuredAnswer: '',
  differenceMemo: '',
  finalPrompt: '',
  copiedPrompt: '',
  reviewChecks: {},
  savedAt: '',
};

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-black text-slate-900">{title}</h3>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function FieldLabel({ children }: { children: string }) {
  return <span className="text-xs font-black text-slate-500">{children}</span>;
}

function TextArea({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <textarea className="min-h-24 w-full rounded-xl border px-3 py-2 text-sm leading-6" value={value ?? ''} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />;
}

function getSelectedConcern(id: string) {
  return CONCERN_OPTIONS.find((item) => item.id === id);
}

function getConcern(id: string) {
  return getSelectedConcern(id) ?? CONCERN_OPTIONS[0];
}

function getConcernGroup(groupId: ConcernGroupId) {
  return CONCERN_GROUPS.find((item) => item.id === groupId) ?? CONCERN_GROUPS[0];
}

function getRole(response: PromptPracticeResponse) {
  if (response.customRole.trim()) return response.customRole.trim();
  return ROLE_OPTIONS.find((item) => item.id === response.roleId)?.promptText ?? ROLE_OPTIONS[0].promptText;
}

function buildResultPurpose(concern?: ConcernOption) {
  if (!concern) {
    return '이 답변은 이후에 ① 이번 2주 동안 볼 관리 지표 후보, ② 고객 활동 기록에서 확인할 항목, ③ 팀원에게 물어볼 실행·기록 보완 질문으로 활용할 예정입니다.';
  }

  if (concern.groupId === 'customer-data') {
    return '이 답변은 이후에 ① 이번 2주 동안 볼 관리 지표 후보, ② 고객 활동 기록에서 확인할 항목, ③ 팀원에게 물어볼 기록 보완 질문으로 활용할 예정입니다.';
  }

  if (concern.groupId === 'member-execution') {
    return '이 답변은 이후에 ① 팀원별 실행 역할 보완, ② 팀원에게 꺼낼 첫 문장, ③ 팀장이 중간에 확인할 질문으로 활용할 예정입니다.';
  }

  return '이 답변은 이후에 ① 안전한 AI 질문 초안, ② 실행계획 설명 문장, ③ 표현·자료 안전선 점검 기준으로 활용할 예정입니다.';
}

function buildStructuredPrompt(response: PromptPracticeResponse) {
  const concern = getSelectedConcern(response.concernId);
  const concernLabel = response.customConcern.trim() || concern?.label || '아직 우리 팀 고민을 선택하지 않았습니다.';
  const context = response.context.trim() || concern?.context || '아직 구체적인 팀 상황을 입력하지 않았습니다. 먼저 우리 팀에 가까운 고민을 선택하거나 직접 입력해 주세요.';
  const task = response.task.trim() || concern?.task || '위 상황에서 팀장이 먼저 확인해야 할 질문과 다음 단계로 넘길 실행 기준을 정리해 주세요.';
  const resultPurpose = buildResultPurpose(concern);

  return `역할:\n${getRole(response)}\n\n우리 팀 고민:\n${concernLabel}\n\n맥락:\n${context}\n\n요청:\n${task}\n\n결과 활용 목적:\n${resultPurpose}\n\n출력 형식:\n${response.format.trim() || DEFAULT_FORMAT}\n\n주의사항:\n- 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 사용하지 마세요.\n- 고객을 점수화하거나 등급화하지 마세요.\n- 처방 가능성, 전환 가능성, 공략, 비교 우위 단정 표현은 피하세요.\n- AI 답변은 초안이며, 최종 판단과 수정은 팀장이 합니다.`;
}

function buildOutput(response: PromptPracticeResponse, prompt: string) {
  const concern = getSelectedConcern(response.concernId);
  const group = concern ? getConcernGroup(concern.groupId) : undefined;
  return `[3단계 결과: 일반 질문을 구조화 프롬프트로 바꾸기]\n\n[우리 팀 고민]\n${response.customConcern || concern?.label || '아직 선택한 고민 없음'}\n\n[고민 그룹]\n${group?.title || '아직 선택한 고민 없음'}\n\n[상황 설명]\n${concern?.situationSummary || '-'}\n\n[일반 질문]\n${response.plainQuestion || '-'}\n\n[구조화 프롬프트]\n${prompt}\n\n[결과 활용 목적]\n${buildResultPurpose(concern)}\n\n[일반 질문과 구조화 질문의 차이 메모]\n${response.differenceMemo || '-'}\n\n[4단계 AI 전략 리서치로 넘길 질문]\n${response.task || '-'}`;
}

function normalizeAiSectionHeading(line: string) {
  return line
    .trim()
    .replace(/^#{1,6}\s*/, '')
    .replace(/^\d+[.)]\s*/, '')
    .replace(/^\[|\]$/g, '')
    .replace(/[:：]$/g, '')
    .trim();
}

function parseStructuredAiAnswer(text: string) {
  const parsed = STRUCTURED_ANSWER_SECTION_TITLES.reduce<Record<StructuredAnswerSectionTitle, string>>((acc, title) => {
    acc[title] = '';
    return acc;
  }, {} as Record<StructuredAnswerSectionTitle, string>);

  let currentTitle: StructuredAnswerSectionTitle | null = null;

  text.split(/\r?\n/).forEach((line) => {
    const normalized = normalizeAiSectionHeading(line);
    const matchedTitle = STRUCTURED_ANSWER_SECTION_TITLES.find((title) => normalized === title);

    if (matchedTitle) {
      currentTitle = matchedTitle;
      return;
    }

    if (currentTitle) {
      parsed[currentTitle] = [parsed[currentTitle], line].filter(Boolean).join('\n');
    }
  });

  return parsed;
}

function hasParsedStructuredAnswer(parsed: Record<StructuredAnswerSectionTitle, string>) {
  return STRUCTURED_ANSWER_SECTION_TITLES.some((title) => parsed[title].trim());
}

function StructuredAnswerExtraction({ answer }: { answer: string }) {
  const parsed = useMemo(() => parseStructuredAiAnswer(answer), [answer]);
  const hasAnswer = answer.trim().length > 0;
  const hasParsed = hasParsedStructuredAnswer(parsed);

  if (!hasAnswer) return null;

  return (
    <section className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm font-bold leading-6 text-cyan-950">
      <p className="font-black">AI 답변 1차 분리 정리</p>
      <p className="mt-1 text-xs font-bold text-cyan-800">AI 답변은 최종안이 아닙니다. 아래 분리 내용은 팀장이 검토·수정할 초안입니다.</p>
      {!hasParsed ? (
        <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950">
          고정 제목을 찾지 못했습니다. AI 답변에 [원인 가설], [팀장이 확인할 질문], [2주 관리 지표 후보], [조심할 해석], [팀 회의 첫 설명 문장] 제목이 그대로 들어 있는지 확인하세요.
        </div>
      ) : null}
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {STRUCTURED_ANSWER_SECTION_TITLES.map((title) => (
          <article key={title} className="rounded-2xl border border-white bg-white p-3 text-xs leading-5 text-slate-700 shadow-sm">
            <p className="font-black text-slate-950">{title}</p>
            <pre className="mt-2 whitespace-pre-wrap font-sans text-xs leading-5">{parsed[title].trim() || '아직 분리된 내용이 없습니다.'}</pre>
          </article>
        ))}
      </div>
    </section>
  );
}

function SelectedConcernSummary({ concern, group, customConcern, emptyMode = 'compact' }: { concern?: ConcernOption; group?: { id: ConcernGroupId; title: string; description: string }; customConcern: string; emptyMode?: 'compact' | 'block' }) {
  const custom = customConcern.trim();

  if (!concern && !custom) {
    return (
      <div className={`rounded-2xl border border-slate-200 bg-slate-50 p-3 ${emptyMode === 'block' ? 'text-sm' : 'text-xs'} font-bold leading-5 text-slate-600`}>
        <p className="font-black text-slate-900">아직 선택한 고민이 없습니다.</p>
        <p className="mt-1">위 Block 0에서 우리 팀에 가장 가까운 고민을 하나 고르면, 이곳에 선택한 고민과 이후 단계 연결 방향이 표시됩니다.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-cyan-200 bg-cyan-50 p-3 ${emptyMode === 'block' ? 'text-sm' : 'text-xs'} font-bold leading-5 text-cyan-950`}>
      <p className="font-black">선택한 고민: {custom || concern?.label}</p>
      {concern ? <p className="mt-1">상황 설명: {concern.situationSummary}</p> : <p className="mt-1">직접 입력한 고민입니다. 필요하면 위 카드 중 가장 가까운 상황도 함께 선택하세요.</p>}
      <p className="mt-2">결과 활용 목적: {buildResultPurpose(concern)}</p>
      {group ? <p className="mt-1 text-cyan-800">이 고민은 {group.title.replace(/^[A-C]\.\s*/, '')}에 속합니다.</p> : null}
    </div>
  );
}

export function V39PromptPracticeLab() {
  const [storedResponse, setResponse] = useStored<PromptPracticeResponse>(V39_PROMPT_PRACTICE_STORAGE_KEY, DEFAULT_RESPONSE);
  const response = { ...DEFAULT_RESPONSE, ...storedResponse, reviewChecks: storedResponse.reviewChecks ?? {} };
  const [copyMessage, setCopyMessage] = useState('');
  const structuredPrompt = useMemo(() => response.finalPrompt || buildStructuredPrompt(response), [response]);
  const checkedCount = REVIEW_ITEMS.filter((item) => response.reviewChecks[item]).length;
  const selectedConcern = getSelectedConcern(response.concernId);
  const selectedGroup = selectedConcern ? getConcernGroup(selectedConcern.groupId) : undefined;

  const update = (patch: Partial<PromptPracticeResponse>) => {
    setResponse({ ...response, ...patch, savedAt: new Date().toISOString() });
  };

  const selectConcern = (concernId: string) => {
    const concern = getConcern(concernId);
    update({
      concernId,
      customConcern: '',
      plainQuestion: concern.plainQuestion,
      context: concern.context,
      task: concern.task,
      format: DEFAULT_FORMAT,
      finalPrompt: '',
      aiPlainAnswer: '',
      aiStructuredAnswer: '',
      differenceMemo: '',
    });
  };

  const generatePrompt = () => {
    update({ finalPrompt: buildStructuredPrompt(response) });
    setCopyMessage('결과 활용 목적과 고정 출력 제목을 포함한 구조화 프롬프트를 만들었습니다. 실제 말투에 맞게 한 번 더 다듬어보세요.');
  };

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      update({ copiedPrompt: text });
      setCopyMessage(`${label}을 복사했습니다.`);
    } catch {
      setCopyMessage('복사가 차단되었습니다. 내용을 직접 선택해 복사하세요.');
    }
  };

  const outputText = buildOutput(response, structuredPrompt);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950">
        <p className="font-black">3단계. 우리 팀 고민을 AI가 알아듣는 질문으로 바꾸기</p>
        <p className="mt-1">팀장의 고민은 머릿속에 있지만, AI는 그 맥락을 모릅니다. 이번 단계에서는 평소처럼 짧게 묻는 일반 질문과 역할·맥락·요청·출력 형식이 들어간 구조화 질문의 차이를 직접 확인합니다.</p>
        <p className="mt-1 text-xs font-bold">영업활동 기록, 방문·면담 기록, 고객 활동 Data를 기본 표현으로 사용합니다. 회사마다 부르는 사내 시스템 이름이 다를 수 있으므로 CRM은 필요할 때만 사내 시스템/CRM으로 함께 표시합니다.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
          <p className="font-black text-slate-950">AI 없이도 할 수 있습니다</p>
          <p className="mt-1">팀장은 경험과 현장 감각으로 문제를 말하고, 선배·동료에게 조언을 구하고, 회의에서 방향을 잡을 수 있습니다.</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
          <p className="font-black">AI를 쓰면 좋아지는 점</p>
          <p className="mt-1">머릿속 고민을 더 빨리 꺼내고, 누구의 관점으로 볼지 정하고, 답변을 관리 지표·고객 Data 확인 질문·회의 문장 형태로 받을 수 있습니다.</p>
        </div>
      </section>

      <SectionCard title="Block 0. 우리 팀에 가까운 고민 선택">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold leading-5 text-slate-700">
          아래 카드는 과정 설명이 아니라 현업 상황 예시입니다. 먼저 “우리 팀 이야기 같다”는 상황을 고르고, 선택 후 요약 박스에서만 이후 활용 방향을 확인합니다.
        </div>
        <SelectedConcernSummary concern={selectedConcern} group={selectedGroup} customConcern={response.customConcern} />
        <div className="space-y-4">
          {CONCERN_GROUPS.map((group) => {
            const groupConcerns = CONCERN_OPTIONS.filter((item) => item.groupId === group.id);
            return (
              <section key={group.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3">
                  <h4 className="text-sm font-black text-slate-950">{group.title}</h4>
                  <p className="mt-1 text-xs font-bold leading-5 text-slate-600">{group.description}</p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {groupConcerns.map((item) => {
                    const selected = response.concernId === item.id;
                    return (
                      <button key={item.id} type="button" className={`rounded-2xl border p-4 text-left text-sm font-bold leading-6 ${selected ? 'border-cyan-300 bg-cyan-50 text-cyan-950' : 'bg-white text-slate-700'}`} onClick={() => selectConcern(item.id)}>
                        <span className="block font-black">{item.label}</span>
                        <span className="mt-2 block rounded-xl bg-white/70 px-3 py-2 text-xs leading-5 text-slate-600">{item.situationSummary}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
        <label className="block space-y-1"><FieldLabel>우리 팀 고민 직접 입력</FieldLabel><input className="w-full rounded-xl border px-3 py-2 text-sm" value={response.customConcern} onChange={(event) => update({ customConcern: event.target.value, finalPrompt: '' })} placeholder="예: 방문·면담 기록은 있는데 고객 반응을 어떻게 봐야 할지 애매하다" /></label>
      </SectionCard>

      <SectionCard title="Block 1. 일반 질문으로 먼저 물어보기">
        <SelectedConcernSummary concern={selectedConcern} group={selectedGroup} customConcern={response.customConcern} emptyMode="block" />
        <p className="text-sm font-bold leading-6 text-slate-600">먼저 평소처럼 짧게 물어봅니다. 이 답변은 대체로 맞는 말이지만, 우리 팀 상황에 바로 쓰기에는 밋밋할 수 있습니다.</p>
        <label className="block space-y-1"><FieldLabel>일반 질문</FieldLabel><TextArea value={response.plainQuestion} onChange={(value) => update({ plainQuestion: value })} placeholder="위에서 고민을 선택하면 일반 질문 예시가 자동으로 들어옵니다." /></label>
        <button type="button" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(response.plainQuestion, '일반 질문')}>일반 질문 복사</button>
        <label className="block space-y-1"><FieldLabel>일반 질문에 대한 AI 답변 붙여넣기</FieldLabel><TextArea value={response.aiPlainAnswer} onChange={(value) => update({ aiPlainAnswer: value })} placeholder="AI 답변을 붙여넣고, 답변이 왜 일반론처럼 느껴지는지 확인합니다." /></label>
      </SectionCard>

      <SectionCard title="Block 2. 역할·맥락·요청·출력 형식으로 재작성">
        <div className="rounded-2xl bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-700">
          <p className="font-black text-slate-950">역할은 “누구의 도움을 받을 것인가”입니다.</p>
          <p className="mt-1">추상적인 코치·전문가보다, 선배 팀장·본부장·영업기획 담당자·영업활동 기록/영업지원 담당자·컴플라이언스 담당자처럼 실제 현업에서 떠올릴 수 있는 사람의 관점을 선택합니다.</p>
        </div>
        <label className="block space-y-1"><FieldLabel>역할 선택</FieldLabel><select className="w-full rounded-xl border bg-white px-3 py-2 text-sm" value={response.roleId} onChange={(event) => update({ roleId: event.target.value, finalPrompt: '' })}>{ROLE_OPTIONS.map((item) => <option key={item.id} value={item.id}>{item.label} · {item.useWhen}</option>)}</select></label>
        <label className="block space-y-1"><FieldLabel>역할 직접 수정</FieldLabel><input className="w-full rounded-xl border px-3 py-2 text-sm" value={response.customRole} onChange={(event) => update({ customRole: event.target.value, finalPrompt: '' })} placeholder={ROLE_OPTIONS[0].promptText} /></label>
        <label className="block space-y-1"><FieldLabel>맥락: 지금 우리 팀에 무슨 일이 벌어졌는가</FieldLabel><TextArea value={response.context} onChange={(value) => update({ context: value, finalPrompt: '' })} placeholder="고민을 선택하면 상황 맥락이 자동으로 들어옵니다." /></label>
        <label className="block space-y-1"><FieldLabel>요청: AI에게 무엇을 해달라고 할 것인가</FieldLabel><TextArea value={response.task} onChange={(value) => update({ task: value, finalPrompt: '' })} placeholder="고민을 선택하면 AI에게 요청할 과제가 자동으로 들어옵니다." /></label>
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-3 text-xs font-bold leading-5 text-cyan-950">
          <p className="font-black">결과 활용 목적</p>
          <p className="mt-1">{buildResultPurpose(selectedConcern)}</p>
        </div>
        <label className="block space-y-1"><FieldLabel>출력 형식: 자동 분리를 위해 제목을 바꾸지 않기</FieldLabel><TextArea value={response.format} onChange={(value) => update({ format: value, finalPrompt: '' })} /></label>
      </SectionCard>

      <SectionCard title="Block 3. 구조화 질문 생성과 답변 차이 비교">
        <div className="flex flex-wrap gap-2"><button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={generatePrompt}>구조화 프롬프트 생성</button><button type="button" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(structuredPrompt, '구조화 프롬프트')}>구조화 프롬프트 복사</button></div>
        {copyMessage ? <p className="text-sm font-black text-cyan-700">{copyMessage}</p> : null}
        <textarea className="min-h-72 w-full rounded-xl border px-3 py-2 font-mono text-xs leading-5" value={structuredPrompt} onChange={(event) => update({ finalPrompt: event.target.value })} />
        <label className="block space-y-1"><FieldLabel>구조화 질문에 대한 AI 답변 붙여넣기</FieldLabel><TextArea value={response.aiStructuredAnswer} onChange={(value) => update({ aiStructuredAnswer: value })} placeholder="구조화 질문으로 받은 답변을 붙여넣으면 아래에 5개 영역으로 1차 분리됩니다." /></label>
        <StructuredAnswerExtraction answer={response.aiStructuredAnswer} />
        <label className="block space-y-1"><FieldLabel>일반 질문과 구조화 질문의 차이 메모</FieldLabel><TextArea value={response.differenceMemo} onChange={(value) => update({ differenceMemo: value })} placeholder="예: 일반 질문은 원칙 중심이었지만, 구조화 질문은 우리 팀 상황·관리 지표·회의 문장까지 나왔다." /></label>
      </SectionCard>

      <SectionCard title="Block 4. 4단계 AI 전략 리서치로 넘길 질문 저장">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold leading-6 text-emerald-950">
          <p className="font-black">이 결과가 4단계 입력값입니다.</p>
          <p className="mt-1">구조화 프롬프트를 바탕으로 다음 단계에서 AI 전략 리서치를 진행합니다. AI는 답을 대신 정하는 것이 아니라, 팀장의 고민을 더 빠르고 넓게 정리하게 돕습니다.</p>
        </div>
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-xs font-bold leading-5 text-cyan-950">
          <p className="font-black">결과 활용 목적</p>
          <p className="mt-1">{buildResultPurpose(selectedConcern)}</p>
          {selectedConcern ? <p className="mt-2 text-cyan-800">참고 흐름: {selectedConcern.downstreamHint}</p> : null}
        </div>
        <div className="grid gap-2 md:grid-cols-2">{REVIEW_ITEMS.map((item) => <label key={item} className="flex items-start gap-2 rounded-xl border p-3 text-sm font-bold leading-5"><input type="checkbox" className="mt-1" checked={Boolean(response.reviewChecks[item])} onChange={(event) => update({ reviewChecks: { ...response.reviewChecks, [item]: event.target.checked } })} /><span>{item}</span></label>)}</div>
        <div className="rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-700">점검 완료: {checkedCount} / {REVIEW_ITEMS.length}</div>
        <pre className="whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{outputText}</pre>
        <p className="text-xs font-bold text-slate-500">자동 저장 키: {V39_PROMPT_PRACTICE_STORAGE_KEY} / 마지막 저장: {response.savedAt || '아직 입력 전'}</p>
      </SectionCard>
    </div>
  );
}

export default V39PromptPracticeLab;
