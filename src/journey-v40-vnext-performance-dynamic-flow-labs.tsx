import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { useStored } from './journey-storage';
import { V40_VNEXT_PERFORMANCE_CASCADE_STORAGE_KEY } from './journey-v40-vnext-performance-strategy-cascade-lab';

type KpiType = '활동' | '전환' | '품질' | '리스크';
type Theme = 'followup' | 'record' | 'crm' | 'question' | 'message' | 'boundary' | 'contact' | 'gap' | 'purpose' | 'blocker';

type State = {
  selectedStrategyId: string;
  selectedTeamTaskId: string;
  customTeamTask: string;
  selectedCsfIds: string[];
  selectedKpiIds: string[];
  cascadeInterpretation: string;
  cascadeComplianceCaution: string;
  aiCascadePrompt: string;
  aiCascadeDraft: string;
  finalCsfKpiMemo: string;
  selectedEvidenceIds: string[];
  selectedStrongSignalRecordId?: string;
  selectedMissingInfoRecordId?: string;
  selectedRiskRecordId?: string;
  recordFactMemo?: string;
  recordMissingMemo?: string;
  recordRiskMemo?: string;
  recordQuestionMemo?: string;
  executionSignalMemo?: string;
  missingInfo: string;
  overInterpretationRisk: string;
  teamQuestion: string;
  aiRecordPrompt: string;
  aiRecordDraft: string;
  revisedRiskExpression: string;
  selectedFlowIds: string[];
  twoWeekFirstAction: string;
  pauseActivity: string;
  memberRecord: string;
  midCheckQuestion: string;
  aiFlowPrompt: string;
  aiFlowDraft: string;
  teamMeetingSentenceOne: string;
  teamMeetingSentenceTwo: string;
  teamMeetingSentenceThree: string;
  finalExecutionStandard: string;
};

type KpiOption = {
  suffix: string;
  label: string;
  type: KpiType;
  evidence: string;
  question: string;
  caution: string;
};

type ResolvedKpi = KpiOption & {
  id: string;
  csfId: string;
  csfLabel: string;
};

type DynamicOption = {
  id: string;
  title: string;
  body: string;
  autofill: string;
};

type CrmRecordCard = {
  id: string;
  owner: string;
  headline: string;
  memo: string;
  fact: string;
  signal: string;
  missing: string;
  risk: string;
  question: string;
};

const DEFAULT_STATE: State = {
  selectedStrategyId: '',
  selectedTeamTaskId: '',
  customTeamTask: '',
  selectedCsfIds: [],
  selectedKpiIds: [],
  cascadeInterpretation: '',
  cascadeComplianceCaution: '',
  aiCascadePrompt: '',
  aiCascadeDraft: '',
  finalCsfKpiMemo: '',
  selectedEvidenceIds: [],
  selectedStrongSignalRecordId: '',
  selectedMissingInfoRecordId: '',
  selectedRiskRecordId: '',
  recordFactMemo: '',
  recordMissingMemo: '',
  recordRiskMemo: '',
  recordQuestionMemo: '',
  executionSignalMemo: '',
  missingInfo: '',
  overInterpretationRisk: '',
  teamQuestion: '',
  aiRecordPrompt: '',
  aiRecordDraft: '',
  revisedRiskExpression: '',
  selectedFlowIds: [],
  twoWeekFirstAction: '',
  pauseActivity: '',
  memberRecord: '',
  midCheckQuestion: '',
  aiFlowPrompt: '',
  aiFlowDraft: '',
  teamMeetingSentenceOne: '',
  teamMeetingSentenceTwo: '',
  teamMeetingSentenceThree: '',
  finalExecutionStandard: '',
};

const ENTERPRISE_TASK_LABELS: Record<string, string> = {
  'customer-value-growth': '고객가치 기반 성장 강화',
  'digital-execution-management': '디지털 기반 실행관리 고도화',
  'sustainable-growth': '지속가능한 성장 기반 강화',
  'market-response': '시장 변화 대응력 강화',
};

const TEAM_TASK_LABELS: Record<string, string> = {
  'customer-contact-conversion': '고객 접점 이후 실행 전환율 강화',
  'customer-question-followup': '고객 질문 기반 후속 실행 체계화',
  'customer-record-quality': '고객 반응 기록 품질 고도화',
  'key-customer-flow': '핵심 고객 접점 목적과 후속 흐름 정렬',
  'crm-execution-system': 'CRM 기반 영업 실행관리 체계 강화',
  'crm-quality-advance': 'CRM 기록 품질 고도화',
  'weekly-execution-rhythm': '주간 실행 점검 리듬 정착',
  'crm-coaching-question': 'CRM 기반 코칭 질문 운영',
  'approved-communication': '승인자료 기반 고객 커뮤니케이션 일관성 강화',
  'question-response-boundary': '고객 질문 답변 가능 범위 관리',
  'safe-expression-replace': '위험 표현 점검 및 대체 문장 정착',
  'common-response-message': '팀 공통 고객 대응 문장 정렬',
  'contact-diversification': '고객 접점 방식 다변화와 후속 확인 체계 강화',
  'material-request-followup': '자료 요청 이후 확인 흐름 강화',
  'contact-gap-check': '접점 공백 고객 접근 경로 점검',
  'hybrid-contact-flow': '대면·비대면 접점 실행 흐름 통합',
};

const CSF_BY_THEME: Record<Theme, { label: string; meaning: string; guide: string }> = {
  followup: {
    label: '후속 행동이 일정 안에 실행되어야 한다',
    meaning: '고객 질문·자료 요청·다음 약속이 방치되지 않아야 합니다.',
    guide: '고객 반응 이후 실제 실행으로 이어지는지를 봅니다.',
  },
  record: {
    label: '고객 질문과 반응이 구체적으로 기록되어야 한다',
    meaning: '질문과 반응이 다음 행동의 근거로 남아야 합니다.',
    guide: '후속 실행을 만들 수 있을 만큼 기록이 구체적인지 봅니다.',
  },
  crm: {
    label: 'CRM 기록에 다음 행동이 포함되어야 한다',
    meaning: '방문 사실보다 다음 행동과 지원 필요가 남아야 합니다.',
    guide: '기록이 실행의 출발점이 되는지 봅니다.',
  },
  question: {
    label: '고객 반응과 팀원의 해석이 분리되어야 한다',
    meaning: '고객 반응을 제품 선호나 처방 가능성으로 단정하지 않아야 합니다.',
    guide: '사실과 해석을 분리하고 확인 질문으로 바꿉니다.',
  },
  message: {
    label: '승인자료 범위 안에서 메시지를 전달해야 한다',
    meaning: '허가 외 사용 암시와 과장 표현을 막아야 합니다.',
    guide: '성과 실행과 안전선을 함께 관리합니다.',
  },
  boundary: {
    label: '답변 가능 범위가 정리되어야 한다',
    meaning: '현장에서 즉흥적으로 답하지 않고 확인 후 대응해야 합니다.',
    guide: '질문 대응의 안전선을 만듭니다.',
  },
  contact: {
    label: '방문 외 접점 이후 실제 반응이 확인되어야 한다',
    meaning: '자료 전달 자체가 아니라 확인·질문·다음 논의가 남아야 합니다.',
    guide: '대체 접점 이후 반응을 기록으로 확인합니다.',
  },
  gap: {
    label: '접점 공백의 이유가 확인되어야 한다',
    meaning: '미접촉의 원인이 고객 제약인지 실행 루틴인지 분리해야 합니다.',
    guide: '공백을 비난보다 진단으로 봅니다.',
  },
  purpose: {
    label: '접점 목적이 명확해야 한다',
    meaning: '접점이 활동량이 아니라 목적 있는 실행이어야 합니다.',
    guide: '무엇을 확인하려는 접점인지 먼저 정리합니다.',
  },
  blocker: {
    label: '실행을 막는 제약이 확인되어야 한다',
    meaning: '지연 원인을 팀원 탓으로 단정하지 않고 확인해야 합니다.',
    guide: '막힌 이유와 팀장 지원 필요를 함께 확인합니다.',
  },
};

