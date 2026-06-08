import { useMemo } from 'react';
import { useStored } from './journey-storage';
import { V40_VNEXT_PERFORMANCE_CASCADE_STORAGE_KEY } from './journey-v40-vnext-performance-strategy-cascade-lab';

type Csf = { id: string; label: string; guide: string; kpis: Kpi[] };
type Kpi = { id: string; label: string; type: string; evidence: string; question: string; caution: string };
type TeamTask = { id: string; label: string; guide: string; csfs: Csf[] };
type Strategy = { id: string; label: string; hint: string; teamTasks: TeamTask[] };

type State = Record<string, any> & {
  selectedStrategyId?: string;
  selectedTeamTaskId?: string;
  customTeamTask?: string;
  selectedCsfIds?: string[];
  selectedKpiIds?: string[];
  cascadeInterpretation?: string;
  cascadeComplianceCaution?: string;
  aiCascadePrompt?: string;
  aiCascadeDraft?: string;
  aiSuggestedCsfs?: string;
  aiSuggestedKpis?: string;
  aiSuggestedCheckQuestions?: string;
  aiRiskExpressions?: string;
  adoptedExpression?: string;
  finalCsfKpiMemo?: string;
  twoWeekFirstAction?: string;
  pauseActivity?: string;
  midCheckQuestion?: string;
  finalExecutionStandard?: string;
};

const V40_VNEXT_ENHANCED_CASCADE_MARKERS = [
  'V40VNextPerformanceEnhancedCascadeLab',
  'AI에게 보낼 프롬프트',
  'AI가 제안한 CSF/KPI 후보 붙여넣기',
  'AI 답변 항목별로 정리하기',
  'AI가 제안한 CSF 후보',
  'AI가 제안한 KPI 후보',
  'AI가 제안한 확인 질문',
  'AI 답변에서 주의할 표현',
  'AI 정리 결과를 2주 기준 초안에 반영하기',
  '2주 성과관리 기준 초안 만들기',
  'ckd.v40-vnext.performanceCascade.v1',
].join('|');
void V40_VNEXT_ENHANCED_CASCADE_MARKERS;

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
  aiSuggestedCsfs: '',
  aiSuggestedKpis: '',
  aiSuggestedCheckQuestions: '',
  aiRiskExpressions: '',
  adoptedExpression: '',
  finalCsfKpiMemo: '',
  twoWeekFirstAction: '',
  pauseActivity: '',
  midCheckQuestion: '',
  finalExecutionStandard: '',
};

function kpi(id: string, label: string, type: string, evidence: string, question: string, caution: string): Kpi {
  return { id, label, type, evidence, question, caution };
}

function csf(id: string, label: string, guide: string, kpis: Kpi[]): Csf {
  return { id, label, guide, kpis };
}

function teamTask(id: string, label: string, guide: string, csfs: Csf[]): TeamTask {
  return { id, label, guide, csfs };
}

