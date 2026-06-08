import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { useStored } from './journey-storage';

export const V40_VNEXT_PERFORMANCE_CASCADE_STORAGE_KEY = 'ckd.v40-vnext.performanceCascade.v1';

const V40_VNEXT_PERFORMANCE_CASCADE_MARKERS = [
  'V40VNextPerformanceStrategyCascadeLab',
  'V40VNextPerformanceRecordEvidenceLab',
  'V40VNextPerformanceTwoWeekFlowLab',
  '성과관리 2: 전사전략과제를 팀 전략과제·CSF·KPI로 분해하기',
  '성과관리 3: 고객 기록에서 성과 신호 읽기',
  '성과관리 4: 팀 전략과제·CSF·KPI별 2주 실행 흐름 정하기',
  '전사전략과제 → 팀 전략과제 → CSF → KPI → 고객 활동 기록 → 2주 실행',
  '전사전략과제 초기 선택 없음',
  '전사전략과제 선택 후 팀 전략과제 선택창 활성화',
  '팀 전략과제 선택 보기 4개 제시',
  '팀 전략과제 선택 후 CSF 선택창 활성화',
  '선택한 팀 전략과제별 CSF 4개 제시',
  'CSF 선택 후 KPI 선택창 활성화',
  '선택한 CSF별 KPI 4개 제시',
  'KPI 선택 후 AI 확장 요청 활성화',
  '가상 CRM 기록 카드',
  '성과 단서가 가장 뚜렷한 기록',
  '부족 정보가 가장 큰 기록',
  '위험한 해석이 숨어 있는 기록',
  '7단계로 넘길 실행 신호',
  'AI에게 CSF/KPI 후보 확장 요청',
  'AI에게 고객 활동 기록 해석 초안 요청',
  'AI에게 2주 실행 흐름 초안 요청',
  'ckd.v40-vnext.performanceCascade.v1',
  '팀 회의 설명 3문장',
  '고객가치 기반 성장 강화',
  '디지털 기반 실행관리 고도화',
  '지속가능한 성장 기반 강화',
  '시장 변화 대응력 강화',
  '후속 행동 포함 기록률',
  '후속 행동 포함 CRM 기록률',
  '승인자료 사용 확인률',
].join('|');
void V40_VNEXT_PERFORMANCE_CASCADE_MARKERS;

type KpiType = '활동' | '전환' | '품질' | '리스크';
type Theme = 'followup' | 'record' | 'crm' | 'question' | 'message' | 'boundary' | 'contact' | 'gap' | 'purpose' | 'blocker';
type Kpi = { id: string; label: string; type: KpiType; evidence: string; question: string; caution: string };
type Csf = { id: string; label: string; meaning: string; guide: string; kpis: Kpi[] };
type TeamStrategyOption = { id: string; label: string; guide: string; csfs: Csf[] };
type StrategyCard = { id: string; enterpriseTask: string; sourceHint: string; teamStrategyOptions: TeamStrategyOption[] };
type FlatKpi = Kpi & { csfId: string; csfLabel: string };
type CrmRecordCard = { id: string; owner: string; headline: string; memo: string; fact: string; signal: string; missing: string; risk: string; question: string };

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

const FLOW_OPTIONS = [
  { id: 'check-records', label: '고객 활동 기록에서 KPI 증거가 남은 건과 빠진 건을 먼저 확인한다.' },
  { id: 'ask-team', label: '팀원에게 고객 반응, 부족 정보, 실행 제약을 확인 질문으로 묻는다.' },
  { id: 'remove-noise', label: '방문 수 확대나 장문 보고처럼 KPI와 직접 연결되지 않는 활동을 잠시 줄인다.' },
  { id: 'mid-check', label: '금요일 중간 점검에서 KPI 증거와 막힌 이유를 함께 확인한다.' },
  { id: 'safety-first', label: '고객 질문과 자료 사용 범위는 승인자료·표현 안전선을 먼저 점검한다.' },
];

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
];

function makeKpi(id: string, label: string, type: KpiType, evidence: string, question: string, caution: string): Kpi {
  return { id, label, type, evidence, question, caution };
}

