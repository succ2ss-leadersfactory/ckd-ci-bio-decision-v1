const V39_FINAL_CALL_PLAN_ONE_PAGE_GUIDANCE_SMOKE_MARKERS = [
  'V39FinalCallPlanOnePageGuidance',
  '최종 카드는 보고서가 아니라 1페이지 실행 카드입니다',
  '각 항목은 1~2줄로 작성하세요',
].join('|');
void V39_FINAL_CALL_PLAN_ONE_PAGE_GUIDANCE_SMOKE_MARKERS;

export function V39FinalCallPlanOnePageGuidance() {
  return (
    <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-emerald-700">12단계 작성 가이드</p>
      <h2 className="mt-1 text-xl font-black text-slate-950">최종 카드는 보고서가 아니라 1페이지 실행 카드입니다</h2>
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
          <p className="font-black">분량 기준</p>
          <p className="mt-1">각 항목은 1~2줄로 작성하세요. 길게 쓰기보다 바로 실행할 수 있게 줄입니다.</p>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
          <p className="font-black">반드시 남길 것</p>
          <p className="mt-1">핵심 지표, 집중 고객군, 팀원 업무배분 원칙, 우선 1on1 대상, 첫 문장, 피할 표현입니다.</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
          <p className="font-black">피할 것</p>
          <p className="mt-1">보고서처럼 길게 정리하지 않습니다. 팀 회의와 1on1에서 바로 쓸 문장만 남깁니다.</p>
        </div>
      </div>
    </section>
  );
}