const commonKpis = {
  followup: (prefix: string) => [
    kpi(`${prefix}-followup`, '후속 행동 포함 기록률', '품질', '고객 질문, 다음 행동, 담당자, 시점이 기록에 남았는지', '다음 행동이 없으면 무엇을 더 확인해야 하나요?', '후속 확인을 고객 압박이나 처방 유도처럼 표현하지 않습니다.'),
    kpi(`${prefix}-delay`, '후속 지연 사유 확인률', '리스크', '지연 사유, 고객 제약, 내부 준비, 팀장 지원 필요가 드러나는지', '지연 이유가 고객 제약인지 우리 실행 제약인지 보이나요?', '지연을 팀원 태도 문제로 단정하지 않습니다.'),
  ],
  record: (prefix: string) => [
    kpi(`${prefix}-question`, '고객 질문 기록률', '품질', '고객 질문 내용, 배경, 추가 확인 필요 항목이 남았는지', '고객 질문이 다음 논의로 이어질 질문인가요?', '고객 질문을 처방 가능성이나 제품 선호로 단정하지 않습니다.'),
    kpi(`${prefix}-quality`, '고객 반응 기록 충실도', '품질', '고객 반응, 제약요인, 다음 행동 포함 여부가 보이는지', '기록을 보고 다음 행동을 정할 수 있나요?', '고객 감정이나 의도를 확인 없이 해석하지 않습니다.'),
  ],
  safety: (prefix: string) => [
    kpi(`${prefix}-approved`, '승인자료 사용 확인률', '리스크', '사용 자료, 답변 범위, 확인 필요 질문이 기록되었는지', '사용한 자료와 답변 범위가 승인자료 안에 있나요?', '승인 범위 밖 내용을 확장하지 않습니다.'),
    kpi(`${prefix}-risk`, '위험 표현 점검률', '리스크', '비교 우위 단정, 처방 유도, 허가 외 사용 암시를 수정했는지', '고객에게 오해를 줄 수 있는 표현은 무엇인가요?', '처방 유도, 경쟁사 비방, 비교 우위 단정 표현을 쓰지 않습니다.'),
  ],
  contact: (prefix: string) => [
    kpi(`${prefix}-contact`, '대체 접점 반응 기록률', '활동', '전화·메시지·자료 전달 후 고객 질문이나 확인 요청이 남았는지', '자료 전달 후 실제 확인이나 질문이 있었나요?', '자료 전달 자체를 고객 이해나 성과로 단정하지 않습니다.'),
    kpi(`${prefix}-gap`, '접점 공백 사유 기록률', '리스크', '미접촉 기간, 접근 경로, 접점 공백 사유가 보이는지', '접점 공백의 이유가 기록에 남아 있나요?', '공백을 팀원 노력 부족으로 단정하지 않습니다.'),
  ],
};