function kpisFor(prefix: string, theme: Theme): Kpi[] {
  const mid = makeKpi(`${prefix}-mid-check`, '팀장 중간 점검 질문 작성 건수', '품질', '중간 점검 질문, 후속 확인 질문, 기록 샘플 점검 메모', '팀장이 이번 주에 실제로 물어볼 질문은 무엇인가요?', '질문이 추궁처럼 들리지 않게 관찰 중심으로 표현합니다.');
  const risk = makeKpi(`${prefix}-risk-expression`, '위험 표현 점검률', '리스크', '수정한 표현, 보류한 답변, 확인 필요 질문', '고객에게 오해를 줄 수 있는 표현은 무엇인가요?', '처방 유도, 경쟁사 비방, 비교 우위 단정 표현을 쓰지 않습니다.');
  const sets: Record<Theme, Kpi[]> = {
    followup: [makeKpi(`${prefix}-followup-complete`, '후속조치 완료율', '전환', '자료 전달 후 확인, 다음 일정, 미해결 요청 처리 기록', '후속조치가 늦어진 이유는 고객 제약인가요, 우리 실행 제약인가요?', '후속조치를 고객 압박이나 처방 유도처럼 표현하지 않습니다.'), makeKpi(`${prefix}-next-contact`, '다음 접점 확보 건수', '전환', '다음 접점 목적, 일정, 준비 자료, 고객 확인 질문', '다음 접점은 실제 일정인가요, 가능성 언급인가요?', '다음 접점 확보를 과도한 설득으로 운영하지 않습니다.'), makeKpi(`${prefix}-delay-reason`, '후속 지연 사유 기록률', '품질', '지연 사유, 고객 일정, 내부 준비, 팀장 지원 필요', '지연 이유가 고객 제약인지 우리 실행 제약인지 보이나요?', '지연을 팀원 태도 문제로 단정하지 않습니다.'), mid],
    record: [makeKpi(`${prefix}-question-record`, '고객 질문 기록률', '품질', '고객 질문 내용, 질문 배경, 후속 확인 필요 항목', '고객 질문이 단순 확인이었나요, 다음 논의로 이어질 질문이었나요?', '고객 질문을 처방 가능성이나 제품 선호로 단정하지 않습니다.'), makeKpi(`${prefix}-next-action-record`, '후속 행동 포함 기록률', '품질', '다음 행동, 담당자, 시점, 고객 질문, 준비 자료', '기록에 다음 행동이 없으면 무엇을 더 확인해야 하나요?', '기록 입력률 자체를 성과로 단정하지 않습니다.'), makeKpi(`${prefix}-record-quality`, '고객 반응 기록 충실도', '품질', '고객 반응, 피드백, 제약요인, 다음 행동 포함 여부', '기록을 보고 다음 행동을 정할 수 있을 만큼 충분한가요?', '고객 감정이나 의도를 확인 없이 해석하지 않습니다.'), mid],
    crm: [makeKpi(`${prefix}-crm-next-action`, '후속 행동 포함 CRM 기록률', '품질', '다음 행동, 담당자, 시점, 고객 질문, 준비 자료', '기록에 다음 행동이 없으면 무엇을 더 확인해야 하나요?', 'CRM 입력률 자체를 성과로 단정하지 않습니다.'), makeKpi(`${prefix}-crm-timeliness`, 'CRM 기록 적시성', '활동', '방문 후 기록 시점, 누락 기록, 지연 사유', '기록 지연이 일정 문제인지 기록 기준 문제인지 확인했나요?', '기록 지연을 즉시 태도 문제로 해석하지 않습니다.'), makeKpi(`${prefix}-crm-bottleneck`, 'CRM 기반 실행 제약 확인 건수', '리스크', '기록에서 보이는 일정 변경, 내부 지원 요청, 자료 확인 필요', 'CRM 기록만 보고 무엇을 지원할 수 있나요?', '기록을 감시 도구처럼 쓰지 않습니다.'), mid],
    question: [makeKpi(`${prefix}-fact-interpretation`, '사실-해석 분리 기록률', '품질', '관찰 사실, 팀원 해석, 고객 확인 필요 사항', '고객 반응과 우리의 해석이 분리되어 있나요?', '반응을 선호나 처방 가능성으로 단정하지 않습니다.'), makeKpi(`${prefix}-confirm-question`, '확인 질문 작성 건수', '품질', '고객에게 확인할 질문, 팀원에게 물어볼 질문', '성급한 해석 대신 어떤 확인 질문을 남겼나요?', '확인 질문이 유도 질문이 되지 않게 합니다.'), makeKpi(`${prefix}-interpretation-risk`, '과잉해석 수정 건수', '리스크', '긍정 반응 단정, 의도 추정, 제품 선호 해석 수정', '어떤 표현을 더 안전하게 바꿔야 하나요?', '고객의 의도를 확인 없이 말하지 않습니다.'), mid],
    message: [makeKpi(`${prefix}-approved-material`, '승인자료 사용 확인률', '리스크', '사용 자료, 전달 메시지, 고객 질문 범위, 자료 확인 메모', '사용한 자료와 답변 범위가 승인자료 안에 있나요?', '승인 범위 밖 내용을 확장하지 않습니다.'), makeKpi(`${prefix}-message-consistency`, '공통 메시지 사용률', '품질', '팀 공통 문장, 고객 질문 대응 문장, 수정한 표현', '팀원이 같은 핵심 문장을 안전하게 쓰고 있나요?', '일관성이 기계적 반복으로 느껴지지 않게 합니다.'), makeKpi(`${prefix}-risk-correction`, '위험 표현 수정 건수', '리스크', '비교 우위 단정, 처방 유도, 허가 외 사용 암시 수정 기록', '고객에게 부담이나 오해를 줄 수 있는 표현은 무엇인가요?', '경쟁사 비방, 비교 우위 단정, 처방 유도 표현을 쓰지 않습니다.'), risk],
    boundary: [makeKpi(`${prefix}-question-boundary`, '고객 질문 대응 범위 확인 건수', '품질', '고객 질문, 답변 가능 범위, 추가 확인 필요 여부', '이 질문은 바로 답할 수 있나요, 확인 후 답해야 하나요?', '확인되지 않은 답변을 현장에서 확정적으로 말하지 않습니다.'), makeKpi(`${prefix}-confirm-later`, '확인 후 대응 건수', '품질', '즉답하지 않고 확인 후 대응한 고객 질문', '바로 답하지 말고 확인해야 하는 질문은 무엇인가요?', '확인 필요를 회피가 아니라 안전관리로 설명합니다.'), makeKpi(`${prefix}-cp-check`, 'CP 확인 필요 건수', '리스크', '확인 필요 질문, 관련 부서 확인 요청, 보류 답변 기록', '이 사안은 팀장 또는 관련 부서 확인이 필요한가요?', '확인 필요를 실행 지연이 아니라 안전관리로 설명합니다.'), risk],
    contact: [makeKpi(`${prefix}-nonface-follow`, '비대면 접점 후속 확인률', '전환', '전화·메시지 후속 확인, 자료 확인 여부, 고객 질문', '자료 전달 후 실제 확인이나 질문이 있었나요?', '자료 전달 자체를 고객 이해나 성과로 단정하지 않습니다.'), makeKpi(`${prefix}-material-response`, '자료 요청 대응률', '전환', '자료 요청 내용, 승인자료 여부, 대응 시점, 후속 확인', '고객 요청에 승인자료 범위 안에서 대응했나요?', '자료 요청을 제품 선호나 처방 의향으로 해석하지 않습니다.'), makeKpi(`${prefix}-contact-reaction`, '대체 접점 반응 기록률', '품질', '비대면 접점 이후 고객 질문, 확인 요청, 미응답 사유', '대체 접점 이후 실제 반응이 기록되어 있나요?', '무응답을 부정적 반응으로 단정하지 않습니다.'), mid],
    gap: [makeKpi(`${prefix}-untouched-check`, '미접촉 고객 확인률', '활동', '미접촉 기간, 접근 경로, 접점 공백 사유', '미접촉은 고객 제약 때문인가요, 우리 실행 루틴 때문인가요?', '미접촉 고객을 무리하게 압박하지 않습니다.'), makeKpi(`${prefix}-gap-reason`, '접점 공백 사유 기록률', '리스크', '일정 제약, 접근 경로 부재, 내부 준비 부족, 고객 상황', '접점 공백의 이유가 기록에 남아 있나요?', '공백을 팀원 노력 부족으로 단정하지 않습니다.'), makeKpi(`${prefix}-recovery-purpose`, '접점 회복 목적 작성률', '품질', '접근 목적, 확인 질문, 다음 행동', '다시 접촉하는 이유와 확인할 질문이 분명한가요?', '접점 회복을 고객 압박으로 운영하지 않습니다.'), mid],
    purpose: [makeKpi(`${prefix}-visit-purpose`, '접점 목적 작성률', '활동', '방문 목적, 확인 질문, 준비 자료, 예상 후속 행동', '접점 전에 무엇을 확인하려는지 명확한가요?', '방문 수 자체를 성과로 단정하지 않습니다.'), makeKpi(`${prefix}-next-topic`, '다음 논의 주제 기록률', '품질', '다음 논의 주제, 고객 질문, 추가 확인 필요 사항', '다음 논의 주제가 고객 질문과 연결되어 있나요?', '고객에게 부담을 주는 후속 논의로 운영하지 않습니다.'), makeKpi(`${prefix}-no-purpose-visit`, '목적 불명확 접점 확인 건수', '리스크', '목적이 약한 반복 방문, 후속 행동 없는 방문', '목적 없는 반복 접점을 줄일 수 있나요?', '활동량 감소를 무조건 부정적으로 보지 않습니다.'), mid],
    blocker: [makeKpi(`${prefix}-blocker-found`, '실행 제약 확인 건수', '리스크', '고객 접근 제약, 일정 변경, 내부 지원 요청, 자료 확인 필요', '막힌 지점은 팀원이 혼자 해결할 일인가요, 팀장이 연결할 일인가요?', '실행 부진을 고객 탓이나 팀원 탓으로 단정하지 않습니다.'), makeKpi(`${prefix}-support-action`, '팀장 지원 실행 건수', '전환', '팀장 연결, 자료 확인, 부서 협조, 우선순위 조정', '팀장이 실제로 연결하거나 조정한 것은 무엇인가요?', '지원이 과잉개입이 되지 않게 합니다.'), makeKpi(`${prefix}-blocked-followup`, '막힌 후속조치 처리율', '전환', '막힌 후속조치, 처리 상태, 다음 확인 시점', '막힌 일이 방치되지 않고 다음 확인으로 이어졌나요?', '처리율만 보고 무리한 압박을 하지 않습니다.'), mid],
  };
  return sets[theme];
}

