import { useMemo } from 'react';
import { useStored } from './journey-storage';
import { DEFAULT_PHARMA_RESEARCH_STATE, PHARMA_STRATEGY_RESEARCH_STORAGE_KEY, pharmaTopicOf, pharmaTitleOf, type PharmaStrategyResearchState } from './journey-v41-pharma-research-data';

const V41_PERFORMANCE_COMPACT_MARKERS = [
  'V41PerformanceCompactCascadeLab',
  'v41 performance cascade lab cloned',
  'v41 performance cascade copy refined',
  '팀 기준 만들기',
  '4단계 전사전략과제에서 시작',
  '전사전략을 팀 전략과제로 바꾸기',
  '팀 전략과제 보기 4개',
  '팀 CSF와 팀 KPI 고르기',
  '세부 추진과제와 2주 실행계획 수립',
  'ckd.v41.performanceCascade.v1',
  'ckd.v41.pharmaStrategyResearch.v1',
].join('|');
void V41_PERFORMANCE_COMPACT_MARKERS;

type TeamCascadeOption = {
  id: string;
  teamTask: string;
  teamTasks: string[];
  csfs: string[];
  kpis: string[];
  initiatives: string[];
  caution: string;
};

type PerformanceCascadeState = {
  selectedStrategyId: string;
  selectedTeamTask: string;
  customTeamTask: string;
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

const TEAM_CASCADE_OPTIONS: TeamCascadeOption[] = [
  {
    id: 'ckd-glp1-obesity-metabolic',
    teamTask: '비만·대사질환 핵심 고객군의 관심, 우려, 질문을 구조적으로 수집하고 초기 시장 인사이트를 만든다.',
    teamTasks: [
      '비만·대사질환 핵심 고객군의 관심, 우려, 질문을 구조적으로 수집하고 초기 시장 인사이트를 만든다.',
      '핵심 고객군별 미충족 니즈와 치료제 선택 기준을 파악해 제품 가치 근거 준비에 기여한다.',
      '의료진 질문과 자료 요청 흐름을 정리해 GLP-1 포트폴리오 출시 준비 상태를 현장에서 검증한다.',
      '경쟁 제품, 제형 변화, 환자 편의성 관련 고객 반응을 수집해 전사 시장 진입 전략에 반영한다.',
    ],
    csfs: [
      '핵심 고객군 선별: 먼저 반응을 봐야 할 의료진과 병원이 정해져 있어야 한다',
      '질문 수집 기준 통일: 의료진 질문과 우려를 같은 기준으로 남겨야 한다',
      '후속 대응 흐름 정리: 자료 요청과 추가 확인을 누가, 언제까지 처리할지 정해져 있어야 한다',
    ],
    kpis: [
      '핵심 고객 리스트 작성률: 우선 고객 리스트가 작성된 담당 구역 비율(%)',
      '핵심 고객 첫 접점 완료율: 정해진 기간 안에 1차 접점이 완료된 핵심 고객 비율(%)',
      '고객 질문·우려 기록 건수: 핵심 고객군에서 수집된 질문·우려·관심 반응 건수(건)',
      '자료 요청 후속 완료율: 예정일 안에 완료된 자료 요청·후속 확인 비율(%)',
    ],
    initiatives: [
      '담당 구역별 핵심 고객 10명 정리',
      '고객 질문·우려·관심 반응 기록 기준 통일',
      '자료 요청 접수·전달·완료 상태 점검',
      '2주 후 초기 시장 반응 공유회의 운영',
    ],
    caution: '고객 반응 수집을 처방 유도나 경쟁사 비교 우위 단정으로 연결하지 않습니다.',
  },
  {
    id: 'ckd-core-product-value',
    teamTask: '주력 제품을 계속 선택하는 이유와 흔들리는 신호를 고객별로 확인해 시장 방어 실행 기준을 만든다.',
    teamTasks: [
      '주력 제품을 계속 선택하는 이유와 흔들리는 신호를 고객별로 확인해 시장 방어 실행 기준을 만든다.',
      '핵심 고객별 제품 가치 인식과 경쟁 제품 언급 신호를 수집해 고객가치 메시지 재정립에 기여한다.',
      '처방 감소 가능성이 있는 고객군을 조기에 파악하고 재접점 우선순위를 정한다.',
      '경쟁 질문과 고객 이탈 신호를 팀 단위로 공유해 주력 제품 시장 방어 활동을 정교화한다.',
    ],
    csfs: [
      '주요 고객별 가치 이유 확인: 고객이 제품을 계속 쓰는 이유가 정리되어 있어야 한다',
      '처방 감소 신호 기록: 처방이 줄어들거나 대체 가능성이 보이는 신호가 남아야 한다',
      '경쟁 질문 공유 기준 통일: 경쟁 제품 관련 질문과 우려가 팀 안에서 빠르게 공유되어야 한다',
    ],
    kpis: [
      '주요 고객 가치 이유 정리율: 핵심 고객별 제품 사용 이유가 정리된 비율(%)',
      '처방 감소 신호 기록 건수: 처방 감소·대체 가능성으로 기록된 신호 건수(건)',
      '경쟁 질문 공유 건수: 경쟁 제품 관련 질문·우려가 팀에 공유된 건수(건)',
      '주요 고객 재접점 완료율: 정해진 기간 안에 재접점이 완료된 주요 고객 비율(%)',
    ],
    initiatives: [
      '핵심 고객별 제품 사용 이유 1줄 정리',
      '처방 감소·대체 가능성 신호 기록 양식 통일',
      '경쟁 질문 주간 공유 루틴 운영',
      '주요 고객 재접점 일정 확정',
    ],
    caution: '경쟁 제품을 비방하거나 고객 의도를 단정하는 표현은 사용하지 않습니다.',
  },
  {
    id: 'ckd-rnd-bio-pipeline-story',
    teamTask: '핵심 파이프라인과 미래 성장 스토리에 대해 고객이 궁금해하는 주제를 수집하고 승인된 범위 안에서 설명 기준을 정리한다.',
    teamTasks: [
      '핵심 파이프라인과 미래 성장 스토리에 대해 고객이 궁금해하는 주제를 수집하고 승인된 범위 안에서 설명 기준을 정리한다.',
      '고객이 묻는 파이프라인 관심 주제를 분류해 전사 커뮤니케이션 메시지 고도화에 기여한다.',
      '설명 가능한 내용과 내부 확인이 필요한 질문을 구분해 허용된 대외 커뮤니케이션 기준을 지킨다.',
      '신약·바이오 성장 스토리에 대한 고객 반응을 수집해 사업화 연결 가능성을 현장 관점에서 보완한다.',
    ],
    csfs: [
      '설명 가능 범위 확인: 고객에게 말할 수 있는 내용과 확인이 필요한 내용이 구분되어야 한다',
      '고객 관심 주제 수집: 고객이 궁금해하는 연구·바이오 주제가 기록되어야 한다',
      '승인자료 기반 설명: 허용된 자료와 표현 범위 안에서만 설명해야 한다',
    ],
    kpis: [
      '파이프라인 관련 고객 질문 수집 건수: 고객이 물어본 연구·바이오 관련 질문 수(건)',
      '확인 필요 질문 등록 건수: 즉시 답하지 않고 내부 확인으로 넘긴 질문 수(건)',
      '승인자료 기반 설명률: 승인된 자료 범위 안에서 진행된 설명 비율(%)',
      '관심 주제 분류율: 고객 질문이 주제별로 분류된 비율(%)',
    ],
    initiatives: [
      '파이프라인 질문 수집 항목 만들기',
      '설명 가능/확인 필요/추가 자료 요청으로 질문 분류',
      '승인자료 기반 설명 문장 정리',
      '고객 관심 주제 월간 요약 공유',
    ],
    caution: '개발 성공을 단정하거나 허가 전 적응증을 암시하지 않습니다.',
  },
  {
    id: 'ckd-data-based-field-execution',
    teamTask: '고객 반응, 다음 행동, Follow-up 상태를 같은 기준으로 남겨 팀 실행관리와 의사결정에 활용한다.',
    teamTasks: [
      '고객 반응, 다음 행동, Follow-up 상태를 같은 기준으로 남겨 팀 실행관리와 의사결정에 활용한다.',
      '영업 현장의 고객 접점 데이터를 표준화해 전사 고객 인사이트 축적에 기여한다.',
      '고객 반응과 실행 지연 신호를 조기에 확인해 팀 단위 실행관리 품질을 높인다.',
      '방문 기록을 단순 활동 기록이 아니라 다음 행동과 전략 인사이트로 연결한다.',
    ],
    csfs: [
      '기록 기준 통일: 고객 반응과 다음 행동을 남기는 기준이 같아야 한다',
      '후속 상태 가시화: 자료 제공과 Follow-up 상태가 팀장에게 보이도록 관리되어야 한다',
      '지연 신호 조기 확인: 늦어진 일과 막힌 일을 정기적으로 확인해야 한다',
    ],
    kpis: [
      '고객 반응 기록률: 고객 반응이 포함된 방문 기록 비율(%)',
      '다음 행동 입력률: 다음 행동이 입력된 방문 기록 비율(%)',
      'Follow-up 기한 준수율: 예정일 안에 완료된 Follow-up 비율(%)',
      '실행 지연 건수: 예정일을 넘긴 고객 후속 과제 건수(건)',
    ],
    initiatives: [
      '고객 반응·다음 행동 기록 기준 정리',
      'Follow-up 예정일과 완료 상태 입력',
      '지연 과제 주간 확인',
      '2주 단위 실행 대시보드 점검',
    ],
    caution: '방문 수나 기록량만 늘리는 활동을 성과로 보지 않습니다.',
  },
  {
    id: 'ckd-quality-supply-compliance',
    teamTask: '품질·공급·컴플라이언스 관련 고객 문의를 사실 중심으로 기록하고, 확인 전 단정 답변을 줄인다.',
    teamTasks: [
      '품질·공급·컴플라이언스 관련 고객 문의를 사실 중심으로 기록하고, 확인 전 단정 답변을 줄인다.',
      '품질·공급 문의를 내부 확인 흐름과 연결해 고객 신뢰 리스크를 조기에 관리한다.',
      '고객 커뮤니케이션에서 위험 표현을 줄이고 승인된 표현 기준을 팀 단위로 정착시킨다.',
      '반복되는 고객 문의 유형을 수집해 전사 품질·공급·컴플라이언스 대응 기준 개선에 기여한다.',
    ],
    csfs: [
      '문의 사실 기록: 고객 문의를 해석하지 않고 사실 중심으로 남겨야 한다',
      '확인 전 답변 제한: 내부 확인이 필요한 내용은 즉시 단정하지 않아야 한다',
      '위험 표현 점검: 고객에게 불안이나 오해를 줄 표현을 사전에 걸러야 한다',
    ],
    kpis: [
      '품질·공급 문의 기록 건수: 품질·공급 관련 고객 문의 기록 건수(건)',
      '미확인 답변 발생 건수: 내부 확인 전 단정 답변으로 기록된 건수(건)',
      '위험 표현 수정 건수: 고객 커뮤니케이션에서 수정한 위험 표현 건수(건)',
      '고객 문의 후속 완료율: 정해진 기한 안에 완료된 문의 후속 처리 비율(%)',
    ],
    initiatives: [
      '품질·공급 문의 기록 기준 통일',
      '내부 확인 필요 질문 분류',
      '위험 표현 예시 공유',
      '문의 후속 처리 완료 상태 점검',
    ],
    caution: '확인되지 않은 품질·공급 정보를 단정하거나 고객 불안을 키우는 표현을 쓰지 않습니다.',
  },
];

const DEFAULT_STATE: PerformanceCascadeState = {
  selectedStrategyId: '',
  selectedTeamTask: '',
  customTeamTask: '',
  selectedCsf: '',
  selectedKpi: '',
  selectedInitiative: '',
  teamStandard: '',
  twoWeekFirstAction: '',
  pauseActivity: '',
  midCheckQuestion: '',
  finalExecutionStandard: '',
};

function teamCascadeOf(topicId: string) {
  return TEAM_CASCADE_OPTIONS.find((item) => item.id === topicId) ?? TEAM_CASCADE_OPTIONS[0];
}

function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <span className="text-sm font-black text-slate-950">{label}</span>
      {help ? <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{help}</p> : null}
      <div className="mt-3">{children}</div>
    </label>
  );
}

