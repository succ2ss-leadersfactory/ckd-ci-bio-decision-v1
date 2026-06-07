import { useMemo } from 'react';
import { useStored } from './journey-storage';

export const V40_VNEXT_PERFORMANCE_CASCADE_STORAGE_KEY = 'ckd.v40-vnext.performanceCascade.v1';

const V40_VNEXT_PERFORMANCE_CASCADE_MARKERS = [
  'V40VNextPerformanceStrategyCascadeLab',
  '성과관리 2: 전사전략과제를 팀 과제·CSF·KPI로 분해하기',
  '성과관리 3: CSF/KPI를 고객 활동 기록 확인 항목으로 바꾸기',
  '성과관리 4: 팀 과제·CSF·KPI별 2주 실행 흐름 정하기',
  '종근당 연계 전사전략과제',
  '전사전략과제 → 팀 과제 → CSF → KPI → 고객 활동 기록 → 2주 실행',
  'ckd.v40-vnext.performanceCascade.v1',
  '팀 회의 설명 3문장',
  'AI에게 CSF/KPI 후보 확장 요청',
  'AI에게 고객 활동 기록 해석 초안 요청',
  'AI에게 2주 실행 흐름 초안 요청',
].join('|');
void V40_VNEXT_PERFORMANCE_CASCADE_MARKERS;

type KpiType = '활동' | '전환' | '품질' | '리스크';
type StrategyCard = {
  id: string;
  enterpriseTask: string;
  hqTask: string;
  teamTaskExample: string;
  sourceHint: string;
  csfs: { id: string; label: string; meaning: string; kpis: { id: string; label: string; type: KpiType; evidence: string; question: string; caution: string }[] }[];
};