const STRATEGIES: Strategy[] = [
  {
    id: 'customer-value-growth',
    label: '고객가치 기반 성장 강화',
    hint: '고객 접점 이후 반응, 질문, 다음 행동이 실제 실행으로 이어지도록 만드는 방향입니다.',
    teamTasks: [
      teamTask('customer-contact-conversion', '고객 접점 이후 실행 전환율 강화', '방문과 접촉 이후 후속 행동으로 이어지는 흐름을 강화합니다.', [csf('customer-contact-conversion-followup', '후속 행동이 일정 안에 실행되어야 한다', '고객 반응 이후 실제 실행으로 이어지는지를 봅니다.', commonKpis.followup('customer-contact-conversion')), csf('customer-contact-conversion-record', '고객 질문과 반응이 구체적으로 기록되어야 한다', '후속 실행을 만들 수 있을 만큼 기록이 구체적인지 봅니다.', commonKpis.record('customer-contact-conversion'))]),
      teamTask('customer-question-followup', '고객 질문 기반 후속 실행 체계화', '고객 질문을 단순 기록이 아니라 다음 행동으로 연결합니다.', [csf('customer-question-followup-record', '고객 질문이 다음 행동의 근거로 남아야 한다', '질문과 반응이 다음 행동의 근거가 되는지 봅니다.', commonKpis.record('customer-question-followup')), csf('customer-question-followup-followup', '확인 질문과 후속 행동이 연결되어야 한다', '확인 질문이 실제 후속 행동으로 이어지는지 봅니다.', commonKpis.followup('customer-question-followup'))]),
    ],
  },
  {
    id: 'digital-execution-management',
    label: '디지털 기반 실행관리 고도화',
    hint: 'CRM과 기록을 실행관리, 팀장 점검, 지원 행동으로 연결하는 방향입니다.',
    teamTasks: [
      teamTask('crm-execution-system', 'CRM 기반 영업 실행관리 체계 강화', 'CRM 입력이 실제 후속 실행으로 이어지도록 합니다.', [csf('crm-execution-system-record', 'CRM 기록에 다음 행동이 포함되어야 한다', '기록이 실행의 출발점이 되는지 봅니다.', commonKpis.followup('crm-execution-system')), csf('crm-execution-system-blocker', '실행을 막는 제약이 확인되어야 한다', '막힌 이유와 팀장 지원 필요를 함께 확인합니다.', commonKpis.record('crm-execution-system'))]),
      teamTask('crm-quality-advance', 'CRM 기록 품질 고도화', '기록 품질을 높여 팀장이 지원할 지점을 확인합니다.', [csf('crm-quality-advance-record', '고객 반응 기록 품질이 높아져야 한다', '다음 행동을 정할 수 있을 만큼 기록이 충분한지 봅니다.', commonKpis.record('crm-quality-advance')), csf('crm-quality-advance-question', '사실과 해석이 분리되어야 한다', '고객 반응과 팀원의 해석을 분리합니다.', commonKpis.safety('crm-quality-advance'))]),
    ],
  },
  {
    id: 'sustainable-growth',
    label: '지속가능한 성장 기반 강화',
    hint: '고객 커뮤니케이션의 일관성, 승인자료 범위, 표현 안전선을 함께 관리하는 방향입니다.',
    teamTasks: [
      teamTask('approved-communication', '승인자료 기반 고객 커뮤니케이션 일관성 강화', '고객 커뮤니케이션의 안전성과 일관성을 높입니다.', [csf('approved-communication-safety', '승인자료 범위 안에서 메시지를 전달해야 한다', '성과 실행과 안전선을 함께 관리합니다.', commonKpis.safety('approved-communication')), csf('approved-communication-record', '고객 질문 대응 범위가 기록되어야 한다', '즉답과 확인 후 대응을 구분합니다.', commonKpis.record('approved-communication'))]),
      teamTask('safe-expression-replace', '위험 표현 점검 및 대체 문장 정착', '비교 우위 단정, 처방 유도, 허가 외 사용 암시를 예방합니다.', [csf('safe-expression-replace-safety', '위험 표현을 안전한 표현으로 바꿔야 한다', '오해를 줄 수 있는 표현을 수정합니다.', commonKpis.safety('safe-expression-replace')), csf('safe-expression-replace-question', '확인 후 대응할 질문을 구분해야 한다', '현장에서 즉흥적으로 답하지 않습니다.', commonKpis.followup('safe-expression-replace'))]),
    ],
  },
  {
    id: 'market-response',
    label: '시장 변화 대응력 강화',
    hint: '고객 접점 방식이 달라져도 반응과 후속 확인이 끊기지 않게 만드는 방향입니다.',
    teamTasks: [
      teamTask('contact-diversification', '고객 접점 방식 다변화와 후속 확인 체계 강화', '방문 외 접점의 효과를 후속 확인으로 봅니다.', [csf('contact-diversification-contact', '방문 외 접점 이후 실제 반응이 확인되어야 한다', '대체 접점 이후 반응을 기록으로 확인합니다.', commonKpis.contact('contact-diversification')), csf('contact-diversification-followup', '후속 확인이 일정 안에 실행되어야 한다', '자료 전달 이후 확인 흐름을 만듭니다.', commonKpis.followup('contact-diversification'))]),
      teamTask('contact-gap-check', '접점 공백 고객 접근 경로 점검', '무리한 접촉 확대보다 접점 공백의 이유를 먼저 봅니다.', [csf('contact-gap-check-gap', '접점 공백의 이유가 확인되어야 한다', '공백을 비난보다 진단으로 봅니다.', commonKpis.contact('contact-gap-check')), csf('contact-gap-check-purpose', '접점 목적이 명확해야 한다', '무엇을 확인하려는 접점인지 먼저 정리합니다.', commonKpis.record('contact-gap-check'))]),
    ],
  },
];

function selectedStrategy(state: State) {
  return STRATEGIES.find((item) => item.id === state.selectedStrategyId);
}

function selectedTeamTask(strategy: Strategy | undefined, state: State) {
  return strategy?.teamTasks.find((item) => item.id === state.selectedTeamTaskId);
}

function selectedCsfs(strategy: Strategy | undefined, state: State) {
  return (selectedTeamTask(strategy, state)?.csfs ?? []).filter((item) => state.selectedCsfIds?.includes(item.id));
}

