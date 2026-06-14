import { type ReactNode } from 'react';
import { useStored } from './journey-storage';
import { DEFAULT_PHARMA_RESEARCH_STATE, PHARMA_STRATEGY_RESEARCH_STORAGE_KEY, pharmaTitleOf, type PharmaStrategyResearchState } from './journey-v41-pharma-research-data';

const V41_PERFORMANCE_COMPACT_MARKERS = [
  'V41PerformanceCompactCascadeLab',
  '팀 기준 만들기',
  '단계별 선택 구조',
  '팀 전략과제 선택 후 CSF 활성',
  'CSF 선택 후 KPI 활성',
  'KPI 선택 후 세부 추진과제 활성',
  '자동 선택 없음',
  'ckd.v41.performanceCascade.v1',
].join('|');
void V41_PERFORMANCE_COMPACT_MARKERS;

type TeamKpiOption = {
  label: string;
  cycle: string;
  evidence: string;
  owner: string;
};

type TeamCsfOption = {
  id: string;
  label: string;
  description: string;
  kpis: TeamKpiOption[];
  initiatives: string[];
};

type TeamTaskOption = {
  id: string;
  type: string;
  task: string;
  csfs: TeamCsfOption[];
};

type PerformanceCascadeState = {
  selectedStrategyId: string;
  selectedTeamTaskId: string;
  selectedTeamTask: string;
  customTeamTask: string;
  selectedCsfId: string;
  selectedCsf: string;
  selectedKpi: string;
  selectedInitiative: string;
  teamStandard: string;
  twoWeekFirstAction: string;
  pauseActivity: string;
  midCheckQuestion: string;
  finalExecutionStandard: string;
};

const STORAGE_KEY = 'ckd.v41.performanceCascade.v1';

const DEFAULT_STATE: PerformanceCascadeState = {
  selectedStrategyId: '',
  selectedTeamTaskId: '',
  selectedTeamTask: '',
  customTeamTask: '',
  selectedCsfId: '',
  selectedCsf: '',
  selectedKpi: '',
  selectedInitiative: '',
  teamStandard: '',
  twoWeekFirstAction: '',
  pauseActivity: '',
  midCheckQuestion: '',
  finalExecutionStandard: '',
};

const kpi = (label: string, cycle: string, evidence: string, owner = '팀장'): TeamKpiOption => ({ label, cycle, evidence, owner });
const csf = (id: string, label: string, description: string, kpis: TeamKpiOption[], initiatives: string[]): TeamCsfOption => ({ id, label, description, kpis, initiatives });