const KPI_BY_THEME: Record<Theme, KpiOption[]> = {
  followup: [
    { suffix: 'followup-complete', label: '후속조치 완료율', type: '전환', evidence: '자료 전달 후 확인, 다음 일정, 미해결 요청 처리 기록', question: '후속조치가 늦어진 이유는 고객 제약인가요, 우리 실행 제약인가요?', caution: '후속조치를 고객 압박이나 처방 유도처럼 표현하지 않습니다.' },
    { suffix: 'next-contact', label: '다음 접점 확보 건수', type: '전환', evidence: '다음 접점 목적, 일정, 준비 자료, 고객 확인 질문', question: '다음 접점은 실제 일정인가요, 가능성 언급인가요?', caution: '다음 접점 확보를 과도한 설득으로 운영하지 않습니다.' },
    { suffix: 'delay-reason', label: '후속 지연 사유 기록률', type: '품질', evidence: '지연 사유, 고객 일정, 내부 준비, 팀장 지원 필요', question: '지연 이유가 고객 제약인지 우리 실행 제약인지 보이나요?', caution: '지연을 팀원 태도 문제로 단정하지 않습니다.' },
    { suffix: 'mid-check', label: '팀장 중간 점검 질문 작성 건수', type: '품질', evidence: '중간 점검 질문, 후속 확인 질문, 기록 샘플 점검 메모', question: '팀장이 이번 주에 실제로 물어볼 질문은 무엇인가요?', caution: '질문이 추궁처럼 들리지 않게 관찰 중심으로 표현합니다.' },
  ],
  record: [
    { suffix: 'question-record', label: '고객 질문 기록률', type: '품질', evidence: '고객 질문 내용, 질문 배경, 후속 확인 필요 항목', question: '고객 질문이 단순 확인이었나요, 다음 논의로 이어질 질문이었나요?', caution: '고객 질문을 처방 가능성이나 제품 선호로 단정하지 않습니다.' },
    { suffix: 'next-action-record', label: '후속 행동 포함 기록률', type: '품질', evidence: '다음 행동, 담당자, 시점, 고객 질문, 준비 자료', question: '기록에 다음 행동이 없으면 무엇을 더 확인해야 하나요?', caution: '기록 입력률 자체를 성과로 단정하지 않습니다.' },
    { suffix: 'record-quality', label: '고객 반응 기록 충실도', type: '품질', evidence: '고객 반응, 피드백, 제약요인, 다음 행동 포함 여부', question: '기록을 보고 다음 행동을 정할 수 있을 만큼 충분한가요?', caution: '고객 감정이나 의도를 확인 없이 해석하지 않습니다.' },
    { suffix: 'mid-check', label: '팀장 중간 점검 질문 작성 건수', type: '품질', evidence: '중간 점검 질문, 후속 확인 질문, 기록 샘플 점검 메모', question: '팀장이 이번 주에 실제로 물어볼 질문은 무엇인가요?', caution: '질문이 추궁처럼 들리지 않게 관찰 중심으로 표현합니다.' },
  ],
  crm: [
    { suffix: 'crm-next-action', label: '후속 행동 포함 CRM 기록률', type: '품질', evidence: '다음 행동, 담당자, 시점, 고객 질문, 준비 자료', question: '기록에 다음 행동이 없으면 무엇을 더 확인해야 하나요?', caution: 'CRM 입력률 자체를 성과로 단정하지 않습니다.' },
    { suffix: 'crm-timeliness', label: 'CRM 기록 적시성', type: '활동', evidence: '방문 후 기록 시점, 누락 기록, 지연 사유', question: '기록 지연이 일정 문제인지 기록 기준 문제인지 확인했나요?', caution: '기록 지연을 즉시 태도 문제로 해석하지 않습니다.' },
    { suffix: 'crm-bottleneck', label: 'CRM 기반 실행 제약 확인 건수', type: '리스크', evidence: '기록에서 보이는 일정 변경, 내부 지원 요청, 자료 확인 필요', question: 'CRM 기록만 보고 무엇을 지원할 수 있나요?', caution: '기록을 감시 도구처럼 쓰지 않습니다.' },
    { suffix: 'mid-check', label: '팀장 중간 점검 질문 작성 건수', type: '품질', evidence: '중간 점검 질문, 후속 확인 질문, 기록 샘플 점검 메모', question: '팀장이 이번 주에 실제로 물어볼 질문은 무엇인가요?', caution: '질문이 추궁처럼 들리지 않게 관찰 중심으로 표현합니다.' },
  ],
  question: [
    { suffix: 'fact-interpretation', label: '사실-해석 분리 기록률', type: '품질', evidence: '관찰 사실, 팀원 해석, 고객 확인 필요 사항', question: '고객 반응과 우리의 해석이 분리되어 있나요?', caution: '반응을 선호나 처방 가능성으로 단정하지 않습니다.' },
    { suffix: 'confirm-question', label: '확인 질문 작성 건수', type: '품질', evidence: '고객에게 확인할 질문, 팀원에게 물어볼 질문', question: '성급한 해석 대신 어떤 확인 질문을 남겼나요?', caution: '확인 질문이 유도 질문이 되지 않게 합니다.' },
    { suffix: 'interpretation-risk', label: '과잉해석 수정 건수', type: '리스크', evidence: '긍정 반응 단정, 의도 추정, 제품 선호 해석 수정', question: '어떤 표현을 더 안전하게 바꿔야 하나요?', caution: '고객의 의도를 확인 없이 말하지 않습니다.' },
    { suffix: 'mid-check', label: '팀장 중간 점검 질문 작성 건수', type: '품질', evidence: '중간 점검 질문, 후속 확인 질문, 기록 샘플 점검 메모', question: '팀장이 이번 주에 실제로 물어볼 질문은 무엇인가요?', caution: '질문이 추궁처럼 들리지 않게 관찰 중심으로 표현합니다.' },
  ],
  message: [
    { suffix: 'approved-material', label: '승인자료 사용 확인률', type: '리스크', evidence: '사용 자료, 전달 메시지, 고객 질문 범위, 자료 확인 메모', question: '사용한 자료와 답변 범위가 승인자료 안에 있나요?', caution: '승인 범위 밖 내용을 확장하지 않습니다.' },
    { suffix: 'message-consistency', label: '공통 메시지 사용률', type: '품질', evidence: '팀 공통 문장, 고객 질문 대응 문장, 수정한 표현', question: '팀원이 같은 핵심 문장을 안전하게 쓰고 있나요?', caution: '일관성이 기계적 반복으로 느껴지지 않게 합니다.' },
    { suffix: 'risk-correction', label: '위험 표현 수정 건수', type: '리스크', evidence: '비교 우위 단정, 처방 유도, 허가 외 사용 암시 수정 기록', question: '고객에게 부담이나 오해를 줄 수 있는 표현은 무엇인가요?', caution: '경쟁사 비방, 비교 우위 단정, 처방 유도 표현을 쓰지 않습니다.' },
    { suffix: 'risk-expression', label: '위험 표현 점검률', type: '리스크', evidence: '수정한 표현, 보류한 답변, 확인 필요 질문', question: '고객에게 오해를 줄 수 있는 표현은 무엇인가요?', caution: '처방 유도, 경쟁사 비방, 비교 우위 단정 표현을 쓰지 않습니다.' },
  ],
  boundary: [
    { suffix: 'question-boundary', label: '고객 질문 대응 범위 확인 건수', type: '품질', evidence: '고객 질문, 답변 가능 범위, 추가 확인 필요 여부', question: '이 질문은 바로 답할 수 있나요, 확인 후 답해야 하나요?', caution: '확인되지 않은 답변을 현장에서 확정적으로 말하지 않습니다.' },
    { suffix: 'confirm-later', label: '확인 후 대응 건수', type: '품질', evidence: '즉답하지 않고 확인 후 대응한 고객 질문', question: '바로 답하지 말고 확인해야 하는 질문은 무엇인가요?', caution: '확인 필요를 회피가 아니라 안전관리로 설명합니다.' },
    { suffix: 'cp-check', label: 'CP 확인 필요 건수', type: '리스크', evidence: '확인 필요 질문, 관련 부서 확인 요청, 보류 답변 기록', question: '이 사안은 팀장 또는 관련 부서 확인이 필요한가요?', caution: '확인 필요를 실행 지연이 아니라 안전관리로 설명합니다.' },
    { suffix: 'risk-expression', label: '위험 표현 점검률', type: '리스크', evidence: '수정한 표현, 보류한 답변, 확인 필요 질문', question: '고객에게 오해를 줄 수 있는 표현은 무엇인가요?', caution: '처방 유도, 경쟁사 비방, 비교 우위 단정 표현을 쓰지 않습니다.' },
  ],
  contact: [
    { suffix: 'nonface-follow', label: '비대면 접점 후속 확인률', type: '전환', evidence: '전화·메시지 후속 확인, 자료 확인 여부, 고객 질문', question: '자료 전달 후 실제 확인이나 질문이 있었나요?', caution: '자료 전달 자체를 고객 이해나 성과로 단정하지 않습니다.' },
    { suffix: 'material-response', label: '자료 요청 대응률', type: '전환', evidence: '자료 요청 내용, 승인자료 여부, 대응 시점, 후속 확인', question: '고객 요청에 승인자료 범위 안에서 대응했나요?', caution: '자료 요청을 제품 선호나 처방 의향으로 해석하지 않습니다.' },
    { suffix: 'contact-reaction', label: '대체 접점 반응 기록률', type: '품질', evidence: '비대면 접점 이후 고객 질문, 확인 요청, 미응답 사유', question: '대체 접점 이후 실제 반응이 기록되어 있나요?', caution: '무응답을 부정적 반응으로 단정하지 않습니다.' },
    { suffix: 'mid-check', label: '팀장 중간 점검 질문 작성 건수', type: '품질', evidence: '중간 점검 질문, 후속 확인 질문, 기록 샘플 점검 메모', question: '팀장이 이번 주에 실제로 물어볼 질문은 무엇인가요?', caution: '질문이 추궁처럼 들리지 않게 관찰 중심으로 표현합니다.' },
  ],
  gap: [
    { suffix: 'untouched-check', label: '미접촉 고객 확인률', type: '활동', evidence: '미접촉 기간, 접근 경로, 접점 공백 사유', question: '미접촉은 고객 제약 때문인가요, 우리 실행 루틴 때문인가요?', caution: '미접촉 고객을 무리하게 압박하지 않습니다.' },
    { suffix: 'gap-reason', label: '접점 공백 사유 기록률', type: '리스크', evidence: '일정 제약, 접근 경로 부재, 내부 준비 부족, 고객 상황', question: '접점 공백의 이유가 기록에 남아 있나요?', caution: '공백을 팀원 노력 부족으로 단정하지 않습니다.' },
    { suffix: 'recovery-purpose', label: '접점 회복 목적 작성률', type: '품질', evidence: '접근 목적, 확인 질문, 다음 행동', question: '다시 접촉하는 이유와 확인할 질문이 분명한가요?', caution: '접점 회복을 고객 압박으로 운영하지 않습니다.' },
    { suffix: 'mid-check', label: '팀장 중간 점검 질문 작성 건수', type: '품질', evidence: '중간 점검 질문, 후속 확인 질문, 기록 샘플 점검 메모', question: '팀장이 이번 주에 실제로 물어볼 질문은 무엇인가요?', caution: '질문이 추궁처럼 들리지 않게 관찰 중심으로 표현합니다.' },
  ],
  purpose: [
    { suffix: 'visit-purpose', label: '접점 목적 작성률', type: '활동', evidence: '방문 목적, 확인 질문, 준비 자료, 예상 후속 행동', question: '접점 전에 무엇을 확인하려는지 명확한가요?', caution: '방문 수 자체를 성과로 단정하지 않습니다.' },
    { suffix: 'next-topic', label: '다음 논의 주제 기록률', type: '품질', evidence: '다음 논의 주제, 고객 질문, 추가 확인 필요 사항', question: '다음 논의 주제가 고객 질문과 연결되어 있나요?', caution: '고객에게 부담을 주는 후속 논의로 운영하지 않습니다.' },
    { suffix: 'no-purpose-visit', label: '목적 불명확 접점 확인 건수', type: '리스크', evidence: '목적이 약한 반복 방문, 후속 행동 없는 방문', question: '목적 없는 반복 접점을 줄일 수 있나요?', caution: '활동량 감소를 무조건 부정적으로 보지 않습니다.' },
    { suffix: 'mid-check', label: '팀장 중간 점검 질문 작성 건수', type: '품질', evidence: '중간 점검 질문, 후속 확인 질문, 기록 샘플 점검 메모', question: '팀장이 이번 주에 실제로 물어볼 질문은 무엇인가요?', caution: '질문이 추궁처럼 들리지 않게 관찰 중심으로 표현합니다.' },
  ],
  blocker: [
    { suffix: 'blocker-found', label: '실행 제약 확인 건수', type: '리스크', evidence: '고객 접근 제약, 일정 변경, 내부 지원 요청, 자료 확인 필요', question: '막힌 지점은 팀원이 혼자 해결할 일인가요, 팀장이 연결할 일인가요?', caution: '실행 부진을 고객 탓이나 팀원 탓으로 단정하지 않습니다.' },
    { suffix: 'support-action', label: '팀장 지원 실행 건수', type: '전환', evidence: '팀장 연결, 자료 확인, 부서 협조, 우선순위 조정', question: '팀장이 실제로 연결하거나 조정한 것은 무엇인가요?', caution: '지원이 과잉개입이 되지 않게 합니다.' },
    { suffix: 'blocked-followup', label: '막힌 후속조치 처리율', type: '전환', evidence: '막힌 후속조치, 처리 상태, 다음 확인 시점', question: '막힌 일이 방치되지 않고 다음 확인으로 이어졌나요?', caution: '처리율만 보고 무리한 압박을 하지 않습니다.' },
    { suffix: 'mid-check', label: '팀장 중간 점검 질문 작성 건수', type: '품질', evidence: '중간 점검 질문, 후속 확인 질문, 기록 샘플 점검 메모', question: '팀장이 이번 주에 실제로 물어볼 질문은 무엇인가요?', caution: '질문이 추궁처럼 들리지 않게 관찰 중심으로 표현합니다.' },
  ],
};