function allKpis(strategy: Strategy | undefined, state: State) {
  return selectedCsfs(strategy, state).flatMap((csfItem) => csfItem.kpis.map((item) => ({ ...item, csfLabel: csfItem.label })));
}

function selectedKpis(strategy: Strategy | undefined, state: State) {
  return allKpis(strategy, state).filter((item) => state.selectedKpiIds?.includes(item.id));
}

function labels(items: Array<{ label: string }>) {
  return items.length ? items.map((item) => item.label).join(' · ') : '미선택';
}

function toggle(list: string[] | undefined, id: string, limit?: number) {
  const current = Array.isArray(list) ? list : [];
  if (current.includes(id)) return current.filter((item) => item !== id);
  const next = [...current, id];
  return limit ? next.slice(-limit) : next;
}

function copyText(text: string) {
  void navigator.clipboard?.writeText(text);
}

function buildPrompt(strategy: Strategy | undefined, state: State) {
  return [
    '당신은 제약영업 팀장의 성과관리 코치입니다.',
    '',
    '아래 내용을 바탕으로 CSF/KPI 후보를 보완하고, 위험 표현을 점검해 주세요.',
    '실제 고객명, 병원명, 의료진명, 제품명, 실제 매출자료, 처방 정보, 팀원 실명은 포함하지 마세요.',
    '',
    `[전사전략과제] ${strategy?.label || '미선택'}`,
    `[우리 조 팀 전략과제] ${state.customTeamTask || selectedTeamTask(strategy, state)?.label || '미선택'}`,
    `[전략과제 핵심 의도] ${state.cascadeInterpretation || '미작성'}`,
    `[선택 CSF] ${labels(selectedCsfs(strategy, state))}`,
    `[선택 KPI] ${labels(selectedKpis(strategy, state))}`,
    `[KPI 선택 이유와 주의점] ${state.cascadeComplianceCaution || '미작성'}`,
    '',
    '[요청]',
    '1. 놓친 CSF 후보를 2개만 제안해 주세요.',
    '2. 선택한 CSF와 연결되는 KPI 후보를 활동·전환·품질·리스크 관점으로 보완해 주세요.',
    '3. 팀장이 중간 점검에서 물어볼 확인 질문을 3개 제안해 주세요.',
    '4. 컴플라이언스상 조심해야 할 표현과 안전한 대체 표현을 제안해 주세요.',
    '5. 우리 조가 최종 메모에 넣을 1문장 요약을 제안해 주세요.',
    '',
    '[출력 형식]',
    '1. CSF 후보',
    '2. KPI 후보',
    '3. 확인 질문',
    '4. 주의할 표현',
    '5. 최종 반영 문장',
    '',
    '주의: 처방 유도, 허가 외 사용 암시, 경쟁사 비방, 비교 우위 단정, 고객 의도 단정 표현은 제외해 주세요.',
  ].join('\n');
}

function findAny(text: string, labels: string[]) {
  const indexes = labels.map((label) => text.indexOf(label)).filter((index) => index >= 0);
  return indexes.length ? Math.min(...indexes) : -1;
}

function section(text: string, labels: string[], nextLabels: string[]) {
  const start = findAny(text, labels);
  if (start < 0) return '';
  const rest = text.slice(start).replace(/^[^\n]*\n?/, '').trim();
  const next = findAny(rest, nextLabels);
  return (next >= 0 ? rest.slice(0, next) : rest).trim();
}

function cleanSection(value: string) {
  return value
    .split('\n')
    .map((line) => line.replace(/^\s*[-*•]?\s*(\d+[.)]\s*)?/, '').trim())
    .filter(Boolean)
    .join('\n');
}