function makeCsf(prefix: string, theme: Theme, label: string, meaning: string, guide: string): Csf {
  return { id: `${prefix}-${theme}`, label, meaning, guide, kpis: kpisFor(`${prefix}-${theme}`, theme) };
}

function makeTeamStrategy(id: string, label: string, guide: string, themes: Theme[]): TeamStrategyOption {
  const labels: Record<Theme, [string, string, string]> = {
    followup: ['후속 행동이 일정 안에 실행되어야 한다', '고객 질문·자료 요청·다음 약속이 방치되지 않아야 합니다.', '고객 반응 이후 실제 실행으로 이어지는지를 봅니다.'],
    record: ['고객 질문과 반응이 구체적으로 기록되어야 한다', '질문과 반응이 다음 행동의 근거로 남아야 합니다.', '후속 실행을 만들 수 있을 만큼 기록이 구체적인지 봅니다.'],
    crm: ['CRM 기록에 다음 행동이 포함되어야 한다', '방문 사실보다 다음 행동과 지원 필요가 남아야 합니다.', '기록이 실행의 출발점이 되는지 봅니다.'],
    question: ['고객 반응과 팀원의 해석이 분리되어야 한다', '고객 반응을 제품 선호나 처방 가능성으로 단정하지 않아야 합니다.', '사실과 해석을 분리하고 확인 질문으로 바꿉니다.'],
    message: ['승인자료 범위 안에서 메시지를 전달해야 한다', '허가 외 사용 암시와 과장 표현을 막아야 합니다.', '성과 실행과 안전선을 함께 관리합니다.'],
    boundary: ['답변 가능 범위가 정리되어야 한다', '현장에서 즉흥적으로 답하지 않고 확인 후 대응해야 합니다.', '질문 대응의 안전선을 만듭니다.'],
    contact: ['방문 외 접점 이후 실제 반응이 확인되어야 한다', '자료 전달 자체가 아니라 확인·질문·다음 논의가 남아야 합니다.', '대체 접점 이후 반응을 기록으로 확인합니다.'],
    gap: ['접점 공백의 이유가 확인되어야 한다', '미접촉의 원인이 고객 제약인지 실행 루틴인지 분리해야 합니다.', '공백을 비난보다 진단으로 봅니다.'],
    purpose: ['접점 목적이 명확해야 한다', '접점이 활동량이 아니라 목적 있는 실행이어야 합니다.', '무엇을 확인하려는 접점인지 먼저 정리합니다.'],
    blocker: ['실행을 막는 제약이 확인되어야 한다', '지연 원인을 팀원 탓으로 단정하지 않고 확인해야 합니다.', '막힌 이유와 팀장 지원 필요를 함께 확인합니다.'],
  };
  return { id, label, guide, csfs: themes.map((theme) => makeCsf(id, theme, ...labels[theme])) };
}

