import { useMemo } from 'react';
import { useStored } from './journey-storage';

const V41_PERFORMANCE_COMPACT_MARKERS = [
  'V41PerformanceCompactCascadeLab',
  'v41 performance cascade lab cloned',
  'v41 performance cascade copy refined',
  '팀 기준 만들기',
  '전사전략을 팀 기준으로 바꾸기',
  'CSF와 KPI 고르기',
  '2주 성과관리 기준 만들기',
  'ckd.v41.performanceCascade.v1',
].join('|');
void V41_PERFORMANCE_COMPACT_MARKERS;

type StrategyOption = {
  id: string;
  title: string;
  teamTask: string;
  csfs: string[];
  kpis: string[];
  caution: string;
};

type PerformanceCascadeState = {
  selectedStrategyId: string;
  customTeamTask: string;
  selectedCsf: string;
  selectedKpi: string;
  teamStandard: string;
  twoWeekFirstAction: string;
  pauseActivity: string;
  midCheckQuestion: string;
  finalExecutionStandard: string;
};

const STORAGE_KEY = 'ckd.v41.performanceCascade.v1';

const STRATEGY_OPTIONS: StrategyOption[] = [
  {
    id: 'record-quality',
    title: '고객 반응과 다음 행동이 보이는 기록 품질 강화',
    teamTask: '활동 기록을 고객 반응, 확인 질문, 다음 행동으로 이어지게 만든다.',
    csfs: ['고객 질문과 반응이 구체적으로 남아야 한다', '기록에 다음 행동이 포함되어야 한다', '팀장이 중간에 기록 샘플을 확인해야 한다'],
    kpis: ['고객 질문 기록률', '후속 행동 포함 기록률', '기록 샘플 점검 건수'],
    caution: '기록량 증가만 성과로 보지 않습니다. 다음 행동으로 이어지는 기록인지 확인합니다.',
  },
  {
    id: 'followup',
    title: '고객 반응 이후 후속조치 실행률 높이기',
    teamTask: '고객 반응 이후 자료 제공, 일정 확인, 내부 지원 요청을 놓치지 않는다.',
    csfs: ['후속 행동이 일정 안에 실행되어야 한다', '지연 사유가 확인되어야 한다', '지원 필요가 팀장에게 올라와야 한다'],
    kpis: ['후속조치 완료율', '후속 지연 사유 기록률', '팀장 지원 요청 건수'],
    caution: '후속조치를 고객 압박이나 처방 유도처럼 표현하지 않습니다.',
  },
  {
    id: 'safe-message',
    title: '승인자료 범위 안에서 안전한 메시지 운영',
    teamTask: '고객 질문에 답할 때 확인 가능한 자료와 말할 수 있는 범위를 구분한다.',
    csfs: ['답변 가능 범위가 정리되어야 한다', '위험 표현을 수정해야 한다', '확인 후 대응하는 루틴이 있어야 한다'],
    kpis: ['위험 표현 수정 건수', '확인 후 대응률', '승인자료 기반 대화율'],
    caution: '경쟁 비교, 과장, 허가 외 사용 암시 표현을 피합니다.',
  },
  {
    id: 'digital-contact',
    title: '디지털·비대면 접점 이후 반응 확인',
    teamTask: '자료 전달 이후 실제 확인, 질문, 다음 논의가 남도록 관리한다.',
    csfs: ['접점 목적이 명확해야 한다', '대체 접점 이후 반응이 확인되어야 한다', '다음 접점 계획이 있어야 한다'],
    kpis: ['자료 제공 후 확인율', '대체 접점 실행률', '다음 접점 계획률'],
    caution: '자료 전달 자체를 성과로 단정하지 않습니다.',
  },
];

const DEFAULT_STATE: PerformanceCascadeState = {
  selectedStrategyId: STRATEGY_OPTIONS[0].id,
  customTeamTask: '',
  selectedCsf: '',
  selectedKpi: '',
  teamStandard: '',
  twoWeekFirstAction: '',
  pauseActivity: '',
  midCheckQuestion: '',
  finalExecutionStandard: '',
};

