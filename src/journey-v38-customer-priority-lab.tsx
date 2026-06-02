import { useMemo, useState } from 'react';

const DECISION_GUIDES = [
  {
    title: '집중 고객군으로 볼 때',
    signal: '긍정 신호가 2개 이상이고, 후속 행동이 2주 안에 가능할 때',
    check: '반응 상승, 자료 요청, 후속 미팅 동의, 높은 잠재력',
    caution: '컴플라이언스 주의 신호가 있으면 표현 안전선을 먼저 확인합니다.',
  },
  {
    title: '후순위 고객군으로 볼 때',
    signal: '주의 신호나 보완 필요가 크고, 지금 밀어붙이면 고객 부담이 커질 때',
    check: '무반응 증가, 접촉 피로, CRM 기록 부족, 컴플라이언스 높음',
    caution: '후순위는 포기가 아니라 접근 강도와 순서를 조절하는 판단입니다.',
  },
  {
    title: '관찰/유지 고객군으로 볼 때',
    signal: '관계는 안정적이지만 변화 신호가 낮아 즉시 집중보다 유지가 적합할 때',
    check: '관계 안정, 자료 요청 없음, 후속 미팅 없음, 추가 필요성 낮음',
    caution: '방치가 되지 않도록 다음 확인 시점과 관찰 기준을 정합니다.',
  },
];

const CUSTOMER_OPTIONS = [
  {
    id: 'G1',
    label: '고객군 후보 1',
    hint: '반응 상승 · 자료 요청 · 후속 가능 · 표현 주의',
    signalMix: '긍정 신호 다수 + 표현 주의',
    recommendedRole: '2주 안에 후속 대화로 연결할 집중 후보',
  },
  {
    id: 'G2',
    label: '고객군 후보 2',
    hint: '관심 보류 · 니즈 재확인 · 속도 조절',
    signalMix: '긍정 신호 + 판단 유보/주의 신호',
    recommendedRole: '압박보다 니즈 재확인이 필요한 관리 후보',
  },
  {
    id: 'G3',
    label: '고객군 후보 3',
    hint: '관계 안정 · 변화 신호 낮음 · 유지 품질',
    signalMix: '관계 긍정 신호 + 변화 신호 낮음',
    recommendedRole: '관계 품질을 유지할 관찰 후보',
  },
  {
    id: 'G4',
    label: '고객군 후보 4',
    hint: '접촉 피로 · 무반응 증가 · 리스크 관리',
    signalMix: '주의 신호 다수 + 보완 필요',
    recommendedRole: '접근 강도와 표현을 줄일 후순위 후보',
  },
  {
    id: 'G5',
    label: '고객군 후보 5',
    hint: '기회 신호 큼 · 후속 가능 · 표현 안전선 중요',
    signalMix: '강한 긍정 신호 + 높은 컴플라이언스 주의',
    recommendedRole: '집중 가능하지만 컴플라이언스 안전선이 중요한 후보',
  },
  {
    id: 'G6',
    label: '고객군 후보 6',
    hint: '데이터 부족 · 정보 보완 · 판단 유보',
    signalMix: '보완 필요 + 판단 유보',
    recommendedRole: '분류보다 정보 보완이 먼저인 후보',
  },
];

const DEFAULT_REASONS = {
  focus: '2주 안에 후속 대화로 이어질 가능성이 높고, 팀장이 실행 우선순위를 명확히 잡아야 하기 때문이다.',
  deprioritized: '접촉 피로, 정보 부족, 또는 컴플라이언스 리스크 때문에 지금은 접근 강도를 낮추거나 보완이 먼저 필요하기 때문이다.',
  watch: '관계는 유지하되 즉시 집중하기보다 반응 변화와 추가 데이터를 관찰하는 편이 적절하기 때문이다.',
};

type PriorityState = {
  focus: string;
  deprioritized: string;
  watch: string;
  focusReason: string;
  deprioritizedReason: string;
  watchReason: string;
};

const INITIAL_STATE: PriorityState = {
  focus: '',
  deprioritized: '',
  watch: '',
  focusReason: '',
  deprioritizedReason: '',
  watchReason: '',
};