function parseAiDraft(text: string) {
  const labels = {
    csf: ['CSF 후보', '1. CSF', '핵심성공요인'],
    kpi: ['KPI 후보', '2. KPI', '지표 후보'],
    question: ['확인 질문', '3. 확인 질문', '점검 질문'],
    risk: ['주의할 표현', '4. 주의', '위험 표현', '조심해야 할 표현'],
    final: ['최종 반영 문장', '5. 최종', '요약 문장'],
  };
  const all = [...labels.csf, ...labels.kpi, ...labels.question, ...labels.risk, ...labels.final];
  const csfs = cleanSection(section(text, labels.csf, all.filter((item) => !labels.csf.includes(item))));
  const kpis = cleanSection(section(text, labels.kpi, all.filter((item) => !labels.kpi.includes(item))));
  const questions = cleanSection(section(text, labels.question, all.filter((item) => !labels.question.includes(item))));
  const risks = cleanSection(section(text, labels.risk, all.filter((item) => !labels.risk.includes(item))));
  const final = cleanSection(section(text, labels.final, []));
  return {
    aiSuggestedCsfs: csfs || 'AI 답변에서 CSF 후보를 찾지 못했습니다. 필요하면 직접 정리해 주세요.',
    aiSuggestedKpis: kpis || 'AI 답변에서 KPI 후보를 찾지 못했습니다. 필요하면 직접 정리해 주세요.',
    aiSuggestedCheckQuestions: questions || 'AI 답변에서 확인 질문을 찾지 못했습니다. 필요하면 직접 정리해 주세요.',
    aiRiskExpressions: risks || 'AI 답변에서 주의 표현을 찾지 못했습니다. 그래도 처방 유도·비교 우위 단정 표현은 다시 확인하세요.',
    adoptedExpression: final || '선택한 팀 전략과제·CSF·KPI를 바탕으로 이번 2주 실행 기준을 정리한다.',
  };
}

function firstLine(value?: string) {
  return value?.split('\n').map((line) => line.trim()).filter(Boolean)[0] || '';
}

function buildTwoWeekDraft(strategy: Strategy | undefined, state: State) {
  const kpiSummary = labels(selectedKpis(strategy, state));
  const teamTaskSummary = state.customTeamTask || selectedTeamTask(strategy, state)?.label || '선택한 팀 전략과제';
  const question = firstLine(state.aiSuggestedCheckQuestions) || '이번 주 기록에서 확인 가능한 사실, 아직 부족한 정보, 팀장 지원이 필요한 부분은 무엇인가요?';
  const risk = firstLine(state.aiRiskExpressions);
  return {
    twoWeekFirstAction: `이번 2주 동안 우리 조는 “${teamTaskSummary}”를 기준으로 ${kpiSummary}와 연결되는 고객 질문, 후속 행동, 지원 필요 신호가 기록에 남았는지 먼저 확인한다.`,
    pauseActivity: risk ? `AI 답변에서 주의가 필요한 “${risk}” 같은 표현은 쓰지 않고, KPI와 직접 연결되지 않는 장문 보고나 방문 수만 늘리는 활동은 잠시 줄인다.` : '방문 수만 늘리는 반복 활동, 형식적 기록 입력, KPI와 직접 연결되지 않는 장문 보고는 잠시 줄인다.',
    midCheckQuestion: question,
    finalExecutionStandard: `다음 단계에서는 ${kpiSummary}를 확인할 수 있는 구체 행동, 완료 기준, 팀장 지원 조건으로 바꾼다.`,
    finalCsfKpiMemo: `${strategy?.label || '전사전략과제'} → ${teamTaskSummary} → ${labels(selectedCsfs(strategy, state))} → ${kpiSummary} 순서로 연결한다. AI 제안은 후보로만 참고하고, 우리 조는 ${state.adoptedExpression || '현장 적용 가능한 표현으로 최종 수정한다.'}`,
  };
}

function Button({ children, onClick, disabled = false, tone = 'dark' }: { children: string; onClick: () => void; disabled?: boolean; tone?: 'dark' | 'light' | 'emerald' }) {
  const cls = disabled
    ? 'cursor-not-allowed bg-slate-200 text-slate-400'
    : tone === 'emerald'
      ? 'bg-emerald-700 text-white hover:bg-emerald-800'
      : tone === 'light'
        ? 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
        : 'bg-slate-950 text-white hover:bg-slate-800';
  return <button type="button" disabled={disabled} onClick={onClick} className={`rounded-2xl px-4 py-3 text-sm font-black shadow-sm ${cls}`}>{children}</button>;
}