const CRM_RECORD_CARDS: CrmRecordCard[] = [
  {
    id: 'record-kim-jaeho',
    owner: '김재호 차장',
    headline: '반응은 좋아 보이지만 다음 행동이 모호한 기록',
    memo: 'A고객에게 자료 전달. 반응 좋음. 다음 주 다시 연락 예정.',
    fact: '자료 전달과 다음 연락 예정은 확인 가능합니다.',
    signal: '다음 연락 예정이 있어 후속 행동 가능성은 보입니다.',
    missing: '고객 질문, 자료 전달 목적, 다음 연락에서 확인할 내용이 빠져 있습니다.',
    risk: '반응 좋음이라는 표현을 고객 관심이나 전환 가능성으로 단정하면 위험합니다.',
    question: '다음 연락 때 고객에게 무엇을 확인하려고 하나요?',
  },
  {
    id: 'record-kim-munho',
    owner: '김문호 차장',
    headline: '활동량은 많지만 전략과제 연결이 흐린 기록',
    memo: '이번 주 주요 고객 8곳 방문. 자료 전달 6건. 다음 주에도 방문 확대 예정.',
    fact: '방문 수와 자료 전달 건수는 확인됩니다.',
    signal: '활동량은 보이나 선택한 팀 전략과제나 CSF와 직접 연결된 후속 행동은 약합니다.',
    missing: '고객별 질문, 자료 전달 목적, 후속 확인 계획, 우선순위 판단 근거가 빠져 있습니다.',
    risk: '방문 수가 많다는 이유만으로 실행 품질이나 전략 기여가 높다고 단정하면 위험합니다.',
    question: '방문 확대보다 먼저 확인해야 할 고객 반응이나 후속 행동은 무엇인가요?',
  },
  {
    id: 'record-yoo-heekwan',
    owner: '유희관 과장',
    headline: '성과 단서가 비교적 뚜렷한 기록',
    memo: '고객이 이전 자료와 다른 점을 질문함. 승인자료 기준으로 답변했고, 추가 확인 필요 사항은 정리해서 다음 미팅 전 확인 예정.',
    fact: '고객 질문, 승인자료 범위 내 답변, 추가 확인 예정이 확인됩니다.',
    signal: '고객 질문 기록률, 확인 후 대응 건수, 후속 행동 포함 기록률과 연결됩니다.',
    missing: '다음 미팅 전 누가 무엇을 확인할지 담당과 시점이 더 필요합니다.',
    risk: '질문이 있었다는 사실만으로 고객 관심이나 처방 가능성을 단정하지 않습니다.',
    question: '다음 미팅 전 확인할 자료와 담당자를 어떻게 정리하면 좋을까요?',
  },
  {
    id: 'record-lee-daeun',
    owner: '이대은 대리',
    headline: '위험한 해석과 표현이 숨어 있는 기록',
    memo: '경쟁 제품보다 우리 쪽이 더 낫다고 설명. 고객도 고개를 끄덕임.',
    fact: '설명했고 고객이 고개를 끄덕였다는 행동만 확인됩니다.',
    signal: '성과 단서로 보기에는 부족하고, 표현 안전선 점검이 먼저 필요합니다.',
    missing: '승인자료 범위, 실제 고객 질문, 고객이 이해한 내용이 빠져 있습니다.',
    risk: '경쟁 제품보다 더 낫다는 비교 우위 단정과 고개 끄덕임에 대한 과잉해석이 위험합니다.',
    question: '승인자료 범위 안에서 어떤 표현으로 다시 정리할 수 있을까요?',
  },
  {
    id: 'record-shin-jaeyoung',
    owner: '신재영 대리',
    headline: '조심스럽지만 실행 자신감이 낮아 보이는 기록',
    memo: '고객이 추가 확인을 요청했으나 바로 답변하지 않고 확인 후 회신 예정. 어떤 자료를 준비해야 할지 팀장 확인 필요.',
    fact: '추가 확인 요청, 즉답 보류, 팀장 확인 필요가 기록되어 있습니다.',
    signal: '확인 후 대응 건수와 팀장 지원 필요 신호는 뚜렷합니다.',
    missing: '확인할 자료의 범위, 회신 시점, 고객에게 다시 확인할 질문이 더 필요합니다.',
    risk: '조심스러운 대응을 실행력 부족으로 단정하면 위험합니다.',
    question: '확인 후 회신을 위해 팀장이 먼저 도와야 할 것은 무엇인가요?',
  },
  {
    id: 'record-park-jaewook',
    owner: '박재욱 사원',
    headline: '활동은 있지만 성과관리 단서가 부족한 기록',
    memo: '방문 완료. 자료 전달. 특이사항 없음.',
    fact: '방문 완료와 자료 전달은 확인됩니다.',
    signal: '활동량은 보이나 후속 행동이나 고객 반응 신호는 거의 없습니다.',
    missing: '고객 질문, 자료 전달 목적, 다음 행동, 확인 필요 사항이 빠져 있습니다.',
    risk: '방문 완료를 실행 품질이나 고객 반응으로 해석하면 위험합니다.',
    question: '이번 방문에서 다음 행동으로 연결할 질문이나 반응이 있었나요?',
  },
  {
    id: 'record-moon-gyowon',
    owner: '문교원 사원',
    headline: '기록은 꼼꼼하지만 우선순위가 분산된 기록',
    memo: '고객 질문 3건, 자료 요청 2건, 다음 연락 3건 기록. 다만 어떤 고객을 먼저 확인할지는 아직 정하지 못함.',
    fact: '질문, 자료 요청, 다음 연락 후보가 비교적 구체적으로 기록되어 있습니다.',
    signal: '기록 품질은 좋지만 우선순위와 2주 실행 순서가 필요합니다.',
    missing: '먼저 확인할 고객 기준, 팀 전략과제와의 연결, 금주 중간 점검 질문이 부족합니다.',
    risk: '꼼꼼한 기록을 곧바로 실행 우선순위가 명확하다고 해석하면 위험합니다.',
    question: '이번 주에는 어떤 기준으로 먼저 확인할 고객을 정하면 좋을까요?',
  },
];

