import { useMemo, useState } from 'react';

const RISK_CATEGORIES = [
  {
    id: 'prescription',
    label: '처방 유도 표현',
    example: '이번에는 반드시 처방으로 이어지게 설득하세요.',
    safe: '고객이 필요 정보를 스스로 검토할 수 있도록 허용된 자료 범위 안에서 질문 중심으로 대화하세요.',
  },
  {
    id: 'comparison',
    label: '비교 우위 단정',
    example: '경쟁 제품보다 효과가 확실히 좋다고 강조하세요.',
    safe: '승인된 근거자료 범위 안에서 확인 가능한 정보만 객관적으로 전달하세요.',
  },
  {
    id: 'offLabel',
    label: '허가 외·미승인 표현',
    example: '허가 범위 밖 활용 가능성도 자연스럽게 언급하세요.',
    safe: '허가사항과 회사가 승인한 자료 범위 안에서만 설명하세요.',
  },
  {
    id: 'sensitive',
    label: '민감정보 포함',
    example: 'A병원 김OO 교수의 최근 처방 변화를 기준으로 접근하세요.',
    safe: '실제 고객명, 병원명, 의료진명, 처방 정보는 제거하고 가상 고객군 수준으로 표현하세요.',
  },
  {
    id: 'overpromise',
    label: '과도한 약속 표현',
    example: '이번 자료를 주면 바로 반응이 바뀔 것이라고 말하세요.',
    safe: '자료 전달 이후 고객의 질문과 반응을 확인하고 다음 행동을 조정하세요.',
  },
];

const SAMPLE_EXPRESSIONS = [
  {
    id: 'S1',
    text: '고객군 후보 5는 기회가 크므로 경쟁 제품보다 우수하다는 점을 강하게 강조해 후속 미팅에서 처방 전환을 유도한다.',
    risks: ['처방 유도 표현', '비교 우위 단정'],
    safe: '고객군 후보 5는 기회 신호가 있으므로 승인된 근거자료 범위 안에서 고객의 질문을 확인하고 후속 미팅에서 필요한 정보를 객관적으로 제공한다.',
  },
  {
    id: 'S2',
    text: '무반응 고객군은 반복 방문으로 압박감을 주더라도 접촉 빈도를 높여 반응을 끌어낸다.',
    risks: ['과도한 약속 표현', '고객 부담 표현'],
    safe: '무반응 고객군은 접촉 강도를 낮추고 고객 부담을 줄이는 방식으로 반응 변화와 추가 정보 필요성을 확인한다.',
  },
  {
    id: 'S3',
    text: 'A병원 특정 의료진의 최근 처방 정보를 바탕으로 맞춤형 콜 전략을 세운다.',
    risks: ['민감정보 포함'],
    safe: '실제 병원명과 의료진명, 처방 정보는 제외하고 가상 고객군의 반응 패턴을 기준으로 콜 전략을 세운다.',
  },
];

type CleanupState = Record<string, {
  selectedRisks: string[];
  revised: string;
}>;