function TextArea({ label, help, value, onChange, placeholder, readOnly = false, min = 'min-h-28' }: { label: string; help?: string; value: string; onChange: (value: string) => void; placeholder?: string; readOnly?: boolean; min?: string }) {
  return (
    <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <span className="text-sm font-black text-slate-950">{label}</span>
      {help ? <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{help}</p> : null}
      <textarea
        readOnly={readOnly}
        className={`mt-3 ${min} w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-violet-700 focus:ring-2 focus:ring-violet-100 ${readOnly ? 'bg-white text-slate-500' : 'bg-white text-slate-700'}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"><h3 className="text-lg font-black text-slate-950">{title}</h3><div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">{children}</div></section>;
}

function LockedPanel({ title, body }: { title: string; body: string }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm leading-6 text-slate-500"><p className="font-black text-slate-700">{title}</p><p className="mt-1 text-xs font-bold">{body}</p></div>;
}

export function V40VNextPerformanceEnhancedCascadeLab() {
  const [state, setState] = useStored<State>(V40_VNEXT_PERFORMANCE_CASCADE_STORAGE_KEY, DEFAULT_STATE);
  const strategy = selectedStrategy(state);
  const team = selectedTeamTask(strategy, state);
  const prompt = useMemo(() => buildPrompt(strategy, state), [strategy, state]);
  const csfs = team?.csfs ?? [];
  const chosenCsfs = selectedCsfs(strategy, state);
  const kpis = allKpis(strategy, state);
  const chosenKpis = selectedKpis(strategy, state);
  const update = (patch: Partial<State>) => setState({ ...state, ...patch });
  const hasKpiSelection = chosenKpis.length >= 2;

  return (
    <section className="space-y-4">
      <Card title="전사전략과제 선택">
        <p className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">먼저 우리 조가 중점적으로 실행할 전사전략과제를 선택합니다. 이후 팀 전략과제, CSF, KPI 후보가 단계적으로 열립니다.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {STRATEGIES.map((item) => (
            <button key={item.id} type="button" onClick={() => update({ selectedStrategyId: item.id, selectedTeamTaskId: '', customTeamTask: '', selectedCsfIds: [], selectedKpiIds: [], aiCascadePrompt: '', aiCascadeDraft: '', finalCsfKpiMemo: '' })} className={`rounded-2xl border p-4 text-left transition ${state.selectedStrategyId === item.id ? 'border-slate-900 bg-slate-950 text-white' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400'}`}>
              <p className="text-xs font-black opacity-70">전사전략과제</p>
              <p className="mt-1 text-base font-black">{item.label}</p>
              <p className="mt-2 text-xs leading-5 opacity-70">{item.hint}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card title="우리 조가 실행할 팀 전략과제 선택">
        {!strategy ? <LockedPanel title="전사전략과제 선택 후 팀 전략과제 선택창 활성화" body="먼저 전사전략과제를 선택해야 팀 전략과제 후보가 나타납니다." /> : (
          <>
            <div className="grid gap-3 md:grid-cols-2">
              {strategy.teamTasks.map((item) => (
                <button key={item.id} type="button" onClick={() => update({ selectedTeamTaskId: item.id, customTeamTask: item.label, selectedCsfIds: [], selectedKpiIds: [], aiCascadePrompt: '', aiCascadeDraft: '' })} className={`rounded-2xl border p-4 text-left ${state.selectedTeamTaskId === item.id ? 'border-cyan-400 bg-cyan-50' : 'border-slate-200 bg-white hover:border-slate-400'}`}>
                  <p className="font-black text-slate-950">{item.label}</p>
                  <p className="mt-2 text-xs font-bold leading-5 text-slate-600">가이드: {item.guide}</p>
                </button>
              ))}
            </div>
            <TextArea label="우리 조가 선정한 팀 전략과제 보완 문장" help="후보를 고른 뒤 우리 조 언어로 조금 더 구체화합니다." value={state.customTeamTask ?? ''} onChange={(value) => update({ customTeamTask: value })} placeholder="예: CRM 기록을 단순 입력이 아니라 후속 실행과 팀장 지원 신호로 연결한다." />
            <TextArea label="전략과제 핵심 의도 해석" help="이 과제가 왜 중요한지 우리 조가 이해한 의미를 짧게 적습니다." value={state.cascadeInterpretation ?? ''} onChange={(value) => update({ cascadeInterpretation: value })} placeholder="예: 단순 활동량보다 고객 반응 이후 후속 실행과 기록 품질을 높이라는 의미입니다." />
          </>
        )}
      </Card>

      <Card title="CSF 선택">
        {!team ? <LockedPanel title="팀 전략과제 선택 후 CSF 선택창 활성화" body="우리 조가 실행할 팀 전략과제를 선택하면 CSF 후보가 나타납니다." /> : (
          <>
            <p className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">CSF는 핵심성공요인입니다. “측정하기 쉬운 것”이 아니라 “성공에 꼭 필요한 조건”을 2개 선택합니다.</p>
            <div className="grid gap-3 md:grid-cols-2">
              {csfs.map((item) => (
                <button key={item.id} type="button" onClick={() => update({ selectedCsfIds: toggle(state.selectedCsfIds, item.id, 2), selectedKpiIds: [], aiCascadePrompt: '', aiCascadeDraft: '' })} className={`rounded-2xl border p-4 text-left ${state.selectedCsfIds?.includes(item.id) ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
                  <p className="font-black text-slate-950">{item.label}</p>
                  <p className="mt-2 text-xs font-bold leading-5 text-emerald-700">가이드: {item.guide}</p>
                </button>
              ))}
            </div>
          </>
        )}
      </Card>

      <Card title="KPI 선택">
        {chosenCsfs.length === 0 ? <LockedPanel title="CSF 선택 후 KPI 선택창 활성화" body="CSF를 선택하면 KPI 후보가 나타납니다." /> : (
          <>
            <p className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">KPI는 CSF가 작동하는지 확인하는 관찰 지표입니다. 활동·전환·품질·리스크가 함께 보이는지 확인하며 2개 이상 선택합니다.</p>
            <div className="grid gap-3 md:grid-cols-2">
              {kpis.map((item) => (
                <button key={item.id} type="button" onClick={() => update({ selectedKpiIds: toggle(state.selectedKpiIds, item.id), aiCascadePrompt: '', aiCascadeDraft: '' })} className={`rounded-2xl border p-4 text-left ${state.selectedKpiIds?.includes(item.id) ? 'border-violet-400 bg-violet-50' : 'border-slate-200 bg-white'}`}>
                  <p className="text-xs font-black text-violet-700">{item.type} KPI</p>
                  <p className="mt-1 font-black text-slate-950">{item.label}</p>
                  <p className="mt-2 text-xs font-bold leading-5 text-slate-600">확인 증거: {item.evidence}</p>
                  <p className="mt-1 text-xs font-bold leading-5 text-slate-600">확인 질문: {item.question}</p>
                  <p className="mt-1 text-xs font-bold leading-5 text-amber-700">주의: {item.caution}</p>
                </button>
              ))}
            </div>
            <TextArea label="KPI 선택 이유와 컴플라이언스 주의점" help="KPI를 선택한 이유와 조심해야 할 표현을 짧게 남깁니다." value={state.cascadeComplianceCaution ?? ''} onChange={(value) => update({ cascadeComplianceCaution: value })} placeholder="예: 후속 실행을 보기 위한 KPI이지만 고객 반응을 처방 가능성으로 단정하지 않습니다." />
          </>
        )}
      </Card>

      <Card title="AI에게 CSF/KPI 후보 확장 요청">
        {!hasKpiSelection ? <LockedPanel title="KPI 선택 후 AI 확장 요청 활성화" body="우리 조가 먼저 KPI를 2개 이상 선택한 뒤, AI에게 놓친 후보와 위험 표현을 점검받습니다." /> : (
          <>
            <p className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">AI는 선택을 대신하지 않습니다. 우리 조가 먼저 고른 전략과제·CSF·KPI를 기준으로 놓친 후보와 위험 표현만 점검합니다.</p>
            <div className="flex flex-wrap gap-2"><Button onClick={() => update({ aiCascadePrompt: prompt })}>AI 확장 프롬프트 만들기</Button><Button onClick={() => copyText(state.aiCascadePrompt || prompt)}>프롬프트 복사</Button></div>
            <TextArea label="AI에게 보낼 프롬프트" help="아래 프롬프트를 복사해 외부 AI에 붙여넣으세요. 실제 고객명, 병원명, 의료진명, 제품명, 실제 수치, 처방 정보는 넣지 않습니다." value={state.aiCascadePrompt || ''} onChange={(value) => update({ aiCascadePrompt: value })} readOnly min="min-h-40" placeholder="AI 확장 프롬프트 만들기를 누르면 여기에 프롬프트가 표시됩니다." />
            <TextArea label="AI가 제안한 CSF/KPI 후보 붙여넣기" help="외부 AI가 제안한 CSF, KPI, 확인 질문, 주의 표현을 그대로 붙여넣으세요. 다음 버튼을 누르면 항목별로 정리됩니다." value={state.aiCascadeDraft ?? ''} onChange={(value) => update({ aiCascadeDraft: value })} min="min-h-40" placeholder="AI 답변 전체를 붙여넣으세요." />
            <div className="flex flex-wrap gap-2"><Button onClick={() => update(parseAiDraft(state.aiCascadeDraft || ''))} disabled={!state.aiCascadeDraft?.trim()} tone="emerald">AI 답변 항목별로 정리하기</Button><Button onClick={() => update(buildTwoWeekDraft(strategy, state))} tone="light">2주 성과관리 기준 초안 만들기</Button></div>
            <div className="grid gap-3 md:grid-cols-2">
              <TextArea label="AI가 제안한 CSF 후보" value={state.aiSuggestedCsfs ?? ''} onChange={(value) => update({ aiSuggestedCsfs: value })} placeholder="AI 답변 정리 후 자동 입력됩니다." />
              <TextArea label="AI가 제안한 KPI 후보" value={state.aiSuggestedKpis ?? ''} onChange={(value) => update({ aiSuggestedKpis: value })} placeholder="AI 답변 정리 후 자동 입력됩니다." />
              <TextArea label="AI가 제안한 확인 질문" value={state.aiSuggestedCheckQuestions ?? ''} onChange={(value) => update({ aiSuggestedCheckQuestions: value })} placeholder="AI 답변 정리 후 자동 입력됩니다." />
              <TextArea label="AI 답변에서 주의할 표현" value={state.aiRiskExpressions ?? ''} onChange={(value) => update({ aiRiskExpressions: value })} placeholder="처방 유도, 비교 우위 단정, 허가 외 사용 암시 표현을 점검합니다." />
            </div>
            <TextArea label="우리 조가 채택할 표현" help="AI 답변을 그대로 쓰지 말고 우리 조의 현장 언어로 수정합니다." value={state.adoptedExpression ?? ''} onChange={(value) => update({ adoptedExpression: value })} placeholder="예: 선택 KPI와 연결되는 고객 질문, 후속 행동, 지원 필요 신호를 2주 동안 확인한다." />
            <div className="flex flex-wrap gap-2"><Button onClick={() => update(buildTwoWeekDraft(strategy, state))} tone="emerald">AI 정리 결과를 2주 기준 초안에 반영하기</Button></div>
            <TextArea label="우리 조 최종 CSF/KPI 메모" help="전사전략과제 → 팀 전략과제 → CSF → KPI를 한 문단으로 정리합니다." value={state.finalCsfKpiMemo ?? ''} onChange={(value) => update({ finalCsfKpiMemo: value })} placeholder="전사전략과제 → 팀 전략과제 → CSF → KPI를 한 문단으로 정리합니다." />
          </>
        )}
      </Card>
    </section>
  );
}