const STRATEGY_CARDS: StrategyCard[] = [
  { id: 'customer-value-growth', enterpriseTask: '고객가치 기반 성장 강화', sourceHint: '고객 접점 이후의 반응, 질문, 다음 행동이 실제 실행으로 이어지도록 만드는 전사 방향입니다.', teamStrategyOptions: [makeTeamStrategy('customer-contact-conversion', '고객 접점 이후 실행 전환율 강화', '방문과 접촉 이후 실제 후속 행동으로 이어지는 흐름을 강화하려는 팀에 적합합니다.', ['record', 'followup', 'blocker', 'boundary']), makeTeamStrategy('customer-question-followup', '고객 질문 기반 후속 실행 체계화', '고객 질문을 단순 기록이 아니라 다음 행동으로 연결하려는 팀에 적합합니다.', ['question', 'record', 'followup', 'boundary']), makeTeamStrategy('customer-record-quality', '고객 반응 기록 품질 고도화', '방문 수보다 고객 반응 기록의 질을 높이려는 팀에 적합합니다.', ['record', 'question', 'blocker', 'purpose']), makeTeamStrategy('key-customer-flow', '핵심 고객 접점 목적과 후속 흐름 정렬', '핵심 고객 접점의 목적과 다음 논의 흐름을 선명하게 만들려는 팀에 적합합니다.', ['purpose', 'record', 'followup', 'boundary'])] },
  { id: 'digital-execution-management', enterpriseTask: '디지털 기반 실행관리 고도화', sourceHint: 'CRM과 기록을 실행관리, 팀장 점검, 지원 행동으로 연결하는 전사 방향입니다.', teamStrategyOptions: [makeTeamStrategy('crm-execution-system', 'CRM 기반 영업 실행관리 체계 강화', 'CRM 입력은 많은데 실제 후속 실행으로 이어지지 않는 팀에 적합합니다.', ['crm', 'followup', 'blocker', 'boundary']), makeTeamStrategy('crm-quality-advance', 'CRM 기록 품질 고도화', '기록 품질을 높여 팀장이 지원할 지점을 확인하려는 팀에 적합합니다.', ['record', 'blocker', 'question', 'purpose']), makeTeamStrategy('weekly-execution-rhythm', '주간 실행 점검 리듬 정착', '기록 시점과 점검 리듬이 불안정한 팀에 적합합니다.', ['crm', 'purpose', 'followup', 'record']), makeTeamStrategy('crm-coaching-question', 'CRM 기반 코칭 질문 운영', '기록 점검이 감시로 느껴지지 않게 바꾸려는 팀에 적합합니다.', ['question', 'blocker', 'record', 'boundary'])] },
  { id: 'sustainable-growth', enterpriseTask: '지속가능한 성장 기반 강화', sourceHint: '고객 커뮤니케이션의 일관성, 승인자료 범위, 표현 안전선을 함께 관리하는 전사 방향입니다.', teamStrategyOptions: [makeTeamStrategy('approved-communication', '승인자료 기반 고객 커뮤니케이션 일관성 강화', '고객 커뮤니케이션의 안전성과 일관성을 높이려는 팀에 적합합니다.', ['message', 'boundary', 'record', 'purpose']), makeTeamStrategy('question-response-boundary', '고객 질문 답변 가능 범위 관리', '현장에서 애매한 질문에 즉흥적으로 답하는 위험을 줄이고 싶은 팀에 적합합니다.', ['boundary', 'question', 'message', 'record']), makeTeamStrategy('safe-expression-replace', '위험 표현 점검 및 대체 문장 정착', '비교 우위 단정, 처방 유도, 허가 외 사용 암시를 예방하려는 팀에 적합합니다.', ['message', 'boundary', 'record', 'question']), makeTeamStrategy('common-response-message', '팀 공통 고객 대응 문장 정렬', '팀원별 표현 편차를 줄이고 공통 언어를 만들려는 팀에 적합합니다.', ['message', 'boundary', 'purpose', 'record'])] },
  { id: 'market-response', enterpriseTask: '시장 변화 대응력 강화', sourceHint: '고객 접점 방식이 달라질 때도 반응과 후속 확인이 끊기지 않게 만드는 전사 방향입니다.', teamStrategyOptions: [makeTeamStrategy('contact-diversification', '고객 접점 방식 다변화와 후속 확인 체계 강화', '방문 외 접점의 효과를 단순 발송이 아니라 후속 확인으로 보려는 팀에 적합합니다.', ['contact', 'followup', 'record', 'boundary']), makeTeamStrategy('material-request-followup', '자료 요청 이후 확인 흐름 강화', '자료 전달 이후 반응 확인이 약한 팀에 적합합니다.', ['contact', 'boundary', 'followup', 'message']), makeTeamStrategy('contact-gap-check', '접점 공백 고객 접근 경로 점검', '무리한 접촉 확대보다 접점 공백의 이유를 먼저 보려는 팀에 적합합니다.', ['gap', 'purpose', 'record', 'blocker']), makeTeamStrategy('hybrid-contact-flow', '대면·비대면 접점 실행 흐름 통합', '접점 방식이 다양해졌지만 실행 흐름이 끊기는 팀에 적합합니다.', ['contact', 'followup', 'crm', 'record'])] },
];

function selectedStrategy(state: State) { return STRATEGY_CARDS.find((strategy) => strategy.id === state.selectedStrategyId); }
function selectedTeamStrategyOption(strategy: StrategyCard | undefined, state: State) { return strategy?.teamStrategyOptions.find((option) => option.id === state.selectedTeamTaskId); }
function flatCsfs(strategy: StrategyCard | undefined, state?: State): Csf[] { return state ? selectedTeamStrategyOption(strategy, state)?.csfs ?? [] : []; }
function flatKpis(strategy: StrategyCard | undefined, state?: State): FlatKpi[] { return flatCsfs(strategy, state).flatMap((csfItem) => csfItem.kpis.map((kpiItem) => ({ ...kpiItem, csfId: csfItem.id, csfLabel: csfItem.label }))); }
function toggle(list: string[], id: string, max?: number) { if (list.includes(id)) return list.filter((item) => item !== id); const next = [...list, id]; return max ? next.slice(-max) : next; }
function toggleKpiForCsf(selectedKpiIds: string[], kpiItem: FlatKpi, allKpis: FlatKpi[]) { if (selectedKpiIds.includes(kpiItem.id)) return selectedKpiIds.filter((id) => id !== kpiItem.id); const currentCsfKpiIds = allKpis.filter((item) => item.csfId === kpiItem.csfId).map((item) => item.id); const selectedForCsf = selectedKpiIds.filter((id) => currentCsfKpiIds.includes(id)); const withoutOldestIfNeeded = selectedForCsf.length >= 2 ? selectedKpiIds.filter((id) => id !== selectedForCsf[0]) : selectedKpiIds; return [...withoutOldestIfNeeded, kpiItem.id]; }
function selectedLabels(items: { id: string; label: string }[], ids: string[]) { const labels = items.filter((item) => ids.includes(item.id)).map((item) => item.label); return labels.length ? labels.join(' · ') : '미선택'; }
function findRecord(id?: string) { return CRM_RECORD_CARDS.find((record) => record.id === id); }