const THEME_ORDER = Object.keys(CSF_BY_THEME) as Theme[];

function listOf(value: string[] | undefined) {
  return Array.isArray(value) ? value : [];
}

function toggle(list: string[] | undefined, id: string, max?: number) {
  const current = listOf(list);
  if (current.includes(id)) return current.filter((item) => item !== id);
  const next = [...current, id];
  return max ? next.slice(-max) : next;
}

function strategyLabel(state: State) {
  return ENTERPRISE_TASK_LABELS[state.selectedStrategyId] ?? '미선택';
}

function teamTaskLabel(state: State) {
  return state.customTeamTask?.trim() || TEAM_TASK_LABELS[state.selectedTeamTaskId] || '미선택';
}

function themeFromCsfId(csfId: string): Theme | undefined {
  return THEME_ORDER.find((theme) => csfId.endsWith(`-${theme}`));
}

function resolveCsf(csfId: string) {
  const theme = themeFromCsfId(csfId);
  const fallback = { label: csfId, meaning: '', guide: '선택한 CSF가 작동하는지 확인합니다.' };
  return { id: csfId, theme, ...(theme ? CSF_BY_THEME[theme] : fallback) };
}

function resolveKpi(kpiId: string, selectedCsfIds: string[]): ResolvedKpi {
  const csfId = selectedCsfIds.find((id) => kpiId.startsWith(`${id}-`)) ?? '';
  const theme = themeFromCsfId(csfId);
  const options = theme ? KPI_BY_THEME[theme] : THEME_ORDER.flatMap((item) => KPI_BY_THEME[item]);
  const option = options.find((item) => kpiId.endsWith(item.suffix));
  const fallback: KpiOption = {
    suffix: kpiId,
    label: kpiId,
    type: '품질',
    evidence: '선택한 KPI와 연결되는 기록 증거',
    question: '이 KPI를 확인하기 위해 무엇을 물어봐야 하나요?',
    caution: '고객 반응을 확인 없이 단정하지 않습니다.',
  };
  return {
    id: kpiId,
    csfId,
    csfLabel: csfId ? resolveCsf(csfId).label : '선택 CSF',
    ...(option ?? fallback),
  };
}