function TextArea({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return <textarea className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />;
}

export function V41PerformanceCompactCascadeLab() {
  const [state, setState] = useStored<PerformanceCascadeState>(STORAGE_KEY, DEFAULT_STATE);
  const [researchState] = useStored<PharmaStrategyResearchState>(PHARMA_STRATEGY_RESEARCH_STORAGE_KEY, DEFAULT_PHARMA_RESEARCH_STATE);
  const update = (patch: Partial<PerformanceCascadeState>) => setState({ ...state, ...patch });
  const enterpriseTopic = useMemo(() => pharmaTopicOf(researchState.selectedTopicId), [researchState.selectedTopicId]);
  const enterpriseTitle = useMemo(() => pharmaTitleOf(researchState), [researchState.selectedTopicId, researchState.customTopic]);
  const cascade = useMemo(() => teamCascadeOf(researchState.selectedTopicId), [researchState.selectedTopicId]);
  const selectedTeamTask = state.selectedTeamTask || cascade.teamTasks[0] || cascade.teamTask;
  const teamTask = state.customTeamTask.trim() || selectedTeamTask;

  const makeDraft = () => {
    const csf = state.selectedCsf || cascade.csfs[0];
    const kpi = state.selectedKpi || cascade.kpis[0];
    const initiative = state.selectedInitiative || cascade.initiatives[0];
    update({
      teamStandard: `전사 전략과제: ${enterpriseTitle}\n팀 전략과제: ${teamTask}\n- 팀 CSF: ${csf}\n- 팀 KPI: ${kpi}\n- 세부 추진과제: ${initiative}\n- 주의: ${cascade.caution}`,
      twoWeekFirstAction: `이번 2주 동안 '${initiative}'를 먼저 실행하고, '${kpi}'로 진행 여부를 확인한다.`,
      pauseActivity: '전사 전략과제와 직접 연결되지 않는 방문 수 늘리기, 장문 보고, 목적 없는 자료 전달은 잠시 줄인다.',
      midCheckQuestion: `이번 주 실행에서 '${csf}'가 보이는 증거는 무엇이고, '${kpi}'로 확인하면 어디가 부족한가요?`,
      finalExecutionStandard: `다음 단계에서는 '${initiative}'를 팀원이 실행할 업무지시로 바꾸고, '${kpi}'와 연결되는 확인 기준을 넣는다.`,
    });
  };

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm md:p-5">
        <p className="text-xs font-black uppercase tracking-wide text-emerald-700">팀 기준 만들기</p>
        <h3 className="mt-1 text-xl font-black text-slate-950">4단계 전사전략을 팀 기준으로 바꾸기</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">4단계에서 선택한 전사 전략과제, 전사 CSF, 전사 KPI를 확인한 뒤 우리 팀의 전략과제, 팀 CSF, 팀 KPI, 세부 추진과제로 내립니다.</p>
      </section>

      <section className="rounded-3xl border border-cyan-100 bg-cyan-50 p-4 text-sm font-bold leading-6 text-cyan-950 shadow-sm md:p-5">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700">4단계에서 가져온 전사 기준</p>
        <h3 className="mt-1 text-lg font-black text-slate-950">{enterpriseTitle}</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-3">
            <p className="font-black text-cyan-900">전사 CSF</p>
            <ul className="mt-2 space-y-1 text-xs">{enterpriseTopic.csfs.map((csf) => <li key={csf}>- {csf}</li>)}</ul>
          </div>
          <div className="rounded-2xl bg-white p-3">
            <p className="font-black text-cyan-900">전사 KPI</p>
            <ul className="mt-2 space-y-1 text-xs">{enterpriseTopic.kpis.map((kpi) => <li key={kpi}>- {kpi}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <Field label="팀 전략과제 보기 4개" help="전사 전략과제를 수행하기 위해 우리 팀이 맡을 수 있는 전략과제 중 하나를 고릅니다.">
          <div className="space-y-2">{cascade.teamTasks.map((teamTaskOption) => <label key={teamTaskOption} className="flex gap-2 rounded-xl bg-white p-2 text-sm font-bold"><input type="radio" checked={selectedTeamTask === teamTaskOption && !state.customTeamTask.trim()} onChange={() => update({ selectedTeamTask: teamTaskOption, customTeamTask: '' })} />{teamTaskOption}</label>)}</div>
        </Field>
        <Field label="우리 팀 전략과제 직접 수정" help="선택한 보기 문장을 우리 팀 언어로 다듬어도 됩니다.">
          <TextArea value={state.customTeamTask} onChange={(value) => update({ customTeamTask: value })} placeholder={selectedTeamTask} />
        </Field>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <h3 className="text-lg font-black text-slate-950">팀 CSF와 팀 KPI 고르기</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Field label="팀 CSF" help="우리 팀 전략과제가 성공하려면 반드시 갖춰져야 할 조건입니다.">
            <div className="space-y-2">{cascade.csfs.map((csf) => <label key={csf} className="flex gap-2 rounded-xl bg-white p-2 text-sm font-bold"><input type="radio" checked={(state.selectedCsf || cascade.csfs[0]) === csf} onChange={() => update({ selectedCsf: csf })} />{csf}</label>)}</div>
          </Field>
          <Field label="팀 KPI" help="팀장이 주간·2주 단위로 볼 수 있는 실행 지표입니다.">
            <div className="space-y-2">{cascade.kpis.map((kpi) => <label key={kpi} className="flex gap-2 rounded-xl bg-white p-2 text-sm font-bold"><input type="radio" checked={(state.selectedKpi || cascade.kpis[0]) === kpi} onChange={() => update({ selectedKpi: kpi })} />{kpi}</label>)}</div>
          </Field>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <h3 className="text-lg font-black text-slate-950">세부 추진과제 고르기</h3>
        <Field label="세부 추진과제" help="팀 전략과제를 실제로 시작하기 위한 추진과제를 고릅니다.">
          <div className="space-y-2">{cascade.initiatives.map((initiative) => <label key={initiative} className="flex gap-2 rounded-xl bg-white p-2 text-sm font-bold"><input type="radio" checked={(state.selectedInitiative || cascade.initiatives[0]) === initiative} onChange={() => update({ selectedInitiative: initiative })} />{initiative}</label>)}</div>
        </Field>
        <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-950">주의: {cascade.caution}</div>
        <button type="button" className="mt-4 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-black text-white" onClick={makeDraft}>팀 기준과 2주 실행계획 만들기</button>
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm md:p-5">
        <h3 className="text-lg font-black text-slate-950">팀 기준과 2주 실행계획</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Field label="팀 기준 초안"><TextArea value={state.teamStandard} onChange={(value) => update({ teamStandard: value })} placeholder="전사 전략과제, 팀 전략과제, 팀 CSF, 팀 KPI, 세부 추진과제를 한 번에 정리합니다." /></Field>
          <Field label="이번 2주 동안 먼저 할 일"><TextArea value={state.twoWeekFirstAction} onChange={(value) => update({ twoWeekFirstAction: value })} placeholder="예: 선택한 세부 추진과제를 먼저 실행하고, 팀 KPI로 진행 여부를 확인한다." /></Field>
          <Field label="이번 2주 동안 잠시 줄일 일"><TextArea value={state.pauseActivity} onChange={(value) => update({ pauseActivity: value })} placeholder="예: 전사 전략과제와 직접 연결되지 않는 활동은 잠시 줄인다." /></Field>
          <Field label="팀장이 중간에 물어볼 확인 질문"><TextArea value={state.midCheckQuestion} onChange={(value) => update({ midCheckQuestion: value })} placeholder="예: 이번 주 실행에서 팀 CSF가 보이는 증거는 무엇인가요?" /></Field>
          <Field label="다음 단계에서 업무지시로 바꿀 기준"><TextArea value={state.finalExecutionStandard} onChange={(value) => update({ finalExecutionStandard: value })} placeholder="예: 세부 추진과제를 팀원이 실행할 업무지시로 바꿀 기준을 정리합니다." /></Field>
        </div>
      </section>
    </section>
  );
}