function Button({ children, onClick, disabled = false }: { children: string; onClick: () => void; disabled?: boolean }) { return <button type="button" disabled={disabled} onClick={onClick} className={`rounded-2xl px-4 py-3 text-sm font-black shadow-sm ${disabled ? 'cursor-not-allowed bg-slate-200 text-slate-400' : 'bg-slate-950 text-white hover:bg-slate-800'}`}>{children}</button>; }
function Field({ label, value, onChange, placeholder, min = 'min-h-24', disabled = false }: { label: string; value: string | undefined; onChange: (value: string) => void; placeholder?: string; min?: string; disabled?: boolean }) { return <label className="block space-y-1"><span className="text-xs font-black text-slate-500">{label}</span><textarea disabled={disabled} className={`${min} w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm leading-6 ${disabled ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-700'}`} value={value ?? ''} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>; }
function Card({ title, children }: { title: string; children: ReactNode }) { return <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"><h3 className="text-lg font-black text-slate-950">{title}</h3><div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">{children}</div></section>; }
function LockedPanel({ title, body }: { title: string; body: string }) { return <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm leading-6 text-slate-500"><p className="font-black text-slate-700">{title}</p><p className="mt-1 text-xs font-bold">{body}</p></div>; }

function buildCascadePrompt(strategy: StrategyCard | undefined, state: State) {
  return ['당신은 제약영업 팀장의 성과관리 코치입니다.', '', '아래 전사전략과제를 우리 조의 팀 전략과제, CSF, KPI로 분해해 주세요.', '', `전사전략과제: ${strategy?.enterpriseTask || '아직 선택 전'}`, `우리 조가 선정한 팀 전략과제: ${state.customTeamTask || '아직 작성 전'}`, `선택 CSF: ${selectedLabels(flatCsfs(strategy, state), state.selectedCsfIds)}`, `선택 KPI: ${selectedLabels(flatKpis(strategy, state), state.selectedKpiIds)}`, '', '요청:', '1. 우리 조의 팀 전략과제가 전사전략과제에 잘 연결되어 있는지 검토해 주세요.', '2. 선택한 팀 전략과제 기준으로 놓친 CSF 후보가 있으면 2개만 추가 제안해 주세요.', '3. 선택한 CSF별 KPI 후보를 활동, 전환, 품질, 리스크 지표로 구분해 보완해 주세요.', '4. 고객 활동 기록에서 확인할 증거를 적어 주세요.', '5. 과도한 성과 압박이나 컴플라이언스상 조심해야 할 표현을 표시해 주세요.', '', '주의: 실제 고객명, 병원명, 의료진명, 제품명, 매출자료, 처방 정보는 쓰지 마세요. 처방 유도, 허가 외 사용 암시, 경쟁사 비방, 비교 우위 단정 표현은 제외해 주세요.'].join('\n');
}

function buildRecordPrompt(strategy: StrategyCard | undefined, state: State) {
  const strong = findRecord(state.selectedStrongSignalRecordId);
  const missing = findRecord(state.selectedMissingInfoRecordId);
  const risk = findRecord(state.selectedRiskRecordId);
  return ['당신은 제약영업 팀장의 성과관리 코치입니다.', '', '아래 고객 활동 기록은 실제 기록이 아니라 교육용 가상 CRM 기록 카드입니다.', '고객명, 병원명, 의료진명, 제품명, 실제 매출자료, 처방 정보는 포함하지 않았습니다.', '', `전사전략과제: ${strategy?.enterpriseTask || '아직 선택 전'}`, `팀 전략과제: ${state.customTeamTask || '아직 작성 전'}`, `선택 CSF: ${selectedLabels(flatCsfs(strategy, state), state.selectedCsfIds)}`, `선택 KPI: ${selectedLabels(flatKpis(strategy, state), state.selectedKpiIds)}`, '', '우리 조가 먼저 판독한 결과:', `- 성과 단서가 가장 뚜렷한 기록: ${strong ? `${strong.owner} · ${strong.memo}` : '미선택'}`, `- 부족 정보가 가장 큰 기록: ${missing ? `${missing.owner} · ${missing.memo}` : '미선택'}`, `- 위험한 해석이 숨어 있는 기록: ${risk ? `${risk.owner} · ${risk.memo}` : '미선택'}`, `- 확인 가능한 사실: ${state.recordFactMemo || '아직 작성 전'}`, `- 아직 부족한 정보: ${state.recordMissingMemo || state.missingInfo || '아직 작성 전'}`, `- 과잉해석하면 안 되는 부분: ${state.recordRiskMemo || state.overInterpretationRisk || '아직 작성 전'}`, `- 팀원에게 확인할 질문: ${state.recordQuestionMemo || state.teamQuestion || '아직 작성 전'}`, '', '요청:', '1. 확인 가능한 사실과 해석을 분리해 주세요.', '2. KPI와 연결되는 성과 단서를 찾아 주세요.', '3. 아직 부족한 정보를 알려 주세요.', '4. 과잉해석하면 안 되는 표현과 컴플라이언스상 위험한 표현을 찾아 주세요.', '5. 팀장이 팀원에게 물어볼 확인 질문 3개를 만들어 주세요.', '6. 7단계 2주 실행 흐름으로 넘길 실행 신호를 3개로 정리해 주세요.', '', '주의: 고객 반응을 처방 가능성으로 단정하지 마세요. 고객을 등급화하지 마세요. 처방 유도, 허가 외 사용 암시, 경쟁사 비방, 비교 우위 단정 표현은 제외해 주세요.'].join('\n');
}

function buildFlowPrompt(strategy: StrategyCard | undefined, state: State) {
  return ['선택한 팀 전략과제, CSF, KPI, 고객 기록 단서를 바탕으로 이번 2주 실행 흐름을 만들어 주세요.', '', `전사전략과제: ${strategy?.enterpriseTask || '아직 선택 전'}`, `팀 전략과제: ${state.customTeamTask || '아직 작성 전'}`, `선택 CSF: ${selectedLabels(flatCsfs(strategy, state), state.selectedCsfIds)}`, `선택 KPI: ${selectedLabels(flatKpis(strategy, state), state.selectedKpiIds)}`, `확인된 KPI 증거: ${state.selectedEvidenceIds.join(' · ') || '아직 선택 전'}`, `6단계 성과 신호: ${state.executionSignalMemo || '아직 작성 전'}`, `아직 부족한 정보: ${state.recordMissingMemo || state.missingInfo || '아직 작성 전'}`, `팀원에게 확인할 질문: ${state.recordQuestionMemo || state.teamQuestion || '아직 작성 전'}`, '', '요청: 이번 2주 동안 먼저 확인할 것, 팀원이 남겨야 할 기록, 팀장이 중간 점검할 질문, 잠시 줄이거나 멈출 활동, 컴플라이언스 주의 표현, 팀 회의에서 설명할 3문장을 작성해 주세요.', '주의: 고객 압박, 처방 유도, 허가 외 사용 암시, 경쟁사 비방, 비교 우위 단정 표현은 제외해 주세요.'].join('\n');
}

function copyText(text: string) { void navigator.clipboard?.writeText(text); }

function RecordCardButton({ record, selected, onClick }: { record: CrmRecordCard; selected: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`rounded-2xl border p-4 text-left ${selected ? 'border-sky-400 bg-sky-50' : 'border-slate-200 bg-white hover:border-slate-400'}`}><p className="text-xs font-black text-sky-700">{record.owner}</p><p className="mt-1 font-black text-slate-950">{record.headline}</p><p className="mt-2 text-sm leading-6 text-slate-700">“{record.memo}”</p><p className="mt-2 text-xs font-bold leading-5 text-slate-500">팀장 질문 힌트: {record.question}</p></button>;
}

export function V40VNextPerformanceStrategyCascadeLab() {
  const [state, setState] = useStored<State>(V40_VNEXT_PERFORMANCE_CASCADE_STORAGE_KEY, DEFAULT_STATE);
  const strategy = selectedStrategy(state);
  const selectedTeamStrategy = selectedTeamStrategyOption(strategy, state);
  const csfs = flatCsfs(strategy, state);
  const allKpis = flatKpis(strategy, state);
  const selectedCsfs = csfs.filter((csfItem) => state.selectedCsfIds.includes(csfItem.id));
  const hasEnterpriseStrategy = Boolean(strategy);
  const hasTeamStrategy = Boolean(state.selectedTeamTaskId && state.customTeamTask?.trim());
  const hasCsfSelection = state.selectedCsfIds.length >= 2;
  const hasKpiSelection = state.selectedKpiIds.length >= 2;
  const cascadePrompt = useMemo(() => buildCascadePrompt(strategy, state), [strategy, state]);
  const teamStrategyOptions = strategy?.teamStrategyOptions ?? [];
  return <section className="space-y-4"><Card title="전사전략과제 선택"><p className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">2026년 하반기 전사 전략과제가 발표되었습니다. 여러분의 팀에서 중점적으로 실행할 전사 전략과제를 먼저 선택해주세요.</p><div className="grid gap-3 md:grid-cols-2">{STRATEGY_CARDS.map((item) => <button key={item.id} type="button" onClick={() => setState({ ...state, selectedStrategyId: item.id, selectedTeamTaskId: '', customTeamTask: '', selectedCsfIds: [], selectedKpiIds: [], aiCascadePrompt: '', aiCascadeDraft: '', finalCsfKpiMemo: '' })} className={`rounded-2xl border p-4 text-left transition ${state.selectedStrategyId === item.id ? 'border-slate-900 bg-slate-950 text-white' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400'}`}><p className="text-xs font-black opacity-70">전사전략과제</p><p className="mt-1 text-base font-black">{item.enterpriseTask}</p><p className="mt-2 text-xs leading-5 opacity-70">{item.sourceHint}</p></button>)}</div></Card><Card title="우리 조가 실행할 팀 전략과제 선택">{!hasEnterpriseStrategy ? <LockedPanel title="전사전략과제 선택 후 팀 전략과제 선택창 활성화" body="먼저 전사전략과제를 선택해야 팀 전략과제 후보 4개가 나타납니다." /> : <><p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-600">팀 전략과제 선택 보기 4개 제시 · 처음에는 선택된 보기가 없습니다. 선택한 전사전략과제를 우리 조가 실제로 실행할 성과관리 과제로 바꿉니다.</p><div className="grid gap-3 md:grid-cols-2">{teamStrategyOptions.map((option) => <button key={option.id} type="button" onClick={() => setState({ ...state, selectedTeamTaskId: option.id, customTeamTask: option.label, selectedCsfIds: [], selectedKpiIds: [], aiCascadePrompt: '', aiCascadeDraft: '', finalCsfKpiMemo: '' })} className={`rounded-2xl border p-4 text-left ${state.selectedTeamTaskId === option.id ? 'border-cyan-400 bg-cyan-50' : 'border-slate-200 bg-white hover:border-slate-400'}`}><p className="font-black text-slate-950">{option.label}</p><p className="mt-2 text-xs font-bold leading-5 text-slate-600">가이드: {option.guide}</p></button>)}</div>{selectedTeamStrategy ? <p className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">선택한 팀 전략과제 가이드: {selectedTeamStrategy.guide}</p> : <LockedPanel title="아직 선택된 팀 전략과제가 없습니다" body="위 4개 팀 전략과제 중 우리 조가 중점 실행할 과제 1개를 먼저 선택하세요." />}<Field label="우리 조가 선정한 팀 전략과제 보완 문장" value={state.customTeamTask} onChange={(value) => setState({ ...state, customTeamTask: value, selectedCsfIds: value.trim() ? state.selectedCsfIds : [], selectedKpiIds: value.trim() ? state.selectedKpiIds : [] })} placeholder="팀 전략과제 후보에서 1개를 고른 뒤, 우리 조 언어로 조금 더 다듬어도 됩니다." /><Field label="전략과제 핵심 의도 해석" value={state.cascadeInterpretation} onChange={(value) => setState({ ...state, cascadeInterpretation: value })} placeholder="예: 이 과제는 단순 활동량보다 고객 반응 이후 후속 실행과 기록 품질을 높이라는 의미입니다." /></>}</Card><Card title="CSF 선택">{!hasTeamStrategy ? <LockedPanel title="팀 전략과제 선택 후 CSF 선택창 활성화" body="먼저 우리 조가 실행할 팀 전략과제를 선택하거나 작성해야, 선택한 팀 전략과제별 CSF 4개가 나타납니다." /> : <><p className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">CSF는 핵심성공요인입니다. 지금 보이는 CSF는 선택한 팀 전략과제에 맞춰 달라집니다. CSF 보기 4개 제시 중 2개를 선택하세요. “측정하기 쉬운 것”이 아니라 “성공에 꼭 필요한 조건”을 고르는 단계입니다.</p><div className="grid gap-3 md:grid-cols-2">{csfs.map((csfItem) => <button key={csfItem.id} type="button" onClick={() => setState({ ...state, selectedCsfIds: toggle(state.selectedCsfIds, csfItem.id, 2), selectedKpiIds: state.selectedKpiIds.filter((id) => !csfItem.kpis.some((kpiItem) => kpiItem.id === id)), aiCascadePrompt: '', aiCascadeDraft: '' })} className={`rounded-2xl border p-4 text-left ${state.selectedCsfIds.includes(csfItem.id) ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white'}`}><p className="font-black text-slate-950">{csfItem.label}</p><p className="mt-1 text-xs font-bold leading-5 text-slate-600">설명: {csfItem.meaning}</p><p className="mt-2 text-xs font-bold leading-5 text-emerald-700">가이드: {csfItem.guide}</p></button>)}</div></>}</Card><Card title="KPI 선택">{!hasCsfSelection ? <LockedPanel title="CSF 선택 후 KPI 선택창 활성화" body="CSF를 2개 선택하면, 선택한 CSF별 KPI 후보 4개가 나타납니다." /> : <><p className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">KPI는 CSF가 작동하고 있는지 확인하는 관찰 지표입니다. 선택한 CSF별 KPI 4개 제시 중 각 CSF별 최대 2개까지 선택할 수 있습니다. 결과 숫자만 보지 말고 활동·전환·품질·리스크가 함께 보이는지 확인하세요.</p>{selectedCsfs.map((csfItem) => { const kpisForCsf = allKpis.filter((kpiItem) => kpiItem.csfId === csfItem.id); return <section key={csfItem.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3"><p className="text-sm font-black text-slate-950">{csfItem.label}</p><p className="mt-1 text-xs font-bold leading-5 text-slate-500">KPI 선택 가이드: 이 CSF가 실제로 작동하는지 고객 활동 기록과 팀장 점검 질문으로 확인할 수 있는 지표를 고르세요.</p><div className="mt-3 grid gap-3 md:grid-cols-2">{kpisForCsf.map((kpiItem) => <button key={kpiItem.id} type="button" onClick={() => setState({ ...state, selectedKpiIds: toggleKpiForCsf(state.selectedKpiIds, kpiItem, allKpis), aiCascadePrompt: '', aiCascadeDraft: '' })} className={`rounded-2xl border p-4 text-left ${state.selectedKpiIds.includes(kpiItem.id) ? 'border-violet-400 bg-violet-50' : 'border-slate-200 bg-white'}`}><p className="text-xs font-black text-violet-700">{kpiItem.type} KPI</p><p className="mt-1 font-black text-slate-950">{kpiItem.label}</p><p className="mt-2 text-xs font-bold leading-5 text-slate-600">설명: 이 지표는 “{kpiItem.evidence}”로 확인합니다.</p><p className="mt-1 text-xs font-bold leading-5 text-slate-600">가이드 질문: {kpiItem.question}</p><p className="mt-1 text-xs font-bold leading-5 text-amber-700">주의: {kpiItem.caution}</p></button>)}</div></section>; })}<Field label="KPI 선택 이유와 컴플라이언스 주의점" value={state.cascadeComplianceCaution} onChange={(value) => setState({ ...state, cascadeComplianceCaution: value })} placeholder="예: 후속 실행을 보기 위한 KPI이지만 고객 반응을 처방 가능성으로 단정하지 않습니다." /></>}</Card><Card title="AI에게 CSF/KPI 후보 확장 요청">{!hasKpiSelection ? <LockedPanel title="KPI 선택 후 AI 확장 요청 활성화" body="우리 조가 먼저 KPI를 2개 이상 선택한 뒤, AI에게 놓친 후보와 위험 표현을 점검받습니다." /> : <><p className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">우리 조가 먼저 고른 팀 전략과제, CSF, KPI를 바탕으로 AI에게 놓친 후보와 위험 표현을 점검받습니다. AI는 선택을 대신하지 않고, 비교와 보완에만 사용합니다.</p><div className="flex flex-wrap gap-2"><Button onClick={() => setState({ ...state, aiCascadePrompt: cascadePrompt })}>AI 확장 프롬프트 만들기</Button><Button onClick={() => copyText(state.aiCascadePrompt || cascadePrompt)}>프롬프트 복사</Button></div><Field label="AI CSF/KPI 초안 붙여넣기" value={state.aiCascadeDraft} onChange={(value) => setState({ ...state, aiCascadeDraft: value })} min="min-h-32" /><Field label="우리 조 최종 CSF/KPI 메모" value={state.finalCsfKpiMemo} onChange={(value) => setState({ ...state, finalCsfKpiMemo: value })} placeholder="전사전략과제 → 팀 전략과제 → CSF → KPI를 한 문단으로 정리합니다." /></>}</Card></section>;
}