export function V38ComplianceCleanupLab() {
  const [state, setState] = useState<CleanupState>(() => Object.fromEntries(
    SAMPLE_EXPRESSIONS.map((item) => [item.id, { selectedRisks: [], revised: '' }]),
  ));
  const [ownExpression, setOwnExpression] = useState('');
  const [ownSafeExpression, setOwnSafeExpression] = useState('');

  const completedCount = useMemo(
    () => SAMPLE_EXPRESSIONS.filter((item) => state[item.id]?.selectedRisks.length > 0 && state[item.id]?.revised.trim()).length,
    [state],
  );

  const toggleRisk = (sampleId: string, risk: string) => {
    setState((current) => {
      const existing = current[sampleId] ?? { selectedRisks: [], revised: '' };
      const selectedRisks = existing.selectedRisks.includes(risk)
        ? existing.selectedRisks.filter((item) => item !== risk)
        : [...existing.selectedRisks, risk];
      return { ...current, [sampleId]: { ...existing, selectedRisks } };
    });
  };

  const updateRevised = (sampleId: string, value: string) => {
    setState((current) => ({
      ...current,
      [sampleId]: {
        selectedRisks: current[sampleId]?.selectedRisks ?? [],
        revised: value,
      },
    }));
  };

  const useSafeExample = (sampleId: string, safe: string) => {
    setState((current) => ({
      ...current,
      [sampleId]: {
        selectedRisks: current[sampleId]?.selectedRisks ?? [],
        revised: current[sampleId]?.revised || safe,
      },
    }));
  };

  return (
    <section className="space-y-4">
      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700">v38 Compliance Cleanup Lab</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">컴플라이언스 위험 표현 제거</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              AI가 만든 문장은 바로 쓰지 않습니다. 위험 표현을 찾고, 제약영업 안전선에 맞는 표현으로 다시 씁니다.
            </p>
          </div>
          <div className="rounded-2xl bg-cyan-50 px-4 py-3 text-sm font-black text-cyan-800">
            수정 완료 {completedCount} / {SAMPLE_EXPRESSIONS.length}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-950 shadow-sm md:p-6">
        <h3 className="text-lg font-black">위험 표현 유형</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {RISK_CATEGORIES.map((category) => (
            <article key={category.id} className="rounded-2xl bg-white p-4">
              <p className="font-black text-slate-950">{category.label}</p>
              <p className="mt-2 text-xs font-bold leading-5 text-rose-700">위험 예: {category.example}</p>
              <p className="mt-2 text-xs font-bold leading-5 text-emerald-800">안전 방향: {category.safe}</p>
            </article>
          ))}
        </div>
      </div>

      {SAMPLE_EXPRESSIONS.map((sample) => {
        const current = state[sample.id] ?? { selectedRisks: [], revised: '' };
        return (
          <article key={sample.id} className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
            <div className="rounded-2xl bg-rose-50 p-4 text-rose-950">
              <p className="text-xs font-black uppercase tracking-wide">AI 초안 표현</p>
              <p className="mt-2 text-sm font-bold leading-6">{sample.text}</p>
            </div>

            <div className="mt-4">
              <p className="text-sm font-black text-slate-950">위험 유형 선택</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {RISK_CATEGORIES.map((category) => {
                  const checked = current.selectedRisks.includes(category.label);
                  return (
                    <button
                      key={category.id}
                      type="button"
                      className={`rounded-full border px-3 py-2 text-xs font-black ${checked ? 'border-rose-600 bg-rose-50 text-rose-700' : 'bg-white text-slate-700'}`}
                      onClick={() => toggleRisk(sample.id, category.label)}
                    >
                      {checked ? '✓ ' : ''}{category.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs font-bold text-slate-500">추천 위험 유형: {sample.risks.join(' · ')}</p>
            </div>

            <label className="mt-4 block space-y-1">
              <span className="text-xs font-black text-slate-500">안전한 대체 문장</span>
              <textarea
                className="min-h-28 w-full rounded-2xl border px-3 py-2 text-sm leading-6"
                value={current.revised}
                onChange={(event) => updateRevised(sample.id, event.target.value)}
                placeholder="위험 표현을 제거하고, 승인된 자료·질문 중심·가상 고객군 기준으로 다시 작성하세요."
              />
            </label>
            <button type="button" className="mt-3 rounded-2xl border px-4 py-2 text-xs font-black text-slate-700" onClick={() => useSafeExample(sample.id, sample.safe)}>
              안전 표현 예시 사용
            </button>
          </article>
        );
      })}

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <h3 className="text-lg font-black text-slate-950">내 콜플랜 문장 직접 점검</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-black text-slate-500">점검할 문장</span>
            <textarea
              className="min-h-36 w-full rounded-2xl border px-3 py-2 text-sm leading-6"
              value={ownExpression}
              onChange={(event) => setOwnExpression(event.target.value)}
              placeholder="예: 고객군 후보 5에는 강한 메시지로 경쟁 우위를 강조한다."
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-black text-slate-500">안전하게 수정한 문장</span>
            <textarea
              className="min-h-36 w-full rounded-2xl border px-3 py-2 text-sm leading-6"
              value={ownSafeExpression}
              onChange={(event) => setOwnSafeExpression(event.target.value)}
              placeholder="예: 고객군 후보 5에는 승인된 근거자료 범위 안에서 고객 질문을 확인하고 필요한 정보를 객관적으로 제공한다."
            />
          </label>
        </div>
      </div>
    </section>
  );
}