function selectedCsfs(state: State) {
  return listOf(state.selectedCsfIds).map(resolveCsf);
}

function selectedKpis(state: State) {
  return listOf(state.selectedKpiIds).map((kpiId) => resolveKpi(kpiId, listOf(state.selectedCsfIds)));
}

function labelList(items: { label: string }[]) {
  return items.length ? items.map((item) => item.label).join(' · ') : '미선택';
}

function findRecord(id?: string) {
  return CRM_RECORD_CARDS.find((record) => record.id === id);
}

function copyText(text: string) {
  void navigator.clipboard?.writeText(text);
}

function buildRecordPrompt(state: State) {
  const strong = findRecord(state.selectedStrongSignalRecordId);
  const missing = findRecord(state.selectedMissingInfoRecordId);
  const risk = findRecord(state.selectedRiskRecordId);
  return [
    '당신은 제약영업 팀장의 성과관리 코치입니다.',
    '',
    '아래 고객 활동 기록은 실제 기록이 아니라 교육용 가상 CRM 기록 카드입니다.',
    '고객명, 병원명, 의료진명, 제품명, 실제 매출자료, 처방 정보는 포함하지 않았습니다.',
    '',
    `전사전략과제: ${strategyLabel(state)}`,
    `팀 전략과제: ${teamTaskLabel(state)}`,
    `선택 CSF: ${labelList(selectedCsfs(state))}`,
    `선택 KPI: ${labelList(selectedKpis(state))}`,
    '',
    '우리 조가 먼저 판독한 결과:',
    `- 성과 단서가 가장 뚜렷한 기록: ${strong ? `${strong.owner} · ${strong.memo}` : '미선택'}`,
    `- 부족 정보가 가장 큰 기록: ${missing ? `${missing.owner} · ${missing.memo}` : '미선택'}`,
    `- 위험한 해석이 숨어 있는 기록: ${risk ? `${risk.owner} · ${risk.memo}` : '미선택'}`,
    `- 확인 가능한 사실: ${state.recordFactMemo || '아직 작성 전'}`,
    `- 아직 부족한 정보: ${state.recordMissingMemo || state.missingInfo || '아직 작성 전'}`,
    `- 과잉해석하면 안 되는 부분: ${state.recordRiskMemo || state.overInterpretationRisk || '아직 작성 전'}`,
    `- 팀원에게 확인할 질문: ${state.recordQuestionMemo || state.teamQuestion || '아직 작성 전'}`,
    '',
    '요청:',
    '1. 확인 가능한 사실과 해석을 분리해 주세요.',
    '2. 선택한 팀 전략과제·CSF·KPI 기준으로 성과 단서를 찾아 주세요.',
    '3. 아직 부족한 정보를 알려 주세요.',
    '4. 과잉해석하면 안 되는 표현과 컴플라이언스상 위험한 표현을 찾아 주세요.',
    '5. 팀장이 팀원에게 물어볼 확인 질문 3개를 만들어 주세요.',
    '6. 7단계 2주 실행 흐름으로 넘길 실행 신호를 3개로 정리해 주세요.',
    '',
    '주의: 고객 반응을 처방 가능성으로 단정하지 마세요. 고객을 등급화하지 마세요. 처방 유도, 허가 외 사용 암시, 경쟁사 비방, 비교 우위 단정 표현은 제외해 주세요.',
  ].join('\n');
}

function buildFocusOptions(state: State): DynamicOption[] {
  const csfs = selectedCsfs(state);
  const kpis = selectedKpis(state);
  const task = teamTaskLabel(state);
  const options: DynamicOption[] = [];

  if (task !== '미선택') {
    options.push({
      id: `focus-task-${state.selectedTeamTaskId || 'custom'}`,
      title: '선택한 팀 전략과제 중심',
      body: `“${task}”을 이번 2주 성과관리의 기준으로 삼습니다.`,
      autofill: `우리 조는 이번 2주 동안 “${task}”이 실제 고객 활동 기록과 팀원 후속 행동으로 연결되는지를 먼저 확인한다.`,
    });
  }

  csfs.forEach((csf) => {
    options.push({
      id: `focus-csf-${csf.id}`,
      title: csf.label,
      body: csf.guide,
      autofill: `이번 2주는 “${csf.label}”이 작동하는지 확인하고, ${csf.guide}`,
    });
  });

  kpis.slice(0, 3).forEach((kpi) => {
    options.push({
      id: `focus-kpi-${kpi.id}`,
      title: kpi.label,
      body: `확인 증거: ${kpi.evidence}`,
      autofill: `이번 2주는 “${kpi.label}”를 먼저 보며, ${kpi.evidence}가 기록에 남았는지 확인한다.`,
    });
  });

  if (options.length === 0) {
    options.push({
      id: 'focus-empty',
      title: '5단계 선택값 필요',
      body: '5단계에서 팀 전략과제·CSF·KPI를 먼저 선택하면 후보가 달라집니다.',
      autofill: '',
    });
  }

  return options.slice(0, 6);
}

function buildSignalOptions(state: State): DynamicOption[] {
  const kpis = selectedKpis(state);
  const options: DynamicOption[] = [];

  if (state.executionSignalMemo?.trim()) {
    options.push({
      id: 'signal-step6',
      title: '6단계 실행 신호 반영',
      body: state.executionSignalMemo,
      autofill: state.executionSignalMemo,
    });
  }

  kpis.forEach((kpi) => {
    options.push({
      id: `signal-kpi-${kpi.id}`,
      title: kpi.label,
      body: `${kpi.evidence}가 남은 기록과 빠진 기록을 구분합니다.`,
      autofill: `먼저 “${kpi.label}”와 연결되는 ${kpi.evidence}가 실제 기록에 남았는지 확인한다.`,
    });
  });

  if (options.length === 0) {
    options.push({
      id: 'signal-empty',
      title: '6단계 실행 신호 필요',
      body: '6단계에서 실행 신호를 작성하면 이 영역에 우선 후보로 반영됩니다.',
      autofill: '',
    });
  }

  return options.slice(0, 6);
}