type State = {
  selectedStrategyId: string;
  customTeamTask: string;
  selectedCsfIds: string[];
  selectedKpiIds: string[];
  cascadeInterpretation: string;
  cascadeComplianceCaution: string;
  aiCascadePrompt: string;
  aiCascadeDraft: string;
  finalCsfKpiMemo: string;
  selectedEvidenceIds: string[];
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

const STRATEGY_CARDS: StrategyCard[] = [
  {
    id: 'customer-execution',
    enterpriseTask: '고객 중심 실행력 강화',
    hqTask: '고객 반응 기반 후속 실행률 제고',
    teamTaskExample: '고객 질문과 후속 행동이 CRM에 남고, 다음 접점으로 이어지게 한다.',
    sourceHint: '종근당 가치의 “인류 건강”과 대표 제약회사 지향을 영업 실행 언어로 변환한 교육용 과제입니다.',
    csfs: [
      { id: 'customer-response-recorded', label: '고객 반응이 구체적으로 기록되어야 한다', meaning: '단순 방문 메모가 아니라 고객 질문·반응·요청이 남아야 합니다.', kpis: [
        { id: 'customer-question-record-rate', label: '고객 질문 기록률', type: '품질', evidence: '고객 질문 내용, 질문 배경, 후속 확인 필요 항목', question: '고객 질문이 단순 확인이었나요, 다음 논의로 이어질 질문이었나요?', caution: '고객 질문을 처방 가능성이나 제품 선호로 단정하지 않습니다.' },
        { id: 'crm-response-quality', label: '고객 반응 기록 충실도', type: '품질', evidence: '고객 반응, 피드백, 제약요인, 다음 행동 포함 여부', question: '기록을 보고 다음 행동을 정할 수 있을 만큼 충분한가요?', caution: '고객 감정이나 의도를 확인 없이 해석하지 않습니다.' },
      ] },
      { id: 'follow-up-executed', label: '후속 행동이 일정 안에 실행되어야 한다', meaning: '고객 질문·자료 요청·다음 약속이 방치되지 않아야 합니다.', kpis: [
        { id: 'follow-up-completion-rate', label: '후속조치 완료율', type: '전환', evidence: '자료 전달 후 확인, 다음 일정, 미해결 요청 처리 기록', question: '후속조치가 늦어진 이유는 고객 제약인가요, 우리 실행 제약인가요?', caution: '후속조치를 고객 압박이나 처방 유도처럼 표현하지 않습니다.' },
        { id: 'next-contact-secured', label: '다음 접점 확보 건수', type: '전환', evidence: '다음 접점 목적, 일정, 준비 자료, 고객 확인 질문', question: '다음 접점은 실제 일정인가요, 가능성 언급인가요?', caution: '다음 접점 확보를 과도한 설득으로 운영하지 않습니다.' },
      ] },
    ],
  },
  {
    id: 'crm-execution',
    enterpriseTask: '디지털 기반 영업 고도화',
    hqTask: 'CRM 기록 기반 실행관리 강화',
    teamTaskExample: 'CRM 기록을 단순 입력이 아니라 다음 행동과 팀장 점검으로 연결한다.',
    sourceHint: '종근당 경영전략의 정보 인프라 구축 키워드를 영업팀 실행관리 언어로 변환한 교육용 과제입니다.',
    csfs: [
      { id: 'crm-next-action', label: 'CRM 기록에 다음 행동이 포함되어야 한다', meaning: '방문 사실보다 다음 행동, 확인 질문, 팀장 지원 필요가 남아야 합니다.', kpis: [
        { id: 'crm-next-action-rate', label: '후속 행동 포함 CRM 기록률', type: '품질', evidence: '다음 행동, 담당자, 시점, 고객 질문, 준비 자료', question: '기록에 다음 행동이 없으면 무엇을 더 확인해야 하나요?', caution: 'CRM 입력률 자체를 성과로 단정하지 않습니다.' },
        { id: 'record-timeliness', label: 'CRM 기록 적시성', type: '활동', evidence: '방문 후 기록 시점, 누락 기록, 지연 사유', question: '기록 지연이 일정 문제인지 기록 기준 문제인지 확인했나요?', caution: '기록 지연을 즉시 태도 문제로 해석하지 않습니다.' },
      ] },
      { id: 'manager-can-coach', label: '팀장이 기록을 보고 막힌 지점을 확인할 수 있어야 한다', meaning: '기록이 팀장 코칭과 지원으로 이어져야 합니다.', kpis: [
        { id: 'execution-bottleneck-count', label: '실행 제약 확인 건수', type: '리스크', evidence: '일정 변경, 고객 접근 제약, 내부 지원 요청, 자료 확인 필요', question: '막힌 지점은 팀원이 혼자 해결할 일인가요, 팀장이 연결할 일인가요?', caution: '실행 부진을 고객 탓이나 팀원 탓으로 단정하지 않습니다.' },
        { id: 'manager-check-question-count', label: '팀장 확인 질문 작성 건수', type: '품질', evidence: '중간 점검 질문, 후속 확인 질문, 기록 샘플 점검 메모', question: '팀장이 이번 주에 실제로 물어볼 질문은 무엇인가요?', caution: '질문이 추궁처럼 들리지 않게 관찰 중심으로 표현합니다.' },
      ] },
    ],
  },
  {
    id: 'message-compliance',
    enterpriseTask: '지속가능한 성장 기반 강화',
    hqTask: '승인자료 기반 메시지 일관성 강화',
    teamTaskExample: '팀원별 메시지 편차를 줄이고, 고객 질문에 승인자료 범위 안에서 일관되게 대응한다.',
    sourceHint: '책임경영·신약/바이오·브랜드 가치를 현장 커뮤니케이션 안전선으로 변환한 교육용 과제입니다.',
    csfs: [
      { id: 'approved-material', label: '승인자료 범위 안에서 메시지를 전달해야 한다', meaning: '허가 외 사용 암시와 과장 표현을 막아야 합니다.', kpis: [
        { id: 'approved-material-check-rate', label: '승인자료 사용 확인률', type: '리스크', evidence: '사용 자료, 전달 메시지, 고객 질문 범위, 자료 확인 메모', question: '사용한 자료와 답변 범위가 승인자료 안에 있나요?', caution: '승인 범위 밖 내용을 확장하지 않습니다.' },
        { id: 'risk-expression-correction-count', label: '위험 표현 수정 건수', type: '리스크', evidence: '비교 우위 단정, 처방 유도, 허가 외 사용 암시 수정 기록', question: '고객에게 부담이나 오해를 줄 수 있는 표현은 무엇인가요?', caution: '경쟁사 비방, 비교 우위 단정, 처방 유도 표현을 쓰지 않습니다.' },
      ] },
      { id: 'question-boundary', label: '고객 질문의 답변 가능 범위가 정리되어야 한다', meaning: '현장에서 즉흥적으로 답하지 않고 확인 후 대응해야 합니다.', kpis: [
        { id: 'customer-question-boundary-check', label: '고객 질문 대응 범위 확인 건수', type: '품질', evidence: '고객 질문, 답변 가능 범위, 추가 확인 필요 여부', question: '이 질문은 바로 답할 수 있나요, 확인 후 답해야 하나요?', caution: '확인되지 않은 답변을 현장에서 확정적으로 말하지 않습니다.' },
        { id: 'cp-escalation-needed', label: 'CP 확인 필요 건수', type: '리스크', evidence: '확인 필요 질문, 관련 부서 확인 요청, 보류 답변 기록', question: '이 사안은 팀장 또는 관련 부서 확인이 필요한가요?', caution: '확인 필요를 실행 지연이 아니라 안전관리로 설명합니다.' },
      ] },
    ],
  },
  {
    id: 'global-network',
    enterpriseTask: '글로벌 네트워크 기반 성장',
    hqTask: '방문 외 대체 접점 활용 고도화',
    teamTaskExample: '대면 방문이 어려운 상황에서도 비대면 접점과 자료 요청 후속 확인을 실행 흐름으로 만든다.',
    sourceHint: '종근당 경영전략의 글로벌 네트워크와 정보 인프라 키워드를 영업 접점 다변화로 변환한 교육용 과제입니다.',
    csfs: [
      { id: 'alternative-contact-works', label: '방문 외 접점 이후 실제 반응이 확인되어야 한다', meaning: '자료 전달 자체가 아니라 확인·질문·다음 논의가 남아야 합니다.', kpis: [
        { id: 'non-face-follow-up-rate', label: '비대면 접점 후속 확인률', type: '전환', evidence: '전화·메시지 후속 확인, 자료 확인 여부, 고객 질문', question: '자료 전달 후 실제 확인이나 질문이 있었나요?', caution: '자료 전달 자체를 고객 이해나 성과로 단정하지 않습니다.' },
        { id: 'material-request-response-rate', label: '자료 요청 대응률', type: '전환', evidence: '자료 요청 내용, 승인자료 여부, 대응 시점, 후속 확인', question: '고객 요청에 승인자료 범위 안에서 대응했나요?', caution: '자료 요청을 제품 선호나 처방 의향으로 해석하지 않습니다.' },
      ] },
      { id: 'contact-gap-recovered', label: '접점 공백을 안전하게 회복해야 한다', meaning: '미접촉 고객을 무리하게 확대하지 않고 접근 경로와 목적을 분명히 해야 합니다.', kpis: [
        { id: 'untouched-customer-check-rate', label: '미접촉 고객 확인률', type: '활동', evidence: '미접촉 기간, 접근 경로, 접점 공백 사유', question: '미접촉은 고객 제약 때문인가요, 우리 실행 루틴 때문인가요?', caution: '미접촉 고객을 무리하게 압박하지 않습니다.' },
        { id: 'new-contact-record-rate', label: '신규 접점 기록률', type: '품질', evidence: '접근 경로, 접점 목적, 고객 반응, 다음 행동', question: '신규 접점의 목적과 다음 확인 사항이 기록되어 있나요?', caution: '신규 접촉 수 증가만으로 성과를 단정하지 않습니다.' },
      ] },
    ],
  },
];

const DEFAULT_STATE: State = {
  selectedStrategyId: STRATEGY_CARDS[0].id,
  customTeamTask: '',
  selectedCsfIds: [],
  selectedKpiIds: [],
  cascadeInterpretation: '',
  cascadeComplianceCaution: '',
  aiCascadePrompt: '',
  aiCascadeDraft: '',
  finalCsfKpiMemo: '',
  selectedEvidenceIds: [],
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

function selectedStrategy(state: State) {
  return STRATEGY_CARDS.find((strategy) => strategy.id === state.selectedStrategyId) ?? STRATEGY_CARDS[0];
}

function flatCsfs(strategy: StrategyCard) {
  return strategy.csfs;
}

function flatKpis(strategy: StrategyCard) {
  return strategy.csfs.flatMap((csf) => csf.kpis.map((kpi) => ({ ...kpi, csfId: csf.id, csfLabel: csf.label })));
}

function toggle(list: string[], id: string, max?: number) {
  if (list.includes(id)) return list.filter((item) => item !== id);
  const next = [...list, id];
  return max ? next.slice(-max) : next;
}

function selectedLabels(items: { id: string; label: string }[], ids: string[]) {
  const labels = items.filter((item) => ids.includes(item.id)).map((item) => item.label);
  return labels.length ? labels.join(' · ') : '미선택';
}

function Button({ children, onClick }: { children: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm hover:bg-slate-800">{children}</button>;
}

function Field({ label, value, onChange, placeholder, min = 'min-h-24' }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; min?: string }) {
  return <label className="block space-y-1"><span className="text-xs font-black text-slate-500">{label}</span><textarea className={`${min} w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm leading-6`} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"><h3 className="text-lg font-black text-slate-950">{title}</h3><div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">{children}</div></section>;
}

function buildCascadePrompt(strategy: StrategyCard, state: State) {
  return [
    '당신은 제약영업 팀장의 성과관리 코치입니다.',
    '',
    '아래 전사전략과제를 우리 팀 과제, CSF, KPI로 분해해 주세요.',
    '',
    `전사전략과제: ${strategy.enterpriseTask}`,
    `본부/사업부 전략과제: ${strategy.hqTask}`,
    `우리 팀 상황: ${state.customTeamTask || strategy.teamTaskExample}`,
    '',
    '요청:',
    '1. 전사전략과제의 핵심 의도를 한 문장으로 해석해 주세요.',
    '2. 본부/사업부 전략과제가 영업팀에 요구하는 실행 방향을 정리해 주세요.',
    '3. 이를 우리 팀 과제 2~3개로 바꿔 주세요.',
    '4. 각 팀 과제별 CSF를 2개씩 제안해 주세요.',
    '5. 각 CSF별 KPI 후보를 2개씩 제안해 주세요.',
    '6. KPI를 활동, 전환, 품질, 리스크 지표로 분류해 주세요.',
    '7. 고객 활동 기록에서 확인할 증거를 적어 주세요.',
    '8. 컴플라이언스상 조심해야 할 표현을 적어 주세요.',
    '',
    '주의: 실제 고객명, 병원명, 의료진명, 제품명, 매출자료, 처방 정보는 쓰지 마세요. 처방 유도, 허가 외 사용 암시, 경쟁사 비방, 비교 우위 단정 표현은 제외해 주세요.',
  ].join('\n');
}

function buildRecordPrompt(strategy: StrategyCard, state: State) {
  const csfs = flatCsfs(strategy);
  const kpis = flatKpis(strategy);
  return [
    '아래 팀 과제, CSF, KPI를 고객 활동 기록에서 확인 가능한 단서로 바꿔 주세요.',
    '',
    `팀 과제: ${state.customTeamTask || strategy.teamTaskExample}`,
    `선택 CSF: ${selectedLabels(csfs, state.selectedCsfIds)}`,
    `선택 KPI: ${selectedLabels(kpis, state.selectedKpiIds)}`,
    '',
    '고객 활동 기록 예시: [실제 고객명·기관명·제품명·수치를 제거한 가상 기록을 붙여넣으세요]',
    '',
    '요청: 기록에서 확인된 단서, 아직 부족한 정보, 과잉해석하면 안 되는 부분, 팀원에게 확인할 질문, 승인자료·표현 안전선에서 조심할 점을 구분해 주세요.',
    '주의: 고객을 평가하거나 등급화하지 말고, 고객 반응을 처방 가능성으로 단정하지 마세요.',
  ].join('\n');
}

function buildFlowPrompt(strategy: StrategyCard, state: State) {
  const csfs = flatCsfs(strategy);
  const kpis = flatKpis(strategy);
  return [
    '선택한 팀 과제, CSF, KPI, 고객 기록 단서를 바탕으로 이번 2주 실행 흐름을 만들어 주세요.',
    '',
    `전사전략과제: ${strategy.enterpriseTask}`,
    `팀 과제: ${state.customTeamTask || strategy.teamTaskExample}`,
    `선택 CSF: ${selectedLabels(csfs, state.selectedCsfIds)}`,
    `선택 KPI: ${selectedLabels(kpis, state.selectedKpiIds)}`,
    `확인된 단서: ${state.selectedEvidenceIds.join(' · ') || '아직 선택 전'}`,
    `아직 부족한 정보: ${state.missingInfo || '아직 작성 전'}`,
    `팀원에게 확인할 질문: ${state.teamQuestion || '아직 작성 전'}`,
    '',
    '요청: 이번 2주 동안 먼저 확인할 것, 팀원이 남겨야 할 기록, 팀장이 중간 점검할 질문, 잠시 줄이거나 멈출 활동, 컴플라이언스 주의 표현, 팀 회의에서 설명할 3문장을 작성해 주세요.',
    '주의: 고객 압박, 처방 유도, 허가 외 사용 암시, 경쟁사 비방, 비교 우위 단정 표현은 제외해 주세요.',
  ].join('\n');
}

function copyText(text: string) {
  void navigator.clipboard?.writeText(text);
}

export function V40VNextPerformanceStrategyCascadeLab() {
  const [state, setState] = useStored<State>(V40_VNEXT_PERFORMANCE_CASCADE_STORAGE_KEY, DEFAULT_STATE);
  const strategy = selectedStrategy(state);
  const csfs = flatCsfs(strategy);
  const kpis = flatKpis(strategy);
  const cascadePrompt = useMemo(() => buildCascadePrompt(strategy, state), [strategy, state]);

  return (
    <section className="space-y-4">
      <Card title="종근당 연계 전사전략과제 선택">
        <p className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">공개자료에서 확인되는 종근당 전략 키워드인 신약 개발, 글로벌 네트워크, 정보 인프라, 브랜드/블록버스터, 책임경영을 교육용 전사전략과제로 가공했습니다. 실제 제품명·고객명·내부 수치는 사용하지 않습니다.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {STRATEGY_CARDS.map((item) => (
            <button key={item.id} type="button" onClick={() => setState({ ...state, selectedStrategyId: item.id, selectedCsfIds: [], selectedKpiIds: [] })} className={`rounded-2xl border p-4 text-left transition ${state.selectedStrategyId === item.id ? 'border-slate-900 bg-slate-950 text-white' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400'}`}>
              <p className="text-xs font-black opacity-70">전사전략과제</p>
              <p className="mt-1 text-base font-black">{item.enterpriseTask}</p>
              <p className="mt-2 text-xs font-bold leading-5 opacity-80">본부 과제: {item.hqTask}</p>
              <p className="mt-2 text-xs leading-5 opacity-70">{item.sourceHint}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card title="전사전략과제를 우리 팀 과제로 바꾸기">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700"><p className="font-black text-slate-950">기본 팀 과제 예시</p><p className="mt-1">{strategy.teamTaskExample}</p></div>
        <Field label="우리 조가 수정한 팀 과제" value={state.customTeamTask} onChange={(value) => setState({ ...state, customTeamTask: value })} placeholder="예: CRM 기록에서 고객 질문과 다음 행동이 빠진 건을 확인하고, 2주 안에 후속 실행으로 연결한다." />
        <Field label="전략과제 핵심 의도 해석" value={state.cascadeInterpretation} onChange={(value) => setState({ ...state, cascadeInterpretation: value })} placeholder="예: 방문 수보다 고객 반응 이후 후속 실행과 기록 품질을 높이라는 의미입니다." />
      </Card>

      <Card title="CSF와 KPI 선택">
        <p className="text-xs font-bold text-slate-500">CSF는 최대 2개, KPI는 2~3개를 고릅니다. KPI는 활동·전환·품질·리스크가 섞이도록 선택합니다.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {csfs.map((csf) => (
            <button key={csf.id} type="button" onClick={() => setState({ ...state, selectedCsfIds: toggle(state.selectedCsfIds, csf.id, 2) })} className={`rounded-2xl border p-4 text-left ${state.selectedCsfIds.includes(csf.id) ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
              <p className="font-black text-slate-950">{csf.label}</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-600">{csf.meaning}</p>
            </button>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {kpis.map((kpi) => (
            <button key={kpi.id} type="button" onClick={() => setState({ ...state, selectedKpiIds: toggle(state.selectedKpiIds, kpi.id, 3) })} className={`rounded-2xl border p-4 text-left ${state.selectedKpiIds.includes(kpi.id) ? 'border-violet-400 bg-violet-50' : 'border-slate-200 bg-white'}`}>
              <p className="text-xs font-black text-violet-700">{kpi.type} KPI · {kpi.csfLabel}</p>
              <p className="mt-1 font-black text-slate-950">{kpi.label}</p>
              <p className="mt-2 text-xs font-bold leading-5 text-slate-600">증거: {kpi.evidence}</p>
              <p className="mt-1 text-xs font-bold leading-5 text-amber-700">주의: {kpi.caution}</p>
            </button>
          ))}
        </div>
        <Field label="KPI 선택 이유와 컴플라이언스 주의점" value={state.cascadeComplianceCaution} onChange={(value) => setState({ ...state, cascadeComplianceCaution: value })} placeholder="예: 후속 실행을 보기 위한 KPI이지만 고객 반응을 처방 가능성으로 단정하지 않습니다." />
        <div className="flex flex-wrap gap-2"><Button onClick={() => setState({ ...state, aiCascadePrompt: cascadePrompt })}>AI에게 CSF/KPI 후보 확장 요청</Button><Button onClick={() => copyText(state.aiCascadePrompt || cascadePrompt)}>프롬프트 복사</Button></div>
        <Field label="AI CSF/KPI 초안 붙여넣기" value={state.aiCascadeDraft} onChange={(value) => setState({ ...state, aiCascadeDraft: value })} min="min-h-32" />
        <Field label="우리 조 최종 CSF/KPI 메모" value={state.finalCsfKpiMemo} onChange={(value) => setState({ ...state, finalCsfKpiMemo: value })} placeholder="전사전략과제 → 팀 과제 → CSF → KPI를 한 문단으로 정리합니다." />
      </Card>
    </section>
  );
}

export function V40VNextPerformanceRecordEvidenceLab() {
  const [state, setState] = useStored<State>(V40_VNEXT_PERFORMANCE_CASCADE_STORAGE_KEY, DEFAULT_STATE);
  const strategy = selectedStrategy(state);
  const kpis = flatKpis(strategy).filter((kpi) => state.selectedKpiIds.includes(kpi.id));
  const recordPrompt = useMemo(() => buildRecordPrompt(strategy, state), [strategy, state]);

  return (
    <section className="space-y-4">
      <Card title="5단계에서 만든 팀 과제·CSF·KPI 다시 보기">
        <p className="rounded-2xl bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">전사전략과제: <b>{strategy.enterpriseTask}</b><br />팀 과제: <b>{state.customTeamTask || strategy.teamTaskExample}</b><br />선택 KPI: <b>{selectedLabels(flatKpis(strategy), state.selectedKpiIds)}</b></p>
      </Card>
      <Card title="KPI를 고객 활동 기록 확인 항목으로 바꾸기">
        <div className="grid gap-3 md:grid-cols-2">
          {(kpis.length ? kpis : flatKpis(strategy).slice(0, 4)).map((kpi) => (
            <button key={kpi.id} type="button" onClick={() => setState({ ...state, selectedEvidenceIds: toggle(state.selectedEvidenceIds, kpi.evidence) })} className={`rounded-2xl border p-4 text-left ${state.selectedEvidenceIds.includes(kpi.evidence) ? 'border-sky-400 bg-sky-50' : 'border-slate-200 bg-white'}`}>
              <p className="text-xs font-black text-sky-700">{kpi.label}</p>
              <p className="mt-1 font-black text-slate-950">{kpi.evidence}</p>
              <p className="mt-2 text-xs font-bold leading-5 text-slate-600">팀장 질문: {kpi.question}</p>
            </button>
          ))}
        </div>
        <Field label="아직 부족한 정보" value={state.missingInfo} onChange={(value) => setState({ ...state, missingInfo: value })} placeholder="예: 다음 접점의 목적, 고객 질문의 배경, 후속조치 지연 이유가 부족합니다." />
        <Field label="과잉해석하면 안 되는 부분" value={state.overInterpretationRisk} onChange={(value) => setState({ ...state, overInterpretationRisk: value })} placeholder="예: 자료 요청을 처방 가능성이나 제품 선호로 단정하지 않습니다." />
        <Field label="팀원에게 확인할 질문" value={state.teamQuestion} onChange={(value) => setState({ ...state, teamQuestion: value })} placeholder="예: 이 후속조치가 늦어진 이유는 고객 일정 때문인가요, 우리 준비가 부족했기 때문인가요?" />
        <div className="flex flex-wrap gap-2"><Button onClick={() => setState({ ...state, aiRecordPrompt: recordPrompt })}>AI에게 고객 활동 기록 해석 초안 요청</Button><Button onClick={() => copyText(state.aiRecordPrompt || recordPrompt)}>프롬프트 복사</Button></div>
        <Field label="AI 기록 해석 초안 붙여넣기" value={state.aiRecordDraft} onChange={(value) => setState({ ...state, aiRecordDraft: value })} min="min-h-32" />
        <Field label="AI 해석에서 수정한 위험 표현" value={state.revisedRiskExpression} onChange={(value) => setState({ ...state, revisedRiskExpression: value })} placeholder="예: ‘관심이 높다’ 대신 ‘추가 확인할 질문이 남았다’로 수정합니다." />
      </Card>
    </section>
  );
}

export function V40VNextPerformanceTwoWeekFlowLab() {
  const [state, setState] = useStored<State>(V40_VNEXT_PERFORMANCE_CASCADE_STORAGE_KEY, DEFAULT_STATE);
  const strategy = selectedStrategy(state);
  const flowPrompt = useMemo(() => buildFlowPrompt(strategy, state), [strategy, state]);

  return (
    <section className="space-y-4">
      <Card title="팀 과제·CSF·KPI별 2주 실행 흐름 정하기">
        <p className="rounded-2xl bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">팀 과제: <b>{state.customTeamTask || strategy.teamTaskExample}</b><br />선택 CSF: <b>{selectedLabels(flatCsfs(strategy), state.selectedCsfIds)}</b><br />선택 KPI: <b>{selectedLabels(flatKpis(strategy), state.selectedKpiIds)}</b></p>
        <div className="grid gap-3 md:grid-cols-2">
          {FLOW_OPTIONS.map((flow) => (
            <button key={flow.id} type="button" onClick={() => setState({ ...state, selectedFlowIds: toggle(state.selectedFlowIds, flow.id) })} className={`rounded-2xl border p-4 text-left ${state.selectedFlowIds.includes(flow.id) ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
              <p className="font-black text-slate-950">{flow.label}</p>
            </button>
          ))}
        </div>
        <Field label="이번 2주 동안 먼저 확인할 것" value={state.twoWeekFirstAction} onChange={(value) => setState({ ...state, twoWeekFirstAction: value })} />
        <Field label="잠시 줄이거나 멈출 활동" value={state.pauseActivity} onChange={(value) => setState({ ...state, pauseActivity: value })} />
        <Field label="팀원이 남길 기록" value={state.memberRecord} onChange={(value) => setState({ ...state, memberRecord: value })} />
        <Field label="팀장 중간 점검 질문" value={state.midCheckQuestion} onChange={(value) => setState({ ...state, midCheckQuestion: value })} />
        <div className="flex flex-wrap gap-2"><Button onClick={() => setState({ ...state, aiFlowPrompt: flowPrompt })}>AI에게 2주 실행 흐름 초안 요청</Button><Button onClick={() => copyText(state.aiFlowPrompt || flowPrompt)}>프롬프트 복사</Button></div>
        <Field label="AI 2주 실행 흐름 초안 붙여넣기" value={state.aiFlowDraft} onChange={(value) => setState({ ...state, aiFlowDraft: value })} min="min-h-32" />
      </Card>
      <Card title="팀 회의 설명 3문장과 8단계로 넘길 실행 기준">
        <Field label="팀 회의 설명 1문장" value={state.teamMeetingSentenceOne} onChange={(value) => setState({ ...state, teamMeetingSentenceOne: value })} min="min-h-16" placeholder="이번 2주는 방문 수보다 방문 이후 무엇이 남았는지를 보겠습니다." />
        <Field label="팀 회의 설명 2문장" value={state.teamMeetingSentenceTwo} onChange={(value) => setState({ ...state, teamMeetingSentenceTwo: value })} min="min-h-16" placeholder="이 기준은 평가가 아니라 다음 행동을 놓치지 않기 위한 기준입니다." />
        <Field label="팀 회의 설명 3문장" value={state.teamMeetingSentenceThree} onChange={(value) => setState({ ...state, teamMeetingSentenceThree: value })} min="min-h-16" placeholder="다음 점검 때는 고객 질문, 후속 행동, 막힌 이유를 함께 확인하겠습니다." />
        <Field label="8단계 업무관리로 넘길 실행 기준" value={state.finalExecutionStandard} onChange={(value) => setState({ ...state, finalExecutionStandard: value })} placeholder="예: 후속 행동이 없는 CRM 기록을 먼저 확인하고, 금요일 점검에서 막힌 이유와 지원 필요 사항을 공유한다." />
      </Card>
    </section>
  );
}