export function V40VNextPerformanceRecordEvidenceLab() {
  const [state, setState] = useStored<State>(V40_VNEXT_PERFORMANCE_CASCADE_STORAGE_KEY, DEFAULT_STATE);
  const strategy = selectedStrategy(state);
  const selectedKpis = flatKpis(strategy, state).filter((kpiItem) => state.selectedKpiIds.includes(kpiItem.id));
  const recordPrompt = useMemo(() => buildRecordPrompt(strategy, state), [strategy, state]);
  const hasKpis = selectedKpis.length > 0;
  return <section className="space-y-4"><Card title="5단계에서 만든 팀 전략과제·CSF·KPI 다시 보기"><p className="rounded-2xl bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">전사전략과제: <b>{strategy?.enterpriseTask || '미선택'}</b><br />팀 전략과제: <b>{state.customTeamTask || '미선택'}</b><br />선택 CSF: <b>{selectedLabels(flatCsfs(strategy, state), state.selectedCsfIds)}</b><br />선택 KPI: <b>{selectedLabels(flatKpis(strategy, state), state.selectedKpiIds)}</b></p><p className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">이제 KPI를 숫자로 바로 보지 않습니다. 가상 CRM 기록에서 확인 가능한 사실, 성과 단서, 부족 정보, 위험한 해석을 먼저 나눠 봅니다.</p></Card><Card title="KPI 확인 항목 고르기">{!hasKpis ? <LockedPanel title="선택한 KPI가 없습니다" body="5단계에서 전사전략과제, 팀 전략과제, CSF, KPI를 먼저 선택해야 고객 활동 기록 확인 항목을 볼 수 있습니다." /> : <div className="grid gap-3 md:grid-cols-2">{selectedKpis.map((kpiItem) => <button key={kpiItem.id} type="button" onClick={() => setState({ ...state, selectedEvidenceIds: toggle(state.selectedEvidenceIds, kpiItem.evidence) })} className={`rounded-2xl border p-4 text-left ${state.selectedEvidenceIds.includes(kpiItem.evidence) ? 'border-sky-400 bg-sky-50' : 'border-slate-200 bg-white'}`}><p className="text-xs font-black text-sky-700">{kpiItem.label}</p><p className="mt-1 font-black text-slate-950">{kpiItem.evidence}</p><p className="mt-2 text-xs font-bold leading-5 text-slate-600">팀장 질문: {kpiItem.question}</p></button>)}</div>}</Card><Card title="가상 CRM 기록 카드 판독"><p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-600">우리 조는 영업팀장입니다. 아래 가상 CRM 기록 카드 4개 중에서 성과 단서가 가장 뚜렷한 기록, 부족 정보가 가장 큰 기록, 위험한 해석이 숨어 있는 기록을 각각 선택하세요.</p><div className="grid gap-3 md:grid-cols-2">{CRM_RECORD_CARDS.map((record) => <RecordCardButton key={record.id} record={record} selected={[state.selectedStrongSignalRecordId, state.selectedMissingInfoRecordId, state.selectedRiskRecordId].includes(record.id)} onClick={() => setState({ ...state, selectedStrongSignalRecordId: record.id })} />)}</div><div className="grid gap-3 md:grid-cols-3"><label className="space-y-1"><span className="text-xs font-black text-slate-500">성과 단서가 가장 뚜렷한 기록</span><select className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold" value={state.selectedStrongSignalRecordId ?? ''} onChange={(event) => setState({ ...state, selectedStrongSignalRecordId: event.target.value })}><option value="">선택하세요</option>{CRM_RECORD_CARDS.map((record) => <option key={record.id} value={record.id}>{record.owner}</option>)}</select></label><label className="space-y-1"><span className="text-xs font-black text-slate-500">부족 정보가 가장 큰 기록</span><select className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold" value={state.selectedMissingInfoRecordId ?? ''} onChange={(event) => setState({ ...state, selectedMissingInfoRecordId: event.target.value })}><option value="">선택하세요</option>{CRM_RECORD_CARDS.map((record) => <option key={record.id} value={record.id}>{record.owner}</option>)}</select></label><label className="space-y-1"><span className="text-xs font-black text-slate-500">위험한 해석이 숨어 있는 기록</span><select className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold" value={state.selectedRiskRecordId ?? ''} onChange={(event) => setState({ ...state, selectedRiskRecordId: event.target.value })}><option value="">선택하세요</option>{CRM_RECORD_CARDS.map((record) => <option key={record.id} value={record.id}>{record.owner}</option>)}</select></label></div></Card><Card title="우리 조 판독 결과 정리"><Field label="확인 가능한 사실" value={state.recordFactMemo} onChange={(value) => setState({ ...state, recordFactMemo: value })} placeholder="예: 자료 전달, 고객 질문, 추가 확인 예정처럼 기록에서 실제로 확인 가능한 사실만 씁니다." /><Field label="아직 부족한 정보" value={state.recordMissingMemo ?? state.missingInfo} onChange={(value) => setState({ ...state, recordMissingMemo: value, missingInfo: value })} placeholder="예: 다음 접점의 목적, 고객 질문의 배경, 후속조치 지연 이유가 부족합니다." /><Field label="과잉해석하면 안 되는 부분" value={state.recordRiskMemo ?? state.overInterpretationRisk} onChange={(value) => setState({ ...state, recordRiskMemo: value, overInterpretationRisk: value })} placeholder="예: 반응 좋음, 고개 끄덕임을 관심이나 전환 가능성으로 단정하지 않습니다." /><Field label="팀원에게 확인할 질문" value={state.recordQuestionMemo ?? state.teamQuestion} onChange={(value) => setState({ ...state, recordQuestionMemo: value, teamQuestion: value })} placeholder="예: 다음 연락 때 고객에게 무엇을 확인하려고 하나요?" /></Card><Card title="AI와 비교하고 7단계로 넘길 실행 신호 정리"><div className="flex flex-wrap gap-2"><Button onClick={() => setState({ ...state, aiRecordPrompt: recordPrompt })}>AI에게 고객 활동 기록 해석 초안 요청</Button><Button onClick={() => copyText(state.aiRecordPrompt || recordPrompt)}>프롬프트 복사</Button></div><Field label="AI 기록 해석 초안 붙여넣기" value={state.aiRecordDraft} onChange={(value) => setState({ ...state, aiRecordDraft: value })} min="min-h-32" /><Field label="AI 해석에서 수정한 위험 표현" value={state.revisedRiskExpression} onChange={(value) => setState({ ...state, revisedRiskExpression: value })} placeholder="예: ‘관심이 높다’ 대신 ‘추가 확인할 질문이 남았다’로 수정합니다." /><Field label="7단계로 넘길 실행 신호" value={state.executionSignalMemo} onChange={(value) => setState({ ...state, executionSignalMemo: value })} placeholder="예: 후속 행동이 있는 기록과 없는 기록의 차이를 먼저 확인하고, 금요일 점검에서 막힌 이유와 지원 필요 사항을 묻는다." /></Card></section>;
}