const TEAM_TASK_OPTIONS: TeamTaskOption[] = [
  {
    id: 'market-insight',
    type: '시장 인사이트형',
    task: '비만·대사질환 핵심 고객군의 관심, 우려, 질문을 구조적으로 수집하고 초기 시장 인사이트를 만든다.',
    csfs: [
      csf('target-customer', '핵심 고객군 선별', '먼저 반응을 봐야 할 의료진과 병원이 정해져 있어야 한다', [kpi('핵심 고객 리스트 작성률', '주 1회', '담당 구역별 핵심 고객 리스트', '담당자/팀장'), kpi('핵심 고객 첫 접점 완료율', '주 1회', '핵심 고객별 1차 접점 완료 표시', '팀장')], ['담당 구역별 핵심 고객 10명 정리', '고객 우선순위 기준 정리', '1차 접점 일정 확정']),
      csf('question-standard', '질문 수집 기준 통일', '의료진 질문과 우려를 같은 기준으로 남겨야 한다', [kpi('고객 질문·우려 기록 건수', '주 1회', '질문·우려·관심으로 구분된 방문 기록', '팀장'), kpi('기록 기준 충족률', '주 1회', '정해진 기록 항목 충족 여부', '팀장')], ['고객 질문·우려·관심 반응 기록 기준 통일', '좋은 기록과 부족한 기록 예시 비교', '방문 후 24시간 이내 기록 입력']),
      csf('reaction-classify', '반응 유형 분류', '관심·우려·자료 요청·경쟁 언급을 구분해야 한다', [kpi('반응 유형 분류율', '2주 1회', '관심·우려·자료 요청·경쟁 언급 분류표', '팀장'), kpi('반복 반응 요약 건수', '2주 1회', '반복 질문·우려 요약표', '팀장')], ['반응 유형 분류표 만들기', '반복 질문 주간 요약', '경쟁 언급과 자료 요청 별도 표시']),
    ],
  },
  {
    id: 'value-evidence',
    type: '제품가치 검증형',
    task: '핵심 고객군별 미충족 니즈와 치료제 선택 기준을 파악해 제품 가치 근거 준비에 기여한다.',
    csfs: [
      csf('unmet-need', '미충족 니즈 파악', '고객이 기존 치료에서 아쉬워하는 지점이 정리되어야 한다', [kpi('고객 니즈 기록 건수', '주 1회', '고객별 미충족 니즈 메모', '담당자/팀장'), kpi('니즈 유형 분류율', '2주 1회', '효과·안전성·편의성·순응도 분류표', '팀장')], ['고객별 치료제 선택 기준 질문 정리', '미충족 니즈 기록 양식 만들기']),
      csf('choice-criteria', '치료제 선택 기준 확인', '효과·안전성·편의성·환자 순응도 중 고객이 중시하는 기준이 확인되어야 한다', [kpi('치료제 선택 기준 분류율', '2주 1회', '선택 기준 유형별 분류표', '팀장'), kpi('핵심 고객 선택 기준 확인율', '2주 1회', '핵심 고객별 선택 기준 기록', '팀장')], ['선택 기준 질문 리스트 만들기', '고객별 선택 기준 1줄 정리']),
      csf('evidence-link', '근거 연결성 확보', '수집된 니즈가 제품 가치 근거와 연결되어야 한다', [kpi('제품 가치 근거 연결 건수', '2주 1회', '니즈-근거자료 연결 메모', '팀장'), kpi('근거자료 요청 건수', '주 1회', '고객 니즈에 연결된 자료 요청 기록', '담당자')], ['제품 가치 근거 연결 메모 작성', '자료 요청 접수 기준 정리']),
    ],
  },
  {
    id: 'launch-readiness',
    type: '실행준비 점검형',
    task: '의료진 질문과 자료 요청 흐름을 정리해 GLP-1 포트폴리오 출시 준비 상태를 현장에서 검증한다.',
    csfs: [
      csf('request-intake', '자료 요청 접수 기준', '어떤 자료 요청을 중요한 신호로 볼지 정해져 있어야 한다', [kpi('자료 요청 접수 건수', '주 1회', '자료 요청 접수 목록', '담당자'), kpi('핵심 자료 요청 비율', '2주 1회', '핵심 고객 자료 요청 중 중요 요청 표시', '팀장')], ['자료 요청 접수 기준 정리', '자료 요청 기록 항목 만들기']),
      csf('internal-owner', '내부 연결 담당 명확화', '자료·학술·컴플라이언스 확인 담당이 정해져 있어야 한다', [kpi('내부 확인 연결률', '주 1회', '자료 요청별 내부 담당 연결 기록', '팀장'), kpi('내부 확인 리드타임', '2주 1회', '요청일·연결일·답변일 기록', '팀장')], ['내부 확인 담당과 처리 기준 정리', '자료 요청 전달 흐름 점검']),
      csf('followup-complete', '후속 완료 기준', '요청 접수부터 완료까지의 기준과 기한이 있어야 한다', [kpi('자료 요청 후속 완료율', '주 1회', '요청일·예정일·완료일 기록', '팀장'), kpi('미처리 요청 건수', '주 1회', '미처리 요청과 지연 사유 목록', '팀장')], ['자료 요청 완료 상태 점검', '자료 요청 후속 지연 사유 확인']),
    ],
  },
  {
    id: 'competitive-risk',
    type: '경쟁·리스크 감지형',
    task: '경쟁 제품, 제형 변화, 환자 편의성 관련 고객 반응을 수집해 전사 시장 진입 전략에 반영한다.',
    csfs: [
      csf('competitor-mention', '경쟁 언급 기준 통일', '경쟁 제품 언급을 같은 기준으로 기록해야 한다', [kpi('경쟁 제품 언급 기록 건수', '주 1회', '경쟁 제품 언급 메모', '담당자/팀장'), kpi('경쟁 질문 분류율', '2주 1회', '경쟁 질문 유형 분류표', '팀장')], ['경쟁 제품 언급 기록 기준 정리', '경쟁 질문 유형 구분']),
      csf('convenience-signal', '환자 편의성 신호 수집', '제형·투약 편의성 관련 고객 반응이 남아야 한다', [kpi('제형·편의성 반응 수집 건수', '2주 1회', '제형·편의성 관련 고객 반응 목록', '팀장'), kpi('환자 순응도 관련 질문 건수', '2주 1회', '순응도 관련 고객 질문 기록', '팀장')], ['제형·환자 편의성 질문 수집', '순응도 관련 고객 반응 메모 작성']),
      csf('risk-expression', '리스크 표현 관리', '경쟁 비교나 과장 표현 없이 사실 중심으로 정리해야 한다', [kpi('위험 표현 수정 건수', '수시/주 1회', '수정 전후 표현 예시', '팀장'), kpi('사실 중심 기록률', '주 1회', '해석보다 사실 중심으로 작성된 기록 비율', '팀장')], ['위험 표현 예시 공유', '사실 중심 기록 샘플 점검']),
    ],
  },
];