function selectedStrategy(id: string) {
  return STRATEGY_OPTIONS.find((item) => item.id === id) ?? STRATEGY_OPTIONS[0];
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
  const update = (patch: Partial<PerformanceCascadeState>) => setState({ ...state, ...patch });
  const strategy = useMemo(() => selectedStrategy(state.selectedStrategyId), [state.selectedStrategyId]);
  const teamTask = state.customTeamTask.trim() || strategy.teamTask;

  const makeDraft = () => {
    const csf = state.selectedCsf || strategy.csfs[0];
    const kpi = state.selectedKpi || strategy.kpis[0];
    update({
      teamStandard: `${teamTask}\n- 성공조건: ${csf}\n- 확인지표: ${kpi}\n- 주의: ${strategy.caution}`,
      twoWeekFirstAction: `이번 2주 동안 ${kpi}와 연결되는 고객 반응, 기록, 후속 행동을 먼저 확인한다.`,
      pauseActivity: '성과 기준과 직접 연결되지 않는 장문 보고나 방문 수만 늘리는 활동은 잠시 줄인다.',
      midCheckQuestion: `이번 주 기록에서 ${kpi}와 연결되는 사실은 무엇이고, 아직 부족한 정보는 무엇인가요?`,
      finalExecutionStandard: `${csf}가 보이도록 팀원별 기록과 후속 행동을 금요일 점검에서 확인한다.`,
    });
  };

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm md:p-5">
        <p className="text-xs font-black uppercase tracking-wide text-emerald-700">팀 기준 만들기</p>
        <h3 className="mt-1 text-xl font-black text-slate-950">전사전략을 팀 기준으로 바꾸기</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">큰 전략 문장을 팀원이 볼 수 있는 성공조건, 확인지표, 2주 실행 기준으로 바꿉니다.</p>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <Field label="전략 과제 선택" help="이번 실습에서 팀 기준으로 바꿀 전략 과제를 고릅니다.">
          <select className="w-full rounded-xl border bg-white px-3 py-2" value={state.selectedStrategyId} onChange={(event) => update({ selectedStrategyId: event.target.value, selectedCsf: '', selectedKpi: '' })}>
            {STRATEGY_OPTIONS.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
        </Field>
        <Field label="우리 팀 실행 과제" help="선택 과제를 우리 팀 언어로 바꿔 적습니다.">
          <TextArea value={state.customTeamTask} onChange={(value) => update({ customTeamTask: value })} placeholder={strategy.teamTask} />
        </Field>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <h3 className="text-lg font-black text-slate-950">CSF와 KPI 고르기</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Field label="성공조건 CSF" help="이 기준이 맞으면 실행이 좋아졌다고 볼 수 있는 조건입니다.">
            <div className="space-y-2">{strategy.csfs.map((csf) => <label key={csf} className="flex gap-2 rounded-xl bg-white p-2 text-sm font-bold"><input type="radio" checked={(state.selectedCsf || strategy.csfs[0]) === csf} onChange={() => update({ selectedCsf: csf })} />{csf}</label>)}</div>
          </Field>
          <Field label="확인지표 KPI" help="2주 동안 기록과 행동으로 확인할 수 있는 지표입니다.">
            <div className="space-y-2">{strategy.kpis.map((kpi) => <label key={kpi} className="flex gap-2 rounded-xl bg-white p-2 text-sm font-bold"><input type="radio" checked={(state.selectedKpi || strategy.kpis[0]) === kpi} onChange={() => update({ selectedKpi: kpi })} />{kpi}</label>)}</div>
          </Field>
        </div>
        <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-950">주의: {strategy.caution}</div>
        <button type="button" className="mt-4 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-black text-white" onClick={makeDraft}>2주 성과관리 기준 만들기</button>
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm md:p-5">
        <h3 className="text-lg font-black text-slate-950">2주 성과관리 기준 만들기</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Field label="팀 기준 초안"><TextArea value={state.teamStandard} onChange={(value) => update({ teamStandard: value })} placeholder="성공조건, 확인지표, 주의 표현을 한 번에 정리합니다." /></Field>
          <Field label="이번 2주 동안 먼저 볼 것"><TextArea value={state.twoWeekFirstAction} onChange={(value) => update({ twoWeekFirstAction: value })} placeholder="예: 선택 KPI와 연결되는 고객 질문, 후속 행동, 지원 필요 신호를 먼저 확인한다." /></Field>
          <Field label="이번 2주 동안 잠시 줄일 일"><TextArea value={state.pauseActivity} onChange={(value) => update({ pauseActivity: value })} placeholder="예: KPI와 직접 연결되지 않는 장문 보고는 잠시 줄인다." /></Field>
          <Field label="팀장이 중간에 물어볼 확인 질문"><TextArea value={state.midCheckQuestion} onChange={(value) => update({ midCheckQuestion: value })} placeholder="예: 이번 주 기록에서 확인 가능한 사실과 부족한 정보는 무엇인가요?" /></Field>
          <Field label="다음 단계에서 업무지시로 바꿀 기준"><TextArea value={state.finalExecutionStandard} onChange={(value) => update({ finalExecutionStandard: value })} placeholder="예: 선택 KPI와 연결되는 증거를 금요일 점검에서 확인한다." /></Field>
        </div>
      </section>
    </section>
  );
}