export function V40VNextPerformanceTwoWeekFlowLab() {
  const [state, setState] = useStored<State>(V40_VNEXT_PERFORMANCE_CASCADE_STORAGE_KEY, DEFAULT_STATE);
  const strategy = selectedStrategy(state);
  const flowPrompt = useMemo(() => buildFlowPrompt(strategy, state), [strategy, state]);
  return <section className="space-y-4"><Card title="팀 전략과제·CSF·KPI별 2주 실행 흐름 정하기"><p className="rounded-2xl bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">전사전략과제: <b>{strategy?.enterpriseTask || '미선택'}</b><br />팀 전략과제: <b>{state.customTeamTask || '미선택'}</b><br />선택 CSF: <b>{selectedLabels(flatCsfs(strategy, state), state.selectedCsfIds)}</b><br />선택 KPI: <b>{selectedLabels(flatKpis(strategy, state), state.selectedKpiIds)}</b><br />6단계 실행 신호: <b>{state.executionSignalMemo || '미작성'}</b></p><div className="grid gap-3 md:grid-cols-2">{FLOW_OPTIONS.map((flow) => <button key={flow.id} type="button" onClick={() => setState({ ...state, selectedFlowIds: toggle(state.selectedFlowIds, flow.id) })} className={`rounded-2xl border p-4 text-left ${state.selectedFlowIds.includes(flow.id) ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white'}`}><p className="font-black text-slate-950">{flow.label}</p></button>)}</div><Field label="이번 2주 동안 먼저 확인할 것" value={state.twoWeekFirstAction} onChange={(value) => setState({ ...state, twoWeekFirstAction: value })} /><Field label="잠시 줄이거나 멈출 활동" value={state.pauseActivity} onChange={(value) => setState({ ...state, pauseActivity: value })} /><Field label="팀원이 남길 기록" value={state.memberRecord} onChange={(value) => setState({ ...state, memberRecord: value })} /><Field label="팀장 중간 점검 질문" value={state.midCheckQuestion} onChange={(value) => setState({ ...state, midCheckQuestion: value })} /><div className="flex flex-wrap gap-2"><Button onClick={() => setState({ ...state, aiFlowPrompt: flowPrompt })}>AI에게 2주 실행 흐름 초안 요청</Button><Button onClick={() => copyText(state.aiFlowPrompt || flowPrompt)}>프롬프트 복사</Button></div><Field label="AI 2주 실행 흐름 초안 붙여넣기" value={state.aiFlowDraft} onChange={(value) => setState({ ...state, aiFlowDraft: value })} min="min-h-32" /></Card><Card title="팀 회의 설명 3문장과 8단계로 넘길 실행 기준"><Field label="팀 회의 설명 1문장" value={state.teamMeetingSentenceOne} onChange={(value) => setState({ ...state, teamMeetingSentenceOne: value })} min="min-h-16" placeholder="이번 2주는 방문 수보다 방문 이후 무엇이 남았는지를 보겠습니다." /><Field label="팀 회의 설명 2문장" value={state.teamMeetingSentenceTwo} onChange={(value) => setState({ ...state, teamMeetingSentenceTwo: value })} min="min-h-16" placeholder="이 기준은 평가가 아니라 다음 행동을 놓치지 않기 위한 기준입니다." /><Field label="팀 회의 설명 3문장" value={state.teamMeetingSentenceThree} onChange={(value) => setState({ ...state, teamMeetingSentenceThree: value })} min="min-h-16" placeholder="다음 점검 때는 고객 질문, 후속 행동, 막힌 이유를 함께 확인하겠습니다." /><Field label="8단계 업무관리로 넘길 실행 기준" value={state.finalExecutionStandard} onChange={(value) => setState({ ...state, finalExecutionStandard: value })} placeholder="예: 후속 행동이 없는 CRM 기록을 먼저 확인하고, 금요일 점검에서 막힌 이유와 지원 필요 사항을 공유한다." /></Card></section>;
}