function buildPauseOptions(state: State): DynamicOption[] {
  const kpis = selectedKpis(state);
  const types = new Set(kpis.map((kpi) => kpi.type));
  const options: DynamicOption[] = [
    {
      id: 'pause-noise-report',
      title: 'KPI와 직접 연결되지 않는 장문 보고',
      body: '기록을 길게 쓰는 것보다 다음 행동이 보이는지를 우선합니다.',
      autofill: 'KPI와 직접 연결되지 않는 장문 보고나 형식적 기록 정리는 잠시 줄인다.',
    },
    {
      id: 'pause-visit-count',
      title: '활동량만 늘리는 반복 방문',
      body: '방문 수보다 목적·질문·후속 행동을 먼저 봅니다.',
      autofill: '방문 수만 늘리는 반복 접점은 잠시 줄이고, 접점 목적과 후속 행동이 남는 활동을 우선한다.',
    },
  ];

  if (types.has('리스크')) {
    options.push({
      id: 'pause-risk-expression',
      title: '안전선 확인 없는 즉답·단정 표현',
      body: '승인자료·표현 안전선을 먼저 확인합니다.',
      autofill: '승인자료 범위가 확인되지 않은 즉답, 경쟁사 비교 우위 단정, 처방 유도처럼 들릴 수 있는 표현은 멈춘다.',
    });
  }

  if (types.has('품질')) {
    options.push({
      id: 'pause-fast-interpretation',
      title: '고객 반응에 대한 빠른 해석',
      body: '반응을 성과 가능성으로 바로 해석하지 않습니다.',
      autofill: '“반응 좋음”, “고개 끄덕임” 같은 표현을 고객 관심이나 전환 가능성으로 바로 해석하는 회의 문장을 줄인다.',
    });
  }

  if (types.has('전환')) {
    options.push({
      id: 'pause-pressure-followup',
      title: '고객 압박으로 보일 수 있는 후속 재촉',
      body: '후속 확인은 고객 압박이 아니라 미해결 요청 정리로 표현합니다.',
      autofill: '후속 확인을 고객 압박처럼 운영하지 않도록, 재촉성 연락보다 확인 질문과 준비 자료 정리를 우선한다.',
    });
  }

  return options.slice(0, 6);
}

function buildMidCheckOptions(state: State): DynamicOption[] {
  const kpis = selectedKpis(state);
  const csfs = selectedCsfs(state);
  const options: DynamicOption[] = [];

  kpis.slice(0, 3).forEach((kpi) => {
    options.push({
      id: `check-${kpi.id}`,
      title: kpi.label,
      body: kpi.question,
      autofill: kpi.question,
    });
  });

  csfs.slice(0, 2).forEach((csf) => {
    options.push({
      id: `check-${csf.id}`,
      title: csf.label,
      body: csf.guide,
      autofill: `이번 주 기록을 보면 “${csf.label}”이 작동한다고 볼 근거와 아직 부족한 정보는 무엇인가요?`,
    });
  });

  if (options.length === 0) {
    options.push({
      id: 'check-default',
      title: '관찰 중심 중간 점검 질문',
      body: '추궁보다 사실·부족 정보·지원 필요를 묻습니다.',
      autofill: '이번 주 기록에서 확인 가능한 사실, 아직 부족한 정보, 팀장 지원이 필요한 부분은 무엇인가요?',
    });
  }

  return options.slice(0, 5);
}

function buildFlowPrompt(state: State) {
  return [
    '당신은 제약영업 팀장의 성과관리 코치입니다.',
    '',
    '아래 내용은 교육용 가상 상황입니다. 실제 고객명, 병원명, 의료진명, 제품명, 실제 매출자료, 처방 정보, 팀원 실명, 내부 영업전략은 포함하지 마세요.',
    '',
    `전사전략과제: ${strategyLabel(state)}`,
    `selectedStrategyId: ${state.selectedStrategyId || '미선택'}`,
    `팀 전략과제: ${teamTaskLabel(state)}`,
    `selectedTeamTaskId: ${state.selectedTeamTaskId || '미선택'}`,
    `선택 CSF: ${labelList(selectedCsfs(state))}`,
    `selectedCsfIds: ${listOf(state.selectedCsfIds).join(' · ') || '미선택'}`,
    `선택 KPI: ${labelList(selectedKpis(state))}`,
    `selectedKpiIds: ${listOf(state.selectedKpiIds).join(' · ') || '미선택'}`,
    '',
    `6단계 실행 신호: ${state.executionSignalMemo || '아직 작성 전'}`,
    `아직 부족한 정보: ${state.recordMissingMemo || state.missingInfo || '아직 작성 전'}`,
    `팀원에게 확인할 질문: ${state.recordQuestionMemo || state.teamQuestion || '아직 작성 전'}`,
    '',
    '우리 조가 7단계에서 먼저 정한 내용:',
    `- 이번 2주 성과관리 초점: ${state.twoWeekFirstAction || '아직 작성 전'}`,
    `- 먼저 볼 실행 신호/팀원이 남길 기록: ${state.memberRecord || '아직 작성 전'}`,
    `- 잠시 줄이거나 멈출 활동: ${state.pauseActivity || '아직 작성 전'}`,
    `- 팀장 중간 점검 질문: ${state.midCheckQuestion || '아직 작성 전'}`,
    '',
    '요청:',
    '1. 위 선택값을 기준으로 이번 2주 동안 먼저 확인할 것 3가지를 정리해 주세요.',
    '2. 팀원이 남겨야 할 기록을 선택 KPI별로 구체화해 주세요.',
    '3. 팀장이 중간 점검에서 물어볼 질문을 관찰 중심 언어로 다듬어 주세요.',
    '4. 잠시 줄이거나 멈출 활동을 정하고, 왜 줄이는지 설명해 주세요.',
    '5. AI 초안에서 과한 성과 압박, 고객 압박, 컴플라이언스 위험 표현을 표시해 주세요.',
    '6. 팀 회의에서 설명할 3문장을 만들어 주세요.',
    '7. 8단계 업무관리로 넘길 실행 기준을 1문장으로 제안해 주세요.',
    '',
    '주의: 고객 압박, 처방 유도, 허가 외 사용 암시, 경쟁사 비방, 비교 우위 단정 표현은 제외해 주세요. CRM 기록은 감시 도구가 아니라 다음 행동을 맞추기 위한 자료로 표현해 주세요.',
  ].join('\n');
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <h3 className="text-lg font-black text-slate-950">{title}</h3>
      <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">{children}</div>
    </section>
  );
}

function LockedPanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm leading-6 text-slate-500">
      <p className="font-black text-slate-700">{title}</p>
      <p className="mt-1 text-xs font-bold">{body}</p>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, min = 'min-h-24', disabled = false }: { label: string; value: string | undefined; onChange: (value: string) => void; placeholder?: string; min?: string; disabled?: boolean }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-black text-slate-500">{label}</span>
      <textarea
        disabled={disabled}
        className={`${min} w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm leading-6 ${disabled ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-700'}`}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function Button({ children, onClick, disabled = false }: { children: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-2xl px-4 py-3 text-sm font-black shadow-sm ${disabled ? 'cursor-not-allowed bg-slate-200 text-slate-400' : 'bg-slate-950 text-white hover:bg-slate-800'}`}
    >
      {children}
    </button>
  );
}

function ChoiceButton({ option, selected, onClick }: { option: DynamicOption; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${selected ? 'border-violet-400 bg-violet-50' : 'border-slate-200 bg-white hover:border-slate-400'}`}
    >
      <p className="text-xs font-black text-violet-700">{option.title}</p>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{option.body}</p>
    </button>
  );
}