function splitLines(value: string) {
  return value.split(/\r?\n/).map((line) => line.replace(/^[-*•\d.)\s]+/, '').trim()).filter(Boolean).slice(0, 6);
}

function Field({ label, help, children }: { label: string; help?: string; children: ReactNode }) {
  return <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="text-sm font-black text-slate-950">{label}</span>{help ? <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{help}</p> : null}<div className="mt-3">{children}</div></label>;
}

function TextArea({ value, onChange, placeholder, disabled = false }: { value: string; onChange: (value: string) => void; placeholder: string; disabled?: boolean }) {
  return <textarea disabled={disabled} className={`min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 ${disabled ? 'cursor-not-allowed opacity-50' : ''}`} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />;
}

function DisabledNotice({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-500">{children}</div>;
}

export function V41PerformanceCompactCascadeLab() {
  const [state, setState] = useStored<PerformanceCascadeState>(STORAGE_KEY, DEFAULT_STATE);
  const [researchState] = useStored<PharmaStrategyResearchState>(PHARMA_STRATEGY_RESEARCH_STORAGE_KEY, DEFAULT_PHARMA_RESEARCH_STATE);
  const update = (patch: Partial<PerformanceCascadeState>) => setState({ ...state, ...patch });

  const enterpriseTitle = pharmaTitleOf(researchState);
  const enterpriseInitiatives = splitLines(researchState.issueTwo);
  const selectedTeamOption = TEAM_TASK_OPTIONS.find((item) => item.id === state.selectedTeamTaskId) || null;
  const selectedCsf = selectedTeamOption?.csfs.find((item) => item.id === state.selectedCsfId) || null;
  const selectedKpi = selectedCsf?.kpis.find((item) => item.label === state.selectedKpi) || null;
  const selectedInitiative = state.selectedInitiative || '';
  const teamTask = state.customTeamTask.trim() || state.selectedTeamTask;

  return <section className="space-y-4">
    <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-emerald-700">팀 기준 만들기</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">4단계 전사전략을 팀 기준 후보로 바꾸기</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-600">4단계에서 선택한 전사 전략과제를 확인한 뒤, 팀 전략과제 → CSF → KPI → 세부 추진과제 순서로 직접 선택합니다. 자동 선택은 하지 않습니다.</p>
    </section>

    <section className="rounded-3xl border border-cyan-100 bg-cyan-50 p-4 text-sm font-bold leading-6 text-cyan-950 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-cyan-700">4단계에서 가져온 전사 기준</p>
      <h3 className="mt-1 text-lg font-black text-slate-950">{enterpriseTitle}</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-3"><p className="font-black text-cyan-900">전사 추진과제 후보</p>{enterpriseInitiatives.length ? <ul className="mt-2 space-y-1 text-xs">{enterpriseInitiatives.map((item) => <li key={item}>- {item}</li>)}</ul> : <p className="mt-2 text-xs text-slate-500">4단계 결과에서 추진과제 후보를 정리하면 이곳에 연결됩니다.</p>}</div>
        <div className="rounded-2xl bg-white p-3"><p className="font-black text-cyan-900">전사 기준</p><p className="mt-2 text-xs">전사 전략을 팀 기준으로 내려오기 위한 참고 정보입니다.</p></div>
        <div className="rounded-2xl bg-white p-3"><p className="font-black text-cyan-900">선택 방식</p><p className="mt-2 text-xs">아래에서 순서대로 직접 선택해야 다음 영역이 열립니다.</p></div>
      </div>
    </section>

    <section className="grid gap-3 md:grid-cols-2">
      <Field label="팀 전략과제 보기 4개" help="먼저 팀 전략과제를 직접 선택합니다. 선택해야 CSF 선택 영역이 열립니다.">
        <div className="space-y-2">{TEAM_TASK_OPTIONS.map((teamTaskOption) => <label key={teamTaskOption.id} className="flex gap-2 rounded-xl bg-white p-2 text-sm font-bold"><input type="radio" checked={state.selectedTeamTaskId === teamTaskOption.id} onChange={() => update({ selectedTeamTaskId: teamTaskOption.id, selectedTeamTask: teamTaskOption.task, customTeamTask: '', selectedCsfId: '', selectedCsf: '', selectedKpi: '', selectedInitiative: '', teamStandard: '', twoWeekFirstAction: '', pauseActivity: '', midCheckQuestion: '', finalExecutionStandard: '' })} /><span><span className="mr-2 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-black text-emerald-700">{teamTaskOption.type}</span>{teamTaskOption.task}</span></label>)}</div>
      </Field>
      <Field label="우리 팀 전략과제 직접 수정" help="팀 전략과제를 선택한 뒤 우리 팀 언어로 다듬습니다.">
        <TextArea disabled={!selectedTeamOption} value={state.customTeamTask} onChange={(value) => update({ customTeamTask: value })} placeholder={selectedTeamOption?.task || '먼저 팀 전략과제를 선택하세요.'} />
      </Field>
    </section>

    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <h3 className="text-lg font-black text-slate-950">팀 CSF 선택</h3>
      {!selectedTeamOption ? <DisabledNotice>먼저 위에서 팀 전략과제를 선택해야 CSF를 고를 수 있습니다.</DisabledNotice> : <><p className="mt-1 text-xs font-bold leading-5 text-slate-500">전략과제 유형: {selectedTeamOption.type}</p><div className="mt-4 grid gap-3 md:grid-cols-3">{selectedTeamOption.csfs.map((item) => <label key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold"><input className="mr-2" type="radio" checked={state.selectedCsfId === item.id} onChange={() => update({ selectedCsfId: item.id, selectedCsf: `${item.label}: ${item.description}`, selectedKpi: '', selectedInitiative: '', teamStandard: '', twoWeekFirstAction: '', pauseActivity: '', midCheckQuestion: '', finalExecutionStandard: '' })} /><span className="font-black text-slate-950">{item.label}</span><p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p></label>)}</div></>}
    </section>

    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <h3 className="text-lg font-black text-slate-950">선택한 CSF를 측정할 팀 KPI</h3>
      {!selectedCsf ? <DisabledNotice>팀 CSF를 선택해야 KPI를 고를 수 있습니다.</DisabledNotice> : <><p className="mt-1 text-xs font-bold leading-5 text-slate-500">선택한 CSF: {selectedCsf.label}</p><div className="mt-4 space-y-2">{selectedCsf.kpis.map((item) => <label key={item.label} className="flex gap-2 rounded-xl bg-slate-50 p-3 text-sm font-bold"><input type="radio" checked={state.selectedKpi === item.label} onChange={() => update({ selectedKpi: item.label, selectedInitiative: '', teamStandard: '', twoWeekFirstAction: '', pauseActivity: '', midCheckQuestion: '', finalExecutionStandard: '' })} /><span>{item.label}<span className="mt-1 block text-xs text-slate-500">관리 주기: {item.cycle} · 확인 기준: {item.evidence} · 담당/확인: {item.owner}</span></span></label>)}</div></>}
    </section>

    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <h3 className="text-lg font-black text-slate-950">선택한 KPI를 실행할 세부 추진과제</h3>
      {!selectedKpi || !selectedCsf ? <DisabledNotice>KPI를 선택해야 세부 추진과제를 고를 수 있습니다.</DisabledNotice> : <><div className="space-y-2">{selectedCsf.initiatives.map((initiative) => <label key={initiative} className="flex gap-2 rounded-xl bg-white p-2 text-sm font-bold"><input type="radio" checked={selectedInitiative === initiative} onChange={() => update({ selectedInitiative: initiative, teamStandard: '', twoWeekFirstAction: '', pauseActivity: '', midCheckQuestion: '', finalExecutionStandard: '' })} />{initiative}</label>)}</div><div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-950">주의: 고객 반응 수집을 처방 유도나 경쟁사 비교 우위 단정으로 연결하지 않습니다.</div></>}
    </section>

    <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm md:p-5">
      <h3 className="text-lg font-black text-slate-950">선택된 기준 정리</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-2 text-sm font-bold leading-6 text-slate-600">
        <div className="rounded-2xl bg-slate-50 p-3"><p className="font-black text-slate-950">팀 전략과제</p><p>{teamTask || '미선택'}</p></div>
        <div className="rounded-2xl bg-slate-50 p-3"><p className="font-black text-slate-950">팀 CSF</p><p>{state.selectedCsf || '미선택'}</p></div>
        <div className="rounded-2xl bg-slate-50 p-3"><p className="font-black text-slate-950">팀 KPI</p><p>{state.selectedKpi || '미선택'}</p></div>
        <div className="rounded-2xl bg-slate-50 p-3"><p className="font-black text-slate-950">세부 추진과제 후보</p><p>{state.selectedInitiative || '미선택'}</p></div>
      </div>
      <p className="mt-4 text-xs font-bold leading-5 text-slate-500">팀 성과기준 확정과 실행계획 수립은 6단계에서 진행합니다.</p>
    </section>
  </section>;
}