export function V38CustomerPriorityLab() {
  const [state, setState] = useState<PriorityState>(INITIAL_STATE);

  const selectedLabels = useMemo(() => ({
    focus: CUSTOMER_OPTIONS.find((item) => item.id === state.focus)?.label ?? '아직 선택되지 않았습니다',
    deprioritized: CUSTOMER_OPTIONS.find((item) => item.id === state.deprioritized)?.label ?? '아직 선택되지 않았습니다',
    watch: CUSTOMER_OPTIONS.find((item) => item.id === state.watch)?.label ?? '아직 선택되지 않았습니다',
  }), [state.focus, state.deprioritized, state.watch]);

  const update = (field: keyof PriorityState, value: string) => {
    setState((current) => ({ ...current, [field]: value }));
  };

  const applyReasonHint = (field: 'focusReason' | 'deprioritizedReason' | 'watchReason', value: string) => {
    setState((current) => ({ ...current, [field]: current[field] || value }));
  };

  return (
    <section className="space-y-4">
      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700">v38 Customer Priority Lab</p>
        <h2 className="mt-2 text-2xl font-black text-slate-950">집중/후순위 고객군 선택하기</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          고객군을 모두 똑같이 관리할 수는 없습니다. 6단계의 Data 평가 라벨을 바탕으로 어디에 집중하고, 어디는 강도를 낮추며, 어디는 관찰 유지할지 선택합니다.
        </p>
      </div>

      <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-5 shadow-sm md:p-6">
        <h3 className="text-lg font-black text-slate-950">선택 기준 먼저 잡기</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
          아래 기준은 정답이 아니라 6단계의 긍정 신호·주의 신호·보완 필요를 7단계 우선순위 판단으로 연결하기 위한 도움말입니다.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {DECISION_GUIDES.map((guide) => (
            <article key={guide.title} className="rounded-2xl border bg-white p-4">
              <p className="font-black text-slate-950">{guide.title}</p>
              <p className="mt-2 text-xs font-black text-cyan-700">기준: {guide.signal}</p>
              <p className="mt-2 text-xs font-bold leading-5 text-slate-700">확인할 신호: {guide.check}</p>
              <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold leading-5 text-slate-600">주의: {guide.caution}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <h3 className="text-lg font-black text-slate-950">선택 전 고객군 신호 다시 보기</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {CUSTOMER_OPTIONS.map((option) => (
            <article key={option.id} className="rounded-2xl border bg-slate-50 p-4">
              <p className="font-black text-slate-900">{option.label}</p>
              <p className="mt-2 text-xs font-bold leading-5 text-slate-600">{option.hint}</p>
              <p className="mt-2 rounded-xl bg-white px-3 py-2 text-xs font-black leading-5 text-slate-700">평가 라벨 조합: {option.signalMix}</p>
              <p className="mt-2 rounded-xl bg-white px-3 py-2 text-xs font-bold leading-5 text-cyan-800">{option.recommendedRole}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <PrioritySelector
          title="집중 고객군"
          description="2주 안에 후속 대화와 실행을 가장 먼저 설계할 고객군입니다."
          value={state.focus}
          reason={state.focusReason}
          reasonPlaceholder="예: 반응 상승과 자료 요청이 있어 2주 안에 후속 대화로 연결할 가능성이 높다."
          onValueChange={(value) => update('focus', value)}
          onReasonChange={(value) => update('focusReason', value)}
          onUseHint={() => applyReasonHint('focusReason', DEFAULT_REASONS.focus)}
        />
        <PrioritySelector
          title="후순위 고객군"
          description="당장 밀어붙이기보다 접근 강도, 정보 보완, 리스크 관리가 먼저인 고객군입니다."
          value={state.deprioritized}
          reason={state.deprioritizedReason}
          reasonPlaceholder="예: 접촉 피로와 컴플라이언스 리스크가 있어 현재는 접근 강도를 낮춰야 한다."
          onValueChange={(value) => update('deprioritized', value)}
          onReasonChange={(value) => update('deprioritizedReason', value)}
          onUseHint={() => applyReasonHint('deprioritizedReason', DEFAULT_REASONS.deprioritized)}
        />
        <PrioritySelector
          title="관찰/유지 고객군"
          description="관계는 유지하되 즉시 집중보다 반응 변화와 추가 데이터를 지켜볼 고객군입니다."
          value={state.watch}
          reason={state.watchReason}
          reasonPlaceholder="예: 관계는 안정적이지만 변화 신호가 낮아 유지 품질 관리가 적합하다."
          onValueChange={(value) => update('watch', value)}
          onReasonChange={(value) => update('watchReason', value)}
          onUseHint={() => applyReasonHint('watchReason', DEFAULT_REASONS.watch)}
        />
      </div>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <h3 className="text-lg font-black text-slate-950">2주 실행 우선순위 요약</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <SummaryCard label="집중" value={selectedLabels.focus} reason={state.focusReason} />
          <SummaryCard label="후순위" value={selectedLabels.deprioritized} reason={state.deprioritizedReason} />
          <SummaryCard label="관찰/유지" value={selectedLabels.watch} reason={state.watchReason} />
        </div>
      </div>
    </section>
  );
}

function PrioritySelector({
  title,
  description,
  value,
  reason,
  reasonPlaceholder,
  onValueChange,
  onReasonChange,
  onUseHint,
}: {
  title: string;
  description: string;
  value: string;
  reason: string;
  reasonPlaceholder: string;
  onValueChange: (value: string) => void;
  onReasonChange: (value: string) => void;
  onUseHint: () => void;
}) {
  return (
    <article className="rounded-3xl border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-black text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <label className="mt-4 block space-y-1">
        <span className="text-xs font-black text-slate-500">고객군 선택</span>
        <select className="min-h-12 w-full rounded-2xl border bg-white px-3 py-2 text-sm font-bold" value={value} onChange={(event) => onValueChange(event.target.value)}>
          <option value="">선택하세요</option>
          {CUSTOMER_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
        </select>
      </label>
      <label className="mt-3 block space-y-1">
        <span className="text-xs font-black text-slate-500">선택 이유</span>
        <textarea className="min-h-32 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={reason} onChange={(event) => onReasonChange(event.target.value)} placeholder={reasonPlaceholder} />
      </label>
      <button type="button" className="mt-3 rounded-2xl border px-4 py-2 text-xs font-black text-slate-700" onClick={onUseHint}>이유 문장 힌트 사용</button>
    </article>
  );
}

function SummaryCard({ label, value, reason }: { label: string; value: string; reason: string }) {
  return (
    <article className="rounded-2xl border bg-slate-50 p-4">
      <p className="text-xs font-black text-cyan-700">{label}</p>
      <p className="mt-1 font-black text-slate-950">{value}</p>
      <p className="mt-2 text-xs font-bold leading-5 text-slate-600">{reason || '아직 이유가 작성되지 않았습니다.'}</p>
    </article>
  );
}