function RecordCardButton({ record, selected, onClick }: { record: CrmRecordCard; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left ${selected ? 'border-sky-400 bg-sky-50' : 'border-slate-200 bg-white hover:border-slate-400'}`}
    >
      <p className="text-xs font-black text-sky-700">{record.owner}</p>
      <p className="mt-1 font-black text-slate-950">{record.headline}</p>
      <p className="mt-2 text-sm leading-6 text-slate-700">“{record.memo}”</p>
      <p className="mt-2 text-xs font-bold leading-5 text-slate-500">팀장 질문 힌트: {record.question}</p>
    </button>
  );
}

function SummaryPanel({ state }: { state: State }) {
  return (
    <p className="rounded-2xl bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
      전사전략과제: <b>{strategyLabel(state)}</b><br />
      팀 전략과제: <b>{teamTaskLabel(state)}</b><br />
      선택 CSF: <b>{labelList(selectedCsfs(state))}</b><br />
      선택 KPI: <b>{labelList(selectedKpis(state))}</b>
    </p>
  );
}

export function V40VNextPerformanceRecordEvidenceLab() {
  const [state, setState] = useStored<State>(V40_VNEXT_PERFORMANCE_CASCADE_STORAGE_KEY, DEFAULT_STATE);
  const kpis = selectedKpis(state);
  const recordPrompt = useMemo(() => buildRecordPrompt(state), [state]);
  const hasKpis = kpis.length > 0;
  const selectedRecordIds = [state.selectedStrongSignalRecordId, state.selectedMissingInfoRecordId, state.selectedRiskRecordId];

  return (
    <section className="space-y-4">
      <Card title="5단계에서 만든 팀 전략과제·CSF·KPI 다시 보기">
        <SummaryPanel state={state} />
        <p className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
          CRM 기록은 중심 과제가 아니라 판독할 자료입니다. 판독 기준은 5단계에서 우리 조가 선택한 팀 전략과제·CSF·KPI입니다.
        </p>
      </Card>

      <Card title="KPI 확인 항목 고르기">
        {!hasKpis ? (
          <LockedPanel title="선택한 KPI가 없습니다" body="5단계에서 전사전략과제, 팀 전략과제, CSF, KPI를 먼저 선택해야 CRM 기록 확인 항목을 볼 수 있습니다." />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {kpis.map((kpi) => (
              <button
                key={kpi.id}
                type="button"
                onClick={() => setState({ ...state, selectedEvidenceIds: toggle(state.selectedEvidenceIds, kpi.evidence) })}
                className={`rounded-2xl border p-4 text-left ${listOf(state.selectedEvidenceIds).includes(kpi.evidence) ? 'border-sky-400 bg-sky-50' : 'border-slate-200 bg-white'}`}
              >
                <p className="text-xs font-black text-sky-700">{kpi.label}</p>
                <p className="mt-1 font-black text-slate-950">{kpi.evidence}</p>
                <p className="mt-2 text-xs font-bold leading-5 text-slate-600">팀장 질문: {kpi.question}</p>
              </button>
            ))}
          </div>
        )}
      </Card>

      <Card title="팀원별 가상 CRM 기록 판독">
        <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-600">
          아래 7명의 가상 CRM 기록은 실제 고객명, 병원명, 제품명, 매출자료를 모두 제거한 교육용 기록입니다. 7개를 모두 세밀하게 분석하지 않습니다. 먼저 전체를 훑어본 뒤, 우리 조가 이번 2주 성과관리에서 집중 판독할 기록 3개를 고릅니다.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {CRM_RECORD_CARDS.map((record) => (
            <RecordCardButton
              key={record.id}
              record={record}
              selected={selectedRecordIds.includes(record.id)}
              onClick={() => setState({ ...state, selectedStrongSignalRecordId: record.id })}
            />
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="space-y-1">
            <span className="text-xs font-black text-slate-500">성과 단서가 가장 뚜렷한 기록</span>
            <select className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold" value={state.selectedStrongSignalRecordId ?? ''} onChange={(event) => setState({ ...state, selectedStrongSignalRecordId: event.target.value })}>
              <option value="">선택하세요</option>
              {CRM_RECORD_CARDS.map((record) => <option key={record.id} value={record.id}>{record.owner}</option>)}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-xs font-black text-slate-500">부족 정보가 가장 큰 기록</span>
            <select className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold" value={state.selectedMissingInfoRecordId ?? ''} onChange={(event) => setState({ ...state, selectedMissingInfoRecordId: event.target.value })}>
              <option value="">선택하세요</option>
              {CRM_RECORD_CARDS.map((record) => <option key={record.id} value={record.id}>{record.owner}</option>)}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-xs font-black text-slate-500">위험한 해석이 숨어 있는 기록</span>
            <select className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold" value={state.selectedRiskRecordId ?? ''} onChange={(event) => setState({ ...state, selectedRiskRecordId: event.target.value })}>
              <option value="">선택하세요</option>
              {CRM_RECORD_CARDS.map((record) => <option key={record.id} value={record.id}>{record.owner}</option>)}
            </select>
          </label>
        </div>
      </Card>

      <Card title="우리 조 판독 결과 정리">
        <Field label="확인 가능한 사실" value={state.recordFactMemo} onChange={(value) => setState({ ...state, recordFactMemo: value })} placeholder="예: 자료 전달, 고객 질문, 추가 확인 예정처럼 기록에서 실제로 확인 가능한 사실만 씁니다." />
        <Field label="아직 부족한 정보" value={state.recordMissingMemo ?? state.missingInfo} onChange={(value) => setState({ ...state, recordMissingMemo: value, missingInfo: value })} placeholder="예: 다음 접점의 목적, 고객 질문의 배경, 후속조치 지연 이유가 부족합니다." />
        <Field label="과잉해석하면 안 되는 부분" value={state.recordRiskMemo ?? state.overInterpretationRisk} onChange={(value) => setState({ ...state, recordRiskMemo: value, overInterpretationRisk: value })} placeholder="예: 반응 좋음, 고개 끄덕임을 관심이나 전환 가능성으로 단정하지 않습니다." />
        <Field label="팀원에게 확인할 질문" value={state.recordQuestionMemo ?? state.teamQuestion} onChange={(value) => setState({ ...state, recordQuestionMemo: value, teamQuestion: value })} placeholder="예: 다음 연락 때 고객에게 무엇을 확인하려고 하나요?" />
      </Card>

      <Card title="AI와 비교하고 7단계로 넘길 실행 신호 정리">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setState({ ...state, aiRecordPrompt: recordPrompt })}>AI에게 고객 활동 기록 해석 초안 요청</Button>
          <Button onClick={() => copyText(state.aiRecordPrompt || recordPrompt)}>프롬프트 복사</Button>
        </div>
        <Field label="AI 기록 해석 초안 붙여넣기" value={state.aiRecordDraft} onChange={(value) => setState({ ...state, aiRecordDraft: value })} min="min-h-32" />
        <Field label="AI 해석에서 수정한 위험 표현" value={state.revisedRiskExpression} onChange={(value) => setState({ ...state, revisedRiskExpression: value })} placeholder="예: ‘관심이 높다’ 대신 ‘추가 확인할 질문이 남았다’로 수정합니다." />
        <Field label="7단계로 넘길 실행 신호" value={state.executionSignalMemo} onChange={(value) => setState({ ...state, executionSignalMemo: value })} placeholder="예: 선택 KPI와 연결되는 기록 증거가 남은 건과 빠진 건을 먼저 확인하고, 금요일 점검에서 막힌 이유와 지원 필요 사항을 묻는다." />
      </Card>
    </section>
  );
}

export function V40VNextPerformanceTwoWeekFlowLab() {
  const [state, setState] = useStored<State>(V40_VNEXT_PERFORMANCE_CASCADE_STORAGE_KEY, DEFAULT_STATE);
  const focusOptions = useMemo(() => buildFocusOptions(state), [state]);
  const signalOptions = useMemo(() => buildSignalOptions(state), [state]);
  const pauseOptions = useMemo(() => buildPauseOptions(state), [state]);
  const checkOptions = useMemo(() => buildMidCheckOptions(state), [state]);
  const flowPrompt = useMemo(() => buildFlowPrompt(state), [state]);

  return (
    <section className="space-y-4">
      <Card title="5단계 선택 기준과 6단계 실행 신호 다시 보기">
        <SummaryPanel state={state} />
        <p className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
          6단계 실행 신호: <b>{state.executionSignalMemo || '미작성'}</b>
        </p>
        <p className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
          성과관리는 더 많이 시키는 일이 아니라, 이번 2주 동안 무엇을 보고, 무엇을 줄이고, 어떤 질문으로 맞출지 정하는 일입니다.
        </p>
      </Card>

      <Card title="이번 2주 성과관리 초점 후보">
        <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-600">
          아래 후보는 고정 예시가 아닙니다. 5단계에서 선택한 selectedTeamTaskId, selectedCsfIds, selectedKpiIds를 바탕으로 달라집니다.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {focusOptions.map((option) => (
            <ChoiceButton
              key={option.id}
              option={option}
              selected={state.twoWeekFirstAction === option.autofill || listOf(state.selectedFlowIds).includes(option.id)}
              onClick={() => setState({ ...state, twoWeekFirstAction: option.autofill, selectedFlowIds: toggle(state.selectedFlowIds, option.id, 3) })}
            />
          ))}
        </div>
        <Field label="우리 조의 이번 2주 성과관리 초점" value={state.twoWeekFirstAction} onChange={(value) => setState({ ...state, twoWeekFirstAction: value })} placeholder="선택한 팀 전략과제·CSF·KPI 기준으로 이번 2주 동안 먼저 볼 초점을 씁니다." />
      </Card>

      <Card title="먼저 볼 실행 신호 후보">
        <div className="grid gap-3 md:grid-cols-2">
          {signalOptions.map((option) => (
            <ChoiceButton
              key={option.id}
              option={option}
              selected={state.memberRecord === option.autofill}
              onClick={() => setState({ ...state, memberRecord: option.autofill })}
            />
          ))}
        </div>
        <Field label="먼저 볼 실행 신호 / 팀원이 남길 기록" value={state.memberRecord} onChange={(value) => setState({ ...state, memberRecord: value })} placeholder="예: 선택 KPI와 연결되는 증거가 기록에 남았는지, 빠졌다면 무엇이 부족한지 확인합니다." />
      </Card>

      <Card title="잠시 줄일 활동 후보">
        <div className="grid gap-3 md:grid-cols-2">
          {pauseOptions.map((option) => (
            <ChoiceButton
              key={option.id}
              option={option}
              selected={state.pauseActivity === option.autofill}
              onClick={() => setState({ ...state, pauseActivity: option.autofill })}
            />
          ))}
        </div>
        <Field label="잠시 줄이거나 멈출 활동" value={state.pauseActivity} onChange={(value) => setState({ ...state, pauseActivity: value })} placeholder="더 많이 시키기보다 이번 2주 초점과 직접 연결되지 않는 활동을 줄입니다." />
      </Card>

      <Card title="팀장 중간 점검 질문 작성">
        <div className="grid gap-3 md:grid-cols-2">
          {checkOptions.map((option) => (
            <ChoiceButton
              key={option.id}
              option={option}
              selected={state.midCheckQuestion === option.autofill}
              onClick={() => setState({ ...state, midCheckQuestion: option.autofill })}
            />
          ))}
        </div>
        <Field label="팀장 중간 점검 질문" value={state.midCheckQuestion} onChange={(value) => setState({ ...state, midCheckQuestion: value })} placeholder="예: 이번 주 기록에서 확인 가능한 사실, 부족한 정보, 팀장 지원이 필요한 부분은 무엇인가요?" />
      </Card>

      <Card title="AI에게 2주 실행 흐름 초안 요청">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setState({ ...state, aiFlowPrompt: flowPrompt })}>AI에게 2주 실행 흐름 초안 요청</Button>
          <Button onClick={() => copyText(state.aiFlowPrompt || flowPrompt)}>프롬프트 복사</Button>
        </div>
        <Field label="AI 2주 실행 흐름 초안 붙여넣기" value={state.aiFlowDraft} onChange={(value) => setState({ ...state, aiFlowDraft: value })} min="min-h-32" placeholder="AI 초안을 붙여넣은 뒤, 과한 성과 압박·부족한 실행 기준·위험 표현을 아래에서 수정합니다." />
        <Field label="AI 초안의 과한 부분·부족한 부분 수정" value={state.finalExecutionStandard} onChange={(value) => setState({ ...state, finalExecutionStandard: value })} placeholder="예: CRM 기록률을 감시처럼 표현한 부분은 줄이고, KPI 증거·부족 정보·지원 필요를 확인하는 기준으로 수정합니다." />
      </Card>

      <Card title="팀 회의 설명 3문장과 8단계로 넘길 실행 기준">
        <Field label="팀 회의 설명 1문장" value={state.teamMeetingSentenceOne} onChange={(value) => setState({ ...state, teamMeetingSentenceOne: value })} min="min-h-16" placeholder="이번 2주는 우리 팀 전략과제에 맞춰 고객 활동 기록에서 실제 다음 행동의 신호를 보겠습니다." />
        <Field label="팀 회의 설명 2문장" value={state.teamMeetingSentenceTwo} onChange={(value) => setState({ ...state, teamMeetingSentenceTwo: value })} min="min-h-16" placeholder="이 기준은 평가가 아니라 부족한 정보와 지원 필요를 놓치지 않기 위한 기준입니다." />
        <Field label="팀 회의 설명 3문장" value={state.teamMeetingSentenceThree} onChange={(value) => setState({ ...state, teamMeetingSentenceThree: value })} min="min-h-16" placeholder="금요일 점검 때는 KPI 증거, 막힌 이유, 다음 행동을 함께 확인하겠습니다." />
        <Field label="8단계 업무관리로 넘길 실행 기준" value={state.finalExecutionStandard} onChange={(value) => setState({ ...state, finalExecutionStandard: value })} placeholder="예: 선택 KPI와 연결되는 기록 증거가 빠진 활동을 먼저 확인하고, 중간 점검에서 막힌 이유와 지원 필요 사항을 공유한다." />
      </Card>
    </section>
  );
}
